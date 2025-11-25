/**
* @name DS/StudioUIActorModelWeb/CXPGalleryMenu
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPGallery
*
* @description
* <p>Create rep for the items (CXPButton) of the menu gallery</p>
* <p>Define specific properties and bind them to the items rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPGalleryMenu',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPGallery',
	'DS/StudioUIActorModelWeb/CXPButton',
	'DS/StudioUIActorModelWeb/CXPUIMapper'
],
function (UWA, CXPGallery, CXPButton, UIMapper) {
	'use strict';

	var CXPGalleryMenu = CXPGallery.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPGalleryMenu.prototype **/
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
					uiItem.button.inject(this._gallery);
					this._UIItems.push(uiItem);
				}
			},

			_clearUIItems: function () {
				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].button.remove();
					for (var iMapper = 0; iMapper < this._UIItems[i].mappers.length; iMapper++) {
					    this._UIItems[i].mappers[iMapper].Dispose();
					}
					this._UIItems[i].button.Dispose();
				}
				this._UIItems = [];
			},

			_createUIItem: function (iModelItem) {
				var mappers = [];
				var data = iModelItem.QueryInterface('CATI3DExperienceObject').GetParent();
				var gallery = data.QueryInterface('CATI3DExperienceObject').GetParent();

                var button = new CXPButton(this._uiActor);
                button.visible = true;
				mappers.push(new UIMapper(button, data, [{
					model: 'itemSize.x',
					ui: 'width'
				},
					{
						model: 'itemSize.y',
						ui: 'height'
					},
					{
						model: 'itemFontHeight',
						ui: 'fontHeight'
					}
				]));

				mappers.push(new UIMapper(button, iModelItem, [
					{
						model: 'label',
						ui: 'label'
					}
				]));

				mappers.push(new UIMapper(button, gallery, [
					{
						model: 'enable',
						ui: 'enable'
					}
				]));

				button.getContainer().style.position = 'relative';
                button.getContainer().style.margin = '5px';

                // *************************************************
			    // orientation fix

                var galleryData = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('data');
                var minWidthOfGallery = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('minimumDimension').QueryInterface('CATI3DExperienceObject').GetValueByName('width');
                var minHeightOfGallery = gallery.QueryInterface('CATI3DExperienceObject').GetValueByName('minimumDimension').QueryInterface('CATI3DExperienceObject').GetValueByName('height');
                var numberOfItem = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('items').length; // number of items
                var stretchValue = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('stretchToContent');

                if (button.height * numberOfItem <= minHeightOfGallery) {
                    button.height = (minHeightOfGallery - 10) / numberOfItem;
                }

                var orientation = galleryData.QueryInterface('CATI3DExperienceObject').GetValueByName('orientation');
                if (orientation === 1) {
                    if (button.width <= minWidthOfGallery) {
                        button.width = minWidthOfGallery - 10;
                    }
                }

                else if (orientation === 0) {
                    if ((button.width + 10) * numberOfItem <= minWidthOfGallery) {
                        button.width = minWidthOfGallery / numberOfItem - 10;
                    }
                }

                if (stretchValue === true) {
                    if (orientation > 1) {
                        let marginToApply = minWidthOfGallery - (button.width + this._widthTotal) + 5;
                        let delta = minWidthOfGallery - button.width * numberOfItem;
                        marginToApply -= delta;
                        if (marginToApply <= 0) {
                            button.getContainer().style.marginLeft = '5px';
                        }
                        else {
                            button.getContainer().style.marginLeft = marginToApply + 'px';
                        }
                        this._widthTotal += button.width;
                    }
                    else if (orientation < 0) {
                        let marginToApply = minHeightOfGallery - (button.height + this._heightTotal) + 5;
                        let delta = minHeightOfGallery - button.height * numberOfItem;
                        marginToApply -= delta;

                        if (marginToApply <= 0) {
                            button.getContainer().style.marginTop = '5px';
                        }
                        else {
                            button.getContainer().style.marginTop = marginToApply + 'px';
                        }
                        this._heightTotal += button.height;
                    }
                }
                else {
                    if (minHeightOfGallery < 50) {
                        button.getContainer().style.paddingBottom = '10px';
                    }
                }
                // *************************************************

				return {
					button: button,
					mappers: mappers
				};
			},


			// Register events for play
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].button.registerPlayEvents(iSdkObject, i);
				}
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				for (var i = 0; i < this._UIItems.length; i++) {
					this._UIItems[i].button.releasePlayEvents();
				}
			}

		});
	return CXPGalleryMenu;
});
