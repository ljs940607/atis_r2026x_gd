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

editStructuredElementInstance   = new function() {
        /*
            This method is to show the Structured Element Details
            author : Raghavendra M J (R2J)
        */
        this.showNutritionFactsDetails = function(e) {
            'use strict';
            var clickedSpan=e.target;

            var masterId = $(clickedSpan).attr('masterCopyId');
            if(masterId == null || masterId == '')
                return;

            var artworkMasterData =  "";
                $.ajax({
                    url : "../resources/awl/view/structure/"+masterId,
                    type: "GET",
                    success : function(data) {
                                artworkMasterData= data;
                                editStructuredElementInstance.buildDialogForStruturedElements(e, artworkMasterData, clickedSpan);
                            }
                    });
        };

        /*
            Builds Dialog For Strutured Elements
            author : Raghavendra M J (R2J)
        */
        this.buildDialogForStruturedElements =function(e, artworkMasterData, clickedSpan){

            var tableHeadertext = artworkMasterData.rootStructuredElementInfo.rootType + " ( " + artworkMasterData.rootStructuredElementInfo.rootMarketingName + " )";

            var structuredElementTable = $("<table>").attr("id","structuredElementTable")
                                                                                               .attr("title",  tableHeadertext);
            structuredElementTable = editStructuredElementInstance.getDialogContentForStructuredElements(structuredElementTable, clickedSpan, artworkMasterData);
			
            if (artworkMasterData.result.length <= 0) {
                alert(POA_EDIT_LABELS["emxAWL.AddArtworkMaster.Error.Message"] + " "+ artworkMasterData.rootStructuredElementInfo.rootMarketingName);
                return;
            }
			
			
            structuredElementTable.dialog({
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
            structuredElementTable.parent().addClass("LanguageDialogue-overflow");
        }

        /*
            To Check whethere the field is null or empty
            author : Raghavendra M J (R2J)
        */
        this.isEmpty =function(value) {
            return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
        }

        /*
            To Fetch the Structured Master Elements Info Rows to fill in dialog
            author : Raghavendra M J (R2J)
        */
        this.getDialogContentForStructuredElements =function(structuredElementTable,clickedSpan, artworkMasterData){
            var thead = $("<thead ></thead>");
            var theadRow = $("<tr>"+artworkMasterData.rootStructuredElementInfo.rootType+"</tr>");

            var thMasterCopyName=$("<th>"+POA_EDIT_LABELS['emxFramework.Basic.Name']+"</th>");
            $(thMasterCopyName).attr("style","background: #368ec4;width: 20%; border: 1px solid #e2e4e3");
            $(theadRow).append(thMasterCopyName);

            var thState=$("<th>"+POA_EDIT_LABELS['emxFramework.Basic.State']+"</th>");
            $(thState).attr("style","background: #368ec4;width: 20%; border: 1px solid #e2e4e3");
            $(theadRow).append(thState);

            var flagHTML = $("<th><img src='../common/images/iconActionStart.gif'/></th>");
            $(flagHTML).attr("style","background: #368ec4;width: 10%; border: 1px solid #e2e4e3");
            $(theadRow).append(flagHTML);

            var thCopyText =$("<th>"+POA_EDIT_LABELS['emxAWL.Table.CopyText']+"</th>");
            $(thCopyText).attr("style","background: #368ec4;width: 30%; border: 1px solid #e2e4e3");
            $(theadRow).append(thCopyText);

            var thAttributeText =$("<th>"+POA_EDIT_LABELS['emxAWL.Edit.NutritionLabel']+"</th>");
            $(thAttributeText).attr("style","background: #368ec4;width: 20%; border: 1px solid #e2e4e3");
            $(theadRow).append(thAttributeText);

            $(thead).append(theadRow);
            $(structuredElementTable).append(thead);
            var langTableBody = $('<tbody></tbody>');
            $.each(artworkMasterData.result, function( index,masterData) {

                var eachLangNewRow = $('<tr></tr>');

                var eachmasterNameCell = $('<td>'+masterData.masterName+'</td>');
                $(eachmasterNameCell).attr("style","border: 1px solid #e2e4e3");
                $(eachLangNewRow).append(eachmasterNameCell);

                var eachLangSeqCell = $('<td>'+masterData.basestate+'</td>');
                $(eachLangSeqCell).attr("style","border: 1px solid #e2e4e3");
                $(eachLangNewRow).append(eachLangSeqCell);

                var eachActionCell = $('<td></td>');
                var elementType = masterData.inline == "Yes" ? "InlineType" :  (masterData.translate == "No" ? "NoTranslate" : "");
                $(eachActionCell).append(getImageURL(elementType ,""));
                $(eachLangNewRow).append(eachActionCell);   

                var copyTextRTE  = editStructuredElementInstance.isEmpty(masterData.copytextrte) ? "" :  masterData.copytextrte;
                var eachCopyTextCell = $('<td>'+copyTextRTE+'</td>');
                $(eachCopyTextCell).attr("style","border: 1px solid #e2e4e3");
                $(eachLangNewRow).append(eachCopyTextCell);

                var eachAttributeCell = $('<td>'+masterData.label+'</td>');
                $(eachAttributeCell).attr("style","border: 1px solid #e2e4e3");
                $(eachLangNewRow).append(eachAttributeCell);

                $(langTableBody).append(eachLangNewRow);
            });
            $(structuredElementTable).append(langTableBody);
            return structuredElementTable;
    };
 };
})(jQuery);
