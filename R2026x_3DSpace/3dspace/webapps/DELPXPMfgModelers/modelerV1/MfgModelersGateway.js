define(["require", "exports", "./TransactionGateway", "DS/DELPXPSessionManager/DELPXPContextType"], function (require, exports, TransactionGateway_1, DELPXPContextType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MfgModelersGateway = void 0;
    /**
     * Declaration of the implementation of the interface
     */
    class MfgModelersGateway {
        constructor(iSession) {
            this._context = iSession;
        }
        ;
        /**
         * Creates the condition objects necessary to the load command
         * @param iDataModelToLoad
         * @param iMappingIdsToInstPath
         * @returns a condition object
         */
        createConditionObject(iDataModelToLoad, iMappingIdsToInstPath) {
            const that = this;
            //@ts-ignore
            if (this.window && this.window.localStorage.getItem("DELPXPDumpBuildUpGraph") === null) {
            }
            var condition = [];
            if (iDataModelToLoad.length > 0) {
                condition = [
                    ["instanceID",
                        {
                            type: 's',
                            data: that._context.getInstanceID()
                        }],
                    ["dataModel", {
                            type: 's',
                            data: iDataModelToLoad
                        }
                    ]
                ];
            }
            if (iMappingIdsToInstPath !== undefined && iMappingIdsToInstPath.length > 0) {
                condition.push(["mapping", {
                        type: '',
                        data: iMappingIdsToInstPath
                    }]);
            }
            return condition;
        }
        /**
         * Method creating the command object based on the data model to load and the facultative mapping
         * @param iDataModelToLoad
         * @param iMappingIdsToInstPath
         * @returns a request object
         */
        createCommandObject(iDataModelToLoad, iMappingIdsToInstPath) {
            const that = this;
            var condition = that.createConditionObject(iDataModelToLoad, iMappingIdsToInstPath);
            let commandObj = {
                "Command~1": {
                    "commandName": "ComponentBuildUp_InitInstance",
                    "KVParameters": condition
                }
            };
            return commandObj;
        }
        //for first impl, the input is the full json as a string
        /**
         * Method provided to the user, this method allows the user to push the data set and its mapping to the server
         * @param iDataModelToLoad , has to be compliant to the format for input data sets
         * @param iMappingIdsToInstPath ,has to be compliant to the mapping format
         * @returns an error status if in error, otherwise, returns nothing, only gives back control to the user
         */
        async load(iDataModelToLoad, iMappingIdsToInstPath) {
            const that = this;
            let commandObject = that.createCommandObject(iDataModelToLoad, iMappingIdsToInstPath);
            return new Promise((iFctResolved, iFctReject) => {
                //send R/R creation instance
                that._context.request(DELPXPContextType_1.RequestType.RequestType_Command, commandObject).then(msg => {
                    iFctResolved(); //return a "success msg" ?
                }).catch(err => {
                    iFctReject(err);
                });
            });
        }
        ;
        /**
    *
    * @returns ITransaction
    */
        createPXPTransaction() {
            return new TransactionGateway_1.TransactionGateway();
        }
        ;
        createConditionUpdate(iDataModelToLoad) {
            var condition = [];
            const that = this;
            var transactionGateway = iDataModelToLoad;
            var cudObj = { updated: transactionGateway.getUpdatedObj(), created: transactionGateway.getCreatedObjs(), deleted: transactionGateway.getDeletedObj() };
            condition = [
                ["instanceID",
                    {
                        type: 's',
                        data: that._context.getInstanceID()
                    }],
                ["cudObjects", {
                        type: 's',
                        data: JSON.stringify(cudObj)
                    }
                ]
            ];
            return condition;
        }
        createCommanUpdate(iDataModelToLoad) {
            const that = this;
            var condition = that.createConditionUpdate(iDataModelToLoad);
            let commandObj = {
                "Command~1": {
                    "commandName": "ComponentBuildUp_UpdateModel",
                    "KVParameters": condition
                }
            };
            return commandObj;
        }
        /**
         *
         * @param iTransaction , transaction containing all the CUD actions done during the transaction to send to client side
         * iTransaction is consumed by the method and is not usable afterwards
         * @returns
         */
        commitTransaction(iTransaction) {
            const that = this;
            let commandObject = that.createCommanUpdate(iTransaction);
            return new Promise((iFctResolved, iFctReject) => {
                //send R/R creation instance
                that._context.request(DELPXPContextType_1.RequestType.RequestType_Command, commandObject).then(msg => {
                    iFctResolved(); //return a "success msg" ?
                }).catch(err => {
                    iFctReject(err);
                });
            });
            //that._context.request(...);
            // oOnErrorCallback("API Not Implemented Yet");
            //set the iTransaction to null to avoid the user manipulating after the commit
        }
        ;
    }
    exports.MfgModelersGateway = MfgModelersGateway;
});
