<script lang="ts" setup>

defineProps<{
  date: Date| string | number
}>()

const prettyDate = (date: Date | string | number) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const yearNow = (new Date()).getFullYear()
  const options: Intl.DateTimeFormatOptions = (y === yearNow)
    ? { weekday: 'long', month: 'long', day: 'numeric' }
    : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

  return d.toLocaleDateString('en-US', options)
}
</script>

<template>
  <div class="timeline-header">
    <hr>
    <div class="timeline-text">
      {{ prettyDate(date) }}
    </div>
    <hr>
  </div>
</template>

<style lang="scss" scoped>
  .timeline-header {
    display: flex;
    gap: 4px;
    align-items: center;
    max-width: 1230px;

    .timeline-text {
      color: #77797c;
      font-size: 12px;
      font-weight: bold;
      padding: 2px 16px;
      border-radius: 10px;
      background-color: #e2e4e3;
    }

    hr {
      flex-grow: 1;
      margin: 1;
      border-top: solid 2px #e2e4e3;
    }
  }
</style>
