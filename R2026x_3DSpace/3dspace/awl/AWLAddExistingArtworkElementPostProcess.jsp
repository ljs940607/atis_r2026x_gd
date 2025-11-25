<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.util.PropertyUtil"%>
<%@page import="com.matrixone.apps.domain.util.mxType " %>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="matrix.util.StringList"%>

<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>

<%
boolean bIsError = false;
String action = "";
String msg = "";
  try
	  {	 String mode = emxGetParameter(request,"mode");
	  	String forValidation =emxGetParameter(request,"forValidation");
	  		if(BusinessUtil.isNotNullOrEmpty(mode) && "connectArtworkMasterGraphic".equalsIgnoreCase(mode) && "true".equalsIgnoreCase(forValidation) ){
	  			String strContextObjectId[] = emxGetParameterValues(request, "emxTableRowId");
	  			if(strContextObjectId==null )
	  		    {
	  			%>	<!-- XSSOK request.getHeader : Header Value -->
	  				<emxUtil:localize id="i18nId" bundle="emxProductLineStringResource" locale='<%= request.getHeader("Accept-Language") %>' />
	  			<script language="javascript" type="text/javaScript">
	  				alert("<emxUtil:i18n localize='i18nId'>emxProduct.Alert.FullSearch.Selection</emxUtil:i18n>");
	  				getTopWindow().location.href = getTopWindow().location.href; 
	  			</script>
	  			<%
	  		    }else{
	  		    	%><jsp:forward page="../awl/AWLAddExistingArtworkElementIntermediate.jsp"/>
	  		    <%}
	  		
	  		}
	     String strObjId = emxGetParameter(request, "objectId");
	     String masterType = emxGetParameter(request, "masterType");
	     String strContextObjectId[] =  emxGetParameterValues(request, "masterIds");
	     DomainObject doParentContextObj = new DomainObject(strObjId);
	     String strParentContextObjType = "";
	     if(doParentContextObj != null)
	     {
	    	 strParentContextObjType = doParentContextObj.getInfo(context, DomainConstants.SELECT_TYPE);
	     }
	     // Set RPE variable to skip the Cyclic condition Check
	     PropertyUtil.setGlobalRPEValue(context,"CyclicCheckRequired","False");
	     StringList strObjectIdList = new StringList();
	     String xml = "";
	     Map paramMap = new HashMap();         
	     paramMap.put("objectId", strObjId);
	     for(int i=0;i<strContextObjectId.length;i++)
	     {
	     	paramMap.put("newObjectId", strContextObjectId[i]);
	        if(strObjId !=null && strContextObjectId[i]!=null)
			{					
				String[] params=new String[10];
				params[0]=strObjId;
				params[1]=strContextObjectId[i];
				String relId =  ArtworkElementUtil.connectArtworkMasters(context, params);
				paramMap.put("relId",relId);
			}
			if((mxType.isOfParentType(context, strParentContextObjType, AWLType.PRODUCT_LINE.get(context)))||(mxType.isOfParentType(context, strParentContextObjType, AWLType.CPG_PRODUCT.get(context))))
			{
				xml = ArtworkUtil.getXMLForSB(context, masterType, paramMap,AWLRel.ARTWORK_MASTER.get(context));
			}
			xml=xml.replace("add","success");
			xml=xml.replace("pending","committed");
	%>
			<script language="javascript" type="text/javaScript">
				//XSSOK xml - is formed here to update row in the SB there are no value from request or value from DB
			    var strXml="<%=xml%>";
				window.parent.getTopWindow().getWindowOpener().parent.emxEditableTable.addToSelected(strXml); 
			</script>
	<%   }  %>
	     <script language="javascript" type="text/javaScript">
	     getTopWindow().window.closeWindow(); 
	     </script>
	<%
	}
	catch(Exception e)
	{
		bIsError=true;
     	session.setAttribute("error.message", e.getMessage());
	}
    %>
    <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
