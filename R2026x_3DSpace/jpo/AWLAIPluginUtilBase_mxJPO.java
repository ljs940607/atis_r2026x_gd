/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program.
*/
import static com.matrixone.apps.domain.DomainConstants.SELECT_CURRENT;
import static com.matrixone.apps.domain.DomainConstants.SELECT_ID;
import static com.matrixone.apps.domain.DomainConstants.SELECT_NAME;
import static com.matrixone.apps.domain.DomainConstants.SELECT_REVISION;
import static com.matrixone.apps.domain.DomainConstants.SELECT_TYPE;

import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UITable;
import com.matrixone.apps.framework.ui.UITableCommon;
import com.matrixone.jdom.output.XMLOutputter;
import com.matrixone.apps.awl.util.AWLPropertyUtil;

import matrix.db.BusinessObjectWithSelectList;
import matrix.db.Context;
import matrix.db.RelationshipWithSelect;
import matrix.db.RelationshipWithSelectList;
import matrix.util.StringList;


public class AWLAIPluginUtilBase_mxJPO {
	
	private static String SEARCH_CRITERIA_POA_NAME = "POAName";
	private static String SINGLE_QUOTE = "'";
	
	public String getArtworkFileInfo(Context context,String args[]) throws FrameworkException 
	{
		String infoXML = "";
		try{
			String poaId = args[0];
			POA poaObj = new POA(poaId);
			DomainObject artworkFileObject = poaObj.getArtworkFile(context);
			StringList selectables = new StringList();
			selectables.add(DomainObject.SELECT_TYPE);
			selectables.add(DomainObject.SELECT_NAME);
			selectables.add(DomainObject.SELECT_REVISION);
			selectables.add(DomainObject.SELECT_ID);
			Map infoMap = artworkFileObject.getInfo(context, selectables);
			//System.out.println(infoMap);
			
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

			// root elements
			Document xmlDoc = docBuilder.newDocument();
			Element rootElement = xmlDoc.createElement("root");
			Element artworkFileElement = xmlDoc.createElement("artworkfile");
			Iterator mapItr = infoMap.keySet().iterator();
			while(mapItr.hasNext())
			{
				String key = mapItr.next().toString();
				String value = infoMap.get(key).toString();
				artworkFileElement.setAttribute(key, value);
			}
			
			rootElement.appendChild(artworkFileElement);
			xmlDoc.appendChild(rootElement);
			
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			StringWriter writer = new StringWriter();
			transformer.transform(new DOMSource(xmlDoc), new StreamResult(writer));

			infoXML = writer.getBuffer().toString();
			
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return infoXML;
	}

	public String searchPOA(Context context,String[] args) throws FrameworkException
	{
		String poaXML = "";
		try
		{
			String inputXML = args[1];
			
			String strPOATypePattern= "";
			try{
				strPOATypePattern = EnoviaResourceBundle.getProperty(context, "emxAWL.POASearch.TypePattern");
			}catch(Exception ex){
				strPOATypePattern = DomainConstants.TYPE_PART;
			}
			
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			
			InputSource is = new InputSource(new ByteArrayInputStream(inputXML.getBytes()));
			Document doc = docBuilder.parse(is);
			
			Map searchCriteriaMap = new HashMap();
			
			NodeList criteriaList = doc.getElementsByTagName("field");
			for(int i = 0 ; i < criteriaList.getLength(); i++)
			{
				Element criteriaElement = (Element) criteriaList.item(i);
				searchCriteriaMap.put(criteriaElement.getAttribute("actualname"),criteriaElement.getAttribute("value"));
			}
			String whereClause = getWhereClause(context, searchCriteriaMap);
			if(!whereClause.isEmpty()){
				whereClause =AWLUtil.strcat(whereClause," && ", SELECT_REVISION,"=='",AWLConstants.LAST,SINGLE_QUOTE," && ",SELECT_CURRENT, "!= '",AWLState.OBSOLETE.get(context, AWLPolicy.POA),SINGLE_QUOTE); 
			}else{
				whereClause=AWLUtil.strcat(SELECT_REVISION,"=='",AWLConstants.LAST,SINGLE_QUOTE,"&&",SELECT_CURRENT, "!= '",AWLState.OBSOLETE.get(context, AWLPolicy.POA),SINGLE_QUOTE);
			}
			String strVault = context.getVault().getName();
			StringList slObjSelect = new StringList();
			slObjSelect.addElement(SELECT_ID);
			slObjSelect.addElement(SELECT_TYPE);
			slObjSelect.addElement(SELECT_NAME);
			slObjSelect.addElement(SELECT_REVISION);
			
			String poaNamePattern = searchCriteriaMap.get(SEARCH_CRITERIA_POA_NAME).toString();
			if(BusinessUtil.isNullOrEmpty(poaNamePattern))
			{
				poaNamePattern = EnoviaResourceBundle.getProperty(context,"emxAWL.POASearch.NamePattern");
			}
			
			MapList POAObjs = DomainObject.findObjects(context, strPOATypePattern, poaNamePattern, "*", "*", AWLPropertyUtil.getVaultsForFindObjects(context), whereClause, true, slObjSelect);
			//System.out.println(POAObjs);
			MapList tableColumns = getTableColumns(context, "en", "AWLPOAList");
			
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
			
			poaXML = getOutputXmlString(nameExpression, tableData);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return poaXML;
	}

// mkcsc report generates AppendCharacterWithChar but its already taken care 
	
	private String getWhereClause(Context context, Map searchCriteriaMap) 
	{
		StringBuffer where = new StringBuffer();
		try{
			Iterator it = searchCriteriaMap.keySet().iterator();
			while (it.hasNext()) 
			{
				String fieldName = it.next().toString();
				String value = searchCriteriaMap.get(fieldName).toString();

				if (BusinessUtil.isNotNullOrEmpty(value) && !"*".equals(value)) 
				{
					if (where.length() > 0) 
					{
						where.append(" && ");
					}
					String expression = EnoviaResourceBundle.getProperty(context, AWLUtil.strcat("emxAWL.SearchCriteriaFieldExpression.",fieldName));
					StringList sl = FrameworkUtil.split(expression, ",");
					int j =0;
					for(int k=0; k<sl.size(); k++) {
						String strExpression = (String) sl.get(k);
						where.append(j==0 ? '(' : "||");	
						where.append('(').append(strExpression).append(" ~~ '*").append(value).append("*')");  
						j++;
					}
					if (j>0)
					{
						where.append(')');
					}
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return where.toString();
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
                        slColValueList  = (StringList)(bwsl.getElement(i).getSelectDataList(strColumnSelect));
                        if(slColValueList != null) 
                        {
                            strColumnValue = (String)slColValueList.firstElement();
                            hmFinalMap.put(strColumnSelect, strColumnValue);
                        }
                     }
                     else if ("relationship".equals(strColumnType) ) 
                     {
                        strColumnSelect    = UITable.getRelationshipSelect(hmColumnMap);
                        slColValueList     = (StringList)(((RelationshipWithSelect)rwsl.elementAt(i)).getSelectDataList(strColumnSelect));
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
        catch(Exception ex)
        {
        	throw new FrameworkException(ex);
        }
    }
	
	protected String getOutputXmlString(HashMap nameExprMap, MapList tableList)
	{
		com.matrixone.jdom.Element searchResultTag  = new com.matrixone.jdom.Element("searchresult");
		searchResultTag.setAttribute("total", Integer.toString(tableList.size()));
		searchResultTag.setAttribute("first", Integer.toString(tableList.size()));
		searchResultTag.setAttribute("last", Integer.toString(tableList.size()));
		
		for ( int i = 0; i < tableList.size(); i++ )
		{
			Map objMap = (Map)tableList.get( i );
			com.matrixone.jdom.Element rowTag = new com.matrixone.jdom.Element("row");

			rowTag.setAttribute("rowid",Integer.toString(i+1));
			rowTag.setAttribute("type", (String)objMap.get("type"));
			rowTag.setAttribute("POANumber", (String)objMap.get("name"));
			rowTag.setAttribute("oid", (String)objMap.get("id"));
			rowTag.setAttribute("revision", (String)objMap.get("revision"));
			
			for (Iterator iterator = nameExprMap.keySet().iterator(); iterator.hasNext();) {
				String columnName = (String) iterator.next();
				String columnExp = (String) nameExprMap.get(columnName);
				String columnValue = (String) objMap.get(columnExp);
				
				com.matrixone.jdom.Element columnTag = new com.matrixone.jdom.Element(columnName);
				if(BusinessUtil.isNotNullOrEmpty(columnExp))
					columnTag.setText(columnValue);

				rowTag.addContent(columnTag);	
			}
			searchResultTag.addContent(rowTag);
		}
		XMLOutputter xmlOut = new XMLOutputter();
		return xmlOut.outputString(searchResultTag);
	}
}
