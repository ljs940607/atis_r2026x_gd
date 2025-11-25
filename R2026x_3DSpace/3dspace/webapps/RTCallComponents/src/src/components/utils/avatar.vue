<script setup>
import { computed,ref } from 'vue';
import { useRTCStore } from '../../stores/RTCStore';
import { checkIsMobileDevice } from '@ds/swymkit/utils';
import UserPresence from './user-presence.vue'
import RichUserTooltipWrapper from './rich-user-tooltip-wrapper.vue';

const props = defineProps(['contact', 'topic', 'isRightPanel'])

const rtcStore = useRTCStore();

const isHovered = ref(false);

let enterTimeout = null; 
let leaveTimeout = null; 

const isTooltipActivated = computed(() => 
  !(checkIsMobileDevice()) && props.isRightPanel
);

const activateTooltip = function(){
  if (enterTimeout) clearTimeout(enterTimeout);
  enterTimeout = setTimeout(() => {
    if(!props.topic)
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

const usersInContact = computed(() => {
  if (props.contact?.isConversation){
    if (props.contact.members.length === 1)
      return props.contact.members
    
    const users = props.contact.members.filter(el => el.login !== rtcStore.currentUserLogin)
    return users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)
  } else {
    if (props.contact?.isUser) {
      return [props.contact];
    }
    else {
      if (props.contact?.members && props.contact.members.length >= 1) {
        const users = props.contact.members.filter(el => el.login !== rtcStore.currentUserLogin)
        return users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)
      }
    }
  }
})

</script>

<template>
  <div v-if="usersInContact">
    <div v-if="usersInContact.length > 1" class="conv">
      <div class="flex justify-center items-center">
        <UserPresence :login="usersInContact[0].login" class='tiny' :swym-url="rtcStore.swymUrl" />
      </div>
      <div v-if="usersInContact.length === 2" />
      <div v-if="usersInContact.length === 2" />
      <div class="flex justify-center items-center">
        <UserPresence :login="usersInContact[1].login" class='tiny' :swym-url="rtcStore.swymUrl" />
      </div>
      <div v-if="usersInContact[2]" class="flex justify-center items-center">
        <UserPresence :login="usersInContact[2].login" class='tiny' :swym-url="rtcStore.swymUrl" />
      </div>
      <div v-if="usersInContact[3]" class="flex justify-center items-center">
        <UserPresence :login="usersInContact[3].login" class='tiny' :swym-url="rtcStore.swymUrl" />
      </div>
      <div v-if="contact.members.length > 5" class="flex justify-center items-center member-count">
        <span>
          +{{ contact.members.length - 4 }}
        </span>
      </div>

    </div>

    <div v-else-if ="isTooltipActivated">
      <RichUserTooltipWrapper :displayed-user-login="usersInContact[0].login"  :is-hovered="isHovered" @mouseenter="activateTooltip" @mouseleave="deActivateTooltip">
        <template #default="{ setRef }">
          <UserPresence :login="usersInContact[0].login" class='medium' :swym-url="rtcStore.swymUrl" :ref="(el) => setRef(el)"/>
        </template>
      </RichUserTooltipWrapper>
    </div>

    <div v-else>
      <UserPresence :login="usersInContact[0].login" class='medium' :swym-url="rtcStore.swymUrl"/>
    </div>
  </div>
</template>

<style scoped>

.conv {
   display: inline-grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
   grid-template-rows: repeat(2, minmax(0, 1fr));
}

.member-count {
  font-weight: 700;
  font-size: .5rem;
  background-color: rgb(226, 228, 227);
  border-radius: 9999px;
  overflow: hidden;
}
</style>
