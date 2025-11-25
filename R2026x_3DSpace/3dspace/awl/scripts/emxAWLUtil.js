 //=================================================================
// JavaScript Methods for utility functions 
// emxAWLUtil.js
//
// Copyright 1993-2007 Dassault Systemes.
// All Rights Reserved.
// This program contains proprietary and trade secret information of Dassault Systemes.
// Copyright notice is precautionary only 
// and does not evidence any actual or intended publication of such program 
//
// static const char RCSID[] = $Id: /web/awl/emxAWLUtil.js 1.2.1.1 Wed Jan 07 09:33:18 2009 GMT ds-shbehera Experimental$
//=================================================================


//IR-153634V6R2013x double submit issue start
var canSubmitArtworkContent=true;
 
//Fix IR-241686V6R2013x 
function toggleProgressIndicator(showIndicator) 
{
 	//Artwork Package/Single Task page - it will be detailsDisplay
 	//Multi Task Page - it will be content
	var frameObj = findFrame(getTopWindow(),"detailsDisplay");
	frameObj = frameObj != null ? frameObj : findFrame(getTopWindow(), "content");
	
	if(showIndicator) {
		if(frameObj != null && frameObj.turnOnProgress)
			frameObj.turnOnProgress();
		else if(turnOnProgress) 
			turnOnProgress();
 	} else {
		if(frameObj != null && frameObj.turnOffProgress)
			frameObj.turnOffProgress();
		else if(turnOffProgress) 
			turnOffProgress();
 	}
}
  
function resetArtworkSubmitFlag() {
	canSubmitArtworkContent = true;
}

//Call back function after completing the task (in all navigations for all tasks)
function submitArtworkRefreshViewCallback(data, callback)
{
	refreshViewCallback(data, callback);
	canSubmitArtworkContent = true;
	toggleProgressIndicator(false);
}

//Invoked Approve/Reject FDA window.
function doSubmitArtworkContentAction(json, fnsuccess, fnerror, fncomplete, artworkAction)
{	
	var param = "service=" + artworkAction;
	param     += "&artworkId=" + getArtworkId();
	param     += "&languageType=" + getLanguageType();
	param     += "&actionType=" + getActionType();
	param     += "&data=" + encodeURIComponent(json);
	
	var paction = getProcessAction(fnsuccess, fnerror, fncomplete);
	//turnOnProgress();
		
	canSubmitArtworkContent=false;
	
	
	var xHttp = emxUICore.getDataPost("../awl/AWLArtworkServiceProcess.jsp", param, submitArtworkRefreshViewCallback, paction);
}


function openArtworkContentSubmission(submitAction) 
{
	toggleProgressIndicator(true);
	var url = "../awl/AWLArtworkElementContentSubmitFS.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&artworkContentSubmitAciton="+submitAction;
	performPopupAction(url, "true", "535", "315");	
	canSubmitArtworkContent = true;
}

//Function invoked from Artwork Package/MultiTask page
//Master and Local Copy Approval
function submitArtworkContentApproval()
{
	if(!canSubmitArtworkContent){		
		alert(AWL.ARTWORK_DOUBLE_SUBMIT_MESSAGE);    
		return;
	}
	canSubmitArtworkContent = false;
	openArtworkContentSubmission(AWL.ARTWORK_CONTENT_SUBMIT_APPRORVE);
}

//Function invoked from Artwork Package/MultiTask page
//Master and Local Copy Rejection
function submitArtworkContentRejection()
{
	if(!canSubmitArtworkContent){		
		alert(AWL.ARTWORK_DOUBLE_SUBMIT_MESSAGE);    
		return;
	}
	canSubmitArtworkContent = false;
	openArtworkContentSubmission(AWL.ARTWORK_CONTENT_SUBMIT_REJECT);
}
//Function invoked from Artwork Package/MultiTask page
//Master and Local Copy Authoring

function submitArtworkContentAuthoring()
{
	if(!canSubmitArtworkContent){		
		alert(AWL.ARTWORK_DOUBLE_SUBMIT_MESSAGE);    
		return;
	}
	if(emxEditableTable.checkDataModified())
	{
        alert(emxUIConstants.STR_SBEDIT_SAVE_THE_CHANGES);    
        return;
	}
	toggleProgressIndicator(true);
	
	var errorMessage = AWL.SUBMIT_AUTHORING_MESSAGE;
	var checkedRows   = getCheckedRows();
	
	var allowSubmit  = true;
	var ids          = [];
	
	for(var x = 0; x < checkedRows.length; x++)
	{
		var row = checkedRows[x];
		if(!validateAuthoring(row))
		{
			allowSubmit = false;
			break;
		}else
		{
			ids.push(getCopyId(row));
		}
	}
	
	if(allowSubmit)
	{
		canSubmitArtworkContent = false;
		openArtworkContentSubmission(AWL.ARTWORK_CONTENT_SUBMIT_AUTHOR);
	} else {
		alert(errorMessage);
		toggleProgressIndicator(false);
	}	
}

