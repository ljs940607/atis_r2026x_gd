
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@ page import="java.lang.*,matrix.db.*, matrix.util.* ,java.util.*,com.matrixone.apps.domain.util.*" %>
<%@page import="com.matrixone.apps.common.util.ComponentsUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="java.util.List"%>
<%@page import = "com.matrixone.apps.framework.ui.UINavigatorUtil" %>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<%

	String contextFrom = emxGetParameter(request, "contextFrom");
	String selectedCountryIds = "";
	String partSelectedCountryIds="";
	String selectProdMsg = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectProduct");
	String noChangesDone = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoChanges");
	String unKnownError = AWLPropertyUtil.getI18NString(context,"emxAWL.Message.unknownError");
	String confirmMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CPGProductConfirmMessage");
	String root_dir = "..";
	String prdListStr = "";
	
	if(BusinessUtil.isNullOrEmpty(contextFrom))
	{
		prdListStr=AWLUtil.getSelectedIDsStrFS(request);
		List<String> cpgPrdList = AWLUtil.getSelectedIDsFS(request);
		
		for(String cpgPrdId: cpgPrdList)	
		{
			CPGProduct cpgProdId = new CPGProduct(cpgPrdId);
			if(!cpgProdId.isKindOf(context,AWLType.CPG_PRODUCT))
			{
				%>
				<script language="javascript" type="text/javaScript">
				//XSSOK selectProdMsg  local variable I18N
		       		 alert("<%=selectProdMsg%>");
		     		 getTopWindow().closeSlideInDialog();
		    	</script>
				<% 
			}	
		}
		
		String language = context.getSession().getLanguage();
		
		String []prdArr=prdListStr.split("\\|");
		List<Country> selCountriesList=new ArrayList<Country>(); 
		List<Country> partSelCountriesList=new ArrayList<Country>(); 
		AWLUtil.getCommonCountries(context, prdArr, selCountriesList, partSelCountriesList);
		for(Country ctry: selCountriesList)
		{
			if(!"".equals(selectedCountryIds))
				selectedCountryIds=selectedCountryIds+"|";
			selectedCountryIds=selectedCountryIds+ctry.getObjectId();
		}

		for(Country ctry: partSelCountriesList)
		{
			if(!"".equals(partSelectedCountryIds))
				partSelectedCountryIds=partSelectedCountryIds+"|";
			partSelectedCountryIds=partSelectedCountryIds+ctry.getObjectId();
		}

	}
	else if("CPGProduct".equalsIgnoreCase(contextFrom))
	{
		prdListStr = emxGetParameter(request, BusinessUtil.OBJECT_ID);
		StringList countryList = AWLUtil.getCountriesForProduct(context, prdListStr);
		selectedCountryIds = FrameworkUtil.join(countryList, "|");
	}
%>


<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%><html>
<head>
<script>
	// XSSOK selectedCountryIds DB Value OID or REL ID
	var SelectedCountryIds="<%=selectedCountryIds%>";
	
	// XSSOK partSelectedCountryIds DB Value  OID or REL ID 
	var PartSelectedCountryIds="<%=partSelectedCountryIds%>";
	var isProcessing = false;
	
	var selCountriesArr = new Array();
	var partCountriesArr = new Array();
	   if(SelectedCountryIds.length>0)
		   selCountriesArr=SelectedCountryIds.split('|');
	   if(PartSelectedCountryIds.length>0)
		   partCountriesArr = PartSelectedCountryIds.split('|');
