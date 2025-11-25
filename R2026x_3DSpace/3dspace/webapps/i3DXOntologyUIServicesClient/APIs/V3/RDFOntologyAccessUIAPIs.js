/**
 * @overview Provide access to RDF ontologies. Initially developed for Ontology service.
 * @file RDFOntologyAccessUIAPIs.ts provides functions for apps to access OOTB and user-imported ontologies deployed on Ontology service.
 * @licence Copyright 2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 */
///<amd-module name="DS/i3DXOntologyUIServicesClient/APIs/V3/RDFOntologyAccessUIAPIs"/>
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("DS/i3DXOntologyUIServicesClient/APIs/V3/RDFOntologyAccessUIAPIs", ["require", "exports", "DS/i3DXOntologyUIServicesClient/Utils/OntologyUIClientUtils", "DS/WAFData/WAFData"], function (require, exports, OntologyUIClientUtils_1, WAFData_1) {
    "use strict";
    OntologyUIClientUtils_1 = __importDefault(OntologyUIClientUtils_1);
    WAFData_1 = __importDefault(WAFData_1);
    // Constants
    const rdfService = 'ontology';
    // interface FormattedResponse {
    //   code: number;
    //   [key: string]: any;
    // }
    // API Object
    const RDFOntologyAccessUIAPIs = {
        /**
        * Returns classes of a dataset
        * @param {object} iParams JSON object containing
        * tenantId: string
        * applicativeId  - Applicative Id (dataset uuid) which is used to identify the ROSA file
        * fts - Filter responses by label
        * searchableFields: List of properties on which we will apply the fts.
        * limit - Limit for pagination
        * offset - Offset for pagination
        * onlyRoot - Returns only root items if true
        * selectables - Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
        * oxCompliant - boolean
        * withResourcesURL - [optional] Whether the resource urls needs to be returned.
        * withIcons- [optional] Whether the resource'icon  needs to be returned.
        * @returns {object} Promise with JSON object for resolve and error JSON object for reject
        */
        async getClasses(iParams) {
            // Prepare the updated parameters
            const updatedParams = Object.assign(Object.assign({}, iParams), { resourceType: 'classes', switchToVersion3: true });
            // Call the function and return the result
            return await OntologyUIClientUtils_1.default.getOntologyResourceList(updatedParams);
        },
        /**
        * Returns concepts of a dataset
        * @param {object} iParams JSON object containing
        * tenantId: string
        * applicativeId  - Applicative Id (dataset uuid) which is used to identify the ROSA file
        * [fts] - Filter responses by label
        * [searchableFields] - List of properties on which we will apply the fts.
        * [limit] - Limit for pagination
        * [offset] - Offset for pagination
        * [type] - Filter responses by class type with entailement (OR filter if multiple values are passed)
        * [onlyRoot] - Returns only root items
        * [selectables] - Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
        * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
        * [oxCompliant] - boolean
        * withIcons - [optional] Whether the resource'icon  needs to be returned.
        * @returns {object} Promise with JSON object for resolve and error JSON object for reject
        */
        async getConcepts(iParams) {
            // Ensure the resource type is set to 'concepts'
            const params = Object.assign(Object.assign({}, iParams), { resourceType: 'concepts', switchToVersion3: true });
            // Call the function and return the result
            return await OntologyUIClientUtils_1.default.getOntologyResourceList(params);
        },
        /**
        * Returns properties of a dataset
        * @param {object} iParams JSON object containing
        * tenantId: string;
        * applicativeId  - Applicative Id (dataset uuid) which is used to identify the ROSA file
        * fts - Filter responses by label
        * searchableFields: List of properties on which we will apply the fts.
        * limit : Limit for pagination
        * offset : Offset for pagination
        * type: Filter responses by property type with entailement (OR filter if multiple values are passed)
        * domain: Filter properties by domain (OR filter if multiple values are passed)
        * range: Filter properties by range (OR filter if multiple values are passed)
        * onlyRoot: If true then Returns only root items
        * selectables: Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
        * oxCompliant: boolean
        * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
        * withIcons - [optional] Whether the resource'icon  needs to be returned.
        * @returns {object} Promise with JSON object for resolve and error JSON object for reject
        */
        async getProperties(iParams) {
            const params = Object.assign(Object.assign({}, iParams), { resourceType: 'properties', switchToVersion3: true });
            return OntologyUIClientUtils_1.default.getOntologyResourceList(params);
        },
        /**
         * Returns individuals of a dataset
         * @param {object} iParams JSON object containing
         * tenantId: string;
         * applicativeId  - Applicative Id (dataset uuid) which is used to identify the ROSA file
         * [fts] - Filter responses by label
         * searchableFields : List of properties on which we will apply the fts.
         * limit : Limit for pagination
         * offset : Offset for pagination
         * type : Filter responses by class type with entailement (OR filter if multiple values are passed)
         * selectables - Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional
         * oxCompliant - boolean
         * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
         * withIcons - [optional] Whether the resource'icon  needs to be returned.
         * @returns {object} Promise with JSON object for resolve and error JSON object for reject
         */
        async getIndividuals(iParams) {
            const params = Object.assign(Object.assign({}, iParams), { resourceType: 'individuals', switchToVersion3: true });
            return await OntologyUIClientUtils_1.default.getOntologyResourceList(params);
        },
        /**
          * Returns properties of a given property
          * @param {object} iParams JSON object containing
          * tenantId: string
          * applicativeId: string
          * ids: Comma-separated list of URIs representing the properties whose children are to be retrieved
          * searchableFields : List of properties on which we will apply the fts.
          * limit : Limit for pagination
          * offset: Offset for pagination
          * type: Filter responses by property type with entailement (OR filter if multiple values are passed)
          * domain: Filter properties by domain (OR filter if multiple values are passed)
          * range: Filter properties by range (OR filter if multiple values are passed)
          * selectables: Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
          * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
          * oxCompliant - optional
          * withIcons - [optional] Whether the resource'icon  needs to be returned.
          * @returns {object} Promise with JSON object for resolve and error JSON object for reject
          */
        async getSubProperties(iParams) {
            const { tenantId, applicativeId, ids, fts, searchableFields, limit, offset, type, domain, range, selectables, withResourcesURL, oxCompliant, withIcons } = iParams;
            // Validate required parameters
            if (!ids || ids.trim() === '') {
                throw OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing list of property ids.');
            }
            if (!applicativeId) {
                throw OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.applicativeId parameter');
            }
            // Determine RDF pillar
            let pillar = applicativeId === 'odtMode' ? '3DRDF' : '3drdfdc';
            // Get language
            const lang = OntologyUIClientUtils_1.default.getLanguage(iParams);
            // Build query parameters
            const queryParams = new URLSearchParams();
            queryParams.set('applicativeId', applicativeId);
            queryParams.set('ids', ids); // no need for encodeURIComponent
            if (fts)
                queryParams.set('fts', fts);
            if (searchableFields)
                queryParams.set('searchableFields', searchableFields);
            if (selectables)
                queryParams.set('selectables', selectables);
            if (typeof limit === 'number')
                queryParams.set('limit', `${limit}`);
            if (typeof offset === 'number')
                queryParams.set('offset', `${offset}`);
            if (typeof type === 'number')
                queryParams.set('type', `${type}`);
            if (domain)
                queryParams.set('domain', domain);
            if (range)
                queryParams.set('range', range);
            if (withResourcesURL)
                queryParams.set('withResourcesURL', `${withResourcesURL}`);
            if (oxCompliant)
                queryParams.set('oxCompliant', `${oxCompliant}`);
            if (withIcons)
                queryParams.set('withIcons', `${withIcons}`);
            const endpoint = `properties/subproperties?${queryParams.toString()}`;
            try {
                const baseUrl = await OntologyUIClientUtils_1.default.getRDFBaseURLPromise(rdfService, tenantId, pillar);
                const sanitizedUrl = baseUrl.replace(/\/$/, '').replace('v2', 'v3');
                const fullURL = `${sanitizedUrl}/${endpoint}`;
                return await new Promise((resolve, reject) => {
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'GET',
                        headers: OntologyUIClientUtils_1.default.getHeaders(lang),
                        timeout: 40000,
                        onComplete: (response) => {
                            try {
                                const jsResp = JSON.parse(response);
                                resolve(OntologyUIClientUtils_1.default.formatMessage(jsResp));
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.UNEXPECTED_ERROR, e instanceof Error ? e.message : String(e)));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        }
                    });
                });
            }
            catch (error) {
                throw error;
            }
        },
        /**
        * Returns classes or lineages of a given class.
        * @param {object} iParams JSON object containing
        * tenantId: string
        * [applicativeId] The id of the dataset containing the published ontologies being accessed
        * [ids] : Comma-separated list of URIs representing the classes whose children are to be retrieved
        * [fts] Filter responses by label.
        * [searchableFields] List of properties on which we will apply the fts.
        * [limit]: number. Used for pagination. The number of results returned.
        * [offset]: number. Used for pagination. Page number.
        * [selectables]: Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
        * [oxCompliant]: boolean
        * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
        * withIcons - [optional] Whether the resource'icon  needs to be returned.
        * @returns {object} Promise with JSON object for resolve and error JSON object for reject
        */
        async getSubClasses(iParams) {
            const { ids } = iParams;
            // Validate the required parameters early
            if (!ids) {
                throw new Error("Missing list of classes URI");
            }
            // Prepare the updated parameters
            const updatedParams = Object.assign(Object.assign({}, iParams), { resourceType: 'classes', switchToVersion3: true });
            return OntologyUIClientUtils_1.default.getClassResourceList(updatedParams);
        },
        /**
         * Returns all sub-concepts or lineages of a provided concept.
         * @param {IParams} iParams - JSON object containing the concept short URI, applicativeId, and other optional parameters.
         * tenantId: string
         * ids: Comma-separated list of URIs representing the concepts whose children are to be retrieved
         * [applicativeId]: the Dataset ID
         * [fts] Filter responses by label
         * [lang]: string Default value "en".
         * [searchableFields] A list of searchable fields for fts search.
         * [limit]: integer. Used for pagination. The number of results returned.
         * [offset]: integer. Used for pagination. Page number.
         * [type] : Filter responses by class type with entailement (OR filter if multiple values are passed)
         * [selectables] : Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties.
         * [oxCompliant] : boolean
         * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
         * withIcons - [optional] Whether the resource'icon  needs to be returned.
         * @returns {Promise<any>} Resolves with the formatted response or rejects with an error.
         */
        async getSubConcepts(iParams) {
            return new Promise((resolve, reject) => {
                const { tenantId, ids, applicativeId, fts, searchableFields, limit, offset, type, selectables, oxCompliant, withResourcesURL, withIcons } = iParams;
                const lang = OntologyUIClientUtils_1.default.getLanguage(iParams);
                // const { headers } = OntologyUIClientUtils.getRequestInfo(ids, lang, iParams.headers);
                // Validate tenantId
                if (!tenantId) {
                    return reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing tenantId parameter'));
                }
                // Validate ids
                if (!ids) {
                    return reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing list of URIs'));
                }
                let pillar = '3drdfdc';
                if (iParams.applicativeId == 'odtMode') {
                    pillar = '3DRDF';
                }
                ;
                // Build query parameters
                const queryParams = new URLSearchParams();
                if (applicativeId) {
                    queryParams.set('applicativeId', applicativeId);
                }
                if (fts)
                    queryParams.set('fts', fts);
                if (searchableFields)
                    queryParams.set('searchableFields', encodeURIComponent(JSON.stringify(searchableFields)));
                if (selectables)
                    queryParams.set('selectables', encodeURIComponent(JSON.stringify(selectables)));
                if (limit)
                    queryParams.set('limit', `${limit}`);
                if (offset !== undefined && offset !== null)
                    queryParams.set('offset', `${offset}`);
                if (ids) {
                    queryParams.set('ids', `${ids}`);
                }
                if (type) {
                    queryParams.set('type', `${type}`);
                }
                if (oxCompliant) {
                    queryParams.set('oxCompliant', `${oxCompliant}`);
                }
                if (withResourcesURL) {
                    queryParams.set('withResourcesURL', `${withResourcesURL}`);
                }
                if (withIcons) {
                    queryParams.set('withIcons', `${withIcons}`);
                }
                // Construct the endpoint
                let endpoint;
                endpoint = `concepts/subconcepts?${queryParams.toString()}`;
                // Fetch RDF base URL and make the API request
                OntologyUIClientUtils_1.default.getRDFBaseURLPromise(rdfService, tenantId, pillar)
                    .then((url) => {
                    url = url.replace('v2', 'v3');
                    const fullURL = `${url}${endpoint}`;
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'GET',
                        headers: OntologyUIClientUtils_1.default.getHeaders(lang),
                        timeout: 40000,
                        onComplete: (response, info, request) => {
                            try {
                                const jsResp = JSON.parse(response);
                                // Store the response in local storage
                                // LocalStorageUtils._saveChildren(applicativeId, resourceId, jsResp, iParams);
                                let resp;
                                resp = OntologyUIClientUtils_1.default.formatMessage(jsResp);
                                resp.code = request.status;
                                resolve(resp);
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.UNEXPECTED_ERROR, e.message || e));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        },
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        /**
       * Returns all information of a given Resource
       * @param {object} iParams JSON object containing
       * ids : Comma-separated list of URIs representing the resources whose informations are to be retrieved.
       * withIcons- [optional] Whether the resource'icon  needs to be returned.
       * [withResourcesURL] - [optional] Whether the resource urls needs to be returned.
       * selectables :Additional properties to be retrieved as a comma-separated list. Use 'none' to retrieve no additional properties and 'all' to retrieve all properties.
       * @returns {object} Promise with JSON object for resolve and error JSON object for reject
       */
        async getResourceInfo(iParams) {
            const lang = OntologyUIClientUtils_1.default.getLanguage(iParams);
            const { applicativeId, ids, selectables, inSelectables, oxCompliant, tenantId, withResourcesURL, withIcons } = iParams;
            // Vérification du cache
            // const cachedData = LocalStorageUtils._getStoredResourceInfo(applicativeId, ids, lang);
            // if (cachedData) {
            //   let allExist = true;
            //   if (Array.isArray(selectables) && selectables.length > 0) {
            //     // Extraire les valeurs et vérifier leur présence dans cachedData
            //     const allValues = selectables.map(item => item.value);
            //     allExist = allValues.every(value => Object.prototype.hasOwnProperty.call(cachedData, value));
            //   }
            //   for (const key in cachedData) {
            //     if (cachedData[key] === null) {
            //       delete cachedData[key];
            //     }
            //   }
            //   if (allExist) {
            //     let storedRes = Promise.resolve(OntologyUIClientUtils.formatMessage(cachedData));;
            //     return storedRes; // S'assurer que c'est une promesse
            //   }
            // }
            return new Promise(async (resolve, reject) => {
                if (!applicativeId) {
                    return reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.applicativeId parameter'));
                }
                if (!tenantId) {
                    return reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.tenantId parameter'));
                }
                // Détermination du pillar
                const pillar = applicativeId === 'odtMode' ? '3DRDF' : '3drdfdc';
                // const selectablesParam = selectables?.length ? `&selectables=${encodeURIComponent(JSON.stringify(selectables))}` : ''; 
                const selectablesParam = (selectables === null || selectables === void 0 ? void 0 : selectables.length) ? `&selectables=${encodeURIComponent(selectables)}` : '';
                const inSelectablesParam = (inSelectables === null || inSelectables === void 0 ? void 0 : inSelectables.length) ? `&inSelectables=${encodeURIComponent(inSelectables)}` : '';
                const oxCompliantParam = oxCompliant ? `&oxCompliant=${oxCompliant}` : '';
                const withIconsParam = oxCompliant ? `&withIcons=${withIcons}` : '';
                const resourceURLParam = withResourcesURL ? `&withResourcesURL=${withResourcesURL}` : '';
                // const idsParam = `&ids=${ids}`;
                const idsParam = `&ids=${encodeURIComponent(ids)}`;
                let endpoint = `resources/info`;
                endpoint += `?applicativeId=${applicativeId}${idsParam}${selectablesParam}${inSelectablesParam}${oxCompliantParam}${withIconsParam}${resourceURLParam}`;
                try {
                    let url = await OntologyUIClientUtils_1.default.getRDFBaseURLPromise(rdfService, tenantId, pillar);
                    url = url.replace('v2', 'v3');
                    const fullURL = `${url}${endpoint}`;
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'GET',
                        headers: OntologyUIClientUtils_1.default.getHeaders(lang),
                        timeout: 20000,
                        onComplete: (response) => {
                            try {
                                const jsResp = JSON.parse(response);
                                // LocalStorageUtils._saveResourceInfo(applicativeId, ids, jsResp, lang, selectables);
                                resolve(OntologyUIClientUtils_1.default.formatMessage(jsResp));
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.UNEXPECTED_ERROR, e));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        },
        /**
         * Execute query.
         * @param {object} iParams JSON object containing:
         *   - applicativeId: string
         *   - tenantId : string
         *   - iQuery : Sparql request to be executed
         *   - [lang]: string (Default value "en").
         * @returns {Promise<object>} Promise with JSON object for resolve and error JSON object for reject.
         */
        async runSparqlSelect(iParams) {
            // iQuery:  The query to execute. Should be aligned with the query type.
            return new Promise((resolve, reject) => {
                // Input validation
                if (!iParams || !iParams.applicativeId) {
                    reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.applicativeId parameter'));
                    return;
                }
                // Input validation
                if (!iParams.tenantId) {
                    reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing iParams.tenantId parameter'));
                    return;
                }
                // Extract parameters
                const lang = OntologyUIClientUtils_1.default.getLanguage(iParams);
                let pillar = '3drdfdc';
                if (iParams.applicativeId == 'odtMode') {
                    pillar = '3DRDF';
                }
                ;
                const applicativeId = iParams.applicativeId;
                let tenantId = iParams.tenantId;
                // Prepare endpoint
                let endpoint = 'queries/select';
                endpoint += `?applicativeId=${applicativeId}`;
                // Request URL
                OntologyUIClientUtils_1.default.getRDFBaseURLPromise(rdfService, tenantId, pillar)
                    .then((url) => {
                    url = url.replace('v2', 'v3');
                    const fullURL = `${url}${endpoint}`;
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'POST',
                        headers: OntologyUIClientUtils_1.default.getHeaders(lang),
                        timeout: 40000,
                        data: JSON.stringify([iParams.iQuery]),
                        onComplete: (response) => {
                            try {
                                const jsResp = JSON.parse(response);
                                resolve(jsResp);
                            }
                            catch (e) {
                                reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.UNEXPECTED_ERROR, e));
                            }
                        },
                        onFailure: (data) => {
                            reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WEB_SERVICE_CALL_ERROR, `Error when calling the server. Check the inputs. ${data}`));
                        }
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        /**
       * Returns the resource URLs for a list of resources.
       * @param {IParams} iParams - JSON object containing applicativeId and tenantId.
       * resourceURIs : An array contains the resources URIs (concepts, classes, etc.)
       * applicativeId : Dataset ID
       * tenantId: string;
       * @returns {Promise<FormattedResponse>} Resolves with formatted resource URLs or rejects with error.
       */
        async getResourcesURLs(iParams) {
            try {
                // Validate iParams
                if (!iParams || !iParams.applicativeId || !iParams.tenantId) {
                    throw OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WRONG_OR_MISSING_INPUT, 'Missing or invalid iParams (applicativeId or tenantId).');
                }
                // Set default values
                let pillar = '3drdfdc';
                if (iParams.applicativeId == 'odtMode') {
                    pillar = '3DRDF';
                }
                ;
                const { tenantId, applicativeId } = iParams;
                // Construct endpoint URL
                const endpoint = `resources/url?applicativeId=${encodeURIComponent(applicativeId)}`;
                let baseUrl = await OntologyUIClientUtils_1.default.getRDFBaseURLPromise(rdfService, tenantId, pillar);
                baseUrl = baseUrl.replace('v2', 'v3');
                // Prepare the request body
                const bodyData = JSON.stringify(iParams.resourceURIs || []); // Defaults to an empty array if resourceURIs is undefined
                // Send authenticated request to retrieve URLs
                const fullURL = `${baseUrl}${endpoint}`;
                const response = await new Promise((resolve, reject) => {
                    WAFData_1.default.authenticatedRequest(fullURL, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        timeout: 40000,
                        data: bodyData,
                        onComplete: (response, request) => resolve({ response, request }),
                        onFailure: (errorData) => reject(OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.WEB_SERVICE_CALL_ERROR, `Server error. Check inputs: ${errorData}`)),
                    });
                });
                // Parse and format response
                const jsResp = JSON.parse(response.response);
                const formattedResponse = OntologyUIClientUtils_1.default.formatMessage(jsResp);
                formattedResponse.code = response.request.status;
                return formattedResponse;
            }
            catch (error) {
                // Throw formatted error
                throw OntologyUIClientUtils_1.default.buildError(OntologyUIClientUtils_1.default.errorCodes.UNEXPECTED_ERROR, `Unexpected error: ${error.message || error}`);
            }
        },
    };
    return RDFOntologyAccessUIAPIs;
});
