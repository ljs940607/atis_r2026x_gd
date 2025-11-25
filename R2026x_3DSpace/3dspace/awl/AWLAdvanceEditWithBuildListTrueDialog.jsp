<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../productline/emxProductCommonInclude.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxJSValidation.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import  = "com.matrixone.apps.productline.*" %>
<%@page import  = "com.matrixone.apps.domain.DomainConstants"%>
<%@page import  = "com.matrixone.apps.domain.DomainObject"%>
<%@page import  = "com.matrixone.apps.domain.DomainRelationship" %>
<%@page import  = "com.matrixone.apps.productline.ProductLineConstants"%>
<%@page import  = "matrix.db.AttributeType"%>
<%@page import  = "com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import  = "com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import  = "com.matrixone.apps.framework.ui.UINavigatorUtil"%>


<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="java.util.Collection"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Collections"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<%@page import="matrix.db.JPO" %>
<%@page import="java.util.HashMap" %>
<%@page import = "matrix.util.StringList" %>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Map" %>

<%@page import="jakarta.json.JsonArray" %>

<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>

<script language="javascript" type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>
<script language="JavaScript" src="scripts/emxUICore.js"></script>
<%@include file="../common/emxRTE.inc" %>
<%
	String suiteKey      = emxGetParameter(request, "suiteKey");
  String languageStr   = request.getHeader("Accept-Language");
  String objectId      = emxGetParameter(request,"objectId");
  String parentOID     = emxGetParameter(request,"parentOID");
  String productId     = emxGetParameter(request,"productId");
  String rowId         = emxGetParameter(request,"rowId");
  String columnName    = emxGetParameter(request, "columnName");  
  CopyElement copyElement = new CopyElement(objectId);
  String copyLanguage    = copyElement.getCopyTextLanguage(context); 
  String featureId   = emxGetParameter(request, "featureId");
  
  
  String strListItem = "";
  String strlistItemSequence = "";
  
  //labels
  String languageLabel  = AWLPropertyUtil.getI18NString(context, "emxAWL.Table.Language");
  String copyTextLabel  =  AWLPropertyUtil.getI18NString(context, "emxAWL.Table.CopyText");
  String copyTypeLabel  =  AWLPropertyUtil.getI18NString(context, "emxAWL.Title.CopyElementType");
  
  String strListSeparator = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ListItem.Seperator", AWLConstants.EMPTY_STRING);
  String listSeparator[] = strListSeparator.split("#");
  
  StringList objSelect = new StringList(DomainConstants.SELECT_NAME);
  objSelect.addElement(DomainConstants.SELECT_TYPE);
  objSelect.addElement(DomainConstants.SELECT_POLICY);
  objSelect.addElement(DomainConstants.SELECT_VAULT);
  objSelect.addElement(AWLAttribute.MARKETING_NAME.getSel(context));
  objSelect.addElement(AWLAttribute.BUILD_LIST.getSel(context));
  objSelect.addElement(AWLAttribute.SEPARATOR.getSel(context));
  Map mpFeature = BusinessUtil.getInfo(context,featureId,objSelect);

  ArtworkMaster artworkMaster = new ArtworkMaster(featureId);
  MapList mList = artworkMaster.related(AWLType.MASTER_LIST_ITEM,AWLRel.SELECTED_LIST_ITEM).id().relAttr(AWLUtil.toArray(AWLAttribute.LIST_ITEM_SEQUENCE,AWLAttribute.ADDITIONAL_INFO)).query(context);
  
  String strBuildLisFrom = (String) mpFeature.get(AWLAttribute.BUILD_LIST.getSel(context));
  String selectedListSeparator = (String) mpFeature.get(AWLAttribute.SEPARATOR.getSel(context));
  String strUserVaultDisplay =(String)mpFeature.get(DomainConstants.SELECT_VAULT);
  String strDesResId = "";
  String strDesResName = "";
  String strUserVault = (String)mpFeature.get(DomainConstants.SELECT_VAULT);
  String policy = (String)mpFeature.get(DomainConstants.SELECT_POLICY);
   

  MapList hevalue   = new MapList();
  StringBuffer sb = new StringBuffer();
  StringBuffer listItemsequence = new StringBuffer();
  Iterator itr = mList.iterator();
  String strSeqNumList ="";
  String strAddInfoList="";
  String strCopyTextList = "";
  
  while(itr.hasNext())
  {
      Map mp = (Map)itr.next();
      String objId =  (String) mp.get(DomainConstants.SELECT_ID);
      artworkMaster.setId(objId); 
      String strCopyText = artworkMaster.getLocalCopyText(context,copyLanguage,true);
      String strSeqNum = (String) mp.get(AWLAttribute.LIST_ITEM_SEQUENCE.getSel(context)); 
      String strAddInfo = (String) mp.get(AWLAttribute.ADDITIONAL_INFO.getSel(context)); 
      
      if(!objId.equals("")){
          Map sample = new HashMap();
          sample.put("id", objId);
          sample.put("copyText",strCopyText);
          sample.put("sequence",strSeqNum);
          sample.put("AddInfo",strAddInfo);
          hevalue.add(sample);
          sb.append(strAddInfo);
          String strlistSeq = strSeqNum+"|"+objId+"|"+strAddInfo;
          listItemsequence.append(strSeqNum+"|"+objId+"|"+strAddInfo);
          strSeqNumList += strlistSeq;
          strAddInfoList += strAddInfo;
          strCopyTextList += strCopyText;
          if(itr.hasNext())
          {
              sb.append(",");
              listItemsequence.append(",");
              strSeqNumList += ",";
              strAddInfoList += "|";
              strCopyTextList += "|";
          }
      }
      
  }

  String checked = "Yes".equalsIgnoreCase(strBuildLisFrom) ? "checked" :"";
  String notchecked = "No".equalsIgnoreCase(strBuildLisFrom) ? "checked" :"";
  JsonArray array = BusinessUtil.toJSONArray(hevalue);
  
  boolean isbaseCopy = copyElement.isBaseCopy(context);
