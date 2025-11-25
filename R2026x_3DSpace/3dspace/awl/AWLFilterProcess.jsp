
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%-- Top error page in emxNavigator --%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%--Common Include File --%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Iterator"%>
<%
String strObjectId = emxGetParameter(request, "objectId");
String suiteKey     = emxGetParameter(request,"suiteKey");
String strParentId = emxGetParameter(request, "parentOID"); 

	HashMap<String, String> hMap = new HashMap<String, String>();
	hMap.put("editLink","true");
	hMap.put("editRootNode","false");
	hMap.put("selection","multiple");
	hMap.put("featureType","Technical");
	hMap.put("header","emxAWL.Heading.TechnicalFeatures");
	hMap.put("HelpMarker","emxhelptechnicalfeatureview");
	hMap.put("massPromoteDemote","false");
	hMap.put("objectCompare","false");
	hMap.put("mode","edit");
	hMap.put("massUpdate","false");
	hMap.put("direction","from");
	hMap.put("objectId",strObjectId);
	hMap.put("suiteKey",suiteKey);
	hMap.put("parentOID",strParentId);
	hMap.put("connectionProgram","AWLArtworkMasterUI:commiteArtWorkMasterRemove");
	hMap.put("portalCmdName","AWLProductLineArtworkElements");
	hMap.put("table","AWLTable_MasterArtworkElements");
	hMap.put("toolbar","AWLMasterLabelElementsToolbar,AWLMenu_ArtworkMasterCustomFilterToolbar");
	hMap.put("relationship",AWLRel.ARTWORK_ELEMENT_CONTENT.toString());
	hMap.put("expandProgram","AWLArtworkElementUI:getArtworkStructureForProductLine");

StringBuffer formingURL = new StringBuffer();
Set keySet  = hMap.keySet();
for(Iterator it = keySet.iterator();it.hasNext();)
{
    String key = (String) it.next();
    String value = (String) hMap.get(key);
    formingURL.append(key +"="+value+"&");
}

String showTabHeader = request.getParameter("showTabHeader");
boolean bShowTabHeader = "true".equalsIgnoreCase(showTabHeader);
%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript">   
    var vPortalMode = window.parent.document.getElementById('portalMode').value;    
    var sURL = "../common/emxIndentedTable.jsp?<xss:encodeForJavaScript><%=formingURL.toString()%></xss:encodeForJavaScript>";
    var LanguageFilter = getTopWindow().document.getElementById('LanguageFilter').value;
    sURL = sURL + "&LanguageFilter=" + LanguageFilter;
    if(vPortalMode){
        sURL = sURL+"&portalMode=" + vPortalMode+ "&showTabHeader=" +'<xss:encodeForURL><%=bShowTabHeader%></xss:encodeForURL>';
    }
    if (getTopWindow().document.getElementById('LanguageFilter').value != " ")
    {
        window.parent.frames.location.href  = sURL;
    }
</script>


