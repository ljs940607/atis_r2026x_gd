/// <amd-module name="DS/DELGraphEditor/services/TransactionManager"/>
define("DS/DELGraphEditor/services/TransactionManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TransactionManager {
        constructor(callback) {
            // private _viewUpdater: ViewUpdater = new ViewUpdater();
            this.listOfTransactions = [];
            this._transactionManagerCallback = callback;
        }
        ;
        start() {
            this.listOfTransactions = [];
        }
        register(newTransaction) {
            this.listOfTransactions.push(newTransaction);
        }
        end() {
            this._transactionManagerCallback.onGraphModelChange(this.listOfTransactions);
        }
        sendSingleAction(action) {
            this._transactionManagerCallback.onGraphModelChange([action]);
        }
    }
    exports.default = TransactionManager;
});
