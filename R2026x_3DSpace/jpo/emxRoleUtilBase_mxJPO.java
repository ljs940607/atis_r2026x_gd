import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.Role;
import matrix.db.RoleItr;
import matrix.db.RoleList;
import matrix.util.Pattern;
import matrix.util.StringList;
import matrix.db.*;


import com.matrixone.apps.domain.*;
import com.matrixone.apps.common.*;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkProperties;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.RoleUtil;
import com.matrixone.apps.domain.util.i18nNow;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;


// ${CLASSNAME}.java
//
// Created on Aug 7, 2010
//
// Copyright (c) 2005 MatrixOne Inc.
// All Rights Reserved
// This program contains proprietary and trade secret information of
// MatrixOne, Inc.  Copyright notice is precautionary only and does
// not evidence any actual or intended publication of such program.
//

/**
 * @author sg2
 *
 * The <code>${CLASSNAME}</code> class/interface contains ...
 *
 * @version AEF 11.0.0.0 - Copyright (c) 2005, MatrixOne, Inc.
 */
public class emxRoleUtilBase_mxJPO extends emxCommonMigration_mxJPO {

    public emxRoleUtilBase_mxJPO(Context context, String[] args) throws Exception {
        super(context, args);
    }
    
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    final String SELECT_OWNERSHIP_TYPE = "from[ESignOwnership].to.type";
    final String SELECT_OWNERSHIP_NAME = "from[ESignOwnership].to.name";
    final String SELECT_CONFIG_REL_ID = "from[ESignOwnership].id";
    final String fileSeparator = java.io.File.separator;
    
    public MapList getRoleListForSummaryTable(List roleNames, List rolesToDisable) {
        MapList roles = new MapList(roleNames.size());
        HashMap roleDetails = new HashMap(2);
        
        for (int i = 0; i < roleNames.size(); i++) {
            Map clone = (Map) roleDetails.clone();
            
            Object role = roleNames.get(i);
            String selectable = rolesToDisable != null && rolesToDisable.contains(role) ? "true" : "false";
            
            clone.put(SELECT_ID, role);
            clone.put("disableSelection", selectable);
            
            roles.add(clone);
        }
        return roles;
    }
    
    public StringList getI18NRoleName(Context context, String[] args) throws FrameworkException {
        try {
            Map programMap = (Map) JPO.unpackArgs(args);
            MapList objectList = (MapList)programMap.get("objectList");
            HashMap paramList  = (HashMap) programMap.get("paramList");
            String strLanguage = (String) paramList.get("languageStr");
            StringList roleNames = new StringList(objectList.size());
            for (int i = 0; i < objectList.size(); i++) {
                Map objectMap = (Map)objectList.get(i);
                roleNames.add((String)objectMap.get(SELECT_ID));
            }
            return i18nNow.getAdminI18NStringList("Role", roleNames, strLanguage);
        } catch (Exception e) {
            throw new FrameworkException(e);
        }
    }
    
    public StringList getI18NRoleDescription(Context context, String[] args) throws FrameworkException {
        try {
            Map programMap = (Map) JPO.unpackArgs(args);
            MapList objectList = (MapList)programMap.get("objectList");
            StringList roleDesc = new StringList(objectList.size());
            HashMap paramList  = (HashMap) programMap.get("paramList");
            String strLanguage = (String) paramList.get("languageStr");

            for (int i = 0; i < objectList.size(); i++) {
                Map objectMap = (Map)objectList.get(i);
                roleDesc.add(i18nNow.getRoleDescriptionI18NString((String) objectMap.get(SELECT_ID), strLanguage));
            }
            return roleDesc;
        } catch (Exception e) {
            throw new FrameworkException(e);
        }
    }
    
