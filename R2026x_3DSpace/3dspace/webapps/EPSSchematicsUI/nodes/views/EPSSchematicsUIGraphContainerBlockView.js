/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphContainerBlockView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphContainerBlockView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIBlockView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, UIBlockView, UIDom, BlockLibrary) {
    "use strict";
    /**
     * This class defines a UI graph container block view.
     * @private
     * @class UIGraphContainerBlockView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphContainerBlockView
     * @extends UIBlockView
     */
    class UIGraphContainerBlockView extends UIBlockView {
        /**
         * @public
         * @constructor
         * @param {UIGraphContainerBlock} block - The UI graph container block.
         */
        constructor(block) {
            super(block);
            this._blockNameRef = BlockLibrary.getBlock(block.getModel().getUid()).getName();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * This method gets the block sub name element.
         * @public
         * @returns {HTMLDivElement} The block sub name element.
         */
        getBlockSubNameElement() {
            return this._blockSubNameElt;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the node display modification.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.PathSetTrie} changes - Changes set of paths of modified properties.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        onmodifyDisplay(elt, changes, grView) {
            super.onmodifyDisplay(elt, changes, grView);
            this._updateBlockSubName();
        }
        /**
         * Creates the block container.
         * @protected
         * @override
         */
        _createBlockContainer() {
            super._createBlockContainer();
            this._updateBlockSubName();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Checks if the user block name is identical to the block sub name reference.
         * @private
         * @returns {boolean} True if block name is identical to block sub name.
         */
        _areBlockNameIdentical() {
            return this._block.getModel().getName() === this._blockNameRef;
        }
        /**
         * Updates the display of the block sub name.
         * @private
         */
        _updateBlockSubName() {
            if (this._blockSubNameElt !== undefined) {
                this._blockContainerMiddleCenter.removeChild(this._blockSubNameElt);
                this._blockSubNameElt = undefined;
            }
            if (!this._areBlockNameIdentical()) {
                this._blockSubNameElt = UIDom.createElement('div', {
                    className: 'sch-block-subname',
                    parent: this._blockContainerMiddleCenter,
                    textContent: this._blockNameRef
                });
            }
        }
    }
    return UIGraphContainerBlockView;
});
