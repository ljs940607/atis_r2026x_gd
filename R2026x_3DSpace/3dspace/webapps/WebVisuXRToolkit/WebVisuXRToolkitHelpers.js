define("DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", ["require", "exports", "DS/Visualization/Node3D", "DS/Visualization/SceneGraphFactory", "DS/Visualization/ThreeJS_DS", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuGLTF/GLTFLoader"], function (require, exports, Node3D, SceneGraphFactoryStatic, THREE, WebappsUtils_1, GLTFLoader) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeRotationMatrix = makeRotationMatrix;
    exports.lookAt = lookAt;
    exports.getDebugAxis = getDebugAxis;
    exports.getDebugAxisGLB = getDebugAxisGLB;
    exports.convertXRRigidTransform = convertXRRigidTransform;
    exports.convertXRRigidTransformScale = convertXRRigidTransformScale;
    exports.getWebXRCapabilitiesLite = getWebXRCapabilitiesLite;
    exports.getWebXRCapabilities = getWebXRCapabilities;
    // up is always (0,0,1)
    function makeRotationMatrix(from, to, up = new THREE.Vector3(0, 0, 1)) {
        const front = to.clone().sub(from).normalize();
        let right = new THREE.Vector3().crossVectors(front, up).normalize();
        // If `right` is zero-length (line is aligned with up), pick another perpendicular vector
        if (right.lengthSq() < Number.EPSILON) {
            right = new THREE.Vector3(1, 0, 0);
        }
        const correctedUp = new THREE.Vector3().crossVectors(right, front).normalize();
        return new THREE.Matrix4().makeBasis(right, front, correctedUp);
    }
    /**
     * @param node to affect
     * @param at matrix of the node facing the affected node
     * @param position to move the node to affect to
     */
    function lookAt(node, at, position = undefined, scale = 1) {
        if (!position)
            position = node.getMatrix().decompose()[0];
        let lookRotationMatrix = makeRotationMatrix(position, at.decompose()[0]);
        node.setMatrix(new THREE.Matrix4().compose(position, new THREE.Quaternion().setFromRotationMatrix(lookRotationMatrix), new THREE.Vector3(scale, scale, scale)));
    }
    function getDebugAxis() {
        const node = new Node3D();
        node.addChild(SceneGraphFactoryStatic.createCuboidNode({
            cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
            firstAxis: new THREE.Vector3(10.0, 0.0, 0.0),
            secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
            thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
            material: new THREE.MeshBasicMaterial({
                color: "red",
                force: true
            })
        }));
        node.addChild(SceneGraphFactoryStatic.createCuboidNode({
            cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
            firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
            secondAxis: new THREE.Vector3(0.0, 10.0, 0.0),
            thirdAxis: new THREE.Vector3(0.0, 0.0, 1.0),
            material: new THREE.MeshBasicMaterial({
                color: "green",
                force: true
            })
        }));
        node.addChild(SceneGraphFactoryStatic.createCuboidNode({
            cornerPoint: new THREE.Vector3(0.0, 0.0, 0.0),
            firstAxis: new THREE.Vector3(1.0, 0.0, 0.0),
            secondAxis: new THREE.Vector3(0.0, 1.0, 0.0),
            thirdAxis: new THREE.Vector3(0.0, 0.0, 10.0),
            material: new THREE.MeshBasicMaterial({
                color: "blue",
                force: true
            })
        }));
        return node;
    }
    async function getDebugAxisGLB() {
        const loader = new GLTFLoader();
        return loader.load((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitDebug", "models/dbg_coordinate_system_8mm.glb"));
    }
    function convertXRRigidTransform(transform) {
        const pos = new THREE.Vector3(transform.position.x * 1000, transform.position.y * 1000, transform.position.z * 1000);
        const orientation = new THREE.Quaternion(transform.orientation.x, transform.orientation.y, transform.orientation.z, transform.orientation.w);
        const res = new THREE.Matrix4().compose(pos, orientation, new THREE.Vector3(1, 1, 1));
        return new THREE.Matrix4().rotateX(0.5 * Math.PI).rotateY(Math.PI).multiply(res).rotateX(-0.5 * Math.PI);
    }
    function convertXRRigidTransformScale(transform) {
        const pos = new THREE.Vector3(transform.position.x * 1000, transform.position.y * 1000, transform.position.z * 1000);
        const orientation = new THREE.Quaternion(transform.orientation.x, transform.orientation.y, transform.orientation.z, transform.orientation.w);
        const res = new THREE.Matrix4().compose(pos, orientation, new THREE.Vector3(1000, 1000, 1000));
        return new THREE.Matrix4().rotateX(0.5 * Math.PI).rotateY(Math.PI).multiply(res);
    }
    async function getWebXRCapabilitiesLite() {
        if (navigator.xr) {
            return {
                "WebXRAvailable": (await navigator.xr.isSessionSupported('immersive-ar') || await navigator.xr.isSessionSupported('immersive-vr')),
                "MixedRealityAvailable": await navigator.xr.isSessionSupported('immersive-ar'),
                "HitTestAvailable": undefined,
                "HandTrackingAvailable": undefined,
                "isSmartphone": undefined,
                "resolution": undefined,
            };
        }
        return {
            "WebXRAvailable": false,
            "MixedRealityAvailable": false,
            "HitTestAvailable": false,
            "HandTrackingAvailable": false,
            "isSmartphone": false,
            "resolution": { "width": 0, "height": 0 }
        };
    }
    async function getWebXRCapabilities() {
        console.warn("In order for the function getWebXRCapabilities() to work, we need it to be called after a button press");
        const canvas = new OffscreenCanvas(800, 600);
        const context = canvas.getContext("webgl");
        if (navigator.xr) {
            const res = {
                "WebXRAvailable": (await navigator.xr.isSessionSupported('immersive-ar') || await navigator.xr.isSessionSupported('immersive-vr')),
                "MixedRealityAvailable": await navigator.xr.isSessionSupported('immersive-ar'),
                "HitTestAvailable": false,
                "HandTrackingAvailable": false,
                "isSmartphone": undefined,
                "resolution": { "width": 0, "height": 0 },
            };
            if (res.WebXRAvailable && context) {
                const mode = res.MixedRealityAvailable ? "immersive-ar" : "immersive-vr";
                const xrDummySession = await navigator.xr.requestSession(mode, {
                    requiredFeatures: ['local-floor'],
                    optionalFeatures: ["hand-tracking", "bounded-floor", "hit-test"]
                });
                if (context.makeXRCompatible) {
                    await context.makeXRCompatible();
                }
                const glBaseLayer = new XRWebGLLayer(xrDummySession, context, {
                    alpha: false
                });
                xrDummySession.updateRenderState({
                    baseLayer: glBaseLayer
                });
                const enabledFeatures = xrDummySession.enabledFeatures;
                if (enabledFeatures && enabledFeatures.includes('hit-test')) {
                    res.HitTestAvailable = true;
                }
                if (enabledFeatures && enabledFeatures.includes('hand-tracking')) {
                    res.HandTrackingAvailable = true;
                }
                const viewer_ref_space = await xrDummySession.requestReferenceSpace("bounded-floor").catch(error => { return xrDummySession.requestReferenceSpace("local-floor"); });
                return new Promise((resolve, reject) => {
                    const debugAnimationFrame = (time, frame) => {
                        const pose = frame.getViewerPose(viewer_ref_space);
                        if (pose) {
                            const views = pose.views;
                            let isStereoRendering = views.length === 2;
                            const glLayer = xrDummySession.renderState.baseLayer;
                            let viewport_view1;
                            let viewport_view2;
                            if (glLayer) {
                                viewport_view1 = glLayer.getViewport(views[0]);
                                if (views.length > 1) {
                                    viewport_view2 = glLayer.getViewport(views[1]);
                                }
                            }
                            if (viewport_view1) {
                                if (viewport_view1.width === 0 || !views[0].eye || views[0].eye === 'none') {
                                    // Here we assume that it is always the second view (right eye) that is of width 0
                                    // Needed for the meta immersive emulator chrome in mono rendering mode at the date of 01/02/2025 or native android chrome before 01/06/2023
                                    isStereoRendering = false;
                                }
                                res.resolution.width += viewport_view1.width;
                                res.resolution.height = viewport_view1.height;
                            }
                            if (viewport_view2) {
                                if (viewport_view2.width === 0 || !views[1].eye || views[1].eye === 'none') {
                                    // Here we assume that it is always the second view (right eye) that is of width 0
                                    // Needed for the meta immersive emulator chrome in mono rendering mode at the date of 01/02/2025 or native android chrome before 01/06/2023
                                    isStereoRendering = false;
                                }
                                res.resolution.width += viewport_view2.width;
                                res.resolution.height = viewport_view2.height;
                            }
                            res.isSmartphone = !isStereoRendering;
                            xrDummySession.end();
                            resolve(res);
                        }
                        else {
                            xrDummySession.requestAnimationFrame(debugAnimationFrame);
                        }
                    };
                    xrDummySession.requestAnimationFrame(debugAnimationFrame);
                });
            }
            else {
                return res;
            }
        }
        return {
            "WebXRAvailable": false,
            "MixedRealityAvailable": false,
            "HitTestAvailable": false,
            "HandTrackingAvailable": false,
            "isSmartphone": false,
            "resolution": { "width": 0, "height": 0 }
        };
    }
});
