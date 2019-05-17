import Vue from 'vue';
import i18n from '@/i18n'
//import {toDate} from "element-ui/packages/date-picker/src/util";
import {handleEmptyValues} from "../../utils/hanldeEmptyValues";
import {
  ADD_FLOAT_ENTRY, ADD_RESELLER_SUBSCRIPTION,
  ADD_SOFTDOC_TO_FLOAT,
  EDIT_FLOAT_BYFLOATID,
  GET_A_SOFTDOC_BY_FLOATID,
  GET_ACCOUNT_STATEMENT,
  GET_ALL_FLOATS,
  GET_PENDING_FLOATS_BYCARDID,
  GET_REVIEWED_FLOATS_BYCARDID, GET_UNALLOCATED_FLOAT, GET_VIEW_STATEMENT,
  GETTER_FLOATS,
  GETTER_LOADINGSTATE_FLOAT_BALANCE,
  GETTER_PENDING_FLOATS,
  GETTER_REVIEWD_FLOATS, GETTER_UNALLOCATED_FLOAT, GETTER_VIEW_STATEMENT, MUTATE_ACCOUNT_STATEMENT,
  MUTATE_ADD_FLOAT_ENTRY,
  MUTATE_ADD_SOFTDOC_TO_FLOAT,
  MUTATE_EDIT_FLOAT_BYFLOATID, MUTATE_FLOAT_ACCOUNT,
  MUTATE_GET_A_SOFTDOC_BY_FLOATID,
  MUTATE_GET_PENDING_FLOATS_BYCARDID,
  MUTATE_GET_REVIEWED_FLOATS_BYCARDID,
  MUTATE_LOADINGSTATE_FLOAT_BALANCE, MUTATE_UNALLOCATED_FLOAT, MUTATE_VIEW_STATEMENT,
  SHOW_TOAST_MESSAGE, UPDATE_RESPONSE_STATE
} from '../types';

const state = {
  // todo how to know if it is pending or reviewed
  floats: [],
  pendingFloats: [],
  reviewedFloats: [],
  loadingState: 'ideal',
  unallocatedFloat: null,
  viewStatement: {
    closingBalance: 0,
    netCharge: 0,
    openingBalance: 0,
    PageMeta: {
      link: null,
      perPage: 0,
      totalPage: 1,
      numberOfPageElements: null
    }, statementResultList: []
  }
}

const mutations = {
  // todo change to mach the new stracture
  [MUTATE_ADD_FLOAT_ENTRY]: (state, {data}) => { state.floats = [...(state.floats || []), data] },
  [MUTATE_FLOAT_ACCOUNT]: (state, {data}) => {state.floats = data},
  [MUTATE_GET_PENDING_FLOATS_BYCARDID]: (state, {data}) => {
    state.pendingFloats = data;
  },
  [MUTATE_GET_REVIEWED_FLOATS_BYCARDID]: (state, {data}) => {
    state.reviewedFloats = data;

  },
  [MUTATE_EDIT_FLOAT_BYFLOATID]: (state, {data, id}) => {
    state.floats = (state.floats || []).map(float => float.id === id ? data : data)
    // todo IDK  if it is pending or reviewed !
  },
  [MUTATE_UNALLOCATED_FLOAT]: (state, {data}) => state.unallocatedFloat = data,
  [MUTATE_LOADINGSTATE_FLOAT_BALANCE]: (state, loadingState) => state.loadingState = loadingState,
  [MUTATE_VIEW_STATEMENT]: (state, {data}) => state.viewStatement = data,

  [MUTATE_ADD_SOFTDOC_TO_FLOAT]: state => void 0,
  [MUTATE_GET_A_SOFTDOC_BY_FLOATID]: state => void 0,
}

