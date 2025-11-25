/// <amd-module name="DS/DELPXPFoundations/PXPWAFData"/>
define("DS/DELPXPFoundations/PXPWAFData", ["require", "exports", "DS/WAFData/WAFData"], function (require, exports, WAFDataOriginal) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WAFData = void 0;
    /**
     *  WAFData Implementation
     */
    exports.WAFData = {
        /**
         * Perform an HTTP (Ajax) request.
         * @param url A string containing the URL to which the request is sent.
         * @param options A set of key/value pairs that configure the request.
         * @returns Promise with Http Response.
         */
        request: async (url, options) => {
            return new Promise(function (resolve, reject) {
                let opts = options || {};
                opts.onComplete = (data, headers) => {
                    resolve({ data: data, headers: headers });
                };
                opts.onFailure = (error, data, headers) => {
                    error ? reject(error) : reject(data);
                };
                opts.onTimeout = (error) => {
                    reject(error);
                };
                opts.onPassportError = (error) => {
                    reject(error);
                };
                opts.async = true;
                WAFDataOriginal.request(url, opts);
            });
        },
        /**
         * Perform an HTTP (Ajax) request  using DS Passport authentication. It must be used for services of the 3DEXPERIENCE.
         * @param url A string containing the URL to which the request is sent.
         * @param options A set of key/value pairs that configure the request.
         * @returns Promise with Http Response.
         */
        authenticatedRequest(url, options) {
            return new Promise(function (resolve, reject) {
                let opts = options || {};
                opts.onComplete = (data, headers) => {
                    resolve({ data: data, headers: headers });
                };
                opts.onFailure = (error, data, headers) => {
                    error ? reject(error) : reject(data);
                };
                opts.onTimeout = (error) => {
                    reject(error);
                };
                opts.onPassportError = (error) => {
                    reject(error);
                };
                opts.async = true;
                WAFDataOriginal.authenticatedRequest(url, opts);
            });
        },
        /**
         * Perform an HTTP (Ajax) request proxied through 3DDashboard's .
         * @param url A string containing the URL to which the request is sent.
         * @param options A set of key/value pairs that configure the request.
         * @returns Promise with Http Response.
         */
        proxifiedRequest(url, options) {
            return new Promise(function (resolve, reject) {
                let opts = options || {};
                opts.onComplete = (data, headers) => {
                    resolve({ data: data, headers: headers });
                };
                opts.onFailure = (error, data, headers) => {
                    error ? reject(error) : reject(data);
                };
                opts.onTimeout = (error) => {
                    reject(error);
                };
                opts.onPassportError = (error) => {
                    reject(error);
                };
                opts.async = true;
                WAFDataOriginal.proxifiedRequest(url, opts);
            });
        },
        /**
         * Automatically choose the most appropriate WAFData API for the given options.
         *
         * Set options.authentication === 'passport' to request a 3DPassport-authenticated server. -> WAFData.authenticatedRequest().
         * Set options.proxy to request a server through a proxy -> WAFData.proxifiedRequest().
         *  - For a cross-domain call, the default proxy will be used by default.
         *  - Set options.proxy to 'none' to prevent proxification.
         * Else WAFData.request() will be used.
         * @param url A string containing the URL to which the request is sent.
         * @param options A set of key/value pairs that configure the request.
         * @returns Promise with Http Response.
        */
        handleRequest(url, options) {
            return new Promise(function (resolve, reject) {
                let opts = options || {};
                opts.onComplete = (data, headers) => {
                    resolve({ data: data, headers: headers });
                };
                opts.onFailure = (error, data, headers) => {
                    error ? reject(error) : reject(data);
                };
                opts.onTimeout = (error) => {
                    reject(error);
                };
                opts.onPassportError = (error) => {
                    reject(error);
                };
                opts.async = true;
                WAFDataOriginal.handleRequest(url, opts);
            });
        },
    };
});
