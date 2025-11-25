<%--  AWLCreateFormUIValidation.jsp

   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
   
   This jsp is used to validate the webform fields in create mode
 --%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<script language="javascript" src="../common/scripts/emxJSValidationUtil.js"></script>

<%
	out.clear();
String browserLang = request.getHeader("Accept-Language");
%>

/* Checking for Bad characters in the field */
function CheckBadNameChars(fieldname) {
    //if(!fieldname)
    fieldname=this;
    if(!fieldname.value){
      fieldname = document.getElementById(fieldname);
    }
    var isBadNameChar=checkForNameBadChars(fieldname,true);
    if( isBadNameChar.length > 0 )
    {
	     msg = "<%=XSSUtil.encodeForJavaScript(context,AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.InvalidChars", browserLang))%>";
	     msg += "\n";
	     msg += isBadNameChar;
	     alert(msg);
	     fieldname.focus();
	     return false;
    }
    return true;
}

function checkAcessForYesOnTranslate()
{
	var inlineTranslationField = FormHandler.Fields._container.InlineTranslation;
	var inlineRadioFields = inlineTranslationField.HandlerField||[];
	var canDisable = "No" == emxFormGetValue("Translate").current.actual;
	for(var i=0; i < inlineRadioFields.length; i++) {
		var currentRadioField = inlineRadioFields[i];
		var isYesRadioField = "Yes" == currentRadioField.value;
		if(isYesRadioField){
			currentRadioField.disabled = canDisable;
		} else {
			emxFormSetValue("InlineTranslation", inlineTranslationField.ActualValue, inlineTranslationField.ActualValue);
		}
	}
}

function checkAcessForYesOnBuildFromList()
{
	var urlStr = document.location.href;
	if(urlStr.indexOf("fromConnector=true") !=-1) {
		
		var customCSS = ".customstyle:checked:after { width: 10px; height: 10px; border-radius: 15px; top: 3px; left: 3px; position: relative; background-color: royalblue; content: ''; display: inline-block; visibility: visible; }", 
			head = document.head, 
			styleTag = document.createElement('style');

			head.appendChild(styleTag);
			styleTag.type = 'text/css';
			styleTag.appendChild(document.createTextNode(customCSS));
		
		var traslateRadios = emxFormGetFieldHTMLDOM("Translate");
		traslateRadios.forEach(function(currentItem) {
			currentItem.classList.add("customstyle");
		});
		var intraslateRadios = emxFormGetFieldHTMLDOM("InlineTranslation");
		intraslateRadios.forEach(function(currentItem) {
			currentItem.classList.add("customstyle");
		});
	}
	
	/* Build from list is redundant 
		called from field BuildFromList of form type_MasterCopyElement which is hidden now
	*/
   /*
    var buildFrmListItemForYes = document.forms[0].elements["BuildFromList"][0];
    var inlineTranslationForYes = document.forms[0].elements["InlineTranslation"][0];
    if(buildFrmListItemForYes.checked)
    {
        if(inlineTranslationForYes.checked)
        {
            inlineTranslationForYes.checked = false ;
            document.forms[0].elements["InlineTranslation"][1].checked = true ;
        }
          inlineTranslationForYes.disabled = true;
          changeVisibilityForYes();
    }else
    {
         inlineTranslationForYes.disabled = false;
         changeVisibilityForNo();
    }
    */
    
}
var removeCopyText = "No";
function changeVisibilityForNo()
{
    
    document.forms[0].elements["ListSeparator"].disabled=true;
    document.getElementById("AddListItemButton_html").style.display = 'none';
    if(removeCopyText=="Yes")
        $('#CopyTextId').val('');    
    else
        removeCopyText = "Yes"
    document.forms[0].elements["CopyText"].enableRTE();
}

