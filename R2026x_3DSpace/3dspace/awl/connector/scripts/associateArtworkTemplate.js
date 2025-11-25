var templateSearchUrl="../resources/awl/connector/o3dconnect/getArtworkTemplates";
var templateDownloadURL= "../resources/awl/connector/o3dconnect/downloadFile";
var noFileImageURL = "connector/images/file-missing-ai.png";
function setupQt()
{
	 new QWebChannel(qt.webChannelTransport, function (channel) {
		 window.Q = channel.objects.eNOWebView;
		 $(document).ready(function(){
			 
			 attachEnterKeyToSearchBox(".containermain", "artworktemplatesearchtext", "templatesearchbtn");

				$.ajax({
					url : "../resources/awl/connector/o3dconnect/getLabel",
					success : function(data){
						labelObj = $.parseJSON(data);
						createForm();
						createBody();
						updateArtworkTemplateTableFromURL(templateSearchUrl);
						$('#templatesearchbtn').click(function(){
							if($('#messageDiv').length > 0)
									$('#messageDiv').text(labelObj['emxAWL.Message.Searching']);
							var url = templateSearchUrl + "?isSearchInvoked=true&" + $("#templatesearchform").serialize();
							updateArtworkTemplateTableFromURL(url);
						});

					}
				});
				$(document.body).on('input', '#artworktemplatesearchtext' ,searchTableStatic);
			});
		});
}
setupQt();
function createForm(){
	var form = $("<form>").attr({"method":"get", "name" : "templatesearchform", "id":"templatesearchform", "autocomplete":"off"});
	var select = $("<select>").attr({"name":"artworktemplatesearchfield" , "id":"artworktemplatesearchfield"});
	var opt1 = $("<option>").attr("value","templatename").html(labelObj["emxAWL.Label.ArtworkTemplate"]);
	var opt2 = $("<option>").attr("value","title").html(labelObj["emxCPD.Common.Title"]);
	var opt3 = $("<option>").attr("value","placeoforigin").html(labelObj["emxAWL.Table.PlaceOfOrigin"]);
	var opt4 = $("<option>").attr("value","assignedtopoa").html(labelObj["emxAWL.command.AssignedToPOA"]);

	var button = $("<input>").attr({"name":"artworktemplatesearchtext","id":"artworktemplatesearchtext","type":"text"});
	var span = $("<span>").attr("id","templatesearchbtn").addClass("spanbtn").html(labelObj["emxAWL.Command.Search"]);
	$(select).append(opt1).append(opt2).append(opt3).append(opt4);
	$(form).append(select).append(button).append(span);
	$(".templatesearchdiv").append(form);
}

function createBody(){
	var table = $("<table>").attr("id","artworkTemplateTable").addClass("poatable");
	var head = $("<thead>").addClass("poatablehead");
	var row = $("<tr>").addClass("poatablehead");

	var th1= $("<th>").html(labelObj["emxAWL.Common.Actions"]);
	var th2= $("<th>").html(labelObj["emxFramework.Basic.Name"]);
	var th3= $("<th>").html(labelObj["emxAWL.Label.Thumbnail"]);
	var th4= $("<th>").html(labelObj["emxFramework.Basic.State"]);
	var th5= $("<th>").html(labelObj["emxFramework.Basic.Description"]);
	var th6= $("<th>").html(labelObj["emxAWL.Table.PlaceOfOrigin"]);
	var th7= $("<th>").html(labelObj["emxAWL.Common.AssociatedPOA"]);
	var th8= $("<th>").html(labelObj["emxAWL.Label.POACountries"]);
    var th9 = $("<th>").html(labelObj["emxCPD.Common.Title"]);

	var tbody = $("<tbody>").attr("id","artworkTemplateBody"); //artworkTemplateBody
    row.append(th1).append(th2).append(th9).append(th3).append(th4).append(th5).append(th6).append(th7).append(th8);
	table.append(tbody);
	head.append(row);
	table.append(head);
	$(".artwork-template-table-container").append(table);
}

function downloadButtonClicked(event){
	'use strict';
	var downloadFileURL = event.target.attributes["downloadURL"].value;
	$(event.target).closest("tr").addClass("selected");
	event.stopPropagation();
	$.ajax({
		url: downloadFileURL,
		dataType: "json",
		success: function(response){
			if(response.result=="success") {
				//	updateTemplateUI(data.data);

				//var downloadDecision = confirm(labelObj['emxAWL.Common.ATDownloaded']);
                Q.showConfirm(labelObj['emxAWL.Common.ATDownloaded'], function (downloadDecision) {
                    if (downloadDecision) {
                        var iframe = document.createElement("iframe");
                        iframe.src = response.data;
                        iframe.style.display = "none";
                        document.body.appendChild(iframe);
                    }
                    /*else {
                        //do nothing
                    }
                    //return false;*/
                });
			}
			else {
				//IR-581111 - Uniform alert box
				Q.showJavaScriptAlert(labelObj['emxAWL.Common.FileNotFound']);
			}
		}
	});
}

