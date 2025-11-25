define('DS/ENOCommonSearchLocalActions/SearchLocalActionsForDocument',
    ['UWA/Class',
        'UWA/Class/Debug',
        'UWA/Class/Events',
        'UWA/Environment'
    ],
    function (UWAClass,
        UWADebug,
        UWAEvents,
        UWAEnvironment
    ) {

        var ActionsHandler = UWAClass.singleton(UWAEvents, UWADebug, {

            init: function () {
                /*var environment = new UWAEnvironment({
                    'id': 'SearchLocalActionsForDocumentEnv'
                });
                environment.dispatchEvent('onInit');
                environment.inited = true;
                environment.wp = {
                    'id': 'SearchLocalActionsForDocumentEnv'
                };
                environment.registerWidget(new UWA.Widget());
                this.widget = environment.getWidget();

                this.widget.body = document.body;
                this.widget.widgetDomain = this.dsBaseUrl;*/
            },
            initJobProcessorPromise: function (searchWidgetObject) {
                var that = this;
                this.getJobsProcessorPromise = this.getJobsProcessorPromise || new UWA.Promise(function (resolve, reject) {
                    var app = {};
                    require([
                        'DS/DocumentCommands/Jobs' + '',
                        'DS/DocumentCommands/ProgressPane' + ''
                    ], function (Jobs, ProgressPane) {
                        if (app.jobs == undefined) {
                            app.jobs = new Jobs(app);
                        }
                        if (app.progressPane == undefined) {
                            app.progressPane = new ProgressPane(app);
                            if (searchWidgetObject && searchWidgetObject.body)
                                app.progressPane.inject(searchWidgetObject.body);
                            else
                                app.progressPane.inject(document.body);
                        }
                        resolve(app.jobs);
                    });
                });
            },
            executeAction: function (actions_data) {
                var that = this;
                if (actions_data.object_id) {
                    actions_data.actionsHelper.getServiceURL({
                        'onComplete': function (url) {
                            require.config({
                                paths: {
                                    "DS/DocumentCommands": url + "/webapps/DocumentCommands",
                                    "DS/DocumentCommonInfra": url + "/webapps/DocumentCommonInfra",
                                    "DS/DocumentFiles": url + "/webapps/DocumentFiles",
									"DS/DocumentWebEdition": url + "/webapps/DocumentWebEdition"
                                },
                            });
                            require(['DS/DocumentManagement/' + 'DocumentManagement',
                                'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
                                'DS/CoreEvents/ModelEvents',
                            'DS/DocumentCommands/DocumentCommandsV2' + ''
                            ], function (DocumentManagement,
                                i3DXCompassPlatformServices,
                                ModelEvents,
                                DocumentCommandsV2
                            ) {
                                i3DXCompassPlatformServices.getPlatformServices({
                                    platformId: actions_data.actionsHelper.getPlatformID({
                                        'id': actions_data.object_id
                                    }),
                                    onComplete: function (platformUrls) {
                                        DocumentManagement.getDocuments([actions_data.object_id], {
                                            tenant: platformUrls.platformId,
                                            tenantUrl: platformUrls['3DSpace'],
                                            securityContext: actions_data.actionsHelper.get3DSpaceSecurityContext(),
                                            additionalURLParams: "$fields=isDocumentType",
                                            onComplete: function (response) {
                                                if (response.success) {
                                                    var modelEvents = new ModelEvents();
                                                    modelEvents.subscribe({
                                                        event: "docv2-show-notification"
                                                    }, function (e) {
                                                        actions_data.actionsHelper.displayAlert({
                                                            "message": undefined == e.message || "" == e.message ? e.subtitle || e.title : e.message,
                                                            "level": e.level
                                                        });
                                                    });
                                                    var searchWidgetObject = actions_data.actionsHelper.getResultWidget();
													//Widget object existence does not come into picture for C&A case. So condition added
													if(undefined != searchWidgetObject) {
														searchWidgetObject.widgetDomain = that.dsBaseUrl;
														searchWidgetObject.tenant = platformUrls.platformId; //tenant info for usage.;
														that.initJobProcessorPromise(searchWidgetObject);
													}
                                                    
                                                    var options = {
                                                        fetchSecurityContext: function () {
                                                            return actions_data.actionsHelper.get3DSpaceSecurityContext();
                                                        },
                                                        container: actions_data.actionsHelper.getTarget(),
                                                        getSelectedNodes: function () {
                                                            return response.data;
                                                        },
                                                        getDocumentFromNodeModel: function (e6wDocument) {
                                                            return e6wDocument;
                                                        },
                                                        getJobsProcessorPromise: that.getJobsProcessorPromise,
                                                        widget: searchWidgetObject,
                                                        platformUrls: platformUrls,
                                                        isFromContextMenu: true,
                                                        events: modelEvents
                                                    };
                                                    var docCmdsV2 = new DocumentCommandsV2(options);
                                                    var commoncmds = docCmdsV2.commands;
                                                    if ((actions_data.action_id == "documentAction_Download")) {
                                                        commoncmds["Download"].execute();
                                                    }
                                                    else if ((actions_data.action_id == "documentAction_Edit")) {
                                                        commoncmds["LockAndDownload"].execute();
                                                    } else if ((actions_data.action_id == "documentAction_UndoEdit")) {
                                                        commoncmds["UndoEdit"].execute();
                                                    } else if ((actions_data.action_id == "documentAction_Update")) {
                                                        commoncmds["Update"].execute();
                                                    } else if ((actions_data.action_id == "documentAction_CopyLink")) {
                                                        commoncmds["CopyLink"].execute();
                                                    }
                                                }
                                            },
                                            onFailure: function (response) {
                                                console.log("error while execting action from search result");
                                            }
                                        });
                                    }
                                });
                            });
                        },
                        'id': actions_data.object_id
                    });
                } else if (actions_data.object_ids) {
                    actions_data.actionsHelper.getServiceURL({
                        'onComplete': function (url) {
                            require.config({
                                paths: {
                                    "DS/DocumentCommands": url + "/webapps/DocumentCommands",
                                    "DS/DocumentCommonInfra": url + "/webapps/DocumentCommonInfra",
                                    "DS/DocumentFiles": url + "/webapps/DocumentFiles"
                                },
                            });
                            require(['DS/DocumentManagement/' + 'DocumentManagement',
                                'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
                                'DS/CoreEvents/ModelEvents',
                            'DS/DocumentCommands/DocumentCommandsV2' + ''
                            ], function (DocumentManagement,
                                i3DXCompassPlatformServices,
                                ModelEvents,
                                DocumentCommandsV2
                            ) {
                                i3DXCompassPlatformServices.getPlatformServices({
                                    platformId: actions_data.actionsHelper.getPlatformID({
                                        'id': actions_data.object_ids[0]
                                    }),
                                    onComplete: function (platformUrls) {
                                        DocumentManagement.getDocuments(actions_data.object_ids, {
                                            tenant: platformUrls.platformId,
                                            tenantUrl: platformUrls['3DSpace'],
                                            additionalURLParams: "$fields=isDocumentType",
                                            securityContext: actions_data.actionsHelper.get3DSpaceSecurityContext(),
                                            onComplete: function (response) {
                                                if (response.success) {
                                                    var modelEvents = new ModelEvents();
                                                    modelEvents.subscribe({
                                                        event: "docv2-show-notification"
                                                    }, function (e) {
                                                        actions_data.actionsHelper.displayAlert({
                                                            "message": undefined == e.message || "" == e.message ? e.subtitle || e.title : e.message,
                                                            "level": e.level
                                                        });
                                                    });
                                                    var searchWidgetObject = actions_data.actionsHelper.getResultWidget();
                                                    searchWidgetObject.widgetDomain = that.dsBaseUrl;
                                                    searchWidgetObject.tenant = platformUrls.platformId; //tenant info for usage.;
                                                    that.initJobProcessorPromise(searchWidgetObject);
                                                    var options = {
                                                        fetchSecurityContext: function () {
                                                            return actions_data.actionsHelper.get3DSpaceSecurityContext();
                                                        },
                                                        getSelectedNodes: function () {
                                                            return response.data;
                                                        },
                                                        getDocumentFromNodeModel: function (e6wDocument) {
                                                            return e6wDocument;
                                                        },
                                                        getJobsProcessorPromise: that.getJobsProcessorPromise,
                                                        widget: searchWidgetObject,
                                                        platformUrls: platformUrls,
                                                        isFromContextMenu: true,
                                                        events: modelEvents
                                                    };
                                                    var docCmdsV2 = new DocumentCommandsV2(options);
                                                    var commoncmds = docCmdsV2.commands;
                                                    commoncmds["Download"].execute();
                                                }
                                            },
                                            onFailure: function (response) {
                                                console.log("error while execting action from search result");
                                            }
                                        });
                                    }
                                });

                            });
                        }, 'id': actions_data.object_ids[0]
                    });
                }
            },
        });
        return ActionsHandler;
    });

