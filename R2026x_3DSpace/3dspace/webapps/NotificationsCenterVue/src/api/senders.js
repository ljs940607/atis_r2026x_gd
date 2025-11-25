import { checkIfIdHasHyphen } from '../functions/utils';
import useAnalyticsStore from '../stores/analytics';
import driver from './drivers/commonDriver';
/**
 * @typedef {object} FilterData
 * @property {Date} first_date - The start date for filtering.
 * @property {Date} last_date - The end date for filtering.
 * @property {string[]} searches - The search terms for filtering.
 * @property {boolean} read - Flag indicating whether to include read notifications.
 * @property {boolean} unread - Flag indicating whether to include unread notifications.
 * @property {boolean} starred - Flag indicating whether to include starred notifications.
 * @property {boolean} unstarred - Flag indicating whether to include unstarred notifications.
 * @property {string[]} tenants - The tenant IDs for filtering.
 * @property {number} oldID - The old ID for filtering.
 * @property {boolean} archive - Flag indicating whether to include archived notifications.
 * @property {string[] } groupIDs - The group IDs for filtering.
 * @property {string} clusterId - Current cluster id. TODO rework for federation.
 */

/**
 * Sets the analytics start time.
 */
const setAnalyticsStartTime = () => {
  const { setStartTime } = useAnalyticsStore();
  setStartTime(performance.now());
};

/**
 * Filters notifications based on the provided criteria.
 * @param {object} options - The filter options.
 * @param {Date} options.first_date - The start date for filtering.
 * @param {Date} options.last_date - The end date for filtering.
 * @param {string[]} options.searches - The search terms for filtering.
 * @param {boolean} options.read - Flag indicating whether to include read notifications.
 * @param {boolean} options.unread - Flag indicating whether to include unread notifications.
 * @param {boolean} options.starred - Flag indicating whether to include starred notifications.
 * @param {boolean} options.unstarred - Flag indicating whether to include unstarred notifications.
 * @param {string[]} options.tenants - The tenant IDs for filtering.
 * @param {number} options.oldID - The old ID for filtering.
 * @param {boolean} options.archive - Flag indicating whether to include archived notifications.
 * @param {string[] } options.groupIDs - The group IDs for filtering.
 * @param {string} options.clusterId - Current cluster id. TODO rework for federation.
 */
function setFilterOptionsPayload({
  first_date,
  last_date,
  searches,
  read,
  unread,
  starred,
  unstarred,
  tenants,
  oldID,
  archive,
  groupIDs,
  clusterId,
}) {
  // must give only the name of the tenants (not the object)
  const tenantsValues = [];
  tenants.forEach((tenant) => {
    tenantsValues.push(tenant.value);
  });
  tenants = tenantsValues;
  // TODO factorize in store + handle federation
  const clusters = {};
  clusters[clusterId] = {
    oldId: oldID,
    groupIds: groupIDs,
    archive: archive ?? false,
    tenants: tenants.map((t) => t?.LABEL || t),
  };
  const firstDate = first_date ? first_date.toLocaleDateString('en-CA') : null;
  let lastDate = new Date(last_date?.valueOf());
  lastDate = lastDate?.setDate(lastDate?.getDate() + 1); // add 1 day
  lastDate = lastDate ? new Date(lastDate).toLocaleDateString('en-CA') : null;

  // send the filter event
  return {
    filterOptions: {
      firstDate,
      lastDate,
      searches,
      read,
      unread,
      starred,
      unstarred,
    },
    clusters,
  };
}

/**
 * Sends 'getUnreadTotal' event to get the number of unread notifications.
 */
export function getUnreadTotal() {
  driver.send({ action: 'getUnreadTotal', data: {} });
}

/**
 * Sends 'getTenants' event to get users tenants.
 */
export function getTenants() {
  driver.send({ action: 'getTenants', data: {} });
}

/**
 * Sends 'resetBadge' event to reset topbar badge.
 * @param {object} data - Data.
 * @param {{ notifCenterOpened: boolean }} data.notifCenterOpened - If the center is open.
 */
export function resetBadge({ notifCenterOpened }) {
  driver.send({ action: 'resetBadge', data: { notifCenterOpened } });
}

/**
 * Sends 'getHistory' event to get the notifications.
 * @param {object} data - Data.
 * @param {'all' | 'unread' | 'starred'} data.type - Type of notifications to retrieve.
 * @param {number}  data.oldID - Old ID.
 * @param {[]} data.groupIDs - Group IDs.
 * @param {boolean} data.archive - If the notifications are archived.
 */
