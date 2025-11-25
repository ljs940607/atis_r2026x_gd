<%--  
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxJSValidation.inc" %>
<%@include file="../common/emxRTE.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.productline.*" %>
<%@page import  = "com.matrixone.apps.domain.DomainConstants"%>
<%@page import  = "com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship" %>
<%@page import  = "com.matrixone.apps.productline.ProductLineConstants"%>
<%@page import  = "matrix.db.AttributeType"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="matrix.util.StringList"%>

<script language="javascript" type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<%
	String browserLang            =  context.getSession().getLanguage();
  String fieldNameActual        =  emxGetParameter(request,"fieldNameActual");
  String fieldListItemName      =  emxGetParameter(request,"fieldListItemName");
  String filedSeparator         =  emxGetParameter(request,"filedSeparator");
  String copyText               = "";
  String chkBoxSelectedValue    =  emxGetParameter(request,"chkBoxSelectedValue");
  String strListId              = emxGetParameter(request,"chkBoxSelectedValue");
 
  String alertProperSequence    = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.properSequence");
  String checkInteger           =  AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkInteger");
  StringList strListItemID      =  new StringList();

  if(chkBoxSelectedValue != null && !chkBoxSelectedValue.equals("")){
	  chkBoxSelectedValue = chkBoxSelectedValue.substring(0,chkBoxSelectedValue.lastIndexOf(","));//to remove comma from last indexed position
	  strListItemID = FrameworkUtil.split(chkBoxSelectedValue, ",");
  }
%>

<script language="JavaScript">

