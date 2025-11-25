<script setup>
defineProps({
  n: {
    default: 1,
  },
})
</script>

<template>
  <div favorites-placeholder>
<div
      v-for="i in n"
      style="display: flex;
      flex-direction:column;  
      padding: 0px 10px;
      border-radius: 4px;
      width:100%;
      background-color:white;"
    >
      
      <div class="contacts-placeholder">
        <div class="user-icon"></div>
        <div class="contact-item">
          <div style="">
              <div class="contact-title"></div> 
            <div style="display:flex;">
              <span class="favorite-type"></span>
              <span class="startCall-text"></span>
            </div>  
          </div>
        </div>
        <div class="dropdown-icon"></div>
      </div>
    </div>
    
</div>
</template>

<style scoped>

div[favorites-placeholder] {
  display:flex;
  flex-direction:column;
  gap: 0.625rem; 
  margin-top:5px;
}
.contacts-placeholder {
  display: flex;
  background-color: white;
  height: 50px;
  margin-top:5px;
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
  width: 85%;
}
.contact-title {
  width:75%;
  height:10px;
  margin-top:2px;
  margin-bottom:5px;
  /* margin-right: 6px; */
  background-color: #e2e4e3;
}
.favorite-type {
  margin-right: 6px;
  display:inline-block;
  height:10px;
  width:4%;
  background-color: #e2e4e3;
}
.startCall-text {
  display:inline-block;
  margin-right: 6px;
  height:10px;
  width:30%;
  background-color: #e2e4e3;
}
.dropdown-icon{
  margin-top:2px;
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