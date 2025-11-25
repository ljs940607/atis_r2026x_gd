/*
 * ${CLASSNAME}.java
 * program for ownership migration.
 *
 * Copyright (c) 1992-2024 Dassault Systemes.
 *
 * All Rights Reserved.
 * This program contains proprietary and trade secret information of
 * MatrixOne, Inc.  Copyright notice is precautionary only and does
 * not evidence any actual or intended publication of such program.
 *
 */

import matrix.db.Context;

import com.matrixone.apps.domain.DomainAccess;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.DebugUtil;

public class emxProjectManagementUtilBase_mxJPO extends emxDomainObject_mxJPO
{

    public emxProjectManagementUtilBase_mxJPO(Context context, String[] args)
            throws Exception {
        super(context, args);
    }

    /**
     * When we want to delete a task we are calling mql here since this JPO
     * is created as a User Agent JPO.  No access will need to be checked so
     * performance is faster and the history record will have the users name.
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds the following input arguments:
     *        0 - String taskId - id of the Task to delete
     * @throws Exception if operation fails
     */
    public void deleteTasks(Context context, String[] args)
            throws Exception
    {
        // get values from args.
        String taskId = args[0];
        String delMqlCommand    = "delete bus $1";

        try {
            MqlUtil.mqlCommand(context, false, false, delMqlCommand, false, taskId);
        }
		catch (Exception e)
        {
            DebugUtil.debug("Exception ProjectManagementUtil deleteTasks - ", e.getMessage());
            throw e;
		}
	}
}