function validateAuthoring(row)
{
	//CurrentCopyText in  case of local copy will be without language this is done for adding the key in Input Filter skip list.
	var newColumn      = "CurrentCopyText";
	var rowId          = getId(row);
	var newValue       = emxEditableTable.getCellValueByRowId(rowId, newColumn);

	var isContentNotEmpty = newValue.value.current.display.length > 0;
	var isGraphic = searhkeyInArray(AWLGraphicTypesArr ,newValue.type);
	var isStructure = searhkeyInArray(AWLStructureTypesArr ,newValue.type);
	if(isContentNotEmpty || isGraphic || isStructure)
	{
		return true;
	}
	return false;
}

function openTaskInfo(link, taskId, taskName)
{
	//Start commented and modified by VD8 for 2012x
	//var url = "../components/emxTaskDetailsFS.jsp?suiteKey=Components&StringResourceFileId=emxComponentsStringResource&SuiteDirectory=components"
	//url += "&taskname=" + taskName + "&objectId=" + taskId;
	var url = "../common/emxForm.jsp?form=type_InboxTask&formHeader=emxComponents.Common.TaskDetails&HelpMarker=emxhelptaskproperties&Export=false&findMxLink=false&toolbar=AWLInboxTaskActionsToolbar&suiteKey=Components";
	url += "&objectId=" + taskId;
	//End commented and modified by VD8 for 2012x

	showModalDialog(url, 535, 535, true, "MediumTall");
	if(getTopWindow().modalDialog && getTopWindow().modalDialog.contentWindow)
	{	
		emxUICore.addEventHandler(getTopWindow().modalDialog.contentWindow, isIE ? "unload" : "beforeunload", function() { 
			reloadCurrentStructure();
			//IR-217343V6R2014 - commented by K3D  15/02/2013 -start
			//getTopWindow().modalDialog.contentWindow.close();
			//IR-217343V6R2014 - end
		});
	}
}

function openCompareByLanguage()
{
	var id   = getArtworkId();
	var languageType  = getLanguageType();
	var compLang  = getCompareLanguage();
	var url  = "../awl/AWLCompareLanguage.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl";
	url      += "&objectId=" + id;
	url      += "&languageType=" + languageType;
	url      += "&compareLanguage=" + compLang;
	showModalDialog(url, 180, 180, true, "Small");
}

//NQG 2012x.HF1
//To list all Local Copy Elements for the selected Copy Element (language)
function openInlineLocalCopyList(copyId, languageType)
{
	var url  = "../common/emxIndentedTable.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&table=AWLInlineLocalCopyList&program=AWLArtworkPackageUI:getInlineLocalElementsList";
	url      += "&header=emxAWL.Label.AWLInlineLocalCopyList&customize=false&Export=false&PrinterFriendly=false&HelpMarker=false&multiColumnSort=false&showPageURLIcon=false&displayView=details";
	url      += "&objectId=" + copyId + "&languageType=" + languageType;
	showModalDialog(url, 555, 400, true);
}

//Artwork
function openAdvancedEdit(link, columnName)
{
	if(editableTable.mode != "edit") return;
	var rowId      = link.parentNode.parentNode.getAttribute("id");
	var row        = getRow(rowId);
	var objectId   = link.getAttribute("copyId");//getAttribute(row, "o");
	var relId      = getAttribute(row, "r");
	var parentId   = getAttribute(row, "p");		
	var url        = "../awl/AWLAdvancedEditFS.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl";
	url			  +=	"&objectId=" + objectId + "&relId=" + relId +"&parentOID=" + parentId + "&rowId=" + rowId + "&columnName=" + columnName;
	
	performPopupAction(url, "true", "535", "315");
}

//Used for Ingredient List Item edit
function openAdvancedEditWithBuildListTrue(link, columnName)
{
	
	if(editableTable.mode != "edit") return;
	var rowId      = link.parentNode.parentNode.getAttribute("id");
	var row        = getRow(rowId);
	var objectId   = link.getAttribute("copyId");//getAttribute(row, "o");
	var featureId   = link.getAttribute("featureId");	
	var parentId   = getAttribute(row, "p");		
	var url        = "../awl/AWLAdvancedEditFS.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&BuildList=true";
	url			  +=	"&objectId=" + objectId + "&parentOID=" + parentId + "&rowId=" + rowId + "&columnName=" + columnName + "&featureId=" + featureId;
	
	performPopupAction(url, "true", "535", "350");
}

