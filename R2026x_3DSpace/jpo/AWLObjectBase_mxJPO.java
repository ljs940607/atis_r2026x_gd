/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.lang.reflect.Method;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.stream.Collectors;

import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPreferences;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.Organization;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIComponent;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.productline.ProductLineUtil;
import com.matrixone.jdom.Document;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.JPOSupport;
import matrix.util.MatrixException;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods","PMD.ExcessivePublicCount","PMD.AvoidCatchingThrowable" })
public class AWLObjectBase_mxJPO extends DomainObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = 4709159803060030993L;
	public static final String EXPAND_LEVEL = "expandLevel";
	
	public AWLObjectBase_mxJPO(Context context, String[] args)
			throws Exception {
		super();
    	if(args != null && args.length > 0) {
    		setId(args[0]);
    	}
	}
	/**
	 * Create instance of JPO for given name. 
	 * @param   context,JPO Name
	 * @return Object : instance of JPO
	 * @throws  FrameworkException 
	 * @since   AWL 2015x.HF3 
	 * @author  AA1
	 * Created back porting 2016x POA-Simplification to 2015x
	 */
	
	public static Object newInstanceOfJPO(Context context,String jpoName)throws MatrixException
	{
		try{
		return JPOSupport.newInstance(context,jpoName);
		}catch(Throwable throwable)
		{
			throw new MatrixException(throwable.getMessage());
		}
	}
	/**
	 * Create instance of JPO for given name with given arguments
	 * @param   context,JPO Name,arguments
	 * @return Object : instance of JPO
	 * @throws  FrameworkException 
	 * @since   AWL 2015x.HF3 
	 * @author  AA1
	 * Created back porting 2016x POA-Simplification to 2015x
	 */
	public static Object newInstanceOfJPO(Context context,String jpoName,String[] jpoArgs )throws MatrixException
	{
		try{
		 String str = JPOSupport.getClassName(context, jpoName);
		return JPOSupport.newInstance(str, context, jpoArgs, Integer.valueOf(0), Boolean.TRUE, Boolean.FALSE);
		}catch(Throwable throwable)
		{
			throw new MatrixException(throwable.getMessage());
		}
	}

