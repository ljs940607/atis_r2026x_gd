/**
 * 
 */
define('DS/ENXHistoryUX/View/Menu/HistoryOpenWithMenu',
		[
			'UWA/Core',
			'UWA/Class',
			'DS/i3DXCompassPlatformServices/OpenWith',
			'UWA/Class/Promise'
			], function(UWA, Class, OpenWith, Promise) {
	'use strict';

	let getContentForCompassInteraction = function(data){
		let itemsData = [];
		let item = {
				'envId': widget.getValue('x3dPlatformId'),
				'serviceId': "3DSpace",
				'contextId': "",
				'objectId': data.Id,
				'objectType': data.Type,
				'displayName': data.Title,
				'displayType': data.Type,
				'facetName' : 'realized',
				"path": [{
					"resourceid": data.Id,
					"type": data.Type
				}],
				"objectTaxonomies":data.objTaxonomies 
		};
		itemsData.push(item);

		let compassData = {
				protocol: "3DXContent",
				version: "1.1",
				source: widget.getValue("appId"),
				widgetId: widget.id,
				data: {
					items: itemsData
				}
		};
		return compassData;
	};

	let getOpenWithMenu = function(data) {
		let content = getContentForCompassInteraction(data);
		let openWith = new OpenWith();
		openWith.set3DXContent(content); 
		let apps = [];
		if (UWA.is(openWith.retrieveCompatibleApps, 'function')) {
			return new Promise(function(resolve, reject) {
				openWith.retrieveCompatibleApps(function(appsList) {
					appsList.forEach(function(app) {
						apps.push(getSubmenuOptions(app, null));
					});
					resolve(apps);
				},function(){
					reject(new Error("Error while getting Open with menus"));
				});
			});
		}
	};

	let getSubmenuOptions = function(app, model) {
		return {
			id: app.text,
			title: app.text,
			icon: app.icon,
			type: 'PushItem',
			multisel: false,
			action: {
				context: model,
				callback: app.handler
			}
		};
	};

	return {
			getOpenWithMenu
	};

});




define('DS/ENXHistoryUX/View/Properties/HistoryObjectProperties', [
    // 'DS/EditPropWidget/EditPropWidget',
    // 'DS/EditPropWidget/constants/EditPropConstants',
    // 'DS/EditPropWidget/models/EditPropModel',
    // 'css!DS/ENXHistoryUX/ENXHistoryUX.css'
], function (
    // EditPropWidget,
    // EditPropConstants,
    // EditPropModel
) {
    // const HistoryObjectProperties = {
    //     render: function (propContainer, data) {
    //         let that = this;

    //         const facets = [EditPropConstants.FACET_PROPERTIES];
    //         that.parentContainer = this.container;
    //         let collabSpace;
    //         if (widget.HistoryCredentials.securityContext) {
    //             collabSpace = widget.HistoryCredentials.securityContext;
    //         } else if (widget.getPreference("collabspace")) {
    //             collabSpace = widget.getPreference("collabspace").value;
    //         } 
    //         let options_panel = {
    //             typeOfDisplay: EditPropConstants.ALL, // ONLY_EDIT_PROPERTIES for only properties
    //             selectionType: EditPropConstants.NO_SELECTION, // The edit properties panel will not listen the selection
    //             'facets': facets,
    //             'editMode': false,
    //             'context': { getSecurityContext: function () { return { SecurityContext: collabSpace } } },
    //             'extraNotif': true,
    //             'readOnly': true,
    //             'events': {
    //                 'onNotification': function (infoObj) {
    //                     widget.HistoryNotify.handler().addNotif({
    //                         level: infoObj.eventID,
    //                         subtitle: infoObj.msg,
    //                         sticky: true
    //                     });
    //                 }
    //             }
    //         };

    //         this.EditPropWidget = new EditPropWidget(options_panel);

    //         if (data.id) {
    //             that.loadModel(data.id, propContainer);
    //         }


    //         return this;
    //     },

    //     getPropModel: function (objModel) {
    //         let resultElementSelected = [];
    //         let selection = new EditPropModel({
    //             metatype: 'businessobject',
    //             objectId: objModel.objectId,
    //             source: "3DSpace",
    //             tenant: widget.getValue("x3dPlatformId")
    //         });
    //         selection.set('isTransient', false);

    //         resultElementSelected.push(selection);
    //         return resultElementSelected;
    //     },

    //     loadModel: function (objId, propContainer) {
    //         let that = this, results = that.getPropModel({ objectId: objId });
    //         that.EditPropWidget.initDatas(results);

    //         this.EditPropWidget.elements.container.inject(propContainer);
    //     }
    // };

    // return HistoryObjectProperties;
    return {}
});


define('DS/ENXHistoryUX/View/Dialog/HistoryPropertiesDialog', [
    'DS/Windows/Dialog',
    'DS/Windows/ImmersiveFrame',
    'DS/Controls/Button',
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS',
],
    function (
        WUXDialog,
        WUXImmersiveFrame,
        WUXButton,
        NLS) {
        'use strict';

        const getDialog = title => {

            let _immersiveFrame = new WUXImmersiveFrame();
            _immersiveFrame.inject(document.body);
            const propertiesDialogContainer = new UWA.Element('div', { id: "HistoryPropertiesDialogContainer" });
            //const dialogTitle = typeof title == 'string' && title.length > 0 ? (title + NLS.properties) : NLS.HistoryObjectProperties
            const _dialog = new WUXDialog({
                title: "",//dialogTitle,
                modalFlag: true,
                width: 600,
                height: 500,
                content: propertiesDialogContainer,
                immersiveFrame: _immersiveFrame,
                resizableFlag: true,
            });

            _dialog.addEventListener("close", function (e) {
                if (_immersiveFrame != undefined)
                    _immersiveFrame.destroy();
            });


            return {
                container: propertiesDialogContainer
            }
        };

        return { getDialog }

    });

define('DS/ENXHistoryUX/Utilities/PlaceHolder',
    [
        'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
    ],
    function (
        NLS
    ) {
        'use strict';

        let showEmptyHistoryPlaceholder = function (container, model) {

            let existingPlaceholder = container.getElement('.no-history-to-show-container');

            container.querySelector(".historydetails-tile-view-container") && container.querySelector(".historydetails-tile-view-container").setStyle('display', 'none');
            container.querySelector(".historydetails-data-grid-container") && container.querySelector(".historydetails-data-grid-container").setStyle('display', 'none');
            // The place holder is already hidden, we do nothing
            if (existingPlaceholder !== null) {
                // widget.historyEvent.publish('history-back-to-summary');
                // widget.historyEvent.publish('history-widgetTitle-count-update', { model: model });
                return existingPlaceholder;
            }

            let placeholder = UWA.createElement('div', {
                'class': 'no-history-to-show-container',
                html: [UWA.createElement('div', {
                    'class': 'no-history-to-show',
                    html: [UWA.createElement('div', {
                        'class': 'pin',
                        html: '<span class="fonticon fonticon-5x fonticon-history"></span>'
                    }), UWA.createElement('span', {
                        'class': 'no-history-to-show-label',
                        html: NLS.titles.placeholder.title
                    })]
                })]
            });

            container.appendChild(placeholder);
            
        };

        /**
         * Hides the special placeholder if you have issues to display.
         * @param {Node} container - The container of the application.
         */
        let hideEmptyHistoryPlaceholder = function (container) {

            let placeholder = container.getElement('.no-history-to-show-container');

            // The place holder is already hidden, we do nothing
            if (placeholder === null) {
                return;
            }

            container.querySelector(".historydetails-tile-view-container") && container.querySelector(".historydetails-tile-view-container").removeAttribute('style');
            container.querySelector(".historydetails-data-grid-container") && container.querySelector(".historydetails-data-grid-container").removeAttribute('style');
            // No more div
            placeholder.destroy();
            //container.querySelector(".no-history-to-show-container").setStyle('display', 'none');

        };

        /**
         * Hides the special placeholder if you have issues to display.
         * @param {Node} container - The container of the application.
         */
        /**
         * Hides the special placeholder if you have issues to display.
         * @param {Node} container - The container of the application.
         */


        let registerListeners = function () {
            widget.historyEvent.subscribe('show-no-history-placeholder', function (data) {
                showEmptyHistoryPlaceholder(document.querySelector(".widget-container"));
            });

            widget.historyEvent.subscribe('hide-no-history-placeholder', function (data) {
                hideEmptyHistoryPlaceholder(document.querySelector(".widget-container"));
            });


        };

        return {
            hideEmptyHistoryPlaceholder,
            showEmptyHistoryPlaceholder,
            registerListeners
        }
    });


/* global define, widget */
/**
  * @overview History - Other History utilities
  * @licence Copyright 2006-2021 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENXHistoryUX/Utilities/Utils',
['DS/Controls/ModalLoader', 'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'],
function(ModalLoader, NLS) {
    'use strict';
    
    const delim = '|~|'
    var Utils = {};

    Utils.getCookie = function (name) {
    	  var value = "; " + document.cookie;
    	  var parts = value.split("; " + name + "=");
    	  if (parts.length >= 2) return parts.pop().split(";").shift();
    };
    
    Utils.encodeHTMLEntites = function _encodeHTMLEntites(input) {
	        return input.toString().replace(/&amp;/g, '&')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&quot;/g, '"')
	        .replace(/&#x27;/g, '\'')
	        .replace(/&#x2F;/g, '/');
	};
	Utils.decodeHTMLEntites = function _decodeHTMLEntites(input) {
	        return input.toString().replace(/&/g, '&amp;')
	        .replace(/</g, '&lt;')
	        .replace(/>/g, '&gt;')
	        .replace(/"/g, '&quot;')
	        .replace(/'/g, '&#x27;')
	        .replace(/\//g, '&#x2F;');
    };
    /*Utils.initHelpSystem = function _initHelpSystem(helpURL, label) {
        require(['DS/TopBarProxy/TopBarProxy'], function initProxyMenu(TopBarProxy) {
            if (TopBarProxy[widget.id]) {
                return;
            }
            TopBarProxy[widget.id] = new TopBarProxy({
                'id': widget.id
            });
            var initOnce = true,
                lang,
                url;
            var callback = function _initHelpCallback() {
                if (initOnce) {
                	var lang = Utils.getCookie("swymlang") || 'English';
                    initOnce = false;
                    url = 'http://help.3ds.com/HelpDS.aspx?P=11&L='+lang+'&F='+helpURL+'&contextscope=onpremise';
                }

                if (url) {
                    window.open(url, '_blank');
                } else {
                    alert('The help system is not available. Please contact your system administrator.');
                }
            };
            TopBarProxy[widget.id].setContent({
                help: [{
                    'label': label,
                    'onExecute': callback
                }]
            });
        });
    };*/
    
    Utils.strLength = function (str) {
    	var strArr = str.split("");
    	var len = 0;
    	for(var i = 0; i< strArr.length ; i++){
    		var strChar = strArr[i];
    		var encodeChar = encodeURIComponent(strChar);
    		if(encodeChar.length == 1){//single byte char
    			len++;
    		}else{//multi byte char
    			len = len + (encodeChar.split("%").length - 1); 
    		}
    	}
    	//alert(len);
    	return len;
    }

	Utils.getHistoryAvatarDetails = function (name) {
		if(!name) return {};		
        var options = {};
        var backgroundColors = [
          [7, 139, 250],
          [249, 87, 83],
          [111, 188, 75],
          [158, 132, 106],
          [170, 75, 178],
          [26, 153, 123],
          [245, 100, 163],
          [255, 138, 46],
        ]
        //var initials = name.match(/\b\w/g);
		var temp = name.replace(/  +/g, ' ');
        var initials = temp.trim().split(" ");

		if (!Array.isArray(initials) || initials.length == 0 || initials[0] == "") return {};
        var firstWord = initials[0].toUpperCase();
        var lastWord = initials[initials.length - 1].toUpperCase();

        var avatarStr = (firstWord[0] + lastWord[0]);

        var i = Math.ceil((firstWord.charCodeAt(0) + lastWord.charCodeAt(0)) % backgroundColors.length);
        var avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";

        options.name = name;
        options.avatarStr = avatarStr;
        options.avatarColor = avatarColor;

        return options;
	}

    const getAttributes = obj => { //Extracting object details from search response
        const tnrDet = {
            title: "",
            name: "",
            type: "",
            physicalid: "",
            revision: "",
            "ds6w:identifier": "",
            "ds6w:type": "",
            "ds6w:i3dx": ""
        }
        obj.forEach(attr => {
            switch (attr.name) {
                case 'ds6w:label' :
                    tnrDet.title = attr.value
                    break;
                case 'name' :
                    tnrDet.name = attr.value
                    break;
                case 'type' :
                    tnrDet.type = attr.value
                    break;
                case 'physicalid' :
                    tnrDet.physicalid = attr.value
                    break;
                case 'revision' :
                    tnrDet.revision = attr.value
                    break;
                case 'ds6w:identifier' :
                    tnrDet["ds6w:identifier"] = attr.value
                    break;
                case 'ds6w:type' :
                    tnrDet["ds6w:type"] = attr.value
                    break;
                case 'ds6w:i3dx' :
                    tnrDet["ds6w:i3dx"] = attr.value
                    break;
            }
        })

        tnrDet.name = tnrDet.name == "" ? tnrDet["ds6w:identifier"] : tnrDet.name
        tnrDet.type = tnrDet.type == "" ? tnrDet["ds6w:type"] : tnrDet.type
        tnrDet.physicalid = tnrDet.physicalid == "" ? tnrDet["ds6w:i3dx"] : tnrDet.physicalid

        return tnrDet;
    }

    Utils.getAttributes = getAttributes;

    let initTNR = (tnrObj, modDesc) => {
        if(!tnrObj) {
            tnrObj = modDesc
        }
        if (!tnrObj.title) tnrObj.title = modDesc.title || "";
        if (!tnrObj.physicalid) tnrObj.physicalid = modDesc.physicalid || "";
        return tnrObj;
    }


    Utils.processTitleResponse = (initialDetails, tnrResponse = []) => {

        let tnrDetails = {}
        tnrResponse && tnrResponse.forEach(attr => { //Iterating list of all tnr details from search
            const obj = attr.attributes;
            const objectDetails = obj.length > 0 ? getAttributes(obj) : {}; //Extracting only rewuired details from response
            const tnrKey = objectDetails.type + delim + objectDetails.name + delim + objectDetails.revision;
            tnrDetails[tnrKey] = objectDetails; //Building json with tnr as { t_n_r: details }
        })
        
        const finalDetails = [...initialDetails]
        initialDetails.forEach((initResponse, index) => { //Iterating over original json to add title and other details into it
            const keyDetails = Object.keys(initResponse)
            keyDetails.forEach(responseKey => {
                initResponse[responseKey].historyData.forEach((historyDetails, historyIndex) => {
                    if (typeof historyDetails.modDesc == 'object') {
                        const modDesc = historyDetails.modDesc;
                        const key = modDesc.type + delim + modDesc.name + delim + modDesc.revision
                        const tnrValue = initTNR(tnrDetails[key], modDesc)
                        finalDetails[index][responseKey].historyData[historyIndex].modDesc =
                        { ...finalDetails[index][responseKey].historyData[historyIndex].modDesc, physicalid: tnrValue.physicalid, title: tnrValue.title }

                        if (typeof modDesc.revisionedFrom == 'object') {
                            const revisionedFrom = modDesc.revisionedFrom;
                            const revisionKey = revisionedFrom.type + delim + revisionedFrom.name + delim + revisionedFrom.revision
                            const revisiontnrValue = initTNR(tnrDetails[revisionKey], revisionedFrom)
                            finalDetails[index][responseKey].historyData[historyIndex].modDesc.revisionedFrom =
                            { ...finalDetails[index][responseKey].historyData[historyIndex].modDesc.revisionedFrom, physicalid: revisiontnrValue.physicalid, title: revisiontnrValue.title }
                        }
                    }
                })
            })
        })
        return finalDetails;
    }

    Utils.showLoader = (container = document.getElementById("HistoryFacet"), loadingText = NLS.loadingHistory) => {
        container && ModalLoader.displayModalLoader(container, loadingText);
    }
    Utils.removeLoader = (container = document.getElementById("HistoryFacet"), loadingText = NLS.loadingHistory) => {
        container && ModalLoader.removeModalLoader(container, loadingText);
    }

    return Utils;
});

