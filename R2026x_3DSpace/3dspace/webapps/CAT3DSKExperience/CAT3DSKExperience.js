/* eslint-disable no-irregular-whitespace */
/*
*/

define('DS/CAT3DSKExperience/CAT3DSketchExperience',
[
  'DS/3DPlayModelViewer/3DPlayModelViewer'
  , 'DS/Visualization/ModelLoader'
  , 'DS/Visualization/ThreeJS_DS'
  , 'DS/CoreEvents/Events'
  , 'DS/CAT3DWInfra/CAT3DWUrlServices'
  , 'DS/CAT3DWInfra/CAT3DWPreferenceManager'
],
function (
  Exp
  , ModelLoader
  , THREE
  , WUXEvents
  , CAT3DWUrlServices
  , CAT3DWPreferenceManager
) {

  'use strict';
  return Exp.extend({
    init: function (iParam) {
      this._requestsOptions = iParam.options.requestsOptions;
      if (iParam.options.enopad){
        iParam.options.enopad.windowOptions =  {viewerOptions: { useQualityManager: false}};
      } else {
        iParam.options.enopad = { windowOptions: {viewerOptions: { useQualityManager: false}}};
      }
      this._parent(iParam);
    },

    dispose: function (options) {
      WUXEvents.publish({
        event: 'CAT3DSKExperienceExit',
        data: {}
      });
      this._viewer = null;
      this._viewpoint = null;

      this._parent(options);
    },

    isMobile: function () {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
      ];
      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    },

    clearView: function () {
      if (this._viewer){
        var rootNode = this._viewer.getRootNode();
        if (rootNode && rootNode.children && rootNode.children.length > 0) {
          rootNode.removeChildren();
        }
        this._parent();
      }
      this._viewer = null;
      this._viewpoint = null;
    },

    onLoadedAsset: function (fileExtension) {

      this.isR2V = CAT3DWPreferenceManager.getPreferenceValue('isR2V');

      if (fileExtension === '3dwb') {


        this._viewpoint.setProjectionType(1);
        this._viewer.currentViewpoint.control.setTouchRotationActive(false);
        this._viewer.currentViewpoint.getControl().setRotationActive(false);

        var normal = new THREE.Vector3(0, 0, -1);
        var up = new THREE.Vector3(-1, 0, 0);
        this._viewpoint.moveTo({ sightDirection: normal, upDirection: up });
      }

      WUXEvents.publish({
        event: 'CAT3DSKExperienceStart',
        data: {}
      });

      // IR-849846: XE6: changing backgroundcolor to white in 3DPlay
      this._viewer.setBackgroundColor('#FFFFFF');
      document.querySelector('.wux-afr-framewindow').style.background = 'none'; // to remove blue gradient default background

      // if file is R2V lock camera position to perspective view
      if (this.isR2V) {

        /*var divs = document.getElementsByClassName('AfrActionBar');
        if (divs.length) {
          divs[0].style.display = 'none';
        }*/

        var camPosR2V =  CAT3DWPreferenceManager.getPreferenceValue('camPosR2V');
        var quatR2V = CAT3DWPreferenceManager.getPreferenceValue('quatR2V');
        this.fovR2V = CAT3DWPreferenceManager.getPreferenceValue('fovR2V');
        this.focalR2V = CAT3DWPreferenceManager.getPreferenceValue('focalR2V');
        this.imWidthR2V = CAT3DWPreferenceManager.getPreferenceValue('imWidthR2V');
        this.imHeightR2V = CAT3DWPreferenceManager.getPreferenceValue('imHeightR2V');

        //this._viewer.currentViewpoint.setProjectionType(0);
        this._viewer.currentViewpoint.moveTo({ eyePosition: camPosR2V, orientation: quatR2V, duration: 10 });

        this._viewer.currentViewpoint.setAngle(this.fovR2V);

        this._viewer.currentViewpoint.control.setRotationActive(false);
        this._viewer.currentViewpoint.control.setTouchRotationActive(false);
        this._viewer.currentViewpoint.control.setZoomActive(false);
        this._viewer.currentViewpoint.control.setPanActive(false);
        var camObj = { viewpoint: false, picking: false };
        this._viewer.currentViewpoint.control.setActive(camObj);

        this._zoom = 1.0;

        this._panCenter = new THREE.Vector2();

        this._panCenter.x = this._viewer.div.clientWidth / 2;
        this._panCenter.y = this._viewer.div.clientHeight / 2;

        if (this.imHeightR2V && this.imHeightR2V !== 0 && this._viewer.div.clientWidth !== 0) {
          if (this.focalR2V) {
            this._applyNewFocal(this.focalR2V);
          }

          if (this._panCenter) {
            //IR-503696-3DEXPERIENCER2018x
            // Camera is asymetrical and needs to be handle by hand
            let viewpoint = this._viewer.currentViewpoint;
            this._applyViewOffset(viewpoint);
          }

          this._viewer.render();
        }

        this.onresizeToken = this._viewer.onViewerResize(function () {
          if (this.imHeightR2V && this.imHeightR2V !== 0 && this._viewer.div.clientWidth !== 0) {
            if (this.focalR2V) {
              this._applyNewFocal(this.focalR2V);
            }

            if (this._panCenter) {
              //IR-503696-3DEXPERIENCER2018x
              // Camera is asymetrical and needs to be handle by hand
              let viewpoint = this._viewer.currentViewpoint;
              this._applyViewOffset(viewpoint);
            }

            this._viewer.render();
          }

          setTimeout(function () {
            const actionBar = this.frmWindow.getActionBar();
            actionBar.hide();
            actionBar.elements.container.classList.add('hide');
            if (actionBar._tabBar) actionBar._tabBar.hide();
            if (actionBar.MAB) actionBar.MAB.hide();
          }.bind(this), 500);


          this._viewer.render();
        }.bind(this));

        this._viewer.render();

        const actionBar = this.frmWindow.getActionBar();
        actionBar.hide();
        actionBar.elements.container.classList.add('hide');
        if (actionBar._tabBar) actionBar._tabBar.hide();
        if (actionBar.MAB) actionBar.MAB.hide();

      }
      else {
        // Reframe
        //this._viewpoint.reframe(null, 0); // 0 -> animation time
      }

      if (this.isMobile()) {
        // Graphic optimisations for mobile devices
        // this._viewer.setSSAO(false);
        this._viewer.setAntiAliasing('NoAA');
        // Set Magnifier
        this._viewer.setMagnifier({ activated: true, dim: 83, shiftVector: { x: -50, y: 120 } });
      }
      else {
        // this._viewer.setSSAO(true);
        this._viewer.setAntiAliasing('SMAA');
      }

      this._viewer.setPixelCulling(0);
      this._viewer.setMaterialMode(true);
      this._viewer.render({ updateInfinitePlane: true });
      this._viewer.setMaterialMode(true);

      // Trackpad mod support
      // Update mouse trackpad setting drop button
      // Track pad gesture management:
      let gestureMode =  window.localStorage.getItem('3DSketch.gestureMode');
      if (!gestureMode)
        gestureMode = 'mouse';

      let gestureModeVisu;
      // Get correct menu to activate:
      switch (gestureMode) {
      case 'mouse':
        gestureModeVisu = 'no';
        break;
      case 'trackpad':
        gestureModeVisu = 'yes';
        break;
      case 'automatic':
        gestureModeVisu = 'auto';
        break;
      }
      let viewpoint = this._viewer.currentViewpoint;
      if ((viewpoint) && (viewpoint.control) && (viewpoint.control.setTrackPadSupport)) {
        viewpoint.control.setTrackPadSupport(gestureModeVisu, -1);
      }

      // Hide axis
      this._viewer.setReferenceAxisSystem(false);


      this.autoReframe = false;

      this.stopLoadingPreview();
      // Adding the asset in MRU
      let time = 0;
      this.publish('ASSET/LOADINGFINISHED', {
        time: time,
        ctx: this.args.ctx,
        loadAssetInfo: this.loadAssetInfo || {}
      });

    },

    _applyNewFocal: function (iFocal) {
      var hRatio = this._viewer.div.clientWidth / this.imWidthR2V;
      var vRatio = this._viewer.div.clientHeight / this.imHeightR2V;

      var imageHeight = this.imHeightR2V;
      if (hRatio > vRatio) {
        // bandes verticales
        imageHeight = this.imHeightR2V;
      } else {
        // bandes horizontales
        imageHeight = this._viewer.div.clientHeight / hRatio;
      }


      var radianToDegree = 180 / Math.PI;
      var newFov = 2.0 * Math.atan(imageHeight / (2.0 * iFocal)) * radianToDegree;

      console.log('--- focal --- newLength: ' + iFocal + '  newAngle: ' + newFov + '   oldAngle: ' + this._viewer.currentViewpoint.getAngle());
      this._viewer.currentViewpoint.setAngle(newFov);
    },

    _applyViewOffset: function (viewpoint) {
      var newWidth = this._viewer.div.clientWidth * this._zoom;
      var newHeight = this._viewer.div.clientHeight * this._zoom;

      if (newWidth <= 1 || newHeight <= 1) {
        // do nothing
      } else {
        if (this._panCenter.x + (newWidth / 2) > this._viewer.div.clientWidth) {
          this._panCenter.x = this._viewer.div.clientWidth - (newWidth / 2);
        }
        if (this._panCenter.x - (newWidth / 2) < 0) {
          this._panCenter.x = (newWidth / 2);
        }
        if (this._panCenter.y + (newHeight / 2) > this._viewer.div.clientHeight) {
          this._panCenter.y = this._viewer.div.clientHeight - (newHeight / 2);
        }
        if (this._panCenter.y - (newHeight / 2) < 0) {
          this._panCenter.y = (newHeight / 2);
        }

        this._xOffset = this._panCenter.x - (newWidth / 2);
        this._yOffset = this._panCenter.y - (newHeight / 2);

        viewpoint.setViewOffset({
          fullWidth: this._viewer.div.clientWidth,
          fullHeight: this._viewer.div.clientHeight,
          x: this._xOffset,
          y: this._yOffset,
          width: newWidth,
          height: newHeight
        });
        this._viewer.render();

      }
    },

    isAndroid: function () {
      var string = navigator.userAgent.toLowerCase();
      var regex = new RegExp('android');
      if (regex.test(string)) {
        return true;
      }
      return false;

    },

    loadAsset: function (input/*, iOptions, idisplayprogress, profiler*/) {
      this.startLoadingPreview(this.getInformationsOnAsset(this.args.input.asset));
      this._viewer = this.frmWindow.getViewer();
      this._viewpoint = this.frmWindow.getViewpoint();
      var modelName = null;
      var fileExtension = input.asset.format;
      if (this.isAndroid()) {
        modelName = input.asset.filename;
      } else {
        modelName = decodeURIComponent(input.asset.filename);
      }

      if (this.isR2V) {
        const actionBar = this.frmWindow.getActionBar();
        actionBar.options.enableShowHide = false;
        if (actionBar.MAB) {
          actionBar.MAB.state.alwaysOn = false;
          actionBar.MAB.hide();
        }
        actionBar.hide();
        actionBar.elements.container.classList.add('hide');
        if (actionBar._tabBar) actionBar._tabBar.hide();
      }

      //set the shading to default...copied from PlayExperience3D
      this.dontrecordVisuChange = true;
      this._viewer.setVisuShadingMode('Shading');
      this._viewer.setVisuShadingEdgeMode('NoEdges');
      this._viewer.setMaterialMode(true);
      this.dontrecordVisuChange = false;

      if (fileExtension === '3dwb' || fileExtension === '3dskt') {
        // ByPass cors issue with parameter
        var urlService = new CAT3DWUrlServices();
        modelName = urlService.generateUrlWithSuffix(modelName);

        this.modelLoader = new ModelLoader();
        this.modelLoader.setOnLoadedCallback(this.onLoadedAsset.bind(this, fileExtension));

        this.modelLoader.loadModel({
          filename: modelName,
          format: fileExtension,
          proxyurl: 'none',
          withCredentials: true,
          viewer: this._viewer,
          requestsOptions: this._requestsOptions
        }, this._viewer.getRootNode());
      }
    }
  });
});

