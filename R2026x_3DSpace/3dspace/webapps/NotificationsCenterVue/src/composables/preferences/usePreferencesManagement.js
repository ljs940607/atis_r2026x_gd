import { message, modal } from '@ds/vuekit/dist/VUEKIT';
import { useNow, watchDebounced } from '@vueuse/core';
import { watch } from 'vue';
import useTranslations from '~/composables/useTranslations';
import { getSettings, resetSettingUnsubscriptionDate, updateSettings } from '../../api/senders';
import useNotificationsStore from '../../stores/notifications';
import useSettingsStore from '../../stores/settings';

const { $i18n } = useTranslations();

export function usePreferencesManagement() {
  const store = useSettingsStore();
  const notifStore = useNotificationsStore();
  // will be used in a watcher to trigger the reset of the unsubscribe_date of a setting
  const now = useNow();
  let stopSettingUnsubDateWatcher = null;

  /**
   * Watches the store's `unsubscribe_dateSettingList` and starts a new watcher for each setting in the list.
   * If the `unsubscribe_date` of a setting is earlier than the current date, the `unsubscribe_date` is reset.
   *
   * @param {number} [debounce=60000] - The debounce time in milliseconds for the watcher.
   * @param {number} [maxWait=60000] - The maximum wait time in milliseconds for the watcher.
   */
  const watchSettingWithUnsubDate = (debounce = 60000, maxWait = 60000) => {
    watch(
      () => store.unsubscribe_dateSettingList,
      (list) => {
        // stop the previous watcher if exists
        if (stopSettingUnsubDateWatcher) stopSettingUnsubDateWatcher();
        // start a new watcher
        if (list.length) {
          stopSettingUnsubDateWatcher = watchDebounced(
            () => now.value,
            (realTimeCurrentDate) => {
              for (let i = 0; i < list.length; i++) {
                const setting = store.getSetting(list[i]);
                if (new Date(setting.unsubscribe_date).getTime() < new Date(realTimeCurrentDate).getTime()) {
                  // reset the unsubscribe date
                  resetSettingUnsubDate(setting.id);
                }
              }
            },
            { debounce: debounce, maxWait: maxWait }
          );
        }
      },
      { immediate: true, deep: true }
    );
  };

  /**
   * Resets the unsubscribe date for a given ID.
   *
   * @param {number} id - The ID of the setting.
   */
  const resetSettingUnsubDate = (id) => {
    // reset the unsubscribe date
    resetSettingUnsubscriptionDate({ id });
    // remove setting the watchList
    store.removeUnsubscribe_dateSetting(id);
  };

  /**
   * Loads the settings.
   * If the settings are not already loaded, it sets the loading state to true and retrieves the settings.
   * If the settings are already loaded, it sets the load state to true and the loading state to false.
   */
  const loadSettings = () => {
    if (!store.settings.size) {
      store.setSettingLoadingState('settings', true);
      getSettings();
    } else {
      store.setSettingLoadState('settings', true);
      store.setSettingLoadingState('settings', false);
    }
  };

  /**
   * Displays an alert notice with the given title and message.
   *
   * @param {string} title - The title of the alert notice.
   * @param {string} msg - The message of the alert notice.
   * @returns {void}
   */
  const alertNotice = (title, msg) => {
    modal.show({
      title: title,
      message: msg,
      noMobile: true,
    });
  };

  /**
   * Displays a message notice with the given text and timeout.
   *
   * @param {string} msg - The text of the message notice.
   * @param {number} timeout - The timeout duration in milliseconds.
   */
  const messageNotice = (msg, timeout) => {
    try {
      if (notifStore.dispose) {
        // vuekit specific
        if (!notifStore.dispose.bind._dispose) {
          notifStore.dispose.bind.show = false;
        }
        // dispose the message if exists
        notifStore.dispose.dispose();
      }
    } catch (error) {
      console.log('error trying trying to hide the message', error);
    }
    if (typeof timeout === 'number' && typeof msg === 'string') {
      notifStore.dispose = message.create({ text: msg, timeout: timeout });
    } else {
      console.log('Wrong parameters for message');
    }
  };

  /**
   * Displays a confirmation alert notice with the specified title, message, and button labels.
   *
   * @param {Object} options - The options for the confirmation alert notice.
   * @param {string} options.title - The title of the confirmation alert notice.
   * @param {string} options.msg - The message of the confirmation alert notice.
   * @param {string} options.okLabel - The label for the OK button.
   * @param {string} options.cancelLabel - The label for the cancel button.
   * @param {Function} callback - The callback function to be called when the user confirms or cancels the notice.
   * @returns {void}
   */
  const alertConfirmNotice = ({ title, msg, okLabel, cancelLabel }, callback) => {
    modal
      .confirm({
        title: title,
        message: msg,
        ...(!!okLabel && { okLabel: okLabel }),
        ...(!!cancelLabel && { cancelLabel: cancelLabel }),
        noMobile: true,
        keyboard: false,
      })
      .then(
        () => {
          // user confirmed
          callback(true);
        },
        () => {
          // user canceled
          callback(false);
        }
      );
  };

  /**
   * Displays an alert prompt notice with the specified parameters.
   *
   * @param {Object} options - The options for the alert prompt notice.
   * @param {string} options.title - The title of the prompt notice.
   * @param {string} options.msg - The message of the prompt notice.
   * @param {string} options.okLabel - The label for the OK button.
   * @param {string} [options.cancelLabel] - The label for the cancel button (optional).
   * @param {string} [options.placeholder] - The placeholder text for the input field (optional).
   * @param {boolean} [options.required] - Indicates if the input field is required (optional).
   * @returns {Promise} A promise that resolves with the value entered in the prompt notice when confirmed, or rejects with the value when closed.
   */
  const alertPromptNotice = ({ title, msg, okLabel, cancelLabel, placeholder, required }) => {
    return new Promise((resolve, reject) => {
      modal
        .prompt({
          title,
          rawContent: msg, // for html tags
          okLabel,
          ...(!!cancelLabel && { cancelLabel }),
          placeholder,
          required,
          keyboard: false,
          noMobile: true,
        })
        .then((onConfirmVal) => {
          resolve(onConfirmVal);
        })
        .catch((onCloseVal) => {
          reject(onCloseVal);
        });
    });
  };

  /**
   * Requests permission for browser notifications.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the permission was granted or not.
   */
  const requestNotificationPermission = () => {
    let granted = false;
    return new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        granted = false;
        alertNotice($i18n('browserSupport'), $i18n('browserNotSupported'));
        resolve(granted);
      } else if (Notification.permission === 'granted') {
        granted = true;
        resolve(granted);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            granted = true;
          } else {
            granted = false;
            alertNotice($i18n('notificationPermission'), $i18n('deniedPermission'));
          }
          resolve(granted);
        });
      } else {
        alertNotice(
          $i18n('notificationPopupActivationTitle'),
          $i18n('notificationPopupActivationMsgPopupForBlock')
        );
        resolve(granted);
      }
    });
  };

  /**
   * Updates the setting based on the provided attribute.
   *
   * @param {object} setting - The setting object.
   * @param {string} attribut - The attribute to update.
   */
  const settingUpdate = (setting, attribut) => {
    if (setting && Object.hasOwn(setting, attribut)) {
      const needConfirm = setting[attribut] === 0;
      const needBrowserPermission = attribut === 'notif_by_browser' && setting[attribut] === 1;
      if (needBrowserPermission) {
        requestNotificationPermission().then((granted) => {
          if (granted) {
            updateSettings(setting);
          }
        });
      } else if (needConfirm) {
        const message =
          attribut === 'notif_by_browser'
            ? $i18n('browserNotifDeactivateMsgForPopup')
            : attribut === 'notif_by_email'
              ? $i18n('mailNotifDeactivateMsgForPopup')
              : $i18n('alertNotifDeactivateMsgForPopup');
        //
        alertConfirmNotice(
          {
            title: $i18n('notificationPopupDeactivationTitle'),
            msg: message,
            okLabel: $i18n('confirmButtonLabel'),
            cancelLabel: $i18n('cancel'),
          },
          (prompt) => {
            if (prompt) {
              updateSettings(setting);
            }
          }
        );
      } else {
        updateSettings(setting);
      }
    }
  };

  return {
    loadSettings,
    settingUpdate,
    alertConfirmNotice,
    messageNotice,
    alertNotice,
    alertPromptNotice,
    resetSettingUnsubDate,
    watchSettingWithUnsubDate,
  };
}
