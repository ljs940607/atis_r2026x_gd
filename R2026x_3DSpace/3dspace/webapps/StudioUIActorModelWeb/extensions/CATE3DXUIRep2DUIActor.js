/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DUIActor_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
[
	'UWA/Core',
	'UWA/Class/Listener',
	'DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep',
	'DS/SceneGraphNodes/CSS2DNode',
	'DS/CAT3DExpModel/XCTExpVariable',
	'DS/Visualization/ThreeJS_DS'
],
function (
	UWA,
	Listener,
	CATI3DXUIRep,
	CSS2DNode,
	XCTExpVariable,
	THREE
	) {
	'use strict';

	// these functions should be under a CATICXPDimension interface implemented for the type CXPDimension_Spec
	// since 2022xFD01 FCF has passed and I cannot change dictionnaries, I put this here

	function GetPixelDimensions(iUIActor) {
		var uiactor = iUIActor.QueryInterface('CATICXPUIActor');

		var dim = uiactor.GetMinimumDimension();
		if (dim.mode === 1 /* Percentage */) {
			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
			return {width: dim.width*vw/100.0, height: dim.height*vh/100.0};
		}
		return {width: dim.width, height: dim.height};
	}

	function GetDimensionsMode(iUIActor) {
		var uiactor = iUIActor.QueryInterface('CATICXPUIActor');

		var dim = uiactor.GetMinimumDimension();
		return (dim.mode === 1);
	}

	function SetPixelDimensions(iUIActor, pixelDimensions) {
		var uiactor = iUIActor.QueryInterface('CATICXPUIActor');
		var dim = uiactor.GetMinimumDimension();
		if (dim.mode === 1 /* Percentage */) {
			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
			uiactor.SetMinimumDimension(pixelDimensions.width*100.0/vw, pixelDimensions.height*100.0/vh, 1 /* Percentage */);
		} else {
			uiactor.SetMinimumDimension(pixelDimensions.width, pixelDimensions.height, 0 /* Pixel */);
		}
	}

	var CATE3DXUIRep2DUIActor = UWA.Class.extend(Listener,
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor.prototype **/
	{
		init: function () {
			this._parent();
			this._container = null;
			this._isPlaying = false;
			this._refreshLogged = false;
			this.propertiesChanged = new Set();
		},

		Dispose: function () {
			this._parent();
			this.stopListening();
			this._container = null;
		},

		Get: function () {
			if (this._container === null) {
				this._Create();
			}
			if (this._Is3DAttached()) {
				return null;
			}
			return this._container;
		},

		Refresh: function () {
			this._SetCheckDimensionDelayedMode(true);
			for (var iPropName of this.propertiesChanged) {
				let props = iPropName.split('.');
				this._UpdateProperty(props);
			}
			this._SetCheckDimensionDelayedMode(false);
			this.propertiesChanged.clear();
			this._refreshLogged = false;
	    },

		_SetCheckDimensionDelayedMode: function(iEnableDelayedMode) {
			this._checkDimensionDelayedMode = iEnableDelayedMode;

			if (!this._checkDimensionDelayedMode && this._pendingCheckValidDimension) {
				this._CheckValidDimension();
				this._pendingCheckValidDimension = false;
			}
		},

		RegisterPlayEvents: function(/*iSDKObject*/) {
			this._isPlaying = true;
			var uiactor = this.QueryInterface('CATICXPUIActor');
            var visible = uiactor.GetVisible();
			if (!visible) {
				this._container.style.pointerEvents = 'none';
			} else {
				this._container.style.pointerEvents = 'auto';
			}

		},

		ReleasePlayEvents: function() {
			this._isPlaying = false;
			this._container.style.pointerEvents = 'none';		
		},

		SetIndex: function(iIndex) {
			this._container.style.zIndex = iIndex;
		},

		AttachNodeToViewer: function() {
			if (!UWA.is(this._node2d)) {
				let visuManager = this.GetObject()._experienceBase.getManager('CAT3DXVisuManager');
				let viewer = visuManager.getViewer();
				this._node2d = new CSS2DNode({
					html: this._container,
					name: '2DNode' + this.QueryInterface('CATI3DExperienceObject').GetValueByName('_varName'),
					position: new THREE.Vector3()
				});
				this._node2d.excludeFromHighlight(true, true);
				this._node2d.setMatrix(new THREE.Matrix4());
				viewer.getRootNode().addChild(this._node2d);
				this._node2d.updatePosition();
			}
		},

		DetachNodeFromViewer: function() {
			if (this._node2d) {
				let visuManager = this.GetObject()._experienceBase.getManager('CAT3DXVisuManager');
				let viewer = visuManager.getViewer();
				if (viewer) {
					viewer.getRootNode().removeChild(this._node2d);
				}

				delete this._node2d;
			}
		},

        _Create: function() {
			this._CreateContainer();
			this._Fill(this._container);
        },

		_Fill: function() {
			//nothing to do
			//child classes need to reimplement this
		},

		_LogPropertyChanged: function(iPropertyName, iValue) {
			let propertyChanged = this._GroupPropertyUpdate(iPropertyName);
			this.propertiesChanged.add(propertyChanged);
			if (!this._refreshLogged) {
				this.GetObject()._experienceBase.getManager('CAT3DXUIManager')._refreshUIRep(this);
				this._refreshLogged = true;
			}
		},

		_GroupPropertyUpdate: function(iPropertyName) {
			// to avoid having multiple updates that refresh the same thing, we try to group some updates
			let props = iPropertyName.split('.');
			let rootProperty = props[0];
			if (rootProperty === 'dimension') {
				return rootProperty;
			}
			if (rootProperty === 'offset' || rootProperty === 'attachment') {
				return 'attachment';
			}
			return iPropertyName;
		},

		_UpdateProperty: function(iProps) {
			let iVariableName = iProps[0];
			var uiactor = this.QueryInterface('CATICXPUIActor');
			if (iVariableName === "visible") {
				this._SetVisible(uiactor.GetVisible());
			} else if (iVariableName === "opacity") {
				this._SetOpacity(uiactor.GetOpacity());
			} else if (iVariableName === "offset" || iVariableName === "offsetMode" || iVariableName === "attachment") {
				this._SetPositionning(uiactor.GetAttachment(), uiactor.GetOffset(), (uiactor.GetOffsetMode() == true ? true : false) );
			} else if (iVariableName === "dimension") {
				this._SetDimension(uiactor.GetMinimumDimension());
				this._SetPositionning(uiactor.GetAttachment(), uiactor.GetOffset(), (uiactor.GetOffsetMode() == true ? true : false));
			}
		},

        _CreateContainer: function () {
            this._container = UWA.createElement('div');
            this._container.style.pointerEvents = 'none';
            this._container.style.position = 'absolute';

            var uiactor = this.QueryInterface('CATICXPUIActor');
            var expObject = this.QueryInterface('CATI3DExperienceObject');

            this._SetVisible(uiactor.GetVisible());
			this._ListenVariableChanges(expObject, 'visible');

			this._SetOpacity(uiactor.GetOpacity());
			this._ListenVariableChanges(expObject, 'opacity');
			
			this._SetDimension(uiactor.GetMinimumDimension());
			this._ListenVariableChanges(expObject, 'dimension');
			
			this._SetPositionning(uiactor.GetAttachment(), uiactor.GetOffset(), (uiactor.GetOffsetMode() == true ? true : false));
			this._ListenVariableChanges(expObject, 'offset');
			this._ListenVariableChanges(expObject, 'attachment');
        },

		_ListenVariableChanges :function(iExpObj, iVariableName, iPathOfIDFromRoot = '') {
			var self = this;
			let varInfo = iExpObj.GetVariableInfo(iVariableName);
			if (varInfo.maxNumberOfValues === 1) {
				if (varInfo.type === XCTExpVariable.VarType.Object && varInfo.valuationMode === XCTExpVariable.ValuationMode.AggregatingValue) {
					
					{
						let objValue = iExpObj.GetValueByName(iVariableName);
						let objValueEO = objValue.QueryInterface('CATI3DExperienceObject');
						let variables = objValueEO.ListVariables();
						for (let variable of variables) {
							if (variable === "_varName") {
								continue;
							}
							// this.listenTo(objValueEO, variable + '.CHANGED', function () {
							// 	self._LogPropertyChanged(iVariableName);
							// });

							this._ListenVariableChanges(objValueEO, variable, iVariableName + '.');
						}
					}
	
					this.listenTo(iExpObj, iVariableName + '.CHANGED', function (iValue) {
						let objValueEO = iValue.QueryInterface('CATI3DExperienceObject');
						var variables = objValueEO.ListVariables();
						for (let variable of variables) {
							if (variable === "_varName") {
								continue;
							}
							self.stopListening(null, variable + '.CHANGED');
	
							// self.listenTo(objValueEO, variable + '.CHANGED', function () {
							// 	self._LogPropertyChanged(iVariableName);
							// });
							this._ListenVariableChanges(objValueEO, variable, iVariableName + '.');
						}
						self._LogPropertyChanged(iPathOfIDFromRoot + iVariableName);
					});
	
				} else {
					this.listenTo(iExpObj, iVariableName + '.CHANGED', function () {
						self._LogPropertyChanged(iPathOfIDFromRoot + iVariableName);
					});
				}
			} else {
				// for arrays, only listening for array variables for now, not nested variables of object in array
				this.listenTo(iExpObj, iVariableName + '.CHANGED', function () {
					self._LogPropertyChanged(iPathOfIDFromRoot + iVariableName);
				});

				let values = iExpObj.GetValueByName(iVariableName);
				for (let i = 0;  i<values.length; ++i) {
					let objValueEO = values[i].QueryInterface('CATI3DExperienceObject');
					let variables = objValueEO.ListVariables();
					for (let variable of variables) {
						if (variable === "_varName") {
							continue;
						}
						let pathOfID = iVariableName + '.' + i + '.';
						this._ListenVariableChanges(objValueEO, variable, iPathOfIDFromRoot + pathOfID);
					}
				}
			}

		},

        _SetVisible: function(iVisible) {
            if (iVisible) {
                this._container.style.visibility = 'inherit';
                if (this._isPlaying) {
                    this._container.style.pointerEvents = 'auto';
                } else {
                    this._container.style.pointerEvents = 'none';
                }
            } else {
                this._container.style.visibility = 'hidden';
                this._container.style.pointerEvents = 'none';
            }
        },

		_SetOpacity: function(iOpacity) {
            this._container.style.opacity = iOpacity;
        },

		_SetDimension: function(iDimension) {
			if (iDimension.mode === 1) {
				this._container.style.width = iDimension.width + 'vw';
				this._container.style.height = iDimension.height + 'vh';
			} else {
				this._container.style.width = iDimension.width + 'px';
				this._container.style.height = iDimension.height + 'px';
			}
			this._CheckValidDimension();
		},

		_SetPositionning: function(iAttachment, iOffset, iOffsetMode) {
			this._attachment = iAttachment;
			if (iAttachment.side === CATI3DXUIRep.Attachment.ESide.e3DActor) {
				this.AttachNodeToViewer();

				this._node2d.setOffset(new THREE.Vector2(iOffset.x, iOffset.y));
				//IR-722222: call the updatePosition() method to force the update
				this._node2d.updatePosition();
				this._container.style.transform = 'inherit';
				this._container.style.top = '0px';
				this._container.style.left = '0px';

				//console.log("x model: " + iOffset.x);
				//console.log("x node2d: " + this._node2d.getOffset().x);
				//console.log("y model: " + iOffset.y);
				//console.log("y node2d: " + this._node2d.getOffset().y);
				//console.log("left: " + this._container.style.left);
				//console.log("top: " + this._container.style.top);

				this._Update3DAttachment();
				var self = this;
				this._ListenWorldMatrixChanges(this._attachment.target, self._Update3DAttachment);

				this.GetObject()._experienceBase.getManager('CAT3DXUIManager')._doRefreshUIActorsList = true; // we need a more specific API to avoid to refresh everything
			} else {

				if (UWA.is(this._node2d)) {
					this.DetachNodeFromViewer();

					this._StopListeningMatrixChanges(this._Update3DAttachment);

					this.GetObject()._experienceBase.getManager('CAT3DXUIManager')._doRefreshUIActorsList = true; // we need a more specific API to avoid to refresh everything
				}

				// anchor variables define the position of the anchor point in the UIActor (px) relative with the attachement
				let anchorX = 0, anchorY = 0;
				// side variables define the css properties to use to position the UIActor
				let left = false, right = false, top = false, bottom = false, centerWidth = false, centerHeight = false;
				const width = Number(String(this._container.style.width).slice(0, -2));
				let widthUnit = String(this._container.style.width).slice(-2);
				widthUnit = (widthUnit == "px" ? widthUnit : "%");
				const height = Number(String(this._container.style.height).slice(0, -2));
				let heightUnit = String(this._container.style.height).slice(-2);
				const viewerWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
				const viewerHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

				switch (iAttachment.side) {
					case CATI3DXUIRep.Attachment.ESide.eTopLeft:
						top = true;
						left = true;
						break;
					case CATI3DXUIRep.Attachment.ESide.eTop:
						top = true;
						centerWidth = true;
						anchorX = width / 2;
						break;
					case CATI3DXUIRep.Attachment.ESide.eTopRight:
						top = true;
						right = true;
						break;
					case CATI3DXUIRep.Attachment.ESide.eLeft:
						left = true;
						centerHeight = true;
						anchorY = height / 2;
						break;
					case CATI3DXUIRep.Attachment.ESide.eCenter:
						centerWidth = true;
						centerHeight = true;
						anchorX = width / 2;
						anchorY = height / 2;
						break;
					case CATI3DXUIRep.Attachment.ESide.eRight:
						right = true;
						centerHeight = true;
						anchorY = height / 2;
						break;
					case CATI3DXUIRep.Attachment.ESide.eBottomLeft:
						bottom = true;
						left = true;
						break;
					case CATI3DXUIRep.Attachment.ESide.eBottom:
						bottom = true;
						centerWidth = true;
						anchorX = width / 2;
						break;
					case CATI3DXUIRep.Attachment.ESide.eBottomRight:
						bottom = true;
						right = true;
						break;
					default:
						break;
				}

				if (iOffsetMode) { // PERCENTS
					if (left) {
						this._container.style.left = `calc(${iOffset.x}% - ${anchorX}${widthUnit})`;
					} if (right) {
						this._container.style.right = `calc(${anchorX}${widthUnit} - ${iOffset.x}%)`;
					} if (top) {
						this._container.style.top = `calc(${iOffset.y}% - ${anchorY}${heightUnit})`;
					} if (bottom) {
						this._container.style.bottom = `calc(${anchorY}${heightUnit} - ${iOffset.y}%)`;
					} if (centerWidth) {
						this._container.style.left = `calc(50% + (${iOffset.x}% - ${anchorX}${widthUnit}))`;
					} if (centerHeight) {
						this._container.style.top = `calc(50% + (${iOffset.y}% - ${anchorY}${heightUnit}))`;
					}
				} else { // PIXELS
					if (left) {
						this._container.style.left = `calc(${iOffset.x}px - ${anchorX}${widthUnit})`;
					} if (right) {
						this._container.style.right = `calc(${anchorX}${widthUnit} - ${iOffset.x}px)`;
					} if (top) {
						this._container.style.top = `calc(${iOffset.y}px - ${anchorY}${heightUnit})`;
					} if (bottom) {
						this._container.style.bottom = `calc(${anchorY}${heightUnit} - ${iOffset.y}px)`;
					} if (centerWidth) {
						this._container.style.left = `calc(50% + (${iOffset.x}px - ${anchorX}${widthUnit}))`;
					} if (centerHeight) {
						this._container.style.top = `calc(50% + (${iOffset.y}px - ${anchorY}${heightUnit}))`;
					}
				}
			}
		},

		_CheckValidDimension: function() {
			if (this._checkDimensionDelayedMode == true) {
				this._pendingCheckValidDimension = true;
				return;
			}

			let visuMinDim = this._GetVisuMinimumDimension();
			let pixelDim = GetPixelDimensions(this);
			let pixelOffsetDiff = { x: 0, y: 0 }
			let dimensionsChanged = false;

			if (visuMinDim.width > pixelDim.width) {
				pixelOffsetDiff.x = visuMinDim.width - pixelDim.width;
				pixelDim.width = visuMinDim.width;
				dimensionsChanged = true;
			}

			if (visuMinDim.height > pixelDim.height) {
				pixelOffsetDiff.y = visuMinDim.height - pixelDim.height;
				pixelDim.height = visuMinDim.height;
				dimensionsChanged = true;
			}

			if (dimensionsChanged) {
				SetPixelDimensions(this, pixelDim);
				if (GetDimensionsMode(this)) { // Percentage
					const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
					const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
					this._container.style.width = `${pixelDim.width/vw*100}%`;
					this._container.style.height = `${pixelDim.height/vh*100}%`;
					this._container.style.left = `calc(${this._container.style.left} - ${(pixelOffsetDiff.x/2)/vw*100}%)`;
					this._container.style.top = `calc(${this._container.style.top} - ${(pixelOffsetDiff.y/2)/vh*100}%)`;
				} else { // Pixel
					this._container.style.width = `${pixelDim.width}px`;
					this._container.style.height = `${pixelDim.height}px`;
					this._container.style.left = `calc(${this._container.style.left} - ${pixelOffsetDiff.x / 2}px)`;
					this._container.style.top = `calc(${this._container.style.top} - ${pixelOffsetDiff.y / 2}px)`;
				}
			}
		},

		_GetVisuMinimumDimension: function() {
			let width = this._container.style.width;
			let widthNumber = Number(width.slice(0, -2));
			let height = this._container.style.height;
			let heightNumber = Number(height.slice(0, -2));

			this._container.style.width = 'min-content';
			this._container.style.height = 'min-content';
			let minimumDimension =  {width: this._container.offsetWidth, height: this._container.offsetHeight};

			this._container.style.width = width;
			this._container.style.height = height;

			//IR-1164300: prevent situations when the returned minimum dimension is higher than the current dimension for some reason
			//Temporary solution as the core problem seems to be related to the css properties of galleries
			if (minimumDimension.width > widthNumber || minimumDimension.height > heightNumber) {
				return { width: widthNumber, height: heightNumber };
			}

			return minimumDimension;
		},
		
		_ListenWorldMatrixChanges: function(iLeaf, iCallback) {
			this._StopListeningMatrixChanges(iCallback);
			if (UWA.is(iLeaf)) {
				let expObject = iLeaf.QueryInterface('CATI3DExperienceObject');
				while (UWA.is(expObject)) {
					this.listenTo(expObject, '_varposition.CHANGED', iCallback);
					expObject = expObject.GetParent();
					if (UWA.is(expObject)) {
						expObject = expObject.QueryInterface('CATI3DExperienceObject');
					}
				}
			}
		},

		_StopListeningMatrixChanges: function(iCallback) {
			this.stopListening(null, null, iCallback);
		},

		_Update3DAttachment: function() {
			var worldMatrix = null;
			if (this._attachment.target) {
				// we need to provide the viewer in case experience has multiple occurrences like when there is a camera viewer
				let viewer = this.GetObject()._experienceBase.getManager('CAT3DXVisuManager').getViewer();
				worldMatrix = this._attachment.target.QueryInterface('CATI3DGeoVisu').GetPathElement().getWorldMatrix(viewer);       
				
				if (!UWA.is(worldMatrix)) {
					console.warn("Could not retrieve world matrix for attachment. Setting referential to identity matrix");
					worldMatrix = new THREE.Matrix4();
				}
			} else {
				worldMatrix = new THREE.Matrix4();
			}

			if (!this._node2d.getMatrix().equals(worldMatrix, 0.0001 /* subjective value to improve comparison */ )) {
				this._node2d.setMatrix(worldMatrix);
				this._node2d.updatePosition();
			}	
		},

		_Is3DAttached: function() {
			return this._attachment.side === CATI3DXUIRep.Attachment.ESide.e3DActor;
		}

	});
	return CATE3DXUIRep2DUIActor;
});
