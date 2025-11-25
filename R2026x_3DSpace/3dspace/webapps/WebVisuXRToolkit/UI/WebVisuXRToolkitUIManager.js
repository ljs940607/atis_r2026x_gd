/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIManager"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIManager", ["require", "exports", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIFunctionMenu", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIQuickMenu", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIWindowManager", "DS/Visualization/Node3D", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIInfoIndicatorFactory", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIHandMenu", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController", "DS/WebVisuXRToolkitUINode/WebVisuXRToolkitUINode", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/Visualization/SceneGraphFactory", "DS/WebVisuXRToolkitUINode/HTMLIcon", "DS/Visualization/ThreeJS_DS"], function (require, exports, WebVisuXRToolkitUIFunctionMenu_1, WebVisuXRToolkitUIQuickMenu_1, WebVisuXRToolkitUIWindowManager_1, Node3D, WebVisuXRToolkitUIInfoIndicatorFactory_1, WebVisuXRToolkitUIHandMenu_1, WebappsUtils_1, WebVisuXRToolkitConfigManager, WebVisuXRToolkitUIEventController_1, WebVisuXRToolkitUINode_1, WebVisuXRToolkit_1, SceneGraphFactoryStatic, HTMLIcon_1, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitUIManager = void 0;
    // const BASE_LASER_LENGTH = 200
    class WebVisuXRToolkitUIManager {
        get domOverlay() {
            return this._domOverlay;
        }
        get domUI() {
            return this._domUI;
        }
        get quickMenu() {
            return this._quickMenu;
        }
        get functionMenu() {
            return this._functionMenu;
        }
        get handMenu() {
            return this._handMenu;
        }
        get UIManagerNode() {
            return this._UIManagerNode;
        }
        get indicatorFactory() {
            return this._indicatorFactory;
        }
        cleanUI() {
            this._UIManagerNode.parents[0].removeChild(this._UIManagerNode);
            this._functionMenu.dispose();
            this._quickMenu.dispose();
            this._handMenu.dispose();
            this._shadowHost.remove();
            this._domOverlay.remove();
            WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.dispose();
        }
        toggleFunctionMenu(force) {
            if (force !== undefined) {
                this._functionMenu.setVisibility(force);
            }
            else {
                this._functionMenu.setVisibility(!this._functionMenu.isVisible());
            }
            if (this._functionMenu.isVisible()) {
                this._UIManagerNode.addChild(this._functionMenu);
                this._functionMenu.recomputeMatrix();
            }
            else {
                this._UIManagerNode.removeChild(this._functionMenu);
            }
        }
        get Intersectables() {
            return this._intersectables;
        }
        anyIntersectibleVisible() {
            return this.Intersectables.some((node) => node.isVisible());
        }
        toggleQuickMenu(force) {
            if (force !== undefined) {
                this._quickMenu.setVisibility(force);
            }
            else {
                this._quickMenu.setVisibility(!this._quickMenu.isVisible());
            }
            if (this._quickMenu.isVisible()) {
                this._UIManagerNode.addChild(this._quickMenu);
            }
            else {
                this._UIManagerNode.removeChild(this._quickMenu);
            }
        }
        hideNoPlanesDetectedImage() {
            if (WebVisuXRToolkitConfigManager.instance.settings.get("DisplayNoPlanesDetectedImage")) {
                this._noPlanesDetected.remove();
                this._NoPlanesDetectedBackground.remove();
            }
        }
        get closingCrossImage() {
            return this._closingCross;
        }
        _update(time, deltaTime, parentNode) {
            parentNode.traverse((node) => {
                if (node instanceof WebVisuXRToolkitUINode_1.UINode) {
                    node.update(time, deltaTime);
                }
            });
        }
        createLaserCube(input) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xd6281c,
                force: true
            });
            const cubeRep = SceneGraphFactoryStatic.createCuboidNode({
                cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
                firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
                secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
                thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
                material: material
            });
            cubeRep.setName("Laser");
            input.userData.UIlaserNode = cubeRep;
            input.userData.UIlaserNode.setVisibility(true);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.UIlaserNode);
            /*
            if (input instanceof WebVisuXRToolkitHand)
            {
                const shoulder_pos = new THREE.Vector3().getPositionFromMatrix(getHeadWorldMatrix()).add(new THREE.Vector3(50, 0, -100));
                const thumb_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("thumb-tip")!.getMatrix())
                const index_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("index-finger-tip")!.getMatrix())
                const mid_pos = thumb_tip.add(index_tip).multiplyScalar(0.5)
                const dir = mid_pos.clone().sub(shoulder_pos)
                input.userData.UIlaserNode.setMatrix(new THREE.Matrix4().lookAt(mid_pos, shoulder_pos.add(dir), new THREE.Vector3(0, 0, 1)).scale(new THREE.Vector3(1, BASE_LASER_LENGTH, 1)))
            }
            */
            input.userData.UIlaserIndicator = new HTMLIcon_1.HTMLIcon((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/vxrt_pick_indicator.png"), this.domUI, undefined, { scale: 0.25 });
            input.userData.UIlaserIndicator.setVisibility(true); // Will be activated with the laser
            input.userData.UIlaserIndicator.setMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(1, 1, 1)));
            this._UIManagerNode.addChild(input.userData.UIlaserIndicator);
        }
        removeLaserNode(input) {
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.UIlaserNode);
            this._UIManagerNode.removeChild(input.userData.UIlaserIndicator);
            input.userData.UIlaserNode = null;
            input.userData.UIlaserIndicator = null;
        }
        constructor(XRObjectsNode, skillsManager, domOverlay, isMixedRealityAvailable, inputManager) {
            this._intersectables = new Array();
            this._UIManagerNode = new Node3D("WebVisuXRUI");
            this._domOverlay = domOverlay;
            this._shadowHost = document.createElement("div");
            this._shadowHost.id = "WebVisuXRToolkit UI";
            document.body.appendChild(this._shadowHost);
            this._domUI = this._shadowHost.attachShadow({ mode: "open" });
            XRObjectsNode.addChild(this._UIManagerNode);
            // Function Menu
            this._functionMenu = new WebVisuXRToolkitUIFunctionMenu_1.FunctionMenu(this._domUI, isMixedRealityAvailable);
            this.toggleFunctionMenu(false);
            this._intersectables.push(this._functionMenu);
            // Quick Menu
            this._quickMenu = new WebVisuXRToolkitUIQuickMenu_1.QuickMenu(skillsManager, this._domUI, inputManager);
            this.toggleQuickMenu(false);
            // Hand Menu
            this._handMenu = new WebVisuXRToolkitUIHandMenu_1.HandMenu(this._domUI, skillsManager, this._intersectables);
            this._intersectables.push(this._handMenu);
            this._indicatorFactory = new WebVisuXRToolkitUIInfoIndicatorFactory_1.WebVisuXRToolkitUIInfoIndicatorFactory(this._domUI);
            // Window
            WebVisuXRToolkitUIWindowManager_1.WebVisuXRToolkitUIWindowManager.instance.getWindows().forEach((window) => {
                this._intersectables.push(window);
            });
            this._closingCross = document.createElement("img");
            this._closingCross.crossOrigin = 'anonymous'; // or 'use-credentials' depending on the server
            this._closingCross.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/function_menu_exit_session.png"); // Replace with your image path
            this._closingCross.style.position = "absolute";
            this._closingCross.style.top = "3rem";
            this._closingCross.style.left = "3rem";
            this._closingCross.style.width = "5rem";
            this._closingCross.style.height = "5rem";
            domOverlay.appendChild(this._closingCross);
            this._noPlanesDetected = document.createElement('img');
            this._noPlanesDetected.crossOrigin = 'anonymous'; // or 'use-credentials' depending on the server
            this._noPlanesDetected.src = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "UI_icons/plane_detection.svg"); // Replace with your image path
            this._noPlanesDetected.style.position = "absolute";
            this._noPlanesDetected.style.left = "25%";
            this._noPlanesDetected.style.top = "50%";
            this._noPlanesDetected.style.width = "50%";
            this._noPlanesDetected.style.transform = "translateY(-50%)";
            this._NoPlanesDetectedBackground = document.createElement("div");
            this._NoPlanesDetectedBackground.style.position = "absolute";
            this._NoPlanesDetectedBackground.style.left = "0";
            this._NoPlanesDetectedBackground.style.top = "0";
            this._NoPlanesDetectedBackground.style.width = "100%";
            this._NoPlanesDetectedBackground.style.height = "100%";
            this._NoPlanesDetectedBackground.style.backgroundColor = "rgba(5, 55, 85, 0.4)";
            this._NoPlanesDetectedBackground.style.zIndex = "-100";
            this._NoPlanesDetectedBackground.style.pointerEvents = "none";
            if (WebVisuXRToolkitConfigManager.instance.settings.get("DisplayNoPlanesDetectedImage")) {
                domOverlay.appendChild(this._noPlanesDetected);
                domOverlay.appendChild(this._NoPlanesDetectedBackground);
            }
            //Handle default skills
            const currently_selected_skills = skillsManager.listSkills();
            const selectedSkills = new Set([
                ...(currently_selected_skills.no_handedness ?? []),
                ...(currently_selected_skills.primary_handedness ?? []),
                ...(currently_selected_skills.secondary_handedness ?? [])
            ]);
            WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.emit(WebVisuXRToolkitUIEventController_1.QMEvents.QMNewSkillSelected, { selectedSkills });
        }
    }
    exports.WebVisuXRToolkitUIManager = WebVisuXRToolkitUIManager;
});
