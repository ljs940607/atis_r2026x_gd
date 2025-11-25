import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.Vector;

import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeUXUtil;
import com.dassault_systemes.changegovernance.interfaces.IChangeGovernanceServices.UserGroup;
import com.dassault_systemes.enovia.changeorder.factory.ChangeOrderFactory;
import com.dassault_systemes.enovia.changeorder.interfaces.IChangeOrder;
import com.dassault_systemes.enovia.changeorder.interfaces.IChangeOrderServices;
import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeConstants;
import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeOrder;
import com.dassault_systemes.enovia.enterprisechangemgtapp.common.ChangeUXUtil;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import matrix.util.SelectList;

import matrix.db.BusinessObject;
import matrix.db.ConnectParameters;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.RelationshipType;
import matrix.util.StringList;
import matrix.db.Query;
import matrix.db.QueryIterator;
import matrix.db.BusinessObjectWithSelect;
import matrix.db.ExpansionIterator;
import matrix.db.RelationshipWithSelect;
import matrix.db.RelationshipType;

public class enoECMChangeOrderUXBase_mxJPO extends emxDomainObject_mxJPO {

	public static final String SUITE_KEY = "EnterpriseChangeMgt";
	private ChangeOrder changeOrder     =  null;
	private ChangeUXUtil changeUtil       =  null;
	private static final String SOURCE_TYPE = "sourceType";
	private static final String TYPE_CHANGE_REQUEST = "type_ChangeRequest";
	
	public enoECMChangeOrderUXBase_mxJPO(Context context, String[] args)throws Exception {
		super(context, args);
		changeOrder   = new ChangeOrder ();
		changeUtil    = new ChangeUXUtil();
		// TODO Auto-generated constructor stub
	}

	/**
	 * To create the Change Object from Create Component
	 *
	 * @author
	 * @param context the eMatrix code context object
	 * @param args packed hashMap of request parameter
	 * @return Map contains change object id
	 * @throws Exception if the operation fails
	 * @Since ECM R211
	 * Copied from enoECMChangeOrder JPO for IR-805940-3DEXPERIENCER2020x, IR-805940-3DEXPERIENCER2021x
	 */
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createChange(Context context, String[] args) throws Exception {

	    HashMap programMap   = (HashMap) JPO.unpackArgs(args);
	    HashMap requestValue = (HashMap) programMap.get(ChangeConstants.REQUEST_VALUES_MAP);
	    HashMap requestMap   = (HashMap) programMap.get(ChangeConstants.REQUEST_MAP);
	    String strFunctinality = (String)programMap.get("functionality");
	    String strObjectId = (String)programMap.get("objectId");
	    String strCreationMode = (String)programMap.get("CreateMode");

	    String sType   = ChangeUXUtil.getStringFromArr((String[])requestValue.get("TypeActual"),0);
	    String sPolicy = "";
	    if(strCreationMode.equals("CloneCO")) {

	    	sPolicy = ChangeUXUtil.getStringFromArr((String[])requestValue.get("Policy2"),0);
	    }
	    else {
	    	sPolicy = ChangeUXUtil.getStringFromArr((String[])requestValue.get("Policy"),0);
	    }
	    String sVault  = ChangeUXUtil.getStringFromArr((String[])requestValue.get("Vault"),0);
	    String sOwner  = ChangeUXUtil.getStringFromArr((String[])requestValue.get("Owner"),0);
	    String sDescription = ChangeUXUtil.getStringFromArr((String[])requestValue.get("Description"),0);
	    String sChangeTemplateID  = ChangeUXUtil.getStringFromArr((String[])requestValue.get("ChangeTemplateOID"),0);
	    String effectivityExpr =  ChangeUXUtil.getStringFromArr((String[])requestValue.get("ChangeEffectivityOID"),0);
	    String selectedObjId =  ((String)programMap.get("selectedObjIdList"));
	    String fromConfiguredBOMView = "false";

	    if (UIUtil.isNullOrEmpty(selectedObjId)) {
	    	selectedObjId =  ((String) programMap.get("selectedPartsList")); // for XCE use case selected objectIds will be passed.
	    	fromConfiguredBOMView = "true";
	    }

	    sType   = UIUtil.isNotNullAndNotEmpty(sType)  ? (String) programMap.get("TypeActual") : EMPTY_STRING;
	    if(strCreationMode.equals("CloneCO")) {

	    	sPolicy = UIUtil.isNotNullAndNotEmpty(sPolicy)? (String) programMap.get("Policy2") : EMPTY_STRING;
	    }
	    else {
	    	sPolicy = UIUtil.isNotNullAndNotEmpty(sPolicy)? (String) programMap.get("Policy") : EMPTY_STRING;
	    }

	    String strPreImplementationReviewersID = (String) programMap.get("PreImplementationReviewersOID");
	    
	    sVault  = UIUtil.isNotNullAndNotEmpty(sVault) ? (String) programMap.get("Vault") : EMPTY_STRING;
	    sOwner  = UIUtil.isNotNullAndNotEmpty(sOwner) ? (String) programMap.get("Owner") : EMPTY_STRING;    
	    String changeId   = "";
	    String sInterfaceName = "";
	    String[] sourceAffectedItemRowIds= null;

	    Map returnMap     = new HashMap();
	    boolean bAutoName = false;

	    try {
	    	IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();	    	
	    	if("CreateNewCOUnderCO".equalsIgnoreCase(strFunctinality) && !ChangeUXUtil.isNullOrEmpty(strObjectId)){
	    		//Updated to use new modeler api............START
	    		DomainObject domObj = DomainObject.newInstance(context,strObjectId);
	    		IChangeOrder iChangeOrderParent = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domObj);
	    		IChangeOrder iChangeOrderChild = changeOrderFactory.createChangeOrder(context, sType, sPolicy, null, sDescription, null, strPreImplementationReviewersID);
	    		//IChangeOrder iChangeOrderChild = changeOrderFactory.createChangeOrder(context, sType, sPolicy, null, sDescription, null);
	    		iChangeOrderParent.addChangeOrder(context, iChangeOrderChild.getPhysicalId());
	    		changeId = iChangeOrderChild.getM1Id();
	    		//Updated to use new modeler api............END
	    	}else{
	    		//Updated to use new modeler api............START
	    		IChangeOrder iChangeOrder = changeOrderFactory.createChangeOrder(context, sType, sPolicy, null, sDescription, null, strPreImplementationReviewersID);
	    		//IChangeOrder iChangeOrder = changeOrderFactory.createChangeOrder(context, sType, sPolicy, null, sDescription, null);
	    		changeId = iChangeOrder.getM1Id();
	    		//Updated to use new modeler api............END
	    	}
	    	//Updated to use new modeler api............START
	        //DomainObject coDomObj = DomainObject.newInstance(context, changeId);
	        //coDomObj.setDescription(context, sDescription);
	    	//Updated to use new modeler api............END
	        //Logic to apply Interface of Template to CO
			if(!UIUtil.isNullOrEmpty(sChangeTemplateID)){
	                        sInterfaceName = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump $3",sChangeTemplateID,"interface","|");
				if(!UIUtil.isNullOrEmpty(sInterfaceName)){
					Iterator intrItr         = FrameworkUtil.split(sInterfaceName, "|").iterator();
					//Add all Change Template Interfaces to CO
					for(int i=0; intrItr.hasNext();i++){
						MqlUtil.mqlCommand(context, "modify bus $1 add interface $2",changeId,(String)intrItr.next());
					}
				}
			}

			/*
			We do not have effectivity on CO.
			//Added for displaying effectivity field on CO properties page for Mobile Mode
	        if(UINavigatorUtil.isMobile(context)){
	        	EffectivityUtil.setEffectivityOnChange(context,changeId,"");
			}
			*/
			
	        returnMap.put(ChangeConstants.ID, changeId);

	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new FrameworkException(e);
	    }

