import { useRTCStore } from "../stores/RTCStore";

export const toCallHistory = (callHistory) => {
    // const callHistoryStore = useCallHistoryStore();

    if (callHistory.calls.length) {
      const rtcStore = useRTCStore();
      let calls = callHistory.calls;
      
      calls.sort((a, b) => {
        return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime() 
      });
      
      calls.forEach((call) => {
        let currentUser = call.users.find(user => user.login === rtcStore.currentUserLogin.value);
        
        if(currentUser) {
          // calculate call duration
          let joinDate, endDate, difference;
          if(currentUser.joinDate) {
            joinDate = new Date(currentUser.joinDate)
          }
          if(currentUser.quitDate)
            endDate = new Date(currentUser.quitDate)

          if(joinDate && endDate) {
            difference = endDate - joinDate;

            let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
            difference -= hoursDifference * 1000 * 60 * 60

            let minutesDifference = Math.floor(difference / 1000 / 60);
            difference -= minutesDifference * 1000 * 60

            let secondsDifference = Math.floor(difference / 1000);

            let duration = '';
            if (hoursDifference) duration += hoursDifference + 'h '
            if (minutesDifference) duration += minutesDifference + 'm '
            if (secondsDifference) duration += secondsDifference + 's'

            call.duration = duration;
          }
          else {
            call.duration = ''
          }

          let creation_date = new Date(call.creation_date);
          let creation_date_hours = creation_date.getHours()%12;
          creation_date_hours = creation_date_hours ? creation_date_hours : 12; 
          
          // call start time 
          call.creation_date_string = ((creation_date_hours < 10 ? '0' : '') + creation_date_hours) + ':' + 
            ((creation_date.getMinutes() < 10 ? '0' : '') + creation_date.getMinutes()) + ' ' + 
            (creation_date.getHours() >= 12 ? 'PM' : 'AM');

          // call category (Incoming, Outgoing, Declined, Missed, Ongoing)
          call.isJoinable = call.isJoinable === "onCall" ? true : false;
          if (call.isJoinable)
            call.category = CALL_TYPES.Ongoing;
          else if (currentUser.id == call.caller)
            call.category = CALL_TYPES.Outgoing;
          else if (currentUser.state == 1)
            call.category = CALL_TYPES.Incoming
          else if (currentUser.state == 2)
            call.category = CALL_TYPES.Declined
          else
            call.category = CALL_TYPES.Missed
      
        }
      });
      const lastCallDate = calls[calls.length-1].creation_date.replace('Z', '').replace('T', ' ');
      // lastCallDate.value.replace('Z', '').replace('T', ' ');
      // callHistoryStore.updateLastCallDate( lastCallDate );
      callHistory.calls = calls;
      callHistory.lastCallDate = lastCallDate;
    }
    return callHistory
};