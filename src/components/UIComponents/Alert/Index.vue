<template>
  <div v-if="isDisplay" class="alert alert-danger" :class="type">
    <button type="button" class="close" @click="hide">×</button>
    <span><b>{{ message }}</b></span>
  </div>
</template>

<script>
export default {
  name: 'custom-alert',
  data () {
    return {
      isDisplay: false,
      message: '',
      type: ''
    }
  },
  methods: {
    hide () {
      this.isDisplay = false
      this.message = ''
      this.type = ''
    },
    show (message, type = 'alert-danger') {
      this.isDisplay = true
      this.message = message
      this.type = type
    },
  }
}
</script>

<style>

</style>
