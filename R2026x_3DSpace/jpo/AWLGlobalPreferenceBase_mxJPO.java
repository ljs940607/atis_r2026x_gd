import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.preferences.NutritionElement;
import com.matrixone.apps.awl.preferences.NutritionFactsConfiguration;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class AWLGlobalPreferenceBase_mxJPO {

	public AWLGlobalPreferenceBase_mxJPO (Context context, String[] args) throws Exception
    {
        
    }
	
	public String getSystemBaseLanguage(Context context, String[] args) throws FrameworkException {
		return AWLGlobalPreference.getSystemBaseLanguage(context);
	}
	
	public void setSystemBaseLanguage(Context context, String[] args) throws FrameworkException {
		try {
			HashMap<?, ?> programMap = (HashMap<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> paramMap = (Map<?, ?>) programMap.get("paramMap");
					
			String selectedLanguage = (String) paramMap.get("New Value");
			if(BusinessUtil.isNullOrEmpty(selectedLanguage)) {
				throw new FrameworkException("Language name can't be blank");
			}
			
			AWLGlobalPreference.setSystemBaseLanguage(context, selectedLanguage);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public String getArtworkRangeValues(Context context, String[] args) throws FrameworkException {
		StringList slRange = AWLAttribute.ARTWORK_USAGE.getAttrRanges(context);
		return FrameworkUtil.join(slRange, "\n");
	}
	
	
	@SuppressWarnings("unchecked")
	public MapList getSubProductLineConfigFields(Context context, String[] args) throws Exception {
		MapList globalPreferencesFieldMap = new MapList();
		Map<String, StringList> configurationMap = AWLGlobalPreference.getSubProductLineConfigMap(context);
		
		for (Map.Entry<String,StringList> currentEntry : configurationMap.entrySet()) {
			globalPreferencesFieldMap.add(getFormFieldDefinition(context, currentEntry.getKey(),currentEntry.getValue()));
		}
		return globalPreferencesFieldMap;
	}
	
	protected Map<String, Object> getFormFieldDefinition(Context context, String fieldName, StringList fieldValue) throws FrameworkException {
		Map<String, Object> formFieldMap = new HashMap<String, Object>();
		
		HashMap<String, String> fieldSettingMap = new HashMap<String, String>();
		fieldSettingMap.put("Field Type", "program");
		fieldSettingMap.put("Input Type", "textarea");
		fieldSettingMap.put("Registered Suite", "AWL");
		fieldSettingMap.put("function", "getSubProductLineConfigFieldValue");
		fieldSettingMap.put("program", "AWLGlobalPreference");
		fieldSettingMap.put("fieldValue", FrameworkUtil.join(fieldValue, ","));
		
		
		formFieldMap.put("name", fieldName);
		formFieldMap.put("label", getI18NType(context, fieldName));
	    formFieldMap.put("settings", fieldSettingMap);
	    return formFieldMap;
	}

	private String getI18NType(Context context, String fieldName) throws FrameworkException {
		return AWLUtil.strcat(AWLPropertyUtil.getTypeI18NString(context, fieldName, true), " (" , fieldName, ")");
	}

	@SuppressWarnings("unchecked")
	public String getSubProductLineConfigFieldValue(Context context, String[] args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>) JPO.unpackArgs(args);
		Map<?,?> fieldMap = (Map<?, ?>) programMap.get("fieldMap");
		Map<?,?> settingMap = (Map<?,?>) fieldMap.get("settings");
		String fieldValue = (String)settingMap.get("fieldValue");
		StringList subProductLineTypesSym = FrameworkUtil.split(fieldValue, ",");
		StringList display = new StringList(subProductLineTypesSym.size());
		for (String type : (List<String>)subProductLineTypesSym) {
			display.add(getI18NType(context, type));
		}
		return FrameworkUtil.join(display, "\n");
	}
	
	
	private Map<String, String> getNutritionFactsConfiguration(Context context) throws FrameworkException {
		List<NutritionElement> lNutritionFactsConfiguration =  NutritionFactsConfiguration.getNutriFactConfiguration(context);
		
		Map<String, List<NutritionElement>> mNutritionConfig = new HashMap<String, List<NutritionElement>>();
		List<NutritionElement> nutritionCodesList = new ArrayList<NutritionElement>();
		List<NutritionElement> vitaminCodesList = new ArrayList<NutritionElement>();
		for (NutritionElement nutritionElement : lNutritionFactsConfiguration) {
			if(AWLType.VITAMIN_CODES_MASTER_COPY.toString().equals(nutritionElement.getType())) {
				vitaminCodesList.add(nutritionElement);
			} else {
				nutritionCodesList.add(nutritionElement);
			}
		}
		mNutritionConfig.put(AWLType.VITAMIN_CODES_MASTER_COPY.toString(), vitaminCodesList);
		mNutritionConfig.put(AWLType.NUTRIENT_CODES_MASTER_COPY.toString(), nutritionCodesList);
		
		
		Map<String, String> mReturnInfo = new HashMap<String, String>();
		for (Map.Entry<String, List<NutritionElement>> entry : mNutritionConfig.entrySet())
		{
			List<NutritionElement> currentStructuredElement = entry.getValue();
			StringBuilder strStructureInfo = new StringBuilder(50);
			String strElementType = entry.getKey();
			strStructureInfo.append(getI18NType(context, strElementType));
			StringList slNutritionInfo = new StringList();
			for (NutritionElement nutritionElement : currentStructuredElement) {
				String strLabelValue = nutritionElement.getLabel(context, true);
				String strGS1Key = nutritionElement.getGS1Key();
				StringBuilder strNutrition = new StringBuilder(100);
				strNutrition.append(strLabelValue)
								.append(" (")
								.append(strGS1Key)
								.append(")");
				slNutritionInfo.add(strNutrition.toString());
			}
			mReturnInfo.put(strStructureInfo.toString(), FrameworkUtil.join(slNutritionInfo, "\n"));
		}
		return mReturnInfo;
	}	
	
	@SuppressWarnings("unchecked")
	public MapList getNutritionFactsConfigFields(Context context, String[] args) throws Exception {
		MapList globalPreferencesSEFieldMap = new MapList();
		Map<String, String> configurationMap = getNutritionFactsConfiguration(context);
		
		for (Map.Entry<String,String> currentEntry : configurationMap.entrySet()) {
			globalPreferencesSEFieldMap.add(getNutritionFactsConfigFieldDefinition(context, currentEntry.getKey(),currentEntry.getValue()));
		}
		return globalPreferencesSEFieldMap;
	}
	
	protected Map<String, Object> getNutritionFactsConfigFieldDefinition(Context context, String fieldName, String fieldValue) throws FrameworkException {
		Map<String, Object> formFieldMap = new HashMap<String, Object>();
		
		HashMap<String, String> fieldSettingMap = new HashMap<String, String>();
		fieldSettingMap.put("Field Type", "program");
		fieldSettingMap.put("Input Type", "textarea");
		fieldSettingMap.put("Registered Suite", "AWL");
		fieldSettingMap.put("function", "getNutritionElementConfigFieldValue");
		fieldSettingMap.put("program", "AWLGlobalPreference");
		fieldSettingMap.put("fieldValue", fieldValue);
		
		
		formFieldMap.put("name", fieldName);
		formFieldMap.put("label", fieldName);
	    formFieldMap.put("settings", fieldSettingMap);
	    return formFieldMap;
	}
	
	public String getNutritionElementConfigFieldValue(Context context, String[] args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>) JPO.unpackArgs(args);
		Map<?,?> fieldMap = (Map<?, ?>) programMap.get("fieldMap");
		Map<?,?> settingMap = (Map<?,?>) fieldMap.get("settings");
		return (String)settingMap.get("fieldValue");
	}
}
