/* global define, widget */
/**
 * @overview user Group Management - Search utilities
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
		[
			'UWA/Class',
			'DS/UIKIT/Alert',
			'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
			],
			function(
					UWAClass,
					UIAlert,
					NLS
			) {
	'use strict';
	let getRefinementToSnN = function(socket_id, title, multiSelect,recentTypes){	
		
		var refinementToSnNJSON = {
				"title": NLS[title],
				"role": "",
				"mode": "furtive",
				"default_with_precond": true,				
				"show_precond": false,
				"multiSel": multiSelect,
				"idcard_activated": false,
				"select_result_max_idcard": false,
				"itemViewClickHandler": "",
				"app_socket_id": socket_id,
				"widget_id": socket_id,
				"search_delegation": "3dsearch",
				"default_search_criteria": "",
				"source": ["3dspace"],
				recent_search: { 
					'types':recentTypes
				}
		};
		refinementToSnNJSON.global_actions = [{"id":"incontextHelp","title":NLS['search.help'],"icon":"fonticon fonticon-help","overflow":false}];
		return refinementToSnNJSON;
	};
	
	let getPrecondForContentSearch = function(scopeId, userGroupContentSearchTypes,usergroupOrg){
        var precond_taxonomies = "";
        var types_count = userGroupContentSearchTypes.length;
        userGroupContentSearchTypes.forEach(function(type, index){
        	precond_taxonomies += '(flattenedtaxonomies:\"types\/'+type+'\"';
        	if(type === "Person"){
				precond_taxonomies += ' AND current:"Active"';
				if(types_count>1){
					precond_taxonomies += ')';
				}
			}
        	if(index < types_count-1){
                precond_taxonomies += " OR ";
            }
            if(index == types_count-1){
                precond_taxonomies += ")";
            }
        });
        	
		/*if(scopeId != "" && typeof scopeId != 'undefined' && scopeId != "Organization" && scopeId != "All" ){
			precond_taxonomies += ' AND usergroup_95_content_95_scope:"'+scopeId+'"';
		}else if(scopeId == "Organization"){
			if(usergroupOrg == undefined || usergroupOrg == ""){
				usergroupOrg= getOrganisation();
			}
			precond_taxonomies += ' AND organization:"'+usergroupOrg+'"';
		}*/
		return precond_taxonomies;
	};
	
	let queryForPersonSearch = function(typeaheadValue){
		var precond = "([ds6w:label]:(*"+typeaheadValue+"*) OR [ds6w:identifier]:(*"+typeaheadValue+"*))"+" AND (flattenedtaxonomies:\"types/Person\" AND current:\"active\")";
		return precond;
	};
	
	let getMemberAdvancedSearch = function(userGroupContentSearchTypes){
		var advacedSearchJson = {
				"basic_predicates": [],
				"showByDefault":false,
				"searchOnInit":true,
				"showExtension":false,
				"showPLMParameter":false
		};
		var typeArray = [];
		userGroupContentSearchTypes.forEach(function(type, index){
			var jsonType = {
					"uri":"ds6wg:"+type, 
					"predicates":[]
				};
			typeArray.push(jsonType);
		});
		advacedSearchJson["ds6w:type"] = typeArray;
		advacedSearchJson["selection"] = {
			"ds6w:type" : ["ds6wg:Person"],
			"ds6w:dataSource":[]
		};
		advacedSearchJson["common_predicates"] = [
				{
					"uri":"ds6w:identifier",
					"showByDefault":true,
					"nlsName":"Name",
					"type":"string"
				},{
					"uri":"ds6wg:First Name",
					"showByDefault":true,
					"nlsName":"First Name",
					"type":"string"
				},
				{
					"uri":"ds6wg:Last Name",
					"showByDefault":true,
					"nlsName":"Last Name",
					"type":"string"
				},
				{
					"uri":"ds6w:userRole",
					"showByDefault":true,
					"nlsName":"Role",
					"type":"string"
				},
				{
					"uri":"ds6w:member",
					"showByDefault":true,
					"nlsName":"Member Of",
					"type":"string"
				}
				
			];
		return advacedSearchJson;
	}
	
	/*let getPrecondForUserGroupSearch = function(){
		return "flattenedtaxonomies:(\"types\/User Group\") AND current:\"Active\" AND latestrevision:\"TRUE\" AND usergroup_95_template_95_valid:\"TRUE\"";
	};*/
	/*let getPrecondForScopeSearch = function(){
		return "flattenedtaxonomies:\"types/Workspace Vault\" OR flattenedtaxonomies:\"types/Workspace\" OR flattenedtaxonomies:\"types/Personal Workspace\" OR flattenedtaxonomies:\"types/Project Space\" AND (identifier:(__QUERY__) OR label:(__QUERY__))";
	};*/
	
	/*let getPrecondForTaskMemberSearch = function(data){
		// Person
		let refinement = {};
		refinement.precond = "(flattenedtaxonomies:\"types/Person\" OR \"types/Group\") AND current:\"active\"";
		
		if(!(data.Scope)){
			// something went wrong in passing the scope to search precond //
			return refinement;
		}
		
		// In case of empty include scope ids, then we need to pass empty string to resource in. //
		// else all the matching precond results will be fetched //
		if(!data.ScopeMembers){
			data.ScopeMembers = [""];
		}
		if(data.ScopeMembers.length == 0){
			if(data.ScopeMembers[0] == null || data.ScopeMembers[0] == undefined){
				data.ScopeMembers = [""];
			}
		}
		
		if("OnPremise" == "OnPremise"){
			// premise 
			if(data.Scope[0] == "All"){	
				refinement.precond = "(flattenedtaxonomies:\"types/Person\" OR \"types/Group\") AND current:\"active\"";
			} else if(data.Scope[0] == "Organization"){
				refinement.precond = "(flattenedtaxonomies:\"types/Person\" AND current:\"active\" AND member:\""+getOrganisation()+"\") " +
						"OR (flattenedtaxonomies:\"types/Group\" AND current:\"active\")";
			}else{
				// scope id based search //
				// HRL1 - Todo scope based premise search //
				// (mxid:29072.3456.17705.13245 OR mxid:29072.3456.17705.13754 OR mxid:29072.3456.17705.14359 OR 
				// mxid:29072.3456.17705.14832 OR mxid:29072.3456.17705.15262 OR mxid:29072.3456.25659.50790) 
				// AND (flattenedtaxonomies:"types/Person" OR "types/Group") AND current:"active"
				refinement.precond = "(flattenedtaxonomies:\"types/Person\" OR \"types/Group\") AND current:\"active\"";
				refinement.resourceid_in = data.ScopeMembers;
			}
		}else{
			// cloud
			if(data.Scope[0] == "All"){
				refinement.precond = "([ds6w:type]:(Group)) OR (flattenedtaxonomies:\"types/Person\" AND current:\"active\")";
			} else if(data.Scope[0]== "Organization"){
				refinement.precond = "([ds6w:type]:(Group)) OR (flattenedtaxonomies:\"types/Person\" AND current:\"active\" AND member:\""+getOrganisation()+"\")";
			} else{
				var uriInPreconds = "(";
				var resourceIdIn = [];
				var userGroupInScope = false;
				for(var i=0; i<data.ScopeMembers.length; i++){
					if(data.ScopeMembers[i].indexOf("uuid") != -1){
						userGroupInScope = true;
						uriInPreconds = uriInPreconds + "uri:\""+ data.ScopeMembers[i] + "\""+ " OR ";
					}else{
						resourceIdIn.push(data.ScopeMembers[i]);
					}
				}
				if(userGroupInScope){
					uriInPreconds = uriInPreconds.substring(0, refinementToSnNJSON.precond.length -4);
					uriInPreconds += ") ";
					refinement.precond = "("+uriInPreconds+" AND [ds6w:type]:(Group)) OR (flattenedtaxonomies:\"types/Person\" AND current:\"active\")";
				}else{
					refinement.precond = "((uri:\"-1\") AND [ds6w:type]:(Group)) OR (flattenedtaxonomies:\"types/Person\" AND current:\"active\")";
				}
				refinement.resourceid_in = resourceIdIn;			
			}
		}
		
		return refinement;
	};*/
	
/*	let getOrganisation=function(){
		var orgName="";
		if(widget.getPreference("organization") == undefined && widget.getPreference("organization") != ""){
			orgName=widget.data.pad_security_ctx.split("ctx::")[1].split('.')[1];
		}else{
			orgName = widget.getPreference("organization").value;
		}
		return orgName;
	};*/
	

	let SearchUtil = {
			getRefinementToSnN: (socket_id, title, multiSelect,recentTypes) => {return getRefinementToSnN(socket_id, title, multiSelect,recentTypes);},
			queryForPersonSearch: (typeaheadValue) => { return queryForPersonSearch(typeaheadValue); },
			getPrecondForContentSearch: (scopeId, userGroupContentSearchTypes, usergroupOrg) => {return getPrecondForContentSearch(scopeId, userGroupContentSearchTypes, usergroupOrg);},
			getMemberAdvancedSearch: (userGroupContentSearchTypes) => {return getMemberAdvancedSearch( userGroupContentSearchTypes);}
			//getPrecondForUserGroupSearch: () => {return getPrecondForUserGroupSearch();}
			//getPrecondForScopeSearch: () => {return getPrecondForScopeSearch();}
			//getPrecondForTaskMemberSearch: (data) => {return getPrecondForTaskMemberSearch(data);}
	};
	
	return SearchUtil;
});

/**
 * Mediator Component - handling interaction between components for smooth async events
 *
 */
define('DS/ENOUserGroupMgmt/Components/Mediator',
['DS/CoreEvents/ModelEvents'],
function(ModelEvents) {

    'use strict';
    var _eventBroker = null;
    var mediator = function () {
        // Private variables
        _eventBroker= new ModelEvents();
    };

    /**
     * publish a topic on given channels in param, additional data may go along with the topic published
     * @param  {[type]} eventTopic [description]
     * @param  {[type]} data       [description]
     *
     */
    mediator.prototype.publish = function (eventTopic, data) {
          _eventBroker.publish({ event: eventTopic, data: data }); // publish from ModelEvent
    };

    /**
    *
    * Subscribe to a topic
    * @param {string} eventTopic the topic to subcribe to
    * @param {function} listener the function to be called when the event fires
    * @return {ModelEventsToken}             a token to use when you want to unsubscribe
    */
    mediator.prototype.subscribe = function (eventTopic, listener) {
        return _eventBroker.subscribe({ event: eventTopic }, listener);

    };
    
    /**
     * Subscribe to an event once with eventually
     *
     *
     * @param  {Object} settings  options hash or a option/value pair.
     * @param  {Event} settings.event  Event to subscribe.
     * @param  {Function} callback  Function to call after event reception.
     *
     * @return {undefined}
     *
     */
    mediator.prototype.subscribeOnce = function(eventTopic, listener) {
    	return _eventBroker.subscribeOnce({ event: eventTopic }, listener);
    };

    /**
     * Unsubscribe to a topic
     * @param  {[type]} token [description]
     *
     */
    mediator.prototype.unsubscribe = function (token) {
        _eventBroker.unsubscribe(token);
    };

    mediator.prototype.getEventBroker = function(){
      return _eventBroker;
    };

    mediator.prototype.destroy = function(){
      _eventBroker.destroy();
    };



   return mediator;

});

/**
 * 
 */
define(
    'DS/ENOUserGroupMgmt/Components/Wrappers/TriptychWrapper',
    [
        'DS/ENOXTriptych/js/ENOXTriptych',
        //'DS/ENXuserGroupConfigApp/View/Panels/WelcomePanel'
    ],
    function (
        ENOXTriptych,
       // WelcomePanel
    ) {
        'use strict';

        var TriptychWrapper = function () { };

        TriptychWrapper.prototype.init = function (applicationChannel, parentContainer, left, middle, right, userGroupWCPanel, userGroupWCPanelOptions) {
            this._left = left;
            this._main = middle;
            this._right = right;
            this._userGroupWCPanel = userGroupWCPanel

            this._applicationChannel = applicationChannel;
            this._triptych = new ENOXTriptych();
            let leftState = widget.body.offsetWidth < 550 ? 'close' : 'open';

            if (!userGroupWCPanelOptions) {
                leftState = 'close'
            }
            
            let rightPanelUpdatedWidth = widget.getValue('usergroup-right-panel-width');
    		let rightPanelWidth = rightPanelUpdatedWidth== undefined ? 400 :rightPanelUpdatedWidth;
    	
            //if the properties page was already opened, then open the panel
            //let rightState = widget.propWidgetOpen ? 'open' : 'close';
            let triptychOptions = {
                left: {
                    resizable: true,
                    originalSize: 300,
                    minWidth: 300, // for closed welcome panel onload
                    originalState: leftState, // 'open' for open, 'close' for close
                    overMobile: true,
                    withClose: false,
                },
                right: {
                    resizable: true,
                    minWidth: 290,
                    originalSize: rightPanelWidth,
                    originalState: 'close', // 'open' for open, 'close' for close
                    overMobile: true,
                    withClose: false
                },
                borderLeft: false,
                container: parentContainer,
                withtransition: true,
                modelEvents: this._applicationChannel
            };

            this._triptych.init(triptychOptions, left, middle, right, userGroupWCPanelOptions);
            this._right.addEvent("resize", function() {
				let width = this.clientWidth;
				widget.setValue("usergroup-right-panel-width", width);
			});
            this.registeruserGroupEvents();
        };

        TriptychWrapper.prototype.inject = function (container) {
            this._triptych.inject(container);
        };

        // expose Triptych API if need be..
        TriptychWrapper.prototype._getTriptych = function () {
            return this._triptych;
        };

        TriptychWrapper.prototype.getLeftPanelContainer = function () {
            return this._left;
        };
        TriptychWrapper.prototype.getLeftPanelContainerTriptych = function () {
            return this._triptych._leftPanelContent;
        };

        TriptychWrapper.prototype.getRightPanelContainer = function () {
            return this._right;
        };

        TriptychWrapper.prototype.getMainPanelContainer = function () {
            return this._main;
        };

        TriptychWrapper.prototype.registeruserGroupEvents = function () {
            let that = this;
            if(widget.ugMgmtMediator){
	            widget.ugMgmtMediator.subscribe('usergroup-welcome-panel-activity-selection', function (data) {
	                if (that._userGroupWCPanel) {
	                    let oldSelectedElem = that._userGroupWCPanel.wPanelOptions.parentContainer.getElements(".activity-btn.selected");
	                    oldSelectedElem.forEach(function (item) {
	                        item.removeClassName('selected');
	                    });
	                    if (data.id) {
	                        that._userGroupWCPanel.wPanelOptions.parentContainer.getElement('.activity-btn#' + data.id).addClassName('selected');
	                        that._userGroupWCPanel.wPanelOptions.selectedItem = data.id;
	                    }
	                }
	            });
            }else{
				ugSyncEvts.ugMgmtMediator.subscribe('usergroup-welcome-panel-activity-selection', function (data) {
	                if (that._userGroupWCPanel) {
	                    let oldSelectedElem = that._userGroupWCPanel.wPanelOptions.parentContainer.getElements(".activity-btn.selected");
	                    oldSelectedElem.forEach(function (item) {
	                        item.removeClassName('selected');
	                    });
	                    if (data.id) {
	                        that._userGroupWCPanel.wPanelOptions.parentContainer.getElement('.activity-btn#' + data.id).addClassName('selected');
	                        that._userGroupWCPanel.wPanelOptions.selectedItem = data.id;
	                    }
	                }
	            });
			}
        };

        return TriptychWrapper;
    });

define('DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
        ['DS/CollectionView/ResponsiveTilesCollectionView'],
        function(WUXResponsiveTilesCollectionView) {

    'use strict';

    let WrapperTileView, _myResponsiveTilesView, _container;
    /*
     * builds the default container for tile view if container is not passed
     */
    let buildLayout = function(){
        _container=UWA.createElement('div', {id:'TileViewContainer', 'class':'tile-view-container hideView'});

    };
    /*
     * builds the tile view using WebUX's tile view
     * required param: treeDocument as model 
     * optional: container if customize container dom element is required with ur own class
     */
    let initTileView = function (treeDocument,container, enableDragAndDrop){
        if(!container){
            buildLayout();
        }else{
            _container = container;
        }	
        if(!enableDragAndDrop){
        	enableDragAndDrop = false;
        }
        _myResponsiveTilesView = new WUXResponsiveTilesCollectionView({
            model: treeDocument,
            shouldCellAllowUnsafeHTMLContentAt: function(cellInfos, origin){
				return ['description','picture'].includes(origin)
			},
            useDragAndDrop: enableDragAndDrop,
            selectionBehavior: {				
				enableFeedbackForActiveCell: widget.readOnlyUG ? false : true
			},
            cellPreselectionFeedback: widget.readOnlyUG ? 'none' : 'cell',
            displayedOptionalCellProperties: widget.readOnlyUG ? ['description'] : ['description','contextualMenu'],
        });

		if(widget.readOnlyUG)
			_myResponsiveTilesView.supportsSelection = function () { return false; };

        _myResponsiveTilesView.getContent().style.top = '50 px';
        _myResponsiveTilesView.inject(_container);
        return _container;
    };
    /*
     * Returns the tile view
     */
    let tileView = function(){
        return _myResponsiveTilesView;
    };

    /*
     * Exposes the below public APIs to be used
     */
    WrapperTileView={
            build: (treeDocument,container) => {return initTileView(treeDocument,container);},
            tileView: () => {return tileView();}
    };

    return WrapperTileView;

});

define('DS/ENOUserGroupMgmt/Config/UsersGroupTabsConfig',
[
 'UWA/Drivers/Alone',
 'DS/CoreBase/WebUXGlobalEnums',
 'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
function( Alone, WebUXGlobalEnums, NLS) {

    'use strict';
	
	const WUXManagedFontIcons = WebUXGlobalEnums.WUXManagedFontIcons;
	
    let UsersGroupTabsConfig = [{ 
    	label: NLS.members,
    	id:"members",
		isSelected:true, 
    	icon: { 
    		iconName: "users", 
    		fontIconFamily:  WUXManagedFontIcons.Font3DS
    	}, 
    	allowClosableFlag : false,
    	content: Alone.createElement('div', {id:'UsersGroupMembersContainer', 'class':'usergroup-members-container'}),
        loader : 'DS/ENOUserGroupMgmt/Views/UsersGroupMembersView' // loader file path to load the content
    },{ 
    	label: NLS.infoPropertiesTab, 
    	id:"properties",
    	isSelected:false, 
    	icon: { 
    		iconName: "attributes",
    		fontIconFamily: WUXManagedFontIcons.Font3DS,
    		orientation: "horizontal"
    	},
    	content: Alone.createElement('div', {id:'UsersGroupPropertiesContainer', 'class':'UsersGroup-properties-container'}),
        loader : 'DS/ENOUserGroupMgmt/Views/UsersGroupPropertiesView' // loader file path to load the content
    },{ 
    	label: NLS.accessRightsTab, 
    	id:"accessRights",
    	isSelected:false, 
    	icon: { 
    		iconName: "users-group-key",
    		fontIconFamily: WUXManagedFontIcons.Font3DS
    	},
    	content: Alone.createElement('div', {id:'userGroupAccessRightsContainer', 'class':'usergroup-accessrights-container'}),
        loader : 'DS/ENOUserGroupMgmt/Views/UserGroupAccessRightsView' // loader file path to load the content
    }
    ];

    return UsersGroupTabsConfig;

});

/**
 * Notification Component - initializing the notification component
 *
 */
define('DS/ENOUserGroupMgmt/Components/Notifications',[
	'DS/Notifications/NotificationsManagerUXMessages',
	'DS/Notifications/NotificationsManagerViewOnScreen',
	],
function(NotificationsManagerUXMessages,NotificationsManagerViewOnScreen) {

    'use strict';
    let _notif_manager = null;
    let Notifications = function () {
        // Private variables
    	
    	
        /**
         * 
         *
         * @param {Number} policy Policy that need to be set. It can be a combination of multiple options.
         *                  possible options :
         *                      - 0  No stacking
         *                      - 1  Stacking using level only
         *                      - 2  Stacking using category (can not be used alone, use level too by setting a policy of 3)
         *                      - 4  Stacking using title (can not be used alone, use level too by setting a policy of 5)
         *                      - 8  Stacking using subtitle (can not be used alone, use level too by setting a policy of 9)
         *                      - 16 Stacking only if the new notification matches the last one displayed (can not be used alone)
         *                  possible values :
         *                      - 0                    No stacking
         *                      - 1 + possibleOptions  Stacking can't be done without stacking the level
         * 
         */
    	_notif_manager = NotificationsManagerUXMessages;
    	NotificationsManagerViewOnScreen.setNotificationManager(_notif_manager);
    	NotificationsManagerViewOnScreen.setStackingPolicy(9); //To stack similar subject messages 
    	
    };
    
    Notifications.prototype.handler = function () {
    	if(document.getElementById("createUserGroup")){ //This id is of create dialog panel of the usergroup widget. 
    		//This means create dialog window is opened and show the notification on the window
    		NotificationsManagerViewOnScreen.inject(document.getElementById("createUserGroup"));
    		//document.getElementById('createUserGroup').scrollIntoView();
    	} 
    	if(document.getElementById("duplicateUserGroup")){ //This id is of create dialog panel of the usergroup widget. 
    		//This means create dialog window is opened and show the notification on the window
    		NotificationsManagerViewOnScreen.inject(document.getElementById("duplicateUserGroup"));
    		//document.getElementById('createUserGroup').scrollIntoView();
    	}     	
    	else{
    		if(document.getElementsByClassName('wux-notification-screen').length > 0){
        		//Do nothing as the notifications will be shown here.
        	}else{
        		NotificationsManagerViewOnScreen.inject(document.body);
        	}
    	}
    	
    	return _notif_manager;
    }; 
    
    Notifications.prototype.notifview = function(){
    	return NotificationsManagerViewOnScreen;
    }; 
    
    return Notifications;

});

define('DS/ENOUserGroupMgmt/Utilities/RequestUtils', ['UWA/Class', 'DS/WAFData/WAFData', 'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices'], function(c, a,i3DXCompassPlatformServices) {
    var b = c.singleton({
        m3DSpaceURL: "../..",
        m3DSpaceCSRFToken: null,
        mLanguage : "en",
        SecurityContext: null,
        isAdmin: false,
        isLeader: false,
        isAuthor: false,
        contextUser: null,
        contextUserFullName: null,
        contextUserID: null,
        AllowPrivateUserGroup: "False",
        populate3DSpaceURL:  {
        		
        },
        _frameENOVIA : false,
        getSyncOptions : function() {
            if (this._frameENOVIA) {
                return {};
            } else {
                var syncOptions = {
                    ajax: a.authenticatedRequest
                };

                return syncOptions;
            }
        },
        getUserGroupServiceBaseURL: function() {
            return "resources/bps";
        },
    	
        get3DSpaceCSRFToken: function() {
            return this.m3DSpaceCSRFToken;
        },
        
        send3DSpaceRequest: function(d, h, e, g, f) {
            return this.sendRequest(this.m3DSpaceURL + "/" + d, h, e, g, f);
        },
    	
        setIsAdmin : function(admin){
    		this.isAdmin = admin;
    	},
    	setIsLeader : function(leader){
    		this.isLeader = leader;
    	},
    	setIsAuthor : function(author){
    		this.isAuthor = author;
    	},
    	
    	setContextUser : function(contextUser, contextUserFullName, contextUserID){
    		this.contextUser = contextUser;
    		this.contextUserFullName = contextUserFullName;
    		this.contextUserID = contextUserID;
    		
    	},
    	setAllowPrivateUserGroup: function(AllowPrivateUserGroup){
			this.AllowPrivateUserGroup = AllowPrivateUserGroup;
		},
        set3DSpaceCSRFToken: function(d) {
            this.m3DSpaceCSRFToken = d
        },

        setSecurityContext: function(d) {
        	if(d.indexOf("ctx::")==0){
        		d = d.substr(5);
        	}
            this.SecurityContext = d
        },
        sendRequest: function(f, h, d, g, e) {
            d.method = h;
            d.onComplete = g;
            d.onFailure = e;
            return this.sendRequestSimple(f, d)
        },
        sendRequestSimple: function(e, d) {
            if (!d.headers) {
                d.headers = {};
                d.headers["Content-type"] = "text/html"
            }
            if (!d.type) {
                d.type = "text"
            }
            if (!d.data) {
                d.data = ""
            }
            if (this.m3DSpaceCSRFToken) {
                d.headers["X-Requested-With"] = "csrf protection";
                d.headers["X-Request"] = this.m3DSpaceCSRFToken
            }
            if (this.SecurityContext) {
                d.headers.SecurityContext = encodeURI(this.SecurityContext)
            }
            if (d.method !== "GET" && !d.isCheckOut && d.type === "json" && d.data && (d.data instanceof Object)) {
                d.headers["Content-type"] = "application/json";
                d.data = JSON.stringify(d.data)
            }
            d.timeout = 600000;
            return a.authenticatedRequest(e, d)
        },
        send3DSpaceRequestSimple: function(d, e) {
            return this.sendRequestSimple(this.m3DSpaceURL + "/" + d, e);
        },
        
        getPopulate3DSpaceURL: function (options) {
        	var that = this;
        	var returnedPromise = new Promise(function (resolve, reject) {
        		var config = null;
        		/*     if (options) {
	            config = {};
	            config.myAppsBaseUrl = options.myAppsBaseUrl,
	            config.userId = options.userId,
	            config.lang = options.lang
	          }*/
        		i3DXCompassPlatformServices.getPlatformServices({
        			config: config,
        			onComplete: function (data) {
        				for (var count = 0; count < data.length; count++) {
        					if(that.populate3DSpaceURL){

        						that.populate3DSpaceURL.tenantMappings = data;
        						that.populate3DSpaceURL.baseURL = data[count]["3DSpace"];
        						that.populate3DSpaceURL.federatedURL = data[count]["3DSearch"];
        						that.populate3DSpaceURL.swymURL = data[count]["3DSwym"];
        						that.populate3DSpaceURL.tenant = data[count]["platformId"]
        					}
        				}
        				resolve();
        			},
        			onFailure: reject
        		});
        	});
        	return returnedPromise;
        },
        
        
        
        
        initLanguage: function(f, e) {
            var d = this;
            this.send3DSpaceRequestSimple(this.getUserGroupServiceBaseURL() + "/application/language", {
                method: "GET",
                type: "json",
                headers: {
                    "Content-type": "application/json"
                },
                onComplete: function(g) {
                    require.config({
                        config: {
                            i18n: {
                                locale: g.language
                            }
                        }
                    });
                    d.mLanguage = g.language;
                    f()
                },
                onFailure: e
            })
        }
    })
        return b
});


define('DS/ENOUserGroupMgmt/Utilities/DateUtils',
[],
function() {
	
    'use strict';
    
    var DateUtils = {};
    
    DateUtils.formatDateString = function (dateObj) {
        // Display options for the date formated string
        var intlOptions,
            dateString;
        if (!DateUtils.isValidDate(dateObj)) {
            dateString = '';
        } else if (!UWA.is(DateUtils.getCookie("swymlang")) || !UWA.is(window.Intl)) {
            dateString = dateObj.toDateString();
        } else {
            intlOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            };
            // The Intl API is currently not supported on Safari
            // nor in IE < 11 and and mobile browsers but Chrome mobile
            dateString = new Intl.DateTimeFormat(DateUtils.getCookie("swymlang"), intlOptions).format(dateObj);
        }
        return dateString;
    };
    
    DateUtils.formatDateTimeString = function (dateObj) {
        var dateString;
         // Display options for the date time formated string
        var intlOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            };
        if (!DateUtils.isValidDate(dateObj)) {
            dateString = '';
        } else {
            // The Intl API is currently not supported on Safari
            // nor in IE < 11 and and mobile browsers but Chrome mobile
            dateString = dateObj.toLocaleDateString(DateUtils.getCookie("swymlang"), intlOptions) +" "+ dateObj.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
        }
        return dateString;
    };
    
    DateUtils.isValidDate = function (obj) {
        return UWA.is(obj, 'date') && !isNaN(obj.getTime());
    };
    
    DateUtils.getLocaleDate = function(date, isFormatRequired){
    	if(isFormatRequired){
        	let swymLang = DateUtils.getCookie("swymlang");
        	//if swymlang not present, then this will return based on the browser's language settings
        	return (swymlang != undefined) ? date.toLocaleString(swymLang) : date.toLocaleString();
    	}
    	//Always hardcoding locale to "en" if no format is specified 
        return date.toLocaleString("en");
    };
    
    DateUtils.getCookie = function (name) {
    	  var value = "; " + document.cookie;
    	  var parts = value.split("; " + name + "=");
    	  if (parts.length >= 2) return parts.pop().split(";").shift();
    };

    return DateUtils;
});

define( 'DS/ENOUserGroupMgmt/Utilities/Constants', 
		['UWA/Class'],
	function(Class){
	
	"use strict";
	
	var constants= Class.singleton({
		

		WELCOMEPANEL_ID_CREATE_USERGROUP : "new_usergroup",
		WELCOMEPANEL_ID_USERGROUPS: "userGroups",
		//WELCOMEPANEL_CONFIGURE_ACTION: "action_configure"
        
	});
	return constants;
});

/**
 * configuration required for the actions of welcome panel.
 */

 define('DS/ENOUserGroupMgmt/Config/WelcomePanelActionsConfig',
    ['DS/Core/Core',
     'UWA/Drivers/Alone',
     'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
     function(core, Alone, NLS) {

'use strict';

let WelcomePanelActionsConfig = {
     "userGroups": {
         id:"userGroups",
         content: 'summary_page',
         loader: {
             module: 'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
             func: 'build',
         }
     }, 
     "new_usergroup": {
         id:"new_usergroup",
         content: 'dialog',
         loader: {
             module: 'DS/ENOUserGroupMgmt/Views/Dialogs/InitiateUsersGroupDialog',
             func: 'InitiateUserGroupDialog',
         }
     }, 
};

return WelcomePanelActionsConfig;

});



/**
 * 
 *//* global define, widget */
/**
  * @overview UserGroup - Other UserGroup utilities
  * @licence Copyright 2006-2021 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENOUserGroupMgmt/Utilities/Utils',
[],
function() {
    'use strict';
    
    var Utils = {};
    Utils.getCookie = function (name) {
    	  var value = "; " + document.cookie;
    	  var parts = value.split("; " + name + "=");
    	  if (parts.length >= 2) return parts.pop().split(";").shift();
    };

    Utils.isValidDate = function (obj) {
        return UWA.is(obj, 'date') && !isNaN(obj.getTime());
      };

    Utils.formatDateTimeString = function (dateObj) {
      var dateString;
       // Display options for the date time formated string
      var intlOptions = {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: '2-digit'
          };
      if (!Utils.isValidDate(dateObj)) {
          dateString = '';
      } else {
          // The Intl API is currently not supported on Safari
          // nor in IE < 11 and and mobile browsers but Chrome mobile
          dateString = dateObj.toLocaleDateString(Utils.getCookie("swymlang"), intlOptions) +" "+ dateObj.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
      }
      return dateString;
  };

  Utils.activateInfoIcon = function(DataGridView){
		if(DataGridView.getGridViewToolbar()){
			let infoIcon = DataGridView.getGridViewToolbar().getNodeModelByID("information");
	    	if(infoIcon && infoIcon._associatedView.elements.container.querySelector('.wux-controls-button')){
	    		infoIcon._associatedView.elements.container.querySelector('.wux-controls-button').setStyle("color","rgb(54, 142, 196)");
	    	}
		}
	};
	
	Utils.inActivateInfoIcon = function(DataGridView){
		if(DataGridView.getGridViewToolbar()){
			let infoIcon = DataGridView.getGridViewToolbar().getNodeModelByID("information");
	    	if(infoIcon && infoIcon._associatedView.elements.container.querySelector('.wux-controls-button')){
	    		infoIcon._associatedView.elements.container.querySelector('.wux-controls-button').setStyle("color",'rgb(61, 61, 61)');
	    	}
		}
	};
	
	Utils.refreshRightPanel = function(info, Model, grid){
		
		if(widget.getValue("propWidgetOpen")){ 
			if(grid){  //This code will be executed if it's single click
				 let data = {};
		    	 data.model = grid;
		    	 widget.userGroupEvent.publish('usergroup-header-info-click', {model: data.model, info: info});
			}
			else if(Model && Model.getSelectedRowsModel().data.length == 1){ //if any row is selected, then show the selected row's data
				let data = {};
		    	data.model = Model.getSelectedRowsModel()["data"][0].options.grid;
				widget.userGroupEvent.publish('usergroup-header-info-click', {model: data.model, info: info});
			}
			else{ ////if multiple row/No row is selected, then show the empty view
				 if(Model && Model.getSelectedRowsModel().data.length > 1){
					widget.userGroupEvent.publish('usergroup-header-info-click', {info: info, multiRowSelect: true});
				} else if (Model && Model.getSelectedRowsModel().data.length == 0){
					widget.userGroupEvent.publish('usergroup-header-info-click', {info: info, noRowSelect: true});
				}
			}
		}
	};
  
    return Utils;
});

/**
 * 
 */

define('DS/ENOUserGroupMgmt/Components/Wrappers/SplitViewWrapper',
['DS/ENOXSplitView/js/ENOXSplitView','i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
function(ENOXSplitView,NLS) {

  'use strict';
  var ENOXSplitViewWrapper = ENOXSplitView;

  ENOXSplitViewWrapper.prototype.getLeftViewWrapper = function () {
    return UWA.extendElement(this.getLeft());
  }

  ENOXSplitViewWrapper.prototype.getRightViewWrapper = function () {
    return UWA.extendElement(this.getRight());
  }

  ENOXSplitViewWrapper.prototype.addRightPanelExpander = function () {
    if (this._rightPanel != null) {
      var showIcon = "fonticon-expand-left";
      var closer = UWA.createElement("div", {
        "class": "splitview-close fonticon "+showIcon,
        "id":"splitview-close",
        "title": NLS.homeRightPanelExpand,
        'styles': {
          'font-size': '20px'
        }
      });
      closer.inject(this._rightPanel);
      var me = this;
      closer.onclick = function (e) {
        me._hideSide("left");
        me._rightPanel.classList.remove("right-container-mobile-view");
        var expandLeft = document.querySelector('.splitview-close.fonticon-expand-left');
        if (expandLeft) {
          expandLeft.title = NLS.homeRightPanelCollapse;
          expandLeft.removeClassName('fonticon-expand-left');
          expandLeft.addClassName('fonticon-expand-right');
        } else {
          var expandRight = document.querySelector('.splitview-close.fonticon-expand-right');
          expandRight.title = NLS.homeRightPanelExpand;
          me._showSide("left");
          expandRight = UWA.extendElement(expandRight);
          expandRight.removeClassName('fonticon-expand-right');
          expandRight.addClassName('fonticon-expand-left');
        }
      }
    }
  }
  
  return ENOXSplitViewWrapper;

});

/**
 * 
 */
/**
    Class to create the spinner
    These spinners are used to indicate users that background processing is in work.
*/
define('DS/ENOUserGroupMgmt/Utilities/UserGroupSpinner', 
    [
        'DS/UIKIT/Mask'
    ],
    function (Mask
    ) {
    'use strict';
     /**
     * @lends module:RDYWebApp/js/component/RDYWaitSpinner.RDYWaitSpinner#
     */  
    var UserGroupSpinner = {
            /**
            * Indicates if a spinner was currently executed or not
            * @type integer
            */
            wait : false,
            /**
            * Indicates to keep active the spinner
            * @type integer
            */
            keepActive : false,
            /**
             * Indicates if call is from 3DSpace Env.
             * @type  integer 
             */
            is3DSpace : false,
            /**
            * Launch the wait spinner
            */
            doWait : function(target,msg) {
                 if ((UserGroupSpinner.keepActive === false) && (UserGroupSpinner.isWaiting())) {
                     UserGroupSpinner.endWait(target);
                 }
                 else if (UserGroupSpinner.isWaiting()) {
                     return;
                 }
                 Mask.mask(target, msg);
                 UserGroupSpinner.wait = true;
            },
            /**
            * End the wait spinner
            */
            endWait : function(target) {
                if (UserGroupSpinner.isWaiting()) {
                    Mask.unmask(target); 
                    UserGroupSpinner.wait = false;
                    UserGroupSpinner.keepActive = false;
                }
            },

            /* set3DSpace: function(is3DSpace){
                    UserGroupSpinner.is3DSpace =  is3DSpace;
             },

             if3DSpace: function(){
                 return UserGroupSpinner.is3DSpace;
             },*/

            /**
            * Indicates if a spinner was currently executed or not
            * @return true or false
            */
            isWaiting : function() {
                return UserGroupSpinner.wait;
            }
    };
    return UserGroupSpinner;
});

/* global define, widget */
/**
 * @overview User Group Management - Data formatter
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Utilities/DataFormatter',
		['DS/ENOUserGroupMgmt/Utilities/DateUtils',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
		],function(DateUtils, NLS) {
	'use strict';
	let DataFormatter;
	
	let gridData = function(dataElem){
		
		var visibility = "";
		if(dataElem.state==="Active"){
			visibility = "Public";
		}
		else {
			visibility = dataElem.state;
		}
		let modDate = new Date(dataElem.modified);
		var response =
		{
            title: dataElem.title,		                    
            description: dataElem.description,
            state: visibility,
            uri:dataElem.uri,
            owner:dataElem.owner,
			myGroup:dataElem.myGroup,
			members:dataElem.members,
			pid:dataElem.pid,
			ownerFullName:dataElem.ownerFullName,
			name:dataElem.name,
			id:dataElem.id,
			modified:modDate,
			memberList:dataElem.memberList,
			loginUserModifyAccess: dataElem.loginUserModifyAccess,
			loginUserRole: dataElem.loginUserRole
            
    	};
		return response;
	};
	
	let contentGridData = function(dataElem){
	    var response =
	    {
	        id: dataElem.id,
	        memberFullName: dataElem.label,
	        name:dataElem.identifier,
	        Actions:dataElem.Action,
	        Access: dataElem.newAccess,
			firstName: dataElem.firstName,
			lastName: dataElem.lastName,
			address: dataElem.address,
			city: dataElem.city,
			country: dataElem.country,
			emailAddress: dataElem.emailAddress
	    };
	    return response;
	};
	let memberGridData = function(dataElem){
	    var response =
	        {
	                id: dataElem.pid,
					name: dataElem.name,
					memberFullName:dataElem.ownerFullName,
					Actions:dataElem.Action,
	                Access: dataElem.newAccess,
					firstName: dataElem.firstName,
					lastName: dataElem.lastName,
					address: dataElem.address,
					city: dataElem.city,
					country: dataElem.country,
					emailAddress: dataElem.emailAddress
	        }
	    return response;
	};

	let useraccessrighsGridData = function(dataElem){
        var response =
            {
                    id: dataElem.id,
					name: dataElem.name,
					personName:dataElem.personName,
					Actions:dataElem.Action,
                    Role: dataElem.accessName,
                    RoleDisplay: dataElem.accessNameDisplay,
                    type: dataElem.type,
                    status: dataElem.status,
					firstName: dataElem.firstName,
					lastName: dataElem.lastName,
					address: dataElem.address,
					city: dataElem.city,
					country: dataElem.country,
					emailAddress: dataElem.emailAddress
            }
        return response;
    };
    DataFormatter={
    		gridData: (dataElem) => {return gridData(dataElem);},
			contentGridData: (dataElem) => {return contentGridData(dataElem);},
			useraccessrighsGridData: (dataElem) => {return useraccessrighsGridData(dataElem);},
			memberGridData: (dataElem) => {return memberGridData(dataElem);}
    };
    
    return DataFormatter;
});

/**
 * 
 *//* global define, widget */
/**
  * @overview UserGroup - ENOVIA Bootstrap file to interact with the platform
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
    [
        'UWA/Core',
        'UWA/Class/Collection',
        'UWA/Class/Listener',
        /*'UWA/Utils',*/
        'DS/ENOUserGroupMgmt/Utilities/Utils',
        'DS/PlatformAPI/PlatformAPI',
        'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
        'DS/WAFData/WAFData',
        'DS/ENOXWidgetPreferences/js/ENOXWidgetPreferences'
    ],
    function (
        UWACore,
        UWACollection,
        UWAListener,
        /*UWAUtils,*/
        Utils,
        PlatformAPI,
        CompassServices,
        WAFData,
        ENOXWidgetPreferences
    ) {
        'use strict';
        let _started = false, _frameENOVIA = false, _csrf, UserGroupBootstrap, _prefSwym, _pref3DSpace, _prefSearch, _isAdminUser = false, checkedForAdmin = false;

        async function initSearchServices() {
            if (_prefSearch) {
                return _prefSearch;
            }

            let platformId = widget.getValue("x3dPlatformId");

            return new Promise(resolve => {
                CompassServices.getServiceUrl({
                    serviceName: '3DSearch',
                    platformId: platformId,
                    onComplete: function (data) {
                        if (data) {
                            if (typeof data === "string") {
                                _prefSearch = data;
                            } else {
                                _prefSearch = data[0].url;
                            }
                        } else {
                            _prefSearch = '';
                        }
                        resolve(_prefSearch)
                    },
                    onFailure: function () {
                        _prefSearch = '';
                        resolve(_prefSearch)
                    }
                });
            })
        }
        async function initSwymServices() {
            if (_prefSwym) {
                return _prefSwym;
            }

            let platformId = widget.getValue("x3dPlatformId");

            return new Promise(resolve => {
                CompassServices.getServiceUrl({
                    serviceName: '3DSwym',
                    platformId: platformId,
                    onComplete: function (data) {
                        if (data) {
                            if (typeof data === "string") {
                                _prefSwym = data;
                            } else {
                                _prefSwym = data[0].url;
                            }
                        } else {
                            _prefSwym = '';
                        }
                        resolve(_prefSwym)
                    },
                    onFailure: function () {
                        _prefSwym = '';
                        resolve(_prefSwym)
                    }
                });
            })
        }

        async function init3DSpaceServices() {
            if (_pref3DSpace) {
                return _pref3DSpace;
            }

            let platformId = widget.getValue("x3dPlatformId");

            return new Promise(resolve => {
                CompassServices.getServiceUrl({
                    serviceName: '3DSpace',
                    platformId: platformId,
                    onComplete: function (data) {
                        if (typeof data === "string") {
                            _pref3DSpace = data;
                        } else {
                            _pref3DSpace = data[0].url;
                        }
                        resolve(_pref3DSpace)
                    },
                    onFailure: function () {
                        _pref3DSpace = '';
                        resolve(_pref3DSpace)
                    }
                });
            })
        }
        async function checkIsAdminUser () {

            if (checkedForAdmin) {
                return _isAdminUser;
            }

            return new Promise(resolve => {
                CompassServices.getUser({
                    onComplete: function (data) {
                        var platforms = data.platforms;

                        if (platforms && platforms.length > 0) {
                            platforms.forEach(function (platform) {
                                if (platform.id === widget.getValue("x3dPlatformId") && platform.role === 'admin') {
                                    _isAdminUser = true
                                }
                            });
                        }
                        checkedForAdmin = true;
                        resolve(_isAdminUser)
                    }
                });
            })
        }

        UserGroupBootstrap = //UWACore.merge(UWAListener, 
        {

            start: function (options) {
                return new Promise(async resolve => {
                    if (_started) {
                        resolve()
                        return;
                    }

                    let x3DContent = UWA.is(widget.getValue('X3DContentId'), 'string') ? JSON.parse(widget.getValue('X3DContentId')) : null;
                    if(x3DContent && x3DContent.data.items && (x3DContent.data.items[0].objectType === "Group")){
                        //widget.data.ids = x3DContent.data.items[0].objectId;
                        widget.setValue('openedUserGroupId', x3DContent.data.items[0].objectId);
                        widget.data.contentId = x3DContent.data.items[0].objectId; //Don't set as UserGroup id otherwise it will always load the specific UserGroup even after widget refresh
                        widget.setValue('X3DContentId', null); 
                    }

                    if (options.frameENOVIA) {
                        _frameENOVIA = true;
                    }

                    options = (options ? UWACore.clone(options, false) : {});
                    
                    await checkIsAdminUser();
                    await init3DSpaceServices();
                    await initSwymServices();
                    await initSearchServices();

                    _started = true;
                    resolve()
                })
            },

            authenticatedRequest: function (url, options) {
                let onComplete;
                let tenantId = widget.getValue('x3dPlatformId');
                url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'tenant=' + tenantId;
                if (UserGroupBootstrap.getSecurityContextValue()) {
                    url = url + '&SecurityContext=' + encodeURIComponent(UserGroupBootstrap.getSecurityContextValue());
                }
                if (widget.debugMode) {
                    url = url + '&$debug=true'
                }
                if (Utils.getCookie("swymlang")) {
                    url = url + '&$language=' + Utils.getCookie("swymlang");
                }

                onComplete = options.onComplete;

                options.onComplete = function (resp, headers, options) {
                    _csrf = headers['X-DS-CSRFTOKEN'];
                    if (UWACore.is(onComplete, 'function')) {
                        onComplete(resp, headers, options);
                    }
                };

                return WAFData.authenticatedRequest(url, options);
            },

            getLoginUser: function () {
                let user = PlatformAPI.getUser();
                if (user && user.login) {
                    return user.login;
                }
            },

            getLoginUserFullName: function () {
                let user = PlatformAPI.getUser();
                if (user && user.firstName) {
                    if (user.lastName) {
                        return user.firstName + " " + user.lastName;
                    } else {
                        return user.firstName;
                    }
                }
            },

            getSyncOptions: function () {
                if (_frameENOVIA) {
                    return {};
                } else {
                    let syncOptions = {
                        ajax: this.authenticatedRequest
                    };

                    return syncOptions;
                }
            },


            get3DSpaceURL: function () {
                if (_started) {
                    return _pref3DSpace;
                }
            },
            isAdminUser: function () {
                if (_started) {
                    return _isAdminUser;
                }
            },
            getUserGroupServiceBaseURL: function () {
                if (_started) {
                    return _pref3DSpace + '/resources/bps/application';
                }
            },
            getSwymUrl: function () {
                if (_started) {
                    return _prefSwym;
                }
            },
            getSearchUrl: function () {
                if (_started) {
                    return _prefSearch;
                }
            },
            getSecurityContextValue: function () {
                var securityContext = "";
                var credentialPrefName = ENOXWidgetPreferences.getCredentialPreferenceKey();
                if (widget.getValue("usergroup-userSecurityContext")) {
                    securityContext = widget.getValue("usergroup-userSecurityContext");
                } else if (widget.getValue(credentialPrefName)) {
                    securityContext = "ctx::" + widget.getValue(credentialPrefName);
                }
                return securityContext;
                
                
                
            }

        }
        //);

        return UserGroupBootstrap;
    });




define('DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
	['DS/DataGridView/DataGridView',
		'DS/CollectionView/CollectionViewStatusBar',
		'DS/DataGridView/DataGridViewLayout',
		'DS/Controls/Find',
		'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
		'DS/Utilities/Utils'
	],
	function(DataGridView, CollectionViewStatusBar, DataGridViewLayout, WUXFind, UserGroupBootstrap, Utils) {

		'use strict';

		let WrapperDataGridView, _dataGrid, _container, _toolbar, jsontoolbar, dummydiv;
		/*var layoutOptions =  { 
				rowsHeader: false
			} */
		let buildToolBar = function(jsonToolbar) {
			jsonToolbar = JSON.parse(jsonToolbar);
			_toolbar = _dataGrid.setToolbar(JSON.stringify(jsonToolbar));
			return _toolbar;
		};

		let initDataGridView = function(treeDocument, colConfig, toolBar, dummydiv) {
			//buildLayout();
			_dataGrid = new DataGridView({
				treeDocument: treeDocument,
				columns: colConfig,
				rowGroupingEnabledFlag: false,
				// layout: new DataGridViewLayout(layoutOptions),
				defaultColumnDef: {//Set default settings for columns
					widthd: 'auto',
					typeRepresentation: 'string'
				}
			});
			_dataGrid.layout.cellHeight = 35;
			_dataGrid.rowSelection = widget.readOnlyUG ? 'none' : 'multiple';
			_dataGrid.cellActivationFeedback = widget.readOnlyUG ? false : true;
			_dataGrid.cellSelection = 'none';
			_dataGrid.getContent().style.top = '50 px';
			if (toolBar) {
				buildToolBar(toolBar);
			}
			if (widget.readOnlyUG) {
				_dataGrid.buildStatusBar([{
					type: CollectionViewStatusBar.STATUS.NB_ITEMS
				}
				]);
			}
			else {
				_dataGrid.buildStatusBar([{
					type: CollectionViewStatusBar.STATUS.NB_ITEMS
				}, {
					type: CollectionViewStatusBar.STATUS.NB_SELECTED_ROWS
				}
				]);
			}
			setReusableComponents();
			_dataGrid.inject(dummydiv);
			return dummydiv;
		};



		let dataGridView = function() {
			return _dataGrid;
		};

		let setReusableComponents = function() {
			_dataGrid.registerReusableCellContent({
				id: '_actions_',
				buildContent: function() {
					let commandsDiv = UWA.createElement('div');
					UWA.createElement('span', {
						"html": "",
						"class": "usergroup-state-title "
					}).inject(commandsDiv);
					return commandsDiv;
				}
			});
			_dataGrid.registerReusableCellContent({
				id: '_modified_',
				buildContent: function() {
					let commandsDiv = UWA.createElement('div');
					UWA.createElement('span', {
						"html": "",
						"class": ""
					}).inject(commandsDiv);
					return commandsDiv;
				}
			});

			_dataGrid.registerReusableCellContent({
				id: '_memeberfullname_',
				buildContent: function() {
					var responsible = new UWA.Element('div', {
						'id': 'User-Owner-responsible',
					});
					var owner = new UWA.Element("div", {
						class: 'assignee'
					});
					var ownerIcon = "";
					if (UserGroupBootstrap.getSwymUrl() != undefined && UserGroupBootstrap.getSwymUrl() != '') {
						ownerIcon = UWA.createElement('img', {
							class: "userIcon",
						});
					} else {
						ownerIcon = UWA.createElement('div', {
							html: "",
							class: "avatarIcon"
						});
					}
					ownerIcon.inject(owner);
					let askRTOwner = UWA.createElement('span', {
						class: 'askRTOwnerDiv wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-user-clock',
						html: ""
					}).inject(owner);
					askRTOwner.setStyle('display', 'none');
					var ownerName;
					if(widget.ugMgmtMediator == 'undefined' || !widget.ugMgmtMediator ) {
						ownerName = UWA.createElement('div', {
							class: 'userName',
							html: ""
						});
					} else if (typeof (dscef) == 'undefined') {
						ownerName = UWA.createElement('a', {
							class: 'userName',
							html: ""
						});
					}
					else {
						ownerName = UWA.createElement('div', {
							class: 'userName',
							html: ""
						});
					}
					owner.inject(responsible);
					ownerName.inject(responsible);
					return responsible;
				}
			});

		};

		let getSelectedRowsModel = function(treeDocumentModel) {
			var selectedDetails = {};
			var details = [];
			var children = treeDocumentModel.getSelectedNodes();
			for (var i = 0; i < children.length; i++) {
				//details.push(children[i].options.grid);
				details.push(children[i]);
			}
			selectedDetails.data = details;
			return selectedDetails;
		};

		/* let deleteRowModelByIndex = function(treeDocumentModel,index){
			 var indexRow = treeDocumentModel.getNthRoot(index);
			 if(indexRow){
				 treeDocumentModel.prepareUpdate();	
				 treeDocumentModel.removeRoot(indexRow);
				 treeDocumentModel.pushUpdate();
			 }		
		 };*/

		/*let deleteRowModelSelected = function(treeDocumentModel){
			let selctedIds= [];
			var selRows = treeDocumentModel.getSelectedNodes();
			treeDocumentModel.prepareUpdate();	
			for (var index = 0; index < selRows.length; index++) {
				treeDocumentModel.removeRoot(selRows[index]);
				selctedIds.push(selRows[index].options.id);
			}
			treeDocumentModel.pushUpdate();
			return selctedIds;
		};*/

		/*let deleteRowModelById = function(treeDocumentModel,id){
			var children = treeDocumentModel.getChildren();
			for(var i=0;i<children.length;i++){
				if(children[i].options.id == id){
					treeDocumentModel.prepareUpdate();	
					treeDocumentModel.removeRoot(children[i]);
					treeDocumentModel.pushUpdate();
				}
			}
		};*/

		let deleteRowModelByIds = function(treeDocumentModel, ids) {
			var children = treeDocumentModel.getChildren();
			var childrenToDelete = [];
			for (var i = 0; i < children.length; i++) {
				if (ids.includes(children[i].options.grid.uri)) {
					childrenToDelete.push(children[i]);
				}
			}
			childrenToDelete.forEach(function(element) {
				treeDocumentModel.prepareUpdate();
				treeDocumentModel.removeRoot(element);
				treeDocumentModel.pushUpdate();
			});

		};

		let getRowModelById = function(treeDocumentModel, id) {
			var children = treeDocumentModel.getChildren();
			for (var i = 0; i < children.length; i++) {
				if (children[i].options.id == id || children[i].options.grid.pid == id) {
					return children[i];
				}
			}
		};

		/*let getRowModelIndexById = function(treeDocumentModel,id){
			var children = treeDocumentModel.getChildren();
			for(var i=0;i<children.length;i++){
				if(children[i].options.id == id){
					return i;
				}
			}
		};*/

		let getRowModelByURI = function(treeDocumentModel, id) {
			var children = treeDocumentModel.getChildren();
			if (id != undefined && id.indexOf("<") > -1) {
				id = id.replace("<", "");
				id = id.replace(">", "");
			}
			for (var i = 0; i < children.length; i++) {
				let uri = children[i].options.grid.uri;
				if (uri != undefined && uri.indexOf("<") > -1) {
					uri = uri.replace("<", "");
					uri = uri.replace(">", "");
				}
				if (uri == id) {
					return children[i];
				}
			}
		};

		/*let showFind = function () {

			let findParent = _toolbar.elements.container;
			const findSpan = findParent.querySelector(
				'.wux-controls-toolbar-mask-container .wux-tweakers .wux-ui-3ds-search'
			);
			const parent = findSpan.parentElement.parentElement;
			if (parent && parent.classList.contains('wux-controls-button')) {
				findParent = parent;
			} else {
				findParent = findSpan;
			}

			if (!_dataGrid.findWidget) {
				new WUXFind({
					displayMatchCaseToggle: true,
					relatedWidget: _dataGrid,
					onFindRequest: _dataGrid.setFindStr,
					onFindPreviousResult: _dataGrid.goToPreviousMatchingCell,
					onFindNextResult: _dataGrid.goToNextMatchingCell,
					onFindClose: _dataGrid.closeFind
				}).inject(_toolbar.elements.container);
				if (_toolbar.elements.container.offsetWidth < 290) {
					_dataGrid.findWidget.getContent().style.right = "0";
				}
				else if (_toolbar.elements.container.offsetWidth < 340) {
					_dataGrid.findWidget.getContent().style.right = "16%";
				} else {
					_dataGrid.findWidget.getContent().style.right = "130px";
				}
				//_dataGrid.findWidget.getContent().style.bottom = "-5px";
				_dataGrid.findWidget.getContent().style.position = "absolute";
				_dataGrid.findWidget.getContent().style.height = "30px";
				_dataGrid.findWidget.getContent().getChildren()[0].style.height = "30px";
			} else {
				_dataGrid.findWidget.visibleFlag = true;
			}
			Utils.setConstrainedPosition(_dataGrid.findWidget, findParent, {
				position: 'left',
				alignment: 'near',
				offset: {
					y: '52px',
					x: '-10px',
				}
			});
			_dataGrid.findWidget.focus();
		};
	    
		let printGrid = () => {
			_dataGrid.openPrintableViewWindow(true);
		};*/

		WrapperDataGridView = {
			build: (treeDocument, colConfig, toolBar, dummydiv) => { return initDataGridView(treeDocument, colConfig, toolBar, dummydiv); },
			dataGridView: () => { return dataGridView(); },
			destroy: function() { _dataGrid.destroy(); if (_container && _container.destroy) _container.destroy(); },
			dataGridViewToolbar: () => { return _toolbar; },
			getSelectedRowsModel: (treeDocumentModel) => { return getSelectedRowsModel(treeDocumentModel); },
			/*deleteRowModelByIndex: (treeDocumentModel,index) => {return deleteRowModelByIndex(treeDocumentModel,index);},
			deleteRowModelSelected: (treeDocumentModel) => {return deleteRowModelSelected(treeDocumentModel);},
			deleteRowModelById: (treeDocumentModel,id) => {return deleteRowModelById(treeDocumentModel,id);},*/
			deleteRowModelByIds: (treeDocumentModel, ids) => { return deleteRowModelByIds(treeDocumentModel, ids); },
			getRowModelById: (treeDocumentModel, id) => { return getRowModelById(treeDocumentModel, id); },
			getRowModelByURI: (treeDocumentModel, id) => { return getRowModelByURI(treeDocumentModel, id); },
			//getRowModelIndexById: (treeDocumentModel,id) => {return getRowModelIndexById(treeDocumentModel,id);}
			//showFind: () => {return showFind();},
			//printGrid: () => {return printGrid();}
		};

		return WrapperDataGridView;

	});

/**
 * 
 */
define('DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
		[
			'UWA/Class/Model',
			'DS/TreeModel/TreeDocument',
			'DS/TreeModel/TreeNodeModel',
			'DS/TreeModel/DataModelSet',
			'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
		    'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
		    'DS/WebappsUtils/WebappsUtils',
		    'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
			'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
		],
		function(Model, TreeDocument, TreeNodeModel, DataModelSet,  WrapperDataGridView,
	            DataFormatter,
	            WebappsUtils,
	            RequestUtils,
	            NLS) {
				'use strict';
				let usergroupInfo = {
						
				};
				let model = new TreeDocument();
			
				let prepareTreeDocumentModel = function(response,userGroupInfo){
					model.prepareUpdate(); 
					var obj = JSON.parse(response);		
					obj.forEach(function(dataElem) {
						if("TRUE"==dataElem.display) {
							var thumbnailIcon,typeIcon,nameLabel;
							// thumbnailIcon=onMemberNodeAssigneesCellRequest(dataElem.fullname,dataElem.userName);
							// UG105941  : pass full name and name
							if(dataElem.type=="Group" && dataElem.status=="Active"){
								thumbnailIcon = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png');   
								typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_PublicUserGroup22.png");
							} else if(dataElem.type=="Group" && dataElem.status=="Private") {
								thumbnailIcon = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroupTile.png');
								typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_PrivateUserGroup22.png");
							} else {
								thumbnailIcon = onMemberNodeAssigneesCellRequest(dataElem.personName,dataElem.name);    
								typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_Person16.png");
							}
							var subLableValue= "";
							if(dataElem.accessName=="Owner")  {
								subLableValue = NLS.AccessRights_AddMembers_OwnerRole;
							} else if(dataElem.accessName=="Manager") {
								subLableValue = NLS.AccessRights_AddMembers_ManagerRole;
							} else if(dataElem.accessName=="Viewer") {
								subLableValue = NLS.AccessRights_AddMembers_ViewerRole;
							}
							dataElem.accessNameDisplay=subLableValue;
							var root = new TreeNodeModel({
								label: dataElem.personName,
								id: dataElem.id,
								width: 300,
								grid: DataFormatter.useraccessrighsGridData(dataElem),
								"thumbnail" : thumbnailIcon,
								"subLabel": subLableValue,
								//icons : [typeIcon],
								contextualMenu : [NLS.ContextMenu]
							});
				
							model.addRoot(root);
						}
					});
					model.pushUpdate();
					return model;
				};
				let appendRows = function(response){
					model.prepareUpdate();	
					var thumbnailIcon,typeIcon;
					let dataElem = response.data;
					let dataResult = response.result;
										
					dataElem.forEach((elem) => {
						if(dataElem.type=="Group" && dataElem.status=="Active"){
							thumbnailIcon = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png');   
							typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_PublicUserGroup22.png");
						} else if(dataElem.type=="Group" && dataElem.status=="Private") {
							thumbnailIcon = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroupTile.png');
							typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_PrivateUserGroup22.png");
						} else {
							thumbnailIcon = onMemberNodeAssigneesCellRequest(elem.personName,elem.name);    
							typeIcon = WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_Person16.png");
						}
						var subLableValue= "";
						if(elem.accessName=="Owner")  {
							subLableValue = NLS.AccessRights_AddMembers_OwnerRole;
						} else if(elem.accessName=="Manager") {
							subLableValue = NLS.AccessRights_AddMembers_ManagerRole;
						} else if(elem.accessName=="Viewer") {
							subLableValue = NLS.AccessRights_AddMembers_ViewerRole;
						}
									
						dataResult.forEach((resultElements) => {
							if(resultElements.name ==elem.name) {
								elem.firstName=resultElements.firstName
								elem.lastName=resultElements.lastName
								elem.address=resultElements.address
								elem.country=resultElements.country
								elem.city=resultElements.city
								elem.emailAddress=resultElements.emailAddress
							}
						})
						elem.accessNameDisplay=subLableValue;
						var root = new TreeNodeModel({
							label: elem.personName,
							id: elem.id,
							width: 300,
							grid: DataFormatter.useraccessrighsGridData(elem),
							"thumbnail" : thumbnailIcon,
							"subLabel": subLableValue,
							//icons : [typeIcon],
							contextualMenu : [NLS.ContextMenu]
			
						});
			
						model.addRoot(root);
					});
			
					model.pushUpdate();
					if(model.getChildren().length!=0 && document.querySelector('.no-accessrights-to-show-container')!=null){
						if(widget.ugMgmtMediator){
							widget.ugMgmtMediator.publish('hide-no-accessrights-placeholder');
						}else{
							ugSyncEvts.ugMgmtMediator.publish('hide-no-accessrights-placeholder');
						}
					}
			
				};
			
				let onMemberNodeAssigneesCellRequest= function (name,userName) {
			
			
					var ownerIconURL = "/api/user/getpicture/login/"+userName+"/format/normal";
					var swymOwnerIconUrl = RequestUtils.populate3DSpaceURL.swymURL+ownerIconURL;               
					var responsible = new UWA.Element("div", {});
					var owner = new UWA.Element("div", {
						class:'assignee'
					});
					var ownerIcon = "";
					if(RequestUtils.populate3DSpaceURL.swymURL!=undefined){
						ownerIcon = UWA.createElement('img', {
							class: "member-userIcon",
							src: swymOwnerIconUrl
						});
					} else {
						var iconDetails = getAvatarDetails(name);
						ownerIcon = UWA.createElement('div', {
							html: iconDetails.avatarStr,
							"title": name,
							class: "member-avatarIcon"
						});
						ownerIcon.style.setProperty("background",iconDetails.avatarColor);
					}
			
					return ownerIcon;
				};
			
			
				let getAvatarDetails= function (name) {
					var options = {};
					var backgroundColors = [
						[7, 139, 250],
						[249, 87, 83],
						[111, 188, 75],
						[158, 132, 106],
						[170, 75, 178],
						[26, 153, 123],
						[245, 100, 163],
						[255, 138, 46],
						]
					var initials = name.match(/\b\w/g);
					var firstLetter = initials[0].toUpperCase();
					var lastLetter = initials[initials.length - 1].toUpperCase();
			
					var avatarStr = (firstLetter + lastLetter);
			
					var i = Math.ceil((firstLetter.charCodeAt(0) + lastLetter.charCodeAt(0)) % backgroundColors.length);
					var avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";
			
					options.name = name;
					options.avatarStr = avatarStr;
					options.avatarColor = avatarColor;
			
					return options;
				};
			
				let updateRow = function(dataElem,grid){ 
					if(dataElem.data && dataElem.data[0]!=""){
						var updatedRole = dataElem.data[0].accessName;
						var rowModelToUpdate = WrapperDataGridView.getSelectedRowsModel(model);
						if(rowModelToUpdate == undefined || rowModelToUpdate.data[0] == undefined){
							rowModelToUpdate.data.push(WrapperDataGridView.getRowModelById(model,grid.id));
						}
						var orgGrid= rowModelToUpdate.data[0].options.grid;
						orgGrid.Role=updatedRole;
						var subLableValue= "";
						if(updatedRole=="Owner")  {
							subLableValue = NLS.AccessRights_AddMembers_OwnerRole;
						} else if(updatedRole=="Manager") {
							subLableValue = NLS.AccessRights_AddMembers_ManagerRole;
						} else if(updatedRole=="Viewer") {
							subLableValue = NLS.AccessRights_AddMembers_ViewerRole;
						}
						orgGrid.RoleDisplay=subLableValue;
						// Update the grid content //
						rowModelToUpdate.data[0].updateOptions({grid:orgGrid});
						// Update the tile content //
						rowModelToUpdate.data[0].updateOptions(
								{
									"subLabel": subLableValue,
								});
					}
			
				};
				let destroy = function(){
					model = new TreeDocument();
				};
			
				let deleteSelectedRows = function(){
					var selRows = model.getSelectedNodes();
					model.prepareUpdate();	
					for (var index = 0; index < selRows.length; index++) {
						model.removeRoot(selRows[index]);
					}
					model.pushUpdate();
					if(model.getChildren().length==1) {
						var rowModelToUpdate = model.getChildren()[0];
						var thumbnailIcon = onMemberNodeAssigneesCellRequest(rowModelToUpdate.options.grid.personName,rowModelToUpdate.options.grid.name);
						rowModelToUpdate.updateOptions(
								  {
									  "thumbnail": thumbnailIcon
								  });
					}
					if(model.getChildren().length==0){
						if(widget.ugMgmtMediator){
							widget.ugMgmtMediator.publish('show-no-accessrights-placeholder');
						}else{
							ugSyncEvts.ugMgmtMediator.publish('show-no-accessrights-placeholder');
						}
					}
				};
				
				let deleteSelectedRowsExceptContextUser = function(){
					var selRows = model.getSelectedNodes();
					model.prepareUpdate();	
					for (var index = 0; index < selRows.length; index++) {
						if((selRows[index].options.grid.name != RequestUtils.contextUser)||(usergroupInfo.model.owner == RequestUtils.contextUser && selRows[index].options.grid.name == RequestUtils.contextUser)){
							model.removeRoot(selRows[index]);
						}
					}
					model.pushUpdate();
					if(model.getChildren().length==1) {
						var rowModelToUpdate = model.getChildren()[0];
						var thumbnailIcon = onMemberNodeAssigneesCellRequest(rowModelToUpdate.options.grid.personName,rowModelToUpdate.options.grid.name);
						rowModelToUpdate.updateOptions(
								  {
									  "thumbnail": thumbnailIcon
								  });
					}
					if(model.getChildren().length==0){
						if(widget.ugMgmtMediator){
							widget.ugMgmtMediator.publish('show-no-accessrights-placeholder');
						}else{
							ugSyncEvts.ugMgmtMediator.publish('show-no-accessrights-placeholder');
						}
					}
				};
				
				let setContextUGInfo = function(ugInfo){
					usergroupInfo = ugInfo;
				};
			
				let getMemberIDs = function(){
					if( model!= undefined){
						var children = model.getChildren();
						var id=[];
						for(var i=0;i<children.length;i++){
							id.push(children[i]._options.grid.id);
						}
						return id;
					}
				};			
				let UserGroupAccessRightsModel = {
						createModel : (response,userGroupInfo) => {return prepareTreeDocumentModel(response,userGroupInfo);},
						getModel : () => {return model;},
						appendRows : (data) => {return appendRows(data);},
						getSelectedRowsModel : () => {return WrapperDataGridView.getSelectedRowsModel(model);},
						deleteSelectedRows : () => {return deleteSelectedRows();},
						updateRow : (data,grid) => {return updateRow(data,grid);},
						destroy : () => {return destroy();},
						getMemberIDs: () => {return getMemberIDs();},
						deleteSelectedRowsExceptContextUser: () => {return deleteSelectedRowsExceptContextUser();},
						setContextUGInfo :(ugInfo) => {return setContextUGInfo(ugInfo);},
						usergroupInfo:()=>{return usergroupInfo; }
				}
				return UserGroupAccessRightsModel;
});

/* global define, widget */
/**
  * @overview User group Management - user group Model
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
[
    'DS/TreeModel/TreeDocument',
    'DS/TreeModel/TreeNodeModel',
    'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
    'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
    'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
    'DS/WebappsUtils/WebappsUtils',
    'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],
    function(
            TreeDocument,
            TreeNodeModel,
            WrapperDataGridView,
            DataFormatter,
            RequestUtils,
            WebappsUtils,
            NLS
    ) {
    'use strict';
    let model = new TreeDocument();
    let prepareTreeDocumentModel = function(response,userGroupInfo){
		//alert("rr");
        var userGroupState=userGroupInfo.model.Maturity_State;
        model.prepareUpdate(); 
		var obj = JSON.parse(response);		
        obj["data"].forEach(function(dataElem) {
			 var _contextualMenu=[];
           
            var thumbnailIcon,typeIcon;
			// thumbnailIcon=onMemberNodeAssigneesCellRequest(dataElem.fullname,dataElem.userName);
			thumbnailIcon=onMemberNodeAssigneesCellRequest(dataElem.ownerFullName,dataElem.name);    
			typeIcon=WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_Person16.png");
            var root = new TreeNodeModel({
                label: dataElem.ownerFullName,
                id: dataElem.pid,
                width: 300,
				grid: DataFormatter.memberGridData(dataElem),
				thumbnail : thumbnailIcon,
				//icons : [typeIcon],
				contextualMenu : [NLS.ContextMenu]
            });
                                                                            
            model.addRoot(root);
        });
        model.pushUpdate();
        return model;
    };
    let appendRows = function(dataElem){
		model.prepareUpdate();	
		var thumbnailIcon,typeIcon;
		
		dataElem.forEach((elem) => {
			thumbnailIcon=onMemberNodeAssigneesCellRequest(elem.label, elem.identifier);
			typeIcon=WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_Person16.png");
			var root = new TreeNodeModel({
                label: elem.label,
                id: elem.id,
                width: 300,
                grid: DataFormatter.contentGridData(elem),
  	          	thumbnail : thumbnailIcon,
  	          	//icons : [typeIcon],
  	          	contextualMenu : [NLS.ContextMenu]

        	});
      																		
			model.addRoot(root);
		});
		
		model.pushUpdate();
		if(model.getChildren().length!=0){
			if(widget.ugMgmtMediator){
				widget.ugMgmtMediator.publish('hide-no-members-placeholder');
			}else{
				ugSyncEvts.ugMgmtMediator.publish('hide-no-members-placeholder');
			}
		   
        }

	};
	
    let onMemberNodeAssigneesCellRequest= function (name,userName) {
        
        
          var ownerIconURL = "/api/user/getpicture/login/"+userName+"/format/normal";
          var swymOwnerIconUrl =RequestUtils.populate3DSpaceURL.swymURL+ownerIconURL;               
          var responsible = new UWA.Element("div", {});
          var owner = new UWA.Element("div", {
            class:'assignee'
          });
          var ownerIcon = "";
          if(RequestUtils.populate3DSpaceURL.swymURL!=undefined){
            ownerIcon = UWA.createElement('img', {
                class: "member-userIcon",
                src: swymOwnerIconUrl
            });
          } else {
            var iconDetails = getAvatarDetails(name);
            ownerIcon = UWA.createElement('div', {
                  html: iconDetails.avatarStr,
                  "title": name,
                  class: "member-avatarIcon"
              });
            ownerIcon.style.setProperty("background",iconDetails.avatarColor);
          }

        return ownerIcon;
    };
 
                              
    let getAvatarDetails= function (name) {
        var options = {};
        var backgroundColors = [
          [7, 139, 250],
          [249, 87, 83],
          [111, 188, 75],
          [158, 132, 106],
          [170, 75, 178],
          [26, 153, 123],
          [245, 100, 163],
          [255, 138, 46],
        ]
        var initials = name.match(/\b\w/g);
        var firstLetter = initials[0].toUpperCase();
        var lastLetter = initials[initials.length - 1].toUpperCase();

        var avatarStr = (firstLetter + lastLetter);

        var i = Math.ceil((firstLetter.charCodeAt(0) + lastLetter.charCodeAt(0)) % backgroundColors.length);
        var avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";

        options.name = name;
        options.avatarStr = avatarStr;
        options.avatarColor = avatarColor;

        return options;
      };
    
      let updateRow = function(dataElem){ 
          if(dataElem.model.id && dataElem.model.id != ""){
              var dispValue = 'role.'+ dataElem.model.Access.replace(' ','').toLowerCase();
              var rowModelToUpdate = WrapperDataGridView.getSelectedRowsModel(model);
              var orgGrid= rowModelToUpdate.data[0].options.grid;
              orgGrid.Access=dispValue;
              orgGrid.AccessNLS=NLS[dispValue];              
              // Update the grid content //
              rowModelToUpdate.data[0].updateOptions({grid:orgGrid});
              // Update the tile content //
              rowModelToUpdate.data[0].updateOptions(
                      {
                          "subLabel": NLS[dispValue]
                      });
          }
          
      };
    let destroy = function(){
    	model = new TreeDocument();
    };
    
	let deleteSelectedRows = function(){
		var selRows = model.getSelectedNodes();
		model.prepareUpdate();	
		 for (var index = 0; index < selRows.length; index++) {
			 model.removeRoot(selRows[index]);
		 }
		model.pushUpdate();
		if(model.getChildren().length>0) {
			var rowModelToUpdate = model.getChildren()[0];
			var thumbnailIcon = onMemberNodeAssigneesCellRequest(rowModelToUpdate.options.grid.memberFullName,rowModelToUpdate.options.grid.name);
			rowModelToUpdate.updateOptions(
                      {
                          "thumbnail": thumbnailIcon
                      });
		}
		if(model.getChildren().length==0){
			if(widget.ugMgmtMediator){
				widget.ugMgmtMediator.publish('show-no-members-placeholder');
			}else{
				ugSyncEvts.ugMgmtMediator.publish('show-no-members-placeholder');
			}
        }
	};
	let setContextUGInfo = function(ugInfo){
		usergroupInfo = ugInfo;
	};

	let usergroupInfo = {
			
	};  
	let getMemberIDs = function(){
		if( model!= undefined){
			var children = model.getChildren();
			var id=[];
			for(var i=0;i<children.length;i++){
				id.push(children[i]._options.grid.id);
			}
			return id;
		}
	};
    let UserGroupMemberModel = {
    		createModel : (response,userGroupInfo) => {return prepareTreeDocumentModel(response,userGroupInfo);},
    		getModel : () => {return model;},
    		appendRows : (data) => {return appendRows(data);},
    		getMemberIDs: () => {return getMemberIDs();},
    		getSelectedRowsModel : () => {return WrapperDataGridView.getSelectedRowsModel(model);},
    		deleteSelectedRows : () => {return deleteSelectedRows();},
            updateRow : (data) => {return updateRow(data);},
            destroy : () => {return destroy();},
            setContextUGInfo :(ugInfo) => {return setContextUGInfo(ugInfo);},
			usergroupInfo:()=>{return usergroupInfo; }
    }
    return UserGroupMemberModel;

});

/* global define, widget */
/**
 * @overview User Group Management - ENOVIA Bootstrap file to interact with the platform
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Services/UserGroupServices',
        [
         'UWA/Class/Promise',
         'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
         'UWA/Core',
         'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
         'DS/WAFData/WAFData',
         ],
         function(
                 Promise,
                 RequestUtils,
                 UWACore,
                 UserGroupBootstrap,
                 WAFData
         ) {
    'use strict';  

    let UGServices,_switchuserAccess,_revokeAccessFromUserGroup, _fetchAllGroups,_fetchAndConnectUserGroup,_changeVisibility,_createUserGroups,_duplicateUserGroup, _updateState, _deleteUserGroups, _fetchUGMembers,_addMembersToGroup,_fetchUserGroupById,_removeMembersFromUserGroup, _removeMembersMultipleGroups, _addMembersMultipleGroups, _fetchUserGroupAccessRights, _filterUserGroups, _addAccessRightssToGroup, _makeWSCall;
    _fetchAllGroups = function(){
        return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/bps/application/usergroups";
            let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/usergroups";
			
            let options = {};
            options.method = 'GET';
            options.timeout=0; 
            options.headers = {
                    'Content-Type' : 'application/ds-json'
            };

            options.onComplete = function(serverResponse) {
				
                resolve(serverResponse);
            };	

            options.onFailure = function(serverResponse,respData) {
            	if(respData){
                reject(respData);
             	}else{
             		reject(serverResponse);
             	}
            };

            //WAFData.authenticatedRequest(postURL, options);	
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
	
	_createUserGroups =function(args){

		
        return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/modeler/pno/group";
            let postURL=UserGroupBootstrap.get3DSpaceURL()+"/resources/modeler/pno/group";
			
			var obj = new Object();
			   obj.title = args.title;
			   obj.description = args.description;
			   obj.visibility = args.visibility;
 
            var a = new Array();
            a[0] = obj;
			
			var obj2 =new Object();
			obj2.groups = a;
			
            var jsonString= JSON.stringify(obj2);
			
            let options = {};
            options.method = 'POST';
            options.timeout=0;
            options.data = jsonString
            options.headers = {
                    'Content-Type' : 'application/ds-json',
					'SecurityContext': RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
			
			

            options.onComplete = function(serverResponse) {
				
                resolve(serverResponse);
            };	

            options.onFailure = function(serverResponse,respData) {
            	if(respData){
					var respData =JSON.parse(respData)
					reject(respData);
             	}else{
					var serverResponse =JSON.parse(serverResponse)
             		reject(serverResponse);
             	}
            };

            //WAFData.authenticatedRequest(postURL, options);	
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    _deleteUserGroups = function(ids){
    	return new Promise(function(resolve, reject) {
		//
		var id;
		
		for(let i=0;i<ids.length;i++){
				 id =  ids[i];
				 id = id.replace("<","");
					id = id.replace(">","");
					
					//let postURL= "../../resources/modeler/pno/group/"+id;
					let postURL=UserGroupBootstrap.get3DSpaceURL()+"/resources/modeler/pno/group/"+id;
		            let options = {};
		            options.method = 'DELETE';
		            options.headers =  {
		                    'SecurityContext':RequestUtils.SecurityContext,
							'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
		            };

		            options.onComplete = function(serverResponse) {
		                resolve(serverResponse);
		            };	

		            options.onFailure = function(serverResponse, respData) {
		            	 if(respData){
		             		reject(respData);
		             	}else{
		                reject(serverResponse);
		             	}
		            };

		            //WAFData.authenticatedRequest(postURL, options);
		            UserGroupBootstrap.authenticatedRequest(postURL, options);	
			}
			
			
    	});
      
    };
    
    
    
    _duplicateUserGroup =function(model){

		
        return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/bps/application/duplicate";
            let postURL= UserGroupBootstrap.getUserGroupServiceBaseURL()+"/duplicate";
			
			//model is a json object
			let jsonArr = [model];
			var requestdata ={"data": jsonArr};
			
            var jsonString= JSON.stringify(requestdata);
            //need to pass an array of json objects, stringified, as post request data
            //the json array itself is a value of a key, preferably 'groups' in this module
			
            let options = {};
            options.method = 'POST';
            options.timeout=0; 
            options.headers = {
                    'Content-Type' : 'application/ds-json',
					'SecurityContext': RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
			options.data = jsonString,
			

            options.onComplete = function(serverResponse) {
				
                resolve(serverResponse);
            };	

            options.onFailure = function(serverResponse,respData) {
            	if(respData){
					var respData =JSON.parse(respData)
					reject(respData);
             	}else{
					var serverResponse =JSON.parse(serverResponse)
             		reject(serverResponse);
             	}
            };

            //WAFData.authenticatedRequest(postURL, options);	
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    

	
	_fetchUGMembers = function(grpUID){
        return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/bps/application/"+grpUID+ "/members";
            let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+encodeURIComponent(grpUID)+ "/members";
            let options = {};
            options.method = 'GET';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext
            };

            options.onComplete = function(serverResponse) {
                resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    _removeMembersFromUserGroup = function (that,data) {
    	
    	return new Promise(function(resolve, reject) {
            var details = {};
            var selectedContentItemsDetails = [];
            var id;
            for (var i = 0; i < data.length; i++) { 
            	id =  data[i];
                selectedContentItemsDetails.push(data);

            }
			
			var uidVal = that.TreedocModel.UserGroupId;
			uidVal = uidVal.replace("<","");
			uidVal = uidVal.replace(">","");
           
			 var url = "";
	            
	            if(RequestUtils.isAdmin) {
	            	//url = '../../resources/modeler/pno/group/'+ uidVal;
	            		url = UserGroupBootstrap.get3DSpaceURL()+"/resources/modeler/pno/group/"+ uidVal;
	    		}
	            else {
	            	//url = '../../resources/bps/application/'+ that.TreedocModel.UserGroupPID;
	            		url = UserGroupBootstrap.getUserGroupServiceBaseURL()+ "/" + that.TreedocModel.UserGroupPID;
	            }
           
            var selectedContentItemsData = new Array();
            for (var i = 0; i < data.length; i++) { 
                var d = {
                        "op" : "remove",  
                        "field" : "members",  
                        "value" : data[i]
                }
                selectedContentItemsData.push(d);
            }
            var requestData = {
                   "data" : selectedContentItemsData
            };
            var options = {};
            options = UWACore.extend(options, RequestUtils.getSyncOptions(), true);
            options.method = 'PATCH';
            options.type = 'json';
            options.headers = {
                    'SecurityContext' : RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
            options.data = JSON.stringify(selectedContentItemsData);
            options.onComplete = function(serverResponse) {
            	serverResponse.data = data;
            	serverResponse.action = "remove";
            	resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(url, options);
            UserGroupBootstrap.authenticatedRequest(url, options);
        });
    	
    	
    };
    
    _removeMembersMultipleGroups = function(groupDetails,memberIdsList){
		return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/bps/application/usergroups/updateMembers";
            let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+"usergroups/updateMembers";
            
            let dataArray = {
				'groups': groupDetails,
				'members': memberIdsList,
				'op': 'remove'
			}
            let options = {};
            options.method = 'PUT';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
            
            options.data = JSON.stringify(dataArray);

            options.onComplete = function(serverResponse) {
				let resp = JSON.parse(serverResponse)
				resp.action = "remove";
                resolve(resp);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
	};
	
    _addMembersMultipleGroups = function(groupDetails,memberIdsList){
		return new Promise(function(resolve, reject) {
            //let postURL= "../../resources/bps/application/usergroups/updateMembers";
            let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+"usergroups/updateMembers";
            
            let dataArray = {
				'groups': groupDetails,
				'members': memberIdsList,
				'op': 'add'
			}
            let options = {};
            options.method = 'PUT';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
            
            options.data = JSON.stringify(dataArray);

            options.onComplete = function(serverResponse) {
				let resp = JSON.parse(serverResponse)
				resp.action = "add";
                resolve(resp);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options);
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
	};
    
    _addMembersToGroup = function(that, data){
    	
	 	return new Promise(function(resolve, reject) {
            var details = {};
            var selectedContentItemsDetails = [];
            for (var i = 0; i < data.length; i++) { 
                details = {};
                details.label = data[i].label;
                details.identifier = data[i].identifier;
                details.id = data[i].id;
                //  details.id[i] = data[i].id;
                selectedContentItemsDetails.push(details);

            }
			
			var uidVal = that.TreedocModel.UserGroupId;
			uidVal = uidVal.replace("<","");
			uidVal = uidVal.replace(">","");
           
            var url = "";
            
            if(RequestUtils.isAdmin) {
            	//url = '../../resources/modeler/pno/group/'+ uidVal;
            		url = UserGroupBootstrap.get3DSpaceURL()+"/resources/modeler/pno/group/"+ uidVal;
    		}
            else {
            	//url = '../../resources/bps/application/'+ that.TreedocModel.UserGroupPID;
            		url = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+ that.TreedocModel.UserGroupPID;
            }
           
            var selectedContentItemsData = new Array();
            for (var i = 0; i < data.length; i++) { 
                var d = {
                        "op" : "add",  
                        "field" : "members",  
                        "value" : data[i].identifier
                }
                selectedContentItemsData.push(d);
            }
            var requestData = {
                   "data" : selectedContentItemsData
            };
            var options = {};
            options = UWACore.extend(options, RequestUtils.getSyncOptions(), true);
            options.method = 'PATCH';
            options.type = 'json';
            options.headers = {
                    'SecurityContext' : RequestUtils.SecurityContext,
					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
           // options.data  = { "csrf": widget.data.csrf };
            //options.data = JSON.stringify(options.data);
            options.data = JSON.stringify(selectedContentItemsData);
            options.onComplete = function(serverResponse) {
            	serverResponse.data = data;
            	serverResponse.action = "add";
            	resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };
			//WAFData.authenticatedRequest(url, options);
            UserGroupBootstrap.authenticatedRequest(url, options);
        });
    };		
    
    _fetchUserGroupById = function(id,UID){
        return new Promise(function(resolve, reject) {
        	/*id = id.replace("<","");
			id = id.replace(">","");		
			let postURL= "../../resources/modeler/pno/group/"+id;	*/
        	/*if(UID!=null &&  typeof UID != 'undefined' && UID.indexOf(">")==-1) {
        		UID = "<"+UID+">";
        	}*/
			if(id==null ||  typeof id == 'undefined') {
				
				id =UID;
			}
			//let postURL= "../../resources/bps/application/usergroups/"+id;
			let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/usergroups/"+id;
            let options = {};
            options.method = 'GET';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext
            };

            options.onComplete = function(serverResponse) {
                resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    _fetchAndConnectUserGroup = function(id,UID,logicalAccess){
        return new Promise(function(resolve, reject) {
			if(id==null ||  typeof id == 'undefined') {
				id =UID;
			}
			//let postURL= "../../resources/bps/application/usergroups/"+id+"/createSharingUG";
			let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/usergroups/"+id+"/createSharingUG";
            let options = {};
            options.method = 'POST';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext,
                    'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken()
            };
            
            options.data = JSON.stringify(logicalAccess)

            options.onComplete = function(serverResponse) {
                resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    _changeVisibility = function(data){
        return new Promise(function(resolve, reject) {
			let pid = data.uri;
			if(data.pid!=null){
				pid = data.pid;
			}
			//let postURL= "../../resources/bps/application/usergroups/"+pid+"/changeVisibility";
			let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/usergroups/"+pid+"/changeVisibility";
            let options = {};
            options.method = 'POST';
            options.headers = {
                    'Content-Type' : 'application/ds-json',
                    'SecurityContext' : RequestUtils.SecurityContext
            };

            options.onComplete = function(serverResponse) {
                resolve(serverResponse);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
            UserGroupBootstrap.authenticatedRequest(postURL, options);
        });
    };
    
    _fetchUserGroupAccessRights = function(usergroupid){
            return new Promise(function(resolve, reject) {
   			 	//let postURL= "../../resources/bps/application/"+usergroupid+"/personroles";
   			 	let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+usergroupid+"/personroles";
                let options = {};
                options.method = 'GET';
                options.headers = {
                        'Content-Type' : 'application/json',
                        'SecurityContext' : RequestUtils.SecurityContext
                };

                options.onComplete = function(serverResponse) {
                    resolve(serverResponse);
                };  

                options.onFailure = function(serverResponse) {
                    reject(serverResponse);
                };

                //WAFData.authenticatedRequest(postURL, options); 
				UserGroupBootstrap.authenticatedRequest(postURL, options);
            });
    };
    
    _filterUserGroups = function(filterInfo){
            return new Promise(function(resolve, reject) {
   			 	//let postURL= "../../resources/bps/application/filter?"+filterInfo;
   			 	let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/filter?"+filterInfo;
                let options = {};
                options.method = 'GET';
                options.headers = {
                        'Content-Type' : 'application/json',
                        'SecurityContext' : RequestUtils.SecurityContext
                };

                options.onComplete = function(serverResponse) {
                    resolve(serverResponse);
                };  

                options.onFailure = function(serverResponse) {
                    reject(serverResponse);
                };

                //WAFData.authenticatedRequest(postURL, options); 
                UserGroupBootstrap.authenticatedRequest(postURL, options);

            });
    };
    
    	_addAccessRightssToGroup = function (memberArray,  usergroupInfo,updateDataMemberArray){
    		 return new Promise(function(resolve, reject) {
    			 	let id = usergroupInfo.model.pid;
    				//let postURL= "../../resources/bps/application/"+id+"/updaterole";
    				let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+id+"/updaterole";
    	            let options = {};
    	            options.method = 'POST';
    	            options.headers = {
    	                    'Content-Type' : 'application/json',
    	                    'SecurityContext' : RequestUtils.SecurityContext
    	            };
    	            options.data = JSON.stringify(memberArray);
    	            options.onComplete = function(serverResponse) {
    	            	var response =JSON.parse(serverResponse)
    	            	response.data = updateDataMemberArray;
    	                resolve(response);
    	            };  

    	            options.onFailure = function(serverResponse) {
    	                reject(serverResponse);
    	            };

    	            //WAFData.authenticatedRequest(postURL, options); 
    	            UserGroupBootstrap.authenticatedRequest(postURL, options);
    	        });
    	};
    	_revokeAccessFromUserGroup = function (that,data) {
        	
        	return new Promise(function(resolve, reject) {
                var id;
                for (var i = 0; i < data.length; i++) { 
                	id =  data[i];
                }
    			
                var userid = that.model.pid;
               
                //var url = '../../resources/bps/application/'+ userid+"/removerole";
                var url = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+userid+"/removerole";
               
                var selectedContentItemsData = new Array();

                
                /*for (var i = 0; i < data.length; i++) { 
                    var d = {
                            "op" : "remove",  
                            "field" : "members",  
                            "value" : data[i]
                    }
                    selectedContentItemsData.push(d);
                }
                var requestData = {
                       "data" : selectedContentItemsData
                };*/
                var options = {};
                options.data =  JSON.stringify(data);
                options = UWACore.extend(options, RequestUtils.getSyncOptions(), true);
                options.method = 'DELETE';
                options.headers = {
                        'SecurityContext' : RequestUtils.SecurityContext,
    					'ENO_CSRF_TOKEN': RequestUtils.get3DSpaceCSRFToken(),
    					'Content-Type':'application/ds-json'
                };
                //options.data = JSON.stringify(selectedContentItemsData);
                options.onComplete = function(serverResponse) {
                	resolve(serverResponse);
                };  

                options.onFailure = function(serverResponse) {
                    reject(serverResponse);
                };

                //WAFData.authenticatedRequest(url, options);
                UserGroupBootstrap.authenticatedRequest(url, options);
            });
        	
        };

    	_makeWSCall  = function (URL, httpMethod, authentication, ContentType, ReqBody, userCallbackOnComplete, userCallbackOnFailure, options) {

    		var options = options || null;
    		var url = "";
    		if (options != null && options.isfederated != undefined && options.isfederated == true)
    			url = RequestUtils.populate3DSpaceURL.federatedURL + URL;
    		var accept= "";
    		if (options != null && options.acceptType != undefined && options.acceptType != "")
    			accept = options.acceptType;
    		else
    			accept = 'application/json';

    		//Security Context not encoding.
    		var encodeSecurityContext = 'Yes';
    		if (options != null && options.encodeSecurityContext != undefined && options.encodeSecurityContext != "")
    			encodeSecurityContext = options.encodeSecurityContext;

    		var timestamp = new Date().getTime();
    		if (url.indexOf("?") == -1) {
    			url = url + "?tenant=" + RequestUtils.populate3DSpaceURL.tenant + "&timestamp=" + timestamp;
    		} else {
    			url = url + "&tenant=" + RequestUtils.populate3DSpaceURL.tenant + "&timestamp=" + timestamp;
    		}

    		//var securityContext = globalObject.getSecurityContext();
    		var securityContext = "ctx::"+RequestUtils.SecurityContext;
    		// Encoding for special character for company name IE specific
    		if(encodeSecurityContext!='No')
    			securityContext = encodeURIComponent(securityContext);

    		userCallbackOnComplete = userCallbackOnComplete || function () { };
    		userCallbackOnFailure = userCallbackOnFailure || function () { };

    		// For NLS translation
    		//if(lang == undefined || lang == 'undefined'){

    		var queryobject = {};
    		queryobject.method = httpMethod;
    		queryobject.timeout = 120000000;

    		if (options == null || options.isSwymUrl == undefined || options.isSwymUrl == false) {
    			queryobject.type = 'json';
    		}

    		var lang = RequestUtils.mLanguage;
    			if (authentication) {
    				queryobject.auth = {
    						passport_target: authentication
    				};
    			}
    			//queryobject.proxy = globalObject.proxy;
    			if (securityContext) {

    				queryobject.headers = {
    						Accept: accept,
    						'Content-Type': ContentType,
    						'SecurityContext': securityContext,
    						'Accept-Language': lang
    				};

    			} else { //will be called only once for security context
    				queryobject.headers = {
    						Accept: accept,
    						'Content-Type': ContentType,
    						'Accept-Language': lang
    				};
    			}


    		if (ReqBody)
    			queryobject.data = ReqBody;

    		queryobject.onComplete = function (data) {
    			//console.log("Success calling url: " + url);
    			//console.log("Success data: " + JSON.stringify(data));
    			userCallbackOnComplete(data);
    		};
    		queryobject.onFailure = function (errDetailds, errData) {
    			console.log("Error in calling url: " + url);
    			console.log("Additional Details:: httpMethod: " + httpMethod + " authentication: " + authentication + " securityContext: " + securityContext + " ContentType: " + ContentType);
    			console.log("Error Detail: " + errDetailds);
    			console.log("Error Data: " + JSON.stringify(errData));


    			userCallbackOnFailure(errDetailds, errData);
    		};

    		queryobject.onTimeout = function () {
    			console.log("Timedout for url: " + url);
    			//ChgErrors.error("Webservice Timedout, please refresh and try again.");
    			if(widget.body){
    				Mask.unmask(widget.body);
    			}
    		}

    		//WAFData.authenticatedRequest(url, queryobject);
    		UserGroupBootstrap.authenticatedRequest(url, queryobject);
    	};
    	
    _switchuserAccess = function (that,useraccessData){

        return new Promise(function(resolve, reject) {
        	let usergroupid = that.model.pid;
			 	//let postURL= "../../resources/bps/application/"+usergroupid+"/updaterole";
			 	let postURL = UserGroupBootstrap.getUserGroupServiceBaseURL()+"/"+usergroupid+"/updaterole";
            let options = {};
            
            options.method = 'POST';
            options.data =  JSON.stringify(useraccessData);
            options.headers = {
                    'Content-Type' : 'application/json',
                    'SecurityContext' : RequestUtils.SecurityContext
            };

            options.onComplete = function(serverResponse) {
            	var response =JSON.parse(serverResponse)
            	response.info = useraccessData;
            	resolve(response);
            };  

            options.onFailure = function(serverResponse) {
                reject(serverResponse);
            };

            //WAFData.authenticatedRequest(postURL, options); 
			UserGroupBootstrap.authenticatedRequest(postURL, options);
        });

    };
    UGServices={
            fetchAllGroups: () => {return _fetchAllGroups();},
            fetchAndConnectUserGroup: (id,UID,logicalAccess) => {return _fetchAndConnectUserGroup(id,UID,logicalAccess);},
			createUserGroups : (args) => {return _createUserGroups(args);},
			changeVisibility : (data) => {return _changeVisibility(data);},
			duplicateUserGroup : (args) => {return _duplicateUserGroup(args);},
			fetchUserGroupMembers : (args) => {return _fetchUGMembers(args);},
            deleteUserGroups : (args) => {return _deleteUserGroups(args);},
            addMembersToGroup : (model, data) => {return _addMembersToGroup(model,data);},
            addMembersMultipleGroups : (groupIds, memberIds) => {return _addMembersMultipleGroups(groupIds, memberIds);},
            fetchUserGroupById : (id,UID) => {return _fetchUserGroupById(id,UID);},
            fetchUserGroupAccessRights : (usergroupid) => {return _fetchUserGroupAccessRights(usergroupid);},
            filterUserGroups : (filterInfo) => {return _filterUserGroups(filterInfo);},
            removeMembersFromUserGroup : (that,ids) => {return _removeMembersFromUserGroup(that,ids);},
            removeMembersMultipleGroups : (groupIds, memberIds) => {return _removeMembersMultipleGroups(groupIds, memberIds);},
            addAccessRightssToGroup: (memberArray,  usergroupInfo,updateDataMemberArray) => {return _addAccessRightssToGroup(memberArray,  usergroupInfo,updateDataMemberArray);},
            makeWSCall: (URL, httpMethod, authentication, ContentType, ReqBody, userCallbackOnComplete, userCallbackOnFailure, options) => {return _makeWSCall(URL, httpMethod, authentication, ContentType, ReqBody, userCallbackOnComplete, userCallbackOnFailure, options);},
            revokeAccessFromUserGroup : (that,ids) => {return _revokeAccessFromUserGroup(that,ids);},
            switchuserAccess : (that,useraccessData) => {return _switchuserAccess(that,useraccessData);}
    };

    return UGServices;

});


define('DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',[
	'DS/ENOUserGroupMgmt/Services/UserGroupServices',
	'UWA/Promise'],
function(UserGroupServices, Promise) {
    'use strict';
    let UserGroupServicesController,userGroupId;
    //TODO implement a general callback method for anykind of service failure
 /*   let commonFailureCallback = function(data){  
      if (data instanceof ErrorObject){

        return false;
      }
      else {
        return data;
      }
    };*/
    
    /*All methods are public, need to be exposed as this is service controller file*/
    UserGroupServicesController = {
    		
    		fetchAllUserGroups: function(){

    			return new Promise(function(resolve, reject) {
    				UserGroupServices.fetchAllGroups().then(
    						success => {
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
    		} ,
    		fetchUserGroupById: function(userGroupId,userGroupUID){

                return new Promise(function(resolve, reject) {
                    UserGroupServices.fetchUserGroupById(userGroupId,userGroupUID).then(
    						success => {
    	    					resolve(success);
    	    		    	},
    	    		    	failure => {
    	    		    		reject(failure);
    	    		    	});	
                }); 
            }, 
            
            fetchAndConnectUserGroup: function(userGroupId,userGroupUID,logicalAccess){
                return new Promise(function(resolve, reject) {
                    UserGroupServices.fetchAndConnectUserGroup(userGroupId,userGroupUID,logicalAccess).then(
    						success => {
    	    					resolve(success);
    	    		    	},
    	    		    	failure => {
    	    		    		reject(failure);
    	    		    	});	
                }); 
            }, 
            
            changeVisibility: function(data){
                return new Promise(function(resolve, reject) {
                    UserGroupServices.changeVisibility(data).then(
    						success => {
    	    					resolve(success);
    	    		    	},
    	    		    	failure => {
    	    		    		reject(failure);
    	    		    	});	
                }); 
            }, 
            
    		createUserGroup :function(args){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.createUserGroups(args).then(
    						success => {
    							
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			},
			deleteUserGroup:function(ids){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.deleteUserGroups(ids).then(
    						success => {
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			},
			duplicateUserGroup :function(args){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.duplicateUserGroup(args).then(
    						success => {
    							
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			},
			removeMembersFromUserGroup :function(that,ids){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.removeMembersFromUserGroup(that,ids).then(
    						success => {
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			},
			
			removeMembersMultipleGroups: function(groupDetails,memberIdsList){
				return new Promise(function(resolve, reject) {
    				UserGroupServices.removeMembersMultipleGroups(groupDetails,memberIdsList).then(
	    				success => {
	    					resolve(success);
	    		    	},
	    		    	failure => {
	    		    		reject(failure);
	    		    	}
	    		    );	
    			});
			},
    		fetchUserGroupMembers: function(userGroupId){

                return new Promise(function(resolve, reject) {
                    UserGroupServices.fetchUserGroupMembers(userGroupId).then(function(response) {
                        resolve(response);
                    });
                }); 
            },            
			addMembersToGroup : function(model,data){
                return new Promise(function(resolve, reject) {
                    UserGroupServices.addMembersToGroup(model,data).then(function(response) {
                        resolve(response);
                    },function(response) {
                        reject(response);
                    });
                });
            },
            
			addMembersMultipleGroups: function(groupDetails,memberIdsList){
				return new Promise(function(resolve, reject) {
    				UserGroupServices.addMembersMultipleGroups(groupDetails,memberIdsList).then(
	    				success => {
	    					resolve(success);
	    		    	},
	    		    	failure => {
	    		    		reject(failure);
	    		    	}
	    		    );	
    			});
			},
            fetchUserGroupAccessRights : function(userGroupId) {
            	return new Promise(function(resolve, reject) {
                    UserGroupServices.fetchUserGroupAccessRights(userGroupId).then(function(response) {
                        resolve(response);
                    },function(response) {
                        reject(response);
                    });
                });
            },
            filterUserGroups : function(userNameFilter, respFilter, visibilityFilter, titleToSearch) {
				let filterInfo = "filterType="+respFilter+"&Visibility="+visibilityFilter+"&Username="+userNameFilter+"&GroupTitle="+titleToSearch;
            	return new Promise(function(resolve, reject) {
                    UserGroupServices.filterUserGroups(filterInfo).then(function(response) {
                        resolve(response);
                    },function(response) {
                        reject(response);
                    });
                });
            },
            addAccessRightssToGroup : function(memberArray, usergroupInfo,updateDataMemberArray) {
            	return new Promise(function(resolve, reject) {
                    UserGroupServices.addAccessRightssToGroup(memberArray, usergroupInfo,updateDataMemberArray).then(function(response) {
                        resolve(response);
                    },function(response) {
                        reject(response);
                    });
                });
            },
            revokeAccessFromUserGroup :function(that,ids){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.revokeAccessFromUserGroup(that,ids).then(
    						success => {
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			},
			switchuserAccess : function(that,useraccessData){
				
				return new Promise(function(resolve, reject) {
    				UserGroupServices.switchuserAccess(that,useraccessData).then(
    						success => {
    					resolve(success);
    		    	},
    		    	failure => {
    		    		reject(failure);
    		    	});	
    			});
			}

    };

    return UserGroupServicesController;
    

});

/* global define, widget */
/**
  * @overview User Group Management - User Group Model
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENOUserGroupMgmt/Model/UsersGroupModel',
[
    'DS/TreeModel/TreeDocument',
    'DS/TreeModel/TreeNodeModel',
    'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
	'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
    'DS/WebappsUtils/WebappsUtils',
    'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
    'DS/ENOUserGroupMgmt/Components/Notifications',
    'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
	'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],
    function(
			TreeDocument,
			TreeNodeModel,
			DataFormatter,
			WrapperDataGridView,
			WebappsUtils,
			UserGroupServicesController,
			Notifications,
			RequestUtils,
			NLS
    ) {
	'use strict';
		
	let model = new TreeDocument();
	let getUserGroupDetails = {
	}
	let setUserGroupDetails = function(data){
		UserGroupServicesController.fetchUserGroupAccessRights(data.model.pid).then(function(response) {
			var obj = JSON.parse(response);	
			getUserGroupDetails = {};
			obj.forEach(function(dataElem) {
				getUserGroupDetails[dataElem.name] = dataElem.accessName;
			});
			getUserGroupDetails.owner=data.model.owner;
			// getUserGroupDetails.accessRights = JSON.parse(accessRightsArray);
		 })
		 .catch((err) => {
			 if(widget.ugMgmtMediator){
				 if (!widget.ugNotify) {
					 widget.ugNotify = new Notifications();
				 }
			 	 widget.ugNotify.handler().addNotif({
	                 level: 'error',
	                 subtitle: NLS.errorSettingGroupDetails,
	                 sticky: false
	         	 });
         	 }else{
				 if (!ugSyncEvts.ugNotify) {
					 ugSyncEvts.ugNotify = new Notifications();
				 }
			 	 ugSyncEvts.ugNotify.handler().addNotif({
	                 level: 'error',
	                 subtitle: NLS.errorSettingGroupDetails,
	                 sticky: false
	         	 });
			  }

		 });
		
	};	
	let _openedUserGroupModel;
	let createTreeDocumentModel = function(response){
		//destroy();		
	    model.prepareUpdate();	
		
		var obj = JSON.parse(response);
	    obj["groups"].forEach(function(dataElem) {	
	    	
	        var  memberCount= NLS.oneMember;
			if(dataElem.members>1) {
				 memberCount =  NLS.mulitMembers;
			}
			var thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroupTile.png');
			if(dataElem.state=="Active"){
				thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png');
			}
			var gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PrivateUserGroup22.png');
			if(dataElem.state=="Active"){
				gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PublicUserGroup22.png');
			}
	        var root = new TreeNodeModel({
	            label: dataElem.title,
	            id: dataElem.id,
	            width: 300,
	            grid: DataFormatter.gridData(dataElem),
	            "thumbnail" :thumbImg,
	            "subLabel": dataElem.ownerFullName,
	            description : dataElem.members + memberCount,
	            icons : [gridImg],
	            contextualMenu : ["My context menu"],
	            shouldAcceptDrop: true,
	            isAdmin:dataElem.isAdmin
	        });
	        
	        model.addRoot(root);
	    });
	    model.pushUpdate();
	    registerEvents();
	    return model;
	};
	let getRowModelById = function(id){
		return WrapperDataGridView.getRowModelById(model,id);
	};

	let getRowModelByURI = function(uri){
		return WrapperDataGridView.getRowModelByURI(model,uri);
	};

	let destroy = function(){
		model = new TreeDocument();
	};
	
	let appendRows = function(dataElem){
		
		model.prepareUpdate();

     // owner needs to be reasigned with logged in user  ***************************************
			
	 // add owner myGroup and member list to the elementFromPoint
	    dataElem.myGroup =dataElem.myGroup;
	    //dataElem.members =0;
	    if (dataElem.members && Array.isArray(dataElem.members) && dataElem.members.length==0)
	    	dataElem.members = 0;
	    var  memberCount= NLS.oneMember;
		if(dataElem.members>1) {
			 memberCount =  NLS.mulitMembers;
		}
		var thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroupTile.png');
		if(dataElem.state=="Active"){
			thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png');
		}
		var gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PrivateUserGroup22.png');
		if(dataElem.state=="Active"){
			gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PublicUserGroup22.png');
		}
	    dataElem.uri = dataElem.uri;
	    dataElem.owner = dataElem.owner;
        var root = new TreeNodeModel({
        	label: dataElem.title,
        	description : dataElem.members+ memberCount ,
        	id: dataElem.id,
        	width: 300,
        	grid: DataFormatter.gridData(dataElem),
        	"thumbnail" :thumbImg,
        	"subLabel": dataElem.ownerFullName,
        	icons : [gridImg],
        	contextualMenu : [NLS.ContextMenu]
        });
																			
        model.getXSO().add(root);
        model.addChild(root, 0);
		
        model.unselectAll();					
		nouserGroupPlaceHolderHide();
		model.pushUpdate();
		registerEvents();
		return root;
	};
	
	let nouserGroupPlaceHolderHide = function(){
		if(checkHiddenNodesCount()!=0){
			if(widget.ugMgmtMediator){
				widget.ugMgmtMediator.publish('hide-no-usergroup-placeholder');
			}else{
				ugSyncEvts.ugMgmtMediator.publish('hide-no-usergroup-placeholder');
			}
        }
	};
	
	let deleteRowModelByIds = function(ids){
		WrapperDataGridView.deleteRowModelByIds(model,ids);
		nouserGroupsPlaceHolder();		
	};
	
	let nouserGroupsPlaceHolder = function(){
		if(checkHiddenNodesCount()== 0){
			if(widget.ugMgmtMediator){
				widget.ugMgmtMediator.publish('show-no-usergroup-placeholder');
			}else{
				ugSyncEvts.ugMgmtMediator.publish('show-no-usergroup-placeholder');
			}
        }
	};
	let checkHiddenNodesCount= function(){
		let count = 0;
		model.getChildren().forEach(node => {if(!node._isHidden)count++;});
		return count;
	};
	let registerEvents = function(){
		if(widget.ugMgmtMediator){
			widget.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {  
				_openedUserGroupModel = data;
			});
			widget.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
				_openedUserGroupModel = undefined;      	  
	        });
	        widget.ugMgmtMediator.subscribe('usergroup-visibility-updated', function (data) {
				_openedUserGroupModel = data;
	        });
        }else{
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {  
				_openedUserGroupModel = data;
			});
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
				_openedUserGroupModel = undefined;      	  
	        });
	        ugSyncEvts.ugMgmtMediator.subscribe('usergroup-visibility-updated', function (data) {
				_openedUserGroupModel = data;
	        });
		}
	};
	let getOpenedUserGroupModel = function(){
		return _openedUserGroupModel;
	}
		
	let updateRow = function(dataElem){
		let rowModelToUpdate = getRowModelByURI(dataElem.uri);
		var gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PrivateUserGroup22.png');
		if(dataElem.state=="Active"){
			gridImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/16/I_PublicUserGroup22.png');
		}
		var thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroupTile.png');
		if(dataElem.state=="Active"){
			thumbImg = WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png');
		}
		// Update the grid content //
		rowModelToUpdate.updateOptions({grid:DataFormatter.gridData(dataElem)});
		rowModelToUpdate.setIcons([gridImg])
		// Update the tile content //
		rowModelToUpdate.options.thumbnail = thumbImg;
		rowModelToUpdate.updateOptions(
				{
					label:dataElem.title
				});
	};
	let updateMemberCount = function(dataElem){
		let rowModelToUpdate = getRowModelByURI(dataElem.uri);
		var orgGrid;
		var memberscount = 0;
		var  memberCountMessage = NLS.oneMember;
		if(rowModelToUpdate == null || typeof rowModelToUpdate == 'undefined'){
			rowModelToUpdate = getRowModelById(dataElem.id);
			orgGrid= rowModelToUpdate.options.grid;	
			if("add"==dataElem.action){				
				//orgGrid.members= orgGrid.members+dataElem.members.length;
				dataElem.members.forEach((ele, idx) => {
					//when 0 existing members
					if (idx==0 && (!orgGrid.memberList || orgGrid.memberList==="")) {
						orgGrid.memberList = ele.name
					} 
					else{
						if(!orgGrid.memberList.split("|").includes(ele.name))
							orgGrid.memberList = orgGrid.memberList + "|" + ele.name
					}
				});
				orgGrid.members = orgGrid.memberList.split("|").length;
			} 
			else if ("remove"==dataElem.action) {
				//orgGrid.members= orgGrid.members-dataElem.members.length;
				let memarr = orgGrid.memberList.split("|");
				dataElem.members.forEach((ele) => {
					memarr = memarr.filter((e) => e != ele.name);
				});
				orgGrid.memberList = memarr.join("|");
				if(!orgGrid.memberList==""){
					orgGrid.members = orgGrid.memberList.split("|").length;
				}
				else{
					orgGrid.members = 0;
				}
			}
			else {
				orgGrid.members = dataElem.members.length;
				
			} 
			
			
			
			/*else if(orgGrid.members!=0){
				orgGrid.members= orgGrid.members-dataElem.members.length;
			} else {
				orgGrid.members = dataElem.members.length;
			}*/
        } else {
        	orgGrid= rowModelToUpdate.options.grid;
        	if("add"==dataElem.action){				
				orgGrid.members= dataElem.members.length;
				orgGrid.memberList = "";
				dataElem.members.forEach((ele, idx) => {
						if (idx==0 && (!orgGrid.memberList || orgGrid.memberList==="")) {
							orgGrid.memberList = ele.name
						} 
						else
							orgGrid.memberList = orgGrid.memberList + "|" + ele.name
				});
			} 
			else if ("remove"==dataElem.action) {
				orgGrid.members= dataElem.members.length;
				orgGrid.memberList = "";
				dataElem.members.forEach((ele, idx) => {
						if (idx==0 && (!orgGrid.memberList || orgGrid.memberList==="")) {
							orgGrid.memberList = ele.name
						} 
						else
							orgGrid.memberList = orgGrid.memberList + "|" + ele.name
				});
			}
			else {
				orgGrid.members = dataElem.members.length;
				
			} 
        	orgGrid.members = dataElem.members.length;
        }
		memberscount = orgGrid.members;
		 
		rowModelToUpdate.updateOptions({grid:orgGrid});
		if(memberscount>1) {
			memberCountMessage = NLS.mulitMembers;
		}
		
        rowModelToUpdate.updateOptions(
		{
			description:memberscount +memberCountMessage
		});
	};
	
		
	let UGModel = {
		createModel : (response) => {return createTreeDocumentModel(response);},
		getModel : () => {return model;},
		appendRows : (data) => {return appendRows(data);},
		getSelectedRowsModel : () => {return WrapperDataGridView.getSelectedRowsModel(model);},
		destroy : () => {return destroy();},
		getRowModelById: (id) => {return getRowModelById(id);},
		getRowModelByURI: (id) => {return getRowModelByURI(id);},
		deleteRowModelByIds: (ids) => {return deleteRowModelByIds(ids);},
		getOpenedUserGroupModel : () => {return getOpenedUserGroupModel();},
		setUserGroupDetails : (usergroupid) => {return setUserGroupDetails(usergroupid);},
		updateRow : (dataElem) => {return updateRow(dataElem);},
		updateMemberCount : (dataElem) => {return updateMemberCount(dataElem);},
		getUserGroupDetails:()=>{return getUserGroupDetails; }
	}
	return UGModel;

});


/* global define, widget */
/**
 * @overview User Group Management - ID card utilities
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Utilities/IdCardUtil',[
	'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
	'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
],function(UsersGroupModel, NLS) {
	'use strict';
	let infoIconActive = function(){
		var infoIcon = document.querySelector('#usergroupInfoIcon');
  	  	if(infoIcon && infoIcon.className.indexOf("fonticon-color-display") > -1){
  	  		infoIcon.className = infoIcon.className.replace("fonticon-color-display", "fonticon-color-active");
  	  	}
	};
	
	let infoIconInActive = function(){
		var infoIcon = document.querySelector('#usergroupInfoIcon');
  	  	if(infoIcon && infoIcon.className.indexOf("fonticon-color-active") > -1){
  	  		infoIcon.className = infoIcon.className.replace("fonticon-color-active", "fonticon-color-display");
  	  	}   
	};
	
	let syncUGUpdatedData = function (userGroupPID, userGroupUUID) {
    	require(['DS/ENOUserGroupMgmt/Controller/UserGroupServicesController'], function(UserGroupServicesController) {
    	UserGroupServicesController.fetchUserGroupById(userGroupPID, userGroupUUID).then(
				success => {
					// Refresh id card header and summary page //
					var updatedUG = JSON.parse(success);
					updatedUG = updatedUG.groups[0];
					UsersGroupModel.updateRow(updatedUG);
					let userModel = UsersGroupModel.getRowModelByURI(updatedUG.uri);
                    if(userModel == null || typeof userModel == 'undefined'){
        				userModel = UsersGroupModel.getRowModelById(updatedUG.id);
        			}
        			if(widget.ugMgmtMediator){
	        			widget.ugMgmtMediator.publish('usergroup-visibility-updated', {model:userModel.options.grid});
						widget.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
						widget.ugMgmtMediator.publish('usergroup-accessrights-remove-viewer-active', userModel.options.grid);
						//widget.ugMgmtMediator.publish('usergroup-data-updated', userModel.options.grid);
						//widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userModel.options.grid}); 
					}else{
						ugSyncEvts.ugMgmtMediator.publish('usergroup-visibility-updated', {model:userModel.options.grid});
						ugSyncEvts.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
						ugSyncEvts.ugMgmtMediator.publish('usergroup-accessrights-remove-viewer-active', userModel.options.grid);
						//ugSyncEvts.ugMgmtMediator.publish('usergroup-data-updated', userModel.options.grid);
						//ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userModel.options.grid}); 
					}
				},
				failure =>{
					if(widget.ugMgmtMediator){
						if(failure.error){
								widget.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: failure.error,
									sticky: false
								});
						}else{
								widget.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: NLS.infoRefreshErrorTitle,
							    	sticky: false
								});
						}
					}else{
						if(failure.error){
								ugSyncEvts.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: failure.error,
									sticky: false
								});
						}else{
								ugSyncEvts.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: NLS.infoRefreshErrorTitle,
							    	sticky: false
								});
						}
					}
				});
    	});
    };
	
	/*let hideChannel3 = function(){
		var idCardHideContent = document.querySelector('#channel3');
  	  	if(idCardHideContent){
  	  		idCardHideContent.style.display = "none";
  	  	}
	};
	
	let showChannel3 = function(){
		var idCardHideContent = document.querySelector('#channel3');
		if(idCardHideContent){
  		  	idCardHideContent.style.display = "";
  	  	}
	};
	
	let hideChannel2 = function(){
		var idCardHideContent = document.querySelector('#channel2');
  	  	if(idCardHideContent){
  	  		idCardHideContent.style.display = "none";
  	  	}
	};
	
	let showChannel2 = function(){
		var idCardHideContent = document.querySelector('#channel2');
		if(idCardHideContent){
  		  	idCardHideContent.style.display = "";
  	  	}
	};
	
	let hideChannel1 = function(){
		var idCardHideContent = document.querySelector('#channel1');
  	  	if(idCardHideContent){
  	  		idCardHideContent.style.display = "none";
  	  	}
	};
	
	let showChannel1 = function(){
		var idCardHideContent = document.querySelector('#channel1');
		if(idCardHideContent){
  		  	idCardHideContent.style.display = "";
  	  	}
	};
	
	let infoIconIsActive = function(){
		if(document.querySelector('#usergroupInfoIcon').className.indexOf("fonticon-color-active") > -1){
			return true;
		}else{
			return false;
		}
	};
	*/
	let collapseIcon = function(){
		var userGroupHeaderContainer = document.querySelector('#userGroupHeaderContainer');
		if(userGroupHeaderContainer && userGroupHeaderContainer.className.indexOf("minimized") > -1){
			var expandCollapse = document.querySelector('#expandCollapse');
			if(expandCollapse.className.indexOf("wux-ui-3ds-expand-up") > -1){
				expandCollapse.className = expandCollapse.className.replace("wux-ui-3ds-expand-up", "wux-ui-3ds-expand-down");
				expandCollapse.title = NLS.idCardHeaderActionExpand;
			}
		}
	};
	/*
	let hideThumbnail = function(){
		var thumbnailSection = document.querySelector('#thumbnailSection');
		thumbnailSection.classList.add("id-card-thumbnail-remove");
		
		var infoSec = document.querySelector('#infoSec');
		var userGroupHeaderContainer = document.querySelector('#userGroupHeaderContainer');
		if(userGroupHeaderContainer && userGroupHeaderContainer.className.indexOf("minimized") > -1){
			infoSec.classList.add("id-info-section-align-minimized");
		}else{
			infoSec.classList.add("id-info-section-align");
		}
		
		
	};
	
	let showThumbnail = function(){
		var thumbnailSection = document.querySelector('#thumbnailSection');
		thumbnailSection.classList.remove("id-card-thumbnail-remove");
		
		var infoSec = document.querySelector('#infoSec');
		var userGroupHeaderContainer = document.querySelector('#userGroupHeaderContainer');
		if(userGroupHeaderContainer && userGroupHeaderContainer.className.indexOf("minimized") > -1){
			infoSec.classList.remove("id-info-section-align-minimized");
		}else{
			infoSec.classList.remove("id-info-section-align");
		}
		
	};
	
	let resizeIDCard = function(containerWidth){
		// Hide channel3 at 850px
        if (containerWidth < 850) {
        	hideChannel3();
        } else {
        	showChannel3();
        }
		
		// Hide thumbnail at 768px
        if (containerWidth < 768) {
        	hideThumbnail();
        } else {
        	showThumbnail();
        }
        
        // Hide channel2 at 500px
        if (containerWidth < 500) {
        	hideChannel2();
        } else {
        	showChannel2();
        }
        
        // Hide channel1 at 500px
        if (containerWidth < 175) {
        	hideChannel1();
        } else {
        	showChannel1();
        }
        
	};*/
	
	
	
	let IdCardUtil = {
			infoIconActive: () => {return infoIconActive();},
			infoIconInActive: () => {return infoIconInActive();},
			collapseIcon: () => {return collapseIcon();},
			syncUGUpdatedData: (userGroupPID, userGroupUUID) => {return syncUGUpdatedData(userGroupPID, userGroupUUID);}
			/*hideChannel3: () => {return hideChannel3();},
			showChannel3: () => {return showChannel3();},
			infoIconIsActive: () => {return infoIconIsActive();},
			hideThumbnail: () => {return hideThumbnail();},
			showThumbnail: () => {return showThumbnail();},
			resizeIDCard: (containerWidth) => {return resizeIDCard(containerWidth);}*/
	};
	
	return IdCardUtil;
});

define('DS/ENOUserGroupMgmt/Utilities/AutoCompleteUtil',
    [
        'DS/ENOUserGroupMgmt/Services/UserGroupServices',
        'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
        'DS/TreeModel/TreeDocument',
        'DS/TreeModel/TreeNodeModel',
        'DS/WUXAutoComplete/AutoComplete',
        'DS/TreeModel/BaseFilter',
        'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],
    function (UserGroupServices,
        RequestUtils,
        TreeDocument,
        TreeNodeModel,
        WUXAutoComplete,
        BaseFilter,
        NLS
    ) {
        'use strict';

        var objectTreeDocument, stringNameFilter;
        let drawAutoComplete = function(optionsValue){
            objectTreeDocument = new TreeDocument();
            var autoCompleteComponent= new WUXAutoComplete({
                elementsTree: function (typeaheadValue) {
                    if(optionsValue.getValidation){
                        var isValid = optionsValue.getValidation();
                        if(!isValid){
                            return;
                        }
                    }
                    return new Promise(function (resolve, reject) {
                        // Simulate an asynchronous server call to retrieve the AutoComplete possible values
                        var getSuccess = function (data) {
                            objectTreeDocument = new TreeDocument();
                            stringNameFilter = BaseFilter.inherit({
                                  // Method called for every data when the model is changed to know if this data has to be filtered
                                  isDataFiltered: function(data) {
                                    // Get attribute value & label
                                    var dataValue = data.getAttributeValue("name");
                                    var dataLabel = data.getAttributeValue("label");
                            
                                    // Check conditions for filter to apply
                                    if (dataValue && dataLabel && this.filterModel && this.filterModel.text) {
                                      var filter = this.filterModel.text.toLowerCase();
                                                var doesDataFitTheFilter = dataValue.toLowerCase().indexOf(filter) > -1 || dataLabel.toLowerCase().indexOf(filter) > -1;
                                                return !doesDataFitTheFilter;
                                    }
                                    // if the filter is empty, nothing should be filtered out
                                    return false;
                                  },
                            
                                  // A filter is considered as empty if there is no possiblity that its current model will filter some data.
                                  isEmpty: function() {
                                    return this.filterModel.text === undefined;
                                  }
                            
                                });
                            var filterManager = objectTreeDocument.getFilterManager();
    
                            filterManager.registerFilter("myFilterID", stringNameFilter);
                            if (data && data.results && Array.isArray(data.results)) {
                                var objectSelectedArr = data.results;
                                var existingSelections = new Set();
                                if(autoCompleteComponent.selectedItems){
	                                autoCompleteComponent.selectedItems.forEach(function(item){
										existingSelections.add(item.options.grid.physicalId);
									})
								}
                                objectSelectedArr.forEach(function (object) {
                                    var node = new TreeNodeModel();
                                    var objectAttrs = object.attributes;
                                    objectAttrs.forEach(function (attr) {
                                        if (attr.name === 'ds6w:type'||attr.name === 'ds6w:what/ds6w:type') node.options.type = attr['value'];
                                        if (attr.name === 'resourceid') node.options.physicalId = attr['value'];
                                        if (attr.name === 'ds6w:label') node.options.label = attr['value'];
                                        if (attr.name === 'ds6w:identifier') node.options.name = attr['value'];
                                        if (attr.name === 'ds6w:identifier') node.options.identifier = attr['value'];
                                        node.options.grid = {
                                            name: node.options.name,
                                            label: node.options.label,
                                            physicalId: node.options.physicalId,
                                            identifier: node.options.identifier
                                        }
                                    });
                                    if(existingSelections.has(node.options.physicalId)){
										return;
									}
	                                else {
										objectTreeDocument.addRoot(node);
									}
                                });
                            }
                            resolve(objectTreeDocument);
                        };
    
                        var getFailure = function (data) {
                            reject(data);
                        };		
                        var queryString = optionsValue.searchQuery(typeaheadValue);
                        performSearch(queryString, getSuccess, getFailure);
                    });
                },
                filterCB: function(text) {
                    objectTreeDocument.setFilterModel({
                        value: {
                          filterId: "myFilterID",
                          filterModel: {
                            text:  text
                          }
                        }
                      });
                    },
                multiSearchMode: optionsValue.multiSearchMode,
                placeholder: optionsValue.placeholder,
                minLengthBeforeSearch: optionsValue.minLengthBeforeSearch,
                allowFreeInputFlag: optionsValue.allowFreeInputFlag,
                keepSearchResultsFlag: optionsValue.keepSearchResultsFlag
            });
            autoCompleteComponent.addEventListener('change', function(e) {
                if(optionsValue.getChangeHandler){
                    optionsValue.getChangeHandler(e);
                }
            });
            autoCompleteComponent.getContent().querySelector(".wux-ui-state-undefined").addEventListener("keyup",function(e,autoCompleteComponent){
                if (e.keyCode === 13) {
                    e.stopPropagation();
                }
            });
            if(optionsValue.selectedItems){
				autoCompleteComponent.selectedItems = optionsValue.selectedItems;
			}
            return autoCompleteComponent;
        };
        
        let performSearch = function(searchQuery, success, failure){
            var url = "/search?xrequestedwith=xmlhttprequest";
            var queryString = "";
            queryString = searchQuery.query;
            var resourceid_not_in = [];
            if(searchQuery.resourceid_not_in){
				resourceid_not_in = searchQuery.resourceid_not_in;
			}
            var inputjson = {
                    "with_indexing_date": true,
                    "with_nls": false, 
                    "label": "yus-1515078503005", 
                    "locale": "en", 
                    "select_predicate": ["ds6w:label", "ds6w:type", "ds6w:identifier", "ds6wg:fullname", 'ds6w:status'],
                    "select_file": ["icon", "thumbnail_2d"], 
                    "query": queryString,
                    "resourceid_not_in": resourceid_not_in,
                    "order_by": "asc", 
                    "order_field": "ds6w:label",
                    "nresults": 1000,
                    "start": "0",
                    "source": [], 
                    "tenant": RequestUtils.populate3DSpaceURL.tenant
                };
            inputjson = JSON.stringify(inputjson);
    
            var options = {};
            options.isfederated = true;
            UserGroupServices.makeWSCall(url, "POST", "enovia", 'application/json', inputjson, success, failure, options);	
        };
        
        let AutoCompleteUtil = {
            drawAutoComplete : (optionsValue) => { return drawAutoComplete(optionsValue); }         
        };
            
        return AutoCompleteUtil;

});



/**
 * This file is a wrapper file to create toolbars in the app. Currently not being used
 */

define('DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands',
		[
			'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
			'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
			'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
			'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
		], function(UsersGroupModel, UsersGroupMemberModel, UserGroupAccessRightsModel, NLS) {
	
	'use strict';
	
	let selectAllNodes = function(args){
		let model;
		if(args.location=="summary"){
			model = UsersGroupModel.getModel();
		} else if(args.location=="members"){
			model = UsersGroupMemberModel.getModel();
		} else{
			model = UserGroupAccessRightsModel.getModel();
		}
		model.selectAll();
	}
	
	let unselectAllNodes = function(args){
		let model;
		if(args.location=="summary"){
			model = UsersGroupModel.getModel();
		} else if(args.location=="members"){
			model = UsersGroupMemberModel.getModel();
		} else{
			model = UserGroupAccessRightsModel.getModel();
		}
		model.unselectAll();
	}
	
	let updateSelectAllCount = function(model, toolbar){
		let toolbarSelect = toolbar.getNodeModelByID("selection");
		let selectCount = model.getChildren().length;
		let unselectCount = model.getSelectedNodes().length;
		var selectMenuLabel = NLS.selectAll;
		selectMenuLabel = selectMenuLabel.replace("{count}",selectCount);
		var unselectMenuLabel = NLS.unselectAll;
		unselectMenuLabel = unselectMenuLabel.replace("{count}",unselectCount);
		toolbarSelect.getAttributeValue("data").menu[0].title = selectMenuLabel;
		toolbarSelect.getAttributeValue("data").menu[1].title = unselectMenuLabel;
	}
	
	var UserGroupCommands = {
		selectAllNodes: (args) => {return selectAllNodes(args);},
		unselectAllNodes: (args) => {return unselectAllNodes(args);},
		updateSelectAllCount: (model, toolbar) => {return updateSelectAllCount(model, toolbar);}
	};
	
	return UserGroupCommands;
});


/**
 * UserGroupAccessRightsAction 
 */
define('DS/ENOUserGroupMgmt/Actions/UserGroupAccessRightsActions',
		[
			'DS/UIKIT/Mask',
			'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
			'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
			"DS/Controls/Button",
			"DS/WUXAutoComplete/AutoComplete",
			'DS/TreeModel/TreeDocument',
			'DS/TreeModel/TreeNodeModel',
			'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
			'DS/ENOUserGroupMgmt/Services/UserGroupServices',
			'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
			'DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
			'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
		],
		function(Mask, 
				UserGroupAccessRightsModel,
				UsersGroupModel,
				WUXButton, 
				WUXAutoComplete, 
				TreeDocument, 
				TreeNodeModel,
				UserGroupServicesController,
				UserGroupServices,
				RequestUtils,
				SearchUtil,
				NLS)
		{
			'use strict';
			var UserGroupAccessRightsActions = {
					switchuserAccess :function (useraccessData,grid){
						var that =UserGroupAccessRightsModel.usergroupInfo();
						UserGroupServicesController.switchuserAccess(that,useraccessData,grid).then(
                				success => {
                					success.grid=grid;
                					if(widget.ugMgmtMediator){
                						widget.ugMgmtMediator.publish('usergroup-accessrights-switchaccess-rows',success);
                					}else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-accessrights-switchaccess-rows',success);
									}
                					var successMsg = NLS.SwitchAccessSuccessMsg;
                					var accessname = success.info.data[0].accessName;
									if(accessname=="Owner")  {
										accessname = NLS.AccessRights_AddMembers_OwnerRole;
									} else if(accessname=="Manager") {
										accessname = NLS.AccessRights_AddMembers_ManagerRole;
									} else if(accessname=="Viewer") {
										accessname = NLS.AccessRights_AddMembers_ViewerRole;
									}
                					successMsg = successMsg.replace("{access}",accessname);
                					if(widget.ugMgmtMediator){
	                					widget.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
                					}else{
										ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
									}
                				},
                				failure =>{
                					//reject(failure);
                				});
					},
					RevokeAccessFromUserGroup : function (that,ids,access){
                		UserGroupServicesController.revokeAccessFromUserGroup(that,ids).then(
                				success => {
                					UserGroupAccessRightsModel.deleteSelectedRowsExceptContextUser();
                					if(widget.ugMgmtMediator){
                						widget.ugMgmtMediator.publish('usergroup-accessrights-model-countUpdate');
                						var successMsg = NLS.RevokeAccessSuccessMsg;
	                					widget.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
                					}else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-accessrights-model-countUpdate');
										var successMsg = NLS.RevokeAccessSuccessMsg;
	                					ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
									}
                					
                				},
                				failure =>{
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
	                						level: 'error',
	                						subtitle: NLS.errorAccessRightsRevoke,
	                					    sticky: false
	                					});
	                					//reject(failure);
                					}else{
										ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'error',
	                						subtitle: NLS.errorAccessRightsRevoke,
	                					    sticky: false
	                					});
	                					//reject(failure);
									}
                				});
                	},
					
					
					launchAddRespPanel: function(){
						var addMemberdiv = document.querySelector(".addRespView");
						var teamgridViewDiv = document.querySelector('.accessrights-gridView-View');
						var teamtileViewDiv = document.querySelector('.accessrights-tileView-View');
						//var addMemberIcon   = document.querySelector(".toolbar-container .wux-ui-3ds-plus");
						addMemberdiv.empty();
						if(addMemberdiv.style.display=='block'){
							addMemberdiv.hide();
							teamgridViewDiv.removeClassName('teamview-opaque');
							teamtileViewDiv.removeClassName('teamview-opaque');
							//addMemberIcon.removeClassName('currentView');
							return;
						}else{
							addMemberdiv.show();
							teamgridViewDiv.addClassName('teamview-opaque');
							teamtileViewDiv.addClassName('teamview-opaque');
							//addMemberIcon.addClassName('currentView');
						}

						UserGroupAccessRightsActions.modelForMemberRole = new TreeDocument();
						UserGroupAccessRightsActions.modelForOwnerRole = new TreeDocument();
						UserGroupAccessRightsActions.modelForViewerRole = new TreeDocument();

						//praparing model for autoComplete
						var viewerAutoCompleteStatus = true;
						if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Public"){
							viewerAutoCompleteStatus = false
						}
						UserGroupAccessRightsActions.updateAutocompleteModel({managerrole:true,ownerrole:true,viewerrole:viewerAutoCompleteStatus});
						
						if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
							UserGroupAccessRightsActions.autoCompleteViewer = new WUXAutoComplete(
									{
										// Assign the model to autoComplete
										elementsTree : UserGroupAccessRightsActions.modelForViewerRole,
										placeholder: NLS.AccessRights_AddMembers_PlaceHolder,
										customFilterMessage:NLS.AccessRights_Auto_No_Seach_found
									});
						}
						
						UserGroupAccessRightsActions.autoCompleteManager = new WUXAutoComplete(
								{
									// Assign the model to autoComplete
									elementsTree : UserGroupAccessRightsActions.modelForMemberRole,
									placeholder: NLS.AccessRights_AddMembers_PlaceHolder,
									customFilterMessage:NLS.AccessRights_Auto_No_Seach_found
								});
						UserGroupAccessRightsActions.autoCompleteOwner = new WUXAutoComplete(
								{
									// Assign the model to autoComplete
									elementsTree : UserGroupAccessRightsActions.modelForOwnerRole,
									placeholder: NLS.AccessRights_AddMembers_PlaceHolder,
									customFilterMessage:NLS.AccessRights_Auto_No_Seach_found
								});

						var addMembderViewContainer =  UWA.createElement('div', {
							'class':'add-member-container',
							styles: {
								'width':'100%'
							}
						}).inject(addMemberdiv);

						var addMembderBodyContainer =  UWA.createElement('div', {
							'class':'add-member-body-container'
						}).inject(addMembderViewContainer);

						var addMembderbuttonContainer =  UWA.createElement('div', {
							'class':'add-member-button-container'
						}).inject(addMembderViewContainer);


						var memberTable = UWA.createElement('table', {
							'class': 'add-member-table'
						}).inject(addMembderBodyContainer);
						
						if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
							var viewertr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(memberTable);
	
							UWA.createElement('td', {
								content: '<span>'+NLS.AccessRights_AddMembers_ViewerRole+'</span>',
								'class':'add-member-table-col'
							}).inject(viewertr);              
	
							var viewerField = UWA.createElement('td', {'class': 'viewer-field add-member-table-col',}).inject(viewertr);
	
							UserGroupAccessRightsActions.autoCompleteViewer.inject(viewerField);
							var viewerFieldSearch = UWA.createElement('span',{
								'class':'fonticon fonticon-search  viewer-field-search',
								events:{
									click:function(evt){
										UserGroupAccessRightsActions.searchCategotyId = 'Viewer';
										UserGroupAccessRightsActions.onSearchUserClick();
									}
								}
							}).inject(viewerField);
						}
						
						var assineetr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(memberTable);

						UWA.createElement('td', {
							content: '<span>'+NLS.AccessRights_AddMembers_ManagerRole+'</span>',
							'class':'add-member-table-col'
						}).inject(assineetr);              

						var assigneeField = UWA.createElement('td', {'class': 'assignee-field add-member-table-col',}).inject(assineetr);

						UserGroupAccessRightsActions.autoCompleteManager.inject(assigneeField);
						var assigneeFieldSearch = UWA.createElement('span',{
							'class':'fonticon fonticon-search  assignee-field-search',
							events:{
								click:function(evt){
									UserGroupAccessRightsActions.searchCategotyId = 'Manager';
									UserGroupAccessRightsActions.onSearchUserClick();
								}
							}
						}).inject(assigneeField);

						var reviewertr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(memberTable);

						UWA.createElement('td', {
							content: '<span>'+NLS.AccessRights_AddMembers_OwnerRole+'</span>',
							'class':'add-member-table-col'
						}).inject(reviewertr);

						var reviewerField = UWA.createElement('td', {'class': 'reviewer-field add-member-table-col',}).inject(reviewertr);

						UserGroupAccessRightsActions.autoCompleteOwner.inject(reviewerField);
						var reviewerFieldSearch = UWA.createElement('span',{
							'class':'fonticon fonticon-search  reviewer-field-search',
							events:{
								click:function(evt){
									UserGroupAccessRightsActions.searchCategotyId = 'Owner';
									UserGroupAccessRightsActions.onSearchUserClick();
								}
							}
						}).inject(reviewerField);
						//adding change event listerner
						UserGroupAccessRightsActions.addChangeEventListerner();

						UserGroupAccessRightsActions.myButtonPrimary = new WUXButton({ label: NLS.AccessRights_Button_Label_Add, disabled: true , emphasize: "primary" }).inject(addMembderbuttonContainer);
						var myButtonSecondary = new WUXButton({ label: NLS.AccessRights_Cancel, emphasize: "secondary" }).inject(addMembderbuttonContainer);
						UserGroupAccessRightsActions.myButtonPrimary.addEventListener("buttonclick", function(evt){						
							addMemberdiv.empty();
							var memberArray = [];
							var updateDataMemberArray = [];
							if(UserGroupAccessRightsActions.autoCompleteManager.selectedItems!=undefined)for(var index = 0 ; index<UserGroupAccessRightsActions.autoCompleteManager.selectedItems.length; index++){						
								memberArray.push({ "username": UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.identifier,
													"accessName": 'Manager',
													"type":UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.type});
								let status = UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.status;
								status = status.substring(status.indexOf('.')+1);
								updateDataMemberArray.push({ "name": UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.identifier, 
													"accessName": 'Manager',
													"personName":UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.label,
													"id":UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.id,
													"type":UserGroupAccessRightsActions.autoCompleteManager.selectedItems[index].options.type,
													"status": status});
							}
							if(UserGroupAccessRightsActions.autoCompleteOwner.selectedItems!=undefined)for(var index = 0 ; index<UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.length; index++){
								memberArray.push({ "username": UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.identifier, 
													"accessName": 'Owner',
													"type":UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.type});
								let status = UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.status;
								status = status.substring(status.indexOf('.')+1);
								updateDataMemberArray.push({ "name": UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.identifier, 
													"accessName": 'Owner',
													"personName":UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.label,
													"id":UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.id,
													"type":UserGroupAccessRightsActions.autoCompleteOwner.selectedItems[index].options.type,
													"status": status});
							}
							if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
								if(UserGroupAccessRightsActions.autoCompleteViewer.selectedItems!=undefined)for(var index = 0 ; index<UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.length; index++){
									memberArray.push({ "username": UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.identifier, 
														"accessName": 'Viewer',
														"type":UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.type});
									let status = UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.status;
									status = status.substring(status.indexOf('.')+1);
									updateDataMemberArray.push({ "name": UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.identifier, 
														"accessName": 'Viewer',
														"personName":UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.label,
														"id":UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.id,
														"type":UserGroupAccessRightsActions.autoCompleteViewer.selectedItems[index].options.type,
														"status": status});
								}
							}
							if(memberArray.length>0){
								UserGroupAccessRightsActions.addAccessRightssToGroup(memberArray,updateDataMemberArray);
							}
								
							addMemberdiv.hide();
							//addMemberIcon.removeClassName('currentView');
							teamgridViewDiv.removeClassName('teamview-opaque');
							teamtileViewDiv.removeClassName('teamview-opaque');
						});
						myButtonSecondary.addEventListener("buttonclick", function(evt){
							addMemberdiv.empty();
							addMemberdiv.hide();
							//addMemberIcon.removeClassName('currentView');
							teamgridViewDiv.removeClassName('teamview-opaque');
							teamtileViewDiv.removeClassName('teamview-opaque');
						});

					},
					updateAutocompleteModel: function(options){
						var personRoleArray = {};
						var currentMember = UserGroupAccessRightsModel.getModel().getChildren();
						for(var index=0; index<currentMember.length;index++){
							var memberInfo = currentMember[index].options.grid;
							personRoleArray[memberInfo.name] = memberInfo.Role;
						}

						// -- Helpers
						var optionsForViewerRole = {
								'categoryId': 'viewer',
						};
						var optionsForManagerRole = {
								'categoryId': 'assignee',
						};
						var optionsForOwnerRole = {
								'categoryId': 'reviewer',
						};
						if(options.ownerrole==true) {
							UserGroupAccessRightsActions.getListMember(optionsForOwnerRole).then(function(resp){
								UserGroupAccessRightsActions.modelForOwnerRole.empty();
								UserGroupAccessRightsActions.modelForOwnerRole.prepareUpdate();
								for (var i = 0; i < resp.length; i++) {
									var identifier = resp[i].identifier;
									if(personRoleArray.hasOwnProperty(identifier)){
										resp[i].label = resp[i].label +" (" +personRoleArray[identifier] +")";
										if(personRoleArray[identifier].contains('Owner')==true || personRoleArray[identifier].contains('Manager')==true || (personRoleArray[identifier].contains('Viewer')==true && UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"))
											continue;
									}
									var nodeForReviwer = new TreeNodeModel(
											{
												label : resp[i].label,
												value : resp[i].value,
												name  : resp[i].name,
												identifier: resp[i].identifier,
												type:resp[i].type,
												grid:{type:resp[i].type,name:resp[i].name},
												id: resp[i].id,
												status: resp[i].status
											});
									UserGroupAccessRightsActions.modelForOwnerRole.addRoot(nodeForReviwer);
								}
								UserGroupAccessRightsActions.modelForOwnerRole.pushUpdate();

							});
						}	
						if(options.managerrole==true){
							UserGroupAccessRightsActions.getListMember(optionsForManagerRole).then(function(resp){
								UserGroupAccessRightsActions.modelForMemberRole.empty();

								UserGroupAccessRightsActions.modelForMemberRole.prepareUpdate();

								for (var i = 0; i < resp.length; i++) {
									var identifier = resp[i].identifier;
									if(personRoleArray.hasOwnProperty(identifier)){
										resp[i].label = resp[i].label +" (" +personRoleArray[identifier] +")";
										if(personRoleArray[identifier].contains('Owner')==true || personRoleArray[identifier].contains('Manager')==true || (personRoleArray[identifier].contains('Viewer')==true && UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"))
											continue;
									}
									var nodeForAssignee = new TreeNodeModel(
											{
												label : resp[i].label,
												value : resp[i].value,
												name  : resp[i].name,
												identifier: resp[i].identifier,
												type:resp[i].type,
												id: resp[i].id,
												status: resp[i].status
											});
									UserGroupAccessRightsActions.modelForMemberRole.addRoot(nodeForAssignee);
								}
								
								UserGroupAccessRightsActions.modelForMemberRole.pushUpdate();
							});
						}
						if(options.viewerrole==true){
							UserGroupAccessRightsActions.getListMember(optionsForViewerRole).then(function(resp){
								UserGroupAccessRightsActions.modelForViewerRole.empty();
								UserGroupAccessRightsActions.modelForViewerRole.prepareUpdate();
								for (var i = 0; i < resp.length; i++) {
									var identifier = resp[i].identifier;
									if(personRoleArray.hasOwnProperty(identifier)){
										resp[i].label = resp[i].label +" (" +personRoleArray[identifier] +")";
										if(personRoleArray[identifier].contains('Owner')==true || personRoleArray[identifier].contains('Manager')==true ||personRoleArray[identifier].contains('Viewer')==true)
											continue;
									}
									var nodeForViewer = new TreeNodeModel(
											{
												label : resp[i].label,
												value : resp[i].value,
												name  : resp[i].name,
												identifier: resp[i].identifier,
												type:resp[i].type,
												id: resp[i].id,
												status: resp[i].status
											});
									UserGroupAccessRightsActions.modelForViewerRole.addRoot(nodeForViewer);
								}
								
								UserGroupAccessRightsActions.modelForViewerRole.pushUpdate();
							});
						}

					},
					onSearchUserClick: function(){
                    	//var data =WrapperTileView.tileView();
						var data ="";
                        var searchcom_socket,scopeId;
                        //TODO need to see why it's coming as undefined
                        require(['DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel'], function(contentModel) {
                        	UserGroupAccessRightsModel = contentModel;
							var usergroupOrg = "";
						    var socket_id = UWA.Utils.getUUID();
                            var that = this;

                            if (!UWA.is(searchcom_socket)) {
                                require(['DS/SNInfraUX/SearchCom'], function(SearchCom) {
                                    searchcom_socket = SearchCom.createSocket({
                                        socket_id: socket_id
                                    });	
                                    let allowedTypes = "Person,Group";    // UG105941: replace with constant
                                    var recentTypes = allowedTypes ? allowedTypes.split(',') : '';
                                    var refinementToSnNJSON = SearchUtil.getRefinementToSnN(socket_id, "addUserAccess", true, recentTypes);
    								refinementToSnNJSON.precond = SearchUtil.getPrecondForContentSearch(scopeId, recentTypes, usergroupOrg); 
    								refinementToSnNJSON.resourceid_not_in = UserGroupAccessRightsModel.getMemberIDs();
    								//refinementToSnNJSON.resourceid_not_in = "";
                                    if (UWA.is(searchcom_socket)) {
                                        searchcom_socket.dispatchEvent('RegisterContext', refinementToSnNJSON);
                                       // searchcom_socket.addListener('Selected_Objects_search', ContentActions.selected_Objects_search.bind(that,data));
                                        searchcom_socket.addListener('Selected_Objects_search', UserGroupAccessRightsActions.OnSearchComplete.bind(data));
                                        
                                        searchcom_socket.dispatchEvent('InContextSearch', refinementToSnNJSON);
                                    } else {
                                        throw new Error('Socket not initialized');
                                    }
                                });
                            }
                        });

                    },
					addAccessRightssToGroup: function(memberArray,updateDataMemberArray){
						var useraccessData = {
								"data":memberArray
						}
						UserGroupServicesController.addAccessRightssToGroup( useraccessData, UserGroupAccessRightsModel.usergroupInfo(),updateDataMemberArray).then(
                				success => {
                					UserGroupAccessRightsModel.appendRows(success);
                					if(widget.ugMgmtMediator){
                						widget.ugMgmtMediator.publish('usergroup-accessrights-model-countUpdate');
                						var successMsg = NLS.AddAccessRightSuccessMsg;
                						widget.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
                						});
                					}else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-accessrights-model-countUpdate');
										var successMsg = NLS.AddAccessRightSuccessMsg;
                						ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
                						});
									}
                					
                				},
                				failure =>{
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
	                						level: 'error',
	                						subtitle: NLS.errorAccessRightsGrant,
	                					    sticky: false
	                					});
	                					//reject(failure);
                					}else{
										ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'error',
	                						subtitle: NLS.errorAccessRightsGrant,
	                					    sticky: false
	                					});
	                					//reject(failure);
									}
                				});
					},
					addChangeEventListerner: function(){
						
						//chnage Event listerner on reviewer autoComplete				
						UserGroupAccessRightsActions.autoCompleteOwner.addEventListener('change',function(){
							var selectedChips = UserGroupAccessRightsActions.autoCompleteOwner.selectedItems;
							var selectedChipCount = selectedChips.length;
							
							//checking whether this item exist in model or not.
							if(selectedChipCount>0){
								var newlyAddedChips = selectedChips[selectedChipCount-1];
								var index = UserGroupAccessRightsActions.autoCompleteOwner.elementsTree.getChildren().findIndex(function filter(model)
								{
									if(model.options.name==newlyAddedChips.options.name)
										return true ;
								});
								if(index<0){
									UserGroupAccessRightsActions.autoCompleteOwner._selectionChips.removeChip(newlyAddedChips.options.label); 
									UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.pop();
								} 
								else {
									if(UserGroupAccessRightsActions.autoCompleteManager.selectedItems){
										UserGroupAccessRightsActions.autoCompleteManager.selectedItems.forEach(function(dataElem) {
											if(dataElem.options.name==newlyAddedChips.options.name){
												dataElem.unselect();
												UserGroupAccessRightsActions.autoCompleteManager._selectionChips.removeChip(newlyAddedChips.options.label);
											}
										});
									} 
									if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
										if(UserGroupAccessRightsActions.autoCompleteViewer.selectedItems){
											UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.forEach(function(dataElem) {
												if(dataElem.options.name==newlyAddedChips.options.name){
													dataElem.unselect();
													UserGroupAccessRightsActions.autoCompleteViewer._selectionChips.removeChip(newlyAddedChips.options.label);
												}
											});
										} 
									}
								}
								
							}
							if((UserGroupAccessRightsActions.autoCompleteOwner.selectedItems && UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.length>0 ) 
									|| (UserGroupAccessRightsActions.autoCompleteManager.selectedItems && UserGroupAccessRightsActions.autoCompleteManager.selectedItems.length>0)
									||(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private" && UserGroupAccessRightsActions.autoCompleteViewer.selectedItems && UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.length>0)){
								UserGroupAccessRightsActions.myButtonPrimary.disabled = false;
							} else {
								UserGroupAccessRightsActions.myButtonPrimary.disabled = true;
							}
							
						});
						UserGroupAccessRightsActions.autoCompleteManager.addEventListener('change',function(){
							var selectedChips = UserGroupAccessRightsActions.autoCompleteManager.selectedItems;
							var selectedChipCount = selectedChips.length;
							
							//checking whether this item exist in model or not.
							if(selectedChipCount>0){
								var newlyAddedChips = selectedChips[selectedChipCount-1];
								var index = UserGroupAccessRightsActions.autoCompleteManager.elementsTree.getChildren().findIndex(function filter(model)
								{
									if(model.options.name==newlyAddedChips.options.name)
										return true ;
								});
								if(index<0){
									UserGroupAccessRightsActions.autoCompleteManager._selectionChips.removeChip(newlyAddedChips.options.label); 
									UserGroupAccessRightsActions.autoCompleteManager.selectedItems.pop();
								}
								else {
									if(UserGroupAccessRightsActions.autoCompleteOwner.selectedItems){
										UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.forEach(function(dataElem) {
											if(dataElem.options.name==newlyAddedChips.options.name){
												dataElem.unselect();
												UserGroupAccessRightsActions.autoCompleteOwner._selectionChips.removeChip(newlyAddedChips.options.label);
											}
										});
									} 
									if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
										if(UserGroupAccessRightsActions.autoCompleteViewer.selectedItems){
											UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.forEach(function(dataElem) {
												if(dataElem.options.name==newlyAddedChips.options.name){
													dataElem.unselect();
													UserGroupAccessRightsActions.autoCompleteViewer._selectionChips.removeChip(newlyAddedChips.options.label);
												}
											});
										} 
									}
								}
							}
							if((UserGroupAccessRightsActions.autoCompleteOwner.selectedItems && UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.length>0 ) 
									|| (UserGroupAccessRightsActions.autoCompleteManager.selectedItems && UserGroupAccessRightsActions.autoCompleteManager.selectedItems.length>0)
									||(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private" && UserGroupAccessRightsActions.autoCompleteViewer.selectedItems && UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.length>0)) {
								UserGroupAccessRightsActions.myButtonPrimary.disabled = false;
							} else {
								UserGroupAccessRightsActions.myButtonPrimary.disabled = true;
							}
							
						});
						if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
							UserGroupAccessRightsActions.autoCompleteViewer.addEventListener('change',function(){
								var selectedChips = UserGroupAccessRightsActions.autoCompleteViewer.selectedItems;
								var selectedChipCount = selectedChips.length;
								
								//checking whether this item exist in model or not.
								if(selectedChipCount>0){
									var newlyAddedChips = selectedChips[selectedChipCount-1];
									var index = UserGroupAccessRightsActions.autoCompleteViewer.elementsTree.getChildren().findIndex(function filter(model)
									{
										if(model.options.name==newlyAddedChips.options.name)
											return true ;
									});
									if(index<0){
										UserGroupAccessRightsActions.autoCompleteViewer._selectionChips.removeChip(newlyAddedChips.options.label); 
										UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.pop();
									}
									else {
										if(UserGroupAccessRightsActions.autoCompleteOwner.selectedItems){
											UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.forEach(function(dataElem) {
												if(dataElem.options.name==newlyAddedChips.options.name){
													dataElem.unselect();
													UserGroupAccessRightsActions.autoCompleteOwner._selectionChips.removeChip(newlyAddedChips.options.label);
												}
											});
										} 
										if(UserGroupAccessRightsActions.autoCompleteManager.selectedItems){
											UserGroupAccessRightsActions.autoCompleteManager.selectedItems.forEach(function(dataElem) {
												if(dataElem.options.name==newlyAddedChips.options.name){
													dataElem.unselect();
													UserGroupAccessRightsActions.autoCompleteManager._selectionChips.removeChip(newlyAddedChips.options.label);
												}
											});
										} 
									}
								}
								if((UserGroupAccessRightsActions.autoCompleteOwner.selectedItems && UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.length>0 ) 
										|| (UserGroupAccessRightsActions.autoCompleteManager.selectedItems && UserGroupAccessRightsActions.autoCompleteManager.selectedItems.length>0)
										||(UserGroupAccessRightsActions.autoCompleteViewer.selectedItems && UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.length>0)) {
									UserGroupAccessRightsActions.myButtonPrimary.disabled = false;
								} else {
									UserGroupAccessRightsActions.myButtonPrimary.disabled = true;
								}
								
							});
						}
					},
					getListMember: function (options) {
						var returnedPromise = new Promise(function (resolve, reject) {
							var url = "/search?xrequestedwith=xmlhttprequest";
							var success = function (data) {

								var results = [];

								if (data && data.results && Array.isArray(data.results)) {
									var personSelectedArr = data.results;
									personSelectedArr.forEach(function (routeTemp) {
										var rtSearched = {};
										var routeTempAttrs = routeTemp.attributes;
										routeTempAttrs.forEach(function (attr) {
											if (attr.name === 'ds6w:type'||attr.name === 'ds6w:what/ds6w:type') rtSearched.type = attr['value'];
											if (attr.name === 'resourceid') rtSearched.id = attr['value'];
											if (attr.name === 'ds6w:identifier') rtSearched.identifier = attr['value'];
											if (attr.name === 'ds6w:label') rtSearched.label = attr['value'];
											if (attr.name === 'ds6w:identifier') rtSearched.name = attr['value'];
											if (attr.name === 'ds6w:status'||attr.name === 'ds6w:what/ds6w:status') rtSearched.status = attr['value'];
										});
										results.push(rtSearched);
									});
								}
								resolve(results);
							};

							var failure = function (data) {
								reject(data);
							};

							var queryString = "";
							
							queryString = "(flattenedtaxonomies:\"types/Person\" AND policycurrent:\"Person.Active\") OR (flattenedtaxonomies:\"types/Group\")";
							
							var inputjson = { "login":{"3dspace":{"SecurityContext": RequestUtils.SecurityContext}}, "with_indexing_date": true, "with_nls": false, "label": "yus-1515078503005", "locale": "en", "select_predicate": ["ds6w:label", "ds6w:type", "ds6w:status", "ds6w:description", "ds6w:identifier", "ds6w:responsible", "ds6wg:fullname"], "select_file": ["icon", "thumbnail_2d"], "query": queryString, "order_by": "desc", "order_field": "relevance", "nresults": 1000, "start": "0", "source": [], "tenant": RequestUtils.populate3DSpaceURL.tenant };
							var inputjson = JSON.stringify(inputjson);
							
							var options = {};
							options.isfederated = true;
							UserGroupServices.makeWSCall(url, "POST", "enovia", 'application/json', inputjson, success, failure, options);
						});

						return returnedPromise;
					},
					OnSearchComplete: function(result){
						for (var d = 0; d < result.length; d++) {

							var node ;
							var tempObject = result[d];
							var nodeArray = [];
							if(tempObject){
									node = new TreeNodeModel(
											{
												label : tempObject["ds6w:label"],
												value : tempObject["ds6w:identifier"],
												name  : tempObject["ds6w:identifier"],
												identifier:tempObject["ds6w:identifier"],
												type:tempObject["ds6w:type"],
												id: tempObject.id,
												status: tempObject["ds6w:status_value"]
											});

									nodeArray.push(node);
							}
							if(UserGroupAccessRightsActions.searchCategotyId=='Owner'){
								if(UserGroupAccessRightsActions.autoCompleteOwner.selectedItems==undefined){
									UserGroupAccessRightsActions.autoCompleteOwner.selectedItems = nodeArray;
								}else {
									UserGroupAccessRightsActions.autoCompleteOwner.selectedItems = UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.concat(nodeArray);
								}
								//UserGroupAccessRightsActions.autoCompleteOwner._applySelectedItems();
								UserGroupAccessRightsActions.autoCompleteOwner.selectedItems.forEach(function(dataElem) {
									dataElem.select();
								});
								
							}else if(UserGroupAccessRightsActions.searchCategotyId=='Manager'){
								if(UserGroupAccessRightsActions.autoCompleteManager.selectedItems==undefined){
									UserGroupAccessRightsActions.autoCompleteManager.selectedItems = nodeArray	
								}else{
									UserGroupAccessRightsActions.autoCompleteManager.selectedItems = UserGroupAccessRightsActions.autoCompleteManager.selectedItems.concat(nodeArray);
								}
								//UserGroupAccessRightsActions.autoCompleteManager._applySelectedItems();
								UserGroupAccessRightsActions.autoCompleteManager.selectedItems.forEach(function(dataElem) {
										dataElem.select();
								});
							}
							else if(UserGroupAccessRightsActions.searchCategotyId=='Viewer'){
								if(UserGroupAccessRightsActions.autoCompleteViewer.selectedItems==undefined){
									UserGroupAccessRightsActions.autoCompleteViewer.selectedItems = nodeArray	
								}else{
									UserGroupAccessRightsActions.autoCompleteViewer.selectedItems = UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.concat(nodeArray);
								}
								//UserGroupAccessRightsActions.autoCompleteManager._applySelectedItems();
								UserGroupAccessRightsActions.autoCompleteViewer.selectedItems.forEach(function(dataElem) {
										dataElem.select();
								});
							}
						}
					}
					}
			return UserGroupAccessRightsActions;
	});

define('DS/ENOUserGroupMgmt/Actions/MemberActions',
        [
         'UWA/Drivers/Alone',
         'UWA/Core',
         'DS/WAFData/WAFData',
          'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
         'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
         'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
         'DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
         'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
         'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
         'DS/ENOUserGroupMgmt/Utilities/AutoCompleteUtil',
         'DS/TreeModel/TreeNodeModel',
         'DS/Controls/Button',
         'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
         ],
         function(
                 UWA,
                 UWACore,
                 WAFData,
                 WrapperTileView,
                 DataFormatter,
                 UserGroupMemberModel,
				 SearchUtil,
                 UserGroupServicesController,
                 UsersGroupModel,
                 AutoCompleteUtil,
                 TreeNodeModel,
                 WUXButton,
                 NLS
         ) {
            'use strict';
            let MemberActions;
            MemberActions={
	
					onSearchClick: function(){
                    	var data;
						require(['DS/ENOUserGroupMgmt/Views/Tile/UsersGroupMembersTileView'], function(UsersGroupMembersTileView) {
							data = UsersGroupMembersTileView.getMemberTileView();
						});
                        var searchcom_socket,scopeId;
                        //TODO need to see why it's coming as undefined
                        require(['DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel'], function(contentModel) {
                        	UserGroupMemberModel = contentModel;
							var usergroupOrg = "";
						    var socket_id = UWA.Utils.getUUID();
                            var that = this;

                            if (!UWA.is(searchcom_socket)) {
                                require(['DS/SNInfraUX/SearchCom'], function(SearchCom) {
                                    searchcom_socket = SearchCom.createSocket({
                                        socket_id: socket_id
                                    });	
                                    let allowedTypes = "Person";    // UG105941: replace with constant
                                    var recentTypes = allowedTypes ? allowedTypes.split(',') : '';
                                    var refinementToSnNJSON = SearchUtil.getRefinementToSnN(socket_id, "addContent", true, recentTypes);
    								refinementToSnNJSON.precond = SearchUtil.getPrecondForContentSearch(scopeId, recentTypes, usergroupOrg); 
    								refinementToSnNJSON.resourceid_not_in = UserGroupMemberModel.getMemberIDs();
    								if(MemberActions.membersAutoComplete.selectedItems){
										MemberActions.membersAutoComplete.selectedItems.forEach(function(item){
											refinementToSnNJSON.resourceid_not_in.push(item.options.grid.physicalId)
										})
									}
    								refinementToSnNJSON.advanced_search = SearchUtil.getMemberAdvancedSearch(recentTypes);
    								
    								//refinementToSnNJSON.resourceid_not_in = "";
                                    if (UWA.is(searchcom_socket)) {
                                        searchcom_socket.dispatchEvent('RegisterContext', refinementToSnNJSON);
                                       // searchcom_socket.addListener('Selected_Objects_search', ContentActions.selected_Objects_search.bind(that,data));
                                        searchcom_socket.addListener('Selected_Objects_search', MemberActions.selected_Objects_search.bind(that,data));
                                        
                                        searchcom_socket.dispatchEvent('InContextSearch', refinementToSnNJSON);
                                    } else {
                                        throw new Error('Socket not initialized');
                                    }
                                });
                            }
                        });

                    },
                    
                    selected_Objects_search : function(that,data){  
						for (var d = 0; d < data.length; d++) {
							var node ;
							var tempObject = data[d];
							var nodeArray = [];
							if(tempObject){
									node = new TreeNodeModel(
											{
												label : tempObject["ds6w:label"],
												name  : tempObject["ds6w:identifier"],
												identifier:tempObject["ds6w:identifier"],
												physicalId: tempObject["resourceid"]
											});
									node.options.grid = {
                                        identifier: node.options.identifier,
                                        label: node.options.label,
                                        physicalId: node.options.physicalId
                                    }
									nodeArray.push(node);
							}
							if(MemberActions.membersAutoComplete.selectedItems==undefined){
								MemberActions.membersAutoComplete.selectedItems = nodeArray;
							}else {
								MemberActions.membersAutoComplete.selectedItems = MemberActions.membersAutoComplete.selectedItems.concat(nodeArray);
							}
							MemberActions.membersAutoComplete.selectedItems.forEach(function(dataElem) {
								dataElem.select();
							});                          
                        };
                    },
                    
                    RemoveMembersFromUserGroup : function (that,ids,access){
                		
                		UserGroupServicesController.removeMembersFromUserGroup(that,ids).then(
                				success => {
                					// need to change alert message
                					var successMsg = NLS.successRemoveMemberFromUserGroup;
                					if(ids.length == 1){
                						successMsg = NLS.successRemoveMemberFromUserGroupSingle;
                					}
                					successMsg = successMsg.replace("{count}",ids.length);
                					if(widget.ugMgmtMediator){
	                					widget.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
                					}else{
										ugSyncEvts.ugNotify.handler().addNotif({
	                						level: 'success',
	                						subtitle: successMsg,
	                					    sticky: false
	                					});
									}
                					UserGroupMemberModel.deleteSelectedRows();
                					if(widget.ugMgmtMediator){
	                					//widget.ugMgmtMediator.publish('usergroup-members-remove-row-by-ids',{model:ids});
	                					widget.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',success);
                					}else{
										//ugSyncEvts.ugMgmtMediator.publish('usergroup-members-remove-row-by-ids',{model:ids});
                						ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',success);
									}
                					let userModel = UsersGroupModel.getRowModelByURI(success.uri);
                					if(userModel == null || typeof userModel == 'undefined'){
                						userModel = UsersGroupModel.getRowModelById(success.id);
                					}
                					if(widget.ugMgmtMediator){
                                    	widget.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
                                    }else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
									}
                					
                				},
                				failure =>{
                					//reject(failure);
                					

                				});
                				
                	
                	},
                	
                	removeMembersMultipleGroups : function(groupDetails,memberIdsList){
						UserGroupServicesController.removeMembersMultipleGroups(groupDetails,memberIdsList).then(
							success => {
                				let updatedGroups = success.modified;
                				let failedGroups = success.notModified;
                				let failedTitles = "";
                				let updatedMembers = success.members;
                				let action = success.action;
                				if(updatedGroups.length>0){
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
		            						level: 'success',
		            						subtitle: NLS.successRemoveMembers,
		            					    sticky: false
		                				});
	                				}else{
										ugSyncEvts.ugNotify.handler().addNotif({
		            						level: 'success',
		            						subtitle: NLS.successRemoveMembers,
		            					    sticky: false
		                				});
									}
	                				updatedGroups.forEach(function(id){
										if(widget.ugMgmtMediator){
											widget.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',{id:id, members:updatedMembers, action:action})
										}else{
											ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',{id:id, members:updatedMembers, action:action})
										}
									})
								}
								if(failedGroups.length>0){
									failedGroups.forEach(function(id){
										let model = UsersGroupModel.getRowModelById(id);
										failedTitles += model.options.grid.title + "";
									})
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
		            						level: 'error',
		            						subtitle: NLS.failedRemoveMembersWithTitle + failedTitles,
		            					    sticky: false
		                				});
	                				}else{
										ugSyncEvts.ugNotify.handler().addNotif({
		            						level: 'error',
		            						subtitle: NLS.failedRemoveMembersWithTitle + failedTitles,
		            					    sticky: false
		                				});
									}
								}
                				
							},
							failure => {
								if(widget.ugMgmtMediator){
									widget.ugNotify.handler().addNotif({
	            						level: 'error',
	            						subtitle: NLS.failedRemoveMembers,
	            					    sticky: false
	                				});
                				}else{
									ugSyncEvts.ugNotify.handler().addNotif({
	            						level: 'error',
	            						subtitle: NLS.failedRemoveMembers,
	            					    sticky: false
	                				});
								}
							}
						)
					},
					
                	addMembersMultipleGroups : function(groupDetails,memberIdsList){
						UserGroupServicesController.addMembersMultipleGroups(groupDetails,memberIdsList).then(
							success => {
                				let updatedGroups = success.modified;
                				let failedGroups = success.notModified;
                				let failedTitles = "";
                				let updatedMembers = success.members;
                				let action = success.action;
                				if(updatedGroups.length>0){
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
		            						level: 'success',
		            						subtitle: NLS.successAddMembers,
		            					    sticky: false
		                				});
	                				}else{
										ugSyncEvts.ugNotify.handler().addNotif({
		            						level: 'success',
		            						subtitle: NLS.successAddMembers,
		            					    sticky: false
		                				});
									}
	                				updatedGroups.forEach(function(id){
										if(widget.ugMgmtMediator){
											widget.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',{id:id, members:updatedMembers, action:action})
										}else{
											ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',{id:id, members:updatedMembers, action:action})
										}
									})
								}
								if(failedGroups.length>0){
									failedGroups.forEach(function(id){
										let model = UsersGroupModel.getRowModelById(id);
										failedTitles += model.options.grid.title + "";
									})
									if(widget.ugMgmtMediator){
										widget.ugNotify.handler().addNotif({
		            						level: 'error',
		            						subtitle: NLS.failedAddMembersWithTitle + failedTitles,
		            					    sticky: false
		                				});
	                				}else{
										ugSyncEvts.ugNotify.handler().addNotif({
	            						level: 'error',
	            						subtitle: NLS.failedAddMembersWithTitle + failedTitles,
	            					    sticky: false
	                				});
									}
								}
                				
							},
							failure => {
								if(widget.ugMgmtMediator){
									widget.ugNotify.handler().addNotif({
	            						level: 'error',
	            						subtitle: NLS.failedAddMembers,
	            					    sticky: false
	                				});
                				}else{
									ugSyncEvts.ugNotify.handler().addNotif({
	            						level: 'error',
	            						subtitle: NLS.failedAddMembers,
	            					    sticky: false
	                				});
								}
							}
						)
					},
					
					launchAddMemberPanel: function(){
						var addMemberdiv = document.querySelector(".addmemberTabView");
						var teamgridViewDiv = document.querySelector('.Members-gridView-View');
						var teamtileViewDiv = document.querySelector('.Members-tileView-View');
						addMemberdiv.empty();
						if(addMemberdiv.style.display=='block'){
							addMemberdiv.hide();
							teamgridViewDiv.removeClassName('teamview-opaque');
							teamtileViewDiv.removeClassName('teamview-opaque');
							return;
						}else{
							addMemberdiv.show();
							teamgridViewDiv.addClassName('teamview-opaque');
							teamtileViewDiv.addClassName('teamview-opaque');
						}
						var addMemberViewContainer =  UWA.createElement('div', {
							'class':'add-member-container',
							styles: {
								'width':'100%'
							}
						}).inject(addMemberdiv);

						var addMemberBodyContainer =  UWA.createElement('div', {
							'class':'add-member-body-container'
						}).inject(addMemberViewContainer);

						var addMemberbuttonContainer =  UWA.createElement('div', {
							'class':'add-member-button-container'
						}).inject(addMemberViewContainer);

						var memberTable = UWA.createElement('table', {
							'class': 'add-member-table'
						}).inject(addMemberBodyContainer);
						
						var membertr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(memberTable);
	
						UWA.createElement('td', {
							content: '<span>'+NLS.members+'</span>',
							'class':'add-member-table-col'
						}).inject(membertr);              

						var memberField = UWA.createElement('td', {'class': 'assignee-field add-member-table-col',}).inject(membertr);
						
						let optionsForMemberSearch = {
							placeholder: NLS.addMembersPlaceholder,
							multiSearchMode: true,
							allowFreeInputFlag: false,
							keepSearchResultsFlag: false,
							minLengthBeforeSearch: 3,
							searchQuery: function(value){
								return {query: SearchUtil.queryForPersonSearch(value), resourceid_not_in: UserGroupMemberModel.getMemberIDs()};
							}
						}
						MemberActions.membersAutoComplete = AutoCompleteUtil.drawAutoComplete(optionsForMemberSearch);
						MemberActions.membersAutoComplete.inject(memberField);
						
						MemberActions.startEventListeners();
						
						var memberFieldSearch = UWA.createElement('span',{
							'class':'fonticon fonticon-search  member-field-search',
							events:{
								click: function(e){
									MemberActions.onSearchClick();
								}
							}
						}).inject(memberField);
						
						MemberActions.myButtonPrimary = new WUXButton({ label: NLS.AccessRights_Button_Label_Add, disabled: true , emphasize: "primary" }).inject(addMemberbuttonContainer);
						var myButtonSecondary = new WUXButton({ label: NLS.AccessRights_Cancel, emphasize: "secondary" }).inject(addMemberbuttonContainer);
						MemberActions.myButtonPrimary.addEventListener("buttonclick", async function(e){						
							addMemberdiv.empty();
							let addData = []
							var that;
							const UsersGroupMembersTileView = require('DS/ENOUserGroupMgmt/Views/Tile/UsersGroupMembersTileView');
							that = await UsersGroupMembersTileView.getMemberTileView();
							MemberActions.membersAutoComplete.selectedItems.forEach(function(item){
								let itemDetails = {};
								itemDetails.identifier = item.options.grid.identifier;
								itemDetails.label = item.options.grid.label;
								itemDetails.id = item.options.grid.physicalId;
								addData.push(itemDetails);
							})
							UserGroupServicesController.addMembersToGroup(that, addData).then(function(resp) {
	                        	let data = resp.data;
								UserGroupServicesController.fetchUserGroupMembers(that.TreedocModel.UserGroupPID).then(function(response) {
									let Memberdata= [];
									var obj = JSON.parse(response);	
									data.forEach((elem) => {
										obj["data"].forEach(function(dataElem) {
											if(elem.id == dataElem.id || elem.id == dataElem.pid) {
												dataElem.id=elem.id ;
												dataElem.label = dataElem.ownerFullName;
												dataElem.identifier = dataElem.name	;
												Memberdata.push(dataElem);
											}
											
										});	
									});
									UserGroupMemberModel.appendRows(Memberdata);
									if(widget.ugMgmtMediator){
								    	widget.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',resp);
								    }else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-Membersappend-rows',resp);
									}
								    let userModel = UsersGroupModel.getRowModelByURI(resp.uri);
								    if(userModel == null || typeof userModel == 'undefined'){
										userModel = UsersGroupModel.getRowModelById(resp.id);
									}
									if(widget.ugMgmtMediator){
								    	widget.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
								    }else{
										ugSyncEvts.ugMgmtMediator.publish('usergroup-header-updated', {model:userModel.options.grid});
									}
								    addMemberdiv.hide();
									teamgridViewDiv.removeClassName('teamview-opaque');
									teamtileViewDiv.removeClassName('teamview-opaque');               
								 });						        
	                        });
						});
						myButtonSecondary.addEventListener("buttonclick", function(evt){
							addMemberdiv.empty();
							addMemberdiv.hide();
							teamgridViewDiv.removeClassName('teamview-opaque');
							teamtileViewDiv.removeClassName('teamview-opaque');
						});
						
					},
					
					startEventListeners: function(){
						MemberActions.membersAutoComplete.addEventListener('change',function(){
							if(MemberActions.membersAutoComplete.selectedItems && MemberActions.membersAutoComplete.selectedItems.length>0){
								MemberActions.myButtonPrimary.disabled = false;
							} else {
								MemberActions.myButtonPrimary.disabled = true;
							}
						});
					}

            };
            
            return MemberActions;

        });

define('DS/ENOUserGroupMgmt/Views/Dialogs/UserGroupGlobalAddMembers', [
		'DS/WAFData/WAFData',
		'UWA/Core',
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/Controls/Button',
		'DS/WUXAutoComplete/AutoComplete',
		'DS/ENOUserGroupMgmt/Utilities/AutoCompleteUtil',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Actions/MemberActions',
		'DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WAFData, UWACore,  WUXDialog, WUXImmersiveFrame, WUXButton, WUXAutoComplete, AutoCompleteUtil, UsersGroupModel, MemberActions, SearchUtil, NLS) {
	'use strict';
	
	let UserGroupGlobalAddMembers, dialog;
	
	let addMembersToGroups = async function(){
		let groups = UsersGroupModel.getSelectedRowsModel();
		if(groups.data.length < 1){
			if(widget.ugMgmtMediator){
	    		widget.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.errorGroupsSelectionAdd,
				    sticky: true
				});
			}else{
				ugSyncEvts.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.errorGroupsSelectionAdd,
				    sticky: true
				});
			}
    		return;
    	}
    	let groupDetails = [];
		for(var i=0;i<groups.data.length;i++){
			let groupInfo = {};
			groupInfo.id = groups.data[i].options.grid.id;
			groupInfo.modifyAccess = groups.data[i].options.grid.loginUserModifyAccess;
			groupInfo.memberList = groups.data[i].options.grid.memberList;
			groupDetails.push(groupInfo)
		}
		
		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(document.body);  
        let dialogContent = new UWA.Element('div',{
			"id":"addMembersSelectList",
			"class":""
		});
		
		//let personsModel = await UsersGroupSummaryDataGridView.userNameAutoComplete();
		let optionsForMemberSearch = {
			placeholder: NLS.addMembersPlaceholder,
			multiSearchMode: true,
			allowFreeInputFlag: false,
			keepSearchResultsFlag: false,
			minLengthBeforeSearch: 3,
			searchQuery: function(value){
				return {query: SearchUtil.queryForPersonSearch(value)};
			}
		}
		
		let memberSelectAutoComplete = AutoCompleteUtil.drawAutoComplete(optionsForMemberSearch);
		
		new UWA.Element("h6", {
			"id": "addMultipleMembersText",
			"text": NLS.multipleMembersText, 
			"styles":{"padding-bottom":"5px"}
		}).inject(dialogContent);
		
		var membersTable = UWA.createElement('table', {
			'class': 'add-member-table'
		}).inject(dialogContent);

		var membertr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(membersTable);

		UWA.createElement('td', {
			content: '<span>'+NLS.members+'</span>',
			'class':'add-member-table-col'
		}).inject(membertr);              

		var memberField = UWA.createElement('td', {'class': 'assignee-field add-member-table-col',}).inject(membertr);
		memberSelectAutoComplete.inject(memberField)
		
		memberSelectAutoComplete.addEventListener('change', function(e) {
				if(memberSelectAutoComplete.selectedItems && memberSelectAutoComplete.selectedItems.length > 0){
					dialog.buttons.Ok.disabled = false
				}
				else{
					dialog.buttons.Ok.disabled = true
				}
			});
			
		dialog = new WUXDialog({
	    	   modalFlag : true,
			   width : 500,
			   height : 150,
			   title: NLS.toolbarAddMembers,
    	       content: dialogContent,
    	       immersiveFrame: immersiveFrame,
    	       resizableFlag: true,
    	       buttons: {
    	         Ok: new WUXButton({
    	           label: NLS.buttonAdd,
    	           disabled: true,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             addMembersFromHome(groupDetails,memberSelectAutoComplete.selectedItems);
    	           }
    	         }),
    	         Cancel: new WUXButton({
    	           label: NLS.cancel,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             myDialog.close();
    	           }
    	         })
    	       }
    	     });
		
	}
	
	let addMembersFromHome = function(groupDetails,memberSelectAutoComplete){
		let memberIdsList = []
		if(memberSelectAutoComplete!=undefined){
			for(var i=0; i<memberSelectAutoComplete.length; i++){
				memberIdsList.push(memberSelectAutoComplete[i].options.name)
			}
		}
		MemberActions.addMembersMultipleGroups(groupDetails,memberIdsList);
		dialog.close();
	}

	UserGroupGlobalAddMembers={
    		addMembersToGroups: (memberIds) => {return addMembersToGroups(memberIds);}
    };
    
    return UserGroupGlobalAddMembers;
});




/**
 * @overview Displays the properties of a content.
 * @licence Copyright 2006-2020 Dassault Syst�mes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Views/UserGroupInfoPropWidget', [
										'UWA/Class/View',
										'UWA/Core',
										'DS/EditPropWidget/EditPropWidget',
										'DS/EditPropWidget/constants/EditPropConstants',
										'DS/EditPropWidget/models/EditPropModel',
										'DS/Windows/Dialog',
										'DS/Windows/ImmersiveFrame',
										'UWA/Class/Model',
										'UWA/Drivers/Alone',
										'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
									 	'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
									 	'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
										'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
										'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css'
], function(
		 View,
         Core,
         EditPropWidget,
         EditPropConstants,
         EditPropModel,
         WUXDialog, 
         WUXImmersiveFrame,
         UWAModel,
         Alone,
         UserGroupServicesController,
         RequestUtils,
         UsersGroupModel,
         NLS
) {	
	let _ugInfo;
    let UserGroupInfoPropWidget = {
    	render: function (propContainer,data) {
			let that = this;
			_ugInfo = data.model;
			let facets = [EditPropConstants.FACET_PROPERTIES/*,EditPropConstants.FACET_RELATIONS*/];
			that.parentContainer = this.container;
			let options_panel = {
					 typeOfDisplay: EditPropConstants.ONLY_EDIT_PROPERTIES, // Properties with ID card - ALL. ONLY_EDIT_PROPERTIES for only properties
			         selectionType: EditPropConstants.NO_SELECTION, // The edit properties panel will not listen the selection
			         'facets': facets,
			         'editMode': false,
			         'readOnly': widget.readOnlyUG ? true : false,
			         'extraNotif': true,
			         'context': {getSecurityContext: function () {return{SecurityContext: RequestUtils.SecurityContext}}},
			         'actions': [{
                         name: "action_close_panel",
                         text: NLS.infoCloseAction,
                         icon: "close",
                     }]
			};

			if(!RequestUtils.isAdmin && !(RequestUtils.contextUser==data.model.owner && (RequestUtils.isAuthor || RequestUtils.isLeader))  && !("Owner" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser] || "Manager" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser])){
				options_panel.readOnly = true;
			}
			
			this.EditPropWidget = new EditPropWidget(options_panel);	
			if (data.model.id) {
				that.loadModel(data.model.id,propContainer);
			}

			 
			return this;
		},
		
		getPropModel:  function (objModel) {
			var resultElementSelected = [];
			var selection = new EditPropModel({
				metatype: 'businessobject',
				objectId: objModel.objectId,
				source: "3DSpace",
				tenant: "OnPremise"
			});
			selection.set('isTransient', false);
			selection.addEvent('onSave', function (event) {
				UserGroupServicesController.fetchUserGroupById(_ugInfo.pid).then(
				success => {
					// Refresh id card header & user group summary summary grid and tile view //
					//success[0].requestFrom = "editPropWidget";
					let updatedUG = JSON.parse(success);
					updatedUG = updatedUG.groups[0];
					/*if(updatedUG.owner != _ugInfo.owner){
						//if owner is changed then close the facets and remove the corresponding user group from summary view
						if(widget.ugMgmtMediator){
							widget.ugMgmtMediator.publish('usergroup-owner-changed', updatedUG);	
							widget.ugMgmtMediator.publish('usergroup-back-to-summary', updatedUG);
						}else{
							ugSyncEvts.ugMgmtMediator.publish('usergroup-owner-changed', updatedUG);	
							ugSyncEvts.ugMgmtMediator.publish('usergroup-back-to-summary', updatedUG);
						}
					}*/
					if(widget.ugMgmtMediator){
						widget.ugMgmtMediator.publish('usergroup-data-updated', updatedUG);
					}else{
						ugSyncEvts.ugMgmtMediator.publish('usergroup-data-updated', updatedUG);
					}
				},
				failure =>{
					if(failure.error){
						if(widget.ugMgmtMediator){
							widget.ugNotify.handler().addNotif({
								level: 'error',
								subtitle: failure.error,
							    sticky: false
							});
						}else{
							ugSyncEvts.ugNotify.handler().addNotif({
								level: 'error',
								subtitle: failure.error,
							    sticky: false
							});
						}
					}else{
						if(widget.ugMgmtMediator){
							widget.ugNotify.handler().addNotif({
								level: 'error',
								subtitle: NLS.infoRefreshError,
							    sticky: false
							});
						}else{
							ugSyncEvts.ugNotify.handler().addNotif({
								level: 'error',
								subtitle: NLS.infoRefreshError,
							    sticky: false
							});
						}
					}
				});
			});

			resultElementSelected.push(selection);
			return resultElementSelected;
		},
		
		loadModel: function (objId,propContainer) {
			var that = this, results = that.getPropModel({objectId: objId});
			that.EditPropWidget.initDatas(results);
			
			this.EditPropWidget.elements.container.inject(propContainer);			
		}
    };
    
    return UserGroupInfoPropWidget;
});

/**
 * datagrid view for usergroup summary page
 */
define('DS/ENOUserGroupMgmt/Views/UsersGroupPropertiesView',
        [   'DS/ENOUserGroupMgmt/Views/UserGroupInfoPropWidget'
            ], function(
            		UserGroupInfoPropWidget
            ) {

    'use strict';
    let _serverresponse = {},  _usergroupInfo;
    let build = function(userGroupInfo){
    	_usergroupInfo = userGroupInfo;	
    	_usergroupInfo.model.id = _usergroupInfo.model.pid;
        if(!showView()){//member view has never been rendered
        	let elementID = widget.readOnlyUG ? 'usergroupDetailsPropertiesContainer' : 'usergroupPropertiesContainer';
        	let containerClass = widget.readOnlyUG ? '.usergroupdetails-facets-container' : '.usergroup-facets-container';
        
        	let containerDiv = UWA.createElement('div', {id: elementID,'class':'usergroup-properties-container'}); 
        	containerDiv.inject(document.querySelector(containerClass));
            UserGroupInfoPropWidget.render(containerDiv,_usergroupInfo);
        }
    };

    let hideView= function(){
        let elementID = widget.readOnlyUG ? 'usergroupDetailsPropertiesContainer' : 'usergroupPropertiesContainer';
        if(document.getElementById(elementID) != null){
            document.getElementById(elementID).style.display = 'none';
           
        }
    };
    
    let showView= function(){
        let elementID = widget.readOnlyUG ? 'usergroupDetailsPropertiesContainer' : 'usergroupPropertiesContainer';
        if(document.getElementById(elementID) != null){
            document.getElementById(elementID).style.display = 'block';
            return true;
        }
        return false;
    };
    
    let destroy= function() {
    	//
    };
    let UGMembersView = {
            init : (userGroupInfo) => { return build(userGroupInfo);},        
            hideView: () => {hideView();},
            destroy: () => {destroy();}
    };

    return UGMembersView;
});

define('DS/ENOUserGroupMgmt/Views/RightPanelInfoView', [
	'DS/ENOUserGroupMgmt/Views/UserGroupInfoPropWidget'
				], function(UserGroupInfoPropWidget) {
	'use strict';
	let displayContainer;
	const destroyViews = function() {
		 displayContainer.destroy();

	};
	var RightPanelInfoView = function(container) {
		this.container = container;
		displayContainer = new UWA.Element('div',{	
													"id":"usergroupInfoDisplayContainer",
													styles:{"height":"100%"}
												});
	};
	RightPanelInfoView.prototype.init = function(data,loadFor) {
		destroyViews(); // to destroy any pre-existing views
		if(loadFor == "userGroupInfo"){
			//Property Widget Edit //
		//	UserGroupInfoPropWidget.render(displayContainer,data);
		}
		this.container.appendChild(displayContainer);
	};
	RightPanelInfoView.prototype.destroy = function() {
		// destroy
		this.container.destroy();
	};

	return RightPanelInfoView;

});


/*
 * @module 'DS/ENOUserGroupMgmt/Views/Toolbar/UsersGroupMembersTabToolbarConfig'
 * this toolbar is used to create a toolbar of the UG members datagrid view
 */

define('DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupMembersTabToolbarConfig',
  ['DS/ENOUserGroupMgmt/Utilities/RequestUtils',
	  'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
	  'DS/CoreBase/WebUXGlobalEnums',
   'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
  function (RequestUtils, UsersGroupModel, WebUXGlobalEnums, NLS) {
	
	const WUXManagedFontIcons = WebUXGlobalEnums.WUXManagedFontIcons;
    let UGMemberTabToolbarConfig, 
    _viewData =  {
            menu:[
                {
                  type:'CheckItem',
                  title: NLS.gridView,                   
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-view-list"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', //TODO dummy method and function
                      func: 'doToggleView',
                      argument: {
                          "view":"GridView",
                          "curPage":"MembersTab"
                      }
                    },
                  tooltip:NLS.gridView
                },
                {
                  type:'CheckItem',
                  title: NLS.tileView,
                  state: "selected",
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-view-small-tile"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', 
                      func: 'doToggleView',
                      argument: {
                          "view":"TileView",
                          "curPage":"MembersTab"
                      }
                    },
                  tooltip:NLS.tileView
                }
              ]              
     };

  	 let getSelectMenu = function(model){
		let selectCount = model.getChildren().length;
		let unselectCount = model.getSelectedNodes().length;
		var selectMenuLabel = NLS.selectAll;
		selectMenuLabel = selectMenuLabel.replace("{count}",selectCount);
		var unselectMenuLabel = NLS.unselectAll;
		unselectMenuLabel = unselectMenuLabel.replace("{count}",unselectCount);
		let _selectMenu =  {
    		menu:[
                {
				  id: "selectAll",
                  type:'PushItem',
                  title: selectMenuLabel,
                  fonticon: {
                      family:1,
                      content:"wux-ui-3ds wux-ui-3ds-select-all"
                    },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'selectAllNodes',
                      argument:{
							"location": "members"
						}
                    }
                },
                {
				  id: "unselectAll",
                  type:'PushItem',
                  title: unselectMenuLabel,
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-select-none"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'unselectAllNodes',
                      argument:{
							"location": "members"
						}
                    }
                }
              ]
         } 
         return _selectMenu;          
    };
    
	let writetoolbarDefination = function (model) {
    	
		var isAdmin = RequestUtils.isAdmin;
		let selectMenu = getSelectMenu(model)
		let defination = {};
		let entries = [];
		let contextuser = RequestUtils.contextUser 
		if(!widget.readOnlyUG) {
		if(RequestUtils.isAdmin || 
				(UsersGroupModel.getUserGroupDetails().owner== RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor))
				||  "Owner" == UsersGroupModel.getUserGroupDetails()[contextuser] || "Manager" == UsersGroupModel.getUserGroupDetails()[contextuser]){
				entries.push({
					"id": "createContent",
					"dataElements": {
						"typeRepresentation": "functionIcon",
						"icon": {
							"iconName": "user-add",
							fontIconFamily: WUXManagedFontIcons.Font3DS
						},
						"action": {
							"module": "DS/ENOUserGroupMgmt/Actions/MemberActions",
							"func": "launchAddMemberPanel"
						}
					},
					"position": "far",
					"category": "create",
					"tooltip": NLS.addExistingMembers
				});
		}
		
		entries.push({
	        "id": "selection",
	        "domId": "selectionManage",
	        "class": "selectionManage",
	        "dataElements": {
	     	   "typeRepresentation": "functionMenuIcon",
	            "icon": {
	              "iconName": "select-on",
	              "fontIconFamily": 1
	            },
	            "value": selectMenu
	        },
	        "position": "far",
	        "tooltip": NLS.manageSelection,
	        "category": "action"
	    });  
	    } 
			   
        entries.push({
            "id": "view",
            "className": "contentViews",
            "dataElements": {
            	"typeRepresentation": "viewdropdown",
            	"icon": {
            		"iconName": "view-small-tile",
            		"fontIconFamily": 1
            	},                
            	"value":_viewData
            },
            "position": "far",
            "tooltip": NLS.tileView,
            "category": "action" 
        });
        if(!widget.readOnlyUG) {
        if(isAdmin ||  
        		(UsersGroupModel.getUserGroupDetails().owner== RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor))
        		||  "Owner" == UsersGroupModel.getUserGroupDetails()[contextuser] || "Manager" == UsersGroupModel.getUserGroupDetails()[contextuser]){
	        entries.push({
	        	"id": "removeContent",
	        	"dataElements": {
	        		"typeRepresentation": "functionIcon",
	 	            "icon": {
	 	            	"iconName": "remove",
	 	            	fontIconFamily: WUXManagedFontIcons.Font3DS
	 	            },
	 	            "action": {
	 	            	"module": "DS/ENOUserGroupMgmt/Views/Dialogs/RemoveMembers",
	 	            	"func": "removeMembersConfirmation"
	 	            }
	        	},
	        	"position": "far",
	        	"category": "action",
	        	"tooltip": NLS.removeMember 
	        });
        }
        }
        
        defination.entries = entries;      
        return JSON.stringify(defination);
    }
	
    UGMemberTabToolbarConfig={
      writetoolbarDefination: (model) => {return writetoolbarDefination(model);},
      destroy: function() {_dataGrid.destroy();_container.destroy();}
    };

    return UGMemberTabToolbarConfig;
  });

/* global define, widget */
/**
 * @overview Usergroup Lifecycle services
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Services/LifecycleServices', [
		'DS/ENOUserGroupMgmt/Utilities/IdCardUtil',
		'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/Controls/Button',
		'DS/Controls/ComboBox',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
	], 
	function(IdCardUtil, UserGroupServicesController, WUXDialog, WUXImmersiveFrame, WUXButton, WUXComboBox, NLS) {
		
	'use strict';
	
	let dialog;
	
	let visibilityChangeConfirmation = function(data){
	
		let immersiveFrame = new WUXImmersiveFrame();
		immersiveFrame.inject(document.body);
		
		let dialogContent = new UWA.Element('div',{
    			"id":"changeVisibilityOfUG",
    			"class":""
    	});		
		
		let _changeVisibilityContent = {};
		_changeVisibilityContent.fields = {};
		
		new UWA.Element("span", {
			"text": NLS.changeVisibilityDropDown, 
			styles: {
				'padding-right':'10px',
				'font-weight': 'bold'
			}
		}).inject(dialogContent);
		
		_changeVisibilityContent.fields.visibility = new WUXComboBox({
		      elementsList: [NLS.private, NLS.public],
		      enableSearchFlag: false,
		      displayStyle: "normal",
	  	}).inject(dialogContent);
	  	
	  	let activeConfirmMessage = new UWA.createElement('div',{
						  "id": "activeConfirmMessage",
						  "text": NLS.changeVisibilityDialogContent,
						  "class":"",
						  styles: {
							'padding-top':'10px',
							'display':'none'
						  }
				  	}).inject(dialogContent)
	  	
	  	_changeVisibilityContent.fields.visibility.addEventListener("change", function(){
				if(_changeVisibilityContent.fields.visibility.value==NLS.public){
					activeConfirmMessage.style.display = 'block';
				  	dialog.buttons.Ok.disabled = false;
				}
				else{
					var confirmContentPresent = document.getElementById("activeConfirmMessage");
					if(confirmContentPresent){
						activeConfirmMessage.style.display = 'none';
					}
					dialog.buttons.Ok.disabled = true;
				}
		});
	  	
	  	//_changeVisibilityContent.fields.inject(dialogContent);
		
		dialog = new WUXDialog({
	    	   modalFlag : true,
			   width : 500,
			   height : 150,
			   title: NLS.changeGroupVisibility,
    	       //content: NLS.changeVisibilityDialogContent,
    	       content: dialogContent,
    	       immersiveFrame: immersiveFrame,
    	       buttons: {
    	         Ok: new WUXButton({
    	           label: NLS.change,
    	           disabled: true,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             changeVisibility(data);
    	           }
    	         }),
    	         Cancel: new WUXButton({
    	           label: NLS.cancel,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             myDialog.close();
    	           }
    	         })
    	       }
	    });
	
	}

	
	let changeVisibility = function(data) {
		UserGroupServicesController.changeVisibility(data).then(
				success => {
					var userGroupPID = data.pid;
					var userGroupUUID = data.uri;
					IdCardUtil.syncUGUpdatedData(userGroupPID, userGroupUUID)
					if(widget.ugMgmtMediator){
						widget.ugNotify.handler().addNotif({
            						level: 'success',
            						subtitle: NLS.successChangeVisibility,
            					    sticky: false
                		});
                	}else{
						ugSyncEvts.ugNotify.handler().addNotif({
            						level: 'success',
            						subtitle: NLS.successChangeVisibility,
            					    sticky: false
                		});
					}
				},
				failure => {
					if(widget.ugMgmtMediator){
					widget.ugNotify.handler().addNotif({
            						level: 'error',
            						subtitle: NLS.failedChangeVisibility,
            					    sticky: false
                	});
                	}else{
						ugSyncEvts.ugNotify.handler().addNotif({
            						level: 'error',
            						subtitle: NLS.failedChangeVisibility,
            					    sticky: false
                		});
					}
				}
		);
		dialog.close();
	}
		
		
	let LifeCycleServices={
			visibilityChangeConfirmation: (data) => {return visibilityChangeConfirmation(data);}
    };
    
    return LifeCycleServices;
});

/**
 * UserGroup welcome panel.
 */
define('DS/ENOUserGroupMgmt/Views/Panels/WelcomePanel',
    [	'DS/Controls/Abstract',
        'DS/ENOUserGroupMgmt/Utilities/Constants',
        'DS/ENOUserGroupMgmt/Config/WelcomePanelActionsConfig',
        'DS/Controls/ProgressBar',
        'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],
    function (Abstract,
        Constants,
        WelcomePanelActionsConfig,
        WUXProgressBar,
        NLS) {

        "use strict";
        let userGroup, wcPanelAction = true;
        let userGroupWelcomePanel = Abstract.extend({
            activities: [
                {
                    "id": "list",
                    "title": NLS.APPHeader,
                    "actions": [{
                        "id": Constants.WELCOMEPANEL_ID_USERGROUPS,
                        "text": NLS.UserGroupSummaryTab,
                        "className": "wcpanel-usergroup",
                        "fonticon": "properties-pencil",
                        "isDefault": true
                    }]
                },
                {
                    "id": "creation",
                    "title": NLS.StartNewActivity,
                    "actions": [{
                        "id": Constants.WELCOMEPANEL_ID_CREATE_USERGROUP,
                        "text": NLS.newUserGroup,
                        "fonticon": "plus",
                        "className": "action-new",
                        "isNotHighlightable": "true"
                    }]
                }
           ],

            /** @options
             * modelEvents
             * container
             */
            init: function (options) {
                this.wPanelOptions = {
                    collapsed: false,
                    title: NLS.APPHeader,
                    subtitle: "",
                    activities: this.activities,
                    parentContainer: options.leftContainer,
                    selectedItem: Constants.WELCOMEPANEL_ID_USERGROUPS,
                    withTogglableButton: true,
                    modelEvents: options.modelEvents
                };

                //For loading the summary views initially, for performance improvement
                let userGroupActivity = WelcomePanelActionsConfig["userGroups"];

                require([userGroupActivity.loader.module], function (loader) {
                    userGroup = loader;
                });
            },

            getWPanelOptions: function () {
                return this.wPanelOptions;
            },

            //TODO remove, this method is not required as triptych is handling the initialization of welcome panel
            //No need to initialize in application layer
            //Just passing the option to triptych

            /*initialize : function() {
                //The initial state of the Welcome panel may have been persisted
                //Read the state from local storage (browser cache) if it is there and
                //set the Welcome panel state accordingly
                var collapsed = localStorage.getItem('usergroup-WelcomePanelCollapsed');
                var collapsePanel = false;
                if (collapsed !== null && collapsed === 'true') {
                    this.wPanelOptions.collapsed = true;
                }
                let wPanel =  new ENOXWelcomePanel(this.wPanelOptions);
                wPanel.render();
                this.registerEvents();
                return wPanel;
            },*/

            registerEvents: function () {
                let that = this;
                if(widget.ugMgmtMediator){
	                widget.ugMgmtMediator.subscribe('welcome-panel-action-selected', function (data) {
	                    if (wcPanelAction) {
	                        wcPanelAction = false;
	                        let activity = WelcomePanelActionsConfig[data.id];
	                        //To clear out the existing divs
	                        //without this it was creating multiple grid and tile containers inside widget container
	                        if (activity.content == 'summary_page') {
	                            widget.setValue("HomePage", activity.id);
	                            widget.ugMgmtMediator.publish("usergroup-welcome-panel-activity-selection", { id: activity.id });
	                            that.clearSummaryPage();
	                            that.showProgressBar();
	                            document.querySelector(".widget-container");
	                            that.loadSummaryPages(activity);
	                        } else {
	                            //save a variable in widget to track widget refresh, hack to have an work around event publishing issue after widget refresh
	                            //widget.setValue("isWidgetRefreshed",false);
	                            widget.setValue("isDialogOpened", true);
	                            that.loadDialogPages(activity);
	                        }
	
	                    }
	
	                });
	
	                widget.ugMgmtMediator.subscribe('welcome_note_icon_event', function (data) {
	                    //perform
	                    //console.log(data);
	                });
	
	                widget.ugMgmtMediator.subscribe('welcome-panel-toggle', function (data) {
	                    //perform
	                    //console.log(data);
	                });
	
	                widget.ugMgmtMediator.subscribe('welcome-panel-collapse', function (data) {
	                    //perform
	                    //console.log(data);
	                });
	
	                widget.ugMgmtMediator.subscribe('welcome-panel-expand', function (data) {
	                    //perform
	                    //console.log(data);
	                });
                
				} else {
					ugSyncEvts.ugMgmtMediator.subscribe('welcome-panel-action-selected', function(data) {
						if (wcPanelAction) {
							wcPanelAction = false;
							let activity = WelcomePanelActionsConfig[data.id];
							//To clear out the existing divs
							//without this it was creating multiple grid and tile containers inside widget container
							if (activity.content == 'summary_page') {
								widget.setValue("HomePage", activity.id);
								ugSyncEvts.ugMgmtMediator.publish("usergroup-welcome-panel-activity-selection", { id: activity.id });
								that.clearSummaryPage();
								that.showProgressBar();
								document.querySelector(".widget-container");
								that.loadSummaryPages(activity);
							} else {
								//save a variable in widget to track widget refresh, hack to have an work around event publishing issue after widget refresh
								//widget.setValue("isWidgetRefreshed",false);
								widget.setValue("isDialogOpened", true);
								that.loadDialogPages(activity);
							}

						}

					});

					ugSyncEvts.ugMgmtMediator.subscribe('welcome_note_icon_event', function(data) {
						//perform
						//console.log(data);
					});

					ugSyncEvts.ugMgmtMediator.subscribe('welcome-panel-toggle', function(data) {
						//perform
						//console.log(data);
					});

					ugSyncEvts.ugMgmtMediator.subscribe('welcome-panel-collapse', function(data) {
						//perform
						//console.log(data);
					});

					ugSyncEvts.ugMgmtMediator.subscribe('welcome-panel-expand', function(data) {
						//perform
						//console.log(data);
					});
					
				}
            },

            loadDialogPages: function (activity) {
                require([activity.loader.module], function (loader) {
                    //This is to open dialog pages, as there is no server call, no promise is returned
                    loader[activity.loader.func]();
                    wcPanelAction = true;
                    //Close all right panels
                    if(widget.ugMgmtMediator){
	                    //widget.ugMgmtMediator.publish('usergroup-info-close-click');
	                    widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                    widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
	                }else{
						//ugSyncEvts.ugMgmtMediator.publish('usergroup-info-close-click');
	                    ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                    ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
					}
                });
            },

            loadSummaryPages: function (activity) {
                let that = this, info = "UserGroup";
                //This returns a promise as it retrieves data from server
                userGroup[activity.loader.func]().then(function (container) {
                    that.hideProgressBar();
                    wcPanelAction = true;
                    if(widget.ugMgmtMediator){
                    	widget.ugMgmtMediator.publish('usergroup-back-to-summary');
                    }else{
						ugSyncEvts.ugMgmtMediator.publish('usergroup-back-to-summary');
					}
                    // that.activateInfoIcon(usergroup);
                });
                //todo nsm4
                //Close all right panels
                if(widget.ugMgmtMediator){
	                if (widget.getValue("propWidgetOpen")) { //Need to open properties in single click only if info panel is open.
	                    widget.ugMgmtMediator.publish('usergroup-header-info-click', { info: info });
	                }
	                //widget.ugMgmtMediator.publish('usergroup-info-close-click');
	                widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
                }else{
					if (widget.getValue("propWidgetOpen")) { //Need to open properties in single click only if info panel is open.
	                    ugSyncEvts.ugMgmtMediator.publish('usergroup-header-info-click', { info: info });
	                }
	                //ugSyncEvts.ugMgmtMediator.publish('usergroup-info-close-click');
	                ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
				}
            },

            clearSummaryPage: function () {
                let homepage = document.querySelector(".widget-container");
                let noOfChildren = homepage.children.length;
                for (let i = 0; i < noOfChildren; i++) {
                    homepage.children[0].remove();
                }
            },

            showProgressBar: function () {
                let homepage = document.querySelector(".widget-container");
                //to show the progress bar
                this.progressbar7 = new WUXProgressBar({
                    shape: "circular",
                    infiniteFlag: true,
                    emphasize: "info",
                    // disabled: true,
                    statusFlag: false,
                    height: 60,
                });
                this.progressbar7.inject(homepage);
                this.progressbar7.elements.container.setStyle("margin-left", "40%");
                this.progressbar7.elements.container.setStyle("margin-top", "20%");
            },

            hideProgressBar: function () {
                this.progressbar7.destroy();
            },

            activateInfoIcon: function (CurrentSummaryView) {
                //Need to highlight the info icon if the properties panel is opened
                if (widget.getValue("propWidgetOpen")) {
                    CurrentSummaryView.activateInfoIcon();
                }
            }

        });
        return userGroupWelcomePanel;
    }
);

/*
 * @module 'DS/ENOUserGroupMgmt/Views/Toolbar/UsersGroupMembersTabToolbarConfig'
 * this toolbar is used to create a toolbar of the UG members datagrid view
 */

define('DS/ENOUserGroupMgmt/Config/Toolbar/UserGroupAccessRightsToolbarConfig',
		['DS/ENOUserGroupMgmt/Utilities/RequestUtils',
        'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
   'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
  function (RequestUtils, UsersGroupModel,NLS) {
    let UGMemberTabToolbarConfig, 
    _viewData =  {
            menu:[
                {
                  type:'CheckItem',
                  title: NLS.gridView,                   
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-view-list"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', //TODO dummy method and function
                      func: 'doToggleView',
                      argument: {
                          "view":"GridView",
                          "curPage":"Access Rights"
                      }
                    },
                  tooltip:NLS.gridView
                },
                {
                  type:'CheckItem',
                  title: NLS.tileView,
                  state: "selected",
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-view-small-tile"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', 
                      func: 'doToggleView',
                      argument: {
                          "view":"TileView",
                          "curPage":"Access Rights"
                      }
                    },
                  tooltip:NLS.tileView
                }
              ]              
    };

  	let getSelectMenu = function(model){
		let selectCount = model.getChildren().length;
		let unselectCount = model.getSelectedNodes().length;
		var selectMenuLabel = NLS.selectAll;
		selectMenuLabel = selectMenuLabel.replace("{count}",selectCount);
		var unselectMenuLabel = NLS.unselectAll;
		unselectMenuLabel = unselectMenuLabel.replace("{count}",unselectCount);
		let _selectMenu =  {
    		menu:[
                {
				  id: "selectAll",
                  type:'PushItem',
                  title: selectMenuLabel,
                  fonticon: {
                      family:1,
                      content:"wux-ui-3ds wux-ui-3ds-select-all"
                    },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'selectAllNodes',
                      argument:{
							"location": "responsibilities"
						}
                    }
                },
                {
				  id: "unselectAll",
                  type:'PushItem',
                  title: unselectMenuLabel,
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-select-none"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'unselectAllNodes',
                      argument:{
							"location": "responsibilities"
						}
                    }
                }
              ]
         } 
         return _selectMenu;          
    };
    
	let writetoolbarDefination = function (model) {
    	
    	let selectMenu = getSelectMenu(model)
		let defination = {};
		let entries = [];
		if( RequestUtils.isAdmin ||
				(UsersGroupModel.getUserGroupDetails().owner== RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor))
				|| "Owner" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser]){
				entries.push({
					"id": "addContext",
					"className": "menu-context",
					"dataElements": {
					  "typeRepresentation": "functionIcon",
					  "icon": {
						"iconName": "user-add",
						"fontIconFamily": 1
					  }
					},
					"position": "far",
					"action": {
					  module: 'DS/ENOUserGroupMgmt/Actions/UserGroupAccessRightsActions',
					  func: 'launchAddRespPanel',
					},
					"tooltip":NLS.addAccessRight,
					"category": "addRemove"
				  });
				  
				entries.push({
					"id": "revokeResp",
					"className": "menu-context",
					"dataElements": {
					  "typeRepresentation": "functionIcon",
					  "icon": {
						"iconName": "block",
						"fontIconFamily": 1
					  }
					},
					"position": "far",
					"action": {
					  module: 'DS/ENOUserGroupMgmt/Views/Dialogs/UserGroupRevokeAccessDialog',
					  func: 'revokeAccessConfirmation',
					},
					"tooltip":NLS.RevokeAccess,
					"category": "addRemove"
				  });
		}
		
		entries.push({
	        "id": "selection",
	        "domId": "selectionManage",
	        "class": "selectionManage",
	        "dataElements": {
	     	   "typeRepresentation": "functionMenuIcon",
	            "icon": {
	              "iconName": "select-on",
	              "fontIconFamily": 1
	            },
	            "value": selectMenu
	        },
	        "position": "far",
	        "tooltip": NLS.manageSelection,
	        "category": "action"
	    });     
			   
        entries.push({
            "id": "view",
            "className": "contentViews",
            "dataElements": {
            	"typeRepresentation": "viewdropdown",
            	"icon": {
            		"iconName": "view-small-tile",
            		"fontIconFamily": 1
            	},                
            	"value":_viewData
            },
            "position": "far",
            "tooltip": NLS.tileView,
            "category": "action" 
        });
        
        defination.entries = entries;      
        return JSON.stringify(defination);
    }
	
    UGMemberTabToolbarConfig={
      writetoolbarDefination: (model) => {return writetoolbarDefination(model);},
      destroy: function() {_dataGrid.destroy();_container.destroy();}
    };

    return UGMemberTabToolbarConfig;
  });

/* global define, widget */
/**
 * @overview User Group Management
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/RightPanelSplitView',
['DS/ENOUserGroupMgmt/Components/Wrappers/SplitViewWrapper',
'DS/ENOUserGroupMgmt/Views/RightPanelInfoView',
'DS/ENOUserGroupMgmt/Utilities/IdCardUtil'
	],
function(SplitViewWrapper,RightPanelInfoView,IdCardUtil) {

    'use strict';
    var RightPanelSplitView = function () { };
    /**
     * RightPanelSplitView to show the right side slidein.
     * @param  {[Mediator]} applicationChannel [required:Mediator object for communication]
     *
     */
    RightPanelSplitView.prototype.getSplitView = function (appChannel) {
        var sView = new SplitViewWrapper();
        var split_options = {
          modelEvents: appChannel,
          withtransition: false,
          withoverflowhidden: false,
          params: {
        	// leftWidth calculates width and left position
            leftWidth: 65,
            rightWidth: 75,
			leftMinWidth:25,
            leftVisible: true,
            rightVisible: false
          },
          rightMaximizer: false,
          leftMaximizer: false,
          resizable: true
          //mobileOptim: true
        };
        sView.init(split_options);
    //    sView.setContextForGesture();
        return sView;
      };
      RightPanelSplitView.prototype.setSplitviewEvents = function(splitView){

          var me = splitView;
          var selectedId = "";
          let rightContainer = me.getRightViewWrapper();
          let rightPanelInfoView = new RightPanelInfoView(rightContainer);
          // To handle ID card user group Info click open and close in edit prop widget //
          if(widget.ugMgmtMediator){
			  widget.ugMgmtMediator.subscribe('usergroup-header-info-click', function (data) {
	        	  // Publish the event to make sure if the task panel is open we clear the task panel open flag //
	        	  // This will avoid the scenario where we open the task panel first, then usergroup prop widget, close prop widget and open the task panel again//
	        	  widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	        	  widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
	        	  
	        	  IdCardUtil.infoIconActive();
	        	  rightPanelInfoView.init(data,"userGroupInfo");
	        	  me._showSide("right");
	        	  widget.propWidgetOpen = true;
	          });
	          
	           widget.ugMgmtMediator.subscribe('usergroup-info-close-click', function (data) {
	              if (me._rightVisible) {
	            	  IdCardUtil.infoIconInActive();
	                  me._hideSide("right");
	                  widget.propWidgetOpen = false;
	                }
	          });
	          
	
	          widget.ugMgmtMediator.subscribe('usergroup-content-preview-delete', function (data) {
	        	  if (me._rightVisible) {
	        		  if(data.model.ids.includes(widget.contentPreviewId)){
	        			  me._hideSide("right");
	        		  }
	        	  }
	          });
	          widget.ugMgmtMediator.subscribe('usergroup-content-preview-close', function (data) {
	        	  if (me._rightVisible) {
	        		me._hideSide("right");
	        	  }
	          });
			  
          }else{
	          ugSyncEvts.ugMgmtMediator.subscribe('usergroup-header-info-click', function (data) {
	        	  // Publish the event to make sure if the task panel is open we clear the task panel open flag //
	        	  // This will avoid the scenario where we open the task panel first, then usergroup prop widget, close prop widget and open the task panel again//
	        	  ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	        	  ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
	        	  
	        	  IdCardUtil.infoIconActive();
	        	  rightPanelInfoView.init(data,"userGroupInfo");
	        	  me._showSide("right");
	        	  ugSyncEvts.propWidgetOpen = true;
	          });
	          
	           ugSyncEvts.ugMgmtMediator.subscribe('usergroup-info-close-click', function (data) {
	              if (me._rightVisible) {
	            	  IdCardUtil.infoIconInActive();
	                  me._hideSide("right");
	                  ugSyncEvts.propWidgetOpen = false;
	                }
	          });
	          
	
	          ugSyncEvts.ugMgmtMediator.subscribe('usergroup-content-preview-delete', function (data) {
	        	  if (me._rightVisible) {
	        		  if(data.model.ids.includes(widget.contentPreviewId)){
	        			  me._hideSide("right");
	        		  }
	        	  }
	          });
	          ugSyncEvts.ugMgmtMediator.subscribe('usergroup-content-preview-close', function (data) {
	        	  if (me._rightVisible) {
	        		me._hideSide("right");
	        	  }
	          }); 
          }
          
      };
      
      return RightPanelSplitView;

});

define('DS/ENOUserGroupMgmt/Views/UsersGroupDetailsTabsView', [
  'DS/Controls/TabBar',
  'DS/ENOUserGroupMgmt/Config/UsersGroupTabsConfig'
  
],
  function (WUXTabBar,UsersGroupTabsConfig) {
	'use strict';
	let _usergroupTabs, _currentTabIndex, UserGroupTabInstances = {}, _usergroupDetailInfoModel = {};
	
	let ontabClick = function(args){
		let seltab = args.options.value;
		if(typeof seltab == 'undefined'){
			seltab = args.dsModel.buttonGroup.value[0]; //this is to get the selected tab from the model
		}
		if (seltab === _currentTabIndex){
			return;
		}
		var ntabs =["members","properties"];
		UserGroupTabInstances[ntabs[seltab]].init(_usergroupDetailInfoModel);
		if(typeof _currentTabIndex != 'undefined'){
			UserGroupTabInstances[ntabs[_currentTabIndex]].hideView();
		}			
		_currentTabIndex = seltab;		
	};
   
	let build = function(container,usergroupInfoModel){
		_usergroupDetailInfoModel = usergroupInfoModel;
		widget.readOnlyUG = true;		
		_usergroupTabs = new WUXTabBar({
            displayStyle: 'strip',
            showComboBoxFlag: true,
            editableFlag: false,
            multiSelFlag: false,
            reindexFlag: true,
            touchMode: true,
            centeredFlag: false,
            allowUnsafeHTMLOnTabButton: true
        });
		UsersGroupTabsConfig.forEach((tab) => {
			if(tab.id == "accessRights")
					return;
		    _usergroupTabs.add(tab); //adding the tabs
		});
		_usergroupTabs.inject(container);
		
		//draw the tab contents
		initializeUserGroupTabs();	
    };
    
	let initializeUserGroupTabs = function(){		
		new Promise(function (resolve, reject){
			let promiseArr = [];
			UsersGroupTabsConfig.forEach((tab, index)=>
			{
				if(tab.id == "accessRights")
					return;				
				if(tab.loader != ""){
					promiseArr[index] = new Promise(function (resolve, reject){
						require([tab.loader], function (loader) {
							UserGroupTabInstances[tab.id] = loader;	
							resolve();
						});
					})
				}				
			});
			Promise.all(promiseArr).then(() => {
				resolve();
			});			
		}).then(function () {
			let args = {};
			args.options = {};
			args.options.value =0;
			ontabClick(args);
			//event to be called when clicked on any tab
			_usergroupTabs.addEventListener('tabButtonClick', function(args){
				ontabClick(args);
			});
			_usergroupTabs.addEventListener('change', function(args){
				ontabClick(args);
			});
			
		}, function () {
			//Error during tab click
		});
		
		
	};
	 let destroy = function(){	    	
		try{
			_currentTabIndex = undefined; //this should be the first line, if some error occurs afterward, that would be an issue otherwise			
			Object.keys(UserGroupTabInstances).map((tab) => {
				UserGroupTabInstances[tab].destroy();
			});
			if(_usergroupTabs != undefined){
				_usergroupTabs.destroy();
			}
			_usergroupDetailInfoModel = {};
		}catch(e){
	    		//TODO check why this error: TypeError: Cannot read property '__resizeListeners__' of undefined
			console.log(e);
		}	
	};   

    let UsersGroupDetailTabsView = {
            init : (container, model) => { return build(container, model);}, 
            destroy: () => {return destroy();}
    };

    return UsersGroupDetailTabsView;
  });

/*
 * @module 'DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupSummaryToolbarConfig'
 * this toolbar is used to create a toolbar of the UG summary datagrid view  
 */

define('DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupSummaryToolbarConfig',
  [ 	'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
  		'DS/CoreBase/WebUXGlobalEnums',
	  'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
  function (RequestUtils, WebUXGlobalEnums, NLS) {
	
	const WUXManagedFontIcons = WebUXGlobalEnums.WUXManagedFontIcons;
	let UserGroupDataGridViewToolbar, 
    _viewData =  {
    		menu:[
                {
                  type:'CheckItem',
                  title: NLS.gridView,
                  fonticon: {
                      family:1,
                      content:"wux-ui-3ds wux-ui-3ds-view-list"
                    },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', 
                      func: 'doToggleView',
                      argument: {
                          "view":"GridView",
                          "curPage":"UserGroupSummary"
                      }
                    },
                  tooltip:NLS.gridView
                },
                {
                  type:'CheckItem',
                  title: NLS.tileView,
                  state: "selected",
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-view-small-tile"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Views/ToggleViews', 
                      func: 'doToggleView',
                      argument: {
                          "view":"TileView",
                          "curPage":"UserGroupSummary"
                      }
                    },
                  tooltip:NLS.tileView
                }
              ]              
    };
  	
  	let getSelectMenu = function(model){
		let selectCount = model.getChildren().length;
		let unselectCount = model.getSelectedNodes().length;
		var selectMenuLabel = NLS.selectAll;
		selectMenuLabel = selectMenuLabel.replace("{count}",selectCount);
		var unselectMenuLabel = NLS.unselectAll;
		unselectMenuLabel = unselectMenuLabel.replace("{count}",unselectCount);
		let _selectMenu =  {
    		menu:[
                {
				  id: "selectAll",
                  type:'PushItem',
                  title: selectMenuLabel,
                  fonticon: {
                      family:1,
                      content:"wux-ui-3ds wux-ui-3ds-select-all"
                    },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'selectAllNodes',
                      argument:{
							"location": "summary"
						}
                    }
                },
                {
				  id: "unselectAll",
                  type:'PushItem',
                  title: unselectMenuLabel,
                  fonticon: {
                    family:1,
                    content:"wux-ui-3ds wux-ui-3ds-select-none"
                  },
                  action: {
                      module: 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands', 
                      func: 'unselectAllNodes',
                      argument:{
							"location": "summary"
						}
                    }
                }
              ]
         } 
         return _selectMenu;          
    };
	
    let writetoolbarDefination = function (model) {
    //var viewData = addFilterToolbarItems(filterPreference);
    let selectMenu = getSelectMenu(model)
    var isAdmin = RequestUtils.isAdmin;
    let entries = [];
    let defination = {};
    entries.push({
        "id": "back",
        "dataElements": {
          "typeRepresentation": "functionIcon",
          "icon": {
            "iconName": "home",
            "fontIconFamily": 1
          }
        },
        "action": {
          module: 'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView', //TODO dummy method and function
          func: 'backToUserGroupSummary',
        },
        
        "category": "status",
        "tooltip": NLS.home
      });
          
    if(RequestUtils.isAdmin || RequestUtils.isAuthor || RequestUtils.isLeader ) {
    	entries.push({
            "id": "createUserGroup",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                  "iconName": "users-group-add",
                  fontIconFamily: WUXManagedFontIcons.Font3DS
                }
            },
            "action": {
                module: 'DS/ENOUserGroupMgmt/Views/Dialogs/InitiateUsersGroupDialog', //TODO dummy method and function
                func: 'InitiateUserGroupDialog',
              },
            "position": "far",
            "category": "create",
            "tooltip": NLS.newUserGroup
          });
          
        entries.push({
            "id": "addMembersToUserGroup",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                  "iconName": "user-add",
                  fontIconFamily: WUXManagedFontIcons.Font3DS
                }
            },
            "action": {
                module: 'DS/ENOUserGroupMgmt/Views/Dialogs/UserGroupGlobalAddMembers',
                func: 'addMembersToGroups',
              },
            "position": "far",
            "category": "create",
            "tooltip": NLS.toolbarAddMembers
          });
          
        entries.push({
            "id": "removeMembersFromUserGroup",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                  "iconName": "user-delete",
                  fontIconFamily: WUXManagedFontIcons.Font3DS
                }
            },
            "action": {
                module: 'DS/ENOUserGroupMgmt/Views/Dialogs/RemoveMembers',
                func: 'removeMembersFromGroups',
              },
            "position": "far",
            "category": "create",
            "tooltip": NLS.toolbarRemoveMembers
          });
         
    }
   
    //if(isAdmin || filterPreference=="owned"){
    	 entries.push({
    	        "id": "deleteUserGroup",
    	        "dataElements": {
    	          "typeRepresentation": "functionIcon",
    	          "icon": {
    	              "iconName": "trash",
    	              fontIconFamily: WUXManagedFontIcons.Font3DS
    	            },
    	            "action": {
    	                "module": "DS/ENOUserGroupMgmt/Views/Dialogs/RemoveUsersGroup",
    	                "func": "removeConfirmation"
    	              }
    	        },
    	        "position": "far",
    	        "category": "create",
    	        "tooltip": NLS.deleteSelectedGroups 
    	      });	
    //}
	
	entries.push({
        "id": "selection",
        "domId": "selectionManage",
        "class": "selectionManage",
        "dataElements": {
     	   "typeRepresentation": "functionMenuIcon",
            "icon": {
              "iconName": "select-on",
              "fontIconFamily": 1
            },
            "value": selectMenu
        },
        "position": "far",
        "tooltip": NLS.manageSelection,
        "category": "action"
    });
    
    if(!top.isMobile) {
    	entries.push({
            "id": "exportUserGroup",
            "dataElements": {
              "typeRepresentation": "functionIcon",
              "icon": {
                  "iconName": "export",
                  fontIconFamily: WUXManagedFontIcons.Font3DS
                }
            },
            "action": {
                module: 'DS/ENOUserGroupMgmt/Actions/UsersGroupActions', 
                func: 'exportUserGroups',
              },
            "position": "far",
            "category": "action",
            "tooltip": NLS.export
       });
    }
    
    entries.push({
        "id": "view",
        "className": "userGroupViews",
        "dataElements": {
     	   "typeRepresentation": "viewdropdown",
            "icon": {
              "iconName": "view-small-tile",
              "fontIconFamily": 1
            },
            
          "value":_viewData
        },
        "position": "far",
        "tooltip": NLS.tileView,
        "category": "action" //same category will be grouped together
    });

    defination.entries = entries; 
    defination.typeRepresentations = {
       	 "sortingdropdown" : {
             "stdTemplate": "functionMenuIcon",
             "semantics": {
               label: "action",
               icon: "sorting"
             }
           },
        "viewdropdown": {
            "stdTemplate": "functionMenuIcon",
            "semantics": {
            	label: "action",
                icon: "sorting"
            },
            "position": "far",
            "tooltip":{
  		        "text": "view",
  		        "position": "far"
  		      }
 		}
    };
      return JSON.stringify(defination);
    };
    
    
    
    UserGroupDataGridViewToolbar = {
    		writetoolbarDefination: (model) => {return writetoolbarDefination(model);},
    		destroy: function() {_dataGrid.destroy();_container.destroy();},
    };

    return UserGroupDataGridViewToolbar;
  });

/**
 * datagrid view for usergroup summary page
 */
define('DS/ENOUserGroupMgmt/Views/Tile/UsersGroupDetailMembersTileView',
        [   
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView'
            ], function(
            		WrapperTileView
            ) {

    'use strict';   
    let _model;
    let build = function(model){
        if(model){
            _model = model;
        }else{ //create an empty model otherwise TODO see if it's required
            _model = new TreeDocument({
                useAsyncPreExpand: true
            });
        }
        var tileViewDiv = UWA.createElement("div", {id:'tileViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "GroupDetail-tileView-View showView nonVisible"
        });
        let dataTileViewContainer = WrapperTileView.build(model, tileViewDiv);
        return dataTileViewContainer;
    };  

    let contexualMenuCallback = function(){    
        let _tileView = WrapperTileView.tileView();
        _tileView.onContextualEvent = {
            'callback': function () {
                var menu = [];
                return menu; 
            }
        }
    };


    let UsersGroupDetailMembersTileView={
            build : (model) => { return build(model);},
            contexualMenuCallback : () =>{return contexualMenuCallback();}
    };

    return UsersGroupDetailMembersTileView;
});

/* global define, widget */
/**
  * @overview User group Management - user group Model
  * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
  * @version 1.0.
  * @access private
  */
define('DS/ENOUserGroupMgmt/Model/UsersGroupDetailMemberModel',
[
    'DS/TreeModel/TreeDocument',
    'DS/TreeModel/TreeNodeModel',
    'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
    'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
    'DS/WebappsUtils/WebappsUtils',
    'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],
    function(
            TreeDocument,
            TreeNodeModel,
            DataFormatter,
            RequestUtils,
            WebappsUtils,
            NLS
    ) {
    'use strict';
    let model = new TreeDocument();
    let prepareTreeDocumentModel = function(response,userGroupInfo){
		//alert("rr");
        var userGroupState=userGroupInfo.model.Maturity_State;
        model.prepareUpdate(); 
		var obj = JSON.parse(response);		
        obj["data"].forEach(function(dataElem) {
			 var _contextualMenu=[];
           
            var thumbnailIcon,typeIcon;
			thumbnailIcon=onMemberNodeAssigneesCellRequest(dataElem.ownerFullName,dataElem.name);    
			typeIcon=WebappsUtils.getWebappsAssetUrl("ENOUserGroupMgmt","icons/16/I_Person16.png");
            var root = new TreeNodeModel({
                label: dataElem.ownerFullName,
                id: dataElem.pid,
                width: 300,
				grid: DataFormatter.memberGridData(dataElem),
				thumbnail : thumbnailIcon,
				icons : [typeIcon],
				contextualMenu : [NLS.ContextMenu]
            });
                                                                            
            model.addRoot(root);
        });
        model.pushUpdate();
        return model;
    };
	
    let onMemberNodeAssigneesCellRequest= function (name,userName) {
        
        
          var ownerIconURL = "/api/user/getpicture/login/"+userName+"/format/normal";
          var swymOwnerIconUrl =RequestUtils.populate3DSpaceURL.swymURL+ownerIconURL;               
          var responsible = new UWA.Element("div", {});
          var owner = new UWA.Element("div", {
            class:'assignee'
          });
          var ownerIcon = "";
          if(RequestUtils.populate3DSpaceURL.swymURL!=undefined){
            ownerIcon = UWA.createElement('img', {
                class: "member-userIcon",
                src: swymOwnerIconUrl
            });
          } else {
            var iconDetails = getAvatarDetails(name);
            ownerIcon = UWA.createElement('div', {
                  html: iconDetails.avatarStr,
                  "title": name,
                  class: "member-avatarIcon"
              });
            ownerIcon.style.setProperty("background",iconDetails.avatarColor);
          }

        return ownerIcon;
    };
 
                              
    let getAvatarDetails= function (name) {
        var options = {};
        var backgroundColors = [
          [7, 139, 250],
          [249, 87, 83],
          [111, 188, 75],
          [158, 132, 106],
          [170, 75, 178],
          [26, 153, 123],
          [245, 100, 163],
          [255, 138, 46],
        ]
        var initials = name.match(/\b\w/g);
        var firstLetter = initials[0].toUpperCase();
        var lastLetter = initials[initials.length - 1].toUpperCase();

        var avatarStr = (firstLetter + lastLetter);

        var i = Math.ceil((firstLetter.charCodeAt(0) + lastLetter.charCodeAt(0)) % backgroundColors.length);
        var avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";

        options.name = name;
        options.avatarStr = avatarStr;
        options.avatarColor = avatarColor;

        return options;
      };
         
    let destroy = function(){
    	model = new TreeDocument();
    };
    
	
	let setContextUGInfo = function(ugInfo){
		usergroupInfo = ugInfo;
	};

	let usergroupInfo = {
			
	};  
	let getMemberIDs = function(){
		if( model!= undefined){
			var children = model.getChildren();
			var id=[];
			for(var i=0;i<children.length;i++){
				id.push(children[i]._options.grid.id);
			}
			return id;
		}
	};
    let UserGroupDetailMemberModel = {
    		createModel : (response,userGroupInfo) => {return prepareTreeDocumentModel(response,userGroupInfo);},
    		getModel : () => {return model;},
    		getMemberIDs: () => {return getMemberIDs();},
    		destroy : () => {return destroy();},
            setContextUGInfo :(ugInfo) => {return setContextUGInfo(ugInfo);},
			usergroupInfo:()=>{return usergroupInfo; }
    }
    return UserGroupDetailMemberModel;

});

/* global define, widget */
/**
 * @overview Subscription Management
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/Dialogs/UserGroupRevokeAccessDialog', [
		'DS/WAFData/WAFData',
		'UWA/Core',
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/Controls/Button',
		'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
		'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
		'DS/ENOUserGroupMgmt/Actions/UserGroupAccessRightsActions',
		'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WAFData, UWACore,  WUXDialog, WUXImmersiveFrame, WUXButton,
			UserGroupAccessRightsModel,WrapperTileView, UserGroupAccessRightsActions, RequestUtils, NLS) {
	'use strict';
	let RemoveMembers,dialog;
	let revokeAccessConfirmation = function(removeDetails){
		var that =UserGroupAccessRightsModel.usergroupInfo();
        if(removeDetails.data === undefined){
            removeDetails = UserGroupAccessRightsModel.getSelectedRowsModel();
        }
		
    	if(removeDetails.data.length < 1){
			if(widget.ugMgmtMediator){
	    		widget.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.ErrorMembersRemoveSelection,
				    sticky: true
				});
			}else{
				widget.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.ErrorMembersRemoveSelection,
				    sticky: true
				});
			}
    		return;
    	}
    	
    	var ulCannotDelete = UWA.createElement('ul',{
			"class":"",
			"styles":{"list-style-type":"circle"}
		});
    	var idsToDelete = [];
		var idsCannotDelete = [];
		for(var i=0;i<removeDetails.data.length;i++){
			if(removeDetails.data[i].options.grid.name === RequestUtils.contextUser &&  UserGroupAccessRightsModel.usergroupInfo().model.owner !== RequestUtils.contextUser){
				idsCannotDelete.push({name:removeDetails.data[i].options.grid.name, type:removeDetails.data[i].options.grid.type});
				ulCannotDelete.appendChild(UWA.createElement('li',{
					"class":"",
					styles : {"white-space": "nowrap;"},
					"html": [
						UWA.createElement('span',{
							"class":"wux-ui-3ds wux-ui-3ds-1x "
						}),
						UWA.createElement('span',{
							"html": "&nbsp;" + removeDetails.data[i].options.grid.personName
						})
						
					]
				}));
			} else {
				idsToDelete.push({name:removeDetails.data[i].options.grid.name, type:removeDetails.data[i].options.grid.type});
			}
		}
		
		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(document.body);  
        let dialogueContent = new UWA.Element('div',{
			"id":"removeMembersWarning",
			"class":""
			});
    	var header = NLS.RevokeAccessDialogHeader;
        dialogueContent.appendChild(UWA.createElement('div',{
        				"class":"",
    					"text": NLS.RevokeAccessDialogMsg
    				  }));
    	if(idsCannotDelete.length > 0){
            dialogueContent.appendChild(UWA.createElement('div',{
            				"class":"revokeDialogList",
        					"text": NLS.RevokeAccessDialogExceptionMsg
        				  }));
        	dialogueContent.appendChild(UWA.createElement('div',{
            				"class":"",
        					"html": ulCannotDelete
        				  }));
    	}

    	dialog = new WUXDialog({
	    	   modalFlag : true,
			   width : 500,
			   height : 200,
			   title: header,
    	       content: dialogueContent,
    	       immersiveFrame: immersiveFrame,
    	       buttons: {
    	         Ok: new WUXButton({
    	           label: NLS.ok,
    	           disabled : idsToDelete.length > 0 ? false:true,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             revokeaccessConfirmed(that,idsToDelete);
    	           }
    	         }),
    	         Cancel: new WUXButton({
    	           label: NLS.cancel,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             myDialog.close();
    	           }
    	         })
    	       }
    	     });
    };
    
    let revokeaccessConfirmed = function(that,ids){
    	var memberArray = [];
    	for(var index = 0 ; index<ids.length; index++){
    		memberArray.push({ "username": ids[index].name, "type":ids[index].type});
    	}
    	var userRevokeaccessData = {
				"data": memberArray
		};
    	UserGroupAccessRightsActions.RevokeAccessFromUserGroup(that,userRevokeaccessData);
		dialog.close();
	};
    
    RemoveMembers={
    		revokeAccessConfirmation: (dataToRemove) => {return revokeAccessConfirmation(dataToRemove);}
    };
    
    return RemoveMembers;
});


define('DS/ENOUserGroupMgmt/Views/Grid/UserGroupSummaryGridCustomColumns', 
    [
	 'DS/ENOUserGroupMgmt/Utilities/DateUtils',
     'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ], 
    function(DateUtils, NLS) {
    
    'use strict';
    
    let onModifiedDateCellRequest= function (cellInfos) {
        let reusableContent;    	
		if (!cellInfos.isHeader) {
			reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_modified_');
			 if (reusableContent) {
				 let sdate = cellInfos.nodeModel.options.grid.modified || "";
				 let strdate = DateUtils.formatDateTimeString(new Date(sdate));
				 reusableContent.getChildren()[0].setHTML(strdate);
				 cellInfos.cellView._setReusableContent(reusableContent); 
			 }
		}
    };
 
    let UserGroupSummaryGridCustomColumns = {
        onModifiedDateCellRequest : (cellInfos) => { return onModifiedDateCellRequest(cellInfos);}
    };
    
    return UserGroupSummaryGridCustomColumns;
    
 });


define('DS/ENOUserGroupMgmt/Views/UsersGroupTabsView', [
  'DS/Controls/TabBar',
  'DS/ENOUserGroupMgmt/Config/UsersGroupTabsConfig'
  
],
  function (WUXTabBar,UserGroupTabsConfig) {
	'use strict';
	let _usergroupTabs, _currentTabIndex, UserGroupTabInstances = {}, _usergroupInfoModel = {};
	
	let UserGroupTabsView = function(container,usergroupInfoModel){
		_usergroupInfoModel = usergroupInfoModel;
		this.container = container;
	};

    let ontabClick = function(args){
		let seltab = args.options.value;
		if(typeof seltab == 'undefined'){
			seltab = args.dsModel.buttonGroup.value[0]; //this is to get the selected tab from the model
		}
		if (seltab === _currentTabIndex){
			return;
		}
		var ntabs =["members","properties","accessRights"];
		UserGroupTabInstances[ntabs[seltab]].init(_usergroupInfoModel);
		if(typeof _currentTabIndex != 'undefined'){
			UserGroupTabInstances[ntabs[_currentTabIndex]].hideView();
		}			
		_currentTabIndex = seltab;		
	};
   
	UserGroupTabsView.prototype.init = function(){		
		_usergroupTabs = new WUXTabBar({
            displayStyle: 'strip',
            showComboBoxFlag: true,
            editableFlag: false,
            multiSelFlag: false,
            reindexFlag: true,
            touchMode: true,
            centeredFlag: false,
            allowUnsafeHTMLOnTabButton: true
        });
		UserGroupTabsConfig.forEach((tab) => {
		    _usergroupTabs.add(tab); //adding the tabs
		});
		_usergroupTabs.inject(this.container);
		
		//draw the tab contents
		initializeUserGroupTabs();	
    };
    
    
    
	let initializeUserGroupTabs = function(){		
		new Promise(function (resolve, reject){
			let promiseArr = [];
			UserGroupTabsConfig.forEach((tab, index)=>
			{				
				if(tab.loader != ""){
					promiseArr[index] = new Promise(function (resolve, reject){
						require([tab.loader], function (loader) {
							UserGroupTabInstances[tab.id] = loader;	
							resolve();
						});
					})
				}				
			});
			Promise.all(promiseArr).then(() => {
				resolve();
			});			
		}).then(function () {
			let args = {};
			args.options = {};
			args.options.value =0;
			ontabClick(args);
			//event to be called when clicked on any tab
			_usergroupTabs.addEventListener('tabButtonClick', function(args){
				ontabClick(args);
			});
			_usergroupTabs.addEventListener('change', function(args){
				ontabClick(args);
			});
			
		}, function () {
			//Error during tab click
		});
		
		
	};
	UserGroupTabsView.prototype.destroy = function(){	    	
		try{
			_currentTabIndex = undefined; //this should be the first line, if some error occurs afterward, that would be an issue otherwise			
			Object.keys(UserGroupTabInstances).map((tab) => {
				UserGroupTabInstances[tab].destroy();
			});
			if(_usergroupTabs != undefined){
				_usergroupTabs.destroy();
			}
			_usergroupInfoModel = {};
			this.container.destroy();
		}catch(e){
	    		//TODO check why this error: TypeError: Cannot read property '__resizeListeners__' of undefined
			console.log(e);
		}	
	};   

    
    return UserGroupTabsView;
  });

define('DS/ENOUserGroupMgmt/Config/UsersGroupSummaryGridViewConfig', 
        [
			'DS/ENOUserGroupMgmt/Views/Grid/UserGroupSummaryGridCustomColumns',
            'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
            ], 
            function(UserGroupSummaryGridCustomColumns, NLS) {
    'use strict';
    let getUserGroupIconURL = function(){
        
    }
    
    let UserGroupSummaryGridViewConfig= [
            {
              text: NLS.title,
              dataIndex: 'tree',
              editableFlag: false,
			  pinned: 'left'
            },{
                text: NLS.Name,
                dataIndex: 'name',
                editableFlag: false
              //  pinned: 'left',              
            },{
              text: NLS.mainOwner,
              dataIndex: 'ownerFullName',
              editableFlag: false
            //  pinned: 'left',              
            },{
              text: NLS.members,
              dataIndex: 'members',
              editableFlag: false
              //pinned: 'left',              
            },{
				text: NLS.visibility,
				dataIndex: 'state',
				editableFlag: false
			},{
              text: NLS.description,
              dataIndex: 'description'
            },{
                text: NLS.modified,
                dataIndex: 'modified',
                typeRepresentation: "datetime",
                editableFlag: false,
                alignment: "near"         
            }
            
            ];

    return UserGroupSummaryGridViewConfig;

});


/**
 * datagrid view for user group summary page
 */
define('DS/ENOUserGroupMgmt/Views/Grid/UsersGroupSummaryDataGridView',
		[ 
			'DS/ENOUserGroupMgmt/Config/UsersGroupSummaryGridViewConfig',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupSummaryToolbarConfig',
            'DS/TreeModel/TreeDocument',
			'DS/TreeModel/TreeNodeModel',
			'DS/ENOUserGroupMgmt/Services/UserGroupServices',
			'DS/ENOUserGroupMgmt/Utilities/RequestUtils'
			], function(
					DatagridViewConfig,
            	    WrapperDataGridView,
					UsersGroupSummaryToolbarConfig,
					TreeDocument,
					TreeNodeModel,
					UserGroupServices,
					RequestUtils
            	    ) {

	'use strict';	
	let _toolbar, _dataGridInstance,filterpreferVal="owned";
	let build = function(model){
	
		var _container=UWA.createElement('div', {id:'dataGridViewContainer', 'class':'data-grid-container hideView'/*,styles: {
            'width': "100%",
            'height': "calc(100% - 40px)",
            'position': "relative"
          }*/});

		let toolbar = UsersGroupSummaryToolbarConfig.writetoolbarDefination(model);
		let dataGridViewContainer = WrapperDataGridView.build(model, DatagridViewConfig, toolbar, _container);
		_toolbar = WrapperDataGridView.dataGridViewToolbar();
		_dataGridInstance = WrapperDataGridView.dataGridView();

		return dataGridViewContainer;
	};
	

	let getGridViewToolbar = function(){
		return 	_toolbar;
	};
	/*let setFilterPreferences = function(value){
		filterpreferVal = value;
	}*/
	/*let selectFilterPreferences = function(filterID) {
		let toolbar = getGridViewToolbar();
		let filter = toolbar.getNodeModelByID("filter");
		if (filter) {
			filter.options.grid.data.menu.forEach(function(ele) {
				if (ele.state && ele.state=="selected" && ele.id!=filterID)
					ele.state = "unselected";
				else if (ele.id==filterID)
					ele.state="selected";
			});
		}
	}*/
	
	let getDataGridInstance = function(){
		return 	_dataGridInstance;
	};

	/*let getFilterPreferences = function(){ 
		return filterpreferVal;  // UG105941empty To be reviewed
		
	};*/
	
	
	let CustomDataGridView={
		build : (model) => { return build(model);},
		registerListners : () =>{return registerListners();}, 
		destroy: () => {_dataGridInstance.destroy();},
		getGridViewToolbar: () => {return getGridViewToolbar();},
		getDataGridInstance : () => {return getDataGridInstance();},
		//setFilterPreferences : (value) => {return setFilterPreferences(value);},
		//selectFilterPreferences: (filterID) => {return selectFilterPreferences(filterID);},
	};

	return CustomDataGridView;
});

/* global define, widget */
/**
 * @overview User Group
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Actions/UsersGroupActions', [
		'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
		'DS/ENOUserGroupMgmt/Services/UserGroupServices',
		'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Utilities/UserGroupSpinner',
		'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupSummaryDataGridView',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',		
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function( UserGroupServicesController,UserGroupServices,RequestUtils,UsersGroupModel,UserGroupSpinner, UsersGroupSummaryDataGridView,NLS) {
	'use strict';
	let UserGroupActions;
		
	let DeleteUserGroup = function(ids,actionFromIdCard){
		UserGroupServicesController.deleteUserGroup(ids).then(
				success => {
					// need to change alert message
					var successMsg;
					if(actionFromIdCard){
						successMsg = NLS.successRemoveUserGroupFromIDCard;
					} else {
						successMsg = NLS.successRemoveUserGroup;
						if(ids.length == 1){
							successMsg = NLS.successRemoveUserGroupSingle;
						}
						successMsg = successMsg.replace("{count}",ids.length);
					}
					if(widget.ugMgmtMediator){
						widget.ugNotify.handler().addNotif({
							level: 'success',
							subtitle: successMsg,
						    sticky: false
						});
						
						widget.ugMgmtMediator.publish('usergroup-summary-delete-row-by-ids',{model:ids});
						
						widget.ugMgmtMediator.publish('usergroup-data-deleted',{model:ids});
						
						//alret("data-deleted");
						//resolve(success);
						// UG105941 : TODO multiple delete
						//widget.ugMgmtMediator.publish('usergroup-summary-delete-row-by-ids',{model:ids});  
		
						
						// Close the id card only if the UserGroup deleted is opened in the id card //
						//
						widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
					}else{
						ugSyncEvts.ugNotify.handler().addNotif({
							level: 'success',
							subtitle: successMsg,
						    sticky: false
						});
						
						ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-delete-row-by-ids',{model:ids});
						
						ugSyncEvts.ugMgmtMediator.publish('usergroup-data-deleted',{model:ids});
						
						//alret("data-deleted");
						//resolve(success);
						// UG105941 : TODO multiple delete
						//ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-delete-row-by-ids',{model:ids});  
		
						
						// Close the id card only if the UserGroup deleted is opened in the id card //
						//
						ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
					}
					
				},
				failure =>{
					if(widget.ugMgmtMediator){
						widget.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.failureRemoveUserGroup,
						    sticky: false
						});
					}else{
						ugSyncEvts.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.failureRemoveUserGroup,
						    sticky: false
						});
					}
					

				});
				
	};
	let _exportUserGroups = function(){
		
	/*	UserGroupSpinner.doWait(document.body);
		UserGroupServicesController.fetchAllUserGroups().then(				
					success => {
						let exportEle = _exportUG(success);
						UserGroupSpinner.endWait(document.body);
					},
					failure =>{
						UserGroupSpinner.endWait(document.body);
					});  */
					
		var csv = UsersGroupSummaryDataGridView.getDataGridInstance().getAsCSV();
		csv = csv.substring(1);
		var fileName = "ExportUserGroups";
    
		//Initialize file format csv or xls
		//var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
		var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
		//var uri = 'data:text/csv;charset=utf-8,' + escape(csv);

		
		var link = document.createElement("a");    
		link.href = uri;
		link.style = "visibility:hidden";
		link.download = fileName + ".csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
					
	
	}
	
	let _createUserGroup = function(properties){

	return new Promise(function(resolve, reject){
			var initiateJson = getParsedUserGroupProperties(properties);
			
			UserGroupServicesController.createUserGroup(initiateJson).then(
					resp => {
						
						resolve(resp)
						}, 
					resp => reject(resp));			
			})

		};
		
	let getParsedUserGroupProperties = function(properties){
		let visibility = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true") ? "private": "public";
		var dataelements = {
				"title": properties.fields.titleField.value,
				"description": properties.fields.descField.value,
				"owner": RequestUtils.contextUser,
				"visibility": visibility
			}
		return dataelements;
	};
    
    let _duplicateUserGroup = function(properties){

		return new Promise(function(resolve, reject){
			//resolve(properties);
			var ugmodel = properties.model;
			ugmodel.duplicateTitle = properties.fields.titleField.value;
			UserGroupServicesController.duplicateUserGroup(ugmodel).then(
				resp => {
					
					resolve(resp)
					}, 
				resp => reject(resp))
				.finally(() => {
					delete ugmodel.duplicateTitle;
				});		
		});

	};
    
	UserGroupActions={
			
			DeleteUserGroup: (ids,actionFromIdCard) => {return DeleteUserGroup(ids,actionFromIdCard);},
			createUserGroup: (properties) => {return _createUserGroup(properties);},
			exportUserGroups: () => {return _exportUserGroups();},
			duplicateUserGroup: (properties) => {return _duplicateUserGroup(properties);}
    };
    
    return UserGroupActions;
});

/* global define, widget */
/**
 * @overview User Group Management
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/Dialogs/RemoveUsersGroup', [
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/Controls/Button',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Actions/UsersGroupActions',
		'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'DS/Controls/Toggle',
		'DS/WebappsUtils/WebappsUtils',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WUXDialog, WUXImmersiveFrame, WUXButton,  UserGroupModel, UserGroupActions, RequestUtils, WUXToggle, WebappsUtils, NLS) {
	'use strict';
	let RemoveUserGroup,dialog;
	let removeConfirmation = function(removeDetails,actionFromIdCard){
		
         
		if(removeDetails.data === undefined){
			// User group summary Toolbar Menu Delete Argument ids are not passed //
			removeDetails = UserGroupModel.getSelectedRowsModel();
		}
		if(removeDetails.data.length < 1){
			if(widget.ugMgmtMediator){
				widget.ugNotify.handler().addNotif({
					level: 'warning',
					subtitle: NLS.ErrorUserGroupRemoveSelection,
				    sticky: false
				});
			}else{
				ugSyncEvts.ugNotify.handler().addNotif({
					level: 'warning',
					subtitle: NLS.ErrorUserGroupRemoveSelection,
				    sticky: false
				});
			}
    		return;
    	}
		// fetch ids here //
		var idsToDelete = [];
		var idsCannotDelete = [];
		var ulCanDelete = UWA.createElement('ul',{
			"class":"",
			"styles":{"list-style-type":"circle"}
		  });
		var ulCannotDelete = UWA.createElement('ul',{
			"class":"",
			"styles":{"list-style-type":"circle"}
		  });
		for(var i=0;i<removeDetails.data.length;i++){
			if(removeDetails.data[i].options.grid.owner != RequestUtils.contextUser){
				idsCannotDelete.push(removeDetails.data[i].options.grid.id);
				ulCannotDelete.appendChild(UWA.createElement('li',{
					"class":"",
					"html": [
						UWA.createElement('span',{
							"text": " " + removeDetails.data[i].options.grid.title
						})
						
					]
				}));
			}else{ 
				idsToDelete.push(removeDetails.data[i].options.grid.uri);
				ulCanDelete.appendChild(UWA.createElement('li',{
					"class":"",
					"html": [
						UWA.createElement('span',{
							"text": " " + removeDetails.data[i].options.grid.title
						})
						
					]
				}));
			}
		}
 
		var immersiveContainer = new UWA.Element('div', {
                        'class' : 'dialog-immersiveframe',

                    }).inject(document.body);

		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(immersiveContainer);  
		
		
    	let dialogueContent = new UWA.Element('div',{
    			"id":"removeUserGroupWarning",
    			"class":""
    			});
    	var header = "";
    	var mainLine = "";
    	if(idsToDelete.length == 1){
			header = NLS.DeleteGroupHeader;
			mainLine = NLS.DeleteGroupContent;
		}else{
			header = NLS.DeleteGroupHeader+"s";
			mainLine = NLS.DeleteGroupContents;
		}
		dialogueContent.appendChild(UWA.createElement('div',{
			"class": "confirmRemoveGroups",
			"html": [UWA.createElement('span',{
						"class": "warningIcon",
						"html": [{
				                    tag: "img",
				                    src: WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/32/DeleteAlert.png')
				                }]
		  			  	}),
		  			 UWA.createElement('span',{
						"class":"",
						"text": mainLine
					  	})
		  			]
		}));
		if(idsToDelete.length > 0){
			var deleteConfirm = new WUXToggle({
				id: 'toggleSwitch',
				type: 'checkbox',
				value: NLS.removeUserGroupCheckBoxWarning,
				label: NLS.removeUserGroupCheckBoxWarning,
				checkFlag: false
			});
			deleteConfirm.addEventListener('change', function(e) {
				if(deleteConfirm.checkFlag == true){
					dialog.buttons.Ok.disabled = false
				}
				else{
					dialog.buttons.Ok.disabled = true
				}
			});
			dialogueContent.appendChild(UWA.createElement('div',{
					"class":"",
					"styles": {'margin-top':'5px', 'margin-bottom':'5px'},
					"html": deleteConfirm
			}))
		}
		
    	if(idsToDelete.length > 0){
        	if(idsToDelete.length == 1){
        		dialogueContent.appendChild(UWA.createElement('div',{
	    			"class":"",
					"html": NLS.removeUserGroupWarningDetailSingle
        		}));
        	}else{
        		dialogueContent.appendChild(UWA.createElement('div',{
	    			"class":"",
					"html": NLS.removeUserGroupWarningDetail
    			}));
        	}
        	dialogueContent.appendChild(UWA.createElement('div',{
					"class":""
			}).appendChild(ulCanDelete));
    	}
    	if(idsCannotDelete.length > 0){
    		if(idsCannotDelete.length == 1){
    			dialogueContent.appendChild(UWA.createElement('div',{
    				"class":"",
    				"html": NLS.removeUserGroupWarningDetail2Single
    			}));
    		}else{
    			dialogueContent.appendChild(UWA.createElement('div',{
    				"class":"",
    				"html": NLS.removeUserGroupWarningDetail2
    			}));
    		}
    		dialogueContent.appendChild(UWA.createElement('div',{
    				"class":""
			  }).appendChild(ulCannotDelete));
    	}
    	
    	dialog = new WUXDialog({
    		   	modalFlag : true,
    		   	width : 500,
    		   	height : 200,
    		   	title: header,
    		   	content: dialogueContent,
    		   	immersiveFrame: immersiveFrame,
    		   	buttons: {
    		   		Ok: new WUXButton({
    		   			label: NLS.Delete,
    		   			disabled : true,
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
    		   				removeConfirmed(idsToDelete,actionFromIdCard);
    		   			}
    		   		}),
    		   		Cancel: new WUXButton({
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
    		   				myDialog.close();
    		   			}
    		   		})
    	       }
    	     });
			 
			  dialog.addEventListener('close' , function(e){
				 this.destroy();
				 var renderDiv = document.getElementsByClassName('dialog-immersiveframe');
				 if(renderDiv.length>0){
					renderDiv[0].destroy();
				 }
						
			}) ;
    };
    
    let removeConfirmed = function(ids,actionFromIdCard){
    	UserGroupActions.DeleteUserGroup(ids,actionFromIdCard);
		dialog.close();
	}
    
    RemoveUserGroup={
    		removeConfirmation: (removeDetails,actionFromIdCard) => {return removeConfirmation(removeDetails,actionFromIdCard);}
    };
    
    return RemoveUserGroup;
});

/* global define, widget */
/**
 * @overview Subscription Management
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/Dialogs/RemoveMembers', [
		'DS/WAFData/WAFData',
		'UWA/Core',
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/Controls/Button',
		'DS/WUXAutoComplete/AutoComplete',
		'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
		'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
		'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
		'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupSummaryDataGridView',
		'DS/ENOUserGroupMgmt/Actions/UsersGroupActions',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Actions/MemberActions',
		'DS/ENOUserGroupMgmt/Utilities/AutoCompleteUtil',
		'DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WAFData, UWACore,  WUXDialog, WUXImmersiveFrame, WUXButton, WUXAutoComplete,
			UsersGroupMemberModel,WrapperTileView,WrapperDataGridView,UsersGroupSummaryDataGridView,UsersGroupActions,UsersGroupModel, MemberActions,
			AutoCompleteUtil, SearchUtil, NLS) {
	'use strict';
	let RemoveMembers,dialog;
	let removeMembersConfirmation = function(removeDetails){
		var that;
		require(['DS/ENOUserGroupMgmt/Views/Tile/UsersGroupMembersTileView'], function(UsersGroupMembersTileView) {
			that = UsersGroupMembersTileView.getMemberTileView();
		});
        if(removeDetails.data === undefined){
            removeDetails = UsersGroupMemberModel.getSelectedRowsModel();
        }
		
    	if(removeDetails.data.length < 1){
			if(widget.ugMgmtMediator){
	    		widget.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.ErrorMembersRemoveSelection,
				    sticky: true
				});
			}else{
				ugSyncEvts.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.ErrorMembersRemoveSelection,
				    sticky: true
				});
			}
    		return;
    	}
    	var idsToDelete = [];
		var idsCannotDelete = [];
		/*var ulCanDelete = UWA.createElement('ul',{
			"class":"",
			"styles":{"list-style-type":"circle"}
		  });*/
		/*var ulCannotDelete = UWA.createElement('ul',{
			"class":"",
			"styles":{"list-style-type":"circle"}
		  });*/
		for(var i=0;i<removeDetails.data.length;i++){
			idsToDelete.push(removeDetails.data[i].options.grid.name);
		}
		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(document.body);  
        let dialogueContent = new UWA.Element('div',{
			"id":"removeMembersWarning",
			"class":""
			});
    	var header = "";
    	if(idsToDelete.length > 0){
    	    if(idsToDelete.length == 1){
                header = NLS.removeMembersHeaderSingle
            }else{
                header = NLS.removeMembersHeader;
            }
    		if(idsToDelete.length == 1){
                dialogueContent.appendChild(UWA.createElement('div',{
                    "class":"",
                    "html": NLS.removeMembersDetailSingle
                }));
            }else{
            	dialogueContent.appendChild(UWA.createElement('div',{
            				"class":"",
        					"html": NLS.removeMembersDetail
        				  }));
            }
        	/*dialogueContent.appendChild(UWA.createElement('div',{
                "class":""
          }).appendChild(ulCanDelete));*/
        	
    	}
    	if(idsCannotDelete.length > 0){
    		if(header == ""){
    			header = NLS.removeMembersHeader2;
    		}
    		dialogueContent.appendChild(UWA.createElement('div',{
    			"class":"",
				"html": NLS.removeUserGroupMembersWarningDetail2
			  }));
    		dialogueContent.appendChild(UWA.createElement('div',{
    				"class":""
			  }).appendChild(ulCannotDelete));
    	}
    	var confirmDisabled = false;
    	if(idsCannotDelete.length > 0 && idsToDelete.length < 1){
    		confirmDisabled = true;
    	}
    	dialog = new WUXDialog({
	    	   modalFlag : true,
			   width : 500,
			   height : 200,
			   title: header,
    	       content: dialogueContent,
    	       immersiveFrame: immersiveFrame,
    	       buttons: {
    	         Ok: new WUXButton({
    	           label: NLS.ok,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             removeConfirmed(that,idsToDelete);
    	           }
    	         }),
    	         Cancel: new WUXButton({
    	           label: NLS.cancel,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             myDialog.close();
    	           }
    	         })
    	       }
    	     });
    };
    
    let removeConfirmed = function(that,ids){
    	MemberActions.RemoveMembersFromUserGroup(that,ids);
		dialog.close();
	};
	
	let removeMembersFromGroups = async function(){
		let groups = UsersGroupModel.getSelectedRowsModel();
		if(groups.data.length < 1){
			if(widget.ugMgmtMediator){
	    		widget.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.errorGroupsSelectionRemove,
				    sticky: true
				});
			}else{
				ugSyncEvts.ugNotify.handler().addNotif({
					level: 'error',
					subtitle: NLS.errorGroupsSelectionRemove,
				    sticky: true
				});
			}
    		return;
    	}
		let groupDetails = [];
		for(var i=0;i<groups.data.length;i++){
			let groupInfo = {};
			groupInfo.id = groups.data[i].options.grid.id;
			groupInfo.modifyAccess = groups.data[i].options.grid.loginUserModifyAccess;
			groupInfo.memberList = groups.data[i].options.grid.memberList;
			groupDetails.push(groupInfo)
		}
		
		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(document.body);  
        let dialogContent = new UWA.Element('div',{
			"id":"removeMembersSelectList",
			"class":""
		});
		
		let optionsForMemberSearch = {
			placeholder: NLS.addMembersPlaceholder,
			multiSearchMode: true,
			allowFreeInputFlag: false,
			keepSearchResultsFlag: false,
			minLengthBeforeSearch: 3,
			searchQuery: function(value){
				return {query: SearchUtil.queryForPersonSearch(value)};
			}
		}
		
		let memberSelectAutoComplete = AutoCompleteUtil.drawAutoComplete(optionsForMemberSearch);
		
		memberSelectAutoComplete.addEventListener('change', function(e) {
				if(memberSelectAutoComplete.selectedItems && memberSelectAutoComplete.selectedItems.length > 0){
					dialog.buttons.Ok.disabled = false
				}
				else{
					dialog.buttons.Ok.disabled = true
				}
			});
		
		new UWA.Element("h6", {
			"id": "removeMultipleMembersText",
			"text": NLS.multipleMembersText, 
			"styles":{"padding-bottom":"5px"}
		}).inject(dialogContent);
		
		var membersTable = UWA.createElement('table', {
			'class': 'add-member-table'
		}).inject(dialogContent);

		var membertr = UWA.createElement('tr', {'class':'add-member-table-row'}).inject(membersTable);

		UWA.createElement('td', {
			content: '<span>'+NLS.members+'</span>',
			'class':'add-member-table-col'
		}).inject(membertr);              

		var memberField = UWA.createElement('td', {'class': 'assignee-field add-member-table-col',}).inject(membertr);
		memberSelectAutoComplete.inject(memberField)
			
		dialog = new WUXDialog({
	    	   modalFlag : true,
			   width : 500,
			   height : 150,
			   title: NLS.removeMembersHeader,
    	       content: dialogContent,
    	       immersiveFrame: immersiveFrame,
    	       resizableFlag: true,
    	       buttons: {
    	         Ok: new WUXButton({
    	           label: NLS.buttonRemove,
    	           disabled: true,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             removeMembersFromHome(groupDetails,memberSelectAutoComplete.selectedItems);
    	           }
    	         }),
    	         Cancel: new WUXButton({
    	           label: NLS.cancel,
    	           onClick: function (e) {
    	             var button = e.dsModel;
    	             var myDialog = button.dialog;
    	             myDialog.close();
    	           }
    	         })
    	       }
    	     });
		
	}
	
	let removeMembersFromHome = function(groupDetails,memberSelectAutoComplete){
		let memberIdsList = []
		if(memberSelectAutoComplete!=undefined){
			for(var i=0; i<memberSelectAutoComplete.length; i++){
				memberIdsList.push(memberSelectAutoComplete[i].options.name)
			}
		}
		MemberActions.removeMembersMultipleGroups(groupDetails,memberIdsList);
		dialog.close();
	}
    
    RemoveMembers={
    		removeMembersConfirmation: (dataToRemove) => {return removeMembersConfirmation(dataToRemove);},
    		removeMembersFromGroups: (memberIds) => {return removeMembersFromGroups(memberIds);}
    };
    
    return RemoveMembers;
});

define('DS/ENOUserGroupMgmt/Views/Dialogs/InitiateUsersGroupDialog', [  

  'DS/Windows/Dialog',
  'DS/Windows/ImmersiveFrame',
  'DS/Controls/Editor',
  'DS/Controls/LineEditor',
  'DS/Controls/Button',
  'DS/Controls/ComboBox',
  'DS/Controls/Toggle',
  'DS/ENOUserGroupMgmt/Actions/UsersGroupActions',
  'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
  'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
  'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css'
],
  function (
	
		  WUXDialog,
		  WUXImmersiveFrame,Editor,WUXLineEditor,
		  WUXButton,WUXComboBox,WUXToggle,UsersGroupActions, RequestUtils,
		  NLS) {
	'use strict';
	
	
	
	let tabsContainer, dialog, _dialog, _buttonOKEnabled, _buttonApplyEnabled,_immersiveFrame,_defaultJSON = {};	
	let _properties = {};
	
	const unauthorizedChars = /eval.*\(|".*\*|'.*\*|<.*>|>.*<|\/\*|<!--|-->|\s+on[a-z]+\s*=|\\x[a-f0-9]{2}|\\u00[a-f0-9]{2}|\/\/|"\s*\).*|'\s*\).*/;
	
	let destroyContainer =  function () { 
		if(_immersiveFrame!=undefined){
			_immersiveFrame.destroy();
		}
		if(_dialog != undefined){
			_dialog.destroy();
		}
	};
	
	
	let InitiateDialog = function (contentData) {
    	let dialogueContent = new UWA.Element('div',{
    			"id":"createUserGroup",
    			"class":""
    			});		

		_properties.formFields = new UWA.Element('div',{
                "id":"creatFormField",
                "class":""
                });	
		_properties.fields = {};
		
		_properties.formFields.inject(dialogueContent);
		
		let AllowPrivateUserGroup = RequestUtils.AllowPrivateUserGroup;
		
		if(AllowPrivateUserGroup == "True" || AllowPrivateUserGroup == "true"){
			new UWA.Element("h6", {text: NLS.GroupType}).inject(_properties.formFields);
			
			_properties.fields.groupField = new WUXLineEditor({
						value: NLS.private,
						disabled: true
				    })
		    _properties.fields.groupField.inject(_properties.formFields);
		}
		
		new UWA.Element("h6", {"class":"required", text: NLS.title}).inject(_properties.formFields);
		
		 _properties.fields.titleField = new WUXLineEditor({
					//placeholder: NLS.CreateUGNameValidation,
					//requiredFlag: true,
					class: "createTitle",
					pattern: '[^\./#,\\[\\]\\$\\^@\\*\\?%:\'"\\\\<>]+',
					sizeInCharNumber: 61
			    })
        _properties.fields.titleField.inject(_properties.formFields);
		
		new UWA.Element("h6", { text: NLS.description}).inject(_properties.formFields);
		_properties.fields.descField = new Editor({
			  //placeholder: NLS.CreateUGDescriptionValidation,
              //pattern: "[a-z]+", 
              class: "createDescription",               
              widthInCharNumber: 63,
              nbRows: 5,
              newLineMode: 'enter',
            });
        _properties.fields.descField.inject(_properties.formFields);
		
		if(AllowPrivateUserGroup == "True" || AllowPrivateUserGroup == "true"){
			var shareToggle = new WUXToggle({
						id: 'toggleSwitch',
						type: 'checkbox',
						value: NLS.ShareWithMembers,
						label: NLS.ShareWithMembers,
						checkFlag: false
					});
			
			var respDropdown = new WUXComboBox({
						class: 'createDialogRespDropDown',
						elementsList: [
							{value: "Viewer", label: NLS.AccessRights_AddMembers_ViewerRole},
							{value: "Manager", label: NLS.AccessRights_AddMembers_ManagerRole},
							{value: "Owner", label: NLS.AccessRights_AddMembers_OwnerRole},
						],
						disabled:true,
						enableSearchFlag: false,
					});
			
			shareToggle.addEventListener('change', function(e) {
					if(shareToggle.checkFlag==true){
						respDropdown.disabled = false
					}
					else{
						respDropdown.disabled = true
						respDropdown.selectedIndex = 0
					}
			});
	
			var sharedResponsibility = UWA.createElement('div', {
				id: 'shared-reponsibility',
				styles: {'margin-top':'10px', 'display':'flex'},
				html: [
					shareToggle,
					respDropdown
				]
			});
			
			sharedResponsibility.inject(_properties.formFields);
		}
    	
		var immersiveContainer = new UWA.Element('div', {
                        'class' : 'dialog-immersiveframe',

                    }).inject(document.body);

		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(immersiveContainer);  
		

    	var header = NLS.HeaderCreateGroup
    	var dialogHeight = RequestUtils.AllowPrivateUserGroup == "True" ? 400: 300,
    	
    	dialog = new WUXDialog({
    		   	modalFlag : true,
    		   	width : 400,
    		   	height : dialogHeight,
    		   	title: header,
    		   	content: dialogueContent,
    		   	immersiveFrame: immersiveFrame,
    		   	buttons: {
    		   		Ok: new WUXButton({
    		   			label: NLS.create,
    		   			//disabled : confirmDisabled,
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
							var titleField = _properties.fields.titleField.value;
							let descriptionValue = _properties.fields.descField.value;
							let errorForBadPayload = checkFieldsForBadPayload(titleField, descriptionValue);
							var shareToggleStatus = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? shareToggle.checkFlag : false;
							var respRole = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? respDropdown.value : "";
							if(widget.ugMgmtMediator){
								if(titleField == undefined || titleField == ""){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupEmptyName,
									    sticky: false
									});
									return;
								}
								else if(titleField.length < 3){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMinLengthName,
									    sticky: false
									});
									return;
								} else if(titleField.length > 128){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMaxLengthName,
									    sticky: false
									});
									return;
								} else if(errorForBadPayload.error){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: errorForBadPayload.message,
									    sticky: false
									});
									return;
								}
							}else{
								if(titleField == undefined || titleField == ""){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupEmptyName,
									    sticky: false
									});
									return;
								}
								else if(titleField.length < 3){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMinLengthName,
									    sticky: false
									});
									return;
								} else if(titleField.length > 128){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMaxLengthName,
									    sticky: false
									});
									return;
								} else if(errorForBadPayload.error){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: errorForBadPayload.message,
									    sticky: false
									});
									return;
								}
							}
							UsersGroupActions.createUserGroup(_properties).then(success =>
                		  {

							var ugModel = JSON.parse(success);
							myDialog.close();
							
							if(widget.ugMgmtMediator){
								widget.ugMgmtMediator.publish('usergroup-summary-append-rows', {model:ugModel.groups[0],share:shareToggleStatus,respRole:respRole});
								widget.ugNotify.handler().addNotif({
								level: 'success',
								subtitle: NLS.successGroupCreation,
							    sticky: false
							});
							}else{
								ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-append-rows', {model:ugModel.groups[0],share:shareToggleStatus,respRole:respRole});
								ugSyncEvts.ugNotify.handler().addNotif({
								level: 'success',
								subtitle: NLS.successGroupCreation,
							    sticky: false
							});
							}
							
							
                		  },
                		  failure => {
                			  var errormessage = "";
								if(failure && failure.error && failure.error.message) {
									errormessage = failure.error.message;
								} else {
									errormessage = NLS.errorOnCreation
								}
								if(widget.ugMgmtMediator){
									widget.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: failure.error.message,
								    sticky: false
									});
								}else{
									ugSyncEvts.ugNotify.handler().addNotif({
									level: 'error',
									subtitle: failure.error.message,
								    sticky: false
									});
								}
                		  }); 
    		   			
    		   			}
    		   		}),
    		   		Cancel: new WUXButton({
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
    		   				myDialog.close();
    		   			}
    		   		})
    	       }
    	     });
			 dialog.addEventListener('close' , function(e){
				 this.destroy();
				 var renderDiv = document.getElementsByClassName('dialog-immersiveframe');
				 if(renderDiv.length>0){
					renderDiv[0].destroy();
				 }
						
			}) ;
    };
	
    let registerDialogButtonEvents = function(){
    };
    
    const checkFieldsForBadPayload = function(title, description){
		let errorObject = {
			error: false,
			message: ""
		};
		if(unauthorizedChars.test(title)){
			errorObject.error = true;
			errorObject.message = NLS.titleContainsUnauthorizedChar;
			return errorObject;
		}
		if(unauthorizedChars.test(description)){
			errorObject.error = true;
			errorObject.message = NLS.descContainsUnauthorizedChar;
			return errorObject;
		}
		
		return errorObject;
	}
	
    let InitiateUserGroupDialog={
    		InitiateUserGroupDialog: (contentIds) => {return InitiateDialog(contentIds);},  
    		destroyContainer: () => {return destroyContainer();}
    };

    return InitiateUserGroupDialog;

  });

define('DS/ENOUserGroupMgmt/Views/Dialogs/DuplicateUsersGroupDialog', [  

  'DS/Windows/Dialog',
  'DS/Windows/ImmersiveFrame',
  'DS/Controls/Editor',
  'DS/Controls/LineEditor',
  'DS/Controls/Button',
  'DS/ENOUserGroupMgmt/Actions/UsersGroupActions',
  'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
],
  function (
	
		  WUXDialog,
		  WUXImmersiveFrame,Editor,WUXLineEditor,
		  WUXButton,UsersGroupActions,
		  NLS) {
	'use strict';
	
	
	
	let tabsContainer, dialog, _dialog, _buttonOKEnabled, _buttonApplyEnabled,_defaultJSON = {};	
	let _properties = {};
	
	
	let duplicateDialog = function (model) {
    	let dialogueContent = new UWA.Element('div',{
    			"id":"duplicateUserGroup",
    			"class":""
    			});		

		_properties.formFields = new UWA.Element('div',{
                "id":"duplicateFormField",
                "class":""
                });	
		_properties.fields = {};
		_properties.model = model;
		
		_properties.formFields.inject(dialogueContent);
		
		new UWA.Element("h5", {"class":"required", text: NLS.title}).inject(_properties.formFields);
		
		 _properties.fields.titleField = new WUXLineEditor({
					placeholder: NLS.CreateUGNameValidation,
					requiredFlag: true,
					pattern: '[^\./#,\\[\\]\\$\\^@\\*\\?%:\'"\\\\<>]+',
					sizeInCharNumber: 61,
					value: "Copy of "+model.title
			    });
        _properties.fields.titleField.inject(_properties.formFields);
		
    	
		var immersiveContainer = new UWA.Element('div', {
                        'class' : 'dialog-immersiveframe',

                    }).inject(document.body);

		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(immersiveContainer);  
		

    	var header = NLS.duplicate+" - "+model.title
    	
    	dialog = new WUXDialog({
    		   	modalFlag : true,
    		   	width : 500,
    		   	height : 200,
    		   	title: header,
    		   	content: dialogueContent,
    		   	immersiveFrame: immersiveFrame,
    		   	buttons: {
    		   		Ok: new WUXButton({
    		   			label: NLS.duplicate,
    		   			//disabled : confirmDisabled,
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
							var titleField = _properties.fields.titleField.value;
							if(widget.ugMgmtMediator){
								if(titleField == undefined || titleField == ""){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupEmptyName,
									    sticky: false
									});
									return;
								}
								else if(titleField.length < 3){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMinLengthName,
									    sticky: false
									});
									return;
								} else if(titleField.length > 128){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMaxLengthName,
									    sticky: false
									});
									return;
								}
							}else{
								if(titleField == undefined || titleField == ""){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupEmptyName,
									    sticky: false
									});
									return;
								}
								else if(titleField.length < 3){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMinLengthName,
									    sticky: false
									});
									return;
								} else if(titleField.length > 128){
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										subtitle: NLS.errorGroupMaxLengthName,
									    sticky: false
									});
									return;
								}
							}
							UsersGroupActions.duplicateUserGroup(_properties).then(success =>
                		  {

							var ugModel = JSON.parse(success);
							myDialog.close();
							if(widget.ugMgmtMediator){
								widget.ugMgmtMediator.publish('usergroup-summary-append-rows', {model:ugModel.groups[0],share:false});
								widget.ugNotify.handler().addNotif({
									level: 'success',
									subtitle: NLS.successGroupCreation,
								    sticky: false
								});
							}else{
								ugSyncEvts.ugMgmtMediator.publish('usergroup-summary-append-rows', {model:ugModel.groups[0],share:false});
								ugSyncEvts.ugNotify.handler().addNotif({
									level: 'success',
									subtitle: NLS.successGroupCreation,
								    sticky: false
								});
							}
							
							
                		  },
                		  failure => {
							  myDialog.close();
                			  var errormessage = "";
								if(failure && failure.error && failure.error.message) {
									if (failure.error.message == "ERR_DUP_ADDMEMBERS") {
										errormessage = NLS.errorOnDuplicationAddMembers;
									}
									else if (failure.error.message == "ERR_DUP_ADDACCESS") {
										errormessage = NLS.errorOnDuplicationAddAccess;
									}
									else if (failure.error.message == "ERR_DUPLICATION") {
										errormessage = NLS.errorOnDuplication; 
									}
									else
										errormessage = failure.error.message;
								} else {
									errormessage = NLS.errorOnCreation
								}
								if(widget.ugMgmtMediator){
									widget.ugNotify.handler().addNotif({
										level: 'error',
										//subtitle: failure.error.message,
										subtitle: errormessage,
									    sticky: false
									});
								}else{
									ugSyncEvts.ugNotify.handler().addNotif({
										level: 'error',
										//subtitle: failure.error.message,
										subtitle: errormessage,
									    sticky: false
									});
								}
                		  });  
    		   			
    		   			}
    		   		}),
    		   		Cancel: new WUXButton({
    		   			onClick: function (e) {
    		   				var button = e.dsModel;
    		   				var myDialog = button.dialog;
    		   				myDialog.close();
    		   			}
    		   		})
    	       }
    	     });
			 dialog.addEventListener('close' , function(e){
				 this.destroy();
				 var renderDiv = document.getElementsByClassName('dialog-immersiveframe');
				 if(renderDiv.length>0){
					renderDiv[0].destroy();
				 }
						
			}) ;
    };
	
    let registerDialogButtonEvents = function(){
    };
	
    
    let DuplicateUserGroupDialog={ 
    		duplicateUserGroupDialog: (contentIds) => {return duplicateDialog(contentIds);}    		
    };

    return DuplicateUserGroupDialog;

  });

/* global define, widget */
/**
 * @overview User Group Management
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/Menu/UsersGroupContextualMenu', [
		'DS/Menu/Menu',
		'DS/ENOUserGroupMgmt/Actions/UsersGroupActions',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Views/Dialogs/RemoveUsersGroup',
		'DS/ENOUserGroupMgmt/Views/Dialogs/DuplicateUsersGroupDialog',
		'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WUXMenu,  UserGroupActions, UserGroupModel,RemoveUsersGroup,DuplicateUsersGroup,RequestUtils, NLS){
		'use strict';
		let Menu;
        
		let userGroupGridRightClick = function(event,data){
			// To handle multiple selection //
        	// This will avoid unselecting the selected rows when click on actions //
        	event.preventDefault();
            event.stopPropagation();
			var pos = event.target.getBoundingClientRect();
            var config = {
            		position: {
            			x: pos.left,
                        y: pos.top + 20
                    }
            };
            var selectedDetails = UserGroupModel.getSelectedRowsModel();
            var menu = [];
            
            if(selectedDetails.data.length === 1){
            	// Single Selection //
                menu = menu.concat(openMenu(data));
                menu = menu.concat(duplicateMenu(data));
            }
        	menu = menu.concat(deleteMenu(selectedDetails,false));
        	WUXMenu.show(menu, config);
		};
		
		
		
		
		let userGroupTileCheveron = function(actions,id){

		    var selectedDetails = UserGroupModel.getSelectedRowsModel();
		    var menu = [];
		   
		    if(selectedDetails.data.length === 1){
		        // Single Selection //
		        menu = menu.concat(openMenu(selectedDetails.data[0].options.grid));
		        menu = menu.concat(duplicateMenu(selectedDetails.data[0].options.grid));
		       // menu = menu.concat(usergroupMaturityStateMenus(actions,id));
		    }
		    menu = menu.concat(deleteMenu(selectedDetails,false));

		    return menu;     
		};
		
		let deleteMenu = function(removeDetails,actionFromIdCard){
			// Display menu
			let showDeleteCmd =true;
		/* 	if(removeDetails.data.length === 1 && removeDetails.data[0].options.grid.DeleteAccess != "TRUE"){
				showDeleteCmd = false;
			} */			
			var menu = [];
			if(RequestUtils.isAdmin  || (removeDetails.data[0].options.grid.owner== RequestUtils.contextUser  && (RequestUtils.isLeader || RequestUtils.isAuthor))){
				 menu.push({
		                name: NLS.Delete,
		                title: NLS.Delete,
		                type: 'PushItem',
		                fonticon: {
		                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-trash'
		                },
		                data: null,
		                action: {
		                    callback: function () {
		                    	RemoveUsersGroup.removeConfirmation(removeDetails,actionFromIdCard);
		                    }
		                }
		            });
			}          
           
            return menu;
		};
		
		let openMenu = function(Details){
            // Display menu
            var menu = [];
            menu.push({
                name: NLS.Open,
                title:NLS.Open,
                type: 'PushItem',
                fonticon: {
                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-open'
                },
                data: null,
                action: {
                    callback: function () {
						if(widget.ugMgmtMediator){
                        	widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:Details});
                        }else{
							ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:Details});
						}
                        require(['DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView'], function (UserGroupSummaryView) {
                            UserGroupSummaryView.showHomeButton(true);
                        });
                    }
                }
            }            
            );
            return menu;
        };
        
        let duplicateMenu = function(userGroupDetails){
            //var data = userGroupDetails;
            var menu = [];
            var cmd =  {
	                name: "duplicate",
	                title:NLS.duplicate,
	                type: 'PushItem',
	                fonticon: {
	                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-duplicate'
	                },
	                data: null,
	                action: {
	                    callback: function () {
	                        console.log("dummy func");
	                        /*
	                        
	                        if(widget.ugMgmtMediator){
	                        	widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:Details});
	                        }else{
								ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:Details});
							}
	                        require(['DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView'], function (UserGroupSummaryView) {
	                            UserGroupSummaryView.showHomeButton(true);
	                        });*/
	                        DuplicateUsersGroup.duplicateUserGroupDialog(userGroupDetails);
	                    }
	                }
	            };
            menu.push(cmd);
            return menu;
        };
		
	
		Menu={
				userGroupTileCheveron: (actions,id) => {return userGroupTileCheveron(actions,id);},
				userGroupGridRightClick: (event,data) => {return userGroupGridRightClick(event,data);}
	    };
		
		return Menu;
	});


define('DS/ENOUserGroupMgmt/Views/Tile/UsersGroupSummaryTileView',
        [
         "UWA/Core",
         'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
         'DS/ENOUserGroupMgmt/Views/Menu/UsersGroupContextualMenu',
         'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
         ],
         function (
                 UWA,
                 WrapperTileView,
                 UGContextualMenu,
                 NLS) {

    "use strict";

    let  _container, _model;
    /*
     * to build tile view
     * @params: model (mandatory) otherwise it will create an empty model
     */
    let build = function(model){
        if(model){
            _model = model;
        }else{ //create an empty model otherwise TODO see if it's required
            _model = new TreeDocument({
                useAsyncPreExpand: true
            });
        }
        _container = UWA.createElement('div', {id:'TileViewContainer', 'class':'tile-view-container showView nonVisible'});
        let tileViewContainer = WrapperTileView.build(_model, _container, false); //true passed to enable drag and drop
      //  registerDragAndDrop();
        return tileViewContainer;
    };
    
    /*
     * to build Contextual menu on tile view
     * */

    let contexualMenuCallback = function(){    
        let _tileView = WrapperTileView.tileView();
        _tileView.onContextualEvent = {
                'callback': function (params) {
                    var menu = [];
                    // var details = [];//TO Remove :details was added to pass as an argument to removeusergroup method.
                    if (params && params.cellInfos) {
                        if (params.cellInfos.cellModel) {

                            var selectedNode = _model.getSelectedNodes();
                            var actions= selectedNode[0].options.grid.Actions;
                            var id=selectedNode[0]._options.grid.id;
                            menu=UGContextualMenu.userGroupTileCheveron(actions,id);
                        }
                    }
                    return menu; 
                }

        }
    };
    
    let _destroy = function(){
    	let _tileView = WrapperTileView.tileView();
    	if(_tileView)
    		_tileView.destroy();
    };
    
    /*
     * Exposes the below public APIs to be used
     */
    let CustomUGSummaryTileView={
            build : (model) => { return build(model);},
            contexualMenuCallback : () =>{return contexualMenuCallback();}, 
            destroy: () => {_destroy();}

    };
    return CustomUGSummaryTileView;
});

define('DS/ENOUserGroupMgmt/Views/ToggleViews',
        ['DS/ENOUserGroupMgmt/Views/Grid/UsersGroupSummaryDataGridView',
        'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupMembersDataGridView',
        'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupDetailMembersDataGridView',
        'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupAccessRightsDataGridView',
         'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
], function(UsersGroupSummaryDataGridView,UsersGroupMembersDataGridView,UsersGroupDetailMembersDataGridView,UsersGroupAccessRightsDataGridView, NLS) {
    "use strict";
    let gridViewClassName,tileViewClassName,viewIcon;
    var ToggleViews = {

            /*
             * Method to change view from Grid View to Tile View Layout and vice-versa
             */
            
            doToggleView: function(args) {
				
                switch(args.curPage){
                    case "UserGroupSummary"	:	gridViewClassName=".data-grid-container";
                                            			tileViewClassName=".tile-view-container";
                                            			viewIcon = UsersGroupSummaryDataGridView.getGridViewToolbar().getNodeModelByID("view");
                                            			break;
					case "MembersTab" 			:   gridViewClassName = widget.readOnlyUG ? '.GroupDetail-gridView-View' : ".Members-gridView-View";
														tileViewClassName = widget.readOnlyUG ? '.GroupDetail-tileView-View' : ".Members-tileView-View";
														viewIcon = widget.readOnlyUG ? UsersGroupDetailMembersDataGridView.getGridViewToolbar().getNodeModelByID("view")
																				     : UsersGroupMembersDataGridView.getGridViewToolbar().getNodeModelByID("view");
                                           				break;
					case "Access Rights" 		:  	gridViewClassName=".accessrights-gridView-View";
														tileViewClassName=".accessrights-tileView-View";
														viewIcon = UsersGroupAccessRightsDataGridView.getGridViewToolbar().getNodeModelByID("view");
														break;                      
    
                    default            :     Console.log(NLS.ConfigTabError);
                }

                if(args.view == "GridView"){
                    viewIcon.options.grid.data.menu[0].state = "selected";
                    viewIcon.options.grid.data.menu[1].state = "unselected";
                    if(viewIcon && viewIcon.options.grid.semantics.icon.iconName != "view-list"){
                        viewIcon.updateOptions({
                          grid: {
                            semantics:{
                              icon:{
                                iconName: "view-list"
                              }
                            }
                          },
                          tooltip:NLS.gridView
                        });
                      }
                    var gridView = document.querySelector(gridViewClassName);
                    if(gridView){
                        gridView.removeClassName("hideView");
                        gridView.removeClassName("nonVisible");
                        gridView.addClassName("showView");
                    }

                    var tileView = document.querySelector(tileViewClassName);
                    if(tileView){
                        tileView.removeClassName("showView");
                        tileView.addClassName("hideView");
                    }
                } else if(args.view == "TileView"){
                    viewIcon.options.grid.data.menu[0].state = "unselected";
                    viewIcon.options.grid.data.menu[1].state = "selected";
                    if(viewIcon && viewIcon.options.grid.semantics.icon.iconName != "view-small-tile"){
                        viewIcon.updateOptions({
                          grid: {
                            semantics:{
                              icon:{
                                iconName: "view-small-tile"
                              }
                            }
                          },
                          tooltip: NLS.tileView
                        });
                      }
                    var gridView = document.querySelector(gridViewClassName);
                    if(gridView){
                        gridView.removeClassName("showView");
                        gridView.addClassName("hideView");
                    }

                    var tileView = document.querySelector(tileViewClassName);
                    if(tileView){
                        tileView.removeClassName("hideView");
                        tileView.addClassName("showView");
                    }
                }
            }


    };
    return ToggleViews;
});


/**
 * datagrid view for user group summary page
 */
define('DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
		[
		 'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupSummaryDataGridView',
	 	 'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
	 	 'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
		 'DS/DataGridView/DataGridView',
         'DS/TreeModel/TreeDocument',
		 'DS/TreeModel/TreeNodeModel',
		 'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		 'DS/ENOUserGroupMgmt/Views/Tile/UsersGroupSummaryTileView',
		 'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
		 'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
		 'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
		 'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
		 'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		 'DS/ENOUserGroupMgmt/Utilities/Search/SearchUtil',
		 'DS/Utilities/Array',
		 'DS/Core/PointerEvents',
		 'DS/ENOUserGroupMgmt/Utilities/AutoCompleteUtil',
		 'DS/Controls/ComboBox',
		 'DS/Controls/LineEditor',
		 'DS/Controls/Button',
		 'DS/Controls/TooltipModel',
		 'DS/CoreBase/WebUXGlobalEnums',
		 'DS/ENOUserGroupMgmt/Utilities/PlaceHolder',
		 'DS/ENOUserGroupMgmt/Utilities/UserGroupSpinner',
		 'DS/CollectionView/CollectionViewStatusBar',
		 'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands',
		 'DS/ENOUserGroupMgmt/Utilities/DateUtils',
		 //'DS/ENOUserGroupMgmt/Components/TagNavigator',
		 'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
            ], function(
		UsersGroupSummaryDataGridView,
		WrapperDataGridView,WrapperTileView,
		DataGridView,TreeDocument,TreeNodeModel,UsersGroupModel,UsersGroupSummaryTileView,UserGroupServicesController,UserGroupAccessRightsModel,UsersGroupMemberModel,DataFormatter,RequestUtils,SearchUtil,ArrayUtils,PointerEvents,AutoCompleteUtil,WUXComboBox,WUXLineEditor,
		WUXButton,WUXTooltipModel,WebUXGlobalEnums,PlaceHolder,UserGroupSpinner,CollectionViewStatusBar,UserGroupCommands,DateUtils,/*TagNavigator,*/NLS
			) {

	'use strict';
	
	const WUXManagedFontIcons = WebUXGlobalEnums.WUXManagedFontIcons;	
	
	let _filterToolbar={};
	let modelForUsers = new TreeDocument();
	
	let build = function(){		
		
		return new Promise(function(resolve, reject) {
			if (widget.data.contentId) { //To show single UG
				UserGroupServicesController.fetchUserGroupById(null,widget.data.contentId).then(
					success => {
						let containerDiv = _fetchUserGroupSuccess(success);
						resolve(containerDiv);
					},
					failure => {
						_fetchuserGroupFailure(failure);
					});
			} else {
				UserGroupServicesController.fetchAllUserGroups().then(
					success => {
						let containerDiv = _fetchUserGroupSuccess(success);
						resolve(containerDiv);
					},
					failure => {
						_fetchuserGroupFailure(failure);
					});
			}
		});
	};
	
	let _fetchUserGroupSuccess = function(success){
		UsersGroupModel.createModel(success);
		let containerDiv = drawUsersGroupSummaryView();
		//--comment start
		/*var viewIcon = UsersGroupSummaryDataGridView.getGridViewToolbar().getNodeModelByID("filter");
		if(viewIcon.options.grid.data.menu[0].state=="selected"){
    		viewIcon.options.grid.data.menu[1].state="unselected";
    	} else {
    		viewIcon.options.grid.data.menu[0].state="selected";
			viewIcon.options.grid.data.menu[1].state="unselected";
    	}*///--comment end
		return containerDiv;
	};
	
	function showError(containerDiv){
			if(!containerDiv){
				containerDiv = new UWA.Element('div',{"class":"widget-container"});
				containerDiv.inject(widget.body);
			}
			PlaceHolder.hideEmptyUserGroupPlaceholder(containerDiv);
			PlaceHolder.showeErrorPlaceholder(containerDiv);
	}
	
	let _fetchuserGroupFailure = function(failure){
		let containerDiv=document.querySelector(".widget-container");
		showError(containerDiv);
		
		var failureJson = '';
		try{
			failureJson = JSON.parse(failure);
		}catch(err){
			//DO Nothing
		}

		if (widget.ugMgmtMediator) {
			if(failureJson.error){
				widget.ugNotify.handler().addNotif().addNotif({
					level: 'error',
					subtitle: failureJson.error,
				    sticky: false
				});
			}else{
				widget.ugNotify.handler().addNotif().addNotif({
					level: 'error',
					title: NLS.infoRefreshErrorTitle,
					subtitle: NLS.infoRefreshError,
				    sticky: false
				});
			}
		}else{
			if(failureJson.error){
			ugSyncEvts.ugNotify.handler().addNotif().addNotif({
				level: 'error',
				subtitle: failureJson.error,
			    sticky: false
			});
			}else{
				ugSyncEvts.ugNotify.handler().addNotif().addNotif({
					level: 'error',
					title: NLS.infoRefreshErrorTitle,
					subtitle: NLS.infoRefreshError,
				    sticky: false
				});
			}
		}
	};
	
	let _filterUserGroupSuccess = function(success){	
		UsersGroupSummaryDataGridView.getDataGridInstance().getTreeDocument().removeRoots()
		UsersGroupModel.createModel(success);
		let container=document.querySelector(".widget-container");
		if(container!=null){
			if(UsersGroupModel.getModel().getChildren().length == 0){
				PlaceHolder.showEmptyUserGroupPlaceholder(container,UsersGroupModel.getModel());
			}else{
				PlaceHolder.hideEmptyUserGroupPlaceholder(container);
			}
		}
		if(WrapperDataGridView.dataGridView()) {
			WrapperDataGridView.dataGridView().buildStatusBar([{
				  type: CollectionViewStatusBar.STATUS.NB_ITEMS
			}, {
			  type: CollectionViewStatusBar.STATUS.NB_SELECTED_ROWS
			}
			]);
		}
	};
	
	let applyFilter = async function(userNameFilter, respFilter, visibilityFilter, titleToSearch){
		let username;
		if(userNameFilter==undefined){
			if(respFilter=='all'){
				username = "";
			}
			else {
				if (widget.ugMgmtMediator) {
					widget.ugNotify.handler().addNotif({
						level: 'error',
						subtitle: NLS.userNameRequiredFilter,
						sticky: true
					});
				} else {
					ugSyncEvts.ugNotify.handler().addNotif({
						level: 'error',
						subtitle: NLS.userNameRequiredFilter,
						sticky: false
					});
					return;
				}
			}
		}
		else{
			username = userNameFilter.options.grid.name;
		}
		backToUserGroupSummary();
		await processFilter(username, respFilter, visibilityFilter, titleToSearch)
	}
	
	let processFilter = function(username, respFilter, visibilityFilter, titleToSearch){
		return new Promise(function(resolve, reject) {
		UserGroupSpinner.doWait(document.body);
		UserGroupServicesController.filterUserGroups(username, respFilter, visibilityFilter, titleToSearch).then(
			success => {
				_filterUserGroupSuccess(success);
				UserGroupSpinner.endWait(document.body);
				resolve();
			},
			failure => {
				
			});
		});
	}
	
	/*let asyncModelForUserSearch = function(typeaheadValue) {
		var personRoleArray = {};
		let queryString = SearchUtil.queryForPersonSearch(typeaheadValue) || "";
		let options = {
			'queryString': queryString
		};
		return new Promise(function(resolve, reject) {
			AutoCompleteUtil.getAutoCompleteList(options, modelForUsers, personRoleArray)
				.then(function(resp) {
					modelForUsers = resp;
					resolve(modelForUsers);
				})
				.catch(function(err) {
					console.log("ERROR: " + err);
				});
		});
	};*/
	
	let drawFilters = function(){
		
		var loggedInUserTreeDoc = new TreeDocument();
		var nodeForContextPerson = new TreeNodeModel(
					{
						label: RequestUtils.contextUserFullName,
						name: RequestUtils.contextUser,
						grid:{
							label: RequestUtils.contextUserFullName,
							name: RequestUtils.contextUser,
							identifier: RequestUtils.contextUser,
							id: RequestUtils.contextUserID
						}
					});
		loggedInUserTreeDoc.addRoot(nodeForContextPerson);
		let optionsForUsernameFilter = {
			placeholder: NLS.searchUserPlaceholder,
			multiSearchMode: false,
			allowFreeInputFlag: false,
			keepSearchResultsFlag: false,
			minLengthBeforeSearch: 3,
			selectedItems: loggedInUserTreeDoc.getChildren()[0],
			searchQuery: function(value){
				return {query: SearchUtil.queryForPersonSearch(value)};
			}
		}
		_filterToolbar.userNameFilter = AutoCompleteUtil.drawAutoComplete(optionsForUsernameFilter);
		
		let ElementListForFilterType = [
				{
					label: NLS.FilterforAllGroup,
					value: "all",
					icon: {
							iconName: "users-groups wux-ui-3ds",
							fontIconFamily: 1
					}
				},
				{
				  	label: NLS.FilterforMemberAccess,
				  	value: "member",
				  	icon: {
							iconName: "users-group-ok wux-ui-3ds",
							fontIconFamily: 1
					}
				},
				{
				  	label: NLS.FilterforManagerAccess,
				  	value: "manager",
				  	icon: {
							iconName: "feather wux-ui-3ds",
							fontIconFamily: 1
					}
				},
				{
					label: NLS.FilterforOwnerAccess,
					value: "owner",
					icon: {
							iconName: "favorite-on wux-ui-3ds",
							fontIconFamily: 1
					}
				},
				{
				  	label: NLS.FilterforMyGroup,
				  	value: "owned",
				  	icon: {
							iconName: "badge wux-ui-3ds",
							fontIconFamily: 1
					}
				}
		];
		if(RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true"){
			let viewerFilter =	{
									label: NLS.FilterforViewerAccess,
									value: "viewer",
									icon: {
											iconName: "eye wux-ui-3ds",
											fontIconFamily: 1
									}
								};
			ElementListForFilterType.splice(2, 0, viewerFilter);
		}
		
		_filterToolbar.filterType = new WUXComboBox({
			id: "filterType",
			elementsList: ElementListForFilterType,
			enableSearchFlag: false,
			value: "all"
		});
		
		_filterToolbar.visibilityFilter = new WUXComboBox({
			id: "visibilityFilter",
			elementsList:[
				{
					 label: NLS.FilterPublicPrivate,
					 value: "all"
				},
				{
				  label: NLS.FilterPublic,
				  value: "Active",
				  icon: {
					iconName: "eye wux-ui-3ds",
					fontIconFamily: 1
				  }
				},
				{
				  value: "Private",
				  label: NLS.FilterPrivate,
				  icon: {
					iconName: "eye-off wux-ui-3ds",
					fontIconFamily: 1
				  }
				}	
			],
			enableSearchFlag: false,
			disabled: (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? false: true,
			value: "all"
		});
		
		_filterToolbar.titleTextFilter = new WUXLineEditor({
			id: "titleTextFilter",
			placeholder: NLS.groupTitleSearchPlaceholder
		});
		
		_filterToolbar.search = new WUXButton({
			id: "filterSearch",
			showLabelFlag: false,
			icon: {
		        iconName: "search",
		        fontIconFamily: WUXManagedFontIcons.Font3DS
		    },
		    emphasize: "primary",
		    tooltipInfos: new WUXTooltipModel({
					        title: NLS.searchTooltip
					      })
		});
		
		_filterToolbar.search.addEventListener('buttonclick', async function(){
			let userNameFilter = _filterToolbar.userNameFilter.selectedItems;
			let respFilter = _filterToolbar.filterType.value;
			let visibilityFilter = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? _filterToolbar.visibilityFilter.value: "Active";
			let titleToSearch = _filterToolbar.titleTextFilter.value;
			await applyFilter(userNameFilter, respFilter, visibilityFilter, titleToSearch);
			UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), UsersGroupSummaryDataGridView.getGridViewToolbar())
			if(widget.ugMgmtMediator)
				widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
			else
				ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
		});
		
		let className = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? "column-filter": "column-filter-no-private";
		
		let htmlDivs = [
                        {
                            tag: 'div',
                            id: 'usernameFilter',
                            class: 'filter-user-container ' + className,
                            html: _filterToolbar.userNameFilter
                        },
                        {
                            tag: 'div',
                            id: 'responsibilityFilter',
                            class: 'filter-responsibility-container ' + className,
                            html: _filterToolbar.filterType
                        },
                        {
                            tag: 'div',
                            id: 'titleTextFilter',
                            class: 'filter-groupname-container ' + className,
                            html: _filterToolbar.titleTextFilter
                        },
                        {
                            tag: 'div',
                            id: 'filterSearch',
                            class: 'filter-actions',
                            html: _filterToolbar.search
                        }
                    ]
                    
        if(RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true"){
			let visibilityFilter =	{
			                            tag: 'div',
			                            id: 'visibilityFilter',
			                            class: 'filter-visibility-container ' + className,
			                            html: _filterToolbar.visibilityFilter
			                        };
			htmlDivs.splice(2, 0, visibilityFilter);
		}
		
		let filterDiv = UWA.Element('div', {
					id: "filtersContainer",
                    class: 'filters',
                    html: htmlDivs
        });
        
		return filterDiv;
	}

	let drawUsersGroupSummaryView = function(serverResponse){
		var ugModel = UsersGroupModel.getModel();
		let datagridDiv = UsersGroupSummaryDataGridView.build(ugModel);	
		let tileViewDiv = UsersGroupSummaryTileView.build(ugModel);	
		UsersGroupSummaryTileView.contexualMenuCallback();
		registerListners();
		//get the toolbar
		let filtersToolbar = drawFilters();
		let homeToolbar=UsersGroupSummaryDataGridView.getGridViewToolbar();
		
		let dataContainerExists = document.getElementById("dataGridViewContainerMain");
		if(dataContainerExists){
			dataContainerExists.destroy();
		}
		let  dataContainer = UWA.createElement('div', {
				'id': 'dataGridViewContainerMain',styles:{
				'width': "100%",
				'height': "calc(100% - 60px)",
				'position': "relative",
				'top': "10px"
			}
		});
		
		let filterDiv = UWA.createElement('div', {
				'id': 'filtersContainer',styles:{
				'width': "100%",
				'height': "40px",
				'position': "relative",
			}
		});
		
		let container=document.querySelector(".widget-container");
		let containerDiv;
		if(!container){
		 containerDiv = new UWA.Element('div',{"class":"widget-container"});
		}else{
			containerDiv=container;
		}
		
		let toolbarDOMId = (RequestUtils.AllowPrivateUserGroup == "True" || RequestUtils.AllowPrivateUserGroup == "true" ) ? "dataGridDivToolbar": "dataGridDivToolbarNoPrivate";
		let toolbarContainerExists = document.getElementById(toolbarDOMId);
		if(toolbarContainerExists){
			toolbarContainerExists.destroy();
		}
		let toolBarContainer = UWA.createElement('div', {id:toolbarDOMId, 'class':'toolbar-container', styles: {'width': "100%",'height': "80px",}});

		filtersToolbar.inject(toolBarContainer);
		homeToolbar.inject(toolBarContainer);
		
		datagridDiv.inject(dataContainer);
		tileViewDiv.inject(dataContainer);
		
	    toolBarContainer.inject(containerDiv);
	    dataContainer.inject(containerDiv);
	    
	    var ugObjectIds=[]; //tagger

	   if (ugModel.getChildren().length ==0) {				
		    PlaceHolder.showEmptyUserGroupPlaceholder(containerDiv,ugModel);
       }else {
    	   ugModel.prepareUpdate();
    	   var count = 0;
    	   ugModel.getChildren().forEach(node => {
			   if(node._isHidden)
			   count++;
			   ugObjectIds.push(node.options.id); //tagger
			})
    	   ugModel.pushUpdate();
    	   if(count == ugModel.getChildren().length){
				 PlaceHolder.showEmptyUserGroupPlaceholder(containerDiv,ugModel);
			}
       }
       if(widget.ugMgmtMediator){
       	   widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { ugModel });
       }else{
		   ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { ugModel });
	   }
	   PlaceHolder.registerListeners();
	   showHomeButton(false);
	   //tagger start
	   if(ugObjectIds.length > 1000){
		   if(widget.ugMgmtMediator){
			widget.notify.handler().addNotif({
				message: NLS.taggerWarning,
                level: 'warning',
                sticky: false
            });
            }else{
				ugSyncEvts.notify.handler().addNotif({
				message: NLS.taggerWarning,
                level: 'warning',
                sticky: false
            });
			}
    	}
    	if(widget.ugMgmtMediator){       			//uncomment for widget's web search
			//taggersForUserGroup(ugObjectIds);
		}
		//tagger end
		
	   return containerDiv;
		
	};
	
	let userGroupConfigIdsFromModel = function(){
		var userGroupConfigModel = UsersGroupModel.getModel();
		var userGroupConfigIds=[];
		userGroupConfigModel.getChildren().forEach(node => {
			userGroupConfigIds.push(node.options.id);
		});
		return userGroupConfigIds;
	};
	
	let performSearchOperation = function(refineFilter, idsForFilter){
		var filteredIds = [];
		TagNavigator.getSearchResult(refineFilter, idsForFilter).then(
				success => {
					if(success.results){
						for(var i=0; i<success.results.length;i++){
							filteredIds.push(success.results[i].attributes[0].value);	
						}
					}		
					updateSummaryPageWithSearchResult(filteredIds);
					widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
					if(success.infos && success.infos.nmatches > 1000){						
						TagNavigator.getSearchResult(refineFilter, filteredIds);					
					}
				});
	};
	
	let updateSummaryPageWithSearchResult = function(idsToShow){
		var summaryPageModel = UsersGroupModel.getModel();
		var tagProxy = TagNavigator.getTaggerVariable();
		var searcInTypedValue = TagNavigator.getSearchWithInTypedValue();
		summaryPageModel.prepareUpdate(); 
		ArrayUtils.optimizedForEach(summaryPageModel.getChildren(), function(node) {
			if(searcInTypedValue == undefined && Object.keys(tagProxy.getCurrentFilter().allfilters).length == 0){
				node.show();
			}
			else{
				if(idsToShow.includes(node.options.id)){
					node.show();
				} else {
					node.hide();
				}
			}
		});
		var count = 0;
		summaryPageModel.getChildren().forEach(node => {if(node._isHidden)count++;});
		summaryPageModel.pushUpdate();
		if(document.querySelector(".right-container") && document.querySelector(".right-container").getStyle("width") == "0px"){
			//widget.routeMgmtMediator.publish('route-widgetTitle-count-update',{model:summaryPageModel});
			//publish event -Pending
			if(widget.ugMgmtMediator)
				widget.ugMgmtMediator.publish('meeting-widgetTitle-count-update',{model:summaryPageModel});
			else
				ugSyncEvts.ugMgmtMediator.publish('meeting-widgetTitle-count-update',{model:summaryPageModel});
		}
	};
	
	/*let getFilterPreferences = function(){

    		return ['owned','all',"access:owner","access:manager","access:member","access:viewer"];
    	
    };*/
    
    //tagger start------------------------------------------------------
			/*let taggersForUserGroup = function(userGroupObjectIds) {
				var tagProxy = TagNavigator.setTaggerProxy("Group");

				tagProxy.addEvent('onFilterChange', function(e) {
					var usergroupConfigIdsForFilter = userGroupConfigIdsFromModel();
					var typedValue = TagNavigator.getSearchWithInTypedValue();
					var tagProxy = TagNavigator.getTaggerVariable();
					var refineFilter = tagProxy.getCurrentFilter();
					//    		if(typedValue != undefined && Object.keys(tagProxy.getCurrentFilter().allfilters).length == 1){
					//    			routeIdsForFilter = visibleRoutesIds();
					//			}
					if (usergroupConfigIdsForFilter.length > 1000 && typedValue == undefined) {
						usergroupConfigIdsForFilter = usergroupConfigIdsForFilter.slice(0, 1000);
					}
					performSearchOperation(refineFilter.allfilters, meetingObjectIdsForFilter);
				});

				var refineFilter = tagProxy.getCurrentFilter();
				var refine = refineFilter.allfilters;
				if (userGroupObjectIds.length == 0) {
					TagNavigator.setTagsForSummaryPage([]);
				}
				else {
					if (userGroupObjectIds.length > 1000) {
						userGroupObjectIds = userGroupObjectIds.slice(0, 1000);
					}
					var typedValue = TagNavigator.getSearchWithInTypedValue();
					var filtetedIds = [];
					TagNavigator.getSearchResult(refine, userGroupObjectIds).then(
						success => {
							if (success.results) {
								for (var i = 0; i < success.results.length; i++) {
									filtetedIds.push(success.results[i].attributes[0].value);
								}
							}
							if (typedValue != undefined || Object.keys(tagProxy.getCurrentFilter().allfilters).length > 0) {
								updateSummaryPageWithSearchResult(filtetedIds);
								widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
							}
						});
				}
    };*/
    
	let backToUserGroupSummary = function () {
    	showHomeButton(false);
    	//TODO code to change tile view to grid view
    	if(widget.ugMgmtMediator){
			widget.ugMgmtMediator.publish('usergroup-back-to-summary');
			widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
		}else{
    		ugSyncEvts.ugMgmtMediator.publish('usergroup-back-to-summary');
    		ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update',{model:UsersGroupModel.getModel()});
		}
    };
	let showHomeButton = function(flag){
		let userGroupSummaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();
		let backIcon = userGroupSummaryToolbar.getNodeModelByID("back");
        if (backIcon) {
          backIcon.updateOptions({
            visibleFlag: flag
          });
        }
	};
 
    let onDoubleClick = function (e, cellInfos) {
		
		if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options.grid) {
		      if (e.multipleHitCount == 2) {
	    			cellInfos.nodeModel.select(true);
	    			if(widget.ugMgmtMediator){
	    				widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:cellInfos.nodeModel.options.grid});
	    			}else{
						ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:cellInfos.nodeModel.options.grid});
					}
	    			showHomeButton(true);               
		     }
		}
	};
	let openContextualMenu = function (e, cellInfos) {
		if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options.grid) {
		       if (e.button == 2) {
		    	  require(['DS/ENOUserGroupMgmt/Views/Menu/UsersGroupContextualMenu'], function (UsersGroupContextualMenu) {
					UsersGroupContextualMenu.userGroupGridRightClick(e,cellInfos.nodeModel.options.grid);
				});           
		     } 
		}
	};

	/*
	 * Registers events on both datagrid and tile view to:
	 * 1. Open contextual menu on right click in any row
	 * 2. Open the right panel showing ID card and  tabs
	 * 
	 * */
	let registerListners = function(){
    	let dataGridView = WrapperDataGridView.dataGridView();
    	//Dispatch events on dataGrid
    	dataGridView.addEventListener(PointerEvents.POINTERHIT, onDoubleClick);
    	dataGridView.addEventListener('contextmenu', openContextualMenu);
    	let tileView = WrapperTileView.tileView();
    	//Dispatch events on tile view
    	tileView.addEventListener(PointerEvents.POINTERHIT, onDoubleClick);
    	let summaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();	
    	tileView.onSelectionAdd(function(){UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar)});
    	tileView.onSelectionRemove(function(){UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar)});
    	addorRemoveUserGroupEventListeners(); 
    	
	};
	
	let setWidgetTitle = function (data){
        let count = 0, numOfUserGroups;
        if(data.ugModel){
	        data.ugModel.getChildren().forEach(node => {if(node._isHidden)count++;})
	        numOfUserGroups=data.ugModel.getChildren().length-count;}
        else{
			data.model.getChildren().forEach(node => {if(node._isHidden)count++;})
	        numOfUserGroups=data.model.getChildren().length-count;}
		
        let title = NLS.UGCountHeader + ' (' + numOfUserGroups + ')';
        widget.setTitle(title);
    }
	
	let addorRemoveUserGroupEventListeners = function(){
		
		if(widget.ugMgmtMediator){
			
			widget.ugMgmtMediator.subscribe('usergroup-widgetTitle-count-update', function(data) {
				setWidgetTitle(data);
			});

			widget.ugMgmtMediator.subscribe('usergroup-summary-append-rows', function(data) {
				let grpid = data.model.pid || null;
				if (data.share == false) {
					UserGroupServicesController.fetchUserGroupById(grpid, data.model.uri).then(function(resp) {
						let updatedUG = JSON.parse(resp);
						updatedUG = updatedUG.groups[0];
						data.model.owner = updatedUG.owner;
						data.model.pid = updatedUG.pid;
						data.model.myGroup = updatedUG.myGroup;
						data.model.ownerFullName = updatedUG.ownerFullName;
						data.model.name = updatedUG.name;
						data.model.state = updatedUG.state;
						data.model.id = updatedUG.id;
						data.model.uri = updatedUG.uri;
						data.model.modified = new Date(updatedUG.modified);
						data.model.loginUserModifyAccess = updatedUG.loginUserModifyAccess;
						data.model.loginUserRole = updatedUG.loginUserRole;
						data.model.memberList = updatedUG.memberList;
						let node = UsersGroupModel.appendRows(data.model);
						UsersGroupSummaryDataGridView.getDataGridInstance().ensureNodeModelVisible(node, true);
						node.select();
						widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
					});
				}
				else if (data.share == true) {
					var logicalAccessForMembers = {
						"role": data.respRole
					}
					UserGroupServicesController.fetchAndConnectUserGroup(grpid, data.model.uri, logicalAccessForMembers).then(function(resp) {
						let updatedUG = JSON.parse(resp);
						updatedUG = updatedUG.groups[0];
						data.model.owner = updatedUG.owner;
						data.model.pid = updatedUG.pid;
						data.model.myGroup = updatedUG.myGroup;
						data.model.ownerFullName = updatedUG.ownerFullName;
						data.model.name = updatedUG.name;
						data.model.state = updatedUG.state;
						data.model.id = updatedUG.id;
						data.model.uri = updatedUG.uri;
						data.model.modified = new Date(updatedUG.modified);
						data.model.loginUserModifyAccess = updatedUG.loginUserModifyAccess;
						data.model.loginUserRole = updatedUG.loginUserRole;
						data.model.memberList = updatedUG.memberList;
						let node = UsersGroupModel.appendRows(data.model);
						UsersGroupSummaryDataGridView.getDataGridInstance().ensureNodeModelVisible(node, true);
						node.select();
						widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
					});
				}
				let summaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();
				UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar);
				//showHomeButton(true);
				//node.select();
			});

			widget.ugMgmtMediator.subscribe('usergroup-summary-delete-row-by-ids', function(data) {
				if (data.model.length > 0) {
					UsersGroupModel.deleteRowModelByIds(data.model);
					let summaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();
					UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar);
					widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
				}
			});

			widget.ugMgmtMediator.subscribe('usergroup-data-updated', function(data) {
				UsersGroupModel.updateRow(data);
				/*var args = "all";
				var viewIcon = UsersGroupSummaryDataGridView.getGridViewToolbar().getNodeModelByID("filter");
				if(viewIcon.options.grid.data.menu[0].state=="selected"){
					args=viewIcon.options.grid.data.menu[0].id;
				} else {
					args=viewIcon.options.grid.data.menu[1].id
				}
				filterUGSummaryView(args);*/
				widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
			});

			widget.ugMgmtMediator.subscribe('usergroup-owner-changed', function(data) {
				UsersGroupModel.deleteRowModelByIds([data.pid]);
				//filterUGSummaryView();
			});
			widget.ugMgmtMediator.subscribe('usergroup-summary-Membersappend-rows', function(data) {
				UsersGroupModel.updateMemberCount(data);
			});

			/* widget.ugMgmtMediator.subscribe('usergroup-summary-show-message', function (message) {
				widget.notify.handler().addNotif(message.message);			
			}); 
			
			widget.ugMgmtMediator.subscribe('usergroup-summary-delete-rows', function (index) {
				UserGroupModel.deleteRowModelByIndex(index);				
			});
			
			widget.ugMgmtMediator.subscribe('usergroup-summary-delete-selected-rows', function () {
				UserGroupModel.deleteRowModelSelected();			
			}); */
			/* widget.ugMgmtMediator.subscribe('usergroup-data-updated', function (data) {
				UserGroupModel.updateRow(data);		
				filterUGSummaryView();
			}); */

			widget.ugMgmtMediator.subscribe('usergroup-search-within-data', function(data) {
				var usergroupConfigIdsForFilter = userGroupConfigIdsFromModel();
				var typedValue = TagNavigator.getSearchWithInTypedValue();
				var tagProxy = TagNavigator.getTaggerVariable();
				var refineFilter = tagProxy.getCurrentFilter();

				if (usergroupConfigIdsForFilter.length > 1000 && typedValue == undefined) {
					usergroupConfigIdsForFilter = usergroupConfigIdsForFilter.slice(0, 1000);
				}
				performSearchOperation(refineFilter.allfilters, usergroupConfigIdsForFilter);
				
			});
			widget.ugMgmtMediator.subscribe('usergroup-reset-search-within-data', function (data) {
				var usergroupConfigIdsForFilter = userGroupConfigIdsFromModel();
	    		var tagProxy = TagNavigator.getTaggerVariable();
	    		var refineFilter = tagProxy.getCurrentFilter();
	        	if(usergroupConfigIdsForFilter.length > 1000){
	        		usergroupConfigIdsForFilter=usergroupConfigIdsForFilter.slice(0,1000);
	        	}
	        	performSearchOperation(refineFilter.allfilters, usergroupConfigIdsForFilter);
	        	
			});
	
		}else{
			
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-widgetTitle-count-update', function (data) {
            	setWidgetTitle(data);
        	});
        
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-append-rows', function (data) {
			let grpid = data.model.pid || null;
			if(data.share == false){
				UserGroupServicesController.fetchUserGroupById(grpid,data.model.uri).then(function(resp) {
					let updatedUG = JSON.parse(resp);
					updatedUG = updatedUG.groups[0];
					data.model.owner = updatedUG.owner;
					data.model.pid = updatedUG.pid;
					data.model.myGroup = updatedUG.myGroup;
					data.model.ownerFullName = updatedUG.ownerFullName;
					data.model.name = updatedUG.name;
					data.model.state = updatedUG.state;
					data.model.id = updatedUG.id;
					data.model.uri = updatedUG.uri;
					data.model.modified = new Date(updatedUG.modified);
					data.model.loginUserModifyAccess = updatedUG.loginUserModifyAccess;
					data.model.loginUserRole = updatedUG.loginUserRole;
					data.model.memberList = updatedUG.memberList;
					let node = UsersGroupModel.appendRows(data.model);			
					UsersGroupSummaryDataGridView.getDataGridInstance().ensureNodeModelVisible(node, true);
					node.select();
					ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
				});
			}
			else if(data.share == true){
				var logicalAccessForMembers = {
					"role": data.respRole
				}
				UserGroupServicesController.fetchAndConnectUserGroup(grpid, data.model.uri, logicalAccessForMembers).then(function(resp) {
					let updatedUG = JSON.parse(resp);
					updatedUG = updatedUG.groups[0];
					data.model.owner = updatedUG.owner;
					data.model.pid = updatedUG.pid;
					data.model.myGroup = updatedUG.myGroup;
					data.model.ownerFullName = updatedUG.ownerFullName;
					data.model.name = updatedUG.name;
					data.model.state = updatedUG.state;
					data.model.id = updatedUG.id;
					data.model.uri = updatedUG.uri;
					data.model.modified = new Date(updatedUG.modified);
					data.model.loginUserModifyAccess = updatedUG.loginUserModifyAccess;
					data.model.loginUserRole = updatedUG.loginUserRole;
					data.model.memberList = updatedUG.memberList;
					let node = UsersGroupModel.appendRows(data.model);			
					UsersGroupSummaryDataGridView.getDataGridInstance().ensureNodeModelVisible(node, true);
					node.select();
					ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
				});
			}
			let summaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();
			UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar);
			//showHomeButton(true);
			//node.select();
			ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
		}); 
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-delete-row-by-ids', function (data) {
			if(data.model.length > 0){				
				UsersGroupModel.deleteRowModelByIds(data.model);
				let summaryToolbar = UsersGroupSummaryDataGridView.getGridViewToolbar();
				UserGroupCommands.updateSelectAllCount(UsersGroupModel.getModel(), summaryToolbar);
				ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
			}
		});
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-data-updated', function (data) {
			UsersGroupModel.updateRow(data);
			/*var args = "all";
			var viewIcon = UsersGroupSummaryDataGridView.getGridViewToolbar().getNodeModelByID("filter");
			if(viewIcon.options.grid.data.menu[0].state=="selected"){
				args=viewIcon.options.grid.data.menu[0].id;
	    	} else {
	    		args=viewIcon.options.grid.data.menu[1].id
	    	}
			filterUGSummaryView(args);*/
			ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: UsersGroupModel.getModel() });
		});
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-owner-changed', function (data) {
			UsersGroupModel.deleteRowModelByIds([data.pid]);		
			//filterUGSummaryView();
		});
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-Membersappend-rows', function (data) {
			UsersGroupModel.updateMemberCount(data);
		});

		
		/* ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-show-message', function (message) {
			widget.notify.handler().addNotif(message.message);			
		}); 
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-delete-rows', function (index) {
			UserGroupModel.deleteRowModelByIndex(index);				
		});
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-delete-selected-rows', function () {
			UserGroupModel.deleteRowModelSelected();			
		}); */
		/* ugSyncEvts.ugMgmtMediator.subscribe('usergroup-data-updated', function (data) {
			UserGroupModel.updateRow(data);		
			filterUGSummaryView();
		}); */
		
		ugSyncEvts.ugMgmtMediator.subscribe('usergroup-search-within-data', function(data) {
				var usergroupConfigIdsForFilter = userGroupConfigIdsFromModel();
				var typedValue = TagNavigator.getSearchWithInTypedValue();
				var tagProxy = TagNavigator.getTaggerVariable();
				var refineFilter = tagProxy.getCurrentFilter();

				if (usergroupConfigIdsForFilter.length > 1000 && typedValue == undefined) {
					usergroupConfigIdsForFilter = usergroupConfigIdsForFilter.slice(0, 1000);
				}
				performSearchOperation(refineFilter.allfilters, usergroupConfigIdsForFilter);
				
			});
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-reset-search-within-data', function (data) {
				var usergroupConfigIdsForFilter = userGroupConfigIdsFromModel();
	    		var tagProxy = TagNavigator.getTaggerVariable();
	    		var refineFilter = tagProxy.getCurrentFilter();
	        	if(usergroupConfigIdsForFilter.length > 1000){
	        		usergroupConfigIdsForFilter=usergroupConfigIdsForFilter.slice(0,1000);
	        	}
	        	performSearchOperation(refineFilter.allfilters, usergroupConfigIdsForFilter);
	        	
			});			
		}
	};
	
	let _openSingleUserGroup = function(){
		let uID;
		//for notification
		if(typeof widget.data.ids != "undefined"){
			uID = widget.data.ids;
		}
		//to support 'open with' protocol
		if(widget.data.contentId){
			uID = widget.data.contentId;
		}
		return uID;
	};
	
	let openSelectedUserGroup = function(id){
		let uID
		if(!id || id == null){
			uID = undefined; //_openSingleUserGroup();
		}
		else
			uID = id;
		if (widget.getValue('openedUserGroupId')) {
			uID = _openSingleUserGroup();			
		}

		if(uID){
			clearuserIdInfo();
			let userModel = UsersGroupModel.getRowModelById(uID)
			if(userModel) {
				userModel.select(true);
				if(widget.ugMgmtMediator){
					widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userModel.options.grid});
				}else{
					ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userModel.options.grid});
				}
				showHomeButton(true);
			}
			else {
				let selectedUG = UsersGroupModel.getSelectedRowsModel().data;
				selectedUG.forEach( userGroup => { userGroup.unselect() });				
   				UserGroupServicesController.fetchUserGroupById(uID).then(
				success => {
					let userGroupDetails = JSON.parse(success);
					userGroupDetails = userGroupDetails.groups[0];	
					userGroupDetails = DataFormatter.gridData(userGroupDetails);
					if(widget.ugMgmtMediator){
	   					widget.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userGroupDetails});
	   				}
	   				else{
					   ugSyncEvts.ugMgmtMediator.publish('usergroup-DataGrid-on-dblclick', {model:userGroupDetails});
					}
					showHomeButton(true);		
				},
       			failure => {
					backToUserGroupSummary();
					if(widget.ugMgmtMediator){
						widget.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.errorGroupDetailFetch,
							sticky: true
						});
					}else{
						ugSyncEvts.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.errorGroupDetailFetch,
							sticky: true
						});
					}
				});
			} 
		}

	};
	
	let clearuserIdInfo = function(){
		if(widget.data.contentId){
			widget.data.contentId = undefined;
		}
	};
	
	let destroy = function(){
		UsersGroupModel.destroy();
		UsersGroupSummaryDataGridView.destroy();
		UsersGroupSummaryTileView.destroy();
	}
	
	let UserGroupSummaryView = {
		 
		build : () => { return build();},
		backToUserGroupSummary: () => {return backToUserGroupSummary();},
		//destroyAndRedrawwithFilters : (args) => {filterUGSummaryView(args);},
		destroy : () => {destroy();},
		showHomeButton: (flag) => {return showHomeButton(flag);},
		openSelected: (id) => {return openSelectedUserGroup(id);},
		openSingleUserGroup: () => {return _openSingleUserGroup;},
		filterUserGroupSuccess: (success) => {return _filterUserGroupSuccess(success)},
		applyFilter: (titleToSearch, statusFilter, respFilter, userNameFilter) => {return applyFilter(titleToSearch, statusFilter, respFilter, userNameFilter);}
				
	};

	return UserGroupSummaryView;
});

define('DS/ENOUserGroupMgmt/Utilities/PlaceHolder',
        ['DS/Controls/Button',
        'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
        'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
        'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
        ],
        function(
                WUXButton,
                usersGroupModel,
                UsersGroupSummaryView,
                NLS
        ) {
        'use strict';
        
        let showEmptyUserGroupPlaceholder= function (container,userGroupModel) {

        	let existingPlaceholder = container.getElement('.no-usergroups-to-show-container');
            container.querySelector(".tile-view-container").setStyle('display', 'none');
            container.querySelector(".data-grid-container").setStyle('display', 'none');
            // The place holder is already hidden, we do nothing
            if (existingPlaceholder !== null) {
				if(widget.ugMgmtMediator){
            		widget.ugMgmtMediator.publish('usergroup-back-to-summary');
            		widget.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: usersGroupModel.getModel() });
            	}else{
					ugSyncEvts.ugMgmtMediator.publish('usergroup-back-to-summary');
					ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-count-update', { model: usersGroupModel.getModel() });
				}
                return existingPlaceholder;
            }
            
            var filterButton = UWA.createElement('span', {
                'class': 'no-usergroups-to-show-filter-shortcut fonticon fonticon-list-filter','title':NLS.filter
            }), createButton = UWA.createElement('span', {
                'class': 'no-usergroups-to-show-create-shortcut fonticon fonticon-users-group-add','title':NLS.newUserGroup
            });
            
            var placeholder = UWA.createElement('div', {
                'class': 'no-usergroups-to-show-container',
                html: [UWA.createElement('div', {
                    'class': 'no-usergroups-to-show',
                    html: [UWA.createElement('div', {
                        'class': 'pin',
                        html: '<span class="fonticon fonticon-5x fonticon-users-group"></span>'
                    }), UWA.createElement('span', {
                        'class': 'no-usergroups-to-show-label',
                        html: NLS.titles.placeholder.label
                    }), UWA.createElement('div', {
                        'class': 'no-usergroups-to-show-sub-container',
                        html: UWA.createElement('span', {
                            html: NLS.replace(NLS.titles.placeholder.sub, {
                                filter: filterButton.outerHTML,
                                create: createButton.outerHTML
                            })
                        })
                    })]
                })]
            });
            
            // The click events
            placeholder.getElement('.no-usergroups-to-show-filter-shortcut').addEventListener('click', function () {
                let doc = document.querySelector(".widget-container");
                doc.getElementsByClassName("wux-controls-button wux-controls-combobox-mainelement")[0].click();
                
            });
            placeholder.getElement('.no-usergroups-to-show-create-shortcut').addEventListener('click', function () {
                let doc = document.querySelector(".widget-container");
                doc.getElementsByClassName("wux-button-icon-fi wux-ui-genereatedicon-fi wux-ui-3ds wux-ui-3ds-users-group-add wux-ui-3ds-lg")[0].click();
            });
            container.appendChild(placeholder);
        };

        /**
         * Hides the special placeholder if you have issues to display.
         * @param {Node} container - The container of the application.
         */
        let hideEmptyUserGroupPlaceholder= function (container) {
        	 let placeholder = container.getElement('.no-usergroups-to-show-container');

             // The place holder is already hidden, we do nothing
             if (placeholder === null) {
                 return;
             }
                         
             container.querySelector(".tile-view-container").removeAttribute('style');
             container.querySelector(".data-grid-container").removeAttribute('style');
             // No more div
             placeholder.destroy();
             //container.querySelector(".no-routes-to-show-container").setStyle('display', 'none');

        };
        let showEmptyMemberPlaceholder= function (container) {
            let existingPlaceholder = container.getElement('.no-members-to-show-container');
            // We hide grid view and tile view is already hidden
            if(widget.readOnlyUG) {
	            container.querySelector(".GroupDetail-tileView-View").setStyle('display', 'none');
	            container.querySelector(".GroupDetail-gridView-View").setStyle('display', 'none');
		   }
		   else {
	            container.querySelector(".Members-tileView-View").setStyle('display', 'none');
	            container.querySelector(".Members-gridView-View").setStyle('display', 'none');
	       }
            
            // The place holder is already hidden, we do nothing
            if (existingPlaceholder !== null) {
                container.querySelector(".no-members-to-show-container").removeAttribute('style');
                return existingPlaceholder;
            }
            let placeholder = "";

        	placeholder = UWA.createElement('div', {
        		'class': 'no-members-to-show-container',
        		html: [UWA.createElement('div', {
                    'class': 'no-members-to-show',
                    html: [UWA.createElement('div', {
		                        'class': 'empty-state-icon',
		                        html: '<span class="fonticon fonticon-3x fonticon-users"></span>'
		                    }),
		                    UWA.createElement('span', {
		                        'class': 'no-members-to-show-label',
		                        html: NLS.emptyUserGroupMembers
	                    	})]
                })]
            });
            container.appendChild(placeholder);
        };
        
        let showEmptyAccessRightsPlaceholder= function (container) {

            let existingPlaceholder = container.getElement('.no-accessrights-to-show-container');
            // We hide grid view and tile view is already hidden
            container.querySelector(".accessrights-tileView-View").setStyle('display', 'none');
            container.querySelector(".accessrights-gridView-View").setStyle('display', 'none');
            
            // The place holder is already hidden, we do nothing
            if (existingPlaceholder !== null) {
                container.querySelector(".no-accessrights-to-show-container").removeAttribute('style');
                return existingPlaceholder;
            }
            let placeholder = "";

        	placeholder = UWA.createElement('div', {
        		'class': 'no-accessrights-to-show-container',
        		html: [UWA.createElement('div', {
                    'class': 'no-accessrights-to-show',
                    html: [UWA.createElement('div', {
		                        'class': 'empty-state-icon',
		                        html: '<span class="fonticon fonticon-3x fonticon-users"></span>'
		                    }),
		                    UWA.createElement('span', {
		                        'class': 'no-accessrights-to-show-label',
		                        html: NLS.emptyUserGroupAccessMembers
		                    })]
                })]
            });
            container.appendChild(placeholder);
        
        };

        let hideEmptyAccessRightsPlaceholder= function (container) {
        	let placeholder = container.getElement('.no-accessrights-to-show-container');

            // The place holder is already hidden, we do nothing
            if (placeholder === null) {
                return;
            }
                        
            container.querySelector(".accessrights-tileView-View").removeAttribute('style');
            container.querySelector(".accessrights-gridView-View").removeAttribute('style');
            // No more div
            placeholder.destroy();

        };

        /**
         * Hides the special placeholder if you have issues to display.
         * @param {Node} container - The container of the application.
         */
        let hideEmptyMemberPlaceholder= function (container) {
        	let placeholder = container.getElement('.no-members-to-show-container');

            // The place holder is already hidden, we do nothing
            if (placeholder === null) {
                return;
            }
                        
            container.querySelector(".Members-tileView-View").removeAttribute('style');
            container.querySelector(".Members-gridView-View").removeAttribute('style');
            // No more div
            placeholder.destroy();
        };
        

        
        
        let showeErrorPlaceholder= function (container) {
        	let existingPlaceholder = container.querySelector('.generic-error-container');

            if (container.querySelector(".tile-view-container")) {
                container.querySelector(".tile-view-container").setStyle('display', 'none');
            }
            if (container.querySelector(".data-grid-container")) {
                container.querySelector(".data-grid-container").setStyle('display', 'none');
            }
            if (container.querySelector("#dataGridDivToolbar")) {
                container.querySelector("#dataGridDivToolbar").setStyle('display', 'none');
            }

            if (existingPlaceholder !== null) {
                existingPlaceholder.removeAttribute('style');
                return;
            }

            let placeholder = UWA.createElement('div', {
                'class': 'generic-error-container',
                html: [UWA.createElement('div', {
                    'class': 'generic-error',
                    html: [UWA.createElement('span', {
                        'class': 'generic-error-label',
                        html: NLS.loading
                    })]
                })]
            });
            container.appendChild(placeholder);
        };

        let hideeErrorPlaceholder= function (container) {
        	
        };
       
        
        let registerListeners = function(){
			if(widget.ugMgmtMediator){
	        	widget.ugMgmtMediator.subscribe('hide-no-usergroup-placeholder', function (data) {
	        		hideEmptyUserGroupPlaceholder(document.querySelector(".widget-container"));
	            });
	        	widget.ugMgmtMediator.subscribe('show-no-usergroup-placeholder', function (data) {
	        		showEmptyUserGroupPlaceholder(document.querySelector(".widget-container"));
	            });
	        	widget.ugMgmtMediator.subscribe('hide-no-members-placeholder', function (data) {
	                hideEmptyMemberPlaceholder(document.querySelector(".usergroup-members-container"));
	             });
	        	widget.ugMgmtMediator.subscribe('show-no-members-placeholder', function (data) {
	                showEmptyMemberPlaceholder(document.querySelector(".usergroup-members-container"));
	            });
	        	widget.ugMgmtMediator.subscribe('hide-no-accessrights-placeholder', function (data) {
	        		hideEmptyAccessRightsPlaceholder(document.querySelector(".usergroup-accessrights-container"));
	             });
	        	widget.ugMgmtMediator.subscribe('show-no-accessrights-placeholder', function (data) {
	        		showEmptyAccessRightsPlaceholder(document.querySelector(".usergroup-accessrights-container"));
	            });
	            widget.ugMgmtMediator.subscribe('show-generic-error-placeholder', function (data) {
	                showeErrorPlaceholder(document.querySelector(".widget-container"));
	            });
            }else{
				ugSyncEvts.ugMgmtMediator.subscribe('hide-no-usergroup-placeholder', function (data) {
	        		hideEmptyUserGroupPlaceholder(document.querySelector(".widget-container"));
	            });
	        	ugSyncEvts.ugMgmtMediator.subscribe('show-no-usergroup-placeholder', function (data) {
	        		showEmptyUserGroupPlaceholder(document.querySelector(".widget-container"));
	            });
	        	ugSyncEvts.ugMgmtMediator.subscribe('hide-no-members-placeholder', function (data) {
	                hideEmptyMemberPlaceholder(document.querySelector(".usergroup-members-container"));
	             });
	        	ugSyncEvts.ugMgmtMediator.subscribe('show-no-members-placeholder', function (data) {
	                showEmptyMemberPlaceholder(document.querySelector(".usergroup-members-container"));
	            });
	        	ugSyncEvts.ugMgmtMediator.subscribe('hide-no-accessrights-placeholder', function (data) {
	        		hideEmptyAccessRightsPlaceholder(document.querySelector(".usergroup-accessrights-container"));
	             });
	        	ugSyncEvts.ugMgmtMediator.subscribe('show-no-accessrights-placeholder', function (data) {
	        		showEmptyAccessRightsPlaceholder(document.querySelector(".usergroup-accessrights-container"));
	            });
	            ugSyncEvts.ugMgmtMediator.subscribe('show-generic-error-placeholder', function (data) {
	                showeErrorPlaceholder(document.querySelector(".widget-container"));
	            });
			}
        };
        
        let PlaceHolder = {
                hideEmptyUserGroupPlaceholder : (container) => {return hideEmptyUserGroupPlaceholder(container);},
                showEmptyUserGroupPlaceholder : (container,userGroupModel) => {return showEmptyUserGroupPlaceholder(container,userGroupModel);},
                hideEmptyMemberPlaceholder : (container) => {return hideEmptyMemberPlaceholder(container);},
                showEmptyMemberPlaceholder : (container, hideAddExistingbutton) => {return showEmptyMemberPlaceholder(container, hideAddExistingbutton);},
                hideEmptyAccessRightsPlaceholder : (container) => {return hideEmptyAccessRightsPlaceholder(container);},
                showEmptyAccessRightsPlaceholder : (container, hideAddExistingbutton) => {return showEmptyAccessRightsPlaceholder(container, hideAddExistingbutton);},
                showeErrorPlaceholder : (container) => {return showeErrorPlaceholder(container);},
                hideeErrorPlaceholder : (container) => {return hideeErrorPlaceholder(container);},
                registerListeners : () => {return registerListeners();}
        }
        return PlaceHolder;

    });


define('DS/ENOUserGroupMgmt/Views/UsersGroupHeaderView', [
	'DS/Menu/Menu',
	'DS/ENOUserGroupMgmt/Views/Menu/UsersGroupContextualMenu',
	'DS/WebappsUtils/WebappsUtils',
	'DS/ENOUserGroupMgmt/Utilities/IdCardUtil',
	'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
	'DS/ENOUserGroupMgmt/Services/LifecycleServices',
	'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
	'DS/ENOUserGroupMgmt/Views/Dialogs/RemoveUsersGroup',
	'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
	'DS/i3DXCompassPlatformServices/OpenWith',
	'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
	'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css',
],
  function (WUXMenu, UserGroupContextualMenu, WebappsUtils, IdCardUtil, RequestUtils, LifecycleServices, UsersGroupModel, RemoveUsersGroup, UsersGroupSummaryView, OpenWith, NLS) {
	'use strict';
	let userGroupIdCard;
	var UserGroupHeaderView = function(container){
	  this.container = container;
	  userGroupIdCard = container && container.querySelector("#userGroupIdCard");
	};
	
	UserGroupHeaderView.prototype.resizeSensor = function(){
		/* new ResizeSensor(userGroupIdCard, function () {
			IdCardUtil.resizeIDCard(userGroupIdCard.offsetWidth);
		}); */
	};
	
	let getContentForCompassInteraction = function(data){
		let itemsData = [];
		let item = {
				'envId': widget.getValue('x3dPlatformId'),
				'serviceId': "3DSpace",
				'contextId': "",
				'objectId': data.Id,
				'objectType': data.Type,
				'displayName': data.Title,
				'displayType': data.Type,
				'facetName' : 'realized',
				"path": [{
					"resourceid": data.Id,
					"type": data.Type
				}]
		//"objectTaxonomies":that.getObjectTaxonomies(selectedNode)
		};
		itemsData.push(item);

		let compassData = {
				protocol: "3DXContent",
				version: "1.1",
				source: widget.getValue("appId"),
				widgetId: widget.id,
				data: {
					items: itemsData
				}
		};
		return compassData;
	};
	
	let getOpen = function(data) {
		let content = getContentForCompassInteraction(data);
		let openWith = new OpenWith();
		openWith.set3DXContent(content); 
		let apps = [];
		if (UWA.is(openWith.retrieveCompatibleApps, 'function')) {
			return new Promise(function(resolve, reject) {
				openWith.retrieveCompatibleApps(function(appsList) {
					appsList.forEach(function(app) {
						
						if(app.name == "X3DUGRP_AP"){
							resolve(app);
						}
						
					});
					resolve({});
				},function(){
					reject(new Error("Error while getting Open with menus"));
				});
			});
		}
	};

	let getOpenWithMenu = function(data) {
		  return new Promise(function(resolve, reject) {
			  getOpen(data).then(
				  success => {
					  if (success && typeof success.handler == "function") {
							  success.handler();
					  }
					  resolve();
				  },
				  failure => {
					  resolve();
				  });
		  });
	};
	/*
	let getSubmenuOptions = function(app, model) {
		return {
			id: app.text,
			title: app.text,
			icon: app.icon,
			type: 'PushItem',
			multisel: false,
			action: {
				context: model,
				callback: app.handler
			}
		};
	};*/
	
	UserGroupHeaderView.prototype.init = function(data,infoIconActive,readOnly){
		//add all the required information in ugHeader like usergroup name 
		//Expander to expand the right panel
		userGroupIdCard = new UWA.Element('div',{"id":"userGroupIdCard","class":""});
		this.container.appendChild(userGroupIdCard);
					
		var infoAndThumbnailSec = new UWA.Element('div',{"id":"infoAndThumbnailSec","class":"id-card-info-and-thumbnail-section"});
		userGroupIdCard.appendChild(infoAndThumbnailSec);
		
		var backgroundImage;
		if(data.model.state==="Public"){
			backgroundImage = "url("+WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePublicUserGroup.png')+")";
		}
		else if(data.model.state==="Private"){
			backgroundImage = "url("+WebappsUtils.getWebappsAssetUrl('ENOUserGroupMgmt','icons/144/iconLargePrivateUserGroup.png')+")";
		}
		
		// Add thumbnail //
		var thumbnailSec = new UWA.Element('div',{
			"id":"thumbnailSection",
			"class":"id-card-thumbnail-section",
			"html":[
				  UWA.createElement('div',{
					  "class":"id-card-thumbnail",
					  styles:{
						  "background-image": backgroundImage
					  }
				  	})]
		});
		infoAndThumbnailSec.appendChild(thumbnailSec);
		
		// Info section //
		var infoSec = new UWA.Element('div',{"id":"infoSec","class":"id-card-info-section no-bottom-border"});
		infoAndThumbnailSec.appendChild(infoSec);
		
		// Info header will have title and Action //
		var infoHeaderSec = new UWA.Element('div',{"id":"infoHeaderSec","class":"id-card-header-section"});
		infoSec.appendChild(infoHeaderSec);
		
		var infoHeaderSecTitle = new UWA.Element('div',{"id":"infoHeaderSecTitle","class":"id-card-title-section"});
		infoHeaderSec.appendChild(infoHeaderSecTitle);
		/*var displayName = data.model.Name;
		  if(data.model.Name.length > 30){
			  displayName = data.model.Name.substring(0,27) + "...";
		  }*/
		UWA.createElement('h4',{
			  "html": [
				  UWA.createElement('span',{
					  "text": data.model.title,
					  "title": data.model.title
				  })]
		}).inject(infoHeaderSecTitle);
		
		// Header Section Actions //
		var infoHeaderSecAction = new UWA.Element('div',{"id":"infoHeaderSecAction","class":"id-card-actions-section"});
		infoHeaderSec.appendChild(infoHeaderSecAction);
		
		if(readOnly) {
			let openGroupDiv = UWA.createElement('div',{
				"id" : "openGroup",
				"class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-login fonticon-display",
				"title" : NLS.Open,
				styles : {"font-size": "20px"},
				events: {
	                click: function (event) {
						require(['DS/ENOUserGroupMgmt/Views/Dialogs/UsersGroupViewDetailDialog'], function(UsersGroupViewDetailDialog) {
						
						if(widget.ugMgmtMediator){
							// The coordinates to show the menu
							var pos = event.target.getBoundingClientRect();
							var config = {
								position: {
									x: pos.left,
									y: pos.top
								}
							};

							var menu = [];
							var data1 = {
								"Id" : data.model.pid,
								"Title" : data.model.title,
								"Type": "Group"
							}
							/*getOpenWithMenu(data1).then(function(openWithMenu) {
								menu = menu.concat(openWithMenu);
								WUXMenu.show(menu, config);
							});*/
							getOpenWithMenu(data1);
							
						}
						else{
							UsersGroupViewDetailDialog.getDialog().close();
							UsersGroupSummaryView.openSelected(data.model.pid);
						}
				});
	                }
				}
			}).inject(infoHeaderSecAction);
		}
		else {
			// header action - cheveron 
			var usergroupDetails = {};
			var userGroupDetailsData = [];
			// Delete function accept the data in format of data grid model //
			// So converting the data here to grid format to reuse the functionality //
			var gridFormat = {};
			gridFormat.options = {};
			gridFormat.options.grid = data.model;
			userGroupDetailsData.push(gridFormat);
			usergroupDetails.data = userGroupDetailsData;
			/*if(userGroupDetailsData[0].options.grid.state != "Complete" && data.model.Actions.indexOf("delete") > -1){
				UserGroupContextualMenu.usergroupIdCardCheveron(usergroupDetails).inject(infoHeaderSecAction);
			}*/
			
			if(RequestUtils.contextUser == usergroupDetails.data[0].options.grid.owner || RequestUtils.isAdmin){
				
				if(data.model.state=="Private"){
					let changeVisibilityDiv = UWA.createElement('div',{
						"id" : "changeVisibility",
						"class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-user-eye fonticon-display",
						"title" : NLS.changeVisibility,
						styles : {"font-size": "20px"},
						events: {
			                click: function (event) {
			                	LifecycleServices.visibilityChangeConfirmation(data.model);
			                }
						}
					}).inject(infoHeaderSecAction);
				}
				
				let deleteGroupDiv = UWA.createElement('div',{
					"id" : "deleteGroup",
					"class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-trash fonticon-display",
					"title" : NLS.Delete,
					styles : {"font-size": "20px"},
					events: {
		                click: function (event) {
		                	RemoveUsersGroup.removeConfirmation({data:[UsersGroupModel.getRowModelById(data.model.id)]}, true);
		                }
					}
				}).inject(infoHeaderSecAction);
			}
	
			// header action - hide
			UWA.createElement('div',{
				"id" : "expandCollapse",
				"class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-expand-up fonticon-display",
				"title" : NLS.idCardHeaderActionCollapse,
				styles : {"font-size": "20px"},
				events: {
	                click: function (event) {
	                	collapseExpand();
	                }
				}
			}).inject(infoHeaderSecAction);
		}
		
		// header action - info
		var infoDisplayClass = "fonticon-color-display";
		if(infoIconActive){
			infoDisplayClass = "fonticon-color-active";
		}

		// Info Detail Section //
		var infoDetailedSec = new UWA.Element('div',{"id":"infoDetailedSec","class":"id-card-detailed-info-section"});
		infoSec.appendChild(infoDetailedSec);
		

		
		// channel 1 //
		var infoChannel1 = new UWA.Element('div',{
													"id":"channel1",
													"class":"properties-channel"
												});
		infoDetailedSec.appendChild(infoChannel1);

		  // owner
		  UWA.createElement('div',{
			  "html":[
				  UWA.createElement('span',{
					  "html": data.model.ownerFullName,
					  "class":""
				  	})
				  ]}).inject(infoChannel1);
		 
		  // members
		  var members = data.model.members;
		  var memStr = members+" "+NLS.members
		  if(members === 0 || members === 1){
			  memStr = members+" "+NLS.member
		  }
		  
		  UWA.createElement('div',{
			  "html":[
				  UWA.createElement('span',{
					  "html": memStr,
					  "class":""
				  	})
				  ]}).inject(infoChannel1);
		  
		  
		  var visibilityDisp = data.model.state=="Private" ? NLS.private: NLS.public
		  var stateDiv = UWA.createElement('div',{
			  //"class":"maturity-state",
			  "class":"",
			  "html":[
				  UWA.createElement('span',{
					  "html": visibilityDisp,
					  "class":""
				  	})
			  ]});
		  
		  /*if((RequestUtils.contextUser == usergroupDetails.data[0].options.grid.owner || RequestUtils.isAdmin) && data.model.state=="Private") {
				UWA.createElement('span',{
			  		  "html": UserGroupContextualMenu.ugIdCardStateCheveron(data.model),
			  		  "class":"",
			  	  }).inject(stateDiv);
		  }*/
		  stateDiv.inject(infoChannel1);
		  

		  
		  var infoChannel2 = new UWA.Element('div',{
				"id":"channel2",
				"class":"properties-channel"
		  });
		  infoDetailedSec.appendChild(infoChannel2);
		  

		  
		  var infoChannel3 = new UWA.Element('div',{
				"id":"channel3",
				"class":"properties-channel"
		  });
		  infoDetailedSec.appendChild(infoChannel3);
		  // Description
		  /*var displayDesc = data.model.Description;
		  if(data.model.Description.length > 150){
			  displayDesc = data.model.Description.substring(0,147) + "...";
		  }*/
		  UWA.createElement('div',{
			  "class": "id-card-description",
			  "html":[
				  UWA.createElement('span',{
					  "text": data.model.description,
					  "title": data.model.description,
					  "class":""
				  	})
				  ]}).inject(infoChannel3);
    };
    UserGroupHeaderView.prototype.destroyContainer = function(){
    	//destroy container
    	this.container.destroy();
    };
    UserGroupHeaderView.prototype.destroyContent = function(){
    	//destroy content
    	if (typeof userGroupIdCard.destroy == "function") userGroupIdCard.destroy();
    };
    
    let collapseExpand = function(){
    	var expandCollapse = document.querySelector('#expandCollapse');
		  var userGroupHeaderContainer = document.querySelector('#userGroupHeaderContainer');
		 // var graphCanvas = document.querySelector('#graph_canvas_view');
		 // let graphContainer = document.querySelector('.usergroup-graph-task-container');
		 let memberGridView = document.querySelector('.Members-gridView-View');		
		 let accessrightsGridView = document.querySelector('.accessrights-gridView-View');		
		 
		  if(expandCollapse.className.indexOf("wux-ui-3ds-expand-up") > -1){
			  // collapse
			  expandCollapse.className = expandCollapse.className.replace("wux-ui-3ds-expand-up", "wux-ui-3ds-expand-down");
			  userGroupHeaderContainer.classList.add('minimized');
			  expandCollapse.title = NLS.idCardHeaderActionExpand;
			  // handle the hide thumbnail case //
			  var thumbnailSection = document.querySelector('#thumbnailSection');
			  if(thumbnailSection && thumbnailSection.className.indexOf("id-card-thumbnail-remove") > -1){
				  var infoSec = document.querySelector('#infoSec');
				  infoSec.classList.remove("id-info-section-align");
				  infoSec.classList.add("id-info-section-align-minimized");
			  }
			  /*if(graphCanvas){
				  graphCanvas.style.top = "136px";
			  }*/
			  if(memberGridView)
				memberGridView.setStyle("height","calc(100% - 0px)");
			if(accessrightsGridView)
				accessrightsGridView.setStyle("height","calc(100% - 0px)");
			
			  //graphContainer.setStyle("height","calc(100% - 96px)");
		  }else{
			  // expand
			  expandCollapse.className = expandCollapse.className.replace("wux-ui-3ds-expand-down", "wux-ui-3ds-expand-up");
			  userGroupHeaderContainer.classList.remove('minimized');
			  expandCollapse.title = NLS.idCardHeaderActionCollapse;
			// handle the hide thumbnail case //
			  var thumbnailSection = document.querySelector('#thumbnailSection');
			  if(thumbnailSection && thumbnailSection.className.indexOf("id-card-thumbnail-remove") > -1){
				  var infoSec = document.querySelector('#infoSec');
				  infoSec.classList.remove("id-info-section-align-minimized");
				  infoSec.classList.add("id-info-section-align");
			  }
			  if(memberGridView)
				memberGridView.setStyle("height","calc(100% - 60px)");
			  if(accessrightsGridView)
				accessrightsGridView.setStyle("height","calc(100% - 60px)");
			
			  //graphContainer.removeAttribute('style');
			  //graphContainer.style.removeProperty("height");
		  }
    };
    
    
    return UserGroupHeaderView;
});


define('DS/ENOUserGroupMgmt/Views/UsersGroupIDCardView', [
  'DS/ENOUserGroupMgmt/Views/UsersGroupHeaderView',
  'DS/ENOUserGroupMgmt/Views/UsersGroupTabsView',
  'DS/ENOUserGroupMgmt/Utilities/IdCardUtil',
  'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
  'DS/ENOUserGroupMgmt/Model/UsersGroupModel'
],
  function (UserGroupHeaderView, UserGroupTabsView, IdCardUtil, DataFormatter,UsersGroupModel) {
	'use strict';
	let headerContainer, facetsContainer, idLoaded, userGroupUataUpdatedToken, userGroupDataDeletedToken,userGroupHeaderUpdatedToken;
	const destroyViews = function(){
		new UserGroupHeaderView(headerContainer).destroyContainer();
		new UserGroupTabsView(facetsContainer).destroy();
		if(widget.ugMgmtMediator){
			if(userGroupUataUpdatedToken){
	    		widget.ugMgmtMediator.unsubscribe(userGroupUataUpdatedToken);
	    	}
			if(userGroupDataDeletedToken){
	    		widget.ugMgmtMediator.unsubscribe(userGroupDataDeletedToken);
	    	}
			if(userGroupHeaderUpdatedToken){
	    		widget.ugMgmtMediator.unsubscribe(userGroupHeaderUpdatedToken);
	    	}
	    }else{
			if(userGroupUataUpdatedToken){
	    		ugSyncEvts.ugMgmtMediator.unsubscribe(userGroupUataUpdatedToken);
	    	}
			if(userGroupDataDeletedToken){
	    		ugSyncEvts.ugMgmtMediator.unsubscribe(userGroupDataDeletedToken);
	    	}
			if(userGroupHeaderUpdatedToken){
	    		ugSyncEvts.ugMgmtMediator.unsubscribe(userGroupHeaderUpdatedToken);
	    	}
		}
		
    };
	var UserGroupIDCardWrapper = function(rightPanel){
		this.rightPanel = rightPanel;
	  	headerContainer = new UWA.Element('div',{"id":"userGroupHeaderContainer","class":"usergroup-header-container"});
	  	facetsContainer = new UWA.Element('div',{"id":"usergroupFacetsContainer","class":"usergroup-facets-container",styles:{"height":"100%"}});	 	
	};
	UserGroupIDCardWrapper.prototype.init = function(data){	
		destroyViews(); //to destroy any pre-existing views
		var infoIconActive = false;
		new UserGroupHeaderView(headerContainer).init(data,infoIconActive);
		idLoaded = data.model.uri;
		new UserGroupTabsView(facetsContainer, data).init();
		
	 	this.rightPanel.getLeftViewWrapper().appendChild(headerContainer);
	 	this.rightPanel.getLeftViewWrapper().appendChild(facetsContainer);
	 	
	 	new UserGroupHeaderView(headerContainer).resizeSensor();
	 	UsersGroupModel.setUserGroupDetails(data);	 	
	 	// Events //
	 	if(widget.ugMgmtMediator){
		 	userGroupUataUpdatedToken = widget.ugMgmtMediator.subscribe('usergroup-data-updated', function (data) {
		 		var dataModel = {model:DataFormatter.gridData(data)};
		 		// check if usergroup details updated are same loaded in the id card //
		 		// Case when usergroup is loaded and in usergroup summary page user does action on usergroup2 //
		 		// then do not refresh id card //
		 		if(dataModel.model.uri == idLoaded){
		 			// On usergroup properties save, refresh only header data //
		 			// Clear the existing id card header data. Do no destroy the container, only content for refresh header data//
		 			// 105941 need to check the  infoIconIsActive is false or true
		 			//var infoIconActive = IdCardUtil.infoIconIsActive();      
		 			new UserGroupHeaderView(headerContainer).destroyContent();
		 			new UserGroupHeaderView(headerContainer).init(dataModel,infoIconActive);
		 			new UserGroupHeaderView(headerContainer).resizeSensor();
		 			/*if(widget.propWidgetHistoryOpen){
		 				// refresh history tab only //
		 				UserGroupHistory.onRefresh();
		 			}
		 			else*/ if(widget.propWidgetOpen){
		        		  // To persist the edit prop widget open //
		 					if(data.requestFrom && data.requestFrom == "editPropWidget"){
		 						// do not refresh the edit prop widget // 
		 						// the request is coming from edit prop widget itself //
		 					}else{
		 						widget.ugMgmtMediator.publish('usergroup-header-info-click', {model: dataModel.model});
		 					}
		        	}
		 		}
		 	});
	 	}else{
			 userGroupUataUpdatedToken = ugSyncEvts.ugMgmtMediator.subscribe('usergroup-data-updated', function (data) {
		 		var dataModel = {model:DataFormatter.gridData(data)};
		 		// check if usergroup details updated are same loaded in the id card //
		 		// Case when usergroup is loaded and in usergroup summary page user does action on usergroup2 //
		 		// then do not refresh id card //
		 		if(dataModel.model.uri == idLoaded){
		 			// On usergroup properties save, refresh only header data //
		 			// Clear the existing id card header data. Do no destroy the container, only content for refresh header data//
		 			// 105941 need to check the  infoIconIsActive is false or true
		 			//var infoIconActive = IdCardUtil.infoIconIsActive();      
		 			new UserGroupHeaderView(headerContainer).destroyContent();
		 			new UserGroupHeaderView(headerContainer).init(dataModel,infoIconActive);
		 			new UserGroupHeaderView(headerContainer).resizeSensor();
		 			/*if(widget.propWidgetHistoryOpen){
		 				// refresh history tab only //
		 				UserGroupHistory.onRefresh();
		 			}
		 			else*/ if(widget.propWidgetOpen){
		        		  // To persist the edit prop widget open //
		 					if(data.requestFrom && data.requestFrom == "editPropWidget"){
		 						// do not refresh the edit prop widget // 
		 						// the request is coming from edit prop widget itself //
		 					}else{
		 						ugSyncEvts.ugMgmtMediator.publish('usergroup-header-info-click', {model: dataModel.model});
		 					}
		        	}
		 		}
		 	});
		 }
	 	if(widget.ugMgmtMediator){
		 	userGroupHeaderUpdatedToken = widget.ugMgmtMediator.subscribe('usergroup-header-updated', function (data) {
		 		if(data.model.uri==idLoaded){
		 			new UserGroupHeaderView(headerContainer).destroyContent();
		 			new UserGroupHeaderView(headerContainer).init(data,infoIconActive);
		 			new UserGroupHeaderView(headerContainer).resizeSensor();
		 		}
		 	});
		 	
		 	userGroupDataDeletedToken = widget.ugMgmtMediator.subscribe('usergroup-data-deleted', function (data) {
		 		if(data.model.includes(idLoaded)){
		 			// close the id card only if the usergroup opened in id card is been deleted and go to usergroup home summary page //
		 			require(['DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView'], function (UsersGroupSummaryView) {
		 				UsersGroupSummaryView.backToUserGroupSummary();
		 			});
		 		}
		 	});
	 	}else{
			 userGroupHeaderUpdatedToken = ugSyncEvts.ugMgmtMediator.subscribe('usergroup-header-updated', function (data) {
		 		if(data.model.uri==idLoaded){
		 			new UserGroupHeaderView(headerContainer).destroyContent();
		 			new UserGroupHeaderView(headerContainer).init(data,infoIconActive);
		 			new UserGroupHeaderView(headerContainer).resizeSensor();
		 		}
		 	});
		 	
		 	userGroupDataDeletedToken = ugSyncEvts.ugMgmtMediator.subscribe('usergroup-data-deleted', function (data) {
		 		if(data.model.includes(idLoaded)){
		 			// close the id card only if the usergroup opened in id card is been deleted and go to usergroup home summary page //
		 			require(['DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView'], function (UsersGroupSummaryView) {
		 				UsersGroupSummaryView.backToUserGroupSummary();
		 			});
		 		}
		 	});
		 }
    };
    UserGroupIDCardWrapper.prototype.destroy = function(){
    	//destroy
    	this.rightPanel.destroy();
    };
    
    return UserGroupIDCardWrapper;

  });

/**
 * 
 *
 */
define('DS/ENOUserGroupMgmt/Views/UsersGroupHomeSplitView',
['DS/ENOUserGroupMgmt/Components/Wrappers/SplitViewWrapper',
'DS/ENOUserGroupMgmt/Views/UsersGroupIDCardView',
'DS/ENOUserGroupMgmt/Views/RightPanelSplitView',
'DS/ENOUserGroupMgmt/Utilities/IdCardUtil'
	],
function(SplitViewWrapper, UserGroupIDCardWrapper, RightPanelSplitView, IdCardUtil) {

    'use strict';
    var UserGroupHomeSplitView = function () { };
    /**
     * UserGroupHomeSplitView to show the right side slidein.
     * @param  {[Mediator]} applicationChannel [required:Mediator object for communication]
     *
     */
    UserGroupHomeSplitView.prototype.getSplitView = function (appChannel) {
        var sView = new SplitViewWrapper();
        var split_options = {
          modelEvents: appChannel,
          withtransition: false,
          withoverflowhidden: false,
          params: {
        	// leftWidth calculates width and left position   
            leftWidth: 25,
            rightWidth: 75,
			leftMinWidth:25,
            leftVisible: true,
            rightVisible: false
          },
          rightMaximizer: false,
          leftMaximizer: false,
          resizable: true
          //mobileOptim: true
        };
        sView.init(split_options);
    //    sView.setContextForGesture();
        return sView;
      };
      
      UserGroupHomeSplitView.prototype.setSplitviewEvents = function(splitView){
          var me = splitView;
          var selectedId = "";
          
          // right panel for properties and other slide in //
          let rightPanel;
          if(widget.ugMgmtMediator){
          	rightPanel = new RightPanelSplitView().getSplitView(widget.ugMgmtMediator.getEventBroker());
          }else{
		  	rightPanel = new RightPanelSplitView().getSplitView(ugSyncEvts.ugMgmtMediator.getEventBroker());
		  }
          new RightPanelSplitView().setSplitviewEvents(rightPanel);
          var leftContent = me.getRightViewWrapper();
          leftContent.setContent(rightPanel.getContent());
          me.addRightPanelExpander();
          
          let userGroupIDCardWrapper = new UserGroupIDCardWrapper(rightPanel);
          if(widget.ugMgmtMediator){
	          widget.ugMgmtMediator.subscribe('refresh-widget', function (data) {  
			  		userGroupIDCardWrapper.destroy();
			  });
	          widget.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {       	  
	        	  	userGroupIDCardWrapper.init(data);
	        	  	me._showSide("right");
	        	  	// To persist the ID card collapse //
	        	  	IdCardUtil.collapseIcon();
	        	  	//top.updateShortcutMap("recentlyViewed",data.model.pid);
	        	  if(widget.propWidgetOpen){
	        		  // To persist the edit prop widget open //
	        		  widget.ugMgmtMediator.publish('usergroup-header-info-click', {model: data.model});
	        	  }else{
	        		  // If any other right panel is opened close it //
	        		  widget.ugMgmtMediator.publish('usergroup-task-close-click-view-mode', {model: data.model});
	        		  widget.ugMgmtMediator.publish('usergroup-task-close-click-edit-mode', {model: data.model});
	        	  }
	        	  widget.ugMgmtMediator.publish('usergroup-widgetTitle-update-withusergroupName', {model: data.model});
	          });
	          
	          widget.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
	        	  if (!me._leftVisible) {
	        		  me._showSide("left");
	        	  }
	              if (me._rightVisible) {
	                me._hideSide("right");
	              }
	            });
	            
	          		
			widget.ugMgmtMediator.subscribe('splitview-size-changed', function(){
				let filtersLayout = document.querySelector(".filters");
				let filterItems = document.querySelectorAll(".column-filter, .column-filter-no-private");
				let filterDiv = document.getElementById("dataGridDivToolbar");
				let filterDivNoPrivate = document.getElementById("dataGridDivToolbarNoPrivate");
				let GridDiv = document.getElementById("dataGridViewContainerMain");
				let searchButton = document.querySelector("div#filterSearch .wux-controls-button");
				let emptyPlaceholder = document.querySelector(".no-usergroups-to-show-container");
				if (me._rightVisible && me._leftPanel.getDimensions().width<600) {
	                filtersLayout.addClassName("filterSplitView");
	                filterItems.forEach(function(elem){
						elem.addClassName("filterSplit");
					})
					if(filterDiv){
						filterDiv.addClassName("filterSplitFlex");
					} else if(filterDivNoPrivate){
						filterDivNoPrivate.addClassName("filterSplitFlexNoPrivate");
					}
					if(GridDiv){
						GridDiv.addClassName("rightSplitOpen");
					}
					searchButton.addClassName("searchFloat");
	            }
	            if (!me._rightVisible || (me._rightVisible && me._leftPanel.getDimensions().width>600)) {
	        		filtersLayout.removeClassName("filterSplitView");
	        		filterItems.forEach(function(elem){
						elem.removeClassName("filterSplit");
					})
					if(filterDiv){
						filterDiv.removeClassName("filterSplitFlex");
					} else if(filterDivNoPrivate){
						filterDivNoPrivate.removeClassName("filterSplitFlexNoPrivate");
					}
					if(GridDiv){
						GridDiv.removeClassName("rightSplitOpen");
					}
					searchButton.removeClassName("searchFloat");
	        	}
			});
		}else{
			ugSyncEvts.ugMgmtMediator.subscribe('refresh-widget', function (data) {  
			  		userGroupIDCardWrapper.destroy();
			  });
	          ugSyncEvts.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {       	  
	        	  	userGroupIDCardWrapper.init(data);
	        	  	me._showSide("right");
	        	  	// To persist the ID card collapse //
	        	  	IdCardUtil.collapseIcon();
	        	  	//top.updateShortcutMap("recentlyViewed",data.model.pid);
	        	  if(widget.propWidgetOpen){
	        		  // To persist the edit prop widget open //
	        		  ugSyncEvts.ugMgmtMediator.publish('usergroup-header-info-click', {model: data.model});
	        	  }else{
	        		  // If any other right panel is opened close it //
	        		  ugSyncEvts.ugMgmtMediator.publish('usergroup-task-close-click-view-mode', {model: data.model});
	        		  ugSyncEvts.ugMgmtMediator.publish('usergroup-task-close-click-edit-mode', {model: data.model});
	        	  }
	        	  ugSyncEvts.ugMgmtMediator.publish('usergroup-widgetTitle-update-withusergroupName', {model: data.model});
	          });
	          
	          ugSyncEvts.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
	        	  if (!me._leftVisible) {
	        		  me._showSide("left");
	        	  }
	              if (me._rightVisible) {
	                me._hideSide("right");
	              }
	            });
	            
	          		
			ugSyncEvts.ugMgmtMediator.subscribe('splitview-size-changed', function(){
				let filtersLayout = document.querySelector(".filters");
				let filterItems = document.querySelectorAll(".column-filter, .column-filter-no-private");
				let filterDiv = document.getElementById("dataGridDivToolbar");
				let filterDivNoPrivate = document.getElementById("dataGridDivToolbarNoPrivate");
				let GridDiv = document.getElementById("dataGridViewContainerMain");
				let searchButton = document.querySelector("div#filterSearch .wux-controls-button");
				let emptyPlaceholder = document.querySelector(".no-usergroups-to-show-container");
				if (me._rightVisible && me._leftPanel.getDimensions().width<600) {
	                filtersLayout.addClassName("filterSplitView");
	                filterItems.forEach(function(elem){
						elem.addClassName("filterSplit");
					})
					if(filterDiv){
						filterDiv.addClassName("filterSplitFlex");
					} else if(filterDivNoPrivate){
						filterDivNoPrivate.addClassName("filterSplitFlexNoPrivate");
					}
					if(GridDiv){
						GridDiv.addClassName("rightSplitOpen");
					}
					searchButton.addClassName("searchFloat");
	            }
	            if (!me._rightVisible || (me._rightVisible && me._leftPanel.getDimensions().width>600)) {
	        		filtersLayout.removeClassName("filterSplitView");
	        		filterItems.forEach(function(elem){
						elem.removeClassName("filterSplit");
					})
					if(filterDiv){
						filterDiv.removeClassName("filterSplitFlex");
					} else if(filterDivNoPrivate){
						filterDivNoPrivate.removeClassName("filterSplitFlexNoPrivate");
					}
					if(GridDiv){
						GridDiv.removeClassName("rightSplitOpen");
					}
					searchButton.removeClassName("searchFloat");
	        	}
			});
		}
		
      };


   return UserGroupHomeSplitView;

});

define('DS/ENOUserGroupMgmt/ENOUGToolWebApp',
	[
	 	'UWA/Core',
	 	'UWA/Controls/Abstract',
	 	'Core/Core',
		'DS/ENOUserGroupMgmt/Components/Mediator',
		'DS/ENOUserGroupMgmt/Components/Notifications',
	 	'DS/WAFData/WAFData',
	 	'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'DS/ENOUserGroupMgmt/Views/UsersGroupHomeSplitView',
		'DS/Windows/ImmersiveFrame',
		'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
		'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
	 	'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css'
	],
	function(UWA, Abstract, Core,Mediator, Notifications, WAFData, RequestUtils, UsersGroupHomeSplitView, WUXImmersiveFrame,UsersGroupSummaryView,UserGroupBootstrap,NLS){
	
        "use strict";

        var usersGroupWebApp = Abstract.extend({

        	mApplication: null,

            /**
             * Contructor
             *
             * @method      init
             * @param       {Object} options option/value pair.
             */
            init: function (iApp) {
                this._parent();
                var context = this;
				
                this.container = new UWA.Element('div', {
                    'class': 'divExportTool'
                });
			
                this.mApplication = iApp;
                RequestUtils.send3DSpaceRequest(
    	        		RequestUtils.getUserGroupServiceBaseURL() + "/application/configuration",
    	                "GET",
    	                {
    	                    "type": "json",
    	        			"headers": {"Content-type": "application/json"}
    	                },
    	                function(iResult){  
    	                	RequestUtils.set3DSpaceCSRFToken(iResult.csrf);	
                            RequestUtils.setSecurityContext(iResult.SecurityContext);
                            RequestUtils.setIsAdmin(iResult.isAdmin);
                            RequestUtils.setIsLeader(iResult.isLeader);
                            RequestUtils.setIsAuthor(iResult.isAuthor);
                            RequestUtils.setContextUser(iResult.contextUser, iResult.contextUserFullName, iResult.contextUserID);
                            RequestUtils.setAllowPrivateUserGroup(iResult.AllowPrivateUserGroup);
                            RequestUtils.getPopulate3DSpaceURL();
    	                	context.render();
    	                }
    	        );

            },

            /**
             * Instanciates the control's components.
             *
             * @private
             * @method render
             */
            render: function () {
            	document.title =NLS.APPHeader;
                var context = this;
            	//initialize the mediators to enable interactions among components
			ugSyncEvts.ugMgmtMediator = new Mediator(); //setting channel as global for communication between components
			ugSyncEvts.ugNotify =  new Notifications();
			var containerDiv = null;
			
			UserGroupBootstrap.start({});

			return new Promise(
					function(resolve /*, reject*/) {

						require([ 'UWA/Core',
								'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView' ],
								function(UWAModule, UsersGroupSummaryView) {

								 	UsersGroupSummaryView.build().then(
											function(container) {
												containerDiv = container;
												resolve();
											}); 

								});

					}).then(function() {
				return new Promise(function(resolve, reject) {
					//
					containerDiv.inject(context.container);
					//
					
					// middle container
					let middleDetailsContainer = new UsersGroupHomeSplitView().getSplitView(ugSyncEvts.ugMgmtMediator.getEventBroker());
					new UsersGroupHomeSplitView().setSplitviewEvents(middleDetailsContainer);
					middleDetailsContainer.getLeftViewWrapper().appendChild(containerDiv);
					
					var container = new WUXImmersiveFrame();
					container.setContentInBackgroundLayer(middleDetailsContainer.getContent());
					container.reactToPointerEventsFlag = false;
					container.inject(document.body); 

					 //move the data grid view down as per toolbar height
					let
					toolbarHeight = document.getElementsByClassName('toolbar-container')[0].getDimensions().height;
					UsersGroupSummaryView.openSelected();  
					
					resolve();
				});
			});

		
            }
        });

        return usersGroupWebApp;

        
	}
);

/* global define, widget */
/**
 * @overview UserGroup Management
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
define('DS/ENOUserGroupMgmt/Views/Dialogs/UsersGroupViewDetailDialog', [
		'DS/Windows/Dialog',
		'DS/Windows/ImmersiveFrame',
		'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
  		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
  		'DS/ENOUserGroupMgmt/Utilities/DataFormatter',
  		'DS/ENOUserGroupMgmt/Views/UsersGroupHeaderView',
  		'DS/ENOUserGroupMgmt/Views/UsersGroupDetailsTabsView',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
		'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
	function(WUXDialog, WUXImmersiveFrame, UserGroupServicesController, UsersGroupModel,
	 DataFormatter, UsersGroupHeaderView, UsersGroupDetailsTabsView, NLS) {
	'use strict';
	
	let dialog;

	let userGroupDetailDialog = function(userGroupData){
				
		let immersiveFrame = new WUXImmersiveFrame();
        immersiveFrame.inject(document.body);  
        let dialogueContent = new UWA.Element('div',{
			"id":"GroupDetailsViewer",
			"class":""
		});
   
   		let headerContainer = new UWA.Element('div',{"id":"userGroupDetailsHeaderContainer","class":"usergroupdetails-header-container"});
	  	let facetsContainer = new UWA.Element('div',{"id":"userGroupDetailsFacetsContainer","class":"usergroupdetails-facets-container",styles:{"height":"100%"}});
   
   		let userGroupModel = UsersGroupModel.getRowModelById(userGroupData.id);
   		
   		if(userGroupModel) {
			new UsersGroupHeaderView(headerContainer).init({model: userGroupModel.options.grid},false,true);
   			UsersGroupDetailsTabsView.init(facetsContainer, {model: userGroupModel.options.grid});
		}
		else {
			UserGroupServicesController.fetchUserGroupById(userGroupData.id).then(
				success => {
					let userGroupDetails = JSON.parse(success);
					userGroupDetails = userGroupDetails.groups[0];	
					userGroupDetails = DataFormatter.gridData(userGroupDetails);
					new UsersGroupHeaderView(headerContainer).init({model: userGroupDetails},false,true);
	   				UsersGroupDetailsTabsView.init(facetsContainer, {model: userGroupDetails});			
				},
       			failure => {
					if(widget.ugMgmtMediator){
						widget.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.errorGroupDetailFetch,
							sticky: true
						});
					}else{
						ugSyncEvts.ugNotify.handler().addNotif({
							level: 'error',
							subtitle: NLS.errorGroupDetailFetch,
							sticky: true
						});
					}
				});
		}		
   		
   		dialogueContent.appendChild(headerContainer);
   		dialogueContent.appendChild(facetsContainer);

    	dialog = new WUXDialog({
    		modalFlag : true,
		    width : 500,
		   	height : 500,
		   	title: NLS.groupDetails,
	       	content: dialogueContent,
	       	immersiveFrame: immersiveFrame    	       
		});
	     
	    //To apply CSS
	    dialog.content.parentElement.addClassName("group-details-dialog");
	    
		dialog.addEventListener("close", function(e) {
			require(['DS/ENOUserGroupMgmt/Config/UsersGroupMembersGridViewConfig'], function(UserGroupMembersGridViewConfig) {
				let actionCol = UserGroupMembersGridViewConfig.findIndex(col => col.dataIndex == "Action");		
				if(actionCol != -1)
					UserGroupMembersGridViewConfig[actionCol].visibleFlag = true;
			});
			UsersGroupDetailsTabsView.destroy();
			widget.readOnlyUG = false;
		});
    };


    let UsersGroupViewDetailDialog = {
		init: (data) => { return userGroupDetailDialog(data) },
		getDialog: () => {return dialog;}
	};
	
	return UsersGroupViewDetailDialog;

});

/* global define, widget */
/**
 * @overview User Group Management
 * @licence Copyright 2006-2020 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 * @access private
 */
// XSS_CHECKED
define('DS/ENOUserGroupMgmt/Views/Menu/MemberContextualMenu', [
        'DS/Menu/Menu',
        'DS/ENOUserGroupMgmt/Actions/MemberActions',
        'DS/ENOUserGroupMgmt/Views/Dialogs/RemoveMembers',
        'DS/ENOUserGroupMgmt/Views/Dialogs/UserGroupRevokeAccessDialog',
        'DS/ENOUserGroupMgmt/Views/Dialogs/UsersGroupViewDetailDialog',
        'DS/ENOUserGroupMgmt/Actions/UserGroupAccessRightsActions',
        'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
        'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
        'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
        'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
        'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
        'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt',
        'css!DS/ENOUserGroupMgmt/ENOUserGroupMgmt.css' ], 
    function(WUXMenu, MemberActions,RemoveMembers,UserGroupRevokeAccessDialog,UsersGroupViewDetailDialog,UserGroupAccessRightsActions,WrapperTileView,UsersGroupMemberModel,UserGroupAccessRightsModel,RequestUtils,UsersGroupModel, NLS){
        'use strict';
        let Menu;
        let usergroupMemberGridCheveron = function(grid,id){
            var actions=[];
            var curAccess= grid.Access;

            var that = WrapperTileView.tileView();
            actions= ["Remove"];
            var element = UWA.createElement('div', {
                "class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-chevron-down",
                events: {
                    click: function (event) {
                        // To handle multiple selection //
                        // This will avoid unselecting the selected rows when click on actions //
                        event.preventDefault();
                        event.stopPropagation();
                        // The coordinates to show the menu
                        var pos = event.target.getBoundingClientRect();
                        var config = {
                                position: {
                                    x: pos.left,
                                    y: pos.top + 20
                                }
                        };
                        //var selectedDetails = WrapperDataGridView.getSelectedRowsDetails();
                        var menu = [];

                        menu = menu.concat(memberContextualMenu(that,actions,id,curAccess));


                        WUXMenu.show(menu, config);
                    }
                }
            });
            return element; 
        };
        

        let memberContextualMenu = function(that,actions,id,curAccess){
            // Display menu
            let selectAccess;
            var menu = [];  // remove member to be added
            if(actions.indexOf("Remove") !== -1 && (RequestUtils.isAdmin || 
            		(UsersGroupModel.getUserGroupDetails().owner== RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor)) ||
            		"Owner" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser] || "Manager" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser])){
                selectAccess="unselected";
                if(curAccess== "role.remove"){
                    selectAccess="selected";
                } 
                menu.push({
                    name: NLS.removeMember,
                    title: NLS.removeMember,
                    type: 'PushItem',
                    state: selectAccess,
                    fonticon: {
	                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-remove'
	                },                    
                    data: null,
                    action: {
                        callback: function () {
                        	RemoveMembers.removeMembersConfirmation(UsersGroupMemberModel.getSelectedRowsModel());
                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
                        }
                    }
                });
            }

            return menu;
        };
        

        let accessRightsContextualMenu = function(grid,id){
            // Display menu
        	let selectAccess;
            var menu = [];  // remove member to be added
	        if(RequestUtils.isAdmin || 
	        		(UsersGroupModel.getUserGroupDetails().owner== RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor)) ||  
	        		("Owner" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser] && ((UserGroupAccessRightsModel.getSelectedRowsModel().data.length <= 1 && RequestUtils.contextUser != grid.name)||UserGroupAccessRightsModel.getSelectedRowsModel().data.length > 1))){
				
				menu.push({
	                name: NLS.RevokeAccess,
	                title: NLS.RevokeAccess,
	                type: 'PushItem',
	                fonticon: {
	                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-block'
	                },                    
	                data: null,
	                action: {
	                    callback: function () {
	                    	UserGroupRevokeAccessDialog.revokeAccessConfirmation(UserGroupAccessRightsModel.getSelectedRowsModel(),grid);
	                        //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
	                    }
	                }
	            });
				
	            if(grid.Role == "Manager" && UserGroupAccessRightsModel.getSelectedRowsModel().data.length <=1  ){
	            	var memberArray = [];
					memberArray.push({ "username": grid.name,
						"accessName": "Viewer",
						"personName":grid.personName,
						"type": grid.type});
	            	memberArray.push({ "username": grid.name,
						"accessName": "Owner",
						"personName":grid.personName,
						"type": grid.type});
					
	            	var useraccessData = {
							"data":memberArray
					};
					if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
		                menu.push({
		                    name: NLS.AccessRights_AddMembers_ViewerRole,
		                    title: NLS.AccessRights_AddMembers_ViewerRole,
		                    type: 'PushItem',
		                    state: selectAccess,
		                    fonticon: {
			                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-eye'
			                },                    
		                    data: null,
		                    action: {
		                        callback: function () {
		                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData.data[0]]},grid);
		                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
		                        }
		                    }
		                });
	               }
	                menu.push({
	                    name: NLS.AccessRights_AddMembers_OwnerRole,
	                    title: NLS.AccessRights_AddMembers_OwnerRole,
	                    type: 'PushItem',
	                    state: selectAccess,
	                    fonticon: {
		                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-favorite-on'
		                },                    
	                    data: null,
	                    action: {
	                        callback: function () {
	                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData.data[1]]},grid);
	                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
	                        }
	                    }
	                });
	            }
	            
	            if(grid.Role == "Owner" && UserGroupAccessRightsModel.getSelectedRowsModel().data.length <=1 ){
	            	var memberArray1 = [];
	            	memberArray1.push({ "username": grid.name,
						"accessName": "Viewer",
						"personName":grid.personName,
						"type": grid.type});
	            	memberArray1.push({ "username": grid.name,
						"accessName": "Manager",
	            		"personName":grid.personName,
						"type": grid.type});
					
	            	var useraccessData1 = {
							"data":memberArray1
					};
					if(UsersGroupModel.getOpenedUserGroupModel().model.state=="Private"){
		                menu.push({
		                    name: NLS.AccessRights_AddMembers_ViewerRole,
		                    title: NLS.AccessRights_AddMembers_ViewerRole,
		                    type: 'PushItem',
		                    state: selectAccess,
		                    fonticon: {
			                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-eye'
			                },                    
		                    data: null,
		                    action: {
		                        callback: function () {
		                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData1.data[0]]},grid);
		                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
		                        }
		                    }
		                });
	               }
	                menu.push({
	                    name: NLS.AccessRights_AddMembers_ManagerRole,
	                    title: NLS.AccessRights_AddMembers_ManagerRole,
	                    type: 'PushItem',
	                    state: selectAccess,
	                    fonticon: {
		                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-feather'
		                },                    
	                    data: null,
	                    action: {
	                        callback: function () {
	                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData1.data[1]]},grid);
	                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
	                        }
	                    }
	                });
	                
	            }
	            
	            if(grid.Role == "Viewer" && UserGroupAccessRightsModel.getSelectedRowsModel().data.length <=1 ){
	            	var memberArray2 = [];
	            	memberArray2.push({ "username": grid.name,
						"accessName": "Manager",
	            		"personName":grid.personName,
						"type": grid.type});
	            	memberArray2.push({ "username": grid.name,
						"accessName": "Owner",
						"personName":grid.personName,
						"type": grid.type});
	            	
	            	var useraccessData2 = {
							"data":memberArray2
					};
					menu.push({
	                    name: NLS.AccessRights_AddMembers_ManagerRole,
	                    title: NLS.AccessRights_AddMembers_ManagerRole,
	                    type: 'PushItem',
	                    state: selectAccess,
	                    fonticon: {
		                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-feather'
		                },                    
	                    data: null,
	                    action: {
	                        callback: function () {
	                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData2.data[0]]},grid);
	                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
	                        }
	                    }
	                });
					menu.push({
	                    name: NLS.AccessRights_AddMembers_OwnerRole,
	                    title: NLS.AccessRights_AddMembers_OwnerRole,
	                    type: 'PushItem',
	                    state: selectAccess,
	                    fonticon: {
		                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-favorite-on'
		                },                    
	                    data: null,
	                    action: {
	                        callback: function () {
	                        	UserGroupAccessRightsActions.switchuserAccess({data:[useraccessData2.data[1]]},grid);
	                            //MemberActions.RemoveMembersFromUserGroup(that,id,"Remove");
	                        }
	                    }
	                });
	                
	               
	            }
	            
	        }
	        
	        if(UserGroupAccessRightsModel.getSelectedRowsModel().data.length <=1 && grid.type == NLS.typeGroup) {
	            menu.push({
	                name: NLS.viewGroupDetails,
	                title: NLS.viewGroupDetails,
	                type: 'PushItem',
	                fonticon: {
	                    content: 'wux-ui-3ds wux-ui-3ds-1x wux-ui-3ds-info-open-in-a-new-window'
	                },                    
	                data: null,
	                action: {
	                    callback: function () {
	                    	UsersGroupViewDetailDialog.init(grid);
	                    }
	                }
	            });
			}
	        
            return menu;
        };

        
        
        
        
        let usergroupAccessRightsGridCheveron = function(grid,id){
            var element = UWA.createElement('div', {
                "class" : "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-chevron-down",
                events: {
                    click: function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var pos = event.target.getBoundingClientRect();
                        var config = {
                                position: {
                                    x: pos.left,
                                    y: pos.top + 20
                                }
                        };
                        var menu = [];
                        menu =  menu.concat(accessRightsContextualMenu(grid,id));
                        WUXMenu.show(menu, config);
                    }
                }
            });
            return element; 
        };

        
        let membersGridRightClick = function(event,grid){
            // To handle multiple selection //
            // This will avoid unselecting the selected rows when click on actions //
        	var that = WrapperTileView.tileView();
            var actions= ["Remove"];
            var curAccess= grid.Access;
            var idArray = [];
            idArray.push(grid.name);
            event.preventDefault();
            event.stopPropagation();
            var pos = event.target.getBoundingClientRect();
            var config = {
                    position: {
                        x: pos.left,
                        y: pos.top + 20
                    }
            };
           
            var menu = [];

            menu = menu.concat(memberContextualMenu(that,actions,idArray,curAccess));
            WUXMenu.show(menu, config);
        };
        
        Menu={
               
                memberContextualMenu: (that,actions,id,curAccess) => {return memberContextualMenu(that,actions,id,curAccess);},
                accessRightsContextualMenu: (grid,id) => {return accessRightsContextualMenu(grid,id);},
                membersGridRightClick: (event,grid) => {return membersGridRightClick(event,grid);},
                usergroupAccessRightsGridCheveron: (grid,id) => {return usergroupAccessRightsGridCheveron(grid,id);},
                usergroupMemberGridCheveron: (grid,id) => {return usergroupMemberGridCheveron(grid,id);}
                
        };
        
        return Menu;
    });



define('DS/ENOUserGroupMgmt/Views/Grid/UserGroupMembersGridCustomColumns',
	[
		'DS/Controls/Button',
		'DS/Controls/TooltipModel',
		'UWA/Drivers/Alone',
		'DS/ENOUserGroupMgmt/Views/Menu/MemberContextualMenu',
		'DS/ENOUserGroupMgmt/Views/Dialogs/RemoveMembers',
		'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
		'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
		'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
		'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
		'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
		'DS/TransientWidget/TransientWidget',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
	],
	function(WUXButton, WUXTooltipModel, Alone, MemberContextualMenu, RemoveMembers, WrapperDataGridView, UsersGroupMemberModel, RequestUtils, UsersGroupModel, UserGroupBootstrap, TransientWidget, NLS) {

		'use strict';
		let onMemberActionCellRequest = function(cellInfos) {
			var cell = cellInfos.cellView.getContent();
			var commandsDiv = "";

			if (!cellInfos.isHeader) {
				let reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_actions_');
				if (reusableContent) {
					var idArray = [];
					idArray.push(cellInfos.nodeModel.options.grid.name);
					commandsDiv = UWA.createElement('div', {
						"id": "deleteGroup",
						"class": "wux-ui-3ds wux-ui-3ds-2x wux-ui-3ds-remove fonticon-display fonticon-disabled",
						"title": NLS.removeMember,
						styles: { "font-size": "20px" },
						events: {
							click: function(event) {
								RemoveMembers.removeMembersConfirmation({ data: [WrapperDataGridView.getRowModelById(UsersGroupMemberModel.getModel(), cellInfos.nodeModel.options.grid.id)] });
							}
						}
					})
					if ((RequestUtils.isAdmin ||
						(UsersGroupModel.getUserGroupDetails().owner == RequestUtils.contextUser && (RequestUtils.isLeader || RequestUtils.isAuthor)) ||
						"Owner" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser] || "Manager" == UsersGroupModel.getUserGroupDetails()[RequestUtils.contextUser])) {
						commandsDiv.removeClassName("fonticon-disabled");
					}
					cellInfos.cellView._setReusableContent(commandsDiv);
				}
			}
		};

		let onAccessRightsActionCellRequest = function(cellInfos) {

			let reusableContent;
			if (!cellInfos.isHeader) {
				reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_actions_');
				if (reusableContent) {
					var idArray = [];
					idArray.push(cellInfos.nodeModel.options.grid.name);
					reusableContent.setHTML(MemberContextualMenu.usergroupAccessRightsGridCheveron(cellInfos.nodeModel.options.grid, idArray))
					reusableContent.tooltipInfos = new WUXTooltipModel({ shortHelp: NLS.actions, allowUnsafeHTMLShortHelp: true });
					reusableContent.setStyle();
					cellInfos.cellView._setReusableContent(reusableContent);
				}
			}


		};



		let getAvatarDetails = function(name) {
			var options = {};
			var avatarStr = "NA";
			var avatarColor = "rgb( 245,100,163 )";
			var backgroundColors = [
				[7, 139, 250],
				[249, 87, 83],
				[111, 188, 75],
				[158, 132, 106],
				[170, 75, 178],
				[26, 153, 123],
				[245, 100, 163],
				[255, 138, 46],
			]
			var temp = name.replace(/  +/g, ' ');
			var initials = temp.trim().split(" ");
			var firstLetter = initials[0].toUpperCase();
			var lastLetter = initials[initials.length - 1].toUpperCase();

			if (!(firstLetter[0] == undefined || lastLetter[0] == undefined)) {
				avatarStr = (firstLetter[0] + lastLetter[0]);
				var i = Math.ceil((firstLetter.charCodeAt(0) + lastLetter.charCodeAt(0)) % backgroundColors.length);
				avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";
			}
			options.name = name;
			options.avatarStr = avatarStr;
			options.avatarColor = avatarColor;

			return options;

		};


		let onMemberUserNameCellRequest = function(cellInfos) {
			let reusableContent;
			if (!cellInfos.isHeader) {
				reusableContent = cellInfos.cellView.collectionView.reuseCellContent('_memeberfullname_');
				if (reusableContent) {
					reusableContent.removeEvents();
					//cellInfos.cellView.getContent().setContent(reusableContent);
					var cellValue = (cellInfos.nodeModel.options.grid.memberFullName) ? cellInfos.nodeModel.options.grid.memberFullName : cellInfos.nodeModel.options.grid.personName
					var userName = cellInfos.nodeModel.options.grid.name;
					var ownerID = cellInfos.nodeModel.options.grid.id
					var ownerIconURL = "/api/user/getpicture/login/" + userName + "/format/normal";
					var iconDetails = getAvatarDetails(cellValue);

					if (UserGroupBootstrap.getSwymUrl() != undefined && UserGroupBootstrap.getSwymUrl() != '') {
						reusableContent.getChildren()[0].getChildren()[0].src = UserGroupBootstrap.getSwymUrl() + ownerIconURL;
						if (widget.ugMgmtMediator && widget.ugMgmtMediator != 'undefined') {
							reusableContent.setStyle("cursor", "pointer");
							reusableContent.addEvent('click', function(event) {
								var transientOptions = {
									mode: 'panel',
									height: 700,
									width: 800	
								};

								TransientWidget.showWidget("X3DPRFL_AP", '', {
									login: userName,
									url: UserGroupBootstrap.getSwymUrl() + "?profile=" + userName
								}, transientOptions);
							});
						}

					} else {

						reusableContent.getChildren()[0].getChildren()[0].setHTML(iconDetails.avatarStr);
						reusableContent.getChildren()[0].getChildren()[0].setStyle("background", iconDetails.avatarColor);
						if (widget.ugMgmtMediator && widget.ugMgmtMediator != 'undefined') {
							reusableContent.setStyle("cursor", "pointer");
							reusableContent.addEvent('click', function(event) {
								var propertiesContext = {
									_context: "ctx::" + RequestUtils.SecurityContext,
									_selection: [{ getID: function() { return ownerID; } }],
									getSecurityContext: function() {
										return this._context;
									},
									getSelectedNodes: function() {
										return this._selection;
									},
									displayNotification: function() {
									}
								};
								var editPropDialog = 'DS/LifecycleControls/EditPropDialog';
								require([editPropDialog], function(EditPropDialog) {

									var propDlg = new EditPropDialog();
									propDlg.launchProperties(propertiesContext);
								});
							});
						}

					}
					reusableContent.getChildren()[1].setText(cellValue);
					cellInfos.cellView._setReusableContent(reusableContent);
				}
			}
		};


		let UserGroupMembersGridCustomColumns = {
			onMemberActionCellRequest: (cellInfos) => { return onMemberActionCellRequest(cellInfos); },
			onMemberUserNameCellRequest: (cellInfos) => { return onMemberUserNameCellRequest(cellInfos); },
			getAvatarDetails: (Labelname) => { return getAvatarDetails(Labelname); },
			onAccessRightsActionCellRequest: (cellInfos) => { return onAccessRightsActionCellRequest(cellInfos); }
		};
		return UserGroupMembersGridCustomColumns;
	});

define('DS/ENOUserGroupMgmt/Config/UsersGroupMembersGridViewConfig',
	[
		'DS/ENOUserGroupMgmt/Views/Grid/UserGroupMembersGridCustomColumns',
		'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'],
	function(UserGroupMembersGridCustomColumns, NLS) {

		'use strict';

		let UserGroupMembersGridViewConfig = [{
			text: NLS.MemeberFullName,
			dataIndex: 'tree',
			editableFlag: false,
			'onCellRequest': UserGroupMembersGridCustomColumns.onMemberUserNameCellRequest
		},
		{
			text: NLS.UserName,
			dataIndex: 'name',
			editableFlag: false,
		},
		{
			text: NLS.EmailAddress,
			dataIndex: 'emailAddress',
			editableFlag: false,
		},
		{
			text: NLS.actions,
			dataIndex: 'Action',
			editableFlag: false,
			'onCellRequest': UserGroupMembersGridCustomColumns.onMemberActionCellRequest
		},
		{
			text: NLS.FirstName,
			dataIndex: 'firstName',
			editableFlag: false,
			visibleFlag: false
		},
		{
			text: NLS.LastName,
			dataIndex: 'lastName',
			editableFlag: false,
			visibleFlag: false
		},
		{
			text: NLS.City,
			dataIndex: 'city',
			editableFlag: false,
			visibleFlag: false
		},
		{
			text: NLS.Address,
			dataIndex: 'address',
			editableFlag: false,
			visibleFlag: false
		},
		{
			text: NLS.Country,
			dataIndex: 'country',
			editableFlag: false,
			visibleFlag: false
		}
		];
		return UserGroupMembersGridViewConfig;

	});

/**
 * datagrid view for user group members tab page
 */
define('DS/ENOUserGroupMgmt/Views/Grid/UsersGroupMembersDataGridView',
        [   
            'DS/ENOUserGroupMgmt/Config/UsersGroupMembersGridViewConfig',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupMembersTabToolbarConfig'
            ], function(
            		UserGroupMembersGridViewConfig,
                    WrapperDataGridView,
                    UserGroupMembersTabToolbarConfig ) {

    'use strict';   
    let _membersToolbar;
    let build = function(model){
        var gridViewDiv = UWA.createElement("div", {id:'dataGridViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "Members-gridView-View hideView"
        });
        let toolbar = UserGroupMembersTabToolbarConfig.writetoolbarDefination(model);
        let dataGridViewContainer = WrapperDataGridView.build(model, UserGroupMembersGridViewConfig, toolbar, gridViewDiv);
        _membersToolbar = WrapperDataGridView.dataGridViewToolbar();
        return dataGridViewContainer;
    };  
    let getGridViewToolbar = function(){
        return _membersToolbar;   
    };
	let getAddMemberForm = function(){
        //return WrapperDataGridView.dataGridViewToolbar();   
		var addMemberViewDiv = UWA.createElement("div", {id:'memberFormContainer',
            styles: {
                'width': "100%",
                'height': "100px",
                'position': "relative",
				"color" : "#3d3d3d"
            }
           // 'class': "Members-gridView-View hideView"
        });

        return addMemberViewDiv;
    };


    let UGContentsDataGridView={
            build : (model) => { return build(model);}, 
            getGridViewToolbar: () => {return getGridViewToolbar();}, 
            getAddMemberForm: () => {return getAddMemberForm();}
    };

    return UGContentsDataGridView;
});

/**
 * datagrid view for user group members tab page
 */
define('DS/ENOUserGroupMgmt/Views/Grid/UsersGroupDetailMembersDataGridView',
        [   
            'DS/ENOUserGroupMgmt/Config/UsersGroupMembersGridViewConfig',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Config/Toolbar/UsersGroupMembersTabToolbarConfig'
            ], function(
            		UserGroupMembersGridViewConfig,
                    WrapperDataGridView,
                    UserGroupMembersTabToolbarConfig ) {

    'use strict';   
    let _membersToolbar;
    let build = function(model){
        var gridViewDiv = UWA.createElement("div", {id:'dataGridViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "GroupDetail-gridView-View hideView"
        });
        let toolbar = UserGroupMembersTabToolbarConfig.writetoolbarDefination(model);
        
        let actionCol = UserGroupMembersGridViewConfig.findIndex(col => col.dataIndex == "Action");		
		if(actionCol != -1)
			UserGroupMembersGridViewConfig[actionCol].visibleFlag = false;
        
        let dataGridViewContainer = WrapperDataGridView.build(model, UserGroupMembersGridViewConfig, toolbar, gridViewDiv);
        _membersToolbar = WrapperDataGridView.dataGridViewToolbar();
        return dataGridViewContainer;
    };  
    let getGridViewToolbar = function(){
        return _membersToolbar;   
    };

    let UsersGroupDetailMembersDataGridView={
            build : (model) => { return build(model);}, 
            getGridViewToolbar: () => {return getGridViewToolbar();}
    };

    return UsersGroupDetailMembersDataGridView;
});


define('DS/ENOUserGroupMgmt/Views/Tile/UsersGroupAccessRightsDataTileView',
        	[                         
        		'DS/ENOUserGroupMgmt/Views/Menu/MemberContextualMenu',
            'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView'
            ], function(            		
            		ContextualMenu,UserGroupAccessRightsModel,WrapperTileView
            		
            ) {

    'use strict';   
    let _model, _accesRightsTileView;
    let build = function(model){
        if(model){
            _model = model;
        }else{ //create an empty model otherwise TODO see if it's required
            _model = new TreeDocument({
                useAsyncPreExpand: true
            });
        }
        var tileViewDiv = UWA.createElement("div", {id:'accessRightstileViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "accessrights-tileView-View showView nonVisible"
        });
        let dataTileViewContainer = WrapperTileView.build(model, tileViewDiv);
        _accesRightsTileView = WrapperTileView.tileView();
        return dataTileViewContainer;
    };  
    
    let getAccesRightsTileView = function() {
		return _accesRightsTileView;
	};

    let contexualMenuCallback = function(){    
        let _tileView = WrapperTileView.tileView();
        var that =UserGroupAccessRightsModel.usergroupInfo();
        _tileView.onContextualEvent = {
                'callback': function (params) {
                    var menu = [];
                    var actions=[];
                
                    if (params && params.cellInfos) {
                        if (params.cellInfos.cellModel) {
                            var selectedNode = _model.getSelectedNodes();
                            var curAccess= selectedNode[0].options.grid.Access;
                            var actions= ["RevokeAccess"];
                            var idArray = [];
                            idArray.push(selectedNode[0]._options.grid.name);
                            menu=ContextualMenu.accessRightsContextualMenu(selectedNode[0].options.grid,idArray);
                        }
                    }
                    return menu; 
                }

        }
    };


    let UsersGroupAccessRightsDataTileView={
            build : (model) => { return build(model);},
            contexualMenuCallback : () =>{return contexualMenuCallback();},
            getAccesRightsTileView : () => { return getAccesRightsTileView(); },
    };

    return UsersGroupAccessRightsDataTileView;
});

/**
 * Responsible for usergroup widget home page layout
 */

define('DS/ENOUserGroupMgmt/Components/Wrappers/UserGroupApplicationFrame',
    [
        'DS/Core/Core',
        'DS/ENOUserGroupMgmt/Components/Wrappers/TriptychWrapper',
        'DS/ENOUserGroupMgmt/Utilities/IdCardUtil',
        'DS/ENOUserGroupMgmt/Views/RightPanelInfoView',
        'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
        'DS/ENOUserGroupMgmt/Views/Panels/WelcomePanel',
        'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
    ],

    function (Core, TriptychWrapper, IdCardUtil, RightPanelInfoView, UsersGroupSummaryView, WelcomePanel, NLS) {
        'use strict';
        var UserGroupApplicationFrame = function () {
        };

        UserGroupApplicationFrame.prototype.init = function (modelEvent, mainContainer, welcomePanelContent, middleContent, rightContent) {
            this._applicationChannel = modelEvent;
            this._leftContent = welcomePanelContent;
            this._middleContent = middleContent;
            this._rightContent = rightContent;
            this._mainContainer = mainContainer;
            this._initDom();
        };

        UserGroupApplicationFrame.prototype._initDom = function () {
            this._content = document.createElement('div');
            this._content.classList.add('usergroup-panel');
            this._mainContainer.classList.add('usergroup-content');
            this._content.appendChild(this._mainContainer);

            this._triptychWrapper = new TriptychWrapper();

            /*//Required if adding toolbar
            let pageToolbarOptions = {
                    withInformationButton : false,
                    withWelcomePanelButton : true,
                    isWelcomePanelCollapsed : false, //TODO need to fetch from cache
                    container : this._middleContent,
                    triptychManager :  this._triptychWrapper.triptychManager,
                    modelEvents : this._applicationChannel
                    //appCore : this.appCore
                };
            this.pageToolbar = new RouteHomePageTopBar();
            this.pageToolbar.initialize(pageToolbarOptions);*/

            //let wOptions = {};
            //wOptions.modelEvents = this._applicationChannel;
            //wOptions.leftContainer = this._leftContent;

            //Uncomment below while not using welcome panel
            //this._userGroupWCPanel = new WelcomePanel(wOptions);
            //let userGroupWCPanelOptions = this._userGroupWCPanel.getWPanelOptions();
            //this._userGroupWCPanel.registerEvents();

            //Comment below while using welcome panel
            this._userGroupWCPanel = "";
            let userGroupWCPanelOptions = undefined;
            

            this._triptychWrapper.init(this._applicationChannel, this._mainContainer, this._leftContent, this._middleContent, this._rightContent, this._userGroupWCPanel, userGroupWCPanelOptions);
            //main TODO check if below code is required
            this._middleContainer = document.createElement('div');
            this._middleContainer.classList.add('usergroup-content-wrapper');

            this._applicationContent = document.createElement('div');
            this._applicationContent.classList.add('usergroup-content-wrapper');
            this._middleContainer.appendChild(this._applicationContent);

            if (this._middleContent && this._middleContent._container) {
                this._applicationContent.appendChild(this._middleContent._container);
            }
            //todo
            this._subscribeEvents();
            this._subscribeRightPanelEvents();
            this.__mobileBreakpoint = this._triptychWrapper._triptych.__mobileBreakpoint;
        };

         UserGroupApplicationFrame.prototype._subscribeRightPanelEvents = function () {
             this._listRightPanelSubscription = [];
             var that = this;
             let rightPanelInfoView = new RightPanelInfoView(that._rightContent);
             //rightPanelInfoView.destroyEditPropWidget();
             let triptychManager = that._triptychWrapper._getTriptych();

             that._listRightPanelSubscription.push(that._applicationChannel.subscribe({ event: 'usergroup-header-info-click' }, function (data) {
                 if (that._content.clientWidth < that.__mobileBreakpoint) {
                     // Publish the event to make sure if the task panel is open we clear the task panel open flag //
                     // This will avoid the scenario where we open the task panel first, then usergroup prop widget, close prop widget and open the task panel again//
                     if (!(data.multiRowSelect || data.noRowSelect)) {
						if(widget.ugMgmtMediator){
	                        widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                        widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
                        }else{
							ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
                        	ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
						}
                        UsersGroupSummaryView.activateInfoIcon();
                        IdCardUtil.infoIconActive();
                     }
                     
                     rightPanelInfoView.init(data,"usergroupInfo");
                     /*if(data && data.model){
                         rightPanelInfoView.init(data,"usergroupInfo");
                     }else{
                         //show empty panel
                         rightPanelInfoView.init(data,"emptyInfo");
                     }*/
                     if (!(data.multiRowSelect || data.noRowSelect)) {
                        that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
                        widget.setValue("propWidgetOpen",true);
                     }
                 }
             }));


			 if(widget.ugMgmtMediator){
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-info-close-click', function (data) {
	                if (triptychManager._isRightOpen) {
	                     UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                     IdCardUtil.infoIconInActive();	
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     widget.setValue("propWidgetOpen",false);
	                 }
	             }));
	
	             // To handle Task panel open and close in view mode and edit mode //
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-task-open-click-view-mode', function (data) {
	                 // when we open the task right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 rightPanelInfoView.init(data,"taskActionMode");
	                 widget.setValue("propWidgetOpen",false);
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-task-open-click-edit-mode', function (data) {
	                 // when we open the task right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 rightPanelInfoView.init(data,"taskEditMode");
	                 widget.setValue("propWidgetOpen",false);
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-task-close-click-view-mode', function (data) {
	                 if (triptychManager._isRightOpen && !widget.getValue("propWidgetOpen")) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {
	                 that._isDetailsPageOpened = true;
	                 if (triptychManager._isLeftOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'left' });
	                 }
	                 //widget.ugMgmtMediator.publish('usergroup-header-info-click', data);
	                 //widget.ugMgmtMediator.publish('usergroup-triptych-hide-toggle-button');
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-task-close-click-edit-mode', function (data) {
	                 if (triptychManager._isRightOpen && !widget.getValue("propWidgetOpen")) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             //To handle content panel open and close in edit prop widget //
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-content-preview-click', function (data) {
	                 // when we open the content right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 // Publish the event to make sure if the task panel is open we clear the task panel open flag //
	                 // This will avoid the scenario where we open the task panel first, then usergroup prop widget, close prop widget and open the task panel again//
	                 widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                 widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
	                 rightPanelInfoView.init(data,"contentPreview");
	                 widget.setValue("propWidgetOpen",false);
	                 widget.contentPreviewId = data.model.id;
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-content-preview-delete', function (data) {
	                 if (triptychManager._isRightOpen) {
	                     if(data.model.ids.includes(widget.contentPreviewId)){
	                         that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     }
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-content-preview-close', function (data) {
	                 if (triptychManager._isRightOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(widget.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
	                 that._isDetailsPageOpened = false;
	                 /*if (triptychManager._isRightOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     widget.propWidgetOpen = false;
	                 }*/
	             }));
             }else{
				 that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-info-close-click', function (data) {
	                if (triptychManager._isRightOpen) {
	                     UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                     IdCardUtil.infoIconInActive();	
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     widget.setValue("propWidgetOpen",false);
	                 }
	             }));
	
	             // To handle Task panel open and close in view mode and edit mode //
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-task-open-click-view-mode', function (data) {
	                 // when we open the task right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 rightPanelInfoView.init(data,"taskActionMode");
	                 widget.setValue("propWidgetOpen",false);
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-task-open-click-edit-mode', function (data) {
	                 // when we open the task right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 rightPanelInfoView.init(data,"taskEditMode");
	                 widget.setValue("propWidgetOpen",false);
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-task-close-click-view-mode', function (data) {
	                 if (triptychManager._isRightOpen && !widget.getValue("propWidgetOpen")) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-DataGrid-on-dblclick', function (data) {
	                 that._isDetailsPageOpened = true;
	                 if (triptychManager._isLeftOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'left' });
	                 }
	                 //ugSyncEvts.ugMgmtMediator.publish('usergroup-header-info-click', data);
	                 //ugSyncEvts.ugMgmtMediator.publish('usergroup-triptych-hide-toggle-button');
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-task-close-click-edit-mode', function (data) {
	                 if (triptychManager._isRightOpen && !widget.getValue("propWidgetOpen")) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             //To handle content panel open and close in edit prop widget //
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-content-preview-click', function (data) {
	                 // when we open the content right panel, the info icon should not be highlighted //
	                 IdCardUtil.infoIconInActive();
	                 UsersGroupSummaryViewSummaryView.inActivateInfoIcon();
	                 // Publish the event to make sure if the task panel is open we clear the task panel open flag //
	                 // This will avoid the scenario where we open the task panel first, then usergroup prop widget, close prop widget and open the task panel again//
	                 ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                 ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
	                 rightPanelInfoView.init(data,"contentPreview");
	                 widget.setValue("propWidgetOpen",false);
	                 widget.contentPreviewId = data.model.id;
	                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
	
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-content-preview-delete', function (data) {
	                 if (triptychManager._isRightOpen) {
	                     if(data.model.ids.includes(widget.contentPreviewId)){
	                         that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     }
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-content-preview-close', function (data) {
	                 if (triptychManager._isRightOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                 }
	             }));
	
	             that._listRightPanelSubscription.push(ugSyncEvts.ugMgmtMediator.subscribe('usergroup-back-to-summary', function (data) {
	                 that._isDetailsPageOpened = false;
	                 /*if (triptychManager._isRightOpen) {
	                     that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
	                     widget.propWidgetOpen = false;
	                 }*/
	             }));				 
			 }
         };


        UserGroupApplicationFrame.prototype._subscribeEvents = function () {
            this._listSubscription = [];
            var that = this;
            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-show-panel' }, function (data) {
                if (that._content.clientWidth < that.__mobileBreakpoint) {
                    //  that._topbar.classList.add('hide');
                    that._mainContainer.classList.add('full-height');
                }
            }));
            //triptych-panel-hidden
            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-panel-hide-started' }, function (data) {
                if (that._content.clientWidth < that.__mobileBreakpoint) {
                    that._mainContainer.classList.remove('full-height');
                }
                // When conflict panel is hidden or closed (right panel)
                that._applicationChannel.publish({ event: 'model-conflict-panel-closed' })
            }));

            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-entering-mobile' }, function () {
                that._mainContainer.classList.remove('full-height');
            }));

            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-resized' }, function (sidesize) {
                if (sidesize.side === 'right') {
                    var width = sidesize.width;
                }
                //Hack to hide left panel (wc panel) if the details page is opened
                if (sidesize.side === 'left') {
                    if (that._isDetailsPageOpened) {
                        that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'left' });
                    }
                }
            }));


            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-leaving-mobile' }, function () {
                // that._topbar.classList.remove('hide');
                that._mainContainer.classList.remove('full-height');
            }));

             that._listSubscription.push(that._applicationChannel.subscribe({ event: 'usergroup-triptych-hide-toggle-button' }, function () {
                  let toggleButton = that._mainContainer.querySelector(".triptych-wp-toggle-btn");
                  toggleButton.classList.add('usergroup-toggle-hide');
              }));

             that._listSubscription.push(that._applicationChannel.subscribe({ event: 'usergroup-triptych-show-toggle-button' }, function () {
                 let toggleButton = that._mainContainer.querySelector(".triptych-wp-toggle-btn");
                 toggleButton.classList.remove('usergroup-toggle-hide');
                 that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'left' });
             }));

            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'welcome-panel-collapsed' }, function () {
                let toggleButton = that._mainContainer.querySelector(".triptych-wp-toggle-btn");
                if (toggleButton) toggleButton.title = NLS.homeRightPanelExpand;
            }));

            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'welcome-panel-expanded' }, function () {
                let toggleButton = that._mainContainer.querySelector(".triptych-wp-toggle-btn");
                if (toggleButton) toggleButton.title = NLS.homeRightPanelCollapse;
            }));

            that._listSubscription.push(that._applicationChannel.subscribe({ event: 'triptych-clicked-overlay' }, function (data) {
                if (data == "left") {
                    let toggleButton = that._mainContainer.querySelector(".triptych-wp-toggle-btn");
                    if (toggleButton) toggleButton.title = NLS.homeRightPanelExpand;
                }
                if (data == "right") {
                    // Publish the event to make sure if the task panel is open we clear the task panel open flag //
                    // This will avoid the scenario where we open the task panel, then click on the overlay which will close the task panel, and then if we click on task again it will show the error message//
                    if(widget.ugMgmtMediator){
	                    widget.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                    widget.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
                    }else{
						ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-view-mode");
	                    ugSyncEvts.ugMgmtMediator.publish("usergroup-task-close-click-edit-mode");
					}
                }
            }));
        };

        UserGroupApplicationFrame.prototype.inject = function (parentElement) {
            parentElement.appendChild(this._content);
        };

        UserGroupApplicationFrame.prototype.destroy = function () {
            this._content = null;
        };

        UserGroupApplicationFrame.prototype.setTooltipForExpandCollapse = function () {
            let toggleButton = this._mainContainer.querySelector(".triptych-wp-toggle-btn");
            if (toggleButton) toggleButton.title = NLS.homeRightPanelCollapse;
        };

        /*    UserGroupApplicationFrame.prototype.showWelcomePanel = function () {
                let triptychManager = this._triptychWrapper._getTriptych();
                if (!triptychManager._isLeftOpen) {
                    this._applicationChannel.publish({
                        event: "triptych-show-panel",
                        data: "left"
                    });
                }
                this._applicationChannel.publish({
                    event: "triptych-set-size",
                    data: {
                        size: 300,
                        side: "left"
                    }
                });
            };*/


        return UserGroupApplicationFrame;
    });

/**
 * datagrid view for usergroup summary page
 */
define('DS/ENOUserGroupMgmt/Views/Tile/UsersGroupMembersTileView',
        [   
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
            'DS/ENOUserGroupMgmt/Views/Menu/MemberContextualMenu'
            ], function(
            		WrapperTileView,
                    MemberContextualMenu
            ) {

    'use strict';   
    let _model, _memberTileView;
    let build = function(model){
        if(model){
            _model = model;
        }else{ //create an empty model otherwise TODO see if it's required
            _model = new TreeDocument({
                useAsyncPreExpand: true
            });
        }
        var tileViewDiv = UWA.createElement("div", {id:'tileViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "Members-tileView-View showView nonVisible"
        });
        let dataTileViewContainer = WrapperTileView.build(model, tileViewDiv);
        _memberTileView = WrapperTileView.tileView();
        return dataTileViewContainer;
    };  
    
    let getMemberTileView = function() {
		return _memberTileView;
	};

    let contexualMenuCallback = function(){    
        let _tileView = WrapperTileView.tileView();
        _tileView.onContextualEvent = {
                'callback': function (params) {
                    var menu = [];
                    var actions=[];
                
                    if (params && params.cellInfos) {
                        if (params.cellInfos.cellModel) {
                            var selectedNode = _model.getSelectedNodes();
                            var curAccess= selectedNode[0].options.grid.Access;
                            var actions= ["Remove"];
                            var idArray = [];
                            idArray.push(selectedNode[0]._options.grid.name);
                            menu=MemberContextualMenu.memberContextualMenu(_tileView,actions,idArray,curAccess);
                        }
                    }
                    return menu; 
                }

        }
    };


    let UGMembersTileView={
            build : (model) => { return build(model);},
            getMemberTileView : () => { return getMemberTileView(); },
            contexualMenuCallback : () =>{return contexualMenuCallback();}
    };

    return UGMembersTileView;
});

/**
 * datagrid view for usergroup summary page
 */
define('DS/ENOUserGroupMgmt/Views/UsersGroupMembersView',
        [   'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupMembersDataGridView',
            'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupDetailMembersDataGridView',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Views/Tile/UsersGroupMembersTileView',
            'DS/ENOUserGroupMgmt/Views/Tile/UsersGroupDetailMembersTileView',
            'DS/ENOUserGroupMgmt/Model/UsersGroupMemberModel',
            'DS/ENOUserGroupMgmt/Model/UsersGroupDetailMemberModel',
            'DS/ENOUserGroupMgmt/Utilities/PlaceHolder',
            'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
            'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands',
            'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
            ], function(
                    UGMembersDataGridView,
                    UGDetailMembersDataGridView,
                    WrapperDataGridView,
                    UGMembersTileView,
                    UGDetailMembersTileView,
                    UserGroupMemberModel,
                    UserGroupDetailMemberModel,
                    PlaceHolder,
                    UGServicesController,
                    WrapperTileView,
                    UserGroupCommands,
                    NLS
            ) {

    'use strict';
    let _serverresponse = {},  _usergroupInfo;
    let build = function(userGroupInfo){
    	_usergroupInfo = userGroupInfo;
		
        if(!showView()){//member view has never been rendered
        	let elementID = widget.readOnlyUG ? 'usergroupDetailsMembersContainer' : 'usergroupMembersContainer';
        	let containerClass = widget.readOnlyUG ? '.usergroupdetails-facets-container' : '.usergroup-facets-container';
        
        	let containerDiv = UWA.createElement('div', {id: elementID,'class':'usergroup-members-container'}); 
        	containerDiv.inject(document.querySelector(containerClass));

             UGServicesController.fetchUserGroupMembers(_usergroupInfo.model.pid).then(function(response) {
                 widget.readOnlyUG ? UserGroupDetailMemberModel.destroy() : UserGroupMemberModel.destroy();
                 UserGroupMembersViewModel(response, userGroupInfo);
                drawUserGroupMembersView(containerDiv); 
                
            }); 
        }

    };

    let drawUserGroupMembersView = function(containerDiv){
        let groupMemberModel, memberDataGridView, memberTileView;
        if(widget.readOnlyUG) {
			groupMemberModel = UserGroupDetailMemberModel;
			memberDataGridView = UGDetailMembersDataGridView;
			memberTileView = UGDetailMembersTileView;
		}
		else {
			groupMemberModel = UserGroupMemberModel;
			memberDataGridView = UGMembersDataGridView;
			memberTileView = UGMembersTileView;
		}
		
		//To add the dataGrid view list
        let datagridDiv = memberDataGridView.build(groupMemberModel.getModel());
        
        //To add the Tile view summary list
        let tileViewDiv= memberTileView.build(groupMemberModel.getModel());
        memberTileView.contexualMenuCallback();
        
        if(!widget.readOnlyUG)
        registerListners();

        //get the toolbar:no toolbar for now
        let membersTabToolbar= memberDataGridView.getGridViewToolbar();
		
        //Add all the divs into the main container        
        let toolBarContainer = UWA.createElement('div', {id:'dataGridMembersDivToolbar', 'class':'toolbar-container', styles: {'width': "100%"}}).inject(containerDiv);

        membersTabToolbar.inject(toolBarContainer);
		
		var addMemberDiv = UWA.createElement("div", {
		  styles: {
			'width': "100%",
			'position': "relative"
		  },
		  'class': "add-member-team-div addmemberTabView hideView"
		});
		containerDiv.addContent(addMemberDiv);
		
        datagridDiv.inject(containerDiv);
        tileViewDiv.inject(containerDiv);
        
        if (groupMemberModel.getModel().getChildren().length ==0 ) {
            PlaceHolder.showEmptyMemberPlaceholder(containerDiv);
        }
        PlaceHolder.registerListeners();
        if(!widget.readOnlyUG)
        registerEventListeners();
        return containerDiv;
    };
    
    let registerEventListeners = function(){
    	if(widget.ugMgmtMediator){
    	widget.ugMgmtMediator.subscribe('usergroup-summary-Membersappend-rows', function (data) {
			let memberToolbar = UGMembersDataGridView.getGridViewToolbar();
			UserGroupCommands.updateSelectAllCount(UserGroupMemberModel.getModel(), memberToolbar);
		});
		
    	/*widget.ugMgmtMediator.subscribe('usergroup-members-remove-row-by-ids', function (data) {
    		if(data.model.length > 0){				
    			UserGroupMemberModel.deleteSelectedRows();					
			}
		});*/
    	
    	/* widget.UserGroupMgmtMediator.subscribe('usergroup-task-on-change-assignee', function () {
    		getUpdatedMembersModel();    		
		});
    	//usergroup-task-on-save
    	widget.UserGroupMgmtMediator.subscribe('usergroup-task-on-save', function () {
    		getUpdatedMembersModel();    		
		});
    	//ON_SPLIT_USERGROUPNODE
    	widget.UserGroupMgmtMediator.subscribe('ON_SPLIT_USERGROUPNODE', function () {
    		getUpdatedMembersModel();    		
		}); */
		}else{
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-summary-Membersappend-rows', function (data) {
				let memberToolbar = UGMembersDataGridView.getGridViewToolbar();
				UserGroupCommands.updateSelectAllCount(UserGroupMemberModel.getModel(), memberToolbar);
			});
		}
    };
    
    let getUpdatedMembersModel = function(){
    	/* if(_usergroupInfo.model && _usergroupInfo.model.id){
    		UserGroupServicesController.fetchUserGroupMembers(_usergroupInfo.model.id).then(function(response) {
                UserGroupMemberModel.getModel().removeRoots();
                UserGroupMemberModel.createModel(response, _usergroupInfo);               
            });
    	} */
    };
    
    let UserGroupMembersViewModel = function(serverResponse, userGroupInfo){   
		
		let model = widget.readOnlyUG ? UserGroupDetailMemberModel : UserGroupMemberModel;

        model.createModel(serverResponse,userGroupInfo);
        model.getModel().UserGroupId = userGroupInfo.model.uri;
        model.getModel().UserGroupState=userGroupInfo.model.state;
        model.getModel().UserGroupPID=userGroupInfo.model.id;
        model.setContextUGInfo(userGroupInfo);
    };

    let openContextualMenu = function (e, cellInfos) {
        //  that.onItemClick(e, cellInfos);
        if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options.grid) {
              if (e.button == 2) {
                  require(['DS/ENOUserGroupMgmt/Views/Menu/MemberContextualMenu'], function (MemberContextualMenu) {
                     MemberContextualMenu.membersGridRightClick(e,cellInfos.nodeModel.options.grid);
                });           
             }
        }
    };
    
    let registerListners = function(){
        let dataGridView = WrapperDataGridView.dataGridView();
        dataGridView.addEventListener('contextmenu', openContextualMenu);
        /* widget.UserGroupMgmtMediator.subscribe('member-data-updated', function (data) {         
            UserGroupMemberModel.updateRow(data);            
        });  */
        let tileView = WrapperTileView.tileView();
    	//Dispatch events on tile view
    	let memberToolbar = UGMembersDataGridView.getGridViewToolbar();
    	tileView.onSelectionAdd(function(){UserGroupCommands.updateSelectAllCount(UserGroupMemberModel.getModel(), memberToolbar)});
    	tileView.onSelectionRemove(function(){UserGroupCommands.updateSelectAllCount(UserGroupMemberModel.getModel(), memberToolbar)});  
    };
    
    let hideView= function(){
        let elementID = widget.readOnlyUG ? 'usergroupDetailsMembersContainer' : 'usergroupMembersContainer';
		if(document.getElementById(elementID) != null){
            document.getElementById(elementID).style.display = 'none';
           
        }
    };
    
    let showView= function(){
        let elementID = widget.readOnlyUG ? 'usergroupDetailsMembersContainer' : 'usergroupMembersContainer';
		if(document.getElementById(elementID) != null){
           document.getElementById(elementID).style.display = 'block';
           return true;
        }
        return false;
    };
    
    let destroy= function() {
    	_serverresponse = {};    	 
    	_usergroupInfo = {};
    	widget.readOnlyUG ? UserGroupDetailMemberModel.destroy() : UserGroupMemberModel.destroy();
    };
    
    let UGMembersView = {
            init : (userGroupInfo) => { return build(userGroupInfo);},        
            hideView: () => {hideView();},
            destroy: () => {destroy();},
    };

    return UGMembersView;
});

/**
 * 
 *//* global define, widget */
/**
 * @overview UserGroup
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 2.0.
 * @access private
 */

define('DS/ENOUserGroupMgmt/Views/Widget/InitializeSummaryDetails', [
    'UWA/Class/Promise',
    'UWA/Core',
    'DS/ENOUserGroupMgmt/Components/Wrappers/UserGroupApplicationFrame',
    'DS/Windows/ImmersiveFrame',
    'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
    'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
    'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
    'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
    'DS/ENOUserGroupMgmt/Model/UsersGroupModel',
    'DS/ENOUserGroupMgmt/Views/UsersGroupHomeSplitView'],
    function (Promise, UWA, UserGroupApplicationFrame, WUXImmersiveFrame, UsersGroupSummaryView, WrapperDataGridView, RequestUtils, UserGroupBootstrap, UsersGroupModel, UsersGroupHomeSplitView) {
        'use strict';
        var container = null;
        
		let initComponent = function(options) {
			return new Promise(function (resolve , reject) {
				UserGroupBootstrap.authenticatedRequest(
					UserGroupBootstrap.getUserGroupServiceBaseURL() + "/configuration",
					{
						"method": "GET",
						"type": "json",
						onComplete: function(iResult) {
							RequestUtils.set3DSpaceCSRFToken(iResult.csrf);
							RequestUtils.setSecurityContext(iResult.SecurityContext);
							RequestUtils.setIsAdmin(iResult.isAdmin);
							RequestUtils.setIsLeader(iResult.isLeader);
							RequestUtils.setIsAuthor(iResult.isAuthor);
							RequestUtils.setContextUser(iResult.contextUser, iResult.contextUserFullName, iResult.contextUserID);
							RequestUtils.setAllowPrivateUserGroup(iResult.AllowPrivateUserGroup);
							RequestUtils.getPopulate3DSpaceURL(); //populate3DSpaceURL value to be set for the drop down list on search
							init(options).then(resolve, reject);
						}
					})
				})
		}

        const init = async options => {
            let renderContainer = options && options.container
            let containerDiv = null, CurrentSummaryView, activity = {}
            activity.id = "usergroup";
            return new Promise(
                function (resolve , reject) {
                    require(['UWA/Core', 'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView'],
                        function (UWAModule, UsersGroupSummaryView) {
                            CurrentSummaryView = UsersGroupSummaryView;
                            UsersGroupSummaryView.build().then(
                                function (container) {
                                    containerDiv = container;
                                    resolve();
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        }
                    );
                }).then(function () {

                    return new Promise(function (resolve, reject) {
                        let mainContainer = UWA.createElement('div', { 'id': 'usergroup-main-div', 'styles': { 'height': '100%' } });

						if(widget.ugMgmtMediator){
	                        let middleDetailsContainer = new UsersGroupHomeSplitView().getSplitView(widget.ugMgmtMediator.getEventBroker());
	                        new UsersGroupHomeSplitView().setSplitviewEvents(middleDetailsContainer);
	                        middleDetailsContainer.getLeftViewWrapper().appendChild(containerDiv);
	                        
	                        //welcome panel container
	                        let leftContainer = UWA.createElement('div', { 'id': 'usergroup-wc-panel', 'styles': { 'height': '100%', } }).inject(mainContainer);
	
	                        //Information panel container
	                        let rightContainer = UWA.createElement('div', { 'id': 'usergroup-right-panel', 'styles': { 'height': '100%' } });
	
	                        //initialize triptych
	                        let userGroupApplicationFrame = new UserGroupApplicationFrame();
	                        widget.ugMgmtMediator.subscribe('refresh-widget', function (data) {  
			  					userGroupApplicationFrame.destroy();
			  				});
	                        userGroupApplicationFrame.init(widget.ugMgmtMediator.getEventBroker(), mainContainer, leftContainer, middleDetailsContainer.getContent(), rightContainer);
	
	                        container = new WUXImmersiveFrame();
	                        container.setContentInBackgroundLayer(mainContainer);
	                        container.reactToPointerEventsFlag = false;
	                        container.inject(renderContainer);
	                        widget.ugMgmtMediator.publish("usergroup-welcome-panel-activity-selection", { id: activity.id });
                        }else{
							let middleDetailsContainer = new UsersGroupHomeSplitView().getSplitView(ugSyncEvts.ugMgmtMediator.getEventBroker());
	                        new UsersGroupHomeSplitView().setSplitviewEvents(middleDetailsContainer);
	                        middleDetailsContainer.getLeftViewWrapper().appendChild(containerDiv);
	                        
	                        //welcome panel container
	                        let leftContainer = UWA.createElement('div', { 'id': 'usergroup-wc-panel', 'styles': { 'height': '100%', } }).inject(mainContainer);
	
	                        //Information panel container
	                        let rightContainer = UWA.createElement('div', { 'id': 'usergroup-right-panel', 'styles': { 'height': '100%' } });
	
	                        //initialize triptych
	                        let userGroupApplicationFrame = new UserGroupApplicationFrame();
	                        ugSyncEvts.ugMgmtMediator.subscribe('refresh-widget', function (data) {  
			  					userGroupApplicationFrame.destroy();
			  				});
	                        userGroupApplicationFrame.init(ugSyncEvts.ugMgmtMediator.getEventBroker(), mainContainer, leftContainer, middleDetailsContainer.getContent(), rightContainer);
	
	                        container = new WUXImmersiveFrame();
	                        container.setContentInBackgroundLayer(mainContainer);
	                        container.reactToPointerEventsFlag = false;
	                        container.inject(renderContainer);
	                        ugSyncEvts.ugMgmtMediator.publish("usergroup-welcome-panel-activity-selection", { id: activity.id });
						}
						widget.ugMainContainer = container
						
						UsersGroupSummaryView.openSelected(null);
                        resolve(container);
                    });
                });
        }

        return { initComponent };
    });

/**
 * 
 */

define('DS/ENOUserGroupMgmt/Config/UsersGroupAccessRightsGridViewConfig',
        [   
         'DS/ENOUserGroupMgmt/Views/Grid/UserGroupMembersGridCustomColumns',
         'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'], 
        function(
        		UserGroupMembersGridCustomColumns,
        		NLS) {

    'use strict';

    let UsersGroupAccessRightsGridViewConfig=[
		{
     	  text: NLS.MemeberFullName,
          dataIndex: 'tree',
          editableFlag: false,
		  'onCellRequest':UserGroupMembersGridCustomColumns.onMemberUserNameCellRequest
     	},
		{
		  	text: NLS.UserName,
		  	dataIndex: 'name',
		  	editableFlag: false,   
		},
		{
     		text: NLS.Role,
     		dataIndex: 'RoleDisplay',
     		editableFlag: false
		},			
		{
			text: NLS.EmailAddress,
			dataIndex: 'emailAddress',
			editableFlag: false,
		},
		{
     		text: NLS.actions,
     		dataIndex: 'Actions',
     		'onCellRequest':UserGroupMembersGridCustomColumns.onAccessRightsActionCellRequest
		},
		{
			text: NLS.FirstName,
			dataIndex: 'firstName',
			editableFlag: false,
			visibleFlag : false           
		},
		{
			text: NLS.LastName,
			dataIndex: 'lastName',
			editableFlag: false,
			visibleFlag : false           
		},
		{
			text: NLS.City,
			dataIndex: 'city',
			editableFlag: false,
			visibleFlag : false           
		},
		{
			text: NLS.Country,
			dataIndex: 'country',
			editableFlag: false,
			visibleFlag : false           
		},
		{
			text: NLS.Address,
			dataIndex: 'address',
			editableFlag: false,
			visibleFlag : false          
		}
	];
    return UsersGroupAccessRightsGridViewConfig;

});


 


/**
 * datagrid view for user group members tab page
 */
define('DS/ENOUserGroupMgmt/Views/Grid/UsersGroupAccessRightsDataGridView',
        [   
            'DS/ENOUserGroupMgmt/Config/UsersGroupAccessRightsGridViewConfig',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Config/Toolbar/UserGroupAccessRightsToolbarConfig'
            ], function(
            		UsersGroupAccessRightsGridViewConfig,
                    WrapperDataGridView,
                    UserGroupAccessRightsToolbarConfig ) {

    'use strict';
    let _accessRightsToolbar;   
    let build = function(model){
        var gridViewDiv = UWA.createElement("div", {id:'accessRightsdataGridViewContainer',
            styles: {
                'width': "100%",
                'height': "calc(100% - 40px)",
                'position': "relative"
            },
            'class': "accessrights-gridView-View hideView"
        });
        let toolbar = UserGroupAccessRightsToolbarConfig.writetoolbarDefination(model);
        let dataGridViewContainer = WrapperDataGridView.build(model, UsersGroupAccessRightsGridViewConfig, toolbar, gridViewDiv);
        _accessRightsToolbar = WrapperDataGridView.dataGridViewToolbar();
        return dataGridViewContainer;
    };  
    let getGridViewToolbar = function(){
        return _accessRightsToolbar;   
    };
    let UGContentsDataGridView={
            build : (model) => { return build(model);}, 
            getGridViewToolbar: () => {return getGridViewToolbar();}
    };

    return UGContentsDataGridView;
});

/**
 * 
 */
/**
 * view for usergroup access rights page
 */
define('DS/ENOUserGroupMgmt/Views/UserGroupAccessRightsView',
       [   	
    	   	'DS/ENOUserGroupMgmt/Views/Grid/UsersGroupAccessRightsDataGridView',
            'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
            'DS/ENOUserGroupMgmt/Views/Tile/UsersGroupAccessRightsDataTileView',
            'DS/ENOUserGroupMgmt/Model/UserGroupAccessRightsModel',
            'DS/ENOUserGroupMgmt/Utilities/PlaceHolder',
            'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
           	'DS/ENOUserGroupMgmt/Actions/UserGroupAccessRightsActions',
           	'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperTileView',
           	'DS/ENOUserGroupMgmt/Actions/Toolbar/UserGroupCommands',
           	'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
            ], function(
                    UsersGroupAccessRightsDataGridView,
                    WrapperDataGridView,
                   	UsersGroupAccessRightsDataTileView,
                    UserGroupAccessRightsModel,
                    PlaceHolder,
                    UGServicesController,
                    UserGroupAccessRightsActions,
                    WrapperTileView,
                    UserGroupCommands,
                    NLS
            ) {
    'use strict';
    let _usergroupInfo;
    let build = function(userGroupInfo){
    	_usergroupInfo = userGroupInfo;
        if(!showView()){//member view has never been rendered
        	let containerDiv = UWA.createElement('div', {id: 'userGroupAccessRightsContainer','class':'usergroup-accessrights-container'}); 
        	containerDiv.inject(document.querySelector('.usergroup-facets-container'));
             UGServicesController.fetchUserGroupAccessRights(_usergroupInfo.model.pid).then(function(response) {
                 UserGroupAccessRightsModel.destroy();
                 UserGroupAccessRightsViewModel(response, userGroupInfo);
                 drawUserGroupAccessRightsView(containerDiv); 
                
            }); 
       }

    };

    let drawUserGroupAccessRightsView = function(containerDiv){
        //To add the dataGrid view list
        let datagridDiv = UsersGroupAccessRightsDataGridView.build(UserGroupAccessRightsModel.getModel());
        //To add the Tile view summary list
        let tileViewDiv= UsersGroupAccessRightsDataTileView.build(UserGroupAccessRightsModel.getModel());
        UsersGroupAccessRightsDataTileView.contexualMenuCallback();
        registerListners();
        //get the toolbar:no toolbar for now
        let accessrightsTabToolbar=UsersGroupAccessRightsDataGridView.getGridViewToolbar();
        
        let toolBarContainer = UWA.createElement('div', {id:'dataGridAccessRightsDivToolbar', 'class':'toolbar-container', styles: {'width': "100%"}}).inject(containerDiv);
        accessrightsTabToolbar.inject(toolBarContainer);
	  	var addMemberDiv = UWA.createElement("div", {
			  styles: {
				'width': "100%",
				'position': "relative"
			  },
			  'class': "add-resp-team-div addRespView hideView"
			});
			containerDiv.addContent(addMemberDiv);
			datagridDiv.inject(containerDiv);
	        tileViewDiv.inject(containerDiv);
        if (UserGroupAccessRightsModel.getModel().getChildren().length ==0 ) {
        	PlaceHolder.showEmptyAccessRightsPlaceholder(containerDiv);
        }
        PlaceHolder.registerListeners();
        registerEventListeners();
        return containerDiv;
    };
    
    let registerEventListeners = function(){
		if(widget.ugMgmtMediator){
	    	widget.ugMgmtMediator.subscribe('usergroup-accessrights-switchaccess-rows', function (data) {
	    		UserGroupAccessRightsModel.updateRow(data.info,data.grid);    		
			});
			widget.ugMgmtMediator.subscribe('usergroup-accessrights-remove-viewer-active', function (data) {
				if(data.state=="Public"){
		    		let accessModel = UserGroupAccessRightsModel.getModel();
		    		let nodesToRemove = [];
		    		accessModel.prepareUpdate();
		    		accessModel.getChildren().forEach(function(node){
						if(node.options.grid.Role==NLS.AccessRights_AddMembers_ViewerRole){
							nodesToRemove.push(node);
						}
					});
					nodesToRemove.forEach(function(node){
						accessModel.removeRoot(node);
					})
					accessModel.pushUpdate(); 
				}
				let addPanelDiv = document.querySelector(".addRespView");
				if(addPanelDiv){
					addPanelDiv.hide();
				}
				let containerDiv = document.getElementById("userGroupAccessRightsContainer");
				if (UserGroupAccessRightsModel.getModel().getChildren().length ==0 ) {
		        	PlaceHolder.showEmptyAccessRightsPlaceholder(containerDiv);
		        }
		        let respToolbar = UsersGroupAccessRightsDataGridView.getGridViewToolbar();
	    		UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar);
			});
			
			widget.ugMgmtMediator.subscribe('usergroup-accessrights-model-countUpdate', function () {
				let respToolbar = UsersGroupAccessRightsDataGridView.getGridViewToolbar();
	    		UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar);  		
			});
		}else{
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-accessrights-switchaccess-rows', function (data) {
	    		UserGroupAccessRightsModel.updateRow(data.info,data.grid);    		
			});
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-accessrights-remove-viewer-active', function (data) {
				if(data.state=="Public"){
		    		let accessModel = UserGroupAccessRightsModel.getModel();
		    		accessModel.prepareUpdate();
		    		accessModel.getChildren().forEach(function(node){
						if(node.options.grid.Role==NLS.AccessRights_AddMembers_ViewerRole){
							accessModel.removeRoot(node);
						}
					}); 
					accessModel.pushUpdate(); 
				}
				let addPanelDiv = document.querySelector(".addRespView");
				if(addPanelDiv){
					addPanelDiv.hide();
				}
				let containerDiv = document.getElementById("userGroupAccessRightsContainer");
				if (UserGroupAccessRightsModel.getModel().getChildren().length ==0 ) {
		        	PlaceHolder.showEmptyAccessRightsPlaceholder(containerDiv);
		        }
		        let respToolbar = UsersGroupAccessRightsDataGridView.getGridViewToolbar();
	    		UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar);
			});
			
			ugSyncEvts.ugMgmtMediator.subscribe('usergroup-accessrights-model-countUpdate', function () {
				let respToolbar = UsersGroupAccessRightsDataGridView.getGridViewToolbar();
	    		UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar);  		
			});
		}
    };
    
    let UserGroupAccessRightsViewModel = function(serverResponse, userGroupInfo){      
        UserGroupAccessRightsModel.createModel(serverResponse,userGroupInfo);
        UserGroupAccessRightsModel.getModel().UserGroupId = userGroupInfo.model.uri;
        UserGroupAccessRightsModel.getModel().UserGroupState=userGroupInfo.model.state;
        UserGroupAccessRightsModel.getModel().UserGroupPID=userGroupInfo.model.id;
        UserGroupAccessRightsModel.setContextUGInfo(userGroupInfo);
    };
    
    let registerListners = function(){
        let tileView = WrapperTileView.tileView();
    	//Dispatch events on tile view
    	let respToolbar = UsersGroupAccessRightsDataGridView.getGridViewToolbar();
    	tileView.onSelectionAdd(function(){UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar)});
    	tileView.onSelectionRemove(function(){UserGroupCommands.updateSelectAllCount(UserGroupAccessRightsModel.getModel(), respToolbar)});  
    };
    
    let hideView= function(){
        if(document.getElementById('userGroupAccessRightsContainer') != null){
            document.getElementById('userGroupAccessRightsContainer').style.display = 'none';
        }
    };
    
    let showView= function(){
        if(document.querySelector('#userGroupAccessRightsContainer') != null){
            document.getElementById('userGroupAccessRightsContainer').style.display = 'block';
            return true;
        }
        return false;
    };
    
    let destroy= function() {
    	_usergroupInfo = {};
    	UserGroupAccessRightsModel.destroy();
    };
    
    let UserGroupAccessRightsView = {
            init : (userGroupInfo) => { return build(userGroupInfo);},        
            hideView: () => {hideView();},
            destroy: () => {destroy();},
    };

    return UserGroupAccessRightsView;
});

/**
 * 
 *//* global define, widget */
/**
 * @overview UserGroup
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 2.0.
 * @access private
 */

define('DS/ENOUserGroupMgmt/Views/CustomContainer/UserGroupConfigInit', [
	'UWA/Core',
	'DS/ENOUserGroupMgmt/Components/Mediator',
	'DS/ENOUserGroupMgmt/Components/Notifications',
	'DS/Windows/ImmersiveFrame',
	'DS/ENOUserGroupMgmt/Views/Widget/InitializeSummaryDetails',
	'DS/Windows/Dialog',
	'DS/Controls/Button',
	'DS/ENOUserGroupMgmt/Controller/UserGroupBootstrap',
	'UWA/Class/Promise',
	'DS/ENOXWidgetPreferences/js/ENOXWidgetPreferences',
	'DS/ENOUserGroupMgmt/Controller/UserGroupServicesController',
	'i18n!DS/ENOUserGroupMgmt/assets/nls/ENOUserGroupMgmt'
],
	function (UWA, Mediator, Notifications, WUXImmersiveFrame, InitializeSummaryDetails, WUXDialog, WUXButton, UserGroupBootstrap, Promise, ENOXWidgetPreferences, UserGroupServicesController, NLS) {
		'use strict';

		const createDefaultDialog = frame => {

			let _dialog, immersiveFrame;

			const destroyContainer = () => {
				if (immersiveFrame != undefined) {
					immersiveFrame.destroy();
				}
				_dialog.destroy()
			}

			const footerCancelButton = new WUXButton({ domId: 'closeButtonId', label: NLS.CloseDialog, emphasize: "secondary", onClick: destroyContainer })
			const configDialogContainer = new UWA.Element('div', { id: "UserGroupConfigDialogContainer" });

			immersiveFrame = frame || new WUXImmersiveFrame();
			immersiveFrame.inject(document.body);

			let header = NLS.UserGroupConfigWindowHeader;

			_dialog = new WUXDialog({
				title: header,
				modalFlag: true,
				width: 900,//to accomodate majority of the columns
				height: 500,
				content: configDialogContainer,
				immersiveFrame: immersiveFrame,
				resizableFlag: true,
				buttons: {
					Cancel: footerCancelButton
				}
			});

			_dialog.addEventListener("close", function (e) {
				if (immersiveFrame != undefined)
					immersiveFrame.destroy();
			});

			return {
				configDialogContainer,
				destroyContainer
			}
		};

		const init = (data = {}, container) => {

			//_storages = new CollabStorageCollection();
			if (typeof widget == 'undefined') {
				window.widget = { data: {} }
				widget.setValue = (id, value) => widget[id] = value
				widget.getValue = id => widget[id]
			}
			
			let { x3dPlatformId, userGroup, userSecurityContext } = data
			
			let appContainer = null;
			if (container instanceof Element || container instanceof HTMLDocument) {
				appContainer = container
			} else if (typeof container == typeof new WUXImmersiveFrame()) {
				const { configDialogContainer } = createDefaultDialog(container)
				appContainer = configDialogContainer
			} else {
				const { configDialogContainer } = createDefaultDialog()
				appContainer = configDialogContainer
			}
			
			widget.ugMgmtMediator = new Mediator(); //setting channel as global for communication between components
			widget.ugNotify =  new Notifications();
			
			x3dPlatformId && widget.setValue("x3dPlatformId", x3dPlatformId);
			userSecurityContext && widget.setValue("userGroup-userSecurityContext", userSecurityContext);
			userGroup && widget.setValue("ug-userGroup", userGroup);

			return new Promise((resolve, reject) => {
				ENOXWidgetPreferences.addPlatformSelectionPreferenceToWidget({ roles: ["CSV", "InternalDS"], mustHaveAll: false }).then(function() {
					ENOXWidgetPreferences.addCredentialPreferenceToWidget().then(function() {
						console.log("New Credential");
						//const prefIndex = widget.preferences.findIndex(a=>a.name == 'xPref_CREDENTIAL')
						//widget.preferences[prefIndex].type='hidden'

						widget.addPreference({
							name: "collabspace",
							type: "hidden",
							label: "collabspace",
							defaultValue: UserGroupBootstrap.getSecurityContextValue().split('ctx::')[1].split('.')[1]
						});
						widget.setValue("collabspace", UserGroupBootstrap.getSecurityContextValue());

						UserGroupBootstrap.start({}).then(
							() => InitializeSummaryDetails.initComponent({ container: appContainer })
								.then(container => resolve(container))
								.catch((error) => console.log(error))
						)
							.catch((error) => console.log(error));

					});
				});
			})

		}
		 
		return { init };
	});

/**
 * 
 *//* global define, widget */
/**
 * @overview UserGroup
 * @licence Copyright 2006-2018 Dassault Systemes company. All rights reserved.
 * @version 2.0.
 * @access private
 */

define('DS/ENOUserGroupMgmt/Views/Widget/UserGroupWidgetInit', [
	'UWA/Class',
    'UWA/Class/Promise',
	'UWA/Core',
	'UWA/Controls/Abstract',
	'Core/Core',
	'DS/ENOUserGroupMgmt/Components/Mediator',
	'DS/ENOUserGroupMgmt/Components/Notifications',
	'DS/WAFData/WAFData',
	'DS/ENOUserGroupMgmt/Utilities/RequestUtils',
	'DS/ENOUserGroupMgmt/Views/UsersGroupHomeSplitView',
	'DS/Windows/ImmersiveFrame',
	'DS/ENOUserGroupMgmt/Views/UsersGroupSummaryView',
	'DS/ENOUserGroupMgmt/Views/Dialogs/InitiateUsersGroupDialog',
	'DS/ENOUserGroupMgmt/Components/Wrappers/WrapperDataGridView',
	'DS/ENOUserGroupMgmt/Views/UsersGroupIDCardView',
	'DS/ENOUserGroupMgmt/Views/CustomContainer/UserGroupConfigInit'],
	function (Class, Promise, UWA, Abstract, Core, Mediator, Notifications, WAFData, RequestUtils, UsersGroupHomeSplitView, WUXImmersiveFrame, UsersGroupSummaryView, InitiateUsersGroupDialog, WrapperDataGridView, UsersGroupIDCardView, UserGroupConfigInit) {
        'use strict';
        let container = null, UserGroupApplicationFrame = null;
        const Application = Class.extend({
            name: 'UserGroup',
            /**
             * See UWA documentation.
             * @inheritDoc
             */
            onLoad: function () {

                //initialize the UserGroupEvent to enable interactions among components
				//initialize the Notification to enable the alert messages
                widget.ugNotify = new Notifications();
                widget.ugMgmtMediator = new Mediator(); //setting channel as global for communication between components
				//ugSyncEvts.ugMgmtMediator = new Mediator(); //setting channel as global for communication between components
				//ugSyncEvts.ugNotify =  new Notifications();
				
				UserGroupConfigInit.init({}, widget.body).then(
					//function(){
					frameContainer => { container = frameContainer; },
					error=>console.log("Error here:", error)
					//}, function(){}
				)
				.catch((error) => console.log(error))
            },

            onRefresh: function () {
                
                return new Promise(function(resolve) {
					//widget.ugMgmtMediator.publish('refresh-widget');
					UsersGroupSummaryView.destroy();
					if(widget.ugMainContainer && typeof widget.ugMainContainer.destroy=="function"){
						widget.ugMainContainer.destroy();
					}
                    
                    if(container!=null){
                        container.destroy();
                    }
                    
                    //WrapperDataGridView.destroy();
                    if(widget.ugMgmtMediator){
	                    widget.ugMgmtMediator.destroy();
	                    //widget.ugMgmtMediator = new Mediator();
                    }
                    InitiateUsersGroupDialog.destroyContainer();
                    resolve();
                }).then(function() {
                	UserGroupConfigInit.init({}, widget.body).then(
						frameContainer => { container = frameContainer; },
						error=>console.log("Error here:", error)
					)
					.catch((error) => console.log(error))
                });
            }

        });

        return Application;
    });

