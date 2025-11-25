<script setup>
import { ref, computed, watch } from 'vue'
import InputSearch from './input-search.vue'
import { useCallHistoryStore } from '../../stores/CallHistoryStore';

const props = defineProps(['callTypes']);
const emit = defineEmits(['submit']);
const filterRef = ref();

const filters = ref({
    startDate: null,
    endDate: null,
    category: '',
    search: ''
})

const selectedContact = computed(() => {
  const callHistoryStore = useCallHistoryStore();
  return callHistoryStore.selectedContact;
})

watch(selectedContact, (contact) => {
  if( contact != '' ) {
    filters.value.search = contact;
    submitFilter();
  }
  filterRef.value.updateSearch(contact);
})

function submitFilter() {
  emit('submit', filters);
}

function resetFilter() {
    filters.value.search = '';
    filters.value.startDate = null;
    filters.value.endDate = null;
    filters.value.category = '';
    emit('submit', filters);
    filterRef.value.clear()
} 

</script>


<template>
    <div class="call-filter">
            <div class="element category">
                <vu-select label="Categories"  placeholder="Select a category" hidePlaceholderOption :options="Object.values(callTypes)" v-model="filters.category"/>
            </div>
            <div class="element">
                <vu-input-date label="Start Date"  placeholder='Select a date' :min="new Date('2020-01-01')"
                :max="new Date()" v-model="filters.startDate"/>
            </div>
            <div class="element">
                <vu-input-date label="End Date"  placeholder='Select a date' :min="new Date('2020-01-01')"
                :max="new Date()" v-model="filters.endDate"/>
            </div>
            <div class="element">
                <input-search label="Search" placeholder="User/Conv/Phone" @search="(searchText)=>filters.search=searchText" ref="filterRef"/>
            </div>
            <div class="element">
                <vu-btn class="btn btn-primary filter-btn"  @click="submitFilter">Filter</vu-btn>
            </div>
            <div class="element">
                <vu-btn class="btn btn-primary filter-btn" @click="resetFilter" @clear="filters.value.search=''">Reset</vu-btn>
            </div>
    </div>
</template>

<style scoped>
.call-filter {
    display: flex;
    padding: 20px;
}
.element{
   padding-right: 10px;
}

.category{
    width: 25%;
}

.filter-btn{
  margin-top: 20px;
}
</style>