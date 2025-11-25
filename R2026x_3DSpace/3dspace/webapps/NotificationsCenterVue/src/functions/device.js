/**
 * Indicates whether the current device is a mobile device.
 * @type {boolean}
 */
const mobileDevice =
  (window.ds && window.ds.env == 'MOBILE') || (window.top && window.top.ds && window.top.ds.env == 'MOBILE');
export default mobileDevice;
