<%--
  ECMChangeNewImplementedItems.jsp
  
  Copyright (c) 2017-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of 
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>

<%-- Common Includes --%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/emxUIConstantsInclude.inc"%>

<%@page import="com.matrixone.apps.domain.util.ContextUtil"%>
<%@page import="com.matrixone.apps.domain.util.MqlUtil"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import = "com.matrixone.apps.domain.DomainConstants"%>


<%
  out.clear();
  String urlStr = "";
  String  strContextID = "";
  boolean bIsError = false;
  try
  {
       String objectId = emxGetParameter(request,"objectId");
       DomainObject rootDom = new DomainObject(objectId);
       strContextID = rootDom.getInfo(context, "physicalid");
       strContextID = "pid:" + strContextID;
  }
  catch(Exception e)
  {
    bIsError=true;
    session.setAttribute("error.message", e.getMessage());
  }// End of main Try-catck block
%>
<html>
<head>
<script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<link rel="stylesheet" type="text/css" href="../webapps/c/UWA/assets/css/standalone.css" />
<script type="text/javascript" src="../webapps/c/UWA/js/UWA_Standalone_Alone.js"></script>
<script type="text/javascript" src="../webapps/WebappsUtils/WebappsUtils.js"></script>
<script type="text/javascript" src="../webapps/UIKIT/UIKIT.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../webapps/PlatformAPI/PlatformAPI.js"></script>
<script type="text/javascript" src="../webapps/ENOChgServices/ENOChgServices.js"></script>
<script type="text/javascript" src="../webapps/ENOChangeActionUX/ENOChangeActionUX.js"></script>
<script type="text/javascript" src="../webapps/ENOChgServices/ENOChgServices.js"></script>
<script type="text/javascript" src="../webapps/ENOChgGovernanceUX/ENOChgGovernanceUX.js"></script>
         <style type="text/css">
        .tile-title{
        font-size: 15px;
        font-family: '3dsregular' tahoma,serif;
        color: #368ec4;
        }
        .module{
        width:100%;
        height:100%;
         margin: 0;
         border: none;
        }
        .moduleWrapper {
            z-index: inherit;
            zoom: 1;
        }

            .module > .moduleHeader {
                display: none;
            }

            .moduleFooter {
                display: none;
            }


        </style>
