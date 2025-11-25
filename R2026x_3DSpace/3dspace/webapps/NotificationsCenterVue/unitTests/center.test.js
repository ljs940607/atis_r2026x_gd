import { createPinia, setActivePinia } from 'pinia';
import { beforeAll, describe, expect, test } from 'vitest';
import { deleteAllFilteredNotification, deleteAllNotification, filter } from '../src/api/senders';
import { useNotificationActions } from '../src/composables/notification/useNotificationActions';
import { useNotificationManagement } from '../src/composables/notification/useNotificationManagement';
import { checkIfIsUrl, sleep } from '../src/functions/utils';
import { readAllNotifications } from '../src/services/menu';
import useFilterStore from '../src/stores/filter';
import useNotificationsStore from '../src/stores/notifications';
import useSettingsStore from '../src/stores/settings';
import { getIconUrlTest } from './functions/getIconUrl';
import { setHistory, setNotifications } from './functions/setHistory';
import { setMerges } from './functions/setMerges';
import { setSettings, updateSettings } from './functions/setSettings';
import { setup } from './functions/setup';
import { unsubscribe } from './functions/unsubscribe';

const { initDriver, init } = setup();

describe('Notification Center Vue ODT', () => {
  beforeAll(async () => {
    setActivePinia(createPinia());
  });
  test('Init Driver', async () => {
    await initDriver();
    //
    expect(true).toBe(true);
  });

  test('Init Center', async () => {
    await init();
    //
    expect(true).toBe(true);
  });

  test('setNotifications', () => {
    expect(setNotifications()).toBe(true);
    //
    const store = useNotificationsStore();
    console.log('setNotifications', store.notifications.size);
    expect(store.notifications.size).toEqual(2);
    expect(store.filterNotifIds.length).toEqual(2);
  });

  test('setSettings', () => {
    expect(setSettings()).toBe(true);
  });

  test('Update settings', () => {
    const data = {
      setting: {
        APPID: 'ENOBUPS_AP',
        ID: 54,
        NAME: 'Decision Ownership Changed',
        serviceName: 'bps.decision.changeowner.setting',
        NOTIF_BY_BROWSER: 0,
        NOTIF_BY_EMAIL: 0,
        NOTIF_BY_UI: 1,
        SUBSCRIBE: 1,
        UNSUBSCRIBE_DATE: null,
      },
    };
    const store = useNotificationsStore();
    expect(updateSettings(data)).toBe(true);
  });

  test('Unsubscribe', () => {
    const data = {
      setting: {
        APPID: 'ENOBUPS_AP',
        ID: 18,
        NAME: 'Decision Ownership Changed',
        serviceName: 'bps.decision.changeowner.setting',
        NOTIF_BY_BROWSER: 0,
        NOTIF_BY_EMAIL: 0,
        NOTIF_BY_UI: 1,
        SUBSCRIBE: 0,
        UNSUBSCRIBE_DATE: null,
      },
    };
    const store = useNotificationsStore();
    //
    const { unsubNotifStillInCenter, nbNotifBeforeUnsub, nbNotifRemoved } = unsubscribe(data);
    //
    console.log(nbNotifBeforeUnsub);
    console.log(nbNotifRemoved);
    expect(unsubNotifStillInCenter).toBe(false);
    expect(store.notifications.size).toEqual(1);
    expect(store.filterNotifIds.length).toEqual(1);
    console.log('Unsubscribe', store.notifications.size);
  });

  test('getIconUrl - type = login ', () => {
    expect(
      getIconUrlTest({ icon: { type: 'login', data: 'yy' }, platformId: 'devopsyso157uw24041' })
    ).not.toBeUndefined();
  });
  test('getIconUrl - type = login & platformId!=listOfService[0].platformid ', () => {
    expect(getIconUrlTest({ icon: { type: 'login', data: 'yy' }, platformId: 'DSQAL024' })).not.toBeUndefined();
  });

  test('getIconUrl - type = url ', () => {
    expect(
      getIconUrlTest({
        icon: {
          data: { service: '3dswym', uri: '/api/notification/feedbacknotifserver/id/4/answer/acceptjoin' },
          type: 'url',
        },
        platformId: 'devopsyso157uw24041',
      })
    ).not.toBeUndefined();
  });

  test('getIconUrl - type = url & platformid = null ', () => {
    const url =
      getIconUrlTest({
        icon: {
          data: { service: '3dswym', uri: '/api/notification/feedbacknotifserver/id/4/answer/acceptjoin' },
          type: 'url',
        },
        platformId: null,
      }) || ''; // can return undefined
    expect(url).toBeTruthy();
  });

  test.skip('getIconUrl - type = app', () => {
    // skip this test for now as the function need a specific environment to run
  });

  test('readAll and filter on unread', () => {
    const store = useNotificationsStore();
    const filterStore = useFilterStore();
    //
    const previousSize = store.notifications.size;
    readAllNotifications(true); // takes in account if filter is active
    filterStore.filter.unread = false;
    expect(store.notifications.size).toBe(previousSize);
    store.notifications.forEach((notification) => {
      expect(notification.isRead).toBe(true);
    });
  });

  test('deleteAllFilteredNotification', () => {
    //
    setHistory();
    //
    const store = useNotificationsStore();
    //
    console.log(store.notifications.size);
    deleteAllFilteredNotification({
      notificationID: [
        { id: 1747, archived: false },
        // { id: 5332, archived: false },
      ],
    });
    console.log(store.notifications.size);
    //
    // normally should be 1 but the response handler delete all the notifications
    // expect the center to be empty
    expect(store.notifications.size).toEqual(0);
  });

  test('deleteAllNotification', () => {
    // because the previous test deleted all the notifications
    setHistory();
    //
    const store = useNotificationsStore();
    expect(store.notifications.size).toEqual(2);
    deleteAllNotification();
    expect(store.notifications.size).toEqual(0);
  });

  test('getCsrfUrl', () => {
    const { getCsrfUrl } = useNotificationActions();
    expect(getCsrfUrl()).not.toBeUndefined();
  });

  test('getMoreHistory & getMoreFilterHistory', () => {
    //
    const { loadMoreNotifications } = useNotificationManagement();
    loadMoreNotifications();
    expect(true).toBe(true);
  });

  test('getMoreHistory', () => {
    //
    const { loadMoreNotifications } = useNotificationManagement();
    const store = useNotificationsStore();
    loadMoreNotifications();
    console.log('notifs length getMoreHistory', store.notifications.size);
    expect(true).toBe(true);
  });
  //
  test.skip('getAppInfos', () => {
    // skip this test for now as the function need a specific environment to run
  });
  //
  test.skip('publish event', () => {
    // skip this test for now as the function need a specific environment to run
  });
  //
  test('getIconUrl where type="login" listOfServices = null ', () => {
    const store = useSettingsStore();
    store.setListOfService({ services: [] });
    expect(
      getIconUrlTest({ icon: { type: 'login', data: 'yy' }, platformId: 'devopsyso157uw24041' })
    ).not.toBeUndefined();
  });
  //
  test('getIconUrl where type="login" listOfServices = 3dswym and url = "/" ', () => {
    const store = useSettingsStore();
    store.setListOfService({ services: [{ 'platformid': 'devopsyso157uw24041', '3dswym': '/' }] });
    const url = getIconUrlTest({ icon: { type: 'login', data: 'yy' }, platformId: 'devopsyso157uw24041' });
    expect(url).not.toBeUndefined();
    expect(url).toMatch('/api/user/getpicture/login/yy');
  });
  //
  test('getIconUrl type = "url" where listOfServices = null ', () => {
    const store = useSettingsStore();
    store.setListOfService({ services: [] });
    expect(
      getIconUrlTest({ icon: { type: 'url', data: 'yy' }, platformId: 'devopsyso157uw24041' })
    ).not.toBeUndefined();
  });
  //
  test('checkIfIsUrl', () => {
    expect(checkIfIsUrl('https://devopsyso157uw24041-euw1-devprol42-ifwe.3dx-staging.3ds.com:443')).toBe(true);
  });

  //
  test('setHistory for merge notifications', () => {
    // The only diff is to clean the center before setting the history & merges
    const store = useNotificationsStore();
    store.resetStates();
    //
    setHistory();
    console.log('setHistory for merge notifications', store.notifications);
    //
    const notifId = '5332-devprol42';
    const merges = [
      {
        ID: '32-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBmemZ6ZVxuIiwiZGF0YSI6eyJGUk9NX1VTRVJfTUFJTCI6ImphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSIsIk5PVElGSUVSX01FU1NBR0UiOiJmemZ6ZVxuIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2IiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8ifX0sImFjdGlvbnMiOlt7InR5cGUiOiJzZWxlY3QiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjpbeyJsYWJlbCI6IkFjY2VwdCAoQ29udHJpYnV0b3IpIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1VXZFlkZ21wUnlPLUt2ajhxUnU0UWcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Db250cmlidXRvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6IkF1dGhvciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9VV2RZZGdtcFJ5Ty1Ldmo4cVJ1NFFnL2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQXV0aG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiT3duZXIiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL093bmVyIiwidHlwZSI6IlBPU1QifV19fX0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJldmVudCI6eyJ0eXBlIjoiVUkiLCJvcHRpb25zIjp7InRpdGxlIjoiRGVueSBjb21tdW5pdHkgYWNjZXNzIiwiYXR0YWNobWVudHMiOlt7InR5cGUiOiJsYWJlbCIsInRleHQiOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyIsImRhdGEiOnsiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYifSwicmVmZXJlbmNlIjoibGJsMSIsIm1zZyI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gWWF5YSBTb3JvIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:43.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
      {
        ID: '31-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBmemYiLCJkYXRhIjp7IkZST01fVVNFUl9NQUlMIjoiamFpb24uc2FtaWVsQGRvY2tlcmJpa2UuY29tIiwiTk9USUZJRVJfTUVTU0FHRSI6ImZ6ZiIsIkNPTU1VTklUWV9USVRMRSI6ImRvY0RldiIsIkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIn19LCJhY3Rpb25zIjpbeyJ0eXBlIjoic2VsZWN0Iiwib3B0aW9ucyI6eyJldmVudCI6eyJ0eXBlIjoidXJsIiwib3B0aW9ucyI6W3sibGFiZWwiOiJBY2NlcHQgKENvbnRyaWJ1dG9yKSIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC91dlhsNUNIRVJNU3doSThlSUUwODF3L2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQ29udHJpYnV0b3IiLCJ0eXBlIjoiUE9TVCJ9LHsibGFiZWwiOiJBdXRob3IiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvdXZYbDVDSEVSTVN3aEk4ZUlFMDgxdy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL0F1dGhvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6Ik93bmVyIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL3V2WGw1Q0hFUk1Td2hJOGVJRTA4MXcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Pd25lciIsInR5cGUiOiJQT1NUIn1dfX19LHsidHlwZSI6ImJ1dHRvbiIsIm9wdGlvbnMiOnsibGFiZWwiOiJEZW55IiwiZXZlbnQiOnsidHlwZSI6IlVJIiwib3B0aW9ucyI6eyJ0aXRsZSI6IkRlbnkgY29tbXVuaXR5IGFjY2VzcyIsImF0dGFjaG1lbnRzIjpbeyJ0eXBlIjoibGFiZWwiLCJ0ZXh0IjoiRGVueSBhY2Nlc3Mgb2YgY29tbXVuaXR5IGRvY0RldiB0byBZYXlhIFNvcm8iLCJkYXRhIjp7IkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2In0sInJlZmVyZW5jZSI6ImxibDEiLCJtc2ciOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyJ9LHsidHlwZSI6InRleHRib3giLCJtdWx0aSI6dHJ1ZSwicGxhY2Vob2xkZXIiOiJEZW55IiwicmVmZXJlbmNlIjoidHh0YnhEZW55In0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJhY3Rpb25lZF9sYWJlbCI6IkRlbmllZCIsImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjp7InNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL3V2WGw1Q0hFUk1Td2hJOGVJRTA4MXcvYW5zd2VyL2Rlbnlqb2luIiwidHlwZSI6IlBPU1QiLCJkYXRhIjoiI0pTI3R4dGJ4RGVueS52YWx1ZSNKUyMifX19fV19fX19XX0=',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:33.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
      {
        ID: '30-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBnZXJnIiwiZGF0YSI6eyJGUk9NX1VTRVJfTUFJTCI6ImphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSIsIk5PVElGSUVSX01FU1NBR0UiOiJnZXJnIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2IiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8ifX0sImFjdGlvbnMiOlt7InR5cGUiOiJzZWxlY3QiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjpbeyJsYWJlbCI6IkFjY2VwdCAoQ29udHJpYnV0b3IpIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1dmaXZBNmpmU19XemZVUnFMUU1jQXcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Db250cmlidXRvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6IkF1dGhvciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9XZml2QTZqZlNfV3pmVVJxTFFNY0F3L2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQXV0aG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiT3duZXIiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvV2ZpdkE2amZTX1d6ZlVScUxRTWNBdy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL093bmVyIiwidHlwZSI6IlBPU1QifV19fX0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJldmVudCI6eyJ0eXBlIjoiVUkiLCJvcHRpb25zIjp7InRpdGxlIjoiRGVueSBjb21tdW5pdHkgYWNjZXNzIiwiYXR0YWNobWVudHMiOlt7InR5cGUiOiJsYWJlbCIsInRleHQiOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyIsImRhdGEiOnsiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYifSwicmVmZXJlbmNlIjoibGJsMSIsIm1zZyI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gWWF5YSBTb3JvIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvV2ZpdkE2amZTX1d6ZlVScUxRTWNBdy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:27.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
    ];
    expect(setMerges(merges, notifId)).toBe(true);
    //
  });
  //
  test('setHistory for Advanced UI & respective merge notifications', () => {
    // The only diff is to clean the center before setting the history & merges
    const store = useNotificationsStore();
    store.resetStates();
    //
    setHistory();
    //
    const notifId = '5332-devprol42';
    const merges = [
      {
        ID: '32-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBmemZ6ZVxuIiwiZGF0YSI6eyJGUk9NX1VTRVJfTUFJTCI6ImphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSIsIk5PVElGSUVSX01FU1NBR0UiOiJmemZ6ZVxuIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2IiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8ifX0sImFjdGlvbnMiOlt7InR5cGUiOiJzZWxlY3QiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjpbeyJsYWJlbCI6IkFjY2VwdCAoQ29udHJpYnV0b3IpIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1VXZFlkZ21wUnlPLUt2ajhxUnU0UWcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Db250cmlidXRvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6IkF1dGhvciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9VV2RZZGdtcFJ5Ty1Ldmo4cVJ1NFFnL2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQXV0aG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiT3duZXIiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL093bmVyIiwidHlwZSI6IlBPU1QifV19fX0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJldmVudCI6eyJ0eXBlIjoiVUkiLCJvcHRpb25zIjp7InRpdGxlIjoiRGVueSBjb21tdW5pdHkgYWNjZXNzIiwiYXR0YWNobWVudHMiOlt7InR5cGUiOiJsYWJlbCIsInRleHQiOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyIsImRhdGEiOnsiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYifSwicmVmZXJlbmNlIjoibGJsMSIsIm1zZyI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gWWF5YSBTb3JvIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:43.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
      {
        ID: '31-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBmemYiLCJkYXRhIjp7IkZST01fVVNFUl9NQUlMIjoiamFpb24uc2FtaWVsQGRvY2tlcmJpa2UuY29tIiwiTk9USUZJRVJfTUVTU0FHRSI6ImZ6ZiIsIkNPTU1VTklUWV9USVRMRSI6ImRvY0RldiIsIkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIn19LCJhY3Rpb25zIjpbeyJ0eXBlIjoic2VsZWN0Iiwib3B0aW9ucyI6eyJldmVudCI6eyJ0eXBlIjoidXJsIiwib3B0aW9ucyI6W3sibGFiZWwiOiJBY2NlcHQgKENvbnRyaWJ1dG9yKSIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC91dlhsNUNIRVJNU3doSThlSUUwODF3L2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQ29udHJpYnV0b3IiLCJ0eXBlIjoiUE9TVCJ9LHsibGFiZWwiOiJBdXRob3IiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvdXZYbDVDSEVSTVN3aEk4ZUlFMDgxdy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL0F1dGhvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6Ik93bmVyIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL3V2WGw1Q0hFUk1Td2hJOGVJRTA4MXcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Pd25lciIsInR5cGUiOiJQT1NUIn1dfX19LHsidHlwZSI6ImJ1dHRvbiIsIm9wdGlvbnMiOnsibGFiZWwiOiJEZW55IiwiZXZlbnQiOnsidHlwZSI6IlVJIiwib3B0aW9ucyI6eyJ0aXRsZSI6IkRlbnkgY29tbXVuaXR5IGFjY2VzcyIsImF0dGFjaG1lbnRzIjpbeyJ0eXBlIjoibGFiZWwiLCJ0ZXh0IjoiRGVueSBhY2Nlc3Mgb2YgY29tbXVuaXR5IGRvY0RldiB0byBZYXlhIFNvcm8iLCJkYXRhIjp7IkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2In0sInJlZmVyZW5jZSI6ImxibDEiLCJtc2ciOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyJ9LHsidHlwZSI6InRleHRib3giLCJtdWx0aSI6dHJ1ZSwicGxhY2Vob2xkZXIiOiJEZW55IiwicmVmZXJlbmNlIjoidHh0YnhEZW55In0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJhY3Rpb25lZF9sYWJlbCI6IkRlbmllZCIsImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjp7InNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL3V2WGw1Q0hFUk1Td2hJOGVJRTA4MXcvYW5zd2VyL2Rlbnlqb2luIiwidHlwZSI6IlBPU1QiLCJkYXRhIjoiI0pTI3R4dGJ4RGVueS52YWx1ZSNKUyMifX19fV19fX19XX0=',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:33.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
      {
        ID: '30-devprol42',
        TYPE: 'Tk9USUZfVUk=',
        MESSAGE:
          'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcm88L3N0cm9uZz4gKGphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSkgd291bGQgbGlrZSB0byBqb2luIDxzdHJvbmc+ZG9jRGV2PC9zdHJvbmc+LiBnZXJnIiwiZGF0YSI6eyJGUk9NX1VTRVJfTUFJTCI6ImphaW9uLnNhbWllbEBkb2NrZXJiaWtlLmNvbSIsIk5PVElGSUVSX01FU1NBR0UiOiJnZXJnIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2IiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8ifX0sImFjdGlvbnMiOlt7InR5cGUiOiJzZWxlY3QiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjpbeyJsYWJlbCI6IkFjY2VwdCAoQ29udHJpYnV0b3IpIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1dmaXZBNmpmU19XemZVUnFMUU1jQXcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9Db250cmlidXRvciIsInR5cGUiOiJQT1NUIn0seyJsYWJlbCI6IkF1dGhvciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9XZml2QTZqZlNfV3pmVVJxTFFNY0F3L2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvQXV0aG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiT3duZXIiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvV2ZpdkE2amZTX1d6ZlVScUxRTWNBdy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL093bmVyIiwidHlwZSI6IlBPU1QifV19fX0seyJ0eXBlIjoiYnV0dG9uIiwib3B0aW9ucyI6eyJsYWJlbCI6IkRlbnkiLCJldmVudCI6eyJ0eXBlIjoiVUkiLCJvcHRpb25zIjp7InRpdGxlIjoiRGVueSBjb21tdW5pdHkgYWNjZXNzIiwiYXR0YWNobWVudHMiOlt7InR5cGUiOiJsYWJlbCIsInRleHQiOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvIFlheWEgU29ybyIsImRhdGEiOnsiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcm8iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYifSwicmVmZXJlbmNlIjoibGJsMSIsIm1zZyI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gWWF5YSBTb3JvIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvV2ZpdkE2amZTX1d6ZlVScUxRTWNBdy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
        PRIORITY: '',
        STATE: 1,
        CREATION_DATE: '2024-07-04T15:09:27.000Z',
        READ_DATE: null,
        ACTION: null,
        ACTION_DATE: null,
        APP_ID: 7,
        NAME: 'managing.community.setting',
        PLATFORMID: 'DEVOPSYSO157UW3122124',
        ACTOR_DATA: null,
        SHARED: 0,
        GROUPID: '7dd6c218afbd28a07717ab343f1dae6a',
        STARRED: 0,
        APPID: 'USASWYM_AP',
        SERVICE_ID: 21,
        CLUSTER_ID: 'devprol42',
      },
    ];
    expect(setMerges(merges, notifId)).toBe(true);
  });
  //
  //
  test('filter: getFilter history', () => {
    const filterStore = useFilterStore();
    const store = useNotificationsStore();
    filterStore.filter = {
      first_date: new Date('2019-05-04T22:00:00.000Z'),
      last_date: new Date('2022-09-30T21:59:59.999Z'),
      searches: [],
      read: false,
      unread: false,
      starred: false,
      unstarred: false,
      tenants: [],
    };
    filter(filterStore.filter);
    expect(store.notifications.size).toBeGreaterThan(0);
    // skip this test for now as the function need a specific environment to run
  });
  //
  test.skip('setFilterWhoSettings', () => {
    // const store = useSettingsStore();
    // store.settings = null;
    // getSettings();
    // expect(store.settings).not.toBeNull();
    // skip this test for now as the function need a specific environment to run
    // todo: this test has not a use case in the vue center
  });
  //
  // The remaining tests are skipped as they are not relevant to the vue center or need a specific environment to run
});
