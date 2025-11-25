<script setup>
import { ref } from 'vue';
const startDate = ref(new Date());
const endDate = ref('');
const durationSettings = ref('');

const durationOptions = [
    {
        value: 'permanently',
        label: 'permanently',
    },
    {
        value: 'during this duration',
        label: 'during this duration',
    }

]

</script>

<template>
    <div class="duration-settings">
        <span class="content-header-container-title">This setting will apply</span>
        <vu-select :options=durationOptions hidePlaceholderOption v-model="durationSettings"></vu-select>
        <div v-if="durationSettings == 'during this duration'">
            <vu-input-date label="From" v-model="startDate"></vu-input-date>
            <vu-input-date label="To" v-model="endDate"></vu-input-date>
        </div>
    </div>
</template>

<style scoped>
.duration-settings {
    display: grid;
    grid-template-columns: 150px 180px 175px;
    gap: 30px;
}
</style>