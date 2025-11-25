/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUITemplatableBlock'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUITemplatableBlock", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UIBlock, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI templatable block.
     * @private
     * @abstract
     * @class UITemplatableBlock
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUITemplatableBlock
     * @extends UIBlock
     */
    class UITemplatableBlock extends UIBlock {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {Block} model - The block model.
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         */
        constructor(graph, model, left, top) {
            super(graph, model, left, top);
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
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {UICommand[]} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            let newCommands = [];
            if (this._model.isTemplate()) {
                newCommands = this._getCommandsFromTemplatedBlock();
                // Remove the open block documentation command
                const index = commands.findIndex(command => command.getCommandType() === UICommandType.eOpenBlockDocumentation);
                commands.splice(index, 1);
            }
            else {
                newCommands = this._getCommandsFromTemplatableBlock();
            }
            const index = commands.findIndex(command => command.getCommandType() === UICommandType.eEdit);
            commands.splice(index + 1, 0, ...newCommands);
            return commands;
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
         * Gets the list of available templatable block related commands.
         * @private
         * @returns {UICommand[]} The list of available templatable block related commands.
         */
        _getCommandsFromTemplatableBlock() {
            const commands = [];
            const options = this._graph.getEditor().getOptions();
            const isReadOnly = this._graph.getViewer().isReadOnly();
            if (options.templates?.enableLocalTemplates && this._model.isLocalTemplatable() && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eCreateLocalTemplate, this._createLocalTemplate.bind(this)));
            }
            if (options.templates?.enableGlobalTemplates && this._model.isGlobalTemplatable() && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eCreateGlobalTemplate, this._createGlobalTemplate.bind(this)));
            }
            return commands;
        }
        /**
         * Untemplates the script block.
         * @protected
         */
        _untemplate() {
            if (this._model.isTemplate()) {
                this._model.untemplate();
            }
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
         * Gets the list of available templated block related commands.
         * @private
         * @returns {UICommand[]} The list of available templated block related commands.
         */
        _getCommandsFromTemplatedBlock() {
            const commands = [];
            const isReadOnly = this._graph.getViewer().isReadOnly();
            if (this._model.isTemplate() && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eEditTemplate, this._editTemplateReference.bind(this)));
                commands.push(new UICommand(UICommandType.eUntemplate, this._untemplate.bind(this)));
                const options = this._graph.getEditor().getOptions();
                if (this._model.isLocalTemplate() && options.templates?.enableGlobalTemplates) {
                    commands.push(new UICommand(UICommandType.eConvertLocalToGlobalTemplate, this._convertLocalTemplateToGlobalTemplate.bind(this)));
                }
            }
            return commands;
        }
    }
    return UITemplatableBlock;
});
