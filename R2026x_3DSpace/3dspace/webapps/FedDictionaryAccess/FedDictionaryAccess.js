'use strict';

/*global Promise console widget sessionStorage window*/
/*jslint plusplus: true*/
define('DS/FedDictionaryAccess/FedDicoUtils',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
   'text!DS/SixwDictionaryAccess/assets/SixwDicoSettings.json'],

  function (Core, SixwDicoUtils, PlatformServices, DicoSettings) {

    var dicoUtils = {

      /* we keep it because somebody uses it */

      getServiceBaseURL: function (service, tenantId, option, pillar) {
        return SixwDicoUtils.getServiceBaseURL(service, tenantId, option, pillar);
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
      {"classPredicates":[
        {
        "className":"ds6wg:PLMEntity",
        "vocabularyPredicateInfo":[
        { "name":"owner",
        "uri":"ds6w:responsible",
        "nlsName":"Responsible",
        "lang":"en",
        "lineage":"ds6w:who/ds6w:responsible",
        "range":
          { "scope":"Range",
          "operator":"Union",
          "classes":[],
          "dataTypes":["http://www.w3.org/2001/XMLSchema#string"]
          },
          "dimension":"",
          "manipulationUnit":""
        },
        ]
        }
        ]
      }
      */
      convertToR420ClassProperties: function (data) {
        var retData = {classPredicates: [] };
        if (data === null){
          return retData;
        }
        var classInfoList = [], classInfo = {};

        data.forEach(function(element){
          // data comes from 3DSpace
          if (element.classPredicates){
            classInfoList = classInfoList.concat(element.classPredicates);
          }
          // data comes from RDF
          else if (Array.isArray(element.member)){
            element.member.forEach(function(info){
              var propInfoList = [];
              for (var i = 0; i < info.properties.totalItems; i++) {
                var propInfo = {
                  // name: info.properties[i].originalName,
                  uri: info.properties.member[i].curi,
                  nlsName: info.properties.member[i].label,
                  description: info.properties.member[i].description,
                  dataType: info.properties.member[i].dataType
                };
                propInfoList.push(propInfo);
              }
              classInfo = {
                className: info.classInfo.curi,
                vocabularyPredicateInfo: propInfoList
              };
              classInfoList.push(classInfo);
            });
          }
        });
        retData.classPredicates = classInfoList;
        return retData;
      },

      /* to
       * {"classInfo":
          {
            curi":"ds6w:Part",
            "uri":"http://www.3ds.com/vocabularies/ds6w/Part",
            "label":"Part"
          },
          "properties":[
            {"curi":"ds6w:status",
            "uri":"http://www.3ds.com/vocabularies/ds6w/status",
            "label":"Etat de maturité",
            "description":"Etat de maturité de l'objet",
            "dataType":"xsd:string",
            "lineage":"ds6w:what"}, --> lineage cannot be retrieved
            ...
          ]
        }
        */
       convertToR421ClassProperties: function (data) {
        if (!data){
          return data;
        }
        var result = [];
        var that = SixwDicoUtils;

        data.forEach(function(element){
          // data comes from RDF
          if (Array.isArray(element.member)){
            element = that.formatRDFResponse(element);
            element.forEach(function(info){
              if (info.properties) {
                info.properties = that.formatRDFResponse(info.properties);
                info.properties.forEach(function(property) {
                  if (property.originCuri){
                    property.originCuri = that.formatRDFResponse(property.originCuri);
                  }
                });
              }
              result.push(info);
            });
          }
          // data comes from 3DSpace
          else if (element.classPredicates) {
            element.classPredicates.forEach(function(classPredicates){
              var retData = {classInfo: {}, properties:[]};
              if (classPredicates.className){
                retData.classInfo = {
                  curi: classPredicates.className,
                  uri: 'http://www.3ds.com/vocabularies/' + classPredicates.className.replace(':', '/')
                };
              }
              if (classPredicates.vocabularyPredicateInfo){
                classPredicates.vocabularyPredicateInfo.forEach(function (info){
                  var retObj = {
                    curi : info.uri,
                    uri : 'http://www.3ds.com/vocabularies/' + info.uri.replace(':','/'),
                    label : info.nlsName,
                    description : info.nlsName,
                    dataType: info.range.dataTypes[0],
                    dimension: info.dimension,
                    manipulationUnit: info.manipulationUnit,
                    originCuri: 'ds6wg:' + info.name
                    //lineage: info.lineage
                  };
                  //IR-671556 rangeValues are used by AdvancedSearch and should be returned
                  if (info.rangeValues && info.rangeValues.literalInfo){
                    retObj.rangeValues = info.rangeValues.literalInfo;
                  }
                  // SGA5: add information for 3DSpace apps that need mapping to mql attributes
                  if (info.nature){
                    retObj.nature = info.nature;
                  }
                  if (info.selectable){
                    retObj.selectable = info.selectable;
                  }
                  // SGA5 27/07/21 IR-859905: retrieve userAccess information (e.g. "ReadOnly")
                  if (info.userAccess){
                    retObj.userAccess = info.userAccess;
                  }
                  retData.properties.push(retObj);
                });
              }
              result.push(retData);
            });
          }
        });
        return result;
      },

      /* From
      {"vocabularyInfo":
         { "name":"ds6w",
         "prereqs":[]
         },
         "vocabularyClassInfo":[
         { "name":"http://www.3ds.com/vocabularies/ds6w/Change",
         "type":"Class",
         "description":"Change",
         "uri":"ds6w:Change",
         "parentUri":"",
         "nlsName":"Change",
         "abstract":false
        }
        ]
       */
      convertToR420VocClasses: function (data) {
        var retData = null;
        if (data === null){
          return retData;
        }
        var vocInfo = {};
        var classInfoList = [], classInfo;
        for (var i = 0; i < data.classes.totalItems; i++) {
          classInfo = {
            name: data.classes.member[i].uri,
            uri: data.classes.member[i].curi,
            nlsName: data.classes.member[i].label,
            description: data.classes.member[i].description
          };
          classInfoList[i] = classInfo;
        }
        vocInfo = {
          name: data.vocabularyInfo.curi.split(':')[0],
          uri: data.vocabularyInfo.curi,
          namespace: data.vocabularyInfo.uri
        };

        retData = {
          vocabularyInfo: vocInfo,
          vocabularyClassInfo: classInfoList
        };
        return retData;
      },

      /* to
       * {"vocabularyInfo":
          {
            "curi":"ds6w:",
            "uri":"http://www.3ds.com/vocabularies/ds6w/"
          },
          "classes":[
            {
            "curi":"ds6w:Classification",
            "uri":"http://www.3ds.com/vocabularies/ds6w/Classification",
            "label":"Classification",
            "description":"Classification"
            },
            ...
          ]
        }
        */
       convertToR421VocClasses: function (data) {
        if (!data || !data.vocabularyInfo){
         return data;
        }
        var retData = {vocabularyInfo : {}, classes: []};

        retData.vocabularyInfo = {
          curi: data.vocabularyInfo.name + ':',
          uri: 'http://www.3ds.com/vocabularies/' + data.vocabularyInfo.name + '/'
        };

        if (data.vocabularyClassInfo){
          data.vocabularyClassInfo.forEach(function (element){
            retData.classes.push({
              curi : element.uri,
              uri : 'http://www.3ds.com/vocabularies/' + element.uri.replace(':', '/'),
              label : element.nlsName,
              description : element.description
            });
          });
        }

       return retData;
     },

      /* to
       * {"vocabularyInfo":
        {
        "name":"ds6w",
        "prereqs":[]
        },
        "vocabularyElementNLSInfo":[
          {
          "uri":"ds6w:releaseType","
          type":"Predicate",
          "nlsName":"Release Type",
          "lang":"en"
          }
          ...
        ]
        }
        */
      convertToR420VocProperties: function (data) {
        var retData = {};
        if (data === null){
          return retData;
        }
        var vocInfo = {};
        var propInfoList = [], propInfo;
        for (var i = 0; i < data.properties.totalItems; i++) {
          propInfo = {
            uri: data.properties.member[i].curi,
            nlsName: data.properties.member[i].label
          };
          propInfoList[i] = propInfo;
        }
        vocInfo = {
          name: data.vocabularyInfo.curi.split(':')[0],
          uri: data.vocabularyInfo.curi,
          namespace: data.vocabularyInfo.uri
        };

        retData = {
          vocabularyInfo: vocInfo,
          vocabularyElementNLSInfo: propInfoList
        };
        return retData;
      },

      /* to
       * {"vocabularyInfo":
          {
            "curi":"ds6w:",
            "uri":"http://www.3ds.com/vocabularies/ds6w/"
          },
          "properties":[
            {
            "curi":"ds6w:constituent",
            "uri":"http://www.3ds.com/vocabularies/ds6w/constituent",
            "label":"Constituent",
            "description":"Constituent"
            },
            ...
          ]
        }
        */
      convertToR421VocProperties: function (data) {
        if (!data || !data.vocabularyInfo){
          return data;
        }
        var retData = { vocabularyInfo : {}, properties: []};

        retData.vocabularyInfo = {
          curi: data.vocabularyInfo.name + ':',
          uri: 'http://www.3ds.com/vocabularies/' + data.vocabularyInfo.name + '/'
        };

        if (data.vocabularyElementNLSInfo){
          data.vocabularyElementNLSInfo.forEach(function (element){
            retData.properties.push({
              curi : element.uri,
              uri : 'http://www.3ds.com/vocabularies/' + element.uri.replace(':', '/'),
              label : element.nlsName,
              description : element.nlsName
            });
          });
        }

        return retData;
      },

      /* from
        { "literalInfo": [
        {
         "value": "FR",
         "nlsvalue": "France"
        },
        {
         "value": "GR",
         "nlsvalue": "Greece"
        }
        ]
        "individualInfo": []
        }
        */
      convertToR420RangeValues: function (data) {
        var retData = {};
        if (data === null){
          return retData;
        }
        var valList = [], val;
        for (var i = 0; i < data.values.totalItems; i++) {
          val = {
            value: data.values.member[i].value,
            nlsvalue: data.values.member[i].nlsValue
          };
          valList[i] = val;
        }

        retData.literalInfo = valList;
        return retData;
      },


      // FUN151110 this function identifies the properties returned in /PredicateRaw web services that have not been translated
      // extract properties that are not translated
      extractNonTranslatedProperties: function (data) {
        // we navigate in results to extract the ds6w properties that are not translated
        var propertiesToTranslate = "";

        var classTab = data.classPredicates;
        classTab.forEach(function(element){
            // We iterate on class
            var predicateTab = element.vocabularyPredicateInfo;
            predicateTab.forEach(function(element2){
            // We iterate on class
            if (element2.nlsName=== ""){
              if (propertiesToTranslate!==""){
                propertiesToTranslate+=",";
              }
                propertiesToTranslate+=element2.uri;
            } 
          })
        })
        return propertiesToTranslate;
       },

      // FUN151110 this function transforms the response of /PredicateRaw web service to add the NLS translations
      // propagate translataions
      propagateTranslations: function (translations,data) {
        // In input, translations contains an array of objects with uri/nlsName
        // data contains the output of the web service
        // It is an object with a field classPredicates that references an array of objects that contain a className and a vocabularyPredicateNLSInfo

        // we navigate in results to extract the ds6w properties that are not translated
        var listTranslatedProperties = translations.vocabularyElementNLSInfo;
        var classTab = data.classPredicates;
        var result = {};
        var resultClassTab = [];
        classTab.forEach(function(element){
            var classNam = element.className;
            var resultClass = {};
            var listPredicate = [];

            // We iterate on each class
            var predicateTab = element.vocabularyPredicateInfo;
            predicateTab.forEach(function(property){
              if (property.nlsName !== "") {
                // Si la traduction etait deja la, on copie l'objet
                listPredicate.push(property);
              } else {
                // Il faut recopier l'objet
                var copie =new Object (property);
                listTranslatedProperties.forEach(function(translated){
                    if (translated.uri===property.uri){
                        copie.nlsName=translated.nlsName;
                        // break;
                    }
                })
                listPredicate.push(copie);
              }
            })
          resultClass.vocabularyPredicateInfo=listPredicate;
          resultClass.className=classNam;
          resultClassTab.push(resultClass);
        })
        result.classPredicates=resultClassTab;
        return result;
      }
    };
    return dicoUtils;
  });

