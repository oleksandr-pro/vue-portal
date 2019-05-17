<template>
  <div class="login-page"
  >
    <div class="container ">
      <div class="row justify-content-center" style="
         height: calc(100vh - 60px);
      ">
        <div class="col-md-6 d-flex flex-column justify-content-center  align-items-center">
          <div class="text-center">
            <h2> Page Not Found!</h2>
           <h3> <router-link class="ceevo__link-green" to="/">Go Home</router-link></h3>

          </div>
        </div>
      </div>
      <footer class="d-flex  justify-content-center">
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">Privacy Policy٠</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">Contact</router-link>
        </div>
        <div class="ceevo__footer-link-warpper">

          <router-link class="ceevo__link-footer" to="/">CEEVO</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
  import {Card, Checkbox, Button, InfoSection} from 'src/components/UIComponents';
  import AppNavbar from './../Dashboard/Views/Pages/Layout/AppNavbar'
  import AppFooter from './../Dashboard/Views/Pages/Layout/AppFooter'
  export default {
    components: {
      Card,
      AppNavbar,
      AppFooter,
      InfoSection,
      [Checkbox.name]: Checkbox,
      [Button.name]: Button
    },
    methods: {
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      }
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
</script>
<style>

  .triangle {
    position: relative;
    background-color: #fff;
    text-align: left;
    box-shadow: 0 10px 40px rgba(41, 41, 41, 0.3);
  }
  .triangle:before,
  .triangle:after {
    content: '';
    position: absolute;
    background-color: inherit;
  }
  .triangle,
  .triangle:before,
  .triangle:after {
    width:  15em;
    height: 15em;
    border-top-right-radius: 30%;
  }

  .triangle {
    transform: rotate(-60deg) skewX(-30deg) scale(1,.866);
  }
  .triangle:before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%);
  }
  .triangle:after {
    transform: rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%);
  }
</style>