   @com.matrixone.apps.framework.ui.ProgramCallable
   public MapList getRolesSearchResults(Context context, String[] args) throws FrameworkException {
       try {
           Map programMap = (Map) JPO.unpackArgs(args);
           HashMap requestMap      = (HashMap)programMap.get("RequestValuesMap");
           String[] topLevelArr = requestMap == null ? null : (String [])requestMap.get("APPFilterTopLevelCheckbox");
           String[] subLevelArr = requestMap == null ? null : (String [])requestMap.get("APPFilterSubLevelCheckbox");
           
           String sNamePattern         = (String)programMap.get("APPNameMatchesTextbox");
           String sTopChecked        = topLevelArr != null && topLevelArr.length > 0 ? topLevelArr[0] : null;
           String sSubChecked        = subLevelArr != null && subLevelArr.length > 0 ? subLevelArr[0] : null;
           
           String objectId             = (String)programMap.get("objectId");
           List allRolesList           = getAllRolesList(context, objectId, sNamePattern, sSubChecked, sTopChecked, -1);
           return getRoleListForSummaryTable(allRolesList, null);
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
   }
  
   protected List getAllRolesList(Context context, String objectId, String namePattern, String sSubChecked, String sTopChecked, int queryLimit) throws Exception  {
       try {

           String strOrgId = null;
           if(!"".equals(objectId) && objectId != null) {
               DomainObject doType   = DomainObject.newInstance(context, objectId);
               strOrgId       = ((String)doType.getInfo(context, SELECT_TYPE)).equals(DomainConstants.TYPE_PERSON) ? new Person(objectId).getCompanyId(context) :  
                       			((String)doType.getInfo(context, SELECT_TYPE)).equals(DomainConstants.TYPE_COMPANY)? objectId : null;
           }
           
           List resultsList  = new ArrayList();
           String languageStr = context.getSession().getLanguage();
           Role role  = new Role();
           List roleList = getRoleNameList(context, role.getRoles(context));
           List topRoles = getRoleNameList(context, role.getTopLevelRoles(context));
           if(!"true".equalsIgnoreCase(sTopChecked) && "true".equalsIgnoreCase(sSubChecked)) {
               roleList.removeAll(topRoles);
           } else if("true".equalsIgnoreCase(sTopChecked) && !"true".equalsIgnoreCase(sSubChecked)) {
               roleList = topRoles;
           }
           
           // this vector will eliminate the roles to be displayed.
           Set orgSpecificRoles = null;
           if(strOrgId != null && strOrgId.length() > 0) {
               orgSpecificRoles = new HashSet();
               String isSetupAsPrivateExchange = "true";
               try {isSetupAsPrivateExchange = EnoviaResourceBundle.getProperty(context,"emxComponents.isSetupAsPrivateExchange"); }
               catch(Exception e){}

               boolean isPrivateExchange = !(isSetupAsPrivateExchange != null && "false".equalsIgnoreCase(isSetupAsPrivateExchange.trim()));

               if(!(new emxOrganization_mxJPO(context, null).isParentCompanyAHostCompany(context, strOrgId)))   {
                   orgSpecificRoles.add(PropertyUtil.getSchemaProperty(context, "role_BusinessManager"));
                   orgSpecificRoles.add(PropertyUtil.getSchemaProperty(context, "role_ProgramLead"));
                   orgSpecificRoles.add(PropertyUtil.getSchemaProperty(context, "role_ProjectAdministrator"));
                   orgSpecificRoles.add(PropertyUtil.getSchemaProperty(context, "role_ProjectLead"));
                   orgSpecificRoles.add(PropertyUtil.getSchemaProperty(context, "role_ProjectUser"));

                   // for hiding emplyee and sub roles.
                   String strEmpRole = PropertyUtil.getSchemaProperty(context, "role_Employee");
                   orgSpecificRoles.add(strEmpRole);
                   Role roleEmployee = new Role(strEmpRole);
                   orgSpecificRoles.addAll(getRoleNameList(context, getChildRoles (context,roleEmployee)));
                   // this is defined to eliminate some roles from the "above rolelist for hiding"
                   if(!isPrivateExchange) {
                       orgSpecificRoles.remove(PropertyUtil.getSchemaProperty(context, "role_Buyer"));
                       orgSpecificRoles.remove(PropertyUtil.getSchemaProperty(context, "role_BuyerAdministrator"));
                   }
               }
           }
           
           Pattern pattern = namePattern != null ? new Pattern(namePattern) : new Pattern("*");
           String caseStatus = MqlUtil.mqlCommand(context, "print system  casesensitive");
           if(caseStatus.equals("CaseSensitive=Off")) {
                 pattern.setCaseSensitive(false);
           }
           for (int i = 0; i < roleList.size(); i++) {
               String sRole  = (String) roleList.get(i);
               String i18Role = i18nNow.getRoleI18NString(sRole, languageStr);
               if(!pattern.match(i18Role) || (orgSpecificRoles != null && orgSpecificRoles.contains(sRole))) {
                   continue;
               }
               resultsList.add(sRole);
           }
           
           if(orgSpecificRoles!=null && !orgSpecificRoles.isEmpty()){
               Iterator itr = orgSpecificRoles.iterator();
               while(itr.hasNext())
               {
            	   String sRole = (String)itr.next();
            	   String i18Role = i18nNow.getRoleI18NString(sRole, languageStr);
            	   if(pattern.match(i18Role)){
            		   resultsList.add(sRole);
            	   }
                }
             }
          
           resultsList.removeAll(getProjectAndOrganizationClassificationRoles(context));
           return (queryLimit > 0 && resultsList.size() > queryLimit) ?  resultsList.subList(0, queryLimit - 1) : resultsList;
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
   }
   
   protected RoleList getChildRoles(Context context, Role matrixRole) throws FrameworkException {
       try {
           RoleList roleList = new RoleList();
		   //After assigning a collection to an iterator, if you try to modify the collection in the same iteration
		   //we will get Concurrent modification exception and hence we are using tempRoleList
		   RoleList tempRoleList = new RoleList();
           matrixRole.open(context);

           if(matrixRole.hasChildren()) {
               roleList.addAll(matrixRole.getChildren());
			   tempRoleList.addAll(matrixRole.getChildren());
               RoleItr roleItr = new RoleItr(tempRoleList);
               while (roleItr.next())
               {
                  Role childRole = (Role)roleItr.obj();
                  roleList.addAll(getChildRoles(context, childRole));
               }
           }
           matrixRole.close(context);
           return roleList;
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
   }


   
   protected StringList getProjectAndOrganizationClassificationRoles(Context context) throws Exception
   {
       String strMQL = "list role * where 'isaproject || isanorg'";
       String strResult = MqlUtil.mqlCommand(context, strMQL, true);
       return FrameworkUtil.split(strResult, System.getProperty("line.separator"));
   }
   
   
   public String getRolesTypeHTML(Context context, String[] args) throws FrameworkException {
       try {

           StringBuffer sb = new StringBuffer();
           sb.append("<img border=0 src=../common/images/iconRole.gif></img>&nbsp;");
           sb.append(EnoviaResourceBundle.getProperty(context,"emxPersonOrgModelStringResource", 
                   context.getLocale(),"emxComponents.Common.Role"));
           return sb.toString();
                  
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
    }

   public String getRoleLevelsHTMLOutput(Context context, String[] args) throws FrameworkException {
       try {
           HashMap programMap = (HashMap) JPO.unpackArgs(args);
           HashMap paramMap = (HashMap) programMap.get("paramMap");
           String languageStr = (String) paramMap.get("languageStr");
           StringBuffer sb = new StringBuffer();
           i18nNow loc = new i18nNow();
           String topLevel = loc.GetString ("emxPersonOrgModelStringResource",languageStr,"emxComponents.SearchGroup.TopLevel");
           String subLevel = loc.GetString ("emxPersonOrgModelStringResource",languageStr,"emxComponents.SearchGroup.SubLevel");
           sb.append("<input type=checkbox name=chkTopLevel id=chkTopLevel/>"+XSSUtil.encodeForHTML(context,topLevel)+"<br>");
           sb.append("<input type=checkbox name=chkSubLevel id=chkSubLevel />"+XSSUtil.encodeForHTML(context,subLevel));
           
           return sb.toString();
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
    }
   
   @SuppressWarnings({ "rawtypes", "unchecked" })
    protected List getRoleNameList(Context context, RoleList rolesList) throws FrameworkException {
       try {
           List arrayList = new ArrayList(rolesList.size());
           RoleItr roleItr = new RoleItr(rolesList);
           while (roleItr.next()) {
               String sRole  = roleItr.obj().getName();
               if( RoleUtil.isOnlyRole(context, sRole))
               {
                   arrayList.add(sRole);
               }
           }
           return arrayList;
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
   }


   @SuppressWarnings({ "rawtypes", "unchecked" })
   protected List getRoleNameList(RoleList rolesList) throws FrameworkException {
       try {
           List arrayList = new ArrayList(rolesList.size());
           RoleItr roleItr = new RoleItr(rolesList);
           while (roleItr.next()) {
             String sRole  = roleItr.obj().getName();
             arrayList.add(sRole);
           }
           return arrayList;
       } catch (Exception e) {
           throw new FrameworkException(e);
       }
   }

   /*------------ESignature Migration Start---------------------*/
   
   public void migrateObjects(Context context, StringList objectList) throws Exception
	{
	  System.out.println("----------migrateObjects-----------------");

		boolean isRel = false;
		MapList mapList = null;
		String groupType = PropertyUtil.getSchemaProperty(context, "type_Group");
		String proxyGoupType = PropertyUtil.getSchemaProperty(context, "type_GroupProxy");
		//String personType = PropertyUtil.getSchemaProperty(context, "type_Person");
		StringList objectSelects = new StringList(7);
		objectSelects.addElement("id");
		objectSelects.addElement("name");
		objectSelects.addElement("revision");
		objectSelects.addElement("project");
		objectSelects.addElement("organization");

		String[] oidsArray = new String[objectList.size()];
		oidsArray = (String[]) objectList.toArray(oidsArray);
		if (objectList.size() > 0) {
			boolean isBusinessObject = "true".equalsIgnoreCase(
					MqlUtil.mqlCommand(context, "print bus $1 select exists dump", true, oidsArray[0]));
			if (isBusinessObject) {
				objectSelects.addElement(SELECT_OWNERSHIP_NAME);
				objectSelects.addElement(SELECT_OWNERSHIP_TYPE);
				objectSelects.addElement(SELECT_CONFIG_REL_ID);
				objectSelects.addElement("owner");
				objectSelects.addElement("current");
				mapList = DomainObject.getInfo(context, oidsArray, objectSelects);
			} else {
				isRel = true;
				mapList = DomainRelationship.getInfo(context, oidsArray, objectSelects);
			}
			try {
				ContextUtil.pushContext(context);

				Iterator itr = mapList.iterator();
				while (itr.hasNext()) {
					try {
						Map valueMap = (Map) itr.next();
						String strObjId = (String) valueMap.get("id");
						String strType = (String) valueMap.get("type");
						String strName = (String) valueMap.get("name");
						String strProject = (String) valueMap.get("project");
						String strOrg = (String) valueMap.get("organization");

						//System.out.println("Started Migrating  '" + strName + "' with Id " + strObjId + " Project:" + strProject + " and Organization:" + strOrg + "\n");

						if (isBusinessObject) {
							String strOwnershipName = (String) valueMap.get(SELECT_OWNERSHIP_NAME);
							String strOwnershipType = (String) valueMap.get(SELECT_OWNERSHIP_TYPE);
							String strConfigRelId = (String) valueMap.get(SELECT_CONFIG_REL_ID);
							String OwnerName = (String) valueMap.get("owner");
							//String CurrentState = (String) valueMap.get("current");
							//System.out.println("strOwnershipName--" + strOwnershipName);
							//System.out.println("strOwnershipType--" + strOwnershipType);
							//System.out.println("strConfigRelId--" + strConfigRelId);
							//System.out.println("OwnerName--" + OwnerName);
							//System.out.println("CurrentState--" + CurrentState);

							

							if (UIUtil.isNotNullAndNotEmpty(strOwnershipName)) {

								// disconnecting from UG and Person
								DomainRelationship.disconnect(context, strConfigRelId);
								
								if(groupType.equalsIgnoreCase(strOwnershipType) || proxyGoupType.equalsIgnoreCase(strOwnershipType)){
									DomainAccess.deleteObjectOwnership(context, strObjId, "",strOwnershipName,DomainAccess.COMMENT_MULTIPLE_OWNERSHIP,true);
								} else {
									DomainAccess.deleteObjectOwnership(context, strObjId, "", strOwnershipName+"_PRJ", DomainAccess.COMMENT_MULTIPLE_OWNERSHIP, true);
								}
								
								System.out.println("Successfully disconnected from Type : "+strOwnershipType +", Name : "+strOwnershipName );
								
							}
							if (UIUtil.isNotNullAndNotEmpty(strProject) || UIUtil.isNotNullAndNotEmpty(strOrg)) {
								// removing organization and project
								MqlUtil.mqlCommand(context, "mod bus $1 project $2 organization $3", strObjId, "", "");
								System.out.println(
										"Successfully migrated to remove Proj and Org stamping on Object : " + strName + ":" + strObjId);
							} else {
								checkAndWriteUnconvertedOID(strName + ":" + strObjId + "  prj and org is already empty\n", strObjId);
							}
						} else {
							if (UIUtil.isNotNullAndNotEmpty(strProject) || UIUtil.isNotNullAndNotEmpty(strOrg)) {
								MqlUtil.mqlCommand(context, "mod connection $1 project $2 organization $3", strObjId,
										"", "");
								System.out.println(
										"Successfully migrated to remove Proj and Org stamping on Relationship : " + strName + ":" + strObjId);
							} else {
								checkAndWriteUnconvertedOID(strName + ":" + strObjId + "  prj and org is already empty\n", strObjId);
							}
						}
						checkAndloadMigratedOids(strObjId);

					} catch (Exception ex) {
						System.out.println("Migration failed due to "+ex);
					}
				}

			} catch (Exception ex) {
			} finally {
				ContextUtil.popContext(context);
			}
		}
	}


	public void exportESignData(Context context, String[] args) throws Exception {
		System.out.println("----------Export-------------");
		String docDir = args[0];
		
		if (docDir != null && !docDir.endsWith(fileSeparator)) {
			docDir = docDir + fileSeparator;
		}
		String file = docDir + "eSign_Export.xml";
		MQLCommand mqlcommand = new MQLCommand();
		String companyName = PropertyUtil.getSchemaProperty(context, "role_CompanyName");// com.matrixone.apps.common.Company.getHostCompany(context);
		String personType = PropertyUtil.getSchemaProperty(context, "type_Person");
		String Result 	= "";
		String error 	= "";
		String cmd 		= "";
		String personCS = "";
		String personSC = "";

		try {

			ArrayList ownerResultList = null;

			String ownerQuery = "temp query bus $1 $2 $3 select $4 dump $5";
			String ownerResult = MqlUtil.mqlCommand(context, ownerQuery, "ESign*", "*", "*", "owner", "|");
			String[] persons = ownerResult.split("\n");
			if (persons != null && UIUtil.isNotNullAndNotEmpty(persons[0])) {
				ownerResultList = new ArrayList();
			}
			for (String person : persons) {
				if (UIUtil.isNotNullAndNotEmpty(person)) {
					String[] eSignParts = person.split("\\|");
					if (!"creator".equalsIgnoreCase(eSignParts[3])) {
						ownerResultList.add(eSignParts[3]);
					}
				}
			}
			ArrayList<String> finalOwnerList = (ArrayList) ownerResultList.stream().distinct()
					.collect(Collectors.toList());
			System.out.println("List of Person to be exported=" + finalOwnerList.toString());

			// export role user_PRJ
			for (String ownerName1 : finalOwnerList) {
				personCS = ownerName1 + "_PRJ";
				cmd = String.format("export role \"%s\" onto file %s", personCS, file);
				System.out.println("-----------cmd1=" + cmd);
				mqlcommand.exec(context, cmd);
			}

			// export role Grant.Host Company.user_PRJ
			for (String ownerName2 : finalOwnerList) {
				personCS = ownerName2 + "_PRJ";
				personSC = "Grant." + companyName + "." + personCS;
				cmd = String.format("export role \"%s\" onto file %s", personSC, file);
				System.out.println("-----------cmd2=" + cmd);
				mqlcommand.exec(context, cmd);
			}

			// export person user
			for (String ownerName3 : finalOwnerList) {
				cmd = String.format("export person \"%s\" onto file %s", ownerName3, file);
				System.out.println("-----------cmd3=" + cmd);
				mqlcommand.exec(context, cmd);
			}

			// export bus Person user -
			for (String ownerName4 : finalOwnerList) {
				cmd = String.format("export bus \"%s\" \"%s\" %s !relationship xml onto file %s", personType,
						ownerName4, "-", file);
				System.out.println("-----------cmd4=" + cmd);
				mqlcommand.exec(context, cmd);
			}

			// export ESIGN bus objects
			String type = "ESign*";
			String star = "*";
			cmd = String.format("export bus \"%s\" \"%s\" %s xml onto file %s", type, star, star, file);
			System.out.println("-----------cmd5=" + cmd);
			mqlcommand.exec(context, cmd);

			
			System.out.println("=================================================================\n");
			System.out.println("Export SUCCESSFUL \n");
			System.out.println("=================================================================\n");

		} catch (Exception ex) {
			System.out.println("=================================================================\n");
			System.out.println("Export FAILED \n");
			System.out.println("=================================================================\n");
			ex.printStackTrace();
		}

	}
		
	
	public void importESignData(Context context, String[] args) throws Exception {
		//System.out.println("=================================================================\n");
		System.out.println("----------------Import Started \n");
		//System.out.println("=================================================================\n");
		// String companyName =
		// com.matrixone.apps.common.Company.getHostCompany(context);//use this for
		// connecting to Person with Employee relationship
		String documentDirectory = args[0];// the directory passed should already be created..
		String Result = "";
		String error = "";
		String cmd = "";
		String star = "*";
		MQLCommand mqlcommand = new MQLCommand();
		try {
			if (args.length < 1) {
				throw new IllegalArgumentException();
			}
		} catch (IllegalArgumentException iExp) {
			System.out.println("=================================================================\n");
			System.out.println("Directory path not passed as argument\n");
			System.out.println("Import FAILED \n");
			System.out.println("=================================================================\n");
		}
		try {
			// if documentDirectory does not ends with "/" add it
			//String fileSeparator = java.io.File.separator;
			if (documentDirectory != null && !documentDirectory.endsWith(fileSeparator)) {
				documentDirectory = documentDirectory + fileSeparator;
			}

			String file = documentDirectory + "eSign_Export.xml";
			String logfile = documentDirectory + "eSignRole_Import.log";
			String excepfile = documentDirectory + "eSignRole_Exception.log";
			

			cmd = String.format("import role \"%s\" overwrite from file %s use log %s exception %s", star, file,
					logfile, excepfile);
			long startTime = System.currentTimeMillis();
			System.out.println("-----------Importcmd1=" + cmd);
			mqlcommand.exec(context, cmd);
			long stopTime = System.currentTimeMillis();
			long elapsedTime = stopTime - startTime;
			System.out.println("Time taken for role import="+elapsedTime);
			
			logfile = documentDirectory + "eSignPerson_Import.log";
			excepfile = documentDirectory + "eSignPerson_Exception.log";
			cmd = String.format("import person \"%s\" overwrite from file %s use log %s exception %s", star, file,
					logfile, excepfile);
			startTime = System.currentTimeMillis();
			System.out.println("-----------Importcmd2=" + cmd);
			mqlcommand.exec(context, cmd);
			stopTime = System.currentTimeMillis();
			elapsedTime = stopTime - startTime;
			System.out.println("Time taken for person import="+elapsedTime);
			

			logfile = documentDirectory + "eSignBus_Import.log";
			excepfile = documentDirectory + "eSignBus_Exception.log";
			cmd = String.format("import bus \"%s\" \"%s\" %s  from file %s use log %s exception %s", star, star, star,
					file, logfile, excepfile);
			startTime = System.currentTimeMillis();
			System.out.println("-----------Importcmd3=" + cmd);
			mqlcommand.exec(context, cmd);
			Result = mqlcommand.getResult();
			error = mqlcommand.getError();
			stopTime = System.currentTimeMillis();
			elapsedTime = stopTime - startTime;
			System.out.println("Time taken for all bus import="+elapsedTime);

			// connecting each person to host Company via Employee relationship
			System.out.println(
					"-----------Connecting to host Company with Employee Relationship Start------------");
			ArrayList ownerResultList = null;

			String ownerQuery = "temp query bus $1 $2 $3 select $4 dump $5";
			startTime = System.currentTimeMillis();
			String ownerResult = MqlUtil.mqlCommand(context, ownerQuery, "ESign*", "*", "*", "owner", "|");
			String[] persons = ownerResult.split("\n");
			if (persons != null && UIUtil.isNotNullAndNotEmpty(persons[0])) {
				ownerResultList = new ArrayList();
			}
			for (String person : persons) {
				if (UIUtil.isNotNullAndNotEmpty(person)) {
					String[] eSignParts = person.split("\\|");
					if (!"creator".equalsIgnoreCase(eSignParts[3])) {
						ownerResultList.add(eSignParts[3]);
					}
				}
			}

			ArrayList<String> finalOwnerList = (ArrayList) ownerResultList.stream().distinct()
					.collect(Collectors.toList());
			System.out.println(
					"List of Person to be connected to Host comp via Employee Rel=" + finalOwnerList.toString());

			String hostCompId = Company.getHostCompany(context);
			System.out.println("hostCompId=" + hostCompId);
			String relExists="",personid="";
			for (String ownerName : finalOwnerList) {
				System.out.println("ownerName=" + ownerName);
				String personQuery = "temp query bus $1 $2 $3 select $4 $5 dump $6";
				String personQueryResult = MqlUtil.mqlCommand(context, personQuery, "Person", ownerName,"*","to[Employee]","id","|");
				if(UIUtil.isNotNullAndNotEmpty(personQueryResult)) {
					relExists = FrameworkUtil.split(personQueryResult, "|").get(3);
					personid = FrameworkUtil.split(personQueryResult, "|").get(4);
				}
				//System.out.println("1---------relExists=" + relExists);
				//System.out.println("1---------personid=" + personid);

				if (!"TRUE".equalsIgnoreCase(relExists)) {
					DomainRelationship.connect(context, hostCompId,
							DomainConstants.RELATIONSHIP_EMPLOYEE, personid,true);
					System.out.println("-----------Connecting person : " + ownerName + " with id :"+ personid +" to host company Obj : " + hostCompId);
				}
			}
			stopTime = System.currentTimeMillis();
			elapsedTime = stopTime - startTime;
			System.out.println("Time taken for connecting person to company="+elapsedTime);
			//System.out.println("=================================================================\n");
			System.out.println("-----------------------Import SUCCESFUL \n");
			//System.out.println("=================================================================\n");
			
		} catch (Exception ex) {
			System.out.println("=================================================================\n");
			System.out.println("Import FAILED \n");
			System.out.println("=================================================================\n");
			ex.printStackTrace();
			throw new Exception(ex);
		}

	}
 
	public void mqlLogRequiredInformationWriter(String command) throws Exception {
		super.mqlLogRequiredInformationWriter(command + "\n");
	}

	public void checkAndloadMigratedOids(String command) throws Exception {
		if (migratedOids.indexOf(command) <= -1) {
			super.loadMigratedOids(command + "\n");
		}

	}

	public void checkAndWriteUnconvertedOID(String command, String ObjectId) throws Exception {
		if (migratedOids.indexOf(ObjectId) <= -1) {
			super.writeUnconvertedOID(command, ObjectId);
		}

	}

}
