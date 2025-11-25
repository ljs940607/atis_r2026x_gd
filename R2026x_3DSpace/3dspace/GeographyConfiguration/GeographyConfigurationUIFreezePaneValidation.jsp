
<%!
%>
function OnChangeOfCountry()
{
	var currentCell = emxEditableTable.getCurrentCell();
    var rowId = currentCell.rowID;
    emxEditableTable.setCellValueByRowId(rowId,"Language", "", "", true);
	emxEditableTable.reloadCell("Language");
	return true;
}
