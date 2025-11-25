import { checkIfIdHasHyphen, linkIds } from '../functions/utils';

export class Notification {
  /**
   * Build a notification object.
   * @param {object} notification - A notification object.
   */
  constructor(notification, options, merge = false) {
    for (const [key, value] of Object.entries(notification)) {
      if (key === 'CREATION_DATE' || key === 'READ_DATE' || key === 'ACTION_DATE') {
        this[key] = value !== null ? new Date(value) : null;
      } else this[key] = value;
    }
    //
    this.CLUSTER_ID = options.clusterId || this.CLUSTER_ID;

    // when replacing a notification by a merge, the ID is already set, so need to check if it has a hyphen
    const idWithHyphen = checkIfIdHasHyphen(this.ID);
    if (!idWithHyphen) {
      this.NOTIF_ID = JSON.parse(JSON.stringify(this.ID));
      this.ID = linkIds(this.NOTIF_ID, this.CLUSTER_ID); // `${NOTIF_ID}-${CLUSTER_ID}`
    } else {
      this.NOTIF_ID = parseInt(idWithHyphen.id);
    }
    // add options
    this.deleted = false;
    this.deleteTimeoutId = null;
    this.currentTenant = options.currentTenant;
    this.appName = options.appName;
    if (!merge) {
      if (Object.hasOwn(this, 'COUNT') && this.COUNT > 1) {
        this.hasMerges = true;
        this.mergesFetched = false;
        this.mergesOpened = false;
        this.mergesRead = this.READ_DATE !== null ? this.COUNT : 0;
      }
    }
  }

  /**
   * Return notification options.
   */
  get getOptions() {
    return this.OPTIONS;
  }
  /**
   * Get the creation date to a format with options.
   * @param {string} local - The local string.
   * @param {object} option - The format option.
   * @returns {string} - The format outcome.
   */
  toLocaleDateString(local = undefined, option = {}) {
    return this.CREATION_DATE.toLocaleDateString(local, option);
  }

  /**
   * Returns the hour and minutes of the notification's creation date.
   * @param {string} format - The format for the date and time. (Optional).
   * @returns {string} The formatted hour and minutes.
   */
  getHourMinutes(format) {
    // bypass the format (because current center does not use it)
    // todo: format should be used ?
    return new Intl.DateTimeFormat('fr', { hour: '2-digit', minute: '2-digit' }).format(this.CREATION_DATE);
  }

  /**
   * Get the timestamp of the creation date.
   */
  get getCreationDateToTimestamp() {
    return this.CREATION_DATE.getTime();
  }

  /**
   * Return true if icon is a link.
   */
  get isIconLink() {
    if (this.MESSAGE.icon) {
      if (this.MESSAGE.icon.isLink) return true;
    }
    return false;
  }

  /**
   * Todo: this is not reactive yet.
   */
  get imageSrc() {
    if (this.MESSAGE.icon) {
      if (this.MESSAGE.icon.src) this.MESSAGE.icon.src;
    }
    return './../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png';
  }
  /**
   * Return notification section id.
   */
  get getSection() {
    const date = new Date(this.CREATION_DATE.getTime());
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  /**
   * Return true if READ_DATE is null.
   */
  get isRead() {
    return this.READ_DATE !== null;
  }
  /**
   * Return true if ACTION is null.
   */
  get isActioned() {
    return this.ACTION_DATE !== null && this.ACTION_DATE !== '0000-00-00 00:00:00' ? true : false;
  }
  /**
   * Return true if is starred.
   */
  get isStarred() {
    return (this.STARRED === 1 || this.STARRED === "1");
  }
  /**
   * Return true if is Count > 1.
   */
  get isGroup() {
    return Object.hasOwn(this, 'COUNT') && this.COUNT > 1;
  }
  /**
   * Return true if is Merge.
   */
  get isMerge() {
    return !Object.hasOwn(this, 'COUNT');
  }

  /**
   * Performs an action for the notification.
   */
  actionNotification() {
    this.ACTION_DATE = new Date().toISOString();
  }
}
