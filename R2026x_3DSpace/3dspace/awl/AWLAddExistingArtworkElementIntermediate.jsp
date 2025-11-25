<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicDocument"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="matrix.db.JPO"%>
<%@page import="matrix.util.StringList"%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>


<%
boolean bIsError = false;
String action = "";
String msg = "";
String sURL = "";
	try
	{
		String strObjId = emxGetParameter(request, "objectId");
	    String strMode = emxGetParameter(request,"mode");
	    String masterType = emxGetParameter(request, "masterType");
	    String strContextObjectId[] = emxGetParameterValues(request, "emxTableRowId");
	    String suiteKey = emxGetParameter(request, "suiteKey");
	    StringList strObjectIdList = new StringList();
	    //Added by VD8 for AWL 2012x on 23 June 2011
	    if(strContextObjectId==null)
	    {
  %>    
  			<!-- XSSOK request.getHeader : Header Value -->
	    	<emxUtil:localize id="i18nId" bundle="emxProductLineStringResource" locale='<%= request.getHeader("Accept-Language") %>' />
	    	<script language="javascript" type="text/javaScript">
	          	alert("<emxUtil:i18n localize='i18nId'>emxProduct.Alert.FullSearch.Selection</emxUtil:i18n>");
	      	</script>
	    <%
	    }
	    //If the selection are made in Search results page then     
	    else
	    {
	    	String strSelectedFeatures[] = new String[strContextObjectId.length];
		    for(int i=0;i<strContextObjectId.length;i++)
		    {
	        	StringTokenizer strTokenizer = new StringTokenizer(strContextObjectId[i] ,"|");             
	        	for(int j=0;j<strTokenizer.countTokens();j++)
	        	{
		       	  	String strSelectedObject = strTokenizer.nextElement().toString();
	       	 		strSelectedFeatures[i]=strSelectedObject;
	            	strObjectIdList.addElement(strSelectedObject);
	            	break;
	        	}             
	    	}
		    String docIds = FrameworkUtil.join(strSelectedFeatures, ",");
		    StringList artworkMasterIds = new StringList();
		    if(strMode.equalsIgnoreCase("CopyElement"))
			{
				masterType = AWLType.MASTER_COPY_ELEMENT.get(context);
				artworkMasterIds = strObjectIdList;
				 
			}
		    else if(strMode.equalsIgnoreCase("GraphicElement"))
			{
	        	String csrfTokName = emxGetParameter(request, ENOCsrfGuard.CSRF_TOKEN_NAME);
	 	        String csrfTokValue = emxGetParameter(request, csrfTokName);
	 	        
	 	        String docMasterRelKey = AWLUtil.strcat("to[",AWLRel.GRAPHIC_DOCUMENT.get(context),"].from.to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.id");
	 	        StringList masterIdList = BusinessUtil.toStringList(BusinessUtil.getInfoList(context, strObjectIdList, docMasterRelKey), docMasterRelKey);
	 	        boolean inputRequired = (masterIdList.contains("") || masterIdList.contains(null)) ? true : false;
	        	
	 	        if(inputRequired) 
		        {
		       	 sURL = AWLUtil.strcat("../common/emxIndentedTable.jsp?objectId=",strObjId,"&header=emxAWL.Header.AddGraphic&subHeader=emxAWL.SubHeader.SelectGraphic&submitLabel=emxCommonButton.Done&cancelLabel=emxCommonButton.Cancel&selection=multiple&cancelButton=true&table=AWLAddExistingSelectGraphicTypes&program=AWLGraphicsElementUI:getGraphicDetails&docIds=",docIds,
		       			                      "&suiteKey=",suiteKey,"&HelpMarker=emxhelpaddingartwork&submitURL=../awl/AWLAddExistingArtworkElementPostProcess.jsp?objectId=",strObjId, "&ENOCsrfGuard.CSRF_TOKEN_NAME=", csrfTokName, "&", csrfTokName, "=", csrfTokValue,"&mode=","connectArtworkMasterGraphic&forValidation=true");
		         %>
		       	 <script>
		       	 getTopWindow().getWindowOpener().showNonModalDialog('<%=XSSUtil.encodeURLForServer(context,sURL)%>',300,300,true, '', "Large");
		       	 getTopWindow().window.closeWindow();
		       	 </script>
		      	 <%
		       	} 
	 	        else 
	 	        	strMode = "connectArtworkMasterGraphic";
			}
		    if(strMode.equalsIgnoreCase("connectArtworkMasterGraphic"))
		    {
	        	masterType = AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.get(context);
	        	String strDocId= "";
	        	for(int i=0;i<strObjectIdList.size();i++) 
	        	{
	        		if( BusinessUtil.isKindOf(context, strObjectIdList.get(i).toString(), masterType))
	 			    {
	        			strDocId = (String) strObjectIdList.get(i);
	 			    	artworkMasterIds.add(strDocId);
	 			    }
				    else
				    {
			        	Map graphicTypeMap = new HashMap();
			        	for(int j=0;j<strObjectIdList.size();j++) 
			        	{
			        		String selectValue = emxGetParameter(request, AWLUtil.strcat("getypes",strObjectIdList.get(j)));
			        		 if(BusinessUtil.isNotNullOrEmpty(selectValue)) {
			        	             graphicTypeMap.put(strObjectIdList.get(j), selectValue);
			        	    }
			        	}
						Map programMap = new HashMap();
					    programMap.put("objectId", strObjId);
					    strDocId = (String) strObjectIdList.get(i);
					    programMap.put("graphicDocIds", BusinessUtil.toStringList(strDocId));
					    programMap.put("graphicTypeMap", graphicTypeMap);
					    strDocId = (String) GraphicDocument.getMasterGraphicIDsFromDocuments(context, programMap).get(0);
	 			    	artworkMasterIds.add(strDocId);
				    }
	        	}
	        }
	       
	        sURL = AWLUtil.strcat("../awl/AWLAddExistingArtworkElementPostProcess.jsp?objectId=",strObjId,"&strSelectedFeatures=",docIds,"&masterType="+masterType+"&mode="+strMode);
	        
	        %>
			<form name="addExistingArtworkElementForm" action="<%=XSSUtil.encodeURLForServer(context,sURL)%>" method="post" >
			<%@include file="../common/enoviaCSRFTokenInjection.inc" %>
			<% 
            	for(int i=0;i<artworkMasterIds.size();i++)            		
            	{	
            		%>
            		<input type="hidden" name="masterIds" value="<xss:encodeForHTMLAttribute><%= artworkMasterIds.get(i)%></xss:encodeForHTMLAttribute>" />
	            	<% 
            	} 
            %>
     		</form>
			<% 
	        boolean isDifferentDesignResp =  ArtworkUtil.isRDODifferent(context,strSelectedFeatures,strObjId);
	    	if(isDifferentDesignResp)
	    	{
			 %> 
			 <!-- XSSOK request.getHeader : Header Value -->
			 	<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%= request.getHeader("Accept-Language") %>' />
				<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
				<script language="javascript" type="text/javaScript">
			    	var msg = confirm("<emxUtil:i18n localize='i18nId'>emxAWL.Alert.DifferentRDO</emxUtil:i18n>");                  
					if(!msg)
					{
						getTopWindow().location.href = "../common/emxCloseWindow.jsp"; 
					}  
		           	else
				    {
		        		document.addExistingArtworkElementForm.submit();
			        }
	 	     	</script>
			<%
			}
	    	else
	    	{
	    	%>
	    		<script type="text/javascript">
		    		 document.addExistingArtworkElementForm.submit();
		     	</script>
	<%
	    	}
	    }
	}
	catch(Exception e)
	{
		bIsError=true;
	    session.setAttribute("error.message", e.getMessage());
	}
	%>
	     
<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
