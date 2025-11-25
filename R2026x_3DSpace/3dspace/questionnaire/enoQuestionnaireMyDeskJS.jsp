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
    <script type="text/javascript" src="../webapps/UIKIT/UIKIT.js"></script>
    <script type="text/javascript" src="../webapps/PlatformAPI/PlatformAPI.js"></script>
    <script type="text/javascript" src="../webapps/DocumentManagement/DocumentManagement.js"></script>
    <script type="text/javascript" src="../webapps/c/UWA/js/UWA_Standalone_Alone.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
    <script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>

    <%		
        Context context = Framework.getFrameContext(session);
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

        .collection-view {
            left: 0;
            transition: width 0.2s;
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .detail-view {
            transition:  width 0.2s;
            position: absolute;
            width: 0%;
            height: 100%;
            right: 0;
        }
    </style>
</head>
<body>
    <div class="collection-view" id="collection-view"></div>
    <div class="detail-view" id="detail-view"></div>
</body>

<script>
    require(['DS/ENOQuestionaireUX/scripts/view/QuestionnaireView', 'DS/ENOQuestionaireUX/scripts/model/QuestionCollection', 'css!DS/UIKIT/UIKIT.css'],
        function (QuestionnaireView, QuestionCollection) {

            const myAppsURL = "<%=FrameworkUtil.getMyAppsURL(context, request, response)%>";
            const contextPath = "<%=request.getContextPath()%>";
            const curTenant = "";
			let appName = "";

			if(appName === '' || appName === "null") {
				appName = 'QUC';
			}

            const questionnaireParamObj = {
                url:myAppsURL,
                proxy: 'passport',
                myAppsURL: myAppsURL,
                tenant: curTenant,
                securityContext: '',
                contextPath: contextPath,
                appName: appName,
            };
			            
            thiscollection = new QuestionCollection(null, {url: myAppsURL + "/resources/questionnaire/QuestionnaireService/getAllQuestionnaires"});
            thiscollection.baseUrl = myAppsURL;			
            thiscollection.props = questionnaireParamObj;
			
            /** Creating view and passing collection object and widget body to view*/
            var element = document.getElementById("collection-view");
            view = new QuestionnaireView({collection: thiscollection, container: element, props : questionnaireParamObj});
            
            thiscollection.fetch();
        });

</script>

</html>