define('DS/ENXHistoryUX/Components/Wrapper/TileViewWrapper',
    ['DS/CollectionView/ResponsiveTilesCollectionView'],
    function (WUXResponsiveTilesCollectionView) {

        'use strict';

        let WrapperTileView, _myResponsiveTilesView, _container;
        /*
         * builds the default container for tile view if container is not passed
         */
        let buildLayout = function () {
            _container = UWA.createElement('div', { id: 'HistoryDetailsTileViewContainer', 'class': 'historydetails-tile-view-container hideView' });

        };
        /*
         * builds the tile view using WebUX's tile view
         * required param: treeDocument as model 
         * optional: container if customize container dom element is required with ur own class
         */
        let initTileView = (treeDocument, container, enableDragAndDrop) => {
            if (!container) {
                buildLayout();
            } else {
                _container = container;
            }
            if (!enableDragAndDrop) {
                enableDragAndDrop = false;
            }
            _myResponsiveTilesView = new WUXResponsiveTilesCollectionView({
                model: treeDocument,
                allowUnsafeHTMLContent: true,
                useDragAndDrop: enableDragAndDrop,
                displayedOptionalCellProperties: ['description'],
                contextualMenu: []
            });

            _myResponsiveTilesView.getContent().style.top = '50 px';
            _myResponsiveTilesView.inject(_container);
            return _container;
        };
        /*
         * Returns the tile view
         */
        let tileView = function () {
            return _myResponsiveTilesView;
        };
        /*
         *Returns the selected tiles' details 
         */
        let getSelectedRows = function (myResponsiveTilesView) {
            var selectedDetails = {};
            var details = [];
            var children = myResponsiveTilesView.TreedocModel.getSelectedNodes();;
            for (var i = 0; i < children.length; i++) {
                details.push(children[i].options.grid);
            }
            selectedDetails.data = details;
            return selectedDetails;
        };
        /*
         * Exposes the below public APIs to be used
         */
        return {
            build: (treeDocument, container) => initTileView(treeDocument, container),
            tileView,
            getSelectedRows: () => getSelectedRows(_myResponsiveTilesView)
        };

    });

/**
 * Notification Component - initializing the notification component
 *
 */
define('DS/ENXHistoryUX/Components/HistoryNotifications',[
	'DS/Notifications/NotificationsManagerUXMessages',
	'DS/Notifications/NotificationsManagerViewOnScreen',
	],
function(NotificationsManagerUXMessages,NotificationsManagerViewOnScreen) {

    'use strict';
    let _notif_manager = null;
    let HistoryNotifications = function () {
        // Private variables
    	
    	
        /**
         * 
         *
         * @param {Number} policy Policy that need to be set. It can be a combination of multiple options.
         *                  possible options :
         *                      - 0  No stacking
         *                      - 1  Stacking using level only
         *                      - 2  Stacking using category (can not be used alone, use level too by setting a policy of 3)
         *                      - 4  Stacking using title (can not be used alone, use level too by setting a policy of 5)
         *                      - 8  Stacking using subtitle (can not be used alone, use level too by setting a policy of 9)
         *                      - 16 Stacking only if the new notification matches the last one displayed (can not be used alone)
         *                  possible values :
         *                      - 0                    No stacking
         *                      - 1 + possibleOptions  Stacking can't be done without stacking the level
         * 
         */
    	_notif_manager = NotificationsManagerUXMessages;
    	NotificationsManagerViewOnScreen.setNotificationManager(_notif_manager);
    	NotificationsManagerViewOnScreen.setStackingPolicy(9); //To stack similar subject messages 
    	
    };
    
    HistoryNotifications.prototype.handler = function () {
    	NotificationsManagerViewOnScreen.inject(document.body);
    	return _notif_manager;
    };
    
    HistoryNotifications.prototype.notifview = function(){
    	return NotificationsManagerViewOnScreen;
    }; 
    
    return HistoryNotifications;

});

define('DS/ENXHistoryUX/View/Dialog/HistoryDefaultDialog', [
    'DS/Windows/Dialog',
    'DS/Windows/ImmersiveFrame',
    'DS/Controls/Button',
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS',
],
    function (
        WUXDialog,
        WUXImmersiveFrame,
        WUXButton,
        NLS) {
        'use strict';

        const getDialog = frame => {

            let _dialog;
            const immersiveFrame = frame || new WUXImmersiveFrame();

            const destroyContainer = () => {
                if (immersiveFrame) {
                    immersiveFrame.destroy()
                }
                _dialog.destroy()
            }

            const footerCancelButton = new WUXButton({ domId: 'closeButtonId' , label: NLS.closeDialog, emphasize: "secondary", onClick: destroyContainer })

            const dialogDetailsContainer = new UWA.Element('div', { id: "HistoryDialogDetailsContainer" });

            immersiveFrame.inject(document.body);

            let header = NLS.HistoryDetailsWindowHeader;

            _dialog = new WUXDialog({
                title: header,
                modalFlag: true,
                width: 900,//to accomodate majority of the columns
                height: 500,
                content: dialogDetailsContainer,
                immersiveFrame: immersiveFrame,
                resizableFlag: true,
                buttons: {
                    Cancel: footerCancelButton
                }
            });

            _dialog.addEventListener("close", function (e) {
                widget.historyEvent.publish('history-window-closed');
            });

            return {
                dialogDetailsContainer,
                destroyContainer
            }
        };

        return { getDialog }

    });

define('DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper',
    [
        'DS/DataGridView/DataGridView',
        'DS/CollectionView/CollectionViewStatusBar',
        'DS/Controls/Find',
        'DS/Utilities/Utils'
    ],
    function (DataGridView, CollectionViewStatusBar, WUXFind, Utils) {

        'use strict';

        let _dataGrid, _container, _toolbar

        let buildToolBar = jsonToolbar => {
            jsonToolbar = JSON.parse(jsonToolbar);
            _toolbar = _dataGrid.setToolbar(JSON.stringify(jsonToolbar));
            return _toolbar;
        };

        const rowGroupingOptions = {
            hideGroupedColumns: true,
            depth: 0,
            getGroupingNodeLabel: function (treeNodeModel) {
                return (treeNodeModel.getIdentifier());
            }
        }
        
        let loadCustomViews = function(dataGridView) {
          //var widget = Contexts.get('widget') || window.widget;
          if(widget.getValue("wux-collectionView-dataGridView")){
            const columnPref = JSON.parse(widget.getValue("wux-collectionView-dataGridView"))[dataGridView.identifier];
            if(columnPref) dataGridView.loadCustomViews(columnPref.customViews, columnPref.currentCustomViewId);
          }
        };

        let initDataGridView = (treeDocument, colConfig, toolBar, dummydiv, massupdate) => {
            _dataGrid = new DataGridView({
                treeDocument: treeDocument,
                columns: colConfig,
                identifier: "HistoryView",
                useWidgetPreferencesFlag: true,
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                },
                showModelChangesFlag: false,
                rowGroupingOptions: rowGroupingOptions,
                filterViewOptions: { ignoreGroupingNodes: true },
            });
            if (massupdate) {
                _dataGrid.showModelChangesFlag = true;
            }
            _dataGrid.buildStatusBar([{
                type: CollectionViewStatusBar.STATUS.NB_ITEMS
            }]);
            
            loadCustomViews(_dataGrid);
            _dataGrid.layout.cellHeight = 35;
            _dataGrid.rowSelection = 'none';
            _dataGrid.cellSelection = 'none';
            //_dataGrid.getContent().style.top = '50px';
            if (toolBar) {
                buildToolBar(toolBar);
            }

            // var divCSVResult = document.createElement("div");
            // divCSVResult.id = "divCSVResult";
            // document.body.appendChild(divCSVResult);

            _dataGrid.groupRows({
                dataIndexesToGroup: ["date"]
            });

            setReusableComponents();
            _dataGrid.inject(dummydiv);
            return dummydiv;
        };

        const showFind = function () {

            let findParent = _toolbar.elements.container;
            const findSpan = findParent.querySelector(
                '.wux-controls-toolbar-mask-container .wux-tweakers .wux-ui-3ds-search'
            );
            const parent = findSpan.parentElement.parentElement;
            if (parent && parent.classList.contains('wux-controls-button')) {
                findParent = parent;
            } else {
                findParent = findSpan;
            }


            if (!_dataGrid.findWidget) {
                new WUXFind({
                    displayMatchCaseToggle: true,
                    relatedWidget: _dataGrid,
                    onFindRequest: _dataGrid.setFindStr,
                    onFindPreviousResult: _dataGrid.goToPreviousMatchingCell,
                    onFindNextResult: _dataGrid.goToNextMatchingCell,
                    onFindClose: _dataGrid.closeFind
                }).inject(_toolbar.elements.container);
                if (_toolbar.elements.container.offsetWidth < 290) {
                    _dataGrid.findWidget.getContent().style.right = "0";
                }
                else if (_toolbar.elements.container.offsetWidth < 340) {
                    _dataGrid.findWidget.getContent().style.right = "16%";
                } else {
                    _dataGrid.findWidget.getContent().style.right = "85px";
                }
                _dataGrid.findWidget.getContent().style.bottom = "-7px";
                _dataGrid.findWidget.getContent().style.position = "absolute";
                _dataGrid.findWidget.getContent().style.height = "30px";
                _dataGrid.findWidget.getContent().getChildren()[0].style.height = "30px";
            } else {
                _dataGrid.findWidget.visibleFlag = true;
            }
            Utils.setConstrainedPosition(_dataGrid.findWidget, findParent, {
                position: 'left',
                alignment: 'near',
                offset: {
                    y: '52px',
                    x: '-10px',
                }
            });
            _dataGrid.findWidget.focus();
        }

        function downloadBlob(filename, blob) {
            var url = window.URL.createObjectURL(blob);

            var element = document.createElement('a');
            element.style.display = 'none';
            element.download = filename;
            element.href = url;

            document.body.appendChild(element);

            element.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(element);
        }

        const getObjTitle = dataGridModel => {
            let matchedIndex = -1;
            const hasTitle = dataGridModel.some((model, index) => {
                matchedIndex = index;
                return model._options && model._options.objectTitle
            }) 
            return hasTitle ? dataGridModel[matchedIndex]._options.objectTitle + '_History.csv' : 'Object_History.csv';
        }

        const exportGrid = () => {
            var csv = _dataGrid.getAsCSV({ addLevelInformation: true });
            var blob = new Blob([csv], { type: 'text/csv' });
            const objName = (typeof _dataGrid.model == 'object' && _dataGrid.model.length > 1) ? getObjTitle(_dataGrid.model) : 'Object_History.csv'
            downloadBlob(objName, blob);
        }

        const printGrid = () => {
            _dataGrid.openPrintableViewWindow(true);
        }


        let dataGridView = () => {
            return _dataGrid;
        };

        //todo nsm4
        let setReusableComponents = () => {
            _dataGrid.registerReusableCellContent({
                id: '_objState_',
                buildContent: function () {
                    let commandsDiv = UWA.createElement('div');
                    UWA.createElement('span', {
                        "html": "",
                        "class": "obj-state "
                    }).inject(commandsDiv);
                    return commandsDiv;
                }
            });

            // _dataGrid.registerReusableCellContent({
            //     id: '_action_',
            //     buildContent: function () {
            //         let responsible = new UWA.Element("div", {});
            //         let action = new UWA.Element("span", {
            //             class: 'actionCell'
            //         });
            //         let userIcon = "";
            //         userIcon = UWA.createElement('span', {
            //             class: "historyUserIcon",
            //         });
            //         userIcon.inject(action);
            //         let actionName = UWA.createElement('span', {
            //             class: 'actionName',
            //             html: ""
            //         });
            //         action.inject(responsible);
            //         actionName.inject(responsible);
            //         return responsible;
            //     }
            // });

            _dataGrid.registerReusableCellContent({
                id: '_desc_',
                buildContent: function () {
                    let responsible = new UWA.Element("div", {});
                    let desc = new UWA.Element("span", {
                        class: 'descCell'
                    });
                    let descText1 = UWA.createElement('span', {
                        class: "descText",
                    });
                    let descLink1 = UWA.createElement('span', {
                        class: 'descLinkOpenWith'
                    });
                    let descText2 = UWA.createElement('span', {
                        class: "descText",
                    });
                    let descLink2 = UWA.createElement('span', {
                        class: 'descLinkOpenWith'
                    });
                    let descText3 = UWA.createElement('span', {
                        class: "descText",
                    });
                    descText1.inject(desc);
                    descLink1.inject(desc);
                    descText2.inject(desc);
                    descLink2.inject(desc);
                    descText3.inject(desc);
                    desc.inject(responsible);
                    return responsible;
                }
            });

            // _dataGrid.registerReusableCellContent({
            //     id: '_user_',
            //     buildContent: function () {
            //         let responsible = new UWA.Element("div", {});
            //         let user = new UWA.Element("div", {
            //             class: 'userCell'
            //         });
            //         let userIcon = "";
            //         if (HistoryBootstrap.getSwymUrl() && HistoryBootstrap.getSwymUrl().length > 0) {
            //             userIcon = UWA.createElement('img', {
            //                 class: "historyUserIcon",
            //             });
            //         } else {
            //             userIcon = UWA.createElement('div', {
            //                 html: "",
            //                 class: "avatarIcon"
            //             });
            //         }
            //         userIcon.inject(user);
            //         let userName = UWA.createElement('span', {
            //             class: 'userName',
            //             html: ""
            //         });
            //         user.inject(responsible);
            //         userName.inject(responsible);
            //         return responsible;
            //     }
            // });
        };

        let getSelectedRowsModel = (treeDocumentModel) => {
            var selectedDetails = {};
            var details = [];
            var children = treeDocumentModel.getSelectedNodes();
            for (var i = 0; i < children.length; i++) {
                details.push(children[i]);
            }
            selectedDetails.data = details;
            return selectedDetails;
        };

        let getRowModelById = (treeDocumentModel, id) => {
            var children = treeDocumentModel.getChildren();
            for (var i = 0; i < children.length; i++) {
                if (children[i].options.id == id) {
                    return children[i];
                }
            }
        };

        let getRowModelIndexById = (treeDocumentModel, id) => {
            var children = treeDocumentModel.getChildren();
            for (var i = 0; i < children.length; i++) {
                if (children[i].options.id == id) {
                    return i;
                }
            }
        };
        
        let getRowModelByRowId = (treeDocumentModel, rowID) => {
            var children = treeDocumentModel.getAllDescendants();
            for (var i = 0; i < children.length; i++) {
                if (children[i]._rowID == rowID) {
                    return children[i];
                }
            }
        };

        return {
            build: (treeDocument, colConfig, toolBar, dummydiv, massupdate) => initDataGridView(treeDocument, colConfig, toolBar, dummydiv, massupdate),
            dataGridView,
            destroy: () => { _dataGrid.destroy(); _container.destroy() },
            dataGridViewToolbar: () => _toolbar,
            getSelectedRowsModel,
            getRowModelById,
            getRowModelIndexById,
            getRowModelByRowId,
            showFind,
            exportGrid,
            printGrid
        };

    }
);