/*
* @fullreview  ARR3   19:07:23 Created from 3DPlayAnnotation3D
*/

define('DS/CAT3DSKExperience/CAT3DSKAnnotationAbbreviationsExperience',
[
  'UWA/Class'
  , 'DS/Visualization/ThreeJS_DS'
],
function (
  Class
  , THREE
) {
  'use strict';
  var abbreviation = {
    'a': 'arrow',
    'ach': 'actionsHistory',
    'ah': 'arrowhead',
    'an': 'angle',
    'annot': 'annotList',
    'apn': 'annotPlaneNormal',
    'asp': 'annotStartPoint',
    'at': 'type',
    'c': 'circle',
    'ca': 'curvedArrow',
    'cda': 'curvedDoubleHeadedArrow',
    'ce': 'curveEnd',
    'cen': 'center',
    'co': 'color',
    'cp': 'curvePoints',
    'cs': 'curveStart',
    'd': 'diamond',
    'da': 'data',
    'dha': 'doubleHeadedArrow',
    'e': 'ellipse',
    'en': 'end',
    'ep': 'eyePosition',
    'es': 'explodeStates',
    'fs': 'fontSize',
    'fw': 'fontWeight',
    'g': 'geometry',
    'gh': 'groupHistory',
    'gp': 'graphicalProp',
    'h': 'height',
    'hi': 'history',
    'ht': 'hash_tag',
    'iv': 'isVisible',
    'l': 'line',
    'lh': 'lockHistory',
    'lch': 'lifecycleHistory',
    'le': 'lineEnd',
    'len': 'length',
    'lg': 'login',
    'li': 'linkID',
    'ls': 'lineStart',
    'm': 'matrix',
    'maa': 'majorAxis',
    'mia': 'minorAxis',
    'oh': 'offsetHeight',
    'om': 'onModel',
    'op': 'opacity',
    'p': 'point',
    'pa': 'path',
    'pc': 'pointsCount',
    'ph': 'propertiesHistory',
    'ps': 'points',
    'r': 'rectangle',
    'ra': 'radius',
    's': 'square',
    'sc': 'scale',
    'sd': 'sightDirection',
    'sg': 'selectionGroupID',
    'si': 'singleIntersection',
    'st': 'start',
    'sui': 'selectionUserInfo',
    't': 'triangle',
    'td': 'targetDistance',
    'tfh': 'transformationHistory',
    'th': 'thickness',
    'ts': 'timestamp',
    'tt': 'text',
    'uc': 'unknownClosed',
    'ud': 'upDirection',
    'uo': 'unknownOpen',
    'v': 'vertices',
    'ver': 'version',
    'vp': 'viewpointInfo',
    'vs': 'viewpoints',
    'w': 'width'
  };

  var swapAbbreviation = {};
  var keys = Object.keys(abbreviation);
  keys.forEach(function (key) {
    var val = abbreviation[key];
    swapAbbreviation[val] = key;
  });
  var AnnotationAbbreviation = Class.extend({
    init: function (options) {
      this._parent(options);
    },

    processJSON: function (json, mode) {
      const jsonToProcess = {};
      const jsonKeys = Object.keys(json);
      let i = 0;

      // Filtering the json entries to process
      for (i = 0; i < jsonKeys.length;) {
        if (jsonKeys[i] === 'es' || jsonKeys[i] === 'explodeStates'
          || jsonKeys[i] === 'ver' || jsonKeys[i] === 'version') {
          jsonToProcess[jsonKeys[i]] = json[jsonKeys[i]];
          jsonKeys.splice(i, 1);
        } else {
          i++;
        }
      }
      const jsonToReturn = this._processJSON(jsonToProcess, mode);

      // Adding the remaing entries
      for (i = 0; i < jsonKeys.length; i++) {
        jsonToReturn[jsonKeys[i]] = json[jsonKeys[i]];
      }

      return jsonToReturn;
    },

    _processJSON: function (json, mode) {
      var lookUpJSON;
      if (mode === 'expand') {
        lookUpJSON = abbreviation;
      } else if (mode === 'minify') {
        lookUpJSON = swapAbbreviation;
      }
      var newObj = {};
      var jsonKeys = Object.keys(json);
      var key, value, type;
      var i, j;
      for (i = 0; i < jsonKeys.length; i++) {
        key = jsonKeys[i];
        value = json[key];
        if (Array.isArray(value)) {
          if (key === 'm') {
            value = new THREE.Matrix4().setFromArray(value);
          } else {
            let newArray = [];
            for (j = 0; j < value.length; j++) {
              type = typeof value[j];
              if (type === 'string' || type === 'number' || type === 'boolean') {
                newArray.push(value[j]);
              }
              else {
                newArray.push(this._processJSON(value[j], mode));
              }
            }
            value = newArray;
          }
        } else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
          if (key === 'matrix' && value instanceof THREE.Matrix4) {
            let newArray = [];
            value = value.flattenToArray(newArray);
          } else {
            value = this._processJSON(value, mode);
          }
        } else if (typeof value === 'string') {
          if (lookUpJSON[value]) {
            value = lookUpJSON[value];
          }
        }
        let newKeyName = lookUpJSON[key];
        if (newKeyName) {
          newObj[newKeyName] = value;
        } else {
          newObj[key] = value;
        }
      }
      return newObj;
    }
  });

  return AnnotationAbbreviation;
});

