define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartProgressDialog',
[
	'UWA/Controls/Abstract',
    'UWA/Core',
    'DS/UIKIT/Mask',
    'css!DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberListView.css'
],

function ( Abstract, UWA, Mask) {
    'use strict';

    return Abstract.extend({
        close: function(){
            if(this.progressContainer)
            {
                this.progressContainer.remove();
                this.progressContainer = null;
            }
        },

        createProgress: function(container, text){

            this.progressContainer = UWA.createElement('div',{
                'class': 'setpart-progress-container'
            });

            var iconContainer = UWA.createElement('span',{
                'class': 'setpart-progress-icon-container'
            });
            iconContainer.inject(this.progressContainer);
            var icon = UWA.createElement('div',{
                'class': 'setpart-progress-icon'
            });
            icon.inject(iconContainer);

            var msg = UWA.createElement('span',{
                'class': 'setpart-progress-msg'
            });
            msg.innerHTML = text;
            msg.inject(this.progressContainer);

            this.progressContainer.inject(container);

            Mask.mask(icon, '');

            var rootEl = this.progressContainer;
            this.progressContainer.remove = function(){
                container.removeChild(rootEl);
            };
        }
    });

});

define('DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberHttpClient', [
    'UWA/Core',
    'DS/ENOXEngineerCommonUtils/XENGenericHttpClient',
    'DS/ENOXEngineerCommonUtils/XENPlatform3DXSettings',
    'DS/ENOXEngineerCommonUtils/XENCommonConstants'
], function(UWA, XENGenericHttpClient, XENPlatform3DXSettings, XEngineerConstants) {

    'use strict';

    /**
     * overwritting options for XEN webapp.
     */
    //clone to avoid to overwrite the orriginal object
    var XENHttpClient = Object.assign(UWA.clone(XENGenericHttpClient, true),{
        decorateWithAddtionnaloptions: function(fetchOpts, cmd){

            if (!cmd.noSecurityContextNeeded && cmd.targetService === XEngineerConstants.SERVICE_3DSPACE_NAME) {

                fetchOpts.headers.SecurityContext = encodeURIComponent('ctx::'+this.getSecurityContext());
                // IR-642113-3DEXPERIENCER2018x: encode the Security context for Double byte characters
                fetchOpts.headers.SecurityToken = encodeURIComponent(XENPlatform3DXSettings.getSecurityToken());
            }
        },


        getSecurityContext : function() {
			if(widget && widget.getValue && widget.getValue('SC')) {
				return widget.getValue('SC');
			}
			return XENPlatform3DXSettings.getSecurityContext();
  	   	},
  	   
	  //Added for WUC function FUN110316 on NativeApp
  	  buildChangeHeaders: function(fetchOptsHeaders){
		  if(widget && widget.getValue && widget.getValue('authorizedChange') && XENPlatform3DXSettings.isWebInWinEnvironment()){
	        	  return Object.assign(fetchOptsHeaders,widget.getValue('authorizedChange').AuthoringContextHeader);
	          }
		  return Object.assign(fetchOptsHeaders, XENPlatform3DXSettings.getWorkUnderHeaders());
	  }

    });



    return XENHttpClient;

});

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants', [], function () {

	'use strict';

	var SetPartConstants = {
    CONSTANT_FREE : "FREE",
    CONSTANT_TITLE : "name",
    CONSTANT_EXISTINGPN : "oldpartnumber",
    CONSTANT_NEW_EIN: "newPartNumberValue",
    CONSTANT_COLUMN : "column",
    CONSTANT_TEXTBOX : "textbox",
    CONSTANT_COMPUTED : "computed",
    CONSTANT_DYNAMIC_COLUMNS : "DynamicColumns",
    CONSTANT_NEW_COLUMNS_KEY : "new_partnumber_columns",
    CONSTANT_NEW_PART_NUMBER : "newpartnumber",
    CONSTANT_OLD_PART_NUMBER :"oldpartnumber",
    CONSTANT_STATUS : "status",
    CONSTANT_COMPUTED_PARTNUMBER : "computedPartNumber",
    CONSTANT_KEY_ITEMNUMBER_GENERATOR: "ItemNumberGenerator",
    CONSTANT_KEY_ITEMNUMBER_UNIQUENESS  : "CheckItemNumberUniqeness",
    CONSTANT_VALUE_PARAM_FORMULA : "ParameterizationFormulaService",
    CONSTANT_VALUE_BL : "BusinessLogicService",
    CONSTANT_VALUE_USERINPUT : "UserInput",
    CONSTANT_KEY_REFERENCES : "references",
    CONSTANT_TYPE_FREE : "|@|FREE|@|",
    CONSTANT_STATUS_ERROR : "error",
    CONSTANT_BUTTON_OK : "okButton",
    CONSTANT_FORMULA_CONFIGURED : "FormulaConfigured",
    CONSTANT_BLOCK_EIN_CONFIGURED : "BlockManualSetEIN",
    CONSTANT_EIN_FORMAT :"SetEnterpriseItemNumberGenerator",
    CONSTANT_MANUAL_OR_FREE_INPUT: "ManualORFreeInputForEIN",
    CONSTANT_TRUE: "True",
    CONSTANT_FALSE: "False",
		CONSTANT_SUCCESS : "success",
		CONSTANT_COLUMN_ERROR : "ErrorMessage",
		CONSTANT_PHYSICAL_ID : "physicalid",
		CONSTANT_ID : "id",
		CONSTANT_SUGGESTED_EIN : "AllRevisionsPartNumber",
		CONSTANT_KEY_SUGGESTED_EIN_VALUES : "suggestedEINValues",
		CONSTANT_KEY_SUGGESTED_EIN : "SuggestedEIN_",
		CONSTANT_KEY_ALL_REV_SKIP : "SkipAllRevSameEINCheck",
		CONSTANT_KEY_ALL_REV_SKIP_VALUE_TRUE : "True",
		CONSTANT_KEY_ALL_REV_SKIP_VALUE_FALSE : "False",
		CONSTANT_KEY_PN : "partNumber",
		CONSTANT_USER_MAPPED_PN : "UserMappedAllRevSamePN",
		CONSTANT_SINGLE_COLUMN : "SingleColumn",
		CONSTANT_DEFORMED : "Deformed",
		CONSTANT_DEFORMABLE_EIN: "DeformableEIN",
		CONSTANT_ALL_DEFORMABLE_EIN: "AllDeformableEIN",
		CONSTANT_LIMIT_EIN : 400,


    CONSTANT_KEY_FORMULA_TYPE: "formulaType",
    CONSTANT_IS_FROM_ERROR: "isFromErrorDataGrid",
    CONSTANT_DISABLE_FORMULA_EDIT: "disableFormula",
    CONSTANT_PREVENT_EDIT_EIN: "preventEINSetting",
    CONSTANT_CREATEPANEL_ENFORCE_EIN: "CreatePanelEnforceEIN",

    CONSTANT_EIN_TYPE_NONE : "None",
    CONSTANT_EIN_TYPE_FREE : "Free",
    CONSTANT_EIN_TYPE_BL_SCRIPT: "BusinessLogicScript",
    CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT: "ExternalSystemEvent",
    CONSTANT_EIN_TYPE_FORMULA: "Formula",
    CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM: "ExternalSystem",

    CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES: "AttributesAndNLSMapping",
    CONSTANT_MENU_CMD_STATE_ENABLED: "enabled",
    CONSTANT_MENU_CMD_STATE_DISABLED: "disabled",
    CONSTANT_SETEIN_TOOLBAR_CLEAR_CMD: "Clear",
    CONSTANT_SETEIN_TOOLBAR_RESET_CMD: "Reset",
    CONSTANT_SETEIN_TOOLBAR_REQUEST_NEW_EIN_CMD: "RequestNewEIN",


    CONSTANT_SETEIN_CMD_EVENT_CLEAR: "ClearEINValue",
    CONSTANT_SETEIN_CMD_EVENT_RESET: "Reset",
    CONSTANT_SETEIN_CMD_EVENT_REQUEST: "Request",
    CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED: "OperationPerformed",


    CONSTANT_TYPE: "Type",
    CONSTANT_NAME: "Name",
    CONSTANT_VALUE: "Value",
    CONSTANT_ORDER: "Order",
    CONSTANT_REGEX: "RegExpr",
    CONSTANT_ATTRIBUTE_NAME: "AttributeName",
    CONSTANT_ATTRIBUTE: "Attribute",
    CONSTANT_COUNTER_SIZE: "CounterSize",
    CONSTANT_COUNTER: "Counter",
    CONSTANT_IS_V6_ENVIRONMENT: "isFromV6Environment",

    CONSTANT_NEW_EIN_VALUE_DISPLAYED: "newEINForFormula",
    CONSTANT_NEW_EIN_VALUE_COMPUTED: "newEINComputedForFormula",

    CONSTANT_EIN_TOUPDATE: "updatedEINValue",

    CONSTANT_FORMULA_DIV_VALUE: "ValueDiv-",
    CONSTANT_FORMULA_EXPRESSION_LIST: "ExpressionList", 
    CONSTANT_CONFIGURED_FORMULA_EXPRESSION: "ConfiguredFormulaExpression",
    CONSTANT_CONFIGURED_REGULAR_EXPRESSION:"AdminDefinedRegularExpressions",
    
    CONSTANT_CMD_ICON_CLEAR: "fonticon fonticon-clear",
    CONSTANT_CMD_ICON_REQUEST_NEW_EIN: "fonticon fonticon-plus",
    CONSTANT_CMD_ICON_RESET: "fonticon fonticon-reset"
  }

  return SetPartConstants;

})

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRequestCmd', [
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
    'DS/ENOXEngineerCommonUtils/xEngAlertManager',
    'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json',
  ], (
    SetPartConstants,
    xEngAlertManager,
    nlsKeys
  ) => {
    'use strict';
    return {
        enableRequestEINCommand: function(options) {
            return (options && (options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_NONE 
                || options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_VALUE_USERINPUT
                || (options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM && options[SetPartConstants.CONSTANT_IS_V6_ENVIRONMENT] == true)
              || (options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_FORMULA && options[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST].length == 1 
              && options[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST][0][SetPartConstants.CONSTANT_TYPE] == SetPartConstants.CONSTANT_EIN_TYPE_FREE)))
        },
        _requestEINValue: function (options, setEINFormat, newEINValue) {
          if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT && options[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR] != SetPartConstants.CONSTANT_VALUE_BL) {
            xEngAlertManager.errorNotif({
              title: nlsKeys.get("eng.partNumber.BL.notSet.Error"),
              subtitle: nlsKeys.get("error.administrator"),
            });
            return;
          }
            switch (setEINFormat) {
              case SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT:
                newEINValue = nlsKeys.get("eng.partNumber.suggestedEIN.bl.new");
                break;
              case SetPartConstants.CONSTANT_EIN_TYPE_FORMULA:
                newEINValue = "";
                break;
              case SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM:
                newEINValue = nlsKeys.get("eng.partNumber.suggestedEIN.ExternalSystem.Requested");
                break;
              default:
                newEINValue = "";
            }
            return newEINValue;
      }
    }
  });

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdFormulaDialog', [
    'UWA/Class',
    'DS/Windows/Dialog',
    'DS/Controls/Button',
    'DS/Form/Form',
    'DS/Core/WebUXGlobalEnums',
    'DS/Windows/ImmersiveFrame',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
    'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'
], function (
    Class,
    WUXDialog,
    Button,
    Form,
    WebUXGlobalEnums,
    ImmersiveFrame,
    SetPartConstants,
    nlsKeys
) {
    /**
     *
     * Component description here ...
     *
     * @constructor
     * @alias module:DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdFormulaDialog
     */
    'use strict';
    var SetPartCmdFormulaDialog = Class.singleton({
        buildStringDiv: function(type, divValue, name){
            let valueBox = {
                id: name,
                label: name,
                value: divValue,
                readOnly: true,
                typeRepresentation: "string",
                semantics: {
                    id: type
                }
            };
            return valueBox;
        },

        buildAttributeDiv: function (type, divValue, name) {
            let valueBox = {
                id: name,
                label: name,
                value: "{" + divValue + "}",
                readOnly: true,
                typeRepresentation: "string",
                semantics: {
                    id: type
                }
            };
            return valueBox;

        },

        buildCounterDiv: function (type, counterSize, name) {
            let nosOfDigits = parseInt(counterSize) != 'NAN' ? parseInt(counterSize) : 1;
            let value = "X".repeat(nosOfDigits);
            let valueBox = {
                id: name,
                label: name,
                value: value,
                readOnly: true,
                typeRepresentation: "string",
                semantics: {
                    id: type
                }
            };
            return valueBox;
        },

        buildUserInputDiv: function (type, name, regex) {
            let that = this;
            let valueBox = {
                id: name,
                label: name,
                value: "",
                readOnly: false,
                typeRepresentation: "string",
                semantics: {
                    pattern: regex,
                    id: type,
                },
                onNodeLiveUpdate: function(data) {
                    let id = data.id;
                    this.updateModelItem(id, {value: data.value});
                    if(this.getModelItem(id).semantics.pattern) {
                        if(that.form.invalidState == true) {
                            this.updateModelItem(id, {helpText: nlsKeys.get("error.regex") + regex});
                            that.okButton.disabled = true;
                        }
                        else{
                            that.okButton.disabled = false;
                        }
                    }
                }
            };
            return valueBox;
        },
        
        buildContainer: function (configuredFormulaExpression, options){
            let that = this;
            that._formulaDialogContainer = UWA.createElement('div', { 'class': "setPart-formula-Dialog-Container" });
            let formContainer = document.createElement('div');
            formContainer.className = "setpart-formula-Dialog-form-container";
            let expressionListInfo = {};
            that.valueFields = [];

            configuredFormulaExpression[SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST] && configuredFormulaExpression[SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST].forEach((expression) => expressionListInfo[expression[SetPartConstants.CONSTANT_ORDER]] = expression);
            let expressionKeys = Object.keys(expressionListInfo);
            let attributes = options[SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES] ? options[SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES] : {};
            if (expressionKeys.length === 0){
                that.valueFields.push(that.buildUserInputDiv(SetPartConstants.CONSTANT_EIN_TYPE_FREE, nlsKeys.get("eng.partNumber.formula.key.UserInput"))); 
            }
            else{
                expressionKeys.forEach(function (key) {
                    let expression = expressionListInfo[key];
                    if (!expression) { return; }
                    let type = expression && expression[SetPartConstants.CONSTANT_TYPE];
                    let name = expression && expression[SetPartConstants.CONSTANT_NAME];
                    let regex = (expression && expression[SetPartConstants.CONSTANT_REGEX]) ? expression[SetPartConstants.CONSTANT_REGEX] : "";
                    let valueDiv;
                    switch (type) {
                        case "String": valueDiv = that.buildStringDiv(type, expression[SetPartConstants.CONSTANT_VALUE], name); break;
                        case "Attribute": valueDiv = that.buildAttributeDiv(type, attributes[expression[SetPartConstants.CONSTANT_ATTRIBUTE_NAME]] ? attributes[expression[SetPartConstants.CONSTANT_ATTRIBUTE_NAME]] : expression[SetPartConstants.CONSTANT_ATTRIBUTE_NAME], name); break;
                        case "Counter": valueDiv = that.buildCounterDiv(type, expression[SetPartConstants.CONSTANT_COUNTER_SIZE], name); break;
                        case "Free": valueDiv = that.buildUserInputDiv(type, name, regex); 
                            if(regex){
                                valueDiv["helpText"] = nlsKeys.get("error.regex") + regex;
                            }
                            break;
                        default: break;
                    }
                    if(valueDiv) {
                        that.valueFields.push(valueDiv);
                    }  
                });    
            }
            that.form = new Form({
                model: that.valueFields,
                invalidDisplayPolicy: WebUXGlobalEnums.InvalidDisplayPolicy.Always,
            }).inject(formContainer);
            that._formulaDialogContainer.appendChild(formContainer);
            return that._formulaDialogContainer;
        },

        _getNewEINValue :function(){
            let that = this;
            let newEINValue = {};            
            that.form && Array.isArray(that.form.model) && that.form.model.length>0 && that.form.model.forEach(valueInformation=>{
                let value = (valueInformation.getValue) ? valueInformation.getValue() : that.form.getModelItem(valueInformation.id).value;
                let id = (valueInformation.getId) ? valueInformation.getId() : valueInformation.id;
                let type = (valueInformation.getName) ? valueInformation.getName() : that.form.getModelItem(valueInformation.id).semantics.id;
                newEINValue[id] = {};
                newEINValue[id][SetPartConstants.CONSTANT_VALUE] = value;
                newEINValue[id][SetPartConstants.CONSTANT_TYPE] = type;
            })
            return newEINValue;
        },
        _buildEINValue: function(generatedEINValue, computedValue){
            let count = 0;
            let einValues = {};
            let newEIN = "";
            let computedEINToupdate = "";
            Object.keys(generatedEINValue).forEach(function (key) { 
                let einField = generatedEINValue[key];
                let type = einField[SetPartConstants.CONSTANT_TYPE];
                let value = (type === SetPartConstants.CONSTANT_ATTRIBUTE) ? computedValue[count] : einField[SetPartConstants.CONSTANT_VALUE];
                let computedEINvalue = "";
                switch(type){
                    case SetPartConstants.CONSTANT_ATTRIBUTE: computedEINvalue = value; break;
                    case SetPartConstants.CONSTANT_COUNTER: computedEINvalue =  "@@C@@<counter>@@C@@" ;break;
                    default: computedEINvalue = einField[SetPartConstants.CONSTANT_VALUE]; break;
                } 
                newEIN = newEIN + value;
                computedEINToupdate = computedEINToupdate + computedEINvalue;
                count++;
            });
            einValues[SetPartConstants.CONSTANT_NEW_EIN_VALUE_DISPLAYED] = newEIN;
            einValues[SetPartConstants.CONSTANT_NEW_EIN_VALUE_COMPUTED] = computedEINToupdate;
            return einValues;
        },
        _updateNodesWithInfo: function(selectedNodes){
            let that = this;
            if(!Array.isArray(selectedNodes)){console.log("No valid information Selected");return;}
            let generatedEIN = that._getNewEINValue();
            selectedNodes && selectedNodes.length>0 && selectedNodes.forEach(node=>{
                let computedEIN = node.options.grid.newpartnumber.split(new RegExp(['@@C@@', '@@T@@', '@@A@@', '@@F@@'].join('|'), '')).filter((item, index) => index % 2);
                //let computedEIN = node.options.grid.newpartnumber.split(/[|@|@@]+/);
                let newEIN = that._buildEINValue(generatedEIN, computedEIN);
                node && node.updateOptions && node.updateOptions(
                    {
                        grid: {
                            [SetPartConstants.CONSTANT_NEW_EIN]: newEIN[SetPartConstants.CONSTANT_NEW_EIN_VALUE_DISPLAYED],
                            [SetPartConstants.CONSTANT_EIN_TOUPDATE]: newEIN[SetPartConstants.CONSTANT_NEW_EIN_VALUE_COMPUTED]
                        }
                    }
                )
            });
        },

        buildOkButton: function(selectedNodes, grid) {
            let that = this;
            that.okButton = new Button({
                label: nlsKeys.get("eng.partNumber.formula.button.ok"),
                domId: "OK_Button",
                onClick: function (e) {
                    that._updateNodesWithInfo(selectedNodes);
                    if (grid && grid.enableDisableToolbarCmdsOnUserSelections && grid.getSelectedEINNodes){
                        grid.enableDisableToolbarCmdsOnUserSelections(grid.getSelectedEINNodes());
                    }
                    that.formulaDialog.immersiveFrame.getModel().elements.container.destroy();
                }
            })
            return that.okButton;
        },
        
        buildDialogboxContent: function (container, selectedNodes, configuredFormulaExpression, grid, options) {
            let that = this;
            container = (document.getElementsByClassName("set-partNumber-modal").length > 0) ? document.getElementsByClassName("set-partNumber-modal")[0] : container;
            let immersiveFrame = new ImmersiveFrame();
            immersiveFrame.inject(container);
            that.formulaDialog = new WUXDialog({
                title: nlsKeys.get("eng.partNumber.header.formula.RequestEIN"), 
                content: that.buildContainer(configuredFormulaExpression, options),
                immersiveFrame: immersiveFrame,
                resizableFlag: true,
                width: 400,
                height: 400,
                modalFlag: true,
                closeButtonFlag: false,
                touchMode: true,
                buttons: {
                    Ok: that.buildOkButton(selectedNodes, grid),
                    Cancel: new Button({
                        label: nlsKeys.get("eng.ui.button.cancel"),
                        domId: "Cancel_Button",
                        onClick: function (e) {
                            that.formulaDialog.immersiveFrame.getModel().elements.container.destroy();
                        }
                    })
                }
            });
            that.enableDisableOkButton();
        },
        enableDisableOkButton: function() {
            if(this.form) {
                this.okButton.disabled = (this.form.invalidState) ? true: false;
            }
        },
    });
    return SetPartCmdFormulaDialog;
});

