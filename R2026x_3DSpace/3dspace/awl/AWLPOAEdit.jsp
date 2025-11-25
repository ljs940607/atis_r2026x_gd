<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@include file="../emxUICommonAppInclude.inc"%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
	
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Set"%>
<%@page import = "matrix.db.Context,matrix.db.JPO" %>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.dassault_systemes.platform.ven.jackson.core.*"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>




<html>
   <head>

        <!-- Application Metas -->
		<meta charset="UTF-8">
		
<%

String sessionTimeZone = context.getSession().getTimezone(); 
TimeZone tj = TimeZone.getTimeZone(sessionTimeZone);
int rawOffset = tj.getRawOffset();
double iClientTimeOffset = (new Double((new Double(-rawOffset)).doubleValue() / 3600000)).doubleValue();
session.setAttribute("timeZone", ""+iClientTimeOffset); 

	String typeToProcess = request.getParameter("type");
	boolean isCopyList = BusinessUtil.isNotNullOrEmpty(typeToProcess) && "CopyList".equalsIgnoreCase(typeToProcess);
	String customizedPOA = request.getParameter("isCustomizedPOA");
	boolean isCustomizedPOA = BusinessUtil.isNotNullOrEmpty(customizedPOA) && "true".equalsIgnoreCase(customizedPOA);
	String idToken="poaIds";
	if(isCopyList)
	{
		idToken="copyListId";
	}
	String poaIDs = request.getParameter(idToken);
	String isConnector = request.getParameter("connector");
%>

<%
	if(isCopyList)
	{%>
	<title>Copy List Edit</title>
	<%}
	else
	{%>
	<title>POA Edit</title>	
<%}%>
			
<link rel="stylesheet" href="../webapps/UIKIT/UIKIT.css">
<link rel="stylesheet" href="../common/styles/emxUIDynaTree.css">
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script> 
<script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
<script src="../common/scripts/emxUIPopups.js"></script>
<script type="text/javascript" src="../common/scripts/emxUITooltips.js"></script>
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<link   href="../webapps/VENCDjqueryUI/latest/jquery-ui.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../webapps/VENCDjqueryUI/latest/jquery-ui.min.js">

<script type="text/javascript" src="../webapps/WebappsUtils/WebappsUtils.js"></script>
<script type="text/javascript" src="../webapps/UIKIT/UIKIT.js"></script>		
<link rel="stylesheet" href="../webapps/UIKIT/UIKIT.css">

    <!-- Add New -->
<script type="text/javascript" src="../WebappsUtils/WebappsUtils.js"></script>
<script type="text/javascript" src="../c/UWA/js/UWA_W3C_Alone.js"></script>
<script type="text/javascript" src="../WebappsUtils/WebappsUtils.js"></script>
<script type="text/javascript" src="rte/emxUIRTE.js"></script>
<script type="text/javascript" src="rte/emxUIRTEToolbar.js"></script>
<script type="text/javascript" src="rte/emxUIConstants.js"></script>
    
<!-- <link   href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" /> -->

<!-- ** <link   href="../webapps/VENENO6WPlugins/plugins/jqueryui/latest/css/cupertino/jquery.ui.custom.min.css" type="text/css" rel="stylesheet" /> -->


<!-- <script type="text/javascript" src="../plugins/libs/jqueryui/1.10.3/js/jquery-ui.js"></script> -->
<script type="text/javascript" src="../common/scripts/jquery.dynatree.js"></script>
<script type="text/javascript" src="../cpd/regioncountry/scripts/tree.js"></script>
<script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<!-- Here used for 'require' for amd module.Declare this after main jquery.If declared before main jquery,functions like tooltip() doesn't work-->
<script type="text/javascript" src="../webapps/c/UWA/js/UWA_W3C_Alone.js"></script> 

<!-- POA Edit related CSS -->

