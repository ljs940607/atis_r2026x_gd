
/* emxGanttBase.java

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxGanttBase.java.rca 1.6 Wed Oct 22 16:21:23 2008 przemek Experimental przemek $
*/

import java.awt.Color;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.Collections;
import java.util.Comparator;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonValue;

import com.matrixone.apps.common.Task;
import com.matrixone.apps.common.WorkCalendar;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.DateUtil;
import com.matrixone.apps.domain.util.DebugUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.StringUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.GanttChart;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralConstants.CustomColumnDataTypeEnum;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.ProjectSpace;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;
import matrix.db.BusinessObjectWithSelect;

/**
 * The <code>emxTask</code> class represents the Gantt JPO functionality.
 */
@SuppressWarnings("PMD.JOBBuildDetector1")

public class emxGanttBase_mxJPO extends emxTaskBase_mxJPO {
   
	private String dateStyle = "M d, Y"; 
	private boolean isCustomizedEnvironment = false;
	private SimpleDateFormat dateFormat = null;
	/**
     *Parameterized constructor.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			Array of parameters which are needed by the JPO.
     * 
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of constructor fail to execute.
     */
    public emxGanttBase_mxJPO (Context context, String[] argumentArray) throws Exception {
        super(context,argumentArray);
        if (argumentArray != null && argumentArray.length > 0){
            setId(argumentArray[0]);
        }
		if(eMatrixDateFormat.isTimeDisplay()){
			dateFormat	= (SimpleDateFormat)SimpleDateFormat.getDateTimeInstance(eMatrixDateFormat.getEMatrixDisplayDateFormat(), eMatrixDateFormat.getEMatrixDisplayDateFormat(), context.getLocale());
		} else {
			dateFormat	= (SimpleDateFormat)SimpleDateFormat.getDateInstance(eMatrixDateFormat.getEMatrixDisplayDateFormat(), context.getLocale());
		}

		
		/*
		 * Ideally datestyle should be decided using SimpleDateFormat.toLocalizedPattern method. 
		 * But since Extjs and Java differ in there date format pattern for the same locale, below switch-case is used to set the date format pattern.
		 * One major disadvantage of having this is, it will not consider emxSystem datetime format properties. 
		 * emxFramework.DateTime.DisplayFormat = MEDIUM
		 * emxFramework.DateTime.DisplayTime = false
		 * */
		
		String ctxLang = GanttChart.getLanguage(context);;
		switch (ctxLang) {
		case "ru" : 
			dateStyle = "d.m.Y"; break;	
		case "de" : 
			dateStyle = "d.m.Y"; break;				
		case "en" :				
			dateStyle = "M d, Y"; break;
		case "es" :
			dateStyle = "d-M-Y"; break;
		case "fr" :
			dateStyle = "d M. Y"; break;
		case "it" :
			dateStyle = "d-M-Y"; break;		
		case "ja" :
			dateStyle = "Y/m/d"; break;		
		case "zh" :
			dateStyle = "Y-m-d"; break;		
		} 
    }
    
    public void saveCustomData(Context context, String[] argumentArray) throws Exception {
    	
    	MapList customColumnMapList = JPO.unpackArgs(argumentArray);
    	 
    	for(int i=0; i<customColumnMapList.size(); i++) {
    		Map customColumnMap = (Map)customColumnMapList.get(i);
    		Iterator<String> iterator = customColumnMap.keySet().iterator();
    		while(iterator.hasNext()) {
    			String key = (String)iterator.next();
    			String value = (String)customColumnMap.get(key);
    			System.out.println("key... " + key);
    			System.out.println("value... " + value);
    		}
    		System.out.println("***************************************************************");
    	}
    }
    /**
     * This method returns the stringlist of bus selectable depends on which view is
     * rendering in Gantt chart.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			this contains map which contains instance of view which is going 
     * 			to be rendered in Gantt chart.
     * 
     * @return	relSelectableList
     * 			StringList of custom selectable which is added by customer to be
     * 			rendered in Gantt chart..
     * 
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
	 * @Deprecated : please use getCustomColumnSettingsMapList() to add selectable
	 * 				 along with other configuration. 
     */
     