	    return returnMap;
	}
	
	/**
	 * To update the Change Order's change coordinator using create/edit form
	 * @author skr15
	 * @param context the eMatrix code context object
	 * @param args packed hashMap of request parameter
	 * @return 
	 * @throws Exception if the operation fails
	 * @Since ECM R424
	 */
	public void connectChangeCoordinator(Context context, String[] args) throws Exception {
		//unpacking the Arguments from variable args
		HashMap programMap = (HashMap)JPO.unpackArgs(args);
		HashMap paramMap   = (HashMap)programMap.get("paramMap");
		
        //Get CO object
		String changeOrderId = (String)paramMap.get("objectId");
		DomainObject domObj = DomainObject.newInstance(context,changeOrderId);
		IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
	    IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domObj);
	    
	    //Updating change coordinator
	    String strChangeCoordinator = (String)paramMap.get(ChangeConstants.NEW_VALUE);
	    iChangeOrder.setChangeCoordinator(context, strChangeCoordinator);
	}
	
	/**
	 * To connect the Change Order with route template during creation
	 * @author skr15
	 * @param context the eMatrix code context object
	 * @param args packed hashMap of request parameter
	 * @return 
	 * @throws Exception if the operation fails
	 * @Since ECM R424
	 */
	public void connectRouteTemplate (Context context, String[] args) throws Exception {		
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
        HashMap fieldMap   = (HashMap) programMap.get(ChangeConstants.FIELD_MAP);
        HashMap paramMap   = (HashMap) programMap.get(ChangeConstants.PARAM_MAP);
        
        //getting Route Template Object ID
        String strNewToTypeObjId = (String)paramMap.get(ChangeConstants.NEW_OID);
        
        //if not null/empty try to connect with CO
        if(!ChangeUXUtil.isNullOrEmpty(strNewToTypeObjId)){
	        
	        //getting Route Template Physical ID
	        String strNewRouteTemplatePhyId = new DomainObject(strNewToTypeObjId).getInfo(context, "physicalid");
	        
	        //getting CO Object ID
	        String strObjectId = (String)paramMap.get(ChangeConstants.OBJECT_ID);
	        DomainObject domObj = DomainObject.newInstance(context, strObjectId);
			
			//Connecting Route Template with CO
			IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
		    IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domObj);
		    iChangeOrder.addApprovalRouteTemplate(context, strNewRouteTemplatePhyId); 
	    }
	}
	
 	/**
  	 * Get Informed Users Field
  	 * @param Context context
  	 * @param args holds information about object.
  	 * @return Informed Users Field.
  	 * @throws Exception if operation fails.
  	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String selectInformedUsers(Context context,String[] args)throws Exception
	{
		boolean isEditable = false;
		boolean isMobileDevice = false;
		StringBuilder sb = new StringBuilder();
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		String strMode = (String) requestMap.get("mode");
		String changeOrderId = (String) requestMap.get("objectId");
		String styleDisplayPerson = "block";
		String styleDisplayMemberList = "block";
		StringList finalInformedUsersList = new StringList();
		StringList slInformedUsers = new StringList();
		StringList slMemberListId = new StringList();

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
		if(null != changeOrderId){
			IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
			DomainObject domObj = DomainObject.newInstance(context, changeOrderId);
		    IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domObj);
			
			//Has Access to add/remove informed users
		    Map<String, Boolean>  mpAccessInfo = iChangeOrder.getAccessMap(context);
			if(mpAccessInfo.containsKey("ManageFollowers")) {
				isEditable =  mpAccessInfo.get("ManageFollowers");
			}
			
			//Get existing Members list
			MapList mlMemberList = domObj.getRelatedObjects(context,
					  DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST,
					  DomainConstants.TYPE_MEMBER_LIST,
					  new StringList(DomainConstants.SELECT_ID),
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			if(!mlMemberList.isEmpty()){
				Iterator itrMemberList = mlMemberList.iterator();
				while(itrMemberList.hasNext()){
					Map mpMemberList = (Map)itrMemberList.next();
					String memberListId = (String) mpMemberList.get(DomainConstants.SELECT_ID);
					slMemberListId.add(memberListId);
				}
			}
									
			//Get existing Informed Users
			List<String> lsInformedUsers = iChangeOrder.getFollowers(context);
			slInformedUsers.addAll(lsInformedUsers);
		}	
		
		String informedUsers = DomainObject.EMPTY_STRING;
		String informedUsersType = DomainObject.EMPTY_STRING;
		if(!slMemberListId.isEmpty() && slInformedUsers.isEmpty())
		{
			 styleDisplayPerson="none";
		}
		else if(slMemberListId.isEmpty() && !slInformedUsers.isEmpty())
		{
			styleDisplayMemberList="none";
		}
		else if(!slMemberListId.isEmpty() && !slInformedUsers.isEmpty()){
			styleDisplayPerson="none";
		}

		if (slInformedUsers!=null && !slInformedUsers.isEmpty() && slMemberListId.isEmpty()){
			for (int i=0;i<slInformedUsers.size();i++) {
				String informedUserName = (String) slInformedUsers.get(i);
				String informedUserId = PersonUtil.getPersonObjectID(context, informedUserName);
				String informedUserType = new DomainObject(informedUserId).getInfo(context, DomainConstants.SELECT_TYPE);
				informedUsers=informedUsers.concat(informedUserId+",");
				informedUsersType=informedUsersType.concat(informedUserType+",");
				finalInformedUsersList.add(informedUserId);
			}
		}
		
		if (slMemberListId!=null && !slMemberListId.isEmpty()){
			for (int i=0;i<slMemberListId.size();i++) {
				String memberListId = (String) slMemberListId.get(i);
				String informedUserType = new DomainObject(memberListId).getInfo(context, DomainConstants.SELECT_TYPE);
				informedUsers=informedUsers.concat(memberListId+",");
				informedUsersType=informedUsersType.concat(informedUserType+",");
				finalInformedUsersList.add(memberListId);
			}
		}

		if(informedUsers.length()>0 && !informedUsers.isEmpty()){
			informedUsers = informedUsers.substring(0,informedUsers.length()-1);
			informedUsersType = informedUsersType.substring(0,informedUsersType.length()-1);
		}	
		
		if(!isMobileDevice && ("edit".equalsIgnoreCase(strMode) && isEditable)|| "create".equalsIgnoreCase(strMode))
		{
			String addMemberList= EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.AddMemberList", context.getSession().getLanguage());
			String addPeople= EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.AddPeople", context.getSession().getLanguage());
			String remove = EnoviaResourceBundle.getProperty(context,SUITE_KEY,
					"EnterpriseChangeMgt.Command.Remove", context.getSession().getLanguage());
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"IsInformedUsersFieldModified\" id=\"IsInformedUsersFieldModified\" value=\"false\" readonly=\"readonly\" />");
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"InformedUsersHidden\" id=\"InformedUsersHidden\" value=\""+informedUsers+"\" readonly=\"readonly\" />");
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"InformedUsersHiddenType\" id=\"InformedUsersHiddenType\" value=\""+informedUsersType+"\" readonly=\"readonly\" />");
			sb.append("<table>");
			sb.append("<tr>");
			sb.append("<th rowspan=\"3\">");
			sb.append("<select name=\"InformedUsers\" style=\"width:200px\" multiple=\"multiple\">");

			if (finalInformedUsersList!=null && !finalInformedUsersList.isEmpty()){
				for (int i=0; i<finalInformedUsersList.size(); i++) {
					String informedUserId = (String) finalInformedUsersList.get(i);
					if (informedUserId != null && !informedUserId.isEmpty()) {
						String informedUserName = new DomainObject(informedUserId).getInfo(context, DomainConstants.SELECT_NAME);
						String informedUserFullName = PersonUtil.getFullName(context, informedUserName);
						if (informedUserName!=null && !informedUserName.isEmpty()) {
							sb.append("<option value=\""+informedUserId+"\" >");
							//XSSOK
							sb.append(informedUserFullName);
							sb.append("</option>");
						}
					}
				}
			}
			
			sb.append("</select>");
			sb.append("</th>");
			sb.append("<td>");
			sb.append("<div style=\"display:"+styleDisplayPerson+"\" name=\"InformedUsersHidePerson\" id=\"InformedUsersHidePerson\">");
			sb.append("<a href=\"javascript:addInformedUsersPersonSelectors()\">");
			sb.append("<img src=\"../common/images/iconStatusAdded.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:addInformedUsersPersonSelectors()\">");
			//XSSOK
			sb.append(addPeople);
			sb.append("</a>");
			sb.append("</div>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("<tr>");
			sb.append("<td>");
			sb.append("<div style=\"display:"+styleDisplayMemberList+"\" name=\"InformedUsersHideMemberList\" id=\"InformedUsersHideMemberList\">");
			sb.append("<a href=\"javascript:addInformedUsersMemberListSelectors()\">");
			sb.append("<img src=\"../common/images/iconStatusAdded.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:addInformedUsersMemberListSelectors()\">");
			//XSSOK
			sb.append(addMemberList);
			sb.append("</a>");
			sb.append("</div>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("<tr>");
			sb.append("<td>");
			sb.append("<a href=\"javascript:removeInformedUsers()\">");
			sb.append("<img src=\"../common/images/iconStatusRemoved.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("</a>");
			sb.append("<a href=\"javascript:removeInformedUsers()\">");
			//XSSOK
			sb.append(remove);
			sb.append("</a>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("</table>");			
			
		}else {
			if(!exportToExcel)
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"InformedUsersHidden\" id=\"InformedUsersHidden\" value=\""+informedUsers+"\" readonly=\"readonly\" />");
			if (finalInformedUsersList!=null && !finalInformedUsersList.isEmpty()){
				for (int i=0;i<finalInformedUsersList.size();i++) {
				    String  lastInformedUserId = (String)finalInformedUsersList.get(finalInformedUsersList.size()-1);
					String informedUserId = (String) finalInformedUsersList.get(i);
					if (informedUserId!=null && !informedUserId.isEmpty()) {
						StringList slObjSelect = new StringList();
						slObjSelect.add(DomainConstants.SELECT_NAME);
						slObjSelect.add(DomainConstants.SELECT_TYPE);
						Map mpObjInfo = DomainObject.newInstance(context, informedUserId).getInfo(context, slObjSelect);
						String informedUserName = (String) mpObjInfo.get(DomainConstants.SELECT_NAME);
						String informedUserType = (String) mpObjInfo.get(DomainConstants.SELECT_TYPE);
						String informedUserFullName = PersonUtil.getFullName(context, informedUserName);
						if (informedUserName!=null && !informedUserName.isEmpty()) {
							if(!exportToExcel)
								//XSSOK
								sb.append("<input type=\"hidden\" name=\""+informedUserFullName+"\" value=\""+informedUserId+"\" />");
								
								if(informedUserType.equalsIgnoreCase("Member List") && !exportToExcel){
									sb.append("<a href=\"JavaScript:emxFormLinkClick('../common/emxTree.jsp?objectId=");
									sb.append(XSSUtil.encodeForHTMLAttribute(context, informedUserId));
									sb.append("','content', '', '', '')\">");
									sb.append(XSSUtil.encodeForHTML(context, informedUserFullName));
									sb.append("</a>");
								}else {
									//XSSOK
									sb.append(informedUserFullName);
								}
							
							if(!lastInformedUserId.equalsIgnoreCase(informedUserId))
								if(!exportToExcel)
									sb.append("<br>");
								else
									sb.append("\n");
						}
					}
				}
			}
		}
		
		return sb.toString();
	}
	
	/**
	 * connectInformedUsers - Connect Change Oder and Person or member list
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	@com.matrixone.apps.framework.ui.ConnectionProgramCallable
	public void connectInformedUsers(Context context, String[] args)throws Exception
	{
		try{
			Map programMap = (HashMap)JPO.unpackArgs(args);
			HashMap hmParamMap = (HashMap)programMap.get("paramMap");
			String changeOrderId = (String)hmParamMap.get("objectId");
			HashMap requestMap = (HashMap) programMap.get("requestMap");
			String[] strNewIUArr = (String[])requestMap.get("InformedUsersHidden");
			String[] strIsFieldModifiedArr = (String[])requestMap.get("IsInformedUsersFieldModified");
			String strIsFieldModified = "true";
			if(strIsFieldModifiedArr != null && strIsFieldModifiedArr.length > 0){
				strIsFieldModified = strIsFieldModifiedArr[0];				
			}
			//To make the decision of calling connect/disconnect method only on field modification.
			if("true".equalsIgnoreCase(strIsFieldModified)){
				DomainObject domChange = DomainObject.newInstance(context, changeOrderId);
				IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
			    IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domChange);
				String strNewInformedUsers=null;
				
				if(strNewIUArr != null && strNewIUArr.length > 0){
					strNewInformedUsers = strNewIUArr[0];
				}
				
				//Get Members list
				StringList slMemberListRelId = new StringList();
				MapList mlMemberList = domChange.getRelatedObjects(context,
						  DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST,
						  DomainConstants.TYPE_MEMBER_LIST,
						  new StringList(DomainObject.SELECT_ID),
						  new StringList(DomainRelationship.SELECT_ID),
						  false,
						  true,
						  (short) 1,
						  null, null, (short) 0);
				if(!mlMemberList.isEmpty()){
					Iterator itrMemberList = mlMemberList.iterator();
					while(itrMemberList.hasNext()){
						Map mpMemberList = (Map)itrMemberList.next();
						String memberListRelId = (String) mpMemberList.get(DomainRelationship.SELECT_ID);
						slMemberListRelId.add(memberListRelId);
					}
				}
				
				List<String> newInformedUserNameList=new ArrayList<String>();
				if(!checkMemberList(context, strNewInformedUsers)){
					StringTokenizer strNewInformedUsersList = new StringTokenizer(strNewInformedUsers,",");
					while (strNewInformedUsersList.hasMoreTokens()){
						String strInformedUser = strNewInformedUsersList.nextToken().trim();
						Person personObj = new Person(strInformedUser);
						String personName = personObj.getInfo(context,SELECT_NAME);
						newInformedUserNameList.add(personName);
					}
				}
				
				//Existing Informed Users
				List<String> informedUserslistOld = iChangeOrder.getFollowers(context);
				
				List<String> informedUsersDisconnectList = differenceBetweenList(informedUserslistOld, newInformedUserNameList);
				List<String> informedUsersConnectList = differenceBetweenList(newInformedUserNameList, informedUserslistOld);
				
				//Disconnecting old person from Change Order
				for(int i=0; i< informedUsersDisconnectList.size(); i++) {
					iChangeOrder.removeFollower(context, informedUsersDisconnectList.get(i));
				}
				
				//Disconnecting old Member List from Change Order
				if(!slMemberListRelId.isEmpty()){
					if(strNewInformedUsers.isEmpty()||!checkMemberList(context,strNewInformedUsers)){
						for(int i=0; i<slMemberListRelId.size(); i++){
							String strMemberListRelID =	(String) slMemberListRelId.get(i);
							DomainRelationship.disconnect(context, strMemberListRelID);
						}
					}
				}
				
				//Connecting new informed users to Change Order
				if(!strNewInformedUsers.isEmpty()){
					if(!checkMemberList(context,strNewInformedUsers)){
						for(int i=0; i< informedUsersConnectList.size(); i++) {
							iChangeOrder.addFollower(context, informedUsersConnectList.get(i));
						}
					}else
					{
						if(strNewInformedUsers.indexOf(",") == -1){														
							if(!slMemberListRelId.isEmpty() && !(slMemberListRelId == null)){								
								for(int i=0; i<slMemberListRelId.size(); i++){
									String strMemberListRelID =	(String) slMemberListRelId.get(i);
									DomainRelationship.disconnect(context, strMemberListRelID);
								}	
							}
							
							//Connect new member list
							DomainRelationship.connect(context, domChange, DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST, DomainObject.newInstance(context, strNewInformedUsers));
						}
						else{
							throw new FrameworkException(EnoviaResourceBundle.getProperty(context, "emxEnterpriseChangeMgtStringResource", context.getLocale(), "EnterpriseChangeMgt.Notice.TooManyMemberList"));
						}
					}		
				}
			}
		}
		catch(Exception e){
			throw new FrameworkException(e.getMessage());
		}			
	}

	/**
	 * differenceBetweenList - return the difference(A-B) between firstList and secondList
	 * @param context
	 * @param List firstList
	 * @param List secondList
	 * @return List result(Fist-Second)
	 * @throws Exception
	 */
	public List differenceBetweenList(List<String> firstList, List<String> secondList)throws Exception
	{
		List resulList=new ArrayList<String>();
		try
		{
			if(!firstList.isEmpty()){
				resulList.addAll(firstList);
			}
			if(!resulList.isEmpty()){
				resulList.removeAll(secondList);
			}
		}
		catch(Exception e){
			throw new FrameworkException(e.getMessage());
		}
		return resulList;
	}	
	
	/**
	 * checkMemberList - Check whether given string contain Member List type or Not
	 * @param Context  context
	 * @param String informed users
	 * @return boolean -true/false
	 * @throws Exception
	 */
	public static boolean checkMemberList(Context context,String informedUsers)throws Exception{

		try {
			StringTokenizer strNewInformedUsersList = new StringTokenizer(informedUsers,",");
			while (strNewInformedUsersList.hasMoreTokens())
			{
				String strInformedUser = strNewInformedUsersList.nextToken().trim();
				DomainObject domainObj=new DomainObject(strInformedUser);
				String objType=domainObj.getInfo(context,SELECT_TYPE);
				if(objType.equalsIgnoreCase(DomainConstants.TYPE_MEMBER_LIST)){
					return true;
				}
			}
		}
		catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}
		return false;
	}		

 	/**
  	 * Get Informed Users with user group Field
  	 * @param Context context
  	 * @param args holds information about object.
  	 * @return Informed Users with user group Field.
  	 * @throws Exception if operation fails.
  	 * Added for IR-875061-3DEXPERIENCER2022x
  	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String selectInformedUsersWithGroup(Context context,String[] args)throws Exception
	{
		boolean isEditable = false;
		boolean isMobileDevice = false;
		StringBuilder sb = new StringBuilder();
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		String strMode = (String) requestMap.get("mode");
		String changeOrderId = (String) requestMap.get("objectId");
		
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
		if(null != changeOrderId){
			
			DomainObject domChangeOrder = DomainObject.newInstance(context, changeOrderId);
			IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
			IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domChangeOrder); 
						
			//Has Access to add/remove informed users
			Map<String, Boolean> accessMap = iChangeOrder.getAccessMap(context);
			if(accessMap.containsKey(strFollowerAccessKey)) {
				isEditable = accessMap.get(strFollowerAccessKey);
			}
			//Get existing Members list
			
			StringList objSelects = new StringList();
			objSelects.add(DomainConstants.SELECT_ID);
			objSelects.add(DomainConstants.SELECT_NAME);
			objSelects.add(DomainConstants.SELECT_TYPE);
			MapList mlMemberList = domChangeOrder.getRelatedObjects(context,
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
			List<UserGroup> lsGroupFollower = iChangeOrder.getGroupFollowers(context);
			MapList mlGroupFollower = new MapList();
			StringList slGroupFollowerPhyId = new StringList();
			for (int i=0; i<lsGroupFollower.size(); i++) {
				UserGroup userGroup = lsGroupFollower.get(i);
				String strUserGroupPhyId = userGroup._physicalid;
				String strUserGroupURI = userGroup._uri;
				String strUserGroupTitle = userGroup._title;
				
				//get physical id from uuid if physical id not there
				if(ChangeUXUtil.isNullOrEmpty(strUserGroupPhyId) && !ChangeUXUtil.isNullOrEmpty(strUserGroupURI)) {
					strUserGroupPhyId = FrameworkUtil.getPhysicalIdfromUUId(context, strUserGroupURI);
				}
				
				if(!ChangeUXUtil.isNullOrEmpty(strUserGroupPhyId)) {
					slGroupFollowerPhyId.add(strUserGroupPhyId);
					
					Map<String, String> mpUserGroup = new HashMap<String, String>();
					mpUserGroup.put(DomainConstants.SELECT_PHYSICAL_ID, strUserGroupPhyId);
					mpUserGroup.put(DomainConstants.ATTRIBUTE_GROUPURI, strUserGroupURI);
					mpUserGroup.put(DomainConstants.ATTRIBUTE_TITLE, strUserGroupTitle);
					mlGroupFollower.add(mpUserGroup);
				}
			}
			
			//Getting object id from physicalid
			StringList selects = new StringList(2);
			selects.add(DomainConstants.SELECT_ID);
			selects.add(DomainConstants.SELECT_PHYSICAL_ID);
			MapList mlGroupFollowerId = DomainObject.getInfo(context, (String[])slGroupFollowerPhyId.toArray(new String[slGroupFollowerPhyId.size()]), selects);
			
			//Merging maplist for object id
			for (int i=0; i<mlGroupFollower.size(); i++) {
				Map mpUserGroup = (Map) mlGroupFollower.get(i);
				String strUserGroupPhyId = (String) mpUserGroup.get(DomainConstants.SELECT_PHYSICAL_ID);
				for(int j=0; j<mlGroupFollowerId.size(); j++) {
					Map mpUserGroupId = (Map) mlGroupFollowerId.get(i);
					String strGroupPhyId = (String) mpUserGroupId.get(DomainConstants.SELECT_PHYSICAL_ID);
					String strGroupId = (String) mpUserGroupId.get(DomainConstants.SELECT_ID);
					if(strUserGroupPhyId.equals(strGroupPhyId)) {
						mpUserGroup.put(DomainConstants.SELECT_ID, strGroupId);
						mlInformedUsers.add(mpUserGroup);
						informedUserGroups = informedUserGroups.concat(strGroupId+",");
						break;
					}					
				}
			}
						
			//Get existing user followers
			List<String> lsUserFollower = iChangeOrder.getFollowers(context);
			for (int i=0; i<lsUserFollower.size(); i++) {
				String informedUserName = (String) lsUserFollower.get(i);
				String informedUserId = PersonUtil.getPersonObjectID(context, informedUserName);
				String informedUserFullName = PersonUtil.getFullName(context, informedUserName);
				Map<String, String> mpUserFollower = new HashMap<String, String>();
				mpUserFollower.put(DomainConstants.SELECT_TYPE, DomainConstants.TYPE_PERSON);
				mpUserFollower.put(DomainConstants.SELECT_ID, informedUserId);
				mpUserFollower.put(DomainConstants.SELECT_NAME, informedUserName);
				mpUserFollower.put(USER_FULL_NAME, informedUserFullName);
				mlInformedUsers.add(mpUserFollower);	
				
				informedUsers = informedUsers.concat(informedUserId+",");
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
		
		if(!isMobileDevice && ("edit".equalsIgnoreCase(strMode) && isEditable)|| "create".equalsIgnoreCase(strMode))
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
	 * connectInformedUsersWithGroup - Connect Change order and Person or user group
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
		String changeOderId = (String)hmParamMap.get("objectId");
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
			
			DomainObject domChangeOrder = DomainObject.newInstance(context, changeOderId);
			IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
			IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, domChangeOrder); 
			
			String strNewUserFollowers = null;			
			if(strNewUserFollowerArr != null && strNewUserFollowerArr.length > 0){
				strNewUserFollowers = strNewUserFollowerArr[0];
			}
			
			String strNewGroupFollowers = null;			
			if(strNewGroupFollowerArr != null && strNewGroupFollowerArr.length > 0){
				strNewGroupFollowers = strNewGroupFollowerArr[0];
			}
			
			String strNewMemberListFollowers = null;			
			if(strNewMemberListFollowerArr != null && strNewMemberListFollowerArr.length > 0){
				strNewMemberListFollowers = strNewMemberListFollowerArr[0];
			}
			
			StringList selects = new StringList(4);
			selects.add(DomainConstants.SELECT_TYPE);
			selects.add(DomainConstants.SELECT_NAME);
			selects.add(DomainConstants.SELECT_ID);
			selects.add(DomainConstants.SELECT_PHYSICAL_ID);
			
			StringList slInformedUsers = new StringList();
			StringTokenizer strNewUserFollowersList = new StringTokenizer(strNewUserFollowers,",");
			while (strNewUserFollowersList.hasMoreTokens()){
				String strInformedUser = strNewUserFollowersList.nextToken().trim();
				slInformedUsers.add(strInformedUser);
			}
			
			StringTokenizer strNewGroupFollowersList = new StringTokenizer(strNewGroupFollowers,",");
			while (strNewGroupFollowersList.hasMoreTokens()){
				String strInformedUser = strNewGroupFollowersList.nextToken().trim();
				slInformedUsers.add(strInformedUser);
			}
			
			MapList mlInformedUsers = DomainObject.getInfo(context, (String[])slInformedUsers.toArray(new String[slInformedUsers.size()]), selects);
			
			List<String> newInformedUserNameList = new ArrayList<String>();
			List<String> newGroupFollowerList = new ArrayList<String>();
			for(int i=0; i<mlInformedUsers.size(); i++) {
				Map mpInformedUser = (Map)mlInformedUsers.get(i);
				String strInformedUserPhyId = (String) mpInformedUser.get(DomainConstants.SELECT_PHYSICAL_ID);
				String strInformedUserType = (String) mpInformedUser.get(DomainConstants.SELECT_TYPE);
				String strInformedUserName = (String) mpInformedUser.get(DomainConstants.SELECT_NAME);
				if(!ChangeUXUtil.isNullOrEmpty(strInformedUserType) && (DomainConstants.TYPE_PERSON.equalsIgnoreCase(strInformedUserType))) {	
					newInformedUserNameList.add(strInformedUserName);
				}else {
					newGroupFollowerList.add(strInformedUserPhyId);
				}
			}
			
			//Existing group followers
			List<UserGroup> lsGroupFollower = iChangeOrder.getGroupFollowers(context);
			List<String> lsExistinGroupFollower = new ArrayList<String>();
			for(int i=0; i<lsGroupFollower.size(); i++) {
				UserGroup userGroup = lsGroupFollower.get(i);
				String strUserGroupPhyId = userGroup._physicalid; 
				String strUserGroupURI = userGroup._uri; 
				//get physical id from uuid if physical id not there
				if(ChangeUXUtil.isNullOrEmpty(strUserGroupPhyId) && !ChangeUXUtil.isNullOrEmpty(strUserGroupURI)) {
					strUserGroupPhyId = FrameworkUtil.getPhysicalIdfromUUId(context, strUserGroupURI);
				}
				lsExistinGroupFollower.add(strUserGroupPhyId);				
			}
			
			List<String> groupFollowerDisconnectList = differenceBetweenList(lsExistinGroupFollower, newGroupFollowerList);
			List<String> groupFollowerConnectList = differenceBetweenList(newGroupFollowerList, lsExistinGroupFollower);
			
			//Existing Informed Users
			List<String> lsUserFollower = iChangeOrder.getFollowers(context);
			
			List<String> informedUsersDisconnectList = differenceBetweenList(lsUserFollower, newInformedUserNameList);
			List<String> informedUsersConnectList = differenceBetweenList(newInformedUserNameList, lsUserFollower);
			
			//Disconnecting old informed users from Change Order
			for(String strFollower : informedUsersDisconnectList) {
				iChangeOrder.removeFollower(context, strFollower);
			}
						
			//Connecting new informed users to Change Order
			for(String strFollower : informedUsersConnectList) {
				iChangeOrder.addFollower(context, strFollower);	
			}
			
			//Disconnecting old group follower from Change Order
			for(String strGroupFollower : groupFollowerDisconnectList) {
				iChangeOrder.removeGroupAsFollower(context, strGroupFollower);
			}
						
			//Connecting new group follower to Change Order
			for(String strGroupFollower : groupFollowerConnectList) {
				iChangeOrder.addGroupAsFollower(context, strGroupFollower);	
			}
			
			//Code for handling member list remove
			//Creating set of updated member list after edit
			StringTokenizer strNewMemberListFollowersList = new StringTokenizer(strNewMemberListFollowers,",");
			Set<String> setOfNewMemberListIDs = new HashSet<>();
			while (strNewMemberListFollowersList.hasMoreTokens()){
				String strInformedUser = strNewMemberListFollowersList.nextToken().trim();
				setOfNewMemberListIDs.add(strInformedUser);
			}
			
			//getting existing
			MapList mlExistingMemberList = domChangeOrder.getRelatedObjects(context,
					  DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST,
					  DomainConstants.TYPE_MEMBER_LIST,
					  new StringList(DomainConstants.SELECT_ID),
					  new StringList(DomainRelationship.SELECT_ID),
					  false,
					  true,
					  (short) 1,
					  null, null, (short) 0);
			
			//if existing ML is not present in updated ML set, add to disconnectlist
			List<String> memberListFollowerDisconnectList = new ArrayList<String>();
			if(!mlExistingMemberList.isEmpty()){
				Iterator itrMemberList = mlExistingMemberList.iterator();
				while(itrMemberList.hasNext()){
					Map memberList = (Map)itrMemberList.next();
					String memberListId = (String) memberList.get(DomainConstants.SELECT_ID);
					String memberListRelId = (String) memberList.get(DomainRelationship.SELECT_ID);
					if(setOfNewMemberListIDs.contains(memberListId)) {
						setOfNewMemberListIDs.remove(memberListId);
					}
					else {
						memberListFollowerDisconnectList.add(memberListRelId);
					}
				}
			}
			if(setOfNewMemberListIDs.size()>0) {
				for (String newMemberListFollowerID : setOfNewMemberListIDs) {
					RelationshipType rel_Follower = new RelationshipType(DomainConstants.RELATIONSHIP_EC_DISTRIBUTION_LIST);
					ConnectParameters connectParams = new ConnectParameters();
					connectParams.setRelType(rel_Follower);
					connectParams.setFrom(true);
					connectParams.setTarget(new BusinessObject(newMemberListFollowerID));
					new BusinessObject(changeOderId).connect(context,connectParams);
				}
			}
			//if disconnectlist has items disconnect them
			if(memberListFollowerDisconnectList.size()>0) {
				String[] memberListFollowerDisconnectArr = new String[memberListFollowerDisconnectList.size()];
				memberListFollowerDisconnectArr = memberListFollowerDisconnectList.toArray(memberListFollowerDisconnectArr);
				DomainRelationship.disconnect(context, memberListFollowerDisconnectArr);
			}
		}
					
	}/**
     * @author
     * this method performs the hold process of change Order
     * @param context
     *            the eMatrix <code>Context</code> object.
     * @param args
     *            holds the following input arguments: - The ObjectID of the Change Order
     * @throws Exception
     *             if the operation fails.
     */
    @com.matrixone.apps.framework.ui.PostProcessCallable
    public void holdChange(Context context, String[] args)throws Exception {

        HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
        HashMap requestMap = (HashMap)paramMap.get(ChangeConstants.REQUEST_MAP);
		String objectId    = ChangeUXUtil.isNullOrEmpty((String)paramMap.get(ChangeConstants.OBJECT_ID))? (String)requestMap.get(ChangeConstants.OBJECT_ID) : (String)paramMap.get(ChangeConstants.OBJECT_ID);
		String holdReason  = ChangeUXUtil.isNullOrEmpty((String)paramMap.get("holdReason"))? (String)requestMap.get("Reason") : (String)paramMap.get("holdReason");
		DomainObject dom = new DomainObject(objectId);
		IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
		IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, dom);
		iChangeOrder.setOnHold(context, holdReason);
    }


    /**@author
	 * Resumes the Hold Changes and sends notification and updates the history
	 * @param context
	 * @throws Exception
	 */
	public void resumeChange(Context context,String[] args)throws Exception {

        HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
        HashMap requestMap = (HashMap) paramMap.get(ChangeConstants.REQUEST_MAP);
		String objectId    = ChangeUXUtil.isNullOrEmpty((String)paramMap.get(ChangeConstants.OBJECT_ID))? (String)requestMap.get(ChangeConstants.OBJECT_ID) : (String)paramMap.get(ChangeConstants.OBJECT_ID);DomainObject dom = new DomainObject(objectId);
		IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
		IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, dom);
		iChangeOrder.resume(context,EMPTY_STRING);
	}

    /**
	 * Cancel change order 
	 * @param context
	 * @throws Exception
	 */
	@com.matrixone.apps.framework.ui.PostProcessCallable
    public void cancelChange(Context context, String[] args)throws Exception {

		HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
        HashMap requestMap = (HashMap) paramMap.get(ChangeConstants.REQUEST_MAP);
		String objectId    = ChangeUXUtil.isNullOrEmpty((String)paramMap.get(ChangeConstants.OBJECT_ID))? (String)requestMap.get(ChangeConstants.OBJECT_ID) : (String)paramMap.get(ChangeConstants.OBJECT_ID);
		String cancelReason  = ChangeUXUtil.isNullOrEmpty((String)paramMap.get("cancelReason"))? (String)requestMap.get("Reason") : (String)paramMap.get("cancelReason");
		DomainObject dom = new DomainObject(objectId);
		IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
		IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, dom);
		iChangeOrder.cancel(context, cancelReason);
    }
	/**
	 * This method is used as access function for Hold functionality.
	 * @param context
	 * @param args
	 * @return True or False
	 * @throws Exception
	 */
	public boolean isHoldCOAvailable(Context context,String []args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
		String strObjId   = (String)programMap.get(ChangeConstants.OBJECT_ID);
		boolean isAccessible = false;
		
		try{
			isAccessible = getAccessBitForKey(context,strObjId,"Hold");
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return isAccessible;
	 }
	/**
	 * This method is used as access function for Resume functionality.
	 * @param context
	 * @param args
	 * @return True or False
	 * @throws Exception
	 */
	public boolean isResumeCOAvailable(Context context,String []args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
		String strObjId   = (String)programMap.get(ChangeConstants.OBJECT_ID);
		boolean isAccessible = false;
		
		try{
			isAccessible = getAccessBitForKey(context,strObjId,"Resume");
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return isAccessible;
	 }
	/**
	 * This method is used as access function for Resume functionality.
	 * @param context
	 * @param args
	 * @return True or False
	 * @throws Exception
	 */
	public boolean isCancelCOAvailable(Context context,String []args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
		String strObjId   = (String)programMap.get(ChangeConstants.OBJECT_ID);
		boolean isAccessible = false;
		
		try{
			isAccessible = getAccessBitForKey(context,strObjId,"Cancel");
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return isAccessible;
	 }
	/**
	 * This method is used as access function for Transfer functionality.
	 * @param context
	 * @param args
	 * @return True or False
	 * @throws Exception
	 */
	public boolean isTransferCOAvailable(Context context,String []args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
		String strObjId   = (String)programMap.get(ChangeConstants.OBJECT_ID);
		boolean isAccessible = false;
		
		try{
			isAccessible = getAccessBitForKey(context,strObjId,"TransferOwnership");
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return isAccessible;
	 }
	private boolean getAccessBitForKey(Context context,String changeOrderId, String key) {
		boolean accessBit = false;
		try {
			DomainObject dom = new DomainObject(changeOrderId);
			IChangeOrderServices changeOrderFactory = ChangeOrderFactory.createChangeOrderFactory();
			IChangeOrder iChangeOrder = changeOrderFactory.retrieveChangeOrderFromDatabase(context, dom);
			Map<String, Boolean> mpAccess = iChangeOrder.getAccessMap(context);
			if(mpAccess.containsKey(key))
				accessBit = mpAccess.get(key);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return accessBit;
	}
	
	/**
	 * This method check if manage members are allowed on CO
	 * @param context
	 * @param args
	 * @return 
	 * @throws Exception
	 */
		@com.matrixone.apps.framework.ui.PreProcessCallable
	public void checkEditAccessOnField(Context context, String args[]) throws Exception {
		try {
			Map programMap = JPO.unpackArgs(args);
			Map requestMap = (Map) programMap.get("requestMap");
			
			String strObjectId = (String) requestMap.get("parentOID");
			String formName    = (String) requestMap.get("form");
			
			Map<?, ?> formMap = (Map<?, ?>) programMap.get("formMap");
			MapList formFieldList = (MapList) formMap.get("fields");
					
			boolean isSetCoordinatorAllowed = false;
			boolean isManageFollowersAllowed = false;
			boolean isManageRouteTemplatesAllowed = false;
	
			isSetCoordinatorAllowed = getAccessBitForKey(context, strObjectId, "SetCoordinator");
			
			isManageFollowersAllowed = getAccessBitForKey(context, strObjectId, "ManageFollowers");
			
			isManageRouteTemplatesAllowed = getAccessBitForKey(context, strObjectId, "ManageRouteTemplates");
			
			if(formName.equals("type_ChangeOrder")){
				for (Object map : formFieldList) {
					Map fieldMap = (Map) map;
					String strFieldName = (String) fieldMap.get(DomainObject.SELECT_NAME);
				
					if ((strFieldName.equals("ChangeCoordinator") && !isSetCoordinatorAllowed) || (strFieldName.equals("ApprovalList") && !isManageRouteTemplatesAllowed) || (strFieldName.equals("InformedUsersWithGroup") && !isManageFollowersAllowed)) {
						Map settingMap = (Map) fieldMap.get("settings");
						settingMap.put("Editable", "false");
					}
				}
			}

		}
		catch (Exception e) {
			throw new Exception(e.getLocalizedMessage());
		}
	}
	
	    /**
         * Program get all the CO (assigned via Route, Route Template, Owned)
         * @param context the eMatrix <code>Context</code> object
         * @param args    holds the following input arguments:
         *           0 -  MapList containing "objectId"
         * @return        a <code>MapList</code> object having the list of Assignees,their relIds and rel names for this Change Object
         * @throws        Exception if the operation fails
         * @since         ECM R211
         **
     */
    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList getMyChangeOrders(Context context,String args[]) throws Exception{
        MapList objList = new MapList();
		try{
			String objectId 			= PersonUtil.getPersonObjectID(context);

			StringList strCOOwned 		= (StringList)getOwnedCO(context, args);
            StringList sRouteCO 		= getRouteTaskAssignedCOs(context, objectId);
            StringList sRouteTemplateCO = getRouteTemplateAssignedCOs(context, objectId);

            Set hs = new HashSet();
            hs.addAll(strCOOwned);
            hs.addAll(sRouteCO);
            hs.addAll(sRouteTemplateCO);

            Iterator itr = hs.iterator();
            String id = "";
            while(itr.hasNext()){
                id = (String)itr.next();
                Map map = new HashMap();
                map.put("id", id);
                objList.add(map);
            }
            if(objList.size()!=0)
                return objList;
           else
                return new MapList();
        }catch (Exception e) {

            throw e;
        }
    }

    /**
       * Program returns StringList of CO Object IDs if the context user is Owner/Change Initiator(Originator)/Change Coordinator.
       * @param context the eMatrix <code>Context</code> object
       * @param args    holds the following input arguments:
       *           0 -  Object
       * @return        a <code>MapList</code> object having the list of Assignees,their relIds and rel names for this Change Object
       * @throws        Exception if the operation fails
       * @since         ECM R211
       **
     */
    public Object getOwnedCO(Context context,String args[]) throws Exception{
    	StringList slOwnedCO = new StringList();
    	try{
    		String userName = context.getUser();

    		// 1 - We need to retrieve all the Change Orders owned by the user
    		List<String> coOwned = new ArrayList<String>();

    		// 1.1 - Create the Query
    		Query ownedCOQuery = new Query("Change Owned by User Query" );

    		// 1.2 - Define the type
    		ownedCOQuery.setBusinessObjectType(ChangeConstants.TYPE_CHANGE_ORDER);

    		// 1.3 - Create the Where clause
    		String ownedCOQueryWhereClause = "owner=='"+userName+"' || attribute[Originator]=='"+userName+"'";
    		ownedCOQuery.setWhereExpression(ownedCOQueryWhereClause);

    		// 1.4 - Define the selectables
    		StringList ownedCOQuerySelectables = new StringList();
    		String idSelectable = "id";
    		ownedCOQuerySelectables.add(idSelectable);

    		// 1.5 - Perform the Query
    		QueryIterator itOwnedCO = ownedCOQuery.getIterator(context, ownedCOQuerySelectables, (short)1024);

    		try{
    			while( itOwnedCO.hasNext())
    			{
    				BusinessObjectWithSelect ownedCOSelect = itOwnedCO.next();

    				String ownedCOId = ownedCOSelect.getSelectData(idSelectable);

    				if(ownedCOId!=null && !slOwnedCO.contains(ownedCOId)){
    					slOwnedCO.add(ownedCOId);
    				}
    			}
    		}
    		finally{
    			itOwnedCO.close();
    			ownedCOQuery.close(context);
    		}

    		//  Reterive all Change Orders in which user is Change Coordinator
    		// 2 - Retrieve the "Person" Object from which expand should start. Get out of this part if person is not found
    		BusinessObject person = getPersonObjectFromName(context, userName);

    		if(null!=person)
    		{

    			// 2.1 - Define the rel pattern on which expand is performed
    			String relPattern = ChangeConstants.RELATIONSHIP_CHANGE_COORDINATOR ;

    			// 2.2 - Define the selectables to retrieve on the objects
    			StringList busSelectables = new StringList();

    			String kindOfChangeOrderSelectable = "type.kindof["+ChangeConstants.TYPE_CHANGE_ORDER+"]";

    			busSelectables.add(idSelectable);
    			busSelectables.add(kindOfChangeOrderSelectable);

    			// 2.3 - Define the selectables to apply on the relationship
    			StringList relSelectables = new StringList();
    			
    			// 2.4 - Perform the expand
    			ExpansionIterator itr = null;

    			try
    			{
    				// 2.4.1 - Get the expansion iterator
    				itr = person.getExpansionIterator(context, relPattern, "*", busSelectables, relSelectables, true, false, (short)1, "", "", (short)0, false, true, (short)1024, false);

    				// 2.4.2 - Loop through the results
    				while (itr.hasNext())
    				{
    					// 2.4.2.1 - Get the next element
    					RelationshipWithSelect relWithSelect = itr.next();

    					// 2.4.2.3 - Get the pointed element
    					BusinessObjectWithSelect boWithSelect = relWithSelect.getTarget();

    					// 2.4.2.4 - Get the data
    					String strId = boWithSelect.getSelectData(idSelectable);
    					String kindOfChangeOrder = boWithSelect.getSelectData(kindOfChangeOrderSelectable);


    					// 2.4.2.5 - If this is a kind of Change Order then it needs to be added
    					if(kindOfChangeOrder!=null && kindOfChangeOrder.equalsIgnoreCase("true"))
    					{
    							if(strId!=null && !strId.isEmpty() && !slOwnedCO.contains(strId)){
    								slOwnedCO.add(strId);
    						}
    					}
    				}

    			}finally{	
    				if(itr!=null)
    					itr.close();					
    			}
    		}
    	}catch (Exception e) {
    		throw e;
    	}
    	return slOwnedCO;
    }
	
	/**
     * Retrieves  Change Order assigned to person via Route Task
     * @author R3D
     * @param context
     * @param args
     * @return
     * @throws Exception
     */
    public StringList getRouteTaskAssignedCOs(Context context, String personObjId) throws Exception {

    	 String objSelect   = "to["+RELATIONSHIP_PROJECT_TASK+"].from."+
     			"from["+RELATIONSHIP_ROUTE_TASK+"].to."+
     			"to["+RELATIONSHIP_OBJECT_ROUTE+"|from.type.kindof["+ChangeConstants.TYPE_CHANGE_ORDER+"]].from.id";

         String sCO = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump",personObjId,objSelect);
    	return FrameworkUtil.split(sCO, ChangeConstants.COMMA_SEPERATOR);
    }

    /**
     * Retrieves  Change Order assigned to person via Route Template where Route Base Purpose is Approval/Review
     * @author R3D
     * @param context
     * @param args
     * @return
     * @throws Exception
     */
    public StringList getRouteTemplateAssignedCOs(Context context,String personObjId) throws Exception {


    	String objSelect   = "to["+RELATIONSHIP_ROUTE_NODE+"|from.type=='"+TYPE_ROUTE_TEMPLATE+"']."+
   			 "from.to["+RELATIONSHIP_INITIATING_ROUTE_TEMPLATE+"].from."+
   			 "to["+RELATIONSHIP_OBJECT_ROUTE+"|from.type=='"+ChangeConstants.TYPE_CHANGE_ORDER+"'].from.id";

      	String sCO = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump",personObjId,objSelect);
    	return FrameworkUtil.split(sCO, ChangeConstants.COMMA_SEPERATOR);
    }
	
	private static BusinessObject getPersonObjectFromName(Context context, String personName) throws Exception{
        		String output = MqlUtil.mqlCommand(context,"temp query bus $1 $2 $3 limit 1 select $4 dump $5", PropertyUtil.getSchemaProperty(context,"type_Person"), personName, "*", "id", "#");
        		
        		if(output!=null && !output.isEmpty())
        		{
        			String[] outputSplitted = output.split("#");
        			String personId = outputSplitted[3];
        			
        			return new BusinessObject(personId);
        		}
        		return null;
    }
	
	/**
	 * Used to get Tasks of CO/CA for Mass Approval
	 * @param context
	 * @param objectId
	 * @return
	 * @throws Exception
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getChangeTasks(Context context, String[] args) throws Exception {
		try {
			HashMap programMap              = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap              = (HashMap)programMap.get("requestMap");
			MapList mlTableData 			= new MapList();
			String objectIDs 				= (String)programMap.get("objectIdToApprove");
			StringList objectList 			= FrameworkUtil.split(objectIDs, ",");
			String sObjectId 				= "";
			Map mapTemp = new HashMap();

			Iterator itr = objectList.iterator();
			while(itr.hasNext()){
				sObjectId 		= (String)itr.next();
				mlTableData.addAll((new com.dassault_systemes.enovia.enterprisechange.modeler.ChangeOrder(sObjectId)).getCurrentAssignedTasksOnObject(context));
			}
			int nSerialNumber = 0;
            for (Iterator objectListItr = mlTableData.iterator(); objectListItr.hasNext(); nSerialNumber++) {
                mapTemp = (Map) objectListItr.next();

                // Add level value else sorting will give problem
                mapTemp.put("serialNumber", String.valueOf(nSerialNumber));
            }
			return mlTableData;
		}
		catch(Exception exp) {
			exp.printStackTrace();
			throw new FrameworkException(exp.getMessage());
		}
	}

	/**
	 * Displays Cloned CO Name on Copy Selected page
	 * @author
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public boolean showFieldInClone(Context context,String []args) throws Exception {

		boolean sReturn = false;
		HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) paramMap.get(ChangeConstants.REQUEST_MAP);
		String sCeateMode    = (String)paramMap.get("CreateMode");
		if("CloneCO".equals(sCeateMode)){
			sReturn = true;
		}
		return sReturn;
	}

	/**
	 * Displays Cloned CO Name on Copy Selected page
	 * @author
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public String getClonedCOName(Context context,String []args) throws Exception {

		HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) paramMap.get(ChangeConstants.REQUEST_MAP);
		String objectId    = (String)requestMap.get("copyObjectId");
		DomainObject dmObj = DomainObject.newInstance(context);
		if(!UIUtil.isNullOrEmpty(objectId)){
			dmObj.setId(objectId);
			return dmObj.getName(context);}
		else
        return "";
	}

	/**
	 * @author R3D
	 * Updates the Change Template in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context CO object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R215
	 */
	public DomainRelationship connectChangeTemplate(Context context, String[] args) throws Exception {

		try {
			ContextUtil.pushContext(context, ChangeConstants.USER_AGENT, null, null);
			//unpacking the Arguments from variable args
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap   = (HashMap)programMap.get("paramMap");
			HashMap requestMap = (HashMap)programMap.get("requestMap");
			String objectId    = (String)paramMap.get(ChangeConstants.OBJECT_ID);
			changeOrder.setId(objectId);

			String[] sChangeTemplateOID = (String[])requestMap.get("ChangeTemplateOID");
			String ssChangeTemplateID = null;
			if(sChangeTemplateOID != null)
				ssChangeTemplateID = sChangeTemplateOID[0];
			String sInterfaceName = "";
			String sReferenceDoc = "";
			Iterator intrItr;
			String sCOType = changeOrder.getInfo(context, SELECT_TYPE);
			StringList intrList;
			String[] arrRefDoc;

			//Connecting Reference Document of Template to CO
			DomainObject dmObj = DomainObject.newInstance(context);
			if(!UIUtil.isNullOrEmpty(ssChangeTemplateID)){
				dmObj.setId(ssChangeTemplateID);
				//IR-248788V6R2014x
				intrList = dmObj.getInfoList(context, "from["+RELATIONSHIP_REFERENCE_DOCUMENT+"].to.id");
				if(!UIUtil.isNullOrEmpty(intrList.toString().trim())){
					arrRefDoc = (String[])intrList.toArray(new String[0]);
					changeOrder.addRelatedObjects(context, new RelationshipType(RELATIONSHIP_REFERENCE_DOCUMENT) , true, arrRefDoc);
				}
			}
			
			DomainRelationship rel = changeOrder.connect(context,paramMap,ChangeConstants.RELATIONSHIP_CHANGE_INSTANCE, false);
			
			ContextUtil.popContext(context);
			
			return rel;
		}

		catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	}//end of method


	/**
	 * Displays Cloned CO Name on Copy Selected page
	 * @author
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public boolean showFieldInCreate(Context context,String []args) throws Exception {

		boolean sReturn = false;
		HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) paramMap.get(ChangeConstants.REQUEST_MAP);
		String sCeateMode    = (String)paramMap.get("CreateMode");
		if("CreateCO".equals(sCeateMode)){
			sReturn = true;
		}

		return sReturn;
	}
	
	/**This method includes Responsible Organisation OIDs for Create CO RO field search.
	 * @author
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList includeROs(Context context, String []args) throws Exception {
		boolean isChangeRequest = false;
		if (args.length == 0 ){
			throw new IllegalArgumentException();
		}

		//Check if Change Request object creation
		HashMap paramMap   = (HashMap) JPO.unpackArgs(args);
		String sourceType = (String) paramMap.get(SOURCE_TYPE);
		if(sourceType != null){
			if(sourceType.trim().equals(this.TYPE_CHANGE_REQUEST)){
				isChangeRequest = true;
			}
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


			StringList SCList = new StringList();
			SCList = PersonUtil.getSecurityContextsNames(context, context.getUser());

			vAssignment = PersonUtil.getAssignments(context);
			Set setOrganization = new HashSet();

			for(int index = 0; index<SCList.size(); index++) {
				String sOrganization = EMPTY_STRING;
				String securityContext = (String) SCList.get(index);
				int beginIndex = securityContext.indexOf(".");
				int endIndex = securityContext.lastIndexOf(".");
				if(beginIndex!=-1 && endIndex!=-1) {
					beginIndex = beginIndex+1;
					String sRole = securityContext.substring(0, (beginIndex - 1));
					if(!isRoleOCDX(context,sRole) || isChangeRequest ||
							(sRole.indexOf("Admin") >= 0 || sRole.indexOf("Leader") >= 0)) {
						sOrganization = securityContext.substring(beginIndex, endIndex);
						System.out.println("Organization Name::ZUK " + sOrganization);
						setOrganization.add(sOrganization);
					}
				}

			}

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
					System.out.println("BU/Dept Name::ZUK " + sOrgID);
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
	}

	/**
	 * @author
	 * Updates the Responsible Organisation in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context CO object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R211
	 */
	public void connectResponsibleOrganisation(Context context, String[] args) throws Exception {

		try {
			//unpacking the Arguments from variable args
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap   = (HashMap)programMap.get(ChangeConstants.PARAM_MAP);
			String objectId    = (String)paramMap.get(ChangeConstants.OBJECT_ID);
			String strROName     = (String)paramMap.get("New Value");
			changeOrder.setId(objectId);
			if(UIUtil.isNotNullAndNotEmpty(strROName)) {
				String strProject = changeOrder.getInfo(context, SELECT_PROJECT);
				//changed for IR-994761
				//changeOrder.setPrimaryOwnership(context, ChangeUXUtil.getDefaultProject(context), strROName);
				changeOrder.setPrimaryOwnership(context, strProject, strROName); 
	  		}
		}

		catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	}
	
	/**
	 * @author
	 * Generates dynamic search types for Reported Against field
	 * @param context
	 * @param args
	 * @return String
	 * @throws Exception
	 */
	public String getFieldSearchTypes(Context context, String[] args) throws Exception {

		String searchTypes = (String)changeUtil.getRelationshipTypes(context,ChangeConstants.RELATIONSHIP_REPORTED_AGAINST_CHANGE,true,false,null);
		return "TYPES="+searchTypes;
	}

	/**
	 * @author
	 * Updates the Reported Against field in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context ECR object Id
	 * New Value holds the newly selected Reported Against Object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R211

	 */
	public DomainRelationship connectReportedAgainstChange (Context context, String[] args) throws Exception {

		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap   = (HashMap)programMap.get(ChangeConstants.PARAM_MAP);
			String strObjectId = (String)paramMap.get(ChangeConstants.OBJECT_ID);
			String strOldValue = (String) new DomainObject(strObjectId).getInfo(context, "from["+ChangeConstants.RELATIONSHIP_REPORTED_AGAINST_CHANGE+"].to.id");
			paramMap.replace(ChangeConstants.OLD_VALUE, strOldValue);
			return connect(context,paramMap,ChangeConstants.RELATIONSHIP_REPORTED_AGAINST_CHANGE);

		}catch(Exception ex){
			ex.printStackTrace();
			throw  new FrameworkException((String)ex.getMessage());
		}
	}
	
	/*Identify if given role is OCDX-role*/
	private boolean isRoleOCDX(Context context, String role) throws FrameworkException{
		boolean isOCDX = false;
		if(role != null){
			role = role.trim();
			String sResultOCDX = MqlUtil.mqlCommand(context,"print role $1 select $2",
					role,"property[SOLUTION].value");
			if(sResultOCDX!=null && !sResultOCDX.isEmpty() && sResultOCDX.contains("Team")){
				isOCDX = true;
			}
		}
		return isOCDX;
	}

	/**
	 * @author
	 * Updates the Responsible Organisation in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context CO object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R211
	 */
	private DomainRelationship connect(Context context, HashMap paramMap,String targetRelName) throws Exception {

		try {
			String objectId    = (String)paramMap.get(ChangeConstants.OBJECT_ID);
			changeOrder.setId(objectId);
			return changeOrder.connect(context,paramMap,targetRelName, true);
		}

		catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	}

	/**
	 * Method to get dynamic search string for Change Template search in Mass Change Functionality
	 *  (Mass Release or Mass Obsolete)
	 * @author M24
	 * @param context - the eMatrix <code>Context</code> object
	 * @param <code>String[]</code> args - requestMap
	 * @return String StringPattern
	 * @throws Exception if the operation fails
	 * @since ECM R216
	 */
	public String getCTDynamicSearchQuery(Context context, String [] args) throws Exception {
		StringBuffer returnString  = new StringBuffer();
		returnString.append("TYPES=type_ChangeTemplate:CURRENT=policy_ChangeTemplate.state_Active");
		HashMap programMap   = (HashMap)JPO.unpackArgs(args);
		Map requestMap       = (HashMap)programMap.get(ChangeConstants.REQUEST_MAP);
		String functionality = (String)requestMap.get("functionality");

		boolean isCreateChildCOUnderFasttrackCO = false;
        if("CreateNewCOUnderCO".equalsIgnoreCase(functionality)){
        	String strObjectId = (String)requestMap.get("objectId");
        	if(!ChangeUXUtil.isNullOrEmpty(strObjectId)){
        		String strParentPolicy = new DomainObject(strObjectId).getPolicy(context).getName();
        		 isCreateChildCOUnderFasttrackCO = ChangeConstants.POLICY_FASTTRACK_CHANGE.equalsIgnoreCase(strParentPolicy)?true:false;
        	}
        }

		if((UIUtil.isNotNullAndNotEmpty(functionality)&&(ChangeConstants.FOR_RELEASE.equals(functionality)||ChangeConstants.FOR_OBSOLETE.equals(functionality))||isCreateChildCOUnderFasttrackCO))
			returnString.append(":ECM_CHANGE_POLICY=").append(ChangeConstants.FASTTRACK_CHANGE);
		return returnString.toString();
	}

    /**
     * @author
     * This method is called from update program of CO, Create/Edit, Reviewer/Approval List fields.
     * @param context ematrix context.
     * @param args holds a Map with the following input arguments.
     * @throws Exception if any operation fails.
     */
    public void updateApprovalRouteObject (Context context, String[] args) throws Exception {

    	System.out.println("Inside  updateApprovalRouteObject ");
         HashMap programMap = (HashMap) JPO.unpackArgs(args);
         HashMap fieldMap   = (HashMap) programMap.get(ChangeConstants.FIELD_MAP);
         HashMap paramMap   = (HashMap) programMap.get(ChangeConstants.PARAM_MAP);

		 String strNewToTypeObjId = (String)paramMap.get(ChangeConstants.NEW_OID);
		 String strOldToTypeObjId = (String)paramMap.get(ChangeConstants.OLD_OID);

         String objectId           = (String)paramMap.get(ChangeConstants.OBJECT_ID);

		 strNewToTypeObjId = (ChangeUXUtil.isNullOrEmpty(strNewToTypeObjId)) ?
							 (String)paramMap.get(ChangeConstants.NEW_VALUE) : strNewToTypeObjId ;

		 strOldToTypeObjId = (ChangeUXUtil.isNullOrEmpty(strOldToTypeObjId)) ?
							 (String)paramMap.get(ChangeConstants.OLD_VALUE) : strOldToTypeObjId ;

		new ChangeOrder(objectId).updateRouteObject(context, strNewToTypeObjId, strOldToTypeObjId, "Approval");
     }

	/**
	 * @author
	 * Updates the Responsible Organisation in CO WebForm.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args contains a MapList with the following as input arguments or entries:
	 * objectId holds the context CO object Id
	 * @throws Exception if the operations fails
	 * @since ECM-R211
	 */
	@Deprecated
	public DomainRelationship connectChangeCoordinatorCT(Context context, String[] args) throws Exception {

		try {
			//unpacking the Arguments from variable args
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap   = (HashMap)programMap.get("paramMap");

			return connect(context,paramMap,ChangeConstants.RELATIONSHIP_CHANGE_COORDINATOR);
		}

		catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	}
}
