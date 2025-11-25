<%--  emxStopRouteProcess.jsp   -   Process page for Manual-Stop functionality

   Copyright (c) 1992-2020 Dassault Systemes.All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne, Inc.
   Copyright notice is precautionary only and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxStopRouteProcess.jsp.rca 1.2.3.2 Wed Oct 22 16:18:14 2008 przemek Experimental przemek $
--%>
<%@page import="com.dassault_systemes.enovia.route.applicability.RouteMaturityController"%>
<%@page import="matrix.util.StringList"%>
<%@include file="../common/emxNavigatorInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>


<%@include file="../emxUICommonHeaderEndInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%

    try {

        ContextUtil.startTransaction(context, true);

         String strRouteId = emxGetParameter(request, "objectId");
         String strDemoteObjectKey = emxGetParameter(request, "demoteObjectKey");
        String strDemoteConnectedObject = emxGetParameter(request, "demoteConnectedObject");
		StringList subRouteIds = new StringList();
        stopRoute(context, strRouteId,subRouteIds);

        if (UIUtil.isNotNullAndNotEmpty(strDemoteObjectKey) && !strDemoteObjectKey.equalsIgnoreCase("none") && UIUtil.isNotNullAndNotEmpty(strDemoteConnectedObject) && "true".equalsIgnoreCase(strDemoteConnectedObject)) {
            demoteConnectedObjects(context, strRouteId,strDemoteObjectKey);
        }

        ContextUtil.commitTransaction(context);
        if(!subRouteIds.contains(strRouteId)){
        	subRouteIds.add(strRouteId);
        }
        for(String routeid: subRouteIds) {
        	com.matrixone.apps.common.Route rtObj   = new com.matrixone.apps.common.Route();
        	rtObj.setId(routeid);
        	rtObj.sendNotificationToTaskAssignees(context, "Stoped");
        }
%>
    <SCRIPT LANGUAGE="JavaScript">
    <!--
        // Refresh the parent page
        window.parent.location.href = window.parent.location.href;
    //-->
    </SCRIPT>
<%
    } catch (Exception ex) {
        ContextUtil.abortTransaction(context);

         if (ex.toString() != null && ex.toString().length() > 0) {
            emxNavErrorObject.addMessage(ex.toString());
         }
    }
%>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file="../emxUICommonEndOfPageInclude.inc"%>

<%!

/**
 * Changes the state of the Route to Stopped
 * @param context The Matrix Context object
 * @param strRouteId The id of Route
 * @return
 * @throws Exception if operation fails
 */
private static void stopRoute (Context context, String strRouteId, StringList subRouteIds) throws Exception {
    if (context == null) {
        throw new Exception("Invalid context");
    }
    if (strRouteId == null || "".equals(strRouteId) || "null".equals(strRouteId)) {
        throw new Exception("Invalid strRouteId");
    }
    DomainObject dmoObject = new DomainObject(strRouteId);
    dmoObject.setAttributeValue(context, DomainObject.ATTRIBUTE_ROUTE_STATUS, "Stopped");

    com.matrixone.apps.common.Route rtObj   = new com.matrixone.apps.common.Route();
    rtObj.setId(strRouteId);
//  rtObj.sendNotificationToTaskAssignees(context, "Stoped");
   	MapList mlSubRoutes = rtObj.getAllSubRoutes(context);
    Iterator it=mlSubRoutes.iterator();
    while(it.hasNext())
    {
        Hashtable hashTable=(Hashtable)it.next();
        String routeId=(String)hashTable.get(DomainObject.SELECT_ID);
        String routeStatus=(String)hashTable.get("attribute[" + DomainObject.ATTRIBUTE_ROUTE_STATUS + "]");
        if(routeId!=null && "Started".equalsIgnoreCase(routeStatus))
        {
        	stopRoute(context, routeId, subRouteIds);
        	if(!subRouteIds.contains(routeId)){
        		subRouteIds.add(routeId);
        	}
        }
    }
    String action= "Stop";
    rtObj.customhistory(context,strRouteId,action);
}

/**
 * Demotes the connected Object if it is state based
 * @param context The Matrix Context object
 * @param strRouteId The id of Route
 * @return
 * @throws Exception if operation fails
 */
