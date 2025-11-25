/// <amd-module name="DS/DELPXPFoundations/PXPPassport"/>
define("DS/DELPXPFoundations/PXPPassport", ["require", "exports", "DS/DELPXPFoundations/PXPWAFData"], function (require, exports, PXPWAFData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPassportHTTP = createPassportHTTP;
    class PassportImpl {
        constructor(serverURL) {
            this.passportURL = serverURL instanceof URL ? serverURL.toString() : serverURL;
        }
        async login(user, password) {
            const loginUri = this.passportURL + '/login?action=get_auth_params';
            return fetch(loginUri, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'include', // include, *same-origin, omit
                headers: {
                    Accept: 'application/json',
                },
                redirect: 'manual', // manual, *follow, error
            })
                .then((response) => {
                var contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json();
                }
                throw new Error('Passport login failed: ' + loginUri + ': invalid response');
            })
                .then((json) => {
                if (json === null || json === void 0 ? void 0 : json.lt) {
                    return json.lt;
                }
                throw new Error('Passport login failed: ' + loginUri + ': invalid response (not found ticket)');
            })
                .then((loginTicket) => {
                const urlLogin = this.passportURL + '/login';
                const body = 'lt=' + loginTicket + '&username=' + user + '&password=' + password;
                return fetch(urlLogin, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    body: body,
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'include', // include, *same-origin, omit
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    redirect: 'manual', // manual, *follow, error
                });
            })
                .then((response) => {
                if (response.type && response.type == 'opaqueredirect') {
                    //status 302... mais avec fetch tout est caché...
                    return;
                }
                else {
                    throw new Error('invalid response');
                }
            })
                .catch((reason) => {
                throw new Error('Passport- Failed to login! (' + reason + ')');
            });
        }
        async loginWithTGT(transientTicket) {
            const loginTGT = this.passportURL + '/api/login/cas/transient?tgt=' + transientTicket;
            return PXPWAFData_1.WAFData.authenticatedRequest(loginTGT, { method: 'GET', headers: { Accept: 'application/json' } })
                .then((httpResponse) => {
                if (httpResponse.data) {
                    const responseLoginWithTGT = JSON.parse(httpResponse.data);
                    if (responseLoginWithTGT && responseLoginWithTGT.result && responseLoginWithTGT.result === 'success') {
                        return;
                    }
                }
                throw new Error('invalid response');
            })
                .catch((reason) => {
                throw new Error('Passport- Failed to login! (' + reason + ')');
            });
        }
        async generateTGT() {
            const generateTGT = this.passportURL + '/api/authenticated/cas/transient';
            return PXPWAFData_1.WAFData.authenticatedRequest(generateTGT, { method: 'GET', headers: { Accept: 'application/json' } })
                .then((httpResponse) => {
                const responsePassport = JSON.parse(httpResponse.data);
                if (responsePassport.access_token !== undefined) {
                    return responsePassport.access_token;
                }
                throw new Error('invalid response');
            })
                .catch((reason) => {
                throw new Error('Passport- Failed to generate TGT! (' + reason + ')');
            });
        }
        async getMe() {
            const urlGetMe = this.passportURL + '/api/authenticated/user/me';
            return PXPWAFData_1.WAFData.authenticatedRequest(urlGetMe, {
                method: 'GET',
                cache: false,
                type: 'json',
                //headers: { Accept: 'application/json' },
            })
                .then((response) => {
                if (response && response.data && response.data.fields) {
                    const user = response.data.fields;
                    const credentials = {
                        username: user.username,
                        name: user.firstName + ' ' + user.lastName,
                        id: user.user_uuid,
                        fields: { ...user },
                    };
                    return credentials;
                }
                throw new Error('invalid response');
            })
                .catch((error) => {
                throw new Error('Passport- Failed to retrieve GetMe!');
            });
        }
        async isAuthenticated() {
            return this.getMe()
                .then((cred) => {
                return cred.id !== undefined;
            })
                .catch((reason) => false);
        }
    }
    function createPassportHTTP(passportURL) {
        return new PassportImpl(passportURL);
    }
});