public static Object invokeLocal(Context context,String jpoName,String[] jpoArgument,String apiName,String[] apiArgument,Class returnClass)throws MatrixException
{
	try{
		String command = "print program $1 select $2 dump $3";
		String className = MqlUtil.mqlCommand(context, command, jpoName, "classname", "|");
		return JPO.invokeLocal(context, className, jpoArgument, apiName, apiArgument, returnClass);
		}catch(Throwable throwable)
		{
			throw new MatrixException(throwable.getMessage());
		}
}	
public static String getMessageBody(Context context, Document xml, String format) throws Exception
{
	Object apiParamArray[]=new Object[3];
	apiParamArray[0] = context;
	apiParamArray[1] = xml;
	apiParamArray[2] = format;
	Class apiClassArray[]=new Class[3];
	apiClassArray[0] = Context.class;
	apiClassArray[1] = Document.class;
	apiClassArray[2] = String.class;
	return (String)invokeLocalWithMultiParam(context, "emxSubscriptionUtil", null, "getMessageBody", apiParamArray,apiClassArray);
}
public static Document prepareMailXML(Context context, Map headerInfo, Map bodyInfo, Map footerInfo) throws Exception
{
	Object apiParamArray[]=new Object[4];
	apiParamArray[0] = context;
	apiParamArray[1] = headerInfo;
	apiParamArray[2] = bodyInfo;
	apiParamArray[3] = footerInfo;
	Class apiClassArray[]=new Class[4];
	apiClassArray[0] = Context.class;
	apiClassArray[1] = Map.class;
	apiClassArray[2] = Map.class;
	apiClassArray[3] = Map.class;
	com.matrixone.jdom.Document doc =(com.matrixone.jdom.Document)invokeLocalWithMultiParam(context, "emxSubscriptionUtil", null, "prepareMailXML", apiParamArray,apiClassArray);
	return doc;
}
public static String getObjectLink(Context context, String objectId) throws Exception {
	Object apiParamArray[]=new Object[2];
	apiParamArray[0] = context;
	apiParamArray[1] = objectId;
	Class apiClassArray[]=new Class[2];
	apiClassArray[0] = Context.class;
	apiClassArray[1] = String.class;
	return (String)invokeLocalWithMultiParam(context, "emxNotificationUtil", null, "getObjectLink", apiParamArray,apiClassArray);
}
public static Object invokeLocalWithMultiParam(Context context,String jpoName,String[] jpoArgument,String apiName,Object apiParamArray[],Class apiClassArray[])throws Exception
{
	try 
	{
		Object instance=	newInstanceOfJPO(context, jpoName, jpoArgument);
		Method method = instance.getClass().getMethod(apiName, apiClassArray);
		return method.invoke(instance, apiParamArray);
	} 
	catch (Exception e) { throw new FrameworkException(e);}
}	

	
	/**
	 * Invokes Email Notification API
	 * @param Context the eMatrix <code>Context</code> object.
	 * @param toList - To List 
	 * @param subjectKey - Mail Subject Key
	 * @param messageKey - Mail Message Key
	 * @param objectIdList
	 * @return 0 or 1 on Success/Failure
	 * @throws MatrixException
	 */

	public static int sendNotification(Context context, StringList toList, String subjectKey, String messageKey, StringList objectIdList)throws MatrixException
	{
		try 
		{
			String[] EMPTY_ARRAY = new String[]{};
			Map argsMap = new HashMap();
			argsMap.put("toList", toList);
			argsMap.put("ccList", EMPTY_STRINGLIST);
			argsMap.put("bccList", EMPTY_STRINGLIST);
			argsMap.put("subjectKey", subjectKey);
			argsMap.put("subjectKeys", EMPTY_ARRAY);
			argsMap.put("subjectValues", EMPTY_ARRAY);
			argsMap.put("messageKey", messageKey);
			argsMap.put("messageKeys", EMPTY_ARRAY);
			argsMap.put("messageValues", EMPTY_ARRAY);
			argsMap.put("objectIdList", objectIdList);
			argsMap.put("companyName", EMPTY_STRING);

			return (int) invokeLocal(context, "emxMailUtil", null, "sendNotification", JPO.packArgs(argsMap) , Integer.class);
		}
		catch(Throwable throwable) 
		{
			throw new MatrixException(throwable.getMessage());
		}
	}
	
	/**
	 * Invokes Email Notification API
	 * @param Context the eMatrix <code>Context</code> object.
	 * @param toPerson - to Person name 
	 * @param subjectKey - Mail Subject Key
	 * @param messageKey - Mail Message Key
	 * @return 0 or 1 on Success/Failure
	 * @throws MatrixException
	 */
	public static int sendNotification(Context context, String toPerson, String subjectKey, String messageKey)throws MatrixException
	{
		return sendNotification(context, new StringList(toPerson), subjectKey, messageKey, null);
	}
	/**
 	 * Label program for  Tree structure
 	 * @param context
 	 * @param args
 	 * @return
 	 * @throws FrameworkException
      * @since R212
      */
     public String getDisplayNameForNavigator(Context context,String[] args) throws FrameworkException
     {
    	 try{
    		 Map paramMap = (HashMap) ((HashMap) JPO.unpackArgs(args)).get("paramMap");
    		 String strObjectId = (String) paramMap.get("objectId");
    		 StringList slLabelSels = new StringList(DomainConstants.SELECT_REVISION);
    		 slLabelSels.add(DomainConstants.SELECT_TYPE);
    		 slLabelSels.add(AWLAttribute.MARKETING_NAME.getSel(context));
    		 slLabelSels.add(DomainConstants.SELECT_NAME);

    		 Map labelMap = new DomainObject(strObjectId).getInfo(context, slLabelSels);

    		 String name = labelMap.get(DomainConstants.SELECT_NAME).toString();
    		 String revision = labelMap.get(DomainConstants.SELECT_REVISION).toString();
    		 String type = labelMap.get(DomainConstants.SELECT_TYPE).toString();
    		 String strDisplayType = AWLPropertyUtil.getTypeI18NString(context, type, false);

    		 String displayName = labelMap.get(AWLAttribute.MARKETING_NAME.getSel(context)).toString();

    		 String strTreeNameDisplay = PersonUtil.getTreeDisplayPreference(context);
    		 String strTreeName = AWLUtil.strcat(name," ",revision);
    		 if(BusinessUtil.isKindOf(context, strObjectId, AWLType.COPY_ELEMENT.get(context))){
    			 strTreeName = AWLUtil.strcat(name," (",BusinessUtil.getInfo(context, strObjectId, AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context)),") ",revision);
    		 } else if (AWLConstants.TREE_DISPLAY_DISPLAY_NAME.equalsIgnoreCase(strTreeNameDisplay)) {
    			 strTreeName = displayName;
    		 } else if (AWLConstants.TREE_DISPLAY_FULL_NAME.equalsIgnoreCase(strTreeNameDisplay)) {
    			 strTreeName = AWLUtil.strcat(strDisplayType," ",name," ",revision);
    		 } else if (AWLConstants.TREE_DISPLAY_DISPLAY_NAME_REV.equalsIgnoreCase(strTreeNameDisplay)) {
    			 strTreeName=AWLUtil.strcat(displayName," ",revision);
    		 } else if (AWLConstants.TREE_DISPLAY_DISPLAY_NAME_TYPE_REV.equalsIgnoreCase(strTreeNameDisplay)) {
    			 strTreeName=AWLUtil.strcat(strDisplayType," ",displayName," ",revision); 
    		 } else {
    			 strTreeName = ProductLineUtil.getDisplayNameForFeatureNavigator(context, args);
    		 }
    		 return strTreeName;
    	 }catch(Exception e){ throw new FrameworkException(e);}

     }	
	
    public int createAndConnectObject (Context context, String[] args) throws FrameworkException 
    {
  	    try
  	    {
  	  	    String objectId = args[0];
  	  	    String strName = args[1];
  	   	    String strType =  PropertyUtil.getSchemaProperty(context, args[2]);
  	   	    String strRelationship = PropertyUtil.getSchemaProperty(context, args[3]);
  		    String strPolicy = PropertyUtil.getSchemaProperty(context, args[5]);

  	  	    boolean isFrom= "true".equalsIgnoreCase(args[4]);
  	  	    DomainObject domParentOID = new DomainObject(objectId);
  	  	    DomainObject domObj = new DomainObject();

  	        //setting the owner as Logged In user
  	        String loggedinUser = PropertyUtil.getGlobalRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME);
  	    	domObj.createAndConnect(context,strType ,strName ,strRelationship , domParentOID, isFrom);
		    domObj.setOwner(context, loggedinUser);
		    if(BusinessUtil.isNotNullOrEmpty(strPolicy))
			{
	  		    domObj.setPolicy(context, strPolicy);
	  	    }
  	    }
  	    catch(Exception e){ throw new FrameworkException(e);}
  	    return 0;
    }
    
	/* This method is use as trigger method.
	 * Purpose: when you promote any Master Copy Element Object then this method will write the user details on history
	 * of that object
	 * 
	 */
	public void writeContextUserDetailsOnPromote(Context context,String[] args) throws FrameworkException
	{
		String elementId    = args[0];
		String currentState = BusinessUtil.getInfo(context, elementId, SELECT_CURRENT);
		String currentUser  = context.getUser();
		if(PropertyUtil.getSchemaProperty(context, "person_UserAgent").equals(currentUser)) {
			currentUser = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			if(BusinessUtil.isNullOrEmpty(currentUser)) {
				return;
			}
		}
		String mql = "modify bus $1 add history 'Promote' comment $2";
		MqlUtil.mqlCommand(context, mql, true, elementId, AWLUtil.strcat("Promoted to ", currentState, " state by ", currentUser));
	}

	/**
	 * This method is use as trigger method.
	 * Purpose: when you demote any Master Copy Element Object then this method will write the user details on history
	 * of that object
	 * 
	 */
	public void writeContextUserDetailsOnDemote(Context context,String []args) throws FrameworkException
	{
		String elementId    = args[0];
		String currentState = BusinessUtil.getInfo(context, elementId, SELECT_CURRENT);
		String currentUser  = context.getUser();
		if(PropertyUtil.getSchemaProperty(context, "person_UserAgent").equals(currentUser)) {
			currentUser = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			if(BusinessUtil.isNullOrEmpty(currentUser)) {
				return;
			}
		}
		String mql = "modify bus $1 add history 'Demote' comment $2";
		MqlUtil.mqlCommand(context, mql, true, elementId, AWLUtil.strcat("Demoted to ", currentState, " state by ", currentUser));
	}

	@Deprecated 
	//N94 OCd Changes
	public int updateDesignResponsibility(Context context, String[] args) throws FrameworkException {
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) programMap.get("paramMap");
			String strObjectId = (String) paramMap.get("objectId");
			String newRDOID = (String) paramMap.get("New OID");
			
			AWLObject.connectRDO(context, new DomainObject(strObjectId), newRDOID);
		} catch (Exception e) { throw new FrameworkException(e);}
		return 0;
	}
	
	public String dummyString(Context context, String[] args) throws FrameworkException {
		return EMPTY_STRING;
	}

	/**
	 * Expands the Product to Next Possible Levels
	 * @param Context the eMatrix <code>Context</code> object.
	 * @param args holds the following input arguments: The expandLevel passed by user
	 * @return Returns the expandLevel in integer format. If expandfilter is All then set to "0".
	 * @author R2J (Raghavendra M J)
	 * @throws FrameworkException 
	 * @Since R217
	 */
     protected int getExpandLevel(Context context, String[] args) throws FrameworkException
     {
    	 try
    	 {
        	 HashMap programMap = (HashMap) JPO.unpackArgs(args);
        	 String expandLevel = (String)programMap.get(EXPAND_LEVEL);
             
        	 try {
                if ("All".equalsIgnoreCase(expandLevel)) {
                    return 0;
                } else {
                     return Integer.parseInt(expandLevel);   
                }
       		 } catch (Exception e) {
       			 return 1;
       		 }             
         } catch (Exception e){ throw new FrameworkException(e);	}
     }
     
     public void cloneImageHolderFromDocument(Context context, String[] args) throws FrameworkException {
    	 try {
    		 String fromOId = args[0];
    		 String fromType = args[1];
    		 if(GraphicDocument.getGraphicDocumentTypes(context).contains(fromType)) {
    			 ((AWLGraphicsElementBase_mxJPO)newInstanceOfJPO(context,"AWLGraphicsElement" , new String[] {fromOId})).cloneImageHolderFromDocument(context, args);
    		 } else if(AWLType.ARTWORK_FILE.get(context).equals(fromType)) {
    			 ((AWLArtworkFileBase_mxJPO)newInstanceOfJPO(context,"AWLArtworkFile" , new String[] {fromOId})).cloneImageHolderToPOA(context, args);
    		 }
    	 } catch (Exception e){ throw new FrameworkException(e);}
     }
     
	// Returns Organization name based on Logged In User's security Context
	public String getCurrentOrg(Context context, String[] args) throws Exception {
		//LIP: Host company rename FD05
		String companyName = PersonUtil.getDefaultOrganization(context,context.getUser());
		String currentOrg = Organization.getCompanyTitleFromName(context, companyName);
		if (BusinessUtil.isNotNullOrEmpty(currentOrg)) {
			return currentOrg;
		} else {
			return "";
		}
	}
     
     /**
 	 * Check passed User has required access for operation
 	 * used in Check Trigger for Artwork Element Content Policy and Artwork File Policy
 	 * @return boolean value
 	 * @author N94 
 	 * @throws FrameworkException 
 	 * @Since R217
 	 */
     public int hasRequiredAccess(Context context,  String[] args) throws FrameworkException {

    	 if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
    		 throw new IllegalArgumentException();
    	 try {
    		 String objectId = args[0];
    		 
    		 String accessCheck = args[1];
    		 String accessMsgKey=args[2];
    		 
    		 String licenseCheck =args[3];
    		 String licenseMsgKey =args[4];

    		 boolean doAccessCheck = BusinessUtil.isNotNullOrEmpty(accessCheck);
    		 boolean doLicenseCheck = BusinessUtil.isNotNullOrEmpty(licenseCheck);
    		 
    		 boolean isCtxPushed = "User Agent".equals(context.getUser()) &&
    				 BusinessUtil.isNotNullOrEmpty(PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false));

    		 if(doAccessCheck) {
        		 boolean requiredAccessNotPresent = isCtxPushed && !Access.hasRequiredAccess(context, objectId, 
        				 PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false), accessCheck);
        		 
        		 
        		 if(requiredAccessNotPresent){
        			 String key = BusinessUtil.isNotNullOrEmpty(accessMsgKey) ? accessMsgKey : "emxAWL.UserAction.NotHaveRequiredAccess"; 
        			 String errorMessage  = AWLPropertyUtil.getI18NString(context, key);
        			 MqlUtil.mqlCommand(context, "notice $1", errorMessage);
        			 return 1;
        		 }
    		 }
    		 

    		 if(doLicenseCheck) {
    			 Access.checkRequiredAccess(context, licenseCheck);
       		 }
    		 
    		 if(BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_ELEMENT.get(context))) {
    			 ArtworkContent content = ArtworkContent.getNewInstance(context, objectId);
    			 return content.checkStructureStateWithRoot(context, accessCheck);
    		 }
    		 
    		 return 0;					  
    	 } catch (Exception e) { throw new FrameworkException(e); }
     }
     
 	public StringList showCountries(Context context, String args[]) throws FrameworkException
 	{
   		try
   		{
  			Map programMap = (Map) JPO.unpackArgs(args);
  			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
  			
			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);
			String export = BusinessUtil.getString(paramList, "exportFormat");
			
			return showCountries(context, objectIdList, export);

   		} catch (Exception e) { throw new FrameworkException(e); }
 	}
 	
 	
 	public String showCountries(Context context, String objectId, String export) throws FrameworkException {
 		return (String) showCountries(context, new StringList(objectId), export).get(0);
 	}

	public StringList showCountries(Context context, StringList objectIdList, String export) throws FrameworkException
	{
  		try
  		{
  			StringList objType = BusinessUtil.getInfo(context, objectIdList, SELECT_TYPE);
  			
  			String POA = AWLType.POA.get(context);
  			String COPY_LIST = AWLType.COPY_LIST.get(context);
  			String ARTWORK_TEMPLATE = AWLType.ARTWORK_TEMPLATE.get(context);
  			String CPG_PRODUCT = AWLType.CPG_PRODUCT.get(context);
  			
  			Map<String, StringList> derivedTypes = new HashMap<String, StringList>(4);
			derivedTypes.put(POA, AWLType.POA.getDerivative(context, false, true));
			derivedTypes.put(COPY_LIST, AWLType.COPY_LIST.getDerivative(context, false, true));
			derivedTypes.put(ARTWORK_TEMPLATE, AWLType.ARTWORK_TEMPLATE.getDerivative(context, false, true));
			derivedTypes.put(CPG_PRODUCT, AWLType.CPG_PRODUCT.getDerivative(context, false, true));
			
			Map<String, AWLRel> countriesSEL = new HashMap<String, AWLRel>(4);
			countriesSEL.put(POA, AWLRel.POA_COUNTRY);
			countriesSEL.put(COPY_LIST, AWLRel.COPY_LIST_COUNTRY);
			countriesSEL.put(ARTWORK_TEMPLATE, AWLRel.COUNTRIES_ASSOCIATED);
			countriesSEL.put(CPG_PRODUCT, AWLRel.CANDIDATE_MARKETS);

			Map<String, StringList> idsByType = new HashMap<String, StringList>(4);
			for (int i = 0; i < objectIdList.size(); i++)
			{
				String id = (String) objectIdList.get(i);
				String type = (String) objType.get(i);
				
				for (String derivedFrom : derivedTypes.keySet()) {
					if(derivedTypes.get(derivedFrom).contains(type)) {
						StringList ids = idsByType.get(derivedFrom);
						ids = BusinessUtil.isNullOrEmpty(ids) ? new StringList() : ids;
						ids.add(id);
						idsByType.put(derivedFrom, ids);
					}
				}
			}
			
			Map<String, StringList> countriesByID = new HashMap<String, StringList>(objectIdList.size());
			for (String type : countriesSEL.keySet()) {
				StringList ids = idsByType.get(type);
				if(BusinessUtil.isNullOrEmpty(ids))
					continue;
				String SEL_REL = AWLUtil.strcat("from[", countriesSEL.get(type).get(context), "].to.name");
				MapList list = BusinessUtil.getInfoList(context, ids, SEL_REL); 
				for (int i = 0; i < ids.size(); i++) {
					countriesByID.put((String)ids.get(i), BusinessUtil.getStringList((Map)list.get(i), SEL_REL));
				}
			}
			
  			boolean isExporting = BusinessUtil.isNotNullOrEmpty(export);
  			
  			StringList countriesList = new StringList(objectIdList.size());
  			String manageCountriesHTML = "<a href=\"javascript:;\" title=\"{0}\"  onclick=\"openProductManageCandidateMarkets(''{1}'');\" ><strong>{0}</strong></a>";
			String noCountriesText = AWLPropertyUtil.getI18NString(context, "emxAWL.Action.AssignCandidateMarkets");
			String toolTipText =  AWLPropertyUtil.getI18NString(context, "emxAWL.Label.POACountries");
			boolean hasLicense = Access.hasRequiredLicense(context, "ProductAddCountries");

			StringList productIDs = idsByType.get(CPG_PRODUCT);
			productIDs = BusinessUtil.isNullOrEmpty(productIDs) ? new StringList() : productIDs;
  			
			for (String objectId : (List<String>)objectIdList) 
  			{
  				StringList  countriesAssigned = countriesByID.get(objectId);

  				boolean isProduct = productIDs.contains(objectId);
  				if(BusinessUtil.isNullOrEmpty(countriesAssigned)) {
  					if(isProduct && hasLicense) {
  						countriesList.add(isExporting ? EMPTY_STRING :  MessageFormat.format(manageCountriesHTML, noCountriesText, objectId));
  					} else {
  						countriesList.add(EMPTY_STRING);
  					}
  					continue;
  				}
				  				
  				String rel = null;
  				for (String derivedFrom : idsByType.keySet()) {
  					if(idsByType.get(derivedFrom).contains(objectId)) {
  						rel = countriesSEL.get(derivedFrom).toString();
  						break;
  					}
  				}
  				String[] javaScriptMethodArgsArray = {objectId, rel, AWLType.COUNTRY.toString(), "false" , "true", toolTipText};
				countriesList.add(generateHTMLForMoreObjects(context, countriesAssigned, true, toolTipText, isExporting, "showAssociatedObjects", javaScriptMethodArgsArray));

  			}
  			return countriesList;
  		}catch (Exception e){ throw new FrameworkException(e);	}
	}
  	
  	
	protected StringList getImageURLs(Context context, StringList idsList, Map argsMap, boolean returnHTML) throws FrameworkException
	{
		try {
			if(BusinessUtil.isNullOrEmpty(idsList)) {
				return new StringList();
			}
			MapList objectList = new MapList();
			for (Iterator iterator = idsList.iterator(); iterator.hasNext();) {
				Map map = new HashMap();
				map.put(SELECT_ID, iterator.next());
				objectList.add(map);
			}

			Map imageManagerMap = new HashMap(argsMap);
			imageManagerMap.put(UIComponent.IMAGE_MANAGER_GENERATE_HTML_FLAG, "false");
			imageManagerMap.put(BusinessUtil.OBJECT_LIST, objectList);

			String newargs[] = JPO.packArgs(imageManagerMap);
			StringList finalImages = BusinessUtil.toStringList((Vector)invokeLocal(context, "emxImageManager", newargs, "getImageURLs", newargs, Vector.class));
			if(returnHTML) {
				StringList imageHTML = new StringList(finalImages.size());
				for (Iterator iterator = finalImages.iterator(); iterator.hasNext();) {
					Map object = (Map) iterator.next();
					imageHTML.add(getImageHTML(object));
				}
				return imageHTML;
			} else {
				return finalImages;	
			}
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	private String getImageHTML(Map hmap) 
	{
		if(hmap == null || hmap.isEmpty())
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
		return strbuffer.toString();
	}
	
	public StringList getImageHTML(Context context,String args[]) throws FrameworkException
	{
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = new MapList(BusinessUtil.getObjectList(argsMap));

			StringList objectIdList = BusinessUtil.getIdList(objectList);
			StringList imageHolder = BusinessUtil.getInfo(context, objectIdList, AWLUtil.strcat("to[" + AWLRel.IMAGE_HOLDER.get(context) + "]")); 
					
			String[] content = new String[objectIdList.size()];
			Arrays.fill(content, "");
			
			StringList graphicIdsList = new StringList(objectIdList.size());
			for(int i=0; i<objectList.size(); i++)
			{
				if("true".equalsIgnoreCase((String) imageHolder.get(i)))
				{
					graphicIdsList.add((String) objectIdList.get(i));
				} 
			}		

			StringList finalImages = getImageURLs(context, graphicIdsList, argsMap, true);
			for (int i = 0; i < objectIdList.size(); i++) {
				int graphicIndex = graphicIdsList.indexOf(objectIdList.get(i));
				if(graphicIndex != -1) {
					content[i] = (String) finalImages.get(graphicIndex);
				}
			}
			return new StringList(content);
		} catch (Exception e) { throw new FrameworkException(e);}
	}	
     

	/**
	 * Support for emxDomainObjectBase mxJPO as extending is removed.
	 */
	public static void setUpdatestamp(Context context, String[] args) throws Exception {
		try
		{
			invokeLocal(context, "emxDomainObject", args, "setUpdatestamp", args, null);
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
    }
  public String hasRelationship(Context context, String args[]) throws Exception {
		try
		{
			return (String)invokeLocal(context, "emxDomainObject", args, "hasRelationship", args, String.class);
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
  }
  
  
  /**
	 * Program HTML Program which will returns the Associated Local Languages of POA,CopyList. 
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @param  objectId - Object Id of the CPG Product
	 * @return String	Column Map Values of the Expanded Objects in HTML format
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since  VR2015x.HF1
	 * Created during 'POA Simplification Highlight'
	 */
  	@SuppressWarnings("unchecked")
	public StringList showLanguagesAssociated(Context context, String args[]) throws FrameworkException
	{
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));

			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);

			StringList poaTypes = AWLType.POA.getDerivative(context, false, true);
			StringList clTypes = AWLType.COPY_LIST.getDerivative(context, false, true);
			StringList ceTypes = AWLType.COPY_ELEMENT.getDerivative(context, false, true);

			StringList objType = BusinessUtil.getInfo(context, objectIdList, SELECT_TYPE);

			List<String> clIdList = new ArrayList<String>();
			List<String> poaIdList = new ArrayList<String>();
			List<String> ceIdList = new ArrayList<String>();

			for (int i = 0; i < objectIdList.size(); i++)
			{
				String id = (String) objectIdList.get(i);
				String type = (String) objType.get(i);

				if(poaTypes.contains(type)) {
					poaIdList.add(id);
				} else if(clTypes.contains(type)) {
					clIdList.add(id);
				} else if(ceTypes.contains(type)) {
					ceIdList.add(id);
				}  
			}

			Map<String, StringList> clLanguageMap = null;
			Map<String, String> ceLanguageMap = null;
			
			if(!clIdList.isEmpty()) {
				clLanguageMap = new HashMap<String, StringList>(clIdList.size());
				boolean isProductLineArtworkElements = false;
				if(BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(paramList, "isProductLineArtworkElements")))
					isProductLineArtworkElements = "true".equalsIgnoreCase(BusinessUtil.getString(paramList, "isProductLineArtworkElements"));
				if (isProductLineArtworkElements) {
					Map<String, Map> clInfoById = ((List<Map>) objectList).stream()
							.collect(Collectors.toMap(currentMap -> {
								return (String) currentMap.get(SELECT_ID);
							}, currentMap -> {
								return currentMap;
							}));
					clLanguageMap = clInfoById.entrySet().stream()
							.filter(clObject -> clIdList.contains(clObject.getKey())
									&& clObject.getValue().containsKey("languages"))
							.collect(Collectors.toMap(currentMap -> currentMap.getKey(), currentMap -> {
								StringList languageNames = (StringList) currentMap.getValue().get("languages");
								Collections.sort(languageNames);
								return languageNames;
							}));
				} else {
					String selCLLang = AWLUtil.strcat("from[", AWLRel.COPY_LIST_LOCAL_LANGUAGE.get(context),
							"].to.name");
					MapList copyListlanguages = BusinessUtil.getInfoList(context, BusinessUtil.toStringList(clIdList),
							selCLLang);
					for (int i = 0; i < clIdList.size(); i++) {
						Map languageInfoMap = (Map) copyListlanguages.get(i);
						StringList languageNames = (StringList) languageInfoMap.get(selCLLang);
						Collections.sort(languageNames);
						clLanguageMap.put(clIdList.get(i), languageNames);
					}
				}
			}

			if(!ceIdList.isEmpty()) 
			{
				ceLanguageMap = new HashMap<String, String>(ceIdList.size());
				StringList ceLang = BusinessUtil.getInfo(context, 
						BusinessUtil.toStringList(ceIdList), AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context));
				for(int i = 0; i < ceIdList.size(); i++){
					ceLanguageMap.put(ceIdList.get(i), (String)ceLang.get(i));
				}				
			}			

			String toolTipText =  AWLPropertyUtil.getI18NString(context, "emxAWL.common.Languages");
			boolean isExporting = BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(paramList, "exportFormat"));

			StringList returnList = new StringList(objectIdList.size());

			for (int i = 0; i < objectIdList.size(); i++) 
			{
				StringList langAssociated = new StringList();
				String objectId = objectIdList.get(i).toString();
				boolean isPOA = poaIdList.contains(objectId);
				boolean isCL =  clIdList.contains(objectId);
				boolean isCE =  ceIdList.contains(objectId);

				langAssociated = isPOA ? new POA(objectId).getLanguageNames(context) : 
								 isCL ? clLanguageMap.get(objectId) : 
								 isCE ? new StringList(ceLanguageMap.get(objectId)) : new StringList();
								 
				boolean sortVals =  (isCL || isPOA) ? false : true;

				AWLRel localLanguagueRel = isPOA ? AWLRel.POA_LOCAL_LANGUAGE : AWLRel.COPY_LIST_LOCAL_LANGUAGE; 
				String[] javaScriptMethodArgsArray = {objectId, localLanguagueRel.toString(), AWLType.LOCAL_LANGUAGE.toString(), "false" , "FALSE", toolTipText};
				returnList.add(generateHTMLForMoreObjects(context, langAssociated, sortVals, toolTipText, isExporting, "showAssociatedObjects", javaScriptMethodArgsArray));
			}			
			return returnList;
		} catch(Exception e){ throw new FrameworkException(e);}
	}
	/** This trigger method  Will check for active routes on passed Objects. 
	 * @param   context - the Enovia <code>Context</code> object 
	 * @param   args
	 * @since   AWL R417 FD04
	 * @author  ukh1
	 * @throws FrameWorkException 
	 * Created during CopyList Highlight
	 */
	public int hasActiveRoutes (Context context, String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();
			String objId = args[0];	
			String errKey = args[1];	
			//if active route is there then dont allow to promote to release state
			StringList routeIDs = RouteUtil.getConnectedRouteIDs(context, objId, null);
			if(BusinessUtil.isNotNullOrEmpty(routeIDs)){
				MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context, errKey));
				return 1;
			}
			return 0;	
		}
		catch(Exception e) {throw new FrameworkException(e);}
	}
	
	/**
	 * Generates the HTML For the Multiple Objects
	 * @param  context the eMatrix <code>Context</code> object
	 * @param objectNames - Objects to build the HTML String
	 * @param sort - To Sort the Objects
	 * @param headerKey - Header to display
	 * @param forExport - Is the Obejects for Exporting
	 * @param javaScriptMethodName - Desired JavaScript Method to call
	 * @param javaScriptMethodArgs - arguments to the JavaScript Method
	 * @return Generated HTML String
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF6
	 * Created during 'Customization Kit Highlight'
	 */
	public String generateHTMLForMoreObjects(Context context, 
											StringList objectNames, 
											boolean sort, 
											String headerKey,
											boolean forExport,
											String javaScriptMethodName,
											String... javaScriptMethodArgs) throws FrameworkException
	{

		if(sort)
			Collections.sort(objectNames);
		if(forExport)
			return FrameworkUtil.join(objectNames, ",");


		int objectsToDisplay = objectNames.size() > 3 ? 3 : objectNames.size();

		StringList ObjectNamesEncoded = new StringList(objectsToDisplay);
		for (int j = 0; j < objectsToDisplay; j++) 
		{
			ObjectNamesEncoded.add(XSSUtil.encodeForHTML(context, (String) objectNames.get(j)));
		}

		if(objectNames.size() <= 3)
			return AWLUtil.strcat(FrameworkUtil.join(ObjectNamesEncoded, ", "));


		StringBuffer infoForMoreObjectsHtml = buildHTMLString(headerKey, javaScriptMethodName, javaScriptMethodArgs);
		infoForMoreObjectsHtml.append(AWLUtil.strcat("+", objectNames.size()-3, "</a>"));
		return AWLUtil.strcat(FrameworkUtil.join(ObjectNamesEncoded, ", "), ", ", infoForMoreObjectsHtml);
	}
	
	/** Returns the JavaScript String
	 * @param objectNames - Objects to build the HTML String
	 * @param headerKey - Header to display
	 * @param javaScriptMethodName - Desired JavaScript Method to call
	 * @param javaScriptMethodArgs - arguments to the JavaScript Method
	 * @return Returns the JavaScript String
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF6
	 * Created during 'Customization Kit Highlight'
	 */
	private StringBuffer buildHTMLString(String headerKey, String javaScriptMethodName, String... javaScriptMethodArgs) 
	{
		String jsInclude = "<script language=\"javascript\" type=\"text/javascript\" src=\"../awl/scripts/emxAWLUtil.js\"></script>";

		StringBuffer infoForMoreObjectsHtml = new StringBuffer(500);

		infoForMoreObjectsHtml.append(AWLUtil.strcat(jsInclude, "<a href=\"javascript:;\" title=\""+headerKey +"\"  onclick=\""+javaScriptMethodName+"('"));

		for (int i = 0; i < javaScriptMethodArgs.length; i++) {
			String argument = javaScriptMethodArgs[i];
			infoForMoreObjectsHtml.append(argument);

			if(javaScriptMethodArgs.length -1 == i)
				infoForMoreObjectsHtml.append("');\" >");
			else
				infoForMoreObjectsHtml.append("', '");
		}
		return infoForMoreObjectsHtml;
	}
	
	
	/**
	 * @deprecated
	 * @param context
	 * @param args
	 * @throws FrameworkException
	 */
	public void connectImageHolderToDocument(Context context, String[] args) throws FrameworkException
	{
		try
		{
			//If no image conversion is configured we can ignore the conversion of file into image.
			//generally checked in file will be ai, without image conversion utility conversion is not possible
			if(BusinessUtil.isNullOrEmpty(AWLPropertyUtil.getConfigPropertyString(context,"emxComponents.ImageManager.ImageUtility.Name")))
			{
				return;
			}
			invokeLocal(context, "emxCPDUtil", null, "connectImageHolderToDocument", args, null);
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	public void documentCheckInFileSyncImageHolder(Context context, String[] args) throws FrameworkException
	{
		try
		{
			invokeLocal(context, "emxCPDUtil", null, "documentCheckInFileSyncImageHolder", args, null);
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public void documentDeleteSyncImageHolder(Context context, String[] args) throws FrameworkException
	{
		try
		{
			invokeLocal(context, "emxCPDUtil", null, "documentDeleteSyncImageHolder", args, null);
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public Map getMajorMinorID(Context context, String[] args) throws FrameworkException {
		try{
			return (Map) invokeLocal(context, "emxCPDUtil", null, "getMajorMinorID", args , Map.class);
		}
		catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * Search Query for filtering the "Change Order" Connected to the "Change Template"
	 * @param   context 
	 * @param   args - Arguments of Necessary Information. 
	 * @throws  FrameworkException 
	 * @since   R417
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight . 
	 */
	public String getChangeOrderSearchQuery(Context context, String[] args) throws FrameworkException 
	{
		try
	{
		HashMap programMap = (HashMap)JPO.unpackArgs(args);
		Map fieldValuesMap = (HashMap)programMap.get("fieldValues");
		String chtId = (String)fieldValuesMap.get("ChangeTemplateOID");
		String COQuery = "";
		if(UIUtil.isNullOrEmpty(chtId))
			COQuery="TYPES=type_ChangeOrder:CURRENT=policy_FasttrackChange.state_Prepare";
		else
			COQuery="CO_CHANGEORDER="+chtId+":TYPES=type_ChangeOrder:CURRENT=policy_FasttrackChange.state_Prepare";

		return COQuery;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Gets the Value for Each Columns
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return StringList	List of Column Values of the Objects
	 * @throws FrameworkException
	 * @Since VR2015x.HF10
	 * Created during 'Roundtrip Sync Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getValueFromMap(Context context,String[] args) throws FrameworkException {
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			Map  columnMap  = BusinessUtil.getColumnMap(programMap);
			Map  settingMap = (Map)columnMap.get(AWLConstants.STR_SETTINGS);
			//String get key from setting and return stringlist of given map based on keytoken
			String key= (String)settingMap.get("KeyToken");
			return BusinessUtil.toStringList(BusinessUtil.getObjectList(programMap), key);
		} catch(Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	 * To Complete the Completed Routes.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - No Explicit return value
	 * @throws FrameworkException
	 * @Since VR2015x.HF12
	 * @author Naveen Bommu (BNN2)
	 */
	public void completeStoppedRoutes(Context context, String[] args) throws FrameworkException {
		try {
			String strObjectId = args[0];
			String routeBaseState = args[1];
			DomainObject dObj = DomainObject.newInstance(context, strObjectId);
			StringBuilder objWhere = new StringBuilder(30);
			objWhere.append(SELECT_CURRENT).append("==\"").append(STATE_ROUTE_IN_PROCESS).append("\"&&");
			objWhere.append(getAttributeSelect(ATTRIBUTE_ROUTE_STATUS)).append("==Stopped");
			StringBuilder relWhere = new StringBuilder();
			relWhere.append(getAttributeSelect(ATTRIBUTE_ROUTE_BASE_STATE)).append("==").append(routeBaseState);
			MapList routes = dObj.getRelatedObjects(context, 
					RELATIONSHIP_OBJECT_ROUTE, TYPE_ROUTE, BusinessUtil.toStringList(SELECT_ID), 
					new StringList(), false, true, (short)1, objWhere.toString(), relWhere.toString(),0);
			for (Object object : routes) {
				Map route = (Map)object;
				RouteUtil.completeRouteOnRejection(context, BusinessUtil.getString(route, SELECT_ID));
			}
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * Method checks if DocumentLockStatus is enabled or displayed on user preference. 
	 * @param context - the eMatrix <code>Context</code> object
	 * @param args - String[] - Enovia JPO packed arguments
	 * @return true is Display Document Lock Status preference is set to Yes in person preference.
	 * @throws FrameworkException
	 */
	public boolean isDocumentLockStatusEnabled(Context context, String[] args) throws FrameworkException
	{
		try
		{
			return AWLConstants.RANGE_YES.equalsIgnoreCase(AWLPreferences.getDisplayDocumentLockStatus(context))? true: false;
		} catch(Exception e)
		{
			throw new FrameworkException(e);
		}
	}
}

