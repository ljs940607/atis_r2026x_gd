import driver from '~/api/drivers/commonDriver';
import { responseHandler } from '~/api/responseHandlers';
import { getServices, getTenantAgnosticMode, getTenants, resetBadge } from '../../src/api/senders';

export function setup() {
  /**
   * Initializes the notifications center.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  const init = async () => {
    getServices();
    resetBadge({ notifCenterOpened: true });
    await Promise.all([getServices(), getTenants(), getTenantAgnosticMode()]);
  };

  /**
   * Initializes the driver.
   * @async
   * @function initDriver
   * @returns {Promise<void>}
   */
  const initDriver = async () => {
    await driver.init(responseHandler);
  };

  return { init, initDriver };
}
