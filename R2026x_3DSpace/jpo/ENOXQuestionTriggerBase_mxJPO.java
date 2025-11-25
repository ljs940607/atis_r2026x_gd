import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.RelationshipType;
import matrix.util.StringList;

import com.dassault_systemes.enovia.questionnaire.QuestionnaireConstants;
import com.dassault_systemes.enovia.questionnaire.kernel.Questionnaire;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.DomainSymbolicConstants;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

public class ENOXQuestionTriggerBase_mxJPO {

	public int checkConnectedTemplateStateObsolete(Context context, String args[]) throws Exception {
		try {
			Questionnaire.checkConnectedTemplateStateObsolete(context, args);
		} catch (Exception e) {
			throw new Exception(e.getLocalizedMessage());
		}
		return 0;
	}

	public void promotePreviousRevisionToObsolete(Context context, String[] args) throws Exception {
		try {
			String strObjectId = args[0];
			if (UIUtil.isNotNullAndNotEmpty(strObjectId)) {
				Questionnaire.promotePreviousRevisionToObsolete(context, strObjectId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

	}

	
	public void updateQuestionnaireDefinition(Context context, String[] args) throws Exception {
		try {
			String strObjectId = args[0];
			if (UIUtil.isNotNullAndNotEmpty(strObjectId)) {
				Questionnaire.updateQuestionnaireDefinition(context, strObjectId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

	}

}


