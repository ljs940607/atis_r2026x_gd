define("DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkill", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils"], function (require, exports, WebVisuXRToolkitConfigManager, WebVisuXRToolkitSkillsUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Skill = void 0;
    /**
     * The Skill class holds a list of SkillEvents
     */
    class Skill {
        constructor(name, icon_src, SkillEventList, skillInfo, tutorialSteps) {
            this._unattributedSkillEvents = new Map(); // All SkillEvents that cannot be used as the bindings are not available (yet)
            /** @internal */
            this._inputHandednessToSkillEventMap = new Map(); // All SkillEvents available
            /** @internal */
            this._activeSkillEventMap = new Map(); // All SkillEvents currrently active (after onActivateBegin has been called)
            this._inputActionHandedness = new Map();
            this._name = name;
            this._icon_src = icon_src;
            this._skillEventList = SkillEventList;
            if (skillInfo instanceof WebVisuXRToolkitSkillsUtils_1.SkillOptions) {
                console.warn("SkillOption is now deprecated, please use SkillInfo", new Error().stack);
            }
            WebVisuXRToolkitConfigManager.instance.setSkillInfos(name, skillInfo);
            this._tutorialSteps = tutorialSteps || [];
            const PrimarySkillEventList = [];
            const SecondarySkillEventList = [];
            const NoHandednessSkillEventList = [];
            for (const skillEvent of SkillEventList) {
                if (skillEvent.desiredHandedness.size === 0) {
                    NoHandednessSkillEventList.push(skillEvent);
                    if (!this._inputActionHandedness.has(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None)) {
                        this._inputActionHandedness.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new Set());
                    }
                    for (const binding of skillEvent.bindings) {
                        this._inputActionHandedness.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None).add(binding);
                    }
                }
                else {
                    for (const desiredHandedness of skillEvent.desiredHandedness) {
                        switch (desiredHandedness) {
                            case WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary:
                                PrimarySkillEventList.push(skillEvent);
                                if (!this._inputActionHandedness.has(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary)) {
                                    this._inputActionHandedness.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new Set());
                                }
                                for (const binding of skillEvent.bindings) {
                                    this._inputActionHandedness.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary).add(binding);
                                }
                                break;
                            case WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary:
                                SecondarySkillEventList.push(skillEvent);
                                if (!this._inputActionHandedness.has(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary)) {
                                    this._inputActionHandedness.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new Set());
                                }
                                for (const binding of skillEvent.bindings) {
                                    this._inputActionHandedness.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary).add(binding);
                                }
                                break;
                            case WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None:
                                NoHandednessSkillEventList.push(skillEvent);
                                if (!this._inputActionHandedness.has(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None)) {
                                    this._inputActionHandedness.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new Set());
                                }
                                for (const binding of skillEvent.bindings) {
                                    this._inputActionHandedness.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None).add(binding);
                                }
                                break;
                        }
                    }
                }
            }
            this._unattributedSkillEvents.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, PrimarySkillEventList);
            this._unattributedSkillEvents.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, SecondarySkillEventList);
            this._unattributedSkillEvents.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, NoHandednessSkillEventList);
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
        }
        getTutorialSteps() {
            return this._tutorialSteps;
        }
        getSkillEvents() {
            return this._skillEventList;
        }
        hasSkillEventHandedness(handedness) {
            const res = this._inputActionHandedness.has(handedness);
            return res;
        }
        get icon() {
            return this._icon_src;
        }
        get name() {
            return this._name;
        }
        isInputCompatibleWith(actions, handedness) {
            for (const skillEvent of this._skillEventList) {
                let compatible = true;
                for (const binding of skillEvent.bindings) {
                    if (!actions.has(binding)) {
                        compatible = false;
                        break;
                    }
                }
                if (compatible) {
                    return true;
                }
            }
            return false;
        }
        /** @internal */
        _isCompatibleWith(other, inputData) {
            const handednessesToTest = new Array();
            if (inputData !== undefined) {
                handednessesToTest.push(inputData.abstractHandedness);
            }
            else {
                handednessesToTest.push(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None);
                handednessesToTest.push(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary);
                handednessesToTest.push(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            }
            for (const abstractHandedness of handednessesToTest) {
                const actions = this._inputActionHandedness.get(abstractHandedness);
                const otherActions = other._inputActionHandedness.get(abstractHandedness);
                if (actions && otherActions) {
                    const input_specific_actions = inputData ? new Set([...inputData.inputs_actions].filter(i => actions.has(i))) : actions;
                    const other_input_specific_actions = inputData ? new Set([...inputData.inputs_actions].filter(i => otherActions.has(i))) : otherActions;
                    for (const AInputAction of input_specific_actions) {
                        if (other_input_specific_actions.has(AInputAction)) {
                            //console.log(this.name, other.name, "not compatible because of", InputAction[AInputAction])
                            return [AInputAction, abstractHandedness];
                        }
                    }
                }
            }
            return null;
        }
        /** @internal */
        _onActionActivate(abstractHandedness, input, actions) {
            const skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(actions);
            for (const skillEvent of skillEvents) {
                skillEvent.onActivate(input);
            }
        }
        /** @internal */
        _onActionActivateBegin(abstractHandedness, input, actions, startedAction) {
            const relevantHandedness = this._inputHandednessToSkillEventMap.get(abstractHandedness);
            const skillEvents = relevantHandedness.get(actions);
            for (const skillEvent of skillEvents) {
                const currently_active_skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(skillEvent.bindings);
                for (const currently_active of currently_active_skillEvents) // Check if the new input combination cancels a previous skillEvent that used only part of the inputs
                 {
                    if (skillEvent.bindings.size > currently_active.bindings.size) {
                        for (const skillEventInput of currently_active.bindings) {
                            if (skillEventInput != startedAction) {
                                currently_active.onActivateEnd(input, startedAction);
                                this._activeSkillEventMap.get(abstractHandedness).delete(skillEvent.bindings);
                                break;
                            }
                        }
                    }
                }
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === startedAction) {
                        skillEvent.onActivateBegin(input, startedAction);
                        this._activeSkillEventMap.get(abstractHandedness).addSkillEvent(skillEvent.bindings, skillEvent);
                        break;
                    }
                }
            }
        }
        /** @internal */
        _onActionActivateEnd(abstractHandedness, input, actions, terminatedAction) {
            const skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(actions);
            for (const skillEvent of skillEvents) {
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === terminatedAction) {
                        skillEvent.onActivateEnd(input, terminatedAction);
                        // Remove skillEvent from the list of currently activated skillevents after onActivatedEnd called
                        this._activeSkillEventMap.get(abstractHandedness).delete(skillEvent.bindings);
                        break;
                    }
                }
            }
            for (const skillEvent of input.pausedSkillEvents) {
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === terminatedAction) {
                        skillEvent.onActivateEnd(input, terminatedAction);
                        input.pausedSkillEvents.delete(skillEvent);
                        break;
                    }
                }
            }
        }
        /** @internal */
        _onActionPause(abstractHandedness, input, actions, terminatedAction) {
            //const skillEvents = this._activeSkillEventMap.get(abstractHandedness)!.get(actions)
            const skillEvents = this._activeSkillEventMap.get(abstractHandedness).getAll();
            for (const skillEvent of skillEvents) {
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === terminatedAction) {
                        skillEvent.onActivateEnd(input, terminatedAction);
                        // Remove skillEvent from the list of curretrnyl activated skillevents after onActivatedEnd called
                        this._activeSkillEventMap.get(abstractHandedness).delete(skillEvent.bindings);
                        input.pausedSkillEvents.add(skillEvent);
                        break;
                    }
                }
            }
        }
        /** @internal */
        _onActionResume(abstractHandedness, input, actions, startedAction) {
            const skillEvents = this._inputHandednessToSkillEventMap.get(abstractHandedness).getAll();
            for (const skillEvent of skillEvents) {
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === startedAction) {
                        if (input.pausedSkillEvents.has(skillEvent)) {
                            skillEvent.onActivateBegin(input, startedAction);
                            this._activeSkillEventMap.get(abstractHandedness).addSkillEvent(skillEvent.bindings, skillEvent);
                            input.pausedSkillEvents.delete(skillEvent);
                        }
                        break;
                    }
                }
            }
        }
        /** @internal */
        _registerAvailableActions(inputActions, abstractHandedness, input) {
            this._inputHandednessToSkillEventMap.get(abstractHandedness).registerActions(inputActions);
            const unassigned = [];
            for (const skillEvent of this._unattributedSkillEvents.get(abstractHandedness)) {
                if (this._inputHandednessToSkillEventMap.get(abstractHandedness).AreActionsAvailable(skillEvent.bindings)) {
                    this._inputHandednessToSkillEventMap.get(abstractHandedness).addSkillEvent(skillEvent.bindings, skillEvent);
                    skillEvent.onRegisterInput(input);
                }
                else {
                    //console.warn("Cannot Select SkillEvent because asked bindings are not available", skillEvent, input)
                    unassigned.push(skillEvent);
                }
            }
            this._unattributedSkillEvents.set(abstractHandedness, unassigned);
        }
        /** @internal */
        _deregisterAvailableActions(input, handedness) {
            this._unattributedSkillEvents.set(handedness, this._unattributedSkillEvents.get(handedness).concat(this._inputHandednessToSkillEventMap.get(handedness).deRegisterActions(input.getAvailableInputs(), input)));
        }
    }
    exports.Skill = Skill;
});
