var isProcessing = false;
var getArtworkTemplateInfoUrl="../resources/awl/connector/o3dconnect/getArtworkTemplateInfo";
var lockTemplateUrl="../resources/awl/connector/document/lockArtworkTemplate";
var unlockTemplateUrl="../resources/awl/connector/document/unlockArtworkTemplate";
var isLocked = false;

function setupQt()
{
	 new QWebChannel(qt.webChannelTransport, function (channel) {
		 window.Q = channel.objects.jshelper;
		 
		 $(document).ready(function(){
			    if(!hasContext)
			        return;
			    addProgressInfoToDiv();
			    $.ajax({
			    url : "../resources/awl/connector/o3dconnect/getLabel",
			    success : function(data) {
			    		ARTWORK_TEMPLATE_LABLES = $.parseJSON(data);
				    	addTooltipToActionsCommands();
				    	clearTemplateAssembly();
				        if(artworkTemplateName != "null"){
				            updateTemplateInfo(artworkTemplateName);
				        } else {
				            removeProgessInfo();
				        }
				    }
			    });

			    $('#searchArtworkTemplatebtn').click(function(){
			        Q.searchTemplates();
			    });
			    $('#associateArtworkTemplateBtn').click(function(){
			        Q.associateTemplates();
			    });
			    $('#addCreatebtn').click(function(){
			        Q.createNewTemplate();
			    });
			    $('#checkinbtn').click(function(){
					Q.isArtworkTemplateAssociatedToFile(function(docTemplateName){
							if(docTemplateName)					
							{
								Q.checkin();
							}else{
								/*var confirmValue = confirm(ARTWORK_TEMPLATE_LABLES['emxAWL.Message.NoTemplateCheckinConfirmMsg']);
								if(confirmValue){
									Q.associateTemplates();
								}*/
                                Q.showJavaScriptConfirmBox(ARTWORK_TEMPLATE_LABLES['emxAWL.Message.NoTemplateCheckinConfirmMsg'], function (confirmValue) {
                                    if (confirmValue) {
                                        Q.associateTemplates();
                                    }
                                });
							}
					});
			    });
			});
	 });
}

setupQt();

