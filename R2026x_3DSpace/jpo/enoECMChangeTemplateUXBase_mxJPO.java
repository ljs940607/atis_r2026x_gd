import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.Vector;
import java.util.Locale;
import java.io.BufferedReader;
import java.io.StringReader;

import com.dassault_systemes.changegovernance.interfaces.IChangeGovernanceServices.UserGroup;
import com.dassault_systemes.enovia.changeorder.factory.ChangeOrderFactory;
import com.dassault_systemes.enovia.changeorder.interfaces.IChangeOrder;
import com.dassault_systemes.enovia.changeorder.interfaces.IChangeOrderServices;
import com.dassault_systemes.enovia.enterprisechange.modeler.ChangeTemplate;
import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeConstants;
import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeUXUtil;
import com.dassault_systemes.enovia.enterprisechangemgt.util.ChangeUtil;

import com.matrixone.apps.common.BusinessUnit;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.domain.util.UOMUtil;
import com.matrixone.apps.domain.util.i18nNow;
import com.matrixone.apps.common.Company;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.domain.util.MqlUtil;

import matrix.db.BusinessObject;
import matrix.db.ConnectParameters;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.RelationshipType;
import matrix.db.MQLCommand;

import matrix.util.StringList;
import matrix.util.SelectList;

public class enoECMChangeTemplateUXBase_mxJPO extends emxDomainObject_mxJPO {
	public static final String SUITE_KEY = "EnterpriseChangeMgt";
	public enoECMChangeTemplateUXBase_mxJPO(Context context, String[] args)
			throws Exception {
		super(context, args);
		// TODO Auto-generated constructor stub
	}
	
	/**
	 * Gets the Change Templates as per the Context User Visibility. - As per "Member" relationship
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           0 -  HashMap containing one String entry for key "objectId"
	 * @return        a <code>MapList</code> object having the list of Change Templates, Object Id of Change Template objects.
	 * @throws        Exception if the operation fails
	 * @since         ECM R420
	 **
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getMyTemplatesView(Context context, String[] args) throws Exception
	{

		HashSet<String> sOrgSet 		= 		new HashSet<String>();
		MapList sTemplateList 			= 		new MapList();
		MapList sFinalTemplateList      = 		new MapList();
		try
		{
			String loggedInPersonId 	= 		PersonUtil.getPersonObjectID(context);
			boolean isChangeAdmin 		= 		ChangeUtil.hasChangeAdministrationAccess(context);

			DomainObject dmObj 			= 		DomainObject.newInstance(context);
			sOrgSet.add(loggedInPersonId); //To get Personal Templates, adding the person ID


			String sObjectId = "";
			String sOwner ="";
			String sMemberOrgId = "";
			String sParentOrgID = "";
			String sChildOrgID = "";


			StringBuffer selectTemplate = 		new StringBuffer("from[");
			selectTemplate.append(ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES);
			selectTemplate.append("].to.id");


			StringList sSelectList = new StringList();
			sSelectList.add(selectTemplate.substring(0));
			sSelectList.add(SELECT_ID);
			sSelectList.add(SELECT_OWNER);


			StringBuffer selectMemberOrg = 		new StringBuffer("to[");
			selectMemberOrg.append(RELATIONSHIP_MEMBER);
			selectMemberOrg.append("].from.id");

			//Getting Member Organizations object IDs
			dmObj.setId(loggedInPersonId);
			StringList sMemberOrgList = dmObj.getInfoList(context, selectMemberOrg.substring(0));



			Iterator sItr = sMemberOrgList.iterator();
			while(sItr.hasNext())
			{
				sMemberOrgId = (String)sItr.next();
				sOrgSet.add(sMemberOrgId);

				//Getting the above Parent Organizations Object IDs
				DomainObject orgObj = new DomainObject(sMemberOrgId);
				MapList sParentOrgList = orgObj.getRelatedObjects(context,
						RELATIONSHIP_DIVISION+","
						+RELATIONSHIP_COMPANY_DEPARTMENT,
						TYPE_ORGANIZATION,
						new StringList(SELECT_ID),
						null,
						true,
						false,
						(short)0,
						EMPTY_STRING,
						EMPTY_STRING,
						null,
						null,
						null);
				Iterator sParentOrgItr = sParentOrgList.iterator();
				while(sParentOrgItr.hasNext())
				{
					Map tempMap = (Map)sParentOrgItr.next();
					sParentOrgID = (String)tempMap.get(SELECT_ID);
					sOrgSet.add(sParentOrgID);
				}

				if(isChangeAdmin)
				{
					//Getting Business Units and Departments object IDs
					Company sCompanyObj = new Company(sMemberOrgId);
					MapList sOrgList = sCompanyObj.getBusinessUnitsAndDepartments(context, 0, new StringList(SELECT_ID), false);
					Iterator sOrgItr = sOrgList.iterator();
					while(sOrgItr.hasNext())
					{
						Map tempMap = (Map)sOrgItr.next();
						sChildOrgID = (String)tempMap.get(SELECT_ID);
						sOrgSet.add(sChildOrgID);
					}
				}

			}
			String[] arrObjectIDs = (String[])sOrgSet.toArray(new String[0]);

			//getting Templates connected to each organization/person
			sTemplateList = DomainObject.getInfo(context, arrObjectIDs, sSelectList);


			Iterator sTempItr = sTemplateList.iterator();
			while(sTempItr.hasNext())
			{
				Map newMap = (Map)sTempItr.next();
				sObjectId = (String)newMap.get(selectTemplate.substring(0));
				sOwner = (String)newMap.get("owner");
				if(!UIUtil.isNullOrEmpty(sObjectId))
				{
					StringList sList = FrameworkUtil.split(sObjectId,"\7");
					Iterator sListItr = sList.iterator();
					while(sListItr.hasNext())
					{
						Map sTempMap = new HashMap();
						sObjectId = (String)sListItr.next();
						sTempMap.put("id", sObjectId);
						sTempMap.put("owner", sOwner);
						sFinalTemplateList.add(sTempMap);
					}


				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw new FrameworkException(e);
		}
		return sFinalTemplateList;
	}//end of method


	/**
	 * To create the Attribute Group on Change Template
	 * @param context the eMatrix code context object
	 * @param args packed hashMap of request parameter
	 * @throws Exception if the operation fails
	 */
	
