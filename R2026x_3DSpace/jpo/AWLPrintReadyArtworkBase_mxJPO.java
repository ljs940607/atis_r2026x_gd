/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.Map;

import matrix.db.BusinessObject;
import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MqlUtil;

@SuppressWarnings("PMD.SignatureDeclareThrowsException")
public class AWLPrintReadyArtworkBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = -5150349193448785671L;

	public AWLPrintReadyArtworkBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	public int checkPOAAndArtworkFileInReleasedState(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			String printReadyArtworkId = args[0];
			
			String poaId = new DomainObject(printReadyArtworkId).getInfo(context, AWLUtil.strcat("to[", AWLRel.PRINT_READY_ARTWORK.get(context), "].from.id"));

			POA poa = new POA(poaId);
			String poaState = poa.getInfo(context, SELECT_CURRENT);
			String artworkFileState = new POA(poaId).getArtworkFile(context).getInfo(context, SELECT_CURRENT);
			
	    	boolean isReleased = AWLState.RELEASE.equalsObjectState(context, AWLPolicy.POA, poaState) &&
	    						 AWLState.RELEASE.equalsObjectState(context, AWLPolicy.ARTWORK_FILE, artworkFileState);

			if(!isReleased)
			{
				String alertMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.POAArtworkFileNotReleased");
				MqlUtil.mqlCommand(context, "notice $1", alertMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/*
	 * This API added to check all condition to promote print ready artwork object from preliminary - IR-525657-3DEXPERIENCER2018x
	 */
	public int checkPrintReadyArtworkPreliminaryPromote(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			String printReadyArtworkId = args[0];
			
			int result = checkPOAAndArtworkFileInReleasedState(context, args);
			if(result==1)
				return 1;
			
			/*
			 * Condition to check PRA has files
			 */
			if("FALSE".equalsIgnoreCase(BusinessUtil.getInfo(context, printReadyArtworkId, SELECT_FORMAT_HASFILE))){
				String alertMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.PrintReadyFilesNoFiles");
				MqlUtil.mqlCommand(context, "notice $1", alertMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public void connectRevisedPrintReadyArtworkToPOA(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			String printReadyArtworkId = args[0];
			
			DomainObject currentPrintReadyArt = new DomainObject(printReadyArtworkId);
			Map mCurrentPrintReadyArtInfo = currentPrintReadyArt.getInfo(context, StringList.create(SELECT_POLICY,SELECT_LAST_ID));
			if(AWLPolicy.VERSION.get(context).equalsIgnoreCase((String)mCurrentPrintReadyArtInfo.get(SELECT_POLICY)))
				return;
			
			String lastestPrintReadyArtworkId = (String)mCurrentPrintReadyArtInfo.get(SELECT_LAST_ID);
			String SEL_REL_ID = AWLUtil.strcat("to[", AWLRel.PRINT_READY_ARTWORK.get(context), "].id");
			String SEL_POA_ID = AWLUtil.strcat("to[", AWLRel.PRINT_READY_ARTWORK.get(context), "].from.id");
			Map poaInfo = BusinessUtil.getInfo(context, printReadyArtworkId, BusinessUtil.toStringList(SEL_REL_ID,SEL_POA_ID));
			String poaId = (String) poaInfo.get(SEL_POA_ID);
			String relationshipId  = (String) poaInfo.get(SEL_REL_ID);
			
			//Connect with new Object Id.
			DomainRelationship.connect(context, poaId, AWLRel.PRINT_READY_ARTWORK.get(context), lastestPrintReadyArtworkId, true);
			
			//Disconnect the Old PRA Object Id.
			DomainRelationship.disconnect(context, relationshipId);

		} catch (Exception e) { throw new FrameworkException(e);}
	}
}

