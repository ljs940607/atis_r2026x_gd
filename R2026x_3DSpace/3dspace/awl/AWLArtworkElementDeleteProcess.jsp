<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>

<%@page import="java.util.HashSet"%>
<%@page import = "java.util.Enumeration" %>
<%@page import = "java.util.Iterator" %>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import = "matrix.util.StringList"%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.Access"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import = "com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%-- Common Includes --%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<%
boolean bIsError = false;
String action = "";
String msg = "";

    String parentOID = emxGetParameter(request, "parentOID");
    String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");
    String[] strSelectedObjList = AWLUIUtil.getObjIdsFromRowIds(arrTableRowIds);
    StringList selectdObjList = BusinessUtil.toStringList(strSelectedObjList);
           
    if(selectdObjList.contains(parentOID)) {
%>
                <script language="javascript" type="text/javaScript">
                    // XSSOK
                    alert("<xss:encodeForJavaScript><%=AWLPropertyUtil.getI18NString(context, 
                    "emxAWL.RootNodeCannotBeSelected.Alert")%></xss:encodeForJavaScript>");
                </script>         
<%  
    }  else  {
            try {
                CPGProduct contextObject = new CPGProduct(parentOID);
                contextObject.deleteAssociatedElements(context, selectdObjList);
%>
                <script language="javascript" type="text/javaScript">
                    window.parent.location.href = window.parent.location.href;
                </script>
<% 
            
            }  catch(Exception e)  {
               e.printStackTrace();
               String alertMsg = e.getMessage();
%>
                <script language="javascript" type="text/javaScript">
                    alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
                </script>
<%     
            } 
    }
%>
   
   <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

