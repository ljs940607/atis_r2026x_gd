/**
* @name DS/StudioUIActorModelWeb/CXPColorPicker
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a ColorPicker rep (WUXColorChooser)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPColorPicker',
    [
        'UWA/Core',
        'DS/StudioUIActorModelWeb/CXPUIActor',
        'DS/Controls/ColorChooser'
    ],
    function (UWA, CXPUIActor, WUXColorChooser) {
        'use strict';

        var CXPColorPicker = CXPUIActor.extend(
            /** @lends DS/StudioUIActorModelWeb/CXPColorPicker.prototype **/
            {

                init: function (iUIActor) {
                    this._parent(iUIActor);

                    this._holder = UWA.createElement('div').inject(this.getContainer());
                    this._colorPicker = new WUXColorChooser().inject(this._holder);
                    this._colorPicker.informationsVisibleFlag = false;
                    this._colorPicker.colorChooserDimensions = { x: 220, y: 160 };
                    var content = this._colorPicker.getContent();
                    content.style.textAlign = 'initial';
                    this._holder.style.background = 'silver';
                    this._holder.style.textAlign = 'center';
                    this._holder.style.width = '100%';
                    this._holder.style.height = '100%';
                    this._holder.style.minWidth = '211px';
                    this._holder.style.minHeight = '196px';
                    this._holder.style.paddingTop = '10px';

                    Object.defineProperty(this, 'enable', {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return this._enable;
                        },
                        set: function (iValue) {
                            this._enable = iValue;
                            this._colorPicker.disabled = !this._enable;
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
                            this._colorPicker.elements.container.style.opacity = this._opacity / 255;
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
                                self._colorPicker.value = self._rgbToHex(colorEO.GetValueByName('r'), colorEO.GetValueByName('g'), colorEO.GetValueByName('b'));
                            };
                            this._mapper.listenTo(colorEO, 'r.CHANGED', this._colorCallback);
                            this._mapper.listenTo(colorEO, 'g.CHANGED', this._colorCallback);
                            this._mapper.listenTo(colorEO, 'b.CHANGED', this._colorCallback);

                            this._colorCallback();
                        }
                    });

                },

                // Register events for play
                // Color change
                registerPlayEvents: function (iSdkObject) {
                    this._parent(iSdkObject);
                    var self = this;

                    this._colorPicker.addEventListener('change', this._colorPickerValueChanged = function () {
                        var color = self._hexToRgb(self._colorPicker.value);
                        iSdkObject.color.r = color.r;
                        iSdkObject.color.g = color.g;
                        iSdkObject.color.b = color.b;

                        iSdkObject.doUIDispatchEvent('UIValueChanged', 0);
                    });

                    this._colorPicker.addEventListener('mouseenter', this._mouseEnterEvent = function () {
                        iSdkObject.doUIDispatchEvent('UIEntered', 0);
                    });

                    this._colorPicker.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
                        iSdkObject.doUIDispatchEvent('UIExited', 0);
                    });
                },

                // Release play events
                releasePlayEvents: function () {
                    this._parent();

                    this._colorPicker.removeEventListener('change', this._colorPickerValueChanged);
                    this._colorPicker.removeEventListener('mouseenter', this._mouseEnterEvent);
                    this._colorPicker.removeEventListener('mouseleave', this._mouseLeaveEvent);
                },


                _hexToRgb: function (hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                },

                _rgbToHex: function (r, g, b) {
                    return '#' + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
                },

                _componentToHex: function (c) {
                    var hex = c.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }
            });
        return CXPColorPicker;
    });