function doArtworkFilter()
{	
	if(emxEditableTable.checkDataModified())
	{
        alert(emxUIConstants.STR_SBEDIT_SAVE_THE_CHANGES);        
        filter.selectedIndex = filter.value == "ShowMine" ? 1 : 0;        
        return;
    }else
	{
    	//Modified for IR-457569-3DEXPERIENCER2017x -- Start
    	//reloadCurrentStructure();
    	filterPage();
    	//Modified for IR-457569-3DEXPERIENCER2017x -- End
	}
}

var mouseOverId = "";

var tooltip = null;

function showTooltip(evnt, elem, message)
{
	//if(id == null || id == "") return;
	emxUITooltips.SHOW_DELAY = 0;//500;
	emxUITooltips.PADDING    = "4px";
	emxUITooltips.BGCOLOR    = "#D8E2F3";
	emxUITooltips.MOVEWITHMOUSE = true;
	if(tooltip == null)
	tooltip = new emxUITooltipManager();
	
	tooltip.hideTooltip(evnt, true);
	tooltip.cleanUpTooltip();
	tooltip.tips = [];
	//if(mouseOverId != "")	
	tooltip.addTooltipFor(elem, message, true, evnt);
}

function hideTooltip(evnt, ele)
{
	if(tooltip != null)
	{
		tooltip.hideTooltip(evnt, true);
		tooltip.cleanUpTooltip();
	}
}

function showStateStatusOver(evnt, elem, id)
{	
	var objEvent = evnt;
	if(!evnt)
	{	
	  objEvent = emxUICore.getEvent();
	}
	objEvent    = { clientX : objEvent.clientX, clientY :  objEvent.clientY };
	mouseOverId = id;
	fetchStateStatus("objectId=" + id, { id : id, event : objEvent, elem : elem });
}

function showStateStatusOut(evnt, ele, id)
{
	if(mouseOverId == id)
	mouseOverId = "";	
	hideTooltip(evnt, ele);
}

function callback(data, ext)
{
	if(mouseOverId == ext.id)
	{
		data = eval('(' + data + ')');
		showTooltip(ext.event, ext.elem, data.message);
	}
}

function fetchStateStatus(param, ext)
{
	var xHttp = emxUICore.getDataPost("../awl/AWLArtworkServiceProcess.jsp", param, callback, ext);
}

function getArtworkId()
{
	var id = document.getElementById("objectId");
	if(id == null)
		return null;
	return id.value;
}
//NQG 2012x.HF1
function getCopyId(row)
{
	return getAttribute(row, "o");
}

function getLanguageType()
{	
	var langfilter  = document.getElementById("AWLLocalCopyLanguageFilter");
	return langfilter ? langfilter.value : "";
}

function getActionType()
{
	var actionType  = document.getElementById("actionType");
	return actionType ? actionType.value : "";
}

function getFilterType()
{
	var ownerfilter  = getTopWindow().document.getElementById("AWLOwnerFilter");
	return ownerfilter ? ownerfilter.value : "";
}

var compareLanguage = "";
function getCompareLanguage()
{
	return compareLanguage;
}

function setCompareLanguage(langs)
{
	compareLanguage = langs;
}

function getFilter(ext)
{
	var languageType  = getLanguageType();
	var filterType    = getFilterType();
	var compLang      = getCompareLanguage();
	resetParameter("languageType", languageType );
	resetParameter("filterType", filterType);	
	resetParameter("compareLanguage", compLang );
	languageType = !languageType ? "null" : languageType;
	filterType   = !filterType ? "null" : filterType;
	compLang     = !compLang ? "null" : compLang;
	return "{ filterType : \"" + filterType + "\", languageType : \"" + languageType + "\", compareLanguage : \"" + compLang + "\" }";
}

function fixLayout()
{
	rebuildView();
	FreezePaneUtils.adjustTableColumns();
	//FreezePaneUtils.adjustTableColumns();
	//adjustPanes();
	//synchTreeandTable();
	//onResizeTimeout();
	//rebuildView();
	//FreezePaneUtils.adjustTableColumns();	
	//setTimeout("rebuildView()",50);
}