function checkInput()
{
	//Added by bw3 for FD03
    var chkBoxSelectedValue = "";
    var CopyTextArray = new Array();
    var SequenceNumber="";//new Array();
    var additionalInfo= "";//new Array();
    var ListItem=new Array();
    var seqCount =new Array();
    var formValid=false;
    var seqNumber=new Array();
    var strSeq = "strSeq";
    var strAlertProperSequence=0;
    var chkcount=0;
    var arr=[];
    var sarr = document.getElementsByName("ListItemChkBox2");

    if(sarr.length)
   {
     arr = sarr;
   }
   else
   {
     arr.push(sarr);
   }
    chkcount=arr.length;

    var chkInt=false;
  var length;

   try{
    length=document.createLocalCopyElement.ListItemChkBox2.length;
}
catch(e){
	//XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
	alert("<%=com.matrixone.apps.awl.util.AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.SelectAtleastOne")%>");
}
    for(var k=0;k < chkcount; k++)
    {
    	seqCount[k]=k+1;

     }

    for(var i=0; i < seqCount.length; i++)
    {

            for(var j=0; j < chkcount;j++)
          {
            	var rowId1 = arr[j].getAttribute("rowId");
                var strSeqValue=document.createLocalCopyElement.elements[strSeq+rowId1].value;
                if(isNaN(strSeqValue))
                {
                     chkInt=true;
                }
                else
                {
                if(seqCount[i]==strSeqValue)
                 {
                	strAlertProperSequence=strAlertProperSequence+1;
                	break;
                 }
                }
           }
     }
    if(chkInt)
    {
    	//XSSOK I18N label or message
    	alert("<%=checkInteger%>");
     }
    else
     {
      if(strAlertProperSequence!=chkcount)
       {
    	//XSSOK I18N label or message
        alert("<%=alertProperSequence%>");
       }
      else
      {
    	formValid=true;
      }
     }
    for (var i=0; i < chkcount; i++)
    {
    	CopyTextArray[i] = "";
    	ListItem[i]="";
    	SequenceNumber[i]="";
    	additionalInfo[i]="";
    }

        //End bw3
         var hidCopyTextList = "";
    for (var i=0; i < chkcount; i++)
       {
          chkBoxSelectedValue = chkBoxSelectedValue + arr[i].value+",";
         var strSeq="strSeq";
         var count = i;
         var rowId = arr[i].getAttribute("rowId");
         strSeq =strSeq + rowId;
         var strSequence  =    document.createLocalCopyElement.elements[strSeq].value;
         var count2 = parseInt(strSequence);
          strSequence = strSequence-1;
          var strItem = "strItem" + rowId;
          var strAddInfo = "strAddInfo" + rowId;
          var strAddInfoValue = document.createLocalCopyElement.elements[strAddInfo].value;
          var tempCopytext = document.createLocalCopyElement.elements[strItem].value;
          CopyTextArray[strSequence] = document.createLocalCopyElement.elements[strItem].value+strAddInfoValue;
          ListItem[i]=  arr[i].value;
          strSequence=strSequence+1;
          //SequenceNumber[i]=strSequence+"|"+ListItem[i]+"|"+strAddInfoValue;
          //additionalInfo[i]=document.createLocalCopyElement.elements[strAddInfo].value;
          if(i != 0) {
        	  SequenceNumber += ",";
        	  additionalInfo += "|";
        	  hidCopyTextList += "|";
          } 
          SequenceNumber = SequenceNumber + strSequence+"|"+ListItem[i]+"|"+strAddInfoValue;
          additionalInfo =additionalInfo + document.createLocalCopyElement.elements[strAddInfo].value;
          hidCopyTextList =hidCopyTextList + tempCopytext;

       }
    
        var vfieldNameListItemSequence= getTopWindow().getWindowOpener().document.forms[0]["listItemSequence"];
        var vfieldAdditionalInfo= getTopWindow().getWindowOpener().document.forms[0]["addtionalInfo"];
        var hidCopyTextInfo= getTopWindow().getWindowOpener().document.forms[0]["hidCopyTextList"];
        vfieldNameListItemSequence.value=SequenceNumber;
        vfieldAdditionalInfo.value=additionalInfo;
        hidCopyTextInfo.value=hidCopyTextList;

	    var listSeparator = "<xss:encodeForJavaScript><%=filedSeparator%></xss:encodeForJavaScript>";
	    var vfieldlistSeparator=getTopWindow().getWindowOpener().document.forms[0][listSeparator].value;
	    var copytext = CopyTextArray.join(vfieldlistSeparator);
        document.createLocalCopyElement.copyText.value=copytext;
        var listID=ListItem;
        
        var tmpFieldNameActualsss = "<xss:encodeForJavaScript><%=fieldNameActual%></xss:encodeForJavaScript>";
        var tmpfieldListItemName="<xss:encodeForJavaScript><%=fieldListItemName%></xss:encodeForJavaScript>";
        if(formValid)
        {
            try {
        	 //updateBuildListNew(finalTestArray);
        	 var elementsName = getTopWindow().getWindowOpener().document.getElementsByName(tmpFieldNameActualsss);
        	 var listelementsName = getTopWindow().getWindowOpener().document.getElementsByName(tmpfieldListItemName);
        	 if(elementsName) {
        		 var copyTextfieldName = elementsName[0];
        		 copyTextfieldName.updateRTE(copytext);
        	 }
        	 if(listelementsName) {
                 var listFieldName = listelementsName[0];
                 listFieldName.value= listID;
        	 }
        	 updateBuildList();
        	 getTopWindow().closeWindow();
            }catch(e) {
            	getTopWindow().closeWindow();
        	 }
        }
}

</script>

<script language="JavaScript">

function updateBuildList()
{
    var opener = getTopWindow().getWindowOpener();
    var listCopyItems = opener.listCopyItems;
    if(!listCopyItems) return;
    listCopyItems.length = 0;
    for(var i = 0; i < tempForAllRows.length; i++)
    {
        updateAllRows(tempForAllRows[i]);
    	listCopyItems.push(tempForAllRows[i]);
    }
}

function updateAllRows(row)
{
   var sequence = document.getElementById("strSeq" + row.rowId);
   row.sequence = sequence.value;

   var AddInfo = document.getElementById("strAddInfo" + row.rowId);
   row.AddInfo = AddInfo.value;
}