<script>
    var rootNode;

	
    function loadRealizedContent()
     {
         if(rootNode)
         {
             getTopWindow().window.close();
         }
         else
         {   
             require(['DS/PlatformAPI/PlatformAPI',
                      'DS/ENOChangeActionUX/scripts/Models/CAModel',
                      'DS/ENOChangeActionUX/scripts/Views/CANewRealizedView',
                      'DS/ENOChangeActionUX/scripts/CASpinner',
                      'DS/Foundation/WidgetUwaUtils',
                      'DS/ENOChgServices/scripts/services/ChgInfraService',
					  'DS/ENOChgServices/scripts/services/ChgDataService',
					  'DS/ENOChgServices/scripts/services/ChgDataProcess',
                      'DS/ENOChgServices/scripts/services/ChgServiceGlobalVariable',
                      'DS/ENOChgServices/scripts/services/ChgIDCardCommonServices',
					  'DS/ENOChgServices/scripts/services/UserPreferenceUtil',
					  'i18n!DS/ENOChgGovernanceUX/assets/nls/ENOChgGovernanceNLS',
					  "DS/ENOChgServices/scripts/services/DefaultPreferencesManager",
			      'UWA/Class/Promise'
                      ],
                     function(PlatformAPI, CAModel, CANewRealizedView,
                     CASpinner, WidgetUwaUtils,ChgInfraService,ChgDataService,ChgDataProcess,ChgServiceGlobalVariable,ChgIDCardCommonServices,UserPreferenceUtil,APP_NLS, DefaultPreferencesManager, Promise){
                 
						var createHeaderFieldsJSON = function (data) {
						var returnedPromise = new Promise(function (resolve, reject) {
							//get CS n Org Title
							let nlsWSInput = {
								"ds6w:project": [data.model.collabspace],
								"ds6w:organizationResponsible": [data.model.organization]
							};

							ChgInfraService.getNLSValuesPromise(nlsWSInput).then(function (resultNLSObject) {
								let orgTitle = resultNLSObject["ds6w:organizationResponsible"][data.model.organization];
								let csTitle = resultNLSObject["ds6w:project"][data.model.collabspace];

								//let lastColumn = ["orgnaization", "Flowdown", "isGoverned"];
								let lastColumn = [];


								var resultJson = {
									id: data.model.id,
									name: data.model.name,
									revision: data.model.revision,
									type: data.model.type,
									title: data.model.title,
									description: data.model.description,
									severity: data.model.severity,
									maturity: data.model.maturity,
									thumbnail: data.model.thumbnail,
									iconURL: data.model.iconURL,
									minified: false,
									onHold: data.model.onHold,
									isKindOfType: data.model.isKindOfType,
									attributes: {
										layout: [
											["maturity", "owner", "collabSpace"],
											["Applicability", "Dependency", "Attachments"],
											["orgnaization", "Flowdown", "isGoverned"],

										],
										mapping: {
											owner: {
												fieldNLS: APP_NLS.CHG_GOV_DataGrid_Column_Owner,
												valueActual: data.model.owner,
												valueDisplay: data.model.ownerFullName,
												showLoader: false,
												displayWhenMinified: true,
												editable: true,
												accessBit: "Transfer",
											},
											collabSpace: {
												fieldNLS: APP_NLS.CHG_GOV_DataGrid_Column_CollabSpace,
												valueActual: data.model.collabspace,
												valueDisplay: csTitle,
												showLoader: false,
												displayWhenMinified: true,
												editable: true,
												accessBit: "Transfer",
											},
											maturity: {
												fieldNLS: APP_NLS.CHG_GOV_DataGrid_Column_Maturity,
												valueActual: data.model.maturity,
												valueDisplay: data.model.maturityNLS,
												showLoader: false,
												displayWhenMinified: true,
												editable: true,
											},
											orgnaization: {
												fieldNLS: APP_NLS.CHG_GOV_DataGrid_Column_Organization,
												valueActual: data.model.organization,
												valueDisplay: orgTitle,
												showLoader: false,
												displayWhenMinified: true,
												editable: true,
												accessBit: "Transfer",
											},
											Applicability: {
												fieldNLS: APP_NLS.CHG_GOV_Header_Applicability,
												valueActual: "No",
												valueDisplay: "No",
												showLoader: true,
												displayWhenMinified: true,
												editable: true,
											},
											Dependency: {
												fieldNLS: APP_NLS.CHG_GOV_Header_Dependency,
												valueActual: "No",
												valueDisplay: "No",
												showLoader: true,
												displayWhenMinified: true,
												editable: true,
											},
											Attachments: {
												fieldNLS: APP_NLS.CHG_GOV_Header_Attachments,
												valueActual: "No",
												valueDisplay: "No",
												showLoader: true,
												displayWhenMinified: true,
												editable: true,
											},
											Flowdown: {
												fieldNLS: APP_NLS.CHG_GOV_Header_Flowdown,
												valueActual: "Unassigned",
												valueDisplay: "Unassigned",
												showLoader: true,
												displayWhenMinified: true,
												editable: true,
											},
											isGoverned: {
												fieldNLS: APP_NLS.CHG_GOV_Header_isGoverned,
												valueActual: "No",
												valueDisplay: "No",
												showLoader: true,
												displayWhenMinified: true,
												editable: true,
											},
											Group: {
												fieldNLS: APP_NLS.CHG_GOV_Header_Group,
												valueActual: undefined, //data.model.groupId,
												valueDisplay: "Unassigned", //data.model.groupName,
												showLoader: true,
												displayWhenMinified: true,
												accessBit: "AddToGroup",
												/* 	editable: function() {
														if (ChgServiceGlobalVariable.getGlobalVariable().isFullLicence== "false")
														{
														return false;
														}
														return true;
													  }, */
											},
										},
									},
									freeSpaces: [
										{
											type: "text",
											data: data.model.description,
										},
									],
									menuItems: [
										{
											id: "chgBOMSync",
											text: APP_NLS.ECM_CA_EBOM_Sync_Action,
											fonticon: "fonticon fonticon-change-action-sync",
											accessBit: "Synchronization",
										},
										{
											id: "chgHold",
											text: APP_NLS.CHG_GOV_Header_Menu_Hold,
											fonticon: "fonticon fonticon-pause",
											accessBit: "Hold",
										},
										{
											id: "chgResume",
											text: APP_NLS.CHG_GOV_Header_Menu_Resume,
											fonticon: "fonticon fonticon-resume",
											accessBit: "Resume",
										},
										{
											id: "chgCancel",
											text: APP_NLS.CHG_GOV_Header_Menu_Cancel,
											fonticon: "fonticon fonticon-block",
											accessBit: "Cancel",
										},
										{
											id: "chgDuplicateCA",
											text: APP_NLS.CHG_GOV_Change_Action_Duplicate,
											fonticon: "fonticon fonticon-copy",
											accessBit: "Duplicate",
										}
									],
								};
								if (ChgServiceGlobalVariable.getGlobalVariable().CHG_CHANGE_GROUP == 'true') lastColumn.push("Group")
								resultJson.attributes.layout.push(lastColumn);

								//Native workunder menu
								let workUnderMenu = {
									id: "chgCAWorkUnder",
									text: APP_NLS.CHG_GOV_Header_Menu_WorkUnder,
									fonticon: 'fonticon fonticon-hardhat',
									accessBit: "WorkUnder",
								};
								if (ChgServiceGlobalVariable.getGlobalVariable().isNative || ChgServiceGlobalVariable.getGlobalVariable().isPoweredBy) {
									resultJson.menuItems.push(workUnderMenu);
									//
									PlatformAPI.unsubscribe('change-action-work-under');
									PlatformAPI.subscribe('change-action-work-under', function (data) {
										service.publishEventToWebnWinForWorkUnder(data);
									});

								}
								resolve(resultJson);
							});
						});
						return returnedPromise;
				}; 
                 
                    ChgInfraService.init();
                    var curTenant = "OnPremise";
				    <%
                        if(!FrameworkUtil.isOnPremise(context)){
                        %>
                            curTenant = "<%=XSSUtil.encodeForJavaScript(context, context.getTenant())%>";
                        <%
                        }   
                    %> 
                 
                    window.enoviaServer.tenant = curTenant;
                    var caGlobalObject = ChgServiceGlobalVariable.getGlobalVariable();
                    caGlobalObject.tenant = curTenant;
                    caGlobalObject.is3DSpace = true;

				    var userId = "<%=XSSUtil.encodeForJavaScript(context, context.getUser())%>";
                    var language = "<%=XSSUtil.encodeForJavaScript(context, context.getSession().getLanguage())%>";
				 
                    var randomName = "wdg_" + new Date().getTime();
                    ChgInfraService.setupIntercomConnections.call(this, widget, caGlobalObject, randomName);
                    widget.body.setStyle("min-height", "50px");
                    CASpinner.set3DSpace(true);
                    CASpinner.doWait(widget.body);

				    var currentTop = getTopWindow();
                    while (currentTop && currentTop.x3DPlatformServices == undefined) {
					    if (currentTop.getWindowOpener().getTopWindow()) currentTop = currentTop.getWindowOpener().getTopWindow();
				    }
					
					caGlobalObject.compassWindow = currentTop;
					
				    var myAppBaseURL=""; 
                    if (currentTop && currentTop.x3DPlatformServices) {
                        myAppBaseURL = currentTop.x3DPlatformServices[0]['3DCompass'];
    				}
					 
				    var config = {
					    myAppsBaseUrl: myAppBaseURL,
						userId: userId,
						lang: language
					};
					
                    ChgInfraService.populate3DSpaceURL(config)
                    .then(function(success){
                        ChgInfraService.populateSecurityContext()
                            .then(function (securityContextDetails){
								ChgInfraService.fetchAllChangeSubTypes();
                                ChgInfraService.getExpressionValue().then(function (success) {
									//for custom column
									UserPreferenceUtil.initialize({
					       prefix: "CHG",
					       storage: ChgServiceGlobalVariable.getGlobalVariable(),
				      });
                                    UserPreferenceUtil.fetchUserPreference(DefaultPreferencesManager.preferences);
				                    
									let platform = "WebApp";
									ChgInfraService.getLicenceAccess(platform).then(
									function(response){
										ChgServiceGlobalVariable.getGlobalVariable().isFullLicence = response.data[0].IsFullLicense;
										ChgServiceGlobalVariable.getGlobalVariable().isLiteLicence = response.data[0].IsLiteLicense;
										ChgServiceGlobalVariable.getGlobalVariable().isDerivativeLicense = response.data[0].isDerivativeLicense;
																		
										var caModel = new CAModel({
											 'id': '<%=strContextID%>',
											 lifecycleHTML: "<span id ='lifecycleSpan'></span>",
											 'isSelected': true
										});
										var options = {};
										
										
										ChgDataService.getChangeActionInfo(caModel.id.substring(4)).then(
											function (CAInfoDetail) {
												var processNode = ChgDataProcess.processChangeActionDetails(CAInfoDetail);
												//resolve(processNode);												

												let tempFormatJson = {
													model: processNode[0],
												};
												createHeaderFieldsJSON(tempFormatJson).then(async function (model) {
													let groupdDataResp =  await ChgDataService.getChangeGroupData(model.id);
													let groupData = groupdDataResp.changeaction.group;
													 options.id = model.id;
													 options.contextDetails = {
														isCAGrouped: groupData == undefined? "false": "true",
														id: options.id,
														name: model.name,
														title: model.title,
														description: model.description,
														severity: model.severity,
														maturity: model.maturity,
														isKindOfType: model.isKindOfType,
														_modelEvents: undefined,
														userAccess: undefined,//accessBits, //needed later for setting up customized openwith to send CA info to do workunder
														contextIds: undefined//contextIds
													  };													  
													
													  let realizedViewOption = {
															caModel: {
																id:options.id,
																'name': options.contextDetails.name,
																'title': options.title,
																'description': options.contextDetails.description,
																'severity': options.contextDetails.severity,
																'maturity': options.contextDetails.maturity,
																'invokedFrom':'gov',
																'isSelected': options.isSelected
															},
														init_options:options
														};
			
																				//caModel.fetch(options);
														var physicalID = caModel.id;
														ChgIDCardCommonServices.setCurrModel(caModel);
														ChgIDCardCommonServices.getUserAccess(physicalID).then(function(resp){
															caModel.set("userAccess", resp.userAccess);
														});

														/*for different component integration from dashboard like maturity/generic create etc. */
														Array.prototype.find = function (userFunction) {
														  var bFound = false;
														  for (var i=0; i  < this.length ; i++) {
															if (userFunction(this[i])) {
															  return this[i];
															}
														  }
														  return undefined;  
														}

														delete Array.prototype.remove;
														delete Array.prototype.apply;
														/*for different component integration from dashboard like maturity/generic create etc. END*/
														
														var Content = new UWA.createElement('div', {
															'id': 'main-container',
															styles: { height: '100%', width: '100%', display: 'flex' },
															html: [
																{
																	tag: 'div',
																	id: 'skeleton-container',
																	styles: { height: '100%', width: '100%' }
																},
																{
																	tag: 'div',
																	id: 'slidein-container',
																	styles: { height: '100%', width: '0', position: 'fixed', zIndex: '1', top: '0', 
																			right: '0', overflowX: 'hidden', transition: '.5s', borderLeft: '0 solid #d1d4d4', 
																			background: 'white' }
																}
															]
														}); 
														var maincontainer = document.getElementById('maincontainer');
														maincontainer.appendChild(Content);
														var skeletonContainer = Content.getElement("#skeleton-container");
														var realizedViewMainContainerElem = document.getElementById('realizedViewMainContainer');
														var realizedviewContainerDivelem = UWA.createElement('div', {
															'class' : 'divElem', 
															'id' : 'realizedViewContainer',
															'styles' : {
																'height' : '100%',
																'width': '100%',
																'position':'relative'
															}
														});
														skeletonContainer.appendChild(realizedViewMainContainerElem);
														realizedViewMainContainerElem.appendChild(realizedviewContainerDivelem);
														
														options.outerContainerTabDiv = maincontainer;
													    options.target = realizedviewContainerDivelem;
													    options.targetclassName = "divElem";
														
														var realizedView = CANewRealizedView._createView_NewRealized('div', 'test-realized-facet', true, caModel,realizedViewOption);
														var descrtipView = new (realizedView);
														descrtipView.container = realizedviewContainerDivelem;
														descrtipView.render();  
													
												});
										});						
										
									});
                                },
                                function (error) {
                                    console.log('Expression value check failed');
                                    return Promise.reject(error);
                                });
                            },
                            function(error){
                                console.log("Populate Security Context failed");
                                CASpinner.endWait(widget.body);
                                return Promise.reject(error);
                            });
                    },
                    function(error){
                        console.log('populate 3DSpace URL fails');
                        return Promise.reject(error);
                    });
             });
         }
     }
    
</script>
</head>
<body onLoad = "loadRealizedContent();" style="overflow:hidden;">
<div id="maincontainer"></div>
<div id="realizedViewMainContainer"></div>
</body>
</html>  
