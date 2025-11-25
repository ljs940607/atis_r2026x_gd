/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphDataDrawerDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphDataDrawerDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUITemporaryModelDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPorts", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UITemporaryModelDialog, UIDGVDataPorts, UINLS, ModelEnums, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a UI graph data drawer dialog.
     * @private
     * @class UIGraphDataDrawerDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphDataDrawerDialog
     * @extends UITemporaryModelDialog
     */
    class UIGraphDataDrawerDialog extends UITemporaryModelDialog {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - THe UI graph.
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         */
        constructor(graph, portType) {
            super(graph.getEditor(), graph, {
                className: 'sch-graph-data-drawer-dialog',
                title: UIGraphDataDrawerDialog._getTitle(portType),
                immersiveFrame: graph.getEditor().getImmersiveFrame(),
                width: 700, minWidth: 300, height: 400, minHeight: 200
            });
            this._graph = graph;
            this._portType = portType;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the dialog!
            this._graph = undefined;
            this._portType = undefined;
            this._dgvDataPorts = undefined;
        }
        /**
         * Gets the data grid view data ports.
         * @public
         * @returns {UIDGVDataPorts} The data grid view data ports.
         */
        getDataGridViewDataPort() {
            return this._dgvDataPorts;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            if (this._dgvDataPorts) {
                this._dgvDataPorts.remove();
                this._dgvDataPorts = undefined;
            }
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            const currentViewer = this._editor.getViewerController().getCurrentViewer();
            const isReadOnly = currentViewer.isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            this._dgvDataPorts = new UIDGVDataPorts(this._editor, this._tmpModel, isReadOnly, this._portType);
            this._content.appendChild(this._dgvDataPorts.getElement());
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            super._onOk();
            this._graph.getEditor().getHistoryController().registerEditAction(this._graph);
        }
        /**
         * Gets the dialog title.
         * @private
         * @static
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @returns {string} The dialog title.
         */
        static _getTitle(portType) {
            let title = '';
            if (portType === ModelEnums.EDataPortType.eInput) {
                title = UINLS.get('dialogTitleInputDataPortsEditor');
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                title = UINLS.get('dialogTitleOutputDataPortsEditor');
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                title = UINLS.get('dialogTitleLocalDataPortsEditor');
            }
            return title;
        }
    }
    return UIGraphDataDrawerDialog;
});
