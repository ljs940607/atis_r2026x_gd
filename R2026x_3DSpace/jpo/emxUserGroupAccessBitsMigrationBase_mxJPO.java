import java.util.HashMap;
import java.util.Map;

import com.matrixone.apps.domain.DomainAccess;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class emxUserGroupAccessBitsMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{
    private static final long serialVersionUID = -5029177381386073045L;
    //private static StringList POLICY_LIST           = null;       
    public static String GROUP_PROXY_POLICY = "";
    static HashMap<String,String> userGroupAccessMap = new HashMap<String,String>();
    public emxUserGroupAccessBitsMigrationBase_mxJPO(Context context, String[] args) throws Exception {
      super(context, args);
    }

    public static void init(Context context) throws Exception
    {
    	setAccessMap(context); 
    	          
    }
    public static void setAccessMap(Context context) throws Exception {
		GROUP_PROXY_POLICY = PropertyUtil.getSchemaProperty(context, "policy_GroupProxy"); 
		//System.out.println("INSIDE SETACCESSMAP");
		String accessMaskBits = DomainAccess.getPhysicalAccessMasksForPolicy(context, GROUP_PROXY_POLICY, "Owner");
		accessMaskBits = UIUtil.isNotNullAndNotEmpty(accessMaskBits)?accessMaskBits.replace(" ,", ","):accessMaskBits;
		userGroupAccessMap.put("Owner", accessMaskBits);
		accessMaskBits = DomainAccess.getPhysicalAccessMasksForPolicy(context, GROUP_PROXY_POLICY, "Manager");
		accessMaskBits = UIUtil.isNotNullAndNotEmpty(accessMaskBits)?accessMaskBits.replace(" ,", ","):accessMaskBits;
		userGroupAccessMap.put("Manager", accessMaskBits);		
		accessMaskBits = DomainAccess.getPhysicalAccessMasksForPolicy(context, GROUP_PROXY_POLICY, "Viewer");
		accessMaskBits = UIUtil.isNotNullAndNotEmpty(accessMaskBits)?accessMaskBits.replace(" ,", ","):accessMaskBits;		
		userGroupAccessMap.put("Viewer",accessMaskBits);
		//System.out.println("userGroupAccessMap-"+userGroupAccessMap);
	}
    

    public void migrateObjects(Context context, StringList objectList) throws Exception
    {
        init(context);
        StringList objectSelects = new StringList();
        objectSelects.add("ownership.project");
        objectSelects.add("ownership.access");
        objectSelects.add("ownership.comment");     
        objectSelects.add(DomainConstants.SELECT_CURRENT);
        objectSelects.add(DomainConstants.SELECT_NAME);
        objectSelects.add(DomainConstants.SELECT_TYPE);
        objectSelects.add(DomainConstants.SELECT_REVISION);
        
    	String[] oidsArray = new String[objectList.size()];
    	oidsArray = (String[])objectList.toArray(oidsArray);    
		String cFieldSep = "|";
		GROUP_PROXY_POLICY = PropertyUtil.getSchemaProperty(context, "policy_GroupProxy");
		String strType = "Group";
		String strRevision = "-";
		String strName = "";
		String strOwner = "";
		String strPolicy = "";
		String strCurrent = "";
    	if(oidsArray!=null && oidsArray.length>0) {
    		for(String groupId : oidsArray) {
    			try{        				
    				String mqlOutput = MqlUtil.mqlCommand(context, "print bus $1 select $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 dump $13",groupId,"type","name","revision","owner","policy","current","ownership.businessobjectcount","ownership.organizationcount","ownership.project","ownership.access","ownership.comment",cFieldSep);
    				//System.out.println("mqlOutput--"+mqlOutput);
    				StringList tokens = FrameworkUtil.splitString(mqlOutput, String.valueOf(cFieldSep));
    				//System.out.println("size--"+tokens.size());
    				
    				strType = (String) tokens.remove(0);
    				strName = (String) tokens.remove(0);
    				strRevision = (String) tokens.remove(0);
    				strOwner = (String) tokens.remove(0);
    				strPolicy = (String) tokens.remove(0);
    				strCurrent = (String) tokens.remove(0);

    	            int ownershipBusObjCount = Integer.parseInt(tokens.remove(0));
    	            int ownershipProjOrgCount = Integer.parseInt(tokens.remove(0));
    	            
    	            // int rows = (tokens.size()+counter) / 5;
    	            int rows = ownershipBusObjCount + ownershipProjOrgCount;
    				//System.out.println("rows--"+rows);
    				
    	            StringList projects = new StringList(rows+1);
    	            StringList accesses = new StringList(rows+1);
    	            StringList comments = new StringList(rows+1);
    				
    				
    				projects.addAll(tokens.subList(0, rows));
    				accesses.addAll(tokens.subList(rows, rows*2));
    				comments.addAll(tokens.subList(rows*2, rows*3));
    				//System.out.println("projects--"+projects);
    				//System.out.println("accesses--"+accesses);
    				//System.out.println("comments--"+comments);
    				
    				for (int i=0; i < projects.size(); i++) {
    					String proj = (String) projects.get(i);
    					String accessMasks = (String) accesses.get(i);
    					String logicalAccessName="";
    					if (proj.endsWith("_PRJ")) {
    						for (Map.Entry<String, String> entry : userGroupAccessMap.entrySet()) {
    				            if (entry.getValue().equals(accessMasks)) {
    				            	logicalAccessName = entry.getKey();
    				                break;
    				            }
    				        }
    						mqlLogRequiredInformationWriter("groupId - "+groupId+" proj "+proj+" accessMasks "+accessMasks+"- logicalAccessName -"+logicalAccessName);        						
    						if("Manager".equalsIgnoreCase(logicalAccessName) || "Owner".equalsIgnoreCase(logicalAccessName) ) {
    							checkAndloadMigratedOids(groupId);
    							mqlLogRequiredInformationWriter("Already Updated for "+strType+" "+strName+" "+strRevision+" owner "
										+ strOwner + " policy "+ strPolicy + " current "+ strCurrent +" user group  with "+logicalAccessName+" Access for : " + groupId+"\n");
    						} else {
    							StringList currentAccessBits = FrameworkUtil.split(accessMasks, ",");
    							if(currentAccessBits.size()==2) {
    								updateAccess(context, groupId, proj, "Manager");
    								checkAndloadMigratedOids(groupId);
    								mqlLogRequiredInformationWriter("Successfully updated for "+strType+" "+strName+" "+strRevision+" owner "
    										+ strOwner + " policy "+ strPolicy + " current "+ strCurrent +" user group  with Manager Access for : " + groupId+"\n");
    							} else if(currentAccessBits.size()==4) {
    								updateAccess(context, groupId, proj, "Owner");		
    								checkAndloadMigratedOids(groupId);
    								mqlLogRequiredInformationWriter("Successfully updated for "+strType+" "+strName+" "+strRevision+" owner "
    										+ strOwner + " policy "+ strPolicy + " current "+ strCurrent +" user group  with Owner Access for : " + groupId+"\n");
    							} else {
    								checkAndloadMigratedOids(groupId);
    								mqlLogRequiredInformationWriter("Already updated for "+strType+" "+strName+" "+strRevision+" owner "
    										+ strOwner + " policy "+ strPolicy + " current "+ strCurrent +" user group with right Access for : " + groupId+"\n");
    							}
    						}
    					} 
    				}	
    			} catch (Exception ex) {
    				ex.printStackTrace();
    				checkAndWriteUnconvertedOID(strType+","+strName+","+strRevision+" Unsuccessfull migration ids",groupId);
		            mqlLogRequiredInformationWriter("Failed to update ownership "+groupId);
    			}
    		
    		}
    	} else {
    		mqlLogRequiredInformationWriter("No migration required as no groups in the file");
    	}
    	//Map accessSummaryMap	= getAccessSummaryList(context, oidsArray); 
    }
    public void updateAccess(Context context,String groupId, String proj,String Role) throws Exception {
   		String accessMaskBits = userGroupAccessMap.get(Role);
   		if(UIUtil.isNullOrEmpty(accessMaskBits)) {
   			accessMaskBits = DomainAccess.getPhysicalAccessMasksForPolicy(context, GROUP_PROXY_POLICY, Role);
   		}    				
    	DomainAccess.deleteObjectOwnership(context, groupId, null, proj, "Ownership For User Group",false);
		DomainAccess.createObjectOwnership(context, groupId, null, proj, accessMaskBits, "Ownership For User Group", true);
		mqlLogRequiredInformationWriter("groupId - "+groupId +" Successfully migrated for the proj "+proj+" as "+Role);
    }
    
	/*
	 * private Map getAccessSummaryList(Context context, String[] oidsArray) throws
	 * Exception { String ownershipKeyString = "(?is)\\[(.*?)\\]"; // getting the
	 * data between square brackets String ownershipMapKeyString = "\\.([^].]+)$";
	 * // getting the data after ]. Pattern ownershipKeyPattern =
	 * Pattern.compile(ownershipKeyString); //init block Pattern
	 * ownershipMapKeyPattern = Pattern.compile(ownershipMapKeyString); //init block
	 * // ]. StringList objectSelects = new StringList(); objectSelects.add("id");
	 * objectSelects.add("type"); objectSelects.add("name");
	 * objectSelects.add("revision"); objectSelects.add("owner");
	 * objectSelects.add("ownership.businessobject");
	 * objectSelects.add("ownership.organization");
	 * objectSelects.add("ownership.project");
	 * objectSelects.add("ownership.access");
	 * objectSelects.add("ownership.comment"); MapList mapList =
	 * DomainObject.getInfo(context, oidsArray, objectSelects);
	 * 
	 * Map accessSummaryMap = new HashMap(); for (int i = 0; i < mapList.size();
	 * i++) { Map<String, String> map = (Map) mapList.get(i); Map objectDetailsMap =
	 * new HashMap(); String policyName = map.get("policy"); //if
	 * (POLICY_LIST.contains(policyName)) { //change required
	 * objectDetailsMap.put("objectId", map.get("id")); objectDetailsMap.put("type",
	 * map.get("type")); objectDetailsMap.put("name", map.get("name"));
	 * objectDetailsMap.put("revision", map.get("revision"));
	 * objectDetailsMap.put("policy", map.get("policy"));
	 * objectDetailsMap.put("ATTRIBUTE_DEFAULT_USER_ACCESS",
	 * map.get("attribute["+ATTRIBUTE_DEFAULT_USER_ACCESS+"].value")); Map
	 * ownershipDetailsMap = new HashMap(); for (Map.Entry<String, String> entry :
	 * map.entrySet()) { String key = entry.getKey(); String value =
	 * entry.getValue(); if ("id".equals(key.toString()) ||
	 * "type".equals(key.toString()) || "name".equals(key.toString()) ||
	 * "revision".equals(key.toString()) || "policy".equals(key.toString()) ||
	 * "attribute[Default User Access].value".equals(key.toString())) { continue; }
	 * else { Matcher ownershipKeyMatcher = ownershipKeyPattern.matcher(key);
	 * Matcher ownershipMapKeyMatcher = ownershipMapKeyPattern.matcher(key); String
	 * ownershipKey = ""; String ownershipMapKey = "";
	 * if(ownershipKeyMatcher.find()){ ownershipKey = ownershipKeyMatcher.group(1);
	 * } if(ownershipMapKeyMatcher.find()){ ownershipMapKey =
	 * ownershipMapKeyMatcher.group(1); } if
	 * (ownershipDetailsMap.containsKey(ownershipKey)) { Map accessDetails = (Map)
	 * ownershipDetailsMap.get(ownershipKey); accessDetails.put(ownershipMapKey,
	 * value); ownershipDetailsMap.put(ownershipKey, accessDetails); } else { Map
	 * accessDetails = new HashMap(); String accessDetailMapKey = ownershipMapKey;
	 * accessDetails.put(accessDetailMapKey, value);
	 * ownershipDetailsMap.put(ownershipKey, accessDetails); } } }
	 * objectDetailsMap.put("ownership", ownershipDetailsMap);
	 * accessSummaryMap.put(map.get("id"), objectDetailsMap); //}
	 * 
	 * } return accessSummaryMap; }
	 */
    public void loadMigratedOids (String objectId) throws Exception
    {
        		  String newLine = System.getProperty("line.separator");
		          migratedOids.append(objectId + newLine);
    }
        
    public void mqlLogRequiredInformationWriter(String command) throws Exception
    {
        super.mqlLogRequiredInformationWriter(command +"\n");
    }
    
    
    public void checkAndloadMigratedOids(String command) throws Exception
    {
    	//System.out.println("checkAndloadMigratedOids-"+migratedOids);
     if(migratedOids.indexOf(command)<= -1){
        super.loadMigratedOids(command +"\n");
     }
        
    }
    public void checkAndWriteUnconvertedOID(String command, String ObjectId) throws Exception
    {
    	//System.out.println("checkAndWriteUnconvertedOID-"+migratedOids);
     if(migratedOids.indexOf(ObjectId)<= -1){
        super.writeUnconvertedOID(command, ObjectId);
     }
        
    }
    
    
    
    
    
}
