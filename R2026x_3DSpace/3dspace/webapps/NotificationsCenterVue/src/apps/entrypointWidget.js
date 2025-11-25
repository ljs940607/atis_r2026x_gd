import '@ds/vuekit/dist/VUEKIT.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import Vuekit from 'vuekit';
import useTranslations from '~/composables/useTranslations';
import '../assets/NotificationCenter.css';
import requirejs from '../modules/require';

// Provide papi_driver or mock_driver depending on the environment mode.
import App from '~/App.vue';
import { responseHandler } from '~/api/responseHandlers';
import driver from '../api/drivers/commonDriver';
import {
  getServices,
  getSettings,
  getSocketStatus,
  getTenantAgnosticMode,
  getTenants,
  resetBadge,
} from '../api/senders';

/**
 * Creates and mounts the Vue app.
 * @param {HTMLElement} container - HTML element.
*/
async function mount(container, app) {
  requirejs(['css!DS/UIKIT/UIKIT']);
  const { promise } = useTranslations();
  await promise;
  app.mount(container);
}

/**
 * Loads the specified app after a given delay.
 *
 * @param {number} ms - The delay in milliseconds before loading the app.
 * @param {Function} app - The app to be loaded.
 * @param {Object} widget - The widget object.
 * @returns {void}
 */
function loadApp(app, widget) {
  widget.initFlag = true;
  const div = document.createElement('div');
  div.setAttribute('id', 'INTFCenter-app');

  document.body.innerHTML = '';
  document.body.appendChild(div);
  document.documentElement.style.fontSize = 'inherit';
  // Mount the app
  return mount(div, app);
}

/**
 * Setups and launches the 3DNotification Center widget.
 * @param {UWA.Widget} widget - Widget UWA.
 * https://uwa.netvibes.com/docs/Uwa/html/Widget.UWA.Widget.html.
 */
async function startWidget(widget, app) {
  //   let currentTenantUrl = widget.getValue<string>('url') || ''
  widget.onRefresh = function () {
    window.location.reload();
  };

  widget.onLoad = async function () {
    widget.initFlag = false;
    widget.counterRequest = 0;
    widget.maxRequest = 5;
    driver.init(widget);
    driver.addCallback(responseHandler).then(() => initAppData());
    // driver ready
    loadApp(app, widget); 
  };

  widget.launch();
}

/**
 * Sets the application settings.
 * This function retrieves the tenants and services, and resets the badge count.
 */
function initAppData() {
  // Get the tenants and services
  return Promise.allSettled([
    getServices(),
    getSocketStatus(),
    resetBadge({ notifCenterOpened: true }),
    getTenants(),
    getTenantAgnosticMode(),
    getSettings(),
  ]);
}

(() => {
  if (window.widget === undefined || window.widget === null) throw new Error('No widget found');
  const widget = window.widget;
  //-----------------------------------------
  const app = createApp(App);
  app.use(Vuekit, { globalRegister: true });
  app.use(createPinia());
  // Pinia store must be activated before starting the widget
  //-----------------------------------------
  startWidget(widget, app);
})();
