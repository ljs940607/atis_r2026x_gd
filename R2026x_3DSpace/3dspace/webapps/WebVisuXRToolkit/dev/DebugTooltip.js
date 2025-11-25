/// <amd-module name="DS/WebVisuXRToolkit/dev/DebugTooltip"/>
define("DS/WebVisuXRToolkit/dev/DebugTooltip", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLNode", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers"], function (require, exports, HTMLNode_1, THREE, WebVisuXRToolkitManager_1, WebVisuXRToolkit_1, WebVisuXRToolkitHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebugTooltipNode = exports.DebugTooltip = void 0;
    /* Debug Node ( activated from the start menu in the Dev settings panel )
    
    It follows the off (left) hand
    
    It works by "channels"
    
    DebugTooltip.print(channel: number, args: any[])
    
    Note: it can convert THREE Vector 3 and Quaternion to string, more conversions can be added easily
    
    ex:
    import { DebugTooltip } from 'DS/WebVisuXRToolkit/dev/DebugTooltip';
    
    const vectors = input.getMatrixWorld().decompose();
    DebugTooltip.print(0, "test") // will print "test" on the first line (channel 0)
    DebugTooltip.print(1, vectors[0], vectors[1], vectors[2]) // will print the following arguments with a '\n' between each from the 2nd line (channel 1)
    
    
    
    DebugTooltip.setDebugGizmoMatrix(name, matrix) functions:
    Allows to quickly spawn and move a debug gizmo
    for debug visualisation purposes
    
    
    */
    function Vector3ToString(vec) {
        return `${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}`;
    }
    function QuaternionToString(vec) {
        return `${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}, ${vec.w.toFixed(2)}`;
    }
    class DebugTooltip {
        constructor() { }
        static SetInstanceNode(node) {
            if (this._node)
                console.log("DebugTooltip node set more than once");
            this._node = node;
        }
        static IsDebutTooltipActive() {
            return (this._node !== undefined);
        }
        static print(channel, ...args) {
            if (!this.IsDebutTooltipActive())
                return;
            const arr = [];
            args.forEach((el) => {
                if (el instanceof THREE.Vector3)
                    arr.push(Vector3ToString(el));
                else if (el instanceof THREE.Quaternion)
                    arr.push(QuaternionToString(el));
                else if (typeof el === "string")
                    arr.push(el);
                else
                    arr.push(el.toString());
            });
            this._lines.set(channel, arr.join('\n'));
            const textToSend = [...this._lines.values()].join('\n');
            this._node?.SetText(textToSend);
        }
        static setDebugGizmoCompose(name, pos, rot = new THREE.Quaternion(), size = 1.0) {
            const matrix = new THREE.Matrix4().compose(pos, rot, new THREE.Vector3(size, size, size));
            this.setDebugGizmoMatrix(name, matrix);
        }
        static setDebugGizmoMatrix(name, matrix, size = undefined) {
            if (!this.IsDebutTooltipActive())
                return;
            let gizmo = this._cube.get(name);
            if (!gizmo) {
                gizmo = (0, WebVisuXRToolkitHelpers_1.getDebugAxis)();
                (0, WebVisuXRToolkit_1.getXRNode)().addChild(gizmo);
                this._cube.set(name, gizmo);
            }
            if (size) {
                const matrix_dec = matrix.decompose();
                const new_matrix = new THREE.Matrix4().compose(matrix_dec[0], matrix_dec[1], new THREE.Vector3(size, size, size));
                gizmo.setMatrix(new_matrix);
            }
            else
                gizmo.setMatrix(matrix);
        }
    }
    exports.DebugTooltip = DebugTooltip;
    DebugTooltip._node = undefined;
    DebugTooltip._lines = new Map();
    DebugTooltip._cube = new Map();
    class DebugTooltipNode extends HTMLNode_1.HTMLNode {
        constructor(domParent) {
            const myDiv = document.createElement("p");
            myDiv.innerText = "Hello";
            myDiv.className = "debugTooltip";
            myDiv.style.fontSize = "4mm";
            myDiv.style.backgroundColor = "black";
            myDiv.style.color = "white";
            myDiv.style.width = "10cm";
            myDiv.style.height = "10cm";
            myDiv.style.textAlign = "start";
            domParent.appendChild(myDiv);
            super(myDiv, "Debug Tooltip", true, false);
            DebugTooltip.SetInstanceNode(this);
        }
        SetText(text) {
            this.dom.innerText = text;
        }
        update(time) {
            this.recomputeMatrix();
            //DebugTooltip.print(0, this.getMatrixWorld().decompose()[0]);
        }
        recomputeMatrix() {
            const headset_rotation = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.HeadWorldMatrix.decompose()[1];
            const left_controller_hand = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.inputManager.getInputs().left;
            if (!left_controller_hand)
                return;
            const matrix = left_controller_hand.getMatrixWorld().decompose();
            this.setMatrix(new THREE.Matrix4().compose(matrix[0].add(new THREE.Vector3(0, 0, 200)), headset_rotation.multiply(new THREE.Quaternion(0, 0, 1, 0)), new THREE.Vector3(2, 2, 2)));
        }
    }
    exports.DebugTooltipNode = DebugTooltipNode;
});
