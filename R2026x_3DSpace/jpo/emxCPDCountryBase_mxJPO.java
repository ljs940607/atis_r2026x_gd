/*
 *  emxCPDCountryBase.java
    This JPO is added for Manage Country Functionality.
 *
 */
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;

import matrix.db.BusinessObjectList;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.Relationship;
import matrix.util.SelectList;
import matrix.util.StringList;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;
/**
 * @version V6R2011x - Copyrigh t (c) 2010, MatrixOne, Inc.
 */
@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.AvoidDuplicateLiterals", "PMD.TooManyMethods"})
public class emxCPDCountryBase_mxJPO extends emxDomainObject_mxJPO
{

  private static final String TYPE_COUNTRY = "type_Country";
  private static final String RELATIONSHIP_COUNTRY = "relationship_Country";

/**
   *
   * @param context the eMatrix <code>Context</code> object
   * @param args holds no arguments
   * @throws Exception if the operation fails
   * @since CPN V6R2011x
   * @grade 0
   */
  public emxCPDCountryBase_mxJPO (Context context, String[] args)
    throws Exception
  {
    super(context, args);
  }

  /**
   * This method is executed if a specific method is not specified.
   *
   * @param context the eMatrix <code>Context</code> object
   * @param args holds no arguments
   * @returns int
   * @throws Exception if the operation fails
   * @since CPN V6R2011x
  
  public int mxMain(Context context, String[] args)
   throws Exception
  {
    if (!context.isConnected()) {
      throw new Exception("not supported on desktop client");
    }
    return 0;
  } */

 /**
  * Gets the MapList containing all the Countries connected to the current Regions.
  * @param context the eMatrix <code>Context</code> object
  * @param args holds input arguments.
  * @return a MapList containing all the Countries connected to the current Region.
  * @throws Exception if the operation fails.
  */
  @com.matrixone.apps.framework.ui.ProgramCallable
  public  Object getCountries(matrix.db.Context context, String[] args) throws Exception
  {
		if (args.length == 0 )
		{
			  throw new IllegalArgumentException();
		}
		SelectList objectSelects = new SelectList(1);
		SelectList relSelects = new SelectList(1);
		objectSelects.add(DomainConstants.SELECT_ID);
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		HashMap paramMap = (HashMap)JPO.unpackArgs(args);
		String objectId = (String)paramMap.get("objectId");
		DomainObject obj =  DomainObject.newInstance(context);
		obj.setId(objectId) ;
		String relationshipCountry = PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY);
		String typeCountry = PropertyUtil.getSchemaProperty(context, TYPE_COUNTRY);
		MapList list= obj.getRelatedObjects(context,
								    relationshipCountry, typeCountry,
                                    objectSelects, relSelects,
                                    false,true,(short) 1,
                                    null,null, 0,
                                    null, null, null);
		return list;
  }

  /**
    * This method returns access permissions of Command depending on the type.
    *
    * @param context the eMatrix <code>Context</code> object.
    * @param args holds objectId and param values.
    * @throws Exception If the operation fails.
    * @since SC 10-5.
    */

    public boolean hasAccessForLocationRegionAddRemove(Context context,String[] args)
        throws Exception
    {

      HashMap paramMap = (HashMap)JPO.unpackArgs(args);
      String objectId = (String) paramMap.get("objectId");
	  DomainObject dob = new DomainObject(objectId);
	  return dob.getInfo(context, SELECT_TYPE).equals(TYPE_REGION);
     
    }

		/**
	  * If user is adding country to the sub-region then only countries connected to parent be displayed in result. this method exclude countries which are not connected to 	parent region and also excludes countries already added to the region .
	  * @param context the eMatrix <code>Context</code> object
	  * @param args holds input arguments.
	  * @return a MapList containing all the Region connected to the Country.
	  * @throws Exception if the operation fails.
	  */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	 public StringList excludeCountriesOIDs(Context context, String args[]) throws Exception
    {
        StringList excludeIdList = new StringList();
        StringList busSelects = new StringList(1);
        busSelects.addElement(DomainConstants.SELECT_ID);
		HashMap object;
		String busId = null;
		StringList CountryObjList = new StringList();
		String strParentId = null;
		StringList strList = null;
		String strRelType = null;

		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		String objectId = (String) programMap.get("objectId");

		DomainObject doObj = DomainObject.newInstance(context, objectId);
		String relId = (String) programMap.get("relId");

		DomainRelationship doRel = new DomainRelationship(relId);
		StringList relSelect = new StringList();
		relSelect.add(DomainRelationship.SELECT_TYPE);
		Hashtable hstTable = doRel.getRelationshipData(context, relSelect );
		strList = (StringList)hstTable.get(DomainRelationship.SELECT_TYPE);
		strRelType = (String)strList.get(0);

		if (strRelType!= null && strRelType.equals(RELATIONSHIP_SUB_REGION))
		{
			strParentId = doObj.getInfo(context, "to[" + RELATIONSHIP_SUB_REGION + "].from.id" );
			String strWhereClause = "!(to[" + PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY) + "].from.id == " + strParentId + ")";
			CountryObjList = (StringList)doObj.getInfoList(context, "from[" + PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY) + "].to.id");
			MapList totalresultList = DomainObject.findObjects(context,
															   PropertyUtil.getSchemaProperty(context, TYPE_COUNTRY),
																 "*",
																 "*",
																 "*",
																 "*",
																 strWhereClause,
																 null,
																 true,
																 busSelects,
																 (short) 0);
			Iterator itr = totalresultList.iterator();
			for (; itr.hasNext(); )
			{
				object = (HashMap) itr.next();
				busId = (String) object.get(DomainConstants.SELECT_ID);
				excludeIdList.add(busId);
			}//End of for loop

			for (int j = 0; j<CountryObjList.size(); j++)
			{
				busId = (String) CountryObjList.get(j);
				excludeIdList.add(busId);
			}//End of for loop
		}
		else
		{
			excludeIdList = (StringList)doObj.getInfoList(context, "from[" + PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY) + "].to.id");
		}
    
        return excludeIdList;
    }

