/* global CKEDITOR */
CKEDITOR.dialog.add("base64imageDialog", function (editor) {
	'use strict';
	var t = null,
		selectedImg = null,
		orgWidth = null,
		orgHeight = null,
		imgPreview = null,
		urlCB = null,
		urlI = null,
		fileCB = null,
		imgScal = 1,
		lock = true;

	/* Check File Reader Support */
	function fileSupport() {
		var r = false, n = null;
		try {
			if (FileReader) {
				n = document.createElement("input");
				if (n && "files" in n) r = true;
			}
		} catch (e) {
			r = false;
		}
		n = null;
		return r;
	}
	var fsupport = fileSupport();

	/* Load preview image */
	function imagePreviewLoad(s) {

		/* no preview */
		if (typeof (s) !== "string" || !s) {
			imgPreview.getElement().setHtml("");
			return;
		}

		/* Create image */
		var i = new Image();

		/* Display loading text in preview element */
		imgPreview.getElement().setHtml("Loading...");
		let oldOnLoad = i.onload;
		/* When image is loaded */
		i.onload = function () {
			/* Resize image */
			if(new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i').test(i.src)) {
				imgPreview.getElement().setHtml("");
					/* Set attributes */
					if (orgWidth == null || orgHeight == null) {
						//bcc: unclear to me what is the value of this
						t.setValueOf("tab-source", "width", this.width);
						t.setValueOf("tab-source", "height", this.height);
						imgScal = 1;
						if (this.height > 0 && this.width > 0) imgScal = this.width / this.height;
						if (imgScal <= 0) imgScal = 1;
						t.setValueOf("tab-source", "width", '100%');
						imageDimensions("width");
					}
					this.id = editor.id + "previewimage";
					this.setAttribute("style", "max-width:400px;max-height:100px;");
					this.setAttribute("alt", "");
					/* Insert preview image */
					try {
						var p = imgPreview.getElement().$;
						if (p) p.appendChild(this);
					} catch (e) {}
			} else {
				if (editor.plugins.imageresize) editor.plugins.imageresize.scaleImage(i, (scaledSrc) => {
					/* Remove preview */
					imgPreview.getElement().setHtml("");
					/* Set attributes */
					if (orgWidth == null || orgHeight == null) {
						//bcc: unclear to me what is the value of this
						t.setValueOf("tab-source", "width", this.width);
						t.setValueOf("tab-source", "height", this.height);
						imgScal = 1;
						if (this.height > 0 && this.width > 0) imgScal = this.width / this.height;
						if (imgScal <= 0) imgScal = 1;
						t.setValueOf("tab-source", "width", '100%');
						imageDimensions("width");
					}
					this.id = editor.id + "previewimage";
					this.setAttribute("style", "max-width:400px;max-height:100px;");
					this.setAttribute("alt", "");
	
					/* Insert preview image */
					try {
						i.onload = oldOnLoad;
						i.src = scaledSrc;
						var p = imgPreview.getElement().$;
						if (p) p.appendChild(this);
					} catch (e) {}
	
				}, {
					maxWidth: 1200,
					maxHeight: 1200,
					maxByteSize: 250000
				});
			}


		};

		/* Error Function */
		i.onerror = function () {
			imgPreview.getElement().setHtml("");
		};
		i.onabort = function () {
			imgPreview.getElement().setHtml("");
		};
		//resize the image

		/* Load image */
		i.src = s;
	}
	/* Change input values and preview image */
	function imagePreview(src) {

		/* Remove preview */
		imgPreview.getElement().setHtml("");
		//bcc: need to take into account the base64 and url cases
		if (src == "base64") {

			/* Disable Checkboxes */
			if (urlCB) urlCB.setValue(false, true);
			if (fileCB) fileCB.setValue(false, true);

		} else if (src == "url") {

			/* Ensable Image URL Checkbox */
			if (urlCB) urlCB.setValue(true, true);
			if (fileCB) fileCB.setValue(false, true);

			/* Load preview image */
			if (urlI) imagePreviewLoad(urlI.getValue());

		} else if (fsupport) {

			/* Ensable Image File Checkbox */
			if (urlCB) urlCB.setValue(false, true);
			if (fileCB) fileCB.setValue(true, true);

			/* Read file and load preview */
			var fileI = t.getContentElement("tab-source", "file");
			var n = null;
			try {
				n = fileI.getInputElement().$;
			} catch (e) {
				n = null;
			}
			if (n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
				if ("type" in n.files[0] && !n.files[0].type.match("image.*")) return;
				if (!FileReader) return;
				imgPreview.getElement().setHtml("Loading...");
				var fr = new FileReader();
				fr.onload = (function (f) {
					return function (e) {
						imgPreview.getElement().setHtml("");
						imagePreviewLoad(e.target.result);
					};
				})(n.files[0]);
				fr.onerror = function () {
					imgPreview.getElement().setHtml("");
				};
				fr.onabort = function () {
					imgPreview.getElement().setHtml("");
				};
				fr.readAsDataURL(n.files[0]);
			}
		}
	}

	/* Calculate image dimensions */
	function getImageDimensions() {
		var o = {
			"w": t.getContentElement("tab-source", "width").getValue(),
			"h": t.getContentElement("tab-source", "height").getValue(),
			"uw": "px",
			"uh": "px"
		};
		if (o.w.indexOf("%") >= 0) o.uw = "%";
		if (o.h.indexOf("%") >= 0) o.uh = "%";
		o.w = parseInt(o.w, 10);
		o.h = parseInt(o.h, 10);
		if (isNaN(o.w)) o.w = 0;
		if (isNaN(o.h)) o.h = 0;

		return o;
	}

	/* Set image dimensions */
	function imageDimensions(src) {
		var o = getImageDimensions();
		var u = "px";
		if (src == "width") {
			if (o.uw == "%") u = "%";
			o.h = Math.round(o.w / imgScal);
		} else {
			if (o.uh == "%") u = "%";
			o.w = Math.round(o.h * imgScal);
		}
		if (u == "%") {
			o.w += "%";
			o.h += "%";
		}
		t.getContentElement("tab-source", "width").setValue(o.w);
		t.getContentElement("tab-source", "height").setValue(o.h);
	}

	/* Set integer Value */
	function integerValue(elem) {
		var v = elem.getValue(),
			u = "";
		if (v.indexOf("%") >= 0) u = "%";
		v = parseInt(v, 10);
		if (isNaN(v)) v = 0;
		elem.setValue(v + u);
	}

	if (fsupport) {

		/* Dialog with file and url image source */
		var sourceElements = [{
					type: "hbox",
					children: [
						{
							type: "html",
							id: "preview",
							html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
						},{
							type: "vbox",
							children: [
								// {
								// 	type: "radio",
								// 	id: "urlfileradio",
								// 	items: [[editor.lang.common.url ,'url'],[editor.lang.common.upload,'file']],
								// 	style: "margin-top:5px",
								// 	label: "Upload from :",
								// 	default: 'url',
								// 	onChange: function(){
								// 		if(this.getValue() == 'url'){
								// 			t.getContentElement("tab-source", "file").getInputElement().hide()
								// 			t.getContentElement("tab-source", "url").getInputElement().show()
								// 		} else {
								// 			t.getContentElement("tab-source", "url").getInputElement().hide()
								// 			t.getContentElement("tab-source", "file").getInputElement().show()
								// 		}
								// 	}
								// },
								// {
								// 	type: "text",
								// 	id: "url",
								// 	label: "",
								// 	onChange: function () {
								// 		imagePreview("url");
								// 	}
								// },
								{
									type: "file",
									id: "file",
									label: "Upload",
									onChange: function () {
										imagePreview("file");
									}
								},
								{
									type: 'hbox',
									children: [{
											type: "text",
											id: "width",
											label: editor.lang.common.width + ' (px/%)'
										},
										{
											type: "text",
											id: "height",
											label: editor.lang.common.height + ' (px/%)'
										}
									]
								},
								{
									type: "checkbox",
									id: "lock",
									label: editor.lang.base64image.lockRatio
								}
							]
						}
					]
				}
		];

	} else {

		/* Dialog with url image source */
		var sourceElements = [{
				type: "text",
				id: "url",
				label: editor.lang.common.url,
				onChange: function () {
					imagePreview("url");
				}
			},
			{
				type: "html",
				id: "preview",
				html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
			},
			{
				type: 'hbox',
				children: [{
						type: "text",
						id: "width",
						label: editor.lang.common.width + ' (px/%)'
					},
					{
						type: "text",
						id: "height",
						label: editor.lang.common.height + ' (px/%)'
					},
					{
						type: "checkbox",
						id: "lock",
						label: editor.lang.base64image.lockRatio,
						style: "margin-top:18px;"
					}
				]
			}
		];
	}

	/* Dialog */
	return {
		title: editor.lang.common.image,
		minWidth: 450,
		minHeight: 180,
		onLoad: function () {
			/* Get url input element */
			urlI = this.getContentElement("tab-source", "url");
			/* Get image preview element */
			imgPreview = this.getContentElement("tab-source", "preview");
			/* Constrain proportions or not */
			this.getContentElement("tab-source", "lock").getInputElement().on("click", function () {
				if (this.getValue()) lock = true;
				else lock = false;
				if (lock) imageDimensions("width");
			}, this.getContentElement("tab-source", "lock"));
			/* Change Attributes Events  */
			this.getContentElement("tab-source", "width").getInputElement().on("keyup", function () {
				if (lock) imageDimensions("width");
			});
			this.getContentElement("tab-source", "height").getInputElement().on("keyup", function () {
				if (lock) imageDimensions("height");
			});

		},
		onShow: function () {

			/* Remove preview */
			imgPreview.getElement().setHtml("");
			this.getContentElement("tab-source", "file").getInputElement().setAttribute("accept", "image/*");

			t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;

			/* selected image or null */
			selectedImg = editor.getSelection();
			if (selectedImg) selectedImg = selectedImg.getSelectedElement();
			if (!selectedImg || selectedImg.getName() !== "img") selectedImg = null;
			/* Set input values */
			t.setValueOf("tab-source", "lock", lock);
			if (selectedImg) {
				/* Set input values from selected image */
				if (typeof (selectedImg.getAttribute("width")) === "string") orgWidth = selectedImg.getAttribute("width");
				if (typeof (selectedImg.getAttribute("height")) === "string") orgHeight = selectedImg.getAttribute("height");
				if ((orgWidth == null || orgHeight == null) && selectedImg.$) {
					orgWidth = selectedImg.$.width;
					orgHeight = selectedImg.$.height;
				}
				if (orgWidth != null && orgHeight != null) {
					t.setValueOf("tab-source", "width", orgWidth);
					t.setValueOf("tab-source", "height", orgHeight);
					orgWidth = parseInt(orgWidth, 10);
					orgHeight = parseInt(orgHeight, 10);
					imgScal = 1;
					if (!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
					if (imgScal <= 0) imgScal = 1;
				}

				if (typeof (selectedImg.getAttribute("src")) === "string") {
					if (selectedImg.getAttribute("src").indexOf("data:") === 0) {
						imagePreview("base64");
						imagePreviewLoad(selectedImg.getAttribute("src"));
					} else {
						t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
					}
				}
				t.selectPage("tab-source");
			}

		},
		onOk: function () {

			/* Get image source */
			var src = "";
			try {
				src = CKEDITOR.document.getById(editor.id + "previewimage").$.src;
			} catch (e) {
				src = "";
			}
			if (typeof (src) !== "string" || src == null || src === "") return;

			/* selected image or new image */
			if (selectedImg) var newImg = selectedImg;
			else var newImg = editor.document.createElement("img");
			newImg.setAttribute("src", src);
			newImg.setAttribute("data-cke-saved-src", src);
			src = null;

			/* Set attributes */
			var attr = {
					"width": ["width", "width:#;", "integer", 1],
					"height": ["height", "height:#;", "integer", 1]
				},
				css = [],
				value, cssvalue, attrvalue, k, unit;
				for (k in attr) {
					value = t.getValueOf("tab-source", k);
					attrvalue = value;
					cssvalue = value;
					unit = "px";
					if (attr[k][2] == "integer") {
						if (value.indexOf("%") >= 0) unit = "%";
						value = parseInt(value, 10);
						if (isNaN(value)) value = null;
						else if (value < attr[k][3]) value = null;
						if (value != null) {
							if (unit == "%") {
								attrvalue = value + "%";
								cssvalue = value + "%";
							} else {
								attrvalue = value;
								cssvalue = value + "px";
							}
						}
					}
					if (value != null) {
						newImg.setAttribute(attr[k][0], attrvalue);
						css.push(attr[k][1].replace(/#/g, cssvalue));
					}
				}
			if (css.length > 0) newImg.setAttribute("style", css.join(""));

			/* Insert new image */
			if (!selectedImg) editor.insertElement(newImg);

			/* Resize image */
			//	if (editor.plugins.imageresize) editor.plugins.imageresize.resize(editor, newImg, 800, 800);

		},

		/* Dialog form */
		contents: [{
				id: "tab-source",
				label: editor.lang.common.generalTab,
				elements: sourceElements
			}
		]
	};
});
