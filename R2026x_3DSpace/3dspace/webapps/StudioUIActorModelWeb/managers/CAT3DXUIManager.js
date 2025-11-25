/**
* @name DS/StudioUIActorModelWeb/managers/CAT3DXUIManager
* @constructor
* @hideconstructor
*
* @description
* Manager in charge of rendering UI Actors.
*/
define('DS/StudioUIActorModelWeb/managers/CAT3DXUIManager',
[
	'UWA/Core',
	'UWA/Class/Listener',
	'DS/StudioUIActorModelWeb/CXPUIRepFactory'
],
function (UWA, Listener, RepFactory) {
	'use strict';

	var CAT3DXUIManager = UWA.Class.extend(Listener,
	/** @lends DS/StudioUIActorModelWeb/managers/CAT3DXUIManager.prototype **/
	{

		Build: function () {
			this._UIActorsList = [];
			this._UIActors3DAttachList = [];
			this._uiRepToRefresh = [];
			this._repFactory = new RepFactory();
			this._doRefreshUIActorsList = false;
			this._doRefreshUIActorsZIndex = false;
		},

		Dispose: function () {
		    this.removeExperience();
		    delete this._repFactory;
		    this._doRefreshUIActorsList = false;
			this._doRefreshUIActorsZIndex = false;
			delete this._waitUIActorsReadyDeferred;
		},

	    /**
        * Return UI representation factory
        * @return {Object} ui actors rep factory
        */
		getFactory: function () {
		    return this._repFactory;
		},

		setExperience: function (iExperience) {
		    if (this._experience) {
		        console.warn('CAT3DXUIManager : An experience is already defined');
		        return;
		    }
		    this._experience = iExperience;

		    var self = this;
		    this.listenTo(iExperience.QueryInterface('CATI3DExperienceObject'), 'actors.CHANGED', function () {
		        self._doRefreshUIActorsList = true;
			});
			this.listenTo(iExperience.QueryInterface('CATI3DExperienceObject'), 'currentScene.CHANGED', function () {
				self._doRefreshUIActorsList = true;
			});
		    this._doRefreshUIActorsList = true;
		},

		removeExperience: function () {
		    delete this._experience;
		    this.stopListening();
		    this._UIActorsList = [];
		    this._uiRepToRefresh = [];

			// Remove all 2DUIActors from the DOM
		    var uiRepHolder = this._getUIRepHolder();
		    while (uiRepHolder.firstChild) {
		        uiRepHolder.firstChild.remove();
		    }

			// Remove all 2DUIActors from the viewer
		    for (const UIActor3DAttach of this._UIActors3DAttachList) {
				let uiRep3DAttach = UIActor3DAttach.QueryInterface('CATI3DXUIRep');
				uiRep3DAttach.DetachNodeFromViewer();
				this._UIActors3DAttachList.shift();
            }
		},

	    /**
        * Return dom root for UIActor (does not contain 3DAttach UIActors /!\)
        * @public
        * @return  {object} Dom root
        */
		_getUIRepHolder: function () {
		    if (!this._UIRepHolder) {
		        this._createUIRepHolder();
		    }
		    return this._UIRepHolder;
		},

		_createUIRepHolder: function () {
		    if (!this._UIRepHolder) {
		        this._UIRepHolder = UWA.createElement('div').inject(this._experienceBase.webApplication.frmWindow.getUIFrame());
		        this._UIRepHolder.id = 'UIActorsRepHolder';
		        this._UIRepHolder.style.position = 'absolute';
		        this._UIRepHolder.style.left = '0px';
		        this._UIRepHolder.style.right = '0px';
		        this._UIRepHolder.style.top = '0px';
		        this._UIRepHolder.style.bottom = '0px';
		        this._UIRepHolder.style.zIndex = 1;
		        this._UIRepHolder.style.pointerEvents = 'none';
		    }
		},

		_refreshUIActorsList: function () {
		    this.stopListening(null, 'zIndex.CHANGED');
		    this._UIActorsList = [];

			// Remove all 2DUIActors from the DOM
		    var uiRepHolder = this._getUIRepHolder();
		    while (uiRepHolder.firstChild) {
		        uiRepHolder.firstChild.remove();
		    }
			// Remove all 2DUIActors from the viewer
		    for (const UIActor3DAttach of this._UIActors3DAttachList) {
				let uiRep3DAttach = UIActor3DAttach.QueryInterface('CATI3DXUIRep');
				uiRep3DAttach.DetachNodeFromViewer();
				this._UIActors3DAttachList.shift();
            }

		    var self = this;
		    var actors = this._experience.QueryInterface('CATI3DExperienceObject').GetValueByName('actors');
		    for (let i = 0; i < actors.length; i++) {
		        let uiRep = actors[i].QueryInterface('CATI3DXUIRep');
		        if (!uiRep) {
		            continue;
		        }
		        this._UIActorsList.push(actors[i]);
		        let uiActorRep = uiRep.Get();
				if (UWA.is(uiActorRep)) { // Inject the 2DUIActor to the DOM
					uiActorRep.inject(uiRepHolder);
				} else { // Add the 2DUIActor to the list of 3DAttached
					this._UIActors3DAttachList.push(actors[i]);
					uiRep.AttachNodeToViewer();
				}
		        this.listenTo(actors[i].QueryInterface('CATI3DExperienceObject'), 'zIndex.CHANGED', function () {
		            self._doRefreshUIActorsZIndex = true;
		        });
			}

			var sceneMgr = this._experience.QueryInterface('CATICXPScenesMgr');
			if (sceneMgr)
			{
				var currentScene = sceneMgr.GetCurrentScene();
				if (currentScene)
				{
					var actorsScene = currentScene.QueryInterface('CATI3DExperienceObject').GetValueByName('actors');
					for (let i = 0; i < actorsScene.length; i++) {
						let uiRep = actorsScene[i].QueryInterface('CATI3DXUIRep');
						if (!uiRep) {
							continue;
						}
						this._UIActorsList.push(actorsScene[i]);
						let uiActorRep = uiRep.Get();
						if (UWA.is(uiActorRep)) { // Inject the 2DUIActor to the DOM
							uiActorRep.inject(uiRepHolder);
						} else { // Add the 2DUIActor to the list of 3DAttached
							this._UIActors3DAttachList.push(actorsScene[i]);
							uiRep.AttachNodeToViewer();
						}
						this.listenTo(actorsScene[i].QueryInterface('CATI3DExperienceObject'), 'zIndex.CHANGED', function () {
							self._doRefreshUIActorsZIndex = true;
						});
					}
				}
			}


		    this._doRefreshUIActorsZIndex = true;
			this._doRefreshUIActorsList = false;
			if (this._waitUIActorsReadyDeferred) {
				this._waitUIActorsReadyDeferred.resolve();
            }
		},

		_refreshUIActorsZIndex : function(){
		    this._UIActorsList.sort(function (iUIActorA, iUIActorB) {
		        if (iUIActorA.QueryInterface('CATI3DExperienceObject').GetValueByName('zIndex') < iUIActorB.QueryInterface('CATI3DExperienceObject').GetValueByName('zIndex')) {
		            return -1;
		        } else if (iUIActorA.QueryInterface('CATI3DExperienceObject').GetValueByName('zIndex') > iUIActorB.QueryInterface('CATI3DExperienceObject').GetValueByName('zIndex')) {
		            return 1;
		        }
		        return 0;
		    });
		    for (var i = 0; i < this._UIActorsList.length; i++) {
		        this._UIActorsList[i].QueryInterface('CATI3DXUIRep').SetIndex(i);
		    }
		    this._doRefreshUIActorsZIndex = false;
		},

		_update: function () {
		    if (this._doRefreshUIActorsList) {
		        this._refreshUIActorsList();
		    }

		    if (this._doRefreshUIActorsZIndex) {
		        this._refreshUIActorsZIndex();
		    }

		    for (var i = 0 ; i < this._uiRepToRefresh.length; i++) {
		        this._uiRepToRefresh[i].Refresh();
            }
		    this._uiRepToRefresh = [];
        },

		_refreshUIRep: function (iUIRep) {
		    this._uiRepToRefresh.push(iUIRep);
		},

		waitUIActorsReady: function () {
			if (!this._doRefreshUIActorsList) {
				return UWA.Promise.resolve();
			}

			if (this._waitUIActorsReadyDeferred) {
				return this._waitUIActorsReadyDeferred.promise;
			} 

			this._waitUIActorsReadyDeferred = new UWA.Promise.deferred();
			return this._waitUIActorsReadyDeferred.promise.then(() => {
				delete this._waitUIActorsReadyDeferred;
			});
        },

		GetType: function () {
		    return 'CAT3DXUIManager';
		}
	});
	return CAT3DXUIManager;
});

