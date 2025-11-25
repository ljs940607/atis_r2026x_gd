<script setup>
import { ref, computed, onMounted } from 'vue'
import ContactTile from './contact-tile.vue'
import CallDropdown from '../utils/call-dropdown.vue'
import FavoritesPlaceholder from '../utils/favorites-placeholder.vue'
import startCallModal from '../utils/start-call-modal.vue';
import { useRTCStore } from '../../stores/RTCStore';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useTranslations } from '../utils/translations';
const { i18n,$i18n,promise } = useTranslations('callhistory');

const rtcStore = useRTCStore();
const callHistoryStore = useCallHistoryStore();

const props = defineProps(['contactList']);
const isActive = ref('');
let isModalOpen = ref(false);
const translationsLoaded = ref(false);

onMounted((async()=>{
await promise;
promise.then(translationsLoaded.value = true)
}))

const openModal = () => {
  isModalOpen.value = true;
}
const closeModal = () => {
  callHistoryStore.selectedContact = [];
  rtcStore.searchFilter = '';
  isModalOpen.value = false;
}

const fetchCallDetails = function (contact) {
  var topic;
  var logins = [];
  var data = {};

  if(contact.members.length == 2) {
    topic = !contact.hasCustomTitle ? contact.title: '';
  }
  else {
    topic = contact.title;
  }
  
  for (let i = 0; i < contact.members.length; i++) {
    logins.push(contact.members[i].login)
  }

  data.dmId = contact.subjectUri || contact.id;
  data.dbConvId = contact.id;
  data.logins = logins;
  data.topic = topic;
  return data;
}

function contactFilter(contact) {
  var data = fetchCallDetails(contact);
  data.type = contact.favoriteType || "audio";
  callHistoryStore.startCall(data);
}

const computeClass = computed(() => {
  return isActive.value
})

</script>

<template>
  <div>
    <favorites-placeholder v-if="rtcStore.isFavLoading" :n="5" />
  </div>
  <div v-if="!rtcStore.isFavLoading && translationsLoaded">
    <div v-if="isModalOpen">
        <start-call-modal @closeModal="closeModal"></start-call-modal>
      </div>
    <div v-if="!contactList.length" class="emptyTxt">
      <a class="searchTxt" @click="openModal">{{ $i18n('searchForPeople') }}</a>
      <span class="fav-emptyTxt">{{ $i18n('callInOneClick') }}</span>
    </div>
    <div v-else v-for="contact in contactList">
      <div v-if="contact && contact.id != ''" class="contact" :class="{ selected: computeClass == contact.title }">
        <div class="contact-item" @click="contactFilter(contact)">
          <contact-tile :contact="contact" />
        </div>
        <div class="contact-action">
          <call-dropdown v-if="callHistoryStore.isRTCStoreLoaded" :isLeftPanel="true" :contact="contact"></call-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-template-rows: 1fr;
  gap: 0.675rem;
  align-items: center;
  padding: 0.375rem 0 0.375rem 0;
  height: 50px;
  width: 100%;
  font-family: Arial;
  font-size: 14px;
  color: #191919;
}

.contact:hover:not(.selected) {
  background-color: #f1f1f1;
  border-radius: 0.375rem;
  cursor: pointer;
}

.selected {
  background-color: #368ec4;
  border-radius: 0.375rem;
  color: white;

  .contact-action {
    color: white;
  }
}

.contact-item {
  grid-column: 1/2;
  grid-row: 1/2;
}

.contact-action {
  grid-column: 2/3;
  grid-row: 1/2;
  justify-self: center;
}

.emptyTxt {
  display: grid;
  margin: auto;
  width: 50%;
  top: 100px;
  position: relative;

}

 .searchTxt {
  color: #368EC4;
  text-align: center;
  font: normal normal normal 14px/16px Arial;
  cursor: pointer;
} 

.fav-emptyTxt {
  text-align: center;
  font: normal normal normal 14px/16px Arial;
  color: #77797C;
  padding-top: 8px;
}
</style>