define("DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils", [
    "DS/PlatformAPI/PlatformAPI",
    "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices",
    "DS/WAFData/WAFData"
],
    function (PlatformAPI, i3DXCompassPlatformServices, WAFData) {
        "use strict";

        /**
         * @private
         * */
        function loadServiceURL(platformId, serviceName) {
            let timeout;
            return new Promise((resolve, reject) => {
                timeout = setTimeout(() => {
                    reject(new Error('Request timed out'));
                }, 1000);

                if (platformId) {
                    i3DXCompassPlatformServices.getServiceUrl({
                        serviceName: serviceName,
                        platformId: platformId,
                        onComplete: function (urlData) {
                            clearTimeout(timeout);
                            resolve(urlData);
                        },
                        onFailure: function (errorInfo) {
                            clearTimeout(timeout);
                            reject(errorInfo);
                        }
                    });
                }
                else {
                    i3DXCompassPlatformServices.getServiceUrl({
                        serviceName: serviceName,
                        onComplete: function (urlData) {
                            clearTimeout(timeout);
                            resolve(urlData);
                        },
                        onFailure: function (errorInfo) {
                            clearTimeout(timeout);
                            reject(errorInfo);
                        }
                    });
                }
            });
        }

        var mePreferencesUtilsObj = {

            getServiceUrl: async function (tenantID, serviceName) {
                var newProm = new Promise(function (resolve, reject) {
                    loadServiceURL(tenantID, serviceName).then((urlData) => {
                        if (Array.isArray(urlData)) {
                            let element = "url";
                            urlData.forEach(Obj => {
                                if (Obj.hasOwnProperty(element)) {
                                    urlData = Obj[element];
                                    resolve(urlData);
                                }
                            });
                        } else
                            resolve(urlData);
                    }).catch((errorInfo) => {
                        reject(errorInfo);
                    });
                });
                return newProm;
            },

            callRestAPI: async function (requestBody, completeURL, methodType, options) {
                //To do in future: pass entire options object
                var dataInfo;
                var typeInfo;
                var headersInfo;

                if (requestBody)
                    dataInfo = JSON.stringify(requestBody);
                if (options && options.typeInfo)
                    typeInfo = options.typeInfo;
                if (options && options.headersInfo)
                    headersInfo = options.headersInfo

                var newProm = new Promise(function (resolve, reject) {
                    WAFData.authenticatedRequest(completeURL, {
                        method: methodType,
                        data: dataInfo,
                        headers: headersInfo,
                        type: typeInfo,
                        onComplete: function (responseObject, headers, respCode) {
                            var promArr = [responseObject, respCode, headers];
                            resolve(promArr);
                        },
                        onFailure: function (errorObject) {
                            reject(errorObject);
                        }
                    });
                });
                return newProm;
            },

            getTenant: async function () {
                let tenantID = null;
                try {
                    tenantID = PlatformAPI.getWidgetTenant();
                    if (tenantID == undefined || tenantID == null)
                        tenantID = PlatformAPI.getTenant();
                }
                catch (e) {
                    tenantID = null;
                }
                return tenantID;
            },

            setMyProfileLang: async function (selectedLang) {
                var passportURL = PlatformAPI.getApplicationConfiguration('app.urls.passport');
                if (passportURL) {
                    var endPoint;
                    if (passportURL.slice(-1) === '/')
                        endPoint = "my-profile/update/language/" + selectedLang;
                    else
                        endPoint = "/my-profile/update/language/" + selectedLang;
                    var completeURL = passportURL + endPoint;
                    return await this.callRestAPI(null, completeURL, 'POST').then((responseObject) => {
                        var rep = JSON.parse(responseObject[0]);
                        if (rep.code == 0)
                            return true;
                        else
                            return false;
                    }).catch((errorInfo) => {
                        return false;
                    });
                }
                else
                    return false;
            },

            callGetPlatformServices: async function () {

                // Create a promise to fetch platfromId's
                var prom = new Promise(function (resolve, reject) {
                    i3DXCompassPlatformServices.getPlatformServices({
                        onComplete: function (data) {
                            resolve(data);
                        },
                        onFailure: function (errorInfo) {
                            reject(errorInfo);
                        }
                    });
                });

                return prom;
            },

            getUserInfo: async function (tenantID) {

                var prom = new Promise(function (resolve, reject) {
                    i3DXCompassPlatformServices.getUser({
                        platformId: tenantID,
                        onComplete: function (data) {
                            resolve(data);
                        },
                        onFailure: function (errorInfo) {
                            reject(errorInfo);
                        }
                    });
                });
                return prom;

            },

            getAppInfo: async function (appId, isAdminView) {
                appId = appId.split(".")[1];
                var newProm = new Promise(function (resolve, reject) {
                    i3DXCompassPlatformServices.getAppInfo({
                        appId: appId,
                        onComplete: function (AppData) {
                            if (AppData != undefined) {
                                var platID = AppData["platformId"];
                                if (platID != undefined) {
                                    if (!isAdminView && AppData.error != undefined && AppData.error === "") {
                                        let appDataObj = {
                                            "title": AppData.title,
                                            "icon": AppData.icon
                                        }
                                        resolve(appDataObj);
                                    }
                                    else if (isAdminView) {
                                        let appDataObj = {
                                            "title": AppData.title,
                                            "icon": AppData.icon
                                        }
                                        resolve(appDataObj);
                                    }
                                    else
                                        reject(null);
                                }
                                else {
                                    if (isAdminView && AppData.error) {
                                        let appDataObj = {
                                            "title": AppData.title,
                                            "icon": AppData.icon
                                        }
                                        resolve(appDataObj);
                                    }
                                    else
                                        reject(null);
                                }
                            }
                            else
                                reject(null);
                        }
                    })
                });
                return newProm;
            },

            getAppsInfo: async function () {
                var newProm = new Promise(function (resolve, reject) {
                    i3DXCompassPlatformServices.getAppsInfo({
                        onComplete: function (AppData) {
                            if (AppData != undefined) {
                                resolve(AppData);
                            }
                            else
                                reject(null);
                        }
                    })
                });
                return newProm;
            }
        };

        return mePreferencesUtilsObj;
    });
