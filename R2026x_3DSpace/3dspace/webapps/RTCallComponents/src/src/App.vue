<script setup>
import { defineAsyncComponent, ref } from 'vue';

const CallHistory = defineAsyncComponent(() => import('./components/call-history/call-history.vue'))//'./components/call-history/call-history.vue')); //'../dist/CallHistory'))
const CallStarter = defineAsyncComponent(() => import('./components/call-starter/call-starter.vue'))//'./components/call-starter/call-starter.vue')); //'../dist/CallStarter'))

const selectedComponent = ref('History');
const loadRequestId = ref(1);
const activationId = ref(1);
const isInfinite = ref(true);
const scroller = ref(null);
const activeFilter = ref('')
const hasPhoneCallActivated = ref(false);
const hasCallsProfileActivated = ref(true);

function toggleComponent() {
  if (selectedComponent.value == 'History')
    selectedComponent.value = 'Preferences'
  else
  selectedComponent.value = 'History'
}
function sendMsg(user) {
  // console.log('User data ', user)
}

function print(topBar) {
}

function viewProfile(login){
  // console.log('Login data ', login)
}

const fetchNextPage = async () => {
  loadRequestId.value = loadRequestId.value + 1;
}
const isLoaded = (hasMore) => {

  if (!hasMore) {
    isInfinite.value = false;
  }
  // scroller.value?.stopLoading()
}

var items = [{

  text: 'Preferences',
  selectable: true,
  fonticon: 'cog',
  handler: () => {
    toggleComponent();
    activationId.value ++ ;
  }

}, {
  text: 'Clear history',
  selectable: true,
  fonticon: 'trash',
  handler: () => {
    selectedComponent.value = 'clearHistory';
    activationId.value ++ ;
  }
}
]

</script>

<template>
  <div class="main-container" @clearHistory = clearHistory>
    <div class="leftPanel">
      <!-- <vu-message-container namespace="rtconv"/> -->
      <call-starter 
      searchedValue="" 
      @startConversation="sendMsg" 
      />
    </div>
    <div class="rightPanel">
      <vu-dropdownmenu :items="items" position="bottom-right">
        <vu-icon icon="chevron-down"></vu-icon>
      </vu-dropdownmenu>
      <span class="fonticon handler fonticon-cog" @click="toggleComponent"></span>
      <vu-scroller ref="scroller" :infinite="isInfinite" @loading="fetchNextPage">
        <call-history 
        @getTopBarItems="print"
        @startConversation="sendMsg" 
        @viewProfile = "viewProfile"
        :activatedComponent="selectedComponent"
        :activeFilter="activeFilter" 
        :loadRequestId="loadRequestId" 
        :hasPhoneCallActivated="hasPhoneCallActivated"
        :hasCallsProfileActivated = "hasCallsProfileActivated"
        :activationId = "activationId"
        searchedValue="" 
        @loaded="isLoaded"
        />
      </vu-scroller>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  margin-top: 20px;
  display: flex;
}

.leftPanel {
  width: 20%;
  border-right-width: 1px;
  margin: 1em;
}

.rightPanel {
  width: 75%;
  border-right-width: 1px;
  margin-top: 10px;
  background-color: #F4F5F6
}

@media(max-width: 640px) {

  .rightPanel {
    width: 100%;
  }
}

@media(max-width: 640px) {
  .right-panel {
    padding: 0%;
  }
}
</style>
