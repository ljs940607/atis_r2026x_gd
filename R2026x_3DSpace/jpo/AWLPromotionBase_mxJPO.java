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

import matrix.db.Context;
import matrix.util.StringList;

/**
 * @deprecated Since R2016x with POA Simplification highlight
 */
public class AWLPromotionBase_mxJPO extends AWLObject_mxJPO
{
	//private static final String FROM_OPEN = "from[";
	/**
	 * 
	 */
	//private static final long serialVersionUID = 7933247132493334407L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLPromotionBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map<String, String> createPromotionalOption(Context context, String[] args)throws FrameworkException {
		/*try{
		HashMap<String, String> programMap = (HashMap)JPO.unpackArgs(args);
		String name = programMap.get("Name");
		return Promotion.create(context, name, EMPTY_STRING);
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * This will be invoked when we connect promotion to Product
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void connectPromotionalArtworkToProduct(Context context,String[] args)throws FrameworkException
	{
		/*try{
			String fpMasterId 			 = args[0]; 		
	 		String promotionId   	 = args[1];
	 		FPMaster fpMasterObj = new FPMaster(fpMasterId);
	 		CPGProduct productObj = fpMasterObj.getProduct(context); 		
	 		StringList aeStringList = new StringList();
	 		Promotion promotionObj = new Promotion(promotionId);
			List<ArtworkMaster> aeList = promotionObj.getArtworkElements(context);
			Iterator<ArtworkMaster> aeIt = aeList.iterator();
			while(aeIt.hasNext()){
				aeStringList.add(aeIt.next().getInfo(context, DomainConstants.SELECT_ID));
			}
	 		connectPromotionalArtworkToProducts(context, aeStringList, new StringList(productObj.getInfo(context, DomainConstants.SELECT_ID)));
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * This will be invoked when we add an Artwork Element to Promotion
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void associatePromotionalArtworkToProduct(Context context ,String[] args)throws FrameworkException
	{
		/*try{
			String promotionId  	= args[0];
	 		String strPromoArtwork 	= args[1];
	 		Promotion promotionObj = new Promotion(promotionId);
	 		StringList slProductsList = BusinessUtil.toStringList(promotionObj.getProducts(context), DomainConstants.SELECT_ID);
	 		connectPromotionalArtworkToProducts(context, new StringList(strPromoArtwork), slProductsList);	
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/*private void  connectPromotionalArtworkToProducts(Context context, StringList slAEList, StringList products) throws FrameworkException {
		try {
			if(BusinessUtil.isNullOrEmpty(slAEList) || BusinessUtil.isNullOrEmpty(products))
				return;
			
			DomainObject productDO = new DomainObject();
			for (Object product : products) {
				productDO.setId((String) product);			
				
				StringList objSelects = new StringList(AWLUtil.strcat(FROM_OPEN, AWLRel.ARTWORK_MASTER.get(context), "].to.id"));
				objSelects.addElement(AWLUtil.strcat(FROM_OPEN, AWLRel.ARTWORK_MASTER.get(context), "].id"));
				Map hMap  = BusinessUtil.getInfoList(context, (String) product, objSelects);
				
				StringList aeConnectedToProduct = (StringList) hMap.get(AWLUtil.strcat(FROM_OPEN, AWLRel.ARTWORK_MASTER.get(context), "].to.id"));
				StringList promotionAEs = (StringList) slAEList.clone();
				StringList slConnectedList = new StringList();
				
				
				if(BusinessUtil.isNotNullOrEmpty(aeConnectedToProduct)){					
					slConnectedList.addAll(promotionAEs);
					slConnectedList.retainAll(aeConnectedToProduct);
				}
				
				if(BusinessUtil.isNotNullOrEmpty(aeConnectedToProduct)){
					promotionAEs.removeAll(aeConnectedToProduct);
				}
				
				String[] aeIds = (String[]) promotionAEs.toArray(new String[] {});
				
				Map logicalFeatureRels = DomainRelationship.connect(context, productDO, AWLRel.ARTWORK_MASTER.get(context), true, aeIds);
				for (Iterator iterator = logicalFeatureRels.values().iterator(); iterator.hasNext();) {
					String relId = (String) iterator.next();
					DomainRelationship.setAttributeValue(context, relId, AWLAttribute.PLACE_OF_ORIGIN.get(context), "Yes");
				}
			}
		} catch (Exception e) { throw new FrameworkException(e);}
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}*/
	
