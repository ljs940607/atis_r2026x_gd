define(["require", "exports", "DS/DELPXPFoundations/DELPXPFoundations", "DS/DELPXPComponentsUtils/DELPXPBackendConnect", "DS/PlatformAPI/PlatformAPI", "DS/Logger/Logger", "DS/DELPXPSessionManager/DELPXPContextType"], function (require, exports, DELPXPFoundations_1, DELPXPBackendConnect_1, PlatformAPI, Logger, DELPXPContextType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.connectProcessConstraintSolverAPI = connectProcessConstraintSolverAPI;
    var _logger = Logger.getLogger('PXP.BUILDUP');
    function isTypeBuildUpInstance(content) {
        //if (content !== null) return content.hasOwnProperty('DELPXPBuildUpComponentInstance~1');
        //if(content!==null && content.toString()!="") return true;
        //return false;
        return content !== null && typeof content === 'string' && content != '';
    }
    function createURI(iType, requestObject) {
        let action;
        let objectType = '';
        switch (iType) {
            case DELPXPContextType_1.RequestType.RequestType_Command:
                action = 'Command';
                if (requestObject['Command~1'] !== undefined)
                    objectType = requestObject['Command~1']['commandName'];
                break;
            case DELPXPContextType_1.RequestType.RequestType_Read:
                action = 'Read';
                break;
            case DELPXPContextType_1.RequestType.RequestType_Query:
                action = 'Query';
                if (requestObject['Query~1'] !== undefined)
                    objectType = requestObject['Query~1']['objectsType'];
                break;
            default:
                action = 'Default';
                break;
        }
        return '/' + action + '/' + objectType;
    }
    /**
     * Class implementation of the interface ISessionBuildUp
     *
     */
    class PXPContextGraphSolverImpl {
        /**
         * Constructor, instantiate a DELPXPBuildUpContext
         */
        constructor(identifier, info) {
            var _a, _b, _c;
            this.id = identifier;
            this._endpoint = null;
            this._buildupInstanceID = null;
            let currentUser;
            try {
                currentUser = PlatformAPI.getUser();
            }
            catch (reason) {
                currentUser = undefined;
            }
            this.user = (_b = (_a = info === null || info === void 0 ? void 0 : info.user) !== null && _a !== void 0 ? _a : currentUser === null || currentUser === void 0 ? void 0 : currentUser.login) !== null && _b !== void 0 ? _b : 'USR';
            let currentNode = (_c = info === null || info === void 0 ? void 0 : info.node) !== null && _c !== void 0 ? _c : 'PXPEndpointServerBuildUpComponentV0';
            this.endpointAddress = { endpoint: currentNode, identifier: this.user + '/BUILDUP/' + this.id };
        }
        connectToEndPoint(info) {
            let connect = {
                ...((info === null || info === void 0 ? void 0 : info.widget) && { widget: info.widget }),
                ...((info === null || info === void 0 ? void 0 : info.serverUrl) && { serverUrl: info.serverUrl }),
            };
            _logger.debug('BuildUp Server Connection...');
            return (0, DELPXPBackendConnect_1.ConnectToPXPBackend)(connect)
                .then((connectInfo) => {
                var _a, _b;
                this.serverUrl = (_a = connectInfo.hypervisorUrl) === null || _a === void 0 ? void 0 : _a.toString();
                let opts = {
                    serverUrl: connectInfo.hypervisorUrl,
                    clientName: (_b = info === null || info === void 0 ? void 0 : info.clientName) !== null && _b !== void 0 ? _b : 'BuildUpClient_' + this.id,
                };
                _logger.debug('  * Server: ' + opts.serverUrl);
                return (0, DELPXPFoundations_1.ConnectToBusEK)('BuildUpSession', opts);
            })
                .then((Bus) => {
                _logger.debug("  * Endpoint: '" + this.endpointAddress.endpoint + '|' + this.endpointAddress.identifier + "'");
                return Bus.ConnectToEndpoint(this.endpointAddress);
            })
                .then((endpointClient) => {
                this._endpoint = endpointClient;
                _logger.debug('  * Connection ok');
                return this._createBuildInstance();
            })
                .then(() => {
                _logger.info('BuildUp Server Connection...: READY');
                return this;
            })
                .catch((reason) => {
                _logger.error('BuildUp Server Connection...: FAILED (' + reason + ')');
                throw reason;
            });
        }
        _createBuildInstance() {
            if (this._endpoint == null)
                throw new Error('BuildUp is not initalized !');
            var conditions = [{}];
            var queryObject = {
                'Query~1': {
                    objectsType: 'DELPXPBuildUpComponentInstance',
                    conditions: conditions,
                },
            };
            return this.request(DELPXPContextType_1.RequestType.RequestType_Query, queryObject).then((resp) => {
                let content = resp.getContent();
                //_logger.info(content);
                if (isTypeBuildUpInstance(content)) {
                    this._buildupInstanceID = content; //['DELPXPBuildUpComponentInstance~1'].instanceID;
                    return;
                }
            });
        }
        /**
         * Method managing the creation of an event transport, of the URI and actually sending the request via the endpointClient
         *
         * @param iType
         * @param requestObject
         * @returns
         */
        request(iType, requestObject) {
            if (this._endpoint == null)
                throw new Error('BuildUp is not initalized !');
            let msgEvent = new DELPXPFoundations_1.Transport(DELPXPFoundations_1.EventType.bagobjects, requestObject);
            let uri = createURI(iType, requestObject);
            return this._endpoint.request(uri, msgEvent);
        }
        isConnected() {
            return this._endpoint != null && this._endpoint.isConnected();
        }
        getEndpointClient() {
            return this._endpoint;
        }
        getInstanceID() {
            return this._buildupInstanceID;
        }
    }
    //////////////////////////////////////////////////////////////////
    /////////// Exported methods for the factory /////////////////////
    //////////////////////////////////////////////////////////////////
    function connectProcessConstraintSolverAPI(iIdentifier, iConnectionInfo) {
        if (typeof iIdentifier !== 'string' || iIdentifier.length == 0)
            throw new Error("connectProcessConstraintSolver( 'YourIdentifier' ) - Argument 'Identifier' is mandatory");
        return new PXPContextGraphSolverImpl(iIdentifier, iConnectionInfo).connectToEndPoint(iConnectionInfo);
    }
});
