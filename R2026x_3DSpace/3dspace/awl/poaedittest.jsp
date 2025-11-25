<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
    xmlns:widget="http://www.netvibes.com/ns/"  style="height: 98%;">
    <head>

        <!-- Application Metas -->
        <title>Edit POA Test</title>

        <link rel="stylesheet" type="text/css"
			href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" />

        <script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
        <script type="text/javascript" src="../common/scripts/jquery.min-xparam.js"></script>
        <script type="text/javascript" src="../common/scripts/jquery-ui.custom.js"></script>
        <script type="text/javascript" src="../common/scripts/jquery-ui.min-xparam.js"></script>
        
        <script type="text/javascript" src="jshelper.js"></script>
        <script type="text/javascript" src="poaedit.js"></script>
        <script type="text/javascript">
        	$(document).ready(function(){
	        	$('#editpoabtn').click(function(){ 
				//Hard coded POA object id. Should replace with request parameter
	        		poaEditDialog("11144.55489.46568.22361", document.body); 
	        	});
        	});
        </script>
    </head>
    <body style="height: 100%;">
    	<button id="editpoabtn" value="Edit POA">Edit POA</button>
    </body>
</html>
