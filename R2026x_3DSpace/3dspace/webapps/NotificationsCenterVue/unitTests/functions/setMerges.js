import { allEventsHandlers } from '../../src/api/responseHandlers';
import { checkIfIdHasHyphen } from '../../src/functions/utils';
import useNotificationsStore from '../../src/stores/notifications';
/**
 * Sets merges for a notification.
 *
 * @param {Array} merges - The array of merges.
 * @param {string} id - The ID of the notification.
 * @returns {boolean} - True if merges are set successfully, false otherwise.
 */
export function setMerges(merges, id) {
  const store = useNotificationsStore();
  const notification = store.getNotificationById(id);
  //
  const m = merges.filter((merge) => notification.GROUPID === merge.GROUPID);
  const data = {
    notifications: m,
    appName: '3dswym',
    clusterId: 'devprol42',
    currentTenant: 'DEVOPSYSO157UW24041',
    language: 'en',
    id: checkIfIdHasHyphen(id) ? parseInt(checkIfIdHasHyphen(id).id) : id,
  };
  console.log('data', data);
  const eventHandlers = allEventsHandlers();
  eventHandlers.setMerge(data);
  //
  return notification.hasMerges === true && notification.mergesFetched === true;
}
