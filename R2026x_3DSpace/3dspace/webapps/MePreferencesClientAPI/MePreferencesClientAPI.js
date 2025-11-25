define('DS/MePreferencesClientAPI/MePreferencesClientAPI',
    ['DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils',
        'DS/MePreferencesUIElements/MePreferencesModalDialog',
        'DS/MePreferencesUIBuilder/MePreferencesCustomViewBuilder',
        'DS/PlatformAPI/PlatformAPI'],
    function (MePreferencesPlatformServicesUtils, MePreferencesModalDialog,
        MePreferencesCustomViewBuilder, PlatformAPI) {

        var SERVICE_URL = "";
        var READ_WRITE_PREFERENCE_ENDPOINT = "/api/v1/preferences";
        var mePreferencesModalDialog = null;
        var mePreferencesCustomUIDialog = null;

        /**
         * @private
         */
        function sanitizeInput(rawInputArray) {

            var repoPrefMap = Object.create(Map);
            for (var cnt = 0; cnt < rawInputArray.length; cnt++) {
                var repoObj = rawInputArray[cnt];
                var repoName = repoObj['Repository'];
                var prefArray = repoObj['PreferenceNames'];
                if (repoPrefMap[repoName]) {
                    var currPrefArray = repoPrefMap[repoName];
                    currPrefArray = currPrefArray.concat(prefArray);
                    var seen = {};
                    var resultArray = [];
                    for (var track = 0; track < currPrefArray.length; track++) {
                        if (seen[currPrefArray[track]] !== 1) {
                            seen[currPrefArray[track]] = 1;
                            resultArray.push(currPrefArray[track]);
                        }
                    }
                    repoPrefMap[repoName] = resultArray;
                }
                else {
                    repoPrefMap[repoName] = prefArray;
                }

            }
            return repoPrefMap;
        }

        /**
         * @private
         */
        function prepareRequestForRead(repoPrefMap) {

            var repoArray = [];
            var outputRequestBody = {};
            var mapLength = Object.entries(repoPrefMap).length;
            for (var cnt = 0; cnt < mapLength; cnt++) {
                var repoObj = {}
                repoObj["name"] = Object.entries(repoPrefMap)[cnt][0];
                var prefArray = [];
                prefArray = Object.entries(repoPrefMap)[cnt][1];
                repoObj["preferenceNames"] = prefArray;
                repoArray.push(repoObj);
            }
            outputRequestBody = { "repositories": repoArray };
            return outputRequestBody;
        }

        var mePrefPublicAPI = {
            /**
              * @function readPreferences
              * @description This public api gives preference values from database.
              * @param {Array} - mandatory - Array of objects (Repository and preference names)
              * @returns {JSON} - Preference values
           */
            readPreferences: function (rawInputArray) {

                if (!rawInputArray.length) {
                    return Promise.reject("\n\t Input array cannot be empty ");
                }

                if (!SERVICE_URL) {

                    var newProm = new Promise(async function (resolve, reject) {

                        var tenantID = await MePreferencesPlatformServicesUtils.getTenant();
                        //Get MePreferences service URL
                        MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then((serviceURL) => {

                            //Form full URL
                            SERVICE_URL = serviceURL + READ_WRITE_PREFERENCE_ENDPOINT;

                            //Sanitize Input Array
                            var resultRepoPrefMap = sanitizeInput(rawInputArray);

                            //Prepare Read request body
                            var safeRequestBody = prepareRequestForRead(resultRepoPrefMap);

                            let options = {
                                headersInfo: {
                                    'Content-Type': 'application/json'
                                },
                                typeInfo: "json"
                            };

                            MePreferencesPlatformServicesUtils.callRestAPI(safeRequestBody, SERVICE_URL, 'POST', options).then((responseObject) => {
                                resolve(responseObject[0]);
                            }).catch((errorInfo) => {
                                reject(errorInfo);
                            });

                        }).catch((errorInfo) => {
                            reject(errorInfo);
                        });
                    });

                    return newProm;

                }
                else {
                    //Sanitize Input Array
                    var resultRepoPrefMap = sanitizeInput(rawInputArray);

                    //Prepare Read request body
                    var safeRequestBody = prepareRequestForRead(resultRepoPrefMap);

                    if (!safeRequestBody) {
                        return Promise.reject("\n\t PreferenceNames array cannot be empty ");
                    }

                    var newProm = new Promise(function (resolve, reject) {
                        let options = {
                            headersInfo: {
                                'Content-Type': 'application/json'
                            },
                            typeInfo: "json"
                        };
                        MePreferencesPlatformServicesUtils.callRestAPI(safeRequestBody, SERVICE_URL, 'POST', options).then((responseObject) => {
                            resolve(responseObject[0]);
                        }).catch((errorInfo) => {
                            reject(errorInfo);
                        });
                    });
                    return newProm;
                }
            },
            /**
               * @function getMePreferencesDialog
               * @description This public api gives MePreferencesDialog and can be called in command to generate MePreferencesUI. 
               * @param {string} - mandatory - app ID 
               * @param {object} - optional - js object with attributes - 1) type - customview/globalview/appview & 2) preference
               * @returns {object} - mepreferencesDialog object 
            */
            getMePreferencesDialog: async function (appID, data) {

                if (appID == null || (data && data.startBuildDlg === true)) {
                    // for standalone custom dialog 
                    if (data && data.variation && data.variation.type == 'customview') {
                        mePreferencesCustomUIDialog = await MePreferencesCustomViewBuilder.buildCustomView(appID, data);/*data.variation.preference*)*/
                        return mePreferencesCustomUIDialog;
                    }

                    // if already mePreferenceDialog exist return
                    if (mePreferencesModalDialog)
                        return mePreferencesModalDialog;


                    //for test
                    if (data && data.variation && data.variation.showCategoryView === false)
                        data.variation.showCategoryView = false;


                    // for dialog launched from topbar, type is globalview
                    if (!data.variation) {
                        data.variation = {
                            type: "appview",
                            showCategoryView: true
                        };
                    }

                    //if no other condition is satisfied then open application view
                    mePreferencesModalDialog = await MePreferencesModalDialog.getMePreferenceDialog(appID, data);/*data.variation);*/
                    return mePreferencesModalDialog;
                }
                else {

                    //Retrieve Tenant ID:
                    var tenantID = await MePreferencesPlatformServicesUtils.getTenant();

                    var sendData = {};
                    sendData["appID"] = appID;
                    sendData["tenantID"] = tenantID;
                    sendData["startBuildDlg"] = true;
                    sendData["variation"] = data;

                    //Temp: Need to integrate API in MePreferencesPlatformServicesUtils

                    PlatformAPI.publish('com.ds.mep:OnDialogCmd', sendData);
                    console.log("\n\t Notification com.ds.mep:OnDialogCmd published ");
                    return null;
                }
            }

        };

        document.addEventListener("ImmFrameRemoved", (e) => {
            mePreferencesModalDialog = null;
        });



        return mePrefPublicAPI;
    });
