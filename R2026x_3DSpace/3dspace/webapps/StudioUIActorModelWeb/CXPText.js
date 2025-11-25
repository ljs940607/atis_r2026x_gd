/**
* @name DS/StudioUIActorModelWeb/CXPText
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a CXPText rep (div + span)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPText',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor'
],
function (UWA, CXPUIActor) {
	'use strict';

	var CXPText = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPText.prototype **/
		{

			init: function (iUIActor) {
				this._parent(iUIActor);

				this._spanHolder = UWA.createElement('div').inject(this.getContainer());
				this._spanHolder.style.boxSizing = 'border-box';
				this._spanHolder.style.cursor = 'default';
				this._span = UWA.createElement('span').inject(this._spanHolder);
                this._span.style.lineHeight = 'initial';
                this._span.style.whiteSpace = 'pre';
				this._spanHolder.style.border = '2px';
				this._spanHolder.style.borderStyle = 'solid';
				this._spanHolder.style.borderRadius = '5px';
                this._spanHolder.style.padding = '5px';
                this._spanHolder.style.minWidth = '100%';
                this._spanHolder.style.minHeight = '100%';
                this._spanHolder.style.position = 'absolute';

				Object.defineProperty(this, 'enable', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._enable;
					},
					set: function (iValue) {
						this._enable = iValue;
						if (this._enable) {
							this._spanHolder.style.pointerEvents = 'inherit';
							this._spanHolder.style.filter = 'none';
						}
						else {
							this._spanHolder.style.pointerEvents = 'none';
							this._spanHolder.style.filter = 'brightness(70%) grayscale(100%)';
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
						this._spanHolder.style.opacity = this._opacity/255;
					}
				});

				Object.defineProperty(this, 'alignment', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._alignment;
					},
					set: function (iValue) {
						this._alignment = iValue;
						if (this._alignment === 0) {
							this._spanHolder.style.textAlign = 'left';
						}
						else if (this._alignment === 1) {
							this._spanHolder.style.textAlign = 'center';
						}
						else if (this._alignment === 2) {
							this._spanHolder.style.textAlign = 'right';
						}
					}
				});

				Object.defineProperty(this, 'color', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._color;
					},
					set: function (iValue) {
					    if (this._color) {
					        this._mapper.stopListening(null, 'r.CHANGED', this._colorCallback);
					        this._mapper.stopListening(null, 'g.CHANGED', this._colorCallback);
					        this._mapper.stopListening(null, 'b.CHANGED', this._colorCallback);
					    }

					    var self = this;
					    this._color = iValue;
					    var colorEO = this._color.QueryInterface('CATI3DExperienceObject');
					    this._colorCallback = function () {
					        self._span.style.color = 'rgb(' + colorEO.GetValueByName('r') + ',' + colorEO.GetValueByName('g') + ',' + colorEO.GetValueByName('b') + ')';
					    };
					    this._mapper.listenTo(colorEO, 'r.CHANGED', this._colorCallback);
					    this._mapper.listenTo(colorEO, 'g.CHANGED', this._colorCallback);
					    this._mapper.listenTo(colorEO, 'b.CHANGED', this._colorCallback);

					    this._colorCallback();
					}
				});

				Object.defineProperty(this, 'text', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._text;
					},
					set: function (iValue) {
                        this._text = iValue;
						this._span.innerHTML = this._text;
					}
				});

				Object.defineProperty(this, 'bold', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._bold;
					},
					set: function (iValue) {
						this._bold = iValue;
						if (this._bold) {
							this._span.style.fontWeight = 'bold';
						}
						else {
							this._span.style.fontWeight = 'normal';
						}
					}
				});

				Object.defineProperty(this, 'fontFamily', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._fontFamily;
					},
					set: function (iValue) {
						this._fontFamily = iValue;
						this._span.style.fontFamily = this._fontFamily;
					}
				});


                Object.defineProperty(this, 'fontHeight', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._height;
					},
					set: function (iValue) {
                        this._height = iValue;
                        if (this._height === 1) {
                            this._height = 14;
                        }
						this._span.style.fontSize = this._height *0.8 + 'px';
					}
				});

				Object.defineProperty(this, 'italic', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._italic;
					},
					set: function (iValue) {
						this._italic = iValue;
						if (this._italic) {
                            this._span.style.fontStyle = 'italic';
                            if (this._height > 50) {
                                this._spanHolder.style.paddingRight = '15px';
                            }
						}
						else {
							this._span.style.fontStyle = 'normal';
						}
					}
				});

				Object.defineProperty(this, 'backgroundColor', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._backgroundColor;
					},
					set: function (iValue) {
					    if (this._backgroundColor) {
					        this._mapper.stopListening(null, 'r.CHANGED', this._backgroundColorCallback);
					        this._mapper.stopListening(null, 'g.CHANGED', this._backgroundColorCallback);
					        this._mapper.stopListening(null, 'b.CHANGED', this._backgroundColorCallback);
					    }

					    var self = this;
					    this._backgroundColor = iValue;
					    var backgroundColorEO = this._backgroundColor.QueryInterface('CATI3DExperienceObject');
					    this._backgroundColorCallback = function () {
					        if (self.showBackground) {
					            self._spanHolder.style.backgroundColor = 'rgb(' + backgroundColorEO.GetValueByName('r') + ',' + backgroundColorEO.GetValueByName('g') + ',' + backgroundColorEO.GetValueByName('b') + ')';
					        }
					        else {
					            self._spanHolder.style.backgroundColor = 'transparent';
					        }
					    };
					    this._mapper.listenTo(backgroundColorEO, 'r.CHANGED', this._backgroundColorCallback);
					    this._mapper.listenTo(backgroundColorEO, 'g.CHANGED', this._backgroundColorCallback);
					    this._mapper.listenTo(backgroundColorEO, 'b.CHANGED', this._backgroundColorCallback);

					    this._backgroundColorCallback();			
					}
				});

				Object.defineProperty(this, 'borderColor', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._borderColor;
					},
					set: function (iValue) {
					    if (this._borderColor) {
					        this._mapper.stopListening(null, 'r.CHANGED', this._borderColorCallback);
					        this._mapper.stopListening(null, 'g.CHANGED', this._borderColorCallback);
					        this._mapper.stopListening(null, 'b.CHANGED', this._borderColorCallback);
					    }

					    var self = this;
					    this._borderColor = iValue;
					    var borderColorEO = this._borderColor.QueryInterface('CATI3DExperienceObject');
					    this._borderColorCallback = function () {
					        if (self.showBorder) {
					            self._spanHolder.style.borderColor = 'rgb(' + borderColorEO.GetValueByName('r') + ',' + borderColorEO.GetValueByName('g') + ',' + borderColorEO.GetValueByName('b') + ')';
					        }
					        else {
					            self._spanHolder.style.borderColor = 'transparent';
					        }
					    };
					    this._mapper.listenTo(borderColorEO, 'r.CHANGED', this._borderColorCallback);
					    this._mapper.listenTo(borderColorEO, 'g.CHANGED', this._borderColorCallback);
					    this._mapper.listenTo(borderColorEO, 'b.CHANGED', this._borderColorCallback);

					    this._borderColorCallback();						
					}
				});

				Object.defineProperty(this, 'showBackground', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._showBackground;
					},
					set: function (iValue) {
						this._showBackground = iValue;
						if (this._showBackground) {
							var color = this.backgroundColor;
							if (color) {
								var colorEO = color.QueryInterface('CATI3DExperienceObject');
								this._spanHolder.style.backgroundColor = 'rgb(' + colorEO.GetValueByName('r') + ',' + colorEO.GetValueByName('g') + ',' + colorEO.GetValueByName('b') + ')';
							}
						}
						else {
							this._spanHolder.style.backgroundColor = 'transparent';
						}
					}
				});

				Object.defineProperty(this, 'showBorder', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._showBorder;
					},
					set: function (iValue) {
						this._showBorder = iValue;
						if (this._showBorder) {
							var color = this.borderColor;
							if (color) {
								var colorEO = color.QueryInterface('CATI3DExperienceObject');
								this._spanHolder.style.borderColor = 'rgb(' + colorEO.GetValueByName('r') + ',' + colorEO.GetValueByName('g') + ',' + colorEO.GetValueByName('b') + ')';
							}
						}
						else {
							this._spanHolder.style.borderColor = 'transparent';
						}
					}
				});


			},

			// Register events for play
			// Click and double click
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);

				this._spanHolder.addEventListener('click', this._clickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIClicked', 0);
				});

				this._spanHolder.addEventListener('dblclick', this._dblclickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIDoubleClicked', 0);
				});

				this._spanHolder.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIEntered', 0);
				});

				this._spanHolder.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIExited', 0);
				});

				this._spanHolder.addEventListener('mousemove', this._mouseMoveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIHovered', 0);
				});

				this._spanHolder.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
				    if (iEvent.button === 0) {
				        iSdkObject.doUIDispatchEvent('UIPressed', 0);
				    }
				});

				this._spanHolder.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
				    if (iEvent.button === 0) {
				        iSdkObject.doUIDispatchEvent('UIReleased', 0);
				    }
				});

				this._spanHolder.addEventListener('contextmenu', this._contextMenuEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIRightClicked', 0);
				    return false;
				});
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				this._spanHolder.removeEventListener('click', this._clickEvent);
				this._spanHolder.removeEventListener('dblclick', this._dblclickEvent);
				this._spanHolder.removeEventListener('mouseenter', this._mouseEnterEvent);
				this._spanHolder.removeEventListener('mouseleave', this._mouseLeaveEvent);
				this._spanHolder.removeEventListener('mousemove', this._mouseMoveEvent);
				this._spanHolder.removeEventListener('mousedown', this._mouseDownEvent);
				this._spanHolder.removeEventListener('mouseup', this._mouseUpEvent);
				this._spanHolder.removeEventListener('contextmenu', this._contextMenuEvent);
            }
		});
	return CXPText;
});




