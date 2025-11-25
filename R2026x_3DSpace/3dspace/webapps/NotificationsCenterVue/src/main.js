import { createPinia } from 'pinia';
import { createApp } from 'vue';
import Vuekit from 'vuekit';
import { getServices, getTenantAgnosticMode, getTenants, resetBadge } from '~/api/senders';
import '~/assets/NotificationCenter.css';
import '~/assets/UIKIT.css';
import App from './App.vue';
import driver from './api/drivers/commonDriver';
import { getSettings } from './api/senders';
import './assets/NotificationCenter.css';

/**
 * Sets up the application by performing necessary initialization tasks.
 * This function calls the following methods:
 * - getTenants: Retrieves the list of tenants.
 * - getServices: Retrieves the list of services.
 * - getTenantAgnosticMode: Retrieves the tenant-agnostic mode.
 * - resetBadge: Resets the badge count with the option to indicate that the notification center is opened.
 */
async function setUp() {
  getServices();
  resetBadge({ notifCenterOpened: true });
  await Promise.all([getServices(), getSettings(), getTenants(), getTenantAgnosticMode()]);
}
const app = createApp(App);

// app.use(Vuekit, { disableTooltipsOnDevices: false });
app.use(Vuekit, { globalRegister: true });
app.use(createPinia());
driver.init(responseHandler);
setUp();
app.mount('#app');
