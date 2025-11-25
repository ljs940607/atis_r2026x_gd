/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", ["require", "exports", "DS/EPEventServices/EPEvent", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsTools"], function (require, exports, EPEvent, EventServices, Tools) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UIViewerReadOnlyChangeEvent = exports.UIApplicationPrintEvent = exports.UIDialogExpandEvent = exports.UIDialogCloseEvent = exports.UIHistoryControllerUpdateEvent = exports.UIViewerChangeEvent = void 0;
    /**
     * This class defines a UI viewer change event.
     * @class UIViewerChangeEvent
     * @extends EPEvent
     * @private
     */
    class UIViewerChangeEvent extends EPEvent {
        static { this.type = 'UIViewerChangeEvent'; }
        /**
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Gets the viewer.
         * @public
         * @returns {UIViewer} The viewer.
         */
        getViewer() {
            return this.viewer;
        }
        /**
         * Gets the viewer change opening state.
         * @public
         * @returns {boolean} True for opening, false for closing.
         */
        getOpeningState() {
            return this.isOpening;
        }
    }
    exports.UIViewerChangeEvent = UIViewerChangeEvent;
    UIViewerChangeEvent.prototype.type = 'UIViewerChangeEvent';
    EventServices.registerEvent(UIViewerChangeEvent);
    /**
     * This class defines a UI history controller update event.
     * @class UIHistoryControllerUpdateEvent
     * @extends EPEvent
     * @private
     */
    class UIHistoryControllerUpdateEvent extends EPEvent {
        static { this.type = 'UIHistoryControllerUpdateEvent'; }
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    exports.UIHistoryControllerUpdateEvent = UIHistoryControllerUpdateEvent;
    EventServices.registerEvent(UIHistoryControllerUpdateEvent);
    /**
     * This class defines a UI dialog close event.
     * @class UIDialogCloseEvent
     * @extends EPEvent
     * @private
     */
    class UIDialogCloseEvent extends EPEvent {
        static { this.type = 'UIDialogCloseEvent'; }
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    exports.UIDialogCloseEvent = UIDialogCloseEvent;
    EventServices.registerEvent(UIDialogCloseEvent);
    /**
     * This class defines a UI dialog expand event.
     * @class UIDialogExpandEvent
     * @extends EPEvent
     * @private
     */
    class UIDialogExpandEvent extends EPEvent {
        static { this.type = 'UIDialogExpandEvent'; }
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    exports.UIDialogExpandEvent = UIDialogExpandEvent;
    EventServices.registerEvent(UIDialogExpandEvent);
    /**
     * This class defines a UI dialog close event.
     * @class UIDialogCloseEvent
     * @extends EPEvent
     * @private
     */
    class UIApplicationPrintEvent extends EPEvent {
        static { this.type = 'UIApplicationPrintEvent'; }
        /**
         * @constructor
         */
        constructor() {
            super();
            this.showNotification = true;
        }
        /**
         * Gets the path of the event.
         * @public
         * @returns {string} The path of the event.
         */
        getPath() {
            return this.path;
        }
        /**
         * Gets the severity of the event.
         * @public
         * @returns {ModelEnums.ESeverity} The severity of the event.
         */
        getSeverity() {
            return this.severity;
        }
        /**
         * Gets the content of the event.
         * @public
         * @returns {*} The content of the event.
         */
        getContent() {
            if (this.jsonContent !== undefined) {
                this.content = Tools.jsonParse(this.jsonContent);
                this.jsonContent = undefined;
            }
            return this.content;
        }
        /**
         * Gets the show notification state.
         * @public
         * @returns {boolean} The show notification state.
         */
        getShowNotificationState() {
            return this.showNotification;
        }
    }
    exports.UIApplicationPrintEvent = UIApplicationPrintEvent;
    EventServices.registerEvent(UIApplicationPrintEvent);
    /**
     * This class defines a UI viewer readOnly change event.
     * @private
     * @class UIViewerReadOnlyChangeEvent
     * @extends EPEvent
     */
    class UIViewerReadOnlyChangeEvent extends EPEvent {
        static { this.type = 'UIViewerReadOnlyChangeEvent'; }
        /**
         * @public
         * @constructor
         * @param {boolean} readOnly - True is the viewer is readOnly, false otherwise.
         */
        constructor(readOnly) {
            super();
            this._readOnly = readOnly;
        }
        /**
         * Gets the viewer read only state.
         * @public
         * @returns {boolean} True if the viewer is read only, false otherwise.
         */
        isReadOnly() {
            return this._readOnly;
        }
    }
    exports.UIViewerReadOnlyChangeEvent = UIViewerReadOnlyChangeEvent;
    EventServices.registerEvent(UIViewerReadOnlyChangeEvent);
});
