/*
 *  emxCPDCountry.java
    This JPO is added for manage country functionality.
 *
 */

import matrix.db.Context;


/**
 * @version CPG V6R2011x - Copyright (c) 2010, MatrixOne, Inc.
 */
 @SuppressWarnings({"PMD.SignatureDeclareThrowsException"})
public class emxCPDCountry_mxJPO extends emxCPDCountryBase_mxJPO
{

    /**
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @throws Exception if the operation fails
     * @since CPG V6R2011x
     * @grade 0
     */
    public emxCPDCountry_mxJPO (Context context, String[] args)
        throws Exception
    {
      super(context, args);
    }

}
