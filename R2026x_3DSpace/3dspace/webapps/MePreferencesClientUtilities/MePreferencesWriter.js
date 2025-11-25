define("DS/MePreferencesClientUtilities/MePreferencesWriter", [
    'DS/WAFData/WAFData',
    'DS/UWPClientCode/BetaOptions',
    'DS/UWPClientCode/I18n',
    'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils'
],
    function (WAFData,
        BetaOptions, I18n, MePreferencesPlatformServicesUtils) {
        "use strict";
        var MePreferencesWriterObj = function (mePrefBetaOptionsTab, mePreferencesLangObj) {
            this._mePrefBetaOptionObj = mePrefBetaOptionsTab;
            this._mePrefLangObj = mePreferencesLangObj;
        };

        var WRITE_PREFERENCE_ENDPOINT = "/api/v1/preferences";

        MePreferencesWriterObj.prototype.save = async function (serviceurl, selectionModel) {
            //var selectionModel = MePreferencesSelectionModel.getSelectionModel();
            var result = {};

            if (selectionModel.getNumberOfVisibleDescendants() > 0) {
                // Create an object to store the success/failure status for each platform ID

                var reqBody = await prepareRequestBody(selectionModel);
                if (reqBody) {
                    try {
                        await writepreferences(reqBody, serviceurl);
                        // If writepreferences succeeds, mark it as success
                    } catch (error) {
                        // If writepreferences fails, mark it as failure and log the error
                        console.error("Error saving preferences", error);
                    }
                }
            }

            // Return the object containing success/failure status for each platform ID
            return result;
        };

        MePreferencesWriterObj.prototype.saveBetaOptions = function () {
            var optionToggleValMap = this._mePrefBetaOptionObj.getBetaOptionToogleMap();
            if (optionToggleValMap != null && Object.entries(optionToggleValMap).length > 0) {
                for (var [funId, val] of Object.entries(optionToggleValMap)) {
                    BetaOptions.setBetaOptionsValues(funId, val.checkState);
                }
            }
        };

        MePreferencesWriterObj.prototype.saveLanguage = async function () {

            //Get the current language 
            var currentLanguage = this._mePrefLangObj.getCurrentLanguage();

            //Get Selected language
            var languageSelectedValue = this._mePrefLangObj.getSelectedLanguage();

            //If language settings are changed then update cookies and reload the browser tab
            if (currentLanguage != languageSelectedValue) {

                //Set MyProfile Language
                await MePreferencesPlatformServicesUtils.setMyProfileLang(languageSelectedValue);
                //Set cookies
                I18n.setCurrentLanguage(languageSelectedValue);
            }

        };


        async function writepreferences(requestBody, serviceurl) {
            var completeURL = "";

            completeURL = serviceurl + WRITE_PREFERENCE_ENDPOINT;
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                }
            };
            MePreferencesPlatformServicesUtils.callRestAPI(requestBody, completeURL, 'PUT', options).then((data) => {
                return data[0];
            }).catch((errorInfo) => {
                return null;
            });
        }

        /*function callRestAPI(requestBody, completeURL, methodType) {
            //To do in future: pass entire options object
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


        async function prepareRequestBody(selectionModel) {
            let userRepositories = [];
            selectionModel.processDescendants({
                processNode: async function (nodeInfos) {
                    if (nodeInfos && nodeInfos.nodeModel) {

                        let prefObject = {};
                        prefObject["name"] = nodeInfos.nodeModel
                            .getAttributeValue("label")
                            .split(".")[1];
                        var repoName = nodeInfos.nodeModel
                            .getAttributeValue("label")
                            .split(".")[0];

                        //Value
                        if (nodeInfos.nodeModel.getAttributeValue("value") != undefined) {
                            prefObject["value"] = nodeInfos.nodeModel
                                .getAttributeValue("value")
                                .toString();
                        }
                        let repository = userRepositories.find(
                            (repo) => repo.name === repoName
                        );

                        if (!repository) {
                            repository = {
                                name: repoName,
                                preferences: [],
                            };
                            userRepositories.push(repository);
                        }

                        repository.preferences.push(prefObject);
                    }
                },
                treeTraversalOrder: "postOrder",
            });

            let userRequestBody;
            // Create request body for the current user
            if (userRepositories) {
                userRequestBody = {
                    repositories: userRepositories,
                };
            } else {

                userRequestBody = null;
            }

            return userRequestBody;
        }

        return MePreferencesWriterObj;
    });
