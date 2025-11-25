/*
 **  Copyright (c) 1992-2020 Dassault Systemes.
 **  All Rights Reserved.
 **  This program contains proprietary and trade secret information of MatrixOne,
 **  Inc.  Copyright notice is precautionary only
 **  and does not evidence any actual or intended publication of such program
 */
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.CopyList;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

@SuppressWarnings({"PMD.SignatureDeclareThrowsException" })
public class AWLCopyListBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = 1L;

	public AWLCopyListBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/** This trigger method  Will check for Artwork Copy Element Ids  that are Connected to CopyList. If no elements are present then Copy List should not be allowed to be promoted to review state.
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param 	args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int hasArtworkElementsAssociated (Context context, String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();
			String copyListObjId = args[0];
			CopyList copyListObj = new CopyList(copyListObjId);
			String interfaceSel = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.",AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context));
			String isStructureSel = AWLUtil.strcat("from[",AWLRel.STRUCTURED_ARTWORK_ELEMENT.get(context),"]");
			String isProxyStructureSel = AWLUtil.strcat("from[",AWLRel.STRUCTURED_ARTWORK_ELEMENT_PROXY.get(context),"]");
			MapList allActiveCopyElementsConnected = copyListObj.getArtworkElements(context, StringList.create(interfaceSel,isStructureSel,isProxyStructureSel), null, false);
			if(allActiveCopyElementsConnected.isEmpty())
			{
				MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context,"emxAWL.checkConnectedObjectToCopyList.Alert"));
				return 1;
			}
			
			for (Map currentMap : (List<Map>)allActiveCopyElementsConnected) {
				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)currentMap.get(interfaceSel)) && AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)currentMap.get(isStructureSel)) && AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)currentMap.get(isProxyStructureSel))) {
					MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context,"emxAWL.NoStructure.Error.Message"));
					return 1;
				}
			}
			
			return 0;

		}
		catch (Exception e) { throw new FrameworkException(e); }	
	}
	
	/** This trigger method  Will check for POAs that are Connected to CopyList. If any POAs connected are not in obsolete state then the obsoletion of CopyList should be blocked.
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param   args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws Exception 
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
     * @deprecated - Its depricated because this is not used anywhere.
	 */
	public int checkConnectedPOAState (Context context, String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();
			String copyListObjId = args[0];
			CopyList copyListObj = new CopyList(copyListObjId);
			
			String whereExpr = AWLUtil.strcat("current != ",  AWLState.DRAFT.get(context, AWLPolicy.POA),
					"&&", "current != ",  AWLState.RELEASE.get(context, AWLPolicy.POA),
					"&&", "current != ",  AWLState.OBSOLETE.get(context, AWLPolicy.POA));
			
			MapList allNonRemovablePOAs = copyListObj.getPOAs(context, whereExpr);
			//if connected POAs are not obsolete then block the copy list promote to obsolete.
			if(!allNonRemovablePOAs.isEmpty()){
				MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context,"emxAWL.checkConnectedPOAState.Alert"));
				return 1;
			}

			return 0;	
		}
		catch(Exception e) { throw new FrameworkException(e);}

	}
	
	
	/** This trigger method  will update the Is Mandatory attribute on copy list based on Is mandatory attribute value set on the Artwork Assembly relationship
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param   args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
	 */
	
	public void updateIsMandatory(Context context, String[] args) throws FrameworkException
	{
		try
		{
			
			// Arguments passed -- > From Type, From Object Id, new Attribute Value, relationship type, object Id(Removed since not used)
			String fromType = args[0];
			String fromObjId = args[1];
			String newAttrValue = args[2];
			String relType = args[3];
			
			CopyList copyListObj = new CopyList(fromObjId);
			String IS_MANDATORY = AWLAttribute.IS_MANDATORY.get(context);

			if(!(AWLType.COPY_LIST.get(context).equals(fromType) && AWLRel.ARTWORK_ASSEMBLY.get(context).equalsIgnoreCase(relType)))
			{
				return;
			} 
			
			//if relationship attr isMandatory is set to true then set the attribute isMandatory on CopyList to True 
			if(AWLConstants.IS_MANDATORY_RANGE_YES.equalsIgnoreCase(newAttrValue) || "True".equalsIgnoreCase(newAttrValue))
			{
				copyListObj.setAttributeValue(context, IS_MANDATORY, AWLConstants.IS_MANDATORY_RANGE_YES);
				return;
			}
			
			//if relationship attr isMandatory is set to false then check for isMandatory attr on other relationships as well, If all are false then set the attribute on copylist to be false
			if("False".equalsIgnoreCase(newAttrValue) || AWLConstants.IS_MANDATORY_RANGE_NO.equalsIgnoreCase(newAttrValue) )
			{
				String SEL_IS_MAND_ATTR = AWLAttribute.IS_MANDATORY.getSel(context);
				MapList allActiveCopyElementsConnected = copyListObj.getArtworkElements(context, null, BusinessUtil.toStringList(SEL_IS_MAND_ATTR),	false);
				StringList mandAttrVal = BusinessUtil.toStringList(allActiveCopyElementsConnected, SEL_IS_MAND_ATTR);
				for (String val : (List<String>) mandAttrVal) {
					if("true".equalsIgnoreCase(val) || AWLConstants.IS_MANDATORY_RANGE_YES.equalsIgnoreCase(val))
						return;
				}
				copyListObj.setAttributeValue(context, IS_MANDATORY, AWLConstants.IS_MANDATORY_RANGE_NO);
			}
		}
		catch(Exception e) {throw new FrameworkException(e);}		
	}
	
	
	public int hasAccess(Context context, String[] args) throws FrameworkException {
		try {
			Access.checkRequiredAccess(context, args[0]);
		} catch (Exception e) { 
			MqlUtil.mqlCommand(context, "notice $1", e.getMessage());
			return 1;
		}
		return 0;
	}
	
	/**
	 * To update the Artwork Usage attribute value for Copy List
	 * @param context
	 * @param args
	 * @throws FrameworkException
	 */
	public static void updateArtworkUsage(Context context, String args[]) 
			throws FrameworkException {
		
		try {
			Map programMap = JPO.unpackArgs(args);
			Map paramMap = (HashMap)programMap.get("paramMap");
			
			String[] newValues = (String[])paramMap.get("New Values");
			String copyListId = (String)paramMap.get("objectId");
			
			CopyList copyList = new CopyList(copyListId);
			copyList.setArtworkUsage(context, newValues);
			
		} catch(Exception e) {
			//e.printStackTrace();
			throw new FrameworkException();
		}
	}
	
	/** This trigger method  will change the artwork assembly relationship(between copy list and artwork elements) to artwork assembly history on obsoletion of Copy list.
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param   args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
	 */
	
	public void changeToHistoryRelationship(Context context, String[] args) throws FrameworkException {
		try{
			ContextUtil.pushContext(context);
			String copyListObjId = args[0];
			CopyList copyListObj = new CopyList(copyListObjId);
			
			SimpleDateFormat sdf = new SimpleDateFormat( eMatrixDateFormat.getEMatrixDateFormat(), context.getLocale());			
			String strTodaysDate = sdf.format(new Date());
			Map effectivityAttr = Collections.singletonMap(AWLAttribute.END_EFFECTIVITY_DATE.get(context), strTodaysDate);
			
			MapList connectedObjects = copyListObj.getAllCopyElements(context);
			StringList relIDs = BusinessUtil.toStringList(connectedObjects, DomainRelationship.SELECT_ID);
			BusinessUtil.changeRelName(context, relIDs, AWLRel.ARTWORK_ASSEMBLY_HISTORY.get(context), effectivityAttr);
			
			connectedObjects = copyListObj.getPlaceOfOriginList(context);
			relIDs = BusinessUtil.toStringList(connectedObjects, DomainRelationship.SELECT_ID);
			BusinessUtil.changeRelName(context, relIDs, AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context), null);
			
			connectedObjects = copyListObj.getPOAs(context, true);
			relIDs = BusinessUtil.toStringList(connectedObjects, DomainRelationship.SELECT_ID);
			BusinessUtil.changeRelName(context, relIDs, AWLRel.POA_COPY_LIST_HISTORY.get(context), null);
			
		} catch(Exception e) {throw new FrameworkException(e);}
		  finally {ContextUtil.popContext(context);}
	}
	
	/** This will Check the Composite Copy Elements in the Copy List are having latest and released list items.
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param 	args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
	 */
	public int checkCompositeHasLatestAndReleaseListItems(Context context,String[] args)throws FrameworkException
	{
		try{
			if(args.length == 0 )
				throw new IllegalArgumentException();			
			String copyListId = args[0];
			CopyList copyListObj = new CopyList(copyListId);
			MapList artworkMasters = copyListObj.getMasterArtworkElementsList(context, null);
			StringList copyListlangs = copyListObj.getLanguageNames(context);
			for (Map master : (List<Map>)artworkMasters) {
				String id = (String) master.get(SELECT_ID);
				ArtworkMaster am = new ArtworkMaster(id);
				HashMap<String, StringList> resultMap = (HashMap <String, StringList>) 
						am.hasCompositeAssociatedWithLatestAndReleaseListItems(context, copyListlangs);
				if(!resultMap.isEmpty())
				{
					MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context,"emxAWL.checkConnectedObjectState.Alert"));
					return 1;
				}					
			}
			return 0;	
		}catch(Exception e){ throw new FrameworkException(e);}
	}

}

