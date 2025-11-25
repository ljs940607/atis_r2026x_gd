import { notificationRead, publish } from '~/api/senders';
import useTranslations from '~/composables/useTranslations';
import { useUWA } from '~/composables/useUWA';
import mobileDevice from '~/functions/device';
import { Notification } from '~/models/notification';
import {
  getCompassData,
  getI3DXCompassPlatformServices,
  getOpenWith,
  getPlatformAPI,
  getTransientWidget,
  getWAFData,
} from '~/modules/imports';
import useNotificationsStore from '~/stores/notifications';
import useFilterStore from '~/stores/filter';
import { getMerge } from '../../api/senders';
import { NotificationTrackerUsage } from '../../api/tracker';
import useSettingsStore from '../../stores/settings';
import { usePreferencesManagement } from '../preferences/usePreferencesManagement';

const { $i18n } = useTranslations();

/** Cache of apps info. */
const apps = [];

/**
 * For web-in-web, strictly replace window.parent, window.top, top.
*/
const myWindowParent = window.dsDashboardWindow?.parent || window.parent;
const myWindowTop = window.dsDashboardWindow?.top || window.top;
const myTop = window.dsDashboardWindow?.top || top;

/**
 * Check addinmode value.
 */
async function isWebInWinContext() {
  // todo get addinmode from options passed to Center at loading
  const CompassData = await getCompassData();
  const addinmode =
    (CompassData && CompassData.addinMode && CompassData.addinMode.value) ||
    (typeof window.widget !== 'undefined' && typeof window.widget.getValue === 'function'
      ? window.widget.getValue('addinmode')
      : window.addinmode) ||
    '';
  return (
    addinmode === 'solidworks' ||
    addinmode === 'catiav5' ||
    myWindowParent.document.location.search.includes('addinmode=solidworks') ||
    myWindowParent.document.location.search.includes('addinmode=catiav5')
  );
}

/**
 * Custom hook for handling notification actions.
 * @returns {object} An object containing various notification action functions.
 */
