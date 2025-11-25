/// <amd-module name="DS/WebVisuXRToolkit/WebVisuXRToolkit"/>
define("DS/WebVisuXRToolkit/WebVisuXRToolkit", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkill", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitController", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitHand", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitTouchscreen", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", "DS/WebVisuXRToolkitUINode/HTMLTooltip"], function (require, exports, WebVisuXRToolkitManager_1, WebVisuXRToolkitSkill_1, WebVisuXRToolkitSkillsUtils_1, WebVisuXRToolkitInput_1, WebVisuXRToolkitController_1, WebVisuXRToolkitHand_1, WebVisuXRToolkitTouchscreen_1, WebVisuXRToolkitSkillsUtils_2, HTMLTooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLTooltip = exports.SkillSettings = exports.SkillOptions = exports.WebVisuXRToolkitTouchscreen = exports.WebVisuXRToolkitHand = exports.WebVisuXRToolkitController = exports.InputHandedness = exports.InputAction = exports.AbstractHandedness = exports.Skill = void 0;
    exports.getXRNode = getXRNode;
    exports.getXRObjects = getXRObjects;
    exports.getHeadWorldMatrix = getHeadWorldMatrix;
    exports.getHeadMatrix = getHeadMatrix;
    exports.getViewer = getViewer;
    exports.getDomOverlay = getDomOverlay;
    exports.getDeltaTime = getDeltaTime;
    exports.resetInitialXRNodeMatrix = resetInitialXRNodeMatrix;
    exports.endXRSession = endXRSession;
    exports.getXRPlanesMatrices = getXRPlanesMatrices;
    exports.getXRMesh = getXRMesh;
    exports.createLabelIndicator = createLabelIndicator;
    exports.createIconIndicator = createIconIndicator;
    Object.defineProperty(exports, "Skill", { enumerable: true, get: function () { return WebVisuXRToolkitSkill_1.Skill; } });
    Object.defineProperty(exports, "AbstractHandedness", { enumerable: true, get: function () { return WebVisuXRToolkitSkillsUtils_1.AbstractHandedness; } });
    Object.defineProperty(exports, "InputAction", { enumerable: true, get: function () { return WebVisuXRToolkitSkillsUtils_1.InputAction; } });
    Object.defineProperty(exports, "InputHandedness", { enumerable: true, get: function () { return WebVisuXRToolkitInput_1.InputHandedness; } });
    Object.defineProperty(exports, "WebVisuXRToolkitController", { enumerable: true, get: function () { return WebVisuXRToolkitController_1.WebVisuXRToolkitController; } });
    Object.defineProperty(exports, "WebVisuXRToolkitHand", { enumerable: true, get: function () { return WebVisuXRToolkitHand_1.WebVisuXRToolkitHand; } });
    Object.defineProperty(exports, "WebVisuXRToolkitTouchscreen", { enumerable: true, get: function () { return WebVisuXRToolkitTouchscreen_1.WebVisuXRToolkitTouchscreen; } });
    Object.defineProperty(exports, "SkillOptions", { enumerable: true, get: function () { return WebVisuXRToolkitSkillsUtils_2.SkillOptions; } });
    Object.defineProperty(exports, "SkillSettings", { enumerable: true, get: function () { return WebVisuXRToolkitSkillsUtils_2.SkillSettings; } });
    Object.defineProperty(exports, "HTMLTooltip", { enumerable: true, get: function () { return HTMLTooltip_1.HTMLTooltip; } });
    function getXRNode() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.XRNode; }
    function getXRObjects() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.XRObjects; }
    function getHeadWorldMatrix() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.HeadWorldMatrix; }
    function getHeadMatrix() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.HeadMatrix; }
    function getViewer() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.viewer; }
    function getDomOverlay() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.domOverlay; }
    function getDeltaTime() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.dt; }
    function resetInitialXRNodeMatrix() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.resetInitialXRNodeMatrix(); }
    function endXRSession() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.endSession(); }
    function getXRPlanesMatrices() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.getXRPlanesPoses(); }
    function getXRMesh() { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.getXRMesh(); }
    function createLabelIndicator(labelText) { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.indicatorFactory.createLabelIndicator(labelText); }
    function createIconIndicator(icon) { return WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.indicatorFactory.createIconIndicator(icon); }
});
