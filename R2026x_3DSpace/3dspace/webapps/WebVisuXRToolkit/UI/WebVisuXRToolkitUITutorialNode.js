define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUITutorialNode", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/Visualization/ThreeJS_DS", "DS/Visualization/SceneGraphFactory", "DS/WebVisuXRToolkitUINode/WebVisuXRToolkitUINode", "DS/WebVisuXRToolkitUINode/HTMLWindow"], function (require, exports, WebVisuXRToolkit_1, WebVisuXRToolkitHelpers_1, WebVisuXRToolkitManager_1, THREE, SceneGraphFactoryStatic, WebVisuXRToolkitUINode_1, HTMLWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitUITutorialNode = void 0;
    function createArrowIndicator() {
        const material = new THREE.MeshBasicMaterial({
            color: 0xd6281c,
            force: true
        });
        const arrowNode = new WebVisuXRToolkitUINode_1.UINode("Arrow indicator");
        const cubeRep = SceneGraphFactoryStatic.createCuboidNode({
            cornerPoint: new THREE.Vector3(-2.0, -2.0, 0.0),
            firstAxis: new THREE.Vector3(4.0, 0.0, 0.0),
            secondAxis: new THREE.Vector3(0.0, 4.0, 0.0),
            thirdAxis: new THREE.Vector3(0.0, 0.0, 20.0),
            material: material
        });
        cubeRep.setName("Arrow");
        arrowNode.addChild(cubeRep);
        arrowNode.update = (time, deltaTime) => {
            cubeRep.setMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, Math.sin(time * 2 * Math.PI * 0.002) * 5)));
        };
        return arrowNode;
    }
    class WebVisuXRToolkitUITutorialNode extends HTMLWindow_1.HTMLWindow {
        constructor(parentDom) {
            // Create the container
            const container = document.createElement("div");
            /*container.style.width = "300px";
            container.style.border = "2px solid black";
            container.style.backgroundColor = "black";
            container.style.color = "white";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
            container.style.fontSize = "24px";
            container.style.lineHeight = "1.2em";
            parentDom.appendChild(container);
            super(container, "WebVisuXRToolkitTutorial", true, false)
            */
            super(parentDom, "WebVisuXRToolkit Tutorial", true, container); // HTMLWindow
            this.tutorialUINodeMatrix = new THREE.Matrix4();
            this.windowHasToMove = false;
            this.update = (time, deltaTime) => {
                // Extract headset position and orientation
                const headsetMatDec = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)().decompose();
                const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(headsetMatDec[1]);
                // Target position is 2 meters in front of headset
                const idealPos = headsetMatDec[0].clone().add(forward.clone().multiplyScalar(750));
                // Get current UI node position and orientation from matrix
                const tutorialUINodeMatrixDec = this.tutorialUINodeMatrix.decompose();
                const currentPos = tutorialUINodeMatrixDec[0];
                const currentQuat = tutorialUINodeMatrixDec[1];
                // Measure squared distance to ideal position
                const distSq = currentPos.distanceToSquared(idealPos);
                if (distSq > 600 * 600) {
                    this.windowHasToMove = true;
                }
                if (this.windowHasToMove) {
                    if (distSq < 2) {
                        this.windowHasToMove = false;
                    }
                    const dir = idealPos.clone().sub(currentPos);
                    currentPos.add(dir.multiplyScalar(2 * deltaTime)); // Smooth move
                }
                const lookAtMatrix = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(currentPos, headsetMatDec[0]);
                const lookAtQuat = new THREE.Quaternion().setFromRotationMatrix(lookAtMatrix);
                // Slerp toward the target orientation
                currentQuat.slerp(lookAtQuat, 2 * deltaTime); // Smooth rotate
                // Compose final matrix with new position and smoothed orientation
                this.tutorialUINodeMatrix = new THREE.Matrix4().compose(currentPos, currentQuat, new THREE.Vector3(5, 5, 5));
                this.setMatrix(this.tutorialUINodeMatrix);
            };
            // Define entries: each has a custom element and a display time (in milliseconds)
            this.entries = [
                (element) => new Promise(resolve => {
                    const text = document.createElement('p');
                    text.textContent = "Welcome to the WebVisuXRToolkit tutorial";
                    element.appendChild(text);
                    setTimeout(() => { resolve(); element.removeChild(text); }, 3000);
                })
                /*,
                (element: HTMLElement) => new Promise(resolve =>
                {
                    const text = document.createElement('p');
                    text.textContent = "Look at your controllers"
                    element.appendChild(text)
                    const intervalId = setInterval(() =>
                    {
                        const leftInput = WebVisuXRToolkitManager.instance.inputManager.getInputs().left;
                        const rightInput = WebVisuXRToolkitManager.instance.inputManager.getInputs().right;
                        if (leftInput instanceof WebVisuXRToolkitController && rightInput instanceof WebVisuXRToolkitController)
                        {
                            //WebVisuXRToolkitManager.instance.skillsManager._clearSelectedSkills([leftInput, rightInput])
                            clearInterval(intervalId);
                            setTimeout(() => { resolve(); element.removeChild(text) }, 2000); // Resolve the promise once the condition is met
                        }
                    }, 100);
                })*/
            ];
            // Extract headset position and orientation
            const headsetMatDec = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)().decompose();
            const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(headsetMatDec[1]);
            // Target position is 2 meters in front of headset
            const idealPos = headsetMatDec[0].clone().add(forward.clone().multiplyScalar(750));
            this.tutorialUINodeMatrix = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(0, 0, 0), forward).rotateZ(Math.PI).setPosition(idealPos).scale(new THREE.Vector3(5, 5, 5));
            this.setMatrix(this.tutorialUINodeMatrix);
        }
        addSkillSteps(skillName, steps) {
            this.entries.push((element) => new Promise(resolve => {
                if (WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.skillsManager.listSkills().chosenSkillsName.has(skillName)) {
                    resolve();
                }
                else {
                    const text = document.createElement('p');
                    text.textContent = "Open the Quick Menu and choose " + skillName;
                    element.appendChild(text);
                    let intervalId = setInterval(() => {
                        try {
                            if (WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.isVisible()) {
                                clearInterval(intervalId);
                                const arrowNode = createArrowIndicator();
                                const inputsArray = new Array;
                                const inputs = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.inputManager.getInputs();
                                if (inputs.left) {
                                    inputsArray.push(inputs.left);
                                }
                                if (inputs.right) {
                                    inputsArray.push(inputs.right);
                                }
                                for (const input of inputs.others) {
                                    inputsArray.push(input);
                                }
                                for (const [button, position] of WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.updateQmButtons(inputsArray)) {
                                    if (button.id === skillName) {
                                        arrowNode.setMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, 20).add(position)));
                                        WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.addChild(arrowNode);
                                        break;
                                    }
                                }
                                intervalId = setInterval(() => {
                                    try {
                                        const skills = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.skillsManager.listSkills().chosenSkillsName;
                                        if (skills.has(skillName)) {
                                            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.removeChild(arrowNode);
                                            clearInterval(intervalId);
                                            text.remove();
                                            resolve(); // Resolve the promise once the condition is met
                                        }
                                    }
                                    catch (e) {
                                        console.error("Clearing interval", e);
                                        clearInterval(intervalId);
                                    }
                                }, 100);
                            }
                        }
                        catch (e) {
                            console.error("Clearing interval", e);
                            clearInterval(intervalId);
                        }
                    }, 100);
                }
            }));
            for (const step of steps) {
                this.entries.push(step);
            }
        }
        async startTutorial() {
            this.entries.push((element) => new Promise(resolve => {
                const text = document.createElement('p');
                text.textContent = "Well done, you have finished the WebVisuXRToolkit Tutorial";
                element.appendChild(text);
                setTimeout(() => { resolve(); element.removeChild(text); }, 4000);
            }));
            return new Promise(resolve => {
                let currentIndex = 0;
                // Stop if all entries have been shown
                const showNext = () => {
                    if (currentIndex >= this.entries.length) {
                        this.dispose();
                        resolve();
                        return;
                    }
                    this.entries[currentIndex++](this._dom).then(() => showNext());
                };
                showNext();
            });
        }
    }
    exports.WebVisuXRToolkitUITutorialNode = WebVisuXRToolkitUITutorialNode;
});
