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

<head>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/common/styles/emxUIDefault.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/tree.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/eventboundlist.css" rel="stylesheet" type="text/css">
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<LINK href="<%=root_dir%>/cpd/regioncountry/scripts/regioncountries.css" rel="stylesheet" type="text/css">

<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/common/scripts/emxUICore.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/cpd/regioncountry/scripts/tree.js"></script>
<!-- XSSOK root_dir will be a static value coming from pages including this inc file no need of encoding  -->
<script type="text/javascript" src="<%=root_dir%>/cpd/regioncountry/scripts/eventboundlist.js"></script>

<script type="text/javascript">
	var clist = null;
	$(document).ready(function(){
		var treeObj=$("#regionDiv").tree({
			duration: 400, 
			triggerSelectOn: 'leafchildnode',
			serverurl: "<%=root_dir%>/resources/cpd/view/countryregion/getsubregions", 
			urlparam: "RegionID={id}"
		});
		clist=$("#countriesDiv").eventBoundList('1', treeObj, 'selected', 'deselected', {
			duration: 400, 
			serverurl: "<%=root_dir%>/resources/cpd/view/countryregion/getcountries",
			urlparam: "RegionID={id}",
			showUnique: true,
            showOriginatorSelectAll: false
		});
		treeObj[0].start();
	});

	function getSelectedCountries(){
		return clist[0].getSelected();
	}
</script>

</head>
<body>

<div class="wrapper">
	<div id="regionDiv" class="leftPane"></div>
	<div id="countriesDiv" class="rightPane"></div>
</div>

</body>
