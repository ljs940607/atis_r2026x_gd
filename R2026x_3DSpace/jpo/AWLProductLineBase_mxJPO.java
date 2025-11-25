/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.HashMap;
import java.util.List;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;

public class AWLProductLineBase_mxJPO extends AWLObject_mxJPO {
	/**
	 * 
	 */
	private static final long serialVersionUID = 6688226419042376547L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLProductLineBase_mxJPO(Context context, String[] args)
			throws Exception {
		super(context, args);
	}

	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void connectBrandSubProductLines(Context context, String[] args) throws FrameworkException 
	{
		try 
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) programMap.get("paramMap");
			String newObjectId = (String) paramMap.get("newObjectId");
			
			HashMap requestMap = (HashMap) programMap.get("requestMap");
			
			String strSelectedProductLineId = (String) requestMap.get("objectId");
			
			if(BusinessUtil.isNotNullOrEmpty(strSelectedProductLineId))
			{
				Brand brand=new Brand(strSelectedProductLineId);			
				brand.connectTo(context, AWLRel.SUB_PRODUCT_LINES, new Brand(newObjectId));							
			}
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Product Line Deletion
	 * In this method will check whether Product line is connected to Model or Sub brand
	 * @param   context      
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @since   AWL 2013XHF1
	 */
	public int canDeleteProductLine(Context context, String[] args) throws FrameworkException
	{
		try {
			String strObjId	= args[0];
			if(BusinessUtil.isNotNullOrEmpty(strObjId)){
				Brand brand = new Brand(strObjId);
				MapList modelList = brand.getModels(context);
				List<Brand> subBrandList = brand.getHierarchyProductLines(context, false);
				if(!modelList.isEmpty() || !subBrandList.isEmpty()) {
					String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ProductLine.Connected.Model");
					MqlUtil.mqlCommand(context, "notice $1", strAlert);
					return 1;
				}
			}
			return 0;

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	
	public int checkAWLHierarchy(Context context, String[] args) throws FrameworkException
	{
		try {
			String parentBrandId = args[0];
			String childBrandId	= args[1];
			
			String parentType = BusinessUtil.getInfo(context, parentBrandId, SELECT_TYPE);
			String parentSymType = FrameworkUtil.getAliasForAdmin(context, SELECT_TYPE, parentType, true);
			
			String childType = BusinessUtil.getInfo(context, childBrandId, SELECT_TYPE);
			String childSymType = FrameworkUtil.getAliasForAdmin(context, SELECT_TYPE, childType, true);
			
			StringList eligibleTypeList = AWLGlobalPreference.getSubProductLineConfig(context, parentSymType);
			if(eligibleTypeList != null && !eligibleTypeList.contains(childSymType)) {
				String[] eligibleTypei18Names = new String[eligibleTypeList.size()];
				for (int i = 0; i < eligibleTypei18Names.length; i++) {
					eligibleTypei18Names [i] = AWLPropertyUtil.getTypeI18NString(context, (String) eligibleTypeList.get(i), true);
				}
				String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ProductLine.InvalidHierarchy", 
						                                      new String[]{"parentType", "childType",}, 
						                                      new String[]{parentType, FrameworkUtil.join(eligibleTypei18Names, ", ")});
				//${CLASS:emxContextUtilBase}.mqlNotice(context, strAlert);
				MqlUtil.mqlCommand(context, "notice $1", strAlert);
		    	return 1;
							
			}
			return 0;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
}
