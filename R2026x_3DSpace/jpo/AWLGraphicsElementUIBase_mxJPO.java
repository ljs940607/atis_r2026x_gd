/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/


import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.dao.GraphicsElement;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.framework.ui.UIComponent;

@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.AvoidCatchingThrowable" })
public class AWLGraphicsElementUIBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7313574776330557863L;

	
	public AWLGraphicsElementUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	public String getAWLDisplayName(Context context,String [] args)throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(BusinessUtil.PARAM_MAP);

			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);
			GraphicDocument graphicDoc = new GraphicDocument(objectId);
			ArtworkMaster graphicMaster = graphicDoc.getGraphicMaster(context);
			return graphicMaster == null ? "" : graphicMaster.getAttributeValue(context, AWLAttribute.MARKETING_NAME.get(context));
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**	
	 * Gets the Graphic/Graphic Element/Master Graphic Element Description. 
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public String getAWLDescription(Context context,String[] args)throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(BusinessUtil.PARAM_MAP);

			GraphicDocument graphicDoc = new GraphicDocument((String) paramMap.get(AWLConstants.OBJECT_ID));

			return graphicDoc.getDescription(context);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**	
	 * Gets the Authoring Assignee of the Graphic Element. 
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public String getAuthoringName(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(BusinessUtil.PARAM_MAP);

			GraphicDocument graphicDoc = new GraphicDocument((String) paramMap.get(AWLConstants.OBJECT_ID));
			GraphicsElement graphicElement = graphicDoc.getGraphicElement(context);
			
			return graphicElement.getAuthoringAssigneeName(context);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**	
	 * Gets the Approval Assignee of the Graphic Element. 
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public String getApprovalName(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(BusinessUtil.PARAM_MAP);

			GraphicDocument graphicDoc = new GraphicDocument((String) paramMap.get(AWLConstants.OBJECT_ID));
			GraphicsElement graphicElement = graphicDoc.getGraphicElement(context);
			
			return graphicElement.getApprovalAssigneeName(context);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public int updateAWLDisplayName(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(BusinessUtil.PARAM_MAP);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewDisplayName = (String) paramMap.get(AWLConstants.NEW_VALUE);

			strNewDisplayName = BusinessUtil.isNullOrEmpty(strNewDisplayName) ? "" : strNewDisplayName;
		
			GraphicDocument graphicDoc = new GraphicDocument(objectId);
			ArtworkMaster graphicMaster = graphicDoc.getGraphicMaster(context);
			graphicMaster.setAttributeValue(context,AWLAttribute.MARKETING_NAME.get(context) ,strNewDisplayName);
			
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	public int updateAWLDescription(Context context, String[] args) throws FrameworkException
	{
		try {

			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(BusinessUtil.PARAM_MAP);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewDiscription = (String) paramMap.get(AWLConstants.NEW_VALUE);
			strNewDiscription = BusinessUtil.isNullOrEmpty(strNewDiscription) ? "" : strNewDiscription;
			
			GraphicDocument graphicDoc = new GraphicDocument(objectId);
			GraphicsElement graphicElement = graphicDoc.getGraphicElement(context);
			ArtworkMaster graphicMaster = graphicElement.getArtworkMaster(context);
			graphicDoc.setDescription(context, strNewDiscription);
			graphicElement.setDescription(context, strNewDiscription);
			graphicMaster.setDescription(context, strNewDiscription);
			return 0;
					
		} catch (Exception e) { throw new FrameworkException(e);}
	}
     
	
	public int updateAWLApprovalRouteTemplates(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(BusinessUtil.PARAM_MAP);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewApprovalRouteId = (String) paramMap.get("New OID");
			strNewApprovalRouteId = strNewApprovalRouteId == null ? "" : strNewApprovalRouteId;

			GraphicDocument graphicDoc = new GraphicDocument(objectId);
			GraphicsElement graphicsElement = graphicDoc.getGraphicElement(context);
			graphicsElement.updateAssignee(context, null, strNewApprovalRouteId);
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public int updateAWLAuthoringRouteTemplates(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(BusinessUtil.PARAM_MAP);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewApprovalRouteId = (String) paramMap.get("New OID");
			strNewApprovalRouteId = strNewApprovalRouteId == null ? "" : strNewApprovalRouteId;

			GraphicDocument graphicDoc = new GraphicDocument(objectId);
			GraphicsElement graphicsElement = graphicDoc.getGraphicElement(context);
			graphicsElement.updateAssignee(context, strNewApprovalRouteId, null);
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}	

	public StringList getCurrentGraphicImage(Context context,String args[]) throws FrameworkException
	{
		return super.getImageHTML(context, args);
	}

	public String getGraphicImageURL(Context context,String args[]) throws FrameworkException
	{
		try{
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			HashMap  reqMap = (HashMap) BusinessUtil.getMap(argsMap, "requestMap");
			String objectId = BusinessUtil.getObjectId(reqMap);
			
			HashMap paramMap = new HashMap();
			paramMap.put("ImageData", reqMap.get("ImageData"));		
	        argsMap.put("paramList", paramMap);
	        argsMap.put("format" ,"format_mxThumbnailImage");	
			StringList finalImages = getImageURLs(context, new StringList(objectId), argsMap, true);		
			return (String) finalImages.get( 0 );
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	
	public String getGraphicImageURLforPOAAction(Context context,String args[]) throws FrameworkException
	{
		try{
			HashMap argsMap = new HashMap();
			String objectId = args[0];
			String mcsURL= args[1];
			HashMap imageMap = new HashMap();
 	        imageMap.put("MCSURL", mcsURL);
			HashMap paramMap = new HashMap();
			paramMap.put("ImageData", imageMap);
			argsMap.put("paramList", paramMap);
	        argsMap.put("format" ,"format_mxSmallImage");	
			StringList finalImages = getImageURLs(context, new StringList(objectId), argsMap, true);		
			return (String) finalImages.get( 0 );
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	/**
	 * @throws Exception 
	 * @deprecated since R2016x
	 */
	public String getGraphicImageHTML(Map hmap) 
	{
		/*if(hmap == null || hmap.isEmpty())
			return "";
		StringBuffer strbuffer = new StringBuffer(100);
		String fcsImageURL = (String)hmap.get(UIComponent.IMAGE_MANAGER_IMAGE_URL);
		String imageSize   = (String)hmap.get(UIComponent.IMAGE_MANAGER_IMAGE_SIZE);
		String imageName   = (String)hmap.get(UIComponent.IMAGE_MANAGER_FILE_NAME);
		if(BusinessUtil.isNullOrEmpty(fcsImageURL))
			return "";
		fcsImageURL = fcsImageURL.replaceAll("//", "//");
		strbuffer.append("<a href=\"javascript:;\">");
		strbuffer.append("<img border=\"0\" src=\"").append(fcsImageURL).append("\" height=\"").append(imageSize).append("\" alt=\"").append(imageName).append("\" title=\"").append(imageName).append("\"/>");
		strbuffer.append("</a>");
		return strbuffer.toString();*/
		return null;
		
	}

	public Map addImageToGraphicElement(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String)argsMap.get(AWLConstants.OBJECT_ID);
			GraphicDocument graphicDoc = new GraphicDocument(strObjectId);
			return graphicDoc.addImage(context, argsMap);
		} catch (Exception e) { throw new FrameworkException(e);}
	}


	public String getGraphicImageActions(Context context, String elementId, boolean isAuthor)throws FrameworkException
	{
		try
		{
			GraphicsElement graphicElement = new GraphicsElement(elementId);
			GraphicDocument graphicDoc = graphicElement.getGraphicDocument(context);
			boolean hasFile = !graphicDoc.getFiles(context).isEmpty();
			return getGraphicImageActions(context, elementId, hasFile, isAuthor);
		} catch(Exception ex){ throw new FrameworkException(ex);}
	}
	
	public String getGraphicImageActions(Context context, String elementId, boolean hasFile, boolean isAuthor)throws FrameworkException
	{
		try
		{
			GraphicsElement graphicElement = new GraphicsElement(elementId);
			GraphicDocument graphicDoc = graphicElement.getGraphicDocument(context);
			String sTipDownload = AWLPropertyUtil.getI18NString(context,"emxTeamCentralStringResource", "emxTeamCentral.ContentSummary.ToolTipDownload", null);
			String sTipAddFiles = AWLPropertyUtil.getI18NString(context,"emxTeamCentralStringResource", "emxTeamCentral.ContentSummary.ToolTipAddFiles", null);
			String strConfirmMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Confirm.UploadGraphicElement");
			if(BusinessUtil.isNotNullOrEmpty(strConfirmMessage) && strConfirmMessage.indexOf('\'')>-1)
				strConfirmMessage = strConfirmMessage.replaceAll("'", "\\\\'");

			StringBuffer strBuf = new StringBuffer(1256);
			if(hasFile) {
				strBuf.append("<a href='javascript:callCheckout(\"").append(graphicDoc.getObjectId(context));
				String quotesSeperateByCommand = "\", \"";
				strBuf.append("\",\"download\", \"").append(quotesSeperateByCommand);
				strBuf.append(quotesSeperateByCommand).append(quotesSeperateByCommand);
				strBuf.append("table").append(quotesSeperateByCommand).append('"');
				strBuf.append(")'>");
	
				strBuf.append("<img border='0' src='../common/images/iconActionDownload.gif' alt=\"").append(sTipDownload)
				.append("\" title=\"").append(sTipDownload);
				strBuf.append("\"></img></a>");	  
			}
			if(isAuthor) {
				String labelDocId = graphicDoc.getId(context);
				strBuf.append("<a style=\"margin-left:10px;\" href=\"javascript:void(0);\" onclick=\"validateUploadImage(\'").append(labelDocId).append("\',\'").append(strConfirmMessage).append("\');\">");	            
				strBuf.append("<img border='0' src='../common/images/iconActionAppend.gif' alt=\"");
				strBuf.append(sTipAddFiles).append("\" title =\"").append(sTipAddFiles);
				strBuf.append("\"></img></a>");
			}
			return strBuf.toString();
		} catch(Exception ex){ throw new FrameworkException(ex);}
	}

	public boolean canReviseGraphicElement(Context context, String[] args) throws FrameworkException
	{
		try{
			String command = "print program $1 select $2 dump $3";
            String className = MqlUtil.mqlCommand(context, command, "AWLGraphicsElement", "classname", "|");
            boolean isAWLDoc = (Boolean) JPO.invokeLocal(context, className, null, "isAWLDocument",args, Boolean.class);
			if(isAWLDoc) {
				HashMap hMap = (HashMap) JPO.unpackArgs(args);		 
				String objectId = (String) hMap.get(AWLConstants.OBJECT_ID);
				GraphicDocument gdoc = new GraphicDocument(objectId);
				String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_GRAPHIC);
				Map activeTask = RouteUtil.getActiveTaskByCopy(context, gdoc.getGraphicElement(context).getObjectId(context));
				if(activeTask!= null && context.getUser().equals(activeTask.get(SELECT_OWNER)) && RELEASE.equals(gdoc.getInfo(context, SELECT_CURRENT)))
					return true;
			}
			return false;
		} catch (Throwable e) {
			throw new FrameworkException(e.toString());
		}
	}  
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getGraphicDetails(Context context, String[] args) throws FrameworkException
	{
		try {
			MapList ml = new MapList();
			HashMap hm = (HashMap) JPO.unpackArgs(args);
			String s = (String)hm.get("docIds");
			StringList sl = FrameworkUtil.split(s, ",");
			for (int i = 0; i < sl.size(); i++) {
				Map m = new HashMap();
				m.put(SELECT_ID, sl.get(i));
				ml.add(m);
			}
			return ml;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public StringList getGraphicElementTypes(Context context,String args[]) throws FrameworkException
	{
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = new MapList(BusinessUtil.getObjectList(argsMap));
			StringList objectIdList = BusinessUtil.getIdList(objectList);
			String[] content = new String[objectIdList.size()];
			String selectHTML = getGETypesSelectHTML(context);
			for(int i=0; i<objectList.size(); i++)
			{
				Map objectMap = (Map)objectList.get(i);
				String objectId = (String) objectMap.get(SELECT_ID);
				GraphicDocument gdoc = new GraphicDocument(objectId);
				GraphicsElement ge = gdoc.getGraphicElement(context);
				if(ge!=null)
				{
					content[i] = ge.getInfo(context, SELECT_TYPE);
				} else {
					content[i] = MessageFormat.format(selectHTML, objectId);
				}
			}		
			return new StringList(content);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public StringList getLocalisedGraphicElementTypes(Context context,String args[]) throws FrameworkException
	{
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = new MapList(BusinessUtil.getObjectList(argsMap));
			StringList objectIdList = BusinessUtil.getIdList(objectList);
			String[] content = new String[objectIdList.size()];
			String selectHTML = getLocalisedGETypesSelectHTML(context);
			
			for(int i=0; i<objectList.size(); i++)
			{
				Map objectMap = (Map)objectList.get(i);
				String objectId = (String) objectMap.get(SELECT_ID);
				GraphicDocument gdoc = new GraphicDocument(objectId);
				GraphicsElement ge = gdoc.getGraphicElement(context);
				if(ge!=null)
				{
					content[i] = EnoviaResourceBundle.getTypeI18NString(context, ge.getInfo(context, SELECT_TYPE), context.getSession().getLanguage());
				} else {
					content[i] = MessageFormat.format(selectHTML, objectId);
				}
			}		
			return new StringList(content);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	private String getLocalisedGETypesSelectHTML(Context context) throws FrameworkException
	{
		try {
			StringList sl = AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.getDerivative(context, false);
			StringBuffer sb = new StringBuffer(100);
			sb.append("<select name=\"getypes{0}\">");
			for(int i=0; i<sl.size(); i++) {
				sb.append("<option value=\"").append(FrameworkUtil.getAliasForAdmin(context, "type", (String) sl.get(i), true)).append("\">")
					.append(EnoviaResourceBundle.getTypeI18NString(context, sl.get(i).toString(),context.getSession().getLanguage()))
					.append("</option>");
			}
			sb.append("</select>");
			return sb.toString();
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	private String getGETypesSelectHTML(Context context) throws FrameworkException
	{
		try {
			StringList sl = AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.getDerivative(context, false);
			StringBuffer sb = new StringBuffer(100);
			sb.append("<select name=\"getypes{0}\">");
			for(int i=0; i<sl.size(); i++) {
				sb.append("<option value=\"").append(FrameworkUtil.getAliasForAdmin(context, "type", (String) sl.get(i), true)).append("\">")
					.append(sl.get(i))
					.append("</option>");
			}
			sb.append("</select>");
			return sb.toString();
		} catch (Exception e) { throw new FrameworkException(e);}
	}

}

