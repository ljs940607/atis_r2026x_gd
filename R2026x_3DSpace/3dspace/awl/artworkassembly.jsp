<%--  artworkassembly.jsp
   Copyright (c) 1992-2020 Dassault Systemes. All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
--%>

<%@page import="com.matrixone.apps.awl.util.ConnectorUtil"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@include file = "../emxRequestWrapperMethods.inc"%>
<%@page import="matrix.db.Context"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
response.setHeader("Expires", "0"); // Proxies.
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0, s-maxage=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="Sat, 01 Dec 2001 00:00:00 GMT">
<title>Artwork Assembly</title>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../webapps/VENCDjqueryUI/latest/jquery-ui.min.js"></script>
<link   href="../webapps/VENCDjqueryUI/latest/jquery-ui.css" type="text/css" rel="stylesheet" />
<!-- <script type="text/javascript" src="../common/scripts/jquery-ui.js"></script> -->
<script type="text/javascript" src="connector/scripts/qwebchannel.js"></script>
<script type="text/javascript" src="connector/scripts/diff_match_patch.js"></script>
<script type="text/javascript" src="connector/scripts/artworkassembly.js"></script>
<script type="text/javascript" src="connector/scripts/connectorUtil.js"></script>
<!-- <script type="text/javascript" src="connector/scripts/data.js"></script> -->
<script type="text/javascript" src="connector/scripts/compare_algorithm.js"></script>
<!-- <link href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" /> -->
<link rel="stylesheet" href="connector/styles/aiui.css">
<link rel="stylesheet" href="connector/styles/artworkassembly.css">

   <%
   	Context context = (Context) ServletUtil.getSessionValue(session, "ematrix.context");
       String poaName = XSSUtil.encodeForJavaScript(context, request.getParameter("poaName"));
       //By default header comes with en_US from webkit, This page will only be called from connector
       String copyElementType = "", language = "", currentState = "", artworkAssembly = "", notes = "", preview = "";
       String description = "", placeOfOrigin = "", countries = "", languages = "", refreshToolTip="", selectedElementsToTop="",revertToOriginalSorting="", content="", notHaveRequiredLicense="";
       boolean hasContext = context != null;
	   String ctxUSER = context.getUser();
       
       if(hasContext) 
	   {
	   		copyElementType = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.CopyElementType");
	   		language = AWLPropertyUtil.getI18NString(context, "emxAWL.Table.Language");
	   		currentState = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.State");
	   		artworkAssembly = AWLPropertyUtil.getI18NString(context, "emxAWL.Command.POABOM");
	   		notes = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Notes");
	   		preview = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Preview");
	   		content = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Content");
	   		description = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description");
	   		placeOfOrigin = AWLPropertyUtil.getI18NString(context, "emxAWL.Table.PlaceOfOrigin");
	   		countries = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.POACountries");
	   		languages = AWLPropertyUtil.getI18NString(context, "emxAWL.common.Languages");
	   		refreshToolTip = AWLPropertyUtil.getI18NString(context, "emxAWL.ToolTip.RefreshArtworkAssembly");
	   		selectedElementsToTop = AWLPropertyUtil.getI18NString(context, "emxAWL.Tooltip.BringSelectedElementsToTop");
			revertToOriginalSorting = AWLPropertyUtil.getI18NString(context, "emxAWL.Tooltip.revertToOriginalSorting");
	   		notHaveRequiredLicense = AWLPropertyUtil.getI18NString(context,"emxAWL.UserAction.NotHaveRequiredLicense");	   		
	   	}
   %>

<script type="text/javascript">
        var poaName =  "<%=poaName%>";
        var hasContext =  <%=hasContext%>;
		var currentUser = "<%=ctxUSER%>";
        var localePrefUsedForImport={};
		$(document).ready(function(){

            // Disable backspace key except in fields.
            $(document).keydown(function(e) {
                var elid = $(document.activeElement).is('INPUT, TEXTAREA') ;
                if (e.keyCode === 8 && !elid) {
                    if(e.ctrlKey) {
                        window.history.back();
                    } else { 
                        e.preventDefault();
                        return false;
                    }
                }
            });

        }); 

</script>
</head>


<body>
	<script>
		$.ajax({
	        url: "../resources/awl/connector/o3dconnect/hasCORLicense",
	        error:function(data){
	        	$("#error-container").removeClass("hide-container");
	        	$("#error-container").addClass("show-container");
	        },
	        success:function(data) {
	        	$("#data-container").removeClass("hide-container");
	        	$("#data-container").addClass("show-container");
				$("#addExistingElement").css("display", "none");
				$("#addExistingElementSeparator").css("display", "none");
	        }
		});
	</script>
<div id="error-container" class="error-container hide-container">
	<h2 id="noLicense">  <%=notHaveRequiredLicense%>  </h2>
