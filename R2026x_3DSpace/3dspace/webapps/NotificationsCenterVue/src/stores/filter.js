import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { oneMonthAgo } from '../functions/utils';
import useNotificationsStore from './notifications';
/**
 * Filter store.
 */
const useFilterStore = defineStore('filter', () => {
  const notifStore = useNotificationsStore();

  // true if filter is applied, the default behavior is considered as a filter
  const applied = ref(true);
  // list of notification id filtered
  const filterNotifId = ref([]);
  // list of user tenants
  const userTenants = ref([]);
  // true if filter is opened
  const opened = ref(false);
  // filter object
  const filter = reactive({
    first_date: null,  // Calendar is empty
    last_date: null,   // Calendar is empty
    searches: [],
    read: false,
    unread: true,     // Default unread checkbox is checked
    starred: false,
    unstarred: false,

    // TODO federation
    tenants: [],
  });

  const isDefaultUnread = () => {
    const noBoxes =
      filter.read === false &&
      filter.unread === true && // Default unread checkbox is checked
      filter.starred === false &&
      filter.unstarred === false;
      
      const noSearches = filter.searches.length === 0;
      const noTenants = filter.tenants.length === 0;
      const noDates = filter.first_date == null && filter.last_date == null;
      return noBoxes && noSearches && noDates;
  }

  const getFilter = () => {
    const base = {
      ...filter,
      oldID: notifStore.oldID,
      groupIDs: notifStore.groupIDs,
      archive: notifStore.archive,
      clusterId: notifStore.clusterId
    };
    if (isDefaultUnread()) {
      base.unread = true;
    }

    return base;
  }
  // reset filter in local storage
  const resetFilter = () => {
    resetFilterFields();
    saveToLocalStorage(); // Default is filter enabled with unread
  };

  // load filter from local storage
  const loadFilter = () => {
    getFilterInStorage();
  };

  // get filter from local storage
  // only used inside the store
  const getFilterInStorage = () => {
    if (localStorage.getItem('notification-center-filter')) {
      const filterStorage = JSON.parse(localStorage.getItem('notification-center-filter'));
      applied.value = true;
      if (filterStorage.first_date) {
        filter.first_date = new Date(filterStorage.first_date);
      } else {
        filter.first_date = null;
      }
      if (filterStorage.last_date) {
        filter.last_date = new Date(filterStorage.last_date);
      } else {
        filter.last_date = null;
      }

      if (!filter.last_date && !filter.first_date && !filter.read && !filter.unread && !filter.starred && !filter.unstarred) {
        applied.value = false;
      } else {
        applied.value = true;
      }

      filter.searches = filterStorage.searches;
      filter.read = filterStorage.read;
      filter.unread = filterStorage.unread;
      filter.starred = filterStorage.starred;
      filter.unstarred = filterStorage.unstarred;
      filter.tenants = filterStorage.tenants;
    }
  };

  // for store internal use (not exported)
  const needToBeSaved = () => {
   return (
      filter.first_date !== null ||
      filter.last_date !== null ||
      filter.searches.length ||
      filter.read !== false ||
      filter.unread !== true ||
      filter.starred !== false ||
      filter.unstarred !== false ||
      filter.tenants.length
    );
  };
  // save filter to local storage ( set dates only if not null)
  const saveToLocalStorage = async () => {
    applied.value = true; // Default true
    localStorage.removeItem('notification-center-filter');
    if (needToBeSaved()) {
      if (filter.first_date !== null && filter.first_date !== "") {
        filter.first_date.setHours(0, 0, 0, 0);
      }

      if (filter.last_date !== null && filter.last_date !== "") {
        filter.last_date.setHours(23, 59, 59, 999);
      }
      
      localStorage.setItem('notification-center-filter', JSON.stringify(filter));
      if (!filter.last_date && !filter.first_date && !filter.read && !filter.unread && !filter.starred && !filter.unstarred)
      {
        applied.value = false;
      } else {
        applied.value = true;
      }
    }
  };

  // set opened value
  const setOpened = (o) => {
    opened.value = o;
  };

  // reset filter fields
  const resetFilterFields = () => {
    filter.first_date = null;
    filter.last_date = null;
    filter.searches = [];
    filter.read = false;
    filter.unread = true;
    filter.starred = false;
    filter.unstarred = false;
    filter.tenants = [];
    applied.value = true;
  };

  /**
   * Adds a search value to the filter's searches array.
   * @param {object} search - The search object containing the value to be added.
   */
  const addSearch = (search) => {
    if (search.value.trim().length) {
      if (!filter.searches.includes(search.value.trim())) {
        if (filter.searches.length < 6) {
          filter.searches.push(search.value.trim());
        }
        search.value = '';
      }
    }
  };

    watch(
    isDefaultUnread,
    (defaultunread) => {
      if (defaultunread) {
        applied.value = true;
      }
    },
    { immediate: true}
  );

  return {
    applied,
    userTenants,
    filterNotifId,
    filter,
    opened,
    isFilterApplied: () => applied.value || isDefaultUnread(),
    getFilter,
    resetFilter,
    loadFilter,
    setOpened,
    saveToLocalStorage,
    resetFilterFields,
    addSearch,
  };
});

export default useFilterStore;