/**
 * @module DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRMBHandler
 */
define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRMBHandler', [
    'UWA/Class',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
    'DS/ENOXEngineerCommonUtils/xEngAlertManager',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdFormulaDialog',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRequestCmd',
    'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'
], function (
    Class,
    SetPartConstants,
    xEngAlertManager,
    SetPartCmdFormulaDialog,
    SetPartCmdRequestCmd,
    nlsKeys
    ) {
    'use strict';
    /**
     *
     * Component description here ...
     *
     * @constructor
     * @alias module:DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRMBHandler
     */
    var SetPartCmdRMBHandler = Class.singleton(
        {
            initialize: function (options) {
                this.options = options.options;
            },

            getEmptyMenu: function(){
                var that = this;
                var menu = [];
                menu.push({
                    title: nlsKeys.get("eng.partNumber.rmb.menu.noactions.title"),
                    type: 'PushItem',
                    state: SetPartConstants.CONSTANT_MENU_CMD_STATE_DISABLED
                });
                return menu;
            },

            getRMBMenu: function (params, collectionParams, listView) {
                let menu = [];
                let that = this;
                that.configuredFormulaExpression = collectionParams[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION];
                that.view = listView;
                //that.collectionParams = collectionParams;
                let selectedNodes = params && params.cellInfos && params.cellInfos.nodeModel ? params.cellInfos.nodeModel : null;
                let stateOfRequestEIN = SetPartConstants.CONSTANT_MENU_CMD_STATE_ENABLED;
                let stateOfResetEIN = SetPartConstants.CONSTANT_MENU_CMD_STATE_DISABLED;

                if (!Array.isArray(selectedNodes)) {
                    selectedNodes = [selectedNodes];
                }
                
                if (Array.isArray(selectedNodes)) {
                    selectedNodes.every(function (node) {
                        if (node && node._isFromOriginalModel()) {
                            if (node.options.grid[SetPartConstants.CONSTANT_NEW_EIN] != node.options.grid[SetPartConstants.CONSTANT_OLD_PART_NUMBER]) {
                                stateOfResetEIN = SetPartConstants.CONSTANT_MENU_CMD_STATE_ENABLED;
                            } 
                            if (node.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN]) {
                                stateOfRequestEIN = SetPartConstants.CONSTANT_MENU_CMD_STATE_DISABLED;
                                if (node.options.grid[SetPartConstants.CONSTANT_NEW_EIN]==="")
                                stateOfResetEIN = SetPartConstants.CONSTANT_MENU_CMD_STATE_ENABLED;
                            } 
                            return false;
                        }
                        return true;
                    })
                }
                menu.push({
                    title: nlsKeys.get("eng.partNumber.cmd.clear"),
                    icon: SetPartConstants.CONSTANT_CMD_ICON_CLEAR,
                    type: 'PushItem',
                    action: {
                        'this': that,
                        context: selectedNodes,
                        callback: this._clearEINValue.bind(this, collectionParams[SetPartConstants.CONSTANT_EIN_FORMAT], that.view.partNumberGridView) 
                    }
                });

                menu.push({
                    title: nlsKeys.get("eng.partNumber.cmd.reset"),
                    icon: SetPartConstants.CONSTANT_CMD_ICON_RESET,
                    type: 'PushItem',
                    state: stateOfResetEIN,
                    action: {
                        'this': that,
                        context: selectedNodes,
                        callback: this._resetEINValue.bind(this, collectionParams[SetPartConstants.CONSTANT_EIN_FORMAT], that.view.partNumberGridView)
                    }

                });

                if (!SetPartCmdRequestCmd.enableRequestEINCommand(collectionParams)) {
                    menu.push({
                        title: nlsKeys.get("eng.partNumber.cmd.requestNewEIN"),
                        icon: SetPartConstants.CONSTANT_CMD_ICON_REQUEST_NEW_EIN,
                        type: 'PushItem', 
                        state: stateOfRequestEIN,
                        action: {
                            'this': that,
                            context: selectedNodes,
                            callback: this._requestEINValueForCommand.bind(this, collectionParams, that.view.partNumberGridView)
                        }
                    });
                }
                return menu;
            },
            _clearEINValue: function (setEINFormat, grid, nodes){
                let selectedNodes = nodes.context;
                let that = this;
                if (Array.isArray(selectedNodes)) {
                   selectedNodes.forEach(function(node){
                       that._updateEINOnColNewEIN(setEINFormat, grid, node, "", SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_CLEAR);
                    })
                }
            },

            _resetEINValue: function (setEINFormat, grid, nodes){
                let selectedNodes = nodes.context;
                var that = this;
                if (Array.isArray(selectedNodes)){
                    selectedNodes.forEach(function (node) {
                        let revPNs = (node.getAttributeValue && node.getAttributeValue(SetPartConstants.CONSTANT_SUGGESTED_EIN))
                            ? node.getAttributeValue(SetPartConstants.CONSTANT_SUGGESTED_EIN)[0] : undefined;
                        let oldEIN = (node.getAttributeValue) ? node.getAttributeValue(SetPartConstants.CONSTANT_OLD_PART_NUMBER) : "";
                        that._updateEINOnColNewEIN(setEINFormat, grid, node, revPNs ? revPNs : oldEIN, SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_RESET);
                    })
                }                
            },

            _requestEINValueForCommand: function (options, grid, nodes){
                var that = this;
                let selectedNodes = nodes.context;
                let setEINFormat = options[SetPartConstants.CONSTANT_EIN_FORMAT];
                let newEINValue = SetPartCmdRequestCmd._requestEINValue(options, setEINFormat, "");
                if(newEINValue != undefined) { 
                    if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_FORMULA){
                        SetPartCmdFormulaDialog.buildDialogboxContent(widget.body, selectedNodes, options[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION], grid, options);
                        if (Array.isArray(selectedNodes)){
                        selectedNodes.forEach(function(node){
                            that._updateEINOnColNewEIN(setEINFormat, grid, node, newEINValue, SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST)
                        })
                        }
                    }else{
                        if (Array.isArray(selectedNodes)) {
                            selectedNodes.forEach(function (node) {
                                let revPNs = (node && node.options && node.options.grid && node.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN])
                                    ? node.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN] : undefined;
                                that._updateEINOnColNewEIN(setEINFormat, grid, node, (Array.isArray(revPNs) && revPNs.length > 0) ? node.options.grid.oldpartnumber : newEINValue, SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST);
                            })
                        }
                    }
                }
                
            },

            _updateGridValues: function (setEINFormat,value,event){
                let gridValue = {
                    [SetPartConstants.CONSTANT_NEW_EIN]: value,
                    [SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED] : event
                }
                if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT){
                    gridValue[SetPartConstants.CONSTANT_EIN_TOUPDATE] = SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT;
                }
                if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM) {
                    gridValue[SetPartConstants.CONSTANT_EIN_TOUPDATE] = SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT;
                }

                return gridValue;
            },

            _updateEINOnColNewEIN: function (setEINFormat, grid, node,value, event){
                let that = this;
                let gridValue = that._updateGridValues(setEINFormat,value, event);
                
                node && node.updateOptions && node.updateOptions(
                    {
                        grid: gridValue
                    }
                )
                grid.enableDisableToolbarCmdsOnUserSelections(grid.getSelectedEINNodes());
            }
        });
    return SetPartCmdRMBHandler;
});

