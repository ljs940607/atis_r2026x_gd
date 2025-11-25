/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.List;

import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.CA;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.util.AWLECMUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

public class AWLECMChangeActionBase_mxJPO extends AWLObject_mxJPO//${CLASS:enoECMChangeAction}
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * Constructor
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLECMChangeActionBase_mxJPO(Context context, String[] args) throws Exception {
				super(context, args);
			}

	/**
	* This method will check if the Question configured  is answered in Change Action   
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.
	* @since   AWL 2015x
	* @author  Aman Gupta(AGA2)
	@deprecated in HF5 because of Questionnaire improvements ( questions on CO)
	*/
	
	
	
	public int isQuestionAnsweredInChangeAction(Context context,String[] args)throws FrameworkException
	{
		return 0;
	}
	
	
	
	/**
	* It starts the Change Action attached Route.   
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.
	* @since   AWL 2015x
	* @author  Aman Gupta(AGA2)
	@deprecated in HF5 because of Questionnaire improvements ( questions on CO)
	*/
	public void startChangeActionRoute(Context context, String [] args) throws FrameworkException
	{
		return;
	}
	
	
	
	/**
	 * Creates the "Change Action" Routes from the Questionnaire inputs. 
	 * @param   context
	 * @param   args
	 * @throws  FrameworkException - when args size is zero.
	 * @since   AWL 2015x
	 * @author  Aman Gupta (AGA2)
	 * Created during "Enterprise Change Management" Highlight. 
	 @deprecated in HF5 because of Questionnaire improvements ( questions on CO)
	 */
	public void createChangeActionRouteFromQuestionnaire(Context context, String args[]) throws FrameworkException 
	{
		return;
	}

	
	/**
	 * If Promotion of "Change Action" fails for the below condition then shows the appropriate message.
	 * Condition Checks ==> On Promotion of Change Action to "In Work" it Promotes connected POAs to "Artwork In Progress" State 
	 * @param   context
	 * @param   args
	 * @throws  FrameworkException - when args size is zero.
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight. 
	 */
	public void actionChangeActionPromoteInWorkState(Context context, String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			//Get the Connected POA and Promote it to "Artwork In Progress" State. 
			String objectId=args[0];
			CA ca = new CA(context, objectId);

			if(new AWLECMUtil().doValidateChangeAction(context,objectId )) {

				MapList poaMapList = ca.getProposedPOAsForRelease(context);

				if(BusinessUtil.isNullOrEmpty(poaMapList))
					return;

				StringList poaIdList = BusinessUtil.toStringList( poaMapList, DomainConstants.SELECT_ID );

				for (String poaId :(List<String>)poaIdList) 
				{
					new POA(poaId).setState(context, AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA));
				}
			}
		} catch (Exception e) { 
			e.printStackTrace();
			throw new FrameworkException(e);}
	}
	
}

