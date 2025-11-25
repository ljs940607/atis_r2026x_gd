/// <amd-module name="DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsManager"/>
define("DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsManager", ["require", "exports", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitUIInteraction", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSystemSkill", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitHandMenuInteraction", "DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitQuickMenuInteraction", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController"], function (require, exports, WebVisuXRToolkitInput_1, WebVisuXRToolkitUIInteraction_1, WebVisuXRToolkitSystemSkill_1, WebVisuXRToolkitSkillsUtils_1, WebVisuXRToolkitConfigManager, WebVisuXRToolkitHandMenuInteraction_1, WebVisuXRToolkitQuickMenuInteraction_1, WebVisuXRToolkitUIEventController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitSkillsManager = void 0;
    /**
     * The Skills Manager has the important of taking care of the life cycle of the different skills taking into account which controllers are available
     * It can activate or deactivate any skills according to which controller is currently connnected and what are its inputs
     */
    class WebVisuXRToolkitSkillsManager {
        constructor(skills, currentState) {
            this._loadedSkills = new Map();
            this._selectedSkills = new Map();
            this._chosenSkillsName = new Set();
            this._systemSkillList = [];
            this._currentState = currentState;
            this._primaryHandedness = WebVisuXRToolkitConfigManager.instance.settings.get("IsRightHanded") ? WebVisuXRToolkitInput_1.InputHandedness.Right : WebVisuXRToolkitInput_1.InputHandedness.Left;
            this._selectedSkills.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary, new Set());
            this._selectedSkills.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary, new Set());
            this._selectedSkills.set(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None, new Set());
            if (skills) {
                for (const skill of skills) {
                    this.loadSkill(skill);
                }
            }
            const UIInteractionSkillEvents = new Array();
            UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.ControllerUIInteraction());
            UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.HandUIInteraction());
            if (WebVisuXRToolkitConfigManager.instance.settings.get("EnableQuickMenu")) {
                UIInteractionSkillEvents.push(new WebVisuXRToolkitQuickMenuInteraction_1.QuickMenuInteraction());
                UIInteractionSkillEvents.push(new WebVisuXRToolkitQuickMenuInteraction_1.HandQuickMenuInteraction());
            }
            if (WebVisuXRToolkitConfigManager.instance.settings.get("EnableFunctionMenu")) {
                UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.ToggleFunctionMenuVisiblity());
                UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.HandToggleFunctionMenuVisiblity());
                UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.ControllerUIInteractionLaser());
                UIInteractionSkillEvents.push(new WebVisuXRToolkitUIInteraction_1.HandUIInteractionLaser());
            }
            this._systemSkillList.push(new WebVisuXRToolkitSystemSkill_1.SystemSkill("UIInteraction", UIInteractionSkillEvents));
            const hand_menu_skillEvents = new Array(new WebVisuXRToolkitHandMenuInteraction_1.HandMenuActivation(), new WebVisuXRToolkitHandMenuInteraction_1.HandMenuActivationOnHand());
            if (WebVisuXRToolkitConfigManager.instance.settings.get("EnableHandMenuGrabbableWindows")) {
                hand_menu_skillEvents.push(new WebVisuXRToolkitHandMenuInteraction_1.HandMenuGrabWindow(), new WebVisuXRToolkitHandMenuInteraction_1.HandMenuHoverWindow());
            }
            this._systemSkillList.push(new WebVisuXRToolkitSystemSkill_1.SystemSkill("Hand Menu", hand_menu_skillEvents));
            for (const skill of WebVisuXRToolkitConfigManager.instance.settings.get("DefaultSkills")) {
                this._selectSkill(skill);
            }
        }
        updateCurrentState(currentState) {
            this._currentState = currentState;
        }
        loadSkill(skill) {
            this._loadedSkills.set(skill.name, skill);
        }
        unLoadSkill(skillName) {
            this._loadedSkills.delete(skillName);
        }
        listSkills(inputs) {
            const selectableSkills = new Set();
            if (inputs) {
                for (const input of inputs) {
                    const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                        ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                        : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
                    const availableInputs = input.getAvailableInputs();
                    const otherState = this._currentState === WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive ? WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality : WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive;
                    availableInputs.delete(otherState);
                    for (const skill of this._loadedSkills.values()) {
                        if (skill.isInputCompatibleWith(availableInputs, abstractHandedness)) {
                            selectableSkills.add(skill.name);
                        }
                    }
                }
            }
            return {
                "primary_handedness": this._selectedSkills.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary),
                "secondary_handedness": this._selectedSkills.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary),
                "no_handedness": this._selectedSkills.get(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None),
                "skillList": new Set(this._loadedSkills.values()),
                "skillNamesList": new Set(this._loadedSkills.keys()),
                "chosenSkillsName": this._chosenSkillsName,
                "selectableSkills": selectableSkills,
            };
        }
        getPrimaryHandedness() {
            return this._primaryHandedness;
        }
        selectSkillsPerHandedness(abstractHandedness) {
            const relevantSelectedSkills = this._selectedSkills.get(abstractHandedness);
            if (!relevantSelectedSkills) {
                console.error("error here, can't get relevant selected skills");
                return;
            }
            relevantSelectedSkills.clear();
            for (const skillName of this._chosenSkillsName) {
                if (skillName === undefined || skillName === null || skillName === "") {
                    console.error("called selectSkill() with an empty or null string in the array");
                }
                else if (!this._loadedSkills.has(skillName)) {
                    let skillsNameList = "";
                    for (const [skillName, _] of this._loadedSkills) {
                        skillsNameList += skillName + ", ";
                    }
                    console.error("Cannot select the skill " + skillName + " because it is not in the list of available skills: [" + skillsNameList + "]");
                }
                else if (this._loadedSkills.get(skillName).hasSkillEventHandedness(abstractHandedness)) {
                    relevantSelectedSkills.add(skillName);
                }
            }
        }
        _clearSelectedSkills(inputs) {
            for (const skill of this._chosenSkillsName) {
                this._deSelectSkill(skill, inputs);
            }
        }
        _selectSkill(skillName, inputs) {
            if (skillName === undefined || skillName === null || skillName == "") {
                console.error("called _selectSkill() with an undefined or null string");
                return;
            }
            const notCompatibleSkills = inputs ? this.computeNotCompatibleSkillsWhenSelectingNew(skillName, inputs) : new Map();
            //console.log("Selecting skill", skillName, notCompatibleSkills, inputs)
            for (const notCompatible of notCompatibleSkills) {
                this._deSelectSkill(notCompatible[0].name, inputs);
            }
            this._chosenSkillsName.add(skillName);
            const selectedSkill = this._loadedSkills.get(skillName);
            if (selectedSkill) // Registering SkillEvents
             {
                if (inputs) {
                    for (const input of inputs) {
                        const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                            ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                            : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
                        selectedSkill._registerAvailableActions(input.getAvailableInputs(), abstractHandedness, input);
                        for (const action of input.activatedActions) {
                            selectedSkill._onActionActivateBegin(abstractHandedness, input, input.activatedActions, action);
                        }
                    }
                }
            }
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary);
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None);
            const currently_selected_skills = this.listSkills();
            const selectedSkills = new Set([
                ...(currently_selected_skills.no_handedness ?? []),
                ...(currently_selected_skills.primary_handedness ?? []),
                ...(currently_selected_skills.secondary_handedness ?? [])
            ]);
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.emit(WebVisuXRToolkitUIEventController_1.QMEvents.QMNewSkillSelected, { selectedSkills });
        }
        _deSelectSkill(skillName, inputs) {
            if (skillName === undefined || skillName === null || skillName == "") {
                console.error("called _deSelectSkill() with an undefined or null string");
                return;
            }
            this._chosenSkillsName.delete(skillName);
            //console.log("Removing", skillName)
            const deSelectedSkill = this._loadedSkills.get(skillName);
            if (deSelectedSkill) // Deregistering SkillEvents
             {
                if (inputs) {
                    for (const input of inputs) {
                        const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                            ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                            : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
                        deSelectedSkill._deregisterAvailableActions(input, abstractHandedness);
                    }
                }
            }
            else {
                console.log("Deselected " + skillName + " that is non existing");
            }
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary);
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            this.selectSkillsPerHandedness(WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None);
            const currently_selected_skills = this.listSkills();
            const selectedSkills = new Set([
                ...(currently_selected_skills.no_handedness ?? []),
                ...(currently_selected_skills.primary_handedness ?? []),
                ...(currently_selected_skills.secondary_handedness ?? [])
            ]);
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.emit(WebVisuXRToolkitUIEventController_1.QMEvents.QMNewSkillSelected, { selectedSkills });
        }
        pruneSelectedSkills(inputs) {
            const skillsLostCompatibility = new Set();
            for (const input of inputs) {
                const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                    ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                    : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
                for (const alreadySelectedSkillName of this._selectedSkills.get(abstractHandedness)) {
                    const alreadySelectedSkill = this._loadedSkills.get(alreadySelectedSkillName);
                    if (alreadySelectedSkill && !skillsLostCompatibility.has(alreadySelectedSkillName)) {
                        for (const otherSkillName of this._selectedSkills.get(abstractHandedness)) {
                            const otherSkill = this._loadedSkills.get(otherSkillName);
                            if (otherSkill && !skillsLostCompatibility.has(otherSkillName)) {
                                if (otherSkillName !== alreadySelectedSkillName) {
                                    const res = alreadySelectedSkill._isCompatibleWith(otherSkill, { abstractHandedness: abstractHandedness, inputs_actions: input.getAvailableInputs() });
                                    if (res) {
                                        console.log("removing", otherSkillName, "because of", alreadySelectedSkillName);
                                        skillsLostCompatibility.add(otherSkillName);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (const lostSkill of skillsLostCompatibility) {
                this._deSelectSkill(lostSkill, inputs);
            }
        }
        computeNotCompatibleSkillsWhenSelectingNew(otherSkill, inputs) {
            const newSkill = this._loadedSkills.get(otherSkill);
            const skillsLostCompatibility = new Map();
            if (newSkill) {
                if (inputs) {
                    for (const input of inputs) {
                        const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                            ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                            : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
                        for (const alreadySelectedSkillName of this._selectedSkills.get(abstractHandedness)) {
                            const alreadySelectedSkill = this._loadedSkills.get(alreadySelectedSkillName);
                            if (otherSkill !== alreadySelectedSkillName && alreadySelectedSkill) {
                                const res = alreadySelectedSkill._isCompatibleWith(newSkill, { abstractHandedness: abstractHandedness, inputs_actions: input.getAvailableInputs() });
                                if (res) {
                                    skillsLostCompatibility.set(alreadySelectedSkill, { handedness: abstractHandedness, action: res[0] });
                                }
                            }
                        }
                    }
                }
                else {
                    for (const alreadySelectedSkillName of this._chosenSkillsName) {
                        const alreadySelectedSkill = this._loadedSkills.get(alreadySelectedSkillName);
                        if (otherSkill !== alreadySelectedSkillName && alreadySelectedSkill) {
                            const res = alreadySelectedSkill._isCompatibleWith(newSkill);
                            if (res) {
                                skillsLostCompatibility.set(alreadySelectedSkill, { handedness: res[1], action: res[0] });
                            }
                        }
                    }
                }
            }
            else {
                console.error("you tried to add a non existant skill", otherSkill);
            }
            return skillsLostCompatibility;
        }
        /** @internal */
        _declareAvailableActions(input) {
            const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            for (const skillName of this._chosenSkillsName) {
                const skill = this._loadedSkills.get(skillName);
                if (skill) {
                    skill._registerAvailableActions(input.getAvailableInputs(), abstractHandedness, input);
                }
                else {
                    console.error("error finding", skillName);
                }
            }
            for (const systemSkill of this._systemSkillList) {
                systemSkill._registerAvailableActions(input.getAvailableInputs(), abstractHandedness, input);
            }
        }
        /** @internal */
        _declareUnavailableActions(input) {
            const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            for (const systemSkill of this._systemSkillList) {
                systemSkill._deregisterAvailableActions(input, abstractHandedness);
            }
            for (const [_, skill] of this._loadedSkills) {
                skill._deregisterAvailableActions(input, abstractHandedness);
            }
        }
        /*  * Function is called once per frame
            * First we update the activated actions with every input that has been deactivated or activated
            * Then we Start and End new SkillEvents
            * Then we handle all curently activated skills */
        /** @internal */
        _updateAction(input) {
            for (const startedAction of input.startedActions) {
                input.activatedActions.add(startedAction);
            }
            for (const endedAction of input.endedActions) {
                input.activatedActions.delete(endedAction);
            }
            this.flushStartedActions(input);
            const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            const selectedSkills = this._selectedSkills.get(abstractHandedness);
            if (!selectedSkills) {
                console.error("Selected skills handedness failure");
                return;
            }
            const tmpSystemSkillUsedInputs = new Set();
            for (const systemSkill of this._systemSkillList) {
                const tmp = systemSkill._onActionActivate(abstractHandedness, input, input.activatedActions);
                for (const action of tmp.values()) {
                    tmpSystemSkillUsedInputs.add(action);
                }
            }
            for (const tmp of tmpSystemSkillUsedInputs) {
                if (!input.previoustmpSystemSkillUsedInputs.has(tmp)) {
                    // on stop
                    for (const selectedSkill of selectedSkills) {
                        for (const tempUsedInput of tmpSystemSkillUsedInputs) {
                            this._loadedSkills.get(selectedSkill)._onActionPause(abstractHandedness, input, tmpSystemSkillUsedInputs, tempUsedInput);
                        }
                    }
                }
            }
            for (const previous of input.previoustmpSystemSkillUsedInputs) {
                if (!tmpSystemSkillUsedInputs.has(previous)) {
                    // on restarting
                    for (const selectedSkill of selectedSkills) {
                        const intersect = new Set([...input.activatedActions].filter(i => input.previoustmpSystemSkillUsedInputs.has(i)));
                        this._loadedSkills.get(selectedSkill)._onActionResume(abstractHandedness, input, intersect, previous);
                    }
                }
            }
            input.previoustmpSystemSkillUsedInputs = tmpSystemSkillUsedInputs;
            const actions = new Set();
            for (const action of input.activatedActions) {
                if (!tmpSystemSkillUsedInputs.has(action) && !input.systemSkillUsedInputs.has(action)) {
                    actions.add(action);
                }
            }
            for (const selectedSkill of selectedSkills) {
                this._loadedSkills.get(selectedSkill)._onActionActivate(abstractHandedness, input, actions);
            }
            this.flushEndedActions(input);
        }
        flushStartedActions(input) {
            const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            const selectedSkills = this._selectedSkills.get(abstractHandedness);
            if (!selectedSkills) {
                console.error("Selected skills handedness failure");
                return;
            }
            for (const startedAction of input.startedActions) {
                for (const systemSkill of this._systemSkillList) {
                    const tmp = systemSkill._onActionActivateBegin(abstractHandedness, input, input.activatedActions, startedAction);
                    for (const action of tmp.values()) {
                        input.systemSkillUsedInputs.add(action);
                    }
                }
                const actions = new Set();
                for (const action of input.activatedActions) {
                    if (!input.systemSkillUsedInputs.has(action)) {
                        actions.add(action);
                    }
                }
                for (const selectedSkill of selectedSkills) {
                    this._loadedSkills.get(selectedSkill)._onActionActivateBegin(abstractHandedness, input, actions, startedAction);
                    if (input.previoustmpSystemSkillUsedInputs.has(startedAction)) // Special case where user click the button the start an action, but the system skill is still using the binding and we need to wait for it to finish
                     {
                        this._loadedSkills.get(selectedSkill)._onActionPause(abstractHandedness, input, actions, startedAction);
                    }
                }
            }
            input.startedActions.clear();
        }
        flushEndedActions(input) {
            const abstractHandedness = input.handedness === WebVisuXRToolkitInput_1.InputHandedness.None
                ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.None
                : (this._primaryHandedness === input.handedness ? WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Primary : WebVisuXRToolkitSkillsUtils_1.AbstractHandedness.Secondary);
            const selectedSkills = this._selectedSkills.get(abstractHandedness);
            if (!selectedSkills) {
                console.error("Selected skills handedness failure");
                return;
            }
            for (const endedAction of input.endedActions) {
                const actions = new Set([...input.activatedActions, ...input.endedActions]); // Here it is important to add the endedAction in order to retrieve the currently active skills event as the action has been removed from the activatedActions set.
                const systemSkillUsedInputs = new Set();
                for (const systemSkill of this._systemSkillList) {
                    const tmp = systemSkill._onActionActivateEnd(abstractHandedness, input, actions, endedAction);
                    for (const action of tmp.values()) {
                        systemSkillUsedInputs.add(action);
                    }
                }
                for (const usedAction of systemSkillUsedInputs) {
                    actions.delete(usedAction);
                }
                for (const selectedSkill of selectedSkills) {
                    this._loadedSkills.get(selectedSkill)._onActionActivateEnd(abstractHandedness, input, actions, endedAction);
                }
                for (const usedInput of systemSkillUsedInputs) {
                    input.systemSkillUsedInputs.delete(usedInput);
                }
            }
            input.endedActions.clear();
        }
    }
    exports.WebVisuXRToolkitSkillsManager = WebVisuXRToolkitSkillsManager;
});