function associateButtonClicked(event){
	'use strict';
	$(event.target).closest("tr").addClass("selected");
	event.stopPropagation();
	Q.associatePOASlot($(event.target).closest("tr").attr("name"));
}

function addRow(row)
{
	var tr=$('<tr>').addClass('poatablerow').attr("id",row.id).attr("name",row.name).attr("revision",row.revision);
	$('#artworkTemplateBody').append(tr);

	var url = templateDownloadURL+"?objectId="+row.id;
	var image = $('<img>').attr('src', 'connector/images/download.png').attr("class","download-icon").attr("onClick","downloadButtonClicked(event)").attr("downloadURL",url).attr("title",labelObj['emxAWL.Common.DownloadTemplate']);
	var associateImage = $('<img>').attr('src', 'connector/images/Associate.png').attr("class","associate-icon").attr("onClick","associateButtonClicked(event)").attr("title",labelObj['emxAWL.Tooltip.AssociateArtworkTemplate']);
	//$(image).tooltip();
	//$(associateImage).tooltip();
	var thumbnailImage = $("<img>").addClass("poa-thumbnail").attr("src",noFileImageURL);
	if(row.thumbnailUrl != "")
		thumbnailImage.attr("src",row.thumbnailUrl);

	var actionsTD = $("<td>").addClass("actions-cell");
	actionsTD.append(associateImage);

	var nameTD = $("<td>").append(getElipsisSpanFromString(row.name, 20, "name-cell"));
	var thumbnailTD = $("<td>").addClass("thumbnail-cell").append(thumbnailImage);
	var stateTD = $("<td>").addClass("state-cell").html(row.status);	
	var descriptionTD = $("<td>").append(getElipsisSpanFromString(row.description, 36, "description-cell"));
	var placeOfOriginTD = $("<td>").addClass("place-of-origin-cell").html(row.placeoforigin);
	var poaAssociatedTD = $("<td>").append(getObjectSpanWithTooltip(row.poaassociated.split(","), "poa-associated-cell"));
	var countriesTD = $("<td>").append(getObjectSpanWithTooltip(row.countries.split(","), "countries-cell"));
    var titleTD = $("<td>").addClass("title-cell").html(row.title);

	
    tr.append(actionsTD).append(nameTD).append(titleTD)
        .append(thumbnailTD)
        .append(stateTD)
        .append(descriptionTD)
        .append(placeOfOriginTD)
        .append(poaAssociatedTD)
        .append(countriesTD);                                  
}

function updateArtworkTemplateTable(poaData) {
	'use strict';
	$('#artworkTemplateBody').empty();
	$.each(poaData, function(indx, row){
		addRow(row);
	});
}

function updateArtworkTemplateTableFromURL(url){
	'use strict';
	$.ajax({
		url: url,
		dataType: "json",
		context: document.body,
		success: function(data){
			if(data.result=="success"){
				handleMessageBox('artwork-template-table-container', data.data);
				updateArtworkTemplateTable(data.data);
		}
			else
				Q.showJavaScriptAlert(data.data);//IR-581111 - Uniform alert box
		}
	});
}


function searchTableStatic(){
	'use strict';
	var searhStringArray = $(this).val().split(/[^a-zA-Z0-9-\s]/);
	console.log(searhStringArray);
	$(".poatablerow").each(function(){
		$(this).hide();
	});

    var selectedField = $('#artworktemplatesearchfield option:selected').attr('value');
    var selectedKey = '';
    if(selectedField == "templatename") {
      selectedKey = '.name-cell';
    }
    else if(selectedField == "title"){
      selectedKey = '.title-cell';
    }
    else if(selectedField == "assignedtopoa"){
      selectedKey = '.poa-associated-cell';
    }
    else if(selectedField == "placeoforigin"){
      selectedKey = '.place-of-origin-cell';
    }

     $('TD').each(function() {
        var cellText = "";
        if($(this).is(selectedKey)) {
	        cellText = $(this).text();
            if(cellText.search(new RegExp(searhStringArray, "i"))!=-1){
	             $(this).parent().show();
            }
        }
        else if ($(this).find(selectedKey).length){
          cellText = $(this).find(selectedKey).text();
          if(cellText.search(new RegExp(searhStringArray, "i"))!=-1){
	        $(this).parent().show();
          }
        }
     });

	/*var cells = new Array();
	var cells = $("td:icontains('"+$(this).val()+"')");      // // IR-594924-3DEXPERIENCER2018x
	var rows = new Array();
	$.each(cells,function(){
		$(this).parent().show();
	});*/
}



