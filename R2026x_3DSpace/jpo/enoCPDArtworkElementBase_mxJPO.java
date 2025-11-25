/*
**  enoCPDArtworkElementBase
**
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import matrix.db.BusinessObject;
import matrix.db.Context;
import matrix.db.Policy;
import matrix.db.RelationshipType;
import matrix.db.StateRequirement;
import matrix.db.StateRequirementList;
import matrix.util.MatrixException;
import matrix.util.StringList;
import matrix.util.StringResource;

import com.matrixone.apps.cpd.util.CPDPropertyUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIRTEUtil;
import com.matrixone.apps.framework.ui.UIUtil;


/**
 * The <code>${CLASS:enoCPDArtworkElementBase}</code> class contains implementation code Artwork Functionality.
 */
@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods","serial"})
public class enoCPDArtworkElementBase_mxJPO
{   
	private static final  String RANGE_YES 								  = "Yes";
	private static final  String RANGE_NO 							 	  = "No";
    private static final  String State 	                                  = "State";
    private static final String SELECT_LAST_CURRENT = "last.current";
	private static final String CPD_STRING_RESOURCE = "emxCPDStringResource";	
	private static final String REL_ArtworkElementContent = "relationship_ArtworkElementContent";
	private static final String TO_OPEN_BRACE = "to[";
	private static final String ATR_IS_BASE_COPY = "attribute_IsBaseCopy";
	
    public enoCPDArtworkElementBase_mxJPO( Context ctx , String[] args )
    {
    	super();
    }
    
    private boolean isStructureElementRoot(Context context, String id, boolean isMasterID) throws FrameworkException {
    	try {
    		String interfaceName = isMasterID ?  "interface_StructuredMasterElement" : "interface_StructuredElement";
			String selISSE = "interface["  +  PropertyUtil.getSchemaProperty(context, interfaceName) + "]"; 
    		return "true".equalsIgnoreCase(new DomainObject(id).getInfo(context, selISSE));
    	} catch (Exception e) {
    		throw new FrameworkException(e);
    	}
    }
    
    
    

