package com.dassault_systemes.enovia.geographyconfiguration.trigger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.dassault_systemes.enovia.geographyconfiguration.GeographicConstants;
import com.dassault_systemes.enovia.geographyconfiguration.GeographyConfigurationException;
import com.dassault_systemes.enovia.geographyconfiguration.Helper;
import com.dassault_systemes.enovia.geographyconfiguration.LanguageSpecificContent;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class LanguageSpecificContentBase_mxJPO {
	private final static LanguageSpecificContent languagespecificcontent = LanguageSpecificContent.getInstance();

	/**
	 * Default constructor
	 * 
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            The arguments (Ignored)
	 * @throws GeographyConfigurationException
	 *             If operation fails
	 */
	public LanguageSpecificContentBase_mxJPO(Context context, String[] args) throws GeographyConfigurationException {
		super();
	}

	public int checkAtleastOneLSCAssociatedWithContent(Context context, String[] args) throws GeographyConfigurationException {
		try {
			String objectId = args[0];
			String relPattern = args[1];
			final String ATTRIBUTE_IS_MASTER_CONTENT = PropertyUtil.getSchemaProperty(context,
					GeographicConstants.SYMBOLIC_ATTRIBUTE_IS_MASTER_CONTENT);
			final String strAttrIsMasterContent = "attribute[" + ATTRIBUTE_IS_MASTER_CONTENT + "]";
			StringList busSelects = Helper.stringList(strAttrIsMasterContent);
			
			String strWhere = DomainConstants.EMPTY_STRING;
			if (!Helper.isNullOrEmpty(objectId)) {
				DomainObject domObject = DomainObject.newInstance(context, objectId);
				List<Map<?, ?>> LSCMapList = languagespecificcontent.getLanguageSpecificContent(context,  DomainObject.newInstance(context, domObject), busSelects, strWhere, relPattern);
				boolean contains = LSCMapList.parallelStream().anyMatch(map -> map.containsValue(GeographicConstants.YES));
				if (LSCMapList.size() < 1) {
					throw new GeographyConfigurationException(
							Helper.getI18NString(context, "GeographyConfiguration.Error.Promotion.AtLeastOneLSCShouldbeConnected"));
				}
				if (contains) {
					return 0;
				}
				else {
					throw new GeographyConfigurationException(
							Helper.getI18NString(context, "GeographyConfiguration.Error.Promotion.AtleastOneLSCShouldbeMaster"));
				}
			}
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
		return 0;
	}

	public int checkAllLSCAssociatedWithContentReleased(Context context, String[] args) throws GeographyConfigurationException {
		try {
			String objectId = args[0];
			String relPattern = args[1];
			if (!Helper.isNullOrEmpty(objectId)) {
				final String STATE_IN_WORK = PropertyUtil.getSchemaProperty(context, DomainConstants.SELECT_POLICY,
						PropertyUtil.getSchemaProperty(context, GeographicConstants.SYMBOLIC_POLICY_LANGUAGE_SPECIFIC_CONTENT),
						GeographicConstants.SYMBOLIC_STATE_IN_WORK);
				DomainObject domObject = DomainObject.newInstance(context, objectId);
				StringList busSel = Helper.stringList(DomainConstants.SELECT_CURRENT);
				String strWhere =DomainConstants.EMPTY_STRING;
				List<Map<?, ?>> LSCMapList = languagespecificcontent.getLanguageSpecificContent(context,  DomainObject.newInstance(context, domObject), busSel, strWhere, relPattern);
				boolean contains = LSCMapList.parallelStream().anyMatch(map -> map.containsValue(STATE_IN_WORK));
				if (contains) {
					throw new GeographyConfigurationException(
							Helper.getI18NString(context, "GeographyConfiguration.Error.Promotion.AllLSCShouldbeReleased"));
				}
			}
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
		return 0;
	}

	public int checkLSCLanguageContains2LetterCode(Context context, String[] args) throws GeographyConfigurationException {
		try {
			String strLSCObjId = args[0];
			if (!Helper.isNullOrEmpty(strLSCObjId)) {
				final String ATTRIBUTE_LANGUAGE_2_LETTER_CODE = PropertyUtil.getSchemaProperty(context,
						GeographicConstants.SYMBOLIC_ATTRIBUTE_LANG_2_LETTER_CODE);
				final String SELECT_ATTRIBUTE_LANGUAGE_2_LETTER_CODE = DomainObject.getAttributeSelect(ATTRIBUTE_LANGUAGE_2_LETTER_CODE);
				DomainObject domLSCObj = DomainObject.newInstance(context, strLSCObjId);
				List<Map<?, ?>> lang2LetterValue = languagespecificcontent.getLanguageOfLSC(context, domLSCObj,
						StringList.asList(Helper.stringList(SELECT_ATTRIBUTE_LANGUAGE_2_LETTER_CODE)));
				if (!Helper.isNullOrEmpty(lang2LetterValue)
						&& Helper.isNullOrEmpty((String) lang2LetterValue.get(0).get(SELECT_ATTRIBUTE_LANGUAGE_2_LETTER_CODE))) {
					throw new GeographyConfigurationException(
							Helper.getI18NString(context, "GeographyConfiguration.Error.LSCPromotion.Language2LetterCodeEmpty"));
				}
			}
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
		return 0;
	}

	/**
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            Holds input arguments
	 * @return 0 for OK, 1 for Error
	 * @throws GeographyConfigurationException
	 *             if the operation fails
	 */
	public int checkLanguageSpecificContentModifyAttribute(Context context, String[] args) throws GeographyConfigurationException {
		try {
		String strLSCId = args[0];
		final String ATTRIBUTE_NAME = args[1];
		final String ATTRIBUTE_LANGUAGE_APPLICABILITY = PropertyUtil.getSchemaProperty(context,
				GeographicConstants.SYMBOLIC_ATTRIBUTE_LANGUAGE_APPLICABILITPY);
		final String strAttrLangApplicability = DomainObject.getAttributeSelect(ATTRIBUTE_LANGUAGE_APPLICABILITY);
			if (ATTRIBUTE_NAME.equalsIgnoreCase(ATTRIBUTE_LANGUAGE_APPLICABILITY)) {
				String LSC_RELATIONS = EnoviaResourceBundle.getProperty(context, "GeographyConfiguration.LanguageSpecificContent.Relationships");
				String[] arraySymRels = LSC_RELATIONS.split(",");
				Map<String, String> mapRels = new HashMap<String, String>();
				StringList mapFromIDs =  Helper.stringList();
				for (int i = arraySymRels.length - 1; i >= 0; i--) {
					mapRels.put("to[" + PropertyUtil.getSchemaProperty(context, arraySymRels[i]) + "]", arraySymRels[i]);
					mapFromIDs.add("to[" + PropertyUtil.getSchemaProperty(context, arraySymRels[i]) + "].from.id");
				}
				StringList busSelects = Helper.stringList();
				busSelects.add(DomainConstants.SELECT_ID);
				busSelects.add(DomainConstants.SELECT_CURRENT);
				busSelects.add(DomainConstants.SELECT_NAME);
				busSelects.add(strAttrLangApplicability);
				busSelects.addAll(mapFromIDs);
				busSelects.addAll(StringList.create(mapRels.entrySet().parallelStream().map(Map.Entry::getKey).collect(Collectors.toList())));
				DomainObject domSelectedLsc = DomainObject.newInstance(context, strLSCId);
				Map mapOfLSCInfo = domSelectedLsc.getInfo(context, busSelects);
				String symbolicRelName = DomainConstants.EMPTY_STRING;
				String parentId = DomainConstants.EMPTY_STRING;
				for (Map.Entry<String, String> entry : mapRels.entrySet()) {
					String key = entry.getKey();
					if (mapOfLSCInfo.containsKey(key) && Boolean.parseBoolean((String) mapOfLSCInfo.get(key))) {
						symbolicRelName = entry.getValue();
						key = key + ".from.id";
						parentId = (String) mapOfLSCInfo.get(key);
						break;
					}
				}
				if (!Helper.isNullOrEmpty(parentId)) {
					List<Map<?, ?>> LSCList = languagespecificcontent.getLanguageSpecificContent(context, DomainObject.newInstance(context, parentId),
							busSelects, null, symbolicRelName);
					if (LSCList.size() != 1) {
						throw new GeographyConfigurationException(
									Helper.getI18NString(context, "GeographyConfiguration.Error.LSCCreate.ALLLanguageApplicability"));
					}
				}
		     }
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
		return 0;
	}
	
	public int checkIfMasterLSCAssociated(Context context, String[] args) throws GeographyConfigurationException {
		try {
			String objectIdLSC = args[0];
			if (!Helper.isNullOrEmpty(objectIdLSC)) {
				DomainObject domObjectLSC = DomainObject.newInstance(context, objectIdLSC);
				Map<?, ?> relationshipMap = languagespecificcontent.getSymbolicRelationshipNameForContextLSC(context,
						domObjectLSC, null);
				if (relationshipMap != null) {
					String symbolicRelationshipName = (String) relationshipMap.get("SymbolicRelationshipName");

					if (!Helper.isNullOrEmpty(symbolicRelationshipName)) {
						final String ATTR_SELECT_IS_MASTER_CONTENT = DomainObject.getAttributeSelect(PropertyUtil
								.getSchemaProperty(context, GeographicConstants.SYMBOLIC_ATTRIBUTE_IS_MASTER_CONTENT));
						
						StringBuilder busSelect = new StringBuilder().append("to[")
								.append(PropertyUtil.getSchemaProperty(context, symbolicRelationshipName))
								.append("].from.").append(DomainConstants.SELECT_ID);

						Map<?, ?> mapLSCInfo = domObjectLSC.getInfo(context, Helper.stringList(busSelect.toString()));

						String domObjId = (String) mapLSCInfo.get(busSelect.toString());

						StringBuilder busWhere = new StringBuilder().append(ATTR_SELECT_IS_MASTER_CONTENT)
								.append(" == ").append(GeographicConstants.YES);
						List<Map<?, ?>> lscListMap = languagespecificcontent.getLanguageSpecificContent(context,
								DomainObject.newInstance(context, domObjId), null, busWhere.toString(),
								symbolicRelationshipName);

						if (Helper.isNullOrEmpty(lscListMap)) {
							throw new GeographyConfigurationException(Helper.getI18NString(context,
									"GeographyConfiguration.Error.Promotion.AtleastOneLSCShouldbeMaster"));
						}
					}
				}
			}
		} catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
		return 0;
	}
}
