<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Multimap Elements</title>
	<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
	<script type="text/javascript" src="../webapps/VENCDjqueryUI/latest/jquery-ui.min.js"></script>
	<link   href="../webapps/VENCDjqueryUI/latest/jquery-ui.css" type="text/css" rel="stylesheet" />
<!--<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>-->
	<script type="text/javascript" src="connector/scripts/qwebchannel.js"></script>
	<script type="text/javascript" src="connector/scripts/diff_match_patch.js"></script>
	<script type="text/javascript" src="connector/scripts/artworkassembly.js"></script>
    <script type="text/javascript" src="connector/scripts/connectorUtil.js"></script>
	<script type="text/javascript" src="connector/scripts/compare_algorithm.js"></script>
	<script type="text/javascript" src="connector/scripts/multimap.js"></script>

<!--<link href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" />-->
	<link rel="stylesheet" href="../awl/styles/multimap.css">
	<link rel="stylesheet" href="connector/styles/aiui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
	<div id="container" class="container">
		<div id="toolbarContainer">
            <div id="commandsContainer">
			<span id="addElement" class="action-command">
				<img id="addElementImg" class="action-command" src="connector/images/iconActionListAdd.png" onClick="addElement(true)" title="Map Element"/>
			</span>
			<span id="removeElement">
				<img id="removeElementImg" class="action-command" src="connector/images/iconActionListRemove.png" onClick="removeElement()" title="Remove/Un-Map Element"/>
			</span>
			
			<span id="moveUp" class="action-command">
				<img id="moveUpImg" class="action-command" src="connector/images/up.png" onClick="moveElementUp()" title="Move Up"/>
			</span>
			<span id="moveDown" class="action-command">
				<img id="moveDownImg" class="action-command" src="connector/images/down.png" onClick="moveElementDown()" title="Move Down"/>
			</span>
			<span class="separator"></span>
			<span id="addMarker" class="action-command">
				<img id="addMarkerImg" class="action-command" src="connector/images/newMarker.png" onClick="addMarker()" title="Add Marker"/>
			</span>
			<span id="defaultMarkerValueSpan" class="action-command">
				<span id="defaultMarkerValueLabel">Default Marker Value:</span>
				<textarea rows="1" cols="15" maxlength="1024" class="defaultMarkerValue" id="defaultMarkerValue"></textarea>
			</span>
			<span id="massUpdate" class="action-command">
				<img id="massUpdateImg" class="action-command" src="connector/images/iconActionMassApproval.png" onClick="updateMarkerValuesEnMasse()" title="Update en masse"/>
			</span>
			<span id="autoAddMarkers" class="action-command">
				<input id="autoAddMarkersCheckBox" type="checkbox">
				<label id="autoAddMarkersCheckboxLabel" class="checkboxIcon"></label>
			</span>
			<span class="separator"></span>
			<span id="syncElements" class="action-command">
				<img id="syncElementsImg" class="action-command" src="connector/images/thunder.png" onClick="syncElements()" title="Sync"/>
			</span>
			<span id="refreshElements" class="action-command">
				<img id="refreshElementsImg" class="action-command" src="connector/images/iconSynchronization.png" onClick="updateArtworkAssemblyContent()" title="Refresh"/>
			</span>
			<span class="separator"></span>
            <span id="textFrameNameContainer"><span id="textFrameNameContainerLabel"> Text Area Name </span> <input type="text" class="textFrameName" id="textFrameName" size="10"> </span>
			<div id="filterContainer">
					<button type="button" id="applyButton" value="Save" onclick="exportPreview()">Save</button>
					<label id="collapseCopyElementsGrid" onClick="toggleCopyElements(event)" style="float:right;display:inline-block" class= "expandCopyGrid"></label>
					<img class="showHideFilterImage" id="showHideFilterImage_M" src="../common/images/iconActionFilter.png" style="float:right;display:inline-block" onClick="showHideFilter(event, 'mappedElementsTable')"/>
					<img id="clearAllFiltersButton_M" class="clearAllFiltersButton" src="connector/images/iconClearFilter.png" style="float:right;display:none" onClick="clearAllFilters(event, 'mappedElementsTable')"/>
                    <!-- <span id="markupFilter">
					<input type="text" class="filter" id="mapFilter"> <span id="markupFilterLabel"> Filter </span></span> -->
                    <!--<div id="applyButtonContainer"></div>-->
            </div>
			</div>
		</div><!-- toolbar-container -->
		<div id="mappedElementsContainer" class="mapped-elements-container"><!-- mapped-elements-container -->
            <div id="mappedElementsTableContainer">
                <table id="mappedElementsTable">
					<thead>                
						<tr id="mappedElementsHeaderRow">
							<th class="mappedElementsHeaderCell checkbox"><input id="mappedElementsSelectAll" type="checkbox">
								<label id="mappedElementsSelectAllCheckbox" class="checkboxIcon selectAllLabel"></label>
							</th>
							<!-- <th class="mappedElementsHeaderCell typeIcon">Type</th> -->
							<th class="mappedElementsHeaderCell elementType">
								<span id="elementTypeSpan" class="tableHeaderTitle" style="float:left; clear:left;">Element</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="copyElementsSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="mappedElementsHeaderCell instSeq">
								<span id="instSeqSpan" class="tableHeaderTitle" style="float:left; clear:left;">
									<img class="tableHeaderImages" id="instSeqImage1" src="connector/images/InstanceSequence.png" style="float:left; clear:left"/>
								</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="instSeqSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="mappedElementsHeaderCell language">
								<span id="languageSpan" class="tableHeaderTitle" style="float:left; clear:left;">Language_Loca</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="languageSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="mappedElementsHeaderCell state">
								<span id="stateSpan" class="tableHeaderTitle" style="float:left; clear:left;">State</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="stateSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="mappedElementsHeaderCell copyTextContent">
								<span id="copyTextContentSpan" class="tableHeaderTitle" style="float:left; clear:left;">Artwork File Content</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<textarea id="copyTextContentSearch" rows="1" class="filter" style="resize:none"/></textarea>
								</span>
							</th>
							<th class="mappedElementsHeaderCell experienceContent">
								<span id="experienceContentSpan" class="tableHeaderTitle" style="float:left; clear:left;">3DEXPERIENCE Content</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<textarea id="experienceContentSearch" rows="1" class="filter" style="resize:none"/></textarea>
								</span>
							</th>
							<th class="mappedElementsHeaderCell syncIndicator showSyncIcon" id="syncIndicator"></th>
						</tr>
					</thead>
					<tbody id="mappedElementsTableBody"></tbody>
                </table>
            </div>
        </div><!-- mapped-elements-container -->
		
        <div id="availableElementsContainer">
			<div onClick="togglePOADetails(event)" class="showHideContainer">
  				<img id="collapseAvailableData" class = "clicktoHideImage" src="connector/images/iconClickUp.png"/ title="Collapse">
   				<img id="expandAvailableData" style="display:none;" class = "clicktoHideImage" src="connector/images/iconClickDown.png" title="Expand" />
   			</div>

			<div id="premapElementsContainer" class="premap-elements-container">
			
				<div class="label premapPanelHeaderContainer">
					<h3 id="premapPanelHeading"> Type Assignment </h3>
					<label id="collapsePremapPanel" onClick="toggleAvailableElements(event)" class = "collapsePremap" style="float:right"></label>
					<img class="showHideFilterImage" id="showHideFilterImage_P" src="../common/images/iconActionFilter.png" style="float:right;display:inline-block" onClick="showHidePremapFilter(event)"/>
					<img id="clearAllFiltersButton_P" class="clearAllFiltersButton" src="connector/images/iconClearFilter.png" style="float:right;display:none" onClick="clearPremapFilter(event)"/>
                </div>
				<div id="premapToolbar" class="label">
				<span id="premapFilterSpan">
					<span id="premapFilterSpanLabel"> Element Type </span>
					<input type="text" id="premapFilter" style="display:none"></span>
				</div>

			</div><!-- premap-elements-container -->
			<div id="assemblyElementsContainer" class="assembly-elements-container">

                
				<div id="artworkAssemblyToolbar" class="label">
                    <label id="collapseAssemblyPanel" onClick="toggleAvailableElements(event)" class= "collapseAssembly"></label>
                    <h3 id="artworkAssemblyHeader">POA Artwork Assembly </h3>
                    <span id="AssemblyFilter"> 
						<img class="showHideFilterImage" id="showHideFilterImage_AA" src="../common/images/iconActionFilter.png" style="float:right;display:inline-block" onClick="showHideFilter(event, 'assemblyElementsTable')"/>
						<img id="clearAllFiltersButton_AA" class="clearAllFiltersButton" src="connector/images/iconClearFilter.png" style="float:right;display:none" onClick="clearAllFilters(event, 'assemblyElementsTable')"/>
					</span>
					<span id="contentWrapSpan" style="float:right; cursor: pointer;" class="classWrapContentSpan" onClick="wrapColumnContent(event)">
					<img id="wrapContent" class="wrapContentImage" style="width:20x;height:20px" src="connector/images/wrap_text_white_icon.png"/>
					</span>
					<!--span class="hideMappedElementsContainer" style="float:right;cursor:pointer;">
						<img id="hideMappedElements"  onClick="hideMappedElements(event, true)" class="hideMappedElements" src="connector/images/iconSmallLinkedObject.png" style="float:right"/>
					</span-->
                </div>
                
				<div id="assemblyElementsTableContainer">
					<table id="assemblyElementsTable">
						<thead>
							<th class="ArtworkAssemblyHeaderCell AssemblyInputHeaderCell">
                                <input id="assemblyPanelSelectAll" type="checkbox" name="">
                                <label id="AssemblySelectAllCheckbox" class="checkboxIcon selectAllLabel" style="float:left;clear:left;margin-left:5px"></label>
								<img id="revertToOriginalSortingButton" class="tableHeaderImages" src="connector/images/iconClickDown.png" onClick="revertToOriginalSorting(event, 'assemblyElementsTable')"/>
                            </th>
                                
                            <!-- <th class="ArtworkAssemblyHeaderCell AssemblyTypeIconHeaderCell">Type</th> -->
							<th class="ArtworkAssemblyHeaderCell AsemblyTypeHeaderCell">
								<span id="elementTypeSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">Element Type</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="copyElementsSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyISHeaderCell">
								<span id="instSeqSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">
									<img class="tableHeaderImages" id="instSeqImage2" src="connector/images/InstanceSequence.png" style="float:left; clear:left"/>
								</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="instSeqSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyLanguageHeaderCell">
								<span id="languageSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">Language</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="languageSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyContentHeaderCell">
								<span id="copyTextContentSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">Content</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<textarea id="copyTextContentSearch" rows="1" class="filter" style="resize:none"/></textarea>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyNotesHeaderCell">
								<span id="notesSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">Notes</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<textarea id="notesSearch" rows="1" class="filter" style="resize:none"/></textarea>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyStateHeaderCell">
								<span id="stateSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer" onClick="sortColumnAlphabetically(event)">State</span>
								<img class="sortingImage" id="sortingImage" src="connector/images/iconClickDown.png" style="float:right;display:none"/>
								<span style="float:left; clear:left; display:none" class="filterSpan">
									<input id="stateSearch" type="textbox" class="filter"/>
								</span>
							</th>
							<th class="ArtworkAssemblyHeaderCell AssemblyLinkHeaderCell">
								<span id="linkSpan_AA" class="tableHeaderTitle" style="float:left; clear:left;cursor:pointer">
									<img  class="linkSpanImg" src="connector/images/iconActionLinkFolder.png"/>
								</span>
								<span style="float:left; clear:left; display:none" class="filterSpan" >
							<input type="checkbox" id="hideMappedElementsInput"/>
							<label class="filterCheckbox" id="hideMappedElements" style="float:left;clear:left;margin-left:5px;margin-top:6px;"></label>
						</span>
							</th>
						</thead>
					</table>
				</div>
				<div id="assemblyElementPreview" class="label"><span >Preview :</span></div>
				<div id="assemblyElementNotes" class="label"><span >Notes :</span></div>
				
			</div><!-- assembly-elements-container -->
		</div><!-- availableElementsContainer -->
		<div id="previewContainer" class="preview-container">
		    <div onClick="togglePOADetails(event)" class="showHideContainer">
  				<img id="collapsePreview" class = "clicktoHideImage" src="connector/images/iconClickUp.png" title="Collapse"/>
   				<img id="expandPreview" style="display:none;" class = "clicktoHideImage" src="connector/images/iconClickDown.png" title="Expand"/>
   			</div>

            <h3 id="previewHeader">Combined Text Preview</h3>
            <div id="previewElementsContainer"> </div>

        </div>
        <div id="currentContentPreviewContainer" class="current-preview-container">
		    <div onClick="togglePOADetails(event)" class="showHideContainer">
  				<img id="currentDataCollapsePreview" class = "clicktoHideImage" src="connector/images/iconClickUp.png" title="Collapse"/>
   				<img id="currentDataExpandPreview" style="display:none;" class = "clicktoHideImage" src="connector/images/iconClickDown.png" title="Expand"/>
   			</div>

            <h3 id="currentContentPreviewHeader">Selected Text Area - Current Content</h3>
            <div id="currentContentPreviewElementsContainer"> </div>

        </div><!-- preview-container -->
                    <div id="footerButtons">
			<button type="button" id="footerSaveButton" value="Apply" onclick="exportPreviewAndClose()">OK</button>
             <button type="button" id="footerCancelButton" value="Apply" onclick="closeMultiMapDialog()">Cancel</button>
        </div>
<!--        <div id="footerToolbar">
            <button value="OK" id="getElementsnfo" onclick="getElementsInfo()">OK</button>
        </div>-->
	</div><!-- container -->
</body>
</html>
