import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.io.FileWriter;

import matrix.db.Access;
import matrix.db.Context;
import matrix.util.IntList;
import matrix.util.StringList;

import com.matrixone.apps.domain.DomainAccess;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.StringUtil;
import com.matrixone.apps.framework.ui.UIUtil;

public class emxWorkspaceMdlRemoveGrantMigration_mxJPO extends emxCommonMigration_mxJPO
{
    public emxWorkspaceMdlRemoveGrantMigration_mxJPO(Context context, String[] args) throws Exception {
      super(context, args);
    }
	
    private static final StringList mulValSelects = new StringList();
    public static StringList mxObjectSelects = new StringList();
    public static String TYPE_WORKSPACE = "";
    public static String TYPE_WORKSPACE_VAULT = "";
    public static String TYPE_WORKSPACE_TEMPLATE = "";
    public static String SELECT_ATTRIBUTE_ACCESS_TYPE = "";
    public static boolean unconvertable = false;
    public static String unConvertableComments = "";
	
	public String strType = "";
	public String strName = "";
	public String strRevision = "";
    public StringList granteeAccess = null;
	public StringList ownership = null;
	public String strOid = "";
    public static String contentId = "";
    public static String contentIdRev2 = "";
	private boolean nonWorkspaceGrant = false;
	private boolean hasWAG = false;
	private boolean hasWLG = false;
	private boolean hasWMG = false;
	
	final String removeGrantCmd = "mod bus $1 revoke all";
	
	private boolean logTimings = false;
	private static StringList relSelect = new StringList("to.id");
	private Map granteeAccessMap = new HashMap<>();
	private static FileWriter grantLog = null;
	private static boolean migrateContentSeparately = false;

    public static StringList mxContentSelects = new StringList();
	
    public static void init(Context context) throws Exception
    {
        TYPE_WORKSPACE = PropertyUtil.getSchemaProperty(context, "type_Project");
        TYPE_WORKSPACE_VAULT =  PropertyUtil.getSchemaProperty(context, "type_ProjectVault");
        TYPE_WORKSPACE_TEMPLATE =  PropertyUtil.getSchemaProperty(context, "type_WorkspaceTemplate");
		SELECT_ATTRIBUTE_ACCESS_TYPE = "attribute[" + PropertyUtil.getSchemaProperty(context, "attribute_AccessType") + "]";
        // Issue with relationship_VaultedDocuments and relationship_VaultedDocumentsRev2 mapping to the same rel name
		String RELATIONSHIP_VAULTED_OBJECTS_REV2 = "Vaulted Documents Rev2";

        contentId = "from[" + RELATIONSHIP_VAULTED_OBJECTS + "].to.id";
        contentIdRev2 = "from[" + RELATIONSHIP_VAULTED_OBJECTS_REV2 + "].to.id";

        mxObjectSelects.addElement("id");
        mxObjectSelects.addElement("type");
        mxObjectSelects.addElement("name");
        mxObjectSelects.addElement("revision");
        mxObjectSelects.addElement("grant.granteeaccess");
        mxObjectSelects.addElement("ownership");
		mxObjectSelects.addElement(contentId);
		mxObjectSelects.addElement(contentIdRev2);
		mxObjectSelects.addElement(SELECT_ATTRIBUTE_ACCESS_TYPE);
		mulValSelects.addElement("grant.granteeaccess");
		mulValSelects.addElement("ownership");
		mulValSelects.addElement(contentId);
		mulValSelects.addElement(contentIdRev2);
			  
        grantLog   = new FileWriter(documentDirectory + "grantsRemoved.log", true);
		
		//To Resolve DB locks with parallel processing: Content is migrated separately
		//This list is used to migrate Content after Bookmark Migration
		String command = "get env MIGRATE_TEAM_OBJECTS_CONTENT_SEPARATELY";

		String result = MqlUtil.mqlCommand(context, command, true);
		if (result != null && "TRUE".equalsIgnoreCase(result))
		{
			migrateContentSeparately = true;
		}
    }
    