<link rel="stylesheet" href="../awl/styles/poaedit.css">
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>
<script type="text/javascript" src="../awl/connector/scripts/qwebchannel.js"></script>
<script type="text/javascript" src="../awl/connector/scripts/diff_match_patch.js"></script>
<script type="text/javascript" src="../awl/connector/scripts/connectorUtil.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit.js"></script>
<script type="text/javascript" src="../awl/scripts/customEditUtil.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_modAssemblyElement.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_AddRemoveMaster.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_ManageGeography.js"></script>
<script type="text/javascript" src="../awl/scripts/custPOAedit_editNote.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_editNote.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_editInstanceSequence.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_AddRemovePOA.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_ConnectComprisedPOA.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_DisconnectComprisedPOA.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_AddElementFromPOA.js"></script>
<script type="text/javascript" src="../awl/scripts/copyListEdit.js"></script>
<script type="text/javascript" src="../awl/scripts/copyList_ManageGeography.js"></script>
<script type="text/javascript" src="../awl/scripts/copyList_AddRemoveMaster.js"></script>
<script type="text/javascript" src="../awl/scripts/copyList_DefineMandatoryElememts.js"></script>
<script type="text/javascript" src="../awl/scripts/copylistedit_AddRemoveCopyList.js"></script>
<script type="text/javascript" src="../awl/scripts/poaedit_editSequenceNumber.js"></script>
<script type="text/javascript" src="../awl/scripts/editStructuredElement.js"></script>

       <!-- Application JavaScript Source -->
        <script type="text/javascript">
        	
		jQuery(function(){
			POA_EDIT_LABELS = getSyncJSON("../resources/awl/util/getlabelEditScreen");
			
			require(["DS/UIKIT/Alert", "DS/UIKIT/Mask"], function(Alert, Mask){
				 alertComponent = new Alert({ visible: true, autoHide: true, hideDelay: 2000 }).inject(document.body);
				 maskComponent = Mask;
	        });
			
			IS_POA_CUSTOMIZED = <%=isCustomizedPOA%>;
			IS_CONNECTOR = <%=isConnector%>;
			defaultSequenceNumber = 999; // This is the Default Sequence Number value all the newly added artwork elements are assigned.
			sequenceData={};
			isSeqNumChanged = false;
			encodedPipeForURL = "<%=XSSUtil.encodeForURL(context, "|")%>";
			
			/*
			 * This API used to check the modified data in sequenceData object.
			 * If it found any unsaved data in the sequenceData object then it will update isSeqNumChanged to true
			 */
			updateSequenceNumberChangedFlag = function() {
				
				/* 
				 * reset isSeqNumChanged to default(false) value.
				 * Then set the flag based on the data available in the sequenceData
				 */
				isSeqNumChanged = false;
				for(var poaId in sequenceData) {
					if(checkSequenceNumberChangedInPOA(poaId)){
						isSeqNumChanged = true;
						break;
					}
				}
			}
			
			checkSequenceNumberChangedInPOAList = function(poaIdList) {
				if(isSeqNumChanged) {
					for(var i=0; i<poaIdList.length; i++) {
						if(checkSequenceNumberChangedInPOA(poaIdList[i])){
							return true;
						}
					}
				}
				return false;
			}
			
			var checkSequenceNumberChangedInPOA = function(poaId) {
				var currentPOASequenceNumberInfo = sequenceData[poaId];
				for(var copyId in currentPOASequenceNumberInfo) {
					if(currentPOASequenceNumberInfo[copyId].modifiedValue) {
						return true;
					}
				}
			}
			var pageHeader = "";
			
			 $.extend({
	        	    distinct : function(anArray) {
	        	       var result = [];
	        	       $.each(anArray, function(i,v){
	        	           if ($.inArray(v, result) == -1) result.push(v);
	        	       });
	        	       return result;
	        	    }
	        	});
	           isCopyListGlobal = <%=isCopyList%>;
	
			// Merge defaults and options, without modifying defaults
			<%if(isCopyList) {%>
				editInstance = $.extend( {}, POA_Edit_Instance, CopyList_Edit_Instance);
				addRemoveMaster = $.extend( {}, poaAddRemoveMaster, copyListAddRemoveMaster);
				manageGeography =  $.extend( {}, poaManageGeography, copyListManageGeography);
				addRemoveItemInstance = $.extend( {}, addRemovePOAInstance, addRemoveCopyListInstance);
				pageHeader = POA_EDIT_LABELS['emxAWL.Heading.CopyListEdit'];
				editNoteInstance = editNoteInstanceStandardPOA;
			<%}else {
				if(isCustomizedPOA){ %>
				editNoteInstance = $.extend({}, editNoteInstanceStandardPOA, editNoteInstanceCustPOA);
				pageHeader = POA_EDIT_LABELS['emxAWL.Heading.CustomizePOAEdit'];
			<%}else{%>
				editNoteInstance = editNoteInstanceStandardPOA;
				pageHeader = POA_EDIT_LABELS['emxAWL.Heading.POAEdit'];
				<%}%>
				editInstance = POA_Edit_Instance;
				parent.window.editInstance=POA_Edit_Instance;
				addRemoveMaster = poaAddRemoveMaster;
				manageGeography = poaManageGeography;
				addRemoveItemInstance = addRemovePOAInstance;
			<%}%>
			editElementSequenceNumber = editCopyElementSequenceNumber;
				//editInstance.createActionToolbar();
                $('#headerBlock').html(pageHeader);
				editInstance.populateTable("<%=XSSUtil.encodeForJavaScript(context, poaIDs)%>");
				customEditUtil.enableCommand("#addPOA");
				customEditUtil.enableCommand("#addCopyList");
				//customEditUtil.enableCommand("#addExistingElem");
				//customEditUtil.enableCommand("#export");
                alignScrollbar();
				$( window ).resize(alignScrollbar);
				
/* 				$(window).bind("beforeunload", function() {
					if(isSeqNumChanged) {
						this.event.returnValue = POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquenceBeforeExit'];
						return this.event.returnValue;
					}
				});  */
				
			// To prompt the user with an alert message if any unsaved Sequence numbers are present	
 			window.onbeforeunload = function (event) {
				if(isSeqNumChanged) {	
				    var message = POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquenceBeforeExit'];
				    if (typeof event == 'undefined') {
				        event = window.event;
				    }
				    if (event) {
				        event.returnValue = message;
				    }
				    return message;
				}
				};  

				
				//On select of cell enabling required commands from menu.
				$(document.body).on('click', '.changable_LC' ,editInstance.localCopyCellClickHandler);
				//To show local copy with language name , local copy Name and local copy Text
				$(document.body).on('click', '.ellipsis_LC' ,editInstance.lcLanguageEllipsisHandler);
				//To show MAster copy with base copy Flag 
				$(document.body).on('click', '.ellipsis_MC' ,customEditUtil.masterCopyEllipsisHandler);
				
				//POAHeaderCell need to be handled.
				$(document.body).on('click', '.POAHeaderCell' ,addRemoveMaster.poaHeaderCellClicked);
				// To Handle selection of Non Editable POAs
				$(document.body).on('click','.non-editable-poa',function() {addRemoveMaster.nonEditablePOAHandler(this);});
				$(document.body).on('click','.artworkElementCell',addRemoveMaster.artworkElementCellClicked); 
				//To show Artwork Usage on ellipsis 
				$(document.body).on('click', '.ellipsis_ArtworkUsage',editInstance.poaArtworkUsageEllipsis);
				//To show POA langauges with Sequence number
				$(document.body).on('click', '.ellipsis_POA_lang' ,editInstance.poaLangaugeEllipsisHandler);
				//To show POA Countries 
				$(document.body).on('click', '.ellipsis_POA_Country',editInstance.poaCountrieEllipsisHandler);
				
				//Function to handle modify Assembly button click
				$(document.body).on('click', '#modifyAssemlyElement',modifyAssemlyElementHandler);
				//addArtworkMaster
				$(document.body).on('click', '#addArtworkMaster',addRemoveMaster.addArtworkMasterHandler);
				$(document.body).on('click', '#btnSaveAssembly' ,saveManageLC);
				
				
				$(document.body).on('click', '#clear' ,editInstance.clearSelection);
				$(document.body).on('click', '#selectAll', editInstance.selectAllHeaderHandler);
                $(document.body).on('click', '#selectAllElements', editInstance.selectAllElementsHandler);
				$(document.body).on('click', '#removePOA', addRemoveItemInstance.removePOAHandler);
				$(document.body).on('click', '#removeCopyList', addRemoveItemInstance.removePOAHandler);
				$(document.body).on('click', '#addPOA', addRemoveItemInstance.addPOAHandler);
				$(document.body).on('click', '#addCopyList', addRemoveItemInstance.addPOAHandler);
				//create Master Copy Element
				$(document.body).on('click', '#createMasterCopyElement',addRemoveMaster.createMasterCopyElement);
				$(document.body).on('click', '#createGraphicElement',addRemoveMaster.createGraphicElement);
				$(document.body).on('click','.dynatree-checkbox',addRemoveMaster.handleProductSelection);
				$(document.body).on('change','#fromCopyList',addRemoveMaster.switchAddArtworkMaster);
				$(document.body).on('change','#fromHierarchy',addRemoveMaster.switchAddArtworkMaster);
				$(document.body).on('click', '#addExistingElem',addRemoveMaster.addExistingElemHandler);
				$(document.body).on('click', '#addExistingCL',editInstance.addExistingCLHandler);
				// Adding KeyBoard shortcuts to create an Graphic Element or Copy Element
				document.onkeyup=function(e){
					if(e.altKey && e.keyCode==71){
						addRemoveMaster.createGraphicElement();
					}
					else if(e.altKey && e.keyCode== 69){
						addRemoveMaster.createMasterCopyElement();
					}
				}
				//Manage Country Languages command Handler
				$(document.body).on('click', '#manageCountryLanguages',manageGeography.manageCountryLanguagesHandler);
				//Define mandatory elements on copylist
				$(document.body).on('click', '#defineMandatoryElements',defineMandtoryElementsInstance.defineMandatoryElementsHandler);
				$(document.body).on('click', '#btnSaveMandatoryInformation' ,defineMandtoryElementsInstance.saveMandatoryInformation);
				//Remove all Master Copy Handler
				$(document.body).on('click', '#removeAllHeaderIcon', removeAllArtworkMasterFromPOAs);
				$(document.body).on('change', '#toggleLanguages', ToggleLanguagesSelection);
				$(document.body).on('change', '.languageCheckBox', LanguageSelectionChangedHandler);
				$(document.body).on("keyup","#addArtworkMasterFilter",addArtworkMasterFilterHandler);
				$(document.body).on('input', '#poaEditPageFilter', editInstance.filterPOAEditPage);
				
				$(document.body).on('focus','.seqNumberInputBox',editElementSequenceNumber.enableSequenceNumberEdit);
				$(document.body).on('click','#resequenceElements',function() {editElementSequenceNumber.resetSequenceNumber(this);});
				$(document.body).on('click','#saveSequenceNumber',function() {editElementSequenceNumber.editSequenceNumber(this);});
				$(document.body).on('click','.sortBySequenceOrder',function() {editElementSequenceNumber.sortBySequenceNumber(this);});
				$(document.body).on('click','.poaName',function() {editElementSequenceNumber.sortBySequenceNumber(this);});
				
				$(document.body).on('click','#editNote',function() { editNoteInstance.editNote(this);});
				/* SUG-R2J Is not required as per suggestion needs to be implemented -- */
					$(document.body).on('click','#editNotesSpan',function() { customEditUtil.getNotesInfo(this);});
				
				$(document.body).on('click','#editInstanceSequence',function(){editSequenceInstance.editInstanceSeq(this);});
				$(document.body).on('click','#removeArtworkMaster',function() {addRemoveMaster.removeArtworkMaster(this);}); 
				
				if(Browser.MOBILE) {
					$(document.body).on('touchstart','.ctxmenu',editInstance.positionContextMenu);
					$(document.body).on('touchmove','*',editInstance.hideContextMenuOnMove);
				} else {
					$(document.body).on('mouseover', '.ctxmenu', editInstance.positionContextMenu);
					$(document.body).on('mouseout', '.ctxmenu', editInstance.hideContextMenu);
				}
				<%if(isCustomizedPOA){%>
				$(document.body).on('click', '#connectComprisedPOA', poaConnectComprised.connectComprisedPOAHandler);
				$(document.body).on('click', '#disconnectComprisedPOA', poaDisconnectComprised.disconnectComprisedPOAHandler);
				$(document.body).on('click', '#addElementFromComprisedPOA', poaAddElementFromPOA.addElementFromComprisedPOAHandler);
				$(document.body).on('click', '.removeConnectedPOA',poaDisconnectComprised.removeConnectedPOAHandler);
				$(document.body).on('click', '.poaName',poaConnectComprised.poaHeaderClickHandler);
				$(document.body).on('click', '.poaName', poaAddElementFromPOA.comprisedPOAClickHandler);
				$(document.body).on('click', '#structuredElement', editStructuredElementInstance.showNutritionFactsDetails);
				
				<%}%>
				
				$('#editTable tbody').scroll(function(e) {
				    $('#editTableHeader').css("left", -$("#editTable tbody").scrollLeft()); //fix the thead relative to the body scrolling
				    $('#editTable thead th:nth-child(1)').css("left", $("#editTable tbody").scrollLeft()); //fix the first cell of the header
				    $('#editTable tbody td:nth-child(1)').css("left", $("#editTable tbody").scrollLeft()); //fix th
			});
				
				var a = $('.POAHeaderCell:first').find('.sortBySequenceOrder'); // This is to sort the Table based on First POA/CLs Seq Numb values
				$(a).click(); 
				
				$(document).tooltip();
				
			}); 
		//get the POAs ID
		function getPOAsID(){
			'use strict';
			return "<%=XSSUtil.encodeForJavaScript(context, poaIDs)%>";
		}
		
		//close the slidein window
		function closeSlideInWindow(){
			'use strict';
			enableWorkingArea();
		}
		
        function alignScrollbar() { // API which will set Height and Width of Tbody on resize
            var fixedHeaderAndToolbarHeight = $('#headerBlock').height()+$('#actionToolbarDiv').height()+$('#editTableHeader').height(); // The Fixed Headers and Toolbars height in the page
			var currHeight = $(window).height();
			var currWidth = $(window).width();
			var newHeight = currHeight - fixedHeaderAndToolbarHeight;
            var FixedHeaderWidth = $('#elementTypeCell').width() + $('.display-name-header').width() + $('.content-cell-header').width();
			var remainingWidth = currWidth - FixedHeaderWidth;
            var numberOfPOAs = $('.POAHeaderCell').length;
            var newWidthForPOAHeader = (remainingWidth)/numberOfPOAs;
			if(newHeight>0){
		        $('#editTable>tbody').css('height',newHeight+"px");
			}
			
			if(numberOfPOAs<=5 && newWidthForPOAHeader>200){
				$('.POAHeaderCell,.cell-selectable').css('width',newWidthForPOAHeader+"px"); 
				//console.log("Current Value :- "+lastHeaderWidth);
				$('#editTable>tbody>tr>th:last').css('width',$('#editTable>thead>tr>th:last').css('width')); // Leaving some gap after the last POA/CL header to align with the vertical scrollbar
				//console.log("New Value :- "+$('#editTable>thead>tr>th:last').css('width')); 
			}
			$(elementTypeCell).css('height',$(".edit-table-header.content-cell-header").height()+"px"); // Making the First Header cells height equal to the second or third header cell 
			var poaHeaderWidth = $($('.POAHeaderCell')[0]).css('width');
			$('.POAHeaderCell>.poaName').each( function(){
				$(this).css('width',parseInt(poaHeaderWidth)-30);
			});
			editInstance.handleHeaderScrollBar();
        }
		
		//grey out working area
		//send width string as parameter
		function greyOutWorkingArea(width){
			'use strict';
			$('#editTableDiv').attr('style',' float:left;');
			$('#editTable').attr('style','pointer-events: none;');
			$('#actionToolbarDiv').attr('style','pointer-events: none;');
			$("#editTableDiv").width(width);
		}
		//enable working area
		function enableWorkingArea(){
			'use strict';
			$('#editTable').attr('style','pointer-events: auto;');
			$('#actionToolbarDiv').attr('style','pointer-events: auto;');
			$("#editTableDiv").width("100%");    
			$("#slideInDiv").remove();
		}
		//close popup
        function closeWindow(){
			getTopWindow().close();
		}
		
		//function to set slidein width
		function setSlideInWidth(width){
			'use strict';
			$("#slideInDiv").attr("style","width:"+width+";");
		}
        
        function eventFire(el, etype){ // RRR1 - Added to create a click event
         	if (el.fireEvent) {
                el.fireEvent('on' + etype);
           }else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
           }
         }
       
      
	
        </script>
        
      </head>
      <body>
      
	  <div id="pageContent">
	  		<div id="headerBlock"> </div>
			<div id="workingPane">
			<div id='actionToolbarDiv'></div>
				<div id='editTableDiv'></div>
			</div>
				  </div>
	</body>
</html>
