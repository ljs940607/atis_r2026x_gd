/**
* @name DS/StudioUIActorModelWeb/CXPButton
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a button rep (WUXButton)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPButton',
[
	'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor',
	'DS/Controls/Button'
],
function (UWA, CXPUIActor, WUXButton) {
	'use strict';

	var CXPButton = CXPUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/CXPButton.prototype **/
	{
		init: function (iUIActor) {
			this._parent(iUIActor);

            this._button = new WUXButton({ emphasize: 'secondary' }).inject(this.getContainer());
            this._button.elements.container.style.overflow = 'initial';
            this._button.elements.container.style.minWidth = '100%';
            this._button.elements.container.style.minHeight = '100%';

			Object.defineProperty(this, 'enable', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._enable;
				},
				set: function (iValue) {
					this._enable = iValue;
					this._button.disabled = !this._enable;
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
                    this._button.elements.container.style.opacity = this._opacity/255;
				}
            });

			Object.defineProperty(this, 'fontHeight', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._fontHeight;
				},
				set: function (iValue) {
                    this._fontHeight = iValue;

                    if (this._fontHeight === 1) {
                        this._button.elements.container.style.fontSize = '12px';
                    }
                    else if (this._fontHeight < 10) {
                        this._button.elements.container.style.fontSize = Math.pow(10, -(10 - this._fontHeight)) * 20 + '%';
                    }
                    else {
                        this._button.elements.container.style.fontSize = this._fontHeight * 6 + '%';
                    }
                    var height = this._fontHeight * 2.5;
                    if (height > 100) {
                        this._button.elements.container.style.minHeight = height + '%';
                    }

				}
			});

			Object.defineProperty(this, 'icon', { //not tested can't display base64img
				enumerable: true,
				configurable: true,
				get: function () {
					return this._icon;
				},
				set: function (iValue) {
				    this._icon = iValue;
				    if (this._icon) {
						var cati3DXPictureResourceAsset = this._icon.QueryInterface('CATI3DXPictureResourceAsset');
						if (!UWA.is(cati3DXPictureResourceAsset)) { console.error('Cant retrieve picture'); return; }
						var self = this;
						this._button.elements.container.style.paddingLeft = '0px';
						this._button.elements.container.style.paddingRight = '0px';
						cati3DXPictureResourceAsset.getPicture().then(function (iPicture) {
							self._button.icon = iPicture.src;
				            if (self._iconWidth) {
				                self._button.elements.icon.width = self._iconWidth;
				            }
				            if (self._iconHeight) {
				                self._button.elements.icon.height = self._iconHeight;
				            }
				        });
				    }
				    else {
						this._button.icon = '';
						this._button.elements.container.style.paddingLeft = '';
						this._button.elements.container.style.paddingRight = '';
				    }
				}
			});

			Object.defineProperty(this, 'iconWidth', {
			    enumerable: true,
			    configurable: true,
			    get: function () {
			        return this._iconWidth;
			    },
			    set: function (iValue) {
			        this._iconWidth = iValue;
			        if (this._button.elements.icon) {
			            this._button.elements.icon.width = iValue;
			        }
			    }
			});

			Object.defineProperty(this, 'iconHeight', {
			    enumerable: true,
			    configurable: true,
			    get: function () {
			        return this._iconHeight;
			    },
			    set: function (iValue) {
			        this._iconHeight = iValue;
			        if (this._button.elements.icon) {
			            this._button.elements.icon.height = iValue;
			        }
			    }
			});

			Object.defineProperty(this, 'label', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._label;
				},
				set: function (iValue) {
					this._label = iValue;
					this._button.label = this._label;
				}
			});

			Object.defineProperty(this, 'pushable', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._pushable;
				},
				set: function (iValue) {
					this._pushable = iValue;
					if (this._pushable) {
						this._button.type = 'check';
					}
					else {
						this._button.type = 'standard';
					}
				}
			});

			Object.defineProperty(this, 'pushed', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._pushed;
				},
				set: function (iValue) {
					this._pushed = iValue;
					if (this._pushed && this.pushable) {
						this._button.checkFlag = true;
					} else {
						this._button.checkFlag = false;
					}
				}
			});
		},

		// Register events for play
		registerPlayEvents: function (iSdkObject, index) {
			this._parent(iSdkObject);
			var self = this;
			var isGalleryChild = UWA.is(index);
			index = UWA.is(index) ? index : 0;

			this._button.onClick = function () {
				iSdkObject.pushed = self._button.checkFlag;
				iSdkObject.doUIDispatchEvent('UIClicked', index);
			};

			this._button.addEventListener('dblclick', this._dblclickEvent = function () {
			    iSdkObject.doUIDispatchEvent('UIDoubleClicked', index);
			});

			this._button.addEventListener('mouseenter', this._mouseEnterEvent = function () {
			    iSdkObject.doUIDispatchEvent('UIEntered', index);
			});

			this._button.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
			    iSdkObject.doUIDispatchEvent('UIExited', index);
			});

			this._button.addEventListener('mousemove', this._mouseMoveEvent = function () {
			    iSdkObject.doUIDispatchEvent('UIHovered', index);
			});

			if (!isGalleryChild) {
			    this._button.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
			        if (iEvent.button === 0) {
			            iSdkObject.doUIDispatchEvent('UIPressed', index);
			        }
			    });

			    this._button.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
			        if (iEvent.button === 0) {
			            iSdkObject.doUIDispatchEvent('UIReleased', index);
			        }
			    });
			}

			this._button.addEventListener('contextmenu', this._contextMenuEvent = function () {
			    iSdkObject.doUIDispatchEvent('UIRightClicked', index);
			    return false;
			});
		},

		// Release play events
		releasePlayEvents: function () {
			this._parent();
			this._button.onClick = null;
			this._button.removeEventListener('dblclick', this._dblclickEvent);
			this._button.removeEventListener('mouseenter', this._mouseEnterEvent);
			this._button.removeEventListener('mouseleave', this._mouseLeaveEvent);
			this._button.removeEventListener('mousemove', this._mouseMoveEvent);
			this._button.removeEventListener('mousedown', this._mouseDownEvent);
			this._button.removeEventListener('mouseup', this._mouseUpEvent);
			this._button.removeEventListener('contextmenu', this._contextMenuEvent);
		}
	});
	return CXPButton;
});




