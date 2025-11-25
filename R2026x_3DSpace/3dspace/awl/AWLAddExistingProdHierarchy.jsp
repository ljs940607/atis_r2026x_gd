<%@page
	import="com.matrixone.apps.domain.*,
				  com.matrixone.apps.domain.util.*,
				  com.matrixone.apps.framework.ui.*,
				  java.util.*, java.util.List"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@include file="../emxUIFramesetUtil.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.Brand"%>
<%@page import="com.matrixone.apps.awl.enumeration.*"%>
<%@page import = "com.matrixone.apps.framework.ui.UINavigatorUtil" %>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<script	language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script	language="Javascript" src="../common/scripts/emxUIModal.js"></script>

<%
	try{
 
  List<String> strSelectedObjectId=AWLUtil.getSelectedIDsFS(request);
  String SelectProdLine = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectProductLine");
  String strSelectedPLObjId = strSelectedObjectId.get(0);
  DomainObject dobSelObject = null;
  Brand brandObj=new Brand(strSelectedPLObjId);
  
  if(brandObj.isKindOf(context, AWLType.PRODUCT_LINE))
  {
		String strSelTypeName = brandObj.getInfo(context, DomainConstants.SELECT_TYPE);
		String adminTypeName = FrameworkUtil.getAliasForAdmin(context, DomainConstants.SELECT_TYPE, strSelTypeName,true);
		String strApplicableType = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ProductLineType.".concat(adminTypeName));
		String[] allowedTypePatternList =strApplicableType.split(","); 
		String sbApplicableType = FrameworkUtil.join(allowedTypePatternList, ",");			
		sbApplicableType = sbApplicableType+(":POLICY="+AWLPolicy.PRODUCT_LINE);
		//d8a:suiteKey=awl is added for fixing HelpMarker
		String sURL = AWLUtil.strcat("../common/emxFullSearch.jsp?objectId=",strSelectedPLObjId,"&suiteKey=AWL&field=TYPES=",sbApplicableType,
	"&excludeOIDprogram=AWLProductLineUI:excludeConnectedObjects&table=PLCSearchProductLinesTable&selection=multiple&submitAction=refreshCaller&hideHeader=true",
	"&HelpMarker=emxhelpproducthierarchyaddobj&submitURL=../awl/AWLFeatureConnectProcess.jsp?mode=AddExisting&relName=",AWLRel.SUB_PRODUCT_LINES,"&from=false");
%>
		<script language="javascript" type="text/javaScript">
		  var submitURL = "<%=XSSUtil.encodeURLForServer(context, sURL)%>";
		  showModalDialog(submitURL,850,630);
	   </script>
<%
  }
  else 
  {
      %>
<Script>
	// XSSOK SelectProdLine : Res Bundle-I18N
      alert("<%=SelectProdLine%>");
      closeWindow();
      </Script>
<%
  }
}
catch(Exception e)
{
	e.printStackTrace();
}
%>
