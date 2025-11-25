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
import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.QueryRelated;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;

public class AWLCPGProductUIBase_mxJPO extends AWLObject_mxJPO
{
	public static final String AWLPRODUCT_REVISION_FILTER = "AWLProductRevisionFilter";
	public static final String LATEST_RELEASED_AND_LATEST = "Latest Released and Latest";
	public static final String LATEST = "Latest";
	public static final String LATEST_RELEASED = "Latest Released";
	private static final String OBJECT_ID = "objectId";
	private static final long	serialVersionUID	= -6606796785013473202L;

	@SuppressWarnings({"PMD.SignatureDeclareThrowsException"})
	public AWLCPGProductUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	

	/**
	 * Expands the Product Line/Brand/CPG Product to Next Possible Levels
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since  VR2016x_Beta-3
	 * Created during 'POA Simplification Highlight'
	 * @deprecated
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getHieararchyObjects(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);

			AWLType incTypeArray[] = { AWLType.CPG_PRODUCT, AWLType.PRODUCT_LINE, AWLType.BRAND, AWLType.SUB_BRAND, AWLType.SEGMENT, AWLType.COMMERCIAL_VARIANT };
			AWLType typeArray[] = {AWLType.PRODUCT_LINE, AWLType.MODEL, AWLType.CPG_PRODUCT};
			AWLRel relArray[] = {AWLRel.PRODUCT_LINE_MODELS, AWLRel.SUB_PRODUCT_LINES, AWLRel.MAIN_PRODUCT, AWLRel.PRODUCTS};
			

			MapList hierarchyInfo  =  new MapList();
			QueryRelated related = null; 
			if(BusinessUtil.isKindOf(context, objectId, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(objectId);
				hierarchyInfo.addAll(brand.related(typeArray, relArray).level(0).select(incTypeArray).id().from().type().state().query(context));
				related = brand.related(typeArray, relArray).level(0).select(incTypeArray).id().to().type();
			}
			else if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context)))
			{
				related = new CPGProduct(objectId).related(typeArray ,relArray).id().type().from().select(incTypeArray).level(0);
			}
			hierarchyInfo.addAll(related.state().query(context));
			hierarchyInfo.add(BusinessUtil.getInfo(context, objectId, BusinessUtil.toStringList(SELECT_NAME, SELECT_ID, SELECT_TYPE, SELECT_LEVEL,SELECT_CURRENT)));
			hierarchyInfo.sort("level", "ascending", "integer");
			
			String keysToExclude[] = {DomainRelationship.SELECT_ID, KEY_RELATIONSHIP, SELECT_LEVEL};
			hierarchyInfo = BusinessUtil.toUniqueMapList(hierarchyInfo, keysToExclude);
			return getCurrentObejctInfo(context, hierarchyInfo);

		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	/**
	 * Get the Level for the Selected Hierarchy
	 * @param context
	 * @param toSequenceMap
	 * @return
	 * @throws Exception
	 * @deprecated
	 */
	private MapList getCurrentObejctInfo(Context context, List<Map> toSequenceMap)
	{
		MapList returnMapList = new MapList();
		for (Map currentMap : toSequenceMap) 
		{
			currentMap.put(SELECT_LEVEL, "1");
			returnMapList.add(currentMap);
		}
		return returnMapList;
	}
	
