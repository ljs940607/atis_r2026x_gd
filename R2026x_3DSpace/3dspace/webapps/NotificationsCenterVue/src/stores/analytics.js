import { defineStore } from 'pinia';
import { ref } from 'vue';
/**
 * Analytics store.
 */

const useAnalyticsStore = defineStore('analytics', () => {
  const startTime = ref(0);
  // const endTime = ref(0);
  const label = ref('');
  const setStartTime = (time) => {
    startTime.value = time;
  };

  /**
   * Resets the analytics by setting the start time and label to their initial values.
   */
  const resetAnalytics = () => {
    startTime.value = 0;
    label.value = '';
  };
  // const setEndTime = (time) => {
  //   endTime.value = time;
  // };
  const setLabel = (labelValue) => {
    label.value = labelValue;
  };
  /**
   * Sets the analytics for the given time and label value.
   *
   * @param {number} time - The time value for analytics.
   * @param {string} labelValue - The label value for analytics.
   * @returns {void}
   */
  const setAnalytics = (time, labelValue) => {
    setStartTime(time);
    setLabel(labelValue);
  };

  return {
    startTime,
    label,
    // endTime,
    getStartTime: () => startTime.value,
    durationTime: () => {
      return startTime.value === 0 ? -1 : Math.abs(performance.now() - startTime.value);
    },
    getLabel: () => label.value,
    setLabel,
    // setEndTime,
    setStartTime,
    setAnalytics,
    resetAnalytics,
  };
});

export default useAnalyticsStore;
