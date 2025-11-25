<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CallList from './call-list.vue'
import CallSettings from '../call-delegation/call-settings.vue';
import ClearConfirmModal from '../utils/clear-confirm-modal.vue'
import { initCallHistoryApi } from '../../api/callhistory_api';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useRTCStore } from '../../stores/RTCStore';
import { useEventBus } from '@vueuse/core';
import { useTranslations } from '../utils/translations';
const { i18n, $i18n, promise } = useTranslations('callhistory');
import { version } from '../../../package.json';

let isModalOpen = ref(false);
const emit = defineEmits(['getTopBarItems', 'startConversation', 'loaded', 'viewProfile']);
const props = defineProps(['searchedValue', 'activeFilter', 'activatedComponent', 'hasCallsProfileActivated', 'loadRequestId', 'hasPhoneCallActivated', 'activationId']);

const bus = useEventBus('swym-events');
const rtcStore = useRTCStore();
const callHistoryStore = useCallHistoryStore();
const { isRTCStoreLoaded } = storeToRefs(callHistoryStore);

// computed props
const userSearched = computed(() => props.searchedValue);
const filterApplied = computed(() => props.activeFilter);
const activatedComponent = computed(() => props.activatedComponent);
const activationId = computed(() => props.activationId);
const morethan15Users = computed(() => callHistoryStore.morethan15Users);

// dynamic CallHistory/CallPreference component toggle
const currentComponent = computed(() => {
  if (props.activatedComponent == "Preferences")
    return CallSettings
  else
    return CallList
});
const currentProperties = computed(() => {
  if (props.activatedComponent == "Preferences")
    return ''
  else
    return filterApplied.value
});
watch(activationId, () => {
  if (activatedComponent.value == 'clearHistory')
    isModalOpen.value = true;
})

// fetch call history and favorites only after rtc store is loaded
watch(isRTCStoreLoaded, () => {
  if (isRTCStoreLoaded.value) {
    callHistoryStore.fetchCallHistory();
    let data = {};
    data.hasCallsProfileActivated = props.hasCallsProfileActivated;
    data.hasPhoneCallActivated = props.hasPhoneCallActivated;
    callHistoryStore.updateUwpVars(data);
  }
}, { immediate: true });

// to handle pagination on scroll of call history page
// From Swym: loadRequestId (incremental value on scoll)
watch(() => props.loadRequestId, () => {
  callHistoryStore.fetchNextPage();
});

// to update filters and search sent from swym-ui
watch(userSearched, () => {
  callHistoryStore.updateFilters({ category: filterApplied, search: userSearched });
}, { immediate: true });
watch(filterApplied, () => {
  callHistoryStore.updateFilters({ category: filterApplied, search: userSearched });
}, { immediate: true });

const closeModal = () => {
  isModalOpen.value = false;
}

onMounted(async () => {
  initCallHistoryApi();
  await promise;
  promise.then(() => {
    let TopBarItems = {
      "filters": [
        {
          "fonticon": "phone-call-missed",
          "text": $i18n('missed'),
          "color": "text-grey-6",
          "bgcolor": "bg-red-1",
          "value": "Missed"
        },
        {
          "fonticon": "phone-call-sent",
          "text": $i18n('outgoing'),
          "color": "text-grey-6",
          "bgcolor": "bg-blue-3",
          "value": "Outgoing"
        },
        {
          "fonticon": "phone-call-received",
          "text": $i18n('incoming'),
          "color": "text-grey-6",
          "bgcolor": "bg-blue-3",
          "value": "Incoming"
        }
      ],
      "menu": [
        {
          "fonticon": "cog",
          "text": $i18n('preferences'),
          "value": "Preferences"
        },
        {
          "fonticon": "trash",
          "text": $i18n('clearHistory'),
          "value": "clearHistory"
        }
      ],
      "states": {
        "Preferences": {
          "fonticon": "cog",
          "text": $i18n('preferences'),
          "value": "Preferences",
          "nextState": "History"
        },
        "History": {
          "fonticon": "navigation-history",
          "text": $i18n('history'),
          "value": "History",
          "nextState": "Preferences"
        }
      },
      "initialState": "Preferences",
      "initialActiveComponent": "History"
    }
    emit('getTopBarItems', TopBarItems);
  })
  console.log('Call history version:', version);

  bus.on((event, data) => {
    if (event == 'viewProfile')
      emit('viewProfile', data);

    if (event == 'startConversation') {
          emit('startConversation', data);  
    }

    // "loaded" event with moreCallsToFetch(to stop loader on swym)
    if (event == 'loaded')
      emit('loaded', data.moreCallsToFetch)
  });
})

</script>

<template>
  <div>
    <vu-message color="warning" :show.sync="morethan15Users" closable="true">{{ $i18n('morethan15Members') }}</vu-message>
    <component :is="currentComponent" :filterValue="currentProperties" />
    <div v-if="isModalOpen">
      <clear-confirm-modal @closeModal="closeModal"></clear-confirm-modal>
    </div>
  </div>
</template>

<style scoped>
@media(max-width: 640px) {
  .right-panel {
    padding: 0%;
  }
}

@media(max-width: 465px) {
  .right-panel {
    padding: 0%;
  }
}
</style>
