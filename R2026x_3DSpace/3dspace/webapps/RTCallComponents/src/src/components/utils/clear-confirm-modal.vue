<script setup>
import { ref, onMounted } from 'vue'
import { useRTCStore } from '../../stores/RTCStore';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useTranslations } from './translations';

const rtcStore = useRTCStore();
const callHistoryStore = useCallHistoryStore();
const  { i18n,$i18n,promise } = useTranslations('callhistory');

const emit = defineEmits(['closeModal']);
const translationsLoaded = ref(false);

const closeModal = function (){
  emit('closeModal');
}
const clearHistory = function(){
    rtcStore.clearHistory(callHistoryStore.getLastCallDate());
    closeModal();
}

onMounted(async()=>{
await promise;
promise.then(()=>{
translationsLoaded.value = true;
})
})
</script>

<template>
  <Teleport to="body">
    <div v-if="translationsLoaded">
    <vu-modal :title="$i18n('confirmation')" show  @close="closeModal" noMobile="false">
      <template #modal-body> 
        <div class="clear-history-confirmation">
          {{ $i18n('clearHistoryConfirmation') }}
        </div> 
        </template>

        <template #modal-footer>
          <vu-btn
            color="primary" @click="clearHistory">
            {{ $i18n('clearHistory') }}
          </vu-btn>
          <vu-btn
            @click="closeModal">
            {{ $i18n('cancel') }}
          </vu-btn>
      </template>
    </vu-modal>
  </div>
 </Teleport>
</template>

<style>
.clear-history-confirmation{
  color: #3d3d3d;
}
</style>