define('DS/MePreferencesUIBuilder/MePreferencesCustomViewBuilder', [
    'DS/UWPClientCode/I18n',
    'DS/MePreferencesUIElements/MePreferencesPageModelDataProvider',
    'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheHelper',
    'DS/MePreferencesUIElements/MePreferencesCustomView',
    "DS/Windows/ImmersiveFrame",
    "DS/Windows/Dialog",
    "i18n!DS/MePreferencesUIElements/assets/nls/translation",
    'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils'
],
    function (I18n, MePreferencesPageModelDataProvider, MePreferencesClientCacheHelper,
        MePreferencesCustomView, WUXImmersiveFrame, WUXDialog,
        mePrefWidgetTranslation, MePreferencesPlatformServicesUtils) {
        //"use strict";

        var meprefurl = null;
        var PAGEMODEL_DATA_ENDPOINT = "/api/v1/preferences_panel/page_model";
        var READ_PREFERENCE_WITH_LOCK_ENDPOINT = "/api/v1/preferences?getLockStateFlag=true";
        var mePreferencesClientCacheHelperObj = new MePreferencesClientCacheHelper();
        var mePreferencesPageModelDataProviderObj = new MePreferencesPageModelDataProvider();
        var mePreferencesCustomViewObj = new MePreferencesCustomView();
        //var mePreferencesUtilsObj = new MePreferencesUtils();

        var MePreferenceCustomViewBuilder = {
            buildCustomView: async function (appID, data) {
                var repoName = data.variation.preference.repoName;
                var prefName = data.variation.preference.name;
                let currentLanguage = I18n.getCurrentLanguage();
                if (!currentLanguage)
                    currentLanguage = en;

                var tenantID = null;
                if(data && data.tenantID)
                    tenantID = data.tenantID;               
                else
                    tenantID = await MePreferencesPlatformServicesUtils.getTenant();

                await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (url) => {
                    meprefurl = url;
                });

                let PREFERENCE_REQUEST_BODY = createRequestBody(data.variation.preference);

                let jsonValue = await readPreferenceValues(PREFERENCE_REQUEST_BODY);

                let resources = await getResources(appID, currentLanguage);
                let resourcesParsed = JSON.parse(resources);
                let translationData = JSON.parse(
                    resourcesParsed.mePrefUIData[0].nlsJSON[0].data
                );

                let preferenceKey = `${JSON.parse(resourcesParsed.mePrefUIData[0].prefStyle[0].data[0])[0].name
                    }.${JSON.parse(resourcesParsed.mePrefUIData[0].prefStyle[0].data[0])[0]
                        .children[0].name
                    }`;
                let displayName = translationData[`${preferenceKey}.displayName`];

                var prefConfigData = await searchResource(resources, repoName, prefName);

                if (prefConfigData) {
                    var serviceName = prefConfigData.hostservice;
                    var endpoint = prefConfigData.endpoint;
                    let dlgHeight = prefConfigData.frameheight ? prefConfigData.frameheight : null;
                    let dlgWidth = prefConfigData.framewidth ? prefConfigData.framewidth : null;
                    var isAdminView = false;

                    var customDlg = await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, serviceName).then(async (url) => {
                        if (url) {
                            let completeURL = url + endpoint;//+ '?&lockState="' + jsonValue.lockState + '"&isAdminView="' + isAdminView + '"';
                            let isStandaloneUI = true;
                            let pref_id = repoName + '.' + prefName;
                            return mePreferencesCustomViewObj.createCustomDialog(completeURL, jsonValue.value, pref_id, jsonValue.lockState, isStandaloneUI, isAdminView, displayName, dlgHeight, dlgWidth, tenantID, data.variation.type);
                        }
                        else {
                            CreateErrorDialog();
                        }
                    });
                    return customDlg;
                }
            }

        };

        function CreateErrorDialog() {
            var immersiveFrame = new WUXImmersiveFrame({
                identifier: "me-error-dialog-immersive-frame"
            });

            var errorMessage = new UWA.Element("span", {
                text: mePrefWidgetTranslation["ErrorNotification.Label"],
                class: "errorMessageSpan"
            })

            let errorDialogContentDiv = new UWA.createElement("div", {
                class: "errorDialogContentDiv"
            });
            errorMessage.inject(errorDialogContentDiv);

            var errorDialog = new WUXDialog({
                width: 200,
                immersiveFrame: immersiveFrame,
                identifier: "mep-error-confirmation-dialog",
                title: mePrefWidgetTranslation["ErrorDialog.Title"],
                content: errorDialogContentDiv,
                activeFlag: false,
                modalFlag: true,
                position: {
                    my: "center",
                    at: "center",
                    of: immersiveFrame
                }
            });

            if (errorDialog) {
                errorDialog.addEventListener('close', function () {
                    //Remove Immersive Frame
                    removeImmersiveFrame();
                });
            }

            function removeImmersiveFrame() {
                //Get all immersive frames present in the application.
                var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
                for (let it = 0; it < immFramesList.length; it++) {
                    let immFrame = immFramesList[it];
                    //Remove the immersive frame added for MePreferenceDialog 
                    if (immFrame.dsModel.identifier == "me-error-dialog-immersive-frame") {
                        immFrame.remove();
                        break;
                    }
                }
                immersiveFrame = null;
                //  document.dispatchEvent(removeImmEvent);
            }

            immersiveFrame.inject(document.body);
        }

        function createRequestBody(preference) {
            var prefArray = new Array();
            var repoArray = new Array();

            prefArray.push(preference.name);

            var repoObject = {};
            repoObject["name"] = preference.repoName;
            repoObject["preferenceNames"] = prefArray;

            repoArray.push(repoObject);

            return { "repositories": repoArray };
        }


        async function readPreferenceValues(PREFERENCE_REQUEST_BODY) {
            var completeURL = meprefurl + READ_PREFERENCE_WITH_LOCK_ENDPOINT;
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                }
            };
            return await MePreferencesPlatformServicesUtils.callRestAPI(PREFERENCE_REQUEST_BODY, completeURL, 'POST', options).then((responseObject) => {
                return JSON.parse(responseObject[0]).repositories[0].preferences[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        async function getResources(appID, currentLanguage) {
            var version = await mePreferencesClientCacheHelperObj.getVersion(meprefurl);
            var url = null;

            if (version)
                url = meprefurl + PAGEMODEL_DATA_ENDPOINT + '?appIds="' + appID + '"&lang="' + currentLanguage + '"&v="' + version + '"';
            else
                url = meprefurl + PAGEMODEL_DATA_ENDPOINT + '?appIds="' + appID + '"&lang="' + currentLanguage + '"';

            return await mePreferencesPageModelDataProviderObj.getPageModel(url, appID, currentLanguage);
        }

        async function searchResource(resources, repoName, preferenceName) {
            let result = null;
            let UIObj = null;
            let ComJson = JSON.parse(resources);

            if (ComJson) {
                for (let i = 0; i < ComJson.mePrefUIData.length; i++) {
                    for (let j = 0; j < ComJson.mePrefUIData[i].prefStyle.length; j++) {
                        UIObj = { ...UIObj, ...(JSON.parse(ComJson.mePrefUIData[i].prefStyle[j].data)) };
                    }
                }
            }

            try {
                searchForObjectName(UIObj, repoName, preferenceName);
            } catch (error) {
                console.error("Error processing JSON data:", error);
            }

            function searchForObjectName(dataObj, targetRepo, targetPref, currentRepo) {
                for (let i = 0; i < Object.keys(dataObj).length && result === null; i++) {
                    currentRepo = dataObj[i].repository ? dataObj[i].repository : currentRepo;
                    const obj = dataObj[i];
                    const objName = typeof (obj.name) === 'string' ? obj.name : "";
                    if (objName.toLowerCase() === targetPref.toLowerCase() && currentRepo.toLowerCase() === targetRepo.toLowerCase()) {
                        result = obj;
                        break;
                    }
                    if (obj.children && obj.children.length > 0) {
                        searchForObjectName(obj.children, targetRepo, targetPref, currentRepo);
                    }
                }
                return;
            }

            return result;
        }

        return MePreferenceCustomViewBuilder;

    });