/**
 * HistoryEvent Component - handling interaction between components for smooth async events
 *
 */
define('DS/ENXHistoryUX/Components/HistoryEvent',
['DS/CoreEvents/ModelEvents'],
function(ModelEvents) {

    'use strict';
    var _eventBroker = null;
    var HistoryEvent = function () {
        // Private variables
        _eventBroker= new ModelEvents();
    };

    /**
     * publish a topic on given channels in param, additional data may go along with the topic published
     * @param  {[type]} eventTopic [description]
     * @param  {[type]} data       [description]
     *
     */
    HistoryEvent.prototype.publish = function (eventTopic, data) {
          _eventBroker.publish({ event: eventTopic, data: data }); // publish from ModelEvent
    };

    /**
    *
    * Subscribe to a topic
    * @param {string} eventTopic the topic to subcribe to
    * @param {function} listener the function to be called when the event fires
    * @return {ModelEventsToken}             a token to use when you want to unsubscribe
    */
    HistoryEvent.prototype.subscribe = function (eventTopic, listener) {
        return _eventBroker.subscribe({ event: eventTopic }, listener);

    };
    
    /**
     * Subscribe to an event once with eventually
     *
     *
     * @param  {Object} settings  options hash or a option/value pair.
     * @param  {Event} settings.event  Event to subscribe.
     * @param  {Function} callback  Function to call after event reception.
     *
     * @return {undefined}
     *
     */
    HistoryEvent.prototype.subscribeOnce = function(eventTopic, listener) {
    	return _eventBroker.subscribeOnce({ event: eventTopic }, listener);
    };

    /**
     * Unsubscribe to a topic
     * @param  {[type]} token [description]
     *
     */
    HistoryEvent.prototype.unsubscribe = function (token) {
        _eventBroker.unsubscribe(token);
    };

    HistoryEvent.prototype.getEventBroker = function(){
      return _eventBroker;
    };

    HistoryEvent.prototype.destroy = function(){
      _eventBroker.destroy();
    };



   return HistoryEvent;

});

/*

 * this toolbar is used to create a toolbar of the route summary datagrid view
 */

define('DS/ENXHistoryUX/Config/HistoryToolbarConfig',
  [
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS',
  ],
  function (NLS) {
    let viewData = {
      menu: [
        {
          type: 'CheckItem',
          title: NLS.gridView,
          state: "selected",
          fonticon: {
            family: 1,
            content: "wux-ui-3ds wux-ui-3ds-view-list"
          },
          action: {
            module: 'DS/ENXHistoryUX/Config/HistoryToggleViews',
            func: 'doToggleView',
            argument: {
              "view": "GridView",
              "curPage": "HistorySummary"
            }
          },
          tooltip: NLS.gridView
        },
        {
          type: 'CheckItem',
          title: NLS.tileView,
          fonticon: {
            family: 1,
            content: "wux-ui-3ds wux-ui-3ds-view-small-tile"
          },
          action: {
            module: 'DS/ENXHistoryUX/Config/HistoryToggleViews',
            func: 'doToggleView',
            argument: {
              "view": "TileView",
              "curPage": "HistorySummary"
            }
          },
          tooltip: NLS.tileView
        }
      ]
    };

    let writetoolbarDefinition = () => {
      //todo nsm4
      let definition = {
        "entries": [
          {
            "id": "search",
            "className": "searchDatagrid",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                "iconName": "search",
                "fontIconFamily": 1
              },
              "action": {
                "module": "DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper",
                "func": "showFind"
              }
            },
            "position": "far",
            "tooltip": NLS.search,
            "category": "action" //same category will be grouped together
          },
          {
            "id": "export",
            "className": "exportDatagrid",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                "iconName": "export",
                "fontIconFamily": 1
              },
              "action": {
                "module": "DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper",
                "func": "exportGrid"
              }
            },
            "position": "far",
            "tooltip": NLS.export,
            "category": "action" //same category will be grouped together
          },
          {
            "id": "print",
            "className": "exportDatagrid",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                "iconName": "print",
                "fontIconFamily": 1
              },
              "action": {
                "module": "DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper",
                "func": "printGrid"
              }
            },
            "position": "far",
            "tooltip": NLS.print,
            "category": "action" //same category will be grouped together
          },
          // {
          //   "id": "toggleView",
          //   "className": "historyViews",
          //   "dataElements": {
          //     "typeRepresentation": "viewdropdown",
          //     "icon": {
          //       "iconName": "view-list",
          //       "fontIconFamily": 1
          //     },

          //     "value": viewData
          //   },
          //   "position": "far",
          //   "tooltip": NLS.toggleView,
          //   "category": "action" //same category will be grouped together
          // }
        ],
        "typeRepresentations": {
          "viewdropdown": {
            "stdTemplate": "functionMenuIcon",
            "semantics": {
              "label": "action",
              "icon": "sorting"
            },
            "position": "far",
            "tooltip": {
              "text": "view",
              "position": "far"
            }
          }
        }

      }
      return JSON.stringify(definition);
    }

    return {
      writetoolbarDefinition,
      destroy: () => {
        _dataGrid.destroy();
        _container.destroy();
      }
    };
  });

/**
 * 
 *//* global define, widget */
/**
  * @overview History - History Bootstrap file to interact with the platform
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENXHistoryUX/Controller/HistoryBootstrap',
[
    'UWA/Core',
    'DS/ENXHistoryUX/Utilities/Utils',
    'DS/PlatformAPI/PlatformAPI',
    'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
    'DS/WAFData/WAFData'
],
function (
    UWACore,
    Utils,
    PlatformAPI,
    CompassServices,
    WAFData
) {
    'use strict';
    let _started = false, _frameENOVIA = false, _csrf, HistoryBootstrap, _prefSwym, _pref3DSpace, _pref3DPassport, _prefSearch, _urlsSearch, _urlCompass;


    function initSearchServices() {
        if (_urlsSearch) {
            return _urlsSearch;
        }
        // [TO DO] This may be merged with the storage management to avoid 1 ajax call
        //         Just notice the js service has a cache ... this could be useful/powerful to manage storage preferences
        CompassServices.getServiceUrl({
            serviceName: '3DSearch',
            onComplete: function (data) {
                _urlsSearch = data;
                const id = widget.getValue("x3dPlatformId");
                if (id && _urlsSearch) {
                    for (var i = 0; i < _urlsSearch.length; i++) {
                        if (id === _urlsSearch[i].platformId) {
                            _prefSearch = _urlsSearch[i].url;
                            break;
                        }
                    }
                }
            },
            onFailure: function (data) {
                _urlsSearch = [];
            }
        });

        return _urlsSearch;
        
    }


    async function initSwymServices() {
        if (_prefSwym) {
            return _prefSwym;
        }

        let platformId = widget.getValue("x3dPlatformId");

        return new Promise(resolve => {
            CompassServices.getServiceUrl({
                serviceName: '3DSwym',
                platformId: platformId,
                onComplete: function (data) {
                    if (data) {
                        if (typeof data === "string") {
                            _prefSwym = data;
                        } else {
                            _prefSwym = data[0].url;
                        }
                    } else {
                        _prefSwym = '';
                    }
                    resolve(_prefSwym)
                },
                onFailure: function () {
                    _prefSwym = '';
                    resolve(_prefSwym)
                }
            });
        })
    }

    async function init3DSpaceServices(serviceName = '3DSpace') {
        if (_pref3DSpace) {
            return _pref3DSpace;
        }

        let platformId = widget.getValue("x3dPlatformId");

        return new Promise(resolve => {
            CompassServices.getServiceUrl({
                serviceName,
                platformId: platformId,
                onComplete: function (data) {
                    if (typeof data === "string") {
                        _pref3DSpace = data;
                    } else {
                        _pref3DSpace = data[0].url;
                    }
                    resolve(_pref3DSpace)
                },
                onFailure: function () {
                    _pref3DSpace = '';
                    resolve(_pref3DSpace)
                }
            });
        })
    }
    
    /*async function init3DPassportServices() {
        if (_pref3DPassport) {
            return _pref3DPassport;
        }

        let platformId = widget.getValue("x3dPlatformId");

        return new Promise(resolve => {
            CompassServices.getServiceUrl({
                serviceName: '3DPassport',
                platformId: platformId,
                onComplete: function (data) {
                    if (typeof data === "string") {
                    	_pref3DPassport = data;
                    } else {
                    	_pref3DPassport = data[0].url;
                    }
                    resolve(_pref3DPassport)
                },
                onFailure: function () {
                	_pref3DPassport = '';
                    resolve(_pref3DPassport)
                }
            });
        })
    }*/

    async function populateServiceUrls (myAppsUrl, tenant = "OnPremise") {
        const returnedPromise = new Promise(function (resolve, reject) {
            if(!window.enoviaServerFilterWidget) {
                window.enoviaServerFilterWidget = {
                    userID: 'userId',
                    tenant
                }

            }
            CompassServices.getPlatformServices({
                config: {
                    myAppsBaseUrl: myAppsUrl,
                    userId: (enoviaServerFilterWidget.userID) || 'userId',
                    lang: 'lang',
                },
                onComplete: function (data) {
                    for (let count = 0; count < data.length; count++) {
                        if (enoviaServerFilterWidget.tenant == data[count]['platformId']) {
                            _pref3DSpace = data[0]['3DSpace'];
                            _prefSearch = data[0]['3DSearch'];
	                        _prefSwym = data[0]['3DSwym'];
                        }
                    }
                    resolve();
                },
                onFailure: function(error){
					reject(error)
				},
            });
        });
       return returnedPromise;
   }


    HistoryBootstrap = //UWACore.merge(UWAListener, 
    {

        start: function (data) {
			const { platformServiceURL, serviceName, tenant } = data
			const platformServiceURLs = platformServiceURL;
            return new Promise(async resolve => {
                if (_started) {
                    resolve()
                    return;
                }
                if(typeof widget == 'undefined') {
					window.widget = {data:{}};
	                widget.setValue = (id, value) => widget[id] = value;
	                widget.getValue = id => widget[id];
                }
                const currentTenant = widget.getValue('x3dPlatformId')
	            if(!currentTenant && tenant) {
	                widget.setValue('x3dPlatformId', tenant)
	            }
                if (platformServiceURLs && platformServiceURLs.URLCompass) {
                    _urlCompass = platformServiceURLs.URLCompass
                    await populateServiceUrls(_urlCompass, tenant)
                                }else if (typeof platformServiceURLs == 'object' && Object.keys(platformServiceURLs).length > 0) {
	                _pref3DSpace = platformServiceURLs.URL3DSpace;
	                _prefSwym = platformServiceURLs.URLSwym;
	                _prefSearch = platformServiceURLs.URLSearch;
				} else {
                    await initSearchServices();
					await initSwymServices();
					await init3DSpaceServices(serviceName);
					//await init3DPassportServices();
				}

                _started = true;
                resolve();
            })
        },

        authenticatedRequest: function (url, options) {
            let onComplete;
            let tenantId = widget.getValue('x3dPlatformId');
            url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'tenant=' + tenantId;
            if(widget.HistoryCredentials.securityContext){
                url = url + '&SecurityContext=' + encodeURIComponent(widget.HistoryCredentials.securityContext);
            }else if(widget.getPreference("collabspace")){
                url = url + '&SecurityContext=' + encodeURIComponent(widget.getPreference("collabspace").value);
            }else if(widget.getPreference("xPref_CREDENTIAL")){
                url = url + '&SecurityContext=' + encodeURIComponent(widget.getPreference("xPref_CREDENTIAL").value);
            }
            if (widget.debugMode) {
                url = url + '&$debug=true'
            }
            if (widget.facetLang) {
                url = url + '&language=' + widget.facetLang;
            }
            //  else if (Utils.getCookie("swymlang")) {
            //     url = url + '&language=' + Utils.getCookie("swymlang");
            // }

            onComplete = options.onComplete;

            options.onComplete = function (resp, headers, options) {
                _csrf = headers['X-DS-CSRFTOKEN'];
                if (UWACore.is(onComplete, 'function')) {
                    onComplete(resp, headers, options);
                }
            };

            return WAFData.authenticatedRequest(url, options);
        },

        getLoginUser: function () {
            let user = PlatformAPI.getUser();
            if (user && user.login) {
                return user.login;
            }
        },

        getLoginUserFullName: function () {
            let user = PlatformAPI.getUser();
            if (user && user.firstName) {
                if (user.lastName) {
                    return user.firstName + " " + user.lastName;
                } else {
                    return user.firstName;
                }
            }
        },
        
        getLoginUserEmail : function () {
			var user=PlatformAPI.getUser();
			if ( user && user.email) {
				return user.email;
			}
		},

        getSyncOptions: function () {
            if (_frameENOVIA) {
                return {};
            } else {
                let syncOptions = {
                    ajax: this.authenticatedRequest
                };

                return syncOptions;
            }
        },


        get3DSpaceURL: function () {
            if (_started) {
                return _pref3DSpace;
            }
        },
        get3DPassportURL: function () {
            if (_started) {
                return _pref3DPassport;
            }
        },
        getHistoryServiceBaseURL: function () {
            if (_started) {
                return _pref3DSpace + '/resources/v1/application/history';
            }
        },
        getSwymUrl: function () {
            if (_started) {
                return _prefSwym;
            }
        },
        getSearchUrl : function() {
            if (_prefSearch) {
                return _prefSearch;
            }
        },
        setCollabSpaceTenant: function(securityContext, tenant) {
            if (widget.HistoryCredentials) {
                widget.HistoryCredentials.securityContext = securityContext;
                widget.HistoryCredentials.tenant = tenant;
                widget.x3dPlatformId = tenant;
            }
        }

    }
    //);

    return HistoryBootstrap;
});