const actions = {
  [ADD_FLOAT_ENTRY]: async ({commit, dispatch}, {body, id: cardProgramId, sofDocs = []}) => {
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'sending')
      const {data} = await Vue.prototype.$http.post(`/cardprograms/${cardProgramId}/floats`, {
        ...handleEmptyValues(body)
      })
      const {id} = data;
      console.log(sofDocs, 'uploading');

      if (sofDocs.length > 0 && id) {
        console.log('uploading');
        await Promise.all(sofDocs.map((i) => {
          i.content = i.content.split(',')[1]
          return Vue.prototype.$http.post(`/floats/${id}/sofdocs`, {...i});
        }))
      }
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.success_add_float_entity'), status: 'success'})
      // show return the float id
      dispatch(UPDATE_RESPONSE_STATE, {key: ADD_FLOAT_ENTRY, status: {state: true, error: null}})

      /*  const floatId = 'assument'

        const formData = new FormData();
        formData.append('doc', files, doc)
        await Vue.prototype.$http.post(`/floats/${floatId}/sofdocs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })*/
    } catch (e) {
      console.log(e);
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      let message = e.response.data.detail
      if (!message || message.length === 0) {
        message = i18n.t('store.float_balance.error_add_float_entity')
      }
      // console.log(message)
      dispatch(UPDATE_RESPONSE_STATE, {
        key: ADD_FLOAT_ENTRY, status: {
          state: false, error: {
            message: message
          }
        }
      })
      //
      // dispatch(SHOW_TOAST_MESSAGE, {message: e.response.data.details || 'There is an error adding the chosen amount to the float balance. Please try again and if the problem persists, contact Technical Support', status: 'danger'})
      dispatch(SHOW_TOAST_MESSAGE, {message: message, status: 'danger'})
    }
  },
  [GET_ALL_FLOATS]: async ({commit, dispatch}, {
    cardProgramCode, currencyCode,
    page = 0,
    perPage = 10,
    resellerCode,
    resellerStatus
  }) => {
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')

      const {data} = await Vue.prototype.$http.get(`/floataccounts/overview?
  ${(cardProgramCode && cardProgramCode.toLowerCase() === 'all') ? '' : `card_program_code=${cardProgramCode}&`}  
  ${(currencyCode && currencyCode.toLowerCase() === 'all') ? '' : `currency_code=${currencyCode}&`}  
    page=${page}
    &per_page=${perPage}
    ${(resellerCode && resellerCode.toLowerCase() === 'all') ? '' : `&reseller_code=${resellerCode}`}
      ${(resellerStatus && resellerStatus.toLowerCase() === 'all') ? '' : `&reseller_status=${resellerStatus}`}  
    `.replace(/ /g, ''))
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      commit(MUTATE_FLOAT_ACCOUNT, {data})

    } catch (e) {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_floats'), status: 'danger'})

    }
  },
  [GET_PENDING_FLOATS_BYCARDID]: async ({commit, dispatch}, payload) => {
    const {
      cardProgramId,
      page = 0,
      perPage = 10,

    } = payload;
    console.log(payload);
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')
      const {data} = await Vue.prototype.$http.get(
        `/cardprograms/${cardProgramId}
      /floats/pending?
      page=${page}
      &per_page=${perPage}
  
     `

          .replace(/ /g, ''))
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      commit(MUTATE_GET_PENDING_FLOATS_BYCARDID, {data})
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_floats'), status: 'danger'})

    }
  },
  [GET_REVIEWED_FLOATS_BYCARDID]: async ({commit, dispatch}, payload) => {
    const {
      cardProgramId,
      page = 0,
      perPage = 10,
      toDate,
      fromDate,
      resellerCode,
    } = payload;
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')

      const {data} = await Vue.prototype.$http.get(
        `/cardprograms/${cardProgramId}/floats/reviewed?
      page=${page}
      &per_page=${perPage}
        ${(resellerCode && resellerCode.toLowerCase() === 'all') ? '' : `&reseller_code=${resellerCode}`}
    ${!toDate ? '' : `&to_date=${toDate}`}
    ${!fromDate ? '' : `&from_date=${fromDate}`}     `
          .replace(/ /g, ''))
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')

      commit(MUTATE_GET_REVIEWED_FLOATS_BYCARDID, {data})
    } catch (e) {
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_floats'), status: 'danger'})
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')

    }
  }, [GET_ACCOUNT_STATEMENT]: async (
    {commit, dispatch},
    {cardProgramId, currencyCode, resellerId, formDate, page, perPage, toData,}
  ) => {
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')
      const {data} = await Vue.prototype.$http.get(
        `
      /cardprograms/${cardProgramId}
      /resellers/${resellerId}/statement?
      ${currencyCode ? 'currency_code=' + currencyCode : ''}
      &from_date=${formDate}
      &page=${page}
      &per_page=${perPage}
      &to_date=${toData}
      `
          .replace(/ /g, ''))
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')

      commit(MUTATE_ACCOUNT_STATEMENT, {data})
    } catch (e) {
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_floats'), status: 'danger'})
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')

    }
  }, [GET_UNALLOCATED_FLOAT]: async ({commit, dispatch}, {currencyCode, perPage, page, resellerCode, cardProgramCode, date}) => {
    //https://api.dev.transact24.com/mcbiz/v1/v1/business/floataccounts/unallocated-list?card_program_code=T24WSilver&currency_code=EUR&page=1&per_page=20&reseller_code=TCC_001&target_date=2018-12-19
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')

      let {data} = await Vue.prototype.$http.get(
        `/floataccounts/unallocated-list?
      ${(cardProgramCode && cardProgramCode.toLowerCase() === 'all') ? '' : `card_program_code=${cardProgramCode}&`}  
      ${(resellerCode && resellerCode.toLowerCase() === 'all') ? '' : `reseller_code=${resellerCode}&`}  
      &currency_code=${currencyCode}
      &page=${page}
      &per_page=${perPage}
      &target_date=${date}
      `
          .replace(/ /g, ''))
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')

      data = {
        ...data,
        unallocatedFloatResultList: data.unallocatedFloatResultList || [],
        openingBalance: data.openingBalance || 0,
        closingBalance: data.closingBalance || 0,
        netChange: data.netChange || 0,
        pageMeta: data.pageMeta || {
          links: [],
          numberOfPageElements: 0,
          perPage: 0,
          totalPages: 0
        }
      }
      commit(MUTATE_UNALLOCATED_FLOAT, {data})
    } catch (e) {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_unallocated_float_balance'), status: 'danger'})

    }
  },
  [GET_VIEW_STATEMENT]: async ({commit, dispatch}, {
    cardProgramCode,
    resellerCode,
    currencyCode,
    fromDate,
    page,
    perPage,
    toDate,
  }) => {
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'getting')
      let {data} = await Vue.prototype.$http.get(
        `/cardprograms/${cardProgramCode}/resellers/${resellerCode}/statement?
      currency_code=${currencyCode}
      &from_date=${fromDate}
      &page=${page}
      &per_page=${perPage}
      &to_date=${toDate}
      `
          .replace(/ /g, ''))

      data = {
        ...data,
        statementResultList: data.statementResultList || [],
        openingBalance: data.openingBalance || 0,
        closingBalance: data.closingBalance || 0,
        netChange: data.netChange || 0,
        pageMeta: data.pageMeta || {
          links: [],
          numberOfPageElements: 0,
          perPage: 0,
          totalPages: 0
        }
      }
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      console.log(data, 'statment');
      commit(MUTATE_VIEW_STATEMENT, {data})

    } catch (e) {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.error_load_statement'), status: 'danger'})

    }


  },
  [EDIT_FLOAT_BYFLOATID]: async ({commit, dispatch}, floatId, body) => {
    try {
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'sending')

      const {data} = await Vue.prototype.$http.put(
        `/floats/${floatId}`
        , {
          ...handleEmptyValues(body)
        })
      // todo : check if it data returns or just add the submitted data
      commit(MUTATE_EDIT_FLOAT_BYFLOATID, {data, id: floatId})
      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
      dispatch(SHOW_TOAST_MESSAGE, {message: i18n.t('store.float_balance.success_edit_float_entity'), status: 'success'})

    } catch (e) {
      dispatch(SHOW_TOAST_MESSAGE, {message: e.response.data.detail || i18n.t('store.float_balance.error_edit_float_entity'), status: 'danger'})

      commit(MUTATE_LOADINGSTATE_FLOAT_BALANCE, 'ideal')
    }
  },
  // ! files what type of form data should be sent
  [ADD_SOFTDOC_TO_FLOAT]: async ({commit}, floatId, body) => {
    // Float TXN ID
    try {
      const {data} = await Vue.prototype.$http.post(`/floats/${floatId}/sofdocs`, {
          ...handleEmptyValues(body)
        }
      )
      commit(MUTATE_ADD_SOFTDOC_TO_FLOAT)
    } catch
      (e) {
      console.log(e)
    }
  },
  [GET_A_SOFTDOC_BY_FLOATID]:
    async ({commit}, floatId, softFieldId) => {
      try {
        const {data} = await Vue.prototype.$http(`/floats/${floatId}/softdocs/${softFieldId}`)
      } catch (e) {
        console.log(e)
      }
    }
}

const getters = {
  [GETTER_FLOATS]: state => state.floats,
  [GETTER_PENDING_FLOATS]: state => state.pendingFloats,
  [GETTER_REVIEWD_FLOATS]: state => state.reviewedFloats,
  [GETTER_LOADINGSTATE_FLOAT_BALANCE]: state => state.loadingState,
  [GETTER_UNALLOCATED_FLOAT]: state => state.unallocatedFloat,
  [GETTER_VIEW_STATEMENT]: state => state.viewStatement,
}
const floatBalance = {
  state,
  actions,
  getters,
  mutations
}
export default floatBalance

