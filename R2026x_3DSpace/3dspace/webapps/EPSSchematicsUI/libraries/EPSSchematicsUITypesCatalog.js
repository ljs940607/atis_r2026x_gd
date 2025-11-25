/// <amd-module name='DS/EPSSchematicsUI/libraries/EPSSchematicsUITypesCatalog'/>
define("DS/EPSSchematicsUI/libraries/EPSSchematicsUITypesCatalog", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIBaseTypes.json", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUITypeTemplates.json", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/Tweakers/TypeRepresentationFactory"], function (require, exports, UITools, UIBaseTypes, UITypeTemplates, TypeLibrary, Events, ModelEnums, WUXTypeRepresentationFactory) {
    "use strict";
    /**
     * This singleton class defines the types catalog.
     * @private
     * @class UITypesCatalog
     * @alias module:DS/EPSSchematicsUI/libraries/EPSSchematicsUITypesCatalog
     */
    class UITypesCatalog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            this._onTypeLibraryRegisterGlobalCB = this._onTypeLibraryRegisterGlobal.bind(this);
            this._onTypeLibraryRegisterLocalCustomCB = this._onTypeLibraryRegisterLocalCustom.bind(this);
            this._isReady = false;
            this._editor = editor;
            this._typeRepFactory = new WUXTypeRepresentationFactory({ onReady: () => { this._isReady = true; } });
            TypeLibrary.addListener(Events.TypeLibraryRegisterGlobalEvent, this._onTypeLibraryRegisterGlobalCB);
            TypeLibrary.addListener(Events.TypeLibraryRegisterLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            TypeLibrary.addListener(Events.TypeLibraryUpdateLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            this._typeRepFactory.registerTypeTemplates(JSON.parse(UITypeTemplates));
            this._registerTypes();
        }
        /**
         * Removes the type catalog.
         * @public
         */
        remove() {
            TypeLibrary.removeListener(Events.TypeLibraryRegisterGlobalEvent, this._onTypeLibraryRegisterGlobalCB);
            TypeLibrary.removeListener(Events.TypeLibraryRegisterLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            TypeLibrary.removeListener(Events.TypeLibraryUpdateLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            // Unregisters each local types from the given graph context
            const mainGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
            const graphContext = mainGraph.getModel().getGraphContext();
            const localCustomTypeNameList = TypeLibrary.getLocalCustomTypeNameList(graphContext, ModelEnums.FTypeCategory.fObject);
            TypeLibrary.unregisterLocalCustomTypes(graphContext, localCustomTypeNameList);
            this._editor = undefined;
            this._typeRepFactory = undefined;
            this._onTypeLibraryRegisterGlobalCB = undefined;
            this._onTypeLibraryRegisterLocalCustomCB = undefined;
            this._isReady = undefined;
        }
        /**
         * Gets the WUX type representation factory.
         * @public
         * @returns {WUXTypeRepresentationFactory} The WUX type representation factory.
         */
        getTypeRepresentationFactory() {
            return this._typeRepFactory;
        }
        /**
         * Checks if the types catalog is ready.
         * @public
         * @returns {boolean} True if the types catalog is ready else false.
         */
        isReady() {
            return this._isReady;
        }
        /**
         * Creates an instance of the provided class type with the provided property values.
         * @public
         * @param {string} valueType - The value type.
         * @param {IObject} value - The classType property values.
         * @returns {any} The instance of the class type.
         */
        createClassTypeInstance(valueType, value) {
            let instance;
            if (value !== undefined) {
                if (TypeLibrary.hasGlobalType(valueType, ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent)) {
                    const classType = TypeLibrary.getGlobalType(valueType);
                    const CtorClass = classType.constructor;
                    instance = new CtorClass();
                    for (let propertyName in classType.descriptor) {
                        if (classType.descriptor.hasOwnProperty(propertyName)) {
                            if (value[propertyName] !== undefined) {
                                instance[propertyName] = value[propertyName];
                            }
                            if (classType.descriptor[propertyName].mandatory && instance[propertyName] === undefined) {
                                instance[propertyName] = classType.descriptor[propertyName].defaultValue;
                            }
                        }
                    }
                }
                else if (TypeLibrary.hasGlobalType(valueType, ModelEnums.FTypeCategory.fArray)) {
                    const subValueType = TypeLibrary.getArrayValueTypeName(valueType);
                    if (TypeLibrary.hasGlobalType(subValueType, ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent)) {
                        instance = [];
                        for (let i = 0; i < value.length; i++) {
                            instance.push(this.createClassTypeInstance(subValueType, value[i]));
                        }
                    }
                }
            }
            return instance;
        }
        /**
         * Computes the port or setting value to string format.
         * @public
         * @static
         * @param {string} valueType - The value type.
         * @param {*} value - The enumartion value.
         * @param {number} [maxCharLength] - The maximum character length to display.
         * @returns {string} The port or setting value in string format.
         */
        static getStringValue(valueType, value, maxCharLength) {
            let result;
            if (UITypesCatalog._isArrayEnumType(valueType)) {
                result = UITypesCatalog._getArrayEnumStringValue(valueType, value);
            }
            else if (UITypesCatalog._isEnumType(valueType)) {
                result = UITypesCatalog._getEnumStringValue(valueType, value) || '';
            }
            else {
                result = UITools.getValueInlinePreview(value, maxCharLength);
            }
            return String(result);
        }
        /**
         * The callback on the type library register event.
         * Base types registration not authorized by model for now!
         * @private
         * @param {Events.TypeLibraryRegisterGlobalEvent} event - The type library register global event.
         */
        _onTypeLibraryRegisterGlobal(event) {
            const typeName = event.getName();
            if (TypeLibrary.hasGlobalType(typeName, ModelEnums.FTypeCategory.fEnum)) {
                this._registerEnumType(typeName);
            }
            else if (TypeLibrary.hasGlobalType(typeName, ModelEnums.FTypeCategory.fObject)) {
                this._registerObjectType(typeName);
            }
            else if (TypeLibrary.hasGlobalType(typeName, ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent)) {
                this._registerClassType(typeName);
            }
            else if (TypeLibrary.hasGlobalType(typeName, ModelEnums.FTypeCategory.fBase | ModelEnums.FTypeCategory.fNumerical)) {
                this._registerArrayBaseType(typeName);
            }
        }
        /**
         * The callback on the type library register/update local custom event.
         * Only local object type is handled for now.
         * @private
         * @param {Events.TypeLibraryRegisterLocalCustomEvent|Events.TypeLibraryUpdateLocalCustomEvent} event - The type library register/update local custom event.
         */
        _onTypeLibraryRegisterLocalCustom(event) {
            const typeName = event.getName();
            this._registerObjectType(typeName);
        }
        /**
         * Registers all supported types.
         * @private
         */
        _registerTypes() {
            this._registerBaseTypes();
            this._registerEnumTypes();
            this._registerObjectTypes();
            this._registerClassTypes();
        }
        /**
         * Registers base types representation into the type representation factory.
         * @private
         */
        _registerBaseTypes() {
            this._typeRepFactory.registerTypeRepresentations(UIBaseTypes);
            const baseTypeNameList = TypeLibrary.getGlobalTypeNameList(ModelEnums.FTypeCategory.fBase | ModelEnums.FTypeCategory.fNumerical);
            baseTypeNameList.forEach(baseTypeName => this._registerArrayType(baseTypeName));
        }
        /**
         * Registers only the array of the given base type.
         * The template should already be registered!
         * @private
         * @param {string} baseTypeName - The base type name.
         */
        _registerArrayBaseType(baseTypeName) {
            this._registerArrayType(baseTypeName);
        }
        /**
         * Registers enumeration types representation into the type representation factory.
         * @private
         */
        _registerEnumTypes() {
            const enumTypeNameList = TypeLibrary.getGlobalTypeNameList(ModelEnums.FTypeCategory.fEnum);
            enumTypeNameList.forEach(enumTypeName => this._registerEnumType(enumTypeName));
        }
        /**
         * Registers the given enumeration type representation into the type representation factory.
         * @private
         * @param {string} enumName - The enum type name.
         */
        _registerEnumType(enumName) {
            let enumType = TypeLibrary.getGlobalType(enumName);
            this._typeRepFactory.registerEnum(enumName, enumType);
            this._registerArrayType(enumName);
        }
        /**
         * Registers object types into the type representation factory.
         * @private
         */
        _registerObjectTypes() {
            const objectTypeNameList = TypeLibrary.getGlobalTypeNameList(ModelEnums.FTypeCategory.fObject);
            objectTypeNameList.forEach(objectTypeName => this._registerObjectType(objectTypeName));
        }
        /**
         * Registers the given object type into the type representation factory.
         * @private
         * @param {string} objectName - The object type name.
         */
        _registerObjectType(objectName) {
            const typeRepresentations = {};
            typeRepresentations[objectName] = {
                stdTemplate: 'objectEditorTemplate'
            };
            // Removing previous entry from the typeRepFactory
            delete this._typeRepFactory.typeReps[objectName];
            delete this._typeRepFactory.typeReps['Array<' + objectName + '>'];
            this._typeRepFactory.registerTypeRepresentations(typeRepresentations);
            this._registerArrayType(objectName);
        }
        /**
         * Registers class types into the type representation factory.
         * @private
         */
        _registerClassTypes() {
            const classTypeNameList = TypeLibrary.getGlobalTypeNameList(ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent);
            classTypeNameList.forEach(classTypeName => this._registerClassType(classTypeName));
        }
        /**
         * Registers the given class type into the type representation factory.
         * @private
         * @param {string} className - The class type name.
         */
        _registerClassType(className) {
            const typeRepresentations = {};
            typeRepresentations[className] = {
                stdTemplate: 'objectEditorTemplate'
            };
            this._typeRepFactory.registerTypeRepresentations(typeRepresentations);
            this._registerArrayType(className);
        }
        /**
         * Registers array types into the type representation factory.
         * @private
         * @param {string} valueTypeName - The value type name.
         */
        _registerArrayType(valueTypeName) {
            const arrayValueTypeName = 'Array<' + valueTypeName + '>';
            const typeRepresentations = {};
            typeRepresentations[arrayValueTypeName] = {
                stdTemplate: 'objectEditorTemplate'
            };
            this._typeRepFactory.registerTypeRepresentations(typeRepresentations);
        }
        /**
         * Parses the children of the given parent type.
         * @private
         * @static
         * @param {Object} parentType - The parent type.
         * @returns {Object} The children type paths.
         */
        /*private static _parseChildrenTypes(parentType: object): object {
            const children = {};
            for (let propertyName in parentType) {
                if (parentType.hasOwnProperty(propertyName)) {
                    const property = parentType[propertyName];
                    const typePath = '#' + property.type;
                    children[propertyName] = typePath;
                }
            }
            return children;
        }*/
        /**
         * Checks if the given value type is an array of enumeration.
         * @private
         * @static
         * @param {string} valueType - The value type.
         * @returns {boolean} True if the given value type is an array of enumeration else false.
         */
        static _isArrayEnumType(valueType) {
            const arrayValueType = TypeLibrary.getArrayValueTypeName(valueType);
            return arrayValueType !== undefined ? TypeLibrary.hasGlobalType(arrayValueType, ModelEnums.FTypeCategory.fEnum) : false;
        }
        /**
         * Checks if the given value type is an enumeration.
         * @private
         * @static
         * @param {string} valueType - The value type.
         * @returns {boolean} True if the given value type is an enumeration else false.
         */
        static _isEnumType(valueType) {
            return TypeLibrary.hasGlobalType(valueType, ModelEnums.FTypeCategory.fEnum);
        }
        /**
         * Gets the enumeration string value.
         * @private
         * @static
         * @param {string} valueType - The value type.
         * @param {*} value - The enumeration value.
         * @returns {string|undefined} The enumeration string value.
         */
        static _getEnumStringValue(valueType, value) {
            let stringValue;
            const enumType = TypeLibrary.getGlobalType(valueType);
            if (enumType !== undefined) {
                for (const p in enumType) {
                    if (enumType.hasOwnProperty(p) && enumType[p] === value) {
                        stringValue = p;
                        break;
                    }
                }
            }
            return stringValue;
        }
        /**
         * Gets the array of enumeration string value.
         * @private
         * @static
         * @param {string} valueType - The value type.
         * @param {*} value - The array of enumeration value.
         * @returns {string} The array of enumeration string value.
         */
        static _getArrayEnumStringValue(valueType, value) {
            let result = '';
            const arrayValueType = TypeLibrary.getArrayValueTypeName(valueType);
            if (arrayValueType !== undefined && Array.isArray(value)) {
                result += '[';
                for (let i = 0; i < value.length; i++) {
                    result += UITypesCatalog._getEnumStringValue(arrayValueType, value[i]);
                    if (i < value.length - 1) {
                        result += ', ';
                    }
                }
                result += ']';
            }
            return result;
        }
    }
    return UITypesCatalog;
});
