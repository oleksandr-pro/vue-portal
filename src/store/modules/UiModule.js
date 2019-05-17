import {
  GET_SUPPORTED_CURRENCIES,
  GETTER_AUTH_SATATE, GETTER_MODAL_TYPE, GETTER_SUPPORTED_CURRENCIES,
  GETTER_TOAST_MESSAGE,
  HIDE_TOAST_MESSAGE, MUTATE_AUTH_SATATE, MUTATE_MODAL_TYPE,
  /*  MUTATE_RESPONSESTATE_CARD_PROGRAM,*/
  MUTATE_RESPONSESTATE_STATE, MUTATE_SUPPORTED_CURRENCIES,
  MUTATE_TOAST_MESSAGE, SET_AUTH_SATATE, SET_MODAL_TYPE,
  SHOW_TOAST_MESSAGE, UPDATE_RESPONSE_STATE
} from "../types";
import Vue from 'vue';

const state = {
  snackBar: {
    message: 'edited',
    visible: false,
    status: 'success',
    user: ''
  },
  timeOut: null,
  responseState: {},
  loggedIn: true, // disable re-login popup
  modal: {
    type: null,
    message: '',
    copy: '',
    mainButton: '',
    secondaryButton: '',
    key: ''
  },
  supportedCurrencies: []
}

const actions = {
  [SHOW_TOAST_MESSAGE]: ({commit, dispatch}, {status, message}) => {
    console.log('called');
    commit(MUTATE_TOAST_MESSAGE, {
      message,
      status,
      visible: true
    })
    if (state.timeOut) {
      window.clearTimeout(state.timeOut)
    }
    state.timeOut = setTimeout(_ => {
      state.timeOut = null;
      dispatch(HIDE_TOAST_MESSAGE)
    }, 5000)
  }, [HIDE_TOAST_MESSAGE]: ({commit}) => {
    commit(MUTATE_TOAST_MESSAGE, {
      ...state.snackBar,
      visible: false
    })
  },
  [UPDATE_RESPONSE_STATE]: ({commit}, {key, status}) => commit(MUTATE_RESPONSESTATE_STATE, {key, status}),
  [SET_AUTH_SATATE]: ({commit}, loginSate) => commit(MUTATE_AUTH_SATATE, loginSate),
  [SET_MODAL_TYPE]: ({commit}, payload) => commit(MUTATE_MODAL_TYPE, payload),
  [GET_SUPPORTED_CURRENCIES]: async ({commit}) => {
    try {
      const {data} = await Vue.prototype.$http.get('https://api.dev.transact24.com/mcmaster-api/v1/api/currencies/all')
      console.log(data);
      commit(MUTATE_SUPPORTED_CURRENCIES, data)
    } catch (e) {
      console.log(e.response, 'There was an error retrieving the currencies requested, please try again. If the problem persists please contact technical support');
    }
  }
}
const mutations = {
  [MUTATE_TOAST_MESSAGE]: (state, payload) => {
    return state.snackBar = payload;
  }, [MUTATE_RESPONSESTATE_STATE]: (state, {key, status}) => {
    console.log(state, '[state]');
    state.responseState = {
      ...state.responseState,
      [key]: {
        state: status.state, // true =.> susccess
        timeStamp: Date.now(),
        error: status.error
      }


    }
  },
  [MUTATE_AUTH_SATATE]: (state, val) => state.loggedIn = val,
  [MUTATE_MODAL_TYPE]: (state, payload) => {
    if (payload.type === null) return state.modal = {
      type: null,
      message: '',
      copy: '',
      mainButton: '',
      secondaryButton: '',
      key: ''
    }
    return state.modal = payload;
  },
  [MUTATE_SUPPORTED_CURRENCIES]: (state, data) => {
    console.log(data, `form asdfksadjf`);
    return state.supportedCurrencies = data;
  }
}
const getters = {
  [GETTER_TOAST_MESSAGE]: state => state.snackBar,
  [GETTER_AUTH_SATATE]: state => state.loggedIn,
  [GETTER_MODAL_TYPE]: state => state.modal,
  [GETTER_SUPPORTED_CURRENCIES]: state => state.supportedCurrencies
}

const UiModule = {
  state,
  actions,
  getters,
  mutations
}
export default UiModule
