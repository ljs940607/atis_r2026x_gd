<%--  emxComponentsPackageTransferProcess.jsp   -

   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

 static const char RCSID[] = $Id: emxComponentsPackageTransferProcess.jsp.rca 1.12 Wed Oct 22 16:18:57 2008 przemek Experimental przemek $
--%>


<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility.Browsers"%>
<%@page import="com.matrixone.client.fcs.FcsClient"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file="emxComponentsNoCache.inc"%>
<%@ include file="emxComponentsUtil.inc"%>


<%@ page
import="com.matrixone.servlet.*,matrix.db.*,com.matrixone.fcs.http.*,com.matrixone.fcs.common.*,com.matrixone.fcs.mcs.*"%>

<jsp:useBean id="part" class="com.matrixone.apps.common.Part" scope="session"/>
 <link rel="stylesheet" type="text/css" href="../common/styles/emxUIDefault.css"/>        
<html>

<%
try{
//get the selected checkbox values
  String stUser = context.getUser().toString().trim();
  String partId = emxGetParameter(request,"objectId");
  String fileObjs[] = emxGetParameterValues(request,"checkBoxName");
  String selectedlevel = emxGetParameter(request,"selectedlevel");
  String sGenericFormat = DomainObject.FORMAT_GENERIC;   
  String errorPage = "../components/emxComponentsError.jsp";
  String incBOMStructure =  emxGetParameter(request,"incBOMStructure");
  boolean bIncBOMStructure = true;
  
  if(incBOMStructure != null && "false".equals(incBOMStructure))
  {
      bIncBOMStructure = false;
  }  
 
  Date nowDate = new Date();

  double iTimeZone = (new Double((String)session.getAttribute("timeZone"))).doubleValue(); //60*60*1000 *-1;

//  String strDownloadDateTime = com.matrixone.apps.domain.util.eMatrixDateFormat.getFormattedInputDate(context,nowDate.toString(),iTimeZone,request.getLocale());

String strDownloadDateTime = nowDate.toString();

TicketWrapper ticketWrp = part.getDownloadPackage(context,partId,fileObjs,selectedlevel,strDownloadDateTime,errorPage,request,response, bIncBOMStructure);
String ticketStr = ticketWrp.getExportString();
String ftaAction = ticketWrp.getActionURL();

       
  //fix to check download file size<2GB
        String filenames = ""; 
        String formats ="";
        String specId = "";
        String parentEBOMId = "";
        String insideZipDir = "";
        long totalSize = 0;
    
    //end of  fix
    
    
    
		
%>
        <script language="javascript">
        function doSubmit() 
        {
            //document.forms["FcsForm"].progress.src="../common/images/utilSpacer.gif";
            //XSSOK
            document.forms["FcsForm"].action="<%=ftaAction%>";
            document.body.className = "download-complete";
            document.forms["FcsForm"].submit();
        }
        </script>
		<script language="JavaScript" src="../common/scripts/emxUICore.js"></script>

<body onLoad=" resizeWindow(); doSubmit();" class="download-progress" >

<form method="post" name="FcsForm">
    <div id="emxDialogBody">
        <div id="progress">
            <h1><emxUtil:i18n localize="i18nId">emxComponents.CommonDownload.Downloading</emxUtil:i18n></h1>
            <p><emxUtil:i18n localize="i18nId">emxComponents.CommonDownload.DownloadingMessage</emxUtil:i18n></p>
        </div>
        <div id="complete">
            <h1><emxUtil:i18n localize="i18nId">emxComponents.CommonDownload.DownloadComplete</emxUtil:i18n></h1>
            <p><emxUtil:i18n localize="i18nId">emxComponents.CommonDownload.DownloadCompleteMessage</emxUtil:i18n></p>
        </div>
    </div>
    <div id="emxDialogFoot">
        <div id ="closeButton" ><input type="button" value="Close" onclick="javascript:window.closeWindow();"/></div>
    </div>
<input type="hidden" name="<%=McsBase.resolveFcsParam("jobTicket")%>" value="<xss:encodeForHTMLAttribute><%=ticketStr%></xss:encodeForHTMLAttribute>" />
<input type="hidden" name="<%=McsBase.resolveFcsParam("failurePage")%>" value="<xss:encodeForHTMLAttribute><%=Framework.getFullClientSideURL(request,response,errorPage)%></xss:encodeForHTMLAttribute>" />
<!--//XSSOK-->
<input type="hidden" name="<%=McsBase.resolveFcsParam("attachment")%>" value="true" />

</form>

<script language="javascript">
//doSubmit();
function resizeWindow()
{
	window.resizeTo(550,300);		
}
</script>
<%
    }
 catch(Exception e) {
       //COMES HERE WHEN ANY OPERATION HAS FAILED.
       ContextUtil.abortTransaction(context);
       out.println("Exception in excel creation & checkin......"+e.toString());
    e.printStackTrace();
       //throw e;
   }
%>
</body>
</html>
