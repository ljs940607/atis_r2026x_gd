<script setup>
import { ref } from 'vue';
const editOfc = ref(false);
const editMob = ref(false);
const editComp = ref(false);

const phoneNum = ref({
    ofc: '',
    mobile: '',
    company: ''
});

const edit = function (phoneNum) {
    if (phoneNum.ofc)
        editOfc.value = true;
    else if (phoneNum.mobile)
        editMob.value = true;
    else
        editComp.value = true;
}
</script>

<template>
    <div class="phones">
        <vu-icon icon="mobile" class="content-header-container-icon"></vu-icon>
        <span class="content-header-container-title">My phone numbers</span>
        <hr>
        <div class="manage-phones">
            <span>Office</span>
            <input type="text" v-if="editOfc" @focusout="editOfc = false" v-model="phoneNum.ofc">
            <span class="editable-phone" v-else>{{ phoneNum.ofc }}</span>
            <vu-icon icon="pencil" @click="edit({ 'ofc': true })"></vu-icon>
        </div>
        <div class="manage-phones">
            <span>Mobile</span>
            <input type="text" v-if="editMob" @focusout="editMob = false" v-model="phoneNum.mobile">
            <span class="editable-phone" v-else>{{ phoneNum.mobile }}</span>
            <vu-icon icon="pencil" @click="edit({ 'mobile': true })"></vu-icon>
        </div>
        <div class="manage-phones">
            <span>Company</span>
            <input type="text" v-if="editComp" @focusout="editComp = false" v-model="phoneNum.company">
            <span class="editable-phone" v-else>{{ phoneNum.company }}</span>
            <vu-icon icon="pencil" @click="edit({ 'company': true })"></vu-icon>
        </div>
    </div>
    <br>
</template>
<style scoped>
.manage-phones {
    display: grid;
    grid-template-columns: 80px 150px 34px;
}

.editable-phone {
    color: #368ec4;
}

</style>