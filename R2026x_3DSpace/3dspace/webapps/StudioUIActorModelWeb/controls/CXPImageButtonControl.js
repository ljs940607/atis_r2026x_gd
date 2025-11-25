/**
 * 
 * A button that displays a different image according to the state of the button
 * 
 * @name DS/StudioUIActorModelWeb/CXPImageButtonControl
 * @constructor
 * @augments module:DS/Controls/Abstract
 * 
 * @param {Object|Element} [options] - Options used for construction.
 * @param {String}         [options.normalImage='']
 * @param {String}         [options.pressedImage='']
 * @param {String}         [options.disabledImage='']
 * @param {String}         [options.hoveredImage='']
 * @param {Boolean}        [options.enabled=true]
 * @param {Function}       [options.onClick=undefined]
 * @param {Function}       [options.onDoubleClick=undefined]
 * @param {Function}       [options.onPress=undefined]
 * @param {Function}       [options.onRelease=undefined]
 * @param {Function}       [options.onEnter=undefined]
 * @param {Function}       [options.onExit=undefined]
 * @param {Function}       [options.onHover=undefined]
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPImageButtonControl', 
['UWA/Core', 
'DS/Controls/Abstract', 
'css!DS/StudioUIActorModelWeb/style/CXPImageButtonControl.css',
'DS/Utilities/Dom',
'DS/Core/PointerEvents'],

function (UWA, Abstract, CXPImageButtonCSS, DomUtils, PointerEvents) {
    'use strict';

    function _updateEventHandler(iEventName, iOldValue, iNewValue) {
        if (iOldValue) {
            this.removeEventListener(iEventName, iOldValue);
        }
        if (iNewValue) {
            this.addEventListener(iEventName, iNewValue);
        }
    }

    function _updateView() {
        if (this.enabled) {
            if (this._isPressed && this._isHovered) {
                this.elements.img.src = this.pressedImage;
            } else if (this._isHovered) {
                this.elements.img.src = this.hoveredImage;
            } else {
                this.elements.img.src = this.normalImage;
            }
        } else {
            this.elements.img.src = this.disabledImage;
        }
    }

    var CXPImageButtonControl = Abstract.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPImageButtonControl.prototype
          */
          {
            publishedProperties: {
              normalImage: {
                defaultValue: '',
                type: 'string'
              },
              pressedImage: {
                defaultValue: '',
                type: 'string'
              },
              hoveredImage: {
                defaultValue: '',
                type: 'string'
              },
              disabledImage: {
                defaultValue: '',
                type: 'string'
              },
              enabled: {
                  defaultValue: true,
                  type: 'boolean'
              },
              onClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onDoubleClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onRightClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onEnter: {
                defaultValue: undefined,
                type: 'function'
              },
              onExit: {
                defaultValue: undefined,
                type: 'function'
              },
              onPress: {
                defaultValue: undefined,
                type: 'function'
              },
              onRelease: {
                defaultValue: undefined,
                type: 'function'
              },
              onHover: {
                defaultValue: undefined,
                type: 'function'
              }
            },
            
            _preBuildView: function(properties) {
                this.elements.container = new UWA.Element('div', {
                    'class': 'cxp-controls-imagebutton',
                    tabindex: 0
                  });
                  this._parent(properties);
            },

            buildView: function() {
                this._parent();
                this.elements.img = UWA.createElement('img').inject(this.elements.container);
                this.elements.img.setAttribute('draggable', false);
                this._isPressed = false;
                this._isHovered = false;
            },

            handleEvents: function() {
                var self = this;
            
                DomUtils.addEventOnElement(this, this.elements.container, 'click', function () {
                    if (!self.enabled) return;
                    self.fire('imagebuttonclick');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERHIT, function (e) {
                    if (e.multipleHitCount === 2) { // if double click
                        if (!self.enabled) {
                            return;
                        }
                        self.fire('imagebuttondoubleclick');
                    }
                });

                DomUtils.addEventOnElement(this, this.elements.container, 'contextmenu', function () {
                    if (!self.enabled) {
                        return;
                    }
                    self.fire('imagebuttonrightclick');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERDOWN, function (e) {
                    if (!self.enabled) return;

                    self._isPressed = true;
                    _updateView.call(self);

                    self.fire('imagebuttonpress');

                    if (e.originalEvent && e.originalEvent.type === "touchstart") {
                        //add an attribute to handle the fact that we want to prevent any CSS related to :hover to be applied in touch environment
                        self.elements.container.setAttribute('hasHoverPrevented', '');
                    }
                });

                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERUP, function () {
                    if (!self.enabled && !self._isPressed) return;

                    self._isPressed = false;
                    _updateView.call(self);

                    self.fire('imagebuttonrelease');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERMOVE, function (e) {
                    if (!self.enabled) return;
                    if ((e).originalEvent && (e).originalEvent.type === "mousemove") {
                        //remove the attribute that prevents the :hover CSS to be applied. Removing it on mousemove allow us to handle hybrid env (touch + mouse)
                        self.elements.container.removeAttribute('hasHoverPrevented');
                    }
                    
                    self.fire('imagebuttonhover');
                });

                DomUtils.addEventOnElement(this, this.elements.container, 'pointerenter', function (e) {
                    if (!self.enabled) return;
                    self._isHovered = true;
                    self._isPressed = ((e.buttons&1) ===  1);
                    _updateView.call(self);
                    self.fire('imagebuttonenter');
                });

                DomUtils.addEventOnElement(this, this.elements.container, 'pointerleave', function () {
                    if (!self.enabled && !self._isHovered) return;
                    self._isHovered = false;
                    _updateView.call(self);
                    self.fire('imagebuttonexit');
                });
            },
            

            _applyNormalImage: function() {
                _updateView.call(this);
            },

            _applyPressedImage: function() {
                _updateView.call(this);
            },

            _applyDisabledImage: function() {
                _updateView.call(this);
            },

            _applyHoveredImage: function() {
                _updateView.call(this);
            },

            _applyEnable: function() {
                _updateView.call(this);
            },

            _applyOnClick: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonclick', iOldValue, this.onClick);
            },

            _applyOnDoubleClick: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttondoubleclick', iOldValue, this.onDoubleClick);
            },

            _applyOnRightClick: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonrightclick', iOldValue, this.onRightClick);
            },

            _applyOnEnter: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonenter', iOldValue, this.onEnter);
            },

            _applyOnExit: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonexit', iOldValue, this.onExit);
            },

            _applyOnPress: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonpress', iOldValue, this.onPress);
            },

            _applyOnRelease: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonrelease', iOldValue, this.onRelease);
            },

            _applyOnHover: function(iOldValue) {
                _updateEventHandler.call(this, 'imagebuttonhover', iOldValue, this.onHover);
            },
      
            _applyProperties: function (oldValues) {
                this._parent(oldValues);

                if (this.isDirty('normalImage') || this.isDirty('pressedImage') || this.isDirty('disabledImage') || this.isDirty('hoveredImage') || this.isDirty('enabled')) {
                    _updateView.call(this);
                } 

                if (this.isDirty('onClick')) {
                    this._applyOnClick(oldValues.onClick);
                }

                if (this.isDirty('onDoubleClick')) {
                    this._applyOnDoubleClick(oldValues.onDoubleClick);
                }

                if (this.isDirty('onRightClick')) {
                    this._applyOnRightClick(oldValues.onRightClick);
                }

                if (this.isDirty('onPress')) {
                    this._applyOnPress(oldValues.onPress);
                }

                if (this.isDirty('onRelease')) {
                    this._applyOnRelease(oldValues.onRelease);
                }

                if (this.isDirty('onEnter')) {
                    this._applyOnEnter(oldValues.onEnter);
                }

                if (this.isDirty('onExit')) {
                    this._applyOnEnter(oldValues.onExit);
                }

                if (this.isDirty('onHover')) {
                    this._applyOnEnter(oldValues.onHover);
                }

            }
        });

        return CXPImageButtonControl;
});

