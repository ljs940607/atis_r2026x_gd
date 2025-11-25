import useNotificationsStore from '~/stores/notifications';
import useSettingsStore from '~/stores/settings';
import { useNotificationCleaning } from '../composables/notification/useNotificationCleaning';
import { useNotificationManagement } from '../composables/notification/useNotificationManagement';
import { useNotificationMenu } from '../composables/notification/useNotificationMenu';
import { useNotificationResolution } from '../composables/notification/useNotificationResolution';
import { linkIds } from '../functions/utils';
import useAnalyticsStore from '../stores/analytics';
import useConnectionStore from '../stores/connection';
import useFilterStore from '../stores/filter';
import { filter, getHistory, getMerge, getUnreadTotal } from './senders';
import { NotificationTrackerUsage } from './tracker';

export const eventHandlers = {
  setTenantAgnosticMode,
  deleteAllFilteredNotification,
  addNotification,
  setUnreadTotal,
  setHistory,
  setTenants,
  setDNDStatus,
  refreshForRollback,
  readNotification,
  deleteAllNotification,
  deleteNotification,
  setAppInfos,
  setServices,
  setMerge,
  setSetting,
  setNotifications,
  setSettings,
  setWhoSettings,
  refreshCenterView,
  rollbackPopup,
  resetSettingUnsubscriptionDate,
  setSocketStatus,
  notifCenterOpened, // when center is opened
  resetNotifications, // when center is closed
};

/**
 * Handles the event when the notification center is opened.
 * @param {object} data - The data object containing the centerOpened property.
 */
function notifCenterOpened(data) {
  const { setCenterFrameOpened } = useNotificationsStore();
  setCenterFrameOpened(data.centerOpened);
}

/**
 * Resets the notifications by updating the center frame opened state.
 * @param {object} data - The data containing the centerOpened value.
 */
function resetNotifications(data) {
  const { setCenterFrameOpened } = useNotificationsStore();
  setCenterFrameOpened(data.centerOpened);
}

/**
 * Sets the socket status.
 * @param {object} data - The data containing the socket status.
 */
function setSocketStatus(data) {
  const { setSocketStatus, setCheckingSocketStatus } = useConnectionStore();
  setSocketStatus(data.socketStatus);
  // set checking socket status to false
  setCheckingSocketStatus(false);
  // check if center is opened
  // use case: first time opening the center
  if (data.centerOpened) {
    const { setCenterFrameOpened } = useNotificationsStore();
    setCenterFrameOpened(data.centerOpened);
  }
}

/**
 * Resets the unsubscribe date of a setting and refreshes the notification center.
 * @param {object} data - The data object containing the setting ID.
 */
function resetSettingUnsubscriptionDate(data) {
  // refresh the center after nullifying the unsubscribe_date of a setting
  const { getSetting, removeUnsubscribe_dateSetting } = useSettingsStore();
  const { refreshWithoutReset } = useNotificationManagement();
  const setting = getSetting(data.id);
  if (setting) {
    // reset the unsubscribe date
    setting.unsubscribe_date = null;
    // remove setting the watchList
    removeUnsubscribe_dateSetting(setting.id);
    // refresh the center
    refreshCenterView(false);
  }
}

/**
 * Handles the rollback popup.
 * @param {any} data - The data for the rollback popup.
 */
function rollbackPopup(data) {
  const { rollbackPopupAction } = useNotificationManagement();
  rollbackPopupAction(data);
}

/**
 * Refreshes the center view with the given data.
 * @param {object} data - The data to refresh the center view with.
 */
function refreshCenterView(data) {
  const { refreshCenterView } = useNotificationManagement();
  refreshCenterView();
}
/**
 * Sets the settings data.
 * @param {object} data - The data to be set.
 */
function setSettings(data) {
  const { setSettingsData } = useSettingsStore();
  const { setSettingLoadState, setSettingLoadingState } = useSettingsStore();
  const { setClusterId } = useNotificationsStore();
  // set the cluster id
  setClusterId(data.clusterId);
  // set the settings data
  setSettingsData(data);

  setSettingLoadState('settings', true);
  setSettingLoadingState('settings', false);
}

