<script setup>
import { ref, computed, onMounted,watch } from 'vue';
import { checkIsMobileDevice } from '@ds/swymkit/utils'
import { useEventBus } from '@vueuse/core';
import avatar from '../utils/avatar.vue';
import RichUserTooltipWrapper from '../utils/rich-user-tooltip-wrapper.vue';
import CallDropdown from '../utils/call-dropdown.vue'
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useRTCStore } from '../../stores/RTCStore';
import { useTranslations } from '../utils/translations';
const { i18n,$i18n,promise } = useTranslations('callhistory')

const props = defineProps(['contact', 'call']);
const bus = useEventBus('swym-events');

const callHistoryStore = useCallHistoryStore();
const rtcStore = useRTCStore();
const isMissed = computed(() => props.call.category.value == 'Missed'); 
const isOngoing = computed(()=> props.call.category.value == 'Ongoing');
const isMerged = computed(()=> isMissed && props.call.merged && props.call.merged.length > 0);

const showMerged = ref(false);
const translationsLoaded = ref(false);
const isHovered = ref(false);
const convTopic = computed(() => !props.contact.hasCustomTitle);

const isTooltipActivated = computed(() => 
  !(checkIsMobileDevice()) && props.contact.members.length === 2
);


onMounted((async()=>{
  await promise;
  promise.then(translationsLoaded.value = true)
}))


let enterTimeout = null; 
let leaveTimeout = null; 

const activateTooltip = function(){
  if (enterTimeout) clearTimeout(enterTimeout);
  enterTimeout = setTimeout(() => {
    if(!convTopic.value)
    isHovered.value = true;
  }, 700);
}

const deActivateTooltip = function(){
  if (enterTimeout) clearTimeout(enterTimeout);
  if(leaveTimeout) clearTimeout(leaveTimeout)
  leaveTimeout = setTimeout(() => {
    isHovered.value = false;
  }, 300);
}

const userLogin = function() {
  if (props.contact.members.length === 2){
    const user = props.contact.members.filter(el => el.login !== callHistoryStore.currentUserLogin);
    return user[0].login;
  }
}

// TODO: fetchDetails is defined in multiple component files, make this common
const fetchDetails = function (call) {
  let topic = call.convTopic || props.contact.title;
  let logins = [];
  let data = {};
  for (let i = 0; i < call.users.length; i++) {
    logins.push(call.users[i].login)
  }
  data.logins = logins;
  data.dmId = call.subjectUri || call.conversation_id || call.ext_conv_id || '';
  data.callId = call.call_id;
  // data.dbConvId = call.conversation_id || call.ext_conv_id || '';
  data.topic = topic;
  return data;
}

const joinCall = (async (type, call) => {
  let data = fetchDetails(call);
  data.type = type;
  callHistoryStore.startCall(data);
})


const checkState = (call) => {
  let currentUser = call.users.find(user => user.login === callHistoryStore.currentUserLogin);
  if (currentUser && ((currentUser.state === null || currentUser.state === '3') || (isOngoing)  ||(currentUser.state == '1' && (currentUser.joinDate < currentUser.quitDate))))
    return true
  else
    return false
}

const toggleMerged = function (merged) {
  showMerged.value = !showMerged.value;
}

const openContact = function () {
  if (!props.call.convTopic && props.call.users.length == 2) {
    let data = {};
    data.userLogin = props.call.users.filter(el => el.login !== callHistoryStore.currentUserLogin)[0].login;
    bus.emit('viewProfile', data);
  }
  else {
    let data = fetchDetails(props.call);
    bus.emit('startConversation', data);
  }
}

</script>

