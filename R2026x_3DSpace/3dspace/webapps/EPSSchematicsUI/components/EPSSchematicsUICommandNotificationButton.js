/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUICommandNotificationButton'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUICommandNotificationButton", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UICommandButton, UIDom) {
    "use strict";
    /**
     * This class defines a UI command notification button.
     * @private
     * @class UICommandNotificationButton
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUICommandNotificationButton
     * @extends UICommandButton
     */
    class UICommandNotificationButton extends UICommandButton {
        static { this.severityClassNameByStrength = ['debug', 'info', 'success', 'warning', 'error']; }
        /**
         * @public
         * @constructor
         * @param {ICommandButtonOptions} options - The command button options.
         * @param {UIDebugConsoleController} controller - The UI debug console controller.
         */
        constructor(options, controller) {
            super(options);
            this._controller = controller;
            UIDom.addClassName(this._buttonElt, 'sch-notification-command-button');
            this._icon = UIDom.createElement('span', { parent: this._buttonElt, className: 'sch-notification-icon' });
            const notificationCount = this._controller.getNotificationCount();
            if (notificationCount) {
                const notificationStrength = this._controller.getNotificationStrength();
                this.displayNotification(notificationCount, notificationStrength);
            }
        }
        /**
         * Removes the command button.
         * @public
         * @override
         */
        remove() {
            this._controller = undefined;
            this._icon = undefined;
            super.remove();
        }
        /**
         * Displays a notification.
         * @public
         * @param {number} count - The notification count.
         * @param {number} strength - The notification strength.
         */
        displayNotification(count, strength) {
            this._icon.textContent = String(count > 9 ? '9+' : count);
            UIDom.removeClassName(this._icon, UICommandNotificationButton.severityClassNameByStrength);
            UIDom.addClassName(this._icon, ['visible', UICommandNotificationButton.severityClassNameByStrength[strength]]);
        }
        /**
         * Clear the notifications icon.
         * @public
         */
        clearNotifications() {
            UIDom.removeClassName(this._icon, 'visible');
        }
    }
    return UICommandNotificationButton;
});