	public StringList getBusSelectableList(Context context,String[] argumentArray) throws Exception {
    	
		String ganttViewName = (String)JPO.unpackArgs(argumentArray);
    	StringList busSelectableList = new StringList();
	    return busSelectableList;
    }
	/**
     * This method returns the stringlist of rel selectable.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			It contains name of Gantt chart view which is going to be rendered.
     * 
     * @return	relSelectableList
     * 			StringList of selectables which are needed by view which will be
     * 			rendered in Gantt chart..
     * 
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
     */
    public StringList getRelSelectableList(Context context,String[] argumentArray) throws Exception {
    	
    	String ganttViewName = JPO.unpackArgs(argumentArray);
    	StringList relSelectableList   = new StringList();
        
    	return relSelectableList;
    }
    /**
     * This method compute deviation for given task and returns it.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			Array of parameters which are needed calculate the deviation for a task.
     * @return	deviationDays
     * 			Deviation for the task, which values are passed to it.
     * 
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
     */
    public Map getTaskDeviationValue(Context context,String[] argumentArray) throws Exception {
    	
    	Map<String,String> taskDeviationMap = new HashMap<String,String>(); 
    	String languageString 	= context.getSession().getLanguage();
		if("pt".equalsIgnoreCase(languageString)) { 
			languageString = "pt-BR";
		}
		//System.out.println("languageString... "+ languageString);
    	String durationUnit	  	= ProgramCentralUtil.getPMCI18nString(context,"emxProgramCentral.DurationUnits.Days",languageString);
    	durationUnit		  	= ProgramCentralConstants.SPACE + durationUnit;
    	//System.out.println("durationUnit... "+ durationUnit);
    	MapList taskInfoMapList	= (MapList)JPO.unpackArgs(argumentArray);
    	
    	for(int i=0;i<taskInfoMapList.size();i++ ) {
    		
    		WorkCalendar taskCalendar = null;
    		Map taskInfoMap 		= (Map)taskInfoMapList.get(i);
	    	String taskId			= (String)taskInfoMap.get(DomainConstants.SELECT_ID);
	    	String taskCalendarId	= (String)taskInfoMap.get(ProgramCentralConstants.SELECT_CALENDAR_ID);
	    	String taskCalendarDate	= (String)taskInfoMap.get(ProgramCentralConstants.SELECT_CALENDAR_DATE);
	    	
	    	float percentComplete	= (float) Task.parseToDouble((String)taskInfoMap.get(ProgramCentralConstants.SELECT_ATTRIBUTE_PERCENT_COMPLETE));
	    	Date estimatedStartDate	= eMatrixDateFormat.getJavaDate((String)taskInfoMap.get(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_START_DATE));
			float estimatedDuration	= (float) Task.parseToDouble((String)taskInfoMap.get(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_DURATION_IV));
	    	
	    	if (ProgramCentralUtil.isNotNullString(taskCalendarId)) {
	    		taskCalendar = WorkCalendar.getCalendarObject(context,taskCalendarId, taskCalendarDate);
	    	}
	    	Calendar currentDayCalendar	=	Calendar.getInstance();
	    	Date today					=	currentDayCalendar.getTime();
			String deviationDays		=	"0";
			
			Date estimatedStartDateOnly	=	ProgramCentralUtil.removeTimeFromDate(context,estimatedStartDate);
			Date curentDateOnly			=	ProgramCentralUtil.removeTimeFromDate(context,today);
			int dateCompareValue		=	estimatedStartDateOnly.compareTo(curentDateOnly);
			
			//Don't consider tasks  
			//1:which are already completed.
			//2:which ESD is today.
			//3:which ESD is today in future and has percentComplete=0.
			if (percentComplete == 100 || dateCompareValue == 0	|| (dateCompareValue > 0 && percentComplete == 0)) {
				deviationDays	=   "0";
			} else if (estimatedStartDateOnly.after(curentDateOnly) && percentComplete > 0) {
				deviationDays =	getForwardDeviation(context,estimatedStartDateOnly,estimatedDuration,percentComplete,taskCalendar);
			} else {
				deviationDays =	getBackwardDeviation(context,estimatedStartDateOnly,estimatedDuration,percentComplete,taskCalendar);
			}
			
			deviationDays+= durationUnit;
			
			taskDeviationMap.put(taskId,deviationDays);
	    }
    	return taskDeviationMap;
    }
    /**
     * This method calculates deviation for task which ESD in future and task has been started.
     *  
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	estimatedStartDate
     * 			Estimated start date of the task for which deviation is going to be calculated.
     * @param 	estimatedDuration
     * 			Estimated duration of the task for which deviation is going to be calculated.
     * @param 	percentComplete
     * 			Percent completed till today for the task.
     * 
     * @param 	taskCalendar
     * 			Calendar connected to the task, if any. else it is null.
     *  
     * @return	Forward deviation which has been calculated.
     * 
     * @throws 	FrameworkException
     * 	 		Exception can be thrown in case of method fail to execute.
     */
    protected String getForwardDeviation(Context context,Date estimatedStartDate,float estimatedDuration,
    										float percentComplete,WorkCalendar taskCalendar) throws FrameworkException {
    	
    	long deviationDays				=	0;
    	long deviationInMiliseconds		=	0;
    	Date referenceDate 				=	null;
    	Calendar currentDateCalendar	=	Calendar.getInstance();
		
		//for forward deviation, skip today and do calculation from tomorrow.
		currentDateCalendar.add(Calendar.DAY_OF_WEEK,1);
		Date tomorrowDateOnly		=	ProgramCentralUtil.removeTimeFromDate(context,currentDateCalendar.getTime());
		float deviationInFloat		=	(percentComplete*estimatedDuration/100);
		double deviationFractionValue	=	deviationInFloat - Math.floor(deviationInFloat);
		
		if (deviationFractionValue >= 0.5) {
			//Ceil the value if greater than/equal to 0.5
			deviationInFloat++;
		}
		deviationDays	=	(long)deviationInFloat;
		
		
		if (taskCalendar != null) {
			referenceDate	=	taskCalendar.computeFinishDate(context,estimatedStartDate,deviationDays);
		} else {
			if (deviationDays > 0) {
				deviationInMiliseconds	=	deviationDays*24*60*60*1000;
			}
			referenceDate	=	DateUtil.computeFinishDate(estimatedStartDate,deviationInMiliseconds);
		}
		deviationDays	=	DateUtil.computeDuration(tomorrowDateOnly,referenceDate);
		
		return ProgramCentralConstants.EMPTY_STRING+deviationDays;
    }
    /**
     * This method calculates deviation for task which ESD in past.
     *  
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	estimatedStartDate
     * 			Estimated start date of the task for which deviation is going to be calculated.
     * @param 	estimatedDuration
     * 			Estimated duation of the task for which deviation is going to be calculated.
     * @param 	percentComplete
     * 			Percent completed till today for the task.
     * 
     * @param 	taskCalendar
     * 			Calendar connected to the task, if any. else it is null.
     *  
     * @return	Backword deviation which has been calcualted. Value returns with negative sign.
     * 
     * @throws 	FrameworkException
     * 	 		Exception can be thrown in case of method fail to execute.
     */
    protected String getBackwardDeviation(Context context,Date estimatedStartDate,float estimatedDuration,
											float percentComplete,WorkCalendar taskCalendar) throws FrameworkException {
    	
    	Date today						=	Calendar.getInstance().getTime();
    	Date curentDateOnly				=	ProgramCentralUtil.removeTimeFromDate(context,today);
    	long deviationDays				=	0;
    	long deviationInMiliseconds		=	0;
    	Date referenceDate 				=	null;
    	Calendar currentDateCalendar	=	Calendar.getInstance();
		Calendar referenceDateCalendar	=	Calendar.getInstance();
		
		//for backword deviation, skip today and do calculation till yesterday.
		currentDateCalendar.add(Calendar.DAY_OF_WEEK,-1);
		Date yesterDay	=	ProgramCentralUtil.removeTimeFromDate(context,currentDateCalendar.getTime());	
		
		if ((percentComplete == 0 || estimatedDuration == 0)) {
			if (taskCalendar != null) {
				deviationDays	=	taskCalendar.computeDuration(context,estimatedStartDate,yesterDay);
			} else {
				deviationDays	=	DateUtil.computeDuration(estimatedStartDate,yesterDay);
			}				
		} else {
			float deviationInFloat	=	(percentComplete*estimatedDuration/100);
			double deviationFractionValue	=	deviationInFloat - Math.floor(deviationInFloat);
			
			if (deviationFractionValue >= 0.5) {
				//Ceil the value if greater than/equal to 0.5
				deviationInFloat++;
			}
			deviationDays	=	(long)deviationInFloat;
			
			if (taskCalendar != null) {
				referenceDate	=	taskCalendar.computeFinishDate(context,estimatedStartDate,deviationDays);
				referenceDateCalendar.setTime(referenceDate);
				deviationDays	=	taskCalendar.computeDuration(context,referenceDateCalendar.getTime(),yesterDay);
			} else {
				if (deviationDays > 0) {
					//Task finishes at end of the day, hence don't consider finish date for deviation.
					deviationDays++;
					deviationInMiliseconds	=	deviationDays*24*60*60*1000;
				}
				referenceDate	=	DateUtil.computeFinishDate(estimatedStartDate,deviationInMiliseconds);
				referenceDateCalendar.setTime(referenceDate);
				deviationDays	=	DateUtil.computeDuration(referenceDateCalendar.getTime(),yesterDay);
			}
			
			Date referenceDateOnly	=	ProgramCentralUtil.removeTimeFromDate(context,referenceDateCalendar.getTime());
			
			//If reference date is today/after today,make deviation 0.
			if(referenceDateOnly.compareTo(curentDateOnly) >=0) {
				return "0";
			}
		}
		return ProgramCentralConstants.HYPHEN + deviationDays;
    }
    /**
     * This method populates and returns a map. This map holds deviation range as key and 
     * empty string as a value.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			Array which holds a map in which deviation smallest and biggest value is available.
     * 
     * @return	deviationFilterMap
     * 			Map which holds deviation range as key and empty string as a value. Value for
     * 			this map will get populated when that range value is selected by user in Gantt
     * 			filter. 
     * 
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
     */
    public Set<String> getDeviationRangeMap(Context context,String[] argumentArray) throws Exception {
    	
    	Map<String,Integer> deviationValueMap	=	(Map<String,Integer>)JPO.unpackArgs(argumentArray);
    	Set<String> deviationFilterSet	=	new LinkedHashSet<String>();
    	String languageString		 =	context.getSession().getLanguage();
    	String durationUnit			 =	ProgramCentralUtil.getPMCI18nString(context,"emxProgramCentral.DurationUnits.Days",languageString);
		durationUnit				 =	ProgramCentralConstants.SPACE + durationUnit;
		
    	int smallestValue	=	deviationValueMap.get(ProgramCentralConstants.SMALLEST_DEVIATION_VALUE);
	  	int biggestValue	=	deviationValueMap.get(ProgramCentralConstants.BIGGEST_DEVIATION_VALUE);
	  	int rangeValue		=	biggestValue - smallestValue;
	  	int deviationDiff	=	rangeValue/4;
	  	
	  	if (smallestValue == biggestValue || smallestValue >= -4 || (rangeValue <= 4)) {
	  		String deviationRange	=	smallestValue + ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR + biggestValue + durationUnit;
	  		deviationFilterSet.add(deviationRange);
	  	} else {

	  		String deviationRange1	=	smallestValue + ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR + (smallestValue+deviationDiff) + durationUnit;  
	  		String deviationRange2	=	(smallestValue+deviationDiff)+1 + ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR + (smallestValue+deviationDiff*2) + durationUnit;
	  		String deviationRange3	=	(smallestValue+deviationDiff*2)+1 + ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR + (smallestValue+deviationDiff*3) + durationUnit;
	  		String deviationRange4	=	(smallestValue+deviationDiff*3)+1 + ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR + biggestValue + durationUnit;
	  
			deviationFilterSet.add(deviationRange1);
			deviationFilterSet.add(deviationRange2);
			deviationFilterSet.add(deviationRange3);
			deviationFilterSet.add(deviationRange4);
	  	}
  	  	return deviationFilterSet;
    }
    /**
     * This method returns map which holds the deviation value as a key and color for that range
     * as a value.
     *  
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			Array of parameters which are needed to  populate the deviationColorMap.
     * @return	deviationColorMap
     * 			map which holds the deviation value as a key and color for that range as a value.
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
     */
    public Map<String,Color> getDeviationColorMap(Context context,String[] argumentArray) throws Exception {
    	
    	List<String> deviationRangeList		=	(List<String>)JPO.unpackArgs(argumentArray);
    	Map<String,Color> deviationColorMap	=	new LinkedHashMap<String,Color>();
    	/*int deviationFilterSize	=	deviationRangeList.size();
    	
    	if (deviationFilterSize == 1) {
    		deviationColorMap.put(deviationRangeList.get(0),new Color(250,46,46));
    	} else if (deviationFilterSize == 2) {
    		deviationColorMap.put(deviationRangeList.get(0),new Color(250,46,46));
    		deviationColorMap.put(deviationRangeList.get(1),new Color(255,125,0));
    	} else if (deviationFilterSize == 3) {
    		deviationColorMap.put(deviationRangeList.get(0),new Color(250,46,46));
    		deviationColorMap.put(deviationRangeList.get(1),new Color(255,125,0));
    		deviationColorMap.put(deviationRangeList.get(2),new Color(255,175,0));
    	} else if (deviationFilterSize== 4) {
    		deviationColorMap.put(deviationRangeList.get(0),new Color(250,46,46));
    		deviationColorMap.put(deviationRangeList.get(1),new Color(255,125,0));
    		deviationColorMap.put(deviationRangeList.get(2),new Color(255,175,0));
    		deviationColorMap.put(deviationRangeList.get(3),new Color(190,247,129));
    	} else if (deviationFilterSize == 5) {
    		deviationColorMap.put(deviationRangeList.get(0),new Color(250,46,46));
    		deviationColorMap.put(deviationRangeList.get(1),new Color(255,125,0));
    		deviationColorMap.put(deviationRangeList.get(2),new Color(255,175,0));
    		deviationColorMap.put(deviationRangeList.get(3),new Color(190,247,129));
    		deviationColorMap.put(deviationRangeList.get(4),new Color(0,255,0));
    	} 
    	//Forward deviation color must be green every time.
    	boolean isForwardDeviationRange = isForwardDeviationRangeValue(context, deviationRangeList.get(deviationFilterSize-1));
    	if (isForwardDeviationRange) {
    		deviationColorMap.put(deviationRangeList.get(deviationFilterSize-1),new Color(0,255,0));
    	}*/
        return deviationColorMap;
    }
    /**
     * This method check weather given deviation range values is of forward deviation.
     *  
	 * @param		context			
	 * 						Context object which is used while fetching data related application.
     * @param 		deviationRangeValue
     * 						Range value of deviation which will be checked for forward deviation.
     * @return		isForwardDeviationRange
     * 						true, if given range value is of forward deviation else returns false.
     * 
	 * @throws 	Exception		
	 * 						Exception can be thrown in case of method fail to execute.
     */
    private boolean isForwardDeviationRangeValue(Context context,String deviationRangeValue) throws MatrixException {
    	
    	boolean isForwardDeviationRange = false;
    	/*String durationUnit		=	ProgramCentralUtil.getPMCI18nString(context,"emxProgramCentral.DurationUnits.Days",context.getSession().getLanguage());
    	deviationRangeValue	=	deviationRangeValue.substring(0,deviationRangeValue.indexOf(durationUnit));
		String[] deviationRangeArray =	deviationRangeValue.split(ProgramCentralConstants.DEVIATION_RANGE_SEPARATOR);
		int rangeStart		=	Integer.parseInt(deviationRangeArray[0].trim());
		int rangeFinish	=	Integer.parseInt(deviationRangeArray[1].trim());
		
		if(rangeStart >= 0 && rangeFinish >= 0) {
			isForwardDeviationRange	=	true;
		}*/ 
    	return isForwardDeviationRange;
    }
    /**
     * This method will populate and return list of colors which will be applied on Gantt chart
     * tasks when user clicks on color icon of Gantt chart filter.
     *  
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			Paramers which are need to populate color list.
     * @return	colorList
     * 			This list will contains colors which wil be applied on Gantt chart tasks.
     */
    public List<Color> getColorList(Context context,String[] argumentArray) {
    	
    	List<Color> colorList	=	new ArrayList<Color>();
		
		/*colorList.add(new Color(166,0,166));
		colorList.add(new Color(57,20,175));
		colorList.add(new Color(0,204,0));
		colorList.add(new Color(204,246,0));
		colorList.add(new Color(255,211,0));
		colorList.add(new Color(255,146,0));
		colorList.add(new Color(176,25,28));
		colorList.add(new Color(0,255,255));
		colorList.add(new Color(255,215,0));
		colorList.add(new Color(255,28,180));
		colorList.add(new Color(0,100,0));
		colorList.add(new Color(128,128,0));
		colorList.add(new Color(47,79,79));
		colorList.add(new Color(123,104,238));
		colorList.add(new Color(11,97,164));*/
		
		return colorList;
    }
    
