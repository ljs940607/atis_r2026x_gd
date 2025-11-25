/// <amd-module name="DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitUIInteraction"/>
define("DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitUIInteraction", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/Visualization/SceneGraphFactory", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkit"], function (require, exports, THREE, WebVisuXRToolkitManager_1, WebVisuXRToolkit_1, SceneGraphFactoryStatic, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandUIInteraction = exports.HandUIInteractionLaser = exports.HandUIInteractionUsingShoulderLaser = exports.HandToggleFunctionMenuVisiblity = exports.ToggleFunctionMenuVisiblity = exports.ControllerUIInteraction = exports.ControllerUIInteractionLaser = void 0;
    const BASE_LASER_LENGTH = 200;
    const INTERACTIVE_TAGS = new Set(['BUTTON', 'INPUT']); // , 'SELECT', 'TEXTAREA' to add ?
    function intersectHTMLNode(ray, intersectables) {
        let closestIntersection = null;
        for (const node of intersectables) {
            if (!node.isVisible()) {
                continue;
            }
            const rectMatrixDec = node.UIBox.getMatrixWorld().decompose();
            const planeNormal = new THREE.Vector3(0, 0, -1).applyQuaternion(rectMatrixDec[1]); //UI normal is through the user thats why we need to reverse it
            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, rectMatrixDec[0]);
            // Intersect ray with the plane
            const intersectionPoint = new THREE.Vector3();
            if (!ray.intersectPlaneInDir(plane, intersectionPoint)) {
                continue; // No intersection with the plane
            }
            // Transform the intersection point into rectangle's local space
            const rectMatrixInverse = new THREE.Matrix4().getInverse(node.UIBox.getMatrixWorld());
            const localPoint = intersectionPoint.clone().applyMatrix4(rectMatrixInverse);
            // Check if the local point is within the rectangle's bounds
            if (localPoint.x < 0 || localPoint.x > 1.0 || localPoint.y < 0 || localPoint.y > 1.0) {
                continue; // Intersection point is outside the rectangle break
            }
            const distance = intersectionPoint.distanceTo(ray.origin);
            // Update closest intersection if necessary
            if (!closestIntersection || distance < closestIntersection.distance) {
                closestIntersection = {
                    point: intersectionPoint,
                    uv: new THREE.Vector2(localPoint.x, localPoint.y),
                    distance,
                    node
                };
            }
        }
        return closestIntersection;
    }
    class ControllerUIInteractionLaser {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.ControllerPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
            this._currentlyInteractingInput = null;
            this._currentlyInteractingElement = null;
        }
        findInteractable(elements) {
            const skip_len = elements.size - 2; // only checking on the last three layers 
            let i = 0;
            for (const element of elements) {
                i++;
                if (i < skip_len)
                    continue; // tedious, but a set does not have indexer or reverse iterator
                const is_disabled = 'disabled' in element.attributes;
                if (is_disabled)
                    continue;
                if (element.onclick || INTERACTIVE_TAGS.has(element.tagName)) // using a Set for hash comparison
                    return element;
                const child = element.lastElementChild;
                if (child && child.tagName === 'INPUT')
                    return element;
            }
            return null;
        }
        onActivate(input) {
            if (this._currentlyInteractingInput === null) {
                this._currentlyInteractingInput = input;
            }
            if (this._currentlyInteractingInput === input && input.userData.UIlaserNode) {
                if (input.targetRayMatrix && input.targetRayWorldMatrix && WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.anyIntersectibleVisible()) {
                    const worldMatrixData = input.targetRayWorldMatrix.decompose();
                    const raycastForward = new THREE.Vector3(0, 1, 0).applyQuaternion(worldMatrixData[1]);
                    const intersection = intersectHTMLNode(new THREE.Ray(worldMatrixData[0], raycastForward), WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.Intersectables);
                    if (intersection) {
                        if (intersection !== input.userData.LastIntersection) {
                            input.userData.LastIntersection = intersection;
                            intersection.node.htmlevent('mouseenter', intersection.uv.x, intersection.uv.y);
                            const htmlElements = intersection.node.intersectionCache;
                            const interactable = htmlElements ? this.findInteractable(htmlElements) : null;
                            if (interactable != this._currentlyInteractingElement) {
                                this._currentlyInteractingElement = interactable;
                                if (this._currentlyInteractingElement !== null)
                                    input.vibrate(0.3, 1);
                            }
                        }
                        intersection.node.htmlevent("mousemove", intersection.uv.x, intersection.uv.y); // Trigger mousemove in case of intersection with the UI
                        const target = input.targetRayMatrix.decompose();
                        const laserMatrix = new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, intersection.distance - 1, 1)); //1mm gap between target and ray
                        input.userData.UIlaserNode.setMatrix(laserMatrix);
                        input.userData.UIlaserNode.setVisibility(true);
                        const laserIndicatorPosition = new THREE.Vector3(1, 1, 1).applyMatrix4(input.userData.UIlaserNode.getMatrixWorld());
                        const laserIndicatorOrientation = intersection.node.getMatrixWorld().clone().decompose()[1];
                        const indicatorGap = new THREE.Vector3(0, 1, 0).applyQuaternion(laserIndicatorOrientation);
                        const laserIndicatorMatrix = new THREE.Matrix4().compose(laserIndicatorPosition.add(indicatorGap), laserIndicatorOrientation, new THREE.Vector3(1, 1, 1));
                        input.userData.UIlaserIndicator.setMatrix(laserIndicatorMatrix);
                        input.userData.UIlaserIndicator.setVisibility(true);
                        return new Set([WebVisuXRToolkit_1.InputAction.TriggerTouch]); // We want to stop all skills using this
                    }
                    else {
                        const lastIntersection = input.userData.LastIntersection;
                        if (lastIntersection) {
                            lastIntersection.node.htmlevent('mouseleave', -1, -1);
                            input.userData.LastIntersection = null;
                        }
                        this._currentlyInteractingInput = null;
                        input.userData.UIlaserNode.setVisibility(false);
                        input.userData.UIlaserIndicator.setVisibility(false);
                        this._currentlyInteractingElement = null;
                    }
                }
                else {
                    const intersection = input.userData.LastIntersection;
                    if (intersection) {
                        intersection.node.htmlevent('mouseleave', -1, -1);
                        input.userData.LastIntersection = null;
                    }
                    this._currentlyInteractingInput = null;
                    input.userData.UIlaserNode.setVisibility(false);
                    input.userData.UIlaserIndicator.setVisibility(false);
                    this._currentlyInteractingElement = null;
                }
            }
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onUnregisterInput(input) {
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.removeLaserNode(input);
            this._currentlyInteractingInput = null;
        }
        onRegisterInput(input) {
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.createLaserCube(input);
        }
    }
    exports.ControllerUIInteractionLaser = ControllerUIInteractionLaser;
    class ControllerUIInteraction {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.TriggerPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            //console.log("mouse down", input.userData.LastIntersection)
            if (input.userData.LastIntersection) {
                const intersection = input.userData.LastIntersection;
                intersection.node.htmlevent('mousedown', intersection.uv.x, intersection.uv.y);
                return this.bindings;
            }
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            //console.log("mouse up", input.userData.LastIntersection)
            if (input.userData.LastIntersection) {
                const intersection = input.userData.LastIntersection;
                intersection.node.htmlevent('mouseup', intersection.uv.x, intersection.uv.y);
                input.userData.LastIntersection = null;
                return this.bindings;
            }
            return new Set();
        }
        onUnregisterInput(input) {
        }
        onRegisterInput(input) {
        }
    }
    exports.ControllerUIInteraction = ControllerUIInteraction;
    class ToggleFunctionMenuVisiblity {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.SecondButtonPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.toggleFunctionMenu();
            return this.bindings;
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onRegisterInput(input) {
            this._indicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.FunctionMenuName);
            input.addLabelIndicator(this._indicator, "upper_button/center");
        }
        onUnregisterInput(input) {
            input.removeLabelIndicator("upper_button/center");
        }
    }
    exports.ToggleFunctionMenuVisiblity = ToggleFunctionMenuVisiblity;
    class HandToggleFunctionMenuVisiblity {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MiddlePinch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            console.log("recevied middle pinch");
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.toggleFunctionMenu();
            return this.bindings;
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) {
        }
    }
    exports.HandToggleFunctionMenuVisiblity = HandToggleFunctionMenuVisiblity;
    class HandUIInteractionUsingShoulderLaser {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.HandPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
            this._currentlyInteractingInput = null;
        }
        createLaserCubeFromShoulder(input) {
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
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(cubeRep);
            input.userData.UIlaserNode = cubeRep;
            const shoulder_pos = new THREE.Vector3().getPositionFromMatrix((0, WebVisuXRToolkit_1.getHeadWorldMatrix)()).add(new THREE.Vector3(50, 0, -100));
            const thumb_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("thumb-tip").getMatrix());
            const index_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("index-finger-tip").getMatrix());
            const mid_pos = thumb_tip.add(index_tip).multiplyScalar(0.5);
            const dir = mid_pos.clone().sub(shoulder_pos);
            input.userData.UIlaserNode.setMatrix(new THREE.Matrix4().lookAt(mid_pos, shoulder_pos.add(dir), new THREE.Vector3(0, 0, 1)).scale(new THREE.Vector3(1, BASE_LASER_LENGTH, 1)));
            input.userData.UIlaserNode.setVisibility(false);
        }
        onActivate(input) {
            if (this._currentlyInteractingInput === null) {
                this._currentlyInteractingInput = input;
            }
            if (this._currentlyInteractingInput === input) {
                if (input.userData.UIlaserNode) {
                    const shoulder_pos = new THREE.Vector3().getPositionFromMatrix((0, WebVisuXRToolkit_1.getHeadWorldMatrix)()).add(new THREE.Vector3(50, 0, input.handedness === WebVisuXRToolkit_1.InputHandedness.Right ? -100 : 100));
                    const thumb_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("thumb-tip").getMatrix());
                    const index_tip = new THREE.Vector3().getPositionFromMatrix(input.getJoint("index-finger-tip").getMatrix());
                    const mid_pos = thumb_tip.add(index_tip).multiplyScalar(0.5);
                    const dir = mid_pos.clone().sub(shoulder_pos).normalize();
                    const upVector = new THREE.Vector3(0, 0, 1); //.applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(input.getJoint("wrist").getMatrix()))
                    input.userData.UIlaserNode.setMatrix(new THREE.Matrix4().setPosition(mid_pos).lookAt(mid_pos, shoulder_pos.add(dir), upVector));
                    const raycastPosition = new THREE.Vector3();
                    const raycastOrientation = new THREE.Quaternion();
                    const matrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().multiply(input.userData.UIlaserNode.getMatrix());
                    matrix.decompose(raycastPosition, raycastOrientation, undefined);
                    const raycastForward = new THREE.Vector3(0, 1, 0).applyQuaternion(raycastOrientation);
                    const intersection = intersectHTMLNode(new THREE.Ray(raycastPosition, raycastForward), WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.Intersectables);
                    //TODO: Handle mouse leave for hand interaction
                    if (intersection) {
                        if (intersection !== input.userData.LastIntersection) {
                            intersection.node.htmlevent('mouseenter', intersection.uv.x, intersection.uv.y);
                            //console.log("mouse enter", intersection)
                            input.userData.LastIntersection = intersection;
                        }
                        intersection.node.htmlevent("mousemove", intersection.uv.x, intersection.uv.y); // Trigger mousemove in case of intersection with the UI
                        const position = new THREE.Vector3();
                        const orientation = new THREE.Quaternion();
                        const scale = new THREE.Vector3();
                        input.userData.UIlaserNode.getMatrix().decompose(position, orientation, scale);
                        scale.setY(intersection ? intersection.distance : BASE_LASER_LENGTH);
                        input.userData.UIlaserNode.setMatrix(new THREE.Matrix4().compose(position, orientation, scale));
                        // input.userData.UIlaserNode.setVisibility(true);
                        return new Set(); // We want to stop all skills using this
                    }
                    else {
                        const lastIntersection = input.userData.LastIntersection;
                        if (lastIntersection) {
                            lastIntersection.node.htmlevent('mouseleave', -1, -1);
                            input.userData.LastIntersection = null;
                        }
                        input.userData.LastIntersection = null;
                        // input.userData.UIlaserNode.setVisibility(false);
                        this._currentlyInteractingInput = null;
                    }
                }
                else {
                    const intersection = input.userData.LastIntersection;
                    if (intersection) {
                        intersection.node.htmlevent('mouseleave', -1, -1);
                        input.userData.LastIntersection = null;
                    }
                    this._currentlyInteractingInput = null;
                    // input.userData.UIlaserNode.setVisibility(false);
                }
            }
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            if (input.userData.UIlaserNode && input.userData.LastIntersection) {
                const intersection = input.userData.LastIntersection;
                input.userData.LastIntersection.node.htmlevent('mousedown', intersection.uv.x, intersection.uv.y);
                return this.bindings;
            }
            else if (!input.userData.UIlaserNode) {
                this.createLaserCubeFromShoulder(input);
            }
            input.userData.UIlaserNode.setVisibility(true);
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onUnregisterInput(input) {
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.UIlaserNode);
            input.userData.UIlaserNode = null;
        }
        onRegisterInput(input) {
            if (!input.userData.UIlaserNode) {
                this.createLaserCubeFromShoulder(input);
            }
            input.userData.UIlaserNode?.setVisibility(true);
        }
    }
    exports.HandUIInteractionUsingShoulderLaser = HandUIInteractionUsingShoulderLaser;
    class HandUIInteractionLaser extends ControllerUIInteractionLaser {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.HandPassive]);
        }
        onActivate(input) {
            if (this._currentlyInteractingInput === null) {
                this._currentlyInteractingInput = input;
            }
            if (this._currentlyInteractingInput === input && input.userData.UIlaserNode) {
                if (input.targetRayMatrix && input.targetRayWorldMatrix && WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.anyIntersectibleVisible()) {
                    const worldMatrixData = input.targetRayWorldMatrix.decompose();
                    const raycastForward = new THREE.Vector3(0, 1, 0).applyQuaternion(worldMatrixData[1]);
                    const intersection = intersectHTMLNode(new THREE.Ray(worldMatrixData[0], raycastForward), WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.Intersectables);
                    if (intersection) {
                        if (intersection !== input.userData.LastIntersection) {
                            input.userData.LastIntersection = intersection;
                            intersection.node.htmlevent('mouseenter', intersection.uv.x, intersection.uv.y);
                            const htmlElements = intersection.node.intersectionCache;
                            const interactable = htmlElements ? this.findInteractable(htmlElements) : null;
                            if (interactable != this._currentlyInteractingElement) {
                                this._currentlyInteractingElement = interactable;
                                if (this._currentlyInteractingElement !== null)
                                    input.vibrate(0.3, 1);
                            }
                        }
                        intersection.node.htmlevent("mousemove", intersection.uv.x, intersection.uv.y); // Trigger mousemove in case of intersection with the UI
                        const target = input.targetRayMatrix.decompose();
                        const laserMatrix = new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, intersection.distance - 1, 1)); //1mm gap between target and ray
                        input.userData.UIlaserNode.setMatrix(laserMatrix);
                        input.userData.UIlaserNode.setVisibility(true);
                        const laserIndicatorPosition = new THREE.Vector3(1, 1, 1).applyMatrix4(input.userData.UIlaserNode.getMatrixWorld());
                        const laserIndicatorOrientation = intersection.node.getMatrixWorld().clone().decompose()[1];
                        const indicatorGap = new THREE.Vector3(0, 1, 0).applyQuaternion(laserIndicatorOrientation);
                        const laserIndicatorMatrix = new THREE.Matrix4().compose(laserIndicatorPosition.add(indicatorGap), laserIndicatorOrientation, new THREE.Vector3(1, 1, 1));
                        input.userData.UIlaserIndicator.setMatrix(laserIndicatorMatrix);
                        input.userData.UIlaserIndicator.setVisibility(true);
                        return new Set([WebVisuXRToolkit_1.InputAction.HandPassive]); // We want to stop all skills using this
                    }
                    else {
                        const lastIntersection = input.userData.LastIntersection;
                        if (lastIntersection) {
                            lastIntersection.node.htmlevent('mouseleave', -1, -1);
                            input.userData.LastIntersection = null;
                        }
                        this._currentlyInteractingInput = null;
                        input.userData.UIlaserNode.setVisibility(false);
                        input.userData.UIlaserIndicator.setVisibility(false);
                        this._currentlyInteractingElement = null;
                    }
                }
                else {
                    const intersection = input.userData.LastIntersection;
                    if (intersection) {
                        intersection.node.htmlevent('mouseleave', -1, -1);
                        input.userData.LastIntersection = null;
                    }
                    this._currentlyInteractingInput = null;
                    input.userData.UIlaserNode.setVisibility(false);
                    input.userData.UIlaserIndicator.setVisibility(false);
                    this._currentlyInteractingElement = null;
                }
            }
            return new Set();
        }
    }
    exports.HandUIInteractionLaser = HandUIInteractionLaser;
    class HandUIInteraction extends ControllerUIInteraction {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.IndexPinch]);
        }
    }
    exports.HandUIInteraction = HandUIInteraction;
});
