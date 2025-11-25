
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonArrayBuilder;

import com.matrixone.enovia.bps.notifications.NotificationData;
import com.matrixone.enovia.bps.notifications.NotificationService;
import com.matrixone.enovia.bps.notifications.NotificationUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.StringUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.common.util.SubscriptionUtil;

import matrix.db.Context;
import matrix.util.StringList;
import matrix.db.TransactionParameters;

/**
 * @author agg2
 * Since 2021x FD02
 */
public class ENODocument3DNotification_mxJPO {
	private static String DASHBOARD_URL = null;
	protected static String _SERVICE_NAME = "3DDashboard";// 3DSpace/3DDashboard
	public static final String TYPE = "type";
	protected static final String TEXT = "text";
	protected static final String LINK = "link";
	protected static final String IMAGE_TEXT = "image_text";
	protected static final String LOGIN = "login";
	protected static final String SERVICE = "service";
	protected static final String URI = "uri";
	protected static final String USER_AGENT = "User Agent";
	public static String docMgmtAppKey = "ENXWDOC_AP";

	public static final String NOTIFICATION_TYPE = "NOTIF_UI";

	public static final String CONTENT_CREATED_SETTING = "bps.notification.document.event.contentcreated.setting";
	public static final String FILE_LOCKED_SETTING = "bps.notification.document.event.filelocked.setting";
	public static final String CONTENT_MODIFIED_SETTING = "bps.notification.document.event.contentmodified.setting";
	public static final String CONTENT_DELETED_SETTING = "bps.notification.document.event.contentdeleted.setting";
	public final static String DOCUMENT_NOTIFICATION_KEYPREFIX = "bps.notification.document.";
	private final static String DOCUMENT_STRING_RESOURCE_FILE = "emxNotificationsStringResource";

	private List<String> getSubscribers(Context context, String docId, String eventName) throws FrameworkException {
		List<String> toList = new ArrayList<>();
		StringList users = SubscriptionUtil.getSubscribersListByObject(context, docId, eventName, false, "object");
		Iterator<String> userIterator = users.iterator();
		while (userIterator.hasNext()) {
			String strVal = (String) userIterator.next();
			toList.add((strVal.split("\\|"))[0]);
		}
		return toList;
	}

	private Map<String, String> getDocInformation(Context context, String strDocId, String strVersionId) throws Exception {

		DomainObject domObj = new DomainObject(strDocId);
		StringList objSelects = new StringList();
		objSelects.add("physicalid");
		objSelects.add("type");
		objSelects.add("name");
		objSelects.add("revision");
		objSelects.add("attribute[Title]");

		Map docInfo = domObj.getInfo(context, objSelects);
		String strDocPhysicalId = (String) docInfo.get("physicalid");
		String strDocType = (String) docInfo.get("type");
		String strDocName = (String) docInfo.get("name");
		String strDocRev = (String) docInfo.get("revision");

		StringBuilder sbWhere = new StringBuilder();
		sbWhere.append(strDocType + " " + strDocName + " " + strDocRev);

		DomainObject domVersionObj = new DomainObject(strVersionId);
		Map versionObjInfo = domVersionObj.getInfo(context, objSelects);

		Map<String, String> mapDocInfo = new HashMap<>();
		mapDocInfo.put("DOCNAME", sbWhere.toString());
		mapDocInfo.put("docId", strDocPhysicalId);
		mapDocInfo.put("FILENAME", (String) versionObjInfo.get("attribute[Title]"));
		return mapDocInfo;
	}
	
