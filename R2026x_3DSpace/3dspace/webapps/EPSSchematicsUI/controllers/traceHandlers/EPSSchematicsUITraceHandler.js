/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIDom, UINLS) {
    "use strict";
    /**
     * This class defines a UI trace handler.
     * It provides enabling and disabling trace capacities.
     * @private
     * @class UITraceHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler
     */
    class UITraceHandler {
        static { this.kTraceOffDelay = 500; }
        static { this.kTraceDoneDelay = 200; }
        /**
         * @public
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIBlock|UILink|UIPort} elementUI - The UI element to trace.
         */
        constructor(controller, elementUI) {
            this._controller = controller;
            this._elementUI = elementUI;
            this._element = this._elementUI.getElement();
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
         * Enables the trace capacity.
         * @public
         * @param {boolean} skipAnimation - True to skip the trace animation.
         * @param {ITraceOptions} [_options] - The trace options.
         * @param {boolean} [fromDebug=false] - True if from debug else false.
         */
        enable(skipAnimation, _options, fromDebug = false) {
            clearTimeout(this._traceOffTimer);
            clearTimeout(this._traceDoneTimer);
            UIDom.removeClassName(this._element, [
                'sch-trace-on',
                'sch-trace-off',
                'sch-trace-debug'
            ]);
            UIDom.addClassName(this._element, 'sch-trace-done');
            if (fromDebug) {
                UIDom.addClassName(this._element, 'sch-trace-debug');
            }
            if (!skipAnimation) {
                UIDom.addClassName(this._element, 'sch-trace-on');
                this._traceOffTimer = setTimeout(() => {
                    UIDom.addClassName(this._element, 'sch-trace-off');
                    UIDom.removeClassName(this._element, 'sch-trace-on');
                    this._traceDoneTimer = setTimeout(() => {
                        UIDom.removeClassName(this._element, 'sch-trace-off');
                    }, UITraceHandler.kTraceDoneDelay);
                }, UITraceHandler.kTraceOffDelay);
            }
        }
        /**
         * Disables the trace capacity.
         * @private
         */
        disable() {
            clearTimeout(this._traceOffTimer);
            clearTimeout(this._traceDoneTimer);
            UIDom.removeClassName(this._element, [
                'sch-trace-on',
                'sch-trace-off',
                'sch-trace-done',
                'sch-trace-debug'
            ]);
            this._controller = undefined;
            this._elementUI = undefined;
            this._element = undefined;
            this._traceOffTimer = undefined;
            this._traceDoneTimer = undefined;
        }
        /**
         * Gets the block display path.
         * @public
         * @returns {string} The block display path.
         */
        getDisplayPath() {
            const blockModel = this._elementUI.getModel();
            let graph = blockModel.graph;
            let displayPath = '';
            while (graph !== undefined) {
                displayPath += graph.getName() + '/';
                graph = graph.graph;
            }
            displayPath += blockModel.getName();
            return displayPath;
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
         * Displays the provided error message on the notification manager.
         * @protected
         * @param {ITraceOptions} options - The trace options.
         */
        displayError(options) {
            this._controller.getEditor().displayNotification({
                level: 'error',
                subtitle: UINLS.get('notificationExecutionBlockError', { blockName: this.getDisplayPath() }),
                message: options.errorMessage
            });
            // eslint-disable-next-line no-console
            console.error(options.errorStack);
        }
    }
    return UITraceHandler;
});