</div>
<div id="data-container" class="data-container hide-container">
    <header>
    <div class="poaInfoDiv">
	<div id="actions" class="actions">
            <span id="searchCommandbtn" class="action-command">
                    <img class="action-command" src="connector/images/xml-32.png" />
            </span>
            <span id="associatePOABtn" class="action-command">
                    <img class="action-command" src="connector/images/Associate.png" />
            </span>    
            <span id="uploadGS1XML" class="action-command">
                    <img class="action-command" src="connector/images/uploadGS1XML.png"/>
            </span>  
            <span class="separator"></span>
            <span id="lockOrUnlockSpan" class="action-command">
                    <img class="action-command" src="connector/images/locked.png" onClick="lockOrUnlock(event)"/>
            </span>  
            <span class="separator"></span>
            <span id="addArtbtn" class="action-command">
                    <img class="action-command" src="connector/images/iconActionListAdd.png" onClick="addElementToPanel(event)"/>
            </span>
            <span id="removeArtbtn">
                    <img class="action-command" src="connector/images/iconActionListRemove.png" onClick="removeElementFromPanel(event)"/>
            </span>
            <span id="automap">
                    <img class="action-command" src="connector/images/Artwork_Automap_Icon.png"/>
            </span>
	    <span id="copysplit">
                    <img class="action-command" src="connector/images/copySplit.png"/>
            </span>
            <span id="multiMap" class="action-command">
                    <img class="action-command" src="connector/images/map-pin-area-multiple-512.png"/>
            </span>
            <span class="separator"></span>
            <span id="syncPanelbtn" class="action-command">
                    <img class="action-command" src="connector/images/thunder.png" onClick="syncronizeAIDocument(event)"/>
            </span>
            <span>
                    <img id="refreshCommandbtn" class="action-command" title="<%=refreshToolTip%>" onClick="refreshArtworkAssemblyTable(event)" src="connector/images/iconActionSyncStructureFromEnovia.png"/>
            </span>
            <span class="separator"></span>
            <span>
                    <img id="annotateArtbtn" class="action-command" src="connector/images/annotation-icon.png">
            </span>
			<span>
                    <img id="singleMarker" class="action-command" src="connector/images/Markericon.png">
            </span>
            <span class="separator"></span>          
            <span id="generateGS1Response" class="action-command">
                    <img class="action-command" src="connector/images/downloadGS1XML.png"/>
            </span>         
            <span id="checkinbtn" class="action-command">
                    <img class="action-command" src="connector/images/checkinfile.png" />
            </span>
            <span id="promoteTaskbtn" class="action-command">
                    <img class="action-command" src="connector/images/AWLTaskPromotion.png" />
            </span>
            <span id="addExistingElementSeparator" class="separator" style="display:none"></span>          
            <span id="addExistingElement" class="action-command" style="display:none">
                    <img class="action-command" src="connector/images/iconActionEditConnector.png"/>
            </span>         
            
        </div>
        
        <div id="poaName" class="header">
       		<div onClick="togglePOADetails(event)">
  				<img id="collapsePoa" class = "clicktoHideImage" src="connector/images/iconClickDown.png"/>
   				<img id="expandPoa" style="display:none;" class = "clicktoHideImage" src="connector/images/iconClickUp.png" />
       		</div>
        </div>        
        <div class="descriptionBox">
        	<table id="details">
	        	<tr>
	        		<td class="column"><%=description%></td>
	        		<td id="description"></td>
	        	</tr>
	        	<tr>
	        		<td class="column" id="placeoforiginLabel"><%=placeOfOrigin%></td>
	        		<td id="placeoforigin"></td>
	        	</tr>
	        	<tr id="countriesInfo">
	        		<td class="column"><%=countries%></td>
	        		<td id="countries"></td>
	        	</tr>
	        	<tr>
	        		<td class="column"><%=languages%></td>
	        		<td id="languages"></td>
	        	</tr>
        	</table>
        </div>
