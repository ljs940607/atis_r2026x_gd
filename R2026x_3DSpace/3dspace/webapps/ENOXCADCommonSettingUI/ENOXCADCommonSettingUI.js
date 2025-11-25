/*global define, widget*/

define('DS/ENOXCADCommonSettingUI/Views/XCADCommonSettingViewUtilities', [
    'UWA/Core',
    'DS/UIKIT/Modal',
    'DS/UIKIT/Input/Button',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCommonSettingViewNLS'
], function(
    UWA,
    Modal,
    Button,
    XCADCommonSettingViewNLS) {

    'use strict';

    var commonSettingsViewUtil = {

        createContentDiv: function() {
            const contentDiv = UWA.createElement('div', {
                'id': 'commonSettingMainDiv',
                'class': 'commonSettingMainDiv'
            });

            const widgetHeight = widget.getViewportDimensions().height;
            contentDiv.setStyle('height', widgetHeight - 250 + 'px');

            return contentDiv;
        },

        createInfoDiv: function() {
            const introDiv = UWA.createElement('div', {
                'id': 'commonSettingInfoDiv',
                'class': 'commonSettingInfoDiv'
            });

            UWA.createElement("br", {}).inject(introDiv);

            UWA.createElement('p', {
                text: XCADCommonSettingViewNLS.IntroductionText,
                'class': 'font-3dslight',
                styles: {
                    'margin-left': '20px'
                }
            }).inject(introDiv);

            return introDiv;
        },

        createApplyResetToolbar: function(activateApplyBtn, applyParams, resetParams) {
            const applyResetDiv = UWA.createElement('div', {
                'id': 'commonSettingApplyResetDiv',
                'class': 'commonSettingApplyResetDiv'
            });

            const tableButtons = UWA.createElement('table', {
                'class': '',
                'id': 'applyResetTable',
                'width': '100%'
            }).inject(applyResetDiv);

            const lineButtons = UWA.createElement('tr').inject(tableButtons);

            if (activateApplyBtn === true) {
                const buttonApplyCell = UWA.createElement('td', {
                    'width': '50%',
                    'Align': 'left'
                }).inject(lineButtons);

                const applyBttn = new Button({
                    className: 'primary',
                    id: 'commonSettingApplyButton',
                    icon: 'export',
                    attributes: {
                        disabled: false,
                        title: XCADCommonSettingViewNLS.ApplyTooltipText,
                        text: XCADCommonSettingViewNLS.ApplyText
                    },
                    events: {
                        onClick: function() {
                            applyParams();
                        }
                    }
                }).inject(buttonApplyCell);

                applyBttn.getContent().setStyle("width", 130);
            }

            const buttonResetCell = UWA.createElement('td', {
                'width': '50%',
                'Align': 'right'
            }).inject(lineButtons);

            const resetBbttn = new Button({
                className: 'warning',
                id: 'commonSettingResetButton',
                icon: 'loop',
                attributes: {
                    disabled: false,
                    title: XCADCommonSettingViewNLS.ResetTooltipText,
                    text: XCADCommonSettingViewNLS.ResetText
                },
                events: {
                    onClick: function() {
                        resetParams();
                    }
                }
            }).inject(buttonResetCell);

            resetBbttn.getContent().setStyle("width", 130);

            return applyResetDiv;
        }
    };

    return commonSettingsViewUtil;
});

define('DS/ENOXCADCommonSettingUI/utils/AlertMessage', [
  'DS/UIKIT/Alert'
], function (Alert) {
  'use strict';

  return new Alert({
    className: 'param-alert',
    closable: true,
    visible: true,
    renderTo: document.body,
    autoHide: true,
    hideDelay: 3000,
    messageClassName: 'warning'
  });
});

/*global define*/
define('DS/ENOXCADCommonSettingUI/Model/XCADCommonSettingModel',
    [
        'UWA/Class/Model'
    ], function (Model) {
        "use strict";
        return Model.extend({
            defaults: function() {
                return {
                    id: ''
                };
            }
        });
    });

/*global define*/

define('DS/ENOXCADCommonSettingUI/Model/XCADCustomTableRowModel', [
    'UWA/Class/Model'
], function(Model) {

    'use strict';

    var customTableRowModel = Model.extend({
        setup: function() {
            // console.log('XCADCustomTablesRowModel has been set up.');
        }
    });

    return customTableRowModel;
});

define('DS/ENOXCADCommonSettingUI/utils/URLHandler', [], function () {
  'use strict';

  var urlHandler = {
    init: function (url, tenant) {
      this.url = url;
      this.tenant = tenant;
    },

    setURL: function (url) {
      this.url = url;
    },

    getURL: function () {
      return this.url;
    },

    getTenant: function () {
      return this.tenant;
    },

    setTenant: function (itenant) {
      this.tenant = itenant;
    }
  };

  return urlHandler;
});

/*eslint-disable no-console*/
/*global widget*/

define('DS/ENOXCADCommonSettingUI/utils/CustomTableWS', [
    'DS/WAFData/WAFData',
    'DS/ENOXCADCommonSettingUI/utils/URLHandler'
], function(
    WAFData,
    URLHandler) {

    'use strict';

    var customTableWS = {

        // to handle AJAX call to server
        deleteCustomTable: function(customTableName) {

            const url = URLHandler.getURL() +
                '/resources/xcadcommonsetting/services/customtable/delete/' + customTableName +
                '?tenant=' + URLHandler.getTenant();

            return new Promise((resolve, reject) => {

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'DELETE',
                    type: 'json',
                    // proxy: 'passport',
                    // data: undefined,

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(error, response) {
                        if (response)
                            console.log('Error from server side while deleting custom table: ', response.errorMessage);

                        return reject(response);
                    },

                    onComplete: function(response) {
                        return resolve(response);
                    }
                });
            });
        },

        //Get GCO List
        getGCOList: function() {

            const url = URLHandler.getURL() +
                '/resources/xcadparam/gco/list' +
                '?tenant=' + URLHandler.getTenant();

            return new Promise((resolve, reject) => {

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'GET',
                    type: 'json',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(error, response) {
                        if (response)
                            console.log('Error from server side while getting GCO list: ', response.errorMessage);

                        return reject(response);
                    },

                    onComplete: function(response) {
                        return resolve(response);
                    }
                });
            });
        },

        //get GCO mapped types
        getGCOMappedTypes: function(integration) { 

            const url = URLHandler.getURL() +
                '/resources/xcadparam/gco/gettype' +
                '?integration=' + integration + 
                '&tenant=' + URLHandler.getTenant();

            return new Promise((resolve, reject) => {

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'GET',
                    type: 'json',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(error, response) {
                        if (response)
                            console.log('Error from server side while getting GCO mapped type list: ', response.errorMessage);

                        return reject(response);
                    },

                    onComplete: function(response) {
                        return resolve(response);
                    }
                });
            });
        },

        getExtensionList: function(integration) { 

            const url = URLHandler.getURL() +
                '/resources/xcadparam/gco/get' +
                '?integration=' + integration + 
                '&tenant=' + URLHandler.getTenant();

            return new Promise((resolve, reject) => {

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'GET',
                    type: 'json',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(error, response) {
                        if (response)
                            console.log('Error from server side while getting extension list: ', response.errorMessage);

                        return reject(response);
                    },

                    onComplete: function(response) {
                        return resolve(response);
                    }
                });
            });
        },

        getAttributesofExtension: function(integration, extension) { 

            const url = URLHandler.getURL() +
                '/resources/xcadparam/gco/attributesofextension' + 
                '?integration=' + integration +
                '&extension=' + extension + 
                '&tenant=' + URLHandler.getTenant();

            return new Promise((resolve, reject) => {

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'GET',
                    type: 'json',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(error, response) {
                        if (response)
                            console.log('Error from server side while getting attribute list: ', response.errorMessage);

                        return reject(response);
                    },

                    onComplete: function(response) {
                        return resolve(response);
                    }
                });
            });
        },
    };

    return customTableWS;

});

/*eslint no-unused-vars: "off"*/
/*eslint no-useless-call: "off"*/
/*global define, widget*/