export function getHistory({ type, oldID, groupIDs, archive }) {
  setAnalyticsStartTime();
  // add the archive value to the data
  driver.send({ action: 'getHistory', data: { type, oldID, groupIDs, archive } });
}

/**
 * Marks a notification as read.
 * @param {object} options - The options for marking the notification as read.
 * @param {string} options.action - The action to perform.
 * @param {number} options.id - The ID of the notification.
 * @param {boolean} options.read - Indicates whether the notification is read.
 * @param {boolean} options.actioned - Indicates whether the notification is actioned.
 * @param {boolean} options.archive - Indicates whether the notification is archived.
 * @param {boolean} options.scope - The scope of the notification.
 * @param {boolean} options.filter - The filter for the notification.
 * @param {{ archive, id, hiddenMerged, groupID } [] || []} options.notificationID - The ID of the notification.
 * @param {boolean} options.starred - Indicates whether the notification is starred.
 * @param {string} options.param - The parameter for the notification.
 * @param {object} options.params - The parameters for the notification.
 * @param {string} options.updateLabel - The label to update.
 * @param {string} options.groupID - The ID of the group.
 * @param {boolean} options.hiddenMerged - Indicates whether the notification is hidden or merged.
 * @param {string} options.clusterId - The ID of the cluster.
 * @param {FilterData} filterData - Filter data.
 */
export function notificationRead({
  action,
  id,
  read,
  actioned,
  archive,
  scope,
  filter,
  notificationID,
  starred,
  param,
  params,
  updateLabel,
  groupID,
  hiddenMerged,
  clusterId,
  filterData,
}) {
  // check if the id has a hyphen to remove it
  const notifId = checkIfIdHasHyphen(id);
  if (notifId) {
    id = parseInt(notifId.id);
  }

  if (params && !!params.id) {
    const paramId = checkIfIdHasHyphen(params.id);
    if (paramId) {
      params.id = parseInt(paramId.id);
    }
  }
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};
  // send the notification read event
  driver.send({
    action: 'notificationRead',
    data: {
      action,
      id,
      read,
      archive,
      scope,
      filter,
      notificationID,
      actioned,
      starred,
      param,
      params,
      updateLabel,
      groupID,
      hiddenMerged,
      clusterId,
      filterOptions,
      clusters,
    },
  });
}

/**
 * Deletes all notifications.
 */
export function deleteAllNotification() {
  driver.send({ action: 'deleteAllNotification', data: {} });
}

/**
 * Deletes a notification.
 * @param {object} options - The options for deleting a notification.
 * @param {string} options.groupID - The ID of the notification group.
 * @param {number} options.id - The ID of the notification.
 * @param {boolean} options.scope - The scope of the notification.
 * @param {boolean} options.archive - Indicates whether the notification should be archived.
 * @param {string} options.clusterId - The ID of the cluster.
 */
export function notificationDelete({ groupID, id, scope, archive, clusterId }) {
  // check if the id has a hyphen to remove it
  const notifId = checkIfIdHasHyphen(id);
  if (notifId) {
    id = parseInt(notifId.id);
  }
  driver.send({
    action: 'notificationDelete',
    data: { id, groupID, scope, archive, clusterId },
  });
}

/**
 * Retrieves application information for a given app ID and notification ID.
 * @param {object} params - The parameters for retrieving app information.
 * @param {string} params.appID - The ID of the application.
 * @param {string} params.notifID - The ID of the notification.
 * @param {string} params.clusterId - The ID of the cluster.
 */
export function getAppInfos({ appID, notifID, clusterId }) {
  // check if the id has a hyphen to remove it
  const notifId = checkIfIdHasHyphen(notifID);
  if (notifId) {
    notifID = parseInt(notifId.id);
  }
  driver.send({ action: 'getAppInfos', data: { appID, notifID, clusterId } });
}

/**
 * Retrieves the services.
 */
export function getServices() {
  driver.send({ action: 'getServices', data: {} });
}

/**
 * Retrieves merge data based on the specified parameters.
 * @param {object} options - The options for retrieving merge data.
 * @param {{ id: number, groupID: string, clusterId: string, archive: archive, ignoreSearchesForChildren: boolean }} options.parentNotif - The type of merge.
 * @param {FilterData} options.filterData - Filter data.
 * @s {Promise} A promise that resolves with the merge data.
 */
