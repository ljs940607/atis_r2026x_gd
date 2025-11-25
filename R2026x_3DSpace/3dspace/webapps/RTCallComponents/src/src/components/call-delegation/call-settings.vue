<script setup>
import { onMounted } from 'vue'
import myPhoneNumbers from './my-phone-numbers.vue';
import callForwarding from './call-forwarding.vue';
import myDelegates from './my-delegates.vue';
import myFavourites from './my-favourites.vue';

</script>

<template>
    <div class="settings-container">
        <div class="header-title">
            Call Settings
        </div>
        <br>
        <my-phone-numbers></my-phone-numbers>
        <call-forwarding></call-forwarding>
        <my-delegates></my-delegates>
        <my-favourites></my-favourites>
        <div class="footer">
        <vu-btn class="btn btn-primary">Save</vu-btn>
        <vu-btn class="btn btn-primary">Cancel</vu-btn>
        </div>
        
    </div>
</template>

<style scoped>
.settings-container {
    width: 100%;
    padding-left: 60px;
    padding-right: 60px;
}

.header-title {
    font-size: 1.375rem;
    color: rgb(25 25 25);
}
.footer{
    position: absolute;
    right: 50px;
    gap: 0.675rem;
}
</style>