	public void createAttributeGroup(Context context,String [] args) throws Exception{
		HashMap<?, ?> programMap      = (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap        = (HashMap<?, ?>)programMap.get("paramMap");
        HashMap<?, ?> requestMap      = (HashMap<?, ?>)programMap.get("requestMap");
        String objectId         = (String)paramMap.get("objectId");
        String newName          = (String) paramMap.get("New Value");
        String description      = ((String[])requestMap.get("Description"))[0];
        String attributes       = ((String[])requestMap.get("Attributes"))[0];
        // calling modeler API to create attribute on CHT
        ChangeTemplate chgTemplateObj  = new ChangeTemplate(objectId);
        chgTemplateObj.createAttributeGroup(context, newName, description, attributes);
	}
	
	/**
	 * Returns the HTML based Edit Icon in the StructureBrowser
	 *
	 * @param context   the eMatrix <code>Context</code> object
	 * @param args      holds input arguments.
	 * @return          Vector attachment as HTML
	 * @throws          Exception if the operation fails
	 * @since           ECM R212
	 */
	public Vector showEditIconforStructureBrowser(Context context, String args[])throws FrameworkException{
		try{
			//XSSOK
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			Vector columnVals = showEditIconforStructureBrowser(context, programMap);
			if(columnVals.size()!=0){
				return columnVals;
			}
			else{
				return new Vector();
			}
		} catch (Exception e){
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Returns the HTML based Edit Icon in the StructureBrowser
	 * Note - This method is replacement for same method in enoECMChangeTemplateBase
	 * 
	 * @param context   the eMatrix <code>Context</code> object
	 * @param args      holds input arguments.
	 * @return          Vector attachment as HTML
	 * @throws          Exception if the operation fails
	 * @since           ECM R212
	 */
	public Vector showEditIconforStructureBrowser(Context context, java.util.HashMap arguMap)throws FrameworkException{

		//XSSOK
		Vector columnVals = null;

		try {

			MapList objectList = (MapList) arguMap.get("objectList");
			StringBuffer sbEditIcon = null;
			DomainObject dmObj = DomainObject.newInstance(context);


			boolean isChangeAdmin = ChangeUtil.hasChangeAdministrationAccess(context);
			String orgId = PersonUtil.getUserCompanyId(context);
			String loggedInPersonId = PersonUtil.getPersonObjectID(context);

			boolean isBUEmployee = false;

			Company companyObj = new Company();

			StringList sSelectList = new StringList();
			sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
			sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");
			sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");

			String sConnectedType = "";
			String sConnectedID = "";
			String sConnectedName ="";
			String sOwner ="";
			String si18NEditChangeTemplate = EnoviaResourceBundle.getProperty(context,  ChangeConstants.RESOURCE_BUNDLE_ENTERPRISE_STR, context.getLocale(),"EnterpriseChangeMgt.Command.EditChangeTemplate");

			StringBuffer sbStartHref = new StringBuffer();
			sbStartHref.append("<a href=\"JavaScript:emxTableColumnLinkClick('");
			sbStartHref.append("../common/emxForm.jsp?formHeader=Edit Change Template&amp;mode=edit");
			sbStartHref.append("&amp;preProcessJavaScript=setOwningOrganization&amp;HelpMarker=emxhelpparteditdetails&amp;postProcessJPO=enoECMChangeUX%3AupdateRouteTemplateForChangeEdit&amp;commandName=ECMMyChangeTemplates&amp;refreshStructure=false&amp;postProcessURL=../enterprisechangemgtapp/ECMCommonRefresh.jsp&amp;suiteKey=EnterpriseChangeMgt&amp;objectId=");

			StringBuffer sbEndHref = new StringBuffer();
			sbEndHref.append("&amp;form=type_ChangeTemplate'");
			sbEndHref.append(", '700', '600', 'true', 'slidein', '')\">");
			sbEndHref.append("<img border=\"0\" src=\"../common/images/iconActionEdit.gif\" title=\""+XSSUtil.encodeForXML(context, si18NEditChangeTemplate)+"\" /></a>");

			int listSize = 0;
			if (objectList != null && (listSize = objectList.size()) > 0) {
				columnVals = new Vector(objectList.size());
				Map sTempMap = new HashMap();

				Iterator objectListItr    = objectList.iterator();
				while( objectListItr.hasNext()){
					Map objectMap           = (Map) objectListItr.next();
					String objectID = (String)objectMap.get("id");
					sbEditIcon = new StringBuffer();

					dmObj.setId(objectID);

					Map sResultMap = dmObj.getInfo(context, sSelectList);
					sConnectedType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
					sConnectedName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");
					sConnectedID = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");

					dmObj.setId(loggedInPersonId);
					String sPersonBUID = dmObj.getInfo(context,"to["+RELATIONSHIP_BUSINESS_UNIT_EMPLOYEE+"].from.id");

					if(sConnectedType.equals(TYPE_PERSON)){

						if(sOwner.equals(context.getUser()) || sConnectedName.equals(context.getUser())){
							sbEditIcon = new StringBuffer(sbStartHref);
							sbEditIcon.append(XSSUtil.encodeForHTMLAttribute(context, objectID));
							sbEditIcon.append(sbEndHref);
						}
					}
					if(!UIUtil.isNullOrEmpty(sPersonBUID)){
						isBUEmployee = true;
						companyObj.setId(sPersonBUID);
						sTempMap.put("id",sPersonBUID);
					}
					if(!isBUEmployee){
						companyObj.setId(orgId);
						sTempMap.put("id",orgId);
					}

					MapList sList = companyObj.getBusinessUnitsAndDepartments(context, 0, new StringList(SELECT_ID), false);
					sList.add(sTempMap);
					Iterator sItr = sList.iterator();

					while(sItr.hasNext()){
						Map sMap = (Map)sItr.next();
						boolean sContains = sMap.containsValue(sConnectedID);
						if(sContains){
							if(isChangeAdmin){
								sbEditIcon = new StringBuffer(sbStartHref);
								sbEditIcon.append(XSSUtil.encodeForHTMLAttribute(context, objectID));
								sbEditIcon.append(sbEndHref);
							}
						}
					}
					columnVals.add(sbEditIcon.toString());
				}//end while

			}//end if
			return columnVals;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}//end of method
	
	/**
  	 * Get Informed Users with user group Field
  	 * @param Context context
  	 * @param args holds information about object.
  	 * @return Informed Users with user group Field.
  	 * @throws Exception if operation fails.
  	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String selectInformedUsersWithGroup(Context context,String[] args)throws Exception
	{
		boolean isEditable = true;
		boolean isMobileDevice = false;
		StringBuilder sb = new StringBuilder();
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		String strMode = (String) requestMap.get("mode");
		String changeTemplateId = (String) requestMap.get("objectId");
		MapList mlInformedUsers = new MapList();
		String strFollowerAccessKey = "ManageFollowers";
		String informedUsers = DomainObject.EMPTY_STRING;
		String informedMemberLists = DomainObject.EMPTY_STRING;
		String informedUserGroups = DomainObject.EMPTY_STRING;
		StringList slMemberListId = new StringList();
		String USER_FULL_NAME = "UserFullName";

		// For export to CSV
		String exportFormat = null;
		boolean exportToExcel = false;
		if(requestMap!=null && requestMap.containsKey("reportFormat")){
			exportFormat = (String)requestMap.get("reportFormat");
		}
		if("CSV".equals(exportFormat)){
			exportToExcel = true;
		}
		
		//Get current informed users and member lists
		if(null != changeTemplateId){
			
			DomainObject domChangeTemplate = DomainObject.newInstance(context, changeTemplateId);
			
			//Get existing Members list

			String strSelectTitle = "attribute[" + DomainConstants.ATTRIBUTE_TITLE  + "]";
			StringList objSelects = new StringList();
			objSelects.add(DomainConstants.SELECT_ID);
			objSelects.add(DomainConstants.SELECT_NAME);
			objSelects.add(DomainConstants.SELECT_TYPE);
			objSelects.add(strSelectTitle);
			
			MapList mlMemberList = domChangeTemplate.getRelatedObjects(context,
					  DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST,
					  DomainConstants.TYPE_MEMBER_LIST,
					  objSelects,
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			if(!mlMemberList.isEmpty()){
				Iterator itrMemberList = mlMemberList.iterator();
				while(itrMemberList.hasNext()){
					Map memberList = (Map)itrMemberList.next();
					String memberListId = (String) memberList.get(DomainConstants.SELECT_ID);
					String memberListName = (String) memberList.get(DomainConstants.SELECT_NAME);
					String memberListType = (String) memberList.get(DomainConstants.SELECT_TYPE);
					Map<String, String> mpMemberList = new HashMap<String, String>();
					mpMemberList.put(DomainConstants.SELECT_ID, memberListId);
					mpMemberList.put(DomainConstants.SELECT_NAME, memberListName);
					mpMemberList.put(DomainConstants.ATTRIBUTE_TITLE, memberListName);
					mpMemberList.put(DomainConstants.SELECT_TYPE, memberListType);
					mlInformedUsers.add(mpMemberList);
					slMemberListId.add(memberListId);
				}
			}
			
			//Get existing user group followers
			MapList mlGroupFollower = domChangeTemplate.getRelatedObjects(context,
					  PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"),
					  DomainConstants.TYPE_GROUP,
					  objSelects,
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			if(!mlGroupFollower.isEmpty()){
				Iterator itrUserGroup = mlGroupFollower.iterator();
				while(itrUserGroup.hasNext()){
					Map userGroup = (Map)itrUserGroup.next();
					String userGroupId = (String) userGroup.get(DomainConstants.SELECT_ID);
					String userGroupName = (String) userGroup.get(DomainConstants.SELECT_NAME);
					String userGroupType = (String) userGroup.get(DomainConstants.SELECT_TYPE);
					String userGroupTitle = (String) userGroup.get(strSelectTitle);
					Map<String, String> mpUserGroup = new HashMap<String, String>();
					mpUserGroup.put(DomainConstants.SELECT_ID, userGroupId);
					mpUserGroup.put(DomainConstants.SELECT_NAME, userGroupName);
					mpUserGroup.put(DomainConstants.ATTRIBUTE_TITLE, userGroupTitle);
					mpUserGroup.put(DomainConstants.SELECT_TYPE, userGroupType);
					mlInformedUsers.add(mpUserGroup);
					informedUserGroups = informedUserGroups.concat(userGroupId+",");
				}
			}
			
									
			//Get existing user followers
			MapList mlUserFollower = domChangeTemplate.getRelatedObjects(context,
					  PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"),
					  DomainConstants.TYPE_PERSON,
					  objSelects,
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			if(!mlUserFollower.isEmpty()){
				Iterator itrUserFollower = mlUserFollower.iterator();
				while(itrUserFollower.hasNext()){
					Map userFollower = (Map)itrUserFollower.next();
					String userFollowerId = (String) userFollower.get(DomainConstants.SELECT_ID);
					String userFollowerName = (String) userFollower.get(DomainConstants.SELECT_NAME);
					String userFollowerType = (String) userFollower.get(DomainConstants.SELECT_TYPE);
					String userFollowerTitle = (String) userFollower.get(strSelectTitle);
					Map<String, String> mpUserFollower = new HashMap<String, String>();
					mpUserFollower.put(DomainConstants.SELECT_ID, userFollowerId);
					mpUserFollower.put(DomainConstants.SELECT_NAME, userFollowerName);
					mpUserFollower.put(DomainConstants.ATTRIBUTE_TITLE, userFollowerTitle);
					mpUserFollower.put(DomainConstants.SELECT_TYPE, userFollowerType);
					mpUserFollower.put(USER_FULL_NAME, PersonUtil.getFullName(context, userFollowerName));
					mlInformedUsers.add(mpUserFollower);
					informedUsers = informedUsers.concat(userFollowerId+",");
				}
			}
			
			if (slMemberListId!=null && !slMemberListId.isEmpty()){
				for (int i=0;i<slMemberListId.size();i++) {
					String memberListId = (String) slMemberListId.get(i);
					String informedUserType = new DomainObject(memberListId).getInfo(context, DomainConstants.SELECT_TYPE);
					informedMemberLists=informedMemberLists.concat(memberListId+",");
				}
			}	
		}	
		
		if(informedUserGroups.length()>0 && !informedUserGroups.isEmpty()){
			informedUserGroups = informedUserGroups.substring(0,informedUserGroups.length()-1);
		}
				
		if(informedUsers.length()>0 && !informedUsers.isEmpty()){
			informedUsers = informedUsers.substring(0,informedUsers.length()-1);
		}

		if(informedMemberLists.length()>0 && !informedMemberLists.isEmpty()){
			informedMemberLists = informedMemberLists.substring(0,informedMemberLists.length()-1);
		}	
		if(!isMobileDevice && ("edit".equalsIgnoreCase(strMode) && isEditable)|| strMode==null && !exportToExcel)
		{
			String addPeople= EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.AddPeople", context.getSession().getLanguage());
			String addUserGroup = EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.AddUserGroup", context.getSession().getLanguage());
			String remove = EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.Remove", context.getSession().getLanguage());
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"IsInformedUsersWithGroupFieldModified\" id=\"IsInformedUsersWithGroupFieldModified\" value=\"false\" readonly=\"readonly\" />");
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"UserFollowersHidden\" id=\"UserFollowersHidden\" value=\""+informedUsers+"\" readonly=\"readonly\" />");
			sb.append("<input type=\"hidden\" name=\"GroupFollowersHidden\" id=\"GroupFollowersHidden\" value=\""+informedUserGroups+"\" readonly=\"readonly\" />");
			sb.append("<input type=\"hidden\" name=\"MemberListFollowersHidden\" id=\"MemberListFollowersHidden\" value=\""+informedMemberLists+"\" readonly=\"readonly\" />");
			sb.append("<table>");
			sb.append("<tr>");
			sb.append("<th rowspan=\"3\">");
			sb.append("<select name=\"InformedUsersWithGroup\" style=\"width:200px\" multiple=\"multiple\">");

			for (int i=0; i<mlInformedUsers.size(); i++) {
				Map mpFollower = (Map) mlInformedUsers.get(i);
				String strFollowerType = (String) mpFollower.get(DomainConstants.SELECT_TYPE);
				String strFollowerPhyId = (String) mpFollower.get(DomainConstants.SELECT_PHYSICAL_ID);
				String strFollowerTitle = (String) mpFollower.get(DomainConstants.ATTRIBUTE_TITLE);
				String strFollowerGrpURI = (String) mpFollower.get(DomainConstants.ATTRIBUTE_GROUPURI);
				String strFollowerId = (String) mpFollower.get(DomainConstants.SELECT_ID);
				String strFollowerName = (String) mpFollower.get(DomainConstants.SELECT_NAME);
				String strFollowerFullName = (String) mpFollower.get(USER_FULL_NAME);
				if(!ChangeUXUtil.isNullOrEmpty(strFollowerType) && (DomainConstants.TYPE_PERSON.equalsIgnoreCase(strFollowerType))) {	
					if(!ChangeUXUtil.isNullOrEmpty(strFollowerId) && !ChangeUXUtil.isNullOrEmpty(strFollowerFullName)) {
						sb.append("<option value=\""+strFollowerId+"\" >");
						sb.append(strFollowerFullName);
						sb.append("</option>");	
					}
				}else {
					if(!ChangeUXUtil.isNullOrEmpty(strFollowerId) && !ChangeUXUtil.isNullOrEmpty(strFollowerTitle)) {
						sb.append("<option value=\""+strFollowerId+"\" >");
						sb.append(strFollowerTitle);
						sb.append("</option>");	
					}					
				}
			}
			
			sb.append("</select>");
			sb.append("</th>");
			sb.append("<td>");
			sb.append("<a href=\"javascript:addUserFollowersSelectors()\">");
			sb.append("<img src=\"../common/images/iconStatusAdded.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:addUserFollowersSelectors()\">");
			//XSSOK
			sb.append(addPeople);
			sb.append("</a>");
			sb.append("</td>");
			sb.append("</tr>");
			
			sb.append("<tr>");
			sb.append("<td>");
			sb.append("<a href=\"javascript:addGroupFollowersSelectors()\">");
			sb.append("<img src=\"../common/images/iconStatusAdded.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:addGroupFollowersSelectors()\">");
			//XSSOK
			sb.append(addUserGroup);
			sb.append("</a>");
			sb.append("</td>");
			sb.append("</tr>");
			
			sb.append("<tr>");
			sb.append("<td>");
			sb.append("<a href=\"javascript:removeInformedUsersWithGroup()\">");
			sb.append("<img src=\"../common/images/iconStatusRemoved.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:removeInformedUsersWithGroup()\">");
			//XSSOK
			sb.append(remove);
			sb.append("</a>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("</table>");			
			
		}else {
			if(!exportToExcel) {
				sb.append("<input type=\"hidden\" name=\"UserFollowersHidden\" id=\"UserFollowersHidden\" value=\""+informedUsers+"\" readonly=\"readonly\" />");
				sb.append("<input type=\"hidden\" name=\"GroupFollowersHidden\" id=\"GroupFollowersHidden\" value=\""+informedUserGroups+"\" readonly=\"readonly\" />");
				sb.append("<input type=\"hidden\" name=\"MemberListFollowersHidden\" id=\"MemberListFollowersHidden\" value=\""+informedMemberLists+"\" readonly=\"readonly\" />");
			}

			for (int i=0; i<mlInformedUsers.size(); i++) {
				Map mpFollower = (Map) mlInformedUsers.get(i);
				String strFollowerType = (String) mpFollower.get(DomainConstants.SELECT_TYPE);
				String strFollowerPhyId = (String) mpFollower.get(DomainConstants.SELECT_PHYSICAL_ID);
				String strFollowerTitle = (String) mpFollower.get(DomainConstants.ATTRIBUTE_TITLE);
				String strFollowerGrpURI = (String) mpFollower.get(DomainConstants.ATTRIBUTE_GROUPURI);
				String strFollowerId = (String) mpFollower.get(DomainConstants.SELECT_ID);
				String strFollowerName = (String) mpFollower.get(DomainConstants.SELECT_NAME);
				String strFollowerFullName = (String) mpFollower.get(USER_FULL_NAME);
				if(!ChangeUXUtil.isNullOrEmpty(strFollowerType) && (DomainConstants.TYPE_PERSON.equalsIgnoreCase(strFollowerType))) {	
					if(!ChangeUXUtil.isNullOrEmpty(strFollowerId) && !ChangeUXUtil.isNullOrEmpty(strFollowerFullName)) {
						if(!exportToExcel) {
							sb.append("<input type=\"hidden\" name=\""+strFollowerFullName+"\" value=\""+strFollowerId+"\" />");
						}
						sb.append(strFollowerFullName);
						if(i < mlInformedUsers.size()-1) {	
							if(!exportToExcel) {	
								sb.append("<br>");
							}else {
								sb.append("\n");
							}
						}
					}
				}else {
					if(!ChangeUXUtil.isNullOrEmpty(strFollowerId) && !ChangeUXUtil.isNullOrEmpty(strFollowerTitle)) {
						if(!exportToExcel) {
							sb.append("<input type=\"hidden\" name=\""+strFollowerTitle+"\" value=\""+strFollowerId+"\" />");
							sb.append("<a onclick='findFrame(getTopWindow(), \"content\").location.href = \"../common/emxTree.jsp?objectId="+strFollowerId+"\"'>");
						}
						sb.append(strFollowerTitle);	
						if(i < mlInformedUsers.size()-1) {
							if(!exportToExcel){
								sb.append("</a>");
								sb.append("<br>");
							}else {
								sb.append("\n");
							}
						}
					}					
				}			
			}			
		}		
		return sb.toString();
	}
	
	/**
	 * connectInformedUsersWithGroup - Connect Change Template and Person or user group
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 * Added for IR-875061-3DEXPERIENCER2022x
	 */
	@com.matrixone.apps.framework.ui.ConnectionProgramCallable
	public void connectInformedUsersWithGroup(Context context, String[] args)throws Exception
	{
		Map programMap = (HashMap)JPO.unpackArgs(args);
		HashMap hmParamMap = (HashMap)programMap.get("paramMap");
		String changeTemplateId = (String)hmParamMap.get("objectId");
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		
		String[] strNewUserFollowerArr = (String[])requestMap.get("UserFollowersHidden");
		String[] strNewGroupFollowerArr = (String[])requestMap.get("GroupFollowersHidden");
		String[] strNewMemberListFollowerArr = (String[])requestMap.get("MemberListFollowersHidden");
		
		String[] strIsFieldModifiedArr = (String[])requestMap.get("IsInformedUsersWithGroupFieldModified");
		String strIsFieldModified = "true";
		if(strIsFieldModifiedArr != null && strIsFieldModifiedArr.length > 0){
			strIsFieldModified = strIsFieldModifiedArr[0];				
		}	
		
		//To make the decision of calling connect/disconnect method only on field modification.
		if("true".equalsIgnoreCase(strIsFieldModified)){
			Boolean isFrom = false, preserve = true;
			DomainObject domChangeTemplate = DomainObject.newInstance(context, changeTemplateId);
			
			//Creating set of updated user follower after edit
			String strNewUserFollowers = null;	
			Set<String> setOfNewUserFollowerIDs = new HashSet<>();
			if(strNewUserFollowerArr != null && strNewUserFollowerArr.length > 0){
				strNewUserFollowers = strNewUserFollowerArr[0];
				StringTokenizer strNewUserFollowersList = new StringTokenizer(strNewUserFollowers,",");
				while (strNewUserFollowersList.hasMoreTokens()){
					String strInformedUser = strNewUserFollowersList.nextToken().trim();
					setOfNewUserFollowerIDs.add(strInformedUser);
				}
			}
			
			//Creating set of updated group follower after edit
			String strNewGroupFollowers = null;
			Set<String> setOfNewUserGroupFollowerIDs = new HashSet<>();
			if(strNewGroupFollowerArr != null && strNewGroupFollowerArr.length > 0){
				strNewGroupFollowers = strNewGroupFollowerArr[0];
				StringTokenizer strNewGroupFollowersList = new StringTokenizer(strNewGroupFollowers,",");
				while (strNewGroupFollowersList.hasMoreTokens()){
					String strInformedUser = strNewGroupFollowersList.nextToken().trim();
					setOfNewUserGroupFollowerIDs.add(strInformedUser);
				}
			}
			
			//Creating set of updated member list after edit
			String strNewMemberListFollowers = null;
			Set<String> setOfNewMemberListIDs = new HashSet<>();
			if(strNewMemberListFollowerArr != null && strNewMemberListFollowerArr.length > 0){
				strNewMemberListFollowers = strNewMemberListFollowerArr[0];
				StringTokenizer strNewMemberListFollowersList = new StringTokenizer(strNewMemberListFollowers,",");
				while (strNewMemberListFollowersList.hasMoreTokens()){
					String strInformedUser = strNewMemberListFollowersList.nextToken().trim();
					setOfNewMemberListIDs.add(strInformedUser);
				}
			}
			
			
			//getting existing follower ids
			MapList mlExistingUserFollower = domChangeTemplate.getRelatedObjects(context,
					  PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"),
					  DomainConstants.TYPE_PERSON,
					  new StringList(DomainConstants.SELECT_ID),
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			MapList mlExistingUserGroup = domChangeTemplate.getRelatedObjects(context,
					  PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"),
					  DomainConstants.TYPE_GROUP,
					  new StringList(DomainConstants.SELECT_ID),
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			MapList mlExistingMemberList = domChangeTemplate.getRelatedObjects(context,
					  DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST,
					  DomainConstants.TYPE_MEMBER_LIST,
					  new StringList(DomainConstants.SELECT_ID),
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			
			
			//update connect and disconnect list, followed by connect and disconnect
			//user follower
			List<String> userFollowerDisconnectList = new ArrayList<String>();
			if(!mlExistingUserFollower.isEmpty()){
				Iterator itrUser = mlExistingUserFollower.iterator();
				while(itrUser.hasNext()){
					Map userFollower = (Map)itrUser.next();
					String userFollowerId = (String) userFollower.get(DomainConstants.SELECT_ID);
					String userFollowerRelId = (String) userFollower.get(DomainRelationship.SELECT_ID);
					if(!setOfNewUserFollowerIDs.contains(userFollowerId))
						userFollowerDisconnectList.add(userFollowerRelId);
					else {
						setOfNewUserFollowerIDs.remove(userFollowerId);
					}
				}
			}
			if(userFollowerDisconnectList.size()>0) {
				String[] userFollowerDisconnectArr = new String[userFollowerDisconnectList.size()];
				userFollowerDisconnectArr = userFollowerDisconnectList.toArray(userFollowerDisconnectArr);
				DomainRelationship.disconnect(context, userFollowerDisconnectArr);
			}
			if(setOfNewUserFollowerIDs.size()>0) {
				for (String newUserFollowerID : setOfNewUserFollowerIDs) {
					RelationshipType rel_Follower = new RelationshipType(PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"));
					ConnectParameters connectParams = new ConnectParameters();
					connectParams.setRelType(rel_Follower);
					connectParams.setFrom(true);
					connectParams.setTarget(new BusinessObject(newUserFollowerID));
					new BusinessObject(changeTemplateId).connect(context,connectParams);
				}
			}
								
			//user group
			List<String> userGroupFollowerDisconnectList = new ArrayList<String>();
			if(!mlExistingUserGroup.isEmpty()){
				Iterator itrUserGroup = mlExistingUserGroup.iterator();
				while(itrUserGroup.hasNext()){
					Map userGroup = (Map)itrUserGroup.next();
					String userGroupId = (String) userGroup.get(DomainConstants.SELECT_ID);
					String userGroupRelId = (String) userGroup.get(DomainRelationship.SELECT_ID);
					if(!setOfNewUserGroupFollowerIDs.contains(userGroupId))
						userGroupFollowerDisconnectList.add(userGroupRelId);
					else {
						setOfNewUserGroupFollowerIDs.remove(userGroupId);
					}
				}
			}
			if(userGroupFollowerDisconnectList.size()>0) {
				String[] userGroupFollowerDisconnectArr = new String[userGroupFollowerDisconnectList.size()];
				userGroupFollowerDisconnectArr = userGroupFollowerDisconnectList.toArray(userGroupFollowerDisconnectArr);
				DomainRelationship.disconnect(context, userGroupFollowerDisconnectArr);
			}
			if(setOfNewUserGroupFollowerIDs.size()>0) {
				for (String newUserGroupFollowerID : setOfNewUserGroupFollowerIDs) {
					RelationshipType rel_Follower = new RelationshipType(PropertyUtil.getSchemaProperty(context,"relationship_ChangeFollower"));
					ConnectParameters connectParams = new ConnectParameters();
					connectParams.setRelType(rel_Follower);
					connectParams.setFrom(true);
					connectParams.setTarget(new BusinessObject(newUserGroupFollowerID));
					new BusinessObject(changeTemplateId).connect(context,connectParams);
				}
			}
						
			//Member list remove
			List<String> memberListFollowerDisconnectList = new ArrayList<String>();
			if(!mlExistingMemberList.isEmpty()){
				Iterator itrMemberList = mlExistingMemberList.iterator();
				while(itrMemberList.hasNext()){
					Map memberList = (Map)itrMemberList.next();
					String memberListId = (String) memberList.get(DomainConstants.SELECT_ID);
					String memberListRelId = (String) memberList.get(DomainRelationship.SELECT_ID);
					if(!setOfNewMemberListIDs.contains(memberListId))
						memberListFollowerDisconnectList.add(memberListRelId);
				}
			}
			
			//if disconnectlist has items disconnect them
			if(memberListFollowerDisconnectList.size()>0) {
				String[] memberListFollowerDisconnectArr = new String[memberListFollowerDisconnectList.size()];
				memberListFollowerDisconnectArr = memberListFollowerDisconnectList.toArray(memberListFollowerDisconnectArr);
				DomainRelationship.disconnect(context, memberListFollowerDisconnectArr);
			}
		}
					
	}
	
	/**
	 * Returns Program HTML to display Owning Organization in Change Template display table
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - objectList MapList
	 * @returns Object of type Vector
	 * @throws Exception if the operation fails
	 * @since Common 10-0-0-0
	 * @grade 0
	 */
	public Vector showOwningOrganizationInStructureBrowser(Context context, String[] args)throws Exception {
		Vector owiningOrgList = new Vector();
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = (MapList) programMap.get("objectList");
			HashMap paramMap   = (HashMap) programMap.get("paramList");
			String strLang     = (String) paramMap.get("languageStr");
			DomainObject obj = DomainObject.newInstance(context);

			String strAvailability    = "";
			String objectID = "";
			String strOwningOrgType ="";
			String strOwningOrgName ="";
			String strOwningOrgID ="";
			String strOwningOrgTitle ="";

			StringList selectList = new StringList();
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

			owiningOrgList = new Vector(objectList.size());
			Iterator objectListItr    = objectList.iterator();

			while( objectListItr.hasNext() )
			{
				Map objectMap = (Map) objectListItr.next();
				objectID = (String)objectMap.get("id");
				if(!UIUtil.isNullOrEmpty(objectID)){
					obj.setId(objectID);
					Map sResultMap = obj.getInfo(context, selectList);

					if(sResultMap != null)
					{
						strOwningOrgType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
						strOwningOrgID = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
						strOwningOrgName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

						obj.setId(strOwningOrgID);
						strOwningOrgTitle = obj.getInfo(context,"attribute["+DomainConstants.ATTRIBUTE_TITLE+"]");

						if(obj.isKindOf(context, TYPE_ORGANIZATION))
						{
							owiningOrgList.add( strOwningOrgTitle );
						}
						else
						{
							owiningOrgList.add("");
						}
					}
				}


			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
		return owiningOrgList;
	}//end of method

	/**
	 *Returns Program HTML to display Availability in Change Template display table
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments:
	 *        0 - objectList MapList
	 * @returns Object of type Vector
	 * @throws Exception if the operation fails
	 * @since Common 10-0-0-0
	 * @grade 0
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Vector showTemplateAvailabilityInStructureBrowser(Context context, String[] args)throws Exception {
		//XSSOK
		Vector availabilityList = new Vector();
		try {
			HashMap programMap 		  = (HashMap) JPO.unpackArgs(args);
			MapList objectList 		  = (MapList) programMap.get("objectList");
			HashMap paramMap          = (HashMap) programMap.get("paramList");

			DomainObject obj 		  = DomainObject.newInstance(context);
			String strLang            = (String) paramMap.get("languageStr");


			String strLabelUser       = EnoviaResourceBundle.getProperty(context, "emxEnterpriseChangeMgtStringResource", context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Personal");
			String strLabelEnterprise = EnoviaResourceBundle.getProperty(context, "emxEnterpriseChangeMgtStringResource", context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Enterprise");

			String strAvailability    = "";
			String objectID 		  = "";
			String strConnectedId 	  = "";
			String strConnectedType   = "";
			String strConnectedName   = "";

			StringList selectList = new StringList();
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
			selectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

			availabilityList = new Vector(objectList.size());
			Iterator objectListItr    = objectList.iterator();
			while( objectListItr.hasNext() ) {
				Map objectMap = (Map) objectListItr.next();
				objectID = (String)objectMap.get("id");
				if(!UIUtil.isNullOrEmpty(objectID)){
					obj.setId(objectID);
					Map sResultMap   = obj.getInfo(context, selectList);

					strConnectedId   = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
					strConnectedType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
					strConnectedName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

					obj.setId(strConnectedId);

					if(obj.isKindOf(context, TYPE_PERSON)){
						strAvailability = strLabelUser + " : " + strConnectedName;
					} else{
						strAvailability = strLabelEnterprise + " : " + strConnectedName;
					}

					availabilityList.add( strAvailability );
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
		return availabilityList;
	}//end of method

	/**
	 * To create the Change Template Object from Create Component
	 *
	 * @author R3D
	 * @param context the eMatrix code context object
	 * @param args packed hashMap of request parameter
	 * @return Map contains change object id
	 * @throws Exception if the operation fails
	 * @Since ECM R215
	 */
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map create(Context context, String[] args) throws Exception {

		HashMap programMap   = (HashMap) JPO.unpackArgs(args);
		HashMap requestValue = (HashMap) programMap.get(ChangeConstants.REQUEST_VALUES_MAP);

		Map<String, String> returnMap     = new HashMap<String, String>();


		String sAutoNameChecked = (String) programMap.get("autoNameCheck");

		String changeId   = "";
		String sType 	  = (String) programMap.get("TypeActual");
		String sName 	  = (String) programMap.get("Name");
		String sPolicy    = (String) programMap.get("Policy");
		String sVault     = (String) programMap.get("Vault");

		boolean bAutoName = UIUtil.isNullOrEmpty(sAutoNameChecked)?false:true;

		try{

			com.dassault_systemes.enovia.enterprisechangemgt.common.ChangeTemplate change = new com.dassault_systemes.enovia.enterprisechangemgt.common.ChangeTemplate();
			changeId = change.create(context,sType,sName,sPolicy,sVault,bAutoName);

			//Code for Interface
			StringList sSelectList = new StringList();
			sSelectList.add(SELECT_NAME);
			sSelectList.add(SELECT_REVISION);
			sSelectList.add(SELECT_TYPE);

			DomainObject dmObj = new DomainObject(changeId);
			Map sInfoMap = dmObj.getInfo(context, sSelectList);

			String objName = (String)sInfoMap.get(SELECT_NAME);
			String objRevision = (String)sInfoMap.get(SELECT_REVISION);
			String objType = (String)sInfoMap.get(SELECT_TYPE);

			returnMap.put("id", changeId);

		}
		catch (Exception e){
			e.printStackTrace();
			throw new FrameworkException(e);
		}

		return returnMap;
	}//end of method

	/**
	 * Include Program for Change Template upward usage
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           0 -  HashMap containing one String entry for key "objectId"
	 * @return        a <code>StringList</code> object having the list of Change Templates, Object Id of Change Template objects.
	 * @throws        Exception if the operation fails
	 * @since         ECM R215
	 **
	 */
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList getUsageTemplates(Context context, String[] args) throws Exception{

		if (args.length == 0 ){
			throw new IllegalArgumentException();
		}
		HashSet sFinalSet = new HashSet();
		HashSet sFinalOrgSet = new HashSet();
		MapList sTemplateList = new MapList();
		StringList includeOIDList = new StringList();
		DomainObject dmObj = DomainObject.newInstance(context);
		try{
			String objectId = "";

			//Select statement for Change Templates
			StringBuffer strSelect = new StringBuffer("from[");
			strSelect.append(ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES);
			strSelect.append("].to.id");

			//Select Member Organizations statement
			StringBuffer selectMemberOrg = new StringBuffer("to[");
			selectMemberOrg.append(RELATIONSHIP_MEMBER);
			selectMemberOrg.append("].from.id");

			
			String orgId = PersonUtil.getUserCompanyId(context);
			String loggedInPersonId = PersonUtil.getPersonObjectID(context);
			sFinalOrgSet.add(loggedInPersonId); //In order to get Personal Templates

			//Check if the context user has Change Administrator role
			//not getting used, hence commenting
			//boolean isChangeAdmin = ChangeUXUtil.hasChangeAdministrationAccess(context);

			//Getting Member Organizations Object ID
			dmObj.setId(loggedInPersonId); //Person Object
			StringList sMemberOrgList = dmObj.getInfoList(context, selectMemberOrg.substring(0));

			Iterator sItr = sMemberOrgList.iterator();

			while(sItr.hasNext()){
				String sMemberOrgId = (String)sItr.next();
				sFinalOrgSet.add(sMemberOrgId); //To get Templates of current Organization

				//Getting Parent Organizations of this Organization
				DomainObject sBUObj = new DomainObject(sMemberOrgId);
				MapList sOrgList = sBUObj.getRelatedObjects(
														context,                // matrix context
														RELATIONSHIP_DIVISION+","+RELATIONSHIP_COMPANY_DEPARTMENT,  // relationship pattern
								                        "*",                    // object pattern
								                        new StringList(SELECT_ID),             // object selects
								                        EMPTY_STRINGLIST,       // relationship selects
								                        true,                   // to direction
								                        false,                  // from direction
								                        (short) 0,          // recursion level
								                        EMPTY_STRING,           // object where clause
								                        EMPTY_STRING,          // relationship where clause
								                        0);

				Iterator sOrgItr = sOrgList.iterator();
				while(sOrgItr.hasNext()){
					Map tempMap = (Map)sOrgItr.next();
					objectId = (String)tempMap.get(SELECT_ID);
					sFinalOrgSet.add(objectId);
				}

			}

			String[] arrObjectIDs = (String[])sFinalOrgSet.toArray(new String[0]);

			//Getting Templates connected to each Organization & Person
			sTemplateList = DomainObject.getInfo(context, arrObjectIDs, new StringList(strSelect.substring(0)));

			Iterator sTempItr = sTemplateList.iterator();
			while(sTempItr.hasNext()){
				Map tempMap = (Map)sTempItr.next();
				objectId = (String)tempMap.get(strSelect.substring(0));
				if(!UIUtil.isNullOrEmpty(objectId)){
					StringList sSplitList = FrameworkUtil.split(objectId,"\7");
					sFinalSet.addAll(sSplitList);

				}

			}

			Iterator sFinalItr = sFinalSet.iterator();
			while(sFinalItr.hasNext()){
				objectId = (String)sFinalItr.next();
				includeOIDList.add(objectId);
			}


		}
		catch(Exception e){
			throw new FrameworkException(e);
		}

		return includeOIDList;
	}//end of method

	/**
	 * method used to display Change Template-Attribute Group-attributes (if added) dynamically when selected Change Template while creating CO.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           0 -  Object
	 * @return        a <code>MapList</code> MapList of attributes with Attribute Group as section header
	 * @throws        Exception if the operation fails
	 * @since         ECM R216
	 **
	*/
	public MapList DisplayInterfaceAttributes(Context context, String args[] ) throws Exception{
		MapList returnList  = new MapList();
		HashMap programMap  = (HashMap)JPO.unpackArgs(args);
		HashMap requestMap  = (HashMap)programMap.get("requestMap");
		String CTID         = (String)requestMap.get("tmplId");
		String COID         = (String)requestMap.get("objectId");
		String formName     = (String)requestMap.get("form");
		String CreateMode   = (String)requestMap.get("CreateMode");
		boolean isCreate    = UIUtil.isNotNullAndNotEmpty(CreateMode)?true:false;
		String strObjectId  = UIUtil.isNotNullAndNotEmpty(COID)&&(!isCreate)?COID:CTID;
		String strPolicy;
		if(!UIUtil.isNullOrEmpty(strObjectId)){
			strPolicy       = new DomainObject(strObjectId).getPolicy(context).getName();
			//checking the policy of object to load interface attributes only for CO or CT
			if(strPolicy.equals(ChangeConstants.POLICY_FORMAL_CHANGE)||strPolicy.equals(ChangeConstants.POLICY_FASTTRACK_CHANGE)||strPolicy.equals(ChangeConstants.POLICY_CHANGE_TEMPLATE)){
				returnList      = getAttributeGroupAttributesFromChangeTemplate(context, strObjectId);
				returnList      = getDynamicFieldsMapList(context,returnList,formName,isCreate);
			}
		}
		return returnList;
	}

	/**
	 * method used to display Change Template-Attribute Group-attributes (if added) dynamically when selected Change Template while creating CO.
	 * @param context the eMatrix <code>Context</code> object
	 * @param CTID    object Id
	 * @return        a <code>MapList</code> MapList of attributes with Attribute Group as section header
	 * @throws        Exception if the operation fails
	 * @since         ECM R216
	 **
	*/
	public MapList getAttributeGroupAttributesFromChangeTemplate(Context context,String CTID) throws Exception{
		MapList fieldMapList  = new MapList();
		DomainObject ctobj   = new DomainObject(CTID);
        StringList selectables  = new StringList();

        StringList slAttributeGroups = new StringList();
        StringList attrGroupList;
        HashMap attibuteGroup;
        String attibuteGroupName;
        Iterator itr;
        MapList attributes;
        StringList sAllconnectedInterfaces = FrameworkUtil.split(MqlUtil.mqlCommand(context, "print bus $1 select $2 dump $3",CTID,"interface","|"),"|");
        
        //check for ECM specific interfaces
		int interfaceSize = sAllconnectedInterfaces.size();
		for(int j=0 ; j<interfaceSize ; j++){
			String strInterface = sAllconnectedInterfaces.get(j);
			String strProperty = "interface["+strInterface+"].property[product].value";
			String ECMInterfaces = MqlUtil.mqlCommand(context, "print bus $1 select $2 $3",CTID,strProperty,"dump");
			if("ECM".equals(ECMInterfaces)){
				slAttributeGroups.add(strInterface.trim());
			}
		}
		
	    selectables = new StringList();
	    selectables.add("type");
	    selectables.add("range");
	    selectables.add("multiline");
	    selectables.add("valuetype");
	    //for each attribute group
	    for(int i=0;i< slAttributeGroups.size();i++){
	        attibuteGroup = new HashMap();
	        attibuteGroupName = (String)slAttributeGroups.get(i);
	        attibuteGroup.put("attributeGroupName", attibuteGroupName);
	        attributes = getAttributeGroupAttributesDetails(context, attibuteGroupName, selectables);
	        attibuteGroup.put("attributes", attributes);
	        fieldMapList.add(attibuteGroup);
	    }
		
		return fieldMapList;
	}

	/***
     * This method create the settingsMap and fieldMap to display all the Classification Attributes.
     * The list of Attributes are looped through and check is performed whether the attributes
     * is of type Integer/String/Real/Date/Boolean, the fieldMap is set with the appropriate
     * settings for each of the attribute type.
     * @param context
     * @param classificationAttributesList
     * @param formName
     * @param isCreate
     * @since R216
     * @return MapList containing the settingMap
     * @throws Exception
     */
    private MapList getDynamicFieldsMapList(Context context,MapList classificationAttributesList,String formName,boolean isCreate) throws Exception{
        String FIELD_TYPE_ATTRIBUTE			= "attribute";

    	String INPUT_TYPE_COMBOBOX			= "combobox";
    	String INPUT_TYPE_TEXTAREA			= "textarea";
    	String INPUT_TYPE_TEXTBOX			= "textbox";

    	String SETTING_FIELD_TYPE			= "Field Type";
    	String SETTING_ADMIN_TYPE			= "Admin Type";
    	String SETTING_REGISTERED_SUITE		= "Registered Suite";
    	String SETTING_INPUT_TYPE			= "Input Type";
    	String SETTING_FORMAT				= "format";
    	String SETTING_RANGE_PROGRAM		= "Range Program";
    	String SETTING_RANGE_FUNCTION		= "Range Function";
    	String SETTING_VALIDATE				= "Validate";

    	String SETTING_UPDATE_PROGRAM		= "Update Program";
        String SETTING_UPDATE_FUNCTION		= "Update Function";

    	String EXPRESSION_BUSINESSOBJECT	= "expression_businessobject";

    	String FORMAT_TIMESTAMP				= "timestamp";
    	String FORMAT_DATE					= "date";
    	String FORMAT_INTEGER				= "integer";
        String FORMAT_BOOLEAN				= "boolean";
        String FORMAT_REAL					= "real";
        String FORMAT_NUMERIC				= "numeric";
        String FORMAT_STRING				= "string";

        String BOOLEAN_TRUE					= "true";
        String BOOLEAN_FALSE				= "false";
        String LABEL 						= "label";
        
        Map AttributeGroupMap;
        String attributeGroupName;
        HashMap settingsMapForAGHeader;
        HashMap fieldMapForAGHeader;
        
        HashMap attribute;
    	String attributeName;
    	HashMap fieldMap;
        HashMap settingsMap;
        
        //Define a new MapList to return.
        MapList fieldMapList = new MapList();
        String strLanguage =  context.getSession().getLanguage();

        // attributeAttributeGroupMap contains all the attribute group names to which each attribute belongs
        HashMap attributeAttributeGroupMap = new HashMap();

        if(classificationAttributesList == null)
            return fieldMapList;

        Iterator classItr = classificationAttributesList.iterator();
        while(classItr.hasNext()){
            AttributeGroupMap = (Map)classItr.next();
            attributeGroupName = (String)AttributeGroupMap.get("attributeGroupName");
            settingsMapForAGHeader = new HashMap();
            fieldMapForAGHeader = new HashMap();
            settingsMapForAGHeader.put(SETTING_FIELD_TYPE,"Section Header");
            settingsMapForAGHeader.put(SETTING_REGISTERED_SUITE,"EnterpriseChangeMgt");
            settingsMapForAGHeader.put("Section Level","1");
            fieldMapForAGHeader.put(LABEL,attributeGroupName);
            fieldMapForAGHeader.put("settings", settingsMapForAGHeader);
            fieldMapList.add(fieldMapForAGHeader);

            MapList AGAttributes = (MapList)AttributeGroupMap.get("attributes");

            for(int i=0;i<AGAttributes.size();i++){
            	attribute =  (HashMap)AGAttributes.get(i);
            	attributeName = (String)attribute.get("name");
            	fieldMap = new HashMap();
                settingsMap = new HashMap();
                /*String attributeGroupFieldName = (isCreate==true?attributeGroupName+"|"+attributeName:attributeName);
                fieldMap.put("name",attributeGroupFieldName);*/
                fieldMap.put("name",attributeGroupName+"|"+attributeName);
                fieldMap.put(LABEL,i18nNow.getAttributeI18NString(attributeName,strLanguage));
                fieldMap.put(EXPRESSION_BUSINESSOBJECT,"attribute["+attributeName+"].value");

               // if(!isCreate){
                	settingsMap.put(SETTING_ADMIN_TYPE,"attribute_"+attributeName.replaceAll(" ", ""));
               // }
                String attributeType = (String)attribute.get("type");
                String symbolicAttrName = FrameworkUtil.getAliasForAdmin(context, "attribute", attributeName, true);
                if(attributeType.equals(FORMAT_TIMESTAMP)){
                    settingsMap.put(SETTING_FORMAT, FORMAT_DATE);
                }
               else if(attributeType.equals(FORMAT_BOOLEAN) ){
                    settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_COMBOBOX);
                    StringList range = (StringList)attribute.get("range");

                    if(range==null){
                    settingsMap.put(SETTING_RANGE_PROGRAM, "enoECMChangeTemplateUX");
                    settingsMap.put(SETTING_RANGE_FUNCTION, "getRangeValuesForBooleanAttributes");

                    }
                }
                else if(attributeType.equals(FORMAT_INTEGER)){
                		settingsMap.put(SETTING_FORMAT, FORMAT_INTEGER);
                		if(UOMUtil.isAssociatedWithDimension(context, attributeName)) {
                        	addUOMDetailsToSettingsMap(context,attributeName,fieldMap,settingsMap);
                        }
                        if(formName.equals("type_CreatePart"))
                            settingsMap.put(SETTING_VALIDATE, "isValidInteger");
                        //setting the input type to combobox
                        if((StringList)attribute.get("range")!=null)
                            settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_COMBOBOX);
                }
                else if(attributeType.equals(FORMAT_REAL)){
                		settingsMap.put(SETTING_FORMAT, FORMAT_NUMERIC);
                		if(UOMUtil.isAssociatedWithDimension(context, attributeName)) {
                        	addUOMDetailsToSettingsMap(context,attributeName,fieldMap,settingsMap);
                        }
                        if(formName.equals("type_CreatePart"))
                            settingsMap.put(SETTING_VALIDATE, "checkPositiveReal");
                        //setting the input type to combobox
                        if((StringList)attribute.get("range")!=null)
                            settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_COMBOBOX);
                }
                else if(attributeType.equals(FORMAT_STRING))
    	        {
                	StringList range = (StringList)attribute.get("range");
                	String isMultiline=(String)attribute.get("multiline");
    	            if(range != null && range.size() > 0) {
    	            		settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_COMBOBOX);
                        	settingsMap.put(SETTING_FORMAT, FORMAT_STRING);
    	            } else if (BOOLEAN_TRUE.equalsIgnoreCase(isMultiline)) {
    	            	settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_TEXTAREA);
    	            } else {
    	            	settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_TEXTBOX);
    	            }
    	        }
                else{

                }

                settingsMap.put(SETTING_FIELD_TYPE,FIELD_TYPE_ATTRIBUTE);
                /*if(isCreate){
                    settingsMap.put(SETTING_UPDATE_PROGRAM,"enoECMChangeTemplate");
                    settingsMap.put(SETTING_UPDATE_FUNCTION,"dummyUpdateFunction");
                }else{

                }*/

                //On Change Handler
                settingsMap.put("OnChange Handler", "reloadDuplicateAttributesInForm");
                settingsMap.put("Editable", "true");
                fieldMap.put("settings",settingsMap);
                fieldMapList.add(fieldMap);
                String attributeGroupNames = (String)attributeAttributeGroupMap.get(attributeName);
                if(attributeGroupNames == null){
                    attributeAttributeGroupMap.put(attributeName, attributeGroupName);
                }else{
                    attributeAttributeGroupMap.put(attributeName, attributeGroupNames + "|" + attributeGroupName);
                }
            }
        }

        //update "AttributeGroups"
        //Attribute Groups information will be used for reloading the duplicate values
        Iterator itr = fieldMapList.iterator();
        while(itr.hasNext()){
            HashMap hFieldMap = (HashMap)itr.next();
            HashMap hSettingsMap = (HashMap)hFieldMap.get("settings");
            if( !"Section Header".equals(hSettingsMap.get(SETTING_FIELD_TYPE)) ){
	            String fieldName = (String)hFieldMap.get("name");
	            String strAttributeName      = "";
	            if(isCreate){
		            
	            	strAttributeName = fieldName.substring(fieldName.indexOf('|')+1);
		            String allAttributeGroupsNames = (String)attributeAttributeGroupMap.get(strAttributeName);
		            hSettingsMap.put("AttributeGroups",allAttributeGroupsNames);
	            }
            }
        }
        // Add a program HTML field which contains a javascript to reload duplicate attributes in the FORM
        HashMap reloadFunctionField = new HashMap();
        HashMap reloadFunctionFieldSettings = new HashMap();
        reloadFunctionFieldSettings.put(SETTING_FIELD_TYPE, "programHTMLOutput");
        reloadFunctionFieldSettings.put("program","enoECMChangeTemplate");
        reloadFunctionFieldSettings.put("function","getReloadDuplicateAttributesInForm");

        reloadFunctionField.put("name","reloadFunctionField");
        reloadFunctionField.put("settings",reloadFunctionFieldSettings);

        fieldMapList.add(reloadFunctionField);

        return fieldMapList;
    }

	/***
	* Function returns map of boolean range values for boolean attribute field
	* @param context
	* @param args
	* @throws Exception
	*/
	@Deprecated
	public HashMap getRangeValuesForBooleanAttributes(Context context,String [] args) throws Exception {
		HashMap rangeMap = new HashMap();

		try
		{
			StringList fieldChoices = new StringList();
			StringList fieldDisplayChoices = new StringList();
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap = (HashMap)programMap.get("paramMap");
			String language = (String)paramMap.get("languageStr");
			String trueStr = EnoviaResourceBundle.getProperty(context,"emxFrameworkStringResource",new Locale(language),"emxFramework.Range.BooleanAttribute.TRUE");
			String falseStr = EnoviaResourceBundle.getProperty(context,"emxFrameworkStringResource",new Locale(language),"emxFramework.Range.BooleanAttribute.FALSE");
			//Modifed for IR-057820
			fieldChoices.add("TRUE");
			fieldChoices.add("FALSE");
			fieldDisplayChoices.add(trueStr);
			fieldDisplayChoices.add(falseStr);
			rangeMap.put("field_choices", fieldChoices);
			rangeMap.put("field_display_choices", fieldDisplayChoices);
		}catch(Exception ex)
		{
			throw new FrameworkException(ex.toString());
		}
		return rangeMap;
	}
		 
    /***
     * This method returns details all attributes of context AG having given selectables.
     * settings for each of the attribute type.
     * @param context
     * @param agName=AG name
     * @param selectables=required attribute details
     * @since R216
     * @return MapList containing the result
     * @throws Exception
     */
	protected static MapList getAttributeGroupAttributesDetails(Context context,String agName,StringList selectables)throws Exception{
        StringBuffer cmd = new StringBuffer("print interface $1 select "); // Move select
        String[] newArgs = new String[selectables.size()+1];
        newArgs[0] = agName;
        for(int i=0;i<selectables.size();i++){
            cmd.append("\"$"+(i+2)+"\" ");
            newArgs[i+1] = "attribute."+(String)selectables.get(i);
        }

        String result = MqlUtil.mqlCommand(context,cmd.toString(),true,newArgs);

        HashMap hmAllAttributeDetails = parseMqlOutput(context, result);
        MapList agAttributesDetails = new MapList();

        Set setAllAttributeDetails = hmAllAttributeDetails.keySet();
        Iterator itr = setAllAttributeDetails.iterator();
        String attributeName = new String();
        HashMap hmAttributeDetails = new HashMap();
        while(itr.hasNext()){
            attributeName = (String)itr.next();
            hmAttributeDetails = (HashMap)hmAllAttributeDetails.get(attributeName);
            if(hmAttributeDetails != null){
                hmAttributeDetails.put("name", attributeName);
                agAttributesDetails.add(hmAttributeDetails);
            }
        }

        return agAttributesDetails;
    }

    /***
     *  This method adds all the UOM details required to display Classification Attribute
     *  during create Generic Document/Part. To display UOM details settingsMap should
     *  contain Field Type=Attribute, otherwise the UI would display only textbox next to the
     *  UOM Field.Once the map contains FieldType=Attribute, BPS code assumes that this Attribute
     *  is defined on the Type, but in case of Classification Attributes it's not,
     *  Hence to overcome this bug a Dummy update program & function is used  here, If a update program
     *  & Function is defined BPS wouldn't check whether the attribute is defined on the type.
     * @param context
     * @param attributeName
     * @param fieldMap
     * @param settingsMap
     * @since R216
     * @throws FrameworkException
     */
	private void addUOMDetailsToSettingsMap(Context context,String attributeName,HashMap fieldMap,HashMap settingsMap) throws FrameworkException{
		String UOM_ASSOCIATEDWITHUOM     = "AssociatedWithUOM";
		String DB_UNIT                   = "DB Unit";
		String UOM_UNIT_LIST             = "DB UnitList";
		String UOM_INPUT_UNIT            = "Input Unit";
		String SETTING_EDITABLE_FIELD    = "Editable";
		String BOOLEAN_TRUE              = "true";
		String SETTING_INPUT_TYPE			= "Input Type";
		String INPUT_TYPE_TEXTBOX			= "textbox";

		fieldMap.put(UOM_ASSOCIATEDWITHUOM, BOOLEAN_TRUE);
		fieldMap.put(DB_UNIT, UOMUtil.getSystemunit(context, null,attributeName,null));
		fieldMap.put(UOM_UNIT_LIST, UOMUtil.getDimensionUnits(context, attributeName));
		settingsMap.put(SETTING_EDITABLE_FIELD,BOOLEAN_TRUE);
		settingsMap.put(SETTING_INPUT_TYPE, INPUT_TYPE_TEXTBOX);
	}

	/**
     * this method parse the mql Output of mutiple lines,
     *  each line is of the form
     *  property[propertyName].subProperty = result
     *     where
     *       property      - should be present
     *                     - should not contain characters [ ] . =
     *                     - property in all the lines should be same
     *       propertyName  - should be present
     *                     - may contain . or = characters
     *                     - should not contain characters [ ]
     *       subProperty   - should be present
     *                     - should not contain . or = characters
     *                     - can end with [i] ,where i is 0, 1, 2, 3 ...
     *       result        - may or may not present
     *
     * @param context the eMatrix <code>Context</code> object
     * @param output mql output to be parsed
     * @return a HashMap with following key value pair
     *            key   - propertyName
     *            value - HashMap with following key value pair
     *                      key   - subProperty
     *                      value - String result
     *
     * @throws Exception
     */
    protected static HashMap parseMqlOutput(Context context,String output) throws Exception{
    	String PROPNAME_START_DELIMITER  = "[";
        String PROPNAME_END_DELIMITER    = "]";
        String RESULT_DELIMITER          = " =";
        String RANGE_START_DELIMITER     = "[";
    	BufferedReader in = new BufferedReader(new StringReader(output));
        String resultLine;
        HashMap mqlResult = new HashMap();
        while((resultLine = in.readLine()) != null){
            String property = null;
            String propertyName = null;
            String subProperty = null;
            String result = null;

            try{
                //identify property propertyValue subProperty subPropertyValue  - start
                boolean hasRanges = false;
                int propNameStartDelimIndex = resultLine.indexOf(PROPNAME_START_DELIMITER);
                int resultDelimIndex        = resultLine.indexOf(RESULT_DELIMITER);

                property                    = resultLine.substring(0, propNameStartDelimIndex);

                int propNameEndDelimIndex   = resultLine.indexOf(PROPNAME_END_DELIMITER, propNameStartDelimIndex);
                propertyName                = resultLine.substring(propNameStartDelimIndex+1, propNameEndDelimIndex);

                String propertyAndValue     = property + PROPNAME_START_DELIMITER+propertyName+PROPNAME_END_DELIMITER;
                String remainingResultLine  = resultLine.substring(propertyAndValue.length());

                // if remaining result starts with .
                int rangeStartDelimIndex    = remainingResultLine.indexOf(RANGE_START_DELIMITER);
                resultDelimIndex            = remainingResultLine.indexOf(RESULT_DELIMITER);
                if((rangeStartDelimIndex != -1) && (rangeStartDelimIndex < resultDelimIndex)){
                    // if [ exists and comes before = , then anything before [ is the subProperty and subProperty contains range of results
                    subProperty = remainingResultLine.substring(1,rangeStartDelimIndex);
                    hasRanges   = true;
                }else{
                    // else , anything Before = is the subProperty
                    subProperty = remainingResultLine.substring(1,resultDelimIndex);
                }

                result   = remainingResultLine.substring(resultDelimIndex+RESULT_DELIMITER.length());

                property = property.trim();
                result   = result.trim();

                //identify property propertyValue subProperty subPropertyValue  - end

                //start building HashMap
                HashMap hmPropertyName;
                String strSubProperty;
                StringList slSubProperty;

                hmPropertyName = (HashMap)mqlResult.get(propertyName);
                if(hmPropertyName == null){
                    hmPropertyName = new HashMap();
                    mqlResult.put(propertyName, hmPropertyName);
                }
                if(hasRanges){
                    slSubProperty = (StringList)hmPropertyName.get(subProperty);
                    if(slSubProperty == null){
                        slSubProperty = new StringList();
                        hmPropertyName.put(subProperty,slSubProperty);
                    }
                    slSubProperty.add(result);
                }else{
                    hmPropertyName.put(subProperty,result);
                }

            }catch(Exception e){
                // if there is exception during parsing a line , proceed to next line
            }
        }

        return mqlResult;
    }

	/**
	 * Program to update Default Type field Change Template creation page
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           0 -  HashMap containing one String entry for key "objectId"
	 * @return        a <code>void</code>
	 * @throws        Exception if the operation fails
	 * @since         ECM R215
	 **
	 */
	public void updateDefaultType(Context context, String[] args)throws Exception{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap = (HashMap)programMap.get("requestMap");
			HashMap fieldMap = (HashMap)programMap.get("fieldMap");
			HashMap paramMap = (HashMap)programMap.get("paramMap");

			String objectId = (String)paramMap.get("objectId");
			String sType = (String)paramMap.get("New Value");

			DomainObject dmObj = DomainObject.newInstance(context);
			dmObj.setId(objectId);
			dmObj.setAttributeValue(context, ChangeConstants.ATTRIBUTE_DEFAULT_TYPE, sType);

		}
		catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}//end of method

	/**
	 * This method gets the Change Order Default type to show on Create Template Web Form
	 *
	 * @param context   the eMatrix <code>Context</code> object
	 * @param           String[] of ObjectIds.
	 * @return          Object containing CO objects
	 * @throws          Exception if the operation fails
	 * @since           ECM R212
	 */
	public String getChangeOrderDefaultType(Context context, String[] args) throws Exception{
		return ChangeConstants.TYPE_CHANGE_ORDER;
	}//end of method

	/**
	 * Include Program to display the Responsible Organization below and above
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments
	 * @return        a <code>MapList</code> object having the list of Change Templates
	 * @throws        Exception if the operation fails
	 * @since         ECM R215
	 **
	 */
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList getResponsibleOrganizations(Context context, String[] args) throws Exception{

		StringList includeOIDList = new StringList();
		HashSet sFinalOrgSet = new HashSet();
		MapList sOrganizationList = new MapList();

		try{

			if (args.length == 0 ){
				throw new IllegalArgumentException();
			}

			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			StringList selectList = new StringList();
			selectList.add(SELECT_ID);
			Person person = Person.getPerson(context);

			String loggedInPersonId = PersonUtil.getPersonObjectID(context);
			DomainObject dmObj = DomainObject.newInstance(context);
			dmObj.setId(loggedInPersonId);
			String loggedInPersonName=dmObj.getInfo(context,DomainConstants.SELECT_NAME);
			String orgName= PersonUtil.getDefaultOrganization(context, loggedInPersonName);
			
			DomainObject hostCompanyObj = DomainObject.newInstance(context,Company.getHostCompany(context));
			String hostCompany = hostCompanyObj.getInfo(context, DomainConstants.SELECT_NAME);	             
			
				
			String orgId = MqlUtil.mqlCommand(context, "temp query bus $1 $2 $3 select $4 dump $5",DomainConstants.TYPE_ORGANIZATION,orgName,"*","id","|"); 	        
			orgId = orgId.substring(orgId.lastIndexOf('|')+1);
			//If Person is an BU Employee
			if(!UIUtil.isNullOrEmpty(hostCompany) && !(hostCompany.equalsIgnoreCase(orgName))){
		
				String	sPersonBU=orgId;			
				sFinalOrgSet.add(sPersonBU);
				//Getting Business Units and Departments of this Organization
				Company sBUObj = new Company(sPersonBU);
				MapList sOrgList = sBUObj.getBusinessUnitsAndDepartments(context, 0, selectList, false);

				Iterator sOrgItr = sOrgList.iterator();
				while(sOrgItr.hasNext()){
					Map sTempMap = (Map)sOrgItr.next();
					String sOrgID = (String)sTempMap.get(SELECT_ID);
					sFinalOrgSet.add(sOrgID);
				}

				//Getting the Parent Organizations of this Organization
				BusinessUnit sBusinessobj = new BusinessUnit(sPersonBU);
				MapList sParentOrgList = sBusinessobj.getParentInfo(context, 0, selectList);

				Iterator sParentOrgItr = sParentOrgList.iterator();
				while(sParentOrgItr.hasNext()){
					Map sTempMap = (Map)sParentOrgItr.next();
					String sParentBUID = (String)sTempMap.get(SELECT_ID);
					sFinalOrgSet.add(sParentBUID);
				}
			}
			//If the Person is at Host Company Level
			else{
				dmObj.setId(orgId);
				sFinalOrgSet.add(orgId);

				sOrganizationList = dmObj.getRelatedObjects(context,
						RELATIONSHIP_DIVISION+","
								+RELATIONSHIP_COMPANY_DEPARTMENT,
								TYPE_ORGANIZATION,
								selectList,
								null,
								false,
								true,
								(short)0,
								EMPTY_STRING,
								EMPTY_STRING,
								null,
								null,
								null);


				Iterator sItr = sOrganizationList.iterator();
				while(sItr.hasNext()){
					Map sTempMap = (Map)sItr.next();
					String sOrgID = (String)sTempMap.get(SELECT_ID);
					sFinalOrgSet.add(sOrgID);
				}
			}

			//Iterating final return list
			Iterator itr = sFinalOrgSet.iterator();
			while(itr.hasNext()){
				String id = (String)itr.next();
				includeOIDList.add(id);
			}
		}
		catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e);
		}

		return includeOIDList;
	}//end of method

