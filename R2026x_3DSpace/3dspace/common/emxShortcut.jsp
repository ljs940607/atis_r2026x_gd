<%--  emxShortcut.jsp

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   
--%>

<%--
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
--%>

<%@page import="jakarta.json.JsonArray,jakarta.json.Json"%>
<%@page import="jakarta.json.JsonObjectBuilder"%>
<%@include file = "emxNavigatorInclude.inc"%>
<jsp:include page="emxShortcut.html"></jsp:include>
<jsp:useBean id="shortcutInfo" class="com.matrixone.apps.framework.ui.UIShortcut" scope="session" />


<%
	
	String key = emxGetParameter(request, "key");
	JsonObjectBuilder shortcutJson = BPSJsonObjectBuilder.createJsonObjectBuilder(Json.createObjectBuilder());
	HashMap params = new HashMap();
	params.put("charSet",Framework.getCharacterEncoding(request));
	params.put("languageStr",request.getHeader("Accept-Language"));
	
	ArrayList recentlyViewed = shortcutInfo.getRecentlyViewedList(key);
	ArrayList[] shortcutList = shortcutInfo.getShortcutMap(key);
	
	JsonArray recentLyViewedArr=UIShortcutUtil.getRecentlyViewedJson(context, application, session, request, recentlyViewed);	
	JsonArray collectioArr=UIShortcutUtil.getCollectionsJson(context, application, session, request, params);
	
	shortcutJson.add("recentlyViewed",recentLyViewedArr);
	shortcutJson.add("collections",collectioArr);
%>

<script>
var shortcutArr = [];

<%
	//update facet state only
	for(int j=0;j<shortcutList[1].size();j++){
%>
	//XSSOK
	shortcutArr.push('<%=(String)shortcutList[1].get(j)%>');
<%
	}
%>
</script>

<script>
	jQuery(document).ready(function ($) {
		
		if(getTopWindow().shortcut.length ==0){	
			updateShortcutArray(shortcutArr);
		}
	    emxUIShortcut.init(<%=shortcutJson.build().toString()%>);
	});
</script>
	