	private JsonObjectBuilder getColumn(
			Context context, 
			int columnIndex,
			String name, 
			String header,
			String xType, 
			String fieldType, 
			String format,
			String align,
			String selectable,
			boolean editable,
			boolean excludeInRefinement,
			int width,
			JsonObject editor,
			boolean isDataIndexNeeded,
			boolean draggable,
			Map<String,Map<String,String>> columnConfigMap) throws MatrixException {

		JsonObjectBuilder columnConfig = Json.createObjectBuilder();
		columnConfig.add("columnIndex",				columnIndex);
		columnConfig.add("name", 					name);
		columnConfig.add("header",					header);
		if(isDataIndexNeeded){
			columnConfig.add("dataIndex",				name);
		}
		/*if("HasTaskCalendar".equalsIgnoreCase(name)) {
			columnConfig.add("bodyCls","colLinesCls");
			columnConfig.add("userCls","iconCalendarHeader");
			
		}*/
		columnConfig.add("xtype",					xType);
		columnConfig.add("columnDataType",			fieldType);
		columnConfig.add("format", 					format);
		columnConfig.add("align", 					align);
		columnConfig.add("selectable",				selectable);
		columnConfig.add("editable",				editable);
		columnConfig.add("excludeInRefinement",		excludeInRefinement);
		//width will get override by setColumnConfig().		
		columnConfig.add("width",					width);	

		columnConfig.add("draggable",				draggable);
		if(editor!=null) {
			columnConfig.add("editor",					editor);
		}
		//Set columnIndex, hidden and width values persisted for the column.
		setColumnConfig(context,columnConfigMap, name, columnConfig);
		return columnConfig;
	}

