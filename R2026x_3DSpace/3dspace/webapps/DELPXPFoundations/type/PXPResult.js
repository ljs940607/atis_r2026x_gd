define(["require", "exports", "./PXPError"], function (require, exports, PXPError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CheckResult = exports.MakeResult = void 0;
    class MakeResult {
        static success(value) {
            return {
                ok: true,
                value: value
            };
        }
        static fail(err) {
            if (err instanceof PXPError_1.PXPError) // PXPError is compatible with 'ResultKO'
                return err;
            else if (err instanceof Error)
                return { ok: false, error: PXPError_1.PXPError.CreateFromError(err) };
            else
                return { ok: false, error: new PXPError_1.PXPError(err) };
        }
    }
    exports.MakeResult = MakeResult;
    MakeResult.OK = { ok: true };
    class CheckResult {
        static isSuccess(result) {
            return (result.ok);
        }
        static isFail(result) {
            return (!result.ok);
        }
        static get(result) {
            return (result.value);
        }
        static getError(result) {
            return (result.error);
        }
    }
    exports.CheckResult = CheckResult;
});
