define('DS/MePreferencesUIElements/MePreferencesPageView',
    ['DS/MePreferencesUIBuilder/MePreferencesUIBuilder',
        'DS/MePreferencesUIElements/MePreferencesPageModelDataProvider',
        'DS/MePreferencesUIElements/MePreferencesSelectionModel',
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheHelper',
        'DS/UWPClientCode/I18n',
        'DS/WebappsUtils/WebappsUtils',
        'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils'
    ],
    function (MePreferencesUIBuilder, MePreferencesPageModelDataProvider, MePreferencesSelectionModel,
        MePreferencesClientCacheHelper, I18n, WebappsUtils,
        MePreferencesPlatformServicesUtils) {

        var preferenceValues = null;
        var enumValues = null;
        var rangeValues = null;
        var PREFERENCE_REQUEST_BODY = null;
        var ENUM_REQUEST_BODY = null;
        var RANGE_REQUEST_BODY = null;
        var ENUM_META_DATA_ENDPOINT = "/api/v1/preferences_metadata/enum_metadata";
        var RANGE_META_DATA_ENDPOINT = "/api/v1/preferences_metadata/range";
        var READ_PREFERENCE_WITH_LOCK_ENDPOINT = "/api/v1/preferences?getLockStateFlag=true";
        var ZIP_META_DATA_ENDPOINT = "/api/v1/preferences_panel/page_model";
        var DEFAULT_DATA_ENDPOINT = "/api/v1/preferences_metadata/defaults";
        var repostack = new Array();
        var serviceurl = null;

        var mePreferenceUIBuilderObj = new MePreferencesUIBuilder();
        // var mePreferencesModelObj = new MePreferencesModel();
        var mePreferencesPageModelDataProviderObj = new MePreferencesPageModelDataProvider();
        var mePreferencesClientCacheHelperObj = new MePreferencesClientCacheHelper();
        var defaultValues = null;

        var mePreferencesPageView = function () {
        };

        mePreferencesPageView.prototype.getMePreferencePageView = async function (url, appID, contentDiv, isAdminView, adminProfileValues, mePrefBetaOptionsObj, mePrefLangObj, tenantID) {
            var UIObj = {};
            var nlsObj;
            var iconObj
            serviceurl = url;

            loadCSS();

            function loadCSS() {
                var path = WebappsUtils.getWebappsBaseUrl() + "MePreferencesUIElements/MePreferencesUIDialog.css";
                var linkElem = new UWA.createElement('link', {
                    'rel': 'stylesheet',
                    'type': 'text/css',
                    'href': path
                });
                document.getElementsByTagName('head')[0].appendChild(linkElem);
            }

            //Get the current language 
            var currentLanguage = I18n.getCurrentLanguage();
            if (!currentLanguage)
                currentLanguage = en;

            if (appID === "3DSCommon.Language") {
                //Add Language UI call
                var languagePage = await mePrefLangObj.getLanguageContainer(url);
                //inject the content in the contentDiv
                if (languagePage != null)
                    languagePage.inject(contentDiv);
            }
            else if (appID === '3DSCommon.Options') {
                //add beta options UI call
                var betaOptionsPage = mePrefBetaOptionsObj.getBetaOptionsContainer();
                //inject the content in contentdiv
                if (betaOptionsPage != null)
                    betaOptionsPage.inject(contentDiv);

            }
            else {
                //get resources from page model API
                var response = await getResources(appID, currentLanguage);

                if (response) {
                    var ComJson = JSON.parse(response);
                    for (var i = 0; i < ComJson.mePrefUIData.length; i++) {
                        let appitem = ComJson.mePrefUIData[i];
                        let style = new Array();
                        // for (var j = 0; j < appitem.prefStyle.length; j++) {

                        if (appitem.prefStyle != "empty") {
                            for (let j = 0; j < appitem.prefStyle.length; j++) {
                                style.push(appitem.prefStyle[j].fileName.split("_")[0])
                                if (UIObj["UIModel"])
                                    UIObj["UIModel"] = [...UIObj["UIModel"], ...(JSON.parse(appitem.prefStyle[j].data))];
                                else
                                    UIObj["UIModel"] = JSON.parse(appitem.prefStyle[j].data);
                            }
                        }

                        if (appitem.nlsJSON != "empty") {
                            for (let j = 0; j < appitem.nlsJSON.length; j++) {
                                let nls = appitem.nlsJSON[j];
                                if (nls && style.includes((nls.fileName).split("_")[0])) {
                                    if (nlsObj)
                                        nlsObj = { ...nlsObj, ...(JSON.parse(nls.data)) }
                                    else
                                        nlsObj = JSON.parse(nls.data);
                                }
                            }
                        }
                        //}
                        if (iconObj)
                            iconObj = [...iconObj, ...appitem.icons]
                        else
                            iconObj = appitem.icons;
                    }

                    //Create Accordians based on UIJson.nbSections
                    var accordian = mePreferenceUIBuilderObj.createSections(UIObj, nlsObj);
                    accordian.inject(contentDiv);

                    //Get metadata content from server
                    var isSuccess = await getValuesFromServer(UIObj, isAdminView, adminProfileValues);

                    if (isSuccess) {

                        //CreateTreeDocument which acts as a temporary database for storing and saving responses in case of userpreference_view
                        // if (!isAdminView)
                        //     mePreferencesModelObj.createModel(UIObj, preferenceValues, enumValues, rangeValues);

                        //Create UI content visible to user
                        var appcontent = mePreferenceUIBuilderObj.createUI(UIObj, nlsObj, preferenceValues, enumValues, rangeValues, iconObj, isAdminView, MePreferencesSelectionModel, tenantID);
                        appcontent.inject(contentDiv);
                    }
                }
            }
            return contentDiv;
        }

        mePreferencesPageView.prototype.getDefaultValues = function () {
            if (defaultValues)
                return defaultValues;
        }

        async function getResources(appID, currentLanguage) {

            var version = await mePreferencesClientCacheHelperObj.getVersion(serviceurl);
            var url = null;

            if (version)
                url = serviceurl + ZIP_META_DATA_ENDPOINT + '?appIds="' + appID + '"&lang="' + currentLanguage + '"&v="' + version + '"';
            else
                url = serviceurl + ZIP_META_DATA_ENDPOINT + '?appIds="' + appID + '"&lang="' + currentLanguage + '"';

            return await mePreferencesPageModelDataProviderObj.getPageModel(url, appID, currentLanguage);
        }

        function getRepository(dataInfo) {
            if ((dataInfo.repository) && (dataInfo.repository !== "")) {
                return dataInfo.repository;
            }
            else {
                return repostack[repostack.length - 1];
            }
        }

        function createPreferenceRequestBody(UIJson) {
            var repoArray = new Array();
            var repoObj = null;

            for (var j = 0; j < Object.keys(UIJson.UIModel).length; j++) {
                var repoFlag = false;
                if (UIJson.UIModel[j].repository) {
                    repostack.push(UIJson.UIModel[j].repository);
                    repoFlag = true;
                }
                UIJson.UIModel[j].children.forEach(createRepo);
                if (repoFlag == true)
                    repostack.pop();
            }


            function addInRepoArray(dataInfo) {
                var temp = new Array();
                temp.push(dataInfo.name);

                var repoObject = {};
                repoObject["name"] = getRepository(dataInfo);
                repoObject["preferenceNames"] = temp;

                repoArray.push(repoObject);
            }

            function createRepo(dataInfo) {
                if (dataInfo.type.toLowerCase() === "preferenceitem") {
                    addInRepoArray(dataInfo);
                }
                else if (dataInfo.type.toLowerCase() === "preferencegroup") {
                    var repoFlag = false;
                    if (dataInfo.repository) {
                        repostack.push(dataInfo.repository);
                        repoFlag = true;
                    }
                    for (var i = 0; i < dataInfo.children.length; i++) {
                        createRepo(dataInfo.children[i]);
                    }
                    if (repoFlag == true)
                        repostack.pop();
                }
                else if (dataInfo.type.toLowerCase() === "tabledata") {
                    for (var i = 0; i < dataInfo.CellData.length; i++) {
                        createRepo(dataInfo.CellData[i]);
                    }
                }
            }

            if (repoArray.length > 0)
                repoObj = { "repositories": repoArray };
            return repoObj;
        }

        function createEnumRequestBody(preferenceValues) {
            var repoArray = new Array();
            var repoObj = null;

            for (var i = 0; i < Object.keys(preferenceValues.repositories).length; i++) {
                for (var j = 0; j < Object.keys(preferenceValues.repositories[i].preferences).length; j++) {
                    if (preferenceValues.repositories[i].preferences[j].datatype == "enum") {
                        var temp = new Array();
                        temp.push(preferenceValues.repositories[i].preferences[j].name);

                        var repoObject = {};
                        repoObject["name"] = preferenceValues.repositories[i].name;
                        repoObject["preferenceNames"] = temp;

                        repoArray.push(repoObject);
                    }
                }
            }

            if (repoArray.length > 0)
                repoObj = { "repositories": repoArray };
            return repoObj;

        }

        function createRangeRequestBody(preferenceValues) {
            var repoArray = new Array();
            var repoObj = null;

            for (var i = 0; i < Object.keys(preferenceValues.repositories).length; i++) {
                for (var j = 0; j < Object.keys(preferenceValues.repositories[i].preferences).length; j++) {
                    if (preferenceValues.repositories[i].preferences[j].datatype == "float" || preferenceValues.repositories[i].preferences[j].datatype == "double" || preferenceValues.repositories[i].preferences[j].datatype == "integer" || preferenceValues.repositories[i].preferences[j].datatype == "uint") {
                        var temp = new Array();
                        temp.push(preferenceValues.repositories[i].preferences[j].name);

                        var repoObject = {};
                        repoObject["name"] = preferenceValues.repositories[i].name;
                        repoObject["preferenceNames"] = temp;
                        repoArray.push(repoObject);
                    }
                }
            }

            if (repoArray.length > 0)
                repoObj = { "repositories": repoArray };
            return repoObj;

        }

        async function readPreferenceValues(PREFERENCE_REQUEST_BODY) {
            var completeURL = serviceurl + READ_PREFERENCE_WITH_LOCK_ENDPOINT;
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                },
                typeInfo: 'json'
            };
            return await MePreferencesPlatformServicesUtils.callRestAPI(PREFERENCE_REQUEST_BODY, completeURL, 'POST', options).then((responseObject) => {
                return responseObject[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        async function readPrefEnumMetadata(ENUM_REQUEST_BODY) {
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                },
                typeInfo: 'json'
            };
            var completeURL = serviceurl + ENUM_META_DATA_ENDPOINT;
            return await MePreferencesPlatformServicesUtils.callRestAPI(ENUM_REQUEST_BODY, completeURL, 'POST', options).then((responseObject) => {
                return responseObject[0];
            }).catch((errorInfo) => {
                return null;
            });
        }
        async function readRangeMetadata(RANGE_REQUEST_BODY) {
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                },
                typeInfo: 'json'
            };
            var completeURL = serviceurl + RANGE_META_DATA_ENDPOINT;
            return await MePreferencesPlatformServicesUtils.callRestAPI(RANGE_REQUEST_BODY, completeURL, 'POST', options).then((responseObject) => {
                return responseObject[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        async function readDefaultValues(DEFAULT_REQUEST_BODY) {
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                },
                typeInfo: 'json'
            };
            var completeURL = serviceurl + DEFAULT_DATA_ENDPOINT;
            return await MePreferencesPlatformServicesUtils.callRestAPI(DEFAULT_REQUEST_BODY, completeURL, 'POST', options).then((responseObject) => {
                return responseObject[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        async function createUserPreferenceValue(PREFERENCE_REQUEST_BODY) {

            let userPreferenceValues = await readPreferenceValues(PREFERENCE_REQUEST_BODY);
            let userSelectionModelValues = getUserModifiedValues();

            if (userSelectionModelValues != null) {

                for (let i = 0; i < userSelectionModelValues.repositories.length; i++) {
                    for (let j = 0; j < userPreferenceValues.repositories.length; j++) {
                        if (userSelectionModelValues.repositories[i].name === userPreferenceValues.repositories[j].name) {
                            for (let m = 0; m < userSelectionModelValues.repositories[i].preferences.length; m++) {
                                for (let n = 0; n < userPreferenceValues.repositories[j].preferences.length; n++) {
                                    if (userSelectionModelValues.repositories[i].preferences[m].name === userPreferenceValues.repositories[j].preferences[n].name) {
                                        let mValue = userSelectionModelValues.repositories[i].preferences[m].defValue ? userSelectionModelValues.repositories[i].preferences[m].defValue : userSelectionModelValues.repositories[i].preferences[m].value;
                                        if (mValue != undefined) {
                                            userPreferenceValues.repositories[j].preferences[n].value = mValue;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return userPreferenceValues;
        }

        async function createAdminPreferenceValue(PREFERENCE_REQUEST_BODY, adminProfileValues) {

            defaultValues = await readDefaultValues(PREFERENCE_REQUEST_BODY);
            //let adminProfileValues = adminProfileValues; //await readDefaultAdminProfileValues(); L87-
            let selectionModelValues = getAdminModifiedValues();
            let adminProfileValuesJson = JSON.parse(adminProfileValues);

            let modifiedValues = null;
            if (selectionModelValues && adminProfileValuesJson) {
                modifiedValues = [selectionModelValues, adminProfileValuesJson].reduce((result, current) => {
                    current.repositories.forEach((repo) => {
                        const existingRepoCount = result.repositories.findIndex((r) => r.name === repo.name);
                        if (existingRepoCount !== -1) {
                            const existingRepo = result.repositories[existingRepoCount];
                            repo.preferences.forEach((pref) => {
                                const existingPref = existingRepo.preferences.find((p) => p.name === pref.name);
                                if (!existingPref) {
                                    existingRepo.preferences.push({ ...pref });
                                }
                            })
                        }
                        else {
                            result.repositories.push({ ...repo });
                        }
                    });
                    return result;
                }, { "repositories": [] });

            }
            else {
                modifiedValues = adminProfileValuesJson;
            }

            let defaultValuesCombined = createAdminContentValues(defaultValues, modifiedValues);

            return defaultValuesCombined;
        }

        function createAdminContentValues(defaultValues, modifiedValues) {
            for (let i = 0; i < modifiedValues.repositories.length; i++) {
                for (let j = 0; j < defaultValues.repositories.length; j++) {
                    if (modifiedValues.repositories[i].name === defaultValues.repositories[j].name) {
                        for (let m = 0; m < modifiedValues.repositories[i].preferences.length; m++) {
                            for (let n = 0; n < defaultValues.repositories[j].preferences.length; n++) {
                                if (modifiedValues.repositories[i].preferences[m].name === defaultValues.repositories[j].preferences[n].name) {
                                    let mValue = modifiedValues.repositories[i].preferences[m].defValue ? modifiedValues.repositories[i].preferences[m].defValue : modifiedValues.repositories[i].preferences[m].value;
                                    if (mValue != undefined) {
                                        defaultValues.repositories[j].preferences[n].value = mValue;
                                    }
                                    defaultValues.repositories[j].preferences[n].lockState = modifiedValues.repositories[i].preferences[m].lockState;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return defaultValues;
        }

        function getUserModifiedValues() {
            //iterate over selectionModel if any preference present add/update in default Values 
            let selectionModel = MePreferencesSelectionModel.getSelectionModel();
            var repoArray = new Array();
            if (selectionModel.getNumberOfVisibleDescendants() > 0) {
                var reponame = null;
                selectionModel.processDescendants({
                    processNode: function (nodeInfos) {
                        if (nodeInfos && nodeInfos.nodeModel) {
                            let prefObject = {};
                            prefObject["name"] = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[1];
                            prefObject["datatype"] = nodeInfos.nodeModel.getAttributeValue("preferencetype");
                            if (nodeInfos.nodeModel.getAttributeValue("value") != undefined) {
                                prefObject["value"] = nodeInfos.nodeModel.getAttributeValue("value").toString();
                            }


                            reponame = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[0];
                            let prefArray = new Array();
                            prefArray.push(prefObject);
                            let repoObject = {};
                            repoObject["name"] = reponame;
                            repoObject["preferences"] = prefArray;

                            repoArray.push(repoObject);
                        }
                    },
                    treeTraversalOrder: "postOrder",
                });

                var userRepoObj = { "repositories": repoArray };
                return userRepoObj;
            }
            else
                return null;
        }

        function getAdminModifiedValues() {
            //iterate over selectionModel if any preference present add/update in default Values 
            let selectionModel = MePreferencesSelectionModel.getSelectionModel();
            var repoArray = new Array();
            if (selectionModel.getNumberOfVisibleDescendants() > 0) {
                var reponame = null;
                selectionModel.processDescendants({
                    processNode: function (nodeInfos) {
                        if (nodeInfos && nodeInfos.nodeModel) {
                            let prefObject = {};
                            prefObject["name"] = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[1];
                            prefObject["datatype"] = nodeInfos.nodeModel.getAttributeValue("preferencetype");
                            if (nodeInfos.nodeModel.getAttributeValue("value") != undefined) {
                                prefObject["value"] = nodeInfos.nodeModel.getAttributeValue("value").toString();
                            }
                            prefObject["lockState"] = nodeInfos.nodeModel.getAttributeValue("lockState") ? (nodeInfos.nodeModel.getAttributeValue("lockState")).toString() : "false";

                            reponame = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[0];
                            let prefArray = new Array();
                            prefArray.push(prefObject);
                            let repoObject = {};
                            repoObject["name"] = reponame;
                            repoObject["preferences"] = prefArray;

                            repoArray.push(repoObject);
                        }
                    },
                    treeTraversalOrder: "postOrder",
                });

                var repoObj = { "repositories": repoArray };
                return repoObj;
            }
            else
                return null;
        }

        async function getValuesFromServer(UIJson, isAdminView, adminProfileValues, mePreferencesSelectionModelObj) {

            var IsValueRetrieved = false;
            PREFERENCE_REQUEST_BODY = createPreferenceRequestBody(UIJson);
            if (PREFERENCE_REQUEST_BODY) {
                if (!isAdminView)

                    preferenceValues = await createUserPreferenceValue(PREFERENCE_REQUEST_BODY);
                // preferenceValues = await readPreferenceValues(PREFERENCE_REQUEST_BODY);
                else {
                    preferenceValues = await createAdminPreferenceValue(PREFERENCE_REQUEST_BODY, adminProfileValues, mePreferencesSelectionModelObj);
                }
                if (preferenceValues) {
                    ENUM_REQUEST_BODY = createEnumRequestBody(preferenceValues);
                    RANGE_REQUEST_BODY = createRangeRequestBody(preferenceValues);

                    if (ENUM_REQUEST_BODY) {
                        enumValues = await readPrefEnumMetadata(ENUM_REQUEST_BODY);
                    }
                    if (RANGE_REQUEST_BODY) {
                        rangeValues = await readRangeMetadata(RANGE_REQUEST_BODY);
                    }
                    IsValueRetrieved = true;
                }
            }
            return IsValueRetrieved;
        }


        /*function callRestAPI(requestBody, completeURL, methodType) {
            var dataInfo;
            var headersInfo;
            var typeInfo;
            if (requestBody) {
                dataInfo = JSON.stringify(requestBody);
                headersInfo = {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br'
                };
                typeInfo = 'json';
            }
            var newProm = new Promise(function (resolve, reject) {
                WAFData.authenticatedRequest(completeURL, {
                    method: methodType,
                    type: typeInfo,
                    data: dataInfo,
                    headers: headersInfo,
                    onComplete: function (responseObject) {
                        resolve(responseObject);
                    },
                    onFailure: function (errorObject) {
                        reject(errorObject);
                    }
                });
            });
            return newProm;
        }*/

        return mePreferencesPageView;
    });