function loadItemValues()
{
    var opener = getTopWindow().getWindowOpener();
   
    var listCopyItems = opener.listCopyItems;
    var listItems = new Array();
    var seqNumber = 0;
    if(!listCopyItems) return;
    for(var i=0;i<listCopyItems.length;i++)
    {
        seqNumber = parseInt(listCopyItems[i].sequence);
        seqNumber = seqNumber-1;
        listItems[seqNumber]=listCopyItems[i];

    }
    addRows1(listItems);
   
}

var template = "<table><tbody><tr id='listItem'>" +
" <td width='1' nowrap='nowrap'>" +
	   "<input type='checkbox' onclick='javascript:unCheckAll();' " +
	      "value='OBJECTID' rowid='ROWID' name='ListItemChkBox2' " +
	        "id='ListItemChkBox2'/> </td>" +
	"<td width='10' nowrap='nowrap' class='field'><input type='textbox' " +
	   "value='' id='strSeqROWID' name='strSeqROWID' size='10'/> </td>" +
	"<td width='40' nowrap='nowrap' class='field'>" +
	"<input type='hidden' id='strItemROWID' readonly='readonly' value='COPYTEXT' " +
	"name='strItemROWID'>COPYTEXTVALUE</td>  " +   
	" <td width='20' nowrap='nowrap' class='field'>" +
 "<textarea class='rte' value='' name='strAddInfoROWID' id='strAddInfoROWID' /></textarea></td></tr></tbody></table>";
//XSSOK strListItemID is arrayof selected list items.
var  rowCount       = parseInt("<%=strListItemID.size()%>");
var  allRows        = [];

var  tempForAllRows = [];


function addRows(rows)
{
  var displayList = document.getElementById("displayList");
  var tbody       = displayList.firstChild;

  for(var i = 0; i < rows.length; i++)
  {
      addRow(tbody, rows[i]);
     
  }
}

function addRow(rowParent, row)
{
   row.rowId     =  rowCount++;
   //var copyText  = row["attribute[Copy Text]"];
   var xtemplate = template.replace(/ROWID/g, row.rowId);
   xtemplate     = xtemplate.replace(/OBJECTID/g, row.id);
   var before    = xtemplate.substring(0, xtemplate.indexOf("COPYTEXT"));
   var after     = xtemplate.substring(xtemplate.indexOf("COPYTEXT") + "COPYTEXT".length);
   xtemplate     = before + row.copyText + after;
   before    = xtemplate.substring(0, xtemplate.indexOf("COPYTEXTVALUE"));
   after     = xtemplate.substring(xtemplate.indexOf("COPYTEXTVALUE") + "COPYTEXTVALUE".length);   
   xtemplate     = before + row.copyText + after;
   var div = document.createElement("div");
   div.innerHTML = xtemplate;

   var trow = div.firstChild.firstChild.rows[0];

   rowParent.appendChild(trow);

   var text = document.getElementById("strItem" + row.rowId);
   //text.value = row.copyText;

   var sequence = document.getElementById("strSeq" + row.rowId);
   sequence.value = row.sequence ? row.sequence : "";

   if(sequence.value == "")
   {
	    updateSequenceNumber(sequence,row);

   }
 
   var AddInfo = document.getElementById("strAddInfo" + row.rowId);
   AddInfo.value = row.AddInfo ? row.AddInfo : "";

   allRows.push(row);
   //allObjectIds.push(row.id);
}

function addRows1(rows)
{

  var displayList = document.getElementById("displayList");
  var tbody       = displayList.firstChild;

  for(var i = 0; i < rows.length; i++)
  {
	  var j = i + 1;
	  addRow1(tbody, rows[i], j);
  }
}

