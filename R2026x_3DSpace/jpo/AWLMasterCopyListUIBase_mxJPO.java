/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import matrix.db.Context;
import matrix.util.StringList;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

/**
 * @deprecated Since R2016x with POA Simplification highlight
 */
public class AWLMasterCopyListUIBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	//int iLength=80;
	//private static final long serialVersionUID = -157873695749797151L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLMasterCopyListUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	public boolean showLinkForMCLCreate(Context context, String[] args) throws FrameworkException {
		//return true;
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}	
	
	/**
	 * Method call to get all the POAs Associated with MCL.
	 * 
	 * @param context
	 *            the eMatrix <code>Context</code> object
	 * @param args
	 *            holds the following input arguments: 0 - HashMap containing
	 *            one String entry for key "objectId"
	 * @return Object - MapList containing the id of all POA
	 * @throws Exception
	 *             if operation fails
	 * @author BV8
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAsAssociatedToMCL(Context context, String[] args)
			throws FrameworkException {
		/*try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String mclID = (String) programMap.get("objectId");

			MasterCopyList mcl = new MasterCopyList(mclID);
			return mcl.getPOAsList(context);
			
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
  /***
     * Msater Copy List edit Display Name Creating TextBoxes and filling the value in that
     * @param context
     * @param args
     * @return
     * @throws Exception
     */
  public StringList editDisplayName(Context context, String[] args)
    throws FrameworkException
    {
	  /*try{
		  String strAttributeName =  AWLAttribute.MARKETING_NAME.get(context);
	        String strSelectAttribute = AWLUtil.strcat("attribute[", strAttributeName, "]");
	        
	        return getHTMLTagsForTextBox(context,args,strAttributeName,strSelectAttribute);
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
       
    }
  /***
   * Msater Copy List edit MasterCopyListName Creating TextBoxes and filling the value in that
   * @param context
   * @param args
   * @return
   * @throws Exception
   */
  public StringList editMasterCopyListName(Context context, String[] args)
  throws FrameworkException
  {
	 /* try{
		  String strAttributeName =  AWLAttribute.MCL_NAME.get(context);
	      String strSelectAttribute = AWLUtil.strcat("attribute[", strAttributeName, "]");
	      return getHTMLTagsForTextBox(context,args,strAttributeName,strSelectAttribute);
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
      
  }
  
  /*private StringList getHTMLTagsForTextBox(Context context,
		                                   String[] args,
		                                   String strAttributeName,
		                                   String strSelectAttribute)throws FrameworkException
      {      
	  try{
		  HashMap programMap = (HashMap) JPO.unpackArgs(args);
          MapList relBusObjPageList = (MapList) programMap.get("objectList");
          StringList textBoxValue = new StringList();
          //Checking if objectList obtained is null
          if (relBusObjPageList != null)
          {
        	// getting the default values for object ids
        	//Get the number of objects in objectList
              int iNumOfObjects = relBusObjPageList.size();
              //Getting the bus ids for objects in the table
              String arrObjId[] = new String[iNumOfObjects];
              Object object = null;
              for (int i = 0; i < iNumOfObjects; i++)
              {
                  object = relBusObjPageList.get(i);
                  if (object instanceof Map)
                  {
                      arrObjId[i] =(String) (((Map) object).get(DomainConstants.SELECT_ID));
                  }
              }
              matrix.db.BusinessObjectWithSelectList businessObjectWithSelectList =
                  matrix.db.BusinessObject.getSelectBusinessObjectData(context,arrObjId,new StringList(strSelectAttribute));
           // forming the HTML Tags
              String  strTextBoxHTML = AWLUtil.strcat("<input type=\"text\" size=\"20\" maxlength=\" ", iLength, " \" name=\"%s:", strAttributeName.trim(), "\"value=\"%s\">");
              
              String strSelectedAttribute = "";
              for (int i = 0; i < iNumOfObjects; i++)
              {
                  strSelectedAttribute = (businessObjectWithSelectList.getElement(i)).getSelectData(strSelectAttribute);
                  // forming the HTML tag for one row
                  String strAppendTextBoxHTML = String.format(strTextBoxHTML,arrObjId[i],strSelectedAttribute);
                  textBoxValue.add(strAppendTextBoxHTML);                 
              }   
          }
      return textBoxValue;  
		}catch(Exception e){ throw new FrameworkException(e);}
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x"); 
      }*/
  
  // n94 To get Artwork structure for Master Copy List based on state
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkStructureForMasterCopyList(Context context, String[] args) throws FrameworkException {
		/*try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectid = (String) programMap.get("objectId");

			MasterCopyList mastercopylist = new MasterCopyList(strObjectid);
			
			return mastercopylist.getArtworkElements(context);
		}catch(Exception e){ throw new FrameworkException(e);}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	
	public StringList canEditInstanceSequence(Context context, String[] args) throws FrameworkException {
		/*try {
			Map programMap       = (Map)JPO.unpackArgs(args);
			Map reqMap 			 = BusinessUtil.getRequestMap(programMap);
			
			String mclID		 = (String) reqMap.get("parentOID");
			MasterCopyList mcl   =  new MasterCopyList(mclID);
		    
			MapList objectList   = BusinessUtil.getObjectList(programMap);
			StringList objectIDs = BusinessUtil.getIdList(objectList);
			StringList editAccess = new StringList (objectList.size());
			
		    boolean isPM 	      = Access.hasRole(context, Access.COPY_ARTWORK_ROLES.PRODUCT_MANAGER);
		    boolean isPreliminary = AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.MCL, mcl.getInfo(context, SELECT_CURRENT));
		    boolean canEdit = isPM && isPreliminary;
		    
		    for (String oID : (List<String>) objectIDs) {
		    	//If the table has expand first row will be MCL
		    	boolean showEdit = canEdit && !oID.equals(mclID); 
		    	editAccess.add(showEdit ? Boolean.TRUE : Boolean.FALSE);
			}
			return editAccess;		
		}catch(Exception e){ throw new FrameworkException(e);}
	*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
}
}
