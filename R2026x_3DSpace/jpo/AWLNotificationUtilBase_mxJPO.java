/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.framework.ui.UIComponent;
import com.matrixone.apps.framework.ui.UIMenu;
import com.matrixone.jdom.Document;

public class AWLNotificationUtilBase_mxJPO extends AWLObject_mxJPO{

	private static final String FRAMEWORK_TYPE_EVENT = "emxFramework.Type.Event";
	private static final String LOCALE = "locale";
	private static final String HEADER = "header";

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLNotificationUtilBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);

	}
	private static final String FRAMEWORK_PROPERTY_FILE = "emxFrameworkStringResource";
	private static final String TEXT = "text";
	private static final String HTML = "HTML";
	private static final String EVENT = "Event Type";
	
	private static final String ARTWORK_MASTER_MODIFIED = "Copy Modify";
	private static final String ARTWORK_MASTER_RELEASED = "Copy Released";
	private static final String ARTWORK_MASTER_REVISED = "Copy Revised";
	
	private static final String ARTWORK_ELEMENT_RELEASED = "Artwork Element Content Released";
	private static final String ARTWORK_ELEMENT_REVISED = "Artwork Element Content Revised";
	
	
	
	public String getArtworkElementNotificationText(Context context,String[] args) throws FrameworkException
	{
		return getArtworkElementNotificationContent(context,args,TEXT);
	}

	public String getArtworkElementNotificationHTML(Context context,String[] args) throws FrameworkException
	{
		return getArtworkElementNotificationContent(context,args,HTML);
	}	

	public String getArtworkMasterNotificationText(Context context,String[] args) throws FrameworkException
	{
		return getArtworkMasterNotificationContent(context,args,TEXT);
	}

	public String getArtworkMasterNotificationHTML(Context context,String[] args) throws FrameworkException
	{
		return getArtworkMasterNotificationContent(context,args,HTML);
	}	

	protected Map getCommonMessageBody(Context context,Map objectInfoMap,String locale) throws FrameworkException
	{

		LinkedHashMap mapContent = new LinkedHashMap();

		mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, "emxFramework.Basic.Type",locale),
				objectInfoMap.get(DomainConstants.SELECT_TYPE));
		mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, "emxFramework.Basic.Name",locale),
				objectInfoMap.get(DomainConstants.SELECT_NAME));
		mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, "emxFramework.Basic.Revision",locale), 
				objectInfoMap.get(DomainConstants.SELECT_REVISION));

		return mapContent;
	}

	protected Map getFooterURL(Context context, String objectId,String locale) throws FrameworkException
	{
		try{
			String baseURL = getObjectLink(context,objectId);
			ArrayList dataLineInfo = new ArrayList();
			dataLineInfo.add(AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Label.ClickHere", locale));
			dataLineInfo.add(" ");
	        dataLineInfo.add(baseURL);
			
			
			HashMap footerMap = new HashMap();
			footerMap.put("dataLines", dataLineInfo);
			return footerMap;
		}catch(Exception e)
		{
			throw new FrameworkException(e);
		}
	}

	protected String getArtworkMasterNotificationContent(Context context, String[] args, String messageType) throws FrameworkException
	{
		try
		{
			Map infoMap = (Map) JPO.unpackArgs(args);
			String notificationName = infoMap.get("notificationName").toString();
			String objectId = infoMap.get(DomainConstants.SELECT_ID).toString();
			HashMap commandMap = UIMenu.getCommand(context, notificationName);
			String eventName = UIComponent.getSetting(commandMap, EVENT);
			String locale = infoMap.get(LOCALE).toString();

			HashMap headerMap = new HashMap();

			Map ceMap = BusinessUtil.getInfo(context, objectId, new StringList(BusinessUtil.toStringList(DomainConstants.SELECT_NAME,
																										 DomainConstants.SELECT_TYPE,
																										 DomainConstants.SELECT_REVISION)
																										 ));
			HashMap bodyMap = new HashMap();
			Map mapContent = getCommonMessageBody(context,ceMap,locale);
			mapContent.put(AWLPropertyUtil.getAttributeI18NString(context, AWLAttribute.MARKETING_NAME.get(context), locale, false),
					BusinessUtil.getAttribute(context, objectId, AWLAttribute.MARKETING_NAME.get(context)).toString());

			if(ARTWORK_MASTER_MODIFIED.equals(eventName))
			{
				headerMap.put(HEADER, AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Event.ArtworkMaster.Modify.Header", locale));
				mapContent.put(AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Label.Modifier", locale), 
						PersonUtil.getFullName(context));
				mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, FRAMEWORK_TYPE_EVENT,locale), 
						AWLPropertyUtil.getI18NString(context, "emxAWL.Event.Modify", locale));
			}
			else if(ARTWORK_MASTER_RELEASED.equals(eventName))
			{
				headerMap.put(HEADER,AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Event.ArtworkMaster.Released.Header", locale));
				mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, FRAMEWORK_TYPE_EVENT,locale),
						AWLPropertyUtil.getI18NString(context, "emxAWL.Event.Released", locale));
			}
			else if(ARTWORK_MASTER_REVISED.equals(eventName))
			{
				headerMap.put(HEADER, AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Event.ArtworkMaster.Revised.Header", locale));			
				mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, FRAMEWORK_TYPE_EVENT,locale),
						AWLPropertyUtil.getI18NString(context, "emxAWL.Event.Revised", locale));
			}

			bodyMap.put(AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Label.ArtworkMasterInformation",locale), mapContent);
			Map footerMap = getFooterURL(context,objectId,locale);
			Document doc =  prepareMailXML(context, headerMap, bodyMap, footerMap);
			return getMessageBody(context, doc, messageType);
		}
		catch(Exception e)
		{
			throw new FrameworkException(e);
		}
	}



	protected String getArtworkElementNotificationContent(Context context, String[] args, String messageType) throws FrameworkException
	{
		try
		{
			Map infoMap = (Map) JPO.unpackArgs(args);
			String notificationName = infoMap.get("notificationName").toString();
			String objectId = infoMap.get(DomainConstants.SELECT_ID).toString();
			HashMap commandMap = UIMenu.getCommand(context, notificationName);
			String eventName = UIComponent.getSetting(commandMap, EVENT);
			String locale = infoMap.get(LOCALE).toString();

			HashMap headerMap = new HashMap();

			Map ceMap = BusinessUtil.getInfo(context, objectId, new StringList(BusinessUtil.toStringList(DomainConstants.SELECT_NAME,
					 																					 DomainConstants.SELECT_TYPE,
					 																					 DomainConstants.SELECT_REVISION)
																										));
			HashMap bodyMap = new HashMap();
			Map mapContent = getCommonMessageBody(context,ceMap,locale);
			
			if(BusinessUtil.isKindOf(context, objectId, AWLType.COPY_ELEMENT.get(context)))
			{
				mapContent.put(AWLPropertyUtil.getAttributeI18NString(context, AWLAttribute.IS_BASE_COPY.get(context),locale,false), 
						BusinessUtil.getAttribute(context, objectId, AWLAttribute.IS_BASE_COPY).toString());
				mapContent.put(AWLPropertyUtil.getAttributeI18NString(context, AWLAttribute.COPY_TEXT.get(context), locale, false),
						BusinessUtil.getAttribute(context, objectId, AWLAttribute.COPY_TEXT).toString());
				mapContent.put(AWLPropertyUtil.getAttributeI18NString(context, AWLAttribute.COPY_TEXT_LANGUAGE.get(context), locale, false),
						BusinessUtil.getAttribute(context, objectId, AWLAttribute.COPY_TEXT_LANGUAGE).toString());

				if(ARTWORK_ELEMENT_RELEASED.equals(eventName))
				{
					headerMap.put(HEADER,AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Event.CopyElement.Released.Header", locale));
					mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, FRAMEWORK_TYPE_EVENT,locale),  
							AWLPropertyUtil.getI18NString(context, "emxAWL.Event.Released", locale));
				}
				else if(ARTWORK_ELEMENT_REVISED.equals(eventName))
				{
					headerMap.put(HEADER, AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Event.CopyElement.Revised.Header", locale));	
					mapContent.put(AWLPropertyUtil.getI18NString(context, FRAMEWORK_PROPERTY_FILE, FRAMEWORK_TYPE_EVENT,locale),
							AWLPropertyUtil.getI18NString(context, "emxAWL.Event.Revised", locale));
				}
			}
			bodyMap.put(AWLPropertyUtil.getI18NString(context, "emxAWL.Notification.Label.CopyElementInformation",locale), mapContent);
			Map footerMap = getFooterURL(context,objectId,locale);
			Document doc =  prepareMailXML(context, headerMap, bodyMap, footerMap);
			return getMessageBody(context, doc, messageType);
		}
		catch(Exception e)
		{
			throw new FrameworkException(e);
		}
	}
}