</div>
	</header>
    <section>
	
		<div id="artworkassembly" class="artworkassembly">
			<div class="FiltersDiv" style="clear:both">
				<span id="AssemblyFilter" style="float:right;clear:right"> 
					<img class="showHideFilterImage" id="showHideFilterImage" src="../common/images/iconActionFilter.png" style="float:right;display:inline-block" onClick="showHideFilter(event, 'artworkAssemblyTable')"/>
					<img id="clearAllFiltersButton" class="clearAllFiltersButton" src="connector/images/iconClearFilter.png" style="float:right;display:none" onClick="clearAllFilters(event, 'artworkAssemblyTable')"/>
				</span>
				<!-- <span class="clearAllFiltersSpan" onClick="clearAllFilters(event, 'artworkAssemblyTable')" style="float:right;clear:right">
					<img id="clearAllFiltersButton" class="clearAllFiltersButton" src="connector/images/removeFilter.png" style="float:right"/>
				</span> -->
				<span id="contentWrapSpan" style="float:right; cursor: pointer;" class="classWrapContentSpan" onClick="wrapColumnContent(event)">
					<img id="wrapContent" class="wrapContentImage" src="connector/images/wrap_text_white_icon.png"/>
				</span>
				
				<!--span style="float:left; clear:left; display:none" class="filterSpan" onClick="crosshighlight(event) >
							<input type="checkbox" id="hideMappedElementsInput"/>
							<label class="filterCheckbox" id="hideMappedElements" style="float:left;clear:left;margin-left:5px;margin-top:6px;"></label>
						</span-->

				<span id="crossHighlightSpantext" style="float:right; cursor: pointer;" class="classWrapContentSpantext">
					<label id="crossHighlighttext" class="crossHighlightImagetext" style="float:left;clear:left;margin-left:3px;"></label>
				</span>
						
						
				<span id="crossHighlightSpan" style="float:right; cursor: pointer;" class="classWrapContentSpan">
					<input type="checkbox" id="Cross Highlight" value= "Cross Highlight"/>
					<label id="crossHighlight" class="crossHighlightImage" style="float:left;clear:left;margin-left:5px;"></label>
				</span>
				
				<!--span id="crossHighlightSpan" style="float:right; cursor: pointer;" class="crossHighlightSpanclass">
					<img id="crossHighlightbox" class="crossHighlight"/>
				</span-->
				
			</div>
			<div id="artworkAssemblyTableDiv">
			<table id="artworkAssemblyTable" class="artworkAssemblyTable">
                <thead class="artworkAssemblyTableHead">
                    <!-- XSSOK I18N Label or Message -->
                    <th class="checkbox">
	                    <input type="checkbox" id="selectAll"/>
	                    <label class="checkboxIcon" id="selectAllCheckbox" style="float:left;clear:left;margin-left:5px"></label>
	                    <img id="revertToOriginalSortingButton" class="tableHeaderImages" src="connector/images/iconClickDown.png" onClick="revertToOriginalSorting(event, 'artworkAssemblyTable')"/>
                    </th>
                    <th class="copyElementType">
                        <span id="copyElementTypeSpan" class="tableHeaderTitle" style="float:left; clear:left;" onClick="sortColumnAlphabetically(event)">  <%= copyElementType %></span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
							<input id="copyElementsSearch" type="textbox" class="filter"/>
						</span>
                    </th>
                    <th class="tableHeaderImagesCell" id="instSeqTH">
						<span id="instSeqImageSpan" class="tableHeaderTitle" onClick="sortColumnAlphabetically(event)">
							<img class="tableHeaderImages" id="instSeqImage" src="connector/images/InstanceSequence.png" style="float:left; clear:left"/>
						</span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
								<input id="instSeqSearch" type="textbox" class="filter"/>
						</span>
					</th>
                    <!-- XSSOK I18N Label or Message -->
                    <th class="language" id="languageTH">
						<span id="languageSpan" class="tableHeaderTitle" style="float:left; clear:left;" onClick="sortColumnAlphabetically(event)">  <%= language %></span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
								<input id="languageSearch" type="textbox" class="filter"/>
						</span>
					</th>
                    
                    <th class="content"  id="contentTH"> 
						<span id="contentSpan" class="tableHeaderTitle" style="float:left; clear:left;" onClick="sortColumnAlphabetically(event)">  <%= content %> </span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
								<textarea id="contentSearch" rows="1" class="filter" style="resize:none"/></textarea>
						</span>
					</th>
                    <th class="notes"  id="notesTH">
						<span id="notesSpan" class="tableHeaderTitle" style="float:left; clear:left;" onClick="sortColumnAlphabetically(event)">  <%= notes %>  </span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
							<textarea id="notesSearch" rows="1" class="filter" style="resize:none"/></textarea>
						</span>
					</th>
                    <th class="order" id="stateHeader"> 
						<span id="stateSpan" class="tableHeaderTitle" style="float:left; clear:left;" onClick="sortColumnAlphabetically(event)">  <%= currentState %> </span>
						<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
						<span style="float:left; clear:left; display:none" class="filterSpan">
								<input id="stateSearch" type="textbox" class="filter"/>
						</span>
					</th>
                    <!-- XSSOK I18N Label or Message -->                    
                    <th class="statusColumn">
						<img  class="tableHeaderImages" src="connector/images/iconActionLinkFolder.png" onClick="sortAccordingToMappings(event)" style="display:block"/>
						<span style="float:left; clear:left; display:none" class="filterSpan" >
							<input type="checkbox" id="hideMappedElementsInput"/>
							<label class="filterCheckbox" id="hideMappedElements" style="float:left;clear:left;margin-left:5px;margin-top:6px;"></label>
						</span>
						
						<!--span class="hideMappedElementsContainer" style="float:right;">
							<img id="hideMappedElements" class="hideMappedElements" src="connector/images/iconSmallLinkedObject.png" />
						</span-->
					</th>
                </thead>
                <tbody id="artworkAssemblyTableBody"> </tbody>
            </table>
			</div>
        </div>
    </section>
	  <footer>
	    <div class="footer">
            <div class="headerInfo"><%= preview %></div>
            <div id="preview" class="preview"></div>
            <div class="headerInfo"><%= notes %></div>
            <div id="note" class="note"></div>
        </div>
	</footer>
</div>
</body>
</html>

