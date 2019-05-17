import Vue from 'vue';
import {
  GETTER_All_CLIENTS,
  GETTER_All_CLIENTS_LIST, MUTATE_ALL_CARD_PROGRAM_LIST,
  MUTATE_All_CLIENTS,
  MUTATE_ALL_CLIENTS_LIST,
  MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS_LIST,
  MUTATE_LOADINGSTATE_CARD_PROGRAM, SHOW_TOAST_MESSAGE
} from '../types';

const state = {
  allClients: [],
  allClientsList: {
    clients: [

    ],
    pageMeta: {
      links: [],
      numberOfPageElements: 0,
      perPage: 0,
      totalPages: 0
    }
  }
}

const mutations = {
  [MUTATE_All_CLIENTS]: (state, {data}) => {
    state.allClients = data
  }, [MUTATE_ALL_CLIENTS_LIST]: (state, {data}) => {
    state.allClientsList = data
  }
}

const actions = {

  [GETTER_All_CLIENTS_LIST]: async ({commit, dispatch}, {
    page,
    perPage
  } = {page: 0, perPage: 20}) => {
    try {
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'getting')

      // let {data} = await Vue.prototype.$http.get(`/clients/list?
      // page=${page}
      // &per_page=${perPage}`.replace(/ /g, ''))
      let clients = [];
      for (let i=0; i<10; i++) {
        let client = {
          date: '-HH-MM',
          kyc_received: 'YYYY-MM-HH-MM',
          days: 5,
          name: 'Lond Breed',
          app_ref: 'REF',
          client_ref: 'REF',
          app_status: 'KYC Processing',
          id_key: 'Pass',
          poa:'unverified',
          screen:'No Hit',
        };
        clients.push(client);
      }
      let data = {
        clients
      }
      data = {
        ...data,
        clients: data.clients || [],
        pageMeta: data.pageMeta || {
          links: [],
          numberOfPageElements: 0,
          perPage: 0,
          totalPages: 0
        }
      }
      commit(MUTATE_ALL_CLIENTS_LIST, {data})
      commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
    } catch (e) {
      // commit(MUTATE_LOADINGSTATE_CARD_PROGRAM, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.card_program.error_load_card_program'), status: 'danger'})

    }
  },
}
const getters = {
  [GETTER_All_CLIENTS]: state => state.allClients,
  [GETTER_All_CLIENTS_LIST]: state => state.allClientsList
}

const kyc = {
  state,
  actions,
  getters,
  mutations
}
export default kyc
