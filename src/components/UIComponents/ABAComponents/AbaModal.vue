<template>
  <transition name="fade" mode="out-in">
    <div class="aba__model" v-if="modalData.type" @click="handleDismiss">
      <zoom-center-transition>
        <div class="aba__model-body d-flex flex-column p-2"
             :class="{
             wobble:tryingToDismiss && valid !== '' && touched,
             bounceIn:tryingToDismiss&& !(valid !== '' && touched)
             }"
             @click.stop="void 0"
             v-if="modalData.type">
          <div class="h-100 d-flex align-items-center flex-wrap">
            <div class="w-100">
              <h6 class="font-weight-bold text-center p-2 "><label for="reson">
                {{modalData.message}}
              </label></h6>
              <!--  <p class="px-3 text-center" v-if="modalData.copy">{{modalData.copy}}</p>-->
            </div>
            <div class="w-100" v-if="modalData.type === 'withTextarea'">
              <div class="form-group">
                <textarea v-model="reason" id="reson"
                          @blur="handleTouched"
                          :placeholder="$t('aba_modal.reason')"
                          :class="{
                          ['border-danger']:valid !== '' && touched
                          }"
                          class="form-control h-100 aba__model-textarea"></textarea>
              </div>
              <div class="text-danger aba_modal-error">
                <CollapseTransition>
                  <div v-if="valid !== '' && touched">{{ $t('aba_modal.required_reason') }}</div>
                </CollapseTransition>
              </div>
            </div>
          </div>
          <div class="text-center mt-auto">
            <p-button round type="success" @click.native="handleMainAction">{{modalData.mainButton || $t('aba_modal.button.confirm')}}</p-button>
            <span class="p-1"></span>
            <p-button round @click.native="handleSecondaryAction" v-if="modalData.secondaryButton">{{modalData.secondaryButton || $t('aba_modal.button.cancel')}}</p-button>
          </div>
        </div>
      </zoom-center-transition>
    </div>
  </transition>
</template>
<script>
  import CollapseTransition from "vue2-transitions/src/Collapse/CollapseTransition";
  import SlideYDownTransition from "vue2-transitions/src/Slide/SlideYDownTransition";
  import SlideYUpTransition from "vue2-transitions/src/Slide/SlideYUpTransition";
  import ZoomCenterTransition from "vue2-transitions/src/Zoom/ZoomCenterTransition";
  import {GETTER_MODAL_TYPE, SET_MODAL_TYPE} from "../../../store/types";
  import {limitedCharNumber} from "../../../utils/formValidations";
  import PButton from "../Button";
  import {mapGetters, mapActions} from 'vuex';
  import {AbaModalEvents} from '../../../main.js';

  export default {
    name: "AbaModal",
    components: {ZoomCenterTransition, SlideYUpTransition, SlideYDownTransition, CollapseTransition, PButton},
    data() {
      return {
        reason: '',
        touched: false,
        tryingToDismiss: false,
      }
    },
    computed: {
      ...mapGetters({modalData: GETTER_MODAL_TYPE}),
      valid() {
        return this.modalData.type === 'withTextarea' ?
          limitedCharNumber(1, 80)(this.reason)
          : ''
      }
    }, methods: {
      ...mapActions({hideModal: SET_MODAL_TYPE}),
      handleMainAction() {
        const key = this.modalData.key;
        if (this.touched) {
          this.handleDismiss();
        } else {
          this.touched = true;

        }
        if (this.valid !== '') return;
        const payload = this.modalData.type === 'withTextarea' ? {
          message: this.reason,
          ok: true
        } : {ok: true}
        if (!key) return console.error('aba faliure no key provided');
        AbaModalEvents.$emit(key, payload);
        AbaModalEvents.$off(key);
        this.hideModal({type: null})

      },
      handleSecondaryAction() {
        const key = this.modalData.key;

        if (!key) return console.error('aba faliure no key provided');
        AbaModalEvents.$emit(key, {ok: false})
        this.hideModal({type: null})
      }, handleTouched() {
        if (!this.touched) this.touched = true
      }, handleDismiss() {
        if (this.tryingToDismiss) return;
        this.tryingToDismiss = true;
        setTimeout(_ => this.tryingToDismiss = false, 760)
      }
    }, watch: {
      modalData(newVal, oldVal) {
        this.touched = false;
        this.reason = '';
      }
    }
  }
</script>
<style scoped>
  .aba__model {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 9090;
    background-color: rgba(0, 0, 0, .2);
  }

  .aba__model-body {
    width: 350px;
    height: 220px;
    background-color: #fff;
    border-radius: .4rem;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, .5);
  }

  .aba__model-textarea {
    height: 100%;
  }

  .aba_modal-error {
    font-size: 12px;
    text-align: center;
    height: 15px;
  }

  @keyframes wobble {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    15% {
      -webkit-transform: translate3d(-10%, 0, 0) rotate3d(0, 0, 1, -5deg);
      transform: translate3d(-10%, 0, 0) rotate3d(0, 0, 1, -5deg);
    }

    30% {
      -webkit-transform: translate3d(8%, 0, 0) rotate3d(0, 0, 1, 3deg);
      transform: translate3d(8%, 0, 0) rotate3d(0, 0, 1, 3deg);
    }

    45% {
      -webkit-transform: translate3d(-9%, 0, 0) rotate3d(0, 0, 1, -3deg);
      transform: translate3d(-9%, 0, 0) rotate3d(0, 0, 1, -3deg);
    }

    60% {
      -webkit-transform: translate3d(4%, 0, 0) rotate3d(0, 0, 1, 2deg);
      transform: translate3d(4%, 0, 0) rotate3d(0, 0, 1, 2deg);
    }

    75% {
      -webkit-transform: translate3d(-1%, 0, 0) rotate3d(0, 0, 1, -1deg);
      transform: translate3d(-1%, 0, 0) rotate3d(0, 0, 1, -1deg);
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .wobble {
    -webkit-animation-duration: 0.75s;
    animation-duration: 0.75s;
    -webkit-animation-name: wobble;
    animation-name: wobble;
  }

  @keyframes bounceIn {
    from,
    20%,
    40%,
    60%,
    80%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      -webkit-transform: scale3d(0.8, 0.8, 0.8);
      transform: scale3d(0.8, 0.8, 0.8);
    }

    20% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1);
      transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
      -webkit-transform: scale3d(0.9, 0.9, 0.9);
      transform: scale3d(0.9, 0.9, 0.9);
    }

    60% {

      -webkit-transform: scale3d(1.03, 1.03, 1.03);
      transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
      -webkit-transform: scale3d(0.97, 0.97, 0.97);
      transform: scale3d(0.97, 0.97, 0.97);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .bounceIn {
    -webkit-animation-duration: 0.75s;
    animation-duration: 0.75s;
    -webkit-animation-name: bounceIn;
    animation-name: bounceIn;
  }
</style>