function reloadCurrentStructure()
{
	editableTable.loadTextSearchResults();
	fixLayout();
}

function filterByLanguage()
{	
	if(emxEditableTable.checkDataModified())
	{
        alert(emxUIConstants.STR_SBEDIT_SAVE_THE_CHANGES);  
        return;
    }else
	{
    	//Modified for IR-457569-3DEXPERIENCER2017x -- Start
    	//reloadCurrentStructure();
    	filterPage();
    	//Modified for IR-457569-3DEXPERIENCER2017x -- End
	}
}

function filterByCompareLanguage(langs)
{
	var compLan = langs.join(",");
	
	if(emxEditableTable.checkDataModified())
	{
        alert(emxUIConstants.STR_SBEDIT_SAVE_THE_CHANGES);    
        return;
    }else
	{
    	if(getCompareLanguage() != compLan)
    	{
    		setCompareLanguage(compLan);
        	reloadCurrentStructure();
    	}
	}
}

function searhkeyInArray(arr,key)
{
	for(var i = 0; i < arr.length; i++) {
	    var pos = arr[i].search(key);
	    if(pos > -1){
	      return true;
	    }
	  }
	  return false;	
}

function successAction(data)
{
	if(data && data.message && data.message.length > 0) 
		alert(data.message);
}

function errorAction(data)
{
	if(data && data.hasError)
	alert(data.error);
}

function completeAction(data, completed)
{
	if(data && data.notice)
	alert(data.notice);
		
	var xlistHidden = document.getElementById('listHidden');
	if(xlistHidden)
	{
		xlistHidden.src = "../common/emxMQLNoticeWrapper.jsp";
	}
	
	if(completed) 
	reloadCurrentStructure();
}

function getProcessAction(fnsuccess, fnerror, fncomplete)
{
	fnsuccess  = fnsuccess ? fnsuccess   : successAction;
	fnerror    = fnerror   ? fnerror     : errorAction;
	fncomplete = fncomplete ? fncomplete : completeAction;
	return { success : fnsuccess, error : fnerror, complete : fncomplete };
}

function refreshViewCallback(data, callback)
{
	data = eval('(' + data + ')');
	if(data.action == "success")
	{
		if(callback.success)
		callback.success(data);
		
	}else
	{
		if(callback.error)
		callback.error(data);
	}

	if(callback.complete)
	callback.complete(data, data.action == "success");
	
	toggleProgressIndicator(false);
}

function pageLoad()
{
	if(window.rebuildView)
	{
		setTimeout(function() {
			try
			{
				fixLayout();
				
			}catch(e)
			{
				pageLoad();
			}
		}, 200);
	}
}
//Added by bw3 to set current cursor position

function setCursorPosition(pos,field)
{	
    var obj=field;


    if(obj.setSelectionRange)
    {
      obj.focus();
      obj.setSelectionRange(pos,pos);
    }   
}

//bw3 Done

(function() {
	window.emxUICore ? emxUICore.addEventHandler(window, "load", pageLoad) : window.onload = pageLoad; 
})();

//H49 2011x.FD04
function openManageCountryAssignments(id)
{
	var vURL = "../awl/emxAWLCommonFS.jsp?functionality=ViewCountriesFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl&objectId="+id + "&heading=emxAWL.Heading.ViewCountriesAssociated";
    var vISModal = true;
    getTopWindow().showSlideInDialog(vURL, vISModal);
}

function openSelectiveTranslationWindow(id)
{
	var vURL = " ../awl/emxAWLCommonFS.jsp?functionality=SelectiveTranslationFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl&objectId="+id + "&heading=emxAWL.Heading.SelectiveTranslations";
    var vISModal = true;
    getTopWindow().showSlideInDialog(vURL, vISModal);
}

/**
 * Opens a Slide in Dialog to Show Associated Objects Assigned to given Context Object.
 * @param Context Object Id
 * @author R2J (Raghavendra M J)
 * @since VR2015x.HF1
 */
function showAssociatedObjects(objectId, rel_Name, toBeFetchedtype, fromSide, sort, header)
{
		var appendString = "&objectId=" + objectId + "&rel_Name=" + rel_Name + "&toBeFetchedtype=" 
		+toBeFetchedtype +  "&fromSide=" + fromSide 
		+ "&sort=" + sort + "&heading=" + header;   
		var vURL = "../awl/emxAWLCommonFS.jsp?functionality=ViewAssociatedObjectsFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl" + appendString;
		getTopWindow().showSlideInDialog(vURL, true);
}

