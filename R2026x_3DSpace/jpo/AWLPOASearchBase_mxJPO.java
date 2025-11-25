/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import matrix.db.BusinessObjectWithSelectList;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.RelationshipWithSelect;
import matrix.db.RelationshipWithSelectList;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UITable;
import com.matrixone.apps.framework.ui.UITableCommon;
import com.matrixone.jdom.Document;
import com.matrixone.jdom.Element;
import com.matrixone.jdom.input.SAXBuilder;
import com.matrixone.jdom.output.XMLOutputter;


public class AWLPOASearchBase_mxJPO {

	public AWLPOASearchBase_mxJPO(Context context, String[] args) throws FrameworkException 
	{
		//AWLPOASearchBase constructor
	}
	
	public String getPOASearchCriteria(Context context, String [] args) throws FrameworkException
	{
		String strLanguage = "";
		
		try{
			strLanguage = args[0];
		}catch(Exception ex){	
			strLanguage = "en";
		}
		String searchCriteriaFields = AWLPropertyUtil.getConfigPropertyString(context, 
				"emxAWL.SearchCriteriaFields.NameDefaultVauePair", "ProjectID,00001|CountryofSale,France");
		StringList fieldList = new StringList();
		if(BusinessUtil.isNotNullOrEmpty(searchCriteriaFields))
			fieldList = FrameworkUtil.split(searchCriteriaFields, "|");
			
		Element searchCriteriaTag = new Element("criteria");
		for (Iterator itr = fieldList.iterator(); itr.hasNext();) {
			String criteriaField = (String) itr.next();
			if(BusinessUtil.isNotNullOrEmpty(criteriaField)) {
				StringList nameValue = FrameworkUtil.split(criteriaField, ",");
				if(BusinessUtil.isNotNullOrEmpty(nameValue)) {
					String fieldName = (String) nameValue.get(0);
					String fieldDisplayName = AWLPropertyUtil.getI18NString(context,"emxAWL.SearchCriteriaField."+fieldName, strLanguage);
					String fieldDefaultValue = nameValue.size()>1 ? (String) nameValue.get(1) : "";

					Element searchFieldTag = new Element("field");
					searchFieldTag.setAttribute("displayname", fieldDisplayName);
					searchFieldTag.setAttribute("actualname", fieldName);
					searchFieldTag.setAttribute(DomainConstants.SELECT_TYPE, "string");
					searchFieldTag.setAttribute("defaultvalue", fieldDefaultValue);
					
					searchCriteriaTag.addContent(searchFieldTag);
				}
			}
		}
		try {
			XMLOutputter xmlOut = new XMLOutputter();
			return xmlOut.outputString(searchCriteriaTag);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public String searchPOA(Context context, String[] args) throws FrameworkException
	{
		String strLanguage = "";
		String strInputXmlString = "";
		String strTableName = "";
		String whereExp="";

		try{
			strLanguage = args[0];
		}catch(Exception ex){	
			strLanguage = "en";
		}

		try{
			strInputXmlString = args[1];
		}catch(Exception ex){	
			strInputXmlString = "<criteria><field actualname='ProjectID' type='string' value='*00001' /><field actualname='CountryofSale' type='string' value='Canada' /></criteria>";
		}

		try{
			strTableName = args[2];
		}catch(Exception ex){	
			strTableName = "AWLPOAList";
		}


		String strPOATypePattern= AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.POASearch.TypePattern", DomainConstants.TYPE_PART);

		String strPOANamePattern= AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.POASearch.NamePattern", "*");
		
		try {
			MapList searchCriteriaMapList = new MapList();
			SAXBuilder saxBuilder = new SAXBuilder();
			InputStream isInputStream = new ByteArrayInputStream(strInputXmlString.getBytes("UTF-8"));
			Document dom= saxBuilder.build(isInputStream);
			Element root = dom.getRootElement();

			Iterator itr = root.getDescendants();
			while(itr.hasNext()) {
				Element element = (Element) itr.next(); 
				List attrList = element.getAttributes();
				Iterator attrItr=attrList.iterator();
				HashMap searchCriteriaMap = new HashMap();
				while(attrItr.hasNext())
				{
					com.matrixone.jdom.Attribute AttributeName=(com.matrixone.jdom.Attribute)attrItr.next();
					String key = AttributeName.getName();
					String value = AttributeName.getValue();
					searchCriteriaMap.put(key,value);
				}
				searchCriteriaMapList.add(searchCriteriaMap);
			} 
			
			String strWhere = getWhereClause(context,searchCriteriaMapList);
			if(!strWhere.isEmpty()){
				whereExp =AWLUtil.strcat(strWhere," && ", DomainConstants.SELECT_REVISION,"=='",AWLConstants.LAST,"'"," && ",DomainConstants.SELECT_CURRENT, "!= '",AWLState.OBSOLETE.get(context, AWLPolicy.POA),"'"); 
			}else{
				whereExp=AWLUtil.strcat(DomainConstants.SELECT_REVISION,"=='",AWLConstants.LAST,"'","&&",DomainConstants.SELECT_CURRENT, "!= '",AWLState.OBSOLETE.get(context, AWLPolicy.POA),"'");
			}
				
			String strVault = context.getVault().getName();
			StringList slObjSelect = new StringList();
			slObjSelect.addElement(DomainConstants.SELECT_ID);
			slObjSelect.addElement(DomainConstants.SELECT_TYPE);
			slObjSelect.addElement(DomainConstants.SELECT_NAME);
			slObjSelect.addElement(DomainConstants.SELECT_REVISION);
			
			MapList POAObjs = DomainObject.findObjects(context, strPOATypePattern, strPOANamePattern, "*", "*", AWLPropertyUtil.getVaultsForFindObjects(context), whereExp, true, slObjSelect);
			
			MapList tableColumns = getTableColumns(context, strLanguage, strTableName);
			
			HashMap nameExpression = new HashMap();
			
			for ( int i = 0; i < tableColumns.size(); i++ )
			{
				Map columnMap = (Map)tableColumns.get( i );
				String columnName = (String)columnMap.get("name");
				String columnLabel = (String)columnMap.get("label"); 
				String columnExpression = (String)columnMap.get("expression_businessobject");
				nameExpression.put(columnName, BusinessUtil.isNotNullOrEmpty(columnExpression) ? columnExpression : columnLabel);
			}
			
			MapList tableData = getColumnValues(context, tableColumns, POAObjs, "en");
			
			return getOutputXmlString(nameExpression, tableData);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	protected String getWhereClause(Context context,MapList searchCriteriaMapList) throws FrameworkException
	{
		StringBuffer where = new StringBuffer();
		for (int i=0; i < searchCriteriaMapList.size(); i++)
		{
			HashMap searchCriteriaMap = (HashMap)searchCriteriaMapList.get(i);
			String strFieldName  = (String)searchCriteriaMap.get("actualname");
			String strFieldValue  = (String)searchCriteriaMap.get("value");
			if (BusinessUtil.isNotNullOrEmpty(strFieldValue) && !"*".equals(strFieldValue))
			{
				if (where.length()>0) {
					where.append(" && ");
				}
				String expression = AWLPropertyUtil.getConfigPropertyString(context,AWLUtil.strcat("emxAWL.SearchCriteriaFieldExpression.", strFieldName));

				StringList sl = FrameworkUtil.split(expression, ",");
				int j =0;
				for(int k=0; k<sl.size(); k++) {
					String strExpression = (String) sl.get(k);
					where.append(j==0 ? "(" : " || ");	
					where.append('(').append(strExpression).append(" ~~ '*").append(strFieldValue).append("*')");  
					j++;
				}
				if (j>0)
				{
					where.append(')');
				}
			}
		}
		return where.toString();
	}
	
	protected String getOutputXmlString(Map nameExprMap, MapList tableList)
	{
		Element searchResultTag  = new Element("searchresult");
		searchResultTag.setAttribute("total", Integer.toString(tableList.size()));
		searchResultTag.setAttribute("first", Integer.toString(tableList.size()));
		searchResultTag.setAttribute("last", Integer.toString(tableList.size()));
		
		for ( int i = 0; i < tableList.size(); i++ )
		{
			Map objMap = (Map)tableList.get( i );
			Element rowTag = new Element("row");

			rowTag.setAttribute("rowid",Integer.toString(i+1));
			rowTag.setAttribute(DomainConstants.SELECT_TYPE, (String)objMap.get(DomainConstants.SELECT_TYPE));
			rowTag.setAttribute("POANumber", (String)objMap.get("name"));
			rowTag.setAttribute("oid", (String)objMap.get("id"));
			rowTag.setAttribute("revision", (String)objMap.get("revision"));
			
			for (Iterator iterator = nameExprMap.keySet().iterator(); iterator.hasNext();) {
				String columnName = (String) iterator.next();
				String columnExp = (String) nameExprMap.get(columnName);
				String columnValue = (String) objMap.get(columnExp);
				
				Element columnTag = new Element(columnName);
				if(BusinessUtil.isNotNullOrEmpty(columnExp))
					columnTag.setText(columnValue);

				rowTag.addContent(columnTag);	
			}
			searchResultTag.addContent(rowTag);
		}
		XMLOutputter xmlOut = new XMLOutputter();
		return xmlOut.outputString(searchResultTag);
	}
	
	public String getSearchResultsTableDef(Context context, String [] args) throws FrameworkException
	{
		String language = "";
		String tableName = "";
		
		try{
			language = args[0];
		}catch(Exception ex){	
			language = "en";
		}
		
		try{
			tableName = args[1];
		}catch(Exception ex){	
			tableName = "AWLPOAList";
		}
		
		
		try {
			MapList tableColumns = getTableColumns(context, language, tableName);
			
			Element resultTableTag = new Element("ResultTable");
			
			for ( int i = 0; i < tableColumns.size(); i++ )
			{
				Map columnMap = (Map)tableColumns.get( i );
				String columnName = (String)columnMap.get("name");
				String columnLabel = (String)columnMap.get("label"); 
				Element TableColumnTag = new Element(columnName);
				if(columnLabel != null && ! "".equals(columnLabel))
					TableColumnTag.setText(columnLabel);
	
				resultTableTag.addContent(TableColumnTag);
			}
			
			XMLOutputter xmlOut = new XMLOutputter();
			return xmlOut.outputString(resultTableTag);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getProjectID(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap argsMap = JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(argsMap);
			StringList idsList = BusinessUtil.getIdList(objectList);
			StringList res = new StringList(idsList.size());
			for(int i=0; i<idsList.size(); i++) {
				POA poa = new POA((String) idsList.get(i));
				res.add(poa.getArtworkPackage(context).getName(context));
			}
			return res;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getCountryofSale(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap argsMap = JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(argsMap);
			StringList idsList = BusinessUtil.getIdList(objectList);
			StringList countriesList = new StringList();
			String SEL_REL_POA_COUNTRY = "from[POA Country].to.name";
			List<Map> countryInfo =  BusinessUtil.getInfoList(context, idsList, SEL_REL_POA_COUNTRY);
			for (Map countryMap : countryInfo) 
			{
				countriesList.add(FrameworkUtil.join((StringList) countryMap.get(SEL_REL_POA_COUNTRY), ","));
			}
			return countriesList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	
	private MapList getTableColumns(Context context, String strLanguage, String strTableName) throws FrameworkException 
	{
		Vector v = new Vector(1);
		v.add("all");
		UITable table   = new UITable();
		MapList columns = UITable.getColumns(context, strTableName, v);
		HashMap requestMap = new HashMap();
		requestMap.put("languageStr", strLanguage);
		return table.processColumns(context, new HashMap(), columns, requestMap);
	}
	
	private MapList getColumnValues(Context context,MapList processColumns, MapList objectIdList, String strLanguage) throws FrameworkException
    {
        try{
            HashMap hmRequestMap = new HashMap();
            hmRequestMap.put("languageStr", strLanguage);
            
            HashMap hmTableData = new HashMap();
            hmTableData.put("RequestMap",hmRequestMap);
            
            UITableCommon uiTable = new UITableCommon();
            HashMap hmColumnValuesMap           = uiTable.getColumnValuesMap(context, processColumns, objectIdList, hmTableData, false);
    
            BusinessObjectWithSelectList bwsl   = (BusinessObjectWithSelectList)hmColumnValuesMap.get("Businessobject");
            RelationshipWithSelectList rwsl     = (RelationshipWithSelectList)hmColumnValuesMap.get("Relationship");
            Vector[] programResult              = (Vector[])hmColumnValuesMap.get("Program");
            
            int iColumnSize                     = processColumns.size();
            int iObjectListSize                 = objectIdList.size();
 
            MapList mlFinalList     = new MapList();
            for (int i = 0; i < iObjectListSize; i++)
            {
                HashMap hmFinalMap  = new HashMap();

                 for (int k = 0; k < iColumnSize; k++)
                 {
                    HashMap hmColumnMap    = (HashMap)processColumns.get(k);
                    String strColumnType   = UITable.getSetting(hmColumnMap, "Column Type");
                    String strColumnLabel  = UITable.getLabel(hmColumnMap);
                    String strColumnValue  = null;
                    String strColumnSelect = null;
                    StringList slColValueList = null;
                    
                    if ("program".equals(strColumnType)) 
                    {
                    	HashMap hmProgram	= (HashMap)programResult[k].get(i);
                    	strColumnValue  	= (String)hmProgram.get("DisplayValue");
                        hmFinalMap.put(strColumnLabel, strColumnValue);
                    }
                    else if("businessobject".equals(strColumnType))
                    {
                        strColumnSelect = UITable.getBusinessObjectSelect(hmColumnMap);
                        slColValueList  = bwsl.getElement(i).getSelectDataList(strColumnSelect);
                        if(slColValueList != null) 
                        {
                            strColumnValue = (String)slColValueList.firstElement();
                            hmFinalMap.put(strColumnSelect, strColumnValue);
                        }
                     }
                     else if ("relationship".equals(strColumnType) ) 
                     {
                        strColumnSelect    = UITable.getRelationshipSelect(hmColumnMap);
                        slColValueList     = ((RelationshipWithSelect)rwsl.elementAt(i)).getSelectDataList(strColumnSelect);
                        if(slColValueList != null) 
                        {
                            strColumnValue = (String)slColValueList.firstElement();
                            hmFinalMap.put(strColumnSelect, strColumnValue);
                        }
                     }
                 }

                 Map objectMap  = (Map)objectIdList.get(i);
                 Iterator iterator   = objectMap.keySet().iterator();
                 while (iterator.hasNext())
                 {
                	 String strKey     = (String) iterator.next();
                     hmFinalMap.put(strKey, objectMap.get(strKey));
                 }
                 mlFinalList.add(hmFinalMap);
            }
            return mlFinalList;
        }
        catch(Exception ex){ throw new FrameworkException(ex); }
    }
	
}
