/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.util.Map;

import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

import matrix.db.Context;
import matrix.util.StringList;

/**
 * @deprecated Since R2016x with POA Simplification highlight
 */

@SuppressWarnings({"deprecation", "PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods"})
public class AWLPromotionUIBase_mxJPO extends AWLObject_mxJPO
{
	//private static final String OBJECT_ID = "objectId";
	/**
	 * 
	 */
	//private static final long serialVersionUID = -2090882961755551641L;

	public AWLPromotionUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPromotionalArworkElemetsStructure(Context context, String[] args) throws FrameworkException {		
		
		/*String strObjWhere = DomainObject.EMPTY_STRING;
	
		try {	
			HashMap<String, String> programMap = (HashMap)JPO.unpackArgs(args);			
			String strObjectid = programMap.get(OBJECT_ID);
			DomainObject domObject = new DomainObject(strObjectid);			
			
			MapList artworkElemetns = new MapList();
			if(BusinessUtil.isKindOf(context, strObjectid, AWLType.PROMOTIONAL_OPTION.get(context))){
				StringList objSelects = new StringList();
				objSelects.addElement(DomainObject.SELECT_TYPE);
				objSelects.addElement(DomainObject.SELECT_NAME);
				objSelects.addElement(DomainObject.SELECT_ID);
				objSelects.addElement(DomainConstants.SELECT_REVISION);
				String selectDisplayName = AWLAttribute.MARKETING_NAME.getSel(context);
				String selectMarketingName = AWLAttribute.MARKETING_NAME.getSel(context);
				objSelects.addElement(selectDisplayName);			
				objSelects.addElement(selectMarketingName);
				//objSelects.addElement("physicalid");
				
				StringList relSelects = new StringList();
				relSelects.addElement(DomainRelationship.SELECT_ID);
				relSelects.addElement(DomainConstants.SELECT_FROM_NAME);			
				strObjWhere = AWLUtil.strcat(AWLAttribute.IS_PROMOTIONAL_ARTWORK.getSel(context), " == TRUE");		
				
				artworkElemetns = domObject.getRelatedObjects(context, AWLRel.PROMOTIONAL_ARTWORK_ELEMENT.get(context), "*", 
										  objSelects, relSelects, false, true, (short)1,strObjWhere,  null,(short)0);
			}else if(BusinessUtil.isKindOf(context, strObjectid, AWLType.MASTER_COPY_ELEMENT.get(context))) {
				ArtworkMaster am =  new ArtworkMaster(strObjectid);
				if(am.isTranslationElement(context)) {
					String objWhere	 = AWLUtil.strcat("(attribute[" , AWLAttribute.IS_BASE_COPY.get(context) , "] smatch const " , "\"" , AWLConstants.RANGE_NO , "\")");
					artworkElemetns = am.getCopyByArtworkMaster(context, new StringList(SELECT_ID), objWhere);
				}
			}
			
			return artworkElemetns;
			
		} catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**@author B1R
	 * Method call to get all Active Associated FPMasters to the Promotion.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - MapList containing the id of all FPMasters details
	 * @throws Exception if operation fails
	 * @since ProductCentral 10.0.0.0
	 * @grade 0
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllActiveAssociatedFPMasters (Context context, String[] args) throws FrameworkException
	{
		/*try {
			Map<String, String> programMap = (Map)JPO.unpackArgs(args);
			String strObjectid = programMap.get(OBJECT_ID);
			DomainObject doObj = DomainObject.newInstance(context, strObjectid);				
			StringList objectSelectables = new StringList();
			objectSelectables.add(DomainConstants.SELECT_ID);
			String strObjWhere = AWLUtil.strcat(DomainConstants.SELECT_CURRENT, " == active");
			MapList mlFPMasterList = doObj.getRelatedObjects(context,
					AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context),
					AWLType.FP_MASTER.get(context),
					objectSelectables, new StringList(), true, false, (short)1, strObjWhere, null, (short)0);

			return mlFPMasterList;
		} catch (Exception e) { throw new FrameworkException(e.getMessage()); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
		
	/**@author B1R
	 * Method call to get all the Associated FPMasters to the Promotion.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - MapList containing the id of all FPMasters details
	 * @throws Exception if operation fails
	 * @since ProductCentral 10.0.0.0
	 * @grade 0
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllAssociatedFPMasters (Context context, String[] args) throws FrameworkException
	{
		/*try {
			Map<String, String> programMap = (Map)JPO.unpackArgs(args);
			String strObjectid = programMap.get(OBJECT_ID);
			DomainObject doObj = DomainObject.newInstance(context, strObjectid);

			StringList objectSelectables = new StringList();
			objectSelectables.add(DomainConstants.SELECT_ID);			

			MapList mlFPMasterList = doObj.getRelatedObjects(context,
					AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context),
					AWLType.FP_MASTER.get(context),
					objectSelectables, new StringList(), true, false, (short)1, null, null, (short)0);	

			return mlFPMasterList;

		} catch (Exception e) { throw new FrameworkException(e.getMessage()); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
			
	/**@author B1R
	 * Method call to get all the Associated Artwork Elements to the Promotion.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - StringList containing the id of all excluded Master Copy Elements
	 * @throws Exception if operation fails
	 * @grade 0
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAvailableCopyElements(Context context, String [] args) throws FrameworkException
	{
		/*try {
			Map<String, String> programMap = (Map) JPO.unpackArgs(args);
			String promotionId = programMap.get(OBJECT_ID);					
			Promotion promotionObj = new Promotion(promotionId);					
			return promotionObj.getMasterCopyElements(context);
		}catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
			
	/**@author B1R
	 * Method call to get all the Associated Artwork Elements to the Promotion.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - StringList containing the id of all excluded Graphic documents
	 * @throws Exception if operation fails
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAvailableGraphicsElements(Context context, String [] args) throws FrameworkException
	{
		/*try {
			Map<String, String> programMap = (Map) JPO.unpackArgs(args);
			String promotionId = programMap.get(OBJECT_ID);					
			Promotion promotionObj = new Promotion(promotionId);
			return promotionObj.getGraphicsDocumentIds(context);
		}catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
			
	public int updateDisplayName(Context context, String[] args) throws Exception
	{
		/*Map programMap = (Map) JPO.unpackArgs(args);
		Map paramMap = (Map) programMap.get("paramMap");
		String objectId = (String) paramMap.get(OBJECT_ID);
		String strNewMarketingName = (String) paramMap.get("New Value");
		Promotion PromObj = new Promotion(objectId);
		try
		{
			PromObj.setAttributeValue(context,AWLAttribute.MARKETING_NAME,strNewMarketingName);
		}
		catch(Exception e)
		{
			String[] messageValues = new String[1];
			messageValues[0] = context.getUser( );
			String ErrorMsgForNoAccess =  MessageUtil.getMessage(context,null,"emxAWL.Message.ErrorMsgForDisplayNameModifyAccess",messageValues,null,context.getLocale(),"emxAWLStringResource");
			//${CLASS:emxContextUtilBase}.mqlNotice(context,ErrorMsgForNoAccess);
			MqlUtil.mqlCommand(context, "notice $1", ErrorMsgForNoAccess);
			return 1;
		}
		*/
		throw new Exception("API Usage Error: API is not supported in V6R2017x");
	}
	
