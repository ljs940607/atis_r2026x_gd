
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.domain.util.Request"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.BrandUtil"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType" %>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
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
		                //XSSOK strRowSelectSingle : Local variable coming from Res Bundle-I18N
		                alert("<%=strRowSelectSingle%>");
		                getTopWindow().closeSlideInDialog();
		          </script>
<%
	} 
	else
	{
	String strObjectID = "";
	String strHelpMarker = emxGetParameter(request,"HelpMarker");
	String strUIContext = emxGetParameter(request, "UIContext");
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
		//	StringBuffer sbBuffer = new StringBuffer();
		//by e55 for IR-174638V6R2013x 
	      if(BusinessUtil.isNotNullOrEmpty(strObjectID) && !BusinessUtil.isKindOf(context,strObjectID, AWLType.PRODUCT_LINE.get(context)))
          {
              String strSelectProdLine = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectProductLine");
%>             
                    <script language="javascript" type="text/javaScript">
                  //XSSOK strRowSelectSingle : Local variable coming from Res Bundle-I18N
                             alert("<%=strSelectProdLine%>");      
                             getTopWindow().closeSlideInDialog();
                    </script>
               <%
          }
		   else{
			BrandUtil subBrandTypes=new BrandUtil();
			String strCreationType ="";
			try{
				strCreationType= subBrandTypes.getBrandComboBoxList(strObjectID, context);
				if(BusinessUtil.isNotNullOrEmpty(strCreationType))
					strCreationType= (String)FrameworkUtil.split(strCreationType, ",").get(0);
			}catch(Exception plExc)
			{
				%>
				<script language="javascript" type="text/javaScript">
				alert("<%=XSSUtil.encodeForJavaScript(context, plExc.getMessage())%>");
				getTopWindow().closeSlideInDialog();
     			 </script>
     			 <%
			}
			String submitAction = "myDesk".equalsIgnoreCase(strUIContext) ? "&submitAction=refreshCaller" : "&submitAction=doNothing";
			String sURL = AWLUtil.strcat("../common/emxCreate.jsp?objectId=",strObjectID,"&type=",strCreationType,"&typeChooser=false&autoNameChecked=true&nameField=both&form=",formType,"&header=emxProductLine.Form.Heading.ProductLineCreate",
                    "&suiteKey=ProductLine&SuiteDirectory=AWL&relationship=",AWLRel.SUB_PRODUCT_LINES.get(context),"&HelpMarker=",strHelpMarker,"&postProcessURL=../awl/AWLProductHierarchyCreatePostProcess.jsp", submitAction);
					
%>
<body>
<form name="MyDeskProductLineCreate" method="post"><script language="Javascript">
                           getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", "true");                      
                  </script></form>
</body>
<%
		   }
	}
%>

