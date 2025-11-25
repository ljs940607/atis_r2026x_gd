<%--  
    emxAWLProductsListFilterProcess.jsp  -
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
    <script language="Javascript" src="../common/scripts/emxUICore.js"></script>
    <script language="Javascript">
        var vRevFilterValue = getTopWindow().document.getElementById('AWLProductRevisionFilter').value;
        var vSuiteKey = window.parent.document.getElementById('suiteKey').value;
        var vObjectId = window.parent.document.getElementById('objectId').value;
        var vURL = "../common/emxIndentedTable.jsp?table=AWLProductPOAsTable&expandProgram=AWLCPGProductUI:getExpandedProductStructure&toolbar=AWLPOAsToolBar,AWLProductRevisionCustomFilterToolbar&selection=multiple&header=emxAWL.Heading.ProductList&categoryTreeName=type_ProductLine&AWLProductRevisionFilter=" + vRevFilterValue + "&suiteKey=" + vSuiteKey + "&objectId=" + vObjectId;
        window.parent.frames.location.href  = vURL;
    </script>
