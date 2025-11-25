/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIHandMenu"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIHandMenu", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLNode", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIWindowManager", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/Visualization/ThreeJS_DS", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkit"], function (require, exports, HTMLNode_1, WebVisuXRToolkitUIWindowManager_1, WebVisuXRToolkitConfigManager, THREE, WebappsUtils_1, WebVisuXRToolkitUIEventController_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandMenu = void 0;
    function camelToTitleCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
            .replace(/^./, match => match.toUpperCase()); // Capitalize first letter
    }
    class HandMenu extends HTMLNode_1.HTMLNode {
        constructor(domParent, skillsManager, intersectables) {
            const skills = skillsManager.listSkills();
            const handMenuStyles = `
        
        .hand-menu-title {
            background-color: #464646;
            color: #F5F5F5;
            border: none;
            font-size: 3em;
            height: 1cm;
            width: 16.7cm;
            display: flex;
            align-items: center;
            padding: 0.3cm;
        }

        /* Icon on the far left */
        .hand-menu-title img {
            height: 100%; /* or set a fixed px size if needed */
            margin: 0.5em;
        }
        /* Icon on the far left */
        .hand-menu-title .loaded-img {
            display: none;
        }

        /* Label container fills remaining space and centers content */
        .hand-menu-title label {
            flex: 1;
            text-align: center;
            margin-right: 1em; /* buffer space so it's visually centered despite the icon */
        }
        .hand-menu {
            display: flex;
            justify-content: space-evenly;  
            flex-direction: column;
            align-items: center;
            background-color: #464646;
            padding: 1em;
            width: 75px;
        }

        .hand-menu-button {
            background-color: #2a2a2a;
            border: none;
            padding: 10px;
            border-radius: 1.2cm;
            cursor: pointer;
            margin: 5px 0;
            width: 2cm;
            height: 2cm;
            display: none;
        }
        /* Hover state */
        .hand-menu-button.hover {
            background-color: #3e3e3e;
        }
       
        /* Activated state */
        .hand-menu-button.active {
            background-color: #00A0FF;
        }

        .hand-menu-button.active.hover {
            background-color: #00B4FF;
        }

        .hand-menu-button-icon{
            width: 100%;
            height 100%;
        }
        `;
            // Create a <style> element to hold the CSS
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(handMenuStyles));
            domParent.appendChild(styleElement);
            // Creating img elements to load the icon state images before runtime
            const pinActive = document.createElement("img");
            pinActive.className = "loaded-img";
            pinActive.crossOrigin = 'anonymous';
            pinActive.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_active_colored.png");
            const pinPassive = document.createElement("img");
            pinPassive.className = "loaded-img";
            pinPassive.crossOrigin = 'anonymous';
            pinPassive.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_active.png");
            // Currently not used 
            const pinInactive = document.createElement("img");
            pinInactive.className = "loaded-img";
            pinInactive.crossOrigin = 'anonymous';
            pinInactive.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_inactive.png");
            // Settings Bar
            const handMenuSettingsBar = document.createElement("div");
            handMenuSettingsBar.className = "hand-menu";
            domParent.appendChild(handMenuSettingsBar);
            // Header
            const headerDiv = document.createElement("div");
            headerDiv.className = "hand-menu-title";
            headerDiv.appendChild(pinActive);
            headerDiv.appendChild(pinPassive);
            headerDiv.appendChild(pinInactive);
            const pinIcon = document.createElement("img");
            pinIcon.crossOrigin = 'anonymous';
            pinIcon.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_active.png");
            pinIcon.onclick = (e => {
                if (this._hand_menu_pinned) {
                    pinIcon.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_active.png");
                    this._hand_menu_pinned = false;
                }
                else {
                    pinIcon.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_icon_pin_active_colored.png");
                    this._hand_menu_pinned = true;
                }
            });
            headerDiv.appendChild(pinIcon);
            const headerLabel = document.createElement("label");
            headerLabel.innerText = NLS.HandMenuName;
            headerDiv.appendChild(headerLabel);
            domParent.appendChild(headerDiv);
            const _skills_with_windows = new Set();
            for (const skill of skills.skillList) {
                const infos = WebVisuXRToolkitConfigManager.instance.getSkillInfos(skill.name);
                if (infos && (infos.settings || infos.handMenuFunctions)) {
                    const nameList = document.createElement("ul");
                    nameList.id = "nameList";
                    nameList.className = "list";
                    let hasSomethingToDisplay = false;
                    if (infos.settings) {
                        const numValues = infos.settings.listNumericalValues();
                        for (const [name, val] of numValues) {
                            if (name[0] !== '_') // We do not display private settings
                             {
                                const listItem = document.createElement("li");
                                const label = document.createElement("span");
                                label.textContent = `${camelToTitleCase(name)}: `;
                                const slider = document.createElement("input");
                                slider.type = "range";
                                slider.min = val.min.toString();
                                slider.max = val.max.toString();
                                slider.step = val.step.toString();
                                slider.setAttribute("value", val.current.toString());
                                slider.addEventListener("input", () => {
                                    infos.settings?.setNumericalValue(name, Number(slider.value));
                                });
                                listItem.appendChild(label);
                                listItem.appendChild(slider);
                                nameList.appendChild(listItem);
                                hasSomethingToDisplay = true;
                                _skills_with_windows.add(skill.name);
                            }
                        }
                        const boolvalues = infos.settings.listBooleanValues();
                        for (const [name, val] of boolvalues) {
                            if (name[0] !== '_') // We do not display private settings
                             {
                                const listItem = document.createElement("li");
                                const label = document.createElement("label"); // Use a label to associate text with the checkbox
                                label.style.display = "flex"; // Align items properly
                                label.style.alignItems = "center";
                                label.style.cursor = "pointer"; // Make it clear it's clickable
                                const checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.checked = val;
                                checkbox.addEventListener("change", () => {
                                    infos.settings?.setBooleanValue(name, checkbox.checked);
                                });
                                const text = document.createElement("span");
                                text.textContent = ` ${camelToTitleCase(name)}`; // Add a space for better spacing
                                label.appendChild(checkbox);
                                label.appendChild(text);
                                listItem.appendChild(label);
                                nameList.appendChild(listItem);
                                hasSomethingToDisplay = true;
                                _skills_with_windows.add(skill.name);
                            }
                        }
                        const stringValues = infos.settings.listStringValues();
                        for (const [name, val] of stringValues) {
                            if (name[0] !== '_') // We do not display private settings
                             {
                                const listItem = document.createElement("li");
                                const label = document.createElement("span");
                                label.textContent = `${camelToTitleCase(name)} `;
                                listItem.appendChild(label);
                                const optionsContainer = document.createElement("div");
                                val.values.forEach(choice => {
                                    const optionLabel = document.createElement("label");
                                    const radio = document.createElement("input");
                                    radio.type = "radio";
                                    radio.name = name; // Grouping radio buttons
                                    radio.value = choice;
                                    if (choice === val.current) {
                                        radio.checked = true;
                                        optionLabel.classList.add("selected");
                                    }
                                    radio.addEventListener("change", () => {
                                        const allLabels = domParent.querySelectorAll(`.window-container input[name="${name}"]`);
                                        allLabels.forEach(input => input.parentElement.classList.remove("selected"));
                                        optionLabel.classList.add("selected");
                                        infos.settings?.setStringValue(name, choice);
                                    });
                                    const textSpan = document.createElement("span");
                                    textSpan.textContent = choice; // Add text inside button
                                    optionLabel.appendChild(textSpan); // Text inside button
                                    optionLabel.appendChild(radio);
                                    optionsContainer.appendChild(optionLabel);
                                });
                                listItem.appendChild(optionsContainer);
                                nameList.appendChild(listItem);
                                hasSomethingToDisplay = true;
                                _skills_with_windows.add(skill.name);
                            }
                        }
                    }
                    if (infos.handMenuFunctions) {
                        for (const [name, func] of infos.handMenuFunctions) {
                            const listItem = document.createElement("li");
                            const button = document.createElement("button");
                            button.innerText = name;
                            button.onclick = () => func();
                            listItem.appendChild(button);
                            nameList.appendChild(listItem);
                            hasSomethingToDisplay = true;
                            _skills_with_windows.add(skill.name);
                        }
                    }
                    if (hasSomethingToDisplay) {
                        const dialogWindow = document.createElement("div");
                        dialogWindow.id = skill.name + "_DialogWindow";
                        //domParent.appendChild(dialogWindow);
                        dialogWindow.appendChild(nameList);
                        WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.createWindow(domParent, skill.name, dialogWindow).setVisibility(false);
                        const button = document.createElement("button");
                        button.className = "hand-menu-button";
                        const img = document.createElement("img");
                        img.className = "hand-menu-button-icon";
                        img.crossOrigin = 'anonymous';
                        img.src = skill.icon;
                        img.alt = `Icon for ${skill.name}`;
                        button.appendChild(img);
                        handMenuSettingsBar.appendChild(button);
                        button.onmouseenter = (e => {
                            if (!button.classList.contains("hover")) {
                                button.classList.add("hover");
                            }
                        });
                        button.onmouseleave = (e => {
                            if (button.classList.contains("hover")) {
                                button.classList.remove("hover");
                            }
                        });
                        button.onclick = (e => {
                            // Deactivate previous window and button if one exists
                            if (this._currently_shown_window) {
                                const { window: prevWindow, button: prevButton } = this._currently_shown_window;
                                prevButton.classList.remove("active");
                                prevWindow.setVisibility(false);
                            }
                            const window = WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.getWindow(skill.name);
                            if (window.parents.length > 0) {
                                window.parents[0].removeChild(window);
                            }
                            this.add(window);
                            window.displayHeader(false);
                            if (!this._currently_shown_window || this._currently_shown_window.window !== window) {
                                window.setVisibility(true);
                            }
                            window.waitForTextureRefreshed().then(() => {
                                const windowWidth = window.width * 2;
                                const windowHeight = window.height * 2;
                                const windowWidthOffset = handMenuSettingsBarNode.width + (windowWidth - this.headerWidth) * 0.50;
                                const windowHeightOffset = (this.headerHeight + windowHeight) * 0.5 + 10;
                                const widthGap = this.headerWidth - windowWidth - handMenuSettingsBarNode.width;
                                const mat = new THREE.Matrix4()
                                    .translate(new THREE.Vector3(-windowWidthOffset - widthGap, 0, -windowHeightOffset))
                                    .scale(new THREE.Vector3(2, 2, 2));
                                window.setMatrix(mat);
                            });
                            // Activate current button
                            if (window.isVisible()) {
                                button.classList.add("active");
                                headerLabel.innerText = skill.name;
                                const currentWindow = { window, button };
                                this._currently_shown_window = currentWindow;
                            }
                            else {
                                button.classList.remove("active");
                                this._currently_shown_window?.window.setVisibility(false);
                                this.empty_currently_shown_window();
                                headerLabel.innerText = NLS.HandMenuName;
                            }
                        });
                        // Update hand menu buttons & update header and window positioning
                        WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.on(WebVisuXRToolkitUIEventController_1.QMEvents.QMNewSkillSelected, (activeSkills) => {
                            const data = activeSkills.detail.selectedSkills;
                            if (!(data instanceof Set))
                                return;
                            const skillIsSelected = data.has(skill.name);
                            const window = WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.getWindow(skill.name);
                            if (skillIsSelected) {
                                button.style.display = "inline-block";
                            }
                            else {
                                button.style.display = "none";
                                button.classList.remove("active");
                                if (window === this.currently_shown_window) {
                                    this._currently_shown_window?.window.setVisibility(false);
                                    this.empty_currently_shown_window();
                                    headerLabel.innerText = NLS.HandMenuName;
                                }
                            }
                            let anySkillWithWindow = false;
                            for (let s of data) {
                                if (_skills_with_windows.has(s)) {
                                    anySkillWithWindow = true;
                                    break;
                                }
                            }
                            this._any_settings_to_display = anySkillWithWindow;
                            if (anySkillWithWindow) {
                                this.waitForTextureRefreshed().then(() => {
                                    const widthOffset = (this.headerWidth - handMenuSettingsBarNode.width) * 0.5;
                                    const heightOffset = (handMenuSettingsBarNode.height + this.headerHeight) * 0.5 + 10;
                                    const handMenuSettingsBarMat = new THREE.Matrix4().translate(new THREE.Vector3(widthOffset, 0, -heightOffset));
                                    handMenuSettingsBarNode.setMatrix(handMenuSettingsBarMat);
                                    if (this.currently_shown_window) {
                                        const currentWindow = this.currently_shown_window;
                                        const windowWidth = currentWindow.width * 2;
                                        const windowHeight = currentWindow.height * 2;
                                        const windowWidthOffset = handMenuSettingsBarNode.width + (windowWidth - this.headerWidth) * 0.50;
                                        const windowHeightOffset = (this.headerHeight + windowHeight) * 0.5 + 10;
                                        const widthGap = this.headerWidth - windowWidth - handMenuSettingsBarNode.width;
                                        const mat = new THREE.Matrix4()
                                            .translate(new THREE.Vector3(-windowWidthOffset - widthGap, 0, -windowHeightOffset))
                                            .scale(new THREE.Vector3(2, 2, 2));
                                        currentWindow.setMatrix(mat);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            super(headerDiv, "handMenu", true, false);
            this._hand_menu_pinned = false;
            this._currently_shown_window = null;
            this._any_settings_to_display = false;
            this.headerWidth = 170; // header width is static and around 170mm
            this.headerHeight = 13; // header height is static and around 13mm
            this.setVisibility(false);
            const handMenuSettingsBarNode = new HTMLNode_1.HTMLNode(handMenuSettingsBar, "handMenuSettingsBar", true, false);
            const widthOffset = (this.headerWidth - handMenuSettingsBarNode.width) * 0.5;
            const heightOffset = (handMenuSettingsBarNode.height + this.headerHeight) * 0.5 + 10;
            const handMenuSettingsBarMat = new THREE.Matrix4().translate(new THREE.Vector3(widthOffset, 0, -heightOffset));
            handMenuSettingsBarNode.setMatrix(handMenuSettingsBarMat);
            intersectables.push(handMenuSettingsBarNode);
            handMenuSettingsBarNode.waitForTextureRefreshed().then(() => {
                super.addChild(handMenuSettingsBarNode);
            });
        }
        anySettingsToDisplay() {
            return this._any_settings_to_display;
        }
        get currently_shown_window() {
            return this._currently_shown_window?.window;
        }
        empty_currently_shown_window() {
            this._currently_shown_window = null;
        }
        isHandMenuPinned() {
            return this._hand_menu_pinned;
        }
    }
    exports.HandMenu = HandMenu;
});
