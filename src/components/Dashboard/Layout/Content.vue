<template>
  <div class="content">
    <transition name="fade" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </transition>
    <transition name="fade" mode="out-in">
      <div class="loginWrapper d-flex justify-content-center align-items-center" v-if="!authState">
        <div class="bg-white p-5  loginCard">
          <h3 slot="header" class="header text-center">Login</h3>
          <div v-if="errorAlert.isDisplay" class="alert alert-danger">
            <button type="button" class="close" @click="hideErrorAlert">×</button>
            <span><b>{{ errorAlert.message }}</b></span>
          </div>
          <form @submit.prevent="doLogin">
            <fg-input v-model="form.email" addon-left-icon="nc-icon nc-single-02" placeholder="Email.."></fg-input>
            <fg-input v-model="form.password" addon-left-icon="nc-icon nc-key-25" placeholder="Password" type="password"></fg-input>
            <br>
            <p-button nativeType="submit" slot="footer" type="warning" round block class="mb-3">re-login</p-button>
          </form>
        </div>
      </div>
    </transition>
    <aba-modal>
    </aba-modal>
  </div>
</template>
<script>
  import {Card, Checkbox, Button} from 'src/components/UIComponents';
  import {GETTER_AUTH_SATATE} from "../../../store/types";
  import {mapGetters} from 'vuex'
  import AbaModal from "../../UIComponents/ABAComponents/AbaModal";

  export default {
    components: {AbaModal},
    component: {
      Card,
      [Checkbox.name]: Checkbox,
      [Button.name]: Button
    },
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        errorAlert: {
          isDisplay: false,
          message: ''
        }
      }
    }, computed: {
      ...mapGetters({
        authState: GETTER_AUTH_SATATE
      })
    }, methods: {
      doLogin() {
        this.hideErrorAlert()
        if (this.form.email.trim() !== '' && this.form.password.trim() !== '') {
          this.$oAuth.login(this.form.email, this.form.password).then(isAuthenticated => {
            if (isAuthenticated) {
              this.$store.state.UiModule.user = this.form.email;

            } else {
              this.showErrorAlert('The system has failed to log you in, please ensure your Email and Password are correct and try again. If the problem persists please contact technical support.')
            }
          })
        } else {
          this.showErrorAlert('Please enter your Email and Password in the corresponding fields to log in. ')
        }
      },
      hideErrorAlert() {
        this.errorAlert.isDisplay = false
        this.errorAlert.message = ''
      },
      showErrorAlert(message) {
        this.errorAlert.isDisplay = true
        this.errorAlert.message = message
      },
    }
  }
</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .15s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }

  .loginWrapper {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .6);
  }

  .loginCard {
    border-radius: .4rem;
    background-color: #fff !important;
  }
</style>
