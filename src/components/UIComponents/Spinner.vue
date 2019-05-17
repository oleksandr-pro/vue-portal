<template>
  <div class="spinner-wrapper">
    <span class="spinner"></span>
  </div>
</template>
<script>
  export default {
    name:'Spinner'
  }
</script>
<style scoped>
.spinner-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6);
}
.spinner-wrapper span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  border-right-color: #7039da;
  border-radius: 50%;
  animation: spin 0.4s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

