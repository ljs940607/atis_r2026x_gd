/*
* @quickReview IBS 19:05:17 correction _pickFromRay + warning for older scripts
*						see ODT StudioCreativeContent_133B_GlobePickFromRayReferentials
* @quickReview IBS 18:04:18 ajustement gestion position/referential pour line et vector
* @quickReview IBS 18:04:16 creation primitives avec positionnement / referrentiel
*							idem pour setObjectPosition
*							correction duree de vie primitives (cas life == 0)
* @quickReview IBS 18:02:12 ExternalizeSharedTransfo : one for all primitives (better creation / destruction perfo)
* @quickreview IBS 18:02:07 deleteObject
* @quickreview IBS 18:01:31 gestion de position/couleur des debugprimitives via ExternalizedArrays
*				_registerObject, setObjectPosition, setObjectColor, onStop, updateDebugPrimitives
* @quickreview IBS 18:01:22 IBS migration APIs H53
* @quickreview IBS 18:01:11 gestion GetActiveEnvironment cote JS sans appel aux bindings
* @quickReview IBS 18:01:04 IR-571599 init JS experienceScaleFactor
							clipping value + focus distance take experienceScale into account
* @quickReview IBS 18:01:04 revert reg APIs JS environments (private + tagged deprecated)
* @quickReview IBS 17:10:24 Globe FD01 : init scale plus tet + gestion gravity pour lune et mars
* @quickReview IBS 17:09:04 revue APIs environment - typage des objets environments
* @quickReview IBS 17:07:29 revue APIs environment (ByName,ByNumber etc)
* @quickReview IBS 17:07:07 commentaire pour doc
* @quickReview IBS 17:05:09 restore authoring environment e la fin du play
* @quickReview IBS 17:04:26 buildVisuServices
* @quickReview IBS 17:04:24 StuEnvironmentsManager.initStartupEnvironment();
* @quickReview IBS 17:04:21 RenderManager fonctionne en repere world : 
*						les inputs sont interpretes en repere world
*						les outputs sont generes en repere world
*						=> on cache la gestion scaling globe
*/

