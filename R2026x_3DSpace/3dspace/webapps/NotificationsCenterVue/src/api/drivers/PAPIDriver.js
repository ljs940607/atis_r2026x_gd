import { useConnection } from '../../composables/connection/useConnection';
import { getPlatformAPI } from '../../modules/imports';
import useConnectionStore from '../../stores/connection';
import useNotificationsStore from '../../stores/notifications';
import { managerEvents } from '../senders';

const channelManagerInit = '3dNotifManagerInit';
const channelCenterInit = '3dNotifCenterInit';

const channelToWidget = '3dnotifinterne';
const channelToServer = '3dnotifinterne';

const clientToServerEvent = 'toINTF';
const serverToClientEvent = 'notification';

/**
 * PlatformAPI driver for 3DNotification.
 */
const PAPIDriver = {
  /**
   * Generates a TxID.
   * @param {string} action - The event action name to generate the TxID for.
   * @returns A random transaction id for the given action.
   */
  _generateTxID: (action) => '' + Date.now() + '-r' + Math.floor(Math.random() * 1000) + '-' + (action || 'noAction'),

  /**
   * Initializes Center to Manager connection.
   * @param {UWA.Widget} widget - Notifications Center widget.
   */
  init: async function (widget) {
    const PlatformAPI = await getPlatformAPI();
    PlatformAPI.subscribe(channelManagerInit, async function (data) {
      if (data) {
        // initialization done
        PlatformAPI.unsubscribe(channelManagerInit);
      } else {
        widget.counterRequest++;
        widget.timerId = window.setTimeout(function () {
          widget.initFlag = true;
          if (widget.counterRequest < widget.maxRequest) PlatformAPI.publish(channelCenterInit, true);
          else window.clearTimeout(widget.timerId);
        }, 2000);
      }
    });
    PlatformAPI.publish(channelCenterInit, true);
  },

  /**
   * Adds callback to call on reception of event.
   * @param {Function} callback - The function to call on reception of event.
   */
  addCallback: async function (callback) {
    const PlatformAPI = await getPlatformAPI();
    const { clusterId, setClusterId } = useNotificationsStore();
    PlatformAPI.subscribe(channelToWidget, function (response) {
      if (!response) return console.debug('[PAPIDriver addCallback] Missing response');
      if (!response.action || response.action !== serverToClientEvent) {
        if (response.action === clientToServerEvent) return; // because of same PAPI channel for pub/sub
        return console.debug(`[PAPIDriver addCallback] Received non-${serverToClientEvent} event`);
      }
      if (!response.data) return console.debug('[PAPIDriver addCallback] Missing response.data');
      response.data.clusterId = response.data.clusterId || response.clusterId;
      if (response.data.clusterId && !clusterId) setClusterId(response.data.clusterId);
      callback(response.data);
    });
  },

  /**
   * Relive the socket if it is disconnected.
   * @param {*} data
   * @returns
   */
  reliveSocket: async function (data) {
    const connectionStore = useConnectionStore();
    const { timeoutSocketStatusCheck } = useConnection();
    // check if the socket is disconnected && if the action is NOT a manager event
    if (connectionStore.isSocketDisconnected && !managerEvents[data.action] && !connectionStore.checkingSocketStatus) {
      console.log('[PAPIDriver throttleSocketRelive] Socket is disconnected. Trying to connect...');
      // try to connect to the socket
      const d = { action: 'checkSocketStatus', data: {} };
      const PlatformAPI = await getPlatformAPI();
      // set checking socket status to true
      connectionStore.setCheckingSocketStatus(true);
      // timeout the status check to false after 10 seconds
      timeoutSocketStatusCheck();
      // try to connect to the socket
      PlatformAPI.publish(channelToServer, { action: clientToServerEvent, data: d });
      // add the action to the queue
      connectionStore.addToDriverSenderQueue(data);
      // wait for the socket to connect
      return;
    }
    // check if the socket is checking add the action to the queue
    if (connectionStore.checkingSocketStatus && !managerEvents[data.action]) {
      // console.log('[PAPIDriver throttleSocketRelive] Socket is checking. Adding action to the queue...');
      connectionStore.addToDriverSenderQueue(data);
      return;
    }
  },

  /**
   * Sends the given data to server.
   * @param {{action: string, data: object}} data - The data to send.
   */
  send: async function (data) {
    if (!data) return;
    // this will check if the socket is disconnected and try to reconnect
    this.reliveSocket(data);
    // good to go
    if (data.action) data.TxID = this._generateTxID(data.action);
    const PlatformAPI = await getPlatformAPI();
    PlatformAPI.publish(channelToServer, { action: clientToServerEvent, data });
    // console.log('[PAPIDriver send] Sent data to server:', data);
  },
};

export default PAPIDriver;