	@com.matrixone.apps.framework.ui.RowJPOCallable
	public MapList getPromotionAssignmentMatrixElements(Context context,String args[]) throws FrameworkException
	{
		/*MapList returnList = new MapList();

		try
		{
			Map programMap = JPO.unpackArgs(args);
			Map requestMap = BusinessUtil.getRequestMap(programMap);			

			String artworkIds = (String)requestMap.get("artworkArr");
			String mclIds = (String)requestMap.get("mclArr");
			
			StringList mclAllIdsList = FrameworkUtil.split(mclIds, ",");
			StringList artworkIdsList = FrameworkUtil.split(artworkIds, ",");

			for(String artworkId : (List<String>)artworkIdsList)
			{
				Map mclRowMap = new HashMap();
				mclRowMap.put(UITableGrid.KEY_ROW_ID, artworkId);
				mclRowMap.put(DomainObject.SELECT_LEVEL, "1");

				ArtworkMaster am = new ArtworkMaster(artworkId);
				StringList mclList = am.getMCLList(context);

				StringList rowCellValueList = new StringList();

				for(String mclId : (List<String>)mclAllIdsList)
				{
					boolean artworkHasMCL = mclList.contains(mclId);
					rowCellValueList.add(artworkHasMCL ? 
							AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Include") : 
						    AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Exclude"));
				}

				mclRowMap.put(UITableGrid.KEY_CELL_ID, mclAllIdsList);
				mclRowMap.put(UITableGrid.KEY_CELL_VALUE, rowCellValueList);
				returnList.add(mclRowMap);
			}
		} catch(Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
		return returnList;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	@com.matrixone.apps.framework.ui.ColJPOCallable
	public MapList getPromotionAssignmentMatrixMCLs(Context context, String args[]) throws FrameworkException
	{
		/*MapList returnList = new MapList();
		try{
			Map programMap = JPO.unpackArgs(args);
			Map requestMap = BusinessUtil.getRequestMap(programMap);			

			String mclIds = (String)requestMap.get("mclArr");			
			StringList mclIdsList = FrameworkUtil.split(mclIds, ",");

			String SEL_MARKETING_NAME = AWLAttribute.MARKETING_NAME.getSel(context);
			String SEL_PROD_ID = AWLUtil.strcat("to[", AWLRel.PRODUCT_COPY_LIST.get(context), "].from.id");
			String SEL_MCL_NAME = AWLAttribute.MCL_NAME.getSel(context);
			
			StringList prodSelects = BusinessUtil.toStringList(SEL_MARKETING_NAME, SELECT_REVISION, SELECT_ID);
			StringList mclSelects = BusinessUtil.toStringList(SEL_MCL_NAME, SELECT_ID,	SEL_PROD_ID);
			
			MapList mclInfo = BusinessUtil.getInfo(context, mclIdsList, mclSelects);
			
			StringList prodIDs = BusinessUtil.toStringList(mclInfo, SEL_PROD_ID);
			prodIDs = BusinessUtil.toUniqueList(prodIDs);
			MapList	prodInfo = BusinessUtil.getInfo(context, prodIDs, prodSelects);
			for (Map prod : (List<Map>)prodInfo) {
				prod.put(UITableGrid.KEY_COL_GROUP_VALUE, AWLUtil.strcat(prod.get(SEL_MARKETING_NAME), " ", prod.get(SELECT_REVISION)));
			}
			
			for (Map mcl : (List<Map>)mclInfo) {
				Map mclRowMap = new HashMap();
				
				String prodID = (String) mcl.get(SEL_PROD_ID);
				Map prodMap = BusinessUtil.getMapWithValue(prodInfo, SELECT_ID, prodID);
				
				mclRowMap.put(UITableGrid.KEY_COL_ID, mcl.get(SELECT_ID));
				mclRowMap.put(UITableGrid.KEY_COL_VALUE, mcl.get(SEL_MCL_NAME));
				mclRowMap.put(UITableGrid.KEY_COL_GROUP_VALUE, prodMap.get(UITableGrid.KEY_COL_GROUP_VALUE));
				returnList.add(mclRowMap);
			}
			return returnList;
		}
		catch(Exception e)	{ 
			e.printStackTrace();
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	@com.matrixone.apps.framework.ui.CellRangeJPOCallable
	public Map getPromotionAssignmentMatrixRangeValues(Context context, String[] args) throws FrameworkException
	{
		/*try {
			Map rangeMap = new HashMap();
			StringList fieldChoices = new StringList(2);
			fieldChoices.add("Include");
			fieldChoices.add("Exclude");
			
			StringList fieldDispayChoices = new StringList(2);
			fieldDispayChoices.add(AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Include"));
			fieldDispayChoices.add(AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Exclude"));
			//TODO : Grid Browser always comparing values with lables 
			rangeMap.put(AWLConstants.RANGE_FIELD_CHOICES, fieldDispayChoices);
			rangeMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, fieldDispayChoices);
			return rangeMap;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	@com.matrixone.apps.framework.ui.CellUpdateJPOCallable
	public Map updatePromotionAssignmentMatrixSelection(Context context, String[] args) throws Exception
	{
		/*Map programMap = (HashMap) JPO.unpackArgs(args);

		Map paramMap = (HashMap) programMap.get("paramMap");
		String objectId = (String) paramMap.get("objectId");
		String newValue = (String) paramMap.get("New Value");

		String colId = (String) programMap.get("colId");      
		MasterCopyList mcl = new MasterCopyList(colId);
		
		StringList toAddList= new StringList();
		StringList toDeleteList= new StringList();

		if (AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Include").equals(newValue)){
			toAddList.addElement(objectId);
		}
		else if (AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Exclude").equals(newValue)){
			toDeleteList.addElement(objectId);
		}

		mcl.addRemoveArtworkElements(context, toAddList, toDeleteList);	*/
		throw new Exception("API Usage Error: API is not supported in V6R2017x");	
}
}
