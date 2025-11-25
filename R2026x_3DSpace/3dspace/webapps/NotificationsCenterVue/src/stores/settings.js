import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { Setting } from '../models/setting';
/**
 * General settings store.
 */

const useSettingsStore = defineStore('settings', () => {
  /**
   * Represents the state of the settings.
   * @typedef {Object} SettingState
   */
  const settingState = reactive({
    loaded: {
      settings: false,
    },
    isLoading: {
      settings: false,
    },
  });

  /**
   * Sets the load state of a setting.
   *
   * @param {string} key - The key of the setting.
   * @param {any} value - The value to set for the setting.
   */
  const setSettingLoadState = (key, value) => {
    settingState.loaded[key] = value;
  };

  /**
   * Sets the loading state of a setting.
   *
   * @param {string} key - The key of the setting.
   * @param {any} value - The value to set for the setting.
   */
  const setSettingLoadingState = (key, value) => {
    settingState.isLoading[key] = value;
  };

  /**
   * Indicates whether the center is shown or not.
   * @type {Ref<boolean>}
   */
  const centerShow = ref(true);

  /**
   * Indicates the DND status of the user.
   * @type {Ref<boolean>}
   */
  const isDND = ref(false);

  /**
   * Represents the state of the app setting panel.
   * @type {boolean}
   */
  const appSettingOpened = ref(false);
  // #region STATE
  // list of tenants
  /**
   * Represents a collection of tenants.
   * @typedef {Object} Tenants
   * @property {Array} tenants - The array of tenants.
   */
  const tenants = reactive({
    tenants: [],
  });

  /**
   * Represents the current setting.
   */
  const currentSetting = ref(null);

  /**
   * sets the current setting.
   * @param {*} id
   */
  const setCurrentSetting = (id) => {
    currentSetting.value = id;
  };

  /**
   * Resets the current setting.
   */
  const resetCurrentSetting = () => {
    currentSetting.value = null;
  };

  /**
   * resets the unsubscription date of a setting.
   * @param {*} id
   */
  const resetSettingUnsubDate = (id) => {
    const s = getSetting(id);
    if (s) s.unsubscribe_date = null;
  };

  /**
   * Represents the current tenant.
   */
  const currentTenant = ref(null);
  /**
   * @type {Map}
   */
  const settings = reactive(new Map());

  /**
   * List of settings with an unsubscribe date.
   */
  const unsubscribe_dateSettingList = ref([]);

  /**
   * checks if the setting is in the unsubscribe_dateSettingList.
   * @param {*} id
   * @returns
   */
  const isInUnsubscribe_dateSettingList = (id) => {
    return unsubscribe_dateSettingList.value.indexOf(id) !== -1;
  };

  /**
   * adds a setting to the unsubscribe_dateSettingList.
   * @param {*} id
   */
  const addUnsubscribe_dateSetting = (id) => {
    if (!isInUnsubscribe_dateSettingList(id)) {
      unsubscribe_dateSettingList.value.push(id);
    }
  };

  /**
   * removes a setting from the unsubscribe_dateSettingList.
   * @param {*} id
   */
  const removeUnsubscribe_dateSetting = (id) => {
    const index = unsubscribe_dateSettingList.value.indexOf(id);
    if (index !== -1) {
      unsubscribe_dateSettingList.value.splice(index, 1);
    }
  };

  /**
   * Individual setting of a global setting.
   * @type {Map}
   */
  const settingsList = reactive(new Map());

  //
  const listOfService = ref([]);
  const refreshNotificationCenter = ref(false);
  const nameofUpdatedSetting = ref(null);
  const hidePlatformSelection = ref(true); // true if platform selection should be hidden
  const isTenantAgnostic = ref(0); // 0: current, 1: all

  // #region ACTIONS

  /**
   * Sets the value of centerShow.
   *
   * @param {boolean} value - The new value for centerShow.
   */
  const setCenterShow = (value) => {
    centerShow.value = value;
  };

  /**
   * Sets the value of isDND.
   *
   * @param {boolean} value - The new value for isDND.
   */
  const setDNDStatus = (value) =>{
    isDND.value = value.isDND;
  }

  const setAppSettingOpened = (value) => {
    appSettingOpened.value = value;
  };

  const setCurrentTenant = (tenant) => {
    currentTenant.value = tenant;
  };

  /**
   * Set the tenant agnostic mode.
   * @param {object} data
   */
  const setTenantAgnosticData = (data) => {
    hidePlatformSelection.value = data.hidePlatformSelection;
    isTenantAgnostic.value = data.isTenantAgnostic;
  };

  /**
   * Set the list of services.
   * @param {object} data
   */
  const setListOfService = (data) => {
    listOfService.value = data.services;
    setCurrentTenant(data.currentTenant);
    // listOfServicesDone.value = true;
  };

  /**
   * Set the name of the updated setting.
   * @param {object} data
   */
  const setNameofUpdatedSetting = (data) => {
    nameofUpdatedSetting.value = data.setting;
  };
  /**
   * Set the tenants.
   * @param {object} data
   */
  const setTenantsData = (data) => {
    tenants.tenants = data;
  };

  // settings ---------------------------------
  const getIndividualSettingIds = (id) => {
    const setting = getSetting(id);
    return setting ? setting.groupList : [];
  };

  /**
   * Retrieves the setting group that matches the specified setting.
   *
   * @param {Object} setting - The setting to match.
   * @returns {Object|null} - The matching setting group, or null if not found.
   */
  const getSettingGroup = (setting) => {
    for (const [key, value] of settings.entries()) {
      if (value.isGroup && value.service === setting.service) {
        return value;
      }
    }
    return null;
  };

  /**
   * Checks if a setting belongs to the 'GLOBAL' group.
   *
   * @param {Object} setting - The setting object to check.
   * @returns {boolean} - Returns true if the setting belongs to the 'GLOBAL' group, otherwise returns false.
   */
  const isSettingGroup = (setting) => {
    const thatSetting = getSetting(setting.id);
    return thatSetting && thatSetting.isGroup;
  };

  const addSettingIdToGroupList = (group, settingId) => {
    group.addIdToGroupList(settingId);
  };

  /**
   * Retrieves the value of a setting based on its ID.
   *
   * @param {number} id - The ID of the setting to retrieve.
   * @returns {any} The value of the setting, or null if the setting does not exist.
   */
  const getSetting = (id) => {
    return settings.get(id) ?? null;
  };

  const getAllGroupSettings = computed(() => {
    const groupSettings = [];
    settings.forEach((setting) => {
      if (setting.isGroup) {
        groupSettings.push(setting);
      }
    });
    return groupSettings;
  });

  const getGroupIndividualSettings = (group) => {
    const groupSettings = [];
    group.groupList.forEach((id) => {
      const setting = getSetting(id);
      if (setting && !setting.isGroup) {
        groupSettings.push(setting);
      }
    });
    return groupSettings;
  };

  const addSetting = (setting) => {
    const newSetting = new Setting(setting);
    // check if the setting already exists
    const existingSetting = getSetting(setting.ID); // ID
    if (existingSetting) {
      for (const key in setting) {
        if (key.toLowerCase() !== 'servicename' && key.toLowerCase() !== 'id' && key.toLowerCase() !== 'name') {
          existingSetting[key.toLowerCase()] = setting[key];
        }
      }
    } else {
      settings.set(newSetting.id, newSetting);
      //
      if (newSetting.unsubscribe_date !== null) {
        addUnsubscribe_dateSetting(newSetting.id);
      }
    }
  };

  /**
   * Sets the settings data.
   *
   * @param {Object} data - The data containing the settings.
   */
  const setSettingsData = (data) => {
    for (let i = 0; i < data.settings.length; i++) {
      if (data.settings[i].service !== 'X3DNTFC_AP') {
        addSetting(data.settings[i]);
      }
    }
    // Add individual settings to the group list
    settings.forEach((setting) => {
      const group = getSettingGroup(setting);
      if (group) {
        addSettingIdToGroupList(group, setting.id);
      }
    });
  };

  /**
   * Sets the setting data.
   *
   * @param {any} data - The data to be set.
   * @returns {void}
   */
  const setSettingData = (data) => {
    addSetting(data);
  };

  return {
    refreshNotificationCenter,
    unsubscribe_dateSettingList,
    listOfService,
    nameofUpdatedSetting,
    tenants,
    settings,
    settingsList,
    centerShow,
    isDND,
    currentTenant,
    appSettingOpened,
    getAllGroupSettings,
    settingState,
    currentSetting,
    hidePlatformSelection,
    isTenantAgnostic,
    
    getCenterShow: () => centerShow.value,
    getDNDStatus: () => isDND.value,
    getCurrentTenant: () => currentTenant.value,
    getTenantAgnosticMode: () => platforms.isTenantAgnostic,
    getTenants: () => tenants.tenants,
    getListOfService: () => listOfService.value,

    setCurrentSetting,
    resetCurrentSetting,
    getGroupIndividualSettings,
    getSettingGroup,
    getSetting,
    isSettingGroup,
    getIndividualSettingIds,
    addSettingIdToGroupList,
    addSetting,
    setTenantAgnosticData,
    setSettingLoadState,
    setSettingLoadingState,
    setListOfService,
    setCurrentTenant,
    setTenantsData,
    setNameofUpdatedSetting,
    setSettingsData,
    setSettingData,
    setCenterShow,
    setDNDStatus,
    setAppSettingOpened,
    addUnsubscribe_dateSetting,
    removeUnsubscribe_dateSetting,
    resetSettingUnsubDate,
  };
});

export default useSettingsStore;
