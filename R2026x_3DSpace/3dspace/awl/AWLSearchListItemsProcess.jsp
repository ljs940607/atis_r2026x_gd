<%--
  AWLSearchListItemsProcess.jsp

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program
  
--%>


<%-- Common Includes --%>
<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%-- <%@page import="com.matrixone.apps.cpd.json.JSONArray"%> --%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="matrix.util.StringList" %>
<%@page import="matrix.util.MatrixException"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<%@page import="com.matrixone.apps.framework.ui.UIRTEUtil"%>
<%@page import="java.util.Map"%>
<%@page import="jakarta.json.JsonArray"%>
<%@page import="java.util.Iterator"%><script language="javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="javascript" src="../common/scripts/emxQuery.js"></script>
<script>
<%

String strContextObjectId[] = request.getParameterValues("emxTableRowId");
String chkBoxSelectedValue  = "";

StringList  objectIds = new StringList();

for(int i=0;i<strContextObjectId.length;i++){
    StringList slRowIds =  com.matrixone.apps.domain.util.FrameworkUtil.split(strContextObjectId[i], "|");     
    if(chkBoxSelectedValue.equals((""))){
    	chkBoxSelectedValue = (String)slRowIds.get(0)+",";
    }else{
    	chkBoxSelectedValue = chkBoxSelectedValue+(String)slRowIds.get(0)+","; //one extra comma is intenstionally kept at last since we the code in emxAWLBuildDialog handles it this way  
    }
    
    objectIds.add(slRowIds.get(0).toString());
}

//String copyTextAttr = AWLAttribute.COPY_TEXT.getSel(context);    
//StringList selects = new StringList();
//selects.add(copyTextAttr);    
//selects.add(DomainConstants.SELECT_ID); 


MapList fixedValues = new MapList();
for(int i = 0; i < objectIds.size(); i++)
{
   Map copyMap = new HashMap();
   String elementid     = (String)objectIds.get(i);
   String copyId        = ArtworkElementUtil.getMasterCopyByCopyElement(context,elementid);
   //String copyText      = ArtworkElementUtil.getCopyText(context,copyId);
   Map atribMap	= UIRTEUtil.getAttributeDate(context, copyId, AWLAttribute.COPY_TEXT.get(context));
   
   String copyText_RTE = (String)atribMap.get("attributeValue");   
   copyText_RTE = copyText_RTE.replaceAll("\\n","<br/>");   
   copyText_RTE = copyText_RTE.replaceAll("'","&#39;");
   copyMap.put(DomainConstants.SELECT_ID,elementid);   
   copyMap.put("copyText",copyText_RTE); 
   
   fixedValues.add(copyMap);
}

JsonArray array = BusinessUtil.toJSONArray(fixedValues);

%>

  var chkBoxSelectedValue = "<%= XSSUtil.encodeForJavaScript(context, chkBoxSelectedValue) %>";
  
  var query = new Query(getTopWindow().getWindowOpener().document.location.href);
  var existing = query.getValue("chkBoxSelectedValue");

  if(existing != null && existing.length > 0 && existing != "null") 
	chkBoxSelectedValue = existing + chkBoxSelectedValue; 
  
  query.replace("chkBoxSelectedValue", chkBoxSelectedValue); 
  
  //Encoding this JSON Array will have issues, we will be sending Copy Text Info also
  var rows       =  <%=array.toString()%>;  
  getTopWindow().getWindowOpener().addRows1(rows);  
  getTopWindow().closeWindow();
</script>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
