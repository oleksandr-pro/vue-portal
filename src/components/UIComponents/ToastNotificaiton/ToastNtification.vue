<template>
  <collapse-transition  :duration="100">
    <div class=toastNotification__wrapper v-if="snackBar.visible">
      <div class="row align-items-center h-100 w-100 no-gutters"
      >
        <div class="text-center col-1">
            <span class="toastNotification__iconwrapper fa  " :class="{
            [`text-${snackBar.status}`]:true,
            'fa-check':snackBar.status === 'success',
            'fa-question-circle ':snackBar.status === 'info',
            'a-exclamation-triangle':snackBar.status === 'warning',
            'fa-exclamation-triangle':snackBar.status === 'danger',
            }"></span>
        </div>
        <div class="col-10 px-1  toastNotification--message" :class="`text-${snackBar.status}`"> {{snackBar.message}}</div>
        <div
          class="col text-center ">
          <p-button @click.native="hideSnackBar" icon link round
                    size="sm"><span class="nc-icon nc-simple-remove text-white"></span></p-button>
        </div>
      </div>
    </div>
  </collapse-transition>
</template>
<script>
  import CollapseTransition from "vue2-transitions/src/Collapse/CollapseTransition";
  import SlideYDownTransition from "vue2-transitions/src/Slide/SlideYDownTransition";
  import {GETTER_TOAST_MESSAGE, HIDE_TOAST_MESSAGE} from "../../../store/types";
  import PButton from "../Button";
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "ToastNotification"
    ,
    components: {CollapseTransition, SlideYDownTransition, PButton},
     computed: {
      ...mapGetters({snackBar:GETTER_TOAST_MESSAGE})
    }
    , methods: {
      ...mapActions({hideSnackBar: HIDE_TOAST_MESSAGE})

    }
  }
</script>
<style scoped>
  .toastNotification__wrapper {
    z-index: 9999999;
    position: fixed;
    width: 80%;
    max-width:600px;
    left: 50%;
    top: 2rem;
    transform: translate3d(-50%,0,0);
    height: auto;
    background-color: #1B1B1B;
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2),0px 16px 24px 2px rgba(0, 0, 0, 0.14),0px 6px 30px 5px rgba(0, 0, 0, 0.12);
    border-radius: .4rem;
  }
  .toastNotification--message{
    font-size:14px;
  }
  .toastNotification__iconwrapper{
    width: 40px;
    font-weight: bold;
  }
</style>
