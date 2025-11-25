/**
 * 
 * A button that displays a different image according to the state of the button
 * 
 * @name DS/StudioUIActorModelWeb/CXPGalleryControl
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
define('DS/StudioUIActorModelWeb/controls/CXPGalleryMenuControl', 
['UWA/Core', 
'DS/StudioUIActorModelWeb/controls/CXPGalleryControl',
'DS/Controls/Button'],

function (UWA, CXPGalleryControl, WUXButton) {
    'use strict';

    var CXPGalleryMenuControl = CXPGalleryControl.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPGalleryControl.prototype
          */
          {
            publishedProperties: {
                fontSize: {
                    defaultValue: 30.0
                }
            },

            buildView: function() {
                this._parent();
                this.selectionFeedback = false;
                this.contentContainers = [];
            },


            _buildItem: function(iItem, iIndex, iItemContainer) {
                this._parent(iItem, iIndex, iItemContainer);
                iItemContainer.style.minWidth =  'var(--minWidth)';
                iItemContainer.style.minHeight = 'var(--minHeight)';

                let button = new WUXButton({ emphasize: 'secondary' }).inject(iItemContainer);
                button.elements.container.style.minWidth = 'var(--minWidth)';
                button.elements.container.style.minHeight = 'var(--minHeight)';
                button.elements.container.style.width = '100%';
                button.elements.container.style.height = '100%';

                button.label = iItem.label;

                this.contentContainers.push(iItemContainer);
                this._applyFontSize();
            },

            _applyFontSize: function() {
                let realFontSize = 0;
                if (this.fontSize === 1) {
                    realFontSize = '12px';
                }
                else {
                    realFontSize = this.fontSize * 6 + '%';
                }

                for (let contentContainer of this.contentContainers) {
                    contentContainer.firstChild.style.fontSize = realFontSize;
                }
            },

            _onCleanItems: function() {
                this._parent();
                this.contentContainers = [];
            }
        });

        return CXPGalleryMenuControl;
});

