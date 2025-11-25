import useTranslations from '~/composables/useTranslations';
import { getI18n } from '~/modules/imports';

const { $i18n } = useTranslations();

/**
 * Checks if a string is a valid URL.
 * @param {string} str - The string to be checked.
 * @returns {boolean} - Returns true if the string is a valid URL, otherwise returns false.
 */
const checkIfIsUrl = (str) => {
  let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(str);
};

/**
 * Adds an element to an array and sorts the array in descending order based on the element's date property.
 * If the element already exists in the array, it will not be added.
 * @param {Array} array - The array to add the element to and sort.
 * @param {object} el - The element to add to the array.
 */
const addAndSortNotifsDateDesc = (array, el) => {
  if (array.find((item) => item.id === el.id)) return;
  let index = 0;
  for (const item of array) {
    if (el.date >= item.date) break;
    index++;
  }
  array.splice(index, 0, el);
};

/**
 * Adds an ID to an array and sorts the array in descending order.
 * @param {Array} array - The array to add the ID to.
 * @param {number} id - The ID to add to the array.
 */
const addAndSortIdsDesc = (array, id) => {
  if (array.find((idItem) => idItem === id)) return;
  let index = 0;
  for (const idItem of array) {
    // -1 because it means it's a section with archive title
    if (id >= idItem && idItem !== -1) break;
    index++;
  }
  array.splice(index, 0, id);
};

/**
 * Adds and sorts the merge object into the given array based on the notification ID.
 * If an item with the same notification ID already exists in the array, it will not be added.
 * @param {Array} array - The array to add and sort the merge object into.
 * @param {object} merge - The merge object to add and sort into the array.
 */
const addAndSortMerge = (array, merge) => {
  if (array.find((item) => item.notification.id === merge.notification.id)) return;
  let index = 0;
  for (const item of array) {
    if (merge.notification.id >= item.notification.id) break;
    index++;
  }
  array.splice(index, 0, merge);
};

//
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculates the time difference in days between a given date and the current date.
 * @param {Date} date - The date to calculate the time difference from.
 * @returns {number} -  The time difference in days.
 */
const timeDiffByDays = (date) => {
  const today = new Date(Date.now());
  const diff = today - date;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Replaces a part of the input string with the specified replacement.
 * If the input string contains a closing parenthesis, it replaces the part of the string up to and including the closing parenthesis.
 * If the input string contains a closing strong tag, it replaces the part of the string up to and including the closing strong tag.
 * @param {string} input - The input string to be modified.
 * @param {string} replaceWith - The replacement string.
 * @returns {string} - The modified string.
 */
const replaceParenthesisStrong = (input, replaceWith) => {
  if (input.indexOf(`)`) !== -1) {
    const partToReplace = input.slice(0, input.indexOf(`)`) + `)`.length);
    return input.replace(partToReplace, replaceWith);
  } else if (input.indexOf(`</strong>`) !== -1) {
    const partToReplace = input.slice(0, input.indexOf(`</strong>`) + `</strong>`.length);
    return input.replace(partToReplace, replaceWith);
  }
  return input;
};

/**
 * Returns a Date object representing one month ago from the current date.
 * @returns {Date} The date one month ago.
 */
const oneMonthAgo = () => {
  // get today's date
  const date = new Date(Date.now());
  date.setMonth(date.getMonth() - 1);
  // set the time to 00:00:00:00
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Returns the merge format of a given date.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The merge format of the date.
 */
const getDateMergeFormat = async (date) => {
  if (timeDiffByDays(date) === 0) {
    return $i18n('today');
  } else if (timeDiffByDays(date) === 1) {
    return $i18n('yesterday');
  } else {
    const I18n = await getI18n();
    return date.toLocaleDateString(I18n.getCurrentLanguage(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

/**
 * Returns the formatted date section for a given date.
 *
 * @param {Date} date - The date to format.
 * @returns {Promise<string>} The formatted date section.
 */
const getDateSectionFormat = async (date) => {
  if (timeDiffByDays(date) === 0) {
    return $i18n('today').toUpperCase();
  } else if (timeDiffByDays(date) === 1) {
    return $i18n('yesterday').toUpperCase();
  } else {
    const format = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const I18n = await getI18n();
    return date.toLocaleDateString(I18n.getCurrentLanguage(), format).toUpperCase();
  }
};

/**
 * Get the +1 hour date.
 * @param {Date} date - Start date.
 * @returns Date + 1 hour.
 */
const getDateAfter1Hour = (date) => {
  date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
  // console.log('date after 1 hour:', date.toISOString());
  // return dateStringify(date);
  return date.toISOString();
};

/**
 * Returns the date and time after adding 5 minutes to the given date.
 *
 * @param {Date} date - The date to add 5 minutes to.
 * @returns {string} The date and time after adding 5 minutes, in ISO 8601 format.
 */
const getDateAfter5Min = (date) => {
  date.setTime(date.getTime() + 5 * 60 * 1000);
  return date.toISOString();
};

/**
 * Returns the date and time after adding 5 minutes to the given date.
 *
 * @param {Date} date - The date to add x minute
 * @param {number} x - minute
 * @returns {string} The date and time after adding 5 minutes, in ISO 8601 format.
 */
const getDateAfterXMin = (date, x) => {
  if (typeof x === 'number') {
    date.setTime(date.getTime() + x * 60 * 1000);
    return date.toISOString();
  }
  return date.toISOString();
};

/**
 * Generates a string formatted date.
 * @param {Date} date - Date to format.
 */
const dateStringify = (date) => {
  const format = (num) => {
    const newNum = `${num}`;
    if (newNum.length === 1) return `0${newNum}`;
    return newNum;
  };
  return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())} ${format(
    date.getHours()
  )}:${format(date.getMinutes())}:${format(date.getSeconds())}`;
};

/**
 * Clears the browser cache.
 */
const clearBrowserCache = () => {
  // clear browser cache
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
};

/**
 * Checks if the given id has a hyphen.
 *
 * @param {string} id - The id to check.
 * @returns {Object|boolean} - An object with id and clusterId properties if the id has a hyphen, otherwise false.
 */
const checkIfIdHasHyphen = (id) => {
  try {
    if (id.includes('-')) {
      return {
        id: id.split('-')[0],
        clusterId: id.split('-')[1],
      };
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * link the provided ID and cluster ID by a hyphen.
 *
 * @param {string} id - The ID.
 * @param {string} clusterId - The cluster ID.
 */
const linkIds = (id, clusterId) => {
  return `${id}-${clusterId}`;
};

export {
  addAndSortIdsDesc, addAndSortMerge, addAndSortNotifsDateDesc, checkIfIdHasHyphen, checkIfIsUrl, clearBrowserCache, dateStringify, getDateAfter1Hour,
  getDateAfter5Min,
  getDateAfterXMin, getDateMergeFormat,
  getDateSectionFormat, linkIds, oneMonthAgo, replaceParenthesisStrong, sleep, timeDiffByDays
};

