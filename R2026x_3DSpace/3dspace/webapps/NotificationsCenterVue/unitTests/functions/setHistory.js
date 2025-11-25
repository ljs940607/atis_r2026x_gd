import { allEventsHandlers } from '../../src/api/responseHandlers';
import useNotificationsStore from '../../src/stores/notifications';
/**
 * Sets the history data for notifications.
 *
 * @param {Object} data - The data to set as history. If not provided, a default data will be used.
 * @returns {boolean} - Returns true if the notifications store has at least one notification, otherwise false.
 */
export function setHistory(data = null) {
  let internalData;
  if (!data) {
    internalData = {
      appName: '3dswym',
      currentTenant: 'DEVOPSYSO157UW24041',
      clusterId: 'devprol42',
      language: 'en',
      notifications: [
        {
          ID: 5332,
          TYPE: 'Tk9USUZfVUk=',
          MESSAGE:
            'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz4jI01FUkdFX0NPVU5UIyMgUGVyc29uczwvc3Ryb25nPiB3b3VsZCBsaWtlIHRvIGpvaW4gPHN0cm9uZz5kb2NEZXY8L3N0cm9uZz4iLCJkYXRhIjp7IkZST01fVVNFUl9NQUlMIjoiamFpb24uc2FtaWVsQGRvY2tlcmJpa2UuY29tIiwiTk9USUZJRVJfTUVTU0FHRSI6ImZ6ZnplXG4iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYiLCJGUk9NX1VTRVJfTkFNRSI6IllheWEgU29ybyJ9fSwiYWN0aW9ucyI6W3sidHlwZSI6InNlbGVjdCIsIm9wdGlvbnMiOnsiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOlt7ImxhYmVsIjoiQWNjZXB0IChDb250cmlidXRvcikiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL0NvbnRyaWJ1dG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiQXV0aG9yIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1VXZFlkZ21wUnlPLUt2ajhxUnU0UWcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9BdXRob3IiLCJ0eXBlIjoiUE9TVCJ9LHsibGFiZWwiOiJPd25lciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9VV2RZZGdtcFJ5Ty1Ldmo4cVJ1NFFnL2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvT3duZXIiLCJ0eXBlIjoiUE9TVCJ9XX19fSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImV2ZW50Ijp7InR5cGUiOiJVSSIsIm9wdGlvbnMiOnsidGl0bGUiOiJEZW55IGNvbW11bml0eSBhY2Nlc3MiLCJhdHRhY2htZW50cyI6W3sidHlwZSI6ImxhYmVsIiwidGV4dCI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gIyNNRVJHRV9DT1VOVCMjIFBlcnNvbnMiLCJkYXRhIjp7IkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2In0sInJlZmVyZW5jZSI6ImxibDEiLCJtc2ciOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvICMjTUVSR0VfQ09VTlQjIyBQZXJzb25zIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
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
          COUNT: 3,
          STARRED: 0,
          APPID: 'USASWYM_AP',
          SERVICE_ID: 21,
          CLUSTER_ID: 'devprol42',
        },
        {
          ID: 1747,
          TYPE: 'Tk9USUZfVUk=',
          MESSAGE:
            'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5c28xNSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcGVndWUgU09STzwvc3Ryb25nPiBzaGFyZWQgdGhlIGNvbW11bml0eSA8c3Ryb25nPmRvY0Rldjwvc3Ryb25nPiB3aXRoIHlvdS4gIiwiZGF0YSI6eyJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYiLCJOT1RJRklFUl9NRVNTQUdFIjoiIiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcGVndWUgU09STyJ9fSwiYWN0aW9ucyI6W3sidHlwZSI6ImxpbmsiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjp7InNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvI2FwcDpYM0RNQ1RZX0FQL2NvbnRlbnQ6Y29tbXVuaXR5PVhaeXo3WG9iUUVxV1NtUXkyLU9vQWcmY29tbXVuaXR5VHlwZT1jb21tdW5pdHkmeDNkUGxhdGZvcm1JZD1ERVZPUFNZU08xNTdVVzMxMjIxMjQiLCJ0eXBlIjoiR0VUIn19fX1dfQ==',
          PRIORITY: '',
          STATE: 1,
          CREATION_DATE: '2023-07-04T10:46:35.000Z',
          READ_DATE: '2023-07-04T10:58:39.000Z',
          ACTION: null,
          ACTION_DATE: '2023-07-04T10:58:39.000Z',
          APP_ID: 7,
          NAME: 'sharing.content.setting',
          PLATFORMID: 'DEVOPSYSO157UW3122124',
          ACTOR_DATA: null,
          SHARED: 1,
          GROUPID: '5b7916b5a7220f4b456b8f9694c41709',
          COUNT: 1,
          STARRED: 0,
          APPID: 'USASWYM_AP',
          SERVICE_ID: 18,
          CLUSTER_ID: 'devprol42',
        },
      ],
    };
  }
  const eventHandlers = allEventsHandlers();
  eventHandlers.setHistory(internalData);
  const store = useNotificationsStore();
  //
  return store.notifications.size > 0;
}

