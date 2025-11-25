/*
 **  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.Relationship;
import matrix.db.RelationshipList;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.dao.GraphicsElement;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.cpd.util.CPDPropertyUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;

@SuppressWarnings("PMD.NPathComplexity")
public class AWLGraphicsElementBase_mxJPO extends AWLArtworkElementBase_mxJPO
{
	private static final String TO_OPEN = "to[";
	private static final String MOD_MQL_PROJ = "mod bus $1 project $2";
	private static final String MOD_MQL_ORG = "mod bus $1 organization $2";
	private static final String MQL_NOTICE = "notice $1";
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6501016456394784705L;

	@SuppressWarnings({ "PMD.AvoidCatchingThrowable" })
	public AWLGraphicsElementBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	public static Boolean isAWLDocument(Context context, String[] args)throws FrameworkException
	{
		try
		{
			HashMap hMap = (HashMap) JPO.unpackArgs(args);		 
			String objectId = (String) hMap.get(AWLConstants.OBJECT_ID);
			
			return BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.get(context)) ? true : 
	 			   BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context)) ? true :
	 			   new GraphicDocument(objectId).isDocumentAssociatedToGraphicElement(context);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public static Boolean isVisibleForAWL(Context context,String[] args)throws FrameworkException
	{
		return !isAWLDocument(context, args);
	}

	public static Boolean isVersionable(Context context,String[] args)throws FrameworkException
	{
		return !isAWLDocument(context, args) && allowGraphicFileVersioning(context, args);
	}
	
	public static Boolean isAWLVersionable(Context context,String[] args)throws FrameworkException
	{
		return isAWLDocument(context, args) && allowGraphicFileVersioning(context, args);
	}

	@SuppressWarnings({"PMD.AvoidCatchingThrowable"})
	public static boolean allowGraphicFileVersioning(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap hMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) hMap.get(AWLConstants.OBJECT_ID);		

			GraphicDocument graphicdoc = null;
			if(BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.get(context))) {
				ArtworkMaster artworkMaster = new ArtworkMaster(objectId);
				List<ArtworkContent> elements = artworkMaster.getArtworkElementContent(context, null);
				if(elements == null || elements.size() != 1)
				{
					String message =  AWLPropertyUtil.getI18NString(context,"AWL.Graphic.Message");
					throw new FrameworkException(message);
				}
				GraphicsElement element = (GraphicsElement) elements.get(0);
				graphicdoc = element.getGraphicDocument(context);
			} else if(BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context))) {
				GraphicsElement element = new GraphicsElement(objectId);
				graphicdoc = element.getGraphicDocument(context);
			} else {
				graphicdoc = new GraphicDocument(objectId);
			}
			HashMap newMap = new HashMap();
			newMap.put("objectId", graphicdoc.getId(context));

			String command = "print program $1 select $2 dump $3";
			String className = MqlUtil.mqlCommand(context, command, "emxCommonDocument", "classname", "|");

			return (Boolean) JPO.invokeLocal(context, className, JPO.packArgs(newMap), "allowFileVersioning", JPO.packArgs(newMap), Boolean.class);
		} catch (Throwable e){ throw new FrameworkException(e.toString()); }
	}
	
	public void cloneImageHolderToArtworkElement(Context context, String[] args) throws FrameworkException
	{
		
		try
		{
			Map<String, String> majorMinorID = getMajorMinorID(context,args);
			if(majorMinorID == null)
				return;
			String majorGraphicDocID = (String) majorMinorID.get("MAJOR_ID");
			if(!BusinessUtil.isNotNullOrEmpty(majorGraphicDocID))
				return;
			GraphicDocument docObj = new GraphicDocument(majorGraphicDocID);
			cloneImageHolderToArtworkElements(context,docObj);
			
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}

	/* This API has the common Logic used for Cloning, Disconnects the existing Image Holder present 
	 * on Artwork Element and Master Graphic Element and connects the updated Image Manager*/
	private void cloneImageHolderToArtworkElements(Context context, GraphicDocument docObj) throws FrameworkException {
		try{
			GraphicsElement graphicElement = docObj.getGraphicElement(context);
		
		if(graphicElement == null)
			return;

		//Delete current Image Holders of Element and Master 
		String elementImgHolderId = graphicElement.getImageHolderId(context);
		if(BusinessUtil.isNotNullOrEmpty(elementImgHolderId)){
			//String[] arr = {elementImgHolderId};
			//DomainObject.deleteObjects(context, arr);
			String imgHolderRelId = BusinessUtil.getInfo(context, graphicElement.getId(context), AWLUtil.strcat(TO_OPEN, AWLRel.IMAGE_HOLDER.get(context),  "].id"));
			DomainRelationship.disconnect(context, imgHolderRelId);
		}

		ArtworkMaster artworkMaster = graphicElement.getArtworkMaster(context);
		String masterImgHolderId = artworkMaster.getImageHolderId(context);
		if(BusinessUtil.isNotNullOrEmpty(masterImgHolderId)){
			//String[] arr = {masterImgHolderId};
			//DomainObject.deleteObjects(context, arr);
			String imgHolderRelId = BusinessUtil.getInfo(context, artworkMaster.getId(context), AWLUtil.strcat(TO_OPEN, AWLRel.IMAGE_HOLDER.get(context), "].id"));
			DomainRelationship.disconnect(context, imgHolderRelId);
		}
		
		//Connect cloned Doc Image Holder to Element and Master
		String strImgHolderId = docObj.getImageHolderId(context);
		if(BusinessUtil.isNotNullOrEmpty(strImgHolderId)) {
			DomainObject imageHolderObject = new DomainObject(strImgHolderId);
			//clone image holder and connect to graphic element
			DomainObject imageClone = new DomainObject(imageHolderObject.cloneObject(context, null));
			graphicElement.connectFrom(context, AWLRel.IMAGE_HOLDER, new DomainObject(imageClone));
			//clone image holder and connect to master graphic element
			imageClone = new DomainObject(imageHolderObject.cloneObject(context, null));
			artworkMaster.connectFrom(context, AWLRel.IMAGE_HOLDER, new DomainObject(imageClone));
		}
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}

	/**
	 * To Sync Document Image Holder to Element and Master Element 
	 */
	public void cloneImageHolderFromDocument(Context context, String[] args) throws FrameworkException 
	{
		try {

			String docId = args[0];

			GraphicDocument docObj = new GraphicDocument(docId);
			StringList selects = new StringList(CommonDocument.SELECT_MOVE_FILES_TO_VERSION);
			selects.add(AWLUtil.strcat(TO_OPEN, AWLRel.ACTIVE_VERSION.get(context), "].from.id"));
			selects.add(SELECT_REVISION);
			Map docMap = docObj.getInfo(context, selects);
			//Get Document Id based on moveFilesToVersion Attribute
			boolean moveFilesToVersion = "true".equalsIgnoreCase((String)docMap.get(CommonDocument.SELECT_MOVE_FILES_TO_VERSION)) ? true : false;
			if(moveFilesToVersion) {
				docId = (String)docMap.get(AWLUtil.strcat(TO_OPEN, AWLRel.ACTIVE_VERSION.get(context), "].from.id"));
				docObj = new GraphicDocument(docId);
			}
			//Get Document Id based on revision for TypeGraphicDocumentRevisionAction Trigger case
			String rev = (String)docMap.get(SELECT_REVISION);
			if(BusinessUtil.isNotNullOrEmpty(rev)) {
				GraphicDocument newDocObj = new GraphicDocument(docObj.getLastRevision(context));
				GraphicDocument prevDocObj =  new GraphicDocument(newDocObj.getPreviousRevision(context));
				if(prevDocObj != null && rev.equals(prevDocObj.getRevision()))
						docObj = newDocObj;
			}
			
			cloneImageHolderToArtworkElements(context,docObj);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	public int checkGraphicActiveVersionsToAddImage(Context context, String[] args) throws FrameworkException
	{
		try {
			String docId = args[0];
			GraphicDocument docObj = new GraphicDocument(docId);
			GraphicsElement element = docObj.getGraphicElement(context);
			if(element == null)
				return 0;

			MapList activeFilesList = docObj.related(new AWLType[]{AWLType.GRAPHIC_DOC, AWLType.PHOTO_DOC, AWLType.SYMBOL_DOC}, 
													 new AWLRel[]{AWLRel.ACTIVE_VERSION}).query(context);
			if(activeFilesList.size() != 1) {
				String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.GraphicActiveFilesLimit");
				MqlUtil.mqlCommand(context, MQL_NOTICE, strAlert);
				return 1;
			}
			return 0;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public int checkAssociatedElementState(Context context, String[] args) throws FrameworkException
	{
		if(args.length == 0)
			throw new IllegalArgumentException();
		try {
			String documentId = args[0];
			String state = args[1];
			GraphicDocument gdoc = new GraphicDocument(documentId);
			GraphicsElement ge = gdoc.getGraphicElement(context);
			
			if(ge != null) {
				String currentState = ge.getInfo(context, SELECT_CURRENT);
				if(!currentState.equalsIgnoreCase(state)) {
					String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.GraphicElementState");
					MqlUtil.mqlCommand(context, MQL_NOTICE, strAlert);
					return 1;
				}
			}
			return 0;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public void reviseConnectedLocalCopy(Context context, String[] args) throws FrameworkException
	{
		try {
			String currentDocId = args[0];
	
			GraphicDocument doc = new GraphicDocument(currentDocId);
			GraphicsElement element =  doc.getGraphicElement(context);
			//If not connected to Graphic Element no need to proceed further
			if(element == null)
				return;
	
			boolean isElementLastRevision = element.isLastRevision(context);
			DomainObject revised = isElementLastRevision ?  new DomainObject(element.reviseObject(context, true)) : 
														    new DomainObject(element.getNextRevision(context));	
			DomainObject docLatest = new DomainObject(doc.getNextRevision(context));
			
			GraphicsElement revisedElement = new GraphicsElement(revised);
			GraphicDocument revisedDoc = new GraphicDocument(docLatest);
			revisedElement.connectTo(context, AWLRel.GRAPHIC_DOCUMENT, revisedDoc);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	public int deleteConnectedDocument(Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];

			PropertyUtil.setRPEValue(context, "fromCopyElement", "true" ,false);
			GraphicsElement ge = new GraphicsElement(objectId);
			GraphicDocument domDoc = ge.getGraphicDocument(context);
			boolean canDelete = true;
			
			StringList symbolicRels = FrameworkUtil.split(AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.GraphicDoc.DeleteCheckRels"), ",");
			
			if(symbolicRels.size() > 0) {
				StringList relConfiguredNotToDel = new StringList(symbolicRels.size());
				for (int i = 0; i < symbolicRels.size(); i++) {
					relConfiguredNotToDel.addElement(PropertyUtil.getSchemaProperty(context, (String) symbolicRels.get(i)));
				}
				try {
					//Pushing the context here, if user not having access to the connected object that rel will be be captured here
					ContextUtil.pushContext(context);
					RelationshipList relList = domDoc.getAllRelationship(context);
					StringList docRels = new StringList(relList.size());
					for(int i=0; i < relList.size(); i++) {
						docRels.addElement(((Relationship)relList.get(i)).getTypeName());
					}
					canDelete = !BusinessUtil.matchingAnyValue(docRels, relConfiguredNotToDel); 
				} finally {
					ContextUtil.popContext(context);
				}
 			}
			if(canDelete) {
				StringList strActiveDocs = domDoc.getInfoList(context, AWLUtil.strcat("from[", AWLRel.ACTIVE_VERSION.get(context), "].to.id"));
				for(int i=0; i<strActiveDocs.size(); i++ ) {
					DomainObject doActiveDoc = new DomainObject((String) strActiveDocs.get(i));
					doActiveDoc.deleteObject(context, true);
				}
				domDoc.deleteObject(context, true);
			}


			PropertyUtil.setRPEValue(context, "fromCopyElement", "false" ,false);
			return 0;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public int checkAssociatedAWLElement(Context context, String[] args) throws FrameworkException
	{
		try {
			String docId = args[0];
			if("true".equalsIgnoreCase(PropertyUtil.getRPEValue(context, "fromCopyElement", false)))
				return 0;
			boolean imageDoc = new GraphicDocument(docId).isDocumentAssociatedToGraphicElement(context);
			if(imageDoc)
			{
				String strAlert =  AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.GraphicIsConnectedToArtworkElement");
				MqlUtil.mqlCommand(context, MQL_NOTICE, strAlert);
			}
			return imageDoc ? 1 : 0;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	@Deprecated
	public int deleteMasterGraphicElementCheck(Context context,String[] args) throws FrameworkException
	{
		try{		
			String objectId  =  args[0];
			String strAlertKey = "";
			ArtworkMaster am = new ArtworkMaster(objectId);
			/*strAlertKey = !FrameworkUtil.hasAccess(context,am , "delete") ? "emxAWL.Alert.NoDeleteAccess" :
								am.isIncludedInMCL(context) ? "emxAWL.ArtworkElement.InUse" : 
									(am.getPOAs(context, AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT))).size() > 0 
											? "emxAWL.Alert.ObsoletePOA" : strAlertKey;*/
			if(BusinessUtil.isNotNullOrEmpty(strAlertKey))
			{
				String strAlert =  AWLPropertyUtil.getI18NString(context, strAlertKey);
				MqlUtil.mqlCommand(context, MQL_NOTICE, strAlert);
				return 1;
			}
		} catch (Exception e){ throw new FrameworkException(e);	}
		return 0;
	}
	
	//when graphic master is transferred, transfer its base copy and graphic doc also
	public void transferOwnershipofBasecopy (Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ArtworkMaster am = new ArtworkMaster(objectId);
			ArtworkContent baseElement = am.getBaseArtworkElement(context);
			
			if(baseElement==null)
			{
				return;
			}
			GraphicsElement ge=new GraphicsElement(baseElement.getId(context));
			GraphicDocument gd=ge.getGraphicDocument(context);
			if(ge==null || gd==null){
				return;
			}
			
			

			StringList selectList=new StringList();
			selectList.add(DomainConstants.SELECT_OWNER);
			selectList.add(AWLConstants.PROJECT);
			selectList.add(AWLConstants.ORGANIZATION);
			Map<?, ?> artworkMasterInfo = am.getInfo(context, selectList);
			artworkMasterInfo.remove(SELECT_ID);
			artworkMasterInfo.remove(SELECT_TYPE);

			String srcValue="";
			String dstnValue="";
			String command="";

			
			Map<?, ?>  artworkBaseInfo = baseElement.getInfo(context, selectList);
			artworkBaseInfo.remove(SELECT_ID);
			artworkBaseInfo.remove(SELECT_TYPE);
			
			
			Map<?, ?>  graphicDocInfo = gd.getInfo(context, selectList);
			graphicDocInfo.remove(SELECT_ID);
			graphicDocInfo.remove(SELECT_TYPE);
			
			//compare artwork master with base copy
			if( artworkMasterInfo.equals(artworkBaseInfo)){
				return;
			}			
			else{
				srcValue=(String)artworkMasterInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)artworkBaseInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					baseElement.setOwner(context, srcValue);
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command = MOD_MQL_PROJ;
					MqlUtil.mqlCommand(context, command, true, baseElement.getObjectId(),srcValue);				
					
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command=MOD_MQL_ORG;
					MqlUtil.mqlCommand(context, command, true, baseElement.getObjectId(),srcValue);
									
				}
			}
			
			//compare artwork master with graphic document
			if( artworkMasterInfo.equals(graphicDocInfo)){
				return;
			}			
			else{
				srcValue=(String)artworkMasterInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)graphicDocInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					gd.setOwner(context, srcValue);
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)graphicDocInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command=MOD_MQL_PROJ;
					MqlUtil.mqlCommand(context, command, true, gd.getObjectId(),srcValue);				
					
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)graphicDocInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command = MOD_MQL_ORG;
					MqlUtil.mqlCommand(context, command, true, gd.getObjectId(),srcValue);
									
				}
			}
			
			

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	//when graphic doc is transferred,transfer base copy,graphic master also
	public void transferOwnershipofMastercopy (Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];
				boolean isCPGObject = CPDPropertyUtil.isCPGGraphicPolicy(context,objectId);
			if(!isCPGObject){
				return;
			}
			GraphicDocument gd=new GraphicDocument(objectId);
			ArtworkContent content=gd.getGraphicElement(context);
			ArtworkMaster am=gd.getGraphicMaster(context);
			if(content==null)
			{
				return;
			}
			if(am==null)
			{
				return;
			}

			StringList selectList=new StringList();
			selectList.add(DomainConstants.SELECT_OWNER);
			selectList.add(AWLConstants.PROJECT);
			selectList.add(AWLConstants.ORGANIZATION);
			Map<?, ?> gdInfo = gd.getInfo(context, selectList);
			gdInfo.remove(SELECT_ID);
			gdInfo.remove(SELECT_TYPE);
			
			Map<?, ?> artworkBaseInfo = content.getInfo(context, selectList);
			artworkBaseInfo.remove(SELECT_ID);
			artworkBaseInfo.remove(SELECT_TYPE);

			String srcValue="";
			String dstnValue="";
			String command="";

			Map<?, ?>  artworkMasterInfo= am.getInfo(context, selectList);
			artworkMasterInfo.remove(SELECT_ID);
			artworkMasterInfo.remove(SELECT_TYPE);
			//compare graphic doc and graphic element base
			if( gdInfo.equals(artworkBaseInfo))
				return;
			else{			

				srcValue=(String)gdInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)artworkBaseInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					content.setOwner(context, srcValue);
				}
				srcValue=(String)gdInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command = MOD_MQL_PROJ;
					MqlUtil.mqlCommand(context, command, true,content.getObjectId(),srcValue);


				}
				srcValue=(String)gdInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command=MOD_MQL_ORG;
					MqlUtil.mqlCommand(context, command, true, content.getObjectId(),srcValue);

				}
			}
			
			
			//compare graphic doc and graphic master
			if( gdInfo.equals(artworkMasterInfo))
				return;
			else{			

				srcValue=(String)gdInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)artworkMasterInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					am.setOwner(context, srcValue);
				}
				srcValue=(String)gdInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)artworkMasterInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command=MOD_MQL_PROJ;
					MqlUtil.mqlCommand(context, command, true,am.getObjectId(),srcValue);


				}
				srcValue=(String)gdInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)artworkMasterInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command=MOD_MQL_ORG;
					MqlUtil.mqlCommand(context, command, true, am.getObjectId(),srcValue);

				}
			}

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
}