%>


<script type="text/javascript">
  var listCopyItems = <%=array.toString()%>;
  var rowId       = "<xss:encodeForJavaScript><%=rowId%></xss:encodeForJavaScript>";
  var columnName  = "<xss:encodeForJavaScript><%=columnName%></xss:encodeForJavaScript>"; 
  
  function changeSeparator(select)
  {   
	  var  formName = document.advanceEdit;
	  var sep = select.value;
	  var copyTextElements = document.getElementsByName("copyText");
	    var  copytext = copyTextElements[0];
	    var seqnumber = "";  
	    
	    var copyvalye = [];

	    var listItemSequence=formName.listItemSequence.value;  

	    var addtionalInfo =formName.addtionalInfo.value;  
	    
	    var hidCopyTextInfo =formName.hidCopyTextList.value;
	  
	    var arraySeqNum=new Array();

	    var arraySeq=new Array();

	    var addInfo=new Array();
	    
	    var copytextArray =new Array();

	    var seq="";

	    arraySeqNum=listItemSequence.split(",");

	    addInfo= addtionalInfo.split("|");
	    
	    copytextArray= hidCopyTextInfo.split("|");
	    
	    
	    for(var j=0;j<arraySeqNum.length;j++)
	    {  
	  
	        seq=arraySeqNum[j];
	        arraySeq=seq.split("|");
	        seqnumber=arraySeq[0];
	       
	        var seqnum = parseInt(seqnumber);
	        copyvalye[seqnum-1]=copytextArray[j]+addInfo[j];
	    }
	     var copytextValue = copyvalye.join(sep);
	     copytext.updateRTE(copytextValue);
	    
           
  }
  function updateField()
  {  
	  var listItemId = document.forms[0].listItemId.value;
	  var listItemSequence = document.forms[0].listItemSequence.value;
	  var selectedSeparator = document.getElementById("listSeparator").value;
	  var copyTextvalue = document.getElementById("copyText").value
	  //May be copy text also contains all the special characters, so we are using the strong pattern to separate the values 
	  //do not change the order, if u want to change cange in java func also AWLCopyElementUIBase_mxJPO:updateCopyTextValue
	  var formattedStringValue = listItemSequence + "~#~" + copyTextvalue  + "~#~" + selectedSeparator + "~#~" + "<xss:encodeForJavaScript><%=featureId%></xss:encodeForJavaScript>";
	  
	  var cellvalue = formattedStringValue;
	  //listItemSequence +"|"+"<%=featureId%>";
	  var cellDisplay   = copyTextvalue;
	  var isRefreshView = true;
	  
	  getTopWindow().getWindowOpener().emxEditableTable.setCellValueByRowId(rowId, columnName, cellvalue, cellDisplay, isRefreshView);
	  getTopWindow().closeWindow();
  }

  function updateCopyText()
  {
	  var copyText   = getTopWindow().getWindowOpener().emxEditableTable.getCellValueByRowId(rowId, columnName);
	  var copyTextFieldName = document.getElementById("copyText");
	  copyTextFieldName.disableRTE();	  
	  setTimeout(function(){copyTextFieldName.updateRTE(copyText.value.current.display);},200);
  }

  window.onload = updateCopyText;
  
</script>


<%@include file = "../emxUICommonHeaderEndInclude.inc"%>

