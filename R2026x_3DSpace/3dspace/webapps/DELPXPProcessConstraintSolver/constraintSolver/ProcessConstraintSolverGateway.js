define(["require", "exports", "DS/DELPXPSessionManager/DELPXPContextType"], function (require, exports, DELPXPContextType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProcessConstraintSolverGateway = void 0;
    /**
     * function testing the type of the result received
     */
    function isTypeConstraintSolverResult(content) {
        return (content !== null && typeof content === 'object' && 'DELPXPProcessConstraintComponentResult~1' in content); //TODO FH6: Revoir avec foundations FD2
    }
    /**
     * function testing the type of the result received
     */
    function isTypeProcessConstraintSolverVersion(content) {
        return (content !== null && typeof content === 'object' && 'version' in content && typeof content.version === 'object');
    }
    /**
     * class implementing the interface IProcessConstraintSolver
     */
    class ProcessConstraintSolverGateway {
        /**
         * Constructor
         * @param iPXPContext , provided by the user
         */
        constructor(iPXPContext) {
            /**
             * build version of the processGraph.
             */
            this._processGraphVersion = "";
            this._context = iPXPContext;
        }
        ;
        getVersionProcessOperationsOrder() {
            return this._processGraphVersion;
        }
        /**
         * Method creating the object representing the json expected by the server side for the init parameters
         * @param iParam, object provied by user containing constraint solver params
         * @returns
         */
        initParamJsonCreation(iParam) {
            const initParams = {
                version: "1.0"
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
         * Method creating all the condition predicates to do a process graph solver resolution
         * @param iInitParams , process graph solver init params json according to format expected by process graph component server
         * @param iInstanceID ,  instance ID
         * @returns
         */
        conditionsCreation(iInitParams, iInstanceID) {
            var conditions;
            conditions = [
                this.createQueryCondition(iInitParams, "params"),
                this.createQueryCondition(iInstanceID, "instanceID"),
            ];
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
         * Method used to compute the result of the response from the serverside to a processOperationOrder.
         * @param resp, response message received from server side
         * @param iFctResolved, success response of the promise
         * @param iFctReject , failed response of the promise
         */
        responseTreatement(resp, iFctResolved, iFctReject) {
            //check content
            if (resp && resp.getContent() !== null) {
                let content = resp.getContent();
                //Verify that the response is in the expected format
                if (isTypeConstraintSolverResult(content)) {
                    var json = JSON.parse(content["DELPXPProcessConstraintComponentResult~1"]["result"]);
                    if (json.hasOwnProperty("results") && json.hasOwnProperty("version")) {
                        //assignt to DELPXPConstraintSolverResult
                        var buResult = json;
                        iFctResolved(buResult);
                    }
                    else
                        iFctReject(new Error("response of /Query/DELPXPProcessConstraintComponentResult does not have a results object or version")); // returns an error
                }
                else
                    iFctReject(new Error("response of /Query/DELPXPProcessConstraintComponentResult does not fit type DELPXPConstraintSolverResult")); // returns an error
            }
            else
                iFctReject(new Error("response of /Query/DELPXPProcessConstraintComponentResult content is empty")); // returns an error
        }
        //method to request to the server side the build version of the buildup
        async readVersionProcessConstraint() {
            const that = this;
            return new Promise((iFctResolved, iFctReject) => {
                var _a;
                //method request on the context, will create the event transport and send
                (_a = that._context.getEndpointClient()) === null || _a === void 0 ? void 0 : _a.request("/pxp/buildupcomponent/version").then(resp => {
                    let content = resp.getContent();
                    if (content !== null && isTypeProcessConstraintSolverVersion(content)) {
                        this._processGraphVersion = content.version.major.toString();
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
         * Main method, method opened to be used by the external users. Takes 1 facultative parameter. The result is a Promise<DELPXPConstraintSolverResult>
         * @param iBUParam , selection and init parameters
         * @returns
         */
        async queryProcessOperationsOrder(iBUParam) {
            const that = this;
            //create all the object corresponding to the jsons expected server side using the input objects
            var conditions = [];
            const instanceID = {
                instanceID: that._context.getInstanceID()
            };
            if (iBUParam !== undefined) {
                const initParams = this.initParamJsonCreation(iBUParam);
                conditions = this.conditionsCreation(initParams, instanceID);
            }
            //Create query Object
            var queryObject = this.createQueryObject("DELPXPProcessConstraintComponentResult", conditions);
            return new Promise((iFctResolved, iFctReject) => {
                //assignt to DELPXPConstraintSolverResult
                var json = { results: "", version: "1.0" };
                var buResult = json;
                //method request on the context, will create the event transport and send
                that._context.request(DELPXPContextType_1.RequestType.RequestType_Query, queryObject).then(resp => {
                    //if we are doing the 1st solve, we retrieve the component version  
                    if (that._processGraphVersion === "") {
                        this.readVersionProcessConstraint().then(() => {
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
    }
    exports.ProcessConstraintSolverGateway = ProcessConstraintSolverGateway;
});
