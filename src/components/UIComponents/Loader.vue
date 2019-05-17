<t
<template>
  <div class="spinner-wrapper">
    <span class="spinner"></span>
  </div>
</template>
<script>
  export default {
    name: 'Loader'
  }
</script>
<style scoped>
  .spinner-wrapper {
    position: relative;
    display: inline-block;
  }

  .spinner-wrapper span {
    display: block;
    width: 14px;
    height: 14px;
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

