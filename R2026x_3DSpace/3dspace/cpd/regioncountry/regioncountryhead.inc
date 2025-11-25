<!--
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
-->

<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/common/styles/emxUIDefault.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/tree.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/eventboundlist.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/regioncountries.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/errorbox.css" rel="stylesheet" type="text/css">

<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/common/scripts/emxUICore.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/cpd/regioncountry/scripts/tree.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/cpd/regioncountry/scripts/eventboundlist.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/cpd/regioncountry/scripts/ErrorDisplay.js"></script>

<%
    
    String strLanguage     = request.getHeader("Accept-Language"); 
   
    String strSelectAll=i18nNow.getI18nString("emxCPD.Label.SelectAll","emxCPDStringResource", strLanguage);
%>
<script type="text/javascript">

	var strSelectedCountryIds="";
	var SELECTALL="<%=strSelectAll%>";
	
	if (typeof SelectedCountryIds !== 'undefined') {
	    strSelectedCountryIds=SelectedCountryIds;
	}

	var strPartSelectedCountryIds="";
	if (typeof PartSelectedCountryIds !== 'undefined') {
	    strPartSelectedCountryIds=PartSelectedCountryIds;
	}


	var clist = null;
	$(document).ready(function(){
		var treeObj=$("#regionDiv").tree({
			duration: 400, 
			triggerSelectOn: 'leafchildnode',
			serverurl: "<%=root_dir%>/resources/cpd/view/countryregion/getsubregions",
			urlparam: "RegionID={id}&SelectedCountryIds="+strSelectedCountryIds+"&PartSelectedCountryIds="+strPartSelectedCountryIds, 
		});
		clist=$("#countriesDiv").eventBoundList('1', treeObj, 'selected', 'deselected', {
			duration: 400, 
			serverurl: "<%=root_dir%>/resources/cpd/view/countryregion/getcountries",
			urlparam: "RegionID={id}&SelectedCountryIds="+strSelectedCountryIds+"&PartSelectedCountryIds="+strPartSelectedCountryIds,
			showUnique: true,
            showOriginatorSelectAll: false,
            strSelectAll:SELECTALL
		});
		treeObj[0].start();
	});

	function getSelectedCountries(){
		return clist[0].getSelected();
	}

	function getPartSelectedCountries(){
		return clist[0].getPartSelected();
	}
</script>