define('DS/ENOXCADCommonSettingUI/Views/XCADConnectorOrderParamViewUtilities', [
    'UWA/Core',
    'DS/Controls/SelectionChips',
    'DS/UIKIT/Accordion',
    'DS/UIKIT/Popover',
    'DS/UIKIT/Mask',
    'DS/UIKIT/Input/Button',
    'DS/WAFData/WAFData',
    'DS/ENOXCADCommonSettingUI/utils/URLHandler',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADConnectorOrderParamViewNLS'
], function(
    UWA,
    SelectionChips,
    Accordion,
    Popover,
    Mask,
    Button,
    WAFData,
    URLHandler,
    AlertMessage,
    XCADConnectorOrderParamViewNLS) {

    'use strict';

    var UIview = {

        createContentDiv: function() {
            var contentDiv = UWA.createElement('div', {
                'id': 'paramConnectorOrderDiv'
            });

            return contentDiv;
        },

        createParamMainDiv: function(parentDiv) {
            var paramMainDiv = UWA.createElement('div', {
                'id': 'paramMainDiv'
            }).inject(parentDiv);

            return paramMainDiv;
        },

        createParamTable: function(parentDiv) {
            var paramTable = UWA.createElement('table', {
                'class': 'connectorOrderTable table table-condensed'
            }).inject(parentDiv);

            return paramTable;
        },

        createParamTableBody: function(parentDiv) {
            var paramTableBody = UWA.createElement('tbody', {
                'class': 'fparamtbody'
            }).inject(parentDiv);

            return paramTableBody;
        },

        createFamilyUIKITAccordion: function(paramTable) {
            var iAccord = new Accordion({
                className: 'styled divided filled',
                exclusive: false,
                items: []
            });

            iAccord.addItem({
                title: XCADConnectorOrderParamViewNLS.ConnectorOrderAccordText,
                content: paramTable,
                selected: true,
                name: "ConnectorOrderAccord"
            });

            return iAccord;
        },

        buildConnectorOrderTableHeading: function() {
            const lineTitle = UWA.createElement('tr', {
                'class': 'success'
            });

            var iCell = UWA.createElement('td', {
                align: 'left',
                width: '30%'
            }).inject(lineTitle);

            UWA.createElement('h5', {
                text: XCADConnectorOrderParamViewNLS.ColumnParamNameHeader
            }).inject(iCell);

            iCell = UWA.createElement('td', {
                align: 'left',
                width: '10%'
            }).inject(lineTitle);

            UWA.createElement('h5', {
                text: XCADConnectorOrderParamViewNLS.ColumnParamInfoHeader
            }).inject(iCell);

            iCell = UWA.createElement('td', {
                align: 'left',
                width: '40%'
            }).inject(lineTitle);

            UWA.createElement('h5', {
                text: XCADConnectorOrderParamViewNLS.ColumnParamValueHeader
            }).inject(iCell);

            iCell = UWA.createElement('td', {
                'Align': 'center',
                'width': '10%'
            }).inject(lineTitle);

            UWA.createElement('h5', {
                text: XCADConnectorOrderParamViewNLS.ColumnParamActionsHeader
            }).inject(iCell);

            iCell = UWA.createElement('td', {
                align: 'center',
                width: '10%'
            }).inject(lineTitle);

            UWA.createElement('h5', {
                text: XCADConnectorOrderParamViewNLS.ColumnParamDeployStatusHeader
            }).inject(iCell);

            return lineTitle;
        },

        addConnectorOrderParamRow: function(model, tableBody) {
            const that = this;

            const connectorOrderParamRow = UWA.createElement('tr');

            const cellParamName = UWA.createElement('td', {
                width: '30%',
                align: 'left'
            }).inject(connectorOrderParamRow);

            UWA.createElement('p', {
                text: XCADConnectorOrderParamViewNLS.ParamConnectorOrderName,
                'class': ''
            }).inject(cellParamName);

            const cellParamInfo = UWA.createElement('td', {
                width: '10%',
                align: 'left'
            }).inject(connectorOrderParamRow);

            const imgInfoSpan = UWA.createElement('span', {
                'class': 'fonticon fonticon-info'
            }).inject(cellParamInfo);

            imgInfoSpan.setStyle('color', 'black');

            const popOver = new Popover({
                target: imgInfoSpan,
                trigger: 'hover',
                animate: 'true',
                position: 'top',
                body: XCADConnectorOrderParamViewNLS.ParamConnectorOrderInfoTooltip,
                title: ''
            });

            const cellParamValue = UWA.createElement('td', {
                width: '40%',
                align: 'left'
            }).inject(connectorOrderParamRow);

            const paramValueTable = UWA.createElement('table', {
                'class': 'table table-condensed',
                id: 'paramValueTable'
            }).inject(cellParamValue);

            const selectionChipChildRow = UWA.createElement('tr').inject(paramValueTable);

            const cellSelectionChips = UWA.createElement('td', {
                width: '100%',
                colspan: 2
            }).inject(selectionChipChildRow);

            const rangeLabels = model.get('rangeLabels');
            let ranges = model.get('ranges');
            let valuesFromDB = model.get('valuesFromDB');

            that.selectionChips = that.getSelectionChips(
                rangeLabels,
                ranges,
                valuesFromDB
            );
            that.selectionChips.inject(cellSelectionChips);

            that.selectionChipsBackup = that.selectionChips.getAllChipsOptions();

            that.selectionChips.addEventListener('change', function() {
                let addedChips = that.selectionChips.getAllChipsOptions();

                let addedChipsValues = addedChips.map(function(el) {
                    return el.value;
                });

                valuesFromDB = model.get('valuesFromDB');
                ranges = model.get('ranges');

                if ((valuesFromDB.length > 0 && valuesFromDB.every(elem => addedChipsValues.includes(elem))) ||
                    (valuesFromDB.length === 0 && ranges.every(elem => addedChipsValues.includes(elem)))) {
                    that.selectionChipsBackup = that.selectionChips.getAllChipsOptions();
                    model.set('valuesFromUI', addedChipsValues);
                } else {
                    AlertMessage.add({
                        className: 'error',
                        message: XCADConnectorOrderParamViewNLS.XCADCanNotBeRemoved
                    });

                    that.selectionChips._preventEventsCpt++;
                    that.selectionChips.removeAllChips();
                    that.selectionChips.addChips(that.selectionChipsBackup);
                    that.selectionChips._preventEventsCpt--;
                }
            });

            that.cellParamActions = UWA.createElement('td', {
                width: '10%',
                align: 'center'
            }).inject(connectorOrderParamRow);

            let deployStatus = model.get('deployStatus');

            if (deployStatus !== 'NotDeployed') {
                that.createDeleteActionsIcon(model, that.cellParamActions);
            }

            that.cellParamDeployStatus = UWA.createElement('td', {
                width: '10%',
                align: 'right'
            }).inject(connectorOrderParamRow);

            that.buildDeployStatusCell(deployStatus).inject(that.cellParamDeployStatus);

            connectorOrderParamRow.inject(tableBody);
        },

        buildDeployStatusCell: function(deployStatus) {
            const iconSize = '1';
            let imgClass, imgTitle, iconColor;

            switch (deployStatus) {
                case 'Deployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-check';
                    imgTitle = XCADConnectorOrderParamViewNLS.DeployedStatusText;
                    iconColor = 'green';
                    break;
                case 'NotDeployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-cog';
                    imgTitle = XCADConnectorOrderParamViewNLS.NotDeployedStatusText;
                    iconColor = 'orange';
                    break;
                case 'NewNotDeployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-cog';
                    imgTitle = XCADConnectorOrderParamViewNLS.NewValueNotDeployedStatusText;
                    iconColor = 'black';
                    break;
                case 'InvalidValueCanNotDeploy':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-wrong';
                    imgTitle = XCADConnectorOrderParamViewNLS.InvalidValueDeployStatusText;
                    iconColor = 'red';
                    break;
                default:
                    break;
            }

            const imgCell = UWA.createElement('td', {
                id: 'connectorOrderParamDeployStatus',
                width: '15%',
                align: 'center',
                title: imgTitle
            });

            const imgSpan = UWA.createElement('span', {
                'class': imgClass
            }).inject(imgCell);

            imgSpan.setStyle('color', iconColor);
            imgCell.setStyle('vertical-align', 'text-bottom');
            imgCell.setStyle('min-width', '46px');

            return imgCell;
        },

        getSelectionChips: function(rangeLabels, ranges, valuesFromDB) {
            const selectionChips = new SelectionChips({
                displayMenu: false,
                fireOnlyFromUIInteractionFlag: true
            });

            if (valuesFromDB.length > 0) {
                for (let i = 0; i < valuesFromDB.length; i++) {
                    if (ranges.includes(valuesFromDB[i])) {
                        let index = ranges.indexOf(valuesFromDB[i]);
                        selectionChips.addChip({
                            label: rangeLabels[index],
                            value: ranges[index]
                        });
                    }
                }
            } else {
                for (let i = 0; i < ranges.length; i++) {
                    selectionChips.addChip({
                        label: rangeLabels[i],
                        value: ranges[i]
                    });
                }
            }

            selectionChips.getContent().setStyles({
                width: '100%',
                height: 'auto',
                'min-height': '50px'
            });

            return selectionChips;
        },

        resetConnectorOrderParam: function(paramModel) {
            var that = this;
            let valuesFromUI = paramModel.get('valuesFromUI');
            let valuesFromDB = paramModel.get('valuesFromDB');
            let ranges = paramModel.get('ranges');
            let rangeLabels = paramModel.get('rangeLabels');

            if (valuesFromUI !== valuesFromDB) {
                that.selectionChips.removeAllChips();
                if (valuesFromDB.length > 0) {
                    for (let i = 0; i < valuesFromDB.length; i++) {
                        if (ranges.includes(valuesFromDB[i])) {
                            let index = ranges.indexOf(valuesFromDB[i]);
                            that.selectionChips.addChip({
                                label: rangeLabels[index],
                                value: ranges[index]
                            });
                        }
                    }
                    paramModel.set('deployStatus', 'Deployed');
                } else {
                    for (let i = 0; i < ranges.length; i++) {
                        that.selectionChips.addChip({
                            label: rangeLabels[i],
                            value: ranges[i]
                        });
                    }
                    paramModel.set('deployStatus', 'NotDeployed');
                }
            }
        },

        createDeleteActionsIcon: function(paramModel, actionCell) {
            var that = this;
            var deleteSpan, deleteButton, deletePop;

            deleteSpan = UWA.createElement('span');
            deleteButton = new Button({
                className: 'close',
                icon: 'fonticon fonticon-trash fonticon-1.5x',
                attributes: {
                    disabled: false,
                    'aria-hidden': 'true'
                }
            }).inject(deleteSpan);

            deletePop = new Popover({
                target: deleteSpan,
                trigger: "hover",
                animate: "true",
                position: "top",
                body: XCADConnectorOrderParamViewNLS.deleteCADSequencing,
                title: ''
            });

            deleteSpan.inject(actionCell);

            deleteButton.addEvent("onClick", function() {
                that.deleteCADSequencingParams(paramModel);
            });
        },

        deleteCADSequencingParams: function(paramModel) {
            const that = this;

            let datatoSend = {};
            let contentDiv = document.getElementById("commonSettingMainDiv");
            Mask.mask(contentDiv);
            var url = URLHandler.getURL() + "/resources/xcadcommonsetting/services/cadsequencing/delete?tenant=" + URLHandler.getTenant();

            WAFData.authenticatedRequest(url, {
                timeout: 250000,
                method: 'POST',
                data: JSON.stringify(datatoSend),
                type: 'json',
                //proxy: 'passport',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': widget.lang
                },

                onFailure: function(json) {
                    that.onDeleteFailure.call(that, json);
                },

                onComplete: function(json) {
                    that.onDeleteSuccess.call(that, json, paramModel);
                }
            });
        },

        onDeleteFailure: function(json) {
            let contentDiv = document.getElementById("commonSettingMainDiv");
            Mask.unmask(contentDiv);
            AlertMessage.add({
                className: "error",
                message: XCADConnectorOrderParamViewNLS.deleteErrorMessage
            });
        },

        onDeleteSuccess: function(json, paramModel) {
            const that = this;
            let ranges = paramModel.get('ranges');
            let rangeLabels = paramModel.get('rangeLabels');

            that.selectionChips.removeAllChips();

            for (let i = 0; i < ranges.length; i++) {
                that.selectionChips.addChip({
                    label: rangeLabels[i],
                    value: ranges[i]
                });
            }

            paramModel.set('deployStatus', 'NotDeployed');
            paramModel.set('valuesFromDB', []);
            paramModel.set('valuesFromUI', ranges);

            let contentDiv = document.getElementById("commonSettingMainDiv");
            Mask.unmask(contentDiv);

            AlertMessage.add({
                className: "success",
                message: XCADConnectorOrderParamViewNLS.deleteSuccessMessage
            });
        }
    };

    return UIview;
});

