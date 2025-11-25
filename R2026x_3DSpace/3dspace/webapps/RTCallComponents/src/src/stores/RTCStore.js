import { defineStore } from 'pinia'
import { reactive } from 'vue';
import * as rtconv from '../api/callhistory_api'
import { useCallHistoryStore } from './CallHistoryStore'
import debounce from '../components/utils/debounce'
import { CommonRequest } from '@3ds/common-request-proxification'

export const useRTCStore = defineStore('RTCStore', {
  // STATE
  state: () => ({
    tenantId: '',
    swymUrl: '',
    currentUserLogin: '',
    currentUserName: '',
    currentUserId: '',
    isConnected: false, // socket connetion status
    users: reactive(new Map()), // login -> user
    conversations: reactive(new Map()), // convId -> conv
    phone: new Map(),
    favs: [],
    isLoading: true,
    isFavLoading: true,
    initialTxnId: null,
    fetchedOnce: false,
    searchFilter: '',
    swymToken: '',
    rtConvEnable: false
  }),
  // COMPUTED
  getters: {
    searchedContacts: (state) => {
      let searchFilterLower = state.searchFilter.toLowerCase();
      const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      searchFilterLower = normalizeString(searchFilterLower);

      let favs = [...state.favs.values()];
      // Remove duplicate from favorites if same contact and different type
      const uniqueFavorites = new Map();
      for (const fav of favs) {
        fav.key = fav.convId || fav.extConvId || fav.userId;
        const key = `${fav.key}-${fav.sortIdx}`;
        if (!uniqueFavorites.has(key)) {
          uniqueFavorites.set(key, fav);
        }
      }
      const uniqueFavoriteArray = [...uniqueFavorites.values()];

      const sortContacts = function (contacts) {
        let sortedContacts = contacts.sort((a, b) => {

          const hasUserIdA = a.hasOwnProperty('user_id');
          const hasUserIdB = b.hasOwnProperty('user_id');

          if (hasUserIdA && !hasUserIdB) {
            return -1;
          } else if (!hasUserIdA && hasUserIdB) {
            return 1;
          } else {
            const membersLengthA = a.members ? a.members.length : 0;
            const membersLengthB = b.members ? b.members.length : 0;
            if (membersLengthA === 2 && membersLengthB !== 2) {
              return -1;
            } else if (membersLengthA !== 2 && membersLengthB === 2) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        return sortedContacts;
      }

      if (state.searchFilter != '' && state.searchFilter.length>2) {
        let conversation = [...state.conversations.values()];
        let users = [...state.users.values()];
        let privateConversation = [];

        conversation = conversation.filter((conv) => {
          let members = conv.members.filter((el) => el.login !== state.currentUserLogin);
          if (members.some(el => el.login === 'svc_3dswym_copilot')) {
            return false;
          }
          if (members.length === 1 && members[0].login) {
            privateConversation.push(members[0].login);
          }
        
          const hasMatchingMember = members.some(el => 
            normalizeString(el.login.toLowerCase()).includes(searchFilterLower) ||
            normalizeString(el.username.toLowerCase()).includes(searchFilterLower)
          );
          const titleMatches = conv.title && normalizeString(conv.title.toLowerCase()).includes(searchFilterLower);
          const phoneMatches = conv.displayPhone && conv.displayPhone.toLowerCase().includes(searchFilterLower);

          return hasMatchingMember || titleMatches || phoneMatches;
        });

        users = users.filter((user) => {
          if (privateConversation.includes(user.login) || user.login === state.currentUserLogin || user.login === 'svc_3dswym_copilot') {
            return false;
          }
          return (
            (user.username && normalizeString(user.username.toLowerCase()).includes(searchFilterLower)) ||
            (user.login && normalizeString(user.login.toLowerCase()).includes(searchFilterLower)) ||
            (user.mainPhone && normalizeString(user.mainPhone.toLowerCase()).includes(searchFilterLower))
          );
        });
        let result = conversation.concat(users);
        result = result.filter(contact => {
        if (contact.members && contact.members.length === 1) {
            return contact.members[0].login !== state.currentUserLogin;
          }
          return true;
        });

        const favoriteIds = new Set(uniqueFavoriteArray.map(fav => fav.convId ));
        const favoriteExtConvIds = new Set(uniqueFavoriteArray.map(fav => fav.extConvId));
        const favoriteUserIds = new Set(uniqueFavoriteArray.map(fav => fav.userId));

        let favorites = result.filter((contact) => {
          if (contact.user_id || contact.isUser) {
            return favoriteUserIds.has(contact.user_id);
          } else {
            return (
              (contact.id && favoriteIds.has(contact.id)) || 
              (contact.extConvId && favoriteExtConvIds.has(contact.extConvId))
            );
          }
        });
        let suggested = result.filter((contact) => {
          if (contact.user_id || contact.isUser) {
            return !favoriteUserIds.has(contact.user_id);
          } else {
            return !(
              (contact.id && favoriteIds.has(contact.id)) || 
              (contact.extConvId && favoriteExtConvIds.has(contact.extConvId))
            );
          }
        });
        favorites = sortContacts(favorites);
        suggested = sortContacts(suggested)
        return { "favorites": favorites, "suggested": suggested };
      }
      else {
        let favorites = uniqueFavoriteArray.map((fav) => {
        if (fav.convId)
          return state.conversations.get(String(fav.convId));
        else if (fav.extConvId)
          return state.conversations.get(String(fav.extConvId));
        else if (fav.userId)
          return state.users.get(fav.userId);
        });
      favorites = favorites.filter(contact => {
        if (contact?.members?.length === 1) {
          return contact.members[0].login !== state.currentUserLogin;
        }
        return true;
      });
      return { "favorites": favorites };
      }
    },
    favorites: (state) => {
      return state.favs;
    }
  },
  // ACTIONS
  actions: {
    connected: function (data) {
      if(!this.isConnected){
        this.swymToken = sessionStorage.getItem('3DSwym_csrf');
        this.tenantId = window.widget? window.widget.data.x3dPlatformId:  data.data.tenant;
        this.swymUrl = (data.appName === "devenv") ? data.options.ressources.swym[0].url : data.options['3dswym'];
        this.currentUserLogin = data.userId;
        this.currentUserName = data.username;
        this.currentUserId = data.user_id;
        this.isConnected = true;
        if (!this.fetchedOnce) {
          rtconv.getRTCStatus();
          rtconv.fetchConversations(this.tenantId); // TODO: what if v2 conversation are not fetched yet and vice-versa because both will set rtc store loading to false
          this.getV2Conversations();
          this.fetchedOnce = true;
        }
      }
    },
    setInitialTxnId(txnId) {
      this.initialTxnId = txnId;
    },      
    getV2Conversations: function () {

      let isSwymV2 = true;
      const csrfToken = this.swymToken || sessionStorage.getItem('3DSwym_csrf');
      let getV2ConvUrl = (this.swymUrl || window.SWYM_URL)+ '/api/directmessages/lite';
      // For mobile app : need to proxify url
      getV2ConvUrl = CommonRequest.proxifyUrl(getV2ConvUrl, {
        proxy: 'passport', method: 'GET', headers: {
          'X-DS-SWYM-CSRFTOKEN': csrfToken
        }
      });
      fetch(getV2ConvUrl, {
        method: 'GET',
        credentials: 'include',
        redirect: 'error',
        headers: {
          'X-DS-SWYM-CSRFTOKEN': csrfToken,
          'x-requested-with': 'XMLHttpRequest',
          'content-type': 'application/json;charset=UTF-8',
        },
        timeout: 25000,
      }).then((response) => {
        return response.json();
      })
        .then((data) => {
          this.addConversations(data.result, isSwymV2);
        })
    },
    getV2ConversationsById: function (conversation_id) {
      if (conversation_id && !this.getConversationById(conversation_id) &&
        conversation_id != '' && !Number.isInteger(conversation_id)) {
        let isSwymV2 = true;
        let getV2ConvUrl = this.swymUrl + '/api/directmessages/' + String(conversation_id);
        // For mobile app : need to proxify url
        getV2ConvUrl = CommonRequest.proxifyUrl(getV2ConvUrl, {
          proxy: 'passport', method: 'GET', headers: {
            'X-DS-SWYM-CSRFTOKEN': this.swymToken
          }
        });
        fetch(getV2ConvUrl, {
          method: 'GET',
          credentials: 'include',
          redirect: 'error',
          headers: {
            'X-DS-SWYM-CSRFTOKEN': this.swymToken,
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/json;charset=UTF-8',
          },
          timeout: 25000,
        }).then((response) => {
          return response.json();
        }).then((data) => {
          this.addConversations([data.result], isSwymV2);
        })
      }
    },
    getUserById: function (id) { return this.users.get(String(id)) },
    addUser: function (user) {
      if (user.user_id) {
        if (!user.id) user.id = parseInt(user.user_id);
        user.isUser = true;
        if (!user.username) user.username = (user.first_name || user.firstName) + " " + (user.last_name || user.lastName);
        user.title = user.username;
        this.users.set(user.user_id, user);
      }
    },
    getConversationById: function (id) { return this.conversations.get(String(id)) },
    addConversations: async function (convs, isSwymV2) {

      const updateConversations = async (conv) => {
        return new Promise((resolve) => {
          conv.isConversation = true;

          if (conv.id) {
            if (isSwymV2) {
              if (!conv.members) conv.members = conv.users;
              conv.isSwymV2 = true;
              conv.members.filter((el) => {
                el.username = el.first_name + " " + el.last_name;
                el.isUser = true;
                el.title = el.username;
                if (!el.presence) el.presence = { "statusMsg": "Online", "show": "Online" };
              });
              if (conv.uri) conv.subjectUri = conv.uri;
            }

            const users = (conv.members.length === 1 ? conv.members :
              conv.members.filter(el => el.login !== this.currentUserLogin)) || [];

            conv.members.forEach((user) => {
              this.addUser(user);
            });
            let convTitle = '';
            if (conv.title) {
              convTitle = conv.title;
              conv.hasCustomTitle = false;
            }
            else if (conv.topic) {
              convTitle = conv.topic;
              conv.hasCustomTitle = false;
            }
            else {
              convTitle = users.map(el => `${el.username}`).join(', ');
              conv.hasCustomTitle = true;
            }
            conv.title = convTitle;

            this.conversations.set(String(conv.id), conv);
          }

          resolve();
        });
      };
      if (convs && convs.length) {
        for (let i = 0; i < convs.length; i++) {
          await updateConversations(convs[i]);
        }
      }
      this.isLoading = false;
    },

    updateConversation: function (data) {
      if (data.convId) {
        let conv = this.getConversationById(data.convId);
        if (data.members)
          conv.members = [...data.members];
        if ('title' in data){
          conv.title = data.title;
          conv.hasCustomTitle = data.title == null;
        }
        this.conversations.set(String(data.convId), conv);
      }
    },

    setPhoneDetails: function (convs) {
      for (let i = 0; i < convs.length; i++) {
        const users = convs[i].members.filter(el => el.login !== this.currentUserLogin);
        if (users.length == 1 && users[0].mainPhone && users[0].mainPhone != "null") {
          convs[i].displayPhone = users[0].mainPhone;
        }
      }
    },

    setFavorites: function (favs) {
      this.favs = favs;
      this.isFavLoading = false;
    },
    
    markConvAsNonFavorite: function(convId){
      if (this.conversations.has(String(convId))) {
        let existingConv = this.conversations.get(String(convId))
        this.conversations.set(String(convId), existingConv);
      }
    },

    removeFavorite: function (deletedConvId) {
      this.favs.forEach(fav => {
        if (fav.convId === deletedConvId) {
          let data = {
            convId: fav.convId,
            type: fav.type,  
            sortIdx: -1,
          };
          this.setCallFavorite(data);
        }
      });
    },

    removeConversation: function (convId) {
      const callHistoryStore = useCallHistoryStore();
      this.removeFavorite(convId);
      callHistoryStore.deleteConversationCalls (convId);
      if (this.conversations.has(String(convId))) {
        this.conversations.delete(String(convId));
      } 
    },
    
    removeConversationUser: function (data) {
      const callHistoryStore = useCallHistoryStore();
      if (this.conversations.has(String(data.convId))) {
        let existingConv = this.conversations.get(String(data.convId))
        
        if(data.convId && !data.members){
          //remove deleted conversation items from favorites
          this.removeFavorite(data.convId)

          //remove deleted conversation calls from history
          callHistoryStore.deleteConversationCalls (data.convId);

          //update the conversation members
          existingConv.members = existingConv.members.filter(user => user.login !== this.currentUserLogin);

          this.conversations.set(String(data.convId), existingConv);
        }
        else if(data.convId && data.members){
        existingConv.members = data.members
        this.conversations.set(String(data.convId), existingConv);
        }
      }
    },

    // TODO: Move this functions to CallHistory Store
    fetchCallFavorites: function () {
      rtconv.fetchCallFavorites();
    },
    setCallFavorite: function (data) {
      rtconv.setCallFavorite(data);
    },
    removeFromHistory: function (callId) {
      rtconv.removeFromHistory(callId);
    },
    clearHistory: function (lastCallDate) {
      rtconv.clearHistory(lastCallDate);
    },
    searchContacts: debounce(function(pattern) {
      this.searchFilter = pattern;
      if(pattern.length>2)
      rtconv.searchContact(pattern)
    }, 500)
  },
});