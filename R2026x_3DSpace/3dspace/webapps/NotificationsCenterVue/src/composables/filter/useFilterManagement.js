import useFilterStore from '../../stores/filter';
import useNotificationsStore from '../../stores/notifications';
import { filter, getUnreadTotal } from '~/api/senders';

/**
 * Custom hook for managing filters.
 *
 * @returns {Object} An object containing the `applyFilter` and `resetFilter` functions.
 */

export function useFilterManagement() {
  const store = useFilterStore();
  const notifStore = useNotificationsStore();

  /**
   * Applies the filters based on the provided search value.
   *
   * @param {Object} search - The search object contains the value to be filtered.
   */
  const applyFilter = (search) => {
    // Check if the search is not empty
    if (search.value.trim().length) {
      if (!store.filter.searches.includes(search.value.trim())) {
        if (store.filter.searches.length < 6) {
          store.filter.searches.push(search.value.trim());
        }
        search.value = '';
      }
      return;
    }
    // Always save filter to localstorage
    store.saveToLocalStorage();

    // Reset states and set loading
    notifStore.resetStates();
    notifStore.setIsLoading(true);

    // Send the filter payload
    filter(store.getFilter());

    // Display the total of unread notifications when no box is checked
    if (!store.filter.unread && !store.filter.read && !store.filter.starred && !store.filter.unstarred
        && !store.filter.first_date && !store.filter.last_date) {
      getUnreadTotal();
    }

    // Close the filter
    store.setOpened(false);

    // Flag that a filter query is active
    notifStore.setFilterQuery(true);
  };

  /**
   * Resets the filter and performs additional actions.
   */
  const resetFilter = () => {
    // Reset the filter from localstorage
    store.resetFilter();
    
    // Reset states and set loading
    notifStore.resetStates();
    notifStore.setIsLoading(true);
    
    // Ensure the default behavior (unread notifications only)
    filter({ ...store.getFilter(), unread: true});
    getUnreadTotal();

    // Flag that a filter query is active
    notifStore.setFilterQuery(true);
  };

  return {
    applyFilter,
    resetFilter,
  };
}
