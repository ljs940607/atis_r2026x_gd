import useSettingsStore from '~/stores/settings';
import { getAppInfos } from '~/api/senders';
import { checkIfIsUrl } from '~/functions/utils';
/**
 * Custom hook for resolving notification actions and icons.
 * @returns {object} An object containing the functions to resolve notification actions and icons.
 */
export function useNotificationResolution() {
  const { getListOfService } = useSettingsStore();
  /**
   * Resolves the notification icon based on the provided notification object.
   * @param {object} notification - The notification object.
   */
  const resolveNotificationIcon = (notification) => {
    const message = notification.MESSAGE;
    if (message.icon) {
      switch (message.icon.type) {
        case 'appID':
          getAppInfos({ appID: message.icon.data, notifID: notification.ID, clusterId: notification.CLUSTER_ID });
          message.icon['isLink'] = false;
          break;
        case 'login':
        case 'url':
          message.icon['src'] = getIconUrl({ icon: message.icon, platformId: notification.PLATFORMID });
          message.icon['isLink'] = true;
          break;
        default: //undefined
          message.icon['src'] = './../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png';
          message.icon['isLink'] = false;
          break;
      }
    }
    // added this because
    else {
      message['icon'] = {
        src: './../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png',
        isLink: false,
      };
    }
    notification.MESSAGE = message;
  };

  /**
   * Resolves the notification action by updating the event options with the appropriate URL and CSRF token.
   * @param {object} notification - The notification object.
   */
  const resolveNotificationAction = (notification) => {
    const message = notification.MESSAGE;

    if (message.actions) {
      for (let i = 0; i < message.actions.length; i++) {
        let action = message.actions[i];
        if (
          action.options &&
          action.options.event &&
          (action.options.event.type === 'url' || action.options.event.type === 'UI')
        ) {
          let event = action.options.event;
          if (action.options && action.options.event && action.options.event.type === 'UI') {
            let eventUI = action.options.event.options;
            if (eventUI.attachments && eventUI.attachments.length > 0) {
              for (let y = 0; y < eventUI.attachments.length; y++) {
                if (eventUI.attachments[y].type === 'button') {
                  event = eventUI.attachments[y].options.event;
                }
              }
            }
          }
          if (event.options && event.options.service && event.options.uri) {
            let url = getServiceUrl({ name: event.options.service, platformId: notification.PLATFORMID });
            event.options.url = url + event.options.uri;

            if (notification.APPID === 'USASWYM_AP') {
              event.options.csrf = url + '/api/index/tk/';
            }
          } else if (action.type === 'select' && event.options && event.options.length > 0) {
            for (let k = 0; k < event.options.length; k++) {
              let url = getServiceUrl({ name: event.options[k].service, platformId: notification.PLATFORMID });
              event.options[k].url = url + event.options[k].uri;

              if (notification.APPID === 'USASWYM_AP') {
                event.options[k].csrf = url + '/api/index/tk/';
              }
            }
          }
        }
      }
    }

    notification.MESSAGE = message;
  };

  /**
   * Retrieves the URL for an icon based on the provided data and list of services.
   * @param {object} data - The data object containing information about the icon.
   * @param {Array} getListOfService() - The list of services.
   * @returns {string|undefined} The URL of the icon, or undefined if no URL is found.
   */
  const getIconUrl = (data) => {
    let url;
    switch (data.icon.type) {
      case 'url':
        if (typeof data.icon.data === 'object') {
          if (data.platformId && data.platformId !== 'null') {
            url = getServiceUrl({ name: data.icon.data.service, platformId: data.platformId });
          } else {
            if (!data.icon.data.service) {
              if (checkIfIsUrl(data.icon.data)) {
                return data.icon.data;
              } else {
                return './../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png';
              }
            } else {
              for (let letiable in getListOfService()[0]) {
                if (data.icon.data.service.toLowerCase() === letiable.toLowerCase()) {
                  return getListOfService()[0][letiable] + data.icon.data.uri;
                }
              }
            }
          }
        } else {
          return data.icon.data;
        }
        if (url) return url + data.icon.data.uri;
        /*
      for (let s in getListOfService()[0]){
        if (icon.data.service.toLowerCase() === s.toLowerCase())
          return getListOfService()[0][s] + icon.data.uri;
      }
      */
        return undefined;
      case 'login':
        //let pathPictureUser = urlSwym + '/api/user/getpicture/login/' + login + '/format';

        url = getServiceUrl({ name: '3dswym', platformId: data.platformId });
        // eslint-disable-next-line no-case-declarations
        let swymApi;
        if (url === '/') swymApi = 'api/user/getpicture/login/';
        else swymApi = '/api/user/getpicture/login/';

        return url + swymApi + data.icon.data;
      case 'app':
        getAppInfos({ id: data.icon.data });
        return undefined;
    }
  };

  /**
   * Retrieves the service URL based on the provided service and list of services.
   * @param {object} service - The service object containing platformId and name properties.
   * @param {Array} getListOfService() - The list of services to search through.
   * @returns {string|undefined} - The service URL if found, otherwise undefined.
   */
  const getServiceUrl = (service) => {
    for (let i = 0; i < getListOfService().length; i++) {
      if (service.platformId) {
        if (getListOfService()[i].platformid.toLowerCase() === service.platformId.toLowerCase()) {
          if (getListOfService()[i][service.name.toLowerCase()])
            return getListOfService()[i][service.name.toLowerCase()];
          else {
            if (!getListOfService()[i][service.name.toLowerCase()] && service.name.toLowerCase() === '3ddashboard') {
              for (let j = 0; j < getListOfService().length; j++) {
                if (getListOfService()[j][service.platformId.toLowerCase()])
                  return getListOfService()[j][service.name.toLowerCase()];
              }
            }
          }
        }
      } else {
        return getListOfService()[i][service.name.toLowerCase()]
          ? getListOfService()[i][service.name.toLowerCase()]
          : getListOfService()[i + 1]
            ? getListOfService()[i + 1][service.name.toLowerCase()]
            : undefined;
      }
    }
    if (getListOfService().length > 0) {
      return getListOfService()[0][service.name.toLowerCase()];
    }

    return undefined;
  };

  return {
    resolveNotificationAction,
    resolveNotificationIcon,
    getIconUrl,
    getServiceUrl,
  };
}