/**
  * Gets the MapList containing all Region connected to Country.
  * @param context the eMatrix <code>Context</code> object
  * @param args holds input arguments.
  * @return a MapList containing all the Region connected to the Country.
  * @throws Exception if the operation fails.
  */
  @com.matrixone.apps.framework.ui.ProgramCallable
  public  Object getWhereUsed(matrix.db.Context context, String[] args) throws Exception
  {
		if (args.length == 0 )
		{
			  throw new IllegalArgumentException();
		}
		SelectList objectSelects = new SelectList(1);
		SelectList relSelects = new SelectList(1);
		objectSelects.add(DomainConstants.SELECT_ID);
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		HashMap paramMap = (HashMap)JPO.unpackArgs(args);
		String objectId = (String)paramMap.get("objectId");
		//String relationshipName = PropertyUtil.getSchemaProperty(context, "relationship_Country");
		//String strTypes = FrameworkProperties.getProperty(context,"emxCPD.WhereUsed.Types");
		String strTypes = EnoviaResourceBundle.getProperty(context,"emxCPD.WhereUsed.Types");
		//String strRelationships = FrameworkProperties.getProperty(context,"emxCPD.WhereUsed.Relationship");
		  String strRelationships = EnoviaResourceBundle.getProperty(context,"emxCPD.WhereUsed.Relationship");
	    MapList list= new MapList();
		DomainObject obj =  DomainObject.newInstance(context);
		obj.setId(objectId) ;
		list= obj.getRelatedObjects(context,
                                    strRelationships, strTypes,
                                    objectSelects, relSelects,
                                    true, false, (short) 1,
                                    null,null, 0,
                                    null, null ,null);
		return list;
  }

  /**
  * Update the Country Name.
  *
  * @param context The Matrix Context.
  * @param args holds input arguments.
  * @return
  * @throws Exception If the operation fails.
  * @since 10.0.0.0
  */