define('DS/ENXHistoryUX/Model/HistoryDataManipulation',
    [
        'DS/ENXHistoryUX/Utilities/Utils',
        'i18n!DS/ENXHistoryUX/assets/nls/ActionsNLS.json',
        'text!DS/ENXHistoryUX/assets/json/ActionOmissionList.json',
        'text!DS/ENXHistoryUX/assets/json/ActionFilterList.json'
    ],
    function (Utils, ActionsNLS, ActionOmissionList, ActionFilterList) {

        const filterList = JSON.parse(ActionFilterList);
        const actionOmissionList = JSON.parse(ActionOmissionList)
        const objectsOmisionList = actionOmissionList['i3dxEntity']
        const connectionOmisionList = actionOmissionList['i3dxRelation']

        let actionOmitCache = {}

        const getActionsToFilter = type => {
            const actionsToFilter = [];
            const typeActionsToFilter = filterList[type] || []
            typeActionsToFilter.forEach && typeActionsToFilter.forEach(rawAction => {
                actionsToFilter.push(ActionsNLS[rawAction] || rawAction)
            })
            return actionsToFilter
        }

        const getNestedValue = (json, keys) => {
            let finalValue = json
            keys.forEach(key => {
                finalValue = (finalValue && finalValue[key]) || undefined
            })
            return finalValue
        }

        const checkIfRemoved = dataElem => {

            const type = dataElem.type
            if (typeof actionOmitCache[type] == 'undefined') {
                const globalList = objectsOmisionList.ANY
                const objType = dataElem.objectType
                const typeObjOmissions = objectsOmisionList[type] || {};
                const typeConnOmissions = connectionOmisionList[type] || {};

                let typeList = objType == 'bus' ?
                    typeObjOmissions : objType == 'relationship' ?
                        typeConnOmissions : { ...typeObjOmissions, ...typeConnOmissions }
                typeList = typeList || {}
                actionOmitCache[type] = { ...globalList, ...typeList }
            }

            if (typeof actionOmitCache[type] !== 'object') return false;

            const actionsToRemove = actionOmitCache[type][dataElem.action]
            if (typeof actionsToRemove == 'object') {
                const keyToCheck = actionsToRemove['condition']

                if (keyToCheck == "NONE") return true;

                const keys = keyToCheck.split(".");
                let curAttr = "";

                if (keys.length > 1) {
                    curAttr = getNestedValue(dataElem, keys)
                } else {
                    curAttr = dataElem[keys[0]]
                }

                if (actionsToRemove.list.indexOf(curAttr) >= 0) return true; //ignore data row if attribute needs to be Filterped
            }

            return false
        }

        const firefoxSort = (h1, h2) => {
            let diff = new Date(h1.time) - new Date(h2.time)
            if (diff == 0 && h2.action == 'create') {
                if ((h1.objectPhyID == h2.objectPhyID) || (h1.objectPhyID != h2.objectPhyID && h1.action == 'connect'))
                    return 1;
            }
            return diff
        }

        const defaultSort = (h1, h2) => {
            let diff = new Date(h1.time) - new Date(h2.time)
            if (diff == 0 && h1.action == 'create') {
                if ((h1.objectPhyID == h2.objectPhyID) || (h1.objectPhyID != h2.objectPhyID && h2.action == 'connect'))
                    return -1;
            }
            return diff
        }



        const getViewData = respData => {

            let actionsToFilter = getActionsToFilter('global')
            const { initialDetails, tnrResponse } = respData
            const resp = Utils.processTitleResponse(initialDetails, tnrResponse);
            let response = [];
            resp.forEach(objResp => {
                const phyID = Object.keys(objResp)[0]
                const objectData = objResp[phyID]
                const { historyData, objProperties } = objectData
                actionsToFilter = [...actionsToFilter, ...getActionsToFilter(objProperties.type)]
                historyData.forEach(history => {
                    history.type = objProperties.type
                    history.objectType = objProperties.objectType
                    if (!checkIfRemoved(history))
                        response.push({ ...history, ...objProperties, objectPhyID: phyID })
                })
            })

            if (navigator.userAgent.indexOf("Firefox") > -1)
                response.sort(firefoxSort)
            else
                response.sort(defaultSort)

            return { response, actionsToFilter }

        }

        return {
            getViewData,
            checkIfRemoved
        }


    });


define('DS/ENXHistoryUX/Utilities/DataFormatterUtil',
    [
        'DS/ENXHistoryUX/Controller/HistoryBootstrap',
        'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS',
        'i18n!DS/ENXHistoryUX/assets/nls/DetailsNLS.json',
        'i18n!DS/ENXHistoryUX/assets/nls/ActionsNLS.json'
    ],
    function (HistoryBootstrap, NLS, DetailsNLS, ActionsNLS) {
		
        const hideLink_TypeList = [
            'Person',
            'Group Proxy',
            'Group'
        ]

        const genericOverrideKeys = {
            modifyAttribute: "attribute",
            connect: "relation",
            disconnect: "relation",
            create: "type",
            addPath: "relation",
            addLink: "relation"
        }

        const addIstanceRelations = [
            "connect.VPMInstance",
            "connect.RFLPLMFunctionalInstance",
            "connect.RFLPLMFlowExpositionInstance"
        ]
        
        const interfaceRegex = /^XP_.+_Ext$/

        const formatAMPM = date => {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            seconds = seconds < 10 ? '0'+ seconds : seconds;
            let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
            return strTime;
        }

        const getUserDetails = (userName = "", userID) => {
            const uName = typeof userName == 'string' ? userName.trim() : ""
            let userDetails = { "label": uName }
            const userIconURL = "/api/user/getpicture/login/" + userID + "/format/normal";
            const swymUserIconUrl = HistoryBootstrap.getSwymUrl() + userIconURL;
            if (HistoryBootstrap.getSwymUrl() && HistoryBootstrap.getSwymUrl().length > 0) {
                userDetails.icon = swymUserIconUrl;
            }
            return userDetails
        }

        const getAction = (action, desc, fullName) => {
            let actionValue = action
            if ((action == 'addOwnership' || action == 'removeOwnership') && fullName == 'System Admin') {
                action = action + 'System'
            }
            let overrideCheckObj = desc.modDesc
            let overrideCheckKey = '';
            if (action == 'connect' || action == 'disconnect' || action == 'addPath' || action == 'addLink'){
                overrideCheckKey = 'relation'
            } else if (action == 'modifyAttribute') {
                overrideCheckKey = 'attribute'
            }
            if(typeof overrideCheckObj == 'object' &&
            Object.keys(overrideCheckObj).length > 0 &&
            typeof overrideCheckObj[overrideCheckKey] == 'string' &&
            overrideCheckObj[overrideCheckKey].length > 0) {
                actionValue = ActionsNLS[action + "." + overrideCheckObj[overrideCheckKey]] || ActionsNLS[action] || actionValue
            } else {
                actionValue = ActionsNLS[action] || actionValue
            }
            return actionValue;
        }

        const getTitleOrName = modDescObj => {
            let name = ""
            if(typeof modDescObj.title == 'string' && modDescObj.title.length > 0) {
                if (typeof modDescObj.name == 'string' && modDescObj.name.length > 0)
                    name = (modDescObj.title + " (" + modDescObj.name + ")")
                else
                    name = modDescObj.title
            } else {
                    name = modDescObj.name || ""
            }
            return name
        }
        
        const getLinkText = modDescObj => {
            const name = getTitleOrName(modDescObj);
            return name + " " + (modDescObj.revision || "")
        }

        const buildDesc = (t1 = "", l1 = "", t2 = "", l2 = "", t3 = "") => {
            const delm = '|~|'
            return ({
                desc: t1 + " " + l1 + " " + t2 + " " + l2 + " " + t3,
                descToShow: t1 + delm + l1.trim() + delm + t2 + delm + l2.trim() + delm + t3
            })
        }

        const skipOpenWith = (modDesc, action) => {
            let text1 = modDesc.relType + " " + modDesc.name
            const actionNLS = ActionsNLS[action + "." + modDesc.relation]
            if(typeof actionNLS == 'string' && actionNLS.length > 0) {
                text1 = actionNLS + " " + modDesc.name
            }
            return buildDesc(text1);
        }

        const descForAddInstance = (relType, actionNLS, title) => {
            if (NLS.to == relType) { //from - add instance of <link object> to <current object>
                return ({ text1: actionNLS + NLS.ofSpace, text2: NLS.toSpace + title })
            } else if (NLS.from == relType) { //from - add instance of <current object> to <link object>
                return ({ text1: actionNLS + NLS.ofSpace + title + NLS.toSpace, text2: "" })
            }
            return ({ text1: actionNLS + " ", text2: "" })
        }

        const extractLinks = message => {
            let detailsText = message.replace(/\<([^>]+)\>/g,
                function (m, name) {
                    return "|~|" + name + "|~|"
                }
            );
            return detailsText
        }

        const replaceTags = (message, values) => {
            return message.replace(/\{([^}]+)\}/g,
                function (m, name) {
                    return values[name] !== undefined ? values[name] : '';
                }
            );
        }

        const getFinalDetails = (action, key, type) => {
            //Action.details.key.affectedType
            const attrTypeDetails = DetailsNLS[action + ".details." + key + "." + type]
            //Action.details.key
            const attrDetails = DetailsNLS[action + ".details." + key]
            //Action.details (generic)
            const generalDetails = DetailsNLS[action + ".details"]
            return typeof attrTypeDetails == 'string' ? 
                attrTypeDetails : typeof attrDetails == 'string' ? 
                attrDetails : typeof generalDetails == 'string' ?
                generalDetails : ""
        }

        const descForConnDiscon = (modDesc, action, currTitle) => {
            //text1 link1(TNR) text2 link2(TNR) text3 

            const actionNLS = ActionsNLS[action + "." + modDesc.relation] || ActionsNLS[action] || action
            let skipTNR = false;
            let text1 = actionNLS + " ", text2 = "";

            if (hideLink_TypeList.indexOf(modDesc.type) >= 0) { //No open with for person and few other types
                skipTNR = true;
            }

            const actionToCheck = action + "." + modDesc.relation

            //Special case for VPMInstance
            if (addIstanceRelations.indexOf(actionToCheck) > -1) { // for Add instance
                const relType = typeof modDesc.relType == 'string' ? modDesc.relType : '';
                ({ text1, text2 } = descForAddInstance(relType, actionNLS, currTitle))
                if (!skipTNR) {
                    return buildDesc(text1 + (modDesc.typeNLS || "") + " ", getLinkText(modDesc), text2)
                } else {
                    text1 = actionNLS + " " + (modDesc.title || modDesc.name || "")
                    return buildDesc(text1)
                }
            }

            const attribute = modDesc[genericOverrideKeys[action]]

            let details = getFinalDetails(action, attribute, modDesc.type)

            //If details override is found
            if (typeof details == 'string' && typeof modDesc == 'object') {
                modDesc.onlyTitle = modDesc.title || modDesc.name
                //"connect.details.Reference Document.Document Proxy": "{actionNLS} Link {onlyTitle}",
                modDesc.title = getTitleOrName(modDesc);
                modDesc.actionNLS = actionNLS;
                details = extractLinks(details)
                const overriddenDesc = replaceTags(details, modDesc);
                const overridenDescText = overriddenDesc.replaceAll("|~|", "")
                if (skipTNR) { //Types with no link just text
                    return {
                        descToShow: overridenDescText,
                        desc: overridenDescText
                    }
                } else { // Types with link and text
                    return {
                        descToShow: overriddenDesc,
                        desc: overridenDescText
                    }
                }
            }

            //If details override is not present
            if (actionNLS == ActionsNLS['connect.VPMInstance']) { // for Add instance
                const relType = typeof modDesc.relType == 'string' ? modDesc.relType : '';
                ({ text1, text2 } = descForAddInstance(relType, actionNLS, currTitle))
                if (!skipTNR) {
                    return buildDesc(text1 + (modDesc.typeNLS || "") + " ", getLinkText(modDesc), text2)
                } else {
                    text1 = actionNLS + " " + (modDesc.title || modDesc.name || "")
                    return buildDesc(text1)
                }
            }

            
        }


        const descForCreate = modDesc => {

            const action = "create";
            const attribute = modDesc[genericOverrideKeys[action]]
            const actionNLS = ActionsNLS[action + "." + modDesc[attribute]] || ActionsNLS[action] || action


            // let desc = "", descToShow = "";
            // let text1 = actionNLS + " "
            // const text2 = " " + NLS.revisionedFrom
            const revisionedFrom = modDesc['revisionedFrom']

            let details = getFinalDetails(action, attribute, modDesc.type)

            //If details override is found
            if (typeof details == 'string' && typeof modDesc == 'object') {
                modDesc.onlyTitle = modDesc.title || modDesc.name
                modDesc.title = getTitleOrName(modDesc);
                modDesc.actionNLS = actionNLS;
                details = extractLinks(details)
                if (typeof revisionedFrom == 'object' && Object.keys(revisionedFrom).length > 0) {
                   modDesc["revFromText"] = NLS.replace(NLS.revisionedFrom, {
                        oldObj : "",
                        newObj : ""
                    });
                    modDesc["rev.typeNLS"] = revisionedFrom.typeNLS
                    modDesc["rev.title"] = getTitleOrName(revisionedFrom)
                    modDesc["rev.revision"] = revisionedFrom.revision
                } else {
                    modDesc["revFromText"]  = ""
                    modDesc["rev.typeNLS"] = ""
                    modDesc["rev.title"] = ""
                    modDesc["rev.revision"] = ""
                }
                const overriddenDesc = replaceTags(details, modDesc);
                const overridenDescText = overriddenDesc.replaceAll("|~|", "")
                return {
                    descToShow: overriddenDesc,
                    desc: overridenDescText
                }
            }
            
            //If details override is not found
            // if (typeof revisionedFrom == 'object' && Object.keys(revisionedFrom).length > 0) {
            //     ({ desc, descToShow } = buildDesc(text1, getLinkText(modDesc), text2, getLinkText(revisionedFrom)));
            // } else {
            //     ({ desc, descToShow } = buildDesc(text1, getLinkText(modDesc)));
            // }
            // return ({ desc, descToShow })
        }

        const getGenericDesc = dataElem => {
            if ((dataElem.action == "addInterface" || dataElem.action == "removeInterface")
                    && interfaceRegex.test(dataElem.interface)) {
                return { desc: NLS.XPExtensionMessage, descToShow: NLS.XPExtensionMessage };
            }
            const action = dataElem.action
            const tags = dataElem.modDesc && dataElem.modDesc.tags || {}
            const attribute = tags[genericOverrideKeys[action]] || dataElem.modDesc[genericOverrideKeys[action]]
            let genericDetails = typeof dataElem.modDesc == 'string' ? dataElem.modDesc : dataElem.rawDesc
            const attrTypeDetails = DetailsNLS[action + ".details." + attribute]
            const typeDetails = DetailsNLS[action + ".details"]
            let details = typeof attrTypeDetails == 'string' ? 
                attrTypeDetails : typeof typeDetails == 'string' ? typeDetails : ""
            if (typeof details == 'string' && typeof tags == 'object' && Object.keys(tags).length > 0) {
                genericDetails = replaceTags(details, tags)
            }

            return { desc: genericDetails, descToShow: genericDetails };
            
        }

        return {
            formatAMPM,
            getUserDetails,
            getAction,
            getLinkText,
            buildDesc,
            skipOpenWith,
            descForConnDiscon,
            descForCreate,
            getGenericDesc
        }
    })
    

