import '@babel/polyfill'
import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'
import initProgress from './progressbar';
// import Tooltip from 'vue-directive-tooltip';
// router setup
import routes from './routes/routes'

// library imports
import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'
//  plugins import
import axiosWrapper from './plugins/axios'
import oAuthWrapper from './plugins/oAuth'
import sidebarLinks from './sidebarLinks'

// configs
import axiosConfig from './config/axios.config'
import oAuthConfig from './config/oAuth.config'

import {store} from './store/store.js'
import {Tooltip} from 'element-ui'
import {GET_SUPPORTED_CURRENCIES} from "./store/types";
import i18n from './i18n'
import permission from '@/constants/permission'

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)
Vue.use(Tooltip)
Vue.use(oAuthWrapper, oAuthConfig)
Vue.use(axiosWrapper, axiosConfig)

// config lang
locale.use(lang)

// configure router
export const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history',
  linkActiveClass: 'active'
})

router.beforeEach(async (to, from, next) => {
  const isAuth = await Vue.prototype.$oAuth.isAuthenticated()
  const nextToByRole = () => {
    if (Vue.prototype.$oAuth.isNoPermissionForAll()) {
      return '/system'
    } else if (Vue.prototype.$oAuth.isReseller()) {
      return '/reseller'
    } else {
      return '/card-program'
    }
  }

  const isAbleAccess = (object) => {
    let has = Vue.prototype.$oAuth.hasPermission(to.meta.permission)
    if (!has && (object.name === 'Resellers Editor' || object.name === 'Edit card program')) {
      if (!object.query.edit && Vue.prototype.$oAuth.hasPermission(permission.RESELLER_SUBSCRIPTION_VIEW)) {
        has = true
      }
    }
    return has
  }

  const defaultTo = nextToByRole()
  if (!isAuth) {
    if (to.path !== '/login' && to.path !== '/lock') {
      next('/login')
    } else {
      next()
    }
  } else {
    if (to.path === '/login' || to.path === '/lock') {
      next(defaultTo)
    } else {
      if (to.meta.permission && !isAbleAccess(to)) {
        next(defaultTo)
      } else {
        next()
      }
    }
  }
})

initProgress(router);

/* eslint-disable no-new */
export const AbaModalEvents = new Vue()

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router,
  i18n
})