public  Boolean updateCountryName(Context context, String[] args)
    throws Exception
  {
    HashMap programMap=(HashMap)JPO.unpackArgs(args);

    HashMap paramMap = (HashMap)programMap.get("paramMap");

    String relId = (String)paramMap.get("relId");
    String objectId=(String)paramMap.get("objectId");
    String strName = (String)paramMap.get("New Value");

    Relationship relObj = new Relationship(relId);
    relObj.open(context);
    DomainObject busParentObj = new DomainObject(relObj.getFrom());
    relObj.close(context);
    String strParentId   = busParentObj.getId(context);

	Boolean bUpdate = Boolean.FALSE;
    matrix.db.Query query = new matrix.db.Query();
    query.open(context);
    query.setBusinessObjectType(PropertyUtil.getSchemaProperty(context, TYPE_COUNTRY));
    query.setBusinessObjectName(strName);
    query.setBusinessObjectRevision("*");
    query.setVaultPattern("*");
    query.setOwnerPattern("*");
    query.setWhereExpression("to["+ PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY) +"].from.id == "+strParentId);
    BusinessObjectList boList = query.evaluate(context);
    query.close(context);
    int countEqual = boList.size();

    if(countEqual == 0)
    {
        DomainObject domCountryObj = new DomainObject(objectId);
        domCountryObj.open(context);
        domCountryObj.change(context,PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY),strName, domCountryObj.getRevision(), domCountryObj.getVault(), domCountryObj.getPolicy().getName());
        domCountryObj.close(context);
        bUpdate = Boolean.TRUE;
    }
    else
    {
        //String strMessage = i18nNow.getI18nString("emxCPD.AddCountry.CountryAlreadyExists","emxCPDStringResource",languageStr);
    	String strMessage = EnoviaResourceBundle.getProperty(context, "emxCPDStringResource", context.getLocale(), "emxCPD.AddCountry.CountryAlreadyExists");;
        emxContextUtil_mxJPO.mqlNotice(context,strMessage);
    }
    return bUpdate;
  }

   /**
  * get the Country Name.
  *
  * @param context The Matrix Context.
  * @param args holds input arguments.
  * @return
  * @throws Exception If the operation fails.
  * @since 10.0.0.0
  */
  public String getCountryName(Context context, String[] args)
    throws Exception
  {
    HashMap programMap=(HashMap)JPO.unpackArgs(args);

    HashMap paramMap = (HashMap)programMap.get("paramMap");
    //String relId = (String)paramMap.get("relId");
    String objectId=(String)paramMap.get("objectId");

    HashMap requestMap = (HashMap)programMap.get("requestMap");
    String strMode = (String)requestMap.get("mode");

    String strReturnVal = "";

    if(requestMap.get("mode") != null)
    {
        strMode = (String) requestMap.get("mode");
    }

    DomainObject domObj = new DomainObject(objectId);
    domObj.open(context);
    String strName = domObj.getInfo(context,DomainObject.SELECT_NAME);

    if("edit".equals(strMode))
    {
        strReturnVal = "<input type=\"text\"  name=\"Name\" value=\""+strName+"\" >";
    }
    else
    {
        strReturnVal = strName;
    }

    return  strReturnVal;
  }
  
  /**
   * Checks if given country is in Host Company or not.
   * @param context
   * @param args
   * @return true if Country is under Host Company
   * @throws Exception
   * @since 2012x.HF1
   */
  @SuppressWarnings("unchecked")
  public boolean isCountryInHostCompany(Context context, String args[]) throws Exception
  {
	   HashMap paramMap = (HashMap)JPO.unpackArgs(args);
	   String strCountryId = (String) paramMap.get("objectId");

		DomainObject doCountry = new DomainObject(strCountryId);
		String strCompanyId = doCountry.getInfo(context, "to[" + PropertyUtil.getSchemaProperty(context, RELATIONSHIP_COUNTRY) + "].from.to[" + RELATIONSHIP_ORGANIZATION_REGION + "].from.id");
	    return !UIUtil.isNullOrEmpty(strCompanyId);
  }
}