/**
 * Opens a Slide in Dialog to Show Associated Objects Assigned to given Context Object.
 * @param Context Object Id
 * @author R2J (Raghavendra M J)
 * @since VR2015x.HF6
 */
function showAssociatedObjectsUsingJPO(program, method, args, argNames, header)
{
		var appendString = "&program=" + program+ "&method=" + method
		+ "&" + args + "&argNames=" + argNames 
		+ "&heading=" + header+"&queryForJPO=true";   

		var vURL = "../awl/emxAWLCommonFS.jsp?functionality=ViewAssociatedObjectsFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl" + appendString;
		getTopWindow().showSlideInDialog(vURL, true);
}

function validateUploadImage(objectId, warningmsg)
{
	if(emxEditableTable.checkDataModified())
	{
        alert(emxUIConstants.STR_SBEDIT_SAVE_THE_CHANGES);    
        return;
	}
	openGraphicAuthoring(objectId);
}

function singleTaskGraphicAuthoring() {
	openGraphicAuthoring(emxUICore.getContextId());
}

function openGraphicAuthoring(objectId) {
	var strURL ="../awl/AWLGraphicAuthoring.jsp?objectId="+objectId; 
	//showModalDialog(strURL,200,200,false,"MediumTall");
	var width=700,height=700;
	var intLeft = parseInt((screen.width - width) / 2);
    var intTop = parseInt((screen.height - height) / 2);
	var ftrs = "width="+width+",height="+height;
	if(isIE_M) {
		ftrs+=",left="+intLeft+",top="+intTop;
	} else {
		ftrs+=",screenX="+intLeft+",screenY="+intTop;
	}
	var navDlg = openNavigatorDialog(strURL,ftrs);
	var graphictimer = setInterval(function(){checkGrpahicAuthWin(navDlg,graphictimer)}, 500);
}

function checkGrpahicAuthWin(navDlg,graphictimer) {
	if(navDlg.closed){
		var frameContent = findFrame(getTopWindow(), "detailsDisplay");
		if (frameContent == null ) {
	        frameContent = findFrame(getTopWindow(), "AWLArtworkInboxTaskMasterCopyAuthoring");
	    }
	    if (frameContent != null ) {
			frameContent.location.href = frameContent.location.href;
		}
	    clearInterval(graphictimer);
	}
}

//by e55 for IR-161865V6R2013x 
function onChangeAuthoringPerson()
{	
	updateAuthoringRouteTemplate(true);
	
	var strAuthorPersonOID = getAuthorPersonOID(); 
	var strActionType = document.forms[0].actionType.value;
	var strAuthorPersonDisplayValue = getAuthorPersonDisplayValue();
	var strApproverPersonDisplayValue =  getApproverPersonDisplayValue(); 
	var strApproverRouteTemplateDisplayValue =  getApproverRouteTemplateDisplayValue();
		
	if(strApproverPersonDisplayValue == "" && strApproverRouteTemplateDisplayValue == "")
	{
		enableDisableAssignAuthorAsApprover(strAuthorPersonOID, strActionType);
	}
	
	if(strAuthorPersonDisplayValue == "")
	{
		updateAuthoringRouteTemplate(false);
		updateAssignAuthorAsApprover(true);
		
		if(strApproverPersonDisplayValue != "")
		{
			updateApproverRouteTemplate(true);
		}
		else if(strApproverRouteTemplateDisplayValue != "")
		{
			updateApproverPerson(true);
		}
		else
		{
			updateApproverPerson(false);
			updateApproverRouteTemplate(false);
		}
	}
}

function onChangeAuthoringRT()
{
	updateAuthoringPerson(true);
	var strObjectID = getAuthorRouteTemplateOID();
	var strActionType = document.forms[0].actionType.value;
	var strAuthorRouteTemplateDisplayValue = getAuthorRouteTemplateDisplayValue();
	var strApproverPersonDisplayValue =  getApproverPersonDisplayValue(); 
	var strApproverRouteTemplateDisplayValue =  getApproverRouteTemplateDisplayValue();
	
	enableDisableAssignAuthorAsApprover(strObjectID, strActionType);
		
	if(strAuthorRouteTemplateDisplayValue == "")
	{
		updateAuthoringPerson(false);
		updateAssignAuthorAsApprover(true);
		
		if(strApproverPersonDisplayValue != "")
		{
			updateApproverRouteTemplate(true);
		}
		else if(strApproverRouteTemplateDisplayValue != "")
		{
			updateApproverPerson(true);
		}
		else
		{
			updateApproverPerson(false);
			updateApproverRouteTemplate(false);
		}
	}
}

