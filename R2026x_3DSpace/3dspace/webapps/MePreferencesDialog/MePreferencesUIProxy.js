define('DS/MePreferencesDialog/MePreferencesUIProxy',
    ['DS/MePreferencesDialog/MePreferencesUIProxyAdapter',
        'DS/MePreferencesClientAPI/MePreferencesClientAPI'],
    function (MePreferencesUIProxyAdapter, MePreferencesClientAPI) {

        var mePrefProxy = function () {
        };

        mePrefProxy.prototype.GetPreferenceDialog = async function (data) {

            var appID = null;
            if (data && data.appID) { // call coming from app
                //retrieve appID
                appID = data["appID"];

            } else { // call coming from dashboard
                var tempData = {};
                var varType = {
                    type: "globalview"
                };
                tempData["variation"] = varType;
                data = tempData;
            }

            return MePreferencesClientAPI.getMePreferencesDialog(appID, data).then((uiDialog) => {
                if (uiDialog)
                    return uiDialog;
                else {
                    //If we get any error in Global Dialog then we'll fallback to old dialog
                    return MePreferencesUIProxyAdapter.getPreferenceDialog().then((uiDialog) => {
                        if (uiDialog)
                            return uiDialog;
                        else
                            return null;
                    });
                }
            });

        };
        return mePrefProxy;
    });

