/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIFileDropper'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIFileDropper", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIFileDropper"], function (require, exports, UIDom, UIFontIcon) {
    "use strict";
    /**
     * This class defines a UI file dropper component.
     * @private
     * @class UIFileDropper
     * @alias module:S/EPSSchematicsUI/components/EPSSchematicsUIFileDropper
     */
    class UIFileDropper {
        static { this._kSupportedFileType = 'application/json'; }
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._onDragEnterCB = this._onDragEnter.bind(this);
            this._onDragLeaveCB = this._onDragLeave.bind(this);
            this._onDragOverCB = this._onDragOver.bind(this);
            this._onDropCB = this._onDrop.bind(this);
            this._onDefaultFileDropCB = this._onDefaultFileDrop.bind(this);
            this._editor = editor;
            const domElement = this._editor.getDomElement();
            domElement.addEventListener('dragenter', this._onDragEnterCB);
            domElement.addEventListener('dragleave', this._onDragLeaveCB);
            domElement.addEventListener('dragover', this._onDragOverCB);
            domElement.addEventListener('drop', this._onDropCB);
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
         * Removes the file dropper.
         * @public
         */
        remove() {
            const domElement = this._editor.getDomElement();
            domElement.removeEventListener('dragenter', this._onDragEnterCB);
            domElement.removeEventListener('dragleave', this._onDragLeaveCB);
            domElement.removeEventListener('dragover', this._onDragOverCB);
            domElement.removeEventListener('drop', this._onDropCB);
            this._editor = undefined;
            this._dropZoneElt = undefined;
            this._onDragEnterCB = undefined;
            this._onDragLeaveCB = undefined;
            this._onDragOverCB = undefined;
            this._onDropCB = undefined;
            this._onDefaultFileDropCB = undefined;
            this._fileLoadEndCB = undefined;
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
         * Creates the drop zone element.
         * @private
         */
        _createDropZoneElement() {
            if (this._dropZoneElt === undefined) {
                this._dropZoneElt = UIDom.createElement('div', {
                    className: 'sch-drop-zone',
                    parent: this._editor.getDomElement(),
                    children: [UIFontIcon.create3DSFontIcon('drag-drop')]
                });
            }
        }
        /**
         * Removes the drop zone element.
         * @private
         */
        _removeDropZoneElement() {
            if (this._dropZoneElt !== undefined) {
                this._dropZoneElt.parentNode?.removeChild(this._dropZoneElt);
                this._dropZoneElt = undefined;
            }
        }
        /**
         * The callback to the drag enter event.
         * @private
         * @param {DragEvent} event - The drag enter event.
         */
        _onDragEnter(event) {
            const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
            const items = event.dataTransfer?.items;
            if (items && items.length > 0 && !isReadOnly) {
                const displayDropZone = Array.from(items).every(item => item.kind === 'file' && item.type === UIFileDropper._kSupportedFileType);
                if (displayDropZone) {
                    this._createDropZoneElement();
                }
            }
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * The callback to the drag leave event.
         * @private
         * @param {DragEvent} event - The drag leave event.
         */
        _onDragLeave(event) {
            if (event.relatedTarget !== this._dropZoneElt) {
                this._removeDropZoneElement();
            }
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * The callback to the drag over event.
         * @private
         * @param {DragEvent} event - The drag over event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onDragOver(event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * The callback to the drop event.
         * @private
         * @param {DragEvent} event - The drop event.
         */
        _onDrop(event) {
            const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
            if (!isReadOnly) {
                const files = event.dataTransfer?.files;
                if (files !== undefined && files.length > 0) {
                    const onFileDrop = this._editor.getOptions().onFileDrop;
                    const fileDropCB = (typeof onFileDrop === 'function') ? onFileDrop : this._onDefaultFileDropCB;
                    fileDropCB(event);
                }
                else {
                    const data = event.dataTransfer?.getData('droppedElement');
                    if (data !== undefined && data !== '') {
                        this._editor.injectData(JSON.parse(data), event);
                    }
                }
                this._removeDropZoneElement();
            }
            event.preventDefault();
            event.stopPropagation();
        }
        /**
         * The callback to the default file drop event.
         * @private
         * @param {DragEvent} event - The default file drop event.
         */
        _onDefaultFileDrop(event) {
            const editor = this._editor; // Closure needed as remove is called before file is loaded!
            const files = event.dataTransfer?.files;
            if (files !== undefined && files.length > 0) {
                Array.from(files).forEach(file => {
                    if (file.type === UIFileDropper._kSupportedFileType) {
                        const reader = new FileReader();
                        reader.onload = e => {
                            const result = e.target?.result;
                            if (typeof result === 'string' && result !== '') {
                                editor.setContent(result);
                                if (this._fileLoadEndCB) {
                                    this._fileLoadEndCB();
                                }
                            }
                        };
                        reader.readAsText(file);
                    }
                });
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Sets the file load end callback.
         * @private
         * @ignore
         * @param {function} callback - The function to call once the file is loaded.
         */
        _setFileLoadEndCallback(callback) {
            this._fileLoadEndCB = callback;
        }
        /**
         * Gets the drop zone element.
         * @private
         * @ignore
         * @returns {HTMLDivElement|undefined} The drop zone element.
         */
        _getDropZoneElement() {
            return this._dropZoneElt;
        }
    }
    return UIFileDropper;
});