/*global define, WUXManagedFontIcons*/

define('DS/ENOXCADCommonSettingUI/utils/CustomTablesUtil', [
    'UWA/Core',
    'DS/UIKIT/Accordion',
    'DS/Controls/Button',
    'DS/Controls/LineEditor',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCustomTablesNLS'
], function(
    UWA,
    Accordion,
    WUXButton,
    WUXLineEditor,
    AlertMessage,
    XCADCustomTablesNLS) {

    'use strict';

    var customTablesUtil = {

        createContentDiv: function() {
            const contentDiv = UWA.createElement('div', {
                'id': 'customTablesMainDiv'
            });

            return contentDiv;
        },

        createTableDiv: function() {
            const tableDiv = UWA.createElement('div', {
                'id': 'customTablesTableDiv'
            });

            // tableDiv.setStyle('height', '100%');
            return tableDiv;
        },

        createTable: function() {
            const table = UWA.createElement('table', {
                'id': 'customTablesTable',
                'class': 'customTablesTable table table-condensed'
            });

            return table;
        },

        createTableBody: function() {
            const tableBody = UWA.createElement('tbody', {
                'id': 'customTablesTableBody',
                'class': 'fparamtbody'
            });

            return tableBody;
        },

        createTableHeader: function() {
            const headerRow = UWA.createElement('tr', {
                'id': 'customTablesHeaderRow',
                'class': 'success'
            });

            const nameCell = UWA.createElement('td', {
                align: 'left',
                width: '30%'
            }).inject(headerRow);

            UWA.createElement('h5', {
                text: XCADCustomTablesNLS.nameColumnHeader
            }).inject(nameCell);

            const infoCell = UWA.createElement('td', {
                align: 'left',
                width: '10%'
            }).inject(headerRow);

            UWA.createElement('h5', {
                text: XCADCustomTablesNLS.infoColumnHeader
            }).inject(infoCell);

            const valueCell = UWA.createElement('td', {
                align: 'left',
                width: '40%'
            }).inject(headerRow);

            UWA.createElement('h5', {
                text: XCADCustomTablesNLS.valueColumnHeader
            }).inject(valueCell);

            const actionsCell = UWA.createElement('td', {
                align: 'center',
                width: '10%'
            }).inject(headerRow);

            UWA.createElement('h5', {
                text: XCADCustomTablesNLS.actionsColumnHeader
            }).inject(actionsCell);

            const deployStatusCell = UWA.createElement('td', {
                align: 'center',
                width: '10%'
            }).inject(headerRow);

            UWA.createElement('h5', {
                text: XCADCustomTablesNLS.deployStatusColumnHeader
            }).inject(deployStatusCell);

            return headerRow;
        },

        createAccordion: function(paramTable) {
            var accordion = new Accordion({
                className: 'styled divided filled',
                exclusive: false,
                items: []
            });

            accordion.addItem({
                title: XCADCustomTablesNLS.customTablesAccordText,
                content: paramTable,
                selected: true,
                name: 'customTablesAccordion'
            });

            return accordion;
        },

        createAddNewTableButton: function() {
            const addCustomTableButton = new WUXButton({
                displayStyle: 'normal',
                emphasize: 'primary',
                icon: {
                    iconName: 'plus',
                    fontIconFamily: WUXManagedFontIcons.Font3DS
                },
                showLabelFlag: false
            });

            addCustomTableButton.getContent().title = XCADCustomTablesNLS.addCustomTableTooltip;
            addCustomTableButton.getContent().setStyle('margin-top', '8px');
            addCustomTableButton.getContent().setStyle('margin-left', '8px');

            return addCustomTableButton;
        },

        createNameLabel: function() {
            const nameDiv = new UWA.Element('div');

            const divStyle = {
                display: 'flex',
                'align-items': 'baseline',
                'flex-flow': 'row',
                width: '100%'
            };

            nameDiv.setStyles(divStyle);

            const nameSpan = new UWA.Element('span', {
                text: XCADCustomTablesNLS.nameLabel + ':'
            });

            const labelStyle = {
                flex: '30%',
                'font-weight': 'bold'
            };

            nameSpan.setStyles(labelStyle);
            nameSpan.inject(nameDiv);

            return nameDiv;
        },

        createNameLineEditor: function() {
            const nameLineEditor = new WUXLineEditor({
                id: 'customTableNameLineEditor',
                placeholder: XCADCustomTablesNLS.nameEditorPlaceholder,
                pattern: '[a-zA-Z0-9]+',
                sizeInCharNumber: 30,
                displayClearFieldButtonFlag: true,
                selectAllOnFocus: true,
                requiredFlag: true
            });

            const valueStyle = {
                width: '100%',
                flex: '70%',
                'margin-left': '15px'
            };

            nameLineEditor.getContent().setStyles(valueStyle);

            return nameLineEditor;
        }
    };

    return customTablesUtil;
});

