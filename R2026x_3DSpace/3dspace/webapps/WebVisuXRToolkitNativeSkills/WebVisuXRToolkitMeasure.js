/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitMeasure"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitMeasure", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/Visualization/SceneGraphFactory", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/Visualization/Node3D", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, SceneGraphFactoryStatic, WebVisuXRToolkit_1, WebVisuXRToolkitConfigManager, Node3D, WebVisuXRToolkitHelpers_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandMeasureDelete = exports.HandMeasure = exports.HandMeasureLaser = exports.ControllerMeasureLaser = exports.ControllerMeasureDeleteAll = exports.ControllerMeasureDelete = exports.ControllerMeasure = void 0;
    const BASE_LASER_LENGTH = 5000;
    const HITBOX_RADIUS = 4;
    const MEASURE_LINE_WIDTH = 1;
    const BASE_ETIQUETTE_SCALE = 0.002; //? This should probably be a hand menu setting
    const DEFAULT_ETIQUETTE_SCALE = 0.05; //? This should probably be a hand menu setting
    const FREE_MEASURE_ANCHOR = new THREE.Vector3(0, 10, 0); // Position of the 3d cursor for positionning measure points in free mode
    const SPHERE_RADIUS = 10;
    const SHRINK_THRESHOLD = 50; // in millimeters
    const FRAME_INTERVAL = 3;
    // Convert mat B position to mat A local space
    function getVectorBinA(A, B) {
        if (A.determinant() === 0)
            return B.decompose()[0].applyMatrix4(new THREE.Matrix4());
        else
            return B.decompose()[0].applyMatrix4(new THREE.Matrix4().getInverse(A));
    }
    function createHitboxLine(A, B, lineVector) {
        //? const from = new THREE.Vector3() It is destined to be a child of A, so its 'from' is always the 'origin' 
        // TODO: handle when lineVector = (0,0,0), rn we just don't instanciate a mesure if len < given_threshold
        const lineLength = lineVector.length();
        const linePose = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(), lineVector);
        const material = new THREE.MeshBasicMaterial({
            color: "red",
            force: true
        });
        const hitboxNode = SceneGraphFactoryStatic.createCylinderNode({
            bottomCenterPoint: new THREE.Vector3(0, 0, 0),
            topCenterPoint: new THREE.Vector3(0, 1, 0),
            radius: HITBOX_RADIUS,
            sag: 5,
            material: material
        });
        hitboxNode.setVisibility(false);
        hitboxNode.setName("Hitbox");
        hitboxNode.setMatrix(linePose.scale(new THREE.Vector3(HITBOX_RADIUS, lineLength, HITBOX_RADIUS)));
        hitboxNode.applyMatrix(A.getMatrix());
        const newMeasureElem = new Node3D("MeasureElement");
        const xrObjects = (0, WebVisuXRToolkit_1.getXRObjects)();
        xrObjects.removeChild(A);
        xrObjects.removeChild(B);
        newMeasureElem.addChild(hitboxNode);
        newMeasureElem.addChild(A);
        newMeasureElem.addChild(B);
        xrObjects.addChild(newMeasureElem);
        return newMeasureElem;
    }
    function createLineIndicator(lineVector, parent = undefined) {
        const lineLength = lineVector.length();
        const linePose = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(), lineVector);
        const material = new THREE.MeshBasicMaterial({
            color: "pink",
            force: true
        });
        const lineNode = SceneGraphFactoryStatic.createCylinderNode({
            bottomCenterPoint: new THREE.Vector3(0, 0, 0),
            topCenterPoint: new THREE.Vector3(0, 1, 0),
            radius: HITBOX_RADIUS,
            sag: 5,
            material: material
        });
        lineNode.setName("Line");
        lineNode.setVisibility(true);
        lineNode.setMatrix(linePose.scale(new THREE.Vector3(MEASURE_LINE_WIDTH, lineLength, MEASURE_LINE_WIDTH)));
        if (!parent)
            (0, WebVisuXRToolkit_1.getXRObjects)().addChild(lineNode);
        else
            parent.addChild(lineNode);
        return lineNode;
    }
    function updateLineIndicator(line, lineVector) {
        const lineLength = lineVector.length();
        const linePose = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(), lineVector);
        line.setMatrix(linePose.scale(new THREE.Vector3(MEASURE_LINE_WIDTH, lineLength, MEASURE_LINE_WIDTH)));
        return lineLength;
    }
    function createMeasureSphere(matrix, radius, isA, parentMatrix = undefined) {
        const material = new THREE.MeshBasicMaterial({
            color: isA ? 0x88bdd5 : 0xfec02f // A is white-ish and B yellow
            ,
            force: true
        });
        const sphereRep = SceneGraphFactoryStatic.createSphereNode({
            radius: radius,
            material: material
        });
        sphereRep.name = "Measure Node";
        if (parentMatrix) {
            const localMatrix = parentMatrix.multiply(matrix);
            sphereRep.setMatrix(localMatrix);
        }
        else
            sphereRep.setMatrix(new THREE.Matrix4().compose(matrix.decompose()[0], new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)));
        (0, WebVisuXRToolkit_1.getXRObjects)().addChild(sphereRep);
        return sphereRep;
    }
    function castRayIntoScenegraph(ray, viewer, excludedNode, granularity) {
        const res = new Array();
        let intersects = [];
        if (excludedNode) {
            const parents = Array.from(excludedNode.parents);
            for (const parent of parents) {
                parent.removeChild(excludedNode);
            }
            intersects = viewer.castRay(ray, viewer.getRootNode(), granularity);
            for (const parent of parents) {
                parent.addChild(excludedNode);
            }
        }
        else {
            intersects = viewer.castRay(ray, viewer.getRootNode(), granularity);
        }
        if (intersects.length > 0) {
            const checkAngle = function (myIntersection) {
                const collisionNormal = myIntersection.normal;
                if (collisionNormal) {
                    const zProjection = new THREE.Vector3(0, 0, 1).dot(collisionNormal);
                    const cosAngle = zProjection;
                    return (cosAngle >= 0.7);
                }
                return false;
            };
            for (let k = 0; k < intersects.length; k++) {
                const intersection = intersects[k];
                const validAngle = checkAngle(intersection);
                intersection.valid = validAngle;
                // http://web3dinfra:4000/files/D:_WS_Web3DInfraPRJ425_WebVisualization_Visualization.mweb_src_WebGLViewer.js.html#l5494
                // to check for multiviewer
                res.push(intersection);
            }
        }
        return res;
    }
    function raycastFromSurface(viewer, pointOnSurface, normal) {
        const epsilon = 1;
        const scaledVector = normal.clone().multiplyScalar(epsilon);
        const ray = new THREE.Ray(pointOnSurface.clone().add(scaledVector), normal);
        let intersects = [];
        intersects = castRayIntoScenegraph(ray, viewer, (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
        if (intersects.length < 1)
            return undefined;
        const oppositeIntersectionPoint = intersects[0].point;
        if (!oppositeIntersectionPoint)
            return;
        let oppositeIntersectionMatrix = new THREE.Matrix4().compose(oppositeIntersectionPoint, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
        return oppositeIntersectionMatrix;
    }
    function getFirstIntersectionFromControllerRay(viewer, input, excludeNode = undefined) {
        const intersections = input.castRayIntoScenegraph(viewer, excludeNode, "prim");
        if (intersections.length < 1)
            return undefined;
        return intersections[0];
    }
    /***
     * Meant to be added to the update function of an HTMLTooltip ('this' here)
     */
    function updateEtiquetteStandalone() {
        //lookAt + resize
        const headset_matrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
        const headset_pos = headset_matrix.decompose()[0];
        // @ts-ignore
        const worldPos = this.getMatrixWorld().decompose()[0];
        const headset_distance = headset_pos.sub(worldPos).length();
        // @ts-ignore
        const localPos = this.getMatrix().decompose()[0];
        let scale;
        if (WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.MeasureName)?.settings?.getBooleanValue(NLS.MeasureLabelRescaleSetting))
            scale = headset_distance * BASE_ETIQUETTE_SCALE;
        else {
            // @ts-ignore
            const len = parseInt(this.dom.innerHTML);
            scale = DEFAULT_ETIQUETTE_SCALE * len;
            scale = scale > 15 ? 15 : scale;
            scale = scale < 0.5 ? 0.5 : scale;
        }
        // @ts-ignore
        (0, WebVisuXRToolkitHelpers_1.lookAt)(this, headset_matrix, localPos, scale);
    }
    let measures = [];
    class MeasureSkill extends EventTarget {
        constructor() {
            super(...arguments);
            this.bindings = new Set();
            this.desiredHandedness = new Set();
            this.measureMode = NLS.MeasureModeDefault;
            this.distanceMeasured = 0;
        }
        updateEtiquette(distance = undefined) {
            if (!this.etiquette || !this.pointA || !this.pointB)
                return;
            //line middle
            const posB = this.pointB.getMatrixWorld().decompose()[0];
            const middlePosWorld = this.pointA.getMatrixWorld().decompose()[0].clone().add(posB).multiplyScalar(0.5);
            //lookAt + resize
            const headset_matrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
            const headset_distance = headset_matrix.decompose()[0].sub(middlePosWorld).length();
            (0, WebVisuXRToolkitHelpers_1.lookAt)(this.etiquette, headset_matrix, middlePosWorld, headset_distance * BASE_ETIQUETTE_SCALE);
            //precision
            if (distance)
                this.etiquette.updateText(`${(distance / 10).toFixed()} cm`);
        }
        shrinkPointsAndLine(distance) {
            if (!this.pointA || !this.pointB || !this.line)
                return;
            const ratio = distance / SHRINK_THRESHOLD;
            const vScale = new THREE.Vector3(ratio, ratio, ratio);
            this.pointA.setMatrix(this.pointA.getMatrix().scale(vScale));
            this.pointB.setMatrix(this.pointB.getMatrix().scale(vScale));
            this.line.setMatrix(this.line.getMatrix().scale(new THREE.Vector3(ratio, 1, ratio)));
        }
        resetMeasure(input) {
            // destroy point AB and its line
            this.pointA?.getParents()[0].removeChild(this.pointA);
            this.pointB?.getParents()[0].removeChild(this.pointB);
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(this.etiquette);
            this.etiquette = undefined;
            this.line = undefined;
            this.pointA = undefined;
            this.pointB = undefined;
            input.vibrate(0.3, 10);
        }
        onActivate(input) {
            if (!this.pointA || !this.pointB || !this.line || !input.targetRayMatrix)
                return;
            let lineVector = getVectorBinA(this.pointA.getMatrix(), this.pointB.getMatrixWorld());
            if (this.measureMode !== NLS.MeasureModeFree) // NLS.MeasureModeDefault or NLS.MeasureModeNormal
             {
                let intersection = input.userData.intersection;
                if (!intersection)
                    return;
                const intersectionPoint = intersection.point;
                const intersectionMatrixWorld = new THREE.Matrix4().compose(intersectionPoint, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
                this.pointB.setMatrix(intersectionMatrixWorld);
                if (this.measureMode === NLS.MeasureModeDefault) // NLS.MeasureModeDefault
                 {
                    lineVector = getVectorBinA(this.pointA.getMatrix(), intersectionMatrixWorld);
                }
                else // NLS.MeasureModeNormal
                 {
                    this.pointA.setMatrix(intersectionMatrixWorld);
                    const scaledVector = intersection.normal.multiplyScalar(10000000);
                    const oppositeIntersectionPoint = intersectionPoint.clone().add(scaledVector);
                    const oppositeIntersectionMatrix = new THREE.Matrix4().compose(oppositeIntersectionPoint, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
                    lineVector = getVectorBinA(this.pointA.getMatrix(), oppositeIntersectionMatrix);
                    updateLineIndicator(this.line, lineVector);
                    this.updateEtiquette();
                    return;
                }
            }
            else // NLS.MeasureModeFree
             {
                const matParent = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
                const controllerAttachementMatrixWorld = matParent.multiply(input.targetRayMatrix.clone().translate(FREE_MEASURE_ANCHOR));
                this.pointB.setMatrix(controllerAttachementMatrixWorld);
                lineVector = getVectorBinA(this.pointA.getMatrix(), controllerAttachementMatrixWorld);
            }
            const distance = updateLineIndicator(this.line, lineVector);
            this.updateEtiquette(distance);
            // gradual haptic feedback
            if (Math.abs(distance - this.distanceMeasured) < 10)
                return;
            input.vibrate(0.2, 1);
            this.distanceMeasured = distance;
        }
        /*** Nodes organisation after the end of onActivationBegin :
         * |-xrObjects
         *     |-point A
         *         |-Line
         *     |-point B
         *     |-etiquette
         *     |-...
         */
        onActivateBegin(input, activatingAction) {
            if (!input.targetRayMatrix)
                return;
            this.measureMode = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.MeasureName)?.settings?.getStringValue(NLS.MeasureMode) || NLS.MeasureModeDefault;
            if (this.measureMode !== NLS.MeasureModeFree) // NLS.MeasureModeDefault or NLS.MeasureModeNormal
             {
                const intersection = getFirstIntersectionFromControllerRay((0, WebVisuXRToolkit_1.getViewer)(), input, (0, WebVisuXRToolkit_1.getXRObjects)());
                if (!intersection)
                    return;
                const intersectionMatrixWorld = new THREE.Matrix4().compose(intersection.point, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
                this.pointA = createMeasureSphere(intersectionMatrixWorld, SPHERE_RADIUS, true);
                this.pointB = createMeasureSphere(intersectionMatrixWorld, SPHERE_RADIUS, false);
            }
            else // NLS.MeasureModeFree
             {
                const matParent = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
                const anchorMatrix = input.targetRayMatrix.clone().translate(FREE_MEASURE_ANCHOR);
                this.pointA = createMeasureSphere(anchorMatrix, SPHERE_RADIUS * 0.7, true, matParent);
                this.pointB = createMeasureSphere(anchorMatrix, SPHERE_RADIUS * 0.7, false, matParent);
            }
            const lineVector = getVectorBinA(this.pointA.getMatrix(), this.pointB.getMatrix());
            this.line = createLineIndicator(lineVector, this.pointA);
            this.etiquette = (0, WebVisuXRToolkit_1.createLabelIndicator)("0");
            this.etiquette.setName("Etiquette");
            (0, WebVisuXRToolkit_1.getXRObjects)().addChild(this.etiquette);
        }
        /*** Nodes organisation after the end of onActivationEnd :
         * |-xrObjects
         *     |-MeasureElement(always at [0,0,0])
         *         |-Hitbox
         *         |-point A
         *         |-point B
         *         |-Line
         *         |-etiquette
         *     |-...
         */
        onActivateEnd(input, deActivatingAction) {
            if (!this.pointA || !this.pointB || !this.line || !this.etiquette) {
                this.resetMeasure(input);
                return;
            }
            let futureMatrixOfB = this.pointB.getMatrixWorld();
            if (this.measureMode === NLS.MeasureModeNormal) {
                const intersection = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
                if (intersection.length < 1) {
                    this.resetMeasure(input);
                    return;
                }
                const intersectionPoint = intersection[0].point;
                if (!intersectionPoint) {
                    this.resetMeasure(input);
                    return;
                }
                let intersectionMatrix = new THREE.Matrix4().compose(intersectionPoint, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
                this.pointA.setMatrix(intersectionMatrix);
                futureMatrixOfB = raycastFromSurface((0, WebVisuXRToolkit_1.getViewer)(), intersectionPoint, intersection[0].normal);
                if (!futureMatrixOfB) {
                    this.resetMeasure(input);
                    return;
                }
            }
            if (this.measureMode === NLS.MeasureModeDefault) {
                const intersection = getFirstIntersectionFromControllerRay((0, WebVisuXRToolkit_1.getViewer)(), input, (0, WebVisuXRToolkit_1.getXRObjects)());
                if (!intersection) {
                    this.resetMeasure(input);
                    return;
                }
                const intersectionPoint = intersection.point;
                futureMatrixOfB = new THREE.Matrix4().compose(intersectionPoint, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
            }
            this.pointB.setMatrix(futureMatrixOfB);
            const lineVector = getVectorBinA(this.pointA.getMatrix(), futureMatrixOfB);
            if (lineVector.length() < 3) {
                this.resetMeasure(input);
                return;
            }
            const distance = updateLineIndicator(this.line, lineVector);
            this.updateEtiquette(distance);
            const newMeasureElement = createHitboxLine(this.pointA, this.pointB, getVectorBinA(this.pointA.getMatrix(), this.pointB.getMatrix()));
            this.pointA.removeChild(this.line);
            this.line.applyMatrix(this.pointA.getMatrix());
            newMeasureElement.addChild(this.line);
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(this.etiquette);
            newMeasureElement.addChild(this.etiquette);
            if (distance < SHRINK_THRESHOLD)
                this.shrinkPointsAndLine(distance);
            this.etiquette.update = updateEtiquetteStandalone;
            measures.push(this.etiquette);
            this.dispatchEvent(new Event("MeasureDone"));
            this.pointA = undefined;
            this.pointB = undefined;
            this.line = undefined;
            this.etiquette = undefined;
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) { }
    }
    class ControllerMeasure extends MeasureSkill {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.TriggerPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
        onRegisterInput(input) {
            super.onRegisterInput(input);
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this._righttriggerindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.MeasureLabel);
                this._rightbottomindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.MeasureDelete);
                input.addLabelIndicator(this._righttriggerindicator, "trigger/center");
                input.addLabelIndicator(this._rightbottomindicator, "lower_button/center");
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this._lefttriggerindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.MeasureLabel);
                this._leftbottomindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.MeasureDelete);
                input.addLabelIndicator(this._lefttriggerindicator, "trigger/center");
                input.addLabelIndicator(this._leftbottomindicator, "lower_button/center");
            }
        }
        onUnregisterInput(input) {
            super.onUnregisterInput(input);
            input.removeLabelIndicator("trigger/center");
            input.removeLabelIndicator("lower_button/center");
        }
    }
    exports.ControllerMeasure = ControllerMeasure;
    class ControllerMeasureDelete {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.FirstButtonPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
        createDestroyLaserCube(input) {
            const material = new THREE.MeshBasicMaterial({
                color: "red",
                force: true
            });
            const cubeRep = SceneGraphFactoryStatic.createCuboidNode({
                cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
                firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
                secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
                thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
                material: material
            });
            cubeRep.name = "Destroy laser";
            input.userData.destroyNode = cubeRep;
            input.userData.destroyNode.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.destroyNode);
        }
        DeleteMeasure(measure) {
            // Remove from root
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(measure);
            // Remove from array
            const child_etiquet = measure.getChildByName("Etiquette");
            if (child_etiquet instanceof WebVisuXRToolkit_1.HTMLTooltip) {
                const index = measures.indexOf(child_etiquet);
                measures.splice(index, 1);
            }
            else
                throw new TypeError("Expected child_etiquet to be of type HTMLTooltip");
        }
        cancelSelection() {
            this.selectedHitbox?.setVisibility(false);
            this.selectedMeasure = undefined;
            this.selectedHitbox = undefined;
        }
        onActivate(input) {
            if (!input.targetRayMatrix)
                return;
            const target = input.targetRayMatrix.decompose();
            input.userData.destroyNode.setMatrix(new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, BASE_LASER_LENGTH, 1)));
        }
        onActivateBegin(input, activatingAction) {
            input.userData.destroyNode.setVisibility(true);
            const intersections = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRNode)(), "prim");
            if (intersections.length < 1)
                return;
            const hitObject = intersections[0].object.getNode();
            if (!(hitObject.name === "Hitbox"))
                return;
            this.selectedMeasure = hitObject.getParents()[0];
            if (!this.selectedMeasure || this.selectedMeasure.name !== "MeasureElement")
                throw new TypeError("There should be a 'MeasureElement' there but is wasn't found");
            hitObject.setVisibility(true);
            this.selectedHitbox = hitObject;
            input.vibrate(0.5, 10);
        }
        onActivateEnd(input, deActivatingAction) {
            input.userData.destroyNode.setVisibility(false);
            if (!this.selectedMeasure)
                return;
            const intersections = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRNode)(), "prim");
            if (intersections.length > 0) {
                const hitObject = intersections[0].object.getNode();
                if (hitObject.name === "Hitbox") {
                    if (hitObject === this.selectedHitbox) {
                        this.DeleteMeasure(this.selectedMeasure);
                        this.selectedMeasure = undefined;
                        this.selectedHitbox = undefined;
                        input.vibrate(0.5, 10);
                    }
                }
            }
            this.cancelSelection();
        }
        onRegisterInput(input) {
            this.createDestroyLaserCube(input);
        }
        onUnregisterInput(input) {
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.destroyNode);
        }
    }
    exports.ControllerMeasureDelete = ControllerMeasureDelete;
    class ControllerMeasureDeleteAll {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.FirstButtonPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
        }
        DeleteAllMeasures() {
            const measures_to_delete = measures.splice(0, measures.length);
            measures_to_delete.forEach(element => {
                if (element) {
                    (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(element.getParents()[0]);
                }
            });
        }
        onActivate(input) {
        }
        onActivateBegin(input, activatingAction) {
        }
        onActivateEnd(input, deActivatingAction) {
            this.DeleteAllMeasures();
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) {
        }
    }
    exports.ControllerMeasureDeleteAll = ControllerMeasureDeleteAll;
    class MeasureLaser {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.TriggerTouch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
            this.measureMode = NLS.MeasureModeDefault;
            this.frame_counter = 0;
        }
        createLaserCube(input) {
            const material = new THREE.MeshBasicMaterial({
                color: 0x88bdd5,
                force: true
            });
            const cubeRep = SceneGraphFactoryStatic.createCuboidNode({
                cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
                firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
                secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
                thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
                material: material
            });
            cubeRep.name = "Picking laser";
            input.userData.laserNode = cubeRep;
            input.userData.laserNode.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.laserNode);
        }
        createFreeAnchorSphere(input, scale = 1) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xfec00f // yellow
                ,
                force: true
            });
            const sphereRep = SceneGraphFactoryStatic.createSphereNode({
                radius: SPHERE_RADIUS * scale,
                material: material
            });
            sphereRep.name = "Free Measure Anchor";
            return sphereRep;
        }
        onActivate(input) {
            const targetMatrix = input.targetRayMatrix;
            if (!targetMatrix)
                return;
            const target = targetMatrix.decompose();
            if (this.measureMode !== NLS.MeasureModeFree) {
                if (this.frame_counter >= FRAME_INTERVAL) {
                    const intersection = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
                    input.userData.intersection = intersection[0];
                    this.frame_counter = 0;
                }
                this.frame_counter += 1;
                const laserLen = input.userData.intersection?.distance ? input.userData.intersection?.distance : BASE_LASER_LENGTH;
                input.userData.laserNode.setMatrix(new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, laserLen, 1)));
                if (!input.userData.intersection) {
                    input.userData.otherAnchorNode.setVisibility(false);
                    return;
                }
                const intersectionMatrixFronInput = targetMatrix.translate(new THREE.Vector3(0, input.userData.intersection.distance, 0));
                input.userData.otherAnchorNode.setMatrix(intersectionMatrixFronInput);
                input.userData.otherAnchorNode.setVisibility(true);
            }
            else {
                input.userData.freeAnchorNode.setMatrix(targetMatrix.translate(FREE_MEASURE_ANCHOR));
            }
        }
        onActivateBegin(input, activatingAction) {
            if (this.measureMode !== NLS.MeasureModeFree) {
                const intersection = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
                input.userData.intersection = intersection[0];
                input.userData.laserNode.setVisibility(true);
                input.userData.otherAnchorNode.setVisibility(true);
            }
            else
                input.userData.freeAnchorNode.setVisibility(true);
        }
        onActivateEnd(input, deActivatingAction) {
            this.frame_counter = 0;
            input.userData.laserNode.setVisibility(false);
            input.userData.freeAnchorNode.setVisibility(false);
            input.userData.otherAnchorNode.setVisibility(false);
        }
        onRegisterInput(input) {
            this.frame_counter = 0;
            this.createLaserCube(input);
            const freeAnchorSphere = this.createFreeAnchorSphere(input, 0.7);
            input.userData.freeAnchorNode = freeAnchorSphere;
            input.userData.freeAnchorNode.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.freeAnchorNode);
            const otherAnchorSphere = this.createFreeAnchorSphere(input);
            input.userData.otherAnchorNode = otherAnchorSphere;
            input.userData.otherAnchorNode.setVisibility(false);
            (0, WebVisuXRToolkit_1.getXRNode)().addChild(input.userData.otherAnchorNode);
        }
        onUnregisterInput(input) {
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.laserNode);
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.freeAnchorNode);
            (0, WebVisuXRToolkit_1.getXRNode)().removeChild(input.userData.otherAnchorNode);
            input.userData.laserNode = null;
            input.userData.freeAnchorNode = null;
            input.userData.otherAnchorNode = null;
        }
    }
    class ControllerMeasureLaser extends MeasureLaser {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.TriggerTouch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
        onActivateBegin(input, activatingAction) {
            this.measureMode = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.MeasureName)?.settings?.getStringValue(NLS.MeasureMode) || NLS.MeasureModeDefault;
            super.onActivateBegin(input, activatingAction);
        }
    }
    exports.ControllerMeasureLaser = ControllerMeasureLaser;
    class HandMeasureLaser extends MeasureLaser {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.HandPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
        onActivate(input) {
            this.frame_counter += 1;
            if (this.frame_counter >= FRAME_INTERVAL)
                this.measureMode = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.MeasureName)?.settings?.getStringValue(NLS.MeasureMode) || NLS.MeasureModeDefault;
            const targetMatrix = input.targetRayMatrix;
            if (!targetMatrix)
                return;
            const target = input.targetRayMatrix.decompose();
            if (this.measureMode !== NLS.MeasureModeFree) {
                if (this.frame_counter >= FRAME_INTERVAL) {
                    input.userData.freeAnchorNode.setVisibility(false);
                    input.userData.laserNode.setVisibility(true);
                    const intersection = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
                    input.userData.intersection = intersection[0];
                    this.frame_counter = 0;
                }
                const laserLen = input.userData.intersection?.distance ? input.userData.intersection?.distance : BASE_LASER_LENGTH;
                input.userData.laserNode.setMatrix(new THREE.Matrix4().compose(target[0], target[1], new THREE.Vector3(1, laserLen, 1)));
                if (!input.userData.intersection) {
                    input.userData.otherAnchorNode.setVisibility(false);
                    return;
                }
                const intersectionMatrixFronInput = targetMatrix.translate(new THREE.Vector3(0, input.userData.intersection.distance, 0));
                input.userData.otherAnchorNode.setMatrix(intersectionMatrixFronInput);
                input.userData.otherAnchorNode.setVisibility(true);
            }
            else {
                input.userData.laserNode.setVisibility(false);
                input.userData.freeAnchorNode.setVisibility(true);
                input.userData.freeAnchorNode.setMatrix(targetMatrix.translate(FREE_MEASURE_ANCHOR));
            }
        }
    }
    exports.HandMeasureLaser = HandMeasureLaser;
    class HandMeasure extends MeasureSkill {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.IndexPinch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
    }
    exports.HandMeasure = HandMeasure;
    class HandMeasureDelete extends ControllerMeasureDelete {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.GunHand]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
    }
    exports.HandMeasureDelete = HandMeasureDelete;
});
