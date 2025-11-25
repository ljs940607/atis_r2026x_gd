<script setup>
import { computed,onMounted,reactive,ref } from 'vue';
import { useCallHistoryStore } from '../../stores/CallHistoryStore';
import { useRTCStore } from '../../stores/RTCStore';
import { useEventBus } from '@vueuse/core';
import { useTranslations } from './translations';
const { i18n,$i18n,promise } = useTranslations('callhistory');
const callHistoryStore = useCallHistoryStore();
const rtcStore = useRTCStore();
const bus = useEventBus('swym-events');

onMounted(async()=>{
await promise;
promise.then(()=>{
translationsLoaded.value = true;
})
})

const props = defineProps(['isLeftPanel','isRightPanel','contact','call']);
let disabledForNow = true;
const translationsLoaded = ref(false);

const processMergedCalls = function(mergedCall){
  let mergedIds = [];
  mergedIds.push(mergedCall.call_id);
  for(let call in mergedCall.merged){
    mergedIds.push(mergedCall.merged[call].callId);
  }
  return mergedIds;
}

const fetchCallDetails = function (contact) {
  var logins = [];
  var data = {}; 

  for (let i = 0; i < contact.members.length; i++) {
    logins.push(contact.members[i].login)
  } 
  if(contact.members.length == 2){
    data.topic = !contact.hasCustomTitle ? contact.title: '';
  }
  else {
    data.topic = contact.title;
  }

  if(contact.isConversation){
    data.dmId = contact.subjectUri || contact.id;
    data.dbConvId = contact.id;
  }
  else{
    data.dmId = '';
  }
  data.logins = logins; 
  return data;
}

const getFavoritesSubmenu = computed(() => {
  let submenu = [
    {
      text: $i18n('voiceCall'),
      fonticon: 'phone',
      handler: () => {
        let data = {};
        data.type = 'audio';
        data.sortIdx = 1;
        if (props.contact?.isUser) data.userId = props.contact.user_id;
        else if (props.contact?.isSwymV2) data.extConvId = props.contact.id;
        else data.convId = props.contact.id;
        rtcStore.setCallFavorite(data)
      }
    },
    {
      text: $i18n('videoCall'),
      fonticon: 'videocamera',
      handler: () => {
        let data = {};
        data.type = 'video';
        data.sortIdx = 1;

        if (props.contact?.isUser) data.userId = props.contact.user_id;
        else if (props.contact?.isSwymV2) data.extConvId = props.contact.id;
        else data.convId = props.contact.id;
        rtcStore.setCallFavorite(data)
      }
    }
  ]
  if (callHistoryStore.enableTelephony && ((props.isLeftPanel && props.contact.mainPhone!="null") || 
     (props.isRightPanel && props.call.mainPhone && props.call.mainPhone!="null"))) {
    submenu.push({
      text: props.isLeftPanel? props.contact.mainPhone: props.call.mainPhone,
      fonticon: 'phone',
      handler: () => {
        let data = {};
        data.type = 'audio';
        data.isMainPhone = true;
        data.sortIdx = 1;
        if (props.contact?.isUser) data.userId = props.contact.user_id;
        else if (props.contact?.isSwymV2) data.extConvId = props.contact.id;
        else data.convId = props.contact.id;
        rtcStore.setCallFavorite(data)
      }
    })
  }
  return reactive(submenu);
});

const getMainMenu = computed(() => {
  let items = [
  {
    text: $i18n('sendMessage'),
    fonticon: 'chat',
    handler: () => {
      let data = fetchCallDetails(props.contact)
      bus.emit('startConversation', data)
    }
  },  
  {
    text: $i18n('startVoiceCall'),
    fonticon: 'phone',
    handler: () => {
        var data = fetchCallDetails(props.contact);
        data.type = 'audio';
        callHistoryStore.startCall(data)
      }
  },
  {
    text: $i18n('startVideoCall'),
    fonticon: 'videocamera ',
    handler: () => {
      var data = fetchCallDetails(props.contact);
      data.type = 'video';
      callHistoryStore.startCall(data)
    }
  },
  {
    text: $i18n('startScreenCall'),
    fonticon: 'monitor',
    handler: () => {
      var data = fetchCallDetails(props.contact);
      data.type = 'screen';
      callHistoryStore.startCall(data)
    }
  },
  {
    class: 'divider',
  },
  {
    text: props.isLeftPanel ? $i18n('removeFromFavorites') : $i18n('addToFavorites'),
    fonticon: props.isLeftPanel ? 'favorite-delete' : 'favorite-add',
    handler: props.isLeftPanel ? () => {
      let data = {};
      data.type = props.contact.favoriteType
      data.sortIdx = -1;
      data.isMainPhone = props.contact.favoriteType == 'phone' ? true : false;

      if (props.contact?.isUser) data.userId = props.contact.user_id;
      else if (props.contact?.isSwymV2) data.extConvId = props.contact.id;
      else data.convId = props.contact.id;

      rtcStore.setCallFavorite(data);
      rtcStore.markConvAsNonFavorite(props.contact.id);
    } : () => { },
    items: props.isRightPanel ? getFavoritesSubmenu : '',
  }
]
items = items.filter(item => item.text !== $i18n('viewProfile'));
if (callHistoryStore.enableProfile && props.contact && props.contact.members.length === 2) {
  items.push({
    text: $i18n('viewProfile'),
    fonticon: 'user',
    handler:()=>{
      let data = {};
      data.userLogin = props.contact.isUser?props.contact.login:props.contact.members.filter(el =>el.login !== callHistoryStore.currentUserLogin)[0].login;      
      bus.emit('viewProfile',data);
    }
  })
}
if (props.isRightPanel) {
    items.push({
    class: 'divider',
  },
  {
    text: $i18n('removeFromHistory'),
    fonticon: 'trash',
    handler:()=>{
      props.call.merged ? rtcStore.removeFromHistory(processMergedCalls(props.call)) :rtcStore.removeFromHistory(props.call.call_id)
    }
    },)
}
if (!disabledForNow) {
    items.push(
    {
      text: $i18n('blockContact'),
      fonticon: 'user-block',
    })
}
return reactive(items);
});



</script>
<template>
  <div class="action-menu">
    <vu-dropdownmenu v-if="translationsLoaded" :items="getMainMenu"  position="bottom-right" class="menu">
      <span class="fonticon fonticon-clickable fonticon-chevron-down chevron-menu-icon" />
    </vu-dropdownmenu>
  </div>
</template>

<style scoped>
.action-menu {
  width: 38px;
  height: 38px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-menu:hover {
  cursor: pointer;
}

</style>