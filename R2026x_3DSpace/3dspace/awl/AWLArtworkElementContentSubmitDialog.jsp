<%--  AWLArtworkElementContentSubmitDialog.jsp
   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
 --%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../emxJSValidation.inc"%>
<%@ include file="../common/emxUIConstantsInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="matrix.db.JPO"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.RouteUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>

<script language="javascript" type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>
<script language="javascript" type="text/javascript" src="../common/scripts/emxUIJson.js"></script>
<script language="JavaScript" type="text/javascript" src="./scripts/emxUICore.js"></script>

<%
	String languageStr     = request.getHeader("Accept-Language");
	  //xss encoding
	  String artworkContentSubmitAciton  = XSSUtil.encodeForURL(context,emxGetParameter(request, "artworkContentSubmitAciton"));
	  boolean isRejectAction = AWLConstants.ARTWORK_CONTENT_SUBMIT_REJECT.equalsIgnoreCase(artworkContentSubmitAciton);
	  StringList idList      = FrameworkUtil.split(emxGetParameter(request,"rowId") , ","); 
	  
	  MapList objectList = new MapList();
	  for(int i = 0; i < idList.size(); i++)
	  {
		  Map objectMap = new HashMap();
		  objectMap.put("id", idList.get(i).toString());
		  objectList.add(objectMap);
	  }
	  
	  Map programMap = new HashMap();
	  programMap.put("objectList", objectList);
	  programMap.put("languageStr", languageStr);
	  Map mpImageData = UINavigatorUtil.getImageData(context, pageContext);
	  programMap.put("mpMCSURL", mpImageData);

	  MapList infoList  = (MapList)JPO.invoke(context, "AWLArtworkElementUI", null, "getArtworkElementContentInfo", JPO.packArgs(programMap), MapList.class);
	 
	  // UI labels
	  String elementLabel    = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Type");
	  String marketingTextLabel=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.DisplayName");;
	  String copyTextLabel   = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Content");

	  String tableHeader =  AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkContentSubmitAction.TableHeader."+artworkContentSubmitAciton , languageStr );
	  
	  String commentsLabel   = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Comments");
	  String strMessage      = AWLPropertyUtil.getI18NString(context, "emxAWL.RejectionComments.Message");
	  String dblMessage      = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.ArtworkDoubleSubmit");
	  
	  // Login Information
	  String i18NUserName = AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource","emxFramework.Login.Username", null);
	  String i18NPassword = AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource","emxFramework.Login.Password",null);
	  String strUserMessage = AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource","emxFramework.Login.InvalidUserPassword",null);
	  String showUserName = emxGetParameter(request, "showUserName");
		
	  if(BusinessUtil.isNullOrEmpty(showUserName)) {
		  showUserName = AWLPropertyUtil.getConfigPropertyString(context, "emxFramework.Routes.ShowUserNameForFDA");
	  }
	  boolean bShowUserName = "true".equalsIgnoreCase(showUserName);
	  boolean requireAuthentication = RouteUtil.showFDAToSubmitArtworkContent(context, idList, artworkContentSubmitAciton);
%>

<script type="text/javascript">
//bShowUserName is a boolean value to decide whether to show user name or not.
//XSSOK bShowUserName will be either true or false
var showUserName = <%=bShowUserName%>; 
//XSSOK requireAuthentication read from property configuration
var requireAuthentication = <%= requireAuthentication %>;
var canSubmit=true;

