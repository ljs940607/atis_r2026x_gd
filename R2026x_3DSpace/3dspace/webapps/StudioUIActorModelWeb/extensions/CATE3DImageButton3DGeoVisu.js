/**
 * @name DS/StudioUIActorModelWeb/extensions/CATE3DImageButton3DGeoVisu
 * @implements {DS/CAT3DExpModel/interfaces/CATI3DGeoVisu}
 * @augments DS/StudioUIActorModelWeb/extensions/CATE3DActor3DGeoVisu
 * @constructor
 *
 * @description
 * CATI3DGeoVisu implementation for CXP3DImagebuttonActor_Spec
 */
define('DS/StudioUIActorModelWeb/extensions/CATE3DImageButton3DGeoVisu',
	[
		'UWA/Core',
		'UWA/Class/Listener',
		'DS/CATCXPModel/extensions/CATE3DActor3DGeoVisu',
		'DS/Visualization/ThreeJS_DS',
		'DS/Visualization/SceneGraphFactory',
		'DS/SceneGraphNodes/CanvasNode',
		'DS/SceneGraphNodes/CanvasNodeTexture',
		'DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents',
	],

	function (
		UWA,
		Listener,
		CATE3DActor3DGeoVisu,
		THREE,
		SceneGraphFactory,
		CanvasNode,
		CanvasNodeTexture,
		CATI3DXUIEvents,
	) {
		'use strict';

		let CATE3DImageButton3DGeoVisu = CATE3DActor3DGeoVisu.extend(Listener,
			/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DImageButton3DGeoVisu.prototype **/
			{
				init: function () {
					this._parent();
					this._buttonNode = null;
					this._buttonTexture = null;
					this._name = null;
					this._width = null;
					this._height = null;
					this._images = {};
					this._textureImage = null;
					this._textureSize = null;
					this._isRegistered = false;
					this._isEnabled = false;
					this._isPressed = false;
					this._isHovered = false;
					this._isPicked = false;
					this._displayState = "";
				},

				Dispose: function () {
					this._parent();
					this._unregisterEvents();
					if (this._buttonNode) {
						this._buttonNode.removeChildren();
					}

					this._buttonNode = null;
					this._buttonTexture = null;
					this._name = null;
					this._width = null;
					this._height = null;
					this._images = {};
					this._textureImage = null;
					this._textureSize = null;
					this._isRegistered = false;
					this._isEnabled = false;
					this._isPressed = false;
					this._isHovered = false;
					this._isPicked = false;
					this._displayState = "";
				},

				_Fill: function (iNode3D) {
					this._parent(iNode3D);

					// create button
					let expObject = this.QueryInterface('CATI3DExperienceObject');
					if (!expObject) return false;
					let refreshPropertiesPromise = this._refreshProperties(expObject);

					refreshPropertiesPromise.then(() => {
						// callbacks to refresh visu
						let self = this;

						let eventsToListen = [
							'enabled.CHANGED', 'width.CHANGED', 'height.CHANGED', 'normalImage.CHANGED',
							'disabledImage.CHANGED', 'hoveredImage.CHANGED', 'pressedImage.CHANGED'
						];

						for (const event of eventsToListen) {
							this.listenTo(expObject, event, function () {
								self.frameVisuChanges.push(self._refreshButtonFromModel);
								self.RequestVisuRefresh();
							});
						}

						this._buttonNode = this._createButton();
						this._buttonNode.setName(this._name);
						iNode3D.addChild(this._buttonNode);

						this._registerEvents();
						this.setReady(true);
					});
				},

				GetLocalNodes: function () {
					return this._buttonNode;
				},

				_createButton: function () {
					this._buttonTexture = new CanvasNodeTexture({
						width: this._width,
						height: this._height,
						rectangleTexture: true,
						drawCB: this._drawCanvasTexture.bind(this),
						alphaTest: 0,
						materialParams: {
							opacity: 1,
							depthTest: true,
							depthWrite: true,
							polygonOffset : true,
							polygonOffsetFactor : -10,
							polygonOffsetUnits : -10
						}
					});
					this._buttonTexture.maxPow = this.computePow();

					let button = new CanvasNode({
						name: this._name,
						side: THREE.DoubleSide,
						widthVector: new THREE.Vector3(this._width, 0.0, 0.0),
						heightVector: new THREE.Vector3(0.0, this._height, 0.0),
						bottomLeftcorner: new THREE.Vector3(-this._width/2, -this._height/2, 0),
						canvasNodeTexture: this._buttonTexture
					}, SceneGraphFactory);

					let bsphere = new THREE.Sphere();
					bsphere.center = new THREE.Vector3(this._width / 2, this._height / 2, 0); //need to re-center it (as it is offset above but idk why?)
					bsphere.radius = Math.sqrt(Math.pow(this._width * 0.5, 2) + Math.pow(this._height * 0.5, 2));
					let bbox = button.getBoundingBox();
					button.forceBoundingElements(true, { sphere: bsphere, box: bbox }, { sphere: bsphere, box: bbox });

					return button;
				},

				computePow: function () {
					// Defaut limit used by xHighlight for the texture of their main Canvas Node
					let maxSize = Math.pow(2048, 2);

					// Optim if the button texture is smaller
					if (this._textureImage && this._textureSize) {
						maxSize = Math.min(maxSize, this._textureSize.w * this._textureSize.h);
					}

					// Optim if you use highlight as canvasnode to imitate the real canvas node for prehighlight / highlight for the future
					// if (this._buttonHighlight) {
					// 	// Defaut limit used by xHighlight for the texture of their highlight Canvas Node
					// 	maxSize = Math.pow(512, 2);
					// }

					// Agorithm used by xHighlight to compute the maxPow value
					return Math.log((maxSize) / (this._height * this._width))/(2*Math.log(2));
				},

				_drawCanvasTexture: function (canvasNodeTexture, context, _tick, k) {
					if (!this._textureImage || !this._textureSize) return;

					let canvasWidth = context.canvas.width;
					let canvasHeight = context.canvas.height;

					context.scale(1, 1);
					// The canvas is rotated by 180° to display the texture correctly
					context.setTransform(-1, 0, 0, -1, canvasWidth, canvasHeight);
					context.drawImage(this._textureImage, 0, 0, canvasWidth, canvasHeight);

					return;
				},

				_refreshProperties: async function (expObject) {
					if (!expObject) return false;

					this._name = expObject.GetValueByName('_varName');
					this._width = expObject.GetValueByName('width');
					this._height = expObject.GetValueByName('height');
					this._isEnabled = expObject.GetValueByName('enabled');

					let imageNames = ["normalImage", "disabledImage", "hoveredImage", "pressedImage"];
					for (let index in imageNames) {
						let normalImageObject = expObject.GetValueByName(imageNames[index]);
						if (normalImageObject) {
							let textureAsset = normalImageObject.QueryInterface('CATI3DXPictureResourceAsset');
							if (textureAsset) {
								let textureImage = await textureAsset.getPicture();
								let textureSize = await textureAsset.getPictureSizeInPixel();
								this._images[imageNames[index]] = {
									img: textureImage,
									dim: textureSize
								}
							}
						} else {
							this._images[imageNames[index]] = null;
						}
					}
				},

				_refreshButtonFromModel: function () {

					let expObject = this.QueryInterface('CATI3DExperienceObject');
					if (!expObject) return false;
					let refreshPropertiesPromise = this._refreshProperties(expObject);

					refreshPropertiesPromise.then(() => {
						this._refreshButton();
					});

					return true;
				},

				_refreshButton: function () {
					if (UWA.is(this._buttonNode)) {
						this._node3D.removeChild(this._buttonNode);
					} else return false;

					// Order of priority for the refresh of the texture: Hovered > Pressed > Enabled
					this._displayState = (this._isEnabled) ? ((this._isPressed) ? "pressed" : (this._isHovered) ? "hovered" : "enabled") : "disabled";

					if (this._images.normalImage) {
						this._textureImage = this._images.normalImage.img;
						this._textureSize = this._images.normalImage.dim;
					}
					if (this._displayState == "hovered" && this._images.hoveredImage) {
						this._textureImage = this._images.hoveredImage.img;
						this._textureSize = this._images.hoveredImage.dim;
					}
					if (this._displayState == "pressed" && this._images.pressedImage) {
						this._textureImage = this._images.pressedImage.img;
						this._textureSize = this._images.pressedImage.dim;
					}
					if (this._displayState == "disabled" && this._images.disabledImage) {
						this._textureImage = this._images.disabledImage.img;
						this._textureSize = this._images.disabledImage.dim;
					}

					this._buttonNode = this._createButton();
					this._buttonNode.setName(this._name);
					this._node3D.addChild(this._buttonNode);

					return true;
				},

				_registerEvents: function() {
					let _this = this;

					let actorCATI3DXUIEvents = this.QueryInterface(CATI3DXUIEvents.interfaceName);
					if (actorCATI3DXUIEvents) {
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUILeftClickEvent, function() {
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIRightClickEvent, function() {
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIDoubleClickEvent, function() {
							// let buttonActor = _this.QueryInterface('CATICXP3DUIActor');
							// if (buttonActor) {
							// 	buttonActor.doUIDispatchEvent('UIDoubleClickEvent');
							// }
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIPressEvent, function() {
							if (! _this._isPressed) {
								_this._isPressed = true;
								_this.frameVisuChanges.push(_this._refreshButton);
								_this.RequestVisuRefresh();
							}
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIReleaseEvent, function() {
							if (! _this._isPressed) return;

							if (_this._isHovered) {
								_this._isPressed = false;
								_this.frameVisuChanges.push(_this._refreshButton);
								_this.RequestVisuRefresh();
							}
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIEnterEvent, function() {
							if (! _this._isHovered) {
								_this._isHovered = true;
								_this.frameVisuChanges.push(_this._refreshButton);
								_this.RequestVisuRefresh();
							}
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIExitEvent, function() {
							if (_this._isHovered) {
								_this._isHovered = false;
								_this._isPressed = false;
								_this.frameVisuChanges.push(_this._refreshButton);
								_this.RequestVisuRefresh();
							}
						});
						this.listenTo(actorCATI3DXUIEvents, CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIHoverEvent, function() {
						});
					}
				},

				_unregisterEvents: function() {
					this.stopListening();
				},

			});

		return CATE3DImageButton3DGeoVisu;
	});
