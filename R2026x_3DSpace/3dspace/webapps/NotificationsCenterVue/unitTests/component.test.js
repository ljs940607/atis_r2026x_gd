import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeAll } from 'vitest';
import NotificationDate from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationDate.vue';
import NotificationActions from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationActions.vue';
import NotificationIcon from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationIcon.vue';
import NotificationMenu from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationMenu.vue';
import NotificationBody from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationBody.vue';
import NotificationMessage from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationMessage.vue';
import NotificationStatus from '../src/components/BaseCenter/CenterBody/Notification/NotificationBody/NotificationStatus.vue';
import NotificationDeleted from '../src/components/BaseCenter/CenterBody/Notification/NotificationDeleted.vue';
import NoNotification from '../src/components/BaseCenter/CenterBody/NoNotification.vue';
import { setActivePinia, createPinia } from 'pinia';
import actions from '~/test/mock/actions.json';
import { setup } from './functions/setup';
import { setHistory } from './functions/setHistory';
import useNotificationsStore from '../src/stores/notifications';
import NotificationItem from '../src/components/BaseCenter/CenterBody/Notification/NotificationItem.vue';
import NotificationMergesList from '../src/components/BaseCenter/CenterBody/Notification/NotificationMergesList.vue';
import SectionItem from '../src/components/BaseCenter/CenterBody/SectionItem.vue';
import SectionList from '../src/components/BaseCenter/CenterBody/SectionList.vue';
import BaseCenter from '../src/components/BaseCenter/BaseCenter.vue';
import UnreadCounter from '../src/components/BaseCenter/CenterHeader/UnreadCounter.vue';
import CenterHeader from '../src/components/BaseCenter/CenterHeader/CenterHeader.vue';
import FilterBody from '../src/components/BaseCenter/CenterHeader/FilterBody/FilterBody.vue';
import FilterButtons from '../src/components/BaseCenter/CenterHeader/FilterBody/FilterButtons.vue';
import FilterOptions from '../src/components/BaseCenter/CenterHeader/FilterBody/FilterOptions.vue';
import Toolbar from '../src/components/BaseCenter/CenterHeader/Toolbar/Toolbar.vue';
import Setting from '../src/components/BaseCenter/CenterHeader/Toolbar/Setting.vue';
import SelectWrapper from '../src/components/BaseCenter/CenterHeader/Toolbar/SelectWrapper.vue';
import SelectTool from '../src/components/BaseCenter/CenterHeader/Toolbar/SelectTool.vue';
import Filter from '../src/components/BaseCenter/CenterHeader/Toolbar/Filter.vue';
import BasePreferences from '../src/components/BaseCenter/BasePreferences.vue';
const { initDriver, init } = setup();
describe('Notification Center Vue Components ODT', () => {
  beforeAll(async () => {
    setActivePinia(createPinia());
    initDriver();
    init();
    setHistory();
  });
  //
  test('UnreadCounter', async () => {
    const wrapper = mount(UnreadCounter);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('CenterHeader', async () => {
    const wrapper = mount(CenterHeader);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('FilterBody', async () => {
    const wrapper = mount(FilterBody);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('FilterButtons', async () => {
    const wrapper = mount(FilterButtons);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('FilterOptions', async () => {
    const wrapper = mount(FilterOptions);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('Filter', async () => {
    const wrapper = mount(Filter);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('SelectTool', async () => {
    const wrapper = mount(SelectTool);
    expect(wrapper.exists()).toBe(true);
  });
  //
  test('SelectWrapper', async () => {
    const wrapper = mount(SelectWrapper);
    expect(wrapper.exists()).toBe(true);
  });
  test('Setting', async () => {
    const wrapper = mount(Setting);
    expect(wrapper.exists()).toBe(true);
  });
  test('Toolbar', async () => {
    const wrapper = mount(Toolbar);
    expect(wrapper.exists()).toBe(true);
  });

  test('NotificationDate', async () => {
    const date = new Date().toDateString();
    const wrapper = mount(NotificationDate, {
      props: {
        date: date,
        isRead: true,
      },
    });
    //
    expect(wrapper.classes()).toContain('INTFCenter-is-read');
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain(date);
  });
  //

  //
  test('NotificationActions', async () => {
    const wrapper = mount(NotificationActions, {
      // shallow: true,
      props: {
        actions: actions,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('NotificationMenu', async () => {
    const store = useNotificationsStore();
    const notification = store.getNotificationById('5332-devprol42');
    // console.log('options', notification.OPTIONS);
    const wrapper = mount(NotificationMenu, {
      props: {
        options: notification.OPTIONS,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('NotificationBody', async () => {
    const store = useNotificationsStore();
    const notification = store.getNotificationById('5332-devprol42');
    const wrapper = mount(NotificationBody, {
      props: {
        notification: notification,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  test('NotificationMessage', async () => {
    const store = useNotificationsStore();
    const notification = store.getNotificationById('5332-devprol42');
    const wrapper = mount(NotificationMessage, {
      props: {
        notification: notification,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('NotificationIcon', async () => {
    const wrapper = mount(NotificationIcon, {
      props: {
        icon: './../../resources/en/1/webapps/NotifAlert/assets/icons/notificon.png',
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('NotificationStatus', async () => {
    const wrapper = mount(NotificationStatus, {
      props: {
        isRead: false,
        isStarred: false,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('NotificationDeleted', async () => {
    const wrapper = mount(NotificationDeleted, {
      props: {
        id: 13,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  //
  test('NoNotification', async () => {
    const wrapper = mount(NoNotification);
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  test('NotificationItem', async () => {
    const store = useNotificationsStore();
    const notification = store.getNotificationById('5332-devprol42');
    const wrapper = mount(NotificationItem, {
      props: {
        notification: notification,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  //
  test('NotificationMergesList', async () => {
    const store = useNotificationsStore();
    const notification = store.getNotificationById('5332-devprol42');
    const wrapper = mount(NotificationMergesList, {
      props: {
        mainId: notification.ID,
        groupId: notification.GROUPID,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  //
  test('SectionItem', async () => {
    const store = useNotificationsStore();
    const section = store.sectionList.get(store.sectionListIds[0] ?? expect.fail());
    const wrapper = mount(SectionItem, {
      props: {
        section: section,
      },
    });
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
  //
  test('SectionList', async () => {
    const wrapper = mount(SectionList);
    //

    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  //
  test('BaseCenter', async () => {
    const wrapper = mount(BaseCenter);
    //
    // todo: test the center as if it was a user interacting with it
    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });

  test('BasePreferences', async () => {
    const wrapper = mount(BasePreferences);
    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.html()).toContain(date);
  });
});