export function getMerge({ parentNotif, filterData }) {
  // check if the id has a hyphen to remove it
  const notifId = checkIfIdHasHyphen(parentNotif.id);
  if (notifId) {
    parentNotif.id = parseInt(notifId.id);
  }
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};;
  driver.send({ action: 'getMerge', data: { parentNotif, filterOptions, clusters } });
}

/**
 * Unsubscribes from a notification.
 * @param {object} options - The options for unsubscribing.
 * @param {number} options.id - The ID of the notification.
 * @param {number} options.subscribe - Whether to subscribe or unsubscribe.
 * @param {boolean} options.forHour - The duration in hours for which to unsubscribe.
 */
export function unsubscribe({ id, subscribe, forHour }) {
  // check if the id has a hyphen to remove it
  const notifId = checkIfIdHasHyphen(id);
  if (notifId) {
    id = parseInt(notifId.id);
  }
  driver.send({ action: 'unsubscribe', data: { id, subscribe, forHour } });
}

/**
 * Retrieves the tenant agnostic mode.
 */
export function getTenantAgnosticMode() {
  driver.send({ action: 'getTenantAgnosticMode', data: {} });
}

/**
 * Updates the tenant agnostic mode.
 * @param {object} options - The options for updating the tenant agnostic mode.
 * @param {boolean} options.isTenantAgnostic - The flag indicating whether the tenant agnostic mode should be enabled or disabled.
 * @param {boolean} options.hidePlatformSelection - The flag indicating whether the platform selection should be hidden or shown.
 */
export function updateTenantAgnosticMode({ isTenantAgnostic, hidePlatformSelection }) {
  driver.send({ action: 'updateTenantAgnosticMode', data: { isTenantAgnostic, hidePlatformSelection } });
}

/**
 * (Bus notification) Sends a notification through the bus.
 * Publishes a notification to a specific topic.
 * @param {object} options - The options for publishing a notification.
 * @param {string} options.topic - The topic to publish the notification to.
 * @param {any} options.data - The data to include in the notification.
 */
export function publish({ topic, data }) {
  driver.send({ action: 'publish', data: { topic, data } });
}

/**
 * Filters notifications based on the provided criteria.
 * @param {FilterData} filterData - The filter options.
 */
export function filter({
  first_date,
  last_date,
  searches,
  read,
  unread,
  starred,
  unstarred,
  tenants,
  oldID,
  archive,
  groupIDs,
  clusterId,
}) {
  //
  setAnalyticsStartTime();

  // send the filter event
  driver.send({
    action: 'filter',
    data: setFilterOptionsPayload({
      first_date,
      last_date,
      searches,
      read,
      unread,
      starred,
      unstarred,
      tenants,
      oldID,
      archive,
      groupIDs,
      clusterId,
    }),
  });
}

/**
 * Deletes all filtered notifications based on the provided archive and notification ID.
 * @param {object} options - The options for deleting filtered notifications.
 * @param {object[{id, archive, clusterId}]} options.notificationID - The ID of the notification to be deleted.
 * @param {FilterData} options.filterData - The filter options.
 */
export function deleteAllFilteredNotification({ notificationID, filterData }) {
  const { filterOptions, clusters } = filterData ? setFilterOptionsPayload(filterData) : {};;
  driver.send({ action: 'deleteAllFilteredNotification', data: { notificationID, filterOptions, clusters } });
}

/**
 * Updates the settings for a notification sender.
 * @param {object} options - The options for updating the settings.
 * @param {boolean} options.subscribe - Indicates whether to subscribe to notifications.
 * @param {number} options.id - The ID of the sender.
 * @param {boolean} options.notif_by_browser - Indicates whether to receive notifications via browser.
 * @param {boolean} options.notif_by_email - Indicates whether to receive notifications via email.
 * @param {boolean} options.notif_by_ui - Indicates whether to receive notifications via UI.
 * @param {boolean} options.tenantAware - Indicates whether the sender is tenant-aware.
 * @s {Promise} A promise that resolves when the settings are updated.
 */
export function updateSettings({ subscribe, id, notif_by_browser, notif_by_email, notif_by_ui, tenantAware }) {
  driver.send({
    action: 'updateSettings',
    data: { subscribe, id, notif_by_browser, notif_by_email, notif_by_ui, tenantAware },
  });
}