define('DS/ENOXCADCommonSettingUI/Views/AddColumnDialog', [
    'UWA/Core',
    'DS/Controls/Button',
    'DS/Windows/Dialog',
    'DS/Windows/ImmersiveFrame',
    'DS/Controls/ComboBox',
    'DS/ENOXCADCommonSettingUI/utils/CustomTableWS',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCustomTablesNLS'
], function (
    UWA,
    WUXButton,
    WUXDialog,
    WUXImmersiveFrame,
    WUXComboBox,
    CustomTableWS,
    AlertMessage,
    XCADCustomTablesNLS) {

    'use strict';

    var addColumnDialog = {

        createAddColumnFrame: async function (rangeLabels, rangeValues, selectionChips) {
            const that = this;

            const immersiveFrame = new WUXImmersiveFrame({
                identifier: 'addColumnFrame'
            });

            const mainContainer = new UWA.Element('div');

            const GCOSpan = new UWA.Element('span').setStyles({ marginRight: '5px' });;
            GCOSpan.inject(mainContainer);

            const GCODiv = that.createGCOLabel();
            GCODiv.inject(GCOSpan);

            that.GCOCombo = await that.createGCOCombo();
            that.GCOCombo.inject(GCODiv);

            const typeSpan = new UWA.Element('span').setStyles({ marginRight: '5px' });;
            typeSpan.inject(mainContainer);

            const typeDiv = that.createTypeLabel();
            typeDiv.inject(typeSpan);

            that.typeCombo = await that.createTypeCombo();
            that.typeCombo.inject(typeDiv);

            const extSpan = new UWA.Element('span').setStyles({ marginRight: '5px' });;
            extSpan.inject(mainContainer);

            const extDiv = that.createExtLabel();
            extDiv.inject(extSpan);

            that.extCombo = await that.createExtCombo();
            that.extCombo.inject(extDiv);

            const attrSpan = new UWA.Element('span').setStyles({ marginRight: '5px' });;
            attrSpan.inject(mainContainer);

            const attrDiv = that.createAttrLabel();
            attrDiv.inject(attrSpan);

            that.attrCombo = that.createAttrCombo(rangeLabels, rangeValues);
            that.attrCombo.inject(attrDiv);

            // Add column dialog
            const modalDialog = new WUXDialog({
                immersiveFrame: immersiveFrame,
                title: XCADCustomTablesNLS.addColumnModalDialogTitle,
                content: mainContainer,
                identifier: 'addNewColumnModalDialog',
                autoCloseFlag: false,
                modalFlag: true,
                resizableFlag: false,
                buttons: {
                    Ok: new WUXButton({
                        label: XCADCustomTablesNLS.addColumnOkButtonLabel,
                        onClick: function () {
                            that.okButtonOnClickHandler(selectionChips, immersiveFrame);
                        }
                    }),
                    Cancel: new WUXButton({
                        label: XCADCustomTablesNLS.addColumnCancelButtonLabel,
                        onClick: function () {
                            immersiveFrame.destroy();
                        }
                    })
                }
            });
            modalDialog.addEventListener('close', function () {
                immersiveFrame.destroy();
            });
            return immersiveFrame;
        },

        createGCOLabel: function () {
            const gcoLabelDiv = new UWA.Element('div');
            const divStyle = {
                'display': 'flex',
                'align-items': 'baseline',
                'flex-flow': 'row',
                'width': '100%'
            };
            gcoLabelDiv.setStyles(divStyle);
            const gcoLabelSpan = new UWA.Element('span', {
                'text': XCADCustomTablesNLS.gcoLabel + ':'
            });
            const labelStyle = {
                'flex': '30%',
                'font-weight': 'bold',
                'margin-left': '5px'
            };
            gcoLabelSpan.setStyles(labelStyle);
            gcoLabelSpan.inject(gcoLabelDiv);
            return gcoLabelDiv;
        },

        createGCOCombo: async function () {
            const that = this;
            const gcoComboDiv = new UWA.Element('div');
            try {
                //Webservice call to get connector list
                that.gcoList = await CustomTableWS.getGCOList();
            } catch (error) {
                console.log(error);
                return;
            }
            // Sort connector data by nlsName
            that.gcoList.xcadDescription.sort((a, b) => a.nlsName.localeCompare(b.nlsName));
            const gcoElementsList = [];
            that.gcoList.xcadDescription.forEach(gco => {
                gcoElementsList.push({
                    'labelItem': gco.nlsName,
                    'valueItem': gco.id
                });
            });
            that.gcoComboBox = new WUXComboBox({
                'elementsList': gcoElementsList,
                'enableSearchFlag': true,
                'selectedIndex': 0
            });
            that.gcoComboBox.addEventListener('change', async function (event) {
                event.preventDefault();
                event.stopPropagation();
                try {
                    //Webservice call to get GCO mapped types
                    const response = await CustomTableWS.getGCOMappedTypes(event.dsModel.value);
                    that.typeList = response.BusTypes;
                } catch (error) {
                    console.log(error);
                    return;
                }
                try {
                    //Webservice call to get extensions
                    that.extList = await CustomTableWS.getExtensionList(event.dsModel.value);
                } catch (error) {
                    console.log(error);
                    return;
                }
                // Sort the GCO mapped types by nlsName
                that.typeList.sort((a, b) => a.nlsName.localeCompare(b.nlsName));
                let typeElementsList = [];
                that.typeList.forEach(type => {
                    typeElementsList.push({
                        'labelItem': type.nlsName,
                        'valueItem': type.Type
                    });
                });
                that.typeComboBox.selectedIndex = 0;
                that.typeComboBox.elementsList = typeElementsList;
            });
            const valueStyle = {
                'width': '100%',
                'flex': '70%',
                'margin-left': '5px'
            };
            gcoComboDiv.setStyles(valueStyle);
            that.gcoComboBox.inject(gcoComboDiv);
            return gcoComboDiv;
        },

        createTypeLabel: function () {
            const typeLabelDiv = new UWA.Element('div');
            const divStyle = {
                'display': 'flex',
                'align-items': 'baseline',
                'flex-flow': 'row',
                'width': '100%'
            };
            typeLabelDiv.setStyles(divStyle);
            const typeLabelSpan = new UWA.Element('span', {
                'text': XCADCustomTablesNLS.typeLabel + ':'
            });
            const labelStyle = {
                'flex': '30%',
                'font-weight': 'bold',
                'margin-left': '5px'
            };
            typeLabelSpan.setStyles(labelStyle);
            typeLabelSpan.inject(typeLabelDiv);
            return typeLabelDiv;
        },

        createTypeCombo: async function () {
            const that = this;
            const typeComboDiv = new UWA.Element('div');
            try {
                // Webservice call to get GCO mapped type list
                const response = await CustomTableWS.getGCOMappedTypes(that.gcoComboBox.value);
                that.typeList = response.BusTypes;
            } catch (error) {
                console.log(error);
                return;
            }
            // Sort GCO mapped types by nlsName
            that.typeList.sort((a, b) => a.nlsName.localeCompare(b.nlsName));
            let typeElementsList = [];
            that.typeList.forEach(type => {
                typeElementsList.push({
                    'labelItem': type.nlsName,
                    'valueItem': type.Type
                });
            });
            that.typeComboBox = new WUXComboBox({
                'elementsList': typeElementsList,
                'enableSearchFlag': true,
                'selectedIndex': 0
            });
            that.typeComboBox.addEventListener('change', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let extensionList = [];
                extensionList.push({
                    'labelItem': "",
                    'valueItem': ""
                });
                const extensionsData = that.getExtensionsByType(that.extList, event.dsModel.value);
                if (extensionsData && extensionsData.length > 0) {
                    // Sort extension list by nlsName
                    extensionsData.sort((a, b) => a.nlsName.localeCompare(b.nlsName));

                    extensionsData.forEach(extension => {
                        extensionList.push({
                            'labelItem': extension.nlsName,
                            'valueItem': extension.Name
                        });
                    });
                }
                let isodtenv = typeof widget !== 'undefined' ? widget.getValue('XCADCustomTablesViewODTEnv') : 'false';
                if (isodtenv) {
                    extensionList.shift();
                }
                that.extensionComboBox.selectedIndex = 0;
                that.extensionComboBox.elementsList = extensionList;
            });
            const valueStyle = {
                'width': '100%',
                'flex': '70%',
                'margin-left': '5px'
            };
            typeComboDiv.setStyles(valueStyle);
            that.typeComboBox.inject(typeComboDiv);
            return typeComboDiv;
        },

        createExtLabel: function () {
            const extLabelDiv = new UWA.Element('div');
            const divStyle = {
                'display': 'flex',
                'align-items': 'baseline',
                'flex-flow': 'row',
                'width': '100%'
            };
            extLabelDiv.setStyles(divStyle);
            const extLabelSpan = new UWA.Element('span', {
                'text': XCADCustomTablesNLS.extensionLabel + ':'
            });
            const labelStyle = {
                'flex': '30%',
                'font-weight': 'bold',
                'margin-left': '5px'
            };
            extLabelSpan.setStyles(labelStyle);
            extLabelSpan.inject(extLabelDiv);
            return extLabelDiv;
        },

        createExtCombo: async function () {
            const that = this;
            const extComboDiv = new UWA.Element('div');
            let extensionList = [];
            try {
                //Webservice call to get Extension list
                that.extList = await CustomTableWS.getExtensionList(that.gcoComboBox.value);
            } catch (error) {
                console.log(error);
                return;
            }
            extensionList.push({
                'labelItem': "",
                'valueItem': ""
            });
            const extensionsData = that.getExtensionsByType(that.extList, that.typeComboBox.value);
            //Sort extensions by nlsName
            extensionsData.sort((a, b) => a.nlsName.localeCompare(b.nlsName));
            if (extensionsData) {
                extensionsData.forEach(extension => {
                    extensionList.push({
                        'labelItem': extension.nlsName,
                        'valueItem': extension.Name
                    });
                });
            }
            that.extensionComboBox = new WUXComboBox({
                'elementsList': extensionList,
                'enableSearchFlag': true,
                'selectedIndex': 0
            });
            that.extensionComboBox.addEventListener('change', async function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (that.extensionComboBox.value !== '') {
                    try {
                        //Webservice call to get attribute list
                        that.attrList = await CustomTableWS.getAttributesofExtension(that.gcoComboBox.value, event.dsModel.value);
                    } catch (error) {
                        console.log(error);
                        return;
                    }
                    let attributesList = [];
                    if (that.attrList.attribute.length > 0) {
                        //Sort attributesList by nlsName
                        that.attrList.attribute.sort((a, b) => a.nlsName.localeCompare(b.nlsName));
                        that.attrList.attribute.forEach(attribute => {
                            attributesList.push({
                                'labelItem': attribute.fullAttributeName,
                                'valueItem': attribute.fullAttributeName
                            });
                        });
                    }
                    that.attributeComboBox.elementsList = attributesList;
                } else {
                    that.attributeComboBox.elementsList = that.attributesListOOTB;
                }
                that.attributeComboBox.selectedIndex = 0;
            });
            const valueStyle = {
                'width': '100%',
                'flex': '70%',
                'margin-left': '5px'
            };
            extComboDiv.setStyles(valueStyle);
            that.extensionComboBox.inject(extComboDiv);
            return extComboDiv;
        },

        createAttrLabel: function () {
            const attrLabelDiv = new UWA.Element('div');
            const divStyle = {
                display: 'flex',
                'align-items': 'baseline',
                'flex-flow': 'row',
                width: '100%'
            };
            attrLabelDiv.setStyles(divStyle);
            const attrLabelSpan = new UWA.Element('span', {
                text: XCADCustomTablesNLS.attributeLabel + ':'
            });
            const labelStyle = {
                flex: '30%',
                'font-weight': 'bold',
                'margin-left': '5px'
            };
            attrLabelSpan.setStyles(labelStyle);
            attrLabelSpan.inject(attrLabelDiv);
            return attrLabelDiv;
        },

        createAttrCombo: function (rangeLables, rangeValues) {
            const attrComboDiv = new UWA.Element('div');
            this.attributesListOOTB = [];
            rangeValues.forEach((value, index) => {
                this.attributesListOOTB.push({
                    'labelItem': rangeLables[index],
                    'valueItem': value
                });
            });
            //Sort OOTB by rangeLables
            this.attributesListOOTB.sort((a, b) => a.labelItem.localeCompare(b.labelItem));
            this.attributeComboBox = new WUXComboBox({
                'elementsList': this.attributesListOOTB,
                'enableSearchFlag': true,
                'selectedIndex': 0
            });
            const valueStyle = {
                'width': '100%',
                'flex': '70%',
                'margin-left': '5px'
            };
            attrComboDiv.setStyles(valueStyle);
            this.attributeComboBox.inject(attrComboDiv);
            return attrComboDiv;
        },

        getExtensionsByType: (data, type) => {
            const extensions = data.Mapping
                .filter(item => item.Type === type)  // Filter by the provided type
                .flatMap(item => item.extensions || []);  // Flatten and extract extensions

            // Remove duplicates by stringifying each item and then parsing them back to objects
            const uniqueExtensions = [...new Set(extensions.map(item => JSON.stringify(item)))]
                .map(item => JSON.parse(item));

            return uniqueExtensions;
        },

        // on click of 'OK' button of 'Add New column' modal dialog
        okButtonOnClickHandler: function (selectionChips, immersiveFrame) {
            if (this.attributeComboBox.label !== "") {
                const addedChipsAsLabels = selectionChips.getAllChipsAsLabels();
                if (!addedChipsAsLabels.includes(this.attributeComboBox.label)) {
                    selectionChips.addChip({
                        'label': this.attributeComboBox.label,
                        'value': this.attributeComboBox.value,
                        'tooltip': this.attributeComboBox.label
                    });
                    immersiveFrame.destroy();
                } else {
                    AlertMessage.add({
                        'className': 'error',
                        'message': XCADCustomTablesNLS.columnIsAlreadyPresentMessage
                    });
                }
            } else {
                AlertMessage.add({
                    'className': 'error',
                    'message': XCADCustomTablesNLS.columnIsEmptyMessage
                });
            }
        },
    };
    return addColumnDialog;
});

