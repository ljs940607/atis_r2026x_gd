define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIQuickMenu", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLNode", "DS/WebVisuXRToolkitUINode/HTMLTooltip", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController"], function (require, exports, HTMLNode_1, HTMLTooltip_1, THREE, WebVisuXRToolkitUIEventController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuickMenu = void 0;
    class QuickMenu extends HTMLNode_1.HTMLNode {
        get tooltip() {
            return this._tooltip;
        }
        dispose() {
            this._tooltip.dispose();
            super.dispose();
        }
        constructor(skillsManager, domParent, inputManager) {
            const quickMenuStyles = `
        .quick-menu {
            width: 100%;
            height: 8cm;
            display: flex;
            background-color: transparent;
            overflow: hidden;
            border: none;
            justify-content: center;
            align-items: center;
            gap: 5mm;
            padding: 5mm;
        }

        /* Style for buttons in quick-menu */
        .quick-menu button.qm-button {
            width: 26.5mm;
            height: 26.5mm;
            background-color: #3c414c;
            border: none;
            cursor: pointer;
            padding: 0;
            border-radius: 8mm;
            position: relative; /* Positioning to enable tooltip */
            overflow: hidden;
        }

        .quick-menu .qm-button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10mm; /* spacing between main and X button */
        }

        .quick-menu .qm-button-container.invisible {
            display: none;
        }

        .quick-menu button.qm-remove-button {
            width: 10mm;
            height: 10mm;
            background-color: #3c414c;
            border: none;
            border-radius: 5mm;
            cursor: pointer;
            padding: 0;
        }

        /* Hover state */
        .quick-menu button.hover {
            transform: scale(1.2);
            background-color: #51565E;
        }
       
        /* Activated state */
        .quick-menu button.active {
            background-color: #009FDE;
        }

        .quick-menu button.active.hover {
            transform: scale(1.2);
            background-color: #01A9EC;
        }

        .quick-menu button.critical{
            background-color: #AA0A1E;
        }

        .quick-menu button.critical.hover{
            background-color: #B22234;
        }

        .quick-menu button.off{
            background-color: #2F363C
        }

        .quick-menu button.hide{
            visibility: hidden
        }

        /* Style for icons inside buttons */
        .quick-menu button img {
            width: 100%; 
            height: 100%;
        }
        `;
            const buttons = new Map();
            const buttonContainers = new Map();
            // Create a <style> element to hold the CSS
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(quickMenuStyles));
            domParent.appendChild(styleElement);
            // Create the main div for the function menu
            const myDiv = document.createElement("div");
            myDiv.className = "quick-menu";
            const skillList = skillsManager.listSkills().skillList;
            for (const skill of skillList) {
                const qmButtonContainer = document.createElement("div");
                qmButtonContainer.className = "qm-button-container";
                const qmButton = document.createElement("button");
                qmButton.className = "qm-button";
                qmButton.id = skill.name;
                const imgElement = document.createElement("img");
                imgElement.crossOrigin = 'anonymous'; // or 'use-credentials' depending on the server
                imgElement.src = skill.icon;
                qmButton.appendChild(imgElement);
                const disableButton = document.createElement("button");
                disableButton.className = "qm-remove-button";
                disableButton.innerHTML = "X";
                disableButton.classList.add("hide");
                //const imgElement = document.createElement("img");
                qmButtonContainer.appendChild(qmButton);
                qmButtonContainer.appendChild(disableButton);
                qmButton.addEventListener("click", () => {
                    const inputsArray = new Array;
                    const inputs = inputManager.getInputs();
                    if (inputs.left) {
                        inputsArray.push(inputs.left);
                    }
                    if (inputs.right) {
                        inputsArray.push(inputs.right);
                    }
                    for (const input of inputs.others) {
                        inputsArray.push(input);
                    }
                    if (!qmButton.classList.contains("active")) {
                        skillsManager._selectSkill(skill.name, inputsArray);
                    }
                });
                qmButtonContainer.addEventListener("mouseenter", () => {
                    //If skill is active, display deactivate button
                    if (qmButton.classList.contains("active")) {
                        disableButton.classList.remove("hide");
                    }
                });
                qmButtonContainer.addEventListener("mouseleave", () => {
                    //If skill is active, display deactivate button
                    if (qmButton.classList.contains("active")) {
                        disableButton.classList.add("hide");
                    }
                });
                qmButton.addEventListener("mouseenter", () => {
                    if (!qmButton.classList.contains("hover")) {
                        qmButton.classList.add("hover");
                        this._tooltip.setVisibility(true);
                        this.resetCriticalStateButtons();
                        const inputs = inputManager.getInputs();
                        const inputsArray = new Array();
                        if (inputs.left) {
                            inputsArray.push(inputs.left);
                        }
                        if (inputs.right) {
                            inputsArray.push(inputs.right);
                        }
                        for (const other of inputs.others) {
                            inputsArray.push(other);
                        }
                        const incompatibleSkills = skillsManager.computeNotCompatibleSkillsWhenSelectingNew(skill.name, inputsArray);
                        for (const sk of incompatibleSkills) {
                            const butt = buttons.get(sk[0].name);
                            if (butt) {
                                butt.classList.add("critical");
                            }
                        }
                    }
                    const buttonPosition = this._qm_buttonCenters.get(qmButton).clone(); //HTMLNode space
                    if (buttonPosition) {
                        const up = new THREE.Vector3(0, 0, 1);
                        const distanceToButton = 20;
                        const tooltipPosition = buttonPosition.clone().add(up.multiplyScalar(distanceToButton));
                        const tooltipMatrix = new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, 20).add(tooltipPosition));
                        this._tooltip.updateTooltipData(tooltipMatrix, skill.name);
                    }
                });
                qmButton.addEventListener("mouseleave", () => {
                    if (qmButton.classList.contains("hover")) {
                        qmButton.classList.remove("hover");
                    }
                });
                disableButton.addEventListener("click", () => {
                    const inputsArray = new Array;
                    const inputs = inputManager.getInputs();
                    if (inputs.left) {
                        inputsArray.push(inputs.left);
                    }
                    if (inputs.right) {
                        inputsArray.push(inputs.right);
                    }
                    for (const input of inputs.others) {
                        inputsArray.push(input);
                    }
                    if (qmButton.classList.contains("active")) {
                        skillsManager._deSelectSkill(skill.name, inputsArray);
                        if (disableButton.classList.contains("critical")) {
                            disableButton.classList.remove("critical");
                        }
                    }
                    disableButton.classList.add("hide");
                });
                disableButton.addEventListener("mouseenter", () => {
                    if (!disableButton.classList.contains("critical")) {
                        disableButton.classList.add("critical");
                    }
                });
                disableButton.addEventListener("mouseleave", () => {
                    if (disableButton.classList.contains("critical")) {
                        disableButton.classList.remove("critical");
                    }
                });
                myDiv.appendChild(qmButtonContainer);
                buttons.set(skill.name, qmButton);
                buttonContainers.set(skill.name, qmButtonContainer);
            }
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.on(WebVisuXRToolkitUIEventController_1.QMEvents.QMNewSkillSelected, (activeSkills) => {
                const data = activeSkills.detail.selectedSkills;
                if (data instanceof Set) {
                    for (const [skillName, qmButton] of buttons) {
                        if (data.has(skillName)) {
                            if (!qmButton.classList.contains("active")) {
                                qmButton.classList.add("active");
                            }
                        }
                        else {
                            if (qmButton.classList.contains("active")) {
                                qmButton.classList.remove("active");
                            }
                        }
                    }
                }
                this.resetCriticalStateButtons();
            });
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.on(WebVisuXRToolkitUIEventController_1.QMEvents.QMUpdated, (event) => {
                const inputs = event.detail.inputs; // Access the 'input' passed in the event detail
                /*if (!inputs || !(inputs instanceof WebVisuXRToolkitInput))
                {
                    console.log(" On event: ", QMEvents.QMUpdated, " WebVisuXRToolkitInput is not valid");
                    return;
                }*/
                const activeSkillsList = skillsManager.listSkills(inputs).selectableSkills;
                for (const [skillName, qmButton] of buttonContainers) {
                    if (!activeSkillsList.has(skillName)) {
                        qmButton.classList.add("invisible");
                    }
                    else if (qmButton.classList.contains("invisible")) {
                        qmButton.classList.remove("invisible");
                    }
                }
            });
            domParent.appendChild(myDiv);
            super(myDiv, "QuickMenu", true, true);
            this._qm_buttonCenters = new Map(); // Holds button center point in qm.UIBox object space 
            this.setVisibility(false);
            this._qm_buttons = buttons;
            // Tooltip
            this._tooltip = new HTMLTooltip_1.HTMLTooltip("", domParent);
            this._tooltip.setVisibility(false);
            this.addChild(this._tooltip);
        }
        updateQmButtons(inputs) {
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.emit(WebVisuXRToolkitUIEventController_1.QMEvents.QMUpdated, { inputs });
            this._calculateButtonCenters();
            return this._qm_buttonCenters;
        }
        resetCriticalStateButtons() {
            for (const butt of this._qm_buttons.values()) {
                butt.classList.remove("critical");
            }
        }
        // Calculates the local positions of the buttons wrt. the QM space
        _calculateButtonCenters() {
            this._qm_buttonCenters.clear();
            const face = this.UIBox.getBoundingBox().max; // qmBox does not have depth. This gives the upper corner of the face
            const buttons = Array.from(this.dom.querySelectorAll(".quick-menu button"));
            buttons.forEach(button => {
                if (!button.checkVisibility()) // TODO: Doesnt seem like functioning correctly for "visibility" setting of css
                 {
                    return; // Skip hidden buttons
                }
                const buttonRect = button.getBoundingClientRect();
                if (buttonRect.width === 0 || buttonRect.height === 0)
                    return; // Skip zero-sized elements
                const containerRect = this.dom.getBoundingClientRect();
                // Calculate the button's center position relative to the container
                const centerX = buttonRect.left + buttonRect.width / 2 - containerRect.left;
                const centerY = buttonRect.top + buttonRect.height / 2 - containerRect.top;
                // Convert to UV coordinates (0.0 to 1.0)
                const uvX = centerX / containerRect.width;
                const uvY = 1 - (centerY / containerRect.height); //In browser top-left is (0,0) we need to convert y to make it bottom left
                // Convert UV coordinates to a position in 3D space within the same plane
                const buttonPosition = new THREE.Vector3(face.x * uvX, face.y * uvY, 0);
                buttonPosition.applyMatrix4(this.UIBox.getMatrix()); //Get position on HtmlNode space
                this._qm_buttonCenters.set(button, buttonPosition);
            });
        }
    }
    exports.QuickMenu = QuickMenu;
});
