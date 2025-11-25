import { watch } from 'vue';
import { getPlatformAPI } from '../../modules/imports';
import useConnectionStore from '../../stores/connection';
import { checkSocketStatus } from '../../api/senders';
import useNotificationsStore from '../../stores/notifications';
import { useNotificationManagement } from '../notification/useNotificationManagement';
import { useTimeoutFn } from '@vueuse/core';
// channel names
const channelToServer = '3dnotifinterne';
const clientToServerEvent = 'toINTF';

/**
 * A custom hook for managing connection-related functionality.
 *
 * @returns {Object} An object containing the following functions:
 *   - reliveSocketIfKO: Relives the socket if it is in a KO (Knockout) state.
 *   - triggerDriverSenderQueue: Triggers actions in the driver sender queue and removes them.
 *   - setSocketStatusTimeout: Sets a timeout for socket status.
 *   - timeoutSocketStatusCheck: Stops and starts the timeout for socket status check.
 */
export function useConnection() {
  const connectionStore = useConnectionStore();
  const notifStore = useNotificationsStore();

  /**
   * Sets a timeout for the socket status check.
   * @param {number} time - The time in milliseconds for the timeout.
   */
  const setSocketStatusTimeout = (time) => {
    const { stop, start } = useTimeoutFn(() => {
      if (connectionStore.checkingSocketStatus) {
        connectionStore.setCheckingSocketStatus(false);
        // console.log('[TimeoutSocketStatusCheck] Timeout ended value set to false');
      }
    }, time);
    //
    connectionStore.setSocketStatusVariables({ _stop: stop, _start: start });
  };

  /**
   * Timeout socket status check.
   */
  const timeoutSocketStatusCheck = () => {
    // stop the timeout first
    connectionStore.stop();
    // start the timeout
    connectionStore.start();
    // console.log('[TimeoutSocketStatusCheck] Timeout started');
  };

  /**
   * Relives the socket if it is in a KO (Knockout) state.
   * This function checks the socket status and watches for changes in the socket status.
   * If the socket status changes from 'disconnected' to 'connected', it refreshes the notification data.
   * It also watches for the opening of the notification center and tries to connect to the socket if it is not already connected.
   */
  const reliveSocketIfKO = () => {
    // watch the socket status
    watch(
      () => connectionStore.socketStatus,
      (value) => {
        if (connectionStore.isSocketConnected) {
          if (connectionStore.isPreviousSocketDisconnected) {
            // refresh the notification data if center is opened
            if (notifStore.centerFrameOpened) {
              const { refreshWithoutReset } = useNotificationManagement();
              refreshWithoutReset();
            }
            // set need center refresh to true
            else connectionStore.setNeedCenterRefresh(true);
          }
          // check if an action can be triggered
          if (connectionStore.driverSenderQueue.length) {
            triggerDriverSenderQueue();
          }
        }
      }
    );
    // watch the opening of the notification center
    watch(
      () => notifStore.centerFrameOpened,
      (value) => {
        // center opened
        if (value) {
          // socket status is not connected
          if (connectionStore.isSocketDisconnected && !connectionStore.checkingSocketStatus) {
            // set checking socket status to true
            connectionStore.setCheckingSocketStatus(true);
            // timeout the status check to false after 10 seconds
            timeoutSocketStatusCheck();
            // try to connect to the socket
            checkSocketStatus();
          }
          // check if refresh is needed
          if (connectionStore.needCenterRefresh) {
            // refresh the notification data
            const { refreshWithoutReset } = useNotificationManagement();
            refreshWithoutReset();
            // reset the need center refresh
            connectionStore.setNeedCenterRefresh(false);
          }
        }
      }
    );
  };

  /**
   * Triggers the driver sender queue by publishing actions to the server.
   * @returns {Promise<void>} A promise that resolves when all actions have been sent and removed from the queue.
   */
  const triggerDriverSenderQueue = async () => {
    const PlatformAPI = await getPlatformAPI();
    // trigger all the actions in the queue then remove them
    if (PlatformAPI) {
      const datas = [...connectionStore.driverSenderQueue];
      for (const data of datas) {
        if (connectionStore.isSocketConnected) {
          // publish the action to the server
          PlatformAPI.publish(channelToServer, { action: clientToServerEvent, data });
          // console.log('[DriverSenderQueue send] Sent data to server:', data);
          // remove the action from the queue
          connectionStore.driverSenderQueue.shift();
        }
        // if the socket is disconnected, break the loop
        else return;
      }
    }
  };
  return {
    reliveSocketIfKO,
    triggerDriverSenderQueue,
    setSocketStatusTimeout,
    timeoutSocketStatusCheck,
  };
}
