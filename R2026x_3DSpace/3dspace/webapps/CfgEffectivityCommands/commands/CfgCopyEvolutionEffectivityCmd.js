/**
 * @quickreview KR5     25:06:09 IR-1395679 used getChangeControlledList to get Change Controlled Objects.
 * @quickreview H37     25:05:23 FUN159054
 * @quickreview KR5     25:04:15 TSK11967241 : considered unaccessibleModelList in for parseGetMultipleConfigurationContextResponse response
 * @quickreview PPD4    25:04:09 FUN154297 when xrevision is attached as scope we dont get model attributes so we fetch model attribtues from search
 * @quickreview KR5     25:03:24 TSK11967241 : Variant + Explicit CFG_Copy_Evolution_Not_Allowed_Evolution_criteria_not_active error message
 * @quickreview KR5     25:02:03 TSK11976182 : CPQ getMultipleConfigurationContextInfo unwanted parameter removal
 * @quickreview KR5     25:01:15 TSK11976181 : CPQ getMultipleConfigurationContextInfo version 1.2
 * @quickreview KR5     24:07:11 added only Frozen Check for xRevision Copy Evolution Effectivity operation
 *
 */
define('DS/CfgEffectivityCommands/commands/CfgCopyEvolutionEffectivityCmd', [
    'DS/CfgTracker/CfgTracker',
    'DS/CfgTracker/CfgDimension',
    'DS/CfgTracker/CfgValue',
    'DS/CfgBaseUX/scripts/CfgXMLServices',
    'DS/CfgBaseUX/scripts/CfgController',
    'DS/CfgBaseUX/scripts/CfgUtility',
    'DS/CfgBaseUX/scripts/CfgData',
    'i18n!DS/CfgWebAppEffectivityUX/assets/nls/CfgEffectivityNLS',
    'DS/CfgEffectivityCommands/commands/CfgEffCmd',
    'DS/CfgAuthoringContextUX/scripts/CfgAuthoringContext',
], function (CfgTracker, CfgDimension, CfgValue, CfgXMLServices, CfgController, CfgUtility, CfgData, EffectivityNLS, CfgEffCmd, CfgAuthoringContext) {
    'use strict';

    var CfgCopyEvolutionEffectivityCmd = CfgEffCmd.extend({
        _onRefresh: function () {
            //For widget Refresh opertaion, existing copied data should be cleared.
            CfgData.isEvolutionEffAvailable = ' ';
        },

        /*
         * Don't overload it
         */
        execute: function () {
            var that = this;
            that.disable();

            if (!this.isConfigAuthorized()) return; //FUN159054
            var data = that.getData();

            if (data.selectedNodes && data.selectedNodes.length > 0) {
                var getEffectivity_callback = function () {
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

                            //For Work Under authoring context present, Copy Evolution Effectivity operation should not be allowed
                            if (authHeaders.length > 0) {
                                CfgUtility.showwarning(EffectivityNLS.CFG_Copy_Evolution_Not_Allowed, 'error');
                                return;
                            }

                            //Need to check Change controlled Object and restict Copy Evolution Effectivity operation.
                            if (change_response.length > 0) {
                                if (authHeaders.length == 0) {
                                    let errorTitle = EffectivityNLS.CC_AC_HDR_Error.replace('{1}', data.selectedNodes[0].alias);
                                    let errorSubtitle = EffectivityNLS.CC_AC_HDR_Error_subtitle.replace('{1}', data.selectedNodes[0].alias);
                                    CfgUtility.showNotifs('error', errorTitle, errorSubtitle);
                                    return;
                                }
                            }

                            let options = { referenceIds: [data.selectedNodes[0].parentID] };
                            CfgUtility.getMultipleConfigurationContextInfo(options).then(
                                async function (contextResponse) {
                                    let contextResponseModelType = true;
                                    if (contextResponse.xRevisionContent && contextResponse.xRevisionContent.length > 0) {
                                        contextResponseModelType = false;
                                        //Only Frozen Check need to be done for xRevision Copy Evolution Effectivity operation
                                        let frozenDetails = await CfgUtility.getFrozenCheck([
                                            {
                                                instanceId: data.selectedNodes[0].id,
                                            },
                                        ]);
                                        if (frozenDetails.length == 1 && frozenDetails[0].isFrozen == true) {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution, 'error');
                                            return;
                                        }
                                    } else {
                                        //Read attached Model count for cloud probes for Copy Evolution Effectivity operation
                                        let modelInfo = [];
                                        let { refBasedOn, modelsList, unaccessibleModelList } = await CfgUtility.parseGetMultipleConfigurationContextResponse(contextResponse);
                                        //Copy Evolution Effectivity operation not allowed as parent reference attached with Model Version as Configuration Context
                                        if (refBasedOn === 'ModelVersion') {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_Copy_Evolution_Not_Allowed_Evolution_criteria_not_active, 'error');
                                            that.enable();
                                            return;
                                        }
                                        if (contextResponse.contextInfo && contextResponse.contextInfo.length > 0) {
                                            modelInfo = modelsList;
                                        } else {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_No_Context_Copy_Evolution, 'error');
                                            that.enable();
                                            return;
                                        }
                                        CfgData.attachedEvolutionModelCount = modelInfo.length;

                                        //[IR-1226933 25-Jan-2024] need to show unaccessible context error
                                        for (let modelCount = 0; modelCount < unaccessibleModelList.length; modelCount++) {
                                            if (unaccessibleModelList[modelCount].notification != undefined && unaccessibleModelList[modelCount].notification.code == 'unaccessible' && unaccessibleModelList[modelCount].notification.type == 'ERROR') {
                                                CfgUtility.showwarning(unaccessibleModelList[modelCount].notification.message, 'error');
                                                that.enable();
                                                return;
                                            }
                                        }

                                        let copyCriteria = [];
                                        if (contextResponse.enabledCriteria && contextResponse.enabledCriteria.length > 0) {
                                            for (let counter = 0; counter < contextResponse.enabledCriteria.length; counter++) {
                                                if (contextResponse.enabledCriteria[counter].criteriaName != 'feature') {
                                                    copyCriteria.push(contextResponse.enabledCriteria[counter].criteriaName);
                                                }
                                            }
                                        }
                                        CfgData.copyEvolutionCriteria = copyCriteria;

                                        if (CfgData.copyEvolutionCriteria != undefined && CfgData.copyEvolutionCriteria.length > 0) {
                                            var frozenDetails = await CfgUtility.getFrozenCheck([
                                                {
                                                    instanceId: data.selectedNodes[0].id,
                                                },
                                            ]);
                                            if (frozenDetails.length == 1 && frozenDetails[0].isFrozen == true) {
                                                CfgUtility.showwarning(EffectivityNLS.CFG_Frozen_Evolution, 'error');
                                                return;
                                            }
                                        } else {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_No_Criteria_Copy_Evolution, 'error');
                                            that.enable();
                                            return;
                                        }
                                    }

                                    var returnedPromiseEff = new Promise(function (resolve, reject) {
                                        var jsonData = {
                                            version: '2.0',
                                            output: {
                                                targetFormat: 'XML',
                                                withDescription: 'YES',
                                                view: 'Current',
                                                domains: 'ALL',
                                            },
                                            pidList: [data.selectedNodes[0].id],
                                        };

                                        //Read Effectivity details for selected product.
                                        var url = '/resources/modeler/configuration/navigationServices/getMultipleFilterableObjectInfo';
                                        var postdata = JSON.stringify(jsonData);
                                        var onCompleteCallBack = function (getMultipleFilterableObjectInfo) {
                                            resolve(getMultipleFilterableObjectInfo);
                                        };
                                        CfgUtility.makeWSCall(url, 'POST', 'enovia', 'application/json', postdata, onCompleteCallBack, reject, true);
                                    });

                                    returnedPromiseEff.then(
                                        function (response) {
                                            that.enable();
                                            for (var key in response.expressions) {
                                                if (response.expressions.hasOwnProperty(key)) {
                                                    //Read Currret Evolution Effectivity and stored it in golbal variable CfgData which is used in Paste Evolution Effectivity operation
                                                    if (
                                                        response.expressions[key].status == 'SUCCESS' &&
                                                        response.expressions[key].hasEffectivity == 'YES' &&
                                                        response.expressions[key].content.Evolution != null &&
                                                        response.expressions[key].content.Evolution.Current != null &&
                                                        response.expressions[key].content.Evolution.Current != ''
                                                    ) {
                                                        CfgData.EvolutionEffectivity = response.expressions[key].content.Evolution.Current;
                                                        CfgData.isEvolutionEffAvailable = 'YES';
                                                        CfgUtility.showwarning(EffectivityNLS.CFG_Copy_Evolution_Effectivity_Successful + ' ' + data.selectedNodes[0].alias, 'success');
                                                    } else if (
                                                        (response.expressions[key].status == 'SUCCESS' && response.expressions[key].hasEffectivity == 'NO') ||
                                                        (response.expressions[key].status == 'SUCCESS' && response.expressions[key].hasEffectivity == 'YES' && response.expressions[key].content.Evolution != null && response.expressions[key].content.Evolution != '')
                                                    ) {
                                                        //When user selects Empty Evolution Effectivity for Copy Effectivity operation then information message is shown. Paste Effectivity operation on Target products will clear Evolution Effectivity.
                                                        CfgData.isEvolutionEffAvailable = 'NO';
                                                        CfgUtility.showwarning(EffectivityNLS.CFG_Copy_NoEvolutionEffectivity, 'info');
                                                    } else {
                                                        //Error case where Evolution Effectivity is not supported like Drawing type.
                                                        //[IR-1091197 IR-1091199 14-Jun-2023] changed error messages according to UA suggetions.
                                                        CfgData.isEvolutionEffAvailable = ' ';
                                                        CfgUtility.showwarning(EffectivityNLS.CFG_Copy_Evolution_Effectivity_Failed.replace('{1}', data.selectedNodes[0].alias), 'error');
                                                    }
                                                }
                                            }

                                            //Currently Cloud probes should be tracked for Model type only and not for xRevision
                                            if (contextResponseModelType) {
                                                try {
                                                    //[Magic cloud probes]
                                                    let magicAppId = 'defaultAppID';
                                                    let magicAppName = 'ODT Environment';
                                                    if (widget && widget.data && widget.data.appId) {
                                                        magicAppId = widget.data.appId;
                                                    }
                                                    if (widget && widget.options && widget.options.title) {
                                                        magicAppName = widget.options.title;
                                                    }

                                                    let copyEffetivityType = 'Copy_Evolution_Effectivity';
                                                    if (CfgData.isEvolutionEffAvailable == 'NO') copyEffetivityType = 'Copy_Empty_Evolution_Effectivity';
                                                    else if (CfgData.isEvolutionEffAvailable == ' ') copyEffetivityType = 'Copy_Evolution_Effectivity_Error';

                                                    let probesOptions = {
                                                        AppId: magicAppId,
                                                        AppName: magicAppName,
                                                        CommandName: CfgTracker.Labels['COPY_PASTE_EVOLUTION_EFFECTIVITY'],
                                                        CommandOperation: copyEffetivityType,
                                                        ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'],
                                                        ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'],
                                                    };
                                                    CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(probesOptions);

                                                    //Assign default Evolution criteria used for empty evolution effectivity probes tracking
                                                    let evolutionCriteria = {
                                                        mvCriteria: 'NONE',
                                                        mpCriteria: 'NONE',
                                                        unitCriteria: 'NONE',
                                                        dateCriteria: 'NONE',
                                                    };

                                                    //when valid Evolution Effectivity is present then read Evolution critera set
                                                    if (CfgData.isEvolutionEffAvailable == 'YES') evolutionCriteria = CfgXMLServices.getProbesEvolutionCriteria(CfgData.EvolutionEffectivity);

                                                    //Assign values to global variable which are used in Paste Evolution operation Effectivity probes tracking
                                                    let probesValuesForPasteEvolutionOpertaion = { mvCriteria: evolutionCriteria.mvCriteria, mpCriteria: evolutionCriteria.mpCriteria, unitCriteria: evolutionCriteria.unitCriteria, dateCriteria: evolutionCriteria.dateCriteria };
                                                    CfgData.probesValuesForPasteEvolutionOpertaion = probesValuesForPasteEvolutionOpertaion;

                                                    CfgTracker.createEventBuilder({
                                                        category: CfgTracker.Category['USAGE'],
                                                        action: CfgTracker.Events['CLICK'],
                                                        tenant: enoviaServerFilterWidget.tenant,
                                                    })
                                                        .setLabel(CfgTracker.Labels['COPY_PASTE_EVOLUTION_EFFECTIVITY'])
                                                        .setAppId(widget.data.appId || 'NO_APP_ID')
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_EFFECTIVITY_WIDGET, widget.data.title || widget.options.title || 'ODT Environment')
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_EFFECTIVITY_MODE, 'Copy')
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_MODEL_VERSION, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.mvCriteria])
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_MANUFACTURING_PLAN, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.mpCriteria])
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_UNIT, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.unitCriteria])
                                                        .addDimension(CfgDimension.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_CRITERIA_DATE, CfgTracker.ConfigCriteriaSelected[evolutionCriteria.dateCriteria])
                                                        .addPersonalValue(CfgValue.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_NO_OF_MODEL, CfgData.attachedEvolutionModelCount)
                                                        .addPersonalValue(CfgValue.COPY_PASTE_EVOLUTION_EFFECTIVITY.COPY_PASTE_EVOLUTION_NO_OF_OBJECT, data.selectedNodes.length)
                                                        .send();
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }
                                        },
                                        function () {
                                            that.enable();
                                        }
                                    );
                                },
                                function () {
                                    that.enable();
                                    CfgUtility.showwarning(EffectivityNLS.CFG_Service_Fail, 'error');
                                }
                            );
                        },
                        function () {
                            that.enable();
                            CfgUtility.showwarning(EffectivityNLS.CFG_No_Context_Copy_Evolution, 'error');
                        }
                    );
                };

                CfgController.init();

                if (widget.getValue('x3dPlatformId')) enoviaServerFilterWidget.tenant = widget.getValue('x3dPlatformId');
                else enoviaServerFilterWidget.tenant = 'OnPremise';

                CfgUtility.populate3DSpaceURL().then(function () {
                    CfgUtility.populateSecurityContext().then(function () {
                        enoviaServerFilterWidget.InstanceId = data.selectedNodes[0].id;
                        getEffectivity_callback();
                    });
                });
            }
        },
    });

    return CfgCopyEvolutionEffectivityCmd;
});
