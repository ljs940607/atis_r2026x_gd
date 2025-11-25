<%@ page import="com.matrixone.apps.domain.util.FrameworkUtil" %>
<%@ page import="com.matrixone.apps.domain.DomainObject" %>
<%@ page import="com.matrixone.apps.domain.DomainConstants" %>
<%@ page import="java.util.Map" %>
<%@ page import="matrix.util.StringList" %>
<%@ page import="com.matrixone.servlet.Framework" %>
<%@ page import="matrix.db.Context" %>
<%@ page import="com.matrixone.apps.domain.util.XSSUtil" %>

<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="../webapps/UIKIT/UIKIT.css"/>
    <link rel="stylesheet" href="../webapps/ENOQuestionaireUX/styles/questionnaire.css"/>

    <script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
    <script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
    <script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
    <script type="text/javascript" src="../webapps/WebappsUtils/WebappsUtils.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
    <script type="text/javascript" src="../webapps/PlatformAPI/PlatformAPI.js"></script>
    <script type="text/javascript" src="../webapps/UIKIT/UIKIT.js"></script>
    <script type="text/javascript" src="../webapps/DocumentManagement/DocumentManagement.js"></script>
    <script type="text/javascript" src="../webapps/c/UWA/js/UWA_Standalone_Alone.js"></script>

    <%

        Context context = Framework.getFrameContext(session);

        String url = FrameworkUtil.getMyAppsURL(context, request, response);
        String parentOId = request.getParameter("objectId");

        StringList selects = new StringList();
        selects.add(DomainConstants.SELECT_TYPE);

        DomainObject domObj = DomainObject.newInstance(context, parentOId);
        Map selectedData = domObj.getInfo(context, selects);
        String strType = (String) selectedData.get(DomainConstants.SELECT_TYPE);


        String objectId = request.getParameter("objectId");
        String mode = request.getParameter("mode");
        String templateId = request.getParameter("templateId");
        String servletPath = request.getContextPath();
    %>


    <style type="text/css">

        .wux-layouts-datagridview {
            margin-top: 10px;
            user-select: none;
        }

        .module {
            width: 100%;
            height: 99%;
            margin: 0;
            border: none;
        }

        .moduleWrapper {
            z-index: inherit;
            zoom: 1;
        }

        .module > .moduleHeader {
            display: none;
        }

        .moduleFooter {
            display: none;
        }
    </style>
</head>
<body>
    
</body>

<script>
    require(['DS/ENOQuestionaireUX/scripts/view/QuestionView', 'DS/ENOQuestionaireUX/scripts/model/QuestionCollection', 'css!DS/UIKIT/UIKIT.css'],
        function (QuestionView, QuestionCollection) {

            const myAppsURL = "<%=FrameworkUtil.getMyAppsURL(context, request, response)%>";
            const contextPath = "<%=servletPath%>";
            const mode = "<%=mode%>";

            var data = {
                "objectId": "<%=objectId%>",
                "mcsurl": myAppsURL
            };
            data = JSON.stringify(data);


            const curTenant = <%= !FrameworkUtil.isOnPremise(context) ?  XSSUtil.encodeForJavaScript(context, context.getTenant()) : null %>;

            const questionnaireParamObj = {
                url:myAppsURL,
                proxy: 'passport',
                myAppsURL: myAppsURL,
                tenant: curTenant,
                objectId: "<%=objectId%>",
                documentId: "<%=objectId%>",
                securityContext: '',
                contextPath: contextPath,
                templateId: "<%=templateId%>",
                mode: mode,
            };

            // console.log(questionnaireParamObj);
            /** Creating object of Collection*/
            
            thiscollection = new QuestionCollection(null,
                {url: "<%=url%>" + "/resources/questionnaire/QuestionnaireService/getQuestions?questionnaireId=" + "<%=parentOId%>"});
            thiscollection.baseUrl = "<%=url%>";
            thiscollection.type = "<%=strType%>";
            thiscollection.props = questionnaireParamObj;
            /** Creating view and passing collection object and widget body to view*/
            view = new QuestionView({collection: thiscollection, container: widget.body, props : questionnaireParamObj});
            // thiscollection.props = questionnaireParamObj;
            /** It will trigger Sync function so view can render itself using callback  */
            thiscollection.fetch();

        });

</script>

</html>
