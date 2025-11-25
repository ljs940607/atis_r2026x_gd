<%@ page import="com.matrixone.apps.domain.util.FrameworkUtil" %>
<%@ page import="com.matrixone.servlet.Framework" %>
<%@ page import="matrix.db.Context" %>
<%@ page import="com.matrixone.apps.domain.util.XSSUtil" %>
<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="cache-control" content="no-cache"/> <!-- To be removed in production code-->
    <meta http-equiv="pragma" content="no-cache"/>  <!-- To be removed in production code -->

    <meta charset="utf-8">

    <link rel="stylesheet" href="../webapps/ENOQuestionaireUX/styles/questionnaire.css"/>
	<link rel="stylesheet" href="../webapps/ENOQuestionaireUX/ENOQuestionaireUX.css"/>
    <link rel="stylesheet" href="../webapps/UIKIT/UIKIT.css"/>

    <script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
    <script type="text/javascript" src="../webapps/UIKIT/UIKIT.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
    <script type="text/javascript" src="../webapps/PlatformAPI/PlatformAPI.js"></script>
    <script type="text/javascript" src="../webapps/c/UWA/js/UWA_W3C_Alone.js"></script>
    <script type="text/javascript" src="../webapps/WebappsUtils/WebappsUtils.js"></script>
    <script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
    <script type="text/javascript" src="../webapps/ENOQuestionaireUX/scripts/DocumentQuestionnaire.js"></script>
    <script type="text/javascript" src="../webapps/ENOQuestionaireUX/scripts/Question.js"></script>
    <script type="text/javascript" src="../webapps/ENOQuestionaireUX/scripts/TreeNode.js"></script>
    <script type="text/javascript" src="../webapps/ENOQuestionaireUX/scripts/QuestionnaireUtil.js"></script>


    <%
        Context context = Framework.getFrameContext(session);
        String objectId = request.getParameter("objectId");
        String mode = request.getParameter("mode");
        String templateId = request.getParameter("templateId");
        String servletPath = request.getContextPath();
		String questionnaireId = request.getParameter("questionnaireId");
        String contextObjectType = "";
        if(templateId != null && templateId != "") {
            contextObjectType = "Controlled Document Template";
        }

    %>


</head>
<body>
<div id='mainContainer'></div>

