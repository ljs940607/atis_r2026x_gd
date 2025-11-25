import requirejs from './require';

const getPlatformAPI = async () => {
  const [PlatformAPI] = await requirejs(['DS/PlatformAPI/PlatformAPI']);
  return PlatformAPI;
};

export { getPlatformAPI };

const getI3DXCompassPlatformServices = async () => {
  const [i3DXCompassPlatformServices] = await requirejs(['DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices']);
  return i3DXCompassPlatformServices;
};

export { getI3DXCompassPlatformServices };

const getTransientWidget = async () => {
  const [TransientWidget] = await requirejs(['DS/TransientWidget/TransientWidget']);
  return TransientWidget;
};

export { getTransientWidget };

const getWAFData = async () => {
  const [WAFData] = await requirejs(['DS/WAFData/WAFData']);
  return WAFData;
};

export { getWAFData };

const getOpenWith = async () => {
  const [OpenWith] = await requirejs(['DS/i3DXCompassPlatformServices/OpenWith']);
  return OpenWith;
};

export { getOpenWith };

const getTrackerAPI = async () => {
  const [TrackerAPI] = await requirejs(['DS/Usage/TrackerAPI']);
  return TrackerAPI;
};

export { getTrackerAPI };

const getCompassData = async () => {
  const [CompassData] = await requirejs(['DS/i3DXCompass/Data']);
  return CompassData;
};

export { getCompassData };


const getI18n = async () => {
  const [I18n] = await requirejs(['DS/UWPClientCode/I18n']);
  return I18n;
};

export { getI18n };

