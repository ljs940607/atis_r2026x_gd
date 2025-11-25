/**
 * Utility module for ontology access.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("DS/i3DXOntologyUIServicesClient/Utils/OntologyUIClientUtils", ["require", "exports", "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices", "text!DS/i3DXOntologyUIServicesClient/assets/OntologyUIClientSettings.json", "DS/WAFData/WAFData"], function (require, exports, i3DXCompassPlatformServices_1, OntologyUIClientSettings_json_1, WAFData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    i3DXCompassPlatformServices_1 = __importDefault(i3DXCompassPlatformServices_1);
    OntologyUIClientSettings_json_1 = __importDefault(OntologyUIClientSettings_json_1);
    WAFData_1 = __importDefault(WAFData_1);
    var OntologyUIClientUtils = {
        errorCodes: {
            WRONG_OR_MISSING_INPUT: 'ROA001',
            PASSPORT_ERROR: 'ROA020',
            FED_SEARCH_PASSPORT_ERROR: 'ROA021',
            WEB_SERVICE_CALL_ERROR: 'ROA31',
            FED_SEARCH_CALL_ERROR: 'ROA41',
            UNEXPECTED_ERROR: 'ROA099',
        },
        TMPPREFIX: 'tmpprefix',
        rdfService: 'ontology',
        async getClassResourceList(iParams) {
            return new Promise((resolve, reject) => {
                if (!iParams.resourceId && !iParams.ids) {
                    return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing Class URI parameter'));
                }
                if (!(iParams === null || iParams === void 0 ? void 0 : iParams.applicativeId)) {
                    return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.applicativeId parameter'));
                }
                if (!(iParams === null || iParams === void 0 ? void 0 : iParams.tenantId)) {
                    return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.tenantId parameter'));
                }
                const lang = OntologyUIClientUtils.getLanguage(iParams);
                var headers, requestInfo;
                if (iParams.switchToVersion3) {
                    headers = OntologyUIClientUtils.getRequestHeaders(lang);
                }
                else {
                    requestInfo = OntologyUIClientUtils.getRequestInfo(iParams.resourceId, lang, iParams.headers);
                    headers = requestInfo ? requestInfo.headers : {};
                }
                let pillar = '3drdfdc';
                if (iParams.applicativeId == 'odtMode') {
                    pillar = '3DRDF';
                }
                ;
                const applicativeId = iParams.applicativeId;
                let recurseParam = '';
                let ontologyParam = '';
                let filterParam = '';
                let ftsParam = '';
                let lineageParam = '';
                let searchableFieldsParam = '';
                let oxCompliantParam = '';
                if (iParams.iCheckRecurse) {
                    if (iParams.recurse && !(Number.isInteger(iParams.recurse) || iParams.recurse === 'all')) {
                        return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, "iParams.recurse is set but its value is not an integer or 'all'"));
                    }
                    if (iParams.recurse) {
                        recurseParam = `&recurse=${iParams.recurse}`;
                    }
                }
                if (iParams.fts) {
                    ftsParam = `&fts=${iParams.fts}`;
                }
                if (iParams.filter) {
                    filterParam = `&filter=${encodeURIComponent(JSON.stringify(iParams.filter))}`;
                }
                if (iParams.searchableFields) {
                    searchableFieldsParam = `&searchableFields=${encodeURIComponent(JSON.stringify(iParams.searchableFields))}`;
                }
                if (iParams.getLineage) {
                    lineageParam = '&getlineage=true';
                }
                if (iParams.oxCompliant) {
                    oxCompliantParam = `&oxCompliant=${iParams.oxCompliant}`;
                }
                let paginationParam = '';
                if (iParams.limit) {
                    paginationParam = `&limit=${iParams.limit}`;
                }
                if (iParams.offset !== undefined && iParams.offset !== null) {
                    paginationParam += `&offset=${iParams.offset}`;
                }
                let iconsParam = '';
                if (iParams.withIcons !== undefined && iParams.withIcons !== null) {
                    iconsParam = `&withIcons=${iParams.withIcons}`;
                }
                let resourceURLParam = '';
                if (iParams.withResourcesURL !== undefined && iParams.withResourcesURL !== null) {
                    resourceURLParam = `&withResourcesURL=${iParams.withResourcesURL}`;
                }
                let selectablesParam = '';
                if (iParams.selectables && iParams.selectables.length > 0) {
                    selectablesParam = `&selectables=${encodeURIComponent(JSON.stringify(iParams.selectables))}`;
                }
                let idsParam = '';
                let endpoint = `classes/${iParams.resourceId}/${iParams.resourceType}`;
                if (iParams.switchToVersion3 && iParams.resourceType == 'classes') {
                    endpoint = 'classes/subclasses';
                    idsParam = `&ids=${encodeURIComponent(iParams.ids)}`;
                }
                endpoint += `?applicativeId=${applicativeId}${idsParam}${recurseParam}${ontologyParam}${filterParam}${ftsParam}${searchableFieldsParam}${lineageParam}${paginationParam}${iconsParam}${selectablesParam}${resourceURLParam}${oxCompliantParam}`;
                OntologyUIClientUtils.getRDFBaseURLPromise(this.rdfService, iParams.tenantId, pillar)
                    .then((url) => {
                    if (iParams.switchToVersion3 && iParams.resourceType == 'classes') {
                        url = url.replace('v2', 'v3');
                    }
                    const fullURL = `${url}${endpoint}`;
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'GET',
                        headers: headers,
                        timeout: 40000,
                        onComplete: (response, info, request) => {
                            try {
                                const jsResp = JSON.parse(response);
                                jsResp.code = request.status;
                                resolve(OntologyUIClientUtils.formatMessage(jsResp, false));
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.UNEXPECTED_ERROR, e));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        },
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        // Function
        async getOntologyResourceList(iParams) {
            return new Promise((resolve, reject) => {
                // Validate iParams.applicativeId
                if (!iParams || !iParams.applicativeId) {
                    return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.applicativeId parameter'));
                }
                // Initialize variables
                const lang = OntologyUIClientUtils.getLanguage(iParams);
                let pillar = '3drdfdc';
                const { tenantId, applicativeId, iCheckRecurse, recurse, withResourcesURL, resourceType, switchToVersion3, selectables, onlyRoot, searchableFields, limit, offset, fts, oxCompliant, withIcons } = iParams;
                if (applicativeId == 'odtMode') {
                    pillar = '3DRDF';
                }
                let recurseParam = '', resourceURLParam = '', selectablesParam = '', onlyRootParam = '', searchableFieldsParam = '', ftsParam = '', limitParam = '', offsetParam = '', oxCompliantParam = '', withIconsParam = '';
                // Handle recursion parameter
                if (iCheckRecurse) {
                    if (recurse && !(Number.isInteger(recurse) || recurse === 'all')) {
                        return reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WRONG_OR_MISSING_INPUT, "iParams.recurse is set but its value is not an integer or 'all'"));
                    }
                    if (recurse) {
                        recurseParam = `&recurse=${recurse}`;
                    }
                }
                if (withResourcesURL) {
                    resourceURLParam = `&withResourcesURL=${withResourcesURL}`;
                }
                if (oxCompliant) {
                    oxCompliantParam = `&oxCompliant=${oxCompliant}`;
                }
                if (selectables) {
                    selectablesParam = `&selectables=${encodeURIComponent(selectables)}`;
                }
                if (onlyRoot) {
                    onlyRootParam = `&onlyRoot=${onlyRoot}`;
                }
                if (withIcons) {
                    withIconsParam = `&withIcons=${withIcons}`;
                }
                if (searchableFields) {
                    searchableFieldsParam = `&searchableFields=${encodeURIComponent(searchableFields)}`;
                }
                if (fts) {
                    ftsParam = `&fts=${encodeURIComponent(fts)}`;
                }
                if (limit) {
                    limitParam = `&limit=${limit}`;
                }
                if (offset) {
                    offsetParam = `&offset=${offset}`;
                }
                // Construct endpoint
                let endpoint = `ontologies/${resourceType}`;
                if (switchToVersion3) {
                    endpoint = `${resourceType}`;
                }
                if (applicativeId) {
                    endpoint += `?applicativeId=${applicativeId}${recurseParam}${resourceURLParam}${selectablesParam}${onlyRootParam}${searchableFieldsParam}${ftsParam}${offsetParam}${limitParam}${oxCompliantParam}${withIconsParam}`;
                }
                // Fetch RDF base URL and make the API request
                OntologyUIClientUtils.getRDFBaseURLPromise('ontology', tenantId, pillar)
                    .then((url) => {
                    if (switchToVersion3) {
                        url = url.replace('v2', 'v3');
                    }
                    const fullURL = `${url}${endpoint}`;
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'GET',
                        headers: OntologyUIClientUtils.getRequestHeaders(lang),
                        timeout: 40000,
                        onComplete: (response, info, request) => {
                            try {
                                const jsResp = JSON.parse(response);
                                jsResp.code = request.status;
                                resolve(OntologyUIClientUtils.formatMessage(jsResp));
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.UNEXPECTED_ERROR, e instanceof Error ? e.message : e));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils.buildError(OntologyUIClientUtils.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        }
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        getWSversion(service) {
            const settings = JSON.parse(OntologyUIClientSettings_json_1.default);
            const version = settings[`${service}WSVersion`] || 'v2';
            return version;
        },
        getLanguage(iParams) {
            var lang = 'en';
            if (iParams !== undefined || iParams !== null) {
                // if (iParams.lang !== undefined && Core.is(iParams.lang, 'string') && iParams.lang.length > 0) {
                //E65 (28-6-25): avoid using Core just for checking the type of a value!
                if (iParams.lang !== undefined && (typeof iParams.lang === 'string') && iParams.lang.length > 0) {
                    lang = iParams.lang;
                }
                else if (widget) {
                    lang = widget.lang;
                }
            }
            return lang;
        },
        getRequestHeaders(iLang, prefix, iLongURI) {
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
            if (iLang) {
                headers['Accept-Language'] = iLang;
            }
            if (iLongURI && prefix) {
                const sanitizedURI = iLongURI.replace('<', '').replace('>', '');
                headers['dsprefix'] = `${prefix}=${sanitizedURI}`;
            }
            return headers;
        },
        getHeaders(iLang) {
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
            if (iLang) {
                headers['Accept-Language'] = iLang;
            }
            return headers;
        },
        isLongURI(uri) {
            return ((uri.startsWith('<') && uri.endsWith('>')) ||
                uri.startsWith('http://') ||
                uri.startsWith('https://'));
        },
        generateTempPrefix: function () {
            return this.TMPPREFIX + Date.now();
        },
        getRequestInfo(resourceId, lang, Headers) {
            let id = resourceId;
            let headers;
            if (this.isLongURI(resourceId)) {
                const tmpPrefix = this.generateTempPrefix();
                const resourceName = this.getResourceFromURI(resourceId);
                const tmpURI = resourceId.replace('<', '').replace('>', '');
                const prefixValue = tmpURI.substring(0, tmpURI.length - resourceName.length);
                id = `${tmpPrefix}:${resourceName}`;
                headers = this.getRequestHeaders(lang, tmpPrefix, prefixValue);
            }
            else {
                headers = this.getRequestHeaders(lang);
            }
            return {
                id,
                headers: Object.assign(Object.assign({}, headers), Headers) // Fusion propre des headers
            };
        },
        async getRDFBaseURLPromise(service, tenantId, pillar, app = 'resources') {
            const that = this;
            return new Promise((resolve, reject) => {
                i3DXCompassPlatformServices_1.default.getServiceUrl({
                    serviceName: service,
                    platformId: tenantId,
                    onComplete: (urlData) => {
                        if (urlData && urlData.length > 0) {
                            const url = `${urlData}/${pillar}/${app}/${that.getWSversion(service)}/`;
                            resolve(url);
                        }
                        else {
                            // MHR16 (13-06-25): if Ontology URL is not found, fallback to 3dswym
                            i3DXCompassPlatformServices_1.default.getServiceUrl({
                                serviceName: '3DSwym',
                                platformId: tenantId,
                                onComplete: function (swymUrl) {
                                    if (!swymUrl || swymUrl.length < 1) {
                                        return reject(that.buildError(that.errorCodes.PASSPORT_ERROR, 'URL cannot be computed'));
                                    }
                                    swymUrl = swymUrl.replace('3dswym', 'ontology');
                                    const url = `${swymUrl}/${pillar}/${app}/${that.getWSversion(service)}/`;
                                    resolve(url);
                                }
                            });
                        }
                        // if (!urlData || urlData.length < 1) {
                        //   return reject(that.buildError(that.errorCodes.PASSPORT_ERROR, 'URL cannot be computed'));
                        // }
                        // const url = `${urlData}/${pillar}/${app}/${that.getWSversion(service)}/`;
                        // resolve(url);
                    },
                    onFailure: (data) => {
                        reject(that.buildError(that.errorCodes.PASSPORT_ERROR, data));
                    },
                });
            });
        },
        formatMessage(result, toSort = true) {
            if (!result) {
                return;
            }
            const formatTypes = (object) => {
                if (typeof object !== 'object') {
                    return object;
                }
                const typeValue = object['@type'];
                if (typeValue) {
                    if (typeValue === 'Literal') {
                        return object.label;
                    }
                }
                Object.keys(object).forEach((key) => {
                    const keyValue = object[key];
                    if (Array.isArray(keyValue)) {
                        object[key] = keyValue.map((item) => formatTypes(item));
                    }
                    else if (typeof keyValue === 'object') {
                        object[key] = formatTypes(keyValue);
                    }
                });
                return object;
            };
            const sortArray = (arrayOfObjects) => {
                arrayOfObjects.sort((a, b) => {
                    const labelA = a.label.toUpperCase();
                    const labelB = b.label.toUpperCase();
                    return labelA.localeCompare(labelB);
                });
            };
            if (Array.isArray(result) && toSort) {
                let isArrayContained = true;
                for (let i = 0; i < result.length; i++) {
                    result[i] = formatTypes(result[i]);
                    if (Array.isArray(result[i])) {
                        sortArray(result[i]);
                    }
                    else {
                        isArrayContained = false;
                    }
                }
                if (!isArrayContained) {
                    sortArray(result);
                }
            }
            else if (typeof result === 'object') {
                result = formatTypes(result);
            }
            return result;
        },
        buildError(errorCode, errorMessage) {
            return { code: errorCode, message: errorMessage };
        },
    };
    exports.default = OntologyUIClientUtils;
});