	public JsonArray getColumns (Context context, String[] args) throws FrameworkException {
		try {
			int displayDateFormat = eMatrixDateFormat.getEMatrixDisplayDateFormat();
			
			Map<String,String> jpoArgumentMap  = (Map<String,String>) JPO.unpackArgs(args);
			String objectId			= jpoArgumentMap.get("objectId");
			String referenceId			= jpoArgumentMap.get("referenceId");
			String viewId			= jpoArgumentMap.get("viewId");
			String clientTimezone			= jpoArgumentMap.get("clientTimezone");
			String ctxLangugage 	= context.getLocale().getLanguage();
			
			boolean showCompletionTypeColumn = com.dassault_systemes.enovia.dpm.ProjectSpace.getExpressionValue(context, "DPM_TaskCompletionType", false);
			
			if("pt".equalsIgnoreCase(ctxLangugage)) {
				ctxLangugage = "pt-BR";
			}
			//System.out.println("ctxLangugage... "+ ctxLangugage);
			StringList objectSelects = new StringList();
	        objectSelects.add(ProgramCentralConstants.SELECT_KINDOF_PROJECT_SPACE);
	        objectSelects.add(ProgramCentralConstants.SELECT_KINDOF_EXPERIMENT_PROJECT);
	        objectSelects.add(ProgramCentralConstants.SELECT_KINDOF_PROJECT_BASELINE);
	        objectSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_PROJECT_SCHEDULE_BASED_ON);
	        objectSelects.add(ProgramCentralConstants.SELECT_GANTT_CONFIG_FROM_PROJECT);
			
			DomainObject Experiment = DomainObject.newInstance(context, objectId);
			BusinessObjectWithSelect projBws = Experiment.select(context, objectSelects);
			String isKindOfProjectSpace = projBws.getSelectData(ProgramCentralConstants.SELECT_KINDOF_PROJECT_SPACE);
			String isKindOfExperiment = projBws.getSelectData(ProgramCentralConstants.SELECT_KINDOF_EXPERIMENT_PROJECT);
			String isKindOfBaseline = projBws.getSelectData(ProgramCentralConstants.SELECT_KINDOF_PROJECT_BASELINE);
			String scheduledBasedOn 	= projBws.getSelectData(ProgramCentralConstants.SELECT_ATTRIBUTE_PROJECT_SCHEDULE_BASED_ON);
			String ganttCompressedConfig = projBws.getSelectData(ProgramCentralConstants.SELECT_GANTT_CONFIG_FROM_PROJECT);
			
			Map<String,Map<String,String>> columnConfigMap = getGanttColumnCofigMap(context, ganttCompressedConfig);
			
			/******************* i18n Column Names : Start **********************************/
			String lName 				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Name", 				ctxLangugage); 
			String lType 				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Type", 				ctxLangugage); 
			String lStatus 				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Status", 				ctxLangugage);
			String lId					= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.ID", 					ctxLangugage); 
			String lDependency 			= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Dependency", 			ctxLangugage); 
			String lState 				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.State", 				ctxLangugage); 
			String lPercentDone 		= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.PercentageComplete",	ctxLangugage); 
			
			String lEstimatedGroup		= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Estimated",				ctxLangugage); 
			String lDuration 			= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Duration", 			ctxLangugage); 
			String lStart				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.StartDate",			ctxLangugage); 
			String lFinish 				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.EndDate",				ctxLangugage); 

			String lBaselineGroup		= computeForecastHeader(context , objectId, clientTimezone);
					//ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Actual",				ctxLangugage); 
			String lBaselineDuration	= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.ActualDuration",		ctxLangugage); 
			String lBaselineStart		= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.ActualStartDate",		ctxLangugage); 
			String lBaselineFinish		= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.ActualFinishDate",		ctxLangugage); 
			String lExpectedFinish		= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.ExpectedEndDate",		ctxLangugage); 
			String lAssignee			= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Assignee",				ctxLangugage); 
			String lNotes			    = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Notes",				ctxLangugage);
			String lDescription		    = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Description",ctxLangugage);
			String lFloatGroup 			= computeFloatHeader(context , objectId, clientTimezone);
			String lFloat				= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Schedule.FreeFloat",				ctxLangugage);
			String lTotalFloat			= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Schedule.TotalFloat",				ctxLangugage);
			String calendarLabel    	= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Calendar",ctxLangugage);
			String completionTypeLabel 	= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.WBS.TaskCompletionType",ctxLangugage);

			/******************* i18n Column Names : End **********************************/

			String stringType 	= String.class.getSimpleName();
			String booleanType 	= Boolean.class.getSimpleName();
			String dateType 	= Date.class.getSimpleName();
			String numberType 	= Number.class.getSimpleName();
			
			/******************* Editors : Start **********************************/
			
			JsonObjectBuilder emptyEditor = Json.createObjectBuilder();
			JsonObjectBuilder durationEditor = Json.createObjectBuilder();
			durationEditor.add("minValue", 0.01);
			//durationEditor.add("maxValue", 79999);
			
			JsonObjectBuilder percentdoneEditor = Json.createObjectBuilder();
			
			percentdoneEditor.add("minValue", 0);
			percentdoneEditor.add("maxValue", 100);
			percentdoneEditor.add("step", 10);
			percentdoneEditor.add("editable", false);
			//percentdoneEditor.add("inputValue", 10);
	
			 
			
			
			JsonObjectBuilder textEditor = Json.createObjectBuilder();
			textEditor.add("xtype",	"textfield");

			JsonObjectBuilder textareaEditor = Json.createObjectBuilder();
			textareaEditor.add("xtype",	"textareafield");

			/******************* Editors : End **********************************/
			
			JsonArrayBuilder columns 	= Json.createArrayBuilder();
			JsonObjectBuilder name				= getColumn(context,0, "Name",					lName, 				"namecolumn", 				"textfield",	"",			"left",		ProgramCentralConstants.SELECT_NAME, 									true, 		true,	350, 	textEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder status			= getColumn(context,1, "Status",				lStatus,		"",							"",				"",			"",			ProgramCentralConstants.EMPTY_STRING, 									false, 		false,	25, 	emptyEditor.build(),true,true,columnConfigMap);
			JsonObjectBuilder type				= getColumn(context,2, "Type",					lType,				"", 						"textfield",	"",			"center",	ProgramCentralConstants.SELECT_TYPE,									false,		false,	100, 	emptyEditor.build(),true,true,columnConfigMap);
			JsonObjectBuilder current 			= getColumn(context,3, "State",				lState,				"", 						"textfield",	"",			"center",	ProgramCentralConstants.SELECT_CURRENT,									false,	 	false,	100,	emptyEditor.build(),true,true,columnConfigMap);

			JsonObjectBuilder id				= getColumn(context,4, "TaskSequenceId",		lId,				"", 						"numberfield",	"",			"center",	ProgramCentralConstants.TASK_SEQUENCE_NUMBER,							false,		true,	100,	emptyEditor.build(),true,true,columnConfigMap);
			JsonObjectBuilder dependency		= getColumn(context,5, "Dependency",			lDependency,		"predecessorcolumn",		"",	"",			"center",	ProgramCentralConstants.EMPTY_STRING,									true,		true,	100,	emptyEditor.build(),true,true,columnConfigMap);
//			JsonObjectBuilder dependency		= getColumn(-1, "Dependency",			lDependency,		"",							"textfield",	"",			"center",	ProgramCentralConstants.EMPTY_STRING,									true,		true,	100,	textEditor.build(),true);

			JsonObjectBuilder percentDone 		= getColumn(context,6, "PercentDone",			lPercentDone,		"percentdonecolumn",		"numberfield",	"0.0",		"center",	ProgramCentralConstants.SELECT_ATTRIBUTE_PERCENT_COMPLETE,				true,		false,	100,	percentdoneEditor.build(),true,true,columnConfigMap);

			JsonObjectBuilder calendar			= getColumn(context,7, "DPMTaskCalendarName", calendarLabel, 		"",  "textfield",	"",	 "center",	"",	false,	false,	150,	null,true,true,columnConfigMap);

			JsonObjectBuilder duration			= getColumn(context,8, "Duration",				lDuration,			"durationcolumn", 			"numberfield",	"0.00",		"center",	ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_DURATION_IV,	false,		false,	110,	durationEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder start				= getColumn(context,9, "StartDate",			lStart,				"startdatecolumn", 			"datefield",	dateStyle,	"center",	ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_START_DATE,		false,		false,	120,	emptyEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder finish 			= getColumn(context,10, "EndDate",				lFinish,			"enddatecolumn", 			"datefield",	dateStyle,	"center",	ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_FINISH_DATE,	false,		false,	120,	emptyEditor.build(),true,false,columnConfigMap);
			
			JsonObjectBuilder actualDuration	= getColumn(context,11, "ActualDuration",		lDuration,			"",			"numberfield",	"0.00",		"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	null,true,false,columnConfigMap);
			JsonObjectBuilder actualStart		= getColumn(context,12, "ActualStartDate",			lStart,				"datecolumn",	"datefield",	dateStyle,	"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	null,true,false,columnConfigMap);
			JsonObjectBuilder actualFinish 		= getColumn(context,13, "ActualFinishDate",			lFinish,			"datecolumn",	"datefield",	dateStyle,	"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	null,true,false,columnConfigMap);
			
			JsonObjectBuilder baselineDuration	= getColumn(context,14, "BaselineDuration",		lDuration,			"", 						"numberfield",	"0.00",		"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder baselineStart		= getColumn(context,15, "BaselineStartDate",	lStart,				"baselinestartdatecolumn",	"datefield",	dateStyle,	"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder baselineEnd 		= getColumn(context,16, "BaselineEndDate",		lFinish,			"baselineenddatecolumn",	"datefield",	dateStyle,	"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder expectedEndDate	= getColumn(context,17, "ExpectedEndDate",		lExpectedFinish,	"datecolumn",               "datefield",	dateStyle,	"center",	ProgramCentralConstants.ATTRIBUTE_EXPECTED_END_DATE,					false,		false,	100,	emptyEditor.build(),true,true,columnConfigMap);

			JsonObjectBuilder freeFloat			= getColumn(context,18, "FreeFloat",			lFloat,			"", 						"textfield",	"",			"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,false,columnConfigMap);
			JsonObjectBuilder totalFloat		= getColumn(context,19, "TotalFloat",			lTotalFloat,			"", 						"textfield",	"",			"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,false,columnConfigMap);
			
			JsonObjectBuilder assignee 			= getColumn(context,20, "Assignee",				lAssignee,			"", 						"textfield",	"",			"center",	ProgramCentralConstants.EMPTY_STRING,									false,		false,	100,	emptyEditor.build(),true,true,columnConfigMap);
			JsonObjectBuilder taskNotes			= getColumn(context,21, "TaskNotes",			lNotes, 				"notecolumn", 				"",	"",			"",		"", 									true, 		true,	100, 	null,false,true,columnConfigMap);
			JsonObjectBuilder description		= getColumn(context,22, "Description",          lDescription,	    "",	" textareafield",	"",			"left",		ProgramCentralConstants.SELECT_DESCRIPTION, true, 		true,	100, 	textareaEditor.build(),true,true,columnConfigMap);//	true, 		true,	100, 	null,false);
			JsonObjectBuilder completionType	= getColumn(context,23, "TaskCompletionType", completionTypeLabel,	"",	"textfield",	"",			"center",	ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_COMPLETION_TYPE,									false,		false,	100, 	null,true,true,columnConfigMap);
			//JsonObjectBuilder constraintType	= getColumn(context,24, "ConstraintType",		"ConstraintType", 				"constrainttypecolumn", 				"textfield",	"",			"left",		"Constraint Type", 									false, 		true,	100,emptyEditor.build(),true,true,columnConfigMap);
			//JsonObjectBuilder constraintDate	= getColumn(context,25, "ConstraintDate",		"ConstraintDate", 				"constraintdatecolumn", 				"textfield",	dateStyle,			"left",		"Constraint Date", 									false, 		true,	100,emptyEditor.build(),true,true,columnConfigMap);
			
			//constraintType.add("hidden", true);
			//constraintDate.add("hidden", true);
			
			if("True".equalsIgnoreCase(isKindOfExperiment) || "True".equalsIgnoreCase(isKindOfBaseline)) {
				actualDuration.add("hidden", true);
				actualStart.add("hidden", true);
				actualFinish.add("hidden", true);
			}
			if(ProgramCentralConstants.VIEW_WBS.equals(viewId) && "True".equalsIgnoreCase(isKindOfExperiment) && "Estimated".equalsIgnoreCase(scheduledBasedOn)) {
				percentDone.add("hidden",true);
			}

			if(ProgramCentralConstants.VIEW_WBS.equals(viewId)
					|| ProgramCentralConstants.VIEW_BASELINE_WBS.equals(viewId)) {
				baselineDuration.add("hidden", true);
				baselineStart.add("hidden", true);
				baselineEnd.add("hidden", true);
				expectedEndDate.add("hidden", true);
				
				if(ProgramCentralConstants.VIEW_BASELINE_WBS.equals(viewId)){
					percentDone.add("hidden", true);
					totalFloat.add("hidden", true);
					freeFloat.add("hidden", true);
					
					actualDuration.add("hidden", true);
					actualStart.add("hidden", true);
					actualFinish.add("hidden", true);
				}
			} 
			else if (ProgramCentralConstants.VIEW_ACTUAL.equals(viewId)) { 
				lEstimatedGroup = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Actual", ctxLangugage); 

				//Deep copy of BaselineDuration in Duration 
				//TODO PA4: Find a better and short way to copy one JsonBuilder into another.
				JsonObject baselineDurationJson = baselineDuration.build();
				Set baselineDurationKeys = baselineDurationJson.keySet();
				for (Iterator iterator = baselineDurationKeys.iterator(); iterator.hasNext();) {
					String key = (String) iterator.next();
					Object value = baselineDurationJson.get(key);
					if (value instanceof String) {
						duration.add(key, (String) value);
					} else if (value instanceof JsonObject) {
						duration.add(key, (JsonObject) value);
				}
				}
				baselineDuration.add("hidden", true);
				baselineStart.add("hidden", true);
				baselineEnd.add("hidden", true);
				expectedEndDate.add("hidden", true);
				
			}  
			else if (ProgramCentralConstants.VIEW_PLAN_VERSUS_ACTUAL.equals(viewId)) { 
				lEstimatedGroup = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Estimated",	ctxLangugage); 
				lBaselineGroup 	= ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Actual",	ctxLangugage); 
			}  
			else if (ProgramCentralConstants.VIEW_BASELINE_VERSUS_CURRENT_BASELINE.equals(viewId) 
					|| ProgramCentralConstants.VIEW_BASELINE_VERSUS_CURRENT_BASELINE2.equals(viewId)) { 
				lEstimatedGroup = DomainObject.newInstance(context, objectId).getInfo(context, ProgramCentralConstants.SELECT_NAME); 
				if(UIUtil.isNotNullAndNotEmpty(referenceId)){
					lBaselineGroup = DomainObject.newInstance(context, referenceId).getInfo(context, ProgramCentralConstants.SELECT_NAME); 
					baselineDuration.add("hidden", true);					

					actualDuration.add("hidden", true);
					actualStart.add("hidden", true);
					actualFinish.add("hidden", true);
				}
			}  
			else if (ProgramCentralConstants.VIEW_EXPERIMENT_VERSUS_PROJECT.equals(viewId)) { 
				lEstimatedGroup = DomainObject.newInstance(context, objectId).getInfo(context, ProgramCentralConstants.SELECT_NAME); 
				if(UIUtil.isNotNullAndNotEmpty(referenceId)){
					lBaselineGroup = DomainObject.newInstance(context, referenceId).getInfo(context, ProgramCentralConstants.SELECT_NAME);
					baselineDuration.add("hidden", true);
					
					actualDuration.add("hidden", true);
					actualStart.add("hidden", true);
					actualFinish.add("hidden", true);
				} 
			}  
			else if (ProgramCentralConstants.VIEW_TEMPLATE_WBS.equals(viewId)) { 
				status.add("hidden", true);
				percentDone.add("hidden", true);
				start.add("hidden", true);
				finish.add("hidden", true);
				
				baselineDuration.add("hidden", true);
				baselineStart.add("hidden", true);
				baselineEnd.add("hidden", true);
				expectedEndDate.add("hidden", true);
				
				assignee.add("hidden", true);
				totalFloat.add("hidden", true);
				freeFloat.add("hidden", true);
				
				actualDuration.add("hidden", true);
				actualStart.add("hidden", true);
				actualFinish.add("hidden", true);
				
				calendar.add("hidden", true);
			}  
			else if (ProgramCentralConstants.VIEW_STATUS_REPORT.equals(viewId)) {
				status.add("hidden", true);
				type.add("hidden", true);
				current.add("hidden", true);
				id.add("hidden", true);
				dependency.add("hidden", true);
				percentDone.add("hidden", true);

				duration.add("hidden", true);
				start.add("hidden", true);
				finish.add("hidden", true);

				baselineDuration.add("hidden", true);
				baselineStart.add("hidden", true);
				baselineEnd.add("hidden", true);
				expectedEndDate.add("hidden", true);

				assignee.add("hidden", true);
                                description.add("hidden", true);
				totalFloat.add("hidden", true);
				freeFloat.add("hidden", true);
				taskNotes.add("hidden", true);
				
				actualDuration.add("hidden", true);
				actualStart.add("hidden", true);
				actualFinish.add("hidden", true);
				
				calendar.add("hidden", true);
			}  
			columns.add(name.build());
			if(!ProgramCentralConstants.VIEW_STATUS_REPORT.equals(viewId)) {
				columns.add(status.build());
				columns.add(type.build());
				//columns.add(constraintType.build());
				//columns.add(constraintDate.build());
				columns.add(current.build());
				columns.add(id.build());
				columns.add(dependency.build());
				columns.add(percentDone.build());
				columns.add(calendar.build());
	
				JsonArrayBuilder estimateGroup = Json.createArrayBuilder();
				JsonObject durationJson = duration.build();
				estimateGroup.add(durationJson);
				estimateGroup.add(start.build());
				estimateGroup.add(finish.build());
				int durationColumnIndex = durationJson.getInt("columnIndex");
				JsonObjectBuilder estimates = Json.createObjectBuilder();
				estimates.add("text", lEstimatedGroup);
				estimates.add("name", "EstimatedGroup");
				//Set columnIndex of first subcolumn 
				estimates.add("columnIndex", durationColumnIndex);
				estimates.add("columns", estimateGroup.build());
				setColumnConfig(context, columnConfigMap, "EstimatedGroup", estimates);
				columns.add(estimates.build());
				
				JsonArrayBuilder actualGroup  = Json.createArrayBuilder();
				JsonObject actualDurationJson = actualDuration.build();
				actualGroup.add(actualDurationJson);
				actualGroup.add(actualStart.build());
				actualGroup.add(actualFinish.build());
				int actualDurationColumnIndex = actualDurationJson.getInt("columnIndex");
				
				String actualGroupHeader = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Actual",	ctxLangugage);
				JsonObjectBuilder actual = Json.createObjectBuilder();
				actual.add("text",actualGroupHeader);
				actual.add("name", "ActualGroup");
				//Set columnIndex of first subcolumn
				actual.add("columnIndex", actualDurationColumnIndex);
				actual.add("columns", actualGroup.build());
				setColumnConfig(context, columnConfigMap, "BaselineGroup", actual);
				columns.add(actual.build());
	
				JsonArrayBuilder baselineGroup  = Json.createArrayBuilder();
				JsonObject baselineDurationJson = baselineDuration.build();
				baselineGroup.add(baselineDurationJson);
				baselineGroup.add(baselineStart.build());
				baselineGroup.add(baselineEnd.build());
				baselineGroup.add(expectedEndDate.build());
				int baselineDurationColumnIndex = baselineDurationJson.getInt("columnIndex");
				JsonObjectBuilder baseline = Json.createObjectBuilder();
				baseline.add("text", lBaselineGroup);
				baseline.add("name", "BaselineGroup");
				//Set columnIndex of first subcolumn
				baseline.add("columnIndex", baselineDurationColumnIndex);
				baseline.add("columns", baselineGroup.build());
				setColumnConfig(context, columnConfigMap, "BaselineGroup", baseline);
				columns.add(baseline.build());
				
				JsonArrayBuilder floatGroup = Json.createArrayBuilder();
				JsonObject totalFloatJson = totalFloat.build();
				floatGroup.add(totalFloatJson);
				floatGroup.add(freeFloat.build());
				int totalFloatColumnIndex = totalFloatJson.getInt("columnIndex");
				JsonObjectBuilder floats = Json.createObjectBuilder();
				floats.add("text", lFloatGroup);
				floats.add("name", "FloatGroup");
				//Set columnIndex of first subcolumn
				floats.add("columnIndex", totalFloatColumnIndex);
				floats.add("columns", floatGroup.build());
				setColumnConfig(context, columnConfigMap, "FloatGroup", floats);
				columns.add(floats.build());
	
			

				columns.add(assignee.build());
				columns.add(taskNotes.build());
				columns.add(description.build());
				if(showCompletionTypeColumn && "TRUE".equalsIgnoreCase(isKindOfProjectSpace) 
						&& "FALSE".equalsIgnoreCase(isKindOfExperiment) && "FALSE".equalsIgnoreCase(isKindOfBaseline)) {
				columns.add(completionType.build());
				}
				JsonArray customColumnArray = getCustomColumnArray(context, args, columnConfigMap);
				for(int i=0,size=customColumnArray.size(); i<size; i++) {
					columns.add(customColumnArray.get(i));
				}
			}
			
			//Sort columns with "columnIndex".
			List<JsonObject> columnJsonList = new ArrayList<>(columns.build().getValuesAs(JsonObject.class));
			ProgramCentralUtil.sortJsonListByField(context, columnJsonList, "columnIndex", "Integer");
			
		JsonArrayBuilder sortedColumnArrayBuilder = Json.createArrayBuilder();
			for(JsonObject columnJson : columnJsonList) {
				sortedColumnArrayBuilder.add(columnJson);
			}
			return sortedColumnArrayBuilder.build();
			
		} catch(Exception exception) {
			DebugUtil.debug("Exception ocurred in emxGanttBase_mxJPO.getColumns :: " + exception);
			throw new FrameworkException(exception);
		}
	}

	private String getTagForCustomColumn(Context context, String customColumnLabelKey) throws MatrixException {
		String customColumnField = ProgramCentralUtil.getPMCI18nString(context,customColumnLabelKey,"en");
		customColumnField = StringUtil.Replace(customColumnField,ProgramCentralConstants.SPACE,"_");
		return customColumnField;
	};
	public JsonArray getCustomColumnArray(Context context, String[] args) throws MatrixException {
		return getCustomColumnArray(context, args, null);
	}
	public JsonArray getCustomColumnArray(Context context, String[] args, Map<String,Map<String,String>> columnConfigMap) throws MatrixException {

		try {
			JsonArrayBuilder customColumnArray = Json.createArrayBuilder(); 
			MapList customColumnSettingsMapList = getCustomColumnSettingsMapList(context, args);
			
			for (Iterator iterator = customColumnSettingsMapList.iterator(); iterator.hasNext();) {
				Map customColumnSettingsMap = (Map) iterator.next();

				String customColumnLabelKey = (String)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_LABEL_PROPERTY_KEY);
				String selectable = (String)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_SELECTABLE);
				if(UIUtil.isNullOrEmpty(selectable)){
					selectable = EMPTY_STRING;
				}
				Class columnDataTypeClass = (Class)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_VALUE_DATA_TYPE);
				Boolean excludeInRefinement  = (Boolean)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_EXCLUDE_IN_REFINEMENT);
				Integer columnIndex  = (Integer)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_INDEX);
				Boolean editable  = (Boolean)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_EDITABLE);
				Map columnOptionMap  = (Map)customColumnSettingsMap.get(ProgramCentralConstants.COLUMN_OPTIONS);
				JsonObjectBuilder editorBuilder = Json.createObjectBuilder();;
				String format = ProgramCentralConstants.EMPTY_STRING;
				
				if(columnDataTypeClass == null) {
					columnDataTypeClass  = CustomColumnDataTypeEnum.STRING.getDatatype();
				}
				if(excludeInRefinement == null) {
					excludeInRefinement = false;
				}
				if(columnIndex == null) {
					columnIndex = 21;
				}
				if(editable == null) {
					editable = Boolean.FALSE;
				}
				String xtype		= ProgramCentralConstants.EMPTY_STRING; 
				String fieldType	= columnDataTypeClass.getSimpleName(); 
				String columnLabel 	= ProgramCentralUtil.getPMCI18nString(
						context, 
						customColumnLabelKey, 
						context.getLocale().getLanguage());
				String dataIndex = getTagForCustomColumn(context, customColumnLabelKey);
				//JsonObject columnConfig = new JsonObject();
				JsonObjectBuilder columnConfig = Json.createObjectBuilder();

				if(String.class.getSimpleName().equals(fieldType)) {
					fieldType = "textfield";
				} 			
				else if(Number.class.getSimpleName().equals(fieldType)) {
					xtype		=	"";
					fieldType 	= 	"";
				}
				else if(Date.class.getSimpleName().equals(fieldType)) {
					xtype		=	"datecolumn";
					format 		=	dateStyle;
					fieldType 	= 	"datefield";
				}

				//Set Editor
				if(editable) {
					editorBuilder = Json.createObjectBuilder();
					editorBuilder.add("xtype",	fieldType);
					editorBuilder.add("format", format);
				}

				columnConfig = 
						getColumn(context, columnIndex, dataIndex, columnLabel, xtype, fieldType, format, "center", selectable, editable, excludeInRefinement, 100, editorBuilder.build(),true,true,columnConfigMap);

				/*
				if(columnOptionMap != null && !columnOptionMap.isEmpty()) {
					JsonArrayBuilder columnOption =  Json.createArrayBuilder();
					List optionKeylist = new ArrayList(columnOptionMap.keySet());
					for(int i=0,size=optionKeylist.size(); i<size; i++) {
						String key = optionKeylist.get(i).toString();
						String value = columnOptionMap.get(key).toString();
						JsonObjectBuilder customColumnConfig = Json.createObjectBuilder();
						customColumnConfig.add("displayValue", key);
						customColumnConfig.add("value", value);
						columnOption.add(customColumnConfig.build());
					}
					//columnConfig.put("columnOption",columnOption);
				}
				 */
				columnConfig.add("selectable",selectable);
				columnConfig.add("customColumn",Boolean.TRUE);
				customColumnArray.add(columnConfig.build());
			}
			return customColumnArray.build();	
		} catch (Exception e) {
			throw new FrameworkException (e);
		}		
	}

    /**
     * This method returns list of maps. Each map in the list contains settings for 
     * custom a column to be added in Gantt chart table. For each custom column,
     * there will be a map in list. each map MUST contains 
     * 1:String resource property key which value will be column label.
     * 2:Data type of column value. This value should be get from 
     * 	 <code>CustomColumnDataTypeEnum</code>.
     * 3:Name of the JPO method which will manipulate and return value of that column.
     * 4:COLUMN_TYPE if static, this column will be appeared in Gantt chart filter.
     * 
     * This method must be override in emxGantt JPO to add dynamic columns in Gantt chart table.
     * 
	 * @param	context			
	 * 			Context object which is used while fetching data related application.
     * @param 	argumentArray
     * 			This Array holds name of view for which dynamic column is going to be rendered.
     * 
     * @return	customColumnSettingsMapList
     * 			List of maps. Each map in the list contains settings for custom a column to be
     * 			added in Gantt chart table. For each dynamic column,there will be a map in list.
     * 	
	 * @throws 	Exception		
	 * 			Exception can be thrown in case of method fail to execute.
     */
    public MapList getCustomColumnSettingsMapList(Context context,String[] argumentArray) throws Exception {
    	
    	MapList customColumnSettingsMapList = new MapList();
    	Map<String,String> jpoArgumentMap  = (Map<String,String>)JPO.unpackArgs(argumentArray);
    	
    	String objectId 	 = jpoArgumentMap.get("objectId");
		String rootType 	 = jpoArgumentMap.get("objectType");
		String ganttViewName = jpoArgumentMap.get("viewId");
		
    	//Add setting for Deviation column
    	if ((!"Project Template".equalsIgnoreCase(rootType)) && ProgramCentralConstants.VIEW_WBS.equalsIgnoreCase(ganttViewName)) {
    		
	    	Map<String,Object> deviationColumnSettingsMap = new HashMap<String,Object>();
	    	deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_LABEL_PROPERTY_KEY,"emxProgramCentral.gantt.Deviation");
	    	deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_VALUE_DATA_TYPE,ProgramCentralConstants.CustomColumnDataTypeEnum.FLOAT.getDatatype());
	    	deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_VALUE_METHOD_NAME,"getTaskDeviationValue");
	    	//deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_EXCLUDE_IN_REFINEMENT,Boolean.FALSE);
	    	//deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_EDITABLE,Boolean.TRUE);
	    	//deviationColumnSettingsMap.put(ProgramCentralConstants.COLUMN_TYPE,ProgramCentralConstants.COLUMN_TYPE_STATIC);	    	
	    	customColumnSettingsMapList.add(deviationColumnSettingsMap);
    	}
    	return customColumnSettingsMapList;
    }
    public boolean getCustomizationFlag(Context context,String[] argumentArray) {
    	return isCustomizedEnvironment;
    }
    public void setCustomizationFlag(Context context,String[] argumentArray) {
    	isCustomizedEnvironment = true;
    }
    public void resetCustomizationFlag(Context context,String[] argumentArray) {
    	isCustomizedEnvironment = false;
    }
    private String computeFloatHeader(Context context, String projectId, String clientTimezone) throws MatrixException{
    	String groupHeader = "";
    	String ctxLangugage = context.getLocale().getLanguage();
    	String strProjectFloatGroupHeader = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Schedule.Float",ctxLangugage );    	
    	String updated = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Schedule.Float.Updated",ctxLangugage );
    	
    	DomainObject projectSpace = DomainObject.newInstance(context, projectId);
    	String strPALId = projectSpace.getInfo(context, ProgramCentralConstants.SELECT_PAL_OBJECTID_FROM_PROJECT);
    	Map floatData = ProjectSpace.getProjectFloatFromPAL(context, strPALId);
    	String strLastModifiedDate = (String)floatData.get("Last Modified");
    	if(ProgramCentralUtil.isNotNullString(clientTimezone)) {
    		double clientTZOffset 	= Task.parseToDouble(clientTimezone);
        	int iDateFormat             = eMatrixDateFormat.getEMatrixDisplayDateFormat();
            Locale locale = context.getLocale();
            strLastModifiedDate = eMatrixDateFormat.getFormattedDisplayDateTime(strLastModifiedDate, true,iDateFormat, clientTZOffset,locale);
        }

    	if(ProgramCentralUtil.isNullString(strLastModifiedDate)) {
    		strLastModifiedDate = EMPTY_STRING;
    	}
    	
    	groupHeader = strProjectFloatGroupHeader+ " ( "+updated+":"+strLastModifiedDate +" )";
    	return groupHeader;

    }
    private String computeForecastHeader(Context context, String projectId, String clientTimezone) throws MatrixException{
    	String groupHeader = "";
    	String ctxLangugage = context.getLocale().getLanguage();
    	String strProjectFloatGroupHeader = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Common.Forecast",ctxLangugage );    	
    	String updated = ProgramCentralUtil.getPMCI18nString(context, "emxProgramCentral.Schedule.Float.Updated",ctxLangugage );
    	
    	DomainObject projectSpace = DomainObject.newInstance(context, projectId);
    	String updatedTime = projectSpace.getInfo(context, ProgramCentralConstants.SELECT_ATTRIBUTE_FORECAST_CALCULATED_ON);
    	if(ProgramCentralUtil.isNotNullString(clientTimezone)) {
    		double clientTZOffset 	= Task.parseToDouble(clientTimezone);
        	int iDateFormat             = eMatrixDateFormat.getEMatrixDisplayDateFormat();
            Locale locale = context.getLocale();
            updatedTime = eMatrixDateFormat.getFormattedDisplayDateTime(updatedTime, true,iDateFormat, clientTZOffset,locale);
        }

    	if(ProgramCentralUtil.isNullString(updatedTime)) {
    		updatedTime = EMPTY_STRING;
    	}
    	
    	groupHeader = strProjectFloatGroupHeader+ " ( "+updated+":"+updatedTime +" )";
    	return groupHeader;

    }
    
