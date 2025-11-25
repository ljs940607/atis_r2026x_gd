<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicsElement"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="java.util.*"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="matrix.util.StringList"%>
<%
String mode = (String) request.getParameter("mode");
String strobjectId = (String) request.getParameter("objectId");
String strDocId = "";

StringBuffer sb = new StringBuffer(300);
String url = "";

if(BusinessUtil.isKindOf(context, strobjectId, AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.get(context))) 
{
     strDocId = ((GraphicsElement) new ArtworkMaster(strobjectId).getBaseArtworkElement(context)).getGraphicDocument(context).getId(context);
}else if(BusinessUtil.isKindOf(context, strobjectId, AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context))) 
{
     strDocId = new GraphicsElement(strobjectId).getGraphicDocument(context).getId(context);
}
else 
{
       strDocId = strobjectId;
}
String objectId = strDocId;

Map paramMap = new HashMap();
Enumeration eNumParameters = emxGetParameterNames(request);

while( eNumParameters.hasMoreElements() ) 
{
    String strParamName = (String)eNumParameters.nextElement();
    paramMap.put(strParamName, emxGetParameter(request, strParamName));
   
}
if("properties".equalsIgnoreCase(mode))
{
    String strPartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id"); 
    sb.append("../common/emxForm.jsp?");
    paramMap.put("HelpMarker","emxhelpmastergraphicprop");
    paramMap.put("parentOID",strobjectId);
    paramMap.put("objectId",strDocId);
    paramMap.put("form","CPDImageDocumentForm");    
    paramMap.put("toolbar","CPDImageDocumentEditActionToolbar");
    paramMap.remove("relId");   
}
else if("fileVersions".equalsIgnoreCase(mode))
{
    paramMap.put("HelpMarker","emxhelpdocumentfilelist"); 
    paramMap.put("parentOID",strobjectId);
    paramMap.put("objectId",strDocId);
    paramMap.put("program","emxCommonFileUI:getFiles");
    paramMap.put("table","APPFileSummary");
    paramMap.put("selection","multiple");
    paramMap.put("header","emxComponents.Menu.Files");
    paramMap.put("toolbar","CPDGraphicToolbar");
    paramMap.put("StringResourceFileId","emxComponentsStringResource");
    paramMap.put("suiteKey","Components");
    paramMap.put("SuiteDirectory","components");
    paramMap.put("FilterFramePage","../components/emxCommonDocumentCheckoutUtil.jsp");
    paramMap.put("FilterFrameSize","1");
    paramMap.put("treePopup","true");   
              
    sb.append("../common/emxTable.jsp?");
}
else if("lifeCycle".equalsIgnoreCase(mode))
{
    String strpartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id");
    paramMap.put("objectId",strpartId); 
    
    sb.append("../common/emxLifecycle.jsp?mode=advanced");
    
}
else if("revisions".equalsIgnoreCase(mode))
{
    paramMap.put("parentOID",strobjectId);
    paramMap.put("objectId",strDocId);
    paramMap.put("program","emxCommonDocumentUI:getRevisions");
    paramMap.put("table","APPDocumentRevisions");
    //paramMap.put("toolbar","APPDocumentRevisionsToolBar");
    paramMap.put("toolbar","AWLMenu_LocalCopyElementToolbarActions");
    paramMap.put("header","emxComponents.Common.RevisionsPageHeading");
    paramMap.put("StringResourceFileId","emxComponentsStringResource");
    paramMap.put("suiteKey","Components");
    paramMap.put("SuiteDirectory","components");
    paramMap.put("subHeader","emxComponents.Menu.SubHeaderDocuments");   
   
    sb.append("../common/emxTable.jsp?");
}
else if("changeManagement".equalsIgnoreCase(mode))
{
   String strPartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id");   
     
    paramMap.put("parentOID",strobjectId);
    paramMap.put("objectId",strPartId);
    paramMap.put("program","AWLArtworkElementUI:getArtworkPackages");
    paramMap.put("table","AWLGraphicArtworkPackageTable");
    paramMap.put("header","emxAWL.Artwork.Heading.ArtworkMAnagementPowerview");
   sb.append("../common/emxIndentedTable.jsp?");
}
else if("MasterGraphicElementHistory".equalsIgnoreCase(mode))
{
   String strFetaureId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.to["+AWLRel.ARTWORK_ELEMENT_CONTENT.get(context)+"].from.id");
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strFetaureId); 
   paramMap.put("header","emxAWL.Histoty.Heading");
   
   sb.append("../common/emxHistory.jsp?HistoryMode=CurrentRevision");
}
else if("GraphicElementHistory".equalsIgnoreCase(mode))
{
   String strPartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id");
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strPartId); 
   paramMap.put("header","emxAWL.Histoty.Heading"); 
   
   sb.append("../common/emxHistory.jsp?HistoryMode=CurrentRevision");
}
else if("GraphicDocumentHistory".equalsIgnoreCase(mode))
{  
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strDocId); 
   paramMap.put("header","emxAWL.Histoty.Heading");
   sb.append("../common/emxHistory.jsp?HistoryMode=CurrentRevision");
}
else if("referenceDocuments".equalsIgnoreCase(mode))
{
   String strPartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id");
    
    paramMap.put("parentOID",strobjectId);
    paramMap.put("objectId",strPartId);
    paramMap.put("program","emxCommonDocumentUI:getDocuments");
    paramMap.put("table","PLCDocumentSummary");
    paramMap.put("header","emxAWL.Document.ReferenceDocuments");
    paramMap.put("selection","multiple");
    paramMap.put("sortColumnName","Name");
    paramMap.put("HelpMarker","emxhelprefdoclist");
    paramMap.put("sortDirection","ascending");
    paramMap.put("toolbar","ProductDocumentSummaryToolBar");
    paramMap.remove("relId");
    sb.append("../common/emxTable.jsp?");
}
else if("MasterGraphicElementWhereUsed".equalsIgnoreCase(mode))
{
   String strFetaureId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.to["+AWLRel.ARTWORK_ELEMENT_CONTENT.get(context)+"].from.id");
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strFetaureId);
   paramMap.put("program","AWLProductLineUI:getWhereUsed");
   paramMap.put("table","PLCWhereUsedList");
   paramMap.put("FilterFrameSize","55");
   //paramMap.put("FilterFramePage","../productline/WhereUsedTableFilterInclude.jsp");   
   paramMap.put("command","AWLCommand_GraphicElementWhereUsedListTreeCategory");
   paramMap.put("header","emxAWL.WhereUsed.Heading");
   
   sb.append("../common/emxTable.jsp?"); 
}
else if("GraphicElementWhereUsed".equalsIgnoreCase(mode))
{
   String strPartId = BusinessUtil.getInfo(context,objectId , "to["+AWLRel.GRAPHIC_DOCUMENT.get(context)+"].from.id");
   
   
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strPartId);
   paramMap.put("program","AWLProductLineUI:getWhereUsed");
   paramMap.put("table","PLCWhereUsedList");
   paramMap.put("FilterFrameSize","55");
  // paramMap.put("FilterFramePage","../productline/WhereUsedTableFilterInclude.jsp");
   paramMap.put("header","emxAWL.WhereUsed.Heading");
   paramMap.put("command","AWLCommand_GraphicElementWhereUsedListTreeCategory");    
   sb.append("../common/emxTable.jsp?");   
}
else if("GraphicDocumentWhereUsed".equalsIgnoreCase(mode))
{
   
   paramMap.put("parentOID",strobjectId);
   paramMap.put("objectId",strDocId);
   paramMap.put("realtionship",AWLRel.GRAPHIC_DOCUMENT.get(context));
   paramMap.put("table","PLCWhereUsedList");
   paramMap.put("FilterFrameSize","55");
   //paramMap.put("FilterFramePage","../configuration/WhereUsedTableFilterInclude.jsp");
   paramMap.put("header","emxAWL.WhereUsed.Heading");
   paramMap.put("command","command_FTRFeatureWhereUsedListTreeCategory");
   
   
     
   sb.append("../common/emxTable.jsp?"); 
}
else if("whereUsedPortal".equalsIgnoreCase(mode))
{
    paramMap.put("objectId",strDocId);
    paramMap.put("portal","CPDImageDocumentWhereUsedPortal");
    paramMap.put("header" ,"emxCPD.Heading.WhereUsed");
    sb.append("../common/emxPortal.jsp?"); 
}
else if("historyPortal".equalsIgnoreCase(mode))
{
    paramMap.put("objectId",strDocId);
    paramMap.put("portal","CPDImageDocumentHistoryPortal");
    paramMap.put("header" ,"emxCPD.Label.History");   
    sb.append("../common/emxPortal.jsp?"); 
}

for (Iterator iterator = paramMap.keySet().iterator(); iterator.hasNext();)
{
    String paramName = (String) iterator.next();
    sb.append('&').append(paramName).append('=').append(paramMap.get(paramName));
}
url = sb.toString();
%>

<script language="javascript" type="text/javaScript">      
var frameContent = findFrame(getTopWindow(),"pagecontent");
document.location.href = "<xss:encodeForJavaScript><%= url%></xss:encodeForJavaScript>";        
</script>   
<%

%>
