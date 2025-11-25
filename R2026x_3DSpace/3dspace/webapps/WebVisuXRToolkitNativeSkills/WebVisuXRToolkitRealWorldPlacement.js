/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitRealWorldPlacement"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitRealWorldPlacement", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuGLTF/GLTFLoader", "DS/WebappsUtils/WebappsUtils", "DS/Visualization/Node3D", "DS/Visualization/SceneGraphFactory", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, GLTFLoader, WebappsUtils_1, Node3D, SceneGraphFactoryStatic, WebVisuXRToolkit_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandPlacement = exports.ControllerPlacement = exports.ControllerPlacementLaser = exports.TouchScreenPlacement = void 0;
    class TouchScreenPlacement {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MixedReality, WebVisuXRToolkit_1.InputAction.TouchScreenPassive]);
            this.desiredHandedness = new Set(); // We know touchscreen has no handedness
            this.cross = document.createElement('div');
            this.crossX = 0;
            this.crossY = 0;
            this.cursor = new Node3D();
        }
        onActivate(input) {
            if (input.userData.RealWorldHitTest.isRotating && input.touchAxes[1] > 0.75) {
                const currentTouchPos = (input.touchAxes[0] + 1) / 2;
                // Calculate the angle difference
                const deltaAngle = (currentTouchPos - input.userData.RealWorldHitTest.startTouchPos) * Math.PI;
                //const deltaAngle = Math.PI;
                const quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), deltaAngle);
                const XRNodeMatData = input.userData.RealWorldHitTest.startTouchXRNodeMatrix.decompose();
                const startTouchHeadWorldMatrixData = input.userData.RealWorldHitTest.startTouchHeadWorldMatrix.clone().decompose();
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().removeChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const sceneBoundingSphere = (0, WebVisuXRToolkit_1.getViewer)().getRootNode().getBoundingSphere();
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().addChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const centerOfRotation = sceneBoundingSphere.center;
                const toCenterOfRotation = centerOfRotation.clone().sub(XRNodeMatData[0]);
                const toNewPos = XRNodeMatData[0].clone().sub(centerOfRotation).applyQuaternion(quat);
                const newPos = XRNodeMatData[0].clone().add(toCenterOfRotation).add(toNewPos);
                const newRot = startTouchHeadWorldMatrixData[1].clone().multiply(input.userData.RealWorldHitTest.startTouchHeadMatrixInverse.decompose()[1]).multiply(quat);
                //const newXRNodeMatrix = new THREE.Matrix4().makeRotationFromQuaternion(newRot).setPosition(newPos)
                const newXRNodeMatrix = new THREE.Matrix4().compose(newPos, newRot, XRNodeMatData[2]);
                (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(newXRNodeMatrix);
            }
            if (input.userData.RealWorldHitTest.isMoving) {
                input.userData.RealWorldHitTest.isFingerSelectingCross = this.moveCross(input.touchAxes[0], input.touchAxes[1]);
                const mat = input.getHitTestMatrixWorldResult();
                if (mat) {
                    if (!input.userData.RealWorldHitTest.firstHitTestFound) {
                        input.userData.RealWorldHitTest.firstHitTestFound = true;
                        this.showCross();
                    }
                    if (input.userData.RealWorldHitTest.isFingerSelectingCross) {
                        this.cross.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    }
                    else {
                        this.cross.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                    this.cursor.setMatrix(mat);
                    this.cursor.setVisibility(!input.userData.RealWorldHitTest.isFingerSelectingCross);
                }
            }
        }
        onActivateBegin(input, activatingAction) {
            input.userData.RealWorldHitTest = {};
            if (input.touchAxes[1] > 0.75) {
                input.userData.RealWorldHitTest.isRotating = true;
                input.userData.RealWorldHitTest.startTouchPos = (input.touchAxes[0] + 1) / 2;
                input.userData.RealWorldHitTest.startTouchHeadWorldMatrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
                input.userData.RealWorldHitTest.startTouchHeadMatrixInverse = new THREE.Matrix4().getInverse((0, WebVisuXRToolkit_1.getHeadMatrix)());
                input.userData.RealWorldHitTest.startTouchXRNodeMatrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
            }
            else {
                new GLTFLoader().load((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "models/Location_Anchor_1.glb")).then(cursorModel => {
                    cursorModel.setMatrix(cursorModel.getMatrix().scale(new THREE.Vector3(1.5, 1.5, 1.5)));
                    this.cursor.addChild(cursorModel);
                });
                // Create cross element
                this.cross.id = 'cross';
                this.cross.textContent = 'X';
                this.cross.style.position = 'absolute';
                this.cross.style.width = '50px';
                this.cross.style.height = '50px';
                this.cross.style.backgroundColor = 'red';
                this.cross.style.color = 'white';
                this.cross.style.fontSize = '30px';
                this.cross.style.fontWeight = 'bold';
                this.cross.style.display = 'flex';
                this.cross.style.justifyContent = 'center';
                this.cross.style.alignItems = 'center';
                this.cross.style.borderRadius = '50%';
                this.cross.style.userSelect = 'none';
                this.cross.style.transform = 'translate(-50%, -50%) scale(0)';
                this.cross.style.transition = 'transform 0.1s ease-out';
                (0, WebVisuXRToolkit_1.getXRObjects)().addChild(this.cursor);
                this.cursor.setVisibility(false);
                const rect = (0, WebVisuXRToolkit_1.getDomOverlay)().getBoundingClientRect();
                this.crossX = rect.width / 2;
                this.crossY = rect.height * 0.9;
                this.cross.style.left = `${this.crossX}px`;
                this.cross.style.top = `${this.crossY}px`;
                input.userData.RealWorldHitTest.isMoving = true;
                input.userData.RealWorldHitTest.firstHitTestFound = false;
                (0, WebVisuXRToolkit_1.getDomOverlay)().appendChild(this.cross);
            }
        }
        onActivateEnd(input, deActivatingAction) {
            if (input.userData.RealWorldHitTest.isMoving) {
                if (!input.userData.RealWorldHitTest.isFingerSelectingCross && input.userData.RealWorldHitTest.firstHitTestFound) {
                    const hitTestWorldMatData = this.cursor.getMatrix().decompose();
                    //const hitTestWorldMatData = mat.decompose();
                    (0, WebVisuXRToolkit_1.getViewer)().getRootNode().removeChild((0, WebVisuXRToolkit_1.getXRObjects)());
                    const sceneBoundingSphere = (0, WebVisuXRToolkit_1.getViewer)().getRootNode().getBoundingSphere();
                    (0, WebVisuXRToolkit_1.getViewer)().getRootNode().addChild((0, WebVisuXRToolkit_1.getXRObjects)());
                    const centerOfRotation = sceneBoundingSphere.center;
                    centerOfRotation.z = 0; // We don't want to object the be inside the ground;
                    const translationMatrix = new THREE.Matrix4().makeTranslation(centerOfRotation.x - hitTestWorldMatData[0].x, centerOfRotation.y - hitTestWorldMatData[0].y, centerOfRotation.z - hitTestWorldMatData[0].z);
                    (0, WebVisuXRToolkit_1.getXRNode)().applyMatrix(translationMatrix);
                }
                (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(this.cursor);
                this.cross.remove();
            }
            input.userData.RealWorldHitTest = undefined;
        }
        onUnregisterInput(input) {
        }
        onRegisterInput(input) {
        }
        moveCross(normX, normY) {
            const rect = (0, WebVisuXRToolkit_1.getDomOverlay)().getBoundingClientRect();
            const x = (normX + 1) / 2 * rect.width;
            const y = (normY + 1) / 2 * rect.height;
            const initCrossX = rect.width / 2;
            const initCrossY = rect.height * 0.9;
            const dx = x - initCrossX;
            const dy = y - initCrossY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const attractionDistance = 250; // Distance threshold for attraction
            const maxCrossMovementDistance = 75; // Max distance the cross can be pulled
            let isFingerSelectingCross = false;
            if (distance < maxCrossMovementDistance) {
                this.crossX = x;
                this.crossY = y;
                isFingerSelectingCross = true;
            }
            else if (distance < attractionDistance) {
                let attractionFactor = 0.1;
                let newCrossX = this.crossX + dx * attractionFactor;
                let newCrossY = this.crossY + dy * attractionFactor;
                // Constrain the cross within a max distance from its initial position
                const deltaX = newCrossX - initCrossX;
                const deltaY = newCrossY - initCrossY;
                const newDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (newDistance > maxCrossMovementDistance) {
                    const scale = maxCrossMovementDistance / newDistance;
                    newCrossX = initCrossX + deltaX * scale;
                    newCrossY = initCrossY + deltaY * scale;
                }
                this.crossX = newCrossX;
                this.crossY = newCrossY;
            }
            else {
                this.resetCross();
            }
            this.cross.style.left = `${this.crossX}px`;
            this.cross.style.top = `${this.crossY}px`;
            return isFingerSelectingCross;
        }
        resetCross() {
            const rect = (0, WebVisuXRToolkit_1.getDomOverlay)().getBoundingClientRect();
            const initCrossX = rect.width / 2;
            const initCrossY = rect.height * 0.9;
            const dx = initCrossX - this.crossX;
            const dy = initCrossY - this.crossY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 1) {
                this.crossX += dx * 0.2;
                this.crossY += dy * 0.2;
            }
            else {
                this.crossX = initCrossX;
                this.crossY = initCrossY;
            }
            this.cross.style.left = `${this.crossX}px`;
            this.cross.style.top = `${this.crossY}px`;
        }
        hideCross() {
            this.cross.style.transform = 'translate(-50%, -50%) scale(0)';
        }
        showCross() {
            this.cross.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
    exports.TouchScreenPlacement = TouchScreenPlacement;
    class ControllerPlacementLaser {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MixedReality, WebVisuXRToolkit_1.InputAction.TriggerTouch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        createLaserCube(input) {
            const material = new THREE.MeshBasicMaterial({
                color: 0x8845d5,
                force: true
            });
            const cubeRep = SceneGraphFactoryStatic.createCuboidNode({
                cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
                firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
                secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
                thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
                material: material
            });
            cubeRep.name = "RealWorldHitTest laser";
            input.userData.RealWorldHitTest.laserNode = cubeRep;
            input.userData.RealWorldHitTest.laserNode.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.RealWorldHitTest.laserNode);
        }
        onActivate(input) {
            if (input.targetRayMatrix) {
                const intersections = input.castRayIntoRealWorldMesh((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRMesh)());
                if (intersections.length > 0) {
                    const target = input.targetRayMatrix.decompose();
                    input.userData.RealWorldHitTest.laserNode.setMatrix(new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, intersections[0].distance, 1)));
                    const arbitraryVector = new THREE.Vector3(1, 0, 0);
                    if (Math.abs(intersections[0].normal.dot(arbitraryVector)) > 0.99) {
                        arbitraryVector.set(0, 1, 0);
                    }
                    const xAxis = new THREE.Vector3().crossVectors(arbitraryVector, intersections[0].normal).normalize();
                    const yAxis = new THREE.Vector3().crossVectors(intersections[0].normal, xAxis).normalize();
                    const intersectMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, intersections[0].normal).setPosition(intersections[0].point);
                    //const interectionWorldMatDec = getXRNode().getMatrix().multiply(intersectMatrix).decompose()
                    const interectionWorldMatDec = intersectMatrix.decompose();
                    input.userData.RealWorldHitTest.cursor.setMatrix(new THREE.Matrix4().compose(interectionWorldMatDec[0], interectionWorldMatDec[1], input.userData.RealWorldHitTest.cursor.getMatrix().decompose()[2]));
                    input.userData.RealWorldHitTest.hittestPos = interectionWorldMatDec[0];
                    input.userData.RealWorldHitTest.cursor.setVisibility(true);
                    input.userData.RealWorldHitTest.laserNode.setVisibility(true);
                }
                else {
                    input.userData.RealWorldHitTest.cursor.setVisibility(false);
                    input.userData.RealWorldHitTest.laserNode.setVisibility(false);
                    input.userData.RealWorldHitTest.hittestPos = null;
                }
            }
        }
        onActivateBegin(input, activatingAction) {
            //input.userData.RealWorldHitTest.laserNode.setVisibility(true);
        }
        onActivateEnd(input, deActivatingAction) {
            input.userData.RealWorldHitTest.laserNode.setVisibility(false);
            input.userData.RealWorldHitTest.cursor.setVisibility(false);
        }
        onUnregisterInput(input) {
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.RealWorldHitTest.laserNode);
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(input.userData.RealWorldHitTest.cursor);
            input.userData.RealWorldHitTest = undefined;
        }
        onRegisterInput(input) {
            input.userData.RealWorldHitTest = {};
            this.createLaserCube(input);
            input.userData.RealWorldHitTest.cursor = new Node3D();
            new GLTFLoader().load((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "models/Location_Anchor_1.glb")).then(cursorModel => {
                if (input.userData.RealWorldHitTest) {
                    cursorModel.setMatrix(cursorModel.getMatrix().scale(new THREE.Vector3(1.5, 1.5, 1.5)).rotateY(Math.PI));
                    input.userData.RealWorldHitTest.cursor.addChild(cursorModel);
                }
            });
            input.userData.RealWorldHitTest.cursor.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRObjects)().addChild(input.userData.RealWorldHitTest.cursor);
        }
    }
    exports.ControllerPlacementLaser = ControllerPlacementLaser;
    class ControllerPlacement {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MixedReality, WebVisuXRToolkit_1.InputAction.TriggerPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
        }
        onActivateBegin(input, activatingAction) {
        }
        onActivateEnd(input, deActivatingAction) {
            if (input.userData.RealWorldHitTest.hittestPos) {
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().removeChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const sceneBoundingSphere = (0, WebVisuXRToolkit_1.getViewer)().getRootNode().getBoundingSphere();
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().addChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const centerOfRotation = sceneBoundingSphere.center;
                centerOfRotation.z = 0; // We don't want to object the be inside the ground;
                const translationMatrix = new THREE.Matrix4().makeTranslation(centerOfRotation.x - input.userData.RealWorldHitTest.hittestPos.x, centerOfRotation.y - input.userData.RealWorldHitTest.hittestPos.y, centerOfRotation.z - input.userData.RealWorldHitTest.hittestPos.z);
                (0, WebVisuXRToolkit_1.getXRNode)().applyMatrix(translationMatrix);
            }
        }
        onUnregisterInput(input) {
            input.removeLabelIndicator("trigger/center");
        }
        onRegisterInput(input) {
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this._rightindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.ObjectPlacementLabel);
                input.addLabelIndicator(this._rightindicator, "trigger/center");
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this._leftindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.ObjectPlacementLabel);
                input.addLabelIndicator(this._leftindicator, "trigger/center");
            }
        }
    }
    exports.ControllerPlacement = ControllerPlacement;
    class HandPlacement extends ControllerPlacementLaser {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MixedReality, WebVisuXRToolkit_1.InputAction.IndexPinch]);
        }
        onActivateEnd(input, deActivatingAction) {
            super.onActivateEnd(input, deActivatingAction);
            if (input.userData.RealWorldHitTest.hittestPos) {
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().removeChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const sceneBoundingSphere = (0, WebVisuXRToolkit_1.getViewer)().getRootNode().getBoundingSphere();
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().addChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const centerOfRotation = sceneBoundingSphere.center;
                centerOfRotation.z = 0; // We don't want to object the be inside the ground;
                const translationMatrix = new THREE.Matrix4().makeTranslation(centerOfRotation.x - input.userData.RealWorldHitTest.hittestPos.x, centerOfRotation.y - input.userData.RealWorldHitTest.hittestPos.y, centerOfRotation.z - input.userData.RealWorldHitTest.hittestPos.z);
                (0, WebVisuXRToolkit_1.getXRNode)().applyMatrix(translationMatrix);
            }
        }
    }
    exports.HandPlacement = HandPlacement;
});
