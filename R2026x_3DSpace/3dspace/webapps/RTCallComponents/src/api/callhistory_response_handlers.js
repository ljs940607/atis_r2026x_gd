import { useCallHistoryStore } from '../stores/CallHistoryStore'
import { useRTCStore } from '../stores/RTCStore';

export const PlatformListeners = async(data) => {
  const callHistoryStore = useCallHistoryStore();
  const rtcStore = useRTCStore();
  
  if(data.evenement == 'CONNECTED'){
    rtcStore.connected(data.data);
  }
  else if(data.evenement == 'convInfo' ) {
    rtcStore.getV2ConversationsById(data.data.dmId)
  }
  else if(data.evenement == "call" && data.data.action == "setFavorites" ){
    rtcStore.setFavorites(data.data.favorites)
  }
  else if(data.evenement == "call" && data.data.action == 'cleanCallHistory'){
    callHistoryStore.emptyHistory();
   }
   else if(data.evenement == "call" && data.data.action == 'deleteCallHistory'){
    if (data.data.callIds)
     callHistoryStore.deleteCall(data.data.callIds);
    else
     callHistoryStore.deleteCall(data.data.callId);
   }
  else if(data.evenement == "call" && data.data.action == 'callHistory'){
    // Call History Response
    // if( data.data.calls instanceof Array ) {
      callHistoryStore.processCallHistoryData(data);
    // }
  }
  else if( data.evenement == 'inviteSent' || data.evenement == 'callEnded'  || data.evenement == 'callAccepted' || data.evenement == 'inviteToCall') {
    // Ongoing Call Event
    callHistoryStore.updateOngoingCall(data);
  }
  else if(data.evenement == 'ONPRESENCERECEIVED' || data.action == 'setStatus') {
    rtcStore.addUser(data.data);
  }
  else if(data.evenement == "conversation"){
    if(data.data.action =="getConversations"){
      if (!rtcStore.isLoading || data.data.TxID === rtcStore.initialTxnId) 
        rtcStore.addConversations(data.data.data.conversations);
    }
    if(data.data.action =="newConversation"){
      rtcStore.addConversations([data.data.data.conversation])
    }
    if(data.data.action == "updateConvTitle" || data.data.action == "newConversationUsers") {
      rtcStore.updateConversation(data.data.data);
    }
    if(data.data.action == "deleteConversation") {
      rtcStore.removeConversation(data.data.data.convId);
    }
    if(data.data.action == "removeConversationUser") {
      rtcStore.removeConversationUser(data.data.data);
    }
  }
  
}