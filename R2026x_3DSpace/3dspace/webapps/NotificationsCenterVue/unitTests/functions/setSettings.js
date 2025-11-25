import { allEventsHandlers } from '../../src/api/responseHandlers';
import useSettingsStore from '../../src/stores/settings';
/**
 * Sets the settings data.
 *
 * @param {Object} data - The data to set as the settings.
 * @returns {boolean} - Returns true if the settings were successfully set, otherwise false.
 */
export function setSettings(data = null) {
  let internalData = data;
  if (!internalData) {
    internalData = {
      settings: [
        {
          APPID: 'ENOBUPS_AP',
          ID: 42,
          NAME: 'Decision Created',
          serviceName: 'bps.decision.created.setting',
          NOTIF_BY_BROWSER: 0,
          NOTIF_BY_EMAIL: 0,
          NOTIF_BY_UI: 1,
          SUBSCRIBE: 1,
          UNSUBSCRIBE_DATE: null,
        },
        {
          APPID: 'ENOBUPS_AP',
          ID: 18,
          NAME: 'Decision Ownership Changed',
          serviceName: 'bps.decision.changeowner.setting',
          NOTIF_BY_BROWSER: 0,
          NOTIF_BY_EMAIL: 0,
          NOTIF_BY_UI: 1,
          SUBSCRIBE: 1,
          UNSUBSCRIBE_DATE: null,
        },
        {
          APPID: 'ENOBUPS_AP',
          ID: 17,
          NAME: 'Decision State Changed',
          serviceName: 'bps.decision.statechange.setting',
          NOTIF_BY_BROWSER: 0,
          NOTIF_BY_EMAIL: 0,
          NOTIF_BY_UI: 1,
          SUBSCRIBE: 1,
          UNSUBSCRIBE_DATE: null,
        },
      ],
    };
  }
  const eventHandlers = allEventsHandlers();
  eventHandlers.setSettings(internalData);
  const store = useSettingsStore();
  //
  return store.settings !== null;
}

export function updateSettings(data) {
  const eventHandlers = allEventsHandlers();
  eventHandlers.setSetting(data);
  //
  return true;
}
