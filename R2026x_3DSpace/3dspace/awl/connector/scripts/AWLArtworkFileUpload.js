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

var checkInFilesURL="../db/o3dconnect/checkin";
var labelURL="../resources/awl/connector/o3dconnect/getLabel";
$(document).ready(function(){
    $.ajax({
        url : labelURL,
        success : function(data) {
            AWLARTWORK_FILE_UPLOAD = $.parseJSON(data);
        }
    });
    populateFields();
});

 function submit(){
          if(validateFields())
             invokeUploadServlet();
  }

function validateFields(){
    var fileNames = Array();
    $.each($("input[type=file]"), function(i, obj) {
          $.each(obj.files,function(j,file){
              fileNames.push(file.name);
          });
    });
    if(fileNames.length == 0){
        alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.SelectAFile']);
        return;
    }

    if(hasDuplicates(fileNames)){
        alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Warning.OnlyOneExtensionPerPOA']);
        return;
    }
    return validateUploadedFiles();
}

//Function to handle the Servlet invocation part.
function invokeUploadServlet(){
        turnOnProgress();
        $.ajax({
        url: checkInFilesURL,
        data: buildFormData(),
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function (request) { addSecureTokenHeader(request); },
        success: function(data){
                turnOnProgress();
                var xmlDoc = $.parseXML(data);
                var result = $(xmlDoc).find('response ').attr('result');
                var message = $(xmlDoc).find('info').text();
                var closePopup = ( result == "failure" && message.indexOf("Trigger") > -1 ) || result == "success";
                if(!closePopup){
                        alert(message);
                } else  {
                    var opener = getTopWindow().opener;
                    if(opener != null)
                        opener.location.href = opener.location.href;
                    closeWindow();
                }
                turnOffProgress();
        },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
        }
    });
}

function validateUploadedFiles()
{
    var isValid = true;
    var uploadedFormats = Array();
     $.each($("input[type=file]"), function(i, obj) {
        var objectName  = $(obj.parentElement.parentElement).find(":selected").val();
        if(objectName == formatGS1)   {
            uploadedFormats.push(objectName);
            if( !validateResponseFile(obj)) {
                isValid = false;
                return false;
            }
        } else  if(objectName == formatArtwork)  {
            uploadedFormats.push(objectName);
            if(!validateArtworkFile(obj)){
                isValid = false;
                return false;
            }
        }
    });

    if(isValid && hasDuplicates(uploadedFormats)) {
        alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.UploadSingleFormatFile']);
        isValid = false;
    }

    if(isValid && (jQuery.inArray(formatGS1, uploadedFormats) != -1) && (jQuery.inArray(formatArtwork, uploadedFormats) == -1) ){
            alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.UpldArtworkFileWithGS1RespFile']);
            isValid = false;
    }
    return isValid;
}

function hasDuplicates(array) {
    var valuesSoFar = [];
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (valuesSoFar.indexOf(value) !== -1) {
            return true;
        }
        valuesSoFar.push(value);
    }
    return false;
}

// Handles if the Uploading 'Artwork' Format's extension is other than the previous extension, --> Error
function validateArtworkFile(obj){
    var isValid = true;
    if(obj.files.length == 0){
            alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.UpldArtworkFileWithGS1RespFile']);
            return false;
    }
    $.each(obj.files,function(j,file){
            var selectedExtension = getFileExtension(file.name);
                var currentExtension  = getFileExtension(artworkUploaded);
                if(!isEmpty(currentExtension) && !isEmpty(currentExtension)) {
                    if(selectedExtension != currentExtension) {
                            alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.InvalidArtworkFile'] + currentExtension);
                            isValid = false;
                            return false;
                    }
                }
    });
    return isValid;
}

function validateResponseFile(obj){
    var isValid = true;
    $.each(obj.files,function(j,file){
                var selectedExtension = getFileExtension(file.name);
                if("xml" != selectedExtension) {
                    alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.ValidGS1File']);
                        isValid = false;
                        return false;
                }
    });
    return isValid;
}

function buildFormData(){
    var ajaxData = new FormData();
    ajaxData.append( 'action','uploadImages');
	var fileCount = "";
    $.each($("input[type=file]"), function(i, obj) {
        var objectName = $(obj.parentElement.parentElement).find(":selected")[0].value;
        var comments = $(obj.parentElement.parentElement).find("textarea").val();
        fileCount = i+1;
        $.each(obj.files,function(j,file){
            ajaxData.append(objectName, file);            
            ajaxData.append("fileName", file.name);
            ajaxData.append(file.name, comments);
            ajaxData.append("file"+fileCount, file.name);                        
        });
        ajaxData.append("format"+fileCount, objectName);
        ajaxData.append("comments"+fileCount, comments);            
    });
    ajaxData.append("artworkFileId",artworkFileId);
    ajaxData.append("poaId",poaId);
    ajaxData.append("POAName",poaName);
    ajaxData.append("webCheckIn", "true");
    return ajaxData;
}

function populateFields() {
    fillOptions($('#file1Select'), true);
    fillOptions($('#file2Select'), true);
    fillOptions($('#file3Select'));
    fillOptions($('#file4Select'));
}

function fillOptions(selectObject, addArtworkAndGeneric)
{
    var optionGeneric = $("<option>").attr("value",formatGeneric).text(formatTranslatedGeneric);
    var optionArtwork = $("<option>").attr("value",formatArtwork).text(formatTranslatedArtwork);
    var optionGS1 = $("<option>").attr("value",formatGS1).text(formatTranslatedGS1);

    $(selectObject).append(optionGeneric).append(optionArtwork).append(optionGS1);

}

function getFileExtension(filename){
    var passedFileName = filename.split(".");
    if( passedFileName.length === 1 || ( passedFileName[0] === "" && passedFileName.length === 2 ) ) {
        return "";
    }
    return passedFileName.pop();
}

function validateFile(elementName, fileExtension){
    var selectedFileName =  $('input[name='+elementName+']').val().split('\\').pop();
    var selectedExtension = getFileExtension(selectedFileName);
    if(fileExtension != selectedExtension) {
        alert(AWLARTWORK_FILE_UPLOAD['emxAWL.Alert.InvalidFile'] +" "+ selectedExtension);
            return false;
    }
}

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
