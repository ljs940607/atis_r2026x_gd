/// <amd-module name="DS/WebVisuXRToolkit/WebVisuXRToolkitSceneManager"/>
define("DS/WebVisuXRToolkit/WebVisuXRToolkitSceneManager", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/Visualization/Node3D", "DS/Visualization/CameraSystem", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "DS/Mesh/MeshUtils", "DS/Visualization/SceneGraphFactory", "DS/Visualization/Ambience", "DS/SceneGraphNodes/DirectionalLightNode"], function (require, exports, THREE, Node3D, CameraSystem, WebVisuXRToolkitConfigManager, WebVisuXRToolkitHelpers_1, Mesh, SceneGraphFactoryStatic, Ambience, DirectionalLightNode) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitSceneManager = void 0;
    //@ ts-ignore
    //import WorldOrientation = require('DS/Visualization/WorldOrientation');
    var AmbienceRestoration;
    (function (AmbienceRestoration) {
        AmbienceRestoration["BlueDesignOCA"] = "BlueDesign";
        AmbienceRestoration["WhiteDesignOCA"] = "WhiteDesign";
        AmbienceRestoration["StudioOCA"] = "Studio";
        AmbienceRestoration["PureWhiteOCA"] = "PureWhiteStudio";
        AmbienceRestoration["WhiteMirrorOCA"] = "WhiteMirror";
        AmbienceRestoration["WhiteReviewOCA"] = "WhiteReview";
        AmbienceRestoration["DarkMirrorOCA"] = "DarkMirror";
        AmbienceRestoration["DarkReviewOCA"] = "DarkReview";
        AmbienceRestoration["OutdoorOCA"] = "Outdoor";
        AmbienceRestoration["IndoorOCA"] = "Indoor";
        AmbienceRestoration["CityOCA"] = "City";
        AmbienceRestoration["RoadOCA"] = "Road";
        AmbienceRestoration["WhiteExperienceOCA"] = "WhiteExperience";
    })(AmbienceRestoration || (AmbienceRestoration = {}));
    /**
     * This file is in charge of handling all the nodes that interfere with the scene graph
     * It has the important job of setting the correct position for each camera in the scenegraph
     */
    class WebVisuXRToolkitSceneManager {
        constructor(viewer, viewpoint, xrWebGLBinding, lightProbe) {
            this._XRObjects = new Node3D("XR_Components");
            this._XRNode = new Node3D("XRNode");
            this._leftProjectionMatrix = new THREE.Matrix4();
            this._rightProjectionMatrix = new THREE.Matrix4();
            this._leftTransformMatrix = new THREE.Matrix4().setFromArray([-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 20, 0, 0, 1]);
            this._rightTransformMatrix = new THREE.Matrix4().setFromArray([-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -20, 0, 0, 1]);
            this._HeadWorldMatrix = new THREE.Matrix4();
            this._HeadMatrix = new THREE.Matrix4();
            this._initialXRNodeMatrix = new THREE.Matrix4();
            this._restoreEnv = false;
            this._XRplanes = new Map();
            this._XRMeshes = new Node3D("XR Meshes");
            this._XRMeshesMap = new Map();
            this._displayXRMesh = false;
            this._is_cameraSystem_active = false;
            this._isBackgroundtransparent = false;
            this._previousListener = undefined;
            this._viewer = viewer;
            this._viewpoint = viewpoint;
            //viewer.setWorldOrientation(WorldOrientation.YUpXRight)
            this._lightProbe = lightProbe;
            this._xrWebGLBinding = xrWebGLBinding;
            this._previousVisuEnv = AmbienceRestoration[viewer.getVisuEnv()];
            if (this._previousVisuEnv === undefined) {
                console.warn("previous Visuenv cannot be defined:", viewer.getVisuEnv());
            }
            this._previousAmbiance = viewer.ambience;
            this._oldAxisSystem = this._viewer.getReferenceAxisSystemNode()?.isVisible();
            this._viewer.defaultAnimationLoop = false;
            this._viewpoint.setControlActive({ viewpoint: false, picking: false });
            this._viewpoint.camera.externalProjectionMatrix = true;
            this._wasUsingOffScreenCanvas = this._viewer.useOffscreenCanvas;
            this._viewer.useOffscreenCanvas = true;
            const symbols = Object.getOwnPropertySymbols(navigator.xr);
            if (symbols) {
                for (const symbol of symbols) {
                    if (symbol.description && symbol.description.match(/polyfill/i)) {
                        console.log("Polyfill found, stopping offscreenscanvas");
                        this._viewer.useOffscreenCanvas = false;
                    }
                }
            }
            this._oldProjectionType = this._viewer.currentViewpoint.getProjectionType();
            this._viewpoint.setProjectionType(0);
            this._wasAutoGroundOffset = this._viewer.ambience.isAutoGroundOffset();
            this._viewer.ambience.setAutoGroundOffset(false);
            this._previousGroundOffset = this._viewer.ambience.getOffset();
            this._previousViewpointPos = this._viewpoint.getEyePosition();
            this._previousViewpointTarget = this._viewpoint.getTarget();
            this._previousViewpointUpDirection = this._viewpoint.getUpDirection();
            if (WebVisuXRToolkitConfigManager.instance.settings.get("StartOnObject")) {
                this._viewpoint.moveTo({ eyePosition: new THREE.Vector3(0, 0, 0), duration: 0 });
                this._viewpoint.resetCameraOrientation();
                this._viewpoint.reframe(undefined, 0);
            }
            this._startViewpointOrientation = this._viewpoint.control.orientation;
            this._startViewpointPosition = this._viewpoint.getEyePosition();
            this._viewpoint.setUpDirection(viewer.getWorldOrientation().upVector);
            this._XRObjects.addChild(this._XRNode);
            this._XRObjects.exludeFromBounding(true);
            this._XRObjects.setMatrix(viewer.getWorldOrientation().fromZUpMatrix);
            this._XRNode.addChild(this._XRMeshes);
            this._XRMeshes.setVisibility(this._displayXRMesh);
            this._viewer.getRootNode().addChild(this._XRObjects);
            this._cameraSystem = new CameraSystem();
            this._cameraSystem.setComputeCameraArrayCB(this._xrComputeStereoCameras.bind(this), true);
            this._cameraSystem.setUsePredefinedCombineShader('leftRight');
            this._backgroundColor = this._viewer.backgroundColor;
        }
        /** @internal */
        _restoreSceneGraph() {
            this._viewpoint.moveTo({ upDirection: this._previousViewpointUpDirection, eyePosition: this._previousViewpointPos, duration: 0 });
            this._viewpoint.setUpDirection(this._previousViewpointUpDirection);
            this._viewpoint.setTarget(this._previousViewpointTarget);
            this._viewpoint.setEyePosition(this._previousViewpointPos);
            this._viewer.getRootNode().removeChild(this._XRObjects);
            this._XRObjects = new Node3D();
            this._viewer.useOffscreenCanvas = this._wasUsingOffScreenCanvas;
            this._viewpoint.camera.externalProjectionMatrix = false;
            this._viewpoint.setControlActive({ viewpoint: true, picking: true });
            this._viewpoint.onMove(this._viewer.render);
            this._cameraSystem.setExternalFrameBuffer(null);
            this._viewer.setCameraSystem(null);
            //this._viewer.setTrackingViewpoint(null);
            this._viewpoint.setProjectionType(this._oldProjectionType);
            this._viewer.setReferenceAxisSystem(this._oldAxisSystem);
            this._viewer._updateShadowMaps();
            this._viewer.defaultAnimationLoop = true;
            window.requestAnimationFrame(this._viewer.animate);
            // set a true si on detecte un mobile (quest3 ou telephone) sinon set a false
            if (/Android|iPhone|iPad|Opera Mini|Quest/i.test(navigator.userAgent) ||
                (typeof window.orientation !== "undefined") ||
                (navigator.userAgentData && navigator.userAgentData.mobile)) {
                this._viewer.setSmallRenderTargetPicking(true);
            }
            else {
                this._viewer.setSmallRenderTargetPicking(false);
            }
            if (this._viewer.setXRRenderTarget) {
                this._viewer.setXRRenderTarget(null);
            }
            if (this._restoreEnv) {
                if (this._previousAmbiance.isOCA) {
                    this._viewer.setVisuEnvOCA(this._previousVisuEnv || "Basic");
                }
                else {
                    this._viewer.setVisuEnvOCA("Basic");
                    /*
                    this._viewer.setAmbience(this._previousAmbiance)
                    this.viewer.ambience.update();
                    this.viewer.ambience.updateAmbience();
                    this.viewer.ambience.updateLights(this.viewpoint, this.viewer.internalSceneGraph, undefined, this._viewer.useShadowMap)
                    */
                }
            }
            this._viewer.ambience.setAutoGroundOffset(this._wasAutoGroundOffset);
            this._viewer.ambience.setGroundOffset(this._previousGroundOffset);
        }
        setupXRNodeMatrix() {
            const headmatInViewpointStyle = this._HeadMatrix.clone().rotateX(0.5 * Math.PI);
            const orientation = headmatInViewpointStyle.decompose()[1];
            const position = headmatInViewpointStyle.decompose()[0];
            //correct headsetOrientation to z up :
            const previousUp = new THREE.Vector3(0, 1, 0).applyQuaternion(orientation);
            const upVector = new THREE.Vector3(0, 0, 1);
            const angle = Math.acos(upVector.dot(previousUp));
            if (angle) {
                const axis = upVector.clone().cross(previousUp);
                axis.normalize();
                const rotation = new THREE.Quaternion().setFromAxisAngle(axis, -angle);
                orientation.multiplyQuaternions(rotation, orientation.clone());
            }
            if (WebVisuXRToolkitConfigManager.instance.settings.get("ObjectsOnGround")) {
                position.z = 0;
            }
            else {
                this._viewer.ambience.setGroundOffset(-position.z);
            }
            headmatInViewpointStyle.compose(position, orientation, new THREE.Vector3(1, 1, 1));
            const mat = new THREE.Matrix4().compose(this._startViewpointPosition, this._startViewpointOrientation, new THREE.Vector3(1, 1, 1))
                .multiply(new THREE.Matrix4().getInverse(headmatInViewpointStyle));
            mat.multiplyMatrices(new THREE.Matrix4().getInverse(this._viewer.getWorldOrientation().fromZUpMatrix), mat);
            this._XRNode.setMatrix(mat);
            this._initialXRNodeMatrix = mat.clone();
        }
        resetInitialXRNodeMatrix() {
            this._XRNode.setMatrix(this._initialXRNodeMatrix);
        }
        /** @internal */
        _updateCanvasSize(width, height) {
            this._viewer.canvas.width = width;
            this._viewer.canvas.height = height;
        }
        /** @internal */
        _setLeftTransformMatrix(mat) {
            this._leftTransformMatrix = mat;
        }
        /** @internal */
        _setLeftProjectionMatrix(mat) {
            this._leftProjectionMatrix = mat;
        }
        /** @internal */
        _setRightTransformMatrix(mat) {
            this._rightTransformMatrix = mat;
        }
        /** @internal */
        _setRightProjectionMatrix(mat) {
            this._rightProjectionMatrix = mat;
        }
        get HeadMatrix() {
            return this._HeadMatrix.clone();
        }
        get HeadWorldMatrix() {
            return this._HeadWorldMatrix.clone();
        }
        /** @internal */
        _setCameraSystemExternalFrameBuffer(framebuffer) {
            this._cameraSystem.setExternalFrameBuffer(framebuffer);
        }
        /** @internal */
        _is_cameraSystemActive() {
            return this._is_cameraSystem_active;
        }
        /** @internal */
        _toggleCameraSystem(activate) {
            if (activate && !this._is_cameraSystemActive()) {
                this._viewer.setCameraSystem(this._cameraSystem);
                this._viewpoint.setControlActive({ viewpoint: false, picking: false });
            }
            else if (!activate && this._is_cameraSystemActive()) {
                this._viewer.setCameraSystem(null);
                this._viewpoint.setControlActive({ viewpoint: false, picking: true });
            }
            this._is_cameraSystem_active = activate;
        }
        get viewer() {
            return this._viewer;
        }
        get viewpoint() {
            return this._viewpoint;
        }
        get XRNode() {
            return this._XRNode;
        }
        get XRObjects() {
            return this._XRObjects;
        }
        /** @internal */
        _computeXRCamera(transformMatrix, projectionMatrix, camera, near, far, computeHeadMatrix) {
            camera.matrix = this._XRNode.getMatrixWorld().multiply(transformMatrix);
            camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
            this._viewpoint.moveTo({ eyePosition: camera.position, orientation: camera.quaternion, duration: 0 });
            if (computeHeadMatrix) {
                this._HeadWorldMatrix = this._XRNode.getMatrix().multiply(transformMatrix);
                this._HeadWorldMatrix.rotateX(-0.5 * Math.PI);
                this._HeadMatrix = transformMatrix.clone().rotateX(-0.5 * Math.PI);
            }
            for (let i = 0; i < 16; ++i) {
                if (i === 10) {
                    camera.projectionMatrix.elements[i] = -(far + near) / (far - near);
                }
                else if (i === 14) {
                    camera.projectionMatrix.elements[i] = -2 * far * near / (far - near);
                }
                else {
                    camera.projectionMatrix.elements[i] = projectionMatrix.elements[i];
                }
            }
            camera.externalProjectionMatrix = true;
        }
        _xrComputeStereoCameras(vpt, near, far) {
            if (!this._leftTransformMatrix) {
                return [];
            }
            near = Math.min(100, near);
            far = Math.max(100000, far);
            const leftCamera = vpt.camera.clone();
            const rightCamera = vpt.camera.clone();
            this._computeXRCamera(this._leftTransformMatrix, this._leftProjectionMatrix, leftCamera, near, far, false);
            this._computeXRCamera(this._rightTransformMatrix, this._rightProjectionMatrix, rightCamera, near, far, false);
            const leftWorldDec = this._XRNode.getMatrix().multiply(this._leftTransformMatrix).decompose();
            const rightWorldDec = this._XRNode.getMatrix().multiply(this._rightTransformMatrix).decompose();
            this._HeadWorldMatrix = new THREE.Matrix4().compose(leftWorldDec[0].add(rightWorldDec[0]).multiplyScalar(0.5), rightWorldDec[1], new THREE.Vector3(1, 1, 1)).rotateX(-0.5 * Math.PI);
            const leftData = this._leftTransformMatrix.decompose();
            const rightData = this._rightTransformMatrix.decompose();
            this._HeadMatrix = new THREE.Matrix4().compose(leftData[0].add(rightData[0]).multiplyScalar(0.5), leftData[1], new THREE.Vector3(1, 1, 1)).rotateX(-0.5 * Math.PI);
            return [leftCamera, rightCamera];
        }
        /** @internal */
        displayXRMesh(iOnOff) {
            this._displayXRMesh = iOnOff;
            if (this._isBackgroundtransparent) {
                this._XRMeshes.setVisibility(iOnOff);
            }
        }
        /** @internal */
        isdisplayingXRMesh() {
            return this._displayXRMesh;
        }
        /** @internal */
        _setTransparentBackground(iOnOff) {
            if (iOnOff) {
                this._restoreEnv = true;
                if (WebVisuXRToolkitConfigManager.instance.settings.get("UseBasicAmbienceInPassthrough") === true) {
                    this._viewer.setVisuEnvOCA("Basic");
                }
                else {
                    this._passthroughAmbiance = new Ambience({ viewer: this._viewer });
                    this._passthroughAmbiance.setAutoGroundOffset(false);
                    this._estimatedDirectionalLight = new DirectionalLightNode({ color: new THREE.Color(0xffffff), intensity: 5 }, "Estimated XR Light");
                    //this._estimatedDirectionalLight.setMatrix(new THREE.Matrix4());
                    this._estimatedDirectionalLight.castShadows(true);
                    this._passthroughAmbiance.addLightNode(this._estimatedDirectionalLight);
                    this._passthroughAmbiance.generateIBLFromColor([61, 200, 0, 124], THREE.LogLUV_Encoding);
                    if (this._lightProbe) {
                        //this._estimatedDirectionalLight.attachToViewpoint(true);
                        if (this._previousListener !== undefined) {
                            this._lightProbe.removeEventListener('reflectionchange', this._previousListener);
                        }
                        const listener = () => {
                            const cubeMap = this._xrWebGLBinding.getReflectionCubeMap(this._lightProbe);
                            this._passthroughAmbiance.setBackGroundMap({ texture: cubeMap, mapping: new THREE.CubeReflectionMapping() });
                        };
                        this._lightProbe.addEventListener('reflectionchange', listener);
                        this._previousListener = listener;
                    }
                    this._viewer.setAmbience(this._passthroughAmbiance);
                    this._viewer.enableDefaultLights(false);
                    this._viewer.setShadow(true);
                    this._viewer.setTransparentShadow(true);
                    this._viewer.setGroundShadow(false);
                }
                this._viewer.setBackgroundColor('rgb(255,0,0)', 0);
                this._viewer.displayInfinitePlane(false);
                this._viewer.setGrid(false, false);
                if (this._displayXRMesh) {
                    this._XRMeshes.setVisibility(true);
                }
            }
            else {
                //console.log("setting previous env", this._previousEnv, new Error().stack)
                this._viewer.enableDefaultLights(true);
                if (this._previousAmbiance.isOCA) {
                    this._viewer.setVisuEnvOCA(this._previousVisuEnv || "Basic");
                }
                else {
                    //this._viewer.setAmbience(this._previousAmbiance)
                    this._viewer.setVisuEnvOCA("Basic");
                }
                this._viewer.setBackgroundColor(this._backgroundColor, 1);
                this._viewer.displayInfinitePlane(true);
                this._viewer.setGrid(true, false);
                this._XRMeshes.setVisibility(false);
            }
            this._isBackgroundtransparent = iOnOff;
        }
        getXRPlanesPoses() {
            const res = new Array();
            for (const plane of this._XRplanes) {
                if (plane[1][1] !== undefined) {
                    res.push(plane[1][1]);
                }
            }
            return res;
        }
        getXRMesh() {
            return this._XRMeshes;
        }
        updateLightEstimation(frame) {
            if (this._lightProbe && this._isBackgroundtransparent) {
                //console.log("this._lightProbe", this._lightProbe, this._estimatedDirectionalLight)
                const lightEstimate = frame.getLightEstimate(this._lightProbe);
                if (lightEstimate) {
                    const shArray = lightEstimate.sphericalHarmonicsCoefficients;
                    const Y00 = 0.282095;
                    const r = shArray[0], g = shArray[1], b = shArray[2];
                    const avgR = r * Y00, avgG = g * Y00, avgB = b * Y00;
                    const luminance = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;
                    const exposure = 0.18 / (luminance + 1e-6);
                    this._passthroughAmbiance.setExposure(exposure * 1.5);
                    //console.log("lightEstimate", lightEstimate)
                    const lightDirection = new THREE.Vector3(lightEstimate.primaryLightDirection.x, -lightEstimate.primaryLightDirection.z, lightEstimate.primaryLightDirection.y).applyQuaternion(this._XRNode.getMatrixWorld().decompose()[1]);
                    this._viewer.getRootNode().removeChild(this.XRObjects);
                    const sceneBoundingSphere = this._viewer.getRootNode().getBoundingSphere();
                    this._viewer.getRootNode().addChild(this.XRObjects);
                    const centerOfScene = sceneBoundingSphere.center;
                    this._estimatedDirectionalLight.setMatrix(new THREE.Matrix4().setPosition(centerOfScene.clone().sub(lightDirection)));
                    this._estimatedDirectionalLight.setDirection(lightDirection);
                    // For the directional light we have to normalize the color and set the scalar as the
                    // intensity, since WebXR can return color values that exceed 1.0.
                    const intensityScalar = Math.max(1.0, Math.max(lightEstimate.primaryLightIntensity.x, Math.max(lightEstimate.primaryLightIntensity.y, lightEstimate.primaryLightIntensity.z)));
                    this._estimatedDirectionalLight.setColor(new THREE.Color().setRGB(lightEstimate.primaryLightIntensity.x / intensityScalar, lightEstimate.primaryLightIntensity.y / intensityScalar, lightEstimate.primaryLightIntensity.z / intensityScalar));
                    this._estimatedDirectionalLight.setIntensity(intensityScalar / 5);
                }
            }
        }
        updateXRPlanes(frame, xrReferenceSpace) {
            const detectedPlanes = frame.detectedPlanes;
            let gotFirstPlane = false;
            if (detectedPlanes) {
                // First, let’s check if any of the planes we knew about is no longer tracked:
                for (const [plane, _] of this._XRplanes) {
                    if (!detectedPlanes.has(plane)) {
                        // Handle removed plane - `plane` was present in previous frame,
                        // but is no longer tracked.
                        // We know the plane no longer exists, remove it from the map:
                        this._XRplanes.delete(plane);
                    }
                }
                // Then, let’s handle all the planes that are still tracked.
                // This consists both of tracked planes that we have previously seen (may have
                // been updated), and new planes.
                detectedPlanes.forEach(plane => {
                    // Irrespective of whether the plane was previously seen or not,
                    // & updated or not, its pose MAY have changed:
                    const planePose = frame.getPose(plane.planeSpace, xrReferenceSpace);
                    const planeMatrix = planePose ? (0, WebVisuXRToolkitHelpers_1.convertXRRigidTransform)(planePose.transform) : undefined;
                    if (this._XRplanes.has(plane)) {
                        // Handle previously-seen plane:
                        if (plane.lastChangedTime > this._XRplanes.get(plane)[0]) {
                            // Handle previously seen plane that was updated.
                            // It means that one of the plane’s properties is different than
                            // it used to be - most likely, the polygon has changed.
                            // Render / prepare the plane for rendering, etc.
                            // Update the time when we have updated the plane:
                            this._XRplanes.set(plane, [plane.lastChangedTime, planeMatrix]);
                        }
                        else {
                            // Handle previously seen plane that was not updated in current frame.
                            // Note that plane’s pose relative to some other space MAY have changed.
                        }
                    }
                    else {
                        // Handle new plane.
                        if (this._XRplanes.size === 0) {
                            gotFirstPlane = true;
                            if (WebVisuXRToolkitConfigManager.instance.settings.get("ObjectsOnGround")) {
                                this._XRNode.setMatrix(this._XRNode.getMatrix().translate(new THREE.Vector3(0, 0, -planeMatrix.decompose()[0].z)));
                            }
                        }
                        // Set the time when we have updated the plane:
                        this._XRplanes.set(plane, [plane.lastChangedTime, planeMatrix]);
                    }
                });
            }
            return gotFirstPlane;
        }
        updateXRMeshes(frame, xrReferenceSpace) {
            const detectedMeshes = frame.detectedMeshes;
            if (detectedMeshes) {
                for (const [mesh, [_, meshNode]] of this._XRMeshesMap) {
                    if (!detectedMeshes.has(mesh)) {
                        this._XRMeshesMap.delete(mesh);
                        this._XRMeshes.removeChild(meshNode);
                    }
                }
                detectedMeshes.forEach(mesh => {
                    const planePose = frame.getPose(mesh.meshSpace, xrReferenceSpace);
                    const meshMatrix = planePose ? (0, WebVisuXRToolkitHelpers_1.convertXRRigidTransformScale)(planePose.transform) : new THREE.Matrix4().scale(new THREE.Vector3(1000, 1000, 1000));
                    if (this._XRMeshesMap.has(mesh)) {
                        if (mesh.lastChangedTime > this._XRMeshesMap.get(mesh)[0]) {
                            this._XRMeshes.removeChild(this._XRMeshesMap.get(mesh)[1]);
                            const node = ProcessMesh(mesh);
                            if (node) {
                                node.setMatrix(meshMatrix);
                                this._XRMeshes.addChild(node);
                                this._XRMeshesMap.set(mesh, [mesh.lastChangedTime, node]);
                            }
                        }
                        else {
                            this._XRMeshesMap.get(mesh)[1].setMatrix(meshMatrix);
                        }
                    }
                    else {
                        const node = ProcessMesh(mesh);
                        if (node) {
                            node.setMatrix(meshMatrix);
                            this._XRMeshes.addChild(node);
                            //(this._XRMeshes as any).buildAccelerationStructure(false)
                            this._XRMeshesMap.set(mesh, [mesh.lastChangedTime, node]);
                        }
                    }
                });
            }
        }
    }
    exports.WebVisuXRToolkitSceneManager = WebVisuXRToolkitSceneManager;
    function ProcessMesh(xrMesh) {
        if (xrMesh.semanticLabel) {
            if (xrMesh.semanticLabel === "global mesh") {
                const mesh = new Mesh.PrimitiveGroup();
                const posBuffer = new Mesh.Buffer();
                posBuffer.component = Mesh.VertexComponentEnum.POSITION;
                posBuffer.data = xrMesh.vertices;
                const posIdxBuffer = new Mesh.Buffer();
                posIdxBuffer.indexBuffer = true;
                posIdxBuffer.data = new Uint16Array(xrMesh.indices.map(value => value & 0xFFFF));
                mesh.addBuffer(0, posBuffer);
                mesh.addBuffer(1, posIdxBuffer);
                // Compute normals
                const normals = new Float32Array(xrMesh.vertices.length);
                for (let i = 0; i < xrMesh.indices.length; i += 3) {
                    const i0 = xrMesh.indices[i];
                    const i1 = xrMesh.indices[i + 1];
                    const i2 = xrMesh.indices[i + 2];
                    const v0 = xrMesh.vertices.slice(i0 * 3, i0 * 3 + 3);
                    const v1 = xrMesh.vertices.slice(i1 * 3, i1 * 3 + 3);
                    const v2 = xrMesh.vertices.slice(i2 * 3, i2 * 3 + 3);
                    const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
                    const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
                    const normal = [
                        -(edge1[1] * edge2[2] - edge1[2] * edge2[1]),
                        -(edge1[2] * edge2[0] - edge1[0] * edge2[2]),
                        -(edge1[0] * edge2[1] - edge1[1] * edge2[0])
                    ];
                    const length = Math.hypot(normal[0], normal[1], normal[2]);
                    if (length > 0) {
                        normal[0] /= length;
                        normal[1] /= length;
                        normal[2] /= length;
                    }
                    normals.set(normal, i0 * 3);
                    normals.set(normal, i1 * 3);
                    normals.set(normal, i2 * 3);
                }
                const normalBuffer = new Mesh.Buffer();
                normalBuffer.component = Mesh.VertexComponentEnum.NORMAL;
                normalBuffer.data = normals;
                mesh.addBuffer(2, normalBuffer);
                const face = new Mesh.Primitive();
                face.nbIndices = posIdxBuffer.data.length;
                face.connectivity = Mesh.ConnectivityTypeEnum.TRIANGLES;
                const posComp = new Mesh.VertexComponent();
                posComp.nbVertices = posBuffer.data.length / 3;
                posComp.bufferId = 0;
                const normalComp = new Mesh.VertexComponent();
                normalComp.nbVertices = normalBuffer.data.length / 3;
                normalComp.bufferId = 2;
                const meshIdxArray = new Mesh.IndexArray();
                meshIdxArray.bufferId = 1;
                meshIdxArray.offset = 0; // Offset properly for each face
                posComp.indices = meshIdxArray;
                normalComp.indices = meshIdxArray;
                face.addVertexComponent(posComp);
                face.addVertexComponent(normalComp);
                mesh.addPrimitive(face);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    force: true
                });
                material.opacity = 0.5;
                material.transparent = true;
                const node = SceneGraphFactoryStatic.createMeshNode(mesh, material);
                node.setName("XRMesh obj");
                return node;
            }
        }
        else {
            console.warn("got no semantic on that mesh", xrMesh);
        }
        return null;
    }
});