function enableDisableAssignAuthorAsApprover(strObjectID, strActionType) {
	
	var param = "service=TaskAssignment&objectId=" + strObjectID;
	param += "&actionType=" + strActionType;
	var xHttp   = emxUICore.getDataPost("../awl/AWLArtworkServiceProcess.jsp", param, function(data) {
	
	data = eval('(' + data + ')');
	if(data.hasApprovalAccess == "true")
	{
		updateAssignAuthorAsApprover(false);
	}
	else if(data.hasApprovalAccess == "false")
	{
		updateAssignAuthorAsApprover(true);
		updateApproverPerson(false);
		updateApproverRouteTemplate(false);
		updateAssignAuthorAsApproverHiddenValue(false);
	}	
	turnOffProgress();
});
}

function onChangeApproverPerson()
{	
	var strApproverPersonDisplayValue =  getApproverPersonDisplayValue();
	
	updateApproverRouteTemplate(true);
	updateAssignAuthorAsApprover(true);
	
	if(strApproverPersonDisplayValue == "")
	{
		updateApproverRouteTemplate(false);
		hasApprovalAssignee();
	}	
}

function onChangeApproverRT()
{
	var strApproverRouteTemplateDisplayValue =  getApproverRouteTemplateDisplayValue();
	
	updateApproverPerson(true);
	updateAssignAuthorAsApprover(true);
	
	if(strApproverRouteTemplateDisplayValue == "")
	{
		updateApproverPerson(false);
		hasApprovalAssignee();
	}
}

function onChangePOAApproverPerson()
{	
	var strApproverPersonDisplayValue =  getApproverPersonDisplayValue();
	
	updateApproverRouteTemplate(true);
	
	if(strApproverPersonDisplayValue == "")
	{
		updateApproverRouteTemplate(false);
	}	
}

function onChangePOAApproverRT()
{
	var strApproverRouteTemplateDisplayValue =  getApproverRouteTemplateDisplayValue();
	
	updateApproverPerson(true);
	
	if(strApproverRouteTemplateDisplayValue == "")
	{
		updateApproverPerson(false);
	}
}

function hasApprovalAssignee()
{
	var strAuthorPersonDisplayValue = getAuthorPersonDisplayValue();
	var strAuthorRouteTemplateDisplayValue = getAuthorRouteTemplateDisplayValue();
	var strActionType = document.forms[0].actionType.value;
	var strObjectID = "";
	
	if(strAuthorPersonDisplayValue != "")
	{
		strObjectID = getAuthorPersonOID(); 
	}
	else if(strAuthorRouteTemplateDisplayValue != "")
	{
		strObjectID = getAuthorRouteTemplateOID(); 
	}
	
	enableDisableAssignAuthorAsApprover(strObjectID, strActionType);
}

function onChangeAssignAuthorAsApprover()
{
	if (checkedAssignAuthorAsApprover()) {
		updateApproverPerson(true);
		updateApproverRouteTemplate(true);
		updateAssignAuthorAsApproverHiddenValue(true);
	}
	if (!checkedAssignAuthorAsApprover()) {
		updateApproverPerson(false);
		updateApproverRouteTemplate(false);
		updateAssignAuthorAsApproverHiddenValue(false);
	}
}

function toggleArtWorkPackageCreationElements(elem)
{
	if(elem.id == "createNew") {
		document.forms[0].elements["artworkPackageFieldDisplay"].readOnly = true;
		document.forms[0].elements["btnartworkPackageField"].disabled = true;
		document.forms[0].elements["artWorkDescription"].disabled = false;
		document.forms[0].elements["artworkPackageFieldDisplay"].value = "";
	}
	if(elem.id == "useExisting") {
		document.forms[0].elements["artworkPackageFieldDisplay"].readOnly = false;
		document.forms[0].elements["btnartworkPackageField"].disabled = false;
		document.forms[0].elements["artWorkDescription"].disabled = true;
		document.forms[0].elements["artWorkDescription"].value = "";
	}
}

//BV8
function validateBaseSkuForm() {
	
	//validation for artworkelement
	var artWorkSelectionOk = false;
	for (i=0;i<document.forms[0].artworkTypeChoose.length;i++) {
		if(document.forms[0].artworkTypeChoose[i].checked){
			if(document.forms[0].artworkTypeChoose[i].id == "createNew") {
				if(document.forms[0].elements["artWorkDescription"].value == "") {
					alert("Plese enter the description");
					return false;
				}else {
					artWorkSelectionOk = true;
					break;
				}
			} else if(document.forms[0].artworkTypeChoose[i].id == "useExisting") {
				if(document.forms[0].elements["artworkPackageFieldDisplay"].value == "") {
					alert("Plese select any artwork package");
					return false;
				} else {
					artWorkSelectionOk = true;
					break;
				}
			}
		}
	}
	
	if(!artWorkSelectionOk) {
		alert("Plese select artwork package option");
		return false;
	}
	
	return true;
}

