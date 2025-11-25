import { allEventsHandlers } from '../../src/api/responseHandlers';
import useNotificationsStore from '../../src/stores/notifications';
/**
 * Unsubscribes from a notification.
 *
 * @param {Object} data - The data object containing the notification details.
 * @returns {Object} - An object containing the following properties:
 *   - unsubNotifStillInCenter {boolean} - Indicates whether the unsubscribed notification is still in the center.
 *   - nbNotifBeforeUnsub {number} - The number of notifications before unsubscribing.
 *   - nbNotifRemoved {number} - The number of notifications removed after unsubscribing.
 */
export function unsubscribe(data = null) {
  const store = useNotificationsStore();
  const nbNotifBeforeUnsub = +JSON.parse(JSON.stringify(store.notifications.size));
  const eventHandlers = allEventsHandlers();
  eventHandlers.setSetting(data);
  // check if notifications that are unsubscribed are not shown in the notifications list

  const nbNotifRemoved = Math.abs(nbNotifBeforeUnsub - store.notifications.size);
  let unsubNotifStillInCenter = false;
  store.notifications.forEach((notification) => {
    if (notification.SERVICE_ID === data.ID && (data.SUBSCRIBE === 0 || data.UNSUBSCRIBE_DATE !== null)) {
      unsubNotifStillInCenter = true;
    }
  });
  //
  return { unsubNotifStillInCenter, nbNotifBeforeUnsub, nbNotifRemoved };
}
