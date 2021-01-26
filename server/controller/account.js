
const {add, removeData, getSessionKey, updateSessionKey} = require('../libs/db/code')
const aes = require('../libs/aesEncrypt')

export async function getErcode() {
  const code = aes.encodeErCode()
  await add(code)
  setTimeout(() => {
    removeData(code)
  }, 30000)
  return code
}

export async function getSessionKeyByCode (code) {
  const sessionKey = await getSessionKey(code)
  if (sessionKey) {
    await removeData(code)
  }
  return sessionKey
}

export async function setSessionKeyForCode (code, sessionKey) {
  const {timespan} = aes.decode(code)
  // 30s 过期
  if (Date.now() - timespan > 30000) {
    throw new Error('time out')
  }
  await updateSessionKey(code, sessionKey)
}
