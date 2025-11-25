<script setup>
import { computed, onMounted, ref } from 'vue';
import avatar from '../utils/avatar.vue'
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useTranslations } from './translations';
import {unescapeHTML } from './html'
import { useRTCStore } from '../../stores/RTCStore';
const { i18n,$i18n,promise } = useTranslations('callhistory');

const props = defineProps(['contacts']);

const callHistoryStore = useCallHistoryStore();
const rtcStore = useRTCStore();
const selectedContact = computed(() => callHistoryStore.selectedContact);
const conversationTopic = ref('');
const maxUsers = 14;
const isExistingConversation = ref(false);
const showTopicInput = computed(() => selectedContact.value.length > 1)
const preserveSearch = true;
let isScrolling = false;
const multiselectRef = ref(null);
const translationsLoaded = ref(false);

onMounted(async()=>{
await promise;
promise.then(()=>{
translationsLoaded.value = true;
})
callHistoryStore.showAlert = false;
})

const isNotTextEmptyRule = (s) => !!s.trim()

const topicInputref = ref(null)
const topicRules = computed(() => [
  isNotTextEmptyRule
])

const validateTopic = () => {
  if(callHistoryStore.selectedContact.length>1)
  topicInputref.value.validate();
  if (topicInputref.value && topicInputref.value.value == '') {
    return {
      topic: ''
    }
  }
  else {
    return { topic: conversationTopic.value }
  }

}

defineExpose({
  validateTopic,
  conversationTopic,
  isExistingConversation
})
const allUsersSize = computed(() => {
  return callHistoryStore.selectedContact.length;
})
const helperMessage = computed(() => {
  return allUsersSize.value >= maxUsers
    ? $i18n('startCallUserMaxLimit')
    :$i18n('startCallUserLimit', {x : maxUsers - allUsersSize.value })
})
const searchContact = async (pattern) => {
  callHistoryStore.searchContacts(pattern)
}

const isUserAlreadyAdded = function (user) {
  let isFound = false;
  callHistoryStore.selectedContact.forEach((element) => {
    let item = element.value;
    if (item.login === user.login) {
      isFound = true;
    }
  });
  return isFound;
}

const checkAndPushToSelectedContact = (contact) => {
  let dbConvId = '', dmId = '';
  let members = contact.members.filter(el => el.login !== callHistoryStore.currentUserLogin);
  let usersToAdd = members.length;

  for (let i = 0; i < members.length; i++) {
    let contactToAdd = members[i];
    if (contactToAdd.login !== callHistoryStore.currentUserLogin && allUsersSize.value < maxUsers) {
      dmId = contact.subjectUri ? contact.subjectUri : String(contact.id);
      dbConvId = String(contact.id);

      if (i == members.length - 1) {
        if (contactToAdd?.isUser && isUserAlreadyAdded(contactToAdd))
          callHistoryStore.selectedContact.push({ value: contactToAdd, label: contactToAdd.username, dmId: dmId, dbConvId: dbConvId }) // if user is already added, toggle will remove it. 
        multiselectRef.value.toggle({ value: contactToAdd, label: contactToAdd.username, dmId: dmId, dbConvId: dbConvId }, { fromOptionsClick: true });
      }
      else {
        if (contactToAdd?.isUser && !isUserAlreadyAdded(contactToAdd)) {
          callHistoryStore.selectedContact.push({ value: contactToAdd, label: contactToAdd.username, dmId: dmId, dbConvId: dbConvId });
        }
      }
      usersToAdd = usersToAdd - 1;
    }
    if ((allUsersSize.value == maxUsers) && usersToAdd) {
      callHistoryStore.remainingUsersToAdd = usersToAdd;
      callHistoryStore.showAlert = true;
            setTimeout(() => {
        callHistoryStore.showAlert = false;
      }, 3000);
    }
    
  }
}