/**
 * Sets the history data for notifications.
 *
 * @param {Object} data - The data to set as history. If not provided, a default data will be used.
 * @returns {boolean} - Returns true if the notifications store has at least one notification, otherwise false.
 */
export function setNotifications(data = null) {
  let internalData;
  if (!data) {
    internalData = {
      appName: '3dswym',
      currentTenant: 'DEVOPSYSO157UW24041',
      clusterId: 'devprol42',
      language: 'en',
      count: 2,
      notifications: [
        {
          ID: 5332,
          TYPE: 'Tk9USUZfVUk=',
          MESSAGE:
            'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5eSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz4jI01FUkdFX0NPVU5UIyMgUGVyc29uczwvc3Ryb25nPiB3b3VsZCBsaWtlIHRvIGpvaW4gPHN0cm9uZz5kb2NEZXY8L3N0cm9uZz4iLCJkYXRhIjp7IkZST01fVVNFUl9NQUlMIjoiamFpb24uc2FtaWVsQGRvY2tlcmJpa2UuY29tIiwiTk9USUZJRVJfTUVTU0FHRSI6ImZ6ZnplXG4iLCJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYiLCJGUk9NX1VTRVJfTkFNRSI6IllheWEgU29ybyJ9fSwiYWN0aW9ucyI6W3sidHlwZSI6InNlbGVjdCIsIm9wdGlvbnMiOnsiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOlt7ImxhYmVsIjoiQWNjZXB0IChDb250cmlidXRvcikiLCJhY3Rpb25lZF9sYWJlbCI6IkFjY2VwdGVkIiwic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvYWNjZXB0am9pbi9yb2xlL0NvbnRyaWJ1dG9yIiwidHlwZSI6IlBPU1QifSx7ImxhYmVsIjoiQXV0aG9yIiwiYWN0aW9uZWRfbGFiZWwiOiJBY2NlcHRlZCIsInNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvYXBpL25vdGlmaWNhdGlvbi9mZWVkYmFja25vdGlmc2VydmVyL2lkL1VXZFlkZ21wUnlPLUt2ajhxUnU0UWcvYW5zd2VyL2FjY2VwdGpvaW4vcm9sZS9BdXRob3IiLCJ0eXBlIjoiUE9TVCJ9LHsibGFiZWwiOiJPd25lciIsImFjdGlvbmVkX2xhYmVsIjoiQWNjZXB0ZWQiLCJzZXJ2aWNlIjoiM0RTd3ltIiwidXJpIjoiL2FwaS9ub3RpZmljYXRpb24vZmVlZGJhY2tub3RpZnNlcnZlci9pZC9VV2RZZGdtcFJ5Ty1Ldmo4cVJ1NFFnL2Fuc3dlci9hY2NlcHRqb2luL3JvbGUvT3duZXIiLCJ0eXBlIjoiUE9TVCJ9XX19fSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImV2ZW50Ijp7InR5cGUiOiJVSSIsIm9wdGlvbnMiOnsidGl0bGUiOiJEZW55IGNvbW11bml0eSBhY2Nlc3MiLCJhdHRhY2htZW50cyI6W3sidHlwZSI6ImxhYmVsIiwidGV4dCI6IkRlbnkgYWNjZXNzIG9mIGNvbW11bml0eSBkb2NEZXYgdG8gIyNNRVJHRV9DT1VOVCMjIFBlcnNvbnMiLCJkYXRhIjp7IkZST01fVVNFUl9OQU1FIjoiWWF5YSBTb3JvIiwiQ09NTVVOSVRZX1RJVExFIjoiZG9jRGV2In0sInJlZmVyZW5jZSI6ImxibDEiLCJtc2ciOiJEZW55IGFjY2VzcyBvZiBjb21tdW5pdHkgZG9jRGV2IHRvICMjTUVSR0VfQ09VTlQjIyBQZXJzb25zIn0seyJ0eXBlIjoidGV4dGJveCIsIm11bHRpIjp0cnVlLCJwbGFjZWhvbGRlciI6IkRlbnkiLCJyZWZlcmVuY2UiOiJ0eHRieERlbnkifSx7InR5cGUiOiJidXR0b24iLCJvcHRpb25zIjp7ImxhYmVsIjoiRGVueSIsImFjdGlvbmVkX2xhYmVsIjoiRGVuaWVkIiwiZXZlbnQiOnsidHlwZSI6InVybCIsIm9wdGlvbnMiOnsic2VydmljZSI6IjNEU3d5bSIsInVyaSI6Ii9hcGkvbm90aWZpY2F0aW9uL2ZlZWRiYWNrbm90aWZzZXJ2ZXIvaWQvVVdkWWRnbXBSeU8tS3ZqOHFSdTRRZy9hbnN3ZXIvZGVueWpvaW4iLCJ0eXBlIjoiUE9TVCIsImRhdGEiOiIjSlMjdHh0YnhEZW55LnZhbHVlI0pTIyJ9fX19XX19fX1dfQ==',
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
          COUNT: 3,
          STARRED: 0,
          APPID: 'USASWYM_AP',
          SERVICE_ID: 21,
          CLUSTER_ID: 'devprol42',
        },
        {
          ID: 1747,
          TYPE: 'Tk9USUZfVUk=',
          MESSAGE:
            'eyJpY29uIjp7InR5cGUiOiJsb2dpbiIsImRhdGEiOiJ5c28xNSJ9LCJubHMiOnsibXNnIjoiPHN0cm9uZz5ZYXlhIFNvcGVndWUgU09STzwvc3Ryb25nPiBzaGFyZWQgdGhlIGNvbW11bml0eSA8c3Ryb25nPmRvY0Rldjwvc3Ryb25nPiB3aXRoIHlvdS4gIiwiZGF0YSI6eyJDT01NVU5JVFlfVElUTEUiOiJkb2NEZXYiLCJOT1RJRklFUl9NRVNTQUdFIjoiIiwiRlJPTV9VU0VSX05BTUUiOiJZYXlhIFNvcGVndWUgU09STyJ9fSwiYWN0aW9ucyI6W3sidHlwZSI6ImxpbmsiLCJvcHRpb25zIjp7ImV2ZW50Ijp7InR5cGUiOiJ1cmwiLCJvcHRpb25zIjp7InNlcnZpY2UiOiIzRFN3eW0iLCJ1cmkiOiIvI2FwcDpYM0RNQ1RZX0FQL2NvbnRlbnQ6Y29tbXVuaXR5PVhaeXo3WG9iUUVxV1NtUXkyLU9vQWcmY29tbXVuaXR5VHlwZT1jb21tdW5pdHkmeDNkUGxhdGZvcm1JZD1ERVZPUFNZU08xNTdVVzMxMjIxMjQiLCJ0eXBlIjoiR0VUIn19fX1dfQ==',
          PRIORITY: '',
          STATE: 1,
          CREATION_DATE: '2023-07-04T10:46:35.000Z',
          READ_DATE: null,
          ACTION: null,
          ACTION_DATE: '2023-07-04T10:58:39.000Z',
          APP_ID: 7,
          NAME: 'sharing.content.setting',
          PLATFORMID: 'DEVOPSYSO157UW3122124',
          ACTOR_DATA: null,
          SHARED: 1,
          GROUPID: '5b7916b5a7220f4b456b8f9694c41709',
          COUNT: 1,
          STARRED: 0,
          APPID: 'USASWYM_AP',
          SERVICE_ID: 18,
          CLUSTER_ID: 'devprol42',
        },
      ],
    };
  }
  const eventHandlers = allEventsHandlers();
  eventHandlers.setNotifications(internalData);
  const store = useNotificationsStore();
  //
  return store.notifications.size > 0;
}