</script>
<%@include file = "../cpd/regioncountry/regioncountryhead.inc"%>
<script type="text/javascript" src="scripts/scripthelper.js"></script>
<script>
	function closeWindow(){
		getTopWindow().closeSlideInDialog();
	}
	function submit(){
		if(isProcessing)
		{
			alert(emxUIConstants.STR_URL_SUBMITTED);
		}
		else
		{
			
			var nSelCoutriesArr = getSelectedCountries();
			 var nPartCoutriesArr = getPartSelectedCountries();
			 
			$('input[name="selCountryIds"]').val( nSelCoutriesArr.join('|') );
			$('input[name="partSelCountryIds"]').val( nPartCoutriesArr.join('|') );
			
		    if(isEqualArrays(selCountriesArr,nSelCoutriesArr) && isEqualArrays(partCountriesArr,nPartCoutriesArr)){
		    	// XSSOK  noChangesDone : Res Bundle-I18N
		    	alert("<%=noChangesDone%>");
	        } else {
	        	turnOnProgress();
				isProcessing = true;
				var req=$("#addCountryToPrdForm").serializeArray();
				//document.addCountryToPrdForm.submit();
				 ajaxExec("../resources/awl/db/cpgproduct/getexistingpoacountries", req,
							function (response) {
					 			if (response.errorMessage) {
					        		alert(response.errorMessage);
							        turnOffProgress();
							        isProcessing = false;
							    } else {
							    	var confirmation = true;
							    	if(Object.entries(response).length !== 0){
							    		confirmation = confirm(getAlertMessage(response));
							    	}
							        if (confirmation) {
				ajaxExec("../resources/awl/db/cpgproduct/addcountries", req, 
                                                     function (jsonResponse) {
					            	alert(jsonResponse.message);
                                                         if (jsonResponse.result == "error") {
					            	turnOffProgress();
						            isProcessing = false;
					            } else {
					                getTopWindow().closeSlideInDialog();
					                var frameToRefresh = null;
					                var frameList = ["AWLProductCountries","AWLProductHierarchyPOAView"]; //If table is displayed from portal then add new frame names here
					                for(var i=0;i<frameList.length;i++) {
					                	frameToRefresh = findFrame(getTopWindow(),frameList[i]);
					                	if(frameToRefresh!=null){
					                		break;
					                	}
					                } 
					             	// If No frame found then the table might be displayed directly from category menu. So we need to get the datilsDisplay frame.
					                if(frameToRefresh==null) {
					                	frameToRefresh = findFrame(getTopWindow(),"detailsDisplay");
					                } 
					               	// Finally refresh the frame 
					                if(frameToRefresh != null) {
				                		frameToRefresh.location.reload();
				                	}
					            }
					        },
							function(){
					            // XSSOK  unKnownError : Res Bundle-I18N
							    alert("<%=unKnownError%>");
							}
							);
			}
							        else {
							            turnOffProgress();
							            isProcessing = false;
							        }
							    }
							},
					function () {
					    // XSSOK  unKnownError : Res Bundle-I18N
					    alert("<%=unKnownError%>");
					}
					);
			}
		}
		 
	}
	
	function isEqualArrays( arr1, arr2 ){
		if(arr1.length>0 && arr2.length>0) {
			  return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0;
		} else if(arr1.length==0 && arr2.length==0){
		    return true;
		} else {
			return false;
		}
	}
	function getAlertMessage(response){
		var alertMessage = "<%=confirmMessage%>";
		for(var key in response){
		    var poaCountries = response[key];
		    alertMessage += "\n " + key + " : " + poaCountries.toString();
		}
		return alertMessage;
	}
	
</script>

</head>
<!--  XSSOK root_dir Static reference -->
<LINK href="<%=root_dir%>/common/styles/emxUIDefault.css" rel="stylesheet"
	type="text/css">

<body>
<%@include file = "../cpd/regioncountry/regioncountrybody.inc"%>

<form id="addCountryToPrdForm" name="addCountryToPrdForm" action="../resources/awl/db/cpgproduct/addcountries" method="post" class="hideForm">
	<input type="hidden" name="selCountryIds" value="" />
	<input type="hidden" name="partSelCountryIds" >
	<input type="hidden" name="productIds" value="<xss:encodeForHTMLAttribute><%=prdListStr%></xss:encodeForHTMLAttribute>" />
</form>

</body>
</html>
<% if(context!=null)context.shutdown(); %>
