define('DS/MePreferencesUIElements/MePreferencesPageModelDataProvider',
    ['DS/WAFData/WAFData',
        'DS/Notifications/NotificationsManagerUXMessages',
        'DS/Notifications/NotificationsManagerViewOnScreen',
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheMgr',
        'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils'
    ],
    function (WAFData, NotificationsManagerUXMessages,
        WUXNotificationsManagerViewOnScreen, MePreferencesClientCacheMgr, MePreferencesPlatformServicesUtils) {

        window.notifs = NotificationsManagerUXMessages;
        WUXNotificationsManagerViewOnScreen.setNotificationManager(window.notifs);

        var mePrefClientCacheMgr = new MePreferencesClientCacheMgr();
        var clientEtag = null;

        var mePreferencesPageModelDataProvider = function () {
        };

        mePreferencesPageModelDataProvider.prototype.getPageModel = async function (requestedURL, appID, currentLanguage) {
            // if (!appID.contains(",")) { //cache not applicable for multiple appIDs
            var data = await mePrefClientCacheMgr.retrieveCache(requestedURL);
            if (!data) {
                let key = await getKeyForPageModel(appID, currentLanguage);

                clientEtag = await mePrefClientCacheMgr.retrieveEtag(key);

                var respArr = await getResourcesFromServer(requestedURL, clientEtag);
                if (respArr && respArr[0] && respArr[1] && respArr[2]) {
                    data = {
                        "responseData": respArr[0],
                        "responseStatus": respArr[1].status,
                        "responseETag": respArr[2].etag
                    };
                }
                if (data) {
                    if (data.responseStatus === 200) {
                        //if data not found in cache and server returns status 200 with response and etag
                        let etagheader = new Headers();
                        etagheader.append('etag', data.responseETag);
                        let options = {
                            headers: etagheader
                        }

                        let newresponse = new Response(data.responseData, options);
                        if (newresponse && requestedURL.contains("&v")) {
                            //if request Url contains version then delete the already present cache for that appId and language and add the new response with etag in cache
                            if (key) {
                                await mePrefClientCacheMgr.deleteCache(key);
                            }
                            await mePrefClientCacheMgr.addCache(requestedURL, newresponse);
                        }
                        return data.responseData;
                    }
                    else if (data.responseStatus === 304) {
                        //if data not found in cache and server returns status 304, retrieve the already present cached response
                        let result = await mePrefClientCacheMgr.retrieveCache(key);

                        let etagheader = new Headers();
                        etagheader.append('etag', clientEtag);
                        let options = {
                            headers: etagheader
                        }

                        let newresponse = new Response(result, options);
                        if (newresponse && requestedURL.contains("&v")) {
                            //if request Url contains version then delete the already present cache for that appId and language and add the new response with etag in cache
                            if (key) {
                                await mePrefClientCacheMgr.deleteCache(key);
                            }
                            await mePrefClientCacheMgr.addCache(requestedURL, newresponse);
                        }
                        return result;
                    }
                }
                else {
                    //if data not found in cache as well as on server return error notification
                    let ErrorNotification = {
                        level: "error",
                        title: "Error",
                        subtitle: "",
                        message: "Something went wrong",
                        sticky: true,
                        id: 'data-mep-po-notif-page-model-error'
                    };
                    NotificationsManagerUXMessages.addNotif(ErrorNotification);
                }
            }
            return data;
            // }
            // else {
            //     let result = await getResourcesFromServer(requestedURL);
            //     if(result)
            //         return result.responseData;
            //     else{
            //         let ErrorNotification = {
            //             level: "error",
            //             title: "Error",
            //             subtitle: "",
            //             message: "Something went wrong",
            //             sticky: true
            //         };
            //         NotificationsManagerUXMessages.addNotif(ErrorNotification);
            //     }
            // }
        }

        //gets key from cache for previously stored response of application
        async function getKeyForPageModel(appID, currentLanguage) {
            const cache = await caches.open('MePreferences');
            const keys = await cache.keys();
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i].url;
                if ((key.includes(appID)) && key.includes(currentLanguage)) {
                    return key;
                };
            }
            return null;
        }

        //gets resources from pageModel API
        async function getResourcesFromServer(url, clientEtag) {
            let REQUEST_BODY = null;
            let headersInfo = {
                'If-None-Match': ''
            };
            if (clientEtag)
                headersInfo["If-None-Match"] = clientEtag;

            let options = {
                headersInfo: headersInfo
            };

            return await MePreferencesPlatformServicesUtils.callRestAPI(REQUEST_BODY, url, 'GET', options).then((responseObject) => {
                return responseObject;
            }).catch((errorInfo) => {
                return null;
            });
        }

        /*function callRestAPI(requestBody, completeURL, clientEtag, methodType) {
            let dataInfo;
            let headersInfo;
            let typeInfo;
            if (requestBody) {
                dataInfo = JSON.stringify(requestBody);
                headersInfo = {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br'
                };
                typeInfo = 'json';
            }
            else {
                headersInfo = {
                    'If-None-Match': ''
                };
                headersInfo["If-None-Match"] = clientEtag;
            }

            var newProm = new Promise(function (resolve, reject) {
                WAFData.authenticatedRequest(completeURL, {
                    method: methodType,
                    type: typeInfo,
                    data: dataInfo,
                    headers: headersInfo,
                    onComplete: function (responseData, contentdata, responseParam) {
                        let responseObject = {
                            "responseData": responseData,
                            "responseStatus": responseParam.status,
                            "responseETag": contentdata.etag
                        }
                        resolve(responseObject);
                    },
                    onFailure: function (errorObject) {
                        reject(errorObject);
                    }
                });
            });
            return newProm;
        }*/
        return mePreferencesPageModelDataProvider;
    });
