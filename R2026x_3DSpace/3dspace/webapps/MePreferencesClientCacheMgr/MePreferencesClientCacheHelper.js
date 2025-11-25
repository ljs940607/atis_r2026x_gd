define('DS/MePreferencesClientCacheMgr/MePreferencesClientCacheHelper',

    ["DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils"],
    function (MePreferencesPlatformServicesUtils) {

        var mepClientCacheHelper = function () {
        }

        mepClientCacheHelper.prototype.getVersion = async function (serviceurl) {

            var version = getVersionFromSessionStorage();
            if (!version) {
                var respArr = await getVersion(serviceurl);
                if (respArr && respArr[2] && respArr[2]["x-mepreferences-version"])
                    version = respArr[2]["x-mepreferences-version"];
                if (version != null)
                    addVersionToSessionStorage(version);
            }
            return version;
        }

        async function getVersion(serviceurl) {
            let VERSION_ENDPOINT = "/api/v1/version";
            let completeURL = serviceurl + VERSION_ENDPOINT;
            return await MePreferencesPlatformServicesUtils.callRestAPI(null, completeURL, 'HEAD').then((resp) => {
                return resp;

            }).catch((errorInfo) => {
                return null;
            });
        }

        //Retrieve version from session storage.
        function getVersionFromSessionStorage() {
            var version = window.sessionStorage.getItem("mep-version");
            if (version)
                return version;
            else
                return null;
        }

        //Adding version to session storage after the first call
        function addVersionToSessionStorage(version) {
            window.sessionStorage.setItem("mep-version", version);
        }

        /*function callRestAPIforVersion(completeURL, methodType) {

            var newProm = new Promise(function (resolve, reject) {
                WAFData.authenticatedRequest(completeURL, {
                    method: methodType,
                    onComplete: function (responseObject, param1) {
                        resolve(param1['x-mepreferences-version']);
                    },
                    onFailure: function (errorObject) {
                        reject(errorObject);
                    }
                });
            });
            return newProm;
        }*/

        return mepClientCacheHelper;
    });