/* global define, widget */
/**
 * @overview History - JSON Parse utilities
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENXHistoryUX/Utilities/ParseJSONUtil',
		[
			'UWA/Class',
			'DS/ENXHistoryUX/Utilities/Utils',
			'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
			],
			function(
					UWAClass,
					Utils,
					NLS
			) {
	'use strict';

	var ParseJSONUtil = UWAClass.extend({
		//TODO Need to remove init method, not used _alert variables

		createCSRFForGivenRequest : function(inputdata,csrf){
			var request = {};
			if(csrf === undefined){
				csrf = widget.data.csrf;
			}
			var data = inputdata
			if (!Array.isArray(inputdata)){
				data = new Array();
				data.push(inputdata);
			}
			
			request = {
					"csrf": csrf,
					"data": inputdata.toString()
			}
			return request;
		},
		createCSRFForRequest : function(csrf){
			var request = {};
			if(csrf === undefined){
				csrf = widget.data.csrf;
			}
			request = {
					"csrf": csrf
			}
			return request;
		},
		parseResp : function(inputResp){
			//widget.data.csrf = resp.csrf; //setting the csrf in widget data
			const resp = new Array();
			inputResp.forEach(objresp => resp.push(objresp))
			return resp;
		},
		
		parseCompleteResp : function(resp){
			widget.data.csrf = resp.csrf; //setting the csrf in widget data
			resp.result = new Array();
			var respLen = resp.data.length;
			for(var i = 0; i< respLen; i++){
				resp.result[i] = resp.data[i];
			   //  if(resp.data[i].dataelements.assigneeType === "Group Proxy" || resp.data[i].dataelements.assigneeType === "Group"){
			   //      resp.result[i].assigneeTitle =   resp.data[i].dataelements.assigneeTitle;
			   //  }
				if(resp.result[i].id === undefined){
					resp.result[i].id = resp.data[i].id;
				}
				if(resp.result[i].type === undefined){
					resp.result[i].type = resp.data[i].type;
				}
			}
			return resp.result;
		},

	});


	return ParseJSONUtil;
});

/* global define, widget */
/**
 * @overview History - History Bootstrap file to interact with the platform
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENXHistoryUX/Services/HistoryServices',
    [
        "UWA/Core",
        'UWA/Class/Promise',
        'DS/ENXHistoryUX/Controller/HistoryBootstrap',
        'DS/ENXHistoryUX/Utilities/ParseJSONUtil',
        'DS/WAFData/WAFData'
    ],
    function (
        UWACore,
        Promise,
        HistoryBootstrap,
        ParseJSONUtil,
        WAFData
    ) {
        'use strict';

        let _fetchHistoryById, _getPhysicalId, _getPathDetails;

        _fetchHistoryById = function (ids) {
            return new Promise(function (resolve, reject) {
                const postURL = HistoryBootstrap.getHistoryServiceBaseURL()
                let options = {};
                options.method = 'POST';
                options.data = JSON.stringify({ phyIds: ids.objectIds, connectionIds: ids.connectionIds });
                options.timeout = 0;
                options.headers = {
                    'Content-Type': 'application/json',
                };

                options.onComplete = function (serverResponse) {
                    resolve(new ParseJSONUtil().parseResp(JSON.parse(serverResponse)));
                };

                options.onFailure = function (serverResponse, respData) {
                    if (respData) {
                        reject(respData);
                    } else {
                        reject(serverResponse);
                    }
                };


                HistoryBootstrap.authenticatedRequest(postURL, options);
            });
        };

        _getPhysicalId = data => {
            return new Promise(function (resolve, reject) {
                const postURL = HistoryBootstrap.getHistoryServiceBaseURL() + "/physicalId"
                let options = {};
                options.method = 'POST';
                options.data = JSON.stringify(data);
                options.timeout = 0;
                options.headers = {
                    'Content-Type': 'application/json',
                };

                options.onComplete = function (serverResponse) {
                    resolve(JSON.parse(serverResponse).physicalid);
                };

                options.onFailure = function (serverResponse, respData) {
                    if (respData) {
                        reject(respData);
                    } else {
                        reject(serverResponse);
                    }
                };


                HistoryBootstrap.authenticatedRequest(postURL, options);
            });
        }

        _getPathDetails = data => {
            return new Promise(function (resolve, reject) {
                const endPoint = data.action == "addPath" ? "pathDetails" : "linkDetails"
                const postURL = HistoryBootstrap.getHistoryServiceBaseURL() + "/" + endPoint
                let options = {};
                options.method = 'POST';
                options.data = JSON.stringify(data);
                options.timeout = 0;
                options.headers = {
                    'Content-Type': 'application/json',
                };

                options.onComplete = function (serverResponse) {
                    resolve(JSON.parse(serverResponse));
                };

                options.onFailure = function (serverResponse, respData) {
                    if (respData) {
                        reject(respData);
                    } else {
                        reject(serverResponse);
                    }
                };


                HistoryBootstrap.authenticatedRequest(postURL, options);
            });
        }

        

        let makeWSCall = function (URL, httpMethod, authentication, ContentType, ReqBody, userCallbackOnComplete, userCallbackOnFailure, options) {

            var options = options || null;
            var url = "";
            if (options != null && options.isfederated != undefined && options.isfederated == true)
                url = HistoryBootstrap.getSearchUrl() + URL;
            var accept = "";
            if (options != null && options.acceptType != undefined && options.acceptType != "")
                accept = options.acceptType;
            else
                accept = 'application/json';

            //Security Context not encoding.
            var encodeSecurityContext = 'Yes';
            if (options != null && options.encodeSecurityContext != undefined && options.encodeSecurityContext != "")
                encodeSecurityContext = options.encodeSecurityContext;


            var timestamp = new Date().getTime();
            if (url.indexOf("?") == -1) {
                url = url + "?tenant=" + widget.getValue('x3dPlatformId') + "&timestamp=" + timestamp;
            } else {
                url = url + "&tenant=" + widget.getValue('x3dPlatformId') + "&timestamp=" + timestamp;
            }

            userCallbackOnComplete = userCallbackOnComplete || function () { };
            userCallbackOnFailure = userCallbackOnFailure || function () { };

            // For NLS translation
            //if(lang == undefined || lang == 'undefined'){

            var queryobject = {};
            queryobject.method = httpMethod;
            queryobject.timeout = 120000000;

            if (options == null || options.isSwymUrl == undefined || options.isSwymUrl == false) {
                queryobject.type = 'json';
            }


            if (authentication) {
                queryobject.auth = {
                    passport_target: authentication
                };
            }



            if (ReqBody)
                queryobject.data = ReqBody;

            queryobject.headers = {
                Accept: "application/json",
                'Content-Type': "application/json",
                'Accept-Language': "en"
            };

            queryobject.onComplete = function (data) {
                //console.log("Success calling url: " + url);
                //console.log("Success data: " + JSON.stringify(data));
                userCallbackOnComplete(data);
            };
            queryobject.onFailure = function (errDetailds, errData) {
                console.log("Error in calling url: " + url);
                //console.log("Additional Details:: httpMethod: " + httpMethod + " authentication: " + authentication + " securityContext: " + securityContext + " ContentType: " + ContentType);
                console.log("Error Detail: " + errDetailds);
                console.log("Error Data: " + JSON.stringify(errData));


                userCallbackOnFailure(errDetailds, errData);
            };

            queryobject.onTimeout = function () {
                console.log("Timedout for url: " + url);
                //ChgErrors.error("Webservice Timedout, please refresh and try again.");
                if (widget.body) {
                    Mask.unmask(widget.body);
                }
            }

            HistoryBootstrap.authenticatedRequest(url, queryobject);
        };



            return {
                fetchHistoryById: historyID => _fetchHistoryById(historyID),
                getPhysicalId: data => _getPhysicalId(data),
                getPathDetails: data => _getPathDetails(data),
                makeWSCall
            };

        });

/*
global widget
 */
