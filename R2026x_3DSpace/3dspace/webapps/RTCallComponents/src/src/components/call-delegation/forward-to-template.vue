<script setup>
import { ref } from 'vue';
const forwardModel = ref([]);
const forwardedToOptions = [
    {
        value: 'your Mobile phone',
        label: 'your Mobile phone',
    },
    {
        value: 'your delegates',
        label: 'your delegates'
    }
]
</script>

<template>
    <div>
        <vu-checkbox :options="forwardedToOptions" :rules="[v => v.length > 0]" v-model="forwardModel"></vu-checkbox>
    </div>
</template>