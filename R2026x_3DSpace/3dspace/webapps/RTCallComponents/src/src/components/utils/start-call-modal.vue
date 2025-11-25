<script setup>
import { onMounted, ref, computed } from 'vue';
import { message } from 'vuekit';
import startCallContactlist from './start-call-contactlist.vue';
import CallDialer from '../call-starter/call-dialer.vue';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useRTCStore } from '../../stores/RTCStore';
import { useTranslations } from './translations';
const { i18n, $i18n, promise } = useTranslations('callhistory');

const emit = defineEmits(['closeModal']);
const callHistoryStore = useCallHistoryStore();
const rtcStore = useRTCStore();
const isDialerComponent = ref(false)
const startCallListRef = ref(null);
const translationsLoaded = ref(false);

onMounted(async () => {
await promise;
promise.then(() => {
translationsLoaded.value = true;
})
})

const searchedContacts = computed(() => rtcStore.searchedContacts);
const currentComponent = computed(() => {
  if (isDialerComponent.value) return { id: "Dialer", component: CallDialer, props: { login: rtcStore.currentUserLogin } };
  else return { id: "ContactList", component: startCallContactlist, props: { contacts: searchedContacts }, ref: "startCallListRef" };
})
const showAlert = computed(() => callHistoryStore.showAlert);

const showDialerComponent = () => {
  if (isDialerComponent.value)
    isDialerComponent.value = false;
  else isDialerComponent.value = true;
}
const closeModal = function () {
  callHistoryStore.selectedContact = [];
  rtcStore.searchFilter = '';
  emit('closeModal');
}

const startCallWithSelectedContacts = function (isVideo) {
  if (callHistoryStore.selectedContact.length) {
    let conversationTopic = '';
    const topicInput = startCallListRef.value.validateTopic();
    if (callHistoryStore.selectedContact.length > 1) {
      if (!topicInput.topic.trim()) {
        startCallListRef.value.conversationTopic = topicInput.topic.trim();
        message.create({
          text: $i18n('noConversationTopicError'),
          color: 'error',
          timeout: 2 ** 31 - 1,
          closable: true
        })
        return
      }
      else
        conversationTopic = topicInput.topic;
    }
    else
      conversationTopic = '';


    let logins = [];
    let dmId = "", dbConvId = "";
    var data = {};
    let isConversation = true;
    for (let i = 0; i < callHistoryStore.selectedContact.length; i++) {
      logins.push(callHistoryStore.selectedContact[i].value.login)
      if (callHistoryStore.selectedContact[i].dmId == "" ||  // if empty dmId => user that is not in conversation is added
        (dmId != "" && callHistoryStore.selectedContact[i].dmId != dmId)) // if change in dmId => user of different conversations added
        isConversation = false;
      if (callHistoryStore.selectedContact[i].dmId != "") {
        dmId = callHistoryStore.selectedContact[i].dmId;
        dbConvId = callHistoryStore.selectedContact[i].dbConvId;
      }
    }
    data.dmId = isConversation && startCallListRef.value.isExistingConversation ? dmId : '';  //if user is removed then also it is a different conversation, therefore check for isExistingConversation
    data.dbConvId = isConversation && startCallListRef.value.isExistingConversation ? dbConvId : '';
    data.logins = logins;
    data.type = isVideo ? "video" : "audio";
    data.topic = conversationTopic;
    callHistoryStore.startCall(data);
  }
  callHistoryStore.selectedContact = [];
  emit('closeModal');
}

const callDropdownItems = [
  {
    text: 'Start a Video Call',
    selectable: true,
    fonticon: 'videocamera',
    handler: () => {
      startCallWithSelectedContacts(true);
    }
  }
]

</script>

<template>
  <Teleport to="body">
    <div class="start-call-modal" v-if="translationsLoaded">
      <vu-modal :title="$i18n('newCall')" show @close="closeModal" noMobile="false">
        <template #modal-body>
          <div>
            <vu-message color="warning" :show.sync="showAlert">{{ $i18n('notAllUsersAdded', {x: callHistoryStore.remainingUsersToAdd} ) }}</vu-message>
          </div>
          <div class="start-call-modal-body">
            <component class="toggle-component" :is="currentComponent.component" v-bind="currentComponent.props"
              ref="startCallListRef" />
            <!-- <div v-if="callHistoryStore.enableTelephony" class="dialpad" v-html="dialpadIcon" :class="{ dialpadEnabled: isDialerComponent == true } " @click="showDialerComponent"></div> -->
          </div>
        </template>
        <template #modal-footer>
          <div v-if="isDialerComponent == false">
            <vu-btn color="primary start-call-btn" @click="startCallWithSelectedContacts(false)">
              <span class="fonticon fonticon-phone"></span>
              {{ $i18n('voiceCall') }}
            </vu-btn>
            <vu-dropdownmenu class="startcall-dropdown" :items="callDropdownItems" position="bottom-right"
              attach=".startcall-dropdown">
              <vu-btn color="primary" class="start-call-dropdown-btn">
                <vu-icon icon="fonticon fonticon-expand-down"></vu-icon>
              </vu-btn>
            </vu-dropdownmenu>
            <vu-btn @click="closeModal">
              {{ $i18n('cancel') }}
            </vu-btn>
          </div>
          <div v-else><span></span></div>
        </template>
      </vu-modal>
    </div>
  </Teleport>
</template>

<style scoped>
.start-call-modal-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.start-call-btn {
  border-radius: 4px 0px 0px 4px;
}

.start-call-dropdown-btn {
  box-sizing: border-box;
  height: 38px;
  min-width: 38px;
  margin-left: 2px;
  padding: 11px;
  border-radius: 0px 4px 4px 0px;
}

.start-call-btn {
  .fonticon-phone {
    margin-right: 7px;
  }
}

:deep(.start-call-dropdown-btn .vu-icon.default) {
  color: white;
  font-size: 12px;
  margin-right: 0px;
}

:deep(.btn.btn-primary.start-call-dropdown-btn) {
  margin-left: 2px
}

.toggle-component {
  width: 100%;
}

.dialpad {
  margin: 0.5em;
  height: 2em;
  width: 2em;
  display: block;
}

.dialpad:hover {
  cursor: pointer;
}

.dialpadEnabled {
  fill: #42a2da;
}

:deep(.startcall-dropdown .dropdown-menu-icons .item) {
  text-align: left
}
</style>