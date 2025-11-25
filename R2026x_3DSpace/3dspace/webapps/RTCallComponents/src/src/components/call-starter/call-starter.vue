<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ContactList from './contact-list.vue'
import { useRTCStore } from '../../stores/RTCStore';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import * as rtconv from '../../api/callhistory_api'; 
import { useTranslations } from '../utils/translations';
const { i18n, $i18n, promise } = useTranslations('callhistory');

const props = defineProps(['searchedValue'])

const rtcStore = useRTCStore();
const callHistoryStore = useCallHistoryStore();

const contactListRef = ref();
const translationsLoaded = ref(false);

const contact = computed(() => props.searchedValue);
const emit = defineEmits(['startConversation']);
const { isRTCStoreLoaded } = storeToRefs(callHistoryStore);

onMounted((async () => {
  rtconv.initCallHistoryApi();
  await promise;
  promise.then(translationsLoaded.value = true);
}))


watch(isRTCStoreLoaded, () => {
  if (isRTCStoreLoaded.value) {
    rtcStore.fetchCallFavorites();
  }
}, { immediate: true });

function sendMsg(user) {
  emit('startConversation', user);
}

const contactSearch = computed(() => {
  let favs = rtcStore.favorites;
  let favorites = [];
  
  for (const fav of favs) {
    let conv = null;
    if (fav.convId) {
      conv = rtcStore.getConversationById(String(fav.convId));
    } else if (fav.userId) {
      conv = rtcStore.getUserById(fav.userId);
    } else if (fav.extConvId) {
      conv = rtcStore.getConversationById(String(fav.extConvId)); 
    }
    if (conv) {
      const convCopy = { ...conv, favoriteType: fav.type };
      favorites.push(convCopy);
    }
    }
    if (contact.value) {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let filteredFavs = favorites.filter((favorite) => {
      // Handle favorites that have members
      if (favorite.members) {
        let members = favorite.members.filter((user) => { return user.login !== rtcStore.currentUserLogin });
        let membersLogin = members.map(member => normalizeString(member.login.toLowerCase()));
        let memberUserNames = members.map(member => normalizeString(member.username.toLowerCase()));

        // Filter based on login or username
        let filteredLogins = membersLogin.filter(login => login.includes(normalizeString(contact.value.toLowerCase())));
        let filteredUsernames = memberUserNames.filter(username => username.includes(normalizeString(contact.value.toLowerCase())));

        // If we have any matches, return the favorite
        if (filteredLogins.length || filteredUsernames.length)
          return true;
      }

      // Filter based on title
      if (normalizeString(favorite.title.toLowerCase()).includes(normalizeString(contact.value.toLowerCase()))){
        return true;
      }
      return false;
    });
    return filteredFavs;
  }
  else return favorites;
});


</script>

<template>
  <div v-if="translationsLoaded">
    <h5 class="favorite-text">{{ $i18n('favorites') }}</h5>
    <contact-list ref="contactListRef" :contact-list="contactSearch" @start-conversation="sendMsg" />
  </div>
</template>

<style scoped>
.favorite-text {
  padding-left: 4px;
}
</style>
