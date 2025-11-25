/// <amd-module name="DS/WebVisuXRToolkit/WebVisuXRToolkitManager"/>
define("DS/WebVisuXRToolkit/WebVisuXRToolkitManager", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInputManager", "DS/WebVisuXRToolkit/WebVisuXRToolkitSceneManager", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIManager", "DS/WebVisuXRToolkit/dev/FPSCounter", "DS/WebVisuXRToolkit/dev/DebugTooltip", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController", "DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUITutorialNode", "DS/WebVisuXRToolkit/WebVisuXRToolkit"], function (require, exports, THREE, WebVisuXRToolkitInputManager_1, WebVisuXRToolkitSceneManager_1, WebVisuXRToolkitConfigManager, WebVisuXRToolkitUIManager_1, FPSCounter_1, DebugTooltip_1, WebVisuXRToolkitInput_1, WebVisuXRToolkitUIEventController_1, WebVisuXRToolkitUITutorialNode_1, WebVisuXRToolkit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitManager = void 0;
    /**
     * This file is the main entrypoint of WebVisuXRToolkit
     * This Singleton requests every information from the WebXR Browser API and converts its basis to 3DS Basis convention
     * This class also handles the new main loop with XR Animation frames
     */
    function convertXRRigidTransformViewpoint(transform) {
        const pos = new THREE.Vector3(transform.position.x * 1000, transform.position.y * 1000, transform.position.z * 1000);
        const orientation = new THREE.Quaternion(transform.orientation.x, transform.orientation.y, transform.orientation.z, transform.orientation.w);
        const res = new THREE.Matrix4().compose(pos, orientation, new THREE.Vector3(1, 1, 1));
        return new THREE.Matrix4().rotateX(0.5 * Math.PI).rotateY(Math.PI).multiply(res);
    }
    class WebVisuXRToolkitManager {
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            throw new Error("WebVisuXRToolkitManager not initialized");
        }
        get sceneManager() {
            return this._sceneManager;
        }
        get inputManager() {
            return this._inputManager;
        }
        get UIManager() {
            return this._UIManager;
        }
        get skillsManager() {
            return this._skillsManager;
        }
        constructor(session, referenceSpace, xrContext, mode, sceneManager, skillsManager, domOverlay, xr_binding) {
            this._inputManager = new WebVisuXRToolkitInputManager_1.WebVisuXRToolkitInputManager();
            this._isFirstFrameDrawn = false;
            this._previousTime = 0.0;
            this._dt = 0.0;
            this.onAnimationFrame = (time, frame) => {
                this._dt = (time - this._previousTime) * 0.001;
                this._previousTime = time;
                this._session.requestAnimationFrame(this.onAnimationFrame);
                const pose = frame.getViewerPose(this._referenceSpace);
                if (pose) {
                    /*this.session.updateRenderState({
                        depthNear: 0.1,
                        depthFar: Infinity
                    });*/
                    const views = pose.views;
                    const glLayer = this._session.renderState.baseLayer;
                    let totalWidth = 0;
                    let totalHeight = 0;
                    let isStereoRendering = views.length === 2;
                    for (let i = 0; i < views.length; i++) {
                        let viewport;
                        if (glLayer) {
                            viewport = glLayer.getViewport(views[i]);
                        }
                        else if (this._xr_binding && this.glProjLayer) {
                            const glSubImage = this._xr_binding.getViewSubImage(this.glProjLayer, views[i]);
                            viewport = glSubImage.viewport;
                            // For side-by-side projection, we only produce a single texture for both eyes.
                            if (i === 0) {
                                this._XRrenderTarget.__webglTexture = [glSubImage.colorTexture];
                                //this._XRrenderTarget.depthTexture.__webglTexture = glProjLayer.ignoreDepthValues ? undefined : glSubImage.depthStencilTexture;
                            }
                        }
                        if (viewport) {
                            if (viewport.width === 0 || !views[i].eye || views[i].eye === 'none') {
                                // Here we assume that it is always the second view (right eye) that is of width 0
                                // Needed for the meta immersive emulator chrome in mono rendering mode at the date of 01/02/2025 or native android chrome before 01/06/2023
                                isStereoRendering = false;
                            }
                            totalHeight = viewport.height;
                            totalWidth += viewport.width;
                            this.mapCameraToXREye(viewport, views[i]);
                        }
                    }
                    this._sceneManager._updateCanvasSize(totalWidth, totalHeight);
                    if (isStereoRendering && (!this._isFirstFrameDrawn || !this.sceneManager._is_cameraSystemActive())) {
                        console.log("going stereo rendering");
                        this._sceneManager._toggleCameraSystem(true);
                    }
                    else if (!isStereoRendering && (!this._isFirstFrameDrawn || this.sceneManager._is_cameraSystemActive())) {
                        if (!this._isFirstFrameDrawn) {
                            this._sceneManager._toggleCameraSystem(true); // Needed for correct initialisation for ODTs. Otherwise leads to wrong canvas size
                        }
                        console.log("going mono rendering");
                        this._sceneManager._toggleCameraSystem(false);
                        if (WebVisuXRToolkitConfigManager.instance.settings.get("ForceMixedRealityInMonoRendering")) {
                            this.setMixedRealityMode(true);
                        }
                        const inputs = this._inputManager.getInputs();
                        if (inputs.left) {
                            inputs.left.setMixedRealityMode(this._isMixedRealityActive);
                        }
                        if (inputs.right) {
                            inputs.right.setMixedRealityMode(this._isMixedRealityActive);
                        }
                        for (const input of inputs.others) {
                            if (input instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                                input.setMixedRealityMode(this._isMixedRealityActive);
                            }
                        }
                    }
                    if (glLayer) {
                        //console.log("glLayer.framebuffer", glLayer.framebuffer);
                        this._XRrenderTarget.__webglFramebuffer = glLayer.framebuffer;
                        this._XRrenderTarget.__webglTexture = [];
                    }
                    if (isStereoRendering) {
                        if (glLayer) {
                            this._sceneManager._setCameraSystemExternalFrameBuffer(glLayer.framebuffer);
                        }
                    }
                    else {
                        this._sceneManager.viewer.setXRRenderTarget(this._XRrenderTarget);
                    }
                    const enabledFeatures = this._session.enabledFeatures;
                    if (enabledFeatures && enabledFeatures.includes('depth-sensing') && this._xr_binding) {
                        const depthData = this._xr_binding.getDepthInformation(views[0]);
                        if (depthData && depthData.texture) {
                            //depthSensing.init(renderer, depthData, session.renderState);
                        }
                    }
                }
                this._inputManager.update(this._session.inputSources, frame, this._referenceSpace, this.sceneManager.HeadWorldMatrix, this.sceneManager.XRNode.getMatrix(), this._skillsManager);
                this._sceneManager.updateLightEstimation(frame);
                const gotFirstPlane = this._sceneManager.updateXRPlanes(frame, this._referenceSpace);
                if (gotFirstPlane) {
                    this._UIManager.hideNoPlanesDetectedImage();
                }
                this._sceneManager.updateXRMeshes(frame, this._referenceSpace);
                this._UIManager._update(time, this._dt, this.sceneManager.XRObjects);
                WebVisuXRToolkitUIEventController_1.WebVisuXRToolkitUIEventController.instance.emit(WebVisuXRToolkitUIEventController_1.XREvents.FrameChanged);
                if (!this._isFirstFrameDrawn) // This one can be called before the first render
                 {
                    if (!this._sceneManager._is_cameraSystemActive() && WebVisuXRToolkitConfigManager.instance.settings.get("ForceMixedRealityInMonoRendering")) {
                        this.setMixedRealityMode(true);
                    }
                }
                this._sceneManager.viewer.render();
                this._sceneManager.viewer.animate();
                if (!this._isFirstFrameDrawn) // this one has to be called after render because the variable HeadMatrix needs to be set first
                 {
                    this._isFirstFrameDrawn = true;
                    this._sceneManager.setupXRNodeMatrix();
                }
            };
            this._sceneManager = sceneManager;
            this._skillsManager = skillsManager;
            this._xr_binding = xr_binding;
            this._isMixedRealityAvailable = mode === "immersive-ar";
            this._isMixedRealityActive = false;
            this._isDisplayingIndicators = WebVisuXRToolkitConfigManager.instance.settings.get("DisplayControllerIndicatorsOnStart");
            this.displayIndicators(this._isDisplayingIndicators);
            this._UIManager = new WebVisuXRToolkitUIManager_1.WebVisuXRToolkitUIManager(sceneManager.XRObjects, this._skillsManager, domOverlay, this._isMixedRealityAvailable, this._inputManager);
            this._UIManager.closingCrossImage.addEventListener("click", () => {
                this.endSession();
            });
            let fpsCounterNode = null;
            if (WebVisuXRToolkitConfigManager.instance.devMode.active && WebVisuXRToolkitConfigManager.instance.devMode.options.get("fpsCounter")) {
                fpsCounterNode = new FPSCounter_1.FPSCounterNode(this._UIManager.domUI);
                this._sceneManager.XRObjects.addChild(fpsCounterNode);
            }
            let debugTooltipNode = null;
            if (WebVisuXRToolkitConfigManager.instance.devMode.active && WebVisuXRToolkitConfigManager.instance.devMode.options.get("debugTooltip")) {
                debugTooltipNode = new DebugTooltip_1.DebugTooltipNode(this._UIManager.domUI);
                this._sceneManager.XRObjects.addChild(debugTooltipNode);
            }
            this._session = session;
            this._referenceSpace = referenceSpace;
            this._xrContext = xrContext;
            this._lockCamera = WebVisuXRToolkitConfigManager.instance.devMode.active && WebVisuXRToolkitConfigManager.instance.devMode.options.get("lockCamera");
            this._session.addEventListener('end', () => {
                console.log("XR Session ending");
                WebVisuXRToolkitConfigManager.instance.dispatchEvent(new Event("XRSessionEnded"));
                if (fpsCounterNode) {
                    this._sceneManager.viewer.removeNode(fpsCounterNode);
                }
                if (debugTooltipNode) {
                    this._sceneManager.viewer.removeNode(debugTooltipNode);
                }
                this._inputManager.destroy(this._sceneManager.XRNode, this._skillsManager);
                this._inputManager = null;
                this._UIManager.cleanUI();
                this._UIManager = null;
                this._sceneManager._restoreSceneGraph();
                this._sceneManager = null;
                WebVisuXRToolkitManager._instance = null;
            });
            this._session.addEventListener("inputsourceschange", async (event) => {
                this._inputManager.removeSources(event.removed, this._sceneManager.XRNode, this._skillsManager);
                const inputs = this._inputManager.addSources(event.added, this._sceneManager.XRNode, session, this._isMixedRealityActive, this._isDisplayingIndicators);
                skillsManager.pruneSelectedSkills(inputs);
                for (const input of inputs) {
                    skillsManager._declareAvailableActions(input);
                }
            });
            const attributes = xrContext.getContextAttributes();
            const framebufferScaleFactor = 1.0;
            const RGBAFormat = 1023;
            const UnsignedByteType = 1009;
            //if (session.renderState.layers === undefined)
            {
                console.log("Should render inside baselayer");
                const layerInit = {
                    antialias: attributes.antialias,
                    alpha: true,
                    depth: attributes.depth,
                    stencil: attributes.stencil,
                    framebufferScaleFactor: framebufferScaleFactor
                };
                this.glBaseLayer = new XRWebGLLayer(this._session, this._xrContext, layerInit);
                this._session.updateRenderState({
                    baseLayer: this.glBaseLayer
                });
                this._XRrenderTarget = new THREE.WebGLRenderTarget(this.glBaseLayer.framebufferWidth, this.glBaseLayer.framebufferHeight, {
                    format: RGBAFormat,
                    type: UnsignedByteType,
                    //colorSpace: renderer.outputColorSpace,
                    stencilBuffer: attributes.stencil
                });
            }
            /*else
            {
                console.log("Should render inside target projection layer Texture")
                let glDepthFormat = 0;
    
                if (attributes.depth)
                {
                    glDepthFormat = attributes.stencil ? this._xrContext.DEPTH_STENCIL : this._xrContext.DEPTH_COMPONENT;
                }
    
                const projectionlayerInit = {
                    colorFormat: this._xrContext.RGBA,
                    depthFormat: 0,//glDepthFormat,
                    scaleFactor: framebufferScaleFactor
                };
    
    
                this.glProjLayer = this._xr_binding.createProjectionLayer(projectionlayerInit);
                session.updateRenderState({ layers: [this.glProjLayer] });
    
                //renderer.setSize(glProjLayer.textureWidth, glProjLayer.textureHeight, false);
                this._XRrenderTarget = new THREE.WebGLRenderTarget(
                    this.glProjLayer.textureWidth,
                    this.glProjLayer.textureHeight,
                    {
                        depthBuffer: true,
                        format: RGBAFormat,
                        type: UnsignedByteType,
                        //depthTexture: new DepthTexture(glProjLayer.textureWidth, glProjLayer.textureHeight, depthType, undefined, undefined, undefined, undefined, undefined, undefined, depthFormat),
                        stencilBuffer: attributes.stencil,
                        //colorSpace: renderer.outputColorSpace,
                        //samples: attributes.antialias ? 4 : 0,
                        //resolveDepthBuffer: (this.glProjLayer.ignoreDepthValues === false)
                    });
                (this._XRrenderTarget as any).__webglTexture = [];
                //(this.newRenderTarget as any).__webglTexture = glSubImage.colorTexture;
                //this.newRenderTarget.depthTexture.__webglTexture = glProjLayer.ignoreDepthValues ? undefined : glSubImage.depthStencilTexture;
            }*/
            window.devicePixelRatio = 1.0; // workaround suggested by GON1 for testing on AVP
            session.requestAnimationFrame(this.onAnimationFrame);
        }
        static async createWebVisuXRToolkitManager(viewer, viewpoint, skillsManager) {
            if (this._instance) {
                return this._instance;
            }
            let session;
            let mode;
            const domOverlay = document.createElement('div');
            domOverlay.style.position = 'relative';
            domOverlay.id = "XRDomOverlay";
            document.body.appendChild(domOverlay);
            const allowPassthough = WebVisuXRToolkitConfigManager.instance.settings.get("AllowMixedReality");
            if (navigator.xr) {
                if (allowPassthough && await navigator.xr.isSessionSupported("immersive-ar")) {
                    mode = "immersive-ar";
                    try {
                        session = await navigator.xr.requestSession(mode, {
                            requiredFeatures: ['local-floor'],
                            optionalFeatures: ["hand-tracking", "bounded-floor", "hit-test", "dom-overlay", "plane-detection", "mesh-detection", 'light-estimation'],
                            domOverlay: {
                                root: domOverlay
                            }
                        });
                    }
                    catch (err) {
                        WebVisuXRToolkitConfigManager.instance.dispatchEvent(new Event("WebVisuXRToolkitStartFail"));
                        throw err;
                    }
                }
                else if (await navigator.xr.isSessionSupported('immersive-vr')) {
                    mode = "immersive-vr";
                    try {
                        session = await navigator.xr.requestSession(mode, {
                            requiredFeatures: ['local-floor'],
                            optionalFeatures: ["hand-tracking", "bounded-floor"],
                        });
                    }
                    catch (err) {
                        WebVisuXRToolkitConfigManager.instance.dispatchEvent(new Event("WebVisuXRToolkitStartFail"));
                        throw err;
                    }
                }
                else {
                    console.error('neither AR nor VR are supported');
                    WebVisuXRToolkitConfigManager.instance.dispatchEvent(new Event("WebVisuXRToolkitStartFail"));
                    throw new Error('neither AR nor VR not supported');
                }
            }
            else {
                console.error('WebXR not available');
                WebVisuXRToolkitConfigManager.instance.dispatchEvent(new Event("WebVisuXRToolkitStartFail"));
                throw new Error('WebXR not available');
            }
            if (viewer.renderer.gl.makeXRCompatible) {
                await viewer.renderer.gl.makeXRCompatible();
            }
            let lightProbe = undefined;
            if (session.enabledFeatures) {
                const featuresSet = new Set(session.enabledFeatures);
                if (featuresSet.has("light-estimation")) {
                    lightProbe = await session.requestLightProbe();
                }
            }
            let isPolyfill = false;
            const symbols = Object.getOwnPropertySymbols(navigator.xr);
            if (symbols) {
                for (const symbol of symbols) {
                    if (symbol.description && symbol.description.match(/polyfill/i)) {
                        console.log("Polyfill found, Not creating XRWebGLBinding");
                        isPolyfill = true;
                        break;
                    }
                }
            }
            const xr_binding = isPolyfill || typeof XRWebGLBinding === 'undefined' ? undefined : new XRWebGLBinding(session, viewer.renderer.gl);
            const sceneManager = new WebVisuXRToolkitSceneManager_1.WebVisuXRToolkitSceneManager(viewer, viewpoint, xr_binding, lightProbe);
            //sceneManager.displayXRMesh(WebVisuXRToolkitConfigManager.instance.settings.get("DisplayXRMesh") && mode === "immersive-ar" && WebVisuXRToolkitConfigManager.instance.settings.get("StartInMixedReality"));
            let viewer_ref_space_promise;
            if (WebVisuXRToolkitConfigManager.instance.settings.get("StartOnObject") === false) {
                viewer_ref_space_promise = session.requestReferenceSpace("bounded-floor").catch(error => { return session.requestReferenceSpace("local-floor"); });
            }
            else {
                viewer_ref_space_promise = session.requestReferenceSpace("local-floor");
            }
            //console.log("enabledFeatures", session.enabledFeatures)
            this._instance = new WebVisuXRToolkitManager(session, await viewer_ref_space_promise, viewer.renderer.gl, mode, sceneManager, skillsManager, domOverlay, xr_binding);
            while (!this._instance._isFirstFrameDrawn) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            WebVisuXRToolkitConfigManager.instance.dispatchEvent(new CustomEvent("WebVisuXRToolkitSessionStarted", { detail: session }));
            if (this._instance._isMixedRealityAvailable && WebVisuXRToolkitConfigManager.instance.settings.get("StartInMixedReality")) {
                this._instance.setMixedRealityMode(true);
            }
            if (WebVisuXRToolkitConfigManager.instance.settings.get("DisplayTutorial")) {
                const tuto = new WebVisuXRToolkitUITutorialNode_1.WebVisuXRToolkitUITutorialNode(this._instance._UIManager.domUI);
                this._instance._UIManager.Intersectables.push(tuto);
                for (const skill of skillsManager.listSkills().skillList) {
                    const steps = skill.getTutorialSteps();
                    if (steps.length > 0) {
                        tuto.addSkillSteps(skill.name, steps);
                    }
                }
                this._instance._sceneManager.XRObjects.addChild(tuto);
                tuto.startTutorial().then(() => {
                    this._instance._sceneManager.XRObjects.removeChild(tuto);
                });
            }
            return this._instance;
        }
        isMixedRealityActive() {
            return this._isMixedRealityActive;
        }
        isDisplayingIndicators() {
            return this._isDisplayingIndicators;
        }
        displayIndicators(iOnOff) {
            this._isDisplayingIndicators = iOnOff;
            const inputs = this._inputManager.getInputs();
            if (inputs.left && inputs.left instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                inputs.left.displayIndicators(this._isDisplayingIndicators);
            }
            if (inputs.right instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                inputs.right.displayIndicators(this._isDisplayingIndicators);
            }
            for (const input of inputs.others) {
                if (input instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                    input.displayIndicators(this._isDisplayingIndicators);
                }
            }
        }
        setMixedRealityMode(iOnOff) {
            this.sceneManager._setTransparentBackground(iOnOff);
            this._isMixedRealityActive = iOnOff;
            const inputs = this._inputManager.getInputs();
            if (inputs.left) {
                inputs.left.setMixedRealityMode(this._isMixedRealityActive);
            }
            if (inputs.right) {
                inputs.right.setMixedRealityMode(this._isMixedRealityActive);
            }
            for (const input of inputs.others) {
                input.setMixedRealityMode(this._isMixedRealityActive);
            }
            this._skillsManager.updateCurrentState(iOnOff ? WebVisuXRToolkit_1.InputAction.MixedReality : WebVisuXRToolkit_1.InputAction.FullImmersive);
        }
        endSession() {
            this._session.end();
        }
        get session() {
            return this._session;
        }
        get isMixedRealityAvailable() {
            return this._isMixedRealityAvailable;
        }
        mapCameraToXREye(viewport, view) {
            if (viewport.width === 0 || !view.eye || view.eye === 'none') // When there are two views but mono rendering is expected
             {
                const transformMatrix = convertXRRigidTransformViewpoint(view.transform);
                if (this._lockCamera) {
                    transformMatrix.setFromArray([-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
                }
                this._sceneManager._computeXRCamera(transformMatrix, new THREE.Matrix4().setFromArray(Array.from(view.projectionMatrix)), this._sceneManager.viewpoint.camera, Math.min(100, this._sceneManager.viewpoint.camera.near), Math.max(100000, this._sceneManager.viewpoint.camera.far), true);
            }
            else if (view.eye === 'left') {
                if (!this._lockCamera) {
                    const mat = convertXRRigidTransformViewpoint(view.transform);
                    if (WebVisuXRToolkitConfigManager.instance.settings.get("Panorama360Mode")) {
                        mat.setPosition(new THREE.Vector3(0, 0, 0));
                    }
                    this._sceneManager._setLeftTransformMatrix(mat);
                }
                this._sceneManager._setLeftProjectionMatrix(new THREE.Matrix4().setFromArray(Array.from(view.projectionMatrix)));
                //this._sceneManager.computeXRCamera is automatically called in stereo mode with the camera system
            }
            else if (view.eye === 'right') {
                if (!this._lockCamera) {
                    const mat = convertXRRigidTransformViewpoint(view.transform);
                    if (WebVisuXRToolkitConfigManager.instance.settings.get("Panorama360Mode")) {
                        mat.setPosition(new THREE.Vector3(0, 0, 0));
                    }
                    this._sceneManager._setRightTransformMatrix(mat);
                }
                this._sceneManager._setRightProjectionMatrix(new THREE.Matrix4().setFromArray(Array.from(view.projectionMatrix)));
                //this._sceneManager.computeXRCamera is automatically called in stereo mode with the camera system
            }
        }
        get dt() {
            return this._dt;
        }
    }
    exports.WebVisuXRToolkitManager = WebVisuXRToolkitManager;
});