const addToSelectedContact = (contact) => {
  if (contact.isConversation) {
    checkAndPushToSelectedContact(contact);
  }
  else if (contact.isUser && allUsersSize.value < maxUsers) {
    if (isUserAlreadyAdded(contact))
      callHistoryStore.selectedContact.push({ value: contact, label: contact.username, dmId: '', dbConvId: '' })
    multiselectRef.value.toggle({ value: contact, label: contact.username, dmId: '', dbConvId: '' }, { fromOptionsClick: true });
  }

  function isSameConversation() {
    if (callHistoryStore.selectedContact.length !== (contact.members.length-1)) {
      return false;
    }
    let members = contact.members.filter(el => el.login !== callHistoryStore.currentUserLogin);
    members = new Set(members.map(obj => obj.username));
    const selectedContacts = new Set(callHistoryStore.selectedContact.map(obj => obj.label));
    return Array.from(members).every(label => selectedContacts.has(label));
  }


  if (contact.isConversation && isSameConversation()) {
    conversationTopic.value = contact.title;
    isExistingConversation.value = true;
  }
  else {
    conversationTopic.value = '';
    isExistingConversation.value = false;
  }
} 

const updateSelectedContact = (newList) => {
  conversationTopic.value = '';
  isExistingConversation.value = false;
  callHistoryStore.selectedContact = newList;
}

const handleTouchStart = (event, contact) => {
  isScrolling = false;

  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { once: true }); 

  const handleTouchMove = () => {
    isScrolling = true;
  };
  const handleTouchEnd = () => {
    if (!isScrolling) {
      addToSelectedContact(contact);
    }
    isScrolling = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }; 

};

</script>

<template>
  <div v-if="translationsLoaded">
    <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:10px;">
      <div class="calls-users-multiselect">
        <vu-multiple-select :placeholder="$i18n('startCallPlaceholder')" :helper=helperMessage required
          :min-search-length="100" :model-value="selectedContact" :preserveSearchOnBlur=preserveSearch
          @search="searchContact" @update:model-value="updateSelectedContact" :maxSelectable="maxUsers"
          @keyup.enter.stop ref="multiselectRef">
        </vu-multiple-select>
      </div>
      <div v-if="showTopicInput" class="conversation-topic">
        <vu-input v-model="conversationTopic" required  :disabled="isExistingConversation"
          :placeholder="$i18n('conversationTopicPlaceholder')" :label="$i18n('conversationTopicLabel')"
          ref="topicInputref" lazyValidation="true"/>
      </div>
    </div>
    <!-- <br> -->
    <div>
      <vu-scroller class="contactlist-scroller">
        <div v-if="props.contacts.value.favorites && props.contacts.value.favorites.length > 0"
          class="favorites-section">
          <h5>{{ $i18n('favorites') }}</h5>
          <div v-for="contact in props.contacts.value.favorites">
            <div v-if="contact && contact.id != ''" @click="addToSelectedContact(contact)"
              @touchstart="handleTouchStart($event, contact)">
              <div class="contact-item">
                <div class="avatar-section">
                  <avatar :contact="contact"></avatar>
                </div>
                <div class="title-section">
                  <span>{{ unescapeHTML(contact.title) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div v-if="props.contacts.value.suggested && props.contacts.value.suggested.length > 0"
        class="suggested-section">
          <h5>{{ $i18n('suggested') }}</h5>
          <div v-for="contact in props.contacts.value.suggested">
            <div v-if="contact && contact.id != ''" @click="addToSelectedContact(contact)"
              @touchstart="handleTouchStart($event, contact)">
              <div class="contact-item">
                <div class="avatar-section">
                  <avatar :contact="contact"></avatar>
                </div>
                <div class="title-section">
                  <span>{{ unescapeHTML(contact.title) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vu-scroller>
    </div>
  </div>

</template>

<style scoped>
.contactlist-scroller {
  max-height: 300px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 2%;
  padding: 1%
}

.contact-item:hover {
  background-color: #f1f1f1;
  border-radius: 0.375rem;
  cursor: pointer;
}

@media(max-width: 1080px) {
  .contact-item:not(:active):hover {}
}

.avatar-section {
  min-width: 40px;
}
.title-section {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>