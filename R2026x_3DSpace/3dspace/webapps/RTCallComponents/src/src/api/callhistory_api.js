import { RTC_URL, PASSPORT_URL, TENANT_ID, DS_BASE_URL } from '../modules/global-var'
import { requirejs } from '../modules/require'
import { PlatformListeners } from './callhistory_response_handlers'
import { unescapeHTML } from '../components/utils/html';
import { useRTCStore } from '../stores/RTCStore';

export const initDevEnv = async () => {
  const [InstantMessaging] = await requirejs(['DS/InstantMessaging/InstantMessaging'])
  InstantMessaging.init({
    devEnv3diM: true,
    platformId: TENANT_ID,
    appName: "devenv",
    url: RTC_URL,
    passportUrl: PASSPORT_URL,
    ODTMode: false,
    ressources: {
      swym: [{
        id: TENANT_ID,
        displayName: TENANT_ID,
        url: DS_BASE_URL
      }],
      instantMessaging: [
        {
          displayName: TENANT_ID,
          enabled: true,
          id: TENANT_ID,
          url: DS_BASE_URL,
        },
      ],
    }
  },
    function (ctrl) {
      document.IMctrl = ctrl;
      document.connectedLogin = document.RTCManager.login;
    }
  );
  document.connectedLogin = UWA.Utils.getQueryString(document.URL, 'login3DIM');
}

export const getRTCStatus = async () => {
  const [PublicAPI] = await requirejs(['DS/UWPClientCode/PublicAPI']);
  const rtcStore = useRTCStore();
  const uwpVar = PublicAPI.getApplicationConfiguration('app.swymfeature.activateRTC');
  rtcStore.rtConvEnable = typeof uwpVar === 'string' ? uwpVar === 'true' : uwpVar;
  return uwpVar;
}

const getRTInterface = async () => {
  const [RTInterface] = await requirejs(['DS/RTInterface/RTInterface']);
  return RTInterface;
}

let initAlready = false; 

export const initCallHistoryApi = async () => {
  if(!initAlready){
    const [RTProxyDriver] = await requirejs(['DS/RTProxyDriver/RTProxyDriver']);
    // Events for Ongoing Calls
    RTProxyDriver.addEvent('inviteSent', function(data) {
      data.evenement = 'inviteSent';
      PlatformListeners(data);
    });
    RTProxyDriver.addEvent('callAccepted', function(data) {
      data.evenement = 'callAccepted';
      PlatformListeners(data);
    });
    RTProxyDriver.addEvent('callEnded', function(data) {
      data.evenement = 'callEnded';
      PlatformListeners(data);
    });
    RTProxyDriver.addEvent('inviteToCall', function(data) {
      data.evenement = 'inviteToCall';
      PlatformListeners(data);
    });

    const RTInterface = await getRTInterface();
    const rtcStore = useRTCStore();
    const swymTenant = window.SWYM_TENANT || rtcStore.tenantId;
    RTInterface.send({ evenement: 'GETLOGINOKDATA', tenant : swymTenant }, 'fromwidgetim.ds.com');
    RTInterface.addCallback(PlatformListeners, null, 'towidgetim.ds.com');
    RTInterface.addCallback(PlatformListeners, null, 'im.ds.com'); // TODO: check if this is required
    initAlready = true;
  }
}

export const fetchCallHistory = async (limit, leftDateOffset, rightDateOffset) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.send({ action: 'getCallHistory', count: limit, dateOffset: leftDateOffset, dateOffset_left: rightDateOffset, tenant : rtcStore.tenantId }, 'callToRTC.im.ds.com');
}

export const fetchCallFavorites = async () => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.send({ action: 'getCallFavorites',tenant :rtcStore.tenantId }, 'callToRTC.im.ds.com');
}

export const setCallFavorite = async (data) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.send({ "action": 'setCallFavorite',tenant :rtcStore.tenantId, "data": data }, 'callToRTC.im.ds.com');
}

export const startCall = async (data) => {
  const [RTAudioVideoAPI] = await requirejs(['DS/RTAudioVideoAPI/RTAudioVideoAPI']);
  const rtcStore = useRTCStore();
  RTAudioVideoAPI.startCall({
    topic: unescapeHTML(data.topic) || "",
    type: data.type,
    logins: data.logins,
    dmId: data.dmId,
    callId: data.callId,
    dbConvId : data.dbConvId,
    rtconvEnable : !!rtcStore.rtConvEnable,
    tenant:rtcStore.tenantId
  })
}

export const searchContact = async (pattern) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.send({
    evenement: 'SEARCHCONTACT',
    tenant: rtcStore.tenantId,
    data: pattern,
  }, 'fromwidgetim.ds.com');
}

export const fetchConversations = async (tenantId) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.addCallback(PlatformListeners, tenantId, null, 'conversation');
  const reqData = RTInterface.send({ action: 'getConversations', tenant: tenantId ,data: {all:true} });
  rtcStore.setInitialTxnId(reqData.TxID);
}
export const removeFromHistory = async (callId) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  let data ={};
  if (callId instanceof Array)
    data = { action: 'deleteCallHistory',callIds : callId, tenant :rtcStore.tenantId };
  else 
    data= { action: 'deleteCallHistory',callId : callId, tenant: rtcStore.tenantId }
  RTInterface.send(data, 'callToRTC.im.ds.com'); 
  // fetchCallHistory(10);
}
export const clearHistory = async (lastCallDate) => {
  const RTInterface = await getRTInterface();
  const rtcStore = useRTCStore();
  RTInterface.send({ action: 'cleanCallHistory',lastCallDate : lastCallDate, tenant: rtcStore.tenantId }, 'callToRTC.im.ds.com'); 
}