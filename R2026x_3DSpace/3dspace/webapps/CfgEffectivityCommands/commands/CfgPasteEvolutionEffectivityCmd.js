/**
 * @quickreview KR5     25:06:09 IR-1395679 used getChangeControlledList to get Change Controlled Objects.
 * @quickreview H37     25:05:23 FUN159054
 * @quickreview KR5     25:02:03 TSK11976182 : CPQ getMultipleConfigurationContextInfo unwanted parameter removal
 * @quickreview KR5     25:01:15 TSK11976181 : CPQ getMultipleConfigurationContextInfo version 1.2
 * @quickreview KR5     24:07:11 added only Frozen Check for xRevision Paste Evolution Effectivity operation
 * @quickreview PPD4    24:06:24 unsetEvolutionEffectivities web service version changes
 */
define('DS/CfgEffectivityCommands/commands/CfgPasteEvolutionEffectivityCmd', [
    'DS/CfgTracker/CfgTracker',
    'DS/CfgTracker/CfgDimension',
    'DS/CfgTracker/CfgValue',
    'DS/CfgBaseUX/scripts/CfgUtility',
    'DS/CfgBaseUX/scripts/CfgData',
    'i18n!DS/CfgWebAppEffectivityUX/assets/nls/CfgEffectivityNLS',
    'i18n!DS/CfgBaseUX/assets/nls/CfgBaseUXNLS',
    'DS/CfgAuthoringContextUX/scripts/CfgAuthoringContext',
    'DS/CfgEffectivityCommands/commands/CfgEffCmd',
], function (CfgTracker, CfgDimension, CfgValue, CfgUtility, CfgData, EffectivityNLS, CfgBaseUXNLS, CfgAuthoringContext, CfgEffCmd) {
    'use strict';
    var successfullList = [];
    var instanceList = [];
    var failedList = [];
    var warningList = [];
    var emptyEvolutionList = [];
    var configChageList = [];
    var frozenEvolutionList = [];
    var availableEvolutionList = [];
    var availableVarAndEvolutionList = [];
    var pasteCriteriaValid = 'true';
    var changeEnabledEffectivityColumn = 'true';
    let errorMessageValue = '';

    var CfgPasteEvolutionEffectivityCmd = CfgEffCmd.extend({
        /*
         * Override base class CfgEffCmd function for selectedNodes.length >= 1 because Paste Evolution Effectivity functionality is supported for multuiple products
         */
        _checkSelection: function () {
            //-- Init the selection
            this._SelectedID = '';

            var data = this.getData();
            if (data.selectedNodes.length >= 1) {
                this._SelectedID = data.selectedNodes[0].id || '';
                this._SelectedAlias = data.selectedNodes[0].alias || '?';
                this.isRoot = data.selectedNodes[0].isRoot;
            }

            //-- State of the command
            this._setStateCmd();
        },

        /*
         * Used to get Domain details before Paste Evolution Effectivity operation. Forbidden types like 3DSpahe object is added to failedList and shown in error message.
         * When empty Effectivity is copied and user tries to Paste on products for which there is No Evolution Effectivity then operation is useless message shown.
         * Only Valid products are sent for Paste Evolution Effectivity operation. For PCS improvement lightweight _getAvailableDemainDetails is used.
         */
        //getFrozenEffectivityDetails response will give Available Domain Details
        _getAvailableDomainDetails: function (iResponse) {
            if (iResponse.length > 0) {
                //Remove frozen instances from selected instances to avoid unwanted Evolution Effectivity modification.
                for (var count = 0; count < iResponse.length; count++) {
                    var instanceId = iResponse[count].instanceId;
                    if (iResponse[count].AvailableDomainDetails != undefined) {
                        var domainVaue = iResponse[count].AvailableDomainDetails;
                        if (domainVaue == 'NoEff' || domainVaue == 'Variant') emptyEvolutionList.push(instanceId);
                        if (domainVaue == 'ConfigChange' || domainVaue == 'UnsupportedType') configChageList.push(instanceId);
                        if (domainVaue == 'NoEff' || domainVaue == 'Evolution') availableEvolutionList.push(instanceId);
                        if (domainVaue == 'ALL' || domainVaue == 'Variant') availableVarAndEvolutionList.push(instanceId);

                        if (iResponse[count].isFrozen == true) {
                            frozenEvolutionList.push(instanceId);
                        }
                    }
                }
            }
        },

        /*
         * Function used show error / successful messages after Paste Evolution Effectivity operation.
         */
        _showMessage: function () {
            let pasteEvolutionErrorMessage = ' ';
            if (failedList.length > 0) {
                pasteEvolutionErrorMessage = EffectivityNLS.CFG_Paste_Evolution_Effectivity_Failed.replace('{1}', failedList.toString());
            }

            if (successfullList.length == 1 && failedList.length == 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
                CfgUtility.showwarning(pasteEvolutionErrorMessage, 'error');
            } else if (successfullList.length == 0 && failedList.length == 1) {
                CfgUtility.showwarning(pasteEvolutionErrorMessage, 'error');
            } else if (successfullList.length > 1 && failedList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_AllSuccessful, 'success');
            } else if (successfullList.length > 1 && failedList.length == 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_PartialSuccessful, 'success');
                CfgUtility.showwarning(pasteEvolutionErrorMessage, 'error');
            } else if (successfullList.length > 1 && failedList.length > 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_PartialSuccessful, 'success');
                CfgUtility.showwarning(pasteEvolutionErrorMessage, 'error');
            } else if (successfullList.length == 1 && failedList.length > 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
                CfgUtility.showwarning(pasteEvolutionErrorMessage, 'error');
            } else if (successfullList.length == 1 && failedList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
            } else if (successfullList.length == 0 && failedList.length > 1) {
                CfgUtility.showNotifs('error', EffectivityNLS.CFG_Paste_Evolution_Effectivity_AllFailed);
            }
        },

        /*
         * Function used show error / successful messages if Evolution Effectivity for source product is Empty during Copy Evolution Effectivity operation.
         */
        _showEmptyMessage: function () {
            if (successfullList.length > 1 && failedList.length == 0 && warningList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Evolution_Effectivity_AllSuccessful, 'success');
                return;
            } else if (failedList.length > 1 && successfullList.length == 0 && warningList.length == 0) {
                CfgUtility.showNotifs('error', EffectivityNLS.CFG_Empty_Evolution_Effectivity_AllFailed);
                return;
            }

            if (failedList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Evolution_Effectivity_Failed.replace('{1}', failedList.toString()), 'error');
            if (successfullList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Evolution_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
            if (warningList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Evolution_Effectivity_Warning + ' ' + warningList.toString(), 'info');
        },

        /*
         * Function used show error messages for web-service failure during Paste Evolution Effectivity operation. Here spinner reset is performed with original Effectivity values.
         */
        _showErrorMessage: function (options) {
            var that = this;
            var data = options.data;
            var nodeList = data.padNodes;

            failedList.push(data.selectedNodes[0].alias);
            if (instanceList.length > 1) failedList.push(data.selectedNodes[0].alias);

            //For already started spinner, Original values should be assigned to Effectivity columns.
            if (!that.options.context) {
                var length = data.selectedNodes.length;
                for (var i = 0; i < length; i++) {
                    var hasEff = data.selectedNodes[i].effectivity;
                    if (changeEnabledEffectivityColumn == 'true') {
                        var currentEvolutionEff = data.selectedNodes[i].currentEvolutionEffectivity;
                        var projectedEvolutionEff = data.selectedNodes[i].projectedEvolutionEffectivity;
                        nodeList[i].updateOptions({
                            grid: {
                                Effectivity: hasEff,
                                CurrentEvolutionEffectivity: currentEvolutionEff,
                                ProjectedEvolutionEffectivity: projectedEvolutionEff,
                            },
                        });
                    } else {
                        var evolutionEff = data.selectedNodes[i].evolutionEffectivity;
                        nodeList[i].updateOptions({
                            grid: {
                                Effectivity: hasEff,
                                EvolutionEffectivity: evolutionEff,
                            },
                        });
                    }
                }
            }

            //[FUN126066 Enhance error messages for set effectivity web services] show error message from wb-service.
            if (errorMessageValue != '') {
                CfgUtility.showwarning(errorMessageValue, 'error');
                errorMessageValue = '';
                return;
            }

            that._showMessage();
        },

        //[Magic cloud probes]
        setMagicProbesDataForPasteEvolution: function (iOperation) {
            let magicAppId = 'defaultAppID';
            let magicAppName = 'ODT Environment';
            if (widget && widget.data && widget.data.appId) {
                magicAppId = widget.data.appId;
            }
            if (widget && widget.options && widget.options.title) {
                magicAppName = widget.options.title;
            }

            let probesOptions = { AppId: magicAppId, AppName: magicAppName, CommandName: CfgTracker.Labels['COPY_PASTE_EVOLUTION_EFFECTIVITY'], CommandOperation: iOperation, ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'], ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'] };
            CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(probesOptions);
        },

        /*
         * Function used to perform Paste Evolution Effectivity operation. Effectivity is set to Target products.
         */
        _pasteEvolutionEffectivities: function (options) {
            var returnedPromise = new Promise(function (resolve, reject) {
                var failure = function (response) {
                    reject(response);
                };
                var success = function (response) {
                    //[IR-940450 05-May-2022] for status SUCCESS only need to publish Effectivity modification event.
                    if (response.GlobalStatus == 'SUCCESS') {
                        //Publish Effectivity modification event for updating Effectivity details
                        var refreshEventMessage = {
                            commandName: 'cfgPasteEvolution',
                            widgetId: widget.id,
                            response: response,
                            data: {},
                        };

                        CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);
                    }

                    resolve(response);
                };

                var inputJson = {
                    version: options.version,
                    output: {
                        targetFormat: 'TXT',
                        domains: options.domain,
                        view: options.view,
                    },
                    expressionList: options.expressionList,
                };

                var url = '/resources/modeler/configuration/authoringServices/setEvolutionEffectivities?traces=0&perfo=0 HTTP/1.1';
                var inputJsonTxt = JSON.stringify(inputJson);

                CfgUtility.makeWSCall(url, 'POST', 'enovia', 'application/json', inputJsonTxt, success, failure, true, options.wsOptions);
            });
            return returnedPromise;
        },

        /*
         * Function used to perform unset Evolution Effectivity operation. Evolution Effectivity is cleared on Target products.
         */
        _pasteUnsetEvolutionEffectivities: function (options) {
            var returnedPromise = new Promise(function (resolve, reject) {
                var failure = function (response) {
                    reject(response);
                };
                var success = function (response) {
                    //Publish Effectivity modification event for updating Effectivity details
                    var refreshEventMessage = {
                        commandName: 'cfgPasteEvolution',
                        widgetId: widget.id,
                        response: response,
                        data: {},
                    };

                    CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);

                    resolve(response);
                };

                var inputJson = {
                    version: '2.0',
                    unsetList: options.unsetList,
                };

                var url = '/resources/modeler/configuration/authoringServices/unsetEvolutionEffectivities';
                var inputJsonTxt = JSON.stringify(inputJson);

                CfgUtility.makeWSCall(url, 'POST', 'enovia', 'json', inputJsonTxt, success, failure, true, options.wsOptions);
            });

            return returnedPromise;
        },

        /*
         * Function used to send cloud probes tracking details during Paste Evolution Effectivity operation.
         */
        sendPasteEvolutionTrackerEvent: function (options) {
            try {
                let evolutionCriteria = {
                    mvCriteria: 'NONE',
                    mpCriteria: 'NONE',
                    unitCriteria: 'NONE',
                    dateCriteria: 'NONE',
                };

                if (CfgData.probesValuesForPasteEvolutionOpertaion != undefined)
                    evolutionCriteria = {
                        mvCriteria: CfgData.probesValuesForPasteEvolutionOpertaion.mvCriteria,
                        mpCriteria: CfgData.probesValuesForPasteEvolutionOpertaion.mpCriteria,
                        unitCriteria: CfgData.probesValuesForPasteEvolutionOpertaion.unitCriteria,
                        dateCriteria: CfgData.probesValuesForPasteEvolutionOpertaion.dateCriteria,
                    };

                CfgTracker.createEventBuilder({
                    category: CfgTracker.Category['USAGE'],
                    action: CfgTracker.Events['CLICK'],
                    tenant: widget.getValue('x3dPlatformId'),
                })
                    .setLabel(CfgTracker.Labels['COPY_PASTE_EVOLUTION_EFFECTIVITY'])
                    .setAppId(widget.data.appId || 'NO_APP_ID')
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_EFFECTIVITY_WIDGET, widget.data.title || widget.options.title || 'ODT Environment')
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_EFFECTIVITY_MODE, 'Paste')
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_MODEL_VERSION, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.mvCriteria])
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_MANUFACTURING_PLAN, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.mpCriteria])
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_UNIT, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.unitCriteria])
                    .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_DATE, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.dateCriteria])
                    .addPersonalValue(CfgValue.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_NO_OF_MODEL, options.contextLength)
                    .addPersonalValue(CfgValue.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_NO_OF_OBJECT, options.selectedNodesLength)
                    .send();
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * Function used to stop spinner with original values during error scenario.
         */
        resetSpinner: function (iOptions) {
            let data = CfgData.SelectedDataForPasteOperation;
            let nodeList = data.padNodes;
            if (iOptions.showSpinner == true) {
                let hasEff, evolutionEff, currentEvolutionEff, projectedEvolutionEff;
                if (changeEnabledEffectivityColumn == 'true') {
                    nodeList[iOptions.counter].updateOptions({
                        grid: {
                            Effectivity: hasEff,
                            CurrentEvolutionEffectivity: currentEvolutionEff,
                            ProjectedEvolutionEffectivity: projectedEvolutionEff,
                        },
                    });
                } else {
                    nodeList[iOptions.counter].updateOptions({
                        grid: {
                            Effectivity: hasEff,
                            EvolutionEffectivity: evolutionEff,
                        },
                    });
                }
            } else {
                if (changeEnabledEffectivityColumn == 'true') {
                    nodeList[iOptions.counter].updateOptions({
                        grid: {
                            Effectivity: data.selectedNodes[iOptions.counter].effectivity,
                            CurrentEvolutionEffectivity: data.selectedNodes[iOptions.counter].currentEvolutionEffectivity,
                            ProjectedEvolutionEffectivity: data.selectedNodes[iOptions.counter].projectedEvolutionEffectivity,
                        },
                    });
                } else {
                    nodeList[iOptions.counter].updateOptions({
                        grid: {
                            Effectivity: data.selectedNodes[iOptions.counter].effectivity,
                            EvolutionEffectivity: data.selectedNodes[iOptions.counter].evolutionEffectivity,
                        },
                    });
                }
            }
        },

        /*
         * When user clicks on Action bar Paste Evolution Effectivity command as well as Paste Evolution Effectivity contextual menu then execute is called.
         * Updated value for allowedLimitNo = 50 for 2018x FD08 function FUN085315.
         */
        execute: function () {
            if (!this.isConfigAuthorized()) return; //FUN159054
            //display warning message as Effectivity is not copied
            if (CfgData && CfgData.isEvolutionEffAvailable == ' ') {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Info, 'info');
                return;
            }

            pasteCriteriaValid = 'true';
            changeEnabledEffectivityColumn = 'true';
            var that = this;
            that.disable();
            var data = that.getData();
            //[IR-983903 12-Sep-2022] Increased Paste Evolution Effectivity operation limit
            var allowedLimitNo = 500;

            if (data.selectedNodes && data.selectedNodes.length > 0) {
                if (data.selectedNodes.length > allowedLimitNo) {
                    //For more than 500 product selected for Paste Evolution Effectivity operation will show error message.
                    var numberoflimitMessage = EffectivityNLS.CFG_LimitNo_Paste_Evolution_Effectivity.split('5').join(allowedLimitNo);
                    CfgUtility.showwarning(numberoflimitMessage, 'error');
                } else {
                    //check whether change controlled
                    var isChangePromise = CfgUtility.getChangeControlledList([{ id: data.selectedNodes[0].parentID }]);
                    isChangePromise.then(
                        //change_response contains change controlled ids array. For non-change controlled data.selectedNodes[0].parentID, empty array [] returned.
                        function (change_response) {
                            var authHeaders = [];
                            var cfg = CfgAuthoringContext.get();
                            if (cfg && cfg.AuthoringContextHeader) {
                                for (var key in cfg.AuthoringContextHeader) {
                                    authHeaders.push({
                                        key: key,
                                        value: cfg.AuthoringContextHeader[key],
                                    });
                                }
                            }

                            //For Work Under authoring context present, Paste Evolution Effectivity operation should not be allowed
                            if (authHeaders.length > 0) {
                                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Evolution_Not_Allowed, 'error');
                                return;
                            }

                            //Need to check Change controlled Object and restict Paste Evolution Effectivity operation.
                            if (change_response.length > 0) {
                                if (authHeaders.length == 0) {
                                    let errorTitle = EffectivityNLS.CC_AC_HDR_Error.replace('{1}', data.selectedNodes[0].alias);
                                    let errorSubtitle = EffectivityNLS.CC_AC_HDR_Error_subtitle.replace('{1}', data.selectedNodes[0].alias);
                                    CfgUtility.showNotifs('error', errorTitle, errorSubtitle);
                                    return;
                                }
                            }

                            //PADContext is not available in all scenario. Data is kept which can be set depending on each context
                            CfgData.SelectedDataForPasteOperation = data;
                            var isEvolutionEffectivityAvailable = CfgData.isEvolutionEffAvailable;

                            //Need to check Evolution criteria is enabled for attached context.
                            if (data.padNodes[0].options != undefined && data.padNodes[0].options.grid != undefined && data.padNodes[0].options.grid.EvolutionEffectivity != undefined) changeEnabledEffectivityColumn = 'false';

                            //[IR-636352 02-Jan-2020] Show spinner for Paste operation.
                            var nodeList = data.padNodes;
                            //Spinner is shown initially for Effectivity columns.
                            if (!that.options.context) {
                                for (var counter = 0; counter < nodeList.length; counter++) {
                                    that.resetSpinner({ counter: counter, showSpinner: true });
                                }
                            }

                            var i,
                                length = data.selectedNodes.length;
                            successfullList = [];
                            failedList = [];
                            warningList = [];
                            emptyEvolutionList = [];
                            configChageList = [];
                            availableEvolutionList = [];
                            availableVarAndEvolutionList = [];
                            frozenEvolutionList = [];

                            instanceList = [];
                            for (i = 0; i < length; i++) {
                                instanceList.push(data.selectedNodes[i].id);
                            }

                            //unset Effecticvity operation is performed.
                            if (isEvolutionEffectivityAvailable == 'NO') {
                                //instanceId List are passed in pidList for method getFrozenEffectivityDetails which gives frozen Evolution Effectivity details.
                                var effectivityOptions = {
                                    pidList: instanceList,
                                };
                                CfgUtility.getFrozenEffectivityDetails(effectivityOptions).then(
                                    function (iResponse) {
                                        //Fills different global Lists which are used to show Error/Successful/Information message
                                        that._getAvailableDomainDetails(iResponse);

                                        var unsetList = [];
                                        for (var counter = 0; counter < instanceList.length; counter++) {
                                            if (emptyEvolutionList.indexOf(instanceList[counter]) >= 0) {
                                                //Filled warning list which is shown in information type message.
                                                warningList.push(data.selectedNodes[counter].alias);
                                                if (!that.options.context) {
                                                    //For already started spinner, Original values should be assigned to Effectivity columns.
                                                    that.resetSpinner({ counter: counter, showSpinner: false });
                                                }
                                            } else if (frozenEvolutionList.indexOf(instanceList[counter]) >= 0) {
                                                if (!that.options.context) {
                                                    //For already started spinner, Original values should be assigned to Effectivity columns.
                                                    that.resetSpinner({ counter: counter, showSpinner: false });
                                                }
                                            } else if (configChageList.indexOf(instanceList[counter]) >= 0) {
                                                //Filled failed list which is shown in error type message.
                                                failedList.push(data.selectedNodes[counter].alias);
                                                if (!that.options.context) {
                                                    //For already started spinner, Original values should be assigned to Effectivity columns.
                                                    that.resetSpinner({ counter: counter, showSpinner: false });
                                                }
                                            } else {
                                                //only valid products are added in unsetList which is passed to web-service for clearing Evolution Efffectivity
                                                unsetList.push(instanceList[counter]);
                                            }
                                        }

                                        //Web-service for unset Evolution Effectivity is for Valid data only
                                        if (unsetList.length > 0) {
                                            //show frozen Evolution check Information message for clear Evolution Effectivity operation
                                            if (frozenEvolutionList.length > 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Clear_Evolution_Operation_Info, 'info');

                                            var inputJson = {
                                                unsetList: unsetList,
                                                wsOptions: authHeaders,
                                            };

                                            //Clears Evolution Effectivity.
                                            that._pasteUnsetEvolutionEffectivities(inputJson).then(
                                                function () {
                                                    //[IR-828131 29-Jan-2021] Added else case as successful message shown for paste operation depending on values present in successfullList
                                                    var nodeList = data.padNodes;
                                                    //Updated modified Effectivity columns after unset Evolution Effectivity operation.
                                                    for (var counter = 0; counter < nodeList.length; counter++) {
                                                        var instanceId = nodeList[counter].getRelationID();

                                                        if (emptyEvolutionList.indexOf(instanceId) >= 0 || configChageList.indexOf(instanceId) >= 0) {
                                                            continue;
                                                        }

                                                        //[IR-940008 27-Apr-2022] function check for getAttribute requires for Non-PADContext applications
                                                        let selectedTitle = (typeof nodeList[counter].getAttribute == 'function' && nodeList[counter].getAttribute('ds6w:label-Instance')) || nodeList[counter].getLabel();
                                                        successfullList.push(selectedTitle); //nodeList[counter].options.display changed to selectedTitle
                                                    }
                                                    that._showEmptyMessage();

                                                    //send clear Evolution Effectivity operation details for cloud probes tracking
                                                    let probesOptions = { selectedNodesLength: data.selectedNodes.length, contextLength: 0 };
                                                    that.sendPasteEvolutionTrackerEvent(probesOptions);
                                                    that.setMagicProbesDataForPasteEvolution('Clear_Evolution_Effectivity');
                                                },
                                                function (error) {
                                                    console.log(error);
                                                }
                                            );
                                        } else {
                                            //show frozen Evolution check error message for clear Evolution Effectivity operation
                                            if (frozenEvolutionList.length > 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Clear_Evolution_Operation_Error, 'error');

                                            that._showEmptyMessage();
                                        }
                                    },
                                    function (error) {
                                        console.log(error);
                                    }
                                );
                            } else {
                                var uniqueParentIDs = [];
                                for (i = 0; i < length; i++) {
                                    var parentId = data.selectedNodes[i].parentID;
                                    if (uniqueParentIDs.indexOf(parentId) == -1) uniqueParentIDs.push(parentId);
                                }

                                let GMCOI_Options = { referenceIds: uniqueParentIDs };

                                CfgUtility.getMultipleConfigurationContextInfo(GMCOI_Options).then(
                                    async function (resp) {
                                        let contextResponseModelType = true;
                                        if (resp.xRevisionContent && resp.xRevisionContent.length > 0) {
                                            contextResponseModelType = false;
                                        }

                                        //Checked Evolution criteria is selected for attached context.
                                        if (CfgData.copyEvolutionCriteria != undefined && CfgData.copyEvolutionCriteria.length > 0) {
                                            if (resp.referencesInfo != undefined) {
                                                for (let counter = 0; counter < resp.referencesInfo.length; counter++) {
                                                    if (resp.referencesInfo[counter] != undefined && resp.referencesInfo[counter].hasConfigContext == 'NO') {
                                                        pasteCriteriaValid = 'false';
                                                        break;
                                                    }
                                                }

                                                if (resp.enabledCriteria && resp.enabledCriteria.length > 0) {
                                                    for (let count = 0; count < CfgData.copyEvolutionCriteria.length; count++) {
                                                        let copyCriteriaKey = CfgData.copyEvolutionCriteria[count];
                                                        for (let counter = 0; counter < resp.enabledCriteria.length; counter++) {
                                                            if (
                                                                resp.enabledCriteria[counter].criteriaName != undefined &&
                                                                resp.enabledCriteria[counter].criteriaName == copyCriteriaKey &&
                                                                resp.enabledCriteria[counter].notActivatedFor != undefined &&
                                                                resp.enabledCriteria[counter].notActivatedFor.length > 0
                                                            ) {
                                                                pasteCriteriaValid = 'false';
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            pasteCriteriaValid = 'false';
                                        }

                                        if (contextResponseModelType) {
                                            if (pasteCriteriaValid == 'true') {
                                                //For probes tracking calculate attached context details
                                                let totalAttachedContext = 0;
                                                for (let iCounter = 0; iCounter < resp.contextInfo.length; iCounter++) {
                                                    let contentInfo = resp.contextInfo[iCounter];
                                                    if (contentInfo.content && contentInfo.content.results && contentInfo.content.results.length > 0) {
                                                        totalAttachedContext += contentInfo.content.results.length;
                                                    }
                                                }

                                                var attachedContextLength = Math.round(totalAttachedContext / resp.contextInfo.length);

                                                //instanceId List are passed in pidList for method getFrozenEffectivityDetails which gives frozen Evolution Effectivity details.
                                                var effectivityOptions = {
                                                    pidList: instanceList,
                                                };

                                                let iResponse = await CfgUtility.getFrozenEffectivityDetails(effectivityOptions);
                                                await that._getAvailableDomainDetails(iResponse);

                                                for (i = 0; i < length; i++) {
                                                    if (configChageList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                        //Filled warning list which is shown in information type message.
                                                        failedList.push(data.selectedNodes[i].alias);

                                                        //For already started spinner, Original values should be assigned to Effectivity columns.
                                                        if (!that.options.context) {
                                                            that.resetSpinner({ counter: i, showSpinner: false });
                                                        }
                                                    }

                                                    //frozen products are removed from valid Products list which is passed to Paste Evolution Effectivity operation. Original Evolution Effectivity should be shown.
                                                    if (frozenEvolutionList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                        //For already started spinner, Original values should be assigned to Effectivity columns.
                                                        if (!that.options.context) {
                                                            that.resetSpinner({ counter: i, showSpinner: false });
                                                        }
                                                    }
                                                }

                                                //Unsupported types or ConfigChange products are removed from valid Products list which is passed to Paste Evolution Effectivity operation.
                                                if (failedList.length > 0) {
                                                    //Removed Products which are not supported like Drawing.
                                                    for (i = 0; i < configChageList.length; i++) {
                                                        var instId = configChageList[i];
                                                        var index = instanceList.indexOf(instId);
                                                        if (index > -1) {
                                                            instanceList.splice(index, 1);
                                                        }
                                                    }
                                                }

                                                //frozen Evolution Products are removed from valid Products list which is passed to Paste Evolution Effectivity operation.
                                                if (frozenEvolutionList.length > 0) {
                                                    for (i = 0; i < frozenEvolutionList.length; i++) {
                                                        var instId = frozenEvolutionList[i];
                                                        var index = instanceList.indexOf(instId);
                                                        if (index > -1) {
                                                            instanceList.splice(index, 1);
                                                        }
                                                    }
                                                }
                                            } else {
                                                var errorOptions = {};
                                                errorOptions.data = data;
                                                that._showErrorMessage(errorOptions);
                                            }
                                        } else {
                                            //only getFrozenEffectivityDetails check done for xRevision Paste Evolution Effectivity operation.
                                            var effectivityOptions = {
                                                pidList: instanceList,
                                            };

                                            let iResponse = await CfgUtility.getFrozenEffectivityDetails(effectivityOptions);
                                            await that._getAvailableDomainDetails(iResponse);

                                            for (i = 0; i < length; i++) {
                                                if (configChageList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                    //Filled warning list which is shown in information type message.
                                                    failedList.push(data.selectedNodes[i].alias);

                                                    //For already started spinner, Original values should be assigned to Effectivity columns.
                                                    if (!that.options.context) {
                                                        that.resetSpinner({ counter: i, showSpinner: false });
                                                    }
                                                }

                                                //frozen products are removed from valid Products list which is passed to Paste Evolution Effectivity operation. Original Evolution Effectivity should be shown.
                                                if (frozenEvolutionList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                    //For already started spinner, Original values should be assigned to Effectivity columns.
                                                    if (!that.options.context) {
                                                        that.resetSpinner({ counter: i, showSpinner: false });
                                                    }
                                                }
                                            }

                                            //Unsupported types or ConfigChange products are removed from valid Products list which is passed to Paste Evolution Effectivity operation.
                                            if (failedList.length > 0) {
                                                //Removed Products which are not supported like Drawing.
                                                for (i = 0; i < configChageList.length; i++) {
                                                    var instId = configChageList[i];
                                                    var index = instanceList.indexOf(instId);
                                                    if (index > -1) {
                                                        instanceList.splice(index, 1);
                                                    }
                                                }
                                            }

                                            //frozen Evolution Products are removed from valid Products list which is passed to Paste Evolution Effectivity operation.
                                            if (frozenEvolutionList.length > 0) {
                                                for (i = 0; i < frozenEvolutionList.length; i++) {
                                                    var instId = frozenEvolutionList[i];
                                                    var index = instanceList.indexOf(instId);
                                                    if (index > -1) {
                                                        instanceList.splice(index, 1);
                                                    }
                                                }
                                            }
                                        }

                                        if (instanceList.length > 0) {
                                            //show frozen Evolution check Information message for Paste Evolution Effectivity operation
                                            if (frozenEvolutionList.length > 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Paste_Evolution_Operation_Info, 'info');

                                            //only valid products are passed to web-service for setting Evolution Effectivity.
                                            var evolutionEffxml = CfgData.EvolutionEffectivity;
                                            if (evolutionEffxml != undefined && evolutionEffxml != null) {
                                                var expressionList = [];
                                                for (var counter = 0; counter < instanceList.length; counter++) {
                                                    var expression = {
                                                        pid: instanceList[counter],
                                                        EvolutionContent: evolutionEffxml,
                                                    };
                                                    expressionList.push(expression);
                                                }

                                                //[FUN126066 Enhance error messages for set effectivity web services] changed version to 1.1
                                                var inputJson = {
                                                    version: '1.1',
                                                    domain: 'Evolution',
                                                    view: 'All',
                                                    expressionList: expressionList,
                                                    wsOptions: authHeaders,
                                                };

                                                if (contextResponseModelType == false) {
                                                    inputJson.version = '2.0';
                                                }

                                                that._pasteEvolutionEffectivities(inputJson).then(
                                                    function (response) {
                                                        //[IR-940450 05-May-2022] Added GlobalStatus status SUCCESS for successful otherwise error message.
                                                        if (response.GlobalStatus == 'SUCCESS') {
                                                            //[IR-828131 29-Jan-2021] Added else case as successful message shown for paste operation depending on values present in successfullList
                                                            var nodeList = data.padNodes;
                                                            for (var counter = 0; counter < nodeList.length; counter++) {
                                                                var instanceId = nodeList[counter].getRelationID();
                                                                if (configChageList.indexOf(instanceId) >= 0) {
                                                                    continue;
                                                                }

                                                                //[IR-940008 27-Apr-2022] function check for getAttribute requires for Non-PADContext applications
                                                                let selectedTitle = (typeof nodeList[counter].getAttribute == 'function' && nodeList[counter].getAttribute('ds6w:label-Instance')) || nodeList[counter].getLabel();
                                                                successfullList.push(selectedTitle); //nodeList[counter].options.display changed to selectedTitle
                                                            }
                                                            that._showMessage();
                                                        } else {
                                                            //[IR-1230454 02-Feb-2024] need to reset spinner
                                                            for (let counter = 0; counter < length; counter++) {
                                                                if (!that.options.context) {
                                                                    that.resetSpinner({ counter: counter, showSpinner: false });
                                                                }
                                                            }
                                                            //[FUN126066 Enhance error messages for set effectivity web services]  Read error message from web-service
                                                            if (response.results != undefined && response.results[0] != undefined) {
                                                                if (response.results[0].errorCode == 123) {
                                                                    //errorMessageValue = EffectivityNLS.CFG_Paste_Evolution_Effectivity_Failed_Different_Context + '<b>' + CfgBaseUXNLS.CfgHeaderEditConfigurationContext + '</b>';
                                                                    let editEvolutionMessage = EffectivityNLS.CFG_Error_Paste_Evolution_Message.replace('{1}', '<b>' + CfgBaseUXNLS.CfgHeaderEditConfigurationContext + '</b>');
                                                                    CfgUtility.showNotifs('error', EffectivityNLS.CFG_Error_Paste_Evolution_Title, EffectivityNLS.CFG_Error_Paste_Evolution_SubTitle, editEvolutionMessage);
                                                                    return;
                                                                } else errorMessageValue = response.results[0].message;
                                                                console.log('Paste Evolution Effectivity operation error = ' + response.results[0].errorDetails);
                                                            }

                                                            let errorOptions = {};
                                                            errorOptions.data = data;
                                                            that._showErrorMessage(errorOptions);
                                                        }

                                                        //send Paste Evolution Effectivity operation details for cloud probes tracking
                                                        if (contextResponseModelType) {
                                                            let probesOptions = { selectedNodesLength: data.selectedNodes.length, contextLength: attachedContextLength };
                                                            that.sendPasteEvolutionTrackerEvent(probesOptions);
                                                            that.setMagicProbesDataForPasteEvolution('Paste_Evolution_Effectivity');
                                                        }
                                                    },
                                                    function (error) {
                                                        //Error scenario when Paste Evolution Effectivity operaion attached context is different from Copy Evolution Effectivity operaion attached context
                                                        console.log(error);
                                                        var errorOptions = {};
                                                        errorOptions.data = data;
                                                        that._showErrorMessage(errorOptions);
                                                    }
                                                );
                                            }
                                        } else {
                                            //show frozen Evolution check error message for Paste Evolution Effectivity operation
                                            if (frozenEvolutionList.length > 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Paste_Evolution_Operation_Error, 'error');

                                            that._showMessage();
                                        }
                                    },
                                    function (error) {
                                        //[IR-1011266 04-May-2023] For Error scenario hide spinner by updating application with original value.
                                        failedList.push(data.selectedNodes[0].alias);
                                        if (instanceList.length > 1) failedList.push(data.selectedNodes[0].alias);

                                        for (i = 0; i < length; i++) {
                                            that.resetSpinner({ counter: i, showSpinner: false });
                                        }
                                        that._showMessage();

                                        console.log(error);
                                    }
                                );
                            }
                        },
                        function () {
                            that.enable();
                            CfgUtility.showwarning(EffectivityNLS.CFG_Service_Fail, 'error');
                        }
                    );
                }
            }
        },
    });
    return CfgPasteEvolutionEffectivityCmd;
});
