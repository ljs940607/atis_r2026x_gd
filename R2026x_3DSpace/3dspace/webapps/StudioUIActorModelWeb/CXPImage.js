/**
* @name DS/StudioUIActorModelWeb/CXPImage
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a CXPImage rep (div + img)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPImage',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor'
],
function (UWA, CXPUIActor) {
	'use strict';

	var CXPImage = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPImage.prototype **/
		{

			init: function (iUIActor) {
				this._parent(iUIActor);

                this._img = UWA.createElement('img').inject(this.getContainer());
                this._img.setAttribute('draggable', false);
                this._img.style.width = '100%';
                this._img.style.height = '100%';
                this._img.style.display = 'inherit';

				Object.defineProperty(this, 'enable', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._enable;
					},
					set: function (iValue) {
						this._enable = iValue;
						if (this._enable) {
							this._img.style.pointerEvents = 'inherit';
							this._img.style.filter = 'none';
						}
						else {
							this._img.style.pointerEvents = 'none';
							this._img.style.filter = 'brightness(70%) grayscale(100%)';
						}
					}
				});

				Object.defineProperty(this, 'opacity', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._opacity;
					},
					set: function (iValue) {
						this._opacity = iValue;
						this._img.style.opacity = this._opacity/255;
					}
				});

				Object.defineProperty(this, 'image', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._image;
					},
					set: function (iValue) {
						this._image = iValue;
						if (this._image) {
							var cati3DXPictureResourceAsset = this._image.QueryInterface('CATI3DXPictureResourceAsset');
							if (!UWA.is(cati3DXPictureResourceAsset)) {console.error('Cant retrieve picture'); return;}
							var self = this;
							cati3DXPictureResourceAsset.getPicture().then(function (iPicture) {
								self._img.src = iPicture.src;
                                self._img.hidden = false;
                            });
						}
						else {
                            this._img.hidden = true;
						}
					}
				});

				Object.defineProperty(this, 'src', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._src;
					},
					set: function (iValue) {
						this._src = iValue;
						if ((this._src) && (!this.image)) {
                            this._img.src = this._src;
                            this._img.hidden = false;
						}
					}
				});
			},

			// Register events for play
			// Click and double click
			registerPlayEvents: function (iSdkObject, index) {
			    this._parent(iSdkObject);
			    var isGalleryChild = UWA.is(index);
				index = UWA.is(index) ? index : 0;

				var container = this.getContainer();
				container.addEventListener('click', this._clickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIClicked', index);
				});

				container.addEventListener('dblclick', this._dblclickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIDoubleClicked', index);
				});

				container.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIEntered', index);
				});

				container.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIExited', index);
				});

				container.addEventListener('mousemove', this._mouseMoveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIHovered', index);
				});

				if (!isGalleryChild) {
				    container.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
				        if (iEvent.button === 0) {
				            iSdkObject.doUIDispatchEvent('UIPressed', index);
				        }
				    });

				    container.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
				        if (iEvent.button === 0) {
				            iSdkObject.doUIDispatchEvent('UIReleased', index);
				        }
				    });
				}

				container.addEventListener('contextmenu', this._contextMenuEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIRightClicked', index);
				    return false;
				});
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();
				var container = this.getContainer();
				container.removeEventListener('click', this._clickEvent);
				container.removeEventListener('dblclick', this._dblclickEvent);
				container.removeEventListener('mouseenter', this._mouseEnterEvent);
				container.removeEventListener('mouseleave', this._mouseLeaveEvent);
				container.removeEventListener('mousemove', this._mouseMoveEvent);
				container.removeEventListener('mousedown', this._mouseDownEvent);
				container.removeEventListener('mouseup', this._mouseUpEvent);
				container.removeEventListener('contextmenu', this._contextMenuEvent);
			}

		});
	return CXPImage;
});



