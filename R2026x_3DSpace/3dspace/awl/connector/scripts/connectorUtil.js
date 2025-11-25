/*
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
 */

function getCommandsImageHTML(className, imageName) {
    if (className == "" || className == "null" || className == null)
        return $("<img></img>").attr("src", "connector/images/" + imageName);
    return $("<img></img>").addClass(className).attr("src", "connector/images/" + imageName);
}

function handleMessageBox(container, data){
		var hasData = data.length > 0 ;
		var hasMessageDiv  = $('#messageDiv').length > 0;

		if(hasMessageDiv)
			$('#messageDiv').text(labelObj['emxAWL.Message.NoObjectsFound']);

		if(!hasMessageDiv && !hasData){
			var messageDiv = $('<div>').attr('id', "messageDiv").text(labelObj['emxAWL.Message.NoObjectsFound']);
			$("."+container).append(messageDiv);
		}
		 if(hasData && hasMessageDiv)
				$("#messageDiv").remove();
}

function getObjectSpanWithTooltip(objectArray, cssClass){
	if(objectArray !== undefined){
		var objectSpan = $("<span/>").addClass(cssClass);
		var objectString = objectArray.join(", ");
		if(objectArray.length > 3){
			objectSpan.attr("title", objectString);
			objectString = objectArray[0] + ", "+objectArray[1]+ ", "+ objectArray[2] +", +"+(objectArray.length-3);
		}
		objectSpan.append(objectString);
		return objectSpan;
	}
	return objectArray;
}

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function getObjectSpanWithTooltipWithFixedLength(objectArray, cssClass, lengthToEllipsis){
	if(objectArray !== undefined || objectArray !== ""){
		var objectSpan = $("<span/>").addClass(cssClass);
		var objectString = "";
		
		if(objectArray.length == 1)
			return objectArray[0];
		
		if(objectArray.length > lengthToEllipsis){
			objectSpan.attr("title", objectArray.join(", "));
			$.each(objectArray, function(count){
				objectString = objectString  + objectArray[count];
				if(count < lengthToEllipsis-1) {
					objectString = objectString + ", ";
				} else if(count == lengthToEllipsis-1){
					objectString = objectString + ", +"+(objectArray.length-lengthToEllipsis);
					return false;
				}					
			});
		}		
		objectSpan.append(objectString);
		return objectSpan;
	}
	return objectArray;
}
function getNameArrayFromJSON(objectData, key, isLanguage){
	var objectArray = Array();
	// Need to find a way to make it generic by passing name to get from paramater
    $.each(objectData, function(indx, eachObjectInfo){
		if(isLanguage){
			if(eachObjectInfo.seq)
				objectArray.push(eachObjectInfo.seq + "-" + eachObjectInfo.name);
			else
				objectArray.push((indx+1) + "-" + eachObjectInfo.name);
		}else
			objectArray.push(eachObjectInfo.name);
    });
	return objectArray;
}

function getElipsisSpanFromString(objectString, expectedlength, cssClass){
	var objectSpan = $("<span/>").addClass(cssClass);
	if(objectString.length > expectedlength) {
		tooltipString = objectString.length > 200 ? objectString.substr(0, 200)+"..." : objectString;
		objectSpan.attr("title", tooltipString);
		objectString = objectString.length > expectedlength ? objectString.substr(0, expectedlength)+"..." : objectString;
	}
	objectSpan.append(objectString);
	return objectSpan;
}

//IR - 579387 - Start
/*
 * Method to replace angular brackets with &lt; and &gt; 
 */
