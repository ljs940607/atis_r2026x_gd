define("DS/MePreferencesUIElements/MePreferencesAdminWidget", [
    "DS/Controls/Button",
    "DS/WebappsUtils/WebappsUtils",
    "DS/MePreferencesUIElements/MePreferencesMainView",
    "i18n!DS/MePreferencesUIElements/assets/nls/translation",
    "DS/Windows/Dialog",
    "DS/Windows/ImmersiveFrame",
    'DS/Notifications/NotificationsManagerUXMessages',
    'DS/Notifications/NotificationsManagerViewOnScreen',
    "DS/Utilities/Dom",
    'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils',
    "DS/MePreferencesUIElements/MePreferencesSelectionModel"

],
    function (WUXButton, WebappsUtils, MePreferencesMainView,
        mePrefWidgetTranslation, WUXDialog, WUXImmersiveFrame,
        NotificationsManagerUXMessages, WUXNotificationsManagerViewOnScreen, Dom, MePreferencesPlatformServicesUtils, MePreferencesSelectionModel) {
        "use strict";

        var SET_ADMIN_PROFILE_ENDPOINT = "/api/v1/admin_profile/preferences";
        var DEFAULT_ADMIN_PROFILE_DATA_ENDPOINT = "/api/v1/admin_profile/preferences";
        var DEFAULT_PROFILE_NAME = "Default";
        var OVERRIDE_GLOBAL_KEY = "overrideGlobal";
        var PROFILE_NAME_KEY = "profile_name";
        const removeImmEvent = new Event("ResetDialogImmFrameRemoved");
        var immersiveFrame = null;

        var serviceURL = "";
        var repoPrefNameObjAdminProfileMap = null;
        var repoPrefNameObjDefaultValueMap = null;
        var adminProfileValues = null;

        var widgetContentDiv = null;

        window.notifs = NotificationsManagerUXMessages;
        WUXNotificationsManagerViewOnScreen.setNotificationManager(window.notifs);
        WUXNotificationsManagerViewOnScreen.setStackingPolicy(1);

        /**
         * @private
         */
        function prepareDefaultValueRspMap(respMap) {

            if (repoPrefNameObjDefaultValueMap == null)
                repoPrefNameObjDefaultValueMap = {};

            //Create array of the incoming map
            var respMapArray = [];
            for (var i in respMap)
                respMapArray.push([respMap[i]])

            //iterate over all the appId's to create common pref value map
            for (let appCnt = 0; appCnt < respMapArray.length; appCnt++) {

                var repoArry = respMapArray[appCnt][0].repositories;
                var repoArryLen = 0;
                if (repoArry)
                    repoArryLen = repoArry.length;
                if (repoArryLen) {
                    for (var repoCnt = 0; repoCnt < repoArryLen; repoCnt++) {
                        var repoObj = repoArry[repoCnt];
                        var repoName = repoObj["name"];
                        var prefArray = repoObj["preferences"];
                        var prefArrayLen = 0;
                        if (prefArray)
                            prefArrayLen = prefArray.length;
                        if (prefArrayLen) {
                            for (var prefCnt = 0; prefCnt < prefArrayLen; prefCnt++) {
                                var prefObj = prefArray[prefCnt];
                                var prefName = prefObj["name"];
                                var val = prefObj["value"];
                                var mapKey = repoName + "." + prefName;
                                if (!repoPrefNameObjDefaultValueMap[mapKey])
                                    repoPrefNameObjDefaultValueMap[mapKey] = val;
                            }
                        }
                    }
                }

            }
        }

        /**
         * @private
         */
        function prepareAdminProfileRspMap(respObj) {

            repoPrefNameObjAdminProfileMap = {};
            var repoArry = respObj["repositories"];
            var repoArryLen = 0;
            if (repoArry)
                repoArryLen = repoArry.length;
            if (repoArryLen) {
                for (var repoCnt = 0; repoCnt < repoArryLen; repoCnt++) {
                    var repoObj = repoArry[repoCnt];
                    var repoName = repoObj["name"];
                    var prefArray = repoObj["preferences"];
                    var prefArrayLen = 0;
                    if (prefArray)
                        prefArrayLen = prefArray.length;
                    if (prefArrayLen) {
                        for (var prefCnt = 0; prefCnt < prefArrayLen; prefCnt++) {
                            var prefObj = prefArray[prefCnt];
                            var prefName = prefObj["name"];
                            var val = prefObj["defValue"];
                            var lockState = prefObj["lockState"];
                            var mapKey = repoName + "." + prefName;
                            var valObj = {};
                            valObj["value"] = val;
                            valObj["lockState"] = lockState;
                            repoPrefNameObjAdminProfileMap[mapKey] = valObj;
                        }
                    }
                }
            }
        }

        //P1 : Selection Model
        //P2 : Admin Profile Response
        //P3 : Default Preference Response 
        /**
         * @private
         */
        function prepareRequestBody(selectionModel) {
            var repoArray = new Array();
            //1.Get Admin Profile Response 
            var getProfileResponse = JSON.parse(adminProfileValues);
            //2.Prepare the Admin Profile Response map here : P2
            prepareAdminProfileRspMap(getProfileResponse);
            //3. Get Default Preferences Response
            var defaultPrefRespMap = MePreferencesMainView.getDefaultPrefValuesMap();
            //4.Prepare the Default Values Response map here : P3
            prepareDefaultValueRspMap(defaultPrefRespMap);
            if (selectionModel.getNumberOfVisibleDescendants() > 0) {
                selectionModel.processDescendants({
                    processNode: async function (nodeInfos) {
                        if (nodeInfos && nodeInfos.nodeModel) {
                            let prefObject = {};
                            prefObject["name"] = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[1];
                            var repoName = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[0];
                            var prefName = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[1];
                            var mapKey = repoName + "." + prefName;

                            //Value
                            if (nodeInfos.nodeModel.getAttributeValue("value") != undefined) {
                                prefObject["defValue"] = (nodeInfos.nodeModel.getAttributeValue("value")).toString();
                            }
                            else if (repoPrefNameObjAdminProfileMap[mapKey]) {
                                //if present in Admin Profile Map
                                var valObj = repoPrefNameObjAdminProfileMap[mapKey]
                                prefObject["defValue"] = valObj["value"];
                            }
                            else if (repoPrefNameObjDefaultValueMap[mapKey] != undefined) {
                                //if present in the Default pref map
                                var val = repoPrefNameObjDefaultValueMap[mapKey]
                                prefObject["defValue"] = val;
                            }
                            else {
                                prefObject["defValue"] = null;
                            }

                            //LockState
                            if (nodeInfos.nodeModel.getAttributeValue("lockState") != undefined) {
                                prefObject["lockState"] = (nodeInfos.nodeModel.getAttributeValue("lockState")).toString();
                            }
                            else {
                                // 1. Call getAdminProfile REST API  --> Done                                
                                // 2. prepare one map: <key,value> ==> <repoName.PrefName, Object> 
                                //      obj{ "locakState" : <lockState>, "value": <value> }
                                // 3. Parse response to retrieve lockState,value
                                if (repoPrefNameObjAdminProfileMap[mapKey]) {
                                    var valObj = repoPrefNameObjAdminProfileMap[mapKey]
                                    prefObject["lockState"] = valObj["lockState"];
                                }
                                else {
                                    //else false
                                    prefObject["lockState"] = "false";
                                }
                            }

                            let prefArray = new Array();
                            prefArray.push(prefObject);
                            var repoObject = {};
                            repoObject["name"] = (nodeInfos.nodeModel.getAttributeValue("label")).split(".")[0];
                            repoObject["preferences"] = prefArray;

                            repoArray.push(repoObject);
                        }
                    },
                    treeTraversalOrder: "postOrder",
                });

                var repoObj = { "repositories": repoArray };

                //Add existing profile preferences to the new ones: Old+New
                if (Object.keys(repoPrefNameObjAdminProfileMap).length) {

                    //Creating Map from New Preferences
                    var repoNamePrejObjListMap = {};
                    var repoArr = repoObj["repositories"];
                    var repoLen = 0;
                    if (repoArr)
                        repoLen = repoArr.length;
                    if (repoLen) {
                        for (var repoCnt = 0; repoCnt < repoLen; repoCnt++) {
                            var repoObj = repoArr[repoCnt];
                            var repoName = repoObj["name"];
                            var prefArr = repoObj["preferences"];
                            var prefArrLen = 0;
                            if (prefArr)
                                prefArrLen = prefArr.length;
                            if (prefArrLen) {
                                var prefObjList = [];
                                for (var prefCnt = 0; prefCnt < prefArrLen; prefCnt++) {
                                    var prefObj = prefArr[prefCnt];
                                    prefObjList.push(prefObj);
                                }
                                if (repoNamePrejObjListMap[repoName]) {
                                    var tempPrejList = repoNamePrejObjListMap[repoName];
                                    var combinedList = tempPrejList.concat(prefObjList);
                                    repoNamePrejObjListMap[repoName] = combinedList;
                                } else {
                                    repoNamePrejObjListMap[repoName] = prefObjList;
                                }
                            }
                        }
                    }

                    var modifiedRepoArr = [];
                    repoArr = getProfileResponse["repositories"];
                    repoLen = 0;
                    if (repoArr)
                        repoLen = repoArr.length;
                    if (repoLen) {
                        for (var repoCnt = 0; repoCnt < repoLen; repoCnt++) {
                            var repoObj = repoArr[repoCnt];
                            var repoName = repoObj["name"];
                            var oldPrefArr = repoObj["preferences"];

                            //When same repositories are present in both old and new list
                            if (repoNamePrejObjListMap[repoName]) {
                                var newPrefArr = repoNamePrejObjListMap[repoName];
                                //var combinedPrefs = oldPrefArr.concat(newPrefArr);

                                //Create map for old preferences
                                var combinedPrefs = [];
                                var prefNamePrefObjMap = {};
                                var oldPrefArrLen = 0;
                                if (oldPrefArr)
                                    oldPrefArrLen = oldPrefArr.length;
                                for (var prefCnt = 0; prefCnt < oldPrefArrLen; prefCnt++) {
                                    var prefObj = oldPrefArr[prefCnt];
                                    var prefName = prefObj["name"];
                                    prefNamePrefObjMap[prefName] = prefObj;
                                }

                                //First add all new preferences from selection Model, 
                                //since they're the latest/updated ones.
                                var newPrefArrLen = 0;
                                if (newPrefArr)
                                    newPrefArrLen = newPrefArr.length;
                                for (var prefCnt = 0; prefCnt < newPrefArrLen; prefCnt++) {
                                    var prefObj = newPrefArr[prefCnt];
                                    var prefName = prefObj["name"];
                                    if (prefNamePrefObjMap[prefName]) {
                                        delete prefNamePrefObjMap[prefName];
                                    }
                                    combinedPrefs.push(prefObj);
                                }

                                //Add remaining preferences from getAdminProfile response
                                if (Object.keys(prefNamePrefObjMap).length) {
                                    for (var tempKey in prefNamePrefObjMap) {
                                        var prefObj = prefNamePrefObjMap[tempKey];
                                        combinedPrefs.push(prefObj);
                                    }
                                }
                                repoObj["preferences"] = combinedPrefs;
                                delete repoNamePrejObjListMap[repoName];
                            }
                            //When repo exist only in the old list
                            modifiedRepoArr.push(repoObj);
                        }
                        // Add remaining repos which only exist in new list.
                        if (Object.keys(repoNamePrejObjListMap).length) {
                            for (var tempKey in repoNamePrejObjListMap) {
                                var repoName = tempKey;
                                var prefArray = repoNamePrejObjListMap[tempKey];
                                var repoObj = {};
                                repoObj["name"] = repoName;
                                repoObj["preferences"] = prefArray;
                                modifiedRepoArr.push(repoObj);
                            }
                        }
                        var finalrepoObj = { "repositories": modifiedRepoArr };
                        return finalrepoObj;
                    }
                }
                else {
                    //Only New
                    return repoObj;
                }
            }
            else {

                //Check if existing profiles are there, process accordingly: Only Old
                if (Object.keys(repoPrefNameObjAdminProfileMap).length) {
                    return getProfileResponse;
                }
                else // Keep the profile empty, as it is.
                    return null;
            }
        }


        /**
         * @private
         * @function readDefaultAdminProfileValues
         * @description Reads the default admin profile values by making a REST API call to the appropriate service URL, which returns an array of response object
         *              and response code. 
         * @returns {Promise<Object|null>} A promise that resolves to the default admin profile values object{responseObject[0]} respo, or `null` if an error occurs.
        */
        async function readDefaultAdminProfileValues() {

            var tenantID = await MePreferencesPlatformServicesUtils.getTenant();
            return await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (serviceURL) => {
                var completeURL = serviceURL + DEFAULT_ADMIN_PROFILE_DATA_ENDPOINT;

                return await MePreferencesPlatformServicesUtils.callRestAPI(null, completeURL, 'GET').then((responseObject) => {
                    return responseObject[0];
                }).catch((errorInfo) => {
                    return null;
                });
            });
        }

        /**
         * @private
         */
        function addOverrideGlobalFlag(url, val) {
            var fullUrl = url + OVERRIDE_GLOBAL_KEY + "=" + val;
            return fullUrl;
        }

        /**
         * @private 
         */
        function addProfileName(url, val) {
            var fullUrl = url + PROFILE_NAME_KEY + "=" + val;
            return fullUrl;
        }

        var adminWidget = {

            createWidgetUI: async function () {
                var tenantID = await MePreferencesPlatformServicesUtils.getTenant();
                await MePreferencesPlatformServicesUtils.getUserInfo(tenantID).then(async (userInfo) => {
                    if (userInfo.admin) {
                        return MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (serviceURL) => {

                            widgetContentDiv = createDiv("widget-content-div");
                            var isAdminView = true;

                            loadCSS();

                            function createDiv(style) {
                                return new UWA.createElement("div", {
                                    "class": style
                                });
                            }


                            function attachEnableSaveListeners() {
                                document.addEventListener("ModelDataUpdated", enableSave, { once: true });
                                document.addEventListener("langChange", enableSave, { once: true });
                                document.addEventListener("betaOptionUpdate", enableSave, { once: true });
                            }
                            function removeEnableSaveListeners() {
                                document.removeEventListener("ModelDataUpdated", enableSave, { once: true });
                                document.removeEventListener("langChange", enableSave, { once: true });
                                document.removeEventListener("betaOptionUpdate", enableSave, { once: true });
                            }
                            function enableSave() {
                                saveButton.disabled = false;
                            }

                            attachEnableSaveListeners();

                            // //Collection View Creation
                            // var collectionViewDiv = createDiv("collection-view-div");

                            // var myResponsiveTilesCollectionView = new WUXResponsiveTilesCollectionView().inject(collectionViewDiv);

                            // var TreedocModel = new TreeDocument();

                            // var node1 = new TreeNodeModel({
                            //     label: mePrefWidgetTranslation["CollectionViewLabel.Label"],
                            //     description: mePrefWidgetTranslation["CollectionViewDescription.Label"],
                            //     thumbnail: "checkbox-off",
                            //     icon: {
                            //         iconName: "pencil",
                            //         fontIconFamily: WUXManagedFontIcons.Font3DS
                            //     }
                            // });

                            // TreedocModel.addRoot(node1);
                            // myResponsiveTilesCollectionView.loadApplicativeModel(TreedocModel);

                            function loadCSS() {
                                var path = WebappsUtils.getWebappsBaseUrl() + "MePreferencesUIElements/MePreferencesAdminWidget.css";
                                var linkElem = new UWA.createElement('link', {
                                    'rel': 'stylesheet',
                                    'type': 'text/css',
                                    'href': path
                                });
                                document.getElementsByTagName('head')[0].appendChild(linkElem);
                            }


                            var buttonsDiv = createDiv("buttonDiv");

                            var saveButtonDiv = createDiv("saveButtonDiv");

                            var saveButton = new WUXButton({
                                disabled: true,
                                domId: "mep-admin-widget-save",
                                label: mePrefWidgetTranslation["SaveButton.Label"],
                                emphasize: "primary"
                            });

                            var me = this;
                            saveButton.addEventListener('buttonclick', async function (e) {


                                saveButton.disabled = true;
                                removeEnableSaveListeners();
                                attachEnableSaveListeners();

                                let saveResponseCode = await me.saveAdminProfile();
                                if (saveResponseCode == 200) {
                                    let saveSuccessNotif = {
                                        id: 'data-mep-po-notif-admin-save-success',
                                        level: 'info',
                                        title: mePrefWidgetTranslation["AdminSaveSuccessNotification.Label"],
                                        sticky: false
                                    }
                                    NotificationsManagerUXMessages.addNotif(saveSuccessNotif);
                                } else if (saveResponseCode == 206) {
                                    let partialSaveNotif = {
                                        id: 'data-mep-po-notif-admin-partial-save',
                                        level: 'info',
                                        title: mePrefWidgetTranslation["AdminPartialSaveNotification.Label"],
                                        sticky: false
                                    }
                                    NotificationsManagerUXMessages.addNotif(partialSaveNotif);
                                } else if (saveResponseCode == null) {
                                    let saveEmptyReqNotif = {
                                        id: 'data-mep-po-notif-admin-save-req-empty',
                                        level: 'error',
                                        title: mePrefWidgetTranslation["AdminSaveReqEmptyNotification.Label"],
                                        sticky: false
                                    }
                                    NotificationsManagerUXMessages.addNotif(saveEmptyReqNotif);
                                } else {
                                    let saveFailureNotif = {
                                        id: 'data-mep-po-notif-admin-save-failure',
                                        level: 'error',
                                        title: mePrefWidgetTranslation["AdminSaveFailureNotification.Label"],
                                        sticky: false
                                    }
                                    NotificationsManagerUXMessages.addNotif(saveFailureNotif);
                                }


                            });

                            var resetButtonDiv = createDiv("resetButtonDiv");

                            var resetButton = new WUXButton({
                                domId: "mep-admin-widget-reset",
                                label: mePrefWidgetTranslation["ResetButton.Label"],
                                emphasize: "secondary"
                            });

                            resetButton.addEventListener("buttonclick", async function (e) {
                                saveButton.disabled = true;
                                removeEnableSaveListeners();
                                attachEnableSaveListeners();
                                immersiveFrame = new WUXImmersiveFrame({
                                    identifier: "me-reset-dialog-immersive-frame"
                                });
                                var baseURL = WebappsUtils.getWebappsBaseUrl();
                                var resetDialogIcon = Dom.generateIcon({
                                    iconPath: baseURL + "MePreferencesUIElements/assets/icons/errorIcon.png",
                                    iconSize: {
                                        height: "26px",
                                        width: "26px"
                                    }
                                });

                                var resetMessage = new UWA.Element("span", {
                                    text: mePrefWidgetTranslation["reset.SubTitle"],
                                    class: "resetMessageSpan"
                                })

                                let resetDialogContentDiv = new UWA.createElement("div", {
                                    class: "resetDialogContentDiv"
                                });

                                resetDialogIcon.inject(resetDialogContentDiv);
                                resetMessage.inject(resetDialogContentDiv);
                                var confirmationDialog = new WUXDialog({
                                    width: 350,
                                    immersiveFrame: immersiveFrame,
                                    identifier: "mep-reset-confirmation-dialog",
                                    title: mePrefWidgetTranslation["reset.Title"],
                                    content: resetDialogContentDiv,
                                    activeFlag: false,
                                    modalFlag: true,
                                    position: {
                                        my: "center",
                                        at: "center",
                                        of: immersiveFrame
                                    },
                                    buttons: {
                                        Reset: new WUXButton({
                                            domId: "mep-reset-ok",
                                            emphasize: "primary",
                                            onClick: async function (e) {
                                                confirmationDialog.close();
                                                await me.resetAdminProfile();
                                                widget.dispatchEvent("onRefresh");
                                                removeImmersiveFrame();
                                            }
                                        }),
                                        Cancel: new WUXButton({
                                            domId: "mep-reset-cancel",
                                            onClick: function (e) {
                                                confirmationDialog.close();
                                                removeImmersiveFrame();
                                            }
                                        })
                                    }
                                });

                                confirmationDialog.elements._buttonsDiv.firstChild.setStyle("background-color", "#42a2da");
                                confirmationDialog.elements._buttonsDiv.firstChild.setStyle("color", "white");

                                if (confirmationDialog) {
                                    var confirmationDialogCloseButton = confirmationDialog.elements._closeButton;
                                    confirmationDialogCloseButton.addEventListener('click', function () {
                                        //Remove Immersive Frame
                                        removeImmersiveFrame();
                                    });
                                }
                                immersiveFrame.inject(document.body);

                            });

                            function removeImmersiveFrame() {
                                //Get all immersive frames present in the application.
                                var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
                                for (let it = 0; it < immFramesList.length; it++) {
                                    let immFrame = immFramesList[it];
                                    //Remove the immersive frame added for MePreferenceDialog 
                                    if (immFrame.dsModel.identifier == "me-reset-dialog-immersive-frame") {
                                        immFrame.remove();
                                        break;
                                    }
                                }
                                immersiveFrame = null;
                                document.dispatchEvent(removeImmEvent);
                            }

                            saveButton.inject(saveButtonDiv);
                            resetButton.inject(resetButtonDiv);
                            saveButtonDiv.inject(buttonsDiv);
                            resetButtonDiv.inject(buttonsDiv);


                            // collectionViewDiv.inject(widgetContentDiv);
                            adminProfileValues = await readDefaultAdminProfileValues();

                            var mainViewDiv = await MePreferencesMainView.createMainView(null, isAdminView, adminProfileValues, serviceURL);
                            mainViewDiv.inject(widgetContentDiv);
                            buttonsDiv.inject(widgetContentDiv);
                            return widgetContentDiv;
                        });
                    }
                    else {
                        widgetContentDiv.textContent = "403: Forbidden"; //if user not admin
                        return widgetContentDiv;
                    }
                })
                return widgetContentDiv;
            },

            saveAdminProfile: async function () {
                //1. getSelectionModel
                var selectionModel = MePreferencesSelectionModel.getSelectionModel();
                //2. Form request body
                var reqBody = prepareRequestBody(selectionModel);

                //if reqBody is null then keep the profile empty by skipping the API call.
                if (reqBody) {
                    //3. Call REST API
                    var tenantID = await MePreferencesPlatformServicesUtils.getTenant();
                    return await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (urlData) => {
                        if (urlData) {    //getServiceURL call success       
                            //Valid service url retrieved successfully. 
                            serviceURL = urlData;
                            var completeURL = serviceURL + SET_ADMIN_PROFILE_ENDPOINT + "?";
                            completeURL = addProfileName(completeURL, DEFAULT_PROFILE_NAME) + "&";
                            completeURL = addOverrideGlobalFlag(completeURL, "true");
                            let options = {
                                headersInfo: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            return await MePreferencesPlatformServicesUtils.callRestAPI(reqBody, completeURL, 'POST', options).then((responseObject) => {
                                return responseObject[1].status;
                            }).catch((errorInfo) => {
                                console.error("\n\t Error in save ", errorInfo);
                                return false;
                            });
                        }
                        else  //getServiceURL call fails
                            return null;
                    }).catch((errorInfo) => {
                        console.error("\n\t Error in save ", errorInfo);
                        return false;
                    });
                } else
                    return null;
            },

            resetAdminProfile: async function () {
                // immersiveFrame.inject(document.body);
                var repoArray = [];
                var reqBody = { "repositories": repoArray };
                var model = MePreferencesSelectionModel.getSelectionModel();

                model.empty();
                //3. Call REST API
                var tenantID = await MePreferencesPlatformServicesUtils.getTenant();
                return await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (urlData) => {
                    if (urlData) {    //getServiceURL call success       
                        //Valid service url retrieved successfully. 
                        serviceURL = urlData;
                        var completeURL = serviceURL + SET_ADMIN_PROFILE_ENDPOINT + "?";
                        completeURL = addProfileName(completeURL, DEFAULT_PROFILE_NAME) + "&";
                        completeURL = addOverrideGlobalFlag(completeURL, "true");
                        let options = {
                            headersInfo: {
                                'Content-Type': 'application/json'
                            }
                        };
                        return MePreferencesPlatformServicesUtils.callRestAPI(reqBody, completeURL, 'POST', options).then((responseObject) => {
                            return true;
                        }).catch((errorInfo) => {
                            console.error("\n\t Error in save ", errorInfo);
                            return false;
                        });
                    }
                    else  //getServiceURL call fails
                        return null;
                }).catch((errorInfo) => {
                    console.error("\n\t Error in save ", errorInfo);
                    return false;
                });

            },

            getWidgetContent: function () {
                return widgetContentDiv;
            },

            emptyMainDiv: function () {
                widgetContentDiv = null;
            }

        }

        return adminWidget;

    });
