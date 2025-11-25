
import { DS_LANG, DS_WEBAPPS_URL } from './global-var';

const AMDLOADER_SCRIPT = '/AmdLoader/AmdLoader.js'
let initAsync

const setupGlobalEnvVar = async() => {
  // Require configurations
  window.require = {

    baseUrl: DS_WEBAPPS_URL,
    paths: {
      'DS': DS_WEBAPPS_URL,
      'DS/UWPClientCode/UWA': 'UWA2/js',
      'UWA': 'UWA2/js',
      'vuejs': `${DS_WEBAPPS_URL}/vuejs/2.6.10/vue.min`,
      'vu-kit': `${DS_WEBAPPS_URL}/vuekit/vu-kit.umd`, // have to call it "vu-kit"
      'vuex': `${DS_WEBAPPS_URL}/vuex/3.1.1/vuex.min`,
      'Vuetify': `${DS_WEBAPPS_URL}/vuetify-2.4.9/dist/vuetify.min`,
      'mediasoup-client': `${DS_WEBAPPS_URL}/VENMediaSoupClient/mediasoup-client`,

    },
    config: {
      'i18n': {
        locale: DS_LANG, //TODO check if required
      },
      'DS/Logger/Logger': {
        disableLog: !false, // TODO check for logger
      },
    }
  }
}

const initRequire = async() => {
  if (initAsync)
    return

  await setupGlobalEnvVar()
  const script = document.createElement('script')

  const loadingAsync = new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })

  script.src = `${DS_WEBAPPS_URL}${AMDLOADER_SCRIPT}`
  document.head.appendChild(script) 

  await loadingAsync
}

export const initRequireJs = async() => {
if (!initAsync)
    initAsync = initRequire()

  await initAsync
}

export const requirejs = async(modules) => {
  return new Promise((resolve, reject) => {
    window.require(modules, (...m) => resolve(m), reject)
  })
}