function addRow1(rowParent, row, j)
{

   var index = 1;
   
   var varTemp = 0;
   if(rowCount >= 1)
   {
	   varTemp = rowCount + 1;
   }
   else
   {
	   varTemp = rowCount - (rowCount - j);
   }
   index = index + 1;
   row.rowId     =  rowCount++;
   var xtemplate = template.replace(/ROWID/g, row.rowId);
   xtemplate     = xtemplate.replace(/OBJECTID/g, row.id);
   var before    = xtemplate.substring(0, xtemplate.indexOf("COPYTEXT"));
   var after     = xtemplate.substring(xtemplate.indexOf("COPYTEXT") + "COPYTEXT".length);
   xtemplate     = before + row.copyText + after;
   before    = xtemplate.substring(0, xtemplate.indexOf("COPYTEXTVALUE"));
   after     = xtemplate.substring(xtemplate.indexOf("COPYTEXTVALUE") + "COPYTEXTVALUE".length);   
   xtemplate     = before + row.copyText + after;
   
   var div = document.createElement("div");
   div.innerHTML = xtemplate;

   var trow = div.firstChild.firstChild.rows[0];

   rowParent.appendChild(trow);
   var text = document.getElementById("strItem" + row.rowId);
   var sequence = document.getElementById("strSeq" + row.rowId);
   sequence.value = row.sequence ? row.sequence : varTemp;
   var iSequence = null;
   var AddInfo = document.getElementById("strAddInfo" + row.rowId);
   AddInfo.value = row.AddInfo ? row.AddInfo : "";

   allRows.push(row);
   tempForAllRows = allRows;
   if($('textarea.rte',trow).length){
	     $('textarea.rte',trow).rte({
	          css: ['../common/styles/emxUIDefault.css'],
	          controls_rte: rte_toolbar,
	          controls_html: html_toolbar
	      }); 
	}
   //text.disableRTE();
  }



function updateSequenceNumber(sequence,row)
{
	
    var seqNum =row.rowId;

    seqNum =seqNum +1;	 
    
	sequence.value = seqNum;
	
}

//bw3 Done

function getIds()
{
	var xarray = [];
	var  sarr = document.getElementsByName("ListItemChkBox2");
	
    if(sarr.length)
    {
        var count =sarr.length;

        for (var i=0; i< count; i++)
        {
           	xarray.push(sarr[i].value);
        }  
    }
	return xarray.join(",");
}

function removeId(id)
{
	//remove id from here
	//allObjectIds

	var xarray = [];
	for(var i = 0; i < allRows.length; i++)
	{
		if(allRows[i].id != id)
		{
			xarray.push(allRows[i]);
		}
	}
	allRows = xarray;
}

function searchAddCopyText()
{	
	var  copyText = parent.document.getElementById('AWLtxtCopyText').value;	
	var excludeOID = "&excludeOID=" +  getIds(); //TODO : There is no sync between Master and Copy Life Cycle.Once triggers created we have to change from Preliminary to Release
	var field      = "&field=TYPES=type_ListItem:LASTREVISION=TRUE:CURRENT=policy_ArtworkElement.state_Release:AWL_COPY_TEXT="+ "*" + copyText + "*";
	showDialog('../common/emxFullSearch.jsp?formInclusionList=AWL_COPY_TEXT&table=AWLListItemSearchTable&selection=multiple&showSavedQuery=True&searchCollectionEnabled=True&HelpMarker=emxhelpfullsearch&searchmode=globalsearch&SuiteDirectory=awl&submitURL=../awl/AWLSearchListItemsProcess.jsp&HelpMarker=emxhelpfullsearch' + excludeOID + field,650,650);
}

function removeListItem()
{

	 var count=0;
	var arr=[];
	 var  sarr = document.getElementsByName("ListItemChkBox2");

	  if(sarr.length)
     {
	   for(var k=0;k<sarr.length;k++)
	   {
		   arr.push(sarr[k]);
	   }

     }
	  else
	     {
	       arr.push(sarr);
	     }
	   count=arr.length;

	   for (var i=0; i< count; i++)
       {
          //var chk=arr[i];

          if (arr[i].checked)
           {
               var tr=arr[i].parentNode.parentNode;
               tr.parentNode.removeChild(tr);
               rowCount--;
               removeId(arr[i].value);
           }
       }
}

//sk
window.onload = loadItemValues;

//End bw3
</script>

<%@include file = "../emxUICommonHeaderEndInclude.inc"%>

