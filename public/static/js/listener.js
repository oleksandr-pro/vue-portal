const FILE_TAG = '[listener]'

// token
const EVENT_LISTENER_NAME__STORAGE = 'storage'
const EVENT_LISTENER__LOCAL_STORAGE__GET_STORAGE_DATA = 'GET_STORAGE_DATA'
const EVENT_LISTENER__LOCAL_STORAGE__STORAGE_DATA = 'STORAGE_DATA'
const EVENT_LISTENER__LOCAL_STORAGE__UPDATE_STORAGE_DATA = 'UPDATE_STORAGE_DATA'
const EVENT_LISTENER__LOCAL_STORAGE__LOGOUT = 'LOGOUT'
const STORAGE_NAME__SESSION_STORAGE__TOKEN_DATA = 'TOKEN_DATA'

// permission
const EVENT_LISTENER__LOCAL_STORAGE__PERMISSION = 'PERMISSION'
const STORAGE_NAME__SESSION_STORAGE__PERMISSION = 'PERMISSION'

// reseller code
const EVENT_LISTENER__LOCAL_STORAGE__RESELLER_CODE = 'RESELLER_CODE'
const STORAGE_NAME__SESSION_STORAGE__RESELLER_CODE = 'RESELLER_CODE'

// role
const EVENT_LISTENER__LOCAL_STORAGE__ROLE = 'ROLE'
const STORAGE_NAME__SESSION_STORAGE__ROLE = 'ROLE'

// count down only
const EVENT_LISTENER__LOCAL_STORAGE__UPDATE_COUNT_DOWN = 'SESSION_MANAGE_COUNT_DOWN_FLAG'
const STORAGE_NAME__SESSION_STORAGE__COUNT_DOWN = 'SESSION_MANAGE_COUNT_DOWN'

// const STORAGE_NAME__RENEW_COUNT_DOWN = 'RENEW_COUNT_DOWN'

const globalListener = () => {
  if (!window.sessionStorage.length) {
    console.log(FILE_TAG, 'init for new tab or view event')
    window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__GET_STORAGE_DATA, Date.now())
  }

  window.addEventListener(EVENT_LISTENER_NAME__STORAGE, (event) => {
    /**
     * Listen for new assignments, such as opening a new window in the same browser
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__GET_STORAGE_DATA && getTokenDataFromSessionStorage()) {
      console.log(FILE_TAG, 'listen to get storage data change event')
      triggerCopyStorageData(getTokenDataFromSessionStorage())
      triggerCopyPermissions(getPermissionFromSessionStorage(false))
      triggerCopyResellerCode(getResellerCodeFromSessionStorage())
      triggerCopyRole(getRoleFromSessionStorage())
    }

    /**
     * Listen for copy role to new tab
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__ROLE && event.newValue) {
      console.log(FILE_TAG, 'listen to copy role event')
      saveRoleInSessionStorage(event.newValue)
    }

    /**
     * Listen for copy reseller code to new tab
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__RESELLER_CODE && event.newValue) {
      console.log(FILE_TAG, 'listen to copy reseller code event')
      saveResellerCodeInSessionStorage(event.newValue)
    }

    /**
     * Listen for copy permission to new tab
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__PERMISSION && event.newValue) {
      console.log(FILE_TAG, 'listen to copy permission event')
      savePermissionInSessionStorage(event.newValue, false)
    }

    /**
     * Listen for the values you want to copy and assign them
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__STORAGE_DATA && event.newValue) {
      console.log(FILE_TAG, 'listen to storage data change event')
      saveTokenDataInSessionStorage(event.newValue)
    }

    /**
     * listen for token is updated and propagated to other tabs
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__UPDATE_STORAGE_DATA) {
      if (event.newValue) {
        console.log(FILE_TAG, 'listen to update storage data event')
        saveTokenDataInSessionStorage(event.newValue)
      }
    }

    /**
     * listen for logout event and propagated to other tabs
     */
    if (event.key === EVENT_LISTENER__LOCAL_STORAGE__LOGOUT) {
      console.log(FILE_TAG, 'listen to logout event')
      window.sessionStorage.clear()
      window.location.reload()
    }

    // for count down only
    if (event.key == EVENT_LISTENER__LOCAL_STORAGE__UPDATE_COUNT_DOWN) {
      if (event.newValue === 'true') {
        saveCountDownInSessionStorage(0)
      }
    }
  })
}

const removeListenerSession = () => {
  // removeCountDownFromSessionStorage()
  removePermissionFromSessionStorage()
  removeTokenDataFromSessionStorage()
  removeResellerCodeFromSessionStorage()
  removeRoleFromSessionStorage()
}

// token data
const getTokenDataFromSessionStorage = () => {
  const tokenData = window.sessionStorage.getItem(STORAGE_NAME__SESSION_STORAGE__TOKEN_DATA)
  return tokenData ? JSON.parse(tokenData) : null
}

const saveTokenDataInSessionStorage = (val) => {
  // console.log(FILE_TAG, 'saving token data...')
  val = objectToString(val)
  window.sessionStorage.setItem(STORAGE_NAME__SESSION_STORAGE__TOKEN_DATA, val)  
  console.log(FILE_TAG, 'token data saved...')
}