	public void send3DNotificationOnDocumentUnlock(Context context, String[] args) throws Exception {
		if (UIUtil.isNullOrEmpty(args[0])) {
			return;
		}
		System.out.println("ENODocument3DNotification: send3DNotificationOnDocumentUnlock strDocId " + args[0]);
		System.out.println("ENODocument3DNotification: send3DNotificationOnDocumentUnlock strVersionId " + args[1]);
		System.out.println("ENODocument3DNotification: send3DNotificationOnDocumentUnlock strLockerName " + args[2]);
		
		String strDocId = args[0];
		String strVersionId = args[1];
		String strLockerName = args[2];		
		
		List<String> toList = new ArrayList<>();		
		toList.add(strLockerName);
		
		Map<String, String> docInfoMap = getDocInformation(context, strDocId, strVersionId);
				
		NotificationData notificationData = new NotificationData();
		notificationData.setNotificationType(NOTIFICATION_TYPE);
		notificationData.setToList(toList);
		notificationData.setNotificationSetting(FILE_LOCKED_SETTING);
		notificationData.setNotificationNLSKeyPrefix(DOCUMENT_NOTIFICATION_KEYPREFIX);
		notificationData.setNotificationStringResourceFile(DOCUMENT_STRING_RESOURCE_FILE);
		
		this.setNotificationContentForUnlockDocument(context, notificationData, docInfoMap);
		this.setMailContentsForUnlockDocument(context, notificationData, docInfoMap);
		notificationData.setPlatformID(getTenant(context));
		notificationData.setAppID(docMgmtAppKey);
		NotificationUtil.send3DNotification(context, notificationData);
	}

	public void send3DNotificationContentAddded(Context context, String[] args) throws Exception {
		if (UIUtil.isNullOrEmpty(args[0])) {
			return;
		}
		String strDocId = args[0];
		String strVersionId = args[1];
		String strEventName = args[2];

		List<String> toList = new ArrayList<>();
		toList.addAll(getSubscribers(context, strDocId, "Content Added"));
		toList.remove(context.getUser());	
		Map<String, String> docInfoMap = getDocInformation(context, strDocId, strVersionId);

		NotificationData notificationData = new NotificationData();
		notificationData.setNotificationType(NOTIFICATION_TYPE);
		notificationData.setToList(toList);
		notificationData.setNotificationSetting(CONTENT_CREATED_SETTING);
		notificationData.setNotificationNLSKeyPrefix(DOCUMENT_NOTIFICATION_KEYPREFIX);
		notificationData.setNotificationStringResourceFile(DOCUMENT_STRING_RESOURCE_FILE);

		this.setNotificationContentForConetentCreated(context, notificationData, docInfoMap);
		this.setMailContentsForConetentCreated(context, notificationData, docInfoMap);
		notificationData.setPlatformID(getTenant(context));
		notificationData.setAppID(docMgmtAppKey);
		NotificationUtil.send3DNotification(context, notificationData);
	}
	
	protected void setNotificationContentForUnlockDocument(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {
		notificationData.setFromUserName(context.getUser());
		HashMap<String, String> notificationMsgKeysNValues = new HashMap<>();
		String notificationMessage = null;
		notificationMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		notificationMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));
		notificationMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		notificationMessage = "bps.notification.document.filelocked.msg";
		
