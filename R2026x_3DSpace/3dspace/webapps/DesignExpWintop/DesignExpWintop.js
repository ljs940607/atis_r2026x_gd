/*
* @fullreview KBS8 BVL 23:04:11 Check dscef is defined in _setSynchronizedMyAppsBaseUrl() to be able to call this js file in dashboard
* @quickReview bvl 23:05:12 Add 'Define' to modularize the code in order to be able to require it in ODT
* @quickReview BVL 23:06:28 sendContextAssets() API is commented as not used by PSD
* @quickReview KBS8 24:02:29 GlobalUtils.init called in init() to initialise platformServices in oder to be able to retrieve platformId in DesignEnvUtils::getPlatformURL (IR-1235653-3DEXPERIENCER2024x)
* @quickReview BVL 25:04:01 isVDRPEnabled added to integrate VDRP Filters into WiW panel
*/
define('DS/DesignExpWintop/DesignExpWintop', [
    'UWA/Class'
], function DesignExpWintop(Class) {
    'use strict';
        var myDesignExpWintop = Class.extend({
        init: function (options) {
            var that = this;
            that.options = options;
            require(['DS/DesignEnvironmentUX/DesignEnvCore'
                , 'DS/DesignEnvironmentUX/views/DesignEnvLeftSidePanel/js/DesignEnvListView'
                , 'DS/DesignEnvironmentUX/utils/DesignEnvUtils'],
                function (DesignEnvCore, DesignEnvListView, GlobalUtils) {
                    //initialization
                    that.options.selectFromUI = true;
                   
                    that.designExpPanel = {
                        isReadOnly: true,
                        isCowEnabled: true,
                        isVDRPEnabled: true
                    };

                    that._defineWIWGlobalVariableForCompass();

                    that.designExpPanel.core = new DesignEnvCore(that.designExpPanel);
                    that.designExpPanel.core.start().then(() => {
                        that.designExpPanel.listView = new DesignEnvListView(that.designExpPanel);
                        that.designExpPanel.listView.getDEContainer().inject(document.body);
                        document.getElementsByClassName("designenvpanel-main")[0].style.width = "350px";

                        that.designExpPanel.listView.getModels().getXSO().onPostAdd(that._assetSelectedInWebCB.bind(that));
                        that.designExpPanel.listView.getModels().getXSO().onPostRemove(that._assetSelectedInWebCB.bind(that));
                        GlobalUtils.init({ // This will initialise the platformServices so that platformId will be accessible.
                            initURL: true,
                            initWSAccess: true
                        }).then(() => {
                            window.isWebInWin = true;
                            if (typeof dscef === 'undefined') {
                                that.setDesignExpPhid(that.options.data.items);
                            }
                            that._deWIWReady();
                        });
                    });

                });
        },
        setDesignExpPhid: function (data) {
            console.log('setDesignExpPhId = ' + data);
            return this.designExpPanel.listView.addDesignEnv(data);
        },
        selectedAssetsInWin: function (data) {
            return this._assetSelectedInWinCB(data);
        },
        _deWIWReady: function () {
            // Send "deSidePanelWIWReady" message to Win
            var message = {
                deSidePanelWIWReady: true
            };

            message = JSON.stringify(message);
            if (typeof dscef !== 'undefined') {
                dscef.sendString(message);
                console.log('dscef.sendString = ' + message);
            } else {
                console.log('Error : dscef undefined');
            }
        },
        _assetSelectedInWebCB: function () {
            var that = this;
            var selectedAssetsArray = [];
            //1)  Get assets ids selected in DE side panel
            if (that.options.selectFromUI) {
                var selectedNodes = this.designExpPanel.listView.getModels().getSelectedNodes();
                for (var s = 0; s < selectedNodes.length; s++) {
                    if (selectedNodes[s].options.associatedRoot !== undefined)
                        selectedAssetsArray.push(selectedNodes[s].options.associatedRoot)
                }

                //2) Send "selectedAssetsInWeb" message to Win
                var message = {
                    selectedAssetsInWeb: selectedAssetsArray
                };

                message = JSON.stringify(message);
                if (typeof dscef !== 'undefined') {
                    dscef.sendString(message);
                    console.log('dscef.sendString = ' + message);
                } else {
                    console.log('Error : dscef undefined');
                }
                //    }
            }
        },
    /*    sendContextAssets: function (data) {
            var dePhid = data[0].objectId;
            var contextAssetsArray = [];
            require([
                'DS/DesignEnvironmentUX/ws/WSAccess'
            ], function (WSAccess) {
                return new Promise(function (resolve) {
                    //1) Get Context id from DE content WS call
                    WSAccess.getFolderContent({
                        folderId: dePhid
                    }).then(function (DEContentResponse) {
                        //Convert string to Object
                        let convertedDEContentResponse = (typeof DEContentResponse === "string") ? JSON.parse(DEContentResponse) : DEContentResponse;
                        var ctxPhid = undefined;
                        for (let DEContentElement of convertedDEContentResponse.content) {
                            if (DEContentElement.label === "Context") {
                                ctxPhid = DEContentElement.id;
                            }
                        }

                        //2) Get Context assets ids from Context content WS call
                        if (ctxPhid !== undefined) {
                            WSAccess.getFolderContent({
                                folderId: ctxPhid
                            }).then(function (response2) {
                                //Convert string to Object
                                let convertedResponse2 = (typeof response2 === "string") ? JSON.parse(response2) : response2;
                                for (let asset of convertedResponse2.content) {
                                    contextAssetsArray.push(asset.id)
                                }

                                //3) Send "contextAssets" message to Win
                                var contextAssetMessage = {
                                    contextAssets: contextAssetsArray
                                };

                                contextAssetMessage = JSON.stringify(contextAssetMessage);
                                if (typeof dscef !== 'undefined') {
                                    dscef.sendString(contextAssetMessage);
                                    console.log('dscef.sendString = ' + contextAssetMessage);
                                } else {
                                    console.log('Error : dscef undefined');
                                }
                            });
                        }
                    });
                });
            });
        },*/
        _assetSelectedInWinCB: function (param) {
            var that = this;

            var jsonParam = (typeof param === "string") ? JSON.parse(param) : param;
            var idsToSearch = jsonParam.selected;

            var matchedNodesList = that.designExpPanel.core.contextManager.app.listView.getModels().search({
                match: function (nodeInfos) {
                    if (idsToSearch && Array.isArray(idsToSearch)) {
                        return idsToSearch.includes(nodeInfos.nodeModel.options.associatedRoot);
                    }
                    else {
                        return nodeInfos.nodeModel.options.associatedRoot === idsToSearch;
                    }
                }
            });

            var xso = that.designExpPanel.listView.core.contextManager.app.listView.getModels().getXSO();
            that.options.selectFromUI = false;
            xso.empty(false);
            if (0 !== matchedNodesList.length) xso.add(matchedNodesList);
            that.options.selectFromUI = true;
        },
        _defineWIWGlobalVariableForCompass: function () {
            var that = this;
            if (!window["COMPASS_CONFIG"]) window["COMPASS_CONFIG"] = {};
            that._setSynchronizedMyAppsBaseUrl();
            window["COMPASS_CONFIG"].userId = "all";
            window["COMPASS_CONFIG"].lang = "en";
        },
        _setSynchronizedMyAppsBaseUrl: function () {
            if (typeof dscef !== 'undefined') {
                dscef.getMyAppsURL().then(function (url) {
                    window["COMPASS_CONFIG"].myAppsBaseUrl = url;
                })['catch'](function (reason) {
                    console.error('Failed to fetch MyApps URL: ' + reason);
                    window["COMPASS_CONFIG"].myAppsBaseUrl = null;
                });
            }
        }
    });
    return myDesignExpWintop;
});
