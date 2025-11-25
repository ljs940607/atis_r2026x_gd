export class Setting {
  /**
   * Constructs a new Setting object.
   * @param {Object} setting - The setting object.
   */
  constructor(setting) {
    for (const [key, value] of Object.entries(setting)) {
      this[key.toLowerCase()] = value;
    }
    this.groupList = [];
  }

  /**
   * Returns whether the setting is a group.
   * @returns {boolean} True if the setting is a group, false otherwise.
   */
  get isGroup() {
    return this.name === 'GLOBAL';
  }

  /**
   * Returns whether the setting is read-only.
   * @returns {boolean} True if the setting is read-only, false otherwise.
   */
  get readOnly() {
    return parseInt(!!this.subscribe.readOnly ? this.subscribe.readOnly || 0 : 0) === 1;
  }

  /**
   * Returns whether the notification is enabled.
   *
   * @returns {boolean} True if the notification is enabled, false otherwise.
   */
  get enable() {
    return (
      parseInt(!!this.subscribe.enable ? this.subscribe.enable || 0 : this.subscribe || 0) === 1
        && (this.unsubscribe_date === null || new Date(this.unsubscribe_date) < new Date(Date.now()))
    );
  }

  /**
   * Returns the value of notif_by_uiReadOnly.
   * @returns {number} The value of notif_by_uiReadOnly.
   */
  get notif_by_uiReadOnly() {
    return parseInt(!!this.notif_by_ui.readOnly ? this.notif_by_ui.readOnly || 0 : 0);
  }

  /**
   * Returns the value of notif_by_emailReadonly.
   * @returns {number} The value of notif_by_emailReadonly.
   */
  get notif_by_emailReadonly() {
    return parseInt(!!this.notif_by_email.readOnly ? this.notif_by_email.readOnly || 0 : 0);
  }

  /**
   * Returns the value of notif_by_browserReadonly.
   * @returns {number} The value of notif_by_browserReadonly.
   */
  get notif_by_browserReadonly() {
    return parseInt(!!this.notif_by_browser.readOnly ? this.notif_by_browser.readOnly || 0 : 0);
  }

  /**
   * Resets the unsubscription date.
   */
  resetUnsubscriptionDate() {
    this.unsubscribe_date = null;
  }

  /**
   * Checks if the given ID is present in the group list.
   *
   * @param {any} id - The ID to check.
   * @returns {boolean} - Returns true if the ID is present in the group list, otherwise returns false.
   */
  isInGroupList(id) {
    return this.groupList.includes(id);
  }

  /**
   * Sets the group list.
   *
   * @param {Array} groupList - The new group list.
   * @returns {void}
   */
  setGroupList(groupList) {
    this.groupList = groupList;
  }

  /**
   * Adds an ID to the group list.
   *
   * @param {any} id - The ID to be added to the group list.
   * @returns {void}
   */
  addIdToGroupList(id) {
    if (!this.groupList.includes(id)) this.groupList.push(id);
  }
}
