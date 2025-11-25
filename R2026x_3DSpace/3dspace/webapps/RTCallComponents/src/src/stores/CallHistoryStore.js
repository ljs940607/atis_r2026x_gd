import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import * as rtconv from '../api/callhistory_api'
import { useRTCStore } from './RTCStore'
import {useEventBus} from '@vueuse/core';

export const CALL_TYPES = {
  'All': {
    label: 'All Calls',
    value: 'All',
    text: 'All Calls',
    icon: ''
  },
  'Missed': {
    label: 'Missed Calls',
    value: 'Missed',
    text: 'Missed',
    icon: 'phone-call-missed'
  },
  'Ongoing': {
    label: 'Ongoing Calls',
    value: 'Ongoing',
    text: 'Ongoing',
    icon: 'phone-call-ongoing'
  },
  'Incoming': {
    label: 'Incoming Calls',
    value: 'Incoming',
    text: 'Incoming',
    icon: 'phone-call-received'
  },
  'Outgoing': {
    label: 'Outgoing Calls',
    value: 'Outgoing',
    text: 'Outgoing',
    icon: 'phone-call-sent'
  },
  'Declined': {
    label: 'Declined Calls',
    value: 'Declined',
    text: 'Declined',
    icon: 'phone-call-declined'
  }
};