/* global define */
define('DS/StuRenderEngine/StuRenderManager', [
	'DS/StuCore/StuContext',
	'DS/EP/EP',
	'DS/StuCore/StuManager',
	'DS/EPTaskPlayer/EPTask',
	'DS/MathematicsES/MathsDef',
	'DS/StuRenderEngine/StuActor3D',
	'DS/StuRenderEngine/StuVisuPrimitive',
	'DS/StuRenderEngine/StuColor',
	'DS/StuRenderEngine/StuColorRGB', /* requiring the color modules here to solve cyclic dependencies Color<->ColorRGB */
	'DS/StuModel/StuCameraPostProcessEvent'
],
	function (STU, EP, Manager, Task, DSMath, Actor3D, VisuPrimitive, Color, ColorRGB, CameraPostProcessEvent) {
		'use strict';

		/**
		 * Describe a task which manages the STU.RenderManager execution.
		 *
		 * @exports RenderManagerPreProcessTask
		 * @class
		 * @constructor
		 * @private
		 * @extends EP.Task
		 */
		var RenderManagerPreProcessTask = function (iRenderManager) {
			Task.call(this);
			this.name = 'RenderManagerPreProcessTask';
			this.renderManager = iRenderManager;
		};

		RenderManagerPreProcessTask.prototype = new Task();
		RenderManagerPreProcessTask.prototype.constructor = RenderManagerPreProcessTask;

		/**
		 * Process to execute when this STU.RenderManagerPreProcessTask is starting.
		 *
		 * @method
		 * @private
		 */
		RenderManagerPreProcessTask.prototype.onStart = function () {
			this.renderManager.onStart();

			var exp = this.currentExperience = STU.Experience.getCurrent();
			var currentCam = null;

			//ASO4: startup camera is no more defined on playsetting object but directly on the experience
			//var playSettings = exp.PlaySettings;
			//console.log(exp.startupCamera);

			if (exp.currentCamera !== undefined && exp.currentCamera !== null) {
				currentCam = exp.currentCamera;
			}
			else if (exp.startupCamera !== undefined && exp.startupCamera !== null) {
				currentCam = exp.startupCamera;
				//If current camera is not defined, we suppose the startup camera as the current one (edit: startup cam now persisted on experience)
				exp.currentCamera = currentCam;
			}

			if (currentCam !== null) {
				/* jshint camelcase : false */
				if (this.renderManager.main3DViewpoint.__stu__IsLocked() === 0) {
					this.renderManager.main3DViewer.DeactivateDefaultNavigation();
				}
			}

			//Environment
			if (this.renderManager.environmentsServices !== null && this.renderManager.environmentsServices !== undefined) {
				this.renderManager.authoringEnvironment = exp.currentEnvironment;
				if (exp.startupEnvironment != null && exp.startupEnvironment != undefined) {
					exp.currentEnvironment = exp.startupEnvironment;
				}
			}

			//EP.TaskPlayer.removeTask(this);
		};

		RenderManagerPreProcessTask.prototype.onExecute = function () {
			// cleaning caches that needs to be updated on each frame

			this.renderManager._currentEnvironmentCache = undefined;
			this.renderManager._currentCameraCache = undefined;
		};

		/**
		 * Describe a task which manages the STU.RenderManager execution.
		 *
		 * @exports RenderManagerPostProcessTask
		 * @class
		 * @constructor
		 * @private
		 * @extends EP.Task
		 */
		var RenderManagerPostProcessTask = function (iRenderManager) {
			Task.call(this);
			this.name = 'RenderManagerPostProcessTask';
			this.renderManager = iRenderManager;

			// Variable used to avoid updating post processes multiple times per frame
			this.updatingPostProcess = false;
		};

		RenderManagerPostProcessTask.prototype = new Task();
		RenderManagerPostProcessTask.prototype.constructor = RenderManagerPostProcessTask;

		/**
		 * Process to execute when this STU.RenderManagerPostProcessTask is starting.
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.onStart = function () {
			this.renderManager.onStart();

			this.updatingPostProcess = true;
		};

		/**
		 * Process to execute when this STU.RenderManagerPostProcessTask is pausing.
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.onPause = function () {
			this.renderManager.onPause();

			this.cleanPostProcess();
		};

		/**
		 * Process to execute when this STU.RenderManagerPostProcessTask is resuming.
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.onResume = function () {
			this.renderManager.onResume();

			this.updatingPostProcess = true;
		};

		/**
		 * Process to execute when this STU.RenderManagerPostProcessTask is stopping.
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.onStop = function () {
			this.renderManager.onStop();

			this.cleanPostProcess();
		};

		/**
		 * Process to execute when this STU.RenderManagerPostProcessTask is executing.
		 *
		 * @method
		 * @private
		 * @param {EP.PlayerContext} iPlayerContext
		 */
		RenderManagerPostProcessTask.prototype.onExecute = function (iPlayerContext) {
			this.renderManager.onPostExecute(iPlayerContext);

			if (this.updatingPostProcess) {
				this.updatingPostProcess = false;
				this.updatePostProcess();
			}
		};

		/**
		 * Helper function used to update post process in the viewer
		 * - the startup/current camera is used to retrieve post process values
		 * - supported post process properties :
		 *   - tone mapping
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.updatePostProcess = function () {
			var exp = this.currentExperience = STU.Experience.getCurrent();
			if (!exp) return;
			
			var startupCam = undefined;
			if (exp.startupCamera !== undefined && exp.startupCamera !== null) {
				startupCam = exp.startupCamera;
			} else if (exp.currentCamera !== undefined && exp.currentCamera !== null) {
				startupCam = exp.currentCamera;
			} if (!startupCam) return;
			
			var viewer = this.renderManager.main3DViewer._viewer;
			if (!viewer) return;
			
			var toneMappingEffect = viewer.getEffect("ToneMapping");
			if (startupCam.enableToneMapping) {
				switch (startupCam.toneMapping) {
					case 0:
						var blacks = startupCam.blacks;
						var whites = startupCam.whites;
						var saturation = startupCam.saturation;
						toneMappingEffect.setToneMapping(6, {
							crushblacks: blacks,
							burnhighlights: whites,
							saturation: saturation,
							// colorCorrection: gamma
						}); 
						break;
					case 1:
						toneMappingEffect.setToneMapping(4);
						break;
					default:
						break;
					}
					var gamma = startupCam.gamma;
					toneMappingEffect.setGamma(gamma);
			} else {
				toneMappingEffect.setToneMapping(1);
				// setToneMapping(0) => gamma reset to ColorCorrectionEnum.NONE;
			}

			viewer.render();
		};

		/**
		 * Helper function used to deactivate post process in the viewer
		 * - the startup/current camera is used to retrieve post process values
		 * - supported post process properties :
		 *   - tone mapping
		 *
		 * @method
		 * @private
		 */
		RenderManagerPostProcessTask.prototype.cleanPostProcess = function () {
			var viewer = this.renderManager.main3DViewer._viewer;
			if (viewer) {
				var toneMappingEffect = viewer.getEffect("ToneMapping");
				toneMappingEffect.setToneMapping(1);
			}
		};

		/**
		 * Describe a task which manages the STU.RenderManager
		 * debug primitives execution.
		 *
		 * @exports RenderManagerMainTask
		 * @class
		 * @constructor
		 * @private
		 * @extends EP.Task
		 */
		var RenderManagerMainTask = function (iRenderManager) {
			Task.call(this);
			this.name = 'RenderManagerMainTask';
			this.rm = iRenderManager;
		};

		RenderManagerMainTask.prototype = new Task();
		RenderManagerMainTask.prototype.constructor = RenderManagerMainTask;

		RenderManagerMainTask.prototype.onExecute = function (iPlayerContext) {
			this.rm.updateDebugPrimitives(iPlayerContext);
		};


		/**
		 * <p>Describe a STU.Manager which is managing the visual representation and cameras of the STU.Experience.</p>
		 * <p>Information about the main 3D Viewer are accessible through this API.</p>
		 *
		 * @example
		 * //Get the render manager
		 * let rm = STU.RenderManager.getInstance();
		 *
		 * //Get the current camera
		 * let currentCamera = rm.getCurrentCamera();
		 *
		 * @exports RenderManager
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Manager
		 * @memberof STU
		 * @alias STU.RenderManager
		 */
		var RenderManager = function () {

			Manager.call(this);

			this.name = 'RenderManager';

			// Pointer to a C++ object wrapping the Main3DViewer
			// That object is a StuViewer object
			this.main3DViewer;

			// Pointer to a C++ object wrapping the Main3DViewpoint
			// That object is a StuViewpoint3D object
			this.main3DViewpoint = null;

			// map of debug primitive objects
			this.map = {};

			//map of uniqueID and 3Dactor used for picking
			this.pickingMap = {};

			this.experienceScaleFactor = 1.0;

			this.currentExperience = null;

			this._currentEnvironmentCache = undefined;
			this._currentCameraCache = undefined;
		};

		RenderManager.prototype = new Manager();
		RenderManager.prototype.constructor = RenderManager;

		/**
		 * Process to execute when this STU.RenderManager is initializing.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onInitialize = function (oExceptions) {
			this.main3DViewer = this.buildViewer();
			this.main3DViewpoint = this.buildViewpoint();
			this.StuGeomPrimitive_ISOManager = this.buildGeomPrimitive_ISOManager(); // jshint ignore:line
			this.SharedTransfo = new Float64Array(12);
			this.StuGeomPrimitive_ISOManager.ExternalizeSharedTransfo(this.SharedTransfo);
			this.environmentsServices = this.buildEnvironmentsManager();
			if (this.environmentsServices !== null && this.environmentsServices !== undefined) {
				//CLE2 : environment refacto
				//only called because of setActiveLocation. To remove after refacto with globe
				//this.environmentsServices.initStartupEnvironment();
				if (this.currentExperience != null && this.currentExperience != undefined) {
					if (this.currentExperience.startupLocation != null && this.currentExperience.startupLocation != undefined) {
						this.currentExperience.currentLocation = this.currentExperience.startupLocation;
					}
				}

				this.experienceScaleFactor = this.environmentsServices.getExperienceScaleFactor();
			}


			// do not add this task now, but when the player
			// has finished loading so that this task ends up after 
			// all other (behavioral) tasks
			this.renderTask = new RenderManagerPostProcessTask(this);
			EP.TaskPlayer.addTask(this.renderTask, STU.getTaskGroup(STU.ETaskGroups.ePostProcess));

			// current camera / current environment init & cache update
			EP.TaskPlayer.addTask(new RenderManagerPreProcessTask(this), STU.getTaskGroup(STU.ETaskGroups.ePreProcess));

			this.debugPrimitivesTask = new RenderManagerMainTask(this);
			EP.TaskPlayer.addTask(this.debugPrimitivesTask);

			this.camPostProcessCb = STU.makeListener(this, 'onCameraPostProcessEvent');
			EP.EventServices.addListener(STU.CameraPostProcessEvent, this.camPostProcessCb);
		};

		RenderManager.prototype.onPlayerPostStartEvent = function () {
			EP.EventServices.removeObjectListener(EP.PlayerPostStartEvent, this, 'onPlayerPostStartEvent');
			EP.TaskPlayer.addTask(this.renderTask);
			this.renderTask.start();
		};

		RenderManager.prototype.onCameraPostProcessEvent = function () {
			this.renderTask.updatingPostProcess = true;
		};


		/**
		 * Register an actor in the picking map
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.registerActor = function (iUniqueId, actor) {
			this.pickingMap[iUniqueId] = actor;
		};


		/**
		 * Process to execute when this STU.RenderManager is disposing.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onDispose = function () {
			EP.TaskPlayer.removeTask(this.renderTask);
			EP.TaskPlayer.removeTask(this.debugPrimitivesTask);
			EP.EventServices.removeListener(STU.CameraPostProcessEvent, this.camPostProcessCb);
			delete this.renderTask;
			delete this.debugPrimitivesTask;
			delete this.main3DViewer;

			this.pickingMap = {};
		};

		/**
		 * Return the current camera actor.
		 *
		 * @method
		 * @public
		 * @return {STU.Camera}
		 */
		RenderManager.prototype.getCurrentCamera = function () {

			if (this._currentCameraCache == undefined) {
				var exp = STU.Experience.getCurrent();
				this._currentCameraCache = exp.currentCamera;
			}

			return this._currentCameraCache;
		};

		/**
		 * Set the current camera actor.
		 * 
		 * Setting a camera as current automatically disables
		 * the navigation behavior from the previous current camera, if 
		 * that camera was hosting one, and enables the navigation of the 
		 * new camera.
		 *
		 * @method
		 * @public
		 * @param {STU.Camera} iActorCamera
		 */
		RenderManager.prototype.setCurrentCamera = function (iActorCamera) {

			// makes sure cache is updated
			let previousCam = this.getCurrentCamera();

			// disabling the previous camera
			if (!!previousCam && previousCam != iActorCamera) {
				if (STU.Navigation) {	// Doesn't always exist on web... I cannot require it here, as it is not in a prereq FW
					let nav = previousCam.getBehaviorByType(STU.Navigation);
					if (!!nav) {
						nav.disable();
					}
				}
			}

			// updating the cache for this frame
			this._currentCameraCache = iActorCamera;

			// updating the datamodel
			var exp = STU.Experience.getCurrent();
			exp.currentCamera = iActorCamera;

			// enabling the new camera
			if (!!iActorCamera) {
				if (STU.Navigation) {	// Doesn't always exist on web... I cannot require it here, as it is not in a prereq FW				
					let nav = iActorCamera.getBehaviorByType(STU.Navigation);
					if (!!nav) {
						nav.enable();
					}
				}
			}
		};

		/**
		 * Return the 3D viewer size.
		 *
		 * @method
		 * @public
		 * @return {DSMath.Vector2D}
		 */
		RenderManager.prototype.getViewerSize = function () {
			var size = new DSMath.Vector2D();
			this.main3DViewer.GetSize(size);
			return size;
		};

		/**
		 * returns the Inverse of the size(height) of a pixel in millimeter.
		 *
		 * @method
		 * @public
		 * @return {Number}
		 */
		RenderManager.prototype.getPixelDensity = function () {
			var size = {
				pxDensity: 0
			};
			this.main3DViewer.GetPixelDensity(size);
			return size.pxDensity;
		};

		/**
		 * Return a bounding sphere which is enclosing all geometry of the 3D viewer.
		 *
		 * @method
		 * @private
		 * @return {STU.Sphere} instance object corresponding to the bounding sphere
		 */
		RenderManager.prototype.getGlobalBoundingSphere = function () {

			// IBS GLOBE SCALE getGlobalBoundingSphere renvoit un resultat dans le repere Visu
			// on renvoit le resultat module par experience scale pour avoir une valeur dans le repere World

			var sphere = new STU.Sphere();
			this.main3DViewer.GetGlobalBoundingSphere(sphere);

			var ScaleFactor = 1.0 / this.experienceScaleFactor;
			sphere.setRadius(ScaleFactor * sphere.getRadius());
			var Center = sphere.getCenter();
			sphere.setCenter(Center.multiplyScalar(ScaleFactor));
			return sphere;
		};


		/**
		 * Generate a STU.Ray from a viewer position in 2D.
		 *
		 * @method
		 * @private
		 * @param {DSMath.Vector2D} iPosition
		 * @return {STU.Ray}
		 */
		RenderManager.prototype.getRayFromPosition = function (iPosition) {

			// IBS GLOBE SCALE getRayFromPosition renvoit un resultat dans le repere Visu
			// on renvoit le resultat module par experience scale pour avoir une valeur dans le repere World

			var ray = new STU.Ray();
			this.main3DViewer.GetRayFromPosition(iPosition, ray);

			var ScaleFactor = 1.0 / this.experienceScaleFactor;
			var Origin = ray.getOrigin();
			ray.setOrigin(Origin.multiplyScalar(ScaleFactor));
			var Direction = ray.getDirection();
			ray.setDirection(Direction.multiplyScalar(ScaleFactor));
			var Length = ray.getLength();
			ray.setLength(ScaleFactor * Length);
			return ray;
		};

		/**
		 * Generate a DSMath.Line from a viewer position in 2D.
		 *
		 * @method
		 * @private
		 * @param {DSMath.Vector2D} iPosition
		 * @return {DSMath.Line}
		 */
		RenderManager.prototype.getLineFromPosition = function (iPosition) {

			// IBS GLOBE SCALE getLineFromPosition 
			// iPosition est un point dans le repere ecran (X,Y)
			// je veux renvoyer un resultat dans le repere Monde
			// main3DViewer travaille dans le repere Visu

			var line = new DSMath.Line();
			this.main3DViewer.GetLineFromPosition(iPosition, line);

			// line de repere Visu e Monde
			var ScaleFactor = 1.0 / this.experienceScaleFactor;
			var scaleTransform = DSMath.Transformation.makeScaling(ScaleFactor, new DSMath.Point(0, 0, 0));
			line.applyTransformation(scaleTransform);

			return line;
		};


		/**
		 * Perform a picking action from a viewer position in 2D through the current STU.Experience.
		 *
		 * Note: if iOptions.returnFirstIntersection is set to false, the return value is an array of STU.Intersection instead of a single or null object.
		 * 
		 * @method
		 * @public
		 *
		 * @param {DSMath.Vector2D} iPosition 2D position of the picking origin, in screen's referential
		 * @param {object} [iOptions] Additional options.
		 * @param {boolean} [iOptions.returnFirstIntersection=true] If true, only the closest intersection is returned.
		 * @param {boolean} [iOptions.pickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iOptions.referential] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 * @param {boolean} [iOptions.retrieveOnlyActor=true] If true, does not compute picking point and normal. It will only returns picked actor. Setting this option to true makes the picking much faster if GPU picking is activated
		 * 
		 * @return {STU.Intersection} A single intersection or an array of intersection, according to returnFirstIntersection value
		 */
		RenderManager.prototype.pickFromScreen = function (iPosition, iOptions) {
			var intersections;
			var first = true;

			if (iOptions !== undefined) {
				if (iOptions.returnFirstIntersection !== undefined)
					first = iOptions.returnFirstIntersection;
				intersections = this._pickFromPosition(iPosition, iOptions.returnFirstIntersection, iOptions.pickAllElements, iOptions.referential, iOptions.retrieveOnlyActor);
			}
			else {
				intersections = this._pickFromPosition(iPosition);
			}

			if (first) {
				if (intersections.length != 0)
					return intersections[0];
				else
					return null;
			}

			return intersections;
		};

		/**
		 * Perform a picking action from a STU.Ray through the current STU.Experience.
		 *
		 * Note: if iOptions.returnFirstIntersection is set to false, the return value is an array of STU.Intersection instead of a single or null object.
		 * 
		 * @method
		 * @public
		 *
		 * @param {STU.Ray} iRay ray definition in given referential.
		 * @param {object} [iOptions] Additional options.
		 * @param {boolean} [iOptions.returnFirstIntersection=true] If true, only the closest intersection is returned.
		 * @param {boolean} [iOptions.pickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iOptions.referential] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 *
		 * @return {STU.Intersection} A single intersection or an array of intersection, according to returnFirstIntersection value.
		 */
		RenderManager.prototype.pickFromRay = function (iRay, iOptions) {
			var intersections;
			var first = true;

			if (iOptions !== undefined) {
				if (iOptions.returnFirstIntersection !== undefined)
					first = iOptions.returnFirstIntersection;
				intersections = this._pickFromRay(iRay, iOptions.returnFirstIntersection, iOptions.pickAllElements, iOptions.referential);
			}
			else {
				intersections = this._pickFromRay(iRay);
			}

			if (first) {
				if (intersections.length != 0)
					return intersections[0];
				else
					return null;
			}

			return intersections;
		};

		/**
		 * Perform a picking action from a STU.Ray through the current STU.Experience.
		 *
		 * Note: if iOptions.returnFirstIntersection is set to false, the return value is an array of STU.Intersection instead of a single or null object.
		 * 
		 * @method
		 * @private
		 *
		 * @param {DSMath.Line} iLine line definition in given referential.
		 * @param {object} [iOptions] Additional options.
		 * @param {boolean} [iOptions.returnFirstIntersection=true] If true, only the closest intersection is returned.
		 * @param {boolean} [iOptions.pickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iOptions.referential] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 * @return {STU.Intersection} A single intersection or an array of intersection, according to returnFirstIntersection value
		 */
		RenderManager.prototype.pickFromLine = function (iLine, iOptions) {
			var intersections;
			var first = true;

			if (iOptions !== undefined) {
				if (iOptions.returnFirstIntersection !== undefined)
					first = iOptions.returnFirstIntersection;

				intersections = this._pickFromLine(iLine, iOptions.returnFirstIntersection, iOptions.pickAllElements, iOptions.referential);
			}
			else {
				intersections = this._pickFromLine(iLine);
			}

			if (first) {
				if (intersections.length != 0)
					return intersections[0];
				else
					return null;
			}

			return intersections;
		};


		/**
		 * Perform a picking action toward the ground from a specified origin through the current STU.Experience.
		 *
		 * @method
		 * @public
		 *
		 * @param {DSMath.Point} iPosition the origin of the raycast expressed in the specified reference (in world reference if there is no reference specified).
		 * @param {object} [iOptions] Additional options.     
		 * @param {boolean} [iOptions.pickGeometry=true] If enabled, the picking will take in count the geometry of the actors present in the experience.
		 * @param {boolean} [iOptions.pickTerrain=true] If enabled, the picking will take in count the mesh representing the terrain (Only in globe context).
		 * @param {boolean} [iOptions.pickWater=true] If enabled, the picking will take in count the shader representing the water (Only in globe context).
		 * @param {STU.Referential} [iOptions.referential] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 *
		 * @return {STU.Intersection}
		 */
		RenderManager.prototype.pickGroundFromPosition = function (iPosition, iOptions) {
			var params = {};

			if (iPosition instanceof DSMath.Transformation) {
				params.position = new DSMath.Point(iPosition.vector.x, iPosition.vector.y, iPosition.vector.z);
			}
			else {
				params.position = iPosition.clone();
			}

			if (iOptions !== undefined) {
				params.pickGeometry = iOptions.pickGeometry;
				params.pickTerrain = iOptions.pickTerrain;
				params.pickWater = iOptions.pickWater;
				params.reference = iOptions.referential;
			}

			return this._pickGroundFromPosition(params);
		};


		/**
		 * Create and display a box shape.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation} iTransform The origin of the box.
		 * @param {DSMath.Vector3D} iSize The size of the box on each axis.
		 * @param {object} [iOptions] Some additional options.
		 * @param {boolean} [iOptions.screenSize=false] If true, then size if interpreted as a constant screen size in mm.
		 * @param {number} [iOptions.thickness] If set, then controls the thickness in mm of the drawn lines.
		 * @param {boolean} [iOptions.centered=true] If false, the origin of the box is its lower corner instead of its center.
		 * @param {boolean} [iOptions.wireframe=true] If true, the box is displayed with lines and not solid faces.
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime=-1] The lifetime of the displayed object. 
			<br/>if -1, the shape will be visible until destroyed
			<br/>if 0 the shape will be visible only one frame
			<br/>if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createBox = function (iTransform, iSize, iOptions) {
			var params = {};
			params.position = iTransform;
			params.size = iSize;
			params.close = false;
			params.alpha = 255;
			params.centered = 1;

			if (iOptions !== undefined) {
				params.lineWidth = iOptions.thickness;
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;

				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
				if (iOptions.screenSize !== undefined)
					params.screenSize = iOptions.screenSize === true ? 1 : 0;
				if (iOptions.wireframe !== undefined)
					params.closed = iOptions.wireframe === true ? 0 : 1;
				if (iOptions.centered !== undefined) {
					params.centered = iOptions.centered === true ? 1 : 0;
				}
			}

			return this._createBox(params);
		};

		/**
		 * Create and display a sphere shape.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation|DSMath.Point} iTransform The origin of the sphere.
		 * @param {number} iRadius The radius of the sphere in mm.
		 * @param {object} [iOptions] Some aditional options.
		 * @param {boolean} [iOptions.screenSize=false] If true, then size if interpreted as a constant screen size in mm.          
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime=-1] The lifetime of the displayed object. 
			if -1, the shape will be visible until destroyed
			if 0 the shape will be visible only one frame
			if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createSphere = function (iTransform, iRadius, iOptions) {
			var params = {};
			params.position = iTransform;
			params.radius = iRadius;
			params.alpha = 255;

			if (iTransform instanceof DSMath.Point) {
				params.position = new DSMath.Transformation();
				params.position.setVector(iTransform.x, iTransform.y, iTransform.z);
			}

			if (iOptions !== undefined) {
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;


				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
				if (iOptions.screenSize !== undefined)
					params.screenSize = iOptions.screenSize === true ? 1 : 0;
			}

			return this._createSphere(params);
		};

		/**
		 * Create and display a point with a fixed size on screen.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation|DSMath.Vector3D|DSMath.Point} iPosition The position of the point shape.
		 * @param {object} [iOptions] Some aditional options.
		 * @param {boolean} [iOptions.size=2] If set, defines the radius of the point in mms on screen.
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime-1] The lifetime of the displayed object. 
			if -1, the shape will be visible until destroyed
			if 0 the shape will be visible only one frame
			if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createPoint = function (iPosition, iOptions) {
			var params = {};

			if (iPosition instanceof DSMath.Point || iPosition instanceof DSMath.Vector3D) {
				params.position = new DSMath.Transformation();
				params.position.setVector(iPosition.x, iPosition.y, iPosition.z);
			}
			else if (iPosition instanceof DSMath.Transformation) {
				params.position = iPosition;
			}

			params.alpha = 255;

			if (iOptions !== undefined) {
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;

				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
				if (iOptions.size !== undefined)
					params.size = iOptions.size / 2;
			}

			return this._createPoint(params);
		};


		/**
		 * Create and display a vector (an arrow) shape.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation|DSMath.Vector3D|DSMath.Point} iOrigin The origin of the arrow.
		 * @param {DSMath.Vector3D} iDirection The direction the arrow is pointing toward.
		 
		 * @param {object} [iOptions] Some aditional options.     
		 * @param {number} [iOptions.length=10] The length of the arrow (from the base to the tip of the head).
		 * @param {number} [iOptions.thickness=auto] If set, controls the thickness in mms of the arrow's base. If unset, the thickness will be computed automatically (length / 100).
		 * @param {number} [iOptions.headLength=auto] If set, controls the length of the arrow's head.
		 * @param {number} [iOptions.headWidth=auto] If set, controls the width of the arrow's head.
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime] The lifetime of the displayed object. 
			if -1, the shape will be visible until destroyed
			if 0 the shape will be visible only one frame
			if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createVector = function (iOrigin, iDirection, iOptions) {

			var params = {};
			params.direction = iDirection.clone();
			params.length = 10;
			params.alpha = 255;
			params.screenSize = 1;

			if (iOrigin instanceof DSMath.Point || iOrigin instanceof DSMath.Vector3D) {
				params.startPoint = iOrigin.clone();
			}
			else if (iOrigin instanceof DSMath.Transformation) {
				params.startPoint = iOrigin.vector.clone();
			}

			if (iOptions !== undefined) {
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;
				params.headWidth = iOptions.headWidth;
				params.headLength = iOptions.headLength;

				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
				if (iOptions.length !== undefined)
					params.length = iOptions.length;
				if (iOptions.screenSize !== undefined)
					params.screenSize = iOptions.screenSize === true ? 1 : 0;
				if (iOptions.thickness != undefined)
					params.width = iOptions.thickness;
			}

			return this._createVector(params);
		};

		/**
		 * Create and display a line shape.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation|DSMath.Vector3D|DSMath.Point} iOrigin The origin of the line.
		 * @param {DSMath.Transformation|DSMath.Vector3D|DSMath.Point} iEnd The end of the line.     
		 * @param {object} [iOptions] Some aditional options.     
		 * @param {number} [iOptions.thickness=auto] If set, controls the thickness in mms of the arrow's base. If unset, the thickness will be computed automatically (length / 100).     
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime=-1] The lifetime of the displayed object. 
			if -1, the shape will be visible until destroyed
			if 0 the shape will be visible only one frame
			if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createLine = function (iOrigin, iEnd, iOptions) {
			var params = {};
			params.alpha = 255;

			if (iOrigin instanceof DSMath.Point || iOrigin instanceof DSMath.Vector3D) {
				params.startPoint = iOrigin.clone();
			}
			else if (iOrigin instanceof DSMath.Transformation) {
				params.startPoint = iOrigin.vector.clone();
			}

			if (iEnd instanceof DSMath.Point || iEnd instanceof DSMath.Vector3D) {
				params.endPoint = iEnd.clone();
			}
			else if (iEnd instanceof DSMath.Transformation) {
				params.endPoint = iEnd.vector.clone();
			}

			if (iOptions !== undefined) {
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;
				params.width = iOptions.thickness;

				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
			}

			return this._createLine(params);
		};


		/**
		 * Create and display a axis system shape.
		 *      
		 * @method
		 * @public
		 *
		 * @param {DSMath.Transformation} iTransform The tranformation defining the axis system.
		 * @param {object} [iOptions] Some aditional options.     
		 * @param {number} [iOptions.thickness=auto] If set, controls the thickness in mms of the arrow's base. If unset, the thickness will be computed automatically (length / 100).
		 * @param {boolean} [iOptions.size=10] The length of each arrow representing the axes.     
		 * @param {boolean} [iOptions.screenSize=true] If true, then size if interpreted as a constant screen size in mm.          
		 * @param {STU.Referential} [iOptions.referential] The referential in which the inputs informations are given.
		 * @param {STU.Color} [iOptions.color] The color of the displayed shape.
		 * @param {number} [iOptions.opacity=1] The opacity of the displayed shape. 0 is fully transparent, 1 is fully opaque.
		 * @param {number} [iOptions.lifetime=-1] The lifetime of the displayed object. 
			if -1, the shape will be visible until destroyed
			if 0 the shape will be visible only one frame
			if >0 the shape will be disappear progressively during N milliseconds
		 * 
		 * @return {STU.VisuPrimitive}
		 */
		RenderManager.prototype.createAxes = function (iTransform, iOptions) {
			var params = {};
			params.position = iTransform;
			params.alpha = 255;
			params.size = 10;
			params.screenSize = true;

			if (iOptions !== undefined) {
				params.referential = iOptions.referential;
				params.color = iOptions.color;
				params.lifetime = iOptions.lifetime;
				if (iOptions.opacity !== undefined)
					params.alpha = iOptions.opacity * 255;
				if (iOptions.size !== undefined)
					params.size = iOptions.size;
				if (iOptions.screenSize !== undefined)
					params.screenSize = iOptions.screenSize === true ? 1 : 0;
			}

			return this._createAxis(params);
		};


		/**
		 * Parse results of the pick.
		 *      
		 * @method
		 * @private
		 * @param {Array.<STU.Intersection>} iIntersections Intersections resulting from the pick
		 * @param {STU.Referential} [iReferential] The referential where the output coordinate will be expressed. If null, output coordinate are expressed in world context.
		 * @param {Boolean} [iPickFromRay=false] Indicate if the function was called by pickFromRay function
		 *
		 */
		RenderManager.prototype._parsePickingResult = function (iIntersections, iReferential) {

			if (iReferential === null || iReferential === undefined) {
				iReferential = "World";
			}
			var ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iReferential, "Visu");
			var invReferentialTransfo_Visu = ReferentialTransfo_Visu.getInverse();

			for (var i = 0; i < iIntersections.length; i++) {
				var intersection = iIntersections[i];
				var newIntersection = new STU.Intersection();

				var uniqueId = intersection.uniqueID;
				if (uniqueId !== undefined) {
					intersection.actor = this.pickingMap[uniqueId];
				}
				newIntersection.setActor(intersection.actor);

				if (intersection.point && intersection.normal) {
					intersection.point = intersection.point.applyTransformation(invReferentialTransfo_Visu);
					intersection.normal = intersection.normal.applyTransformation(invReferentialTransfo_Visu);
					intersection.normal.normalize();
					newIntersection.setPoint(intersection.point);
					newIntersection.setNormal(intersection.normal);
				}

				// _pickPath is used with VIVE to be able to pick 3DUIActors (picking delegation)			
				// it is set by StuViewer only when iPickAllElement is TRUE
				if (intersection._pickPath !== undefined) {
					newIntersection._pickPath = intersection._pickPath;
				}

				if (intersection._occurence !== undefined) {
					newIntersection._occurence = intersection._occurence;
				}

				iIntersections[i] = newIntersection;
			}
		};

		/**
		 * Perform a picking action from a viewer position in 2D through the current STU.Experience.
		 *
		 * @method
		 * @private
		 * @param {DSMath.Vector2D} iPosition
		 * @param {Boolean} [iReturnFirstIntersection=true] If true, the returned array will contain only the closest intersection.
		 * @param {Boolean} [iPickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. 
		 * This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iReferential] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 * @param {boolean} [iRetrieveOnlyActor=true] If true, does not compte picking point and normal. It will only returns picked actor. Setting this option to true makes the picking much faster if GPU picking is activated.
		 * @return {Array.<STU.Intersection>}
		 */
		RenderManager.prototype._pickFromPosition = function (iPosition, iReturnFirstIntersection, iPickAllElements, iReferential, iRetrieveOnlyActor) {

			// IBS GLOBE SCALE _pickFromPosition 
			// iPosition est un point dans le repere ecran (X,Y)
			// je veux renvoyer un resultat dans le repere Monde
			// main3DViewer travaille dans le repere Visu

			var intersections = [];
			var returnFirstIntersection = (typeof iReturnFirstIntersection === 'undefined') ? true : iReturnFirstIntersection;
			var pickAllElements = (typeof iPickAllElements === 'undefined') ? false : iPickAllElements;
			var retrieveOnlyActor = (typeof iRetrieveOnlyActor === 'undefined') ? true : iRetrieveOnlyActor;
			this.main3DViewer.PickFromPosition(iPosition, intersections, returnFirstIntersection, pickAllElements, retrieveOnlyActor);

			this._parsePickingResult(intersections, iReferential);

			return intersections;
		};

		/**
		 * Perform a picking action from a STU.Ray through the current STU.Experience.
		 *
		 * @method
		 * @private
		 * @param {STU.Ray} iRay
		 * @param {Boolean} [iReturnFirstIntersection=true] If true, the returned array will contain only the closest intersection.
		 * @param {Boolean} [iPickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. 
		 * This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iReferential] The referential where the input coordinate should be expressed and the output coordinate will be expressed. If null, all coordinate are experessed in world context.
		 * @return {Array.<STU.Intersection>}
		 */
		RenderManager.prototype._pickFromRay = function (iRay, iReturnFirstIntersection, iPickAllElements, iReferential) {

			if (iReferential === null || iReferential === undefined) {
				iReferential = "World";
			}

			var intersections = [];
			var returnFirstIntersection = (typeof iReturnFirstIntersection === 'undefined') ? true : iReturnFirstIntersection;
			var pickAllElements = (typeof iPickAllElements === 'undefined') ? false : iPickAllElements;

			// 1 : Express ray from iRef to Visu context if necessary
			var VisuRay = new STU.Ray();
			VisuRay.origin = iRay.origin.clone();
			VisuRay.direction = iRay.direction.clone();
			VisuRay.length = iRay.length;

			var ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iReferential, "Visu");
			VisuRay.origin.applyTransformation(ReferentialTransfo_Visu);
			VisuRay.direction.applyTransformation(ReferentialTransfo_Visu);
			VisuRay.direction.normalize();

			VisuRay.length /= Math.cbrt(ReferentialTransfo_Visu.matrix.determinant());// don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)

			// 3 : PICK
			this.main3DViewer.PickFromRay(VisuRay, intersections, returnFirstIntersection, pickAllElements);

			//console.log("intersections : " + JSON.stringify(intersections));

			this._parsePickingResult(intersections, iReferential);

			//console.log("intersections : " + JSON.stringify(intersections));

			return intersections;
		};

		/**
		 * Perform a picking action from a DSMath.Line through the current STU.Experience.
		 *
		 * @method
		 * @private
		 * @param {DSMath.Line} iLine
		 * @param {Boolean} [iReturnFirstIntersection=true] If true, the returned array will contain only the closest intersection.
		 * @param {Boolean} [iPickAllElements=false] If true, all objects intersected by the ray will be returned not only actors. 
		 * This may greatly impact performances combined with iReturnFirstIntersection=false.
		 * @param {STU.Referential} [iReferential] The referential where the input coordinate should be expressed and the output coordinate will be expressed. If null, all coordinate are experessed in world context.
		 * @return {Array.<STU.Intersection>}
		 */
		RenderManager.prototype._pickFromLine = function (iLine, iReturnFirstIntersection, iPickAllElements, iReferential) {

			if (iReferential === null || iReferential === undefined) {
				iReferential = "World";
			}

			// IBS GLOBE SCALE _pickFromLine 
			// iLine est un rayon dans le repere monde
			// je veux renvoyer un resultat dans le repere Monde
			// main3DViewer travaille dans le repere Visu

			var intersections = [];
			var returnFirstIntersection = (typeof iReturnFirstIntersection === 'undefined') ? true : iReturnFirstIntersection;
			var pickAllElements = (typeof iPickAllElements === 'undefined') ? false : iPickAllElements;

			// 1 : Express iLine from iRef to Visu context if necessary
			var VisuLine = iLine.clone();
			var ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iReferential, "Visu");
			VisuLine.applyTransformation(ReferentialTransfo_Visu);

			this.main3DViewer.PickFromLine(VisuLine, intersections, returnFirstIntersection, pickAllElements);
			this._parsePickingResult(intersections, iReferential);
			return intersections;
		};


		/**
		 * Gets the 2D mouse position in the viewer.
		 * 
		 * Notes:
		 * 	- (0,0) coordinates represent the top left corner
		 * 	- (viewer width, viewer height) coordinates represent the bottom right corner
		 *		 
		 * @method
		 * @public
		 * @return  {DSMath.Point2D} position of the mouse on screen, inside the main viewer
		 * @see STU.RenderManager.getViewerSize()
		 */
		RenderManager.prototype.getMousePosition = function () {
			var pos = new DSMath.Point2D();
			this.main3DViewer.GetMousePosition(pos);
			return pos;
		};

		/**
		 * Computes the mouse position into the world referential,
		 * projecting the 2D mouse position onto a plane parallel to the camera
		 * and place at a given depth.
		 * 
		 * Note: using iUseSphericalProjection let's you have a mouse projection to a constant 
		 * distance iDepth to the camera.
		 * 
		 * @example
		 * let rm = STU.RenderManager.getInstance();
		 * let pos = rm.getMousePositionIn3D(3000);
		 * let posVec = new DSMath.Vector3D(pos.x, pos.y, pos.z);
		 * this.getExperience().getActorByName("Cube").setPosition(posVec);
		 * 
		 * @public
		 * @param {number} iDepth distance from the camera of the projection plane
		 * @param {boolean} [iUseSphericalProjection=false] distance from the camera to a spherical projection plane
		 * @return {DSMath.Point} position of the mouse in world referential
		 */
		RenderManager.prototype.getMousePositionIn3D = function (iDepth, iUseSphericalProjection) {
			// note: this implementation could probably be much more optimized
			// but I didn't want to expose yet another binding (win + web)
			// for this edgy use case

			if (iDepth == undefined || !(typeof iDepth == "number") || iDepth == 0) {
				throw new TypeError('iDepth argument is invalid - non zero number expected');
			}

			let rm = STU.RenderManager.getInstance();

			// computing a line from 2D mouse pos, projected on camera's near and far plane
			let pos = rm.getMousePosition()
			let line = rm.getLineFromPosition(pos);

			let cam = rm.getCurrentCamera();
			if (cam == undefined) {
				throw new Error('a camera must be current');
			}

			let camPos = cam.getPosition();

			let planePos = DSMath.Vector3D.add(camPos, DSMath.Vector3D.multiplyScalar(cam.getForward(), iDepth));
			let plane = new DSMath.Plane(planePos, cam.getRight(), cam.getUp());

			let data = plane.intersectLine(line);
			if (data.diag != 0) {
				// it should not happen, but we never know		
				throw new Error('unexpected intersection result');
			}
			let interPoint = plane.evalPoint(data.param1OnPlane, data.param2OnPlane);

			// transform intersection with plane to an interspection with a sphere
			if (iUseSphericalProjection) {
				let dir = DSMath.Vector3D.sub(interPoint, camPos);
				dir.normalize();
				dir.multiplyScalar(iDepth);

				// now interpoint is interspection with a sphere of iDepth radius
				interPoint = DSMath.Vector3D.add(camPos, dir);
			}

			return new DSMath.Point(interPoint.x, interPoint.y, interPoint.z);
		};

		/**
		 * Sets the mouse position in the viewer
		 * 	
		 * Notes: 
		 *  - (0,0) is the top left corner
		 * 	- (getViewerSize().x, getViewerSize().y) is the bottom right corner
		 *
		 * @method
		 * @private
		 * @param   {DSMath.Vector2D}     iPos Position of mouse
		 * @see STU.RenderManager.getViewerSize()
		 */
		RenderManager.prototype.setMousePosition = function (iPos) {
			this.main3DViewer.SetMousePosition(iPos);
		};

		/**
		 * Hide the mouse cursor
		 * @method
		 * @private
		 */
		RenderManager.prototype.hideMouseCursor = function () {
			this.main3DViewer.HideMouseCursor();
		};

		/**
		 * Restore the mouse cursor
		 * @method
		 * @private
		 */
		RenderManager.prototype.showMouseCursor = function () {
			this.main3DViewer.ShowMouseCursor();
		};

		/**
		 * Highlights the input actor using the current highlight visual settings defined in user preferences.
		 * 
		 * @method
		 * @public
		 * @param {STU.Actor3D} iActor actor which is to be highlighted.		 
		 * @param {object} [iOptions] for internal use only.
		 */
		RenderManager.prototype.highlight = function (iActor, iOptions) {
						
			let expObject = iActor.CATI3DExperienceObject;

			if (iOptions !== undefined && iOptions.prehighlight === true) {
				this.main3DViewer.PreHighlightDisplay(expObject, 1);
			} else {
				this.main3DViewer.HighlightDisplay(expObject, 1);
			}
		};

		/**
		 * Removes the highlight on the input actor.
		 * 
		 * @method
		 * @public
		 * @param {STU.Actor3D} iActor actor which is to be highlighted.		 
		 */
		RenderManager.prototype.dehighlight = function (iActor) {
			let expObject = iActor.CATI3DExperienceObject;

			// make sure the actor is removed from highlight and prehighlight
			this.main3DViewer.HighlightDisplay(expObject, 0);
			this.main3DViewer.PreHighlightDisplay(expObject, 0);
		};

		/**
		 * downward vertical direction of the scene / location of iActor
		 * @method
		 * @private
		 * @param   {STU.Actor3D}   iActor actor used to determine scene / location
		 * @param {STU.Referential} [iRef] The referential where the output coordinate will be expressed. If null, output coordinate are experessed in world context.
		 */
		RenderManager.prototype.getGravityVector = function (iActor, iRef) {

			if (iRef === null || iRef === undefined) {
				iRef = "World";
			}

			var Gravity_Ref = new DSMath.Vector3D(0.0, 0.0, -1.0);
			var SceneTransfo = iActor.getSceneTransform(iRef);
			Gravity_Ref.applyTransformation(SceneTransfo);
			Gravity_Ref.normalize();
			return Gravity_Ref;
		};

		/**
		 * Perform a picking action toward the ground from a specified origin through the current STU.Experience.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of these parameters :
		 * @param   {DSMath.Point} position : the origin of the raycast expressed in the specified reference (in world reference if there is no reference specified)
		 * @param {STU.Referential} reference The referential where the inputs and outputs are expressed. If null, output coordinate are experessed in world context.
		 * @param   {boolean} pickGeometry : if enabled, the picking will take in count the geometry of the actors present in the experience.
		 * @param   {boolean} pickTerrain : if enabled, the picking will take in count the mesh representing the terrain (Only in globe context)
		 * @param   {boolean} pickWater : if enabled, the picking will take in count the shader representing the water (Only in globe context)
		 
		 *
		 * DEFAULT VALUES :
		 * position : [no default value]
		 * reference : null
		 * pickGeometry : true
		 * pickTerrain : true
		 * pickWater : true
		 * 
		 * @return {STU.Intersection}
		 */
		RenderManager.prototype._pickGroundFromPosition = function (iParams) {

			if (iParams !== null && iParams !== undefined) {
				var pickGeo = (iParams.pickGeometry !== null && iParams.pickGeometry !== undefined) ? iParams.pickGeometry : true;
				var pickRayLength_mm = 1000000;     // millimeters

				if (iParams.reference === null || iParams.reference === undefined) {
					iParams.reference = "World";
				}

				var intersections = [];
				var env = this.getCurrentEnvironment();


				if (env !== null && env !== undefined) {
					//delegation of picking functions to environment
					if (env instanceof STU.Planets) {
						intersections = env._pickEnvironmentGroundFromPosition(iParams);
					}
					else {
						// wait for STU.Referential support in StuAmbience.js 
						if (!(iParams.reference instanceof STU.Actor3D)) {
							iParams.reference = null;
							intersections = env._pickEnvironmentGroundFromPosition(iParams);
						}
					}
				}
				else {
					// 1 : Express iParams.position from iParams.reference to World referential
					var ReferentialTransfo_World = STU.Experience.getCurrent().getReferentialTransform(iParams.reference, "World");

					// 2 : pick in world referential
					if (pickGeo) {
						var gravityVector_World = new DSMath.Vector3D(0, 0, -1);

						var pickOrigin_World = iParams.position.clone();
						pickOrigin_World.applyTransformation(ReferentialTransfo_World);

						var collisionRay = new STU.Ray();
						collisionRay.origin = pickOrigin_World;
						collisionRay.direction = gravityVector_World;
						collisionRay.setLength(pickRayLength_mm);

						var hit = this._pickFromRay(collisionRay, true, false);
						if (hit.length > 0) {
							intersections.push(hit[0]);
						}
						else {
							var intersect = new STU.Intersection();
							intersect.point = new DSMath.Point(iParams.position.x, iParams.position.y, 0);
							intersections.push(intersect);
						}
					}

					// 3 : Express the results in reference
					var invReferentialTransfo_World = ReferentialTransfo_World.getInverse();
					for (let i = 0; i < intersections.length; i++) {
						intersections[i].point = intersections[i].point.applyTransformation(invReferentialTransfo_World);
						if (intersections[i].normal !== null && intersections[i].normal !== undefined) {
							intersections[i].normal = intersections[i].normal.applyTransformation(invReferentialTransfo_World);
						}
					}
				}

				var nearestIntersection = null;
				var nearestDistance = -1;

				//console.log("intersections : " + JSON.stringify(intersections));

				if (intersections.length < 1) {
					//console.warn("[_pickGroundFromPosition (RenderManager)] No ground detected");
					return null;
				} else if (intersections.length === 1) {
					nearestIntersection = intersections[0];
					nearestDistance = intersections[0].point.squareDistanceTo(iParams.position);
				} else {
					nearestIntersection = intersections[0];
					nearestDistance = intersections[0].point.squareDistanceTo(iParams.position);
					for (let i = intersections.length - 1; i > 0; i--) {
						var distance = intersections[i].point.squareDistanceTo(iParams.position);
						if (distance < nearestDistance) {
							nearestIntersection = intersections[i];
							nearestDistance = distance;
						}
					}
				}
				return nearestIntersection;
			}
		};



		// IBS NEW DEBUG PRIMITIVES
		/**
		 * Create a box primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of these parameters :
		 * @param   {double} size : the length of the box edges (all edges of the same size or vector of independant x,y,z sizes) 
		 * @param   {DSMath.Vector3D} size 
		 * @param   {boolean} centered : position is at the center of the box (vs at corner)
		 * @param   {boolean} screenSize : size is defined in screen mm, it is zoom independant
		 * @param   {STU.Box} box : position from two opposite corners expressed in given referential
		 * @param   {double} lineWidth : width of drawn edges
		 * @param   {boolean} closed : draws box faces (vs edges)
		 * @param   {DSMath.Transformation} position : position of box in given referential
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.				
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 *
		 *
		 * these parameters do not affect position : [lineWidth], [closed], [color], [alpha], [lifetime]
		 * VALID SUBSET OF PARAMETERS FOR POSITION :
		 * size, [centered] : a box of which the center/corner is at the origin of the default referential
		 * size, position, [referential] : same as above but placed at position expressed in referential
		 * box : a box with two corners reaching box.low.x/y/z and box.high.x/y/z in the default referential
		 * box, referential : same as above but positions expressed in referential
		 * 
		 * DEFAULT VALUES :
		 * size : 1000
		 * centered : false
		 * screenSize : 0
		 * box : [no default value]
		 * lineWidth : 0.01*(SizeX * SizeY * SizeZ)^(1/3)
		 * closed : false
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */

		RenderManager.prototype._createBox = function (iParams) {

			var ReferentialTransfo_Visu = new DSMath.Transformation();

			if (iParams.referential === undefined || iParams.referential === null) {
				iParams.referential = "Location";
			}
			ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iParams.referential, "Visu");
			var obj = [];

			// mode box
			// on fait passer box par la transform iParams.referential
			if (iParams.box !== undefined && iParams.box !== null) {
				var MyLowPoint = new DSMath.Point(iParams.box.low.x, iParams.box.low.y, iParams.box.low.z);
				MyLowPoint.applyTransformation(ReferentialTransfo_Visu);

				var MyHighPoint = new DSMath.Point(iParams.box.high.x, iParams.box.high.y, iParams.box.high.z);
				MyHighPoint.applyTransformation(ReferentialTransfo_Visu);

				iParams.box.low.x = MyLowPoint.x; iParams.box.low.y = MyLowPoint.y; iParams.box.low.z = MyLowPoint.z;
				iParams.box.high.x = MyHighPoint.x; iParams.box.high.y = MyHighPoint.y; iParams.box.high.z = MyHighPoint.z;

				var id = this.StuGeomPrimitive_ISOManager.createBox(iParams); // jshint ignore:line
				obj = this._registerObject(id, iParams);
			}
			// mode size
			else {
				var id = this.StuGeomPrimitive_ISOManager.createBox(iParams); // jshint ignore:line
				obj = this._registerObject(id, iParams);

				if (iParams !== undefined && iParams !== null) {
					if (iParams.position !== undefined && iParams.position !== null) {
						if (iParams.referential !== undefined && iParams.referential !== null) {
							this.setObjectPosition(id, iParams.position, iParams.referential);
						}
						else {
							this.setObjectPosition(id, iParams.position);
						}
					}
					else {
						iParams.position = new DSMath.Transformation();
						if (iParams.referential !== undefined && iParams.referential !== null) {
							this.setObjectPosition(id, iParams.position, iParams.referential);
						}
						else {
							this.setObjectPosition(id, iParams.position);
						}
					}
				}
			}
			return obj;
		};

		/**
		 * Create a sphere primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of  these parameters :
		 * @param   {double} radius : the radius of the sphere
		 * @param   {boolean} screenSize : size is defined in screen mm, it is zoom independant
		 * @param   {DSMath.Transformation} position : position of sphere in world referential
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 *
		 * DEFAULT VALUES :
		 * radius : 1000.
		 * screenSize : 0
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */
		RenderManager.prototype._createSphere = function (iParams) {
			var id = this.StuGeomPrimitive_ISOManager.createSphere(iParams); // jshint ignore:line
			var obj = this._registerObject(id, iParams);

			if (iParams !== undefined && iParams !== null) {
				if (iParams.position !== undefined && iParams.position !== null) {
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
				else {
					iParams.position = new DSMath.Transformation();
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
			}
			return obj;
		};
		/**
		 * Create a point primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of  these parameters :
		 * @param   {double} size : the size of the point in screen-mm (zoom independant)
		 * @param   {DSMath.Transformation} position : position of point in world referential
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 * DEFAULT VALUES :
		 * size : 1. (screen size)
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */
		RenderManager.prototype._createPoint = function (iParams) {
			var id = this.StuGeomPrimitive_ISOManager.createPoint(iParams); // jshint ignore:line
			var obj = this._registerObject(id, iParams);

			if (iParams !== undefined && iParams !== null) {
				if (iParams.position !== undefined && iParams.position !== null) {
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
				else {
					iParams.position = new DSMath.Transformation();
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
			}
			return obj;
		};
		/**
		 * Create a vector primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of  these parameters :
		 * @param   {DSMath.Vector3D} startPoint : the not-pointy extremity of the vector
		 * @param   {DSMath.Vector3D} endPoint : the pointy extremity of the vector
		 * @param   {DSMath.Vector3D} direction : the direction of the vector
		 * @param   {double} length : length of the vector
		 * @param   {double} width : width of the vector shaft
		 * @param   {double} headLength : length of the pointy part of the vector
		 * @param   {double} headWidth : width of the pointy part of the vector
		 * @param   {boolean} screenSize : size is defined in screen mm, it is zoom independant
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 *
		 *
		 * these parameters do not affect position : [width], [headLength], [headWidth], [closed], [color], [alpha], [lifetime]
		 * VALID SUBSET OF PARAMETERS FOR POSITION :
		 * startPoint, endPoint : a vector going from startpoint to endpoint expressed in default referential
		 * startPoint, direction, length : a vector going from startpoint to startPoint + direction*length, expressed in default referential
		 * startPoint, endPoint, [referential] : a vector going from startpoint to endpoint expressed in referential
		 * startPoint, direction, length, [referential] : a vector going from startpoint to startPoint + direction*length, expressed in referential 
		 *
		 * DEFAULT VALUES :
		 * length : 1000.
		 * screenSize : 0
		 * startPoint : {x:0 , y:0 , z:0}
		 * endPoint : {x:0 , y:0 , z:1000}
		 * direction : {x:0 , y:0 , z:1}     
		 * width : length/100
		 * headLength : length/10
		 * headWidth : length/50
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */
		RenderManager.prototype._createVector = function (iParams) {

			// on fait passer startpoint, endpoint, direction, length, width, headLength, headWidth par la transform iParams.referential
			var ReferentialTransfo_Visu = new DSMath.Transformation();

			if (iParams.referential === undefined || iParams.referential === null) {
				iParams.referential = "Location";
			}
			ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iParams.referential, "Visu");

			if (iParams.startPoint !== undefined && iParams.startPoint !== null) {
				var MyStartPoint = new DSMath.Point(iParams.startPoint.x, iParams.startPoint.y, iParams.startPoint.z);
				MyStartPoint.applyTransformation(ReferentialTransfo_Visu);
				iParams.startPoint.x = MyStartPoint.x;
				iParams.startPoint.y = MyStartPoint.y;
				iParams.startPoint.z = MyStartPoint.z;
			}

			if (iParams.endPoint !== undefined && iParams.endPoint !== null) {
				var MyEndPoint = new DSMath.Point(iParams.endPoint.x, iParams.endPoint.y, iParams.endPoint.z);
				MyEndPoint.applyTransformation(ReferentialTransfo_Visu);
				iParams.endPoint.x = MyEndPoint.x;
				iParams.endPoint.y = MyEndPoint.y;
				iParams.endPoint.z = MyEndPoint.z;
			}
			if (iParams.direction !== undefined && iParams.direction !== null) {
				var MyDirection = new DSMath.Vector3D(iParams.direction.x, iParams.direction.y, iParams.direction.z);
				MyDirection.applyTransformation(ReferentialTransfo_Visu);
				iParams.direction.x = MyDirection.x;
				iParams.direction.y = MyDirection.y;
				iParams.direction.z = MyDirection.z;
			}
			if (iParams.length !== undefined && iParams.length !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.length = iParams.length * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}
			if (iParams.width !== undefined && iParams.width !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.width = iParams.width * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}
			if (iParams.headLength !== undefined && iParams.headLength !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.headLength = iParams.headLength * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}
			if (iParams.headWidth !== undefined && iParams.headWidth !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.headWidth = iParams.headWidth * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}

			var id = this.StuGeomPrimitive_ISOManager.createVector(iParams); // jshint ignore:line
			var obj = this._registerObject(id, iParams);
			return obj;
		};
		/**
		 * Create a line primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of  these parameters :
		 * @param   {DSMath.Vector3D} startPoint : the not-pointy extremity of the line
		 * @param   {DSMath.Vector3D} endPoint : the pointy extremity of the line
		 * @param   {DSMath.Vector3D} direction : the direction of the line
		 * @param   {double} length : length of the line
		 * @param   {double} width : width of the line
		 * @param   {boolean} screenSize : size is defined in screen mm, it is zoom independant
		 * @param   {DSMath.Transformation} position : position of box in world referential
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 *
		 * these parameters do not affect position : [width], [closed], [color], [alpha], [lifetime]
		 * VALID SUBSET OF PARAMETERS FOR POSITION :
		 * startPoint, endPoint : a vector going from startpoint to endpoint expressed in default referential
		 * startPoint, direction, length : a vector going from startpoint to startPoint + direction*length, expressed in default referential
		 * startPoint, endPoint, [referential] : a vector going from startpoint to endpoint expressed in referential
		 * startPoint, direction, length, [referential] : a vector going from startpoint to startPoint + direction*length, expressed in referential 
		 *
		 * DEFAULT VALUES :
		 * length : 1000.
		 * screenSize : 0
		 * startPoint : {x:0 , y:0 , z:0}
		 * endPoint : {x:0 , y:0 , z:1000}
		 * direction : {x:0 , y:0 , z:1}     
		 * width : length/100
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */
		RenderManager.prototype._createLine = function (iParams) {

			// on fait passer startpoint, endpoint, direction, length, width, headLength, headWidth par la transform iParams.referential
			var ReferentialTransfo_Visu = new DSMath.Transformation();

			if (iParams.referential === undefined || iParams.referential === null) {
				iParams.referential = "Location";
			}
			ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iParams.referential, "Visu");

			if (iParams.startPoint !== undefined && iParams.startPoint !== null) {
				var MyStartPoint = new DSMath.Point(iParams.startPoint.x, iParams.startPoint.y, iParams.startPoint.z);
				MyStartPoint.applyTransformation(ReferentialTransfo_Visu);
				iParams.startPoint.x = MyStartPoint.x;
				iParams.startPoint.y = MyStartPoint.y;
				iParams.startPoint.z = MyStartPoint.z;
			}

			if (iParams.endPoint !== undefined && iParams.endPoint !== null) {
				var MyendPoint = new DSMath.Point(iParams.endPoint.x, iParams.endPoint.y, iParams.endPoint.z);
				MyendPoint.applyTransformation(ReferentialTransfo_Visu);
				iParams.endPoint.x = MyendPoint.x;
				iParams.endPoint.y = MyendPoint.y;
				iParams.endPoint.z = MyendPoint.z;
			}
			if (iParams.direction !== undefined && iParams.direction !== null) {
				var MyDirection = new DSMath.Vector3D(iParams.direction.x, iParams.direction.y, iParams.direction.z);
				MyDirection.applyTransformation(ReferentialTransfo_Visu);
				iParams.direction.x = MyDirection.x;
				iParams.direction.y = MyDirection.y;
				iParams.direction.z = MyDirection.z;
			}
			if (iParams.length !== undefined && iParams.length !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.length = iParams.length * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}
			if (iParams.width !== undefined && iParams.width !== null) {
				if (iParams.screenSize !== undefined && iParams.screenSize !== null && iParams.screenSize === 1) { }
				else {
					iParams.width = iParams.width * Math.cbrt(ReferentialTransfo_Visu.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
				}
			}

			var id = this.StuGeomPrimitive_ISOManager.createLine(iParams); // jshint ignore:line
			var obj = this._registerObject(id, iParams);
			return obj;
		};
		/**
		 * Create an axis primitive.
		 *
		 * @method
		 * @private
		 * @param   {iParams}	an object which can contain a subset of  these parameters :
		 * @param   {double} size : length of the axis vectors
		 * @param   {boolean} screenSize : size is defined in screen mm, it is zoom independant
		 * @param   {DSMath.Transformation} position : position of axis in referential
		 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		 * @param   {STU.Color}	color RGBA color of the primitive
		 * @param   {double}	alpha transparency of the primitive (0: fully transparent, 1: opaque)
		 * @param   {double}	lifetime lifetime of the primitive in ms
		 *							if -1 the primitive will be visible till destroyed
		 *							if 0 the primitive is visible only 1 frame
		 *							if >0 the primitive will disappear progressively
		 * DEFAULT VALUES :
		 * size : 10. (screen size)
		 * screenSize : 1
		 * position : ID
		 * referential : World / Current location
		 * color : {r:255 , g:50 , b:50 , a:255}
		 * alpha : 255
		 */
		RenderManager.prototype._createAxis = function (iParams) {
			var id = this.StuGeomPrimitive_ISOManager.createAxis(iParams); // jshint ignore:line
			var obj = this._registerObject(id, iParams);

			if (iParams !== undefined && iParams !== null) {
				if (iParams.position !== undefined && iParams.position !== null) {
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
				else {
					iParams.position = new DSMath.Transformation();
					if (iParams.referential !== undefined && iParams.referential !== null) {
						this.setObjectPosition(id, iParams.position, iParams.referential);
					}
					else {
						this.setObjectPosition(id, iParams.position);
					}
				}
			}
			return obj;
		};









		/**
		 * Create a primitive object.
		 * For internal purpose only
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype._registerObject = function (iId, iParams) {

			var position;
			if (iParams.position === undefined || iParams.position === null) {
				position = new DSMath.Transformation();
			}
			else {
				position = iParams.position;
			}

			var color;
			var alpha;
			if (iParams.color === undefined || iParams.color === null) {
				color = new STU.Color(255, 0, 0);
			}
			else {
				color = iParams.color;
			}
			if (color.a === undefined || color.a === null) {
				alpha = 255;
			}
			else {
				alpha = color.a;
			}

			if (iParams.alpha === undefined || iParams.alpha === null) {
				//alpha = 255;
			}
			else {
				alpha = iParams.alpha;
			}

			var lifetime;
			if (iParams.lifetime === undefined || iParams.lifetime === null) {
				lifetime = -1;
			}
			else {
				lifetime = iParams.lifetime;
			}

			var obj = new VisuPrimitive();
			obj.id = iId;
			obj.color = color;
			obj.alpha = alpha;
			obj.transfo = position;
			obj.life = lifetime;
			obj.age = 0;

			this.map[iId] = obj;
			return obj;
		};

		/**
		* Move a primitive object.
		* For internal purpose only
		*
		* @method
			 * @param   {STU.Referential} referential The referential where the inputs are expressed. default is Scene referential.
		* @private
		*/
		RenderManager.prototype.setObjectPosition = function (iId, iPos, iRef) {
			var ID = -1;
			if (iId.id !== undefined) {
				ID = iId.id;
			}
			else {
				ID = iId;
			}
			if (this.map.hasOwnProperty(ID)) {
				var obj = this.map[ID];


				var ReferentialTransfo_Visu = new DSMath.Transformation();

				if (iRef === undefined || iRef === null) {
					iRef = "Location";
				}
				ReferentialTransfo_Visu = STU.Experience.getCurrent().getReferentialTransform(iRef, "Visu");
				var TotalTransform_Visu = DSMath.Transformation.multiply(ReferentialTransfo_Visu, iPos);

				obj.transfo = TotalTransform_Visu;

				var array = TotalTransform_Visu.getArray();
				var m = 0;
				for (m = 0; m < 12; m++) {
					this.SharedTransfo[m] = array[m];
				}

				this.StuGeomPrimitive_ISOManager.SetPosFromSharedTransfo(ID);
			}
		};
		/**
		* Change a primitive object's color.
		* For internal purpose only
		*
		* @method
		* @private
		*/
		RenderManager.prototype.setObjectColor = function (iId, iCol, iAlpha) {
			var ID = -1;
			if (iId.id !== undefined) {
				ID = iId.id;
			}
			else {
				ID = iId;
			}

			var alpha = 255;
			if (iCol.a === undefined || iCol.a === null) {
				if (iAlpha === undefined || iAlpha === null) {
					alpha = 255;
				}
				else {
					alpha = iAlpha;
				}
			}
			else {
				alpha = iCol.a;
			}

			if (this.map.hasOwnProperty(ID)) {
				var obj = this.map[ID];

				if (iCol !== undefined) {
					if (iCol.hasOwnProperty("r")) {
						obj.color.r = iCol.r;
					}
					if (iCol.hasOwnProperty("g")) {
						obj.color.g = iCol.g;
					}
					if (iCol.hasOwnProperty("b")) {
						obj.color.b = iCol.b;
					}
					if (iCol.hasOwnProperty("a")) {
						obj.color.a = iCol.a;
					}
				}
				obj.alpha = alpha;
				this.StuGeomPrimitive_ISOManager.setColor(ID, obj.color.r, obj.color.g, obj.color.b, alpha);
			}
		};

		/**
		* Delete a primitive object.
		* For internal purpose only
		*
		* @method
		* @private
		*/
		RenderManager.prototype.deleteObject = function (iId) {
			if (this.map[iId] !== undefined) {
				this.StuGeomPrimitive_ISOManager.delete(Number(iId));
				delete this.map[iId];
			}
		};

		/**
		 * Create a transformation given a position and a direction.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.createTransfoFromPosAndDir = function (iPos, iDir) {
			var transform = new DSMath.Transformation();
			var matrix = new DSMath.Matrix3x3();

			var dir = iDir.clone();
			dir.normalize();


			if (this.approxEqual(dir.x, 0, 0.01) && this.approxEqual(dir.y, 0, 0.01) && (this.approxEqual(dir.z, 1, 0.01) || this.approxEqual(dir.z, -1, 0.01))) {

				matrix.setFromArray([dir.z, 0, 0,
					0, dir.z, 0,
					0, 0, dir.z
				]);
			} else {
				var Z = new DSMath.Vector3D();
				Z.z = 1;

				// projecting the new sight direction on the ground to get a right direction parallel to the ground
				var right = DSMath.Vector3D.cross(dir, DSMath.Vector3D.cross(dir, Z));
				right.normalize();

				// computing the up direction as usual
				var up = DSMath.Vector3D.cross(dir, right);
				up.normalize();


				matrix.setFromArray([right.x, up.x, dir.x,
				right.y, up.y, dir.y,
				right.z, up.z, dir.z
				]);
			}

			transform.matrix = matrix;
			transform.vector = iPos.clone();

			return transform;
		};

		RenderManager.prototype.approxEqual = function (iV1, iV2, iEpsilon) {
			if (iEpsilon === null) {
				iEpsilon = 0.001;
			}
			return Math.abs(iV1 - iV2) < iEpsilon;
		};

		/**
		 * Process to execute when this STU.RenderManager is starting.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onStart = function () {
			// Applies the camera parameters to the main viewpoint
			// Useful for the Raytrace behavior when a capture occurs during the first execute tick 
			this.onPostExecute();
		};

		/**
		 * Process to execute when this STU.RenderManager is resuming.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onResume = function () {
			/* jshint camelcase : false */
			var cam = this.getCurrentCamera();
			if (cam !== undefined && cam !== null && this.main3DViewpoint.__stu__IsLocked() === 0) {
				this.main3DViewer.DeactivateDefaultNavigation();
			}
		};

		/**
		 * Process to execute when this STU.RenderManager is pausing.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onPause = function () {
			this.main3DViewer.ActivateDefaultNavigation();
		};

		/**
		 * Process to execute when this STU.RenderManager is stopping.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onStop = function () {
			this.main3DViewer.ActivateDefaultNavigation();

			this.StuGeomPrimitive_ISOManager.deleteAll(); // jshint ignore:line
			this.setCurrentEnvironment(this.authoringEnvironment);

			this._currentEnvironmentCache = undefined;
			this._currentCameraCache = undefined; // clean cache for web experience
		};

		/**
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.onPostExecute = function () {
		};

		/**
		 * Update debug primitives.
		 * Change the alpha of debug primitives that have a limited
		 * lifetime, and destroy them when their lifetime is reached.
		 *
		 * @method
		 * @private
		 */
		RenderManager.prototype.updateDebugPrimitives = function (iContext) {
			/* jshint camelcase : false */
			/* jshint -W089 */
			// updating debug primitives
			for (var p in this.map) {
				var obj = this.map[p];
				if (obj.life >= 0.0) {
					obj.age += iContext.deltaTime;
					if (obj.age > obj.life) {
						this.StuGeomPrimitive_ISOManager.delete(Number(p));
						delete this.map[p];
					} else {
						var t = obj.age / obj.life;
						var _alpha = (1 - t) * obj.alpha;

						// NO
						//this.setObjectColor(obj.id, obj.color, _alpha);
						this.StuGeomPrimitive_ISOManager.setColor(obj.id, obj.color.r, obj.color.g, obj.color.b, _alpha);
					}
				}
			}
		};

		RenderManager.prototype.getExperienceScaleFactor = function () {
			return this.experienceScaleFactor;
		};
		RenderManager.prototype.setExperienceScaleFactor = function (iFactor) {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log("setExperienceScaleFactor");
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			this.experienceScaleFactor = iFactor;
		};

		/**
		* @method
		* @private
		*/
		RenderManager.prototype.getEnvsManager = function () {
			return this.environmentsServices;
		};

		/**
		* Get the active environment's name
		* @deprecated R2018x - see STU.Environment.isCurrent
		* @method
		* @private
		* @return {string} environment name, empty string if no active environment is found
		*/
		RenderManager.prototype.getActiveEnvironmentName = function () {
			var name = "";

			var env = this.getCurrentEnvironment();
			if (env != undefined && env != null) {
				name = env.name;
			}

			return name;
		};

		/**
		* get the active environment
		*  
		* @deprecated R2018x - see STU.Environment.isCurrent
		* @method
		* @private
		* @return {STU.Environment} current environment, null if no active environment is found
		*/
		RenderManager.prototype.getActiveEnvironment = function () {
			return this.getCurrentEnvironment();
		};


		/**
		* Set the active environment of the current experience or scene
		*  
		* @method
		* @public		
		* @param {STU.Environment} iEnvironment environment to set as current, <b>null</b> to set default one.
		*/
		RenderManager.prototype.setCurrentEnvironment = function (iEnvironment) {
			var experience = STU.Experience.getCurrent();
			if (experience != undefined && experience != null) {
				experience.currentEnvironment = iEnvironment;
			}

			// updating the cache (cf getCurrentEnvironment() below)
			this._currentEnvironmentCache = iEnvironment;
		};

		/**
		* Get the active environment of the current experience or scene.
		*  
		* @method
		* @public
		* @return {STU.Environment} current active environment, </b>null</b> if there is no active environment.
		*/
		RenderManager.prototype.getCurrentEnvironment = function () {

			// this method can be called many times per frame
			// and uses a binding to access the data (experience.currentEnvironment)
			// so we use a cache to prevent multiple binding calls per frame
			// this cache is cleaned on each frame to make sure we get the right info
			// if updated in the C++ world		

			if (this._currentEnvironmentCache == undefined) {
				var experience = STU.Experience.getCurrent();
				if (experience != undefined && experience != null) {
					this._currentEnvironmentCache = experience.currentEnvironment;
				}
				else {
					this._currentEnvironmentCache = null;
				}
			}

			return this._currentEnvironmentCache;
		};

		/**
		* get all environments
		*  
		* @deprecated R2018x - see STU.Experience.getEnvironments
		* @method
		* @private
		* @return {Array.<STU.Environment>} environments
		*/
		RenderManager.prototype.getEnvironments = function () {
			var CurrentExperience = STU.Experience.getCurrent();
			var ExpEnvs = CurrentExperience.environments;
			return ExpEnvs;
		};

		/**
		* get an environment identified by its name
		*  
		* @deprecated R2018x - see STU.Experience.getEnvironmentByName
		* @method
		* @private
		* @param {string} the name of the environment from the current experience to find
		* @return {STU.Environment} environment, null if no environment is found with given name
		*/
		RenderManager.prototype.getEnvironmentByName = function (iName) {
			var CurrentExperience = STU.Experience.getCurrent();
			var ExpEnvs = CurrentExperience.environments;
			if (ExpEnvs !== undefined && ExpEnvs !== null && ExpEnvs.length > 0) {
				var NbEnvs = ExpEnvs.length;

				for (var i = 0; i < NbEnvs; i++) {
					var Env = ExpEnvs[i];
					if (Env._varName === iName) {
						return Env;
					}
				}
			}
			return null;
		};

		/**
		* deactivate the current active environment
		*  
		* @deprecated R2018x - see STU.Environment.setAsCurrent
		* @method
		* @private
		*/
		RenderManager.prototype.deActivateEnvironment = function () {
			this.setCurrentEnvironment(null);
		};

		/**
		* Activates an environment, identified by its name, to the experience
		*
		* @deprecated R2018x - see STU.Environment.setAsCurrent
		* @method
		* @private
		* @param {string} iName the name of the environment from the current experience to activate
		*/
		RenderManager.prototype.setActiveEnvironmentByName = function (iName) {
			this.environmentsServices.setActiveEnvironmentByName(iName);
		};

		/**
		* set the active environment
		*  
		* @deprecated R2018x - see STU.Environment.setAsCurrent
		* @method
		* @private
		* @param {STU.Environment} iNewActiveEnv the environment from the current experience to activate
		*/
		RenderManager.prototype.setActiveEnvironment = function (iNewActiveEnv) {
			this.setCurrentEnvironment(iNewActiveEnv);
		};

		STU.registerManager(RenderManager);

		// Expose in STU namespace.
		STU.RenderManager = RenderManager;

		return RenderManager;
	});

define('StuRenderEngine/StuRenderManager', ['DS/StuRenderEngine/StuRenderManager'], function (RenderManager) {
	'use strict';

	return RenderManager;
});
