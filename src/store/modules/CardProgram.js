import Vue from 'vue';
import i18n from '@/i18n'
import {handleEmptyValues} from "../../utils/hanldeEmptyValues";
import {
  ADD_CARD_PROGRAM,
  EDIT_CARD_PROGRAM,
  GET_ALL_CARD_PROGRAM, GET_ALL_CARD_PROGRAM_LIST,
  GET_CARD_PROGRAM_BYID,
  GETTER_ACTIVE_CARD, GETTER_ALL_CARD_PROGRAM_LIST,
  GETTER_ALL_CARDS,
  GETTER_LOADINGSTATE_CARD_PROGRAM,
  MUTATE_ACTIVE_CARD_PROGRAME,
  MUTATE_ADD_CARD_PROGRAME, MUTATE_ALL_CARD_PROGRAM_LIST,
  MUTATE_CARD_PROGRAMES,
  MUTATE_EDIT_CARD_PROGRAME,
  MUTATE_LOADINGSTATE_CARD_PROGRAM,
  MUTATE_RESPONSESTATE_CARD_PROGRAM,
  SHOW_TOAST_MESSAGE,
  UPDATE_RESPONSE_STATE
} from '../types';

const state = {
  allCardPrograms: [],
  allCardProgramsList: {
    cardProgramList: [],
    pageMeta: {
      links: [],
      numberOfPageElements: 0,
      perPage: 0,
      totalPages: 0
    }
  },
  activeCardProgram: null,
  // for loader and on progress stuf
  loadingState: 'ideal',  // ideal sending getting
}

const mutations = {
  [MUTATE_CARD_PROGRAMES]: (state, {data}) => {
    state.allCardPrograms = data
  }, [MUTATE_ALL_CARD_PROGRAM_LIST]: (state, {data}) => {
    state.allCardProgramsList = data
  },
  [MUTATE_ACTIVE_CARD_PROGRAME]: (state, {data}) => {
    state.activeCardProgram = data
  },
  [MUTATE_EDIT_CARD_PROGRAME]: (state, {data, cardProgramId}) => {
    // update the existing card with the one returned from the api
    state.allCardPrograms.map((card) => card.id === cardProgramId
      ? data : card)
  },
  [MUTATE_ADD_CARD_PROGRAME]: (state, {data}) => {
    // add the new card
    state.allCardPrograms = [...state.allCardPrograms, data]
  },
  [MUTATE_LOADINGSTATE_CARD_PROGRAM]: (state, loadingState) => state.loadingState = loadingState,

}

const actions = {
  [ADD_CARD_PROGRAM]: async ({commit, dispatch}, {body}) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'sending')

      const {data} = await Vue.prototype.$http.post('/cardprograms',  {
        ...handleEmptyValues(body)
      })
      commit(MUTATE_ADD_CARD_PROGRAME, {data})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      /*
            dispatch(SHOW_TOAST_MESSAGE, {message: 'Add Card Successfully', status: 'success'})*/
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_CARD_PROGRAM, status: {state: true, error: null}})
      return true
    } catch (e) {
      console.log(e);
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: e.response.data.detail, status: 'danger'})
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_CARD_PROGRAM, status: {state: false, error: null}})
      return false
    }

  },
  [GET_ALL_CARD_PROGRAM]: async ({commit, dispatch}) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'getting')

      const {data} = await Vue.prototype.$http.get(`/cardprograms/all`)

      commit(MUTATE_CARD_PROGRAMES, {data})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.card_program.error_load_card_program'), status: 'danger'})

    }
  },
  [GET_ALL_CARD_PROGRAM_LIST]: async ({commit, dispatch}, {
    page,
    perPage
  } = {page: 0, perPage: 20}) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'getting')

      let {data} = await Vue.prototype.$http.get(`/cardprograms/list?
      page=${page}
      &per_page=${perPage}`.replace(/ /g, ''))
      data = {
        ...data,
        cardProgramList: data.cardProgramList || [],
        pageMeta: data.pageMeta || {
          links: [],
          numberOfPageElements: 0,
          perPage: 0,
          totalPages: 0
        }
      }
      commit(MUTATE_ALL_CARD_PROGRAM_LIST, {data})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.card_program.error_load_card_program'), status: 'danger'})

    }
  },
  [GET_CARD_PROGRAM_BYID]: async ({commit, dispatch}, programCardId) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'getting')

      const {data} = await Vue.prototype.$http.get(`/cardprograms/${programCardId}`)
      commit(MUTATE_ACTIVE_CARD_PROGRAME, {data})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')


    } catch (e) {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.card_program.error_load_card_program'), status: 'danger'})

    }
  },
  [EDIT_CARD_PROGRAM]: async ({commit, dispatch}, {body, id: cardProgramId}) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'sending')

      const {data} = await Vue.prototype.$http.put(`/cardprograms/${cardProgramId}`, {...handleEmptyValues(body)})
      commit(MUTATE_EDIT_CARD_PROGRAME, {data, cardProgramId})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')

      // dispatch(SHOW_TOAST_MESSAGE, {message: 'Edited Successfully', status: 'success'})
      dispatch(UPDATE_RESPONSE_STATE, {key: EDIT_CARD_PROGRAM, status: {state: true, error: null}})
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      const message = e.response.data.detail
      dispatch(SHOW_TOAST_MESSAGE, {message: message && message.length > 0 ? message : i18n.t('store.card_program.error_edit_card_program') , status: 'danger'})
      dispatch(UPDATE_RESPONSE_STATE, {key: EDIT_CARD_PROGRAM, status: {state: false, error: '  EDIT_CARD_PROGRAM '}})

    }
  }
}
const getters = {
  [GETTER_ALL_CARDS]: state => state.allCardPrograms,
  [GETTER_ACTIVE_CARD]: state => state.activeCardProgram,
  [GETTER_LOADINGSTATE_CARD_PROGRAM]: state => state.loadingState,
  [GETTER_ALL_CARD_PROGRAM_LIST]: state => state.allCardProgramsList
}

const cardProgram = {
  state,
  actions,
  getters,
  mutations
}
export default cardProgram