define('DS/ENXHistoryUX/Controller/HistoryController',
    [
        'DS/ENXHistoryUX/Services/HistoryServices',
        'UWA/Promise',
        'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
    ],
    function (HistoryServices, Promise, NLS) {
        'use strict';
        let HistoryController;
        //TODO implement a general callback method for anykind of service failure
        let commonFailureCallback = function (reject, failure) {
            if (failure.statusCode === 500) {
                widget.historyNotifications && widget.historyNotifications.handler().addNotif({
                    level: 'error',
                    subtitle: NLS.unexpectedError,
                    sticky: true
                });
            } else {
                reject(failure);
            }
        }

        const checkIfSamePath = (path1, path2) => {
            return (
                path1 && path2 &&
                path1.fullName == path2.fullName &&
                path1.relType == path2.relType &&
                path1.userName == path2.userName
            )
        }

        const mapClosestTimes = (arr, target, resp) => {
            let left = 0, right = arr.length - 1;
            let result = null;
    
            while (left <= right) {
                let mid = Math.floor((left + right) / 2);
                if (new Date(arr[mid]) <= new Date(target)) {
                    if (checkIfSamePath(resp[arr[mid]], resp[target])) {
                        result = arr[mid];
                    }
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
    
            return result;
        }        

        const processPathResp = (resp, currAction) => {
            if ((currAction == 'addPath' && widget.pathsProcessed) || (currAction == 'addLink' && widget.linksProcessed))
                return resp;

            const gridTime = widget[`${currAction}Times`]
            const finalResp = {}

            Object.keys(resp).forEach(time => {
                let timeToAdd = time
                if (gridTime.indexOf(time) < 0) {
                    timeToAdd = mapClosestTimes(gridTime, time, resp)
                }
                if (!finalResp[timeToAdd]) {
                    finalResp[timeToAdd] = resp[time]
                } else {
                    finalResp[timeToAdd]['allIDs'] = [ ...finalResp[timeToAdd]['allIDs'], ...resp[time]['allIDs'] ]
                }
            })
            return finalResp
        }

        /*All methods are public, need to be exposed as this is service controller file*/
        HistoryController = {
            fetchHistoryById: data => {
                return new Promise(function (resolve, reject) {
                    let objectIds = data.id
                    let connectionIds = data.connection
                    HistoryServices.fetchHistoryById({ objectIds, connectionIds }).then(
                        success => {
                            resolve(success);
                        },
                        failure => {
                            commonFailureCallback(reject, failure);
                        });
                });
            },

            getPhysicalId: data => {

                if (typeof data.physicalid == 'string' && data.physicalid.length > 0) {
                    return new Promise((resolve, reject) => {
                        resolve(data.physicalid)
                    })
                }

                const tnr = {
                    type: data.type,
                    name: data.name,
                    revision: data.revision
                }
                return new Promise((resolve, reject) => {
                    HistoryServices.getPhysicalId(tnr).then(
                        success => {
                            resolve(success);
                        },
                        failure => {
                            commonFailureCallback(reject, failure);
                        });
                })
            },

            getPathDetails: (objectPhysicalId, action) => {

                let storedPathObjects = widget.historyPathIDs[objectPhysicalId]
                if (action == 'addLink')
                    storedPathObjects = widget.historyLinkIDs[objectPhysicalId]
                if (storedPathObjects) {
                    return new Promise((resolve, _reject) => {
                        resolve(storedPathObjects)
                    })
                }

                return new Promise((resolve, reject) => {
                    HistoryServices.getPathDetails({ objectPhysicalId, action }).then(
                        success => {
                            if (action == 'addPath') {
                                const resp = processPathResp(success.pathDetails, action)
                                widget.pathsProcessed = true
                                widget.historyPathIDs[objectPhysicalId] = resp
                                const historyPathDetails = success.objectDetails || []
                                historyPathDetails.forEach(obj => {
                                    widget.historyPathDetails[obj.physicalid] = obj
                                });
                                
                                resolve(resp);
                            } else {
                                const resp = processPathResp(success.linkDetails, action)
                                widget.linksProcessed = true
                                widget.historyLinkIDs[objectPhysicalId] = resp || {}
                                resolve(resp || {});
                            }
                        },
                        failure => {
                            commonFailureCallback(reject, failure);
                        });
                })
            }
        };
        return HistoryController;

    });

/* global define, widget */
/**
 * @overview History - Data formatter
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENXHistoryUX/Utilities/DataFormatter',
    ['DS/ENXHistoryUX/Utilities/DataFormatterUtil',
'DS/Utilities/DateUtils'],
    function (DataFormatterUtil,DateUtils) {

        'use strict';
        
        const { formatAMPM, getUserDetails, getAction,skipOpenWith, descForConnDiscon, descForCreate, getGenericDesc } = DataFormatterUtil
		const formatOptions = {
			datePrecision: 'day',
			dateStyle: 'full'
		};
		const formatOptionsForDate = {
			datePrecision: 'none',
			timePrecision: 'sec'
		};

        let gridData = function (dataElem) {

            //const localDate = new Date(dataElem.time);
            //const time = formatAMPM(localDate)
			const time= DateUtils.formatDateToString(new Date(dataElem.time),formatOptionsForDate);
           // const date = (localDate.getMonth() + 1) + '/' + localDate.getDate() + '/' + localDate.getFullYear() ;
			const date=DateUtils.formatDateToString(new Date(dataElem.time),formatOptions);
            let desc = typeof dataElem.rawDesc == 'string' ? dataElem.rawDesc.trim() : '' //The raw description saved in datagid
            let descToShow = typeof dataElem.rawDesc == 'string' ? dataElem.rawDesc.trim() : '' //custom description with links
            const modDesc = dataElem.modDesc
            const action = dataElem.action || ""

            if (typeof modDesc == 'object' && Object.keys(modDesc).length > 0) {
                if (action == "connect" || action == "disconnect"){
                    ({ desc, descToShow } = descForConnDiscon(modDesc, action, dataElem.title));
                } else if (action == "create") { //no relation for create from revision
                    ({ desc, descToShow } = descForCreate(modDesc));
                } else {
                    ({ desc, descToShow } = getGenericDesc(dataElem));
                }
            } else if (typeof modDesc == 'string' && modDesc.length > 0) {
                desc = modDesc
                descToShow = modDesc
            }

            return {
                time,
                date:date,
                "action": getAction(dataElem.action, dataElem, dataElem.fullName),
                "user": getUserDetails(dataElem.fullName, dataElem.user),
                "state": dataElem.stateNLS,
                "fullTime": dataElem.time,
                "description": desc,
                "descriptionToShow": descToShow,
                "objectTitle": dataElem.title
            };
        };

        return {
            gridData: dataElem => gridData(dataElem)
        };
    });


/* global define, widget */
/**
 * @overview History - Search utility
 * @licence Copyright Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENXHistoryUX/Utilities/SearchUtil',
    ['DS/ENXHistoryUX/Services/HistoryServices'],
    function (HistoryServices) {
        'use strict';
        const getObjectDetails = query => {
		    var returnedPromise = new Promise(function (resolve, reject) {
			var url = "/search?xrequestedwith=xmlhttprequest";

            const success = (resp) => {
                resolve(resp)
            }

            const failure = (rej) => {
                reject(rej)
            }

            let SecurityContext = ''
            if(widget.HistoryCredentials.securityContext){
                SecurityContext = widget.HistoryCredentials.securityContext;
            }else if(widget.getPreference("collabspace")){
                SecurityContext = widget.getPreference("collabspace").value;
            }else if(widget.getPreference("xPref_CREDENTIAL")){
                SecurityContext = widget.getPreference("xPref_CREDENTIAL").value;
            }


            SecurityContext = SecurityContext.indexOf('ctx::') >= 0 ? SecurityContext.split('ctx::')[1] : SecurityContext


			//typeahead start
			//queryString = "(flattenedtaxonomies:\"types/Person\" AND policycurrent:\"Person.Active\" )";
			let inputjson = { 
                "with_indexing_date": true, 
                "with_nls": false,
                "label": "History-Fetch",
                "locale": "en", 
                "select_predicate": [
                    "ds6w:label", //title
                    "type", 
                    "name",
                    "revision",
                    "physicalid",
                    "ds6w:identifier", //name
                    "ds6w:type", //type
                    "ds6w:i3dx" //phyid
                ], 
                "query": query, 
                "nresults": 1000, 
                "start": "0",
                "tenant": widget.getValue('x3dPlatformId'),
                "login": {
                    "3dspace": {
                        "SecurityContext": encodeURIComponent(SecurityContext)
                    }
                },
                "specific_source_parameter":{
                    "3dspace":{
                        "option":{
                            "with_Idx_Search": true,
                            "with_relationship_search": true
                        }
                    }
                }
            };	
			inputjson = JSON.stringify(inputjson);

			let options = {};
			options.isfederated = true;
			HistoryServices.makeWSCall(url, "POST", "enovia", 'application/json', inputjson, success, failure, options);
		});

		return returnedPromise;
        }

        return { getObjectDetails };
    });

/* global define, widget */
/**
 * @overview History - Fetch title utility
 * @licence Copyright Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENXHistoryUX/Utilities/FetchObjectDetails',
    [
        'DS/ENXHistoryUX/Utilities/SearchUtil',
        'DS/ENXHistoryUX/Model/HistoryDataManipulation',
        'DS/ENXHistoryUX/Utilities/Utils'
    ],
    function (SearchUtil, HistoryDataManipulation, Utils) {
        'use strict';
        
        let tnrList = [""]
        let objList = [""]
        const queryLength = 8000;
        const objLimit = 1000;
        let objCounter = 0;
        const checkTNR = (data, descName) => {
			if (data && data[descName] && data[descName]['title'] && data[descName]['title'].length > 0)
                return "";
            if (typeof data[descName] == 'object' && Object.keys(data[descName]).length > 0) {
                const modDesc = data[descName]
                if (modDesc.type && modDesc.name && modDesc.type.length > 0 && modDesc.type.length > 0) { //Building tnr query from description details
                    if (modDesc.revision && modDesc.revision.length > 0) {
                        return "(type:(" + modDesc.type + ") AND name:(" + modDesc.name + ")"
                    + " AND revision:(" + modDesc.revision + "))"
                    } else {
                        return " (type:(" + modDesc.type + ") AND name:(" + modDesc.name + "))"
                    }
                }
            }
            return "";
        }

        const addToList = (tnrQuery, listToAdd) => {
            if (listToAdd[listToAdd.length - 1].length == 0 && objCounter < objLimit) { //Adding first/new query to array
                listToAdd[0] = tnrQuery
                objCounter = 1;
            } else if ((listToAdd[listToAdd.length - 1].length + tnrQuery.length) < queryLength  && objCounter < objLimit) { //check query length and object limit
                listToAdd[listToAdd.length - 1] = listToAdd[listToAdd.length - 1] + " OR " + tnrQuery  //Appending new object query to previous query from array
                objCounter++;
            } else { //If old query + new query exceeds length limit/object number exceeds limit, add as a new query
                if (tnrQuery.length > queryLength) { //if a single object query exceeds limit, trim to highest allowed length
                    const maxAllowedlength =  Math.max(tnrQuery.lastIndexOf(" OR "), tnrQuery.lastIndexOf(" AND "), queryLength - 1)
                    listToAdd.push(tnrQuery.slice(0, maxAllowedlength))
                }
                else {
                    listToAdd.push(tnrQuery) //Add query as a new entry
                }
                objCounter = 1;
            }
            return listToAdd
        }

        const getQueryResponse = _tnrQueryList => {
            let tnrQueryList = _tnrQueryList
            return new Promise(function (resolve, reject) {
                SearchUtil.getObjectDetails(tnrQueryList.pop()) //Fetching title details of one query 
                .then(resp => {
                    if (tnrQueryList.length == 0) { //if no more queries, return response
                        resolve(resp.results);
                    } else {
                        getQueryResponse(tnrQueryList).then(
                            data => {
                                const respData = (resp && resp.results) || []
                                resolve(respData.concat(data || [])) //on success append remaining data to current query data
                            },
                            _err => {
                                resolve(resp.results) //on failure, send current data response only
                            }
                        )
                    }
                    
                })
                .catch(function(err) {
                    console.log("ERROR: " + err);
                    reject([]); //return with details if any were fetched
                });
            })
        }

        const getTitleDetails = initialDetails => {
            tnrList = [""];
            let details = [ ...initialDetails ]
            Array.from(details).forEach(obj => { //Build list of all TNRs from initial response
                const historyData = Object.values(obj)[0].historyData || {}
                const type = Object.values(obj)[0].objProperties.type || ""
                const objectType = Object.values(obj)[0].objProperties.objectType || ""
                Array.from(historyData).forEach(eventData => {
                    eventData.type = type
                    eventData.objectType = objectType
                    if (HistoryDataManipulation.checkIfRemoved(eventData)) return;
                    const objTNR = checkTNR(eventData, "modDesc"); //TNR from mod desc
                    tnrList = objTNR.length > 0 ? addToList(objTNR, tnrList) : tnrList;  //Adding TNR to list
                    if (typeof eventData.modDesc == 'object' && eventData.modDesc.revisionedFrom) {
                        const revTNR = checkTNR(eventData.modDesc, "revisionedFrom") //TNR for revisioned from
                        tnrList = revTNR.length > 0 ? addToList(revTNR, tnrList) : tnrList; //Adding original revision TNR to list
                    }
                })
            })
            return new Promise(function (resolve, _reject) {
                if (tnrList.length <= 0 || tnrList[0].length == 0) {
                    resolve({ initialDetails, tnrResponse: [] })
                } else {
                    getQueryResponse(tnrList).then(tnrResponse => { //Fetching title details for tnr list
                        resolve({ initialDetails, tnrResponse })
                    }, tnrResponse => {
                        console.log("Error")
                        resolve({ initialDetails, tnrResponse }) // Fallback to show original tnr if title fetch fails
                    })
                }
            })
        }

        const getObjectDetails = (objectIDs = [], action = "") => {

            objList = [""]
            const pathOrLink = action == "addPath" ? "historyPathDetails" : "historyLinkDetails"
            const storedPathDetails = widget[pathOrLink] || {}
            let toSearchDetails = []
            objectIDs.forEach(objID => {
                if (storedPathDetails[objID] == undefined) {
                    toSearchDetails.push(objID)
                    widget[pathOrLink][objID] = {}
                }
            })
            if (toSearchDetails.length == 0) {
                return new Promise((resolve, _reject) => {
                    resolve(storedPathDetails)
                })
            }

            if (action == "addPath") {
                toSearchDetails.forEach(objID => {
                    addToList(" (physicalid:(" + objID + "))", objList);
                })
            } else if(action == "addLink" || action == "usernameParse") {
                toSearchDetails.forEach(objID => {
                    addToList("([ds6w:i3dx]:(\"" + objID + "\"))", objList);
                })
            }

            return new Promise(function (resolve, _reject) {
                if (objList.length <= 0 || objList[0].length == 0) {
                    resolve()
                } else {
                    getQueryResponse(objList).then(tnrResponse => { //Fetching title details for tnr list
                        const len = (tnrResponse && tnrResponse.length) || 0
                        if (len == 0) {
                            resolve()
                        }
                        for(let i = 0; i < len; i++) {
                            const objDet = Utils.getAttributes(tnrResponse[i].attributes)
                            widget[pathOrLink][objDet.physicalid] = objDet
                            if (i == len - 1)
                                resolve(widget[pathOrLink])
                        }
                    }, _err => {
                        console.log("Error")
                        resolve() // Fallback to show original tnr if title fetch fails
                    })
                }
            })
        }

        return { getTitleDetails, getObjectDetails };
    });

define('DS/ENXHistoryUX/Config/HistoryGridViewConfig',
  [
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS',
    'DS/ENXHistoryUX/Controller/HistoryBootstrap',
    'DS/ENXHistoryUX/View/Menu/HistoryOpenWithMenu',
    'DS/Menu/Menu',
    'DS/ENXHistoryUX/Controller/HistoryController',
    'DS/Utilities/Dom',
    // 'DS/ENXHistoryUX/View/Dialog/HistoryPropertiesDialog',
    // 'DS/ENXHistoryUX/View/Properties/HistoryObjectProperties',
    'text!DS/ENXHistoryUX/assets/json/ActionIcon.json'],
  function (NLS, HistoryBootstrap, HistoryOpenWithMenu, WUXMenu, HistoryController, DomUtils, ActionIcon) {
    // HistoryPropertiesDialog, HistoryObjectProperties, 

    'use strict';

    const actionJSON = JSON.parse(ActionIcon)

    const isTouch = UWA.Utils.Client.Features.touchEvents;
    const fontSize = isTouch ? 14 : 12


    const showMenu = (data, menu, config, objTaxonomies, id) => {
      const contextOpenWithData = {};
      contextOpenWithData.Id = id;
      contextOpenWithData.Type = data.type;
      contextOpenWithData.Title = data && data.modifiedDesc && data.modifiedDesc.title;
      contextOpenWithData.objTaxonomies = objTaxonomies;

      getOpenWithMenu(contextOpenWithData).then(openWithMenu => {
        if (Object.keys(openWithMenu).length > 0) {
          menu = []
          menu = menu.concat(openWithMenu);
        }
        WUXMenu.show(menu, config);
      });
    }

    const notifyObjDeleted = () => {
      widget && widget.historyNotifications && widget.historyNotifications.handler().addNotif({
        level: 'error',
        title : NLS.deletedObjTitle,
        subtitle: NLS.deletedObjSubtitle,
        sticky: false
      });
    }

    const clickLink = (event, data) => {
      event.preventDefault();
      event.stopPropagation();
      const pos = event.target.getBoundingClientRect();
      const config = {
        position: {
          x: pos.left,
          y: pos.top + 20
        }
      };

      let menu = [{
        id: "OpenWith",
        'type': 'PushItem',
        'title': NLS.noOpenWith,
        disabled: "true"
      }];

      /*let objDoesntExist = [{
        id: "OpenWith",
        'type': 'PushItem',
        'title': NLS.this + data.type + NLS.objDoesntExist,
        disabled: "true"
      }];*/

      if (data && Object.keys(data).length > 0) {
        HistoryController.getPhysicalId(data.modifiedDesc).then(id => {
          if (typeof id == 'string' && id.length > 0) {
            if (data && data.modifiedDesc && typeof data.modifiedDesc.typeTaxonomies == 'object') {
              const objTaxonomies = data && data.modifiedDesc && data.modifiedDesc.typeTaxonomies
              showMenu(data, menu, config, objTaxonomies, id)
            } else {
              showMenu(data, menu, config, "", id)
            }
          } else {
            //WUXMenu.show(menu, config); //Object does not exist
            notifyObjDeleted();
          }
        }, () => {
          //WUXMenu.show(menu, config);
          notifyObjDeleted();
        })
      } else {
        WUXMenu.show(menu, config);
      }
    }

    const getOpenWithMenu = contextOpenWithData => {
      let menu = [];
      return new Promise(function (resolve, reject) {
        HistoryOpenWithMenu.getOpenWithMenu(contextOpenWithData).then(
          success => {
            if (success && success.length > 0) {
              menu.push({
                id: "OpenWith",
                'type': 'PushItem',
                'title': NLS.openWith,
                icon: "open-menu-dot",
                submenu: success
              });
            }
            resolve(menu);
          },
          failure => {
            resolve(menu);
          });
      });
    };

    const setStyle = (component, text, className) => { //Setting style to support width identification by Datagrid
      component.setStyle("flex-basis", "300px");
      component.setStyle("width", "calc(100% - 5px)");
      component.setStyle("overflow", "hidden");
      component.setStyle("text-overflow", "ellipsis");
      component.setStyle("white-space", "nowrap");
      component.setStyle("flex", "none");
      component.removeEvents();
      component.addEvent("mouseover", event => { // To set title for tooltip only if element is overflowing
        const elem = event.target.getParent().getParent().querySelector(`.${className}`)
        event.stopPropagation()
        const siblingLen = elem.previousElementSibling && elem.previousElementSibling.offsetWidth
        if (elem.offsetWidth + siblingLen > elem.getParent().offsetWidth) {
          component.setAttribute("title", text);
        } else {
          component.setAttribute("title", "");
        }
      });
      return true;
    }



    const onHistoryStateCellRequest = function (cellInfos) {
      let reusableContent;
      if (!cellInfos.isHeader) {
        reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_objState_');
        if (reusableContent) {
          const stateNLS = cellInfos.nodeModel.options.grid.state || '';
          const stateColor = cellInfos.nodeModel.options.stateColor
          reusableContent.getChildren()[0].setHTML(stateNLS);
          reusableContent.getChildren()[0].setAttribute("class", "obj-state " + stateNLS.toUpperCase().replace(/ /g, ''));
          if (typeof stateColor == 'string' && stateColor.length > 0) {
            reusableContent.getChildren()[0].setStyle("background-color", stateColor)
            if (stateColor === "#FFFFFF") {
              reusableContent.getChildren()[0].setStyle("color", "black")
              reusableContent.getChildren()[0].setStyle("border", "1px solid black")
            }
            else {
              reusableContent.getChildren()[0].setStyle("color", "#fff")
              reusableContent.getChildren()[0].setStyle("border", "none")
            }
          } else {
            reusableContent.getChildren()[0].setStyle("color", "black")
            reusableContent.getChildren()[0].setStyle("background-color", "transparent")
            reusableContent.getChildren()[0].setStyle("border", "none")
          }
          setStyle(reusableContent, stateNLS, "obj-state")
          reusableContent.computeContentSize = function () {
            const size = DomUtils.computeStringWidth(stateNLS, fontSize, 'Arial', false, false) + 30
            return parseInt(size);
          }
          cellInfos.cellView._setReusableContent(reusableContent);
        }
      }
    };

    const onHistoryDescriptionCellRequest = function (cellInfos) {
      let reusableContent;
      if (!cellInfos.isHeader) {
        reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_desc_');
        if (reusableContent) {
          const modifiedDesc = cellInfos.nodeModel.options.descToShoww
          const desc = cellInfos.nodeModel.options.modifiedDesc
          let descParts = ['', '', '', '', ''], phyId, objType, revID, revType
          //descPart - 5 parts - text link text link text
          reusableContent.getChildren()[0].getChildren()[1].removeEvents();
          reusableContent.getChildren()[0].getChildren()[3].removeEvents();
          if (modifiedDesc) {
            descParts = modifiedDesc.split('|~|');

            phyId = desc.physicalid //Desc link object ID
            objType = desc.type //Desc link object type
            const revisionedFrom = desc['revisionedFrom']
            if (revisionedFrom && Object.keys(revisionedFrom).length > 0) {
              revID = revisionedFrom.physicalid
              revType = revisionedFrom.type
            }

            const needOpenWith = !(widget.historyInNative)

            needOpenWith && objType && reusableContent.getChildren()[0].getChildren()[1].addEvent("click", event => clickLink(event, { id: phyId, type: objType, modifiedDesc: desc }));
            needOpenWith && revType && reusableContent.getChildren()[0].getChildren()[3].addEvent("click", event => clickLink(event, { id: revID, type: revType, modifiedDesc: desc.revisionedFrom }));

          }
          let titleText = (descParts[0] || "") + (descParts[1] || "") + (descParts[2] || "") + (descParts[3] || "")
          setStyle(reusableContent, titleText, "descCell")
          if (widget.historyInNative) {
            reusableContent.getChildren()[0].getChildren()[0].setText(titleText || "");
          } else {
            reusableContent.getChildren()[0].getChildren()[0].setText(descParts[0] || "");
            reusableContent.getChildren()[0].getChildren()[1].setText(descParts[1] || "");
            reusableContent.getChildren()[0].getChildren()[2].setText(descParts[2] || "");
            reusableContent.getChildren()[0].getChildren()[3].setText(descParts[3] || "");
          }
          reusableContent.computeContentSize = function () {
            const fullDesc = descParts[0] + " " + descParts[1] + " " + descParts[2] + " " + descParts[3]
            const size = DomUtils.computeStringWidth(fullDesc, fontSize, 'Arial', false, false) + 30
            return parseInt(size);
          }
          cellInfos.cellView._setReusableContent(reusableContent);
        }
      }
    };

    const getActionCellSemantics = cellInfos => {

      let { action, modifiedDesc } = cellInfos.nodeModel.options
      let overrideCheckValue = '';
      if (action == 'connect' || action == 'disconnect' || action == 'addPath' || action == 'addLink'){
        overrideCheckValue = modifiedDesc && modifiedDesc.relation || ""
      } else if (action == 'modifyAttribute') {
        overrideCheckValue = modifiedDesc.attribute || ""
      }
      action = (typeof action == 'string' && action.length > 0) ? action : "";
      action = action.charAt(0).toLowerCase() + action.slice(1); // Making first letter lower case
      const actionIcon = actionJSON[action + "." + overrideCheckValue] || actionJSON[action] || "";
      return {
        icon: actionIcon
      };
    }

    const getObjectTitleDetails = cellInfos => {
      const typeIcon = cellInfos.nodeModel.options.typeIcon
      return {
        icon: typeIcon
      };
    }

    const objDetailsColumn = {
      text: NLS.object,
      dataIndex: 'objectTitle',
      editableFlag: false,
      typeRepresentation: "string",
      width: 150,
      getCellSemantics: getObjectTitleDetails
    }

    const HistoryGridViewConfig = [
      {
        text: NLS.modifiedOn,
        dataIndex: 'tree',
        editableFlag: false,
        typeRepresentation: "string",
        width: 150,
        compareFunction: function (dateA, dateB) {
          const date1 = new Date(dateA);
          const date2 = new Date(dateB);
          if (date1.toString().indexOf('Invalid') < 0)
            return date1 - date2
          else
            return (dateA > dateB) ? 1 : -1
        }
      }, {
        text: NLS.date,
        dataIndex: 'date',
        editableFlag: false,
        typeRepresentation: "string",
        visibleFlag: false,
        width: 0
      },
      {
        text: NLS.modifiedBy,
        dataIndex: 'user',
        editableFlag: false,
        typeRepresentation: "user",
        width: 150,
        getCellValueForExport: function (cellInfos) {
          if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.user)
            return cellInfos.nodeModel.options.grid.user.label;
        }
        //onCellRequest: onHistoryUserCellRequest
      }, {
        text: NLS.action,
        dataIndex: 'action',
        editableFlag: false,
        typeRepresentation: "string",
        width: 120,
        getCellSemantics: getActionCellSemantics
        //onCellRequest: onActionUserCellRequest
      }, {
        text: NLS.maturityState,
        dataIndex: 'state',
        editableFlag: false,
        typeRepresentation: "string",
        width: 100,
        onCellRequest: onHistoryStateCellRequest
      }, {
        text: NLS.details,
        dataIndex: 'description',
        typeRepresentation: "string",
        editableFlag: false,
        onCellRequest: onHistoryDescriptionCellRequest,
        minWidth: 300
      }
    ];

    return isMultipleObjects => {
      const tempHistoryConfig = [...HistoryGridViewConfig]
      isMultipleObjects && tempHistoryConfig.splice(4, 0, objDetailsColumn)
      return tempHistoryConfig
    }

  });


