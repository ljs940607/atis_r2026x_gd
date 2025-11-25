/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/Windows/DockingElementForImmersiveFrame", "DS/CoreBase/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUISplittedPanel"], function (require, exports, UIPanel, UIDom, UITools, DockingElementForImmersiveFrame, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a UI splitted panel.
     * @private
     * @abstract
     * @class UISplittedPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel
     * @extends UIPanel
     */
    class UISplittedPanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {IPanelOptions} options - The panel options.
         */
        constructor(editor, options) {
            super(editor, UITools.mergeObjectConcatArray({ className: ['sch-splitted-panel'] }, options));
            this._editor = editor;
        }
        /**
         * Removes the panel.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
        }
        /**
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            this._topDockingElement = undefined;
            this._panelTopContainer = undefined;
            this._panelBottomContainer = undefined;
            super._onClose();
        }
        /**
         * Creates the docking element.
         * @private
         */
        _createDockingElement() {
            const size = (this._editor.getDomElement().clientHeight / 2) - (23 + 6);
            this._panelTopContainer = UIDom.createElement('div', { className: 'sch-panel-topcontainer' });
            this._panelBottomContainer = UIDom.createElement('div', { className: 'sch-panel-bottomcontainer' });
            this._topDockingElement = new DockingElementForImmersiveFrame({
                side: WebUXGlobalEnums_1.WUXDockAreaEnum.TopDockArea,
                dockingZoneContent: this._panelTopContainer,
                freeZoneContent: this._panelBottomContainer,
                collapsibleFlag: false,
                dockingZoneSize: size,
                useBordersFlag: false
            });
            this._topDockingElement.inject(this.getContent());
        }
    }
    return UISplittedPanel;
});
