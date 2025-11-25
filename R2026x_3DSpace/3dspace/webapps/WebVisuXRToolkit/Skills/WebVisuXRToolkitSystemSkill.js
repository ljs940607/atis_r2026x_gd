/// <amd-module name="DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSystemSkill"/>
define("DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSystemSkill", ["require", "exports", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkill", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils"], function (require, exports, WebVisuXRToolkitSkill_1, WebVisuXRToolkitSkillsUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemSkill = void 0;
    /*
        This class is equivalent to Skill but differs in the fact that the SkillEvents can cancel some inputs for the classic Skills
    */
    class SystemSkill extends WebVisuXRToolkitSkill_1.Skill {
        constructor(name, SkillEventList, skillInfo) {
            super(name, "", SkillEventList);
            this._inputHandednessToSkillEventMap = new Map();
            this._activeSkillEventMap = new Map();
            this._skillInfo = skillInfo;
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._inputHandednessToSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
            this._activeSkillEventMap.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new WebVisuXRToolkitSkillsUtils_1.CompositeMap());
        }
        get skillInfo() {
            return this._skillInfo;
        }
        _onActionActivate(abstractHandedness, input, actions) {
            const SystemSkillUsedAction = new Set();
            const skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(actions);
            for (const skillEvent of skillEvents) {
                const systemSkillActions = skillEvent.onActivate(input);
                for (const action of systemSkillActions) {
                    SystemSkillUsedAction.add(action);
                }
            }
            return SystemSkillUsedAction;
        }
        _onActionActivateBegin(abstractHandedness, input, actions, startedAction, restrictiveSet) {
            const skillEvents = this._inputHandednessToSkillEventMap.get(abstractHandedness).get(actions);
            const SystemSkillUsedAction = new Set();
            for (const skillEvent of skillEvents) {
                const currently_active_skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(skillEvent.bindings);
                for (const currently_active of currently_active_skillEvents) // Check if the new input combination cancels a previous skillEvent that used only part of the inputs
                 {
                    if (skillEvent.bindings.size > currently_active.bindings.size) {
                        for (const skillEventInput of currently_active.bindings) {
                            if (skillEventInput != startedAction) {
                                currently_active.onActivateEnd(input, startedAction);
                                this._activeSkillEventMap.get(abstractHandedness).delete(skillEvent.bindings);
                            }
                        }
                    }
                }
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === startedAction) {
                        const systemSkillActions = skillEvent.onActivateBegin(input, startedAction);
                        for (const action of systemSkillActions) {
                            SystemSkillUsedAction.add(action);
                        }
                        this._activeSkillEventMap.get(abstractHandedness).addSkillEvent(skillEvent.bindings, skillEvent);
                        break;
                    }
                }
            }
            return SystemSkillUsedAction;
        }
        _onActionActivateEnd(abstractHandedness, input, actions, terminatedAction) {
            const SystemSkillUsedAction = new Set();
            const skillEvents = this._activeSkillEventMap.get(abstractHandedness).get(actions);
            for (const skillEvent of skillEvents) {
                for (const skillEventInput of skillEvent.bindings) {
                    if (skillEventInput === terminatedAction) {
                        const systemSkillActions = skillEvent.onActivateEnd(input, terminatedAction);
                        for (const action of systemSkillActions) {
                            SystemSkillUsedAction.add(action);
                        }
                        // Remove skillEvent from the list of curretrnyl activated skillevents after onActivatedEnd called
                        this._activeSkillEventMap.get(abstractHandedness).delete(skillEvent.bindings);
                        break;
                    }
                }
            }
            return SystemSkillUsedAction;
        }
    }
    exports.SystemSkill = SystemSkill;
});
