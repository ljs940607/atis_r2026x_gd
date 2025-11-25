/**
 * @quickreview KR5     25:06:09 IR-1395679 used getChangeControlledList to get Change Controlled Objects.
 * @quickreview H37     25:05:23 FUN159054
 * @quickreview KR5     25:02:03 TSK11976182 : CPQ getMultipleConfigurationContextInfo unwanted parameter removal
 * @quickreview KR5     25:01:15 TSK11976181 : CPQ getMultipleConfigurationContextInfo version 1.2
 * @quickreview KR5     24:07:11 added only Frozen Check for xRevision Paste Variant Effectivity operation
 */
define('DS/CfgEffectivityCommands/commands/CfgPasteEffectivityCmd', [
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
    var emptyVariantList = [];
    var configChageList = [];
    var frozenEvolutionList = [];
    var availableVariantList = [];
    var availableVarAndEvolutionList = [];
    var featureNotEnabled = 'true';
    let errorMessageValue = '';

    var CfgPasteEffectivityCmd = CfgEffCmd.extend({
        /**
         * Override base class CfgEffCmd function for selectedNodes.length >= 1 because Paste Variant Effectivity functionality is supported for multuiple products
         */
        _checkSelection: function () {
            //-- Init the selection
            var instanceLength;
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

        /**
         * Set Variant Effectivity for selected multiple products using webservice pasteVariantEffectivities
         */
        _setVariantEffectivity: function (instanceList, productName, variantXML, authHeaders, selectdData) {
            var that = this;
            var wsOptions = null;
            if (authHeaders.length > 0) {
                wsOptions = {
                    operationheader: {
                        key: authHeaders[0].key,
                        value: authHeaders[0].value,
                    },
                };
            }
            var exppressionList = [
                {
                    domain: 'Variant',
                    content: variantXML,
                },
            ];

            //[FUN126066 Enhance error messages for set effectivity web services] changed version to 1.1
            var options = {
                version: '1.1',
                domain: 'Variant',
                view: 'Current',
                targetFormat: 'TXT',
                withDescription: 'YES',
                expressionList: exppressionList,
                instanceIdList: instanceList,
                wsOptions: wsOptions,
            };

            that._processSetEffectivities(options, selectdData, that);
        },

        /**
         * For PCS improvement, CfgUtility.refreshEffectvity which calls getMultipleFilterableObjectInfo is avoided for Set Variant Effectivity operation.
         */
        _refreshGridForSetEffectivity: function (response) {
            //PADContext is not available in all scenario. Data is retrieved which was set depending on each context
            var data = CfgData.SelectedDataForPasteOperation;
            var nodeList = data.padNodes;

            for (var counter = 0; counter < nodeList.length; counter++) {
                var instanceId = nodeList[counter].getRelationID();
                if (configChageList.indexOf(instanceId) >= 0) continue;
                var hasEff = EffectivityNLS.CFG_EFFECTIVITY_YES;
                var varEff = ' ';
                if (response.results[0].existing != undefined && response.results[0].existing.content != undefined && response.results[0].existing.content.Variant != undefined) {
                    varEff = response.results[0].existing.content.Variant;
                }
                varEff = varEff == null || '' ? ' ' : varEff.replace(/[\r\n]+/g, ' ');
                nodeList[counter].updateOptions({
                    grid: { Effectivity: hasEff, VariantEffectivity: varEff },
                });
            }
        },

        /**
         * For PCS improvement, CfgUtility.refreshEffectvity which calls getMultipleFilterableObjectInfo is avoided for unset Variant Effectivity operation.
         */
        _refreshGridForUnsetEffectivity: function () {
            //PADContext is not available in all scenario. Data is retrieved which was set depending on each context
            var data = CfgData.SelectedDataForPasteOperation;
            var nodeList = data.padNodes;
            for (var counter = 0; counter < nodeList.length; counter++) {
                var hasEff = ' ';
                var instanceId = nodeList[counter].getRelationID();
                if (availableVariantList.indexOf(instanceId) >= 0) hasEff = EffectivityNLS.CFG_EFFECTIVITY_NO;
                else if (availableVarAndEvolutionList.indexOf(instanceId) >= 0) hasEff = EffectivityNLS.CFG_EFFECTIVITY_YES;

                nodeList[counter].updateOptions({
                    grid: { Effectivity: hasEff, VariantEffectivity: ' ' },
                });
            }
        },

        /**
         * Used to get Domain details before Paste Variant Effectivity operation. Forbidden types like 3DSpahe object is added to failedList and shown in error message.
         */
        //getFrozenEffectivityDetails response will give Available Domain Details
        _getAvailableDomainDetails: function (iResponse) {
            if (iResponse.length > 0) {
                //Remove frozen instances from selected instances to avoid unwanted variant Effectivity modification.
                for (var count = 0; count < iResponse.length; count++) {
                    var instanceId = iResponse[count].instanceId;
                    if (iResponse[count].AvailableDomainDetails != undefined) {
                        var domainVaue = iResponse[count].AvailableDomainDetails;
                        if (domainVaue == 'NoEff' || domainVaue == 'Evolution') emptyVariantList.push(instanceId);
                        if (domainVaue == 'ConfigChange' || domainVaue == 'UnsupportedType') configChageList.push(instanceId);
                        if (domainVaue == 'NoEff' || domainVaue == 'Variant') availableVariantList.push(instanceId);
                        if (domainVaue == 'ALL' || domainVaue == 'Evolution') availableVarAndEvolutionList.push(instanceId);

                        if (iResponse[count].isFrozen == true) {
                            frozenEvolutionList.push(instanceId);
                        }
                    }
                }
            }
        },

        /**
         * Function used to clear Variant Effectivity for selected products using single web-service call unsetVariantEffectivities.
         */
        _unsetVariantEffectivities: function (selectdData, authHeaders, instanceList) {
            var that = this;
            var wsOptions = null;
            if (authHeaders.length > 0) {
                wsOptions = {
                    operationheader: {
                        key: authHeaders[0].key,
                        value: authHeaders[0].value,
                    },
                };
            }

            var options = {
                version: '2.0',
                unsetList: instanceList,
                wsOptions: wsOptions,
            };

            var counter,
                selLength = selectdData.selectedNodes.length;
            var selectedItems = [];
            for (counter = 0; counter < selLength; counter++) {
                selectedItems.push({
                    prodId: selectdData.selectedNodes[counter].id,
                    productName: selectdData.selectedNodes[counter].alias,
                });
            }

            CfgUtility.unsetVariantEffectivities(options).then(
                function (response) {
                    var instanceNewIdList = [];
                    var modifiedNodeList = [];
                    if (response.GlobalStatus != undefined && response.GlobalStatus == 'SUCCESS') {
                        for (var i = 0; i < response.results.length; i++) {
                            var result = response.results[i];
                            var newDetails = result['new'];
                            var existingDetails = result.existing;

                            for (var count = 0; count < selectdData.selectedNodes.length; count++) {
                                var relationId = selectdData.selectedNodes[count].id;
                                if (existingDetails != undefined && existingDetails.pid != undefined) {
                                    if (relationId == existingDetails.pid) {
                                        modifiedNodeList.push(selectdData.selectedNodes[count]);
                                        continue;
                                    }
                                }
                            }

                            if (newDetails != undefined && newDetails.pid != undefined) {
                                //instanceNewIdList.push(newDetails.pid);   //Splited Id with new instances are not used.
                                if (existingDetails != undefined && existingDetails.pid != undefined) {
                                    instanceNewIdList.push(existingDetails.pid);

                                    var selectedItem = selectedItems.filter(function (item) {
                                        return item.prodId == existingDetails.pid;
                                    })[0];
                                    if (selectedItem != undefined) {
                                        if (result.status == 'SUCCESS') {
                                            successfullList.push(selectedItem.productName);
                                        } else {
                                            failedList.push(selectedItem.productName);
                                        }
                                    }
                                }
                            } else {
                                var childStatus = result.status;
                                var childProductId = result.existing.pid;
                                var productName = '';
                                var selectedItem = selectedItems.filter(function (item) {
                                    return item.prodId == childProductId;
                                })[0];
                                if (selectedItem != undefined) {
                                    productName = selectedItem.productName;
                                    if (childStatus == 'SUCCESS' && emptyVariantList.indexOf(childProductId) == -1 && configChageList.indexOf(childProductId) == -1) {
                                        successfullList.push(productName);
                                    } else if (emptyVariantList.indexOf(childProductId) >= 0) {
                                        warningList.push(productName);
                                    } else {
                                        failedList.push(productName);
                                    }
                                }
                            }
                        }

                        response.instanceNewIdList = instanceNewIdList;

                        //Publish Effectivity modification event for updating Effectivity details
                        var refreshEventMessage = {
                            commandName: 'cfgPasteVariant',
                            widgetId: widget.id,
                            response: response,
                            data: {},
                        };

                        CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);

                        if (!that.options.context) {
                            //[IR-833916 12-Jul-2021] show changed variant split info message.
                            if (response.instanceNewIdList.length > 0) {
                                CfgUtility.showwarning(EffectivityNLS.CFG_Application_Refresh_For_Instance_Evolved, 'info');
                            }
                            that._showEmptyMessage();
                        } else {
                            //[IR-780872 10-Jul-2020] Instance Evolved message should be shown for all applications after Variant split operation.
                            if (response.instanceNewIdList.length > 0) {
                                CfgUtility.showwarning(EffectivityNLS.CFG_Application_Refresh_For_Instance_Evolved, 'info');
                            }
                            that.options.context.withTransactionUpdate(function () {
                                that._refreshGridForUnsetEffectivity();
                                that._showEmptyMessage();
                            });
                        }
                        that.setMagicProbesDataForPasteVariant('Clear_Variant_Effectivity');
                    } else if (response.GlobalStatus != undefined && response.GlobalStatus == 'ERROR') {
                        for (var i = 0; i < selectdData.selectedNodes.length; i++) {
                            failedList.push(selectdData.selectedNodes[i].alias);
                        }
                        that._showEmptyMessage();
                        that.setMagicProbesDataForPasteVariant('Clear_Variant_Effectivity_Error');
                    }
                },
                function (response) {
                    for (var i = 0; i < selectdData.selectedNodes.length; i++) {
                        failedList.push(selectdData.selectedNodes[i].alias);
                    }
                    that._showEmptyMessage();
                }
            );
        },

        /**
         * Function used show UA reviewed error messages after Paste Variant Effectivity operation.
         */
        _showUAMessage: function () {
            if (errorMessageValue != undefined && errorMessageValue.indexOf('</b>') >= 0) {
                let errorMessages = errorMessageValue.split('TitleSubTitleSeperator');
                let errorTitle = errorMessages[0];
                let subTitleMessages = errorMessages[1].split('SubTitleMessageSeperator');
                let errorSubtitle = subTitleMessages[0];
                let errorMessage = subTitleMessages[1];
                CfgUtility.showNotifs('error', errorTitle, errorSubtitle, errorMessage);
            } else {
                CfgUtility.showwarning(errorMessageValue, 'error');
            }
            errorMessageValue = '';
        },

        /**
         * Function used show error / successful messages after Paste Variant Effectivity operation.
         */
        _showMessage: function () {
            //[FUN126066 Enhance error messages for set effectivity web services] show error message from wb-service.
            //if (errorMessageValue != '') {
            //    CfgUtility.showwarning(errorMessageValue, 'error');
            //    errorMessageValue = '';
            //    return;
            //}

            //[IR-1091197 IR-1091199 14-Jun-2023] changed error messages according to UA suggetions.
            let pasteVariantErrorMessage = ' ';
            if (failedList.length > 0) {
                pasteVariantErrorMessage = EffectivityNLS.CFG_Paste_Effectivity_Failed.replace('{1}', failedList.toString());
            }

            if (successfullList.length == 1 && failedList.length == 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
                CfgUtility.showNotifs('error', pasteVariantErrorMessage);
            } else if (successfullList.length == 0 && failedList.length == 1) {
                CfgUtility.showNotifs('error', pasteVariantErrorMessage); //[IR-1010934 04-May-2023] Made original failedList.toString() from EffectivityNLS.Product
            } else if (successfullList.length > 1 && failedList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_AllSuccessful, 'success');
            } else if (successfullList.length > 1 && failedList.length == 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_PartialSuccessful, 'success');
                CfgUtility.showNotifs('error', pasteVariantErrorMessage);
            } else if (successfullList.length > 1 && failedList.length > 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_PartialSuccessful, 'success');
                CfgUtility.showNotifs('error', pasteVariantErrorMessage);
            } else if (successfullList.length == 1 && failedList.length > 1) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
                CfgUtility.showNotifs('error', pasteVariantErrorMessage);
            } else if (successfullList.length == 1 && failedList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
            } else if (successfullList.length == 0 && failedList.length > 1) {
                CfgUtility.showNotifs('error', EffectivityNLS.CFG_Paste_Effectivity_AllFailed);
            }
        },

        /**
         * Function used show error / successful messages if Variant Effectivity for source product is Empty during Copy Variant Effectivity operation.
         */
        _showEmptyMessage: function () {
            if (successfullList.length > 1 && failedList.length == 0 && warningList.length == 0) {
                CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Effectivity_AllSuccessful, 'success');
                return;
            } else if (failedList.length > 1 && successfullList.length == 0 && warningList.length == 0) {
                CfgUtility.showNotifs('error', EffectivityNLS.CFG_Empty_Effectivity_AllFailed);
                return;
            }

            if (failedList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Effectivity_Failed.replace('{1}', failedList.toString()), 'error');
            if (successfullList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Effectivity_Successful + ' ' + successfullList.toString(), 'success');
            if (warningList.length != 0) CfgUtility.showwarning(EffectivityNLS.CFG_Empty_Effectivity_Warning + ' ' + warningList.toString(), 'info');
        },

        //[Magic cloud probes]
        setMagicProbesDataForPasteVariant: function (iOperation) {
            let magicAppId = 'defaultAppID';
            let magicAppName = 'ODT Environment';
            if (widget && widget.data && widget.data.appId) {
                magicAppId = widget.data.appId;
            }
            if (widget && widget.options && widget.options.title) {
                magicAppName = widget.options.title;
            }

            let probesOptions = { AppId: magicAppId, AppName: magicAppName, CommandName: CfgTracker.Labels['COPY_PASTE_VARIANT_EFFECTIVITY'], CommandOperation: iOperation, ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'], ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'] };
            CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(probesOptions);
        },

        /**
         * Function used to perform Paste Variant Effectivity operation.
         */
        _processSetEffectivities: function (options, selectdData, that) {
            CfgUtility.pasteVariantEffectivities(options).then(
                function (response) {
                    var i,
                        selLength = selectdData.selectedNodes.length;
                    for (i = 0; i < selLength; i++) {
                        var prodId = selectdData.selectedNodes[i].id;
                        if (configChageList.indexOf(prodId) == -1) {
                            if (response.GlobalStatus != undefined && response.GlobalStatus == 'SUCCESS') {
                                successfullList.push(selectdData.selectedNodes[i].alias);
                            } else if (response.GlobalStatus != undefined && response.GlobalStatus == 'ERROR') {
                                failedList.push(selectdData.selectedNodes[i].alias);

                                //[FUN126066 Enhance error messages for set effectivity web services] Read error message from web-service
                                if (response.results != undefined && response.results[0] != undefined) {
                                    let errorCodeValue = response.results[0].errorCode;
                                    switch (errorCodeValue) {
                                        case 123:
                                            errorMessageValue =
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Title +
                                                'TitleSubTitleSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Different_Context_Subtitle +
                                                'SubTitleMessageSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Context_Message +
                                                '<b>' +
                                                CfgBaseUXNLS.CfgHeaderEditConfigurationContext +
                                                '</b>';
                                            break;
                                        case 126:
                                            errorMessageValue =
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Title +
                                                'TitleSubTitleSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_WorkUnder_Different_Criteria_Subtitle +
                                                'SubTitleMessageSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Criteria_Message +
                                                '<b>' +
                                                CfgBaseUXNLS.CfgHeaderEditConfigurationContext +
                                                '</b>';
                                            break;
                                        case 134:
                                            errorMessageValue =
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Title +
                                                'TitleSubTitleSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_WorkUnder_Different_Context_Subtitle +
                                                'SubTitleMessageSeperator' +
                                                EffectivityNLS.CFG_Paste_Effectivity_Failed_Context_Message +
                                                '<b>' +
                                                CfgBaseUXNLS.CfgHeaderEditConfigurationContext +
                                                '</b>';
                                            break;
                                        default:
                                            errorMessageValue = response.results[0].message;
                                            break;
                                    }

                                    console.log('Paste Variant Effectivity operation error = ' + response.results[0].errorDetails);
                                }
                            }
                        }
                    }

                    var instanceNewIdList = [];
                    if (response.GlobalStatus != undefined && response.GlobalStatus == 'SUCCESS') {
                        for (var counter = 0; counter < response.results.length; counter++) {
                            var result = response.results[counter];
                            var existingDetails = result.existing;
                            var newDetails = result['new'];
                            if (newDetails != undefined && newDetails.pid != undefined) {
                                //instanceNewIdList.push(newDetails.pid);   //Splited Id with new instances are not used.
                                if (existingDetails != undefined && existingDetails.pid != undefined) {
                                    instanceNewIdList.push(existingDetails.pid);
                                }
                            }
                        }
                    }
                    response.instanceNewIdList = instanceNewIdList;

                    //Publish Effectivity modification event for updating Effectivity details
                    var refreshEventMessage = {
                        commandName: 'cfgPasteVariant',
                        widgetId: widget.id,
                        response: response,
                        data: {},
                    };

                    CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);

                    //[FUN126066 Enhance error messages for set effectivity web services] Assign original value for Effectivity and Variant Effectivity column
                    if (errorMessageValue != '') {
                        that.updateSpinner({ showSpinner: false, pushToFailedList: false, contextCheck: false, that: that });
                    }

                    //PADContext is not available in all scenario. If other context is null then use PADContext.
                    if (!that.options.context) {
                        //[IR-833916 12-Jul-2021] show changed variant split info message.
                        if (response.instanceNewIdList.length > 0) {
                            CfgUtility.showwarning(EffectivityNLS.CFG_Application_Refresh_For_Instance_Evolved, 'info');
                        }
                        if (errorMessageValue != '') {
                            that._showUAMessage();
                        } else {
                            that._showMessage();
                        }
                    } else {
                        //[IR-780872 10-Jul-2020] Instance Evolved message should be shown for all applications after Variant split operation.
                        if (response.instanceNewIdList.length > 0) {
                            CfgUtility.showwarning(EffectivityNLS.CFG_Application_Refresh_For_Instance_Evolved, 'info');
                        }
                        //[19-Jan-2024 TSK10812826] added withTransactionUpdate for DELMIA Allication
                        if (that.options.context.withTransactionUpdate) {
                            that.options.context.withTransactionUpdate(function () {
                                that._refreshGridForSetEffectivity(response);
                                if (errorMessageValue != '') {
                                    that._showUAMessage();
                                } else {
                                    that._showMessage();
                                }
                            });
                        } else {
                            if (errorMessageValue != '') {
                                that._showUAMessage();
                            } else {
                                that._showMessage();
                            }
                        }
                    }
                    that.setMagicProbesDataForPasteVariant('Paste_Variant_Effectivity');
                },
                function (response) {
                    //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                    //[IR-940450 05-May-2022] commented below check to show error for Non-PADContext applications.
                    //if (!that.options.context) {
                    that.updateSpinner({ showSpinner: false, pushToFailedList: true, contextCheck: false, that: that });

                    that._showMessage();
                    //}
                }
            );
        },

        /**
         * Function used to send infromation to Tracker for Paste Variant Effectivity operation.
         */
        sendPasteVariantTrackerEvent: function (options) {
            try {
                //Read Authoring context details for cloud probes.
                let authoringMode = 'Empty';
                let cfg = CfgAuthoringContext.get();
                if (cfg && cfg.AuthoringContextHeader) {
                    for (let key in cfg.AuthoringContextHeader) {
                        if (key === 'DS-Change-Authoring-Context') authoringMode = 'Change';
                        else if (key === 'DS-Configuration-Authoring-Context') authoringMode = 'Evolution';
                    }
                }

                let selectState = {
                    nbVariablity: 0,
                    nbVariablityValue: 0,
                    complex: 0,
                };

                if (CfgData.probesValuesForPasteVariantOpertaion != undefined)
                    selectState = { nbVariablity: CfgData.probesValuesForPasteVariantOpertaion.nbVariablity, nbVariablityValue: CfgData.probesValuesForPasteVariantOpertaion.nbVariablityValue, complex: CfgData.probesValuesForPasteVariantOpertaion.complex };

                CfgTracker.createEventBuilder({
                    category: CfgTracker.Category['USAGE'],
                    action: CfgTracker.Events['CLICK'],
                    tenant: widget.getValue('x3dPlatformId'),
                })
                    .setLabel(CfgTracker.Labels['COPY_PASTE_VARIANT_EFFECTIVITY'])
                    .setAppId(widget.data.appId || 'NO_APP_ID')
                    .addDimension(CfgDimension.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_EFFECTIVITY_WIDGET, widget.data.title || widget.options.title || 'ODT Environment')
                    .addDimension(CfgDimension.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_EFFECTIVITY_MODE, 'Paste')
                    .addDimension(CfgDimension.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_EFFECTIVITY_WORK_UNDER, authoringMode)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_MODEL, options.contextLength)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_OBJECT, options.selectedNodesLength)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_VARIANT, selectState.nbVariablity)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_VARIANT_VALUES, selectState.nbVariablityValue)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_OPTION_GROUP, -1)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_NO_OF_OPTION_GROUP_VALUES, -1)
                    .addPersonalValue(CfgValue.COPY_PASTE_VARIANT_EFFECTIVITY.COPY_PASTE_VARIANT_COMPLEXITY, selectState.complex)
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
            data.padNodes[iOptions.counter].updateOptions({
                grid: {
                    Effectivity: data.selectedNodes[iOptions.counter].effectivity,
                    VariantEffectivity: data.selectedNodes[iOptions.counter].variantEffectivity,
                },
            });
        },

        /**
         * Function used to start and stop spinner with original values during error scenario.
         */
        updateSpinner: function (iOptions) {
            let that = iOptions.that;
            let data = CfgData.SelectedDataForPasteOperation;
            let nodeList = data.padNodes;
            if (iOptions.showSpinner == true) {
                if (!that.options.context) {
                    let hasEff, varEff;
                    for (var counter = 0; counter < nodeList.length; counter++) {
                        nodeList[counter].updateOptions({
                            grid: {
                                Effectivity: hasEff,
                                VariantEffectivity: varEff,
                            },
                        });
                    }
                }
            } else {
                if (iOptions.contextCheck == false) {
                    for (let i = 0; i < data.selectedNodes.length; i++) {
                        data.padNodes[i].updateOptions({
                            grid: {
                                Effectivity: data.selectedNodes[i].effectivity,
                                VariantEffectivity: data.selectedNodes[i].variantEffectivity,
                            },
                        });
                        if (iOptions.pushToFailedList == true) failedList.push(data.selectedNodes[i].alias);
                    }
                } else {
                    if (!that.options.context) {
                        let length = data.selectedNodes.length;
                        for (let i = 0; i < length; i++) {
                            nodeList[i].updateOptions({
                                grid: {
                                    Effectivity: data.selectedNodes[i].effectivity,
                                    VariantEffectivity: data.selectedNodes[i].variantEffectivity,
                                },
                            });
                        }
                        if (iOptions.pushToFailedList == true) failedList.push(data.selectedNodes[i].alias);
                    }
                }
            }
        },

        /**
         * When user clicks on Action bar Paste Variant Effectivity command as well as Paste Variant Effectivity contextual menu then execute is called.
         * Updated value for allowedLimitNo = 50 for 2018x FD08 function FUN085315.
         */
        execute: async function () {
            if (!this.isConfigAuthorized()) return; //FUN159054
            //IR-1051749 - For SAXR on edit variant call is directly coming to CfgPasteEffectivityCmd, so isEditVariantEnabled is undefined so adding service to get info.
            if (CfgData && CfgData.isEditVariantEnabled === undefined) {
                await CfgUtility.getDisabledEditVariantStatus();
            }
            //IR-950795
            if (CfgData && CfgData.isEditVariantEnabled === false) {
                CfgUtility.showwarning(CfgBaseUXNLS.PasteVariantDisabled, 'error');
                return;
            }

            //display warning message as Effectivity is not copied
            if (CfgData && CfgData.isVariantEffAvailable == ' ') {
                CfgUtility.showwarning(EffectivityNLS.CFG_Paste_Variant_Info, 'info');
                return;
            }

            featureNotEnabled = 'true';
            var that = this;
            that.disable();
            var data = that.getData();
            //[IR-983903 12-Sep-2022] Increased Paste Variant Effectivity operation limit
            var allowedLimitNo = 500;
            console.log(data);
            if (data.selectedNodes && data.selectedNodes.length > 0) {
                if (data.selectedNodes.length > allowedLimitNo) {
                    var numberoflimitMessage = EffectivityNLS.CFG_LimitNo_Paste_Effectivity.split('5').join(allowedLimitNo);
                    CfgUtility.showwarning(numberoflimitMessage, 'error');
                } else {
                    //check whether change controlled
                    var isChangePromise = CfgUtility.getChangeControlledList([{ id: data.selectedNodes[0].parentID }]);
                    isChangePromise.then(
                        //change_response contains change controlled ids array. For non-change controlled data.selectedNodes[0].parentID, empty array [] returned.
                        function (change_response) {
                            if (change_response.length > 0) {
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
                                if (authHeaders.length == 0) {
                                    let errorTitle = EffectivityNLS.CC_AC_HDR_Error.replace('{1}', data.selectedNodes[0].alias);
                                    let errorSubtitle = EffectivityNLS.CC_AC_HDR_Error_subtitle.replace('{1}', data.selectedNodes[0].alias);
                                    CfgUtility.showNotifs('error', errorTitle, errorSubtitle);
                                    return;
                                }
                            }

                            //PADContext is not available in all scenario. Data is kept which can be set depending on each context
                            CfgData.SelectedDataForPasteOperation = data;
                            var isVariantEffectivityAvailable = CfgData.isVariantEffAvailable;

                            //[IR-636352 02-Jan-2020] Show spinner for Paste operation.
                            that.updateSpinner({ showSpinner: true, that: that });

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
                            var allPromises = [];
                            var i,
                                length = data.selectedNodes.length;
                            successfullList = [];
                            failedList = [];
                            warningList = [];
                            emptyVariantList = [];
                            configChageList = [];
                            availableVariantList = [];
                            availableVarAndEvolutionList = [];
                            frozenEvolutionList = [];

                            instanceList = [];
                            for (i = 0; i < length; i++) {
                                instanceList.push(data.selectedNodes[i].id);
                            }

                            if (isVariantEffectivityAvailable == 'NO') {
                                //instanceId List are passed in pidList for method getFrozenEffectivityDetails which gives frozen Evolution Effectivity details.
                                var effectivityOptions = {
                                    pidList: instanceList,
                                };
                                CfgUtility.getFrozenEffectivityDetails(effectivityOptions).then(
                                    function (iResponse) {
                                        //Fills different global Lists which are used to show Error/Successful/Information message
                                        that._getAvailableDomainDetails(iResponse);

                                        var validData = {
                                            selectedNodes: [],
                                            padNodes: [],
                                        };
                                        for (var i = 0; i < data.selectedNodes.length; i++) {
                                            var instId = data.selectedNodes[i].id;
                                            if (emptyVariantList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                warningList.push(data.selectedNodes[i].alias);
                                                var index = instanceList.indexOf(instId);
                                                if (index > -1) {
                                                    instanceList.splice(index, 1);
                                                }

                                                //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                if (!that.options.context) {
                                                    that.resetSpinner({ counter: i });
                                                }
                                            }
                                            //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0.
                                            //For Active Work under Authoring context, Frozen Evolution Check on reference Evolution Effectivity should be avoided
                                            //and passed as Valid reference for Clear Variant Effectivity operation
                                            else if (frozenEvolutionList.indexOf(data.selectedNodes[i].id) >= 0 && authHeaders.length == 0) {
                                                var index = instanceList.indexOf(instId);
                                                if (index > -1) {
                                                    instanceList.splice(index, 1);
                                                }

                                                //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                if (!that.options.context) {
                                                    that.resetSpinner({ counter: i });
                                                }
                                            } else if (configChageList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                failedList.push(data.selectedNodes[i].alias);
                                                var index = instanceList.indexOf(instId);
                                                if (index > -1) {
                                                    instanceList.splice(index, 1);
                                                }

                                                //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                if (!that.options.context) {
                                                    that.resetSpinner({ counter: i });
                                                }
                                            } else {
                                                validData.selectedNodes.push(data.selectedNodes[i]);
                                                validData.padNodes.push(data.padNodes[i]);
                                            }
                                        }

                                        //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0 for Frozen Evolution Clear message.
                                        if (instanceList.length > 0) {
                                            //show frozen Evolution check Information message for clear Variant Effectivity operation
                                            if (frozenEvolutionList.length > 0 && authHeaders.length == 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Clear_Variant_Operation_Info, 'info');

                                            that._unsetVariantEffectivities(validData, authHeaders, instanceList);
                                        } else {
                                            //show frozen Evolution check error message for clear Variant Effectivity operation
                                            if (frozenEvolutionList.length > 0 && authHeaders.length == 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Clear_Variant_Operation_Error, 'error');

                                            that._showEmptyMessage();
                                        }

                                        //send clear Variant Effectivity operation details for cloud probes tracking
                                        let probesOptions = { selectedNodesLength: data.selectedNodes.length, contextLength: 0 };
                                        that.sendPasteVariantTrackerEvent(probesOptions);
                                    },
                                    function (error) {
                                        //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                        //[IR-940450 05-May-2022] commented below check to show error for Non-PADContext applications.
                                        //if (!that.options.context) {
                                        that.updateSpinner({ showSpinner: false, pushToFailedList: true, contextCheck: false, that: that });

                                        that._showEmptyMessage();
                                        //}
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

                                        if (resp.referencesInfo != undefined) {
                                            for (let counter = 0; counter < resp.referencesInfo.length; counter++) {
                                                if (resp.referencesInfo[counter] != undefined && resp.referencesInfo[counter].hasConfigContext == 'NO') {
                                                    featureNotEnabled = 'false';
                                                    break;
                                                }
                                            }

                                            if (resp.enabledCriteria && resp.enabledCriteria.length > 0) {
                                                for (let counter = 0; counter < resp.enabledCriteria.length; counter++) {
                                                    if (resp.enabledCriteria[counter].criteriaName != undefined && resp.enabledCriteria[counter].criteriaName == 'feature' && resp.enabledCriteria[counter].notActivatedFor != undefined && resp.enabledCriteria[counter].notActivatedFor.length > 0) {
                                                        featureNotEnabled = 'false';
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (contextResponseModelType) {
                                            if (featureNotEnabled == 'true') {
                                                //For probes tracking calculate attached context details
                                                let totalAttachedContext = 0;
                                                for (let iCounter = 0; iCounter < resp.contextInfo.length; iCounter++) {
                                                    let contentInfo = resp.contextInfo[iCounter];
                                                    if (contentInfo.content && contentInfo.content.results && contentInfo.content.results.length > 0) {
                                                        totalAttachedContext += contentInfo.content.results.length;
                                                    }
                                                }

                                                var attachedContextLength = Math.round(totalAttachedContext / resp.referencesInfo.length);

                                                //instanceId List are passed in pidList for method getFrozenEffectivityDetails which gives frozen Evolution Effectivity details.
                                                var effectivityOptions = {
                                                    pidList: instanceList,
                                                };

                                                let iResponse = await CfgUtility.getFrozenEffectivityDetails(effectivityOptions);
                                                await that._getAvailableDomainDetails(iResponse);

                                                for (i = 0; i < length; i++) {
                                                    if (configChageList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                        failedList.push(data.selectedNodes[i].alias);

                                                        //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                        if (!that.options.context) {
                                                            that.resetSpinner({ counter: i });
                                                        }
                                                    }

                                                    //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0.
                                                    //frozen products are removed from valid Products list which is passed to Paste Variant Effectivity operation. Original Effectivity should be shown.
                                                    if (frozenEvolutionList.indexOf(data.selectedNodes[i].id) >= 0 && authHeaders.length == 0) {
                                                        //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                        if (!that.options.context) {
                                                            that.resetSpinner({ counter: i });
                                                        }
                                                    }
                                                }

                                                //Unsupported types or ConfigChange products are removed from valid Products list which is passed to Paste Variant Effectivity operation.
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

                                                //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0.
                                                //For Active Work under Authoring context, Frozen Evolution Check on reference Evolution Effectivity should be avoided
                                                //and passed as Valid reference for Paste Variant Effectivity operation
                                                //frozen Evolution Products are removed from valid Products list which is passed to Paste Variant Effectivity operation for empty Work under Authoring context.
                                                if (frozenEvolutionList.length > 0 && authHeaders.length == 0) {
                                                    for (i = 0; i < frozenEvolutionList.length; i++) {
                                                        var instId = frozenEvolutionList[i];
                                                        var index = instanceList.indexOf(instId);
                                                        if (index > -1) {
                                                            instanceList.splice(index, 1);
                                                        }
                                                    }
                                                }
                                            } else {
                                                failedList.push(data.selectedNodes[0].alias);
                                                if (instanceList.length > 1) failedList.push(data.selectedNodes[0].alias);

                                                //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity with context check in updateSpinner method
                                                that.updateSpinner({ showSpinner: false, pushToFailedList: false, contextCheck: true, that: that });

                                                that._showMessage();
                                            }
                                        } else {
                                            //only getFrozenEffectivityDetails check done for xRevision Paste Variant Effectivity operation.
                                            var effectivityOptions = {
                                                pidList: instanceList,
                                            };

                                            let iResponse = await CfgUtility.getFrozenEffectivityDetails(effectivityOptions);
                                            await that._getAvailableDomainDetails(iResponse);

                                            for (i = 0; i < length; i++) {
                                                if (configChageList.indexOf(data.selectedNodes[i].id) >= 0) {
                                                    failedList.push(data.selectedNodes[i].alias);

                                                    //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                    if (!that.options.context) {
                                                        that.resetSpinner({ counter: i });
                                                    }
                                                }

                                                //frozen products are removed from valid Products list which is passed to Paste Variant Effectivity operation. Original Effectivity should be shown.
                                                if (frozenEvolutionList.indexOf(data.selectedNodes[i].id) >= 0 && authHeaders.length == 0) {
                                                    //[IR-636352 02-Jan-2020] spinner changed with Failed node Effectivity
                                                    if (!that.options.context) {
                                                        that.resetSpinner({ counter: i });
                                                    }
                                                }
                                            }

                                            //Unsupported types or ConfigChange products are removed from valid Products list which is passed to Paste Variant Effectivity operation.
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

                                            //frozen Evolution Products are removed from valid Products list which is passed to Paste Variant Effectivity operation for empty Work under Authoring context.
                                            if (frozenEvolutionList.length > 0 && authHeaders.length == 0) {
                                                for (i = 0; i < frozenEvolutionList.length; i++) {
                                                    var instId = frozenEvolutionList[i];
                                                    var index = instanceList.indexOf(instId);
                                                    if (index > -1) {
                                                        instanceList.splice(index, 1);
                                                    }
                                                }
                                            }
                                        }

                                        //Valid products passed to Paste Variant Effectivity operation.
                                        if (instanceList.length > 0) {
                                            //show frozen Evolution check Information message for Paste Variant Effectivity operation
                                            //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0 for Frozen Evolution message.
                                            if (frozenEvolutionList.length > 0 && authHeaders.length == 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Paste_Variant_Operation_Info, 'info');

                                            var variantEffxml = CfgData.VariantEffectivity;
                                            if (variantEffxml != undefined && variantEffxml != null) {
                                                allPromises.push(that._setVariantEffectivity(instanceList, data.selectedNodes[0].alias, variantEffxml, authHeaders, data));
                                            }
                                        } else {
                                            //show frozen Evolution check error message for Paste Variant Effectivity operation
                                            //[IR-888047 29-Sep-2021] Added work under Authoring context empty check as --> authHeaders.length == 0 for Frozen Evolution message.
                                            if (frozenEvolutionList.length > 0 && authHeaders.length == 0) CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution_Paste_Variant_Operation_Error, 'error');

                                            that._showMessage();
                                        }

                                        //send Paste Variant Effectivity operation details for cloud probes tracking
                                        if (contextResponseModelType) {
                                            let probesOptions = { selectedNodesLength: data.selectedNodes.length, contextLength: attachedContextLength };
                                            that.sendPasteVariantTrackerEvent(probesOptions);
                                        }
                                    },
                                    function (error) {
                                        //[IR-940450 05-May-2022] commented below check to show error for Non-PADContext applications.
                                        //if (!that.options.context) {
                                        failedList.push(data.selectedNodes[0].alias);
                                        if (instanceList.length > 1) failedList.push(data.selectedNodes[0].alias);

                                        that.updateSpinner({ showSpinner: false, pushToFailedList: false, contextCheck: false, that: that });

                                        that._showMessage();
                                        //}
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
    return CfgPasteEffectivityCmd;
});