define('DS/EngineeringItemCmd/SetPartNumberFacet/ENONewEINServices', [
    'DS/ENOXEngineerCommonUtils/XENPlatform3DXSettings',
    'DS/ENOXEngineerCommonUtils/PromiseUtils',
    'DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberHttpClient',
  ], (
    XENPlatform3DXSettings,
    PromiseUtils,
    xAppWSCalls,
  ) => {
    "use strict";
    return {
        retrievePartNumberAttrForCreateNew: function() {
            let myRetrievePartNumCommand = XENPlatform3DXSettings.getCommand('mcs_retrievePartNumberForCreateNew');
            let parameters = this.transactionParameters;
            let payload = {};
            if(parameters){	payload["winTransactionParameters"] =  parameters;	}
            return PromiseUtils.wrappedWithCancellablePromise(function(resolve, reject) {
              xAppWSCalls.perform(myRetrievePartNumCommand, JSON.stringify(payload)).then(function(res) {
                return resolve(res);
                  }).catch(function(errors) {
                    reject(errors);
                  });
                });
        },
        readAttributes: function ({ lIds = [], busIDs = [], relIDs = [] }) {
            const defaultPayload = {
              lIds,
              relIDs,
              busIDs,
              "plmparameters": "false",
              "attributes": "true",
              "navigateToMain": "false",
              "readonly": "true",
              "debug_properties": ""
            };
            const authoringContext = XENPlatform3DXSettings.getAuthorizedChange() ? XENPlatform3DXSettings.getAuthorizedChange().AuthoringContextHeader : undefined;
            const payload = authoringContext ? { ...defaultPayload, ...authoringContext } : defaultPayload;
            let requestURL = XENPlatform3DXSettings.getCommand('mcs_attributes');
            return PromiseUtils.wrappedWithCancellablePromise(function (resolve, reject) {
                xAppWSCalls.perform(requestURL, JSON.stringify(payload)).then(function (result) {
                    return resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
            });
          },

    }
  });

/**
 * @module DS/EngineeringItemCmd/SetPartNumberCmd/SetPartRowsGenerator
 */
define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartRowsGenerator', [
        'UWA/Core',
        'UWA/Class',
        'DS/TreeModel/TreeNodeModel',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
        'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'
    ], function (
        UWA,
        Class,
        TreeNodeModel,
        SetPartConstants,
        nlsKeys) {
    'use strict';
    /**
     *
     * Component description here ...
     *
     * @constructor
     * @alias module:DS/EngineeringItemCmd/SetPartNumberCmd/SetPartRowsGenerator
     * @param {Object} options options hash or a option/value pair.
     */
    var GridViewRowsGenerator = Class.singleton(
            /**
             * @lends module:DS/EngineeringItemCmd/SetPartNumberCmd/SetPartRowsGenerator
             */
        {
            init: function (options) {
                this._parent(options);
            },
            createItemNode : function (item) {
                var that = this;
                
                var rowOptions = that.basicOptionsBuilder(item);
                var currentNode = new TreeNodeModel(rowOptions);
                return currentNode;
            },
            basicOptionsBuilder: function (rowAttr) {
                var that = this;
                this.Options = {};

                this.Options = Object.assign({
                        grid: {}
                    }, rowAttr);
                that._fillAttributes(rowAttr);

                return this.Options;
            },
            _fillAttributes: function (attrsMap) {
                var that = this;
                Object.keys(attrsMap)
                .forEach(function (attrName) {
                    that.Options.grid[attrName] = attrsMap[attrName];
                });
                return this.Options;
            },
            createItemNodes : function (items) {
                var result = [];
                var that = this;

                items.forEach(function (item) {
                    if(item.status == SetPartConstants.CONSTANT_COMPUTED){
                          var currentNode = that.createItemNode(item);
                          result.push(currentNode);
                    }
                });
                return result;
            }

        });
    return GridViewRowsGenerator;
});

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdToolbar', [
    'DS/UIKIT/Iconbar',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRMBHandler',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRequestCmd',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
    'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'

], function (
    Iconbar,
    SetPartCmdRMBHandler,
    SetPartCmdRequestCmd,
    SetPartConstants,
    nlsKeys) {

    'use strict';

    function SetPartCmdToolBar() {}
    SetPartCmdToolBar.prototype.createActionBarWrapper = function () {
        this.toolBarContainer = UWA.createElement('div', {
            'id': 'listview-toolbar',
            'styles': {
                'height': '40px',
                'width': '100%'
            }
        });

        this.toolBarActionsContainer = UWA.createElement('div', {
            'class': 'enox-alternate-toolbar-actions'
        }).inject(this.toolBarContainer);

        return this.toolBarContainer;

    };

    SetPartCmdToolBar.prototype.AddToolbarCommand = function (options) {

        if (this._actionsIconBar != undefined) {
            this._actionsIconBar.addItem({
                id: options.id,
                fonticon: options.fonticon,
                className: options.className,
                text: options.text,
                handler: options.handler,
                selected: false,
                allowSelectRetain: options.allowSelectRetain,
                disabled: options.disabled
            });
        }
        return this;
    };
    SetPartCmdToolBar.prototype.getToolbarCommands = function (grid, collectionParams){
        var actions = [];
        let setEINFormat = collectionParams[SetPartConstants.CONSTANT_EIN_FORMAT];
        actions.push({
            id: SetPartConstants.CONSTANT_SETEIN_TOOLBAR_CLEAR_CMD,
            text: nlsKeys.get("eng.partNumber.cmd.clear"),
            disabled: true,
            fonticon: SetPartConstants.CONSTANT_CMD_ICON_CLEAR,
            handler: function (e) {
                SetPartCmdRMBHandler._clearEINValue(setEINFormat, grid, { context: grid.getSelectedEINNodes() });
            }
        });
        actions.push({
            id: SetPartConstants.CONSTANT_SETEIN_TOOLBAR_RESET_CMD,
            text: nlsKeys.get("eng.partNumber.cmd.reset"),
            fonticon: SetPartConstants.CONSTANT_CMD_ICON_RESET,
            disabled: true,
            handler: function (e) {
                SetPartCmdRMBHandler._resetEINValue(setEINFormat, grid, { context: grid.getSelectedEINNodes() });
            }
        });
        if (!SetPartCmdRequestCmd.enableRequestEINCommand(collectionParams))
            actions.push({
                id: SetPartConstants.CONSTANT_SETEIN_TOOLBAR_REQUEST_NEW_EIN_CMD,
                text: nlsKeys.get("eng.partNumber.cmd.requestNewEIN"),
                fonticon: SetPartConstants.CONSTANT_CMD_ICON_REQUEST_NEW_EIN,
                className: 'setPart-toolbar-item-disable',
                disabled: true,
                handler: function (e) {
                    SetPartCmdRMBHandler._requestEINValueForCommand(collectionParams, grid, { context: grid.getSelectedEINNodes() });
                }
        });
        return actions;
    };

    SetPartCmdToolBar.prototype.AddToolbarCommands = function (container,grid,collections) {
        var that = this;
        this.initializeIconbar(container);
        let commands = that.getToolbarCommands(grid, collections);

        if (!Array.isArray(commands))
            throw new Error('invalid input for AddToolbarCommands ');
        
        commands.forEach(function (action) {
            that.AddToolbarCommand(action);
        });
        return this;
    };
    SetPartCmdToolBar.prototype.initializeIconbar = function (container) {
        this._actionsIconBar = new Iconbar({
            renderTo: container,
            tooltipsTrigger: "touch"
        });
    };
    return SetPartCmdToolBar;

});

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdColsMgt', [
		'UWA/Class',
		'DS/WebappsUtils/WebappsUtils',
		'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
		'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'
	], function (
		Class,
		WebappsUtils,
		SetPartConstants,
		nlsKeys) {
	'use strict';
	/**
	 *
	 * Component description here ...
	 *
	 * @constructor
	 * @alias module:'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdColsMgt'
	 * @param {Object} options options hash or a option/value pair.
	 */

	var SetPartCmdColsMgt = Class.singleton(
			/**
			 * @lends module:'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdColsMgt'
			 */
		{
			init: function (options) {
				this._parent(options);
			},

			_columnConfiguration: function (params) {
				var isFromErrorDataGrid = params[SetPartConstants.CONSTANT_IS_FROM_ERROR];
				var preventEINSetting = params[SetPartConstants.CONSTANT_PREVENT_EDIT_EIN];

				var that = this;
				var cols = [];
				//var attrsInfo = this.getDataIndex(params);
				that.getDefaultColumns(cols, isFromErrorDataGrid, preventEINSetting);

				//avoid building of new columns for block EIN setting
				if (preventEINSetting) {
					return cols;
				}
				that.getColumnConfiguration(cols, isFromErrorDataGrid, params);
				return cols;
			},

			getDefaultColumns: function (cols, isFromErrorDataGrid, preventEINSetting) {
				var that = this;
				if (isFromErrorDataGrid) {
					cols.push({
						"text": nlsKeys.get("eng.partNumber.error"),
						"dataIndex": SetPartConstants.CONSTANT_COLUMN_ERROR,
						"sortableFlag": true,
						"pinned": "left",
						"width": "40px",
						"allowUnsafeHTMLContent": true,
						getCellValue: function (cellInfos) {
							if (cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_COLUMN_ERROR]) {
								return that.buildErrorColumnContent(cellInfos.nodeModel.options);
							} else {
								return "";
							}
						}
					})
				}
				cols.push({
					"text": nlsKeys.get("engineering_item_title"),
					"dataIndex": SetPartConstants.CONSTANT_TITLE,
					"pinned": "left",
					"width": "240px",
					"sortableFlag": true,
					"typeRepresentation": "url",
					"allowUnsafeHTMLContent": false,
					getCellValue: function (cellInfos) {
						let iconDisplay = (cellInfos.nodeModel && cellInfos.nodeModel.options && cellInfos.nodeModel.options.grid && cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMED] === "TRUE")
						 ? "fonticon fonticon-attention" : "";
						return {
							icon: iconDisplay,
							label: cellInfos.nodeModel.options.grid.name,
							url: ""
						};
					},
					getCellTooltip: function (cellInfos) {
						if (!cellInfos || !cellInfos.nodeModel)
							return null;
						let tooltip = (cellInfos.nodeModel && cellInfos.nodeModel.options && cellInfos.nodeModel.options.grid && cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMED] === "TRUE")
						 ? nlsKeys.get("eng.partNumber.deformed").replace('$1', cellInfos.nodeModel.options.grid.name)
						 : cellInfos.nodeModel.options.grid.name;
						return {
							shortHelp: tooltip,
							updateModel: false
						}
					},
					getCellClassName: function (cellInfos) {
						if (!cellInfos || !cellInfos.nodeModel)
							return null;
						return (cellInfos.nodeModel && cellInfos.nodeModel.options && cellInfos.nodeModel.options.grid && cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMED] === "TRUE")
						 ? 'setEIN-Deformed-column-information' : '';
					},
					getCellValueForCopy: function (cellInfos) {
						return cellInfos.cellModel.label;
					}
				});

				if (preventEINSetting) {
					cols.push({
						"text": nlsKeys.get("eng.partNumber.old"),
						"dataIndex": SetPartConstants.CONSTANT_EXISTINGPN,
						"allowUnsafeHTMLContent": false,
						"sortableFlag": true,
						getCellValue: function (cellInfos) {
							return cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_OLD_PART_NUMBER];
						}
					});
				}
			},

			getColumnConfiguration: function (cols, isFromErrorDataGrid, params) {
				var that = this;
				var columnName = SetPartConstants.CONSTANT_NEW_EIN;
				var isEditableColumn = (params[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] == SetPartConstants.CONSTANT_TRUE || params[SetPartConstants.CONSTANT_EIN_FORMAT] === SetPartConstants.CONSTANT_VALUE_USERINPUT);
				var newEINColsConfig = {
					"text": nlsKeys.get("eng.partNumber.new"),
					"dataIndex": SetPartConstants.CONSTANT_NEW_EIN,
					"allowUnsafeHTMLContent": false,
					"sortableFlag": true,
					"editableFlag": isEditableColumn,
					getCellValue: function (cellInfos) {
						return that.getCurrentCellValue(cellInfos, isFromErrorDataGrid, columnName);
					},
					getCellTypeRepresentation: function (cellInfos) {
						return that.getCellType(cellInfos, isFromErrorDataGrid, columnName);
					},
					getCellEditableState: function (cellInfos) {
						return that.enableEditableMode(cellInfos, isEditableColumn, isFromErrorDataGrid, columnName);
					}, 
					getCellClassName: function (cellInfos) {
						return that.getCellStyle(cellInfos);
					}, 

					getCellTooltip: function (cellInfos) {
						if (!(cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options && cellInfos.nodeModel.options.grid)) return;
						var currentCellDisplayValue = cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_NEW_EIN];
						var deformedEINValue = cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMABLE_EIN];
						let value = currentCellDisplayValue;
						if (!currentCellDisplayValue && deformedEINValue) {
							value = nlsKeys.get("eng.partNumber.deformableEIN.Tooltip");
						}
						return {
							shortHelp: value,
							updateModel: false
						}
					},
				}
				if (isEditableColumn) {
					newEINColsConfig["setCellValue"] = function (cellInfos, value) {
					let eventperformed = (value === "") ? SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_CLEAR : SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST;
						cellInfos.nodeModel.updateOptions({
							grid: {
								[SetPartConstants.CONSTANT_NEW_EIN]: value,
								[SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED]: eventperformed,
								[SetPartConstants.CONSTANT_EIN_TOUPDATE]: ""
							}
						});
					};
					newEINColsConfig["getCellValueForCopy"] = function (cellInfos) {
						return cellInfos.cellModel;
					};
					newEINColsConfig["processCellValueFromPaste"] = function (cellInfos, textToPaste) {
						return textToPaste;
					};
				}
				cols.push(newEINColsConfig);

			},
			splitFormula: function (formula, formulaType, disableFormula) {
				if ((formula == "" && formulaType == SetPartConstants.CONSTANT_VALUE_BL) || disableFormula) {
					return [SetPartConstants.CONSTANT_SINGLE_COLUMN];
				}

				if (formula == "") {
					return [SetPartConstants.CONSTANT_FREE];
				}

				var formulaArray = formula.split('|@|');

				formulaArray = formulaArray.filter(element => element != "");

				return formulaArray;
			},
			fillRowInfo: function (item, disableFormula) {
				var columnsArray = [];

				var displayValue = SetPartConstants.CONSTANT_FREE;
				var jsonObject = {};
				if (item[SetPartConstants.CONSTANT_SUGGESTED_EIN] && item[SetPartConstants.CONSTANT_SUGGESTED_EIN].length > 0) {
					item[SetPartConstants.CONSTANT_NEW_EIN] = this.getColumnCellValue(item, displayValue);
				} else {
					item[SetPartConstants.CONSTANT_NEW_EIN] = item[SetPartConstants.CONSTANT_OLD_PART_NUMBER];
				}
				jsonObject[SetPartConstants.CONSTANT_NEW_EIN] = this.getColumnCellValue(item, displayValue);
				columnsArray.push(jsonObject);
				item[SetPartConstants.CONSTANT_NEW_COLUMNS_KEY] = columnsArray;

			},
			buildErrorColumnContent: function (options) {
				var errorDiv = UWA.createElement('div', {
						class: "setpartcmd_error_column"
					})
					var errorImageDiv = new UWA.createElement("img", {
						class: "setpartcmd_error_column_image"
					});
				errorImageDiv.src = WebappsUtils.getWebappsAssetUrl('EngineeringItemCmd', 'icons/32/I_Warning.png');

				var errorTextDiv = UWA.createElement('span', {
						class: "setpartcmd_error_column_text"
					})
					errorTextDiv.innerText = options.grid[SetPartConstants.CONSTANT_COLUMN_ERROR];
				errorDiv.appendChild(errorImageDiv);
				errorDiv.appendChild(errorTextDiv);
				return errorDiv.outerHTML;
			},
			getCurrentEINValue: function (cellInfos, columnName, isFromErrorDataGrid) {
				var currentCellDisplayValue = cellInfos.nodeModel.options.grid[columnName];
				var deformedEINValue = cellInfos.nodeModel.getAttributeValue(SetPartConstants.CONSTANT_DEFORMABLE_EIN);
				if ( deformedEINValue && currentCellDisplayValue === "") {
					return deformedEINValue;
				}
				var suggestedEINArray = cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN];
				if (!suggestedEINArray || (suggestedEINArray.length >= 1 && this.isTargetedColumnID(cellInfos, isFromErrorDataGrid))) {
					return currentCellDisplayValue;
				}
				else {
					return "";
				}
			},

			getCellStyle: function (cellInfos){
				if (!(cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options && cellInfos.nodeModel.options.grid)) return;
				var currentCellDisplayValue = cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_NEW_EIN];
				var deformedEINValue = cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMABLE_EIN];
				if(!currentCellDisplayValue && deformedEINValue){
					return "cellStyleForDefomedObjectClearCell";
				}
			},

			enableEditableMode: function (cellInfos, isEditable, isFromErrorDataGrid, columnName) {
				if (cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_DEFORMABLE_EIN] && cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN].length==1){
					return false;
				}
				return cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN] ? cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN].length > 1 && this.isTargetedColumnID(cellInfos, isFromErrorDataGrid) ? true : false : isEditable;
			},
			comboboxShouldbeEnabled: function (cellInfos, isFromErrorDataGrid) {
				return cellInfos.nodeModel && cellInfos.nodeModel._isFromOriginalModel() && (cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN] || (cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN] && cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN].length>1)) && this.isTargetedColumnID(cellInfos, isFromErrorDataGrid);
			},
			getCurrentCellValue: function (cellInfos, isFromErrorDataGrid, columnName) {
				return this.getCurrentEINValue(cellInfos, columnName, isFromErrorDataGrid);
			},
			isTargetedColumnID: function (cellInfos, isFromErrorDataGrid) {
				return (cellInfos.columnID == 1 || (isFromErrorDataGrid && cellInfos.columnID == 3));
			},
			getColumnCellValue: function (item, displayValue) {
				return item[SetPartConstants.CONSTANT_SUGGESTED_EIN] ? item[SetPartConstants.CONSTANT_SUGGESTED_EIN].length == 1 ? item[SetPartConstants.CONSTANT_SUGGESTED_EIN][0] : item[SetPartConstants.CONSTANT_OLD_PART_NUMBER] ? item[SetPartConstants.CONSTANT_OLD_PART_NUMBER] : item[SetPartConstants.CONSTANT_SUGGESTED_EIN][0] : displayValue;
			},
			getCellType: function (cellInfos, isFromErrorDataGrid, columnName) {
				if (this.comboboxShouldbeEnabled(cellInfos, isFromErrorDataGrid)) {
					return cellInfos.nodeModel.options.grid[SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN_VALUES];
				} else {
					return "string";
				}
			}

		});
	return SetPartCmdColsMgt;
});

