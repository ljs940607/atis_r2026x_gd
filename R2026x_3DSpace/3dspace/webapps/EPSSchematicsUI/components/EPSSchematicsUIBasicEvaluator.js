/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIBasicEvaluator'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIBasicEvaluator", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIBasicEvaluator"], function (require, exports, UIDom, UITools) {
    "use strict";
    /**
     * This namespace defines a UI basic evaluator.
     * @private
     * @namespace UIBasicEvaluator
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIBasicEvaluator
     */
    var UIBasicEvaluator;
    (function (UIBasicEvaluator) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the inline value element from the given value.
         * @public
         * @param {*} value - The value.
         * @param {boolean} [hideValue=false] - True to hide the array/object value (only display Array(dimension) or object type) else false.
         * @param {boolean} [reduce=false] - True to reduce the object value else false.
         * @returns {HTMLSpanElement|undefined} The inline value element.
         */
        function getInlineValueElement(value, hideValue = false, reduce = false) {
            let element = undefined;
            if (value === null || value === undefined) {
                element = _getInlineNullOrUndefinedValueElement(value);
            }
            else if (typeof value === 'string') {
                element = _getInlineStringValueElement(value);
            }
            else if (typeof value === 'boolean') {
                element = UIBasicEvaluator.getInlineBooleanValueElement(value);
            }
            else if (typeof value === 'number') {
                element = UIBasicEvaluator.getInlineNumberValueElement(value);
            }
            else if (typeof value === 'bigint') {
                element = UIBasicEvaluator.getInlineBigIntValueElement(value);
            }
            else if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    element = _getInlineArrayValueElement(value, hideValue);
                }
                else if (value instanceof ArrayBuffer) {
                    element = UIDom.createElement('span', {
                        className: 'sch-inline-buffer-value',
                        textContent: UITools.buildJSONString(value)
                    });
                }
                else if (!reduce) {
                    element = _getInlineObjectValueElement(value, hideValue);
                }
                else {
                    element = UIDom.createElement('span', {
                        className: 'sch-inline-object-property-value',
                        textContent: '{…}'
                    });
                }
            }
            return element;
        }
        UIBasicEvaluator.getInlineValueElement = getInlineValueElement;
        /**
         * Gets the inline boolean value element.
         * @public
         * @param {boolean} value - The boolean value to inline.
         * @returns {HTMLSpanElement} The inline boolean value element.
         */
        function getInlineBooleanValueElement(value) {
            return UIDom.createElement('span', { className: 'sch-inline-boolean-value', textContent: String(value) });
        }
        UIBasicEvaluator.getInlineBooleanValueElement = getInlineBooleanValueElement;
        /**
         * Gets the inline number value element.
         * @public
         * @param {number} value - The number value to inline.
         * @returns {HTMLSpanElement} The inline number value element.
         */
        function getInlineNumberValueElement(value) {
            return UIDom.createElement('span', { className: 'sch-inline-number-value', textContent: String(value) });
        }
        UIBasicEvaluator.getInlineNumberValueElement = getInlineNumberValueElement;
        /**
         * Gets the inline bigint value element.
         * @public
         * @param {bigint} value - The bigint value to inline.
         * @returns {HTMLSpanElement} The inline bigint value element.
         */
        function getInlineBigIntValueElement(value) {
            return UIDom.createElement('span', { className: 'sch-inline-bigint-value', textContent: String(value) /*+ 'n'*/ });
        }
        UIBasicEvaluator.getInlineBigIntValueElement = getInlineBigIntValueElement;
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the inline string value element.
         * @private
         * @param {string} value - The string value to inline.
         * @returns {HTMLSpanElement} The inline string value element.
         */
        const _getInlineStringValueElement = function (value) {
            return UIDom.createElement('span', {
                className: 'sch-inline-string-value',
                children: [
                    UIDom.createElement('span', { className: 'sch-inline-string-quote', textContent: '"' }),
                    UIDom.createElement('span', { textContent: value }),
                    UIDom.createElement('span', { className: 'sch-inline-string-quote', textContent: '"' })
                ]
            });
        };
        /**
         * Gets the inline null or undefined value element.
         * @private
         * @param {null|undefined} value - The null or undefined value to inline.
         * @returns {HTMLSpanElement} The inline null or undefined value element.
         */
        const _getInlineNullOrUndefinedValueElement = function (value) {
            return UIDom.createElement('span', { className: 'sch-inline-object-null-value', textContent: String(value) });
        };
        /**
         * Gets the inline array value element.
         * @private
         * @param {Array<*>} values - The array value to inline.
         * @param {boolean} hideValue - True to hide the array value (only display Array(dimension)) else false.
         * @returns {HTMLSpanElement} The inline array value element.
         */
        const _getInlineArrayValueElement = function (values, hideValue) {
            const rootChildren = [];
            rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-array-name', textContent: 'Array(' + values.length + ')' }));
            if (!hideValue) {
                rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-bracket', textContent: ' [' }));
                for (let i = 0; i < values.length; i++) {
                    const element = UIBasicEvaluator.getInlineValueElement(values[i], true, true);
                    if (element) {
                        rootChildren.push(element);
                        if (i < values.length - 1) {
                            rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-comma', textContent: ', ' }));
                        }
                    }
                }
                rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-bracket', textContent: ']' }));
            }
            return UIDom.createElement('span', { className: 'sch-inline-array-value', children: rootChildren });
        };
        /**
         * Gets the inline object value element.
         * @private
         * @param {Object} value - The object value to inline.
         * @param {boolean} hideValue - True to hide the object value (only display object type) else false.
         * @returns {HTMLSpanElement} The inline object value element.
         */
        const _getInlineObjectValueElement = function (value, hideValue) {
            const isUndefined = value === null || value === undefined;
            const rootChildren = [];
            rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-object-name', textContent: isUndefined ? String(value) : value.constructor.name }));
            if (!isUndefined && !hideValue) {
                rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-bracket', textContent: ' {' }));
                const keys = Object.keys(value);
                for (let k = 0; k < keys.length; k++) {
                    const propertyKey = keys[k];
                    const propertyValue = value[propertyKey];
                    const propertyChildren = [];
                    propertyChildren.push(UIDom.createElement('span', { className: 'sch-inline-object-property-name', textContent: propertyKey }));
                    propertyChildren.push(UIDom.createElement('span', { className: 'sch-inline-colon', textContent: ': ' }));
                    const propertyValueElt = UIBasicEvaluator.getInlineValueElement(propertyValue, true, true);
                    if (propertyValueElt) {
                        propertyChildren.push(propertyValueElt);
                    }
                    if (k < keys.length - 1) {
                        propertyChildren.push(UIDom.createElement('span', { className: 'sch-inline-comma', textContent: ', ' }));
                    }
                    rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-object-property', children: propertyChildren }));
                }
                rootChildren.push(UIDom.createElement('span', { className: 'sch-inline-bracket', textContent: '}' }));
            }
            return UIDom.createElement('span', { className: 'sch-inline-object-value', children: rootChildren });
        };
    })(UIBasicEvaluator || (UIBasicEvaluator = {}));
    return UIBasicEvaluator;
});
