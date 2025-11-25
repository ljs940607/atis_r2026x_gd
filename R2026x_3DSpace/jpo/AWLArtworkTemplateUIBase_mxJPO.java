/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.ArtworkTemplate;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;

public class AWLArtworkTemplateUIBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = -5655957929987762868L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLArtworkTemplateUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	/**
	 * Method call to get all the Connected Artwork Templates to the CPG Product.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments. 
	 * @return Object - MapList containing the id of all Artwork Templates Connected.
	 * @throws Exception if operation fails
	 * @author Raghavendra (R2J)
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkTemplates(Context context, String[] args) throws FrameworkException 
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(BusinessUtil.OBJECT_ID);
			String whereExp = AWLUtil.strcat("current != '", AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_TEMPLATE) ,"'");
			AWLObject object = (AWLObject) DomainObject.newInstance(context, objectId, AWLConstants.APPLICATION_AWL);
			return object.related(AWLType.ARTWORK_TEMPLATE, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE).where(whereExp).query(context);
		}  catch (Exception e){ throw new FrameworkException(e);	}
	
	}

	/**
	 * Artwork Template Creation command will be displayed in the UI if this method returns true otherwise will not be displayed.
	 * Checks :
	 * 1) If context is Product Line
	 * 		a) context user should be Product Manager.
	 * 	  	b) Product Line should be in Planned / Marketing state
	 * 2) If context is Product
	 * 		a) context user should be Product Manager.
	 * 	  	b) Product Line should be in Preliminary / Design Engineering / Product Management state
	 * 3) If context is POA
	 * 		a) context user should be Product Manager / Artwork Project Manager / Graphic Designer 
	 * 		b) POA should not associated with Artwork Template
	 * 		c) POA connected product should be in Preliminary / Design Engineering / Product Management state
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments. 
	 * @return Object - MapList containing the id of all Artwork Templates Connected.
	 * @throws Exception if operation fails
	 * @author Subba Rao G (SY6)
	 * @deprecated - use canCreateOrAssociateArtworkTemplate 
	 */
	public static Boolean canCreateArtworkTemplate(Context context, String[] args) throws FrameworkException
	{
		try {
			return new AWLArtworkTemplateUIBase_mxJPO(context, args).canCreateOrAssociateArtworkTemplate(context, args);
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	/**
	 * Artwork Template Creation/Association command will be displayed in the UI if this method returns true otherwise will not be displayed.
	 * Checks :
	 * 1) If context is Product Line
	 * 		a) context user should be Product Manager.
	 * 	  	b) Product Line should be in Planned / Marketing state
	 * 2) If context is Product
	 * 		a) context user should be Product Manager.
	 * 	  	b) Product Line should be in Preliminary / Design Engineering / Product Management state
	 * 3) If context is POA
	 * 		a) context user should be Product Manager / Artwork Project Manager / Graphic Designer 
	 * 		b) POA should not associated with Artwork Template
	 * 		c) POA connected product should be in Preliminary / Design Engineering / Product Management state
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments. 
	 * @return Object - MapList containing the id of all Artwork Templates Connected.
	 * @throws Exception if operation fails
	 * @author Subba Rao G (SY6)
	 */
	public Boolean canCreateOrAssociateArtworkTemplate(Context context, String[] args)throws FrameworkException
	{
		try
		{
			HashMap hMap = (HashMap) JPO.unpackArgs(args);		 
			String objectId = (String) hMap.get(AWLConstants.OBJECT_ID);
			
			boolean showCommand = false;
			boolean isPM  = Access.hasRole(context, Access.COPY_ARTWORK_ROLES.PRODUCT_MANAGER);;
			
			if(BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context))) 
			{
				boolean isGD = Access.hasRole(context, Access.COPY_ARTWORK_ROLES.GRAPHIC_DESIGNER);
				boolean isAPM = Access.hasRole(context, Access.COPY_ARTWORK_ROLES.ARTWORK_PROJECT_MANAGER);
				boolean hasRequiredRole =  isGD || isAPM || isPM ; 
				
				if(!hasRequiredRole)
					return false ; 
				
				String currentState = BusinessUtil.getInfo(context, objectId, SELECT_CURRENT);
				boolean validPOAState = AWLState.DRAFT.equalsObjectState(context, AWLPolicy.POA, currentState) ||
										AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.POA, currentState) || 
										AWLState.ARTWORK_IN_PROCESS.equalsObjectState(context, AWLPolicy.POA, currentState);
				
				POA poa = new POA(objectId);
				if(validPOAState && poa.getArtworkTemplate(context) == null) 
				{
					showCommand = checkForProductHierarchyState(context, poa.getPlaceOfOriginId(context), true);
				}
			}
			else
			{
				showCommand = checkForProductHierarchyState(context, objectId, isPM);
			}

			return showCommand;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	private boolean checkForProductHierarchyState(Context context, String objectId, boolean hasRequiredRole) throws FrameworkException
	{
		if(!hasRequiredRole)
		{
			return false;
		}
		boolean isValidHierarchyState = false ;
		String currentState = BusinessUtil.getInfo(context, objectId, SELECT_CURRENT);
		if(BusinessUtil.isKindOf(context, objectId, AWLType.PRODUCT_LINE.get(context))) {

			isValidHierarchyState = AWLState.PLANNED.equalsObjectState(context, AWLPolicy.PRODUCT_LINE, currentState) || 
						  			AWLState.MARKETING.equalsObjectState(context, AWLPolicy.PRODUCT_LINE, currentState);

		} else if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context))) {

			isValidHierarchyState = AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.PRODUCT, currentState) ||
						  			AWLState.DESIGN_ENGINEERING.equalsObjectState(context, AWLPolicy.PRODUCT, currentState) ||
						  			AWLState.PRODUCT_MANAGEMENT.equalsObjectState(context, AWLPolicy.PRODUCT, currentState); 
		} 
		return isValidHierarchyState;
	}
	
	/**@author SY6
	 * This method excludes the Artwork Templates which are connected to the context Object.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - StringList containing the id of all excluded Artwork Templates
	 * @throws Exception if operation fails
	 * @grade 0
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeConnectedArtworkTemplates(Context context, String [] args) throws FrameworkException
	{
		try
		{	
			Map<String, String> programMap = (Map) JPO.unpackArgs(args);
			String contextObject = programMap.get(BusinessUtil.OBJECT_ID);					
			AWLObject awlObject = (AWLObject) DomainObject.newInstance(context, contextObject, AWLConstants.APPLICATION_AWL);
			MapList artworkTemplateList = awlObject.related(AWLType.ARTWORK_TEMPLATE, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE).id().type().query(context);
			return BusinessUtil.toStringList(artworkTemplateList, DomainConstants.SELECT_ID);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	/**@author SY6
	 * This method gets the Artwork Templates which are connected to the product.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - HashMap containing one String entry for key "objectId"
	 * @return Object - StringList containing the id of all included Artwork Templates
	 * @throws Exception if operation fails
	 * @grade 0
	 */
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList includeProductArtworkTempaltes(Context context, String [] args) throws FrameworkException
	{
		try
		{	
			Map<String, String> programMap = (Map) JPO.unpackArgs(args);
			String contextObject = programMap.get(BusinessUtil.OBJECT_ID);					

			String placeOfOriginId = new POA(contextObject).getPlaceOfOriginId(context);
			StringList hierarchyIds = AWLUtil.getHierarchyIds(context, placeOfOriginId, true, false, true);
			
			String ASSOCIATED_ARTWORK_TEMPLATES =  AWLUtil.strcat("from[", AWLRel.ASSOCIATED_ARTWORK_TEMPLATE.get(context), "].to.id");
			
			MapList templateInfo = BusinessUtil.getInfoList(context, hierarchyIds, ASSOCIATED_ARTWORK_TEMPLATES);

			StringList templateIds = new StringList();

			for (Map tempMap :(List<Map>) templateInfo) {
				templateIds.addAll(BusinessUtil.getStringList(tempMap, ASSOCIATED_ARTWORK_TEMPLATES));
			}

			return templateIds;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	
	/**
	 * Artwork Template Association command will be displayed in the UI if this method returns true otherwise will not be displayed.
	 * Checks :
	 * 1) If context is Product Line
	 * 	  	a) Product Line should be in Planned / Marketing state
	 * 2) If context is Product
	 * 	  	a) Product Line should be in Preliminary / Design Engineering / Product Management state
	 * 3) If context is POA
	 * 	  	a) POA should be in Preliminary /Artwork In Process
	 *      b) POA should not be connected with Artwork Template
	 *      c) POA connected product should be in Preliminary / Design Engineering / Product Management state
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments. 
	 * @return Object - MapList containing the id of all Artwork Templates Connected.
	 * @throws Exception if operation fails
	 * @author Subba Rao G (SY6)
	 * @deprecated - Use canCreateOrAssociateArtworkTemplate method
	 */
	public Boolean canAssociateArtworkTemplate(Context context, String[] args) throws FrameworkException
	{
		try 
		{
			return canCreateOrAssociateArtworkTemplate(context, args);
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}

	
	
	/**
	 * Displays Actions in the Artwork Template Summary Table
	 * 1) Download icon will be displayed only if file is present.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments.
	 * @throws Exception if operation fails
	 * @author Subba Rao G (SY6)
	 */
	public StringList getArtworkTemplateSearchActionsHTML(Context context, String[] args) throws FrameworkException
	{
		StringList artworkTemplateActionsList = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);					
			for(int i=0; i<objectList.size(); i++) {
				Map objectMap = (Map)objectList.get(i);				
				ArtworkTemplate artworkTemplate = new ArtworkTemplate(BusinessUtil.getId(objectMap));
				boolean hasFile = artworkTemplate.hasFile(context);
				
				StringBuffer strBuf = new StringBuffer(1256);
				if(hasFile){
					String sTipDownload = AWLPropertyUtil.getI18NString(context,"emxTeamCentralStringResource", "emxTeamCentral.ContentSummary.ToolTipDownload", null);
					strBuf.append("<a href='javascript:callCheckout(\"").append(artworkTemplate.getObjectId(context));
					String STR1 = "\", \"";
					strBuf.append("\",\"download\", \"").append(STR1);
					strBuf.append(STR1).append(STR1);
					strBuf.append("table").append(STR1).append('"');
					strBuf.append(")'>");
					strBuf.append("<img border='0' src='../common/images/iconActionDownload.gif' alt=\"").append(sTipDownload)
					.append("\" title=\"").append(sTipDownload);
					strBuf.append("\"></img></a>&#160;");
				}
				
				artworkTemplateActionsList.add(strBuf.toString());
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return artworkTemplateActionsList;
	}
	
	/**
	 * It returns Artwork Template Countries
	 * a) More than 4 countries present then 4 countries plus ellipse button will be displayed.
	 * b) If less than 4 then all the countries will be displayed without ellipse.
	 * c) Empty if no countries present.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments.
	 * @throws Exception if operation fails
	 */
	public String getArtworkTemplateCountries(Context context, String args[]) throws FrameworkException 
	{				
		try 
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) programMap.get(BusinessUtil.PARAM_MAP);        
			String templateId = (String) paramMap.get(BusinessUtil.OBJECT_ID);
			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);
			String export = BusinessUtil.getString(requestParamMap, "exportFormat");
			
			return showCountries(context, templateId, export);

		} catch (Exception e) {  throw new FrameworkException(e); }
	}	

	/**
	 * It returns Geographic Image if Artwork Template is Associated to any Country
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args    -  Array of Arguments.
	 * @throws Exception if operation fails
	 * @author Subba Rao G (SY6)
	 */
	public StringList getArtworkTemplateStatusColumn(Context context, String[] args) throws FrameworkException {
		StringList geographicValues = new StringList();
		try {
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);			
			boolean export = BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestMap, "exportFormat"));
	
			for(Iterator oidItr = objectList.iterator(); oidItr.hasNext();) {
				Map objectMap   = (Map)oidItr.next();
				String templateId = BusinessUtil.getString(objectMap, DomainConstants.SELECT_ID);
				
				ArtworkTemplate artworkTemplate = new ArtworkTemplate(templateId);
				List<Country> templateCountries = artworkTemplate.getAssociatedCountries(context);
				boolean countriesEmpty = templateCountries.isEmpty();
				
				if(countriesEmpty) {
					geographicValues.add(AWLConstants.EMPTY_STRING);
				} else if(export){					
					geographicValues.add(AWLConstants.RANGE_YES);
				} else {					
					StringList templateCountryNamesList = new StringList(templateCountries.size());
					for (Country country : templateCountries) {
						templateCountryNamesList.add(XSSUtil.encodeForJavaScript(context, country.getName(context)));
					}
					
					Collections.sort(templateCountryNamesList);
					StringBuffer html = new StringBuffer(200);
					html.append( "<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../awl/images/AWLStatusLocationAssigned.gif\" ");
					html.append( "onmouseover=\"showTooltip(event, this,'").append(FrameworkUtil.join(templateCountryNamesList, ",")).append("');\" ");
					html.append( "onmouseout=\"hideTooltip(event, this);\" />");
							
					geographicValues.add(html.toString());
				}
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
		return geographicValues;
	}
}
