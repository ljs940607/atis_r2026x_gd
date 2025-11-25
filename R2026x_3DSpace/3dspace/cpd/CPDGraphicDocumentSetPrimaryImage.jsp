<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc"%>
<%
  String emxTableRowId = emxGetParameter(request, "emxTableRowId");
  StringList imgId = FrameworkUtil.split(emxTableRowId, "|");
  DomainObject dom = new DomainObject((String)imgId.get(0));
  String fileName = dom.getInfo(context, CommonDocument.SELECT_TITLE);
  String objectId = emxGetParameter(request, "objectId");
%>

<%
try
{
	    boolean isPushed = false;
        DomainObject object = DomainObject.newInstance(context, objectId);
        Image image = object.getImageObject(context);
        if(image == null)
        {
            DomainObject imageObject = DomainObject.newInstance(context, DomainObject.TYPE_IMAGE_HOLDER);
            ContextUtil.pushContext(context);
            isPushed = true;
            imageObject.createAndConnect(context, DomainObject.TYPE_IMAGE_HOLDER, DomainObject.RELATIONSHIP_IMAGE_HOLDER, object, false);
            ContextUtil.popContext(context);
            isPushed = false;
            image = new Image(imageObject.getInfo(context, DomainConstants.SELECT_ID));
        }
        String PRIMARY_IMAGE_FROM_ALTPATH = PropertyUtil.getSchemaProperty(context,"attribute_PrimaryImageFromAltPath"); 

        HashMap attrMap = new HashMap();    
        attrMap.put(DomainObject.ATTRIBUTE_PRIMARY_IMAGE, com.matrixone.apps.common.util.ImageManagerUtil.getPrimaryImageFileNameForImageManager(fileName));
        attrMap.put(PRIMARY_IMAGE_FROM_ALTPATH, "No");
        image.setAttributeValues(context, attrMap);     
} catch (Exception ex)
{
    session.setAttribute("error.message" , ex.toString());
}
%>
<html>
<body>
<script language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script>
<script language="Javascript" >
  var frameContent = findFrame(getTopWindow(),"detailsDisplay");
      if (frameContent != null )
      {
        frameContent.document.location.href = frameContent.document.location.href;
      } else {
        parent.document.location.href = parent.document.location.href;
      }
</script>

</body>
</html>
