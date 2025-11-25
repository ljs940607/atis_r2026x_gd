/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import matrix.db.Context;


@SuppressWarnings("serial")
public class AWLArtworkTaskUI_mxJPO extends AWLArtworkTaskUIBase_mxJPO {

	/**
    *
    * @param context the eMatrix <code>Context</code> object
    * @param args holds no arguments
    * @throws Exception if the operation fails
    * @since AEF
    * @grade 0
    */
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
   public AWLArtworkTaskUI_mxJPO (Context context, String[] args)
       throws Exception
   {
     super(context, args);
   }
}
