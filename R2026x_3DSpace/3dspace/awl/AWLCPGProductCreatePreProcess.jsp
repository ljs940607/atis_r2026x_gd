<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.domain.util.Request"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType" %>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>                  
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%
	String strLanguage = context.getSession().getLanguage();
	String[] strTableRowIds = emxGetParameterValues(request,"emxTableRowId");
	String strRowSelectSingle = AWLPropertyUtil.getI18NString(context, "emxAWL.RowSelect.Single");
	if(strTableRowIds != null && strTableRowIds.length > 1){
%>
                <script language="javascript" type="text/javaScript">
		                //XSSOK strRowSelectSingle :  I18N label or message
		                alert("<%=strRowSelectSingle%>");                
		          </script>
		    <%
	} 
	else
	{
                String strObjectID = null;
                String strType = emxGetParameter(request,"type");
                String strHelpMarker = emxGetParameter(request,"HelpMarker");
                String strUIContext = emxGetParameter(request, "UIContext");
                String heading = emxGetParameter(request, "header");
                String formType = emxGetParameter(request, "form");
		    		    		    		    	
                if(strTableRowIds != null)
                {
                     StringTokenizer strTokenizer = new StringTokenizer(strTableRowIds[0] , "|"); 
                     if(strTableRowIds[0].indexOf("|") > 0){                       
                         String temp = strTokenizer.nextToken() ;
                         strObjectID = strTokenizer.nextToken() ;
                     }
                     else{
                         strObjectID = strTokenizer.nextToken();
                     }
                }			
                if(BusinessUtil.isNotNullOrEmpty(strObjectID)&& !BusinessUtil.isKindOf(context,strObjectID, AWLType.PRODUCT_LINE.get(context)))
                {
                       String strSelectProdLine = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectProductLine");
%> 		        
	               <script language="javascript" type="text/javaScript">
			     //XSSOK I18N label or message	
		             alert("<%=strSelectProdLine%>");      
		             getTopWindow().closeSlideInDialog();
  		       </script>
<%
		}
                else{	
                    String sURL = AWLUtil.strcat("../common/emxCreate.jsp?objectId=",strObjectID,"&type=",strType,"&HelpMarker=",strHelpMarker,"&autoNameChecked=true&nameField=both&form=",formType,"&header=",heading,
                	    "&suiteKey=ProductLine&StringResourceFileId=emxAWLStringResource&submitAction=doNothing&SuiteDirectory=AWL&postProcessJPO=AWLCPGProduct:connectModelToProductLine&postProcessURL=../awl/AWLProductHierarchyCreatePostProcess.jsp");
                %>
<body>
<form name="CPGProductCreate" method="post">
                <script language="Javascript">
                     getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", "true");
                 </script></form>
</body>
<%
		}
            }
%>

