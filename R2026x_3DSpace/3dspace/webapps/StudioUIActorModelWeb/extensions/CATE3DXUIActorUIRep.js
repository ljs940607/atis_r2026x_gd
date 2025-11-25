/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorUIRep
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXPUIActor_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorUIRep',
[
	'UWA/Core',
	'UWA/Class/Listener',
	'DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep',
	'DS/Visualization/ThreeJS_DS'
],
function (UWA, Listener, CATI3DXUIRep, THREE) {
	'use strict';

	var CATE3DXUIActorUIRep = UWA.Class.extend(Listener,
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorUIRep.prototype **/
	{
		init: function () {
			this._parent();
			this._UIActorRep = null;
			this._frameChanges = {};
			this._refreshAtNextFrame = false;
		},

		Dispose: function () {
			this._parent();
			this.stopListening();
			this._UIActorRep.Dispose();
			this._UIActorRep = null;
			this._frameChanges = {};
			this._refreshAtNextFrame = false;
		},

		// --- Interface CATE3DXUIActorUIRep
		_Create: function () {
		    var self = this;
		    var expObject = this.QueryInterface('CATI3DExperienceObject');

		    var data = expObject.GetValueByName('data');
		    if (data) {
		        var dataExpObject = data.QueryInterface('CATI3DExperienceObject');

		        var uiRep = this.GetObject()._experienceBase.getManager('CAT3DXUIManager').getFactory().createRep(dataExpObject.GetValueByName('__configurationName__'), expObject);
		        
		        this.listenTo(expObject, 'attachment.CHANGED', function () {
		            self._addFrameChanges('attachmentListener', self._createOrRefreshAttachmentListeners);
                });
                this.listenTo(expObject, 'minimumDimension.CHANGED', function () {
                    self._addFrameChanges('minimumDimension', self._createOrRefreshMinimumDimensionListeners); //Recalcultate offset if size changed
                });
                this.listenTo(expObject, 'offset.CHANGED', function () {
                    self._addFrameChanges('offsetListener', self._createOrRefreshOffsetListeners);
                });
              
                this._addFrameChanges('attachmentListener', self._createOrRefreshAttachmentListeners);
                this._addFrameChanges('minimumDimensionListener', self._createOrRefreshMinimumDimensionListeners);
                this._addFrameChanges('offsetListener', self._createOrRefreshOffsetListeners);

		        return uiRep;
		    }
		    return this.GetObject()._experienceBase.getManager('CAT3DXUIManager').getFactory().createRep('undefined', expObject);
		},

        _createOrRefreshAttachmentListeners : function(){
            this.stopListening(null, 'side.CHANGED');
            this.stopListening(null, 'target.CHANGED');

            var attachment = this.QueryInterface('CATI3DExperienceObject').GetValueByName('attachment');
            var attachmentEo = attachment.QueryInterface('CATI3DExperienceObject');
            var self = this;
            this.listenTo(attachmentEo.QueryInterface('CATI3DExperienceObject'), 'side.CHANGED', function () {
                self._addFrameChanges('attachment', self._refreshAttachment);
            });
            this.listenTo(attachmentEo.QueryInterface('CATI3DExperienceObject'), 'target.CHANGED', function () {
                self._addFrameChanges('attachment', self._refreshAttachment);
            });
            this._addFrameChanges('attachment', this._refreshAttachment);
        },

        _createOrRefreshOffsetListeners: function () {
            this.stopListening(null, 'x.CHANGED');
            this.stopListening(null, 'y.CHANGED');

            var offset = this.QueryInterface('CATI3DExperienceObject').GetValueByName('offset');
            var offsetEo = offset.QueryInterface('CATI3DExperienceObject');
            var self = this;
            this.listenTo(offsetEo.QueryInterface('CATI3DExperienceObject'), 'x.CHANGED', function () {
                self._addFrameChanges('offset', self._refreshOffset);
            });
            this.listenTo(offsetEo.QueryInterface('CATI3DExperienceObject'), 'y.CHANGED', function () {
                self._addFrameChanges('offset', self._refreshOffset);
            });
            this._addFrameChanges('offset', this._refreshOffset);
        },

        _createOrRefreshMinimumDimensionListeners: function () {
            this.stopListening(null, 'width.CHANGED');
            this.stopListening(null, 'height.CHANGED');
            this.stopListening(null, 'mode.CHANGED');

            var minimumDimension = this.QueryInterface('CATI3DExperienceObject').GetValueByName('minimumDimension');
            var minimumDimensionEo = minimumDimension.QueryInterface('CATI3DExperienceObject');
            var self = this;
            this.listenTo(minimumDimensionEo.QueryInterface('CATI3DExperienceObject'), 'width.CHANGED', function () {
                self._addFrameChanges('offset', self._refreshOffset);
            });
            this.listenTo(minimumDimensionEo.QueryInterface('CATI3DExperienceObject'), 'height.CHANGED', function () {
                self._addFrameChanges('offset', self._refreshOffset);
            });
            this.listenTo(minimumDimensionEo.QueryInterface('CATI3DExperienceObject'), 'mode.CHANGED', function () {
                self._addFrameChanges('offset', self._refreshOffset);
            });
            this._addFrameChanges('offset', this._refreshOffset);
        },

		_refreshAttachment: function () {
		    var expObject = this.QueryInterface('CATI3DExperienceObject');

			var attachment = expObject.GetValueByName('attachment');
			var attachmentEO = attachment.QueryInterface('CATI3DExperienceObject');
			var side = attachmentEO.GetValueByName('side');

			if (side === CATI3DXUIRep.Attachment.ESide.e3DActor) {
                var offset = expObject.GetValueByName('offset');
                var offsetEO = offset.QueryInterface('CATI3DExperienceObject');
                var offsetX = offsetEO.GetValueByName('x');
                var offsetY = offsetEO.GetValueByName('y');
                this._UIActorRep.attachTo3D(attachmentEO.GetValueByName('target'), offsetX, offsetY);
			}
			else {
				if (this._UIActorRep.isAttachTo3D()) {
                    this._UIActorRep.detachFrom3D();                    
				}
            }
			this._addFrameChanges('offset', this._refreshOffset);
		},

		_refreshOffset: function () {
		    var expObject = this.QueryInterface('CATI3DExperienceObject');

			var attachment = expObject.GetValueByName('attachment');
			var attachmentEO = attachment.QueryInterface('CATI3DExperienceObject');
			var side = attachmentEO.GetValueByName('side');

			var dimension = this.QueryInterface('CATICXPUIActor').GetDimension();
			var width = dimension.width;
			var height = dimension.height;

			//Fix wait div rendered to get Dimension
			var minDimension = this.QueryInterface('CATICXPUIActor').GetMinimumDimension();

			if (side !== CATI3DXUIRep.Attachment.ESide.eTopLeft && width === 0 && height === 0 && expObject.GetValueByName('visible') && (minDimension.width !== 0 || minDimension.height !== 0)) {
				var self = this;
				setTimeout(function () {
				    self._addFrameChanges('offset', self._refreshOffset);
				}, 200);
				return;
			}

			var offset = expObject.GetValueByName('offset');
			var offsetEO = offset.QueryInterface('CATI3DExperienceObject');
			var offsetX = offsetEO.GetValueByName('x');
			var offsetY = offsetEO.GetValueByName('y');

			var left, top;

			switch (side) {
			    case CATI3DXUIRep.Attachment.ESide.eTopLeft:
					left = offsetX + 'px';
					top = offsetY + 'px';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eTop:
					left = 'calc(50% + ' + (offsetX - width / 2) + 'px)';
					top = offsetY + 'px';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eTopRight:
					left = 'calc(100% + ' + (offsetX - width) + 'px)';
					top = offsetY + 'px';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eLeft:
					left = offsetX + 'px';
					top = 'calc(50% + ' + (offsetY - height / 2) + 'px)';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eCenter:
					left = 'calc(50% + ' + (offsetX - width / 2) + 'px)';
					top = 'calc(50% + ' + (offsetY - height / 2) + 'px)';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eRight:
					left = 'calc(100% + ' + (offsetX - width) + 'px)';
					top = 'calc(50% + ' + (offsetY - height / 2) + 'px)';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eBottomLeft:
					left = offsetX + 'px';
					top = 'calc(100% + ' + (offsetY - height) + 'px)';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eBottom:
					left = 'calc(50% + ' + (offsetX - width / 2) + 'px)';
					top = 'calc(100% + ' + (offsetY - height) + 'px)';
					break;
			    case CATI3DXUIRep.Attachment.ESide.eBottomRight:
					left = 'calc(100% + ' + (offsetX - width) + 'px)';
					top = 'calc(100% + ' + (offsetY - height) + 'px)';
					break;
                case CATI3DXUIRep.Attachment.ESide.e3DActor:
                    left = '0px';
                    top = '0px';
			        var node2D = this.QueryInterface('CATI3DXUIRep').Get().get2DNode();
			        node2D.setOffset(new THREE.Vector2(offsetX, offsetY));
			        var viewer = this.GetObject()._experienceBase.webApplication.frmWindow.getViewer();
                    viewer.render();
                    break;
			    default:
			        break;
			}
			this._UIActorRep.left = left;
			this._UIActorRep.top = top;
		},

		Get: function () {
			if (this._UIActorRep === null) {
				this._UIActorRep = this._Create();
			}
			return this._UIActorRep;
		},

		_addFrameChanges: function (iId, iCallback) {
		    this._frameChanges[iId] = iCallback;

		    if (!this._refreshAtNextFrame) {
		        this._refreshAtNextFrame = true;
		        this.GetObject()._experienceBase.getManager('CAT3DXUIManager')._refreshUIRep(this);
		    }
		},

		Refresh: function () {
		    this._refreshAtNextFrame = false;
	        for (var id in this._frameChanges) {
	            if (this._frameChanges.hasOwnProperty(id)) {
	                this._frameChanges[id].call(this);
	                delete this._frameChanges[id];
	            }
	        }
	    },

		RegisterPlayEvents: function(iSdkObject) {
			this.Get().registerPlayEvents(iSdkObject);
		},

		ReleasePlayEvents: function() {		
			this.Get().releasePlayEvents();
		},

		SetIndex: function(iIndex) {
			this.Get().zIndex = iIndex;
		}
	});
	return CATE3DXUIActorUIRep;
});