/**
 * Resets the setting unsubscription date for a specific ID.
 * @param {object} options - The options object.
 * @param {string} options.id - The ID of the setting.
 */
export function resetSettingUnsubscriptionDate({ id }) {
  driver.send({
    action: 'resetSettingUnsubscriptionDate',
    data: { id },
  });
}

/**
 * Retrieves the settings from the server.
 * @s {Promise} A promise that resolves with the settings data.
 */
export function getSettings() {
  // setAnalyticsStartTime();
  driver.send({ action: 'getSettings', data: {} });
}

/**
 * Updates the unsubscribe date for a specific service.
 * @param {object} options - The options for updating the unsubscribe date.
 * @param {string} options.id - The ID of the service.
 * @param {Date} options.unsubscribe_date - The date to unsubscribe.
 * @param {boolean} options.frontEndUpdate - Indicates whether to use the unsubscribe_date received from the front end.
 */
export function updateUnsubscribeDate({ id, unsubscribe_date, frontEndUpdate }) {
  driver.send({ action: 'updateUnsubscribeDate', data: { id, unsubscribe_date, frontEndUpdate } });
}

/**
 * Rollback the popup confirmation for a specific file.
 * @param {object} options - The options for rollback.
 * @param {string} options.file - The file path.
 * @param {string} options.id - The ID of the popup confirmation.
 * @param {boolean} options.confirmPopupResult - The result of the confirmation popup.
 */
export function rollbackPopupconfirmation({ file, id, confirmPopupResult }) {
  driver.send({ action: 'rollbackPopupconfirmation', data: { id, file, confirmPopupResult } });
}

/**
 * Retrieves the socket status.
 * Will only be executed on center open.
 */
export function getSocketStatus() {
  driver.send({ action: 'getSocketStatus', data: { centerOpened: true } });
}

/**
 * Checks the status of the socket(manager will try to re-connect if not connected).
 */
export function checkSocketStatus() {
  driver.send({ action: 'checkSocketStatus', data: {} });
}

/**
 * Represents a collection of manager events.
 * @typedef {object} managerEvents
 * @property {Function} getSocketStatus - Retrieves the socket status.
 * @property {Function} checkSocketStatus - Checks the socket status.
 * @property {Function} getAppInfos - Retrieves application information.
 * @property {Function} getServices - Retrieves services.
 * @property {Function} publish - Publishes an event.
 */
export const managerEvents = {
  getSocketStatus,
  checkSocketStatus,
  getAppInfos,
  getServices,
  publish,
};

/**
 * @typedef {object} centerEvents
 * @property {Function} getUnreadTotal - Retrieves the total number of unread notifications.
 * @property {Function} getTenants - Retrieves the list of tenants.
 * @property {Function} resetBadge - Resets the badge count for notifications.
 * @property {Function} getHistory - Retrieves the notification history.
 * @property {Function} notificationRead - Marks a notification as read.
 * @property {Function} deleteAllNotification - Deletes all notifications.
 * @property {Function} notificationDelete - Deletes a specific notification.
 * @property {Function} unsubscribe - Unsubscribes from notifications.
 * @property {Function} getTenantAgnosticMode - Retrieves the tenant agnostic mode.
 * @property {Function} updateTenantAgnosticMode - Updates the tenant agnostic mode.
 * @property {Function} filter - Filters notifications based on criteria.
 * @property {Function} deleteAllFilteredNotification - Deletes all filtered notifications.
 * @property {Function} updateSettings - Updates notification settings.
 * @property {Function} resetSettingUnsubscriptionDate - Resets the unsubscription date for settings.
 * @property {Function} getSettings - Retrieves notification settings.
 * @property {Function} updateUnsubscribeDate - Updates the unsubscription date.
 * @property {Function} rollbackPopupconfirmation - Rolls back the popup confirmation.
 */
export const centerEvents = {
  getUnreadTotal,
  getTenants,
  resetBadge,
  getHistory,
  notificationRead,
  deleteAllNotification,
  notificationDelete,
  unsubscribe,
  getTenantAgnosticMode,
  updateTenantAgnosticMode,
  filter,
  deleteAllFilteredNotification,
  updateSettings,
  resetSettingUnsubscriptionDate,
  getSettings,
  updateUnsubscribeDate,
  rollbackPopupconfirmation,
};
