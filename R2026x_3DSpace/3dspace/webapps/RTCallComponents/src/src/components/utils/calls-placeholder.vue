<script setup>
import timelinePlaceholder from './timeline-placeholder.vue'
defineProps({
  n: {
    default: 1,
  },
  m : {
    default:1
  }
})
</script>

<template>
  <div call-placeholder>
    
    <div v-for="i in n">
      <timeline-placeholder/>
 
    <div
      v-for="j in m"
      style="display: flex;
      flex-direction:column;  
      padding: 0px 10px;
      margin-bottom: 6px;
      border-radius: 4px;
      column-gap: 10px;
      width:100%;
      background-color:white;"
    >
      
      <div class="contacts-placeholder">
        <div class="user-icon"></div>
        <div class="contact-item">
          <div style="max-width: 80%;">
            <div style="display:flex;">
              <div class="contact-title"></div> 
              <div class="call-date"></div>
            </div>
            <div style="display:flex;">
              <span class="call-type"></span>
              <span class="call-category"></span>
            </div>  
          </div>
        </div>
        <div class="call-duration"></div>
      </div>
    </div>
  </div> 
    
</div>
</template>

<style scoped>

div[call-placeholder] {
  display:flex;
  flex-direction:column;
  gap: 0.625rem; 
  margin-top:5px;
}
.contacts-placeholder {
  display: flex;
  background-color: white;
  height: 50px;
  margin-top:8px;
  align-items:center;
}
.user-icon {
  border-radius: 9999px; 
  height: 38px;
  width: 38px;
  background-color: #e2e4e3;
  margin-right:10px;
}

.contact-item {
  display: flex;
  flex-direction:column;
  width: 80%;
}
.contact-title {
  width:30%;
  height:10px;
  margin-top:2px;
  margin-bottom:5px;
  margin-right: 10px;
  background-color: #e2e4e3;
}
.call-type {
  margin-right: 6px;
  display:inline-block;
  height:10px;
  width:2%;
  background-color: #e2e4e3;
}
.call-category {
  display:inline-block;
  margin-right: 6px;
  height:10px;
  width:10%;
  background-color: #e2e4e3;
}
.call-date {
  margin-top:2px;
  background-color: #e2e4e3;
  height:10px;
  width:5%;
}
.call-duration{
  height:10px;
  width:3%;
  background-color: #e2e4e3;
}

/* div[call-placeholder]::after {
  content: " ";
  box-shadow: 0 0 20px 9px #fefefe;
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  animation: load 1s infinite;
}

@keyframes load {
  0% {
    left: -100%;
  }

  100% {
    left: 150%;
  }
}

@keyframes fade-in-keyframe {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.fade-in-keyframe {
  animation: fade-in-keyframe 0.4s ease forwards;
} */

</style>