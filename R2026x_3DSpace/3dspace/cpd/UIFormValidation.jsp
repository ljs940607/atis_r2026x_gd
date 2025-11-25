<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<script language="javascript" src="../common/scripts/emxJSValidationUtil.js"> </script>
<script language="javascript" src="../common/scripts/emxUICore.js"> </script>
<script type="text/javascript">
<%
    String browserLang = request.getHeader("Accept-Language");
    boolean isTargetLocationSlideIn = "slidein".equalsIgnoreCase(request.getParameter("targetLocation"));
    String resourceBundle = "emxCPDStringResource";
    String INVALID_CHAR_MSG  = EnoviaResourceBundle.getProperty(context,resourceBundle, new Locale(browserLang),"emxCPD.ErrorMsg.InvalidCharMsg");
%>
//added for append the ObjectId's and relId's as hidden fields for slidins in structurebrowsers.
function appendOBJRELidsElementToEditForm() {
    var editFormObj = document.forms["editDataForm"];
    if(editFormObj == null)
        return;
    //XSSOK isTargetLocationSlideIn is a boolean value coming by comparing a string
	var editFormOpenrWindow = "<%=isTargetLocationSlideIn%>" == "true" ? getTopWindow() : getTopWindow().opener;
    
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

function containsBadChars(fieldObj) {
    if(fieldObj == null || fieldObj == "undefined" || fieldObj == "null" || fieldObj == "")
    {
    	fieldObj = this;
    }

    var isBadNameChar=checkForUnifiedNameBadChars(fieldObj, true);
    var nameAllBadCharName=checkForNameBadCharsList(fieldObj);
    var name;
    if(fieldObj.title && fieldObj.title != ""){
        name = fieldObj.title;
    } else {
      	name = fieldObj.name;
    }
     if( isBadNameChar.length > 0 )
    {
        alert("<%=INVALID_CHAR_MSG%>"+isBadNameChar);
    	 return false;
    }
    return true;
}
</script>
