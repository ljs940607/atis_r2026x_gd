define('DS/MePreferencesUIElements/MePreferencesModalDialog',
    ["DS/Windows/ImmersiveFrame",
        "DS/Windows/Dialog",
        'DS/MePreferencesUIBuilder/MePreferencesUIBuilder',
        'DS/Controls/Button',
        'i18n!DS/MePreferencesUIElements/assets/nls/translation',
        'DS/WebappsUtils/WebappsUtils',
        'DS/MePreferencesUIElements/MePreferencesMainView',
        "DS/PlatformAPI/PlatformAPI",
        'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils',
        "DS/MePreferencesClientUtilities/MePreferencesWriter",
        "DS/Utilities/Dom",
        "DS/MePreferencesUIElements/MePreferencesBetaOptionsView",
        "DS/MePreferencesUIElements/MePreferencesLanguageView",
        "DS/MePreferencesUIElements/MePreferencesSelectionModel",
        'DS/Notifications/NotificationsManagerUXMessages',
        'DS/Notifications/NotificationsManagerViewOnScreen',
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheMgr',
        'DS/MePreferencesClientCacheMgr/MePreferencesClientCacheHelper',
        'DS/UWPClientCode/I18n'
    ],
    function (WUXImmersiveFrame, WUXDialog, MePreferencesUIBuilder, WUXButton,
        mePrefUITranslation, WebappsUtils, MePreferencesMainViewObj,
        PlatformAPI, MePreferencesPlatformServicesUtils, MePreferencesWriter,
        Dom, MePreferencesBetaOptionsView, MePreferencesLanguageView,
        MePreferencesSelectionModel, NotificationsManagerUXMessages, WUXNotificationsManagerViewOnScreen, MePreferencesClientCacheMgr,
        MePreferencesClientCacheHelper, I18n) {

        var mePreferenceUIBuilderObj = new MePreferencesUIBuilder();
        var mePrefBetaOptionsObj = null;
        var mePrefLangObj = null;
        var mePreferencesWriterObj = null;

        var immersiveFrame = null;
        var UIModalDialog = null;
        var prefUpdateSubInst = null;
        var adminProfUpdateSubInst = null;

        // var mePrefClientCacheMgr = new MePreferencesClientCacheMgr();
        // var mePreferencesClientCacheHelperObj = new MePreferencesClientCacheHelper();
        // var GET_CATEGORY_JSON_ENDPOINT = "/api/v1/preferences_panel/category_node";

        const removeImmEvent = new Event("ImmFrameRemoved");

        window.notifs = NotificationsManagerUXMessages;
        WUXNotificationsManagerViewOnScreen.setNotificationManager(window.notifs);
        WUXNotificationsManagerViewOnScreen.setStackingPolicy(1);

        var MePreferenceModalDialog = {

            getMePreferenceDialog: async function (appID, data) {

                if (immersiveFrame)
                    return immersiveFrame;

                mePrefBetaOptionsObj = new MePreferencesBetaOptionsView();
                mePrefLangObj = new MePreferencesLanguageView();
                mePreferencesWriterObj = new MePreferencesWriter(mePrefBetaOptionsObj, mePrefLangObj);
                var isAdminView = false;
                // var isAppAccessible = false;

                immersiveFrame = new WUXImmersiveFrame({
                    identifier: "me-preference-dialog-immersive-frame"
                });

                var dialogDiv = new UWA.Element("div", {
                    styles: {
                        width: "100%",
                        height: "100%"
                    }
                });

                var tenantID = null;
                if (data && data.tenantID)
                    tenantID = data.tenantID;
                else
                    tenantID = await MePreferencesPlatformServicesUtils.getTenant();

                //var platformDataObj = await getPlatformInfo();

                document.removeEventListener("nodeSelectionChange", onNodeSelectionChange, true);
                document.addEventListener("nodeSelectionChange", onNodeSelectionChange, true);

                document.removeEventListener("ModelDataUpdated", enableSave);
                document.addEventListener("ModelDataUpdated", enableSave, { once: true });

                document.removeEventListener("langChange", enableSave);
                document.addEventListener("langChange", enableSave, { once: true });

                document.removeEventListener("betaOptionUpdate", enableSave);
                document.addEventListener("betaOptionUpdate", enableSave, { once: true });

                // if (appID) {
                //     if (appID.contains("3DSApps.")) {
                //         let serviceURL = await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences")
                //         let categoryInfo = await getCategoryJson(serviceURL);
                //         let categoryJson = JSON.parse(categoryInfo);
                //         for (let i = 0; i < categoryJson.categories.length; i++) {
                //             if (categoryJson.categories[i].type === "AppFamily") {
                //                 for (let j = 0; j < categoryJson.categories[i].children.length; j++) {
                //                     for (let k = 0; k < categoryJson.categories[i].children[j].linkedApps.length; k++) {
                //                         isAppAccessible = await checkAppAccessibility(categoryJson.categories[i].children[j].linkedApps[k], isAdminView);
                //                     }
                //                 }
                //             }
                //         }
                //     }
                //     else if (appID.contains("3DSCommon."))
                //         isAppAccessible = true;
                //     else
                //         isAppAccessible = await checkAppAccessibility(appID, isAdminView);
                // }

                // if (isAppAccessible || !appID) {
                return await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (serviceurl) => {

                    UIModalDialog = await createPreferenceDialog();

                    let mainViewDiv = await MePreferencesMainViewObj.createMainView(appID, isAdminView, null, serviceurl, mePrefBetaOptionsObj, mePrefLangObj, data.variation, tenantID);
                    mainViewDiv.inject(dialogDiv);

                    if (UIModalDialog.height < 0 && UIModalDialog.width < 0) {
                        setDialogDimensions(UIModalDialog, data.variation.type);
                    }

                    //multi-tenant save code
                    // if (platformDataObj.length > 1) {
                    //     UIModalDialog.checkboxInfos = {
                    //         label: mePrefUITranslation["SaveAllCheckBox.Title"] || "to be overloaded from NLS",  // Use fallback text if translation doesn't exist
                    //         checkFlag: false  // Default checkFlag to false
                    //     };
                    // }

                    UIModalDialog.getContent().setAttribute("data-me-preferences-po-use-only-dialog-id", "me-preference-dialog-" + appID);

                    if (UIModalDialog) {
                        var mePrefDialogCloseButton = UIModalDialog.elements._closeButton;
                        mePrefDialogCloseButton.addEventListener('click', function () {
                            prefUpdateSubInst.unsubscribe();
                            adminProfUpdateSubInst.unsubscribe();
                            mePreferenceUIBuilderObj.reset();
                            UIModalDialog.close();
                            UIModalDialog.destroy();
                            UIModalDialog = null;
                            removeImmersiveFrame();
                            var selModel = MePreferencesSelectionModel.getSelectionModel();
                            selModel.empty();
                        });
                    }

                    async function createPreferenceDialog() {
                        return new WUXDialog({
                            immersiveFrame: immersiveFrame,
                            title: mePrefUITranslation["Preferences.Title"],
                            content: dialogDiv,
                            activeFlag: false,
                            modalFlag: true,
                            resizableFlag: true,
                            maximizeButtonFlag: true,
                            position: {
                                my: "center",
                                at: "center",
                                of: immersiveFrame
                            },
                            identifier: "me-preference-dialog-" + appID,
                            buttons: {
                                Close: new WUXButton({
                                    domId: "mePrefMainCloseButton",
                                    onClick: function (e) {
                                        prefUpdateSubInst.unsubscribe();
                                        adminProfUpdateSubInst.unsubscribe();
                                        mePreferenceUIBuilderObj.reset();
                                        UIModalDialog.close();
                                        UIModalDialog.destroy();
                                        UIModalDialog = null;
                                        removeImmersiveFrame();
                                        var selModel = MePreferencesSelectionModel.getSelectionModel();
                                        selModel.empty();
                                    }
                                }),
                                Save: new WUXButton({
                                    domId: "mePrefMainSaveButton",
                                    disabled: true,// default save disabled
                                    onClick: async function (e) {
                                        prefUpdateSubInst.unsubscribe();
                                        adminProfUpdateSubInst.unsubscribe();

                                        //Save will save preferences from selectionModel in DB
                                        //BetaOptions is a special preference.
                                        //Language is a special preference. 
                                        //Add saveLangauge method in the end as it will refresh the dashboard
                                        var selModel = MePreferencesSelectionModel.getSelectionModel();
                                        //multi-tenant save code
                                        // if (UIModalDialog.checkboxInfos) {
                                        //     if (UIModalDialog.checkboxInfos.checkFlag) {
                                        //         await Promise.all(platformDataObj.map(async (platformInfo) => {
                                        //             await mePreferencesWriterObj.save(platformInfo["mepreferences"], selModel);
                                        //         }));
                                        //     } else {
                                        //         await mePreferencesWriterObj.save(serviceurl, selModel);
                                        //     }
                                        // } else {
                                        //   await mePreferencesWriterObj.save(serviceurl, selModel);
                                        //}

                                        await mePreferencesWriterObj.save(serviceurl, selModel);
                                        mePreferencesWriterObj.saveBetaOptions();
                                        await mePreferencesWriterObj.saveLanguage();
                                        UIModalDialog.close();
                                        UIModalDialog.destroy();
                                        UIModalDialog = null;
                                        removeImmersiveFrame();
                                        selModel.empty();
                                    }
                                })
                            }

                        });
                    }

                    function setDialogDimensions(UIModalDialog, type) {
                        if (type == "globalview") {
                            UIModalDialog.width = 620;
                            UIModalDialog.height = 500;
                        }
                        else {
                            UIModalDialog.width = 400;
                            UIModalDialog.height = 500;
                        }
                    }

                    //Admin Notification
                    adminProfUpdateSubInst = PlatformAPI.subscribe("com.ds.mep:onAdminProfUpdate", function (data) {
                        let element = "tenantId";
                        let tenantID = null;

                        data.forEach(Obj => {
                            if (Obj.hasOwnProperty(element)) {
                                tenantID = Obj[element];
                            }

                        });
                        if (tenantID == (PlatformAPI.getWidgetTenant())) {
                            createAdminWarningDialog();
                        } else if (tenantID == (PlatformAPI.getTenant())) {
                            createAdminWarningDialog();
                        }
                    });


                    var adminWarningDialog = null;
                    var userWarningDialog = null;

                    var baseURL = WebappsUtils.getWebappsBaseUrl();
                    var adminMsgDialogIcon = Dom.generateIcon({
                        iconPath: baseURL + "MePreferencesUIElements/assets/icons/warningIcn.png",
                        iconSize: {
                            height: "26px",
                            width: "26px"
                        }
                    });

                    var adminMessageContentDiv = new UWA.createElement("div", {
                        class: "admin-message-div",
                        styles: {
                            display: "flex"
                        }
                    });

                    function createAdminWarningDialog() {
                        if (!adminWarningDialog) {
                            var adminMessage = new UWA.Element("p", {
                                class: "adminMessageDivClass",
                                // text: mePrefUITranslation["adminUserNotification.SubTitle"],
                                styles: {
                                    align_self: "center",
                                    padding_left: "5px"
                                }
                            })

                            var msg1 = new UWA.Element("span", {
                                class: "adminMessageSpanClass1",
                                text: mePrefUITranslation["adminUserNotification.Title"],
                                styles: {
                                    font_weight: "bold"
                                    // align_self: "center",
                                    // padding_left: "5px"
                                }
                            })

                            var msg2 = new UWA.Element("span", {
                                class: "adminMessageSpanClass2",
                                text: mePrefUITranslation["adminUserNotification.SubTitle"],
                                styles: {
                                    display: "block"
                                }
                            })

                            msg1.inject(adminMessage);
                            msg2.inject(adminMessage);

                            adminMsgDialogIcon.inject(adminMessageContentDiv);
                            adminMessage.inject(adminMessageContentDiv);

                            adminWarningDialog = new WUXDialog({
                                width: 350,
                                immersiveFrame: immersiveFrame,
                                // title: mePrefUITranslation["adminUserNotification.Title"],
                                identifier: "mep-admin-message-dialog",
                                content: adminMessageContentDiv,
                                activeFlag: false,
                                modalFlag: true,
                                position: {
                                    my: "center",
                                    at: "center",
                                    of: immersiveFrame
                                },
                                buttons: {
                                    Close: new WUXButton({
                                        domId: "mep-admin-message-cancel",
                                        onClick: function (e) {

                                            adminWarningDialog.destroy();
                                            adminWarningDialog = null;
                                        }
                                    })
                                }
                            })
                            adminWarningDialog.addEventListener("close", function () {
                                adminWarningDialog.destroy();
                                adminWarningDialog = null;
                            })

                            immersiveFrame.inject(document.body);
                        };
                    }


                    //User Notification
                    prefUpdateSubInst = PlatformAPI.subscribe("com.ds.mep:onPrefUpdate", function (data) {
                        let element = "tenantId";
                        let tenantID = null;

                        data.forEach(Obj => {
                            if (Obj.hasOwnProperty(element)) {
                                tenantID = Obj[element];
                            }

                        });

                        if (tenantID == (PlatformAPI.getWidgetTenant())) {
                            createUserWarningDialog();
                        } else if (tenantID == (PlatformAPI.getTenant())) {
                            createUserWarningDialog();
                        }

                    });

                    var userMessageContentDiv = new UWA.createElement("div", {
                        class: "user-message-div",
                        styles: {
                            display: "flex"
                        }
                    });

                    function createUserWarningDialog() {
                        if (!userWarningDialog) {
                            var userMessage = new UWA.Element("span", {
                                class: "userMessageSpanClass",
                                text: mePrefUITranslation["userNotification.Title"],
                                styles: {
                                    align_self: "center",
                                    padding_left: "5px"
                                }
                            })

                            adminMsgDialogIcon.inject(userMessageContentDiv);
                            userMessage.inject(userMessageContentDiv);

                            userWarningDialog = new WUXDialog({
                                width: 350,
                                immersiveFrame: immersiveFrame,
                                identifier: "mep-user-message-dialog",
                                content: userMessageContentDiv,
                                activeFlag: false,
                                modalFlag: true,
                                position: {
                                    my: "center",
                                    at: "center",
                                    of: immersiveFrame
                                },
                                buttons: {
                                    Close: new WUXButton({
                                        domId: "mep-user-message-cancel",
                                        onClick: function (e) {
                                            userWarningDialog.destroy();
                                            userWarningDialog = null;
                                        }
                                    })
                                }
                            })
                            userWarningDialog.addEventListener("close", function () {
                                userWarningDialog.destroy();
                                userWarningDialog = null;
                            })
                            immersiveFrame.inject(document.body);
                        }
                    }

                    //Load CSS
                    loadCSS();

                    return immersiveFrame;
                });
                // }
                // else {

                //     let errorNotif = {
                //         id: 'data-mep-po-notif-appID-access-error',
                //         level: 'error',
                //         title: mePrefUITranslation["ErrorDialog.Title"],
                //         message: mePrefUITranslation["AppIDAccessErrorNotification.Label"],
                //         sticky: false
                //     }
                //     NotificationsManagerUXMessages.addNotif(errorNotif);
                // }
                // return;
            }

        }

        // async function checkAppAccessibility(appID, isAdminView) {
        //     return await MePreferencesPlatformServicesUtils.getAppInfo.call(this, appID, isAdminView).then((appInfo) => {
        //         return true;
        //     }).catch((errorInfo) => {
        //         return null;
        //     });
        // }

        // async function getCategoryJsonFromServer(url) {
        //     return await MePreferencesPlatformServicesUtils.callRestAPI(null, url, 'GET').then((responseObject) => {
        //         return responseObject[0];
        //     }).catch((errorInfo) => {
        //         return null;
        //     });
        // }

        // async function getCategoryJson(serviceURL) {

        //     var version = await mePreferencesClientCacheHelperObj.getVersion(serviceURL);

        //     var currentLanguage = I18n.getCurrentLanguage();
        //     if (!currentLanguage)
        //         currentLanguage = en;
        //     var url = null;

        //     if (version)
        //         url = serviceURL + GET_CATEGORY_JSON_ENDPOINT + '?&lang="' + currentLanguage + '"&v="' + version + '"';
        //     else
        //         url = serviceURL + GET_CATEGORY_JSON_ENDPOINT + '?&lang="' + currentLanguage + '"';


        //     var data = await mePrefClientCacheMgr.retrieveCache(url);
        //     if (!data) {
        //         data = await getCategoryJsonFromServer(url);
        //         if (data) {
        //             let newresponse = new Response(data);
        //             if (newresponse && url.contains("&v")) {
        //                 let cache = await caches.open('MePreferences');
        //                 let keys = await cache.keys();
        //                 for (let i = 0; i < keys.length; i++) {
        //                     let key = keys[i].url;
        //                     if (key) {
        //                         await mePrefClientCacheMgr.deleteCache(key);
        //                     }
        //                 }
        //                 await mePrefClientCacheMgr.addCache(url, newresponse);
        //             }
        //             return data;
        //         }
        //     }
        //     return data;
        // }

        //funciton to fetch all accessible tenants info
        // async function getPlatformInfo() {
        //     try {
        //         return await MePreferencesPlatformServicesUtils.callGetPlatformServices();
        //     } catch (error) {
        //         console.error("Error getting platform IDs:", error);
        //     }
        // }


        function enableSave() {
            UIModalDialog.buttons.Save.disabled = false;
        }


        async function onNodeSelectionChange(e) {
            navigator.locks.request("my_resource", async (lock) => {
                // The lock has been acquired.
                await ProcessSelectionChange(e);
                // Now the lock will be released.
            });
        }

        async function ProcessSelectionChange(e) {
            let displayLabel = e.detail["label"];
            UIModalDialog.elements._titleDiv.setText(`${mePrefUITranslation["Preferences.Title"]} | ${displayLabel}`);
        }

        //function to load css
        function loadCSS() {
            var path = WebappsUtils.getWebappsBaseUrl() + "MePreferencesUIElements/MePreferencesUIDialog.css";
            var linkElem = new UWA.createElement('link', {
                'rel': 'stylesheet',
                'type': 'text/css',
                'href': path
            });
            document.getElementsByTagName('head')[0].appendChild(linkElem);
        }

        function removeImmersiveFrame() {
            //Get all immersive frames present in the application.
            var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
            for (let it = 0; it < immFramesList.length; it++) {
                let immFrame = immFramesList[it];
                //Remove the immersive frame added for MePreferenceDialog 
                if (immFrame.dsModel.identifier == "me-preference-dialog-immersive-frame") {
                    immFrame.remove();
                    break;
                }
            }
            immersiveFrame = null;
            document.dispatchEvent(removeImmEvent);
        }

        return MePreferenceModalDialog;
    }
);