    public void migrateObjects(Context context, StringList objectList) throws Exception
    {
    	mqlLogWriter("In emxWorkspaceMdlRemoveGrantMigration 'migrateObjects' method "+"\n");
    	long first = System.currentTimeMillis();
        init(context);
		if (migrateContentSeparately)
			mqlLogRequiredInformationWriter("MIGRATE_TEAM_OBJECTS_CONTENT_SEPARATELY is " + migrateContentSeparately +"\n");

        String[] oidsArray = (String[])objectList.toArray(new String[objectList.size()]);
        MapList mapList = DomainObject.getInfo(context, oidsArray, mxObjectSelects, mulValSelects);
        mqlLogTimings("query search time "+(System.currentTimeMillis() - first));
        mqlLogWriter("=================================================================================================================================" + "\n");
   	
        Iterator<?> itr = mapList.iterator();
    	Map<?, ?> m ;
    	String type="",oid="";
        while(itr.hasNext())
        {
			long first1 = System.currentTimeMillis();
            unconvertable = false;
            unConvertableComments = "";
            m = (Map<?, ?>)itr.next();
			strType = (String)m.get("type");
			strName = (String)m.get("name");
			strRevision = (String)m.get("revision");
            strOid = (String)m.get("id");
            StringBuffer msgBuffer = new StringBuffer("Started Migrating Object Type '").append(strType).append("'  Name '").append(strName).append("' with Object Id ").append(strOid);
            mqlLogWriter(msgBuffer.toString());
            
            if(strType.equals(TYPE_WORKSPACE) || strType.equals(TYPE_WORKSPACE_VAULT) || strType.equals(TYPE_WORKSPACE_TEMPLATE) )
            {
            	removeGrants(context, m);
            } 
			else if (migrateContentSeparately )
			{
				removeGrants(context, m);
			} 
			else 
			{
	            mqlLogWriter((new StringBuffer("Un-Excepected type ").append(strType).append(" found during Workspace Mdl Remove grants migration .... \n")).toString());
	            unconvertable = true;
	            unConvertableComments += "Un-Excepected type " + strType + " found during Workspace Mdl Remove grants migration ....  \n";
            }
            if( unconvertable )
            {
                writeUnconvertedOID(unConvertableComments, strOid);
            } else {
                loadMigratedOids(strOid);
            }
            mqlLogWriter("-------------------------------------------" + "\n");
            mqlLogWriter(m.toString() +"\n");
            mqlLogWriter("#################################################################################################################################" + "\n");
			mqlLogTimings("completed object " + strOid + " Time "+(System.currentTimeMillis() - first1));
    	}
        mqlLogTimings("migrateObjects size = " + objectList.size() + " Time: "+(System.currentTimeMillis() - first));
		
		grantLog.close();

    }
    
    private void removeGrants(Context context, Map<?, ?> m) throws Exception
    {
    	mqlLogWriter("In removeGrants ");
    	long first = System.currentTimeMillis();
		boolean allowRemoveGrants = allowRemoveGrants(context, m );
		if (!allowRemoveGrants)
			return;
		
    	mqlLogWriter("Start remove grants for = "+ strOid);
		//save grant info incase of need for recovery
        writeGrantsRemovedLog(strOid + "|" + granteeAccessMap);
		MqlUtil.mqlCommand(context, removeGrantCmd, strOid);

		//for Workspace Vault - handle content (Root did not allow content)
		if (strType.equals(TYPE_WORKSPACE_VAULT) && !migrateContentSeparately)
		{
			removeGrantsContent(context, m);
		}
        mqlLogWriter("Successfully removed grants for = "+ strOid);

        mqlLogTimings("Success removeGrants Time "+(System.currentTimeMillis() - first));
    }  

	private boolean allowRemoveGrants(Context context, Map<?, ?> m) throws Exception
	{
		boolean bAllowRemove = true;
		//granteeAccess = (StringList)m.get("grant.granteeaccess");
		// due to key substitution, cannot get key as 'grant.granteeaccess' need to walk through keyset
        String key="";
        int startBindex = 0;
        int closeBindex = 0;
        String gratorGrantee="";
        String grantee="";
        String grantor="";
        String keyValue="";
		granteeAccessMap.clear();
		resetWGFlags();

		String sType = (String)m.get("type");
		String sName = (String)m.get("name");
		String sRevision = (String)m.get("revision");
		
		Set keySet = m.keySet();
        Iterator keyItr = keySet.iterator();
        while(keyItr.hasNext())
        {
            key = (String)keyItr.next();
            if( key.indexOf("grant[") >= 0)
            {
                startBindex = key.indexOf("[", key.indexOf("grant"));
                closeBindex = key.indexOf("]", key.indexOf("grant"));
                gratorGrantee = key.substring(startBindex+1, closeBindex);
                if( gratorGrantee.indexOf(",") > 0)
                {
                    grantor = gratorGrantee.substring(0, gratorGrantee.indexOf(","));
					if (!grantor.contains("Workspace"))
						nonWorkspaceGrant = true;
					else if ("Workspace Access Grantor".equals(grantor))
						hasWAG = true;
					else if ("Workspace Lead Grantor".equals(grantor))
						hasWLG = true;
					else if ("Workspace Member Grantor".equals(grantor))
						hasWMG = true;
						
                    //grantee = gratorGrantee.substring(gratorGrantee.indexOf(",")+1, gratorGrantee.length());
                    keyValue = (String)m.get(key);
					granteeAccessMap.put(gratorGrantee,keyValue);
				}
			} 
		}
    	mqlLogWriter("nonWorkspaceGrant=" + nonWorkspaceGrant + " hasWAG=" + hasWAG + " hasWLG=" + hasWLG + " hasWMG=" + hasWMG);
	
		if (granteeAccessMap.size() <= 0)
		{
    		mqlLogWriter(sType + "," + sName + "," + sRevision + ",No grants to remove. OK.");
    		unconvertable = true;
    		unConvertableComments += sType + "," + sName + "," + sRevision + ",No grants to remove. OK.\n";
    		bAllowRemove = false;	
			return bAllowRemove;
		}

    	ownership = (StringList)m.get("ownership");
   	
		if (ownership == null || ownership.size() <= 0 || "".equals(ownership.get(0)))
		{
			if (sType.equals(TYPE_WORKSPACE) || sType.equals(TYPE_WORKSPACE_VAULT) || sType.equals(TYPE_WORKSPACE_TEMPLATE))
			{
				mqlLogWriter(sType + "," + sName + ","+ sRevision + ",No ownership - grants not removed. Must run emxSecurityMigrationMigrateTeamObjects first.");
				unconvertable = true;
				unConvertableComments += sType + "," + sName + ","+ sRevision + ",No ownership present - grants not removed. Must run emxSecurityMigrationMigrateTeamObjects first.\n";
				bAllowRemove = false;
			} else //must be content
			{
				if (nonWorkspaceGrant)
				{
					mqlLogWriter(sType + "," + sName + ","+ sRevision + ",Content contains grants other than those added from Workspace. Grants not removed-needs manual removal.");
					unconvertable = true;
					unConvertableComments += sType + "," + sName + ","+ sRevision + ",Content contains grants other than those added from Workspace. Grants not removed-needs manual removal.\n";
					bAllowRemove = false;	
				}
			}				
    		return bAllowRemove;			
		}
		return bAllowRemove;
	}
    	
