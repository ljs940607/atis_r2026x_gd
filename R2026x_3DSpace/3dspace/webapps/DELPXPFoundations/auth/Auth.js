define(["require", "exports", "DS/DELPXPFoundations/PXPWAFData", "DS/DELPXPFoundations/PXPUtils", "DS/Logger/Logger"], function (require, exports, PXPWAFData_1, Utils, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Auth = void 0;
    var _logger = Logger.getLogger('PXP.AUTH');
    // TODO : EK.defaultServiceURL  a mettre dans 'ExperienceKernel.d.ts'
    const EK_defaultServiceURL = 'EXECFWK';
    // -- code en dessous equivalent de EK.defaultAuthentication
    exports.Auth = {
        Default: (credential, onSuccess, onError) => {
            var validateUrl = credential.passportURL + '/login?service=' + EK_defaultServiceURL;
            PXPWAFData_1.WAFData.authenticatedRequest(validateUrl, { method: 'GET', headers: { Accept: 'application/json' } })
                .then((httpResponse) => {
                let serviceTicket = JSON.parse(httpResponse.data);
                //_logger.info('Authentication success: serviceURL=' + serviceURL + ' - serviceTicket=' + serviceTicket );
                onSuccess(EK_defaultServiceURL, serviceTicket.access_token);
            })
                .catch((reason) => {
                _logger.error('Authentication error: ' + reason);
                onError(reason);
            });
        },
        ServiceWithTGT(options) {
            let optService;
            let optPassport;
            if (options) {
                if (Utils.isString(options)) {
                    optService = options;
                }
                else {
                    optService = options.service; //?? EK_defaultServiceURL;
                    optPassport = options.passport;
                }
            }
            return function (credential, onSuccess, onError) {
                let passportURL = optPassport || credential.passportURL;
                let genericService = optService || passportURL + '/api/login/cas/transient';
                var _fctLoginService = function (tgt) {
                    var url = passportURL + '/login?service=' + encodeURIComponent(genericService);
                    return PXPWAFData_1.WAFData.authenticatedRequest(url, { method: 'GET', headers: { Accept: 'application/json' } }).then((httpResponse) => {
                        const responsePassport = JSON.parse(httpResponse.data);
                        if (responsePassport.access_token === undefined) {
                            onError('ServiceToken not found');
                        }
                        else {
                            const serviceURL = genericService + '?tgt=' + tgt;
                            //_logger.info('Authentication success: serviceURL=' + serviceURL + ' - serviceTicket=' + serviceTicket );
                            onSuccess(serviceURL, responsePassport.access_token);
                        }
                    });
                };
                //-- Generate TGT
                var urlTGT = passportURL + '/api/authenticated/cas/transient';
                PXPWAFData_1.WAFData.authenticatedRequest(urlTGT, { method: 'GET', headers: { Accept: 'application/json' } })
                    .then((httpResponse) => {
                    const serviceTicket = JSON.parse(httpResponse.data);
                    if (serviceTicket.access_token === undefined)
                        throw new Error('TGT not found');
                    return _fctLoginService(serviceTicket.access_token);
                })
                    .catch((reason) => {
                    _logger.error('Authentication error: ' + reason);
                    onError(reason);
                });
            };
        },
    };
});