		notificationData.setNotificationMessageAndKeysValues(notificationMessage, notificationMsgKeysNValues);		
		notificationData.setNotificationURI(getDocumentDashboardURL(context, docInfoMap.get("docId")));
		notificationData.setNotificationService(_SERVICE_NAME);
	}
	
	protected void setNotificationContentForConetentCreated(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {
		notificationData.setFromUserName(context.getUser());
		HashMap<String, String> notificationMsgKeysNValues = new HashMap<>();
		String notificationMessage = null;
		notificationMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		notificationMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));
		notificationMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		notificationMessage = "bps.notification.document.contentcreated.msg";

		notificationData.setNotificationMessageAndKeysValues(notificationMessage, notificationMsgKeysNValues);
		notificationData.setNotificationURI(getDocumentDashboardURL(context, (String) docInfoMap.get("docId")));
		notificationData.setNotificationService(_SERVICE_NAME);
	}

	protected void setMailContentsForUnlockDocument(Context context, NotificationData notificationData, Map<String, String> docInfoMap){
		
		HashMap<String, String> subjectMsgKeysNValues = new HashMap<>();
		subjectMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));

		notificationData.setMailSubjectAndKeysValues("bps.notification.document.filelocked.mail.subject", subjectMsgKeysNValues);

		LinkedList<String> mailContentMsgList = new LinkedList<>();
		mailContentMsgList.add("bps.notification.document.filelocked.mail.msg1");

		LinkedList<String> mailContentMsgType = new LinkedList<>();
		mailContentMsgType.add(IMAGE_TEXT);// 1
		mailContentMsgType.add(LINK);// 2
		mailContentMsgType.add(TEXT);// 3
		mailContentMsgType.add(LINK);// 4
		mailContentMsgType.add(TEXT);// 5

		HashMap<String, String> contentMsgKeysNValues = new HashMap<>();
		contentMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		contentMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		contentMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));

		HashMap<String, HashMap<String, String>> mailContentMsgKeysMap = new HashMap<>();
		mailContentMsgKeysMap.put("bps.notification.document.filelocked.mail.msg1", contentMsgKeysNValues);
		notificationData.setMailContentAndKeysValues(mailContentMsgList, mailContentMsgType, mailContentMsgKeysMap);
	}
	
	protected void setMailContentsForConetentCreated(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {

		HashMap<String, String> subjectMsgKeysNValues = new HashMap<>();
		subjectMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));

		notificationData.setMailSubjectAndKeysValues("bps.notification.document.contentcreated.mail.subject", subjectMsgKeysNValues);
		
		LinkedList<String> mailContentMsgList = new LinkedList<>();
		mailContentMsgList.add("bps.notification.document.contentcreated.mail.msg1");
		mailContentMsgList.add("bps.notification.document.contentcreated.endmail.msg");

		LinkedList<String> mailContentMsgType = new LinkedList<>();
		mailContentMsgType.add(IMAGE_TEXT);// 1
		mailContentMsgType.add(LINK);// 2
		mailContentMsgType.add(TEXT);// 3
		mailContentMsgType.add(LINK);// 4
		mailContentMsgType.add(TEXT);// 5

		HashMap<String, String> contentMsgKeysNValues = new HashMap<>();
		contentMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		contentMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		contentMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));

		HashMap<String, HashMap<String, String>> mailContentMsgKeysMap = new HashMap<>();

		mailContentMsgKeysMap.put("bps.notification.document.contentcreated.mail.msg1", contentMsgKeysNValues);

		mailContentMsgKeysMap.put("bps.notification.document.contentcreated.endmail.msg", contentMsgKeysNValues);

		notificationData.setMailContentAndKeysValues(mailContentMsgList, mailContentMsgType, mailContentMsgKeysMap);
	}

	public void send3DNotificationContentModified(Context context, String[] args) throws Exception {
		if (UIUtil.isNullOrEmpty(args[0])) {
			return;
		}
		String strDocId = args[0];
		String strVersionId = args[1];
		String strEventName = args[2];

		List<String> toList = new ArrayList<>();
		toList.addAll(getSubscribers(context, strDocId, "Content Modified"));
		toList.remove(context.getUser());
		Map<String, String> docInfoMap = getDocInformation(context, strDocId, strVersionId);

		NotificationData notificationData = new NotificationData();
		notificationData.setNotificationType(NOTIFICATION_TYPE);
		notificationData.setToList(toList);
		notificationData.setNotificationSetting(CONTENT_MODIFIED_SETTING);
		notificationData.setNotificationNLSKeyPrefix(DOCUMENT_NOTIFICATION_KEYPREFIX);
		notificationData.setNotificationStringResourceFile(DOCUMENT_STRING_RESOURCE_FILE);

		this.setNotificationContentForConetentModified(context, notificationData, docInfoMap);
		this.setMailContentsForConetentModified(context, notificationData, docInfoMap);
		notificationData.setPlatformID(getTenant(context));
		notificationData.setAppID(docMgmtAppKey);
		NotificationUtil.send3DNotification(context, notificationData);

	}

	protected void setNotificationContentForConetentModified(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {
		notificationData.setFromUserName(context.getUser());
		HashMap<String, String> notificationMsgKeysNValues = new HashMap<>();
		String notificationMessage = null;
		notificationMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		notificationMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));
		notificationMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		notificationMessage = "bps.notification.document.contentmodified.msg";

		notificationData.setNotificationMessageAndKeysValues(notificationMessage, notificationMsgKeysNValues);
		notificationData.setNotificationURI(getDocumentDashboardURL(context, (String) docInfoMap.get("docId")));
		notificationData.setNotificationService(_SERVICE_NAME);
	}

	protected void setMailContentsForConetentModified(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {

		HashMap<String, String> subjectMsgKeysNValues = new HashMap<>();
		subjectMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));

		notificationData.setMailSubjectAndKeysValues("bps.notification.document.contentmodified.mail.subject", subjectMsgKeysNValues);

		LinkedList<String> mailContentMsgList = new LinkedList<>();
		mailContentMsgList.add("bps.notification.document.contentmodified.mail.msg1");
		mailContentMsgList.add("bps.notification.document.contentcreated.endmail.msg");

		LinkedList<String> mailContentMsgType = new LinkedList<>();
		mailContentMsgType.add(IMAGE_TEXT);// 1
		mailContentMsgType.add(LINK);// 2
		mailContentMsgType.add(TEXT);// 3
		mailContentMsgType.add(LINK);// 4
		mailContentMsgType.add(TEXT);// 5

		HashMap<String, String> contentMsgKeysNValues = new HashMap<>();
		contentMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		contentMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, context.getUser()));
		contentMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));

		HashMap<String, HashMap<String, String>> mailContentMsgKeysMap = new HashMap<>();

		mailContentMsgKeysMap.put("bps.notification.document.contentmodified.mail.msg1", contentMsgKeysNValues);

		mailContentMsgKeysMap.put("bps.notification.document.contentcreated.endmail.msg", contentMsgKeysNValues);

		notificationData.setMailContentAndKeysValues(mailContentMsgList, mailContentMsgType, mailContentMsgKeysMap);

	}

	public void send3DNotificationContentDeleted(Context context, String[] args) throws Exception {
    TransactionParameters params = context.getTransactionParams();
    String CURRENTUSER = params.getData().get("CURRENTUSER");
    String hasModifyAccessStr = params.getData().get("hasModifyAccess");
    boolean retrievedHasModifyAccess = true;
    String EventPublishing = context.getCustomData("EventPublishing");
    
    // check - to not send notification if Document is deleted
    if ("false".equals(EventPublishing)) {
        return;
    }

    if (!UIUtil.isNullOrEmpty(hasModifyAccessStr)) {
        retrievedHasModifyAccess = Boolean.parseBoolean(hasModifyAccessStr);
    }

    if (retrievedHasModifyAccess) {
        if (UIUtil.isNullOrEmpty(args[0])) {
            return;
        }

        String strDocId = args[0];
        String strVersionId = args[1];
        String strEventName = args[2];
        List<String> toList = new ArrayList<>();
        toList.addAll(getSubscribers(context, strDocId, "Content Deleted"));
        toList.remove(CURRENTUSER);

        Map<String, String> docInfoMap = getDocInformation(context, strDocId, strVersionId);
        NotificationData notificationData = new NotificationData();
        notificationData.setNotificationType(NOTIFICATION_TYPE);
        notificationData.setToList(toList);
        notificationData.setNotificationSetting(CONTENT_DELETED_SETTING);
        notificationData.setNotificationNLSKeyPrefix(DOCUMENT_NOTIFICATION_KEYPREFIX);
        notificationData.setNotificationStringResourceFile(DOCUMENT_STRING_RESOURCE_FILE);

        this.setNotificationContentForConetentDeleted(context, notificationData, docInfoMap);
        this.setMailContentsForConetentDeleted(context, notificationData, docInfoMap);

        notificationData.setPlatformID(getTenant(context));
        notificationData.setAppID(docMgmtAppKey);
        NotificationUtil.send3DNotification(context, notificationData);
    }
}

	protected void setNotificationContentForConetentDeleted(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {
		TransactionParameters params = context.getTransactionParams();
		String CURRENTUSER=params.getData().get("CURRENTUSER");
		notificationData.setFromUserName(context.getUser());
		HashMap<String, String> notificationMsgKeysNValues = new HashMap<>();
		String notificationMessage = null;
		notificationMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, CURRENTUSER));
		notificationMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME"));
		notificationMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		notificationMessage = "bps.notification.document.contentdeleted.msg";

		notificationData.setNotificationMessageAndKeysValues(notificationMessage, notificationMsgKeysNValues);
		notificationData.setNotificationURI(getDocumentDashboardURL(context, (String) docInfoMap.get("docId")));
		notificationData.setNotificationService(_SERVICE_NAME);
	}

	protected void setMailContentsForConetentDeleted(Context context, NotificationData notificationData, Map<String, String> docInfoMap) {
		TransactionParameters params = context.getTransactionParams();
		String CURRENTUSER=params.getData().get("CURRENTUSER");
		HashMap<String, String> subjectMsgKeysNValues = new HashMap<>();
		subjectMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));

		notificationData.setMailSubjectAndKeysValues("bps.notification.document.contentdeleted.mail.subject", subjectMsgKeysNValues);

		LinkedList<String> mailContentMsgList = new LinkedList<>();
		mailContentMsgList.add("bps.notification.document.contentdeleted.mail.msg1");
		mailContentMsgList.add("bps.notification.document.contentcreated.endmail.msg");

		LinkedList<String> mailContentMsgType = new LinkedList<>();
		mailContentMsgType.add(IMAGE_TEXT);// 1
		mailContentMsgType.add(LINK);// 2
		mailContentMsgType.add(TEXT);// 3
		mailContentMsgType.add(LINK);// 4
		mailContentMsgType.add(TEXT);// 5

		HashMap<String, String> contentMsgKeysNValues = new HashMap<>();
		contentMsgKeysNValues.put("DOCNAME", (String) docInfoMap.get("DOCNAME"));
		contentMsgKeysNValues.put("PERSONNAME", getPersonDisplayName(context, CURRENTUSER)); 
		contentMsgKeysNValues.put("FILENAME", (String) docInfoMap.get("FILENAME")); 

		HashMap<String, HashMap<String, String>> mailContentMsgKeysMap = new HashMap<>();

		mailContentMsgKeysMap.put("bps.notification.document.contentdeleted.mail.msg1", contentMsgKeysNValues);

		mailContentMsgKeysMap.put("bps.notification.document.contentcreated.endmail.msg", contentMsgKeysNValues);

		notificationData.setMailContentAndKeysValues(mailContentMsgList, mailContentMsgType, mailContentMsgKeysMap);

	}

	private String getPersonDisplayName(Context context, String strPersonName) {
		String returnName = strPersonName;
		try {
			returnName = PersonUtil.getFullName(context, strPersonName);
		} catch (Exception e) {
		}
		return returnName;
	}

	private static String getTenant(Context context) {
		String tenant = context.getTenant();
		if (tenant == null || tenant.isEmpty()) {
			tenant = "OnPremise";
		}
		return tenant;
	}

	protected static String getDocumentDashboardURL(Context context, String strDocId) {
		String PROTOCOL = "3DXContent";
		String _SERVICE_NAME = "3DDashboard";

		String uri = "/#app:" + docMgmtAppKey + "/content:X3DContentId=";
		JsonObjectBuilder a3DXContent = Json.createObjectBuilder();
		{
			a3DXContent.add("protocol", PROTOCOL);
			a3DXContent.add("version", "");
			a3DXContent.add("source", docMgmtAppKey);
			a3DXContent.add("widgetId", "");
			JsonObjectBuilder a3DXContentData = Json.createObjectBuilder();
			{
				JsonArrayBuilder a3DXContentDataItems = Json.createArrayBuilder();
				{
					JsonObjectBuilder a3DXContentDataItem = Json.createObjectBuilder();
					{
						a3DXContentDataItem.add("envId", getTenant(context));
						a3DXContentDataItem.add("serviceId", _SERVICE_NAME);
						a3DXContentDataItem.add("objectId", strDocId);
						a3DXContentDataItem.add("objectType", "Document");
					}
					a3DXContentDataItems.add(a3DXContentDataItem);
				}
				a3DXContentData.add("items", a3DXContentDataItems);
			}
			a3DXContent.add("data", a3DXContentData);
		}

		String variability = a3DXContent.build().toString();

		uri = uri + com.matrixone.apps.domain.util.XSSUtil.encodeForURL(variability);
		uri = uri.replace("+", "%20");
		
		// No need to append dashboar url : IR-1211918-3DEXPERIENCER2024x
		//NotificationService service = new NotificationService(context);
		//uri = service.get3DDashboardURL() + uri;
		
		return uri;

	}

}
