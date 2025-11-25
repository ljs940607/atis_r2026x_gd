import { getTrackerAPI } from '~/modules/imports';
import { useUWA } from '~/composables/useUWA';
import useNotificationsStore from '~/stores/notifications';
import useSettingsStore from '../stores/settings';

/**
 * Represents a notification tracker usage.
 *
 * @returns {Object} An object containing various tracker functions for notification actions.
 */
export function NotificationTrackerUsage() {
  //
  const { UWA } = useUWA();
  const notificationsStore = useNotificationsStore();
  //
  const report = {
    appID: 'X3DNTFC_AP',
  };

  /**
   * Represents the action tracker for the notification center.
   * @returns {Object} An object containing various action functions for the notification center.
   */
  const centerActionTracker = () => {
    // new tracker for notification center ------------------------------

    /**
     * send a tracking event when a notification is opened with an app.
     * @param {*} data
     * @returns
     */
    const openNotifWith = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'openNotifWith';
      report.eventLabel = 'Open notification with';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Open notification with Analytics request failed : ${error}`);
      }
    };

    /**
     * send a tracking event when a notification is opened in a new tab.
     * @param {*} data
     */
    const openNotifInNewTab = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'openNotifInNewTab';
      report.eventLabel = 'Open notification in new tab';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Open notification in new tab Analytics request failed : ${error}`);
      }
    };

    /**
     * Handles the click event on a notification.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const notifClick = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'notifClick';
      report.eventLabel = 'Click on a notification';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification click Analytics request failed : ${error}`);
      }
    };

    /**
     * Handles the profile click event.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the profile click event is tracked successfully.
     */
    const profileClick = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'profileClick';
      report.eventLabel = 'Click on a profile';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Profile click Analytics request failed : ${error}`);
      }
    };
    //-----------------------------------------------------------------
    //
    /**
     * View all merge notifications.
     *
     * @param {Object} data - The data object containing optional parameters.
     * @param {number} data.nbMerge - The number of merge notifications.
     * @param {string} data.persDim - The personalized dimension.
     * @param {string} data.persVal - The personalized value.
     * @returns {Promise<void>} - A promise that resolves when the tracking is complete.
     */
    const viewAllMergeNotif = async (data = {}) => {
      const { nbMerge, persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'viewAllMergeNotif';
      report.eventLabel = 'View all merge Notifications';
      report.eventValue = nbMerge;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`View all merge Notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Hides all merge notifications.
     *
     * @param {Object} data - The data object containing optional parameters.
     * @param {number} data.nbMerge - The number of merge notifications.
     * @param {string} data.persDim - The personalized dimension.
     * @param {string} data.persVal - The personalized value.
     * @returns {Promise<void>} - A promise that resolves when the merge notifications are hidden.
     */
    const hideAllMergeNotif = async (data = {}) => {
      const { nbMerge, persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'hideAllMergeNotif';
      report.eventLabel = 'Hide all merge Notifications';
      report.eventValue = nbMerge;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Hide all merge Notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Stars or unstars a notification.
     *
     * @param {Object} data - The data object containing the notification information.
     * @param {string} data.persDim - The personal dimension of the notification.
     * @param {string} data.persVal - The personal value of the notification.
     * @param {boolean} data.starred - Indicates whether the notification is starred or not.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const notificationStar = async (data = {}) => {
      const { persDim, persVal, starred } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = starred ? 'notificationStarred' : 'notificationUnstarred';
      report.eventLabel = (starred ? 'Sta' : 'Unsta') + 'r a notification';
      report.eventValue = starred ? 1 : 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification starred Analytics request failed : ${error}`);
      }
    };

    /**
     * Marks a notification as read or unread.
     *
     * @param {Object} data - The data object containing the notification information.
     * @param {string} data.persDim - The personal dimension of the notification.
     * @param {string} data.persVal - The personal value of the notification.
     * @param {boolean} data.read - Indicates whether the notification should be marked as read or unread.
     * @returns {Promise<void>} - A promise that resolves when the notification is marked.
     */
    const notificationRead = async (data = {}) => {
      const { persDim, persVal, read } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = read ? 'notificationRead' : 'notificationUnread';
      report.eventLabel = (read ? 'R' : 'Unr') + 'ead a notification';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification read Analytics request failed : ${error}`);
      }
    };

    /**
     * Cancels the deletion of a notification.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the cancellation is successful.
     */
    const cancelNotificationDeletion = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'cancelNotificationDeletion';
      report.eventLabel = 'Cancel notification deletion';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Cancel notification deletion Analytics request failed : ${error}`);
      }
    };

    /**
     * Deletes a notification.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the notification is deleted.
     */
    const notificationDelete = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'notificationDelete';
      report.eventLabel = 'Delete a notification';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification delete Analytics request failed : ${error}`);
      }
    };

    return {
      openNotifWith,
      viewAllMergeNotif,
      hideAllMergeNotif,
      notificationRead,
      notificationDelete,
      notificationStar,
      openNotifInNewTab,
      notifClick,
      profileClick,
      cancelNotificationDeletion,
    };
  };

  // new tracker for multiple selection actions
  const multipleSelectionActionTracker = () => {
    //
    /**
     * Performs a selection action.
     * @param {Object} data - The data for the selection action.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {string} data.action - The action to be performed.
     * @param {number} data.length - The length of the selection.
     * @returns {Promise<void>} - A promise that resolves when the selection action is completed.
     */
    const selectionAction = async (data = {}) => {
      const { persDim, persVal, action, length } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = action;
      report.eventLabel = `Multiple selection action: ${action}`;
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Multiple selection action Analytics request failed : ${error}`);
      }
    };
    //
    /**
     * Enables multiple selection.
     *
     * @param {Object} data - The data object.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is sent.
     */
    const enableSelection = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = 'enableSelection';
      report.eventLabel = 'Enable multiple selection';
      report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Enable multiple selection Analytics request failed : ${error}`);
      }
    };
    //
    /**
     * Disables multiple selection.
     *
     * @param {Object} data - The data object.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is sent.
     * @throws {Error} - If the tracking event fails to send.
     */
    const disableSelection = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = 'disableSelection';
      report.eventLabel = 'Disable multiple selection';
      report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Disable multiple selection Analytics request failed : ${error}`);
      }
    };
    //
    /**
     * Reads or marks as unread the selected notifications.
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {boolean} data.read - Indicates whether to mark the notifications as read or unread.
     * @param {number} data.length - The number of selected notifications.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const readSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, read, length } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = read ? 'readSelectedNotifications' : 'unreadSelectedNotifications';
      report.eventLabel = (read ? 'R' : 'Unr') + 'ead selected notification(s)';
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Read/Unred selected notifications Analytics request failed  : ${error}`);
      }
    };

    /**
     * Deletes selected notifications.
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {number} data.length - The length of the selected notifications.
     * @returns {Promise<void>} - A promise that resolves when the notifications are deleted.
     */
    const deleteSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, length } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = 'deleteSelectedNotifications';
      report.eventLabel = 'Delete selected notification(s)';
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Delete selected notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Stars or unstars selected notifications.
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {boolean} data.starred - Indicates whether the notifications should be starred or unstarred.
     * @param {number} data.length - The length of the selected notifications.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const starSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, starred, length } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = starred ? 'starSelectedNotifications' : 'unstarSelectedNotifications';
      report.eventLabel = (starred ? 'Sta' : 'Unsta') + 'r selected notification(s)';
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Star/Unstar selected notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Unsubscribes selected notification(s).
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {number} data.length - The length of the selected notifications.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const unsubscribeSelectedNotifications = async (data = {}) => {
      const { persDim, persVal, length } = data;
      report.eventCategory = 'notification.selection';
      report.eventAction = 'unsubscribeSelectedNotifications';
      report.eventLabel = 'Unsubscribe selected notification(s)';
      report.eventValue = length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Unsubscribe selected notifications Analytics request failed : ${error}`);
      }
    };

    return {
      readSelectedNotifications,
      deleteSelectedNotifications,
      starSelectedNotifications,
      unsubscribeSelectedNotifications,
      enableSelection,
      disableSelection,
      selectionAction,
    };
  };

  /**
   * Represents a collection of actions related to the settings icon in the notification center.
   * @returns {Object} An object containing various action functions.
   */
  const settingIconActionTracker = () => {
    /**
     * Invokes the notification settings view.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is sent.
     * @throws {Error} - If the analytics request fails.
     */
    const invokenotifSettingView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'invokenotifSettingView';
      report.eventLabel = 'Open settings view';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`invokenotifSettingView Analytics request failed : ${error}`);
      }
    };

    /**
     * Deletes all notifications.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the notifications are deleted.
     */
    const deleteAllNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'deleteAllNotifications';
      report.eventLabel = 'Delete all notifications';
      // report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Delete all notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Deletes all filtered notifications.
     *
     * @param {Object} data - The data object.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    const deleteAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'deleteAllFilteredNotifications';
      report.eventLabel = 'Delete all filtered notifications';
      report.eventValue = notificationsStore.filterNotifIds.length;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Delete all filtered notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Reads all notifications and sends an analytics event to the tracker API.
     * @param {Object} data - Optional data object containing persDim and persVal properties.
     * @returns {Promise<void>} - A promise that resolves when the analytics event is sent successfully.
     */
    const readAllNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'readAllNotifications';
      report.eventLabel = 'Read all notifications';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Read all notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Marks all notifications as unread.
     *
     * @param {Object} data - The data object containing personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is sent.
     * @throws {Error} - If the tracking event fails to send.
     */
    const unreadAllNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'unreadAllNotifications';
      report.eventLabel = 'Unread all notifications';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Unread all notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Reads all filtered notifications.
     *
     * @param {Object} data - The data object containing the personal dimension and value.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const readAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'readAllFilteredNotifications';
      report.eventLabel = 'Read all filtered notifications';
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Read all filtered notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Marks all filtered notifications as unread.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const unreadAllFilteredNotifications = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'unreadAllFilteredNotifications';
      report.eventLabel = 'Unread all filtered notifications';
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Unread all filtered notifications Analytics request failed : ${error}`);
      }
    };

    /**
     * Switches tenant notifications.
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @param {string} data.tenant - The tenant.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const switchTenantNotifications = async (data = {}) => {
      const { persDim, persVal, tenant } = data;
      report.eventCategory = 'notification.settingsicon.v2';
      report.eventAction = 'switchTenantNotifications';
      report.eventLabel = `Switch to ${tenant === 'all' ? 'all' : 'current (' + tenant + ')'} tenant notifications`;
      report.eventValue = tenant === 'all' ? 1 : 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Switch tenant notifications Analytics request failed : ${error}`);
      }
    };

    return {
      invokenotifSettingView,
      deleteAllNotifications,
      deleteAllFilteredNotifications,
      readAllNotifications,
      readAllFilteredNotifications,
      unreadAllNotifications,
      unreadAllFilteredNotifications,
      switchTenantNotifications,
    };
  };

  /**
   * Tracks events related to notification settings view.
   * @returns {Object} An object containing various functions to track different events.
   */
  const notificationSettingViewTracker = () => {
    /**
     * Function to handle notification service or settings.
     *
     * @param {Object} data - Data object containing persVal and setting.
     * @returns {Promise<void>} - A promise that resolves when the function completes.
     */
    const notifServiceOrSettings = async (data = {}) => {
      const { getSetting } = useSettingsStore();
      const { persVal, setting } = data;
      report.eventCategory = 'notification.settingsview.v2';
      report.eventValue = setting.SUBSCRIBE;
      report.persVal = persVal;
      const defautSetting = getSetting(setting.ID);
      if (defautSetting) {
        report.persDim = {
          ppd1: defautSetting.name,
          pd2: defautSetting.servicename,
          pd3: defautSetting.service,
        };
        if (defautSetting.subscribe !== setting.SUBSCRIBE) {
          if (setting.SUBSCRIBE === 0) {
            // console.log('disableNotifServiceOrSettings');
            report.eventAction = 'disableNotifServiceOrSettings';
            report.eventLabel = 'Disable notification service or settings';
          } else {
            report.eventAction = 'enableNotifServiceOrSettings';
            report.eventLabel = 'Enable notification service or settings';
          }
          try {
            const trackerAPI = await getTrackerAPI();
            trackerAPI.trackPageEvent(report);
          } catch (error) {
            UWA.log(`Notification service or settings Analytics request failed : ${error}`);
          }
        }
      }
    };

    /**
     * Unsubscribes a notification.
     *
     * @param {Object} data - The data object containing the personal dimension and value.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the notification is unsubscribed.
     */
    const unsubscribeNotification = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'unsubscribeNotification';
      report.eventLabel = 'Unsubscribe notification';
      // report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Unsubscribe notification Analytics request failed : ${error}`);
      }
    };

    /**
     * Resets the unsubscribe notification date.
     *
     * @param {Object} data - The data object.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     */
    const resetUnsubscribeNotificationDate = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'resetUnsubscribeNotificationDate';
      report.eventLabel = 'Reset unsubscribe notification date';
      // report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Reset unsubscribe notification date Analytics request failed : ${error}`);
      }
    };

    /**
     * Sets the notification alert settings.
     *
     * @param {Object} data - The data object containing the settings.
     * @param {string} data.persVal - The personal value.
     * @param {Object} data.setting - The setting object.
     * @param {number} data.setting.ID - The ID of the setting.
     * @param {number} data.setting.NOTIF_BY_UI - The notification by UI setting.
     * @param {number} data.setting.NOTIF_BY_EMAIL - The notification by email setting.
     * @param {number} data.setting.NOTIF_BY_BROWSER - The notification by browser setting.
     */
    const notifAlertSetting = async (data = {}) => {
      const { persVal, setting } = data;
      const { getSetting } = useSettingsStore();
      report.eventCategory = 'notification.settingsview.v2';
      report.persVal = persVal;
      const defautSetting = getSetting(setting.ID);
      if (defautSetting) {
        report.persDim = {
          pd1: defautSetting.name,
          pd2: defautSetting.servicename,
          pd3: defautSetting.service,
        };
        // Alert notification
        if (setting.NOTIF_BY_UI === 0 && defautSetting.notif_by_ui !== setting.NOTIF_BY_UI) {
          report.eventAction = 'disableNotifAlert';
          report.eventLabel = 'Disable notification alert setting';
          report.eventValue = setting.NOTIF_BY_UI;
        } else if (setting.NOTIF_BY_UI === 1 && defautSetting.notif_by_ui !== setting.NOTIF_BY_UI) {
          report.eventAction = 'enableNotifAlert';
          report.eventLabel = 'Enable notification alert setting';
          report.eventValue = setting.NOTIF_BY_UI;
        }
        // Email notification
        if (setting.NOTIF_BY_EMAIL === 0 && defautSetting.notif_by_email !== setting.NOTIF_BY_EMAIL) {
          report.eventAction = 'disableNotifMail';
          report.eventLabel = 'Disable notification mail setting';
          report.eventValue = setting.NOTIF_BY_EMAIL;
        } else if (setting.NOTIF_BY_EMAIL === 1 && defautSetting.notif_by_email !== setting.NOTIF_BY_EMAIL) {
          report.eventAction = 'enableNotifMail';
          report.eventLabel = 'Enable notification mail setting';
          report.eventValue = setting.NOTIF_BY_EMAIL;
        }
        // Browser notification
        if (setting.NOTIF_BY_BROWSER === 0 && defautSetting.notif_by_browser !== setting.NOTIF_BY_BROWSER) {
          report.eventAction = 'disableNotifBrowser';
          report.eventLabel = 'Disable notification browser setting';
          report.eventValue = setting.NOTIF_BY_BROWSER;
        } else if (setting.NOTIF_BY_BROWSER === 1 && defautSetting.notif_by_browser !== setting.NOTIF_BY_BROWSER) {
          report.eventAction = 'enableNotifBrowser';
          report.eventLabel = 'Enable notification browser setting';
          report.eventValue = setting.NOTIF_BY_BROWSER;
        }
        try {
          const trackerAPI = await getTrackerAPI();
          trackerAPI.trackPageEvent(report);
        } catch (error) {
          UWA.log(`Notification alert settings Analytics request failed : ${error}`);
        }
      }
    };

    /**
     * Tracks the service settings view event.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const serviceSettingsView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'serviceSettingsView';
      report.eventLabel = 'Specific service settings';
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Service settings view Analytics request failed : ${error}`);
      }
    };

    /**
     * Function to navigate back to the notification settings view.
     *
     * @param {Object} data - Additional data for the function (optional).
     * @returns {Promise<void>} - A promise that resolves when the function is completed.
     */
    const backtoNotificationSettingsView = async (data = {}) => {
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'backtoNotificationSettingsView';
      report.eventLabel = 'Backword navigation from service view';
      report.persDim = {
        pd1: 'showSettings',
      };
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Back to notification settings view Analytics request failed : ${error}`);
      }
    };

    /**
     * Function to navigate back to the notification center view.
     *
     * @param {Object} data - Additional data for the function (optional).
     * @returns {Promise<void>} - A promise that resolves when the function is completed.
     */
    const backtoNotificationCenterView = async (data = {}) => {
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'backtoNotificationCenterView';
      report.eventLabel = 'Backword navigation from setting view';
      report.persDim = {
        pd1: 'showCenter',
      };
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Back to notification center view Analytics request failed : ${error}`);
      }
    };
    return {
      notifServiceOrSettings,
      unsubscribeNotification,
      resetUnsubscribeNotificationDate,
      notifAlertSetting,
      serviceSettingsView,
      backtoNotificationSettingsView,
      backtoNotificationCenterView,
    };
  };

  /**
   * Creates a tracker object for handling notification filter view events.
   * @returns {Object} The tracker object with methods to track different events.
   */
  const notificationFilterViewTracker = () => {
    /**
     * Clicks on the notification filter icon to show the filter.
     *
     * @param {Object} data - The data object containing the personalization dimensions and values.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     * @throws {Error} - If the analytics request fails.
     */
    const clicknotifFilterIconToShow = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.filterview.v2';
      report.eventAction = 'clicknotifFilterIconToShow';
      report.eventLabel = 'Click on notification filter icon to show filter';
      report.eventValue = 1;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Click on notification filter icon to show filter Analytics request failed : ${error}`);
      }
    };

    /**
     * Clicks on the notification filter icon to hide the filter.
     *
     * @param {Object} data - The data object.
     * @param {string} data.persDim - The personal dimension.
     * @param {string} data.persVal - The personal value.
     * @returns {Promise<void>} - A promise that resolves when the tracking event is completed.
     * @throws {Error} - If the analytics request fails.
     */
    const clicknotifFilterIconToHide = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.filterview.v2';
      report.eventAction = 'clicknotifFilterIconToHide';
      report.eventLabel = 'Click on notification filter icon to hide filter';
      report.eventValue = 0;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Click on notification filter icon to hide filter Analytics request failed : ${error}`);
      }
    };

    /**
     * Clicks the filter button and tracks the event using the tracker API.
     *
     * @param {Object} data - The data object containing the filter parameters.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const clickFilterButton = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.filterview.v2';
      report.eventAction = 'clickFilterButton';
      report.eventLabel = 'Filter button click';
      report.eventValue = notificationsStore.filterTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Click on filter button Analytics request failed : ${error}`);
      }
    };

    /**
     * Cancels the filter view and sends an analytics event.
     *
     * @param {Object} data - The data object containing the filter view information.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the analytics event is tracked.
     */
    const cancelFilterView = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.filterview.v2';
      report.eventAction = 'cancelFilterView';
      report.eventLabel = 'Filter panel closed';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Filter panel closed view Analytics request failed : ${error}`);
      }
    };

    /**
     * Resets the filter panel fields and tracks the event in the analytics.
     *
     * @param {Object} data - The data object containing the filter fields.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const resetFilterFields = async (data = {}) => {
      const { persDim, persVal } = data;
      report.eventCategory = 'notification.filterview.v2';
      report.eventAction = 'resetFilterFields';
      report.eventLabel = 'Reset filter panel fields';
      report.eventValue = notificationsStore.unreadTotal;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Reset filter fields Analytics request failed : ${error}`);
      }
    };
    return {
      clicknotifFilterIconToShow,
      clicknotifFilterIconToHide,
      clickFilterButton,
      cancelFilterView,
      resetFilterFields,
    };
  };

  /**
   * Tracks the loading time of notifications in the Notification Center.
   * @returns {Object} An object containing two functions: `notificationLoaded` and `notificationFilterLoaded`.
   */
  const notificationsLoadTimeTracker = () => {
    /**
     * Tracks the loading of a notification in the Notification Center.
     *
     * @param {Object} data - The data object containing the notification information.
     * @param {string} data.persDim - The personalization dimension of the notification.
     * @param {string} data.persVal - The personalization value of the notification.
     * @param {number} data.time - The loading time of the notification in milliseconds.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const notificationLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'notificationLoaded';
      report.eventLabel = 'Loading time in Notification Center in milliseconds';
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notifications load time Analytics request failed : ${error}`);
      }
    };

    /**
     * Tracks the loading time of the notification center filter.
     *
     * @param {Object} data - The data object containing the filter information.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @param {number} data.time - The loading time in milliseconds.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const notificationFilterLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = 'notification.center.v2';
      report.eventAction = 'notificationFilterLoaded';
      report.eventLabel = 'Loading time in Notification center Filter in milliseconds';
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification filter load time Analytics request failed : ${error}`);
      }
    };

    /**
     * Tracks the loading time of notification settings.
     *
     * @param {Object} data - The data object containing the parameters.
     * @param {string} data.persDim - The personalization dimension.
     * @param {string} data.persVal - The personalization value.
     * @param {number} data.time - The loading time of settings in milliseconds.
     * @returns {Promise<void>} - A promise that resolves when the tracking is completed.
     */
    const notificationSettingsLoaded = async (data = {}) => {
      const { persDim, persVal, time } = data;
      report.eventCategory = 'notification.settingsview.v2';
      report.eventAction = 'notificationSettingsLoaded';
      report.eventLabel = 'Loading time of Settings in milliseconds';
      report.eventValue = time;
      report.persDim = persDim;
      report.persVal = persVal;
      try {
        const trackerAPI = await getTrackerAPI();
        trackerAPI.trackPageEvent(report);
      } catch (error) {
        UWA.log(`Notification settings load time Analytics request failed : ${error}`);
      }
    };

    return {
      notificationLoaded,
      notificationFilterLoaded,
      notificationSettingsLoaded,
    };
  };
  return {
    centerActionTracker,
    settingIconActionTracker,
    notificationSettingViewTracker,
    notificationFilterViewTracker,
    notificationsLoadTimeTracker,
    multipleSelectionActionTracker,
  };
}
