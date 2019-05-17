import Vue from 'vue';
import i18n from '@/i18n'
import {handleEmptyValues} from "../../utils/hanldeEmptyValues";
import {
  ADD_CARD_PROGRAM,
  ADD_RESELLER_SUBSCRIPTION,
  EDIT_RESELLER_SUBSCRTION_BY_ID,
  GET_ALL_RESELLER_SUBSCRIPTIONS, GET_ALL_RESELLER_SUBSCRIPTIONS_LIST, GET_INVOICES_BY_SELLERID,
  GET_RESELLER_SUBSCRTION_BY_ID, GETTER_INVOICES_BY_SELLERID, GETTER_LOADINGSTATE_RESELLER,
  GETTER_RESELLER_SUBSCRIPTION,
  GETTER_RESELLER_SUBSCRIPTIONS, GETTER_RESELLER_SUBSCRIPTIONS_LIST,
  MUTATE_ADD_RESELLER_SUBSCRIPTION,
  MUTATE_EDIT_RESELLER_SUBSCRTION_BY_ID,
  MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS, MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS_LIST,
  MUTATE_GET_RESELLER_SUBSCRTION_BY_ID, MUTATE_INVOICES_BY_SELLERID, MUTATE_LOADINGSTATE_RESELLER, SHOW_TOAST_MESSAGE, UPDATE_RESPONSE_STATE
} from '../types';

/*
const convertRequestData = (data) => {
  let converted = data
  // load fee config
  converted.loadFee = data.loadFee === '' ? null : data.loadFee
  converted.loadFeeCap = data.loadFeeCap === '' ? null : data.loadFeeCap
  converted.loadFeePct = data.loadFeePct === '' ? null : data.loadFeePct
  converted.loadFeebillMethod = data.loadFeebillMethod === '' ? null : data.loadFeebillMethod

  // api fee config
  converted.apiFee = data.apiFee === '' ? null : data.apiFee
  converted.apiFeeBillMethod = data.apiFeeBillMethod === '' ? null : data.apiFeeBillMethod

  // app fee config
  converted.appFee = data.appFee === '' ? null : data.appFee
  converted.appFeeBillMethod = data.appFeeBillMethod === '' ? null : data.appFeeBillMethod

  // monthly fee config
  converted.monthlyFee = data.monthlyFee === '' ? null : data.monthlyFee
  converted.monthlyFeeBillMethod = data.monthlyFeeBillMethod === '' ? null : data.monthlyFeeBillMethod

  return converted
}
*/

