/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/


import java.util.List;
import java.util.Map;

import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

@SuppressWarnings({"PMD.SignatureDeclareThrowsException","PMD.TooManyMethods"})
public class AWLWidgetUtilBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = 3555644572564849799L;
	
	public AWLWidgetUtilBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	
	public MapList getMyArtworkPackageMasterCopyStatus(Context context, String[] args) throws FrameworkException {
		return getMyArtworkPackageArtworkElementStatus(context, args, true);
	}
	
	public MapList getMyArtworkPackageLocalCopyStatus(Context context, String[] args) throws FrameworkException {
		return getMyArtworkPackageArtworkElementStatus(context, args, false);
	}
	
	public MapList getMyArtworkPackagePOAStatus(Context context, String[] args) throws FrameworkException {
		try {
	        if (args == null || args.length < 1) {
	            throw (new IllegalArgumentException());
	        }
	        Map<String, Object> map = (Map<String, Object>) JPO.unpackArgs(args);
	        MapList ml = (MapList) map.get("JPO_WIDGET_DATA");
	        String fieldKey = (String) map.get("JPO_WIDGET_FIELD_KEY");
	        StringList ids = BusinessUtil.getIdList(ml);
	        StringList values = new StringList(ids.size());
			for (String apID : (List<String>)ids) {
				ArtworkPackage ap = new ArtworkPackage(apID);
				MapList poas = ap.getAllPOAMapList(context, new StringList(SELECT_CURRENT));
				values.add(processArtworkPackageContent(context, poas));				
			}
			updateMapListWithFieldData(context, ml, fieldKey, values);
			return ml;
		} catch (Exception e) {throw new FrameworkException(e);}	
	}
	
	private MapList getMyArtworkPackageArtworkElementStatus(Context context, String[] args, boolean showBaseCopyStatus) 
	throws FrameworkException {
		try {
	        if (args == null || args.length < 1) {
	            throw (new IllegalArgumentException());
	        }
	        
	        Map<String, Object> map = (Map<String, Object>) JPO.unpackArgs(args);
	        MapList ml = (MapList) map.get("JPO_WIDGET_DATA");
	        String fieldKey = (String) map.get("JPO_WIDGET_FIELD_KEY");
	        StringList ids = BusinessUtil.getIdList(ml);
	        StringList values = new StringList(ids.size());
			for (String apID : (List<String>)ids) {
				ArtworkPackage ap = new ArtworkPackage(apID);
				MapList elemetns = ap.getArtworkPackageContent(context, new StringList(SELECT_CURRENT), showBaseCopyStatus);
			    values.add(processArtworkPackageContent(context, elemetns));
			}
			updateMapListWithFieldData(context, ml, fieldKey, values);
			return ml;
		} catch (Exception e) {throw new FrameworkException(e);}
	}

    private String processArtworkPackageContent(Context context, MapList artworkPackageConent) 
	throws FrameworkException {
		try {
			Map<String, MapList> byState = BusinessUtil.groupByKey(artworkPackageConent, SELECT_CURRENT);
			int total = artworkPackageConent.size();
			int inRelease = byState.get(AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT)) != null ?
					        byState.get(AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT)).size() : 0;
			    
			return getPercentString(context, inRelease, total);
		} catch (Exception e) {throw new FrameworkException(e);}
	} 	
	
	
	private void updateMapListWithFieldData(Context context, MapList ml, String fieldKey, StringList values) {
		for (int i = 0; i < ml.size(); i++) {
			((Map) ml.get(i)).put(fieldKey, values.get(i));
		}
	}
	
	private String getPercentString(Context context, int value, int total) {
		return  total == 0 ? "0" + "% (" + value + " of " + total + ")" :
				((int) ( ( value * 100 ) / total ) ) + "% (" + value + " of " + total + ")" ;
	}
}