private static void demoteConnectedObjects (Context context, String strRouteId, String strSelectKey) throws Exception {
	 
    if (context == null) {
        throw new Exception("Invalid context");
    }
    if (strRouteId == null || "".equals(strRouteId) || "null".equals(strRouteId)) {
        throw new Exception("Invalid strRouteId");
    }
    if(strSelectKey.equals("RouteAndSubRoute")|| strSelectKey.equals("OnlyRoute")){
    DomainObject dmoRoute = new DomainObject(strRouteId);

    StringList slBusSelects = new StringList(DomainObject.SELECT_ID);
    slBusSelects.add(DomainObject.SELECT_TYPE);
    slBusSelects.add(DomainObject.SELECT_PHYSICAL_ID);
    slBusSelects.add(DomainObject.SELECT_ATTRIBUTE_PLMCoreRepReference_V_isOnceInstantiable);
    slBusSelects.add(DomainObject.SELECT_KINDOF_PLMENTITY);
    slBusSelects.add(DomainObject.SELECT_CURRENT);
    slBusSelects.add(DomainObject.SELECT_POLICY);
    StringList slRelSelects = new StringList();
    slRelSelects.add(DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_STATE));
    slRelSelects.add(DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_POLICY));

    String strRelPattern = DomainObject.RELATIONSHIP_OBJECT_ROUTE;
    String strTypePattern = "*";
    boolean getTo = true;
    boolean getFrom = false;
    short nRecurseToLevel = (short)1;
    String strObjectWhere = null;
    String strRelWhere = null;

    MapList mlTasks = dmoRoute.getRelatedObjects(context,
                                                strRelPattern,
                                                strTypePattern,
                                                slBusSelects,
                                                slRelSelects,
                                                getTo,
                                                getFrom,
                                                nRecurseToLevel,
                                                strObjectWhere,
                                                strRelWhere);
    String strRouteBaseState = "";
    String strRouteBasePolicy = "";
    String strObjectId = "";
    String strObjectType = "";
    String strObjectCurrent = "";
    String strObjectPolicy = "";
    String isKindVPM = "";
    DomainObject dmoObject = null;

    for (Iterator itrTasks = mlTasks.iterator(); itrTasks.hasNext();) {
        Map mapInfo = (Map)itrTasks.next();

        strRouteBaseState = (String)mapInfo.get(DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_STATE));
        strRouteBasePolicy = (String)mapInfo.get(DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_POLICY));
        strObjectId = (String)mapInfo.get(DomainObject.SELECT_ID);
        strObjectType = (String)mapInfo.get(DomainObject.SELECT_TYPE);
        isKindVPM = (String)mapInfo.get(DomainObject.SELECT_KINDOF_PLMENTITY);
        if(!com.matrixone.apps.common.Route.isStateBlockingAllowed(context,strObjectType) || "true".equalsIgnoreCase(isKindVPM)){
        	continue;
        }
        strObjectCurrent = (String)mapInfo.get(DomainObject.SELECT_CURRENT);
        strObjectPolicy = (String)mapInfo.get(DomainObject.SELECT_POLICY);
        boolean isActiveRoutePresent = RouteMaturityController.hasAnyActiveRoute(context, strObjectId, strObjectCurrent, strObjectPolicy, strRouteId);
        if (!isActiveRoutePresent) {
				dmoObject = new DomainObject(strObjectId);
            	dmoObject.demote(context);
        }else {
        	Locale locale = context.getLocale();
        	String stringDemotionErrorMsg = EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource", locale, "emxComponents.RouteMaturityController.RouteStoppedWithContentDemoted.ErrorMsg");
        	throw new Exception(stringDemotionErrorMsg);
        }
    }
}

    if(strSelectKey.equals("RouteAndSubRoute") || strSelectKey.equals("OnlySubRoute")){
     	com.matrixone.apps.common.Route rtObj   = new com.matrixone.apps.common.Route();
    	rtObj.setId(strRouteId);
    	MapList mlSubRoutes = rtObj.getAllSubRoutes(context);  
    	 Iterator it=mlSubRoutes.iterator();
         while(it.hasNext())
         {
             Hashtable hashTable=(Hashtable)it.next();
             String sRouteId=(String)hashTable.get(DomainObject.SELECT_ID);
    		 demoteConnectedObjects(context, sRouteId, "OnlyRoute");
         }
    }
 }
//     }
%>
