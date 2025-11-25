'use strict';

/*global Promise console widget sessionStorage window*/
/*jslint plusplus: true*/
define('DS/SixwDictionaryAccess/SixwDicoUtils',
  ['UWA/Core',
   'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
   'text!DS/SixwDictionaryAccess/assets/SixwDicoSettings.json'],

  function (Core, PlatformServices, DicoSettings) {


    // private data
    var _3DExpPatformServices = [];
    var _RDFPilar = '';
    var _RDFPPVersion = 'v0';
    var _hardcodedURL = '';
    var _myAppsConfig = {};
    var _dicoSettings = {};

    var dicoUtils = {

      /* getPlatformServices() Returns:
       [{ "platformId": "R1132100081733",
        "displayName": " R1132100081733-US-West",
        "3DSpace": "https://R1132100081733-eu1-417nbl0718-3dspace.3dexperience.3ds.com/3DSpace",
        "3DPassport": "https://iam.ppd.3ds.com",
        "usersgroup": "https://R1132100081733-eu1-417nbl0718-usersgroup.3dexperience.3ds.com"
        }, ... ]
       */
      dicoElemsBaseKey: 'dicoElements_',

      dicoPropValuesBaseKey: 'dicoPropValues_',

      dicoPropRootsBaseKey: 'dicoPropRoots',

      dicoExtensionsBaseKey: 'dicoExtensions',

      initSrvRequest: function () {
        _dicoSettings = JSON.parse(DicoSettings);
        var ontoService = _dicoSettings.CloudOntologyService;
        _RDFPilar = _dicoSettings.RDFPilar;
        _RDFPPVersion = _dicoSettings.RDFPPVersion;
        _hardcodedURL = _dicoSettings.RDFServerURL;

        if (!_RDFPilar){
          _RDFPilar = '3drdfpersist';
        }
        if (!_RDFPPVersion){
          _RDFPPVersion = 'v0';
        }
        PlatformServices.getPlatformServices(
          {
            config: _myAppsConfig,
            onComplete: function (data) {
              // dicoUtils.setPatformServices(data); //
              _3DExpPatformServices = data;
              if (data && data.length === 1 && data[0].platformId === 'OnPremise' && !_hardcodedURL) {
                ontoService = '3DSpace';
              }
            },

            onFailure: function () {
              //console.error('Call to PlatformServices.getPlatformServices failed : ' + data);
            }
          });
        return ontoService;
      },


      getservices: function () {
        return _dicoSettings.Services;
      },

      setMyAppsConfig: function(options){
        _myAppsConfig = {};
        _myAppsConfig.myAppsBaseUrl = options.myAppsBaseUrl;
        _myAppsConfig.userId = options.userId;
        _myAppsConfig.lang = options.lang;
      },

      isWithoutAuth: function(){
        var dicoSettings = JSON.parse(DicoSettings);
        if (dicoSettings.isRDFWithAuth && dicoSettings.isRDFWithAuth === 'false'){
          return true;
        }
        return false;
      },

      isRDFOnER: function (options) {
        if (options.tenantId === 'OnPremise' && options.OnPremiseWith3DRDF === 'true'){
          //console.log('*** INFO: E4All Environment: RDF on RDFKernel!');
          return false;
        }

        if (options.tenantId && options.tenantId.startsWith('ODTService@') && options.OnPremiseWith3DRDF === 'true'){
          //console.log('*** INFO: ODT Environment: RDF on RDFKernel!');
          return false;
        }

        // SGA5: Separate activation of RDF usage for RDF-apps and for 3DSearch
        if (options.serviceName && this.isRDFService(options.serviceName)){
          //console.log('*** INFO: Forced RDF-based service usage: RDF on RDFKernel!');
          return false;
        }

        if (_dicoSettings.RDFFedVocabulariesOn3DSpace === 'true' || options.tenantId === 'OnPremise') {
            //console.log('*** INFO: RDF on 3DSpace.');
            return true;
        }
        return false;
      },

      // Can be called by application: in this case, we assume they are callind 6WVocab endpoint  
      getServiceBaseURLPromise: function(service, tenantId, option, pillar) {
        var that = this;
        return that.getServiceBaseURLPromiseInternal('/resources/6WVocab/access/',service,tenantId,option,pillar);
      },
      // Endpoint for accessing 6W vocabularies only
      getServiceBaseURLPromise6w: function(service, tenantId, option, pillar) {
        var that = this;
        return that.getServiceBaseURLPromiseInternal('/resources/6WVocab2/access/',service,tenantId,option,pillar);
      },

      getServiceBaseURLPromiseInternal: function(endpoint,service, tenantId, option, pillar) {
        var that = this;
        return new Promise(function(resolve, reject){
          var url;
          if (option && option.startsWith('ODTService@')) {
            if (service === '3DSpace'){
              resolve(option.substring(11) + endpoint);
            } else {
              resolve(option.substring(11) + 'v0/invoke/');
            }
          }
          else if (!_3DExpPatformServices || _3DExpPatformServices.length === 0){
            PlatformServices.getPlatformServices(
              {
                config: _myAppsConfig,

                onComplete: function (data) {
                  _3DExpPatformServices = data;
                  if (_3DExpPatformServices !== undefined){
                    url = that.getServiceBaseURLInternal(endpoint,service, tenantId, option, pillar);
                    if (typeof url === 'undefined'){
                      console.error('URL cannot be computed');
                      return reject(new Error('URL cannot be computed'));
                    }
                    return resolve(url);
                  } else {
                    console.error(new Error('PlatformServices.getPlatformServices returned an empty result'));
                    return reject(data);
                  }
                },

                onFailure: function (data) {
                  console.error(new Error('Call to PlatformServices.getPlatformServices failed: ' + data));
                  return reject(data);
                }
              });
          } else {
            url = that.getServiceBaseURLInternal(endpoint,service, tenantId, option, pillar);
            if (typeof url !== 'undefined'){
              return resolve(url);
            } else {
              return reject(new Error('Cannot find URL from MyApps and no hardcoded URL neither'));
            }
          }
        });
      },

      // Can be called by application: in this case, we assume they are callind 6WVocab endpoint  
      getServiceBaseURL: function (service, tenantId, option, pillar) {
        var that = this;
        return that.getServiceBaseURLInternal('/resources/6WVocab/access/',service,tenantId,option,pillar);
      },
      // Endpoint for accessing 6W vocabularies only
      getServiceBaseURL6w: function (service, tenantId, option, pillar) {
        var that = this;
        return that.getServiceBaseURLInternal('/resources/6WVocab2/access/',service,tenantId,option,pillar);
      },

      getServiceBaseURLInternal: function (endpoint,service, tenantId, option, pillar) {
        if (tenantId === null){
          console.warn('*** Warning: tenant id not specified by caller!');
        }
        var srvURL;
        // for 3DSwym service reroute web service calls to 3DSpace, as federated vocabularies are not stored in 3DSwym
        if (service==='3DSwym') {
          service = '3DSpace';
        }
        for (var i = 0; i < _3DExpPatformServices.length; i++) {
          if (_3DExpPatformServices[i].platformId === tenantId) {
            srvURL = _3DExpPatformServices[i][service];
            if (typeof srvURL === 'undefined' && service === '3DSpace') {
              console.warn('*** Warning: Service 3DSpace not available, consider 6WTag for BI.');
              // if 3DSpace URL not returned, on cloud use 3DDrive and onpremise 6WTags
              if (tenantId === 'OnPremise'){
                srvURL = _3DExpPatformServices[i]['6WTags'];
              }
              else {
                srvURL = _3DExpPatformServices[i]['3DDrive'];
              }
            }
            // SGA5: check if RDF service, in this case return srvURL with pilar
            else if (typeof srvURL !== 'undefined' && tenantId !== 'OnPremise' && this.isRDFService(service)){
              if (!pillar){
                pillar = _RDFPilar;
                if (service === '3dplan'){
                  pillar = '';
                }
              }
              var pillarString = '';
              if (pillar !== undefined && pillar !== ''){
                pillarString = '/' + pillar;
              }

              return srvURL + pillarString + '/' + _RDFPPVersion + '/invoke/';
            }
            if (typeof srvURL === 'undefined'){
              console.warn('*** Warning: Service not available: ' + service);
            }
            break;
          }
        }
        if (srvURL === null || (typeof srvURL === 'undefined')) {
          console.warn('*** Warning: Tenant or service not recognized by 3DCompass: ' + tenantId + '|' + service);
          // Workaround for OnPremise (E4A env.)
          for (var p in _3DExpPatformServices) {
            if (_3DExpPatformServices[p].platformId === 'OnPremise') {
              if (option) {
                srvURL = option;
                _3DExpPatformServices[p][service] = option;
              }
              else if (_hardcodedURL){
                srvURL = _hardcodedURL;
                _3DExpPatformServices[p][service] = _hardcodedURL;
              }
              // 3DSpace URL should be retrieved
              else if (service !== '3DSpace') {
                srvURL = _3DExpPatformServices[p]['3DSpace'];
                _3DExpPatformServices[p][service] = srvURL;
              }
              break;
            }
          }
        }
        if (typeof srvURL !== 'undefined' && !this.isRDFService(service)){
          srvURL = srvURL + endpoint;
        }
        return srvURL;
      },

      isRDFService: function (service){
        var serviceSettings = _dicoSettings.Services[service];
        if (!serviceSettings){
          // service is not defined, by default all calls should be redirected to federated service (3DSpace)
          return false;
        }
        if (serviceSettings.persistency === 'RDF'){
          return true;
        }
        return false;
      },

      isPredicateWithFedValues: function(prop){
        var predicates = _dicoSettings.PredicatesWithFederatedValues;
        if (predicates.indexOf(prop) > -1){
          return true;
        }
        return false;
      },

      formatRDFResponse : function (arrayToFormat) {
        if (arrayToFormat.member){
          return arrayToFormat.member;
        }
        return arrayToFormat;
      },

      formatRDFInput : function(stringToFormat, toArray) {
        try {
          stringToFormat = JSON.parse(stringToFormat);
          if (toArray){
            return JSON.stringify([stringToFormat]);
          }
          return JSON.stringify(stringToFormat);
        }
        catch (e) {
          var inArray = stringToFormat.split(',');
          if (toArray){
            return JSON.stringify([inArray]);
          }
          return JSON.stringify(inArray);
        }
      },

      getLanguage : function(cbFuncs){
        var language = '';
        if (Core.is(cbFuncs.lang, 'string')){
          language = cbFuncs.lang;
        }
        else {
          language = widget.lang;
        }
        return language;
      },

      addServiceSettings: function(service, serviceSettings){
        _dicoSettings.Services[service] = serviceSettings;
      },

      /************************************************************
      *   Below are conversion functions for backward compatibility
      ************************************************************/

      /*
        to
         {"vocabularyInfo":[
        {
        "name":"ds6w",
        "namespace":"http://www.3ds.com/vocabularies/ds6w/",
        "description":"This ontology defines the DS Corporate vocabulary for 6W tags",
        "prereqs":[],
        "nlsName":"6W Vocabulary"
        }
       */
      convertToR420Vocabularies: function (data) {
        var retData = { vocabularyInfo: [] };
        if (data === null){
          return retData;
        }
        var vocInfoList = [], vocInfo;
        for (var i in data) {
          vocInfo = {
            name: i,
            namespace: data[i].uri,
            description: data[i].description,
            nlsName: data[i].label
          };
          vocInfoList.push(vocInfo);
        }
        retData.vocabularyInfo = vocInfoList;
        return retData;
      },

      /* to
        {
          "propertyInfo":
            {"curi":"ds6w:jobStatus","uri":"http://www.3ds.com/vocabularies/ds6w/jobStatus","label":"Statut d'une tâche planifiée"},
          "values":[
            {"value":"swym_media_error","nlsValue":"Erreur"},
            {"value":"swym_media_non_processed","nlsValue":"Non traite"},
            {"value":"swym_media_processed","nlsValue":"Traite"},
            {"value":"swym_media_processing","nlsValue":"En cours de traitement"},
            {"value":"swym_media_ready_to_process","nlsValue":"Pret pour traitement"}
          ]
        }
        */
        convertToR421RangeValues: function (data) {
          var retData = {propertyInfo : {}, values: []};
  
          if (!data || !data.literalInfo){
            return retData;
          }
          retData.values = data.literalInfo;
          return retData;
        },
  
      /*
        to
        {
          "ds6w":{
            "curi": "ds6w:",
            "uri": "http://www.3ds.com/vocabularies/ds6w/",
            "label": "6W Vocabulary",
            "description": "This ontology defines the DS Corporate vocabulary for 6W tags."
          },
          "swym":{
            "curi": "swym:",
            "uri": "http://www.3ds.com/vocabularies/swym/",
            "label": "3DSwym Vocabulary",
            "description": "This ontology defines 3DSwym vocabulary for 6W tags."
          }, ...
        }
       */
      convertToR421Vocabularies: function (data) {
        var retData = {};
        if (!data || !data.vocabularyInfo){
          return data;
        }
        data.vocabularyInfo.forEach(function (element){
          retData[element.name] =
            { curi: element.name + ':',
              uri: element.namespace,
              label: element.nlsName,
              description: element.description
            };
        });

        return retData;
      },

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

'use strict';

define('DS/SixwDictionaryAccess/SixwRequestUtils',
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

/*global sessionStorage Promise console widget*/

'use strict';

define('DS/SixwDictionaryAccess/SixwDictionaryAccessRDF',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/SixwDictionaryAccess/SixwRequestUtils'],

  function (Core, DicoUtils, RequestUtils) {

    var dicoReadAPI = {

    };
    return dicoReadAPI;
});

/*global sessionStorage Promise console*/

'use strict';

define('DS/SixwDictionaryAccess/SixwDictionaryAccess3DSpace',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/SixwDictionaryAccess/SixwRequestUtils'],

  function (Core, DicoUtils, RequestUtils) {

    var dicoReadAPI = {

      defaultERService: '3DSpace',

      getVocabularies: function(cbFuncs){
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }

        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }

          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }

          DicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + 'Vocabularies?filter=ALL&tenant=' + cbFuncs.tenantId;
            var headers = {};

            headers['Accept-Language'] = language;
            headers.Accept = 'application/json';

            RequestUtils.sendRequest(fullURL, {
              method: 'GET',
              headers: headers,
              timeout: 30000,
              onComplete: function (response) {
                var jsResponse = JSON.parse(response);
                if (cbFuncs.apiVersion === 'R2019x'){
                  jsResponse = DicoUtils.convertToR421Vocabularies(jsResponse);
                }
                resolve(jsResponse);
              },
              onFailure: function (data) {
                reject(data);
              }
            });
          }, function(errMessage){
                reject(errMessage);
          });
        });
      },




      get6WPredicates: function (cbFuncs) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          var param = '';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }
          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }

          // SGA5: IR-619053 Add new parameter mappable to WS URL
          if (cbFuncs.onlyMappable){
            param = '&mappable=true';
          }

          DicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + '6WPredicates?tenant=' + cbFuncs.tenantId + param;
            var headers = {};
            headers['Accept-Language'] = language;

            RequestUtils.sendRequest(fullURL, {
              method: 'GET',
              headers: headers,
              timeout: 30000,
              onComplete: function (response) {
                try {
                  var jsResponse = JSON.parse(response);
                  resolve(jsResponse);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result *** ' + e);
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

      getPropertiesRoots: function(cbFuncs, iProps){
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          if (!iProps){
            resolve();
          }
          else {DicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + 'PredicatesRoots?tenant=' + cbFuncs.tenantId;
            var headers = {};
            headers['Content-Type'] = 'application/json';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: iProps.toString(),
              onComplete: function (response) {
                try {
                  var jsResponse = JSON.parse(response);
                  resolve(jsResponse);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result *** ' + e);
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
          });}
        });
      },
 
      getPredicateRangeValues: function (cbFuncs, iPropUri) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        if (Array.isArray(iPropUri)){
          iPropUri = iPropUri.join(',');
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }

          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }

          DicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + 'PredicateRangeValues?uri=' + iPropUri + '&tenant=' + cbFuncs.tenantId;
            var headers = {};
            headers['Accept-Language'] = language;
            RequestUtils.sendRequest(fullURL, {
              method: 'GET',
              headers: headers,
              timeout: 30000,
              onComplete: function (response) {
                var jsResponse;
                try {
                  jsResponse = JSON.parse(response);
                  if (cbFuncs.apiVersion === 'R2019x') {
                    jsResponse = DicoUtils.convertToR421RangeValues(jsResponse);
                  }
                }
                catch (e){
                  //console.warn('*** Warning: server returned empty result *** ' + e);
                }
                finally {
                  return resolve(jsResponse);
                }
              },
              onFailure: function (data) {
                return reject(data);
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

/**
 * @overview Provide services for configuration tools that need to read 6W properties and 6w vocabularies
 * @file SixwDictionaryAccessAPI.js provides 3 functions get6wVocabularies, get6wProperties, and get6wPropertiesRoots 
 * @licence Copyright 2017 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 */

/*global widget, window, sessionStorage, Promise*/
/*jslint plusplus: true*/
'use strict';

define('DS/SixwDictionaryAccess/SixwDictionaryAccessAPI',
  ['UWA/Core',
    'UWA/Class/Promise',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/SixwDictionaryAccess/SixwDictionaryAccess3DSpace'],

  /**
   * <p>
   * This module aims at providing APIs to access dictionaries of various
   * 3DExperience services (6WTags, 3DSpace, 3DSwym, RDF,...)
   * <p>
   * The exposed APIs return their output asynchronously as data may
   * require a back-end request to be retrieved.
   * </p>
   *
   */
  function (Core, UWAPromise, DicoUtils, SixwDictionaryAccess3DSpace) {

    var _OntoService = DicoUtils.initSrvRequest();


    
    /**
     * @exports DS/SixwDictionaryAccess/SixwDictionaryAccessAPI Module
     *          for dictionary read API. This file is to be used by
     *          App's which need to access dictionary information
     *          from any data-source.
     *
     */
    var dicoReadAPI = {

      /**
       * Sets myApps config object that contains myAppsBaseUrl, userId and lang
       * Required for use cases where the compass is not initiated: in web pop-ups and in web-in-win
       * @param {object} config - JSON Object containing:
       *                           myAppsBaseUrl: myApps url that can be retrieved from myAppsURL global variable in web (if compass is initiated)
       *                                          or dscef.getMyAppsURL() in web-in-win
       *                           userId: connected user's Id
       *                           lang: connected user's language
       *
       */
      setConfigForMyApps: function(config) {
        DicoUtils.setMyAppsConfig(config);
      },

      /**
       * For custom services add its MyApps-format name to redirect web service calls to this service
       * This service will need to expose same endpoints for web services as 3DSpace
       * @param {string} service - service name as returned by federated search
       * @param {object} serviceSettings - JSON of with service settings:
       *                                   serviceSettings.persistency: type of persistency: "RDF", "ER", other
       *                                   serviceSettings.serviceName: service name in MyApps format
       *                                   [serviceSettings.federatedOn]: optionnal. Service on which all the information should be searched: service name in MyApps format or FEDERATED_SERVICE
       */
      addServiceSettings: function(service, serviceSettings) {
        if (!service || !serviceSettings || !serviceSettings.persistency || !serviceSettings.serviceName){
          console.error('addServiceSettings: wrong or missing parameters.');
          return;
        }
        DicoUtils.addServiceSettings(service, serviceSettings);
      },

      /**
       * Retrieves the list of vocabularies intended for federation: used only by import 6w widget
       * @param {object} cbFuncs - JSON Object containing:
       *                           onComplete: function called on complete. The result of the query is passed as a parameter.
       *                           onFailure: function called on failure. The error message is passed as a parameter.
       *                           apiVersion: format of the output. Supported formats: R2019x, R2018x
       *
       */
      get6wVocabularies: function (cbFuncs) {
        if (!cbFuncs){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('get6wVocabularies: missing input');
          }
          return;
        }
        //if (DicoUtils.isRDFOnER(cbFuncs)) {
          // 6W vocabularies are currently stored in 3DSpace
          SixwDictionaryAccess3DSpace.getVocabularies(cbFuncs).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
        /*}
        else {
          // does not happen, at the moment
          SixwDictionaryAccessRDF.getVocabularies(_OntoService, cbFuncs)
          .then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
        }*/
      },




      /**
       * Function get6wProperties to get all searchable properties intended for FedSearch
       *
       * @param {object} cbFuncs - JSON Object containing:
       *                           onComplete: function called on complete. The result of the query is passed as a parameter.
       *                           onFailure: function called on failure. The error message is passed as a parameter.
       *                           apiVersion: format of the output. Supported formats: R2019x, R2018x
       *                           lang: user's language
       *                           onlyMappable: [optional] Whether the property can be used for attribute mapping or not. Default value is false.
       */
      get6wProperties: function (cbFuncs) {
        if (!cbFuncs){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('get6wProperties: missing inputs');
          }
          return;
        }

        //if (DicoUtils.isRDFOnER(cbFuncs)) {
          //console.log("### Retrieving RDF resources from 3DSPace...");
          // 6W vocabularies are currently stored in 3DSpace
          SixwDictionaryAccess3DSpace.get6WPredicates(cbFuncs).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
        /*}
        else {
          // does not happen, at the moment
          SixwDictionaryAccessRDF.getFedProperties(_OntoService, cbFuncs).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure();
            }
          });
        }*/
      },


      /**
       * Function get6wPropertiesRoots to get a root properties for a list of properties
       * @param {string} iPropUris - A list of properties short URIs separated by a comma. Ds6wg are not managed.
       * @param {object} cbFuncs - JSON Object containing:
       *                           onComplete: function called on complete. The result of the query is passed as a parameter.
       *                           onFailure: function called on failure. The error message is passed as a parameter.
       *                           apiVersion: format of the output. Supported formats: R2019x, R2018x
       *                           lang: user's language
       *                           serviceName: [optional] RDF service name if the default behavior needs to be overriden.
       *                                To be used by apps that want force the redirection to a specific RDF service.
       *                           RDFStorage: [optional] RDF pilar if the default behavior needs to be overriden.
       *
       */
      get6wPropertiesRoots: function (iPropUris, cbFuncs){
        if (!iPropUris || !cbFuncs){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('get6wPropertiesRoots: missing inputs');
          }
          return;
        }

        // remove ds6wg
        var props = iPropUris.split(',');
        var propsToKeep = [];
        for (var i=0; i<props.length; i++){
          var prop = props[i];
          if (prop && !prop.startsWith('ds6wg:')){
            propsToKeep.push(prop);
          }
        }

        var storageName = DicoUtils.dicoPropRootsBaseKey;
        var localValues = sessionStorage.getItem(storageName);
        if (!localValues){
          localValues = {};
        }
        else {
          localValues = JSON.parse(localValues);
        }

        var missingVals = [];
        var locRes = [];
        var uri, i, j;
        if (localValues && localValues.length > 0) {
          for (i = 0; i < propsToKeep.length; i++) {
            for (j=0; j<localValues.length; j++){
              uri = propsToKeep[i];
              if (localValues[j].curi === uri){
                locRes.push(localValues[j]);
                break;
              }
              else if (j === localValues.length -1){
                missingVals.push(uri);
              }
            }
          }
        }
        else {
          missingVals = propsToKeep;
          sessionStorage.setItem(storageName, '');
        }

        var result = [];
        if (locRes.length > 0){
          result = locRes;
        }

        if (missingVals.length > 0) {
//          if (DicoUtils.isRDFOnER(cbFuncs)) {
          // 6W vocabularies are currently stored in 3DSpace
          SixwDictionaryAccess3DSpace.getPropertiesRoots(cbFuncs, missingVals).then(function(data){
              result = result.concat(data);
              sessionStorage.setItem(storageName, JSON.stringify(result));
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(result);
              }
            });
/*          }
          else {
          // does not happen, at the moment
          SixwDictionaryAccessRDF.getPropertiesRoots(_OntoService, cbFuncs, missingVals).then(function(data){
              result = result.concat(data);
              sessionStorage.setItem(storageName, JSON.stringify(result));
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(result);
              }
            });
          }*/
        }
        else {
          cbFuncs.onComplete(result);
        }

      },

     /**
       * Function get6wRangeValues to get range enumerated values of a data-type property
       *
       * @param {object} iPropUri - Short URI of the property as a string (e.g. "ds6w:country" or "ds6w:what")
       *                            or a JSON array of Short URIs of the property (e.g. ["ds6w:country","ds6w:what"])
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @return {object} - Json object containing values and their NLS translation 
       * @example
       * Input: "ds6w:jobStatus"
       * Response:
       * { 
       *   "propertryInfo": {
       *     "curi": "ds6w:jobStatus",
       *     "uri": "http://www.3ds.com/RDF/Corpus/ds6w/jobStatus",
       *     "label": "Job status"
       *   }
       *   "values": [
       *     {
       *       "value": "swym_media_non_processed",
       *       "nlsValue": "Non processed"
       *     },
       *     {
       *       "value": "swym_media_processing",
       *       "nlsValue": "Processing"
       *     },
       *     {
       *       "value": "swym_media_processed",
       *       "nlsValue": "Processed"
       *     },
       *     ...
       *   ]
       * }
       */
        get6wRangeValues: function (iPropUri, cbFuncs){
          if (!iPropUri || !cbFuncs){
            if (cbFuncs && cbFuncs.onFailure) {
              cbFuncs.onFailure('getRangeValues: missing inputs');
            }
            return;
          }
          if (DicoUtils.isRDFOnER(cbFuncs)) {
            //console.log("### Retrieving RDF resources from 3DSPace...");
            SixwDictionaryAccess3DSpace.getPredicateRangeValues(cbFuncs, iPropUri).then(function(result){
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(data);
              }
            });
          }
        }
    };

    return dicoReadAPI;
  });

