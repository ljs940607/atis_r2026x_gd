/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController", ["require", "exports", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsTemplateLibrary", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UITemplateLibrary, TemplateLibrary, WUXTreeDocument, WUXTreeNodeModel, UITools, UIFontIcon, BlockLibrary, UINLS, Events, WebUXGlobalEnums_1) {
    "use strict";
    // TODO: Try to merge the model from UISmartSearch on this tree document?
    /**
     * This class defines a UI block library controller.
     * @private
     * @class UIBlockLibraryController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController
     */
    class UIBlockLibraryController {
        //private _onBlockLibraryRegisterCategoryEventCB: Function = this._onBlockLibraryRegisterCategoryEvent.bind(this);
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
            this._blockListModel = [];
            this._localTemplateBlockListModel = [];
            this._globalTemplateBlockListModel = [];
            this._fullBlockListModel = [];
            this._isInitialized = false;
            this._favoriteIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController', func: '_switchFavorite' };
            this._onGlobalTemplateLibraryRegisterEventCB = this._onGlobalTemplateLibraryRegisterEvent.bind(this);
            this._onLocalTemplateLibraryRegisterEventCB = this._onLocalTemplateLibraryRegisterEvent.bind(this);
            this._onBlockLibraryRegisterBlockEventCB = this._onBlockLibraryRegisterBlockEvent.bind(this);
            this._editor = editor;
            this._favoriteIconCB.argument = { editor: editor };
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
         * Remove the controller.
         * @public
         */
        remove() {
            this.stopBlockLibraryListeners();
            if (this._treeDocument) {
                this._treeDocument.empty();
            }
            this._editor = undefined;
            this._treeDocument = undefined;
            this._blockListModel = undefined;
            this._localTemplateBlockListModel = undefined;
            this._globalTemplateBlockListModel = undefined;
            this._fullBlockListModel = undefined;
            this._isInitialized = undefined;
            this._onGlobalTemplateLibraryRegisterEventCB = undefined;
            this._onLocalTemplateLibraryRegisterEventCB = undefined;
            this._onBlockLibraryRegisterBlockEventCB = undefined;
            //this._onBlockLibraryRegisterCategoryEventCB = undefined;
        }
        /**
         * Gets the tree document.
         * @public
         * @returns {TreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Gets the full block list model for the smart search component.
         * @public
         * @returns {IBlockListModel[]} The fullblock list model.
         */
        getFullBlockListModel() {
            return this._fullBlockListModel;
        }
        /**
         * Initializes the controller.
         * To be called once the documentation is loaded.
         * @public
         */
        initializeController() {
            if (!this._isInitialized) {
                const fullCategoryNames = BlockLibrary.searchCategoryByName(RegExp('.*')).sort();
                fullCategoryNames.forEach(fullCategoryName => {
                    if (fullCategoryName && fullCategoryName !== '') { // Create categories (even if no blocks inside it ie: Core)
                        this._createCategoriesModel(fullCategoryName);
                    }
                    this._createBlocksModel(fullCategoryName);
                });
                //BlockLibrary.addListener(Events.BlockLibraryRegisterCategoryEvent, this._onBlockLibraryRegisterCategoryEventCB);
                //BlockLibrary.addListener(Events.BlockLibraryRegisterBlockEvent, this.onBlockLibraryRegisterCB);
                this._loadFavorites();
                this._isInitialized = true;
            }
        }
        /**
         * Starts the template library listeners.
         * @public
         */
        startBlockLibraryListeners() {
            const localTemplateLibrary = this._editor.getGraphModel().localTemplateLibrary;
            TemplateLibrary.addListener(Events.TemplateLibraryGraphRegisterGlobalEvent, this._onGlobalTemplateLibraryRegisterEventCB);
            TemplateLibrary.addListener(Events.TemplateLibraryScriptRegisterGlobalEvent, this._onGlobalTemplateLibraryRegisterEventCB);
            localTemplateLibrary.addListener(Events.TemplateLibraryGraphRegisterLocalEvent, this._onLocalTemplateLibraryRegisterEventCB);
            localTemplateLibrary.addListener(Events.TemplateLibraryScriptRegisterLocalEvent, this._onLocalTemplateLibraryRegisterEventCB);
            BlockLibrary.addListener(Events.BlockLibraryRegisterBlockEvent, this._onBlockLibraryRegisterBlockEventCB);
        }
        /**
         * Stops the template library listeners.
         * @public
         */
        stopBlockLibraryListeners() {
            const localTemplateLibrary = this._editor.getGraphModel().localTemplateLibrary;
            TemplateLibrary.removeListener(Events.TemplateLibraryGraphRegisterGlobalEvent, this._onGlobalTemplateLibraryRegisterEventCB);
            TemplateLibrary.removeListener(Events.TemplateLibraryScriptRegisterGlobalEvent, this._onGlobalTemplateLibraryRegisterEventCB);
            localTemplateLibrary.removeListener(Events.TemplateLibraryGraphRegisterLocalEvent, this._onLocalTemplateLibraryRegisterEventCB);
            localTemplateLibrary.removeListener(Events.TemplateLibraryScriptRegisterLocalEvent, this._onLocalTemplateLibraryRegisterEventCB);
            BlockLibrary.removeListener(Events.BlockLibraryRegisterBlockEvent, this._onBlockLibraryRegisterBlockEventCB);
            //BlockLibrary.removeListener(Events.BlockLibraryRegisterCategoryEvent, this._onBlockLibraryRegisterCategoryEventCB);
        }
        /**
         * Initializes the full block list model.
         * @private
         */
        initializeFullBlockListModel() {
            this._localTemplateBlockListModel = this._getTemplateLibraryModel(true);
            this._globalTemplateBlockListModel = this._getTemplateLibraryModel(false);
            this._blockListModel = UIBlockLibraryController._buildBlockLibraryModel();
            this._mergeFullBlockListModel();
        }
        /**
         * Matches the search result for blocks or categories.
         * @public
         * @param {Block[]} blocks - The list of blocks to match.
         * @param {boolean} highlightBlock - True to highlight block name else false.
         * @param {boolean} highlightCategory - True to highlight category name else false.
         */
        match(blocks, highlightBlock, highlightCategory) {
            this._treeDocument.prepareUpdate();
            this._treeDocument.collapseAll();
            this._treeDocument.search({
                match: nodeInfos => {
                    const node = nodeInfos.nodeModel;
                    const label = node.getLabel();
                    const blockFound = blocks.find(block => block.getName() === label);
                    if (blockFound) {
                        if (highlightBlock) {
                            node.matchSearch();
                        }
                        if (node.isRoot()) {
                            node.collapse();
                        }
                        else {
                            node.reverseExpand();
                            let parentNode = node;
                            do {
                                if (highlightCategory && parentNode.hasChildren()) {
                                    parentNode.matchSearch();
                                }
                                parentNode = parentNode.getParent();
                                parentNode.show();
                            } while (!parentNode.isRoot());
                            if (highlightCategory) {
                                parentNode.matchSearch();
                            }
                        }
                        node.show();
                    }
                    else {
                        node.unmatchSearch();
                        node.hide();
                    }
                }
            });
            this._treeDocument.pushUpdate();
        }
        /**
         * Unmatches the search result for blocks.
         * @public
         */
        unmatch() {
            this._treeDocument.prepareUpdate();
            this._treeDocument.collapseAll();
            this._treeDocument.search({
                match: nodeInfos => {
                    const node = nodeInfos.nodeModel;
                    node.unmatchSearch();
                    node.show();
                }
            });
            this._treeDocument.pushUpdate();
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
         * Switches favorite state on the selected block.
         * @protected
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _switchFavorite(args) {
            const nodeModel = args.context.nodeModel;
            if (nodeModel) {
                const blockUid = nodeModel.getAttributeValue('value');
                const isFavorite = nodeModel.getAttributeValue('isFavorite');
                const newFavoriteState = !isFavorite;
                nodeModel.setAttribute('isFavorite', newFavoriteState);
                const editor = args.editor;
                const localStorageController = editor.getLocalStorageController();
                const favorites = localStorageController.getBlockLibraryFavorites();
                const index = favorites.indexOf(blockUid);
                let updateLocalStorage = false;
                if (newFavoriteState && index === -1) {
                    favorites.push(blockUid);
                    updateLocalStorage = true;
                }
                else if (!newFavoriteState && index !== -1) {
                    favorites.splice(index, 1);
                    updateLocalStorage = true;
                }
                if (updateLocalStorage) {
                    localStorageController.setBlockLibraryFavorites(favorites);
                }
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
         * The callback on the local template library register event.
         * @private
         * @param {TemplateLibraryGraphRegisterEvent|TemplateLibraryScriptRegisterEvent} event - The template library register event.
         */
        _onLocalTemplateLibraryRegisterEvent(event) {
            const templateUid = event.getUid();
            const graph = this._editor.getViewerController().getRootViewer().getMainGraph();
            const templateName = graph.getLocalTemplateLibrary().getNameByUid(templateUid);
            const templateModel = UIBlockLibraryController._createTemplateBlockListModel(true, templateName, templateUid);
            this._localTemplateBlockListModel.push(templateModel);
            this._localTemplateBlockListModel.sort((a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()));
            this._mergeFullBlockListModel();
        }
        /**
         * The callback on the global template library register event.
         * @private
         * @param {TemplateLibraryGraphRegisterEvent|TemplateLibraryScriptRegisterEvent} event - The template library register event.
         */
        _onGlobalTemplateLibraryRegisterEvent(event) {
            const templateUid = event.getUid();
            const templateName = UITemplateLibrary.getNameByUid(templateUid);
            const templateBlockListModel = UIBlockLibraryController._createTemplateBlockListModel(false, templateName, templateUid);
            this._globalTemplateBlockListModel.push(templateBlockListModel);
            this._globalTemplateBlockListModel.sort((a, b) => a.fullName.localeCompare(b.fullName));
            this._mergeFullBlockListModel();
        }
        /**
         * The callback on the block library register block event.
         * @private
         * @param {BlockLibraryRegisterBlockEvent} event - The block library register block event.
         */
        _onBlockLibraryRegisterBlockEvent(event) {
            const blockUid = event.getUid();
            const block = BlockLibrary.getBlock(blockUid);
            const blockListModel = UIBlockLibraryController._createBlockListModel(block.getName(), blockUid, block.getCategory());
            this._blockListModel.push(blockListModel);
            this._blockListModel.sort((a, b) => a.fullName.localeCompare(b.fullName));
            this._mergeFullBlockListModel();
        }
        /**
         * Merges the template blocks with the block list model.
         * @private
         */
        _mergeFullBlockListModel() {
            this._fullBlockListModel = [];
            Array.prototype.push.apply(this._fullBlockListModel, this._localTemplateBlockListModel);
            Array.prototype.push.apply(this._fullBlockListModel, this._globalTemplateBlockListModel);
            Array.prototype.push.apply(this._fullBlockListModel, this._blockListModel);
        }
        /**
         * Builds the block library model.
         * @private
         * @static
         * @returns {IBlockListModel[]} The block library model.
         */
        static _buildBlockLibraryModel() {
            const model = [];
            const categories = BlockLibrary.searchCategoryByName(RegExp('.*')).sort();
            categories.forEach(categoryName => {
                const blocks = UITools.getSortedBlockByCategory(categoryName);
                blocks.forEach(block => {
                    const blockName = block.getName();
                    const blockUid = block.getUid();
                    model.push(UIBlockLibraryController._createBlockListModel(blockName, blockUid, categoryName));
                });
            });
            return model;
        }
        /**
         * Builds the template library model.
         * @private
         * @param {boolean} isLocalTemplate - True for local template library, false for global template.
         * @returns {IBlockListModel[]} The local or global template library model.
         */
        _getTemplateLibraryModel(isLocalTemplate) {
            const model = [];
            const graph = this._editor.getViewerController().getRootViewer().getMainGraph();
            const templateLibrary = isLocalTemplate ? graph.getLocalTemplateLibrary() : UITemplateLibrary;
            const templateUidList = templateLibrary.getGraphUidList().concat(templateLibrary.getScriptUidList());
            templateUidList.forEach(templateUid => {
                const templateName = templateLibrary.getNameByUid(templateUid);
                model.push(UIBlockLibraryController._createTemplateBlockListModel(isLocalTemplate, templateName, templateUid));
            });
            return model;
        }
        /**
         * Creates a block list model.
         * @private
         * @static
         * @param {string} blockName - The name of the block.
         * @param {string} blockUid - The uid of the block.
         * @param {string} categoryName - The category name of the block.
         * @returns {IBlockListModel} The block list model.
         */
        static _createBlockListModel(blockName, blockUid, categoryName) {
            const categoryDoc = BlockLibrary.getCategoryDocumentation(categoryName);
            const hasDocumentation = categoryDoc !== undefined;
            const fullCategoryName = hasDocumentation ? categoryDoc.getFullName() : categoryName;
            const fullName = fullCategoryName + '/' + blockName;
            const blockListModel = {
                name: blockName,
                uid: blockUid,
                score: 0,
                icon: UIBlockLibraryController._getCategoryIcon(categoryName),
                categoryName: fullCategoryName,
                fullName: fullName.toLowerCase()
            };
            return blockListModel;
        }
        /**
         * Creates a template block list model.
         * @private
         * @static
         * @param {boolean} isLocalTemplate - True for local template library, false for global template.
         * @param {string} templateName - The name of the template.
         * @param {string} templateUid - The uid of the template.
         * @returns {IBlockListModel} The template block list model.
         */
        static _createTemplateBlockListModel(isLocalTemplate, templateName, templateUid) {
            const categoryName = UINLS.get(isLocalTemplate ? 'smartSearchLocalTemplateCategory' : 'smartSearchGlobalTemplateCategory');
            const fullName = categoryName + '/' + templateName;
            const blockListModel = {
                name: templateName,
                uid: templateUid,
                score: 0,
                icon: UIBlockLibraryController._getCategoryIcon(),
                categoryName: categoryName,
                fullName: fullName.toLowerCase()
            };
            return blockListModel;
        }
        /**
         * Gets the category icon.
         * @private
         * @static
         * @param {string} [categoryName] - The name of the category;
         * @returns {WUX.IconDefinition} The WUX category icon.
         */
        static _getCategoryIcon(categoryName) {
            const icon = { iconName: '3d-object', fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS };
            if (categoryName) {
                const categoryDoc = BlockLibrary.getCategoryDocumentation(categoryName);
                const catIcon = categoryDoc?.getIcon();
                if (catIcon) {
                    icon.iconName = catIcon.name;
                    icon.fontIconFamily = UIFontIcon.convertToWUXFontFamily(catIcon.fontFamily);
                }
            }
            return icon;
        }
        // TODO: Hide the category by default and make it visible when a block is added!!!
        // TODO: Check if an options exist in the WUX model to show/hide tree when no child!!!
        /**
         * Creates the categories model.
         * @private
         * @param {string} fullCategoryName - The full category name.
         */
        _createCategoriesModel(fullCategoryName) {
            const categoryNames = fullCategoryName.split('/');
            let parentNodeModel = this._treeDocument;
            let currentCategoryPath = '';
            categoryNames.forEach(categoryName => {
                currentCategoryPath += currentCategoryPath !== '' ? '/' + categoryName : categoryName;
                let categoryNodeModel = UIBlockLibraryController._getCategoryNodeModelFromPath(categoryName, parentNodeModel);
                if (!categoryNodeModel) {
                    let displayName = categoryName;
                    const categoryDoc = BlockLibrary.getCategoryDocumentation(currentCategoryPath);
                    if (categoryDoc) {
                        const name = categoryDoc.getName();
                        displayName = name && name !== '' ? name : displayName;
                    }
                    categoryNodeModel = new WUXTreeNodeModel({
                        label: displayName,
                        icons: [UIFontIcon.getWUXIconFromBlockCategory(currentCategoryPath)],
                        grid: { isBlock: false, value: currentCategoryPath }
                    });
                    parentNodeModel.addChild(categoryNodeModel);
                }
                parentNodeModel = categoryNodeModel;
            });
        }
        /**
         * Creates the blocks model.
         * @private
         * @param {string} fullCategoryName - The full category name.
         */
        _createBlocksModel(fullCategoryName) {
            const parentNodeModel = UIBlockLibraryController._getCategoryNodeModelFromPath(fullCategoryName, this._treeDocument);
            if (parentNodeModel) {
                const blocks = UITools.getSortedBlockByCategory(fullCategoryName);
                blocks.forEach(block => {
                    parentNodeModel.addChild(new WUXTreeNodeModel({
                        label: block.getName(),
                        icons: [{ iconName: '3d-object' }],
                        grid: {
                            isBlock: true,
                            value: block.getUid(),
                            favoriteIcon: this._favoriteIconCB,
                            isFavorite: false
                        }
                    }));
                });
            }
        }
        /**
         * Gets the category node model from the given path.
         * @private
         * @static
         * @param {string} fullCategoryName - The full category name.
         * @param {WUXTreeNodeModel|WUXTreeDocument} relativeNodeModel - The relative node model.
         * @returns {WUXTreeNodeModel|WUXTreeDocument} The category node model.
         */
        static _getCategoryNodeModelFromPath(fullCategoryName, relativeNodeModel) {
            let categoryNodeModel = relativeNodeModel;
            if (fullCategoryName && fullCategoryName !== '') {
                const getCategoryNodeModel = (parent, path) => {
                    return (parent.getChildren() || []).find(cn => cn.getAttributeValue('value') === path);
                };
                const categoryNames = fullCategoryName.split('/');
                let currentCategoryPath = '';
                while (categoryNames.length > 0 && categoryNodeModel) {
                    const categoryName = categoryNames.shift();
                    currentCategoryPath += currentCategoryPath !== '' ? '/' + categoryName : categoryName;
                    categoryNodeModel = getCategoryNodeModel(categoryNodeModel, currentCategoryPath);
                }
            }
            return categoryNodeModel;
        }
        /**
         * Loads the favorites blocks from the local storage to the treeDocument.
         * @private
         */
        _loadFavorites() {
            const localStorageController = this._editor.getLocalStorageController();
            const favorites = localStorageController.getBlockLibraryFavorites();
            this._setFavorites(favorites);
        }
        /**
         * Sets as favorites the provided list of block uids.
         * @private
         * @param {string[]} favorites - The list of block uids.
         */
        _setFavorites(favorites) {
            if (favorites.length > 0) {
                const childNodes = this._treeDocument.getAllDescendants() || [];
                if (childNodes.length > 0) {
                    favorites.forEach(blockUid => {
                        const childNode = childNodes.find(node => node.getAttributeValue('value') === blockUid);
                        if (childNode) {
                            childNode.setAttribute('isFavorite', true);
                        }
                    });
                }
            }
        }
    }
    return UIBlockLibraryController;
});
