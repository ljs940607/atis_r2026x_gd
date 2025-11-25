package com.dassault_systemes.enovia.geographyconfiguration.ui;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.dassault_systemes.enovia.geographyconfiguration.EmxTableRowId;
import com.dassault_systemes.enovia.geographyconfiguration.GeographicConstants;
import com.dassault_systemes.enovia.geographyconfiguration.GeographyConfigurationException;
import com.dassault_systemes.enovia.geographyconfiguration.Helper;
import com.dassault_systemes.enovia.geographyconfiguration.LanguageSpecificContent;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.ProgramCallable;
import com.matrixone.apps.framework.ui.UITableIndented;

import matrix.db.Context;
import matrix.db.JPO;
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

	/**
	 * Gets all the LSC connected to decision in the System
	 * 
	 * @param context
	 *            the ENOVIA Context object
	 * @return list of LSC info
	 * @throws GeographyConfigurationException
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public List<Map<?, ?>> getTableLanguageSpecificContent(Context context, String[] args) throws GeographyConfigurationException {
		List<Map<?, ?>> resultMaps = new ArrayList<>();
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			String strObjectId = (String) programMap.get("objectId");
			DomainObject domObject = DomainObject.newInstance(context, strObjectId);
			String strRelPattern = (String) programMap.get(GeographicConstants.LSC_SPECIFIC_DYNAMIC_COMMAND_ARGUMENT);
			resultMaps = languagespecificcontent.getLanguageSpecificContent(context, domObject, null, null, strRelPattern);
			return new MapList(resultMaps);
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
	}

	/**
	 * Removes rows for LSC deletion
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            holds input arguments
	 * @return method name for post actions
	 * @throws GeographyConfigurationException
	 */
	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String actionDeleteTableRowsLSC(Context context, String[] args) throws GeographyConfigurationException {
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			String[] objList = (String[]) programMap.get("emxTableRowId");
			List<EmxTableRowId> emxTableRowIds = EmxTableRowId.getTableRowIds(objList);
			List<String> idList = new ArrayList<String>();
			for (EmxTableRowId emxTableRowId : emxTableRowIds) {
				idList.add(emxTableRowId.getObjectId());
			}
			languagespecificcontent.deleteLSC(context, idList);
			return Helper.encodeFunctionForJavaScript(context, false, "refreshOpenerWindow");
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
	}

	/**
	 * auto populate language based on Country
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            holds input arguments
	 * @return list language with respect to country selected
	 * @throws GeographyConfigurationException
	 */
	@ProgramCallable
	public Map<?, ?> reloadLanguage(Context context, String args[]) throws GeographyConfigurationException {
		try {
			List<Map<?, ?>> relObject = null;
			StringList sListActualValues = Helper.stringList();
			StringList sListDisplayValues = Helper.stringList();
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> mapColumnValues = (Map<?, ?>) programMap.get("columnValues");
			Map mapColumnMap = (Map<?, ?>) programMap.get("columnMap");
			String strrange = (String) mapColumnMap.get("range");
			String strCountry = (String) mapColumnValues.get("Country");
			List<String> objSelect = new ArrayList<String>(
					Helper.stringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_TYPE, DomainConstants.SELECT_ID));
			if (!Helper.isNullOrEmpty(strCountry)) {
				String slCountryId = languagespecificcontent.getIdByName(context, strCountry, GeographicConstants.SYMBOLIC_TYPE_COUNTRY);
				strrange.concat("countryID=" + slCountryId);
				mapColumnMap.put("range", strrange);
				DomainObject domCountry = DomainObject.newInstance(context, slCountryId);
				relObject = languagespecificcontent.getLanguage(context, objSelect, null, domCountry);
			}

			for (Map<?, ?> map : relObject) {
				String StringLanguage = (String) map.get("name");
				String StringLang = (String) map.get("id");
				sListActualValues.add(StringLang);
				sListDisplayValues.add(StringLanguage);
			}
			Map<String, Object> returnMap = new HashMap<>();
			if (!Helper.isNullOrEmpty(sListActualValues)) {
				returnMap.put("SelectedValues", sListActualValues.get(0));
				returnMap.put("SelectedDisplayValue", sListDisplayValues.get(0));
			}
			else {
				returnMap.put("SelectedValues", "");
				returnMap.put("SelectedDisplayValue", "");
			}
			return returnMap;
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e.getLocalizedMessage());
		}
	}

	/**
	 * To createLSC
	 * 
	 * @param context
	 *            ENOVIA Context object
	 * @throws GeographyConfigurationException
	 *             If operation fails If given LSC reference is null If given
	 *             LSC does not exists
	 */
	@com.matrixone.apps.framework.ui.ConnectionProgramCallable
	public Map<?, ?> createLanguageSpecificContent(Context context, String[] args) throws GeographyConfigurationException {
		try {
			final String strAttrTitle = PropertyUtil.getSchemaProperty(context, GeographicConstants.SYMBOLIC_ATTRIBUTE_TITLE);
			final String strAttrLanguageApplici = PropertyUtil.getSchemaProperty(context,
					GeographicConstants.SYMBOLIC_ATTRIBUTE_LANGUAGE_APPLICABILITPY);
			final String strAttrIsMasterContent = PropertyUtil.getSchemaProperty(context, GeographicConstants.SYMBOLIC_ATTRIBUTE_IS_MASTER_CONTENT);
			final String strAttrDate = PropertyUtil.getSchemaProperty(context, GeographicConstants.SYMBOLIC_ATTRIBUTE_START_DATE);
			Map<String, Object> mapReturnChangedRows = new HashMap<>();
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> paramMap = (Map<?, ?>) programMap.get("paramMap");
			String strObjectOID = (String) paramMap.get("objectId");
			String strRelPattern = (String) paramMap.get(GeographicConstants.LSC_SPECIFIC_DYNAMIC_COMMAND_ARGUMENT);
			Object objChangeRow = programMap.get("contextData");
			MapList mListChangedRowData = UITableIndented.getChangedRowsMapFromElement(context, objChangeRow);
			String strRowId = new String();
			MapList mListChangedRows = new MapList();
			for (int i = mListChangedRowData.size() - 1; i >= 0; i--) {
				String slCountryId = DomainConstants.EMPTY_STRING;
				String slLanguageId = DomainConstants.EMPTY_STRING;
				Map<String, Object> mapReturn = new HashMap<>();
				Map<?, ?> map = (Map<?, ?>) mListChangedRowData.get(i);
				String markup = (String) map.get("markup");
				if (markup.equals("new")) {
					Map<?, ?> mapOfEachColumn = (Map<?, ?>) map.get("columns");
					strRowId = (String) map.get("rowId");
					String strTitle = (String) mapOfEachColumn.get("Title");
					String strLanguageApplicability = (String) mapOfEachColumn.get("Language Applicability");
					String strIsMaster = (String) mapOfEachColumn.get("Is Master Content");
					String strCountry = (String) mapOfEachColumn.get("Country");
					String strLanguage = (String) mapOfEachColumn.get("Language");
					String strDate = (String) mapOfEachColumn.get("Date");
					
					String strTimeZone = (String) paramMap.get("timeZone");
					double clientTimeZone = Double.parseDouble(strTimeZone);

					Locale locale = (Locale) programMap.get("localeObj");
					if (null == locale || "".equals(locale) || "Null".equals(locale)) {
						locale = context.getLocale();
					}
					
					String description = (String) mapOfEachColumn.get(GeographicConstants.SYMBOLIC_DESCRIPTION);
					Map<String, String> attrMap = new HashMap<String, String>();
					attrMap.put(strAttrTitle, strTitle);
					attrMap.put(strAttrLanguageApplici, strLanguageApplicability);
					attrMap.put(strAttrIsMasterContent, strIsMaster);
					attrMap.put(strAttrDate, eMatrixDateFormat.getFormattedInputDate(context, strDate, clientTimeZone, locale));
					attrMap.put(DomainConstants.SELECT_DESCRIPTION, description);
					if (!Helper.isNullOrEmpty(strCountry)) {
						slCountryId = languagespecificcontent.getIdByName(context, strCountry, GeographicConstants.SYMBOLIC_TYPE_COUNTRY);
					}
					if (!Helper.isNullOrEmpty(strLanguage)) {
						slLanguageId = languagespecificcontent.getIdByName(context, strLanguage, GeographicConstants.SYMBOLIC_TYPE_LANGUAGE);
					}
					String strLSCId = languagespecificcontent.createLSC(context, strObjectOID, strRelPattern, attrMap, slCountryId, slLanguageId);
					mapReturn.put("rowId", strRowId);
					mapReturn.put("pid", strObjectOID);
					mapReturn.put("oid", strLSCId);
					mapReturn.put("markup", "add");
					mapReturn.put("columns", mapOfEachColumn);
					mListChangedRows.add(mapReturn);
				}
				mapReturnChangedRows.put("Action", "success");
				mapReturnChangedRows.put("changedRows", mListChangedRows);
			}
			return mapReturnChangedRows;
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e.getLocalizedMessage());
		}

	}

	/**
	 * To Set one LSC master LSC
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            holds input arguments
	 * @return method name for post actions
	 * @throws GeographyConfigurationException
	 */
	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String setMasterLSC(Context context, String[] args) throws GeographyConfigurationException {
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			String[] slParentId = (String[]) programMap.get("objectId");
			String strDecisionId = slParentId[0];
			DomainObject domObject = DomainObject.newInstance(context, strDecisionId);
			String[] objList = (String[]) programMap.get("emxTableRowId");
			List<EmxTableRowId> emxTableRowIds = EmxTableRowId.getTableRowIds(objList);
			if (emxTableRowIds != null && !emxTableRowIds.isEmpty()) {
				languagespecificcontent.setLSC(context, emxTableRowIds.get(0).getObjectId(), domObject);
			}
			return Helper.encodeFunctionForJavaScript(context, false, "refreshOpenerWindow");

		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e);
		}
	}

	/**
	 * To Update Country
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            holds input arguments
	 * @return method name for post actions
	 * @throws GeographyConfigurationException
	 */
	public void updateCountry(Context context, String args[]) throws GeographyConfigurationException {
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> paramMap = (Map<?, ?>) programMap.get("paramMap");
			String slObjectId = (String) paramMap.get("objectId");
			String strNewValue = (String) paramMap.get("New Value");
			languagespecificcontent.associateCountrytoLSC(context, slObjectId, strNewValue);
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e.getLocalizedMessage());
		}
	}

	/**
	 * To Update Language
	 *
	 * @param context
	 *            ENOVIA Context object
	 * @param args
	 *            holds input arguments
	 * @return method name for post actions
	 * @throws GeographyConfigurationException
	 */
	public void updateLanguage(Context context, String args[]) throws GeographyConfigurationException {
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> paramMap = (Map<?, ?>) programMap.get("paramMap");
			String slObjectId = (String) paramMap.get("objectId");
			String strNewValue = (String) paramMap.get("New Value");
			languagespecificcontent.associateLanguagetoLSC(context, slObjectId, strNewValue);
		}
		catch (Exception e) {
			throw new GeographyConfigurationException(e.getLocalizedMessage());
		}
	}

}