function validateUserCredentials(userNameVal,passWordVal)
{
   //var url = "../common/emxRoutesFDAValidateUserProcess.jsp?userName=" + userNameVal + "&passWord=" + passWordVal + "&showUserName=" + showUserName;
   //var xmlResult = emxUICore.getXMLData(url);
   
   //var url = "../common/emxRoutesFDAValidateUserProcess.jsp";
   var url = "AWLRoutesFDAValidateUserProcess.jsp";
   var postData = "userName=" + userNameVal + "&passWord=" + passWordVal + "&showUserName=" + showUserName;
   var xmlResult = emxUICore.getXMLDataPost(url, postData);
   
   try{
       var root = xmlResult.documentElement;
       var resultNodeVal = emxUICore.getText(emxUICore.selectSingleNode(root, "/mxFDAAuth/result"));
       var messageNodeVal = emxUICore.getText(emxUICore.selectSingleNode(root, "/mxFDAAuth/errorMsg"));
       if(resultNodeVal == "fail") {
           alert(messageNodeVal);
           return false;
       } else if(resultNodeVal == "block") {
           alert(messageNodeVal);
           getTopWindow().closeWindow();
           return false;
       }
   }catch(e){
       alert(emxUIConstants.STR_JS_AnExceptionOccurred + " " + emxUIConstants.STR_JS_ErrorName + " " + e.name
               + emxUIConstants.STR_JS_ErrorDescription + " " + e.description
               + emxUIConstants.STR_JS_ErrorNumber + " " + e.number
               + emxUIConstants.STR_JS_ErrorMessage + " " + e.message);
       return false;                          
   }
   return true;    
}

  var infoList = [];
  var elementIdArray= [];
  var artworkContentSubmitAciton = "<xss:encodeForJavaScript><%=artworkContentSubmitAciton%></xss:encodeForJavaScript>";

  //submit issue
  function artworkElementContentSubmit()
  {
      var validate = !requireAuthentication;
      if(requireAuthentication)
      {
          var userName = document.getElementById("userName");
          var passWord = document.getElementById("passWord");
          var userNameVal = "";
          var passWordVal = btoa(encodeURIComponent(passWord.value).replace(/%([0-9A-F]{2})/g,
        		  						function toSolidBytes(match, p1) {
					        	  			return String.fromCharCode('0x' + p1);
					        	  		}
				          			)
							);
          if(!showUserName) {
              userNameVal = btoa(encodeURIComponent(userName.value).replace(/%([0-9A-F]{2})/g,
        		  						function toSolidBytes(match, p1) {
					        	  			return String.fromCharCode('0x' + p1);
					        	  		}
				          			)
							);
          }
         startProgressBar();
         validate = validateUserCredentials(userNameVal,passWordVal);
         turnOffProgress();
      }

      if(validate)
      {
    	  startProgressBar();
         for(var i = 0; i < infoList.length; i++)
         {
            var comment = document.getElementById(infoList[i].id);
         // XSSOK strMessage : Res Bundle-I18N
            var sMessage = "<%=strMessage%>";
            infoList[i].comment = comment != null ? comment.value : "";
            if(null == comment || comment.value == "")
            {
                alert(sMessage);
                turnOffProgress();
                return;
            }
         }
         
         if(!canSubmit){
        	// XSSOK strMessage : Res Bundle-I18N
             var dMessage = "<%=dblMessage%>";
             
             alert(dMessage); 
    	     getTopWindow().getWindowOpener().reload();
             parent.closeWindow(); 
             turnOffProgress();
             return;
         } 
         //Already user request is in process
         canSubmit = false;

      	  getTopWindow().getWindowOpener().doSubmitArtworkContentAction(infoList.toJSONString(), 
                  function (data) {
                       if(data && data.message && data.message.length > 0) 
                       alert(data.message);
                  },
                  function (data) {
                      if(data && data.hasError)
                      alert(data.error);
                  },
                  function (data, success) {
                      if(data && data.notice)
                      alert(data.notice);
                      
                      var xlistHidden = findFrame(getTopWindow(), 'pagehidden');
                      if(xlistHidden)
                      {
                          xlistHidden.location.href = "../common/emxMQLNoticeWrapper.jsp";
                      }
						setTimeout(
							function() 
						  {	 
								if(success)  
								{ 
									getTopWindow().getWindowOpener().reloadCurrentStructure();
									getTopWindow().closeWindow(); 
								} 
							} , 1000);
                 },
                 artworkContentSubmitAciton
           );         
         }

      //Don't turnoff progress here since the task submission is a ajax request, 
      //FDA page will turnoff the even before the task is not completed.
      //turnOffProgress();
  }
  
  function close()
  {
      resetArtworkSubmitFlag();
      parent.closeWindow();
  }
  function resetArtworkSubmitFlag()
  {
     
      if(canSubmit)
      {
        getTopWindow().getWindowOpener().resetArtworkSubmitFlag();
      }
      getTopWindow().getWindowOpener().toggleProgressIndicator(false);
  }
  
  function showProgressIndicator()
  {
      getTopWindow().getWindowOpener().toggleProgressIndicator(true);
  }
  
</script>