define('DS/ENXHistoryUX/View/Grid/HistoryDataGrid', [
    'DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper',
    'DS/ENXHistoryUX/Config/HistoryGridViewConfig',
    'DS/ENXHistoryUX/Config/HistoryToolbarConfig'
],
    function (DataGridWrapper, HistoryGridViewConfig, HistoryToolbarConfig) {
        'use strict';

        let _toolbar, _dataGridInstance;

        const build = (model, datagridContainer, isMultipleObjects) => {
            const columnConfig = HistoryGridViewConfig(isMultipleObjects)
            const oldContainer = datagridContainer.querySelector('#detailsDataGridViewContainer');
			oldContainer && oldContainer.destroy();
            let _container = UWA.createElement('div', { id: 'detailsDataGridViewContainer', 'class': 'historydetails-data-grid-container showView' });
            let dataGridViewContainer = DataGridWrapper.build(model, columnConfig, HistoryToolbarConfig.writetoolbarDefinition(), _container);
            _toolbar = DataGridWrapper.dataGridViewToolbar();
            _dataGridInstance = DataGridWrapper.dataGridView();

            return dataGridViewContainer;

        }

        const getGridViewToolbar = () => {
            return _toolbar;
        };
    
        const getDataGridInstance = () => {
            return _dataGridInstance;
        };
    
        return {
            build,
            getGridViewToolbar,
            getDataGridInstance
        };

    });

define("DS/ENXHistoryUX/Config/HistoryToggleViews",
  ['DS/ENXHistoryUX/View/Grid/HistoryDataGrid',
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
  ], function (HistoryDataGrid, NLS) {
    "use strict";
    let gridViewClassName, tileViewClassName, viewIcon;
    return {

      /*
       * Method to change view from Grid View to Tile View Layout and vice-versa
       */

      doToggleView: function (args) {
        switch (args.curPage) {
          case "HistorySummary": gridViewClassName = ".historydetails-data-grid-container";
            tileViewClassName = ".historydetails-tile-view-container";
            viewIcon = HistoryDataGrid.getGridViewToolbar().getNodeModelByID("toggleView");
            break;

          default: console.log("Incorrect arguments in config file.");
        }

        if (args.view == "GridView") {
          viewIcon.options.grid.data.menu[0].state = "selected";
          viewIcon.options.grid.data.menu[1].state = "unselected";
          if (viewIcon && viewIcon.options.grid.semantics.icon.iconName != "view-list") {
            viewIcon.updateOptions({
              grid: {
                semantics: {
                  icon: {
                    iconName: "view-list"
                  }
                }
              },
              tooltip: NLS.gridView
            });
          }
          let gridView = document.querySelector(gridViewClassName);
          if (gridView) {
            gridView.removeClassName("hideView");
            gridView.removeClassName("nonVisible");
            gridView.addClassName("showView");
          }

          let tileView = document.querySelector(tileViewClassName);
          if (tileView) {
            tileView.removeClassName("showView");
            tileView.addClassName("hideView");
          }
        } else if (args.view == "TileView") {
          viewIcon.options.grid.data.menu[0].state = "unselected";
          viewIcon.options.grid.data.menu[1].state = "selected";
          if (viewIcon && viewIcon.options.grid.semantics.icon.iconName != "view-small-tile") {
            viewIcon.updateOptions({
              grid: {
                semantics: {
                  icon: {
                    iconName: "view-small-tile"
                  }
                }
              },
              tooltip: NLS.tileView
            });
          }
          let gridView = document.querySelector(gridViewClassName);
          if (gridView) {
            gridView.removeClassName("showView");
            gridView.addClassName("hideView");
          }

          let tileView = document.querySelector(tileViewClassName);
          if (tileView) {
            tileView.removeClassName("hideView");
            tileView.addClassName("showView");
          }
        }
      }
    };
  });

