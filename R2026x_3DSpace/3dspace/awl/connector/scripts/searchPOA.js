var poaSearchUrl="../resources/awl/connector/o3dconnect/getPOAs";
var templateSearchUrl="../resources/awl/connector/o3dconnect/getArtworkTemplatesInHierarchy";
var poaDownloadURL="../resources/awl/connector/o3dconnect/downloadFile";
var templateDownloadURL= "../resources/awl/connector/o3dconnect/downloadFile";
var noFileImageURL = "connector/images/file-missing-ai.png";
var associateTemplate = "";

//IR-1435073-3DEXPERIENCER2026x
function setupQt(){
	 new QWebChannel(qt.webChannelTransport, function (channel) {
		 window.Q = channel.objects.poaWizard; 			
		});
}
setupQt();

function createPOAForm(){
	var form = $("<form>").attr({"method":"get", "name" : "poasearchform", "id":"poasearchform", "autocomplete":"off"});
	var select1 = $("<select>").attr({"name":"userfilter" , "id":"userfilter"});
	var select2 = $("<select>").attr({"name":"poasearchfield" , "id":"poasearchfield"});
	var opt1 = $("<option>").attr("value","assignedpoas").html(labelObj["emxAWL.command.Assigned"]);
	var opt2 = $("<option>").attr("value","allpoas").html(labelObj["emxAWL.Label.ArtworkElementsToBeAttached.All"]);
	var opt3 = $("<option>").attr("value","poaname").html(labelObj["emxAWL.Table.POAName"]);
	var opt4 = $("<option>").attr("value","artworkpackage").html(labelObj["emxAWL.Heading.ArtworkPackageArtworkElements"]);
	var opt5 = $("<option>").attr("value","poacountries").html(labelObj["emxAWL.Label.POACountries"]);
	var opt7 = $("<option>").attr("value","placeoforigin").html(labelObj["emxAWL.Table.PlaceOfOrigin"]);
	var button = $("<input>").attr({"name":"poasearchtext","id":"poasearchtext","type":"text"});
	var span = $("<span>").attr("id","poasearchbtn").addClass("spanbtn").html(labelObj["emxAWL.Command.Search"]);
	$(select1).append(opt1).append(opt2);
	$(select2).append(opt3).append(opt4).append(opt5).append(opt7);
	$(form).append(select1).append(select2).append(button).append(span);
	$(".poasearchdiv").append(form);
}
function createATForm(){

 var form = $("<form>").attr({"method":"get", "name" : "templatesearchform", "id":"templatesearchform", "autocomplete":"off"});

	var select1 = $("<select>").attr({"name":"filter" , "id":"templatefilter"});
	var select2 = $("<select>").attr({"name":"artworktemplatesearchfield" , "id":"artworktemplatesearchfield"});

	var opt1 = $("<option>").attr("value","connected").attr("selected","selected").html(labelObj["emxAWL.Label.Connected"]);
	var opt2 = $("<option>").attr("value","allinhierarchy").html(labelObj["emxAWL.Label.ArtworkElementsToBeAttached.All"]);
	var opt3 = $("<option>").attr("value","templatename").html(labelObj["emxAWL.Label.TemplateName"]);
	var opt5 = $("<option>").attr("value","assignedtopoa").html(labelObj["emxAWL.command.AssignedToPOA"]);
	var opt6 = $("<option>").attr("value","title").html(labelObj["emxCPD.Common.Title"]);
	var opt7 = $("<option>").attr("value","countries").html(labelObj["emxAWL.Label.POACountries"]);
	var opt8 = $("<option>").attr("value","placeoforigin").html(labelObj["emxAWL.Table.PlaceOfOrigin"]);

		var button = $("<input>").attr({"name":"artworktemplatesearchtext","id":"artworktemplatesearchtext","type":"text"});
		var span = $("<span>").attr("id","templatesearchbtn").addClass("spanbtn").html(labelObj["emxAWL.Command.Search"]);

		$(select1).append(opt1).append(opt2);
		$(select2).append(opt3).append(opt5).append(opt6).append(opt7).append(opt8);
		$(form).append(select1).append(select2).append(button).append(span);
		$(".templatesearchdiv").append(form);
}

