/*********************************************************************/
/*@fullReview XF3 21/05/2016
/*********************************************************************/

define('DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctionsV2',
['UWA/Core',
'DS/CfgSolver/CfgSolverServices',
'DS/CfgSolver/CfgSolverDebug',
'DS/ConfiguratorPanel/scripts/Utilities',
'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
'DS/UIKIT/Mask',
'DS/UIKIT/Alert',
'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json'
],
function (UWA,  CfgSolverServices,CfgSolverDebug,
  Utilities, ConfiguratorVariables, Mask, Alert, nlsConfiguratorKeys) {
    'use strict';
    var ConfiguratorSolverFunctions = {
        solverCreated: false,
        solverKey: '',
        solverNode: null,
        solverId: '',
        configModel: null,
        modelEvents: null,
        parentContainer: null,
        doNotUseSolver: false,

        initSolverRules : function(rules){
          var that = this;
          return CfgSolverServices.initialize({ solverKey: that.solverKey, jsonData: rules}).then(function () {
            that.solverCreated = true;
            that._resetSolver(true);
          });
        },

        _resetSolver : function (firstCall) {
          var that = this;
          this.CheckRulesConsistency().then(() =>{
            that.setSelectionModeOnSolver(that.configModel.getRulesMode(),{firstCall : firstCall});
          });
          that.defaultImage = CfgSolverServices.getDefaultImage();
        },

        initialize : function (configModel, modelEvents, version) {
          this.configModel = configModel;
          this.modelEvents = modelEvents;
          this.version = version || 'V1';

          if (this.displayErrorSolverNotification) {
            this.modelEvents.subscribe({ 'event': 'solver-call-error' }, () => {
              Utilities.displayNotification({eventID: 'error',msg: nlsConfiguratorKeys.Error_SERVICE_OUT});
            });
          }

          this.modelEvents.subscribe({ event: 'OnRuleAssistanceLevelChange' }, (data) => {
            if (data.value !== ConfiguratorVariables.NoRuleApplied)
            this.setSelectionModeOnSolver(data.value, true);

          });

          this.modelEvents.subscribe({ event: 'SolverFct_getResultingStatusOriginators' }, (data) => {
            this.getResultingStatusOriginators(data.value);
          });

          this.modelEvents.subscribe({ event: 'SolverFct_CallSolveMethodOnSolver' }, () => {
            this.CallSolveMethodOnSolver();
          });

          this.modelEvents.subscribe({ event: 'SolverFct_CallSolveOnSelectedIDsMethodOnSolver' }, (data) => {
            this.callSolverOnSelectedIDsMethodOnSolver(data);
          });
        },

        setSolverKey : function (solverKey, doNotUseSolver) {
          this.solverKey = solverKey;
          this.solverCreated = true;
          this.doNotUseSolver = doNotUseSolver;
          this.activateSolverDebug(); // to activate debug
          this._resetSolver(true);
          this.defaultImage = CfgSolverServices.getDefaultImage();
        },

        initSolver: function (modelId, configModel, modelEvents, configCriteria, parentContainer, options) {

            this.initialize(configModel, modelEvents, options.version);
            var that = this;
            this.configModel = configModel;
            this.modelEvents = modelEvents;
            this.modelId = modelId;
            this.parentContainer = (parentContainer) ? parentContainer : document.body;
            this.dictionary = options.dictionary;
            this.abortNotificationDisplayed = false;
            this.displayErrorSolverNotification = options.displayErrorSolverNotification !== undefined ? options.displayErrorSolverNotification : true;
            if(options && options.tenant){
      				this.tenant =options.tenant;
      			}else {
      				this.tenant = "OnPremise";
      			}



            if(this.version === "V1" || this.version === "V2" || this.version === "V3"){
              return CfgSolverServices.initSolver({modelId: modelId, data: {"configurationCriteria":configCriteria
            }, tenant : that.tenant}).then(function(data){
                return CfgSolverServices.hypervisordetails().then(function(HypervisorDetails){
                  that.solverKey = HypervisorDetails.solverKey;
                  that.activateSolverDebug();
                  setDictionaryForDashboard(data);
                });
              });
            }else if(this.version === "V4" || this.version === "V5"){
            	options = {
            			// Add option for knowing is model definition
            			tenant : that.tenant,
            			modelVersionId : that.modelId,
            			securityContext : window.widget ? window.widget.getValue("xPref_CREDENTIAL") : undefined
            	};
              return CfgSolverServices.create(options).then(async function (data) {
                  that.solverCreated = true;
                  var loadSolverDictionary = true;
              	  if(data.solverKey) {
              		// Answer coming from 3dSpace
                    that.solverKey = data.solverKey;
                  }else if (data.nodeId) {
                  	// Answer coming from ConfigSolverService
                  	that.solverKey = data.nodeId;
                    loadSolverDictionary = false;
                  }
                  that.activateSolverDebug();

                  var solverDico = loadSolverDictionary ? await that.getSolverDico(options) : that.dictionary;

                  return CfgSolverServices.initialize({ solverKey: data.solverKey, jsonData: solverDico }).then(function () {
                    if(that.configModel.isAsyncRuleLoad()) {
                      return UWA.Promise.resolve({
                        solverKey: that.solverKey
                      });
                    }
                    setDictionaryForDashboard({ dictionary: that.dictionary });
                  });
              });
            }
           
            function setDictionaryForDashboard(dictionaryData) {
                UWA.log("*********SolverKey:" + that.solverKey);
                that.configModel.setDictionary(dictionaryData.dictionary);
                that.solverCreated = true;
                var dictionary = that.configModel.getDictionary();

                window.addEventListener("unload", function () {
                    that.releaseSolver();
                });
                window.top.addEventListener("unload", function () {
                    that.releaseSolver();
                });

                that._resetSolver();
                that.defaultImage = CfgSolverServices.getDefaultImage();
                return UWA.Promise.resolve({
                    dictionary: dictionary,
                    solverKey: that.solverKey
                });
            }
        },

        getDefaultImage : function(){
          return this.defaultImage;
        },

        activateSolverDebug : function(){
            var solverTraces = window.sessionStorage['solver-activate-traces'];//false; // true to activate solver traces.. may need to be a local storage ot smtg
            if (solverTraces) {
                this._CfgSolverDebug = new CfgSolverDebug();
                this._CfgSolverDebug.init2('configurator', this.solverKey);
                this._CfgSolverDebug.injectIn(document.body);
            }
        },

        getSolverDico : function (options) {
          Utilities.setup({
            serviceUrl : CfgSolverServices.getServiceUrl(),
            tenant : options.tenant,
            securityContext : options.securityContext
          });

          return Utilities.sendRequestPromise({
            url : '/resources/v1/modeler/dspfl/invoke/dspfl:getSolverDico',
            method : 'POST',
            data : JSON.stringify({
              componentId : options.modelVersionId
            }),
            tenant: options.tenant,
            requestType: 'application/json'
          }).then((data)=>{
            return JSON.parse(data);
          });
        },

        getDictionary : function (options) {
          Utilities.setup({
            serviceUrl : CfgSolverServices.getServiceUrl(),
            tenant : options.tenant,
            securityContext : options.securityContext
          });
          return Utilities.sendRequestPromise({
            url : '/resources/v1/modeler/dspfl/invoke/dspfl:getVariabilityDefinition',
            method : 'POST',
            data : JSON.stringify({
              componentId : options.modelVersionId,
              content: {
                attributes: 3,
                attributeList: ['_image', '_description'],
                parameters: true
              }
            }),
            tenant: options.tenant,
            requestType: 'application/json'
          }).then((data)=>{
            return JSON.parse(data);
          });
        },

        getFeatureStatusEnforceBaseConfiguration : function(options) {
          Utilities.setup({
            serviceUrl : CfgSolverServices.getServiceUrl(),
            tenant : options.tenant,
            securityContext : options.securityContext
          });
          return Utilities.sendRequestPromise({
            url : '/resources/v1/modeler/dspfl/invoke/dspfl:getSupportedFeatures',
            method : 'POST',
            data : JSON.stringify(
              {
                "features": [
                    "enforceBaseConfiguration"
                ]
              }
            ),
            tenant: options.tenant,
            requestType: 'application/json'
          }).then((data)=>{
            try {
              if (typeof data === 'string') {
                  data = JSON.parse(data); 
              }
              return (data && data.features && data.features.enforceBaseConfiguration) ? data.features.enforceBaseConfiguration : false;
            } catch (error) {
                return false; 
            }
          });
        },

        loadAndInitSolverDictionary : async function (options) {
          var dictionary = this.getDictionary(options);
          let BC_ENFORCEMENT_ENABLED = this.getFeatureStatusEnforceBaseConfiguration(options)
          var solverKey;
          var that = this;

          var enforceBaseConfiguration = function () {
            if (BC_ENFORCEMENT_ENABLED) {
              var jsonMsg = {
                _from: 'configurator',
                _to: 'solver',
                _request: 'enforceBaseConfigurations',
                _data: 'true'
              };
              CfgSolverServices.computeAnswer(jsonMsg, solverKey)
            }
          };
          await CfgSolverServices.create(options).then(async (data) => {
              that.solverCreated = true;
              var loadSolverDictionary = true;
              if(data.solverKey) {
                solverKey = data.solverKey;
              } else if (data.nodeId) {
                solverKey = data.nodeId;
                loadSolverDictionary = false;
              }
              var solverDico = loadSolverDictionary ? await this.getSolverDico(options) : {};
              await CfgSolverServices.initialize({ solverKey: data.solverKey, jsonData: solverDico });
              enforceBaseConfiguration();
          });
          return {
            solverKey : solverKey,
            dictionary : await dictionary
          };
        },
        releaseSolver: function () {
            CfgSolverServices.release(this.solverKey);
        },

        CallSolveMethodOnSolver: function (options) {
            var that = this;
            if (this.solverCreated) {
              var listConfigurationCriteria = [];
              if(!this.doNotUseSolver){
                var requestData = null;
                  if (this.configModel.getRulesActivation() === "true") {
                      if(this.configModel.getRulesMode() === "RulesMode_SelectCompleteConfiguration"){
                        var criteriaList = this.configModel.getChosenConfigurationCriteria();
                        var defaultList = this.configModel.getDefaultCriteria();
                        if(this.configModel.isFirstSelectionDirty()) {
                          if(criteriaList.length === 0 && defaultList.length === 0) {
                            this.configModel.setFirstSelection(false);
                          } else {
                            this.configModel.setFirstSelection(true);
                          }
                        }
                        if(this.configModel.getFirstSelection()){
                          //IR-968694 : concat chosen & dismissed criteria to the payload
                          listConfigurationCriteria = this.configModel.convertToNewSolverFormat(this.configModel.getConfigurationCriteria());
                          requestData = { "configurationCriteria":  this.configModel._bcId ? Array.prototype.concat(listConfigurationCriteria, [{ Criterion : this.configModel._bcId, State: "Chosen" }]) : listConfigurationCriteria};
                            if(this.configModel._manageDefaultVersion === 'V2') {
                              requestData.timeoutForDefaultComputation = this.configModel.getDefaultComputationTimeout();
                            }
                            CfgSolverServices.CallSolveWithoutDignoseMethodOnSolver(requestData, that.solverKey, that.modelEvents).then(function (data) {
                                that.ApplyAnswer(data,options);
                            }, function () { });
                        }else{
                          if(options && options.firstCall){
                            this.modelEvents.publish({event:'solver_init_complete', data:{}});
                            this.modelEvents.publish({event : "pc-interaction-complete"});
                          } else {
                            this.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer", data: options});
                          }
                          Utilities.displayNotification({eventID: 'info',msg: nlsConfiguratorKeys.Selection_Required_Complete});
                          //
                        }
                      }else{
                        listConfigurationCriteria = this.configModel.convertToNewSolverFormat(this.configModel.getConfigurationCriteria());

                      requestData = { 
                        configurationCriteria: this.configModel._bcId ? Array.prototype.concat(listConfigurationCriteria, [{ Criterion : this.configModel._bcId, State: "Chosen" }]) : listConfigurationCriteria                   
                      };
                      CfgSolverServices.CallSolveMethodOnSolver(requestData, that.solverKey, that.modelEvents).then(function (data) {
                          that.ApplyAnswer(data,options);
                      }, function () { });
                      }
                  }else {
                    if(options && options.firstCall){
                      this.modelEvents.publish({event:'solver_init_complete', data:{}});
                      this.modelEvents.publish({event : "pc-interaction-complete"});
                    }
                  }
              }else{
                var message = UWA.String.unescapeHTML("<b>"+ nlsConfiguratorKeys.BC_conflict_title + "</b>" + "<br>" + nlsConfiguratorKeys.BC_conflict_message);
                Utilities.displayNotification({eventID: 'error',msg: message});
                this.configModel.setConflictingFeatures([this.configModel.getBCId()]);
                this.configModel.setRulesCompliancyStatus("Invalid");
                this.configModel.setRulesConsistency(false);
                var data = {
                  answerDefaults : undefined,
                  answerConflicts : [this.configModel.getBCId()],
                  answerRC : 'OK',
                  answerMethod : 'solveAndDiagnoseAll'
                }
                if(options && options.firstCall){
                  this.configModel.setConfigurationCriteria(this.configModel.getBCSelectedCriteria());
                  data.firstCall = true;
                  this.modelEvents.publish({event:'solver_init_complete', data:data});
                  this.modelEvents.publish({event:'solveAndDiagnoseAll_SolverAnswer', data:	data});
                }else{
                  var configCriteria = this.updateConfigCriteriaWithoutSolver(this.configModel.getAllConfigCriteria(), this.configModel.getBCSelectedCriteria());
                  this.configModel.setConfigurationCriteria(configCriteria);
                  data.firstCall = false;
                  this.modelEvents.publish({event:'solveAndDiagnoseAll_SolverAnswer', data:	data});
                }
              }
            }
        },
        callSolverOnSelectedIDsMethodOnSolver: function (options) {
            var that = this;
            if (this.solverCreated && !this.doNotUseSolver) {
              var listConfigurationCriteria = [];
                if (this.configModel.getRulesActivation() === "true") {
                    // var requestData = {"idsToDiagnose" : options.idsToDiagnose, "configurationCriteria": this.configModel.getConfigurationCriteria()};
                    //IR-968694 : concat chosen & dismissed criteria to the payload
                    listConfigurationCriteria = this.configModel.convertToNewSolverFormat(this.configModel.getConfigurationCriteria());

                    var configurationCriteria =   this.configModel._bcId ? Array.prototype.concat(listConfigurationCriteria, [{ Criterion : this.configModel._bcId, State: "Chosen" }]) : listConfigurationCriteria                     ;
                    var requestData = {"idsToDiagnose" : options.idsToDiagnose, "configurationCriteria": configurationCriteria};
                    if(this.configModel._manageDefaultVersion === 'V2') {
                      requestData.timeoutForDefaultComputation = this.configModel.getDefaultComputationTimeout();
                    }
                    var abortRequired;
                   if(!this.abortNotificationDisplayed){
                      abortRequired = setTimeout(function(){
                      that.counterNotification = Utilities.displayNotification({eventID: 'warning',msg: nlsConfiguratorKeys.Abort_Notification,action : {label: 'Abort',callback: function (counterNotification){
                          that.abortSolverCall(that.solverKey);
                          that.counterNotification = counterNotification;
                          Utilities.removeNotification(counterNotification);
                          that.abortNotificationDisplayed = false;
                          var _solveCriteria = that.configModel.getSolveConfigurationCriteria();
                          that.configModel.setSelectedConfigurationCriteria(_solveCriteria,options.idsToDiagnose);
                          that.configModel.setSolveWithDiagnose(false);
                          that.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {refresh : true}});
                      }}});
                      that.abortNotificationDisplayed = true;
                      },10000);
                   }
                    CfgSolverServices.CallSolverOnSelectedIDsMethodOnSolver(requestData, that.solverKey, that.modelEvents).then(function (data) {
                        that.ApplyAnswer(data,"false", options.idsToDiagnose);
                        if(that.abortNotificationDisplayed){
                          Utilities.removeNotification(that.counterNotification);
                          that.abortNotificationDisplayed = false;
                        }
                        clearTimeout(abortRequired);
                    }, function () { });
                }
            }
        },

        setSelectionModeOnSolver: function (newMode, callSolveAfterSolverResult) {
            var that = this;
            if (this.solverCreated) {
              this.configModel.resetDefaultCriteria();
              if (newMode !== ConfiguratorVariables.NoRuleApplied){
                if (newMode === ConfiguratorVariables.RulesMode_DisableIncompatibleOptions)
                    newMode = "Select_None";
                else if (newMode === ConfiguratorVariables.RulesMode_EnforceRequiredOptions)
                    newMode = "Select_RequiredAndDefault";
                else if (newMode === ConfiguratorVariables.RulesMode_SelectCompleteConfiguration)
                {
                  newMode = "Select_ProposedSelection";
                  if(callSolveAfterSolverResult) {
                    that.modelEvents.publish({event : "pc-reset-first-selection"});
                  }
                }
                else if (newMode === ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration)
                    newMode = "Select_OptimalSelection";

                var abortRequest = callSolveAfterSolverResult ? that.abortSolverCall() : UWA.Promise.resolve();

                abortRequest.then(function () {
                  CfgSolverServices.setSelectionModeOnSolver(newMode, that.solverKey, that.modelEvents).then(function (data) {
                    if(callSolveAfterSolverResult) {
                      that.modelEvents.publish({event : "pc-interaction-started"});
                    }
                    setTimeout(function () {
                      that.ApplyAnswer(data, callSolveAfterSolverResult);
                    }, 100);

                  }, function () { });
                });
              }
          }
        },

        getResultingStatusOriginators: function (optionId) {
            var that = this;
            CfgSolverServices.getResultingStatusOriginators(optionId, this.solverKey,that.modelEvents).then(function (data) {
                that.ApplyAnswer(data);
            }, function () { });
        },

        abortSolverCall: function (/*optionId*/) {
            return CfgSolverServices.abortSolverCall(this.solverKey);
        },

        CheckRulesConsistency: function () {
            var that = this;
            if (this.solverCreated) {
                return CfgSolverServices.CheckRulesConsistency(this.solverKey,that.modelEvents)
                .then(function (data) {
                    that.ApplyAnswer(data);
                }, function () { });
            }
            return new Promise().reject();
        },

        // eslint-disable-next-line complexity
        ApplyAnswer: function (input, in_callSolveAfterSolverResult,idsToDiagnose) {
          var ret = true;
          var callSolveAfterSolverResult;
          var firstCall = false;
          if (in_callSolveAfterSolverResult !== undefined) {
            callSolveAfterSolverResult = in_callSolveAfterSolverResult;
          }
          if(in_callSolveAfterSolverResult && in_callSolveAfterSolverResult.firstCall){
            firstCall = true;
          }

            if (input !== undefined && input !== "" && UWA.typeOf(input) === "string") {
                var inputbis = JSON.parse(input);

                var answerMethod = inputbis._answer;
                var answerData = inputbis._data;
                var answerRC = inputbis._rc;

                if (answerMethod === "getResultingStatusOriginators") {

                    var causingAssumptions = answerData.causingAssumptions;
                    var optionSelected = answerData.optionSelected;

                    this.modelEvents.publish({
                        event: 'getResultingStatusOriginators_SolverAnswer',
                        data: {
                            causingAssumptions: causingAssumptions,
                            optionSelected: optionSelected,
                            answerRC: answerRC
                        }
                    });
                }

                else if (answerMethod === "checkModelConsistency") {

                    if (answerRC === "Rules_KO" || answerRC === "ERROR") {
                        this.configModel.setRulesConsistency(false);
                        if (this.configModel.setRulesActivation) {
                            this.configModel.setRulesActivation("false");

                            var message = nlsConfiguratorKeys.InfoInconsistentRules;

                            var listOfInconsistentRules = answerData.listOfInconsistentRulesIds;
                            if (listOfInconsistentRules.length > 0) {
                                message += "<br>" + nlsConfiguratorKeys.ImpliedRules + ":<br>";
                                for (var i = 0; i < listOfInconsistentRules.length; i++) {
                                    message += "<blocquote style='padding-left:20px;'>" + listOfInconsistentRules[i] + "<br></blocquote>";
                                }
                            }
                            if (answerRC == "ERROR") {
                                message += "<br>" + nlsConfiguratorKeys.InfoComputationAborted;
                            }
                            Utilities.displayNotification({eventID: 'info',msg: message});
                        }
                        else this.configModel.setRulesConsistency(true);

                        this.modelEvents.publish({
                            event: 'checkModelConsistency_SolverAnswer',
                            data: {answerRC: answerRC}
                        });
                    }
                }

                else if (answerMethod === "solveAndDiagnoseAll" || answerMethod === "solve" || answerMethod === "solveAndDiagnose") {

                    var answerConfigCriteria = inputbis._version === "4.0" ? 
                        this.configModel.convertFromNewSolverFormat(answerData.configurationCriteria,'configurationCriteria') : answerData.configurationCriteria;
                    var answerModifiedAssumptions = answerData.modifiedAssumptions;
                    var answerConflicts = answerData.conflicts;
                    var answerDefaults = answerData.defaults;

                    if (answerConflicts) {
                        if (answerRC === "ERROR") {
                            Utilities.displayNotification({eventID: 'info',msg: nlsConfiguratorKeys.InfoComplexityOfRules});
                        }
                        var listOfListOfConflictingIds = inputbis._version === "4.0" ? 
                            this.configModel.convertFromNewSolverFormat(answerConflicts,'conflictCriteria'): answerConflicts;
                        this.configModel.setConfigurationCriteria(answerConfigCriteria);
                        this.configModel.setConflictingFeatures(listOfListOfConflictingIds);
                        this.configModel.setRulesCompliancyStatus("Invalid");
                    }

                    else if (answerConfigCriteria) {	// No conflict found during resolution
                      this.configModel.setConfigurationCriteria(answerConfigCriteria,answerMethod,idsToDiagnose);
                        this.configModel.setConflictingFeatures(null);
                        this.configModel.setRulesCompliancyStatus("Valid");
                    }

                    if (answerDefaults) {
                      var listOfDefaultCriteria = inputbis._version === "4.0" ? 
                            this.configModel.convertFromNewSolverFormat(answerDefaults,'defaultCriteria'): answerDefaults;
                      this.configModel.setDefaultCriteria(listOfDefaultCriteria);
                    }

                    if (answerModifiedAssumptions && answerModifiedAssumptions.length > 0) {		// Some assumptions have been modified during resolution
                      var listOfModifiedAssumptions = inputbis._version === "4.0" ? 
                            this.configModel.convertFromNewSolverFormat(answerModifiedAssumptions,'modifiedAssumtionsCriteria'): answerModifiedAssumptions;
                      var message = nlsConfiguratorKeys.InfoIdsIncompatibles + "<br>";
                      for (var i = 0; i < listOfModifiedAssumptions.length; i++) {
                        //Need to adopt the new format for answerModifiedAssumption
                          message += "<blocquote style='padding-left:20px;'>" + this.configModel.getFeatureDisplayNameWithId(listOfModifiedAssumptions[i].Id);
                          if(UWA.is(this.configModel.getOptionDisplayNameWithId(listOfModifiedAssumptions[i].Id))){
                            message += "[" + this.configModel.getOptionDisplayNameWithId(listOfModifiedAssumptions[i].Id) + "]<br></blocquote>";
                          }else{
                            message += "</blocquote>";
                          }
                      }
                      Utilities.displayNotification({eventID: 'info',msg: message});
                    }
                    var dataToShate = {
                      answerDefaults : listOfDefaultCriteria,
                      answerConflicts : listOfListOfConflictingIds,
                      answerRC : answerRC,
                      answerMethod : answerMethod,
                      firstCall : firstCall
                    }
                    // default computation timeout
                    if (answerRC === "DEFAULT_ABORTED") {
                      Utilities.displayNotification({eventID: 'warning',msg: nlsConfiguratorKeys.DefaultAbortWarning});
                    }

                    //condition to be simplified
                    if(firstCall){
                      this.modelEvents.publish({event:'solver_init_complete', data:dataToShate});
                      if(this.version === "V5"){
                        this.modelEvents.publish({event:'solveAndDiagnoseAll_SolverAnswer', data:	dataToShate});
                      }
                    }else{
                      this.modelEvents.publish({event:'solveAndDiagnoseAll_SolverAnswer', data:	dataToShate});
                    }
                }

                else if (answerMethod === "setSelectionMode" && callSolveAfterSolverResult) {
                  if(callSolveAfterSolverResult.firstCall)
                    this.CallSolveMethodOnSolver(callSolveAfterSolverResult);
                  else
                    this.CallSolveMethodOnSolver({refresh :true});
                }

                else if (answerRC === "ERROR") {// GENERIC ERROR MSG
                    console.log("Error during solver resolution");
                }
            }

            return ret;
        },

        updateConfigCriteriaWithoutSolver : function (configCriteria, bcSelectedCriteria){
          var arrConfigCriteria = [];
          for(var i = 0; i<configCriteria.length; i++){
            if(configCriteria[i].Id === bcSelectedCriteria[i].Id){
              if(configCriteria[i].State === "Unselected" && bcSelectedCriteria[i].State === "Required"){
                arrConfigCriteria.push(bcSelectedCriteria[i]);
              }else if(configCriteria[i].State === "Unselected" && bcSelectedCriteria[i].State === "Default"){
                arrConfigCriteria.push(bcSelectedCriteria[i]);
              }
              else{
                arrConfigCriteria.push(configCriteria[i]);
              }
            }
          }
          return arrConfigCriteria;
        },

        setServiceUrl : function (serviceUrl) {
          CfgSolverServices.setServiceUrl(serviceUrl);
        },

        // should be remove when will we pass only on the ConfigRuleService
        getUrl3DSpaceService : function (tenant) {
            return CfgSolverServices.getUrl3DSpaceService(tenant);
        }

    };


    return UWA.namespace('DS/ConfiguratorPanel/ConfiguratorSolverFunctionsV2', ConfiguratorSolverFunctions);
});

/*********************************************************************/
/*@fullReview XF3 21/05/2016
/*********************************************************************/

define('DS/ConfiguratorPanel/scripts/Utilities',
		[   'UWA/Core',
		    'DS/i3DXCompassServices/i3DXCompassServices',
		    'DS/Notifications/NotificationsManagerUXMessages',
		    'DS/Notifications/NotificationsManagerViewOnScreen',
        'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
        'DS/WAFData/WAFData'
		    ],
		    function (UWA, i3DXCompassServices, NotificationsManagerUXMessages, NotificationsManagerViewOnScreen, ConfiguratorVariables, WAFData) {

	var Utilities = {
			_serviceUrl: null,_tenant : "",
			_notif_manager: null,

			setup : function (options) {
				this._serviceUrl = options.serviceUrl;
				this._tenant = options.tenant;
				this._securityContext = options.securityContext;
			},

			sendRequestPromise : function (options) {
				var url = options.url;
				var method = options.method;
				var data = options.data;
				var timeout = options.timeout;
				var responseType = options.responseType;
				var requestType = options.requestType;
				var tenant = options.tenant || "OnPremise";
				var that = this;
				return new UWA.Promise(function (resolve, reject) {
					that.sendRequest(url, method, responseType, true, resolve, reject, data, timeout, tenant, requestType);
				});
			},

			sendRequest : function (inputUrl, requestMethod, responseType, async, onCompleteCallback, onFailureCallback, data, timeout,tenant, requestType) {
				var that = this;
				if(tenant && tenant !== "OnPremise"){
					that._securityContext = null;
					that._serviceUrl = null;
					that.receivedTenant = tenant;
				}
				var request = function (in_inputUrl, in_requestMethod, in_responseType, in_async, in_onCompleteCallback, in_onFailureCallback, in_data, in_timeout, in_requestType) {
					var requestUrl =
					that.wafAuthenticatedRequest(that._serviceUrl + in_inputUrl, {
						method : in_requestMethod,
						type: in_requestType || 'json',
						async : in_async ,
						proxy:'passport',
						headers:{
							"SecurityContext": (that._securityContext) ? that._securityContext : "",
							"Content-Type":  in_requestType || 'json'
						},
						onComplete : in_onCompleteCallback,
						onFailure : in_onFailureCallback,
						timeout: in_timeout? in_timeout : 0,
						data:in_data,
						responseType: in_responseType
					}/*, newTimeout*/);
				};
				if(that._securityContext == null){
					that.setSecurityContext(function(){
						request(inputUrl, requestMethod, responseType, async, onCompleteCallback, onFailureCallback, data, timeout, requestType);
					});
				} else {
					if(that._serviceUrl != null) {
						request(inputUrl, requestMethod, responseType, async, onCompleteCallback, onFailureCallback, data, timeout, requestType);
					}
					else {
						var parameters = {
							serviceName : '3DSpace',
							platformId : "",    //widget.getValue('x3dPlatformId'),
							onComplete : function(URLResult) {
								if (typeof URLResult === "string") {
									that._serviceUrl = URLResult;
								} else {
									that._serviceUrl = URLResult[0].url;
								}
								that._tenant = URLResult[0]["platformId"];

								/** Added for multitenant issue **/
								if(that.receivedTenant !== "OnPremise"){
									var count, data = URLResult || [];
									for (count = 0; count < data.length; count++) {
										if (that.receivedTenant == data[count]["platformId"]) {
											that._serviceUrl  = data[count].url;
											that._tenant = data[count]["platformId"];
										}
									}
								}
								request(inputUrl, requestMethod, responseType, async, onCompleteCallback, onFailureCallback, data, timeout, requestType);
							},
							onFailure : function() {
								console.log("Service initialization failed...");
							}
						};

						objCancel = i3DXCompassServices.getServiceUrl(parameters);
					}
				}




			},

			displayNotification: function(options) {
				var that = this,counterNotification;
				if (this._notif_manager === null) {
					this._notif_manager = NotificationsManagerUXMessages;
					NotificationsManagerViewOnScreen.setNotificationManager(this._notif_manager);
				}
				var level = 'info';
				if (UWA.is(options.eventID) && options.eventID !== 'primary') {
					level = options.eventID;
				}
				var notifOptions = {
					level: level,
					message: options.msg,
					sticky: false
				}
				if(options && options.action && options.action.callback){
					notifOptions.action = {
						label : options.action.label,
						callback : function(){
							options.action.callback(counterNotification);
						}.bind(counterNotification)
					}
				}
				counterNotification = this._notif_manager.addNotif(notifOptions);
				return counterNotification;
			},
			removeNotification : function(counterNotification){
				if(NotificationsManagerViewOnScreen && counterNotification && UWA.is(counterNotification, 'number')){
						NotificationsManagerViewOnScreen.removeNotification(counterNotification);
				}
			},
			removeAllNotifications : function(){
				if(NotificationsManagerViewOnScreen){
						NotificationsManagerViewOnScreen.removeNotifications();
				}
			},

			setCookie: function(cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+ d.toUTCString();
				document.cookie = cname + "=" + cvalue + "; " + expires;
			},

			getCookie: function(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i = 0; i <ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length,c.length);
					}
				}
				return "";
			},

			convertStatesToPersistedStatesInConfigCriteria: function (configurationCriteria) {

			    for (var i = 0; i < configurationCriteria.length; i++) {

			        if (configurationCriteria[i].State == ConfiguratorVariables.Chosen)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Chosen;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Required)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Required;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Default)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Default;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Dismissed)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Dismissed;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Incompatible)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Incompatible;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Unselected)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Unselected;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.Selected)
			            configurationCriteria[i].State = ConfiguratorVariables.PersistenceStates_Selected;
			    }

			    return configurationCriteria;
			},

			convertPersistedStatesToStatesInConfigCriteria: function (configurationCriteria) {

			    for (var i = 0; i < configurationCriteria.length; i++) {

			        if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Chosen)
			            configurationCriteria[i].State = ConfiguratorVariables.Chosen;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Required)
			            configurationCriteria[i].State = ConfiguratorVariables.Required;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Default)
			            configurationCriteria[i].State = ConfiguratorVariables.Default;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Dismissed)
			            configurationCriteria[i].State = ConfiguratorVariables.Dismissed;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Incompatible)
			            configurationCriteria[i].State = ConfiguratorVariables.Incompatible;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Unselected /*|| configurationCriteria[i].State == "included"*/)
			            configurationCriteria[i].State = ConfiguratorVariables.Unselected;
			        else if (configurationCriteria[i].State == ConfiguratorVariables.PersistenceStates_Selected)
			            configurationCriteria[i].State = ConfiguratorVariables.Selected;
			    }

			    return configurationCriteria;
			},

			getDefaultImage: function () {
			    var image = '';

			    if (this._serviceUrl != null) {
			        image = this._serviceUrl + "/snresources/images/icons/large/iconLargeDefault.png";
			    }

			    return image;
			},

			getServiceUrl: function() {
			    return this._serviceUrl;
			},

			setSecurityContext: async function (callback) {
				var that = this;
				var securityContextWSCall = function() {
				    var response = null;
				    var _securityCntxt = undefined;   //widget.getValue('SC');
				    if ((_securityCntxt != null) && (_securityCntxt != undefined) && (_securityCntxt != "")) {
					    response = "ctx::" + _securityCntxt;
					    that._securityContext = response;
							if(UWA.is(callback, 'function')) {
								callback(that._securityContext);
							}
				    }
				    else {
					    var getSecurityContextURL = "/resources/pno/person/getsecuritycontext";
					    var onCompleteCallBack = function (securityContextDetails) {
						    response = securityContextDetails.SecurityContext;
					        if (!response || response == null) {
					        }
					        else {
							        if (securityContextDetails != null && securityContextDetails != "" && securityContextDetails.hasOwnProperty("SecurityContext")) {
							          var prefix = "";
							          if (securityContextDetails.SecurityContext.indexOf("ctx::") != 0)  //ctx:: is mandatory. In some serveur, this ctx doesn't exist
							           prefix = 'ctx::';
							           response = prefix + securityContextDetails.SecurityContext;
							        }
							        console.log("Setting security Context: " + response);
							        that._securityContext = securityContextDetails.SecurityContext;
											if(UWA.is(callback, 'function')) {
												callback(that._securityContext);
											}
						        }
					    };
					    var onFailure = function (e) {console.log('getSecurityContext:Failure...' + e);};
						that.wafAuthenticatedRequest(that._serviceUrl + getSecurityContextURL, {
						    method : 'GET',
						    type:'json',
							async : true ,
						    proxy:'passport',
							header:{
								"Content-Type":  'json'
							},
						    onComplete : onCompleteCallBack,
						    onFailure : onFailure,
						    timeout: 5000
						    });

					    }
				}

				if(that._serviceUrl == null){
						var parameters = {
							serviceName : '3DSpace',
							platformId : "",    //widget.getValue('x3dPlatformId'),
							onComplete : function(URLResult) {
								if (typeof URLResult === "string") {
									that._serviceUrl = URLResult;
								} else {
									that._serviceUrl = URLResult[0].url;
								}

								that._tenant = URLResult[0]["platformId"];
								// if(that.receivedTenant && tenant !== "OnPremise"){
								// 	that._tenant = that.receivedTenant;
								// }
								/** Added for multitenant issue **/
								if(that.receivedTenant !== "OnPremise"){
									var count, data = URLResult || [];
									for (count = 0; count < data.length; count++) {
	                  if (that.receivedTenant == data[count]["platformId"]) {
	                      that._serviceUrl  = data[count].url;
	                      that._tenant = data[count]["platformId"];
	                  }
	                }
								}
								securityContextWSCall(that);

							},
							onFailure : function() {
								console.log("Service initialization failed...");
							}
					};

					objCancel = i3DXCompassServices.getServiceUrl(parameters);
				}else {
					securityContextWSCall(that);
				}

			},

			getSecurityContext: function () {
			    return this._securityContext;
			},

			wafAuthenticatedRequest: function (url, obj, timeout) {

				var timestamp = new Date().getTime();

				/**In case the url has attributes, append the tenant and timestamp accordingly*/
				if (url.indexOf("?") == -1) {
					url = url + "?tenant=" + this._tenant + "&timestamp=" + timestamp;
				}
				else {
					url = url + "&tenant=" + this._tenant + "&timestamp=" + timestamp;
				}
				//setTimeout(function(){
					WAFData.authenticatedRequest(url, obj);
				//},timeout);

			},
			getImpliedRulesTitle: function(listOfImpliedRules){
				var message='';
				return Utilities.sendRequestPromise({
					url : '/resources/v1/modeler/dspfl/dspfl:Rule/getItems?$mask=dsmvpfl:RuleUIMask',
					method : 'POST',
					data : JSON.stringify(listOfImpliedRules),
					timeout: 300000,
					tenant: window.widget.getValue("x3dPlatformId") ? window.widget.getValue("x3dPlatformId") : 'OnPremise',
					requestType: 'application/json',
					responseType: 'json'
				}).then((data)=>{
					UWA.log("getRuleDetails: Service Call Successful !!!");
					var mrDetails;
					if(data.member){
						if(data.member.length>1){
							mrDetails = data.member;
							for (var j = 0 ; j < mrDetails.length; j++) {
								if (j == 0) {
									message += " " + UWA.i18n("ImpliedRules") + " : ";
								}
								var ruleName = mrDetails[j].title;
								message += " " + ruleName;
							}
						}else{
							mrDetails = data.member[0];
							message += " " + UWA.i18n("ImpliedRules") + " : ";
							var ruleName = mrDetails.title;
							message += " " + ruleName;
						}
					}
					return message;
				});
			}
	};


	return UWA.namespace('DS/ConfiguratorPanel/Utilities', Utilities);
});

define(
    'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
    [
    ],
    function(){
    'use strict';
		var ConfiguratorVariables =  {
			Unselected : 'Unselected',
			UnselectedMandatory : 'Unselected Mandatory',
			SelectionInConflict : 'Selection In Conflict',
			ChosenByTheUser : 'Chosen by the user',
			RequiredByRules : 'Required by rules',
			DefaultSelected : 'Default selected',
			ProposedByOptimization : 'Proposed by optimization',
			DismissedByTheUser : 'Dismissed by the user',
			NoFilter : 'No filter',

			BuildConfiguration : 'Build Configuration',
			RefineConfiguration : 'Refine Configuration',

			ProposeOptimizedConfiguration : 'Propose optimized configuration',
			SelectCompleteConfiguration : 'Select complete configuration',
			EnforceRequiredOptionsAndSelectDefault : 'Enforce required options and select default',
			DisableIncompatibleOptions : 'Disable incompatible options',
			NoRuleApplied : 'No rule applied',

			select : 'select',
			reject : 'reject',

			str_yes : 'yes',
			str_no 	: 'no',

			str_true	: 'true',
			str_false	: 'false',

			Complete	: 'Complete',
			Hybrid 		: 'Hybrid',
			Partial 	: 'Partial',

			Invalid : 'Invalid',
			Valid : 'Valid',

			Unknown : 'Unknown',

			Chosen : 'Chosen',
			Default : 'Default',
			Required : 'Required',
			Selected : 'Selected',
			Dismissed : 'Dismissed',
			Incompatible : 'Incompatible',
			Conflict : 'Conflict',
			Range : 'range',
			Included : 'Included',

			selectionMode_Build : 'selectionMode_Build',
			selectionMode_Refine : 'selectionMode_Refine',

			feature_SelectionMode_Dismiss: 'Dismiss',
			feature_SelectionMode_Single: 'Single',
			feature_SelectionMode_Multiple: 'Multiple',
			feature_SelectionMode_EnforceMultiple: 'EnforceMultiple',
			feature_SelectionMode_Parameter: 'Parameter',

			RulesMode_ProposeOptimizedConfiguration : 'RulesMode_ProposeOptimizedConfiguration',
			RulesMode_SelectCompleteConfiguration : 'RulesMode_SelectCompleteConfiguration',
			RulesMode_EnforceRequiredOptions : 'RulesMode_EnforceRequiredOptions',
			RulesMode_DisableIncompatibleOptions : 'RulesMode_DisableIncompatibleOptions',


			cookie_Products : "DS_ConfiguratorCookie_AppStore_Products",
			cookie_PCs : "DS_ConfiguratorCookie_AppStore_PCs",
			cookie_PhyProducts : "DS_ConfiguratorCookie_AppStore_PhyProducts",

			type_HardwareProduct : "Hardware Product",
			type_ProductReference : "VPMReference",
			type_ProductConfiguration : "Product Configuration",

			str_create : 'create',
			str_delete : 'delete',
			str_list : 'list',
			str_plus : 'plus',
			str_trash : 'trash',
			str_help : 'help',
			str_star : 'star',
			str_user : 'user',
			str_none : 'none',
			str_ERROR : 'ERROR',



			PersistenceStates_Unselected: 'available',
			PersistenceStates_Chosen: 'chosen',
			PersistenceStates_Default: 'default',
			PersistenceStates_Required: 'required',
			PersistenceStates_Selected: 'recommanded',
			PersistenceStates_Dismissed: 'dismissed',
			PersistenceStates_Incompatible: 'incompatible',

			Single: "Single",
      Multiple: "Multiple",

      Filter_AllVariants  : 'topbar-allVariants',
      Filter_Chosen : 'topbar-userSelections',
      Filter_Conflicts : 'topbar-conflictingSelections',
      Filter_Rules : 'topbar-rulesDeduction',
      Filter_Unselected : 'topbar-unselectedFeatures',
      Filter_Mand : 'topbar-unselectedMandatory',
	  Filter_Commercial: 'topbar-commercialSelections',

      TILE_VIEW : 'TileView',
      GRID_VIEW : 'DataGridView'
		};

		return ConfiguratorVariables;
	}

);

define('DS/ConfiguratorPanel/scripts/Presenters/SetParameterDialog', [
    'DS/Windows/Dialog',
    'DS/Controls/Toggle',
    'DS/Controls/ButtonGroup',
    'DS/Controls/SpinBox',
    'DS/UIKIT/Tooltip',
    'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong',
    'i18n!DS/ConfiguratorPanel/assets/nls/SetParameterDialog.json'
], function (WUXDialog, WUXToggle, WUXButtonGroup, SpinBox, Tooltip, xUnitLabelLong, nls_SetParameterDialog) {
    'use strict';

    var customButtonsDefinition;
    var content = UWA.createElement('div', {
        styles: {
            width: '350px',
            height: '100px'
        }
    });

    var parameterDialog = function () {};

    parameterDialog.prototype.init = function (options) {
        this.statusMap = ['Selected', 'Default', 'Not Available', 'Available'];
        this.paramCellView = options.parameterView ? options.parameterView : undefined;
        this.status = options.parameterView.status;
        this.numericValue = options.parameterView.numericValue;
        this.maxValue = options.parameterView.maxValue;
        this.minValue = options.parameterView.minValue;
        this.unit = options.parameterView.unit;
        this.parameterLabel = this.paramCellView.executionContext.nodeModel.getAttributeValue('title');

        this.range = options.parameterView.range;

        if (
            parseInt(this.numericValue) < parseInt(this.minValue) ||
            parseInt(this.numericValue) > parseInt(this.maxValue)
        )
            this.numericValue = this.minValue;

        this.createButtons();
        this.createContent();
    };

    parameterDialog.prototype.addStateOptions = function () {
        var that = this;
        var stateRadioButtons = new WUXButtonGroup({ type: 'radio' });

        var availableRadioButton = new WUXToggle({
            type: 'radio',
            label: nls_SetParameterDialog.Available,
            value: 3,
            // Incompatible and Required are not selectable but must be mapped to Available selection         
            checkFlag: ['Available', 'Incompatible' , 'Required' ].includes(that.status)
        });
        availableRadioButton.elements.container.appendChild(that.availableInfoIcon);

        var notAvailableRadioButton = new WUXToggle({
            type: 'radio',
            label: nls_SetParameterDialog.NotAvailable,
            value: 2,
            checkFlag: that.status == 'Not Available'
        });

        var selectedRadioButton = new WUXToggle({
            type: 'radio',
            label: nls_SetParameterDialog.Selected,
            value: 0,
            checkFlag: that.status == 'Selected'
        });
        selectedRadioButton.elements.container.appendChild(that.selectedInfoIcon);
        selectedRadioButton.elements.container.appendChild(that.selectedStateSpinBox.elements.container);
        selectedRadioButton.addEventListener('change', function (e) {
            if (e.dsModel.checkFlag) {
                that.selectedStateSpinBox.show();
            }
            if (!e.dsModel.checkFlag && e.dsModel.checkFlag != undefined) {
                that.selectedStateSpinBox.hide();
            }
        });

        var defaultRadioButton = new WUXToggle({
            type: 'radio',
            label: nls_SetParameterDialog.Default,
            value: 1,
            checkFlag: that.status == 'Default'
        });
        defaultRadioButton.elements.container.appendChild(that.defaultInfoIcon);
        defaultRadioButton.elements.container.appendChild(that.defaultStateSpinBox.elements.container);
        defaultRadioButton.addEventListener('change', function (e) {
            if (e.dsModel.checkFlag) {
                that.defaultStateSpinBox.show();
            }
            if (!e.dsModel.checkFlag && e.dsModel.checkFlag != undefined) {
                that.defaultStateSpinBox.hide();
            }
        });

        stateRadioButtons.addChild(selectedRadioButton);
        stateRadioButtons.addChild(defaultRadioButton);
        stateRadioButtons.addChild(notAvailableRadioButton);
        stateRadioButtons.addChild(availableRadioButton);

        stateRadioButtons.addEventListener('change', function (e) {
            if (e.dsModel.value && e.dsModel.value.length > 0) {
                that.status = that.statusMap[e.dsModel.value[0]];
            }
        });

        stateRadioButtons.inject(content);
    };

    parameterDialog.prototype.addRangeSelection = function () {
        var that = this;
        if (that.status == 'Default') {
            that.valueForDefaultState = that.numericValue;
        }
        if (that.status == 'Selected') {
            that.valueForSelectedState = that.numericValue;
        }
        that.defaultStateSpinBox = new SpinBox({
            type: 'spinbox',
            value: that.numericValue ? parseInt(that.numericValue) : parseInt(that.minValue),
            minValue: that.minValue,
            maxValue: that.maxValue,
            stepValue: 1,
            decimals: 0
        });

        that.defaultStateSpinBox.elements.container.style.marginLeft = '109px';
        that.defaultStateSpinBox.elements.container.style.width = '150px';
        if (that.status != 'Default') that.defaultStateSpinBox.hide();

        that.selectedStateSpinBox = new SpinBox({
            type: 'spinbox',
            value: that.numericValue ? parseInt(that.numericValue) : parseInt(that.minValue),
            minValue: that.minValue,
            maxValue: that.maxValue,
            stepValue: 1,
            decimals: 0
        });

        that.selectedStateSpinBox.elements.container.style.marginLeft = '100px';
        that.selectedStateSpinBox.elements.container.style.width = '150px';
        if (that.status != 'Selected') that.selectedStateSpinBox.hide();

        that.selectedStateSpinBox.addEventListener('change', function (event) {
            if (event.dsModel.value) {
                that.valueForSelectedState = parseInt(event.dsModel.value);
            }
        });

        that.defaultStateSpinBox.addEventListener('change', function (event) {
            if (event.dsModel.value) {
                that.valueForDefaultState = parseInt(event.dsModel.value);
            }
        });
    };

    parameterDialog.prototype.addStateInfoTooltip = function () {
        var that = this;

        that.selectedInfoIcon = UWA.createElement('span', {
            "class": 'fonticon fonticon-1x fonticon-info'
        });
        that.selectedInfoIcon.style.color = '#77797c';
        that.selectedInfoIcon.style.marginLeft = '3px';

        that.defaultInfoIcon = UWA.createElement('span', {
            "class": 'fonticon fonticon-1x fonticon-info'
        });
        that.defaultInfoIcon.style.color = '#77797c';
        that.defaultInfoIcon.style.marginLeft = '3px';

        that.availableInfoIcon = UWA.createElement('span', {
            "class": 'fonticon fonticon-1x fonticon-info'
        });
        that.availableInfoIcon.style.color = '#77797c';
        that.availableInfoIcon.style.marginLeft = '3px';

        var selectedInfoTooltip = new Tooltip({
            position: 'bottom',
            target: that.selectedInfoIcon,
            body: '',
            events: {
                onShow: function (event) {
                    let content = that.minValue + '-' + that.maxValue;
                    if (that.unit) {
                        content += ' ' + xUnitLabelLong.get(that.unit);
                    }
                    this.setBody(content);
                },
                onHide: function (event) {
                    this.setBody('');
                }
            }
        });

        var defaultInfoTooltip = new Tooltip({
            position: 'bottom',
            target: that.defaultInfoIcon,
            body: '',
            events: {
                onShow: function (event) {
                    let content = that.minValue + '-' + that.maxValue;
                    if (that.unit) {
                        content += ' ' + xUnitLabelLong.get(that.unit);
                    }
                    this.setBody(content);
                },
                onHide: function (event) {
                    this.setBody('');
                }
            }
        });

        var availableInfoTooltip = new Tooltip({
            position: 'bottom',
            target: that.availableInfoIcon,
            body: '',
            events: {
                onShow: function (event) {
                    let content = that.minValue + '-' + that.maxValue;
                    if (that.unit) {
                        content += ' ' + xUnitLabelLong.get(that.unit);
                    }
                    this.setBody(content);
                },
                onHide: function (event) {
                    this.setBody('');
                }
            }
        });
    };

    parameterDialog.prototype.createContent = function () {
        var that = this;
        that.addRangeSelection();
        that.addStateInfoTooltip();
        that.addStateOptions();
    };

    parameterDialog.prototype.showDialog = function () {
        var that = this;
        this.myDialog = new WUXDialog({
            title: nls_SetParameterDialog.Set + ' ' + nls_SetParameterDialog.Parameter + ' ' + this.parameterLabel,
            width: 400,
            //height: 300,

            content: content,
            activeFlag: false,
            modalFlag: true,
            resizableFlag: true,
            customButtonsDefinition: customButtonsDefinition
        });
    };

    parameterDialog.prototype.createButtons = function () {
        var that = this;
        customButtonsDefinition = [
            {
                label: nls_SetParameterDialog.Set, // Should be NLS value
                emphasize: 'primary',
                onClick: function (e) {
                    that.paramCellView.value = {};
                    that.paramCellView.value['state'] = that.status;

                    if (that.status == 'Selected') {
                         that.numericValue =parseInt(that.selectedStateSpinBox.value);
                    }

                    if (that.status == 'Default') {
                        that.numericValue = parseInt(that.defaultStateSpinBox.value);
                    }

                    if (that.status == 'Available' || that.status == 'Not Available') {
                        that.numericValue = that.minValue;
                    }

                    if(UWA.is(that.numericValue, 'number'))
                    {
                        that.numericValue = that.numericValue.toString();
                    }
                    that.paramCellView.value['numericValue'] = that.numericValue;
                    that.paramCellView.fire('change', that.paramCellView.value);
                    that.myDialog.destroy();
                },
                role: WUXCustomButtonRoleEnum.Validate
            },
            {
                label: nls_SetParameterDialog.Cancel, // Should be NLS value
                emphasize: 'secondary',
                onClick: function () {
                    that.myDialog.close();
                },
                role: WUXCustomButtonRoleEnum.Validate
            }
        ];
    };

    return parameterDialog;
});

define(
    'DS/ConfiguratorPanel/scripts/Models/DictionaryDataUtil',
    [
    ],
    function(){
    'use strict';
		var dictionaryDataUtil =  function(options){
      this._init(options);
    };

    dictionaryDataUtil.prototype._init = function (options) {
      this._dictionary = options.dictionary;
      this._criteriMap = {};
      this._criteriDetails = {};
      this._nameIdMap = {};

      var criteria = this._dictionary.features;

      var getDetails = function (criteria) {
        var data = {
          id : criteria.ruleId,
          ruleId : criteria.ruleId,
          name : criteria.name,
          title : criteria.displayName,
          description: criteria.description,
          image : criteria.image,
          type : criteria.type,
          mandatory : criteria.selectionCriteria,
          sequenceNumber: criteria.sequenceNumber
        };
        if(criteria.options) {
          data.options = criteria.options;
        }
        if(criteria.type == 'Parameter') {
          data.unit = criteria.unit;
        }
        return data;
      };
      for (var i = 0; i < criteria.length; i++) {
        var details = getDetails(criteria[i]);
        this._nameIdMap[criteria[i].name] = criteria[i].ruleId;
        this._criteriMap[criteria[i].ruleId] = [];
        this._criteriDetails[criteria[i].ruleId] = details;
        if(criteria[i].options) {
          for (var j = 0; j < criteria[i].options.length; j++) {
            this._nameIdMap[criteria[i].options[j].name] = criteria[i].options[j].ruleId;
            this._criteriMap[criteria[i].ruleId].push(criteria[i].options[j].ruleId);
            this._criteriDetails[criteria[i].options[j].ruleId] = getDetails(criteria[i].options[j]);
            this._criteriDetails[criteria[i].options[j].ruleId].parent = criteria[i].ruleId;
          }
        }
      }
    };

    dictionaryDataUtil.prototype.getDetails = function (id) {
       return this._criteriDetails[id];
    };

    dictionaryDataUtil.prototype.getParent = function (id) {
       return this._criteriDetails[id].parent;
    };

    dictionaryDataUtil.prototype.getValues = function (id) {
      var list = this._criteriMap[id];
      if(UWA.is(list, 'array')) {
         return list;
      }
      return [];
    };

    dictionaryDataUtil.prototype.getAllCriteria = function () {
      return Object.keys(this._criteriMap);
    };

    dictionaryDataUtil.prototype.getCriteriaValues = function (id) {
       var list = this._criteriMap[id];
       if(UWA.is(list, 'array')) {
          return list.map((listId) => this._criteriDetails[listId]);
       }
       return [];
    };

    dictionaryDataUtil.prototype.isVariant = function (id) {
       return this._criteriDetails[id].type == 'Variant';
    };

    dictionaryDataUtil.prototype.isOptionGroup = function (id) {
       return this._criteriDetails[id].type == 'VariabilityGroup';
    };

    dictionaryDataUtil.prototype.isParameter = function (id) {
       return this._criteriDetails[id].type == 'Parameter';
    };

    dictionaryDataUtil.prototype.isMandatory = function (id) {
       return this._criteriDetails[id].mandatory == true;
    };

    dictionaryDataUtil.prototype.getSelection = function (selection) {
      var parts = selection.split(':');
      var variantId = this._nameIdMap[parts[0]];
      var valueId = this._nameIdMap[parts[1]];
      if(variantId && valueId) {
        return { key: variantId, value: valueId };
      }
    };


		return dictionaryDataUtil;
	}

);

/**
 * @module DS/ConfiguratorPanel/scripts/Presenters/ConfigParameterSlider
 * @extends module:"DS/Controls/Slider"
 * @description 
 */

define(
	'DS/ConfiguratorPanel/scripts/Presenters/ConfigParameterSlider',[
        "DS/Controls/Slider",
        'DS/Utilities/Utils',
        'css!DS/ConfiguratorPanel/css/ConfigParameterSlider.css'

    ], function (WUXSlider,Utils,_css_configparamslider) {

    'use strict';
   return WUXSlider.extend({
        _floating_min:0,
        _floating_max:0,
        init: function(options) {                 
            this._floating_min = options.minValue;
            this._floating_max = options.maxValue;
            //this.minValue = options.minValue;
            //this.maxValue = options.maxValue;
            this._parent(options);   
        },

    /**
         * Build the HTML View
         * @private
         * @returns {undefined}
         */
        buildView: function() {
            var me = this;
            this.elements.container.addClassName('wux-controls-slider');
            this.elements.container.setAttribute('tabindex', 0);
            this.elements.sliderContainer = UWA.Element('div', {
            'class': 'wux-controls-slider-container'
            });

            this.elements.sliderContainer.inject(this.elements.container);

            var minmaxcontainer = UWA.Element('div', {
              'class': 'config-min-max-container'
            }).inject(this.elements.sliderContainer);

            
            this.elements.minValue = UWA.Element('span', {
              'class': 'config-min-max-value config-min-value'
            }).inject(minmaxcontainer);

            this.elements.maxValue = UWA.Element('span', {
              'class': 'config-min-max-value config-max-value'
            }).inject(minmaxcontainer);           

            this.elements.sliderBackground = UWA.Element('div', {
            'class': 'wux-controls-slider-bg'
            }).inject(this.elements.sliderContainer);

            this.elements.upperBoundFilled = UWA.Element('div', {
                'class': 'wux-controls-slider-bgFilled config-slider-bgUpperBound'
              }).inject(this.elements.sliderContainer);

            this.elements.lowerBoundFilled = UWA.Element('div', {
                'class': 'wux-controls-slider-bgFilled config-slider-bgLowerBound'
              }).inject(this.elements.sliderContainer);


            this._buildCursorView();

            // beginEdit, cancelEdit, endEdit notification counter: ensure no endEdit notification follows a cancelEdit notification
            this._inEdition = false;
        },
        _getUpperRangePercentage: function () {
            return 100 * (this.maxValue - this._floating_max) / (this.maxValue - this.minValue);
        },
        _getLowerRangePercentage: function() {
            return 100 * (this._floating_min - this.minValue) / (this.maxValue - this.minValue);
        },
        updateFloatingMinMax: function (min, max) {
          this._floating_min = min;
          this._floating_max = max;
        },
        _updateCursor: function() {
            // update number of handler from value array dimension.
            let nbNeededHandler= 0;
            if (typeof this.value === "number" || this.value === undefined || this.value === null) {
              nbNeededHandler = 1;
            } else if (typeof this.value === "object") {
              nbNeededHandler = this.value.length;
            }
        
            if (this._cursors.length > nbNeededHandler) {
              //TODO remove events
              this._cursors = this._cursors.splice(nbNeededHandler, this._cursors.length - nbNeededHandler);
            }
        
            if (this._cursors.length < nbNeededHandler) {
              let currentNbCursors = this._cursors.length;
              for (let index = currentNbCursors; index <= nbNeededHandler - currentNbCursors; index++) {
                this._buildCursorView();
              }
            }

            this.elements.minValue.textContent = this.options.minValue;
            this.elements.maxValue.textContent = this.options.maxValue;

        
            var pUpper = this._getUpperRangePercentage();
            var pUpperStr = pUpper + '%';

            var pLower = this._getLowerRangePercentage();
            var pLowerStr = pLower + '%';
        
            let firstPercentage = this.getPercentage(0);
            let lastPercentage;
            if (typeof this.value === 'object' && this.value !== undefined && this.value !== null) {
              lastPercentage = this.getPercentage(this.value.length - 1);
            }

            // Lower & Upper Bound
         
          
            if (lastPercentage === undefined){ 
            this.elements.upperBoundFilled.setStyles({ top: '', height: '', width: pUpperStr });
            this.elements.lowerBoundFilled.setStyles({ top: '', height: '', width: pLowerStr });
            
        }
          else
            this.elements.upperBoundFilled.setStyles({ top: '', height: '', right: firstPercentage + "%", width: (lastPercentage-firstPercentage)+"%" });
              this.elements.upperBoundFilled.removeAttribute('minimum-value');
              this.elements.upperBoundFilled.removeAttribute('maximum-value');
              this.elements.upperBoundFilled.removeAttribute('null-range');
              this.elements.upperBoundFilled.removeAttribute('range');
          
              if (lastPercentage === 100 || firstPercentage === 100) {
                this.elements.upperBoundFilled.setAttributeNode(document.createAttribute('maximum-value'));
              }
              if (firstPercentage === 0 || lastPercentage === 0) {
                  this.elements.upperBoundFilled.setAttributeNode(document.createAttribute('minimum-value'));
              }
              if ((lastPercentage !== undefined && firstPercentage === lastPercentage) || (lastPercentage === undefined && firstPercentage === 0)) {
                this.elements.upperBoundFilled.setAttributeNode(document.createAttribute('null-range'));
              } else if (lastPercentage !== undefined) {
                this.elements.upperBoundFilled.setAttributeNode(document.createAttribute('range'));
              }
          

        
            // Handlers
            for (var index = 0; index < this._cursors.length; index++) {
              let cursor = this._cursors[index];
              var p = this.getPercentage(index);
              var pStr = p + '%';
              if (this.value === undefined || this.value === null) {
                cursor.addClassName('undefined-class');
              }
              else {
                cursor.removeClassName('undefined-class');
              }
              if (this.displayStyle === 'horizontal') {
                cursor.setStyles({ bottom: '', left: pStr });
              } else {
                cursor.setStyles({ bottom: pStr, left: '' });
              }
            }
          },
          _getValidatedSingleValue: function(value, minValue, maxValue) {
            var rounded = undefined;
            var minValue = this._floating_min;
            var maxValue = this._floating_max;
            if (isNaN(value)) {
              rounded = 0;
            }
            else if (value !== undefined && value !== null) {
              // Utils.round computes a modulus, this is why we substract minValue first
              let tmpValue = value - (typeof minValue === 'number' ? minValue : 0); // minValue and maxValue are not supposed to be NaN...
              rounded = parseFloat(Utils.round(tmpValue, this.stepValue));
              if (typeof minValue === 'number')
                rounded += minValue;
              if (typeof maxValue === 'number' && rounded < maxValue && (maxValue - rounded) < this.stepValue && value >= (rounded + (maxValue - rounded) / 2)) {
                // Ex: value=96, min=0, max=100, step=90. If value is above 95, rounded must equal 100
                // parseFloat(Utils.round(tmpValue, this.stepValue)) returns 90 for any 90 < value <= 100
                rounded = maxValue;
              }
            }
            else {
              rounded = value;
            }
            var newValue = rounded;
            if (rounded !== undefined && rounded !== null) {
              if (Utils.isNumber(minValue) && Utils.isNumber(maxValue)) {
                newValue = Utils.clamp(minValue, maxValue, rounded);
              }
            }
            return newValue;
          }
    });//*,{
     //   return WUXSlider;
});

/*********************************************************************/
/*@fullReview XF3 21/05/2016
/*********************************************************************/

define('DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctions',
[  'DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctionsV2'
],
function (ConfiguratorSolverFunctionsV2) {
	'use strict';
	return ConfiguratorSolverFunctionsV2;
});

define('DS/ConfiguratorPanel/scripts/Presenters/ParameterSelectionView', [
    'DS/Controls/Abstract',
    'DS/Utilities/Dom',
    'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
    'DS/ConfiguratorPanel/scripts/Presenters/SetParameterDialog',
    'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong',
    'css!DS/ConfiguratorPanel/css/ParameterSelectionView.css'
], function (Abstract, Dom, ConfiguratorVariables, SetParameterDialog, xUnitLabelLong) {
    'use strict';

    var ParameterSelectionView = Abstract.inherit({
        name: 'parameter-cell',

        publishedProperties: {
            status: {
                defaultValue: '',
                type: 'string'
            },
            isConflict: {
                defaultValue: '',
                type: 'boolean'
            },
            minValue: {
                defaultValue: '',
                type: 'string'
            },
            maxValue: {
                defaultValue: '',
                type: 'string'
            },
            unit: {
                defaultValue: '',
                type: 'string'
            },
            numericValue: {
                defaultValue: '',
                type: 'string'
            },
            isNonEditableCell: {
                defaultValue: false,
                type: 'boolean'
            },
            isDifferent: {
                defaultValue: false,
                type: 'boolean'
            },
            hasComment: {
                defaultValue: false,
                type: 'boolean'
            },
            isPainterModeEnabled: {
                defaultValue: false,
                type: 'boolean'
            },
            executionContext: {
                defaultValue: {},
                type: 'object'
            }
        },

        buildView: function () {
            this.container = UWA.createElement('div');

            this.iconSpan = UWA.createElement('span');
            this.valueSpan = UWA.createElement('span', {
                styles: {
                    'margin-left': '2px'
                }
            });
            this.rangeSpan = UWA.createElement('span', {
                styles: {
                    'margin-left': '0px'
                }
            });
            this.unitSpan = UWA.createElement('span', {
                styles: {
                    'margin-left': '0px'
                }
            });

            this.container.appendChild(this.iconSpan);
            this.container.appendChild(this.valueSpan);
            this.container.appendChild(this.rangeSpan);
            this.container.appendChild(this.unitSpan);

            this.container.addClassName('parameter-cell-container');
            this.container.addClassName('editableCell');
            this.getContent().addClassName('datagridview-parameter-cell-container');
            this.getContent().setContent(this.container);
        },

        _postBuildView: function () {},

        handleEvents: function () {
            var that = this;

            Dom.addEventOnElement(this, this.container, 'click', function (e) {
                e.stopPropagation();
                if (!that.isNonEditableCell) {
                    if (!that.isPainterModeEnabled) {
                        let SetNumericalParameterDialog = new SetParameterDialog();
                        SetNumericalParameterDialog.init({ parameterView: that });
                        SetNumericalParameterDialog.showDialog();
                    } else {
                        that.executionContext.nodeModel.getModelEvents().publish({
                            event: 'painter-cell-click',
                            data: {
                                target: that.container,
                                context: that.executionContext
                            }
                        });
                    }
                }
            });

            this.container.addEventListener('mouseover', function () {
                that.executionContext.nodeModel.getModelEvents().publish({
                    event: 'update-tooltip',
                    data: {
                        target: that.container,
                        context: that.executionContext
                    }
                });
            });
        },

        _applyProperties: function (oldValues) {
            this._parent(oldValues);

            this._applyIsNonEditableCell();
            this._applyIsPainterModeEnabled();
            this._applyStatus(oldValues.status, this.status);
            this._applyNumericValue(oldValues.numericValue, this.numericValue);

            this._applyIsConflict(this.isConflict);

            this._applyMinValue(oldValues.minValue, this.minValue);

            this._applyMaxValue(oldValues.maxValue, this.maxValue);

            this._applyUnit(oldValues.unit, this.unit);

            this._applyIsDifferent(this.isDifferent);

            this._applyHasComment(this.hasComment);
        },

        _applyHasComment: function (hasComment) {
            if (hasComment) {
                this.container.getParent().addClassName('comment-icon');
            } else if (this.container.getParent().hasClassName('comment-icon')) {
                this.container.getParent().removeClassName('comment-icon');
            }
        },

        _applyIsDifferent: function (isDifferent) {
            if (isDifferent) {
                this.container.getParent().addClassName('highlight-background');
            } else if (this.container.getParent().hasClassName('highlight-background')) {
                this.container.getParent().removeClassName('highlight-background');
            }
        },

        _applyIsPainterModeEnabled: function (oldValue, value) {},
        _applyIsNonEditableCell: function () {
            if (!this.isNonEditableCell) {
                if (this.container.hasClassName('nonEditableCell')) {
                    this.container.removeClassName('nonEditableCell');
                }
                this.container.addClassName('editableCell');
            }
            if (this.isNonEditableCell) {
                if (this.container.hasClassName('editableCell')) {
                    this.container.removeClassName('editableCell');
                }
                this.container.addClassName('nonEditableCell');
            }
        },

        _applyStatus: function (oldValue, value) {
            if (value) {
                this.addStatusInCell(value);
            }
        },
        _applyNumericValue: function (oldValue, value) {
            this.addValueInCell(value);
        },
       
        _applyIsConflict: function () {
            if (this.isConflict) this.container.addClassName('conflict');
            else this.container.removeClassName('conflict');
        },
        _applyMinValue: function (oldMin, minValue) {
            if (this.status == 'Not Available' || this.status == 'Selected' ||  this.status == 'Required' ||  this.status == 'Incompatible') {
                this.rangeSpan.textContent = '';
            } else {
                this.rangeSpan.textContent = ' ' + '[' + minValue + ' - ';
            }
        },

        _applyMaxValue: function (oldMax, maxValue) {
            if (this.status == 'Not Available' || this.status == 'Selected' || this.status == 'Required' ||  this.status == 'Incompatible')  {
                this.rangeSpan.textContent = '';
            } else {
                this.rangeSpan.textContent = this.rangeSpan.textContent + maxValue + ']';
            }
        },

        _applyUnit: function (oldUnit, newUnit) {
            this.addUnitInCell(newUnit);
        },

        addStatusInCell: function (status) {
            if (status == 'Selected') this.iconSpan.classList = ['wux-ui-3ds-check wux-ui-3ds'];

            if (status == 'Default') this.iconSpan.classList = ['wux-ui-3ds-favorite-on wux-ui-3ds'];

            if (status == 'Not Available') this.iconSpan.classList = ['wux-ui-3ds-block  wux-ui-3ds'];

            if (status == 'Incompatible') this.iconSpan.classList = ['wux-ui-3ds-rule-status-incompatible  wux-ui-3ds'];
           
            if (status == 'Required') this.iconSpan.classList = ['wux-ui-3ds-rule-status-required  wux-ui-3ds'];

            if (status == 'Available') this.iconSpan.classList = [];
        },

        addValueInCell: function (value) {
            if (this.status == 'Default' || this.status == 'Selected' ||  this.status == 'Required') {
                this.valueSpan.textContent = value;
            } else {
                this.valueSpan.textContent = '';
            }
        },
        addUnitInCell: function (unit) {
            if (this.status == 'Not Available') {
                this.unitSpan.textContent = '';
            } else {
                this.unitSpan.textContent = ' ' + xUnitLabelLong.get(unit);
            }
        }
    });

    return ParameterSelectionView;
});


define(
	'DS/ConfiguratorPanel/scripts/Presenters/ToolbarPresenter',
	[
		'UWA/Core',
		'UWA/Controls/Abstract',
		'DS/W3DXComponents/Views/Item/ActionView',
		'DS/W3DXComponents/Views/Layout/ActionsView',
     	'DS/W3DXComponents/Collections/ActionsCollection',
		'DS/UIKIT/Input/Button',
		'DS/UIKIT/Input/Text',
		'DS/UIKIT/DropdownMenu',
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
		'DS/ConfiguratorPanel/scripts/Utilities',

		'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',

		'css!DS/UIKIT/UIKIT.css',
		"css!DS/ConfiguratorPanel/scripts/Presenters/ToolbarPresenter.css"
	],
	function (UWA, Abstract, ActionView, ActionsView, ActionsCollection, Button, InputText, DropdownMenu, ConfiguratorVariables, /*ConfiguratorSolverFunctions,*/ Utilities, nlsConfiguratorKeys) {

		'use strict';

		var ToolbarPresenter = Abstract.extend({
				 /**
				 * @description
				 * <blockquote>
				 * <p>Initialiaze the ToolbarPresenter component with the required options</p>
				 * <p>This component shows all tools on top of the Configurator panel. It will show :
				 * <ul>
				 * <li>Count of the mandatory Variant classes not valuated.</li>
				 * <li>Count of the conflicting Variant classes</li>
				 * <li>The current Status of the configuration (if it is "Partial", "Complete" or "Hybrid")</li>
				 * <li>The selection mode ("Build" or "Refine"). By clicking on the icon you will be able to switch the mode</li>
				 * <li>The multi-selection state. By clicking on the icon you will be able to switch the state</li>
				 * <li>The rule assistance level. By clicking the icon you will be able to select one of them</li>
				 * <li>A magnifier icon that will allow you to filter the list of Variant classes. By clicking on the icon some tools will appear :</li>
				 *   <ul>
				 *   <li>A dropdown to filter by states</li>
				 *   <li>A search to filter with a string. The search can be applied on different attributes</li>
				 *   </ul>
				 * </ul>
				 * </p>
				 * </blockquote>
				 *
				 * @memberof module:DS/ConfiguratorPanel/ConfiguratorPanel#
				 *
				 * @param {Object} options - Available options.
				 * @param {Object} options.parentContainer - The parent container where the ToolbarPresenter will be injected
				 * @param {Object} options.modelEvents - The modelEvents object
				 * @param {Object} options.configModel - The configModel object
                 * @param {Object} options.attributesList - The List of attributes that will be displayed in the attributes filter
                 * @param {Object} options.defaultAttributeSelected - Default attribute selected in the list of attributes
                 * @param {Object} options.add3DButton - {OPTIONNAL} option to create a "3D" button in the toolbar. Added for Enovia Demo. Should be used in Model Editor integration
				 *
				 */

				 currentAttributeForSearch: '',
				 currentValueForSearch: '',

				 init: function (options) {

				     var that = this;
				     that.currentAttributeForSearch = options.defaultAttributeSelected;

				     that._attributesList = (options.attributesList) ? options.attributesList : [];
					 that._dropdownObjectForRules = {};
					 that.actionsList = null;


					 var CustomActionsView = ActionsView.extend({
						itemView : ActionView.extend({
							onRender : function() {
								this._parent();
								if(this.model.get('style')) {
									var style = this.model.get('style');
									if(UWA.is(this.model.get('style'), 'function')) {
										style = style();
									}
									this.container.setStyles(style);

								}
								if(this.model.get('id')) {
									this.container.id = this.model.get('id');
								}

								if(this.model.get('dropdown')) {

									var optionsDropdown = this.model.get('dropdown');
									var params = {};

									params.target = this.container;
									if(optionsDropdown.multiSelect)
										params.multiSelect = optionsDropdown.multiSelect;
									if(optionsDropdown.closeOnClick)
										params.closeOnClick = optionsDropdown.closeOnClick;
									if(optionsDropdown.items)
										params.items = optionsDropdown.items;
									if(optionsDropdown.events)
										params.events = optionsDropdown.events;

                                    params.renderTo = options.parentContainer;

									var dropdownObj = new DropdownMenu(params);

									if(this.model.get('dropdownObject'))
										that[this.model.get('dropdownObject')] = dropdownObj;
								}
								if(this.model.get('associatedText')) {
									this.container.addContent(this.model.get('associatedText'));
								}

								if(this.model.get('tooltip')) {
								    this.container.title = this.model.get('tooltip');
								}
							}
						})
					});

					 //Create the Main div of the Configurator
					var ToolbarDiv = document.createElement('div');
					ToolbarDiv.id = "ConfiguratorToolbar";

					var extendedToolbarDiv = UWA.extendElement(ToolbarDiv);


					//Create the div for the Mandatory and the Conflicts icons on the left of configurator toolbar
					var leftToolbarDiv = document.createElement('div');
					leftToolbarDiv.id = "leftToolbarDiv";

					var extendedLeftToolbarDiv = UWA.extendElement(leftToolbarDiv);

					extendedLeftToolbarDiv.inject(extendedToolbarDiv);

					//Actions for Mand and Conflicts icons

					var mandVarClassesNumberSpan = document.createElement('span');
					mandVarClassesNumberSpan.innerHTML = "(" + options.configModel.getNumberOfMandFeaturesNotValuated() + ")";
					mandVarClassesNumberSpan.id = "mandVarClassesNumberSpan";
					var extendedMandVarClassesNumberSpan = UWA.extendElement(mandVarClassesNumberSpan);

					options.modelEvents.subscribe({event:'OnMandFeatureNumberChange'}, function(data) {
						 mandVarClassesNumberSpan.innerHTML = "(" + data.value + ")";
					});

					var conflictingVarClassesNumberSpan = document.createElement('span');
					conflictingVarClassesNumberSpan.innerHTML = "(" + options.configModel.getNumberOfConflictingFeatures() + ")";
					conflictingVarClassesNumberSpan.id = "conflictingVarClassesNumberSpan";
					var extendedConflictingVarClassesNumberSpan = UWA.extendElement(conflictingVarClassesNumberSpan);

					options.modelEvents.subscribe({event:'OnConflictFeatureNumberChange'}, function(data) {

						document.getElementById("ConflictingFeaturesContainer").style.opacity = (options.configModel.getNumberOfConflictingFeatures() == 0)? 0:1;
						document.getElementById("ConflictingFeaturesContainer").style.cursor = (options.configModel.getNumberOfConflictingFeatures() == 0)? 'initial':'pointer';

						conflictingVarClassesNumberSpan.innerHTML = "(" + data.value + ")";
					});

					var actionsList = [{
							text : "Mandatory icon",
							icon: 'attention',
							actionId: 'MandatoryIcon',
							tooltip: nlsConfiguratorKeys[ConfiguratorVariables.UnselectedMandatory],
							handler: function(e) {
								if( !extendedToolbarDiv.style.height) {
									extendedToolbarDiv.style.height = extendedToolbarDiv.offsetHeight + "px";
								}

								if(!searchIconActivated){
									searchIconActivated = true;
									extendedFilteringToolsDiv.style.display = "block";

									extendedToolbarDiv.style.height = extendedRightToolbarDiv.offsetHeight + extendedFilteringToolsDiv.offsetHeight + "px";

									options.modelEvents.publish({
									    event: 'OnToolbarHeightChange',
									    data: { value: getToolbarHeight() }
									});

									document.getElementById('searchIcon').style.color = 'rgb(54, 142, 196)';
								}

								var selectedStatusList = FilterStatusDDMenu.getSelectedItems();

								for(var i=0; i<selectedStatusList.length; i++) {
									FilterStatusDDMenu.toggleSelection(selectedStatusList[i]);
									FilterStatusDDMenu.enableItem(selectedStatusList[i].name);
								}

								FilterStatusDDMenu.toggleSelection(FilterStatusDDMenu.getItem(ConfiguratorVariables.UnselectedMandatory));
								FilterStatusDDMenu.disableItem(FilterStatusDDMenu.getItem(ConfiguratorVariables.UnselectedMandatory).name);

								iconFilterStatusSpan.set('class', "fonticon fonticon-attention");

								options.modelEvents.publish( {
									event:	'OnFilterStatusChange',
									data:	{value : ConfiguratorVariables.UnselectedMandatory}
								});
							},
							style : function() {
							    var iconColor = '#5b5d5e';
    							var iconContWidth = '50%';

    							return { color: iconColor, width: iconContWidth};
    						},
							associatedText: extendedMandVarClassesNumberSpan
					},
					{
							text : "Conflicts icon",
							icon: 'alert',
							id: 'ConflictingFeaturesContainer',
							actionId: 'ConflictsIcon',
							tooltip: nlsConfiguratorKeys[ConfiguratorVariables.SelectionInConflict],
							handler: function(e) {
								if(options.configModel.getNumberOfConflictingFeatures() > 0) {
									if( !extendedToolbarDiv.style.height) {
										extendedToolbarDiv.style.height = extendedToolbarDiv.offsetHeight + "px";
									}

									if(!searchIconActivated){
										searchIconActivated = true;
										extendedFilteringToolsDiv.style.display = "block";

										extendedToolbarDiv.style.height = extendedRightToolbarDiv.offsetHeight + extendedFilteringToolsDiv.offsetHeight + "px";

										options.modelEvents.publish({
										    event: 'OnToolbarHeightChange',
										    data: { value: getToolbarHeight() }
										});

										document.getElementById('searchIcon').style.color = 'rgb(54, 142, 196)';
									}

									var selectedStatusList = FilterStatusDDMenu.getSelectedItems();

									for(var i=0; i<selectedStatusList.length; i++) {
										FilterStatusDDMenu.toggleSelection(selectedStatusList[i]);
										FilterStatusDDMenu.enableItem(selectedStatusList[i].name);
									}

									FilterStatusDDMenu.toggleSelection(FilterStatusDDMenu.getItem(ConfiguratorVariables.SelectionInConflict));
									FilterStatusDDMenu.disableItem(FilterStatusDDMenu.getItem(ConfiguratorVariables.SelectionInConflict).name);

									iconFilterStatusSpan.set('class', "fonticon fonticon-alert");

									options.modelEvents.publish( {
										event:	'OnFilterStatusChange',
										data:	{value : ConfiguratorVariables.SelectionInConflict}
									});
								}
							},
							style : function() {
    							var iconColor = 'red';
    							var iconContWidth = '50%';

    							return { color: iconColor, width: iconContWidth, opacity:0, cursor: 'initial'};
    						},
							associatedText: extendedConflictingVarClassesNumberSpan
					}];



					var actionView = new CustomActionsView(getActionObj(actionsList));
					actionView = actionView.render();
					actionView.container.setStyles({ verticalAlign: 'middle', justifyContent: 'flex-start'});

					actionView.inject(extendedLeftToolbarDiv);

					//Create the div for configuration mode, Multi-sel, rules assistance level and search icons
					var rightToolbarDiv = document.createElement('div');
					rightToolbarDiv.id = "rightToolbarDiv";

					var extendedRightToolbarDiv = UWA.extendElement(rightToolbarDiv);

					extendedRightToolbarDiv.inject(extendedToolbarDiv);

					//create a span for completeness status text
					var completenessStatusSpan = document.createElement('span');
					completenessStatusSpan.id = "completenessStatus";
					completenessStatusSpan.innerHTML = nlsConfiguratorKeys[options.configModel.getCompletenessStatus()];

					var extendedCompStatusSpan = UWA.extendElement(completenessStatusSpan);

					extendedCompStatusSpan.inject(extendedRightToolbarDiv);

					var searchIconActivated = false;

					function getIcon(options)
					{
						var IconDiv = UWA.createElement('span',{
							'class': 'fonticon fonticon-2x fonticon-' + options.icon ,
						});
						if(options.id && options.id !='') IconDiv.id = options.id;
						IconDiv.changeIcon = function(icon )
						{
							this.set('class', 'fonticon fonticon-2x fonticon-' + icon);
						};
						return IconDiv;
					}

					var itemsForSelectionMode;
					var iconForSelectionMode;
					var tooltipForSelectionMode;

					if(options.configModel.getSelectionMode() == ConfiguratorVariables.selectionMode_Build) {
						itemsForSelectionMode = [
							{ name: ConfiguratorVariables.selectionMode_Build, text: nlsConfiguratorKeys[ConfiguratorVariables.BuildConfiguration], fonticon: 'up-dir', selected: true, disabled: true },
							{ name: ConfiguratorVariables.selectionMode_Refine, text: nlsConfiguratorKeys[ConfiguratorVariables.RefineConfiguration], fonticon: 'down-dir', selectable: true, disabled: options.configModel.getReadOnlyFlag() }
						];
						iconForSelectionMode = 'up-dir';
						tooltipForSelectionMode = nlsConfiguratorKeys[ConfiguratorVariables.BuildConfiguration];
					}
					else {
						itemsForSelectionMode = [
							{ name: ConfiguratorVariables.selectionMode_Build, text: nlsConfiguratorKeys[ConfiguratorVariables.BuildConfiguration], fonticon: 'up-dir', selectable: true, disabled: options.configModel.getReadOnlyFlag() },
							{ name: ConfiguratorVariables.selectionMode_Refine, text: nlsConfiguratorKeys[ConfiguratorVariables.RefineConfiguration], fonticon: 'down-dir', selected: true, disabled: true }
						];
						iconForSelectionMode = 'down-dir';
						tooltipForSelectionMode = nlsConfiguratorKeys[ConfiguratorVariables.RefineConfiguration];
					}

					var iconCompletenessStatus;
					if(options.configModel.getCompletenessStatus() == ConfiguratorVariables.Hybrid)
						iconCompletenessStatus = 'high';
					else if(options.configModel.getCompletenessStatus() == ConfiguratorVariables.Complete)
						iconCompletenessStatus = 'medium';
					else
						iconCompletenessStatus = 'low';

					var txtIcon = getIcon({	id: 'optIcon' ,	icon: iconCompletenessStatus});
					txtIcon.inject(extendedRightToolbarDiv);


					var iconForRulesAssistanceLevel = 'block';
					var tooltipForRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.NoRuleApplied];
					var itemsForRulesAssistanceLevel = [];
					var selectedState = false;
					var rulesMode = options.configModel.getRulesMode();
					var rulesActivation = options.configModel.getRulesActivation();

					options.modelEvents.subscribe({event:'checkModelConsistency_SolverAnswer'}, function(data) {

						 if(that._dropdownObjectForRules != null) {
							 var ddown = that._dropdownObjectForRules;

							 if(options.configModel.getRulesActivation() == 'false') {
								if(ddown.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration)) ddown.enableItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration);
								if(ddown.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration)) ddown.enableItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration);
								if(ddown.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions)) ddown.enableItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions);
								if(ddown.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions)) ddown.enableItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions);
								ddown.enableItem(ConfiguratorVariables.NoRuleApplied);

								if(ddown.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && ddown.isSelected(ddown.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
									ddown.toggleSelection(ddown.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
								if(ddown.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && ddown.isSelected(ddown.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
									ddown.toggleSelection(ddown.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
								if(ddown.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && ddown.isSelected(ddown.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
									ddown.toggleSelection(ddown.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
								if(ddown.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && ddown.isSelected(ddown.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
									ddown.toggleSelection(ddown.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));

								if(ddown.getItem(ConfiguratorVariables.NoRuleApplied) && !ddown.isSelected(ddown.getItem(ConfiguratorVariables.NoRuleApplied).name))
									ddown.toggleSelection(ddown.getItem(ConfiguratorVariables.NoRuleApplied));

								ddown.disableItem(ConfiguratorVariables.NoRuleApplied);

								document.getElementById('ruleAssistanceLevelIcon').getElementsByTagName('span')[0].className='fonticon fonticon-block fonticon-2x';
							}


						 }
							console.log(that._dropdownObjectForRules.getSelectedItems());

					});

					if(options.configModel.getMultiSelectionState() == "true" && rulesActivation == 'true') {
						Utilities.displayNotification({
							eventID: 'info',
							msg: nlsConfiguratorKeys.InfoMultiSelAndRules
						});
					}

						if(options.configModel.getAppFunc().rulesMode_ProposeOptimizedConfiguration == "yes") {
							selectedState=false;
							if(rulesMode == ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration && rulesActivation == 'true') {
								selectedState=true;
								iconForRulesAssistanceLevel = 'chart-area';
								tooltipForRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.ProposeOptimizedConfiguration];
							}
							itemsForRulesAssistanceLevel.push({ name: ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration, text: nlsConfiguratorKeys[ConfiguratorVariables.ProposeOptimizedConfiguration], fonticon: 'chart-area', selectable: true, selected: selectedState, disabled: (options.configModel.getReadOnlyFlag() == true || rulesMode == ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) });
						}
						if(options.configModel.getAppFunc().rulesMode_SelectCompleteConfiguration == "yes") 	{
							selectedState=false;
							if(rulesMode == ConfiguratorVariables.RulesMode_SelectCompleteConfiguration && rulesActivation == 'true') {
								selectedState=true;
								iconForRulesAssistanceLevel = 'cube';
								tooltipForRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.SelectCompleteConfiguration];
							}
							itemsForRulesAssistanceLevel.push({ name: ConfiguratorVariables.RulesMode_SelectCompleteConfiguration, text: nlsConfiguratorKeys[ConfiguratorVariables.SelectCompleteConfiguration], fonticon: 'cube', selectable: true, selected: selectedState, disabled: (options.configModel.getReadOnlyFlag() == true || rulesMode == ConfiguratorVariables.RulesMode_SelectCompleteConfiguration)});
						}
						if(options.configModel.getAppFunc().rulesMode_EnforceRequiredOptions == "yes") {
							selectedState=false;
							if(rulesMode == ConfiguratorVariables.RulesMode_EnforceRequiredOptions && rulesActivation == 'true') {
								selectedState=true;
								iconForRulesAssistanceLevel = '3ds-how';
								tooltipForRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.EnforceRequiredOptionsAndSelectDefault];
							}
							itemsForRulesAssistanceLevel.push({ name: ConfiguratorVariables.RulesMode_EnforceRequiredOptions, text: nlsConfiguratorKeys[ConfiguratorVariables.EnforceRequiredOptionsAndSelectDefault], fonticon: '3ds-how', selectable: true, selected: selectedState, disabled: (options.configModel.getReadOnlyFlag() == true || rulesMode == ConfiguratorVariables.RulesMode_EnforceRequiredOptions)});
						}
						if(options.configModel.getAppFunc().rulesMode_DisableIncompatibleOptions == "yes") {
							selectedState=false;
							if(rulesMode == ConfiguratorVariables.RulesMode_DisableIncompatibleOptions && rulesActivation == 'true') {
								selectedState=true;
								iconForRulesAssistanceLevel = 'list-times';
								tooltipForRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.DisableIncompatibleOptions];
							}
							itemsForRulesAssistanceLevel.push({ name: ConfiguratorVariables.RulesMode_DisableIncompatibleOptions, text: nlsConfiguratorKeys[ConfiguratorVariables.DisableIncompatibleOptions], fonticon: 'list-times', selectable: true, selected: selectedState, disabled: (options.configModel.getReadOnlyFlag() == true || rulesMode == ConfiguratorVariables.RulesMode_DisableIncompatibleOptions)});
						}
						itemsForRulesAssistanceLevel.push({ className: "divider" });
						itemsForRulesAssistanceLevel.push({ name: ConfiguratorVariables.NoRuleApplied, text: nlsConfiguratorKeys[ConfiguratorVariables.NoRuleApplied], fonticon: 'block', selectable: true, selected: (rulesActivation == "false"), disabled: (options.configModel.getReadOnlyFlag() == true || rulesActivation == "false")});

					//Actions list creation
					that.actionsList = [
						//iconCompletenessStatus kept seperately , to solve update issue
							{
							text : "Configuration mode icon",
							icon: iconForSelectionMode,
							id: 'configurationModeIcon',
							actionId: 'ConfigurationModeIcon',
							tooltip: nlsConfiguratorKeys["Selection mode"] + ' : ' + tooltipForSelectionMode,
							handler: function(e) {
							},
							style : function() {
    							var iconColor = '#5b5d5e';

    							return { color: iconColor};
    						},
							dropdown : {
								multiSelect: false,
								closeOnClick: true,
								items: itemsForSelectionMode,
								events: {
									onClick: function (e, item) {
										if(item.elements.icon)
											document.getElementById('configurationModeIcon').getElementsByTagName('span')[0].className =  item.elements.icon.className + ' fonticon-2x';

										if (item.elements.icon) {
										    var nlsConfigurationMode;

										    if (item.name == ConfiguratorVariables.selectionMode_Build)
										        nlsConfigurationMode = nlsConfiguratorKeys[ConfiguratorVariables.BuildConfiguration];
										    else if (item.name == ConfiguratorVariables.selectionMode_Refine)
										        nlsConfigurationMode = nlsConfiguratorKeys[ConfiguratorVariables.RefineConfiguration];

										    document.getElementById('configurationModeIcon').getElementsByTagName('span')[0].title = nlsConfiguratorKeys["Selection mode"] + ' : ' + nlsConfigurationMode;
										}

										this.enableItem(ConfiguratorVariables.selectionMode_Build);
										this.enableItem(ConfiguratorVariables.selectionMode_Refine);

										this.disableItem(item.name);

										options.configModel.setSelectionMode(item.name);

										options.modelEvents.publish( {
											event:	'OnConfigurationModeChange',
											data:	{value : item.name}
										});
									}
								}
							}
					},
					{
							text : "Multi Selection icon",
							icon: 'popup',
							actionId: 'MultiSelIcon',
							tooltip: (options.configModel.getMultiSelectionState() == "true") ? (nlsConfiguratorKeys["Multi-Selection"] + " : " + nlsConfiguratorKeys["Enabled"]) : (nlsConfiguratorKeys["Multi-Selection"] + " : " + nlsConfiguratorKeys["Disabled"]),
							handler: function (e) {
							    if (options.configModel.getReadOnlyFlag() == false) {
							        var multiSelActivated = (options.configModel.getMultiSelectionState() == "true");

							        if (multiSelActivated) {
							            options.configModel.setMultiSelectionState("false");
							            e.currentTarget.style.color = '';
							            e.currentTarget.title = (nlsConfiguratorKeys["Multi-Selection"] + " : " + nlsConfiguratorKeys["Disabled"]);
							            multiSelActivated = false;
							        }
							        else {
							            options.configModel.setMultiSelectionState("true");
							            e.currentTarget.style.color = 'rgb(54, 142, 196)';
							            e.currentTarget.title = (nlsConfiguratorKeys["Multi-Selection"] + " : " + nlsConfiguratorKeys["Enabled"]);
							            multiSelActivated = true;

							            if (options.configModel.getRulesActivation() == 'true') {
							                Utilities.displayNotification({
							                    eventID: 'info',
							                    msg: nlsConfiguratorKeys.InfoMultiSelAndRules
							                });
							            }
							        }



							        options.modelEvents.publish({
							            event: 'OnMultiSelectionChange',
							            data: { value: multiSelActivated }
							        });
								  }
							},
							style : function() {
								var multiSelActivated = (options.configModel.getMultiSelectionState() == "true");

								var iconColor = multiSelActivated ? 'rgb(54, 142, 196)' : '';

    							return { color: iconColor};
    						}
					},
					{
							text : "Rules assistance level icon",
							icon: iconForRulesAssistanceLevel,
							id: 'ruleAssistanceLevelIcon',
							tooltip: nlsConfiguratorKeys["Rules assistance level"] + ' : ' + tooltipForRulesAssistanceLevel,
							actionId: 'RulesAssistanceLevelIcon',
							handler: function(e) {
							},
							style : function() {
    							var iconColor = '#5b5d5e';

    							return { color: iconColor};
    						},
							dropdown : {
								multiSelect: false,
								closeOnClick: true,
								items: itemsForRulesAssistanceLevel,
								events: {
									onClick: function (e, item) {
										var newRulesActivation;
										var newRulesMode;

										if(item.elements.icon)
										    document.getElementById('ruleAssistanceLevelIcon').getElementsByTagName('span')[0].className = item.elements.icon.className + ' fonticon-2x';

										if (item.elements.icon){
										    var nlsRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.NoRuleApplied];

										    if (item.name == ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration)
										        nlsRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.ProposeOptimizedConfiguration];
										    else if (item.name == ConfiguratorVariables.RulesMode_SelectCompleteConfiguration)
										        nlsRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.SelectCompleteConfiguration];
										    else if (item.name == ConfiguratorVariables.RulesMode_EnforceRequiredOptions)
										        nlsRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.EnforceRequiredOptionsAndSelectDefault];
										    else if (item.name == ConfiguratorVariables.RulesMode_DisableIncompatibleOptions)
                                                nlsRulesAssistanceLevel = nlsConfiguratorKeys[ConfiguratorVariables.DisableIncompatibleOptions];

										    document.getElementById('ruleAssistanceLevelIcon').getElementsByTagName('span')[0].title = nlsConfiguratorKeys["Rules assistance level"] + ' : ' + nlsRulesAssistanceLevel;
										}

										if(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration)) this.enableItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration);
										if(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration)) this.enableItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration);
										if(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions)) this.enableItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions);
										if(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions)) this.enableItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions);
										this.enableItem(ConfiguratorVariables.NoRuleApplied);

										if(item.name == ConfiguratorVariables.NoRuleApplied) {
											if(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
											if(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
											if(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
											if(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));

											this.disableItem(ConfiguratorVariables.NoRuleApplied);

											newRulesActivation = "false";

										    //remove Conflicts Icon if any
											if (document.getElementById("ConflictingFeaturesContainer")) {
											    document.getElementById("ConflictingFeaturesContainer").style.opacity = 0;
											    document.getElementById("ConflictingFeaturesContainer").style.cursor = 'initial';
										    }
										}
										else if(item.name == ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) {
											if( this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
											if( this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
											if( this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
											if( this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));
											if(this.isSelected(this.getItem(ConfiguratorVariables.NoRuleApplied).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.NoRuleApplied));

											this.disableItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration);

											newRulesActivation = "true";
											newRulesMode = ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration;

										}
										else if(item.name == ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) {
											if(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
											if( this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
											if( this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
											if( this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));
											if(this.isSelected(this.getItem(ConfiguratorVariables.NoRuleApplied).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.NoRuleApplied));

											this.disableItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration);

											newRulesActivation = "true";
											newRulesMode = ConfiguratorVariables.RulesMode_SelectCompleteConfiguration;
										}
										else if(item.name == ConfiguratorVariables.RulesMode_EnforceRequiredOptions) {
											if(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
											if(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
											if( this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
											if( this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));
											if(this.isSelected(this.getItem(ConfiguratorVariables.NoRuleApplied).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.NoRuleApplied));

											this.disableItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions);

											newRulesActivation = "true";
											newRulesMode = ConfiguratorVariables.RulesMode_EnforceRequiredOptions;
										}
										else if(item.name == ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) {
											if(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_ProposeOptimizedConfiguration));
											if(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
											if(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions) && this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_EnforceRequiredOptions));
											if( this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions) && !this.isSelected(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions));
											if(this.isSelected(this.getItem(ConfiguratorVariables.NoRuleApplied).name))
												this.toggleSelection(this.getItem(ConfiguratorVariables.NoRuleApplied));

											this.disableItem(ConfiguratorVariables.RulesMode_DisableIncompatibleOptions);

											newRulesActivation = "true";
											newRulesMode = ConfiguratorVariables.RulesMode_DisableIncompatibleOptions;
										}

										options.configModel.setRulesActivation(newRulesActivation);

										if(newRulesActivation == "true") {
											options.configModel.setRulesMode(newRulesMode);

											if(options.configModel.getMultiSelectionState() == "true") {
												Utilities.displayNotification({
													eventID: 'info',
													msg: nlsConfiguratorKeys.InfoMultiSelAndRules
												});
											}
										}

										options.modelEvents.publish( {
											event:	'OnRuleAssistanceLevelChange',
											data:	{value : item.name}
										});

										//if(newRulesActivation == "true")
											//ConfiguratorSolverFunctions.setSelectionModeOnSolver(newRulesMode);

									}
								}
							},
							dropdownObject: "_dropdownObjectForRules"
					},{
							text : "Search icon",
							icon: 'search',
							id: 'searchIcon',
							actionId: 'SearchIcon',
							handler: function(e) {
								if( !extendedToolbarDiv.style.height) {
									extendedToolbarDiv.style.height = extendedToolbarDiv.offsetHeight + "px";
								}

								if(searchIconActivated){
									searchIconActivated = false;
									extendedFilteringToolsDiv.style.display = "none";

									if (document.getElementById("searchInput")) {
									    document.getElementById("searchInput").value = "";

									    options.modelEvents.publish({
									        event: 'OnSearchValueChange',
									        data: {
									            value: document.getElementById("searchInput").value,
									            attribute: that.currentAttributeForSearch
									        }
									    });
									}

									extendedToolbarDiv.style.height = extendedRightToolbarDiv.offsetHeight + extendedFilteringToolsDiv.offsetHeight + "px";
									e.currentTarget.style.color = '';
								}
								else{
									searchIconActivated = true;
									extendedFilteringToolsDiv.style.display = "block";

									extendedToolbarDiv.style.height = extendedRightToolbarDiv.offsetHeight + extendedFilteringToolsDiv.offsetHeight + "px";
									e.currentTarget.style.color = 'rgb(54, 142, 196)';
								}


								options.modelEvents.publish({
								    event: 'OnToolbarHeightChange',
								    data: { value: getToolbarHeight() }
								});
							}
					}];

					options.modelEvents.subscribe({event:'OnCompletenessStatusChange'}, function(data) {
						 var oldValue = completenessStatusSpan.textContent;
						 completenessStatusSpan.innerHTML = nlsConfiguratorKeys[data.value];

						 var iconName;
						 switch(data.value)
						 {
							case ConfiguratorVariables.Complete: iconName = "medium";
																break;
							case ConfiguratorVariables.Partial: iconName = "low";
																break;
							case ConfiguratorVariables.Hybrid: iconName = "high";
																break;
						 }
						 txtIcon.changeIcon(iconName);
					});

					var actionView = new CustomActionsView(getActionObj(that.actionsList));
					actionView = actionView.render();
					actionView.container.setStyles({ /*verticalAlign: 'middle',*/ justifyContent: 'flex-start', display: 'inline-flex'});

					actionView.inject(extendedRightToolbarDiv);


				     //create a span for 3DButton
					if (options.add3DButton && options.add3DButton === "yes") {
					    var _3DButtonSpan = document.createElement('span');
					    _3DButtonSpan.id = "3DButtonSpan";

					    var extended3DButtonSpan = UWA.extendElement(_3DButtonSpan);

					    extended3DButtonSpan.inject(extendedRightToolbarDiv);

					    var activatedState = "false";

					    var _3DButton = new Button({ value: '3D', className: 'info', id: 'my3DButton', }).inject(extended3DButtonSpan);
					    _3DButton.addEvent("onClick", function () {
					        if (activatedState === "true") {
					            activatedState = "false";
					            this.elements.input.className = 'btn-info btn btn-root';
					        }
					        else {
					            activatedState = "true";
					            this.elements.input.className = 'btn-primary btn btn-root';
					        }

					        options.modelEvents.publish({
					            event: 'Request3DFromConfigPanel',
					            data: { value: (activatedState === "true") ? "show" : "hide" }
					        });
					    });

					}

					//Create the div of filtering tools
					var filteringToolsDiv = document.createElement('div');
					filteringToolsDiv.id = "filteringToolsDiv";

					var extendedFilteringToolsDiv = UWA.extendElement(filteringToolsDiv);

					extendedFilteringToolsDiv.inject(extendedToolbarDiv);

					//Create the dropdown to filter the Variant Classes with their status
					var selectStatusDiv = document.createElement('div');
					selectStatusDiv.id = 'selectFilterOnStatusDiv';

					var extendedSelectStatusDiv = UWA.extendElement(selectStatusDiv);

					extendedSelectStatusDiv.inject(extendedFilteringToolsDiv);

					var buttonFilterStatus = new Button({
						 icon: 'down-dir right',
						 id:'FilterStatusButton'
					}).inject(selectStatusDiv);

					var iconFilterStatusSpan = document.createElement('span');
					iconFilterStatusSpan.id = 'iconFilterStatusSpan';

					var extendedIconFilterStatusSpan = UWA.extendElement(iconFilterStatusSpan);
					extendedIconFilterStatusSpan.inject(buttonFilterStatus.getContent());

					var statusItems = [];

					statusItems.push({ text: nlsConfiguratorKeys["Filter on status"], className: 'header' });
					statusItems.push({ className: "divider" });
					statusItems.push({ name: ConfiguratorVariables.Unselected, text: nlsConfiguratorKeys[ConfiguratorVariables.Unselected], fonticon: 'mouse-pointer-square', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.UnselectedMandatory, text: nlsConfiguratorKeys[ConfiguratorVariables.UnselectedMandatory], fonticon: 'attention', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.ChosenByTheUser, text: nlsConfiguratorKeys[ConfiguratorVariables.ChosenByTheUser], fonticon: 'user-check', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.RequiredByRules, text: nlsConfiguratorKeys[ConfiguratorVariables.RequiredByRules], fonticon: '3ds-how', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.DefaultSelected, text: nlsConfiguratorKeys[ConfiguratorVariables.DefaultSelected], fonticon: 'star', selectable: true });
					if (options.configModel.getAppFunc().rulesMode_ProposeOptimizedConfiguration == "yes")
					    statusItems.push({ name: ConfiguratorVariables.ProposedByOptimization, text: nlsConfiguratorKeys[ConfiguratorVariables.ProposedByOptimization], fonticon: 'chart-area', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.DismissedByTheUser, text: nlsConfiguratorKeys[ConfiguratorVariables.DismissedByTheUser], fonticon: 'user-times', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.SelectionInConflict, text: nlsConfiguratorKeys[ConfiguratorVariables.SelectionInConflict], fonticon: 'alert', selectable: true });
					statusItems.push({ name: ConfiguratorVariables.NoFilter, text: nlsConfiguratorKeys[ConfiguratorVariables.NoFilter], fonticon: '', selected: true, disabled: true });

					var params = {
						target: buttonFilterStatus.getContent(),
						multiSelect: false,
						closeOnClick: true,
						id: 'FilterStatusDDMenu',
						items: statusItems,
                        renderTo: options.parentContainer,
						events: {
							onClick: function (e, item) {
								if(item.elements.icon)
									iconFilterStatusSpan.set('class', item.elements.icon.className);
								else
									iconFilterStatusSpan.set('class', '');

								this.enableItem(this.getItem(ConfiguratorVariables.Unselected).name);
								this.enableItem(this.getItem(ConfiguratorVariables.UnselectedMandatory).name);
								this.enableItem(this.getItem(ConfiguratorVariables.ChosenByTheUser).name);
								this.enableItem(this.getItem(ConfiguratorVariables.RequiredByRules).name);
								this.enableItem(this.getItem(ConfiguratorVariables.DefaultSelected).name);
								this.enableItem(this.getItem(ConfiguratorVariables.ProposedByOptimization).name);
								this.enableItem(this.getItem(ConfiguratorVariables.DismissedByTheUser).name);
								this.enableItem(this.getItem(ConfiguratorVariables.SelectionInConflict).name);
								this.enableItem(this.getItem(ConfiguratorVariables.NoFilter).name);

								this.disableItem(item.name);

								options.modelEvents.publish( {
									event:	'OnFilterStatusChange',
									data:	{value : item.name}
								});
							}
						}
					};

					var FilterStatusDDMenu = new DropdownMenu(params);



					buttonFilterStatus.inject(selectStatusDiv);

					//Create the input to Search on the Variant Classes
					var inputSearchVariantClasses = new InputText({
					    placeholder: nlsConfiguratorKeys["Search"] +' (' + that.currentAttributeForSearch + ')',
						id: 'searchInput'
					});

					inputSearchVariantClasses.elements.input.ondrop = function (e) {
					    return false;
					};

					inputSearchVariantClasses.elements.input.onkeyup = function(e) {
						that.currentValueForSearch = e.target.value;
						if(e.key == "Enter") {
						    if (e.target.value == '') return;

							addSavedFilter(e.target.value, that.currentAttributeForSearch);

							options.modelEvents.publish( {
								event:	'OnFilterStringSaved',
								data:	{
											value : e.target.value,
											attribute : that.currentAttributeForSearch
										}
							});

							inputSearchVariantClasses.elements.input.value = '';
							that.currentValueForSearch = '';

							options.modelEvents.publish({
							    event: 'OnToolbarHeightChange',
							    data: { value: getToolbarHeight() }
							});
						}
						else {
						    if (e.key == "Escape") {
						        e.target.value = "";
						    }
							options.modelEvents.publish( {
								event:	'OnSearchValueChange',
								data:	{
										value : e.target.value,
										attribute : that.currentAttributeForSearch
										}
							});
						}
					};

					inputSearchVariantClasses.inject(extendedFilteringToolsDiv);

					//Create the dropdown to filter on attributes
					var AttributesMenuDiv = document.createElement('div');
					AttributesMenuDiv.id = 'attributesMenuDiv';

					var extendedAttributesMenuDiv = UWA.extendElement(AttributesMenuDiv);
					extendedAttributesMenuDiv.inject(extendedFilteringToolsDiv);


					var itemListForAttributesDropDown = [
                        { text: nlsConfiguratorKeys["Filter on attributes"], className: 'header' },
                        { className: "divider" }
					];

					for (var m = 0; m < that._attributesList.length; m++) {
					    if (that._attributesList[m] == that.currentAttributeForSearch)
					        itemListForAttributesDropDown.push({ name: that._attributesList[m], text: that._attributesList[m], selected: true, disabled: true });
                        else
					        itemListForAttributesDropDown.push({ name: that._attributesList[m], text: that._attributesList[m], selectable: true });
					}

					//Actions for Attributes Menu icon
					var actionsList = [{
							text : "Attributes menu icon",
							icon: 'menu-dot',
							id: "attributesMenuIcon",
							actionId: 'AttributesMenuIcon',
							tooltip: nlsConfiguratorKeys["Filter on attributes"],
							handler: function(e) {
							},
							style : function() {
    							var iconColor = '#5b5d5e';

    							return { color: iconColor};
    						},
							dropdown : {
								multiSelect: false,
								closeOnClick: true,
								items: itemListForAttributesDropDown,
								events: {
									onClick: function (e, item) {
										that.currentAttributeForSearch = item.name;
										inputSearchVariantClasses.elements.input.placeholder = nlsConfiguratorKeys["Search"] +' (' + item.text + ')';

										for (var n = 0; n < that._attributesList.length; n++) {
										    this.enableItem(this.getItem(that._attributesList[n]).name);
										}

										this.disableItem(item.name);

										options.modelEvents.publish( {
											event:	'OnFilterAttributeChange',
											data:	{ attribute: item.name,
													value: that.currentValueForSearch
													}
										});
									}
								}
							}
					}];

					var actionView = new CustomActionsView(getActionObj(actionsList));
					actionView = actionView.render();
					actionView.container.setStyles({ verticalAlign: 'middle', justifyContent: 'flex-start'});

					actionView.inject(AttributesMenuDiv);



					function getActionObj(actionsList) {
						var actionObj = {
						collection : new ActionsCollection(actionsList),
						events : {
							'onActionClick' : function(actionView, event) {
								var actionFunction = actionView.model.get('handler');

									if (UWA.is(actionFunction, 'function')) {
										actionFunction(event);
									}
								}
							}
						};

						return actionObj;
					}


					//Create the div that will show the saved filters
					var SavedFiltersDiv = document.createElement('div');
					SavedFiltersDiv.id = "savedFiltersDiv";

					var extendedSavedFiltersDiv = UWA.extendElement(SavedFiltersDiv);

					function addSavedFilter(FilterString, FilterAttribute) {
						var tempDiv = document.createElement('div');

						var tempSpan = document.createElement('span');
						tempSpan.innerHTML = FilterString + " (" + FilterAttribute + ")";
						var extendedTempSpan = UWA.extendElement(tempSpan);
						var extendedTempDiv = UWA.extendElement(tempDiv);

						extendedTempSpan.inject(tempDiv);
						extendedTempDiv.inject(extendedSavedFiltersDiv);

						var actionsList = [{
							text : "Erase icon",
							icon: 'erase',
							actionId: 'EraseIcon',
							handler: function(e) {
								removeSavedFilter(tempDiv, FilterString, FilterAttribute);
							}
						}];

						var actionView = new CustomActionsView(getActionObj(actionsList));
						actionView = actionView.render();
						actionView.container.setStyles({ verticalAlign: 'middle', justifyContent: 'flex-start', display: 'inline-flex', float: 'right'});

						actionView.inject(tempDiv);

						var spans = tempDiv.getElementsByTagName('span');
						if(spans[1].className == "fonticon fonticon-2x fonticon-erase") {
							spans[1].className = "fonticon fonticon-erase";
						}
					};

					function removeSavedFilter(tempDiv, FilterString, FilterAttribute) {
						 tempDiv.parentNode.removeChild(tempDiv);

						 options.modelEvents.publish( {
							event:	'OnFilterStringRemoved',
							data:	{
										value : FilterString,
										attribute : FilterAttribute
									}
						 });

						 options.modelEvents.publish({
						     event: 'OnToolbarHeightChange',
						     data: { value: getToolbarHeight() }
						 });
					}

					function getToolbarHeight() {
					    return extendedSavedFiltersDiv.offsetHeight + parseInt(extendedToolbarDiv.style.height.split("px")[0]) + 10;     //10 is for the marginTop added on savedFiltersDiv
					}

					options.parentContainer.addContent(extendedToolbarDiv);
					options.parentContainer.addContent(extendedSavedFiltersDiv);
				 },

				 getToolbarHeight: function () {
				     return document.getElementById("ConfiguratorToolbar").offsetHeight + document.getElementById("savedFiltersDiv").offsetHeight + 10;     //10 is for the marginTop added on savedFiltersDiv
				 }

			 });


		return ToolbarPresenter;
	});

define('DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionEditor',
  [
      'DS/Controls/Abstract',
      'DS/Utilities/Utils',
      'DS/Utilities/Dom',
      'DS/Utilities/Object',
      'DS/TreeModel/TreeDocument',
      'DS/TreeModel/TreeNodeModel',
      'DS/Controls/Button',
      'DS/Controls/Popup',
      'DS/CfgBulkTablePresenter/BulkEdition/Presenter/CfgAutocomplete',
      'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
      'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
      'css!DS/ConfiguratorPanel/css/CriteriaSelectionEditor.css'
    ], function(Abstract,
        Utils,
        Dom,
        ObjectUtils,
        TreeDocument,
        TreeNodeModel,
        Button,
        Popup,
        CfgAutocomplete,
        ConfiguratorVariables,
        nlsConfiguratorKeys
        ) {

    'use strict';

    var STATE_ICONS = {};
    STATE_ICONS[ConfiguratorVariables.Default] = 'rule-status-default';
    STATE_ICONS[ConfiguratorVariables.Required] = 'rule-status-required';
    STATE_ICONS[ConfiguratorVariables.Chosen] = '';
    STATE_ICONS[ConfiguratorVariables.Selected] = 'rule-status-selected';
    STATE_ICONS[ConfiguratorVariables.Unselected] = '';
    STATE_ICONS[ConfiguratorVariables.Incompatible] = 'rule-status-incompatible';
    STATE_ICONS[ConfiguratorVariables.Dismissed] = 'user-delete';

    //build Criteria Selection Editor
    var CriteriaSelectionEditor = Abstract.inherit({

        name: 'criteria-selection-editor',

        publishedProperties: {
          value : {
            defaultValue: '',
            type: 'object'
          },
          referenceValue: {
            defaultValue: null,
            type: 'object'
          },
          contentType : {
            defaultValue: '',
            type: 'string'
          },
          multiValue : {
            defaultValue: false,
            type: 'boolean'
          },
          state : {
            defaultValue: '',
            type: 'string'
          },
          hasConflict : {
            defaultValue: false,
            type: 'boolean'
          },
          validationAction: {
            defaultValue: false,
            type: 'boolean'
          },
          rejectAction: {
            defaultValue: false,
            type: 'boolean'
          },
          possibleValues : {
            defaultValue: [],
            type: 'array'
          },
          sort : {
            defaultValue: '',
            type: 'object'
          },
          showLoader : {
            defaultValue: false,
            type: 'boolean'
          },
          asyncLoad : {
            defaultValue: false,
            type: 'boolean'
          },
          context : {
            defaultValue: '',
            type: 'object'
          },
          dismissMode : {
            defaultValue: false,
            type: 'boolean'
          },
          enableEasySelection : {
            defaultValue : false,
            type : 'boolean'
          }
        },

        buildView : function () {
          var that = this;
          this._isBuilding = true;
          this._availableValuesDocument = new TreeDocument({
            shouldBeSelected: function (nodeModel) {
                return nodeModel.options.isSelectable;
            }
          });
          this._possibleValueDetails = {};
          this._autoComplete = new CfgAutocomplete({
            placeholder : nlsConfiguratorKeys.Autocomplete_placeholder,
            elementsTree: this._availableValuesDocument,
            allowFreeInputFlag: false,
            allowResetToUndefinedByUIFlag: false,
            multiSearchMode : true,
            easySelectionMode : CfgAutocomplete.SELECT_MODE_NONE,
            getChipInfo: (nodeModel) => this._getChipInfo(nodeModel),
            onClickIcon: (e, cellInfos) => {
              that._tooltip.target = e.target;
              that._tooltip.offset = that.getContent().getOffsets();
              that._tooltip.show();
              var value = that.value;
              if(!UWA.is(value, 'array')) {
                value = [value];
              }
              value.forEach(item => {
                if(item.id === cellInfos.id)
                  that.fire('show-state-tooltip', {value : item, id : cellInfos.id});
              });
            },
            compareCB: function (nodeModelA, nodeModelB) {
              if(that.sort) {
                if(that.sort.attribute == 'displayName') {
                  return nodeModelA.getAttributeValue('title').localeCompare(nodeModelB.getAttributeValue('title'));
                } else if (that.sort.attribute == 'sequenceNumber') {
                  return nodeModelA.getAttributeValue('sequenceNumber') - (nodeModelB.getAttributeValue('sequenceNumber'));
                }
              }
              return 0;
            }
          });


          this._allexceptlabel = UWA.createElement('div',{
            'class': 'all_values_except',
            'html': nlsConfiguratorKeys.All_values_except, // 'All values except: '
          });

          this._valueContainer = UWA.createElement('div', {
            'class' : 'value-container'
          });

          this._conflictContent = UWA.createElement('span', {
            'class' : 'conflict-action-content'
          });
          this._conflictAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "alert", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });
          this._conflictContent.setContent(this._conflictAction);

          this._stateContent = UWA.createElement('span', {
            styles : {
              display: 'inline-block',
              padding: '0px 5px'
            }
          });

          this._cancelContent = UWA.createElement('span', {
            'class' : 'clear-action-content'
          });
          this._cancelAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "wrong", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });

          this._cancelContent.setContent(this._cancelAction);

          this._validateContent = UWA.createElement('span', {
            'class' : 'validate-action-content'
          });
          this._validateAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "check", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });
          this._validateContent.setContent(this._validateAction);

          this._tooltip = new Popup({trigger: 'escape', autoHide : false, mouseRelativePosition: true  });
          this._tooltip.setBody('Loading..');
          this._tooltip.getContent().addClassName('cfg-custom-popup');
          // this._valueContainer.setContent(this._allexceptlabel);
          this._valueContainer.addContent(this._conflictContent);
          this._valueContainer.addContent(this._stateContent);
          this._valueContainer.addContent(this._autoComplete.getContent());
          this._valueContainer.addContent(this._cancelContent);
          this._valueContainer.addContent(this._validateContent);
        },

        _postBuildView: function() {
          this.getContent().addClassName('criteria-selection-editor');
          this._autoComplete.elementsTree = this._availableValuesDocument;
          this._applyPossibleValues();
          this._autoComplete.value = this.value;
          this.getContent().setContent(this._valueContainer);
        },



        handleEvents: function() {

          var that = this;

          Dom.addEventOnElement(this, this._autoComplete, 'change', function (e) {
            e.stopPropagation();
            if(!that._isBuilding)
            {
              if(!UWA.equals(that.value, e.dsModel.value)) {
                if(true) {
                  that.fire('update-height', {value : that.value, id : that.context});
                }
                if(!that.isActive) {
                    that.value = e.dsModel.value;
                    if(that.value) {
                      that.fire('select-criteria', {value : that.value, id : that.context});
                      that.fire('change',that.value);
                    }
                  }
                }
            }
          });

          Dom.addEventOnElement(this, this._autoComplete, 'show', function (e) {
            e.stopPropagation();
            that.isActive = true;
            if(that.asyncLoad) {
              that.showLoader = true;
              this.fire('show-criteria', {value : that.value, id : that.context});
            } else if(that.showLoader) {
              that.showLoader = false;
            }
          });

          Dom.addEventOnElement(this, this._autoComplete, 'hide', function (e) {
            e.stopPropagation();
            that.isActive = false;
            if(that.asyncLoad) {
              this.fire('hide-criteria', {value : that.value, id : that.context});
            }
            if(!UWA.equals(that.value, e.dsModel.value)) {
              that.value = e.dsModel.value;
              that.fire('select-criteria', {value : that.value, id : that.context});
              that.fire('change',that.value);
            }
          });

          Dom.addEventOnElement(this, this._conflictAction, 'buttonclick', function (e) {
            e.stopPropagation();
            that._tooltip.target = e.target;
            that._tooltip.offset = e.target.getOffsets();
            that._tooltip.show();
            that.fire('show-state-tooltip', {value : that.value, id : that.context});
          });

          Dom.addEventOnElement(this, this._cancelAction, 'buttonclick', function (e) {
              e.stopPropagation();
              that.fire('reject-criteria', {value : that.value, id : that.context});
              that.value = '';
              that.fire('change',that.value);
          });

          Dom.addEventOnElement(this, this._validateAction, 'buttonclick', function (e) {
              e.stopPropagation();
              that.fire('validate-criteria', {value : that.value, id : that.context});
          });

          that.getContent().addEventListener('click', function (e) {
            if(e.target.hasClassName('wux-chip-cell-label')) {
              var value = that.value;
              if(!UWA.is(value, 'array')) {
                value = [value];
              }
              value.forEach((item, i) => {
                if(that._possibleValueDetails[item].title == e.target.textContent) {
                  if(e.target.offsetWidth - e.offsetX < 24) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if(that._possibleValueDetails[item].validate) {
                      that.fire('validate-criteria', {value : item, id : that.context});
                    }
                  }
                  if(e.offsetX < 20) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    that._tooltip.target = e.target;
                    that._tooltip.offset = that.getContent().getOffsets();
                    that._tooltip.show();
                    that.fire('show-state-tooltip', {value : item, id : that.context});
                  }
                }
              });
            }
          }, true);

          that.getContent().addEventListener('focusout', function (e) {
            if(that._tooltip.visibleFlag) {
              that._tooltip.hide();
            }
          });

        },

        cleanContent : function () {
            if(this.isActive && !this.asyncLoad) {
              this._autoComplete.elements.popup.visibleFlag = false;
            }
        },

        _applyValue : function (oldValue, value) {
          this._autoComplete.value = this.value;
          if(this.isActive && !this.asyncLoad) {
            this._autoComplete.elements.popup.visibleFlag = false;
          }
          
          this.hasConflict = false;
          this.rejectAction = false;
          this.validationAction = false;
        },

        _applyContentType : function (oldValue, value) {
          this.getContent().setContent(this._valueContainer);
        },

        _applyReferenceValue : function ( oldValue, value) {
          let highlightDiff = false; 
          // If reference column's cell contains values and the compared with column's cell is empty -> highlight cell background
          if (this.referenceValue) {
            highlightDiff = true; 
            if (this.referenceValue.length === this.value.length) {
              let  differences = this.referenceValue.filter(obj1 => {                
                  return !this.value.some(obj2 => {
                      return obj1 === obj2;
                  });
              });
              if (differences.length === 0) {
                highlightDiff= false;                     
              }
            }
          }
          if (highlightDiff && !this.getContent().hasClassName('highlight-background')) {
              this.getContent().addClassName('highlight-background');
          }else if (!highlightDiff && this.getContent().hasClassName('highlight-background')){
              this.getContent().removeClassName('highlight-background');
          }
        },

        _applyPossibleValues : function () {         
          this._availableValuesDocument.removeRoots();
          this._possibleValueDetails = {};
          this._autoComplete.value = null;
          var nodeData = [];
          var toBeRemoved = true;
          var icons;
          this.possibleValues.forEach((item, i) => {            
            icons = [];
            if(item.conflict) {
              icons.push({iconName: 'rule-status-conflict', className: 'item-state-conflict'});
              icons.push(item.image);
            } else {
              icons.push(item.image);
              icons.push(STATE_ICONS[item.state]);
            }
            var node = new TreeNodeModel({
              stringIdentifier : item.id,
              value: item.id,
              label: item.title,
              icons: icons,
              image : item.image,
              isSelectable : UWA.is(item.selectable, 'boolean') ? item.selectable: true,
              grid: item
            });
            this._possibleValueDetails[item.id] = item;
            nodeData.push(node);
          });
          if(toBeRemoved) {
            this._availableValuesDocument.loadModel(nodeData);
          }
        },

        _applySort : function () {
          if(this.sort.order) {
            this._autoComplete.sortOrder = null;
            this._autoComplete.sortOrder = this.sort.order.toLowerCase();
          }
        },

        _getChipInfo : function (nodeModel) {
          var className = 'criteria-chip-image';
          className += nodeModel.getAttributeValue('conflict') ? ' criteria-chip-rule-status-conflict' : '';
          className += nodeModel.getAttributeValue('state') ? ' criteria-chip-'+ STATE_ICONS[nodeModel.getAttributeValue('state')] : '';
          className += nodeModel.getAttributeValue('rejectable') == false ? ' criteria-chip-no-close' : '';
          className += nodeModel.getAttributeValue('validate') ?  ' criteria-chip-validate' : '';
          return {
            label : nodeModel.getAttributeValue('title'),
            icon : {
              iconPath: nodeModel.getAttributeValue('image'),
              className: className
            }
          };
        },

        _applyMultiValue : function (oldValue, value) {
          if(this.enableEasySelection) {
            this._autoComplete.easySelectionMode = this.multiValue ? CfgAutocomplete.SELECT_MODE_MULTI : CfgAutocomplete.SELECT_MODE_SINGLE;
          } else {
            this._autoComplete.easySelectionMode = CfgAutocomplete.SELECT_MODE_NONE;
          }
        },

        _applyState : function (oldValue, value) {
          if(this.state) {
            this._stateContent.show();
            this._stateContent.setContent(Dom.generateIcon({
              iconName: STATE_ICONS[this.state]
            }));
          } else {
            this._stateContent.hide();
          }
        },

        _applyHasConflict : function (oldValue, value) {
          if(this.hasConflict) {
            this._conflictContent.show();
          } else {
            this._conflictContent.hide();
          }
        },

        _applyRejectAction : function (oldValue, value) {
          if(this.rejectAction) {
            this._cancelContent.show();
          } else {
            this._cancelContent.hide();
          }
        },

        _applyDismissMode : function (oldValue, value) {
          if(this.dismissMode && !this.getContent().hasClassName('criteria-rejection-editor') ) {
            this.getContent().addClassName('criteria-rejection-editor');
          } else {
            this.getContent().removeClassName('criteria-rejection-editor');
          }
        },

        _applyValidationAction : function (oldValue, value) {
          if(this.validationAction) {
            this._validateContent.show();
          } else {
            this._validateContent.hide();
          }
        },

        _applyShowLoader : function (oldValue, value) {
          if(UWA.is(this.showLoader, 'boolean')) {
            try {
              if(this.showLoader) {
                this._autoComplete.showLoader();
              } else {
                this._autoComplete.hideLoader();
              }
            }catch(e) {
              // do not need to process
            }
          }
        },

        _applyEnableEasySelection : function () {
          this._autoComplete.easySelectionMode = CfgAutocomplete.SELECT_MODE_DISABLE;
          if(this.enableEasySelection) {
            this._autoComplete.easySelectionMode = this.multiValue ? CfgAutocomplete.SELECT_MODE_MULTI : CfgAutocomplete.SELECT_MODE_SINGLE;
          } else {
            this._autoComplete.easySelectionMode = CfgAutocomplete.SELECT_MODE_NONE;
          }
        },

        updateTooltipMessage : function (message) {
          this._tooltip.setBody(message);
        },

        _applyProperties: function(oldValues) {
          this._isBuilding = true;
          this._parent(oldValues);
          if (this.isDirty('contentType')) {
            this._applyContentType(oldValues.contentType);
          }
          if (this.isDirty('multiValue')) {
             this._applyMultiValue(oldValues.multiValue);
          }
          if (this.isDirty('possibleValues')) {
            this._applyPossibleValues();
          }
          if (this.isDirty('sort')) {
            this._applySort();
          }
          if (this.isDirty('state')) {
            this._applyState(oldValues.state);
          }

          if (this.isDirty('hasConflict')) {
            this._applyHasConflict(oldValues.hasConflict);
          }
          if (this.isDirty('rejectAction')) {
            this._applyRejectAction(oldValues.rejectAction);
          }
          if (this.isDirty('validationAction')) {
            this._applyValidationAction(oldValues.validationAction);
          }
          if (this.isDirty('showLoader')) {
            this._applyShowLoader(oldValues.showLoader);
          }

          if (this.isDirty('value')) {
            this._applyValue(oldValues.value);
            this._applyReferenceValue(oldValues.referenceValue);
          }
          this._applyEnableEasySelection(oldValues.enableEasySelection);
          if (this.isDirty('possibleValues') || this.isDirty('value') || this.isDirty('enableEasySelection')) {
          }
          if (this.isDirty('dismissMode')) {
            this._applyDismissMode(oldValues.dismissMode);
          }

          if (this.isDirty('referenceValue')) {
            this._applyReferenceValue(oldValues.referenceValue);
          }


          this._isBuilding = false;
        }
    });


  	return CriteriaSelectionEditor;
});



define('DS/ConfiguratorPanel/scripts/ServiceUtil',
		[
			'UWA/Core',
	    'DS/i3DXCompassServices/i3DXCompassServices',
	    'DS/Notifications/NotificationsManagerUXMessages',
	    'DS/Notifications/NotificationsManagerViewOnScreen',
      'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
      'DS/WAFData/WAFData',
	    'DS/WidgetServices/WidgetServices',
    ],
    function (UWA, i3DXCompassServices, NotificationsManagerUXMessages, NotificationsManagerViewOnScreen, ConfiguratorVariables, WAFData, WidgetServices) {


	return UWA.Class.singleton({
		uninitializedCalls: 'throw',

		init : function (options) {
			this._tenant = options.tenant;
			this._securityContext = options.securityContext;
			// id, status(0-not started, 1- in progress)
			this._requestInfo = {};

			this._parent();
		},


		performSearchRequest : function (data, requestID) {
			var that = this;
			this._requestInfo[requestID] = {status : 0 };
			return this._getSearchServiceURL().then(function () {
				UWA.merge(data, {
					source : ["3dspace"],
					login : {
						"3dspace" : {
							SecurityContext : that._securityContext
						}
					},
	      	tenant : that._tenant,
				});

				return new UWA.Promise(function (resolve, reject) {
					var options = {
						method : 'POST',
						headers : {
							'Accept' : 'application/json',
							'Content-Type': 'application/json'
						},
						tenantId : that._tenant,
						apiVersion : 'R2018x',
						data : JSON.stringify(data),
						onComplete: function (output) {
							output = JSON.parse(output);
							delete that._requestInfo[requestID];
							resolve(output);
						},
						onFailure : function () {
							delete that._requestInfo[requestID];
							reject();
						},
						onCancel : function () {
							delete that._requestInfo[requestID];
							reject({cancel: true});
						}
					};
					var request = WAFData.authenticatedRequest(that._searchServiceURL, options);
					that._requestInfo[requestID].status = 1;
					that._requestInfo[requestID].request = request;

				});
			});

		},

		performServiceRequest : function (url, data, requestID, reqOptions) {
			var that = this;
			this._requestInfo[requestID] = {status : 0 };
			reqOptions = reqOptions || {};
			return this._get3DSpaceURL().then(function () {
				if(that._3DSpaceURL ) {
					return new UWA.Promise(function (resolve, reject) {
						var headers = {
							'Accept' : 'application/json',
							'Content-Type': 'application/json',
							'SecurityContext': that._securityContext
						};
						var options = UWA.merge(reqOptions, {
							method : 'POST',
							headers : headers,
							tenantId : that._tenant,
							apiVersion : 'R2018x',
							data : JSON.stringify(data),
							onComplete: function (output) {
								delete that._requestInfo[requestID];
								output = JSON.parse(output);
								resolve(output);
							},
							onFailure : function () {
								delete that._requestInfo[requestID];
								reject();
							},
							onCancel : function () {
								delete that._requestInfo[requestID];
								reject({cancel: true});
							}
						});
						var request = WAFData.authenticatedRequest(that._3DSpaceURL + url , options);
						that._requestInfo[requestID].status = 1;
						that._requestInfo[requestID].request = request;
					});
				} else {
					return UWA.Promise.resolve();
				}

			});
		},

		cancelRequest : function (requestID) {
			var info = this._requestInfo[requestID];
			if(info && info.request) {
				info.request.cancel();
			}
		},

		_getSearchServiceURL : function () {
			if(this._searchServiceURL) {
				return UWA.Promise.resolve();
			} else {
				var that = this;
				return new UWA.Promise(function (resolve, reject) {
					WidgetServices.get3DSearchUrlAsync({
						platformId: that._tenant,
						onComplete: function(fullServerUrl){
							console.log(fullServerUrl);
							that._searchServiceURL = fullServerUrl + '/search';
							resolve();
						},
						onFailure : function () {
							reject();
						}
					});
				});
			}
		},

		_get3DSpaceURL : function () {
			if(this._3DSpaceURL) {
				return UWA.Promise.resolve();
			} else {
				var that = this;
				return new UWA.Promise(function (resolve, reject) {
					WidgetServices.get3DSpaceUrlAsync({
						platformId: that._tenant,
						onComplete: function(url){
							console.log(url);
							that._3DSpaceURL = url;
							resolve();
						},
						onFailure : function () {
							reject();
						}
					});
				});
			}
		}
	});
});

define(
    'DS/ConfiguratorPanel/scripts/Models/PCDataUtil',
    [
      'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
  		'DS/ConfiguratorPanel/scripts/ServiceUtil',
      'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
      'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong.json'
    ],

    function(
        ConfiguratorVariables,
        ServiceUtil,
        nlsConfiguratorKeys,
        nlsUnitLabelLongKeys
    ){
    'use strict';

    var STATE_ICONS = {};
    STATE_ICONS[ConfiguratorVariables.Default] = 'rule-status-default';
    STATE_ICONS[ConfiguratorVariables.Required] = 'rule-status-required';
    STATE_ICONS[ConfiguratorVariables.Chosen] = '';
    STATE_ICONS[ConfiguratorVariables.Selected] = 'rule-status-selected';
    STATE_ICONS[ConfiguratorVariables.Unselected] = '';
    STATE_ICONS[ConfiguratorVariables.Incompatible] = 'rule-status-incompatible';
    STATE_ICONS[ConfiguratorVariables.Dismissed] = 'user-delete';

    var STATES = {};
    STATES[ConfiguratorVariables.PersistenceStates_Chosen] = ConfiguratorVariables.Chosen;
    STATES[ConfiguratorVariables.PersistenceStates_Required] = ConfiguratorVariables.Required;
    STATES[ConfiguratorVariables.PersistenceStates_Default] = ConfiguratorVariables.Default;
    STATES[ConfiguratorVariables.PersistenceStates_Dismissed] = ConfiguratorVariables.Dismissed;
    STATES[ConfiguratorVariables.PersistenceStates_Incompatible] = ConfiguratorVariables.Incompatible;
    STATES[ConfiguratorVariables.PersistenceStates_Unselected] = ConfiguratorVariables.Unselected;
    STATES[ConfiguratorVariables.PersistenceStates_Selected] = ConfiguratorVariables.Selected;


		var pCDataUtil =  function(options){
      this._init(options);
    };

    pCDataUtil.prototype._init = function (options) {
      this._configModel = options.configModel;
      this._dictionaryUtil = options.dictionaryUtil;
      this._modelEvents = options.modelEvents;
      this._enableMatchingPC = options.enableMatchingPC || false;

      this._pcDetails = {};
      this._matchingPCs = {};

      this._chosenCriteria = {};
      this._searchCriteria = {};
      this._searchSelectionMode;
      this._isloadingPC = false;
      this._diagnosedCriteria = {};

      this._subscribeEvents();
      this._loadChosenCriteria();
    };

    pCDataUtil.prototype._subscribeEvents = function (id) {
      if(this._enableMatchingPC) {
        this._modelEvents.subscribe({event : 'pc-load-matching-pcs-action'}, () => {
          setTimeout(()=> {
            this._loadMatchingPCs();
          }, 100);
        });
      }
    };

    pCDataUtil.prototype._loadChosenCriteria = function () {
      this._chosenCriteria = this._getChosenCriteria();
    };

    pCDataUtil.prototype.refresh = function () {
      this._chosenCriteria = this._getChosenCriteria();
      this._loadMatchingPCs();
    };

    pCDataUtil.prototype.getState = function (id) {
      return this._configModel.getStateWithId(id);     
    };

    pCDataUtil.prototype.isSelectable = function (id) {
      return this._configModel.getStateWithId(id) !== ConfiguratorVariables.Incompatible && this._configModel.getStateWithId(id) !== ConfiguratorVariables.Required;
    };
    
    pCDataUtil.prototype.getStateIconFromState = function (state) {
      return STATE_ICONS[state];
    };

    pCDataUtil.prototype.getIdStateMap = function () {
      return this._configModel._cacheIdWithState;
    };

    pCDataUtil.prototype.getSelectedValue = function (id) {
      var value;
      if(UWA.is(id,'string') && id !== '' && ( this._dictionaryUtil.isVariant(id) || this._dictionaryUtil.isOptionGroup(id)) ) {
        var values = this._dictionaryUtil.getValues(id);
        var stateMap = values.reduce((map, valueId) => {
          var state = this._configModel.getStateWithId(valueId);
          if(map.hasOwnProperty(state)) {
            map[state].push(valueId);
          } else {
            map[state] = [valueId];
          }
          return map;
        }, {});

        value = [];
        if(!this.isMultiValue(id) && this._configModel.getRulesMode() === ConfiguratorVariables.RulesMode_SelectCompleteConfiguration) {
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Chosen)) {
            value.push(stateMap[ConfiguratorVariables.Chosen][0]);
          } else if(stateMap.hasOwnProperty(ConfiguratorVariables.Required)) {
            value.push(stateMap[ConfiguratorVariables.Required][0]);
          } else if(stateMap.hasOwnProperty(ConfiguratorVariables.Default)) {
            value.push(stateMap[ConfiguratorVariables.Default][0]);
          } else if(stateMap.hasOwnProperty(ConfiguratorVariables.Selected)) {
            value.push(stateMap[ConfiguratorVariables.Selected][0]);
          }
        } else if(this.isDismissValue(id)) {
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Dismissed)) {
            value = value.concat(stateMap[ConfiguratorVariables.Dismissed]);
          }
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Incompatible)) {
            value = value.concat(stateMap[ConfiguratorVariables.Incompatible]);
          }
        } else {
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Chosen)) {
            value = value.concat(stateMap[ConfiguratorVariables.Chosen]);
          }
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Required)) {
            value = value.concat(stateMap[ConfiguratorVariables.Required]);
          }
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Default)) {
            value = value.concat(value = stateMap[ConfiguratorVariables.Default]);
          }
          if(stateMap.hasOwnProperty(ConfiguratorVariables.Selected)) {
            value = value.concat(value = stateMap[ConfiguratorVariables.Selected]);
          }
        }
      } else if(UWA.is(id,'string') && id !== '' && this._dictionaryUtil.isParameter(id)) {
        value = this._configModel.getValueWithId(id);
      }
      return value;
    };

    pCDataUtil.prototype.hasRejectAction = function (id) {
      if(this._configModel.getRulesActivation() === ConfiguratorVariables.str_false || this._configModel.getStateWithId(id) == ConfiguratorVariables.Chosen || this._configModel.getStateWithId(id) == ConfiguratorVariables.Default || this._configModel.getStateWithId(id) == ConfiguratorVariables.Dismissed)
      {
        return true;
      } else if(this._configModel.getStateWithId(id) == ConfiguratorVariables.Selected) {
        if(this._diagnosedCriteria[this._dictionaryUtil.getParent(id)]){
          return true;
        }
      }

      return false;
    };

    pCDataUtil.prototype.hasValidateAction = function (id) {
      if(this._configModel.getStateWithId(id) == ConfiguratorVariables.Required ||
        this._configModel.getStateWithId(id) == ConfiguratorVariables.Default ||
        this._configModel.getStateWithId(id) == ConfiguratorVariables.Selected
        )
      {
        return true;
      }

      return false;
    };

    pCDataUtil.prototype.hasConflict = function (id) {
      if(this._configModel.isConflictingOption(id))
      {
        return true;
      }

      return false;
    };

    pCDataUtil.prototype.isMultiValue = function (id) {
      if(this._configModel.getFeatureSelectionMode(id) == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple ||
        this._configModel.getFeatureSelectionMode(id) == ConfiguratorVariables.feature_SelectionMode_Multiple ||
        this._configModel.getFeatureSelectionMode(id) == ConfiguratorVariables.feature_SelectionMode_Dismiss )
      {
        return true;
      }

      return false;
    };

    pCDataUtil.prototype.isDismissValue = function (id) {
      if(this._configModel.getFeatureSelectionMode(id) == ConfiguratorVariables.feature_SelectionMode_Dismiss)
      {
        return true;
      }

      return false;
    };

    pCDataUtil.prototype.isMandatory = function (id) {
      return this._dictionaryUtil.isMandatory(id) || this._configModel.getFeatureIdWithMandStatus(id);
    };

    pCDataUtil.prototype.isUpdateRequired = function (id) {
      if( this._configModel.getRulesMode() === "RulesMode_SelectCompleteConfiguration" &&
          this._configModel.isSolveWithDiagnose() &&
          this._configModel.getFirstSelection() &&
          ( this._configModel.isConfigCriteriaUpdated() ||
            (!this._configModel.isConfigCriteriaUpdated() && !this._configModel.getDignosedVariant(id))
          )
      ){
        return true;
      }
      return false;
    };

    pCDataUtil.prototype.getIdsToDiagnose = function (id) {
      return this._dictionaryUtil.getValues(id);
    };

    pCDataUtil.prototype.selectValue = function (id, value) {
      var previousValue = this.getSelectedValue(id);

      if(UWA.is(id) && id !== '' && this._dictionaryUtil.isVariant(id) || this._dictionaryUtil.isOptionGroup(id)) {
        if(value) {
          value = UWA.is(value, 'array') ? value : [value];
        } else {
          value = [];
        }

        if(previousValue) {
          previousValue = UWA.is(previousValue, 'array') ? previousValue : [previousValue];
          previousValue.forEach((valueId) => {
            var valueIndex = value.indexOf(valueId);
            if( valueIndex > -1) {
              value.splice(valueIndex,1);
              return;
            }
            this.rejectValue(id, valueId);
            // this._configModel.setStateWithId(valueId, ConfiguratorVariables.Unselected);
          });
        }
        value.forEach((valueId) => {
          var oldValue = this._configModel.getStateWithId(valueId);
          if(this.isDismissValue(id)) {
            if(oldValue == ConfiguratorVariables.Dismissed) {
              this._configModel.setStateWithId(valueId, ConfiguratorVariables.Unselected);
            } else {
              this._configModel.setStateWithId(valueId, ConfiguratorVariables.Dismissed);
              if(!this._configModel.getFirstSelection()) {
                this._configModel.setFirstSelection(true);
              }
              if(!this._chosenCriteria[id]) {
                this._chosenCriteria[id] = {};
              }
              this._chosenCriteria[id][valueId] = false;
            }
          } else {
            if(oldValue == ConfiguratorVariables.Dismissed) {
              if(this._configModel.getDefaultCriteria() && this._configModel.getDefaultCriteria().indexOf(valueId) != -1) {
                this._configModel.setStateWithId(valueId, ConfiguratorVariables.Default);
              } else {
                this._configModel.setStateWithId(valueId, ConfiguratorVariables.Chosen);
              }
            } else if(oldValue == ConfiguratorVariables.Default) {
              this._configModel.setStateWithId(valueId, ConfiguratorVariables.Unselected);
            } else {
              this._configModel.setStateWithId(valueId, ConfiguratorVariables.Chosen);
              if(!this._configModel.getFirstSelection()) {
                this._configModel.setFirstSelection(true);
              }
              if(!this._chosenCriteria[id]) {
                this._chosenCriteria[id] = {};
              }
              this._chosenCriteria[id][valueId] = true;
            }
          }

          this._configModel.setUpdateRequiredOption(valueId,true);
        });
      }
    };

    pCDataUtil.prototype.rejectValue = function (id, value) {
      var oldValue = this._configModel.getStateWithId(value);
      if(oldValue == ConfiguratorVariables.Default || oldValue == ConfiguratorVariables.Selected) {
        this._configModel.setStateWithId(value, ConfiguratorVariables.Dismissed);
      } else {
        this._configModel.setStateWithId(value, ConfiguratorVariables.Unselected);
      }
      if(this._configModel.getStateWithId(value) == ConfiguratorVariables.Dismissed) {
          if(!this._chosenCriteria[id]) {
            this._chosenCriteria[id] = {};
          }
          this._chosenCriteria[id][value] = false;
      } else {
          if(this._chosenCriteria[id] && this._chosenCriteria[id].hasOwnProperty(value)) {
            delete this._chosenCriteria[id][value];
          }
          if(UWA.is(this._chosenCriteria[id],'object') && Object.keys(this._chosenCriteria[id]).length == 0) {
            delete this._chosenCriteria[id];
          }
      }

      this._configModel.setUpdateRequiredOption(value,true);

    };

    pCDataUtil.prototype.validateValue = function (id, value) {
      var oldValue = this._configModel.getStateWithId(value);
      if(oldValue === ConfiguratorVariables.Default || oldValue === ConfiguratorVariables.Required || oldValue === ConfiguratorVariables.Selected) {
        this._configModel.setStateWithId(value, ConfiguratorVariables.Chosen);
        if(UWA.is(this._chosenCriteria[id], 'object'))
           this._chosenCriteria[id][value] = true;
        else {
          this._chosenCriteria[id] = {};
          this._chosenCriteria[id][value] = true;
        }

        this._configModel.setUpdateRequiredOption(value,true);
      }
    };


    pCDataUtil.prototype.rejectNumericalValue = function (id) {
      this._configModel.setFeatureIdWithChosenStatus(id, false);
      this._configModel.setFeatureIdWithStatus(id, false);
      this._configModel.setValueWithId(id, undefined);
      this._configModel.setStateWithId(id, ConfiguratorVariables.Unselected, undefined);
    };

    pCDataUtil.prototype.validateNumericalValue = function (id, value) {
        this._configModel.setFeatureIdWithChosenStatus(id, true);
        this._configModel.setFeatureIdWithStatus(id, true);
        this._configModel.setValueWithId(id, value);
        this._configModel.setStateWithId(id,value, ConfiguratorVariables.Chosen);
    };

    pCDataUtil.prototype.setParamValue = function (id, value, state) {

      //IR-1224493-3DEXPERIENCER2024x Math.round: spinbox returns 204.99999999 for 205
      value = Math.round(value);
      this._configModel.setValueWithId(id, value);
      this._configModel.setStateWithId(id, state, value);

    };

    pCDataUtil.prototype.updateUserSelection = function (id, value, isSelected) {
      if(!this._chosenCriteria[id]) {
        this._chosenCriteria[id] = {};
      }
      this._chosenCriteria[id][value] = isSelected;

    }
    pCDataUtil.prototype._loadMatchingPCs = async function () {
      if(this._enableMatchingPC) {
        this._modelEvents.publish({event : 'pc-matching-pcs-load-start'});
        var hasChanged = this._checkMatchingCriteriaChange();
        await this._refinePCList(hasChanged);

        this._modelEvents.publish({event : 'pc-matching-pcs-load-end'});
      }
    };


    pCDataUtil.prototype.fetchMatchingPCs = function () {
      var requestID = "matchingPCSearch";
      this._matchingPCs = {};
      ServiceUtil.cancelRequest(requestID);
      var data = {
      	label : 'x_mdl_app_pc_panel' + Date.now(),
      	with_synthesis : false,
      	select_predicate : [
      		"ds6w:label",
      		"ds6w:identifier",
          'pc_feature_options',
          'preview_url',
          'revision',
          'pc_options_selected',
          'pc_options_rejected'
      	],
      	refine : {},
      	order_by : "desc",
      	order_field : "relevance",
      	query : this._prepareSearchQuery(),
        nresults : 200
      };

      return this._searchCall(data, requestID);
    };

    pCDataUtil.prototype._searchCall = function (data, requestID, nresults) {
      return ServiceUtil.performSearchRequest(data, requestID).then(output => {
        var results = output.results;
        var infos = output.infos;
        if(results) {
          var parsedData = this._parseSearchResult(results);
          UWA.merge(this._matchingPCs, parsedData.matchingPCs);
          UWA.merge(this._pcDetails, parsedData.pcDetails);
        }
        if(infos) {
          if(!UWA.is(nresults)) {
            nresults = 0;
          }
          nresults += infos.nresults;
          if(infos.nmatches > nresults) {
            return this._searchCall(UWA.merge({next_start : infos.next_start}, data), requestID, nresults);
          }
        }

        return UWA.Promise.resolve();
      }).catch(function(){
        //UWA.log(e) promises should always be handled through a catch or a reject should be passed
      });
    };

    pCDataUtil.prototype._parseSearchResult = function (result) {
      var _matchingPCs = {};
      var _pcDetails = {};
      var pcs = result.map((item) => {
        var details = {};
        var attributes = UWA.Json.path(item, '$..attributes[?(@.name=="resourceid" || @.name=="ds6w:label" || @.name=="ds6w:identifier" || @.name=="pc_feature_options" || @.name=="preview_url" || @.name=="revision"|| @.name=="pc_options_selected" || @.name=="pc_options_rejected" )]');
        if(attributes) {
          details = attributes.reduce((item, current) => {
            if(current.name == 'pc_options_selected') {
              var parent = this._dictionaryUtil.getParent(current.value);
              if(parent) {
                if(!item.selections) {
                  item.selections = {};
                }
                if(item.selections[parent]) {
                  item.selections[parent] = [current.value].concat(item.selections[parent]);
                } else {
                  item.selections[parent] = current.value;
                }
              }

            }
            if(current.name == 'pc_options_rejected') {
              var parent = this._dictionaryUtil.getParent(current.value);
              if(parent) {
                if(!item.rejections) {
                  item.rejections = {};
                }
                if(item.rejections[parent]) {
                  item.rejections[parent] = [current.value].concat(item.rejections[parent]);
                } else {
                  item.rejections[parent] = current.value;
                }
              }
            }

            item[current.name] = current.value;
            return item;
          }, {});
        }
        return details;
      });

      pcs.forEach((item) => {
        _matchingPCs[item.resourceid] = true;
        _pcDetails[item.resourceid] = {
          id: item.resourceid,
          name : item['ds6w:identifier'],
          title: item['ds6w:label'],
          version: item['revision'],
          image : item['preview_url'] || item['type_icon_url'],
          selections : item.selections || {},
          rejections : item.rejections || {}
        };
      });
      return {
        matchingPCs : _matchingPCs,
        pcDetails : _pcDetails
      };
    };

    // prepare query from selections
    // uses variant Name: value Name
    //// TODO: update using physicalid
    pCDataUtil.prototype._prepareSearchQuery = function () {
      var mvID = this._configModel._modelID;
      var pcID = this._configModel._pcId;

      var typeCheck = '(flattenedtaxonomies:\"types/Product Configuration\")';
      var parentCheck = 'AND (based_95_on_95_model_95_version_95_pid:\"'+ mvID +'\")' + (pcID ? ' AND (NOT physicalid:\"'+ pcID +'\") ': '');
      var selectionModeCheck = (this._configModel.getSelectionMode() == ConfiguratorVariables.selectionMode_Refine) ? 'AND (pc_95_selection_95_mode:\"Refine\")' : 'AND (pc_95_selection_95_mode:\"Build\") ';
      var criteriaCheck = '';
      for (var variantID in this._searchCriteria) {

        for (var valueID in this._searchCriteria[variantID]) {
          if (this._searchCriteria[variantID].hasOwnProperty(valueID)) {
            if(this._searchCriteria[variantID][valueID]) {
              criteriaCheck += 'AND (pc_95_options_95_selected:\"' + valueID + '\")';
            } else {
              criteriaCheck += 'AND (pc_95_options_95_rejected:\"' + valueID + '\")';
            }
          }
        }
        // var variantName = this._dictionaryUtil.getDetails(variantID).name;
        // if (this._searchCriteria[variantID]) {
        //   var valueIDs = UWA.is(this._searchCriteria[variantID], 'array')? this._searchCriteria[variantID] : [this._searchCriteria[variantID]];
        //   valueIDs.forEach((item) => {
        //     var valueName = this._dictionaryUtil.getDetails(item).name;
        //     criteriaCheck += 'AND (pc_95_feature_95_options:\"'+ variantName + ':' + valueName + '\")';
        //   });
        // }
      }

      return typeCheck + parentCheck + selectionModeCheck + criteriaCheck;
    };

    pCDataUtil.prototype._refinePCList = async function (force) {
      this._chosenCriteria = this._getChosenCriteria();
      this._isloadingPC = true;
      if(force) {
        this._matchingPCs = {};
        if(Object.keys(this._searchCriteria).length != 0) {
          await this.fetchMatchingPCs();
        }
      }
      var filteredPC = this._filterMatchingPCs();
      this._modelEvents.publish({event : 'pc-matching-pcs-count-update', data : filteredPC.length});
      this._isloadingPC = false;
    };

    pCDataUtil.prototype._filterMatchingPCs = function () {

      var updateMatchingPC = (selection, pcList, selectionType) => {
        var filteredPC = [];
        if(pcList.length > 0)
        {
            filteredPC = pcList.filter((id) => {
                if(this._pcDetails.hasOwnProperty(id)) {
                  var isMatched = false;
                  if(this._pcDetails[id][selectionType]/*.selections*/) {
                    var parent = this._dictionaryUtil.getParent(selection.id);
                    if(this._pcDetails[id][selectionType]/*.selections*/.hasOwnProperty(parent)) {
                      var value = this._pcDetails[id][selectionType]/*.selections*/[parent];
                      if(UWA.is(value,'array')) {
                        isMatched = value.indexOf(selection.id) != -1;
                      } else {
                        isMatched = value == selection.id;
                      }
                      this._matchingPCs[id] = isMatched;
                      return isMatched;
                    }
                  }
                }
                this._matchingPCs[id] = false;
                return false;
            });

        }
        return filteredPC;
      };
      var pcList = Object.keys(this._matchingPCs);
      for (var criteriaId in this._chosenCriteria) {

        var criteria = this._chosenCriteria[criteriaId];


        for (var valueId in criteria) {
          if (criteria.hasOwnProperty(valueId)) {
            pcList = updateMatchingPC({id: valueId , state: this._configModel.getStateWithId(valueId), }, pcList, criteria[valueId] ? 'selections' : 'rejections');
          }
        }

        if(pcList.length == 0) {
          break;
        }

        // for (var i = 0; i < Object.keys(value); i++) {
        //   pcList = updateMatchingPC({id: value[i], state: this._configModel.getStateWithId(value[i]), }, pcList, 'selections');
        //   if(pcList.length == 0) {
        //     break;
        //   }
        // }
        // if(pcList.length > 0) {
        //   value = this._chosenCriteria[criteriaId].rejections;
        //   if(!UWA.is(value, 'array')) {
        //     value = [value];
        //   }
        //
        //   for (var i = 0; i < value.length; i++) {
        //     pcList = updateMatchingPC({id: value[i], state: this._configModel.getStateWithId(value[i])}, pcList, 'rejections');
        //     if(pcList.length == 0) {
        //       break;
        //     }
        //   }
        // }

      }
      return pcList;
    };

    pCDataUtil.prototype.getMatchingPCs = function () {
      var pcList = [];
      for (var id in this._matchingPCs) {
        if(this._matchingPCs[id] == false) {
          continue;
        }
        if (this._pcDetails.hasOwnProperty(id)) {
          pcList.push(this._pcDetails[id]);
        }
      }
      return pcList;
    };

    pCDataUtil.prototype.loadPCDetails = function (pcList) {
      if(UWA.is(pcList, 'array')) {
        var pcListToLoad = [];
        pcList.forEach((item) => {
          if (!this._pcDetails.hasOwnProperty(item) || !this._pcDetails[item].hasOwnProperty('states')) {
            pcListToLoad.push(item);
          }
        });
        this.fetchPCDetails(pcListToLoad);
      }
    };

    pCDataUtil.prototype.fetchPCDetails = function (pcList) {
      pcList.forEach((id) => {
        var data = {"id": id,"filerRejected": false};
        this._getDetailsCall(id).then(() => {
          this._modelEvents.publish({event : 'pc-refresh-pc-content', data: id});
        });
      });

      return true;
    };

    pCDataUtil.prototype._getDetailsCall = function (id) {
      var url = '/resources/v1/modeler/dspfl/invoke/dspfl:getCriteriaConfigurationInstances';
      var data = {"id": id, "filerRejected": false};
      return ServiceUtil.performServiceRequest(url, data, id).then(output => {
        if(output && UWA.is(output.member, 'array')) {
          if (this._pcDetails.hasOwnProperty(id)) {
            var states = {};
            var values = {};
            output.member.forEach((criteria) => {
              if(criteria.status) {
                states[criteria.id] = STATES.hasOwnProperty(criteria.status) ? STATES[criteria.status] : criteria.status;
              } else if(criteria.value) {
                values[criteria.id] = criteria.value;
              }
            });
            this._pcDetails[id].states = states;
            this._pcDetails[id].values = values;
          }
        }
      });
    };

    pCDataUtil.prototype._getInfoCall = function (id) {
      var url = UWA.String.format('/resources/v1/modeler/dspfl/dspfl:ModelVersion/{0}/dspfl:ProductConfiguration/{1}', this._configModel._modelID, id);
      var data = {};
      return ServiceUtil.performServiceRequest(url, data, 'pc'+ id, { method: 'GET', data : ''} ).then(output => {
        if(output && UWA.is(output.member, 'array') && output.member.length == 1) {
          if (this._pcDetails.hasOwnProperty(id)) {
            var evalMode = output.member[0].evalMode;
            var rulesMode = (evalMode === "CompleteConfiguration") ? 'RulesMode_SelectCompleteConfiguration' : ((evalMode === "Dependencies") ? 'RulesMode_EnforceRequiredOptions' : 'RulesMode_DisableIncompatibleOptions');
            this._pcDetails[id].rulesMode = rulesMode;
          }
        }
      });
    };

    pCDataUtil.prototype._getChosenValue = function (id) {
      var chosenValue;
      var values = this._dictionaryUtil.getValues(id);

      for (var j = 0; j < values.length; j++) {
        var state = this._configModel.getStateWithId(values[j]);
        if(this.isDismissValue(id)) {
          if(state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible ){
            if(!chosenValue)
            {
              chosenValue = {};
            }
            chosenValue[values[j]] = false;
          }
        } else {
          if(state == ConfiguratorVariables.Chosen ||
            state == ConfiguratorVariables.Default ||
            state == ConfiguratorVariables.Selected ||
            state == ConfiguratorVariables.Required) {
              if(!chosenValue)
              {
                chosenValue = {};
              }
              chosenValue[values[j]] = true;
          } else if(state == ConfiguratorVariables.Dismissed){
            if(!chosenValue)
            {
              chosenValue = {};
            }
            chosenValue[values[j]] = false;
          }
        }
      }

      return chosenValue;
    };

    pCDataUtil.prototype._getChosenCriteria = function (count, includeIds) {
      var chosenCriteria = {};
      var num = 0;
      var criteriaIds = this._dictionaryUtil.getAllCriteria();

      if(includeIds) {
        includeIds.forEach((item) => {
          var chosenValue = this._getChosenValue(item);
          if(chosenValue) {
            if(!chosenCriteria[item]) {
              chosenCriteria[item] = {};
            }
            for (var valueId in chosenValue) {
              if (chosenValue.hasOwnProperty(valueId)) {
                chosenCriteria[item][valueId] = chosenValue[valueId];
              }
            }
            // chosenCriteria[item][chosenValue] = true;

            // else {
            //   chosenCriteria[item].selections = chosenValue;
            // }
            // chosenCriteria[item] = chosenValue;
            num++;
          }
        });
      }

      for (var i = 0; i < criteriaIds.length; i++) {
        if(count && num == count) {
          break;
        }
        if(includeIds && includeIds.indexOf(criteriaIds[i]) > -1) {
          continue;
        }
        var chosenValue = this._getChosenValue(criteriaIds[i]);

        if(chosenValue) {
          // chosenCriteria[criteriaIds[i]] = chosenValue;

          if(!chosenCriteria[criteriaIds[i]]) {
            chosenCriteria[criteriaIds[i]] = {};
          }
          for (var valueId in chosenValue) {
            if (chosenValue.hasOwnProperty(valueId)) {
              chosenCriteria[criteriaIds[i]][valueId] = chosenValue[valueId];
            }
          }

          // chosenCriteria[criteriaIds[i]][chosenValue] = true;

          //
          // if(!chosenCriteria[criteriaIds[i]]) {
          //   chosenCriteria[criteriaIds[i]] = {selections : chosenValue };
          // } else {
          //   chosenCriteria[criteriaIds[i]].selections = chosenValue;
          // }
          num++;
        }
      }

      return chosenCriteria;
    };

    pCDataUtil.prototype._checkMatchingCriteriaChange = function () {
      var hasChanged = false;
      var oldSearchKeys = Object.keys(this._searchCriteria);
      var searchCriteria;
      searchCriteria = this._getChosenCriteria(2, oldSearchKeys);
      if(this._searchSelectionMode !== this._configModel.getSelectionMode()) {
        this._searchSelectionMode = this._configModel.getSelectionMode();
        if(oldSearchKeys.length === 0) {
          this._searchCriteria = searchCriteria;
        }
        return true;
      }

      if(searchCriteria) {
        var searchKeys = Object.keys(searchCriteria);
        if(searchKeys.length != oldSearchKeys.length) {
          hasChanged = true;
        } else {
          for (var i = 0; i < searchKeys.length; i++) {
            // TODO: check change in criteria
            if(!this._searchCriteria.hasOwnProperty(searchKeys[i]) || !UWA.equals(searchCriteria[searchKeys[i]], this._searchCriteria[searchKeys[i]])) {
              hasChanged = true;
              break;
            }
          }
        }
        if(hasChanged) {
          this._searchCriteria = searchCriteria;
        }
      }
      return hasChanged;
    };

    pCDataUtil.prototype.applyPCSelections = async function (pcId) {
      var configurations = await this._getConfiguration(pcId);
      this._configModel.setConfigurationCriteria(configurations, "", "", true);
      this._configModel.resetFeaturesSelectionMode();
      this._modelEvents.publish({event : "OnConfigurationModeChange" , data : {mode : this._configModel.getSelectionMode()}});
    };

    pCDataUtil.prototype._getConfiguration = async function (pcId) {
        var configurations = [];
        if (this._pcDetails.hasOwnProperty(pcId)) {
            if (!this._pcDetails[pcId].states) {
                await this._getDetailsCall(pcId);
            }
            if (!this._pcDetails[pcId].rulesMode) {
                await this._getInfoCall(pcId);
            }

            if (this._pcDetails[pcId].states) {
                for (var id in this._pcDetails[pcId].states) {
                    if (this._pcDetails[pcId].states[id] == ConfiguratorVariables.Chosen ||
                        this._pcDetails[pcId].states[id] == ConfiguratorVariables.Dismissed) {
                        configurations.push({ Id: id, State: this._pcDetails[pcId].states[id] });
                    }
                }
            }
            if (this._pcDetails[pcId].values) {
                for (var paramId in this._pcDetails[pcId].values) {
                    configurations.push({ Id: paramId, Value: this._pcDetails[pcId].values[paramId] });
                }
            }
            if(this._configModel.getRulesMode() !== this._pcDetails[pcId].rulesMode) {
              this._modelEvents.publish({event : 'pc-notification-different-ruleMode'});
            }
        }
        return configurations;
    };

    pCDataUtil.prototype._getPCConfiguration = async function (pcId) {
        var configurations = [];
        if (this._pcDetails.hasOwnProperty(pcId)) {
            if (!this._pcDetails[pcId].states) {
                await this._getDetailsCall(pcId);
            }

            if (this._pcDetails[pcId].states) {
                for (var id in this._pcDetails[pcId].states) {
                    if (this._pcDetails[pcId].states[id] == ConfiguratorVariables.Chosen ||
                        this._pcDetails[pcId].states[id] == ConfiguratorVariables.Dismissed) {
                        configurations.push({ Id: id, State: this._pcDetails[pcId].states[id] });
                    }
                }
            }
            if (this._pcDetails[pcId].values) {
                for (var paramId in this._pcDetails[pcId].values) {
                    configurations.push({ Id: paramId, Value: this._pcDetails[pcId].values[paramId] });
                }
            }
        }
        return configurations;
    };

    pCDataUtil.prototype.getSelectionValue = function (pcId, criteriaId) {
      var selectedValues ;
      if(this._pcDetails && this._pcDetails.hasOwnProperty(pcId)) {
        if(this._pcDetails[pcId].selections || this._pcDetails[pcId].rejections){
          ['selections', 'rejections'].forEach((selectType) => {
            if(this._pcDetails[pcId][selectType] && this._pcDetails[pcId][selectType].hasOwnProperty(criteriaId)) {
              var values = this._pcDetails[pcId][selectType][criteriaId];
              if(UWA.is(values, 'array')) {
                selectedValues = values.map((item) => {
                  var valueDetails = this._dictionaryUtil.getDetails(item);
                  var icon = '';
                  if(this._pcDetails[pcId].states && this._pcDetails[pcId].states.hasOwnProperty(valueDetails.id)) {
                    var state = this._pcDetails[pcId].states[valueDetails.id];
                    icon = STATE_ICONS[state];
                  } else if(selectType == 'rejections') {
                    icon = STATE_ICONS[ConfiguratorVariables.Dismissed];
                  }

                  return {
                    title : valueDetails.title,
                    label : valueDetails.title,
                    image: valueDetails.image,
                    icon : icon
                  };
                });
              } else {
                var valueDetails = this._dictionaryUtil.getDetails(values);
                var icon = '';
                if(this._pcDetails[pcId].states && this._pcDetails[pcId].states.hasOwnProperty(valueDetails.id)) {
                  var state = this._pcDetails[pcId].states[valueDetails.id];
                  icon = STATE_ICONS[state];
                } else if(selectType == 'rejections') {
                  icon = STATE_ICONS[ConfiguratorVariables.Dismissed];
                }
                selectedValues = {
                  title : valueDetails.title,
                  label : valueDetails.title,
                  image: valueDetails.image,
                  icon : icon
                };
              }
            }
          });
        } else if(this._pcDetails[pcId].values && this._pcDetails[pcId].values.hasOwnProperty(criteriaId)) {
          return this._pcDetails[pcId].values[criteriaId];
        }
      }
      return selectedValues;
    };

    pCDataUtil.prototype.getPCDetails = function (pcId) {
      var pcDetails = {
        id: pcId
      };
      if(this._pcDetails && this._pcDetails.hasOwnProperty(pcId)) {
        pcDetails.name = this._pcDetails[pcId].title;
        pcDetails.version = this._pcDetails[pcId].version;
      }
      return pcDetails;
    };

    pCDataUtil.prototype.setDiagnosedCriteria = function (id, isDiagnosed) {
      this._diagnosedCriteria[id] = isDiagnosed;
    };

    pCDataUtil.prototype.setConfigCriteriaUpdated = function (isUpdated) {
      if(isUpdated) {
        this._diagnosedCriteria = {};
      }
    };

    pCDataUtil.prototype._getDisplayOption = function(id) {
        var model = this._configModel;
        var feature = model.getDictionary().features.find(feature => feature.ruleId === id);
        var displayOption = '';
        if(feature && feature.type === 'Parameter') {
          var unit = feature.unit;
          displayOption = model.getValueWithId(id).NumericalValue + (unit ? ' ' + nlsUnitLabelLongKeys[unit]  : "");
        }else {
          displayOption = model.getOptionDisplayNameWithId(id);
        }
        return displayOption;
    };


    pCDataUtil.prototype._getConflictingMessage = function(id) {
        var addAlso, 
            that = this,        
            message = this._getDisplayOption(id) + " " + UWA.i18n("is conflicting with") + " : ",
            listOfListOfConflictingIds = this._configModel.getConflictingFeatures();

        //var listOfListOfRulesImplied = model.getImpliedRules();
        //need to traverse the list again, to generate the text for tooltip

         listOfListOfConflictingIds.every( (ConflictingId) => {
            // If Parent Base Configuration in the list, break with dedicate message
            if (ConflictingId === this._configModel._bcId) {
              message = this._getDisplayOption(id) + " " + UWA.i18n("is conflicting with Base Configuration");   
              return false;          
            }
            if (ConflictingId !== id) {
                if (addAlso) message += UWA.i18n("and also conflicting with") + " ";                
                message +=  this._configModel.getFeatureDisplayNameWithId(ConflictingId) + "[" + that._getDisplayOption(ConflictingId) + "]";
                addAlso = true;                
            }
            return true;
        });
        // Display conflict causing rules in Model Definition side Panel
        this._modelEvents.publish({ event :'RequestPCCausingRules', data : {objectId : id, isConflicting: true}});
        return message;
    };




    pCDataUtil.prototype._getReasonMessage = function(id) {
          var message =  nlsConfiguratorKeys.get("Loading"),
          that = this;
          var promise = new Promise((resolve) => {
            that._modelEvents.subscribeOnce({ 'event' : 'getResultingStatusOriginators_SolverAnswer' }, function (data) {
              if(data) {
                  var causingAssumptions = data.causingAssumptions ? data.causingAssumptions : [];
                  var model = that._configModel;
                  var displayOption = that._getDisplayOption(id);
                  var state = model.getStateWithId(id);


                  var rc = data.answerRC;

                  message = '';

                  if (causingAssumptions.length === 0) {
                          if (rc !== ConfiguratorVariables.str_ERROR) {
                                  message = displayOption + " "  + UWA.i18n("is") + " " + UWA.i18n(state);
                          }
                  } else {
                          var msgStr1 = UWA.i18n("#OPTION# is #STATUS# because");
                          msgStr1 = msgStr1.replace("#OPTION#", displayOption);
                          msgStr1 = msgStr1.replace("#STATUS#", UWA.i18n(state));
                          message = msgStr1;

                          for (var i = 0; i < causingAssumptions.length; i++) {

                                  if (i > 0)
                                          message += " " + UWA.i18n("and because") + " ";

                                  state = model.getStateWithId(causingAssumptions[i]);
                                  var msgStr2 = UWA.i18n("#OPTION# is #STATUS#");
                                  msgStr2 = msgStr2.replace("#OPTION#", model.getFeatureDisplayNameWithId(causingAssumptions[i]) + "[" + that._getDisplayOption(causingAssumptions[i]) + "]");
                                  msgStr2 = msgStr2.replace("#STATUS#", UWA.i18n(state));
                                  message += " " + msgStr2 ;

                          }
                  }

                  if (rc === ConfiguratorVariables.str_ERROR) {
                          message += UWA.i18n("InfoComputationAborted");
                  }
                  // currentNode.getModelEvents().publish({ 'event' : 'state-message-update', data : message });
                  resolve(message);
                  //
              }
          });
          } );


          this._modelEvents.publish({ 'event' :'SolverFct_getResultingStatusOriginators', data : {value : id}});
          // Display conflict causing rules in Model Definition side Panel
          this._modelEvents.publish({ event :'RequestPCCausingRules', data : {objectId : id, isConflicting: false}});

          return promise;
      };



		return pCDataUtil;
	}

);

define('DS/ConfiguratorPanel/scripts/Presenters/NumericalSelectionEditor',
  [
      'DS/Controls/Abstract',
      'DS/Utilities/Utils',
      'DS/Utilities/Dom',
      'DS/Utilities/Object',
      'DS/TreeModel/TreeDocument',
      'DS/TreeModel/TreeNodeModel',
      'DS/Controls/Button',
      'DS/Controls/Popup',
      'DS/Controls/SpinBox',
      'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
      'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong.json',
      'css!DS/ConfiguratorPanel/css/CriteriaSelectionEditor.css'
    ], function(Abstract, Utils, Dom, ObjectUtils, TreeDocument, TreeNodeModel, Button, Popup, SpinBox, ConfiguratorVariables, xUnitLabelLong) {

    'use strict';

    //build Criteria Selection Editor
    var CriteriaSelectionEditor = Abstract.inherit({

        name: 'numerical-selection-editor',

        publishedProperties: {
          value : {
            defaultValue: null,
            type: 'int'
          },
          minValue : {
            defaultValue:null,
            type: 'number'
          },
          maxValue : {
            defaultValue:null,
            type: 'number'
          },
          units : {
            defaultValue:'',
            type: 'string'
          },
          state : {
            defaultValue:'',
            type: 'string'
          },
          isConflicting : {
            defaultValue:false,
            type: 'boolean'
          },
          referenceValue: {
            defaultValue: undefined,
            type: 'int'
          },
          context: {
            defaultValue: null,
            type: 'string'
          }

        },

        buildView : function () {
          this._isBuilding = true;
          this._availableValuesDocument = new TreeDocument({
            shouldBeSelected: function (nodeModel) {
                return nodeModel.options.isSelectable;
            }
          });
          this._possibleValueNodeMap = {};
          this._possibleValueDetails = {};
          this._spinBox = new SpinBox({
            stepValue:1,
            pageStepValue:1,
            decimals: 0,
            highExponentProperty: 20
          });
          this._spinBox._applyMinValue = function () {};
          this._spinBox._applyMaxValue = function () {};

          this._valueContainer = UWA.createElement('div', {
            'class' : 'value-container'
          });

          this._actionButtonsLeft = UWA.createElement('span', {
            'class' : 'action-button-left'
          });

          this._actionButtonsRight = UWA.createElement('span', {
            'class' : 'action-button-right'
          });

          this._conflictAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "rule-status-conflict", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });

          this._conflictAction.inject(this._actionButtonsLeft);


          this._requiredAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "rule-status-required", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });

          this._requiredAction.inject(this._actionButtonsLeft);


          
          this._defaultAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "rule-status-default", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });
          this._defaultAction.inject(this._actionButtonsLeft);
          

          this._stateContent = UWA.createElement('span', {
            styles : {
              display: 'inline-block',
              padding: '0px 5px'
            }
          });

          this._cancelContent = UWA.createElement('span', {
            'class' : 'clear-action-content'
          });
          this._cancelAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "wrong", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });

          this._cancelAction.inject(this._actionButtonsRight);




          this._validateAction = new Button({
            showLabelFlag : false,
            icon: { iconName: "check", fontIconFamily: WUXManagedFontIcons.Font3DS },
            displayStyle: 'lite'
          });
          this._validateAction.inject(this._actionButtonsRight);

          this._tooltip = new Popup({trigger: 'escape', autoHide : false, mouseRelativePosition: true  });
          this._tooltip.setBody('Loading..');
          this._tooltip.getContent().addClassName('cfg-custom-popup');

          this._valueContainer.setContent(this._actionButtonsLeft);
          this._valueContainer.addContent(this._stateContent);
          this._valueContainer.addContent(this._spinBox.getContent());
          this._valueContainer.addContent(this._actionButtonsRight);
        },

        _postBuildView: function() {
          this.getContent().addClassName('criteria-selection-editor').addClassName('numerical-selection-editor');
          this.getContent().setContent(this._valueContainer);
        },

        handleEvents: function() {

          var that = this;


          Dom.addEventOnElement(this, this._conflictAction, 'buttonclick', function (e) {
            e.stopPropagation();
            that._tooltip.target = e.target;
            that._tooltip.offset = e.target.getOffsets();
            that._tooltip.show();
            that.fire('show-state-tooltip', {value : that.context, id : that.context});
          });

          Dom.addEventOnElement(this, this._requiredAction, 'buttonclick', function (e) {
            e.stopPropagation();
            that._tooltip.target = e.target;
            that._tooltip.offset = e.target.getOffsets();
            that._tooltip.show();
            that.fire('show-state-tooltip', {value : that.context, id : that.context});
          });

          Dom.addEventOnElement(this, this._defaultAction, 'buttonclick', function (e) {
            e.stopPropagation();
            that._tooltip.target = e.target;
            that._tooltip.offset = e.target.getOffsets();
            that._tooltip.show();
            that.fire('show-status-originator', {value : that.context, id : that.context});
          });

          Dom.addEventOnElement(this, this._cancelAction, 'buttonclick', function (e) {
              e.stopPropagation();
              that.fire('reject-numericalvalue', {value : that.value, id : that.context});
              that.state = 'Unselected';
              that._spinBox.value = undefined;
          });

          Dom.addEventOnElement(this, this._validateAction, 'buttonclick', function (e) {
              e.stopPropagation();
              that.fire('validate-numericalvalue', {value : that.value, id : that.context});

          });

          that.getContent().addEventListener('click', function (e) {
            if(e.target.hasClassName('wux-chip-cell-label')) {
              var value = that.value;
              if(!UWA.is(value, 'array')) {
                value = [value];
              }
              value.forEach((item, i) => {
                if(that._possibleValueDetails[item].title == e.target.textContent) {
                  if(e.target.offsetWidth - e.offsetX < 24) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if(that._possibleValueDetails[item].validate) {
                      that.fire('validate-numericalvalue', {value : item, id : that.context});
                    }
                  }
                  if(e.offsetX < 20) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    that._tooltip.target = e.target;
                    that._tooltip.offset = {x: e.x, y:e.y};
                    that._tooltip.show();
                    that.fire('show-state-tooltip', {value : item, id : that.context});
                  }
                }
              });
            } else if(!that.multiValue && e.target.tagName == 'SPAN') {
              if(that._possibleValueDetails.hasOwnProperty(that.value)) {
                var state = that._possibleValueDetails[that.value].state;
                if(state && e.target.className.contains(state)) {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  that._tooltip.target = e.target;
                  that._tooltip.offset = {x: e.x, y:e.y};
                  that._tooltip.show();
                  that.fire('show-state-tooltip', {value : that.value, id : that.context});
                }
              }

            }
          }, true);

          that.getContent().addEventListener('focusout', function (e) {
            if(that._tooltip.visibleFlag) {
              that._tooltip.hide();
            }
          });

          that._spinBox.addEventListener('change', function(){
            // update model value
            that.getModel().value = that._spinBox.value;
          });

        },

        cleanContent : function () {
            if(this.isActive && !this.asyncLoad) {
            //  this._autoComplete.elements.popup.visibleFlag = false;
            }
        },

        _applyValue : function (oldValue, value) {
          //this._spinBox.value = this.value;
        },

        _applyMinValue: function (oldValue, value) {
          //this._spinBox.value = this.value;
        },

        _applyMaxValue: function (oldValue, value) {
          //this._spinBox.value = this.value;
        },

        _applyContentType : function (oldValue, value) {
          this.getContent().setContent(this._valueContainer);
        },


        _getChipInfo : function (nodeModel) {
          var className = 'criteria-chip-image';
          className += nodeModel.getAttributeValue('conflict') ? ' criteria-chip-rule-status-conflict' : '';
          className += nodeModel.getAttributeValue('state') ? ' criteria-chip-'+ nodeModel.getAttributeValue('state') : '';
          className += nodeModel.getAttributeValue('rejectable') == false ? ' criteria-chip-no-close' : '';
          className += nodeModel.getAttributeValue('validate') ?  ' criteria-chip-validate' : '';
          return {
            label : nodeModel.getAttributeValue('title'),
            icon : {
              iconPath: nodeModel.getAttributeValue('image'),
              className: className
            }
          };
        },

        _applyStateIcon : function (oldValue, value) {
          if(this.stateIcon) {
            this._stateContent.show();
            this._stateContent.setContent(Dom.generateIcon({
              iconName: this.stateIcon
            }));
          } else {
            this._stateContent.hide();
          }
        },

        _applyHasConflict : function (oldValue, value) {
          if(this.isConflicting === true) {
            this._conflictAction.show();
          } else {
            this._conflictAction.hide();
          }
        },

        _applyRejectAction : function (oldValue, value) {
          if(this.state === ConfiguratorVariables.Chosen ) {
            this._cancelAction.show();
          } else {
            this._cancelAction.hide();
          }
        },
        _applyValidationAction : function (oldValue, value) {
          if(this.state === ConfiguratorVariables.Selected ||this.state === ConfiguratorVariables.Required ) {
            this._validateAction.show();
          } else {
            this._validateAction.hide();
          }
        },

        _applyRequiredAction : function (oldValue, value) {
          if(this.state === ConfiguratorVariables.Required ) {
            this._requiredAction.show();
          } else {
            this._requiredAction.hide();
          }
        },

         _applyDefaultAction : function (oldValue, value) {
          if(this.state === ConfiguratorVariables.Default ) {
            this._defaultAction.show();
          } else {
            this._defaultAction.hide();
          }
        },

        updateTooltipMessage : function (message) {
          this._tooltip.setBody(message);
        },

        _applyProperties: function(oldValues) {
          this._isBuilding = true;
          this._parent(oldValues);
          if (this.isDirty('contentType')) {
            this._applyContentType(oldValues.contentType);
          }
         /* if (this.isDirty('stateIcon')) {
            this._applyStateIcon(oldValues.stateIcon);
          }*/

          if (this.isDirty('state')) {
            this._applyRequiredAction(oldValues.rejectAction);
            this._applyRejectAction(oldValues.rejectAction);
            this._applyValidationAction(oldValues.validationAction);
            this._applyDefaultAction(oldValues.validationAction);            
          }

          if(this.isDirty('isConflicting')) {
            this._applyHasConflict(oldValues.hasConflict);
          }

          if (this.isDirty('minValue')) {
            this._spinBox.minValue = this.minValue;
          }

          if (this.isDirty('maxValue')) {
            this._spinBox.maxValue =  this.maxValue;
          }

          if (this.isDirty('value')) {
            this._spinBox.value = this.value;
              this._applyReferenceValue(oldValues.referenceValue);
          }

          if (this.isDirty('units')) {
            this._spinBox.units = xUnitLabelLong[this.units];
          }

          if (this.isDirty('referenceValue')) {
            this._applyReferenceValue(oldValues.referenceValue);
          }

          this._isBuilding = false;
        },
        _applyReferenceValue: function(oldValues) {
          let highlightDiff = false; 
          // If reference column's cell contains values and the compared with column's cell is empty -> highlight cell background
          if (this.referenceValue !== undefined) {
            highlightDiff = true; 
            if (this.referenceValue === this.value) 
              highlightDiff= false; 
          }
          if (highlightDiff && !this.getContent().hasClassName('highlight-background')) {
              this.getContent().addClassName('highlight-background');
          }else if (!highlightDiff && this.getContent().hasClassName('highlight-background')){
              this.getContent().removeClassName('highlight-background');
          }
        }
    });


  	return CriteriaSelectionEditor;
});

define(
    'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectorUtil',
    [
        'DS/ConfiguratorPanel/scripts/Models/DictionaryDataUtil',
        'DS/ConfiguratorPanel/scripts/Models/PCDataUtil',
        'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables'
    ],
    function(DictionaryDataUtil, PCDataUtil, ConfiguratorVariables){
    'use strict';
		var criteriaSelectorUtil =  function(options){
      this._init(options);
    };

    criteriaSelectorUtil.prototype._init = function (options) {
      this._configModel = options.configModel;
      var dictionary = this._configModel.getDictionary();
      this._modelEvents = options.modelEvents;
      // this._dictionaryUtil = new DictionaryDataUtil({ dictionary : dictionary});
      // this._pcDataUtil = new PCDataUtil({ configModel : this._configModel, dictionaryUtil: this._dictionaryUtil, modelEvents: options.modelEvents});

  		this._dictionaryUtil = options.dictionaryDataUtil;
      this._pcDataUtil = options.pCDataUtil;

      this._componentMap = {};
      var that = this;
      this._eventListeners = {
        'select-criteria' : function (e) {
          that.publishEvent({event : 'pc-select-criteria-action', data : e.options});
        },
        'reject-criteria' : function (e) {
          that.publishEvent({event : 'pc-reject-criteria-action', data : e.options});
        },
        'validate-criteria' : function(e) {
          that.publishEvent({event : 'pc-validate-criteria-action', data : e.options});
        },
        'reject-numericalvalue' : function (e) {
          that.publishEvent({event : 'pc-reject-numericalvalue-action', data : e.options});
        },
        'validate-numericalvalue' : function(e) {
          that.publishEvent({event : 'pc-validate-numericalvalue-action', data : e.options});
        },
        'show-criteria' : function (e) {
          that.publishEvent({event : 'pc-diagnose-criteria-action', data : e.options});
        },
        'hide-criteria' : function (e) {
          console.log('On Hide');
        },
        'show-state-tooltip' : function (e) {
          that.publishEvent({event : 'pc-show-criteria-tooltip', data : e.options});
        },
        'update-height' : function (e) {
          that.publishEvent({event : 'pc-update-row-height', data : e.options});
        }
      };

      this._modelEvents.subscribe({event : 'pc-diagnose-criteria-done'}, function (data) {
        if(that._componentMap.hasOwnProperty(data.id)) {
          that._componentMap[data.id].showLoader = false;
        }
      });

    };

    criteriaSelectorUtil.prototype.getProperties = function (id) {
      var possibleValues = this.getPossibleValues(id);
      return {
        contentType : 1,
        multiValue : this._pcDataUtil.isMultiValue(id),
        enableEasySelection :  this._pcDataUtil.isMultiValue(id) || this._configModel.getRulesMode() !== ConfiguratorVariables.RulesMode_SelectCompleteConfiguration,
        possibleValues : possibleValues,
        asyncLoad : this._pcDataUtil.isUpdateRequired(id),
        value : this._pcDataUtil.getSelectedValue(id)
      };
    };

    criteriaSelectorUtil.prototype.getNumericalProperties = function (id) {
      var paramdef = this._configModel.getDictionary().features.find((feature) => id === feature.ruleId);
      var paramvalue = UWA.extend( {
        NumericalValue :  undefined,
        MaxValue: parseInt(paramdef.maxValue),
        MinValue: parseInt(paramdef.minValue)      
      }, this._configModel.getValueWithId(id));
      return {        
        value :  paramvalue.NumericalValue,
        maxValue: paramvalue.MaxValue,
        minValue: paramvalue.MinValue,
        state: this._configModel.getStateWithId(id),
        isConflicting: this._configModel.isConflictingOption(id),
        units:  paramdef.unit
      };
    };

    criteriaSelectorUtil.prototype.getPossibleValues = function (id) {
      var values = this._dictionaryUtil.getValues(id);
      var possibleValues = [];
      values.forEach((item) => {
        possibleValues.push(UWA.merge(
            {
              state : this._pcDataUtil.getState(item),
              selectable : this._pcDataUtil.isSelectable(item),
              rejectable : this._pcDataUtil.hasRejectAction(item),
              validate : this._pcDataUtil.hasValidateAction(item),
              conflict : this._pcDataUtil.hasConflict(item),
            }, this._dictionaryUtil.getDetails(item)));
      });
      return possibleValues;
    };

    criteriaSelectorUtil.prototype.updateComponent = function (component, id) {
      if(this._componentMap[id] && UWA.is(this._componentMap[id].cleanContent, 'function')) {
        this._componentMap[id].cleanContent();
      }
      if(UWA.is(component.cleanContent, 'function')) {
        component.cleanContent();
      }

      var properties = this.getProperties(id);
      component.setProperties(properties);
      for (var eventName in this._eventListeners) {
        if (this._eventListeners.hasOwnProperty(eventName)) {
          component.removeEventListener(eventName, this._eventListeners[eventName]);
          component.addEventListener(eventName, this._eventListeners[eventName]);
        }
      }
      this._componentMap[id] = component;
    };

    criteriaSelectorUtil.prototype.updateNumericalComponent = function (component, id) {
      if(this._componentMap[id] && UWA.is(this._componentMap[id].cleanContent, 'function')) {
        this._componentMap[id].cleanContent();
      }
      if(UWA.is(component.cleanContent, 'function')) {
        component.cleanContent();
      }

      var properties = this.getNumericalProperties(id);
      component.setProperties(properties);
      for (var eventName in this._eventListeners) {
        if (this._eventListeners.hasOwnProperty(eventName)) {
          component.removeEventListener(eventName, this._eventListeners[eventName]);
          component.addEventListener(eventName, this._eventListeners[eventName]);
        }
      }
      this._componentMap[id] = component;
    };

    criteriaSelectorUtil.prototype.updateTooltip = function (id, message) {
      if(this._componentMap.hasOwnProperty(id)) {
        this._componentMap[id].updateTooltipMessage(message);
      }
    };

    criteriaSelectorUtil.prototype.publishEvent = function (options) {
      var that = this;
      setTimeout(function () {
        that._modelEvents.publish(options);
      },10);
    };

		return criteriaSelectorUtil;
	}

);

/*
	FilterExpressionXMLServices.js
	To convert configurator json to xml for binary creation

*/

define('DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServices',
[
	'UWA/Core',
	'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables'
],
function (UWA, ConfiguratorVariables) {
		'use strict';
    function FilterExpressionXMLServices(xmlType)
    {
	    var AppRulesParamObj = {};
	    var AppFuncObj =  {};
	    var DictionaryObj = {};
	    var ConfigCriteriaObj =  {};
	    var XML_FILE_TYPE = {};
	    var EvolutionCriteriaObj = {};
	    var ModelVersionInfoObj = {};
	    var FILTER_SELECTION_MODE = '';
	    var listOfRejectedOptionsForEachSingleFeature = {};     //XF3
	    var listOfRejectedOptionsStateForEachSingleFeature = {};     //XF3
		var listOfRejectedOptionsDNForEachSingleFeature = {};
			var includeDisplayName = true;

	    var XML_TAG_NAMES = {
		    FilterSelection : 'FilterSelection',
		    Context : 'Context',
		    CfgFilterExpression : 'CfgFilterExpression',
		    Feature : 'Feature'
	    };

	    var ATTR_VALUE_MAP = {
		    selectionMode	 : "SelectionMode",
		    selectionMode_Build: "Strict",
		    selectionMode_Refine: "150%"

	    };
	    var ATTRNAMES = ['selectionMode'];
	    var CONFIGURATOR_FIELDS = {
		    ConfigurationCriteria :'configurationCriteria',
		    ApplicationState :'applicationState',
		    AppRulesParam : 'app_RulesParam',
		    AppFunc : 'app_Func',
		    Dictionary : 'dictionary',
		    Rules:'rules',
		    EvolutionCriteria: 'evolutionCriteria',
	        ModelVersionInfo:'modelVersionInfo'
	    };

	    var XML_DECLARE = {
		    Schema : "xmlns:xs",
		    Namespace : "xmlns",
		    SchemaLocation : "xs:schemaLocation"
	    };

	    var FILTER_EXPRESSION = {
		    ROOT : "CfgFilterExpression",
		    TAG1 : "FilterSelection",
		    Schema: "http://www.w3.org/2001/XMLSchema-instance",
		    Namespace : "urn:com:dassault_systemes:config",
		    SchemaLocation : "urn:com:dassault_systemes:config CfgFilterExpression.xsd"
	    };
	    initXMLType();
	    function initXMLType(){
		    if(xmlType == 'FilterExpression')
			    XML_FILE_TYPE = FILTER_EXPRESSION;
	    }
	    function initParamObjects(jsonObj)
	    {
		    AppRulesParamObj = jsonObj[CONFIGURATOR_FIELDS.AppRulesParam];
		    AppFuncObj =  jsonObj[CONFIGURATOR_FIELDS.AppFunc];
		    DictionaryObj = jsonObj[CONFIGURATOR_FIELDS.Dictionary];
		    ConfigCriteriaObj =  jsonObj[CONFIGURATOR_FIELDS.ConfigurationCriteria];
		    EvolutionCriteriaObj = jsonObj[CONFIGURATOR_FIELDS.EvolutionCriteria];
		    FILTER_SELECTION_MODE = AppRulesParamObj['selectionMode'];
		    ModelVersionInfoObj = jsonObj[CONFIGURATOR_FIELDS.ModelVersionInfo];
				includeDisplayName = jsonObj.includeDisplayName;
	    }

	    function getXMLDeclaration()
	    {
		    var initXml = '<?xml version="1.0" encoding="UTF-8"?>';
		    var attrList = [];
		    for(var elem in XML_DECLARE)
		    {
			    attrList.push(elem);
		    }
		    initXml += "<"+ XML_FILE_TYPE.ROOT;
		    if(attrList!=null) {
			    for(var item = 0; item < attrList.length; item++) {
				    var key = attrList[item];
				    var attrName = XML_DECLARE[key];
				    var attrVal = FILTER_EXPRESSION[key];
				    //attrVal=escapeXmlChars(attrVal);
				    initXml+=" "+attrName+"='"+attrVal+"'";
			    }
		    }
		    initXml+=">";
		    return initXml;
	    }

	    function jsonXmlElemCount () {
		    var elementsCnt = 0;
		    for( var it in ConfigCriteriaObj  ) {
			    if(ConfigCriteriaObj[it] instanceof Object)
			    {
			        if (ConfigCriteriaObj[it].State == ConfiguratorVariables.Chosen || ConfigCriteriaObj[it].State == ConfiguratorVariables.Required || ConfigCriteriaObj[it].State == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected ||
					    ConfigCriteriaObj[it].State == ConfiguratorVariables.Dismissed || ConfigCriteriaObj[it].State == ConfiguratorVariables.Incompatible)
						    elementsCnt++;
				    }
			    }

		    return elementsCnt;
	    }
	    function addAttributes(rulesParamObj,element, attrList, closed) {
		    var resultStr = "<"+ element;
				var attrVal;
		    if(attrList!=null) {
			    for(var aidx = 0; aidx < attrList.length; aidx++) {
				    var attrName = attrList[aidx];
				    if(ATTR_VALUE_MAP[attrName] != undefined)
				    {
					    var tAttrName = ATTR_VALUE_MAP[attrName];
					    attrVal = ATTR_VALUE_MAP[rulesParamObj[attrName]];
					    attrVal=escapeXmlChars(attrVal);
					    resultStr+=" "+tAttrName+"='"+attrVal+"'";

				    }else
				    {
					    attrVal = rulesParamObj[attrName];
					    attrVal=escapeXmlChars(attrVal);
					    resultStr+=" "+attrName+"='"+attrVal+"'";
				    }

			    }
		    }
		    if(!closed)
			    resultStr+=">";
		    else
			    resultStr+="/>";
		    return resultStr;
	    }

	    function endTag(elementName) {
		    return "</"+ elementName+">";
	    }

	    function escapeXmlChars(str) {
	    if(typeof(str) == "string")
		    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
	    else
		    return str;
	    }

        //XF3 : If selection and reject are present in the same feature, we cannot add the reject in the XML or it will lead to XML parsing issues
	    /*function checkIfSelectionIsPresentInSameFeature(optionId) {
	        var config_features = DictionaryObj.features;
	        for (var itx in config_features) {
	            var cfElem = config_features[itx];
	            var coElem = cfElem['options'];
	            var optionFound = false;

	            if (coElem instanceof Object) {
	                for (var itr in coElem) {
	                    var coid = coElem[itr].ruleId;

	                    if (coid != undefined && coid.toString().trim() == optionId) {
	                        optionFound = true;
	                        break;
	                    }
	                }

	                if (optionFound) {
	                    for (var itr in coElem) {
	                        var coid = coElem[itr].ruleId;

	                        if (coid != undefined) {
	                            for (var it in ConfigCriteriaObj) {
	                                if (ConfigCriteriaObj[it] instanceof Object) {
	                                    var criteriaId = ConfigCriteriaObj[it].Id;
	                                    var state = ConfigCriteriaObj[it].State;

	                                    if (criteriaId == coid && (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected)) {
	                                        return true;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	        return false;
	    }*/


	    /*function checkLevelOfSelectionsInFeature(optionId) {
	        var selectionLevel = 'NoSelection';
	        var config_features = DictionaryObj.features;

	        for (var itx in config_features) {
	            var cfElem = config_features[itx];
	            var coElem = cfElem['options'];
	            var optionFound = false;

	            if (coElem instanceof Object) {
	                for (var itr in coElem) {
	                    var coid = coElem[itr].ruleId;

	                    if (coid != undefined && coid.toString().trim() == optionId) {
	                        optionFound = true;
	                        break;
	                    }
	                }

	                if (optionFound) {
	                    for (var itr in coElem) {
	                        var coid = coElem[itr].ruleId;

	                        if (coid != undefined) {
	                            for (var it in ConfigCriteriaObj) {
	                                if (ConfigCriteriaObj[it] instanceof Object) {
	                                    var criteriaId = ConfigCriteriaObj[it].Id;
	                                    var state = ConfigCriteriaObj[it].State;

	                                    if (criteriaId == coid) {
	                                        if (state == ConfiguratorVariables.Chosen) {
	                                            if (selectionLevel == 'NoSelection' || selectionLevel == 'ruleSelection') {
	                                                selectionLevel = 'userSelection';
	                                            }
	                                            else if (selectionLevel == 'userReject' || selectionLevel == 'userRejectAndRuleSelection') {
	                                                selectionLevel = 'userSelectionAndUserReject';
	                                            }
	                                            else if (selectionLevel == 'ruleReject' || selectionLevel == 'ruleSelectionAndRuleReject') {
	                                                selectionLevel = 'userSelectionAndRuleReject';
	                                            }
	                                        }
	                                        else if (state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || state == ConfiguratorVariables.Selected) {
	                                            if (selectionLevel == 'NoSelection') {
	                                                selectionLevel = 'ruleSelection';
	                                            }
	                                            else if (selectionLevel == 'userReject') {
	                                                selectionLevel = 'userRejectAndRuleSelection';
	                                            }
	                                            else if (selectionLevel == 'ruleReject') {
	                                                selectionLevel = 'ruleSelectionAndRuleReject';
	                                            }
	                                        }
	                                        else if (state == ConfiguratorVariables.Dismissed) {
	                                            if (selectionLevel == 'NoSelection' || selectionLevel == 'ruleReject') {
	                                                selectionLevel = 'userReject';
	                                            }
	                                            else if (selectionLevel == 'userSelection' || selectionLevel == 'userSelectionAndRuleReject') {
	                                                selectionLevel = 'userSelectionAndUserReject';
	                                            }
	                                            else if (selectionLevel == 'ruleSelection' || selectionLevel == 'ruleSelectionAndRuleReject') {
	                                                selectionLevel = 'userRejectAndRuleSelection';
	                                            }
	                                        }
	                                        else if (state == ConfiguratorVariables.Incompatible) {
	                                            if (selectionLevel == 'NoSelection') {
	                                                selectionLevel = 'ruleReject';
	                                            }
	                                            else if (selectionLevel == 'userSelection') {
	                                                selectionLevel = 'userSelectionAndRuleReject';
	                                            }
	                                            else if (selectionLevel == 'ruleSelection') {
	                                                selectionLevel = 'ruleSelectionAndRuleReject';
	                                            }
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	        return selectionLevel;
	    }
*/

        //End XF3

	    function generateFilterXML (options){
		    var result = "";
		    result += getXMLDeclaration();
		    result += addAttributes(AppRulesParamObj,XML_FILE_TYPE.TAG1,ATTRNAMES,false);
		    var elementsCnt = jsonXmlElemCount();

	        if (ModelVersionInfoObj != undefined)
		        result += getProdStateXML();

				var isStrictMode = false;
				if(AppRulesParamObj.selectionMode === ConfiguratorVariables.selectionMode_Build) {
					isStrictMode = true;
				}
		    if (elementsCnt > 0) {
//		        result += addContext(DictionaryObj.model.label); // Removing optional context because it does not support empty selection (temporary?)
		        //if (EvolutionCriteriaObj != undefined)
		          //  result += getProdStateXML();
				  options.configModel._dictionaryJson.features.forEach(feature => {
					  if(options.configModel.getFeatureSelectionMode(feature) === 'Dismiss' && options.configModel.hasDismissedOptions(feature, true)) {						
						result += addFeatureOptions(feature, options.configModel, true);						
					  }else if( options.configModel.hasChosenOptions(feature, true))  {
						result += addFeatureOptions(feature, options.configModel, false);
					  }
					/*if (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected) {
						result += addFeatureOption(criteriaId, false, state);
					} else if (!isStrictMode && (state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible)) { // not adding rejected values in strict mode
										if(options && options.configModel){
											var featureID = options.configModel.getFeatureIdWithOptionId(criteriaId);
											if(featureID && options.configModel.getFeatureSelectionMode(featureID) === 'Dismiss'){													
												result += addFeatureOption(criteriaId, true, state);													
											}
										}
					}*/

				  });
		       /* for (var it in ConfigCriteriaObj) {
		            if (ConfigCriteriaObj[it] instanceof Object) {
		                var criteriaId = ConfigCriteriaObj[it].Id;
		                var state = ConfigCriteriaObj[it].State;

		                /*if (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected) {
		                    result += addFeatureOption(criteriaId, false, state);
		                } else if (state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible) {
		                    if (!checkIfSelectionIsPresentInSameFeature(criteriaId)) {
		                        result += addFeatureOption(criteriaId, true, state);
		                    }
		                }

						if (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected) {
		                        result += addFeatureOption(criteriaId, false, state);
		                } else if (!isStrictMode && (state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible)) { // not adding rejected values in strict mode
											if(options && options.configModel){
												var featureID = options.configModel.getFeatureIdWithOptionId(criteriaId);
												if(featureID && options.configModel.getFeatureSelectionMode(featureID) === 'Dismiss'){													
													result += addFeatureOption(criteriaId, true, state);													
												}
											}
		                }

		                // var selectionlevel = checkLevelOfSelectionsInFeature(criteriaId);
										//
		                // if (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected) {
		                //     if (selectionlevel == 'userSelection' || selectionlevel == 'userSelectionAndUserReject' || selectionlevel == 'userSelectionAndRuleReject' || selectionlevel == 'ruleSelection' || selectionlevel == 'ruleSelectionAndRuleReject' || selectionlevel == 'userRejectAndRuleSelection') {
		                //         result += addFeatureOption(criteriaId, false, state);
		                //     }
		                // } else if (state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible) {
		                //     if (selectionlevel == 'userReject' || selectionlevel == 'ruleReject') {
		                //         result += addFeatureOption(criteriaId, true, state);
		                // }
		                // }
		            }*/
		        }
//		        result += endTag('Context');
		    

		    var empty = true;

		    for (var prop in listOfRejectedOptionsForEachSingleFeature) {
		        if (listOfRejectedOptionsForEachSingleFeature.hasOwnProperty(prop))
		            empty = false;
		    }

		    if (!empty)
		        result += addListOfRejectedOptionsForSingleFeaturesInTheXML();

			    result += endTag(XML_FILE_TYPE.TAG1);
			    result += endTag(XML_FILE_TYPE.ROOT);
			    return result;

	    }
	    function getProdStateXML()
	    {
	        var prodStateXml = '';

	        if (ModelVersionInfoObj.modelName && ModelVersionInfoObj.modelVersionName && ModelVersionInfoObj.modelVersionRevision) {
	            var prodName = ModelVersionInfoObj.modelVersionName;
	            var prodRevsion = ModelVersionInfoObj.modelVersionRevision;
	            var modelName = ModelVersionInfoObj.modelName;

	            prodStateXml += '<TreeSeries Type="ProductState" Name="' + escapeXmlChars(modelName) + '">';
	            prodStateXml += '<Single Name="' + escapeXmlChars(prodName) + '" Revision="' + escapeXmlChars(prodRevsion) + '" />';
	            prodStateXml += '</TreeSeries>';
	        }

		    return prodStateXml;
	    }

        //XF3
	    function addOptionToTheListOfRejectedOptionsForSingleFeatures(cfid, coName, coDisplayName, optionState) {
	        if (listOfRejectedOptionsForEachSingleFeature[cfid] == undefined)
	            listOfRejectedOptionsForEachSingleFeature[cfid] = [];

	        if (listOfRejectedOptionsStateForEachSingleFeature[cfid] == undefined)
	            listOfRejectedOptionsStateForEachSingleFeature[cfid] = [];

			if (listOfRejectedOptionsDNForEachSingleFeature[cfid] == undefined)
	            listOfRejectedOptionsDNForEachSingleFeature[cfid] = [];


	        listOfRejectedOptionsForEachSingleFeature[cfid].push(coName);
			listOfRejectedOptionsDNForEachSingleFeature[cfid].push(coDisplayName);
	        listOfRejectedOptionsStateForEachSingleFeature[cfid].push(optionState);
	    }


	    function addListOfRejectedOptionsForSingleFeaturesInTheXML(){
	        var resXml='';

	        for (var itr in listOfRejectedOptionsForEachSingleFeature) {

	            var config_features = DictionaryObj.features;
	            for (var itx in config_features) {
	                var cfid = config_features[itx].ruleId;
	                if (cfid != undefined && cfid.toString().trim() == itr) {
	                    var cfName = config_features[itx].name;
											var cfDisplayName = config_features[itx].displayName;
	                    resXml += "<NOT>";
	                    resXml += featureTag(cfName, cfDisplayName, false, false);
	                    for (var i = 0; i < listOfRejectedOptionsForEachSingleFeature[itr].length; i++) {
	                        var coName = listOfRejectedOptionsForEachSingleFeature[itr][i];
	                        var coDisplayName = listOfRejectedOptionsDNForEachSingleFeature[itr][i];
	                        var optionState = listOfRejectedOptionsStateForEachSingleFeature[itr][i];
	                        resXml += featureTag(coName, coDisplayName, true, true, optionState);
	                    }
	                    resXml += endTag('Feature');
	                    resXml += endTag('NOT');

	                    break;
	                }

	            }

	        }

            return resXml;
	    }

        //End XF3

	    function addFeatureOptions(Feature, configModel, isRejected)
	    {
		    var resXml = "";		    
			var cfName = Feature.name;
			var cfDisplayName = Feature.displayName;
			if(isRejected) {
				resXml += "<NOT>";				
			}
			resXml += featureTag(cfName,cfDisplayName, false, false);

		    Feature.options.forEach( (coElem) => 
		    {
			    var coName = coElem.name;
				var coDisplayName = coElem.displayName;
				var coState = configModel.getStateWithId(coElem.ruleId);
				if(coName != undefined && coName != null)
				{
					//R14: need to change with constants
					if (isRejected && ( coState === 'Dismissed' || coState === 'Incompatible' ) 
						|| !isRejected && (coState === 'Required' || coState === 'Chosen' || coState === 'Selected'  || coState === 'Default') ) {
						// if (cfElem.selectionType == "Multiple") {       //XF3

							resXml += featureTag(coName, coDisplayName, true, true, coState);
						/* }                                               //XF3
						else {                                          //XF3
							addOptionToTheListOfRejectedOptionsForSingleFeatures(cfElem.ruleId, coName, coDisplayName, optionState);
							return resXml;                              //XF3
						}                                               //XF3*/
					}
					
				    
		      }
	       });
		   resXml += endTag('Feature');
		   if(isRejected) {
			resXml += endTag('NOT');
		   }

	    return resXml;
	    }


	    function featureTag(elemName, elemDisplayName, closed, addSelectedByAttribut, optionState){
	     var resXml = '';

	     resXml += '<Feature Type="ConfigFeature" Name="' + escapeXmlChars(elemName) + '"';
			 if(includeDisplayName) {
				 resXml += ' DisplayName="' + escapeXmlChars(elemDisplayName) + '"';
			 }

	     if (addSelectedByAttribut && optionState) {

	         if (optionState == ConfiguratorVariables.Default)
                 resXml += ' SelectedBy="Default"';
	         else if (optionState == ConfiguratorVariables.Required || optionState == ConfiguratorVariables.Incompatible)
                 resXml += ' SelectedBy="Rule"';
             else
                 resXml += ' SelectedBy="User"';

	     }

	     if(!closed)
		    resXml+=">";
	     else
		    resXml+="/>";
	     return resXml;
	    }

	    this.json2xml_str =  function (jsonobj){
		    initParamObjects(jsonobj);
		    return generateFilterXML(jsonobj);
	    };

        /*
	    this.parseXml = function(xml) {
	        var dom = null;
	        if (window.DOMParser) {
	            try {
	                dom = (new DOMParser()).parseFromString(xml, "text/xml");
	            }
	            catch (e) { dom = null; }
	        }
	        else if (window.ActiveXObject) {
	            try {
	                dom = new ActiveXObject('Microsoft.XMLDOM');
	                dom.async = false;
	                if (!dom.loadXML(xml)) // parse error ..

	                    window.alert(dom.parseError.reason + dom.parseError.srcText);
	            }
	            catch (e) { dom = null; }
	        }
	        else
	            alert("cannot parse xml string!");
	        return dom;
	    }



        // Changes XML to JSON
	    this.xmlToJson = function(xml) {

	        var js_obj = {};
	        if (xml.nodeType == 1) {
	            if (xml.attributes.length > 0) {
	                js_obj["attributes"] = {};
	                for (var j = 0; j < xml.attributes.length; j++) {
	                    var attribute = xml.attributes.item(j);
	                    js_obj["attributes"][attribute.nodeName] = attribute.value;
	                }
	            }
	        } else if (xml.nodeType == 3) {
	            js_obj = xml.nodeValue;
	        }
	        if (xml.hasChildNodes()) {
	            for (var i = 0; i < xml.childNodes.length; i++) {
	                var item = xml.childNodes.item(i);
	                var nodeName = item.nodeName;
	                if (typeof (js_obj[nodeName]) == "undefined") {
	                    js_obj[nodeName] = setJsonObj(item);
	                } else {
	                    if (typeof (js_obj[nodeName].push) == "undefined") {
	                        var old = js_obj[nodeName];
	                        js_obj[nodeName] = [];
	                        js_obj[nodeName].push(old);
	                    }
	                    js_obj[nodeName].push(setJsonObj(item));
	                }
	            }
	        }
	        return js_obj;
	    }

        // receives XML DOM object, returns converted JSON object
	    var setJsonObj = function (xml) {
	        var js_obj = {};
	        if (xml.nodeType == 1) {
	            if (xml.attributes.length > 0) {
	                js_obj["attributes"] = {};
	                for (var j = 0; j < xml.attributes.length; j++) {
	                    var attribute = xml.attributes.item(j);
	                    js_obj["attributes"][attribute.nodeName] = attribute.value;
	                }
	            }
	        } else if (xml.nodeType == 3) {
	            js_obj = xml.nodeValue;
	        }
	        if (xml.hasChildNodes()) {
	            for (var i = 0; i < xml.childNodes.length; i++) {
	                var item = xml.childNodes.item(i);
	                var nodeName = item.nodeName;
	                if (typeof (js_obj[nodeName]) == "undefined") {
	                    js_obj[nodeName] = setJsonObj(item);
	                } else {
	                    if (typeof (js_obj[nodeName].push) == "undefined") {
	                        var old = js_obj[nodeName];
	                        js_obj[nodeName] = [];
	                        js_obj[nodeName].push(old);
	                    }
	                    js_obj[nodeName].push(setJsonObj(item));
	                }
	            }
	        }
	        return js_obj;
	    }*/
    }



    return UWA.namespace('DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServices', FilterExpressionXMLServices);
}
);

define(
		'DS/ConfiguratorPanel/scripts/Presenters/TopbarPresenter',
		[
			'UWA/Core',
			'DS/Handlebars/Handlebars',
			'DS/UIKIT/Tooltip',
			'DS/CoreEvents/ModelEvents',
			'DS/ResizeSensor/js/ResizeSensor',
			'DS/ENOXViewFilter/js/ENOXViewFilter',
			'DS/UIKIT/Input/Button',
			'DS/UIKIT/DropdownMenu',
			'DS/UIKIT/SuperModal',
			'DS/Utilities/TouchUtils',
			'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
			'DS/ENOXCollectionToolBar/js/ENOXCollectionToolBarV2',
			'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
			'text!DS/ConfiguratorPanel/html/TopbarPresenter.html',
			"css!DS/ConfiguratorPanel/css/TopbarPresenter.css"
			],
			function (UWA,Handlebars, Tooltip, ModelEvents,ResizeSensor,
				ENOXViewFilter,Button,DropdownMenu, SuperModal, TouchUtils, ConfigVariables, ENOXCollectionToolBarV2, NLS_ConfiguratorPanel, html_TopbarPresenter)
			{
			'use strict';



			var template = Handlebars.compile(html_TopbarPresenter);

			var TopbarPresenter = function (options) {
				this._init(options);
			};

			/*********************************************INITIALIZATION************************************************************************/

			TopbarPresenter.prototype._init = function(options){
				var _options = options ? UWA.clone(options, false) : {};
				_options.add3DButton = _options.add3DButton ? _options.add3DButton : "no";
				UWA.merge(this, _options);
				this.allowRefine = this.configModel._appFunc.selectionMode_Refine;
				this.sort = [{id : "displayName", type : "string"}, {id : "sequenceNumber", type : "integer"}];

				this._toolbarModelEvent = new ModelEvents();
				this._subscribeToEvents();
				this._initDivs();
				this.inject(_options.parentContainer);
				this._findRuleAssistanceLevels({callsolve : false});
				this._initToolBar();
				// this._updateFilterIcon(this._allVariants);
				this.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
				this.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data:{activated:true} });

				// this._filterAllVariants();
				// this._filterUnselectedVariants();
				// this._filterRuleVariants();
				// this._filterMandVariants();
				// this._filterChosenVariants();
				// this._filterConflictingVariants();

				// this._searchVariants();
        // if(this.enableSwitchView) {
        //   this._addSwitchViewHandler();
        // }
				// this._sortVariants();
				// this._render3DVariants();
				// this._renderMatchingPCAction();
				// this._updateSelectionMode();
			};

			TopbarPresenter.prototype._initDivs = function(){
				this._container = document.createElement('div');
				this._container.innerHTML = template(this);

				this._container = this._container.querySelector('.topbar-wrapperContainer');
				UWA.extendElement(this._container);
				var that = this;
				this._topbarContainer = this._container.querySelector('.topbar-main-container');
				this._matchingPCActionActivated = false;
				this._3dViewActionActivated = false;
				this._searchContainer = this._container.querySelector('.topbar-MidMenu-Container');
				UWA.extendElement(this._searchContainer);
			};
			TopbarPresenter.prototype._initToolBar = function() {
				var that = this;
				var actions = [];
				if(this.add3DButton === 'yes') {
					actions.push({
						"id": "3d-view",
						"text": that._3dViewActionActivated ? NLS_ConfiguratorPanel.Hide_3D_View : NLS_ConfiguratorPanel.Show_3D_View, //NLS_ConfiguratorPanel.Show_3D_View, // Hide_3D_View
						"icon": {
							iconName: 'compass-3d',
							fontIconFamily: 1,
						},
						value: function (options) {
							let updatedClassName = '';
							if(!that._3dViewActionActivated){
								updatedClassName = ' enox-collection-toolbar-filter-activated';
								that._3dViewActionActivated = true;
							} else {
								that._3dViewActionActivated = false;
        }
							that.modelEvents.publish({ event: "Request3DFromConfigPanel", data:{ value: (that._3dViewActionActivated === true) ? "show" : "hide" } });
							that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : '3d-view', icon: {className : updatedClassName}}});
							that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-change-text-tooltip-action', data: { id : '3d-view', text: that._3dViewActionActivated ? NLS_ConfiguratorPanel.Hide_3D_View : NLS_ConfiguratorPanel.Show_3D_View }} );
						},
						handler: function () {
							console.log('3DView');
						}
					});
				}
				if(this.enableMatchingPC) {
					actions.push({
						"id": "find-matching-pc",
						"text": NLS_ConfiguratorPanel.Find_Matching_PC_Action,
						tooltip: {
							title: that._matchingPCActionActivated ? NLS_ConfiguratorPanel.Tooltip_hideMatchingPC : NLS_ConfiguratorPanel.Tooltip_showMatchingPC
						},
						selected: true,
						"icon": {
							iconName: "search-similar",
							fontIconFamily: 1,
							className : 'find-matching-pc-count',
							badges: {
								bottomRight: {
									number: 0
								}
							}
						},
						value: function (options) {
							let updatedClassName = "find-matching-pc-count";
							if(!that._matchingPCActionActivated) {
								updatedClassName += ' enox-collection-toolbar-filter-activated';
								that._matchingPCActionActivated = true;
							} else {
								that._matchingPCActionActivated = false;
							}
							that.modelEvents.publish({ event: "show-maching-pc-action", data: that._matchingPCActionActivated });
							that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'find-matching-pc', icon: {className : updatedClassName }}});
							that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-change-text-tooltip-action', data: { id : 'find-matching-pc', text: that._matchingPCActionActivated ? NLS_ConfiguratorPanel.Tooltip_hideMatchingPC : NLS_ConfiguratorPanel.Tooltip_showMatchingPC } });
						},
						type: "CheckItem",
						handler: function () {
							console.log('matching pc	');
						}
					});
				}
				if(actions.length > 0) {
					actions.push();
				}

				if (this.allowRefine === ConfigVariables.str_yes) {
					actions.push({
						"id": "switch-selection-mode-action",
						"text": NLS_ConfiguratorPanel.SwitchSelectionModeAction,
						"fonticon": 'option-empty',
						typeRepresentation: 'functionMenuIcon',
						value: {
							menu: [
								{
									type: "PushItem",
									title: NLS_ConfiguratorPanel.SwitchSelectionModeIncludeAction,
									action: {
										callback: function () {
											that.modelEvents.publish({ event: 'pc-switch-all-unselected-to-include' });
										}
									}
								},
								{
									type: "PushItem",
									title: NLS_ConfiguratorPanel.SwitchSelectionModeExcludeAction,
									action: {
										callback: function () {
											that.modelEvents.publish({ event: 'pc-switch-all-unselected-to-exclude' });
										}
									}
								}
							]
						}
					});
				}

				actions.push({
					"id": "rule-level-action",
					"text": NLS_ConfiguratorPanel.Rule_Eval_Mode_Action,
					"fonticon": that._getRuleLevelIcon(that._currentRuleAssistanceLevel),
					typeRepresentation : 'functionMenuIcon',
					value : {
						menu: that._getRuleEvalLevelMenu()
					}
				});
				var toolbarOptions = {
					modelEvents : this._toolbarModelEvent,
					showItemCount: false,
					withStableActions: true,
					touchMode: TouchUtils.getTouchMode() == true ? true : false,
					useGeneratedToolbar : true,
					withInformation: false,
					stableActions : [
						{
							"id": "criteria-filter",
							"title": "Criteria Filter",
							"text": NLS_ConfiguratorPanel.Filter_Criteria_Action,
							"fonticon": "list-filter",
							typeRepresentation: "chevronMenuIcon",
							value : {
								menu : that._getFilterActionMenu(),
							},
						},{
							id : 'taggerFilter',
							fonticon : 'filter',
							className : 'enox-collection-toolbar-filter-activated',
							//visibility: true,
							text : NLS_ConfiguratorPanel._taggerApplied,
							visibleFlag : false,
							handler : function(){}
						}
					],
					actions: actions,
					sort : [
							{
								"id": "displayName",
								"text": NLS_ConfiguratorPanel.Sort_DisplayName,
								"type": "string"
							},
							{
								"id": "sequenceNumber",
								"text": NLS_ConfiguratorPanel.Sort_SequenceNo,
								"type": "integer"
							}
						],
						"filter": {
							"enableCache": true,
							"width": 400
						},
						"views": [
							{
								"id": "TileView",
								"text": NLS_ConfiguratorPanel.Switch_TileView,
								"fonticon": "view-small-tile"
							},
							{
								"id": "DataGridView",
								"text": NLS_ConfiguratorPanel.Switch_DataGridView,
								"fonticon": "view-list"
							}
						],
						showSwitchViewAction: this.enableSwitchView,
						currentView : 'TileView',
						currentSort : {
							"id": this.configModel.sortPreference ? this.configModel.sortPreference.sortAttribute :"sequenceNumber",
							"order": this.configModel.sortPreference ? this.configModel.sortPreference.sortOrder :"ASC"
						}
			};
					this._toolbar = new ENOXCollectionToolBarV2(toolbarOptions);
					this._toolbar.inject(this._topbarContainer);
			};
			TopbarPresenter.prototype._getRuleEvalLevelMenu = function() {
				var that = this;
				var callbackFunction = function() {
						that._resetFeaturesForCompleteMode(this.id).then( (confirmed) => {
						// that._confirmChangeAssistanceLevel(this.id).then( (confirmed) => {
							// if(confirmed) {
								that._currentRuleObj = this;
								that._currentRuleAssistanceLevel = this.id;
								that._setRulesAssistanceLevel();
								that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'rule-level-action', menu: that._getRuleEvalLevelMenu()}});
								that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-icon-update', data : {id : 'rule-level-action', icon: {
									iconName : this.icon
								}}});
							// }
						});
				};
				// _ruleLevels
				var menu = this._ruleLevels.map((item) => {
					item.action = {
						this : item,
						callback : callbackFunction
					};
					item.state = that._currentRuleAssistanceLevel === item.id ? 'selected': '';
					return item;
				});
				return menu.reverse();
			};

			TopbarPresenter.prototype._getRuleLevelIcon = function (level) {
				var icon;
				switch (level) {
					case ConfigVariables.RulesMode_ProposeOptimizedConfiguration:
						icon = 'shield-full'
						break;
					case ConfigVariables.RulesMode_SelectCompleteConfiguration:
						icon = 'shield-3'
						break;
					case ConfigVariables.RulesMode_EnforceRequiredOptions:
						icon = 'shield-2'
						break;
					case ConfigVariables.RulesMode_DisableIncompatibleOptions:
						icon = 'shield-1'
						break;
					case ConfigVariables.NoRuleApplied:
						icon = 'shield-empty'
						break;
					default:
						icon = 'shield-2'
				}
				return icon;
			};
			TopbarPresenter.prototype._getFilterActionMenu = function() {
				var that = this;
				return [
						{
								"id": "user-selections",
								title : NLS_ConfiguratorPanel.Filter_User_Selections,
								type: "CheckItem",
								state: that.configModel.getCurrentFilter() === ConfigVariables.Filter_Chosen ? 'selected': '',
								action : {
									callback : function() {
										console.log('user filter');
										if(that.configModel.getCurrentFilter() === ConfigVariables.Filter_Chosen) {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
											that.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : ''}}});
				}else  {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_Chosen);
											that.modelEvents.publish({ event: "onChosenVariantIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : 'enox-collection-toolbar-filter-activated'}}});
										}
										that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'criteria-filter', menu: that._getFilterActionMenu()}});
									}
								}
						},
						{
								"id": "rule-selections",
								title: NLS_ConfiguratorPanel.Filter_Rule_Selections,
								type: "CheckItem",
								state: that.configModel.getCurrentFilter() === ConfigVariables.Filter_Rules ? 'selected': '',
								action: {
									callback: function() {
										console.log('rule filter');
										if(that.configModel.getCurrentFilter() === ConfigVariables.Filter_Rules) {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
											that.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : ''}}});
										} else {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_Rules);
											that.modelEvents.publish({ event: "OnRuleNotValidatedIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : 'enox-collection-toolbar-filter-activated'}}});
										}
										that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'criteria-filter', menu: that._getFilterActionMenu()}});
									}
								}
						},
						{
								"id": "empty-selections",
								title: NLS_ConfiguratorPanel.Filter_Empty_Selections,
								type: "CheckItem",
								state: that.configModel.getCurrentFilter() === ConfigVariables.Filter_Unselected ? 'selected': '',
								action: {
									callback: function() {
										console.log('empty filter');
										if(that.configModel.getCurrentFilter() === ConfigVariables.Filter_Unselected) {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
											that.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : ''}}});
										} else {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_Unselected);
											that.modelEvents.publish({ event: "OnUnselectedVariantIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : 'enox-collection-toolbar-filter-activated'}}});
										}
										that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'criteria-filter', menu: that._getFilterActionMenu()}});
									}
								}
						},
						{
								"id": "conflict-selections",
								title: NLS_ConfiguratorPanel.Filter_Conflict_Selections,
								type: "CheckItem",
								state: that.configModel.getCurrentFilter() === ConfigVariables.Filter_Conflicts ? 'selected': '',
								action: {
									callback: function() {
										console.log('conflict filter');
										if(that.configModel.getCurrentFilter() === ConfigVariables.Filter_Conflicts) {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
											that.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : ''}}});
										} else {
											that.configModel.setCurrentFilter(ConfigVariables.Filter_Conflicts);
											that.modelEvents.publish({ event: "OnConflictIconClick", data:{activated:true} });
											that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : 'criteria-filter', icon: {className : 'enox-collection-toolbar-filter-activated'}}});
										}
										that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'criteria-filter', menu: that._getFilterActionMenu()}});
									}
								}
					},
					{
						"id": "commercial-selections",
						title: NLS_ConfiguratorPanel.Filter_Commercial_Selections,
						type: "CheckItem",
						state: that.configModel.getCurrentFilter() === ConfigVariables.Filter_Commercial ? 'selected' : '',
						action: {
							callback: function () {
								console.log('commercial filter');
								if (that.configModel.getCurrentFilter() === ConfigVariables.Filter_Commercial) {
									that.configModel.setCurrentFilter(ConfigVariables.Filter_AllVariants);
									that.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data: { activated: true } });
									that._toolbarModelEvent.publish({ event: 'enox-collection-toolbar-icon-update', data: { id: 'criteria-filter', icon: { className: '' } } });
								} else {
									that.configModel.setCurrentFilter(ConfigVariables.Filter_Commercial);
									that.modelEvents.publish({ event: "OnCommercialIconClick", data: { activated: true } });
									that._toolbarModelEvent.publish({ event: 'enox-collection-toolbar-icon-update', data: { id: 'criteria-filter', icon: { className: 'enox-collection-toolbar-filter-activated' } } });
								}
								that._toolbarModelEvent.publish({ event: 'enox-collection-toolbar-update-menu', data: { id: 'criteria-filter', menu: that._getFilterActionMenu() } });
							}
						}
						}
				];
			};


			TopbarPresenter.prototype.inject= function(parentcontainer) {
				var that = this;
				parentcontainer.appendChild(this._container);
				var resizeSensor = new ResizeSensor(this._container, function () {
					that._resize();
				});
			};

			/*********************************************EVENT HANDLING - UPDATE COUNTER*******************************************************/

			TopbarPresenter.prototype._subscribeToEvents = function() {
				var that = this;
				this.modelEvents.subscribe({event:'checkModelConsistency_SolverAnswer'},function(data){
					if(data.answerRC === "Rules_KO"){
						var ruleLevel = that._find(that._ruleLevels, ConfigVariables.NoRuleApplied);
						that._currentRuleAssistanceLevel = ConfigVariables.NoRuleApplied;
						that._setRulesAssistanceLevel();
					}
				});
				
				this.modelEvents.subscribe({event:'deactivate-3dbutton'}, function(){
					// unhighlight the 3D button
					// if(that._3DVariants.hasClassName("topbar-icon-selected")) {
					// 	that._3DVariants.removeClassName('topbar-icon-selected');
					// }
					that._3dViewActionActivated = false;
					that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-icon-update', data: { id : '3d-view', icon: {className : ''}}});
					that._toolbarModelEvent.publish({ event : 'enox-collection-toolbar-change-text-tooltip-action', data: { id : '3d-view', text: NLS_ConfiguratorPanel.Show_3D_View }} );

				});

				this.modelEvents.subscribe({event:'pc-matching-pcs-count-update'}, function(count){
					var  countValue = count > 99 ? '+99': ''+count;
					// that._matchingPCAction.getElement("#topbar-matchingPC-count-sub").setContent(countValue);
					that._toolbarModelEvent.publish({event : 'enox-collection-toolbar-icon-update', data : {id : 'find-matching-pc', icon: {
						badges: {
							bottomRight: {
								number: count
							}
						}
					}}});
				});

				this._toolbarModelEvent.subscribe({event: 'enox-collection-toolbar-switch-view-activated'}, function (viewId) {
					that.modelEvents.publish({ event: "onTopbarSwitchView", data:{ "view": viewId} });
				});

				this._toolbarModelEvent.subscribe({event: 'enox-collection-toolbar-sort-activated'}, function (data) {
					if (data && data.sortAttribute && data.sortOrder) {
						UWA.log('sorting tree on ' + data.sortAttribute + ' ' + data.sortOrder);
						that.configModel.sortPreference.sortAttribute =  data.sortAttribute;
						that.configModel.sortPreference.sortOrder =  data.sortOrder.toUpperCase();
						that.modelEvents.publish({event: 'OnSortResult', data : that.configModel.sortPreference});
					}
				});
				this._toolbarModelEvent.subscribe({event: 'enox-collection-toolbar-filter-search-value'}, function (values) {
					that.modelEvents.publish({ event: 'OnSearchResult', data: values});
				});
			};


			TopbarPresenter.prototype._updateSelectionMode = function () {
						var that = this;
						this.modelEvents.publish({
							event: "OnConfigurationModeChange",
							data : {mode : this.configModel.getSelectionMode()}
						});
					};



			/*********************************************UNSELECTED VARIANTS IN TOPBAR*****************************************************/


			/*********************************************RULE VARIANTS IN TOPBAR*****************************************************/


			/*********************************************MAND VARIANTS IN TOPBAR*****************************************************/


			/*********************************************CHOSEN VARIANTS IN TOPBAR*****************************************************/


			/*********************************************CONFLICTING VARIANTS IN TOPBAR*************************************************/


			/*********************************************SEARCH IN TOPBAR*****************************************************************/

			/*********************************************SORT IN TOPBAR*****************************************************************/

			/*********************************************RULE ASSISTANCE IN TOPBAR************************************************************/

			TopbarPresenter.prototype._findRuleAssistanceLevels = function(options) {
				this._ruleLevels = [];
				var appFunc = this.configModel.getAppFunc();
				var ruleActivation = this.configModel.getRulesActivation();

				this._ruleLevels.push({
					id : ConfigVariables.NoRuleApplied,
					recId : ConfigVariables.NoRuleApplied,
					type: "CheckItem",
					title: NLS_ConfiguratorPanel['No rule applied'],
					icon : 'shield-empty',
					tooltip: {
						title: NLS_ConfiguratorPanel['No rule applied']
					}
				});

				if(appFunc["rulesMode_DisableIncompatibleOptions"] === "yes"){
					this._ruleLevels.push({
						id : ConfigVariables.RulesMode_DisableIncompatibleOptions,
						recId : ConfigVariables.RulesMode_DisableIncompatibleOptions,
						type: "CheckItem",
						title: NLS_ConfiguratorPanel.Compatible,
						icon : 'shield-1',
						tooltip: {
							title: NLS_ConfiguratorPanel.Compatible,
							shortHelp: NLS_ConfiguratorPanel.descCompatible
						}
					});
				}

				if(appFunc["rulesMode_EnforceRequiredOptions"] === "yes"){
					this._ruleLevels.push({
						id : ConfigVariables.RulesMode_EnforceRequiredOptions,
						recId : ConfigVariables.RulesMode_EnforceRequiredOptions,
						type: "CheckItem",
						title: NLS_ConfiguratorPanel['Enforced/Infilled'],
						icon : 'shield-2',
						tooltip: {
							title: NLS_ConfiguratorPanel['Enforced/Infilled'],
							shortHelp: NLS_ConfiguratorPanel.descEnforced
						}
					});
				}

				if(appFunc["rulesMode_SelectCompleteConfiguration"] === "yes"){
					this._ruleLevels.push({
						id : ConfigVariables.RulesMode_SelectCompleteConfiguration,
						recId : ConfigVariables.RulesMode_SelectCompleteConfiguration,
						type: "CheckItem",
						title: NLS_ConfiguratorPanel['Complete/Fulfilled'],
						icon : 'shield-3',
						tooltip: {
							title: NLS_ConfiguratorPanel['Complete/Fulfilled'],
							shortHelp: NLS_ConfiguratorPanel.descComplete
						}
					});
				}

				if(appFunc["rulesMode_ProposeOptimizedConfiguration"] === "yes") {
					this._ruleLevels.push({
						id : ConfigVariables.RulesMode_ProposeOptimizedConfiguration,
						recId : ConfigVariables.RulesMode_ProposeOptimizedConfiguration,
						type: "CheckItem",
						title: NLS_ConfiguratorPanel['Optimized'],
						icon : 'shield-full',
						tooltip: {
							title: NLS_ConfiguratorPanel['Optimized'],
							shortHelp: NLS_ConfiguratorPanel.descOptimized
						}
					});
				}

				var ruleLevel = this._find(this._ruleLevels, this.configModel.getRulesMode());
				// var ruleLevel = ConfigVariables.NoRuleApplied;
				// if(ruleActivation === "true" && this.configModel.getRulesMode()) {
				// 	ruleLevel = this.configModel.getRulesMode();
				// }
				this._currentRuleObj = (ruleActivation === "true" && ruleLevel) ? ruleLevel : this._ruleLevels[0];
				//this._currentRuleObj.state = 'selected';
				this._currentRuleAssistanceLevel = this._currentRuleObj.id;
				// this._createRulesAssistanceDD();
				this._toolbarModelEvent.publish({event : 'enox-collection-toolbar-update-menu', data: {id: 'rule-level-action', menu: this._getRuleEvalLevelMenu()}});
				this._toolbarModelEvent.publish({event : 'enox-collection-toolbar-icon-update', data : {id : 'rule-level-action', icon: {iconName : this._getRuleLevelIcon(this._currentRuleAssistanceLevel)}}});
				this._setRulesAssistanceLevel(options);
			};

			TopbarPresenter.prototype._confirmChangeAssistanceLevel = function (newRulesMode) {
				var that = this;
				var confirmPromise = new Promise((resolve) => {
					if( newRulesMode === 'RulesMode_SelectCompleteConfiguration' ) {
						var superModal = new SuperModal({ className : 'confirm-changAssistanceLevel-modal', renderTo: document.body});
						superModal.confirm(NLS_ConfiguratorPanel.Message_Confirm_CompleteModeSwitch, NLS_ConfiguratorPanel.Title_Confirm_CompleteModeSwitch, function (confirmed) {
							resolve(confirmed);
						});
					} else {
						resolve(true);
					}
				});

				return confirmPromise;
			};

			TopbarPresenter.prototype._resetFeaturesForCompleteMode = function (newRulesMode) {
				if(newRulesMode === 'RulesMode_SelectCompleteConfiguration') {
					var confirmUserPromptPromise = UWA.Promise.deferred();
					var callbackPromises = [];
					var needConfirm = false;
					var features = this.configModel.getDictionary().features;
					if(UWA.is(features,'array')) {
						for (var i = 0; i < features.length; i++) {
							if(this.configModel.getFeatureSelectionMode(features[i]) === ConfigVariables.feature_SelectionMode_Dismiss) {
								if(this.configModel.hasDismissedOptions(features[i])) {
									callbackPromises.push(confirmUserPromptPromise.promise.then(()=> {
										this.configModel.emptyDismissedOptions(features[i]);
									}));
									needConfirm = true;
								}
								this.configModel._featureLevelSelectionMode[features[i].ruleId] = features[i].selectionType;
							} else if(features[i].selectionType === ConfigVariables.feature_SelectionMode_Single && this.configModel.hasMultiSelectVariantValues(features[i])) {
								callbackPromises.push(confirmUserPromptPromise.promise.then(()=> {
									this.configModel.emptyMultiSelectedVariants(features[i]);
								}));
								needConfirm = true;
							}
						}
					}
					if(needConfirm) {
						this._confirmChangeAssistanceLevel('RulesMode_SelectCompleteConfiguration').then((confirmed) => {
							return confirmed ? confirmUserPromptPromise.resolve() : confirmUserPromptPromise.reject();
						});
						return UWA.Promise.all(callbackPromises);
					}
					confirmUserPromptPromise.resolve();
					return confirmUserPromptPromise.promise;
				}
				return UWA.Promise.resolve();
			};


			TopbarPresenter.prototype._setRulesAssistanceLevel = function(options){
				var solveCallback = options ? options.callsolve : true;
				var ruleActivation = (this._currentRuleAssistanceLevel === ConfigVariables.NoRuleApplied) ? ConfigVariables.str_false : ConfigVariables.str_true;
				// ruleActivation === ConfigVariables.str_true ? this._rulesAssistance.classList.add('topbar-icon-selected') : this._rulesAssistance.classList.remove('topbar-icon-selected');

				this.configModel.setRulesActivation(ruleActivation);
				this.configModel.setRulesMode(this._currentRuleAssistanceLevel);

				if(solveCallback){
					this.modelEvents.publish({ event: "OnRuleAssistanceLevelChange", data:	{value : this._currentRuleAssistanceLevel, callsolve :solveCallback} });
				}

				// Hide action menu in Complete Configuration Mode or Refine mode
				// if(	this._currentRuleAssistanceLevel === 'RulesMode_SelectCompleteConfiguration' ||
				// 	this.configModel.getSelectionMode() === "selectionMode_Refine") {
				// 	this._MultiSelectbutton.hide();
				// 	this._MultiSelectbutton.removeClassName('active');
				// }else {
				// 	this._MultiSelectbutton.show();
				// }

				// disabled view switching for complete mode and if DGV is active, switch it to tile view
				if(this._currentRuleAssistanceLevel === 'RulesMode_SelectCompleteConfiguration' && this.enableSwitchView) {
					this._container.addClassName('pc-complete-mode');

					// var targetBtnSpan = UWA.extendElement(this._switchView.firstElementChild);
					// if(targetBtnSpan.hasClassName("wux-ui-3ds-view-small-tile")){
					// 	targetBtnSpan.removeClassName("wux-ui-3ds-view-small-tile");
					// 	targetBtnSpan.addClassName("wux-ui-3ds-view-list");
					// 	this.modelEvents.publish({ event: "onTopbarSwitchView", data:{"view": "classic"} });
					// 	this._switchViewTooltip.setBody(NLS_ConfiguratorPanel.Switch_DataGridView);
					// }
				} else {
					this._container.removeClassName('pc-complete-mode');
				}
			};

			/*********************************************3D IN TOPBAR*****************************************************************/

			/*******************************************************UILITIES IN TOPBAR*************************************************************/

			TopbarPresenter.prototype._find = function (array, id) {
				if(array){
					var match;
					array.forEach(function(item){
						if(item.id === id){ match = item; return;}
					});
					return match ? match : array[0];
				}
			};

			TopbarPresenter.prototype._resize = function () {
				if(this.searchComponent){
					this.searchComponent.container.removeClassName('topbar-maximize-searchtext');
					this.searchComponent.inject(this._searchContainer);

					if(this._container.offsetHeight > 70){
						this.searchComponent.inject(this._container);
						this.searchComponent.container.addClassName('topbar-maximize-searchtext');
					}
				}
				this.modelEvents.publish({event:"onTopbarHeightChange", data: this._container.offsetHeight })
			};

			return TopbarPresenter;
			});

/*
	FilterExpressionXMLServices.js
	To convert configurator json to xml for binary creation

*/

define('DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServicesWithDisplayName',
[
	'UWA/Core',
	'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables'
],
function (UWA, ConfiguratorVariables) {
		'use strict';
    function FilterExpressionXMLServicesWithDisplayName(xmlType)
    {
	    var AppRulesParamObj = {};
	    var AppFuncObj =  {};
	    var DictionaryObj = {};
	    var ConfigCriteriaObj =  {};
	    var XML_FILE_TYPE = {};
	    var EvolutionCriteriaObj = {};
	    var ModelVersionInfoObj = {};
	    var FILTER_SELECTION_MODE = '';
	    var listOfRejectedOptionsForEachSingleFeature = {};     //XF3
	    var listOfRejectedOptionsStateForEachSingleFeature = {};     //XF3

	    var XML_TAG_NAMES = {
		    FilterSelection : 'FilterSelection',
		    Context : 'Context',
		    CfgFilterExpression : 'CfgFilterExpression',
		    Feature : 'Feature'
	    };

	    var ATTR_VALUE_MAP = {
		    selectionMode	 : "SelectionMode",
		    selectionMode_Build: "Strict",
		    selectionMode_Refine: "150%"

	    };
	    var ATTRNAMES = ['selectionMode'];
	    var CONFIGURATOR_FIELDS = {
		    ConfigurationCriteria :'configurationCriteria',
		    ApplicationState :'applicationState',
		    AppRulesParam : 'app_RulesParam',
		    AppFunc : 'app_Func',
		    Dictionary : 'dictionary',
		    Rules:'rules',
		    EvolutionCriteria: 'evolutionCriteria',
	        ModelVersionInfo:'modelVersionInfo'
	    };

	    var XML_DECLARE = {
		    Schema : "xmlns:xs",
		    Namespace : "xmlns",
		    SchemaLocation : "xs:schemaLocation"
	    };

	    var FILTER_EXPRESSION = {
		    ROOT : "CfgFilterExpression",
		    TAG1 : "FilterSelection",
		    Schema: "http://www.w3.org/2001/XMLSchema-instance",
		    Namespace : "urn:com:dassault_systemes:config",
		    SchemaLocation : "urn:com:dassault_systemes:config CfgFilterExpression.xsd"
	    };
	    initXMLType();
	    function initXMLType(){
		    if(xmlType === 'FilterExpression')
			    XML_FILE_TYPE = FILTER_EXPRESSION;
	    }
	    function initParamObjects(jsonObj)
	    {
		    AppRulesParamObj = jsonObj[CONFIGURATOR_FIELDS.AppRulesParam];
		    AppFuncObj =  jsonObj[CONFIGURATOR_FIELDS.AppFunc];
		    DictionaryObj = jsonObj[CONFIGURATOR_FIELDS.Dictionary];
		    ConfigCriteriaObj =  jsonObj[CONFIGURATOR_FIELDS.ConfigurationCriteria];
		    EvolutionCriteriaObj = jsonObj[CONFIGURATOR_FIELDS.EvolutionCriteria];
		    FILTER_SELECTION_MODE = AppRulesParamObj['selectionMode'];
		    ModelVersionInfoObj = jsonObj[CONFIGURATOR_FIELDS.ModelVersionInfo];
	    }

	    function getXMLDeclaration()
	    {
		    var initXml = '<?xml version="1.0" encoding="UTF-8"?>';
		    var attrList = [];
		    for(var elem in XML_DECLARE)
		    {
			    attrList.push(elem);
		    }
		    initXml += "<"+ XML_FILE_TYPE.ROOT;
		    if(attrList!==null) {
			    for(var item = 0; item < attrList.length; item++) {
				    var key = attrList[item];
				    var attrName = XML_DECLARE[key];
				    var attrVal = FILTER_EXPRESSION[key];
				    //attrVal=escapeXmlChars(attrVal);
				    initXml+=" "+attrName+"='"+attrVal+"'";
			    }
		    }
		    initXml+=">";
		    return initXml;
	    }

	    function jsonXmlElemCount () {
		    var elementsCnt = 0;
		    for( var it in ConfigCriteriaObj  ) {
			    if(ConfigCriteriaObj[it] instanceof Object)
			    {
			        if (ConfigCriteriaObj[it].State === ConfiguratorVariables.Chosen || ConfigCriteriaObj[it].State === ConfiguratorVariables.Required || ConfigCriteriaObj[it].State === ConfiguratorVariables.Default || ConfigCriteriaObj[it].State === ConfiguratorVariables.Selected ||
					     ConfigCriteriaObj[it].State === ConfiguratorVariables.Dismissed || ConfigCriteriaObj[it].State === ConfiguratorVariables.Incompatible)
						    elementsCnt++;
				    }
			    }

		    return elementsCnt;
	    }
	    function addAttributes(rulesParamObj,element, attrList, closed) {
		    var resultStr = "<"+ element;
				var attrVal;
		    if(attrList!==null) {
			    for(var aidx = 0; aidx < attrList.length; aidx++) {
				    var attrName = attrList[aidx];
				    if(ATTR_VALUE_MAP[attrName] !== undefined)
				    {
					    var tAttrName = ATTR_VALUE_MAP[attrName];
					    attrVal = ATTR_VALUE_MAP[rulesParamObj[attrName]];
					    attrVal=escapeXmlChars(attrVal);
					    resultStr+=" "+tAttrName+"='"+attrVal+"'";

				    }else
				    {
					    attrVal = rulesParamObj[attrName];
					    attrVal = escapeXmlChars(attrVal);
					    resultStr+=" "+attrName+"='"+attrVal+"'";
				    }

			    }
		    }
		    if(!closed)
			    resultStr+=">";
		    else
			    resultStr+="/>";
		    return resultStr;
	    }

	    function endTag(elementName) {
		    return "</"+ elementName+">";
	    }

	    function escapeXmlChars(str) {
	    if(typeof(str) === "string")
		    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
	    else
		    return str;
	    }

        //XF3 : If selection and reject are present in the same feature, we cannot add the reject in the XML or it will lead to XML parsing issues
	    /*function checkIfSelectionIsPresentInSameFeature(optionId) {
	        var config_features = DictionaryObj.features;
	        for (var itx in config_features) {
	            var cfElem = config_features[itx];
	            var coElem = cfElem['options'];
	            var optionFound = false;

	            if (coElem instanceof Object) {
	                for (var itr in coElem) {
	                    var coid = coElem[itr].ruleId;

	                    if (coid != undefined && coid.toString().trim() == optionId) {
	                        optionFound = true;
	                        break;
	                    }
	                }

	                if (optionFound) {
	                    for (var itr in coElem) {
	                        var coid = coElem[itr].ruleId;

	                        if (coid != undefined) {
	                            for (var it in ConfigCriteriaObj) {
	                                if (ConfigCriteriaObj[it] instanceof Object) {
	                                    var criteriaId = ConfigCriteriaObj[it].Id;
	                                    var state = ConfigCriteriaObj[it].State;

	                                    if (criteriaId == coid && (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected)) {
	                                        return true;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	        return false;
	    }*/


	    function checkLevelOfSelectionsInFeature(optionId) {
	        var selectionLevel = 'NoSelection';
	        var config_features = DictionaryObj.features;

	        for (var itx in config_features) {
	            var cfElem = config_features[itx];
	            var coElem = cfElem['options'];
	            var optionFound = false;
							var coid;

	            if (coElem instanceof Object) {
	                for (var itr in coElem) {
	                    coid = coElem[itr].ruleId;

	                    if (coid !== undefined && coid.toString().trim() === optionId) {
	                        optionFound = true;
	                        break;
	                    }
	                }

	                if (optionFound) {
	                    for (var itr in coElem) {
	                        coid = coElem[itr].ruleId;

	                        if (coid !== undefined) {
	                            for (var it in ConfigCriteriaObj) {
	                                if (ConfigCriteriaObj[it] instanceof Object) {
	                                    var criteriaId = ConfigCriteriaObj[it].Id;
	                                    var state = ConfigCriteriaObj[it].State;

	                                    if (criteriaId === coid) {
	                                        if (state === ConfiguratorVariables.Chosen) {
	                                            if (selectionLevel === 'NoSelection' || selectionLevel === 'ruleSelection') {
	                                                selectionLevel = 'userSelection';
	                                            }
	                                            else if (selectionLevel === 'userReject' || selectionLevel === 'userRejectAndRuleSelection') {
	                                                selectionLevel = 'userSelectionAndUserReject';
	                                            }
	                                            else if (selectionLevel === 'ruleReject' || selectionLevel === 'ruleSelectionAndRuleReject') {
	                                                selectionLevel = 'userSelectionAndRuleReject';
	                                            }
	                                        }
	                                        else if (state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default || state === ConfiguratorVariables.Selected) {
	                                            if (selectionLevel === 'NoSelection') {
	                                                selectionLevel = 'ruleSelection';
	                                            }
	                                            else if (selectionLevel === 'userReject') {
	                                                selectionLevel = 'userRejectAndRuleSelection';
	                                            }
	                                            else if (selectionLevel === 'ruleReject') {
	                                                selectionLevel = 'ruleSelectionAndRuleReject';
	                                            }
	                                        }
	                                        else if (state === ConfiguratorVariables.Dismissed) {
	                                            if (selectionLevel === 'NoSelection' || selectionLevel === 'ruleReject') {
	                                                selectionLevel = 'userReject';
	                                            }
	                                            else if (selectionLevel === 'userSelection' || selectionLevel === 'userSelectionAndRuleReject') {
	                                                selectionLevel = 'userSelectionAndUserReject';
	                                            }
	                                            else if (selectionLevel === 'ruleSelection' || selectionLevel === 'ruleSelectionAndRuleReject') {
	                                                selectionLevel = 'userRejectAndRuleSelection';
	                                            }
	                                        }
	                                        else if (state === ConfiguratorVariables.Incompatible) {
	                                            if (selectionLevel === 'NoSelection') {
	                                                selectionLevel = 'ruleReject';
	                                            }
	                                            else if (selectionLevel === 'userSelection') {
	                                                selectionLevel = 'userSelectionAndRuleReject';
	                                            }
	                                            else if (selectionLevel === 'ruleSelection') {
	                                                selectionLevel = 'ruleSelectionAndRuleReject';
	                                            }
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	        return selectionLevel;
	    }


        //End XF3

	    function generateFilterXML (){
		    var result = "";
		    result += getXMLDeclaration();
		    result += addAttributes(AppRulesParamObj,XML_FILE_TYPE.TAG1,ATTRNAMES,false);
		    var elementsCnt = jsonXmlElemCount();

	        if (ModelVersionInfoObj !== undefined)
		        result += getProdStateXML();

				var isStrictMode = false;
				if(AppRulesParamObj.selectionMode === ConfiguratorVariables.selectionMode_Build) {
					isStrictMode = true;
				}
		    if (elementsCnt > 0) {
//		        result += addContext(DictionaryObj.model.label); // Removing optional context because it does not support empty selection (temporary?)
		        //if (EvolutionCriteriaObj != undefined)
		          //  result += getProdStateXML();

		        for (var it in ConfigCriteriaObj) {
		            if (ConfigCriteriaObj[it] instanceof Object) {
		                var criteriaId = ConfigCriteriaObj[it].Id;
		                var state = ConfigCriteriaObj[it].State;

		                /*if (state == ConfiguratorVariables.Chosen || state == ConfiguratorVariables.Required || state == ConfiguratorVariables.Default || ConfigCriteriaObj[it].State == ConfiguratorVariables.Selected) {
		                    result += addFeatureOption(criteriaId, false, state);
		                } else if (state == ConfiguratorVariables.Dismissed || state == ConfiguratorVariables.Incompatible) {
		                    if (!checkIfSelectionIsPresentInSameFeature(criteriaId)) {
		                        result += addFeatureOption(criteriaId, true, state);
		                    }
		                }*/

		                var selectionlevel = checkLevelOfSelectionsInFeature(criteriaId);

		                if (state === ConfiguratorVariables.Chosen || state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default || ConfigCriteriaObj[it].State === ConfiguratorVariables.Selected) {
		                    if (selectionlevel === 'userSelection' || selectionlevel === 'userSelectionAndUserReject' || selectionlevel === 'userSelectionAndRuleReject' || selectionlevel === 'ruleSelection' || selectionlevel === 'ruleSelectionAndRuleReject' || selectionlevel === 'userRejectAndRuleSelection') {
		                        result += addFeatureOption(criteriaId, false, state);
		                    }
		                } else if (!isStrictMode && (state === ConfiguratorVariables.Dismissed || state === ConfiguratorVariables.Incompatible)) {
		                    if (selectionlevel === 'userReject' || selectionlevel === 'ruleReject') {
		                        result += addFeatureOption(criteriaId, true, state);
		                    }
		                }
		            }
		        }
//		        result += endTag('Context');
		    }

		    var empty = true;

		    for (var prop in listOfRejectedOptionsForEachSingleFeature) {
		        if (listOfRejectedOptionsForEachSingleFeature.hasOwnProperty(prop))
		            empty = false;
		    }

		    if (!empty)
		        result += addListOfRejectedOptionsForSingleFeaturesInTheXML();

			    result += endTag(XML_FILE_TYPE.TAG1);
			    result += endTag(XML_FILE_TYPE.ROOT);
			    return result;

	    }
	    function getProdStateXML()
	    {
	        var prodStateXml = '';

	        if (ModelVersionInfoObj.modelName && ModelVersionInfoObj.modelVersionName && ModelVersionInfoObj.modelVersionRevision) {
	            var prodName = ModelVersionInfoObj.modelVersionName;
	            var prodRevsion = ModelVersionInfoObj.modelVersionRevision;
	            var modelName = ModelVersionInfoObj.modelName;

	            prodStateXml += '<TreeSeries Type="ProductState" Name="' + escapeXmlChars(modelName) + '">';
	            prodStateXml += '<Single Name="' + escapeXmlChars(prodName) + '" Revision="' + escapeXmlChars(prodRevsion) + '" />';
	            prodStateXml += '</TreeSeries>';
	        }

		    return prodStateXml;
	    }

        //XF3
	    function addOptionToTheListOfRejectedOptionsForSingleFeatures(cfid, coName, optionState) {
	        if (listOfRejectedOptionsForEachSingleFeature[cfid] === undefined)
	            listOfRejectedOptionsForEachSingleFeature[cfid] = [];

	        if (listOfRejectedOptionsStateForEachSingleFeature[cfid] === undefined)
	            listOfRejectedOptionsStateForEachSingleFeature[cfid] = [];

	        listOfRejectedOptionsForEachSingleFeature[cfid].push(coName);
	        listOfRejectedOptionsStateForEachSingleFeature[cfid].push(optionState);
	    }


	    function addListOfRejectedOptionsForSingleFeaturesInTheXML(){
	        var resXml='';

	        for (var itr in listOfRejectedOptionsForEachSingleFeature) {

	            var config_features = DictionaryObj.features;
	            for (var itx in config_features) {
	                var cfid = config_features[itx].ruleId;
	                if (cfid !== undefined && cfid.toString().trim() === itr) {
	                    var cfName = config_features[itx].displayName;
	                    resXml += "<NOT>";
	                    resXml += featureTag(cfName, false, false);
	                    for (var i = 0; i < listOfRejectedOptionsForEachSingleFeature[itr].length; i++) {
	                        var coName = listOfRejectedOptionsForEachSingleFeature[itr][i];
	                        var optionState = listOfRejectedOptionsStateForEachSingleFeature[itr][i];
	                        resXml += featureTag(coName, true, true, optionState);
	                    }
	                    resXml += endTag('Feature');
	                    resXml += endTag('NOT');

	                    break;
	                }

	            }

	        }

            return resXml;
	    }

        //End XF3

	    function addFeatureOption(criteriaId,isRejected, optionState)
	    {
		    var resXml = "";
		    var config_features = DictionaryObj.features;
		    for (var itx in config_features)
		    {
			    var cfElem = config_features[itx];
			    var cfName = cfElem.displayName;
			    var coElem = cfElem['options'];
			    if(coElem instanceof Object)
			    {
			     for(var itr in coElem)
			     {
				    var coName = coElem[itr].displayName;
				    if(coName !== undefined && coName !== null)
				    {
					    var coid = coElem[itr].ruleId;

					    if (coid !== undefined && coid.toString().trim() === criteriaId)
					    {
					        if (isRejected) {
					            if (cfElem.selectionType === "Multiple") {       //XF3
					                resXml += "<NOT>";
					                resXml += featureTag(cfName, false, false);
					                resXml += featureTag(coName, true, true, optionState);
					                resXml += endTag('Feature');
					                resXml += endTag('NOT');
					            }                                               //XF3
					            else {                                          //XF3
					                addOptionToTheListOfRejectedOptionsForSingleFeatures(cfElem.ruleId, coName, optionState);
					                return resXml;                              //XF3
					            }                                               //XF3
						    }else
						    {
							    resXml += featureTag(cfName,false, false);
							    resXml += featureTag(coName,true, true, optionState);
							    resXml += endTag('Feature');
						    }
					    }

				    }

			     }
		      }
	       }

	    return resXml;
	    }


	    function featureTag(elemName,closed, addSelectedByAttribut, optionState){
	     var resXml = '';

	     resXml += '<Feature Type="ConfigFeature" Name="' + escapeXmlChars(elemName) + '"';
			 if (addSelectedByAttribut && optionState) {

	         if (optionState === ConfiguratorVariables.Default)
                 resXml += ' SelectedBy="Default"';
	         else if (optionState === ConfiguratorVariables.Required || optionState === ConfiguratorVariables.Incompatible)
                 resXml += ' SelectedBy="Rule"';
             else
                 resXml += ' SelectedBy="User"';

	     }

	     if(!closed)
		    resXml+=">";
	     else
		    resXml+="/>";
	     return resXml;
	    }

	    this.json2xml_str =  function (jsonobj){
		    initParamObjects(jsonobj);
		    return generateFilterXML();
	    };

        /*
	    this.parseXml = function(xml) {
	        var dom = null;
	        if (window.DOMParser) {
	            try {
	                dom = (new DOMParser()).parseFromString(xml, "text/xml");
	            }
	            catch (e) { dom = null; }
	        }
	        else if (window.ActiveXObject) {
	            try {
	                dom = new ActiveXObject('Microsoft.XMLDOM');
	                dom.async = false;
	                if (!dom.loadXML(xml)) // parse error ..

	                    window.alert(dom.parseError.reason + dom.parseError.srcText);
	            }
	            catch (e) { dom = null; }
	        }
	        else
	            alert("cannot parse xml string!");
	        return dom;
	    }



        // Changes XML to JSON
	    this.xmlToJson = function(xml) {

	        var js_obj = {};
	        if (xml.nodeType == 1) {
	            if (xml.attributes.length > 0) {
	                js_obj["attributes"] = {};
	                for (var j = 0; j < xml.attributes.length; j++) {
	                    var attribute = xml.attributes.item(j);
	                    js_obj["attributes"][attribute.nodeName] = attribute.value;
	                }
	            }
	        } else if (xml.nodeType == 3) {
	            js_obj = xml.nodeValue;
	        }
	        if (xml.hasChildNodes()) {
	            for (var i = 0; i < xml.childNodes.length; i++) {
	                var item = xml.childNodes.item(i);
	                var nodeName = item.nodeName;
	                if (typeof (js_obj[nodeName]) == "undefined") {
	                    js_obj[nodeName] = setJsonObj(item);
	                } else {
	                    if (typeof (js_obj[nodeName].push) == "undefined") {
	                        var old = js_obj[nodeName];
	                        js_obj[nodeName] = [];
	                        js_obj[nodeName].push(old);
	                    }
	                    js_obj[nodeName].push(setJsonObj(item));
	                }
	            }
	        }
	        return js_obj;
	    }

        // receives XML DOM object, returns converted JSON object
	    var setJsonObj = function (xml) {
	        var js_obj = {};
	        if (xml.nodeType == 1) {
	            if (xml.attributes.length > 0) {
	                js_obj["attributes"] = {};
	                for (var j = 0; j < xml.attributes.length; j++) {
	                    var attribute = xml.attributes.item(j);
	                    js_obj["attributes"][attribute.nodeName] = attribute.value;
	                }
	            }
	        } else if (xml.nodeType == 3) {
	            js_obj = xml.nodeValue;
	        }
	        if (xml.hasChildNodes()) {
	            for (var i = 0; i < xml.childNodes.length; i++) {
	                var item = xml.childNodes.item(i);
	                var nodeName = item.nodeName;
	                if (typeof (js_obj[nodeName]) == "undefined") {
	                    js_obj[nodeName] = setJsonObj(item);
	                } else {
	                    if (typeof (js_obj[nodeName].push) == "undefined") {
	                        var old = js_obj[nodeName];
	                        js_obj[nodeName] = [];
	                        js_obj[nodeName].push(old);
	                    }
	                    js_obj[nodeName].push(setJsonObj(item));
	                }
	            }
	        }
	        return js_obj;
	    }*/
    }



    return UWA.namespace('DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServicesWithDisplayName', FilterExpressionXMLServicesWithDisplayName);
}
);

/*jshint esversion: 6 */
define(
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorModel',
		[
			'UWA/Core',
			'UWA/Controls/Abstract',
			'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
			'DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServices',
			'DS/ConfiguratorPanel/scripts/Models/FilterExpressionXMLServicesWithDisplayName',
			'DS/ConfiguratorPanel/scripts/Utilities',
			'DS/Utilities/Utils'
			],
			function (UWA, Abstract, ConfiguratorVariables, FilterExpressionXMLServices, FilterExpressionXMLServicesWithDisplayName, Utilities, Utils) {

			'use strict';

			/* refactor */
			function _unselectCriteria ( model, feature, criteria, min, newState,excludedTypes) {
				var hasUnSelected = false;
				var unselect = function (feature) {
					if( UWA.is(feature,'object')) {
						var selectedoptions = feature.options.filter( option => criteria.filter( crit => option.ruleId === crit.Id).length > 0);
						if(selectedoptions.length >= min ) {
							hasUnSelected = true;
							if(UWA.is(newState)) {
								selectedoptions.forEach(function(option) {
									model.setStateWithId(option.ruleId, newState);
								});
							}

						}
					}
				};

				if(UWA.is(feature)) {
					unselect(feature);
				}else if(UWA.is(model.getDictionary().features, 'array')) {
					// UWA.Json.path: use query to selected options id
					model.getDictionary().features.forEach(function(feature){
						if(excludedTypes && excludedTypes.length > 0 && excludedTypes.indexOf(feature.type) != -1){
								return;
						}
							unselect(feature);
					});
				}

				return hasUnSelected;
			}

			function _checkCriteriaState(model, feature, includeStates, excludeStates, min) {
				var hasIncluded = false;
				var hasExluded = false;
				if(UWA.is(feature,'object')) {
					var selectedoptions = feature.options;
					var count = 0;
					feature.options.forEach(function(option) {
						var state = model._cacheIdWithState[option.ruleId];
						if(includeStates.indexOf(state) > -1) {
							count++;
						}else if(excludeStates.indexOf(state) > -1) {
							hasExluded = true;
						}
					});
					if(count >= min) {
						hasIncluded = true;
					}
				}
				return hasIncluded && !hasExluded;
			}

			var ConfiguratorModel = Abstract.extend({
				// Members
				_appFunc : {
					multiSelection: ConfiguratorVariables.str_yes,
					selectionMode_Build: ConfiguratorVariables.str_yes,
					selectionMode_Refine:	ConfiguratorVariables.str_yes,
					rulesMode_ProposeOptimizedConfiguration:	ConfiguratorVariables.str_no,
					rulesMode_SelectCompleteConfiguration:	ConfiguratorVariables.str_no,
					rulesMode_EnforceRequiredOptions:	ConfiguratorVariables.str_yes,
					rulesMode_DisableIncompatibleOptions:	ConfiguratorVariables.str_yes
				},

				_appRulesParams : {
					multiSelection: ConfiguratorVariables.str_false,
					selectionMode: ConfiguratorVariables.selectionMode_Build,
					rulesMode: ConfiguratorVariables.RulesMode_EnforceRequiredOptions,
					rulesActivation: ConfiguratorVariables.str_true,
					completenessStatus: ConfiguratorVariables.Unknown,
					rulesCompliancyStatus: ConfiguratorVariables.Unknown
				},
				enablePrimaryEdition: ConfiguratorVariables.str_true,
				_dictionaryJson : '',   //contain all datas (features, options, attributs...)
				_dictionaryWithRules : true, // check for the dictionary if it contains rules along with variants,options..
				_configurationCriteria : [],
				_tempconfigurationCriteria : [],
				_variantVisibilty : [],

				_allVariants :0,
				_mustSelectFeatureNumber : 0,
				_unSelectFeatureNumber : 0,
				_conflictingFeaturesNumber : 0,
				_rulesDeductionFeatureNumber : 0,

				_listOfListOfConflictingImpliedRules : [],
				_listOfRefineSelectionMode : {},
				_listOfListOfConflictingIds : [],
				_defaults : [],
				_defaultFromDico : [],
				_rulesConsistency : true,

				_cacheIdWithState : {},
				_cachePreviousCriteria : {},
				_cacheSolveCriteria : {},
				_cacheIdWithValue : {},
				_cacheUpdateView : {},
				_cacheUpdateViewOption : {},
				_cacheUIUpdated : {},
				_cacheRuleIdWithName : {},
				_tempcacheIdWithState : {},
				_cacheIdWithPrice : {},
				_cacheValidate : {},
				_totalPrice : '0.0',
				_cacheFeatures: null,
				_cacheOption: null,

				_cacheOptionIdWithFeatureId : {},
				_cacheFeatureIdWithChosenStatus : {},
				_cacheFeatureIdWithStatus: {},
				_cacheFeatureIdWithRulesStatus :{},
				_cacheFeatureIdWithUserSelection:{},
				_cacheFeatureIdWithCommercialStatus: {},
				_cacheSelectionID:{},
				_modelEvents: null,
				_readOnly: false,
				_isSearchActive : false,
				_enableValidation : false,
				_initialLoadStatus : false,
				_initialLoad:[],
				_BuildModeCriteria: [],
        		_modelVersionInfo: {},
				_pcId : "",
				_variantWithSelection : [],
				_variantForDiagnosis : "",
				_configCriteriaUpdated : false,
				_dignosedVariant : [],
				_withDiagnosis : true,
				_defaultComputationTimeout : 5,
				_useAsyncRuleLoad: false,
				_featureLevelSelectionMode : [],
				sortPreference : {sortAttribute : 'sequenceNumber', sortOrder: 'ASC'}, //added to persist sorting in the PC Panel
				/**
				 * @description
				 * <blockquote>
				 * <p>Initialize the ConfiguratorModel with some options</p>
				 * </blockquote>
				 *
				 * @memberof module:DS/ENOXConfiguratorUX/ConfiguratorPanel#
				 *
				 * @param {Object} options - Available options.
				 * @param {Object} options.appFunc - JSON that shows what is allowed on the panel
				 * @param {Object} options.appRulesParams - JSON to initialize the panel
				 * @param {Object} options.configuration - JSON of a configuration
				 * @param {Object} options.modelEvents
				 *
				 */
				init: function (options) {
					var that = this;

					this._dictionaryJson = '';   //contain all datas (features, options, attributs...)
					this._configurationCriteria = [];
					this._tempconfigurationCriteria = [];
					this._variantVisibilty = [];
					this._allConfigCriteria = [];

					this._allVariants =0;
					this._mustSelectFeatureNumber = 0;
					this._unSelectFeatureNumber = 0;
					this._conflictingFeaturesNumber = 0;
					this._rulesDeductionFeatureNumber = 0;

					this._listOfListOfConflictingImpliedRules = [];
					this._listOfRefineSelectionMode = {};
					this._listOfListOfConflictingIds = [];
					this._defaults = [];
					this._defaultFromDico = [];
					this._rulesConsistency = true;

					this._cacheIdWithState = {};
					this._cachePreviousCriteria = {};
					this._cacheSolveCriteria = {};
					this._cacheIdWithValue = {};
					this._cacheUpdateView = {};
					this._cacheUpdateViewOption = {};
					this._cacheUIUpdated = {};
					this._cacheRuleIdWithName = {};
					this._tempcacheIdWithState = {};
					this._cacheIdWithPrice = {};
					this._cacheValidate = {};
					this._totalPrice = '0.0';
					this._cacheFeatures= null;
					this._cacheOption= null;

					this._cacheOptionIdWithFeatureId = {};
					this._cacheFeatureIdWithChosenStatus = {};
					this._cacheFeatureIdWithStatus= {};
					this._cacheFeatureIdWithRulesStatus ={};
					this._cacheFeatureIdWithUserSelection={};
					this._cacheFeatureIdWithCommercialStatus={};
					this._cacheSelectionID={};
					this._modelEvents= null;
					this._readOnly= false;
					this._isSearchActive = false;
					this._enableValidation = false;
					this._initialLoadStatus = false;
					this._initialLoad=[];
					this._BuildModeCriteria= [];
					this._modelVersionInfo= {};
					this._pcId = "";
					this._bcId = "";
					this._bcSelectedCriteria = [];
					this._variantWithSelection = [];
					this._firstSelection = false;
					this._resetFirstSelection = false;
					this._variantForDiagnosis = "";
					this._configCriteriaUpdated = false;
					this._dignosedVariant = [];
					this._withDiagnosis = true;


					//TODO : initialize appFunc and appRulesParams with the ones given as parameters

					if(options.appFunc) {
						if(options.appFunc.multiSelection)
							this._appFunc.multiSelection = options.appFunc.multiSelection;
						if(options.appFunc.selectionMode_Build)
							this._appFunc.selectionMode_Build = options.appFunc.selectionMode_Build;
						if(options.appFunc.selectionMode_Refine)
							this._appFunc.selectionMode_Refine = options.appFunc.selectionMode_Refine;
						if(options.appFunc.rulesMode_ProposeOptimizedConfiguration)
							this._appFunc.rulesMode_ProposeOptimizedConfiguration = options.appFunc.rulesMode_ProposeOptimizedConfiguration;
						if(options.appFunc.rulesMode_SelectCompleteConfiguration)
							this._appFunc.rulesMode_SelectCompleteConfiguration = options.appFunc.rulesMode_SelectCompleteConfiguration;
						if(options.appFunc.rulesMode_EnforceRequiredOptions)
							this._appFunc.rulesMode_EnforceRequiredOptions = options.appFunc.rulesMode_EnforceRequiredOptions;
						if(options.appFunc.rulesMode_DisableIncompatibleOptions)
							this._appFunc.rulesMode_DisableIncompatibleOptions = options.appFunc.rulesMode_DisableIncompatibleOptions;
					}
					if(options.appRulesParams){
						if(options.appRulesParams.multiSelection)
							this._appRulesParams.multiSelection = options.appRulesParams.multiSelection;
						if(options.appRulesParams.selectionMode)
							this._appRulesParams.selectionMode = options.appRulesParams.selectionMode;

						this._appRulesParams.rulesMode = (options.appRulesParams.rulesMode && options.appRulesParams.rulesActivation === ConfiguratorVariables.str_true) ? options.appRulesParams.rulesMode : ConfiguratorVariables.RulesMode_EnforceRequiredOptions;

						if(options.appRulesParams.rulesActivation)
							this._appRulesParams.rulesActivation = options.appRulesParams.rulesActivation;
						if(options.appRulesParams.completenessStatus)
							this._appRulesParams.completenessStatus = options.appRulesParams.completenessStatus;
							else{
								this._appRulesParams.completenessStatus = "Partial";
							}
						if(options.appRulesParams.rulesCompliancyStatus)
							this._appRulesParams.rulesCompliancyStatus = options.appRulesParams.rulesCompliancyStatus;
							this.enablePrimaryEdition = options.enablePrimaryEdition;
					}
					if (options.modelEvents)
						this._modelEvents = options.modelEvents;

					if (options.configuration) {
						//Remove all the KeyIn selections from the configuration...
						for (var t = 0; t < options.configuration.length; t++) {
							if (options.configuration[t].Id && options.configuration[t].Id.indexOf("KeyIn_") !== -1) {
								options.configuration.splice(t, 1);
								t--;
							}
						}

						//...Then, set the ConfigCriteria
						this.setConfigurationCriteria(Utilities.convertPersistedStatesToStatesInConfigCriteria(options.configuration),"","",true);
					}
					if(options.pcId)
						this._pcId = options.pcId;

					if(options.bcId)
						this._bcId = options.bcId;

					if(options.bcSelectedCriteria && options.bcSelectedCriteria.length>0){
						this._bcSelectedCriteria = options.bcSelectedCriteria;
					}
					this.setValidationFlag(options.enableValidation);

					if(options.readOnly)
						this.setReadOnlyFlag(options.readOnly);

					if(options.manageDefaultVersion) {
						that._manageDefaultVersion = options.manageDefaultVersion; //'V2'
					}

					if(options.useAsyncRuleLoad) {
						that._useAsyncRuleLoad = options.useAsyncRuleLoad;
					}

				},

				/**
				 * Getters/Setters
				 *
				 */
				getAppFunc: function() {
					return this._appFunc;
				},

				getMultiSelectionState: function () {
					return this._appRulesParams.multiSelection;
				},
				setMultiSelectionState: function (newState) {	//newState needs to be "true" or "false" strings
					this._appRulesParams.multiSelection = newState;
				},

				getAllConfigCriteria : function () {
					return this.getConfigurationCriteria();
				},
				resetCriteria: function () {
					this._cacheIdWithState = {};
					this._cacheIdWithValue = {};
				},
				getConfigurationCriteria: function () {
					return this._configurationCriteria;
				},
				getSelectedOptionsJSONModel: function (PCSave) {
					var that = this;
					var JSONModel = [];
					this.getDictionary().features.forEach(function(feature) {
						// Variant Value / Option
						if((feature.type === "Variant") || (feature.type === "VariabilityGroup")) {
							feature.options.forEach(option => {
								if(UWA.is(that._cacheIdWithState[option.ruleId]) &&
									//Dismiss => save incompatible, dismiss
									(that.getFeatureSelectionMode(feature) === ConfiguratorVariables.feature_SelectionMode_Dismiss &&
										(that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Incompatible ||
										that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Dismissed
										)
									) ||
									// R14 IR ??? dismissed are save in dismiss mode !
									//Others => save required, default, selected, chosen
									( !(that.getFeatureSelectionMode(feature) === ConfiguratorVariables.feature_SelectionMode_Dismiss) &&
										(	that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Required ||
											that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Default ||
											that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Selected ||
											that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Chosen ||
											that._cacheIdWithState[option.ruleId] === ConfiguratorVariables.Dismissed
										)
									)
								) {
									if(PCSave) {
										JSONModel.push({
											Id: option.ruleId,
											State: that._cacheIdWithState[option.ruleId]
										});
									}else {
										JSONModel.push({
											id: option.ruleId,
											status: that._cacheIdWithState[option.ruleId]
										});
									}
								}
							});

						}else if (feature.type === "Parameter" && UWA.is(that.getValueWithId(feature.ruleId)) && UWA.is(that.getValueWithId(feature.ruleId).NumericalValue,'number')
						 && (	that._cacheIdWithState[feature.ruleId] === ConfiguratorVariables.Required ||
							that._cacheIdWithState[feature.ruleId] === ConfiguratorVariables.Selected ||
							that._cacheIdWithState[feature.ruleId] === ConfiguratorVariables.Chosen ||
							that._cacheIdWithState[feature.ruleId] === ConfiguratorVariables.Default
						)) {
							// Variant Param
							var value = that.getValueWithId(feature.ruleId).NumericalValue;
							if(feature.unit)
								value += " " + feature.unit;
							if(PCSave && value) {
								JSONModel.push({
									Id: feature.ruleId,
									Value: value.toString(),
									status: that._cacheIdWithState[feature.ruleId]
								});
							} else if (value) {
								JSONModel.push({
									id: feature.ruleId,
									value: value.toString(),
									status: that._cacheIdWithState[feature.ruleId]
								});
							}
						}


					});


					return JSONModel;
				},
				/* need to refactor getDismissed getChoosen ... */
				getChosenConfigurationCriteria :function(selected){
					var chosenCriteria = [];
					for (var id in this._cacheIdWithState) {
						if (this._cacheIdWithState.hasOwnProperty(id)) {
							if(this._cacheIdWithState[id] === ConfiguratorVariables.Chosen ||
								( selected &&
									(this._cacheIdWithState[id] === ConfiguratorVariables.Selected ||
										this._cacheIdWithState[id] === ConfiguratorVariables.Default ||
										this._cacheIdWithState[id] === ConfiguratorVariables.Required
									)
								)
							){
								chosenCriteria.push({Id : id, State : this._cacheIdWithState[id]});
							}
					  }
					}
					return chosenCriteria;
				},
				/* need to refactor getDismissed getChoosen ... */
				getDismissedConfigurationCriteria : function(incompatible) {
					var dismissedCriteria = [];
					for (var id in this._cacheIdWithState) {
						if (this._cacheIdWithState.hasOwnProperty(id)) {
							if(this._cacheIdWithState[id] === ConfiguratorVariables.Dismissed ||
								(incompatible &&
									this._cacheIdWithState[id] === ConfiguratorVariables.Incompatible
								)
							){
								dismissedCriteria.push({Id : id, State : this._cacheIdWithState[id]});
							}
					  }
					}
					return dismissedCriteria;
				},
				validateConfigurationCriteria : function(newConfigCriteria){
					for (var i = 0; i < newConfigCriteria.length; i++) {
						if(newConfigCriteria[i].state === ConfiguratorVariables.Selected){
							this._cacheIdWithState[newConfigCriteria[i].Id] = ConfiguratorVariables.Chosen;
						}
					}
				},
				setSelectedConfigurationCriteria : function(newConfigCriteria, idsToDiagnose){
					this.setConfigCriteriaUpdated(false);
					if(idsToDiagnose && idsToDiagnose.length > 0){
						for (var i = 0; i < idsToDiagnose.length; i++) {
							if(newConfigCriteria[idsToDiagnose[i]] !== this._allConfigCriteria[idsToDiagnose[i]]){
								this._cacheIdWithState[idsToDiagnose[i]] = newConfigCriteria[idsToDiagnose[i]];
								this._allConfigCriteria[idsToDiagnose[i]] = newConfigCriteria[idsToDiagnose[i]];
								this.setConfigCriteriaUpdated(true);
							}
						}
					}
				},
				isStatusUpdated: function(criteria){
					var updateFlag = false;
					if(this._cacheIdWithState[criteria.Id] !== criteria.State){
						this._cacheIdWithState[criteria.Id] = criteria.State;
						updateFlag = true;
						this.setConfigCriteriaUpdated(true);
					}else if(this.getUpdateRequiredOption(criteria.Id)){
						updateFlag = true;
						this.setConfigCriteriaUpdated(true);
					}
					return updateFlag;
				},
				setConfigurationCriteria: function (newConfigCriteria, answerMethod, IdsToDignose) {
					this._configurationCriteria = [];
					this._allConfigCriteria = [];
					this._variantWithSelection = [];
					this._cacheIdWithState = {};
					for (var i = 0; i < newConfigCriteria.length; i++) {
						var featureID = this.getFeatureIdWithOptionId(newConfigCriteria[i].Id) || newConfigCriteria[i].Id;
						var featureType = this.getFeatureType(newConfigCriteria[i].Id);
						var updateFlag = false;
						if(newConfigCriteria[i].State){
							if(IdsToDignose && IdsToDignose.length > 0){	//"solveAndDiagnose"
								for (var j = 0; j < IdsToDignose.length; j++) {
									if(IdsToDignose[j] === newConfigCriteria[i].Id){
										updateFlag = this.isStatusUpdated(newConfigCriteria[i]);
									}
								}
							}else {	//"solve" OR "solveAndDiagnoseAll"
								updateFlag = this.isStatusUpdated(newConfigCriteria[i]);
								if(this._cacheIdWithState[newConfigCriteria[i].Id] !== "Unselected"){
									updateFlag = true;
								}
							}
							var criteriaData = {};
							if(featureType === 'Value'){
								criteriaData.Criterion = this.getFeatureIdWithOptionId(newConfigCriteria[i].Id);
								criteriaData.Id = newConfigCriteria[i].Id;
								criteriaData.State = this._cacheIdWithState[newConfigCriteria[i].Id];
							}else if(featureType === "Option"){
								criteriaData.Id = newConfigCriteria[i].Id;
								criteriaData.Value = newConfigCriteria[i].Value? newConfigCriteria[i].Value:true;
								criteriaData.State = this._cacheIdWithState[newConfigCriteria[i].Id];
							}else if(featureType === "Parameter"){
								criteriaData.Id = newConfigCriteria[i].Id;
								criteriaData.NumericalValue = newConfigCriteria[i].NumericalValue;
								criteriaData.State = this._cacheIdWithState[newConfigCriteria[i].Id];
								if((UWA.is(newConfigCriteria[i].ValueMax) && UWA.is(newConfigCriteria[i].ValueMax))){
									criteriaData.ValueMax = newConfigCriteria[i].ValueMax;
									criteriaData.ValueMin = newConfigCriteria[i].ValueMin;
								}
							}else { // Variant or Option Group or featureType undefined (first open)
								criteriaData.Id = newConfigCriteria[i].Id;
								criteriaData.State = this._cacheIdWithState[newConfigCriteria[i].Id];
								if(UWA.is(newConfigCriteria[i].NumericalValue,"number")){
									criteriaData.NumericalValue = newConfigCriteria[i].NumericalValue;
								}

							}
							if(Object.keys(criteriaData).length > 0){
								this._allConfigCriteria.push(criteriaData);
								this._configurationCriteria.push(criteriaData);
							}
							
							this.setUpdateRequiredOption(newConfigCriteria[i].Id,updateFlag);
							if(!this.getUpdateRequired(featureID)){
								this.setUpdateRequired(featureID, updateFlag);
							}
							//patch for getxml : checkLevelOfSelectionsInFeature
							var variantWithSelection = false;
							if(this._allConfigCriteria[i].State === ConfiguratorVariables.Required || this._allConfigCriteria[i].State === ConfiguratorVariables.Chosen || this._allConfigCriteria[i].State === ConfiguratorVariables.Default || this._allConfigCriteria[i].State === ConfiguratorVariables.Selected){
								if(featureID !== this._allConfigCriteria[i].Id){
									variantWithSelection = true;
								}
							}
							if(!this.getVariantWithSelection(featureID)){
								this.setVariantWithSelection(featureID, variantWithSelection);
							}

							this._cacheIdWithValue[newConfigCriteria[i].Id] =  newConfigCriteria[i];
							delete this._cacheIdWithValue.State;

						}else{
							if(UWA.is(newConfigCriteria[i].MaxValue,'number') && UWA.is(newConfigCriteria[i].MinValue,'number')){
								this._allConfigCriteria.push({
									Id : newConfigCriteria[i].Id, 
									MaxValue : newConfigCriteria[i].MaxValue,
									MinValue : newConfigCriteria[i].MinValue
								});
								this._cacheIdWithValue[newConfigCriteria[i].Id] =  newConfigCriteria[i];
							}
						}
					}
					this._cachePreviousCriteria = this._cacheIdWithState;
					if(answerMethod === "solve"){
					 this._cacheSolveCriteria = JSON.parse(JSON.stringify(this._cacheIdWithState));
					}
				},
				setUIUpdated: function(id, flag){
					this._cacheUIUpdated[id] = flag;
				},
				getUIUpdated: function(id){
					return this._cacheUIUpdated[id];
				},
				setUpdateRequired : function(id, flag){
					this._cacheUpdateView[id] = flag;
				},

				getUpdateRequired : function(id){
					return this._cacheUpdateView[id];
				},
				setUpdateRequiredOption : function(id, flag){
					this._cacheUpdateViewOption[id] = flag;
					if(!flag){
						this.setUIUpdated(id, flag);
					}
				},

				getUpdateRequiredOption : function(id){
					return this._cacheUpdateViewOption[id];
				},
				getSolveConfigurationCriteria : function(){
					return this._cacheSolveCriteria;
				},
				getPCId : function(){
					return this._pcId;
				},

				getBCId : function(){
					return this._bcId;
				},

				getBCSelectedCriteria : function(){
					return this._bcSelectedCriteria;
				},

				getConflictingFeatures: function () {
					return this._listOfListOfConflictingIds;
				},
				isAnOption : function(id) {

					if(this._cacheOption == undefined)
					{
						//populate cache first
						this._cacheOption = {};
						var dictionary = this.getDictionary().features;

						for (var i = 0; i < dictionary.length; i++) {
							for (var j = 0; j < dictionary[i].options.length; j++) {
								this._cacheOption[dictionary[i].options[j].ruleId] = true;
							}
						}
					}

					if(this._cacheOption[id] != undefined)
						return true;
					return false;

					//return false;
				},

				isPresent : function(id, array){
					var flag = false;
					if(array && array.length > 0){
						for (var i = 0; i < array.length; i++) {
							if(array[i] === id){
								flag = true; break;
							}
						}
					}
					return flag;
				},

				setConflictingFeatures: function (conflictingOptions) {
					if(UWA.is(conflictingOptions,'array')) {
						// r14 IR-1449962-3DEXPERIENCER2026x: impact of new solver state
						this._listOfListOfConflictingIds = conflictingOptions.map( conflictionOption => conflictionOption.Id );
						this.setNumberOfConflictingFeatures(conflictingOptions.length);
					}
					else {
						this._listOfListOfConflictingIds = [];
						this.setNumberOfConflictingFeatures(0);
					}

				},
				isConflictingOption: function(optionId)
				{
					if(!this._listOfListOfConflictingIds ||  this._appRulesParams.rulesMode === 'No rule applied') return false;
					var numLists = this._listOfListOfConflictingIds.length;
					var conflictId = "";
					if(UWA.is(optionId,'array')){
						conflictId = optionId[0];
					}else{
						conflictId = optionId;
					}
					for(var i=0; i< numLists; i++)
					{
						if (this._listOfListOfConflictingIds[i] === conflictId){
							return true;
						}
					}
					return false;

				},
				getImpliedRules: function () {
					return this._listOfListOfConflictingImpliedRules;
				},

				setImpliedRules: function (impliedRules) {
					this._listOfListOfConflictingImpliedRules = impliedRules;
				},
				getRulesConsistency: function () {
					return this._rulesConsistency;
				},
				setRulesConsistency: function (newRulesConsistency) {
					this._rulesConsistency = newRulesConsistency;
				},

				getSelectionMode: function () {
					return this._appRulesParams.selectionMode;
				},
				setSelectionMode: function (newMode) {
					this._appRulesParams.selectionMode = newMode;

					if (this.getCompletenessStatus() == ConfiguratorVariables.Hybrid && this._appRulesParams.selectionMode == ConfiguratorVariables.selectionMode_Build)
						this.setCompletenessStatus(ConfiguratorVariables.Partial);
					else
						if (this.getCompletenessStatus() == ConfiguratorVariables.Partial && this._appRulesParams.selectionMode == ConfiguratorVariables.selectionMode_Refine)
							this.setCompletenessStatus(ConfiguratorVariables.Hybrid);

					this._modelEvents.publish( {
						event:	'ComputeConfigExpression'
					});
					this._modelEvents.publish({event : "pc-changed"});
				},

				getRulesMode: function () {
					return this._appRulesParams.rulesMode;
				},
				setRulesMode: function (newMode) {
					this._appRulesParams.rulesMode = newMode;
					// R14: In Complete Mode, we want to clean up Multi Select Variants & remove exclude mode
					if(newMode === 'RulesMode_SelectCompleteConfiguration') {
					}
					//when rules mode change => reset feature selection mode
					// tracker API
					this._modelEvents.publish({event:	'configurator-rule-mode-updated',  data: newMode });
				},

				getRulesActivation: function () {
					return this._appRulesParams.rulesActivation;
				},
				setRulesActivation: function (newMode) {
					if (newMode == ConfiguratorVariables.str_false) {

						for (var i = 0; i < this._configurationCriteria.length; i++) {
							if(this._configurationCriteria[i].State != ConfiguratorVariables.Chosen && this._configurationCriteria[i].State != ConfiguratorVariables.Unselected)
								this._configurationCriteria[i].State = ConfiguratorVariables.Unselected;
							this._cacheIdWithState[this._configurationCriteria[i].Id] = this._configurationCriteria[i].State;
						}
					}
					this._appRulesParams.rulesActivation = newMode;
				},

				getCompletenessStatus: function () {
					return this._appRulesParams.completenessStatus;
				},
				setCompletenessStatus: function (newStatus) {
					this._appRulesParams.completenessStatus = newStatus;

					this._modelEvents.publish( {
						event:	'OnCompletenessStatusChange',
						data:	{value : newStatus}
					});
				},
				getFeatureIdWithMandStatus: function(id)
				{
					var variantState = this.getStateWithId(id),
						feature = this.getDictionary().features.find(feature => feature.ruleId === id),
						mandatory = ( feature.type !== 'Parameter' && (feature.selectionCriteria === 'Mandatory' || feature.selectionCriteria === true || variantState === ConfiguratorVariables.Required || feature.selectionCriteria === 'Primary') ),
						that = this,
						selectionmode = this.getFeatureSelectionMode(feature.ruleId);

					feature.options.forEach(option => {
						var state = that.getStateWithId(option.ruleId);
						if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
						&& ( state === ConfiguratorVariables.Chosen || state === ConfiguratorVariables.Selected || state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default ))
						|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss)
						)
						mandatory = false;
					});
					return mandatory;
				},

				setFeatureIdWithChosenStatus: function(id, status){
					this._cacheFeatureIdWithChosenStatus[id] = status;
				},
				getFeatureIdWithChosenStatus: function(id){
					return this._cacheFeatureIdWithChosenStatus[id];
				},
				updateFeatureIdWithChosenStatus: function(id, status)
				{
					var that = this , WithChosenStatus = false,
					feature = this.getDictionary().features.find(feature => feature.ruleId === id),
					selectionmode = this.getFeatureSelectionMode(feature.ruleId);

					if(feature.type === 'Parameter' && that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Chosen )
						WithChosenStatus = true;
					else
						feature.options.forEach(option => {
							var state = that.getStateWithId(option.ruleId);
							if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
							&& ( state === ConfiguratorVariables.Chosen))
							|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss && state === ConfiguratorVariables.Dismissed)
							)
							WithChosenStatus = true;
						});

					this.setFeatureIdWithChosenStatus(id, WithChosenStatus);
				},

				getRulesCompliancyStatus: function () {
					return this._appRulesParams.rulesCompliancyStatus;
				},
				setRulesCompliancyStatus: function (newStatus) {
					this._appRulesParams.rulesCompliancyStatus = newStatus;
				},

				getDictionary: function () {
					return this._dictionaryJson;
				},
				setDictionary: function (newDictionary) {
					if(newDictionary){
						if(newDictionary._version === "3.0" || newDictionary._version === "3.1"){
							this._dictionaryJson = this._getCompatibleDicoInV1(newDictionary);
						}else{
							this._dictionaryJson = newDictionary;
						}
						this._dictionaryJson._version = "1.0";
					var Features = this._dictionaryJson.features;

					for (var i = 0; i < Features.length; i++) {
						this._cacheOptionIdWithFeatureId[Features[i].ruleId] = Features[i].ruleId;
						for (var j = 0; j < Features[i].options.length; j++) {
							this._cacheOptionIdWithFeatureId[Features[i].options[j].ruleId] = Features[i].ruleId;
							this._cacheOptionIdWithFeatureId[Features[i].options[j].rel_id] = Features[i].ruleId;
						}
						// init feature selection mode
						this.resetFeatureSelectionMode(Features[i]);
					}
					}
				},

				setRules : function(dictionary){
					var dico_inside = (dictionary.portfolioClasses) ? dictionary.portfolioClasses.member[0].portfolioComponents.member[0] : [];
					this._modelID = dico_inside.id;
					var flatRules = (dico_inside.rules && dico_inside.rules.member) ? dico_inside.rules.member : [];
					for (var i = 0; i < flatRules.length; i++) {
						this._cacheRuleIdWithName[flatRules[i].id] = flatRules[i].attributes._title || flatRules[i].attributes._name || "";
					}
				},
				_getCompatibleDicoInV1 : function(dictionary){
					var newDictionary = {};
					var features = [];
					var dico_inside = (dictionary.portfolioClasses) ? dictionary.portfolioClasses.member[0].portfolioComponents.member[0] : [];
					this._modelID = dico_inside.id;
	        		var flatVariants = (dico_inside.variants && dico_inside.variants.member) ? dico_inside.variants.member : [];
	        		var flatVGs = (dico_inside.variabilityGroups && dico_inside.variabilityGroups.member) ? dico_inside.variabilityGroups.member : [];
					var flatParamaters = (dico_inside.parameters && dico_inside.parameters.member) ? dico_inside.parameters.member : [];

					for (var i = 0; i < flatVariants.length; i++) {
							this.addMinifiedVariantAndValueInRes(features, flatVariants[i], "Single");
					}
					for (var i = 0; i < flatVGs.length; i++) {
							this.addMinifiedVGInRes(features, flatVGs[i], "Multiple");
					}
					features = features.sort((itemA, itemB) => {
						var sortAttribute = this.sortPreference ? this.sortPreference.sortAttribute : 'sequenceNumber';
						var sortOrder =  this.sortPreference ? this.sortPreference.sortOrder : 'ASC';
						if(sortOrder === 'ASC') {
							return Utils.compare(itemA[sortAttribute], itemB[sortAttribute]);
						}
						return Utils.compare(itemB[sortAttribute], itemA[sortAttribute]);
					});
					for (var i = 0; i < flatParamaters.length; i++) {
							this.addMinifiedParametersInRes(features, flatParamaters[i]);
					}
					this.setRules(dictionary);
					const primary = features.filter(item => item.selectionCriteria === "Primary");
					const nonPrimary = features.filter(item => item.selectionCriteria !== "Primary"); 
					features =  [...primary, ...nonPrimary]; 
					newDictionary.features = features;
					return newDictionary;
				},

				getRuleDisplayNameWithId : function(id){
					return this._cacheRuleIdWithName[id];
				},

				addMinifiedParametersInRes : function(features, parameter){
					if(parameter.kind === "instance"){
						var feature = {};
						feature.ruleId = parameter.id;
						feature.sequenceNumber = parameter.attributes._sequenceNumber ? parameter.attributes._sequenceNumber : 1;
						feature.commercial = parameter.attributes._commercial ? parameter.attributes._commercial : false;
						feature.options = [];
						feature.name =  parameter.attributes._name || "";
						feature.displayName =  parameter.attributes._title || feature.name;
						feature.description = parameter.attributes._description || "";
					feature.selectionCriteria = parameter.attributes._usage || "Optional";
						feature.selectionType = "Parameter";
						feature.type = "Parameter";
						feature.image = parameter.attributes._image || "";

						//FD02
						var minValueAndUnit;
						var minValue;
						var minUnit;

						var maxValueAndUnit;
						var maxValue;
						var maxUnit;

						if(parameter.attributes._minValue){
							minValueAndUnit = parameter.attributes._minValue.split(" ");
							minValue = minValueAndUnit[0];
							minUnit = minValueAndUnit[1];
						}
						if(parameter.attributes._maxValue){
							maxValueAndUnit = parameter.attributes._maxValue.split(" ");
							maxValue = maxValueAndUnit[0];
							maxUnit = maxValueAndUnit[1];
						}
						feature.minValue = minValue ? minValue : 0;
						feature.minUnit = minUnit ? minUnit : "";
						feature.maxValue = maxValue ? maxValue : 0;
						feature.maxUnit = maxUnit ? maxUnit : "";

						//FD03

						feature.stepValue = parameter.attributes._step ? parameter.attributes._step.inputvalue : 1;
						feature.unit = parameter.attributes._unit || feature.minUnit || "";

						feature.defaultValue = parameter.attributes._defaultValue ? parameter.attributes._defaultValue.inputvalue : undefined;
						feature.defaultUnit = parameter.attributes._defaultValue ? parameter.attributes._defaultValue.inputunit : "";

						features.push(feature);
					}
				},

				addMinifiedVariantAndValueInRes : function(features, variant, defaultSelectionType){
					if(variant.kind === "instance"){
						var feature = {};
						feature.ruleId = variant.idref;  // physical id of variant
						feature.sequenceNumber = variant.attributes._sequenceNumber ? variant.attributes._sequenceNumber : 1;
						feature.commercial = variant.attributes._commercial ? variant.attributes._commercial : false;
						feature.options = [];
						feature.name =  variant.attributes._name || "";
						feature.displayName =  variant.attributes._title || feature.name;
						feature.description = variant.attributes._description || "";
						feature.type = "Variant";
						feature.selectionCriteria = variant.attributes._usage;
						feature.selectionType = variant.attributes._selectionType || defaultSelectionType;
						feature.image = variant.attributes._image || "";

						feature.optionPhysicalIds = [];
						var values = variant.values.member;
						for (var i = 0; i < values.length; i += 1) {
									var option = {};
									option.ruleId = values[i].idref; // note: ruleId term not appropriate : tobe changed									
									option.rel_id = values[i].rel_id;  // TODO: CfgBase to stop usage of rel_id
									option.name = values[i].attributes._name ? values[i].attributes._name : "";
									option.displayName = values[i].attributes._title || option.name;
									option.description = values[i].attributes._description || "";
									option.sequenceNumber = values[i].attributes._sequenceNumber ? values[i].attributes._sequenceNumber : 1;
									option.image = values[i].attributes._image ? values[i].attributes._image : "";
									option.selectionCriteria = values[i].attributes._mandatory ? values[i].attributes._mandatory : false;
									option.type = "Value";
									var _default = values[i].attributes._default == true;
									if(_default) {
										this._defaultFromDico.push(option.ruleId);
									}
									feature.optionPhysicalIds.push(values[i].idref);
									feature.options.push(option);
							}
						features.push(feature);
					}
				},

				addMinifiedVGInRes : function(features, variant, defaultSelectionType){
						var feature = {};
						feature.ruleId = variant.id;
						feature.sequenceNumber = variant.attributes._sequenceNumber ? variant.attributes._sequenceNumber : 1;
						feature.commercial = variant.attributes._commercial ? variant.attributes._commercial : false;
						feature.options = [];
						feature.name =  variant.attributes._name || "";
						feature.displayName =  variant.attributes._title || feature.name;
						feature.description = variant.attributes._description || "";
						feature.selectionCriteria = variant.attributes._usage || "Optional";
						feature.type = "VariabilityGroup";
						feature.selectionType = variant.attributes._selectionType || defaultSelectionType;
						feature.image = variant.attributes._image || "";

						var values = variant.options.member ;
						for (var i = 0; i < values.length; i += 1) {
								if(values[i].kind === "instance"){
									var option = {};
									option.ruleId = values[i].idref;
									option.rel_id = values[i].rel_id;  // TODO: CfgBase to stop usage of rel_id
									option.name = values[i].attributes._name ? values[i].attributes._name : "";
									option.displayName = values[i].attributes._title || option.name;
									option.description = values[i].attributes._description || "";
									option.sequenceNumber = values[i].attributes._sequenceNumber ? values[i].attributes._sequenceNumber : 1;
									option.image = values[i].attributes._image ? values[i].attributes._image : "";
									option.selectionCriteria = values[i].attributes._mandatory ? values[i].attributes._mandatory : false;
									option.type = "Option";
									var _default = values[i].attributes._default == true;
									if(_default) {
										this._defaultFromDico.push(option.ruleId);
									}
									feature.optionPhysicalIds = [];
									for (var j = 0; j < values.length; j += 1) {
										if(values[j].kind === "instance"){
											feature.optionPhysicalIds.push(values[j].idref);
										}
									}
									feature.options.push(option);
								}
							}
							features.push(feature);
				},

				setReadOnlyFlag: function (booleanValue) {
					if (booleanValue == true)
						this._readOnly = true;
					else if (booleanValue == false)
						this._readOnly = false;
				},

				getReadOnlyFlag : function() {
					return this._readOnly;
				},

				setAppRulesParam : function (newAppRulesParam) {
					this._appRulesParams = newAppRulesParam;

					if (this._appRulesParams.selectionMode == ConfiguratorVariables.selectionMode_Build)
						this.setRefineSelectionModeForAllFeatures(ConfiguratorVariables.select);
					if (this._appRulesParams.selectionMode == ConfiguratorVariables.selectionMode_Refine)
						this.setRefineSelectionModeForAllFeatures(ConfiguratorVariables.reject);
				},

				getAppRulesParam : function () { return this._appRulesParams; },

				getFeatureIdWithOptionId : function (Id) { return this._cacheOptionIdWithFeatureId[Id]; },
				getCacheOptionsIdWithFeatureId : function () { return this._cacheOptionIdWithFeatureId; },
				setRefineSelectionModeForAllFeatures : function (newMode) {
					for (var key in this._listOfRefineSelectionMode)
						this._listOfRefineSelectionMode[key] = newMode;
				},
				/**********************************************************************/
				/*function to update the state of options (available, chosen,
				required...)                                                          */
				/**********************************************************************/
				getStateWithId : function (Id) {
					return this._cacheIdWithState[Id];
				},

				setStateWithId : function (Id, NewState, NumericalValue) {
					this._cachePreviousCriteria = JSON.parse(JSON.stringify(this._cacheIdWithState));
					if (NewState === ConfiguratorVariables.Range)
						return 0;

					var set = false;
					for (var i = 0; i < this._configurationCriteria.length; i++) {
						if (this._configurationCriteria[i].Id == Id) {

							this._configurationCriteria[i].State = NewState;
							if(UWA.is(NumericalValue,'number')) this._configurationCriteria[i].NumericalValue = NumericalValue;
							else if(UWA.is(this._configurationCriteria[i].NumericalValue)) delete  this._configurationCriteria[i].NumericalValue;
							set = true;
							break;
						}
					}
					if (!set && UWA.is(NumericalValue,'number')) {
						this._configurationCriteria.push({ Id: Id, State: NewState, NumericalValue: NumericalValue });
					}else if (!set)  {
						this._configurationCriteria.push({ Id: Id, State: NewState });
					}

					this._cacheIdWithState[Id] = NewState;

					this.setConfigCriteriaUpdated(true);
				},

				getValueWithId : function (Id) {
					if(this.getRulesMode() === "No rule applied" ) {
						delete this._cacheIdWithValue[Id].MinValue;
						delete this._cacheIdWithValue[Id].MaxValue;
					}
					return this._cacheIdWithValue[Id];
				},

				setValueWithId : function (Id, value) {
					if(this._cacheIdWithValue[Id]) {
						if ( UWA.is(value,'number') )
							this._cacheIdWithValue[Id].NumericalValue = value;
						else if (UWA.is(this._cacheIdWithValue[Id].NumericalValue,'number'))
							delete this._cacheIdWithValue[Id].NumericalValue;
					}
					else if (UWA.is(value,'number')) {						
						this._cacheIdWithValue[Id] = { Id: Id, NumericalValue: value};
					}
				},


				getNumberOfMandFeaturesNotValuated: function () {
					return this._mustSelectFeatureNumber;
				},
				setNumberOfMandFeaturesNotValuated: function (newValue) {
				    var oldValue = this._mustSelectFeatureNumber;
				    this._mustSelectFeatureNumber = newValue;

				    //Event for old ConfiguratorPanel component (the one integrated in PSE)
				    this._modelEvents.publish({
				        event: 'OnMandFeatureNumberChange',
				        data: { value: newValue }
				    });

				    //Event for new ConfigEditor component
				    this._modelEvents.publish({
				        event: 'OnMandVariantNumberChange',
				        data: { value: newValue }
				    });
					 this.setCompletenessStatus(this.CalculateCompletenessStatus());
				},

				CalculateCompletenessStatus : function () {
					var features = this._dictionaryJson.features;
					var mustNotValuated = 0;
					var hybrid = false;
					var cacheFeaturesIdWithSelections = {};
					var cacheFeatureTypes = {};
					var cacheConfigCriteria = {};

					// R14: in Case of Multi Selection Variant Values, we set the completeness status to hybrid
					if(this.hasMultiSelectVariantValues(undefined,false,['VariabilityGroup'])) { //passing excludedTypes - which should not emptying the option groups
						return  ConfiguratorVariables.Hybrid;
					}

					for (var k = 0; k < this._configurationCriteria.length; k++) {

						//Create a cache of the configCriteria
						//	{ IDcriteria : State, ...}

						cacheConfigCriteria[this._configurationCriteria[k].Id] = this._configurationCriteria[k].State;
					}

					for (var i = 0; i < features.length; i++) {

					    if (features[i].selectionCriteria === "Mandatory" || this.getFeatureIdWithMandStatus(features[i].ruleId)) {  //Only consider the Must features

					        //Cache for the Features type :
					        // {
					        //  IDFeature: "Single"/"Multiple", ...
					        // }
					        cacheFeatureTypes[features[i].ruleId] = features[i].selectionType;

					        //One for the Features Selections/rejections number :
					        // {
					        //  IDFeature: {SelectionsNb:0,  UserRejectNb:0}, ...
					        // }
					        cacheFeaturesIdWithSelections[features[i].ruleId] = {
					            SelectionsNb: 0,
					            UserRejectNb: 0
					        };

					        for (var j = 0; j < features[i].options.length; j++) {
					            if (cacheConfigCriteria[features[i].options[j].ruleId] === ConfiguratorVariables.Chosen ||
									cacheConfigCriteria[features[i].options[j].ruleId] === ConfiguratorVariables.Default ||
									cacheConfigCriteria[features[i].options[j].ruleId] === ConfiguratorVariables.Required ||
									cacheConfigCriteria[features[i].options[j].ruleId] === ConfiguratorVariables.Selected ){
					                cacheFeaturesIdWithSelections[features[i].ruleId].SelectionsNb++;
					            }
					            else if (cacheConfigCriteria[features[i].options[j].ruleId] === ConfiguratorVariables.Dismissed) {
					                cacheFeaturesIdWithSelections[features[i].ruleId].UserRejectNb++;
					            }
					        }

					        //If we are on refine, consider the available states as included. Then, we need to count them as selections
					        if (this._appRulesParams.selectionMode === ConfiguratorVariables.selectionMode_Refine && cacheFeaturesIdWithSelections[features[i].ruleId].SelectionsNb === 0) {
					            cacheFeaturesIdWithSelections[features[i].ruleId].SelectionsNb = features[i].options.length - cacheFeaturesIdWithSelections[features[i].ruleId].UserRejectNb;
					        }
					    }

					}

					for (var feature in cacheFeaturesIdWithSelections) {
							if (!hybrid && cacheFeaturesIdWithSelections[feature].SelectionsNb > 1 && cacheFeatureTypes[feature] == "Single") {
								hybrid = true;
							}
							if (cacheFeaturesIdWithSelections[feature].SelectionsNb === 0) {
								mustNotValuated++;
							}
					}

					if(mustNotValuated === 0) {
						if (!hybrid) {
							return ConfiguratorVariables.Complete;
						}
						return ConfiguratorVariables.Hybrid;
					}

					if (hybrid) {
						return ConfiguratorVariables.Hybrid;
					}
					return ConfiguratorVariables.Partial;

				},

				getNumberOfConflictingFeatures: function () {
					return this._conflictingFeaturesNumber;
				},
				setNumberOfConflictingFeatures: function (newValue) {
					this._conflictingFeaturesNumber = newValue;

				    //Event for old ConfiguratorPanel component (the one integrated in PSE)
					this._modelEvents.publish({
					    event: 'OnConflictFeatureNumberChange',
					    data: { value: newValue }
					});

				    //Event for new ConfigEditor component

					this._modelEvents.publish( {
						event:	'OnConflictVariantNumberChange',
						data:	{value : newValue}
					});
				},

				getNumberOfFeaturesChosen: function () {
					return this._chosenFeaturesNumber;
				},
				setNumberOfFeaturesChosen: function (newValue) {
					this._chosenFeaturesNumber = newValue;
					this._modelEvents.publish({
					    event: 'OnChosenVariantNumberChange',
					    data: { value: newValue }
					});
				},

				getFeatureDisplayNameWithId : function(id) {
					var features = this.getDictionary().features;

					for (var i = 0; i < features.length; i++) {
						if (features[i].ruleId == id)
							return features[i].displayName;
						for (var j = 0; j < features[i].options.length; j++) {
							if (features[i].options[j].ruleId == id)
								return features[i].displayName;
						}
					}

					
				},

				getOptionDisplayNameWithId : function(id) {
					var features = this.getDictionary().features;

					for (var i = 0; i < features.length; i++) {
						for (var j = 0; j < features[i].options.length; j++) {
							if (features[i].options[j].ruleId == id)
								return features[i].options[j].displayName;
						}
					}

					
				},

				getXMLExpression : function(options){

					var jsTranObj = new FilterExpressionXMLServices('FilterExpression');

					var json = {
							"configurationCriteria": this.getConfigurationCriteria(),
							"dictionary": this.getDictionary(),
							"app_RulesParam": this.getAppRulesParam(),
							"app_Func": this.getAppFunc(),
              				"modelVersionInfo": this.getModelVersionInfo(),
							"configModel" : this,
							includeDisplayName: options && options.includeDisplayName !== undefined ? !!options.includeDisplayName : true
					};

					var xml = jsTranObj.json2xml_str(json);

					return xml;
				},

				getXMLExpressionWithDisplayName : function(){

					var jsTranObj = new FilterExpressionXMLServicesWithDisplayName('FilterExpression');

					var json = {
							"configurationCriteria": this.getConfigurationCriteria(),
							"dictionary": this.getDictionary(),
							"app_RulesParam": this.getAppRulesParam(),
							"app_Func": this.getAppFunc(),
              				"modelVersionInfo": this.getModelVersionInfo()
					};

					var xml = jsTranObj.json2xml_str(json);

					return xml;
				},

			    /*** Added newly **/

				getModelVersionInfo : function() {
				    return this._modelVersionInfo;
				},

				setModelVersionInfo: function (newModelVersionInfo) {
				    //newModelVersionInfo should contain following entries:
				    //  modelName
				    //  modelVersionName
				    //  modelVersionRevision
                    //It is used to add the modelVersion informations in the XML (filter expression XML that is used for 3DRendering and for PC save)
				    this._modelVersionInfo = newModelVersionInfo;
				},

				setCurrentFilter : function(value){
					this._currentFilter = value;
				},
				getCurrentFilter : function(){
					return this._currentFilter;
				},

				setFeatureIdWithStatus: function(id, status)
				{
					this._cacheFeatureIdWithStatus[id] = status;
				},
				getFeatureIdWithStatus: function(id)
				{
					return this._cacheFeatureIdWithStatus[id];
				},
				updateFeatureIdWithStatus: function(id)
				{

					var that = this , WithUserSelection = false,
					feature = this.getDictionary().features.find(feature => feature.ruleId === id),
					selectionmode = this.getFeatureSelectionMode(feature.ruleId);
					var selectedFeature = false;

					if(feature.type === 'Parameter'
						&& (
							that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Selected
							|| that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Chosen
							|| that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Required
							)
					)
						selectedFeature = true;
					else
						feature.options.forEach(option => {
							var state = that.getStateWithId(option.ruleId);
							if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
							&& ( state === ConfiguratorVariables.Chosen || state === ConfiguratorVariables.Dismissed || state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default || state === ConfiguratorVariables.Selected ))
							|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss )
							)
							selectedFeature = true;
						});


					this.setFeatureIdWithStatus(id, selectedFeature);

				},


				getNumberOfFeaturesNotValuated: function () {
					return this._unSelectFeatureNumber;
				},
				setNumberOfFeaturesNotValuated: function (newValue) {
					var oldValue = this._unSelectFeatureNumber;
					this._unSelectFeatureNumber = newValue;

					this._modelEvents.publish( {
						event:	'OnUnselectedVariantNumberChange',
						data:	{value : newValue}
					});
				},

				setFeatureIdWithRulesStatus: function(id, status)
				{
					this._cacheFeatureIdWithRulesStatus[id] = status;
				},
				getFeatureIdWithRulesStatus: function(id)
				{
					return this._cacheFeatureIdWithRulesStatus[id];
				},
				updateFeatureIdWithRulesStatus: function(id)
				{
					var that = this , WithRules = false,
					feature = this.getDictionary().features.find(feature => feature.ruleId === id),
					selectionmode = this.getFeatureSelectionMode(feature.ruleId);
					if(feature.type === 'Parameter' && that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Required)
						WithRules = true;
					else
						feature.options.forEach(option => {
							var state = that.getStateWithId(option.ruleId);
							if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
							&& ( state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default || state === ConfiguratorVariables.Selected))
							|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss && state === ConfiguratorVariables.Incompatible)
							)
								WithRules = true;
						});

					this.setFeatureIdWithRulesStatus(id, WithRules);
				},

				setFeatureIdWithCommercialStatus: function (id, isCommercial) {
					this._cacheFeatureIdWithCommercialStatus[id] = isCommercial;
				},
				getFeatureIdWithCommercialStatus: function (id) {
					return this._cacheFeatureIdWithCommercialStatus[id];
				},
				updateFeatureIdWithCommercialStatus: function (id, isCommercial) {
					
					var feature = this.getDictionary().features.find(feature => feature.ruleId === id);
					
					this.setFeatureIdWithCommercialStatus(id, feature.commercial);
				},

				setFeatureIdWithUserSelection: function(id, status)
				{
					this._cacheFeatureIdWithUserSelection[id] = status;
				},
				getFeatureIdWithUserSelection: function(id)
				{
					return this._cacheFeatureIdWithUserSelection[id];
				},
				updateFeatureIdWithUserSelection: function(id, status)
				{
					var that = this , WithUserSelection = false,
					feature = this.getDictionary().features.find(feature => feature.ruleId === id),
					selectionmode = this.getFeatureSelectionMode(feature.ruleId);
					if(feature.type === 'Parameter' && that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Chosen)
						WithUserSelection = true;
					else
						feature.options.forEach(option => {
							var state = that.getStateWithId(option.ruleId);
							if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
							&& ( state === ConfiguratorVariables.Chosen))
							|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss && state === ConfiguratorVariables.Dismissed)
							)
							WithUserSelection = true;
						});

					this.setFeatureIdWithUserSelection(id, WithUserSelection);
				},




				getNumberOfFeaturesByRules: function () {
					return this._rulesDeductionFeatureNumber;
				},
				setNumberOfFeaturesByRules: function (newValue) {
					var oldValue = this._rulesDeductionFeatureNumber;
					this._rulesDeductionFeatureNumber = newValue;

					this._modelEvents.publish( {
						event:	'OnRuleNotValidatedNumberChange',
						data:	{value : newValue}
					});
				},

				setSearchStatus: function(value){
					this._isSearchActive = value;
				},
				getSearchStatus : function(){
					return this._isSearchActive;
				},

				setVariantVisibility : function(id,value){
					this._variantVisibilty[id] = value;
				},
				getVariantVisibility : function(id){
					return this._variantVisibilty[id];
				},

				setCurrentSearchData: function(data){
					this._data = data;
				},
				getCurrentSearchData : function(){
					return this._data;
				},

				setIncludedState : function(Id, NewState){
					if (NewState == ConfiguratorVariables.Range)
						return 0;
					this._tempcacheIdWithState[Id] = NewState;
				},

				getIncludedState : function (Id) {
					return this._tempcacheIdWithState[Id];
				},

				setInitialLoadStatus:function(data){
					this._initialLoadStatus = data;
				},

				getInitialLoadStatus:function(){
					return this._initialLoadStatus;
				},

				setLoading:function(id,data){
					this._initialLoad[id] = data;
				},

				getLoading:function(id){
					return this._initialLoad[id];
				},

				setCriteriaBuildMode:function(newConfigCriteria){
					this._BuildModeCriteria = newConfigCriteria;
				},

				getCriteriaBuildMode:function(){
					return this._BuildModeCriteria;
				},

				getVariants : function(){
					return this._allVariants;
				},

				setVariants : function(count){
					this._allVariants = count ? count  : 0;
					this._modelEvents.publish({ event: "OnAllVariantNumberChange", data:{value : this._allVariants}});
				},

				setUserSelectVariantIDs : function(id, flag){
					var flag1 = UWA.typeOf(flag) === "boolean" ? flag : false;
					this._cacheSelectionID[id] = flag1;
				},

				getUserSelectVariantIDs : function(id){
					return this._cacheSelectionID[id];
				},

				updateUserSelectVariantIDs: function(id){
					var that = this , WithUserSelection = false,
					feature = this.getDictionary().features.find(feature => feature.ruleId === id),
					selectionmode = this.getFeatureSelectionMode(feature.ruleId);
					if(feature.type === 'Parameter' && that.getStateWithId(feature.ruleId) === ConfiguratorVariables.Chosen)
						WithUserSelection = true;
					else
						feature.options.forEach(option => {
							var state = that.getStateWithId(option.ruleId);
							if ( (( selectionmode == ConfiguratorVariables.feature_SelectionMode_Single || selectionmode == ConfiguratorVariables.feature_SelectionMode_Multiple || selectionmode == ConfiguratorVariables.feature_SelectionMode_EnforceMultiple )
							&& ( state === ConfiguratorVariables.Chosen || state === ConfiguratorVariables.Dismissed || state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default  ))
							|| ( selectionmode == ConfiguratorVariables.feature_SelectionMode_Dismiss )
							)
							WithUserSelection = true;
						});

					this.setUserSelectVariantIDs(id, WithUserSelection);
				},

				setValidateVariant : function(id, flag){
					var flag1 = UWA.typeOf(flag) === "boolean" ? flag : false;
					this._cacheValidate[id] = flag1;
				},

				getValidateVariant : function(id, flag){
					return this._cacheValidate[id];
				},

				isValidationEnabled : function () {
					return this._enableValidation;
				},

				setValidationFlag : function(flag){
					this._enableValidation = flag ? flag : false;
				},

				setDefaultCriteria : function(data){
					this._defaults = data;
				},

				getDefaultCriteria : function(data){
					return this._defaults;
				},

				resetDefaultCriteria : function () {
					this._defaults = UWA.clone(this._defaultFromDico);
				},

				setVariantWithSelection : function(variant,flag){
					this._variantWithSelection[variant] = flag;
				},
				getVariantWithSelection : function(variant){
					return this._variantWithSelection[variant];
				},
				setVariantForDiagnosis : function(data){
					this._variantForDiagnosis = data;
				},
				getVariantForDiagnosis : function(data){
					return this._variantForDiagnosis;
				},

				getFirstSelection : function(data){
					return this._firstSelection;
				},
				setFirstSelection : function(data){
					this._firstSelection = data;
					this._resetFirstSelection = false;
				},

				setFirstSelectionDirty : function () {
					this._resetFirstSelection = true;
				},

				isFirstSelectionDirty : function () {
					return this._resetFirstSelection;
				},

				setConfigCriteriaUpdated : function(flag){
					this._configCriteriaUpdated = flag ? flag : false;
					if(this._configCriteriaUpdated){
						this._dignosedVariant = [];
					}
				},
				isConfigCriteriaUpdated : function(flag){
					return this._configCriteriaUpdated;
				},
				setDignosedVariant : function(id, flag){
					this._dignosedVariant[id] = flag ? flag : false;
				},
				getDignosedVariant : function(id){
					return this._dignosedVariant[id];
				},
				isSolveWithDiagnose : function(){
					return this._withDiagnosis;
				},
				setSolveWithDiagnose : function(flag){
					this._withDiagnosis = flag;
				},
				getDefaultComputationTimeout : function () {
					var timeout = this._defaultComputationTimeout;
					if(window && window.sessionStorage['solver-default-compute-timeout']) {
						var timeoutFromCache =  window.sessionStorage['solver-default-compute-timeout'];
						if(UWA.is(timeoutFromCache, 'string')) {
							timeoutFromCache = parseInt(timeoutFromCache);
						}
						if(UWA.is(timeoutFromCache, 'number')) {
							timeout = timeoutFromCache;
						}
					}
					return timeout;
				},

				emptyDismissedOptions: function(feature) {
					return _unselectCriteria(this,feature, this.getDismissedConfigurationCriteria(),1,ConfiguratorVariables.Unselected);
				},

				emptyChosenOptions: function(feature) {
					return _unselectCriteria(this,feature, this.getChosenConfigurationCriteria(),1,ConfiguratorVariables.Unselected);
				},

				switchIncludeOptions: function(feature) {
					return _unselectCriteria(this,feature, this.getDismissedConfigurationCriteria(),1,ConfiguratorVariables.Chosen);
				},
				switchExcludeOptions: function(feature) {
					return _unselectCriteria(this,feature, this.getChosenConfigurationCriteria(),1,ConfiguratorVariables.Dismissed);
				},

				switchAllUnselectedToExclude : function () {
					var features = this._dictionaryJson.features;
					if(UWA.is(features,'array')) {
						for (var i = 0; i < features.length; i++) {
							if (this._featureLevelSelectionMode[features[i].ruleId] !== ConfiguratorVariables.feature_SelectionMode_Parameter
								|| this._featureLevelSelectionMode[features[i].ruleId] !== ConfiguratorVariables.feature_SelectionMode_Dismiss
							) {
								if(!this.hasChosenOptions(features[i], false)) {
									this._featureLevelSelectionMode[features[i].ruleId] = ConfiguratorVariables.feature_SelectionMode_Dismiss;
								}						
							}
						}
					}
				},

				switchAllUnselectedToInclude : function () {
					var features = this._dictionaryJson.features;
					if(UWA.is(features,'array')) {
						for (var i = 0; i < features.length; i++) {
							if (this._featureLevelSelectionMode[features[i].ruleId] === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
								if(!this.hasDismissedOptions(features[i], false)) {
									if (features[i].selectionType === ConfiguratorVariables.feature_SelectionMode_Multiple) {
										this._featureLevelSelectionMode[features[i].ruleId] = ConfiguratorVariables.feature_SelectionMode_Multiple;
									} else {
										this._featureLevelSelectionMode[features[i].ruleId] = ConfiguratorVariables.feature_SelectionMode_Single;
									}
								}						
							}
						}
					}
				},

				emptyMultiSelectedVariants: function (feature,excludedTypes) {
					return _unselectCriteria(this, feature, this.getChosenConfigurationCriteria(),2,ConfiguratorVariables.Unselected,excludedTypes);
				},

				hasMultiSelectVariantValues: function (feature, selected,excludedTypes) {
					if(feature) {
						return _checkCriteriaState(this,feature, [ConfiguratorVariables.Chosen, ConfiguratorVariables.Default, ConfiguratorVariables.Required], [ConfiguratorVariables.Dismissed], 2);
					}
					return _unselectCriteria(this,feature, this.getChosenConfigurationCriteria(selected),2,undefined,excludedTypes);
				},

				hasDismissedOptions: function (feature, incompatible) {
					if(!feature) {
						return _unselectCriteria(this, feature, this.getDismissedConfigurationCriteria(incompatible),1);
					}
					var includeCrieria = [ConfiguratorVariables.Dismissed];
					if(incompatible !== undefined && incompatible == true) {
						includeCrieria.push(ConfiguratorVariables.Incompatible);
					}
					return  _checkCriteriaState(this,feature, includeCrieria, [], 1);
				},

				hasIncompactibleOptions: function (feature) {
					var hasIncompatible = _checkCriteriaState(this,feature, [ConfiguratorVariables.Incompatible], [ConfiguratorVariables.Chosen], 1);
					var isRequired = _checkCriteriaState(this,feature, [ConfiguratorVariables.Incompatible, ConfiguratorVariables.Required], [], feature.options.length);
					return hasIncompatible && !isRequired;
				},
				hasSingleSelectVariantValues: function (feature, selected) {
					return _checkCriteriaState(this,feature, [ConfiguratorVariables.Chosen, ConfiguratorVariables.Default, ConfiguratorVariables.Required], [ConfiguratorVariables.Dismissed], 1);
				},

				hasChosenOptions: function (feature, selected) {
					return _unselectCriteria(this, feature, this.getChosenConfigurationCriteria(selected),1);
				},

				isAsyncRuleLoad : function () {
					return this._useAsyncRuleLoad || false;
				},

				// FeatureSelectionMode:
				//  Single: A Variant in normal mode
				//  Multiple: An Option Group or Refine Mode
				//  EnforceMultiple: A Variant which has been switched by user to Multi Selection
				getFeatureSelectionMode : function (feature) {
					// need to identify ODT giving features ['1','2'..]
					if(UWA.is(feature,'string'))
						return this._featureLevelSelectionMode[feature];
					if(UWA.is(feature,'object'))
						return this._featureLevelSelectionMode[feature.ruleId];
				},
				// replace param feature with id
				setFeatureMultiSelectionMode : function (feature) {
					if(	this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Single ||
						this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
						this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_EnforceMultiple;
						this._modelEvents.publish({ event: 'pc-feature-selection-mode-updated'});
					}
				},
				// replace param feature with id
				setFeatureSingleSelectionMode : function (feature) {
					if(this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_EnforceMultiple ||
						this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Dismiss ||
						this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Multiple &&
						feature.selectionType !== ConfiguratorVariables.feature_SelectionMode_Multiple ) {
						this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Single;
						this._modelEvents.publish({ event: 'pc-feature-selection-mode-updated'});
					}
				},
				// replace param feature with id
				setFeatureDismissMode : function (feature) {
					if(this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Single ||
						this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_Multiple ||
						this._featureLevelSelectionMode[feature.ruleId] === ConfiguratorVariables.feature_SelectionMode_EnforceMultiple ) {
						this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Dismiss;
						this._modelEvents.publish({ event: 'pc-feature-selection-mode-updated'});
					}
				},


				resetFeaturesSelectionMode : function() {
					var Features = this._dictionaryJson.features;
					if(UWA.is(Features,'array')) {
						for (var i = 0; i < Features.length; i++) {
							this.resetFeatureSelectionMode(Features[i]);
						}
					}
				},

				resetFeaturesForCompleteMode : function (confirmUserPrompt) {
					var features = this._dictionaryJson.features;
					if(UWA.is(features,'array')) {
						for (var i = 0; i < features.length; i++) {
							if(this.getFeatureSelectionMode(features[i]) === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
									if(this.hasDismissedOptions(features[i])) {
										confirmUserPrompt().then(()=> {
											this.emptyDismissedOptions(features[i]);
										});
									}
								this._featureLevelSelectionMode[features[i].ruleId] = features[i].selectionType;
							} else if(features[i].selectionType === ConfiguratorVariables.feature_SelectionMode_Single && this.hasMultiSelectVariantValues(features[i])) {
								this.emptyMultiSelectedVariants(features[i]);
							}
						}
					}
				},

				/* replace string with constants */
				resetFeatureSelectionMode : function(feature) {
					if (feature.selectionType === ConfiguratorVariables.feature_SelectionMode_Parameter) {
						this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Parameter;
					}
					else if (this.hasChosenOptions(feature, true)) {
						if (feature.selectionType === ConfiguratorVariables.feature_SelectionMode_Multiple) {
							this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Multiple;
						} else {
							this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Single;
						}
					} else if(this.hasDismissedOptions(feature, true) && this._appFunc.selectionMode_Refine === ConfiguratorVariables.str_yes) {
							this._featureLevelSelectionMode[feature.ruleId] = ConfiguratorVariables.feature_SelectionMode_Dismiss;
					} else {
					this._featureLevelSelectionMode[feature.ruleId] = feature.selectionType;
					}

				},
				isPrimaryEditionEnabled : function () {
					return this.enablePrimaryEdition; 
				},

				getFeatureType: function(Id){
					if(UWA.is(this.getDictionary().features)){
						var listFeatures = this.getDictionary().features;
						for(var j=0; j<listFeatures.length; j++){
							var feature = listFeatures[j];
							//IR-1449818-3DEXPERIENCER2026x: must return for Variant/VariabilityGroup/Parameter
							if(feature.ruleId === Id){
									return feature.type;
							}else if( UWA.is(feature.options, 'array')){
								for(var i=0; i<feature.options.length; i++){
									if(feature.options[i].ruleId === Id){
										return feature.options[i].type;
									}
								}
							}
						}
					}
				},

				convertFromNewSolverFormat: function(selectedCriteria, answerDataType){
					var configCriteria = [];
					var that = this;
					selectedCriteria.forEach(criteria => {
						var configCriteriaData = {};
						var featureType = "";
						if(UWA.is(criteria.Criterion)){
							if(UWA.is(criteria.Value)){
								//Variant value => take Value as an id
								if(UWA.is(criteria.Value,"string")){
									featureType = that.getFeatureType(criteria.Value);
									if(featureType === 'Value'){
										configCriteriaData.Criterion = criteria.Criterion;
										configCriteriaData.Id = criteria.Value;
										if(answerDataType === 'configurationCriteria'){
											configCriteriaData.State = criteria.State;
										}
									}
								}else if(UWA.is(criteria.Value,"number")){ // numerical parameter
									configCriteriaData.Id = criteria.Criterion;
									configCriteriaData.NumericalValue = criteria.Value;
									if(answerDataType === 'configurationCriteria'){
										configCriteriaData.State = criteria.State? criteria.State: "";
										if(UWA.is(criteria.ValueMin) && UWA.is(criteria.ValueMax)){
											configCriteriaData.MinValue = criteria.ValueMin;
											configCriteriaData.MaxValue = criteria.ValueMax;
										}
									}
								}else if(UWA.is(criteria.Value,"boolean")){ //options OR Mandatory criterion OR No Value to be selected 
									featureType = that.getFeatureType(criteria.Criterion);
									if(['VariabilityGroup','Option','Variant'].includes(featureType) || (featureType === "Parameter" && answerDataType === 'modifiedAssumtionsCriteria')){
										configCriteriaData.Id = criteria.Criterion;
										configCriteriaData.Value = criteria.Value;
										if(answerDataType === 'configurationCriteria'){
											if(criteria.Value === false &&  criteria.State === 'Incompatible' ) {
												// case of Variant, solver answer is Value{false} Incompatible
												configCriteriaData.State = 'Required'; 
											}else 
												configCriteriaData.State = criteria.State;
										}
									}
								}
							}else{ // parameter without a value, and check if it has min and max value
								if(answerDataType === 'configurationCriteria'){
									configCriteriaData.Id = criteria.Criterion;
									if(UWA.is(criteria.ValueMin) && UWA.is(criteria.ValueMax)){
										configCriteriaData.MinValue = criteria.ValueMin;
										configCriteriaData.MaxValue = criteria.ValueMax;
									}
								}
							}
							if(Object.keys(configCriteriaData).length > 0){
								configCriteria.push(configCriteriaData);
							}
						}
					});
				return configCriteria;
			},

			convertToNewSolverFormat: function(selectedCriteria){
				var configCriteria = [];
				var that = this;
				selectedCriteria.forEach(criteria => {
					if(criteria.State === "Chosen" || criteria.State === "Dismissed"){
						var configCriteriaData = {};
						var featureType = that.getFeatureType(criteria.Id);
						if(featureType === "Parameter"){ //For numerical parameter
							configCriteriaData.Criterion = criteria.Id;
							configCriteriaData.Value = criteria.NumericalValue;
							configCriteriaData.State = criteria.State;
							if(UWA.is(criteria.MinValue) && UWA.is(criteria.MaxValue)){
									configCriteriaData.ValueMin = criteria.MinValue;
									configCriteriaData.ValueMax = criteria.MaxValue;
								}
						}else if(featureType === "Value"){ // for variant values & options
							configCriteriaData.Criterion = that.getFeatureIdWithOptionId([criteria.Id]);
							configCriteriaData.Value = criteria.Id;
							configCriteriaData.State = criteria.State;
							
						}else if(featureType === "Option"){
							configCriteriaData.Criterion = criteria.Id;
							configCriteriaData.Value = criteria.Value? criteria.Value : true;
							configCriteriaData.State = criteria.State;
						}
						else {
							configCriteriaData.Criterion = criteria.Id;
							configCriteriaData.Value = criteria.Value? criteria.Value : true;
							configCriteriaData.State = criteria.State;
						}
						if(Object.keys(configCriteriaData).length > 0){
							configCriteria.push(configCriteriaData);
						}
					}
				});
				return configCriteria;
			}

			});


			return ConfiguratorModel;
		});

define(
    'DS/ConfiguratorPanel/scripts/Presenters/ParameterPresenter',
    [
        'UWA/Core',
        'UWA/Event',
        'DS/ConfiguratorPanel/scripts/Presenters/ConfigParameterSlider',
        "DS/Controls/SpinBox",
        'DS/Handlebars/Handlebars',
        'DS/UIKIT/Mask',
        'DS/UIKIT/Tooltip',
        'DS/Controls/Popup',
        'DS/Controls/Button',
        'DS/Utilities/Dom',
        'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
        'DS/ConfiguratorPanel/scripts/Models/PCDataUtil',
        'DS/ConfiguratorPanel/scripts/Utilities',
        'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
        'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong.json',
        'text!DS/ConfiguratorPanel/html/ParameterPresenter.html',
        'css!DS/UIKIT/UIKIT.css',
        "css!DS/ConfiguratorPanel/css/ParameterPresenter.css"
    ],
    function(UWA,
        Event, 
        Slider, 
        SpinBox, 
        Handlebars, 
        Mask, 
        Tooltip, 
        Popup,
        Button, 
        Dom,
        ConfiguratorVariables, 
        PCDataUtil,
        Utilities, 
        nlsConfiguratorKeys, 
        nlsUnitLabelLongKeys, 
        html_ParameterPresenter
        ) {

        'use strict';

        var template = Handlebars.compile(html_ParameterPresenter);

        var ParameterPresenter = function(options) {
            this._init(options);
        };


        /******************************* INITIALIZATION METHODS**************************************************/

        ParameterPresenter.prototype._init = function(options) {
            var _options = options ? UWA.clone(options, false) : {};
            UWA.merge(this, _options);
        
            this._initDivs();
            this._render();
            this.updateSelections();
            this.inject(_options.parentContainer);

            this.imageContainer.style.backgroundImage = 'url("'+ this.variant.image +'")';


        };

        ParameterPresenter.prototype._initDivs = function() {
            this._container = document.createElement('div');
            this._container.innerHTML = template();

            this._container = this._container.querySelector('.config-editor-parameter-container');
            this._spinboxContainer = this._container.querySelector('.config-editor-spinbox-container');
            this._sliderContainer = this._container.querySelector('.config-editor-slider-container');
        };

        ParameterPresenter.prototype.inject = function(parentcontainer) {
            parentcontainer.appendChild(this._container);
        };

        /*******************************AUTOCOMPLETE CREATION***************************************************/

        ParameterPresenter.prototype._render = function() {
            var that = this;            
            this.parameterSpinbox = this.getSpinbox();
            this.parameterSlider = this.getSlider();
           // this.updateFilters();
        };

        ParameterPresenter.prototype.enforceRequired = function() {
            let modelParameter = this.configModel.getValueWithId(this.variant.ruleId);
            let currentValue; 
            if(modelParameter) {
                if(this.configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
                    this.parameterSlider.updateFloatingMinMax(modelParameter.MinValue,modelParameter.MaxValue);
                    this.parameterSpinbox.minValue = modelParameter.MinValue; 
                    this.parameterSpinbox.maxValue = modelParameter.MaxValue;
                }else {
                    this.parameterSlider.updateFloatingMinMax(this.variant.minValue,this.variant.maxValue);
                    this.parameterSpinbox.minValue = parseInt(this.variant.minValue); 
                    this.parameterSpinbox.maxValue = parseInt(this.variant.maxValue);
                }                
                currentValue = modelParameter.NumericalValue ? modelParameter.NumericalValue : null;
            }

            if(currentValue){
              if(currentValue < this.variant.minValue || currentValue > this.variant.maxValue){
                // this._currentValue = this.variant.defaultValue;
                var msgStr1 = nlsConfiguratorKeys.ParameterValueOutOfRange;
                msgStr1 = msgStr1.replace("#PARAMETER#", this.variant.name);
                var msgStr2 = msgStr1.replace("#PARAMETER_VALUE#", currentValue);
                Utilities.displayNotification({eventID: 'warning',msg: msgStr2});
              }
            }
            this.updateSelections();
        };

       
        ParameterPresenter.prototype.getSpinbox = function(data) {
            var that = this;
            var parameterSpinbox = new SpinBox({
                minValue: parseInt(this.variant.minValue),
                maxValue: parseInt(this.variant.maxValue),
                units: nlsUnitLabelLongKeys[this.variant.unit],
                stepValue: this.variant.stepValue,
                decimals: 0,
                highExponentProperty: 20                 
            });
            parameterSpinbox.elements.container.style.width = "100%";
            parameterSpinbox.elements.container.style.minWidth = "100%";
            parameterSpinbox.elements.container.style.lineHeight = "32px";
            parameterSpinbox.elements.container.style.height = "34px";
            parameterSpinbox.addEventListener('endEdit', function() {
                that.configModel.setFeatureIdWithStatus(that.variant.ruleId, true);            
                that.configModel.setFeatureIdWithChosenStatus(that.variant.ruleId, true);
                //IR-1224493-3DEXPERIENCER2024x Math.round: spinbox returns 204.99999999 for 205
                let value = Math.round(that.parameterSpinbox.value);
                that.configModel.setValueWithId (that.variant.ruleId, value);       
                that.configModel.setStateWithId (that.variant.ruleId, ConfiguratorVariables.Chosen, value);                         
                that.updateSelections();
                that.callSolver();
            });

            this._validateContent = UWA.createElement('span', {
                'class' : 'validate-action-content'
            });
            this._validateAction = new Button({
                showLabelFlag : false,
                icon: { iconName: "check", fontIconFamily: WUXManagedFontIcons.Font3DS },
                displayStyle: 'lite'
            });
            
            this._validateContent.setContent(this._validateAction);

            this._validateContent.inject(parameterSpinbox.elements.inputContainer);

            this._cancelContent = UWA.createElement('span', {
                'class' : 'clear-action-content'
            });
            this._cancelAction = new Button({
                showLabelFlag : false,
                icon: { iconName: "wrong", fontIconFamily: WUXManagedFontIcons.Font3DS },
                displayStyle: 'lite'
            });

            this._cancelContent.setContent(this._cancelAction);

            this._cancelContent.inject(parameterSpinbox.elements.inputContainer);

            this._requiredContent = UWA.createElement('span', {
                'class' : 'required-action-content'
            });

            this._requiredAction = new Button({
                showLabelFlag : false,
                icon: { iconName: "rule-status-required", fontIconFamily: WUXManagedFontIcons.Font3DS },
                displayStyle: 'lite'
            });
            this._requiredContent.setContent(this._requiredAction);

            this._requiredContent.inject(parameterSpinbox.elements.inputContainer,'before');


                 this._defaultContent = UWA.createElement('span', {
                'class' : 'default-action-content'
            });

            this._defaultAction = new Button({
                showLabelFlag : false,
                icon: { iconName: "rule-status-default", fontIconFamily: WUXManagedFontIcons.Font3DS },
                displayStyle: 'lite'
            });
            this._defaultContent.setContent(this._defaultAction);

            this._defaultContent.inject(parameterSpinbox.elements.inputContainer,'before');
            
            this._conflictContent = UWA.createElement('span', {
                'class' : 'conflict-action-content'
              });
              
              this._conflictAction = new Button({
                showLabelFlag : false,
                icon: { iconName: "alert", fontIconFamily: WUXManagedFontIcons.Font3DS },
                displayStyle: 'lite'
              });
              this._conflictContent.setContent(this._conflictAction);

              this._conflictContent.inject(parameterSpinbox.elements.inputContainer,'before');
            
            parameterSpinbox.inject(this._spinboxContainer);

            
            this._tooltip = new Popup({trigger: 'escape', autoHide : false, mouseRelativePosition: true  });
            this._tooltip.setBody('Loading..');
            this._tooltip.getContent().addClassName('cfg-custom-popup');

            function  tooltipEvent (e) {
                e.stopPropagation();
                var message = "Loading";
                if(that.configModel.getRulesActivation() === ConfiguratorVariables.str_true && that.configModel.isConflictingOption(that.variant.ruleId)) {
                    message = that.pcDataUtil._getConflictingMessage(that.variant.ruleId);                
                } else {
                    that.pcDataUtil._getReasonMessage(that.variant.ruleId).then((message) => {
                        that._tooltip.setBody(message);
                    });
                }
                that._tooltip.target = e.target;
                that._tooltip.offset = e.target.getOffsets();
                that._tooltip.setBody(message);
                that._tooltip.show();
            }

            Dom.addEventOnElement(this, this._conflictAction, 'buttonclick', function (e) {                
                tooltipEvent(e);    
                that.modelEvents.publish({ event : 'RequestPCCausingRules', data : {objectId : that.variant.ruleId, isConflicting: true}});           
                //that.fire('show-state-tooltip', {value : that.value, id : that.context});
              });
    
              Dom.addEventOnElement(this, this._requiredAction, 'buttonclick', function (e) {
                tooltipEvent(e);
                that.modelEvents.publish({ event : 'RequestPCCausingRules', data : {objectId : that.variant.ruleId, isConflicting: false}});
                //that.fire('show-state-tooltip', {value : that.value, id : that.context});
              });

              Dom.addEventOnElement(this, this._defaultAction, 'buttonclick', function (e) {
                tooltipEvent(e);
                that.modelEvents.publish({ event : 'RequestPCCausingRules', data : {objectId : that.variant.ruleId, isConflicting: false}});
                //that.fire('show-state-tooltip', {value : that.value, id : that.context});
              });
    
              Dom.addEventOnElement(this, this._cancelAction, 'buttonclick', function (e) {
                e.stopPropagation();
                  //that.fire('reject-criteria', {value : that.value, id : that.context});
                //that.configModel.setFeatureIdWithMandStatus(this.variant.ruleId, mandStatus);
                that.configModel.setFeatureIdWithStatus(that.variant.ruleId, false);                  
                that.configModel.setFeatureIdWithChosenStatus(that.variant.ruleId, false);
                that.configModel.setValueWithId (that.variant.ruleId, undefined);     
                that.configModel.setStateWithId (that.variant.ruleId, ConfiguratorVariables.Unselected, null);                                             
                that.updateSelections();
                that.callSolver();
                  
              });
    
              Dom.addEventOnElement(this, this._validateAction, 'buttonclick', function (e) {
                  e.stopPropagation();
                 // this.configModel.setFeatureIdWithMandStatus(this.variant.ruleId, mandStatus);
                that.configModel.setFeatureIdWithStatus(that.variant.ruleId, true);            
                that.configModel.setFeatureIdWithChosenStatus(that.variant.ruleId, true);
                that.configModel.setStateWithId (that.variant.ruleId, ConfiguratorVariables.Chosen, that.parameterSlider.value);   
                that.updateSelections();           
                that.callSolver();
                  //that.fire('validate-criteria', {value : that.value, id : that.context});
              });

            return parameterSpinbox;
        };

        ParameterPresenter.prototype.getSlider = function(data) {
            var that = this;
            var parameterSlider = new Slider({
                minValue: parseInt(this.variant.minValue),
                maxValue: parseInt(this.variant.maxValue),
                stepValue: this.variant.stepValue
            });
            parameterSlider.getTextFromValue = function() {
                var unit = nlsUnitLabelLongKeys[that.variant.unit] || that.variant.unit;
               if(unit){
                 return this.value + " " + unit;
               }
               return this.value;
            };

            parameterSlider.getContent().addEventListener('endEdit', function(data) {
                that.configModel.setFeatureIdWithStatus(that.variant.ruleId, true);            
                that.configModel.setFeatureIdWithChosenStatus(that.variant.ruleId, true);
                that.configModel.setValueWithId (that.variant.ruleId, that.parameterSlider.value);       
                that.configModel.setStateWithId (that.variant.ruleId, ConfiguratorVariables.Chosen, that.parameterSlider.value);                                
                that.updateSelections(true);
                that.callSolver();
            });
            parameterSlider.inject(this._sliderContainer);
            return parameterSlider;
        };

        /********************************FUNCTIONALITIES - CALL SOLVER BASED ON RULES SELECTION**********************************/

        ParameterPresenter.prototype.callSolver = function(item){
            this.modelEvents.publish({event:'pc-interaction-started', data : {}});
            if(this.configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
                this.modelEvents.publish({event:'SolverFct_CallSolveMethodOnSolver', data : {}});
            }else{
                this.updateFilters();
                this.modelEvents.publish({
                    event: 'solveAndDiagnoseAll_SolverAnswer'
                });
            }
        };

        /*******************************UPDATE VIEW : HANDLE MUST/MAY FEATURES AND INCLUSION RULES***************************/

        ParameterPresenter.prototype.updateFilters = function(edit) {
            
            //if(this._currentValue && UWA.is(this._currentValue, "string") && this._currentValue.includes(this.variant.unit))
           
            //required states on parameter ?
            // var mandStatus = (mandatory || this.configModel.getStateWithId(this.variant.ruleId) === ConfiguratorVariables.Required) ? true : false;           
            /*var selectedFeature;
            if (this._currentValue !== undefined) {
                selectedFeature = true;
            } else {
                selectedFeature = false;
            }

            if (this._container.offsetParent && this._container.offsetParent.style.display === "none") {
                selectedFeature = false;
            }*/
            //this.configModel.setFeatureIdWithMandStatus(this.variant.ruleId, mandStatus);
            //this.configModel.setFeatureIdWithStatus(this.variant.ruleId, selectedFeature);            
			//this.configModel.setValueWithId(this.variant.ruleId,this._currentValue);
            //if(edit) {
             //   this.configModel.setStateWithId (this.variant.ruleId, ConfiguratorVariables.Chosen, this._currentValue);              
            //}
           
            //this._updateView();
            this.configModel.updateFeatureIdWithRulesStatus(this.variant.ruleId);
            this.configModel.updateUserSelectVariantIDs(this.variant.ruleId);
            this.configModel.updateFeatureIdWithChosenStatus(this.variant.ruleId);
            this.configModel.updateFeatureIdWithStatus(this.variant.ruleId);
            this.configModel.updateFeatureIdWithCommercialStatus(this.variant.ruleId, true);
            
            this.modelEvents.publish({event: "updateAllFilters"});

        };

        ParameterPresenter.prototype.updateSelections = function () {
            var currentValue = this.configModel.getValueWithId(this.variant.ruleId) ? this.configModel.getValueWithId(this.variant.ruleId).NumericalValue : undefined;
            if (currentValue) {
                this.imageContainer.classList.add('cfg-image-selected');
            }else{
                this.imageContainer.classList.remove('cfg-image-selected');
            }
            this.parameterSlider.value = currentValue;
            this.parameterSlider._updateCursor();
            this.parameterSpinbox.value = currentValue;
            

            this._validateContent.hide();
            this._cancelContent.hide();
            this._conflictContent.hide();
            this._requiredContent.hide();            
            this._defaultContent.hide();
            if(this.configModel.getStateWithId(this.variant.ruleId) === ConfiguratorVariables.Selected) {
                this._validateContent.show();
            }else if (this.configModel.getStateWithId(this.variant.ruleId) === ConfiguratorVariables.Chosen) {
                this._cancelContent.show();
            }else if (this.configModel.getStateWithId(this.variant.ruleId) === ConfiguratorVariables.Required) {
                this._requiredContent.show();
                this._validateContent.show();
            }
            else if (this.configModel.getStateWithId(this.variant.ruleId) === ConfiguratorVariables.Default) {
                this._defaultContent.show();
                this._validateContent.show();
            }
            
            if (this.configModel.isConflictingOption(this.variant.ruleId)) {
                this._conflictContent.show();
            }
            this.imageContainer.style.backgroundImage = 'url("'+ this.variant.image +'")';   
            
            this.updateFilters();

        };

        /******************************************UTILITIES**********************************************************/

        ParameterPresenter.prototype._find = function(array, id) {
            if (array) {
                array.forEach(function(item) {
                    if (item === id) {
                        return item;
                    }
                });
            }
        };
        /********************************END OF MULTIVALUEPRESENTER*************************************************************/
        return ParameterPresenter;
    });

define(
    'DS/ConfiguratorPanel/scripts/Presenters/MultipleValueAutocompletePresenter',
    [
        'UWA/Core',
        'DS/Handlebars/Handlebars',
        'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
        'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionEditor',

            'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
        'text!DS/ConfiguratorPanel/html/MultipleValueAutocompletePresenter.html',

        'css!DS/UIKIT/UIKIT.css',
        "css!DS/ConfiguratorPanel/css/MultipleValueAutocompletePresenter.css",
        'css!DS/CfgBulkTablePresenter/BulkEdition/Presenter/CfgAutoComplete.css'


    ],
    function(UWA, Handlebars, ConfiguratorVariables, CriteriaSelectionEditor, nlsConfiguratorKeys, html_MultipleValueAutocompletePresenter) {

        'use strict';

        var template = Handlebars.compile(html_MultipleValueAutocompletePresenter);


        var MultipleValueAutocompletePresenter = function(options) {
            this._init(options);
        };

        /******************************* INITIALIZATION METHODS**************************************************/

        MultipleValueAutocompletePresenter.prototype._init = function(options) {
            var _options = options ? UWA.clone(options, false) : {};
            UWA.merge(this, _options);
            this._subscribeEvents();
            this._initDivs();
            this.inject(_options.parentContainer);
            this._render();
        };

        MultipleValueAutocompletePresenter.prototype._subscribeEvents = function() {
            var that = this;
            this.modelEvents.subscribe({
                event: 'OnSortResult'
            }, function(data) {
                that._criteriaselection.setProperties({ sort: { attribute: data.sortAttribute, order: data.sortOrder} });
            });

        };

        MultipleValueAutocompletePresenter.prototype._initDivs = function() {
            this._container = document.createElement('div');
            this._container.innerHTML = template({
                nls: nlsConfiguratorKeys,
                items: this.variant.optionPhysicalIds,
                context: this
            });

            this._container = this._container.querySelector('.config-editor-multivalue-autocomplete');
            this.image = this.imageContainer.querySelector(".configurator-img-thumbnail");
            this._validateCheckContainer = this._container.querySelector('.config-editor-validate-badge-check');


        };

        MultipleValueAutocompletePresenter.prototype.inject = function(parentcontainer) {
            this._parentcontainer = parentcontainer;
            parentcontainer.appendChild(this._container);
        };

        /*******************************AUTOCOMPLETE CREATION***************************************************/

        MultipleValueAutocompletePresenter.prototype._render = function() {
            var that = this;

            this._criteriaselection= new CriteriaSelectionEditor({context: this.variant.ruleId}).inject(this._container);

            this._criteriaselection.addEventListener('select-criteria' , function (e) {
                 // that.publishEvent({event : 'pc-select-criteria-action', data : e.options});
                that.pcDataUtil.selectValue(e.options.id, e.options.value);
                that.callSolver();
            });
            this._criteriaselection.addEventListener('reject-criteria', function (e) {
                that.pcDataUtil.rejectValue(e.options.id, e.options.value);
				that.callSolver();
            });
            this._criteriaselection.addEventListener('validate-criteria', function (e) {
                that.pcDataUtil.validateValue(e.options.id, e.options.value);
				that.callSolver();
            });
            this._criteriaselection.addEventListener( 'show-criteria', function (e) {
                that.modelEvents.subscribeOnce({event : 'solveAndDiagnoseAll_SolverAnswer'}, function () {
                    that.pcDataUtil.setDiagnosedCriteria(that.variant.ruleId, true);
                    that._criteriaselection.setProperties({
                        showLoader : false
                    });
                });
                that.configModel.setVariantForDiagnosis(that.variant.ruleId);
                that.modelEvents.publish({
                    event: 'SolverFct_CallSolveOnSelectedIDsMethodOnSolver',
                    data:  {
                        idsToDiagnose: that.variant.optionPhysicalIds
                    }
                });
            });


            this._criteriaselection.addEventListener( 'show-state-tooltip' , function (e) {
                var optionId = e.options.value;
                var message = "Loading...";
                var isConflicting = false;
                if(that.configModel.getRulesActivation() === ConfiguratorVariables.str_true && that.configModel.isConflictingOption(optionId)) {
                    message =  that.pcDataUtil._getConflictingMessage(optionId);
                    isConflicting = true;
                } else {
                    that.pcDataUtil._getReasonMessage(optionId).then((msg) => {
                        that._criteriaselection.updateTooltipMessage(msg);
                    });
                }
                that._criteriaselection.updateTooltipMessage(message);
            });



             //R14 update dropdown item states.
             this.updateSelections();
        };



            /********************************FUNCTIONALITIES - CALL SOLVER BASED ON RULES SELECTION******************************/

            MultipleValueAutocompletePresenter.prototype.callSolver = function(item) {
                this.modelEvents.publish({
                    event: 'pc-interaction-started',
                    data: {}
                });
                if (this.configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
                    //if (this.configModel.getLoading(this.variant.ruleId) === "Loaded") {
                        this.modelEvents.publish({
                            event: 'SolverFct_CallSolveMethodOnSolver',
                            data: {}
                        });
                    //}
                } else {
                    this.updateFilters();
                    this.modelEvents.publish({
                        event: 'solveAndDiagnoseAll_SolverAnswer'
                    });
                }
            };

            /********************************FUNCTIONALITIES - UPDATE VIEW - MAIN METHOD******************************************/

            MultipleValueAutocompletePresenter.prototype.enforceRequired = function(data) {
                if (data && data.answerMethod === "solveAndDiagnose" && this.configModel.getRulesMode() === "RulesMode_SelectCompleteConfiguration") {
                    if (this.configModel.getVariantForDiagnosis() === this.variant.ruleId) {
                      this.configModel.setConfigCriteriaUpdated(false);
                        this.updateSelections();
                    }
                } else {
                    this.updateSelections();
                }
            };

            MultipleValueAutocompletePresenter.prototype.updateSelections = function() {
                var variantSelectedByRule = false,
                    variantSelectedByUser = false;

                this._criteriaselection.setProperties(
                        {
                          contentType : 1,
                          multiValue : this.pcDataUtil.isMultiValue(this.variant.ruleId),
                          enableEasySelection : this.pcDataUtil.isMultiValue(this.variant.ruleId) || this.configModel.getRulesMode() !== ConfiguratorVariables.RulesMode_SelectCompleteConfiguration,
                          possibleValues : this.getPossibleValues(this.variant.ruleId),
                          asyncLoad : this.pcDataUtil.isUpdateRequired(this.variant.ruleId),
                          dismissMode: this.pcDataUtil.isDismissValue(this.variant.ruleId),
                          value : this.pcDataUtil.getSelectedValue(this.variant.ruleId),
                          sort: { 
                                attribute: this.configModel.sortPreference ? this.configModel.sortPreference.sortAttribute : 'sequenceNumber',
                                order: this.configModel.sortPreference ? this.configModel.sortPreference.sortOrder : 'ASC'
                            }
                        }
                );

                this._updateImage( this.pcDataUtil.getSelectedValue(this.variant.ruleId));

                this.configModel.updateFeatureIdWithRulesStatus(this.variant.ruleId, variantSelectedByRule);
                this.configModel.updateFeatureIdWithChosenStatus(this.variant.ruleId, variantSelectedByUser);
                this.configModel.updateUserSelectVariantIDs(this.variant.ruleId, true);
                this.configModel.updateFeatureIdWithCommercialStatus(this.variant.ruleId, true);

                this.updateFilters();
            };



            MultipleValueAutocompletePresenter.prototype.getPossibleValues = function (id) {
                var values = this.pcDataUtil._dictionaryUtil.getValues(id);
                var possibleValues = [];
                values.forEach((item) => {
                  possibleValues.push(UWA.merge(
                      {
                        state : this.pcDataUtil.getState(item),
                        selectable : this.pcDataUtil.isSelectable(item),
                        rejectable : this.pcDataUtil.hasRejectAction(item),
                        validate : this.pcDataUtil.hasValidateAction(item),
                        conflict : this.pcDataUtil.hasConflict(item),
                      }, this.pcDataUtil._dictionaryUtil.getDetails(item)));
                });
                return possibleValues;
              };



            /****************************************UPDATE VIEW : UPDATE IMAGE AS PER CF/CO************************************/

            MultipleValueAutocompletePresenter.prototype._updateImage = function(selectedItems) {

                let option = null;
                if (UWA.is(selectedItems, 'string')){
                    option = this.variant.options.find(item => item.ruleId === selectedItems);
                }
                else if (UWA.is(selectedItems, 'array') && selectedItems.length === 1 ) {
                    option = this.variant.options.find(item => item.ruleId === selectedItems[0]);
                }
                if( UWA.is(selectedItems, 'string') || (UWA.is(selectedItems, 'array') && selectedItems.length) )
                     this.imageContainer.addClassName('cfg-image-selected');
                else
                    this.imageContainer.removeClassName('cfg-image-selected');


                if(option && option.image !== "")
                    this.imageContainer.style.backgroundImage = 'url("'+ option.image +'")';
                else if(this.variant.image !== "")
                    this.imageContainer.style.backgroundImage = 'url("'+ this.variant.image +'")';

            };

            /*******************************UPDATE VIEW : HANDLE MUST/MAY FEATURES AND INCLUSION RULES***************************/

            MultipleValueAutocompletePresenter.prototype.updateFilters = function() {

                this.configModel.updateFeatureIdWithStatus(this.variant.ruleId);
                // this.modelEvents.publish({event:'updateAllFilters', data : {}});
            };

            /********************************REFINE MODE - INCLUDED STATE GETTER SETTER***********************************/

            /******************************************UTILITIES**********************************************************/

            MultipleValueAutocompletePresenter.prototype._find = function(array, id) {
                if (array) {
                    array.forEach(function(item) {
                        if (item === id) {
                            return item;
                        }
                    });
                }
            };




            /********************************END OF MULTIVALUEPRESENTER*****************************************************/


        return MultipleValueAutocompletePresenter;

    });

define('DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionView',
  [
      'DS/Controls/Abstract',
      'DS/Utilities/Dom',
      'DS/Handlebars/Handlebars',
       'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
      'css!DS/ConfiguratorPanel/css/CriteriaSelectionView.css'
    ], function(Abstract, Dom, Handlebars,ConfiguratorVariables) {

    'use strict';
    //build Criteria Selection view

    
    var STATE_ICONS = {};
    STATE_ICONS[ConfiguratorVariables.Default] = 'rule-status-default';
    STATE_ICONS[ConfiguratorVariables.Required] = 'rule-status-required';
    STATE_ICONS[ConfiguratorVariables.Chosen] = '';
    STATE_ICONS[ConfiguratorVariables.Selected] = 'rule-status-selected';
    STATE_ICONS[ConfiguratorVariables.Unselected] = '';
    STATE_ICONS[ConfiguratorVariables.Incompatible] = 'rule-status-incompatible';
    STATE_ICONS[ConfiguratorVariables.Dismissed] = 'user-delete';

    var htmlBadge = `{{#if multiValue}}
        <div class="multi-value-content">
        	{{#each value}}
            	<div class="value-badge">
                <div class="value-image" style="background-image: url('{{image}}');" >
                </div>
                {{#if hasConflict}}
              	<span class="wux-ui-3ds wux-ui-3ds-rule-status-conflict item-state-conflict" ></span>
              	{{/if}}
              	{{#if icon}}
              	<span class="wux-ui-3ds wux-ui-3ds-{{icon}}"></span>
              	{{/if}}
                <span class="value-title" title="{{title}}">{{title}}</span>
              </div>
            {{/each}}
        </div>
        {{else}}
        <div class="single-value-content">
        	{{#with value}}
              <div class="value-image" style="background-image: url('{{image}}');" >
              </div>
            {{#if hasConflict}}
              <span class="wux-ui-3ds wux-ui-3ds-rule-status-conflict item-state-conflict" ></span>
            {{/if}}
            {{#if icon}}
              <span class="wux-ui-3ds wux-ui-3ds-lg wux-ui-3ds-{{icon}}"></span>
            {{/if}}
            {{#if title}}
              <span class="value-title" title="{{title}}">{{title}}</span>
            {{/if}}  
            {{#if numericalValue}}
              <span class="value-title" title="{{numericalValue}}">{{numericalValue}}</span>
            {{/if}}  
          {{/with}}
        </div>
    	{{/if}}`;

    

    // Handlebars.registerHelper('valueImage', function(image, opts) {
    //    return Dom.generateIcon({iconPath : image, className : 'value-image'}).outerHTML;
    // });

    var CriteriaSelectionView = Abstract.inherit({

        name: 'criteria-selection-view',

        publishedProperties: {
          value : {
            defaultValue: '',
            type: 'object'
          },
          multiValue : {
            defaultValue: false,
            type: 'boolean'
          },
          referenceValue: {
            defaultValue: null,
            type: 'object'
          }
        },

        buildView : function () {
          this._valueContainer = UWA.createElement('div', {
            'class' : 'value-container'
          });
        },

        _postBuildView: function() {
          this.getContent().addClassName('criteria-selection-view');
          this.getContent().setContent(this._valueContainer);
        },

        _applyValue : function (oldValue, value) {
          this._valueContainer.setContent('');
          if(this.value) {            
            value = this.value.map(function(item){
              return UWA.merge({
                icon: STATE_ICONS[item.state]
              },item);
            });
            var badgeTemplate = Handlebars.compile(htmlBadge);
            this._valueContainer.setContent(badgeTemplate({
             value: (this.multiValue || value.length > 1 ) ? value : value[0],
             multiValue: (this.multiValue || value.length > 1)
            }));
          } 
        },

        _applyMultiValue : function (oldValue, value) {
          this.getContent().setContent(this._valueContainer);
        },

        _applyProperties: function(oldValues) {
          this._parent(oldValues);
          if (this.isDirty('multiValue')) {
            this._applyMultiValue(oldValues.multiValue);
          }

          if (this.isDirty('value')) {
            this._applyValue(oldValues.value);
            this._applyReferenceValue(oldValues.referenceValue);
          }

          if (this.isDirty('referenceValue')) {
            this._applyReferenceValue(oldValues.referenceValue);
          }
          
        },

        _applyReferenceValue: function(oldValues) {
          let highlightDiff = false; 
          // If reference column's cell contains values and the compared with column's cell is empty -> highlight cell background
          if (this.referenceValue) {
            highlightDiff = true; 
            if (this.referenceValue.length === this.value.length) {
              let  differences = this.referenceValue.filter(obj1 => {                
                  return !this.value.some(obj2 => {
                      return obj1 === obj2.id ||
                            obj1 === obj2.numericalValue; // numericalValue => Parameter
                  });
              });
              if (differences.length === 0) {
                highlightDiff= false;                     
              }
            }
          }
          if (highlightDiff && !this.getContent().hasClassName('highlight-background')) {
              this.getContent().addClassName('highlight-background');
          }else if (!highlightDiff && this.getContent().hasClassName('highlight-background')){
              this.getContent().removeClassName('highlight-background');
          }
        }
    });


  	return CriteriaSelectionView;
});

define('DS/ConfiguratorPanel/scripts/Presenters/VariantComponentPresenter',[
	'UWA/Core',
	'DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctionsV2',
	'DS/Handlebars/Handlebars',
	'DS/WebappsUtils/WebappsUtils',
	'DS/UIKIT/Tooltip',
	'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
	'DS/ConfiguratorPanel/scripts/Presenters/MultipleValueAutocompletePresenter',
	'DS/ConfiguratorPanel/scripts/Presenters/ParameterPresenter',
	'DS/UIKIT/DropdownMenu',
	'DS/UIKIT/SuperModal',
	'DS/UIKIT/Input/Button',
	'i18n!DS/xDimensionManager/assets/nls/xUnitLabelLong.json',
	'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
	'text!DS/ConfiguratorPanel/html/VariantComponentPresenter.html',
	"css!DS/ConfiguratorPanel/css/VariantComponentPresenter.css",
	'css!DS/UIKIT/UIKIT.css'
	],
	function (UWA,
		ConfiguratorSolverFunctionsV2,
		Handlebars,
		WebappsUtils,
		Tooltip,
		ConfiguratorVariables,
		MultipleValueAutocompletePresenter,
		ParameterPresenter,
		DropdownMenu,
		SuperModal,
		Button,
		xUnitLabelLong,
		nlsConfiguratorKeys,
		html_VariantComponentPresenter) {

	'use strict';

	var template = Handlebars.compile(html_VariantComponentPresenter);


	var VariantComponentPresenter = function (options) {
		this._init(options);
	};

	VariantComponentPresenter.prototype._init = function(options){
		var _options = options ? UWA.clone(options, false) : {};
		UWA.merge(this, _options);
		if (this.variant.commercial == true) {
			this.variant.displayName += " (" + nlsConfiguratorKeys.LABEL_COMMERCIAL + ") ";
		}
		this.variantId = this.variant.ruleId;
		if(this.variant.unit)
			this.variant.nlsUnit = xUnitLabelLong[this.variant.unit];
		this.image = this.variant.image ? this.variant.image : ConfiguratorSolverFunctionsV2.getDefaultImage();

		this._initDivs();
		this._subscribeToEvents();
		this.inject(_options.parentContainer);
		this._getAutocomplete();
	};

	VariantComponentPresenter.prototype.getDefaultImage = function() {
			return WebappsUtils.getWebappsAssetUrl("ENOXConfiguratorUX", "icons/iconLargeDefault.png");
	};

	VariantComponentPresenter.prototype._toggleVariantMultiSelect = function (activate, needConfirm) {

		var that = this;
		return new Promise ( (resolve) => {
			var currSelection = this.configModel.getFeatureSelectionMode(this.variant);
			if( ( ( currSelection === ConfiguratorVariables.feature_SelectionMode_Single ) && ( !UWA.is(activate) || activate !== false ) )
				|| (currSelection === ConfiguratorVariables.feature_SelectionMode_Dismiss && ( !UWA.is(activate) || activate !== false ))
				|| activate === true ) {
					//R14 need to confirm ?
					that.modelEvents.publish({event: 'pc-confirm-variant-includeSelect', data : {
							feature : that.variant,
							needConfirm : needConfirm,
							callback : function (confirmed) {
								var isSolverCalled = false;
					if(confirmed) {
									if(that.configModel.switchIncludeOptions(that.variant)) { //emptyDismissedOptions
										isSolverCalled = true;
										that.autocompletePresenter.callSolver();
									}
								} else {
						if(that.configModel.emptyDismissedOptions(that.variant)) {
            isSolverCalled = true;
							//R14 need to call solver after empty multiselect
							that.autocompletePresenter.callSolver();
						}
								}
						that.configModel.setFeatureMultiSelectionMode(that.variant);
						that._updateVariantComponentMode();
            if(!isSolverCalled){
              	that.modelEvents.publish({event: 'updateAllFilters'});
            }
								resolve(confirmed);
					}
						}
				});
			}else {
				//R14 need to confirm ?
				that.modelEvents.publish({event: 'pc-confirm-variant-includeSelect', data : {
						feature : that.variant,
						needConfirm : needConfirm,
						callback : function (confirmed) {
							var isSolverCalled = false;
					if(confirmed) {
								if(that.configModel.switchIncludeOptions(that.variant)) {
									isSolverCalled = true;
									that.autocompletePresenter.callSolver();
								}
							} else {
								if(that.configModel.emptyDismissedOptions(that.variant)) {
            isSolverCalled = true;
							//R14 need to call solver after empty multiselect
							that.autocompletePresenter.callSolver();
						}
						}
						that.configModel.setFeatureSingleSelectionMode(that.variant);
						//that.configModel.resetFeatureSelectionMode(that.variant);
						that._updateVariantComponentMode();
            if(!isSolverCalled){
              	that.modelEvents.publish({event: 'updateAllFilters'});
            }
						resolve(confirmed);
						}
					}
				});
			}
		});

	};

	VariantComponentPresenter.prototype._toggleVariantDismiss = function (activate, needConfirm) {

		var that = this;
		/*if(activate ) {
			this.configModel.setFeatureDismissMode(this.variant);
			//this._updateVariantComponentMode();
			this._rebuildAutocomplete();
		}else {*/
			//R14 need to confirm ?
			return new Promise( (resolve) => {
				that.modelEvents.publish({event: 'pc-confirm-variant-excludeSelect', data : {
						feature : that.variant,
						needConfirm : needConfirm,
						callback : function (confirmed) {
							var isSolverCalled = false;
					if(confirmed) {
								if(that.configModel.switchExcludeOptions(that.variant)){
									isSolverCalled = true;
									that.autocompletePresenter.callSolver();
								}
							} else {
						if(that.configModel.emptyChosenOptions(that.variant)){
							//R14 need to call solver after empty chosen
              isSolverCalled = true;
							that.autocompletePresenter.callSolver();
						}
							}
						that.configModel.setFeatureDismissMode(that.variant);
						that._updateVariantComponentMode();
            if(!isSolverCalled){
              	that.modelEvents.publish({event: 'updateAllFilters'});
            }
							resolve(confirmed);
						}
					}
				}
			);
			});

		//}

	};


	VariantComponentPresenter.prototype._initDivs = function () {

		this._container = document.createElement('div');
		var options = this.variant;
		options.isMandatory = (this.variant.selectionCriteria === 'Primary' || this.variant.selectionCriteria === 'Mandatory');
		this._container.innerHTML = template({
			variant : options
		});


		this._container =  UWA.extendElement(this._container.querySelector('#divFeature' + this.variant.ruleId));
		this._autocompleteContainer = this._container.getElement('#autocompleteContainer_' + this.variant.ruleId);
		this._imageContainer = this._container.getElement('.variantImgContainer');
		this._contentContainer = this._container.getElement('.contentContainer');
		this._variantLableContainer = this._contentContainer.getElement('.variantLabelContainer');
		this._iconGapContainer = this._container.getElement('.iconGapContainer');
		this._rulesIcon = this._container.getElement('#rulesIcon_' + this.variant.ruleId);
		this._selectionModeAction = new Button({
			className: 'link',
			value : nlsConfiguratorKeys.Include_criteria
		});
		if(this.variant.selectionCriteria === "Primary" && !this.configModel.isPrimaryEditionEnabled()){
			this._selectionModeAction.disable();
		}
		this._selectionModeAction.getContent().addClassName('variantSelectionMode');
		if(this.variant.type !== 'Parameter' ) {
			if(this.configModel.getAppFunc().selectionMode_Refine === ConfiguratorVariables.str_yes) {
				this._selectionModeAction.inject(this._variantLableContainer);
			}
		}

		this.mandIcon = this._container.querySelector('variantRightIcon_' + this.variant.ruleId);
		//this.refinedIcon = this._container.querySelector('variantRefinedIcon_' + this.variant.ruleId);
		UWA.extendElement(this.mandIcon);
		//UWA.extendElement(this.refinedIcon);

	};

	VariantComponentPresenter.prototype._updateVisibity = function (activated) {
		var isVisible = activated;
		var isMand = this.configModel.getFeatureIdWithMandStatus(this.variant.ruleId);
		var flag = false;
		var conflictOptions = this.configModel.getConflictingFeatures(), conflictingFeatures = [];
		if(this.configModel.getNumberOfConflictingFeatures() > 0){
			for (var i = 0; i < conflictOptions.length; i++) {
				conflictingFeatures.push(this.configModel.getFeatureIdWithOptionId(conflictOptions[i]));
			}
		}
		var isConflicting = conflictingFeatures.indexOf(this.variant.ruleId) !== -1 ;
		var isAllOptionsIncompatible = false; 
		if(this.variant.options.length > 0) {
			isAllOptionsIncompatible = true;
			let configModel = this.configModel;
			this.variant.options.forEach(function (option) {
				if(configModel.getStateWithId(option.ruleId) !== ConfiguratorVariables.Incompatible)
					isAllOptionsIncompatible = false;
			});			
		}
		
				
		// Hide if not mand, not conflicting, but all options incompabible
		if(	!isMand 
			&&
			!isConflicting
			&& 		
			isAllOptionsIncompatible) {			
				isVisible = false;
		}
		if(isVisible && activated)
			flag = true;

		this._setVisibility(isVisible,flag);
	};

	VariantComponentPresenter.prototype._subscribeToEvents = function () {
		var that = this;
		/** Since this is independent of solver calls, it can be subscribed here. **/
		this.modelEvents.subscribe({event: 'OnConfigurationModeChange'}, function () {
			that.configModel.resetFeatureSelectionMode(that.variant);
			that._updateVariantComponentMode();
		});

		this.modelEvents.subscribe({event: 'OnAllVariantFilterIconClick'}, function (data) {			
			that._updateVisibity(data.activated);
		});

		this.modelEvents.subscribe({event: 'onMandVariantIconClick'}, function (data) {
			var isMand = this.configModel.getFeatureIdWithMandStatus(this.variant.ruleId);
			that._updateVisibity(isMand && data.activated);

		});

		this.modelEvents.subscribe({event: 'OnUnselectedVariantIconClick'}, function (data) {
			var isSelcted = that.configModel.getFeatureIdWithStatus(that.variant.ruleId);
			that._updateVisibity(!isSelcted && data.activated);			
		});

		this.modelEvents.subscribe({event: 'OnRuleNotValidatedIconClick'}, function (data) {
			var isSelcted = that.configModel.getFeatureIdWithRulesStatus(that.variant.ruleId);

			that._updateVisibity(isSelcted && data.activated);
		});

		this.modelEvents.subscribe({event: 'onChosenVariantIconClick'}, function (data) {
			var isChosen = that.configModel.getFeatureIdWithChosenStatus(that.variant.ruleId);
			that._updateVisibity(isChosen && data.activated);
		});

		this.modelEvents.subscribe({event: 'OnConflictIconClick'}, function (data) {
			var conflictOptions = that.configModel.getConflictingFeatures(), conflictingFeatures = [];
			var rulesActivationStatus = that.configModel.getRulesActivation();
			if(that.configModel.getNumberOfConflictingFeatures() > 0){
				for (var i = 0; i < conflictOptions.length; i++) {
					conflictingFeatures.push(that.configModel.getFeatureIdWithOptionId(conflictOptions[i]));
				}
			}
			var isConflicting = conflictingFeatures.indexOf(that.variant.ruleId) === -1 ? false : rulesActivationStatus;			
			that._updateVisibity(isConflicting && data.activated);
		});

		this.modelEvents.subscribe({event: 'OnCommercialIconClick'}, function (data) {
			var isCommercial = that.configModel.getFeatureIdWithCommercialStatus(that.variant.ruleId);
			that._updateVisibity(isCommercial && data.activated);
		});

		this.modelEvents.subscribe({event: 'updateExclusions'}, function (data) {
			that._updateVisibity(data.activated);
		});


		this.modelEvents.subscribe({event: 'applyDefaultSearch'}, function (data) {
			var attributesList = [];
			if(that.variant.displayName) {
				attributesList.push(that.variant.displayName);
			}
			for (var i = 0; i < that.variant.options.length; i++) {
				attributesList["value_" + that.variant.options[i].ruleId + "_DisplayName"] = that.variant.options[i].displayName;
			}
			var searchValue = (data && data.searchValue) ? data.searchValue : [];
			var matchFound = false;
			that.configModel.setCurrentSearchData(data);
			if (that.configModel.getVariantVisibility(that.variant.ruleId)) {
				that._container.style.display = 'inline-flex';
				if (searchValue.length > 0) {
					for (var attr in attributesList) {
						if(Object.prototype.hasOwnProperty.call(attributesList,attr)) {
							var AttribValue = attributesList[attr].replace(/\s+/g, '');
							for (var j = 0; j < searchValue.length; j++) {
								if (AttribValue.toUpperCase().contains(searchValue[j].toUpperCase()) || searchValue[j] === '') {
									matchFound = true;
									break;
								}
							}								
							if (matchFound)break;
						}						
					}
					if (!matchFound) {
						that._container.style.display = 'none';
					}
				}
			} else {
				that._container.style.display = 'none';
			}
		});

		// L3B : filter Event
		this.modelEvents.subscribe({event: 'OnFilterResult'}, function (data) {
			var searchBox = document.querySelector('.autocomplete-input');
			var value = searchBox ? searchBox.value : "";
			var text = data.searchValue || value;
			that.configModel.setCurrentSearchData({searchValue : [text]});

			// if (that.configModel.getVariantVisibility(that.variant.ruleId)) {
				if(!that.variant.xFiltersMerge){
					that.variant.xFiltersMerge = {};
				}
				if (data.filterValues.indexOf(that.variant.ruleId) !== -1) {
					that.variant.xFiltersMerge[data.filterType] = true;
				}else{
					that.variant.xFiltersMerge[data.filterType] = false;
					//IR-607240 - Search
					if(that.variant && that.variant.optionPhysicalIds){
						for (var i = 0; i < that.variant.optionPhysicalIds.length; i++) {
							if(data.filterValues.indexOf(that.variant.optionPhysicalIds[i]) !== -1){
								that.variant.xFiltersMerge[data.filterType] = true;
								break;
							}
						}
					}
				}
				that._applyAllFilters();
		});

		this.configModel._modelEvents.subscribe({event: 'configurator-rule-mode-updated'}, function () {
			that._updateVariantComponentMode();
		});

		if(this.configModel.getAppFunc().selectionMode_Refine === ConfiguratorVariables.str_yes ) {
			this._selectionModeAction.addEvent('onClick', function () {
				var value = this.getValue();

				if(value === nlsConfiguratorKeys.Exclude_criteria) {
					if(that.variant.selectionType === ConfiguratorVariables.feature_SelectionMode_Single) {
						that._toggleVariantMultiSelect(false).then(()=>{ this.setValue(nlsConfiguratorKeys.Include_criteria); });
					} else if(that.variant.selectionType === ConfiguratorVariables.feature_SelectionMode_Multiple) {
						that._toggleVariantMultiSelect(true).then(()=>{ this.setValue(nlsConfiguratorKeys.Include_criteria); });
					}
				} else {
					that._toggleVariantDismiss().then(()=>{ this.setValue(nlsConfiguratorKeys.Exclude_criteria); });
				}
			});
		}
	};

	VariantComponentPresenter.prototype._applyAllFilters= function() {
		var that = this;
		if(that.variant.xFiltersMerge && that.configModel.getVariantVisibility(that.variant.ruleId)){
			var isFiltered = true;
			Object.keys(that.variant.xFiltersMerge).forEach(function(key) {
				if(that.variant.xFiltersMerge[key] === false){
					isFiltered = false;
				}
			});
			if (isFiltered){
				that._container.style.display = 'inline-flex';
			}else{
				that._container.style.display = 'none';
			}
		}
	};

	VariantComponentPresenter.prototype._isFiltered = function() {
		var isFiltered = true;
		if(this.variant.xFiltersMerge){
			for (var key in this.variant.xFiltersMerge) {
				if (this.variant.xFiltersMerge.hasOwnProperty(key)) {
					if(this.variant.xFiltersMerge[key] === false){
						isFiltered = false;
					}
				}
			}
		}
		return isFiltered;
	};

	VariantComponentPresenter.prototype._setVisibility= function(criteria,flag) {
		var isFiltered = this._isFiltered();
		if(criteria){
			if(this._container.style.display !== 'inline-flex'){
				flag ? this._container.classList.add("animated-variant") : this._container.classList.remove("animated-variant");
				this.configModel.setVariantVisibility(this.variant.ruleId, true);
			}
		}else{
			this.configModel.setVariantVisibility(this.variant.ruleId, false);
		}
		var values = this.configModel.getCurrentSearchData();
		if (this.configModel.getSearchStatus() && values && values.searchValue && values.searchValue.length > 0 && values.searchValue[0] !== "") {
			this.modelEvents.publish({event: 'OnSearchResult',data: values});
		}else{
			if(criteria){
				if(this._container.style.display !== 'inline-flex'){
					flag ? this._container.classList.add("animated-variant") : this._container.classList.remove("animated-variant");
					if(isFiltered) {
						this._container.style.display = 'inline-flex';
					}
					this.configModel.setVariantVisibility(this.variant.ruleId, true);
				}
			}else{
				this._container.style.display = 'none';
				this.configModel.setVariantVisibility(this.variant.ruleId, false);
			}
		}
	};

	VariantComponentPresenter.prototype.inject= function(parentcontainer) {
		parentcontainer.appendChild(this._container);
	};

	VariantComponentPresenter.prototype._getAutocomplete= function() {
		var options = {
				variant: this.variant,
				parentContainer: this._autocompleteContainer,
				imageContainer : this._imageContainer,
				configModel: this.configModel,
				modelEvents: this.modelEvents,
				pcDataUtil: this.pcDataUtil
		};
		if(this.variant.selectionType === "Parameter"){
			this._contentContainer.classList.add("contentContainerForRealistic");
			if(!this.parameterPresenter)
				this.parameterPresenter = new ParameterPresenter(options);
		}else{
			//Unconstrained mode
			// rely on ConfigModel
			if(!this.autocompletePresenter)
				this.autocompletePresenter = new MultipleValueAutocompletePresenter(options);
				
				if(this.variant.selectionCriteria == "Primary" && !this.configModel.isPrimaryEditionEnabled() ){
					this.autocompletePresenter._criteriaselection._autoComplete.disabled = true;
					this.autocompletePresenter._criteriaselection._autoComplete.placeholder = "";
		}
		}
		// if(this.version !== "V5"){
		if(!this.configModel.isAsyncRuleLoad()){
			this.updateView();
		}

		this._updateVariantComponentMode();

		//multi select toggle hidden in Complete Configuration Mode or Refine Mode
		/*if (!this._DropdownMenuSingleMode.getItem(1)) {
			//this._DropdownMenuSingleMode.addItem({ text: nlsConfiguratorKeys.Allow_Variant_MultiSelection });
			this._container.querySelector('.variantDropDownMenu_list').style.display = 'block';
		}*/

	};

	VariantComponentPresenter.prototype._updateVariantComponentMode= function(){
		this.updateView();
	};

	VariantComponentPresenter.prototype.updateView=function (data) {
		if (this.autocompletePresenter) {
			if(this.configModel.getRulesMode() === ConfiguratorVariables.RulesMode_SelectCompleteConfiguration){
				this._selectionModeAction.setValue(nlsConfiguratorKeys.Include_criteria);
				this._selectionModeAction.hide();
			} else {
				this._selectionModeAction.show();
				var currentSelectionMode = this.configModel.getFeatureSelectionMode(this.variant);
				if(currentSelectionMode === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
					this._selectionModeAction.setValue(nlsConfiguratorKeys.Exclude_criteria);
				} else {
					this._selectionModeAction.setValue(nlsConfiguratorKeys.Include_criteria);
				}
			}
			this.autocompletePresenter.enforceRequired(data);
		} else if(this.parameterPresenter){
			this.parameterPresenter.enforceRequired(data);
		}
		if("Optional" === this.variant.selectionCriteria){
			this._variantLableContainer.setAttribute('is-mandatory', this.configModel.getFeatureIdWithMandStatus(this.variant.ruleId));
		}
	};

	VariantComponentPresenter.prototype._resize= function (currentWidth) {
		var width = currentWidth || 0;
		this._container.classList.remove('smallerContainer');
		this._container.classList.remove('smallContainer');
		this._container.classList.remove('mediumContainer');
		this._container.classList.remove('largeContainer');
		if (width >= 1600) {
			this._container.classList.add('xlargeContainer');
		} else if (width < 1600 && width >= 1400) {
			this._container.classList.add('largeContainer');
		}else if (width < 1400 && width > 800) {
			this._container.classList.add('mediumContainer');
		}else if (width <= 800) {
			this._container.classList.add('smallContainer');
		}
	};

	return VariantComponentPresenter;
});

/**
 * @module DS/ConfiguratorPanel/scripts/Presenters/ConfigGridPresenter
 * @description Module-Presenter to display a resume of a PC. This presenter also support multi-selection of PC. All the selected PCs will be displayed in a single tab
 */

define(
	'DS/ConfiguratorPanel/scripts/Presenters/ConfigGridPresenter',
	[
		'UWA/Core',
		'DS/CoreEvents/ModelEvents',
		'DS/TreeModel/TreeNodeModel',
    'DS/DataGridView/DataGridView',
		'DS/TreeModel/TreeDocument',
		'DS/UIKIT/Mask',
		'DS/Utilities/Utils',
		'DS/xModelEventManager/xModelEventManager',
		'DS/ConfiguratorPanel/scripts/Utilities',
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorModel',
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
		'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionEditor',
		'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionView',
		'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectorUtil',
        'DS/ConfiguratorPanel/scripts/Presenters/NumericalSelectionEditor',
		'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
		'i18n!DS/ConfiguratorPanel/assets/nls/ConfigGridPresenter.json',
		'css!DS/ConfiguratorPanel/css/ConfigGridPresenter.css'
	],
	function (
		UWA,
		ModelEvents,
		TreeNodeModel,
		DataGridView,
		TreeDocument,
		Mask,
		Utils,
		XModelEventManager,
		Utilities,
		ConfiguratorModel,
		ConfiguratorVariables,
		CriteriaSelectionEditor,
		CriteriaSelectionView,
		CriteriaSelectorUtil,
        NumericalSelectionEditor,
		NLS_ConfiguratorPanel,
		NLS) {

    'use strict';

	var ConfigGridPresenter = function () {};

	ConfigGridPresenter.prototype.init = function (modelEvents, applicationChannel, options) {
		this.modelEvents = modelEvents || new ModelEvents();
		this._applicationChannel = applicationChannel;
		this._modelEventMap = {};
		this._modelEvents = modelEvents || new ModelEvents();
		this._configModel = options.configModel;
		this._pcDataUtil = options.pCDataUtil;
		this._dictionaryUtil = options.dictionaryDataUtil;
		this._PC_COLUMN_INDEX = 4;


		if(options.id && modelEvents) {
			this._modelEventMap[options.id] = modelEvents;
			this._eventManager = new XModelEventManager(modelEvents);
		} else {
			this._eventManager = new XModelEventManager();
		}
    this._modelVariabilityDico = {};
		this._dictionary = options.dictionary ? options.dictionary : options.configModel ?  options.configModel.getDictionary() || {features : []} : undefined;
		this._enableMatchingPC = true;
		this._pcList = (options.pcList && Array.isArray(options.pcList)) ? options.pcList.slice() : [];
		var that = this;
		var typeLabelMap = {
			'Variant' : NLS.variantType,
			'Value' : NLS.valueType,
			'VariabilityGroup' : NLS.variabilityGroupType,
			'Option' : NLS.optionType,
			'Parameter' : NLS.parameterType
		};
		this.options = {
			'_columns': [{
					text: NLS.titleLabel,
					dataIndex: 'tree',
					minWidth : 200,
					width: 300,
					pinned : 'left',
					alwaysVisibleFlag : true,
					getCellIcons : function(cellInfos) {
							if (cellInfos.nodeModel && cellInfos.nodeModel.getIcons) {
								if(cellInfos.nodeModel.options.id && that._pcDataUtil.isMandatory(cellInfos.nodeModel.options.id)) {
									return cellInfos.nodeModel.getIcons().concat({
										iconName : 'required',
										fontIconFamily: WUXManagedFontIcons.Font3DS
									});
								}
								return cellInfos.nodeModel.getIcons();
							}
						}
				},
        {
					text: NLS.typeLabel,
					dataIndex: 'type',
					width: this._enableMatchingPC ? '150': 'auto',
					visibleFlag: !this._enableMatchingPC,
					pinned : 'left',
					getCellValue : function (cellInfos) {
						if(cellInfos.nodeModel) {
							return typeLabelMap[cellInfos.nodeModel.options.grid.type];
						}
					}
  			},
        {
					text: NLS.COMMERCIAL,
					dataIndex: 'commercial',
					'width': '150',
					minWidth: '100',
					visibleFlag: this._enableMatchingPC,
					pinned: 'left',
					typeRepresentation: 'string',
					getCellValue: function (cellInfos) {
						let val = cellInfos.nodeModel.options.grid['commercial'];
						return val == true ? NLS.YES : NLS.NO;
					}
				},
        {
					text: NLS.sequenceNoLabel,
					dataIndex: 'sequenceNumber',
					'width': '150',
					minWidth : '100',
					visibleFlag: !this._enableMatchingPC,
					pinned : 'left',
					typeRepresentation : 'integer'
				}
			]
		};
		if(this._configModel.getAppFunc().selectionMode_Refine === ConfiguratorVariables.str_yes) {
			this._PC_COLUMN_INDEX = 5;

			this.options._columns.push(
				{
					text: NLS.selectionMode,
					dataIndex: 'selectionMode',
					'width': '120',
					minWidth : '100',
					visibleFlag: true,
					typeRepresentation: 'url',
					hyperlinkTarget:'_self',
					pinned : 'left',
					editable: false,
					getCellValue: function (cellInfos) {
						if(cellInfos.nodeModel) {
							if(cellInfos.nodeModel.getAttributeValue('selectionType') !== ConfiguratorVariables.feature_SelectionMode_Parameter) {
								var currentState = NLS_ConfiguratorPanel.Include_criteria; //Exclude_criteria
								var currentSelectionMode = that._configModel.getFeatureSelectionMode(cellInfos.nodeModel.getAttributeValue('ruleId'));
								if(currentSelectionMode === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
									currentState = NLS_ConfiguratorPanel.Exclude_criteria
								}
								if(cellInfos.nodeModel.getAttributeValue("selectionCriteria") === "Primary" && !that._configModel.isPrimaryEditionEnabled()){
									return {
										label: currentState
									};
								}

								return {
									label: currentState,
									url: '#selectionMode'
								};
							}
						}
					},				
				}
			);
		}
		//To keep track of loaded PCs. Note that pc id is attribute of this object.
		this._currentlyLoadedPCs = {};
		this._matchingPCActivated = false;
		this._FILTER_MODE = {
			ALL : 0,
			CHOSEN : 1,
			UNSELECTED : 2,
			RULED : 3,
			MAND : 4,
			CONFLICTED : 5,
			COMMERCIAL : 6
		};
		this._filterData = {
			ids : false, //[],
			mode : this._FILTER_MODE.ALL
		};
		this.refreshCall = Utils.throttle(this.refresh, 1000).bind(this);
		this._initDivs();
		this._initializeDataGridView();
		this._subscribeEvents();
		this._loadModel();
	};

		ConfigGridPresenter.prototype._subscribeEvents = function () {
			var that = this;

			// for (var pcId in that._modelEventMap) {
			// 	if (that._modelEventMap.hasOwnProperty(pcId)) {
					that._eventManager.subscribe(that._modelEvents, 'updateAllFilters', function (data) {
						that.updateFilters(data);
					});
					that._eventManager.subscribe(that._modelEvents, 'updateVariantList' , function (data) {
						// that.updateVariantList();
					});

					that._eventManager.subscribe(that._modelEvents, 'solveAndDiagnoseAll_SolverAnswer', function (data) {
							if(data) {
								data.updateView = true;
								if(data.answerMethod == 'solve') {
									that._pcDataUtil.setConfigCriteriaUpdated(true);
								}
							}
							that.updateFilters(data);

							that._dataGridView.layout.resetRowHeights();
					});

					that._eventManager.subscribe(that._modelEvents, 'OnAllVariantFilterIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.ALL;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'onChosenVariantIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.CHOSEN;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'OnUnselectedVariantIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.UNSELECTED;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'OnRuleNotValidatedIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.RULED;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'onMandVariantIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.MAND;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'OnConflictIconClick', function () {
							that._filterData.mode = that._FILTER_MODE.CONFLICTED;
							that._applyFilter();
					});

					that._eventManager.subscribe(that._modelEvents, 'OnCommercialIconClick', function () {
						that._filterData.mode = that._FILTER_MODE.COMMERCIAL;
						that._applyFilter();
					});



			// sortChildren event
			this.modelEvents.subscribe({event: 'OnSortResult' }, function (data) {
				var dataIndex = data.sortAttribute === 'displayName' ? 'tree' : data.sortAttribute;
				var order = data.sortOrder;

				if(dataIndex && order) {
					that._sortModel = data;
					var sortOptions = {
						dataIndex : dataIndex,
						sort : order.toLowerCase()
					};
					that._dataGridView.sortModel = [sortOptions];
				}
			});

			this.modelEvents.subscribe({event: 'applyVariantListFilters' }, function (data) {
				if(data && data.filterValues) {
					var requireFiltering = true;
					if(that._filterData.ids && that._filterData.ids.length === data.filterValues.length ) {
						if(JSON.stringify(that._filterData.ids) === JSON.stringify(data.filterValues)) {
								requireFiltering = false;
						}
					}
					if(requireFiltering) {
						that._filterData.ids = data.filterValues || [];
						that._applyFilter();
					}
				}
			});
			that._eventManager.subscribe(that._modelEvents, 'show-maching-pc-action', function (activate) {
				if(activate) {
				 	that._matchingPCActivated = true;
					setTimeout( () => {that._showMatchingPCColumns();}, 200);
				} else {
					that._matchingPCActivated = false;
					// that._hideMatchingPCColumns();
					setTimeout( () => {that._hideMatchingPCColumns();}, 200);
				}
				that._dataGridView.elements.statusBar.updateNodeModel('statusLoading', { visibleFlag: that._matchingPCActivated});
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-matching-pcs-load-end', function () {
				that._loadMatchingPCColumns();
				that._dataGridView.elements.statusBar.updateNodeModel('statusLoading', {
					grid: {
						data: NLS.loadingStatusLabel + ' : 100%',
						semantics: {
							icon: 'check'
						}
					}
				});
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-matching-pcs-count-update', function (count) {
				that._dataGridView.elements.statusBar.updateNodeModel('totalColumns',{
					grid: {
						data: NLS.totalPCLabel + ' : ' + count,
					}
				});
			});

			that._eventManager.subscribe(that._modelEvents, 'pc-notification-different-ruleMode', function (count) {
				Utilities.displayNotification({eventID: 'warning',msg: NLS.differentRuleModelMsg});
			});

			that._eventManager.subscribe(that._modelEvents, 'pc-matching-pcs-load-start', function () {
				that._dataGridView.elements.statusBar.updateNodeModel('statusLoading', {
					grid: {
						data: NLS.loadingStatusLabel + ' : 0%',
						semantics: {
							icon: 'clock'
						}
					}
				});
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-criteria-selection-change', function () {
				that._modelEvents.subscribeOnce({event: 'solveAndDiagnoseAll_SolverAnswer'}, function () {
					that._modelEvents.publish({event : 'pc-load-matching-pcs-action'});
				});
				that.callSolver();
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-select-criteria-action', function (data) {
				that._pcDataUtil.selectValue(data.id, data.value);
				that._modelEvents.publish({event : 'pc-criteria-selection-change'});
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-reject-criteria-action', function (data) {
				that._pcDataUtil.rejectValue(data.id, data.value);
				that._modelEvents.publish({event : 'pc-criteria-selection-change'});
				// that.callSolver();
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-validate-criteria-action', function (data) {
				that._pcDataUtil.validateValue(data.id, data.value);
				that._modelEvents.publish({event : 'pc-criteria-selection-change'});
				// that.callSolver();
			});
            that._eventManager.subscribe(that._modelEvents, 'pc-reject-numericalvalue-action', function(data) {
                that._pcDataUtil.rejectNumericalValue(data.id);
                that._modelEvents.publish({
                    event: 'pc-criteria-selection-change'
                });
                // that.callSolver();
            });
            that._eventManager.subscribe(that._modelEvents, 'pc-validate-numericalvalue-action', function(data) {
                that._pcDataUtil.validateNumericalValue(data.id, data.value);
                that._modelEvents.publish({
                    event: 'pc-criteria-selection-change'
                });
                // that.callSolver();
            });

			that._eventManager.subscribe(that._modelEvents, 'OnRuleAssistanceLevelChange', function (data) {
				if (data.value == ConfiguratorVariables.NoRuleApplied) {
					that._modelEvents.publish({event : 'pc-load-matching-pcs-action'});
				} else {
					that._modelEvents.subscribeOnce({event: 'solveAndDiagnoseAll_SolverAnswer'}, function () {
						that._modelEvents.publish({event : 'pc-load-matching-pcs-action'});
					});
				}
			});


			that._eventManager.subscribe(that._modelEvents, 'pc-diagnose-criteria-action', function (data) {
				that._modelEvents.subscribeOnce({event : 'solveAndDiagnoseAll_SolverAnswer'}, function () {
					that._pcDataUtil.setDiagnosedCriteria(data.id , true);
					that._modelEvents.publish({ event : 'pc-diagnose-criteria-done', data : data });
				});
				that.callSolverOnSelectedIDs(data.id);
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-update-row-height', function (data) {
				that._dataGridView.layout.resetRowHeights();
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-show-criteria-tooltip', function (data) {
				that._updateTooltip(data.id, data.value);
			});
			that._eventManager.subscribe(that._modelEvents, 'pc-refresh-pc-content', function (pcId) {
				var columnID = that._dataGridView.layout.getColumnIndex(pcId);
				if(columnID > that._PC_COLUMN_INDEX) {
					that._dataGridView.updateRenderedColumn(columnID,{
						updateCellContent: true,
						updateCellLayout: false,
						updateCellAttributes: false
					});
				}
			});
		};

		ConfigGridPresenter.prototype.updateFilters= function(data){
			var that = this;
			this.defaults = data ? data.answerDefaults : [];

			// var configModel = this._configModel;
			// if(configModel) {
				that._treeDocument.prepareUpdate();
				var variantNodes = that._treeDocument.getChildren();
				if(variantNodes) {

					variantNodes.forEach(function (variantNode) {
						// variantNode.options.id;
						if(data && data.updateView && that._configModel.getUpdateRequired(variantNode.options.id)){
							//that._updateView(variantNode, data);
						}

					});
				}
				that._treeDocument.pushUpdate();

			that.refreshCall();
			// that.updateVariantList();
		};

		ConfigGridPresenter.prototype._applyFilter = function() {
			var data = this._filterData.ids;
			var mode = this._filterData.mode;
			var that = this;
			var children = this._treeDocument.getChildren();
			if(!children) {
				children = [];
			}

			// this._FILTER_MODE = {
			// 	ALL : 0,
			// 	CHOSEN : 1,
			// 	UNSELECTED : 2,
			// 	RULED : 3,
			// 	CONFLICTED : 4
			// }
			this._treeDocument.prepareUpdate();
			children.forEach(function (nodeModel) {

				var visibility = false;
				var isFiltered = false;
				// APPLYING FILTER
				// if(configModel) {
					var featureId = nodeModel.options.id;
					var isMand = that._configModel.getFeatureIdWithMandStatus(featureId);
					var conflictOptions = that._configModel.getConflictingFeatures(), conflictingFeatures = [];
					if(that._configModel.getNumberOfConflictingFeatures() > 0){
						for (var i = 0; i < conflictOptions.length; i++) {
							conflictingFeatures.push(that._configModel.getFeatureIdWithOptionId(conflictOptions[i]));
						}
					}
					var isConflicting = conflictingFeatures.indexOf(featureId) !== -1 ;
					var isAllOptionsIncompatible = false; 
					var options = nodeModel.getAttributeValue('options');
					if(options && options.length > 0) {
						isAllOptionsIncompatible = true;
						options.forEach(function (option) {
							if(that._configModel.getStateWithId(option.ruleId) !== ConfiguratorVariables.Incompatible)
								isAllOptionsIncompatible = false;
						});			
					}					
							
					// Hide if not mand, not conflicting, but all options incompabible
					if(	!isMand 
						&&
						!isConflicting
						&& 		
						isAllOptionsIncompatible) {			
							visibility = false;
							isFiltered = true;

					} else {
						visibility = true;
					}
					if(mode === undefined || mode !== that._FILTER_MODE.ALL) {
						isFiltered = true;
					}
					if(visibility) {
						switch (mode) {
							// case that._FILTER_MODE.ALL:
							// 		visibility = true;
							case that._FILTER_MODE.CHOSEN:
									var isChosen = that._configModel.getFeatureIdWithChosenStatus(featureId);
									visibility = isChosen;
								break;
							case that._FILTER_MODE.UNSELECTED:
									var isSelcted = that._configModel.getFeatureIdWithStatus(featureId);
									visibility = !isSelcted;
								break;
							case that._FILTER_MODE.RULED:
									var isSelected = that._configModel.getFeatureIdWithRulesStatus(featureId);
									visibility = isSelected;
								break;
							case that._FILTER_MODE.MAND:
									// var isMand = that._configModel.getFeatureIdWithMandStatus(featureId);
									visibility = isMand;
								break;
							case that._FILTER_MODE.CONFLICTED:							
								var rulesActivationStatus = that._configModel.getRulesActivation();								
								visibility = isConflicting ? rulesActivationStatus === ConfiguratorVariables.str_true : false ;
								break;
							case that._FILTER_MODE.COMMERCIAL:
								var isCommercial = that._configModel.getFeatureIdWithCommercialStatus(featureId);
								visibility = isCommercial;
								break;
							default :
								visibility = true;
						}

					}
				// }

				if(isFiltered && visibility === false) {
					nodeModel.hide();
				} else {
					// APPLYING SEARCH
					if(data) {
						if(data.indexOf(nodeModel.options.id) !== -1) {
							visibility = true;
						} else {
							visibility = false;
						}
					} else {
						visibility = true;
					}

					if(visibility) {
						nodeModel.show();
						nodeModel.showChildNodes();
					} else {
					// var visibleNodes = nodeModel.search({
					// 		match : function (cellInfos) {
					// 			if(data.indexOf(cellInfos.nodeModel.options.id) !== -1) {
					// 				cellInfos.nodeModel.show();
					// 				return true;
					// 			} else {
					// 				cellInfos.nodeModel.hide();
					// 				return false;
					// 			}
					// 		}
					// 	});
						var hasOptions = false;
						if(nodeModel.getAttributeValue('options')) {
							hasOptions = nodeModel.getAttributeValue('options').find((item) => {
								if(data.indexOf(item.ruleId) !== -1) {
									return true;
								} else {
									return false;
								}
							});
						}
						if(hasOptions) {
							nodeModel.show();
						} else {
							nodeModel.hide();
						}
					}
				}
			});

			this._treeDocument.pushUpdate();
			this.refreshCall();
		};

/*
		ConfigGridPresenter.prototype._updateView = function(node, data) {
			// TODO: update nodes
			var configModel = this._configModel;
			var mandatory = (node.getAttributeValue('selectionCriteria') === 'Must' || node.getAttributeValue('selectionCriteria') === true);
				var mandStatus = (mandatory || configModel.getStateWithId(node.options.id) === ConfiguratorVariables.Required);

				node.prepareUpdate();
				var children = node.getChildren();
				if(children) {
					children.forEach(function (nodeModel) {
						var state = configModel.getStateWithId(nodeModel.options.id);
						if(state === ConfiguratorVariables.Chosen || state === ConfiguratorVariables.Required || state === ConfiguratorVariables.Default) {
							mandStatus = false;
						}
					});
				}
				var icons = UWA.clone(node.options.icons);
				if(mandStatus) {
					while(icons.length > 1) {
						icons.pop();
					}
					icons.push({
						iconName : 'attention',
						fontIconFamily: WUXManagedFontIcons.Font3DS
					});
					node.options.icons = icons;
				} else {
					while(icons.length > 1) {
						icons.pop();
						node.options.icons = icons;
					}
				}
				node.pushUpdate();
		}; */

    ConfigGridPresenter.prototype._initDivs = function () {
			this._container = UWA.createElement('div');
			this._container.classList.add('pc-summary');
			this._contentDiv = UWA.createElement('div');
			this._contentDiv.classList.add('contentDiv');
			this._contentDiv.innerHTML = '';
			this._container.appendChild(this._contentDiv);
		};


    ConfigGridPresenter.prototype._initializeDataGridView = function () {
			var that = this;
	    this._treeDocument = new TreeDocument();

			var _delayRequest = Utils.debounce(that._loadPCRequest, 1000).bind(that);
			this._dataGridView = new DataGridView({
	        treeDocument: that._treeDocument,
					columns: that.options._columns,
					resize: {
						rows: false,
						columns: true,
					},
					enableDragAndDrop: false,
					showSelectionCheckBoxesFlag : false,
					rowSelection : 'none',
					columnSelection : 'none',
					onDelayedModelDataRequest : function (request) {
						var displayedColumns = request.displayedColumnsIndexes;
						displayedColumns = displayedColumns.filter((item) => item > that._PC_COLUMN_INDEX);
						if(displayedColumns.length > 0) {
							// console.log('Loading colunms ' + displayedColumns);
							_delayRequest(displayedColumns);
						}
					}
			}).inject(this._contentDiv);

	    this._dataGridView.elements.container.style.height = '100%';

        //Create and register Type Representations//
				this._dataGridView.registerReusableCellContent({
					id: 'criteriaSelectionEditor',
	        buildContent: function () {
							return new CriteriaSelectionEditor({});
	        },
					cleanContent : function (content) {
						if(content && UWA.is(content.cleanContent, 'function')) {
							content.cleanContent();
						}
					}
				});
				this._dataGridView.registerReusableCellContent({
					id: 'criteriaSelectionView',
	        buildContent: function () {
							return new CriteriaSelectionView({});
	        }
				});
  			this._dataGridView.registerReusableCellContent({
                id: 'numericalSelectionEditor',
                buildContent: function() {
                    return new NumericalSelectionEditor({});
                },
                cleanContent: function(content) {
                    if (content && UWA.is(content.cleanContent, 'function')) {
                        content.cleanContent();
                    }
                }
            });


				var statusBarInfos = [{
          type: 0,
          id: 'totalRows',
          dataElements: {
            typeRepresentation: 'string',
            value: 'Total Variability' + ' : ' + 0,
            displayLabel: true
          }
        }, {
          type: 0,
          id: 'totalColumns',
          dataElements: {
            typeRepresentation: 'string',
            value: NLS.totalPCLabel + ' : ' + 0,
            displayLabel: true
          }
        },{
					type: 0,
					id: 'statusLoading',
					dataElements: {
						position: 'far',
						typeRepresentation: 'string',
						value: NLS.loadingStatusLabel + ' : 0%',
						displayLabel: true,
						icon: 'clock',
						visibleFlag : false
					}
				}];
				this._dataGridView.buildStatusBar(statusBarInfos);
				this._dataGridView.onContextualEvent = function(params) {
          var menu = [];
          if (params && params.collectionView) {
            if(params.cellInfos && params.cellInfos.rowID == -1){
							if(params.cellInfos.columnID < that._PC_COLUMN_INDEX+1) {
								var headerContextualEventOptions = {
										pin: false,
										firstColumnsVisibility: true,
										columnsManagement: false,
										sizeColumnToFit: false,
										insertRow: false
								};
								menu = params.collectionView.buildDefaultContextualMenu(params, headerContextualEventOptions);
								menu = menu.splice(0, that._PC_COLUMN_INDEX+1);
								var selectionModeMenuItem = menu.find((item) => item.action.context.id == 'selectionMode');
								if(selectionModeMenuItem) {
									selectionModeMenuItem.state = '|disabled';
								}
							} else if(params.cellInfos.columnID >= that._PC_COLUMN_INDEX+1){
								var applySelectionsAction = {
									type: 'PushItem',
									title: NLS.applySelectionAction,
									icon : 'list-ok',
									action: {
										callback: function(e) {
											that._applySelections(e.context);
										},
										context: params.cellInfos
									}
								};
								var openAction = {
									type: 'PushItem',
									title: NLS.openPCAction,
									icon : 'open',
									action: {
										callback: function(e) {
											that._openPCAction(e.context);
										},
										context: params.cellInfos
									}
								};
								menu.push(applySelectionsAction);
								if(that._configModel.getPCId()){
									menu.push(openAction);
								}
							}
            }
          }
          return menu;
        };
				this._dataGridView.onReady(() => {
				    var count = this._treeDocument.getAllDescendants().length;
						this._dataGridView.elements.statusBar.updateNodeModel('totalRows', {
							grid: {
								data: NLS.totalVariablityLabel + ' : ' + count,
							}
						});
				});

				/*
				this._treeDocument.addEventListener('state-change-action', function (evtData) {
					var referenceValue = evtData.data.referenceValue;
					var dataIndex = that._dataGridView.layout.getDataIndexFromColumnIndex(this.columnID);
					var context = this;
					UWA.merge(context, {dataIndex : dataIndex});
					if(referenceValue === ConfiguratorVariables.Unselected) {
						that._onSelect(referenceValue, context);
					} else {
						that._updateTooltip(context);
					}
				});

				this._treeDocument.addEventListener('state-validate-action', function (evtData) {
					var referenceValue = evtData.data.referenceValue;
					var dataIndex = that._dataGridView.layout.getDataIndexFromColumnIndex(this.columnID);
					var context = this;
					UWA.merge(context, {dataIndex : dataIndex});
					that._onSelect(referenceValue, context);
				});

				this._treeDocument.addEventListener('value-change-action', function (evtData) {
					var referenceValue = evtData.data.referenceValue;
					var value = evtData.data.value;
					var dataIndex = that._dataGridView.layout.getDataIndexFromColumnIndex(this.columnID);
					var context = this;
					UWA.merge(context, {dataIndex : dataIndex});
					that._onValueUpdate(value, context);
				});

				this._treeDocument.addEventListener('state-remove-action', function (evtData) {
					UWA.log('state-remove');
					var referenceValue = evtData.data.referenceValue;

					var dataIndex = that._dataGridView.layout.getDataIndexFromColumnIndex(this.columnID);
					var context = this;
					UWA.merge(context, {dataIndex : dataIndex});
					that._onUnselect(referenceValue, context);
				}); */

				// updating min width of sequenceNumber columns. fix for IR-729943: Size All Columns to Fit command KO
				that._dataGridView.addEventListener('allCellsRendered', function () {
					try {
						var cellID = that._dataGridView.layout.getCellIDFromCoordinates({
							rowID: -1,
							columnID: 2
						});
						if(UWA.is(that._dataGridView._getRenderedCellAt, 'function')) {
							var cell = that._dataGridView._getRenderedCellAt(cellID);
							if (cell && cell.component) {
								var contentSizeWithoutBorder = cell.component.computeContentSize();
								var borderSize = 2; //Take borders in account.
								var contentSize = contentSizeWithoutBorder + borderSize;
								if(contentSize > 100) {
									that._dataGridView.layout.columns[2].minWidth = contentSize.toString();
								}
							}
						}
					} catch (ignore) {}
				});
				that._dataGridView.addEventListener('click', function (e, cellInfos) {
					if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options.id) {
								var id = cellInfos.nodeModel.options.id;
								var href = e.target.getAttribute('href');
								if(href === '#selectionMode') {
									if(that._configModel.getFeatureSelectionMode(cellInfos.nodeModel.getAttributeValue('ruleId')) === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
										that._updateSelectionMode({id : id, selectionMode : cellInfos.nodeModel.getAttributeValue('selectionType')});
									} else {
										that._updateSelectionMode({id : id, selectionMode : ConfiguratorVariables.feature_SelectionMode_Dismiss});
									}
								}
						}
				})
				//
		};


		ConfigGridPresenter.prototype._updateTooltip = function (id, value) {
			var configModel = this._configModel;

			var optionId = value; //currentNode.options.id;
			var message = "";
			var that = this;
			if(configModel.getRulesActivation() === ConfiguratorVariables.str_true && configModel.isConflictingOption(optionId)) {
				message = this._pcDataUtil._getConflictingMessage(optionId);


			} else {
				message =  NLS_ConfiguratorPanel.get("Loading");
				this._pcDataUtil._getReasonMessage(optionId).then((msg) => that._criteriaSelectorUtil.updateTooltip(id, msg));

			}
			// currentNode.getModelEvents().publish({ 'event' : 'state-message-update', data : message });
			that._criteriaSelectorUtil.updateTooltip(id, message);
		};

		ConfigGridPresenter.prototype.callSolver = function () {
			var modelEvent = this._modelEvents;
			if(this._configModel && modelEvent) {
				if(this._configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
					modelEvent.publish({event:'SolverFct_CallSolveMethodOnSolver', data : {}});
				}else{
					this.updateFilters();
					modelEvent.publish({event: 'solveAndDiagnoseAll_SolverAnswer'});
				}
			}
		};
		ConfigGridPresenter.prototype.callSolverOnSelectedIDs = function (id) {
			var modelEvent = this._modelEvents;
			if(this._configModel && modelEvent) {
				if(this._configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
					var idsToDiagnose = this._pcDataUtil.getIdsToDiagnose(id);
					modelEvent.publish({event:'SolverFct_CallSolveOnSelectedIDsMethodOnSolver', data : {"idsToDiagnose" : idsToDiagnose}});
				}else{
					this.updateFilters();
					modelEvent.publish({event: 'solveAndDiagnoseAll_SolverAnswer'});
				}
			}
		};

		ConfigGridPresenter.prototype._loadModel = function () {
        // this._dictionary
				// this._treeDocument
				var that = this;
				if(this._dictionary) {
					this._treeDocument.prepareUpdate();
					this._treeDocument.removeRoots();
					if(UWA.is(this._dictionary.features,'array')) {
						this._dictionary.features.forEach(function (feature) {
							var featureNode = that._createTreeNode(feature);
							if(featureNode) {
								that._treeDocument.addChild(featureNode);
							}
						});

					}
					this._treeDocument.pushUpdate();
					this._isLoaded = true;
				}
    };

		ConfigGridPresenter.prototype._createTreeNode = function (contentOptions) {
			var tmpTreeNode;
			if(contentOptions) {
				var id = contentOptions.ruleId;
				var label = contentOptions.displayName;
				if(id && label) {
					var image = contentOptions.image;
					var gridValue = {};
					for (var optionKey in contentOptions) {
						if (contentOptions.hasOwnProperty(optionKey)) {
							// if(optionKey === 'options') {
							// 	continue;
							// }
							gridValue[optionKey] = contentOptions[optionKey];
						}
					}

					tmpTreeNode = new TreeNodeModel({
						id: id,
						label: label,
						icons: image ? [image] : [],
						grid: gridValue,
					});
				}
			}
			return tmpTreeNode;
		};

		ConfigGridPresenter.prototype.refresh = function (forceUpdate) {
			if(forceUpdate && this._pcDataUtil) {
				this._pcDataUtil.refresh();
			}
			if(this._dataGridView) {
				try {
					this._dataGridView.updateRenderedColumn(this._PC_COLUMN_INDEX,{
					updateCellContent: true,
					updateCellLayout: false,
					updateCellAttributes: false
				});
				} catch (e) {
					console.log('Error in refreshing');
				}
				this._dataGridView.layout.setColumnVisibleFlag('selectionMode', (this._configModel.getRulesMode() !== ConfiguratorVariables.RulesMode_SelectCompleteConfiguration));
			}
		};

		ConfigGridPresenter.prototype.loadVariabilityDictionary = function (dictionary) {
			this._variabilityDictionary = dictionary;
			this._isLoaded = false;
		};

		ConfigGridPresenter.prototype.inject = function (parentContainer) {
        this._container.inject(parentContainer);
    };

		ConfigGridPresenter.prototype.clear = function () {
			this._container.innerHTML = '';
		};

    ConfigGridPresenter.prototype.destroy = function () {
			this._eventManager.cleanup();
			this._container.innerHTML = '';
		};


		//Product Configuration management as a columns//
		ConfigGridPresenter.prototype.loadConfigurationInfo = function (pcDetails, configurations) {

			if(pcDetails && pcDetails.id) {
				var pcId = pcDetails.id;

				if(!configurations) {
					configurations = {};
				}
				if(!this._configModel) {
					var configModel = new ConfiguratorModel({
						configuration: configurations,
						pcId: pcId,
						appRulesParams: {
							multiSelection: 'true',
							selectionMode: 'selectionMode_Build',
							rulesMode: '',
							rulesActivation: 'true',
							completenessStatus: 'Unknown',
							rulesCompliancyStatus: 'Unknown'
						},
						appFunc: {
							multiSelection: "yes",
							selectionMode_Build: "yes",
							selectionMode_Refine: "yes",
							rulesMode_ProposeOptimizedConfiguration:  "no",
							rulesMode_SelectCompleteConfiguration: "no",
							rulesMode_EnforceRequiredOptions: "yes",
							rulesMode_DisableIncompatibleOptions: "yes"
						},
						modelEvents: new ModelEvents(),
						readOnly: true,
						enableValidation : false
					});

					if((!this._dictionary && this._variabilityDictionary) || !this._isLoaded) {
						configModel.setDictionary(this._variabilityDictionary);
						this._dictionary = configModel.getDictionary();
						this._loadModel();
					}
					this._configModel = configModel;
				}

				this._criteriaSelectorUtil = new CriteriaSelectorUtil({configModel : this._configModel, modelEvents: this._modelEvents, pCDataUtil:  this._pcDataUtil, dictionaryDataUtil : this._dictionaryUtil});
				this._pcDataUtil = this._criteriaSelectorUtil._pcDataUtil;
				this._loadColumnForPC(pcDetails, configurations);
			}
		};

		ConfigGridPresenter.prototype._loadColumnForPC = function (pcObj, pcStatusInfo) {
			if (pcObj && pcStatusInfo) {
				if (this._currentlyLoadedPCs[pcObj.id] === undefined) {
					this._createColumnForPC(pcObj, pcStatusInfo);
				} else {
					UWA.log("PC with id : " + pcObj.id + " is already loaded in the view...");
				}
			}
		};

		ConfigGridPresenter.prototype._createColumnForPC = function (pcObj, pcStatusInfo) {
			var that = this;
			this._currentlyLoadedPCs[pcObj.id] = pcStatusInfo;

			var columnOptions = {
				'dataIndex': pcObj.id,
				'text': pcObj['title'] ? pcObj['title'] : NLS.configurationLabel,
			 	'width': 200,
				minWidth: 300,
				icon : pcObj['image'] ? pcObj['image'] : '',
			  typeRepresentation : 'integer', //'selectionStateType',
				// getCellTypeRepresentation: 'integer',
				sortableFlag : false,
				pinned : 'left',
				alwaysVisibleFlag : true,
				autoRowHeightFlag: true,
			   getCellValue : function(cellInfos) {
					 	if(!cellInfos.nodeModel) {
							return;
						}
					 	var state = '';
						var configModel = that._configModel;
						if(!configModel) {
							return;
						}
						if(cellInfos.nodeModel.options.grid.type === 'Variant' ||
								cellInfos.nodeModel.options.grid.type === 'VariabilityGroup') {
									return '';
						} else if (cellInfos.nodeModel.options.grid.type === 'Parameter') {
                        	return configModel.getValueWithId(cellInfos.nodeModel.options.id) ? configModel.getValueWithId(cellInfos.nodeModel.options.id).NumericalValue : null;
                   		 }
						state = configModel.getStateWithId(cellInfos.nodeModel.options.id);
						if(configModel.getRulesActivation() === ConfiguratorVariables.str_true && configModel.isConflictingOption(cellInfos.nodeModel.options.id)) {
							state = ConfiguratorVariables.Conflict;
						}
			      return state;
			   },
				 editionPolicy : 'EditionInPlace',
				 onCellRequest : function (cellInfos) {
                    var component;

					if(this.isCellActive(cellInfos.cellID)) {
						component = cellInfos.cellView.getReusableContent();
					// component.setProperties(that._criteriaSelectorUtil.getProperties(cellInfos.nodeModel.options.id));
						if( component && component.context === cellInfos.nodeModel.options.id) {
							if( cellInfos.nodeModel.getAttributeValue('type') === 'Variant' || cellInfos.nodeModel.getAttributeValue('type') === 'VariabilityGroup')
								that._criteriaSelectorUtil.updateComponent(component, cellInfos.nodeModel.options.id);
							else
								that._criteriaSelectorUtil.updateNumericalComponent(component, cellInfos.nodeModel.options.id);
						}
						else
							component = null;
					}
					if(!component) {
						if( cellInfos.nodeModel.getAttributeValue('type') === 'Variant' || cellInfos.nodeModel.getAttributeValue('type') === 'VariabilityGroup')
							component = that._dataGridView.reuseCellContent('criteriaSelectionEditor');
						else
							component = that._dataGridView.reuseCellContent('numericalSelectionEditor');
						component.context = cellInfos.nodeModel.options.id;
						cellInfos.cellView.setReusableContent(component);
					}

					if(component) {
						if( cellInfos.nodeModel.getAttributeValue('type') === 'Variant' || cellInfos.nodeModel.getAttributeValue('type') === 'VariabilityGroup') {
							that._criteriaSelectorUtil.updateComponent(component, cellInfos.nodeModel.options.id);
							if(that._sortModel) {
								component.setProperties({sort: { attribute: that._sortModel.sortAttribute, order: that._sortModel.sortOrder}});
							}
						}
						else {
							that._criteriaSelectorUtil.updateNumericalComponent(component,cellInfos.nodeModel.options.id);
						}
					}
					if(cellInfos.nodeModel._options.grid.type==="Variant" && cellInfos.nodeModel._options.grid.selectionCriteria == "Primary"){
						component.disabled =true;
						component._autoComplete.disabled=true;
						component._autoComplete.placeholder="";
					}

				 },
				 getCellEditableState : function (cellInfos) {
				 		return true;
				 },
				 getCellSemantics : function (cellInfos) {
					 var options = {};
					 if(cellInfos.nodeModel && (cellInfos.nodeModel.getAttributeValue('type') === 'Parameter')) {
						 options.minValue = that._configModel.getValueWithId(cellInfos.nodeModel.getAttributeValue('ruleId')).MinValue;
						 options.maxValue = that._configModel.getValueWithId(cellInfos.nodeModel.getAttributeValue('ruleId')).MaxValue;
						 options.stepValue = cellInfos.nodeModel.getAttributeValue('stepValue');
						 options.units = cellInfos.nodeModel.getAttributeValue('nlsUnit') || '';
					 }
					 return options;
				 },
				 setCellValue : function (cellInfos, value) {
					 if(cellInfos.nodeModel && (cellInfos.nodeModel.getAttributeValue('type') === 'Parameter') && UWA.is(value,'number')) {
						 var paramId = cellInfos.nodeModel.getAttributeValue('ruleId');
						 that._pcDataUtil.setParamValue(paramId, value, ConfiguratorVariables.Chosen);
                         that.callSolver();
					}
				 }
			};
			that._dataGridView.prepareUpdateView();
      that._dataGridView.addColumnOrGroup(columnOptions);  //where to show PC information. in edit mode it would be col 2 else its just last column
			that._dataGridView.pushUpdateView();
			that.refreshCall();
		};


		ConfigGridPresenter.prototype._applySelections = async function (context) {
			// console.log('apply to selection action');
			var pcId = this._dataGridView.layout.getDataIndexFromColumnIndex(context.columnID);
			await this._pcDataUtil.applyPCSelections(pcId);
			this._modelEvents.publish({event : 'pc-criteria-selection-change'});
		};

		ConfigGridPresenter.prototype._updateSelectionMode = function (options) {
			console.log('update selection mode for '+ options.id);
			var that = this;
			var currentSelectionMode = this._configModel.getFeatureSelectionMode(options.id);
			var criteria = this._dictionaryUtil.getDetails(options.id);
			if(options.selectionMode === ConfiguratorVariables.feature_SelectionMode_Single || options.selectionMode === ConfiguratorVariables.feature_SelectionMode_Multiple) {
				if(currentSelectionMode === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
					this._modelEvents.publish({event: 'pc-confirm-variant-includeSelect', data : {
							feature : criteria,
							needConfirm : true,
							callback : function (confirmed) {
								var isSolverCalled = false;
								if(confirmed) {
									if(that._configModel.switchIncludeOptions(criteria)) { //emptyDismissedOptions
										isSolverCalled = true;
										that.callSolver();
									}
								} else {
									if(that._configModel.emptyDismissedOptions(criteria)) { //
			            	isSolverCalled = true;
										that.callSolver();
									}
								}
								if(options.selectionMode === ConfiguratorVariables.feature_SelectionMode_Single) {
									that._configModel.setFeatureSingleSelectionMode(criteria);
								} else {
									that._configModel.setFeatureMultiSelectionMode(criteria);
								}
			            if(!isSolverCalled){
			              	that._modelEvents.publish({event: 'updateAllFilters'});
			            }

							}
						}
					});
				}
			} else if(options.selectionMode === ConfiguratorVariables.feature_SelectionMode_Multiple) {
				if(currentSelectionMode != ConfiguratorVariables.feature_SelectionMode_Multiple) {
					this._modelEvents.publish({event: 'pc-confirm-variant-multiSelect', data : {
							feature : criteria,
							needConfirm : true,
							callback : function (confirmed) {
								if(confirmed) {
			          	var isSolverCalled = false;
									if(that._configModel.emptyDismissedOptions(criteria)) {
			            	isSolverCalled = true;
										that.callSolver();
									}
									that._configModel.setFeatureMultiSelectionMode(criteria);
			            if(!isSolverCalled){
			              	that._modelEvents.publish({event: 'updateAllFilters'});
			            }
								}
							}
						}
					});
				}
			} else if(options.selectionMode === ConfiguratorVariables.feature_SelectionMode_Dismiss) {
				if(currentSelectionMode != ConfiguratorVariables.feature_SelectionMode_Dismiss) {
					this._modelEvents.publish({event: 'pc-confirm-variant-excludeSelect', data : {
							feature : criteria,
							needConfirm : true,
							callback : function (confirmed) {
								var isSolverCalled = false;
								if(confirmed) {
									if(that._configModel.switchExcludeOptions(criteria)){
										isSolverCalled = true;
										that.callSolver();
									}
								} else {
									if(that._configModel.emptyChosenOptions(criteria)) {
										isSolverCalled = true;
										that.callSolver();
									}
								}
									that._configModel.setFeatureDismissMode(criteria);
									if(!isSolverCalled){
											that._modelEvents.publish({event: 'updateAllFilters'});
									}

							}
						}
					});
				}
			}



		};

		ConfigGridPresenter.prototype._openPCAction = function (context) {
			var pcId = this._dataGridView.layout.getDataIndexFromColumnIndex(context.columnID);
			this._modelEvents.publish({event : 'pc-open-action', data: this._pcDataUtil.getPCDetails(pcId)});
		};

		ConfigGridPresenter.prototype._loadMatchingPCColumns = function () {
			this._dataGridView.prepareUpdateView();
			var columns = this._dataGridView.layout.getLeafColumns().slice(0, this._PC_COLUMN_INDEX+1);
			this._dataGridView.columns = columns;
			var pcList = this._pcDataUtil.getMatchingPCs();
			if(pcList.length > 0) {
				// var columns = [];
				var columns = pcList.map((pcObj) => {
					return {
						dataIndex : pcObj.id,
						text : pcObj.title + ' ' + pcObj.version,
						width : 200,
						minWidth: 300,
						sortableFlag : false,
						visibleFlag : this._matchingPCActivated,
						typeRepresentation: "integer",
						autoRowHeightFlag: true,
						getCellValue :  (cellInfos) => {
							if(cellInfos.nodeModel && cellInfos.nodeModel.options.id) {
								var pcId = this._dataGridView.getColumnOrGroup(cellInfos.columnID).dataIndex;
								return this._pcDataUtil.getSelectionValue(pcId, cellInfos.nodeModel.options.id);
							}
						},
						onCellRequest : (cellInfos) => {
	 					 if(cellInfos.nodeModel) {
							 if(cellInfos.nodeModel.getAttributeValue('type') === 'Variant' || cellInfos.nodeModel.getAttributeValue('type') === 'VariabilityGroup') {
								 // this._dataGridView.defaultOnCellRequest(cellInfos);
								 setTimeout(() => {
									 if(!this._dataGridView.getVisibleCellsInViewport().hasOwnProperty(cellInfos.cellID)) {
										 cellInfos.cellModel = '';
										 try {
										 	this._dataGridView.defaultOnCellRequest(cellInfos);
										} catch (e) {
											 //	ignore : error means cell is removed
										 }
										 return;
									 }
									 var component = this._dataGridView.reuseCellContent('criteriaSelectionView');
									 var value = cellInfos.cellModel;
									 if(UWA.is(value, 'array')) {
										 component.setProperties({value : value, multiValue: true});
									 } else if (value){
										 component.setProperties({value : [value], multiValue: false});
									 } else {
										 component.setProperties({value : null, multiValue: false});
									 }
									 cellInfos.cellView.setReusableContent(component);
								 }, 10);
							 } else {
								 this._dataGridView.defaultOnCellRequest(cellInfos);
							 }
	 					 } else {
	 						 this._dataGridView.defaultOnCellRequest(cellInfos);
	 					 }
	 				 },
					 getCellSemantics : (cellInfos) => {
						 var options = {};
						if(cellInfos.nodeModel && (cellInfos.nodeModel.getAttributeValue('type') === 'Parameter') && cellInfos.cellModel != undefined) {
							options.units = cellInfos.nodeModel.getAttributeValue('nlsUnit') || '';
						}
						return options;
					 }
					};
				});
				this._dataGridView.columns = this._dataGridView.columns.concat(columns);
			}
			// setTimeout(()=>{
				this._dataGridView.layout.applyColumns();
				this._dataGridView.pushUpdateView();
				this._dataGridView.requestDelayedModelData('OnAddColumn');
			// },2000);
		};

		ConfigGridPresenter.prototype._showMatchingPCColumns = function () {
			// var pcList = this._pcDataUtil.getMatchingPCs();
			// pcList.forEach((pcObj) => {
			// 	this._dataGridView.layout.setColumnVisibleFlag(pcObj.id, true);
			// });
			for (var i = this._PC_COLUMN_INDEX+1; i < this._dataGridView.columns.length; i++) {
				this._dataGridView.columns[i].visibleFlag = true;
			}
			this._dataGridView.layout.applyColumns();
		};
		ConfigGridPresenter.prototype._hideMatchingPCColumns = function () {
			// var pcList = this._pcDataUtil.getMatchingPCs();
			// pcList.forEach((pcObj) => {
			// 	this._dataGridView.layout.setColumnVisibleFlag(pcObj.id, false);
			// });
			for (var i = this._PC_COLUMN_INDEX+1; i < this._dataGridView.columns.length; i++) {
				this._dataGridView.columns[i].visibleFlag = false;
			}
			this._dataGridView.layout.applyColumns();
		};
		ConfigGridPresenter.prototype._loadPCRequest = function (columnIndexes) {
			var totalColumns =  this._dataGridView.columns.length;
			var pcListToLoad = [];
			columnIndexes.forEach((index) => {
				if(index < totalColumns) {
					pcListToLoad.push(this._dataGridView.layout.getDataIndexFromColumnIndex(index));
				}
			});

			// console.log("Load PC request" + pcListToLoad);
			this._pcDataUtil.loadPCDetails(pcListToLoad);
		};

		return ConfigGridPresenter;
});


define(
	'DS/ConfiguratorPanel/scripts/Presenters/VariantListPresenter',
	[
		'UWA/Core',
		'DS/Handlebars/Handlebars',
		'DS/UIKIT/Mask',
		'DS/UIKIT/Scroller',
		'DS/ConfiguratorPanel/scripts/Presenters/VariantComponentPresenter',
		'DS/ConfiguratorPanel/scripts/Utilities',
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
		'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
		'text!DS/ConfiguratorPanel/html/VariantListPresenter.html',
		"css!DS/ConfiguratorPanel/css/VariantListPresenter.css",
		'css!DS/UIKIT/UIKIT.css'

	],
	function (UWA, Handlebars, Mask, Scroller, variantComponentPresenter, Utilities, ConfiguratorVariables, nlsConfiguratorKeys, html_VariantListPresenter) {

		'use strict';

		var template = Handlebars.compile(html_VariantListPresenter);

		var VariantListPresenter = function (options) {
			this._init(options);
		};

		VariantListPresenter.prototype._init = function (options) {
			var _options = options ? UWA.clone(options, false) : {};
			UWA.merge(this, _options);

			this._subscribeToEvents();
			this._initDivs();
			this._render();
			this.inject(_options.parentContainer);
			// new Scroller({element: this._container}).inject(this._scrollContainer);
		};

		VariantListPresenter.prototype._initDivs = function () {
			this._container = document.createElement('div');
			this._container.innerHTML = template({ nls: nlsConfiguratorKeys });

			this._container = this._container.querySelector('#config-editor-variant-list');
			this._extendedVariantList = this._container.querySelector('#config-editor-extended-variant-list');
			this._scrollContainer = this._container.querySelector('#config-editor-scroll-container');
			//this._container.style.height = "calc(100% - 63px)";
			// this._container.style.height = "100%";
		};

		VariantListPresenter.prototype.inject = function (parentcontainer) {
			if (parentcontainer) {
				parentcontainer.appendChild(this._container);
				parentcontainer.appendChild(this._scrollContainer);
			}
		};

		VariantListPresenter.prototype._render = function (parentcontainer) {
			var dico = this.configModel.getDictionary();
			var featureList = dico.features ? dico.features : [];
			this.configModel.setVariants(featureList.length);
			this.variantCompList = [];

			for (var i = 0; i < featureList.length; i++) {
				this.variantCompList.push(new variantComponentPresenter({
					variant: featureList[i],
					parentContainer: this._extendedVariantList,
					configModel: this.configModel,
					modelEvents: this.modelEvents,
					version: this.version,
					pcDataUtil: this.pcDataUtil
				}));
				this.mandIcon = document.getElementById('variantRightIcon_' + featureList[i].ruleId);
				//this.refinedIcon = document.getElementById('variantRefinedIcon_' + featureList[i].ruleId);
			}

			/** Filter list based on the topbar filter selection**/
			var currentFilter = this.configModel.getCurrentFilter();
			if (currentFilter === ConfiguratorVariables.Filter_AllVariants) {
				this.configModel.setVariants(featureList.length);
				this.modelEvents.publish({ event: "OnAllVariantFilterIconClick", data: { activated: 'true' } });
			}
		};

		VariantListPresenter.prototype._subscribeToEvents = function () {
			var that = this;

			this.modelEvents.subscribe({ event: 'updateAllFilters' }, function (data) {
				that.updateFilters(data);
			});

			this.modelEvents.subscribe({ event: 'updateVariantList' }, function (data) {
				that.updateVariantList();
			});

			this.modelEvents.subscribe({ event: 'applyVariantListFilters' }, function (data) {
				that.applyVariantListFilters(data);
			});

			this.modelEvents.subscribe({ event: 'OnSortResult' }, function (data) {
				that._sortAttribute = data.sortAttribute;
				that._sortOrder = data.sortOrder;
				that.variantCompList = that.variantCompList.sort(function (a, b) {
					var nameA, nameB;
					if (that._sortAttribute === "displayName") {
						nameA = a.variant.displayName.toUpperCase();
						nameB = b.variant.displayName.toUpperCase();
					}
					if (that._sortAttribute === "sequenceNumber") {
						nameA = parseInt(a.variant.sequenceNumber);
						nameB = parseInt(b.variant.sequenceNumber);
					}
					if (that._sortOrder === "DESC") {
						var temp = nameA;
						nameA = nameB;
						nameB = temp;
					}
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});
				that.variantCompList.forEach(function (p) {
					that._extendedVariantList.appendChild(p._container);
				});
			});


			this.modelEvents.subscribe({ event: 'solveAndDiagnoseAll_SolverAnswer' }, function (data) {
				if (data) {
					data.updateView = true;
					data.answerDefaults = that.configModel.getDefaultCriteria();
				}
				that.updateFilters(data);
				that.modelEvents.publish({ event: "pc-interaction-complete" });
				that.modelEvents.publish({ event: "pc-dd-interaction-complete" });
			});

			this.modelEvents.subscribe({ event: 'OnRuleAssistanceLevelChange' }, function (data) {
				if (data.value === ConfiguratorVariables.NoRuleApplied) {
					that.modelEvents.publish({ event: "pc-interaction-started" });
					setTimeout(function () {
						that.modelEvents.publish({ event: "solveAndDiagnoseAll_SolverAnswer", data: data });
					}, 100);
				}
			});


			this.modelEvents.subscribe({ event: 'OnConfigurationModeChange' }, function () {
				that.updateFilters();
			});

		};

		VariantListPresenter.prototype.computeMessage = function (data) {

			var listIncompatibilities = data.listOfIncompatibilitiesIds ? data.listOfIncompatibilitiesIds : [];
			var model = this.configModel;
			var state = model.getStateWithId(data.optionSelected);
			var optionName = model.getOptionDisplayNameWithId(data.optionSelected)
			var rc = data.answerRC;

			var message = '';

			if (listIncompatibilities.length == 0) {
				if (rc !== ConfiguratorVariables.str_ERROR) {
					message = UWA.i18n("Option") + " " + optionName + " " + UWA.i18n("is") + " " + UWA.i18n(state);
				}
			} else {
				var msgStr1 = UWA.i18n("Option #OPTION# is #STATUS# because") + " ";
				msgStr1 = msgStr1.replace("#OPTION#", optionName);
				msgStr1 = msgStr1.replace("#STATUS#", UWA.i18n(state));
				message = msgStr1;

				for (var i = 0; i < listIncompatibilities.length; i++) {

					if (i > 0)
						message += " " + UWA.i18n("and because") + " ";

					for (var j = 0; j < listIncompatibilities[i].length; j++) {

						state = model.getStateWithId(listIncompatibilities[i][j]);

						var msgStr2 = UWA.i18n("#OPTION# is #STATUS#");
						msgStr2 = msgStr2.replace("#OPTION#", model.getFeatureDisplayNameWithId(listIncompatibilities[i][j]) + "[" + model.getOptionDisplayNameWithId(listIncompatibilities[i][j]) + "]");
						msgStr2 = msgStr2.replace("#STATUS#", UWA.i18n(state));
						message += " " + msgStr2;
					}
				}
			}

			if (rc === ConfiguratorVariables.str_ERROR) {
				message += UWA.i18n("InfoComputationAborted");
			}

			return message;
		};

		VariantListPresenter.prototype.updateFilters = function (data) {
			var that = this;
			if (that.variantCompList && that.variantCompList.length > 0) {
				var mandVariants = 0, unselectedVariants = 0, rulesVariants = 0, chosenVariant = 0;
				var mandvariant, conflicts, includedState, selected, ruleSelected, mandIcon, refinedIcon;
				var rules = that.configModel.getRulesActivation() === ConfiguratorVariables.str_true;
				var countVariants = 0;

				//Added here for IR - New implementation
				that._allvariants = that.configModel.getVariants() || 0;
				that._conflicts = that.configModel.getNumberOfConflictingFeatures() || 0;
				that._rules = that.configModel.getNumberOfFeaturesByRules() || 0;
				that._unselectedVariants = that.configModel.getNumberOfFeaturesNotValuated() || 0;
				that._mandatory = that.configModel.getNumberOfMandFeaturesNotValuated() || 0;

				for (var i = 0; i < that.variantCompList.length; i++) {
					if ((data && data.updateView && that.configModel.getUpdateRequired(that.variantCompList[i].variantId)) || (data && data.refresh)) {
						that.variantCompList[i].updateView(data);
					}
					var variantRuleId = that.variantCompList[i].variantId;
					// var variantIncompatible = that.configModel.getStateWithId(variantRuleId)=== "Incompatible" ? true : false;
					var variantIncompatible = false;
					if (that.configModel.getStateWithId(variantRuleId) === "Incompatible") {
						if (!that.configModel.getUserSelectVariantIDs(variantRuleId))
							variantIncompatible = true;
					}

					var mandIcon = UWA.extendElement(document.getElementById('variantRightIcon_' + variantRuleId));
					//var refinedIcon = UWA.extendElement(document.getElementById('variantRefinedIcon_' + variantRuleId));

					that.configModel.getFeatureIdWithStatus(variantRuleId) ? unselectedVariants : variantIncompatible ? unselectedVariants : unselectedVariants++;
					if (rules) {
						that.configModel.getFeatureIdWithRulesStatus(variantRuleId) && !variantIncompatible ? rulesVariants++ : rulesVariants;
					}
					that.configModel.getFeatureIdWithChosenStatus(variantRuleId) ? chosenVariant++ : chosenVariant;

					var mandvariant = that.configModel.getFeatureIdWithMandStatus(variantRuleId);
					var includedState = that.configModel.getIncludedState(variantRuleId);
					mandvariant && !variantIncompatible ? mandVariants++ : mandVariants;

					if (mandIcon) {
						mandvariant ? mandIcon.addClassName("fonticon-attention") : mandIcon.removeClassName("fonticon-attention");
					}
					/*if(refinedIcon){
						var includedState = that.configModel.getIncludedState(variantRuleId);
						includedState ?  refinedIcon.show() : refinedIcon.hide();
					}*/
					if (that.variantCompList[i] && !variantIncompatible) countVariants++;
				}
			}
			var conflicts = rules ? that.configModel.getNumberOfConflictingFeatures() : 0;
			that.configModel.setVariants(countVariants);
			that.configModel.setNumberOfConflictingFeatures(conflicts);
			that.configModel.setNumberOfMandFeaturesNotValuated(mandVariants);
			that.configModel.setNumberOfFeaturesNotValuated(unselectedVariants);
			that.configModel.setNumberOfFeaturesByRules(rulesVariants);
			that.configModel.setNumberOfFeaturesChosen(chosenVariant);

			that.updateVariantList();
		};

		VariantListPresenter.prototype.updateVariantList = function () {
			this.modelEvents.publish({ event: "updateExclusions", data: { activated: 'true' } });

			var currentFilter = this.configModel.getCurrentFilter(), event;
			switch (currentFilter) {
				case ConfiguratorVariables.Filter_AllVariants:
					event = "OnAllVariantFilterIconClick";
					break;
				case ConfiguratorVariables.Filter_Conflicts:
					event = "OnConflictIconClick";
					break;
				case ConfiguratorVariables.Filter_Rules:
					event = "OnRuleNotValidatedIconClick";
					break;
				case ConfiguratorVariables.Filter_Mand:
					if (this._mandatory < this.configModel.getNumberOfMandFeaturesNotValuated())
						event = "onMandVariantIconClick";
					break;
				case ConfiguratorVariables.Filter_Unselected:
					event = "OnUnselectedVariantIconClick";
					break;
				case ConfiguratorVariables.Filter_Chosen:
					event = "onChosenVariantIconClick";
					break;
				default:
			}
			this.modelEvents.publish({ event: event, data: { activated: 'updateAddition' } });
		};

		VariantListPresenter.prototype.applyVariantListFilters = function (data) {
			this.modelEvents.publish({ event: "OnFilterResult", data: data });
		};

		return VariantListPresenter;
	});


define(
		'DS/ConfiguratorPanel/scripts/Presenters/ConfigEditorPresenter',
		[
			'DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctionsV2',
			'DS/ResizeSensor/js/ResizeSensor',
			'DS/UIKIT/Mask',
			'DS/UIKIT/Spinner',
			'DS/UIKIT/Scroller',
			'UWA/Core',
			'DS/Handlebars/Handlebars',
			'DS/CoreEvents/ModelEvents',
			'DS/UIKIT/Input/Button',
			'DS/UIKIT/Alert',
			'DS/UIKIT/SuperModal',
			'DS/ENOXTriptych/js/ENOXTriptych',
			'DS/DataGridView/DataGridView',
			'DS/TreeModel/TreeDocument',
			'DS/ConfiguratorPanel/scripts/Models/DictionaryDataUtil',
			'DS/ConfiguratorPanel/scripts/Models/PCDataUtil',
			'DS/ConfiguratorPanel/scripts/Presenters/VariantListPresenter',
      'DS/ConfiguratorPanel/scripts/Presenters/ConfigGridPresenter',
			'DS/ConfiguratorPanel/scripts/Presenters/TopbarPresenter',
			'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables',
			'i18n!DS/ConfiguratorPanel/assets/nls/ConfiguratorPanel.json',
			'i18n!DS/ConfiguratorPanel/assets/nls/ConfigGridPresenter.json',
			'i18n!DS/ENOXModelListView/assets/nls/ModelListView',
			'text!DS/ConfiguratorPanel/html/ConfigEditorPresenter.html',
			"css!DS/ConfiguratorPanel/css/ConfigEditorPresenter.css",
			'css!DS/UIKIT/UIKIT.css'
			],
			function (ConfiguratorSolverFunctions, ResizeSensor, Mask,Spinner, Scroller, UWA, Handlebars, ModelEvents, Button, Alert, SuperModal, ENOXTriptych, DataGridView, TreeDocument, DictionaryDataUtil, PCDataUtil, VariantListPresenter, ConfigGridPresenter, TopbarPresenter, ConfiguratorVariables, NLS_Configurator, NLS_GridView, NLS, html_ConfigEditorPresenter) {
			'use strict';

			var template = Handlebars.compile(html_ConfigEditorPresenter);

			var ConfigEditorPresenter = function (options) {
				this._init(options);
			};

			ConfigEditorPresenter.prototype._init = function(options){
				var that = this;
				var _options = options ? UWA.clone(options, false) : {};
				var defaults = {modelEvents : new ModelEvents(), add3DButton : "no"};	//Default values if not provided by options
				UWA.merge(_options, defaults);
				UWA.merge(this, _options);
				this.dictionary = this.configModel.getDictionary() || {features : []};
				this.modelEvents.unsubscribeAll({event : "onTopbarHeightChange"});
				this.modelEvents.unsubscribeAll({event : "pc-interaction-started"});
				this.modelEvents.unsubscribeAll({event : "pc-interaction-complete"});
				this.modelEvents.unsubscribeAll({event : "init_configurator"});
				this._currentView = 'classic';
				this._subscribeEvents();
				that._initDivs();
			};

			ConfigEditorPresenter.prototype._subscribeEvents = function () {
				var that = this;
				this.modelEvents.subscribe({event : "onTopbarHeightChange"}, function(modHeight){
					if(modHeight > 0){
						// modHeight = that.allowSave ? modHeight + that._savePCContainer.offsetHeight + 40 : modHeight;
						// that._variantListContainer.style.height = "calc(100% - "+ modHeight + "px)";
            // that._dataGridContainer.style.height = "calc(100% - "+ modHeight + "px)";

						that._viewContainer.style.height = "calc(100% - "+ modHeight + "px)";

					}
				});

				this.modelEvents.subscribe({event:"pc-interaction-started"}, function() {
					Mask.mask(that._container);
					that._maskContainer.style.opacity = 0.5;
				});
				this.modelEvents.subscribe({event:"pc-interaction-complete"}, function() {
					Mask.unmask(that._container);
					that._maskContainer.style.opacity = 1;
					that.modelEvents.publish({event : "pc-changed"});
				});

				this.modelEvents.subscribe({event:"pc-changed"}, function() {
					that.modelEvents.publish({event : 'pc-load-matching-pcs-action'});
				});

				this.modelEvents.subscribe({event: "pc-feature-selection-mode-updated"}, function() {
					that.modelEvents.publish({event : "pc-changed"});
				});


				this.modelEvents.subscribe({event:"pc-reset-first-selection"}, function() {
					that.configModel.setFirstSelectionDirty();
				});

				this.modelEvents.subscribe({event: 'init_configurator'}, function (data) {
					that.defaultData = data || [];
					that.defaultData.updateView = true;
					if(that.dictionary.features.length > 0) {
                        that._initConfigEditor();
                    }
					// if(that.version !== "V5"){
					if(!that.configModel.isAsyncRuleLoad()){
						that.modelEvents.publish({event:'pc-loaded', data : {}});
					}
				});
        //Switch View handler//
        this.modelEvents.subscribe({event : "onTopbarSwitchView"}, function(evtData) {
            if(evtData && evtData.view) {
                if(evtData.view === ConfiguratorVariables.TILE_VIEW) {
										that._currentView = ConfiguratorVariables.TILE_VIEW;
                    that._variantListContainer.removeClassName('config-editor-display-none');
                    that._variantListContainer.addClassName('config-editor-display-block');
                    that._dataGridContainer.addClassName('config-editor-display-none');
										that.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {
											refresh : true
										}});
										if(that._matchingPCActivated) {
											that.modelEvents.publish({event: 'triptych-show-panel', data : 'right'});
										}
                } else if(evtData.view === ConfiguratorVariables.GRID_VIEW) {
										that._currentView = ConfiguratorVariables.GRID_VIEW;
                    that._dataGridContainer.removeClassName('config-editor-display-none');
                    that._dataGridContainer.addClassName('config-editor-display-block');
										that._cfgGridPresenter.refresh(true);
                    that._variantListContainer.addClassName('config-editor-display-none');
										if(that._matchingPCActivated) {
											that.modelEvents.publish({event: 'triptych-hide-panel', data : 'right'});
										}
                }
            }
        });

				// events for matching PCs
				this.modelEvents.subscribe({event: 'show-maching-pc-action'}, function (activate) {
					if(activate) {
					 	that._matchingPCActivated = true;
						if(that._currentView === ConfiguratorVariables.GRID_VIEW) {
							that.modelEvents.publish({event: 'triptych-hide-panel', data : 'right'});
						} else {
							that.modelEvents.publish({event: 'triptych-show-panel', data : 'right'});
						}
					} else {
						that._matchingPCActivated = false;
						that.modelEvents.publish({event: 'triptych-hide-panel', data : 'right'});
					}
				});

				this.modelEvents.subscribe({event: 'triptych-resized'}, function (data) {
					that._resize();
					that.configuratorToolbar._resize();
				});

				this.modelEvents.subscribe({event: 'pc-matching-pcs-load-end'}, function () {
					that._loadMatchingPCList();
					that._matchingPClist.elements.statusBar.updateNodeModel('statusLoading', {
						grid: {
							data: NLS_GridView.loadingStatusLabel + ' : 100%',
							semantics: {
								icon: 'check'
							}
						}
					});
					// that._matchingPClist.elements.statusBar.updateNodeModel('statusLoading', { visibleFlag: that._matchingPCActivated});
				});
				this.modelEvents.subscribe({ event: 'pc-matching-pcs-count-update' }, function (count) {
					that._matchingPClist.elements.statusBar.updateNodeModel('totalColumns',{
						grid: {
							data: NLS_GridView.totalPCLabel + ' : ' + count,
						}
					});
				});

				this.modelEvents.subscribe({ event: 'pc-confirm-variant-singleSelect'}, function (options) {
					if(options && options.feature && UWA.is(options.callback,'function')) {
						if ( that.configModel.hasDismissedOptions(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm )
						|| that.configModel.hasMultiSelectVariantValues(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm ) ) {
							var superModal = new SuperModal({ className : 'confirm-variantSingleSelect-modal', renderTo: document.body});
							superModal.confirm( NLS_Configurator.Text_Confirm_EmptySelection, NLS_Configurator.Title_Confirm_SingleSelect, function (confirmed) {
								confirmed = !UWA.is(confirmed) ? false : confirmed;
								options.callback(confirmed);
							});
						}
						else {
							options.callback(true);
						}
					}
				});

				this.modelEvents.subscribe({ event: 'pc-confirm-variant-multiSelect'}, function (options) {
					if(options && options.feature && UWA.is(options.callback,'function')) {
						if ( that.configModel.hasDismissedOptions(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm)) {
							var superModal = new SuperModal({ className : 'confirm-variantMultiSelect-modal', renderTo: document.body});
							superModal.confirm( NLS_Configurator.Text_Confirm_EmptySelection, NLS_Configurator.Title_Confirm_MultiSelect, function (confirmed) {
								confirmed = !UWA.is(confirmed) ? false : confirmed;
								options.callback(confirmed);
							});
						}
						else {
							options.callback(true);
						}
					}
				});

				this.modelEvents.subscribe({ event: 'pc-confirm-variant-dismissSelect'}, function (options) {
					if(options && options.feature && UWA.is(options.callback,'function')) {
						if(that.configModel.hasChosenOptions(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm ) ) {
							var superModal = new SuperModal({ className : 'confirm-variantDismissSelect-modal', renderTo: document.body});
							superModal.confirm( NLS_Configurator.Text_Confirm_EmptySelection, NLS_Configurator.Title_Confirm_DismissSelect, function (confirmed) {
								confirmed = !UWA.is(confirmed) ? false : confirmed;
								options.callback(confirmed);
							});
						}else {
							options.callback(true);
						}
					}
				});


				this.modelEvents.subscribe({ event: 'pc-confirm-variant-includeSelect'}, function (options) {
					if(options && options.feature && UWA.is(options.callback,'function')) {
						if (that.configModel.hasDismissedOptions(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm ) ) {
							var superModal = new SuperModal({ className : 'confirm-variantIncludeSelect-modal', renderTo: document.body});
							superModal.dialog({
				        body: NLS_Configurator.Message_IncludeSelectionPrompt,
				        title: NLS_Configurator.Title_IncludeSelectionPrompt,
				        buttons: [{
									className: 'primary',
			            value: NLS_Configurator.Action_Include,
			            action: function (modal) {
			                modal.hide();
											options.callback(true);
			            }
								},
									{
				            value: NLS_Configurator.Action_ClearField,
				            action: function (modal) {
				                modal.hide();
												options.callback(false);
				            }
									},
									{
			            	value: NLS_Configurator.Action_Cancel,
				            action: function (modal) {
				                modal.hide();
				            }
									}
								]
							});
						}else {
							options.callback(true);
						}
					}
				});
				this.modelEvents.subscribe({ event: 'pc-confirm-variant-excludeSelect'}, function (options) {
					if(options && options.feature && UWA.is(options.callback,'function')) {
						if (that.configModel.hasChosenOptions(options.feature) && ( !UWA.is(options.needConfirm) || options.needConfirm ) ) {
							var superModal = new SuperModal({ className : 'confirm-variantExcludeSelect-modal', renderTo: document.body});
							superModal.dialog({
				        body: NLS_Configurator.Message_ExcludeSelectionPrompt,
				        title: NLS_Configurator.Title_ExcludeSelectionPrompt,
				        buttons: [{
									className: 'primary',
			            value: NLS_Configurator.Action_Exclude,
			            action: function (modal) {
			                modal.hide();
											options.callback(true);
			            }
								},
									{
				            value: NLS_Configurator.Action_ClearField,
				            action: function (modal) {
				                modal.hide();
												options.callback(false);
				            }
									},
									{
			            	value: NLS_Configurator.Action_Cancel,
				            action: function (modal) {
				                modal.hide();
				            }
									}
								]
							});
						}else {
							options.callback(true);
						}
					}
				});
				
				this.modelEvents.subscribe({ event: 'pc-switch-all-unselected-to-exclude'}, function () {
					that.configModel.switchAllUnselectedToExclude();
					that.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {refresh : true}});
				});

				this.modelEvents.subscribe({ event: 'pc-switch-all-unselected-to-include'}, function () {
					that.configModel.switchAllUnselectedToInclude();
					that.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {refresh : true}});
				});
			};

			ConfigEditorPresenter.prototype._initDivs = function () {
				var previous = document.querySelector('#config-editor-container');
				if(previous) previous.parentNode.removeChild(previous);
				this._container = document.createElement('div');
				this._container.innerHTML = template();

				this._container = this._container.querySelector('#config-editor-container');
				UWA.extendElement(this._container);
				this._maskContainer = this._container.children[0];
				this._topbarContainer = this._container.querySelector('#config-editor-topbar');

				var _mainContent = UWA.createElement('div', { 'class' : 'config-editor-main-view-content'});
				this._rightContent = UWA.createElement('div', { 'class' : 'config-editor-right-view-content'});
				this._variantListContainer = this._container.querySelector('#config-editor-variant-list-container');
        this._dataGridContainer =  this._container.querySelector('#config-editor-grid-view-container');
        UWA.extendElement(this._variantListContainer);
        this._variantListContainer.addClassName('config-editor-display-block');
        UWA.extendElement(this._dataGridContainer);
        this._dataGridContainer.addClassName('config-editor-display-none');
				_mainContent.addContent(this._variantListContainer);
				_mainContent.addContent(this._dataGridContainer);

				this._viewContainer = this._container.querySelector('#config-editor-view-content');
				var options = {
					left: {
						resizable: false,
						originalSize: 0,
						originalState: 'close',
						overMobile: false,
						withClose: false
					},
					right: {
						resizable: true,
						minWidth: 250,
						originalSize: 450,
						originalState: 'close', // 'open' for open, 'close' for close
						overMobile: true,
						withClose: false
					},
					borderLeft: true,
					container: this._viewContainer,
					withtransition: false,
					modelEvents: this.modelEvents
				};
				var _triptych = new ENOXTriptych();
				_triptych.init(options, null, _mainContent, this._rightContent);

				this._savePCContainer = this._container.querySelector('#config-editor-save-configuration');
				this._cancelPCContainer = this._container.querySelector('#config-editor-cancel-configuration');
				this._notificationContainer = this._container.querySelector('#config-editor-notification-container');
			};

			ConfigEditorPresenter.prototype.inject= function(parentcontainer) {
				var that = this;
				if(parentcontainer)parentcontainer.appendChild(this._container);
				if(this.dictionary.features.length > 0){
					this._variantList = this._variantListContainer.querySelector('#config-editor-variant-list');
					this._extendedVariantList = this._container.querySelector('#config-editor-extended-variant-list');
					this._scrollContainer = this._variantListContainer.querySelector('#config-editor-scroll-container');
					new Scroller({element: this._variantList}).inject(this._scrollContainer);
					this._resize();
					that.configuratorToolbar._resize();
					var rs = new ResizeSensor(this._container, function () {
						that._resize();
						that.configuratorToolbar._resize();
					});
					if(this.version === "V5" && this.configModel.getConfigurationCriteria().length > 0){
						//No need to update the view is configuration criteria is present - as update view would be triggered after solver responds
					}else{
						if(this.version === "V5"){
							that.defaultData.refresh = true;
						}
					that.modelEvents.publish({event:'updateAllFilters', data : that.defaultData});
					}
				}else{
					UWA.extendElement(this._container);
					this._container.setContent(NLS_Configurator.onEmptyConfigurations);
					this._container.addClassName("empty-configuration");
				}
			};

			ConfigEditorPresenter.prototype._resize = function(){
				var components = this.VLPresenter  ? this.VLPresenter.variantCompList : undefined;
				var width = this._extendedVariantList.offsetWidth;
				if(components && components.length > 0){
					for(var i=0;i < components.length; i++){
						components[i]._resize(width);
					}
				}
			}

			ConfigEditorPresenter.prototype._setMultiselection = function(options){
				//set multiselection in case of Unconstrained mode
				//R14: does not need to set Multi Selection Mode on Solver anymore
				if (this.configModel.getAppFunc().multiSelection === ConfiguratorVariables.str_yes || this.configModel.getAppFunc().selectionMode_Refine === ConfiguratorVariables.str_yes) {
					this.modelEvents.publish({event: 'OnMultiSelectionChange',data: {value: true, callsolve : false}});
					this.configModel.setMultiSelectionState("true");
				}
			};

			ConfigEditorPresenter.prototype._initConfigEditor = function(options){
				var that = this;
				var configuratorToolbar = new TopbarPresenter({
					parentContainer : this._topbarContainer,
					modelEvents : this.modelEvents,
					configModel : this.configModel,
					add3DButton: this.add3DButton,
          enableSwitchView : this.enableTableView,
					enableMatchingPC : this.enableTableView,
					version : this.version
				});
				this.configuratorToolbar = configuratorToolbar;

				var dictionary = this.configModel.getDictionary();
				this._dictionaryUtil = new DictionaryDataUtil({ dictionary : dictionary});
	      this._pcDataUtil = new PCDataUtil({ configModel : this.configModel, dictionaryUtil: this._dictionaryUtil, modelEvents: this.modelEvents, enableMatchingPC : this.enableTableView});

				this.VLPresenter = new VariantListPresenter({
					parentContainer : this._variantListContainer,
					configModel : this.configModel,
					modelEvents : this.modelEvents,
					maskContainer : this.maskContainer,
					version : this.version,
					pcDataUtil: this._pcDataUtil 
				});
        //GridPresenter init//
        if(this.enableTableView) {
						setTimeout(function () {
							Mask.mask(that._dataGridContainer);
							that._cfgGridPresenter = new ConfigGridPresenter();
							var pcId = that.configModel._pcId || 'configuration';
							that._cfgGridPresenter.init(that.modelEvents, undefined, {id: pcId, configModel: that.configModel, pCDataUtil:  that._pcDataUtil, dictionaryDataUtil : that._dictionaryUtil});
							// this._cfgGridPresenter.loadModelVariabilityInformation(UWA.clone(this.variabilityDictionary));
							that._cfgGridPresenter.loadConfigurationInfo({'id' : pcId });
							that._cfgGridPresenter.inject(that._dataGridContainer);
							Mask.unmask(that._dataGridContainer);
						}, 10);
        }

				if(this.allowSave === "yes"){
					this._saveBtn = new Button({ value: NLS_Configurator.save, className: 'primary' }).inject(this._savePCContainer);
					this._CancelBtn = new Button({ value: NLS_Configurator.cancel}).inject(this._cancelPCContainer);
					this._saveBtn.addEvent('onClick', function () {
						var configurations = that.configModel.getSelectedOptionsJSONModel(true);
						this.setFocus(false);
						that.modelEvents.publish({event: "onSaveClick", data : configurations});
					});
					this._CancelBtn.addEvent('onClick', function () {
						that.modelEvents.publish({event: "onResetClick"});
						this.setFocus(false);
					});
				}else{
					var persistencyContainer = this._container.querySelector('#config-editor-persistency-container');
					if(persistencyContainer){
						persistencyContainer.style.display = "none";
					}
				}

				this._matchingPClist = new DataGridView({
					treeDocument : new TreeDocument(),
					showSelectionCheckBoxesFlag : false,
					showContextualMenuColumnFlag: true,
					columns : [{
							text : NLS_GridView.titleLabel,
							dataIndex : 'tree'
						},
						{
			       text: NLS._action,
			       dataIndex: "ContextualMenuColumn"
				 		}
					]
				});
				this._matchingPClist.inject(this._rightContent);

				var statusBarInfos = [{
          type: 0,
          id: 'totalColumns',
          dataElements: {
            typeRepresentation: 'string',
            value: NLS_GridView.totalPCLabel + ' : ' + 0,
            displayLabel: true
          }
        },{
					type: 0,
					id: 'statusLoading',
					dataElements: {
						position: 'far',
						typeRepresentation: 'string',
						value: NLS_GridView.loadingStatusLabel + ' : 0%',
						displayLabel: true,
						icon: 'clock',
						visibleFlag : true
					}
				}];
				this._matchingPClist.buildStatusBar(statusBarInfos);
				this._matchingPClist.onContextualEvent = function(params) {
          var menu = [];
					if(params.cellInfos && params.cellInfos.rowID > -1) {
						if (params && params.collectionView) {
							var applySelectionsAction = {
								type: 'PushItem',
								title: NLS_GridView.applySelectionAction,
								icon : 'list-ok',
								action: {
									callback: function(e) {
										that._applySelections(e.context);
									},
									context: params.cellInfos
								}
							};
							var openAction = {
								type: 'PushItem',
								title: NLS_GridView.openPCAction,
								icon : 'open',
								action: {
									callback: function(e) {
										that._openPCAction(e.context);
									},
									context: params.cellInfos
								}
							};
							menu.push(applySelectionsAction);
							if(that.configModel.getPCId()){
								menu.push(openAction);
							}							
						}
					}
          return menu;
        };

			};

			ConfigEditorPresenter.prototype._loadMatchingPCList = function() {
				//load pc list
				var pcList = this._pcDataUtil.getMatchingPCs();
				this._matchingPClist.treeDocument.removeRoots();
				if(pcList.length > 0) {
					var pcNodes = pcList.map(function (pc) {
						return {
							label : pc.title + ' ' + pc.version,
							icons : [pc.image],
							grid : pc
						}
					});
					this._matchingPClist.treeDocument.loadModel(pcNodes);
				}
			};

			ConfigEditorPresenter.prototype._applySelections = async function (context) {
				// console.log('apply to selection action');
				var pcId = context.nodeModel.getAttributeValue('id');
				await this._pcDataUtil.applyPCSelections(pcId);
				// this.modelEvents.publish({event : 'pc-criteria-selection-change'});
				//this.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {refresh : true}});
				this.callSolver();
			};

			ConfigEditorPresenter.prototype.callSolver = function () {
				if(this.configModel && this.modelEvents) {
					if(this.configModel.getRulesActivation() === ConfiguratorVariables.str_true) {
						this.modelEvents.publish({event:'SolverFct_CallSolveMethodOnSolver', data : {}});
					} else {
						this.updateFilters();
						this.modelEvents.publish({event: 'solveAndDiagnoseAll_SolverAnswer'});
					}
				}
			};

			ConfigEditorPresenter.prototype._openPCAction = function (context) {
				var pcId = context.nodeModel.getAttributeValue('id');
				var pcName = context.nodeModel.getAttributeValue('title');
				var pcVersion = context.nodeModel.getAttributeValue('version');
				this.modelEvents.publish({event : 'pc-open-action', data: {id : pcId, name : pcName, version: pcVersion}});
			};

			ConfigEditorPresenter.prototype.resetProductConfiguration = function(content) {
				this.configModel.setAppRulesParam(content.appRulesParams);
				this.configModel.resetCriteria();
				this.configModel.setConfigurationCriteria(content.configurationCriteria);
				this.configModel.setSelectionMode(content.selectionMode);
				this.configuratorToolbar._findRuleAssistanceLevels();
				this.configuratorToolbar._updateSelectionMode();
				this.modelEvents.publish({event : "solveAndDiagnoseAll_SolverAnswer" , data : {refresh : true}});
				if(this._currentView == ConfiguratorVariables.GRID_VIEW) {
					this._cfgGridPresenter.refresh(true);
				}
			};

			ConfigEditorPresenter.prototype.subscribe = function(parameters, callback){
				return this.modelEvents.subscribe(parameters, callback);
			};

			ConfigEditorPresenter.prototype.unsubscribe = function(token){
				this.modelEvents.unsubscribe(token);
			};


			ConfigEditorPresenter.prototype.destroy = function() {
				if(this._cfgGridPresenter && UWA.is(this._cfgGridPresenter.destroy, 'function')) {
					this._cfgGridPresenter.destroy();
				}
			};


			return ConfigEditorPresenter;
		});


define(
	'DS/ConfiguratorPanel/scripts/Presenters/PCPanel',
	[
    	'DS/ConfiguratorPanel/scripts/ConfiguratorSolverFunctionsV2',
		'DS/ConfiguratorPanel/scripts/Models/ConfiguratorModel',
    	'DS/ConfiguratorPanel/scripts/Presenters/ConfigEditorPresenter',
		'DS/Handlebars/Handlebars',
		'DS/CoreEvents/ModelEvents',
		'DS/ConfiguratorPanel/scripts/Utilities',
		'DS/ConfiguratorPanel/scripts/ServiceUtil',
		'DS/Usage/TrackerAPI',
		'text!DS/ConfiguratorPanel/html/PCPanel.html',
		"css!DS/ConfiguratorPanel/css/PCPanel.css",
		'css!DS/UIKIT/UIKIT.css'
	],
	function (
    	ConfiguratorSolverFunctionsV2,
		ConfiguratorModel,
    	ConfigEditorPresenter,
		Handlebars,
		ModelEvents,
		Utilities,
		ServiceUtil,
		TrackerAPI,
		html_PCPanel) {
	'use strict';

	var template = Handlebars.compile(html_PCPanel);

	var PCPanel = function (configurations, dictionary, modelEvents, options) {
		this._init(configurations, dictionary, modelEvents, options);
	};

	PCPanel.prototype._init = function (configurations, dictionary, modelEvents, options) {
		var that = this;
		this._configurations = configurations || [];
		// this._dictionary = JSON.parse(sampleDico); //dictionary || undefined;
		// this._sampleDictionary = JSON.parse(sampleDico); //dictionary || undefined;
		this._dictionary = dictionary ? UWA.clone(dictionary, false) : undefined;
		// this._dictionary.portfolioClasses.member[0].portfolioComponents.member[0].parameters = this._sampleDictionary.portfolioClasses.member[0].portfolioComponents.member[0].parameters;

		var _options = options ? UWA.clone(options, false) : {};
		var defaults = {
			modelEvents: modelEvents || new ModelEvents(),
			add3DButton: "no",
			withTagger: false,
			version: "V4",
			realistic: true,
			rulesActivation : "true",
			ruleLevels: {
				"RulesMode_ProposeOptimizedConfiguration": false,
				"RulesMode_SelectCompleteConfiguration": false,
				"RulesMode_EnforceRequiredOptions": true,
        "RulesMode_DisableIncompatibleOptions" : true,
			},
			tabs: [],
			pCId: "",
			bcId: null,
			mvId: "",
			initalOptions: {
				initialRuleLevel: '', //'RulesMode_EnforceRequiredOptions'
				initialTab: "all",
				initialMode: "selectionMode_Build"
			},
			tenant: "",
			configCriteria : "{}",
			useDefaultSearch: true,
      'enableTableView' : false,
			enableValidation : false,
			useAsyncRuleLoad : false, // use setRules funtion on pcpanel
			enableExcludeSelection : true, // used to enable/disable refine mode
			enablePrimaryEdition : true
			// isWebInWin: false,
			// '3DSpaceUrl' : ''
		};
    	UWA.merge(_options, defaults);
		UWA.merge(this, _options);

		this._applicationId = options.appID || "";

		if(this.version === "V5") {
			this.manageDefaultVersion = "V2";
		} else {
			this.useAsyncRuleLoad = false;
		}
		if(this.manageDefaultVersion == "V2" && this._dictionary) {
				switch (this._dictionary._version) {
					case "1.0":
						this._dictionary._version = "1.1";
						break;
					case "2.0":
						this._dictionary._version = "2.1";
						break;
					case "3.0":
						this._dictionary._version = "3.1";
				}
		}

		this._configModel = this._getConfigModel();
		this.registerSearch();

		// Test if we are in a webinwin app "OnPremise"
		if (this.isWebInWin === true && options.tenant !== "OnPremise") {
			// On Cloud
			// Test window.dscef
			if (window.dscef !== undefined) {
				// Test if the window["COMPASS_CONFIG"] is initialize
				if (window["COMPASS_CONFIG"] === undefined || window['COMPASS_CONFIG'].myAppsBaseUrl === undefined) {
					// Get the base url
					window.dscef.getMyAppsURL().then(function (resolve) {
						// Init the window["COMPASS_CONFIG"] variable
						window["COMPASS_CONFIG"] = {
							myAppsBaseUrl : resolve,
							userId : "all"
						};
						that.modelEvents.subscribe({event: 'configurator-rule-mode-updated'}, function () {
							that._trackPCModeEvent();
						});
						that._initDivs();
						if(that._dictionary) {
								if(that.solverKey) {
									that._reuseSolver(that.solverKey);
								} else {
									if(that.useAsyncRuleLoad) {
										that._initSolverDictionary();
									} else {
										that._initSolver();
										}
								}
						} else {
							that._loadDictionary();
						}
          }, function(err) {
          	console.error(err);
          });
					return;
				}
			}
		}else {
			// OnPremise
			if (this['3DSpaceUrl']) {
				ConfiguratorSolverFunctionsV2.setServiceUrl(this['3DSpaceUrl']);
			}
		}
		try {
			ServiceUtil.init({
				tenant : options.tenant,
				securityContext : options.securityContext
			});
		} catch (ignore) { }
	
		this.modelEvents.subscribe({event: 'configurator-rule-mode-updated'}, function () {
			that._trackPCModeEvent();
		});

    	this._initDivs();
		if(this._dictionary) {
			if(this.solverKey) {
				this._reuseSolver(this.solverKey);
			} else {
				// TODO:
				if(this.useAsyncRuleLoad) {
					this._initSolverDictionary();
				} else {
					this._initSolver();
				}
			}
		} else {
			this._loadDictionary();
		}
	};

	PCPanel.prototype._initDivs = function () {
		var previous = document.querySelector('#PC-panel-container');
		if (previous)
			previous.parentNode.removeChild(previous);
		this._container = document.createElement('div');
		this._container.innerHTML = template();
		this._container = this._container.querySelector('#PC-panel-container');
	};

	PCPanel.prototype.trackEvent = function (solverNode) {
		// tracker API
		var _DICO_VALUES_SELECTOR = '$..values.member[?(@.idref)]';
		var _DICO_OPTIONS_SELECTOR = '$..options.member[?(@.idref)]';
		var _DICO_RULES_SELECTOR = '$..rules.member[?(@.id)]';
		try {

			var values = UWA.Json.path(this._dictionary, _DICO_VALUES_SELECTOR);
			values = UWA.is(values, 'array') ? values : [];

			var options = UWA.Json.path(this._dictionary, _DICO_OPTIONS_SELECTOR);
			options = UWA.is(options, 'array') ? options : [];

			var rules = UWA.Json.path(this._dictionary, _DICO_RULES_SELECTOR);
			if(this.useAsyncRuleLoad) {
				rules = UWA.Json.path(this.rules, _DICO_RULES_SELECTOR);
			}
			rules = UWA.is(rules, 'array') ? rules : [];

			TrackerAPI.trackPageEvent({
				eventCategory: 'Solver',
				eventAction: 'inilialization',
				eventLabel: 'Solver initialization',
				eventValue: 2.0,
				appID: 'ENXMODL_AP',
				tenant: this.tenant,
				persDim: {
					pd1: this.useAsyncRuleLoad ? 'Product Configuration definition': 'Configuration Filter definition',
					pd2: solverNode,
					pd3: this._applicationId
				},
				persVal: {
					pv1: values.length,
					pv2: options.length,
					pv3: rules.length
				},
				scope: 'Dashboard'
			});
		} catch (e) {
			console.log('Log: Issue in Usage Tracker');
		}
	};

	// tracker API event for PC Mode Change
	PCPanel.prototype._trackPCModeEvent = function () {
		var ruleLevel = this._configModel.getRulesMode();
		var ruleLevelNames = {
			'RulesMode_SelectCompleteConfiguration' : 'Complete',
			'RulesMode_EnforceRequiredOptions' : 'Aided',
			'RulesMode_DisableIncompatibleOptions' : 'Compatible',
			'No rule applied' : 'No Rule'
		};
		TrackerAPI.trackPageEvent({
			eventCategory: 'Solver',
			eventAction: 'PCRuleLevelUpdate',
			eventLabel: 'PC RuleLevel Update',
			eventValue: 2.0,
			appID: 'ENXMODL_AP',
			tenant: this.tenant,
			persDim: {
				pd1: ruleLevelNames[ruleLevel],
				pd2: ruleLevel,
			},
			scope: 'Dashboard'
		});
	};

	PCPanel.prototype.inject = function (parentcontainer) {
		this.parentcontainer = parentcontainer;
    if (parentcontainer)parentcontainer.appendChild(this._container);
    if(this.myConfigEditor) this.myConfigEditor.inject(this._container);
	};

	PCPanel.prototype.getParent = function () {
		return this.parentcontainer;
	};

	PCPanel.prototype._initSolverDictionary = function (options) {
		var that = this;
		var tempOptions = { version: this.version, dictionary: this._dictionary, tenant: this.tenant, parentContainer: this._container, displayErrorSolverNotification: this.displayErrorSolverNotification};
    	this.modelEvents.subscribe({event: 'solver_init_complete'}, function (dataReceived) {
			that.modelEvents.publish({event:'solveAndDiagnoseAll_SolverAnswer', data:	{refresh : true}});
			that.modelEvents.publish({event:'pc-loaded', data : {}});
    });
		this._configModel.setDictionary(this._dictionary);
		that._loadConfigEditor();
		that.modelEvents.publish({event: 'init_configurator', data : {}});
		if(this._configModel.getDictionary()){
			// Add attribut know model definition
			ConfiguratorSolverFunctionsV2.initSolver(this.mvId, this._configModel, this.modelEvents, this.configCriteria, "", tempOptions).then(function(data){
					that.solverKey = data.solverKey;
					if(that._rulesNotSetOnSolver){
						ConfiguratorSolverFunctionsV2.initSolverRules(that.rules);

						// track API
						that.trackEvent(that.solverKey);
					}
			});
		}
	};

	PCPanel.prototype._initSolver = function (options) {
    	var that = this;
		var tempOptions = { version: this.version, dictionary: this._dictionary, tenant: this.tenant, parentContainer: this._container};
    	this.modelEvents.subscribe({event: 'solver_init_complete'}, function (dataReceived) {
			if(!that.myConfigEditor){
				setTimeout(function(){
					if(that.myConfigEditor){
						clearTimeout() ;
						that.modelEvents.publish({event: 'init_configurator', data : dataReceived});
					}
				},100);
			}else{
				that.modelEvents.publish({event: 'init_configurator', data : dataReceived})
			}
    });

		ConfiguratorSolverFunctionsV2.initSolver(this.mvId, this._configModel, this.modelEvents, this.configCriteria, "", tempOptions).then(
			function (solverData) {
				that._loadConfigEditor();
				// ConfiguratorSolverFunctionsV2.CallSolveMethodOnSolver({firstCall : true})

				// track API
				that.trackEvent(ConfiguratorSolverFunctionsV2.solverKey);
		}).catch(function(){ /*  reject case  */ });
	};

	PCPanel.prototype._loadDictionary = async function () {
		var options = await ConfiguratorSolverFunctionsV2.loadAndInitSolverDictionary({
			modelVersionId : this.mvId,
 			tenant: this.tenant,
			securityContext : this.securityContext
		});
		this._dictionary = options.dictionary;
		this._reuseSolver(options.solverKey);
		this._doNotReleaseSolver = false;
	};
	PCPanel.prototype._reuseSolver = function (solverKey) {
		this.modelEvents.subscribe({event: 'solver_init_complete'}, (dataReceived) => {
			if(!this.myConfigEditor) {
				setTimeout(()=>{
					if(this.myConfigEditor){
						clearTimeout();
						this.modelEvents.publish({event: 'init_configurator', data : dataReceived});
					}
				},100);
			}else{
				this.modelEvents.publish({event: 'init_configurator', data : dataReceived})
			}
    });
		this._configModel.setDictionary(this._dictionary);
		this._loadConfigEditor();
		// this.modelEvents.publish({event: 'init_configurator', data : {}});
		ConfiguratorSolverFunctionsV2.initialize(this._configModel, this.modelEvents, this.version); //configModel, modelEvents, version
		if(this.bcId){
			this._doNotUseSolver = false;
			var isBCInConflict = this._checkConflictInBC();
			if(isBCInConflict){
				this._doNotUseSolver = true;
			}
		}
		ConfiguratorSolverFunctionsV2.setSolverKey(solverKey, this._doNotUseSolver);
		this._doNotReleaseSolver = true;
	};

  PCPanel.prototype._loadConfigEditor = function () {
    this.myConfigEditor = new ConfigEditorPresenter({
        // parentContainer: this._container,
        configModel: this._configModel,
        modelEvents: this.modelEvents,
        add3DButton: this.add3DButton || "no",
        allowSave: this.allowSave || 'no',
        variabilityDictionary: this._dictionary || {},
        'enableTableView' : this.enableTableView,
				version : this.version
      });
  };

  PCPanel.prototype.getXMLProductConfigurationDefinition = function(options){
    return this.myConfigEditor.configModel.getXMLExpression(options);
  };

	PCPanel.prototype.getConfigmodel = function(){
    return this.myConfigEditor.configModel;
  };

	PCPanel.prototype.resetProductConfiguration = function(content){
		this._content = UWA.merge(this,content);
		this._configurations = content.configurationCriteria;
		this.initalOptions.initialMode = content.selectionMode;
		this.initalOptions.initialRuleLevel = content.rulesMode;
		this.rulesActivation = content.rulesActivation;

		var tempConfigModel = this._getConfigModel();
		content.appRulesParams = tempConfigModel._appRulesParams;
    this.myConfigEditor.resetProductConfiguration(content);
  };

	PCPanel.prototype.setRules = function (data) {
		if(this.manageDefaultVersion == "V2") {
				switch (data._version) {
					case "1.0":
						data._version = "1.1";
						break;
					case "2.0":
						data._version = "2.1";
						break;
					case "3.0":
						data._version = "3.1";
				}
		}
		this.rules = data;
		this._configModel.setRules(data);
		if(this.solverKey && this.solverKey !== ""){
			ConfiguratorSolverFunctionsV2.initSolverRules(data);
			this._rulesNotSetOnSolver = false;

			// TrackerAPI
			this.trackEvent(this.solverKey);

		}else{
			this._rulesNotSetOnSolver = true;
		}
	};

	PCPanel.prototype._getConfigModel = function () {
		return new ConfiguratorModel({
				configuration: this._configurations,
				pcId: this.pCId,
				bcId: this.bcId,
				bcSelectedCriteria: this.bcSelectedCriteria,
				appRulesParams: {
					multiSelection: 'false',
					selectionMode: this.initalOptions.initialMode,
					rulesMode: this.initalOptions.initialRuleLevel,
					rulesActivation: this.rulesActivation,
					completenessStatus: this.initalOptions.completenessStatus || 'Unknown',
					rulesCompliancyStatus: this.initalOptions.rulesCompliancyStatus || 'Unknown'
				},
				appFunc: {
					multiSelection: "no" ,
					selectionMode_Build: "yes",
					selectionMode_Refine: this.enableExcludeSelection ? "yes" : "no",
					rulesMode_ProposeOptimizedConfiguration: this.ruleLevels["RulesMode_ProposeOptimizedConfiguration"] ? "yes" : "no",
					rulesMode_SelectCompleteConfiguration: this.ruleLevels["RulesMode_SelectCompleteConfiguration"] ? "yes" : "no",
					rulesMode_EnforceRequiredOptions: this.ruleLevels["RulesMode_EnforceRequiredOptions"] ? "yes" : "no",
					rulesMode_DisableIncompatibleOptions: this.ruleLevels["RulesMode_DisableIncompatibleOptions"] ? "yes" : "no",
				},
				enablePrimaryEdition : this.enablePrimaryEdition,
				modelEvents: this.modelEvents,
				readOnly: false,
				enableValidation : this.enableValidation,
				manageDefaultVersion :  this.manageDefaultVersion || 'V1',
				useAsyncRuleLoad : this.useAsyncRuleLoad
			});
	};

	PCPanel.prototype.registerSearch = function () {
		var that = this;
		if(that.useDefaultSearch){
			this.modelEvents.subscribe({event: 'OnSearchResult'}, function (data) {
					that.modelEvents.publish({event : "applyDefaultSearch", data : data});
			});
		}
	};

	PCPanel.prototype._checkConflictInBC = function(){
		var that  = this;
		var pcModel = this._configModel.getDictionary();
		for(var i=0; i<pcModel.features.length; i++){
			var element = pcModel.features[i];
			if(element.type ==='Variant' && element.selectionCriteria !="Optional"){
				var nbElementFound = 0;
				for(var j = 0; j<element.options.length; j++){
					var varValueId = element.options[j].ruleId;
					var isElementExist = that.bcSelectedCriteria.some(bcCriteria=>{
						return bcCriteria.Id === varValueId && bcCriteria.State === "Incompatible"
					});
					if(isElementExist){
						nbElementFound++;
					}
				}
				if(nbElementFound === element.options.length){
					return true;

				}
			}
		}
		return false;
	};

	PCPanel.prototype.destroy = function () {
		if(this.myConfigEditor && UWA.is(this.myConfigEditor.destroy, 'function')) {
			this.myConfigEditor.destroy();
		}
		Utilities.removeAllNotifications();
		if(!this._doNotReleaseSolver) {
			ConfiguratorSolverFunctionsV2.releaseSolver();
		}
		ConfiguratorSolverFunctionsV2.solverKey = "";
		delete this._configModel;
		this.modelEvents.unsubscribeAll();
		delete this.modelEvents;
	};

	return PCPanel;
});