	/**
	 * This method gets the Availability of Change Template on Change Template creation & properties page
	 *
	 * @param context   the eMatrix <code>Context</code> object
	 * @param           String[] of ObjectIds.
	 * @return          Object containing CO objects
	 * @throws          Exception if the operation fails
	 * @since           ECM R212
	 */
	public String showChangeTemplateAvailability(Context context, String[] args) throws Exception{

		//XSSOK
		HashMap programMap         = (HashMap) JPO.unpackArgs(args);
		Map requestMap             = (Map) programMap.get("requestMap");
		Map paramMap               = (Map) programMap.get("paramMap");

		String strLanguage         = (String)requestMap.get("languageStr");
		String objectId     	   = (String) requestMap.get("objectId");
		String mode                = (String) requestMap.get("mode");

		StringBuffer sb            = new StringBuffer();
		String strPersonal = EnoviaResourceBundle.getProperty(context, ChangeConstants.RESOURCE_BUNDLE_ENTERPRISE_STR, context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Personal");
		String strEnterprise = EnoviaResourceBundle.getProperty(context, ChangeConstants.RESOURCE_BUNDLE_ENTERPRISE_STR, context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Enterprise");
		
		StringBuffer sbEnterprise            = new StringBuffer();
		sbEnterprise.append("<input type=\"radio\" name=\"Availability\" value=\"Personal\" onclick=\"disableOrganizationField(this)\"></input>");
		sbEnterprise.append(strPersonal);
		sbEnterprise.append("<br></br>");
		sbEnterprise.append("<input type=\"radio\" name=\"Availability\" value=\"Enterprise\" checked = \"checked\" onclick=\"disableOrganizationField(this)\"></input>");
		sbEnterprise.append(strEnterprise);

		StringBuffer sbPersonal            = new StringBuffer();
		sbPersonal.append("<input type=\"radio\" name=\"Availability\" value=\"Personal\" checked = \"checked\"></input>");
		sbPersonal.append(strPersonal);

		String sConnectedType = "";
		String sConnectedID   = "";
		String sConnectedName = "";
		String sAvailability  = "";

		
		boolean isChangeAdmin = ChangeUtil.hasChangeAdministrationAccess(context);

		DomainObject changeTemplateObj = DomainObject.newInstance(context);

		StringList sSelectList = new StringList();
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

		Map sResultMap = new HashMap();

		//create mode
		if(mode == null){
			if(isChangeAdmin){
				sb.append(sbEnterprise);
			}
			else{
				sb.append(sbPersonal);
			}

		}
		if(!UIUtil.isNullOrEmpty(objectId)){
			changeTemplateObj.setId(objectId);
			sResultMap = changeTemplateObj.getInfo(context, sSelectList);

			sConnectedType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
			sConnectedName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");
			sConnectedID   = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");

			changeTemplateObj.setId(sConnectedID); //Organization/Person Object depending on connected TYPE

			//view mode
		if ("view".equals(mode)){
				if(changeTemplateObj.isKindOf(context,TYPE_PERSON)){
					sAvailability = EnoviaResourceBundle.getProperty(context, "emxEnterpriseChangeMgtStringResource", context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Personal" );
					sConnectedName = PersonUtil.getFullName(context,sConnectedName);
				}else{
					sAvailability = EnoviaResourceBundle.getProperty(context, "emxEnterpriseChangeMgtStringResource", context.getLocale(),"EnterpriseChangeMgt.ChangeTemplate.Enterprise");

				}
				sb.append(sAvailability);
				sb.append(": ");
				sb.append(sConnectedName);
			}
			//edit mode
				if("edit".equals(mode)){
				if(isChangeAdmin){
					if(changeTemplateObj.isKindOf(context,TYPE_PERSON)){
						sb.append("<input type=\"radio\" name=\"Availability\" value=\"Personal\" checked = \"checked\" onclick=\"disableOrganizationField(this)\"></input>");
						sb.append(strPersonal);
						sb.append("<br></br>");

						sb.append("<input type=\"radio\" name=\"Availability\" value=\"Enterprise\" onclick=\"disableOrganizationField(this)\"></input>");
						sb.append(strEnterprise);

					}
					else{
						sb.append(sbEnterprise);
					}
				}
				else{
					sb.append(sbPersonal);
				}

			}

		}

		return sb.toString();
	}//end of method

	/**
	 * Program to display the Owning Organization based on the Person's Organization
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments
	 * @return        a <code>MapList</code> object having the list of Change Templates
	 * @throws        Exception if the operation fails
	 * @since         ECM R215
	 **
	 */
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList getOwningOrganizations(Context context, String[] args) throws Exception{

		if (args.length == 0 ){
			throw new IllegalArgumentException();
		}

		boolean userAtHostCompanylevel = false;
		StringList includeOIDList = new StringList();
		HashSet sFinalOrgSet = new HashSet();
		MapList sOrganizationList = new MapList();

		try{
			DomainObject dmObj = DomainObject.newInstance(context);

			SelectList selectList = new SelectList();
			Vector vAssignment = new Vector();
			selectList.add(SELECT_ID);

			String orgId = PersonUtil.getUserCompanyId(context);
			String loggedInPersonId = PersonUtil.getPersonObjectID(context);
			String orgName = new DomainObject(orgId).getInfo(context, SELECT_NAME);

			vAssignment = PersonUtil.getAssignments(context);
			Set setOrganization = new HashSet();
			for(int index=0;index<vAssignment.size();index++) {
				String sOrganization = EMPTY_STRING;
				String securityContext = (String) vAssignment.get(index);
				if(securityContext.contains("Grant"))
					continue;
				int beginIndex = securityContext.indexOf(".");
				int endIndex = securityContext.lastIndexOf(".");
				if(beginIndex!=-1 && endIndex!=-1) {
					beginIndex = beginIndex+1;
					sOrganization = securityContext.substring(beginIndex, endIndex);
					setOrganization.add(sOrganization);
				}
			}
			if(setOrganization.contains(orgName)){
				userAtHostCompanylevel = true;
			}
			if(!userAtHostCompanylevel ){
				Iterator organazationItr = setOrganization.iterator();
				while(organazationItr.hasNext()) {

					String sPersonBUName = (String)organazationItr.next();
					String sPersonBUId = MqlUtil.mqlCommand(context, "temp query bus $1 $2 $3 select $4 dump $5",DomainConstants.TYPE_ORGANIZATION,sPersonBUName,"*","id","|"); 	        
					sPersonBUId = sPersonBUId.substring(sPersonBUId.lastIndexOf('|')+1);


					dmObj.setId(sPersonBUId); //Organization Object
					sFinalOrgSet.add(sPersonBUId);

				sOrganizationList = dmObj.getRelatedObjects(context,
						RELATIONSHIP_DIVISION+","
								+RELATIONSHIP_COMPANY_DEPARTMENT,
								TYPE_ORGANIZATION,
								selectList,
								null,
								false,
								true,
								(short)0,
								EMPTY_STRING,
								EMPTY_STRING,
								null,
								null,
								null);

					Iterator sItr = sOrganizationList.iterator();
					while(sItr.hasNext()){
						Map sTempMap = (Map)sItr.next();
						String sOrgID = (String)sTempMap.get(SELECT_ID);
						sFinalOrgSet.add(sOrgID);
					}

				}
			}
			//If the Person is at Host Company Level
			else{
				dmObj.setId(orgId);
				sFinalOrgSet.add(orgId);

				sOrganizationList = dmObj.getRelatedObjects(context,
						RELATIONSHIP_DIVISION+","
								+RELATIONSHIP_COMPANY_DEPARTMENT,
								TYPE_ORGANIZATION,
								selectList,
								null,
								false,
								true,
								(short)0,
								EMPTY_STRING,
								EMPTY_STRING,
								null,
								null,
								null);

				Iterator sItr = sOrganizationList.iterator();
				while(sItr.hasNext()){
					Map sTempMap = (Map)sItr.next();
					String sOrgID = (String)sTempMap.get(SELECT_ID);
					sFinalOrgSet.add(sOrgID);
				}


			}
			//Iterating final return list
			Iterator itr = sFinalOrgSet.iterator();
			while(itr.hasNext()){
				String id = (String)itr.next();
				includeOIDList.add(id);
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
		return includeOIDList;
	}//end of method

	/**
	 * Reloads the Owning Organization field on Create Change Templates Web-Form
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           0 -  String containing one String entry for key "objectId" of current Organization
	 * @return        a <code>HashMap</code> object Id of Organization.
	 * @throws        Exception if the operation fails
	 * @since         ECM R215
	 **
	 */
	public HashMap reloadOrganizationField(Context context,String[] args)throws FrameworkException{

		HashMap returnMap = new HashMap();
		try{
			HashMap hmProgramMap = (HashMap) JPO.unpackArgs(args);
			HashMap fieldValues = (HashMap) hmProgramMap.get( "fieldValues" );

			String owningOrg = (String)fieldValues.get("OwningOrganization");

			returnMap.put("SelectedValues", owningOrg);
			returnMap.put("SelectedDisplayValues", owningOrg);
		}
		catch(Exception e){
			throw new FrameworkException(e);
		}

		return returnMap;
	}//end of method

	/**
	 * @author R3D
	 * Updates the Owning Organization in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context CO object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R215
	 */
	public void connectOwningOrganization(Context context, String[] args) throws Exception {

		try {
			//unpacking the Arguments from variable args
			HashMap programMap 			= (HashMap)JPO.unpackArgs(args);
			HashMap paramMap   			= (HashMap)programMap.get("paramMap");
			HashMap reqMap 				= (HashMap)programMap.get("requestMap");

			String[] modeCheck          = (String[]) reqMap.get("mode");
			String mode 				= modeCheck[0];
			String loggedInPersonId 	= PersonUtil.getPersonObjectID(context);

			String strNewToTypeObjId 	= (String)paramMap.get(ChangeConstants.NEW_OID);
			String currentCTObjectID 	= (String) paramMap.get("objectId");
			String[]  sAvailability    	= (String[])reqMap.get("Availability");
			String sAvailabilityOption 	= sAvailability[0];
			String user = context.getUser();

			DomainObject dmObj = DomainObject.newInstance(context);
			dmObj.setId(currentCTObjectID); //Template Object

			String relId = dmObj.getInfo(context,"to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].id");

			if("edit".equals(mode)){
				if("Enterprise".equals(sAvailabilityOption)){
					//ContextUtil.pushContext(context);
					DomainRelationship.disconnect(context, relId);
					DomainRelationship.connect(context, DomainObject.newInstance(context, strNewToTypeObjId), ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES, DomainObject.newInstance(context, currentCTObjectID));
					//ContextUtil.popContext(context);
				}
				else if("Personal".equals(sAvailabilityOption)){
					//ContextUtil.pushContext(context);
					DomainRelationship.disconnect(context, relId);
					dmObj.setOwner(context, user);
					DomainRelationship.connect(context, DomainObject.newInstance(context, loggedInPersonId), ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES, DomainObject.newInstance(context, currentCTObjectID));
					//ContextUtil.popContext(context);
				}
			}

			if("create".equals(mode)){
				if("Enterprise".equals(sAvailabilityOption)){
					DomainRelationship.connect(context, DomainObject.newInstance(context, strNewToTypeObjId), ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES, DomainObject.newInstance(context, currentCTObjectID));
				}
				else if("Personal".equals(sAvailabilityOption)){
					DomainRelationship.connect(context, DomainObject.newInstance(context, loggedInPersonId), ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES, DomainObject.newInstance(context, currentCTObjectID));
				}
			}


		}

		catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	}

	/**
	 * This method shows the Owning Organization in Change Template Properties/Edit Page
	 *
	 * @param context   the eMatrix <code>Context</code> object
	 * @param           String[] of ObjectIds.
	 * @return          Object containing CO objects
	 * @throws          Exception if the operation fails
	 * @since           ECM R212
	 */
	public String showOwningOrganization(Context context, String[] args) throws Exception{

		HashMap programMap         = (HashMap) JPO.unpackArgs(args);
		Map requestMap             = (Map) programMap.get("requestMap");
		Map paramMap               = (Map) programMap.get("paramMap");

		String objectId            = (String) requestMap.get("objectId");
		String mode                = (String) requestMap.get("mode");
		StringBuffer sb            = new StringBuffer();

		String sConnectedType 	   = "";
		String sConnectedID   	   = "";
		String sConnectedName 	   = "";
		String sOwningOrg  	  	   = "";
		String sConnectedTitle     = "";

		DomainObject changeTemplateObj = DomainObject.newInstance(context);

		StringList sSelectList = new StringList();
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
		sSelectList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

		if(!UIUtil.isNullOrEmpty(objectId)){

			changeTemplateObj.setId(objectId);
			Map sResultMap = changeTemplateObj.getInfo(context, sSelectList);

			sConnectedID   = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");
			sConnectedType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
			sConnectedName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");

			changeTemplateObj.setId(sConnectedID);
			sConnectedTitle = changeTemplateObj.getInfo(context,"attribute["+DomainConstants.ATTRIBUTE_TITLE+"]");
	
			//view mode
			if("view".equals(mode)){

				if(changeTemplateObj.isKindOf(context, TYPE_PERSON)){
					sOwningOrg = "";
				}else{
					//sOwningOrg = sConnectedName;
					sOwningOrg = sConnectedTitle;
				}
				sb.append(sOwningOrg);
			}

			//edit mode
			if("edit".equals(mode)){
				if(changeTemplateObj.isKindOf(context, TYPE_PERSON)){
					sOwningOrg = "";
				}else{
					//sOwningOrg = sConnectedName;
				    sOwningOrg = sConnectedTitle;
				}
				sb.append(sOwningOrg);
			}
		}
		return sb.toString();
	}//end of method

	/**
	 * Checks the view mode of the web form display.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds a HashMap containing the following entries:
	 * mode - a String containing the mode.
	 * @return Object - boolean true if the mode is view
	 * @throws Exception if operation fails
	 * @since ECM R215
	 */
	public Object checkViewMode(Context context, String[] args)throws Exception{

		@SuppressWarnings("rawtypes")
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		String strMode = (String) programMap.get("mode");
		Boolean isViewMode = Boolean.valueOf(false);

		// check the mode of the web form.
		if( (strMode == null) || (strMode != null && ("null".equals(strMode) || "view".equalsIgnoreCase(strMode) || "".equals(strMode))) ){
			isViewMode = Boolean.valueOf(true);
		}

		return isViewMode;
	}//end of method

	/**
	 * This method returns MapList of Attributes  based on the Search Criteria
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments
	 * @throws Exception if the operation fails
	 * @since ECM R212
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAttributeList(Context context, String[] args)
			throws Exception {
		MapList mlAttributes        = new MapList();
		MapList mlRelatedAttributes = new MapList();
		MapList mlResutList         = new MapList();
		HashMap hmAttribute         = null;
		String strAttributeName     = "";

		HashMap objectMap;
		Iterator itr;
		try {

			HashMap inputMap        = (HashMap)JPO.unpackArgs(args);
			String strDoFilter      = (String)inputMap.get("filter");
			if(null!= strDoFilter && "true".equalsIgnoreCase(strDoFilter)) {
				String strNameMatches   = (String)inputMap.get("ECMAttributeNameMatches");
				String strTypeFilter    = (String)inputMap.get("ECMAttributeType");
				HashMap requestMap      = (HashMap)inputMap.get("RequestValuesMap");

				boolean bUnused = true;

				mlAttributes = getAttributesByQuery(context,strNameMatches,strTypeFilter,bUnused);
				//String  strAttributeGroupName = (String)inputMap.get("parentOID");
				String  strAttributeGroupName = (String)inputMap.get("AGName");
				if(null != strAttributeGroupName && !"null".equalsIgnoreCase(strAttributeGroupName) && !"".equalsIgnoreCase(strAttributeGroupName)){
					String result = "";
					MQLCommand cmd = new MQLCommand();
					MapList returnList = new MapList();

					try {
                        if (cmd.executeCommand(context, "print bus $1 select $2 $3 dump $4",strAttributeGroupName,"attribute","interface.attribute",",")) {
							result = cmd.getResult();
							if ((result != null) && !(result.equalsIgnoreCase(""))&& !(result.equalsIgnoreCase("null"))) {
								itr         = FrameworkUtil.split(result.trim(), "|").iterator();
								while (itr.hasNext()) {
									objectMap = new HashMap();
									strAttributeName = (String)itr.next();
									if (strAttributeName != null && !strAttributeName.trim().equals("")&&!strAttributeName.trim().equals("null")) {
										objectMap.put("id", strAttributeName.trim());
										mlRelatedAttributes.add(objectMap);
									}
								}
							} else {
								throw new Exception(cmd.getError());
							}
						}
					} catch (Exception ex) {
						throw ex;
					}
					Iterator iRelAttributesIter = mlAttributes.iterator();
					while(iRelAttributesIter.hasNext()) {
						hmAttribute = (HashMap)iRelAttributesIter.next();
						if(!mlRelatedAttributes.contains(hmAttribute)) {
							mlResutList.add(hmAttribute);
						}
					}
				} else {
					mlResutList=mlAttributes;
				}
			}
		}
		catch(Exception ex) {
			throw new FrameworkException(ex.toString());
		}

		return mlResutList;
	}//end of method

	/**
	 * This method returns Attributes  based on the Search Criteria
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following input arguments
	 *        0 - Attribute Name Matches
	 *        1 - Attribute Type
	 *        2 - objectId
	 *        3 - Unused Attribute
	 * @throws Exception if the operation fails
	 * @since ECM R212
	 */
	public MapList getAttributesByQuery(Context context, String nameMatches,String typeFilter, boolean unused) throws Exception {
		long initialTime = System.currentTimeMillis();

		MapList result = new MapList();
		HashSet usedAttrSet = new HashSet();

		if (unused) {
                    String agAttrData = MqlUtil.mqlCommand(context, "list attribute $1 select $2 dump $3",true,nameMatches,"name",",").trim();
			StringList agAttrs = FrameworkUtil.split(agAttrData, ",");
			usedAttrSet.addAll(agAttrs);
		}
		String allAttrData ="";
		try{
			allAttrData = MqlUtil.mqlCommand(context, "list attribute $1 select $2 $3 $4 $5 $6 $7 dump $8 recordsep $9", true,nameMatches,"name","type","hidden","description", "owner","application","@","|").trim();
		}catch(Exception ex){
			ex.printStackTrace();
		}

		StringList allAttrRows = FrameworkUtil.split(allAttrData, "|");

		HashSet allAttrNames = new HashSet();
		StringList matchingAttrNamesLst = new StringList();
		Iterator matchingAttrRowIter = allAttrRows.iterator();
		while (matchingAttrRowIter.hasNext()) {
			String row = (String) matchingAttrRowIter.next();
			StringList attrTokens = FrameworkUtil.split(row, "@");
			if (attrTokens.size() < 5) { continue;}  // @ or | in attributes descr }
			String name = (String)attrTokens.get(0);
			String type = (String)attrTokens.get(1);
			String hidden = (String)attrTokens.get(2);
			String description = (String)attrTokens.get(3);
			String owner = (String)attrTokens.get(4);
			
			// Skip hidden attributes
			if (hidden.equals("TRUE")) {
				continue;
			}
			
			// Skip Local Attributes
            if (UIUtil.isNotNullAndNotEmpty(owner)) {
                continue;
            }
            
        	// if type filtering, and type doesn't match, skip
			if (typeFilter != null && !typeFilter.equals("") && !typeFilter.equals("*") &&
					!typeFilter.toUpperCase().trim().equals(type.toUpperCase().trim()) ) {
				continue;
			}

			// if unused filtering, and attributes is used, skip
			if (unused && usedAttrSet.contains(name)) {
				continue;
			}

			HashMap tmp = new HashMap();
			tmp.put("id", name);
			result.add(tmp);
		}
		long finalTime = System.currentTimeMillis();
		return result;
	}//end of method

	/**
	 * Checks the view mode of the web form display.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds a HashMap containing the following entries:
	 * mode - a String containing the mode.
	 * @return Object - boolean true if the mode is view
	 * @throws Exception if operation fails
	 * @since ECM R215
	 */
	public Object checkAccessForEdit(Context context, String[] args)throws Exception{

		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		String strMode = (String) programMap.get("mode");
		Boolean isViewMode = Boolean.valueOf(false);

		boolean isChangeAdmin = ChangeUtil.hasChangeAdministrationAccess(context);
		String orgId = PersonUtil.getUserCompanyId(context);

		String loggedInPersonId = PersonUtil.getPersonObjectID(context);
		Company companyObj = new Company();

		String objectId = (String)programMap.get("objectId");
		DomainObject dmObj = DomainObject.newInstance(context);
		dmObj.setId(objectId); //Template Object

		Map sTempMap = new HashMap();

		StringList selectStrList = new StringList();
		selectStrList.add(SELECT_TYPE);
		selectStrList.add(SELECT_ID);
		selectStrList.add(SELECT_OWNER);
		selectStrList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
		selectStrList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");
		selectStrList.add("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");

		Map sResultMap = dmObj.getInfo(context,selectStrList);
		String sOwner = (String)sResultMap.get(SELECT_OWNER);
		String sConnectedType = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.type");
		String sConnectedName = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.name");
		String sConnectedID = (String)sResultMap.get("to["+ChangeConstants.RELATIONSHIP_CHANGE_TEMPLATES+"].from.id");


		dmObj.setId(loggedInPersonId); //Person Object
		String sPersonBUID = dmObj.getInfo(context,"to["+RELATIONSHIP_BUSINESS_UNIT_EMPLOYEE+"].from.id");
		boolean isBUEmployee = false;


		dmObj.setId(sConnectedID);

		if(dmObj.isKindOf(context,TYPE_PERSON)){
			if(sOwner.equals(context.getUser())){
				isViewMode = Boolean.valueOf(true);
			}
		}

		if(!UIUtil.isNullOrEmpty(sPersonBUID)){
			isBUEmployee = true;
		}
		if(isBUEmployee){
			companyObj.setId(sPersonBUID);
			sTempMap.put("id",sPersonBUID);
		}
		else{
			companyObj.setId(orgId);
			sTempMap.put("id",orgId);
		}
		MapList sList = companyObj.getBusinessUnitsAndDepartments(context, 0, new StringList(SELECT_ID), false);
		sList.add(sTempMap);

		Iterator sItr = sList.iterator();
		while(sItr.hasNext()){
			Map sMap = (Map)sItr.next();
			boolean sContains = sMap.containsValue(sConnectedID);
			if(sContains){
				if(isChangeAdmin){
					isViewMode = Boolean.valueOf(true);
				}
			}
		}
		return isViewMode;
	}//end of method

}