/*global define*/

define('DS/ENOXCADCommonSettingUI/Views/XCADConnectorOrderParamView', [
    'UWA/Core',
    'UWA/Class/View',
    'DS/ENOXCADCommonSettingUI/Views/XCADConnectorOrderParamViewUtilities'
], function(
    UWA,
    View,
    XCADConnectorOrderParamViewUtilities) {

    'use strict';

    var extendedView;

    extendedView = View.extend({
        id: 'connectorOrderParamView',
        tagName: 'div',
        className: 'generic-detail',

        init: function(options) {
            options = UWA.clone(options || {}, false);
            this._parent(options);
            this.contentDiv = null;
            this.paramMainDIV = null;
        },

        setup: function() {
            this.listenTo(
                this.model,
                'onChange:valuesFromUI',
                this.valueOnChangeHandler
            );

            this.listenTo(
                this.model,
                'onChange:deployStatus',
                this.deployStatusOnChangeHandler
            );
        },

        valueOnChangeHandler: function(model, options) {
            if (options) {
                let valuesFromDB = model.get('valuesFromDB');
                if (valuesFromDB.length > 0) {
                    model.set('deployStatus', 'NewNotDeployed');
                } else {
                    model.set('deployStatus', 'NotDeployed');
                }
            } else {
                model.set('deployStatus', 'InvalidValueCanNotDeploy');
            }
        },

        deployStatusOnChangeHandler: function(model, options) {
            XCADConnectorOrderParamViewUtilities.cellParamDeployStatus.innerHTML = '';

            XCADConnectorOrderParamViewUtilities.buildDeployStatusCell(options).inject(
                XCADConnectorOrderParamViewUtilities.cellParamDeployStatus
            );

            if (options === 'Deployed') {
                XCADConnectorOrderParamViewUtilities.cellParamActions.innerHTML = '';
                XCADConnectorOrderParamViewUtilities.createDeleteActionsIcon(model, XCADConnectorOrderParamViewUtilities.cellParamActions);
            } else if (options === 'NotDeployed') {
                XCADConnectorOrderParamViewUtilities.cellParamActions.innerHTML = '';
            }
        },

        render: function() {
            this.contentDiv = XCADConnectorOrderParamViewUtilities.createContentDiv();

            this.paramMainDIV = XCADConnectorOrderParamViewUtilities.createParamMainDiv(this.contentDiv);

            const paramTable = XCADConnectorOrderParamViewUtilities.createParamTable(this.paramMainDIV);
            const paramTableBody = XCADConnectorOrderParamViewUtilities.createParamTableBody(paramTable);

            var tableHeaderLine = XCADConnectorOrderParamViewUtilities.buildConnectorOrderTableHeading();
            tableHeaderLine.inject(paramTableBody);

            XCADConnectorOrderParamViewUtilities.addConnectorOrderParamRow(this.model, paramTableBody);

            const accord = XCADConnectorOrderParamViewUtilities.createFamilyUIKITAccordion(paramTable);
            accord.inject(this.paramMainDIV);

            this.container.setContent(this.contentDiv);

            return this;
        },

        destroy: function() {
            this.stopListening();
            this._parent.apply(this, arguments);
        }
    });

    return extendedView;
});

/*eslint no-unused-vars: 'off'*/
/*global define, WUXManagedFontIcons*/

define('DS/ENOXCADCommonSettingUI/utils/CustomTableRowUtil', [
    'UWA/Core',
    'DS/UIKIT/Mask',
    'DS/UIKIT/Popover',
    'DS/UIKIT/Accordion',
    'DS/UIKIT/Input/Button',
    'DS/Controls/Button',
    'DS/Controls/ComboBox',
    'DS/Controls/LineEditor',
    'DS/Controls/SelectionChips',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCustomTablesNLS'
], function(
    UWA,
    Mask,
    Popover,
    Accordion,
    Button,
    WUXButton,
    WUXComboBox,
    WUXLineEditor,
    WUXSelectionChips,
    AlertMessage,
    XCADCustomTablesNLS) {

    'use strict';

    var customTableRowUtil = {

        createNameCell: function(tableName) {
            const nameCell = UWA.createElement('td', {
                width: '30%',
                align: 'left'
            });

            UWA.createElement('p', {
                text: tableName,
                'class': ''
            }).inject(nameCell);

            return nameCell;
        },

        createInfoCell: function() {
            const infoCell = UWA.createElement('td', {
                width: '10%',
                align: 'left'
            });

            const imgInfoSpan = UWA.createElement('span', {
                'class': 'fonticon fonticon-info'
            }).inject(infoCell);

            imgInfoSpan.setStyle('color', 'black');

            const popOver = new Popover({
                target: imgInfoSpan,
                trigger: 'hover',
                animate: 'true',
                position: 'top',
                body: XCADCustomTablesNLS.infoIconTooltip,
                title: ''
            });

            return infoCell;
        },

        createValueCell: function() {
            const valueCell = UWA.createElement('td', {
                width: '40%',
                align: 'left'
            });

            return valueCell;
        },

        createValueTable: function() {
            const valueTable = UWA.createElement('table', {
                'class': 'table table-condensed',
                id: 'paramValueTable'
            });

            return valueTable;
        },

        createSelectionChipsCell: function() {
            const selectionChipsCell = UWA.createElement('td', {
                width: '100%',
                colspan: 2
            });

            return selectionChipsCell;
        },

        createAddAttributeCell: function() {
            const addAttributeCell = UWA.createElement('td', {
                width: '85%',
                align: 'right',
                styles: {
                    'padding-top': '5px',
                    'padding-right': '5px'
                }
            });

            return addAttributeCell;
        },

        getSelectionChips: function(rangeLabels, rangeValues, attributes) {
            const selectionChips = new WUXSelectionChips({
                displayMenu: false
            });

            for (let i = 0; i < attributes.length; i++) {
                if (rangeValues.includes(attributes[i])) {
                    let index = rangeValues.indexOf(attributes[i]);

                    selectionChips.addChip({
                        label: rangeLabels[index],
                        value: rangeValues[index]
                    });
                } else {
                    selectionChips.addChip({
                        label: attributes[i],
                        value: attributes[i]
                    });
                }
            }

            selectionChips.getContent().setStyles({
                width: '100%',
                height: 'auto',
                'min-height': '50px'
            });

            return selectionChips;
        },

        createDeployStatusCell: function(deployStatus) {
            const deployStatusCell = UWA.createElement('td', {
                width: '10%',
                align: 'right'
            });

            const deployStatusImage = this.createDeployStatusImage(deployStatus);
            deployStatusImage.inject(deployStatusCell);

            return deployStatusCell;
        },

        createDeployStatusImage: function(deployStatus) {
            const iconSize = '1';
            let imgClass, imgTitle, iconColor;

            switch (deployStatus) {
                case 'Deployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-check';
                    imgTitle = XCADCustomTablesNLS.deployedStatusText;
                    iconColor = 'green';
                    break;
                case 'NotDeployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-cog';
                    imgTitle = XCADCustomTablesNLS.notDeployedStatusText;
                    iconColor = 'orange';
                    break;
                case 'NewNotDeployed':
                    imgClass = 'fonticon fonticon-' + iconSize + 'x fonticon-cog';
                    imgTitle = XCADCustomTablesNLS.newValueNotDeployedStatusText;
                    iconColor = 'black';
                    break;
                default:
                    break;
            }

            const imgCell = UWA.createElement('td', {
                width: '15%',
                align: 'center',
                title: imgTitle
            });

            const imgSpan = UWA.createElement('span', {
                'class': imgClass
            }).inject(imgCell);

            imgSpan.setStyle('color', iconColor);
            imgCell.setStyle('vertical-align', 'text-bottom');
            imgCell.setStyle('min-width', '46px');

            return imgCell;
        },

        createActionsCell: function(deleteCustomTable) {
            const actionsCell = UWA.createElement('td', {
                width: '10%',
                align: 'center'
            });

            const deleteIconSpan = UWA.createElement('span');

            const deleteButton = new Button({
                className: 'close',
                icon: 'fonticon fonticon-trash fonticon-1.5x',
                attributes: {
                    disabled: false,
                    'aria-hidden': 'true'
                }
            }).inject(deleteIconSpan);

            const deletePop = new Popover({
                target: deleteIconSpan,
                trigger: 'hover',
                animate: 'true',
                position: 'top',
                body: XCADCustomTablesNLS.deleteIconTooltip,
                title: ''
            });

            deleteButton.addEvent('onClick', function() {
                deleteCustomTable();
            });

            deleteIconSpan.inject(actionsCell);

            return actionsCell;
        },

        createAddAttributeButton: function() {
            const addItemButton = new WUXButton({
                displayStyle: 'normal',
                emphasize: 'secondary',
                label: XCADCustomTablesNLS.addColumnButtonLabel
            });

            const labelStyle = {
                'flex': '70%',
                'display': 'inline-block',
                'min-width': '40px',
                'margin-left': '5px'
            };

            addItemButton.getContent().title = XCADCustomTablesNLS.addColumnTooltip;
            addItemButton.getContent().setStyle(labelStyle);

            return addItemButton;
        }

    };

    return customTableRowUtil;
});