/* Method to handle Tooltip for Action commands */
function addTooltipToActionsCommands() {
		
    $('#searchArtworkTemplatebtn').attr("title", ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.SearchArtworkTemplate']);
    $('#associateArtworkTemplateBtn').attr("title", ARTWORK_TEMPLATE_LABLES['emxAWL.Tooltip.AssociateArtworkTemplate']);
    $('#lockOrUnlockTemplateSpan').attr("title", ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.LockArtworkTemplate']);
    $('#checkinbtn').attr("title", ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.CheckinArtworkTemplate']);
    $('#addCreatebtn').attr("title",ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.CreateNewArtworkTemplate']);
    
    $(document).tooltip();
}


function lockOrUnlock(event) {    
	Q.isArtworkTemplateAssociatedToFile(function(isDocumentHasMapping)
	{
		var lockOrUnlockSpan = $("#lockOrUnlockTemplateSpan");
		if(!isDocumentHasMapping)
			Q.showNotification(ARTWORK_TEMPLATE_LABLES['emxAWL.Message.ArtworkTemplateInfoMissing']);
		else
		{
			//lockOrUnlockSpan.tooltip("disable");
			var lockOrUnlockUrl = isLocked ? unlockTemplateUrl : lockTemplateUrl;
			artworkTemplateName = $("#templateName").text();
			$.ajax({
				data:{TemplateName : artworkTemplateName},
				url : lockOrUnlockUrl+"/"+artworkTemplateName,
				success : function(data){
					objectData = $.parseJSON(data);
					var result = objectData.result;
					if(result== "success") {
						isLocked = isLocked ? false : true;
						manageLockStatus(isLocked);
					}
					Q.showNotification(objectData.data);
				}
			});
			//lockOrUnlockSpan.tooltip("enable");
		}
	});
}

function manageLockStatus(isLocked) {
    var imageName = isLocked ? "connector/images/unlocked.png" : "connector/images/locked.png";
    $("#lockOrUnlockTemplateSpan img").attr("src", imageName);

    var status = isLocked ? "TRUE" : "FALSE";
    $("#lockStatus").text(status);

	var tooltip = isLocked ? ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.UnlockArtworkTemplate'] : ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.LockArtworkTemplate'];
	$("#lockOrUnlockTemplateSpan").attr("title", tooltip);

	var lockOrUnlockSpan = $("#lockOrUnlockTemplateSpan");
    if(isLocked)
    	lockOrUnlockSpan.removeClass("lockArtworkTemplate");
    else
    	lockOrUnlockSpan.addClass("lockArtworkTemplate");

    Q.repaintPanel();
}

function loadArtworkTemplateInfo(artworkTemplateInfo){    
    $("#templateName").append(getElipsisSpanFromString(artworkTemplateInfo.name, 40 , ""));
    $("#templateDescription").append(getElipsisSpanFromString(artworkTemplateInfo.description, 150 , "templateName"));
    $("#currentState").append(artworkTemplateInfo.status);

    var associatedPOA = artworkTemplateInfo.poaassociated;
    if (associatedPOA == "NA") {
    	associatedPOA = "None";
    }
    $("#poaassociated").append(getObjectSpanWithTooltip(associatedPOA.split(","), "templateName"));
    $("#countriesAssociated").append(getObjectSpanWithTooltip(artworkTemplateInfo.countries.split(","), "templateName"));
    $("#placeoforigin").append(getObjectSpanWithTooltip(artworkTemplateInfo.placeoforigin.split(","), "templateName"));

    isLocked = objectData.data.artworkTemplateInfo.lockStatus;
    var status = isLocked ? "TRUE" : "FALSE";
    var imageName = isLocked ? "connector/images/unlocked.png" : "connector/images/locked.png";
    $("#lockOrUnlockTemplateSpan img").attr("src", imageName);
    var tooltip = isLocked ? ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.UnlockArtworkTemplate'] : ARTWORK_TEMPLATE_LABLES['emxAWL.ToolTip.LockArtworkTemplate'];
    $("#lockOrUnlockTemplateSpan").attr("title", tooltip);
    $("#lockStatus").append(status);
}

function updateTemplateInfo() {
    addProgessInfo();
    if(!isProcessing){
        isProcessing = true;
        $.ajax({
            data:{artworkTemplateName : artworkTemplateName},
            url : getArtworkTemplateInfoUrl,
            success : function(data){
                isProcessing = false;
                objectData = $.parseJSON(data);
                loadArtworkTemplateInfo(objectData.data.artworkTemplateInfo);
                removeProgessInfo();
            }
        });
    }
}

function getCommandsImageHTML(className, imageName) {
    if(className == "" || className == "null" || className == null)
            return $("<img></img>").attr("src","connector/images/"+imageName);
    return $("<img></img>").addClass(className).attr("src","connector/images/"+imageName);
}

function addProgressInfoToDiv() {
        var progressText = $("<span>").attr("class","progressWheelContent").attr("id","progressWheelText");
        var progressWheelSpan = $("<span>").attr("class","progressWheelContent").append(getCommandsImageHTML("syncElementsbtn","iconLoadingWheel.gif"));
        $("#actions").append(progressWheelSpan).append(progressText);
}

function addProgessInfo(){
    $(".progressWheelContent").show();
}

function removeProgessInfo(){
    $(".progressWheelContent").hide();
}

function clearTemplateAssembly(){
	$("#templateName").empty();
	$("#templateDescription").empty();
	$("#poaassociated").empty();
	$("#countriesAssociated").empty();

	$("#placeoforigin").empty();
	$("#currentState").empty();
	$("#lockStatus").empty();
}
