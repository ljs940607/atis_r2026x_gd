<script setup>
import { ref } from 'vue';
import RichUserTooltip from '@ds/rich-user-tooltip'
import { useEventBus,unrefElement } from '@vueuse/core';
import * as config from '@ds/swymkit/stores'

/**
 * @props
 */
const props = defineProps(['displayedUserLogin', 'isHovered'])

/**
 * @emits
 */
const emit = defineEmits(['close'])

const bus = useEventBus('swym-events');

const onTooltip = ref(false)
const element = ref(null);

function setSlotRef(el) {
  element.value = unrefElement(el);
}

function getPlatformId() {
  return config.getPlatformId();
}
function getRegistryUrl() {
  return config.getRegistryUrl()
}

function goToConversation(subject_uri) {
  let data = {};
  data.dmId = subject_uri;
  bus.emit('startConversation', data);
}

function goToProfile () {
    let data = {};
    data.userLogin = props.displayedUserLogin
    bus.emit('viewProfile', data);
  }

</script>

<template>
  <RichUserTooltip
    v-model:on-tooltip="onTooltip"
    :platform-id=" getPlatformId()"
    :show="isHovered"
    :user-login="displayedUserLogin"
    :urls="{
      registryUrl: getRegistryUrl(),
    }"
    :used-in-swym="true"
    @go-to-profile="goToProfile(); emit('close')"
    @start-a-conversation="goToConversation($event); emit('close')"
  >
    <slot :set-ref="setSlotRef" />
  </RichUserTooltip>
</template>
