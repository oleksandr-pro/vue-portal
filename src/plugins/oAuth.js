import ClientOAuth2 from 'client-oauth2'
import qs from 'qs'
import {store} from '../store/store.js'
import {SET_AUTH_SATATE} from "../store/types";
import { router } from '@/main'
import { inArray } from "@/utils/common"
import permission from '@/constants/permission'

const oAuthWrapper = {}
oAuthWrapper.install = (Vue, configOptions = undefined) => {
  if (typeof configOptions === 'undefined') {
    throw new Error('please set oAuth config.')
  }

  const TAG_NAME = '[auth]'
  const HTTP_METHOD__POST = 'post'

  const TOKEN_URL = `${configOptions.BASE_URL}/realms/${configOptions.REALM}/protocol/openid-connect/token`
  const LOGOUT_URL = `${configOptions.BASE_URL}/realms/${configOptions.REALM}/protocol/openid-connect/logout`
  const keycloakAuth = new ClientOAuth2({
    clientId: configOptions.CLIENT_ID,
    clientSecret: configOptions.CLIENT_SECRET,
    accessTokenUri: TOKEN_URL
  })

  let interval = null
  /**
   * public - Login with OAuth
   * @param {String} username
   * @param {String} password
   */
  const login = async (username, password) => {
    let tokenObject = null
    try {
      const isLoginBefore = await isAuthenticated()
      if (!isLoginBefore) {
        tokenObject = await keycloakAuth.owner.getToken(username, password)
        saveToken(tokenObject)
        const permissions = await loadPermissions()
        await savePermissionInSessionStorage(permissions)
      }
      await startCountDown()
      return true
    } catch (e) {
      console.error(TAG_NAME, e.message)
      return false
    }
  }

  /**
   * public - Logout with OAuth
   */
  const logout = async () => {
    try {
      const header = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const tokenObject = getTokenObject()
      const data = qs.stringify({
        client_id: configOptions.CLIENT_ID,
        client_secret: configOptions.CLIENT_SECRET,
        refresh_token: tokenObject.refreshToken
      })

      let {status} = await keycloakAuth.request(HTTP_METHOD__POST, LOGOUT_URL, data, header)
      if (status !== 204) {
        console.warn(TAG_NAME, 'The logout request has been sent, but failed to logout with OAuth.')
      }
    } catch (e) {
      console.error(TAG_NAME, e.message)
    } finally {
      stopCountDown()
      removeTokenDataFromSessionStorage()
      removeListenerSession()
      triggerLogout()
    }
    return true
  }

  /**
   * public - Get authorization header value
   */
  const getAuthorizationHeader = async () => {
    try {
      let tokenObject = getTokenObject()
      tokenObject = await tokenObject.refresh()
      saveToken(tokenObject)
      return tokenObject.sign({}).headers.Authorization
    } catch (e) {
      console.error(TAG_NAME, e.message)
    }
  }

  /**
   * public - check Authenticated or not
   */
  const isAuthenticated = async () => {
    // store.dispatch(SET_AUTH_SATATE, authenticated)
    let isValid = await isValidTokenData()
    if (getTokenObject() && isValid) {
      updateCountDown()
      return true
    } else {
      return false
    }
  }

  /**
   * public - get user info from token
   */
  const getUserInfo = () => {
    const accessToken = getTokenObject().accessToken
    const userInfo = decodeToken(accessToken)
    let fullName = `${userInfo.given_name ? userInfo.given_name : '' } ${userInfo.family_name ? userInfo.family_name : ''}`
    if (fullName.trim() === '') {
      fullName = 'No name to display'
    }

    return {
      fullName: fullName,
      email: userInfo.email,
      preferredUsername: userInfo.preferred_username
    }
  }

  /**
   * private - get token object from session
   */
  const getTokenObject = () => {
    let obj = null
    try {
      if (getTokenDataFromSessionStorage()) {
        const data = getTokenDataFromSessionStorage()
        obj = keycloakAuth.createToken(data) 
        // override the expired function
        obj.expired = () => {
          const timestamp = (data.create_time - new Date().getTime()) / 1000
          const isExpired = timestamp <= configOptions.TOKEN_EXPIRED_TIME_LESS_THAN // update when less than last two minutes
          return isExpired
        }
      }
    } catch (e) {
      console.error(TAG_NAME, e.message)
    }
    return obj
  }

  /**
   * private - save and update session storage value
   */
  const saveToken = async (tokenObject) => {
    tokenObject.data.create_time = tokenObject.expires.getTime()
    updateTokenDataInSessionStorage(tokenObject.data)
  }

  /**
   * private - lock screen
   */
  const lock = () => {
    
    const preferredUsername = getUserInfo().preferredUsername
    const fullName = getUserInfo().fullName
    logout().then(() => {
      const promise = new Promise((resolve) => {
        resolve(router.currentRoute.fullPath)
      })
      promise.then(fullPath => {
        router.push({
          name: 'Lock',
          query: { 
            redirect: fullPath,
            preferredUsername: preferredUsername, 
            fullName: fullName
          }
        })
      })
    })
    // store.dispatch(SET_AUTH_SATATE, false)
  }

  /**
   * private - decode token function
   */
  const decodeToken = (str) => {
    str = str.split('.')[1]

    str = str.replace('/-/g', '+')
    str = str.replace('/_/g', '/')
    switch (str.length % 4) {
      case 0:
        break
      case 2:
        str += '=='
        break
      case 3:
        str += '='
        break
      default:
        throw new Error('Invalid token')
    }

    str = (str + '===').slice(0, str.length + (str.length % 4))
    str = str.replace(/-/g, '+').replace(/_/g, '/')

    str = decodeURIComponent(escape(atob(str)))

    str = JSON.parse(str)
    return str
  }

  /**
   * private - start interval
   */
  const startCountDown = () => {
    interval = setInterval(async () => {
      let count = getCountDownFromSessionStorage()
      if (count < configOptions.TIMEOUT) {
        let isValid = await isValidTokenData()
        if (!isValid) {
          lock()
        } else {
          count++
          saveCountDownInSessionStorage(count)
        }
      } else {
        stopCountDown()
        lock()
      }
    }, 1000)
  }

  /**
   * private - stop interval
   */
  const stopCountDown = () => {
    clearInterval(interval)
    removeCountDownFromSessionStorage()
    interval = null
  }

  /**
   * private - update interval
   */
  const updateCountDown = () => {
    saveCountDownInSessionStorage(0)
    triggerUpdateCountDown()
    if (!interval) {
      startCountDown()
    }
  }

  /**
   * private - refresh token if its expired
   */
  const isValidTokenData = async () => {
    try {
      let tokenObject = getTokenObject()
      if (!tokenObject) {
        return false
      }

      if (tokenObject.expired()) {
        console.warn(TAG_NAME, 'access token expired, refreshing..')
        tokenObject = await tokenObject.refresh()
        saveToken(tokenObject)
        console.warn(TAG_NAME, 'token has been refreshed.')
      }
      return true
    } catch (e) {
      console.error(TAG_NAME, e.message)
      return false
    }
  }

  /**
   * private - load permission after login
   */
  const loadPermissions = async () => {
    const response = await Vue.prototype.$http.get('https://api.dev.transact24.com/mcaba/v1/v1/userprofile')
    const currentUserRole = response.data.roles
    if (currentUserRole.length > 0) {
      saveRoleInSessionStorage(currentUserRole[0])
    }
    const currentResellerCode = response.data.resellerCodes
    if (currentResellerCode.length > 0) {
      saveResellerCodeInSessionStorage(currentResellerCode[0])
    }
    
    if (response.data.isSuperUser) {
      return [permission.ALL_PERMISSION]
    } else {
      return response.data.permissions
    }
  }

  /**
   * public - check the user has permission or not
   * @param {String} name 
   */
  const hasPermission = (name) => {
    const permissions = getPermissionFromSessionStorage()
    return inArray(permission.ALL_PERMISSION, permissions) || inArray(name, permissions)
  }

  const isNoPermissionForAll = () => {
    const permissions = getPermissionFromSessionStorage()
    return !permissions || permissions.length === 0
  }

  const isReseller = () => {
    const role = getRoleFromSessionStorage()
    return role === 'ROLE_ABA_RESELLER'
  }

  const getCurrentResellerCode = () => {
    return getResellerCodeFromSessionStorage()
    // return 'QATES'
  }

  Vue.prototype.$oAuth = {
    login,
    logout,
    isAuthenticated,
    getAuthorizationHeader,
    getUserInfo,
    lock,
    hasPermission,
    isReseller,
    getCurrentResellerCode,
    isNoPermissionForAll
  }
}


export default oAuthWrapper
