//EXAMPLE JS 

define('DS/MePreferencesUIElements/MePreferencesCustomView',
    ["DS/Controls/Button",
        "DS/Windows/ImmersiveFrame",
        "DS/Windows/Dialog",
        'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils',
        'DS/Notifications/NotificationsManagerUXMessages',
        'DS/Notifications/NotificationsManagerViewOnScreen',
        "i18n!DS/MePreferencesUIElements/assets/nls/translation",
        "DS/PlatformAPI/PlatformAPI",
        'DS/UWPClientCode/I18n'
    ],
    function (WUXButton, WUXImmersiveFrame, WUXDialog, MePreferencesPlatformServicesUtils,
        NotificationsManagerUXMessages, WUXNotificationsManagerViewOnScreen,
        mePrefWidgetTranslation, PlatformAPI, I18n) {
        "use strict";

        var MePreferenceCustomUIObj = function () { };
        var iframeForDlgContent = null;
        var iframeContainer = null;
        var iframeRemovalRequested = null;
        var WRITE_PREFERENCE_ENDPOINT = "/api/v1/preferences";
        //var mePreferencesUtilsObj = new MePreferencesUtils();
        var customUIDialog = null;

        window.notifs = NotificationsManagerUXMessages;
        WUXNotificationsManagerViewOnScreen.setNotificationManager(window.notifs);
        WUXNotificationsManagerViewOnScreen.setStackingPolicy(1);

        MePreferenceCustomUIObj.prototype.createCustomDialog = async function (completeUrl, jsonValue, type_id, lockValue,
            isStandaloneUI, isAdminView, displayName, dialogHeight, dialogWidth, tID, dlgType) {

            var tenantID = null;
            if (!tID)
                tenantID = await MePreferencesPlatformServicesUtils.getTenant();
            else
                tenantID = tID;

            if (customUIDialog == null) {
                var immersiveFrame = new WUXImmersiveFrame({
                    identifier: "WebUIPanelDocumentation_ModalDialogSample"
                });

                iframeContainer = new UWA.createElement("div", {
                    "class": "mePrefDialog-iframe-container",
                    "styles": {
                        "width": "100%",
                        "height": "100%"
                    }
                });

                iframeForDlgContent = new UWA.createElement("iframe", {
                    "class": "application-dialog-iframe",
                    "scrolling": "yes",
                    "id": "iframe-appDialog",
                    "allowfullscreen": "true",
                    "sandbox": "allow-same-origin allow-scripts allow-top-navigation",
                    "src": completeUrl,
                    "name": "me-preferences-dialog-iframe-for-app",
                    "styles": {
                        "width": "100%",
                        "height": "100%",
                        "border": "none"
                    },
                    "allowtransparency": "true"
                });

                iframeForDlgContent.inject(iframeContainer);

                customUIDialog = new WUXDialog({
                    activeFlag: false,
                    maximizeButtonFlag: true,
                    modalFlag: true,
                    resizableFlag: true,
                    immersiveFrame: immersiveFrame,
                    title: ((displayName === "to be overloaded from NLS") || (!displayName)) ? (mePrefWidgetTranslation["CustomViewDialog.Title"]) : (`${mePrefWidgetTranslation["CustomViewDialog.Title"]} : ${displayName}`),
                    content: iframeContainer,
                    identifier: "me-preference-custom-dialog-" + type_id,
                    modalFlag: true,
                    buttons: {
                        Cancel: new WUXButton({
                            domId: "mePrefCustomCancelButton",
                            onClick: function (e) {
                                customUIDialog.close();
                                window.removeEventListener('message', onPreferenceUpdate, true);
                            }
                        }),
                        Ok: new WUXButton({
                            domId: "mePrefCustomOkButton",
                            onClick: function (e) {
                                iframeRemovalRequested = true;
                                sendMessageToApp();
                                setTimeout(() => {
                                    if (customUIDialog) {
                                        customUIDialog.close();
                                        CreateErrorDialog();
                                    }
                                }, "500");

                            }
                        })
                    }
                });

                customUIDialog.getContent().setAttribute("data-me-preferences-po-use-only-custom-dialog-id", "me-preference-custom-dialog-" + type_id);

                if (dialogHeight) {
                    customUIDialog.height = dialogHeight;
                }
                if (dialogWidth) {
                    customUIDialog.width = dialogWidth;
                }

                customUIDialog.addEventListener('close', function () {
                    if (customUIDialog) {
                        customUIDialog = null;
                        window.removeEventListener('message', onPreferenceUpdate, true);
                        removeImmersiveFrame();
                    }
                });

                if (isStandaloneUI)
                    customUIDialog.buttons.Ok.label = mePrefWidgetTranslation["SaveButton.Label"];

                if (lockValue == "true" && !isAdminView) {
                    customUIDialog.buttons.Ok.visibleFlag = false;
                    var iconObj = {};
                    iconObj["iconName"] = "lock";
                    iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                    iconObj["fontIconSize"] = 'x';
                    customUIDialog.icon = iconObj;
                }

                function CreateErrorDialog() {

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
                }

                function removeImmersiveFrame() {
                    //Get all immersive frames present in the application.
                    var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
                    for (let it = 0; it < immFramesList.length; it++) {
                        let immFrame = immFramesList[it];
                        //Remove the immersive frame added for MePreferenceDialog 
                        if (immFrame.dsModel.identifier == "WebUIPanelDocumentation_ModalDialogSample") {
                            immFrame.remove();
                            break;
                        }
                    }
                    immersiveFrame = null;

                }

                if (dlgType !== "customview")
                    immersiveFrame.inject(document.body);

                const UpdateModelEvt = new Event("ModelDataUpdated");
                UpdateModelEvt.detail = {};

                function sendEvent(data) {
                    UpdateModelEvt.detail = data;
                    document.dispatchEvent(UpdateModelEvt);
                }

                async function onPreferenceUpdate(e) {
                    let msgObj = e.data;
                    var message = msgObj.message;

                    if (iframeRemovalRequested == true && message == "com.ds.mep:OnPrefUpdated_msg" && (!isStandaloneUI)) {
                        // update model
                        let selectedvalue = msgObj.jsonData;// jsonData;
                        let type = "json";
                        let data = [type_id, selectedvalue, type];
                        iframeRemovalRequested = false;
                        sendEvent(data);
                        if (customUIDialog)
                            customUIDialog.close();
                    }
                    else if (iframeRemovalRequested == true && message == "com.ds.mep:OnPrefUpdated_msg" && isStandaloneUI) {

                        var prefArray = new Array();
                        var repoArray = new Array();

                        var prefObj = {};
                        prefObj["name"] = type_id.split('.')[1];
                        prefObj["value"] = msgObj.jsonData;
                        prefArray.push(prefObj);

                        var repoObject = {};
                        repoObject["name"] = type_id.split('.')[0];
                        repoObject["preferences"] = prefArray;

                        repoArray.push(repoObject);

                        let repoObj = { "repositories": repoArray };

                        return MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "mepreferences").then(async (url) => {
                            await writepreferences(repoObj, url);
                            if (customUIDialog)
                                customUIDialog.close();
                        });

                    }
                    if (msgObj && message && (message == "com.ds.mep:OnPrefUpdated_msg"))
                        window.removeEventListener('message', onPreferenceUpdate, true);
                }


                window.addEventListener('message', onPreferenceUpdate, true);

                function sendMessageToApp() {
                    let url = new URL("/", completeUrl).origin;
                    var msg = {};
                    msg["message"] = "com.ds.mep:OnOKBtnClicked_msg";
                    msg["jsonData"] = "";
                    iframeForDlgContent.contentWindow.postMessage(msg, url);
                }


                let compassURL = await MePreferencesPlatformServicesUtils.getServiceUrl(tenantID, "3DCompass");
                //Sending message to app
                iframeForDlgContent.onload = function (event) {
                    let url = new URL("/", completeUrl).origin;
                    var data = {};
                    data["message"] = "com.ds.mep:CustomDialogReady_msg";
                    data["jsonData"] = jsonValue;
                    data["tenantID"] = tenantID;
                    data["lockState"] = lockValue;
                    data["compassConfig"] = {
                        lang: I18n.getCurrentLanguage(),
                        myAppsBaseUrl: compassURL,
                        userId: PlatformAPI.getUser().login
                    };
                    iframeForDlgContent.contentWindow.postMessage(data, url);
                }
            }

            return immersiveFrame;
        }

        async function writepreferences(requestBody, serviceurl) {
            var completeURL = "";

            completeURL = serviceurl + WRITE_PREFERENCE_ENDPOINT;
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                }
            };
            MePreferencesPlatformServicesUtils.callRestAPI(requestBody, completeURL, 'PUT', options).then((data) => {
                return data;
            }).catch((errorInfo) => {
                return null;
            });
        }

        return MePreferenceCustomUIObj;
    });
