/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIInfoIndicatorFactory"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIInfoIndicatorFactory", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkitUINode/HTMLIcon", "DS/WebVisuXRToolkitUINode/HTMLTooltip", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "DS/Visualization/SceneGraphFactory"], function (require, exports, THREE, HTMLIcon_1, HTMLTooltip_1, WebVisuXRToolkitHelpers_1, SceneGraphFactoryStatic) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitUIInfoIndicatorFactory = void 0;
    class WebVisuXRToolkitUIInfoIndicatorFactory {
        constructor(domParent) {
            this._domParent = domParent;
        }
        // Handle label indicators
        createLabelIndicator(labeltext) {
            const labelNode = new HTMLTooltip_1.HTMLTooltip(labeltext, this._domParent);
            labelNode.setName(labeltext);
            return labelNode;
        }
        createLineIndicator(from, to) {
            const lineLength = to.sub(from).length();
            const linePose = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(from, to);
            const material = new THREE.MeshBasicMaterial({
                color: "white",
                force: true
            });
            const lineNode = SceneGraphFactoryStatic.createCuboidNode({
                cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
                firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
                secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
                thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
                material: material
            });
            lineNode.setName("Line");
            lineNode.setMatrix(linePose.scale(new THREE.Vector3(0.3, lineLength, 0.3)));
            return lineNode;
        }
        // Handle icon indicators
        createIconIndicator(icon) {
            const iconNode = new HTMLIcon_1.HTMLIcon(icon, this._domParent);
            return iconNode;
        }
        // Handle GLTF indicators
        createModelIndicator() {
        }
        dispose() {
            this.disposeAll();
        }
        disposeAll() {
        }
    }
    exports.WebVisuXRToolkitUIInfoIndicatorFactory = WebVisuXRToolkitUIInfoIndicatorFactory;
});