	@Deprecated
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getExpandedCPGProducPOAs(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			String currentLevel = (String) programMap.get("level");
			int expandLevel = getExpandLevel(context, args);
			boolean expandAll = expandLevel != 1;

			if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context)))
			{
				CPGProduct cpgProd = new CPGProduct(objectId);
				return expandCPGProductHierarchyPOAs(context, cpgProd, currentLevel, expandLevel);
			}
			else if(BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context)))
			{
				POA poa = new POA(objectId);
				return expandPOAs(context, poa, "3");
			}
			else if(BusinessUtil.isKindOf(context, objectId, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(objectId);
				MapList brandHierarchy = new MapList();
				String strObjectWhere = AWLUtil.strcat("to[",AWLRel.ASSOCIATED_POA.get(context),"].to.from[",AWLRel.DERIVED.get(context),"] == False");
				MapList poaMapList = brand.related(AWLType.POA, AWLRel.ASSOCIATED_POA).id().name().where(strObjectWhere).state().level(0).select(AWLType.POA).query(context);
				for (Iterator iterator = poaMapList.iterator(); iterator.hasNext();) 
				{
					Map poaMap = (Map) iterator.next();
					poaMap.put(SELECT_LEVEL, "2");
					brandHierarchy.add(poaMap);
					if(expandAll)
					{
						POA poa = new POA((String) poaMap.get(SELECT_ID));
						brandHierarchy.addAll(expandPOAs(context, poa , "3"));
					}
				}
				return brandHierarchy;
			}
			else
			{
				return new MapList();
			}
		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	/**
	 * Expands the POAs to Next Possible Levels
	 * @param Context	context
	 * @param String 	objectId
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since  VR2015x.HF1
	 * Created during 'POA Simplification Highlight'
	 * @deprecated
	 */
	private MapList expandPOAs(Context context, POA contextPOA, String currentLevel) throws FrameworkException
	{
		try
		{ 
			int levelVlaue = Integer.parseInt(currentLevel);
			String level =  levelVlaue == 2 ? "2" : "3" ;
			MapList poaList = new MapList();
			poaList = contextPOA.related(AWLUtil.toArray( AWLType.POA),AWLUtil.toArray(AWLRel.DERIVED))
					.id().type().from().state().select(AWLUtil.toArray(AWLType.POA)).level(0).query(context);
			poaList.sort("level", "ascending", "integer");
			for (Iterator iterator = poaList.iterator(); iterator.hasNext();) 
			{
				Map poaObject = (Map) iterator.next();	
				poaObject.put(SELECT_LEVEL, level);
			}
			return poaList;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Expands the CPG Product to Next Possible Levels
	 * @param Context	context
	 * @param String 	objectId
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since  VR2015x.HF1
	 * @deprecated
	 * Created during 'POA Simplification Highlight'
	 */
	private MapList expandCPGProductHierarchyPOAs(Context context, CPGProduct cpgProd, String currentLevel, int expandLevel) throws FrameworkException
	{
		try
		{
			MapList resultHierarchyInfo = new MapList();
			String strObjectWhere = AWLUtil.strcat("to[",AWLRel.ASSOCIATED_POA.get(context),"].to.from[",AWLRel.DERIVED.get(context),"] == False");
			MapList poasCPGProductList = cpgProd.related(AWLUtil.toArray( AWLType.POA),	AWLUtil.toArray(AWLRel.ASSOCIATED_POA))
					.id().type().state().select(AWLUtil.toArray(AWLType.POA)).where(strObjectWhere).level(0).query(context);

			for (Iterator iterator = poasCPGProductList.iterator(); iterator.hasNext();) 
			{
				Map poasMap = (Map) iterator.next();
				poasMap.put(SELECT_LEVEL, "2");
				resultHierarchyInfo.add(poasMap);
				if(expandLevel > 2 ||expandLevel == 0)
				{
					POA poa = new POA((String) poasMap.get(SELECT_ID));
					resultHierarchyInfo.addAll(expandPOAs(context, poa , "3"));
				}
			}
			return resultHierarchyInfo;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}


	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Expands the Product to Next Possible Levels
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @modified R2J (Raghavendra M J)
	 * @Since VR2015x
	 */
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getExpandedProductStructure(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			
			String objectId = (String) programMap.get(OBJECT_ID);
			String strFilterCountryIds = (String) programMap.get(AWLConstants.COUNTRY_IDS);
			StringList filterCountriesList = BusinessUtil.isNotNullOrEmpty(strFilterCountryIds) ? FrameworkUtil.split(strFilterCountryIds, "|") : null;
			
			String prodFilter = (String) programMap.get(AWLPRODUCT_REVISION_FILTER);
			boolean showAll = AWLConstants.RANGE_ALL.equals(prodFilter);
			boolean showLatestReleasedLatest = LATEST_RELEASED_AND_LATEST.equals(prodFilter);
			boolean showLatestReleased = LATEST_RELEASED.equals(prodFilter);
			boolean showLatest = LATEST.equals(prodFilter);			
			
			boolean expandAll = getExpandLevel(context, args) != 1;
			
			if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context)))
			{
				CPGProduct cpgProd = new CPGProduct(objectId);
				return expandCPGProduct(context, cpgProd);
			}
			else if(BusinessUtil.isKindOf(context, objectId, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(objectId);
				
				MapList prodRevFilteredProductsList = new MapList();
				MapList mlCPGProductList = brand.related(AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.MODEL, AWLType.CPG_PRODUCT), 
						AWLUtil.toArray(AWLRel.PRODUCT_LINE_MODELS, AWLRel.SUB_PRODUCT_LINES, AWLRel.MAIN_PRODUCT, AWLRel.PRODUCTS))
						.id().type().state()
						.level(0)
						.query(context);

				for (Iterator iterator = mlCPGProductList.iterator(); iterator.hasNext();) 
				{
					Map mpCPGProduct = (Map) iterator.next();
					String strProductId = (String) mpCPGProduct.get(SELECT_ID);
					String objectState =  (String) mpCPGProduct.get(SELECT_CURRENT);

					if(!BusinessUtil.isKindOf(context, strProductId, AWLType.CPG_PRODUCT.get(context)))
					{
                        continue;
                    }
					String disableSelectionValue = AWLState.OBSOLETE.get(context, AWLPolicy.PRODUCT).equals(objectState) ? AWLConstants.RANGE_TRUE : AWLConstants.RANGE_FALSE;
					mpCPGProduct.put(AWLConstants.SB_ROW_DISABLE_SELECTION, disableSelectionValue);
					mpCPGProduct.put(SELECT_LEVEL, "1");					

					boolean isLatest = showLatestReleasedLatest || showLatest ? AWLUtil.isLatestProductRevision(context, strProductId) : false;
					boolean isLatestReleased = showLatestReleasedLatest || showLatestReleased ? AWLUtil.isLatestReleasedProductRevision(context, strProductId) : false;
					
					boolean includeProd = showAll ? true :
						                  showLatestReleasedLatest ? (isLatestReleased || isLatest) :
						                  showLatestReleased ? isLatestReleased :
						                  showLatest ? isLatest : false;	  
					if(includeProd && BusinessUtil.isNotNullOrEmpty(filterCountriesList)) {
						StringList assignedCountriesForProd = AWLUtil.getCountriesForProduct(context, strProductId);
						includeProd = BusinessUtil.matchingAnyValue(assignedCountriesForProd, filterCountriesList); 
					}
						
					if(includeProd) {
						prodRevFilteredProductsList.add(mpCPGProduct);
						if(expandAll)
						{
							CPGProduct cpgProd = new CPGProduct(strProductId);
							prodRevFilteredProductsList.addAll(expandCPGProduct(context,cpgProd));
						}
					}
				}
                return prodRevFilteredProductsList;
            }
            else
            {
                return new MapList();
            }
        } catch (Exception e){ throw new FrameworkException(e);	}
}
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Expands the Product to Next Possible Levels
	 * @param Context	context
	 * @param String 	objectId
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since R217
	 */
	protected MapList expandCPGProduct(Context context, CPGProduct cpgProduct) throws FrameworkException
	{
		try
		{
			MapList mclfpmCPGProductList = new MapList();
			String strObjectWhere = AWLUtil.strcat(DomainObject.SELECT_CURRENT, "!= '", AWLState.OBSOLETE.get(context, AWLPolicy.FP_MASTER), "'");
			mclfpmCPGProductList = cpgProduct.related(AWLUtil.toArray(AWLType.MCL, AWLType.FP_MASTER),	AWLUtil.toArray(AWLRel.PRODUCT_COPY_LIST, AWLRel.FP_MASTER_REL))
					.id().type().state().select(AWLUtil.toArray(AWLType.FP_MASTER, AWLType.MCL)).where(strObjectWhere).level(0).query(context);
			String objectState = BusinessUtil.getInfo(context, cpgProduct.getObjectId(), SELECT_CURRENT);
			
			for (Iterator iterator = mclfpmCPGProductList.iterator(); iterator.hasNext();) 
			{
				Map mpObject = (Map) iterator.next();				
				String disableSelectionValue = AWLState.OBSOLETE.get(context, AWLPolicy.PRODUCT).equals(objectState) ? AWLConstants.RANGE_TRUE : AWLConstants.RANGE_FALSE;
				mpObject.put(AWLConstants.SB_ROW_DISABLE_SELECTION, disableSelectionValue);				
				mpObject.put(SELECT_LEVEL, "2");
			}			
			return mclfpmCPGProductList;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Shows Product Hierarchy for given POA
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return StringList - Hierarchy Information
	 * @throws MatrixException
	 * @author VD8
	 * since 2012x.HF1
	 * @deprecated -- not used anywhere
	 * Deprecated during 'Copy List Highlight'
	 */
	public StringList showProductHierarchy(Context context, String[] args) throws MatrixException
	{
		try
		{
			AWLPOAUIBase_mxJPO poaUIBase = (AWLPOAUIBase_mxJPO)newInstanceOfJPO(context, "AWLPOAUI");
			return poaUIBase.getPOAProductHierarchy(context, args);
		} 
		catch (Exception e){ throw new MatrixException(e); }
	}

	// TODO: showCountriesAssigned method to be copied to AWLProductLineUIBase JPO
	
	/**
	 * @param context
	 * @param args
	 * @return
	 * @throws MatrixException
	 */
	public StringList showCountriesAssigned(Context context, String args[]) throws MatrixException
	{
		return showCountries(context, args);	
	}

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getFPMasterLaunguagesAssociated(Context context, String[] args) throws FrameworkException
	{
		/*StringList langList = new StringList();
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			for (Iterator oItr = objectList.iterator(); oItr.hasNext();)
			{
				Map objectMap = (Map) oItr.next();
				String fpMasterObjID = BusinessUtil.getString(objectMap, DomainConstants.SELECT_ID);
				String langStr = "";
				FPMaster fpMaster = new FPMaster(fpMasterObjID);
				for (Language language : fpMaster.getLanguages(context))
				{
					if (!"".equals(langStr))
						langStr = AWLUtil.strcat(langStr, ", ");
					langStr = AWLUtil.strcat(langStr, language.getName(context));
				}
				langList.add(langStr);

				
				 * String objectID = BusinessUtil.getString(objectMap,
				 * DomainConstants.SELECT_ID); if(BusinessUtil.isKindOf(context,
				 * objectID, AWLType.FP_MASTER.get(context))) { StringList
				 * languageStrList =
				 * AWLUtil.getFPMasterLanguages(context,objectID
				 * ,AWLType.LANGUAGE.get(context)); String lang =
				 * FrameworkUtil.join(languageStrList, ", ");
				 * langList.add(lang); } else { langList.add(""); }
				 
			}
			return langList;
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

	/**
	 * Method call to get all the Artwork Structure associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of Artwork Structure
	 * @throws Exception
	 *             if operation fails
	 * @author AA1
	 * @throws FrameworkException 
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkStructureForCPGProduct(Context context, String[] args) throws FrameworkException {
		AWLArtworkElementUIBase_mxJPO artworkElementJPO = null;
		try{
			 artworkElementJPO = (AWLArtworkElementUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkElementUI");
		  }catch(Exception e)
		{
			  e.printStackTrace();
			  throw new FrameworkException();
		}
            return artworkElementJPO.getArtworkStructureForProductLine(context, args);
	}

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Method call to get all the Associated Promotions to the CPG Product.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all Promotions details
	 * @throws Exception
	 *             if operation fails
	 * @author AA1
	 */
	public MapList getPromotionsAssociatedToCPGProduct(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);

			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			return cpgProduct.getPromotionList(context);
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Method call to get all the MCLs Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all MCLs
	 * @throws Exception
	 *             if operation fails
	 * @author AA1
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getMCLAssociatedToCPGProduct(Context context, String[] args) throws FrameworkException
	{/*
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);

			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			return cpgProduct.getMCLList(context);
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

		/**
	 * Method call to get all the POAs Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all POA
	 * @throws Exception
	 *             if operation fails
	 * @author BV8
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAsAssociatedToCPGProduct(Context context, String[] args)
			throws FrameworkException {
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);

			CPGProduct prod = new CPGProduct(cpgProductID);
			return BusinessUtil.toMapList(context, prod.getPOAs(context));
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Method call to get all the FP Master Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all MCLs
	 * @throws Exception
	 *             if operation fails
	 * @author AA1
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getFPMastersAssociatedToCPGProduct(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);

			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			return cpgProduct.getFPMasterList(context);
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Method call to get all the Artwork Element Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all MCLs
	 * @throws Exception
	 *             if operation fails
	 * @author E55
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getInheritedArtworkElements(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);

			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			return cpgProduct.getArtworkElementsList(context, true);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
		/**
	 * Method call to get all the Artwork Package Associated with CPG Product.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments: 0 - HashMap containing one String entry for key "objectId"
	 * @return Object - MapList containing the id of all Artwork Package
	 * @throws Exception if operation fails
	 * @author e55
	 * @modified R2J (Raghavendra M J)
	 * @since  VR2016x
	 * Modified during 'POA Simplification Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkPackage(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);

			CPGProduct prod = new CPGProduct((String) programMap.get(OBJECT_ID));
			
			AWLType[] typeArray = { AWLType.POA, AWLType.ARTWORK_PACKAGE};
			AWLRel[] relArray = {AWLRel.ASSOCIATED_POA,AWLRel.ASSOCIATED_INACTIVE_POA,AWLRel.ARTWORK_PACKAGE_CONTENT};
			MapList artworkPackage = prod.related(typeArray ,relArray).both().id().select(AWLType.ARTWORK_PACKAGE).query(context);

			StringList artworkPackageIds = BusinessUtil.toStringList(artworkPackage, SELECT_ID);
			artworkPackageIds = BusinessUtil.toUniqueList(artworkPackageIds);

			return BusinessUtil.toMapList("id", artworkPackageIds);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}	
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Method call to get all the Preliminary MCLs Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all MCLs
	 * @throws Exception
	 *             if operation fails
	 * @author SY6
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPreliminaryMCLsAssociatedToCPGProduct(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);
			
			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			String whereExp = AWLUtil.strcat("(current == \"", AWLState.PRELIMINARY.get(context, AWLPolicy.MCL), "\")");		
			return cpgProduct.getMCLList(context, whereExp);
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Method call to get all the Obsolete MCLs Associated with CPG Product.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all MCLs
	 * @throws Exception
	 *             if operation fails
	 * @author SY6
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getObsoleteMCLsAssociatedToCPGProduct(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(OBJECT_ID);
			
			CPGProduct cpgProduct = new CPGProduct(cpgProductID);		
			MapList obsoleleMCLs =  cpgProduct.getObsoleteMCLList(context);
			for (Map mcl : (List<Map>)obsoleleMCLs) {
				mcl.put(AWLConstants.SB_ROW_DISABLE_SELECTION, "true");
			}
			return obsoleleMCLs;
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Method call to get all the Associated Countries to the CPG Product.
	 * 
	 * @param context the eMatrix <code>Context</code> object
	 * @param args
	 * @return Object - MapList containing the id of all countries assigned to country
	 * @throws Exception if operation fails
	 * @author WX7
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getCountriesAssignedToCPGProduct(Context context, String[] args) throws FrameworkException {
		try {
			MapList countriesMapList = new MapList();
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String cpgProductID = (String) programMap.get(BusinessUtil.OBJECT_ID);

			CPGProduct cpgProduct = new CPGProduct(cpgProductID);
			List<Country> countriesAssigned = cpgProduct.getCountries(context);
			for (Country country : countriesAssigned) {
				Map countryMap = new HashMap();
				countryMap.put(DomainConstants.SELECT_ID, country.getId(context));
				countriesMapList.add(countryMap);
			}
			return countriesMapList;
		}catch (Exception e){ throw new FrameworkException(e);	}
	}

}
