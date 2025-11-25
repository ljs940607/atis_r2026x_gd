/// <amd-module name="DS/WebVisuXRToolkit/dev/FPSCounter"/>
define("DS/WebVisuXRToolkit/dev/FPSCounter", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLNode", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager"], function (require, exports, HTMLNode_1, THREE, WebVisuXRToolkitManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FPSCounterNode = void 0;
    class FPSCounter {
        constructor() {
            this.frameCount = 0;
            this.lastTime = 0;
            this.fps = 0;
            this.lastFPS = 0;
            this.lastTime = performance.now(); // Initialize with the current time
        }
        update(currentTime) {
            this.frameCount++;
            const delta = currentTime - this.lastTime;
            if (delta >= 1000) { // Update FPS every second
                this.fps = (this.frameCount / delta) * 1000;
                this.frameCount = 0;
                this.lastTime = currentTime;
                if (Math.round(this.fps) !== Math.round(this.lastFPS)) {
                    this.lastFPS = this.fps;
                    if (this.onFPSChangeCallback) {
                        this.onFPSChangeCallback(Math.round(this.fps));
                    }
                }
            }
        }
        getFPS() {
            return this.fps;
        }
        onFPSChange(callback) {
            this.onFPSChangeCallback = callback;
        }
    }
    class FPSCounterNode extends HTMLNode_1.HTMLNode {
        constructor(domParent) {
            const styles = `
            .fpsCounter {
                font-size: 4cm; /* Adjust the size as needed */
                width: 20cm;
                height: 20cm;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `;
            // Create a <style> element to hold the CSS
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(styles));
            document.head.appendChild(styleElement);
            const myDiv = document.createElement("p");
            myDiv.innerText = "Hello";
            myDiv.className = "fpsCounter";
            domParent.appendChild(myDiv);
            super(myDiv, "FPS Counter", false, false);
            this.fpsCounter = new FPSCounter();
            this.fpsCounter.onFPSChange((fps) => {
                this.dom.innerText = "FPS: " + fps;
            });
        }
        update(time) {
            this.fpsCounter.update(time);
            this.recomputeMatrix();
        }
        recomputeMatrix() {
            const headset_matrix = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.sceneManager.HeadWorldMatrix;
            const headsetPosition = new THREE.Vector3();
            const headsetQuaternion = new THREE.Quaternion();
            headset_matrix.decompose(headsetPosition, headsetQuaternion, new THREE.Vector3());
            const forward = new THREE.Vector3(0, 1, 0);
            forward.applyQuaternion(headsetQuaternion);
            const up = new THREE.Vector3(0, 0, 1);
            up.applyQuaternion(headsetQuaternion);
            const distance = 500;
            const uiPosition = headsetPosition.clone().add(forward.multiplyScalar(distance));
            //uiPosition.add(new THREE.Vector3(0, 0, (distance * Math.sin((Math.PI / 180) * 25))));
            this.setMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), forward, up).setPosition(uiPosition));
        }
    }
    exports.FPSCounterNode = FPSCounterNode;
});