<%
	String featureType               = ""; 
    String elementType           = "";
	if(BusinessUtil.isNotNullOrEmpty(objectId))
	{
		boolean isMCE = BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_COPY_ELEMENT.get(context));
		boolean isCE = BusinessUtil.isKindOf(context, objectId, AWLType.COPY_ELEMENT.get(context));
		if(isMCE) {
			featureType = BusinessUtil.getInfo(context, objectId, DomainConstants.SELECT_TYPE);
			elementType = ArtworkMaster.getArtworkElementType(context, featureType, false, false);
		} else if(isCE) {
			elementType = BusinessUtil.getInfo(context, objectId, DomainConstants.SELECT_TYPE);
			featureType = ArtworkMaster.getMasterArtworkElementType(context, elementType, false, false);
		}
	}

	try
	{
%>
	<form name="advanceEdit" method="post" action="" onsubmit="javascript:updateField(); return false">
	
	<table width="100%" border="0" cellspacing="2" cellpadding="5">
	
	
      
	
	   <!-- Copy Element Type  -->
		<tr>
		<!-- XSSOK copyTypeLabel : Res Bundle-I18N  -->
		   <td width="150" nowrap="nowrap" class="label"><%=copyTypeLabel%></td>
		<!-- XSSOK elementType : DB Schema - Type  -->   
		   <td class="field" style="font-weight:bold;"><%=elementType%></td>    
		</tr>
	
	   <!-- Language  -->
	    <tr>
	    <!-- XSSOK languageLabel : Res Bundle-I18N  -->  
	       <td width="150" nowrap="nowrap" class="label"><%=languageLabel%></td>
	       <td class="field" style="font-weight:bold;">
	       		<xss:encodeForHTML><%=copyLanguage%></xss:encodeForHTML>
	       </td> 
	    </tr>
	    
	    <!-- List separator-->
	    
	    <tr name="ListSeparators" id ="ListSeparators">
          
          <td class="labelRequired" width="150">
          <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N  -->
         <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ListSeparator")%>
         </td>
         <td class="field">                           
         <select style="width:12em" name="listSeparator" id="listSeparator" onchange="changeSeparator(this);" 
         <% if(!isbaseCopy){%> disabled="disabled" <%} %>>                 
                    <%
                        String EMPTY_STRING = "";
                        
                          for(String separator :listSeparator){
                            if (!separator.equals(EMPTY_STRING)){   %> 
                                <option value="<xss:encodeForHTMLAttribute><%=separator%></xss:encodeForHTMLAttribute>" 
								     <% if(separator.equals(selectedListSeparator)) {%> selected="true" <%} %>><xss:encodeForHTML><%=separator%></xss:encodeForHTML></option>
                    <%      }
                        }
                    %>
                </select>
          <input type="hidden" name="OldlistSeparator" value = "<xss:encodeForHTMLAttribute><%=selectedListSeparator%></xss:encodeForHTMLAttribute>" />
         </td>
     </tr>
	     
	   <!-- Copy Text  -->
	    <tr>
	    <!-- XSSOK copyTextLabel: Res Bundle-I18N -->
	        <td width="150" nowrap="nowrap" class="label"><%=copyTextLabel%></td>
	        <td nowrap="nowrap" class="field">
		        <table>
		           <tr> 
				       <td>
				          <textarea id="copyText" name="copyText" rows="8" cols="35" class="rte" ></textarea>
				          <input type="hidden" name="listItemId" value= "<xss:encodeForHTMLAttribute><%=strListItem%></xss:encodeForHTMLAttribute>" />
				           <input type="hidden" name="listItemSequence" value="<xss:encodeForHTMLAttribute><%= strSeqNumList %></xss:encodeForHTMLAttribute>" />
                           <input type="hidden" name="addtionalInfo" value="<xss:encodeForHTMLAttribute><%= strAddInfoList %></xss:encodeForHTMLAttribute>" /> 
                               <input type="hidden" name="hidCopyTextList"  value="<xss:encodeForHTMLAttribute><%= strCopyTextList %></xss:encodeForHTMLAttribute>"/> 
				       </td>
		               <td>
		                  <table>
						      <tr>
						    <td><a href="#top-test"><img name="BuildFrmListImage"  src="../awl/images/AWLBuildFromList.gif" style="" border="0" align="middle" TITLE="BuildFrmList" onclick="javascript:showListDialog('../awl/AWLBuildListDialogFS.jsp?&fieldNameActual=copyText&fieldNameDisplay=copyText&fieldListItemName=listItemId&fieldListItemDisplay=listItemId&fieldSeparatorName=listSeparator&objectId=<%=XSSUtil.encodeForHTML(context, objectId)%>');"/></a></td>
                              </tr>
		                  </table>
		               </td>
		            </tr>
	            </table>
	         </td>       
	     </tr>   
	</table>
	</form>
<%
	}
	catch(Exception e)
	{
	  emxNavErrorObject.addMessage(e.toString().trim());
	  session.setAttribute("error.message", e.toString().trim());
	}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file = "../emxUICommonEndOfPageInclude.inc" %>
