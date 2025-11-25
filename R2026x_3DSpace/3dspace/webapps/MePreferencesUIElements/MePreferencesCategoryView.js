//EXAMPLE JS 

define('DS/MePreferencesUIElements/MePreferencesCategoryView',
    ["UWA/Core", "DS/TreeModel/TreeDocument",
        "DS/TreeModel/TreeNodeModel", "DS/DataGridView/DataGridView",
        "i18n!DS/MePreferencesUIElements/assets/nls/translation",
        "DS/DataGridView/DataGridViewLayout",
        "DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils",
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheMgr',
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheHelper',
        'DS/UWPClientCode/I18n',
        'DS/UWPClientCode/BetaOptions'
    ],
    function (UWA, TreeDocument, TreeNodeModel, DataGridView, mePrefUITranslation, DataGridViewLayout,
        MePreferencesPlatformServicesUtils, MePreferencesClientCacheMgr,
        MePreferencesClientCacheHelper, I18n, BetaOptions) {
        "use strict";

        var mePreferencesCategoryViewObj = function () { };

        var mePrefClientCacheMgr = new MePreferencesClientCacheMgr();
        var mePreferencesClientCacheHelperObj = new MePreferencesClientCacheHelper();
        var dataGridView = null;
        var model = null;
        var GET_CATEGORY_JSON_ENDPOINT = "/api/v1/preferences_panel/category_node";
        var mePrefServiceUrl = null;

        function getNameFromNLS(appId) {
            return mePrefUITranslation[appId];
        }

        function getAppIcon(icondata) {
            let iconObj;
            if (icondata && icondata.contains("base64,")) {
                iconObj = {
                    iconPath: icondata,
                    fontIconSize: '20px'
                };
            }
            else {
                iconObj = {
                    iconName: icondata,
                    fontIconSize: '20px'
                };
            }
            return iconObj;
        }

        async function processAppFamilyNode(child, nodeObj, appInfoArray, isAdminView) {
            if ((child.id).contains("3DSApps.") && child.id != '3DSApps.SWXApps_AP') { //guard conditions for solidworks app family
                var linkedAppsList = new Array();
                var isAppFamilyAccessible = false;
                if (child.linkedApps) {
                    for (let k = 0; k < child.linkedApps.length; k++) {
                        linkedAppsList.push(child.linkedApps[k]);
                        await MePreferencesPlatformServicesUtils.getAppInfo.call(this, child.linkedApps[k], isAdminView).then((appInfo) => {
                            isAppFamilyAccessible = true;
                            return;
                        }).catch((errorInfo) => {
                            return null;
                        });
                    }
                } else
                    return null;

                if (isAppFamilyAccessible) {
                    appInfoArray.push(nodeObj);
                }
            }
        }

        async function createAppsArray(appInfoArray, categoryJson, isAdminView) {

            var appIDToNodeObjMap = {};
            var appsFamilyPartiallyprocMap = {};
            for (let i = 0; i < categoryJson.categories.length; i++) {

                if (categoryJson.categories[i].type === "App") {

                    for (let j = 0; j < categoryJson.categories[i].children.length; j++) {

                        if ((categoryJson.categories[i].children[j].id).contains("3DSApp.")) {

                            if (isAdminView) {
                                if ((categoryJson.categories[i].children[j].id != '3DSApp.SWXXDWI_AP') &&  //guard conditions for solidworks app
                                    (categoryJson.categories[i].children[j].id != '3DSApp.SWXXDWI_AP.SWPLUS') &&
                                    (categoryJson.categories[i].children[j].id != '3DSApp.SWXXDWI_AP.CATIAPLUS') &&
                                    (categoryJson.categories[i].children[j].id != '3DSApp.SWXXDWI_AP.3DEXPPLUS')) {

                                    await MePreferencesPlatformServicesUtils.getAppInfo.call(this, categoryJson.categories[i].children[j].id, isAdminView).then((appInfo) => {
                                        var nodeObj = {};
                                        nodeObj.title = appInfo.title;
                                        nodeObj.icon = appInfo.icon;
                                        nodeObj.appId = categoryJson.categories[i].children[j].resDir;
                                        nodeObj.sortName = appInfo.title;
                                        nodeObj.type = categoryJson.categories[i].type;
                                        nodeObj.id = categoryJson.categories[i].children[j].id;
                                        appInfoArray.push(nodeObj);
                                    }).catch((errorInfo) => {
                                        return null;
                                    });
                                }
                            }
                            else {
                                //Make list of all apps
                                if (!appIDToNodeObjMap[categoryJson.categories[i].children[j].id.split(".")[1]])
                                    //Only present in the App
                                    appIDToNodeObjMap[categoryJson.categories[i].children[j].id.split(".")[1]] = {
                                        'families': null,
                                        'jsonInfo': categoryJson.categories[i].children[j]
                                    };
                                else {
                                    //console.log("App is present in the family, so retain family information and append JsonInfo.", categoryJson.categories[i].children[j].id.split(".")[1]);
                                    //App is present in the family, so retain family information and append JsonInfo.
                                    var tempObj = appIDToNodeObjMap[categoryJson.categories[i].children[j].id.split(".")[1]];
                                    appIDToNodeObjMap[categoryJson.categories[i].children[j].id.split(".")[1]] = {
                                        'families': tempObj.families,
                                        'jsonInfo': categoryJson.categories[i].children[j]
                                    };
                                }
                            }

                        }
                    } // End for loop
                    //Call getAppsInfo Options
                    var isItAdmin = isAdminView;
                    if (!isAdminView) {
                        await MePreferencesPlatformServicesUtils.getAppsInfo().then((appsInfoData) => {

                            if (appsInfoData) {

                                for (var index = 0; index < appsInfoData.length; index++) {
                                    var appObj = appsInfoData[index]._attributes;
                                    var appInfo = null;
                                    if (appObj) {
                                        var platformID = appObj["platformId"];
                                        if ((platformID === undefined && (isItAdmin && appObj.error))
                                            || (platformID != undefined && (isItAdmin || appObj.error === ""))) {
                                            appInfo = {
                                                "title": appObj.title,
                                                "icon": appObj.icon
                                            };
                                        } else {
                                            appInfo = null;
                                        }
                                    }
                                    if (appInfo != null && appObj.id && appIDToNodeObjMap[appObj.id]) {

                                        //Process nodes of type 'App'
                                        if (appIDToNodeObjMap[appObj.id].jsonInfo && appIDToNodeObjMap[appObj.id].jsonInfo.resDir && appIDToNodeObjMap[appObj.id].jsonInfo.id) {
                                            var nodeObj = {};
                                            nodeObj.title = appInfo.title;
                                            nodeObj.icon = appInfo.icon;
                                            if (appIDToNodeObjMap[appObj.id] && appIDToNodeObjMap[appObj.id].jsonInfo && appIDToNodeObjMap[appObj.id].jsonInfo.resDir)
                                                nodeObj.appId = appIDToNodeObjMap[appObj.id].jsonInfo.resDir;
                                            nodeObj.sortName = appInfo.title;
                                            nodeObj.type = "App";//categoryJson.categories[i].type;
                                            if (appIDToNodeObjMap[appObj.id] && appIDToNodeObjMap[appObj.id].jsonInfo && appIDToNodeObjMap[appObj.id].jsonInfo.id)
                                                nodeObj.id = appIDToNodeObjMap[appObj.id].jsonInfo.id;
                                            appInfoArray.push(nodeObj);
                                        }
                                        //console.log("\n\t AppTitle :", appInfo.title);
                                        //console.log("\n\t AppID : ", appObj.id);
                                        //Check in the family
                                        if (Object.keys(appsFamilyPartiallyprocMap).length > 0) {
                                            var familyArr = appIDToNodeObjMap[appObj.id].families;
                                            //Family Array present
                                            if (familyArr && familyArr.length > 0) {
                                                //Activate all families
                                                for (var familyArrIndex = 0; familyArrIndex < familyArr.length; familyArrIndex++) {
                                                    var familyMapKey = familyArr[familyArrIndex];
                                                    if (appsFamilyPartiallyprocMap[familyMapKey] && appsFamilyPartiallyprocMap[familyMapKey].processNode) {
                                                        var tempNodeObj = appsFamilyPartiallyprocMap[familyMapKey].processNode;
                                                        //Add Object in the appInfoArray
                                                        appInfoArray.push(tempNodeObj);
                                                        //Once family node is activated, there is no need to keep that info, so remove it
                                                        delete appsFamilyPartiallyprocMap[familyMapKey];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }// Done Processing all apps from getAppsInfo 
                            }

                        }).catch((errorInfo) => {
                            return null;
                        });
                    }//
                }
                else {
                    for (let j = 0; j < categoryJson.categories[i].children.length; j++) {

                        var icondata = categoryJson.categories[i].children[j].fontIconName || categoryJson.categories[i].children[j].icon;
                        var iconObj = getAppIcon(icondata);

                        var nodeObj = {};
                        nodeObj.title = categoryJson.categories[i].children[j].displayName;
                        nodeObj.icon = iconObj;
                        nodeObj.sortName = categoryJson.categories[i].children[j].displayNameEn;
                        nodeObj.type = categoryJson.categories[i].type;
                        nodeObj.id = categoryJson.categories[i].children[j].id;
                        nodeObj.appId = categoryJson.categories[i].children[j].resDir;

                        if (categoryJson.categories[i].type === "AppFamily") {
                            if (isAdminView)
                                await processAppFamilyNode(categoryJson.categories[i].children[j], nodeObj, appInfoArray, isAdminView);
                            else if (!isAdminView && categoryJson.categories[i].children[j].id != '3DSApps.SWXApps_AP') {
                                //Build AppFamily Map.
                                appsFamilyPartiallyprocMap[categoryJson.categories[i].children[j].id] = {
                                    'isItActivate': false,
                                    'processNode': nodeObj
                                };
                                //Add Linked Apps from the family in the app Map
                                var linkedApps = categoryJson.categories[i].children[j].linkedApps;
                                if (linkedApps) {
                                    for (var index = 0; index < linkedApps.length; index++) {
                                        if (!appIDToNodeObjMap[linkedApps[index].split('.')[1]]) {
                                            //New app
                                            var familyArr = [];
                                            familyArr.push(categoryJson.categories[i].children[j].id);
                                            appIDToNodeObjMap[linkedApps[index].split('.')[1]] = {
                                                'families': familyArr,
                                                'jsonInfo': null
                                            };
                                        } else {
                                            //It is possible that app might be present in the multiple families.
                                            //Here retain old family information.
                                            var tempFamilyArr = appIDToNodeObjMap[linkedApps[index].split('.')[1]].families;
                                            //Add new familyInfo In the exsisting family Array
                                            tempFamilyArr.push(categoryJson.categories[i].children[j].id);
                                            appIDToNodeObjMap[linkedApps[index].split('.')[1]] = {
                                                'families': tempFamilyArr,
                                                'jsonInfo': null
                                            };
                                        }
                                    }
                                }
                            }
                        }
                        else if (categoryJson.categories[i].type === "Common") {
                            appInfoArray.push(nodeObj);
                        }
                    }
                }
            }
        }

        mePreferencesCategoryViewObj.prototype.createCategoryUI = async function (isAdminView, appID, variation, tenantID) {
            var appInfoArray = null;

            //Parameter variation.type will indicate whether it is a globalView/customView/appView
            var DGVDiv = new UWA.Element("div", {
                'class': 'category-content-div'
            });

            if (!tenantID)
                tenantID = await MePreferencesPlatformServicesUtils.getTenant();

            return await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (serviceURL) => {
                mePrefServiceUrl = serviceURL;
                if (serviceURL) {
                    appInfoArray = new Array();

                    var categoryInfo = await getCategoryJson(serviceURL);

                    var categoryJson = JSON.parse(categoryInfo);

                    await createAppsArray(appInfoArray, categoryJson, isAdminView);

                    if (appInfoArray != null) {

                        appInfoArray = await sortAppsArray(appInfoArray, isAdminView, variation);

                        model = new TreeDocument();

                        model.prepareUpdate();

                        appInfoArray.forEach(function (dataInfo) {

                            if (dataInfo) {
                                var node = new TreeNodeModel({
                                    label: dataInfo.title,
                                    grid: dataInfo,
                                    appId: dataInfo.appId,
                                    icon: dataInfo.icon,
                                    sortName: dataInfo.sortName,
                                    type: dataInfo.type,
                                    id: dataInfo.id
                                });
                                model.addRoot(node);
                            }

                        });

                        model.pushUpdate();

                        var cols = [{
                            dataIndex: "tree",
                            typeRepresentation: "string",
                            editionPolicy: "EditionOnClick",
                            getCellSemantics: function (cellInfos) {
                                if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("icon")) {
                                    var iconValue = cellInfos.nodeModel.getAttributeValue("icon");
                                    return {
                                        icon: iconValue
                                    };
                                } else {
                                    var Icon = cellInfos.nodeModel.getAttributeValue("icon");
                                    return {
                                        icon: Icon
                                    }
                                }
                            },
                            getCellClassName: function (cellInfos) {
                                if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("id")) {
                                    var className = "mep-admin-widget-node-appID-" + cellInfos.nodeModel.getAttributeValue("id");
                                    return className;
                                }
                            }
                        }];

                        await createCategoryDataGridView(model, cols);

                        dataGridView.inject(DGVDiv);

                        return DGVDiv;
                    }
                    return null;

                }

            });
        }

        async function createCategoryDataGridView(model, cols) {
            let layoutOptions = {
                columnsHeader: false,
                rowsHeader: false
            }

            dataGridView = new DataGridView({
                identifier: 'mep-categoryView',
                treeDocument: model,
                columns: cols,
                cellSelection: 'none',
                rowSelection: 'single',
                selectionStyle: 'lightSelectionEdging',
                showSelectionCheckBoxesFlag: false,
                showRowIndexFlag: false,
                showAlternateBackgroundFlag: false,
                showRowHeaderBackgroundFlag: false,
                showRowBorderFlag: false,
                showColumnBorderFlag: false,
                columnsHeader: false,
                layout: new DataGridViewLayout(layoutOptions)
            });

            dataGridView.selectionBehavior.unselectAllOnEmptyArea = false;

            const nodeSelectionChangeEvent = new Event("nodeSelectionChange");
            nodeSelectionChangeEvent.detail = {};

            function sendEvent(data) {
                nodeSelectionChangeEvent.detail = data;
                document.dispatchEvent(nodeSelectionChangeEvent);
            }

            var nodesXSO = dataGridView.getNodesXSO();
            nodesXSO.onPostAdd(function (rowClicked) {
                rowClicked.forEach(function (xsoElement) {
                    xsoElement.addEventListener("buttonclick", xsoElement._options.appId);
                    let dataObj = {
                        appId: xsoElement._options.appId,
                        label: xsoElement._options.label
                    }
                    sendEvent(dataObj);
                })
            });
        }

        function sortAppsArray(appInfoArray, isAdminview, variation) {
            let languageObject = appInfoArray.find(function (item) {
                return (item.id).toLowerCase() === '3dscommon.language';
            });

            let betaOptionsObject = null;
            var isOptionsActive = BetaOptions.getSupportedBetaOptions();
            if (isOptionsActive != null && isOptionsActive.length > 0) {
                betaOptionsObject = {
                    "title": getNameFromNLS("3DSCommon.Options") || "Options",
                    "icon": {
                        "iconName": "tools",
                        "fontIconSize": "20px"
                    },
                    "appId": "3DSCommon.Options",
                    "type": "Common"
                }
            }

            let commonObjects = appInfoArray.filter(function (item) {
                return (item.type).toLowerCase() === 'common' && (item.id).toLowerCase() !== '3dscommon.language';
            });

            let appObjects = appInfoArray.filter(function (item) {
                return (item.type).toLowerCase() === 'app' || (item.type).toLowerCase() === 'appfamily';
            });

            appObjects.sort(function (node1, node2) {
                let appNode1 = node1.sortName || node1.title || "";
                let appNode2 = node2.sortName || node2.title || "";
                return appNode1.localeCompare(appNode2);
            });

            if (!isAdminview && betaOptionsObject)
                appInfoArray = [languageObject].concat(betaOptionsObject).concat(commonObjects).concat(appObjects);
            else if (!isAdminview)
                appInfoArray = [languageObject].concat(commonObjects).concat(appObjects);
            else
                appInfoArray = (commonObjects).concat(appObjects);

            return appInfoArray;
        }

        async function getCategoryJson(serviceURL) {

            var version = await mePreferencesClientCacheHelperObj.getVersion(serviceURL);

            var currentLanguage = I18n.getCurrentLanguage();
            if (!currentLanguage)
                currentLanguage = en;
            var url = null;

            if (version)
                url = serviceURL + GET_CATEGORY_JSON_ENDPOINT + '?&lang="' + currentLanguage + '"&v="' + version + '"';
            else
                url = serviceURL + GET_CATEGORY_JSON_ENDPOINT + '?&lang="' + currentLanguage + '"';


            var data = await mePrefClientCacheMgr.retrieveCache(url);
            if (!data) {
                data = await getCategoryJsonFromServer(url);
                if (data) {
                    let newresponse = new Response(data);
                    if (newresponse && url.contains("&v")) {
                        let cache = await caches.open('MePreferences');
                        let keys = await cache.keys();
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i].url;
                            if (key) {
                                await mePrefClientCacheMgr.deleteCache(key);
                            }
                        }
                        await mePrefClientCacheMgr.addCache(url, newresponse);
                    }
                    return data;
                }
            }
            return data;
        }

        async function getCategoryJsonFromServer(url) {
            return await MePreferencesPlatformServicesUtils.callRestAPI(null, url, 'GET').then((responseObject) => {
                return responseObject[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        function compareValues(appID1, appID2) {
            if (Array.isArray(appID1) && Array.isArray(appID2)) {
                if (appID1.length !== appID2.length)
                    return false;

                for (let i = 0; i < appID1.length; i++) {
                    if (appID1[i].toLowerCase() !== appID2[i].toLowerCase())
                        return false;
                }
                return true;
            }

            if (typeof appID1 === 'string' && typeof appID2 === 'string') {
                return appID1.toLowerCase() === appID2.toLowerCase();
            }

            return false;
        }

        async function getAppIDsFromCache(isAdminview) {
            const categoryData = await getCategoryJson(mePrefServiceUrl);
            if (categoryData) {
                const parsedData = JSON.parse(categoryData);
                const categoryArray = parsedData.categories;

                const commonCategory = categoryArray.find((obj) => obj.type === "Common");
                if (commonCategory) {
                    var resDir = null;
                    const childrenArray = commonCategory.children;
                    if (isAdminview) {
                        let firstNonLangNode = childrenArray.find((obj) => obj.id !== "3DSCommon.Language");
                        resDir = firstNonLangNode.resDir;

                    } else {
                        let displayObj = childrenArray[0];
                        resDir = displayObj.resDir;

                    }
                    return resDir;
                }
            }
            return null;
        }

        mePreferencesCategoryViewObj.prototype.selectAppNode = async function (appID, isAdminview) {

            if (!appID & !isAdminview)
                appID = await getAppIDsFromCache(isAdminview);
            if (!appID & isAdminview) {
                var appIdArr = await getAppIDsFromCache(isAdminview);
                appID = appIdArr;
            }


            let selectedNode = null;
            model.search({
                match: function (cellInfos) {
                    if (compareValues(cellInfos.nodeModel.getAttributeValue("appId"), appID)) {
                        selectedNode = cellInfos.nodeModel;
                        dataGridView.selectNodeModel(selectedNode);
                    }
                }
            });

        }


        return mePreferencesCategoryViewObj;
    });
