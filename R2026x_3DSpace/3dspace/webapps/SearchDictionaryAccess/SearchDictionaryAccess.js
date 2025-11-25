'use strict';

define('DS/SearchDictionaryAccess/SearchRequestUtils',
      ['DS/WAFData/WAFData'],
function (WAFData){

  var requestUtils = {

    sendRequest: function(iURL, iOptions, iWithoutAuth){
      if (!iURL){
        return;
      }
      if (!iOptions){
        iOptions = {};
      }
      if (iWithoutAuth){
        WAFData.proxifiedRequest(iURL, iOptions);
      }
      else {
        WAFData.authenticatedRequest(iURL, iOptions);
      }
    }
  };
  return requestUtils;
});

'use strict';

/*global Promise console widget sessionStorage window*/
/*jslint plusplus: true*/
define('DS/SearchDictionaryAccess/SearchDicoUtils',
  ['UWA/Core',
   'DS/SixwDictionaryAccess/SixwDicoUtils',
   'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
   'text!DS/SixwDictionaryAccess/assets/SixwDicoSettings.json'],

  function (Core, SixwDicoUtils, PlatformServices, DicoSettings) {



    var dicoUtils = {


      getServiceToSearchIn: function(services, options){
        // default value for any source
        var source = '3DSpace';
        if (!SixwDicoUtils.isRDFOnER(options)) {
          source = DicoSettings.CloudOntologyService;
        }
        var servicesSettings = SixwDicoUtils.getservices();
        var service, serviceSettings, federatedSource;
        var allRDF = true, i;

        // nominal case
        if (services.length === 1){
          service = services[0];
          serviceSettings = servicesSettings[service];
          if (!serviceSettings || serviceSettings.federatedOn === 'FEDERATED_SERVICE'){
            // service is not defined, by default all calls should be redirected to federated service (3DSpace)
            return source;
          }
          federatedSource = serviceSettings.federatedOn;
          if (!federatedSource){
            // by default search in the same service
            if (serviceSettings.serviceName){
              return serviceSettings.serviceName;
            }
            return service;
          }
          // if set, search in federated source as defined in the settings.
          return federatedSource;
        }

        // strange case: need to retrieve 1 service to search in for a list of services
        for (i=0; i<service.length; i++){
          // at least one of the sources is the federated one (e.g. 3DSpace) --> search in default service
          federatedSource = servicesSettings[service].federatedOn;
          if (servicesSettings[service] && ( federatedSource === source || federatedSource === 'FEDERATED_SERVICE')){
            return source;
          }
          if (allRDF && !SixwDicoUtils.isRDFService(service[i])){
            allRDF = false;
          }
        }
        // if only RDF services --> pick the first one
        if (allRDF){
          return service[i];
        }
        // if heterogeous services --> search in default one
        else {
          return source;
        }
      },


      addPropValuesToCache: function(storageName, properties, source){
        if (!window.sessionStorage){
          return;
        }
        var localValues = {};
        var allLocalValues = sessionStorage.getItem(storageName);

        if (!allLocalValues){
          allLocalValues = {};
        }
        else {
          allLocalValues = JSON.parse(allLocalValues);
          if (source){
            if (allLocalValues[source]){
              localValues = allLocalValues[source];
            }
          } else {
            localValues = JSON.parse(allLocalValues);
          }
        }
        localValues = this.mergePropValues(localValues, properties);
        var toCache = {};
        if (source){
          toCache[source]=localValues;
          // add caches of other sources
          for (var s in allLocalValues){
            if (s === source){
              continue;
            }
            toCache[s] = allLocalValues[s];
          }
        } else {
          toCache = localValues;
        }
        sessionStorage.setItem(storageName, JSON.stringify(toCache));
      },

      mergePropValues: function (toBeMergedTo, toMerge){
        if (toMerge && Object.keys(toMerge)){
          for (var propId in toMerge) {
            for (var v in toMerge[propId]) {
              if (!toBeMergedTo.hasOwnProperty(propId)){
                toBeMergedTo[propId] = toMerge[propId];
              }
              toBeMergedTo[propId][v] = toMerge[propId][v];
            }
          }
        }
        return toBeMergedTo;
      },

      /************************************************************
      *   Below are conversion functions for backward compatibility
      ************************************************************/
      /*
       * From
       * { "vocabularyElementNLSInfo":[
        { "uri":"ds6w:classification",
        "type":"Predicate",
        "nlsName":"Classification",
        "lang":"en",
        "dataType":"string"
        },
         ]
        }
       */
        convertToR420ElementsNls: function (data) {
          var retData = { vocabularyElementNLSInfo: null };
          if (data === null){
             return retData;
          }
          var elemInfoList = [], elemInfo;
          for (var i = 0; i < data.length; i++) {
            elemInfo = {
              uri: data[i].curi,
              type: data[i].metaType,
              nlsName: data[i].label
              //description: data[i].description
            };
            if (data[i].metaType === 'Property' || data[i].metaType === 'Predicate'){
              elemInfo.type = 'Predicate';
              elemInfo.dataType = data[i].dataType;
            }
            elemInfoList.push(elemInfo);
          }
          retData.vocabularyElementNLSInfo = elemInfoList;
          return retData;
        }

    };

    return dicoUtils;
  });

