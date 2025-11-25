/**
 * Custom hook for cleaning notifications.
 * @returns {object} An object containing the cleaning functionality.
 */
export function useNotificationCleaning() {
  /**
   * Cleans the notification data by decoding and replacing certain values.
   * @param {object} data - The notification data to be cleaned.
   */
  const cleanNotificationData = (data) => {
    try {
      const hasCount = Object.hasOwn(data, 'COUNT');
      data.TYPE = decodeURIComponent(escape(atob(data.TYPE)));
      data.MESSAGE = decodeURIComponent(escape(atob(data.MESSAGE)));
      // data.TYPE = decodeURI(encodeURI(data.TYPE));
      // data.MESSAGE = decodeURI(encodeURI(data.MESSAGE));
      if (hasCount) {
        data.MESSAGE = data.MESSAGE.replace('##MERGE_COUNT##', data.COUNT);
      }
      data.MESSAGE = JSON.parse(data.MESSAGE);
      if (hasCount) {
        data.MESSAGE.nls.msg = data.MESSAGE.nls.msg.replace(`(${data.COUNT})`, '');
      }
    } catch (error) {
      console.warn('No panic, it just means that the cleaning may have already been done.');
    }
  };
  return {
    cleanNotificationData,
  };
}