	public void disconnectPromotionalArtworkFromProduct(Context context,String[] args)throws FrameworkException
	{
		/*try{
 		String strPromoArtwork 	= args[1];
 		String strLFRel = AWLUtil.strcat("to[", AWLRel.ARTWORK_MASTER.get(context), "].id");
 		StringList slRelIds = BusinessUtil.getInfoList(context, strPromoArtwork, strLFRel);
 		DomainRelationship.disconnect(context, BusinessUtil.toStringArray(slRelIds)); 		
		}catch(Exception e ){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public int checkForArtworkElementsToPromotionalOption(Context context,String[] args)throws FrameworkException
	{
		/*String strPromoOptionID = args[0];
		StringList slArtworkEleemnts = BusinessUtil.getInfoList(context, strPromoOptionID, AWLUtil.strcat(FROM_OPEN, AWLRel.PROMOTIONAL_ARTWORK_ELEMENT.get(context), "].to.id"));
		if(BusinessUtil.isNullOrEmpty(slArtworkEleemnts))
		{
			String strAlert = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NoPromotionalArtworkElements");
			throw new FrameworkException(strAlert);			
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public int checkPromotionalArtworkAssociateToPV(Context context,String[] args)throws FrameworkException
	{	
		/*try{
			String promotionId = args[0];
	 		StringList aeStringList = new StringList();
	 		Promotion promotionObj = new Promotion(promotionId);
			List<ArtworkMaster> aeList = promotionObj.getArtworkElements(context);
			Iterator<ArtworkMaster> aeIt = aeList.iterator();
			while(aeIt.hasNext()){
				aeStringList.add(aeIt.next().getInfo(context, DomainConstants.SELECT_ID));
			}
			
	 		StringList slProductsList = BusinessUtil.toStringList(promotionObj.getProducts(context), DomainConstants.SELECT_ID);
			
			StringList slResultsList = new StringList();	

			for(int i=0; i < slProductsList.size(); i++)
			{
				String strProduct = (String) slProductsList.get(i);
				CPGProduct product = new CPGProduct(strProduct);
				List<MasterCopyList> slPVList = product.getMCLs(context);
				boolean flag = false;

				for(int j=0; !flag && j < slPVList.size(); j++)
				{
					MasterCopyList mclObject = slPVList.get(j);				
					StringList slPVArtwork = BusinessUtil.toStringList(mclObject.getArtworkElements(context), DomainConstants.SELECT_ID);
					
					for(int k=0; !flag && k < slPVArtwork.size() ;k++)
					{
						flag = aeStringList.contains(slPVArtwork.get(k)); 
					}
				}
				
						
				if(!flag)				
					slResultsList.add(strProduct);			
			}
			
			if(BusinessUtil.isNotNullOrEmpty(slResultsList))
			{
				MapList  mList = BusinessUtil.getInfoList(context, slResultsList, AWLAttribute.MARKETING_NAME.getSel(context));
				String strmessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NoArtworkAssociatedToPV");
				String strNotice = FrameworkUtil.join(BusinessUtil.toStringList(mList,AWLAttribute.MARKETING_NAME.getSel(context)) ,",");
				MqlUtil.mqlCommand(context, "notice $1", AWLUtil.strcat(strmessage, "\n", strNotice));
			}
			return 0;
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
		
	}
	
	public void promotePromotionalOptionToSuspended(Context context ,String[] args)throws FrameworkException
	{
		/*try{
			String promotionId = args[0];
			StringList promotionAEList = new StringList();
	 		Promotion promotionObj = new Promotion(promotionId);
			List<ArtworkMaster> promotionAEMapList = promotionObj.getArtworkElements(context);
			Iterator<ArtworkMaster> aeIt = promotionAEMapList.iterator();
			while(aeIt.hasNext()){
			    promotionAEList.add(aeIt.next().getInfo(context, DomainConstants.SELECT_ID));
			}
			
			for(int i=0; i < promotionAEList.size(); i++)
			{
	    			String artworkId = (String) promotionAEList.get(i);
	    			ArtworkMaster am = new ArtworkMaster(artworkId);
	    			StringList finalPOList = BusinessUtil.toStringList(am.getNonObsoletePromotions(context), DomainConstants.SELECT_ID);
	    			//Remove the current po from Promotions list 
	    			finalPOList.remove(promotionId);			
	    			StringList aeMCLList = BusinessUtil.toStringList(am.getMCLMapList(context), DomainConstants.SELECT_ID);
	    			if(BusinessUtil.isNotNullOrEmpty(finalPOList) && BusinessUtil.isNotNullOrEmpty(aeMCLList)){
	    				for(int j=0; j < finalPOList.size(); j++){
	    					String poId = (String) finalPOList.get(j);
	    					Promotion promoObj = new Promotion(poId);
	    					StringList productList = BusinessUtil.toStringList(promoObj.getProducts(context), DomainConstants.SELECT_ID);
	    					if(BusinessUtil.isNotNullOrEmpty(productList)){
	    						for(int k = 0; k < productList.size(); k++ ){
	    							String productId = (String) productList.get(k);
	    							CPGProduct product = new CPGProduct(productId);
	    							StringList productMCLList = BusinessUtil.toStringList(product.getMCLList(context), DomainConstants.SELECT_ID);
	    							if(BusinessUtil.isNotNullOrEmpty(productMCLList)){								
	    								Iterator productMCLIt = productMCLList.iterator();
	    								while(productMCLIt.hasNext()){
	    									String mclId = (String) productMCLIt.next();					
	    									if(aeMCLList.contains(mclId)){
	    									    aeMCLList.remove( mclId );    									   
	    									}
	    								}
	    							}
	    						}
	    					}
	    				}
	    			}    			
	    			if(BusinessUtil.isNotNullOrEmpty( aeMCLList )){
	    			    List<MasterCopyList> mclObjList = new ArrayList<MasterCopyList>( );
	    			    for(Object id : aeMCLList){
	    				mclObjList.add( new MasterCopyList((String)(id)));
	    			    }
	    			    am.disconnectFrom( context, AWLRel.MCL_ARTWORK, mclObjList);
	    			}
			}
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public int checkPromotionIsAssociatedToActivePOAs(Context context ,String[] args)throws FrameworkException {
		/*try{
			String promotionId = args[0];
		    Promotion promoObj = new Promotion(promotionId);
		    AWLState[] fpMasterStates = {AWLState.PLANNED, AWLState.ACTIVE};
		    List<FPMaster> fpMasterList = promoObj.getFPMasters( context, fpMasterStates );
		    String[] poaStates = {AWLState.PRELIMINARY.get(context, AWLPolicy.POA), 
		    		              AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA), 
		    		              AWLState.REVIEW.get(context, AWLPolicy.POA)};
		    for(FPMaster fpObj : fpMasterList){
			MapList mapList = fpObj.getPOAs( context, poaStates );
			if(mapList.size( ) > 0){
			    String strmessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Promotion.Message.POAAssociated");		    
			    MqlUtil.mqlCommand(context, "notice $1", strmessage);
			    return 1;
			}
		    }
		    return 0;
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	    
	}
}
