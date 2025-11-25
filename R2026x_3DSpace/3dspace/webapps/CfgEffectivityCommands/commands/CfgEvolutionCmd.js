/**
 * @quickreview KR5     25:06:09 IR-1395679 used getChangeControlledList to get Change Controlled Objects.
 * @quickreview H37     25:05:23 FUN159054
 * @quickreview KR5     25:04:30 IR-1392144 errorDetails changes to message in method setxRevisionEffectivity. Reverted changes back to errorDetails as message is not present in response.
 * @quickreview PPD4    25:04:09 FUN154297 when xrevision is attached as scope we dont get model attributes so we fetch model attribtues from search
 * @quickreview KR5     25:03:24 TSK11967241 : Variant + Explicit Model_Version_Attached_With_No_Evolution_Crit_Error error message
 * @quickreview PPD4    25:02:06 IR-1349849 Magic probes COnfiguration filter
 * @quickreview KR5     25:02:03 TSK11976182 : CPQ getMultipleConfigurationContextInfo unwanted parameter removal
 * @quickreview KR5     25:01:15 TSK11976181 : CPQ getMultipleConfigurationContextInfo version 1.2
 * @quickreview PPD4    24:11:27 IR-1262081 Probes changes for xRevision edit evolution
 * @quickreview KR5     24:11:22 IR-1262081 : clode cleanup for isWUXDialogEnabled removal
 * @quickreview PPD4    unsetEvolutionEffectivities publish event change
 */
