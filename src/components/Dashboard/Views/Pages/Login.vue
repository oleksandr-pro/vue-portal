<template>
  <div class="login-page"
  >
    <div class="container ">
      <div class="row justify-content-center" style="
         height: calc(100vh - 60px);
      ">
        <div class="col-md-6 d-flex flex-column justify-content-center  align-items-center">
          <card type="login" class="ceevo__login-card w-100">
            <header slot="header" class="loginheader">
              <img class="img-fluid ceevo__login-logo" src="../../../../../public/static/img/CEEVO_logo_colored_big.svg"/>
              <h3 class="header text-center  font-weight-bold ">{{ $t('login.welcome') }}</h3>
              <div style="text-align: center;">{{ $t('login.tips') }}</div>
            </header>
            <div v-if="errorAlert.isDisplay" class="alert alert-danger">
              <button type="button" class="close" @click="hideErrorAlert">×</button>
              <span><b>{{ errorAlert.message }}</b></span>
            </div>
            <form @submit.prevent="doLogin">
              <fg-input v-model="form.email" :placeholder="$t('login.placeholder.username')"></fg-input>
              <fg-input v-model="form.password" :placeholder="$t('login.placeholder.password')" type="password"></fg-input>
              <div class="d-flex ceevo__login-tools">
                <p-checkbox>
                  <span class="ceevo__login-rememberme">{{ $t('login.remember_me') }}</span>
                </p-checkbox>
                <div class="ml-auto">
                  <router-link class="ceevo__link-green" to="/">{{ $t('login.forgot_password') }}</router-link>
                </div>
              </div>
              <div class="text-center py-4">
                <p-button nativeType="submit" slot="footer" type="success" round block class="mb-3 w-75 m-auto">
                  <span class="ceevo__sing-intext">{{ $t('login.sign_in') }}</span></p-button>
              </div>
            </form>
          </card>
          <div>
            <div class="ceevo__create-account">
              <p>{{ $t('login.sign_up_tips') }}
                <router-link class="ceevo__link-green" to="/">{{ $t('login.sign_up') }}</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer class="d-flex  justify-content-center">
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('login.privacy_policy') }}</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('login.contact') }}</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('login.ceevo') }}</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
  import {Card, Checkbox, Button} from 'src/components/UIComponents';
  import PCheckbox from "../../../UIComponents/Inputs/Checkbox";
  import AppNavbar from './Layout/AppNavbar'
  import AppFooter from './Layout/AppFooter'

  export default {
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
    },
    components: {
      PCheckbox,
      Card,
      AppNavbar,
      AppFooter,
      [Checkbox.name]: Checkbox,
      [Button.name]: Button
    },
    methods: {
      toggleNavbar() {
        document.body.classList.toggle('nav-open')
      },
      doLogin() {
        this.hideErrorAlert()
        if (this.form.email.trim() !== '' && this.form.password.trim() !== '') {
          this.$oAuth.login(this.form.email, this.form.password).then(isAuthenticated => {
            if (isAuthenticated) {
              // this.oAuthFunctionExample()
              this.$store.state.UiModule.user = this.form.email;
              this.$router.push({path: '/'})
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
      closeMenu() {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      }
    },
    beforeDestroy() {
      this.closeMenu()
    }
  }
</script>
<style lang="scss">
  .ceevo__login-tools {
    margin: 1rem 0;
  }

  .login-page {
    font-family: 'Poppins', sans-serif;
    height: 100vh;
    background-image: url('../../../../../public/static/img/Group_945.svg');
    background-size: cover;

    .loginheader {
      font-weight: bold;
      font-size: .7rem;

      h3 {
        font-size: 1.2rem
      }


    }

    .ceevo__login-logo {
      width: 6rem;
      display: block;
      margin: 0 auto 1rem;

    }

    .ceevo__login-card {
      box-shadow: 0 10px 40px rgba(41, 41, 41, 0.3);
      border-radius: 1rem !important;
      padding: 1rem 2rem;
      overflow: hidden;
      margin-bottom: 3rem;
    }

    .ceevo__login-rememberme {
      color: rgba(41, 41, 41, 1);
    }

    label.form-check-label {
      line-height: unset;
    }

    .ceevo__create-account {
      border: 1px solid rgba(141, 141, 141, 1);
      border-radius: 30px;
      text-align: center;
      padding: .5rem 2rem;
      display: flex;

      p {
        font-size: .9rem;
        color: rgba(41, 41, 41, 1);
        margin: 0;
        padding: 0;
      }
    }

    .form-check-label .form-check-sign {
      &:before {
        background-color: #fff !important;
        border: 1px solid #292929;
        border-radius: 0 !important;
        width: 1rem !important;
        height: 1rem !important;
      }

      &::after {
        color: #292929 !important;
        width: 1rem !important;
        height: 1rem !important;
        font-size: .8rem !important;
        line-height: 1.3rem !important;
      }


    }

    .ceevo__link-green {
      color: #2ED684;
      text-decoration: none;

      &:hover {
        text-decoration: none !important;
        color: #2ED684;

      }
    }

    .ceevo__sing-intext {
      text-transform: capitalize;
    }
    .ceevo__footer-link-warpper{
      margin: .2rem 1rem;
      .ceevo__link-footer{
        color: #292929;
        text-decoration: none;
        font-size:.8rem;
        &:hover {
          text-decoration: none !important;
          color: #2ED684;

        }
      }
    }
    footer{
      position:fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      padding: 1rem;
      height: 60px;
    }
  }
</style>