<template>
  <div class="call-items" :class="{ongoingCallIitems : isOngoing}" v-if="translationsLoaded">

    <div class="contacts" :class= "[{ongoingContacts : isOngoing} , {threeColumn : isMerged || props.call.duration!= '' }]" >
      <span class="contact-item user-icon">
        <avatar :contact="props.contact" :topic="!props.contact.hasCustomTitle" isRightPanel="true"  @click="openContact"/>
      </span>
      <div class="contact-item">
        <div>
          
          <RichUserTooltipWrapper v-if="isTooltipActivated" :displayed-user-login="userLogin()"  :is-hovered="isHovered" @mouseenter="activateTooltip" @mouseleave="deActivateTooltip">
            <template #default="{ setRef }">
              <a :ref="(el) => setRef(el)" class="contact-title" @click="openContact">{{ props.contact.title }}&nbsp;</a>
            </template>
          </RichUserTooltipWrapper>

          <a v-else class="contact-title" @click="openContact">{{ props.contact.title  }}&nbsp;</a>

          <span class="call-type">
            <vu-icon v-if="props.call.type == 'video'" icon="videocamera" />
            <vu-icon v-else icon="phone" />
          </span>
          <span class="call-category" :class="{ missed: isMissed }">{{ props.call.category.text }}</span>
          <span v-if="isMissed && props.call.merged && props.call.merged.length > 0" class="missed">{{ ' (' +
          props.call.merged.length + ')' }}</span>
        </div>
        <div class="call-date">
          - {{ call.creation_date_string }}
        </div>
      </div>
      <div v-if="props.call.category.value == 'Ongoing' && checkState(props.call)" class="join-btn contact-item">
        <button class="btn btn-primary" @click="joinCall('audio', props.call)">
          <vu-icon icon='phone' class="call-icon"></vu-icon>{{ $i18n('joinCall') }}</button>
      </div>
      <div v-if="props.call.merged && props.call.merged.length > 0" class="contact-item">
        <a class="call-merged" @click="toggleMerged(props.call.merged)">
          {{ showMerged ? $i18n('viewLess') : $i18n('viewMore') }}
        </a>
      </div>
      <div v-else-if="props.call.category.value != 'Ongoing' && props.call.duration" class="contact-item">
        <span class="call-duration">
          {{ props.call.duration }}
        </span>
      </div>
      <div v-if="props.call.merged && props.call.merged.length > 0 && showMerged" class="merged-calls-container">
        <hr>
        <div class="merged-calls-grid">
          <div v-for="mergedCall in props.call.merged" :key="mergedCall.call_id">
            <span class="call-type">
              <vu-icon v-if="mergedCall.type == 'video'" icon="videocamera" />
              <vu-icon v-else icon="phone" />
            </span>
            <span class="call-category" :class="{ missed: isMissed }">{{ props.call.category.text }}</span>
            <span class="call-date"> - {{ mergedCall.creation_date_string }}</span>
          </div>
        </div>
      </div>
    </div>




    <div v-if="props.call.category.value !== 'Ongoing'" class="call-dropdown">
      <call-dropdown v-if="callHistoryStore.isRTCStoreLoaded" :isRightPanel="true" :call="props.call"
        :contact="props.contact">
      </call-dropdown>
    </div>
    <div v-if="props.call.category.value == 'Ongoing' && checkState(props.call)" class="join-mobile contact-item">
      <button class="btn btn-primary" @click="joinCall('audio', props.call)">
        <vu-icon icon='phone' class="call-icon"></vu-icon>
        {{ $i18n('joinCall') }}
      </button>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.call-items {
  display: grid;
  grid-template-columns: 96% 4%;
  align-items: center;
  gap: 2px;
}

.contacts {
  display: grid;
  padding: 0px 10px;
  grid-template-columns: 40px 90%;
  column-gap: 10px;
  row-gap: 0px;
  background-color: white;
  border: 1px solid #D1D4D4;
  border-radius: 4px;
  margin-bottom: 6px;
  overflow: hidden;
  align-items: center;
  min-height: 54px;
  transition: height 0.3s ease;
}
.threeColumn{
  grid-template-columns: 40px 75% auto;
}
.ongoingContacts{
  grid-template-columns: 40px 75% auto;
}
.merged-calls-container {
  margin-left: 50px;
  margin-bottom: 10px;

  hr {
    width: 800px;
    margin: 0px;
    border: solid 1px #e2e4e3;
  }
}

.merged-calls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 5px;
}

.call-duration {
  margin: auto;
  margin-right: 10px;
}

.call-merged {
  color: #368EC4;
  margin: auto;
  margin-right: 10px;
  cursor: pointer;
}

.contact-item {
  display: flex;
  color: rgb(119 121 124);
  margin-top: 8px;
  margin-bottom: 8px;
  /* padding: 5px; */
}

.contact-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-word;
  -webkit-line-clamp: 1;
  justify-content: space-between;
  color: rgb(25, 25, 25);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.call-type {
  margin-right: 6px;
}

:deep(.call-type .fonticon-videocamera::before) {
  font-size: 12px;
}

:deep(.contact-item .vu-popover__activator){
  display: flex;
}

