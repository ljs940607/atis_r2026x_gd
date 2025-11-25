<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<script language="javascript" src="../common/scripts/emxJSValidationUtil.js"> </script>
<script language="javascript" src="../common/scripts/emxUICore.js"> </script>
<script type="text/javascript">
<%
    String browserLang = request.getHeader("Accept-Language");
	boolean isTargetLocationSlideIn = "slidein".equalsIgnoreCase(request.getParameter("targetLocation"));
	String createNewChangeOrder  = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.CreateNewChangeOrder");
%>




function assignPageValidation()
{
    var authorPerson = document.forms[0].elements["AuthorPersonDisplay"].value;
    var authorRT = document.forms[0].elements["AuthorRouteTemplateDisplay"].value;
    var approverPerson = document.forms[0].elements["ApproverPersonDisplay"].value;
    var approverRT = document.forms[0].elements["ApproverRouteTemplateDisplay"].value;
    
    var isAuthorSelected = !(trimWhitespace(authorPerson) == "" && trimWhitespace(authorRT) == "");
    var isApproverSelected = !(trimWhitespace(approverPerson) == "" && trimWhitespace(approverRT) == "");
    
    if(!isAuthorSelected && !isApproverSelected)
    {
		//XSSOK I18N message
    	alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.ArtworkContent.Alert.SelectAuthorOrApprover", browserLang)%>");
        return false;
    }
    return true;
}


function poaAssigneeValidation()
{   
    var designerPersonDisplay = document.forms[0].elements["DesignerPersonDisplay"].value;

    var approverPerson = document.forms[0].elements["ApproverPersonDisplay"].value;
    var approverRT = document.forms[0].elements["ApproverRouteTemplateDisplay"].value;
    
    
    if((trimWhitespace(designerPersonDisplay)=="")&&(trimWhitespace(approverPerson)=="")&&(trimWhitespace(approverRT)==""))
    {
        //XSSOK I18N message
    	alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.POA.Alert.SelectDesignerOrApprover", browserLang)%>");
        return false;
    }
    return true;
}

function creaetPOAPreProcess()
{       
     document.forms[0].elements["artworkPackageFieldDisplay"].disabled = true;
     document.forms[0].elements["btnartworkPackageField"].disabled = true;
     document.forms[0].elements["artworkPackageFieldDisplay"].value = "";
}

function creaetPOAAPChanged()
{
	var ArtworkPackageType = document.forms[0].elements["ArtworkPackageType"];
	var createNew = ArtworkPackageType[0].checked;
    if(createNew) {
        document.forms[0].elements["artworkPackageFieldDisplay"].disabled = true;
        document.forms[0].elements["btnartworkPackageField"].disabled = true
        document.forms[0].elements["artworkPackageFieldDisplay"].value = "";

        document.forms[0].elements["artWorkDescription"].disabled = false;
        document.forms[0].elements["Title"].disabled = false;
        document.forms[0].elements["RDODisplay"].disabled = false;
        document.forms[0].elements["btnRDO"].disabled = false;
    } else {
        document.forms[0].elements["artworkPackageFieldDisplay"].disabled = false;
        document.forms[0].elements["btnartworkPackageField"].disabled = false

        document.forms[0].elements["artWorkDescription"].disabled = true;
        document.forms[0].elements["Title"].disabled = true;
        document.forms[0].elements["RDODisplay"].disabled = true;
        document.forms[0].elements["RDODisplay"].value = "";
        document.forms[0].elements["btnRDO"].disabled = true;
    }
}



