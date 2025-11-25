/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPCameraViewerControl
 * @constructor
 * @augments module:DS/Controls/Abstract
 * 
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPCameraViewerControl', 
[
    'UWA/Core',
    'DS/Controls/Abstract', 
    'css!DS/StudioUIActorModelWeb/style/CXPCameraViewerControl.css',
    'DS/Utilities/Dom',
    'DS/Core/PointerEvents',
    'DS/CATCXPModel/CATCXPRenderUtils',
    'DS/Visualization/WebGLV6Viewer',
    'DS/Visualization/Viewpoint'
],
function (UWA, Abstract, CXPCameraViewerCSS, DomUtils, PointerEvents, RenderUtils, WebGLV6Viewer, Viewpoint) {
    'use strict';

    function _updateEventHandler(iEventName, iOldValue, iNewValue) {
        if (iOldValue) {
            this.removeEventListener(iEventName, iOldValue);
        }
        if (iNewValue) {
            this.addEventListener(iEventName, iNewValue);
        }
    }

    var CXPCameraViewerControl = Abstract.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPCameraViewerControl.prototype
          */
          {
            publishedProperties: {
              liveUpdate: {
                defaultValue: false,
                type: 'boolean'
              },
              camera: {
                  defaultValue: null,
                  type: 'object'
              },
              onClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onDoubleClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onRightClick: {
                defaultValue: undefined,
                type: 'function'
              },
              onEnter: {
                defaultValue: undefined,
                type: 'function'
              },
              onExit: {
                defaultValue: undefined,
                type: 'function'
              },
              onPress: {
                defaultValue: undefined,
                type: 'function'
              },
              onRelease: {
                defaultValue: undefined,
                type: 'function'
              },
              onHover: {
                defaultValue: undefined,
                type: 'function'
              }
            },
            
            _preBuildView: function(properties) {
                this.elements.container = new UWA.Element('div', {
                    'class': 'cxp-cameraviewer-container',
                    tabindex: 0
                });
                this._parent(properties);
            },

            _buildViewer: function() {
                var appOptions;
                var app = this.camera.GetObject()._experienceBase.webApplication.app;
                if (app && app.getOptions) {
                    appOptions = app.getOptions();
                }
                var viewerOptions = (appOptions && appOptions.viewerOptions) ? appOptions.viewerOptions : {};
                viewerOptions.div = this.elements.container;
                viewerOptions.multiViewer = true;
                viewerOptions.multiViewerFix = true;
                viewerOptions.highlight = {
                    activated: false,
                    displayHL: false
                };
                viewerOptions.defaultLights = false;
        
                this._cameraViewer = new WebGLV6Viewer(viewerOptions);
                this._cameraViewer.setVisuEnv('None'); //odt mode for set viewer params
        
                this._cameraViewer.canvas.style.pointerEvents = 'none';
        
                var viewpoint = new Viewpoint({ viewer: this._cameraViewer });
                this._cameraViewer.addViewpoint(viewpoint);
            },

            _updateViewerScenegraph: function() {
                this._cameraViewer.getSceneGraphOverrideSetManager().clear();
                if (this._content) {
                    this._cameraViewer.removeNode(this._content.GetNode());
                }
                var visuMgr = this.camera._experienceBase.getManager('CAT3DXVisuManager');
                this._content = visuMgr.getContent();
                this._cameraViewer.addNode(this._content.GetNode());
                var contentPath = this._content.GetPathElement();
                this._cameraViewer.getSceneGraphOverrideSetManager().pushSceneGraphOverrideSet(
                    visuMgr.getOverrideSet(),
                    { substractivePath: contentPath.getLength() > 1 ? contentPath : undefined }
                );
            },
        
            _updateViewerProperties: function() {
                if (this._updateLock) return
				this._updateLock = true;

                RenderUtils.setViewerPostProcessFromCamera(this._cameraViewer, this.camera);
                RenderUtils.setViewpointFromCamera(this._cameraViewer.currentViewpoint, this.camera, 0);
                this._cameraViewer.render();

				this._updateLock = false;
            },

            _updateViewerCallbacks: function() {
                if (!this.camera) return;
                
                var visuMgr = this.camera._experienceBase.getManager('CAT3DXVisuManager');
                if (!visuMgr) return;
                
                this._updateViewerProperties();
                if (this.liveUpdate && !this.disabled) {
                    if (!this._updateCallback) {
                        this._updateCallback = this._updateViewerProperties.bind(this);
                        visuMgr.pushVisuRefreshCB(this._updateCallback);
                    }
                } else {
                    if (this._updateCallback) {
                        visuMgr.removeVisuRefreshCB(this._updateCallback);
                        this._updateCallback = null;
                    }
                }
            },
        
            _applyCamera: function(iOldValue) {
                this._parent(iOldValue);
                
                if (!this.camera) return;
                if (this.camera && !this._cameraViewer) {
                    this._buildViewer.apply(this);
                }

                this._updateViewerScenegraph.apply(this);
                this._updateViewerProperties.apply(this);

                let visuMgr = this.camera._experienceBase.getManager('CAT3DXVisuManager');
                if (this.liveUpdate && !this.disabled) {
                    if (!this._updateCallback) {
                        this._updateCallback = this._updateViewerProperties.bind(this);
                        visuMgr.pushVisuRefreshCB(this._updateCallback);
                    }
                }
                else {
                    if (this._updateCallback) {
                        visuMgr.removeVisuRefreshCB(this._updateCallback);
                        this._updateCallback = null;
                    }
                }
            },

            _applyLiveUpdate: function(iOldValue) {
                this._parent(iOldValue);
                this._updateViewerCallbacks();
            },

            _applyDisabled: function(iOldValue) {
                this._parent(iOldValue);
                this._updateViewerCallbacks();
            },

            _applyOnClick: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerclick', iOldValue, this.onClick);
            },

            _applyOnDoubleClick: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerdoubleclick', iOldValue, this.onDoubleClick);
            },

            _applyOnRightClick: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerrightclick', iOldValue, this.onRightClick);
            },

            _applyOnEnter: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerenter', iOldValue, this.onEnter);
            },

            _applyOnExit: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerexit', iOldValue, this.onExit);
            },

            _applyOnPress: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerpress', iOldValue, this.onPress);
            },

            _applyOnRelease: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerrelease', iOldValue, this.onRelease);
            },

            _applyOnHover: function(iOldValue) {
                _updateEventHandler.call(this, 'cameraviewerhover', iOldValue, this.onHover);
            },

            handleEvents: function() {
                var self = this;
            
                DomUtils.addEventOnElement(this, this.elements.container, 'click', function () {
                    if (self.disabled) return;
                    self.fire('cameraviewerclick');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERHIT, function (e) {
                    if (e.multipleHitCount === 2) { // if double click
                        if (self.disabled) {
                            return;
                        }
                        self.fire('cameraviewerdoubleclick');
                    }
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, 'contextmenu', function () {
                    if (self.disabled) {
                        return;
                    }
                    self.fire('cameraviewerrightclick');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERDOWN, function () {
                    if (self.disabled) return;
                    self.fire('cameraviewerpress');
                });

                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERUP, function () {
                    if (self.disabled) return;
                    self.fire('cameraviewerrelease');
                });
            
                DomUtils.addEventOnElement(this, this.elements.container, PointerEvents.POINTERMOVE, function () {
                    if (self.disabled) return;                 
                    self.fire('cameraviewerhover');
                });

                DomUtils.addEventOnElement(this, this.elements.container, 'pointerenter', function () {
                    if (self.disabled) return;
                    self.fire('cameraviewerenter');
                });

                DomUtils.addEventOnElement(this, this.elements.container, 'pointerleave', function () {
                    if (self.disabled) return;
                    self.fire('cameraviewerexit');
                });
            },
      
            _applyProperties: function (oldValues) {
                this._parent(oldValues);

                if (this.isDirty('camera')) {
                    this._applyCamera(oldValues.camera);
                }

                if (this.isDirty('liveUpdate')) {
                    this._applyLiveUpdate(oldValues.liveUpdate);
                }

                if (this.isDirty('disabled')) {
                    this._applyDisabled(oldValues.disabled);
                }

                if (this.isDirty('onClick')) {
                    this._applyOnClick(oldValues.onClick);
                }

                if (this.isDirty('onDoubleClick')) {
                    this._applyOnDoubleClick(oldValues.onDoubleClick);
                }

                if (this.isDirty('onRightClick')) {
                    this._applyOnRightClick(oldValues.onRightClick);
                }

                if (this.isDirty('onPress')) {
                    this._applyOnPress(oldValues.onPress);
                }

                if (this.isDirty('onRelease')) {
                    this._applyOnRelease(oldValues.onRelease);
                }

                if (this.isDirty('onEnter')) {
                    this._applyOnEnter(oldValues.onEnter);
                }

                if (this.isDirty('onExit')) {
                    this._applyOnEnter(oldValues.onExit);
                }

                if (this.isDirty('onHover')) {
                    this._applyOnEnter(oldValues.onHover);
                }
            }
        });

        return CXPCameraViewerControl;
});

