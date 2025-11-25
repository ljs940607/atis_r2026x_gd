<script lang="ts" setup>

import { watch, shallowRef, onBeforeUnmount, ref } from 'vue';
import { requirejs } from '../../modules/require';

const props = defineProps<{
  login?: string
  swymUrl?: string
  class?: string
}>()


const computeAvatarUrl = () => {
  return `${props.swymUrl}/api/user/getpicture/login/${props.login}`
}

const elRef = ref<HTMLDivElement>()
const presenceComponent = shallowRef()

watch(elRef, async (element) => {

  if (!element)
    return
  try {
    const [component, VueJS] = await requirejs([
      'DS/RTVueUserPresenceAPI/RTVueUserPresenceAPI',
      'vuejs',
    ])
    const ComponentConstructor = VueJS.extend(component)
    presenceComponent.value = new ComponentConstructor({
      propsData: {
        login: props.login,
        swymUrl: props.swymUrl
      },
    })
    presenceComponent.value.$mount()
    element.parentElement?.replaceChild(presenceComponent.value.$el, element);
    (presenceComponent.value.$el as HTMLDivElement).classList.add(props.class || '')
  }
  catch (error) {
  }

}, { immediate: true })

watch(() => props.login, (v) => {
  if (presenceComponent.value)
    presenceComponent.value.login = v
})

onBeforeUnmount(() => {
  if (presenceComponent.value)
    presenceComponent.value.$destroy()
})

</script>

<template v-if="swymUrl.length">
  <div ref="elRef" />
</template>

