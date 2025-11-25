	function ajaxExec(arg_url, arg_data, successfn, errorfn)
	{
		$.ajax({
			async: true,
			dataType: "json",
			url: arg_url,
			data: arg_data,
			type: "POST",
			cache: false,
			beforeSend: function (request)
          		{
			 addSecureTokenHeader(request);
          	        },
			success: function(data) {
				if(typeof successfn === 'function') {
					successfn(data, arg_data);
				}else{
					var fn = window[successfn];
					if(typeof fn === 'function') {
					    fn(data, arg_data);
					}
				}
			},
			error: function(data) {
				if(typeof errorfn === 'function') {
					errorfn(data, arg_data);
				}else{
					var fn = window[errorfn];
					if(typeof fn === 'function') {
					    fn(data, arg_data);
					}
				}
			} 
		});		
	}