function createTable() {

	var table = $("<table>").attr("id","poatable").addClass("poatable");
	var head = $("<thead>").addClass("poatablehead");
	var row = $("<tr>").addClass("poatablehead");

	var th1= $("<th>").html(labelObj["emxAWL.Common.Actions"]);
	var th2= $("<th>").html(labelObj["emxFramework.Basic.Name"]);
	var th3= $("<th>").html(labelObj["emxAWL.Label.Thumbnail"]);
	var th4= $("<th>").html(labelObj["emxFramework.Basic.State"]);
	var th5= $("<th>").html(labelObj["emxFramework.Basic.Description"]);
	var th6= $("<th>").html(labelObj["emxAWL.Table.PlaceOfOrigin"]);
	var th7= $("<th>").html(labelObj["emxAWL.Label.POACountries"]);
	var th8= $("<th>").html(labelObj["emxAWL.common.Languages"]);
	var th9= $("<th>").html(labelObj["emxAWL.Action.AWLArtworkUsage"]);
    var th10 = $("<th>").html(labelObj["emxAWL.Heading.ArtworkPackageArtworkElements"]);

	var tbody = $("<tbody>").attr("id","poaTableBody");
	row.append(th1);
	row.append(th2); row.append(th3); row.append(th4); row.append(th5); row.append(th6); row.append(th7); row.append(th8); row.append(th9); row.append(th10);

	head.append(row);
	table.append(head);
	table.append(tbody);
	$(".poatablecontainer").append(table);
}
function downloadButtonClicked(event){
	var downloadFileURL = event.target.attributes["downloadURL"].value;
	$(event.target).closest("tr").addClass("selected");
	event.stopPropagation();
	$.ajax({
		  url: downloadFileURL,
		  dataType: "json",
		  success: function(response){
		  	if(response.result=="success") {
		  		//var downloadDecision = confirm(labelObj['emxAWL.ContinueAT.Confirmation']);
                    Q.showConfirm(labelObj['emxAWL.ContinueAT.Confirmation'], function (downloadDecision) {
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
				Q.showJavaScriptAlert(labelObj['emxAWL.Common.FileNotFound']);//IR-581111 - Uniform alert box
		   }
		}
	});
}



function associateButtonClicked(event){
	$(event.target).closest("tr").addClass("selected");
	event.stopPropagation();
	Q.associatePOA($(event.target).closest("tr").attr("name"));
}

function downloadTemplateButtonClicked(event){
	var downloadFileURL = event.target.attributes["downloadURL"].value;
	$.ajax({
		  url: downloadFileURL,
		  dataType: "json",
		  success: function(response){
		  	if(response.result=="success") {
		  		associateTemplate = event.target.attributes["templatename"].value;
		  		var iframe = document.createElement("iframe");
		  		iframe.src = response.data;
		  		iframe.style.display = "none";
		  		document.body.appendChild(iframe);
		  	}
			else {
				Q.showJavaScriptAlert(labelObj['emxAWL.Common.FileNotFound']);//IR-581111 - Uniform alert box
		    }
		  }
	});
}

function addRow(row)
{
	var tr=$('<tr>').addClass('poatablerow').attr("id",row.id).attr("name",row.name).attr("revision",row.revision);
	$('#poaTableBody').append(tr);

	var downloadFileURL = poaDownloadURL+"?objectId="+row.id;
	var image = $('<img>').attr('src', 'connector/images/download.png').attr("class","download-icon").attr("onClick","downloadButtonClicked(event)").attr("downloadURL",downloadFileURL).attr("title",labelObj['emxAWL.Common.DownloadAF']);
	var associateImage = $('<img>').attr('src', 'connector/images/Associate.png').attr("class","associate-icon").attr("onClick","associateButtonClicked(event)").attr("title",labelObj['emxAWL.Common.AssociatePOA']);
	//$(image).tooltip(); 
	//$(associateImage).tooltip();
	var thumbnailImage = $("<img>").addClass("poa-thumbnail").attr("src",noFileImageURL);
	if(row.thumbnailUrl != "")
		thumbnailImage.attr("src",row.thumbnailUrl);

	var actionsTD = $("<td>").addClass("actions-cell");

	$.ajax({
		url: downloadFileURL,
		dataType: "json",
		success: function(response){
			if(response.result=="success") {
				actionsTD.append(image);
			}
		}
	});
	var nameTD = $("<td>").addClass("name-cell").html(row.name);
	var thumbnailTD = $("<td>").addClass("thumbnail-cell").append(thumbnailImage);
	var stateTD = $("<td>").addClass("state-cell").html(row.status);
	var placeOfOriginTD = $("<td>").addClass("place-of-origin-cell").html(row.placeoforigin);
	var descriptionTD = $("<td>").append(getElipsisSpanFromString(row.description, 36, "description-cell"));
	var countriesTD = $("<td>").append(getObjectSpanWithTooltip(row.countries.split(","), "countries-cell"));
	var languageTD = $("<td>").append(getObjectSpanWithTooltip(row.languages.split(","), "language-cell"));

	var artworkUsageTD = $("<td>").addClass("artwork-usage-cell").html(row.artUsage);
    var artworkPackageNameTD = $("<td>").addClass("artwork-package-name-cell").html(row.artworkPackageName);
	tr.append(actionsTD).append(nameTD)
									   .append(thumbnailTD)
									   .append(stateTD)
									   .append(descriptionTD)
									   .append(placeOfOriginTD)
									   .append(countriesTD)
									   .append(languageTD)
									   .append(artworkUsageTD)
                                       .append(artworkPackageNameTD);

	tr.click(function(){
		$(this).addClass('selected');
		$('.poasearchdiv').hide();
		$('.poatablerow').hide();
		$('.selected').show();
		$('#templatecontainer').show(400);
		updateTemplateUIFromURL(templateSearchUrl+"?poaId="+row.id);
	});
}

function updatePOATable(poaData) {

	$('#poaTableBody').empty();
	$.each(poaData, function(indx, row){
		addRow(row);
	});
}

function updatePOATableFromURL(url){
	$.ajax({
	  url: url,
	  dataType: "json",
	  context: document.body,
	  success: function(data){
	  	if(data.result=="success") {
			handleMessageBox('poatablecontainer', data.data);
			updatePOATable(data.data);
		}
		else
			Q.showJavaScriptAlert(data.data);//IR-581111 - Uniform alert box
	  }
	});
}

function updateTemplateUI(data){
    $('#templates').empty();

    $.each(data, function(indx, row){
        var url = templateDownloadURL+"?objectId="+row.id;

    var countriesArray = (row.countries).split(",");
    var countryString = row.countries;
    if(countriesArray.length > 3){
        countryString = countriesArray[0] + ", "+countriesArray[1]+ ", "+ countriesArray[2] +", +"+(countriesArray.length-3);
    }

    var thumbnailContainer = $('<div>').addClass('thumbnailcontainer contentcontainer').css('background-image',row.thumbnailUrl );
    var templateURL = $('<img>').attr('src', row.thumbnailUrl);

    var content = $('<div>').addClass('content').attr("title", row.description);//.tooltip();
    var name = $('<div>').html(row.name).addClass("template-name-thumbnail");
	content.append(name);

	var poaAssociatedString = row.poaassociated;
	if(poaAssociatedString !== "NA") {

		var poaAssociatedArray = (poaAssociatedString).split(",");
		if(poaAssociatedArray.length > 3){
			poaAssociatedString = poaAssociatedArray[0] + ", "+poaAssociatedArray[1]+ ", "+ poaAssociatedArray[2] +", +"+(poaAssociatedArray.length-3);
		}

        var poaAssociated = $('<div>').html(labelObj["emxAWL.Common.AssociatedPOA"]+': ' + poaAssociatedString);
        content.append(poaAssociated);
    }

    var placeOfOrigin = $('<div>').html(labelObj["emxAWL.Table.PlaceOfOrigin"]+': ' + row.placeoforigin);
    content.append(placeOfOrigin);
    thumbnailContainer.append(templateURL).append(content);

    var downloadImage = $('<img>').attr('src', 'connector/images/download.png').addClass("download-icon template-download").attr("onClick","downloadTemplateButtonClicked(event)").attr("downloadURL",url).attr("templatename",row.name);
    var anchror = $('<a>').append(downloadImage);

    var downDiv = $('<div>').addClass('downloadicon').append(anchror);
    thumbnailContainer.append(downDiv);
    $('#templates').append(thumbnailContainer);

    });
}

function updateTemplateUIFromURL(url){
	//alert("Makin ajax call to get artwork templates");
	//alert(url);
	$.ajax({
	  url: url,
	  dataType: "json",
	  context: document.body,
	  success: function(data){
	  	if(data.result == "success"){
	  		//alert(data);
	  		// data.result.length === 0 ? alert(labelObj['emxAWL.Common.NoATConn']) : updateTemplateUI(data.data);
	  		updateTemplateUI(data.data);
	  	}
		else
			Q.showJavaScriptAlert(data.data);//IR-581111 - Uniform alert box
		}
	});
}

 function searchTableStatic(){
	'use strict';
	var searhStringArray = $(this).val().split(/[^a-zA-Z0-9-\s]/);
	//console.log(searhStringArray);
    $(".poatablerow").each(function(){
    	$(this).hide();
    });

    var selectedField = $('#poasearchfield option:selected').attr('value');
    var selectedKey = '';
    if(selectedField == "poaname") {
      selectedKey = '.name-cell';
    }
    else if(selectedField == "artworkpackage"){
      selectedKey = '.artwork-package-name-cell'; 
    }
    else if(selectedField == "poacountries"){
      selectedKey = '.countries-cell';
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
    var cells = $("td:icontains('"+$(this).val()+"')");     // IR-594924-3DEXPERIENCER2018x
    var rows = new Array();
    $.each(cells,function(){
    	$(this).parent().show();
    });*/
}

$(document).ready(function(){
    window.onload = function () {
        //if (IS_CONNECTOR === true) {
            new QWebChannel(qt.webChannelTransport, function (channel) {
                window.Q = channel.objects.poaWizard;
            });
        //}
    }
	attachEnterKeyToSearchBox(".containermain", "poasearchtext", "poasearchbtn");
	
	$.ajax({
		url : "../resources/awl/connector/o3dconnect/getLabel",
		success : function(data){
			labelObj = $.parseJSON(data);
			createPOAForm();
			createATForm();
			createTable();
			updatePOATableFromURL(poaSearchUrl);
			$('#tileviewbtn').click(function(){
				$('.thumbnailcontainer').removeClass('thumbnailcontainer').addClass('tilecontainer');
			});

			$('#thumbnailviewbtn').click(function(){
				$('.tilecontainer').removeClass('tilecontainer').addClass('thumbnailcontainer');
			});

			$('#back').click(function(){
				$('#templatecontainer').hide(400);
				$('.selected').removeClass('selected');
				$('.poatablerow').show();
				$('.poasearchdiv').show();
			});

			$('#poasearchbtn').click(function(){
				if($('#messageDiv').length > 0)
					$('#messageDiv').text(labelObj['emxAWL.Message.Searching']);
				var queryStr=$('#poasearchform').serialize();
				var url = poaSearchUrl;
				var urlString = $("#poasearchform").serialize();
				url = url+"?"+urlString+"&isSearchInvoked=true";
				updatePOATableFromURL(url);
			});

			$('#templatesearchbtn').click(function(){
				if($('#messageDiv').length > 0)
					$('#messageDiv').text(labelObj['emxAWL.Message.Searching']);
				var poaId = getSelectedPOAId();
				var urlString = $("#templatesearchform").serialize();
				url = templateSearchUrl + "?poaId=" + poaId + "&isSearchInvoked=true&" + urlString;
				updateTemplateUIFromURL(url);
			});
		}
	});

	$(document.body).on('input', '#poasearchtext' ,searchTableStatic);
});


