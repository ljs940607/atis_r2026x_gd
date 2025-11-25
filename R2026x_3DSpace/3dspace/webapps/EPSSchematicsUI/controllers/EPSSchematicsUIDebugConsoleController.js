/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugConsoleController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugConsoleController", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, WUXTreeDocument, UINLSTools, UIEvents, UIFontIcon, UITools, UIEnums, WUXTreeNodeModel, ExecutionEvents, EventServices, ModelEnums) {
    "use strict";
    const severityStrengthMap = new Map([
        [ModelEnums.ESeverity.eDebug, 0],
        [ModelEnums.ESeverity.eInfo, 1],
        [ModelEnums.ESeverity.eSuccess, 2],
        [ModelEnums.ESeverity.eWarning, 3],
        [ModelEnums.ESeverity.eError, 4]
    ]);
    /**
     * This class defines a UI debug console controller.
     * @private
     * @class UIDebugConsoleController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugConsoleController
     */
    class UIDebugConsoleController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
            this._onPrintEventCB = this._onPrintEvent.bind(this);
            this._onApplicationPrintEventCB = this._onApplicationPrintEvent.bind(this);
            this._notificationCount = 0;
            this._notificationStrength = 0;
            this._editor = editor;
            EventServices.addListener(ExecutionEvents.PrintEvent, this._onPrintEventCB);
            EventServices.addListener(UIEvents.UIApplicationPrintEvent, this._onApplicationPrintEventCB);
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
         * Removes the controller.
         * @public
         */
        remove() {
            EventServices.removeListener(ExecutionEvents.PrintEvent, this._onPrintEventCB);
            EventServices.removeListener(UIEvents.UIApplicationPrintEvent, this._onApplicationPrintEventCB);
            this._onPrintEventCB = undefined;
            this._onApplicationPrintEventCB = undefined;
            this.clear();
            this._treeDocument = undefined;
            this._registeredDebugConsole = undefined;
            this._editor = undefined;
            this._notificationCount = undefined;
            this._notificationStrength = undefined;
        }
        /**
         * Gets the tree document containing the event list.
         * @public
         * @returns {WUXTreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Clears the event list of the debug console controller.
         * @public
         */
        clear() {
            this._treeDocument.empty();
        }
        /**
         * Gets the notification count.
         * @public
         * @returns {number} The notification count.
         */
        getNotificationCount() {
            return this._notificationCount;
        }
        /**
         * Gets the notification strength.
         * @public
         * @returns {number} The notification strength.
         */
        getNotificationStrength() {
            return this._notificationStrength;
        }
        /**
         * Displays a message into the debug console.
         * @public
         * @param {EMessageOrigin} origin - The origin of the message.
         * @param {ESeverity} severity - The severity of the message.
         * @param {Date} timestamp - The timestamp of the message.
         * @param {Array<*>|*} contentList - The list of message.
         * @param {boolean} [showNotification=true] - True to show a notification baloon else false.
         */
        displayMessage(origin, severity, timestamp, contentList, showNotification = true) {
            contentList = Array.isArray(contentList) ? contentList : [contentList];
            contentList.forEach(message => this._registerNodeModel(origin, severity, timestamp, message));
            if (this._registeredDebugConsole === undefined && showNotification) {
                this._notificationCount++;
                const strength = severityStrengthMap.get(severity);
                this._notificationStrength = strength && strength > this._notificationStrength ? strength : this._notificationStrength;
                const viewers = this._editor.getViewerController().getRootViewerWithAllViewers();
                viewers.forEach(viewer => viewer.getMainGraph().getToolbar().getDebugConsoleButton().displayNotification(this._notificationCount, this._notificationStrength));
            }
        }
        /**
         * Registers a debug console.
         * @public
         * @param {UIDebugConsolePanel} debugConsole - The debug console to register.
         */
        registerDebugConsole(debugConsole) {
            this._registeredDebugConsole = debugConsole;
        }
        /**
         * Unregisters the debug console.
         * @public
         */
        unregisterDebugConsole() {
            this._registeredDebugConsole = undefined;
        }
        /**
         * Clears the notifications of each debug console toolbar button.
         * @public
         */
        clearToolbarButtonsNotifications() {
            this._notificationCount = 0;
            this._notificationStrength = 0;
            const viewers = this._editor.getViewerController().getRootViewerWithAllViewers();
            viewers.forEach(viewer => viewer.getMainGraph().getToolbar().getDebugConsoleButton().clearNotifications());
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
         * Registers a node model into the tree document for the given message.
         * @private
         * @param {EMessageOrigin} origin - The origin of the message.
         * @param {ESeverity} severity - The message severity level.
         * @param {Date} timestamp - The message timestamp.
         * @param {*} message - The message.
         */
        _registerNodeModel(origin, severity, timestamp, message) {
            const nodeModel = new WUXTreeNodeModel({
                grid: {
                    originIcon: UIFontIcon.getWUXIconFromMessageOrigin(origin),
                    originText: UINLSTools.getOriginShortHelp(origin),
                    message: message,
                    severity: severity,
                    severityText: UINLSTools.getSeverityShortHelp(severity),
                    severityIcon: UIFontIcon.getWUXIconFromSeverity(severity),
                    timestamp: timestamp,
                    fullTime: UITools.getFullTime(timestamp),
                    fullDate: UITools.getFullDate(timestamp)
                }
            });
            this._treeDocument.addRoot(nodeModel);
        }
        /**
         * The callback on the Print event.
         * @private
         * @param {PrintEvent} event - The Print event.
         */
        _onPrintEvent(event) {
            const contentList = event.getContent();
            const severity = event.getSeverity();
            const timestamp = event.getDate();
            this.displayMessage(UIEnums.EMessageOrigin.eUser, severity, timestamp, contentList);
        }
        /**
         * The callback on the Application Print event.
         * @private
         * @param {ApplicationPrintEvent} event - The Application Print event.
         */
        _onApplicationPrintEvent(event) {
            const contentList = event.getContent();
            const severity = event.getSeverity();
            const timestamp = event.getDate();
            const showNotification = event.getShowNotificationState();
            this.displayMessage(UIEnums.EMessageOrigin.eApplication, severity, timestamp, contentList, showNotification);
        }
    }
    return UIDebugConsoleController;
});
