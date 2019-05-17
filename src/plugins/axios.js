import Axios from 'axios'
import Vue from 'vue';
import {router} from '../main.js';
import {SET_AUTH_SATATE, SHOW_TOAST_MESSAGE} from "../store/types";
import {store} from '../store/store.js'

const TAG = '[axios]'
const axiosWrapper = {}
axiosWrapper.install = (Vue, configOptions = undefined) => {
  if (typeof configOptions === 'undefined') {
    throw new Error('please set api server config.')
  }

  const axios = Axios.create({
    baseURL: configOptions.BASE_URL,
    timeout: configOptions.TIMEOUT
  })

  axios.interceptors.request.use(async config => {
    console.log(TAG, `${config.baseURL}${config.url}`, config.method === 'get' ? config.params : config.data)
    config.headers['Authorization'] = await Vue.prototype.$oAuth.getAuthorizationHeader()
    return config
  }, error => {
    console.error(TAG, 'Failed to send request', error)
    return Promise.reject(error)
  })

  axios.interceptors.response.use(response => {
    console.log(TAG, response)
    return response
  }, error => {
    let consoleMsg = ''
    if (error.response) {
      /**
       * The request was made and the server responded with a status code
       * that falls out of the range of 2xx
       */
      consoleMsg = 'Simple response Error'
      if (error.response.status == 401) {
        store.dispatch(SHOW_TOAST_MESSAGE, {message: 'You have been automatically logged out, please login again. ', status: 'danger'})
        try {
          Vue.prototype.$oAuth
            .logout()
            .then(isSuccess => {
              // router.push({ path: "/login" });
              // store.dispatch(SET_AUTH_SATATE, false)
              Vue.prototype.$oAuth.lock()
            })
            .catch(e => {
              console.error(e.message);
            });
        } catch (e) {
          console.error(e);
        }

      }
    } else if (error.request) {
      /**
       * The request was made but no response was received
       * `error.request` is an instance of XMLHttpRequest in the browser and an instance of
       * http.ClientRequest in node.js
       */
      if ('code' in error && error.code === 'ECONNABORTED') {
        /**
         * the error return by axios, it mean axios sent request only, but never got response back.
         * for ECONNABORTED, that means sould be timeout by axios, please reference [configOptions.TIMEOUT]
         */
        consoleMsg = 'Request timeout error'
      } else {
        /**
         * the error is "network problem" return from axios
         */
        consoleMsg = 'Network problem'
      }
    } else {
      /**
       * Something happened in setting up the request that triggered an Error
       */
      consoleMsg = 'Unknown error'
    }

    console.error(TAG, consoleMsg, error)
    return Promise.reject(error)
  })

  Vue.prototype.$http = {
    get: (url, params = {}) => {
      return axios.get(url, {
        params: params
      })

    },
    post: (url, data) => {
      return axios.post(url, data)
    },
    put: (url, data) => {
      return axios.put(url, data)
    },
    delete: (url) => {
      return axios.delete(url)
    },
    patch: (url, data) => {
      return axios.patch(url, data)
    }
  }
}
export default axiosWrapper