<%@include file = "../emxUICommonHeaderEndInclude.inc"%>
<LINK href="../common/styles/emxUIList.css" rel="stylesheet" type="text/css">
<body class="properties mx_editable editable" onunload="resetArtworkSubmitFlag()" onload="showProgressIndicator()">

	<form name="copyRejection" method="post" action=""	onsubmit="javascript:artworkElementContentSubmit(); return false">
  <br>
  
  <% if(requireAuthentication) { %>
  <div id="divPageBody">  
    <table width="1%" cellspacing="0" cellpadding="0" border="0" align="center">
    <tbody>
    <tr>
    <td class="heading2" width="1%" ></td>
    </tr>
    </tbody>
  </table>
      <table width="100%" border="0" cellpadding="3" cellspacing="2">
            <tr class='odd'>
            <!-- XSSOK i18NUserName : Coming from Res I18N value  -->
              <td class="labelRequired"><%=i18NUserName%></td>
              <td class="field"><input id="userName" type="text" name="userName" /></td>
            </tr>

          <tr class='even'>
          	<!-- XSSOK i18NUserName : Coming from Res I18N value  -->
              <td class="labelRequired"><%=i18NPassword%></td>
              <td class="field"><input id="passWord" type="password" name="passWord" /></td>
          </tr>
      </table>
   </div>
    <%} %>
    
    <br>
     <table width="1%" cellspacing="0" cellpadding="0" border="0" align="center"> 
    <tbody>
    <tr>
    <!-- XSSOK  tableHeader I18N label or message-->
    <td class="heading1" width="1%" nowrap=""><%=tableHeader%></td>
    </tr>
    </tbody>
  </table>
      <table class="list" id="artworkElementList" >
        <tbody>
            <tr>
            	<!-- XSSOK  elementLabel I18N label or message-->
                <th nowrap=""><%=elementLabel%></th>
                <!-- XSSOK  marketingTextLabel I18N label or message-->
                <th nowrap=""><%=marketingTextLabel%></th>
                <!-- XSSOK  copyTextLabel I18N label or message-->
                <th nowrap="" ><%=copyTextLabel%></th>
                <% if(isRejectAction) { %>
                <!-- XSSOK  commentsLabel I18N label or message-->
               <th class ="required" nowrap=""><%=commentsLabel%></th>
                <% } %>
            </tr>
            
           <%
            String DISPLAY_NAME = "to[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "].from."+AWLAttribute.MARKETING_NAME.getSel(context);
            for(int i = 0; i < infoList.size(); i++)
            {
                Map info         = (Map)infoList.get(i);
                //H49 2012x.HF1
                String rId       = idList.get(i).toString();
                String rIdXSSEncode = XSSUtil.encodeForJavaScript(context, rId);
                String id        = BusinessUtil.getString(info, DomainConstants.SELECT_ID);
                String element   = BusinessUtil.getString(info, DomainConstants.SELECT_TYPE);
                String marketingName = BusinessUtil.getString(info, DISPLAY_NAME);
                String copyText  = BusinessUtil.getString(info, AWLConstants.ARTWORK_CONTENT);
                String css       = i % 2 == 0 ? "even" : "odd";
           %>
            
            <script type="text/javascript">
            elementIdArray.push("<%=rIdXSSEncode%>");
              infoList.push( {id : "<%= rIdXSSEncode %>", status : "<xss:encodeForJavaScript><%= artworkContentSubmitAciton %></xss:encodeForJavaScript>" } );
                        
             </script>
            <!-- XSSOK css --  coming from logic odd or even value-->
            <tr  class="<%= css %>">
                <!-- XSSOK I18N value for Type-->
                <td class="inputField"><%=element %><br/></td>
		
                <td class="inputField"><xss:encodeForHTML><%= marketingName %></xss:encodeForHTML><br/></td>
		
					<td class="verbatim"><%= copyText %><br /></td>
						<%-- Fix IR-286540 --%>
						<% if(isRejectAction) 
						{ %>
								<td class="inputField"><textarea id="<xss:encodeForHTML><%=rId%></xss:encodeForHTML>" cols="15"> </textarea>
                  <%} else { %>
				  
							<input id="<%=rId%>" type="hidden"value="<xss:encodeForHTMLAttribute><%= artworkContentSubmitAciton %></xss:encodeForHTMLAttribute>" />
                  <% } %>
                </td>
            </tr>
           <% } %>          
        </tbody>
     </table>
    </form>
    
</body>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
