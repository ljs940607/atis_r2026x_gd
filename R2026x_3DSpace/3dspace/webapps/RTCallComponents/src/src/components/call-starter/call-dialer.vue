<script setup>
import { requirejs } from '../../modules/require';
import { onBeforeMount, shallowRef, defineAsyncComponent } from 'vue';

const props = defineProps(['login'])

const call = async(data) => {
  const [RTAudioVideoAPI] = await requirejs(['DS/RTAudioVideoAPI/RTAudioVideoAPI']);
  RTAudioVideoAPI.startCall({
    type:'audio',
    phone:data,
    options: {
      sip: true
    }
  });
  // startTelephonyCall();
};

const VuDialer = shallowRef();

onBeforeMount(() => {
  VuDialer.value = defineAsyncComponent(async() => {
    const [RTDialer] = await requirejs(['DS/RTDialer/RTDialer']);
    return RTDialer.vue3cmp;
  });
});
</script>

<template>
    <vu-dialer :callFunction="call"/>
</template>

<style scoped>
</style>