<script>

    define('DS/ENOQuestionaireUX/scripts/view/SubmitDocumentQuestionnaire',
        [],
        function () {
            return {
                submitResponseForTemplateQuestionnaire : function (questionsInDisplay, questionnaireId ) {

                    let url = " ../documentcontrol/enoDCLExecute.jsp?dclAction=ENODCLTemplateUI:saveTemplateQuestionnaire&validateToken=false";


                    function createHiddenInputElement(name, value) {
                        const input = document.createElement("input");
                        input.setAttribute("name", name);
                        input.setAttribute("type", "hidden");
                        input.setAttribute("value", value);
                        return input;
                    }

                    function createForm(actionURL, method) {
                        var form = document.createElement("form");
                        var element1 = document.createElement("input");
                        var element2 = document.createElement("input");

                        form.method = method || "POST";
                        form.action = actionURL;

                        document.body.appendChild(form);

                        return form;
                    }

                    const nidAnswerIdPairs =
                        questionsInDisplay
                        .map(ques => ques.nid + ":" + ques.answerId + ":" + ques.classificationQuestion)
                        .join("|");
                    const relatedDataIds = questionsInDisplay
                        .filter(ques => ques.relatedDataNodes.length !== 0)
                        .flatMap(ques => ques.relatedDataNodes)
                        .map(relNode => relNode.linkId)
                        .join("|");
                    let form = createForm(url);
                    form.appendChild(createHiddenInputElement("questionnaireNodes", nidAnswerIdPairs));
                    form.appendChild(createHiddenInputElement("templateId", "<%=templateId%>"));
                    form.appendChild(createHiddenInputElement("relatedDataIds", relatedDataIds));
                    form.appendChild(createHiddenInputElement("qsdObjId","<%=objectId%>"));
                    form.appendChild(createHiddenInputElement("questionnaireId", questionnaireId));
                    form.submit();

                },
                submitResponse : function (questionsInDisplay, questionnaireId) {

                    let url = " ../common/emxCreate.jsp?" +
                        "type=type_QualitySystemDocument" +
                        "&createJPO=ENODCDocument:createDocument" +
                        "&preProcessJavaScript=makeSMERequired" +
                        "&submitAction=doNothing" +
                        "&autoNameChecked=true" +
                        "&DCMode=createdocument" +
                        "&suiteKey=DocumentControl" +
                        "&StringResourceFileId=enoDocumentControlStringResource" +
                        "&SuiteDirectory=documentcontrol" +
                        "&addToCallerFrame=ForCheckinPage" +
                        "&preProcessJavaScript=makeSMERequired";


                    const cdtRelNode = questionsInDisplay
                        .filter(ques => ques.relatedDataNodes.length !== 0)
                        .flatMap(ques => ques.relatedDataNodes)
                        .find(relNode => relNode.relatedDataObject.type === "Controlled Document Template");


                    if (cdtRelNode) {
                        url = url + "&selTemplateId=" + cdtRelNode.relatedDataObject.objectId;
                        url = url + "&form=DCLCreateDocumentFromTemplate";
                        url = url + "&header=enoDocumentControl.Command.CreateDocumentFromTemplate";
                        url = url + "&subHeader=" + cdtRelNode.relatedDataObject.name;
                        url = url + "&helpMarker=emxhelpcreatedocfromtemplate";
                        url = url + "&callledFor=connectTemplatetoDocument";
                        url = url + "&postProcessURL=../documentcontrol/enoDCLExecute.jsp?dclAction=ENODCLAdminActions:createDocumentFromTemplatePostProcess";
                    } else {
                        url = url + "&form=DCLCreateControlledDocument";
                        url = url + "&header=enoDocumentCommon.Label.CreateNewDocument";
                        url = url + "&helpMarker=emxhelpcreatequalitysysdoc";
                        url = url + "&mode=create";
                        url = url + "&postProcessURL=../documentcommon/enoDCExecute.jsp?dcAction=ENODCDocument:createDocumentPostProcess";
                    }

                    function createHiddenInputElement(name, value) {
                        const input = document.createElement("input");
                        input.setAttribute("name", name);
                        input.setAttribute("type", "hidden");
                        input.setAttribute("value", value);
                        return input;
                    }

                    function createForm(actionURL, method) {
                        var form = document.createElement("form");
                        var element1 = document.createElement("input");
                        var element2 = document.createElement("input");

                        form.method = method || "POST";
                        form.action = actionURL;

                        document.body.appendChild(form);

                        return form;
                    }

                    const nidAnswerIdPairs =
                        questionsInDisplay
                            .map(ques => ques.nid + ":" + ques.answerId + ":" + ques.classificationQuestion)
                            .join("|");
                    const relatedDataIds = questionsInDisplay
                        .filter(ques => ques.relatedDataNodes.length !== 0)
                        .flatMap(ques => ques.relatedDataNodes)
                        .map(relNode => relNode.linkId)
                        .join("|");
                    let form = createForm(url);
                    form.appendChild(createHiddenInputElement("questionnaireNodes", nidAnswerIdPairs));
                    form.appendChild(createHiddenInputElement("questionnaireId", questionnaireId));
                    form.appendChild(createHiddenInputElement("relatedDataIds", relatedDataIds));
                    form.submit();

                }
            }
        });
    require([
            'DS/ENOQuestionaireUX/scripts/DocumentQuestionnaire',
            'DS/UIKIT/Alert',
            'i18n!DS/ENOQuestionaireUX/assets/nls/Questionnaire',
        ],
        function (Questionnaire, Alert, QS_NLS) {

            const myAppsURL = "<%=FrameworkUtil.getMyAppsURL(context, request, response)%>";
            const contextPath = "<%=servletPath%>";
            const mode = "<%=mode%>";

            var data = {
                "objectId": "<%=objectId%>",
                "mcsurl": myAppsURL
            };
            data = JSON.stringify(data);


            const curTenant = <%= !FrameworkUtil.isOnPremise(context) ?  XSSUtil.encodeForJavaScript(context, context.getTenant()) : null %>;

            const validateResponse = function (questionsInDisplay) {

                const unAnswered = questionsInDisplay.find(ques => !ques.answered);

                //const unCommented = questionsInDisplay.filter(ques => ques.isCommentsRequired).find(ques => !ques.comment);

                const attributeResponseMap =
                    questionsInDisplay
                        .filter(question => question.answered)
                        .filter(question => question.attributeName)
                        .reduce(
                            (grp, ques) => {
                                (grp[ques.attributeName] = grp[ques.attributeName] || []).push(ques);
                                return grp;
                            },
                            {}
                        );

                const hasAttributesWithConflictingAnswers =
                    Object
                        .values(attributeResponseMap)
                        .filter(questions => questions.length > 1)
                        .map(questions => [...questions])
                        .map(questions =>
                            questions.map(question => JSON.parse(JSON.stringify(question))).map(question => {
                                question.answers =
                                    question.answers
                                        .reduce(
                                            (obj, ans) => {
                                                obj[ans.id] = ans;
                                                return obj;
                                            },
                                            {}
                                        );
                                return question;
                            })
                        )
                        .filter(questions => questions.slice(1).some(ques => ques.answers[ques.answerId].answer !== questions[0].answers[questions[0].answerId].answer))
                        .filter(questions => questions.length > 0).length > 0;

                const differentCDTs = !questionsInDisplay
                    .filter(ques => ques.relatedDataNodes.length !== 0)
                    .flatMap(ques => ques.relatedDataNodes)
                    .filter(relNode => relNode.relatedDataObject.type === "Controlled Document Template")
                    .every((relNode, i, relNodes) => relNode.linkId === relNodes[0].linkId);

                /*const noCDT = questionsInDisplay
                    .filter(ques => ques.relatedDataNodes.length !== 0)
                    .flatMap(ques => ques.relatedDataNodes)
                    .find(relNode => relNode.relatedDataObject.type === "Controlled Document Template") === undefined;


                this.setState({
                        unCommentedNodes: questionsInDisplay
                            .filter(ques => ques.isCommentsRequired)
                            .filter(ques => !ques.comment)
                            .map(ques => ques.nid)
                    }
                );*/

                var errorMsgs = [];

                //Validate All questions answered
                if (unAnswered)
                    errorMsgs.push(QS_NLS.QS_Alert_UnAnsweredQuestionsLeft);
                /*if (unCommented)
                    errorMsgs.push(QS_NLS.QS_Alert_UnCommentedQuestion);*/
                if (differentCDTs)
                    errorMsgs.push(QS_NLS.QS_Alert_MoreThanTwoDifferentCDTOccurs);
                if (hasAttributesWithConflictingAnswers)
                    errorMsgs.push(QS_NLS.QS_Msg_ConflictingAttResp);
                /*if (noCDT)
                    errorMsgs.push("Answer Selections relates no Controlled Document Template to Create Document from");*/

                var alertPS = new Alert({
                    closable: true,
                    visible: true,
                    autoHide: true,
                    hideDelay: 3000,
                    className: 'wp-alert'
                }).inject(document.body, 'top');

                if (errorMsgs.length > 0) {

                    errorMsgs.forEach(errMsg => {
                        alertPS.add({
                            className: 'error',
                            message: errMsg
                        });
                    })


                    alertPS.show();

                    return false;

                } else {
                    return true;
                }
            };


            const questionnaireParamObj = {
                myAppsURL: myAppsURL,
                tenant: curTenant,
                questionnaireId:"<%=questionnaireId%>",
                documentId: "<%=objectId%>",
                objectId: "<%=objectId%>",
				type:"<%="Controlled Document Template"%>",
				appName:"QUC",
                securityContext: '',
                contextPath: contextPath,
                templateId: "<%=templateId%>",
                contextObjectType : "<%=contextObjectType%>",
                mode: mode,
                validateResponse: validateResponse
            }
            Questionnaire.load(questionnaireParamObj);

        });
</script>
</body>