const state = {
  resellerSubscriptions: [],
  resellerSubscriptionsList: {
    resellerSubscriptionList: [],
    pageMeta: {
      links: [],
      numberOfPageElements: 0,
      perPage: 0,
      totalPages: 0
    }
  },
  resellerSubscription: null,
  invoices: [],
  loadingSate: 'ideal'
};
const mutations = {
  [MUTATE_ADD_RESELLER_SUBSCRIPTION]: (state, {data}) => {
    state.resellerSubscriptions = [...state.resellerSubscriptions, data];
  },
  [MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS]: (state, {data}) => {
    state.resellerSubscriptions = data;
  }, [MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS_LIST]: (state, {data}) => {
    state.resellerSubscriptionsList = data;
  },
  [MUTATE_GET_RESELLER_SUBSCRTION_BY_ID]: (state, {data}) => {
    state.resellerSubscription = data;
  },
  [MUTATE_EDIT_RESELLER_SUBSCRTION_BY_ID]: (state, {data, id}) => {
    state.resellerSubscriptions = state.resellerSubscriptions.map(
      resellerSubscription =>
        resellerSubscription.id === id ? data : resellerSubscription
    );
  },
  [MUTATE_LOADINGSTATE_RESELLER]: (state, loadingState) => state.loadingSate = loadingState,
  [MUTATE_INVOICES_BY_SELLERID]: (state, {data}) => state.invoices = data
};
const actions = {
  [ADD_RESELLER_SUBSCRIPTION]: async ({commit, dispatch}, {body}) => {
    try {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'sending')
      const response = await Vue.prototype.$http.post(
        '/reseller-subscriptions',
        {
          ...handleEmptyValues({...body})
        }
      );

      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_RESELLER_SUBSCRIPTION, status: {state: true, error: null}})
      return true
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      console.log(e.response);
      dispatch(SHOW_TOAST_MESSAGE, {message: e.response.data.detail || i18n.t('store.reseller.error_create_reseller'), status: 'danger'})
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_RESELLER_SUBSCRIPTION, status: {state: false, error: null}})
      return false
    }
  },
  [GET_ALL_RESELLER_SUBSCRIPTIONS]: async ({commit, dispatch}) => {
    try {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'getting')

      const {data} = await Vue.prototype.$http.get(
        `/reseller-subscriptions/all`
      );

      commit(MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS, {data});
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')

    } catch (e) {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.reseller.error_load_resellers'), status: 'danger'})

    }
  },
  [GET_ALL_RESELLER_SUBSCRIPTIONS_LIST]: async ({commit, dispatch}, {
    page,
    perPage,
    resellerCode = null
  } = {page: 0, perPage: 20}) => {
    try {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'getting')
      let requestStr = `/reseller-subscriptions/list?page=${page}&per_page=${perPage}`
      if (resellerCode) {
        requestStr += `&reseller_code=${resellerCode}`
      }
      requestStr.replace(/ /g, '')
      
      let {data} = await Vue.prototype.$http.get(requestStr);

      data = {
        ...data,
        resellerSubscriptionList: data.resellerSubscriptionList || [],
        pageMeta: data.pageMeta || {
          links: [],
          numberOfPageElements: 0,
          perPage: 0,
          totalPages: 0
        }
      }
      commit(MUTATE_GET_ALL_RESELLER_SUBSCRIPTIONS_LIST, {data});
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')

    } catch (e) {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.reseller.error_load_resellers'), status: 'danger'})

    }
  },
  [GET_RESELLER_SUBSCRTION_BY_ID]: async (
    {commit, dispatch},
    resellerSubscriptionId
  ) => {
    try {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'getting')

      const {data} = await Vue.prototype.$http.get(
        `/reseller-subscriptions/${resellerSubscriptionId}`
      );
      commit(MUTATE_GET_RESELLER_SUBSCRTION_BY_ID, {data});
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')

    } catch (e) {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.reseller.error_load_reseller_entity'), status: 'danger'})

    }
  },
  [EDIT_RESELLER_SUBSCRTION_BY_ID]: async (
    {commit, dispatch},
    {body, id: resellerSubscriptionId},
  ) => {
    try {
      console.log(body, resellerSubscriptionId);
      commit(MUTATE_LOADINGSTATE_RESELLER, 'sending')
      const {data} = await Vue.prototype.$http.put(`/reseller-subscriptions/${resellerSubscriptionId}`, {
        ...handleEmptyValues(body)
      });
/*
      commit(MUTATE_EDIT_RESELLER_SUBSCRTION_BY_ID, {body, id: resellerSubscriptionId});*/
      /*
            dispatch(SHOW_TOAST_MESSAGE, {message: 'Edited reseller successfully ', status: 'success'})*/
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_RESELLER_SUBSCRIPTION, status: {state: true, error: null}})

    } catch (e) {
      console.log(e);
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_RESELLER_SUBSCRIPTION, status: {state: false, error: null}})
      const message = e.response.data.detail
      dispatch(SHOW_TOAST_MESSAGE, {message: message && message.length > 0 ? message : i18n.t('store.reseller.error_edit_reseller_entity'), status: 'danger'})

    }
  },
  [GET_INVOICES_BY_SELLERID]: async ({commit, dispatch}, {cardProgramCode,page,perPage,currencyCode, resellerCode, fromDate, toDate}) => {
    try {
      commit(MUTATE_LOADINGSTATE_RESELLER, 'getting_invoices')
      const {data} = await Vue.prototype.$http.get(`/invoices?
      card_program_code=${cardProgramCode}
      &currency_code=${currencyCode}
      &from_date=${fromDate}
      &page=${page}
      &per_page=${perPage}
      &reseller_code=${resellerCode}
      &to_date=${toDate}`.replace(/ /g, ''));
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
      commit(MUTATE_INVOICES_BY_SELLERID, {data})
    } catch (e) {
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.reseller.error_load_invoices'), status: 'danger'})
      commit(MUTATE_LOADINGSTATE_RESELLER, 'ideal')
    }
  }
};
const getters = {
  [GETTER_RESELLER_SUBSCRIPTION]: state => state.resellerSubscription,
  [GETTER_RESELLER_SUBSCRIPTIONS]: state => state.resellerSubscriptions,
  [GETTER_RESELLER_SUBSCRIPTIONS_LIST]: state => state.resellerSubscriptionsList,
  [GETTER_LOADINGSTATE_RESELLER]: state => state.loadingSate,
  [GETTER_INVOICES_BY_SELLERID]: state => state.invoices,
};

const reseller = {
  state,
  actions,
  getters,
  mutations
};
export default reseller;
