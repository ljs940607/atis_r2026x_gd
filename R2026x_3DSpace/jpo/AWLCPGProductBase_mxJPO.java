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

import com.matrixone.apps.awl.dao.ArtworkTemplate;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUIUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class AWLCPGProductBase_mxJPO extends AWLObject_mxJPO
{
	private static final String FROM_OPEN = "from[";
	private static final String REL_SEL_CLOSE_TO_ID = "].to.id";
	private static final String REL_SEL_CLOSE_FROM = "].to.from[";
	/**
	 * 
	 */
	private static final long serialVersionUID = -5655957929987762868L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLCPGProductBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void connectModelToProductLine(Context context,String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap   = (HashMap)programMap.get("requestMap");
			HashMap paramMap   = (HashMap)programMap.get("paramMap");	
			String tableRowId = (String) requestMap.get("emxTableRowId");
			String productId = (String)paramMap.get("objectId");
			String productLineId = (String)requestMap.get("objectId");
			if(tableRowId != null)
			{
				productLineId=AWLUIUtil.getObjIdFromRowId(tableRowId);
			}
			if(BusinessUtil.isNotNullOrEmpty(productLineId)) {
			    CPGProduct CPGProdObj = new CPGProduct(productId);
			    String strModelId = CPGProdObj.getInfo(context, AWLUtil.strcat("to[", AWLRel.MAIN_PRODUCT.get(context), "].from.id"));
			    if(BusinessUtil.isNullOrEmpty(strModelId))
			    	strModelId = CPGProdObj.getInfo(context, AWLUtil.strcat("to[", AWLRel.PRODUCTS.get(context), "].from.id"));
			    updateMarketingNameToModel(context,CPGProdObj,strModelId);
			    Brand brand=new Brand(productLineId);
			    brand.connectTo(context, AWLRel.PRODUCT_LINE_MODELS, new DomainObject(strModelId));
			}
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	private void updateMarketingNameToModel(Context context,CPGProduct CPGProdObj,String strModelId) throws FrameworkException	
	{
		try
		{
		    String MarketingName = CPGProdObj.getInfo(context,AWLUtil.strcat("attribute[", AWLAttribute.MARKETING_NAME.get(context), "]"));
			DomainObject ModelObj=new DomainObject(strModelId);
		    ModelObj.setAttributeValue(context, AWLAttribute.MARKETING_NAME.get(context), MarketingName);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	//TODO: getProductLineProductStructure method to be moved to ${CLASS:AWLProductLineUIBase}.java as per review with KIH
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getProductLineProductStructure(Context context, String[] args) throws FrameworkException
	{	
		MapList plProductMap = null;
		try {	
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			String strObjectid = (String)programMap.get("objectId");
			
			Brand brand=new Brand(strObjectid);

			plProductMap=brand.related(AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.CPG_PRODUCT, AWLType.MODEL), 
					AWLUtil.toArray(AWLRel.PRODUCT_LINE_MODELS, AWLRel.SUB_PRODUCT_LINES, AWLRel.MAIN_PRODUCT, AWLRel.PRODUCTS)).level(0).
					query(context);

		} catch (Exception e){ throw new FrameworkException(e);	}
		return plProductMap;
	}
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Clones the FP Masters related to CPG product
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @since 2012x.FD01
	 * @author B1R
	 * modified by N94 2014x Product Revise Usecase
	 * @throws Exception 
	 */
	public void cloneAssociatedFPMasters (Context context, String[] args) throws FrameworkException
	{
		/*String strObjId	= args[0];
        if (!BusinessUtil.isKindOf(context, strObjId, AWLType.CPG_PRODUCT.get(context))) {
			return;
		}							
			try
			{
				ContextUtil.startTransaction(context, true);				
				CPGProduct doProduct = new CPGProduct(strObjId);
				DomainObject dobNextRevision = new DomainObject(doProduct.getNextRevision(context));
				CPGProduct newRevProduct = new CPGProduct(dobNextRevision.getObjectId());
				String[] fpMasterStates = new String[]{AWLState.PLANNED.get(context, AWLPolicy.FP_MASTER),AWLState.ACTIVE.get(context, AWLPolicy.FP_MASTER)};
				List<FPMaster> fpMasterList = doProduct.getFPMasters(context, fpMasterStates);
					
				for (FPMaster fpMaster : fpMasterList) {
					String displayName = newRevProduct.getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context));	
					displayName = AWLUtil.strcat(displayName, ":", newRevProduct.getRevision()); 
					List<Country> countries = fpMaster.getCountries(context);
					for(Country country: countries)
						displayName=AWLUtil.strcat(displayName,"-",country.getInfo(context, SELECT_NAME));									
					DomainObject clonedFPMaster = new DomainObject(
							fpMaster.cloneObject(context, DomainObject.getAutoGeneratedName(context, AWLType.FP_MASTER.toString(), null),null, fpMaster.getVault()));					
					 Connect cloned FP master to the new revision of the product
					 * Other connections like 'FP Master Selected Options'
					 * 'FPMasterPromotionalOption' and 'Design Responsibility'
					 * are handled in the relationship definition
					 
					FPMaster newFPMaster = new FPMaster(clonedFPMaster.getObjectId());	
					newFPMaster.setAttributeValue(context,AWLAttribute.MARKETING_NAME.get(context) , displayName);
					newRevProduct.connectTo(context, AWLRel.FP_MASTER_REL, newFPMaster);					
				}
				ContextUtil.commitTransaction(context);
			}
			catch (Exception ex) {
				ContextUtil.abortTransaction(context);
				ex.printStackTrace();
				throw new FrameworkException(ex);
			}*/			
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Clones the MCL Masters related to CPG product product Revise usecase
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @since 2014x
	 * @author N94
	 * @throws Exception 
	 */
	public void cloneAssociatedMCLs (Context context, String[] args) throws FrameworkException
	{
		/*String strObjId	= args[0];
        if (!BusinessUtil.isKindOf(context, strObjId, AWLType.CPG_PRODUCT.get(context))) {
			return;
		}		
			try
			{
				ContextUtil.startTransaction(context, true);				
				CPGProduct doProduct = new CPGProduct(strObjId);
				DomainObject dobNextRevision = new DomainObject(doProduct.getNextRevision(context));
				CPGProduct newRevProduct = new CPGProduct(dobNextRevision.getObjectId());
				String cpgName=newRevProduct.getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context));
				String newRev=newRevProduct.getRevision();				
				List<MasterCopyList> mclList =  doProduct.getMCLs(context);
				for (MasterCopyList mcl : mclList) {
					String mclName=mcl.getAttributeValue(context, AWLAttribute.MCL_NAME.get(context));
					String mclNewName = AWLUtil.strcat(cpgName,"-",newRev,"-",mclName);					   
				    				 
				    DomainObject clonedMCL = new DomainObject(mcl.cloneObject(context, mclNewName ,null,null));				
					MasterCopyList newMCL = new MasterCopyList(clonedMCL.getObjectId());
					newRevProduct.connectTo(context,AWLRel.PRODUCT_COPY_LIST, newMCL);
					
					MapList ArtworkMasterlist= mcl.getArtworkMasterList(context, 
							new StringList(SELECT_ID), null, null);					
					newMCL.addRemoveArtworkElements(context, BusinessUtil.getIdList(ArtworkMasterlist), new StringList());
				}
				ContextUtil.commitTransaction(context);
			}
			catch (Exception ex) {
				ContextUtil.abortTransaction(context);
				ex.printStackTrace();
				throw new FrameworkException(ex);
			}		*/	
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	 /**
	  * Get POAs (active and inactive) from Product and Product Line and check whether any POAs created 
	  * @param context
	  * @param args
	  * @return
	  * @throws FrameworkException
	  */
	 public int canRemoveModelFromProductLine(Context context, String[] args) throws FrameworkException
	 {
		 try 
		 {
			 String modelId	= args[0];
			 String SEL_MAIN_PROD_POAS = AWLUtil.strcat(FROM_OPEN, AWLRel.MAIN_PRODUCT.get(context), REL_SEL_CLOSE_FROM, AWLRel.ASSOCIATED_POA.get(context), REL_SEL_CLOSE_TO_ID);
			 String SEL_MAIN_PROD_INACTIVE_POAS = AWLUtil.strcat(FROM_OPEN, AWLRel.MAIN_PRODUCT.get(context), REL_SEL_CLOSE_FROM, AWLRel.ASSOCIATED_INACTIVE_POA.get(context), REL_SEL_CLOSE_TO_ID);

			 String SEL_PRODS_POAS = AWLUtil.strcat(FROM_OPEN, AWLRel.PRODUCTS.get(context), REL_SEL_CLOSE_FROM, AWLRel.ASSOCIATED_POA.get(context), REL_SEL_CLOSE_TO_ID);
			 String SEL_PRODS_INACTIVE_POAS = AWLUtil.strcat(FROM_OPEN, AWLRel.PRODUCTS.get(context), REL_SEL_CLOSE_FROM, AWLRel.ASSOCIATED_INACTIVE_POA.get(context), REL_SEL_CLOSE_TO_ID);

			 StringList selectedObjs = new StringList(SEL_MAIN_PROD_POAS);
			 selectedObjs.add(SEL_MAIN_PROD_INACTIVE_POAS);
			 selectedObjs.add(SEL_PRODS_POAS);
			 selectedObjs.add(SEL_PRODS_INACTIVE_POAS);
			 Map mclMap=  BusinessUtil.getInfoList(context, modelId, selectedObjs);

			 if(!mclMap.isEmpty()) {
				 String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ProductConnectedToPOAs");
				 MqlUtil.mqlCommand(context, "notice $1", strAlert);
				 return 1;
			 }
			 return 0;
		 } catch (Exception e){ throw new FrameworkException(e);	}
	 }

	/**
	 * Connects the Revised Product with artwork template
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @author Subbarao G(SY6)
	 */
	public void connectRevisedProductWithArtworkTemplate (Context context, String[] args) throws FrameworkException
	{
		try {
			CPGProduct oldProduct =new CPGProduct(getId(context));
			
			List<ArtworkTemplate> artworkTemplateLsit = oldProduct.getArtworkTemplates(context);
			
			if(BusinessUtil.isNullOrEmpty(artworkTemplateLsit))
				return;

			CPGProduct newProduct = new CPGProduct(oldProduct.getNextRevision(context));
			newProduct.connectTo(context, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE, artworkTemplateLsit);	
			
		} catch (Exception e) { throw new FrameworkException(e); }	
		
	}
	
}