/**
 * Sets the who settings data.
 * @param {any} data - The data to set.
 */
function setWhoSettings(data) {
  // not used in the current center but could be used in the future
}

/**
 * Sets the notifications data.
 * @param {object} data - The data to set.
 */
function setNotifications(data) {
  // analytics
  const { durationTime, resetAnalytics } = useAnalyticsStore();
  const { notificationsLoadTimeTracker } = NotificationTrackerUsage();
  if (durationTime() > 0) {
    notificationsLoadTimeTracker().notificationFilterLoaded({ time: durationTime() });
    //
    resetAnalytics();
  }
  //
  const { addHistory } = useNotificationManagement();
  addHistory(data);
}
/**
 * Sets the tenant-agnostic mode.
 * @param {object} data - The data to be processed.
 */
function setTenantAgnosticMode(data) {
  const { setTenantAgnosticData, getTenantAgnosticMode } = useSettingsStore();
  setTenantAgnosticData(data);
  if (data.update) {
    const { isFilterApplied, getFilter } = useFilterStore();
    const store = useNotificationsStore();
    const { resetStates, setIsLoading } = useNotificationsStore();
    // it is important to reset center states
    resetStates();
    //
    setIsLoading(true);
    if (isFilterApplied()) {
      // reset the tenant input
      getFilter().tenants = [];
      const data = {
        ...getFilter(),
        ...(!store.canLoadMoreHistory &&
          store.canLoadMoreFromArchive && {
            archive: true,
          }),
      };
      filter(data);
    } else {
      getHistory({
        type: 'all',
        ...(!store.canLoadMoreHistory &&
          store.canLoadMoreFromArchive && {
            archive: true,
          }),
      });
      getUnreadTotal();
    }
  }
}

/**
 * Sets the specified setting.
 * @param {object} options - The options object.
 * @param {object} options.setting - The setting to be set.
 * @param options.notifID
 */
function setSetting({ setting, notifID }) {
  // analytics
  const { notificationSettingViewTracker } = NotificationTrackerUsage();
  const settingsViewTracker = notificationSettingViewTracker();
  //
  settingsViewTracker.notifServiceOrSettings({ setting });
  settingsViewTracker.notifAlertSetting({ setting });
  //
  const { unsubscribeNotification } = useNotificationManagement();
  const { setSettingData } = useSettingsStore();
  // unsubscribe = delete all notification with the same setting
  unsubscribeNotification({ setting, notifID });
  //
  setSettingData(setting);

  // console.log('setSetting:', setting);
}

/**
 * Adds a notification to the notifications store.
 * @param {object} data - The notification data to be added.
 * @param {object} data.notification - The notification object.
 */
