/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.matrixone.apps.awl.dao.ArtworkFile;
import com.matrixone.apps.awl.dao.ArtworkTemplate;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException"})
public class AWLArtworkTemplateBase_mxJPO extends AWLObject_mxJPO
{
	private static final String FROM_OPEN = "from[";
	private static final String TEMPLATE_REV = "templateRev";
	private static final String TEMPLATE_NAME = "templateName";
	private static final String POA_REV = "poaRev";
	private static final String POA_NAME = "poaName";
	private static final String POA_INFO = "poaInfo";
	private static final long serialVersionUID = -5655957929987762868L;

	public AWLArtworkTemplateBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/**	  
	 * This method is Called by Artwork Template Preliminary promote check trigger to check whether some file is associated with Artwork Template. 
	 * Method to Check whether the Artwork Template File is attached or Not
	 * @param   context - the Enovia <code>Context</code> object
	 * @param   args    -  Array of Arguments. 
	 * @return 1(If file is not associated) or 0
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during Artwork Template Highlight. 
	 */	
	public int checkArtworkTemplateFileAvailability (Context context, String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException(); 

			String artworkTemplateId = args[0];
			ArtworkTemplate artworkTemplateFile	= new ArtworkTemplate(artworkTemplateId);
			
			if(!artworkTemplateFile.hasFile(context)) {    	
				MqlUtil.mqlCommand(context, "error $1", AWLPropertyUtil.getI18NString(context,"emxAWL.artworkTemplate.NoFileConnected"));
				return 1;
			}
			return 0;
		} catch(Exception e){ throw new FrameworkException(e);}

	}

	/**
	 * Review - Release Promote Action trigger to promote previous Artwork Template revision to obsolete state.
	 * @param   context - the eMatrix <code>Context</code> object
	 * @param   args    - holds the parameters
	 * @return  void
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during Artwork Template Highlight . 
	 * */
	public void promotePreviousArtworkTemplateRevToObsoleteState(Context context ,String[] args)throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException(); 

			String artworkTemplateId = args[0];			
			
			ContextUtil.startTransaction(context, true);						
			ArtworkTemplate artTemp = new ArtworkTemplate(artworkTemplateId);
			// Get the previous revision of the Artwork Template
			ArtworkTemplate prevRevision = artTemp.getPreviousRevision(context, ArtworkTemplate.class);	
			if (prevRevision != null) {
				// Set previous Artwork Template Revision to Obsolete state
				prevRevision.setState(context, AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_TEMPLATE));
			}
			ContextUtil.commitTransaction(context);
		}
		catch (Exception ex) {
			ContextUtil.abortTransaction(context);
			throw new FrameworkException(ex);
		}	
	}
	
	/**	  
	 * Connects Revised Artwork Tempate with Product Line/ Product /POA and disconnects the old Artwork Template
	 * @param   context - the Enovia <code>Context</code> object
	 * @param   args    -  Array of Arguments. 
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Subbarao G (SY6)
	 */	
	public void connectReivsedArtworkTemplate(Context context, String[] args) throws FrameworkException{
		try {
			String oldArtwrokTemplateId = getObjectId(context);
			
			ArtworkTemplate oldArtwrokTemplate = new ArtworkTemplate(oldArtwrokTemplateId);
			ArtworkTemplate newArtwrokTemplate = new ArtworkTemplate(oldArtwrokTemplate.getNextRevision(context));
			
			if(newArtwrokTemplate == null) 
				return;

			MapList templateWhereUsedList = oldArtwrokTemplate.getWhereUsed(context);
	        String ctxUSER = context.getUser();
			
			for (Iterator iterator = templateWhereUsedList.iterator(); iterator.hasNext();) {
				Map templateWhereUsedMap = (Map) iterator.next();
				String objectId = (String)templateWhereUsedMap.get(DomainConstants.SELECT_ID);
				String connectionId = (String)templateWhereUsedMap.get(DomainRelationship.SELECT_ID);
				String objectState = (String)templateWhereUsedMap.get(DomainConstants.SELECT_CURRENT);
				boolean isPOA = BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context));
				boolean poaInObsolete =  isPOA && AWLState.OBSOLETE.equalsObjectState(context, AWLPolicy.POA, objectState);
				if(isPOA && !poaInObsolete) {  
					boolean isContextPushed = false;
					try {
			            boolean hasModifyAccess = Access.hasAccess(context, objectId, "modify");
			            
			            if(!hasModifyAccess) {
			            	//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3" , true, objectId , ctxUSER, "modify");
			            	ContextUtil.pushContext(context);
			    			isContextPushed = true;
			            }
						
						DomainRelationship.setToObject(context, connectionId, newArtwrokTemplate);
						
					/*	if(!hasModifyAccess) {
					        MqlUtil.mqlCommand(context, "mod bus $1 revoke grantor $2 grantee $3", true, objectId,	PropertyUtil.getSchemaProperty(context, "person_UserAgent"), ctxUSER); 
						} */
					} catch (Exception e) { e.printStackTrace();
						throw new FrameworkException(e); 
					}finally {
						if(isContextPushed) {
							ContextUtil.popContext(context);
						}
					}
				} else {
					DomainRelationship.setToObject(context, connectionId, newArtwrokTemplate);
				}
			}
			
		} catch (Exception e) {e.printStackTrace();
			throw new FrameworkException(e);
		}
		
	}
	
	/**	  
	 * Artwork Template Revise Process
	   1) POA in Artwork In Process and Artwork File in Preliminary State.
		  Send Notification to the Artwork In Process POAs and Graphic Designer
	   2) POA in Review State and Artwork File in Review State.
		  Send Notification to the Review POA owners
	   3) POA in Release state and Artwork File in Preliminary/ Review/ Release state.
	      a) If Artwork File is in Preliminary State
			 Send notification to the POA owners
		  b) If Artwork File is in Review State.
		  	 Demote the Artwork File from Review to Preliminary State.
			 Send notification to the Artwork File Owner and POA owner.
		  c) If Artwork File is in Release State.
			 Revise the Artwork File and connects to the POA
			 Send notification to the POA Owner
	 * @param   context - the Enovia <code>Context</code> object
	 * @param   args    -  Array of Arguments. 
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Subbarao G (SY6)
	 */	
	public void artworkTemplateReviseProcess(Context context, String[] args) throws FrameworkException
	{
		try {
			String artwrokTemplateId = getObjectId(context);
			ArtworkTemplate artworkTemplate = new ArtworkTemplate(artwrokTemplateId);
			
			Map templateMap = BusinessUtil.getInfo(context, artwrokTemplateId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
			String templateName = BusinessUtil.getString(templateMap, SELECT_NAME);
			String templateRev = BusinessUtil.getString(templateMap, SELECT_REVISION);
			
			ContextUtil.startTransaction(context, true);
			
			// POA in Artwork In Process and Artwork File in Preliminary State.
			// Send Notification to the Artwork In Process POAs and Graphic Designer
			List<POA> artworkInProcessPOAList = artworkTemplate.getPOAs(context, AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA));			
			if(BusinessUtil.isNotNullOrEmpty(artworkInProcessPOAList)) {
				
				for (POA poa : artworkInProcessPOAList) {
					String poaId = poa.getObjectId(context);
					
					String designerRoute  = RouteUtil.getConnectedRoute(context, poaId, RouteUtil.getArtworkAction(context, poaId, true));
					String designerTaskOwner = "";
					if(BusinessUtil.isNotNullOrEmpty(designerRoute)) {
						designerTaskOwner = BusinessUtil.getInfo(context, designerRoute, AWLUtil.strcat(FROM_OPEN, AWLRel.ROUTE_NODE.get(context), "].to.owner"));

						Map poaMap = BusinessUtil.getInfo(context, poaId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
						String poaName = BusinessUtil.getString(poaMap, SELECT_NAME);
						String poaRev = BusinessUtil.getString(poaMap, SELECT_REVISION);

						String subjectKeys[] = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
						String subjectKeyValues[] = new String[]{poaName, poaRev, templateName, templateRev};
						String messageKeys[] = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
						String messageKeyValues[] = new String[]{poaName, poaRev, templateName, templateRev};
						
						String subjectKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateRevise.Designer.Subject", subjectKeys, subjectKeyValues);
						String messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateRevise.Designer.Message", messageKeys, messageKeyValues);

						// Sending notification to the Designer.
						sendNotification(context, designerTaskOwner, subjectKey, messageKey);
					}
				}
			}
			
			// POA in Review State and Artwork File in Review State.
			// Send Notification to the Review POA owners using POA demote trigger.
			List<POA> reviewPOAList = artworkTemplate.getPOAs(context, AWLState.REVIEW.get(context, AWLPolicy.POA));
			if(BusinessUtil.isNotNullOrEmpty(reviewPOAList)) {	
				for (POA poa : reviewPOAList) {					
					poa.demote(context);
				}
			}

			// POA in Release state and Artwork File in Preliminary/ Review/ Release state.
			List<POA> releasePOAList = artworkTemplate.getPOAs(context, AWLState.RELEASE.get(context, AWLPolicy.POA));
			if(BusinessUtil.isNotNullOrEmpty(releasePOAList)) {
				
				for (POA poa : releasePOAList) {
					
					ArtworkFile artworkFile = new ArtworkFile(poa.getArtworkFile(context));
					String artworkFileState = BusinessUtil.getInfo(context, artworkFile.getObjectId(context), DomainConstants.SELECT_CURRENT);
					
					// If Artwork File is in Preliminary State
					// Send notification to the POA owners
					if(AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.ARTWORK_FILE, artworkFileState)) {
						Map poaMap = BusinessUtil.getInfo(context, poa.getObjectId(context), BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
						String poaName = BusinessUtil.getString(poaMap, SELECT_NAME);
						String poaRev = BusinessUtil.getString(poaMap, SELECT_REVISION);
						
						String subjectKeys[] = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
						String subjectKeyValues[] = new String[]{poaName, poaRev, templateName, templateRev};
						String messageKeys[] = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
						String messageKeyValues[] = new String[]{poaName, poaRev, templateName, templateRev};
						
						String subjectKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateRevise.POAInRelease.ArtworkFileInPreliminary.Subject", subjectKeys, subjectKeyValues);
						String messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateRevise.POAInRelease.ArtworkFileInPreliminary.Message", messageKeys, messageKeyValues);

						// Sending notification to the Designer.
						sendNotification(context, poa.getOwner(context).getName(), subjectKey, messageKey);
					}
										
					// If Artwork File is in Review State.
					// Demote the Artwork File from Review to Preliminary State.
					// Send notification to the Artwork File Owner and POA owner by trigger. 
					if(AWLState.REVIEW.equalsObjectState(context, AWLPolicy.ARTWORK_FILE, artworkFileState)) {
						artworkFile.demote(context);
					}

					// If Artwork File is in Release State.
					// Revise the Artwork File and connects to the POA
					// Send notification to the POA Owner
					if(AWLState.RELEASE.equalsObjectState(context, AWLPolicy.ARTWORK_FILE, artworkFileState)) {
						artworkFile.reviseObject(context, false);
						String reviseArgs[] = {"emxAWL.ArtworkTemplateRevise.ArtworkFileRevise.Subject",
								               "emxAWL.ArtworkTemplateRevise.ArtworkFileRevise.Message"} ;
						new AWLArtworkFileBase_mxJPO(context, new String[]{artworkFile.getObjectId(context)}).
						notifyPOAOwnerAboutArtworkFileReviseOnArtworkTemplateRevise(context, reviseArgs);
						
					}	
				}
			}
			
			ContextUtil.commitTransaction(context);
			
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			throw new FrameworkException(e);
		}
		
	}
	
	/**	  
	 * Disconnecting/ Deletion of Artwork Template notifies the POA owners.
	 * a) Artwork Template is connected to the Artwork In Process POA
	 * b) Artwork Template owner and POA owner is different.
	 * @param   context - the Enovia <code>Context</code> object
	 * @param   args    -  Array of Arguments. 
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Subbarao G (SY6)
	 */	
	public void artworkTemplateDisconnectDeleteNotification(Context context, String[] args) throws FrameworkException {	
		if(args.length == 0)
			throw new IllegalArgumentException();
		
		sendNotificationToPOAOwners(context, args);
		sendNotificationToPOADesigners(context, args);
	}

	
	private void sendNotificationToPOAOwners (Context context, String[] args)  throws FrameworkException {
		try {
			String templateId = args[0];
			String productId = args[1];
			
			ArtworkTemplate template = new ArtworkTemplate(templateId);

			String current = DomainConstants.SELECT_CURRENT;
			String DRAFT = AWLState.DRAFT.get(context, AWLPolicy.POA);
			String PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.POA);
			String ARTWORK_IN_PROCESS = AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA);
			String whereExpr = AWLUtil.strcat(current, "==\'", DRAFT,"\'", " || " ,current, "==\'", PRELIMINARY, "\'", " || ", current, "==\'", ARTWORK_IN_PROCESS, "\'");
			
			StringList selectables = BusinessUtil.toStringList(DomainConstants.SELECT_OWNER, DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION);
			
			MapList poaList = template.related(AWLType.POA, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE).from().id().relid().sel(selectables).where(whereExpr).query(context);

			if(BusinessUtil.isNullOrEmpty(poaList))
				return;

			Map templateMap = BusinessUtil.getInfo(context, templateId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION, DomainConstants.SELECT_OWNER));
			String templateName = BusinessUtil.getString(templateMap, SELECT_NAME);
			String templateRev = BusinessUtil.getString(templateMap, SELECT_REVISION);
			String templateOwner = BusinessUtil.getString(templateMap, SELECT_OWNER);
			
			StringList poaOwnerList = BusinessUtil.toUniqueList(BusinessUtil.toStringList(poaList, DomainConstants.SELECT_OWNER));
			poaOwnerList.remove(templateOwner);

			
			for (String poaOwner : (List<String>)poaOwnerList) {
				StringList poaNameRevList = new StringList(poaList.size());
				for (Iterator iterator = poaList.iterator(); iterator .hasNext();) {
					Map poaMap = (Map) iterator.next();
					String poaName = BusinessUtil.getString(poaMap, DomainConstants.SELECT_NAME);
					String poaRev = BusinessUtil.getString(poaMap, DomainConstants.SELECT_REVISION);

					String owner = BusinessUtil.getString(poaMap, DomainConstants.SELECT_OWNER);
					if(templateOwner.equalsIgnoreCase(owner) || !poaOwner.equalsIgnoreCase(owner))
						continue;

					String poaString = AWLUtil.strcat(poaName, " ", poaRev);
					poaNameRevList.add(poaString);
				}
				
				String subjectKeys[] = new String[]{TEMPLATE_NAME, TEMPLATE_REV};
				String subjectKeyValues[] = new String[]{templateName, templateRev};
				String subjectKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDisconnectDelete.POAOwnerorDesigner.Subject", subjectKeys, subjectKeyValues);
				
				String messageKeys[] = new String[]{};
				String messageKeyValues[] = new String[]{};
				String messageKey = "";
				
				// If it is diconnect
				if(BusinessUtil.isNotNullOrEmpty(productId)) {					
					Map productMap = BusinessUtil.getInfo(context, productId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
					String productName = BusinessUtil.getString(productMap, SELECT_NAME);
					String productRev = BusinessUtil.getString(productMap, SELECT_REVISION);
					
					messageKeys = new String[]{TEMPLATE_NAME, TEMPLATE_REV, "productName", "productRev", POA_INFO};
					messageKeyValues = new String[]{templateName, templateRev, productName, productRev, FrameworkUtil.join(poaNameRevList, ",")};
					
					messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDisconnect.POAOwner.Message", messageKeys, messageKeyValues);					
				} else {
					messageKeys = new String[]{TEMPLATE_NAME, TEMPLATE_REV, POA_INFO};
					messageKeyValues = new String[]{templateName, templateRev, FrameworkUtil.join(poaNameRevList, ",")};

					messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDelete.POAOwner.Message", messageKeys, messageKeyValues);
				}

				// Sending notification to the Designer.
				sendNotification(context, poaOwner, subjectKey, messageKey);
			}
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	private void sendNotificationToPOADesigners (Context context , String[] args)  throws FrameworkException {
		try {
			String templateId = args[0];
			String productId = args[1];
			
			ArtworkTemplate template = new ArtworkTemplate(templateId);

			String whereExpr = AWLUtil.strcat(DomainConstants.SELECT_CURRENT, "==\'", AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA), "\'");		
			
			StringList selectables = BusinessUtil.toStringList(DomainConstants.SELECT_OWNER, DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION);
			
			MapList poaList = template.related(AWLType.POA, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE).from().id().relid().sel(selectables).where(whereExpr).query(context);

			if(BusinessUtil.isNullOrEmpty(poaList))
				return;

			StringList designerList = new StringList(poaList.size());
			for (Iterator iterator = poaList.iterator(); iterator.hasNext();) {
				Map poaMap = (Map) iterator.next();
				String poaId = BusinessUtil.getString(poaMap, DomainConstants.SELECT_ID);
				String designerRoute  = RouteUtil.getConnectedRoute(context, poaId, RouteUtil.getArtworkAction(context, poaId, true));
				String designerTaskOwner = "";
				if(BusinessUtil.isNotNullOrEmpty(designerRoute)) {
					designerTaskOwner = BusinessUtil.getInfo(context, designerRoute, AWLUtil.strcat(FROM_OPEN, AWLRel.ROUTE_NODE.get(context), "].to.owner"));
					designerList.add(designerTaskOwner);
				}
				poaMap.put("designer", designerTaskOwner);
			}
			
			designerList = BusinessUtil.toUniqueList(designerList);
			if(BusinessUtil.isNullOrEmpty(designerList))
				return;
			
			Map templateMap = BusinessUtil.getInfo(context, templateId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION, DomainConstants.SELECT_OWNER));
			String templateName = BusinessUtil.getString(templateMap, SELECT_NAME);
			String templateRev = BusinessUtil.getString(templateMap, SELECT_REVISION);
			
			for (String designer : (List<String>)designerList) {		
				StringList poaNameRevList = new StringList(poaList.size());
				for (Iterator iterator = poaList.iterator(); iterator .hasNext();) {
					Map poaMap = (Map) iterator.next();
					String poaName = BusinessUtil.getString(poaMap, DomainConstants.SELECT_NAME);
					String poaRev = BusinessUtil.getString(poaMap, DomainConstants.SELECT_REVISION);

					String owner = BusinessUtil.getString(poaMap, "designer");
					if(!designer.equalsIgnoreCase(owner))
						continue;

					String poaString = AWLUtil.strcat(poaName, " ", poaRev);
					poaNameRevList.add(poaString);
				}
				

				String subjectKeys[] = new String[]{TEMPLATE_NAME, TEMPLATE_REV};
				String subjectKeyValues[] = new String[]{templateName, templateRev};
				String subjectKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDisconnectDelete.POAOwnerorDesigner.Subject", subjectKeys, subjectKeyValues);
				
				String messageKeys[] = new String[]{};
				String messageKeyValues[] = new String[]{};
				String messageKey = "";
				
				// If it is diconnect
				if(BusinessUtil.isNotNullOrEmpty(productId)) {					
					Map productMap = BusinessUtil.getInfo(context, productId, BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
					String productName = BusinessUtil.getString(productMap, SELECT_NAME);
					String productRev = BusinessUtil.getString(productMap, SELECT_REVISION);
					
					messageKeys = new String[]{TEMPLATE_NAME, TEMPLATE_REV, "productName", "productRev", POA_INFO};
					messageKeyValues = new String[]{templateName, templateRev, productName, productRev, FrameworkUtil.join(poaNameRevList, ",")};
					
					messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDisconnect.Designer.Message", messageKeys, messageKeyValues);					
				} else {
					messageKeys = new String[]{TEMPLATE_NAME, TEMPLATE_REV, POA_INFO};
					messageKeyValues = new String[]{templateName, templateRev, FrameworkUtil.join(poaNameRevList, ",")};

					messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateDelete.Designer.Message", messageKeys, messageKeyValues);
				}

				// Sending notification to the Designer.
				sendNotification(context, designer, subjectKey, messageKey);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
	}
}
