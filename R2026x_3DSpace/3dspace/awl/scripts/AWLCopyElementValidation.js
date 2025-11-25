var  formName = document.ArtworkMasterCreate;

function changeCopyText(select)
{
    var sep = select.value;
    var copyTextElements = document.getElementsByName("txtFeatureMarketingText");
    var  copytext = copyTextElements[0];
    var seqnumber = "";  
    
    var copyvalye = [];

    var listItemSequence=formName.listItemSequence.value;  

    var addtionalInfo =formName.addtionalInfo.value;  
    
    var hidCopyTextInfo =formName.hidCopyTextList.value;
  
    var arraySeqNum=new Array();

    var arraySeq=new Array();

    var addInfo=new Array();
    
    var copytextArray =new Array();

    var seq="";

    arraySeqNum=listItemSequence.split(",");

    addInfo= addtionalInfo.split("|");
    
    copytextArray= hidCopyTextInfo.split("|");
    
    
    for(var j=0;j<arraySeqNum.length;j++)
    {  
     

        seq=arraySeqNum[j];
        arraySeq=seq.split("|");
        seqnumber=arraySeq[0];
       
        var seqnum = parseInt(seqnumber);
        //copyvalye[seqnum-1]=listCopyItems[j].copyText+addInfo[j];
        copyvalye[seqnum-1]=copytextArray[j]+addInfo[j];
    }
     var copytextValue = copyvalye.join(sep);
     copytext.updateRTE(copytextValue);
     

}      

function checkAcessForYesOnBuildFromList()
{
    var  formName = document.ArtworkMasterCreate;
    var buildFrmListItemForYes = formName.BuildFrmListItem[0];
    var inlineTranslationForYes = formName.txtInlineTranslation[0];
    if(buildFrmListItemForYes.checked)
    {
        if(inlineTranslationForYes.checked)
        {
            inlineTranslationForYes.checked = false ;
            formName.txtInlineTranslation[1].checked = true ;
        }
          
          inlineTranslationForYes.disabled = true;
    }else
    {
         inlineTranslationForYes.disabled = false;
    }
    
}

function checkAcessForYesOnTranslate()
{
    var  formName = document.ArtworkMasterCreate;
    var translateForYes = formName.txtTranslate[0];
    var inlineTranslationForYes = formName.txtInlineTranslation[0];
    if(translateForYes.checked)
    {
        inlineTranslationForYes.disabled = false;
    }else
    {
        if(inlineTranslationForYes.checked)
        {
            inlineTranslationForYes.checked = false ;
            formName.txtInlineTranslation[1].checked = true ;
        }
          
          inlineTranslationForYes.disabled = true;
    }
}
    
//H49 End  

function changeVisibilityForNo()
{
    
    //document.getElementById("SpecialCharButton").style.display = "";
/*    $('#txtFeatureMarketingText').SpCharKeypad({
                      clearText: 'Clear',
                      keys: '&#36;|&copy;|&#134;|&#162;|&reg;|&#8453;|&#163;|&#8471;|&#8470;|&#165;|&#153;|&#140;|&#128;|&#8480;|&#176;',
                      keysInaRow: 4
                      });
*/    
	document.getElementById("AddListItemButton").style.display = 'none';
    formName.listSeparator.setAttribute("disabled","disabled");
    if(removeCopyText=="Yes")
    	$('#txtFeatureMarketingText').val('');    
    else
    	removeCopyText = "Yes"
    document.getElementsByName("txtFeatureMarketingText")[0].enableRTE();
    //document.getElementsByName("txtFeatureMarketingText")[0].style.backgroundColor = "";
}

function changeVisibilityForYes()
{
        
   document.getElementById("AddListItemButton").style.display = "";
   //document.getElementById("SpecialCharButton").style.display = "none";   
    formName.listSeparator.removeAttribute("disabled");
    
    if(document.getElementById("ListSeparatorsLabel"))
    	document.getElementById("ListSeparatorsLabel").style.display="";
    
    document.getElementById("ListSeparators").style.display="";
    if(document.getElementById("BuildFrmListLabel"))
    	document.getElementById("BuildFrmListLabel").style.display="";
    if(document.getElementById("BuildFrmListOption"))
    	document.getElementById("BuildFrmListOption").style.display="";
    
    $('#txtFeatureMarketingText').unbind();
    if(removeCopyText=="Yes"){
    	$('#txtFeatureMarketingText').val('');
    	changeCopyText(formName.listSeparator.value);
    }
    else   
    	removeCopyText = "Yes";  
    document.getElementsByName("txtFeatureMarketingText")[0].disableRTE();
}



function changeSeparator(select)
{
	var sep = select.value;
	
	var  copytext = document.getElementById("txtFeatureMarketingText");
	
	var copyvalye = [];
	for(var i = 0; i < listCopyItems.length; i++)
	{
		copyvalye.push(listCopyItems[i].copyText);
	}
	copytext.value = copyvalye.join(sep);   
}

function showACSelector()
{ 
	if (!document.ArtworkMasterCreate.chkAC.checked)
	{
	showModalDialog('../common/emxFullSearch.jsp?field=TYPES=type_ArtworkPackage:CURRENT=policy_ArtworkPackage.state_Create&table=PLCDesignResponsibilitySearchTable&selection=single&formName=productMasterCreate&submitAction=refreshCaller&hideHeader=true&HelpMarker=emxhelpfullsearch&&submitURL=../productline/SearchUtil.jsp?&mode=Chooser&chooserType=FormChooser&fieldNameActual=ArtworkChangeSelected&fieldNameDisplay=ArtworkChangeDisplay',750,650);
	}
}




function changeYesNoOption(strEligibleType)
 {                
   // formName.txtFeatureMarketingText.value="";      
          
   var actualName=formName.txtFeatureActualType.value;  
   var isMatch = strEligibleType.match(actualName);
             
      if(isMatch)
      {                 
        //document.getElementById("ArtworkChangeDisplay").style.display="none"; 
        document.getElementById("Translate").style.display="none";
        document.getElementById("fTranslate").style.display="none";
        document.getElementById("ListSeparatorsLabel").style.display="";          
        document.getElementById("ListSeparators").style.display="";
        document.getElementById("BuildFrmListLabel").style.display="";
        document.getElementById("BuildFrmListOption").style.display="";                   
        formName.BuildFrmListItem[0].checked=true;
        checkAcessForYesOnBuildFromList(); 
        changeVisibilityForYes();                 
       }                    
      else
      {                  
        //document.getElementById("ArtworkChangeDisplay").style.display=""; 
        document.getElementById("Translate").style.display="";
        document.getElementById("fTranslate").style.display="";         
        document.getElementById("ListSeparatorsLabel").style.display="none";          
        document.getElementById("ListSeparators").style.display="none";
        document.getElementById("BuildFrmListLabel").style.display="none";
        document.getElementById("BuildFrmListOption").style.display="none";
        
        formName.BuildFrmListItem[1].checked=true;
        checkAcessForYesOnBuildFromList();
        checkAcessForYesOnTranslate();                  
        changeVisibilityForNo();
      }  
}        

