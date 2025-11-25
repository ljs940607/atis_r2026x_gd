/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/


import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.Pattern;
import matrix.util.StringList;
import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.mxType;
import com.matrixone.apps.framework.ui.UIMenu;
import com.matrixone.apps.productline.ProductLineCommon;
import com.matrixone.apps.productline.ProductLineConstants;
import com.matrixone.apps.productline.ProductLineUtil;



public class AWLProductLineUIBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2585530928913137137L;
	private static final String OBJECT_ID = "objectId";
	
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLProductLineUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
    
    /**
     * for getting the company name
     * @param context
     * @param args
     * @return
     * @throws Exception
     */
    public StringList getCompany(Context context, String[] args) throws FrameworkException {
    	try{
    		StringList vaultList = new StringList();	
    	    //Instantiating a StringList for fetching value of Company Id and Company name
    	    StringList strCompany = ProductLineUtil.getUserCompanyIdName(context);
    	    //The name of the company
    	    String strCompanyName = (String)strCompany.get(1);
    		vaultList.add(strCompanyName);		
    		return vaultList;
    	}catch(Exception e){ throw new FrameworkException(e);}
	}
    
	@Deprecated
    public MapList getStructureList(Context context, String[] args) throws FrameworkException {
		/*try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
		    HashMap paramMap   = (HashMap)programMap.get("paramMap");
		    String objectId    = (String)paramMap.get(OBJECT_ID);
		
		    MapList productlineStructList = new MapList();
		    Pattern relPattern = new Pattern(ProductLineConstants.RELATIONSHIP_SUB_PRODUCT_LINES);
		    relPattern.addPattern(ProductLineConstants.RELATIONSHIP_PRODUCTLINE_MODELS);
		
		    // include type 'Product Line, Model' in Product Line structure navigation list
		    Pattern typePattern     = new Pattern("*");
		    DomainObject productLineObj = DomainObject.newInstance(context, objectId);
		    String objectType     = productLineObj.getInfo(context, DomainConstants.SELECT_TYPE);        
		    String strSymbolicName = FrameworkUtil.getAliasForAdmin(context,DomainConstants.SELECT_TYPE, objectType, true);
		    String strAllowedSTRel = "";        
		    
		    try{
		    	strAllowedSTRel = AWLPropertyUtil.getConfigPropertyString(context, AWLUtil.strcat("emxConfiguration.StructureTree.SelectedRel.", strSymbolicName));
		    }catch (Exception e) { throw new FrameworkException(e);}
		    
		    if("".equals(strAllowedSTRel)){
		    	strAllowedSTRel = AWLPropertyUtil.getConfigPropertyString(context, "emxConfiguration.StructureTree.SelectedRel.type_ProductLine");
		    }          
		    String[] arrRel = null;
		    String strRelPattern = "";
		    if(strAllowedSTRel!=null && !"".equals(strAllowedSTRel)){
		    	arrRel = strAllowedSTRel.split(",");	    
			    for(int i=0; i< arrRel.length; i++){
			    	strRelPattern = AWLUtil.strcat(strRelPattern, ",", PropertyUtil.getSchemaProperty(context,arrRel[i]));
			    }
			    strRelPattern = strRelPattern.replaceFirst(",", "");
		    }    
		    if(objectType != null &&  mxType.isOfParentType(context, objectType,ProductLineConstants.TYPE_PRODUCT_LINE)) {
		        try {
		            productlineStructList = ProductLineCommon.getObjectStructureList(context,
		                                                                                objectId,
		                                                                                relPattern,
		                                                                                typePattern);             
		        }
		        catch(Exception ex){ throw new FrameworkException(ex);}
		    } else {
		    //productlineStructList = new ${CLASS:emxPLCCommon}(context, null).getStructureListForType(context, args);
			productlineStructList = (MapList)	invokeLocal(context, "emxPLCCommon", null, "getStructureListForType", JPO.packArgs(args), MapList.class);
			
		    }
			return productlineStructList;
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	    
	
    }
    
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getWhereUsed(Context context,String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			String objectId = (String)programMap.get(OBJECT_ID);
			Brand brand = new Brand(objectId);
			short recurseLevel=0;
			
			String commandName = (String)programMap.get(AWLConstants.STR_COMMAND);
			if("AWLWhereUsedCopyLabelElement".equals( commandName ))
			{
			    recurseLevel=1;
			}
			HashMap commandMap = UIMenu.getCommand(context,commandName);
			HashMap settingsMap =(HashMap)commandMap.get(AWLConstants.STR_SETTINGS);
			String typeNamesKey=(String)settingsMap.get(AWLConstants.EXPAND_FILTER_TYPE_NAMES);
			String relNamesKey = (String)settingsMap.get(AWLConstants.EXPAND_FILTER_REL_NAMES);
			
			String strRelPattern = "";
			String strTypePattern = "";
			String strSymbolicNames = "";
			
			if(BusinessUtil.isNotNullOrEmpty(typeNamesKey))
			{
				strSymbolicNames = AWLPropertyUtil.getConfigPropertyString(context,typeNamesKey);
				strTypePattern =AWLUtil.getActualNamesFromSymbolicNames(context,strSymbolicNames);
			}
			
			if(BusinessUtil.isNotNullOrEmpty(relNamesKey))
			{
				strSymbolicNames = AWLPropertyUtil.getConfigPropertyString(context,relNamesKey);
				strRelPattern =AWLUtil.getActualNamesFromSymbolicNames(context,strSymbolicNames);
			}    
			
			StringList busSelects = new StringList(2);
			busSelects.addElement(DomainConstants.SELECT_ID);
			busSelects.addElement(DomainConstants.SELECT_TYPE);
			busSelects.addElement(DomainConstants.SELECT_NAME);

			StringList relSelects = new StringList(2);
			relSelects.addElement(DomainConstants.SELECT_RELATIONSHIP_ID);
			relSelects.addElement(DomainConstants.SELECT_RELATIONSHIP_NAME);
			
			MapList mlWhereUsedList = brand.getRelatedObjects(context, strRelPattern, strTypePattern, busSelects, relSelects, true, false,recurseLevel, "", null, 0);
					
			return mlWhereUsedList;
		}catch(Exception e){ throw new FrameworkException(e);}
		
	}
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight 
	 * Get All Promotions Associated to ProductLine or Product
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 * e55
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPromotionsAssociated(Context context, String[] args) throws FrameworkException
	{
		/*try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectID = (String) programMap.get(OBJECT_ID);
			
			if(BusinessUtil.isKindOf(context, objectID, AWLType.CPG_PRODUCT.get(context))){
				CPGProduct cpgProduct = new CPGProduct(objectID);
				return cpgProduct.getPromotionList(context);
			}
			
			StringList promotionList= new StringList();			
			Brand brand = new Brand(objectID);
			
			MapList	 promoions  = brand.getPromotions(context);			
			promotionList.addAll(BusinessUtil.toStringList(promoions, DomainConstants.SELECT_ID));
			promotionList = BusinessUtil.toUniqueSortedList(promotionList);
		
			MapList promortionMapList = new MapList(promotionList.size());
			
			for (Object object : promotionList) {
				Map mapH = new HashMap();
				mapH.put(DomainObject.SELECT_ID, object);
				promortionMapList.add(mapH);
			}
			return promortionMapList;
		}
		catch (Exception e) { throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
     /**
 	 * Added by B1r
 	 * This method is used to exclude already connected objects in full search for Add Existing in Product Hierarchy Tab.
 	 * @param context
 	 * @param args
 	 * @return
 	 * @throws Exception
 	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
 	public StringList excludeConnectedObjects(Context context,String[] args) throws FrameworkException
 	{
		try{
			MapList mlExcludeList = new MapList();
		 	   StringList slExcludeList = new StringList();
		 	   HashMap programMap = (HashMap) JPO.unpackArgs(args);
		 	   String strObjectId = (String)  programMap.get(OBJECT_ID);
		 	   DomainObject dobj = new DomainObject(strObjectId);
		 	   Pattern relPattern = new Pattern(AWLRel.SUB_PRODUCT_LINES.get(context));

		 	   Pattern typePattern = new Pattern(AWLType.PRODUCT_LINE.get(context));

		 	   StringList objectSelects = new StringList(DomainConstants.SELECT_ID);
		 	   objectSelects.addElement(DomainConstants.SELECT_NAME);
		 	   StringList relationshipSelects = new StringList();

		 	   mlExcludeList = dobj.getRelatedObjects(context,
		 			   relPattern.getPattern(),
		 			   typePattern.getPattern(),
		 			   objectSelects,
		 			   relationshipSelects,
		 			   true,
		 			   true,
		 			   (short)0,
		 			   "",
		 			   "",
		 			   0);
		 	   Iterator itr = mlExcludeList.iterator();
		 	   Map map = null;
		 	   String strObjId = "";
		 	   while(itr.hasNext())
		 	   {
		 		   map = (Map)itr.next();
		 		   strObjId = (String)map.get(DomainConstants.SELECT_ID);
		 		   slExcludeList.addElement(strObjId);
		 	   }
		 	   return slExcludeList ;
		}catch(Exception e){ throw new FrameworkException(e);}
 	 }
	/***
	 * Return POA List RMB Menu command
	 * @param context	- the enovia <code>Context</code> object
	 * @param args 		- String[] - enovia JPO packed arguments
	 * @return MapList	- list of POA 
	 * @throws Exception	- if operation fails
	 * @since   AWL 2013x
	 * @author  E55
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	 public MapList getPOAsForRMBDisplay(Context context, String[] args) throws FrameworkException
	 {
		MapList poaList	= new MapList();
		try
		{
			Map requestMap 	= (Map)JPO.unpackArgs(args);

			String strObjectID = BusinessUtil.getObjectId(requestMap);
			DomainObject domObj = new DomainObject(strObjectID);

			if(BusinessUtil.isKindOf(context,strObjectID, AWLType.CPG_PRODUCT.get(context)))
			{
				CPGProduct prod = new CPGProduct(strObjectID);
				poaList = prod.getPOAsList(context);
			}
			else if(BusinessUtil.isKindOf(context, strObjectID, AWLType.MODEL.get(context)) )
			{
				poaList = AWLObject.related(domObj,AWLUtil.toArray(AWLType.CPG_PRODUCT, AWLType.POA),AWLUtil.toArray(AWLRel.ASSOCIATED_POA))
						.select( AWLType.POA).id().query(context);
			}
			else if(BusinessUtil.isKindOf(context,strObjectID, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(strObjectID);
				poaList = brand.getPOAsList(context);

				poaList= Brand.related(domObj,AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.MODEL, AWLType.CPG_PRODUCT, AWLType.POA),AWLUtil.toArray(AWLRel.ASSOCIATED_POA))
						.select( AWLType.POA).id().query(context);
			}
		}
		catch(Exception e) { throw new FrameworkException(e); }
		return poaList;
	 }	
}