'use strict';

define('DS/FedDictionaryAccess/RequestUtils',
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

define('DS/FedDictionaryAccess/FedDictionaryAccessRDF',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/FedDictionaryAccess/FedDicoUtils',
    'DS/FedDictionaryAccess/RequestUtils',
    'DS/SixwDictionaryAccess/SixwDictionaryAccessRDF',
    'DS/SearchDictionaryAccess/SearchDictionaryAccessRDF'
  ],

  function (Core, DicoUtils, FedDicoUtils, RequestUtils,SixwDictionaryAccessRDF,SearchDictionaryAccessRDF) {

    var dicoReadAPI = {

      getVocabularies: function (iService, cbFuncs) {
                // Rerouting because behavior is exactly the same
              return  SixwDictionaryAccessRDF.getVocabularies(iService,cbFuncs);
      },

      getResourcesInfo: function(iService, cbFuncs, iElements){
        return new Promise(function(resolve, reject){
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getResourcesInfo?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = cbFuncs.lang;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            var language = 'en';
            if (Core.is(cbFuncs.lang, 'string')){
               language = cbFuncs.lang;
            }
            var storageName = DicoUtils.dicoElemsBaseKey + language;
            var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              data: DicoUtils.formatRDFInput(iElements.toString(), true),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'].member;
                  var i = 0;
                  for (; result[i];) {
                    localValues[result[i].curi] = result[i];
                    i++;
                  }
                  i = 0;

                  sessionStorage.setItem(storageName, JSON.stringify(localValues));

                  if (cbFuncs.apiVersion !== 'R2019x'){
                    result = DicoUtils.convertToR420ElementsNls(result);
                  }

                  resolve(result);

                }
                catch (e) {
                  console.warn('*** Warning: server returned empty result ***');
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getPropertiesForClasses: function(iService, cbFuncs, iClasses){
        return new Promise(function(resolve, reject){
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var language = 'en';
            if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
              language = cbFuncs.lang;
            }
            var fullURL = url + 'dsbase:getPropertiesForClass?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: DicoUtils.formatRDFInput(iClasses.toString(), true),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'];
                  resolve(result);
                }
                catch (e) {
                  console.warn('*** Warning: server returned empty or incorrect result *** ' + e);
                  resolve();
                }
              },
              onFailure: function (data) {
                  reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getPropertiesForTemplates: function(iService, cbFuncs, iTemplates){
        return new Promise(function(resolve, reject){
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          var searchableParam = true;
          if (cbFuncs.view === 'public'){
            searchableParam = false;
          }

          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var language = 'en';
            if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
              language = cbFuncs.lang;
            }
            var fullURL = url + 'dsbase:getPropertiesForExtensions?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              data: JSON.stringify([iTemplates, searchableParam]),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'];
                  resolve(result);
                }
                catch (e) {
                  console.warn('*** Warning: server returned empty or incorrect result *** ' + e);
                  resolve();
                }
              },
              onFailure: function (data) {
                  reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getVocabularyProperties: function (iService, cbFuncs, iVocUri) {
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }
          else if (widget) {
            language = widget.lang;
          }

          var searchableParam = true;
          if (cbFuncs.view === 'public'){
            searchableParam = false;
          }

          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url + 'dsbase:getVocabularyProperties?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              //data: DicoUtils.formatRDFInput(iVocUri),
              data: JSON.stringify([iVocUri, searchableParam]),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'];
                  if (cbFuncs.apiVersion !== 'R2019x'){
                    result = FedDicoUtils.convertToR420VocProperties(result);
                  }
                  else {
                    if (result.properties){
                      result.properties = DicoUtils.formatRDFResponse(result.properties);
                      result.properties.forEach(function(property){
                        if (property.originCuri){
                          property.originCuri = DicoUtils.formatRDFResponse(property.originCuri);
                        }
                      });
                    }
                  }
                  resolve(result);
                }
                catch (e) {
                  console.warn('*** Warning: server returned empty result ***');
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getNlsOfPropertyValues: function (iService, cbFuncs, iElements) {
        return SearchDictionaryAccessRDF.getNlsOfPropertyValues(iService, cbFuncs, iElements);
      },

      getRangeValues: function (iService, cbFuncs, iPropUri) {
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }
          else if (widget) {
            language = widget.lang;
          }
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getRangeValues?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              data: DicoUtils.formatRDFInput(iPropUri),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'];
                  if (cbFuncs.apiVersion !== 'R2019x') {
                    result = FedDicoUtils.convertToR420RangeValues(result);
                  }
                  if (result.values){
                    result.values = DicoUtils.formatRDFResponse(result.values);
                  }
                  resolve(result);
                }
                catch (e) {
                  console.warn('*** Warning: server returned empty result *** ' + e);
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getFedProperties: function (iService, cbFuncs) {
                // Rerouting because behavior is exactly the same
                return  SixwDictionaryAccessRDF.getVocagetFedPropertiesbularies(iService,cbFuncs);
      },

      getServiceClasses: function(iService, cbFuncs){
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }
          else if (widget) {
            language = widget.lang;
          }

          var searchableParam = true;
          var excludeFederatedParam = true;

          if (cbFuncs.view === 'public'){
            searchableParam = false;
            excludeFederatedParam = false;
          }

          DicoUtils.getServiceBaseURLPromise(iService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getServiceClasses?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              data: JSON.stringify([searchableParam, excludeFederatedParam]),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'];
                  result =  DicoUtils.formatRDFResponse(result);
                  result.forEach(function(element){
                    if (element.classes){
                      element.classes = DicoUtils.formatRDFResponse(element.classes);
                    }
                  });
                  /*if (result.vocabularies)
                    result.vocabularies = DicoUtils.formatRDFResponse(result.vocabularies);
                  if (result.classes)
                    result.classes = DicoUtils.formatRDFResponse(result.classes);     */
                  resolve(result);
                }
                catch (e) {
                  console.warn('*** Warning: server returned empty result *** ' +e);
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },

      getPropertiesRoots: function (iService, cbFuncs, iProps) {
                // Rerouting because behavior is exactly the same
                return  SixwDictionaryAccessRDF.getPropertiesRoots(iService,cbFuncs,iProps);
      },
  
      getClassTemplates: function (iService, cbFuncs, iClassUri) {
        return new Promise(function(resolve, reject){
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          //var retResult = {extensions: []};
          //resolve(retResult);
          // TODO: SGA5 uncomment when templates retrieval will be activated for Advanced Search

          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
           var language = 'en';
           if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
             language = cbFuncs.lang;
           }

           var classURI = iClassUri;

           // retrieve versionned templates too
           var options = {
                            withSuperClasses : true,
                            filters : {
                              //versioned : false
                            },
                         };

           var searchableParam = true;
           if (cbFuncs.view === 'public'){
             searchableParam = false;
           }
           if (searchableParam === true){
             options.filters.searchable = true;
           }

           var fullURL = url + 'dsbase:listTemplates?tenantId=' + cbFuncs.tenantId;
           var headers = {};
           headers['Accept-Language'] = language;
           headers['Content-Type'] = 'application/json';
           headers['X-Requested-With'] = 'XMLHttpRequest';

           RequestUtils.sendRequest(fullURL, {
             method: 'POST',
             type: 'json',
             headers: headers,
             timeout: 30000,
             data: JSON.stringify([classURI, JSON.stringify(options)]),
             onComplete: function (response) {
              var results = [];
              var retResult = {extensions: []};
               try {
                 if (response !== undefined){
                   var exts = response.member;
                   var prefixes = response['@context'];
                   for (var i= 0; i< exts.length; i++){
                     var ext = exts[i];
                     var _curi = ext['@id'];
                     if (_curi !== undefined) {
                      var prefix = _curi.substring(0, _curi.indexOf(':'));
                      var suffix = _curi.substring(_curi.indexOf(':')+1);
                      var _uri = prefixes[prefix] + suffix;
                      var result = {curi: _curi, uri: _uri, label: ext.label};
                      results.push(result);
                     }
                   }
                 }
                 retResult.extensions = results;
                 resolve(retResult);
               }
               catch (e) {
                 console.warn('*** Warning: server returned empty or incorrect result *** ' + e);
                 resolve(retResult);
               }
             },
             onFailure: function (data) {
                 reject(data);
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

/*global sessionStorage Promise console*/

'use strict';

define('DS/FedDictionaryAccess/FedDictionaryAccess3DSpace',
  ['UWA/Core',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/FedDictionaryAccess/FedDicoUtils',
    'DS/FedDictionaryAccess/RequestUtils',
    'DS/SixwDictionaryAccess/SixwDictionaryAccess3DSpace',
    'DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace'],

  function (Core, SixwDicoUtils, FedDicoUtils, RequestUtils,SixwDictionaryAccess3DSpace,SearchDictionaryAccess3DSpace) {

    var dicoReadAPI = {

      defaultERService: '3DSpace',

      getVocabularies: function(cbFuncs){
        return SixwDictionaryAccess3DSpace.getVocabularies(cbFuncs);
      },


      getPredicates: function (cbFuncs, iClasses) {
        var language = 'en';
        if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
          language = cbFuncs.lang;
        }

        if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
          cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
        }
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var addExtensions = '&extensions=true';
          if (typeof cbFuncs.extensions !== 'undefined' && cbFuncs.extensions === false) {
            addExtensions = '';
          }
          SixwDicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
          // FUN151110 using a new web service that does not compute translations of ds6w properties names
          var fullURL = url + 'PredicatesRaw?tenant=' + cbFuncs.tenantId + addExtensions;
          var headers = {};
          headers.Accept = 'application/json';
          headers['Accept-Language'] = language;
          headers['Content-Type'] = 'text/plain';

          RequestUtils.sendRequest(fullURL, {
            method: 'POST',
            headers: headers,
            timeout: 30000,
            data: iClasses.toString(),
            onComplete: function (response) {
              var jsResponse;
              try {
                jsResponse = JSON.parse(response);
                // FUN151110 I will move the place where I will translate the format
                /*if (cbFuncs.apiVersion === 'R2019x') {
                  jsResponse = FedDicoUtils.convertToR421ClassProperties([jsResponse]);
                }*/


              }
              catch (e){
                //console.warn('*** Warning: 3DSpace returned empty result ***');
              }
              finally {
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
      },

      getElementsNLSNames: function (cbFuncs, iElements, has6WPredicates) {
        if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
          cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
        }
        var webservice = 'ElementsNLSNames';
        if (has6WPredicates){
          webservice = 'ElementsNLSNames';
        }
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          SixwDicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
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
                    result = SixwDicoUtils.convertToR420ElementsNls(result);
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

      getPredicatesNLSNames: function (cbFuncs, iVocUri) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }

          var vocName = iVocUri;
          if (iVocUri.endsWith(':')){
            vocName = iVocUri.slice(0, iVocUri.length - 1);
          }

          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }
          SixwDicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + 'PredicatesNLSNames?name=' + vocName + '&tenant=' + cbFuncs.tenantId;
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
                    jsResponse = FedDicoUtils.convertToR421VocProperties(jsResponse);
                  }
                }
                catch (e){
                  //console.warn('*** Warning: 3DSpace returned empty result ***');
                }
                resolve(jsResponse);
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

      getSwymClasses: function (cbFuncs, iVocUri) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }

          var vocName = iVocUri;
          var includeInstancesParam = '';
          if (iVocUri.endsWith(':')){
            vocName = iVocUri.slice(0, iVocUri.length - 1);
          }
          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }
          if (cbFuncs.includeInstances === true){
            includeInstancesParam= '&includeInstances=true';
          }

          SixwDicoUtils.getServiceBaseURLPromise6w(ERService, cbFuncs.tenantId).then(function(url){
          // Modification FUN151110: calling new web service that only uses ds6w types for swym and pno
          var fullURL = url + 'Vocabulary6WClasses?name=' + vocName + '&tenant=' + cbFuncs.tenantId + includeInstancesParam;
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
                    jsResponse = SixwDicoUtils.convertToR421VocClasses(jsResponse);
                  }
                }
                catch (e){
                  //console.warn('*** Warning: 3DSpace returned empty result ***');
                } finally {
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
      },

      getVocabularyClasses: function (cbFuncs, iVocUri) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
            language = cbFuncs.lang;
          }

          var vocName = iVocUri;
          var includeInstancesParam = '';
          if (iVocUri.endsWith(':')){
            vocName = iVocUri.slice(0, iVocUri.length - 1);
          }
          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }
          if (cbFuncs.includeInstances === true){
            includeInstancesParam= '&includeInstances=true';
          }

          SixwDicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
          // Modification FUN151110: calling new web service that only uses 3DSpace types
          var fullURL = url + 'VocabularyClasses?name=' + vocName + '&tenant=' + cbFuncs.tenantId + includeInstancesParam;
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
                    jsResponse = FedDicoUtils.convertToR421VocClasses(jsResponse);
                  }
                }
                catch (e){
                  //console.warn('*** Warning: 3DSpace returned empty result ***');
                } finally {
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
      },

      getAttributesNlsValues: function (cbFuncs, iElements, has6WPredicates) {
        return SearchDictionaryAccess3DSpace.getAttributesNlsValues(cbFuncs, iElements, has6WPredicates);
      },

      getPredicateRangeValues: function (cbFuncs, iPropUri) {
        return SixwDictionaryAccess3DSpace.getPredicateRangeValues(cbFuncs,iPropUri);
      },

      get6WPredicates: function (cbFuncs) {
        return SixwDictionaryAccess3DSpace.get6WPredicates(cbFuncs);
      },

      getPropertiesRoots: function(cbFuncs, iProps){
        return SixwDictionaryAccess3DSpace.get6wPropertiesRoots(cbFuncs,iProps);
      },

      getTypeInterfaces: function(cbFuncs, iType){
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !SixwDicoUtils.isRDFService(cbFuncs.serviceName)){
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
          SixwDicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
            url = url.replace('6WVocab/access/', 'dictionary/class/');
            var fullURL = url + 'interfaces?tenant=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';
            var classes = {classes: [iType]};

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              data: JSON.stringify(classes),
              timeout: 6000,
              onComplete: function (response) {
                response = JSON.parse(response);
                var result = [];
                if (response && response.results && response.results.length>0 && response.results[0].interfaces){
                  var interfacesData = response.results[0].interfaces;
                  try {
                    for (var iter = 0; iter < interfacesData.length; iter++) {
                      if (!(Core.is(interfacesData[iter].automatic) && interfacesData[iter].automatic === 'Yes' ||
                          Core.is(interfacesData[iter].Automatic) && interfacesData[iter].Automatic === 'Yes')) {
                            var name = interfacesData[iter].name;
                            if (name && !name.startsWith('ds6wg:')){
                              name = 'ds6wg:' + name;
                            }
                            var extension = {curi: name,
                                            uri:  'http://www.3ds.com/vocabularies/' + name.replace(':','/'),
                                            label: interfacesData[iter].nlsName};
                            result.push(extension);
                      }
                      else {
                        console.log('automatic extension detected: ' + interfacesData[iter].name);
                      }
                    }
                  }
                  catch (e) {
                    resolve();
                  }
                }
                var retResult = {extensions: result};
                resolve(retResult);
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

/**
 * @overview Provide seamless access to all dictionaries of 3DExperience data-sources
 * @file FedDictionaryAccessAPI.js provides functions for apps to
 *       access federated and data-source specific  dictionaries
 * @licence Copyright 2017 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 */

/*global widget, window, sessionStorage, Promise*/
/*jslint plusplus: true*/
'use strict';

define('DS/FedDictionaryAccess/FedDictionaryAccessAPI',
  ['UWA/Core',
    'UWA/Class/Promise',
    'DS/SixwDictionaryAccess/SixwDicoUtils',
    'DS/FedDictionaryAccess/FedDicoUtils',
    'DS/FedDictionaryAccess/FedDictionaryAccess3DSpace',
    'DS/FedDictionaryAccess/FedDictionaryAccessRDF',
    'DS/SixwDictionaryAccess/SixwDictionaryAccessAPI',
    'DS/SearchDictionaryAccess/SearchDictionaryAccessAPI',
    'DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace'],

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
  function (Core, UWAPromise, SixwDicoUtils, FedDicoUtils, FedDictionaryAccess3DSpace, FedDictionaryAccessRDF,SixwDictionaryAccessAPI,SearchDictionaryAccessAPI,SearchDictionaryAccess3DSpace) {

    var _OntoService = SixwDicoUtils.initSrvRequest();

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

      var language = SixwDicoUtils.getLanguage(cbFuncs);

      var storageName = SixwDicoUtils.dicoPropValuesBaseKey + language;

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
     * @exports DS/FedDictionaryAccess/FedDictionaryAccessAPI Module
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
        SixwDicoUtils.setMyAppsConfig(config);
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
        SixwDicoUtils.addServiceSettings(service, serviceSettings);
      },

      /**
       * Retrieves the list of vocabularies intended for federation
       * 
       * @param {object} cbFuncs - Following attributes are accepted:
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2018x and R2019x 
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @return {array} - Json objec with keys as vocaularies short URI and values as objects with 6W vocabularies basic information.
       * @example 
       *  {
       *    "ds6w": {
       *      "curi":"ds6w:",
       *      "uri": "http://www.3ds.com/vocabularies/ds6w/",
       *      "label": "6W Vocabulary"
       *      "description":"This ontology defines the ..." 
       *    },
       *    "dsmer": {
       *      ...
       *    }
       *  }
       */
      getFedVocabularies: function (cbFuncs) {
        // Rerouting because behavior is exactly the same
        return SixwDictionaryAccessAPI.get6wVocabularies(cbFuncs);
      },

      /**
       * Retrieves the list of all vocabularies
       * 
       * @param {object} cbFuncs - Following attributes are accepted:
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @return {array} - Json objec with keys as vocaularies short URI and values as objects with 6W vocabularies basic information.
       * @example 
       *  {
       *    "ds6w": {
       *      "curi":"ds6w:",
       *      "uri": "http://www.3ds.com/vocabularies/ds6w/",
       *      "label": "6W Vocabulary"
       *      "description":"This ontology defines the ..." 
       *    },
       *    "dsmer": {
       *      ...
       *    }
       *  }
       */
      getVocabularies: function(cbFuncs) {
        this.getFedVocabularies(cbFuncs);
      },

      /**
       * Function getResourcesInfo To get the NLS translation of a set of vocabularies elements
       *
       * @param {string} elemNames: URI's of required elements, separated by a comma.
       * @param {object} cbFuncs
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
      getResourcesInfo: function (elemNames, cbFuncs) {
        // DO NOT CALL THE ONE FROM SearchDictionaryAccess BECAUSE IT DOESN'T HAVE THE SAME BEHAVIOR (it excludes 6W)
        if (!elemNames || !cbFuncs){
          cbFuncs.onFailure('getResourcesInfo: missing input');
          return;
        }

        var language = '';
        if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
          language = cbFuncs.lang;
        }
        else {
          language = widget.lang;
        }

        // Cache where translations are stored locally
        var storageName = SixwDicoUtils.dicoElemsBaseKey + language;
        var localValues = sessionStorage.getItem(storageName);
        if (!localValues){
          localValues = {};
        }
        else {
          localValues = JSON.parse(localValues);
        }

        var reqElts = elemNames.split(',');
        // Missing vals will contain elements that are not in cache
        var missingVals = [];
        // locRes contains the results obtained from the cache
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
          // As there was no cache, all inputs are missing vals
          missingVals = reqElts;
          // Creation of the local cache for next time
          sessionStorage.setItem(storageName, '');
        }

        // If there are missing vals, we are going to ask for their translations by calling the ad-hoc web services
        if (missingVals.length > 0) {

          // Preparing results
          var result;
          if (cbFuncs.apiVersion === 'R2019x') {
            // First way to provide the results: as a tab of objects
            result = [];
            if (locRes.length > 0) {
                // We start by filling the results with the values retrieved from the cache
                result = locRes;
            }
          }
          else {
            // Second way to provide the results: as a tab of objects
            result = {vocabularyElementNLSInfo: []};
            if (locRes.length > 0) {
                // We start by filling the results with the values retrieved from the cache with a certain conversion algorithm
                result = SixwDicoUtils.convertToR420ElementsNls(locRes);
            }
          }

          // now, load missing elements from data-sources
          if (SixwDicoUtils.isRDFOnER(cbFuncs)) {

            // Modification for FUN151110: separating the list of elemNames in two
            // - the real ds6w that will be translated by calling SearchDictionaryAccessAPI.get6wResourcesInfo
            // - the fake ds6wg that will be translated by calling the web service: /AttributesNLSNames 
            
            // separating missingVals in two lists: the ds6w (rdfElems) and ds6wg (cspaceElems)
            var cspaceElems = [], rdfElems = [];
            var promises = [];
            for (i = 0; i < missingVals.length; i++) {
              uri = missingVals[i];
              // SDM-2025/05/15: Better to consider URI with no prefix as a 3DSapce element 
              if (uri.startsWith("ds6wg:") || uri.indexOf(":")<0) {
                cspaceElems.push(uri);
              }
              else {
                rdfElems.push(uri);
              }
            }

            // For ds6w (rdfElems) we call a dedicated web service
            if (rdfElems.length > 0) {
              // Call WS for RDF elements
              promises.push(SearchDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, rdfElems,true));
            }

            // For ds6wg (rdfElems) we call another dedicated web service
            if (cspaceElems.length > 0) {
              // Call WS for 3DSpace elements
              promises.push(FedDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, cspaceElems,true));
            }

            // wait till both calls are finished
            // var resultPromise = [];
            var resultsToAdd = [];
            Promise.allSettled(promises).then(function(resultPromise) {
              // In output, I have a tab of 1 or 2 promises results depending on the situation
              // I will build only the list of success
              var auMoinsUnSucces = false;
              if (resultPromise.length) {
                var element = resultPromise[0];
                if (element !== undefined && element !== null && element.status ==='fulfilled') {
                  // La premiere promesse s'est bien passee
                  resultsToAdd.push(element.value);
                  auMoinsUnSucces = true;
                } 

                // On gere la seconde si elle existe
                if (resultPromise.length>1){
                  var element2 = resultPromise[1];
                  if (element2 !== undefined && element2 !== null && element2.status ==='fulfilled') {
                    // La seconde promesse s'est bien passee
                    resultsToAdd.push(element2.value);
                    auMoinsUnSucces = true;
                  }
                }
              }

              // Je concatene les resultats obtenus par le cache et les resultats positigs
              resultsToAdd.forEach(function(element){
                if (cbFuncs.apiVersion === 'R2019x') {
                  // Concatenating previous results (from cache) and new ones, retrieved from web services
                  result = result.concat(element);
                }
                else if (element.vocabularyElementNLSInfo){
                  // Concatenating previous results (from cache) and new ones, retrieved from web services
                  result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(element.vocabularyElementNLSInfo);
                }
                // Update local-values for cache
                if (element.length && element.length>0) {
                    element.forEach(function(elem) {
                        localValues[elem.curi] = elem;
                    });
                }
              });
              
              // Update cache
              sessionStorage.setItem(storageName, JSON.stringify(localValues));
    
              // Je renvoie les resultats si j'ai au moins un succes
              if (locRes.length > 0 || auMoinsUnSucces==true){
                  cbFuncs.onComplete(result);
              } else {
                cbFuncs.onFailure(result);
              }
            });
       
            
            // load all from 3DSpace, old infra
            /* previous code
            FedDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, missingVals, true).then(function(data){
              if (cbFuncs.apiVersion === 'R2019x') {
                result = result.concat(data);
              }
              else if (data.vocabularyElementNLSInfo){
                result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(data.vocabularyElementNLSInfo);
              }
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(result);
              }
            }); */
          }
          else {
            // Modification for FUN151110: separating the list of elemNames in two
            // - the real ds6w that will be translated by calling SearchDictionaryAccessAPI.get6wResourcesInfo
            // - the fake ds6wg that will be translated by calling the web service: /AttributesNLSNames 
            
            // separating missingVals in two lists: the ds6w (rdfElems) and ds6wg (cspaceElems)
            var cspaceElems = [], rdfElems = [];
            var promises = [];
            for (i = 0; i < missingVals.length; i++) {
              uri = missingVals[i];
              if (uri.startsWith('ds6wg:')) {
                cspaceElems.push(uri);
              }
              else {
                rdfElems.push(uri);
              }
            }

            // For ds6w (rdfElems) we call a dedicated web service
            if (rdfElems.length > 0) {
              // Call WS for RDF elements
              promises.push(FedDictionaryAccessRDF.getResourcesInfo(_OntoService, cbFuncs, rdfElems));
            }

            // For ds6w (rdfElems) we call another dedicated web service
            if (cspaceElems.length > 0) {
              // Call WS for 3DSpace elements
              promises.push(FedDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, cspaceElems));
            }

            // wait till both calls are 
            Promise.allSettled(promises).then(function(resultPromise) {
              // In output, I have a tab of 1 or 2 promises results depending on the situation
              // I will build only the list of success
              var resultsToAdd = [];
              var auMoinsUnSucces = false;
              if (resultPromise.length) {
                var element = resultPromise[0];
                if (element !== undefined && element !== null && element.status ==='fulfilled') {
                  // La premiere promesse s'est bien passee
                  resultsToAdd.push(element.value);
                  auMoinsUnSucces = true;
                } 

                // On gere la seconde si elle existe
                if (resultPromise.length>1){
                  var element2 = resultPromise[1];
                  if (element2 !== undefined && element2 !== null && element2.status ==='fulfilled') {
                    // La premiere promesse s'est bien passee
                    resultsToAdd.push(element2.value);
                    auMoinsUnSucces = true;
                  }
                }
              }

              // Je concatene les resultats obtenus par le cache et les resultats positigs
              resultsToAdd.forEach(function(element) {
                if (cbFuncs.apiVersion === 'R2019x') {
                  // Concatenating previous results (from cache) and new ones, retrieved from web services
                  result = result.concat(element);
                }
                else if (element.vocabularyElementNLSInfo){
                  // Concatenating previous results (from cache) and new ones, retrieved from web services
                  result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(element.vocabularyElementNLSInfo);
                }
                // Update local-values for cache
                if (element.length && element.length>0) {
                    element.forEach(function(elem) {
                        localValues[elem.curi] = elem;
                    });
                }
              });

              // Update cache
              sessionStorage.setItem(storageName, JSON.stringify(localValues));
    
              // Je renvoie les resultats si j'ai au moins un succes
              if (locRes.length > 0 || auMoinsUnSucces==true){
                  cbFuncs.onComplete(result);
              } else {
                cbFuncs.onFailure(result);
              }
            });
          }
        } else {
          // everything was in the cache, we return the values
          if (cbFuncs.apiVersion !== 'R2019x'){
            locRes = SixwDicoUtils.convertToR420ElementsNls(locRes);
          }
          cbFuncs.onComplete(locRes);
        }
      },

      /**
       * Function getVocabularyProperties to get properties of a given vocabulary
       *
       * @param {string} iVocUri - The short URI of the vocabulary (e.g. "ds6w:")
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @param {string} [cbFuncs.view] - Optional. Purpose of the call. Possible values: "search" or "public".
       *                                 "search" view returns searchable extensions
       *                                 "public" view, used for RDF access only, returns classe's templates
       *                                 default value: "search"
       * @return - Json object containing the list of properties of the given vocabulary
       * @example
       * Input: "ds6w:"
       * Result:
       *  {
       *   "vocabularyInfo": {
       *       "curi": "ds6w:",
       *      "uri": "http://www.3ds.com/vocabularies/ds6w/",
       *   },
       *   "properties": [
       *     {
       *       "curi": "ds6w:buyerCompany",
       *       "uri": "http://www.3ds.com/vocabularies/ds6w/reviewer",
       *       "label": "Reviewer",
       *       "description": "Name of the reviewer"
       *     },
       *     ...
       *   ]
       *  }
       */
      getVocabularyProperties: function (iVocUri, cbFuncs) {
        if (!iVocUri || !cbFuncs){
          if (cbFuncs.onFailure){
            cbFuncs.onFailure('getVocabularyProperties: missing input');
          }
          return;
        }

        if (SixwDicoUtils.isRDFOnER(cbFuncs)) {
          FedDictionaryAccess3DSpace.getPredicatesNLSNames(cbFuncs, iVocUri).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
        }
        else {
          FedDictionaryAccessRDF.getVocabularyProperties(_OntoService, cbFuncs, iVocUri).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
        }
      },

      /**
       * Function getVocabularyClasses to get classes of a given vocabulary
       *
       * @param {string} iVocUri - The short URI of the vocabulary (e.g. "ds6w:")
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @param {string} [cbFuncs.view] - Optional. Purpose of the call. Possible values: "search" or "public".
       *                                 "search" view returns searchable extensions
       *                                 "public" view, used for RDF access only, returns classe's templates
       *                                 default value: "search"
       * @return {object} JSon object containing list of classes definied for the given vocabulary.
       * @example
       * Input: "swym:"
       * Result:
       *  {
       *   "vocabularyInfo": {
       *       "curi": "swym:",
       *       "uri": "http://www.3ds.com/vocabularies/swym/",
       *   },
       *   "classes": [
       *     {
       *       "curi": "swym:Community",
       *       "uri": "http://www.3ds.com/vocabularies/swym/Community",
       *       "label": "Community",
       *       "description": "A 3DSwym community"
       *     },
       *     ...
       *   ]
       *  }
       */
      getVocabularyClasses: function (iVocUri, cbFuncs) {
        if (!iVocUri || !cbFuncs){
          if (cbFuncs.onFailure){
            cbFuncs.onFailure('getVocabularyClasses: missing inputs');
          }
          return;
        }

        // FUN151110: commented because not used:  if (SixwDicoUtils.isRDFOnER(cbFuncs)) {
          //console.log("### Retrieving RDF resources from 3DSpace...");
          FedDictionaryAccess3DSpace.getVocabularyClasses(cbFuncs, iVocUri).then(function(result){
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure) {
              cbFuncs.onFailure(data);
            }
          });
          /** FUN151110: commented because not used 
        }
        else {

          if (iVocUri.startsWith('ds6wg')){
            return FedDictionaryAccess3DSpace.get3DSpaceTypes(cbFuncs, iVocUri).then(function(result){
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(data);
              }
            });
          }
          else {
            return FedDictionaryAccessRDF.getVocabularyClasses(_OntoService, cbFuncs, iVocUri).then(function(result){
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(data);
              }
            });
          }
        }*/
      },

      /**
       * Function getPropertiesForClass to get properties relevant for a class
       *
       * @param {object} iClassUri - A list of short URI of classes/ interfaces separated by comma (e.g. "ds6w:Document or ds6wg:VPMReference")
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @param {string} [cbFuncs.view] - Optional. Purpose of the call. Possible values: "search" or "public".
       *                                 "search" view returns searchable extensions
       *                                 "public" view, used for RDF access only, returns classe's templates
       *                                 default value: "search"
       * @return {array} - Array of objects each containg the list of properties of a given class or interface
       * @example
       * Input: "dsplan:Task,ds6wg:Part"
       * Response:
       *   [
       *     {
       *       "classInfo": {
       *           "curi": "dsplan:Task",
       *           "uri": "http://www.3ds.com/RDF/Corpus/dsplan/Task",
       *       },
       *       "properties": [
       *         {
       *           "curi": "dsplan:plannedStartDate",
       *           "uri": "http://www.3ds.com/RDF/Corpus/dsplan/plannedStartDate",
       *           "label": "Planned Start Date",
       *           "description": "Expected start date"
       *         },
       *         ...
       *       ]
       *     },
       *     {
       *       "classInfo": {
       *           "curi": “ds6wg:Part",
       *           "uri": "http://www.3ds.com/vocabularies/ds6wg/Part",
       *       },
       *       "properties": [
       *         {
       *           "curi": "ds6w:compliancy",
       *           "uri": "http://www.3ds.com/vocabularies/ds6w/compliancy",
       *           "label": "Compliancy",
       *           "description" : "Compliancy“,
       *           "dataType" : "http://www.w3.org/2001/XMLSchema#string ",
       *           “dimension": "",
       *           “manipulationUnit": "",
       *           “originCuri": “ds6wg:Compliance"

       *         },
       *         ...
       *       ]
       *     }
       *   ]
       */
      getPropertiesForClass: function (iClassUri, cbFuncs){
        if (!iClassUri || !cbFuncs){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('getPropertiesForClass: missing inputs');
          }
          return;
        }
        // if RDF service is not used, call old 3DSpace web service
        if (SixwDicoUtils.isRDFOnER(cbFuncs)) {

            // Modification for FUN151110: the new web service /PredicateRaw invoked in FedDictionaryAccess3DSpace.getPredicates
            // Does not return anymore, the NLS of ds6w properties (it returns nls of ds6w attributes though)
            // As a consequence, before calling back the caller, we need to transform the result by computing NLS 

            //console.log("### Retrieving RDF resources from 3DSpace...");
            FedDictionaryAccess3DSpace.getPredicates(cbFuncs, iClassUri).then(function(data){

              // we navigate in results to extract the ds6w properties that are not translated
              var propertiesToTranslate = FedDicoUtils.extractNonTranslatedProperties(data);

              // We need to translate this list of properties by calling 
              var resultTranslation="";

              new Promise (function(resolve,reject){
                SearchDictionaryAccessAPI.get6wResourcesInfo(propertiesToTranslate, {onComplete:resolve,onFailure:reject,lang:cbFuncs.lang,tenantId:cbFuncs.tenantId,serviceName:cbFuncs.serviceName});
              })
              .then(function(data2){
  
                // Once we have retrieved translations, we need to update the translations in the 
                var result = FedDicoUtils.propagateTranslations(data2,data);

                // FUN151110 I will move the place where I will translate the format
                var jsResponse = result;
                if (cbFuncs.apiVersion === 'R2019x') {
                  jsResponse = FedDicoUtils.convertToR421ClassProperties([result]);
                }

                cbFuncs.onComplete(jsResponse);
                }).catch(function(data2){
                  // Even if the translation of property has failed, we provide the result anyway
                  // Once we have retrieved translations, we need to update the translations in the 
                  var result = FedDicoUtils.propagateTranslations(data2,data);
                  
                  // FUN151110 I will move the place where I will translate the format
                  var jsResponse = result;
                  if (cbFuncs.apiVersion === 'R2019x') {
                    jsResponse = FedDicoUtils.convertToR421ClassProperties([result]);
                  }

                  if (cbFuncs.onComplete){
                    cbFuncs.onComplete(jsResponse);
                  }
                });
              }).catch(function(data){
                if (cbFuncs.onFailure){
                  cbFuncs.onFailure(data);
                }
              });
        } else {
          var types = [];
          var classes = [];
          var elements = iClassUri.split(',');
          var result;

          for (var i=0; i<elements.length; i++){
            var element = elements[i];
            if (element.startsWith('ds6wg:')){
              types.push(element);
            }
            else {
              classes.push(element);
            }
          }
          var promises = [];
          // call new 3DSpace service for 3DSpace types
          if (types.length > 0) {
            // FUN151110: commented because not used (after query in dsxplore: nobody is providing a data source 3DSpace)
            // promises.push(FedDictionaryAccess3DSpace.getTypeAttributes(cbFuncs, types));
          }
          // call RDF service for RDF classes templates: USED BY PORTFOLIO, we keep it
          if (classes.length > 0) {
            promises.push(FedDictionaryAccessRDF.getPropertiesForTemplates(_OntoService, cbFuncs, classes));
          }
          // wait till both calls are finished
          Promise.all(promises).then(function(data){
            if (cbFuncs.apiVersion === 'R2019x') {
              result = FedDicoUtils.convertToR421ClassProperties(data);
            }
            else {
              result = FedDicoUtils.convertToR420ClassProperties(data);
            }
            cbFuncs.onComplete(result);
          }).catch(function(data){
            if (cbFuncs.onFailure){
              cbFuncs.onFailure(data);
            }
          });
        }
      },

      /**
       * Function getNlsOfPropertiesValues To get the NLS translation of a list of property values
       *
       * @param {object} propValsElems - Object with keys as property URI and value a list of values to translate
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                                  By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @return {object} Json object with properties URI's as keys, each has value as Json object with lexical value as key, and NLS as value
       * @example
       * Input: 
       * { "swym:jobStatus": ["swym_media_non_processed"],
       *   "ds6w:makeOrBuy": ["Design", "Purchase"]
       * }
       * Response:
       * { 
       *   "ds6w:jobStatus": {
       *      "swym_media_non_processed": "Non processed"
       *   },
       *   "ds6w:makeOrBuy": {
       *      "Design": “Make",
       *      "Purchase": “Buy"
       *   }
       * }
       */
      getNlsOfPropertiesValues: function (propValsElems, cbFuncs){
        if (!Core.is(cbFuncs, 'object') || !Core.is(cbFuncs.onComplete, 'function')){
          return;
        }
        if (!propValsElems) {
          return cbFuncs.onFailure('getNlsOfPropertiesValues: no propValsElems');
        }
        var source = '3DSpace';
        if (!SixwDicoUtils.isRDFOnER(cbFuncs)) {
          source = _OntoService;
        }
        var cacheMissValues = retrievePropValuesFromCache(source, propValsElems, cbFuncs);
        if (!cacheMissValues || cacheMissValues.length < 2) {
          return cbFuncs.onComplete();
        }

        var cachedValues = cacheMissValues[0];
        var missingValues = cacheMissValues[1];
        var valuesWithoutNLS = {}; // get some predicates and values as-is
        //var storageName = SixwDicoUtils.dicoPropValuesBaseKey + SixwDicoUtils.getLanguage(cbFuncs);

        // SGA5 2021/02/17 do not search for non-translatable predicate values
        for (var p in missingValues){
          for (var i=0; i<missingValues[p].length; i++){
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

        // no need to cache values that do not need to be translated
        /*if (valuesWithoutNLS !== {}){
          SixwDicoUtils.addToCache(storageName, valuesWithoutNLS); // add to cache
        }*/
        var result = Object.assign(cachedValues,valuesWithoutNLS);

        // nothing's missing
        if (Object.keys(missingValues).length === 0) {
          return cbFuncs.onComplete(result);
        }
        else {
          // Some data are missing in cache, try to load from data-sources
          if (SixwDicoUtils.isRDFOnER(cbFuncs)) {
            //console.log("### Retrieving RDF resources from 3DSpace...");
            FedDictionaryAccess3DSpace.getAttributesNlsValues(cbFuncs, missingValues, true).then(function(data){
              if (!data || !Object.keys(data)){
                return cbFuncs.onComplete(result);
              }
              /*for (var propId in data) {
                for (var val in data[propId]) {
                  if (!result.hasOwnProperty(propId)){
                    result[propId] = data[propId];
                  }
                  result[propId][val] = data[propId][val];
                }
              }*/
              result = FedDicoUtils.mergePropValues(result, data);
              //SixwDicoUtils.addPropValuesToCache(storageName, result, source);
              return cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure){
                return cbFuncs.onFailure(result);
              }
            });
          }
          else {
            var cspaceElems = {}, rdfElems = {};
            var propIds = Object.keys(missingValues);
            var promises = [];
            var uri;
            for (var i = 0; i < propIds.length; i++) {
              uri = propIds[i];
              if (uri.startsWith('ds6wg:')) {
                cspaceElems[uri] = missingValues[uri];
              }
              else {
                rdfElems[uri] = missingValues[uri];
              }
            }
            // call RDF for RDF elements
            if (Object.keys(rdfElems).length > 0) {
              promises.push(FedDictionaryAccessRDF.getNlsOfPropertyValues(_OntoService, cbFuncs, rdfElems));
            }
            // call 3DSpace for ds6wg elements
            if (Object.keys(cspaceElems).length > 0) {
              promises.push(FedDictionaryAccess3DSpace.getAttributesNlsValues(cbFuncs, cspaceElems));
            }
            // wait till both calls are finished
            Promise.all(promises).then(function(data){
              if (!data || !Array.isArray(data)){
                return cbFuncs.onComplete(result);
              }

              data.forEach(function(element){
                /* if (element && Object.keys(element)){
                  for (var propId in element) {
                    for (var val in element[propId]) {
                      if (!result.hasOwnProperty(propId)){
                        result[propId] = element[propId];
                      }
                      result[propId][val] = element[propId][val];
                    }
                  }
                }*/
                result = FedDicoUtils.mergePropValues(result, element);
              });
              //DicoUtils.addPropValuesToCache(storageName, result, source);
              return cbFuncs.onComplete(result);
            }).catch(function(data){
              console.error(data);
              if (cbFuncs.onFailure){
                return cbFuncs.onFailure(result);
              }
            });
          }
        }
      },

      /**
       * Function getRangeValues to get range enumerated values of a data-type property
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
      getRangeValues: function (iPropUri, cbFuncs){
          // Rerouting because behavior is exactly the same
          return SixwDictionaryAccessAPI.get6wRangeValues(iPropUri,cbFuncs);
      },

      /**
       * Function getFedProperties to get all searchable properties intended for FedSearch
       *
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.onlyMappable=false] - to indicate wether only properties that can be used for attribute mapping are returned. Default value is false.
       * @return {object} JSon object containing list of properties per owning vocabulary.
       * @example
       * Response:
       *  {
       *   "ds6w": {
       *     "curi": "ds6w:",
       *     "uri": "http://www.3ds.com/vocabularies/ds6w/",
       *     "label": "6W Vocabulary",
       *     "description": "This ontology defines the DS Corporate vocabulary for 6W tags."
       *     "properties": [
       *       {
       *         "curi": "ds6w:buyerCompany",
       *         "uri": "http://www.3ds.com/vocabularies/ds6w/reviewer",
       *         "label": "Reviewer",
       *         "description": "Name of the reviewer"
       *         "subPropertyOf": "ds6w:who",
       *         "datatype": "xsd:string"
       *       },
       *       ...
       *     ]
       *   },
       *   "swym": {
       *     ...
       *   }
       *  }
       */
      getFedProperties: function (cbFuncs) {
        // Rerouting because behavior is exactly the same
        return SixwDictionaryAccessAPI.get6wProperties(cbFuncs);
      },

      /**
       * Function getProperties to get all searchable (or not) properties of federated (or not) vocabularies
       *
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.onlyMappable=false] - to indicate wether only properties that can be used for attribute mapping are returned. Default value is false.
       * @param {string} [cbFuncs.view='search'] - purpose of the call. Possible values: "search" or "public".
       *                                  "search" view returns searchable properties of federated vocabularies (6W)
       *                                  "public" view, used for RDF access only, returns all properties
       *                                  default value: "search"
       */
      getProperties: function (cbFuncs) {
        this.getFedProperties(cbFuncs);
      },

      /**
       * Function getServiceClasses to get all classes of given services
       * @param {Array} iServices - A list of service names as returned by MyApps (e.g. ["usersgroup","3dportfolio"], ["3DSpace"] etc.)
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.view='search'] - Indicate the purpose of the call. Possible values: "search" or "public".
       *                                  "search" view returns searchable properties of federated vocabularies (6W)
       *                                  "public" view, used for RDF access only, returns all properties
       *                                  default value: "search"
       * @return {array} Array of objects per service, each contains the list of classes grouped per vocabulry.
       * @example
       * Input: "3DSpace"
       * Result:
       *  [
       *   {
       *     "service": "3DSpace",
       *     "vocabularies": [
       *       { "vocabularyInfo": { 
       *           "curi":"ds6wg:",
       *           “uri":http://www.3ds.com/vocabularies/ds6wg/ },
       *         "classes": [
       *           {
       *             "curi": "ds6wg:VPMReference",
       *             "uri": "http://www.3ds.com/vocabularies/ds6wg/VPMReference",
       *             "label": "Physical Product",
       *             "description": "..."
       *           },
       *           ...
       *         ]
       *       }
       *     ]
       *   }
       *  ]
       */
      getServiceClasses: function (iServices, cbFuncs){
        if (iServices === undefined || cbFuncs === undefined){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('getServiceClasses: missing input');
          }
          return;
        }

        if (!Array.isArray(iServices)){
          iServices = [iServices];
        }

        /*if (iServices.includes('3DSpace') && iServices.length>1) {
          cbFuncs.onFailure('If calling getServiceClasses with 3DSpace, no other service can be called');
          return;
        }*/

        var promises = [];
        for (var i = 0; i < iServices.length; i++) {
          var serviceCode = iServices[i];
          var service = iServices[i];
          if (service === '3DSpace' || service === '3DDrive') {
            serviceCode = 'ds6wg:';
          }

          if (service === '3DSwym'){
            serviceCode = 'swym:';
          }
          
          // Modification FUN151110: distinguishing the Swym case where we search in 3DSpace but with ds6w classes!
          if (service === '3DSwym' ){
            //var callBack = cbFuncs.onComplete;
            cbFuncs.serviceName = service;
            //promises.push(FedDictionaryAccess3DSpace.getSwymClasses(cbFuncs,serviceCode));
            if (SixwDicoUtils.isRDFOnER(cbFuncs)) {
              //console.log("### Retrieving RDF resources from 3DSpace...");
              promises.push(FedDictionaryAccess3DSpace.getSwymClasses(cbFuncs, serviceCode));
              // 08.03.2021 SGA5 IR-840134: 3DSwym has both swym: and pno: vocabularies
              promises.push(FedDictionaryAccess3DSpace.getSwymClasses(cbFuncs, 'pno:'));
            }
          }
          else if (service === '3DSpace' || service === '3DDrive'){
            //var callBack = cbFuncs.onComplete;
            cbFuncs.serviceName = service;
            //promises.push(FedDictionaryAccess3DSpace.getVocabularyClasses(cbFuncs,serviceCode));
            if (SixwDicoUtils.isRDFOnER(cbFuncs)) {
              //console.log("### Retrieving RDF resources from 3DSpace...");
              promises.push(FedDictionaryAccess3DSpace.getVocabularyClasses(cbFuncs, serviceCode));
            }
            else {
              /** FUN151110: commented because not used 
              if (serviceCode.startsWith('ds6wg')){
                promises.push(FedDictionaryAccess3DSpace.get3DSpaceTypes(cbFuncs, serviceCode));
              }
              else {
                promises.push(FedDictionaryAccessRDF.getVocabularyClasses(_OntoService, cbFuncs, serviceCode));
                if (service === '3DSwym'){
                // 08.03.2021 SGA5 IR-840134: 3DSwym has both swym: and pno: vocabularies
                  promises.push(FedDictionaryAccessRDF.getVocabularyClasses(_OntoService, cbFuncs, 'pno:'));
                }
              }*/
            }
          } else {
            promises.push(FedDictionaryAccessRDF.getServiceClasses(serviceCode, cbFuncs));
          }
        }

        var result = [];
        var isFulfilled = false;

        // wait till all calls are finished
        // Promise.allSettled is supported by FF starting v.71. Current supported version: 68. Need to use UWAPromise instead
        UWAPromise.allSettled(promises).then(function(data){
          for (var k =0; k<data.length; k++){
            var element = data[k];
            if (element === undefined || element === null){
              continue;
            }
            var status = element.state;
            if (status === 'fullfilled'){
              isFulfilled = true;
              var value = element.value;

              // for 3DSpace calls
              if (!Array.isArray(value)){
                value = [value];
              }
              var s = iServices[k];

              // to support 3DSwym service called 2 times
              if (value && value.length > 0 && value[0].vocabularyInfo && value[0].vocabularyInfo.curi === 'pno:'){
                if (k>0){
                  result[k-1].vocabularies = result[k-1].vocabularies.concat(value);
                }
              } else {
                var serviceItem = {service: s, vocabularies: value};
                result.push(serviceItem);
              }
            }
          }

          if (isFulfilled === true){
            cbFuncs.onComplete(result);
          } else {
            if (cbFuncs.onFailure){
              cbFuncs.onFailure('All calls failed');
            }
          }

        }).catch(function(data){
          if (cbFuncs.onFailure){
            cbFuncs.onFailure(data);
          }
        });
      },

      /**
       * Function getPropertiesRoots to get a root properties for a list of properties
       * @param {string} iPropUris - A list of properties short URIs separated by a comma. Ds6wg are not managed.
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                         By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @return {Array} Array of JSon object each containing a given property and the root 6W predicate it derives from
       * @example
       * Input: "ds6w:originator,ds6w:modified"
       * Response:
       * [
       *   {
       *     "curi": "ds6w:originator",
       *     "lineage": "ds6w:who"
       *   },
       *   {
       *     "curi": "ds6w:modified",
       *     "lineage": "ds6w:when"
       *   }
       * ]
       */
      getPropertiesRoots: function (iPropUris, cbFuncs){
        // Rerouting because behavior is exactly the same
        return SixwDictionaryAccessAPI.get6wPropertiesRoots(iPropUris,cbFuncs);
      },

      /**
       * Function getExtensionsForClass to get a list of extensions (interfaces for E/R or templates from RDF)
       * @param {string} iClassUri - A short URI of the class
       * @param {object} cbFuncs
       * @param {string} cbFuncs.onComplete - function called on complete. The result of the query is passed as a parameter.
       * @param {string} cbFuncs.onFailure - function called on failure. The error message is passed as a parameter.
       * @param {string} [cbFuncs.apiVersion='R2018x'] - format of the output. Supported formats: R2019x, R2018x
       * @param {string} [cbFuncs.lang='en'] - user's language
       * @param {string} [cbFuncs.serviceName='3DSpace'] - service name as defined by MyApps to force the call to a particular service.
       *                                         By default, service is 3DSpace or 3DDrive (depending on license).
       * @param {string} [cbFuncs.RDFStorage] - RDF pilar if the default behavior needs to be overriden.
       * @param {string} [cbFuncs.view='search'] - purpose of the call. Possible values: "search" or "public".
       *                                 "search" view returns searchable extensions
       *                                 "public" view, used for RDF access only, returns classe's templates
       *                                 default value: "search"
       * @return {object} - Json object containg the list of extensions of the given class
       * @example
	     * Input: "ds6wg:VPMReference"
       * Result:
       *   {
       *     "extensions": [
       *       {
       *         "curi": "ds6wg:PLMDELResNCSpotDrillTool",
       *         "uri“:  "http://www.3ds.com/.../ds6wg/PLMDELResNCSpotDrillTool",
       *         "label": "Spot Drill",
       *       },
       *       {
       *         "curi": "ds6wg:PLMDELResNCSpotDrillTool",
       *         "uri“:  "http://www.3ds.com/.../ds6wg/PLMDELResNCSpotDrillTool",
       *         "label": "Spot Drill",
       *       },
       *       ...
       *     ]
       *   }
	     */
      getExtensionsForClass: function (iClassUri, cbFuncs) {
        if (!iClassUri || !cbFuncs){
          if (cbFuncs && cbFuncs.onFailure) {
            cbFuncs.onFailure('getExtensionsForClass: missing inputs');
          }
          return;
        }

        var storageName = SixwDicoUtils.dicoExtensionsBaseKey;
        var localValues = sessionStorage.getItem(storageName);
        var fromCache = false;
        if (!localValues){
          localValues = [];
        }
        else {
          localValues = JSON.parse(localValues);
        }

        for (var i=0; i<localValues.length; i++){
          var classInfo = localValues[i];
          if (classInfo.class === iClassUri) {
            fromCache = true;
            var result = classInfo.extensions;
            cbFuncs.onComplete(result);
            break;
          }
        }

        var addToCache = function (result){
          var cacheObj = {'class': iClassUri, extensions: result };
          localValues.push(cacheObj);
          sessionStorage.setItem(storageName, JSON.stringify(localValues));
        };

        if (!fromCache){
          if (SixwDicoUtils.isRDFOnER(cbFuncs) || iClassUri.startsWith('ds6wg:')) {
            FedDictionaryAccess3DSpace.getTypeInterfaces(cbFuncs, iClassUri).then(function(result){
              addToCache(result);
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(data);
              }
            });
          }
          else {
              FedDictionaryAccessRDF.getClassTemplates(_OntoService, cbFuncs, iClassUri).then(function(result){
                addToCache(result);
                cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure();
              }
            });
          }
        }
      },

      /**
       * Function getNlsOfPropertiesValuesBySource To get the NLS translation of a list of property values retrieved from different data sources
       * @param {object} propValsElems - JSON object with keys as property URI and value as array of objects containing a value to translate and data source for look-up.
       *                                 Data source should be a valid data source in a format recognized by MyApps.
       * @param {object} cbFuncs - 
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
      getNlsOfPropertiesValuesBySource: function (propValsElems, cbFuncs){
          return SearchDictionaryAccessAPI.getNlsOfSearchValuesBySource (propValsElems, cbFuncs);
        }
      };

    return dicoReadAPI;
  });

