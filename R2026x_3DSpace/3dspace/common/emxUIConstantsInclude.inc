<%--  emxUIConstantsInclude.inc

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

--%>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script language="JavaScript" type="text/javascript">
var uiconstantscache = typeof sessionStorage != "undefined" ? sessionStorage.getItem('uiConstantsCache'): null;
if(uiconstantscache){
	uiconstantscache= JSON.parse(uiconstantscache);
	var emxUIConstants = uiconstantscache;
}else{
	document.write("<scri" + "pt language=\"JavaScript\" type=\"text/javascript\" src=\"../common/emxUIConstantsJavaScriptInclude.jsp\"></scr" + "ipt>");
}
    uiconstantscache = null; // Added //
</script>

<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="javascript">
  addStyleSheet('emxUICalendar');
  if(getTopWindow().isMobile){
	addStyleSheet("emxUIMobile", "mobile/styles/");	
  }
</script>

<script type="text/javascript" src="../common/scripts/emxUICoreMenu.js"></script>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/dsTouchEvents.js"></script>

