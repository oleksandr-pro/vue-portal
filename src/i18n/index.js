import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './lang/en/index'
import cn from './lang/cn/index'

Vue.use(VueI18n)

const LOCAL_STORAGE__LOCAL_VALUE = 'local'

const setlocalFromStorage = (val) => {
  window.localStorage.setItem(LOCAL_STORAGE__LOCAL_VALUE, val)
}

const getlocalInStorage = () => {
  if (!window.localStorage.getItem(LOCAL_STORAGE__LOCAL_VALUE)) {
    setlocalFromStorage('en')
  }
  return window.localStorage.getItem(LOCAL_STORAGE__LOCAL_VALUE)
} 

const i18n = new VueI18n({
  locale: getlocalInStorage(),
  messages: {
    en,
    cn
  }
})



export default i18n