    private void removeGrantsContent(Context context, Map<?, ?> m) throws Exception
	{
		StringList contentIds = (StringList)m.get(contentId);
		StringList contentIdsRev2 = (StringList)m.get(contentIdRev2);
		StringList contentList = new StringList();
		String strContentId = "";
		if(null != contentIds )
		{
		  contentList.addAll(contentIds);
		}
		if(null != contentIdsRev2 )
		{
		  contentList.addAll(contentIdsRev2);
		}
		if( contentList != null && contentList.size() > 0 )
		{
			String[] oidsArray = new String[contentList.size()];
			oidsArray = (String[])contentList.toArray(oidsArray);
			long firstq = System.currentTimeMillis();
			
			MapList mapList = DomainObject.getInfo(context, oidsArray, mxObjectSelects, mulValSelects);
			
			mqlLogTimings("query content time "+(System.currentTimeMillis() - firstq));
			mqlLogWriter("Content MapList = "+ mapList);
			Iterator<?> itr = mapList.iterator();
			Map cMap =null;
			String type ="";
			while(itr.hasNext())
			{
				cMap = (Map)itr.next();
				strContentId = (String)cMap.get("id");
				
				boolean allowRemoveGrants = allowRemoveGrants(context, cMap );
				if (!allowRemoveGrants)
					continue;

				mqlLogWriter("Content start remove grants for = "+ strContentId);
				//save grant info incase of need for recovery
				writeGrantsRemovedLog(strContentId + "|" + granteeAccessMap);
				MqlUtil.mqlCommand(context, removeGrantCmd, strContentId);
			}
			mqlLogTimings("Complete content including query time "+(System.currentTimeMillis() - firstq));
		}
	}
	
    public void mqlLogRequiredInformationWriter(String command) throws Exception
    {
        super.mqlLogRequiredInformationWriter(command +"\n");
    }
    public void mqlLogWriter(String command) throws Exception
    {
        super.mqlLogWriter(command +"\n");
    }
    public void mqlLogTimings(String command) throws Exception
    {
		if (logTimings)
			super.mqlLogRequiredInformationWriter(command +"\n");
    }
	
    /**
     * Over written methods from emxCommonMigrationBase to handle 'Vaulted Documents Rev2' content ids
	 * Used when MigrateContentSeparately for perfomrance improvements
	 * This method writes the objectId to the sequential file, called from within JPO query where clause
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args[]  - [0]ObjectId, [1]type
     * @returns boolean
     * @throws Exception if the operation fails
     */
    public boolean writeOID(Context context, String[] args) throws Exception
    {
    	String writeIdStr = getObjectId(context, args); 
    	if ( writeIdStr != null && !"".equals(writeIdStr) )
        {
        	fileWriter(writeIdStr);
        }
        return false;
    }
	
    public String getObjectId(Context context, String[] args) throws Exception
    {
		//From the relId get the to.id
		MapList relML = DomainRelationship.getInfo(context, new String[]{ args[0]}, relSelect);
        if ( relML != null &&! relML.isEmpty() )
        {
        	return (String)((Map)relML.get(0)).get("to.id");
        } else {
        	return null;
        }
    }
 
    private void resetWGFlags()
	{
		nonWorkspaceGrant = false;
		hasWAG = false;
		hasWLG = false;
		hasWMG = false;
	}
	
     /**
     * Writes informational log of all grants which have been removed 
     * File is only created to allow for rollback plan if there is an issue with removal.
     *
     * @param command specifies the value to write to the file  
     * @return nothing 
     * @throws Exception if the operation fails
     */
    private void writeGrantsRemovedLog(String command) throws Exception
    {
		grantLog.write(command + "\n");
		grantLog.flush();
    }
}