function disableArtworkPkgField()
{		document.forms[0].elements["createNew"].checked = true;
		document.forms[0].elements["artworkPackageFieldDisplay"].readOnly = true;
		document.forms[0].elements["btnartworkPackageField"].disabled = true;
		document.forms[0].elements["artWorkDescription"].disabled = false;
		document.forms[0].elements["artworkPackageFieldDisplay"].value = "";
}


// B1R
// Checking for Bad characters in the field
function CheckBadNameCharsForDisplayName() {
		var fieldname = document.getElementById("Display Name");
       if(!fieldname)
    	   fieldname=this;
       var isBadNameChar=checkForNameBadChars(fieldname,true);
       if( isBadNameChar.length > 0 )
       {
                msg = "The following characters are invalid \n";
                msg += isBadNameChar;
                alert(msg);
                fieldname.focus();
                return false;
       }
       return true;
}

// Checking for Bad characters in the Text Area field
function checkBadCharsForDescription()
{
		var fieldName = document.getElementById("Description");
        if(!fieldName)
        	fieldName=this;
        var badChars = "";
        badChars=checkForBadChars(fieldName);
        if ((badChars).length != 0)
        {
        	msg = "The following characters are invalid \n";
        	msg += badChars;
        	fieldName.focus();
        	alert(msg);
        	return false;
        }
    return true;
}
//by e55 for IR-161865V6R2013x  
function updateAuthoringPerson(disable)
{
	document.forms[0].elements["AuthorPersonDisplay"].disabled = disable;
	document.forms[0].elements["btnAuthorPerson"].disabled = disable;
}

function updateAuthoringRouteTemplate(disable)
{
	document.forms[0].elements["AuthorRouteTemplateDisplay"].disabled = disable;
	document.forms[0].elements["btnAuthorRouteTemplate"].disabled = disable;
}

function updateApproverPerson(disable)
{
	document.forms[0].elements["ApproverPersonDisplay"].disabled = disable;
	document.forms[0].elements["btnApproverPerson"].disabled = disable;
}

function updateApproverRouteTemplate(disable)
{
	document.forms[0].elements["ApproverRouteTemplateDisplay"].disabled = disable;
	document.forms[0].elements["btnApproverRouteTemplate"].disabled = disable;
}

function updateAssignAuthorAsApprover(disable)
{
	if(disable)
	{
		document.forms[0].elements["AssignAuthorAsApprover"].checked = false;
		document.forms[0].elements["AssignAuthorAsApprover"].disabled = true;
	}
	else 
	{
		document.forms[0].elements["AssignAuthorAsApprover"].disabled = false;
	}
	
}

function updateAssignAuthorAsApproverHiddenValue(value)
{
	document.forms[0].elements["AssignAuthorAsApproverHiddenValue"].value = value;
}

function getAuthorPersonOID()
{
	var strAuthorPersonOID = document.forms[0].elements["AuthorPersonOID"].value;
	return strAuthorPersonOID;
}

function getAuthorRouteTemplateOID()
{
	var strAuthorRouteTemplateOID = document.forms[0].elements["AuthorRouteTemplateOID"].value;
	return strAuthorRouteTemplateOID;
}

function getAuthorPersonDisplayValue()
{
	var strAuthorPersonDisplayValue = document.forms[0].elements["AuthorPersonDisplay"].value;
	return strAuthorPersonDisplayValue;
}

function getAuthorRouteTemplateDisplayValue()
{
	var strAuthorRouteTemplateDisplayValue = document.forms[0].elements["AuthorRouteTemplateDisplay"].value;
	return strAuthorRouteTemplateDisplayValue;
}

function getApproverPersonDisplayValue()
{
	var strApproverPersonDisplayValue = document.forms[0].elements["ApproverPersonDisplay"].value;
	return strApproverPersonDisplayValue;
}

function getApproverRouteTemplateDisplayValue()
{
	var strApproverRouteTemplateDisplayValue = document.forms[0].elements["ApproverRouteTemplateDisplay"].value;
	return strApproverRouteTemplateDisplayValue;
}

