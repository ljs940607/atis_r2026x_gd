export const DS_BASE_URL = window.dsDefaultWebappsBaseUrl?.replace('webapps/', '') || `${window.location.origin}/`;
export const DS_WEBAPPS_URL = window.dsDefaultWebappsBaseUrl || `${DS_BASE_URL}webapps/`;

export const DS_BASE_URL_IFRAME =
  //window.dsDashboardWindow?.topPlatformWindow?.dsDefaultWebappsBaseUrl?.replace('webapps/', '') ||
  DS_BASE_URL ||
  `${window.location.origin}/`;
export const DS_WEBAPPS_URL_IFRAME =
  //window.dsDashboardWindow?.topPlatformWindow?.dsDefaultWebappsBaseUrl ||
  DS_WEBAPPS_URL ||
  `${DS_BASE_URL_IFRAME}webapps/`;