const removeTokenDataFromSessionStorage = () => {
  // console.log(FILE_TAG, 'removing token data...')
  window.sessionStorage.removeItem(STORAGE_NAME__SESSION_STORAGE__TOKEN_DATA)
  console.log(FILE_TAG, 'token data removed...')
}

const updateTokenDataInSessionStorage = (val) => {
  // console.log(FILE_TAG, 'updating token data...')
  saveTokenDataInSessionStorage(val)
  triggerUpdateStorageData(val)
  console.log(FILE_TAG, 'token data updated...')
}

// permission
const getPermissionFromSessionStorage = (needToArray = true) => {
  const permissions = window.sessionStorage.getItem(STORAGE_NAME__SESSION_STORAGE__PERMISSION)
  if (permissions) {
    if (needToArray) {
      return stringToArray(permissions)
    }
    return permissions
  }
  return null
}

const savePermissionInSessionStorage = (val, needToString = true) => {
  if (needToString) {
    val = arrayToString(val)
  }
  window.sessionStorage.setItem(STORAGE_NAME__SESSION_STORAGE__PERMISSION, val)
}

const removePermissionFromSessionStorage = () => {
  window.sessionStorage.removeItem(STORAGE_NAME__SESSION_STORAGE__PERMISSION)
}

// reseller code
const getResellerCodeFromSessionStorage = () => {
  return window.sessionStorage.getItem(STORAGE_NAME__SESSION_STORAGE__RESELLER_CODE)
}

const saveResellerCodeInSessionStorage = (val) => {
  window.sessionStorage.setItem(STORAGE_NAME__SESSION_STORAGE__RESELLER_CODE, val)
}

const removeResellerCodeFromSessionStorage = () => {
  window.sessionStorage.removeItem(STORAGE_NAME__SESSION_STORAGE__RESELLER_CODE)
}

// role
const getRoleFromSessionStorage = () => {
  return window.sessionStorage.getItem(STORAGE_NAME__SESSION_STORAGE__ROLE)
}

const saveRoleInSessionStorage = (val) => {
  window.sessionStorage.setItem(STORAGE_NAME__SESSION_STORAGE__ROLE, val)
}

const removeRoleFromSessionStorage = () => {
  window.sessionStorage.removeItem(STORAGE_NAME__SESSION_STORAGE__ROLE)
}

// count down
const getCountDownFromSessionStorage = () => {
  const data = window.sessionStorage.getItem(STORAGE_NAME__SESSION_STORAGE__COUNT_DOWN)
  return data ? data : 0
}

const saveCountDownInSessionStorage = (val) => {
  window.sessionStorage.setItem(STORAGE_NAME__SESSION_STORAGE__COUNT_DOWN, val)
}

const removeCountDownFromSessionStorage = () => {
  window.sessionStorage.removeItem(STORAGE_NAME__SESSION_STORAGE__COUNT_DOWN)
}

// trigger listener for token
const triggerCopyStorageData = (val) => {
  // console.log(FILE_TAG, 'triggering copy storage data...')
  val = objectToString(val)
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__STORAGE_DATA, val)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__STORAGE_DATA)
  console.log(FILE_TAG, 'trigger copy storage data event', '[done]')
}

const triggerUpdateStorageData = (val) => {
  // console.log(FILE_TAG, 'triggering update storage data...')
  val = objectToString(val)
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__UPDATE_STORAGE_DATA, val)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__UPDATE_STORAGE_DATA)
  console.log(FILE_TAG, 'trigger update storage data event', '[done]')
}

const triggerLogout = () => {
  // console.log(FILE_TAG, 'triggering logout...')
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__LOGOUT, Date.now())
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__LOGOUT)
  console.log(FILE_TAG, 'trigger logout event', '[done]')
}

// trigger listener for permission
const triggerCopyPermissions = (val) => {
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__PERMISSION, val)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__PERMISSION)
  console.log(FILE_TAG, 'trigger copy permission event', '[done]')
}

// trigger listener for reseller code
const triggerCopyResellerCode = (val) => {
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__RESELLER_CODE, val)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__RESELLER_CODE)
  console.log(FILE_TAG, 'trigger copy reseller code event', '[done]')
}

// trigger listener for role
const triggerCopyRole = (val) => {
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__ROLE, val)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__ROLE)
  console.log(FILE_TAG, 'trigger copy role event', '[done]')
}

// trigger listener for count down
const triggerUpdateCountDown = () => {
  window.localStorage.setItem(EVENT_LISTENER__LOCAL_STORAGE__UPDATE_COUNT_DOWN, true)
  window.localStorage.removeItem(EVENT_LISTENER__LOCAL_STORAGE__UPDATE_COUNT_DOWN)
  console.log(FILE_TAG, 'trigger update count down event', '[done]')
}

// covert utils
const objectToString = (val) => {
  if (typeof val !== 'string') {
    // console.log(FILE_TAG, 'value is not a string, converting...')
    val = JSON.stringify(val)
  }
  return val
}

const arrayToString = (val, tag = '|') => {
  if (val) {
    return val.join(tag)
  }
  return ''
}

const stringToArray = (val, tag = '|') => {
  return val.split(tag)
}

console.log('starting listener...')
globalListener()