<%
	try
{
%>
<form name="createLocalCopyElement" method="post" action="" onsubmit="javascript:checkInput(); return false">
<input type="hidden" name="fieldNameActual" value="<xss:encodeForHTMLAttribute><%=fieldNameActual%></xss:encodeForHTMLAttribute>" />
<input type="hidden" name="fieldListItemName" value="<xss:encodeForHTMLAttribute><%=fieldListItemName%></xss:encodeForHTMLAttribute>" />
<input type="hidden" name="copyText" id= "copyText">
  <table id="displayList" width="100%" border="0" cellspacing="2" cellpadding="5"><tbody>
	<tr>
        <td width="1" nowrap="nowrap"> <input type = "checkbox" name = "checkbox2" onclick="javascript:checkSelectAll();" /></td>
		<td width="20" nowrap="nowrap" class="labelRequired">
           <!-- XSSOK I18N label or messages  -->
           <%=AWLPropertyUtil.getI18NString(context, "emxAWL.BuildListSequence.Label")%>   
        </td>
        <td width="50" nowrap="nowrap" class="label">
            <!-- XSSOK I18N label or messages  -->
            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.BuildListItem.Label")%>
        </td>
        <td width="50" nowrap="nowrap" class="label">
            <!-- XSSOK I18N label or messages  -->        
            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.BuildListAdditionalInfo.Label")%>
        </td>
	</tr>

  <%
  String strListItemId = "";
  DomainObject dobListItem = new DomainObject();
  String strCopyText = "";
  //int i = 0;
  String strSeq = "strSeq";
  String strItem = "strItem";
  String strAddInfo = "strAddInfo";
  if(strListItemID.size() > 0)
  {
     for(int i = 0; i < strListItemID.size(); i++)
     {
		  strListItemId = (String)strListItemID.get(i);
		  dobListItem.setId(strListItemId);
		  strCopyText = dobListItem.getAttributeValue(context,AWLAttribute.COPY_TEXT.get(context));
		  %>
		  <tr id="listItem">
		  <!-- XSSOK i, strListItemId : i is value for the iterator and strListItemId is array of selected list items  -->
		 <td width="1" nowrap="nowrap"><input type = "checkbox" id ="ListItemChkBox2" name = "ListItemChkBox2" rowId="<%=i%>" value = "<%=strListItemId%>" onclick="javascript:unCheckAll();"> </td>
		 <!-- XSSOK strSeq+i , strSeq+i are static value/coming from logic-->
		 <td width="20" nowrap="nowrap" class="field"><input type = "textbox" name = "<%=strSeq+i%>" id="<%=strSeq+i%>" value = "" > </td>
		 <!-- XSSOK strItem+i : static value evaluated from logic -->
		  <td width="100" nowrap="nowrap" class="field"><input type = "textarea" name = "<%=strItem+i%>" value = "<xss:encodeForHTMLAttribute><%=strCopyText%></xss:encodeForHTMLAttribute>" readonly="readonly" /></td>
		 <!-- XSSOK strAddInfo+i , strAddInfo+i are static value/coming from logic-->
		 <td width="50" nowrap="nowrap" class="field"><input type = "textbox" name = "<%=strAddInfo+i%>" id = "<%=strAddInfo+i%>" value = "" ></td>
		 </tr>
		 <%
	 }
  }
	 %>
  </tbody>
   </table>

</form>
<%
}catch(Exception e)
{
  emxNavErrorObject.addMessage(e.toString().trim());
  session.setAttribute("error.message", e.toString().trim());
}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file = "../emxUICommonEndOfPageInclude.inc" %>
<script language="JavaScript">
function checkSelectAll()
{
	var count=0;
    var arr=[];
    var  sarr = document.getElementsByName("ListItemChkBox2");

    if(sarr.length)
    {
    arr = sarr;
    }
    else
    {
      arr.push(sarr);
    }
     count=arr.length;


    if((document.createLocalCopyElement.checkbox2.checked))
      {
        for(var i = 0; i < count; i++)
           {
        	arr[i].checked=true;
           }
      }
    else
      {
        for(var i = 0; i < count; i++)
         {
        	arr[i].checked=false;
         }
      }
}
function unCheckAll()
{
    if(document.createLocalCopyElement.checkbox2.checked)
        {
         document.createLocalCopyElement.checkbox2.checked=false;
        }
}
</script>
