define(["require", "exports", "DS/DELPXPSessionManager/DELPXPContextType"], function (require, exports, DELPXPContextType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProcessBuildUpGateway = void 0;
    /**
     * function testing the type of the result received
     */
    function isTypeBuildUpResult(content) {
        return (content !== null && typeof content === 'object' && 'DELPXPBuildUpComponentResult~1' in content); //TODO FH6: Revoir avec foundations FD2
    }
    /**
     * function testing the type of the result received
     */
    function isTypeBuildUpVersion(content) {
        return (content !== null && typeof content === 'object' && 'version' in content && typeof content.version === 'object');
    }
    /**
     * class implementing the interface IProcessBuildUp
     */
    class ProcessBuildUpGateway {
        /**
         * Constructor
         * @param iPXPContext , provided by the user
         */
        constructor(iPXPContext) {
            /**
             * build version of the buildup.
             */
            this._buildUpVersion = "";
            this._context = iPXPContext;
        }
        ;
        getVersionBuildUp() {
            return this._buildUpVersion;
        }
        /**
         * Method creating the object representing the json expected by the server side for the selection
         * @param iBUSelection , object provied by user containing the informations on the selection and selected operation(s)
         * @returns
         */
        selectJsonCreation(iBUSelection) {
            const selectionJson = {
                version: iBUSelection.getVersion(),
                initDiffOperatorAllVisible: iBUSelection.getInitDiffOpAllVisibile(),
                workplan: {
                    pid: iBUSelection.getWorkplanPID(),
                    name: iBUSelection.getName(),
                    scopedItem: iBUSelection.getScopedItemPID(),
                    activeOperations: iBUSelection.getSelectedOperations(),
                    SelectionMode: iBUSelection.getSelectionMode()
                }
            };
            return selectionJson;
        }
        /**
         * Method creating the object representing the json expected by the server side for the selection parameters
         * @param iBUParam , object provied by user containing buildup init and selection params
         * @returns
         */
        selectionParamJsonCreation(iBUParam) {
            const selectionParams = {
                version: "1.0",
                initAllVisible: iBUParam.getIsInitAllVisible(),
                selectionGate: "WIP", //iBUParam.getSelectionGate() === DELPXPBuildUpEnums.SelectionMode.SelectionMode_Start ? "Start" : "End"
                legacySelect: true,
                filterParallel: iBUParam.getFilterParallel(),
                deactivateTS: iBUParam.getdeactivateTS
            };
            return selectionParams;
        }
        /**
         * Method creating the object representing the json expected by the server side for the init parameters
         * @param iBUParam, object provied by user containing buildup init and selection params
         * @returns
         */
        initParamJsonCreation(iBUParam) {
            const initParams = {
                version: "1.0",
                positionSolver: iBUParam.getIsPositionSolverActivated(),
                differenceOperator: iBUParam.getIsDiffOperationActivated(),
                //resetresultafterselect: iBUParam.getIsResetResultAfterSelect(),
                refinstexpression: iBUParam.getIsRefInstExpression(),
                filterParallel: iBUParam.getFilterParallel(),
                deactivateTS: iBUParam.getdeactivateTS()
            };
            return initParams;
        }
        /**
         * Method Creating a queryCondition object, using an object and a condition predicate
         * @param iObject
         * @param iCondPredicate
         * @returns
         */
        createQueryCondition(iObject, iCondPredicate) {
            let queryCondition = {
                "@class": "QueryCondition",
                conditionPredicate: iCondPredicate,
                conditionObject: {
                    type: 'd',
                    object: {
                        type: 's',
                        data: JSON.stringify(iObject)
                    }
                }
            };
            return queryCondition;
        }
        /**
         * Method creating all the condition predicates to do a buildup selection
         * @param iSelectionJson , selection json according to format expected by buildup component server
         * @param iSelectionParams , selection parameters json according to format expected by buildup component server
         * @param iInitParams , buildup solver init params json according to format expected by buildup component server
         * @param iInstanceID , buildup instance ID
         * @param iSelectionPreviousJson , previous selection json according to format expected by buildup component server to perform differences with a known state
         * @returns
         */
        conditionsCreation(iSelectionJson, iSelectionParams, iInitParams, iInstanceID, iSelectionPreviousJson) {
            var conditions;
            if (iSelectionPreviousJson !== undefined) {
                conditions = [
                    this.createQueryCondition(iSelectionJson, "selectedOperations"),
                    this.createQueryCondition(iSelectionParams, "params"),
                    this.createQueryCondition(iInstanceID, "instanceID"),
                    this.createQueryCondition(iInitParams, "paramsInit"),
                    this.createQueryCondition(iSelectionPreviousJson, "selectedOperationsPrevious"),
                ];
            }
            else {
                conditions = [
                    this.createQueryCondition(iSelectionJson, "selectedOperations"),
                    this.createQueryCondition(iSelectionParams, "params"),
                    this.createQueryCondition(iInstanceID, "instanceID"),
                    this.createQueryCondition(iInitParams, "paramsInit")
                ];
            }
            return conditions;
        }
        /**
         * Method to create a queryObject using the object type and the conditions.
         * @param iObjectType, object type requested by the query
         * @param iConditions , needs to be in the condition predicate format
         * @returns
         */
        createQueryObject(iObjectType, iConditions) {
            var queryObject = {
                "Query~1": {
                    "objectsType": iObjectType,
                    "conditions": iConditions
                }
            };
            return queryObject;
        }
        /**
         * Method used to compute the result of the response from the serverside to a buildup query selection.
         * @param resp, response message received from server side
         * @param iFctResolved, success response of the promise
         * @param iFctReject , failed response of the promise
         */
        responseTreatement(resp, iFctResolved, iFctReject) {
            //check content
            if (resp && resp.getContent() !== null) {
                let content = resp.getContent();
                //Verify that the response is in the expected format
                if (isTypeBuildUpResult(content)) {
                    var json = JSON.parse(content["DELPXPBuildUpComponentResult~1"]["result"]);
                    if (json.hasOwnProperty("workplan") && json.hasOwnProperty("version")) {
                        //assignt to DELPXPBuildUpResult
                        var buResult = json;
                        iFctResolved(buResult);
                    }
                    else
                        iFctReject(new Error("response of /Query/DELPXPBuildUpComponentResult does not have a workplan object or version")); // returns an error
                }
                else
                    iFctReject(new Error("response of /Query/DELPXPBuildUpComponentResult does not fit type DELPXPBuildUpResult")); // returns an error
            }
            else
                iFctReject(new Error("response of /Query/DELPXPBuildUpComponentResult content is empty")); // returns an error
        }
        //method to request to the server side the build version of the buildup
        async readVersionBuildUp() {
            const that = this;
            return new Promise((iFctResolved, iFctReject) => {
                var _a;
                //method request on the context, will create the event transport and send
                (_a = that._context.getEndpointClient()) === null || _a === void 0 ? void 0 : _a.request("/pxp/buildupcomponent/version").then(resp => {
                    let content = resp.getContent();
                    if (content !== null && isTypeBuildUpVersion(content)) {
                        this._buildUpVersion = content.version.major.toString();
                        iFctResolved();
                    }
                    else
                        iFctReject(new Error("response of /pxp/buildupcomponent/version content is empty")); // returns an error
                }).catch(err => {
                    iFctReject(err); // returns an error
                });
            });
        }
        /**
         * Main method, method opened to be used by the external users. Takes 3 parameters as input, 1 is facultative. The result is a Promise<DELPXPBuildUpResult>
         * @param iBUSelection , represents the current selection,
         * @param iBUParam , selection and init parameters
         * @param iBUSelectionPrevious , facultative, previous selection if we want to do a difference with a known state and not a default state
         * @returns
         */
        async queryBuildUpSelection(iBUSelection, iBUParam, iBUSelectionPrevious) {
            const that = this;
            //create all the object corresponding to the jsons expected server side using the input objects
            const selectionJson = this.selectJsonCreation(iBUSelection);
            const selectionParams = this.selectionParamJsonCreation(iBUParam);
            const initParams = this.initParamJsonCreation(iBUParam);
            const instanceID = {
                instanceID: that._context.getInstanceID()
            };
            var conditions = [];
            //Determine if we are in the case of a difference with previous selection
            if (iBUSelectionPrevious !== undefined) {
                let selectionPreviousJson = {};
                selectionPreviousJson = this.selectJsonCreation(iBUSelectionPrevious);
                conditions = this.conditionsCreation(selectionJson, selectionParams, initParams, instanceID, selectionPreviousJson);
            }
            else {
                conditions = this.conditionsCreation(selectionJson, selectionParams, initParams, instanceID);
            }
            //Create query Object
            var queryObject = this.createQueryObject("DELPXPBuildUpComponentResult", conditions);
            return new Promise((iFctResolved, iFctReject) => {
                //method request on the context, will create the event transport and send
                that._context.request(DELPXPContextType_1.RequestType.RequestType_Query, queryObject).then(resp => {
                    //if we are doing the 1st selection, we retrieve the component version  
                    if (that._buildUpVersion === "") {
                        this.readVersionBuildUp().then(() => {
                            //request was successfull, we manage the result
                            this.responseTreatement(resp, iFctResolved, iFctReject);
                        }).catch((err) => {
                            iFctReject(err); // returns an error
                        });
                    }
                    else {
                        //request was successfull, we manage the result
                        this.responseTreatement(resp, iFctResolved, iFctReject);
                    }
                }).catch(err => {
                    iFctReject(err); // returns an error
                });
            });
        }
        ;
        subscribeToBuildUpResultChange(callBackOnResultChange) {
            var _a;
            (_a = this._context.getEndpointClient()) === null || _a === void 0 ? void 0 : _a.subscribeTopics("StateSubscription").then(() => {
                var _a;
                (_a = this._context.getEndpointClient()) === null || _a === void 0 ? void 0 : _a.attachOnMessage((msg) => {
                    callBackOnResultChange(msg.getContent(), msg);
                }, // onMessageCallback
                (msg) => msg.getTopic() === "StateSubscription", // onFilter
                '@' + "StateSubscription" // key
                );
            });
        }
        unsubscribeToBuildUpResultChange() {
            var _a, _b;
            (_a = this._context.getEndpointClient()) === null || _a === void 0 ? void 0 : _a.detachOnMessage('@' + "StateSubscription");
            (_b = this._context.getEndpointClient()) === null || _b === void 0 ? void 0 : _b.unsubscribeTopics("StateSubscription");
        }
    }
    exports.ProcessBuildUpGateway = ProcessBuildUpGateway;
});
