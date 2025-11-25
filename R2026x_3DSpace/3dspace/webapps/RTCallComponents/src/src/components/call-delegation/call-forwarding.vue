<script setup>
import { ref } from 'vue';
import DurationTemplate from './duration-template.vue'
import forwardToTemplate from './forward-to-template.vue';
const forwardModel = ref([]);
const unansweredModel = ref([]);

const forwardSettings = ref('');

const unansweredSettings = ref('');
const forwardingOptions = [
    {
        id:1,
        value: 'ring on your office phone and 3DExperience platform (default, no forwarding)',
        label: 'ring on your office phone and 3DExperience platform (default, no forwarding)'
    },
    {
        id:2,
        value: 'be directly forwarded to your delegates',
        label: 'be directly forwarded to your delegates'
    },
    {
        id:3,
        value: 'simultaneously ring on your phone, 3DExperience platform and be forwarded to ...',
        label: 'simultaneously ring on your phone, 3DExperience platform and be forwarded to ...'
    }
];

const unansweredOptions = [
    {
        value: 'will stop after 30 seconds (default)',
        label: 'will stop after 30 seconds (default)',
    },
    {
        value: 'be forwarded to',
        label: 'be forwarded to',
    }
]

</script>

<template>
    <div class="forwarding-container">
        <vu-icon icon="user-change" class="content-header-container-icon"></vu-icon>
        <span class="content-header-container-title">Forwarding</span>
        <hr>
        <div class="settings">
            <span>Calls Will</span>
            <vu-select :options=forwardingOptions hidePlaceholderOption v-model="forwardSettings"></vu-select>
        </div>
        <forward-to-template v-model="forwardModel" v-if="forwardSettings == forwardingOptions[2].value"></forward-to-template>
        <duration-template></duration-template>
        <div class="settings">
            <span class="content-header-container-title">Unanswered Calls</span>
            <vu-select :options=unansweredOptions hidePlaceholderOption v-model="unansweredSettings"></vu-select>
            <forwardToTemplate v-model="unansweredModel" v-if="unansweredSettings == 'be forwarded to'"></forwardToTemplate>
        </div>
        <duration-template></duration-template>
    </div>
</template>
<style scoped>
.settings {
    max-width: 600px;
}
</style>