    /**
     * This method will check the Copy Text attribute is null/empty or not. This trigger will fail if the attribute is null/empty
     * 
     * @param context
     * @param args
     * @return
     * @throws FrameworkException
     */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int checkCopyTextValue(Context context, String[] args) throws FrameworkException
	{
		if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();
		try {
			String copyContentId 		= args[0];
			DomainObject copyContentObj = DomainObject.newInstance(context, copyContentId);
			String selISSE = "interface[" + PropertyUtil.getSchemaProperty(context, "interface_StructuredElement") + "]";
			
			boolean isSER = "true".equalsIgnoreCase(copyContentObj.getInfo(context, selISSE));
			if(isSER) {
				StringBuilder REL_PATTERN = new StringBuilder(100);
				REL_PATTERN.append(PropertyUtil.getSchemaProperty(context,"relationship_StructuredArtworkElement"))
							.append(",")
							.append(PropertyUtil.getSchemaProperty(context,"relationship_StructuredArtworkElementProxy"));
				String SEL_COPY_TEXT = new StringBuilder(50).append("attribute[").append(PropertyUtil.getSchemaProperty(context,"attribute_CopyText")).append("]").toString();
				
				MapList result = copyContentObj.getRelatedObjects(context, REL_PATTERN.toString(),"*",StringList.create(SEL_COPY_TEXT), null, false, true, (short)1,null,null,0);
				//Check for hierarchy
				if(result.isEmpty()){
					String copy_Text_Error	= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.Message.NoStructure");
					emxContextUtilBase_mxJPO.mqlError(context, copy_Text_Error);
					return 1;
				}
				
				//Check for empty copy text
				for(Map currentElemnt : (List<Map>) result) {
					if(UIUtil.isNullOrEmpty((String)currentElemnt.get(SEL_COPY_TEXT))) {
						String copy_Text_Error	= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.Message.StructureElementCopyText");
						emxContextUtilBase_mxJPO.mqlError(context, copy_Text_Error);
						return 1;
					}
				}
			}
			
			if(isKindOfCopyElement(context, copyContentId) && !isSER) {
				String strCopyText 		= copyContentObj.getInfo(context, DomainObject.getAttributeSelect(PropertyUtil.getSchemaProperty(context,"attribute_CopyText")));	
				if(UIUtil.isNullOrEmpty(strCopyText)){
                    String copy_Text_Error	= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.Message.CopyText");
					emxContextUtilBase_mxJPO.mqlError(context, copy_Text_Error);
					return 1;
				}
			}
			
			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
		return 0;
	}
	
    
    /**
	* Checks whether LocalCopy(Artwork Element) state is lower than than the 'Master Artwork Element' state.   
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.

	*/
	@SuppressWarnings({ "unchecked" })
	public int checkStateWithArtworkMasterState(Context context,String[] args)throws Exception
	{
   		if(args.length == 0)
   			throw new IllegalArgumentException();   		
		String artworkElementId 		= args[0];
		String artworkElementState 		= args[1];
		DomainObject ae 				= DomainObject.newInstance(context, artworkElementId);	
	    
		if(isBaseCopy(context,ae))
			return 0;
	    
    	DomainObject masterArtworkElement 	= new DomainObject(getArtworkMaster(context, ae));
    	String masterArtworkElementState 	= masterArtworkElement.getInfo(context, DomainObject.SELECT_CURRENT);
    	List<String> stateList 				= getStates(context, "policy_ArtworkElement");
    	int artworkElementIndex    			= stateList.indexOf(artworkElementState);
		int masterArtworkElementIndex 		= stateList.indexOf(masterArtworkElementState);
		
		if(artworkElementIndex > masterArtworkElementIndex)
		{
			String error	= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.CheckMasterArtworkElementState.Alert"); 
    	    emxContextUtilBase_mxJPO.mqlNotice(context , error);
    	    return 1;
		}
	    return 0;
	}
	
	/**	
	 * Promotes the 'Master Artwork Element' if the base copy(Artwork Element) is promoted.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero

	 */
	public void promoteMasterArtworkElement(Context context,String[] args) throws Exception
	{
		if(args.length == 0)
			throw new IllegalArgumentException();

		String artworkElementId 		= args[0];
		DomainObject artworkElement 	= DomainObject.newInstance(context, artworkElementId);
		if(isBaseCopy(context, artworkElement))
		{
			DomainObject artworkMaster 	= new DomainObject(getArtworkMaster(context, artworkElement));
			try {
			artworkMaster.promote(context);
			} catch (Exception e) {
				throw new FrameworkException(e);
			}
		}
	}
	
	/**	
	* Demote's the 'Master Artwork Element' if the base copy(Artwork Element) is demoted.
	* 
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero

	*/
	public void demoteMasterArtworkElement(Context context,String[] args) throws Exception
	{
		if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();

		String artworkElementId 		= args[0];
		DomainObject artworkElement 	= DomainObject.newInstance(context, artworkElementId);
		if(!isBaseCopy(context, artworkElement))
			return;

		DomainObject artworkMaster 		= new DomainObject(getArtworkMaster(context, artworkElement));
		try {
		artworkMaster.demote(context);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
 			
	}
	
	/** 
	 * This method is use as trigger method.
	 * Purpose: when you promote any Master Copy Element Object then this method will write the user details on history
	 * of that object
	 * 
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void modifyHistoryWithContextUserOnPromote(Context context,String[] args) throws Exception
	{
		String elementId    = args[0];
		DomainObject dObj	= DomainObject.newInstance(context, elementId);
		String currentState = dObj.getInfo(context, DomainObject.SELECT_CURRENT);
		String currentUser  = context.getUser();
		if("User Agent".equals(currentUser)) {
			currentUser 	= PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			if(UIUtil.isNullOrEmpty(currentUser)) {
				return;
			}
		}
		String mqlCommand 	= "modify bus $1 add history 'Promote' comment $2";
		MqlUtil.mqlCommand(context, mqlCommand, true, elementId, "Promoted to " + currentState + " state by " + currentUser);
	}
	
	/**
	 * This method is use as trigger method.
	 * Purpose: when you demote any Master Copy Element Object then this method will write the user details on history
	 * of that object
	 * 
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void modifyHistoryWithContextUserOnDemote(Context context,String []args) throws Exception
	{
		String elementId    = args[0];
		DomainObject dObj	= DomainObject.newInstance(context, elementId);
		String currentState = dObj.getInfo(context, DomainObject.SELECT_CURRENT);
		String currentUser  = context.getUser();
		if("User Agent".equals(currentUser)) {
			currentUser 	= PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			if(UIUtil.isNullOrEmpty(currentUser)) {
				return;
			}
		}
		String mqlCommand 	= "modify bus $1 add history 'Demote' comment $2";
		MqlUtil.mqlCommand(context, mqlCommand, true, elementId, "Demoted to " + currentState + " state by " + currentUser);
	}

	/**	
	 * If you promote any 'Master Artwork Element' Object then it checks the corresponding base copy(Artwork Element) is in next state.
	 * Ex: If 'Master Artwork Element' in Preliminary state and promoting this then it checks corresponding 'Artwork Element' is in Review State.
	 * If 'Artwork Element' in Review State then blocks the 'Master Artwork Element' object promotion. 
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.

	 */	
	public int checkStateWithBaseContentState(Context context,String[] args) throws Exception
	{
		String masterArtworkElementId     	=  args[0];
		String artworkElementState  		=  args[1];
		
		DomainObject artworkElement	 = new DomainObject(getArtworkElement(context, masterArtworkElementId));
		String state     = artworkElement.getInfo(context, DomainObject.SELECT_CURRENT);
		if(!state.equals(artworkElementState))
		{	
			String error = EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.CheckCopyContentStateMC.Alert");  
			emxContextUtilBase_mxJPO.mqlNotice(context , error + " " + artworkElementState + " " + State);
			return 1;
		}
		return 0;
	}
	
	/**
	 * Gets the Base Copy Element from the given Master Copy Element object id
	 * 
	 * @param context
	 * @param artworkMasterId
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings({ "rawtypes" })
	private String getArtworkElement(Context context, String artworkMasterId) throws Exception {

		List<String> artworkElementIdList 	= null;
		try{
			
			String objWhere	 				= "(attribute[" + PropertyUtil.getSchemaProperty(context,ATR_IS_BASE_COPY) + "] smatch const " + "\"" + RANGE_YES + "\")";
			DomainObject artworkMaster 		= new DomainObject(artworkMasterId);
			MapList artworkElementInfo 		= artworkMaster.getRelatedObjects(context, 
					 												PropertyUtil.getSchemaProperty(context,REL_ArtworkElementContent), 
					 												PropertyUtil.getSchemaProperty(context,"type_LabelElement"), 
												new StringList(DomainObject.SELECT_ID), null, 
					 												false, true, (short)1, 
												objWhere, null, 0);
	
			artworkElementIdList 			= new ArrayList<String>(artworkElementInfo.size());
			for (Iterator iterator = artworkElementInfo.iterator(); iterator.hasNext();) {
				Map artworkElementMap 		= (Map) iterator.next();
				String id 					= (String)artworkElementMap.get(DomainObject.SELECT_ID);
				if(UIUtil.isNotNullAndNotEmpty(id))
					artworkElementIdList.add(id);
			}
		}catch(Exception e){
			
			throw new FrameworkException(e.getMessage());
		}
		if(artworkElementIdList.isEmpty())
			return null;
		else if(artworkElementIdList.size() > 1)
		{
			String aeSizeError 	= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.ArtworkMaster.AESizeException"); 
			throw new FrameworkException(aeSizeError);
		}
		else 
			return artworkElementIdList.get(0);

	}	
	
	/**
	* Determines whether object is of Copy Element
	    *
	    * @param   context            - the enovia <code>Context</code> object
	    * @param   objectId           - String - business object id
	    * @param   type               - String - business object type
	    * @return  boolean            - true if object is of given type
	    * @throws  FrameworkException - if objectId is not valid
	    */
	private static boolean isKindOfCopyElement(Context context, String objectId) throws FrameworkException
	{
		String TYPE_COPY_ELEMENT 		= PropertyUtil.getSchemaProperty(context,"type_CopyElement");
		String sResult 					= MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", objectId, "type.kindof[" + TYPE_COPY_ELEMENT+ "]");
	    return "TRUE".equalsIgnoreCase(sResult);
	}
		
	/**
	 * Gets the object id of Master Copy Element for the given Copy Element object
	 * @param context
	 * @param artWorkElement
	 * @return
	 * @throws Exception 
	 */
	
	private String getArtworkMaster(Context context, DomainObject artWorkElement) throws Exception
	{
		String masterCopyId		= artWorkElement.getInfo(context, TO_OPEN_BRACE+PropertyUtil.getSchemaProperty(context, REL_ArtworkElementContent)+"].from.id");
		if(UIUtil.isNullOrEmpty(masterCopyId)) {
			String error 		= EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.ArtworkElement.ConnectionException");
			throw new FrameworkException(error);
		}
		return masterCopyId;
	}
		
	/**
	 * This will check t he given object is a Base Copy Element or not.  Read attribute "Is Base Copy".
	 * If it is Yes, then return true, else false 
	 * 	 
	 * @param context
	 * @param dObj
	 * @return
	 * @throws FrameworkException
	 */
	
	private boolean isBaseCopy(Context context, DomainObject dObj) throws FrameworkException 
	{
		String ATTRIBUTE_IS_BASE_COPY 	= PropertyUtil.getSchemaProperty(context,ATR_IS_BASE_COPY);
		return RANGE_YES.equalsIgnoreCase(dObj.getAttributeValue(context, ATTRIBUTE_IS_BASE_COPY));
	}
		
	/**
     * Gets the state names of given policy name. If any problem occurs it will return an empty String List
     * 
     * @param context
     * @param sPolicy 
     * @return  list of states. 
     * @throws MatrixException
     */
	@SuppressWarnings({"PMD.AvoidReassigningParameters","unchecked"})
	private static StringList getStates ( Context context , String sPolicy ) throws MatrixException 
    {       
        StringList states 	= new StringList();        
        if( UIUtil.isNullOrEmpty(sPolicy))
            return states;
        else if(sPolicy.contains("policy_"))
        	sPolicy 		= PropertyUtil.getSchemaProperty(context, sPolicy);
        
        Policy policy 		= new Policy( sPolicy );	        
        StateRequirementList stateList = policy.getStateRequirements(context);	        
        for ( StateRequirement st : (List<StateRequirement> ) stateList )
        {	            
            states.add(st.getName());
        }	        
        return states;
    }
    
	/**
	 * This will revise the Master Copy and Local copies(In release state) when we revise the Base Copy.
	 * and it floats the preliminary local copies to revised artwork master. 
	 * @param context EnoviaContext 
	 * @param args BaseCopy ObjectId
	 * @return
	 * @since 2013x.HF4
	 * @throws FrameworkException
	 */
	public void reviseArtworkMasterAndLocalCopies(Context context, String[] args) throws FrameworkException
	{
		try {
			if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			String currentArtworkElementId = args[0];
			DomainObject currentArtworkElement = new DomainObject(currentArtworkElementId);
			
			String currentArtworkMasterId = getArtworkMaster(context,currentArtworkElement);
			DomainObject currentArtworkMaster=new DomainObject(currentArtworkMasterId);			
	
			// STEP -1: Connect the new revision to Master -  Start
			DomainObject revisedArtworkElement = DomainObject.newInstance(context, currentArtworkElement.getNextRevision(context).getObjectId(context));
			currentArtworkMaster.addToObject(context, new RelationshipType(PropertyUtil.getSchemaProperty(context,REL_ArtworkElementContent)), revisedArtworkElement.getObjectId(context));			
			// STEP -1: Connect the new revision to Master -  End
			
		}
		catch (Exception e) 
		{
			throw new FrameworkException(e);
		}		
	}
	
	

	public void connectRevisedArtworkElement(Context context, String[] args) throws FrameworkException
	{
		try {
			if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			
			String currentArtworkElementId = args[0];
			DomainObject currentArtworkElement = new DomainObject(currentArtworkElementId);
			
			String currentArtworkMasterId = getArtworkMaster(context,currentArtworkElement);
			DomainObject currentArtworkMaster=new DomainObject(currentArtworkMasterId);			
	
			// STEP -1: Connect the new revision to Master -  Start
			DomainObject revisedArtworkElement = DomainObject.newInstance(context, currentArtworkElement.getNextRevision(context).getObjectId(context));
			currentArtworkMaster.addToObject(context, new RelationshipType(PropertyUtil.getSchemaProperty(context,REL_ArtworkElementContent)), revisedArtworkElement.getObjectId(context));			
			// STEP -1: Connect the new revision to Master -  End
			
		}
		catch (Exception e) 
		{
			throw new FrameworkException(e);
		}		
	}

	
	/**
	 * It checks for the latest revision of the artwork element is in release state
	 * and any local copies are not in review state then only artwork element will get revised
	 * @param context Enovia Context
	 * @param args Artwork Element object id
	 * @return 1 if given condition not satisfies else 0
	 * @since 2013x.HF4 
	 * @throws FrameworkException 
	 */
	public int canReviseArtworkElement(Context context, String[] args) throws FrameworkException
	{
		try {
			if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			String artworkContentId = args[0];
			DomainObject artworkContent= DomainObject.newInstance( context, artworkContentId );
			if(latestRevisionNotIsInReleaseState(context, artworkContent))
				return 1;			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}		
		return 0;
	}
	
	/**
	 *This will Verify ,
	 *1)Last revision of object should be release state
	 *2)Asked object should be last object, ie prior to last released objects are not allowed to revise 
	 */
	private boolean latestRevisionNotIsInReleaseState(Context context, DomainObject artworkContent) throws FrameworkException
	{
		try {

			StringList objectSelectables = new StringList(SELECT_LAST_CURRENT);
			objectSelectables.add(DomainConstants.SELECT_LAST_ID);
			Map latestArtworkContentInfo = artworkContent.getInfo( context, objectSelectables );
			String artworkContentReleaseState="Release";
			String errorMessage = "";
			if(!artworkContentReleaseState.equals((String)latestArtworkContentInfo.get(SELECT_LAST_CURRENT)))
			{
				errorMessage = EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.ArtworkElement.NotReleaseState");
			}
			else if(!artworkContent.getId( context ).equalsIgnoreCase((String)latestArtworkContentInfo.get(DomainConstants.SELECT_LAST_ID)))
			{
				errorMessage =  EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.ArtworkElement.NotLatestReleaseState");
			}
			
			if(!errorMessage.isEmpty())
			{
				emxContextUtilBase_mxJPO.mqlError(context, errorMessage);
				return true;
			}
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
		return false;
	}
	
	/**
	* Checks whether revise is allowed for MasterCopy content or not.   
	* @param   context
	* @param   artworkContent
	*/
	private boolean checkLocalCopyInReview(Context context, DomainObject artworkContent) throws FrameworkException
	{
		try {
			if(!isBaseCopy(context, artworkContent))
				return false;
			
			List<DomainObject> localCopies = getLocalCopies(context,artworkContent);
			StringList localCopyTextLangsList = new StringList(localCopies.size());
			for (DomainObject artworkElement : localCopies) 
			{
				if("Review".equals(artworkElement.getInfo(context, "current")))
				{
					String strLocalCopyTextLang = artworkElement.getInfo(context, "attribute["+PropertyUtil.getSchemaProperty(context,"attribute_CopyTextLanguage")+"]");
					localCopyTextLangsList.add(strLocalCopyTextLang);
				}
			}
			if(!localCopyTextLangsList.isEmpty())
			{
				String strLocalCopyTextLangs = FrameworkUtil.join(localCopyTextLangsList, ",");
				String artworkElementType = artworkContent.getInfo(context, DomainConstants.SELECT_TYPE);
				String displayName = new DomainObject(getArtworkMaster(context,artworkContent)).getInfo(context, "attribute["+PropertyUtil.getSchemaProperty(context,"attribute_MarketingName")+"]");
				String[] formatArgs     = {artworkElementType, displayName, strLocalCopyTextLangs};				
				String errorMessage  = EnoviaResourceBundle.getProperty(context, CPD_STRING_RESOURCE, new Locale(context.getSession().getLanguage()), "emxCPD.ArtworkMaster.MasterCopyRevision");
				errorMessage = StringResource.format(errorMessage, new String[]{"AEType", "AEDisplayName", "LCLanguage"}, formatArgs);
				context.setCustomData("errormessage", errorMessage); 
				emxContextUtilBase_mxJPO.mqlError(context , errorMessage);
				return true;
			}			
			return false;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * It gets all the local copies connected to Artwork Master
	 * @param paramContext
	 * @param artworkContent
	 * @return
	 * @throws FrameworkException
	 */
	public List<DomainObject> getLocalCopies(Context paramContext, DomainObject artworkContent) throws FrameworkException {
	
		ArrayList localArrayList = null;
		try {
			if (!isBaseCopy(paramContext,artworkContent))
		      return new ArrayList(0);
			String objWhere	 = "(attribute[" + PropertyUtil.getSchemaProperty(paramContext,ATR_IS_BASE_COPY) + "] smatch const " + "\"" + RANGE_NO + "\")";
		    String localArtworkMasterId = getArtworkMaster(paramContext,artworkContent);
		  
			MapList localMapList =new DomainObject(localArtworkMasterId).getRelatedObjects(paramContext, 
																							PropertyUtil.getSchemaProperty(paramContext,REL_ArtworkElementContent),
																							PropertyUtil.getSchemaProperty(paramContext,"type_LabelElement"), 
																							new StringList(DomainConstants.SELECT_ID), null, 
																							false, 
																							true, (short) 1, 
																							objWhere, null, 0);
			localArrayList = new ArrayList(localMapList.size());
		    for (Iterator localIterator = localMapList.iterator(); localIterator.hasNext(); ) {
		        Map localMap = (Map)localIterator.next();
		        String str = (String)localMap.get(DomainConstants.SELECT_ID);
		        DomainObject localObject = new DomainObject(str);
		        localArrayList.add(localObject);
		      }
		    
	    	} catch (Exception e) {
	    		e.printStackTrace();
	    	}
	    	return localArrayList;	
		}	
	
	/**
	 *  It floats the revised Local Copy to Latest Master Copy on following conditions.
	 *  It checks the connected artwork master has the next revision . If exists , then it will connect to the artwork master.
	 *  												If not Exists , then it will float to the existing artwork master by setTo Object.
	 * @param context Enovia Context.
	 * @param args Artwork Element ObjectId
	 * @return
	 * @since 2013x.HF4
	 * @throws FrameworkException
	 */
	
	public void floatRevisedLocalCopyToMaster(Context context, String[] args) throws FrameworkException
	{		
		if(args.length == 0 || UIUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();
		boolean isContextPushed = false;
		try 
		{
			String oldLocalCopyId 		= args[0];
			DomainObject oldLocalBusinessObject = new DomainObject(oldLocalCopyId);
			if(isBaseCopy(context, oldLocalBusinessObject))
				return;
			
			BusinessObject newLocalCopyElement  =  oldLocalBusinessObject.getNextRevision(context);
			/**
			 * H49:
			 * Connecting the Local Copy Element to the latest artwork master. There are two scenario's
			 * 1)	If local copy only revised then find the old local copy artwork master and its last artwork master.
			 * 		this case both object id's will be same so we need to float the new local copy element to artwork master
			 * 
			 * 2)	If a Base Copy revised , then the artwork master and corresponding  local copy will get revised
			 * 		This block will get context object as old local copy then find the new (revised ) local copy and its artwork master ( here old artwork aster)
			 * 		If the old artwork master and latest artwork master object not equal then connect new local copy to new local master 
			 * 		 
			 * 		
			 */
			if(UIUtil.isNotNullAndNotEmpty(newLocalCopyElement.toString()))
			{
				String oldArtworkMasterId = oldLocalBusinessObject.getInfo(context, TO_OPEN_BRACE+PropertyUtil.getSchemaProperty(context,REL_ArtworkElementContent)+"].from.id");
				String ctxUser = context.getUser();
				String userAgent = PropertyUtil.getSchemaProperty(context, "person_UserAgent");
				
				isContextPushed =CPDPropertyUtil.pushContextIfNoAccesses( context, oldArtworkMasterId, new StringList(new String[] {"fromconnect"}));
				//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access fromconnect", true, oldArtworkMasterId, ctxUser);
				DomainObject oldArtworkMaster = new DomainObject(oldArtworkMasterId);
				DomainRelationship.connect(context, oldArtworkMaster , PropertyUtil.getSchemaProperty(context,REL_ArtworkElementContent), new DomainObject(newLocalCopyElement));	
				//MqlUtil.mqlCommand(context, "mod bus $1 revoke grantor $2 grantee $3;", true, oldArtworkMasterId, userAgent, ctxUser);
			}	
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}
}
	
