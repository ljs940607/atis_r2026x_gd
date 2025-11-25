/*
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
 */

(function($){
	editSequenceInstance = new function(){
		var mcids = [];
		var nonAssociatedPOAs = [];

		/*Edit Instance Sequecne will be udpated upon this method invocation*/
		this.editInstanceSeq = function (cmd) {
			var selectedPOAIDsArray=getArrayofSelectedPoaIDs();
			var trElem = $('tr td div.selected').closest('tr');
			if( selectedPOAIDsArray.length <=0 ) {
				alert(POA_EDIT_LABELS["emxAWL.POAEdit.SelectSinglePOA"]);
				return;
			}
		
		
            
            var reqArg = {};
			var validPoaList = [];
            nonAssociatedPOAs=[];
            mcids=[];
            var isArtworkMasterAssociated = false;
            $('tr td div.selected').each(function() { 
            var mcid = $(this).closest('td').attr('mcid');
                mcids.push(mcid);
			var poaNames = editInstance.isArtworkMasterConnectedtoPOA(selectedPOAIDsArray, mcid); 
                if(poaNames!="" && poaNames.length>0)
			      nonAssociatedPOAs.push(poaNames);
                
			var arrayLength = selectedPOAIDsArray.length;
				if(arrayLength != poaNames.length)
					isArtworkMasterAssociated=true;

			
			
			for(var i=0; i<selectedPOAIDsArray.length; i++)
			{
				poaID=selectedPOAIDsArray[i];
				var cellId = customEditUtil.getCellId(mcid,poaID);
				var lc_ids = $("td[id='" + cellId + "']").attr('lc_ids');
				if (typeof lc_ids != 'undefined' && lc_ids != "")
					validPoaList.push(mcid+"_"+poaID);
			}
                });
            
            if(!isArtworkMasterAssociated){
				alert(POA_EDIT_LABELS["emxAWL.Alert.NoElementAssociatedToPOA"]);
						return;
					}
            
            var newArray = [];
                $(nonAssociatedPOAs).each(function(i,value) {
                    newArray= newArray.concat(value);
                }); 
             nonAssociatedPOAs = $.distinct(newArray);
            
			var promptdata= POA_EDIT_LABELS["emxAWL.Prompt.EnterInstanceSequence"];
			var iseq=prompt(promptdata,"");		
			while( iseq!=null && !editSequenceInstance.is_int(iseq) )
			{			
				iseq=prompt(POA_EDIT_LABELS["emxAWL.Prompt.InvalidInteger"]);
			}
	
			if(iseq == null || iseq == '')
				return;
			
			reqArg["poaID"]=validPoaList;
			

			
			reqArg["instSeq"]=parseInt(iseq);

			editInstance.ajaxExec("../resources/awl/db/poaservice/updateInstanceSequence", reqArg, this.instSeqUpdated, function(){alert("Error Occurred")} );
		};
        
		/*After Ajax request to server this API is processed this method is executed*/
		this.instSeqUpdated = function (data, arg_data) {
			if(data.result == "error"){
				alert(data.message);
				return;
			}
			var afterSucessTDs = new Array();
        
        $(mcids).each(function(i,value) { 
			var selectedPOAIDsArray=arg_data["poaID"];
			var instSeq=arg_data["instSeq"];

			
					$(selectedPOAIDsArray).each(function(index, mc_poaID){
						var mc_poaid =  mc_poaID.split("_");
						var mcid = mc_poaid[0];
						var poaID = mc_poaid[1];
						var tdid="mc_poa" + mcid + "_" + poaID;
						$("td[id='" + tdid + "']").find(".instSeqData").html(instSeq);
						if (afterSucessTDs.indexOf(tdid) === -1 )
							afterSucessTDs.push(tdid);
					});
	
					var message = "";
					if(nonAssociatedPOAs && nonAssociatedPOAs.length > 0) {
						message = POA_EDIT_LABELS["emxAWL.Warning.PartialArtworkElementsAssocaition"] + ' ' + nonAssociatedPOAs +"\n";
					}
					/* SUG-R2J Is not required as per suggestion needs to be implemented
					$(afterSucessTDs).each(function(index, currentId){
						$("td[id='" + currentId + "']").effect( "highlight", {color:"#005686"}, 3000 );
					}); */
				}
			);
			customEditUtil.SuccessAlert(POA_EDIT_LABELS["emxAWL.Alert.InstanceSequenceUpdated"]);
		};
		/*Edit Instance Sequecne validation function*/
		this.is_int = function (value) {
			if((parseFloat(value) == parseInt(value)) && !isNaN(value))
			{
				if(parseInt(value)<=0)
					return false;
				return true;
			} 
			else 
			{ 
				return false;
			} 
		};
		
		
	};
})(jQuery);

