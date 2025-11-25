/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
*/

import java.util.List;
import java.util.Map;

import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

import matrix.db.Context;
import matrix.util.StringList;

/**
 * @deprecated Since R2016x with POA Simplification highlight
 */
@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "deprecation"})
public class AWLFPMasterUIBase_mxJPO extends AWLObject_mxJPO
{
	//private static final String FROM_OPEN = "from[";
	//private static final String REL_SEL_CLOSE_TO_ID = "].to.id";
	/**
	 * 
	 */
	//private static final long serialVersionUID = -7059101061045354814L;
	//private static final String OBJECT_ID = "objectId";

	public AWLFPMasterUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	/* B1R */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAs(Context context, String[] args)throws FrameworkException
	{
		/*try
		{
			Map<String, String> programMap = (Map)JPO.unpackArgs(args);
			String fpMasterId = programMap.get(OBJECT_ID);
			StringList poaStates = AWLPolicy.POA.getStates(context, AWLState.OBSOLETE);
			String[] states = new String[poaStates.size()];
			states = (String[]) poaStates.toArray(states);
			
			FPMaster fpMaster = new FPMaster(fpMasterId);
			return fpMaster.getPOAs(context, states);	
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}	
	
	public List getFPMasterProductHierarchy(Context context, String[] args) throws FrameworkException {
		/*try
		{
			 Map programMap     = (Map)JPO.unpackArgs(args);
			 MapList objectList = BusinessUtil.getObjectList(programMap);
			 StringList fpIds = BusinessUtil.toStringList(objectList, DomainObject.SELECT_ID);
			 MapList productInfo = BusinessUtil.getInfo(context, fpIds, new StringList(AWLUtil.strcat("to[", AWLRel.FP_MASTER_REL.get(context), "].from.id")));
			 StringList productIds = BusinessUtil.toStringList(productInfo, AWLUtil.strcat("to[", AWLRel.FP_MASTER_REL.get(context), "].from.id"));
			 
			 //added by B1R for the IR HF-156605V6R2012x_
			 Map requestMap      = BusinessUtil.getRequestParamMap(programMap);		 
			 String exportFormat = BusinessUtil.getString(requestMap, "exportFormat");
			 return ArtworkUtil.getProductHierarchy(context, productIds, null, exportFormat);		 
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	
	protected MapList getCreatePOAFPMCLInfo(Context context, StringList fpMasterIDList)
	throws FrameworkException {

		/*String FP_MASTER = AWLType.FP_MASTER.get(context);
		String MCL = AWLType.MCL.get(context);
		String ATTR_MARKETING_NAME = AWLAttribute.MARKETING_NAME.get(context);
		String ATTR_SEL_MARKETING_NAME = getAttributeSelect(ATTR_MARKETING_NAME);
		String ATTR_SEL_MCL_NAME = getAttributeSelect(AWLAttribute.MCL_NAME.get(context));
		
		final String MCL_NAME = AWLAttribute.MCL_NAME.get(context);
		final String FP_MASTER_MARKETING_NAME = AWLUtil.strcat(FP_MASTER, ATTR_MARKETING_NAME);
		final String PROMOTIONAL_OPTION = AWLType.PROMOTIONAL_OPTION.get(context);
		
		String ACTIVE = AWLState.ACTIVE.get(context, AWLPolicy.PROMOTIONAL_OPTION);
		String PROMOTIONAL_ARTWORK_ELEMENT = AWLUtil.strcat(FROM_OPEN, AWLRel.PROMOTIONAL_ARTWORK_ELEMENT.get(context), REL_SEL_CLOSE_TO_ID);
		String MCL_ARTWORK = AWLUtil.strcat(FROM_OPEN, AWLRel.MCL_ARTWORK.get(context), REL_SEL_CLOSE_TO_ID);
		
		String selectMCL = AWLUtil.strcat("to[", AWLRel.FP_MASTER_REL.get(context), "].from.from[", AWLRel.PRODUCT_COPY_LIST.get(context), REL_SEL_CLOSE_TO_ID);
		String selectPromotion = AWLUtil.strcat(FROM_OPEN, AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context), REL_SEL_CLOSE_TO_ID);
		
		StringList selects = BusinessUtil.toStringList(selectMCL, selectPromotion, SELECT_ID, ATTR_SEL_MARKETING_NAME);
		MapList fpDetails = BusinessUtil.getInfoList(context, fpMasterIDList, selects);
		
		Set promotionids = new HashSet();
		Set uniqueMCLs = new HashSet();
		for (Map fpMaster : (List<Map>)fpDetails) {
			StringList mclIds = (StringList) fpMaster.get(selectMCL);
			if(BusinessUtil.isNullOrEmpty(mclIds)) 
				continue;
			
			uniqueMCLs.addAll(mclIds);
			
			StringList promotions = (StringList) fpMaster.get(selectPromotion);
			if(BusinessUtil.isNotNullOrEmpty(promotions)) {
				promotionids.addAll(promotions);
			}
		}
		
		String mclReleased = AWLState.RELEASE.get(context, AWLPolicy.MCL);
		StringList uniqueMCLList = BusinessUtil.toStringList(uniqueMCLs);
		StringList mclState = BusinessUtil.getInfo(context, uniqueMCLList, SELECT_CURRENT);
		StringList releasedMCLs = new StringList(mclState.size());
		for (int i = 0; i < mclState.size(); i++) {
			if(mclReleased.equals(mclState.get(i))) {
				releasedMCLs.add(uniqueMCLList.get(i));
			}
		}
		if(releasedMCLs.size() == 0)
			return new MapList();
		
		*//**
		 * Update FP Master with released MCL ids.
		 *//*
		for (Iterator iterator = fpDetails.iterator(); iterator.hasNext();) {
			Map fpMaster = (Map) iterator.next();
			List mclIds = (StringList) fpMaster.get(selectMCL);
			mclIds = BusinessUtil.matchingValues(mclIds, releasedMCLs);
			
			fpMaster.put(selectMCL, BusinessUtil.toStringList(mclIds));
		}
		
		StringList promoSel = BusinessUtil.toStringList(SELECT_ID, ATTR_SEL_MARKETING_NAME, SELECT_CURRENT, PROMOTIONAL_ARTWORK_ELEMENT);
		MapList promotionArtworksList = BusinessUtil.getInfoList(context, BusinessUtil.toStringList(promotionids), promoSel);
		
		StringList mclSel = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME, SELECT_CURRENT,ATTR_SEL_MCL_NAME,MCL_ARTWORK);
		MapList mclArtworksList = BusinessUtil.getInfoList(context, releasedMCLs, mclSel);

		Map promotionNames = new HashMap(promotionids.size());
		Map promotionArtworks = new HashMap(promotionids.size());
		Map mclNames = new HashMap(uniqueMCLs.size());
		Map mclArtworks = new HashMap(uniqueMCLs.size());
		
		for (Map promotion : (List<Map>)promotionArtworksList) {
			String current = BusinessUtil.getFirstString(promotion, SELECT_CURRENT);
			if(!ACTIVE.equals(current)) {
				continue;
			}
			String id = BusinessUtil.getFirstString(promotion, SELECT_ID);
			String name = BusinessUtil.getFirstString(promotion, ATTR_SEL_MARKETING_NAME);
			
			promotionArtworks.put(id, BusinessUtil.getStringList(promotion, PROMOTIONAL_ARTWORK_ELEMENT));
			promotionNames.put(id, name);
		}
		
		for (Map mcl : (List<Map>)mclArtworksList) {
			String id = BusinessUtil.getFirstString(mcl, SELECT_ID);
			mclNames.put(id, BusinessUtil.getFirstString(mcl, ATTR_SEL_MCL_NAME));
			mclArtworks.put(id, BusinessUtil.getStringList(mcl, MCL_ARTWORK));
		}
		
		MapList finalList = new MapList();
		for (Iterator iterator = fpDetails.iterator(); iterator.hasNext();) {
			Map fpMaster = (Map) iterator.next();
			
			StringList mclIds = (StringList) fpMaster.get(selectMCL);
			if(BusinessUtil.isNullOrEmpty(mclIds)) {
				continue;
			}
			
			String id = BusinessUtil.getFirstString(fpMaster, SELECT_ID);
			String fpDisplayName = BusinessUtil.getFirstString(fpMaster, ATTR_SEL_MARKETING_NAME);
			StringList fpPromotions = (StringList) fpMaster.get(selectPromotion);
			fpPromotions = fpPromotions == null ? new StringList() : fpPromotions;
			
			HashMap mclMap = new HashMap();
			mclMap.put(DomainObject.SELECT_ID, id);
			mclMap.put(FP_MASTER, id);
			mclMap.put(FP_MASTER_MARKETING_NAME, fpDisplayName);
			for (int i = 0;  i < mclIds.size(); i++) {
				String mclId = (String) mclIds.get(i);
				String mclName = (String) mclNames.get(mclId);
				StringList mclAEids = (StringList) mclArtworks.get(mclId);
				StringList promosmatchingMCL = new StringList(fpPromotions.size());
				for (String promotion : (List<String>)fpPromotions) {
					List promoArtwork = (List) promotionArtworks.get(promotion);
					if(promoArtwork == null)
						continue;
					if(BusinessUtil.matchingAnyValue(mclAEids, promoArtwork)) {
						promosmatchingMCL.add(promotionNames.get(promotion));
					}
				}
				Collections.sort(promosmatchingMCL);
				
				HashMap mclDetails = (HashMap) mclMap.clone();
				mclDetails.put(MCL, mclId);
				mclDetails.put(MCL_NAME, mclName);
				mclDetails.put(PROMOTIONAL_OPTION, FrameworkUtil.join(promosmatchingMCL, ", "));
				finalList.add(mclDetails);
			}				   
		}
		
		Collections.sort(finalList, new Comparator<Map>() {
			public int compare(Map o1, Map o2) {
				String mclName1 = (String) o1.get(MCL_NAME);
				String mclName2 = (String) o2.get(MCL_NAME);

				String fpDisplayname1 = (String) o1.get(FP_MASTER_MARKETING_NAME);
				String fpDisplayname2 = (String) o2.get(FP_MASTER_MARKETING_NAME);
				
				String promo1 = (String) o1.get(PROMOTIONAL_OPTION);
				String promo2 = (String) o2.get(PROMOTIONAL_OPTION);
				
				int mclCompare = mclName1.compareToIgnoreCase(mclName2);
				int fpCompare = fpDisplayname1.compareToIgnoreCase(fpDisplayname2);
				int promoCompare = promo1.compareToIgnoreCase(promo2);
				
				return mclCompare != 0 ? mclCompare :
					   fpCompare != 0 ? fpCompare : promoCompare;
			}
		});
		
		return finalList;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	
	public String getCreatePOAPromotions(Context context, String[] args)throws FrameworkException {
		/*try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);

			String strTableRowIds = (String) mpRequest.get("rowIds");
			StringList fpMasterIDList = FrameworkUtil.split(strTableRowIds, ",");
			
			String selPromotionId = AWLUtil.strcat(FROM_OPEN, AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context), REL_SEL_CLOSE_TO_ID);
			String selPromotionName = AWLUtil.strcat(FROM_OPEN, AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context), "].to.", AWLAttribute.MARKETING_NAME.getSel(context));
			String selPromotionCurrent = AWLUtil.strcat(FROM_OPEN, AWLRel.FP_MASTER_PROMOTIONAL_OPTION.get(context), "].to.current");
			MapList promotions = BusinessUtil.getInfoList(context, fpMasterIDList, 
					BusinessUtil.toStringList(selPromotionId, selPromotionName, selPromotionCurrent));
			
			StringList validPromoStates = BusinessUtil.toStringList(AWLState.ACTIVE.get(context, AWLPolicy.PROMOTIONAL_OPTION));
			
			StringList promotionids = new StringList();
			Map<String, String> promotionsMap = new TreeMap<String, String>();
			for (Iterator iterator = promotions.iterator(); iterator.hasNext();) {
				Map object = (Map) iterator.next();
				StringList promos = (StringList) object.get(selPromotionId);
				StringList promoName = (StringList) object.get(selPromotionName);
				StringList promoState = (StringList) object.get(selPromotionCurrent);
				if(BusinessUtil.isNullOrEmpty(promoState))
					continue;
				for (int i = 0; i < promoState.size(); i++) {
					String currnt = (String) promoState.get(i);
					String id = (String) promos.get(i);
					if(!validPromoStates.contains(currnt) || promotionids.contains(id)) {
						continue;
					}
					promotionsMap.put((String) promoName.get(i), id);
				}
			}
			
			StringBuffer sbHref = new StringBuffer(200);
			sbHref.append("<div width=\"100%\" >");
			sbHref.append("<table width=\"100%\"  cellpadding=\"3\" cellspacing=\"3\">");			
			
			for (String promoName : promotionsMap.keySet()) {
				sbHref.append("<tr>");
				sbHref.append("<td>");
				sbHref.append("<input type=\"checkbox\"    name=\"promotionList\"  value=\"").append(
						promotionsMap.get(promoName)).append("\"> </input>");
				sbHref.append("<label>").append(promoName).append("</label>");
				sbHref.append("</td>");
				sbHref.append("</tr>");
			}
			
			sbHref.append("</table>");
			sbHref.append("</div>");

			return sbHref.toString();
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	@com.matrixone.apps.framework.ui.PreProcessCallable
	public Map createPOAPreProcess(Context context, String[] args) throws FrameworkException {
		/*try{
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);

			String strTableRowIds = (String) mpRequest.get("rowIds");
			StringList rowIdList = FrameworkUtil.split(strTableRowIds, ",");
			StringList fpState = BusinessUtil.getInfo(context, rowIdList, SELECT_CURRENT);
			String ACTIVE = AWLState.ACTIVE.get(context, AWLPolicy.FP_MASTER);
			boolean hasInActive = false;
			for (Object object : fpState) {
				if(!ACTIVE.equals(object)) {
					hasInActive = true;
					break;
				}
			}
			Map returnMap = new HashMap(2);
			String actionKey = "Action";
			String messageKey = "Message";
			if (hasInActive) {
				String messageString =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.fpMasterActive");
				returnMap.put(actionKey, "Stop");
				returnMap.put(messageKey,messageString);
			} else {
				returnMap.put(actionKey,"Continue");
				returnMap.put(messageKey,AWLConstants.EMPTY_STRING);
			}
			return returnMap;
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public Map getCreatePOAArtworkPackageTypeRangeValues(Context context, String[] args) throws FrameworkException {
        /*try {
            Map programMap = (Map)JPO.unpackArgs(args);
            Map paramMap   = (Map)programMap.get("paramMap");
            String sLanguage = (String) paramMap.get("languageStr");
            
            StringList values = new StringList(3);
            StringList range = new StringList(3);
            
            values.add("createNew");
            range.add(AWLPropertyUtil.getI18NString(context,"emxAWL.Button.CreateNew", sLanguage));
            
            values.add("useExisting");
            range.add(AWLPropertyUtil.getI18NString(context,"emxAWL.CreatePOA.UseExisting", sLanguage));
            
            HashMap resultMap = new HashMap();
            resultMap.put(AWLConstants.RANGE_FIELD_CHOICES, values);
            resultMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, range);
            return resultMap;
            
        } catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
		
	}
	
	
	public String getCreatePOAMCLTableHTML(Context context, String[] args) throws FrameworkException {
		/*try{
			Map programMap = (Map) JPO.unpackArgs(args);
			Map reqMap = BusinessUtil.getRequestMap(programMap);
			String rowIds = (String) reqMap.get("rowIds");
			StringList fpIdList = FrameworkUtil.split(rowIds, ",");
			MapList mclData = getCreatePOAFPMCLInfo(context, fpIdList);
			
			String FP_MASTER = AWLType.FP_MASTER.get(context);
			String MCL = AWLType.MCL.get(context);
			String ATTR_MARKETING_NAME = AWLAttribute.MARKETING_NAME.get(context);
			
			final String MCL_NAME = AWLAttribute.MCL_NAME.get(context);
			final String PROMOTIONAL_OPTION = AWLType.PROMOTIONAL_OPTION.get(context);
			final String FP_MASTER_MARKETING_NAME = AWLUtil.strcat(FP_MASTER, ATTR_MARKETING_NAME);			
			
			StringList fpIds = BusinessUtil.toStringList(mclData, FP_MASTER);
			StringList fpNames = BusinessUtil.toStringList(mclData, FP_MASTER_MARKETING_NAME);
			
			StringList mclIds = BusinessUtil.toStringList(mclData, MCL);
			StringList mclNames = BusinessUtil.toStringList(mclData, MCL_NAME);
			
			StringList promotionNames = BusinessUtil.toStringList(mclData, PROMOTIONAL_OPTION);
			
			StringBuilder builder = new StringBuilder(2000);
			builder.append("<table showrmb=\"null\" id=\"AWLTable_CreatePOAMCLs\" class=\"list\">");
			builder.append("<tbody>");
			builder.append("<tr>");
			builder.append("<th width=\"7%\" style=\"text-align:center\">").
			        append("<input type=\"checkbox\" name=\"chkList\" onclick=\"creaePOASelectAllMCLs(this)\">").append("</th>");
			builder.append("<th width=\"33%\">").append(AWLPropertyUtil.getI18NString(context,"emxAWL.Table.MasterCopyList")).append("</th>");
			builder.append("<th width=\"33%\">").append(AWLPropertyUtil.getI18NString(context,"emxAWL.Label.FPMasterTab")).append("</th>");
			builder.append("<th width=\"33%\">").append(AWLPropertyUtil.getI18NString(context,"emxAWL.command.Promotions")).append("</th>");
			builder.append("</tr>");
			
			boolean odd = true;
			for (int i = 0; i < fpIds.size(); i++) {
				String fpId = (String) fpIds.get(i);
				String fpName = (String) fpNames.get(i);
				String mclId = (String) mclIds.get(i);
				String mclName = (String) mclNames.get(i);
				String promos = (String) promotionNames.get(i);
				
				builder.append("<tr class=\"").append(odd ? "odd\">" : "even\">");
				
				builder.append("<td rmb=\"\" class=\"listCell\" style=\"text-align:center\">").
				        append("<input type=\"checkbox\" onclick=\"selectAllCheckBoxIncreatePOA(this)\" name=\"MCLFPList\" value=\"").
				        append(fpId).append('|').append(mclId).append("\"> </input> </td>");
				builder.append("<td rmb=\"\" class=\"listCell\">").append(XSSUtil.encodeForHTML(context, mclName)).append("</td>");
				builder.append("<td rmb=\"\" class=\"listCell\">").append(XSSUtil.encodeForHTML(context, fpName)).append("</td>");
				builder.append("<td rmb=\"\" class=\"listCell\">").append(XSSUtil.encodeForHTML(context, promos)).append("</td>");
				builder.append("</tr>");
				odd = !odd;
			}
			return builder.toString();
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public String getCreatePOAArtworkPackageTypeDefaultOption(Context context, String[] args) {
		//return "createNew";
		return null;
		//throw new Exception("API Usage Error: API is not supported in V6R2017x");
	}
	
	/* B1R */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPromotions (Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			Map<String, String> programMap = (Map)JPO.unpackArgs(args);
			String fpMasterId = programMap.get(OBJECT_ID);
			FPMaster fpMaster = new FPMaster(fpMasterId);
			return fpMaster.getPromotions(context);		
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public StringList getCountries(Context context, String[] args) throws FrameworkException
	{
		/*StringList coutries = new StringList();
		try
		{
		    Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			for(Iterator oItr = objectList.iterator(); oItr.hasNext();)
			 {
				 Map objectMap   = (Map)oItr.next();
				 String objectID = BusinessUtil.getId(objectMap);
				 FPMaster fpMaster = new FPMaster(objectID);
				 MapList mList = fpMaster.related(AWLType.COUNTRY, AWLRel.FP_MASTER_COUNTRY).name().query(context);
				 StringList counList = BusinessUtil.toStringList(mList, DomainConstants.SELECT_NAME);
				 Collections.sort(counList);
				 coutries.add(FrameworkUtil.join(counList, ","));
			 }
		} catch (Exception e){ throw new FrameworkException(e);	}
	    return coutries;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public StringList getLanguages(Context context, String[] args) throws FrameworkException
	{
		/*StringList languages = new StringList();
		try
		{
			 Map programMap     = (Map)JPO.unpackArgs(args);
				MapList objectList = BusinessUtil.getObjectList(programMap);
				for(Iterator oItr = objectList.iterator(); oItr.hasNext();)
				 {
					 Map objectMap   = (Map)oItr.next();
					 String objectID = BusinessUtil.getId(objectMap);
					 FPMaster fpMaster = new FPMaster(objectID);
					 StringList langList = fpMaster.getLanguageNames(context);
					 languages.add(FrameworkUtil.join(langList, ","));
				 }
		} catch (Exception e){ throw new FrameworkException(e);	}
	    return languages;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public String getCountriesForPropertyPage(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map requestMap = (Map)programMap.get(AWLConstants.requestMap);
			String fpMasterId = (String)requestMap.get(OBJECT_ID);
			FPMaster fpMaster = new FPMaster(fpMasterId);
			MapList mList = fpMaster.related(AWLType.COUNTRY, AWLRel.FP_MASTER_COUNTRY).name().query(context);
			StringList counList = BusinessUtil.toStringList(mList, DomainConstants.SELECT_NAME);
			Collections.sort(counList);
			return FrameworkUtil.join(counList, ",");
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public String getLanguagesForPropertyPage(Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map requestMap = (Map)programMap.get(AWLConstants.requestMap);
			String fpMasterId = (String)requestMap.get(OBJECT_ID);
			FPMaster fpMaster = new FPMaster(fpMasterId);
			StringList langList = fpMaster.getLanguageNames(context);
			return FrameworkUtil.join(langList, ",");
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Filed Program to Fetch the Internationalized value for Creation of new "Change ACtion" for Each POA
	 * @param   context 
	 * @param   args - Arguments of Necessary Information. 
	 * @throws  FrameworkException 
	 * @since   R417
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight . 
	 */

	public String getCreateChangeActionTypeDefaultOption(Context context, String[] args) throws FrameworkException
	{
		/*try 
		{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map paramMap   = (Map)programMap.get("paramMap");
			String sLanguage = (String) paramMap.get("languageStr");
			return AWLPropertyUtil.getI18NString(context,"emxAWL.CreatePOA.CreateNewChanegAction", sLanguage);
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

	
}

