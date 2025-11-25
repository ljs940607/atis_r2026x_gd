<script setup>
import { ref, onMounted, computed } from 'vue'
import avatar from '../utils/avatar.vue';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useRTCStore } from '../../stores/RTCStore';
import { useTranslations } from '../utils/translations';
import { unescapeHTML } from '../utils/html';
const { i18n,$i18n,promise } = useTranslations('callhistory');

const props = defineProps(['contact'])

const info = ref('');
const translationsLoaded = ref(false);
const callHistoryStore = useCallHistoryStore();
const rtcStore = useRTCStore();

onMounted((async()=>{
await promise;
promise.then(translationsLoaded.value = true)
}))

const contact = computed(() => props.contact);


const updateInfo = (isHover) => {
  if (!isHover) {
    if (callHistoryStore.enableTelephony && contact.value.isMainPhone) {
      info.value = contact.value.mainPhone;
    }
    else
      info.value = '';
  }
  else{
    if(contact.value.favoriteType == 'video')
    info.value = $i18n('startVideoCall');
    else
    info.value = $i18n('startVoiceCall');
  }
}

const getCallIcon = (type) => {
  if (type == 'video')
    return "videocamera"
  else return "phone"
}


</script>

<template>
  <div v-if="translationsLoaded" class="contact-tile" @mouseover="updateInfo(true)" @mouseleave="updateInfo(false)">
    <div class="avatar-section">
      <avatar :contact="contact"></avatar>
    </div>
    <div class="title-section">
      <span>{{ unescapeHTML(props.contact.title) }}</span>
    </div>
    <div class="icon-section">
      <vu-icon :icon="getCallIcon(contact.favoriteType)"></vu-icon>
    </div>
    <div class="info-section">
      <!-- <Transition name="slide"> -->
      <div :key="info"> {{ info }}</div>
      <!-- </Transition> -->
    </div>
  </div>
</template>

<style scoped>
.contact-tile {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 0.5fr 2fr 1fr;
}

.avatar-section {
  grid-row: 1/3;
  grid-column: 1/2;
  justify-self: center;
}

.title-section {
  grid-row: 1/2;
  grid-column: 2/5;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.icon-section {
  grid-row: 2/2;
  grid-column: 2/3;
}

.info-section {
  grid-row: 2/2;
  grid-column: 3/5;
  justify-self: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

@media(max-width: 300px) {
  .info-section {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-break: break-word;
    -webkit-line-clamp: 1;
  }
}

@media(max-width: 1048px) {
  .info-section {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-break: break-word;
    -webkit-line-clamp: 1;
  }
}
</style>