export function useNotificationActions() {
  //
  const { UWA } = useUWA();

  /**
   * Opens the icon URL.
   * @param {string} icon - The icon URL to open.
   */
  // this is an old code that is edited to work with the current implementation
  const openIconUrl = async (icon) => {
    let imgUrl = icon && decodeURIComponent(icon);
    let loginExists = imgUrl.includes('login/');
    let loginId, baseSwymUrl, baseUrl;

    if (loginExists) {
      try {
        loginId = imgUrl.split('login/')[1].split('/')[0];
      } catch (e) {
        console.error(e);
      }
    }
    if (!loginId) return;
    let login;
    let tenant;
    let matches = window.location.href.match(/https:\/\/([A-z0-9]+)-([A-z0-9]+)-[A-z0-9]+(-|.)/);
    if (matches && matches.length == 4 && (matches[3] == '-' || (matches[1] && matches[1].length > 4))) {
      tenant = matches[1];
      tenant = tenant.toUpperCase();
    }
    if (myWindowParent.ds.env === '3DSwym') {
      let notifAvatarSrc = decodeURIComponent(icon);
      let notifIconLogin = notifAvatarSrc.includes('login');
      if (notifIconLogin) {
        login = notifAvatarSrc.split('login/')[1].split('/')[0];
      }
      //
      const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
      i3DXCompassPlatformServices.getServiceUrl({
        serviceName: '3DSwym',
        platformId: tenant,
        onComplete: function (dataUrl) {
          if (typeof dataUrl === 'object') {
            baseSwymUrl = dataUrl[0].url;
          } else if (typeof dataUrl === 'string') {
            baseSwymUrl = dataUrl;
          }

          baseUrl = baseSwymUrl + '/#people:' + login + '/activities';
          myWindowParent.location.href = baseUrl;
        },
      });
    } else {
      let appKey = 'X3DPRFL_AP';
      let appTitle = 'My Profile';
      let appData = {
        login: loginId,
        url: baseUrl,
        x3dPlatformId: tenant,
      };

      //showWidget function call in case of 3DD :
      const TransientWidget = await getTransientWidget();
      let Transient =
        window !== myTop && myTop.require ? myWindowTop.require('DS/TransientWidget/TransientWidget') : TransientWidget;
      Transient.showWidget(appKey, appTitle, appData);
    }
  };

  /**
   * Return the url parsed object.
   * @param {string} href - Link to parse.
   * @returns Parsed object.
   */
  const getLocation = (href) => {
    if (!href) return;
    let match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return (
      match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7],
      }
    );
  };

  /**
   * Gets the service for notification.
   * @param {*} urlInfos
   * @returns
   */
  const getServiceForNotification = (urlInfos) => {
    if (!urlInfos) return;
    let regExpMatch;
    if (urlInfos && urlInfos.search) {
      regExpMatch = urlInfos.search.match(/.*&serviceForNotification=([^&]*)/);
    }
    if (regExpMatch && regExpMatch[1]) {
      return regExpMatch[1].toLowerCase();
    }
  };

  /**
   * Checks if the given URLs are from the same service.
   * @param {*} url1
   * @param {*} url2
   * @returns
   */
  const isSameService = async (url1, url2) => {
    return UWA.Utils.matchUrl(url1, url2);
  };

  /**
   * Opens the notification.
   * @param {*} url
   * @param {*} notifOptions
   * @param {*} _openInNewTab
   * @returns
   */
  const openNotification = async (url, notifOptions, _openInNewTab = false) => {
    const PlatformAPI = await getPlatformAPI();
    if (!url)
      return console.error('[NotificationCenter openNotification] No url to navigate.');
    
    if (_openInNewTab || !notifOptions.platformId) {
      return openInNewTab(url);
    }
    
    let currentPlatformId = notifOptions.currentTenant || PlatformAPI.getTenant();
    if (!currentPlatformId) {
      const getTenant = (href) => {
        const match = href.match(/^([A-z0-9]+)([-]|[.])(.*)$/);
        return (
          match && {
            platformId: match[1],
          }
        );
      };
      const hostInfos = getTenant(myWindowParent.location.host);
      if (hostInfos && hostInfos.platformId) currentPlatformId = hostInfos.platformId;
      else {
        console.warn('[NotificationCenter openNotification] Unknown current tenant.');
        return openInNewTab(url);
      }
    }

    let urlInfos = getLocation(url);
    /* IF current tenant = notif tenant. */
    if (notifOptions.platformId.toLowerCase() === currentPlatformId?.toLowerCase()) {
      /* IF current service = notif service. */
      const currentApp = notifOptions.appName && notifOptions.appName.toLowerCase();
      const serviceForNotification = getServiceForNotification(urlInfos);
      const sameService = await isSameService(url, myWindowParent.location);
      if (sameService || serviceForNotification === currentApp) {
        /* IF current service != ifwe OR (current service = ifwe AND no app in transient mode AND app is transient openable). */
        let isDashboard =
          currentApp === '3ddashboard' ||
          (urlInfos.host && urlInfos.host.contains('ifwe') && !urlInfos.host.contains('ifweloop'));
        const TransientWidget = await getTransientWidget();
        const Transient =
          window !== myTop && myTop.require
            ? myWindowTop.require('DS/TransientWidget/TransientWidget')
            : TransientWidget;
        let hasTransientApp = Transient.isWidgetOpen();
        let isTransientOpenable =
          (urlInfos && urlInfos.hash && urlInfos.hash.contains('app')) || serviceForNotification === currentApp;
        // remove !isDashboard if we want to always open in new tab or open in transient
        if (!isDashboard || (isDashboard && !hasTransientApp && isTransientOpenable)) {
          return openInSameTab(url, notifOptions, myWindowParent.location.hash);
        }
      /* ELSE IF notif.service = swym && current service = m3de || native app. */
      } else {
        let isNotifFromSwym = notifOptions.provider == 'USASWYM_AP';
        let isMy3DExperience =
          currentApp === 'my3dexperience' || (urlInfos.host && urlInfos.host.contains('my3dexperience'));
        let isNativeApp = mobileDevice || ['localhost', '127.0.0.1', '', '::1'].includes(window.location.hostname);
        if (isNotifFromSwym && (isMy3DExperience || isNativeApp)) {
          return openInSameTab(url, notifOptions, myWindowParent.location.hash);
        }
      }
    }

    if (notifOptions.provider === 'X3DOPMR_AP' && notifOptions.platformId) {
      url = url + '/content:x3dPlatformId=' + notifOptions.platformId.trim();
    }
    return openInNewTab(url);
  };

  /**
   * Opens the given URL in the same tab.
   * @param {*} url
   * @param {*} notifOptions
   * @param {*} hash
   */
  const openInSameTab = async (url, notifOptions, hash) => {
    const PlatformAPI = await getPlatformAPI();
    const urlInfos = getLocation(url);
    /* IF already on correct url, refresh. */
    if (urlInfos.hash === hash) {
      if (url.contains('ifweloop') || url.contains('innovate') || url.contains('engineering')) {
        myWindowParent.document.location.href = url;
        // that.closeNotifIfMobile();
      } else {
        PlatformAPI.publish('common.3DNotification.topic', {
          action: 'refresh',
          data: {
            url: url,
          },
        });
      }
      /* ELSE navigate to correct url. */
    } else {
      let platformId = notifOptions.platformId;
      /* Code for Platform Roles. */
      if (notifOptions.provider === 'X3DOPMR_AP' && platformId) {
        if (myWindowParent.document.location.hash.contains('app:X3DOPMR_AP')) {
          //
          let urlPlatform = UWA.Utils.getQueryString(myWindowParent.document.location.hash, 'content:x3dPlatformId');
          if (urlPlatform)
            myWindowParent.document.location.hash = myWindowParent.document.location.hash.replace(
              urlPlatform,
              platformId.trim()
            );
          else
            myWindowParent.document.location.hash =
              myWindowParent.document.location.hash + '/content:x3dPlatformId=' + platformId.trim();
        } else {
          myWindowParent.document.location.hash = urlInfos.hash + '/content:x3dPlatformId=' + platformId.trim();
        }
      } else {
        /* IF Swym notif, we are in 3DSwym or M3DE. */
        if (notifOptions.provider == 'USASWYM_AP') {
          PlatformAPI.publish('common.3DNotification.topic', {
            action: 'refresh',
            data: {
              url: url,
            },
          });
          /* ELSE Change hash to navigate (transient app in 3DDashboard). */
        } else {
          if (urlInfos.hash && urlInfos.hash !== '') myWindowParent.document.location.hash = urlInfos.hash;
          else if (urlInfos.search && urlInfos.search !== '')
            myWindowParent.document.location.hash = `app:${notifOptions.provider}/content:${urlInfos.search}`;
          else myWindowParent.document.location.hash = urlInfos.hash;
        }
      }
      // that.closeNotifIfMobile();
    }
  };

  /**
   * Opens the given URL in a new tab.
   * @param {*} url
   * @returns
   */
  const openInNewTab = (url) => {
    if (!url) return;
    return window.open(url, '_blank');
  };

  /**
   * Updates the actioned label of a notification.
   * @param {Notification} notification - The notification object.
   * @param {string} label - The label to update.
   * @param {boolean} flag - The flag indicating whether the notification is flagged.
   */
  const updateActionedLabel = async (notification, label, flag) => {
    if (notification.isGroup) {
      label = $i18n('groupActionLabel');
    } else if (label && label.toString().indexOf('NLS') != -1) {
      if (label === 'NLS.actionLabel') {
        label = $i18n('actionLabel');
      } else label = $i18n('actionFailed');
      // eval not safe
      // label = eval(label);
    } else if (flag && parseInt(notification.SHARED) === 1) {
      const PlatformAPI = await getPlatformAPI();
      let actor = ' (by ' + PlatformAPI.getUser().login + ')';
      if (label) label = label + actor;
    } else {
      if (notification.ACTOR_DATA) label = label + ' (by ' + notification.ACTOR_DATA + ')';
    }
    notification.ACTION = label || $i18n('actionLabel');
  };

  /**
   * Checks if the action is valid.
   * @param {*} action
   * @returns
   */
  const checkAction = (action) => {
    if (action.options && action.options.event && action.options.event.type) return true; // select action
    if (action.type) return true; // button action
    else return false;
  };

  /**
   * Notification csrf action.
   * @param {*} notification
   * @param {*} options
   * @param {*} action_label
   */
  const csrf = async (notification, options, action_label) => {
    const WAFData = await getWAFData();
    if (options && options.csrf) {
      WAFData.authenticatedRequest(options.csrf, {
        method: 'GET',
        data: options.params,
        onComplete: function (evt) {
          UWA.log('Notification csrf Action Completed !');
          let rep;
          try {
            rep = JSON.parse(evt);
          } catch (e) {
            UWA.log('Notification Csrf Action Error for json parse' + e);
            updateActionedLabel(notification, $i18n('actionFailed'), false);
          }
          if (rep) {
            options.headers = { 'X-DS-SWYM-CSRFTOKEN': rep.result.ServerToken };
            post(notification, options, action_label);
          }
        },
      });
    } else {
      UWA.log('Notification Csrf Action Failed some parameters are missing !');
    }
  };

  /**
   * Notificaion post action.
   * @param {*} notification
   * @param {*} options
   * @param {*} action_label
   * @returns
   */
  const post = async (notification, options, action_label) => {
    const WAFData = await getWAFData();
    if (!options || !options.url) {
      return UWA.log('Notification Post Failed some parameters are missing !');
    }
    WAFData.authenticatedRequest(options.url, {
      method: 'POST',
      data: options.params,
      headers: options.headers,
      onComplete: function (res) {
        UWA.log('Notification Post Action Completed !');
        let temp;
        if (res) {
          try {
            temp = JSON.parse(res);
          } catch (e) {
            UWA.log('Notification post Action Error for json parse' + e);
            updateActionedLabel(notification, $i18n('actionFailed'), false);
          }
        }
        action_label =
          temp && temp.result && temp.result.success ? action_label || 'NLS.actionLabel' : 'NLS.actionFailed';
        // this is going to update the actioned label to show accepted or denied
        updateActionedLabel(notification, action_label, false);

        if (!notification.isRead) {
          if (notification.isGroup) {
            //
            notificationRead({
              action: 'notificationRead',
              id: notification.ID,
              groupID: notification.GROUPID,
              hiddenMerged: true,
              read: true,
              clusterId: notification.CLUSTER_ID,
            });
          } else {
            notificationRead({
              action: 'notificationRead',
              id: notification.ID,
              read: true,
              clusterId: notification.CLUSTER_ID,
            });
          }
        }

        notificationRead({
          action: 'actioned',
          clusterId: notification.CLUSTER_ID,
          params: { isMerge: notification.isMerge, id: notification.ID, actioned: true },
        });

        notificationRead({
          action: 'notificationRead',
          updateLabel: 'updateLabel',
          clusterId: notification.CLUSTER_ID,
          params: {
            isMerge: notification.isMerge,
            flag: false,
            id: notification.ID,
            label: temp && temp.result && temp.result.success ? 'NLS.actionLabel' : 'NLS.actionFailed',
          },
        });
        //
        // if (that.isMerge) {
        //   that.model.dispatchEvent('buttonLabelforMainMerge', {});
        // }
      },
      onFailure: function (evt) {
        UWA.log('Notification Post Action Failed !');
        updateActionedLabel(notification, $i18n('actionFailed'), false);
        // that.model.dispatchEvent('updateLabel', [{ id: that.model.get('id'), label: 'NLS.actionFailed', flag: false }]);

        // if (that.isMerge) {
        //   that.model.dispatchEvent('buttonLabelforMainMerge', {});
        // }
      },
    });
  };

  /**
   * Gets the app info.
   * @param {string} appId The app ID (e.g. 'USASWYM_APP' for 3DSwym).
   * @param {string} platformId The platform ID (e.g. 'DSEXT001').
   * @returns The app info.
   */
  const getAppInfo = async (appId, platformId) => {
    if (!appId || !platformId) return;
    let appInfo = apps[appId]?.platforms[platformId];
    if (appInfo) return appInfo;
    else {
      const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
      await new Promise((resolve, reject) =>
        i3DXCompassPlatformServices.getAppInfo({
          appId: appId,
          onComplete: function (app) {
            UWA.log(app);
            if (!app) return;
            apps[appId] = {};
            apps[appId].platforms = [];
            if (!app.platforms) return;
            // single tenant
            if (app.platforms.length === 0 && app.platformId) {
              apps[appId].platforms[app.platformId] = {
                serviceId: app.serviceId,
                url: app.launchUrl,
              };
            } else {
              // multitenant case
              for (const platform of app.platforms) {
                apps[appId].platforms[platform.id] = {
                  serviceId: app.serviceId,
                  url: platform.launchUrl,
                };
              }
            }
            resolve();
          },
          onError: function (error) {
            reject(error);
          },
        })
      );
    }
    return apps[appId]?.platforms[platformId];
  };

  /**
   * Activates the notification get action.
   * @param {import('../../models/notification')} notification - Notification.
   * @param {{appID: string, url?: string, uri?: string, service?: string, type: 'GET', csrf?: string}} eventOptions - Navigation data.
   * @param {boolean} [_openInNewTab] - If true, force opening in new tab. Default to false.
   * @param {{appName: string, options: Object, platformId: string, provider: string}} notifOptions - Additional data for navigation.
   */
  const activateGetAction = async (notification, eventOptions, _openInNewTab = false, notifOptions) => {
    if (!eventOptions || (!eventOptions.url && !eventOptions.uri)) return;
    let url = eventOptions.url;

    // Always open in same tab when addinmode.
    try {
      const addinmode = await isWebInWinContext();
      if (addinmode && !_openInNewTab) {
        let hash = eventOptions.uri.charAt(0) === '/' ? eventOptions.uri.slice(1) : eventOptions.uri;
        if (!hash && url) {
          const urlInfos = getLocation(url);
          if (urlInfos.hash && urlInfos.hash !== '') hash = urlInfos.hash;
          else if (urlInfos.search && urlInfos.search !== '')
            hash = `app:${notification.APPID}/content:${urlInfos.search}`;
        }
        if (hash && hash !== '') return (myWindowParent.document.location.hash = hash);
        // else continue
      }
    } catch (error) {
      console.error(`[NotificationCenter activateGetAction] Failed to get addinmode value: ${error}`);
    }

    const urlInfos = getLocation(url);
    const isNotifFromSwym = notification.APPID === 'USASWYM_AP';
    const isNativeApp = mobileDevice || ['localhost', '127.0.0.1', '', '::1'].includes(window.location.hostname);

    /* Desktop / Mobile app: 3DSwym => open in app, else => open in new tab. */
    if (isNativeApp) {
      if (isNotifFromSwym && !_openInNewTab) {
        let uri = eventOptions.uri ?? (urlInfos && urlInfos.hash);
        if (uri) {
          url = window.location.origin + '/' + uri;
          openNotification(url, notifOptions, _openInNewTab);
        }
      }
      _openInNewTab = true;
    }

    /* Browser. */
    if (isNotifFromSwym) {
      // 3DSwym / M3DE specific : If url is missing or does NOT already navigate to 3DSwym/M3DE standalone,
      // try to get build url by getting 3DSwym standalone url from Compass.
      if (!urlInfos || !urlInfos.host || (!urlInfos.host.includes('3dswym') && !urlInfos.host.includes('my3dexperience'))) {
        const platformId = notification.PLATFORMID;
        if (!platformId)
          return console.error('[NotificationCenter activateGetAction] Navigation aborted - Missing tenant and url in notification.');
        const appInfo = await getAppInfo(notification.APPID, platformId);
        if (appInfo && appInfo.url) {
          url = appInfo.url + eventOptions.uri;
        } else {
          const i3DXCompassPlatformServices = await getI3DXCompassPlatformServices();
          await new Promise((resolve) => i3DXCompassPlatformServices.getServiceUrl({
            serviceName: '3DSwym',
            platformId: platformId,
            onComplete: function (dataUrl) {
              if (typeof dataUrl === 'object') url = dataUrl[0].url + eventOptions.uri;
              else if (typeof dataUrl === 'string') url = dataUrl + eventOptions.uri;
              resolve();
            },
          })).catch((reason) => console.warn(`[NotificationCenter activateGetAction] Failed to get 3DSwym url: ${reason}`));
        }
      }
      if (!url)
        return console.error('[NotificationCenter activateGetAction] Navigation aborted - Empty url.');
      openNotification(url, notifOptions, _openInNewTab);
    } else {
      if (!url) {
        // If url is missing, build url with uri.
        const platformId = notification.PLATFORMID;
        if (!platformId)
          return console.error('[NotificationCenter activateGetAction] Navigation aborted - Missing tenant and url in notification.');
        
        const appInfo = await getAppInfo(notification.APPID, platformId);
        if (!appInfo || !appInfo.url)
          return console.error('[NotificationCenter activateGetAction] Navigation aborted - Failed to build url.');
        url = appInfo.url + eventOptions.uri;
      }
      if (!url)
        return console.error('[NotificationCenter activateGetAction] Navigation aborted - Empty url.');
      openNotification(url, notifOptions, _openInNewTab);
    }

    // todo: handle case merge fetched and not fetched
    // the line below is insufficiant
    if (!notification.isRead) {
      if (notification.isGroup) {
        notificationRead({
          action: 'notificationRead',
          id: notification.ID,
          groupID: notification.GROUPID,
          hiddenMerged: true,
          read: true,
          clusterId: notification.CLUSTER_ID,
        });
      } else {
        notificationRead({
          action: 'notificationRead',
          id: notification.ID,
          read: true,
          clusterId: notification.CLUSTER_ID,
        });
      }

      notificationRead({
        action: 'actioned',
        clusterId: notification.CLUSTER_ID,
        params: { id: notification.ID, actioned: true, isMerge: notification.isMerge },
      });
    }
  };

  /**
   * Activates the notification post action.
   * @param {*} notification
   * @param {*} eventOptions
   * @param {*} action_label
   * @returns
   */
  const activatePostAction = (notification, eventOptions, action_label) => {
    if (!eventOptions || !eventOptions.url) return;
    if (eventOptions.csrf) {
      csrf(
        notification,
        {
          csrf: eventOptions.csrf,
          url: eventOptions.url,
          params: eventOptions.options && eventOptions.options.data ? eventOptions.options.data : undefined,
          headers: eventOptions.options && eventOptions.options.headers ? eventOptions.options.headers : undefined,
        },
        action_label
      );
    } else {
      post(
        notification,
        {
          url: eventOptions.url,
          params: eventOptions.options && eventOptions.options.data ? eventOptions.options.data : undefined,
          headers: eventOptions.options && eventOptions.options.headers ? eventOptions.options.headers : undefined,
        },
        action_label
      );
    }
  };

  /**
   * Checks if the notification has a URL action.
   * @param {*} options
   * @returns
   */
  const checkUrlAction = (options) => {
    if (options.event.options && options.event.options.type) return true;
    else return false;
  };

  /**
   * Activates the notification link action.
   * @param {*} notification
   * @param {*} notifOptions
   * @param {*} _openInNewTab
   * @returns
   */
  const activateLinkAction = (notification, notifOptions, _openInNewTab) => {
    if (!checkUrlAction(notifOptions.options)) return;
    let eventOptions = notifOptions.options.event.options;
    let action_label = notifOptions.options.actioned_label;
    eventOptions.appID = notifOptions.provider;
    if (eventOptions.type === 'GET') {
      activateGetAction(notification, eventOptions, _openInNewTab, notifOptions);
    } else if (eventOptions.type === 'POST') {
      activatePostAction(notification, eventOptions, action_label);
    }
  };

  /**
   *  Handles the notification link action.
   * @param {*} notification
   * @param {*} notifOptions
   * @param {*} _openInNewTab
   */
  const linkClickAction = (notification, notifOptions, _openInNewTab) => {
    activateLinkAction(notification, notifOptions, _openInNewTab);
  };

  /**
   * Calls the event based on the notification type.
   * @param {*} notification
   * @param {*} options
   */
  const callEvent = (notification, options) => {
    // add additional properties to the action
    // todo: why ???
    // is the notification actionned ?
    options.action['isActioned'] = notification.isActioned;
    // check if the action is valid or it's a subAction (eg: select)
    if (checkAction(options.action) || options.subAction) {
      //
      if (options.type === 'UI' || options.type === 'url') {
        url(notification, options.action);
      } else {
        bus(notification, options.action);
      }
    }
  };

  /**
   *  Handles the notification url action.
   * @param {*} notification
   * @param {*} notifOptions
   * @returns
   */
  const url = (notification, notifOptions) => {
    // notifOptions = action with additional properties
    if (notifOptions.type === 'POST') {
      activatePostAction(notification, notifOptions, notifOptions.actioned_label);
    } else {
      if (!notifOptions || !notifOptions.type || !notifOptions.options) return;
      if (notifOptions.type === 'link') {
        let _openInNewTab = false;
        if (notifOptions.appName)
          _openInNewTab = !(
            notifOptions.appName == '3ddashboard' ||
            notifOptions.appName == '3dswym' ||
            notifOptions.appName == 'my3dexperience' ||
            notifOptions.appName == 'ifweloop'
          );
        linkClickAction(notification, notifOptions, _openInNewTab);
        return;
      }
      if (notifOptions.type === 'button') {
        if (notifOptions.isActioned) return;
        // let elem = 1;
        //TODO improve below event propogation with dispatchEvent
        if (notifOptions.options.event.type === 'UI' && notifOptions.options.event.options) {
          let options = notifOptions.options.event.options;
          options.attachments.forEach(function (attachment) {
            if (attachment.type === 'button') {
              if (attachment.options && attachment.options.event && attachment.options.event.options) {
                attachment.options.event.options.options = {};
                const denyReasons = { value: notifOptions.reason.reason, reference: notifOptions.reason.reference };
                attachment.options.event.options.options.data = [denyReasons];

                // attachment.options.event.options.data = notifOptions.reason;

                !attachment
                  ? activateLinkAction(notification, notifOptions)
                  : activateLinkAction(notification, attachment);
              }
            }
          });
        } else {
          activateLinkAction(notification, notifOptions);
        }
      }
    }
  };

  /**
   * Retrieves the event options from the given option object.
   * @param {object} option - The option object.
   * @returns {object | undefined} - The event options containing the topic and data properties, or undefined if the options are missing or invalid.
   */
  const getEventOptions = (option) => {
    if (option && option.event && option.event.options) {
      let options = option.event.options;
      if (options.topic && options.data) {
        return {
          topic: options.topic,
          data: options.data,
        };
      } else {
        UWA.log('3DNotification Error eventOptions missing topic or data');
      }
    } else {
      UWA.log('3DNotification Error eventOptions');
    }
  };

  /**
   *  Handles the notification bus event.
   * @param {*} notification
   * @param {*} notifOptions
   * @returns
   */
  const bus = (notification, notifOptions) => {
    if (!notifOptions || !notifOptions.type || !notifOptions.options) return;
    let eventOptions = getEventOptions(notifOptions.options);
    if (!eventOptions) return;
    if (notifOptions.type === 'link') {
      // publish the event
      publish({ topic: eventOptions.topic, data: eventOptions.data });
      // read the notification
      if (!notification.isRead) {
        if (notification.isGroup) {
          //
          notificationRead({
            action: 'notificationRead',
            id: notification.ID,
            groupID: notification.GROUPID,
            hiddenMerged: true,
            read: true,
            clusterId: notification.CLUSTER_ID,
          });
        } else {
          notificationRead({
            action: 'notificationRead',
            id: notification.ID,
            read: true,
            clusterId: notification.CLUSTER_ID,
          });
        }
      }
      //   if (that.getCenterState()) {
      //     that.setReadstate(true);
      //   } else {
      //     that.close({ decrementFlag: true });
      //   }
    } else if (notifOptions.type === 'button') {
      if (eventOptions.data && eventOptions.data.action == 'rollback') {
        eventOptions.data.id = notification.ID;
      }
      if (!notification.isActioned) {
        publish({ topic: eventOptions.topic, data: eventOptions.data });
        if (!notification.isRead) {
          if (notification.isGroup) {
            //
            notificationRead({
              action: 'notificationRead',
              id: notification.ID,
              groupID: notification.GROUPID,
              hiddenMerged: true,
              read: true,
              clusterId: notification.CLUSTER_ID,
            });
          } else {
            notificationRead({
              action: 'notificationRead',
              id: notification.ID,
              read: true,
              clusterId: notification.CLUSTER_ID,
            });
          }
        }
        notificationRead({
          action: 'actioned',
          clusterId: notification.CLUSTER_ID,
          params: { id: notification.ID, actioned: true, isMerge: notification.isMerge },
        });
      }
      //     if (that.getCenterState()) {
      //       that.setReadstate(true);
      //     } else {
      //       that.close({ decrementFlag: true });
      //     }
    }
  };

  /**
   * Checks if the notification message contains a link action.
   * @param {Array} actions - The array of actions associated with the notification.
   * @returns {boolean} - Returns true if the notification message contains a link action, otherwise returns false.
   */
  const noticationMessageIsLink = (actions) => {
    if (!actions) return false;
    const link = actions.find((action) => action.type === 'link');
    return link ? { option: link, isLink: true } : { isLink: false };
  };

  /**
   * Executes the action select for a notification.
   * @param {object} notification - The notification object.
   * @param {number} i - The index of the action to be executed.
   */
  const executeActionSelect = (notification, i) => {
    const { getGroup, getMergeById } = useNotificationsStore();
    // get the merges ids
    const mergesIds = getGroup(notification.GROUPID);
    // for each merge notification
    mergesIds.forEach((m) => {
      const merge = getMergeById(m.id);
      //
      const findAction = merge.MESSAGE.actions[0];

      // GET the actions that has been executed by the group
      const action = {
        type: findAction.options.event.type,
        subAction: true,
        action: Array.isArray(findAction.options.event.options) ? findAction.options.event.options[i] : findAction.options.event.options,
      };
      // only if the action has not been actioned
      if (!merge.isActioned) callEvent(merge, action);
      // mark the notification as read
      if (!merge.isRead) {
        notificationRead({
          action: 'notificationRead',
          id: merge.ID,
          read: true,
          clusterId: notification.CLUSTER_ID,
        });
      }
    });
    // update the group notification actioned label
    updateActionedLabel(notification, 'do not matter', false);
    // action the group notification
    notification.actionNotification();
  };

  /**
   * Executes the deny action for a notification request.
   * @param {object} notification - The notification object.
   * @param {string} reason - The reason for denying the request.
   */
  const executeDeny = (notification, reason) => {
    const { getGroup, getMergeById } = useNotificationsStore();
    const mergesIds = getGroup(notification.GROUPID);
    mergesIds.forEach((item) => {
      const merge = getMergeById(item.id);
      //
      const findAction = merge.MESSAGE.actions[1];
      const action = {
        type: findAction.options.event.type,
        action: findAction,
      };
      action.action['reason'] = reason;
      callEvent(merge, action);
      if (!merge.isRead) {
        notificationRead({
          action: 'notificationRead',
          id: merge.ID,
          read: true,
          clusterId: notification.CLUSTER_ID,
        });
      }
    });
  };

  /**
   *  Get the OpenWith APPS.
   * @param {*} notification
   * @param {*} openWith
   * @returns
   */
  const getOpenWithMenu = (notification, openWith) => {
    let apps = [];
    return new Promise(function (resolve, reject) {
      openWith.retrieveCompatibleApps(function (appsList) {
        if (!appsList || appsList.length == 0) reject('No compatible apps found');
        else {
          // console.log('APPLIST', appsList);
          appsList.forEach(function (app) {
            apps.push({
              text: app.text,
              icon: app.icon,
              fonticon: app.fonticon,
              className: app.className,
              name: 'openWithApp-' + app.text,
              handler: function () {
                if (!notification.isRead) {
                  if (notification.isGroup) {
                    //
                    notificationRead({
                      action: 'notificationRead',
                      id: notification.ID,
                      groupID: notification.GROUPID,
                      hiddenMerged: true,
                      read: true,
                      clusterId: notification.CLUSTER_ID,
                    });
                  } else {
                    notificationRead({
                      action: 'notificationRead',
                      id: notification.ID,
                      read: true,
                      clusterId: notification.CLUSTER_ID,
                    });
                  }
                }
                app.handler();
                // analytics
                const { centerActionTracker } = NotificationTrackerUsage();
                centerActionTracker().openNotifWith({
                  persDim: {
                    pd1: `${app.text}`,
                  },
                });
              },
            });
          });
          resolve(apps);
        }
      });
    });
  };

  /**
   * Returns the CSRF URL based on the options.
   * @param {object} options - The options for generating the CSRF URL.
   * @returns {string} The CSRF URL.
   */
  const getCsrfUrl = (options) => {
    const { getListOfService } = useSettingsStore();
    const csrf = '/api/index/tk/';
    return getListOfService()[0]['3dswym'] + csrf;
  };

  /**
   *  OpenWith ACTION.
   * @param {*} notification
   * @param {*} options
   * @returns
   */
  const getOpenWithActions = async (notification, options) => {
    if (process.env.NODE_ENV !== 'production') return null;
    try {
      const OpenWith = await getOpenWith();
      let encodedUri = options[0].options.event.options.uri;
      if (encodedUri) {
        let decodedUri = decodeURIComponent(encodedUri).replace(/\+/g, ' ');
        //IR-1124605-3DEXPERIENCE3DNotification
        // var content = JSON.parse(decodedUri.slice(decodedUri.lastIndexOf("=") + 1));
        let x3dcontentUri = decodedUri.match(/X3DContentId=.*.}/);
        if (x3dcontentUri && x3dcontentUri[0] && x3dcontentUri[0].split('=') && x3dcontentUri[0].split('=')[1]) {
          let content = JSON.parse(x3dcontentUri[0].split('=')[1]);
          UWA.log('Content:  ' + content);
          let openwith = new OpenWith();
          openwith.set3DXContent(content);
          const items = await getOpenWithMenu(notification, openwith);
          const data = {
            text: $i18n('openWith'),
            fonticon: 'fonticon fonticon-open-menu-dot ',
            items: items,
          };
          return data;
        }
      }
      return null;
    } catch (err) {
      UWA.log('Warning: ' + 'Content not received in the uri');
      return null;
    }
  };

  /**
   * Denies an action for a notification.
   * @param {*} notification
   * @param {*} options
   * @param {*} reasonValues
   * @param {*} denyDisabled
   * @param {*} actionAfterFetch
   */
  const denyAction = async (notification, options, reasonValues, denyDisabled, actionAfterFetch) => {
    const { alertPromptNotice } = usePreferencesManagement();
  
    if (options.type !== 'url') {
      let reason = ''; // todo: use the vuekit modal component (after fixing the issue with the modal component)
      let message = options.action.options.event.options.attachments[0].text;
      const placeholder = options.action.options.event.options.attachments[1].placeholder;
      const okLabel = options.action.options.event.options.attachments[2].options.label;
      const title = options.action.options.event.options.title;
      const reference = options.action.options.event.options.attachments[1].reference;
      if (notification.isGroup) {
        if (message.includes('##MERGE_COUNT##')) message = message.replace('##MERGE_COUNT##', notification.COUNT);
        else {
          const data = options.action.options.event.options.attachments[0].data;
          if (message.indexOf(data.COMMUNITY_TITLE) < message.length - 1) {
            const substr = message.substr(0, message.indexOf(data.COMMUNITY_TITLE) + data.COMMUNITY_TITLE.length);
            message =
              substr +
              `, ${notification.COUNT} ${$i18n('persons')}`;
          }
        }
      }
      //
      try {
        const onConfirmVal = await alertPromptNotice({
          title,
          msg: message,
          okLabel,
          placeholder,
          required: false,
        });
        reason = onConfirmVal;
        reasonValues.value = {
          reason,
          reference,
        };
      } catch(onCloseVal) {
        denyDisabled.value = false;
        reason = onCloseVal;
        return;
      }
    }
  
    denyDisabled.value = true;
    if (notification.isGroup) {
      // get the group notification
      const { getNotificationById } = useNotificationsStore();
      const { getFilter } = useFilterStore();
      const group = getNotificationById(notification.ID);
      // if the group has been fetched
      if (!group.mergesFetched) {
        getMerge({
          parentNotif: {
            id: notification.ID,
            groupID: notification.GROUPID,
            clusterId: notification.CLUSTERID,
            archive: notification.ARCHIVE,
            ignoreSearchesForChildren: !!notification.ignoreSearchesForChildren,
          },
          filterData: getFilter(),
        });
        actionAfterFetch.value = true;
      } else {
        // todo: the reason of deny should be passed from the UI
        executeDeny(notification, reasonValues);
      }
      // activatePostAction(notification, option, option.actionedLabed);
    } else {
      // todo: the reason of deny should be passed from the UI
      options.action['reason'] = reasonValues.value;
      //
      callEvent(notification, options);
    }
    // activatePostAction(notification, option, option.actionedLabed);
  };

  /**
   * Accepts an action for a notification.
   * @param {*} notification
   * @param {*} options
   * @param {*} selectDisabled
   * @param {*} actionAfterFetch
   * @param {*} iAfter
   * @param iAfterFetch
   */
  const acceptAction = (notification, { options, i }, selectDisabled, actionAfterFetch, iAfterFetch) => {
    //
    selectDisabled.value = true;
    if (notification.isGroup) { // if the notification is a group notification
      // get the group notification
      const { getNotificationById } = useNotificationsStore();
      const { getFilter } = useFilterStore();
      const group = getNotificationById(notification.ID);
      // if the group has been fetched
      if (!group.mergesFetched) {
        getMerge({
          parentNotif: {
            id: notification.ID,
            groupID: notification.GROUPID,
            clusterId: notification.CLUSTERID,
            archive: notification.ARCHIVE,
            ignoreSearchesForChildren: !!notification.ignoreSearchesForChildren,
          },
          filterData: getFilter(),
        });
        actionAfterFetch.value = true;
        iAfterFetch.value = i;
      } else {
        executeActionSelect(notification, i);
      }
      // activatePostAction(notification, option, option.actionedLabed);
    } else callEvent(notification, options);
  };

  /**
   * Navigate to the link.
   * @param notification
   * @param action
   */
  const NavigateToLink = (notification, action) => {
    const notifOptions = {
      platformId: notification.PLATFORMID,
      currentTenant: notification.currentTenant,
      appName: notification.appName,
      provider: notification.APPID,
      options: action.value.options,
    };
    linkClickAction(notification, notifOptions, false);
  };

  return {
    openIconUrl,
    openInNewTab,
    openInSameTab,
    openNotification,
    updateActionedLabel,
    activatePostAction,
    callEvent,
    linkClickAction,
    activateLinkAction,
    activateGetAction,
    checkAction,
    checkUrlAction,
    noticationMessageIsLink,
    executeActionSelect,
    executeDeny,
    getOpenWithMenu,
    getOpenWithActions,
    denyAction,
    acceptAction,
    NavigateToLink,
    getCsrfUrl,
  };
}