define('DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberListView', [
        'UWA/Core',
        'UWA/Class/View',
        'DS/Handlebars/Handlebars4',
        'DS/UIKIT/Spinner',
        'DS/TreeModel/TreeDocument',
        'DS/DataGridView/DataGridView',
        'DS/UIKIT/Iconbar',
        'DS/ENOXEngineerCommonUtils/xEngAlertManager',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRMBHandler',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdToolbar',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdColsMgt',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartRowsGenerator',
        'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
        'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json',
        'text!DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberListView.html',
        'css!DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberListView.css'
    ],
    function (UWA,
        View,
        Handlebars4,
        Spinner,
        TreeDocument,
        DataGridView,
        Iconbar,
        xEngAlertManager,
        SetPartCmdRMBHandler,
        SetPartCmdToolbar,
        SetPartCmdColsMgt,
        SetPartRowsGenerator,
        SetPartConstants,
        nlsKeys,
        HTMLsetPartNumberListView) {
    'use strict';

    var setPartNumberListView = View.extend({
            name: 'setPartNumberListView',
            tagName: 'div',
            collection: null, //new links([]),
            toupdate: null,
            spinner: null,
            successCount : 0,
            invalidObjectsCount : 0,
            preventEINSetting : false,
            setCollection: function (collection) {
                var that = this;
                this.collection = collection;
                // IDENTIFY WHICH ARE THE ITEM TO BE UPDATED
                this.toupdate = collection[SetPartConstants.CONSTANT_KEY_REFERENCES].filter(function (item) {
                        return item[SetPartConstants.CONSTANT_OLD_PART_NUMBER] !== item[SetPartConstants.CONSTANT_NEW_PART_NUMBER];
                    });
                this.toupdate.check = function (id, newvalue) {
                    // IE :(
                    var exist = this.filter(function (item) {
                            return item.id === id;
                        })[0];
                    if (UWA.is(exist, 'object')) {
                        exist[SetPartConstants.CONSTANT_NEW_PART_NUMBER] = newvalue;
                    } else {
                        // IE :(
                        var item = that.collection.references.filter(
                                function (item) {
                                return item.id === id;
                            })[0];
                        item[SetPartConstants.CONSTANT_NEW_PART_NUMBER] = newvalue;
                        this.push(item);
                    }
                };
                return this;
            },
            getPendingChanges: function () {
                return this.toupdate;
            },
            destroy: function () {
                this._parent();
                this.collection = null;
            },
            render: function () {
                var that = this;
                this.container.addClassName('setPartNumberListView-container');
                if (!this.collection) {
                    if (!this.spinner) {
                        this.spinner = new Spinner().inject(this.container);
                    }
                    this.spinner.show();
                } else {
                    this.spinner.hide();
                }

                this._initDivs();

                if (this.collection) {

                    this.partNumberFormula = that.getFormula();
                    that.setBlockEINSetting(this.collection[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] , this.collection[SetPartConstants.CONSTANT_EIN_FORMAT] , this.collection[SetPartConstants.CONSTANT_IS_V6_ENVIRONMENT]);
                    that.buildGridView();
                    that.buildEINInfo();
                    if (!this.isEINSettingBlockedForUsers()) {
                        that.buildToolbar();
                    }
                    that.displaySelectionInfo(this.collection);
                }
                return this.container;
            },

        getDataToBeUpdated: function () {
            //Read data from UI - Start
            var that = this;
            var toUpdateArray = [];
            var allRevisionsPartNumberObject = {};

            var selectedNodes = this.partNumberModel.getAllDescendants();
            selectedNodes.forEach(node=>{
                var toUpdateObj = {};
                var objId = node.options.grid.id;
                if (node.options.grid[SetPartConstants.CONSTANT_OLD_PART_NUMBER] != node.options.grid[SetPartConstants.CONSTANT_NEW_EIN]){
                    let newEIN = node.options.grid[SetPartConstants.CONSTANT_NEW_EIN];
                    let newEINToUpdate = node.options.grid[SetPartConstants.CONSTANT_EIN_TOUPDATE];
                    toUpdateObj[SetPartConstants.CONSTANT_PHYSICAL_ID] = objId;
                    toUpdateObj[SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED] = node.options.grid[SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED];
                    if (node.options.grid[SetPartConstants.CONSTANT_EIN_TOUPDATE] != SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT && node.options.grid[SetPartConstants.CONSTANT_EIN_TOUPDATE] != SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT){
                        toUpdateObj[SetPartConstants.CONSTANT_KEY_PN] = (newEINToUpdate) ? newEINToUpdate : newEIN;
                    }
                    toUpdateArray.push(toUpdateObj);
                    that.updateUserMappedPN(node, allRevisionsPartNumberObject, objId);

                }
            });

            return that.getUpdatedCollection(toUpdateArray, allRevisionsPartNumberObject)
        },
        _initDivs: function () {
            var template = Handlebars4.compile(HTMLsetPartNumberListView);
            this._container = UWA.createElement('div', {
                'class': "setPartNumberListView-container-wrapper"
            });

                var options = {
                    updateCheckbox: true,
                    viewContent: true
                }

                this.container.appendChild(this._container);
                this._container.innerHTML = template(options);

                this.checkboxDiv = this._container.querySelector('.setPartNumberListView-container-info-checkbox');
                this.toolbarDiv = this._container.querySelector('.setPartNumberListView-container-toolbar');
                this.setEINInfoDiv = this._container.querySelector('.setPartNumberListView-container-info-message');
                this.gridviewContent = this._container.querySelector('.setPartNumberListView-container-view');

        },
        
        buildToolbar:function(){
            var that = this;
            that.infoContainer = UWA.createElement('div', {
                'class': 'setPartNumberListView-container-toolbar-Container',
            }).inject(that.toolbarDiv);

            SetPartCmdToolbar.prototype.AddToolbarCommands(that.infoContainer,that.partNumberGridView, that.collection);
        },

        buildGridView: function () {
            var that = this;

            that.buildDataGrid("partnumber_gridview");
            that.buildDataGridCombobox();
            that.partNumberGridView.columns = SetPartCmdColsMgt._columnConfiguration(this._buildOptionsForColumnConfiguration(false));
            this.collection[SetPartConstants.CONSTANT_KEY_REFERENCES].forEach((item, i) => {
                SetPartCmdColsMgt.fillRowInfo(item, that.disableFormula);
            });

            var nodes = SetPartRowsGenerator.createItemNodes(this.collection[SetPartConstants.CONSTANT_KEY_REFERENCES]);
            this.partNumberModel.addChild(nodes);

            },
            buildEINInfo: function() {
              var that = this;
              that.infoContainer = that.isEINSettingBlockedForUsers() ? UWA.createElement('div', {
                      'class': 'setPartNumberListView-container-info-message-container',
                      'text' : nlsKeys.get("eng.partNumber.blockEIN.info")
                  }).inject(that.setEINInfoDiv) : "";
            },
            setBlockEINSetting: function(manualSettinInfo, setEINFormat,isV6Environemnt) {
                if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM && isV6Environemnt && (manualSettinInfo == SetPartConstants.CONSTANT_FALSE)){
                    this.preventEINSetting = true;
                }else{
                this.preventEINSetting = (manualSettinInfo == SetPartConstants.CONSTANT_FALSE && setEINFormat == SetPartConstants.CONSTANT_EIN_TYPE_NONE) ? true : false;
                }
            },
            isEINSettingBlockedForUsers: function() {
              return this.preventEINSetting;
            },
            
            displayBLInfo: function () {
                var that = this;
                if (that.isBLSet() && ( that.collection && that.collection.references && that.invalidObjectsCount != that.collection.references.length) ) {
                  xEngAlertManager.notifyAlert(nlsKeys.get("eng.partNumber.bl.msg") );
                }
            },
            updateErrorDetails: function (errorCount) {
                var that = this;
                this.invalidObjectsCount  = errorCount;

            xEngAlertManager.errorAlert(nlsKeys.get("eng.partNumber.rows.failed.error").replace("$1", errorCount) );
            },

            displaySelectionInfo: function (collection) {
                var that = this;
                var errorCount = 0;
                var deformedCount = 0;

                collection.references.forEach((item, i) => {
                    if (item[SetPartConstants.CONSTANT_STATUS] == SetPartConstants.CONSTANT_COMPUTED) {
                        that.successCount++;
                    }else {
                      errorCount++;
                    }
                    if (item[SetPartConstants.CONSTANT_DEFORMED] === "TRUE") {
                    	deformedCount++;
                    }
                });

                if(deformedCount > 0){
                	xEngAlertManager.warningAlert(nlsKeys.get("eng.partNumber.deformable.msg") );	
                }
                
                if(errorCount > 0)
                that.updateErrorDetails(errorCount);

                that.displayBLInfo();

        },
        getFormula: function () {
            var formula = this.collection[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION];
            if (formula == "" && this.isBLSet()) {
                return SetPartConstants.CONSTANT_SINGLE_COLUMN;
            }
            return formula;
        },
        isBLSet: function () {
            return (this.collection[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT);
        },
        getModifiedPNValue: function (item, index) {
            if (item.options.grid[SetPartConstants.CONSTANT_NEW_EIN]){
                return item.options.grid[SetPartConstants.CONSTANT_NEW_EIN];
            }
            return item.options.grid[SetPartConstants.CONSTANT_TEXTBOX + index] ? item.options.grid[SetPartConstants.CONSTANT_TEXTBOX + index] : "";
        },

        _buildOptionsForColumnConfiguration(isFromErroType){
            var that = this;
            var options = {}
            options[SetPartConstants.CONSTANT_FORMULA_CONFIGURED] = that.partNumberFormula;
            options[SetPartConstants.CONSTANT_KEY_FORMULA_TYPE] = that.collection[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR];
            options[SetPartConstants.CONSTANT_IS_FROM_ERROR] = isFromErroType;
            options[SetPartConstants.CONSTANT_DISABLE_FORMULA_EDIT] = this.disableFormula;
            options[SetPartConstants.CONSTANT_PREVENT_EDIT_EIN] = this.isEINSettingBlockedForUsers();
            options[SetPartConstants.CONSTANT_EIN_FORMAT] = this.collection[SetPartConstants.CONSTANT_EIN_FORMAT];
            options[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] = this.collection[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT];
            
            return options;
        },

        buildErrorReportView: function (responseData) {
            var that = this;

            that.buildDataGrid("partnumber_gridview_error");
           
            that.partNumberGridView.columns = SetPartCmdColsMgt._columnConfiguration(this._buildOptionsForColumnConfiguration(true));
            var parsedResponseData = that.parseErrorResponseData(responseData);

                this.partNumberModel.getAllDescendants().forEach((item, i) => {
                    if (parsedResponseData.hasOwnProperty(item.options.grid[SetPartConstants.CONSTANT_ID])) {
                        item.options.grid[SetPartConstants.CONSTANT_COLUMN_ERROR] = parsedResponseData[item.options.grid[SetPartConstants.CONSTANT_ID]];
                    } else {
                        if (item.options.grid[SetPartConstants.CONSTANT_COLUMN_ERROR]) {
                            delete item.options.grid[SetPartConstants.CONSTANT_COLUMN_ERROR];
                        }
                    }
                });

        },

        parseErrorResponseData: function (responseData) {
            var parsedData = {};
            responseData.forEach((item, i) => {
                parsedData[item[SetPartConstants.CONSTANT_PHYSICAL_ID]] = item[SetPartConstants.CONSTANT_COLUMN_ERROR];
            });

            return parsedData;
        },
        buildPNTypeRepresentation: function (data, name) {
            var enumTypeRep = {};
            var customTypes = {};
            customTypes[name] = data;

            enumTypeRep[name] = {
                "stdTemplate": "comboSelector",
                "semantics": {
                    "possibleValues": customTypes[name]
                }
            }

            return enumTypeRep;
        },
        buildDataGrid: function (id_name) {
            var that = this;
            if (!this.partNumberModel) {
                this.partNumberModel = new TreeDocument();
            }
            var options = {
                treeDocument: this.partNumberModel,
                identifier: id_name
            };

            this.partNumberGridView = new DataGridView(options);
            this.partNumberGridView.inject(this.gridviewContent);
            this.partNumberGridView.getSelectedEINNodes = function(){
                let selectedNodes = that.partNumberGridView && that.partNumberGridView.getTreeDocument && that.partNumberGridView.getTreeDocument().getSelectedNodes && that.partNumberGridView.getTreeDocument().getSelectedNodes().length > 0
                    ? that.partNumberGridView.getTreeDocument().getSelectedNodes() : null;
                return selectedNodes;
            }


            this.partNumberGridView.enableDisableToolbarCmdsOnUserSelections = this.enableDisableToolbarCmdsOnUserSelections;
            this.partNumberGridView.enableCommandonToolbar = this.enableCommandonToolbar;
            this.partNumberGridView.disableCommandonToolbar = this.disableCommandonToolbar;

            if (!this.isEINSettingBlockedForUsers()){
                let collectionParams = this.collection;
                this.partNumberGridView.showContextualMenuColumnFlag = true;
                this.partNumberGridView.onContextualEvent = function (params) {
                    var node = (params.cellInfos && params.cellInfos.nodeModel) ? params.cellInfos.nodeModel : null;
                    if (node) {
                        if (!node.isSelected()){
                            that.partNumberGridView.unselectAll();
                            node.select();
                        } 
                        if (that.isMultipleNodesSelected(params)) {
                            return SetPartCmdRMBHandler.getEmptyMenu();
                        } else {
                            return SetPartCmdRMBHandler.getRMBMenu(params, collectionParams, that);
                        }
                    }
                }
                this.partNumberGridView.addEventListener('click', function (evt, cellInfos) {
                    that.enableDisableToolbarCmdsOnUserSelections(that.partNumberGridView.getSelectedEINNodes());
                    if (cellInfos && cellInfos.cellID >= 0 && cellInfos.nodeModel){
                        cellInfos.nodeModel.onUnselect(function () {
                        that.enableDisableToolbarCmdsOnUserSelections(that.partNumberGridView.getSelectedEINNodes());
                        })
                        cellInfos.nodeModel.onSelect(function () {
                            that.enableDisableToolbarCmdsOnUserSelections(that.partNumberGridView.getSelectedEINNodes());
                        }) 
                    }  
                })
            }
        },

        enableCommandonToolbar: function(commands){
            if(!commands && !Array.isArray(commands)) { return; }
            commands.forEach(function(command){
                let commandItem = SetPartCmdToolbar.prototype._actionsIconBar.getItem(command);
                commandItem && commandItem.elements.container.removeClassName("setPart-toolbar-item-disable");
                commandItem && command && SetPartCmdToolbar.prototype._actionsIconBar.enableItem(command);
            })
        },

        disableCommandonToolbar: function (commands) {
            if (!commands && !Array.isArray(commands)) { return; }
            commands.forEach(function (command) {
                let commandItem = SetPartCmdToolbar.prototype._actionsIconBar && SetPartCmdToolbar.prototype._actionsIconBar.getItem ?  SetPartCmdToolbar.prototype._actionsIconBar.getItem(command) : null;
                commandItem && commandItem.elements.container.addClassName("setPart-toolbar-item-disable");
                commandItem && command && SetPartCmdToolbar.prototype._actionsIconBar.disableItem(command);
            })
        },

        enableDisableToolbarCmdsOnUserSelections: function(selectedNodes){
            let that = this;
            let revPNs = null;
            let newEINValueModified = false;
            let commndsArray = [SetPartConstants.CONSTANT_SETEIN_TOOLBAR_REQUEST_NEW_EIN_CMD, SetPartConstants.CONSTANT_SETEIN_TOOLBAR_CLEAR_CMD, SetPartConstants.CONSTANT_SETEIN_TOOLBAR_RESET_CMD];
            selectedNodes && Array.isArray(selectedNodes) && selectedNodes.forEach(function(node){
                let gridInfo = (node && node.options && node.options.grid) ? node.options.grid : null;
                revPNs = (!(revPNs && Array.isArray(revPNs))) && (gridInfo && gridInfo[SetPartConstants.CONSTANT_SUGGESTED_EIN])
                    ? gridInfo[SetPartConstants.CONSTANT_SUGGESTED_EIN] : revPNs;
                if (!newEINValueModified){
                    newEINValueModified = (gridInfo && gridInfo[SetPartConstants.CONSTANT_NEW_EIN] != gridInfo[SetPartConstants.CONSTANT_OLD_PART_NUMBER] ) ? true : false;
                }
                
            })

            if (selectedNodes && Array.isArray(selectedNodes) && selectedNodes.length > 0) {
                that.enableCommandonToolbar(commndsArray);
            } else {
                that.disableCommandonToolbar(commndsArray);
            } 
            if (Array.isArray(revPNs)) { that.disableCommandonToolbar([SetPartConstants.CONSTANT_SETEIN_TOOLBAR_REQUEST_NEW_EIN_CMD]); }
            if (!newEINValueModified) { that.disableCommandonToolbar([SetPartConstants.CONSTANT_SETEIN_TOOLBAR_RESET_CMD]); }

        },

        isMultipleNodesSelected: function (){
            let selectedNodes = this.partNumberGridView.getSelectedEINNodes();
            return (selectedNodes && selectedNodes.length > 1);
        },

        getAllDeformableEINS: function(item){
            let allDeformableEINs;
            if (item[SetPartConstants.CONSTANT_DEFORMABLE_EIN]){
                allDeformableEINs = (item[SetPartConstants.CONSTANT_OLD_PART_NUMBER] && item[SetPartConstants.CONSTANT_OLD_PART_NUMBER] != "") ? [...new Set([item[SetPartConstants.CONSTANT_OLD_PART_NUMBER], item[SetPartConstants.CONSTANT_DEFORMABLE_EIN]])] : ["",item[SetPartConstants.CONSTANT_DEFORMABLE_EIN]];
            }
            return allDeformableEINs;
        },

        buildDataGridCombobox: function () {
            var that = this;
            this.disableFormula = true;
            that.collection[SetPartConstants.CONSTANT_KEY_REFERENCES].forEach((item, index) => {
                if (item[SetPartConstants.CONSTANT_SUGGESTED_EIN] || that.collection[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR] == SetPartConstants.CONSTANT_VALUE_BL || item[SetPartConstants.CONSTANT_DEFORMABLE_EIN]) {
                    item[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN] = that.getAllDeformableEINS(item);
                    item[SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN_VALUES] = SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN + index;
                    var alreadyRegisteredTypes = that.partNumberGridView.getTypeRepresentationFactory().getRegisteredTypeRepresentation(item[SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN_VALUES]);

                    item[SetPartConstants.CONSTANT_SUGGESTED_EIN] = (item[SetPartConstants.CONSTANT_SUGGESTED_EIN].length == 1) ? ["", ... item[SetPartConstants.CONSTANT_SUGGESTED_EIN]] : item[SetPartConstants.CONSTANT_SUGGESTED_EIN];
                    var data = item[SetPartConstants.CONSTANT_SUGGESTED_EIN] ? item[SetPartConstants.CONSTANT_SUGGESTED_EIN] : (item[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN] ? item[SetPartConstants.CONSTANT_ALL_DEFORMABLE_EIN] : []);
                   
                    if (alreadyRegisteredTypes) {
                        that.partNumberGridView.getTypeRepresentationFactory().getRegisteredTypeRepresentation(item[SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN_VALUES]).semantics.possibleValues = data;
                    } else {
                        that.partNumberGridView.getTypeRepresentationFactory().registerTypeRepresentations(JSON.stringify(that.buildPNTypeRepresentation(data, item[SetPartConstants.CONSTANT_KEY_SUGGESTED_EIN_VALUES])));
                    }
                }
                if (!item[SetPartConstants.CONSTANT_SUGGESTED_EIN] && !(item[SetPartConstants.CONSTANT_STATUS] == SetPartConstants.CONSTANT_STATUS_ERROR)) {
                    that.disableFormula = false;
                }

            });

        },
        updateUserMappedPN: function (item, allRevisionsPartNumberObject, objId) {
            if (item.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN] && item.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN].length > 0) {
                if (item.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN].length == 1) {
                    allRevisionsPartNumberObject[objId] = item.options.grid[SetPartConstants.CONSTANT_SUGGESTED_EIN][0];
                } else {
                    allRevisionsPartNumberObject[objId] = item.options.grid[SetPartConstants.CONSTANT_NEW_EIN];
                }
            }
        },
        getUpdatedCollection : function(toUpdateArray, allRevisionsPartNumberObject){
          var updatedPNObjects = {};
          updatedPNObjects[SetPartConstants.CONSTANT_KEY_REFERENCES] = toUpdateArray;
          updatedPNObjects[SetPartConstants.CONSTANT_USER_MAPPED_PN] = allRevisionsPartNumberObject;

          if(!this.checkboxDiv.hidden && this.overridePartNumberCheckbox && this.overridePartNumberCheckbox.checkFlag ){
            updatedPNObjects[SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP] = SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP_VALUE_FALSE
          }else{
            updatedPNObjects[SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP] = SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP_VALUE_TRUE
          }
         return updatedPNObjects;
       },
       isEINModified : function(oldPartNumber, allRevisionsPartNumberObject, objId){
         return allRevisionsPartNumberObject && allRevisionsPartNumberObject[objId] == oldPartNumber ? false : true;
       }
    });
    return setPartNumberListView;
});

