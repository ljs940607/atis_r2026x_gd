/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUITools'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUITools", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, BlockLibrary, GraphBlock, ModelEnums) {
    "use strict";
    class UITools {
        /**
         * Gets the compatible WUX combobox list from the given array.
         * @public
         * @static
         * @param {Array<string>} array - The array.
         * @param {string} [iconItem] - The font icon item.
         * @returns {Array<IWUXComboBoxElement>} The WUX combo list.
         */
        static getWUXComboListFromArray(array, iconItem) {
            const combolist = [];
            array.forEach(element => combolist.push({ labelItem: element, valueItem: element, iconItem: iconItem }));
            return combolist;
        }
        /**
         * Gets the compatible WUX combobox list from the given enumeration.
         * @public
         * @static
         * @param {Object} enumeration - The enumeration.
         * @param {string} [iconItem] - The font icon item.
         * @returns {Array<IWUXComboBoxElement>} The WUX combo list.
         */
        /*public static getWUXComboListFromEnum<T extends { [key: number]: string | number }>(enumeration: T, iconItem?: string): IWUXComboBoxElement[] {
            const combolist = [] as IWUXComboBoxElement[];
            const keys = Object.keys(enumeration);
            keys.forEach(key => combolist.push({ labelItem: key, valueItem: enumeration[key], iconItem: iconItem }));
            return combolist;
        }*/
        /**
         * Gets the value inline preview.
         * @public
         * @static
         * @param {*} value - The value to preview.
         * @param {number} [maxLength] - The maximum preview length.
         * @param {number} [maxDepth=1] - The maximum object depth to reach.
         * @param {number} [currentDepth=0] - The current object depth.
         * @returns {string} The inline root value preview.
         */
        static getValueInlinePreview(value, maxLength, maxDepth = 1, currentDepth = 0) {
            let result = '', prefix, postfix;
            const separator = ', ', ellipsis = '...';
            if (value !== undefined) {
                if (typeof value === 'object') {
                    const isArray = Array.isArray(value);
                    result = value.constructor.name;
                    result = isArray ? result + '(' + value.length + ')' : result;
                    if (currentDepth < maxDepth) {
                        prefix = isArray ? '[' : '{';
                        postfix = isArray ? ']' : '}';
                        result += ' ' + prefix;
                        // For array we filter only index properties
                        const keys = isArray ? Object.keys(value).filter(key => Number.isInteger(Number(key))) : Object.keys(value);
                        for (let k = 0; k < keys.length; k++) {
                            const key = keys[k];
                            let subValue = UITools.getValueInlinePreview(value[key], undefined, maxDepth, currentDepth + 1);
                            subValue = isArray ? subValue : key + ': ' + subValue;
                            if (maxLength !== undefined) {
                                if (result.length + subValue.length > maxLength - separator.length - ellipsis.length - postfix.length) {
                                    result += ellipsis;
                                    break;
                                }
                            }
                            result += subValue;
                            if (k < keys.length - 1) {
                                result += separator;
                            }
                        }
                        result += postfix;
                    }
                }
                else if (typeof value === 'string') {
                    result = value;
                    if (maxLength !== undefined && result.length > maxLength - 2) {
                        result = result.substring(0, maxLength - ellipsis.length - 2) + ellipsis;
                    }
                    result = '"' + result + '"';
                }
                else {
                    result = value.toString();
                }
            }
            return String(result);
        }
        /**
         * Builds a JSON string handling bigint values.
         * @public
         * @static
         * @param {*} value - The value to stringify.
         * @returns {string} The stringified value.
         */
        static buildJSONString(value) {
            let result = '';
            if (value !== undefined) {
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        let display = '';
                        value.forEach(v => {
                            display += display !== '' ? ',' : '';
                            display += this.buildJSONString(v);
                        });
                        result = '[' + display + ']';
                    }
                    else if (value instanceof ArrayBuffer) {
                        result = 'Buffer(' + value.byteLength + ')';
                    }
                    else {
                        let display = '';
                        const keys = Object.keys(value);
                        keys.forEach(key => {
                            const v = value[key];
                            if (v !== undefined) {
                                display += display !== '' ? ',' : '';
                                display += '"' + key + '":' + this.buildJSONString(v);
                            }
                        });
                        result = '{' + display + '}';
                    }
                }
                else if (typeof value === 'string') {
                    result = '"' + value + '"';
                }
                else if (typeof value === 'boolean') {
                    result = value ? 'true' : 'false';
                }
                else if (typeof value === 'number' || typeof value === 'bigint') {
                    result = value.toString();
                }
            }
            return result;
        }
        /**
         * Safely stringify to JSON the provided object.
         * @public
         * @static
         * @param {*} object - The object to safely stringify.
         * @returns {string} - The safely stringified object.
         */
        static safeJSONStringify(object) {
            const objMap = new Map();
            const cache = [];
            const parseObject = function (o, parentPath) {
                objMap.set(o, parentPath);
                for (let p in o) {
                    if (o.hasOwnProperty(p)) {
                        const v = o[p];
                        if (typeof v === 'object' && v !== null && !objMap.has(v)) {
                            parseObject(v, parentPath + '.' + p);
                        }
                    }
                }
            };
            parseObject(object, '~');
            const result = JSON.stringify(object, function (_k, v) {
                if (typeof v === 'object' && v !== null) {
                    if (cache.indexOf(v) !== -1) {
                        return '[Circular Reference: ' + objMap.get(v) + ']';
                    }
                    cache.push(v);
                }
                else if (typeof v === 'bigint') {
                    return v.toString();
                }
                return v;
            }, 2);
            objMap.clear();
            return result;
        }
        /**
         * Gets the sorted block list from the provided category.
         * @public
         * @static
         * @param {string} categoryName - The block category name.
         * @returns {Array<Block>} The sorted block list.
         */
        static getSortedBlockByCategory(categoryName) {
            const blocks = BlockLibrary.searchBlockByCategory(RegExp('^' + categoryName + '$'));
            blocks.sort((block1, block2) => block1.getName() <= block2.getName() ? -1 : 1);
            return blocks;
        }
        /**
         * Gets the correct option value.
         * If defaultValue is undefined then value is returned.
         * If defaultValue is provided then type of value is checked and
         * if types are different then defaultValue is returned.
         * @public
         * @static
         * @param {*} value - The option value.
         * @param {*} defaultValue - The default option value.
         * @returns {*} The correct option value.
         */
        static getOptionValue(value, defaultValue) {
            let result = value;
            const defaultType = typeof defaultValue;
            if (defaultType !== 'undefined') {
                result = typeof value === defaultType ? value : defaultValue;
            }
            return result;
        }
        /**
         * Gets the full date.
         * @public
         * @static
         * @param {Date} date - The date.
         * @returns {string} The full date.
         */
        static getFullDate(date) {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        }
        /**
         * Gets the full time.
         * @public
         * @static
         * @param {Date} date - The date.
         * @returns {string} The full time.
         */
        static getFullTime(date) {
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);
            const milliseconds = ('00' + date.getMilliseconds()).slice(-3);
            return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
        }
        /**
         * Gets the full date and time.
         * @public
         * @static
         * @param {Date} date - The date.
         * @returns {string} The full date and time.
         */
        static getFullDateAndTime(date) {
            return UITools.getFullDate(date) + ' ' + UITools.getFullTime(date);
        }
        /**
         * Escapes HTML characters from the provided string.
         * @public
         * @static
         * @param {string} text - The text to escape.
         * @returns {string} The escaped text.
         */
        static escapeHTML(text) {
            const escapeElement = document.createElement('textarea');
            escapeElement.textContent = text;
            return escapeElement.innerHTML;
        }
        /**
         * Format the provided text by converting double quotes to single quotes.
         * @public
         * @static
         * @param {string} text - The text to format.
         * @returns {string} The formatted text.
         */
        static formatToSingleQuotes(text) {
            return text.replace(new RegExp('"', 'g'), '\'');
        }
        /**
         * Perfoms an intersection between two arrays.
         * @public
         * @static
         * @param {T[]} array1 - The first array.
         * @param {T[]} array2 - The second array.
         * @returns {T[]} - The intersection between the two arrays.
         */
        static arrayIntersection(array1, array2) {
            if (array2.length > array1.length) {
                const temp = array2;
                array2 = array1;
                array1 = temp;
            }
            return array1.filter(value => array2.indexOf(value) > -1);
        }
        /**
         * Merges two objects (first level only, no recursivity).
         * @private
         * @static
         * @param {IObject} obj1 - The object 1.
         * @param {IObject} obj2 - The object 2.
         * @param {boolean} concatArrays - True to concat arrays object properties, false otherwise.
         * @param {boolean} mergeArrays - True to merge arrays object properties, false otherwise.
         * @returns {IObject} The merged object.
         */
        static _mergeObject(obj1, obj2, concatArrays, mergeArrays) {
            let result = obj1 || obj2;
            if (obj1 !== undefined && obj2 !== undefined) {
                Object.keys(obj2).forEach(key => {
                    let value = obj2[key];
                    if (value !== undefined) {
                        if (Array.isArray(value)) {
                            if (concatArrays) {
                                value = [obj1[key] || [], value].flat();
                            }
                            else if (mergeArrays) {
                                value = this._mergeArrayObject(obj1[key], value, concatArrays, mergeArrays);
                            }
                        }
                        result[key] = value;
                    }
                });
            }
            return result;
        }
        /**
         * Merges two arrays of objects (first level only, no recursivity).
         * @private
         * @static
         * @param {IObject[]} array1 - The first array of objects.
         * @param {IObject[]} array2 - The second array of objects.
         * @param {boolean} concatArrays - True to concat arrays object properties, false otherwise.
         * @param {boolean} mergeArrays - True to merge arrays object properties, false otherwise.
         * @returns {IObject[]} The merged array of objects.
         */
        static _mergeArrayObject(array1, array2, concatArrays, mergeArrays) {
            const result = array2 || [];
            if (Array.isArray(array1) && Array.isArray(array2)) {
                const keys1 = Object.keys(array1); // The keys of the first array
                const keys2 = Object.keys(array2).filter(key => !keys1.includes(key)); // The keys of the second array minus the first array
                keys1.forEach(key => {
                    const obj1 = array1[key];
                    const obj2 = array2[key];
                    result[key] = this._mergeObject(obj1, obj2, concatArrays, mergeArrays);
                });
                keys2.forEach(key => {
                    const obj1 = array1[key];
                    const obj2 = array2[key];
                    result[key] = this._mergeObject(obj1, obj2, concatArrays, mergeArrays);
                });
            }
            return result;
        }
        /**
         * Merges two objects (first level only, no recursivity).
         * Object properties of array type will not be merged (obj2 always wins).
         * @public
         * @static
         * @param {IObject} obj1 - The object 1.
         * @param {IObject} obj2 - The object 2.
         * @returns {IObject} The merged object.
         */
        static mergeObjectWithoutArray(obj1, obj2) {
            return this._mergeObject(obj1, obj2, false, false);
        }
        /**
         * Merges two objects (first level only, no recursivity).
         * Object properties of array type will be merged.
         * @public
         * @static
         * @param {IObject} obj1 - The object 1.
         * @param {IObject} obj2 - The object 2.
         * @returns {IObject} The merged object.
         */
        static mergeObjectWithArray(obj1, obj2) {
            return this._mergeObject(obj1, obj2, false, true);
        }
        /**
         * Merges two objects (first level only, no recursivity).
         * Object properties of array type will be concatened.
         * @public
         * @static
         * @param {IObject} obj1 - The object 1.
         * @param {IObject} obj2 - The object 2.
         * @returns {IObject} The merged object.
         */
        static mergeObjectConcatArray(obj1, obj2) {
            return this._mergeObject(obj1, obj2, true, false);
        }
        /**
         * Gets the data port play value.
         * @public
         * @static
         * @param {UIDataPort} portUI - The data port UI.
         * @returns {IDataPortPlayValue} The data port play value result.
         */
        static getDataPortPlayValue(portUI) {
            const result = { hasPlayValue: false, value: undefined, fromDebug: false };
            const traceController = portUI?.getEditor()?.getTraceController();
            if (traceController?.getPlayingState()) {
                const isSubDataPort = portUI.getModel().dataPort !== undefined;
                const parentDataPortModel = isSubDataPort ? portUI.getModel().dataPort : portUI.getModel();
                const path = parentDataPortModel.toPath();
                const events = traceController.getEventByDataPortPath(path);
                if (events.length > 0) {
                    const lastEvent = events[events.length - 1];
                    result.value = isSubDataPort ? lastEvent.getValue()[portUI.getModel().getName()] : lastEvent.getValue();
                    result.fromDebug = lastEvent.isFromDebug();
                    result.hasPlayValue = true;
                }
            }
            return result;
        }
        /**
         * Gets the data port default value.
         * @public
         * @static
         * @param {UIDataPort} portUI - The data port UI.
         * @returns {IDataPortDefaultValue} The data port default value result.
         */
        static getDataPortDefaultValue(portUI) {
            const result = { hasDefaultValue: false, value: undefined };
            if (portUI?.isStartPort()) {
                const portModel = portUI.getModel();
                const isGraph = portModel.block instanceof GraphBlock;
                const viewerController = portUI?.getEditor()?.getViewerController();
                if (viewerController) {
                    const isRootGraph = portModel.block === viewerController.getRootViewer().getMainGraph().getModel();
                    const hasNoLinks = portModel.getDataLinks(portModel.block.graph).length === 0;
                    if ((isGraph && isRootGraph) || hasNoLinks) {
                        result.value = portModel.getDefaultValue();
                        result.hasDefaultValue = true;
                    }
                }
            }
            return result;
        }
        /**
         * Checks the data port is debuggable.
         * @public
         * @static
         * @param {UIEditor} editor - The editor.
         * @param {DataPort} dataPort - The data port model.
         * @returns {boolean} True if the port is debuggable else false.
         */
        static isDataPortDebuggable(editor, dataPort) {
            const traceController = editor.getTraceController();
            const debugController = editor.getDebugController();
            let result = dataPort.isDefaultValueSettable();
            result = result && editor.getOptions()?.playCommands?.callbacks?.onBreakBlockDataChange !== undefined;
            result = result && traceController.getPlayingState();
            result = result && debugController.getDebugCursorByBlockPath(dataPort.block.toPath()) !== undefined;
            return result;
        }
        /**
         * Checks if one of the block input data port is debuggable
         * @public
         * @static
         * @param {UIEditor} editor - The editor.
         * @param {Block} block - The block model.
         * @returns {boolean} True if one the block input data port is debuggable else false.
         */
        static isBlockDataPortDebuggable(editor, block) {
            let result = false;
            if (editor && block) {
                result = block.getDataPorts([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal]).some(dataPort => this.isDataPortDebuggable(editor, dataPort));
            }
            return result;
        }
        /**
         * Gets the break block data.
         * @public
         * @static
         * @param {UIEditor} editor - The editor.
         * @param {DataPort[]} dataPorts - The data port model list.
         * @param {Map<string, boolean>} overrideMap - The override map.
         * @returns {IDebugValue[]} The break block data.
         */
        static getBreakBlockData(editor, dataPorts, overrideMap) {
            const traceController = editor.getTraceController();
            const breakBlockData = [];
            dataPorts.forEach(dataPort => {
                const dataPortPath = dataPort.toPath();
                const traceEvents = traceController.getEventByDataPortPath(dataPortPath);
                if (traceEvents.length) {
                    const traceEvent = traceEvents[traceEvents.length - 1];
                    const override = overrideMap.has(dataPortPath) ? overrideMap.get(dataPortPath) : false;
                    let isValueModified = override || traceEvent.isFromDebug();
                    const playValue = override || !traceEvent.isFromDebug() ? dataPort.getDefaultValue() : traceEvent.getValue();
                    // Manage sub data port override
                    Array.from(overrideMap.keys()).filter(key => key.startsWith(dataPortPath)).forEach(key => {
                        if (key.length > dataPortPath.length) {
                            const propertyName = key.replace(dataPortPath + '.', '');
                            isValueModified = true;
                            playValue[propertyName] = dataPort.getDefaultValue()[propertyName];
                        }
                    });
                    breakBlockData.push({
                        dataPort: dataPort, // Here is the temporary DataPort reference!
                        value: playValue,
                        fromDebug: isValueModified
                    });
                }
            });
            return breakBlockData;
        }
        /**
         * Gets the label class names from the given data port value.
         * @public
         * @static
         * @param {string} parentClassName - The parent class name.
         * @param {any} dataPortValue - The data port value.
         * @returns {string[]} - The label class names.
         */
        static getLabelClassNamesFromDataPortValue(parentClassName, dataPortValue) {
            const typeofValue = dataPortValue instanceof ArrayBuffer ? 'buffer' : typeof dataPortValue;
            const classNames = [parentClassName, 'sch-valuetype-' + typeofValue];
            if (typeofValue === 'string' && dataPortValue.match(new RegExp('\\n')) === null) {
                classNames.push('sch-valuetype-string-monoline');
            }
            return classNames;
        }
        /**
         * Checks if the provided flag has the provided enum value.
         * @public
         * @static
         * @param {T} flag - The flag.
         * @param {number} enumValue - The enum value.
         * @returns {boolean} True if the provided flag has the enum value, false otherwise.
         */
        static hasEnumFlag(flag, enumValue) {
            return (flag & enumValue) === enumValue;
        }
        /**
         * Convert the provided camel case string to dashed string.
         * @public
         * @static
         * @param {string} camelCase - The camel case to convert.
         * @returns {string} The converted camel case to dashed.
         */
        static camelCaseToDashed(camelCase) {
            return camelCase.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        }
    }
    return UITools;
});
