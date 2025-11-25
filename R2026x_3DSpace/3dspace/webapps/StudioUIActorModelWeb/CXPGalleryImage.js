/**
* @name DS/StudioUIActorModelWeb/CXPGalleryImage
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPGallery
*
* @description
* <p>Create rep for the items (CXPImage) of the image gallery</p>
* <p>Define specific properties and bind them to the items rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPGalleryImage',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPGallery',
	'DS/StudioUIActorModelWeb/CXPImage',
	'DS/StudioUIActorModelWeb/CXPUIMapper'
],
function (UWA, CXPGallery, CXPImage, UIMapper) {
	'use strict';

	var CXPGalleryImage = CXPGallery.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPGalleryImage.prototype **/
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
					this._UIItems[i].image.Dispose();
				}
				this._UIItems = [];
			},

			_createUIItem: function (iModelItem) {
				var mappers = [];
				var data = iModelItem.QueryInterface('CATI3DExperienceObject').GetParent();
				var gallery = data.QueryInterface('CATI3DExperienceObject').GetParent();

                var cxpImage = new CXPImage(this._uiActor);
                cxpImage.visible = true;
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
					ui: 'image'
				}]));

				mappers.push(new UIMapper(cxpImage, gallery, [{
					model: 'enable',
					ui: 'enable'
				}]));

				cxpImage.getContainer().style.position = 'relative';

				var holder = UWA.createElement('div');
				holder.style.padding = '5px';
				cxpImage.inject(holder);
				var divLabel = UWA.createElement('div').inject(holder);
                divLabel.style.marginLeft = 'auto';
                divLabel.style.marginRight = 'auto';
                divLabel.style.textAlign = 'center';
                divLabel.style.width = '100%';
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

                if (stretchValue === true) {
                    // Change pictures size if they are under gallery side
                    var gap = 30 / 100; // Temporary fix (Creative : difference between items size and gallery size)

                    var orientation = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('orientation');
                    if (orientation === 1) {  // vertical alignment
                        if (cxpImage.width <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            cxpImage.width = minWidthOfGallery - 10;
                        }
                        if ((cxpImage.height + 20) * numberOfItem <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            cxpImage.height = (minHeightOfGallery) / numberOfItem - 20;
                        }
                    }

                    else if (orientation === 0) { // horizontal alignment
                        if (cxpImage.width * numberOfItem <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            cxpImage.width = minWidthOfGallery / numberOfItem - 10;
                        }
                        if (cxpImage.height + 20 <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            cxpImage.height = (minHeightOfGallery) - 20;
                        }
                    }

                    else if (orientation !== 1 || orientation !== 0) {  // vertical alignment
                        if (cxpImage.width * numberOfItem <= minWidthOfGallery - (minWidthOfGallery * gap)) {
                            cxpImage.width = minWidthOfGallery / numberOfItem - 10;
                        }
                        if ((cxpImage.height + 15) * numberOfItem <= minHeightOfGallery - (minHeightOfGallery * gap)) {
                            cxpImage.height = (minHeightOfGallery) / numberOfItem - 20;
                        }
                    }

                    // Change orientation
                    if (orientation > 1) {
                        let marginToApply = minWidthOfGallery - (cxpImage.width + this._widthTotal);
                        let delta = minWidthOfGallery - cxpImage.width * numberOfItem;
                        marginToApply -= delta;

                        if (marginToApply < 0) {
                            marginToApply = 0;
                        }
                        holder.style.marginLeft = marginToApply + 'px';
                        this._widthTotal += cxpImage.width;
                    }

                    else if (orientation < 0) {
                        let marginToApply = minHeightOfGallery - (cxpImage.height + 20 + this._heightTotal);
                        let delta = minHeightOfGallery - (cxpImage.height + 20) * numberOfItem;

                        marginToApply -= delta;

                        if (marginToApply < 0) {
                            marginToApply = 0;
                        }

                        holder.style.marginTop = marginToApply + 'px';
                        this._heightTotal += cxpImage.height + 20;
                    }
                }

                // *************************************************

				return {
					holder: holder,
					image: cxpImage,
					mappers: mappers
				};
			},

			// Register events for play
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].image.registerPlayEvents(iSdkObject, i);
				}
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].image.releasePlayEvents();
				}
			}

		});
	return CXPGalleryImage;
});
