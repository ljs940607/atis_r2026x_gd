/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIFunctionMenu"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIFunctionMenu", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLNode", "DS/WebappsUtils/WebappsUtils", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/WebVisuXRToolkitUINode/HTMLTooltip", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIWindowManager", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/Selection/CSOManager", "DS/Selection/HSOManager", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers"], function (require, exports, HTMLNode_1, WebappsUtils_1, THREE, WebVisuXRToolkitManager_1, HTMLTooltip_1, WebVisuXRToolkitUIWindowManager_1, NLS, WebVisuXRToolkitConfigManager, CSOManager, HSOManager, WebVisuXRToolkitHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionMenu = void 0;
    class FunctionMenu extends HTMLNode_1.HTMLNode {
        //private _tooltipOwner: Element | null = null; // Used as a result of mouseenter mouseleave missmatch in _traverseAndDispatchEvent()
        get tooltip() {
            return this._tooltip;
        }
        dispose() {
            this._tooltip.dispose();
            super.dispose();
        }
        constructor(domParent, isMixedRealityAvailable) {
            // Your CSS as a string
            const functionMenuStyles = `
            /* Container for the entire function menu */
            .function-menu {
                width: 30cm;
                height: 3cm;
                display: flex;
                background-color: #3c3c3c; /* Default color, mostly for third section */
                overflow: hidden; /* Ensure the content stays within the curved corners */
            }
    
            /* First section - Info section */
            .info-section {
                width: 9cm; /* 30cm total width - 21cm (combined width of 2nd and 3rd sections) */
                background-color: #1b1b1b;
                color: white;
                display: flex;
                align-items: center;
                font-size: 1.2cm;
            }
    
            /* Icon section inside info-section */
            .icon-section {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3cm; /* Width of the icon section */
            }
    
            /* Style for the icon */
            .icon-section img {
                width: calc(3cm - 20px); /* Icon width */
                height: calc(3cm - 20px); /* Icon height */
                margin: 10px; /* Same margin for top, right, bottom, and left */
            }
    
            /* Text section inside info-section */
            .text-section {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-grow: 1;
            }
    
            /* Second and third sections (actions) */
            .action-section {
                width: 10.5cm; /* 21cm total width for both action sections, divided equally */
                background-color: #3c3c3c;
                display: flex;
                align-items: center;
                justify-content: space-around;
            }
    
            /* Divider between second and third sections */
            .divider {
                width: 0.1cm;
                background-color: #6e6e6e;
            }
    
            /* Style for buttons in action sections */
            .action-section button {
                width: 22mm; /* Set button width to 22mm */
                height: 22mm; /* Set button height to 22mm */
                background-color: #1b1b1b; /* Default background color */
                border: none; /* Default border */
                cursor: pointer;
                padding: 0; /* Remove default padding */
                border-radius: 8mm; /* Border-radius */
            }
    
            /* Hover state */
            .action-section button.hover {
                background-color: #292929; /* Hovered background color */
                border: 2px solid #909090; /* Hovered border */
            }
    
            /* Activated state */
            .action-section button.active {
                background-color: #1b1b1b; /* Activated background color */
                border: 1mm solid #0499cd; /* Activated border */
            }
            
            /* Active + Hover state */
            .action-section button.active.hover {
                background-color: #292929;
                border: 2px solid #0499cd;
            }
    
            /* Style for icons inside buttons */
            .action-section button img {
                width: 18mm; /* Adjusted icon size to fit better within 22mm button */
                height: 18mm; /* Adjusted icon size to fit better within 22mm button */
            }
        `;
            // Create a <style> element to hold the CSS
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(functionMenuStyles));
            domParent.appendChild(styleElement);
            // Create the main div for the function menu
            const myDiv = document.createElement("div");
            myDiv.className = "function-menu";
            // Format the time to show only hours and minutes
            const iconPath = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/AppIcon_VXRT.png');
            const iconPath1 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_edge_render.png');
            const iconPath2 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_face_render.png');
            const iconPath3 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_toggle_invisible.png');
            const iconPath4 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_restore_visiblity.png');
            //const iconPath5 = getWebappsAssetUrl("WebVisuXRToolkit", 'UI_icons/vxrt_cmd_skillchooser.png');
            const iconPath6 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_toggle_transparent.png');
            const iconPath7 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/function_menu_exit_session.png');
            const iconPath8 = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/vxrt_cmd_settings.png');
            const updateCurrentTime = () => {
                // Get the current time with hours and minutes
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // Update the span with id "current-time"
                const timeElement = domParent.getElementById("current-time");
                if (timeElement) {
                    timeElement.textContent = currentTime;
                }
            };
            // Synchronize updates with the start of each minute
            const synchronizeClock = () => {
                updateCurrentTime(); // Update immediately
                const now = new Date();
                const millisecondsUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
                setTimeout(() => {
                    updateCurrentTime(); // Ensure it's correct at the next minute
                    setInterval(updateCurrentTime, 60000); // Then update every minute
                }, millisecondsUntilNextMinute);
            };
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Add content to the div
            myDiv.innerHTML = `
            <div class="info-section">
                <div class="icon-section">
                    <img src="${iconPath}">
                </div>
                <div class="text-section">
                    <span id="current-time">${currentTime}</span>
                </div>
            </div>
            <div class="action-section" id="WebVisuXRUI_FM_ActionSection1">
                <button id ="WebVisuXRUI_EdgeRenderToggle" name= ${NLS.FunctionMenuEdgeRender}><img src="${iconPath1}"></button>
                <button id ="WebVisuXRUI_FaceRenderToggle" name= ${NLS.FunctionMenuFaceRender}><img src="${iconPath2}"></button>
                <button id="WebVisuXRUI_MakePickedInvisible" name= ${NLS.FunctionMenuPickedInvisible}><img src="${iconPath3}"></button>
                <button id="WebVisuXRUI_RestorePickedVisibility" name= ${NLS.FunctionMenuRestoreVisibility}"><img src="${iconPath4}"></button>
                ${WebVisuXRToolkitConfigManager.instance.devMode.active ? `<button id="WebVisuXRUI_DisplaySkillsTooltips" name="Display Skills Tooltips"><img src="${iconPath4}"></button>` : ""}
                ${WebVisuXRToolkitConfigManager.instance.devMode.active && isMixedRealityAvailable ? `<button id="WebVisuXRUI_DisplayXRMesh" name="Display XR Mesh"><img src="${iconPath3}"></button>` : ""}
            </div>
            <div class="divider"></div>
            <div class="action-section" id="WebVisuXRUI_FM_ActionSection2">
                ${isMixedRealityAvailable ? `<button id="WebVisuXRUI_TransparencyToggle" name= ${NLS.FunctionMenuImmersiveModeToggle}><img src="${iconPath6}"></button>` : ""}
                <button id="WebVisuXRUI_EndSession" name= ${NLS.FunctionMenuEndSession}><img src="${iconPath7}"></button>
                <button id="WebVisuXRUI_Setting" name= ${NLS.FunctionMenuSettings}><img src="${iconPath8}"></button>
            </div>
            `;
            const buttons = myDiv.querySelectorAll("button");
            const fmButtonDefaultFunctionality = (button) => {
                button.addEventListener("mouseenter", () => {
                    if (!button.classList.contains("hover")) {
                        button.classList.add("hover");
                    }
                    const buttonPosition = this._fm_buttonCenters.get(button).clone(); //HTMLNode space
                    if (buttonPosition) {
                        const up = new THREE.Vector3(0, 0, 1);
                        const distanceToButton = 30;
                        const tooltipPosition = buttonPosition.clone().add(up.multiplyScalar(distanceToButton));
                        const tooltipMatrix = new THREE.Matrix4().setPosition(tooltipPosition);
                        const tooltipText = button.getAttribute("name");
                        if (!tooltipText) {
                            console.error("Button name is not available");
                        }
                        else {
                            //this._tooltipOwner = button;
                            this._tooltip.updateTooltipData(tooltipMatrix, tooltipText);
                            this._tooltip.activateTooltip();
                        }
                    }
                });
                button.addEventListener("mouseleave", () => {
                    if (button.classList.contains("hover")) {
                        button.classList.remove("hover");
                        this._tooltip.deactivateTooltip();
                    }
                });
                button.addEventListener("click", () => {
                    button.classList.toggle("active");
                });
            };
            buttons.forEach((button) => {
                fmButtonDefaultFunctionality(button);
            });
            domParent.appendChild(myDiv);
            if (WebVisuXRToolkitConfigManager.instance.devMode.active) {
                const action_section = domParent.getElementById("WebVisuXRUI_FM_ActionSection2");
                const button = document.createElement("button");
                button.id = "WebVisuXRUI_DialogWindow";
                button.name = "Dialog Window";
                const img = document.createElement("img");
                img.crossOrigin = 'anonymous'; // or 'use-credentials' depending on the server
                img.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", 'UI_icons/VXRT_test7.png');
                button.appendChild(img);
                action_section?.appendChild(button);
                fmButtonDefaultFunctionality(button);
            }
            super(myDiv, "FunctionMenu", true, false);
            this._fm_buttonCenters = new Map(); // Holds button center point in qm.UIBox object space 
            this.setFunctionMenuButtonEvents(domParent, isMixedRealityAvailable);
            this._calculateButtonCenters();
            synchronizeClock();
            if (WebVisuXRToolkitConfigManager.instance.devMode.active) {
                const dialogWindow = this.createDialogWindow(domParent);
                const dialogWindowButton = domParent.getElementById("WebVisuXRUI_DialogWindow");
                dialogWindowButton.addEventListener("click", () => {
                    if (dialogWindow.isVisible()) {
                        dialogWindow.setVisibility(false);
                    }
                    else {
                        dialogWindow.setVisibility(true);
                    }
                });
            }
            // Tooltip
            this._tooltip = new HTMLTooltip_1.HTMLTooltip("", domParent);
            this.addChild(this._tooltip);
        }
        createDialogWindow(domParent) {
            const dialogWindowStyles = `
           .dw-container {
                display: flex;
                flex-direction: column;
                gap: 1em; /* Proportional gap */
                padding: 1em;
                width: 100%; /* Scale with the window */
                height: 100%; /* Scale with the window */
                overflow: auto;
            }

            .dw-label {
                font-weight: bold;
                font-size: 1.2em; /* Scales with parent */
            }

            .dw-button {
                padding: 0.5em 1em; /* Proportional padding */
                font-size: 1em;
            }

            .dw-slider {
                width: 10cm;
                height: 2cm;
            }

            .dw-counter-container {
                display: flex;
                gap: 0.5em;
                align-items: center;
            }

            .dw-counter {
                min-width: 2em;
                text-align: center;
                font-size: 1em; /* Scale with parent */
            }
            
            .dw-checkbox {
                width: 1cm;
                height: 1cm;
            }
            
            .dw-radio {
                width: 1cm;
                height: 1cm;
            }

            .dw-checkbox-container, .dw-radio-container {
                display: flex;
                flex-direction: column;
                gap: 1em;
            }

        `;
            // Create a <style> element to hold the CSS
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(dialogWindowStyles));
            domParent.appendChild(styleElement);
            const dw_innerHTML = `
            <div class="dw-container">
                <div>
                    <label for="dw_toggleButton" class="dw-label">Toggle Button:</label>
                    <button id="dw_toggleButton" class="dw-button">OFF</button>
                </div>
                <div>
                    <label for="dw_counter" class="dw-label">Increment/Decrement:</label>
                    <div class="dw-counter-container">
                        <button id="dw_decrementButton" class="dw-button">-</button>
                        <span id="dw_counter" class="dw-counter">0</span>
                        <button id="dw_incrementButton" class="dw-button">+</button>
                    </div>
                </div>
                 <label for="dw_slider" class="dw-label">Slider:</label>
                <div>
                    <input type="range" id="dw_slider" class="dw-slider" min="0" max="100" value="50">
                </div>
                <span id="dw_sliderValue">50</span>
                <label class="dw-label">Checkbox:</label>
                <div>
                    <div class="dw-checkbox-container">
                        <label><input type="checkbox" id="dw_checkbox1" class = "dw-checkbox"> Option 1</label>
                        <label><input type="checkbox" id="dw_checkbox2" class = "dw-checkbox"> Option 2</label>
                    </div>
                </div>
                <label class="dw-label">Radio Buttons:</label>
                <div>
                    <div class="dw-radio-container">
                        <label><input type="radio" name="dw_radio" value="Option 1" class = "dw-radio"> Option 1</label>
                        <label><input type="radio" name="dw_radio" value="Option 2" class = "dw-radio"> Option 2</label>
                        <label><input type="radio" name="dw_radio" value="Option 3" class = "dw-radio"> Option 3</label>
                    </div>
                </div>
            </div>
        `;
            const window_width = 500; //50cm
            const window_height = (0.5625 * window_width);
            const dialogWindow = WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.createWindow(domParent, "DialogWindow", dw_innerHTML);
            dialogWindow.setVisibility(false);
            const toggleButton = domParent.getElementById("dw_toggleButton");
            toggleButton.addEventListener("click", () => {
                toggleButton.innerText = toggleButton.innerText === "OFF" ? "ON" : "OFF";
            });
            let counter = 0;
            domParent.getElementById("dw_incrementButton").addEventListener("click", () => {
                counter++;
                domParent.getElementById("dw_counter").innerText = counter.toString();
            });
            domParent.getElementById("dw_decrementButton").addEventListener("click", () => {
                counter--;
                domParent.getElementById("dw_counter").innerText = counter.toString();
            });
            const up = new THREE.Vector3(0, 0, 1);
            let fmQuaternion = new THREE.Quaternion();
            let fmPosition = new THREE.Vector3();
            let scale = new THREE.Vector3();
            this.getMatrix().decompose(fmPosition, fmQuaternion, scale);
            up.applyQuaternion(fmQuaternion);
            dialogWindow.setMatrix(new THREE.Matrix4().compose(fmPosition.add(up.multiplyScalar(70 + (window_height * 0.5))), fmQuaternion, scale));
            this.addChild(dialogWindow);
            return dialogWindow;
        }
        setFunctionMenuButtonEvents(domParent, isMixedRealityAvailable) {
            if (isMixedRealityAvailable) {
                const transparancyToggle = domParent.getElementById("WebVisuXRUI_TransparencyToggle");
                transparancyToggle.addEventListener("click", () => {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.setMixedRealityMode(!WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.isMixedRealityActive());
                });
            }
            let allInvisibledObjects = new Array();
            const endSession = domParent.getElementById("WebVisuXRUI_EndSession");
            endSession.addEventListener("click", () => {
                WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.endSession();
            });
            const makePickedInvisible = domParent.getElementById("WebVisuXRUI_MakePickedInvisible");
            makePickedInvisible.addEventListener("click", () => {
                if (makePickedInvisible.classList.contains("active")) {
                    makePickedInvisible.classList.remove("active");
                }
                const objs = CSOManager.get();
                if (objs) {
                    for (const obj of objs) {
                        const parentNode = obj.pathElement.externalPath[obj.pathElement.externalPath.length - 1];
                        parentNode.setVisibility(false);
                        allInvisibledObjects.push(parentNode);
                    }
                    HSOManager.empty();
                    CSOManager.empty();
                }
            });
            const restorePickedVisibility = domParent.getElementById("WebVisuXRUI_RestorePickedVisibility");
            restorePickedVisibility.addEventListener("click", () => {
                if (restorePickedVisibility.classList.contains("active")) {
                    restorePickedVisibility.classList.remove("active");
                }
                for (const part of allInvisibledObjects) {
                    //part.visible = true;
                    part.setVisibility(true);
                }
                allInvisibledObjects = [];
            });
            if (WebVisuXRToolkitConfigManager.instance.devMode.active) {
                const displaySkillsTooltips = domParent.getElementById('WebVisuXRUI_DisplaySkillsTooltips');
                displaySkillsTooltips.addEventListener("click", () => {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.displayIndicators(!WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.isDisplayingIndicators());
                });
                const displayXRMesh = domParent.getElementById('WebVisuXRUI_DisplayXRMesh');
                displayXRMesh?.addEventListener("click", () => {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.displayXRMesh(!WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.isdisplayingXRMesh());
                });
            }
            const edgeRenderToggle = domParent.getElementById("WebVisuXRUI_EdgeRenderToggle");
            edgeRenderToggle.addEventListener("click", () => {
                if (edgeRenderToggle.classList.contains("active")) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.viewer.setRenderMode("@Edge", false);
                }
                else {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.viewer.setRenderMode("@Edge", true);
                }
            });
            const faceRenderToggle = domParent.getElementById("WebVisuXRUI_FaceRenderToggle");
            faceRenderToggle.addEventListener("click", () => {
                if (faceRenderToggle.classList.contains("active")) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.viewer.setRenderMode("Face", false);
                }
                else {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.viewer.setRenderMode("Face", true);
                }
            });
        }
        _calculateButtonCenterUV(button) {
            // Get button and container bounding rectangles
            const buttonRect = button.getBoundingClientRect();
            const containerRect = this.dom.getBoundingClientRect();
            // Calculate the button's center position relative to the container
            const centerX = buttonRect.left + buttonRect.width / 2 - containerRect.left;
            const centerY = buttonRect.top + buttonRect.height / 2 - containerRect.top;
            // Convert to UV coordinates (0.0 to 1.0)
            const uvX = centerX / containerRect.width;
            const uvY = centerY / containerRect.height;
            return new THREE.Vector2(uvX, uvY);
        }
        // Calculates the local positions of the buttons wrt. the FM space
        _calculateButtonCenters() {
            const face = this.UIBox.getBoundingBox().max; // qmBox does not have depth. This gives the upper corner of the face
            const buttons = Array.from(this.dom.querySelectorAll(".action-section button"));
            buttons.forEach(button => {
                const uv = this._calculateButtonCenterUV(button);
                // Convert UV coordinates to a position in 3D space within the same plane
                const buttonPosition = new THREE.Vector3(face.x * uv.x, face.y * uv.y, 0);
                buttonPosition.applyMatrix4(this.UIBox.getMatrix()); //Get position on HtmlNode space
                this._fm_buttonCenters.set(button, buttonPosition);
            });
        }
        recomputeMatrix() {
            const headset_matrix = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.HeadWorldMatrix;
            const headsetPosition = new THREE.Vector3();
            const headsetQuaternion = new THREE.Quaternion();
            headset_matrix.decompose(headsetPosition, headsetQuaternion, new THREE.Vector3());
            const forwardHeadset = new THREE.Vector3(0, 1, 0).applyQuaternion(headsetQuaternion); // Rotate the forward vector by the headset's orientation;
            const distance = 500; // 50 cm
            const uiPosition = headsetPosition.clone().add(forwardHeadset.multiplyScalar(distance));
            uiPosition.add(new THREE.Vector3(0, 0, -(distance * Math.sin((Math.PI / 180) * 15)))); //Put ui 15 degree down
            const forwardUI = forwardHeadset.clone().multiplyScalar(-1);
            const fmMatrix = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(0, 0, 0), forwardUI);
            this.setMatrix(fmMatrix.setPosition(uiPosition));
        }
    }
    exports.FunctionMenu = FunctionMenu;
});
