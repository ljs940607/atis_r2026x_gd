/**
* @name DS/StudioUIActorModelWeb/CXPSlider
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a slider rep (WUXSlider)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPSlider',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor',
	'DS/Controls/Slider'
],
function (UWA, CXPUIActor, WUXSlider) {
	'use strict';

	var CXPSlider = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPSlider.prototype **/
		{

			init: function (iUIActor) {
				this._parent(iUIActor);

                var sliderData = iUIActor.QueryInterface('CATI3DExperienceObject').GetValueByName('data');
                this._valueUnit = sliderData.QueryInterface('CATI3DExperienceObject').GetValueByName('valueUnit');
                this._showValueLabel = sliderData.QueryInterface('CATI3DExperienceObject').GetValueByName('showValueLabel');
                this._labelPosition = sliderData.QueryInterface('CATI3DExperienceObject').GetValueByName('labelPosition');

                this._holder = UWA.createElement('div').inject(this.getContainer());

                if (this._labelPosition === 1 || this._labelPosition === 2) {       // label at the bottom or on the right
                    this._holderSubSlider = UWA.createElement('div').inject(this._holder);
                    this._holderSubSpan = UWA.createElement('div').inject(this._holder);
                }
                else {
                    this._holderSubSpan = UWA.createElement('div').inject(this._holder);
                    this._holderSubSlider = UWA.createElement('div').inject(this._holder);
                }

               // this._holder.style.overflow = 'hidden';
                this._holder.style.minWidth = '70px';
                this._slider = new WUXSlider().inject(this._holderSubSlider);
                this._span = UWA.createElement('span').inject(this._holderSubSpan);

				Object.defineProperty(this, 'enable', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._enable;
					},
					set: function (iValue) {
						this._enable = iValue;
						this._slider.disabled = !this._enable;
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
						this._holder.style.opacity = this._opacity/255;
					}
				});

                Object.defineProperty(this, 'showValueLabel', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._showValueLabel;
                    },
                    set: function (iValue) {
                        this._showValueLabel = iValue;
                    }
                });

                Object.defineProperty(this, 'valueUnit', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._valueUnit;
                    },
                    set: function (iValue) {
                        this._valueUnit = iValue;
                    }
                });

				Object.defineProperty(this, 'orientation', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._orientation;
					},
					set: function (iValue) {
						this._orientation = iValue;
                        this._holderSubSpan.style.textAlign = "center";
                        if (this._orientation === 0) {      // vertical orientation
                            this._slider.displayStyle = 'vertical';
                            this._holderSubSlider.style.justifyContent = "center";
                            this._holderSubSlider.style.display = "flex";

                            if (this._labelPosition === 3 || this._labelPosition === 2) {   // label on the left or on the right
                                this._holderSubSlider.style.width = '50%';
                                this._holderSubSlider.style.height = 'auto';
                                this._holderSubSpan.style.width = 'auto';
                                this._holderSubSpan.style.height = 'auto';
                                this._holderSubSpan.style.whiteSpace = 'pre';
                                this._holder.style.alignItems = 'center';
                                this._holder.style.display = 'flex';
                            }
                        }
                        else if (this._orientation === 1) {     // horizontal orientation
                            this._slider.displayStyle = 'horizontal';
                            if (this._labelPosition === 3 || this._labelPosition === 2) {
                                this._holderSubSlider.style.width = '100%';
                                this._holderSubSlider.style.height = 'auto';
                                this._holderSubSpan.style.width = 'auto';
                                this._holderSubSpan.style.height = 'auto';
                                this._holderSubSpan.style.whiteSpace = 'pre';
                                this._holder.style.alignItems = 'center';
                                this._holder.style.display = 'flex';
                            }
                        }
					}
				});

				Object.defineProperty(this, 'maximumValue', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._maximumValue;
					},
					set: function (iValue) {
						this._maximumValue = iValue;
						this._slider.maxValue = this._maximumValue;
					}
				});

				Object.defineProperty(this, 'minimumValue', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._minimumValue;
					},
					set: function (iValue) {
						this._minimumValue = iValue;
						this._slider.minValue = this._minimumValue;
					}
				});

				Object.defineProperty(this, 'stepValue', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._stepValue;
					},
					set: function (iValue) {
						this._stepValue = iValue;
						this._slider.stepValue = this._stepValue;
					}
				});

				Object.defineProperty(this, 'value', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._value;
					},
					set: function (iValue) {
						this._value = iValue;
						this._slider.value = this._value;
                        if (this._showValueLabel) {
                            this._span.textContent = this._value + " " + this._valueUnit;
                        } 
					}
				});

			},

			// Register events for play
			registerPlayEvents: function (iSdkObject) {
				var self = this;
				this._parent(iSdkObject);

				this._slider.addEventListener('change', this._sliderValueChanged = function () {
					iSdkObject.value = self._slider.value;
					iSdkObject.doUIDispatchEvent('UIValueChanged', 0);
				});

			    this._slider.addEventListener('beginEdit', this._beginEditChanged = function () {
				    iSdkObject.doUIDispatchEvent('UIDragStarted', 0);
				});

			    this._slider.addEventListener('endEdit', this._endEditChanged = function () {
				    iSdkObject.doUIDispatchEvent('UIDragEnded', 0);
				});

			    this._slider.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIEntered', 0);
				});

			    this._slider.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIExited', 0);
				});
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				this._slider.removeEventListener('change', this._sliderValueChanged);
				this._slider.removeEventListener('beginEdit', this._beginEditChanged);
				this._slider.removeEventListener('endEdit', this._endEditChanged);
				this._slider.removeEventListener('mouseenter', this._mouseEnterEvent);
				this._slider.removeEventListener('mouseleave', this._mouseLeaveEvent);
			}
		});
	return CXPSlider;
});