/*global define*/

define('DS/ENOXCADCommonSettingUI/Model/XCADCustomTablesModel', [
    'DS/ENOXCADCommonSettingUI/Model/XCADCommonSettingModel'
], function(XCADCommonSettingModel) {

    'use strict';

    var customTablesModel = XCADCommonSettingModel.extend({
        defaults: function() {
            return {
                id: '',
                paramid: '',
                rangeValues: [],
                rangeLabels: [],
                deployStatus: '',
                valuesFromDB: [],
                valuesFromUI: []
            };
        }
    });

    return customTablesModel;
});

/*global define, customTableChangedModels:writable, customTableNames*/
/*eslint-disable no-console*/

define('DS/ENOXCADCommonSettingUI/Views/XCADCustomTableRowView', [
    'UWA/Core',
    'UWA/Class/View',
    'DS/Controls/ComboBox',
    'DS/Controls/Button',
    'DS/UIKIT/Accordion',
    'DS/UIKIT/Popover',
    'DS/UIKIT/Mask',
    'DS/UIKIT/Input/Button',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'DS/ENOXCADCommonSettingUI/utils/CustomTableWS',
    'DS/ENOXCADCommonSettingUI/utils/CustomTableRowUtil',
    'DS/ENOXCADCommonSettingUI/Views/AddColumnDialog',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCustomTablesNLS'
], function(
    UWA,
    View,
    WUXComboBox,
    WUXButton,
    Accordion,
    Popover,
    Mask,
    Button,
    AlertMessage,
    CustomTableWS,
    CustomTableRowUtil,
    AddColumnDialog,
    XCADCustomTablesNLS) {

    'use strict';

    var customTableRowView = View.extend({
        id: 'customTableRowView',
        tagName: 'tr',

        setup: function() {
            this.listenTo(
                this.model,
                'onChange:attributes',
                this.valueOnChangeHandler
            );

            this.listenTo(
                this.model,
                'onChange:deployStatus',
                this.deployStatusOnChangeHandler
            );
        },

        // 'valueFromUI' on change handler
        valueOnChangeHandler: function(model) {
            this.addModelToChangedModels(model);

            if (model.get('deployStatus') === 'Deployed')
                model.set('deployStatus', 'NotDeployed');
        },

        // to add current model to customTableChangedModels array
        addModelToChangedModels: function(model) {
            if (customTableChangedModels.includes(model)) {
                customTableChangedModels = customTableChangedModels.filter(
                    (item) => item !== model
                );
            }

            customTableChangedModels.push(model);
        },

        // 'deployStatus' on change handler
        deployStatusOnChangeHandler: function(model, options) {
            this.deployStatusCell.innerHTML = '';
            const deployStatusImage = CustomTableRowUtil.createDeployStatusImage(options);
            deployStatusImage.inject(this.deployStatusCell);
        },

        // to add SelectionChips row
        render: function() {
            const that = this;

            const tableName = that.model.get('tableName');
            const attributes = that.model.get('attributes');
            const rangeValues = that.model.get('rangeValues');
            const rangeLabels = that.model.get('rangeLabels');
            const deployStatus = that.model.get('deployStatus');

            if (deployStatus === 'NotDeployed')
                customTableChangedModels.push(that.model);

            // Name cell
            const nameCell = CustomTableRowUtil.createNameCell(tableName);
            nameCell.inject(this.container);

            // Info cell
            const infoCell = CustomTableRowUtil.createInfoCell();
            infoCell.inject(this.container);

            // Value cell
            const valueCell = CustomTableRowUtil.createValueCell();
            valueCell.inject(that.container);

            // Create value table
            const valueTable = CustomTableRowUtil.createValueTable();
            valueTable.inject(valueCell);

            // Create selection chips row
            const selectionChipChildRow = UWA.createElement('tr'); // 1st row
            selectionChipChildRow.inject(valueTable);

            const selectionChipsCell = CustomTableRowUtil.createSelectionChipsCell();
            selectionChipsCell.inject(selectionChipChildRow);

            const selectionChips = CustomTableRowUtil.getSelectionChips(
                rangeLabels,
                rangeValues,
                attributes
            );

            selectionChips.inject(selectionChipsCell);

            const addSelectionChipsRow = UWA.createElement('tr'); // 2nd row
            addSelectionChipsRow.inject(valueTable);

            const addAttributeCell = CustomTableRowUtil.createAddAttributeCell();
            addAttributeCell.inject(addSelectionChipsRow);

            const addAttributeButton = CustomTableRowUtil.createAddAttributeButton();
            addAttributeButton.inject(addAttributeCell);

            // Add column button on click event handler
            addAttributeButton.addEventListener('click', async function() {
                const addColumnFrame = await AddColumnDialog.createAddColumnFrame(rangeLabels, rangeValues, selectionChips);
                const commonSettingView = document.getElementById('commonSettingView');
                addColumnFrame.inject(commonSettingView);
            });

            // Selection chips on change event handler
            selectionChips.addEventListener('change', function() {
                const addedChips = selectionChips.getAllChipsOptions();

                const addedChipsValues = addedChips.map(function(el) {
                    return el.value;
                });

                that.model.set('attributes', addedChipsValues);
            });

            // Actions cell
            const actionsCell = CustomTableRowUtil.createActionsCell(that.deleteCustomTable.bind(that));
            actionsCell.inject(that.container);

            // Deploy status cell
            that.deployStatusCell = CustomTableRowUtil.createDeployStatusCell(deployStatus);
            that.deployStatusCell.inject(that.container);

            return that;
        },

        deleteCustomTable: function() {
            const that = this;
            const deployStatus = that.model.get('deployStatus');
            const customTableName = that.model.get('tableName');

            if (deployStatus === 'NewNotDeployed') {
                that.removeCustomTable(customTableName);
            } else {
                // Call delete custom table web service
                CustomTableWS.deleteCustomTable(customTableName).then(response => {
                    console.log(response);
                    that.removeCustomTable(customTableName);
                }).catch(error => {
                    if (error.errorCode === 403) {
                        AlertMessage.add({
                            className: 'error',
                            message: XCADCustomTablesNLS.tableIsUsedByConnectorsMessage
                        });
                    } else {
                        AlertMessage.add({
                            className: 'error',
                            message: XCADCustomTablesNLS.deleteCustomTableFailureMessage
                        });
                    }
                });
            }
        },

        removeCustomTable: function(customTableName) {
            if (customTableChangedModels.includes(this.model)) {
                customTableChangedModels = customTableChangedModels.filter(
                    (item) => item !== this.model
                );
            }

            customTableNames.delete(customTableName.toLowerCase());

            this.stopListening(this.model);
            this.model = null;
            const row = document.getElementById(customTableName + 'Row');
            row.parentNode.removeChild(row);

            AlertMessage.add({
                className: 'success',
                message: XCADCustomTablesNLS.deleteCustomTableSuccessMessage
            });
        }
    });

    return customTableRowView;
});

/*global define*/
define('DS/ENOXCADCommonSettingUI/Model/XCADConnectorOrderParamModel',
    [
       'DS/ENOXCADCommonSettingUI/Model/XCADCommonSettingModel'
    ], function (XCADCommonSettingModel) {
        "use strict";
        return XCADCommonSettingModel.extend({
            defaults: function() {
                return {
                    id: '',
					paramid:'',
					ranges:'',
					rangeLabels:'',
					deployStatus:'',
					valuesFromDB:'',
					valuesFromUI:''
                };
            }
        });
    });

/*global define, widget*/
/*eslint no-useless-call: "off"*/

