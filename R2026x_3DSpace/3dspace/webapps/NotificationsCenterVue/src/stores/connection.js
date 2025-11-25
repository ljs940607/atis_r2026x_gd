import { defineStore } from 'pinia';
import { usePrevious } from '@vueuse/core';
import { ref, computed } from 'vue';
/**
 * Connection store.
 */

const useConnectionStore = defineStore('connection', () => {
  // socket status
  const socketStatus = ref(null);
  const isSocketConnected = computed(() => socketStatus.value === 'connected');
  const isSocketDisconnected = computed(() => socketStatus.value === 'disconnected');
  // get previous socket status
  const previousSocketStatus = usePrevious(socketStatus);
  const isPreviousSocketConnected = computed(() => previousSocketStatus.value === 'connected');
  const isPreviousSocketDisconnected = computed(() => previousSocketStatus.value === 'disconnected');
  // checking socket status (when the socket is trying to connect)
  const checkingSocketStatus = ref(false);
  // timeoutSocketStatusCheck variables
  const start = ref(null);
  const stop = ref(null);
  //
  /**
   * Sets the socket status variables.
   *
   * @param {Object} options - The options object.
   * @param {any} options._stop - The value to set for the stop variable.
   * @param {any} options._start - The value to set for the start variable.
   */
  const setSocketStatusVariables = ({ _stop, _start }) => {
    stop.value = _stop;
    start.value = _start;
  };

  /**
   * Sets the status of checking socket.
   *
   * @param {boolean} status - The status to set.
   */
  const setCheckingSocketStatus = (status) => {
    if (typeof status === 'boolean') {
      checkingSocketStatus.value = status;
    }
  };
  // true if center needs to be refreshed
  const needCenterRefresh = ref(false);

  /**
   * Sets the status of the needCenterRefresh variable.
   *
   * @param {boolean} status - The status to set for the needCenterRefresh variable.
   */
  const setNeedCenterRefresh = (status) => {
    if (typeof status === 'boolean') {
      needCenterRefresh.value = status;
    }
  };

  // a queue of actions to trigger when the socket is connected
  const driverSenderQueue = ref([]);

  /**
   * Adds an action to the driver sender queue.
   *
   * @param {any} action - The action to be added to the queue.
   */
  const addToDriverSenderQueue = (action) => {
    driverSenderQueue.value.push(action);
  };
  /**
   * Sets the socket status.
   *
   * @param {boolean} status - The status of the socket.
   */
  const setSocketStatus = (status) => {
    // status map
    const statusMap = ['connected', 'disconnected'];
    // check if status is a string and is in the status map
    if (typeof status === 'string' && statusMap.includes(status)) {
      socketStatus.value = status;
    }
  };

  /**
   * Resets the socket status.
   */
  const resetSocketStatus = () => {
    socketStatus.value = null;
  };

  return {
    socketStatus,
    previousSocketStatus,
    isSocketConnected,
    isSocketDisconnected,
    isPreviousSocketConnected,
    isPreviousSocketDisconnected,
    checkingSocketStatus,
    driverSenderQueue,
    needCenterRefresh,
    start,
    stop,
    addToDriverSenderQueue,
    setSocketStatus,
    resetSocketStatus,
    setCheckingSocketStatus,
    setNeedCenterRefresh,
    setSocketStatusVariables,
  };
});

export default useConnectionStore;
