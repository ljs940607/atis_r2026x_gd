/**
* @name DS/StudioUIActorModelWeb/CXPGalleryViewpoint
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPGallery
*
* @description
* <p>Create rep for the items of the viewpoint gallery</p>
* <p>Define specific properties and bind them to the items rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPGalleryViewpoint',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPGallery',
	'DS/StudioUIActorModelWeb/CXPCameraViewer',
	'DS/StudioUIActorModelWeb/CXPUIMapper',
	'DS/StudioUIActorModelWeb/CXPImage'
],
function (UWA, CXPGallery, CXPCameraViewer, UIMapper, CXPImage) {
	'use strict';

	var CXPGalleryViewpoint = CXPGallery.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPGalleryViewpoint.prototype **/
		{

			init: function (iUIActor) {
                this._parent(iUIActor);
                this._widthTotal = 0;
                this._heightTotal = 0;
			},

			Dispose: function () {
				this._parent();
				this._clearUIItems();
			},

			_refreshItems: function (iModelItems) {
				this._clearUIItems();
				for (var i = 0; i < iModelItems.length; i++) {
					var uiItem = this._createUIItem(iModelItems[i]);
					uiItem.holder.inject(this._gallery);
					this._UIItems.push(uiItem);
				}
			},

			_clearUIItems: function () {
				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].holder.remove();
					for (var iMapper = 0; iMapper < this._UIItems[i].mappers.length; iMapper++) {
					    this._UIItems[i].mappers[iMapper].Dispose();
					}
					this._UIItems[i].cxpViewer.Dispose();
					this._UIItems[i].cxpImage.Dispose();
				}
				this._UIItems = [];
			},

			_createUIItem: function (iModelItem) {
				var mappers = [];
				var data = iModelItem.QueryInterface('CATI3DExperienceObject').GetParent();
				var gallery = data.QueryInterface('CATI3DExperienceObject').GetParent();

				var holder = UWA.createElement('div');
				holder.style.padding = '5px';

				var cxpCameraViewer = new CXPCameraViewer(this._uiActor);
				mappers.push(new UIMapper(cxpCameraViewer, data, [{
					model: 'itemSize.x',
                    ui: 'width'
				},
				{
					model: 'itemSize.y',
					ui: 'height'
				},
				{
					model: 'liveUpdate',
					ui: 'liveUpdate'
				}]));

				mappers.push(new UIMapper(cxpCameraViewer, iModelItem, [{
					model: 'camera',
					ui: 'camera'
				}]));

				mappers.push(new UIMapper(cxpCameraViewer, gallery, [{
					model: 'enable',
					ui: 'enable'
				}]));

				cxpCameraViewer.getContainer().style.position = 'relative';
				cxpCameraViewer.inject(holder);

				var cxpImage = new CXPImage();
				mappers.push(new UIMapper(cxpImage, data, [{
					model: 'itemSize.x',
					ui: 'width'
				},
				{
					model: 'itemSize.y',
					ui: 'height'
				}]));

				mappers.push(new UIMapper(cxpImage, iModelItem, [{
					model: 'image',
					ui: 'image',
					func: function (iValue) {
                        if (iValue) {
                            cxpCameraViewer.visible = false;
                            cxpCameraViewer.getContainer().hide();
                            cxpImage.visible = true;
							cxpImage.getContainer().show();
						}
                        else {
                            cxpCameraViewer.visible = true;   
                            cxpCameraViewer.getContainer().show();                                                     
                            cxpImage.visible = false;
                            cxpImage.getContainer().hide();
						}
						return iValue;
					}
				}]));

				mappers.push(new UIMapper(cxpImage, gallery, [{
					model: 'enable',
					ui: 'enable'
				}]));

				cxpImage.getContainer().style.position = 'relative';
				cxpImage.inject(holder);

				var divLabel = UWA.createElement('div').inject(holder);
                divLabel.style.marginLeft = 'auto';
                divLabel.style.marginRight = 'auto';
                divLabel.style.textAlign = 'center';
                divLabel.style.width = '100%';
                divLabel.style.height = '15px';
                var label = UWA.createElement('span').inject(divLabel);
                label.style.fontSize = '90%';
                label.style.fontWeight = 'bold';

				mappers.push(new UIMapper(label, iModelItem, [{
					model: 'label',
					ui: 'innerHTML'
                }]));

                // *************************************************
			    // orientation fix
				var galleryData = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('data');
				var minWidthOfGallery = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('minimumDimension').QueryInterface('CATI3DExperienceObject').GetValueByName('width');
				var minHeightOfGallery = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('minimumDimension').QueryInterface('CATI3DExperienceObject').GetValueByName('height');
				var numberOfItem = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('items').length; // number of items
				var stretchValue = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('stretchToContent');

                var itemToModify = (cxpImage.image !== undefined) ? cxpImage : cxpCameraViewer;

                if (stretchValue === true) {

                    // Change pictures size if they are under gallery side
                    var gap = 30 / 100; // Temporary fix (Creative : difference between items size and gallery size)
                    var orientation = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('orientation');

                    if (orientation === 1) {  // vertical alignment
                        if (itemToModify.width <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            itemToModify.width = minWidthOfGallery - 10;
                        }
                        if ((itemToModify.height + 20) * numberOfItem <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            itemToModify.height = (minHeightOfGallery) / numberOfItem -20;
                        }
                    }

                    else if (orientation === 0) { // horizontal alignment
                        if (itemToModify.width * numberOfItem <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            itemToModify.width = minWidthOfGallery / numberOfItem - 10;
                        }
                        if (itemToModify.height + 20 <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            itemToModify.height = (minHeightOfGallery -20 );
                        }
                    }

                    else if (orientation !== 1 || orientation !== 0) {  //others orientations
                        if (itemToModify.width * numberOfItem <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            itemToModify.width = minWidthOfGallery / numberOfItem - 10;
                        }
                        if ((itemToModify.height + 20) * numberOfItem <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            itemToModify.height = (minHeightOfGallery) / numberOfItem -20;
                        }
                    }

                    if (orientation > 1) {
                        let marginToApply = minWidthOfGallery - (itemToModify.width + this._widthTotal);
                        let delta = minWidthOfGallery - itemToModify.width * numberOfItem;
                        marginToApply -= delta;

                        if (marginToApply < 0) {
                            marginToApply = 0;
                        }
                        holder.style.marginLeft = marginToApply + 'px';
                        this._widthTotal += itemToModify.width;
                    }
                    else if (orientation < 0) {
                        let marginToApply = minHeightOfGallery - (itemToModify.height + this._heightTotal);
                        let delta = minHeightOfGallery - itemToModify.height * numberOfItem;

                        marginToApply -= delta;

                        if (marginToApply < 0) {
                            marginToApply = 0;
                        }
                        holder.style.marginTop = marginToApply + 'px';
                        this._heightTotal += itemToModify.height;
                    }
                }

                itemToModify.getContainer().height = itemToModify.height;
                itemToModify.height = itemToModify.height - 20;

				return {
					holder: holder,
					cxpViewer: cxpCameraViewer,
					cxpImage: cxpImage,
					mappers: mappers
				};
			},

			// Register events for play
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].cxpViewer.registerPlayEvents(iSdkObject, i);
					this._UIItems[i].cxpImage.registerPlayEvents(iSdkObject, i);
				}
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].cxpViewer.releasePlayEvents();
					this._UIItems[i].cxpImage.releasePlayEvents();
				}
			}

		});
	return CXPGalleryViewpoint;
});
