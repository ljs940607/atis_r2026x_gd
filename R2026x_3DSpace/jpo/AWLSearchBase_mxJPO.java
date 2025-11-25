/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import matrix.db.BusinessObjectList;
import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.framework.ui.UIUtil;

public class AWLSearchBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2090882961755551641L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLSearchBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
    public String getArtworkAssignee(Context context, String args[])
								throws FrameworkException {
    	try{
    		String strArtworkId = args[0];
    		Set<String> sAssigneeList = new HashSet<String>();
    		ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, strArtworkId);
    		MapList routeInfoList = artworkContent.getAllRoutes(context);
    		StringList slDummy = new StringList();
    		
        	String strDel = matrix.db.SelectConstants.cSelectDelimiter;
        	if (strDel == null || strDel.trim().length() == 0) {
        	    strDel = "|";
        	}
    		if (routeInfoList.size() == 0) {
    			String strAuthoringTemp = artworkContent.getAuthoringAssigneeId(context);
    			String strApprovalTemp = artworkContent.getApprovalAssigneeId(context);
    			if (strAuthoringTemp != null && strApprovalTemp.trim().length() > 0) {
    				sAssigneeList.addAll(getAssigneeInfoAssigneeID(context, strAuthoringTemp));
    			}
    			if (strApprovalTemp != null && strApprovalTemp.trim().length() > 0) {
    				sAssigneeList.addAll(getAssigneeInfoAssigneeID(context, strApprovalTemp));
    			}
    		} else {
    			for (int i = 0; i < routeInfoList.size(); i ++) {
    				String strRouteId = (String) ((Map) routeInfoList.get(i)).get(DomainConstants.SELECT_ID);
    				sAssigneeList.addAll(getPersonsAssignedtoRoute(context, strRouteId));
    			}
    		}
    		slDummy.addAll(sAssigneeList);
    		return slDummy.size() == 0 ? "" : FrameworkUtil.join(slDummy, strDel);
    	}catch(Exception e){ throw new FrameworkException(e);}
		
    }
    
    
    public String getArtworkPackageAssignee (Context context, String args[]) throws FrameworkException {
    	
    	try{
    		String strArtworkId = args[0];
    		
        	String strDel = matrix.db.SelectConstants.cSelectDelimiter;
        	if (strDel == null || strDel.trim().length() == 0) {
        	    strDel = "|";
        	}

    		StringList slAssignee = new StringList();
    		ArtworkPackage doAP = new ArtworkPackage(strArtworkId);
    		MapList lstAPContent =  doAP.getArtworkPackageConnectedItems(context, new StringList());
    		
    		slAssignee.addAll(getRouteNodeOrRouteTaskItemsforAP(context, lstAPContent)); 
    		
    		return slAssignee.size() == 0 ? "" : FrameworkUtil.join(slAssignee, strDel);
    	}catch(Exception e){ throw new FrameworkException(e);}
		
    }

    public String getSelectedApproverforPOA (Context context, String args[])
	throws FrameworkException {
    	try{
    		String strPOAId = args[0];
        	String strDel = matrix.db.SelectConstants.cSelectDelimiter;
        	if (strDel == null || strDel.trim().length() == 0) {
        	    strDel = "|";
        	}
        	POA doPOAObject = new POA(strPOAId);
        	String approverId = doPOAObject.getApprovalAssigneeId(context);
        	if (approverId == null || approverId.trim().length() == 0) {
        		return "";
        	}
        	
        	MapList mlRoute = doPOAObject.related(AWLType.ROUTE, AWLRel.OBJECT_ROUTE).id().relid() 
        			.relWhere(AWLUtil.strcat(AWLAttribute.ROUTE_BASE_STATE.getSel(context)  , "== state_Review")).level(1)
        			.query(context);
        	StringList slAssignee = null;
        	if (mlRoute.size() > 0) {
        		String strRouteId = (String) ((Map) mlRoute.get(0)).get(DomainConstants.SELECT_ID);
        		slAssignee = getPersonsAssignedtoRoute(context, strRouteId);
        	} else  {
        		slAssignee = getAssigneeInfoAssigneeID(context, approverId);
        	} 
    		return slAssignee.size() == 0 ? "" : FrameworkUtil.join(slAssignee, strDel); 
    	}catch(Exception e){ throw new FrameworkException(e);}
    	
    }
    
    /**
     * This methods returns the name of the Designer assigned to the POA
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
     				  args[0] will contain the object Id of the POA.
     * @return Returns the Name of the Artwork Designer
     * @throws FrameworkException
     */
    public String getSelectedDesignerforPOA (Context context, String args[]) throws FrameworkException 
    {
    	try
    	{
    		String strPOAId = args[0];
    		POA doPOAObject = new POA(strPOAId);
    		String designerId = doPOAObject.getAuthoringAssigneeId(context);
    		if (designerId == null || designerId.trim().length() == 0) {
    			return "";
    		}
    		return MqlUtil.mqlCommand(context, "print bus $1 select name dump", designerId);

    	}catch(Exception e){ throw new FrameworkException(e);}
    }

	/**
	 * Getting the Product Line/Brand Hierarchy of POA
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return String	Marketing Names with Pipe Symbol (|) Seperated.
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @since  Modified since VR2015x.HF1
	 */
    public String getBrandHierarchy (Context context, String args[]) throws FrameworkException 
    {
    	try
    	{
    		String strDel = matrix.db.SelectConstants.cSelectDelimiter;
    		strDel = BusinessUtil.isNullOrEmpty(strDel) ? "|" : strDel;

    		if (new DomainObject(args[0]).isKindOf(context, AWLType.POA.get(context))) 
    		{
        		POA poa = new POA(args[0]);
        		CPGProduct product =  poa.getProduct(context);
        		
        		return FrameworkUtil.join(BusinessUtil.toStringList(product.getProductHierarchy(context), AWLAttribute.MARKETING_NAME.getSel(context)), strDel);
        	}
    		else
    			return DomainConstants.EMPTY_STRING;
    	}
    	catch(Exception e){ throw new FrameworkException(e);}
    }
    
    private StringList getAssigneeInfoAssigneeID(Context context, String strAssigneeId) throws FrameworkException {
    	try{
    		DomainObject doAssignee = DomainObject.newInstance(context, strAssigneeId);
        	StringList slAssignee = new StringList();
        	if (doAssignee.isKindOf(context, DomainConstants.TYPE_PERSON)) {
        		slAssignee.add(MqlUtil.mqlCommand(context, "print bus $1 select name dump", strAssigneeId));
        	} else {
        		slAssignee = getPersonsAssignedtoRoute(context, strAssigneeId);
        	}
        	return slAssignee;
    	}catch(Exception e){ throw new FrameworkException(e);}
    }

    private StringList getPersonsAssignedtoRoute(Context context, String strRouteId) throws FrameworkException {
    	try{
    		StringList sbAssignee = new StringList();
    		Route rotue = new Route(strRouteId);
    		
    		MapList routeNodeOrTaskList = new MapList();
    		
    		StringList slRouteNodeSelects = new StringList();
    		slRouteNodeSelects.add(SELECT_ID);

    		StringList slRouteNodeRelSelects = new StringList();
    		slRouteNodeRelSelects.add(DomainRelationship.SELECT_ID);
    		slRouteNodeRelSelects.add(DomainRelationship.SELECT_NAME);

    		StringList slRouteTaskObjSelects = new StringList();
    		slRouteTaskObjSelects.add(SELECT_ID);
    		slRouteTaskObjSelects.add(AWLAttribute.ROUTE_NODE_ID.getSel(context));
    		slRouteTaskObjSelects.add(AWLUtil.strcat("from[", AWLRel.PROJECT_TASK.get(context), "].to.id"));
    	
    		MapList routeNodeInfo = RouteUtil.getRouteNodeInfo(context, strRouteId, slRouteNodeSelects, slRouteNodeRelSelects);

    		Map routeNodeOrTaskByRouteNodeId = BusinessUtil.toObjectMap(routeNodeInfo, DomainRelationship.SELECT_ID);

    		if(!"Define".equalsIgnoreCase(rotue.getInfo(context, DomainConstants.SELECT_CURRENT))) {
    			MapList routeTasks = rotue.getRouteTasks(context, slRouteTaskObjSelects, new StringList(), null, false);
    			for (Iterator routeTaskItr = routeTasks.iterator(); routeTaskItr.hasNext();) {
    				Map mpRouteTask = (Map) routeTaskItr.next();
    				String routeNodeId = (String) mpRouteTask.get(AWLAttribute.ROUTE_NODE_ID.getSel(context));
    				routeNodeOrTaskByRouteNodeId.remove(routeNodeId);
    				routeNodeOrTaskByRouteNodeId.put(routeNodeId, mpRouteTask);
    			}
    		}
    		routeNodeOrTaskList.addAll(routeNodeOrTaskByRouteNodeId.values());

    		for(Iterator itrRouteNodeOrTask = routeNodeOrTaskList.iterator();itrRouteNodeOrTask.hasNext();)
    		{
    			Map mapRouteNodeOrRouteTaskValue = (Map)itrRouteNodeOrTask.next();

    			String relName = (String)mapRouteNodeOrRouteTaskValue.get(DomainRelationship.SELECT_NAME);
    			boolean isRouteNode = AWLRel.ROUTE_NODE.get(context).equalsIgnoreCase(relName);
    			
    			String assigneeId = isRouteNode ? BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, SELECT_ID) :
    			BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, AWLUtil.strcat("from[", AWLRel.PROJECT_TASK.get(context), "].to.id"));

    			boolean isAssignedToPerson = BusinessUtil.isKindOf(context, assigneeId, AWLType.PERSON.get(context));

    			if (isAssignedToPerson) {
    				sbAssignee.add(BusinessUtil.getInfo(context, assigneeId, DomainObject.SELECT_NAME));
    			}
    		}

        	return sbAssignee;
    	}catch(Exception e){ throw new FrameworkException(e);}
    }


    private StringList getRouteNodeOrRouteTaskItemsforAP(Context context, MapList artworkPackageImplItems) throws FrameworkException 
	{
		StringList slAssigneeList = new StringList();
		try {
			AWLArtworkPackageUIBase_mxJPO awlap = new AWLArtworkPackageUIBase_mxJPO(context, new String[]{});
			MapList ml = awlap.getRouteNodeOrRouteTaskItems(context, artworkPackageImplItems, EMPTY_STRING);
			for (Iterator itr = ml.iterator(); itr.hasNext();)
			{
				Map mp      = (Map)itr.next();
				slAssigneeList.add(BusinessUtil.getString(mp, AWLConstants.ASSIGNEE_NAME));
			}
		} catch (Exception e) { throw new FrameworkException(e);}
		return slAssigneeList;
	}
    
	public String includeMCE(Context context, String args[]) throws Exception {
		
		String sMCE = args[0];
		boolean include = true;
		int revLevel = AWLGlobalPreference.getMasterRevisionDisplayPref(context);//last 2 revisions allowed		

		if (UIUtil.isNotNullAndNotEmpty(sMCE)) {
			DomainObject domObj = DomainObject.newInstance(context, sMCE);			
			
			BusinessObjectList boList = domObj.getRevisions(context);			 
			MapList ml = domObj.getRevisionsInfo(context, new StringList(new String[] {SELECT_ID}), EMPTY_STRINGLIST);
			
			int mlSize = ml.size();
			if(mlSize <= revLevel) 
				return Boolean.toString(include);
			
			while(revLevel > 0) {
				Map m = (Map) ml.get(--mlSize);
				String id = (String) m.get(SELECT_ID);
				
				if(sMCE.equals(id)) {
					return Boolean.toString(include);
				}				
				--revLevel;
			}
			include = false;
		}

		return Boolean.toString(include);
	}
}
