<%-- emxValidationInclude.inc

   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.

   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

--%>

<%@include file = "../emxJSValidation.inc" %>
<script language="javascript" type="text/javaScript">
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

// The following variable was changed for bug no.281645
var checkBadChars = "BadChars";

//The following lines  enable the use of strings checkIllegaChars and checkBadChars as the BadcharTypes for some pages.This will allow obsolete files to run properly
var checkIllegalChars="BadChars";
var checkRestrictedChars = "BadChars";
// XSSOK I18N Value
var MAX_LENGTH =<%=AWLPropertyUtil.getConfigPropertyString(context, "emxComponents.MAX_FIELD_LENGTH")%>;
//XSSOK I18N Value
var ALERT_EMPTYFIELD ="<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.checkEmptyString")%>";
//XSSOK I18N Value
var ALERT_CHECK_LENGTH = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkLength")%>";
//XSSOK I18N Value
var ALERT_INVALID_CHARS = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.InvalidChars")%>";
//XSSOK I18N Value
var ALERT_INVALID_PARENTHESIS = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.InvalidParenthesis")%>";
//XSSOK I18N Value
var ALERT_CHECK_NUMERIC = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkNumeric")%>";
//XSSOK I18N Value
var ALERT_CHECK_POSITIVE_NUMERIC ="<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkPositiveNumeric")%>";
//XSSOK I18N Value
var ALERT_CHECK_INTEGER = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkInteger")%>";
//XSSOK I18N Value
var ALERT_CHECK_MARKETING_NAME_SPECIAL_CHAR =  "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Error.NoSpecialCharacterAsMarketingName")%>";
// Added for bug no. IR-052159V6R2011x
//Added by Ashwini to fix CreateGlobalFeature functionality work
//XSSOK I18N Value
var BAD_CHAR_MARKETING_NAME ="<%=AWLPropertyUtil.getConfigPropertyString(context, "emxProductLine.Javascript.MarketingNameBadChars")%>";


//Added for special character - Bug No. 361962
function singleSpecCharValidation(field)
{
	var val = field.value;
	var charArray = new Array(20);
	charArray = ("@ , * ? [ ] # $ { } \\\\ \\\" < > | % ( ) ~").split(" ");
	var charUsed = checkStringForChars(val,charArray,false);
	
	if(val.length==1 && charUsed.length >=1)
	{		
		msg =ALERT_CHECK_MARKETING_NAME_SPECIAL_CHAR+" :: "+charUsed;
		field.focus();
    	alert(msg);
		return false;
	}
	return true;
}
//Added by Ashwini to make CreateGlobalFeature functionality work
//START - Added for bug no. IR-052159V6R2011x
function chkMarketingNameBadChar(field)
{
	var val = field.value;
	var charArray = new Array(20);
    charArray = BAD_CHAR_MARKETING_NAME.split(" ");
    var charUsed = checkStringForChars(val,charArray,false);
	
	if(val.length>0 && charUsed.length >=1)
	{		
		msg =ALERT_INVALID_CHARS+" "+charUsed;
		field.focus();
    	alert(msg);
		return false;
	}
	return true;
}

</script>
<script language="javascript" src="../components/emxValidationInclude.js"></script>
