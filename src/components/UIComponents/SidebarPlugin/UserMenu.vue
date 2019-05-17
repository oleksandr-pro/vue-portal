<template>
  <div class="user">
    <!--
    <div class="photo">
      <img src="/static/img/faces/face-2.jpg">
    </div>
    -->
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click="toggleMenu" href="#">
        <span class="alignFullName">
          {{userName}}
          <!--<b class="caret"></b>-->
        </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <collapse-transition>
          <ul class="nav nav-menu" v-show="!isClosed">
            <!-- <li>
              <a href="#">
                <span class="sidebar-mini-icon">Mp</span>
                <span class="sidebar-normal">My Profile</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="sidebar-mini-icon">Ep</span>
                <span class="sidebar-normal">Edit Profile</span>
              </a>
            </li>-->
            <li>
              <a @click.prevent="doLogout">
                <span class="sidebar-mini-icon">L</span>
                <span class="sidebar-normal">{{ $t('common.user_menu.logout') }}</span>
              </a>
            </li>
          </ul>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
  import {CollapseTransition} from "vue2-transitions";

  export default {
    components: {
      CollapseTransition
    },
    data() {
      return {
        isClosed: true
      };
    }, computed: {
      userName() {
        return this.$oAuth.getUserInfo().fullName
      }
    },
    methods: {
      toggleMenu(e) {
        e.preventDefault();
        // this.isClosed = !this.isClosed;
      },
      doLogout() {
        void 0
        /*   this.$oAuth
             .logout()
             .then(isSuccess => {
               this.$router.push({ path: "/login" });
             })
             .catch(e => {
               console.error(e.message);
             });*/
      }
    }
  };
</script>
<style scoped>
  .nav.nav-menu {
    margin-top: 0;
  }
  .alignFullName {
    text-align: center
  }
</style>