define('DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmd', [
    'UWA/Core',
    'DS/ApplicationFrame/Command',
    'DS/ENOXEngineerCommonUtils/XENModal',
    'DS/Utilities/Utils',
    'DS/ENOXEngineerCommonUtils/XENMask',
    'UWA/Class/View',
    'DS/ENOXEngineerCommonUtils/xEngAlertManager',
    'DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberListView',
    'DS/ENOXEngineerCommonUtils/XENPlatform3DXSettings',
    'DS/ENOXEngineerCommonUtils/PromiseUtils',
    'DS/EngineeringItemCmd/SetPartNumberCmd/setPartNumberHttpClient',
    'DS/ENOXEngineerCommonUtils/XENCommandsAppContextProxy',
    'DS/PlatformAPI/PlatformAPI',
    'DS/ENOXEngineerCommonUtils/XENWebInWinHelper',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartProgressDialog',
    'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
    'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json'
], function(
    UWA,
    AFRCommand,
    XEngineerModal,
    Utils,
    Mask,
    UWAView,
    xEngAlertManager,
    PartNumberListView,
    XENPlatform3DXSettings,
    PromiseUtils,
    xAppWSCalls,
    XENCommandsAppContextProxy,
    PlatformAPI,
    XENWebInWinHelper,
    SetPartProgressDialog,
    SetPartConstants,
    nlsKeys) {
    'use strict';

    var SetPartNumber = AFRCommand.extend({
        _setPartNumberListView: null,
        items: [],
        modal: null,
        transactionParameters:null,
        sTenentID: "OnPremise",
	securityContext:null,
        myBaseAppURL: null,
        init: function(options) {
            options = UWA.extend(options, {
                isAsynchronous: false
            });
            this._parent(options);


            //IR-749796-3DEXPERIENCER2021x
            // The initialization is to early to get the app Security context to correct it
            //  the initialization has been deplaced in isUserGranted call and the that.enable() is now check with isUserGranted
            //XENCommandsAppContextProxy.loadCommandsSetting();
            this._initCommandPrereqs();

        },
        isUserGranted: function(){
            var that = this;
            if(this.grantingPromise)
                return this.grantingPromise;
	    
            that.getProvidedSC();
                this.grantingPromise =  PromiseUtils.wrappedWithCancellablePromise(function(resolve, reject){  
                    XENCommandsAppContextProxy.loadCommandsSetting()
                                                .then(function(settings){
                                                    if(settings && settings.isGrantedEnterpriseExtension){
                                                        resolve(true);
                                                    }else{
                                            	if(XENPlatform3DXSettings.isCatiaV6Environment()){ //Setting added for IR-788376-3DEXPERIENCER2020x
                                            		resolve(true);
                                            	}else{
                                                        reject('user is not granted');
                                                    }
                                            	}
                                                }).catch(function(reason){
                                                    if(XENPlatform3DXSettings.isCatiaV6Environment()){ //Setting added for IR-788376-3DEXPERIENCER2020x
                                                        resolve(true);
                                                    }else{
                                                            console.error(reason);
                                                            reject('some failure') ;
                                                    }
                                                });
                });
            return  this.grantingPromise;
        },
        _initCommandPrereqs: function () {
            var that = this;
            if (this._initPromise) return this._initPromise;
            this._initPromise = PromiseUtils.wrappedWithCancellablePromise(function (resolve, reject) {
				if((XENPlatform3DXSettings.isCatiaV6Environment() && XENPlatform3DXSettings.isCloud())){
					resolve(true);
				}else{
					XENPlatform3DXSettings.discoverRelated3DXPlatform().then(function () {
						XENCommandsAppContextProxy.getAppContextPromise(that).then(function () {
								that._SelectorManager = that.getSelectorManager();
								if (null !== that._SelectorManager) {
									if (undefined !== that._SelectorManager.onChange) {
										var debounceSelection = Utils.debounce(function (data) {
											that._checkSelection(data);
										}, 100);
										that._SelectorManager.onChange(debounceSelection);
									} else {
										console.warn('###Define set part number Cmd / The onChange() function is not implemented !');
									}
								}

									
								that.bindEditModeListener();
								// that.buidModal();

								if(that.options.context && 
									typeof that.options.context.getEditMode === "function") {
										if(!that.options.context.getEditMode())
											  return   that.disable();
									}

								that._checkSelection(); // check the selectection first
							}).catch(function(reason){
								xEngAlertManager.unexpectedFailure(nlsKeys.get('failure.setPartNumber.cmd.init'));
							});
							resolve(true);
						}).catch(function (reason) {
							xEngAlertManager.unexpectedFailure(nlsKeys.get('failure.setPartNumber.cmd.init'));
							that.disable();
							//reject();
						});
				}
            });
        },
        bindEditModeListener: function(){
            var that =this;
            if(that.options.context && 
                    typeof that.options.context.addEvent === "function") {
                    that.options.context.addEvent('editModeModified', function(state) {
                        if (state === true) {
                            that._checkSelection();
                        } else {
                            that.disable();
                        }
                    });
                }
        },
        _getTypeInfo: function() {          
            var that = this;  
            if(!that.typeInfo || Object.keys(that.typeInfo).length == 0){
	    
                that.getProvidedSC();
		
                var getTypeInfo = XENPlatform3DXSettings.getCommand('get_Type_Info');
                xAppWSCalls.perform(getTypeInfo, JSON.stringify(["VPMReference"])).then(function(res) {
                    that.typeInfo = res;
                }).catch(function(errors) {
                    // reject(errors);
                    console.error(errors);
                });
            }
        },

        _checkIsVPMReferenceTypeSelection: function (nodeType) {
            var that = this;
            return (that.typeInfo && that.typeInfo[nodeType] && that.typeInfo[nodeType].parent && that.typeInfo[nodeType].parent === "VPMReference")
        },
        
        _checkSelection: function () {
            var that  =this;
	    that._getTypeInfo();
            if(that.options.context && 
                    typeof that.options.context.getEditMode === "function") {
                    if(!that.options.context.getEditMode())
                          return   that.disable();
                }

            if (!Array.isArray(that.options.context.getSelectedNodes()) ||
                    that.options.context.getSelectedNodes().length === 0) {
                        return that.disable();
            }else{
                var SelectedNodes = that.options.context.getSelectedNodes();
                for (var  i = 0; i < SelectedNodes.length; i++) {
                    var node = SelectedNodes[i];
                    if(!node || !node.getID()){ // for not saved items
                        return that.disable();
                    }
                        if (node.options.type === 'VPMReference')
                            continue;
                        else if(that._checkIsVPMReferenceTypeSelection(node.options.type)){
                            continue;
                        }
                    if( node.options.type === 'Drawing'|| 
                        !node.options.padgrid ||  
                        node.options.padgrid['ds6w:globalType'] !=='ds6w:Part'){
                        return that.disable();
                    }
                }
                that.isUserGranted().then(function(){
                    that.enable();
                }).catch(function(reason){
                    console.error(reason);
                    that.disable();
                });
            }

        },
        _buildSetPartNumDialog: function() {
            if( this._setPartNumberListView ) {
              this._setPartNumberListView.destroy();
              this._setPartNumberListView = null;
            }
            var that = this;

                that._setPartNumberListView = new PartNumberListView();
                that._setPartNumberListView.render();
                that.retrievePartNumber();

            },
            destroyView: function (isErrorThrown) {
                var that = this;
                if (that._setPartNumberListView) {
                    that._setPartNumberListView.destroy();
                    that._setPartNumberListView = null;
                }
                if (that.modal && that.modal.isNotDestroyed()) {
                    that.modal.dispose();
                    that.modal = null;
                }

            if(XENWebInWinHelper){
            	if(isErrorThrown == true){
            		XENWebInWinHelper.closePanel(isErrorThrown);
            	}else{
            		XENWebInWinHelper.closePanel();
            	}
            }
        },
        buidModal: function() {
            var that = this;
            this.modal = new XEngineerModal({
                title: nlsKeys.get("edit_part_number_title"),
                className: 'set-partNumber-modal',
                withFooter: true,
                customFooter:function(){
                  if(that._setPartNumberListView.isEINSettingBlockedForUsers()) {
                    return  '<button type="button" name="closeButton" class="btn btn-default closeButton">' + nlsKeys.get('eng.ui.button.close') + '</button>' ;
                  } else {
                    return '<button type="button" name="setEINButton" class="btn btn-primary setEINButton">' + nlsKeys.get('eng.ui.button.ok') + '</button>' +
                    '<button type="button" name="cancelButton" class="btn btn-default">' + nlsKeys.get('eng.ui.button.cancel') + '</button>';
                  }
                },
                persitId:'xen-edit-part-number',
                relatedCommand: that,
                onClose:function(){
                  that.destroyView();
                  that.end();
                  that.modal = undefined;
                }
              });
              this.modal.modal.getFooter().getElement('.closeButton') && this.modal.modal.getFooter().getElement('.closeButton').addEvent('click', function (element) {
                that.destroyView();
                that.end();
                that.modal = undefined;
              });
              this.modal.modal.getFooter().getElement('.setEINButton') &&
              this.modal.modal.getFooter().getElement('.setEINButton').addEventListener('click', function(element){
                  //var collection = that._setPartNumberListView.getPendingChanges();
                  var collection = that._setPartNumberListView.getDataToBeUpdated();
                if(!collection[SetPartConstants.CONSTANT_KEY_REFERENCES].length){
                      that.destroyView();
                      that.end();
                      that.modal = undefined;
                      return;
                  }
                  let collectionParams = that._setPartNumberListView.collection;
                  if(that.isSingleUserInput(collectionParams) && collectionParams[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST][0][SetPartConstants.CONSTANT_REGEX])
                    {
                        let regexData = [];
                        let regex = collectionParams[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST][0][SetPartConstants.CONSTANT_REGEX];
                        collection.references.forEach((item, i) => {
                            let partNumber = item[SetPartConstants.CONSTANT_KEY_PN];
                            let physicalid = item[SetPartConstants.CONSTANT_PHYSICAL_ID];
                            if (!that.regexValidation(partNumber, regex)) {
                                let ErrorMessage = nlsKeys.get("error.regex") + regex;
                                regexData.push({physicalid, ErrorMessage});    
                            }
                        });
                        if(regexData.length != 0) {
                            that._setPartNumberListView.buildErrorReportView(regexData);
                            return;
                        }
                    }
                  Mask.mask(that.modal.getBody(), nlsKeys.get("eng.partNumber.mask.executing"));
                that.disableSetPartCmdButtons();

                  that.updatePartNumberAttr(collection).then(function(data) {
  
                      if(data[SetPartConstants.CONSTANT_STATUS] == SetPartConstants.CONSTANT_SUCCESS){
                        //Notify all applications
                        that.options.context.author && that.options.context.author(true);
                        that.options.context.refreshView && that.options.context.refreshView({
                            modified: that.formatForRefreshView(data)
                        });

                        PlatformAPI.publish("XEN/PUBLIC_EVENT/ENGINEERING_ITEM/PART_NUMBER_UPDATED", data);
                        var event = that.createEvent(data);
                        PlatformAPI.publish("DS/PADUtils/PADCommandProxy/refresh", event);
                        //notification for webinWin Solidworks
                        PlatformAPI.publish('webinwin:web:notification', JSON.stringify({
                            'operation': 'engineering/setPartNumber',
                            'operationVersion': '1.0',
                            'content': data
                        }));
                      xEngAlertManager.sucessAlert(nlsKeys.get("eng.partNumber.set.success"));
                      //notification catiaV5
                      XENWebInWinHelper.notifyUpdatedEnterpriseItem(data);
                    }else if (data[SetPartConstants.CONSTANT_STATUS] == SetPartConstants.CONSTANT_STATUS_ERROR) {
                      that._setPartNumberListView.buildErrorReportView(data.references);
                      Mask.unmask(that.modal.getBody());
                        that.enableSetPartCmdButtons();
                      return;
                    }


                      if(that.modal && that.modal.isNotDestroyed()){
                      Mask.unmask(that.modal.getBody());
                        that.enableSetPartCmdButtons();
                      }

                      that.destroyView();
                      that.end();
                  }).catch(function(errors) {
                    console.error(errors);
                    var  errorReason =(errors && errors.error && errors.error.message) ? errors.error.message : errors;
					errorReason = (errors && errors.response && errors.response.message) ? errors.response.message : errorReason;
					xEngAlertManager.errorAlert(errorReason);
                    if(that.modal && that.modal.isNotDestroyed()){
                      Mask.unmask(that.modal.getBody());
                      that.enableSetPartCmdButtons();
                    }
                      that.end();
                  });
                });
        },

        isSingleUserInput: function(data) {
            return (data[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_FORMULA && 
                data[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST].length == 1 && 
                data[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST][0][SetPartConstants.CONSTANT_TYPE] == SetPartConstants.CONSTANT_EIN_TYPE_FREE);
        },

        regexValidation: function(input, regex){
            if(regex.charAt(0) != '^' && regex.charAt(regex.length - 1) != '$'){
                regex = '^' + regex + '$';
            }
            let regExp = new RegExp(regex);
            return regExp.test(input);
        },

        getFormattedDataForGEnericRefresh: function(data){
            if (data && data.references && data.status=="success") {
                return {
                        authored: {
                            modified: data.references.map(function(e) {
                                return e.physicalid;
                              })
                          }
                    }
            }else{
                return {
                    authored: {}
                }
            }
        },

        _uid: function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
      
        createEvent: function(data) {
        return {
            metadata: {
            uid: this._uid(),
            originUid: this._uid(),
            timestamp: Date.now(),
            appid: XENPlatform3DXSettings.getAppId() + '_' + XENPlatform3DXSettings.getWidgetId(),
            originWidgetId: XENPlatform3DXSettings.getWidgetId()
            },
            data: this.getFormattedDataForGEnericRefresh(data)
        };
        },

        formatForRefreshView: function(data){
            if(!data || !Array.isArray(data.references)) return [];

            return data.references.map(function(item){
                return {
                    physicalid: item.physicalid,
                    attributes:[{
                        name: "ds6wg:EnterpriseExtension.V_PartNumber",
                        value: item.partNumber
                    }]
                }
            })
        },
        getProvidedSC: function(){
                if (!this.options.context || !this.options.context.getSecurityContext)
                    return null;

            var _sc  = this.options.context.getSecurityContext() || {};
            var value = _sc.SecurityContext;
            if (_sc.SecurityContext) {
                if(value.startsWith('ctx::'))
                    value = value.substring(5);
                XENPlatform3DXSettings.setDefaultSecurityContext(value);
            }

            if (_sc.tenant) {
                XENPlatform3DXSettings.setPlatformId(_sc.tenant);
            }

            return value;
        },
        getSelectorManager: function () {
            if (this.options.context&& this.options.context.getPADTreeDocument)
                return this.options.context.getPADTreeDocument().getXSO();
            else
                return null;
        },
        execute: function() {
            var that = this;
            var selectedObjetcsCount = that.options.context.getSelectedNodes().length;
            if(selectedObjetcsCount > SetPartConstants.CONSTANT_LIMIT_EIN){
              xEngAlertManager.errorAlert(nlsKeys.get("eng.partNumber.limit.title").replace('$1', selectedObjetcsCount));
              return;
            }
            this.progressDialog = new SetPartProgressDialog();
            this.progressDialog.createProgress(widget.body, nlsKeys.get("eng.partNumber.loading.mask.title"));
            XENCommandsAppContextProxy.getAppContextPromise(this).then(function(context){

                if (!Array.isArray(that.options.context.getSelectedNodes()) ||
                    that.options.context.getSelectedNodes().length === 0) {
                    throw new Error('No Selected Items!');
                }

                that.transactionParameters =(that.options.context.getTransactionParameters) ? that.options.context.getTransactionParameters() : null;
                that.items = that.options.context.getSelectedNodes().map(function(item) {
                    return {
                        physicalId: item.getID(),
                        name: item.getLabel(),
                        sessionStoredEIN: (item.getSessionStoredEIN && item.getSessionStoredEIN()) ? item.getSessionStoredEIN() : undefined,
                        partNumber: item.options.grid['ds6wg:EnterpriseExtension.V_PartNumber']
                    };
                });
                that.items = that.items.reduce(function(result, item){
                  var idx = result.filter((function(cp){
                    return item.physicalId === cp.physicalId;
                  }))[0];
                  if (!UWA.is(idx)) {
                    result.push(item);
                  }
                  return result;
                }, []);
				
				that.sTenentID = (that.options.context.getTenentID) ? that.options.context.getTenentID() : "OnPremise";
                		that.myBaseAppURL = (that.options.context.getMyBaseAppURL) ? that.options.context.getMyBaseAppURL() : null;
				that.securityContext = (that.options.context.getSC)?that.options.context.getSC():null;
				if(XENPlatform3DXSettings.isBuildSecurityContext() && XENPlatform3DXSettings.isCloud()){
						var _platform = {};
						var strTenentId = that.sTenentID;
						var sURL = that.myBaseAppURL;
						_platform[strTenentId] = {"3DSpace":sURL}
						XENPlatform3DXSettings._platforms = _platform;
						XENPlatform3DXSettings.setDefaultSecurityContext(that.securityContext.replace("ctx : ",""));
						that._buildSetPartNumDialog();
				}
                		else{
					var needSC = (!that.getProvidedSC());
					XENPlatform3DXSettings.bindCommandsToABackend(needSC /* need to retrieve SC */).then(function(){
						that.isUserGranted().then(function(){
							that._buildSetPartNumDialog();
						}).catch(function(reason){
							console.log(reason);
                            xEngAlertManager.errorNotif({
                                title: nlsKeys.get("error.not.granted"),
                                subtitle: nlsKeys.get("error.contact.admin"),
                            });
              				that.progressDialog.close();
						});
					}).catch(function(error){
						console.error(error);
						//notify the user
						xEngAlertManager.unexpectedFailure(nlsKeys.get('failure.setPartNumber.cmd.launch'));
            			that.progressDialog.close();
					})
				}

            }).catch(function(error){
                console.error(error);
                xEngAlertManager.unexpectedFailure(nlsKeys.get('failure.setPartNumber.cmd.launch'));
                that.progressDialog.close();
            })


        },
        retrievePartNumber: function() {
            var that = this;
            var sessionStoredEINValues = {};
            var physicalIds = this.items.map(function(item) {
                sessionStoredEINValues[item.physicalId] = item.sessionStoredEIN;
                return item.physicalId;
            });
            this.retrievePartNumberAttr(physicalIds).then(function(data) {
                that._setPartNumberListView.destroy();
                    var mappedReferencesData = data.references.map(function (current) {
                    // IE :(
                    var item = that.items.filter(function(item) {
                        if (item.physicalId === current.physicalid) {
                            return true;
                        }
                        return false;
                    })[0];
                    if(that.isSingleUserInput(data) && data[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] == SetPartConstants.CONSTANT_FALSE) {
                        data[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] = SetPartConstants.CONSTANT_TRUE;
                    }
                    return {
                        id: item.physicalId,
                        name: item.name,
                        oldpartnumber: (sessionStoredEINValues && sessionStoredEINValues[item.physicalId]) ? sessionStoredEINValues[item.physicalId] :current.partNumber,
                                editable: (current[SetPartConstants.CONSTANT_STATUS] !== SetPartConstants.CONSTANT_COMPUTED) ? true : false,
                                newpartnumber: current[SetPartConstants.CONSTANT_COMPUTED_PARTNUMBER],
                                status: current[SetPartConstants.CONSTANT_STATUS],
                                [SetPartConstants.CONSTANT_DEFORMED]:current[SetPartConstants.CONSTANT_DEFORMED],
                                [SetPartConstants.CONSTANT_DEFORMABLE_EIN]: current[SetPartConstants.CONSTANT_DEFORMABLE_EIN],
                                [SetPartConstants.CONSTANT_SUGGESTED_EIN]: current[SetPartConstants.CONSTANT_SUGGESTED_EIN] ? current[SetPartConstants.CONSTANT_SUGGESTED_EIN] : "",
                                [SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR]: data[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR]
                            };
                        });
                var einFormat = data[SetPartConstants.CONSTANT_BLOCK_EIN_CONFIGURED] == SetPartConstants.CONSTANT_TRUE ? SetPartConstants.CONSTANT_EIN_TYPE_NONE : data[SetPartConstants.CONSTANT_EIN_FORMAT];
                var manualInput = data[SetPartConstants.CONSTANT_BLOCK_EIN_CONFIGURED] == SetPartConstants.CONSTANT_TRUE ? SetPartConstants.CONSTANT_FALSE : data[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT];
                    var collection = {
                        [SetPartConstants.CONSTANT_CONFIGURED_REGULAR_EXPRESSION] : data[SetPartConstants.CONSTANT_CONFIGURED_REGULAR_EXPRESSION],
                        [SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR] : data[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_GENERATOR],
                        [SetPartConstants.CONSTANT_KEY_ITEMNUMBER_UNIQUENESS] : data[SetPartConstants.CONSTANT_KEY_ITEMNUMBER_UNIQUENESS],
                        [SetPartConstants.CONSTANT_FORMULA_CONFIGURED] : data[SetPartConstants.CONSTANT_FORMULA_CONFIGURED],
                        [SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION]: data[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION],                        
                        [SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT]: manualInput,
                        [SetPartConstants.CONSTANT_EIN_FORMAT]: einFormat,
                        [SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES]: data[SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES],
                        [SetPartConstants.CONSTANT_BLOCK_EIN_CONFIGURED]: data[SetPartConstants.CONSTANT_BLOCK_EIN_CONFIGURED],                        
                        [SetPartConstants.CONSTANT_IS_V6_ENVIRONMENT]: XENPlatform3DXSettings.isCatiaV6Environment(), 
                        references: mappedReferencesData
                    }

                    that.showDialog(collection);

                    XENWebInWinHelper.commandViewReady();
                }).catch(function (errors) {
                    console.warn(errors);
                    var errorReason = (errors && errors.error && errors.error.message) ? errors.error.message : (errors.message?errors.message:errors);
                    errorReason = (errors && errors.response && errors.response.message) ? errors.response.message : errorReason;

                    if(errorReason ){
                        xEngAlertManager.errorAlert(errorReason);
                    }else{
                        xEngAlertManager.unexpectedFailure(nlsKeys.get('failure.setPartNumber.cmd.launch'));
                    }

                if(that.modal && that.modal.isNotDestroyed())
                    Mask.unmask(that.modal.getBody());

                that.destroyView(true);
                that.end();
            }).finally(function(){
                that.progressDialog.close();
            });
        },

        getTargetedNode: function() {
            var nodes = this.options.context.getSelectedNodes();
            return nodes.length > 0 ? nodes[0] : null;
        },
        retrievePartNumberAttr: function(physicalIds) {
            var myRetrievePartNumCommand = XENPlatform3DXSettings.getCommand('mcs_retrievePartNumber');
            var parameters = this.transactionParameters;
            var payload = {
                references: physicalIds.map(function(physicalid) {
                    return {
                        physicalid: physicalid
                    };
                })
            };
            if(parameters){	payload["winTransactionParameters"] =  parameters;	}
            
            return PromiseUtils.wrappedWithCancellablePromise(function(resolve, reject) {
                xAppWSCalls.perform(myRetrievePartNumCommand, JSON.stringify(payload)).then(function(res) {
                    //app.core.settingManager.setApplicationMode('authoring');

                	// Sorting the result in the order of payload - start
                	var payloadArray=payload.references;

                	if(payloadArray.length>1) {
                    	var resultJson = {};
                    	var resArray=res.references;
                    	var phyId;
                		for (var i=0;i<resArray.length;i++)
                			resultJson[resArray[i].physicalid] = resArray[i];

                    	var sortedResArray=[];
                    	for (var i=0; i<payloadArray.length; i++)
                    		sortedResArray.push(resultJson[payloadArray[i].physicalid]);

                    	res.references=sortedResArray;
                	}
                	// Sorting the result in the order of payload - end

                    return resolve(res);
                }).catch(function(errors) {
                    reject(errors);
                });
            });
        },
        updatePartNumberAttr: function(collection) {
            var myUpdatePartNumCommand = XENPlatform3DXSettings.getCommand('mcs_setPartNumber');
            var parameters = this.transactionParameters;
            var payload = {};

            payload = this.buildUpateEINPayload(collection, parameters);

                return PromiseUtils.wrappedWithCancellablePromise(function (resolve, reject) {
                    xAppWSCalls.perform(myUpdatePartNumCommand, JSON.stringify(payload)).then(function (res) {
                        //app.core.settingManager.setApplicationMode('authoring');
                        return resolve(res);
                    }).catch(function (errors) {
                        reject(errors);
                    });
                });
            },
            updateModalTitleInfo: function (selectedValidObjects, allObjects) {
                var that = this;
                var selectionDetails = "";
                if (allObjects == 1 && selectedValidObjects == 1) {
                    selectionDetails = nlsKeys.get("eng.partNumber.selected.object.count").replace("$1", selectedValidObjects);
                } else if (selectedValidObjects > 0) {
                    var selectionDetails = (selectedValidObjects == 1) ? nlsKeys.get("eng.partNumber.selected.object.count").replace("$1", selectedValidObjects)
                     : nlsKeys.get("eng.partNumber.selected.multiple.objects.count").replace("$1", selectedValidObjects);
                }
                that.modal.modal.setTitle(nlsKeys.get("edit_part_number_title") + selectionDetails);
            },
            showDialog: function (collection) {
                var that = this;
                var setPartCont = that._setPartNumberListView.setCollection(collection).render();

              if(that._setPartNumberListView.collection && that._setPartNumberListView.collection.references && that._setPartNumberListView.invalidObjectsCount != that._setPartNumberListView.collection.references.length) {
                    that.buidModal();
                    setPartCont.inject(that.modal.getBody());
                    that.modal.modal.setNewSize({
                        width: 700,
                        height: 400
                    });
                    that.modal.modal.centerIt();
                    that.modal.show();
                    that.updateModalTitleInfo(that._setPartNumberListView.successCount, that._setPartNumberListView.collection[SetPartConstants.CONSTANT_KEY_REFERENCES].length);
                }
            },
            enableSetPartCmdButtons : function(){
              var that = this;
              that.modal.modal.getFooter().getElements('.btn').forEach(function (element) {
                  element.disabled = false;
              })
            },
            disableSetPartCmdButtons : function(){
              var that = this;
              that.modal.modal.getFooter().getElements('.btn').forEach(function (element) {
                element.disabled = true;
              })
            },
            buildUpateEINPayload : function(collection, parameters){
                var payload = {};

                var parameters = this.transactionParameters;
              if(parameters){	payload["winTransactionParameters"] =  parameters;	}

                if(collection[SetPartConstants.CONSTANT_KEY_REFERENCES].length > 0){
                  payload[SetPartConstants.CONSTANT_KEY_REFERENCES] =  collection[SetPartConstants.CONSTANT_KEY_REFERENCES];
                }

                if(Object.keys(collection[SetPartConstants.CONSTANT_USER_MAPPED_PN]).length > 0){
                  payload[SetPartConstants.CONSTANT_USER_MAPPED_PN] = collection[SetPartConstants.CONSTANT_USER_MAPPED_PN];
                }

                payload[SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP] = collection[SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP];
              return payload;
            }
        });
    return SetPartNumber;
});

define('DS/EngineeringItemCmd/SetPartNumberFacet/ENONewEINFacet', [
  'UWA/Core',
  'DS/Controls/Button',
  'DS/Form/Form',
  'DS/CoreBase/WebUXGlobalEnums',
  'DS/Core/TooltipModel',
  'DS/ENOXEngineerCommonUtils/XENPlatform3DXSettings',
  'DS/ENONewWidget/ENONew/View/Facet/ENONewFacetBase',
  'DS/ENOXEngineerCommonUtils/xEngAlertManager',
  'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartConstants',
  'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmd',
  'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdFormulaDialog',
  'DS/EngineeringItemCmd/SetPartNumberFacet/ENONewEINServices',
  'DS/EngineeringItemCmd/SetPartNumberCmd/SetPartCmdRequestCmd',
  'i18n!DS/EngineeringItemCmd/assets/nls/ExposedCmdsNls.json',
  'css!DS/EngineeringItemCmd/SetPartNumberFacet/styles/ENONewEINFacet.css',
], (
  UWA,
  WUXButton,
  Form,
  WebUXGlobalEnums,
  WUXTooltipModel,
  XENPlatform3DXSettings,
  ENONewFacetBase,
  xEngAlertManager,
  SetPartConstants,
  SetPartCmd,
  SetPartCmdFormulaDialog,
  ENONewEINServices,
  SetPartCmdRequestCmd,
  nlsKeys,
) => {
  'use strict';
  let phyId;
  let userEneteredEINValue;
  let eventPerformed;
  let isRequest;
  let prevEINValue;
  let defaultAttrValues = {};
  const ENONewEINFacet = ENONewFacetBase.extend({
    init: async function (options) {
      this._parent(options);
      prevEINValue = "";
      if(options.addinMode) this.setFacetOptions(options);
      if (!this.elements.container) {
        this.elements.container = UWA.createElement("div", {
          class: "EINNewfacetContainer",
        });
      }
      this.response = await ENONewEINServices.retrievePartNumberAttrForCreateNew();
      this._buildView(this.response);
    },
    
    setFacetOptions: function (options) {
      if(!XENPlatform3DXSettings._platforms){
        let sURL = options.serviceBaseUrl ? options.serviceBaseUrl : undefined; 
        let strTenentId = options.tenant ? options.tenant : "OnPremise";
        let _platform = {};
        _platform[strTenentId] = {"3DSpace":sURL}
        XENPlatform3DXSettings.setPlatformId(strTenentId);
        XENPlatform3DXSettings._platforms = _platform;
      }

      if(options.userId) XENPlatform3DXSettings._user.id = options.userId;
    
      let securityContext = XENPlatform3DXSettings.getSecurityContext();
      if(!securityContext || securityContext == ""){
        securityContext = options.securityContext ? options.securityContext : "";
        XENPlatform3DXSettings.setDefaultSecurityContext(securityContext.replace("ctx::",""));
      }

      XENPlatform3DXSettings.storedUrlParams = (XENPlatform3DXSettings.storedUrlParams === undefined) ? {} : XENPlatform3DXSettings.storedUrlParams;
    
      if(!XENPlatform3DXSettings.storedUrlParams['addinmode']){
        let addinMode = options.addinMode;
        XENPlatform3DXSettings.storedUrlParams['addinmode'] = addinMode;
      } 
    },

    postCreation: async function (createdObjInfo) {
      var that = this;
      phyId = createdObjInfo[0].identifier;
      let inputField = that.form.getModelItem(SetPartConstants.CONSTANT_TEXTBOX);
        if(inputField.value){
          let collection = that.getDataToBeUpdated(inputField);
          let partNumber;
          if(!collection[SetPartConstants.CONSTANT_KEY_REFERENCES].length){
            return;
          }
          else{
            for(let i = 0; i < collection[SetPartConstants.CONSTANT_KEY_REFERENCES].length; i++) {
              partNumber = (collection[SetPartConstants.CONSTANT_KEY_REFERENCES][i].partNumber) ? collection[SetPartConstants.CONSTANT_KEY_REFERENCES][i].partNumber : "";
              if(that.response[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_FORMULA){
                var attributesResp =  await ENONewEINServices.readAttributes({ lIds: [phyId] });
                for(let i = 0; i < attributesResp.results[0].data.length; i++){
                  let attrName = attributesResp.results[0].data[i].nls;
                  let attrSelectable = attributesResp.results[0].data[i].selectable.replace('[', '_').replace(']', '');
                  if(inputField.value.includes(attrName)){
                    let attrValue = Object.keys(defaultAttrValues).length != 0 ? defaultAttrValues[attrSelectable] : '';
                    if(attributesResp.results[0].data[i].value) { attrValue = attributesResp.results[0].data[i].value };
                    partNumber = partNumber.replace("{" + attrName + "}", attrValue);
                  }
                }
                collection.references[i].partNumber = partNumber;
              }
            }
            let einFormatArray = [SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT, SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM];
            if(partNumber || einFormatArray.includes(that.response[SetPartConstants.CONSTANT_EIN_FORMAT])) {
              let setPartNumberResp = await SetPartCmd.prototype.updatePartNumberAttr(collection);
              if(setPartNumberResp[SetPartConstants.CONSTANT_STATUS] == SetPartConstants.CONSTANT_SUCCESS){
                xEngAlertManager.sucessAlert(nlsKeys.get("eng.partNumber.set.success"));
              }else {
                xEngAlertManager.errorAlert(setPartNumberResp.references[0].ErrorMessage);
              }
            }
          }
        }
    },
    
    _buildView(options) {
      let that = this;
      let facetContainer = UWA.createElement("div", {
        class: "EINfacet-form-button-container",
      });
      if(options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_FORMULA){
        defaultAttrValues = that.getDefaultAttributeValue(options);
      }
      that.form = new Form({
        model: [
          {
            id: SetPartConstants.CONSTANT_TEXTBOX,
            label: nlsKeys.get("eng.partNumber.new"),
            typeRepresentation: "string",
            semantics: {
              placeholder: nlsKeys.get("edit_part_number.placeholder"),
              id: SetPartConstants.CONSTANT_VALUE_USERINPUT,
            },
          },       
        ],
        invalidDisplayPolicy: WebUXGlobalEnums.InvalidDisplayPolicy.Always,
        onModelLiveUpdate: function(data) {
          let value = data.value;
          if(SetPartCmd.prototype.isSingleUserInput(options)) {that.regexValidation(options, value); }
          if(that.enforceEIN(options) == SetPartConstants.CONSTANT_TRUE){
            if(value) {
              !(this.invalidState) ? that.setFacetValidation(true) : that.setFacetValidation(false);
              this.updateModelItem(data.id, {value: value, helpText: ""});
            }
            else{
              that.setFacetValidation(false);
              this.updateModelItem(data.id, {value: value, requiredFlag: true, helpText: nlsKeys.get("edit_part_number_field_required"), invalidTooltip: ""});
            }
          }
        },
        onModelUpdate: function(data) {
          let value = data.value;
          this.onModelLiveUpdate(data);
          if(isRequest === true && prevEINValue) {
            if(value != prevEINValue) {
              this.updateModelItem(data.id, {semantics:{id : SetPartConstants.CONSTANT_VALUE_USERINPUT}});
            }
          }
          
        }
      }).inject(facetContainer);
      that.setBlockEINSetting(options, that.form);
      that.form.onModelLiveUpdate(that.form.getModelItem(SetPartConstants.CONSTANT_TEXTBOX));
      facetContainer.inject(that.elements.container);
      eventPerformed = (that.form.value === "") ? SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_CLEAR : SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST;
      let enableClearEINCommand = options && (options[SetPartConstants.CONSTANT_EIN_FORMAT] == SetPartConstants.CONSTANT_EIN_TYPE_NONE && options[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] === SetPartConstants.CONSTANT_FALSE) 
      
      let buttonContainer = UWA.createElement("div", {
        class: "EINfacet-button-container",
      });
      buttonContainer.inject(facetContainer);

      if(!enableClearEINCommand) {
        let clearButton = that._createButton(nlsKeys.get("eng.partNumber.cmd.clear"), SetPartConstants.CONSTANT_CMD_ICON_CLEAR);
        clearButton.inject(buttonContainer);
        clearButton.addEventListener('buttonclick', () => {
          that._clearEINValue(options[SetPartConstants.CONSTANT_EIN_FORMAT]);
        });
      }
      
      if(!SetPartCmdRequestCmd.enableRequestEINCommand(options)){ 
        let requestEINButton = that._createButton(nlsKeys.get("eng.partNumber.cmd.requestNewEIN"), SetPartConstants.CONSTANT_CMD_ICON_REQUEST_NEW_EIN);
        requestEINButton.inject(buttonContainer);
        requestEINButton.addEventListener('buttonclick', () => {
          eventPerformed = SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST;
          isRequest = true;
          that._requestEINValueForCreateNew(options);
        });
      }
    },

    //Function to enforce EIN
    enforceEIN: function(options){
      return (options[SetPartConstants.CONSTANT_CREATEPANEL_ENFORCE_EIN]);
    },

    // Function to enable or disable the EIN setting
    setBlockEINSetting: function (options, input) {
      if (options[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] === SetPartConstants.CONSTANT_FALSE && options[SetPartConstants.CONSTANT_EIN_FORMAT] !==  SetPartConstants.CONSTANT_VALUE_USERINPUT) {
        input.disabled = true;
      }
    },

    //Function to add button
    _createButton: function(title, icon) {
      let sampleButton = new WUXButton({
        displayStyle: "lite",
        emphasize: "secondary",
        tooltipInfos: new WUXTooltipModel({
          shortHelp: title,
        }),
        icon: {
          iconName: icon,
          fontIconFamily: WUXManagedFontIcons.Font3DS,
        },
      });
      return sampleButton;
    },

    // Function to clear the value in the textbox
    _clearEINValue: function (setEINFormat) {
      let that = this;
      that._updateNewEIN(setEINFormat, "", SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_CLEAR);
    },

    // Function to request new EIN value through formula, BL or external system
    _requestEINValueForCreateNew: function (options) {
      var that = this;
      let setEINFormat = options[SetPartConstants.CONSTANT_EIN_FORMAT];
      let newEINValue = SetPartCmdRequestCmd._requestEINValue(options, setEINFormat, "");
      if(newEINValue != undefined){
        if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_FORMULA) {
          SetPartCmdFormulaDialog.buildDialogboxContent(widget.body, {}, options[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION], {}, options);
          let dialog = SetPartCmdFormulaDialog.formulaDialog;
          if (dialog) {
            let okButton = document.getElementById("OK_Button");
            if (okButton) {
              okButton.addEventListener("click", function () {
                if (dialog.buttons.Ok.disabled) { return;}
                let generatedEIN = SetPartCmdFormulaDialog._getNewEINValue();
                let computedEIN = options[SetPartConstants.CONSTANT_FORMULA_CONFIGURED].split(new RegExp(["@@C@@", "@@T@@", "@@A@@", "@@F@@"].join("|"), "")
                ).map(item => {
                  return that.replaceAttributes(options, item);
                }).filter((item, index) => index % 2);
                let newEIN = SetPartCmdFormulaDialog._buildEINValue(generatedEIN, computedEIN);
                that._updateNewEIN(setEINFormat, newEIN.newEINForFormula, SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST);
                that.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {semantics:{id : SetPartConstants.CONSTANT_EIN_TYPE_FORMULA}});
                userEneteredEINValue = newEIN.newEINComputedForFormula;
                dialog.immersiveFrame.getModel().elements.container.destroy();
              });
            }
          }
        } else {
          that._updateNewEIN(setEINFormat, newEINValue, SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_REQUEST);
        }
      }
    },

    // Function to replace the placeholders in the formula
     replaceAttributes: function(options, item) {
      if(item){
        item = item.replace("[", "_").replace("]", "");
        for(let key in options[SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES]){
          let value = "{" + options[SetPartConstants.CONSTANT_PHYSICAL_PRODUCT_ATTRIBUTES][key] + "}";
          item = item.replace(key, value);
        }
      }
      return item;
    },

    // Function to add regex validation to the field
    regexValidation: function(options, value) {
      if(options[SetPartConstants.CONSTANT_MANUAL_OR_FREE_INPUT] == SetPartConstants.CONSTANT_FALSE) {this.form.disabled = false};
      let adminDefinedRegex = options[SetPartConstants.CONSTANT_CONFIGURED_REGULAR_EXPRESSION];
      if(adminDefinedRegex && Object.keys(adminDefinedRegex).length != 0) {
        let regex = Object.values(adminDefinedRegex)[0];
        this.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {value: value, semantics: {pattern : regex}});
        if(this.form.invalidState) {
          this.setFacetValidation(false);
          this.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {value: value, invalidTooltip: {shortHelp: nlsKeys.get("error.regex") + regex}});
        }
        else{
          this.setFacetValidation(true);
          this.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {value: value, invalidTooltip: {shortHelp: ""}});
        }
      }
    },

    // Function to get the values to update input field
    _updateFormValues: function (setEINFormat, value, event) {
      let formValue = {
        ein: value,
        eventPerformed: event,
      };
      if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT) {
        formValue.einToUpdate = SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT;
        this.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {semantics:{id : SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT}});
        
      }
      if (setEINFormat === SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM) {
        formValue.einToUpdate = SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT;
        this.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {semantics:{id : SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT}})
        
      }
      return formValue;
    },

    // Function to update the value of the input field
    _updateNewEIN: function (setEINFormat, value, event) {
      let that = this;
      let formValue = that._updateFormValues(setEINFormat, value, event);
      that.form.updateModelItem(SetPartConstants.CONSTANT_TEXTBOX, {value : formValue.ein}); // Update the value of the form input field
      prevEINValue = formValue.ein;
    },

    getDataToBeUpdated: function (input) {
      //Read data from UI - Start
      let that = this;
      var toUpdateArray = [];
      var allRevisionsPartNumberObject = {};
      var toUpdateObj = {};
      let newEINToUpdate = input.semantics.id;
      toUpdateObj[SetPartConstants.CONSTANT_PHYSICAL_ID] = phyId;
      toUpdateObj[SetPartConstants.CONSTANT_SETEIN_CMD_EVENT_OPERATION_PERFOEMED] = eventPerformed;
      if (newEINToUpdate != SetPartConstants.CONSTANT_EIN_TYPE_BL_SCRIPT && newEINToUpdate != SetPartConstants.CONSTANT_EIN_TYPE_EXTERNAL_SYSTEM_EVENT){
        if(newEINToUpdate === SetPartConstants.CONSTANT_VALUE_USERINPUT){
          toUpdateObj[SetPartConstants.CONSTANT_KEY_PN] = input.value;
        }
        else{
          toUpdateObj[SetPartConstants.CONSTANT_KEY_PN] = userEneteredEINValue;
        }
      }
      toUpdateArray.push(toUpdateObj);
      return that.getUpdatedCollection(toUpdateArray, allRevisionsPartNumberObject);
    },

    getUpdatedCollection: function (toUpdateArray, allRevisionsPartNumberObject) {
      let updatedPNObjects = {};
      updatedPNObjects[SetPartConstants.CONSTANT_KEY_REFERENCES] = toUpdateArray;
      updatedPNObjects[SetPartConstants.CONSTANT_USER_MAPPED_PN] = allRevisionsPartNumberObject;
      updatedPNObjects[SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP] = SetPartConstants.CONSTANT_KEY_ALL_REV_SKIP_VALUE_TRUE;
      return updatedPNObjects;
    },

    getDefaultAttributeValue(options) {
      let expressionList = options[SetPartConstants.CONSTANT_CONFIGURED_FORMULA_EXPRESSION][SetPartConstants.CONSTANT_FORMULA_EXPRESSION_LIST];
      if(expressionList.length != 0){
        expressionList.forEach((item) => {
          if(item[SetPartConstants.CONSTANT_TYPE] == 'Attribute' && item[SetPartConstants.CONSTANT_VALUE] != '') {
            let attrName = item[SetPartConstants.CONSTANT_ATTRIBUTE_NAME];
            let attrValue = item[SetPartConstants.CONSTANT_VALUE];
            defaultAttrValues[attrName] = attrValue;
          }
        });
      }
      return defaultAttrValues;
    },

    updateFacet() {},

    destroyComponent() {
      console.warn("destroyComponent called");
    },

    onResize() {
      console.warn("onResize");
    },

    onRefresh() {},

    onAction(actionId) {},
  });

  return ENONewEINFacet;
});