function addNotification(data) {
  const {
    unreadTotal,
    filterTotal,
    setFilterTotal,
    setUnreadTotal,
    getNotificationById,
    setNotification,
    addFilterNotifIds,
  } = useNotificationsStore();
  const { canBeAddedToGroup, notificationInFilterRange, refreshWithoutReset } = useNotificationManagement();
  const { cleanNotificationData } = useNotificationCleaning();
  const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
  const { setNotificationMenu } = useNotificationMenu();
  const { isFilterApplied, getFilter } = useFilterStore();

  // return if the notification is not in the filter range
  const options = {
    appName: data.appName,
    currentTenant: data.currentTenant,
  };
  // add missing fields to the notification
  // todo: add it to the server side
  data.notification['COUNT'] = 1;
  data.notification['ACTION'] = null;
  data.notification['ACTION_DATE'] = null;
  data.notification['ACTOR_DATA'] = null;
  data.clusterId = data.clusterId || data.notification['CLUSTER_ID'];
  //
  cleanNotificationData(data.notification);
  //
  // todo: before adding check if there is a filter applied, then check if the notification is in the filter range before adding
  if (isFilterApplied()) {
    // check if the notification is in the filter range
    if (!notificationInFilterRange(data.notification, getFilter())) return;
  }

  // check if can be add as a group
  if (canBeAddedToGroup(data.notification)) {
    // // add the group id
    // addGroupId(data.notification.GROUPID);
    // // before adding the notification, check if the group is read
    // const group = getNotificationByGroupId(data.notification.GROUPID);
    // if (group.isRead) setUnreadTotal(unreadTotal + 1);
    // // add the notification to the group
    // addNotificationToGroup(data.notification);

    // soft refresh (without resetting all the center states)
    refreshWithoutReset(false, data.notification.GROUPID);
    return;
  } else {
    setNotification(data.notification, options);
    // increment unread total
    if (isFilterApplied()) {
      setFilterTotal(filterTotal + 1);
      addFilterNotifIds([data.notification.ID], data.clusterId, false);
    } else setUnreadTotal(unreadTotal + 1);

    // ALWAYS re-apply the active filter (or default) so the new item shows up
    refreshWithoutReset(false, data.notification.GROUPID);
    
    const id = `${data.notification.ID}-${data.clusterId}`;
    const notif = getNotificationById(id);
    // resolve the icon and action for the notification
    resolveNotificationIcon(notif);
    resolveNotificationAction(notif);
    // set the notification menu
    setNotificationMenu(notif);
  }
}

/**
 * Handles 'setUnreadTotal' event response.
 * @param {{ unread: number, clusterId: string }} data - Data received from INTF server.
 */
function setUnreadTotal({ unread, clusterId }) {
  let counter = 0;
  if (typeof unread === 'number') {
    counter = unread;
  } else {
    counter = parseInt(unread);
  }
  if (typeof counter === 'number') {
    const { setUnreadTotal } = useNotificationsStore();
    // todo federation
    // set the unread total for the federation (current cluster + other clusters)
    setUnreadTotal(counter); //  add data to an array
  } else throw new Error('[setUnreadTotal] Missing data.unread');
}

/**
 * Handles 'setTenants' event response.
 * @param {{ tenants }} data - Data received from INTF server.
 */
function setTenants({ tenants }) {
  const { setTenantsData } = useSettingsStore();
  setTenantsData(tenants);
}

/**
 * Handles 'setHistory' event response.
 * @param data
 * @param TxID
 */
function setHistory(data) {
  // analytics
  const { durationTime, resetAnalytics } = useAnalyticsStore();
  const { notificationsLoadTimeTracker } = NotificationTrackerUsage();
  if (durationTime() > 0) {
    notificationsLoadTimeTracker().notificationLoaded({ time: durationTime() });
    //
    resetAnalytics();
  }
  //
  const { addHistory } = useNotificationManagement();
  addHistory(data);
}

// todo: not used right now but could be used in the future
/**
 * Refreshes the notifications for a rollback operation.
 * @param {object} data - The data object.
 */
function refreshForRollback(data) {
  // const { refreshCenterView } = useNotificationManagement();
  // refreshCenterView();
}

function readOneNotification(data) {
  const { setMergeReadState, setNotificationReadState, setGroupReadState } =
    useNotificationManagement();
  const { getMergeById, getNotificationById } = useNotificationsStore();
  const { getFilter } = useFilterStore();

  if (data.id) {
    // add the cluster id to the notification id
    data.id = linkIds(data.id, data.clusterId);
    // for individual notification (merge or not merge)
    if (!data.hiddenMerged) {
      // try to get the notification from the store
      let notif = getNotificationById(data.id);
      // try to get the notification from the merges
      let merge = getMergeById(data.id);
      // check if the notification is merged
      if (merge) {
        setMergeReadState(merge, data);
      }
      // check if the notification is found
      // this is merge operation, useful to update the group automatically
      if (notif) {
        // if(group) it will only update if all merges readState are updated
        // if normal notification, it will update normally

        // case of notifAlert and center closed
        if (notif.isGroup) {
          if (!notif.mergesFetched) {
            getMerge({
              parentNotif: {
                id: notif.ID,
                groupID: notif.GROUPID,
                clusterId: notif.CLUSTERID,
                archive: notif.ARCHIVE,
                ignoreSearchesForChildren: !!notif.ignoreSearchesForChildren,
              },
              filterData: getFilter(),
            });
          }
        } else setNotificationReadState(notif, data);
      }
    }
    // for group
    else {
      setGroupReadState(data.id, data);
    }
  }
}

