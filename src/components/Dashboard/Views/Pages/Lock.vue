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
              <h3 class="header text-center  font-weight-bold ">{{ $t('lock.title') }}</h3>
            </header>
            <custom-alert ref="customAlertRef"></custom-alert>
            <h4 class="card-title">{{$route.query.fullName}}</h4>
            <fg-input v-model="password" type="password" :placeholder="$t('lock.placeholder.password')"></fg-input>
            <div class="text-center py-4">
              <p-button slot="footer" type="success" round block class="mb-3 w-75 m-auto"
                        @click="doUnlock"
              >
                <span class="ceevo__sing-intext">{{ $t('lock.button.unlock') }}</span></p-button>
            </div>
          </card>
          <div>
            <div class="ceevo__create-account">
              <p> {{ $t('lock.another_user') }}
                <router-link class="ceevo__link-green" to="/login">{{ $t('lock.link.login') }}</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer class="d-flex  justify-content-center">
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('lock.link.privacy_policy') }}</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('lock.link.contact') }}</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">{{ $t('lock.link.ceevo') }}</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
  import AppNavbar from './Layout/AppNavbar'
  import AppFooter from './Layout/AppFooter'
  import CustomAlert from '@/components/UIComponents/Alert/Index'
  import { Card, Button, FgInput } from 'src/components/UIComponents';

  export default {
    data () {
      return {
        password: ''
      }
    },
    components: {
      Card,
      AppNavbar,
      AppFooter,
      FgInput,
      [Button.name]: Button,
      CustomAlert
    },
    methods: {
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      },
      doUnlock () {
        this.$refs.customAlertRef.hide()
        if (this.password.trim() !== '') {
          this.$oAuth.login(this.$route.query.preferredUsername, this.password).then(isAuthenticated => {
            if (isAuthenticated) {
              this.$router.push({path: this.$route.query.redirect})
            } else {
              this.$refs.customAlertRef.show(this.$t('lock.message.error_unlock_fail'))
            }
          })
        } else {
          this.$refs.customAlertRef.show(this.$t('lock.message.error_required_password'))
        }
      }
    },mounted(){
      // console.log('mounted');
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
</script>
<style>
</style>
