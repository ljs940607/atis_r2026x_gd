/// <amd-module name="DS/DELPXPFoundations/PXPUtils"/>
define("DS/DELPXPFoundations/PXPUtils", ["require", "exports", "UWA/Utils"], function (require, exports, UWAUtils) {
    "use strict";
    const cstDate = Object.freeze({
        y: 31557600000,
        mo: 2629800000,
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000,
        ms: 1,
    });
    function s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return class Utils {
        /**
         * Checks if 'content' is classified as a string primitive or object.
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if content is a string, else 'false'.
         */
        static isString(content) {
            return content !== undefined && content !== null && (typeof content === 'string' || content instanceof String);
        }
        /**
         *  Converts `value` to a string. An empty string is returned for `null`.
         *
         *  @param {unknown} content - value to convert.
         *  @returns {string} Returns the converted string.
         */
        static convertToString(content) {
            if (content === null || content === undefined)
                return '';
            if (Utils.isString(content))
                return content;
            if (Utils.isObject(content))
                return JSON.stringify(content);
            return '' + content;
        }
        //toString: function (content) {
        //  console.log('DEPRECATED -- Uses convertToString( content)');
        //  return this.convertToString(content);
        //},
        /**
         * Checks if `value` is an empty object (string, object, array).
         *
         *  @param {unknown} value - the value to check.
         *  @returns {boolean} returns true, if 'value' is empty.
         */
        static isEmpty(value) {
            if (value === undefined || value === null)
                return true;
            switch (typeof value) {
                case 'function':
                case 'number':
                case 'boolean':
                    return false;
                case 'object': {
                    if (value instanceof Number)
                        return false;
                    if (value instanceof Boolean)
                        return false;
                    if (value instanceof String) {
                        return value.length === 0;
                    }
                    if (Object.prototype.toString.call(value) === '[object Date]')
                        return false;
                    // empty object
                    return Object.keys(value).length === 0;
                }
                case 'string':
                    return value.length === 0;
                default:
                    break;
            } //endswitch
            if (Array.isArray(value) && value.length === 0)
                return true;
            return false;
        }
        /**
         * Checks if 'content' is classified as a object.
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if content is a object, else 'false'.
         */
        static isObject(content) {
            return content !== undefined && content !== null && typeof content === 'object';
        }
        /**
         * Checks if 'content' is classified as a plain object (constructed by the Object constructor).
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if content is a plain object, else 'false'.
         */
        static isPlainObject(content) {
            // Basic check for Type object that's not null
            if (Utils.isObject(content)) {
                // If Object.getPrototypeOf supported, use it
                if (typeof Object.getPrototypeOf === 'function') {
                    var proto = Object.getPrototypeOf(content);
                    return proto === Object.prototype || proto === null;
                }
                // Otherwise, use internal class
                // This should be reliable as if getPrototypeOf not supported, is pre-ES5
                return Object.prototype.toString.call(content) === '[object Object]';
            }
            // Not an object
            return false;
        }
        /**
         * Checks if 'content' is classified as a boolean.
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if content is a boolean, else 'false'.
         */
        static isBool(content) {
            return content === true || content === false || content instanceof Boolean;
        }
        /**
         * Checks if 'content' is nill.
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if `content` is null or undefined.
         */
        static isNill(content) {
            return content === undefined || content === null;
        }
        /**
         * Checks if 'content' is valid.
         * @param {any} content - the value to check.
         * @returns {boolean} - Returns 'true' if `content` is defined.
         */
        static isValid(value) {
            return value !== undefined && value !== null;
        }
        /**
         * Checks if 'content' is null.
         * @param {any} content - the value to check.
         * @returns {boolean} - Returns 'true' if `content` is null.
         */
        static isNull(content) {
            return content === null;
        }
        /**
         * Checks if 'content' is undefined.
         * @param {unknown} content - the value to check.
         * @returns {boolean} - Returns 'true' if `content` is undefined.
         */
        static isUndefined(content) {
            return content === undefined;
        }
        /**
         * Checks if 'content' is defined.
         * @param {any} content - the value to check.
         * @returns {boolean} - Returns 'true' if `content` is defined.
         * @obsolete Uses isValid( value )
         */
        static isDefined(value) {
            return value !== undefined;
        }
        /**
         * Checks if 'value' is a number.
         * @param {any} value - the value to check.
         * @returns {boolean} - Returns 'true' if `value` is a number.
         */
        static isInt64(value) {
            if (this.isObject(value))
                value = value.valueOf();
            return Number.isInteger(value);
        }
        /**
         * Checks if 'value' is a positive number.
         * @param {unknown} value - the value to check.
         * @returns {boolean} - Returns 'true' if `value` is a positive number.
         */
        static isUint64(value) {
            if (this.isInt64(value)) {
                return value >= 0;
            }
            return false;
        }
        /**
         * Checks if 'value' is a number.
         * @param {unknown} value - the value to check.
         * @returns {bool} - Returns 'true' if `value` is a number.
         */
        static isNumber(value) {
            if (this.isObject(value))
                value = value.valueOf();
            return typeof value === 'number';
        }
        /**
         * Checks if 'value' is a number.
         * @param {unknown} value - the value to check.
         * @returns {bool} - Returns 'true' if `value` is a number.
         */
        static isDouble(value) {
            return this.isNumber(value);
        }
        /**
         * Pad a number.
         * @param {number} - number to  display
         * @returns {string} - returns a string in the format '01'
         */
        static pad2(num) {
            if (num < 0) {
                return '-' + this.pad2(Math.abs(num));
            }
            if (num < 10)
                return ('0' + num).slice(-2);
            return '' + num;
        }
        /**
         * Pad a number.
         * @param {number} - number to  display
         * @returns {string} - returns a string in the format '001'
         */
        static pad3(num) {
            if (num < 0) {
                return '-' + Utils.pad3(Math.abs(num));
            }
            if (num < 100)
                return ('00' + num).slice(-3);
            return '' + num;
        }
        /**
         * Pad a number.
         * @param {number } - number to  display
         * @returns {String} - returns a string in the format '0001'
         */
        static pad4(num) {
            if (num < 0) {
                return '-' + Utils.pad4(Math.abs(num));
            }
            if (num < 1000)
                return ('000' + num).slice(-4);
            return '' + num;
        }
        /**
         * Pad a number.
         * @param {number} - number to  display
         * @returns {string} - returns a string in the format '00001'
         */
        static pad5(num) {
            if (num < 0) {
                return '-' + Utils.pad5(Math.abs(num));
            }
            if (num < 10000)
                return ('0000' + num).slice(-5);
            return '' + num;
        }
        /**
         * Convert a duration to a string.
         * @param {number} - duration to display
         * @returns {String} - returns a string in the format 'HH:MM::SS.MS'
         */
        static string2duration(duration) {
            let current = duration;
            // Hours
            let hours = Math.floor(current / cstDate.h);
            current -= hours * cstDate.h;
            // Minutes
            let minutes = Math.floor(current / cstDate.m);
            current -= minutes * cstDate.m;
            // Seconds
            let seconds = Math.floor(current / cstDate.s);
            current -= seconds * cstDate.s;
            let ms = current;
            let s = '';
            s += Utils.pad2(hours) + ':';
            s += Utils.pad2(minutes) + ':';
            s += Utils.pad2(seconds);
            s += Math.floor(ms / 1000)
                .toFixed(4)
                .slice(1);
            return s;
        }
        static strMapToObj(strMap) {
            let obj = Object.create(null);
            for (let [k, v] of strMap) {
                // We dont escape the key '__proto__' which can cause problems on older engines
                obj[k] = v;
            }
            return obj;
        }
        static generateGUID() {
            return (s4() + s4() + '-' + s4() + s4()).toLowerCase();
        }
        /**
         * Function to get a parameter in the url
         * @param {string} parameter - Parameter to search in the URL
         * @param {string} defaultvalue - Default value if this parameter is not found
         * @param {string} urlContainer - Url to analyze (by default, it's 'globalThis.location.href')
         * @return {string} returns url param
         * @example
         * The URL of the webpage is dsrtv://webapps/DELPXPBIPanel/index.html?endPoint=ENDPOINT&hostName=localhost&port=2097
         * PXPUtils.getUrlParam('hostName', '127.0.0.1') return localhost
         * PXPUtils.getUrlParam('notExist', 'ok') return the fault value 'ok'
         */
        static getUrlParam(parameter, defaultvalue, urlContainer = globalThis.location.href) {
            try {
                const urlParams = new URL(urlContainer).searchParams;
                if (urlParams != null) {
                    const urlParameter = urlParams.get(parameter);
                    if (urlParameter != null)
                        return urlParameter;
                }
            }
            catch (error) {
                // ignore it...
            }
            return defaultvalue;
        }
        /**
         * Function to check parameter is present in the url
         * @param {string} parameter - Parameter to search in the URL
         * @param {string} urlContainer - Url to analyze (by default, it's 'globalThis.location.href')
         * @return {boolean} returns true, if parameter exist
         * @example
         * The URL of the webpage is dsrtv://webapps/DELPXPBIPanel/index.html?endPoint=ENDPOINT&hostName=localhost&port=2097
         * PXPUtils.hasUrlParam('hostName') return true
         * PXPUtils.hasUrlParam('notExist') return false
         */
        static hasUrlParam(parameter, urlContainer = globalThis.location.href) {
            try {
                const urlParams = new URL(urlContainer).searchParams;
                if (urlParams != null) {
                    return urlParams.has(parameter);
                }
            }
            catch (error) {
                // ignore it...
            }
            return false;
        }
        /**
         * Returns a UUID v4 (Random)
         *    uses UWA/Utils/getUUID()
         * @returns {string} - Returns a uuid.
         */
        static UUIDv4() {
            return UWAUtils.getUUID();
        }
        /**
         * Checks to see if the protocol is HTTPS / SSL
         */
        static isHttps() {
            return document.location.protocol == 'https:';
        }
        /**
         * Sleep the program. Uses 'await sleep(2000)` to stop during 2s [Promise version]
         *
         * @param {*} ms time to sleep in milliseconds.
         * @returns a Promise on Timeout...
         */
        static async sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        /**
         * Sleep the program. Uses 'pause(2000)` to stop during 2s
         *
         * @param {*} ms time to pause in milliseconds.
         */
        static async pause(ms) {
            await this.sleep(ms);
        }
        /**
         * wait until condition is true
         * @param conditionAccept condition to check -callback returns true when condition is ok.
         * @param checkInterval in ms, interval uses to check condition
         * @returns promsise when ok
         */
        static async waitUntil(conditionAccept, checkInterval = 100) {
            return new Promise((resolve) => {
                let interval = setInterval(() => {
                    if (!conditionAccept())
                        return;
                    clearInterval(interval);
                    resolve();
                }, checkInterval);
            });
        }
        /**
         * setTimeOut as Promise.   setTimeoutAsPromise(callback, 500).then( () => { })
         * @param callback to execute
         * @param ms number of milliseconds
         * @returns a Promise<T>
         */
        static async setTimeoutPromise(callback, ms) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(callback());
                }, ms);
            });
        }
        /**
         * implements a 'every' methods on container Set<T>
         * tests whether all elements in the array pass the test implemented by the provided function.
         * @param set container set<T>
         * @param predicate  A function to execute for each element in the array. It should return a truthy value to indicate the element passes the test, and a falsy value otherwise
         * @returns returns true, if for each items predicate returns true.
         */
        static Every4Set(set, predicate) {
            for (const it of set) {
                if (!predicate(it))
                    return false;
            }
            return true;
        }
        /**
         * load a javascript file IIFE by injection of script balise in DOM
         */
        static loadModuleJS_IIFE(filename, async = true) {
            return new Promise(function (resolve, reject) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = async;
                script.src = filename;
                script.onload = () => {
                    resolve();
                };
                script.onerror = (oError) => {
                    reject(new URIError('failed to load script:' + oError.toString()));
                };
                document.head.appendChild(script);
            });
        }
        static loadCSS(filename, async = true) {
            return new Promise(function (resolve, reject) {
                const script = document.createElement('link');
                script.type = 'text/css';
                script.rel = 'stylesheet';
                script.href = filename;
                script.onload = () => {
                    resolve();
                };
                script.onerror = (oError) => {
                    reject(new URIError('failed to load css:' + oError.toString()));
                };
                document.head.appendChild(script);
            });
        }
        static loadModuleJS_AMD(componentName) {
            return new Promise(function (resolve, reject) {
                //@ts-ignore
                require([componentName], function (module) {
                    resolve(module);
                }, function (err) {
                    let msg = 'failed to load AMD library "' +
                        componentName +
                        '" (type:' +
                        err.requireType +
                        '- modules:"' +
                        err.requireModules +
                        '"- reason: ' +
                        err.toString() +
                        ')';
                    reject(new Error(msg));
                });
            });
        }
    };
});