function decodeRTEText(enodedText){

if(enodedText){
	// Replace all angle brackets
	enodedText = enodedText.replace(/>/g, "&gt;");
	enodedText = enodedText.replace(/</g, "&lt;");
	
	// Convert RTE tags back....so that eventually only non-tag angle brackets will remain replaced
	enodedText = enodedText.replace(/&lt;b&gt;/ig,"<b>");
	enodedText = enodedText.replace(/&lt;&#x2f;b&gt;/ig,"</b>");
	enodedText = enodedText.replace(/&lt;\/b&gt;/ig,"</b>");
	enodedText = enodedText.replace(/&lt;b style="font-size: 12.8px;"&gt;/ig,"<b>");
	enodedText = enodedText.replace(/&lt;b style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<b>");
	enodedText = enodedText.replace(/&lt;b style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<b>");
	enodedText = enodedText.replace(/&lt;i&gt;/ig,"<i>");
	enodedText = enodedText.replace(/&lt;\/i&gt;/ig,"</i>");
	enodedText = enodedText.replace(/&lt;&#x2f;i&gt;/ig,"</i>");
	enodedText = enodedText.replace(/&lt;i style="font-size: 12.8px;"&gt;/ig,"<i>");
	enodedText = enodedText.replace(/&lt;i style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<i>");
	enodedText = enodedText.replace(/&lt;i style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<i>");
	enodedText = enodedText.replace(/&lt;u&gt;/ig,"<u>");
	enodedText = enodedText.replace(/&lt;\/u&gt;/ig,"</u>");
	enodedText = enodedText.replace(/&lt;&#x2f;u&gt;/ig,"</u>");
	enodedText = enodedText.replace(/&lt;u style="font-size: 12.8px;"&gt;/ig,"<u>");
	enodedText = enodedText.replace(/&lt;u style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<u>");
	enodedText = enodedText.replace(/&lt;u style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<u>");
	
	enodedText = enodedText.replace(/&lt;br&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;\/br&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;&#x2f;br&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;br\/&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;br&#x2f;&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;br \/&gt;/ig,"<br/>");
	enodedText = enodedText.replace(/&lt;br &#x2f;&gt;/ig,"<br/>");
	
    enodedText = enodedText.replace(/&lt;strong&gt;/ig,"<strong>");
    enodedText = enodedText.replace(/&lt;&#x2f;strong&gt;/ig,"</strong>");
    enodedText = enodedText.replace(/&lt;\/strong&gt;/ig,"</strong>");
	enodedText = enodedText.replace(/&lt;strong style="font-size: 12.8px;"&gt;/ig,"<strong>");
	enodedText = enodedText.replace(/&lt;strong style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<strong>");
	enodedText = enodedText.replace(/&lt;strong style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<strong>");
    enodedText = enodedText.replace(/&lt;strike&gt;/ig,"<strike>");
    enodedText = enodedText.replace(/&lt;&#x2f;strike&gt;/ig,"</strike>");
    enodedText = enodedText.replace(/&lt;\/strike&gt;/ig,"</strike>");
	enodedText = enodedText.replace(/&lt;strike style="font-size: 12.8px;"&gt;/ig,"<strike>");
	enodedText = enodedText.replace(/&lt;strike style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<strike>");
	enodedText = enodedText.replace(/&lt;strike style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<strike>");
    enodedText = enodedText.replace(/&lt;em&gt;/ig,"<em>");
    enodedText = enodedText.replace(/&lt;&#x2f;em&gt;/ig,"</em>");
    enodedText = enodedText.replace(/&lt;\/em&gt;/ig,"</em>");
    enodedText = enodedText.replace(/&lt;em style="font-size: 12.8px;"&gt;/ig,"<em>");
    enodedText = enodedText.replace(/&lt;em style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<em>");
    enodedText = enodedText.replace(/&lt;em style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<em>");
    enodedText = enodedText.replace(/&lt;sub&gt;/ig,"<sub>");
    enodedText = enodedText.replace(/&lt;&#x2f;sub&gt;/ig,"</sub>");
    enodedText = enodedText.replace(/&lt;\/sub&gt;/ig,"</sub>");
	enodedText = enodedText.replace(/&lt;sub style="font-size: 12.8px;"&gt;/ig,"<sub>");
	enodedText = enodedText.replace(/&lt;sub style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<sub>");
	enodedText = enodedText.replace(/&lt;sub style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<sub>");
	enodedText = enodedText.replace(/&lt;sup&gt;/ig,"<sup>");
    enodedText = enodedText.replace(/&lt;&#x2f;sup&gt;/ig,"</sup>");
    enodedText = enodedText.replace(/&lt;\/sup&gt;/ig,"</sup>");
	enodedText = enodedText.replace(/&lt;sup style="font-size: 12.8px;"&gt;/ig,"<sup>");
	enodedText = enodedText.replace(/&lt;sup style="font-size: 12.8px; white-space: normal;"&gt;/ig,"<sup>");
	enodedText = enodedText.replace(/&lt;sup style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"&gt;/ig,"<sup>");
	
	enodedText = enodedText.replace(/&lt;div dir=\\"rtl\\"&gt;/ig,"<div dir=\"rtl\">");
	enodedText = enodedText.replace(/&lt;div dir&#x3d;&quot;rtl&quot;&gt;/ig,"<div dir=\"rtl\">");
	enodedText = enodedText.replace(/&lt;div dir=\\'rtl\\'&gt;/ig,"<div dir=\"rtl\">");
	
	enodedText = enodedText.replace(/&lt;div dir="rtl"&gt;/ig,"<div dir=\"rtl\">");
	enodedText = enodedText.replace(/&lt;div dir&#x3d;&quot;rtl&quot;&gt;/ig,"<div dir=\"rtl\">");
	enodedText = enodedText.replace(/&lt;div dir='rtl'&gt;/ig,"<div dir=\"rtl\">");
	enodedText = enodedText.replace(/&lt;div&gt;/ig,"<div>");
	enodedText = enodedText.replace(/&lt;&#x2f;div&gt;/ig,"</div>");
	enodedText = enodedText.replace(/&lt;\/div&gt;/ig,"</div>");
	
	enodedText = enodedText.replace(/&lt;span&gt;/ig,"<span>");
    enodedText = enodedText.replace(/&lt;&#x2f;span&gt;/ig,"</span>");
    enodedText = enodedText.replace(/&lt;\/span&gt;/ig,"</span>");
	enodedText = enodedText.replace(/&lt;span dir="LTR"&gt;/ig,"<span dir=\"LTR\">");
	enodedText = enodedText.replace(/&lt;span dir&#x3d;&quot;ltr&quot;&gt;/ig,"<span dir=\"LTR\">");
	enodedText = enodedText.replace(/&lt;span dir='LTR'&gt;/ig,"<span dir=\"LTR\">");
	enodedText = enodedText.replace(/&lt;span dir="RTL"&gt;/ig,"<span dir=\"RTL\">");
	enodedText = enodedText.replace(/&lt;span dir&#x3d;&quot;rtl&quot;&gt;/ig,"<span dir=\"RTL\">");
	enodedText = enodedText.replace(/&lt;span dir='RTL'&gt;/ig,"<span dir=\"RTL\">");
	
}	
	return enodedText;
} 
//IR - 579387 - End


/*
	Method to generate the JSON for the copy text passed from server.
	@author : Raghavendra M J (R2J)
	@since : During RTE Sync highlight
*/
function generateJSONForCopytext(copyText){
	//Global variable to add the contents.
	//IR - 579387 - Start
	 copyText = decodeRTEText(copyText)
	//IR - 579387 - End
	resultArray = [];
	//Adding copy text to the div container for processing.
	var htmlContainer = $('<div></div>').html(copyText);
	for (var i = 0; i < htmlContainer.length; i++) {
		parseRTEText(htmlContainer[i], {});
	}
//	console.log("CopyText: "+ copyText);
	//console.log("JSON Value : "+ JSON.stringify(resultArray));
	var returnObject = {};
	returnObject["rteMap"] = resultArray;
	console.log("JSON Value : "+ JSON.stringify(returnObject));
		//console.log("JSON Value : "+ JSON.stringify(resultArray));
	return JSON.stringify(returnObject);
		
}

/*
	Method to parse Copy text and generate the JSON.
	@author : Raghavendra M J (R2J)
	@since : During RTE Sync highlight
*/
function parseRTEText(htmlContainer, elementJSONObject) 
{
	//console.log("TAG:  "+htmlContainer.tagName)
	
		elementJSONObject = JSON.parse(JSON.stringify(elementJSONObject));
		if ($.inArray(htmlContainer.tagName, ['B', 'b', 'strong', 'STRONG']) > -1)
			elementJSONObject.b = true;
		if ($.inArray(htmlContainer.tagName, ['I', 'i', 'em', 'EM']) > -1)
			elementJSONObject.i = true;
		if (htmlContainer.tagName === 'U')
			elementJSONObject.u = true;
		if (htmlContainer.tagName === 'SUB')
			elementJSONObject.sub = true;
		if (htmlContainer.tagName === 'DIV')
		{
			var rtlCase = htmlContainer.getAttribute("dir");
			if(rtlCase && rtlCase.indexOf("rtl") !== -1)
				elementJSONObject.rtl = true;
		}
		if (htmlContainer.tagName === 'SPAN')
		{
			var rtlCase = htmlContainer.getAttribute("dir");
			if(rtlCase && (rtlCase.indexOf("LTR") !== -1 || rtlCase.indexOf("ltr") !== -1))
				elementJSONObject.ltr = true;
		}
		if (htmlContainer.tagName === 'SUP')
			elementJSONObject.sup = true;
		if (htmlContainer.tagName === 'STRIKE')
			elementJSONObject.strike = true;
		if (htmlContainer.tagName === 'BR'){
			elementJSONObject.content = "\n";
			elementJSONObject.br = true;
			resultArray.push(Object.assign({}, elementJSONObject))
		}
		else {
			if (htmlContainer.tagName) {
				for (var i = 0; i < htmlContainer.childNodes.length; i++) {
					var child = htmlContainer.childNodes[i];
					if (child.tagName) {
						parseRTEText(child, elementJSONObject);
					} else {
						var currentChildData = child.data;						
						currentChildData = currentChildData.replace(/&amp;/g, '&');
						currentChildData = currentChildData.replace(/&gt;/g, '>');
						currentChildData = currentChildData.replace(/&lt;/g, '<');
						
						if(elementJSONObject.ltr == true && elementJSONObject.rtl == true)
							currentChildData = insertMarkUpChars(currentChildData, "rtl");
						 if(elementJSONObject.ltr == true)
							currentChildData = insertMarkUpChars(currentChildData, "ltr");
						else if(!elementJSONObject.ltr && elementJSONObject.rtl == true)
							currentChildData = insertMarkUpChars(currentChildData, "rtl");
						
						elementJSONObject.content = currentChildData;
						resultArray.push(Object.assign({}, elementJSONObject));
						//if(!(htmlContainer.tagName === 'DIV'))
							//elementJSONObject = {};
					}
				}
			} else {
				var currentChildData = htmlContainer.data;
				currentChildData = currentChildData.replace(/&amp;/g, '&');
				currentChildData = currentChildData.replace(/&gt;/g, '>');
				currentChildData = currentChildData.replace(/&lt;/g, '<');
				
				if(elementJSONObject.ltr == true && elementJSONObject.rtl == true)
					currentChildData = insertMarkUpChars(currentChildData, "rtl");
                if (elementJSONObject.ltr == true)
					currentChildData = insertMarkUpChars(currentChildData, "ltr");
				else if(!elementJSONObject.ltr && elementJSONObject.rtl == true)
					currentChildData = insertMarkUpChars(currentChildData, "rtl");
				
				elementJSONObject.content = currentChildData;
				resultArray.push(Object.assign({}, elementJSONObject));
				elementJSONObject = {};
			}	
		}
}

function insertMarkUpChars(originalString, direxString)
{
	var LTREmbedMark = "\u202A";
	var RTLEmbedMark = "\u202B";
	var directionPopMark = "\u202C";
	var LTROverrideMark = "\u202D";
	var RTLOverrideMark = "\u202E";
	
	if(direxString === "ltr"){
		originalString = RTLOverrideMark + LTREmbedMark + originalString + directionPopMark + directionPopMark + directionPopMark;
	}
	
	if(direxString === "rtl"){
		originalString = RTLOverrideMark + RTLEmbedMark + originalString + directionPopMark + directionPopMark + directionPopMark;
	}
	
	return originalString;
}

/*
	Function to attach the enter capability to the search/associate windows of POAs
	@since VR2015x.HF17
	@author Raghavendra M J (R2J)
*/
function attachEnterKeyToSearchBox(searchFormDiv, searchtext, searchBtn)
{
		 $(searchFormDiv).keypress(function(e) {
			if(e.target.id == searchtext && e.which == 13) {
				document.getElementById(searchBtn).click();
				return false;
			}
		});
}
/*
	Function to handle the select all cases in multi map / artwork assembly pages.	
	@param tableElementId - table element id
	@since VR2015x.HF17
*/
function handleSelectAllBox(tableElementId){	
	var selectAllLabelId = document.querySelector("#"+tableElementId+">thead>tr>th>label").id;
	var selectAllCheckboxId = document.querySelector("#"+tableElementId+">thead>tr>th>input").id;
	
	var tableCheckBoxIconSelector = "#"+tableElementId+" td label.checkboxIcon"	
	checkOrUnCheckSelectAllBox(tableCheckBoxIconSelector, selectAllLabelId,  selectAllCheckboxId);
}

/*
	Function to handle the select all cases in multi map / artwork assembly pages.
	@param checkBoxIconSelector - checkbox for table selector
	@param selectAllLabelElementId - select All label element id
	@param selectAllCheckBoxId - select All input check box element id
	@since VR2015x.HF17
*/
function checkOrUnCheckSelectAllBox(checkBoxIconSelector, selectAllLabelElementId, selectAllCheckBoxId)
{	
	var visibleElements = $(checkBoxIconSelector+":visible").filter(function(index, element) {
		return $(element).css('pointer-events')!='none';
	}).length;
	var hasVisibleElements = visibleElements > 0;	
	var selectedVisibleElements = $(checkBoxIconSelector+":visible.selected").length;
	
	var selectAllLabelElement = document.getElementById(selectAllLabelElementId);
	var selectAllCheckBoxElement = document.getElementById(selectAllCheckBoxId);
	
	if( hasVisibleElements && visibleElements==selectedVisibleElements) {
		selectAllCheckBoxElement.checked = true;
		selectAllLabelElement.classList.add('selected');				
	} else {
		document.getElementById(selectAllCheckBoxId).checked = false;
		if(selectAllLabelElement.classList.contains('selected'))
			selectAllLabelElement.classList.remove('selected');
	}
}
/*
	Function to Load the Promise for processing the entire file.
	@param checkBoxIconSelector - checkbox for table selector
	@param selectAllLabelElementId - select All label element id
	@param selectAllCheckBoxId - select All input check box element id
	@since VR2015x.HF17
*/
function getPromiseWithWindowQSetUp(jshelper) {
    return new Promise(
        // The resolver function is called with the ability to resolve or reject the promise
        (resolve, reject) => {
            new QWebChannel(qt.webChannelTransport, function (channel) {
                window.Q = channel.objects[jshelper];
                if (window.Q.__id__  === jshelper)
                    resolve("Q Object Loaded!");
                else
                    reject("Q Not able to Loaded!");
            });
        }
    );
}

function removeDuplicatesInArray(inpArray)
{
	var seen = {};
	return inpArray.filter(function(curr){
		if(seen[curr])
			return;
		seen[curr] = true;
		return curr;
	});
}

// IR-594924-3DEXPERIENCER2018x
jQuery.expr[':'].icontains = function(a, i, m) {
	  return jQuery(a).text().toUpperCase()
	      .indexOf(m[3].toUpperCase()) >= 0;
	};

function hasRTLTag(ele){
	
	var index = ele.indexOf('dir=\\"rtl\\">');
	if(index != -1){
		return 17;
	}
	index = ele.indexOf('dir=\"rtl\">');
	if(index != -1){
		return 15;
	}
	index = ele.indexOf('dir="rtl">');
	if(index != -1){
		return 13;
	}
	index = ele.indexOf('dir=rtl>');
	if(index != -1){
		return 11;
	}
	
	return -1;
}


function getPlainTextFromRTEText(RTEtext){
if(RTEtext){
	
	RTEtext = RTEtext.replace(/\<b\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/b\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<i\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/i\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<u\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/u\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<sub\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/sub\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<sup\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/sup\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<strike\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/strike\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<strong\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/strong\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<em\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/em\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<div\>/ig,"");
	RTEtext = RTEtext.replace(/\<div dir=\"rtl\"\>/ig,"");
	RTEtext = RTEtext.replace(/\<div dir=\'rtl\'\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/div\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<span\>/ig,"");
	RTEtext = RTEtext.replace(/\<\/span\>/ig,"");
	RTEtext = RTEtext.replace(/\<span dir=\"RTL\"\>/ig,"");
	RTEtext = RTEtext.replace(/\<span dir=\'RTL\'\>/ig,"");
	RTEtext = RTEtext.replace(/\<span dir=\'LTR\'\>/ig,"");
	RTEtext = RTEtext.replace(/\<span dir=\"LTR\"\>/ig,"");
	
	RTEtext = RTEtext.replace(/\<br\>/ig,"\n");
	RTEtext = RTEtext.replace(/\<\/br\>/ig,"");	
	RTEtext = RTEtext.replace(/\<br\/\>/ig,"\n");
	RTEtext = RTEtext.replace(/\<br \/\>/ig,"\n");
	
}	
	return RTEtext;
}


function getPlainTextFromJSONRTEText(JSONString){
	var JSONObject = JSON.parse(JSONString)
	var returnString = "";
	var RTEMap = JSONObject["rteMap"];
	
	for (var currentElem in RTEMap){
		returnString = returnString + (RTEMap[currentElem]).content;
	}
	
	return returnString;
}

var currentRowSelected;

function sortColumnAlphabetically(event){
	var targetColumn = $(event.currentTarget).closest('th');
	var table = $(event.currentTarget).parent().closest('table');
	var tableID = $(table).attr('id');
	var index = $(event.currentTarget).closest('th').index();
	var currentTH = $(event.currentTarget).closest('th');
	currentRowSelected = $(event.currentTarget).attr('id');
	
	var rows = table.find('tr:gt(0)').toArray().sort(comparerEnhanced(index));	
	
	var arrayOfSubStructured = [];
	
	
	// Remove subStructured elements
	for(var i = rows.length -1 ; i >= 0; i--){
		var currentSub = rows[i];
		if($(currentSub).attr("subSturcturedElement") ==  "true"){
			var removedSubStructure = rows.splice(i, 1);
			arrayOfSubStructured = arrayOfSubStructured.concat(removedSubStructure);
		}
	}
		arrayOfSubStructured.sort(comparerEnhanced($(this).index()));
		
    // if (currentRowSelected == "languageSpan" || "languageSpan_AA")
			// arrayOfSubStructured = arrayOfSubStructured.reverse();
		
	// Ascending or descending
	if(!$(targetColumn).attr("sorted")){
		$(targetColumn).attr("sorted", "ascending");
		$(table).find("th>.sortingImage").each(function(){
			$(this).css("display", "none");
		});
		if(tableID == "artworkAssemblyTable"){
			$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickDown.png")
			.attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.AscendingSort']).css("display", "inline-block");
		}else{
			$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickDown.png")
			.attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.AscendingSort']).css("display", "inline-block");
		}
	} else {
		if($(targetColumn).attr("sorted") == "ascending"){
			// Reverse the sort for descending
			rows = rows.reverse();
			arrayOfSubStructured = arrayOfSubStructured.reverse();
			$(targetColumn).attr("sorted", "descending");
			$(table).find("th>.sortingImage").each(function(){
				$(this).css("display", "none");
			});
			if(tableID == "artworkAssemblyTable"){
				$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickUp.png")
				.attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.DescendingSort']).css("display", "inline-block");
			}else{
				$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickUp.png")
				.attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.DescendingSort']).css("display", "inline-block");
			}
		}else if($(targetColumn).attr("sorted") == "descending"){
			$(targetColumn).attr("sorted", "ascending");
			$(table).find("th>.sortingImage").each(function(){
				$(this).css("display", "none");
			});
			if(tableID == "artworkAssemblyTable"){
				$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickDown.png")
				.attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.AscendingSort']).css("display", "inline-block");
			}else{
				$(currentTH).find(".sortingImage").attr("src", "connector/images/iconClickDown.png")
				.attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.AscendingSort']).css("display", "inline-block");
			}
		}
	}
	
	// Add subStructured elements back
	for(var i = 0; i < arrayOfSubStructured.length; i++){
		var currentSubStructure = arrayOfSubStructured[i];
		var uniqueKey_SubStructure = $(currentSubStructure).attr("UniqueKey");
		var uKLength = uniqueKey_SubStructure.length;
		var colonIndex = uniqueKey_SubStructure.indexOf(":");
		var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);
		
		for(var j = 0; j < rows.length; j++){
			var currentRow = rows[j];
			var indexOfParent;
			if($(currentRow).attr("UniqueKey") == uniqueKey_Parent){
				indexOfParent = j;
				break;
			}
		}
		break;
	}
	rows.splice(indexOfParent+1, 0, arrayOfSubStructured);
	
	//Append the rows back to the table
	for (var i = 0; i < rows.length; i++){table.append(rows[i]);}

}

function comparerEnhanced(index) {
	
	var firstLocaleSeq = Object.values(globalLanguageSeqMap).length>0? Object.values(globalLanguageSeqMap)[0]: Object.values(globalLanguageSequenceMap)[0];
	return function(a, b) {
        if (currentRowSelected == "languageSpan" ||currentRowSelected ==  "languageSpan_AA")
		{
			var valA = parseInt($(a).attr('localesequence')), valB = parseInt($(b).attr('localesequence'));
			var typeA = $(a).attr('elementtypeicon');
			var typeB = $(b).attr('elementtypeicon');
			
		if(typeA == null)
			typeA = $(a).attr('typeicon');
		if(typeB == null)
			typeB = $(b).attr('typeicon');
		
			if("NoTranslate" == typeA) {
				valA = firstLocaleSeq;
			}
			if("NoTranslate" == typeB) {
				valB = firstLocaleSeq;
			}
			return valA-valB;
		}
		else
		{
			var valA = getCellValue(a, index), valB = getCellValue(b, index);
			return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
		}
	}
}

// function comparer(index) {
    // return function(a, b) {
        // var valA = getCellValue(a, index), valB = getCellValue(b, index);
        // return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
    // }
// }

function getCellValue(row, index){ return $(row).children('td').eq(index).text(); }

function filterRows(event){
	'use strict';
	event = event || window.event;
	var table = $(event.currentTarget).closest('table');
	var tableId = $(table).attr("id");
	filterRowsHelper(tableId);
	// Handler for maintaing selections and selectAll
	handleSelectAllBox(tableId);
	
}
function multimapFilterRows(event){
	'use strict';
	event = event || window.event;
	var table = $(event.currentTarget).closest('table');
	var tableId = $(table).attr("id");
	multimapFilterRowsHelper(tableId);
	// Handler for maintaing selections and selectAll
	handleSelectAllBox(tableId);
	
}

/*var objTH = {};
function resizeTD(td)
{
	var className = $(td).attr("class").split("�")[0];
	//console.log('#className->'+className);
	
	if (!(className in objTH)){
        var tHWidth = $('.artworkAssemblyTableHead>tr>th.' + className).width();
		objTH[className] = tHWidth;
	}
    $(td).css("width", objTH[className]);
}*/

function filterRowsHelper(tableId) {
	var canHideMappedElems = $('#hideMappedElements').hasClass('selected');
	var areAllFiltersEmpty = true;
	
	
	// Show all rows first
    $("#" + tableId + ">tbody>tr").each(function () {
        var linkSpan = $(this).find("span.linkSpan");
        var bgCss = $(linkSpan).css('background-image');
        if (canHideMappedElems && /*$(this).find("span.linkSpan > img.artworkTypeImage").length == 1*/bgCss != "none") {
			$(this).hide();
		} else {
			$(this).show();
		}
	});	
	
	
	//Get all filters
	var filters = $("#"+tableId+">thead>tr>th>span>.filter");
	
	
	// Evaluate each filter in the table
	$(filters).each(function(){
		var th = $(this).closest("th");
		var index = $(th).index();
		var searchString = $(this).val();		
		var actualIndex = index+1;
		
		if(searchString != "")
			areAllFiltersEmpty = false;
		
		
		$("#"+tableId+">tbody>tr:visible").filter(function(){
			var td = $(this).find("td:nth-child("+actualIndex+")");
			var filterText = "";
			
			//filterContent attr to enable full text search and bypass ellipsis
			if($(td).attr("filterContent"))
				filterText = getPlainTextFromRTEText($(td).attr("filterContent"));  // Take filterContent attr if available
			else
				filterText = getPlainTextFromRTEText($(td).text()); // Else take the text of td
			
			
			if(filterText != undefined && filterText.toUpperCase().indexOf(searchString.toUpperCase()) == -1)
				return true;
			else
				return false;
		}).hide();
	});
	
	// Handle Icon change
	if(areAllFiltersEmpty){
		if(tableId == "assemblyElementsTable"){
			$("#showHideFilterImage_AA").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton_AA").css("display", "none");
		}else if(tableId == "mappedElementsTable"){
			$("#showHideFilterImage_M").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton_M").css("display", "none");
		}else if(tableId == "artworkAssemblyTable"){
			$("#showHideFilterImage").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton").css("display", "none");
		}
	} else {
		if(tableId == "assemblyElementsTable"){
			$("#showHideFilterImage_AA").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton_AA").css("display", "inline-block");
		}else if(tableId == "mappedElementsTable"){
			$("#showHideFilterImage_M").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton_M").css("display", "inline-block");
		}else if(tableId == "artworkAssemblyTable"){
			$("#showHideFilterImage").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton").css("display", "inline-block");
		}
	}
	
	// Handle structure - Enhancement
	$("#"+tableId+">tbody>tr:visible").each(function(){
		if($(this).attr('structuredRoot') == "true"){
			var uniqKey = $(this).attr('UniqueKey');
			
			$("#"+tableId+">tbody>tr:hidden").each(function(){
				if($(this).attr('subSturcturedElement') == 'true'){
					var uniqueKey_SubStructure = $(this).attr("UniqueKey");
					var uKLength = uniqueKey_SubStructure.length;
					var colonIndex = uniqueKey_SubStructure.indexOf(":");
					var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);

                    var linkSpan = $(this).find("span.linkSpan");
                    var bgCss = $(linkSpan).css('background-image');
                    if (uniqueKey_Parent == uniqKey && !(/*canHideMappedElems && $(this).find("span.linkSpan > img.artworkTypeImage").length == 1*/bgCss != "none"))
						$(this).show();
				}
			});
			
		}
		
		if($(this).attr('subSturcturedElement') == 'true'){
			var uniqueKey_SubStructure = $(this).attr("UniqueKey");
			var uKLength = uniqueKey_SubStructure.length;
			var colonIndex = uniqueKey_SubStructure.indexOf(":");
			var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);
			
			$("#"+tableId+">tbody>tr:hidden").each(function(){
				if($(this).attr('structuredRoot') == "true"){
					if($(this).attr('UniqueKey') == uniqueKey_Parent)
						$(this).show();
				}
			});
		}
	});
	
	
	// Handler for maintaing selections and selectAll
	handleSelectAllBox(tableId);
	
}

function multimapFilterRowsHelper(tableId) {
	var canHideMappedElems = $('#hideMappedElements').hasClass('selected');
	var areAllFiltersEmpty = true;
	
	
		// Show all rows first
    $("#" + tableId + ">tbody>tr").each(function () {
        var linkSpan = $(this).find("span.linkSpan");
        var bgCss = $(linkSpan).css('background-image');
        if (canHideMappedElems && ($(this).find("span.linkSpan > img.artworkTypeImage").length == 1 )) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});	

	
	
	//Get all filters
	var filters = $("#"+tableId+">thead>tr>th>span>.filter");
	
	var tHWidthChkBox = $('.artworkAssemblyTableHead>tr>th.checkbox').width();
	
	// Evaluate each filter in the table
	$(filters).each(function(){
		var th = $(this).closest("th");
		var index = $(th).index();
		var searchString = $(this).val();		
		var actualIndex = index+1;
		
		if(searchString != "")
			areAllFiltersEmpty = false;
		
		
		$("#"+tableId+">tbody>tr:visible").filter(function(){
			var td = $(this).find("td:nth-child("+actualIndex+")");
			var filterText = "";
			
			var chk = $(this).children().eq(0);
			
			//filterContent attr to enable full text search and bypass ellipsis
			if($(td).attr("filterContent"))
				filterText = getPlainTextFromRTEText($(td).attr("filterContent"));  // Take filterContent attr if available
			else
				filterText = getPlainTextFromRTEText($(td).text()); // Else take the text of td
			
			
			if(filterText != undefined && filterText.toUpperCase().indexOf(searchString.toUpperCase()) == -1)
				return true;
			else
			{
				//$(chk).css("width", tHWidthChkBox);
				//resizeTD(td);
				return false;
			}
		}).hide();
	});
	
	// Handle Icon change
	if(areAllFiltersEmpty){
		if(tableId == "assemblyElementsTable"){
			$("#showHideFilterImage_AA").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton_AA").css("display", "none");
		}else if(tableId == "mappedElementsTable"){
			$("#showHideFilterImage_M").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton_M").css("display", "none");
		}else if(tableId == "artworkAssemblyTable"){
			$("#showHideFilterImage").attr("src", "../common/images/iconActionFilter.png");
			$("#clearAllFiltersButton").css("display", "none");
		}
	} else {
		if(tableId == "assemblyElementsTable"){
			$("#showHideFilterImage_AA").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton_AA").css("display", "inline-block");
		}else if(tableId == "mappedElementsTable"){
			$("#showHideFilterImage_M").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton_M").css("display", "inline-block");
		}else if(tableId == "artworkAssemblyTable"){
			$("#showHideFilterImage").attr("src", "../common/images/iconActionFiltersApplied.png");
			$("#clearAllFiltersButton").css("display", "inline-block");
		}
	}
	
	// Handle structure - Enhancement
	$("#"+tableId+">tbody>tr:visible").each(function(){
		if($(this).attr('structuredRoot') == "true"){
			var uniqKey = $(this).attr('UniqueKey');
			
			$("#"+tableId+">tbody>tr:hidden").each(function(){
				if($(this).attr('subSturcturedElement') == 'true'){
					var uniqueKey_SubStructure = $(this).attr("UniqueKey");
					var uKLength = uniqueKey_SubStructure.length;
					var colonIndex = uniqueKey_SubStructure.indexOf(":");
					var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);

                    var linkSpan = $(this).find("span.linkSpan");
                    var bgCss = $(linkSpan).css('background-image');
                    if (uniqueKey_Parent == uniqKey && !(canHideMappedElems && $(this).find("span.linkSpan > img.artworkTypeImage").length == 1/*bgCss != "none"*/))
						$(this).show();
				}
			});
			
		}
		
		if($(this).attr('subSturcturedElement') == 'true'){
			var uniqueKey_SubStructure = $(this).attr("UniqueKey");
			var uKLength = uniqueKey_SubStructure.length;
			var colonIndex = uniqueKey_SubStructure.indexOf(":");
			var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);
			
			$("#"+tableId+">tbody>tr:hidden").each(function(){
				if($(this).attr('structuredRoot') == "true"){
					if($(this).attr('UniqueKey') == uniqueKey_Parent)
						$(this).show();
				}
			});
		}
	});
	
	
	// Handler for maintaing selections and selectAll
	handleSelectAllBox(tableId);
	
}


function showHideFilter(event, tableId){
	var table = $("#"+tableId);
	
	var filterSpan = $(table).find('span.filterSpan');
	
	if($(filterSpan).css('display') == "none")
		$(filterSpan).css('display', 'block');
	else if($(filterSpan).css('display') == "block")
		$(filterSpan).css('display', 'none');
	resizeHandler();
}

function clearAllFilters(event, tableId){
	'use strict';
	event = event || window.event;
	
	var filters = $("#"+tableId+">thead>tr>th>span>.filter");
	
	
	// Evaluate each filter in the table
	$(filters).each(function(){
		$(this).val("");
	});
	
	$("#"+tableId+">tbody>tr").each(function(){
		$(this).show();
	});
	
	// Handle Icon change
	if(tableId == "assemblyElementsTable"){
		$("#showHideFilterImage_AA").attr("src", "../common/images/iconActionFilter.png");
        $("#clearAllFiltersButton_AA").css("display", "none");
        if ($('#hideMappedElements').hasClass('selected'))
            $('#hideMappedElements').toggleClass('selected');
	}else if(tableId == "mappedElementsTable"){
		$("#showHideFilterImage_M").attr("src", "../common/images/iconActionFilter.png");
		$("#clearAllFiltersButton_M").css("display", "none");
	}else if(tableId == "artworkAssemblyTable"){
		$("#showHideFilterImage").attr("src", "../common/images/iconActionFilter.png");
        $("#clearAllFiltersButton").css("display", "none");
        if ($('#hideMappedElements').hasClass('selected'))
            $('#hideMappedElements').toggleClass('selected');
	}
	
	handleSelectAllBox(tableId);
}

function revertToOriginalSorting(event, tableId){
	var table = $(event.currentTarget).closest('table');
	var index = 0;
	var artworkAssemblyData = $(table).find('tbody>tr');
	var columnHeaders = $("#"+tableId+">thead>tr>th");
	
    artworkAssemblyData.sort(originalSort(tableId, false));	

	var arrayOfSubStructured = [];
	
	
	// Remove subStructured elements
	for(var i = artworkAssemblyData.length -1 ; i >= 0; i--){
		var currentSub = artworkAssemblyData[i];
		if($(currentSub).attr("subSturcturedElement") ==  "true"){
			var removedSubStructure = artworkAssemblyData.splice(i, 1);
			arrayOfSubStructured = arrayOfSubStructured.concat(removedSubStructure);
		}
	}
	
	arrayOfSubStructured = arrayOfSubStructured.sort(originalSort(tableId, false)).reverse();
	
	for(var i = 0; i < arrayOfSubStructured.length; i++){
		var currentSubStructure = arrayOfSubStructured[i];
		var uniqueKey_SubStructure = $(currentSubStructure).attr("UniqueKey");
		var uKLength = uniqueKey_SubStructure.length;
		var colonIndex = uniqueKey_SubStructure.indexOf(":");
		var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);
		
		for(var j = 0; j < artworkAssemblyData.length; j++){
			var currentRow = artworkAssemblyData[j];
			var indexOfParent;
			if($(currentRow).attr("UniqueKey") == uniqueKey_Parent){
				indexOfParent = j;
				break;
			}
		}
		
		artworkAssemblyData.splice(indexOfParent+1, 0, currentSubStructure)
	}
	
	//Append the rows back to the table
	for (var i = 0; i < artworkAssemblyData.length; i++){$(table).find('tbody').append(artworkAssemblyData[i]);}
	
	$(columnHeaders).each(function(){
		if($(this).attr("sorted")){
			$(this).removeAttr("sorted");
			$(this).find(".sortingImage").css("display", "none");
		}
	});
}

function sortArtworkAssemblyData(artworkAssemblyData, tableId) {
	artworkAssemblyData.sort(originalSort(tableId, true));
	
	// For AA table in MultiMap
	if(tableId == "assemblyElementsTable"){		
		var arrayOfSubStructured = [];	
	
		// Remove subStructured elements
		for(var i = artworkAssemblyData.length -1 ; i >= 0; i--){
			var currentSub = artworkAssemblyData[i];
			if(currentSub.subSturcturedElement ==  "true"){
				var removedSubStructure = artworkAssemblyData.splice(i, 1);
				arrayOfSubStructured = arrayOfSubStructured.concat(removedSubStructure);
			}
		}
	
		arrayOfSubStructured = arrayOfSubStructured.sort(originalSort(tableId, true)).reverse();
	
		for(var i = 0; i < arrayOfSubStructured.length; i++){
			var currentSubStructure = arrayOfSubStructured[i];
			var uniqueKey_SubStructure = currentSubStructure.UniqueKey;
			var uKLength = uniqueKey_SubStructure.length;
			var colonIndex = uniqueKey_SubStructure.indexOf(":");
			var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);
	
			for(var j = 0; j < artworkAssemblyData.length; j++){
				var currentRow = artworkAssemblyData[j];
				var indexOfParent;
				if(currentRow.UniqueKey == uniqueKey_Parent){
					indexOfParent = j;
					break;
				}
			}
	
			artworkAssemblyData.splice(indexOfParent+1, 0, currentSubStructure)
		}		
	}
}

function originalSort(tableId, isArray){
if(isArray)	{//non-jquery object
	return function(firstElement, secondElement){
		// Checking with sequence order
		var firstElementSeq = parseInt(firstElement.sequenceNumber);
		var secondElementSeq = parseInt(secondElement.sequenceNumber);
		// if NaN, assign 1000
		if(isNaN(firstElementSeq)) firstElementSeq = 1000; if(isNaN(secondElementSeq)) secondElementSeq = 1000;
		var result = firstElementSeq > secondElementSeq ? 1 : firstElementSeq < secondElementSeq ? -1 : 0
		if (!result == 0)
			return result;

		// Then check with type sequence
		var typeCompareKey = "gs1Type";
		if(tableId == "assemblyElementsTable")
			typeCompareKey = "gs1Key";
	
		result = firstElement[typeCompareKey] > secondElement[typeCompareKey] ? 1 : firstElement[typeCompareKey] < secondElement[typeCompareKey] ? -1 : 0
		if (!result == 0)
			return result;

		var firstElementInstSeq = parseInt(firstElement.instanceSequence);
		var secondElementInstSeq = parseInt(secondElement.instanceSequence);
		// Then check with instance sequence
		result = firstElementInstSeq > secondElementInstSeq ? 1 : firstElementInstSeq < secondElementInstSeq ? -1 : 0;
		if (!result == 0)
			return result;

		// Check for locale sequence
		var firstElementLocSeq = parseInt(firstElement.localeSequence);
		var secondElementLocSeq = parseInt(secondElement.localeSequence);
		return firstElementLocSeq > secondElementLocSeq ? 1 : firstElementLocSeq < secondElementLocSeq ? -1 : 0;
	}
}else{// jquery object
	return function (firstElement, secondElement) {

		// Checking with sequence order
        var firstElementSeq = parseInt($(firstElement).attr('sequenceNumber'));
        var secondElementSeq = parseInt($(secondElement).attr('sequenceNumber'));
		// if NaN, assign 1000
		if(isNaN(firstElementSeq)) firstElementSeq = 1000; if(isNaN(secondElementSeq)) secondElementSeq = 1000;
        var result = firstElementSeq > secondElementSeq ? 1 : firstElementSeq < secondElementSeq ? -1 : 0
        if (!result == 0)
            return result;

        // Then check with type sequence
        var typeCompareKey = "gs1Type";
		if(tableId == "assemblyElementsTable")
			typeCompareKey = "gs1Key";
		
        result = $(firstElement).attr(typeCompareKey) > $(secondElement).attr(typeCompareKey) ? 1 : $(firstElement).attr(typeCompareKey) < $(secondElement).attr(typeCompareKey) ? -1 : 0
        if (!result == 0)
            return result;
		
		// Then check with instance sequence
        var firstElementInstSeq = parseInt($(firstElement).attr('instanceSequence'));
        var secondElementInstSeq = parseInt($(secondElement).attr('instanceSequence'));
        result = firstElementInstSeq > secondElementInstSeq ? 1 : firstElementInstSeq < secondElementInstSeq ? -1 : 0;
        if (!result == 0)
            return result;

        // Check for locale sequence
        var firstElementLocSeq = parseInt($(firstElement).attr('localeSequence'));
        var secondElementLocSeq = parseInt($(secondElement).attr('localeSequence'));
        return firstElementLocSeq > secondElementLocSeq ? 1 : firstElementLocSeq < secondElementLocSeq ? -1 : 0;
    }
}
}


