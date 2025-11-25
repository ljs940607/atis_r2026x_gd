define("DS/ZipJS2/LoaderInflate",
[
	"DS/ZipJS2/pako"
],
function(pako)
{
	"use strict";

	class LoaderInflate
	{
		Inflate(data)
		{
			return pako.inflateRaw(data);
		}

		static inflate_no_header(data) { return pako.inflateRaw(data); }
		static inflate(data) { return pako.inflate(data); }
	};

	return LoaderInflate;
});
