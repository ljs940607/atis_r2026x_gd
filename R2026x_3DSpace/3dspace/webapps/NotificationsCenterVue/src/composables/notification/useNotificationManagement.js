import { getUnreadTotal, notificationDelete } from '~/api/senders';
import useTranslations from '~/composables/useTranslations';
import { addAndSortIdsDesc, addAndSortNotifsDateDesc, replaceParenthesisStrong } from '~/functions/utils';
import { Notification } from '~/models/notification';
import { Section } from '~/models/section';
import useNotificationsStore from '~/stores/notifications';
import { filter, getHistory, getSettings, rollbackPopupconfirmation } from '../../api/senders';
import { NotificationTrackerUsage } from '../../api/tracker';
import { checkIfIdHasHyphen, linkIds } from '../../functions/utils';
import useFilterStore from '../../stores/filter';
import useSettingsStore from '../../stores/settings';
import { usePreferencesManagement } from '../preferences/usePreferencesManagement';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationCleaning } from './useNotificationCleaning';
import { useNotificationMenu } from './useNotificationMenu';
import { useNotificationResolution } from './useNotificationResolution';

const { $i18n } = useTranslations();

/**
 * Custom hook for managing notifications.
 * @returns {object} An object containing the UWA property.
 */
export function useNotificationManagement() {
  const store = useNotificationsStore();
  const settingStore = useSettingsStore();

  /**
   * Refreshes the center view by resetting states, setting loading state, and fetching data based on filter.
   * If no filter is applied, it fetches all history and unread total.
   * If a filter is applied, it filters the data based on the applied filter.
   * @param {boolean} [withSettings=true] - Indicates whether to fetch settings.
   */
  const refreshCenterView = (withSettings = true) => {
    const {isFilterApplied, getFilter } = useFilterStore();

    store.resetStates();
    store.setIsLoading(true);
    if (withSettings) getSettings();

    // Ensure that if no filter was applied, we use the default filter (unread notifications only)
    let payload;
    if (isFilterApplied()) {
      payload = getFilter();
    } else {
      payload = { ...getFilter(), unread: true};
      getUnreadTotal();
    }

    filter(payload);
  };

  /**
   * Refreshes the notification data without resetting states.
   * If no filter is applied, it retrieves the history of all notifications and updates the unread total.
   * If a filter is applied, it applies the filter to the notifications.
   * @param {boolean} [withSettings=true] - Indicates whether to fetch settings.
   * @param {object} data - The data object.
   */
  const refreshWithoutReset = (withSettings = true, groupIdToExclude = null) => {
    const { isFilterApplied, getFilter } = useFilterStore();
    if (withSettings) getSettings();
    
    // Ensure that if no filter was applied, we use the default filter (unread notifications only)
    let payload;
    if (isFilterApplied()) {
      payload = getFilter();
    } else {
      payload = { ...getFilter(), unread: true};
      getUnreadTotal();
    }
    if (groupIdToExclude) {
      if (payload.groupIDs && payload.groupIDs.length > 0 && payload.groupIDs.includes(groupIdToExclude)) {
        payload.groupIDs = payload.groupIDs.filter((groupId) => groupId !== groupIdToExclude);
      }
      payload.oldID = -1;
      payload.archive = false;
    }

    filter(payload);
  };

  /**
   * Sets a notification with the given data and options.
   * @param {object} notif - The notification object.
   * @param {object} options - The options for the notification.
   */
  const setNotif = (notif, options) => {
    //create group section if not exists & notification is a group
    if (Object.hasOwn(notif, 'COUNT') && notif.COUNT > 1) {
      const groupSection = [];
      store.groups.set(notif.GROUPID, groupSection);
    }
    // add to notifications
    store.notifications.set(notif.ID, notif);
    // add to section
    addNotificationToSection(notif);
  };

  /**
   * Adds notifications to the history.
   * @param {object} data - The data containing the notifications to be added.
   */
  const addHistory = (data) => {
    // use let instead of const
    const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
    const { cleanNotificationData } = useNotificationCleaning();
    const { setNotificationMenu } = useNotificationMenu();
    const { hasArchiveNotifications } = useNotificationManagement();
    const { isFilterApplied } = useFilterStore();
    const { addFilterNotifIds, oldID } = useNotificationsStore();
    const options = {
      appName: data.appName,
      currentTenant: data.currentTenant,
      clusterId: data.clusterId,
    };
    let oldId = -1;
    const previousOldID = oldID;
    data.notifications?.forEach((notification) => {
      // set oldID to the last notification ID with the same cluster ID
      store.addOldID(notification.ID, notification.CREATION_DATE, data.clusterId);
      // oldID = notification.ID;
      // parse, replace, etc...
      cleanNotificationData(notification);
      // add notification to store
      addNotification(notification, options);
      //
      const notif = store.getNotificationById(`${notification.ID}-${data.clusterId}`);
      // resolve the icon and action for the notification
      resolveNotificationIcon(notif);
      // resolve the action for the notification
      resolveNotificationAction(notif);
      // set notification menu
      setNotificationMenu(notif);
      // add groupID to the store
      if (notif.COUNT > 1) {
        store.addGroupId(notif.GROUPID);
      }
    });

    // set oldID to the last notification ID
    if (data.notifications?.length >= 19)
      oldId = store.clusterInOldIDs(data.clusterId)?.OLD_ID ?? oldId;
    else {
      // will set the archive state for future fetch
      setArchiveState();
    }
    store.setOldID(oldId);
  
    // set nb of unread notifications
    if (isFilterApplied()) {
      if (data.count) {
        let total;
        if(data.archive && store.loadingMore){
          total = store.filterTotal + (data.notifications?.length ?? 0);
        }
        else {
          total = (previousOldID === -1) ? data.count : store.filterTotal;
        }
        store.setFilterTotal(total);
        addFilterNotifIds(
          data.notifications?.map((n) => n.ID),
          data.clusterId,
          data.archive
        );
      }
    } else {
      if (data.archive) store.setUnreadTotal(store.unreadTotal + (data.notifications?.length ?? 0));
    }
    // set loading state to false if it was true
    if (store.isLoading) store.setIsLoading(false);
    // set loading more to false if it was true
    if (store.loadingMore) store.setLoadingMore(false);

    // let the user know that there are notifications in the archive
    if (hasArchiveNotifications(data.notifications)) setArchiveSectionMessage();
  };

  /**
   * Sets the notification merges based on the provided data.
   * @param {object} data - The data containing information about the notification merges.
   */
  const setNotifMerges = (data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const { cleanNotificationData } = useNotificationCleaning();
    const { resolveNotificationAction, resolveNotificationIcon } = useNotificationResolution();
    // add the cluster id to the notification id
    data.id = linkIds(data.id, data.clusterId);
    // get the main notification
    const main = store.getNotificationById(data.id);
    // reinit the mergesRead
    main.mergesRead = 0;

    const options = {
      appName: data.appName,
      currentTenant: data.currentTenant,
      clusterId: data.clusterId,
    };
    //
    data.notifications.forEach((notification) => {
      cleanNotificationData(notification);
      addMerge(notification, options);
      //
      let id = checkIfIdHasHyphen(notification.ID);
      if (!id) {
        id = `${notification.ID}-${data.clusterId}`;
      } else id = notification.ID;
      const merge = store.getMergeById(id);
      //
      resolveNotificationIcon(merge);
      resolveNotificationAction(merge);
      //
      setNotificationMenu(merge);
      // increment number of merges read if the notification is read
      if (merge.READ_DATE !== null) main.mergesRead += 1;
    });

    // for the read state
    if (main.mergesRead === main.COUNT) {
      if (!main.isRead) main.READ_DATE = new Date().toISOString();
      // getUnreadTotal();
    } else if (main.isRead) {
      main.READ_DATE = null;
    }

    // rebuild main menu
    setNotificationMenu(main);
    main.mergesFetched = true;
  };

  /**
   * Adds a merge notification to the notification center.
   * @param {object} notification - The notification object to be added.
   * @param {object} options - The options for the notification.
   */
  const addMerge = (notification, options) => {
    const groupSection = store.groups.get(notification.GROUPID);
    const merge = new Notification(notification, options, true);
    if (groupSection !== undefined) {
      const item = {
        id: merge.ID,
        groupID: merge.GROUPID,
        date: merge.getCreationDateToTimestamp,
      };
      // sort by date
      addAndSortNotifsDateDesc(groupSection, item);
      // add to groups
      store.groups.set(merge.GROUPID, groupSection);
      // add to merges
      store.merges.set(merge.ID, merge);
    }
  };

  /**
   * Adds a notification to the notification center.
   * @param {object} notification - The notification object to be added.
   */
  const addNotificationToSection = (notification) => {
    const sectionId = notification.getSection;
    let section = store.sectionList.get(sectionId);
    if (!section) {
      section = new Section(sectionId);
      if (!store.sectionListIds.includes(sectionId)) {
        addAndSortIdsDesc(store.sectionListIds, sectionId);
      }
    }
    const notifItem = {
      id: notification.ID,
      groupID: Object.hasOwn(notification, 'GROUPID') ? notification.GROUPID : null,
      date: notification.getCreationDateToTimestamp,
    };
    section.add(notifItem);
    if (!store.sectionList.has(sectionId)) store.sectionList.set(sectionId, section);
  };

  /**
   * Adds a notification to the notifications.
   * @param {object} notification - The notification object to be added.
   * @param {object} options - The options for the notification.
   * @param {boolean} [group=false] - Indicates whether the notification should be grouped.
   * @param {string} oldSectionId - The ID of the old section.
   * @param {string} oldNotifId - The ID of the old notification.
   */
  const addNotification = (notification, options, group = false, oldSectionId, oldNotifId) => {
    // check if group = true which means we need to redefine the notification
    let oldSection;
    if (group) {
      // remove old notification
      store.notifications.delete(oldNotifId);
      // remove from old section
      oldSection = store.sectionList.get(oldSectionId);
      oldSection.remove(oldNotifId);
      //
      if (oldSection.notifs.length === 0) {
        store.sectionList.delete(oldSectionId);
        store.sectionListIds = store.sectionListIds.filter((item) => item !== oldSectionId);
      }
    }
    //
    const notif = new Notification(notification, options);
    // remove the old notification if section is different
    const notifToReplace =
      store.getNotificationById(notif.ID) ??
      (notif.GROUPID !== null ? store.getNotificationByGroupId(notif.GROUPID) : null);
    if (
      notifToReplace &&
      (notifToReplace.getSection !== notif.getSection || notifToReplace.CREATION_DATE !== notif.CREATION_DATE)
    ) {
      deleteNotification(notifToReplace.ID, false, false);
      // remove old section if empty
      setNotif(notif, options);
    } else if (!notifToReplace) {
      setNotif(notif, options);
    }
  };

  const canBeAddedToGroup = (notification) => {
    if (notification.GROUPID === null) return false;
    const group = store.getNotificationByGroupId(notification.GROUPID);
    return group !== null;
  };

  /**
   * Adds a notification to a group.
   * @param {*} notification
   * @param {*} merge
   * @param {*} last
   */
  const addNotificationToGroup = (notification, merge = false, last = false) => {
    // get the group
    const group = store.getNotificationByGroupId(notification.GROUPID);
    // get old section id
    const oldSectionId = group.getSection;
    // get old group id
    const oldID = group.ID;
    // get the options
    const options = {
      currentTenant: group.currentTenant,
      appName: group.appName,
      clusterId: group.CLUSTER_ID,
    };
    // update the group notification
    updateGroupNotification(group, notification, merge, last);
    // add the new notification to the list
    addNotification(group, options, true, oldSectionId, oldID);
    // replace the number of persons in message
    if (!last) replaceGroupMessage(notification);
    if (notification.APPID === 'X3DDRIV_AP') {
      refreshWithoutReset(false);
    }
  };

  /**
   * Copies a notification to a group.
   * @param {object} group - The group to copy the notification to.
   * @param {object} notification - The notification to be copied.
   * @param {boolean} [merge=false] - Indicates whether to merge the notification with the group.
   * @param {boolean} [last=false] - Indicates whether the copied notification is the last one.
   */
  const updateGroupNotification = (group, notification, merge = false, last = false) => {
    if (!merge) group.COUNT = group.COUNT + 1;
    else if (last) group.COUNT = 1;
    // update the notification
    for (const [key, value] of Object.entries(notification)) {
      if (key === 'CREATION_DATE' || key === 'READ_DATE' || key === 'ACTION_DATE') {
        group[key] = value !== null ? new Date(value) : null;
      } else if (key !== 'COUNT') group[key] = value;
    }
  };

  /**
   * Replaces the group message in a notification.
   * @param {object} notification - The notification object.
   */
  const replaceGroupMessage = (notification) => {
    let newGroup = store.getNotificationById(notification.ID);
    if (!newGroup) newGroup = store.getNotificationByGroupId(notification.GROUPID);
    // replace the string in message
    if (newGroup) {
      let currMsg = newGroup.MESSAGE.nls.msg;
      let newMessage =
        notification.APPID === 'X3DDRIV_AP'
          ? `<strong>${newGroup.COUNT}</strong>`
          : `<strong>${newGroup.COUNT} ${$i18n('Persons')}</strong>`;
      currMsg = replaceParenthesisStrong(currMsg, newMessage);
      // remove the message content in community access request
      if (newGroup.MESSAGE.nls.data.NOTIFIER_MESSAGE) {
        currMsg = currMsg.replace(`. ${newGroup.MESSAGE.nls.data.NOTIFIER_MESSAGE}`, '');
      }
      //
      newGroup.MESSAGE.nls.msg = currMsg;
    }
  };

  /**
   * Deletes a notification group.
   * @param {number} id - The ID of the notification group to delete.
   */
  const DeleteNotificationGroup = (id) => {};

  /**
   * Removes a notification by its ID.
   * @param {string} id - The ID of the notification to be removed.
   * @returns {void}
   */
  const removeNotification = (id) => {
    const _isMerge = isMerge(id);
    if (_isMerge) {
      removeMerge(id);
    } else {
      // Current feature
      // decrement unread total if the notification is unread
      deleteNotification(id);
    }
  };

  /**
   * Removes a notification group by its ID.
   * @param {number} id - The ID of the notification group to remove.
   */
  const removeNotificationGroup = (id) => {
    deleteNotification(id);
  };

  /**
   *  Deletes a notification by its ID.
   * @param {*} id - The ID of the notification to delete.
   * @param {*} editTotal - Indicates whether to edit the totalFilter and unreadTotal. Used when deletina a notification for replacing it with a new one.
   * @param {*} fetchMore - Indicates whether to fetch more notifications if necessary.
   */
  const deleteNotification = (id, editTotal = true, fetchMore = true) => {
    const { isFilterApplied } = useFilterStore();
    const notification = store.getNotificationById(id);
    //
    if (editTotal) {
      if (!notification.isRead && !notification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      if (isFilterApplied()) store.setFilterTotal(store.filterTotal - 1);
    }
    // if selected, remove from selected
    store.selected.splice(store.selected.indexOf(id), 1);
    // remove from sectionList
    const sectionId = store.getNotificationById(id).getSection;
    const section = store.sectionList.get(sectionId);
    section?.remove(id);
    //
    if (section?.notifs.length === 0) {
      store.sectionList.delete(section.id);
      // remove from sectionListIds
      store.sectionListIds = store.sectionListIds.filter((item) => item !== section.id);
    }
    // todo: remove from merges if merges exist
    // remove from notifications map
    store.notifications.delete(id);
    store.removeFilterNotifId(id);
    // check if has merge then delete merges too
    if (isGroup(id)) {
      const group = store.getNotificationById(id);
      const merges = store.groups.get(group.GROUPID);
      const idsToDelete = [];
      // get all merges ids
      merges.forEach((item) => {
        idsToDelete.push(item.id);
      });
      // delete all merges
      idsToDelete.forEach((id) => {
        store.merges.delete(id);
      });
      store.groups.delete(group.GROUPID);
    }
    // check if store empty then set unread total to 0
    if (store.notifications.size === 0) {
      store.setUnreadTotal(0);
      store.setFilterTotal(0);
    }
    // if size < 19 or 40 depending if filter is applied
    if (fetchMore) fetchMoreNotificationsIfNecessary();
  };

  /**
   * Returns the number of merges for a given group ID.
   * @param {string} groupId - The ID of the group.
   * @returns {number} The number of merges for the group.
   */
  const mergesNumber = (groupId) => {
    // return store.groups.get(groupId).length;
    return store.getNotificationByGroupId(groupId).COUNT;
  };

  /**
   * Removes a merge by its ID.
   * If the merge is the last one in its group, replaces the main notification with the last merge.
   * If there are more than one merge left in the group, replaces the main notification with the next merge.
   * Deletes the group if there is only one merge left.
   * @param {string} id - The ID of the merge to be removed.
   */
  const removeMerge = (id) => {
    const { setNotificationMenu } = useNotificationMenu();
    // save the group id
    const groupID = store.getMergeById(id).GROUPID;
    // delete the merge
    deleteMerge(id);
    // get number of merges left
    const nbMerges = mergesNumber(groupID);
    // only one merge left
    if (nbMerges === 1) {
      // get the last merge
      const lastMerge = store.getMergeByGroupId(groupID);
      // replace the main notification by the last merge
      addNotificationToGroup(lastMerge, true, true);
      // delete group because there is only one merge left
      store.groups.delete(groupID);
      // delete the last merge from the merges map
      store.merges.delete(lastMerge.ID);
      // rebuild the notification menu
      const normalNotif = store.getNotificationByGroupId(groupID);
      //
      setNotificationMenu(normalNotif);
    }
    // more than one merge left
    else {
      // check if the merge is the main notification
      if (isIdMainId(id)) {
        // get the first next merge in the list
        const nextMerge = store.getMergeByGroupId(groupID);
        // replace the main notification by the next first merge in the list
        addNotificationToGroup(nextMerge, true, false);
        // rebuild the notification menu
        setNotificationMenu(nextMerge);
      } else {
        // just replace the group message
        replaceGroupMessage(store.getNotificationByGroupId(groupID));
      }
    }
  };

  /**
   * Deletes a merge notification by its ID.
   * @param {string} id - The ID of the merge notification to delete.
   */
  const deleteMerge = (id) => {
    const merge = store.getMergeById(id);
    if (merge !== undefined) {
      const groupSection = store.groups.get(merge.GROUPID);
      groupSection.splice(
        groupSection.findIndex((item) => item.id === id),
        1
      );
      store.groups.set(merge.GROUPID, groupSection);
      store.merges.delete(id);
    }
    // decrement the count of the group
    const group = store.getNotificationByGroupId(merge.GROUPID);
    group.COUNT = group.COUNT - 1;
  };

  /**
   * Checks if a merge with the given ID exists in the store.
   * @param {string} id - The ID of the merge to check.
   * @returns {boolean} - True if a merge with the given ID exists in the store, false otherwise.
   */
  const isMerge = (id) => {
    const merge = store.getMergeById(id);
    return merge !== null && merge.isMerge;
  };

  /**
   * Checks if a notification is a group notification given a id.
   * @param {string} id - The ID of the notification.
   * @returns {boolean} - Returns true if the notification is a group notification, false otherwise.
   */
  const isGroup = (id) => {
    const notif = store.getNotificationById(id);
    return notif !== null && notif.isGroup;
  };

  /**
   * Check if a notification is a group or not.
   * @param {Notification} notification
   * @returns
   */
  const isNotificationGroup = (notification) => {
    return notification.isGroup || (Object.hasOwn(notification, 'COUNT') && notification.COUNT > 1);
  };

  /**
   * Checks if a notification is a normal notification.
   * @param {string} id - The ID of the notification.
   * @returns {boolean} - Returns true if the notification is a normal notification, false otherwise.
   */
  const isNormalNotification = (id) => {
    const notif = store.getNotificationById(id);
    return notif !== null && !notif.isGroup && !notif.isMerge;
  };

  /**
   * Checks if the given ID matches the main ID of a notification.
   * @param {string} id - The ID to check.
   * @returns {boolean} - Returns true if the ID matches the main ID of a notification, false otherwise.
   */
  const isIdMainId = (id) => {
    const notification = store.getNotificationById(id);
    return notification !== null;
  };

  /**
   * Checks if a merge is the main notification.
   * @param {string} id - The ID of the merge.
   * @returns {boolean} - True if the merge is the main notification, false otherwise.
   */
  const mergeIsMain = (id) => {
    const merge = store.getMergeById(id);
    return merge !== null && store.notifications.has(merge.ID);
  };

  /**
   * Checks if the given notification ID is associated with a merge operation.
   * @param {string} id - The ID of the notification.
   * @returns {boolean} - Returns true if the notification is associated with a merge operation, false otherwise.
   */
  const mainIsMerge = (id) => {
    const notif = store.getNotificationById(id);
    return notif !== null && store.merges.has(notif.ID);
  };

  /**
   * Tries to delete a notification by marking it as deleted and scheduling its deletion from the store.
   * @param {string} id - The ID of the notification to delete.
   * @param {boolean} [merge=false] - Indicates whether the notification is a merge notification.
   * @param {boolean} group - Indicates whether the notification is a group notification.
   * @param {boolean} archive - Indicates whether the notification is from the archive.
   * @param withCancelation
   */
  const tryNotificationDeletion = (id, merge = false, group = false, archive = false, withCancelation = true) => {
    // todo: show this as feature
    // todo: dont forget to update if there is only one merge left
    const { centerActionTracker } = NotificationTrackerUsage();
    const theCenterActionTracker = centerActionTracker();
    let notification;
    if (group || !merge) notification = store.getNotificationById(id);
    else notification = store.getMergeById(id);

    if (withCancelation) {
      /**----------------- Deletion with cancelation ----------------- */
      // set notification as deleted
      notification.deleted = true;
      // clear timeout if exists
      clearTimeout(notification.deleteTimeoutId);
      // set timeout to delete notification
      // if not cancelled within 5 seconds, delete notification from store
      notification.deleteTimeoutId = setTimeout(() => {
        if (notification.deleted) {
          if (group) {
            notificationDelete({
              id,
              archive,
              clusterId: notification.CLUSTER_ID,
              groupID: notification.GROUPID,
              read: notification.isRead,
            });
          } else
            notificationDelete({
              id,
              archive,
              clusterId: notification.CLUSTER_ID,
              read: notification.isRead,
            });

          // analytics
          theCenterActionTracker.notificationDelete({
            persDim: {
              pd1: notification.isMerge ? 'merge' : notification.isGroup ? 'group' : 'normal',
            },
          });
        }
        clearTimeout(notification.deleteTimeoutId);
      }, 5000);
    } else {
      /**--------------------Deletion without Cancelation------------------- */
      if (group) {
        notificationDelete({
          id,
          groupID: notification.GROUPID,
          read: notification.isRead,
          clusterId: notification.CLUSTER_ID,
          archive,
        });
      } else
        notificationDelete({
          id,
          clusterId: notification.CLUSTER_ID,
          read: notification.isRead,
          archive,
        });

      // analytics
      theCenterActionTracker.notificationDelete({
        persDim: {
          pd1: notification.isMerge ? 'merge' : notification.isGroup ? 'group' : 'normal',
          pd4: `clusterId=${notification.CLUSTER_ID}`,
        },
      });
    }
  };

  /**
   * Return a string of the type of the notification given an id.
   * @param {number} id - The ID of the notification.
   * @returns {string} - Type of the notification.
   */
  const notificationType = (id) => {
    return isMerge(id) ? 'merge' : isGroup(id) ? 'group' : 'normal';
  };

  /**
   * Sets the read state and starred state of a notification.
   * @param {object} notifData - The notification data.
   * @param {object} data - The data containing the read and starred states.
   */
  const setNotificationReadState = (notifData, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    // check if the notification is already read
    if (data.read !== undefined) {
      // increment/decrement the unread total
      // if the notification is not a group
      // then we need to update the unread total
      if (!Object.hasOwn(notifData, 'hasMerges')) {
        // update the read date for the notification
        notifData.READ_DATE = data.read ? new Date().toISOString() : null;
        store.setUnreadTotal(data.read ? store.unreadTotal - 1 : store.unreadTotal + 1);
      } else {
        // set the read date for the notification if is group
        notifData.READ_DATE = notifData.mergesRead === notifData.COUNT ? new Date().toISOString() : null;
      }
    }
    // check if notification is starred
    else if (data.starred !== undefined) {
      notifData.STARRED = data.param;
    }
    // rebuild the menu options for the current notification
    setNotificationMenu(notifData);
  };

  /**
   * Sets the merge read state for a notification.
   * @param {object} mergeData - The merge data object.
   * @param {object} data - The data object containing the read state.
   */
  const setMergeReadState = (mergeData, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const mainNotification = store.getNotificationByGroupId(mergeData.GROUPID);
    //
    if (data.read !== undefined) {
      // check if the notification has same ID as the merge
      if (data.read) {
        // already read, no need to increment
        if (!mergeData.isRead) mainNotification.mergesRead = mainNotification.mergesRead + 1;
      } else {
        // already unread, no need to decrement
        if (mergeData.isRead) mainNotification.mergesRead = mainNotification.mergesRead - 1;
      }
      mergeData.READ_DATE = data.read ? new Date().toISOString() : null;
    }
    // rebuild the menu options for the current notification
    setNotificationMenu(mergeData);
    //
    // check in nbmergeread = COUNT
    // check if all merges are read
    if (mainNotification.mergesRead === mainNotification.COUNT) {
      if (!mainNotification.isRead) {
        mainNotification.READ_DATE = new Date().toISOString();
        if (!mainNotification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      }
    }
    // check if last read_date is not null, then it means one of the merges is unread
    else if (!data.read && mainNotification.isRead) {
      mainNotification.READ_DATE = null;
      if (!mainNotification.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal + 1);
    }
    // rebuild the menu options for the group
    setNotificationMenu(mainNotification);
  };

  /**
   * Sets the read state of a notification group.
   * @param {string} id - The ID of the notification group.
   * @param {object} data - The data object containing the read state and/or starred state.
   * @param {boolean} [data.read] - The read state of the notification group.
   * @param {boolean} [data.starred] - The starred state of the notification group.
   * @returns {void}
   */
  const setGroupReadState = (id, data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const group = store.getNotificationById(id);
    if (data.read !== undefined) {
      if (data.read) {
        group.READ_DATE = new Date().toISOString();
        // check if merges are fetched
        if (group.mergesFetched) {
          const merges = store.groups.get(group.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            mergeItem.READ_DATE = new Date().toISOString();
            setNotificationMenu(mergeItem);
          });
        }
        //
        group.mergesRead = group.COUNT;
        if (!group.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal - 1);
      } else {
        group.READ_DATE = null;
        if (group.mergesFetched) {
          const merges = store.groups.get(group.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            mergeItem.READ_DATE = null;
            setNotificationMenu(mergeItem);
          });
        }
        //
        group.mergesRead = 0;
        if (!group.FROM_ARCHIVE) store.setUnreadTotal(store.unreadTotal + 1);
      }
    } else if (data.starred !== undefined) {
      group.STARRED = data.param;
    }
    // rebuild the menu options for the current notification
    setNotificationMenu(group);
  };

  /**
   * Sets the read state of all notifications.
   * @param {object} data - The data object containing the read state.
   * @param {boolean} data.read - The read state to set for the notifications.
   */
  const setAllReadState = (data) => {
    const { setNotificationMenu } = useNotificationMenu();
    const { isFilterApplied } = useFilterStore();
    store.notifications.forEach((notification) => {
      if (data.read) {
        notification.READ_DATE = new Date().toISOString();
      } else notification.READ_DATE = null;
      // check if the notification is a group
      if (isGroup(notification.ID)) {
        // check if merges are fetched
        if (notification.mergesFetched) {
          const merges = store.groups.get(notification.GROUPID);
          merges.forEach((merge) => {
            const mergeItem = store.getMergeById(merge.id);
            if (data.read) mergeItem.READ_DATE = new Date().toISOString();
            else mergeItem.READ_DATE = null;
            setNotificationMenu(mergeItem);
          });
          //
          notification.mergesRead = notification.COUNT;
        }
      }
      setNotificationMenu(notification);
    });
    if (!isFilterApplied()) {
      if (data.read) store.setUnreadTotal(0);
      else getUnreadTotal();
    }
  };

  /**
   * Unsubscribes a notification based on the provided setting and notification ID.
   * @param {object} options - The options for unsubscribing a notification.
   * @param {object} options.setting - The setting object containing subscription details.
   * @param {number} options.notifID - The ID of the notification to unsubscribe.
   */
  const unsubscribeNotification = ({ setting, notifID }) => {
    //
    if (setting.SUBSCRIBE === 0 || setting.UNSUBSCRIBE_DATE !== null) {
      //
      const idsToDelete = [];
      store.notifications.forEach((notification) => {
        if (notification.SERVICE_ID === setting.ID) {
          // save the notification ID to delete(not hard delete, just remove from store)
          idsToDelete.push(notification.ID);
        }
      });
      idsToDelete.forEach((id) => {
        deleteNotification(id, true, false);
      });

      if (setting.UNSUBSCRIBE_DATE !== null) {
        // todo: uncomment this code below when adding unsubscribed date checkbox to the settings
        // because notifications have specific service id not the global one
        // if (setting.NAME === 'GLOBAL') {
        //   // console.log('GLOBAL');
        //   refreshCenterView(false);
        // }

        // add to the unsubscribed list to trigger resetUnsubscribed_date when timeout is reached
        settingStore.addUnsubscribe_dateSetting(setting.ID);
      }
      // will refresh the center view if the setting is not global
      // useful when unsubscribing from a notification, it will remove the current notifications from the center view and refresh the view to get the latest notifications
      // if (setting.NAME !== 'GLOBAL') {
      //   refreshWithoutReset(true);
      // }
    }
  };

  /**
   * Updates the label of a notification.
   * @param {object} params - The parameters for updating the label.
   * @param {boolean} params.isMerge - Indicates if the notification is a merge notification.
   * @param {string} params.id - The ID of the notification.
   * @param {string} params.label - The new label for the notification.
   */
  const updateLabel = (params) => {
    const { updateActionedLabel } = useNotificationActions();
    let notification;
    if (params.isMerge) notification = store.getMergeById(params.id);
    else notification = store.getNotificationById(params.id);
    updateActionedLabel(notification, params.label, false);
  };

  /**
   * Sets the actioned status for a notification.
   * @param {object} params - The parameters for setting the actioned status.
   * @param {boolean} params.isMerge - Indicates if the notification is a merge.
   * @param {string} params.id - The ID of the notification.
   */
  const setActioned = (params) => {
    const { updateActionedLabel } = useNotificationActions();
    let notification;
    let group;
    if (params.isMerge) {
      notification = store.getMergeById(params.id);
      group = store.getNotificationByGroupId(notification.GROUPID);
    } else notification = store.getNotificationById(params.id);
    // set the action date
    if (!notification.isActioned) notification.actionNotification();
    // check if all merges are actioned
    let allActioned = true;
    if (group) {
      const merges = store.groups.get(group.GROUPID);
      merges.forEach((item) => {
        const merge = store.getMergeById(item.id);
        if (!merge.isActioned) {
          allActioned = false;
          return;
        }
      });
      if (allActioned) {
        updateActionedLabel(group, 'do not matter', false);
        group.actionNotification();
      }
    }
  };

  /**
   * Sets the archive state based on the current state of the store.
   */
  const setArchiveState = () => {
    const { isFilterApplied, getFilter } = useFilterStore();
    if (store.canLoadMoreHistory) {
      // No more to load from history.
      store.setCanLoadMoreHistory(false);
      if (!store.canLoadMoreFromArchive) {
        // Will be fetching from archive from now on.
        store.setCanLoadMoreFromArchive(true);
        // check there is less than 40 notifs then fetch from archive
        if (
          (store.notifications.size < 40 && !isFilterApplied()) ||
          (store.notifications.size < 19 && isFilterApplied())
        ) {
          // console.log('fetching archived notifications ...');
          // set to true to show loading icon at the bottom of the scrollbar
          store.setLoadingMore(true);
          const data = {
            ...(isFilterApplied() && {
              ...getFilter(),
            }),
            ...(!isFilterApplied() && {
              type: 'all',
            }),
            archive: true,
          };
        } else {
          store.setOldID(-1);
        }
      }
    } else {
      if (store.canLoadMoreFromArchive) {
        // No more to load from archive.
        store.setCanLoadMoreFromArchive(false);
      }
    }
  };

  /**
   * Checks if the given array of notifications has any archived notifications.
   * @param {Array} notifications - The array of notifications to check.
   * @returns {boolean} - True if there are archived notifications, false otherwise.
   */
  const hasArchiveNotifications = (notifications) => {
    return notifications.some((notification) => notification.FROM_ARCHIVE);
  };

  /**
   * Sets the archive section message.
   */
  const setArchiveSectionMessage = () => {
    if (store.canLoadMoreFromArchive) {
      const { messageNotice } = usePreferencesManagement();
      messageNotice($i18n('archiveAlert'), 10000);
    }
  };
  // eslint-disable-next-line jsdoc/require-description
  /**
   *
   * @param {object} notification
   * @param {{first_date: Date, last_date: Date, searches: string[], read: boolean, unread: boolean, starred: boolean, unstarred: boolean,tenants:[]}} filter
   */
  const notificationInFilterRange = (notification, filter) => {
    const creationDate = new Date(notification.CREATION_DATE);

    // DATE
    // if no dates provided, accept everything; else normalize and check
    let inDateRange = true;
    if(filter.first_date && filter.last_date) {
      //Both start and last dates provided
      filter.first_date.setHours(0, 0, 0, 0);
      filter.last_date.setHours(23, 59, 59, 999);
      inDateRange = creationDate >= filter.first_date && creationDate <= filter.last_date;
    } else if (filter.first_date) {
      // Only start date
      filter.first_date.setHours(0, 0, 0, 0);
      inDateRange = creationDate >= filter.first_date;
    } else if (filter.last_date) {
      // Only end date
      filter.last_date.setHours(23, 59, 59, 999);
      inDateRange = creationDate <= filter.last_date;
    }

    // SEARCH
    const inSearchesRange =
      filter.searches.length === 0 ||
      filter.searches.some((search) => {
        return notification.MESSAGE.nls.msg.toLowerCase().includes(search.toLowerCase());
      });

    // CHECKBOXES
    const inReadRange = filter.read === true && notification.READ_DATE !== null;
    const inUnreadRange = filter.unread === true && notification.READ_DATE === null;
    const inStarredRange = filter.starred === true && notification.STARRED === 1;
    const inUnstarredRange = filter.unstarred === true && (!notification.STARRED || notification.STARRED === 0);

    const bothReadAndUnread =
      (filter.read === true && filter.unread === true) || (filter.read === false && filter.unread === false);
    const bothStarredAndUnstarred =
      (filter.starred === true && filter.unstarred === true) ||
      (filter.starred === false && filter.unstarred === false);

    const defaultRange = bothReadAndUnread && bothStarredAndUnstarred;

    // TENANTS
    const inTenantRange =
      filter.tenants.length === 0 || filter.tenants.some((tenant) => tenant.value === notification.PLATFORMID);

    return (
      inDateRange &&
      inSearchesRange &&
      (defaultRange ||
        ((bothReadAndUnread || inReadRange || inUnreadRange) &&
          (bothStarredAndUnstarred || inStarredRange || inUnstarredRange))) &&
      inTenantRange
    );
  };

  /**
   * Fetches more notifications if necessary.
   */
  const fetchMoreNotificationsIfNecessary = () => {
    if (store.canLoadMoreHistory || store.canLoadMoreFromArchive) {
      const { isFilterApplied, getFilter } = useFilterStore();
      let hasFetched = false;
      if (isFilterApplied()) {
        if (store.notifications.size < 19) {
          if (store.oldID !== -1) {
            const data = {
              ...getFilter(),
              oldID: store.oldID,
              groupIDs: store.groupIDs,
              ...(store.canLoadMoreFromArchive && {
                archive: true,
              }),
            };
            // set to true to show loading icon at the bottom of the scrollbar
            if (!store.isLoading) store.setLoadingMore(true);
            filter(data);
            hasFetched = true;
          }
        }
      } else {
        if (store.notifications.size < 40) {
          if (store.oldID !== -1) {
            const data = {
              type: 'all',
              oldID: store.oldID,
              groupIDs: store.groupIDs,
              ...(store.canLoadMoreFromArchive && {
                archive: true,
              }),
            };
            // set to true to show loading icon at the bottom of the scrollbar
            if (!store.isLoading) store.setLoadingMore(true);
            getHistory(data);
            getUnreadTotal();
            hasFetched = true;
          }
        }
      }
      // useful because called in responseHandler in deleteAllFilteredNotifications
      if (!hasFetched) {
        store.setLoadingMore(false);
        store.setIsLoading(false);
      }
    } else {
      store.setLoadingMore(false);
      store.setIsLoading(false);
    }
  };

  /**
   * Cancels the deletion of a notification.
   * @param {string} id - The ID of the notification.
   * @param {boolean} [merge=false] - Indicates whether the notification is a merge.
   */
  const cancelDeletion = (id, merge = false) => {
    const { centerActionTracker } = NotificationTrackerUsage();
    let notif;
    if (merge) {
      if (isMerge(id)) {
        notif = store.getMergeById(id);
      }
    } else {
      notif = store.getNotificationById(id);
    }
    if (notif) {
      notif.deleted = false;
      clearTimeout(notif.deleteTimeoutId);
      // analytics
      centerActionTracker().cancelNotificationDeletion({
        persDim: {
          pd1: notif.isMerge ? 'merge' : notif.isGroup ? 'group' : 'normal',
        },
      });
    }
  };

  /**
   * Loads more notifications.
   * This function checks if it is possible to load more notifications and then triggers the appropriate action.
   * If a filter is applied, it uses the filter data to load more notifications.
   * If no filter is applied, it loads more data.
   */
  const loadMoreNotifications = () => {
    if (store.loadingMore || store.isLoading) return;
    if (store.canLoadMoreHistory === true || store.canLoadMoreFromArchive === true) {
      // set loading more to true
      // console.log(store.oldID, 'oldID');
      store.setLoadingMore(true);
      // todo: if filter applied then use filter()
      let timeout = setTimeout(() => {
        const { isFilterApplied, getFilter } = useFilterStore();
        const data = {
          ...(!isFilterApplied() && {
            type: 'all',
          }),
          ...(isFilterApplied() && {
            ...getFilter(),
          }),
          ...(store.oldID !== -1 && {
            oldID: store.oldID,
          }),
          groupIDs: store.groupIDs,
          ...(store.canLoadMoreFromArchive && {
            archive: true,
          }),
        };
        if (isFilterApplied()) {
          filter(data);
        } else {
          // if no filter applied, get all history
          getHistory(data);
        }
        clearTimeout(timeout);
      }, 500); // 500ms delay to show loading icon to the user
    }
  };

  /**
   * Rollback popup action.
   * @param {object} data - The data object.
   */
  const rollbackPopupAction = async (data) => {
    if (Object.keys(data.params).length) {
      const { alertConfirmNotice } = usePreferencesManagement();
      let renderToDoc, title;
      if (data.params.isInNotifCenter) {
        renderToDoc = document.body;
        title = $i18n('rollbackPopupTitleForNotifCenter');
      } else {
        renderToDoc = parent.document.body;
        title = $i18n('rollbackPopupTitleFor3DDashboard');
      }
      // set the renderToDoc in the store
      store.setRenderToDoc(renderToDoc);
      // show the popup
      alertConfirmNotice({ title, msg:  $i18n('rollbackPopupMsg') }, (result) => {
        // send the result to the rollbackPopupconfirmation
        rollbackPopupconfirmation({ file: data.params.file, id: data.params.id, confirmPopupResult: result });
        // reset the renderToDoc in the store
        store.resetRenderToDoc();
      });
    }
  };

  return {
    refreshCenterView,
    addHistory,
    addMerge,
    setNotifMerges,
    updateLabel,
    addNotificationToSection,
    addNotification,
    removeNotification,
    removeMerge,
    isMerge,
    setActioned,
    isGroup,
    isNotificationGroup,
    mergeIsMain,
    mainIsMerge,
    tryNotificationDeletion,
    isNormalNotification,
    notificationType,
    canBeAddedToGroup,
    addNotificationToGroup,
    updateGroupNotification,
    replaceGroupMessage,
    DeleteNotificationGroup,
    deleteNotification,
    deleteMerge,
    mergesNumber,
    isIdMainId,
    removeNotificationGroup,
    setNotificationReadState,
    setMergeReadState,
    setGroupReadState,
    setAllReadState,
    unsubscribeNotification,
    setArchiveState,
    setArchiveSectionMessage,
    hasArchiveNotifications,
    notificationInFilterRange,
    fetchMoreNotificationsIfNecessary,
    cancelDeletion,
    loadMoreNotifications,
    refreshWithoutReset,
    rollbackPopupAction,
  };
}