define('DS/ENOXCADCommonSettingUI/Collection/XCADCommonSettingCollection', [
    'UWA/Class/Collection',
    'DS/WAFData/WAFData',
    'DS/ENOXCADCommonSettingUI/utils/URLHandler',
    'DS/ENOXCADCommonSettingUI/Model/XCADCommonSettingModel',
    'DS/ENOXCADCommonSettingUI/Model/XCADConnectorOrderParamModel',
    'DS/ENOXCADCommonSettingUI/Model/XCADCustomTablesModel'
], function(
    Collection,
    WAFData,
    URLHandler,
    XCADCommonSettingModel,
    XCADConnectorOrderParamModel,
    XCADCustomTablesModel) {

    'use strict';

    var xcadCommonSettingCollection = Collection.extend({

        model: function(attrs, options) {
            if (attrs.paramid === 'XCADTemplateCADOrder')
                return new XCADConnectorOrderParamModel(attrs, options);

            if (attrs.paramid === 'XCADCustomTables')
                return new XCADCustomTablesModel(attrs, options);

            return new XCADCommonSettingModel(attrs, options);
        },

        setup: function(models, options) {
            URLHandler.setTenant(options.tenant);
            URLHandler.setURL(options.baseUrl);

            this.childCollection = null;
            this.url = URLHandler.getURL() + '/resources/xcadcommonsetting/services/getValues?tenant=' + URLHandler.getTenant();
        },

        sync: function(method, model, options) {
            options.headers = {
                Accept: 'application/json',
                'Accept-Language': widget.lang
            };

            options = Object.assign({
                ajax: WAFData.authenticatedRequest
            }, options);

            this._parent.apply(this, [method, model, options]);
        },


        parse: function(data) {
            const paramEntries = [];
            const paramDomainId = 'XCADParameterization';

            if (data.XCADTemplateCADOrder) {
                let paramValuesFromUI = [];
                let paramIdEntries = [];
                let paramNLSEntries = [];
                let paramValuesFromDB = [];
                let paramDeploySatus = '';
                const paramId = 'XCADTemplateCADOrder';
                const connectorOrderData = data.XCADTemplateCADOrder;

                if (Array.isArray(connectorOrderData.rangeValues)) {
                    connectorOrderData.rangeValues.forEach(function(iElement) {
                        paramIdEntries.push(iElement);
                    });
                }

                if (Array.isArray(connectorOrderData.rangeLabels)) {
                    connectorOrderData.rangeLabels.forEach(function(iElement) {
                        paramNLSEntries.push(iElement);
                    });
                }

                if (Array.isArray(connectorOrderData.valuesFromDB)) {
                    connectorOrderData.valuesFromDB.forEach(function(iElement) {
                        if (iElement) {
                            paramValuesFromDB.push(iElement);
                        }
                    });
                }

                if (paramValuesFromDB.length > 0) {
                    paramDeploySatus = 'Deployed';
                    for (let elm of paramValuesFromDB) {
                        paramValuesFromUI.push(elm);
                    }
                } else {
                    paramDeploySatus = 'NotDeployed';
                    for (let elm of paramIdEntries) {
                        paramValuesFromUI.push(elm);
                    }
                }

                paramEntries.push({
                    ranges: paramIdEntries,
                    rangeLabels: paramNLSEntries,
                    deployStatus: paramDeploySatus,
                    valuesFromDB: paramValuesFromDB,
                    valuesFromUI: paramValuesFromUI,
                    domainid: paramDomainId,
                    paramid: paramId,
                    id: paramId
                });
            }

            if (data.XCADCustomTables) {
                const paramId = 'XCADCustomTables';
                const customTablesData = data.XCADCustomTables;

                paramEntries.push({
                    rangeValues: customTablesData.rangeValues,
                    rangeLabels: customTablesData.rangeLabels,
                    deployStatus: 'Deployed',
                    valuesFromDB: customTablesData.valuesFromDB,
                    valuesFromUI: [],
                    domainid: paramDomainId,
                    paramid: paramId,
                    id: paramId
                });
            }

            return paramEntries;
        },

        create: function(attributes, options) {
            options.proxy = 'passport';
            this._parent.apply(this, [attributes, options]);
        }

    });

    return xcadCommonSettingCollection;
});

/*global define, customTableNames, customTableChangedModels:writable*/

define('DS/ENOXCADCommonSettingUI/Views/XCADCustomTablesView', [
    'UWA/Core',
    'UWA/Class/View',
    'DS/Controls/Button',
    'DS/Windows/Dialog',
    'DS/Windows/ImmersiveFrame',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'DS/ENOXCADCommonSettingUI/utils/CustomTablesUtil',
    'DS/ENOXCADCommonSettingUI/Model/XCADCustomTableRowModel',
    'DS/ENOXCADCommonSettingUI/Views/XCADCustomTableRowView',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCustomTablesNLS'
], function(
    UWA,
    View,
    WUXButton,
    WUXDialog,
    WUXImmersiveFrame,
    AlertMessage,
    CustomTablesUtil,
    XCADCustomTableRowModel,
    XCADCustomTableRowView,
    XCADCustomTablesNLS) {

    'use strict';

    var customTablesView = View.extend({
        id: 'customTablesView',
        tagName: 'div',
        className: 'generic-detail',

        init: function(options) {
            options = UWA.clone(options || {}, false);
            this._parent(options);

            this.contentDiv = null;
        },

        setup: function(options) {
            UWA.log(options);
        },

        render: function() {
            const that = this;

            // Main Div
            that.contentDiv = CustomTablesUtil.createContentDiv();

            // Table
            const tableDiv = CustomTablesUtil.createTableDiv(that.contentDiv);
            tableDiv.inject(that.contentDiv);

            const table = CustomTablesUtil.createTable();
            table.inject(tableDiv);

            const tableBody = CustomTablesUtil.createTableBody();
            tableBody.inject(table);

            const tableHeader = CustomTablesUtil.createTableHeader();
            tableHeader.inject(tableBody);

            // Custom table rows
            const customTables = that.model.get('valuesFromDB');

            for (const customTable of customTables) {
                const tableRow = that.createCustomTableRow(customTable);
                tableRow.inject(tableBody);
            }

            // 'Custom Tables' accordion
            const accordion = CustomTablesUtil.createAccordion(tableDiv);
            accordion.inject(that.contentDiv);

            // 'Add New Table' button
            const addNewTableButton = CustomTablesUtil.createAddNewTableButton();
            addNewTableButton.inject(tableDiv);

            addNewTableButton.addEventListener('click', function() {
                const addNewTableFrame = that.createAddNewTableFrame();
                const mainContainer = document.getElementById('commonSettingView');
                addNewTableFrame.inject(mainContainer);
            });

            that.container.setContent(that.contentDiv);

            return that;
        },

        // to create row for each custom table
        createCustomTableRow: function(customTable) {
            const customTableRow = UWA.createElement('tr', {
                id: customTable.tableName + 'Row'
            });

            customTableNames.add(customTable.tableName.toLowerCase());

            customTable.rangeValues = this.model.get('rangeValues');
            customTable.rangeLabels = this.model.get('rangeLabels');
            customTable.deployStatus = customTable.isDeployed ? 'Deployed' : 'NotDeployed';

            const customTableRowModel = new XCADCustomTableRowModel(customTable);

            const customTableRowView = new XCADCustomTableRowView({
                id: customTable.tableName,
                className: 'customTableRowClass',
                model: customTableRowModel,
                container: customTableRow
            });

            return customTableRowView.render().container;
        },

        // to create new frame on click of 'Add New Table' button
        createAddNewTableFrame: function() {
            const that = this;

            const immersiveFrame = new WUXImmersiveFrame({
                identifier: 'addNewTableFrame'
            });

            const mainContainer = new UWA.Element('span');

            const nameDiv = CustomTablesUtil.createNameLabel();
            nameDiv.inject(mainContainer);

            that.nameLineEditor = CustomTablesUtil.createNameLineEditor();
            that.nameLineEditor.inject(nameDiv);

            // Modal Dialog
            const modalDialog = new WUXDialog({
                immersiveFrame: immersiveFrame,
                title: XCADCustomTablesNLS.modalDialogTitle,
                content: mainContainer,
                identifier: 'addNewTableModalDialog',
                autoCloseFlag: false,
                modalFlag: true,
                // resizableFlag: true,
                // width: 300,
                // height: 100,
                buttons: {
                    Ok: new WUXButton({
                        label: XCADCustomTablesNLS.okButtonLabel,
                        onClick: function() {
                            const tableName = that.nameLineEditor.value;
                            that.okButtonOnClickHandler(tableName, immersiveFrame);
                        }
                    }),
                    Cancel: new WUXButton({
                        label: XCADCustomTablesNLS.cancelButtonLabel,
                        onClick: function() {
                            immersiveFrame.destroy();
                        }
                    })
                }
            });

            modalDialog.addEventListener('close', function() {
                immersiveFrame.destroy();
            });

            return immersiveFrame;
        },

        // on click of 'OK' button of 'Add New Table' modal dialog
        okButtonOnClickHandler: function(tableName, immersiveFrame) {
            const that = this;

            if (!tableName) {
                AlertMessage.add({
                    className: 'error',
                    message: XCADCustomTablesNLS.addValidTableNameMessage
                });

                that.nameLineEditor.value = '';
                return;
            }

            const isValidTableName = this.validateTableName(tableName);

            if (!isValidTableName) {
                AlertMessage.add({
                    className: 'error',
                    message: XCADCustomTablesNLS.addUniqueTableNameMessage
                });

                that.nameLineEditor.value = '';
                return;
            }

            immersiveFrame.destroy();

            const newCustomTableRow = this.createNewCustomTableRow(tableName);

            const paramTableBody = document.getElementById('customTablesTableBody');
            newCustomTableRow.inject(paramTableBody);
        },

        // to check if table name is unique
        validateTableName: function(tableName) {
            if (customTableNames.has(tableName.toLowerCase()))
                return false;

            return true;
        },

        // to create new custom table row on click of ok button of modal dialog
        createNewCustomTableRow: function(tableName) {
            const customTableRow = UWA.createElement('tr', {
                id: tableName + 'Row'
            });

            let customTable = {};

            customTable.tableName = tableName;
            customTable.attributes = [];
            customTable.rangeLabels = this.model.get('rangeLabels');
            customTable.rangeValues = this.model.get('rangeValues');
            customTable.deployStatus = 'NewNotDeployed';

            const customTableRowModel = new XCADCustomTableRowModel(customTable);

            const customTableRowView = new XCADCustomTableRowView({
                id: tableName,
                className: 'customTableRowClass',
                model: customTableRowModel,
                container: customTableRow
            });

            customTableNames.add(tableName.toLowerCase());
            customTableChangedModels.push(customTableRowModel);

            return customTableRowView.render().container;
        },

        destroy: function() {
            this.stopListening();
            this._parent.apply(this, arguments);
        }
    });

    return customTablesView;
});

