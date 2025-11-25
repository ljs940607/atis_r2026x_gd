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

(function($){
poaAddElementFromPOA = new function (){

    //Handler To manage Country Languages Command
    this.addElementFromComprisedPOAHandler = function() {
        'use strict';
        
        var selectedMastersOnEditView = $("div#selectElement.selectable.artworkElementCell.selected");
		if(selectedMastersOnEditView.length > 1){
			alert(POA_EDIT_LABELS['emxAWL.Error.SelectOneMaster']);
			return;
		}
        
	var selectedPOAIdArr = customEditUtil.getSelectedPOAs().split(",");
        if(selectedPOAIdArr.length == 0 || selectedPOAIdArr.length != 1) {
            alert(POA_EDIT_LABELS['emxAWL.Message.SelectSingleHeaderObject'])
            return;
        } else{

            var comprisedPOAInforMap = getSyncJSON("../resources/awl/view/customizationpoa/getcomprisedpoaInfo", "customizationPOAId="+selectedPOAIdArr);

            //Show message if customization POA doesnt have any connected POAs.
            if(Object.keys(comprisedPOAInforMap).length == 0){
                alert(POA_EDIT_LABELS['emxAWL.CustomizedPOA.POANotConnected']);
                return true;
            }
            console.log("Displaying slidein");
            customEditUtil.showSlideInDialog("30%");
            var slideInDiv= $('<div/>').attr("id","slideInDiv").css("width","30%");
            var slideInContentTable = addRemoveMaster.createSlideInArtworkMasterTable('emxAWL.Action.AddElementFromComprisedPOA', false);
            slideInDiv.append(slideInContentTable);

            //attach the new slideIn div to page and adjust working pane area width.
            $('#pageContent').append(slideInDiv);
            poaAddElementFromPOA.createDynaTree();
        }
    };

    this.getAddIconHTML = function (id,kindOf){
        var addIconSpan = $("<span/>").attr("id",id).attr("kindOf",kindOf);
        var addIcon = $("<img/>").attr("id",id).attr("src","../common/images/iconActionAdd.png");
        addIconSpan.append(addIcon);
        return addIconSpan;
    };

    this.getRemoveIconHTML = function (id,kindOf){
        var removeIconSpan = $("<span/>").attr("id",id).attr("kindOf",kindOf);
        var removeIcon = $("<img/>").attr("id",id).attr("src","../common/images/iconStatusRemoved.gif");
        removeIconSpan.append(removeIcon);
        return removeIconSpan;
    };

    //Handler:POA Header click. Need to show comprised POA detaiils.
    this.comprisedPOAClickHandler = function(e){
        'use strict';
        var clickedSpan=e.target;

        var poaId = "";
        if(($(clickedSpan).hasClass('poaName'))){
            poaId = $(clickedSpan).attr('poa_id');
        }

        if(poaId == null || poaId == '')
            return;

        //Get info of comprised POA
        var jsonPOAHeaderData = getSyncJSON("../resources/awl/view/poaservice/getpoaheaderdata", "POAIds="+poaId);
        var poaData = jsonPOAHeaderData[poaId];

        //Show message if customization POA doesnt have any connected POAs.
        var poaDisplayTable =$('<table/>').attr("id", "poaConnectedPOATable").attr("title", $(clickedSpan).text());

        poaDisplayTable.attr("class","table table-bordered table-condensed table-hover table-striped");
        poaDisplayTable.attr("style","width: 100%;");

        var thTitle=$("<th></th>").html(POA_EDIT_LABELS['emxCPD.Common.Title']);
        var thDescription=$("<th></th>").html(POA_EDIT_LABELS['emxFramework.Basic.Description']);
        var thCurrentState=$("<th></th>").html(POA_EDIT_LABELS['emxAWL.Label.CurrentState']);
        var thArtworkUsage=$("<th></th>").html(POA_EDIT_LABELS['emxAWL.Action.AWLArtworkUsage']);
        var thCountries=$("<th></th>").html(POA_EDIT_LABELS['emxAWL.Label.POACountries']);
        var thLanguages=$("<th></th>").html(POA_EDIT_LABELS['emxAWL.common.Languages']);

        var titleRow = $('<tr></tr>').append(thTitle).append($('<td>'+poaData.POA_Info.Title+'</td>'));
        var descRow = $('<tr></tr>').append(thDescription).append($('<td>'+poaData.POA_Info.Description+'</td>'));
        var currentStateRow = $('<tr></tr>').append(thCurrentState).append($('<td>'+poaData.POA_Info.current+'</td>'));
        var artworkUsageRow = $('<tr></tr>').append(thArtworkUsage).append($('<td>'+poaData.POA_Info.ArtworkUsage+'</td>'));
        var countriesRow = $('<tr></tr>').append(thCountries).append($('<td>'+poaData.CountryInfo.Name+'</td>'));
        var languagesRow = $('<tr></tr>').append(thLanguages).append($('<td>'+poaData.LanguageInfo.Name+'</td>'));

        var tableBody = $('<tbody/>').append(titleRow).append(descRow).append(currentStateRow)
                                                      .append(artworkUsageRow).append(countriesRow).append(languagesRow);

        $(poaDisplayTable).append(tableBody);
        poaDisplayTable.dialog({
            title: jQuery(this).attr("data-dialog-title"),
            closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
            close: function() { jQuery(this).remove(); },
            modal: false,
            hide: { effect: "none", duration: 150 },
            show: { effect: "none", duration: 150 },
            width: 'auto',
            height: 'auto',
            position: [e.pageX,e.pageY],
            autoResize: true
        });
    };

    this.createDynaTree = function(){

        var imagePath = "../common/images/";
        var jsonPOAHeaderData =  getSyncJSON("../resources/awl/view/customizationpoa/getComprisedPOAsHierarchy", "customizationPOAId="+customEditUtil.getSelectedPOAs());
        var artworkTreeData=jsonPOAHeaderData.returnString;
        console.log(artworkTreeData);
        $("#addArtworkMasters").dynatree({
            onActivate: function(node) {
                //This method has to be overridden in any case (dynatree).
              },

            onCustomRender: function(node) {
                var root = $("<root/>");
                var rootSpan = $("<span/>").html(node.data.title);
                var eachNode = $("<a/>").attr("anchorId",node.data.id).attr("class",'dynatree-title').addClass(node.data.kindOf);
                var containerSpan = $("<span/>").attr("class","td").attr("id",node.data.id).attr("kindOf",node.data.kindOf);
                switch(node.data.kindOf){
                    case "POA" :
                        rootSpan.attr("class","poaName").attr("poa_id", node.data.id);
                        break;
                    case "MasterType" :
                        break;
                    case "MasterCopyElement" :
                       rootSpan.attr("class","ellipsis_MC").attr("mc_id", node.data.id);
                        var localCopyNodes = node.data.children;
						var localCopyCount = localCopyNodes.length;
                        var addedElementCount = 0;
						var notApplicableElementCount = 0;
                        $.each(localCopyNodes,function(){
                            if(this.isAdded == true)
                                addedElementCount++;
							if(!this.isApplicable)
                                notApplicableElementCount++;
                        });
						
						if(node.data.isAddedByMaster) {
							var addIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id);
							addIconSpan.remove();
						} else {
							if(addedElementCount != 0) {
								if(!customEditUtil.isTableRowExists(node.data.id)) {
									var addIconSpan = poaAddElementFromPOA.getAddIconHTML(node.data.id);
									$(containerSpan).addClass("addCopy");
									$(containerSpan).removeClass("removeCopy")
									containerSpan.append(addIconSpan);
								} else {
									var addIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id);
									addIconSpan.remove();
								}
							} else if(addedElementCount == 0) {
								if(notApplicableElementCount == localCopyCount) {
									if(node.data.isAdded == false){
										var addIconSpan = poaAddElementFromPOA.getAddIconHTML(node.data.id);
										$(containerSpan).addClass("addCopy");
										$(containerSpan).removeClass("removeCopy")
										containerSpan.append(addIconSpan);
									} else {
										var addIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id);
										addIconSpan.remove();
									}
								} else {
									if(node.data.isAdded == true) {
										var addIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id);
										addIconSpan.remove();
									} else {
										var addIconSpan = poaAddElementFromPOA.getAddIconHTML(node.data.id);
										$(containerSpan).addClass("addCopy");
										$(containerSpan).removeClass("removeCopy")
										containerSpan.append(addIconSpan);
									}
								}
							}
						}
						
						if(node.data.isGraphicOrNoTranslate == "true" && node.data.isAdded == true){
                                var addIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id);
                                $(containerSpan).addClass("removeCopy");
                                $(containerSpan).removeClass("addCopy")
                                containerSpan.append(addIconSpan);
                        }

                        break;
                    case "LocalCopyElement" :
                        rootSpan.attr("lc_id", node.data.id);
                        eachNode.addClass("comprisedPOALC");
                        var parentNode = node.getParent();
                        if(node.data.isAdded == false && node.data.isApplicable == true){
                            var addIconSpan = poaAddElementFromPOA.getAddIconHTML(node.data.id,node.data.kindOf);
                            $(containerSpan).addClass("addCopy");
                            $(containerSpan).removeClass("removeCopy")
                            containerSpan.append(addIconSpan);
                        } else {
                            var removeIconSpan = poaAddElementFromPOA.getRemoveIconHTML(node.data.id,node.data.kindOf);
                            $(containerSpan).addClass("removeCopy");
                            $(containerSpan).removeClass("addCopy")
							if(!node.data.isApplicable) {
								removeIconSpan.remove();
							} else {
								containerSpan.append(removeIconSpan);
							}
                        }

                    default:
                        break;
                }
                eachNode.append(containerSpan);
                rootSpan.append(eachNode);
                root.append(rootSpan);
                return root.html();
            },

            //Handler for onClick events on each node.
            onClick:function (node, event){
                'use strict';
                var element=event.target;

                if(!$(element).hasClass('LocalCopyElement') && !$(element).hasClass('MasterCopyElement'))
                    return;

				//if($(element).hasClass('ellipsis_MC') || $(element).hasClass('dynatree-connector'))
				//return;
				
				if (!$(element).is( "a" ))
				return;
				
                // Fetching the similar anchor elements present in the Artwork Element Tree
                var anchorElements = $("[anchorId='"+node.data.id+"']");
                if(anchorElements.length > 1)
                {
                    var addedElementCounter = "";
                    $.each(anchorElements,function() {
                            var span =  this.children;
                            if($(span).hasClass("removeCopy"))
                                addedElementCounter++;
                    });

                    // Warning the users for removing the element completely from all POAs.  Trigger click will be ignored
                    if($(element.children).hasClass("removeCopy") && addedElementCounter > 1  && event.originalEvent !== undefined ) {
                                var selectedPOAHeader = $("th.POASelected").children().closest('p').text();
                                var confirmationMessage = POA_EDIT_LABELS['emxAWL.CustomizedPOA.Confirm.RemoveElement1']+selectedPOAHeader+POA_EDIT_LABELS['emxAWL.CustomizedPOA.Confirm.RemoveElement2']+selectedPOAHeader;
                                if(confirm(confirmationMessage)==false)
                                        return;
                    }
                }

                var toBeAddedIdsArray = new Array();
                var masterCopyId = "";
                var poaNode;
                var connectionId;
                var url;
                var data;
                //decide whether to add or remove element and call service.
                var innerSpan = $(element).children()[0];
                if(node.data.isAdded == false)
                {
                    // add operation needs to be done. Check whether master copy clicked or local copyId
					var isMasterCopyElementSelected = false;
                    if(node.data.kindOf == "MasterCopyElement"){
						isMasterCopyElementSelected = true;
                        masterCopyId = node.data.id;
                        showProgress(innerSpan);
                        var localCopyNodes = node.getChildren();
                        if(localCopyNodes != undefined){
                            $.each(localCopyNodes,function(){
                                if(this.data.isAdded == false){
                                    toBeAddedIdsArray.push(this.data.id);
                                    showProgress($(this.span).find('span[kindOf=LocalCopyElement]')[0]);
                                }
                            });
                        }
                        poaNode = node.getParent().getParent();
                    }
                    else
                    {
                        showProgress(innerSpan);
                        $(innerSpan).removeClass("addCopy");
                        masterCopyId = node.getParent().data.id;
                        toBeAddedIdsArray.push(node.data.id);
                        poaNode = node.getParent().getParent().getParent();
                    }
                    url = "../resources/awl/db/customizationpoa/addElementstoCustomizedPOA",
                    data = "customizationPOAId="+customEditUtil.getSelectedPOAs().split(",")[0]+"&comprisedPOAId="+poaNode.data.id+"&artworkElementIds="+toBeAddedIdsArray.join(",")+"&artworkMasterId="+masterCopyId+"&isMasterCopyElementSelected="+isMasterCopyElementSelected;
                }
                else
                {
                    // This is remove copy case.
                    poaNode = node.getParent().getParent();
                    showProgress(innerSpan);
                    if(node.data.kindOf == "MasterCopyElement" ) {
                        masterCopyId = node.data.id;
                    } else {
                        masterCopyId = node.getParent().data.id;
                    }
                    connectionId = node.data.connectionId;
                    url = "../resources/awl/db/customizationpoa/removeElementstoCustomizedPOA",
                    data = "customizationPOAId="+customEditUtil.getSelectedPOAs().split(",")[0]+"&comprisedPOAId="+poaNode.data.id+"&artworkElementIds="+node.data.id+"&artworkElementRelIds="+connectionId;
                }
                console.log("Connection Id is -->" + connectionId);
                console.log("poaId is  -->" + poaNode.data.id);
                console.log("Master copy id is -->" + masterCopyId);
                console.log("local copies array is  -->" + toBeAddedIdsArray);

                $.ajax({
                    type: "POST",
                    url: url,
                    data : data,
                    dataType: "json",
                    cache: false,
                    async: true,
                    beforeSend: function (request)
		            {
			       addSecureTokenHeader(request);
		            },
                    success: function(jsonResponse){
                                //refresh Slidein
                                if(jsonResponse.exceptionString !=="" &&  typeof(jsonResponse.exceptionString) != "undefined"){
                                    if(node.data.isAdded == false)
                                    {
                                        // add operation needs to be done. Check whether master copy clicked or local copyId
                                        if(node.data.kindOf == "MasterCopyElement"){
                                            masterCopyId = node.data.id;
                                            customEditUtil.removeProgress(innerSpan, "../common/images/iconActionAdd.png");
                                            var localCopyNodes = node.getChildren();
                                            if(localCopyNodes != undefined){
                                                $.each(localCopyNodes,function(){
                                                    if(this.data.isAdded == false){
                                                    	customEditUtil.removeProgress($(this.span).find('span[kindOf=LocalCopyElement]')[0], "../common/images/iconActionAdd.png");
                                                    }
                                                });
                                            }
                                            poaNode = node.getParent().getParent();
                                        }
                                        else
                                        {
                                        	customEditUtil.removeProgress(innerSpan, "../common/images/iconActionAdd.png");
                                            $(innerSpan).addClass("addCopy");
                                        }
                                    }
                                    alert(jsonResponse.exceptionString);
                                    return;
                                }

                                var responseObject =""
                                if(jsonResponse.returnString != "elementRemoved" ||  typeof(returnString) != "undefined"){
                                     responseObject =JSON.parse(jsonResponse.returnString);
                                }
                                var selectedCells = Array();
                                var selectedPOAIdArr = customEditUtil.getSelectedPOAs().split(",");
                                $.each(selectedPOAIdArr,function(index,value){
                                            selectedCells.push(customEditUtil.getCellId(masterCopyId,value));
                                });

                                 if(customEditUtil.isTableRowExists(masterCopyId) == false){
                                        //refresh cells
                                        customEditUtil.addNewTableRow(masterCopyId, $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
                                } else {
                                    //refresh page
                                    var selector = "td[mc_id='"+masterCopyId+"']";
                                    renderUIAfterModAssemnblyElement(selectedCells,selector);
                                }

                                //refresh cells On Remove
                                if(jsonResponse.returnString == "elementRemoved" ) {
                                customEditUtil.removeEmptyRows();
                                }

                                var addedElementCount = 0;
								var notApplicableElementCount = 0;
                                if(node.data.kindOf == "MasterCopyElement"){
                                    var localCopyNodes = node.getChildren();

                                    if(localCopyNodes != undefined){
                                        $.each(localCopyNodes,function(){
											  if(this.data.isAdded == false && this.data.isApplicable){
                                                this.data.isAdded = true;
                                                this.data.connectionId = responseObject[this.data.id];
                                              }
                                            });
                                        }
                                        node.data.isAdded = true;
										node.data.isAddedByMaster = true;
                                        if(node.data.isGraphicOrNoTranslate == "true" && node.data.isAdded == true )
                                        {
                                            if(jsonResponse.returnString == "elementRemoved") {
                                                node.data.isAdded = false;
												node.data.isAddedByMaster = false;
                                                node.data.connectionId = "";
                                            } else {
                                                node.data.connectionId = responseObject[node.data.id];
                                            }
                                        }

                                }else{
                                    if(node.data.isAdded == false){
                                        node.data.isAdded = true;
                                        node.data.connectionId = responseObject[node.data.id];
                                    } else {
                                        node.data.isAdded = false;
                                        node.data.connectionId = "";
                                    }

                                    //refreshing parent.
                                    var parentNode = node.getParent();
                                    var localCopyNodes = parentNode.getChildren();
									var localCopyCount = localCopyNodes.length;
                                    $.each(localCopyNodes,function(){
                                        if(this.data.isAdded == true){
                                            addedElementCount++;
                                        }
										if(!this.data.isApplicable) {
										  notApplicableElementCount++;
										}
                                    });
                                    
									if(addedElementCount != 0) {
										parentNode.data.isAdded = true;
									} else {
										parentNode.data.isAdded = false;
										if(!customEditUtil.isTableRowExists(parentNode.data.id))
											parentNode.data.isAddedByMaster = false;
									}
                                    parentNode.render();
                                }
                                node.render();
                                if( jsonResponse.returnString == "elementRemoved")
                                {
                                    var anchorElements = $("[anchorId='"+node.data.id+"']");
                                    $.each(anchorElements,function() {
                                           if($(this.children).hasClass('removeCopy'))
                                           {
                                                $(this.children).removeClass('removeCopy');
                                                $(this).trigger("click");
                                           }
                                    });
                                }
                        },
                        error: function(request,status,errorThrown){
                            alert(errorThrown);
                        }
                });
            },
            imagePath : imagePath,
            children : artworkTreeData,
            });
    };
};
})(jQuery);
