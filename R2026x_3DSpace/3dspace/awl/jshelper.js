function ajaxAction(url, req, cbfunct, reqType){
	reqType = typeof reqType !== 'undefined' ? reqType : "POST";
	$.ajax({
		async: false,
		dataType: "json",
		url: url,
		data: req,
		type: reqType,
		success: cbfunct
	});
}
