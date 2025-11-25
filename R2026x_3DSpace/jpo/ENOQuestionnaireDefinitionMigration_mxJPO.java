import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Formatter;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.stream.Collectors;

import com.dassault_systemes.enovia.questionnaire.QuestionnaireConstants;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.domain.util.MqlUtil;


import matrix.db.Context;
import matrix.util.StringList;

public class ENOQuestionnaireDefinitionMigration_mxJPO {

    private static final Formatter formatter = new SimpleFormatter() {
        @Override
        public String format(LogRecord record) {
            ZonedDateTime zdt = ZonedDateTime.ofInstant(Instant.now(), ZoneId.systemDefault());
            String message = formatMessage(record);
            String throwable = "";
            if (record.getThrown() != null) {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                pw.println();
                record.getThrown().printStackTrace(pw);
                pw.close();
                throwable = sw.toString();
            }
            return String.format("%1$tb %1$td, %1$tY %1$tl:%1$tM:%1$tS %1$Tp %2$s: %3$s%4$s%n", zdt,
                    record.getLevel().getName(), message, throwable);
        }
    };

    private static final Logger logger = Logger.getLogger(ENOQuestionnaireDefinitionMigration_mxJPO.class.getName());
    private static final String trace = "QuestionnaireDefinitionRequiredMigration";

    public static void mxMain(Context context, String[] args) {

        init();
        try {
            validateArgs(args);
            createLogFile(args[0]);
            ContextUtil.startTransaction(context, true);
            for (Map<String, String> ctrlDoc : getObjectsToMigrate(context)) {
                setQuestionnaireDefinitionOnQuestionnaireObjects(context, ctrlDoc);
            }
            ContextUtil.commitTransaction(context);
            logger.log(Level.INFO, "Migration Completed Successfully");

        } catch (Exception e) {
            ContextUtil.abortTransaction(context);

            logger.log(Level.SEVERE, e.getMessage(), e);
            e.printStackTrace();
			/*DCLException dclException = new DCLException(e);
			dclException.setStackTrace(e.getStackTrace());
			throw dclException;*/
        }
    }

    private static void init() {
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setFormatter(formatter);

        logger.setUseParentHandlers(false);
        logger.addHandler(consoleHandler);
    }

