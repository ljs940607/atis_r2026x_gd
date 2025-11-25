/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.LocalLanguage;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;

/**
 * @version V6R2011x - Copyrigh t (c) 2010, MatrixOne, Inc.
 */
public class AWLLanguageBase_mxJPO extends AWLObject_mxJPO
{

	/**
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @throws Exception if the operation fails
	 * @since AWL V6R2011x
	 * @grade 0
	 */
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLLanguageBase_mxJPO (Context context, String[] args)
	throws Exception
	{
		super(context, args);
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getLanguagesForCountry(Context context, String args[]) throws FrameworkException
	{
		try {
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String strCountryId = (String) paramMap.get("objectId");
			return LocalLanguage.getCountryLanguages(context, new Country(strCountryId));
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList getConnectedLanguages(Context context,String args[]) throws FrameworkException {
		MapList lang = getLanguagesForCountry(context, args);
		return BusinessUtil.getIdList(lang);
	}


	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createLanguageObject(Context context, String args[]) throws FrameworkException {
		try {
			HashMap requestMap = (HashMap)JPO.unpackArgs(args);
			String name = (String) requestMap.get("Name");
			LocalLanguage lang = LocalLanguage.createLanguage(context, name);
			HashMap map = new HashMap(1);
			map.put(DomainConstants.SELECT_ID, lang.getId(context));
			return map;
		} catch (Exception e) {
			//e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	 public void createLanguagePostProcess(Context context, String[] args) throws FrameworkException
	 {
		 try
		 {
			 Map programMap         = (HashMap) JPO.unpackArgs(args);
			 Map requestMap             = (Map) programMap.get("requestMap");
			 Map paramMap               = (Map) programMap.get("paramMap");
			 String countryId = (String)requestMap.get("parentOID");
			 String langId= (String)paramMap.get("newObjectId");
			 LocalLanguage lang = new LocalLanguage(langId);
			 lang.addLanguageToCountry(context, new Country(countryId));
		 }
		 catch(Exception  e) {
			 throw new FrameworkException(e.toString());
		 }  

	 }
	 
	 public int checkLanguageIsUsed(Context context, String[] args) throws FrameworkException
	 {
		 if(args.length == 0)
				throw new IllegalArgumentException();
		 try {
			 String languageId = args[0];
			 LocalLanguage lang = new LocalLanguage(languageId);
			 if(lang.isLanguageUsed(context)) {
				 String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.LanguageInUse");
				MqlUtil.mqlCommand(context, "notice $1", strAlert);
				 return 1;
			 }
			 return 0;
		} catch (Exception e) {
			throw new FrameworkException();
		}
	 }
	  
	 //Added by Y2H : changeName trigger on type_LocalLanguge for modifying the Copy Text Language on Copy element
	 public void modifyCopyTextLanguage(Context context, String[] args) throws FrameworkException
	 {
		 if(args.length == 0)
				throw new IllegalArgumentException();
		 try{
			 	String languageId = args[0];
			 	String newLangName = args[1];
			 	LocalLanguage lang = new LocalLanguage(languageId);
			 	MapList mlCopyElementIds = lang.getConnectedCopyElementIDs(context);	
			 	
			 	if(mlCopyElementIds.size()>0)
			 	{
			 		for (Iterator iterator = mlCopyElementIds.iterator(); iterator.hasNext();) 
			 		{
			 			Map copyElementMap = (Map) iterator.next();
			 			String copyElementID = (String)copyElementMap.get(SELECT_ID);
			 			if(BusinessUtil.isNotNullOrEmpty(copyElementID))
			 			{
			 				CopyElement copyElement = new CopyElement(copyElementID);
			 				copyElement.setAttributeValue(context,AWLAttribute.COPY_TEXT_LANGUAGE.get(context), newLangName);
			 				
			 			}
				
			 		}
			 	}
		 }
		 catch(Exception e)
		 {
			 throw new FrameworkException();
		 }
		 
	 }
	 //Ended by Y2H
	 
}