export const useCallHistoryStore = defineStore('CallHistory', () => {
  // STATES
  const rtcStore = useRTCStore();
  const bus = useEventBus('swym-events');

  const callsMap = reactive(new Map());
  let callIdList = reactive([]);
  let ongoingCallIdList = reactive([]);
  const selectedContact = reactive([]);
  const isLoading = ref(true);

  // for paginated request on scroll
  const moreCallsToFetch = ref(true);
  const waitForResponse = ref(false);

  const enableTelephony = ref(false);
  const enableProfile = ref(true);

  const filters = ref({
    category: '',
    search: ''
  });
  const lastCallDate = ref('');
  const limit = ref(25);

  // for start call modal alert message
  const showAlert = ref(false);
  const morethan15Users = ref(false);
  const remainingUsersToAdd = ref(0);

  // COMPUTED
  const filteredCalls = computed(() => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let filteredCallIds = callIdList;

    if (filters.value && (filters.value.search || filters.value.category)) {
      filteredCallIds = callIdList.filter((id) => {
        const c = callsMap.get(id);
        let searchFound = false, categoryFound = false;
        let convId = c.conversation_id || c.ext_conv_id;
        let conversation = rtcStore.getConversationById(convId);
        if (filters.value.search && filters.value.search != '') {
          if (conversation && normalizeString(conversation.title.toLowerCase()).includes(normalizeString(filters.value.search.toLowerCase())))
            searchFound = true;
          else {
            const users = (c.users.length === 1 ? c.users :
              c.users.filter(el => el.login !== rtcStore.currentUserLogin)) || []
            users.forEach((user) => {
              if ((user.title && normalizeString(user.title.toLowerCase()).includes(filters.value.search.toLowerCase())) || user.username && normalizeString(user.username.toLowerCase()).includes(normalizeString(filters.value.search.toLowerCase())) || user.login && normalizeString(user.login.toLowerCase()).includes(normalizeString(filters.value.search.toLowerCase())))
                searchFound = true;
            })
          }
        }
        if (filters.value.category && filters.value.category != '' && filters.value.category == c.category.value) {
          categoryFound = true;
        }
        if (filters.value.category != '' && filters.value.search != '')
          return searchFound && categoryFound;
        else
          return searchFound || categoryFound
      });
    }
    return filteredCallIds.map(id => callsMap.get(id));
  });
  const isRTCStoreLoaded = computed(() => !rtcStore.isLoading);
  const currentUserLogin = computed(() => rtcStore.currentUserLogin);
  const currentUserId = computed(() => rtcStore.currentUserId)

  // ACTIONS
  const fetchCallHistory = function (count = 25) {
    rtconv.fetchCallHistory(count);
  }

  const fetchNextPage = function () {
    /* 
    fetchCallHistory is an synchronous request so to avoid making multiple fetchNextPage calls
    we need to wait for response, so waitForResponse = true here and it is set to false in processCallHistory
    */
    if (!waitForResponse.value) {
      waitForResponse.value = true;
      rtconv.fetchCallHistory(limit.value, null, lastCallDate.value);
    }
  }

  const startCall = function (data) {
    if (data.logins && data.logins.length > 0) {
      if (!data.logins.includes(currentUserLogin.value)) {
        data.logins.push(currentUserLogin.value);
      }
      if(data.logins.length>15){
        morethan15Users.value = true;
        setTimeout(() => {
          morethan15Users.value = false;
        }, 5000); 
      }  
      else 
        rtconv.startCall(data);
    }
  }  
 
  const deleteConversationCalls = function(deletedConversationId) {
    const callIdsToDelete = [];
    callsMap.forEach((call, callId) => {
      if (call.conversation_id === deletedConversationId) {
        callIdsToDelete.push(callId); 
        }
    });
    if (callIdsToDelete.length > 0) {
      rtcStore.removeFromHistory(callIdsToDelete);
    }
  };

  const deleteCall = function (deleteId) {
    if (deleteId instanceof Array) {   // For deleting merged calls
      deleteId.forEach(id => {
        callsMap.delete(id);

      const index = callIdList.indexOf(id);
      if (index > -1) {
        callIdList.splice(index, 1);
      }

      const ongoingIndex = ongoingCallIdList.indexOf(id);
      if (ongoingIndex > -1) {
        ongoingCallIdList.splice(ongoingIndex, 1);
      }
    });
    }
    else {
      callsMap.delete(deleteId);
      const index = callIdList.indexOf(deleteId);
    if (index > -1) {
      callIdList.splice(index, 1);
    }

    const ongoingIndex = ongoingCallIdList.indexOf(deleteId);
    if (ongoingIndex > -1) {
      ongoingCallIdList.splice(ongoingIndex, 1);
    }
    }
  }

  const emptyHistory = function () {
    callsMap.clear();
    callIdList.length = 0;
    ongoingCallIdList.length = 0;
  }

  const getLastCallDate = function () {
    return lastCallDate.value;
  }

  const updateUwpVars = function (data) {
    enableTelephony.value = data.hasPhoneCallActivated;
    enableProfile.value = data.hasCallsProfileActivated;
  }

  const updateFilters = function (newFilter) {
    filters.value = newFilter;
  }

  const searchContacts = function (pattern) {
    rtcStore.searchContacts(pattern);
  }

  const getUsersPhone = function (call) {
    if (call.users.length == 2) {
      for (let i = 0; i < call.users.length; i++) {
        if (call.users[i].login != rtcStore.currentUserLogin)
          call.mainPhone = call.users[i].mainPhone;
      }
    }
  }

  const getCallTime = function (call) {
    if (call.creation_date) {
      let creation_date = new Date(call.creation_date + 'Z'); // getting time in UTC, so convert this to local time
      let creation_date_hours = creation_date.getHours() % 12;
      creation_date_hours = creation_date_hours ? creation_date_hours : 12;
      call.creation_date_string = ((creation_date_hours < 10 ? '0' : '') + creation_date_hours) + ':'
        + ((creation_date.getMinutes() < 10 ? '0' : '') + creation_date.getMinutes()) + ' '
        + (creation_date.getHours() >= 12 ? 'PM' : 'AM');
    }
    return call.creation_date_string;
  }

  const updateOngoingCall = function (callEvent) {
    if (callEvent.evenement == 'inviteSent' ||
      callEvent.evenement == 'inviteToCall') {
      if (callEvent.room && callEvent.room.room_id) {
        if (!ongoingCallIdList.includes(callEvent.room.room_id)) {
          ongoingCallIdList.push(callEvent.room.room_id);
        }
      }
    }
    if (callEvent.evenement == 'callEnded') {
      if (callEvent.room_id) {
        const callIdx = ongoingCallIdList.indexOf(callEvent.room_id)
        if (callIdx > -1) {
          ongoingCallIdList.splice(callIdx, 1);
        }
      }
    }
  }

  // Grouping of missed calls functions
  function createConversationToCallMap(callResponse) {
    const conversationToCallMap = {};

    for (const callId in callResponse.mergedMissed) {
      const conversationId = callResponse.mergedMissed[callId];
      if (!conversationToCallMap[conversationId]) {
        conversationToCallMap[conversationId] = [];
      }
      conversationToCallMap[conversationId].push(callId);
    }
    return conversationToCallMap;
  }

  const fetchCallsInGroup = function (mergedCallIds, callsMap, greatestCallId) {
    return mergedCallIds.map((mergedCallId) => {
      const call = callsMap[parseInt(mergedCallId)];
      if (!call) {
        return null;
      }
      return {
        creation_date: call.creation_date,
        type: call.type,
        creation_date_string: getCallTime(call),
        callId: call.call_id
      };
    });
  };

  const groupAndFetchMissedCalls = function (callResponse) {
    const conversationToCallMap = createConversationToCallMap(callResponse);
    for (const conversationId in conversationToCallMap) {
      const callIds = conversationToCallMap[conversationId];

      // Map to group calls by date
      const callsByDate = new Map();
      callIds.forEach((callId) => {
        if (!ongoingCallIdList.includes(callId)) {
          const call = callResponse.calls[callId];
          const datePart = new Date(call.creation_date).toISOString().split('T')[0];
          if (!callsByDate.has(datePart)) {
            callsByDate.set(datePart, []);
          }
          callsByDate.get(datePart).push(callId);
        }
      });

      // Fetch details of calls with the same date and remove merged calls from main calls object
      callsByDate.forEach((callIdsForDate) => {
        const greatestCallId = Math.max(...callIdsForDate);
        const callDetails = fetchCallsInGroup(callIdsForDate, callResponse.calls, greatestCallId);
        callIdsForDate.forEach((callId) => {
          if (parseInt(callId) !== greatestCallId) {
            delete callResponse.calls[callId];
            const index = callIdList.indexOf(parseInt(callId));
            if (index > -1) {
              callIdList.splice(index, 1);
            }
          }
        });
        callDetails.sort((a, b) => {
          const creationDateA = new Date(a.creation_date);
          const creationDateB = new Date(b.creation_date);
          return creationDateB - creationDateA;
        });
        if (callResponse.calls[greatestCallId].merged) {
          // If merged field already exists, merge the new details
          const existingMergedDetails = callResponse.calls[greatestCallId].merged;
          const newDetails = fetchCallsInGroup([greatestCallId], callResponse.calls);
          const mergedDetailsSet = new Set(existingMergedDetails.map(JSON.stringify));

          for (const newDetail of newDetails) {
            const isNewDetailAlreadyExists = mergedDetailsSet.has(JSON.stringify(newDetail));
            if (!isNewDetailAlreadyExists) {
              existingMergedDetails.push(newDetail);
            }
          }
        } else {
          // If merged field doesn't exist, set it with new details
          callResponse.calls[greatestCallId].merged = callDetails;
        }
      });
    }
  };
  // End of missed call grouping functions

  // Process call history response (TODO: modulartize this function)
  const processCallHistoryData = function (callHistory) {
    isLoading.value = false;

    // if(!callHistory.data.calls)
    //   moreCallsToFetch.value = false; 

    if (callHistory && callHistory.data && callHistory.data.calls) {
      let calls;
      if (callHistory.data.calls instanceof Array) {
        calls = callHistory.data.calls;
        if (calls && calls.length < limit.value) {
          moreCallsToFetch.value = false;
        }
        else moreCallsToFetch.value = true;
      }
      else {
        let callResponse = callHistory.data;
        calls = Object.values(callResponse.calls);
        if (calls && calls.length < limit.value) {
          moreCallsToFetch.value = false;
        }
        else moreCallsToFetch.value = true;
        // group missed calls together    
        groupAndFetchMissedCalls(callResponse);
        //make sure the updates in callResponse.calls are reflected in calls
        calls = Object.values(callResponse.calls);
      }

      // if response doesn't contains any calls then no need to fetch more calls so moreCallsToFetch = false


      //emit loaded event to swym to stop the loader
      let hasMore = {};
      hasMore.moreCallsToFetch = moreCallsToFetch.value;
      bus.emit('loaded', hasMore);

      waitForResponse.value = false;
      if (calls.length) {
        /* 
        if response has less calls than requested(limit) that means no more calls are available for this user
        Now then we set moreCallsToFetch = false so that scroller stops loading and no more request is send to sever
        */

        calls.sort((a, b) => {
          return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
        });
        calls.forEach((call) => {
          getUsersPhone(call);
          let currentUser = call.users.find(user => user.login === this.currentUserLogin);
          let otherUsers = call.users.filter(el => el.login !== this.currentUserLogin);
          if (currentUser) {
            // check if conversation exists if not create using users array 
            if (call.conversation_id == null && call.ext_conv_id == null) {
              if (otherUsers.length == 1) {
                if (!rtcStore.getUserById(String(otherUsers[0].user_id))) rtcStore.addUser(otherUsers[0]);
                call.isUserCall = true;
              }
              else call.isGroupCall = true;
            }
            else if (call.ext_conv_id) {
              //swym v2 calls
              call.isSwymV2 = true;
              let contact = rtcStore.getConversationById(call.ext_conv_id);
              if (contact == null) {
                rtcStore.getV2ConversationsById(call.ext_conv_id);
                let conversation = {};
                conversation.id = call.ext_conv_id;
                conversation.members = call.users;
                conversation.isSwymV2 = true;
                rtcStore.addConversations([conversation]);
              }
              else {
                contact.subjectUri = call.subjectUri;
                contact.members = call.users;
                contact.isSwymV2 = true;
                rtcStore.addConversations([contact]);
              }
            }
            else if (call.conversation_id) {
              // swym v3 call
              let contact = rtcStore.getConversationById(call.conversation_id); // TODO: add subjectUri in getConversation(v3) api response (backend)
              if (contact) {
                contact.subjectUri = call.subjectUri;
                contact.title = call.convTopic;
                rtcStore.addConversations([contact]);
              }
              call.isSwymV3 = true;
            }

            // calculate call duration
            const isCallAccepted = otherUsers.find((user) => user.state == '1');
            let joinDate, endDate, difference;
            if (currentUser.joinDate) {
              joinDate = new Date(currentUser.joinDate)
            }
            if (currentUser.quitDate)
              endDate = new Date(currentUser.quitDate)

            if (isCallAccepted && joinDate && endDate) {
              difference = endDate - joinDate;

              let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
              difference -= hoursDifference * 1000 * 60 * 60

              let minutesDifference = Math.floor(difference / 1000 / 60);
              difference -= minutesDifference * 1000 * 60

              let secondsDifference = Math.floor(difference / 1000);
              // Ensure at least 1 second
              if (secondsDifference < 1) {
               secondsDifference = 1;
              }
              
              // Round off negative durations to zero
              if (hoursDifference < 0 || minutesDifference < 0 || secondsDifference < 0) {
                hoursDifference = Math.max(hoursDifference, 0);
                minutesDifference = Math.max(minutesDifference, 0);
                secondsDifference = Math.max(secondsDifference, 0);
              }

              let duration = '';
              if (hoursDifference) duration += hoursDifference + ' hour '
              if (minutesDifference) duration += minutesDifference + ' min '
              if (secondsDifference) duration += secondsDifference + ' sec '

              call.duration = duration;
            }
            else {
              call.duration = ''
            }
            if (call.creation_date) {
              call.creation_date_string = getCallTime(call);
            }

            // set call type
            if (call.isJoinable)
              call.category = CALL_TYPES.Ongoing;
            else if (currentUser.id == call.caller)
              call.category = CALL_TYPES.Outgoing;
            else if (currentUser.state == 1)
              call.category = CALL_TYPES.Incoming
            else if (currentUser.state == 2)
              call.category = CALL_TYPES.Declined
            else
              call.category = CALL_TYPES.Missed

            if (!callsMap.has(call.call_id)) {
              // to add ongoing call at the top of the list
              if (call.isJoinable)
                callIdList.unshift(call.call_id)
              else callIdList.push(call.call_id);
            }

            callsMap.set(call.call_id, call)
          }
        });
        lastCallDate.value = calls[calls.length - 1].creation_date.replace('Z', '').replace('T', ' ');
      }
    }
    return callHistory;
  }

  return {
    filters, selectedContact, isLoading, moreCallsToFetch, waitForResponse, isRTCStoreLoaded, filteredCalls, enableTelephony, enableProfile, currentUserLogin, currentUserId, showAlert, morethan15Users, remainingUsersToAdd,
    updateOngoingCall, processCallHistoryData, emptyHistory, deleteConversationCalls, deleteCall, getLastCallDate, fetchCallHistory, fetchNextPage, startCall, updateUwpVars, updateFilters, searchContacts
  }
})