define('DS/CfgEffectivityCommands/commands/CfgEvolutionCmd', [
    'DS/CfgEffectivityCommands/commands/CfgEffCmd',
    'DS/CfgTracker/CfgTracker',
    'DS/CfgBaseUX/scripts/CfgUtility',
    'DS/CfgBaseUX/scripts/CfgXMLServices',
    'DS/CfgBaseUX/scripts/CfgDialog',
    'DS/CfgEvolutionUX/CfgEditEvolutionLayout',
    'DS/CfgEvolutionUX/CfgEvolutionLayoutFactory',
    'DS/CfgAuthoringContextUX/scripts/CfgAuthoringContext',
    'DS/WebappsUtils/WebappsUtils',
    'DS/PlatformAPI/PlatformAPI',
    'DS/Utilities/TouchUtils',
    'DS/Controls/TooltipModel',
    'DS/CfgEvolutionUX/CfgXRevisionEvolutionLayout',
    'DS/CfgBaseUX/scripts/CfgUXEnvVariables',
    'i18n!DS/CfgEvolutionUX/assets/nls/CfgEvolutionUX',
    'i18n!DS/CfgBaseUX/assets/nls/CfgBaseUXNLS',
], function (CfgEffCmd, CfgTracker, CfgUtility, CfgXMLServices, CfgDialog, CfgEditEvolutionLayout, CfgEvolutionLayoutFactory, CfgAuthoringContext, WebappsUtils, PlatformAPI, TouchUtils, WUXTooltipModel, CfgXRevisionEvolutionLayout, CfgUXEnvVariablesJS, cfgEvoNLS, CfgBaseUXNLS) {
    'use strict';

    var CfgEvolutionCmd = CfgEffCmd.extend({
        modelData: null,
        enabledCritData: null,
        cfgEvoDialog: null,

        destroy: function () {
            if (this.cfgEvoDialog) this.cfgEvoDialog.closeDialog();
        },

        /**
         * Launch Evolution Dialog for valid scenario
         */
        _processEvolutionDialogLaunch: function (data) {
            var that = this;

            CfgEvolutionCmd.modelData = null;
            CfgEvolutionCmd.enabledCritData = null;
            that.cfgUXEnvVariablesJS = CfgUXEnvVariablesJS.getCfgUXEnvVariables();
            let options = { referenceIds: [data.selectedNodes[0].parentID] };
            CfgUtility.getMultipleConfigurationContextInfo(options).then(
                async function (response) {
                    console.log(response);
                    let criteriaInfo = {
                        feature: 'false',
                        productState: 'false',
                        unit: 'false',
                        contextualDate: 'false',
                        milestone: 'false',
                        globalDate: 'false',
                        manufacturingPlan: 'false',
                    };
                    let modelInfo = [];
                    if (response == null || response == 'undefined') {
                        CfgEvolutionCmd.modelData = null;
                    } else if (response.contextInfo && response.contextInfo.length > 0) {
                        let { refBasedOn, modelsList } = await CfgUtility.parseGetMultipleConfigurationContextResponse(response);

                        if (refBasedOn === 'ModelVersion') {
                            that.enable();
                            CfgUtility.showwarning(cfgEvoNLS.Model_Version_Attached_With_No_Evolution_Crit_Error, 'error');
                            return;
                        }

                        if (refBasedOn === 'Model') modelInfo = modelsList;

                        if (response.enabledCriteria && response.enabledCriteria.length > 0) {
                            for (let counter = 0; counter < response.enabledCriteria.length; counter++) {
                                if (criteriaInfo[response.enabledCriteria[counter].criteriaName] != undefined) criteriaInfo[response.enabledCriteria[counter].criteriaName] = 'true';
                            }
                        }
                        CfgEvolutionCmd.modelData = modelInfo;
                        CfgEvolutionCmd.enabledCritData = criteriaInfo;
                    }
                    that.xRevisionContent = response.xRevisionContent;
                    if (that.xRevisionContent && that.xRevisionContent.length > 0) {
                    } else {
                        if (CfgEvolutionCmd.modelData == null || CfgEvolutionCmd.modelData.length == 0) {
                            that.enable();
                            CfgUtility.showwarning(cfgEvoNLS.No_Model_Title + ' ' + cfgEvoNLS.No_Model_Msg, 'error');
                            return;
                        } //[IR-951471 06-Jun-2022] added check for unaccessible contexts
                        else if (CfgEvolutionCmd.modelData.length > 0) {
                            //[IR-1016287 08-Dec-2022] read baseURL to prefix for icon and image path
                            let baseurl = enoviaServerFilterWidget.baseURL;

                            for (let counter = 0; counter < CfgEvolutionCmd.modelData.length; counter++) {
                                let currentModel = CfgEvolutionCmd.modelData[counter];
                                if (currentModel != undefined && currentModel.notification != undefined && currentModel.notification.type == 'ERROR') {
                                    CfgUtility.showwarning(currentModel.notification.message, 'error');
                                    that.enable();
                                    return;
                                }

                                //[IR-1016287 08-Dec-2022] Assign icon and image path with enoviaServerFilterWidget.baseURL
                                if (CfgEvolutionCmd.modelData[counter].type_icon_url != undefined && CfgEvolutionCmd.modelData[counter].type_icon_url.indexOf(baseurl) == -1) {
                                    CfgEvolutionCmd.modelData[counter].type_icon_url = baseurl + CfgEvolutionCmd.modelData[counter].type_icon_url;
                                }

                                if (CfgEvolutionCmd.modelData[counter].type_icon_large_url != undefined && CfgEvolutionCmd.modelData[counter].type_icon_large_url.indexOf(baseurl) == -1) {
                                    CfgEvolutionCmd.modelData[counter].type_icon_large_url = baseurl + CfgEvolutionCmd.modelData[counter].type_icon_large_url;
                                }
                            }
                        }
                    }
                    let modelCriteria = CfgEvolutionCmd.enabledCritData;
                    let criteriaCount = 0;
                    for (var key in modelCriteria) {
                        if (modelCriteria.hasOwnProperty(key)) {
                            if (modelCriteria[key] == 'true' && key != 'feature') criteriaCount++;
                        }
                    }
                    if (that.xRevisionContent && that.xRevisionContent.length > 0) {
                    } else if (criteriaCount == 0) {
                        that.enable();
                        CfgUtility.showwarning(cfgEvoNLS.No_Evolution_Crit_Error, 'error');
                        return;
                    }

                    var CloseHandlar = function () {
                        that.cfgEvoDialog.closeDialog();
                        if (that.options.postCloseHandler) that.options.postCloseHandler();
                    };

                    var buttonArray = null;

                    var options = {
                        postCloseHandler: that.options.postCloseHandler,
                        tenant: enoviaServerFilterWidget.tenant,
                        environment: 'Dashboard',
                        parent: null,
                        parentElement: null,
                        objectid: data.selectedNodes[0].id,
                        mode: 'EditEvolution',
                        iXml: null,
                        modelList: CfgEvolutionCmd.modelData,
                        enabledCritData: CfgEvolutionCmd.enabledCritData,
                        persistId: 'CfgEditEvolutionEffectivity',
                        width: 800,
                        height: 500,
                        minHeight: 406,
                        minWidth: 320,
                        selectedNodes: data.padNodes,
                        PADContext: data.PADContext,
                        Access: { SetEvolutionEffectvity: 'true' },
                        // displayCompactMode: /*!(TouchUtils.getTouchMode() == undefined || TouchUtils.getTouchMode() == false ? false : true)*/,
                        dialogue: {
                            header: cfgEvoNLS.Edit_Evo_Title + data.selectedNodes[0].alias,
                            buttonArray: buttonArray,
                            target: widget.body,
                            ca: { headers: [] },
                            hasEffectivity: null,
                            effExpressionXml: null,
                            object: null,
                        },
                    };

                    var cfg = CfgAuthoringContext.get();
                    if (cfg && cfg.AuthoringContextHeader) {
                        for (var key in cfg.AuthoringContextHeader) {
                            options.dialogue.ca.headers.push({ key: key, value: cfg.AuthoringContextHeader[key] });
                        }
                    }

                    var returnedPromise = new Promise(function (resolve, reject) {
                        var failure = function (response) {
                            that.enable();
                            console.log(response);
                            reject(response);
                        };
                        var success = async function (response) {
                            var hasEffectivity = null;
                            var effExpressionXml = null;

                            var instanceID = options.objectid;
                            var instObj = response.expressions;
                            if (instObj[instanceID].status === 'ERROR' || instObj[instanceID].hasEffectivity === 'ERROR') {
                                that.enable();
                                //console.log('getMultipleFilterableObjectInfo Service Failure');
                                CfgUtility.showwarning(cfgEvoNLS.Save_Fail_Evo_Effectivity, 'error');
                                return;
                            }
                            if (instObj[instanceID].hasEffectivity === 'NO') {
                                console.log('Has No Effectivity');
                                hasEffectivity = false;
                            } else {
                                if (instObj[instanceID].content.ConfigChange != null && instObj[instanceID].content.ConfigChange != 'undefined') {
                                    that.enable();
                                    //console.log('Non Decoupled/Legacy Effectivity');
                                    CfgUtility.showwarning(cfgEvoNLS.CFG_Legacy_Eff_Error, 'error');
                                    return;
                                } else if (instObj[instanceID].content.Evolution == null || instObj[instanceID].content.Evolution.Current == null || instObj[instanceID].content.Evolution.Current == '' || instObj[instanceID].content.Evolution.Current == 'undefined') {
                                    console.log('Variant Effectivity might be set hence Evolution would be null or undefined');
                                    hasEffectivity = false;
                                }
                                //[IR-807104 30-Oct-2020] OperationHandler tag is part of current expression when instance is in split. In this case parent of instance is automatically gets change controlled.
                                //change controlled check is performed at first stage itself so this block of code can be commented.
                                //else if (instObj[instanceID].content.Evolution.Current.indexOf('OperationHandler') >= 0) {
                                //    that.enable();
                                //    //console.log('Instance under Change Control');
                                //    CfgUtility.showwarning(cfgEvoNLS.No_Model_Title + ' ' + cfgEvoNLS.Work_Under_Eff_Error, 'error');
                                //    return;
                                //}
                                else {
                                    console.log('Decoupled Evolution Effectivity');
                                    hasEffectivity = true;
                                    effExpressionXml = instObj[instanceID].content.Evolution.Current;

                                    //[IR-951959 07-Jun-2022] For Extend Evolution Effectivity performed product should not allow Edit Evolution Effectivity operation.
                                    if (effExpressionXml.indexOf('<OR>') > 0 && effExpressionXml.indexOf('</OR>') > 0) {
                                        that.enable();
                                        CfgUtility.showwarning(cfgEvoNLS.Extend_Evolution_Eff_Error, 'error');
                                        return;
                                    }

                                    //[IR-951469 16-Jun-2022] For not accessible Effectvity to other user, Not Accessible Effectivity error message shown.
                                    if (effExpressionXml.indexOf('###') > 0) {
                                        that.enable();
                                        if (CfgEvolutionLayoutFactory.isInaccessibleNodesInXml(effExpressionXml) == true) {
                                            CfgUtility.showwarning(cfgEvoNLS.Not_Accessible_Eff_Error, 'error');
                                            return;
                                        }
                                    }
                                }
                            }

                            options.dialogue.hasEffectivity = hasEffectivity;
                            options.dialogue.effExpressionXml = effExpressionXml;

                            if (!hasEffectivity) {
                                //when no evolution effectivity
                                //instance belong to frozen check =? if yes, block the command
                                let instanceIdsArr = [];
                                instanceIdsArr.push(instanceID);
                                let frozenResponse = await CfgUtility.instancesBelongToFrozenEvolution(instanceIdsArr).catch((error) => {
                                    console.log('instancesBelongToFrozenEvolution webservice has failed with below error:\n ');
                                    console.error(error);
                                    resolve();
                                    return;
                                });

                                if (!CfgUtility.isDefined(frozenResponse) || !CfgUtility.isDefined(frozenResponse.resources) || frozenResponse.resources.length == 0) {
                                    console.log('instancesBelongToFrozenEvolution webservice is success but there is no response as expected.');
                                    resolve();
                                    return;
                                }

                                frozenResponse.resources.forEach((resource, index) => {
                                    if (resource.isFrozenEvolution === 'Yes') {
                                        reject(cfgEvoNLS.CfgFrozenErrorInEditEvol); //reject with error message to be displayed.
                                        return;
                                    }
                                });
                            }

                            resolve('Effectivity Loaded for :' + instanceID);
                        };
                        var jsonData = {
                            version: '2.0',
                            output: {
                                targetFormat: 'XML',
                                withDescription: 'YES',
                                view: 'Current',
                                domains: 'Evolution',
                            },
                            pidList: [options.objectid],
                        };

                        var url = '/resources/modeler/configuration/navigationServices/getMultipleFilterableObjectInfo';
                        var postdata = JSON.stringify(jsonData);
                        CfgUtility.makeWSCall(url, 'POST', 'enovia', 'application/json', postdata, success, failure, true);
                    });
                    returnedPromise.then(
                        function (response) {
                            //if(options.modelList.length > 1){
                            that.cfgEvoDialog = new CfgDialog(options);
                            options.parent = that.cfgEvoDialog.container;
                            options.parentElement = that.cfgEvoDialog.container;
                            options.dialogue.object = that.cfgEvoDialog;
                            that.cfgEvoDialog.render();

                            if (that.xRevisionContent && that.xRevisionContent.length > 0) {
                                let onButtonClickCB = (iData) => {
                                    if (iData.event.buttonId == 'firstButton') {
                                        const xRevXMLExpr = CfgXMLServices.getxRevisionEvolutionExpression(iData);
                                        if (iData.isExpressionModified) that.setxRevisionEffectivity(xRevXMLExpr);
                                        if (iData.event.propagateSessionEffectivity) that.setSessionEffectivity(xRevXMLExpr);
                                        options.dialogue.object.closeDialog();
                                        if (iData.probesData) {
                                            let operationValue = 'Edit_Evolution_OK_';
                                            if (iData.event.propagateSessionEffectivity) {
                                                operationValue = 'SaveAs_Session_Evolution_OK_';
                                            }
                                            let probesData = CfgUtility.getMagicProbesData(iData);
                                            for (let counter = 0; counter < probesData.length; counter++) {
                                                let operationName = operationValue + probesData[counter];
                                                that.processProbesData(operationName);
                                            }
                                        }
                                    } else if (iData.event.buttonId == 'secondButton') {
                                        options.dialogue.object.closeDialog();
                                        that.processProbesData('Edit_Evolution_Cancel');
                                    }
                                };
                                let xRevLayoutOptions = {
                                    xRevisionContent: {
                                        referencePID: that.xRevisionContent[0] ? that.xRevisionContent[0].referencePID : '',
                                    },
                                    parentElement: that.cfgEvoDialog.container,
                                    onButtonClickCB: onButtonClickCB,
                                    effExpressionXml: options.dialogue.effExpressionXml,
                                    hasEffectivity: options.dialogue.hasEffectivity,
                                };
                                let CfgXRevisionEvolutionLayoutInstance = new CfgXRevisionEvolutionLayout();
                                CfgXRevisionEvolutionLayoutInstance.create(xRevLayoutOptions);
                            } else {
                                CfgEditEvolutionLayout.create(options);
                            }

                            //[Magic cloud probes]
                            that.processProbesData('Edit_Evolution_Effectivity_Dialog_Open');

                            that.enable();
                        },
                        function (error_response) {
                            that.enable();
                            if (CfgUtility.isParamDefined(error_response)) CfgUtility.showwarning(error_response, 'error');
                            else CfgUtility.showwarning(cfgEvoNLS.Save_Fail_Evo_Effectivity, 'error');
                        }
                    );
                },
                function (error_response) {
                    CfgUtility.showwarning(cfgEvoNLS.Save_Fail_Evo_Effectivity, 'error');
                }
            );
        },

        /**
         * @desc method to process and send probes data
         */
        processProbesData: function (commandOperation) {
            let magicAppId = 'defaultAppID';
            let magicAppName = 'ODT Environment';
            if (widget && widget.data && widget.data.appId) {
                magicAppId = widget.data.appId;
            }
            if (widget && widget.options && widget.options.title) {
                magicAppName = widget.options.title;
            }

            let probesOptions = {
                AppId: magicAppId,
                AppName: magicAppName,
                CommandName: CfgTracker.Labels['EDIT_EVOLUTION_EFFECTIVITY'],
                CommandOperation: commandOperation,
                ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'],
                ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'],
            };
            CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(probesOptions);
        },

        /**
         * To set Evolution effectivity of instance which is associated to xRevision
         * @param {*} globalxRevisionexpression
         */
        setxRevisionEffectivity: async function (globalxRevisionexpression) {
            let cfgEvoDialog = this.cfgEvoDialog;
            try {
                if (globalxRevisionexpression === '') {
                    let inputJson = {
                        instanceID: cfgEvoDialog.options.objectid,
                    };
                    let response = await CfgUtility.unsetEvolutionEffectivities(inputJson);
                    this.publishEvent(response);
                    if (response.GlobalStatus !== undefined && response.GlobalStatus == 'SUCCESS' && response && response.results && response.results[0] && response.results[0].errorDetails) {
                        CfgUtility.showwarning(response.results[0].errorDetails, 'error');
                    } else if (response.GlobalStatus !== undefined && response.GlobalStatus == 'SUCCESS') {
                        CfgUtility.showwarning(cfgEvoNLS.Save_Successful_Evo_Effectivity, 'success');
                    }
                } else {
                    let inputJson = {
                        version: '2.0',
                        domain: 'Evolution',
                        view: 'All',
                        expressionList: [{ pid: cfgEvoDialog.options.objectid, EvolutionContent: globalxRevisionexpression }],
                        isxRevision: true,
                    };
                    let response = await CfgUtility.setEvolutionEffectivities(inputJson);

                    if (response.GlobalStatus != undefined && response.GlobalStatus == 'SUCCESS') {
                        let result = response.results[0];
                        let existingDetails = result.existing;
                        if (existingDetails != undefined && existingDetails.content != undefined && existingDetails.content.Evolution != undefined) {
                            if (existingDetails.content.Evolution.Current != undefined) {
                                let currentXmlValue = existingDetails.content.Evolution.Current;
                                response.results[0].existing.content.Evolution.currentDisplayExpression = CfgUtility.getDisplayExpressionUsingXSLT(currentXmlValue);
                            }
                            if (existingDetails.content.Evolution.Projected != undefined) {
                                let projectedXmlValue = existingDetails.content.Evolution.Projected;
                                response.results[0].existing.content.Evolution.projectedDisplayExpression = CfgUtility.getDisplayExpressionUsingXSLT(projectedXmlValue);
                            }
                        }
                    }
                    this.publishEvent(response);
                    if ((response.GlobalStatus !== undefined && response.GlobalStatus == 'SUCCESS') || (response.unset !== undefined && (response.unset.Evolution.status.toUpperCase() === 'SUCCESS' || response.unset.Evolution.status.toUpperCase() === 'WARNING')))
                        CfgUtility.showwarning(cfgEvoNLS.Save_Successful_Evo_Effectivity, 'success');
                    else if (response.GlobalStatus !== undefined && response.GlobalStatus == 'ERROR') CfgUtility.showwarning(response.results[0].errorDetails, 'error');
                    else CfgUtility.showwarning(cfgEvoNLS.Save_Fail_Evo_Effectivity, 'error');
                }
            } catch (e) {
                CfgUtility.showwarning(cfgEvoNLS.Save_Fail_Evo_Effectivity, 'error');
                cfgEvoDialog.closeDialog();
            }
        },

        publishEvent: function (response) {
            if ((response.GlobalStatus != undefined && response.GlobalStatus == 'SUCCESS') || cfgEvoDialog.options.PADContext) {
                //Publish Effectivity modification event for updating Effectivity details
                var refreshEventMessage = {
                    commandName: 'cfgEditEvolution',
                    widgetId: widget.id,
                    response: CfgUtility.getEventResponse(response),
                    data: {},
                };
                CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);
            }
        },

        /**
         * @desc function to set session effcectivity based on expression as input
         * @param {*} globalxRevisionexpression
         */
        setSessionEffectivity: function (globalxRevisionexpression) {
            let xRevisionGraphId = this.xRevisionContent[0] && this.xRevisionContent[0].xRevisionGraph ? this.xRevisionContent[0].xRevisionGraph.physicalid : '';
            let xRevReferencePId = this.xRevisionContent[0].referencePID ? this.xRevisionContent[0].referencePID : '';
            let xRevisionGraphTitle = this.xRevisionContent[0] && this.xRevisionContent[0].xRevisionGraph ? this.xRevisionContent[0].xRevisionGraph.name : '';
            let xRevReferenceInfo = { xRevReferencePId: xRevReferencePId, xRevisionGraphTitle: xRevisionGraphTitle };
            let sessionXml = {
                'Dictionary Contexts': [xRevisionGraphId],
                'Evolution Expression': globalxRevisionexpression,
                xRevReferenceInfo: xRevReferenceInfo,
            };
            CfgAuthoringContext.saveAsSessionEvolution(sessionXml);
        },

        /**
         * For displaying Work under Change Action or Work under Evolution Effectivity warning message
         */
        showWarningMesssage: function (workUnderType, data) {
            var that = this;

            //apply button callback for the dialog
            var ApplyCallback = function () {
                //[IR-1131199 26-Jul-2023] need to publish event to refresh Authoring Context in twin widget
                if (workUnderType == 'ChangeAction') PlatformAPI.publish('toggleDeActiveCA' + CfgAuthoringContext.myAuthkey);
                else PlatformAPI.publish('toggleDeActiveSE' + CfgAuthoringContext.myAuthkey);
                warningDialog.closeDialog();
                that._processEvolutionDialogLaunch(data);
            }.bind(that);

            //close callback
            var CloseCallback = function () {
                that.enable();
                warningDialog.closeDialog();
            }.bind(that);

            //IR-1138556-3DEXPERIENCER2023x : Added minWidth and minHeight values for adaptative dialog size
            //build dialog options
            var options = {
                minWidth: 1,
                minHeight: 1,
                touchMode: TouchUtils.getTouchMode(),
                isResizable: false,
                dialogue: {
                    header: cfgEvoNLS.CFG_Warning,
                    buttonArray: [
                        { label: 'Ok', labelValue: cfgEvoNLS.CFG_Ok, handler: ApplyCallback, className: 'primary' },
                        { label: 'Cancel', labelValue: cfgEvoNLS.CFG_Cancel, handler: CloseCallback, className: 'default' },
                    ],
                    target: widget.body, // element,
                    object: null,
                    postCrossHandler: CloseCallback,
                },
            };

            //dialog body creation
            var warningDialog = new CfgDialog(options); //dialog for gloabal expression
            warningDialog.render();
            warningDialog.container.setStyle('overflow', 'hidden');
            warningDialog.container.setStyle('text-overflow', 'ellipsis');

            var putOnHold = cfgEvoNLS.CFG_PutOnHold;
            if (workUnderType == 'ChangeAction') {
                //Added Ellipsis, Tooltip and overflow as hidden
                var iconAuthImg = UWA.createElement('img', { src: WebappsUtils.getWebappsAssetUrl('CfgEffectivityCommands', 'icons/32/I_AuthCtxCA.png'), styles: { float: 'left' }, events: {} });
                var authoringOn = cfgEvoNLS.CFG_ChangeActionOn;
                var totalMessage = authoringOn + '</br>' + putOnHold;
                var authContent = UWA.createElement('div', { id: 'caOn', styles: { 'padding-left': '20px', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }, html: totalMessage });

                authContent.tooltipInfos = new WUXTooltipModel({
                    shortHelp: authoringOn + '\n' + putOnHold,
                    mouseRelativePosition: true,
                    position: 'bottom',
                    arrowBoxFlag: false,
                });
                iconAuthImg.inject(warningDialog.container);
                authContent.inject(warningDialog.container);
            } else {
                //Added Ellipsis, Tooltip and overflow as hidden
                var iconAuthImg = UWA.createElement('img', { src: WebappsUtils.getWebappsAssetUrl('CfgEffectivityCommands', 'icons/32/I_AuthCtxSE.png'), styles: { float: 'left' }, events: {} });
                var authoringOn = cfgEvoNLS.CFG_EvolutionOn;
                var totalMessage = authoringOn + '</br>' + putOnHold;
                var authContent = UWA.createElement('div', { id: 'evolutionOn', styles: { 'padding-left': '20px', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }, html: totalMessage });

                authContent.tooltipInfos = new WUXTooltipModel({
                    shortHelp: authoringOn + '\n' + putOnHold,
                    mouseRelativePosition: true,
                    position: 'bottom',
                    arrowBoxFlag: false,
                });
                iconAuthImg.inject(warningDialog.container);
                authContent.inject(warningDialog.container);
            }
        },

        execute: function () {
            var that = this;
            that.disable();
            if (!this.isConfigAuthorized()) return; //FUN159054
            var data = that.getData();

            if (data.selectedNodes && data.selectedNodes.length > 0) {
                if (data.selectedNodes[0].isRoot == true) {
                    console.log('Cannot Open Edit Evolution Dialog for a root node');
                    that.enable();
                } else {
                    var putOnHold_callback = function () {
                        //checked selected products parent refernce is change controlled.
                        CfgUtility.getChangeControlledList([{ id: data.selectedNodes[0].parentID }]).then(
                            function (change_response) {
                                //change_response contains change controlled ids array. For non-change controlled data.selectedNodes[0].parentID, empty array [] returned.
                                if (change_response.length > 0) {
                                    that.enable();
                                    //[IR-807104 30-Oct-2020] Changed error message to make them grammatically correct
                                    //CfgUtility.showwarning(cfgEvoNLS.No_Model_Title + ' ' + cfgEvoNLS.Work_Under_Eff_Error, 'error');
                                    CfgUtility.showwarning(cfgEvoNLS.CFG_Work_Under_Eff_Error, 'error');
                                    return;
                                }

                                //Work under Change Action or work under Evolution Effectivity, Edit Evolution operation will fail due to Authoring context.
                                //We are showing warning message to put Authoring context on Hold for Edit Evolution operation
                                var workUnderType = [];
                                var cfg = CfgAuthoringContext.get();
                                if (cfg && cfg.AuthoringContextHeader) {
                                    for (var key in cfg.AuthoringContextHeader) {
                                        if (key === 'DS-Change-Authoring-Context') {
                                            workUnderType.push('ChangeAction');
                                        } else if (key === 'DS-Configuration-Authoring-Context') {
                                            workUnderType.push('Evolution');
                                        }
                                    }
                                }

                                //For empty Authoring context, Edit Evolution dialog is shown for updating Evolution Effectivity.
                                if (workUnderType.length == 0) {
                                    that._processEvolutionDialogLaunch(data);
                                } else {
                                    //warning message to put Authoring context on Hold is shown depending on Authoring type "work under Change Action" or "work under Evolution Effectivity"
                                    that.showWarningMesssage(workUnderType, data);
                                }
                            },
                            function () {
                                that.enable();
                                console.log('change controlled WS failed');
                            }
                        );
                    };

                    //tennat and security context requires before web-service calls
                    if (widget) enoviaServerFilterWidget.tenant = widget.getValue('x3dPlatformId');
                    else enoviaServerFilterWidget.tenant = 'OnPremise';

                    CfgUtility.populate3DSpaceURL().then(function () {
                        CfgUtility.populateSecurityContext().then(function () {
                            CfgUtility.getPAndOAccess(['GetEvolution', 'SetEvolution']).then(
                                //IR-822862
                                function (infoPAndOAccess) {
                                    if (infoPAndOAccess.SetEvolution == 'Not Granted') {
                                        CfgUtility.showwarning(CfgBaseUXNLS.CfgMessageAccessRightsError, 'error');
                                        that.enable();
                                    } else {
                                        putOnHold_callback();
                                    }
                                }
                            );
                        });
                    });
                }
            }
        },
    });

    return CfgEvolutionCmd;
});
