/*
 *  ${CLASSNAME}.java
 *
 * Copyright (c) 1992-2020 Dassault Systemes.
 *
 * All Rights Reserved.
 * This program contains proprietary and trade secret information of
 * MatrixOne, Inc.  Copyright notice is precautionary only and does
 * not evidence any actual or intended publication of such program.
 * static const RCSID [] = "$Id: ${CLASSNAME}.java.rca 1.21 Wed Oct 22 16:02:31 2008 przemek Experimental przemek $";
 */

import com.matrixone.apps.classification.ClassificationCacheManager;
import com.matrixone.apps.domain.util.FrameworkException;
import matrix.db.Context;

import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

//import com.dassault_systemes.enovia.classificationAttributes.util.DeleteClassificationAttributeJob;

public class emxClassificationBackgroundProcessService_mxJPO  //Classification
{
	private final XLogger _LOG  = XLoggerFactory.getXLogger(emxClassificationBackgroundProcessService_mxJPO.class);
	/**
	 * Creates ${CLASSNAME}  object
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @throws Exception if the operation fails
	 */
	public emxClassificationBackgroundProcessService_mxJPO (Context context, String[] args)
			throws Exception
	{

	}

	/**
	 * This method is executed if a specific method is not specified.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @return int
	 * @throws Exception if the operation fails
	 * @exclude
	 */
	public int mxMain(Context context, String[] args)
			throws FrameworkException
	{
		if (!context.isConnected())
			throw new FrameworkException("not supported on desktop client");
		return 0;
	}

	public void deleteAttributes(Context context, String[] args) throws Exception {
		//DeleteClassificationAttributeJob.deleteAttributes(context, args);
	}
	
	public void reloadCache(Context context, String[] args) {
		try {
            _LOG.info(String.format("Reloading Tenant Cache after modifying/deleting classification attributes"));
            ClassificationCacheManager.getInstance(context).rebuildCache(context);
        }catch (Exception e) {
            _LOG.catching(e);
        }
	}

}
