/*
/**
 * @quickreview KR5     25:08:05 IR-1426436 used api getPath to caluclate Occurrence path in method getOccurrenceData
 * @quickreview RBE28   25:06:13 IR-1382231-3DEXPERIENCER2026x : Display Effectivity command - picture icon of object is not correct after a new input selection
 * @quickreview KXI     24:08:15 IR-1259929-3DEXPERIENCER2024x
 */

define('DS/CfgEffectivityCommands/commands/CfgDisplayEffectivityCmd', [
    'DS/CfgEffectivityCommands/commands/CfgEffCmd',
    'DS/CfgTracker/CfgTracker',
    'DS/Utilities/TouchUtils',
    'DS/Controls/TooltipModel',
    'DS/CfgBaseUX/scripts/CfgUtility',
    'DS/CfgBaseUX/scripts/CfgDialog',
    'DS/CfgEffectivityViewUX/scripts/CfgEffectivityViewFactory',
    'DS/UIKIT/Mask',
    'i18n!DS/CfgBaseUX/assets/nls/CfgBaseUXNLS',
    'i18n!DS/CfgEffectivityViewUX/assets/nls/CfgEffectivityView',
    'DS/CfgBaseUX/scripts/CfgUXEnvVariables',
    'css!DS/CfgWebAppEffectivityUX/CfgWebAppEffectivityUX.css',
], function (CfgEffCmd, CfgTracker, TouchUtils, WUXTooltipModel, CfgUtility, CfgDialog, CfgEffectivityViewFactory, Mask, CfgBaseUXNLS, EFF_VIEW_NLS, CfgUXEnvVariablesJS) {
    'use strict';

    var CfgDisplayEffectivityCmd = CfgEffCmd.extend({
        modelData: null,
        cfgDisplayEffectivityDialog: null,

        destroy: function () {
            if (this.cfgDisplayEffectivityDialog) this.cfgDisplayEffectivityDialog.closeDialog();
        },

        //hides Effectivity View div header for error scenario
        _handleEffectivityHeaderVisibility: function (header) {
            this.cfgDispEffEffectivityViewDiv.setContent(header);
            this.cfgDispEffTitleDiv.parentElement.hide();
            this.cfgDispEffEffectivityViewDiv.removeClassName('cfgDispEffEffectivityViewDivHeaderAvailable');
        },

        //Refreshes Display Effectivity Dialog content for valid item or show message.
        _refreshDisplayEffectivityDialog: function (data) {
            this.cfgDispEffEffectivityViewDiv.setContent('');
            if (data.selectedNodes.length == 0) {
                if (this.cfgDisplayEffectivityDialog != undefined && this.cfgDisplayEffectivityDialog.container != undefined) {
                    this._handleEffectivityHeaderVisibility(EFF_VIEW_NLS.CFG_NO_OBJECT_SELECTED_ERROR);
                    return;
                }
            } else if (data.selectedNodes.length === 1) {
                if (this.isRoot == true) {
                    if (this.cfgDisplayEffectivityDialog != undefined && this.cfgDisplayEffectivityDialog.container != undefined) {
                        this._handleEffectivityHeaderVisibility(EFF_VIEW_NLS.CFG_TYPE_NOT_SUPPORTED_ERROR);
                        return;
                    }
                } else {
                    this.updateEffectivityView();
                }
            } else if (data.selectedNodes.length > 0) {
                if (this.cfgDisplayEffectivityDialog != undefined && this.cfgDisplayEffectivityDialog.container != undefined) {
                    this._handleEffectivityHeaderVisibility(EFF_VIEW_NLS.CFG_MULTIPLE_INSTANCE_NOT_SUPPORTED_ERROR);
                    return;
                }
            }
        },

        // If Display Effectivity dialog is open then retrieve Effectivity infornation of selected item
        _checkSelection: function () {
            this._SelectedID = '';
            let data = this.getData();
            if (data.selectedNodes.length === 1) {
                this._SelectedID = data.selectedNodes[0].id || '';
                this._SelectedAlias = data.selectedNodes[0].alias || '?';
                this.isRoot = data.selectedNodes[0].isRoot;
            }

            this._setStateCmd();

            if (this.cfgDisplayEffectivityDialog != null) {
                this._refreshDisplayEffectivityDialog(data);
            }
        },

        updateEffectivityView: async function () {
            let that = this;
            let data = await that.getOccurrenceData();
            if (data.selectedNodes.length > 0) {
                that._processOccurrenceDialogLaunch(data);
            } else {
                this._handleEffectivityHeaderVisibility(EFF_VIEW_NLS.CFG_TYPE_NOT_SUPPORTED_ERROR);
            }
        },

        //call getData method of CfgEffCmd and add Occurrence path and ReferencePathIds
        getOccurrenceData: async function () {
            let that = this;
            let data = that.getData();

            if (data.selectedNodes && data.selectedNodes.length > 0) {
                let typesArray = [];
                typesArray.push(data.selectedNodes[0].VPMRef);

                //tennat and security context requires before web-service calls
                if (widget) enoviaServerFilterWidget.tenant = widget.getValue('x3dPlatformId');
                else enoviaServerFilterWidget.tenant = 'OnPremise';

                await CfgUtility.populate3DSpaceURL();
                await CfgUtility.populateSecurityContext();
                let typeResponse = await CfgUtility.checkProperties(typesArray);

                //For unsupported type like Drawing, show error message
                if (!(typeResponse[data.selectedNodes[0].VPMRef].filterable == 'YES' || typeResponse[data.selectedNodes[0].VPMRef].configurable == 'YES')) {
                    if (that.cfgDisplayEffectivityDialog == null) {
                        let errorTitle = EFF_VIEW_NLS.DISPLAY_EFFECTIVITY_HEADER;
                        let errorSubtitle = EFF_VIEW_NLS.CFG_TYPE_NOT_SUPPORTED_ERROR;
                        CfgUtility.showNotifs('error', errorTitle, errorSubtitle);
                    } else {
                        that.cfgDispEffEffectivityViewDiv.setContent(EFF_VIEW_NLS.CFG_TYPE_NOT_SUPPORTED_ERROR);
                    }
                    data.selectedNodes = [];
                    return data;
                }
            }

            //Read referencePath Ids and occurrencePath Ids used to calculate occurrence Effectivity
            //if (this.CfgUXEnvVariables != undefined && this.CfgUXEnvVariables.isOccurrenceEnabled != undefined && this.CfgUXEnvVariables.isOccurrenceEnabled == true) {
            let referencePathIds = [];
            let instancePathIds = [];
            let occuPathObjects;
            if (typeof data.padNodes[0].getPath == 'function') {
                occuPathObjects = data.padNodes[0].getPath();
                occuPathObjects.forEach((element) => {
                    if (element['_options']) {
                        if (element['_options'].resourceid && element['_options'].resourceid.length > 0) {
                            referencePathIds.push(element['_options'].resourceid);
                        }
                        if (element['_options'].relationid && element['_options'].relationid.length > 0) {
                            instancePathIds.push(element['_options'].relationid);
                        }
                    }
                });
                if (referencePathIds.length > 1) {
                    //reference id is considered till selected nodes parent only and removed selected nodes resourceid from referencePathIds.
                    referencePathIds.pop();
                }
            } else {
                //some application doesn't support getPath like Manufacturing Item Management for which Occurrence expander should be hidden.
                return data;
            }

            //fetch occurrence Path and total reference path ids till root used to calculate Occurrence Effectivity
            data.selectedNodes[0].referencePathIds = referencePathIds;
            data.selectedNodes[0].instancePathIds = instancePathIds;
            //}
            return data;
        },

        //Calculates Occurrence view shown in Display Effectivity dialog
        getOccurrenceView: async function (iOptions) {
            let that = this;
            let effViewData = iOptions.effViewData;
            let instanceId = iOptions.instanceId;
            let occurrenceRequired = iOptions.occurrenceRequired;
            let data = iOptions.data;

            //When user selects different objects fastly before loading old product details, only single product Effectivity details should be shown.
            //Added check of latest Product selection with web-service response
            if (effViewData.instanceID != undefined && data.selectedNodes.length == 1 && effViewData.instanceID.length == 1 && effViewData.instanceID[0] == instanceId) {
                if (occurrenceRequired == true) {
                    //clear Display Effectivity div content to show Effectivity of latest selected object
                    that.cfgDispEffEffectivityViewDiv.setContent('');

                    //displayCompactMode = !touchMode to show according to settings
                    let effectivityInstance = await that.cfgOccurrenceEffViewFactory.createInstance(effViewData, that.cfgDispEffEffectivityViewDiv, !that.touchMode);
                    effectivityInstance.render();
                    //For Empty Effectivity spinner should show till Occurrence Effectivity is calculated
                    if (effViewData.effModels.length > 0) {
                        Mask.unmask(that.cfgDispEffEffectivityViewDiv);
                    }

                    effectivityInstance.renderOccurrenceInfo();
                    Mask.mask(effectivityInstance.occurrenceView);
                    let occurrenceOptions = {
                        effViewData: effViewData,
                        occurrencesIds: data.selectedNodes[0].instancePathIds,
                        referencePathIds: data.selectedNodes[0].referencePathIds,
                        occurrenceRequired: occurrenceRequired,
                    };
                    //Load Occurrence Effectivity data
                    await that.cfgOccurrenceEffViewFactory.loadOccurrenceEffectivities(occurrenceOptions).then(
                        function (effViewOccurrenceData) {
                            if ((effViewOccurrenceData.effOccuData == undefined || Object.keys(effViewOccurrenceData.effOccuData).length === 0) && effViewData.effModels.length == 0) {
                                that.cfgDispEffEffectivityViewDiv.setHTML(EFF_VIEW_NLS.NO_EFF_MSG);
                            }
                            Mask.unmask(that.cfgDispEffEffectivityViewDiv);
                            Mask.unmask(effectivityInstance.occurrenceView);
                            effectivityInstance.updateOccurrenceInfo(effViewOccurrenceData);
                        },
                        function () {
                            Mask.unmask(that.cfgDispEffEffectivityViewDiv);
                            Mask.unmask(effectivityInstance.occurrenceView);
                        }
                    );
                } else {
                    that.cfgDispEffEffectivityViewDiv.setContent('');
                    that.cfgOccurrenceEffViewFactory.createInstance(effViewData, that.cfgDispEffEffectivityViewDiv, !that.touchMode).render();
                    Mask.unmask(that.cfgDispEffEffectivityViewDiv);
                }

                //[Magic cloud probes]
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
                    CommandName: CfgTracker.Labels['DISPLAY_EFFECTIVITY'],
                    CommandOperation: 'Display_Effectivity_Dialog_Open',
                    ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'],
                    ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'],
                };
                CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(probesOptions);
            }
        },

        //Show Display Effectivity dialog with Occurrence Effectivity details
        _processOccurrenceDialogLaunch: async function (data) {
            let that = this;

            this.cfgDispEffTitleDiv.parentElement.show();
            this.cfgDispEffTitleDiv.innerText = data.selectedNodes[0].alias + ' ' + data.selectedNodes[0].revision;

            //IR-1382231-3DEXPERIENCER2026x - Update Display Effectivity dialog Icon
            if (data.padNodes != undefined && data.padNodes.length == 1 && typeof data.padNodes[0].getIcons === 'function' && data.padNodes[0].getIcons().length == 1 && data.padNodes[0].getIcons()[0].iconPath != undefined) {
                let iconImagePath = '';
                iconImagePath = data.padNodes[0].getIcons()[0].iconPath;
                iconImagePath = iconImagePath.replace('url(', '').replace(')', '');
                if (this.cfgDispEffIconDiv.children[0]) {
                    this.cfgDispEffIconDiv.children[0].src = iconImagePath;
                }
            }

            that.cfgDispEffEffectivityViewDiv.setContent('');
            that.cfgDispEffEffectivityViewDiv.addClassName('cfgDispEffEffectivityViewDivHeaderAvailable');

            let instanceId = data.selectedNodes[0].id;
            let tenantId = enoviaServerFilterWidget.tenant;
            let occurrenceRequired = data.selectedNodes[0].referencePathIds != undefined;

            Mask.mask(that.cfgDispEffEffectivityViewDiv);
            //Load Instance Effectivity details similar shown in Properties widget
            await that.cfgOccurrenceEffViewFactory.loadEffectivities(instanceId, tenantId).then(
                async function (effViewData) {
                    let iOptions = {
                        effViewData: effViewData,
                        data: data,
                        occurrenceRequired: occurrenceRequired,
                        instanceId: instanceId,
                    };
                    that.getOccurrenceView(iOptions);
                },
                function () {
                    Mask.unmask(that.cfgDispEffEffectivityViewDiv);
                }
            );

            that.enable();
        },

        execute: async function () {
            if (this.cfgDisplayEffectivityDialog) {
                this.cfgDisplayEffectivityDialog.closeDialog();
                this.cfgDisplayEffectivityDialog = undefined;
            }
            let that = this;
            that.disable();
            this.CfgUXEnvVariables = CfgUXEnvVariablesJS.getCfgUXEnvVariables();
            let data = await that.getOccurrenceData();

            if (data.selectedNodes && data.selectedNodes.length > 0) {
                if (data.selectedNodes[0].isRoot == true) {
                    console.log('Cannot Open Occurrence Effectivity Dialog for a root node');
                    that.enable();
                } else {
                    //tennat and security context requires before web-service calls
                    if (widget) enoviaServerFilterWidget.tenant = widget.getValue('x3dPlatformId');
                    else enoviaServerFilterWidget.tenant = 'OnPremise';

                    CfgUtility.populate3DSpaceURL().then(function () {
                        CfgUtility.populateSecurityContext().then(function () {
                            let buttonArray = [
                                {
                                    label: 'Close',
                                    labelValue: CfgBaseUXNLS.CfgLabelClose,
                                    handler: function () {
                                        that.cfgDisplayEffectivityDialog.closeDialog();
                                        that.cfgDisplayEffectivityDialog = null;
                                    },
                                    className: 'default',
                                },
                            ];

                            //Read Touch mode value and prepare UX accordingly
                            that.touchMode = TouchUtils.getTouchMode() == undefined || TouchUtils.getTouchMode() == false ? false : true;

                            let postCloseHandler = function () {
                                that.cfgDisplayEffectivityDialog.closeDialog();
                                that.cfgDisplayEffectivityDialog = null;
                            };

                            let options = {
                                tenant: enoviaServerFilterWidget.tenant,
                                environment: 'Dashboard',
                                parent: null,
                                parentElement: null,
                                mode: 'DisplayEffectivity',
                                persistId: 'CfgDisplayEffectivity',
                                modalFlag: false,
                                width: 600,
                                height: 500,
                                minHeight: 210,
                                minWidth: 310,
                                dialogue: {
                                    header: EFF_VIEW_NLS.DISPLAY_EFFECTIVITY_HEADER,
                                    buttonArray: buttonArray,
                                    target: widget.body,
                                    postCrossHandler: postCloseHandler,
                                },
                                touchMode: that.touchMode,
                            };

                            if (that.cfgDisplayEffectivityDialog == null || that.cfgDisplayEffectivityDialog == undefined) {
                                //Initialize DIsplay Effectivity dialog
                                that.cfgDisplayEffectivityDialog = new CfgDialog(options);
                                that.cfgDisplayEffectivityDialog.render();
                            }

                            var cfgDispEffHeaderDiv = new UWA.createElement('div', {
                                class: 'cfgDispEffEffectivityViewHeaderDiv',
                            }).inject(that.cfgDisplayEffectivityDialog.container);

                            //icon div inside header
                            that.cfgDispEffIconDiv = new UWA.createElement('div', {
                                class: 'cfgDispEffIconDiv',
                            }).inject(cfgDispEffHeaderDiv);

                            //show icon
                            let iconImagePath = '';
                            if (data.padNodes != undefined && data.padNodes.length == 1 && typeof data.padNodes[0].getIcons === 'function' && data.padNodes[0].getIcons().length == 1 && data.padNodes[0].getIcons()[0].iconPath != undefined) {
                                iconImagePath = data.padNodes[0].getIcons()[0].iconPath;
                                iconImagePath = iconImagePath.replace('url(', '').replace(')', '');
                                new UWA.createElement('img', { src: iconImagePath }).inject(that.cfgDispEffIconDiv);
                            }

                            //name+rev div inside header
                            that.cfgDispEffTitleDiv = new UWA.createElement('div', {
                                class: 'cfgDispEffTitleDiv',
                            }).inject(cfgDispEffHeaderDiv);
                            that.cfgDispEffTitleDiv.innerText = data.selectedNodes[0].alias + ' ' + data.selectedNodes[0].revision;

                            //create refresh icon under options.multiInstance
                            {
                                //refresh div inside header
                                var cfgDispEffRefreshDiv = new UWA.createElement('div', {
                                    class: 'cfgDispEffRefreshDiv',
                                    html: UWA.createElement('span', {
                                        class: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-refresh', // This class will add the Search icon
                                    }),
                                }).inject(cfgDispEffHeaderDiv);

                                cfgDispEffRefreshDiv.tooltipInfos = new WUXTooltipModel({
                                    shortHelp: EFF_VIEW_NLS.CFG_REFRESH_EFFECTIVITY,
                                });

                                //click event fro refresh
                                cfgDispEffRefreshDiv.set({
                                    events: {
                                        click: function (e) {
                                            that._checkSelection();
                                        },
                                    },
                                });
                                //Div for effectivity view belwo header
                                that.cfgDispEffEffectivityViewDiv = new UWA.createElement('div', {
                                    class: 'cfgDispEffEffectivityViewDiv',
                                }).inject(that.cfgDisplayEffectivityDialog.container);

                                that.cfgOccurrenceEffViewFactory = new CfgEffectivityViewFactory();
                                that._processOccurrenceDialogLaunch(data);
                            }
                        });
                    });
                }
            }
        },
    });

    return CfgDisplayEffectivityCmd;
});