/*global widget, define*/

var customTableChangedModels = [];
var customTableNames = new Set();

define('DS/ENOXCADCommonSettingUI/Views/XCADCommonSettingView', [
    'UWA/Core',
    'UWA/Class/View',
    'DS/UIKIT/Mask',
    'DS/UIKIT/Scroller',
    'DS/WAFData/WAFData',
    'DS/ENOXCADCommonSettingUI/utils/URLHandler',
    'DS/ENOXCADCommonSettingUI/utils/AlertMessage',
    'DS/ENOXCADCommonSettingUI/Views/XCADConnectorOrderParamView',
    'DS/ENOXCADCommonSettingUI/Views/XCADConnectorOrderParamViewUtilities',
    'DS/ENOXCADCommonSettingUI/Views/XCADCommonSettingViewUtilities',
    'DS/ENOXCADCommonSettingUI/Views/XCADCustomTablesView',
    'i18n!DS/ENOXCADCommonSettingUI/assets/nls/XCADCommonSettingViewNLS',
    'css!DS/ENOXCADCommonSettingUI/ENOXCADCommonSettingUI'
], function(
    UWA,
    View,
    Mask,
    Scroller,
    WAFData,
    URLHandler,
    AlertMessage,
    XCADConnectorOrderParamView,
    XCADConnectorOrderParamViewUtilities,
    XCADCommonSettingViewUtilities,
    XCADCustomTablesView,
    XCADCommonSettingViewNLS) {

    'use strict';

    var commonSettingView = View.extend({
        id: 'commonSettingView',
        tagName: 'div',
        className: 'generic-detail',

        init: function(options) {
            options = UWA.clone(options || {}, false);
            this._parent(options);

            this.contentDiv = null;

            this.xcadConnectorOrderParamView = null;
            this.xcadCustomTablesView = null;

            this.contentScroller = null;
            this.applyResetDiv = null;
        },

        setup: function(options) {
            UWA.log(options);
        },

        render: function() {
            const that = this;

            Mask.mask(that.container);

            // Information Div
            const introDiv = XCADCommonSettingViewUtilities.createInfoDiv();
            introDiv.inject(that.container);

            // Content Div
            that.contentDiv = XCADCommonSettingViewUtilities.createContentDiv();
            //that.contentDiv.setStyle('height', that.container.offsetHeight - 95 + 'px');
            that.contentDiv.inject(that.container);

            // Set height of content div on resize event of widget
            widget.addEvent('onResize', function() {
                const widgetHeight = widget.getViewportDimensions().height;
                that.contentDiv.setStyle('height', widgetHeight - 250 + 'px');
            });

            // Collection onSync event
            that.listenTo(that.collection, {
                onSync: that.onCompleteRequestParameters
            });

            return that;
        },

        // To create views - will be called onSync of Collection
        onCompleteRequestParameters: function() {
            const that = this;
            customTableChangedModels = [];
            customTableNames.clear();

            // Fill content div
            for (let i = 0; i < this.collection._models.length; i++) {
                const paramModel = this.collection._models[i];

                if (paramModel._attributes.paramid === 'XCADTemplateCADOrder') {
                    that.xcadConnectorOrderParamView = new XCADConnectorOrderParamView({
                        model: paramModel
                    }).render().container.inject(that.contentDiv);
                } else if (paramModel._attributes.paramid === 'XCADCustomTables') {
                    that.xcadCustomTablesView = new XCADCustomTablesView({
                        model: paramModel
                    }).render().container.inject(that.contentDiv);
                }
            }

            // Add scroller to content div
            that.contentScroller = new Scroller({
                element: that.contentDiv
            }).inject(that.container);

            // Apply Reset Div
            that.applyResetDiv = XCADCommonSettingViewUtilities.createApplyResetToolbar.call(that, true,
                that.applyCommonSettingParams.bind(that), that.resetCommonSettingParamsInSession.bind(that));
            that.applyResetDiv.inject(that.container);

            Mask.unmask(that.container);
        },

        // To reset common setting changes which are not deployed to server
        resetCommonSettingParamsInSession: function() {
            Mask.mask(this.container);

            // Remove XCADConnectorOrderParamView
            if (this.xcadConnectorOrderParamView) {
                this.stopListening(this.xcadConnectorOrderParamView);
                this.xcadConnectorOrderParamView.destroy();
                this.xcadConnectorOrderParamView = null;
            }

            // Remove XCADCustomTablesView
            if (this.xcadCustomTablesView) {
                this.stopListening(this.xcadCustomTablesView);
                this.xcadCustomTablesView.destroy();
                this.xcadCustomTablesView = null;
            }

            // Remove Scroller div
            this.contentScroller.destroy();
            this.contentScroller = null;

            // Remove Apply Reset buttons
            this.applyResetDiv.destroy();
            this.applyResetDiv = null;

            customTableChangedModels = [];
            customTableNames.clear();

            // Get data from backend
            this.collection.fetch(this.options);

            Mask.unmask(this.container);
        },

        // To deploy common settings to server
        applyCommonSettingParams: function() {
            const that = this;
            let dataToSend = {};

            for (let i = 0; i < that.collection._models.length; i++) {
                const paramModel = that.collection._models[i];

                if (paramModel._attributes.paramid === 'XCADTemplateCADOrder') {
                    const valuesFromUI = paramModel.get('valuesFromUI');
                    const valuesFromDB = paramModel.get('valuesFromDB');

                    if (JSON.stringify(valuesFromUI) !== JSON.stringify(valuesFromDB)) {
                        dataToSend['XCADTemplateCADOrder'] = {
                            'valuesFromUI': valuesFromUI.toString()
                        };
                    }
                } else if (paramModel._attributes.paramid === 'XCADCustomTables') {
                    const valuesFromUI = [];

                    if (customTableChangedModels.length > 0) {
                        for (const customTableModel of customTableChangedModels) {
                            const attributes = customTableModel.get('attributes');

                            if (attributes.length === 0) {
                                AlertMessage.add({
                                    className: 'error',
                                    message: XCADCommonSettingViewNLS.customTableErrorMessage
                                });

                                return;
                            }

                            const customTable = {
                                tableName: customTableModel.get('tableName'),
                                attributes: customTableModel.get('attributes')
                            };

                            valuesFromUI.push(customTable);
                        }

                        dataToSend['XCADCustomTables'] = {
                            'valuesFromUI': valuesFromUI
                        };
                    }
                }
            }

            // Call deploy web service only if there is change in UI
            if (Object.keys(dataToSend).length !== 0) {
                Mask.mask(that.container);

                const url = URLHandler.getURL() + '/resources/xcadcommonsetting/services/deploy?tenant=' +
                    URLHandler.getTenant();

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: 'POST',
                    data: JSON.stringify(dataToSend),
                    type: 'json',
                    //proxy: 'passport',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function(json) {
                        that.onApplyFailure(json);
                    },

                    onComplete: function(json) {
                        that.onApplySuccess(json);
                    }
                });
            }
        },

        // On failure of deploy web service
        onApplyFailure: function() {
            Mask.unmask(this.container);

            AlertMessage.add({
                className: 'error',
                message: XCADCommonSettingViewNLS.applyErrorMessage
            });
        },

        // On success of deploy web service
        onApplySuccess: function() {
            for (let i = 0; i < this.collection._models.length; i++) {
                var paramModel = this.collection._models[i];

                if (paramModel._attributes.paramid === 'XCADTemplateCADOrder') {
                    const valuesFromUI = paramModel.get('valuesFromUI');
                    const valuesFromDB = paramModel.get('valuesFromDB');

                    if (valuesFromUI !== valuesFromDB) {
                        paramModel.set('valuesFromDB', valuesFromUI);
                        if (valuesFromUI.length > 0) {
                            paramModel.set('deployStatus', 'Deployed');
                        } else {
                            paramModel.set('deployStatus', '');
                        }
                    }
                }
            }

            // Change deploy status to 'Deployed' for custom tables which are deployed to server
            for (const changedModel of customTableChangedModels) {
                changedModel.set('deployStatus', 'Deployed');
            }

            customTableChangedModels = [];

            Mask.unmask(this.container);

            AlertMessage.add({
                className: 'success',
                message: XCADCommonSettingViewNLS.applySuccessMessage
            });
        },

        destroy: function() {
            this.stopListening();
            this._parent.apply(this, arguments);
        }

    });

    return commonSettingView;
});

/*global define*/

define('DS/ENOXCADCommonSettingUI/Views/XCADCommonSettingLayoutView', [
    'UWA/Class/View',
    'DS/ENOXCADCommonSettingUI/Views/XCADCommonSettingView'
], function(
    View,
    XCADCommonSettingView) {

    'use strict';

    return View.extend({

        defaultOptions: {
            type: 'default'
        },

        init: function(options) {
            this.options = options;
            this.childView = null;
        },

        render: function() {
            var options = this.options;
            var xCADCommonSettingView = new XCADCommonSettingView(options);
            this.childView = xCADCommonSettingView;
            return xCADCommonSettingView.render();
        },

        destroy: function() {
            this.childView.destroy();
            this.stopListening();
            this._parent.apply(this, arguments);
        }
    });
});