:deep(.call-type .fonticon-phone::before) {
  font-size: 12px;
}

.call-category {
  font: normal normal normal 13px/15px Arial;
}

.call-date {
  color: rgb(119 121 124);
  font-size: .8125rem;
  font-style: italic;
  white-space: nowrap;
}

.call-dropdown {
  // margin: auto;
  display: none;
}

.call-items:hover>.call-dropdown {
  display: block;
}

.user-icon {
  align-items: center;
  display: flex;
  cursor: pointer;
}

.missed {
  color: #EA4F37;
}

:deep(.call-icon.vu-icon.default) {
  color: white;
  margin-right: 7px;
}

.join-btn {
  justify-self: end;
}

.join-mobile {
  display: none;
}

:deep(join-mobile .btn) {
  padding: 4px 4px;
}

:deep(join-mobile.btn.fonticon) {
  margin: 0px;
}

.caller {
  overflow: hidden;
  display: block;
  font-weight: lighter;
  font-size: small;
  font-style: italic;
}

.callJoinable {
  border: 1px solid #E87B00;
  border-radius: 5px;
  background-color: white;
  color: #E87B00;
  padding: 5px 15px;
  cursor: pointer;
}

.startCall {
  border: 1px solid green;
  border-radius: 5px;
  background-color: white;
  color: green;
  padding: 5px 10px 5px 10px;
  cursor: pointer;
}


@media(max-width: 1280px) {
  .contacts {
    grid-template-columns: 40px 88% ;
  }

  .call-items {
    grid-template-columns: 90% 4%;
  }
  .threeColumn{
  grid-template-columns: 40px 51% auto;
}
.ongoingContacts{
  grid-template-columns: 40px 51% auto;
}
}

@media(max-width: 1024px) {
  .contacts {
    grid-template-columns: 40px 88% ;
  }
  .threeColumn{
  grid-template-columns: 40px 50% auto;
}
.ongoingContacts{
  grid-template-columns: 40px 50% auto;
}
}
@media(max-width: 730px) {
  .contacts {
    grid-template-columns: 40px 88% ;
  }
  .threeColumn{
  grid-template-columns: 40px 55% auto;
}
.ongoingContacts{
  grid-template-columns: 40px 55% auto;
}
}

@media(max-width: 640px) {
  .contacts {
    grid-template-columns: 40px 88%;
  }
  .threeColumn{
  grid-template-columns: 40px 50% 35%;
}
.ongoingContacts{
  grid-template-columns: 40px 50% 30%;
}
}

@media(max-width: 465px) {
  .contacts {
    grid-template-columns: 40px 83% ;
    border: none;
  }
  .threeColumn{
    grid-template-columns: 40px 59% 26%;
    border: none;
  }
  .ongoingContacts{
    grid-template-columns: 40px 85%;
    border: none;
  }
  .call-items {
    background-color: white;
    grid-template-columns: 89% auto;
  }
  .ongoingCallIitems {
    grid-template-columns: 82% auto;
  }
  :deep(.call-icon.vu-icon.default) {
    display: none;
  }

  .call-duration {
    display: none;
  }

  .join-btn {
    display: none;
  }

  .join-mobile {
    display: block;
  }

  .btn.btn-primary{
    min-width:38px;
  }

  .call-dropdown {
    display: block;
  }
}

@media(max-width: 380px) {
  .contacts {
    grid-template-columns: 40px 78%;
  }
  .ongoingContacts{
    grid-template-columns: 40px 85%;
    border: none;
  }
  .threeColumn{
    grid-template-columns: 40px 66% 14%;
  }
  .call-items{
    grid-template-columns: 87% auto;
  }
  .ongoingCallIitems {
    grid-template-columns: 80% auto;
  }

}

@media(max-width: 300px) {
  .contacts {
    grid-template-columns: 40px 52% 20%;
  }
  .ongoingContacts{
    grid-template-columns: 40px 85%;
    border: none;
  }
  .call-items {
    grid-template-columns: 85% auto;
  }
  .ongoingCallIitems {
    grid-template-columns: 80% auto;
  }
}
@media(max-width: 260px) {
  .contacts {
    grid-template-columns: 40px 52% 20%;
  }
  .ongoingContacts{
    grid-template-columns: 40px 75%;
    border: none;
  }
  .call-items {
    grid-template-columns: 84% auto;
  }
  .ongoingCallIitems {
    grid-template-columns: 76% auto;
  }
}
</style>