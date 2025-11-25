import { ref } from 'vue';
import { addAndSortNotifsDateDesc, getDateSectionFormat } from '../functions/utils';
export class Section {
  id;
  title;
  notifs;

  /**
   * The Section constructor to create a new section with an id.
   * @param {number} id - The id is the notification date timestamp without the time.
   */
  constructor(id) {
    this.notifs = [];
    if (typeof id === 'number') {
      this.id = id;
      this.title = ref(' ');
      const date = new Date(id);
      getDateSectionFormat(date).then((resolvedTitle) => {
        this.title.value = resolvedTitle;
      });
    }
  }

  /**
   * Add an notification to notifs then sort it.
   * @param {object} item - { id, date }.
   */
  add(item) {
    const itemExists = this.notifs.filter((o) => o.id === item.id).length > 0;
    if (!itemExists) {
      addAndSortNotifsDateDesc(this.notifs, item);
    }
  }

  /**
   * Removes a notification with the specified ID from the section.
   * @param {number} id - The ID of the notification to remove.
   */
  remove(id) {
    this.notifs = this.notifs.filter((o) => o.id !== id);
  }
}