    private Map<String,Map<String,String>> getGanttColumnCofigMap(Context context, String ganttCompressedConfig) throws Exception {
    	
		Map<String,Map<String,String>> columnConfigMap = new HashMap<>();
		
		try {
			if(ProgramCentralUtil.isNotNullString(ganttCompressedConfig)) {
				
				String ganttConfigString = ProgramCentralUtil.unzip(ganttCompressedConfig);
			
				if (ProgramCentralUtil.isNotNullString(ganttConfigString)) {
					JsonObjectBuilder ganttConfigJsonBuilder = ProgramCentralUtil.stringToJsonBuilder(context,ganttConfigString);
					JsonObject columnconfigJson = ganttConfigJsonBuilder.build().getJsonObject("columnconfig");
					
					if(columnconfigJson != null) {
						Set<String> columnNameSet = columnconfigJson.keySet();
						
						for(String columnName : columnNameSet) {
							Map<String,String> parameterMap = new HashMap<>();
							JsonObject columnJson = columnconfigJson.getJsonObject(columnName);
							
							//Populate parameterMap with new values which may override old values
							for (Map.Entry<String, JsonValue> entry : columnJson.entrySet()) {
								parameterMap.put(entry.getKey(), entry.getValue().toString());
							}
							columnConfigMap.put(columnName,parameterMap);
						}
					}
				}
			}
		} catch(Exception exception) {
			DebugUtil.debug("Exception ocurred in emxGanttBase_mxJPO.getGanttColumnCofigMap :: " + exception);
			throw new Exception(exception);
		}
		return columnConfigMap;
    }
    
    private void setColumnConfig(Context context,Map<String,Map<String,String>> columnConfigMap, String columnName, JsonObjectBuilder columnConfig) {
    	
    	if(columnConfigMap != null && !columnConfigMap.isEmpty()) { 
			Map<String,String> columnParameterMap = columnConfigMap.get(columnName);
			if(columnParameterMap != null && !columnParameterMap.isEmpty()) {
				String columnWidth = columnParameterMap.get("width");
				String columnOrder = columnParameterMap.get("columnIndex");
				String hideColumn = columnParameterMap.get("hideColumn");
				
				if (ProgramCentralUtil.isNotNullString(columnWidth)) {
					int width = Integer.parseInt(columnWidth);
					columnConfig.add("width",width);	
				}
				if (ProgramCentralUtil.isNotNullString(columnOrder)) {
					int columnIndex = Integer.parseInt(columnOrder);
					columnConfig.add("columnIndex",	columnIndex);
				}
				if (ProgramCentralUtil.isNotNullString(hideColumn)) { 
					boolean hidden = "true".equalsIgnoreCase(hideColumn); 
					columnConfig.add("hidden", hidden);
				}
			}
		}
    }
}
