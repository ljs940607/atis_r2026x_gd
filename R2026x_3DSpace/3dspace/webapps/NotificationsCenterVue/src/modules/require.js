import { DS_WEBAPPS_URL_IFRAME as DS_WEBAPPS_URL } from './globalVars';

const AMDLOADER_SCRIPT = 'AmdLoader/AmdLoader.js';
let initAsync;

const setupGlobalEnvVar = async () => {
  const path = JSON.parse(JSON.stringify(DS_WEBAPPS_URL.replace('webapps/', 'webapps')));
  const paths = {
    'DS': path,
    // 'DS/UWPClientCode/UWA': 'UWA2/js',
    // 'UWA': 'UWA2/js',
    'vuejs': `${path}/vuejs/2.6.10/vue.min`,
    'vu-kit': `${path}/vuekit/vu-kit.umd`, // have to call it "vu-kit"
  };
  window.require?.config({ paths });
};

const initRequire = async () => {
  if (initAsync) return;

  await setupGlobalEnvVar();
  const script = document.createElement('script');

  const loadingAsync = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  script.src = `${DS_WEBAPPS_URL}${AMDLOADER_SCRIPT}`; // todo add cache bust?
  document.head.appendChild(script);
  await loadingAsync;
};

const requirejs = async (modules) => {
  if (!initAsync) initAsync = initRequire();
  await initAsync;

  return new Promise((resolve, reject) => {
    window.require(modules, (...m) => resolve(m), reject);
  });
};

export default requirejs;