/**
 * Marks the notification(s) as read/unread/starred/unstarred.
 * @param {object} data - The notification data.
 */
function readNotification(data) {
  const { setAllReadState } =
    useNotificationManagement();
  const { updateLabel, setActioned } = useNotificationManagement();
  // Only one notification
  if (data.id) {
    readOneNotification(data);
  }
  // Multiple notifications ??
  else if (data.scope) {
    setAllReadState(data);
  } else if (data.updateLabel) {
    // update the label of the notification
    data.params.id = linkIds(data.params.id, data.clusterId);
    // just update the label
    updateLabel(data.params);
  } else if (data.action === 'actioned') {
    // set the actioned state => date = now
    data.params.id = linkIds(data.params.id, data.clusterId);
    setActioned(data.params);
  } else if (data.notificationID) {
    data.notificationID.forEach((notif) => {
      if (notif.id) {
        readOneNotification({...data, id: notif.id});
      }
    });
  }
}

/**
 * Deletes a notification from the store.
 * @param {object} data - The notification data.
 */
function deleteNotification(data) {
  const { removeNotification, removeNotificationGroup } = useNotificationManagement();
  // add the cluster id to the notification id
  data.id = linkIds(data.id, data.clusterId);
  // delete notification
  if (!data.groupID) removeNotification(data.id);
  else removeNotificationGroup(data.id);
}
/**
 * Deletes all notifications and resets the notification store.
 * @param {object} data - The data received, empty by default = {}.
 */
function deleteAllNotification(data) {
  const { resetStates } = useNotificationsStore();
  // todo: handle deletion by clusterId or delete all knowing the other cluster will delete their notifications ?
  resetStates();
}

/**
 * Deletes all filtered notifications.
 * @param {object} data - The data received.
 */
function deleteAllFilteredNotification(data) {
  const { resetStates, setIsLoading } = useNotificationsStore();
  const { fetchMoreNotificationsIfNecessary } = useNotificationManagement();
  // todo: delete by clusterId
  resetStates(true); // true means resetting considering the filter is applied
  setIsLoading(true);
  fetchMoreNotificationsIfNecessary();
}

/**
 * Sets the app information in the notifications store.
 * @param {object} data - The app information data.
 */
function setAppInfos(data) {
  const { setNotifAppInfos } = useNotificationsStore();
  data.notifID = linkIds(data.notifID, data.clusterId);
  setNotifAppInfos(data);
}

/**
 * Sets the list of services in the store.
 * @param {object} data - The data containing the list of services.
 */
function setServices(data) {
  const { setListOfService } = useSettingsStore();
  setListOfService(data);
}

/**
 * Sets the merge for a notification.
 * @param {object} data - The data object containing the notification information.
 */
function setMerge(data) {
  const { setNotifMerges } = useNotificationManagement();
  setNotifMerges(data);
}

/**
 * Sets the DND status of the user.
 * @param {object} data - The data object containing the status information.
 */
function setDNDStatus(data) {
  const { setDNDStatus } = useSettingsStore();
  setDNDStatus(data);
}

/**
 * Handles 3DNotification response events.
 * @param {{ action: string, data: object, TxID: string, error?: string }} response - Event received from 3DNotification server response.
 * Format: [ action, JSON data ].
 */
export function responseHandler(response) {
  if (!eventHandlers[response.action]) return; // unsupported action
  try {
    eventHandlers[response.action](response.data, response.TxID);
  } catch (error) {
    throw new Error(`Error when processing response: ${error}`);
  }
}

/**
 * Returns all event handlers.
 * @returns {object} The event handlers object.
 */
export function allEventsHandlers() {
  return eventHandlers;
}
