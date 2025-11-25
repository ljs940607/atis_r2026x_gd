import { useNotificationResolution } from '../../src/composables/notification/useNotificationResolution';
/**
 * Retrieves the URL of an icon based on the provided data.
 *
 * @param {object} data - The data object containing information about the icon.
 * @returns {string} The URL of the icon.
 */
export function getIconUrlTest(data = null) {
  const { getIconUrl } = useNotificationResolution();
  const url = getIconUrl(data ? data : { icon: { data: 'yy', type: 'login' }, platformId: 'devopsyso157uw24041' });
  return url;
}
