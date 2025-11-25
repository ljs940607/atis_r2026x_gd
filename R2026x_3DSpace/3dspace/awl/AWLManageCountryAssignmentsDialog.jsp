<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@ page import="java.lang.*,matrix.db.*, matrix.util.* ,com.matrixone.servlet.*,java.util.*,com.matrixone.apps.domain.util.*" %>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.domain.DomainObject" %>
<%@page import = "com.matrixone.apps.framework.ui.UINavigatorUtil" %>
<%@page import = "java.util.List, java.util.*" %>
<%@page import="com.matrixone.apps.cpd.dao.*" %>

<%
	String root_dir = ".."; //root_dir used in inc files included    
    String language = context.getSession().getLanguage();
    String artworkMasterIds= request.getParameter("objectId");
    StringList amIdsList = FrameworkUtil.split(artworkMasterIds, ",");
    String noChangesDoneAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoChanges");
    
    
    String selectedCountryIds="";
    String partSelectedCountryIds="";

    List<Country> selCountriesList=new ArrayList<Country>(); 
    List<Country> partSelCountriesList=new ArrayList<Country>(); 
    AWLUtil.getCommonCountries(context, BusinessUtil.toStringArray(amIdsList), selCountriesList, partSelCountriesList);
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

    
%>

<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%><html>
<head>
<title></title>

    <script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

        <script language="javascript" src="../common/scripts/emxJSValidationUtil.js"></script>
        <script language="javascript" src="../common/scripts/emxUICore.js"></script>
        <script language="javascript" src="../common/scripts/emxUIModal.js"></script>
    
    
    <LINK href="../common/styles/emxUIDefault.css" rel="stylesheet" type="text/css">

    <script language="javascript" type="text/javaScript">
        //XSSOK selectedCountryIds : DB Value - OID or REL ID
        var SelectedCountryIds="<%=selectedCountryIds%>";
      //XSSOK partSelectedCountryIds : DB Value - OID or REL ID
        var PartSelectedCountryIds="<%=partSelectedCountryIds%>";
        var isProcessing = false;	
        var selCountriesArr = new Array();
        var partCountriesArr = new Array();
           if(SelectedCountryIds.length>0)
               selCountriesArr=SelectedCountryIds.split('|');
           if(PartSelectedCountryIds.length>0)
               partCountriesArr = PartSelectedCountryIds.split('|');
           
        var closing = true;
        
        function closeWindow()
        {
            getTopWindow().closeSlideInDialog();
        }

        function submit()
        {
        	if(isProcessing)
			{
				alert(emxUIConstants.STR_URL_SUBMITTED);
			}
        	else
        	{
        		
                var selectedStates = clist[0].getSelected();
                var partSelectedStates = clist[0].getPartSelected();           
                    var selStr = selectedStates.join("|");
                    document.productListRefreshForm.selCountryIds.value = selStr;
                    selStr = partSelectedStates.join("|");
                    document.productListRefreshForm.partSelCountryIds.value = selStr;
                if(isEqualArrays(selCountriesArr,selectedStates) && isEqualArrays(partCountriesArr,partSelectedStates)){
                	//XSSOK noChangesDoneAlert : Local variable coming from Res Bundle-I18N
                	alert("<%=noChangesDoneAlert%>");
			    } else {
                    var contentFrameObj = findFrame(getTopWindow(),"detailsDisplay");
                    var form = document.productListRefreshForm;                
                    form.action="../awl/emxAWLManageCountriesUtil.jsp?mode=AssignCountries";
                    form.method='POST';
		            turnOnProgress();
        	        isProcessing = true;
                    form.submit();
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
    </script>
<%@include file = "../cpd/regioncountry/regioncountryhead.inc"%>

</head>
<body>


<%@include file = "../cpd/regioncountry/regioncountrybody.inc"%>


<form name="productListRefreshForm" class="hideForm">
    <input type="hidden" name="selCountryIds" >
    <input type="hidden" name="partSelCountryIds" >
    <input type="hidden" name="ProductIds" value="<xss:encodeForHTMLAttribute><%=artworkMasterIds%></xss:encodeForHTMLAttribute>" />
</form>
</body>
</html>