//added for append the ObjectId's and relId's as hidden fields for slidins in structurebrowsers.
function appendOBJRELidsElementToEditForm() {
    var editFormObj = document.forms["editDataForm"];
    if(editFormObj == null)
        return;
    //XSSOK isTargetLocationSlideIn is coming from logic
    var editFormOpenrWindow = "<%=isTargetLocationSlideIn%>" == "true" ? getTopWindow() : getTopWindow().getWindowOpener();
    
    var openerFrameName = editFormObj.elements["openerFrame"].value;
    var openerFrameObj = findFrame(editFormOpenrWindow, openerFrameName);
    if(openerFrameObj == null)
        return;

    var objIDs = "";
    var relIDs = "";
    
    var flatTable = openerFrameObj.location.href.indexOf("emxTable.jsp?") > 0;
    var sb = !flatTable && openerFrameObj.location.href.indexOf("emxIndentedTable.jsp?") > 0;
    if(flatTable) {
        var listDisplayFrameObj = findFrame(openerFrameObj, "listDisplay");
        var tableFormObj = listDisplayFrameObj.document.forms["emxTableForm"];
        var tableRowCkBoxElement = tableFormObj.emxTableRowId;
        if(tableRowCkBoxElement == null)
            return;
        //if only one column exists lengh returns "undefied"   
        var selRowsLength = (tableRowCkBoxElement.length == null ||
                             tableRowCkBoxElement.length == "undefined") ? 0 : tableRowCkBoxElement.length;
       
        if (selRowsLength == 0) {
        	 if(tableRowCkBoxElement.checked)
            objIDs = tableRowCkBoxElement.value + ","; //if we don't append "," substring function will fail 
        } else {
            for (i = 0; i < selRowsLength; i++) {
                if(tableRowCkBoxElement[i].checked){
                objIDs = objIDs + tableRowCkBoxElement[i].value + ",";
                }
            }
        }        
    } else if(sb) {
        var selids = openerFrameObj.getCheckedCheckboxes();
        for (var selid in selids)
        {
            var selidsArr = selid.split("|");
            relIDs = relIDs + selidsArr[0] + ",";
            objIDs = objIDs + selidsArr[1] + ",";
        }
    } else {
        return; //neither flat table nor SB
    }

    relIDs = relIDs.length > 0 ? relIDs.substring(0, relIDs.length-1) : relIDs;
    objIDs = objIDs.length > 0 ? objIDs.substring(0, objIDs.length-1) : objIDs;

    var editWebForm = $("form[name='editDataForm']");
    $("<input />").attr("name",  "selRowIDs").val(objIDs).attr("type", "hidden").appendTo(editWebForm);
    $("<input />").attr("name",  "selRelIDs").val(relIDs).attr("type", "hidden").appendTo(editWebForm);
}


function disableCheckboxOnPageLoad()
{
    document.forms[0].elements["AssignAuthorAsApprover"].disabled = true;    
}

function checkBadNameCharsLength() {
    if(!CheckBadNameChars(this))
   return false;
    return checkLength(this);
}

//Checking for Bad characters in the field
function CheckBadNameChars(fieldname) {
    if(!fieldname)
   fieldname=this;
  var isBadNameChar=checkForNameBadChars(fieldname,true);
    if( isBadNameChar.length > 0 )
    {
	    //XSSOK I18N message		
             msg = "<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.InvalidChars", browserLang)%>";
             msg += isBadNameChar;
             alert(msg);
             fieldname.focus();
             return false;
    }
     return true;
}

function checkLength(fieldname)
{
    if(!fieldname)
        fieldname=this;
    //XSSOK value from property config
    var maxLength = "<%=AWLPropertyUtil.getConfigPropertyString(context,"emxAWL.DisplayName.MaxLength")%>";
    if (!isValidLength(fieldname.value,0,maxLength))
    {
            //XSSOK I18N message
            var msg = "<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.checkLength", browserLang)%>";
            msg += "\n";
            msg += ' ' + maxLength + ' ';
            alert(msg);
            fieldname.focus();
            return false;
    }
    return true;
}



function checkBadChars(fieldName)
{
        
        if(!fieldName)
        fieldName=this;
        var badChars = "";
        badChars=checkForBadChars(fieldName);
        if ((badChars).length != 0)
        {
        	//XSSOK I18N message
         msg = "<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.InvalidChars", browserLang)%>";
         msg += "\n";
        msg += badChars;       
        fieldName.focus();
        alert(msg);
        return false;
    }
    return true;
}

function onChangeHandlerForChangeOrder()
{
	var CTOID 	= document.getElementsByName('ChangeTemplateOID')[0].value;
	var changeTemplate 	= document.getElementsByName('ChangeTemplate')[0].value;
	if(CTOID == "" || changeTemplate == "")
	{
		basicClear('ChangeOrder');
	}
	else
	{
	       document.forms[0]['ChangeOrder'].value= "CreateNew"; 
	    	// XSSOK createNewChangeOrder :  Local variable coming from Res Bundle-I18N  
	       document.forms[0]['ChangeOrderDisplay'].value= "<%=createNewChangeOrder%>"; 
	       document.forms[0]['ChangeOrderOID'].value= "CreateNew"; 
	 }    
}


function movePOAValidateAPTitle(){
	 var ArtworkPackageType= document.editDataForm.elements['ArtworkPackage'];
	 var createNew = ArtworkPackageType[0].checked;
	
	 if(createNew){
		var titleValue  = document.getElementById("Title").value;
		titleValue = titleValue.trim();
		if(titleValue == "")
		{
			// XSSOK I18N  
			alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.MovePOA.ValidateTitle", browserLang)%>");
			return false;
		}
	 }
	 return true;
}

function movePOAValidateUseExistingAP(){
	 var ArtworkPackageType= document.editDataForm.elements['ArtworkPackage'];
	 var useExisting = ArtworkPackageType[1].checked
	
	if(useExisting){
		var useExistingValue  = document.editDataForm.elements['UseExistingDisplay'].value;
		if(useExistingValue == "")
		{
			// XSSOK I18N  
			alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.MovePOA.ValidateUseExistingAP", browserLang)%>");
			return false;
		}
	}
	return true;
}


</script>
