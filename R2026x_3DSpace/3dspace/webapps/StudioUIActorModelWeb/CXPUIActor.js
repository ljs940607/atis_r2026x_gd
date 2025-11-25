/**
* @name DS/StudioUIActorModelWeb/CXPUIActor
* @constructor
*
* @description
* <p>Base Class for UIActor rep</p>
* <p>Create rep container (DOM)</p>
* <p>Define top/left offset to position rep</p>
* <p>Add helper functions to interact on container (inject, remove ..)</p>
*/
define('DS/StudioUIActorModelWeb/CXPUIActor',
[
    'UWA/Core',
    'DS/SceneGraphNodes/CSS2DNode',
    'DS/Visualization/ThreeJS_DS'
],
function (UWA, CSS2DNode, THREE) {

	'use strict';

	var CXPUIActor = UWA.Class.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPUIActor.prototype **/
		{
		    /**
            * Constructor
            * @param {object} iUIActor - UIActor
            */
			init: function (iUIActor) {
				this._uiActor = iUIActor;
				this._mapper = null;
			},

		    /**
            * Clean UIActor rep
            */
			Dispose: function () {
				this._container = null;
                if (this._2DNode && this._targetNode) {
                    this._targetNode.removeChild(this._2DNode);
                    this._2DNode = null;
                    this._targetNode = null;
				}
				this._uiActor = null;
				if (this._mapper) {
				    this._mapper.Dispose();
					this._mapper = null;
				}
			},

		    /**
            * Return rep container
            * @return {object} container
            */
			getContainer: function () {
				if (!this._container) {
					this._container = this._createContainer();
				}
				return this._container;
			},

		    /**
            * Set the UIMapper object for this UIActor.
            * UIMappyer object contains variables and their impact on dom
            * @param {object} iUIMapper - Object containing variable and their impact on dom
            */
			setUIMapper: function (iUIMapper) {
				this._mapper = iUIMapper;
			},

			_createContainer: function () {

				this._container = UWA.createElement('div');
				this._container.style.pointerEvents = 'none';
				this._container.style.position = 'absolute';

				Object.defineProperty(this, 'left', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._left;
					},
					set: function (iValue) {
						this._left = iValue;
						this._container.style.left = this._left;
					}
				});

				Object.defineProperty(this, 'top', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._top;
					},
					set: function (iValue) {
						this._top = iValue;
						this._container.style.top = this.top;
					}
				});

				Object.defineProperty(this, 'clientWidth', {
                    enumerable: true,
                    configurable: true,
					get: function () {
                        return this._container.clientWidth;
					}
				});

				Object.defineProperty(this, 'clientHeight', {
                    enumerable: true,
                    configurable: true,
					get: function () {
                        return this._container.clientHeight;
					}
                });

                Object.defineProperty(this, 'visible', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._visible;
                    },
                    set: function (iValue) {
                        this._visible = iValue;
                        if (iValue) {
                            this._container.style.visibility = 'inherit';
                            if (this._isPlaying) {
                                this._container.style.pointerEvents = 'auto';
                            }
                        }
                        else {
                            this._container.style.visibility = 'hidden';
                            this._container.style.pointerEvents = 'none';
                        }
                    }
                });

                Object.defineProperty(this, 'minimumDimension', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return {
                            mode: this._mode,
                            width: this._width,
                            height: this._height
                        };
                    },
                    set: function (iValue) {
                        if (this._widthCallback) {
                            this._mapper.stopListening(null, 'width.CHANGED', this._widthCallback);
                        }
                        if (this._heightCallback) {
                            this._mapper.stopListening(null, 'height.CHANGED', this._heightCallback);
                        }
                        if (this._modeCallback) {
                            this._mapper.stopListening(null, 'mode.CHANGED', this._modeCallback);
                        }

                        var experienceObject = iValue.QueryInterface('CATI3DExperienceObject');
                        var self = this;
                        this._widthCallback = function (iWidth) {
                            self.width = iWidth;
                        };
                        this._heightCallback = function (iHeight) {
                            self.height = iHeight;
                        };
                        this._modeCallback = function (iMode) {
                            self._mode = iMode;
                            self.width = experienceObject.GetValueByName('width');
                            self.height = experienceObject.GetValueByName('height');
                        };

                        this._mapper.listenTo(experienceObject, 'width.CHANGED', this._widthCallback);
                        this._mapper.listenTo(experienceObject, 'height.CHANGED', this._heightCallback);
                        this._mapper.listenTo(experienceObject, 'mode.CHANGED', this._modeCallback);

                        this._mode = experienceObject.GetValueByName('mode');
                        this.width = experienceObject.GetValueByName('width');
                        this.height = experienceObject.GetValueByName('height');
                    }
                });

                Object.defineProperty(this, 'zIndex', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._zIndex;
                    },
                    set: function (iValue) {
                        this._zIndex = iValue;
                        this._container.style.zIndex = iValue;
                    }
                });

                Object.defineProperty(this, 'width', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._width;
                    },
                    set: function (iValue) {
                        this._width = iValue;
                        if (this._mode === 1) {
                            this._container.style.width = this._width + 'vw';
                        } else { //default size in px
                            this._container.style.width = this._width + 'px';
                        }
                    }
                });

                Object.defineProperty(this, 'height', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._height;
                    },
                    set: function (iValue) {
                        this._height = iValue;
                        if (this._mode === 1) {
                            this._container.style.height = this._height + 'vh';
                        } else { //default size in px
                            this._container.style.height = this._height + 'px';
                        }
                    }
                });

				return this._container;
			},

		    /**
            * true if the container is attached to a 3DNode, false otherwise
            * @return {boolean} true if the container is attached to a 3DNode
            */
			isAttachTo3D: function () {
                return UWA.is(this._3dAttachedObject);
			},

		    /**
            * Detatch the container from 3DNode
            */
            detachFrom3D: function () {
                if (!this.isAttachTo3D()) {
                    return;
                }
                var visuManager = this._uiActor.GetObject()._experienceBase.getManager('CAT3DXVisuManager');
                visuManager.removeVisuRefreshCB(this._3dAttachedObject.visuRefreshCallback);
                var viewer = visuManager.getViewer();
                viewer.getRootNode().removeChild(this._3dAttachedObject.node2d);
                delete this._3dAttachedObject;

                var parent = this._uiActor.QueryInterface('CATI3DExperienceObject').GetParent();
				var parentUIRep = parent.QueryInterface('CATI3DXUIRep');
				this.getContainer().inject(parentUIRep.Get());
			},

		    /**
            * Attach the container to a 3DNode
            * @param {object} iTarget - Object with a 3D representation
            * @param {Integer} iOffsetX - X Offset
            * @param {Integer} iOffsetY - Y Offset
            */
            attachTo3D: function (iTarget, iOffsetX, iOffsetY) {
                if (!UWA.is(this._3dAttachedObject)) {
                    this._3dAttachedObject = {                        
                        //node2d
                        //callback
                        //target
                    };
                    var visuManager = this._uiActor.GetObject()._experienceBase.getManager('CAT3DXVisuManager');
                    var viewer = visuManager.getViewer();
                    this._3dAttachedObject.node2d = new CSS2DNode({
                        html: this.getContainer(),
                        name: '2DNode' + this._uiActor.QueryInterface('CATI3DExperienceObject').GetValueByName('_varName'),
                        position: new THREE.Vector3()
                    });
                    this._3dAttachedObject.node2d.excludeFromHighlight(true, true);
                    viewer.getRootNode().addChild(this._3dAttachedObject.node2d);
                    var self = this;
                    this._3dAttachedObject.visuRefreshCallback = function () {
                        var worldMatrix;
                        if (self._3dAttachedObject.target) {
                            worldMatrix = self._3dAttachedObject.target.QueryInterface('CATI3DGeoVisu').GetPathElement().getWorldMatrix(viewer);                          
                        }
                        else {
                            worldMatrix = new THREE.Matrix4();
                        }

                        if (!self._3dAttachedObject.node2d.getMatrix().equals(worldMatrix)) {
                            self._3dAttachedObject.node2d.setMatrix(worldMatrix);
                            self._3dAttachedObject.node2d.updatePosition();
                        }
                    };
                    visuManager.pushVisuRefreshCB(this._3dAttachedObject.visuRefreshCallback);
                } 
                this._3dAttachedObject.target = iTarget;
                this._3dAttachedObject.node2d.setOffset(new THREE.Vector2(iOffsetX, iOffsetY));
                this._3dAttachedObject.visuRefreshCallback();
                
            },

            get2DNode: function () {
                if (this.isAttachTo3D()) {
                    return this._3dAttachedObject.node2d;
                }
			},		    

		    /**
            * Insert the container in child node of a dom object
            * @param {object} iParent - parent
            */
			inject: function (iParent) {
                if (!this.isAttachTo3D()) {
					this.getContainer().inject(iParent);
				}
			},

		    /**
            * Add child node to the container
            * @param {object} iChild - child node to add
            */
			appendChild: function (iChild) {
				this.getContainer().appendChild(iChild);
			},

		    /**
            * Detach container from the parent
            */
			remove: function () {
				this.getContainer().remove();
			},

		    /**
            * Register play events
            * @param {object} iSdkObject - StuUIActor play object
            */
            registerPlayEvents: function (/*iSdkObject*/) {
                this._isPlaying = true;
                if (!this.visible) {
                    this._container.style.pointerEvents = 'none';
                } else {
                    this._container.style.pointerEvents = 'auto';
                }
			},

		    /**
            * Release play events
            */
            releasePlayEvents: function () {
                this._isPlaying = false;
				this._container.style.pointerEvents = 'none';
			}

		});
	return CXPUIActor;
});




