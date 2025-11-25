/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer'/>
/// <reference path='../interfaces/EPSSchematicsUIJSONInterfaces.ts'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer", ["require", "exports", "DS/EPSSchematicsUI/viewers/EPSSchematicsUIEGraphViewer", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIClearGraphDialog", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIContextualBarController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUILabelController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIStateMachineController", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", "DS/EPSSchematicsUI/edges/EPSSchematicsUILink", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockSubDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockControlPort", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort", "DS/EPSSchematicsUI/edges/EPSSchematicsUIDataLink", "DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSITools", "css!DS/EPSSchematicsUI/css/viewers/EPSSchematicsUIViewer", "css!DS/egraph/views", "css!DS/EPSSchematicsUI/css/EPSSchematicsUIFont"], function (require, exports, UIEGraphViewer, UIDom, UIGraph, UIClearGraphDialog, UIContextualBarController, UILabelController, UIStateMachineController, UINode, UIPort, UILink, UIBlock, UIComment, UIControlPort, UIDataPort, UIGraphDataPort, UIGraphSubDataPort, UIGraphControlPort, UIBlockDataPort, UIBlockSubDataPort, UIBlockControlPort, UIShortcut, UIShortcutDataPort, UIDataLink, UIControlLink, UITemplateLibrary, UIFileSaver, UIFileLoader, BlockLibrary, ModelEnums, Tools, GraphBlock, CSITools) {
    "use strict";
    /**
     * This class defines the graph viewer.
     * @private
     * @class UIViewer
     * @alias module:DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer
     * @extends UIEGraphViewer
     */
    class UIViewer extends UIEGraphViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         */
        constructor(container, editor) {
            container = UIDom.createElement('div', {
                className: ['epsGraphViewer', 'epsNoSelect'],
                parent: container,
                attributes: { tabindex: 0 }
            });
            super(container, editor);
            this._loading = false;
            this._fileLoader = new UIFileLoader();
            this._fileSaverGraph = new UIFileSaver();
            this._fileSaverTemplates = new UIFileSaver();
            this._onAnimviewpointCB = this._onAnimviewpoint.bind(this);
            // Configure graph viewer display
            this._display.setZoomOpts({ customMgt: true, min: 0.05, max: 10 });
            this._display.views.main.addListener('animviewpoint', this._onAnimviewpointCB); // Handling fixed drawers
            // Initialize controllers
            this._clearGraphDialog = new UIClearGraphDialog(this._editor);
            this._contextualBarController = new UIContextualBarController(this);
            this._labelController = new UILabelController(this);
            this.createStateMachineController();
        }
        /**
         * Removes the viewer.
         * @public
         * @override
         */
        remove() {
            this._display.views.main.removeListener('animviewpoint', this._onAnimviewpointCB);
            this._fileLoader.remove();
            this.removeStateMachineController();
            if (this._mainGraph !== undefined) {
                this._mainGraph.remove();
            }
            if (this._labelController !== undefined) {
                this._labelController.remove();
                this._labelController = undefined;
            }
            this._contextualBarController.remove();
            this._clearGraphDialog.remove();
            this._stateMachineController = undefined;
            this._mainGraph = undefined;
            this._contextualBarController = undefined;
            this._labelController = undefined;
            this._clearGraphDialog = undefined;
            this._editionMode = undefined;
            this._loading = undefined;
            this._onAnimviewpointCB = undefined;
            this._fileSaverGraph = undefined;
            this._fileSaverTemplates = undefined;
            this._fileLoader = undefined;
            super.remove();
        }
        /**
         * Saves the graph into JSON.
         * @public
         * @returns {IJSONGraph} The JSON object representing the graph model and ui.
         */
        save() {
            return this._mainGraph.save();
        }
        /**
         * Loads a JSON string representing a graph into the graph viewer.
         * @public
         * @param {string} jsonGraph - The JSON string representing the graph to load into the viewer.
         * @param {boolean} [isGraphVersion2] - True for graph version 2, false otherwise.
         * @returns {boolean} True if the load is successful, false otherwise.
         */
        load(jsonGraph, isGraphVersion2) {
            let result = false;
            this._labelController.clearAllLabels();
            const jsonObject = JSON.parse(jsonGraph);
            if (jsonObject !== undefined && jsonObject.model !== undefined) {
                this._editor._setGraphVersion2(isGraphVersion2 ?? this._editor.getOptions().isGraphVersion2DefaultValue);
                if (jsonObject.model.graphs !== undefined && jsonObject.ui !== undefined && jsonObject.ui.graphs !== undefined) {
                    UITemplateLibrary.fromJSON(jsonObject);
                }
                else {
                    if (this._mainGraph === undefined) {
                        const graphModel = GraphBlock.createGraph(jsonObject);
                        this.createGraph(graphModel);
                    }
                    this._loading = true;
                    this._mainGraph.load(jsonObject);
                    this.zoomGraphToFitInView(false);
                    this.clearSelection();
                    this._loading = false;
                    this._editor.getTypeLibraryController().updateOccurenceCount();
                }
                result = true;
            }
            else {
                result = false;
                this._editor.displayNotification({ level: 'error', title: 'Invalid JSON graph!' });
            }
            return result;
        }
        /**
         * Saves the current graph into a JSON file.
         * @public
         */
        saveFile() {
            const graph = this.save();
            const graphString = JSON.stringify(graph, undefined, 2);
            this._fileSaverGraph.saveTextFile(graphString, 'SchematicsGraph.json');
            if (UITemplateLibrary.getGraphUidList().length > 0) {
                const jsonTemplates = {};
                UITemplateLibrary.toJSON(jsonTemplates);
                const templatesString = JSON.stringify(jsonTemplates, undefined, 2);
                setTimeout(() => this._fileSaverTemplates.saveTextFile(templatesString, 'SchematicsGlobalTemplates.json'), 100);
            }
        }
        /**
         * Loads a JSON file into the current graph viewer.
         * @public
         */
        loadFile() {
            this._fileLoader.loadFile((_fileName, result) => {
                if (this === this._editor.getViewerController().getRootViewer()) {
                    this._editor.setContent(result);
                }
                else {
                    this.load(result);
                    this._editor.onChange();
                }
            });
        }
        /**
         * Checks if the viewer is loading a JSON.
         * @public
         * @returns {boolean} True if the viewer is loading a JSON else false.
         */
        isLoading() {
            return this._loading;
        }
        /**
         * Loads the default graph.
         * @public
         */
        loadDefaultGraph() {
            this.load(this._editor.getOptions().defaultJSONGraph);
        }
        /**
         * Gets the main graph of the viewer.
         * @public
         * @returns {UIGraph} The main graph of the viewer.
         */
        getMainGraph() {
            return this._mainGraph;
        }
        /**
         * Gets the clear graph dialog.
         * @public
         * @returns {UIClearGraphDialog} The clear graph dialog.
         */
        getClearGraphDialog() {
            return this._clearGraphDialog;
        }
        /**
         * Gets the contextual bar controller.
         * @public
         * @returns {UIContextualBarController} The contextual bar controller.
         */
        getContextualBarController() {
            return this._contextualBarController;
        }
        /**
         * Gets the label controller.
         * @public
         * @returns {UILabelController} The label controller.
         */
        getLabelController() {
            return this._labelController;
        }
        /**
         * Gets the state machine controller.
         * @public
         * @returns {UIStateMachineController|undefined} The state machine controllerr.
         */
        getStateMachineController() {
            return this._stateMachineController;
        }
        /**
         * Gets the file loader.
         * @public
         * @returns {UIFileLoader} The file loader.
         */
        getFileLoader() {
            return this._fileLoader;
        }
        /**
         * Gets the file saver graph.
         * @public
         * @returns {UIFileSaver} The file saver graph.
         */
        getFileSaverGraph() {
            return this._fileSaverGraph;
        }
        /**
         * Gets the file saver templates.
         * @public
         * @returns {UIFileSaver} The file saver templates.
         */
        getFileSaverTemplates() {
            return this._fileSaverTemplates;
        }
        /**
         * Creates a main graph and adds it to the viewer.
         * The main graph will be removed if it already exists.
         * @public
         * @param {GraphBlock} model - The graph model.
         * @param {IJSONGraphUI} [modelUI] - The graph model UI.
         * @returns {UIGraph} The created graph.
         */
        createGraph(model, modelUI) {
            if (this._mainGraph !== undefined) {
                this._mainGraph.remove();
            }
            this._mainGraph = new UIGraph(this, model, modelUI);
            this.zoomGraphToFitInView(true);
            return this._mainGraph;
        }
        /**
         * Clears the graph.
         * @public
         */
        clearGraph() {
            this._clearGraphDialog.open();
        }
        /**
         * Creates the state machine controller.
         * @public
         */
        createStateMachineController() {
            if (this._stateMachineController === undefined) {
                this._stateMachineController = new UIStateMachineController(this);
            }
        }
        /**
         * Removes the state machine controller.
         * @private
         */
        removeStateMachineController() {
            if (this._stateMachineController !== undefined) {
                this._stateMachineController.remove();
                this._stateMachineController = undefined;
            }
        }
        /**
         * Add the provided link to the viewer.
         * @public
         * @param {UIPort} startPort - The UI start port.
         * @param {UIPort} endPort - The UI end port.
         * @param {UILink} link - The UI link.
         */
        addLinkToViewer(startPort, endPort, link) {
            this._display.addEdge(startPort.getDisplay(), endPort.getDisplay(), link.getDisplay());
        }
        /**
         * Removes the provided link from the viewer.
         * @public
         * @param {UILink} link - The UI link to remove.
         */
        removeLinkFromViewer(link) {
            this._display.removeEdge(link.getDisplay());
        }
        /**
         * Centers the view on the provided node.
         * @public
         * @param {UINode|UIGraph} [node] - The node that need to be centered on.
         */
        centerView(node) {
            node = node || this._mainGraph;
            const viewWidth = this.getWidth();
            const viewHeight = this.getHeight();
            const scale = this.getViewpoint().scale;
            const nodeWidth = node.getDisplay().actualWidth * scale;
            const nodeHeight = node.getDisplay().actualHeight * scale;
            const nodeLeft = node.getDisplay().actualLeft * scale;
            const nodeTop = node.getDisplay().actualTop * scale;
            const x = Math.round((viewWidth / 2) - (nodeWidth / 2) - nodeLeft);
            const y = Math.round((viewHeight / 2) - (nodeHeight / 2) - nodeTop);
            this.setViewpoint({ translationX: x, translationY: y, scale: scale });
        }
        /**
         * Zooms the graph so it can be fit in the viewer.
         * TODO: Detect viewer size change and trigger zoomGraphToFitInView!
         * @public
         * @param {boolean} [keepScaleOne=false] - True to only zoom the graph if it does not fit in the view.
         */
        zoomGraphToFitInView(keepScaleOne = false) {
            const viewWidth = this.getWidth();
            const viewHeight = this.getHeight();
            if (viewWidth > 0 && viewHeight > 0) {
                const vpt = this.getViewpoint();
                // Get graph control ports width
                let controlPortMaxWidth = (this._mainGraph.getControlPortsMaxWidth() / vpt.scale) - 20; // UIGraphControlPortView.kPortLeftOffset = 20;
                controlPortMaxWidth = controlPortMaxWidth < 20 ? 20 : controlPortMaxWidth;
                const margin = 40;
                const drawerHeight = 20;
                const graphWidth = this._mainGraph.getWidth();
                const graphHeight = this._mainGraph.getHeight();
                const fullWidth = graphWidth + (controlPortMaxWidth * 2) + (margin * 2);
                const fullHeight = graphHeight + (drawerHeight * 2) + (margin * 2);
                const scaleWidth = viewWidth / fullWidth;
                const scaleHeight = viewHeight / fullHeight;
                const scale = keepScaleOne ? 1 : (scaleWidth < scaleHeight ? scaleWidth : scaleHeight);
                this.setViewpoint({ translationX: vpt.translationX, translationY: vpt.translationY, scale: scale });
                this.centerView();
            }
        }
        /**
         * Zooms the graph so that one pixel of the graph
         * corresponds to one pixel of the screen.
         * @public
         */
        zoomOneToOne() {
            const vpt = this.getViewpoint();
            vpt.scale = 1;
            this.setViewpoint(vpt);
            this.centerView(this._mainGraph);
        }
        /**
         * Switches the graph contrast.
         * @public
         */
        switchGraphContrast() {
            const emptyFilter = '';
            const contrastFilter = 'brightness(70%) contrast(150%)';
            const blackFilter = 'hue-rotate(190deg) invert(80%)';
            const currentFilter = this._container.style.filter;
            let filter = emptyFilter;
            if (currentFilter === emptyFilter) {
                filter = contrastFilter;
            }
            else if (currentFilter === contrastFilter) {
                filter = blackFilter;
            }
            this._container.style.filter = filter;
        }
        /**
         * Sets the edition mode state of the graph.
         * @public
         * @param {boolean} state - True/false to enable/disable the edition mode.
         */
        setEditionMode(state) {
            if (state === true) {
                if (this._editionMode === undefined) {
                    this._editionMode = UIDom.createElement('div', {
                        className: ['epsEditionMode', 'epsNoSelect'],
                        parent: this._container
                    });
                }
            }
            else if (state === false && this._editionMode !== undefined) {
                this._container.removeChild(this._editionMode);
                this._editionMode = undefined;
            }
        }
        /**
         * Gets the edition mode state of the graph.
         * @public
         * @returns {boolean} True if the edition mode is enabled else false.
         */
        getEditionMode() {
            return this._editionMode !== undefined && this._editionMode !== null;
        }
        /**
         * Toggles the breakpoint on the selected blocks.
         * @public
         */
        toggleBreakpointOnSelectedBlocks() {
            const breakpointController = this.getEditor().getBreakpointController();
            const blocks = this.getSelectedBlocks();
            let breakpointCount = 0;
            blocks.forEach(block => { breakpointCount += breakpointController.hasBreakpoint(block) ? 1 : -1; });
            if (Math.abs(breakpointCount) === blocks.length) {
                blocks.forEach(block => block.toggleBreakpoint());
            }
        }
        /**
         * Creates a shortcut for each selected data ports.
         * @public
         */
        createShortcutFromSelection() {
            const graph = this.getMainGraph();
            const blockDataPorts = this.getSelectedBlockDataPorts();
            const graphDataPorts = this.getSelectedGraphDataPorts();
            const dataPorts = blockDataPorts.concat(graphDataPorts);
            const vpt = this.getViewpoint();
            dataPorts.forEach(dataPort => {
                const portType = dataPort.getModel().getType();
                const dataPortBB = dataPort.getBoundingBox(vpt);
                const coord = this.clientToViewpoint(dataPortBB.left + dataPortBB.width, dataPortBB.top + dataPortBB.height);
                const left = coord[0];
                const top = portType === ModelEnums.EDataPortType.eOutput ? coord[1] : coord[1] - dataPortBB.height;
                graph.createShortcut(dataPort, left, top);
            });
        }
        /**
         * Clears the selection.
         * @public
         */
        clearSelection() {
            this._display.clearSelection();
            this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
        }
        /**
         * Updates the selection with the provided graph selectable elements.
         * @public
         * @param {EGraphCore.Selectable[]} elements - The selectable graph elements.
         * @param {EGraphCore.SelectionMode} [mode=EGraphCore.SelectionMode#REPLACE] - The update mode.
         */
        updateSelection(elements, mode) {
            const filteredElements = this._filterSelection(elements);
            this._display.updateSelection(filteredElements, mode);
            this._contextualBarController.registerSelection(this.getSelection());
            this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
        }
        /**
         * Checks if the element is in the selection.
         * @public
         * @param {EGraphCore.Selectable} element - The selectable graph element.
         * @returns {boolean} True if the element is selected, else false.
         */
        isSelected(element) {
            return this._display.isSelected(element);
        }
        /**
         * Checks if the provided element is selectable.
         * Only blocks, ports and links need to be selectable.
         * @public
         * @param {EGraphCore.Selectable} element - The selectable graph element.
         * @returns {boolean} True if the element is selectable else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isElementSelectable(element) {
            let result = false;
            if (element !== undefined && element.data !== undefined && element.data.uiElement !== undefined) {
                const uiElt = element.data.uiElement;
                if ((uiElt instanceof UINode && uiElt.isSelectable()) || uiElt instanceof UIPort || uiElt instanceof UILink) {
                    result = true;
                }
            }
            return result;
        }
        /**
         * Adds the element to the selection.
         * @public
         * @param {EGraphCore.Selectable} element - The selectable graph element.
         */
        addToSelection(element) {
            if (this.isElementSelectable(element)) {
                this._display.addToSelection(element);
                this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
            }
        }
        /**
         * Removes the element from the selection.
         * @public
         * @param {EGraphCore.Selectable} element - The selectable graph element.
         */
        removeFromSelection(element) {
            this._display.removeFromSelection(element);
            this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
        }
        /**
         * Replaces the selection with the provided graph selectable element
         * if not already selected and brings it to the front if possible.
         * @public
         * @param {EGraphCore.Selectable} element - The selectable graph element.
         */
        replaceSelection(element) {
            if (element !== undefined && element !== null && !this._display.isSelected(element)) {
                this._display.updateLock();
                try {
                    this._display.replaceSelectionWith(element);
                    if (element.bringToFront !== undefined) {
                        element.bringToFront();
                    }
                }
                finally {
                    this._display.updateUnlock();
                    this.takeFocus();
                }
            }
            this._contextualBarController.registerSelection(this.getSelection());
            this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
        }
        /**
         * Gets the selected elements in this viewer.
         * @public
         * @returns {(UINode|UIPort|UILink)[]} The selected nodes, ports and links.
         */
        getSelection() {
            let selection = [];
            const blocks = this.getSelectedBlocks();
            const blockControlPorts = this.getSelectedBlockControlPorts();
            const blockDataPorts = this.getSelectedBlockDataPorts();
            const graphDataPorts = this.getSelectedGraphDataPorts();
            const graphControlPorts = this.getSelectedGraphControlPorts();
            const dataLinks = this.getSelectedDataLinks();
            const controlLinks = this.getSelectedControlLinks();
            const comments = this.getSelectedComments();
            selection = selection.concat(blocks, blockControlPorts, blockDataPorts, graphDataPorts, graphControlPorts, dataLinks, controlLinks, comments);
            return selection;
        }
        /**
         * Gets the list of selected graph and block data ports.
         * @public
         * @returns {UIDataPort[]} The list of selected graph and block data ports.
         */
        getSelectedDataPorts() {
            const graphDataPorts = this.getSelectedGraphDataPorts();
            const blockDataPorts = this.getSelectedBlockDataPorts();
            return graphDataPorts.concat(blockDataPorts);
        }
        /**
         * Gets the list of selected blocks model in this viewer.
         * @public
         * @returns {Block[]} The list of selected blocks model.
         */
        getSelectedBlocksModel() {
            return this.getSelectedBlocks().map(block => block.getModel());
        }
        /**
         * Gets the list of selected blocks in this viewer
         * @public
         * @returns {UIBlock[]} The list of selected blocks.
         */
        getSelectedBlocks() {
            return this._parseSelectedElements([UIBlock]);
        }
        /**
         * Gets the list of selected comments in this viewer.
         * @public
         * @returns {UIComment[]} The list of selected comments.
         */
        getSelectedComments() {
            return this._parseSelectedElements([UIComment]);
        }
        /**
         * Gets the list of selected shortcuts in this viewer.
         * @public
         * @returns {UIShortcut[]} The list of selected shortcuts.
         */
        getSelectedShortcuts() {
            return this._parseSelectedElements([UIShortcut]);
        }
        /**
         * Gets the list of selected graph control ports in this viewer.
         * @public
         * @returns {UIGraphControlPort[]} The list of selected graph control ports.
         */
        getSelectedGraphControlPorts() {
            return this._parseSelectedElements([UIGraphControlPort]);
        }
        /**
         * Gets the list of selected block control ports in this viewer.
         * @public
         * @returns {UIBlockControlPort[]} The list of selected block control ports.
         */
        getSelectedBlockControlPorts() {
            return this._parseSelectedElements([UIBlockControlPort]);
        }
        /**
         * Gets the list of selected graph data ports in this viewer.
         * @public
         * @returns {UIDataPort[]} The list of selected graph data ports.
         */
        getSelectedGraphDataPorts() {
            return this._parseSelectedElements([UIGraphDataPort, UIGraphSubDataPort]);
        }
        /**
         * Gets the list of selected block data ports in this viewer.
         * @public
         * @returns {UIDataPort[]} The list of selected block data ports.
         */
        getSelectedBlockDataPorts() {
            return this._parseSelectedElements([UIBlockDataPort, UIBlockSubDataPort]);
        }
        /**
         * Gets the list of selected data links in this viewer.
         * @public
         * @returns {UIDataLink[]} The list of selected data links.
         */
        getSelectedDataLinks() {
            return this._parseSelectedElements([UIDataLink]);
        }
        /**
         * Gets the list of selected control links in this viewer.
         * @public
         * @returns {UIControlLink[]} The list of selected control links.
         */
        getSelectedControlLinks() {
            return this._parseSelectedElements([UIControlLink]);
        }
        /**
         * Checks if the selection of blocks is consistent.
         * @public
         * @returns {boolean} True if the selection of blocks is consistent else false.
         */
        areSelectedBlocksConsistent() {
            const blocks = this.getSelectedBlocksModel();
            return Tools.areSelectedBlocksConsistent(blocks);
        }
        /**
         * Creates a graph from the selected blocks.
         * @public
         */
        createGraphFromSelection() {
            const hasGraphBlock = BlockLibrary.hasBlock(GraphBlock.prototype.uid);
            if (hasGraphBlock) {
                const blocks = this.getSelectedBlocksModel();
                if (Tools.areSelectedBlocksConsistent(blocks)) {
                    Tools.createGraphBlockFromBlocks(blocks);
                }
            }
        }
        /**
         * Creates a CSI graph from the selected blocks.
         * @public
         */
        createCSIGraphFromSelection() {
            const blocks = this.getSelectedBlocksModel();
            if (Tools.areSelectedBlocksConsistent(blocks)) {
                CSITools.createCSIGraphBlockFromBlocks(blocks);
            }
        }
        /**
         * Moves the selected blocks and graph ports in the graph in the desired direction.
         * @public
         * @param {boolean} moveLeft - True to move to the left else false.
         * @param {boolean} moveUp - True to move to the up else false.
         * @param {boolean} moveRight - True to move to the right else false.
         * @param {boolean} moveDown - True to move to the down else false.
         */
        moveSelection(moveLeft, moveUp, moveRight, moveDown) {
            const kGap = 10;
            this._labelController.clearAllLabels();
            this._display.updateLock();
            try {
                // Move selected blocks and shortcuts
                const blocks = this.getSelectedBlocks();
                const shortcuts = this.getSelectedShortcuts();
                const nodes = [].concat(blocks, shortcuts);
                nodes.forEach(node => {
                    const pos = node.getPosition();
                    pos.left -= moveLeft ? kGap : 0;
                    pos.left += moveRight ? kGap : 0;
                    pos.top -= moveUp ? kGap : 0;
                    pos.top += moveDown ? kGap : 0;
                    node.setPosition(pos.left, pos.top);
                });
                // Move selected graph ports
                let ports = [];
                if (moveUp || moveDown) {
                    ports = this.getSelectedGraphControlPorts();
                    ports.forEach(port => port.setOffset(port.getOffset() + (moveUp ? -kGap : kGap)));
                }
                // Store the move action in the history
                const elements = [].concat(nodes, ports);
                const historyController = this.getEditor().getHistoryController();
                historyController.registerMoveAction(elements);
            }
            finally {
                this._display.updateUnlock();
                const graph = this.getMainGraph();
                graph.updateSizeFromBlocks();
            }
        }
        /**
         * Deletes the selected elements of the main graph.
         * @public
         */
        deleteSelection() {
            if (!this._readOnly) {
                this._labelController.clearAllLabels();
                const blocks = [];
                const comments = [];
                const links = [];
                const shortcuts = [];
                const dataPorts = [];
                const controlPorts = [];
                for (let elt = this._display.selection.first; elt; elt = elt.nextSel) {
                    const uiElement = elt.data.uiElement;
                    if (elt.type === 1 /* EGraphCore.Type.NODE */ && uiElement !== undefined) {
                        if (uiElement instanceof UIBlock) {
                            blocks.push(uiElement);
                        }
                        else if (uiElement instanceof UIShortcut) {
                            shortcuts.push(uiElement);
                        }
                        else if (uiElement instanceof UIComment) {
                            comments.push(uiElement);
                        }
                    }
                    else if (elt.type === 4 /* EGraphCore.Type.EDGE */) {
                        links.push(uiElement);
                    }
                    else if (elt.type === 3 /* EGraphCore.Type.CONNECTOR */) {
                        if (uiElement instanceof UIShortcutDataPort) {
                            const shortcut = uiElement.getParent();
                            if (shortcuts.indexOf(shortcut) === -1) {
                                shortcuts.push(shortcut);
                            }
                        }
                        else if (uiElement instanceof UIControlPort) {
                            controlPorts.push(uiElement);
                        }
                        else if (uiElement instanceof UIDataPort) {
                            dataPorts.push(uiElement);
                        }
                    }
                }
                if (blocks.length || links.length || controlPorts.length || dataPorts.length || shortcuts.length || comments.length) {
                    this._display.updateLock();
                    try {
                        const graph = this.getMainGraph();
                        graph.removeLinks(links);
                        graph.removeBlocks(blocks);
                        graph.removeControlPorts(controlPorts);
                        graph.removeDataPorts(dataPorts);
                        graph.removeShortcuts(shortcuts);
                        graph.removeComments(comments);
                    }
                    finally {
                        this._display.updateUnlock();
                    }
                    const elements = [].concat(blocks, controlPorts, links, shortcuts, dataPorts, comments);
                    this._editor.getHistoryController().registerRemoveAction(elements);
                    this._editor.getTypeLibraryController().updateApplyButtonDisabledState();
                }
            }
        }
        /**
         * Takes the focus.
         * @public
         */
        takeFocus() {
            this._container.focus();
        }
        /**
         * Creates the smart search.
         * @public
         * @param {number} mouseLeft - The left position of the mouse.
         * @param {number} mouseTop - The top position of the mouse.
         * @param {number} blockLeft - The left position of the block.
         * @param {number} blockTop - The top position of the block.
         */
        createSmartSearch(mouseLeft, mouseTop, blockLeft, blockTop) {
            const viewerRect = this.getClientRect();
            const left = mouseLeft - viewerRect.left;
            const top = mouseTop - viewerRect.top;
            this._mainGraph.createSmartSearch(left, top, blockLeft, blockTop);
        }
        /**
         * Parses the selected elements according to the provided list of constructors.
         * @private
         * @param {Function[]} constructors - The list of constructors.
         * @returns {UINode[]|UIPort[]|UILink[]} The list of selected elements.
         */
        _parseSelectedElements(constructors) {
            let elements = [];
            for (let elt = this._display.selection.first; elt; elt = elt.nextSel) {
                if (constructors.some(constructor => elt.data.uiElement instanceof constructor)) {
                    elements.push(elt.data.uiElement);
                }
            }
            return elements;
        }
        /**
         * Filters the provided selectable elements to only blocks, ports and links.
         * @private
         * @param {EGraphCore.Selectable[]} elements - The selectable graph elements.
         * @returns {EGraphCore.Selectable[]} The filtered list of selectable blocks, ports or links elements.
         */
        _filterSelection(elements) {
            const filteredElts = [];
            elements.forEach(element => {
                if (this.isElementSelectable(element)) {
                    filteredElts.push(element);
                }
            });
            return filteredElts;
        }
        /**
         * The callback on the animation viewpoint event.
         * @private
         * @param {EGraphViews.AnimViewpointEvent} event - The animation viewpoint event.
         */
        _onAnimviewpoint(event) {
            if (this._mainGraph !== undefined) {
                const vpt = {
                    translationX: event.vpt[0],
                    translationY: event.vpt[1],
                    scale: event.vpt[2]
                };
                this._mainGraph.getToolbar().updatePosition(vpt);
                this._labelController.updateLabels(vpt);
            }
        }
    }
    return UIViewer;
});