/*global sessionStorage Promise console*/

'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchRequestUtils'],

  function (Core, DicoUtils, SearchDicoUtils, RequestUtils) {

    var dicoReadAPI = {

      defaultERService: '3DSpace',

      getElementsNLSNames: function (cbFuncs, iElements, has6WPredicates) {
        if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
          cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
        }
        var webservice = 'ElementsNLSNames';
        var endpoint='/resources/6WVocab/access/';
        if (has6WPredicates){
          // Modification FRH / 27/3/2024: using Elements6WNLSNames instead of ElementsNLSNames
          webservice = 'Elements6WNLSNames';
          endpoint='/resources/6WVocab2/access/';
        }
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          DicoUtils.getServiceBaseURLPromiseInternal(endpoint,ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + webservice + '?tenant=' + cbFuncs.tenantId;
            var headers = {};
            headers['Accept-Language'] = cbFuncs.lang;
            headers['Content-Type'] = 'text/plain';
            headers.Accept = 'application/json';

            // SDM: UPDATE CACHE OUTSIDE // PROMISE's AND IN HIGH-LEVEL API 
            /*
            var language = cbFuncs.lang;
            var storageName = DicoUtils.dicoElemsBaseKey + language;
            var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }
            */

            var result = [];
            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: iElements.toString(),
              onComplete: function (response) {
                try {
                  var responseParse = JSON.parse(response);
                  var i = 0, elt, termInfo;
                  for (; responseParse.vocabularyElementNLSInfo[i];) {
                    elt = responseParse.vocabularyElementNLSInfo[i];
                    // convert in new format
                    termInfo = {
                      curi: elt.uri,
                      label: elt.nlsName,
                      metaType: elt.type
                    };
                    if (elt.type === 'Predicate'){
                      termInfo.dataType = elt.dataType;
                    }
                    // localValues[elt.uri] = termInfo;
                    // feed result based on new format
                    result.push(termInfo);
                    i++;
                  }
                  // sessionStorage.setItem(storageName, JSON.stringify(localValues));
                  if (cbFuncs.apiVersion !== 'R2019x'){
                    result = DicoUtils.convertToR420ElementsNls(result);
                  }
                  resolve(result);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result ***');
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            });
        },
        function(errMessage){
          reject(errMessage);
        });
      });
      },


      getAttributesNlsValues: function (cbFuncs, iElements, has6WPredicates) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          var result = {};
          if (Core.is(cbFuncs.lang, 'string')){
            language = cbFuncs.lang;
          }

          var storageName = DicoUtils.dicoPropValuesBaseKey + language;
          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }

          DicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = '';

            if (has6WPredicates) {
              fullURL = url + 'PredicateValue?tenant=' + cbFuncs.tenantId;
            }
            else {
              fullURL = url + 'AttributeNlsValues?tenant=' + cbFuncs.tenantId;
            }
            var headers = {};
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';

            /*var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }*/

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: JSON.stringify(iElements),
              onComplete: function (response) {
                var jsResponse;
                try {
                  jsResponse = JSON.parse(response);
                  var respKeys = Object.keys(jsResponse);
                  var i = 0, uri;
                  for (i = 0; i < respKeys.length; i++) {
                    uri = respKeys[i];
                    /*if (localValues[uri]){
                      localValues[uri] = Object.assign(localValues[uri],jsResponse[uri]);
                    } else {
                      localValues[uri] = jsResponse[uri];
                    }*/
                    result[uri] = jsResponse[uri];
                  }
                  //sessionStorage.setItem(storageName, JSON.stringify(localValues));
                  SearchDicoUtils.addPropValuesToCache(storageName, result, ERService); // add to cache
                  resolve(result);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result *** ' + e);
                  resolve(jsResponse);
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            });
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      }
    };


    return dicoReadAPI;
  });

