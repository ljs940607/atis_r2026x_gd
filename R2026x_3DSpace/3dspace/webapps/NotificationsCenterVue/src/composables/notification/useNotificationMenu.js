import { notificationRead, unsubscribe } from '~/api/senders';
import useTranslations from '~/composables/useTranslations';
import { NotificationTrackerUsage } from '../../api/tracker';
import useSettingsStore from '../../stores/settings';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationManagement } from './useNotificationManagement';

const { $i18n } = useTranslations();

/**
 * Custom hook for managing the notification menu.
 * @returns {object} An object containing the UWA property.
 */
export function useNotificationMenu() {

  const setNotificationRead = (notification) => {
    // todo: this only work for a single notification
    // need to handle the group action
    const data = {
      action: 'notificationRead',
      id: notification.ID,
      archive: !!notification.FROM_ARCHIVE,
      read: !notification.isRead,
      clusterId: notification.CLUSTER_ID,
    };
    if (notification.isGroup) {
      data['groupID'] = notification.GROUPID;
      data['hiddenMerged'] = true;
    }
    notificationRead(data);
  };

  /**
   * Sets the notification menu options for a given notification.
   *
   * @param {Object} notification - The notification object.
   * @returns {void}
   */
  const setNotificationMenu = async (notification) => {
    const { centerActionTracker, notificationSettingViewTracker } = NotificationTrackerUsage();
    const theCenterActionTracker = centerActionTracker(),
      settingsViewTracker = notificationSettingViewTracker();
    const { tryNotificationDeletion } = useNotificationManagement();
    const { noticationMessageIsLink, getOpenWithActions } = useNotificationActions();
    const settingStore = useSettingsStore();
    const isLink = noticationMessageIsLink(notification.MESSAGE.actions).isLink;
    let openApps = null;
    // did this to avoid the error in the test/dev environment
    if (process.env.NODE_ENV === 'production')
      openApps = await getOpenWithActions(notification, notification.MESSAGE.actions);

    const menuOptions = [
      ...(isLink
        ? [
            {
              fonticon: 'fonticon fonticon-window',
              name: 'newTab',
              text: $i18n('openInNewTab'),
              handler: (item) => {
                const { noticationMessageIsLink, linkClickAction } = useNotificationActions();
                const { option } = noticationMessageIsLink(notification.MESSAGE.actions);
                const notifOptions = {
                  platformId: notification.PLATFORMID,
                  currentTenant: notification.currentTenant,
                  appName: notification.appName,
                  provider: notification.APPID,
                  options: option.options,
                  _appID: [],
                };
                linkClickAction(notification, notifOptions, true);

                // analytics
                theCenterActionTracker.openNotifInNewTab();
              },
            },
          ]
        : []),
      ...(openApps !== null ? [openApps] : []),
      ...(isLink || openApps !== null
        ? [
            {
              class: 'divider',
            },
          ]
        : []),
      {
        fonticon: notification.isRead ? 'fonticon fonticon-bell' : 'fonticon fonticon-bell-alt',
        name: 'read',
        text: notification.isGroup
          ? notification.isRead
            ? $i18n('markGroupAsUnRead')
            : $i18n('markGroupAsRead')
          : notification.isRead
            ? $i18n('markAsUnread')
            : $i18n('markAsRead'),
        handler: (item) => {
          setNotificationRead(notification);

              // analytics
          theCenterActionTracker.notificationRead({ read: !notification.isRead });
        },
      },
      ...(!notification.isMerge
        ? [
            {
              fonticon: 'fonticon fonticon-star',
              name: 'important',
              text: notification.isGroup
                ? notification.isStarred
                  ? $i18n('removeGroupImportant')
                  : $i18n('markGroupAsImportant')
                : notification.isStarred
                  ? $i18n('removeImportant')
                  : $i18n('markAsImportant'),
              handler: (item) => {
                // todo: this only work for a single notification
                // need to handle the group action
                const data = {
                  action: 'notificationRead',
                  id: notification.ID,
                  archive: !!notification.FROM_ARCHIVE,
                  starred: 'starred',
                  param: notification.isStarred ? 0 : 1,
                  clusterId: notification.CLUSTER_ID,
                };
                if (notification.isGroup) {
                  data['groupID'] = notification.GROUPID;
                  data['hiddenMerged'] = true;
                  // another action for group
                }
                notificationRead(data);

                // analytics
                theCenterActionTracker.notificationStar({ starred: data.param });
              },
            },
          ]
        : []),

      {
        class: 'divider',
      },
      {
        fonticon: 'fonticon fonticon-list-delete',
        name: 'unsubscribe',
        text: $i18n('unsubscribe'),
        items: [
          {
            fonticon: 'fonticon fonticon-list-delete',
            text: $i18n('unsubscribeForHour'),
            name: 'anHour',
            handler: (item) => {
              unsubscribe({
                id: notification.ID,
                subscribe: 0,
                forHour: true,
              });
              // analytics
              const setting = settingStore.getSetting(notification.SERVICE_ID);
              settingsViewTracker.unsubscribeNotification({
                persDim: {
                  pd1: setting.name,
                  pd2: setting.servicename,
                  pd3: setting.service,
                  pd4: 'for an hour',
                  pd5: 'notification menu',
                },
              });
            },
          },
          {
            fonticon: 'fonticon fonticon-list-delete',
            text: $i18n('unsubscribeIndefinitely'),
            name: 'indefinetly',
            handler: (item) => {
              unsubscribe({
                id: notification.ID,
                subscribe: 0,
              });
              // analytics
              const setting = settingStore.getSetting(notification.SERVICE_ID);
              settingsViewTracker.unsubscribeNotification({
                persDim: {
                  pd1: setting.name,
                  pd2: setting.servicename,
                  pd3: setting.service,
                  pd4: 'indefinitely',
                  pd5: 'notification menu',
                },
              });
            },
          },
        ],
      },
      {
        fonticon: 'fonticon fonticon-trash',
        text: notification.isGroup ? $i18n('deleteGroup') : $i18n('delete'),
        name: 'delete',
        handler: (item) => {
          tryNotificationDeletion(
            notification.ID,
            notification.isMerge,
            notification.isGroup,
            !!notification.FROM_ARCHIVE,
            false
          );
        },
      },
    ];
    notification.OPTIONS = menuOptions;
  };
  return {
    setNotificationMenu,
    setNotificationRead,
  };
}
