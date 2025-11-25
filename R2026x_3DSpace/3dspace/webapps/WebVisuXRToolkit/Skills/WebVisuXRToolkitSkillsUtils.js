define("DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SkillSettings = exports.SkillOptions = exports.CompositeMap = exports.InputAction = exports.AbstractHandedness = void 0;
    var AbstractHandedness;
    (function (AbstractHandedness) {
        AbstractHandedness[AbstractHandedness["None"] = 1] = "None";
        AbstractHandedness[AbstractHandedness["Primary"] = 2] = "Primary";
        AbstractHandedness[AbstractHandedness["Secondary"] = 3] = "Secondary";
    })(AbstractHandedness || (exports.AbstractHandedness = AbstractHandedness = {}));
    var InputAction;
    (function (InputAction) {
        InputAction[InputAction["ControllerPassive"] = 1] = "ControllerPassive";
        InputAction[InputAction["TouchScreenPassive"] = 2] = "TouchScreenPassive";
        InputAction[InputAction["HandPassive"] = 3] = "HandPassive";
        InputAction[InputAction["MixedReality"] = 4] = "MixedReality";
        InputAction[InputAction["FullImmersive"] = 5] = "FullImmersive";
        InputAction[InputAction["GripPress"] = 6] = "GripPress";
        InputAction[InputAction["GripTouch"] = 7] = "GripTouch";
        InputAction[InputAction["TriggerPress"] = 8] = "TriggerPress";
        InputAction[InputAction["TriggerTouch"] = 9] = "TriggerTouch";
        InputAction[InputAction["FirstButtonPress"] = 10] = "FirstButtonPress";
        InputAction[InputAction["FirstButtonTouch"] = 11] = "FirstButtonTouch";
        InputAction[InputAction["SecondButtonPress"] = 12] = "SecondButtonPress";
        InputAction[InputAction["SecondButtonTouch"] = 13] = "SecondButtonTouch";
        InputAction[InputAction["JoystickPress"] = 14] = "JoystickPress";
        InputAction[InputAction["JoystickTouch"] = 15] = "JoystickTouch";
        InputAction[InputAction["IndexPinch"] = 16] = "IndexPinch";
        InputAction[InputAction["MiddlePinch"] = 17] = "MiddlePinch";
        InputAction[InputAction["Point"] = 18] = "Point";
        InputAction[InputAction["FlatHand"] = 19] = "FlatHand";
        InputAction[InputAction["GunHand"] = 20] = "GunHand";
        InputAction[InputAction["HandPalmUp"] = 21] = "HandPalmUp";
        InputAction[InputAction["IndexAboutToPinch"] = 22] = "IndexAboutToPinch";
        InputAction[InputAction["MiddleAboutToPinch"] = 23] = "MiddleAboutToPinch";
    })(InputAction || (exports.InputAction = InputAction = {}));
    function hashEnumList(inputActionList) {
        const list = inputActionList.sort();
        const prime = 31; // Choose a prime number for hashing
        let hash = 0;
        for (const enumValue of list) {
            hash = (hash * prime) + enumValue;
        }
        return hash;
    }
    // This is a classic map, but it takes lists of elements as keys, and stores the values in multi-level maps according to the length of the keys
    class CompositeMap {
        constructor() {
            this._availableInputs = new Set();
            this._inUseInputs = new Map();
            this._multiInputsSkillEventMap = new Map(); // clasify each map of skillevents by length of InputAction list
        }
        // This function return all possible combinations of size combosize in an array
        getCombinations(arr, comboSize) {
            const result = [];
            function helper(start, currentCombo) {
                if (currentCombo.length === comboSize) {
                    result.push([...currentCombo]);
                    return;
                }
                for (let i = start; i < arr.length; i++) {
                    currentCombo.push(arr[i]);
                    helper(i + 1, currentCombo);
                    currentCombo.pop();
                }
            }
            helper(0, []);
            return result;
        }
        /*
            This function will look through a specific level of the multi-level map for corresponding skillEvents
        */
        getSkillEventFromInputsListLength(actions, indexMap) {
            const used_inputs = new Set();
            const skillEvents = [];
            const actionsList = Array.from(actions);
            const relevantInputSkillEventMap = this._multiInputsSkillEventMap.get(indexMap);
            if (relevantInputSkillEventMap) {
                const combinationList = this.getCombinations(actionsList, indexMap);
                for (const combination of combinationList) {
                    const hash = hashEnumList(combination);
                    const res = relevantInputSkillEventMap.get(hash);
                    if (res) {
                        for (const skillEvent of res) {
                            skillEvents.push(skillEvent);
                            for (const input of skillEvent.bindings) {
                                used_inputs.add(input);
                            }
                        }
                    }
                }
            }
            return { "used_inputs": used_inputs, "skillEvents": skillEvents };
        }
        /*
             This is a critical funtion
             Its role is from a set of actions and a indexMap corresponding to the length of the InputActions used,
             to return all skillEvents that have the bindings corresponding to it.
             It will look through all SkillEvents that have bindings length of size indexMap and recursively go down and keep in memory which inputs have been used.
             Eg: We have 3 SkilEvents : A with bindings [pinching, handpalmUp], B with [pinching] and C with [ClosedFist]
             If we call with actions [Passive, handpalmup, pinching] and 3, it returns A
             IF we call the same actions with 1, it returns B
             If we call with actions [Passive, HandPalmUp, pinching, ClosedFist] and 2, 3 or 4: it returns A and C
             If we call the same actions with 1, it returns B and C
         */
        get(inputActions) {
            const actions = Array.from(inputActions).sort();
            const len = actions.length;
            let skillEvents = [];
            const already_used_inputs = new Set();
            for (let indexMap = len; indexMap > 0; indexMap--) {
                const availableActions = new Set();
                for (const action of actions) {
                    if (!already_used_inputs.has(action)) {
                        availableActions.add(action);
                    }
                }
                const tmp = this.getSkillEventFromInputsListLength(availableActions, indexMap);
                for (const usedInput of tmp.used_inputs) {
                    already_used_inputs.add(usedInput);
                }
                skillEvents = skillEvents.concat(tmp.skillEvents);
            }
            return skillEvents;
        }
        /*
            Like function get above
            but returns every skillEvents that has the inputActions
        */
        getAll() {
            let skillEvents = new Set();
            for (const relevantInputSkillEventMap of this._multiInputsSkillEventMap.values()) {
                for (const tmp of relevantInputSkillEventMap.values()) {
                    skillEvents = new Set([...skillEvents, ...tmp]);
                }
            }
            return skillEvents;
        }
        delete(inputActions) {
            const actions = Array.from(inputActions);
            const relevantInputSkillEventMap = this._multiInputsSkillEventMap.get(actions.length);
            if (relevantInputSkillEventMap) {
                return relevantInputSkillEventMap.delete(hashEnumList(actions));
            }
            return false;
        }
        addSkillEvent(inputActions, skillEvent) {
            const actions = Array.from(inputActions);
            const len = actions.length;
            const hash = hashEnumList(actions);
            if (!this._multiInputsSkillEventMap.has(len)) {
                this._multiInputsSkillEventMap.set(len, new Map());
            }
            this._inUseInputs.set(inputActions, hash);
            const relevantInputSkillEventMap = this._multiInputsSkillEventMap.get(len);
            if (relevantInputSkillEventMap) {
                if (relevantInputSkillEventMap.has(hash)) {
                    relevantInputSkillEventMap.get(hash).add(skillEvent);
                }
                else {
                    relevantInputSkillEventMap.set(hash, new Set([skillEvent]));
                }
            }
        }
        keys() {
            return this._inUseInputs.keys();
        }
        registerActions(actions) {
            for (const action of actions) {
                this._availableInputs.add(action);
            }
        }
        deRegisterActions(actions, input) {
            const unattributedSkillEvents = [];
            for (const action of actions) {
                for (const [inputActions, skillEventsHash] of this._inUseInputs) {
                    for (const inputAction of inputActions) {
                        if (action === inputAction) {
                            const relevantInputSkillEventMap = this._multiInputsSkillEventMap.get(inputActions.size);
                            if (relevantInputSkillEventMap) {
                                const skillEvents = relevantInputSkillEventMap.get(skillEventsHash);
                                if (skillEvents) {
                                    for (const skillEvent of skillEvents) {
                                        skillEvent.onUnregisterInput(input);
                                        unattributedSkillEvents.push(skillEvent);
                                    }
                                    relevantInputSkillEventMap.delete(skillEventsHash);
                                    this._inUseInputs.delete(inputActions);
                                }
                            }
                        }
                    }
                }
                this._availableInputs.delete(action);
            }
            return unattributedSkillEvents;
        }
        AreActionsAvailable(actions) {
            for (const action of actions) {
                if (!this._availableInputs.has(action)) {
                    return false;
                }
            }
            return true;
        }
    }
    exports.CompositeMap = CompositeMap;
    class SkillOptions {
        constructor(tabName, UIElement, options) {
            console.warn("SkillOptions is deprecated. Use SkillInfo instead.", new Error().stack);
            this._options = options || {};
            this._tabName = tabName;
            this._UIElement = UIElement;
        }
        get options() {
            console.warn("SkillOptions is deprecated. Use SkillInfo instead.", new Error().stack);
            return this._options;
        }
        get tabName() {
            console.warn("SkillOptions is deprecated. Use SkillInfo instead.", new Error().stack);
            return this._tabName;
        }
        get UIElement() {
            console.warn("SkillOptions is deprecated. Use SkillInfo instead.", new Error().stack);
            return this._UIElement;
        }
    }
    exports.SkillOptions = SkillOptions;
    class SkillSettings {
        constructor(settings) {
            this._numericalValues = new Map();
            this._stringValues = new Map();
            this._booleanValues = new Map();
            settings.forEach(setting => {
                if (typeof setting.current === 'number') {
                    // It's a numerical value
                    this.createNumericalValue(setting.name, setting.max, setting.min, setting.step, setting.current);
                }
                else if (typeof setting.current === 'string') {
                    // It's a string value
                    this.createStringValue(setting.name, setting.values, setting.current);
                }
                else if (typeof setting.current === 'boolean') {
                    // It's a boolean value
                    this.createBooleanValue(setting.name, setting.current);
                }
            });
        }
        createNumericalValue(name, max, min, step, current) {
            this._numericalValues.set(name, { max, min, step, current });
        }
        setNumericalValue(name, value) {
            const tmp = this._numericalValues.get(name);
            if (tmp) {
                tmp.current = value;
            }
        }
        getNumericalValue(name) {
            return this._numericalValues.get(name)?.current;
        }
        listNumericalValues() {
            return this._numericalValues;
        }
        createStringValue(name, values, current) {
            this._stringValues.set(name, { values, current });
        }
        setStringValue(name, value) {
            const tmp = this._stringValues.get(name);
            if (tmp) {
                tmp.current = value;
            }
        }
        getStringValue(name) {
            return this._stringValues.get(name)?.current;
        }
        listStringValues() {
            return this._stringValues;
        }
        createBooleanValue(name, current) {
            this._booleanValues.set(name, current);
        }
        setBooleanValue(name, value) {
            this._booleanValues.set(name, value);
        }
        getBooleanValue(name) {
            return this._booleanValues.get(name);
        }
        listBooleanValues() {
            return this._booleanValues;
        }
    }
    exports.SkillSettings = SkillSettings;
});
