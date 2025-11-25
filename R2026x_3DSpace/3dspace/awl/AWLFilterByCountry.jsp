
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%!String root_dir = "..";%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.Enumeration"%>
<%@page import="matrix.db.Policy"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="matrix.db.Context"%>
<%@page import="java.util.*"%>

<%
	String languageStr     = request.getHeader("Accept-Language");
      
    String strNoCountrySelected = AWLPropertyUtil.getI18NString(context, "emxAWL.Lable.NoCountrySelected");
%>

<html>
<head>
<%@include file = "../cpd/regioncountry/regioncountryhead.inc"%>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript">
    function closeWindow(){
        getTopWindow().closeSlideInDialog();
    }

	function Clear()
    {
   		clist[0].clearSelection();
   		submitActual();
    }

	function submitActual()
    {
		var selStr = getSelectedCountries().join('|');
		document.productListRefreshForm.countryIds.value = selStr;
        var vProductRevFilter = "<xss:encodeForJavaScript><%=emxGetParameter(request,"AWLProductRevisionFilter")%></xss:encodeForJavaScript>";
        document.productListRefreshForm.AWLProductRevisionFilter.value = vProductRevFilter;
        var contentFrameObj = findFrame(getTopWindow(),"AWLFPMastersList");
        var targetFrame = "AWLFPMastersList";        
        if(contentFrameObj == null){        	
        	contentFrameObj = findFrame(getTopWindow(),"detailsDisplay");
        	targetFrame = "detailsDisplay";
        }        
        var form=document.productListRefreshForm;
        form.action=contentFrameObj.location.href;
        form.target=targetFrame;
        form.method='POST';
        form.onsubmit='contentFrameObj.src="' + contentFrameObj.location.href + '"';
        form.submit();
    }
    
    function submit(){
        var selectedState= clist[0].getSelected();
        if(selectedState.length<=0)
        {
            var box=$('#topalertbox');
            //XSSOK strNoCountrySelected : Local variable coming from Res Bundle-I18N
            box.alertbox("warning", "<%= strNoCountrySelected%>");
        }
        else
        {
            submitActual();
        }
    }
</script>

</head>
	<!--  XSSOK root_dir Static reference -->
<LINK href="<%=root_dir%>/common/styles/emxUIDefault.css" rel="stylesheet"
	type="text/css">

<body>
<%@include file = "../cpd/regioncountry/regioncountrybody.inc"%>
<form name="productListRefreshForm" class="hideForm">
	<input type="hidden" name="countryIds" /> 
	<input type="hidden" name="AWLProductRevisionFilter" />
</form>
	
</body>
</html>