/* global define, widget */
/**
  * @overview History details Management - History Model
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENXHistoryUX/Model/HistoryGridModel',
    [
        'DS/TreeModel/TreeDocument',
        'DS/TreeModel/TreeNodeModel',
        'DS/ENXHistoryUX/Utilities/DataFormatter',
        'DS/ENXHistoryUX/Utilities/DataFormatterUtil',
        'DS/ENXHistoryUX/Components/Wrapper/DataGridWrapper',
        'DS/ENXHistoryUX/Controller/HistoryController',
        'DS/ENXHistoryUX/Utilities/FetchObjectDetails',
        'DS/ENXHistoryUX/Controller/HistoryBootstrap',
        'i18n!DS/ENXHistoryUX/assets/nls/ActionsNLS.json',
        'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
    ],
    function (
        TreeDocument,
        TreeNodeModel,
        DataFormatter,
        DataFormatterUtil,
        WrapperDataGridView,
        HistoryController,
        FetchObjectDetails,
        HistoryBootstrap,
        ActionsNLS,
        NLS
        
    ) {
        'use strict';
        let model = new TreeDocument({ useAsyncPreExpand: true });


        const getPathModel = (description, descriptionLink, descObject, currAction, details = {}) => ({
            grid: {
                time: "",
                date: "",
                "action": DataFormatterUtil.getAction(currAction, { modDesc: descObject }, details.fullName),
                "user": DataFormatterUtil.getUserDetails(details.fullName, details.userName),
                "state": "",
                "fullTime": "",
                "description": description,
                "descriptionToShow": descriptionLink,
                "objectTitle": ""
            },
            "descToShoww": descriptionLink,
            "modifiedDesc": descObject,
            "action": currAction
        })

        const createGridModel = (response, actionsToFilter) => {
            model = new TreeDocument({ useAsyncPreExpand: true });
            model.prepareUpdate();
            let actionsList = {};
            widget.historyPathIDs = {}
            widget.historyPathDetails = {}
            widget.historyLinkIDs = {}
            widget.historyLinkDetails = {}
            widget.addPathTimes = []
            widget.addLinkTimes = []
            widget.pathsProcessed = false
            widget.linksProcessed = false

            response.forEach(dataElem => {

                const formattedData = DataFormatter.gridData(dataElem)
                if (actionsToFilter.indexOf(formattedData.action) < 0) {
                    actionsList[formattedData.action] = 1
                }
                
                let hasChildren = undefined;
                if (dataElem.action == "addPath" || dataElem.action == "addLink") {
                    hasChildren = []
                    widget[`${dataElem.action}Times`].push(dataElem.time)
                }
                const root = new TreeNodeModel({
                    label: formattedData.time,
                    id: formattedData.time,
                    stateColor: dataElem.stateColor,
                    action: dataElem.action,
                    type: dataElem.type,
                    typeIcon: HistoryBootstrap.get3DSpaceURL() + "/common/images/" + dataElem.icon,
                    objectTitle: formattedData.objectTitle,
                    width: 300,
                    children: hasChildren,
                    grid: formattedData,
                    modifiedDesc: dataElem.modDesc || "",
                    descToShoww: formattedData.descriptionToShow || "",
                    objectPhyID: dataElem.objectPhyID,
                    shouldAcceptDrop: true
                });

                model.addRoot(root);
            });

            const extractAllIds = allObjs => {
                let allIDs = []
                allObjs.forEach(obj => {
                    const idList = obj.allIDs
                    idList.forEach(id => {
                        if(id.indexOf(',') > -1) {
                            allIDs.push(id.split(','))
                        } else {
                            allIDs.push(id)
                        }
                    })
                })
                return allIDs;
            }

            model.onPreExpand(function(modelEvent) {
                const nodeModel = modelEvent.target;
                const currAction = nodeModel._options.action
                if (!nodeModel.hasChildren() && (currAction == 'addPath' || currAction == 'addLink')) {
                    model.prepareUpdate();
                    const time = nodeModel._options.grid.fullTime
                    HistoryController.getPathDetails(nodeModel._options.objectPhyID, currAction).then(
                        resp => {
                            const pathObj = resp[time] || {}
                            const pathIds = pathObj && pathObj.allIDs
                            let allObjs = Object.values(resp) || {}
                            let allIDs = extractAllIds(allObjs)
                            FetchObjectDetails.getObjectDetails(allIDs.flat(), currAction).then(
                                () => {
                                    const actionType = currAction == 'addPath' ? "Path" :"Link"
                                    if (pathIds){
                                        const pathDetails = widget[`history${actionType}Details`]
                                        processPaths(pathIds, currAction, pathObj, nodeModel, pathDetails)
                                        /*pathIds.forEach(objID => {
                                            const det = pathDetails[objID]
                                            let pathModelObj;
                                            if (det && Object.keys(det).length > 0) {
                                                det.typeNLS = typeof det.typeNLS == 'string' ? det.typeNLS : det.type
                                                const modDesc = {
                                                    title: det.title,
                                                    name: det.name,
                                                    type: det.type,
                                                    typeNLS: det.typeNLS,
                                                    physicalid: det.physicalid,
                                                    revision: det.revision,
                                                    relation: pathObj.relType || ""
                                                }
                                                const desc = DataFormatterUtil.descForConnDiscon(modDesc, currAction)
                                                pathModelObj = getPathModel(
                                                    desc.desc,
                                                    desc.descToShow,
                                                    modDesc,
                                                    currAction,
                                                    pathObj
                                                )
                                            } else {
                                                pathModelObj = getPathModel(objID, objID, objID, currAction, pathObj)
                                            }
                                            const aNode = new TreeNodeModel(pathModelObj);
                                            nodeModel.addChild(aNode);
                                        })*/
                                    } else {
                                        const aNode = new TreeNodeModel({
                                            label: NLS[`no${actionType}Message`]
                                        });
                                        nodeModel.addChild(aNode);
                                    }
                                    nodeModel.pushUpdate();
                                    nodeModel.preExpandDone();
                                },
                                err => {
                                    nodeModel.preExpandDone();
                                }
                            )
                        },
                        _err => {
                            nodeModel.preExpandDone();
                        }
                    )
                } else {
                nodeModel.preExpandDone();
              }
            });	

            model.setFilterModel({
                state: {
                    filterId : 'set'
                },
                action: {
                    filterId : 'set',
                    filterModel: Object.keys(actionsList)
                },
                objectTitle : {
                    filterId : 'set'
                },
				user : {
					filterId : 'set'
				}
              });

            model.pushUpdate();
            return model;
        };

        const getPathTitle = (pathDetails, idArray) => {
            let name = "", title = "";
            idArray.forEach(id => {
                name += pathDetails[id].name + "/"
                title += pathDetails[id].title + "/"
            })
            name = name.substring(0, name.length - 1)
            title = title.substring(0, title.length - 1)
            return { name, title }
        }

        const processPaths = (pathIds, currAction, pathObj, nodeModel, pathDetails) => {
            pathIds.forEach(objID => {
                let id = objID
                let det = { ... pathDetails[id] }
                if (objID.indexOf(',') > -1) {
                    let idArray = objID.split(',')
                    id = idArray[idArray.length - 1]
                    det = { ...pathDetails[id] }
                    const { name, title } = getPathTitle(pathDetails, idArray)
                    //det.name = name;
                    det.title = title
                }
                const pathModelObj = getPathDescription(id, det, currAction, pathObj)
                const aNode = new TreeNodeModel(pathModelObj);
                nodeModel.addChild(aNode);
            })
        }

        const getPathDescription = (objID, det, currAction, pathObj) => {
            let pathModelObj;
            if (det && Object.keys(det).length > 0) {
                det.typeNLS = typeof det.typeNLS == 'string' ? det.typeNLS : det.type
                const modDesc = {
                    title: det.title,
                    name: det.name,
                    type: det.type,
                    typeNLS: det.typeNLS,
                    physicalid: det.physicalid,
                    revision: det.revision,
                    relation: pathObj.relType || ""
                }
                const desc = DataFormatterUtil.descForConnDiscon(modDesc, currAction)
                pathModelObj = getPathModel(
                    desc.desc,
                    desc.descToShow,
                    modDesc,
                    currAction,
                    pathObj
                )
            } else {
                pathModelObj = getPathModel(objID, objID, objID, currAction, pathObj)
            }
            return pathModelObj;
        }

        const getRowModelById = id => {
            return WrapperDataGridView.getRowModelById(model, id);
        };

        const destroy = () => {
            model = new TreeDocument({ useAsyncPreExpand: true });
            widget.historyPathIDs = {}
            widget.historyPathDetails = {}
            widget.historyLinkIDs = {}
            widget.historyLinkDetails = {}
            widget.addPathTimes = []
            widget.addLinkTimes = []
            widget.pathsProcessed = false
            widget.linksProcessed = false
        };

        return {
            createGridModel,
            getModel: () => model,
            getSelectedRowsModel: () => WrapperDataGridView.getSelectedRowsModel(model),
            getRowModelById,
            destroy
        };

    });


define('DS/ENXHistoryUX/View/Properties/HistoryPropWidget', [
    'DS/ENXHistoryUX/View/Grid/HistoryDataGrid',
    'DS/ENXHistoryUX/Controller/HistoryController',
    'DS/ENXHistoryUX/Model/HistoryGridModel',
    'DS/ENXHistoryUX/Utilities/PlaceHolder',
    'DS/ENXHistoryUX/Utilities/FetchObjectDetails',
    'DS/ENXHistoryUX/Utilities/Utils',
    'DS/ENXHistoryUX/Controller/HistoryBootstrap',
    'DS/ENXHistoryUX/Model/HistoryDataManipulation',
    'text!DS/ENXHistoryUX/assets/json/ActionOmissionList.json',
    'i18n!DS/ENXHistoryUX/assets/nls/ENXHistoryNLS'
],
    function (HistoryDataGrid, HistoryController, HistoryGridModel,
    PlaceHolder, FetchObjectDetails, Utils, HistoryBootstrap, HistoryDataManipulation, ActionOmissionList, NLS) {
        'use strict';

        const actionOmissionList = JSON.parse(ActionOmissionList)
        const objectsOmisionList = actionOmissionList['i3dxEntity']
        const connectionOmisionList = actionOmissionList['i3dxRelation']

        const getOmittedTypes = obj => {
            let types = [];
            if (typeof obj == 'object') {
                Object.keys(obj).forEach(key => {
                    if (obj[key].condition == "NONE") types.push(key)
                })
            }
            return types;
        }

        const removeOmittedTypes = data => {
            let finalData = []
            const omittedObjs = getOmittedTypes(objectsOmisionList);
            const omittedCons = getOmittedTypes(connectionOmisionList);
            if (data.length > 0){
                data.forEach(obj => {
                    const details = obj[Object.keys(obj)]
                    const curType = details && details.objProperties && details.objProperties.type || ""
                    const curObjType = details && details.objProperties && details.objProperties.objectType || ""
                    const allOmittedObjs = curObjType == 'bus' ? omittedObjs : curObjType == 'relationship' ? omittedCons : [ ...omittedObjs, ...omittedCons ]
                    if (allOmittedObjs.indexOf(curType) < 0) {
                        finalData.push(obj)
                    }
                })
            }
            return finalData
        }

        let showError = containerDiv => {
            if (!containerDiv) {
                containerDiv = new UWA.Element('div', { "class": "widget-container" });
                containerDiv.inject(widget.body);
            }
        }

        const _fetchHistorySuccess = (_success, datagridContainer) => {
            const success = removeOmittedTypes(_success)
            let isMultipleObjects = success.length > 1
            FetchObjectDetails.getTitleDetails(success).then(
                titleData => {
                    buildView(titleData, datagridContainer, isMultipleObjects);
                },
                _data => {
                    buildView({ initialDetails: success }, datagridContainer, isMultipleObjects);
                }
            )
        };

        const buildView = (data, datagridContainer, isMultipleObjects) => {
            const { response, actionsToFilter } = HistoryDataManipulation.getViewData(data);
            HistoryGridModel.createGridModel(response, actionsToFilter);
            let objDetails = {}
            try {
                objDetails = Object.values(data.initialDetails[0])[0].objProperties
            } catch(e) {
                objDetails = {}
            }
            drawHistorySummaryView(datagridContainer, isMultipleObjects, objDetails);
            Utils.removeLoader();
            
        }

        const drawHistorySummaryView = (datagridContainer, isMultipleObjects, objDetails) => {
            const model = HistoryGridModel.getModel();

            if (widget.historyInNative == true) {
                const oldContainer = datagridContainer.querySelector('#NativeTitleContainer');
			    oldContainer && oldContainer.destroy();
                const nativeTitleContainer = UWA.createElement('div', { id: 'NativeTitleContainer', 'class': 'native-title-container' });
                UWA.createElement('img', { src: HistoryBootstrap.get3DSpaceURL() + "/common/images/" + objDetails.icon }).inject(nativeTitleContainer)
                UWA.createElement('span', { text: objDetails.title }).inject(nativeTitleContainer);
                nativeTitleContainer.inject(datagridContainer)
            }

            const datagridDiv = HistoryDataGrid.build(model,datagridContainer, isMultipleObjects);
            //get the toolbar
            let homeToolbar = HistoryDataGrid.getGridViewToolbar();
            
            const oldContainer = datagridContainer.querySelector('#HistoryDataGridDivToolbar');
			oldContainer && oldContainer.destroy();
			
            //Add all the divs into the main container
            if (homeToolbar) {
                const toolBarContainer = UWA.createElement('div', { id: 'HistoryDataGridDivToolbar', 'class': 'toolbar-container' }).inject(datagridContainer);
                homeToolbar.inject(toolBarContainer);
            }
            //  that.containerDiv.appendChild(toolbarDiv); //Required if we are adding the toolbar directly, not on the datagrid view
            datagridDiv.inject(datagridContainer);

            if (model.getChildren().length == 0) {
                PlaceHolder.showEmptyHistoryPlaceholder(datagridContainer, model);
            } else {
                model.prepareUpdate();
                var count = 0;
                model.getChildren().forEach(node => { if (node._isHidden) count++; })
                model.pushUpdate();
            }
            widget.historyEvent.publish('history-widgetTitle-count-update', { model });
            if (model.getRoots().length == 1) {
                setTimeout(() => 
                    widget.historyEvent.publish('history-DataGrid-on-dblclick', { model: model.getRoots()[0].options.grid }),
                    0
                )
            }
            // PlaceHolder.registerListeners();
            return datagridContainer;
        };

        const _fetchHistoryFailure = function (failure, datagridContainer) {
            const containerDiv = datagridContainer
            showError(containerDiv);

            Utils.removeLoader();
    
            var failureJson = '';
            try {
                failureJson = JSON.parse(failure);
            } catch (err) {
                //DO Nothing
            }
    
            if (failureJson.error) {
                widget.historyNotifications.handler().addNotif({
                    level: 'error',
                    subtitle: failureJson.error,
                    sticky: false
                });
            } else {
                widget.historyNotifications.handler().addNotif({
                    level: 'error',
                    subtitle: NLS.infoRefreshError,
                    sticky: false
                });
            }
        };

        const build = (historyDiv, data) => {

            //let filteredData = removeOmittedTypes(data);
            
            Utils.showLoader();
            HistoryController.fetchHistoryById(data).then(
                success => {
                    _fetchHistorySuccess(success, historyDiv, data);
                },
                failure => {
                   _fetchHistoryFailure(failure, historyDiv);
                });
        }

        return { build }

    });

define('DS/ENXHistoryUX/View/HistoryFacet',
    ['DS/ENXHistoryUX/View/Properties/HistoryPropWidget',
    'DS/ENXHistoryUX/View/Dialog/HistoryDefaultDialog',
    'DS/ENXHistoryUX/Components/HistoryEvent',
    'DS/ENXHistoryUX/Components/HistoryNotifications',
    'DS/ENXHistoryUX/Controller/HistoryBootstrap',
    'DS/Windows/ImmersiveFrame',
    'css!DS/ENXHistoryUX/ENXHistoryUX.css'],
    function (HistoryPropWidget, HistoryDefaultDialog, HistoryEvent, HistoryNotifications, HistoryBootstrap, ImmersiveFrame) {
        'use strict';

        let containerDiv, historyDiv, destroyFrame, onCloseCallback

        const initBootstrap = data => new Promise(async resolve => {
            await HistoryBootstrap.start(data)
            resolve()
        })


        const init = function (data = {}, container) {

            destroy(container);
            if(typeof widget == 'undefined') {
				window.widget = { data:  {}, pref: {} }
                widget.setValue = (id, value) => widget[id] = value
                widget.getValue = id => widget[id]
                widget.setPreference = (id, value) => widget.pref[id] = value
                widget.getPreference = id => widget.pref[id]
			}

            if (data && data.mode && data.mode == "webinwin") {
                widget.historyInNative = true
            } else {
                widget.historyInNative = false
            }
            
            widget.HistoryCredentials = {}
            widget.historyEvent = new HistoryEvent();
            widget.historyNotifications = new HistoryNotifications();

            if (typeof data.facetLang == 'string') {
                widget.facetLang = data.facetLang
            }

            if (!showView()) {
                historyDiv = UWA.createElement('div', { id: 'HistoryFacet', 'class': 'historyfacet-properties-container' });
                
            } else {
                historyDiv = document.getElementById('HistoryFacet')
                typeof historyDiv.destroy == 'function' && historyDiv.destroy()
            }
            if (container instanceof Element || container instanceof HTMLDocument) {
                containerDiv = container
            } else if (typeof container == typeof new ImmersiveFrame()) {
                const { dialogDetailsContainer, destroyContainer } = HistoryDefaultDialog.getDialog(container)
                containerDiv = dialogDetailsContainer
                destroyFrame = destroyContainer
            } else {
                const { dialogDetailsContainer, destroyContainer } = HistoryDefaultDialog.getDialog()
                containerDiv = dialogDetailsContainer
                destroyFrame = destroyContainer
            }

            widget.historyEvent.subscribe('history-window-closed', () => {
                typeof destroyFrame == "function" && destroyFrame();
                typeof onCloseCallback == "function" && onCloseCallback();
            })

            historyDiv.inject(containerDiv)
            widget.HistoryCredentials.securityContext = data.securityContext
            initBootstrap(data).then(() => HistoryPropWidget.build(historyDiv, data))
        };

        const hideView = function () {
            if (document.getElementById('HistoryFacet') != null) {
                document.getElementById('HistoryFacet').style.display = 'none';
            }
        };

        const showView = function () {
            if (document.querySelector('#HistoryFacet') != null) {
                document.getElementById('HistoryFacet').style.display = 'block';
                return true;
            }
            return false;
        };

        const destroy = container => {
            let HistoryFacetContainer = document.querySelector('#HistoryFacet')

            if (container && typeof container.querySelector == 'function')
                HistoryFacetContainer = container.querySelector('#HistoryFacet') || null

            if (HistoryFacetContainer && typeof HistoryFacetContainer.destroy == 'function')
                HistoryFacetContainer.destroy();

        };

        let HistoryFacet = {
            init,
            showView,
            hideView,
            destroy
        };

        return HistoryFacet;
    });