function checkedAssignAuthorAsApprover()
{
	var checkedAssignAuthorAsApprover = document.forms[0].elements["AssignAuthorAsApprover"].checked;
	return checkedAssignAuthorAsApprover;
}

function openPlaceOfOrigin(id)
{
	var strURL ="../common/emxIndentedTable.jsp?program=AWLArtworkMasterUI:getConnectedPHPlaceOfOrigin&table=AWLProductHierarchyWorkPlace&header=emxAWL.Table.PlaceOfOrigin&suiteKey=AWL&objectId="+id; 
	showModalDialog(strURL,200,200,false, 'Default'); 
}
function openCopyArtworkPackages(copyId)
{
	var url  = "../common/emxIndentedTable.jsp?table=AWLArtworkPackagesTable&program=AWLArtworkTaskUI:getArtworkElementArtworkPackages&massPromoteDemote=false";
	url      += "&objectId=" + copyId;
	showNonModalDialog(url, 180, 180, true);
}

function openRouteInfo(link, copyId)
{
	var url = "../common/emxTable.jsp?program=AWLArtworkElementUI:getAllRoutes&table=APPObjectRouteSummary&suiteKey=Components&header=emxComponents.Routes.Heading1";
	url += "&objectId=" + copyId;
	showModalDialog(url, 535, 535, true);
}

function openProductManageCandidateMarkets(productId)
{
	var vURL = " ../awl/emxAWLCommonFS.jsp?functionality=AddCountryToProductFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl&selection=multiple&multipleTableRowId=true&allowedTypes=type_CPGProduct&emxTableRowId=" + productId;
	getTopWindow().showSlideInDialog(vURL, true);
}


function addText(field,text)
{
	//IE support
   if (document.selection) {
	   field.focus();
	   sel = document.selection.createRange();
	   sel.text = text;
   }
	   //MOZILLA/NETSCAPE support
   else if (field.selectionStart || field.selectionStart == '0') {
	   var startPos = field.selectionStart;
	   var endPos = field.selectionEnd;
	   field.value = field.value.substring(0, startPos)
	   + text
	   + field.value.substring(endPos, field.value.length);	   
	   //added to set cursor position
	   setCursorPosition(endPos+1,field);
   } else {
	   field.value += text;
   }		                  
}

function toInfoJson(ids, status, comments)
{
	var jsonbuff = [];
	jsonbuff.push("[");
	for(var x = 0; x < ids.length; x++)
	{
		jsonbuff.push("{");
			jsonbuff.push("'id':");
					jsonbuff.push("'" + ids[x] + "'"); 
				jsonbuff.push(",");
			jsonbuff.push("'status':");
				jsonbuff.push("'" + status[x] + "'");
				jsonbuff.push(",");
			jsonbuff.push("'comment':");
				jsonbuff.push("'" + comments[x] + "'");
		jsonbuff.push("}");
		
		if(x != ids.length -1) jsonbuff.push(",");
	}
	jsonbuff.push("]");
	return jsonbuff.join("");
}


function movePOALoadAPDetails(){
	 var ArtworkPackageType= document.editDataForm.elements['ArtworkPackage'];
	 var createNew = ArtworkPackageType[0].checked;
	 var useExisting = ArtworkPackageType[1].checked
	
	 if(createNew){
		$("#calc_UseExisting").hide();
		$("#calc_UseExisting").next().hide();
		$("#calc_Title").show();
		$("#calc_Title").next().show();
		$("#calc_Description").show();
		$("#calc_Description").next().show();
	 }else if(useExisting){
		$("#calc_Title").hide();
		$("#calc_Title").next().hide();
		$("#calc_Description").hide();
		$("#calc_Description").next().hide();
		$("#calc_UseExisting").show();
		$("#calc_UseExisting").next().show();
	 }	
}

function movePOAPreProcess(){
	$("#calc_UseExisting").hide();
		$("#calc_UseExisting").next().hide();
		$("#calc_UseExisting").addClass('labelRequired');
		$("#calc_Title").addClass('labelRequired');
		
		// Create New radio button should be checked by default in ‘Move to Artwork Package’ slide-in.
		document.editDataForm.elements['ArtworkPackage'][0].checked = true;		
}

function selectAllArtworkUsages(){
	$("#ArtworkUsageId option").each(function()
	{
	    $(this).prop('selected', true);
	});
}

function refreshTableFrame(frameName){
	var frameToReload = findFrame(getTopWindow(), frameName);
	if(frameToReload != null)
		frameToReload.location.href = frameToReload.location.href;	
}

function isMobileOrTabletDevice() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
}
	
