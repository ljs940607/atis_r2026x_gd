import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { useNotificationManagement } from '~/composables/notification/useNotificationManagement';
import { Notification } from '~/models/notification';

/**
 * Notification store.
 */
const useNotificationsStore = defineStore('notifications', () => {
  //
  // #region STATE

  /**
   * Represents the cluster ID.
   * @type {string}
   */
  const clusterId = ref('');

  /**
   * Sets the cluster ID.
   * @param {string} id - The ID of the cluster.
   */
  const setClusterId = (id) => {
    if (typeof id === 'string') clusterId.value = id;
  };

  /**
   * Checks if the given ID is the current cluster ID.
   * @param {any} id - The ID to check against the current cluster ID.
   * @returns {boolean} - Returns true if the given ID is the current cluster ID, otherwise returns false.
   */
  const isCurrentCluster = (id) => {
    return clusterId.value === id;
  };

  /**
   * Indicates whether the center frame is opened or not.
   */
  const centerFrameOpened = ref(false);

  /**
   * Sets the state of the center frame.
   * @param {boolean} opened - Indicates whether the center frame is opened or not.
   */
  const setCenterFrameOpened = (opened) => {
    centerFrameOpened.value = opened;
  };
  /**
   * If Center is loading.
   * @type {ref<boolean>}
   */
  const isLoading = ref(true);

  /**
   * Reference to the dispose message.
   */
  const dispose = ref(null);

  /**
   * Indicates whether more data is loading.
   * @type {boolean}
   */
  const loadingMore = ref(false);

  /**
   * Indicates whether it is the first fetch or not.
   * @type {boolean}
   */
  const filterQuery = ref(false);

  /**
   * Indicates whether more data can be loaded.
   * @type {Ref<boolean>}
   */
  const canLoadMoreHistory = ref(true);

  /**
   * Represents a reference to a document element used for rendering.
   * @type {null}
   */
  const renderToDoc = ref(null);

  /**
   * Computes whether the renderToDoc value is not null.
   * @returns {boolean} True if the renderToDoc value is not null, false otherwise.
   */
  const hasRenderToDoc = computed(() => renderToDoc.value !== null);

  /**
   * Sets the value of renderToDoc.
   * @param {any} doc - The document value to set.
   */
  const setRenderToDoc = (doc) => {
    renderToDoc.value = doc;
  };

  /**
   * Resets the value of renderToDoc to null.
   */
  const resetRenderToDoc = () => {
    renderToDoc.value = null;
  };

  /**
   * Indicates whether more data can be loaded from the archive.
   * @type {boolean}
   */
  const canLoadMoreFromArchive = ref(false);

  /**
   * Total of unread notifications.
   * @type {Ref<number>}
   */
  const unreadTotal = ref(0);

  /**
   * Sets number of unread notifications.
   * @param {number} nbUnread - Number of unread notifications.
   */
  const setUnreadTotal = (nbUnread) => {
    let counter = 0;
    if (typeof nbUnread === 'number') {
      counter = nbUnread;
    } else {
      counter = parseInt(nbUnread);
    }
    unreadTotal.value = counter;
  };

  // New part for federation still in progress ------------------------------
  const unreadTotalFederation = ref([]);

  /**
   * Sets the unread total for a specific federation cluster.
   * @param {object} options - The options for setting the unread total.
   * @param {number} options.unread - The number of unread notifications.
   * @param {string} options.clusterId - The ID of the federation cluster.
   */
  const setUnreadTotalFederation = ({ unread, clusterId }) => {
    const find = unreadTotalFederation.value.find((n) => n.clusterId === clusterId);
    if (!find) unreadTotalFederation.value.push({ unread, clusterId });
    else {
      find.unread = unread;
    }
  };

  /**
   * Calculates the total number of unread notifications in the federations.
   * @returns {number} The total number of unread notifications.
   */
  const getUnreadTotalFederation = computed(() => {
    return unreadTotalFederation.value.map((n) => n.unread).reduce((a, b) => a + b, 0);
  });

  // update the total unread when the federation unreadTotalFederation is updated
  watch(
    () => getUnreadTotalFederation.value,
    (value) => {
      setUnreadTotal(value);
    },
    { immediate: true, deep: true }
  );
  // ------------------------------ New part for federation still in progress

  /**
   * The total number of filtered items.
   * @type {Ref<number>}
   */
  const filterTotal = ref(0);

  /**
   * Represents the old ID.
   * @type {Ref<number>}
   */
  const oldID = ref(-1);

  /**
   * @type {Ref<Array>} - [{ OLD_ID, CREATION_DATE, CLUSTER_ID }].
   */
  const oldIDs = ref([]);

  /**
   * Finds a cluster in the oldIDs array based on the given clusterId.
   * @param {string} clusterId - The clusterId to search for.
   * @returns {object|undefined} - The found cluster object or undefined if not found.
   */
  const clusterInOldIDs = (clusterId) => {
    return oldIDs.value.find((item) => item.CLUSTER_ID === clusterId);
  };

  /**
   * Adds an old ID to the list of old IDs.
   * @param {string} OLD_ID - The old ID to add.
   * @param {Date} CREATION_DATE - The creation date of the old ID.
   * @param {string} CLUSTER_ID - The cluster ID associated with the old ID.
   */
  const addOldID = (OLD_ID, CREATION_DATE, CLUSTER_ID) => {
    const old_id_data = clusterInOldIDs(CLUSTER_ID);
    if (!old_id_data) {
      oldIDs.value.push({ OLD_ID, CREATION_DATE, CLUSTER_ID });
    } else {
      // check if the date is more old
      if (old_id_data.CREATION_DATE > CREATION_DATE) {
        old_id_data.OLD_ID = OLD_ID;
        old_id_data.CREATION_DATE = CREATION_DATE;
      }
    }
  };

  /**
   * Array of group IDs.
   * @type {Ref<Array>}
   */
  const groupIDs = ref([]);

  /**
   * Array of filtered notification IDs.
   * @type {Ref<Array>}
   */
  const filterNotifIds = ref([]);

  /**
   * Map of all notifications.
   * @type Map<string, {deleted, deleteTimeoutId, currentTenant, appName, notification: Notification}>
   */
  const notifications = reactive(new Map());

  /**
   * Represents a collection of groups.
   * @type {Map}
   */
  const groups = reactive(new Map());

  /**
   * Map containing merged notifications.
   * @type {Map} {deleted, deleteTimeoutId, currentTenant, appName, notification}.
   */
  const merges = reactive(new Map());

  /**
   * Ordered Ids of sectionList.
   * @type Array
   */
  const sectionListIds = ref([]);

  /**
   * Reference to the scroller element.
   * @type {Ref<HTMLElement|null>}
   */
  const scroller = ref(null);

  /**
   * Map of sectionList of the timeline notifications.
   * @type Map<string, Section>
   */
  const sectionList = reactive(new Map());

  /**
   * Represents the selection mode of the notifications.
   * @type {Ref<boolean>}
   */
  const selectionMode = ref(false);

  /**
   * Array of selected items.
   * @type {Ref<Array>}
   */
  const selected = ref([]);

  // todo move to specific store or juste delete it
  // no need to save error, just display
  /**
   * When an error happens during processing in the store.
   * @type boolean
   */
  const error = ref(false);

  /**
   * If notifications are loaded but there is none to display.
   * @type {Ref<boolean>}
   */
  const isEmpty = computed(() => {
    return notifications.size === 0;
  });

  // #region GETTERS

  /**
   * Get a notification given a id.
   * @param {number} id
   * @returns { Notification}
   */
  const getNotificationById = (id) => {
    return notifications.get(id) ? notifications.get(id) : null;
  };

  /**
   * Get a notification given a group id(looking for the main notification).
   * @param {string} groupId
   * @returns { Notification}
   */
  const getNotificationByGroupId = (groupId) => {
    for (let [_, notification] of notifications) {
      if (notification.GROUPID === groupId) {
        return notification;
      }
    }
    return null;
  };
  /**
   * Get a merge given a id.
   * @param {number} id
   * @returns {Notification}
   */
  const getMergeById = (id) => {
    return merges.get(id) ? merges.get(id) : null;
  };

  /**
   * Retrieves the merge object by the specified group ID.
   * Useful to get the only merge left in a group or get the first merge in a group.
   * @param {string} groupId - The group ID to search for.
   * @returns {object|null} - The merge object if found, or null if not found.
   */
  const getMergeByGroupId = (groupId) => {
    for (let [_, notification] of merges) {
      if (notification.GROUPID === groupId) return notification;
    }
    return null;
  };

  /**
   * Get all merges given a group id.
   * @param {string} groupID
   */
  const getAllMergesByGroupId = (groupID) => {
    const merges = [];
    for (let [_, merge] of merges) {
      if (merge.GROUPID === groupID) merges.push(merge);
    }
    return merges;
  };

  // #region ACTIONS

  /**
   * Adds a group ID to the list of group IDs.
   * @param {string} groupId - The ID of the group to add.
   */
  const addGroupId = (groupId) => {
    if (!groupIDs.value.includes(groupId)) {
      groupIDs.value.push(groupId);
    }
  };

  /**
   * Sets the scroller body element.
   * @param {HTMLElement} el - The element to set as the scroller body.
   */
  const setScrollerBody = (el) => {
    scroller.value = el;
  };

  /**
   * Sets the old ID value.
   * @param {number} id - The ID value to set.
   */
  const setOldID = (id) => {
    oldID.value = id;
  };

  /**
   * Sets the filter query for notifications.
   * @param {boolean} fetch - The filter query to be set.
   * @returns {void}
   */
  const setFilterQuery = (fetch) => {
    filterQuery.value = fetch;
  };

  /**
   * Sets the total count for the filter.
   * @param {number} count - The count to set.
   */
  const setFilterTotal = (count) => {
    if (typeof count === 'number') filterTotal.value = count;
  };

  /**
   * Add the filter notification IDs.
   * @param {number} notifIds - The array of notification IDs to set.
   * @param {string} clusterId - Cluster id.
   * @param {boolean} archive - If from archive.
   */
  const addFilterNotifIds = (notifIds, clusterId, archive) => {
    for (let id of notifIds) {
      const find = filterNotifIds.value.find((n) => n.id === id);
      if (!find) filterNotifIds.value.push({ id, archive, clusterId });
    }
  };

  /**
   * Remove the filter notification IDs.
   * @param {number} notifIds - The array of notification IDs to set.
   * @param {string} clusterId - Cluster id.
   * @param {boolean} archive - If from archive.
   */
  const removeFilterNotifId = (notifIds) => {
    filterNotifIds.value = filterNotifIds.value.filter((filterId) => !notifIds.includes(filterId.id));
  };

  /**
   * Sets loading value.
   * @param {boolean} loading - If Center is loading.
   */
  const setIsLoading = (loading) => {
    isLoading.value = loading;
  };

  /**
   * Sets the value of canLoadMoreHistory.
   * @param {boolean} load - The new value for canLoadMoreHistory.
   */
  const setCanLoadMoreHistory = (load) => {
    canLoadMoreHistory.value = load;
  };

  /**
   * Sets the value of canLoadMoreFromArchive.
   * @param {boolean} load - The value to set for canLoadMoreFromArchive.
   */
  const setCanLoadMoreFromArchive = (load) => {
    canLoadMoreFromArchive.value = load;
  };

  /**
   * Sets the load more flag.
   * @param {boolean} load - The load more flag.
   */
  const setLoadingMore = (load) => {
    loadingMore.value = load;
  };

  /**
   * Adds the specified number of unread notifications to the total count.
   * @param {number} nbUnread - The number of unread notifications to add.
   */
  const addUnreadTotal = (nbUnread) => {
    unreadTotal.value += nbUnread;
  };

  /**
   * Checks if the total number of unread notifications is empty.
   * @returns {boolean} True if the total number of unread notifications is 0, false otherwise.
   */
  const isUnreadTotalEmpty = () => {
    return unreadTotal.value === 0;
  };

  /**
   * Set Merge.
   * @param {*} notification
   */
  const setMerge = ({ id, notification, options }) => {
    const { addMerge } = useNotificationManagement();
    addMerge(notification, options);
  };

  /**
   * Retrieves the group with the specified groupId.
   * @param {string} groupId - The ID of the group to retrieve.
   * @returns {object|null} - The group object if found, or null if not found.
   */
  const getGroup = (groupId) => {
    return groups.get(groupId) ? groups.get(groupId) : null;
  };
  /**
   * Set one notification.
   * @param {Notification } notification
   * @param {object} options
   */
  const setNotification = (notification, options) => {
    const { addNotification } = useNotificationManagement();
    addNotification(notification, options);
  };

  /**
   * Set the notifications app infos.
   * @param {*} data
   */
  const setNotifAppInfos = (data) => {
    // start by checking merges is a good idea ?
    const { isMerge, isNormalNotification, isGroup } = useNotificationManagement();
    let notification;
    if (isMerge(data.notifID)) {
      notification = getMergeById(data.notifID);
      notification.MESSAGE.icon['src'] = data.src;
    }
    // not using "else if" because of group
    if (isNormalNotification(data.notifID) || isGroup(data.notifID)) {
      notification = getNotificationById(data.notifID);
      notification.MESSAGE.icon['src'] = data.src;
    }
  };

  /**
   * Reset all states except loading and clusterId.
   * @param filtered
   */
  const resetStates = (filtered = false) => {
    //
    if (!filtered) {
      oldID.value = -1;
      filterTotal.value = 0;
    } else {
      filterTotal.value =
        filterTotal.value - filterNotifIds.value.length >= 0 ? filterTotal.value - filterNotifIds.value.length : 0;
    }
    //
    notifications.clear();
    sectionList.clear();
    oldIDs.value.length = 0;
    sectionListIds.value.length = 0;
    unreadTotal.value = 0;
    groupIDs.value.length = 0;
    filterNotifIds.value.length = 0;
    selectionMode.value = false;
    selected.value.length = 0;
    canLoadMoreHistory.value = true;
    canLoadMoreFromArchive.value = false;
    loadingMore.value = false;
    // isLoading.value = true;
    error.value = false;
    groups.clear();
    merges.clear();
    scroller.value = null;
    filterQuery.value = false;
    //
    dispose.value = null;
    unreadTotalFederation.value.length = 0;
  };

  return {
    // STATE
    notifications,
    sectionList,
    sectionListIds,
    unreadTotal,
    getUnreadTotalFederation,
    filterTotal,
    oldID,
    oldIDs,
    groupIDs,
    filterNotifIds,
    selectionMode,
    selected,
    canLoadMoreHistory,
    canLoadMoreFromArchive,
    archive: canLoadMoreFromArchive,
    loadingMore,
    isLoading,
    error,
    groups,
    merges,
    scroller,
    filterQuery,
    dispose,
    renderToDoc,
    centerFrameOpened,
    clusterId,
    unreadTotalFederation,

    // COMPUTED GETTERS
    isEmpty,
    hasRenderToDoc,

    // NOT COMPUTED GETTERS
    getNotificationById,
    getNotificationByGroupId,
    getMergeById,
    getMergeByGroupId,
    getAllMergesByGroupId,
    getGroup,
    getSelected: () => selected.value,
    getGroupIDs: () => groupIDs.value,
    getSectionListIds: () => sectionListIds,
    getSectionList: () => sectionList,

    // ACTIONS
    setClusterId,
    isCurrentCluster,
    setCenterFrameOpened,
    setNotifAppInfos,
    setIsLoading,
    setUnreadTotal,
    addUnreadTotal,
    setUnreadTotalFederation,
    isUnreadTotalEmpty,
    setNotification,
    setMerge,
    setScrollerBody,
    setLoadingMore,
    setCanLoadMoreHistory,
    setCanLoadMoreFromArchive,
    setOldID,
    addFilterNotifIds,
    removeFilterNotifId,
    resetStates,
    addGroupId,
    setFilterTotal,
    setFilterQuery,
    setRenderToDoc,
    resetRenderToDoc,
    addOldID,
    clusterInOldIDs,
  };
});

export default useNotificationsStore;
