/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/


import matrix.db.Context;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;



/**
 * @deprecated Since R2016x with POA Simplification highlight
 */
public class AWLFPMasterBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	//private static final long serialVersionUID = 2971749963629264204L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLFPMasterBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllFPMastersFromProductLine(Context context, String[] args) throws FrameworkException {
		/*try {
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			String strObjectId = (String)programMap.get(AWLConstants.OBJECT_ID);
			String strFilterCountryIds = (String) programMap.get(AWLConstants.COUNTRY_IDS);

			Brand brand = new Brand(strObjectId);
			return brand.getFPMastersMapList(context, strFilterCountryIds);
		} catch(Exception e) { throw new FrameworkException(e); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public static int promoteActionForFPMaster(Context context, String[] args) throws FrameworkException {
		/*int status = 0;
		if (args.length == 0)
			throw new IllegalArgumentException();
		try {
			String fpMasterId = args[0];
			FPMaster fpMasterObj=new FPMaster(fpMasterId);
			DomainObject dobPrevRevision = new DomainObject(fpMasterObj.getPreviousRevision(context));
			String previousRevID = dobPrevRevision.getObjectId();
			if (previousRevID != null && !"".equals(previousRevID)) {
				FPMaster FPMasterObjPrevrev= new FPMaster(previousRevID);
				FPMasterObjPrevrev.setState(context, AWLState.OBSOLETE.get(context, AWLPolicy.FP_MASTER));
			}
		} catch (Exception e) {
			status = 1;
			e.printStackTrace();
			throw new FrameworkException(e);
		}
		return status;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
		
	public static int promoteCheckForFPMaster(Context context, String[] args) throws FrameworkException {
		/*try {
			if (args.length == 0)
				throw new IllegalArgumentException();

			String fpMasterId = args[0];		
			FPMaster fpMasterObj = new FPMaster(fpMasterId);
			String[] poaStates = {AWLState.PRELIMINARY.get(context, AWLPolicy.POA), 
					              AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA), 
					              AWLState.REVIEW.get(context, AWLPolicy.POA)};
			MapList poaList = fpMasterObj.getPOAs(context, poaStates);
			if (!poaList.isEmpty()) {   	
				throw new FrameworkException("emxAWL.Message.fpMasterCheckForPOA");			
			}		
		} catch(Exception e) { throw new FrameworkException(e); }
		return 0;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Obsolete the parent of the cloned FP Master
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @since 2013x
	 * @author B1R
	 * @throws Exception 
	 */
	public void obsoleteParentOfClonedFPMaster (Context context, String[] args) throws FrameworkException {
		/*String strObjectID	= args[0];
		try {
			ContextUtil.startTransaction(context, true);
			// Get associated product for the given FP Master
			FPMaster fpMaster = new FPMaster(strObjectID);
			CPGProduct product = fpMaster.getProduct(context);			
			// Get country list of the given FP Master
			StringList clonedFPMasterCountryList =  BusinessUtil.toStringList(fpMaster.getCountriesMapList(context), DomainConstants.SELECT_ID);
			// Get the previous revision of the Product
			DomainObject dobPrevRevision = new DomainObject(product.getPreviousRevision(context));
			CPGProduct prevRevProduct = new CPGProduct(dobPrevRevision.getObjectId());
			String prevProdID = prevRevProduct.getObjectId();
			if (BusinessUtil.isNotNullOrEmpty(prevProdID)) {
				// Get the similar FP Masters from the previous revision
				List<FPMaster> similarFPMasters = prevRevProduct.getSimilarFPMaster(context, clonedFPMasterCountryList);				
				for (FPMaster prevFPMaster : similarFPMasters) {
					// Promote the FP Master to Obsolete					
					prevFPMaster.setState(context, AWLState.OBSOLETE.get(context, AWLPolicy.FP_MASTER));
				}
			}
			ContextUtil.commitTransaction(context);
		}
		catch (Exception ex) {
			ContextUtil.abortTransaction(context);
			throw new FrameworkException("emxAWL.Message.fpMasterCheckForPOA");
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Method to replicate the Selective Translations on promoting to Active / clone of FP Master
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void replicateSelectiveTranslations (Context context, String[] args) throws FrameworkException
	{
		/**
		 * Get the languages related to current FP Master along with the MCL Artwork rel ids
		 * Get the languages related to the new FP Master along with the FP Master Language rel id
		 * Iterate the current language list and get the MCL Artwork relids list for the current language iteration
		 * Get the language map from the new FP Master language list.
		 * Connect the new FP Master Language rel ids to the MCL Artwork relationship list.
		 */
		/*try {
			String strObjectId = args[0];
			String strType = args[1];
			String strEvent = args[2];
			String copyName = "";
			String copyRev = "";
			FPMaster newFPMaster = null;
			
			FPMaster fpMaster = null;
			// If the event is Copy, get the latest copy id and instantiate the FP Master
			if(AWLConstants.COPY.equals(strEvent)) {
				copyName = args[3];
				copyRev = args[4];
				BusinessObject boCopy = new BusinessObject(strType, copyName, copyRev,
						PropertyUtil.getSchemaProperty(context, ""));
				newFPMaster = new FPMaster(boCopy);
				fpMaster = new FPMaster (strObjectId);
			} else {
				// else get the previous revision id
				String strPreviousRevisionID = BusinessUtil.getInfo(context, strObjectId, AWLConstants.PREVIOUS_ID);
				if (BusinessUtil.isNullOrEmpty(strPreviousRevisionID))
					return;
				fpMaster = new FPMaster(strPreviousRevisionID);
				newFPMaster = new FPMaster (strObjectId);
			}
			StringList objectSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME);
			
			String strSkipTranslationRelSelectable = AWLUtil.strcat("tomid[", AWLRel.SKIP_TRANSLATION.get(context), "].fromrel.id");
			StringList relationshipSelects = BusinessUtil.toStringList(SELECT_RELATIONSHIP_ID,
					strSkipTranslationRelSelectable);

			*//**
			 * Get all the languages related to the current FP master
			 * get the Skip Translations data (MCL Artwork relationship id) that are available on the
			 * FP Master Language relationship
			 *//*
			MapList fpMasterLanguages = fpMaster.related(AWLType.LOCAL_LANGUAGE, AWLRel.FP_MASTER_LANGUAGE)
										.sel(objectSelects).relSe(relationshipSelects).query(context);

			
			// Get the languages that are related to the new FP Master along with the relationship ids
			MapList revisedFPMasterLanguages = newFPMaster.related(AWLType.LOCAL_LANGUAGE, AWLRel.FP_MASTER_LANGUAGE)
										.sel(objectSelects).relSe(relationshipSelects).query(context);

			ContextUtil.startTransaction(context, true);
			// Iterate through the current list
			for (Map fpMasterLanguage : (List<Map>)fpMasterLanguages) {
				// Get the MCL Artwork relationship ids from the current list
				StringList mclArtworkList = BusinessUtil.getStringList(fpMasterLanguage,strSkipTranslationRelSelectable);
				if (BusinessUtil.isNullOrEmpty(mclArtworkList))
					continue;
				// If the MCL Artwork relationship list is not empty, get the Map from the new list which is of the same language
				Map revisedFPMasterLanguage = BusinessUtil.getMapWithValue(revisedFPMasterLanguages, SELECT_NAME,
						BusinessUtil.getString(fpMasterLanguage, SELECT_NAME));
				// From the Map, get the FP Master language relationship ID
				String fpMasterLanguageRelID = BusinessUtil.getString(revisedFPMasterLanguage, SELECT_RELATIONSHIP_ID);
				// Iterate through the MCL Artwork relationship list and connect to the FP Master Language relationship
				for (String mclArtwork : (List<String>) mclArtworkList) {
					MqlUtil.mqlCommand(context, "add connection $1 fromrel $2 torel $3", 
							AWLRel.SKIP_TRANSLATION.get(context), mclArtwork, fpMasterLanguageRelID);
				}
			}
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	/**
	 * Method to remove the Selective Translations data on FP Master Obsolete
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void removeSelectiveTranslations (Context context, String[] args) throws FrameworkException
	{
		/*try {
			String strObjectId = args[0];
			StringList relIdsToDisconnect = new StringList();
			StringList objectSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME);
			String strSelectiveTranslationRelSelectable = AWLUtil.strcat("tomid[", AWLRel.SKIP_TRANSLATION.get(context), "].id");
			StringList relationshipSelects = BusinessUtil.toStringList(SELECT_RELATIONSHIP_ID,
					strSelectiveTranslationRelSelectable);
			FPMaster fpMaster = new FPMaster(strObjectId);
			MapList fpMasterLanguages = fpMaster.related(AWLType.LOCAL_LANGUAGE, AWLRel.FP_MASTER_LANGUAGE)
			.sel(objectSelects).relSe(relationshipSelects).query(context);
			for (Map fpMasterLanguage : (List<Map>)fpMasterLanguages) {
				StringList selectiveTranslationRelIDs = BusinessUtil.getStringList(fpMasterLanguage,strSelectiveTranslationRelSelectable);
				if (BusinessUtil.isNullOrEmpty(selectiveTranslationRelIDs))
					continue;
				relIdsToDisconnect.addAll(selectiveTranslationRelIDs);
			}
			ContextUtil.startTransaction(context, true);
			DomainRelationship.disconnect(context, BusinessUtil.toStringArray(relIdsToDisconnect));
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
}
