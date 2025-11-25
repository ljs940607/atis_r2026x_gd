
<%--
   AWLViewCountries.jsp
   Displays Countries assigned to CPG Products
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
   Author: VD8
--%>

<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%@page import="matrix.util.StringList"%>

<LINK href="../common/styles/emxUIDefault.css" rel="stylesheet"
	type="text/css">
<LINK href="../common/styles/emxUIList.css" rel="stylesheet"
	type="text/css">


<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<html>
<body>
	<%
		String objectId = emxGetParameter(request, "objectId");
			StringList countryNames = new StringList();
			if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context))) {
		countryNames = AWLUtil.getCountryNamesForProduct(context, objectId);
			}
			else if(BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context))) {
		countryNames = new POA(objectId).getCountryNames(context, objectId);
			} 
			else { 
		countryNames = AWLUtil.getCountryNamesForArtworkMaster(context, objectId);
			}
			countryNames.sort();
	        out.println("<table class=\"list\">");
	        if(countryNames.size() > 0) {
		        for(int i=0; i<countryNames.size(); i++) {
			boolean odd = ((i % 2) != 0);                    
		          	out.println("<tr class=\"" + (odd ? "odd" : "even") + "\"><td>" + countryNames.get(i) + "</td></tr>");
	        	}
	        } 
	        else {
	%>
	          <tr>
	            <td align="center" colspan="13" class="error">
	            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N  -->
	                  <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Text.ArtworkElementNoCountry")%>
	            </td>
	          </tr>
        	<%          
        }
        out.println("</table>");
	%>
	<script language="javascript" type="text/javaScript">
        function closeWindow()
        {
            getTopWindow().closeSlideInDialog();
        }
        
        function submit()
        {
            getTopWindow().closeSlideInDialog();
        }
    </script>
	<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>

</body>
</html>
