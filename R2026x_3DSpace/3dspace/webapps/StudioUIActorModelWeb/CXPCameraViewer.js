/**
* @name DS/StudioUIActorModelWeb/CXPCameraViewer
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a CameraViewer rep (div + viewer)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPCameraViewer',
[
    'UWA/Core',
	'UWA/Class/Listener',
	'DS/StudioUIActorModelWeb/CXPUIActor',
	'DS/Visualization/WebGLV6Viewer',
	'DS/Visualization/Viewpoint',
	'DS/CATCXPModel/CATCXPRenderUtils'
],
function (UWA, Listener, CXPUIActor, WebGLV6Viewer, Viewpoint, RenderUtils) {
	'use strict';

	var CXPCameraViewer = CXPUIActor.extend(
		Listener,
		/** @lends DS/StudioUIActorModelWeb/CXPCameraViewer.prototype **/
		{

			init: function (iUIActor) {
				this._parent(iUIActor);

				this._viewerContainer = UWA.createElement('div').inject(this.getContainer());
                this._viewerContainer.style.boxSizing = 'border-box';
                this._viewerContainer.style.width = '100%';
                this._viewerContainer.style.height = '100%';

				var appOptions;
				var app = this._uiActor.GetObject()._experienceBase.webApplication.app;
				if (app && app.getOptions) {
				    appOptions = app.getOptions();
				}
				var viewerOptions = (appOptions && appOptions.viewerOptions) ? appOptions.viewerOptions : {};
				viewerOptions.div = this._viewerContainer;
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

				Object.defineProperty(this, 'enable', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._enable;
					},
					set: function (iValue) {
					    this._enable = iValue;
					    var visuMgr;
						if (this._enable) {
							this._viewerContainer.style.pointerEvents = 'inherit';
							this._viewerContainer.style.filter = 'none';
						}
						else {
							this._viewerContainer.style.pointerEvents = 'none';
							this._viewerContainer.style.filter = 'brightness(70%) grayscale(100%)';
						}

						this._updateLiveUpdate();
					}
				});

				Object.defineProperty(this, 'opacity', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._opacity;
					},
					set: function (iValue) {
						this._opacity = iValue;
						this._viewerContainer.style.opacity = this._opacity/255;
					}
				});

				Object.defineProperty(this, 'liveUpdate', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._liveUpdate;
					},
					set: function (iValue) {
						this._liveUpdate = iValue;
						this._updateLiveUpdate();
					}
				});

				Object.defineProperty(this, 'camera', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._camera;
					},
					set: function (iValue) {
						this._camera = iValue;
						if (this._camera) {
						    this._cameraViewer.getSceneGraphOverrideSetManager().clear();
						    if (this._content) {
						        this._cameraViewer.removeNode(this._content.GetNode());
						    }
							var visuMgr = this._camera._experienceBase.getManager('CAT3DXVisuManager');
							this._content = visuMgr.getContent();
							this._cameraViewer.addNode(this._content.GetNode());
							var contentPath = this._content.GetPathElement();
							this._cameraViewer.getSceneGraphOverrideSetManager().pushSceneGraphOverrideSet(
                                visuMgr.getOverrideSet(),
                                { substractivePath: contentPath.getLength() > 1 ? contentPath : undefined }
                            );

							if (this.enable) {
								this._update();
							} this._updateLiveUpdate();
						}
					}
				});
			},



			_update: function () {
				if (this._updateLock) return
				this._updateLock = true;

				RenderUtils.setViewerPostProcessFromCamera(this._cameraViewer, this._camera);
			    RenderUtils.setViewpointFromCamera(this._cameraViewer.currentViewpoint, this._camera, 0);
			    this._cameraViewer.render();

				this._updateLock = false;
			},

			_updateLiveUpdate: function () {
				this._update();
				if (!this._camera) return;

				var visuMgr = this._camera._experienceBase.getManager('CAT3DXVisuManager');
				if (!visuMgr) return;

				if (this.liveUpdate && this.enable) {
					if (!this._updateCallback) {
						this._updateCallback = this._update.bind(this);
						visuMgr.pushVisuRefreshCB(this._update.bind(this));

						let cameraEO = this._camera.QueryInterface('CATI3DExperienceObject');
						if (cameraEO) {
							this.listenTo(cameraEO, 'enableToneMapping.CHANGED', this._update);
							this.listenTo(cameraEO, 'toneMapping.CHANGED', this._update);
							this.listenTo(cameraEO, 'blacks.CHANGED', this._update);
							this.listenTo(cameraEO, 'whites.CHANGED', this._update);
							this.listenTo(cameraEO, 'saturation.CHANGED', this._update);
							this.listenTo(cameraEO, 'shoulderScale.CHANGED', this._update);
							this.listenTo(cameraEO, 'linearScale.CHANGED', this._update);
							this.listenTo(cameraEO, 'linearAngle.CHANGED', this._update);
							this.listenTo(cameraEO, 'toeScale.CHANGED', this._update);
							this.listenTo(cameraEO, 'toeNumerator.CHANGED', this._update);
							this.listenTo(cameraEO, 'toeDenominator.CHANGED', this._update);
							this.listenTo(cameraEO, 'whiteLevel.CHANGED', this._update);
							this.listenTo(cameraEO, 'gamma.CHANGED', this._update);
						}
					}
				} else {
					if (this._updateCallback) {
						visuMgr.removeVisuRefreshCB(this._update);
						this._updateCallback = null;

						this.stopListening();
					}
				}
			},

			// Register events for play
			registerPlayEvents: function (iSdkObject, index) {
			    this._parent(iSdkObject);
			    var isGalleryChild = UWA.is(index);
				index = UWA.is(index) ? index : 0;
				if (this._camera) {
					this._update();
				}

				this._viewerContainer.addEventListener('click', this._clickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIClicked', index);
				});

				this._viewerContainer.addEventListener('dblclick', this._dblclickEvent = function () {
					iSdkObject.doUIDispatchEvent('UIDoubleClicked', index);
				});

				this._viewerContainer.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIEntered', index);
				});

				this._viewerContainer.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIExited', index);
				});

				this._viewerContainer.addEventListener('mousemove', this._mouseMoveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIHovered', index);
				});

				if (!isGalleryChild) {
				    this._viewerContainer.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
				        if (iEvent.button === 0) {
				            iSdkObject.doUIDispatchEvent('UIPressed', index);
				        }
				    });

				    this._viewerContainer.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
				        if (iEvent.button === 0) {
				            iSdkObject.doUIDispatchEvent('UIReleased', index);
				        }
				    });
				}

				this._viewerContainer.addEventListener('contextmenu', this._contextMenuEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIRightClicked', index);
				    return false;
				});
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				this._viewerContainer.removeEventListener('click', this._clickEvent);
				this._viewerContainer.removeEventListener('dblclick', this._dblclickEvent);
				this._viewerContainer.removeEventListener('mouseenter', this._mouseEnterEvent);
				this._viewerContainer.removeEventListener('mouseleave', this._mouseLeaveEvent);
				this._viewerContainer.removeEventListener('mousemove', this._mouseMoveEvent);
				this._viewerContainer.removeEventListener('mousedown', this._mouseDownEvent);
				this._viewerContainer.removeEventListener('mouseup', this._mouseUpEvent);
				this._viewerContainer.removeEventListener('contextmenu', this._contextMenuEvent);
			}

		});
	return CXPCameraViewer;
});