    private static void setQuestionnaireDefinitionOnQuestionnaireObjects(Context context, Map<String, String> ctrlDoc)
            throws Exception {
        String RELATIONSHIP_QUESTIONNAIRE_DEFINITION = PropertyUtil.getSchemaProperty(context,
                QuestionnaireConstants.SYMBOLIC_RELATIONSHIP_QUESTIONNAIRE_DEFINITION);
        String ATTRIBUTE_QUESTIONNAIRE_DEFINITION = PropertyUtil.getSchemaProperty(context,
                QuestionnaireConstants.SYMBOLIC_ATTRIBUTE_QUESTIONNAIRE_DEFINITION);
        try {
            String ctrlDocId = ctrlDoc.get(DomainConstants.SELECT_ID);
            String ctrlDocName = ctrlDoc.get(DomainConstants.SELECT_NAME);
            String strQuestionnaireDefinition = ctrlDoc
                    .get("attribute[" + ATTRIBUTE_QUESTIONNAIRE_DEFINITION + "].value");
            DomainObject dObj = DomainObject.newInstance(context, ctrlDocId);
            String currentOwner = dObj.getInfo(context,DomainConstants.SELECT_OWNER);
            String currentOrganization = dObj.getInfo(context,DomainConstants.SELECT_ORGANIZATION);
            String currentProject = dObj.getInfo(context,DomainConstants.SELECT_PROJECT);
            String strRelExist = dObj.getInfo(context, "relationship[" + RELATIONSHIP_QUESTIONNAIRE_DEFINITION + "]");
            if (UIUtil.isNotNullAndNotEmpty(strRelExist) && strRelExist.equals("FALSE")) {
                String strObjectId = FrameworkUtil.autoName(context, QuestionnaireConstants.SYMBOLIC_TYPE_QUESTIONNAIRE,
						QuestionnaireConstants.SYMBOLIC_POLICY_QUESTIONNAIRE);

                if (UIUtil.isNotNullAndNotEmpty(strObjectId)) {
                    DomainObject dObject = DomainObject.newInstance(context, strObjectId);
                    dObject.setOwner(context, currentOwner);
                    MqlUtil.mqlCommand(context, true, "mod bus $1 organization $2", true, strObjectId, currentOrganization);
                    MqlUtil.mqlCommand(context, true, "mod bus $1 project $2", true, strObjectId, currentProject);
                    dObject.connectFrom(context, RELATIONSHIP_QUESTIONNAIRE_DEFINITION, dObj);
                    dObject.setState(context, QuestionnaireConstants.ACTIVE);
                    if (UIUtil.isNotNullAndNotEmpty(strQuestionnaireDefinition))
                        dObject.setAttributeValue(context, ATTRIBUTE_QUESTIONNAIRE_DEFINITION, strQuestionnaireDefinition);
                    logger.log(Level.INFO, "Migrating :   " + ctrlDocId);
                }
            }
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    private static void createLogFile(String logFilePath) throws IOException {
        DateFormat dateFormat = new SimpleDateFormat("yyyyddMMHHmmss");
        java.util.Date date = new java.util.Date();

        File logFolder = new File(logFilePath + File.separator + "Logs_" + dateFormat.format(date));
        logFolder.mkdir();
        logFolder.setWritable(true);
        logFolder.setExecutable(true);

        File logFile = new File(logFolder.getAbsolutePath() + File.separator + trace.trim() + ".log");
        logFile.setWritable(true);
        logFile.setExecutable(true);

        FileHandler fileHandler = new FileHandler(logFile.getAbsolutePath());
        fileHandler.setFormatter(formatter);

        logger.addHandler(fileHandler);
    }

    public static void help() {
        System.out.println(
                "================================================================================================\n");
        System.out.println(
                " DCL Migration For Enabling Change Control for Controlled Document is a single step process.  \n");
        System.out.println(
                " First parameter ENOQuestionnaireDefinitionMigration  = the directory where log file should be written. \n");
        System.out.println(
                " This step creates a file - ENOQuestionnaireDefinitionMigration.log having the details about all the migration. \n");
        System.out.println(" This file is created at the location provided as the first parameter. \n");
        System.out.println(" \n");
        System.out.println(" 	NOTE: DO NOT CLOSE THE MQL WINDOW UNTIL MIGRATION IS COMPLETE. \n");
        System.out.println(" \n");
        System.out.println(
                "================================================================================================\n");
    }

    public static boolean isNullOrEmpty(Object[] parameter) {
        if (parameter == null || parameter.length <= 0) {
            return true;
        }
        return false;
    }

    public static void validateArgs(String[] args) {
        logger.log(Level.INFO, "Validating input args");
        if (isNullOrEmpty(args) || args[0].equals("help") || !Paths.get(args[0]).toFile().exists()) {
            help();
        }
        logger.log(Level.INFO, "Validated input args");
    }

    public static List<Map<String, String>> getObjectsToMigrate(Context context) throws FrameworkException {
        String ATTRIBUTE_QUESTIONNAIRE_DEFINITION = PropertyUtil.getSchemaProperty(context, QuestionnaireConstants.SYMBOLIC_ATTRIBUTE_QUESTIONNAIRE_DEFINITION);
        logger.log(Level.INFO, "Fetching Objects to migrate");
        StringList selects = new StringList();
        selects.add(DomainConstants.SELECT_ID);
        selects.add(DomainConstants.SELECT_NAME);
        selects.add("attribute[" + ATTRIBUTE_QUESTIONNAIRE_DEFINITION + "].value");
        List<Map<String, String>> objectIdList = (List<Map<String, String>>) DomainObject.findObjects(context,
                PropertyUtil.getSchemaProperty(context, QuestionnaireConstants.SYMBOLIC_TYPE_CONTROLLED_DOCUMENT_TEMPLATE),
                DomainConstants.QUERY_WILDCARD, "policy=='" + PropertyUtil.getSchemaProperty(context,
                        QuestionnaireConstants.SYMBOLIC_POLICY_CONTROLLED_DOCUMENT_TEMPLATE) + "'",
                selects

        ).stream().map(map -> {
            Map<String, String> rsltMap = new HashMap<>();
            for (String select : selects) {
                rsltMap.put(select, ((Map<String, String>) map).get(select));
                rsltMap.put(select, ((Map<String, String>) map).get(select));
            }

            return rsltMap;
        }).collect(Collectors.toList());
        logger.log(Level.INFO, "Fetching complete. Total number of objects fetched : " + objectIdList.size());
        logger.log(Level.INFO, "Starting Migration");
        return objectIdList;
    }

}
