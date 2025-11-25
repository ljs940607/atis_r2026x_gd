<%-- Common Includes --%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%@include file="../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.productline.*"%>
<%@page import="com.matrixone.apps.domain.*"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.*"%>
<%@page import="com.matrixone.apps.awl.dao.*"%>
<%@page import="java.util.List"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%@include file="../common/enoviaCSRFTokenValidation.inc" %>
<%
        boolean bIsError = false;
		
		String action = "";
		String msg = "";

		try {
			String strObjId = emxGetParameter(request, "objectId");
			String strRelName = request.getParameter("relName");			
			String strContextObjectId[] = request.getParameterValues("emxTableRowId");
			String strToConnectObjectType = "";

			DomainObject dom = new DomainObject(strObjId);
			if (strContextObjectId == null) {
%>

		<script language="javascript" type="text/javaScript">
			alert("<emxUtil:i18n localize='i18nId'>emxProduct.Alert.FullSearch.Selection</emxUtil:i18n>");
		</script>

<%
            }
			else 
			{				   
				boolean isConnected = false;

				List<String> strSelectedObjIds = AWLUtil.getSelectedIDs(request);

				Brand brand=new Brand(strObjId);
				List<DomainObject> objListToConnect=new ArrayList<DomainObject>();
				for(String objIdToConnect: strSelectedObjIds)
				{
					isConnected=true;
					DomainObject objToConnect=new DomainObject(objIdToConnect);
					if(objToConnect.isKindOf(context, AWLType.MODEL.get(context)))
						brand.connectTo(context, AWLRel.PRODUCT_LINE_MODELS, objToConnect);
					else
						brand.connectTo(context, AWLRel.SUB_PRODUCT_LINES, objToConnect);
				}

				if (isConnected) {
					%>
					<script language="javascript" type="text/javaScript">	
					window.parent.getTopWindow().getWindowOpener().parent.location.href = window.parent.getTopWindow().getWindowOpener().parent.location.href;	
					window.getTopWindow().closeWindow();	
					</script>
					<%
				}				
            }
		} catch (Exception e) {
			bIsError = true;
			session.setAttribute("error.message", e.getMessage());			
		}// End of main Try-catck block
%>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>