/*global sessionStorage Promise console widget*/

'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccessRDF',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',    
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchRequestUtils'], 

  function (Core, DicoUtils, SearchDicoUtils, RequestUtils) {

    var dicoReadAPI = {



      // This service is called to fetch values within RDF service
      getNlsOfPropertyValues: function (iService, cbFuncs, iElements) {
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string')){
            language = cbFuncs.lang;
          }
          else if (widget){
            language = widget.lang;
          }

          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getNlsOfPropertyValues?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Content-Type'] = 'application/json';
            headers['Accept-Language'] = language;
            headers['X-Requested-With'] = 'XMLHttpRequest';

            var input = JSON.stringify(iElements);
            RequestUtils.sendRequest(fullURL,
            {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: JSON.stringify([input]),
              onComplete: function (response) {
                var jsRes;
                try {
                  jsRes = JSON.parse(response);
                }
                catch (e){
                  console.warn('*** Warning: server returned empty result ***');
                  return resolve();
                }
                var result = jsRes['@result'];
                if (window.sessionStorage){
                  var storageName = DicoUtils.dicoPropValuesBaseKey + DicoUtils.getLanguage(cbFuncs);
                  SearchDicoUtils.addPropValuesToCache(storageName, result, iService); // add to cache
                }
                return resolve(result);
              },
              onFailure: function (data) {
                return reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      }
    };
    return dicoReadAPI;

});

/**
 * @overview Provide services for applications to translate 6W properties and values retrieved from federated search
 * @file SearchDictionaryAccessAPI.js provides 2 functions: get6wResourcesInfo & getNlsOfSearchValuesBySource
 * @licence Copyright 2017 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 */

/*global widget, window, sessionStorage, Promise*/
/*jslint plusplus: true*/
'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccessAPI',
  ['UWA/Core',
    'UWA/Class/Promise',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace',
    'DS/SearchDictionaryAccess/SearchDictionaryAccessRDF'],

  /**
   * <p>
   * This module aims at providing APIs for user experience of apps, to translate 6W properties and values
   * <p>
   * The exposed APIs return their output asynchronously as data may
   * require a back-end request to be retrieved.
   * </p>
   *
   */
  function (Core, UWAPromise, DicoUtils, SearchDicoUtils, SearchDictionaryAccess3DSpace, SearchDictionaryAccessRDF) {

    var _OntoService = DicoUtils.initSrvRequest();

    var retrievePropValuesFromCache = function (source, propValsElems, cbFuncs) {
      // NLS are now cached by source
      var jsPropValues = propValsElems;

      if (typeof propValsElems === 'string' || propValsElems instanceof String){
        // parse to json only if needed
        jsPropValues = JSON.parse(propValsElems);
      }

      var to_dwnld = {}, propValsCached = {}, cacheMissVals = [];
      var propId, propVals, vals = [];
      if (!jsPropValues){
        return;
      }

      //SGA5: if error, still return array of 2
      if (!window.sessionStorage) {
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      //SGA5: if error, still return array of 2
      if (!Core.is(cbFuncs, 'object')) {
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      var language = DicoUtils.getLanguage(cbFuncs);

      var storageName = DicoUtils.dicoPropValuesBaseKey + language;

      var localValues = sessionStorage.getItem(storageName);
      //SGA5: if no NLS found, still return array of 2
      try {
        if (!localValues || !JSON.parse(localValues)[source]) {
          cacheMissVals[0] = {};
          cacheMissVals[1] = jsPropValues;
          return cacheMissVals;
        } else {
          localValues = JSON.parse(localValues)[source];
        }
      } catch (e){ // issue when parsing to JSON
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      var propIds = Object.keys(jsPropValues);

      for (var i = 0; i < propIds.length; i++) {
        vals = [];
        propId = propIds[i];
        // console.log("*** retrieve propId.: " + propId);
        propVals = localValues[propId];
        if (!propVals) {
          /*
           * console.log(" > Property not retrieved from cache, hence need to call WS: " + propId);
           */
          to_dwnld[propId] = jsPropValues[propId];
        } else {
          // console.log(" > Property found in cache: " + propId);
          var searchedVals = jsPropValues[propId];
          var nbSearchedVals = searchedVals.length;
          var objVals = {};
          for (var j = 0; j < nbSearchedVals; j++) {
            var v = searchedVals[j];
            // console.log("looking for value: " + v);
            if (propVals[v]) {
              // console.log(" > Found local value: " + nlsV);
              objVals[v] = propVals[v];
            } else {
              // console.log(" > Value not found in cache: " + v + " adding it to to_dwnld");
              vals.push(searchedVals[j]);
            }
          }
          if (Object.keys(objVals).length > 0){
            propValsCached[propId] = objVals;
          }
          if (vals.length) {
            to_dwnld[propId] = vals;
          }
        }
      }
      cacheMissVals[0] = propValsCached;
      cacheMissVals[1] = to_dwnld;
      return cacheMissVals;
    };

    var needsToBeTranslated = function(iPropUri, iPropValue){
      var predicatesEnum = ['ds6w:what', 'ds6w:when', 'ds6w:who', 'ds6w:where', 'ds6w:why', 'ds6w:how',
      'ds6w:originator', 'ds6w:responsible', 'ds6w:lastModifiedBy', 'ds6w:reservedBy', 'ds6w:assignee', 'ds6w:docExtension',
      'ds6w:before', 'ds6w:starts', 'ds6w:actualStart', 'ds6w:plannedStart',
      'ds6w:created', 'ds6w:modified', 'ds6w:ends', 'ds6w:actualEnd',
      'ds6w:plannedEnd', 'ds6w:dueDate', 'ds6w:estimatedCompletionDate', 'ds6w:history',
      'ds6w:publishedDate', 'ds6w:sent', 'ds6w:received', 'ds6w:targetLaunchDate',
      'ds6w:laborRate',   'ds6w:distance',   'ds6w:surface',
      'ds6w:declaredSurface', 'ds6w:diameter', 'ds6w:radius', 'ds6w:length',
      'ds6w:height',   'ds6w:width',   'ds6w:thickness', 'ds6w:volume',
      'ds6w:declaredVolume', 'ds6w:min', 'ds6w:max', 'ds6w:typical',
      'ds6w:weight', 'ds6w:declaredWeight', 'ds6w:lasts', 'ds6w:estimatedDuration',
      'ds6w:actualDuration', 'ds6w:fulfillsQuantity'];

      if (predicatesEnum.indexOf(iPropUri)>-1 || iPropUri.indexOf('cost')> -1 /*|| iPropUri.indexOf('ds6wg:')> -1*/){
        return false;
      }

      // date values should be ignored. E.g. "2021-02-16T06:20:24Z"
      var regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
      if (regExp.test(iPropValue)){
        // is a date
        return false;
      }

      return true;
    };

    /**
     * @exports DS/SearchDictionaryAccess/SearchDictionaryAccessAPI Module
     *          for dictionary read API. This file is to be used by
     *          App's which need to access dictionary information
     *          from any data-source.
     *
     */
    var dicoReadAPI = {

      /**
       * Sets myApps config object that contains myAppsBaseUrl, userId and lang
       * Required for use cases where the compass is not initiated: in web pop-ups and in web-in-win
       * 
       * @param {object} config - Following attributes are accepted:
       * @param {string} config.myAppsBaseUrl - myApps url that can be retrieved from myAppsURL global variable in web (if compass is initiated)
       *                                        or dscef.getMyAppsURL() in web-in-win
       * @param {string} config.userId - connected user's Id
       * @param {string} config.lang - connected user's language
       * @return {<void>}
       */
      setConfigForMyApps: function(config) {
        DicoUtils.setMyAppsConfig(config);
      },
      
      /**
       * For custom services, add the name in MyApps-format to redirect web-service calls to this service
       * This service will need to expose same endpoints for web-services as 3DSpace
       * 
       * @param {string} service - service name as returned by federated search
       * @param {object} serviceSettings - Following attributes are accepted:
       * @param {string} serviceSettings.persistency - type of persistency: "RDF", "ER", other
       * @param {string} serviceSettings.serviceName - service name in MyApps format
       * @param {string} [serviceSettings.federatedOn] - service on which all the information should be searched: service name in MyApps format or FEDERATED_SERVICE
       * @return {<void>}
       * @deprecated Do not use.
       */
      addServiceSettings: function(service, serviceSettings) {
        if (!service || !serviceSettings || !serviceSettings.persistency || !serviceSettings.serviceName){
          console.error('addServiceSettings: wrong or missing parameters.');
          return;
        }
        DicoUtils.addServiceSettings(service, serviceSettings);
      },

      /**
       * Function getResourcesInfo To get the NLS translation of a set of vocabularies elements
       *
       * @param {string} elemNames: URI's of required elements, separated by a comma.
       * @param {object} cbFuncs - Following attributes are accepted:
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @return {object} - Array of JSon object each containing basic informtion of a given property including NLS translation.
       * @example
       * Input: "ds6w:jobStatus,swym:RichMedia"
       * Response:
       * [
       *   {
       *     "curi": "ds6w:jobStatus",
       *     "uri": "http://www.3ds.com/RDF/Corpus/ds6w/jobStatus",
       *     "label": "Job status",
       *     "description": "Status of the latest job run by the simulation",
       *     "metaType": "Property",
       *     "datatype": "xsd:string"
       *   },
       *   {
       *     "curi": "swym:RichMedia",
       *     "uri": "http://www.3ds.com/RDF/Corpus/swym/RichMedia",
       *     "label": "Rich media",
       *     "description": "A 3D model, a picture, a video, etc",
       *     "metaType": "Class",
       *   },
       *   ...
       * ]
       */
      get6wResourcesInfo: function (elemNames, cbFuncs) {
        if (!elemNames || !cbFuncs){
          cbFuncs.onFailure('get6wResourcesInfo: missing input');
          return;
        }

        // Computing the current language
        var language = '';
        if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
          language = cbFuncs.lang;
        }
        else {
          language = widget.lang;
        }

        // Computing the name of the cache that contains the translations, knowing there is one per language: prefix is dicoElements_
        var storageName = DicoUtils.dicoElemsBaseKey + language;
        var localValues = sessionStorage.getItem(storageName);
        if (!localValues){
          localValues = {};
        }
        else {
          localValues = JSON.parse(localValues);
        }

        // if local cache is not empty, we retrieve the values that were in the cache and push them to the result (locRes)
        // and we compute the missing values
        var reqElts = elemNames.split(',');
        var missingVals = [];
        var locRes = [];
        // get local values that are jsReqElems, if any
        var uri, i;
        if (localValues && Object.keys(localValues).length > 0) {
          for (i = 0; i < reqElts.length; i++) {
            uri = reqElts[i];
            if (localValues[uri]){
              locRes.push(localValues[uri]);
            }
            else {
              missingVals.push(uri);
            }
          }
        }
        else {
          missingVals = reqElts;
          sessionStorage.setItem(storageName, '');
        }

        // Let's do the real work and iterate on missing values
        if (missingVals.length > 0) {
          var result;
          // Depending on the API version, the results was not exactly returned in the same way
          // Depending on the case, we store the values retrieved from the cache
          if (cbFuncs.apiVersion === 'R2019x') {
            result = [];
            if (locRes.length > 0){
              result = locRes;
            }
          }
          else {
            result = {vocabularyElementNLSInfo: []};
            if (locRes.length > 0){
              result = DicoUtils.convertToR420ElementsNls(locRes);
            }
          }
          // now, load missing elements from data-sources
          //if (DicoUtils.isRDFOnER(cbFuncs)) {
          // load all from 3DSpace because 6W are stored in 3DSpace: this call returns data that have been processed
          SearchDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, missingVals, true).then(function(data){
            // We concatenate the data into the results containing at the moment, the ones translated from the cache
            if (cbFuncs.apiVersion === 'R2019x') {
              result = result.concat(data);
            }
            else if (data.vocabularyElementNLSInfo){
              result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(data.vocabularyElementNLSInfo);
            }
            // We call the callback corresponding to the success
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
            // We call the callback corresponding to the failure
            cbFuncs.onFailure(result);
            }
          });
 /*         }
          else {
            // doesn't happen right now: which means that this code is useless
            //var cspaceElems = [], rdfElems = [];
            var rdfElems = [];
            var promises = [];
            for (i = 0; i < missingVals.length; i++) {
              uri = missingVals[i];
              // In any case, we should nit care about ds6wg
              //if (uri.startsWith('ds6wg:')) {
              //  cspaceElems.push(uri);
              //}
              //else {
                rdfElems.push(uri);
              //}
            }
            if (rdfElems.length > 0) {
              // Call WS for RDF elements
              promises.push(SearchDictionaryAccessRDF.getResourcesInfo(_OntoService, cbFuncs, rdfElems));
            }
          //  if (cspaceElems.length > 0) {
              // Call WS for 3DSpace elements
            //  promises.push(SearchDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, cspaceElems));
            //}
            // wait till both calls are finished
            Promise.all(promises).then(function(data){
              data.forEach(function(element){
                if (cbFuncs.apiVersion === 'R2019x') {
                  result = result.concat(element);
                }
                else if (element.vocabularyElementNLSInfo){
                  result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(element.vocabularyElementNLSInfo);
                }
              });
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure){
                cbFuncs.onFailure(result);
              }
            });
          } */
        } else {
          // all values were in the cache: we produce the result with the right format
          if (cbFuncs.apiVersion !== 'R2019x'){
            locRes = DicoUtils.convertToR420ElementsNls(locRes);
          }
          cbFuncs.onComplete(locRes);
        }
      },

      /**
       * Function getNlsOfPropertiesValuesBySource To get the NLS translation of a list of property values retrieved from different data sources
       * @param {object} propValsElems - JSON object with keys as property URI and value as array of objects containing a value to translate and data source for look-up.
       *                                 Data source should be a valid data source in a format recognized by MyApps.
       * @param {object} cbFuncs - Following attributes are accepted:
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @return {object} Json object with keys as property short URI and value as Json object caontaining values translation per source service
       * @example
       * Input: { "ds6w:type": [{"value": "VPMReference", "source": ["3DSpace"]},
       *                        {"value": "foaf:Group", "source": ["usersgroup"]}],
       *          "ds6w:makeOrBuy": [{"value": "Purchase", "source": ["3DSpace"]}]
       *        }
       * Response:
       * { 
       *   "ds6w:type": {
       *     "VPMReference": "Physical Product",
       *     "foaf:Group": "Group"
       *   },
       *   "ds6w:makeOrBuy": {
       *     "Purchase": “Buy"
       *   }
       * }
       */
      getNlsOfSearchValuesBySource: function (propValsElems, cbFuncs){
        // example of the call:
        // { "ds6w:jobStatus": [{value: "swym_media_non_processed", source: ["3DSwym"]}],
        //   "ds6w:type": [{value: "VPMReference", source: ["3DSpace"]}, {value: "foaf:Group", source: ["usersgroup"]}]
        //}

        if (!Core.is(cbFuncs, 'object') || !Core.is(cbFuncs.onComplete, 'function')){
          return;
        }
        if (!propValsElems) {
          cbFuncs.onFailure('getNlsOfSearchValuesBySource: no propValsElems');
          return;
        }

        var prop, val, val_source, sources, source;
        var callsPerSource = {}, service, promises = [];
        var result = {};

        // e.g. {"3DSpace": {"ds6w:type": ["VPMReference", "Part"]}
        for (prop in propValsElems){ // e.g. prop = "ds6w:type"
          for (var i=0; i<propValsElems[prop].length; i++){
            val_source = propValsElems[prop][i]; // e.g. val_source = {value: "foaf:Group", source: ["usersgroup"]}
            val = val_source.value; // e.g. val = "foaf:Group"
            sources = val_source.source; // e.g. sources = ["usersgroup"]

            // for predicates with federated values, always search in Service that stores 6W predicates (3DSpace)
            if (DicoUtils.isPredicateWithFedValues(prop)){
//              if (DicoUtils.isRDFOnER(cbFuncs)) {
                source = '3DSpace';
 //             }
   //           else {
                // Should never happen. Kept for potential transitioning where ds6w will be in Ontology service
     //           source = _OntoService;
       //       }
            } else {
              // source count should normally be 1 as the values are not federated
              source = SearchDicoUtils.getServiceToSearchIn(sources, cbFuncs);
            }

            if (!callsPerSource[source]) {
              callsPerSource[source] = {};
            }
            if (!callsPerSource[source][prop]){
              callsPerSource[source][prop] = [];
            }
            callsPerSource[source][prop].push(val);
          }
        }

        for (service in callsPerSource){
          var propValsPerSource = callsPerSource[service];

          // first get values from cache per source
          var cacheMissValues = retrievePropValuesFromCache(service, propValsPerSource, cbFuncs);
          if (cacheMissValues && cacheMissValues.length === 2) {
            var cachedValues = cacheMissValues[0];
            var missingValues = cacheMissValues[1];
            var valuesWithoutNLS = {}; // get some predicates and values as-is

            // then check is all properties values need to be translated
            for (var p in missingValues){
              for (i=0; i<missingValues[p].length; i++){
                var v = missingValues[p][i];
                if (!needsToBeTranslated(p, v)){
                  if (!valuesWithoutNLS[p]){
                    valuesWithoutNLS[p]={};
                  }
                  valuesWithoutNLS[p][v] = v;
                  if (missingValues[p]){
                    delete missingValues[p][i];
                  }
                }
              }
              var countNull = 0;
              for (var j=0; j<missingValues[p].length; j++){
                if (missingValues[p][j] === undefined || missingValues[p][j] === null){
                  countNull ++;
                }
              }
              if (countNull === missingValues[p].length){
                delete missingValues[p];
              }
            }
            var cachedResult = Object.assign(cachedValues, valuesWithoutNLS);

            // add to result
            result = SearchDicoUtils.mergePropValues(result, cachedResult);

            // nothing's missing
            if (Object.keys(missingValues).length === 0) {
              continue;
            }
            // for RDF data sources
            if (DicoUtils.isRDFService(service)){
              promises.push(SearchDictionaryAccessRDF.getNlsOfPropertyValues(service, cbFuncs, missingValues));
            }
            // for E/R data source (3DSpace)
            else {
              var cbFuncsPerService = Object.assign({}, cbFuncs);
              cbFuncsPerService.serviceName = service;
              promises.push(SearchDictionaryAccess3DSpace.getAttributesNlsValues(cbFuncsPerService, missingValues, true));
            }
          }
        }

        if (promises.length>0){
          var isFullfilled = false;

          // wait till all calls are finished
          UWAPromise.allSettled(promises).then(function(data){
            for (var k =0; k<data.length; k++){
              var element = data[k];
              if (element === undefined || element === null){
                continue;
              }
              var status = element.state;
              if (status === 'fullfilled'){
                isFullfilled = true;
                var values = element.value;
                result = SearchDicoUtils.mergePropValues(result, values);

                /*if (values && Object.keys(values)){
                  for (var propId in values) {
                    for (var v in values[propId]) {
                      if (!result.hasOwnProperty(propId)){
                        result[propId] = values[propId];
                      }
                      result[propId][v] = values[propId][v];
                    }
                  }
                } */
              }
            }

            if (isFullfilled === true){
              cbFuncs.onComplete(result);
            } else {
              if (cbFuncs.onFailure){
                cbFuncs.onFailure('getNlsOfSearchValuesBySource: Calls to all sources failed');
              }
            }

          }).catch(function(data){
            if (cbFuncs.onFailure){
              cbFuncs.onFailure(data);
            }
          });
        }
        else {
          // nothing should be retrieved from services: values are cached or/and non-translatable
          cbFuncs.onComplete(result);
        }
      }
    };

    return dicoReadAPI;
  });

