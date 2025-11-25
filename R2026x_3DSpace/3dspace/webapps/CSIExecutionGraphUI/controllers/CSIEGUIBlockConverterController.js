/// <amd-module name='DS/CSIExecutionGraphUI/controllers/CSIEGUIBlockConverterController'/>
define("DS/CSIExecutionGraphUI/controllers/CSIEGUIBlockConverterController", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsJSONConverter", "DS/EPSSchematicsCoreLibrary/flow/EPSWaitAllBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock"], function (require, exports, SchematicsJSONConverter, WaitAllBlock, SyncFlowsBlock) {
    "use strict";
    /**
     * This class defines the CSI Execution Graph UI block converter controller.
     * @private
     * @class CSIEGUIBlockConverterController
     * @alias module:DS/CSIExecutionGraphUI/controllers/CSIEGUIBlockConverterController
     */
    class CSIEGUIBlockConverterController {
        /**
         * Registers the block converters.
         * @public
         * @static
         */
        static registerBlockConverters() {
            SchematicsJSONConverter.addBlockConverter('2.0.5', WaitAllBlock.prototype.uid, SyncFlowsBlock.prototype.uid, this._convertWaitAllBlock);
        }
        /**
         * The Wait All block converter.
         * @private
         * @static
         * @param {Block} iOldBlock - The old block.
         * @param {Block} oNewBlock - The new block.
         * @param {ControlPort[]} _ioLinkedControlPort - The list of linked control ports.
         */
        static _convertWaitAllBlock(iOldBlock, oNewBlock, _ioLinkedControlPort) {
            const jsonObject = {};
            iOldBlock.toJSON(jsonObject);
            oNewBlock.fromJSON(jsonObject);
        }
    }
    return CSIEGUIBlockConverterController;
});