function changeVisibilityForYes()
{
        
   document.forms[0].elements["ListSeparator"].disabled=false;

   document.getElementById("AddListItemButton_html").style.display = "";
    $('#CopyTextId').unbind();
    if(removeCopyText=="Yes"){
        $('#CopyTextId').val('');
        changeCopyText(document.forms[0].elements["ListSeparator"]);
    }
    else   
        removeCopyText = "Yes";  
    document.forms[0].elements["CopyText"].disableRTE();
}

function changeCopyText(select)
{
    var sep = select.value;
    var copyTextElements = document.forms[0].elements["CopyText"];
    var  copytext = copyTextElements;
    var seqnumber = "";  
    
    var copyvalye = [];

    var listItemSequence=document.forms[0].listItemSequence.value;  

    var addtionalInfo =document.forms[0].addtionalInfo.value;  
    
    var hidCopyTextInfo =document.forms[0].hidCopyTextList.value;
  
    var arraySeqNum=new Array();

    var arraySeq=new Array();

    var addInfo=new Array();
    
    var copytextArray =new Array();

    var seq="";

    arraySeqNum=listItemSequence.split(",");

    addInfo= addtionalInfo.split("|");
    
    copytextArray= hidCopyTextInfo.split("|");
    
    
    for(var j=0;j < arraySeqNum.length;j++)
    {  
     

        seq=arraySeqNum[j];
        arraySeq=seq.split("|");
        seqnumber=arraySeq[0];
       
        var seqnum = parseInt(seqnumber);
        //copyvalye[seqnum-1]=listCopyItems[j].copyText+addInfo[j];
        copyvalye[seqnum-1]=copytextArray[j]+addInfo[j];
    }
     var copytextValue = copyvalye.join(sep);
     copytext.updateRTE(copytextValue);
     

} 

//Pre process javascript for Element creation from POA-Edit screen
function createElementFromPOAEdit() 
{
        //AA1: For Reloading field.
        //R2J: Modifying for Multi POAs
        if(document.forms[0].elements["PlaceOfOrigin"])
        {
        	emxFormReloadField("PlaceOfOrigin");
        	var hierarchyIds = document.forms[0].elements["PlaceOfOrigin"].value;
        	hierarchyIds = hierarchyIds.split(",");
        	if(hierarchyIds.length > 1)
        	{
        		$('input[name="btnPlaceOfOrigin"]').attr("disabled", "disabled");
        		$('input[name="PlaceOfOriginDisplay"]').attr("readonly", "true");
        	}
        }
}

function addNewAC() {
    
    if ($("[id='true']").attr('checked')) 
        {
            $('input[name="btnArtworkChangeSelected"]').attr("disabled", "disabled");
            $('input[name="ArtworkChangeSelectedDisplay"]').attr("disabled", "disabled");
            $('input[name="ArtworkChangeSelectedDisplay"]').val("");
            $('#calc_ArtworkChangeDescription').next().show();
            $('#calc_ArtworkChangeDescription').next().next().show();
        }
        else
        {
            $('input[name="btnArtworkChangeSelected"]').removeAttr("disabled");
            $('input[name="ArtworkChangeSelectedDisplay"]').removeAttr("disabled");
            $('#calc_ArtworkChangeDescription').next().hide();
            $('#calc_ArtworkChangeDescription').next().next().hide();
        }
}

function changeWidthOfLang() {
	var selectedLanguage = document.forms[0].elements["SelectedLanguageForInline"];
	if(selectedLanguage)
	{
		selectedLanguage.style = "width:85%";
	}
}

function makeReadOnlyMasterCopyField() {
	var copyTextElement = document.forms[0].elements["BaseCopyTextReadOnly"];
	if(copyTextElement)
	{
		copyTextElement.disableRTE();
		
	}
}

// This API is called when user wants to create new inline copy for 
function makeReadOnlyLocalCopyField() {
	var localCopyTextField = document.forms[0].elements["LocalCopyText"]||document.forms[0].elements["CopyText"];
	if(localCopyTextField) {
		localCopyTextField.disableRTE();
	}
}

