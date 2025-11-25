/*global define*/
define('DS/ENOStandardMgmtUIWeb/Model/ENOStandardMgmtModel',
    [
        'UWA/Class/Model'
    ], function (Model) {
        "use strict";
        return Model.extend({
            defaults: function() {
                return {
                    id: ''
                };
            }
        });
    });

define('DS/ENOStandardMgmtUIWeb/utils/URLHandler', [], function () {
  'use strict';

  var urlHandler = {
    init: function (url, tenant) {
      this.url = url;
      this.tenant = tenant;
    },

    setURL: function (url) {
      this.url = url;
    },

    getURL: function () {
      return this.url;
    },

    getTenant: function () {
      return this.tenant;
    },

    setTenant: function (itenant) {
      this.tenant = itenant;
    }
  };

  return urlHandler;
});


/*global define, widget*/
define('DS/ENOStandardMgmtUIWeb/Views/ENOStandardMgmtViewUtilities',
    [
        'UWA/Core',
		//'DS/UIKIT/Modal',
        'DS/UIKIT/Input/Button',
		'i18n!DS/ENOStandardMgmtUIWeb/assets/nls/ENOStandardMgmtViewNLS'
    ],
    function (UWA,
			  //Modal, 
              Button,              
              ENOStandardMgmtViewNLS) {

        'use strict';

        var UIview = {
			
			createContentDiv : function() {
                UWA.log("ENOStandardMgmtViewUtilities::createContentDiv!");
				let contentDiv = UWA.createElement('div', {'id': 'standardSettingMainDiv'});
				let hght = widget.getViewportDimensions().height;
				contentDiv.setStyle('height', hght - 170 + 'px');
				return contentDiv;
			},
						
            createInfoDiv : function (parentDiv) {
                UWA.log("ENOStandardMgmtViewUtilities::createInfoDiv!");

                const introDiv = UWA.createElement('div', {
                    'id': 'standardMgmtInfoDiv',
                    'class': 'standardMgmtInfoDiv'}).inject(parentDiv);
				
                UWA.createElement ("br", {}).inject(introDiv);
                UWA.createElement('p', {
                    text   : ENOStandardMgmtViewNLS.IntroductionText,
                    'class': 'font-3dslight',
					styles: {
						'margin-left': '20px'
					}					
                }).inject(introDiv);
                return introDiv;
            },			
			
            createApplyResetToolbar : function (insertdivID, activateApplyBtn, applyParams, resetParams) {
                UWA.log("ENOStandardMgmtViewUtilities::createApplyResetToolbar!");
                var applyDiv, tableButtons, lineButtons, buttonApplyCell, applyBttn,
                    buttonResetCell, resetBbttn;
				
                applyDiv =  UWA.createElement('div', {
                    'id': 'ApplyResetDiv',
                    'class': 'ApplyResetDiv',
					styles: {
						'bottom': '2.5em'
					}
                }).inject(insertdivID);
                                            
                tableButtons = UWA.createElement('table', {
                    'class' : 'applyResetTable',
                    'id' : 'applyResetTable',
                    'width' : '100%'
                }).inject(applyDiv);

                lineButtons = UWA.createElement('tr').inject(tableButtons);

                if (activateApplyBtn === true) {
                    buttonApplyCell = UWA.createElement('td', {
                        'width' : '50%',
                        'Align' : 'left'
                    }).inject(lineButtons);

                    applyBttn =  new Button({
                        className: 'primary',
                        id : 'applySettingsButton',
                        icon : 'export',         
                        attributes: {
                            disabled: false,
                            title: ENOStandardMgmtViewNLS.ApplyTooltipText,
                            text : ENOStandardMgmtViewNLS.ApplyText
                        },
                        events: {
                            onClick: function () {
                                applyParams();
                            }
                        }
                    }).inject(buttonApplyCell);
                    applyBttn.getContent().setStyle("width", 130);
                }

                buttonResetCell = UWA.createElement('td', {
                    'width' : '50%',
                    'Align' : 'right'
                }).inject(lineButtons);

                resetBbttn = new Button({
                    className: 'warning',
					id : 'resetSettingsButton',
                    icon: 'loop',
                    attributes: {
                        disabled: false,
                        title: ENOStandardMgmtViewNLS.ResetTooltipText,
                        text : ENOStandardMgmtViewNLS.ResetText
                    },
                    events: {
                        onClick: function () {                              
                            resetParams();
                        }
                    }
                }).inject(buttonResetCell);

                resetBbttn.getContent().setStyle("width", 130);
                return applyDiv;
            }        
            			
        };

        return UIview;
    });

define('DS/ENOStandardMgmtUIWeb/utils/AlertMessage', [
  'DS/UIKIT/Alert'
], function (Alert) {
  'use strict';

  return new Alert({
    className: 'param-alert',
    closable: true,
    visible: true,
    renderTo: document.body,
    autoHide: true,
    hideDelay: 3000,
    messageClassName: 'warning'
  });
});

/* global define, widget */

define('DS/ENOStandardMgmtUIWeb/utils/AJAXUtil', [
    'DS/WAFData/WAFData'
], function (
    WAFData
) {

    'use strict';

    var ajaxUtil = {

        // to handle AJAX call to server
        getFromServer: function (url, method, deployParams) {

            return new Promise((resolve, reject) => {
                UWA.log("AJAXUtil::getFromServer!");

                WAFData.authenticatedRequest(url, {
                    timeout: 250000,
                    method: method,
                    type: 'json',
                    // proxy: 'passport',
                    data: deployParams ? deployParams : undefined,

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Accept-Language': widget.lang
                    },

                    onFailure: function (error, textStatus) {
                        if (textStatus)
                            console.log("Error from server side: ", textStatus.errorMessage);
                        return reject(error);
                    },

                    onComplete: function (response) {
                        return resolve(response);
                    }
                });
            });
        }
    }

    return ajaxUtil;

});

/*global define*/
define('DS/ENOStandardMgmtUIWeb/Model/ENOMaturityChooserModel',
    [
       'DS/ENOStandardMgmtUIWeb/Model/ENOStandardMgmtModel'
    ], function (ENOStandardMgmtModel) {
        "use strict";
        return ENOStandardMgmtModel.extend({
            defaults: function() {
                return {
                    id: '',
					paramid:'',         // PartSupply, ToolBox, ContentCenter
					valueCollabSpaceFromDB:'',
                    valueCollabSpaceFromUI:'',
                    valueStateFromDB:'',
					valueStateFromUI:'',					
					deployStatus:''					
                };
            }
        });
    });

/*global define*/
define('DS/ENOStandardMgmtUIWeb/Model/ENOCollabSpaceChooserModel',
    [
       'DS/ENOStandardMgmtUIWeb/Model/ENOStandardMgmtModel'
    ], function (ENOStandardMgmtModel) {
        "use strict";
        return ENOStandardMgmtModel.extend({
            defaults: function() {
                return {
                    id: '',
					paramid:'',         // PartSupply, ToolBox, ContentCenter
					valueCollabSpaceFromDB:'',
                    valueCollabSpaceFromUI:'',
                    valueStateFromDB:'',
					valueStateFromUI:'',					
					deployStatus:''		
                };
            }
        });
    });

/* global define, integrationName, adminSettingNLS */

define('DS/ENOStandardMgmtUIWeb/utils/StandardSettingUtil', [
    'DS/ENOStandardMgmtUIWeb/utils/URLHandler',
    'DS/ENOStandardMgmtUIWeb/utils/AJAXUtil'
], function (
    URLHandler,
    AJAXUtil
) {

    'use strict';

    var standardSettingUtil = {

        // to get Standard Settings information
        getListOfAllowedObjects: function (settingType) {

            UWA.log("StandardSettingUtil::getListOfAllowedObjects!");
            return new Promise((resolve, reject) => {

                let URLService;
                if (settingType === "CollabSpace") {
                    URLService = "/resources/v1/StandardParameterization/getPublicCollabSpace";
                }
				else if (settingType === "AllCollabSpace") {
					URLService = "/resources/v1/StandardParameterization/getPublicCollabSpace?CSValue=AllCS" //ZNO: added @QueryParam for new setting on Standard Profile
				}
				
                else if (settingType === "State") {
                    URLService = "/resources/v1/StandardParameterization/getStates";
                }
                else {
                    UWA.log('ENOStandardSettingParamViewUtilities::getComboBoxListFromServer! unknown type:' + paramType);
                    return reject("Unknown type for standard setting " + settingType);
                }

                const url = URLHandler.getURL() + URLService /*+ "?tenant=" + URLHandler.getTenant()*/;
                //let datatoSend = "";

                AJAXUtil.getFromServer(url, 'GET').then(response => {

                    console.log('Response from StandardSetting web service:', response);
                    return resolve(response);

                }).catch(error => {

                    console.error('Failure in StandardSetting web service:', error);
                    return reject("Failed to retrieve list of standard setting for " + settingType);
                });
            });
        }
    }

    return standardSettingUtil;
});


/*global define, widget*/
var arrayOfCollabSpaceValues = [];
var arrayOfAllCollabSpaceValues = [];
var arrayOfStateValues = [];
//var collabSpaceComboBoxList = []; 
//var stateComboBoxList = []; 
const collabSpaceComboBoxMap = new Map();//transform collabSpaceComboBoxList to map
const stateComboBoxMap = new Map(); //transform stateComboBoxList to map


define('DS/ENOStandardMgmtUIWeb/Views/ENOStandardSettingParamViewUtilities',
	[
		'UWA/Core',
		'DS/Controls/ComboBox',
		'DS/UIKIT/Accordion',
		'DS/UIKIT/Popover',
		'DS/UIKIT/Modal',
		'DS/WAFData/WAFData',
		'DS/ENOStandardMgmtUIWeb/utils/URLHandler',
		'DS/ENOStandardMgmtUIWeb/utils/AlertMessage',
		'DS/ENOStandardMgmtUIWeb/utils/StandardSettingUtil',
		'i18n!DS/ENOStandardMgmtUIWeb/assets/nls/ENOStandardMgmtViewNLS'
	],
	function (UWA,
		WUXComboBox,
		Accordion,
		Popover,
		Modal,
		WAFData,
		URLHandler,
		AlertMessage,
		StandardSettingUtil,
		ENOStandardMgmtViewNLS) {

		'use strict';

		/**
		* This method is private.
		* It will update the comboBox by type - to reset value after reset button		
		* @param {String} inType as CollabSpace / State : to define the type of values to retrieve  
		* @param {model} paramModel data model that contains infromation about the parameter to control through this comboBox
		*/
		const UpdateComboBoxListByType = function (inType, paramModel) {
			//let comboList;  
			let comboMap;
			let keyname;
			
			if(inType === "CollabSpace"){
				//comboList = collabSpaceComboBoxList; //transform currentcontext to map
				comboMap=collabSpaceComboBoxMap;
				keyname="valueCollabSpaceFromUI";				
			}
			else if(inType === "State"){
				//comboList = stateComboBoxList;
				comboMap=stateComboBoxMap;
				keyname="valueStateFromUI";	
			}

			for (let i = 0; i < paramModel.length; i++)  {
				var Mymodel = paramModel[i];
				let mydefaultvalue=Mymodel.get(keyname);
				let currentcontext=Mymodel._attributes.contextid;
				let curComboBox=comboMap.get(currentcontext);
				if (curComboBox != null){
					if(curComboBox.value !== mydefaultvalue){
						curComboBox.value = mydefaultvalue;
					}
				}	
		 						
			}	
		/*	for (let curComboBox of comboList) {
				if(curComboBox.value !== defaultValue){
					curComboBox.value = defaultValue;
				}				 						
			}*/			
		}
		
		/**
		* This method is private.
		* It will retrieve the public CollabSpace and Maturity values that exist on the server
		* @param {String} paramType as CollabSpace / State : to define the type of values to retreive 		 
		*/
		const getComboBoxListFromServer = function (paramType) {

			return new Promise((resolve) => {
				let output = [];
				StandardSettingUtil.getListOfAllowedObjects(paramType).then(response => {
					UWA.log('ENOStandardSettingParamViewUtilities::getComboBoxListFromServer! response : ' + response);
					if (response && response.result) {
						if (paramType === "CollabSpace" || paramType === "AllCollabSpace") {
							UWA.log('ENOStandardSettingParamViewUtilities::getComboBoxListFromServer! for collabspace ');
							output = response.result.map(function (obj) { return obj['Name'] });
							if (output.length > 0){								
								if ( paramType === "CollabSpace")
									arrayOfCollabSpaceValues = output;
								else
									arrayOfAllCollabSpaceValues = output;
							}
						}
						else if (paramType === "State") {
							UWA.log('ENOStandardSettingParamViewUtilities::getComboBoxListFromServer! for State ');
							output = response.result.map(function (obj) { return obj['Name'] });
							if (output.length > 0)
								arrayOfStateValues = output;
						}
						else {
							output = [];
						}
					}
					else {
						UWA.log('response does not contain result element ' + response);
					}
					resolve(output);
				}).catch(error => {
					UWA.log('ENOStandardSettingParamViewUtilities::getComboBoxListFromServer! failed with error : ' + error);
					resolve(output);
				})
			});
		}

		/**
		 * This method is private.
		 * It will create the label case with his text and inject it into parentElement
		 * @param {String} text text to display as label
		 * @param {HTMLElement} parentElement parentElement to inject the case
		 */
		const createLabelCase = function (text, parentElement) {
			UWA.log('ENOStandardSettingParamViewUtilities::createLabelCase!');
			UWA.createElement('td', {
				width: '30%',
				align: 'left',
				'class': 'labels',
				html: text
			}).inject(parentElement);
		};

		/**
		 * This method is private.
		 * It will create an information case with information icon inside. At mouseover it will show a text as tooltip. 
		 * This will be injected into parentElement
		 * @param {String} text tooltip text
		 * @param {HTMLElement} parentElement parentElement to inject the case
		 */
		const createInformationCase = function (text, parentElement) {
			UWA.log('ENOStandardSettingParamViewUtilities::createInformationCase!');
			const informationCase = UWA.createElement('td', {
				'class': 'bubble-info',
				width: '10%',
				align: 'left'
			}).inject(parentElement);

			const informationIcon = UWA.createElement('span', { 'class': "fonticon fonticon-info" }).inject(informationCase);

			//Information tooltip 
			new Popover({
				target: informationIcon,
				trigger: "hover",
				animate: "true",
				position: "top",
				body: text,
				title: ''
			});
		};

		/**
		 * This method is private.
		 * It will create comboBox to set CollabSpace or State values. The comboBox is injected into parentElement
		 * It will call webServices for it depends of the type. 
		 * @param {model} paramModel data model that contains infromation about the parameter to control through this comboBox
		 * @param {HTMLElement} parentElement parentElement to inject comboBox inside
		 * @param {String} type Must be : CollabSpace / State
		 */
		const createComboBoxCase = async function (paramModel, parentElement, type) {
			UWA.log('ENOStandardSettingParamViewUtilities::createComboBoxCase!');
			const comboBoxCase = UWA.createElement('td', {
				'class': 'comboBoxCase',
				width: '60%',
				align: 'right'
			}).inject(parentElement);

			const comboBoxContainer = UWA.createElement('div', {
				'class': 'comboBoxContainer',
				width: '100%'
			}).inject(comboBoxCase);

			
				
			let comboBoxList = (type === "CollabSpace")? (paramModel._attributes['contextid']==="STANDARDPROFILE" ?arrayOfAllCollabSpaceValues:arrayOfCollabSpaceValues ): arrayOfStateValues;
			//let currentValue = (type === "CollabSpace")? paramModel['valueCollabSpaceFromDB'] :  paramModel['valueStateFromDB'];
			let currentValue = (type === "CollabSpace")? paramModel._attributes['valueCollabSpaceFromDB'] : paramModel._attributes['valueStateFromDB'];


			
			
			if(comboBoxList.length === 0){
				let typebis=type;
				if(paramModel._attributes['contextid']==="STANDARDPROFILE" && type==="CollabSpace")
					typebis="AllCollabSpace";
				
				comboBoxList = await getComboBoxListFromServer(typebis);					
			}
			
			// Manual populate in case ComboBox --- for test only 	
			/*
			if (comboBoxList.length == 0 && type === "CollabSpace")
				comboBoxList.push("Common Space", "3DS Collab Space");
			if (comboBoxList.length == 0 && type === "State")
				comboBoxList.push("PRIVATE","IN_WORK", "FROZEN", "RELEASED", "OBSOLETE");
			/**/
			
			
			const comboBoxId = paramModel._attributes['contextid'] + "_" + type; 
			const comboBox = new WUXComboBox({	
				//'id' : comboBoxId,  
				elementsList: comboBoxList,
				enableSearchFlag: false,
				actionOnClickFlag: false,
				value: currentValue
			}).inject(comboBoxContainer);

			// Need to store the comboBoxes to update their value after a reset...
			if (type === "CollabSpace"){
				//collabSpaceComboBoxList.push(comboBox);				
				collabSpaceComboBoxMap.set(paramModel._attributes['contextid'],comboBox);
			}
			else if(type === "State"){
				//stateComboBoxList.push(comboBox);
				stateComboBoxMap.set(paramModel._attributes['contextid'],comboBox);
			}

			comboBox.addEventListener('change', function () {
				if (type === "CollabSpace")
					paramModel.set('valueCollabSpaceFromUI', comboBox.value);
				else if (type === "State")
					paramModel.set('valueStateFromUI', comboBox.value);
			});
		};


		/**
		* This method is private.
		* This method creating a new Param component as an table row. It inject the component into the parentElement. 
		* @param {any} label This label will be display at first in the row. It must be like "Collab Space" for example.
		* @param {any} description This description will be display as tooltip in an information icon.
		* @param {any} parentElement The parentElement to inject the component
		* @param {any} type Must be : CollabSpace / State - It will create the component linked to the type.
		*/
		const createSettingComponent = function (paramModel, label, description, parentElement, paramType) {
			UWA.log('ENOStandardSettingParamViewUtilities::createSettingComponent!');
			createLabelCase(label, parentElement);
			createInformationCase(description, parentElement);
			createComboBoxCase(paramModel, parentElement, paramType);			
		};


		var UIview = {
			/*
			defaultOptions: {
				type: 'default',
				comboBoxInitialized: false,
				collabSpaceAllowedValues: [],
				aStateAllowedValues: []
			},*/

			createContentDiv: function () {
				UWA.log('ENOStandardSettingParamViewUtilities::createContentDiv!');
				var contentDiv = UWA.createElement('div', {
					'id': 'paramStandardSettingDiv'
				});
				let hght = widget.getViewportDimensions().height;
				contentDiv.setStyle('height', hght - 150 + 'px');
				contentDiv.setStyle('max-height', '150px');
				return contentDiv;
			},

			createParamMainDiv: function (parentDiv) {
				UWA.log('ENOStandardSettingParamViewUtilities::createParamMainDiv!');
				var paramMainDiv = UWA.createElement('div', {
					'id': 'paramMainDiv'
				}).inject(parentDiv);
				paramMainDiv.setStyle('height', "100%");
				return paramMainDiv;
			},

			createParamTable: function (parentDiv) {
				UWA.log('ENOStandardSettingParamViewUtilities::createParamTable!');
				var paramTable = UWA.createElement('table', {
					'class': 'table table-condensed'
				}).inject(parentDiv);
				return paramTable;
			},

			createParamTableBody: function (parentDiv) {
				UWA.log('ENOStandardSettingParamViewUtilities::createParamTableBody!');
				var paramTableBody = UWA.createElement('tbody', {
					'class': 'fparamtbody'
				}).inject(parentDiv);
				return paramTableBody;
			},

			createStandardSettingFamilyAccordion: function (paramModel, paramTable) {

				let accordTitle = "";
				if (paramModel._attributes.contextid === "PARTSUPPLY") {
					accordTitle = ENOStandardMgmtViewNLS.PartSupplyText;
				}
				else if (paramModel._attributes.contextid === "TOOLBOX") {
					accordTitle = ENOStandardMgmtViewNLS.ToolBoxText;
				}
				else if (paramModel._attributes.contextid === "CONTENTCENTER") {
					accordTitle = ENOStandardMgmtViewNLS.ContentCenterText;
				}
				else if (paramModel._attributes.contextid === "STANDARDPROFILE") {
					accordTitle = ENOStandardMgmtViewNLS.StandardProfileText;
				}
				else {
					accordTitle = 'Unknown setting family';
				}

				var iAccord = new Accordion({
					className: 'styled divided filled',
					exclusive: false,
					items: []
				});
				iAccord.addItem({
					title: accordTitle,
					content: paramTable,
					selected: true,
					name: "ConnectorOrderAccord"
				});
				return iAccord;
			},

			buildStandardSettingParamRow: function (paramType, paramModel, tableBody) {
				UWA.log('ENOStandardSettingParamViewUtilities::buildStandardSettingParamRow!');
				const that = this;

				const rowid = paramModel._attributes.contextid + paramType + "row";
				const standardSettingParamRow = UWA.createElement('tr', {
					'id': rowid,
					'class': 'StandardSettingRow',
				});

				if (paramType === "CollabSpace")
					createSettingComponent(
						paramModel,
						ENOStandardMgmtViewNLS.CollabSpaceText,
						ENOStandardMgmtViewNLS.CollabSpaceDescription,
						standardSettingParamRow,
						paramType
					);
				else if (paramType === "State") {
					createSettingComponent(
						paramModel,
						ENOStandardMgmtViewNLS.StateText,
						ENOStandardMgmtViewNLS.StateDescription,
						standardSettingParamRow,
						paramType
					);
				}
				else {
					UWA.log("Can not create row for setting with type unknown!!!!");
				}

				standardSettingParamRow.inject(tableBody);
			},

			updateViewWithDefaultValues: function (paramModel) {
				UpdateComboBoxListByType("CollabSpace", paramModel); 
				UpdateComboBoxListByType("State", paramModel);
			}, 

			/*resetStandardSettingParam: function (paramModel) {
				UWA.log('ENOStandardSettingParamViewUtilities::resetStandardSettingParam!');
				var that = this;
				let contextID = paramModel.get('contextid'); 
				let valueCollabSpaceFromUI = paramModel.get('valueCollabSpaceFromUI');
				let valueCollabSpaceFromDB = paramModel.get('valueCollabSpaceFromDB');
				let valueStateFromUI = paramModel.get('valueStateFromUI');
				let valueStateFromDB = paramModel.get('valueStateFromDB');

				if (valueCollabSpaceFromUI !== valueCollabSpaceFromDB)
				{
					const curBombo = getComboBoxByID(contextID, 'CollabSpace'); 
					curBombo.value = paramModel.get('defaultCollabSpace'); 
				}
				if (valueStateFromUI !== valueStateFromDB) {
					const curBombo = getComboBoxByID(contextID, 'State'); 
					curBombo.value = paramModel.get('defaultState'); 
				}
			},*/

			initializeComboBoxAllowedList: function () {
				/*
				UWA.log('ENOStandardSettingParamViewUtilities::initializeComboBoxAllowedList!');
				var that = this; 
				if(that.defaultOptions.comboBoxInitialized === false){
					that.defaultOptions.collabSpaceAllowedValues =  getComboBoxListFromServer("CollabSpace");
					that.stateAllowedValues =  getComboBoxListFromServer("State");
					that.defaultOptions.comboBoxInitialized = true; 
				}	*/
			}
		};

		return UIview;
	});

/*global define*/
define('DS/ENOStandardMgmtUIWeb/Model/ENOStandardSettingModel',
    [
        'DS/ENOStandardMgmtUIWeb/Model/ENOStandardMgmtModel'
    ], function (ENOStandardMgmtModel) {
        "use strict";
        return ENOStandardMgmtModel.extend({
            defaults: function() {
                return {
                    id: '',
					paramid:'',   				// StandardSetting     
					contextid:'',				// PARTSUPPLY, TOOLBOX, CONTENTCENTER
					valueCollabSpaceFromDB:'',
                    valueCollabSpaceFromUI:'',
                    valueStateFromDB:'',
					valueStateFromUI:'',
                    defaultCollabSpace:'',
                    defaultState:'',					
					deployStatus:''	
                };
            }
        });
    });

/*global define, widget*/
var defaultModel; 

define('DS/ENOStandardMgmtUIWeb/Collection/ENOStandardMgmtCollection', [
	'UWA/Core',
	'UWA/Class/Model',
	'UWA/Class/Collection',
	'DS/ENOStandardMgmtUIWeb/Model/ENOStandardMgmtModel',
	'DS/WAFData/WAFData',
	'DS/ENOStandardMgmtUIWeb/utils/URLHandler',
	'DS/ENOStandardMgmtUIWeb/Model/ENOStandardSettingModel'
], function (UWA, Model, Collection, ENOStandardMgmtModel, WAFData, URLHandler, ENOStandardSettingModel) {
	"use strict";
	
	/**
	 * This method is private.
	 * It will read the standard setting from a context and will add it to params
	 * @param {JSON} data Json object containing CollabSpace and State 
	 * @param {String} contextid ContextID as (PARTSUPPLY, TOOLBOX, or CONTENTCENTER) 
	 * @param {Array} paramEntries array of parameters to add parameter inside
	 */
	const parseStandardSetting = function (data, contextid, paramEntries) {
		var paramDomainId="StandardMgmtConfiguration"; 
		var paramId = "StandardSetting";
		var paramValueCollabSpaceFromDB = data.CollabSpace;
		var paramValueStateFromDB = data.State;
		var paramContextid = contextid;
		var paramDeploySatus = (paramValueCollabSpaceFromDB.length > 0) ? 'Deployed' : 'NotDeployed';
		
		paramEntries.push({
			valueCollabSpaceFromDB: paramValueCollabSpaceFromDB,
			valueCollabSpaceFromUI: paramValueCollabSpaceFromDB,
			valueStateFromDB: paramValueStateFromDB,
			valueStateFromUI: paramValueStateFromDB,
			deployStatus: paramDeploySatus,
			contextid: paramContextid,
			domainid: paramDomainId,
			paramid: paramId,
			id: paramId, 
			defaultCollabSpace:defaultModel.CollabSpace, 
			defaultState:defaultModel.State, 

		});
	};

	var ENOStandardMgmtCollection = Collection.extend({

		model: function (attrs, options) {
			UWA.log('ENOStandardMgmtCollection::model!');
			if (attrs.paramid === "StandardSetting") {
				UWA.log('ENOStandardMgmtCollection::model::ENOStandardSettingModel created!');
				return new ENOStandardSettingModel(attrs, options);
			}
			else {
				return new ENOStandardMgmtModel(attrs, options);
			}
		},

		setup: function (models, options) {
			UWA.log('ENOStandardMgmtCollection::setup!');
			UWA.log(options);
			URLHandler.setTenant(options.tenant);
			URLHandler.setURL(options.baseUrl);

			this.childCollection = null;
			//this.url = URLHandler.getURL() + "/resources/v1/StandardParameterization/getAdminStandardProperties?tenant=" + URLHandler.getTenant();
			this.url = URLHandler.getURL() + "/resources/v1/StandardParameterization/getAdminStandardProperties";
		},

		sync: function (method, model, options) {
			UWA.log("ENOStandardMgmtCollection::sync!");

			options.headers = {
				Accept: 'application/json',
				'Accept-Language': widget.lang
			};

			options = Object.assign({
				ajax: WAFData.authenticatedRequest
			}, options);

			this._parent.apply(this, [method, model, options]);
		},


		parse: function (data) {
			UWA.log("ENOStandardMgmtCollection::parse!" );
			var paramEntries = [];

			var paramDomainId = "StandardMgmtConfiguration";		

			if (data.DEFAULT) {
				UWA.log("ENOStandardMgmtCollection::parse Default!");
				defaultModel = data.DEFAULT; 				
			}
			if (data.PARTSUPPLY) {
				UWA.log("ENOStandardMgmtCollection::parse PARTSUPPLY!");
				parseStandardSetting(data.PARTSUPPLY, "PARTSUPPLY", paramEntries);
			}
			if (data.TOOLBOX) {
				UWA.log("ENOStandardMgmtCollection::parse TOOLBOX!");
				parseStandardSetting(data.TOOLBOX, "TOOLBOX", paramEntries);
			}
			if (data.CONTENTCENTER) {
				UWA.log("ENOStandardMgmtCollection::parse CONTENTCENTER!");
				parseStandardSetting(data.CONTENTCENTER, "CONTENTCENTER", paramEntries);
			}
			if (data.STANDARDPROFILE) {
				UWA.log("ENOStandardMgmtCollection::parse STANDARDPROFILE!");
				parseStandardSetting(data.STANDARDPROFILE, "STANDARDPROFILE", paramEntries);
			}
			return paramEntries;
		},

		create: function (attributes, options) {
			UWA.log("ENOStandardMgmtCollection::create!");
			options.proxy = 'passport';
			this._parent.apply(this, [attributes, options]);
		}

	});

	return ENOStandardMgmtCollection;
});

/*global define*/
define('DS/ENOStandardMgmtUIWeb/Views/ENOStandardSettingParamView',
    [
        'UWA/Core',
        'UWA/Class/View',
        'DS/UIKIT/Modal',
		'DS/UIKIT/Scroller',
		'DS/ENOStandardMgmtUIWeb/Views/ENOStandardSettingParamViewUtilities'		
    ],
    function (UWA,
			  View,
              Modal,
			  Scroller,			  
			  ENOStandardSettingParamViewUtilities) {

        'use strict';

        var extendedView;

        extendedView = View.extend({
            tagName: 'div',
            className: 'generic-detail',

            init: function (options) {
				UWA.log('ENOStandardSettingParamView::init!');
                var initDate =  new Date();

                options = UWA.clone(options || {}, false);
                this._parent(options);
                this.contentDiv = null;
				this.paramScroller = null;
				this.paramMainDIV = null;				
            },

            setup: function(options) {
                UWA.log('ENOStandardSettingParamView::setup!');
                UWA.log(options);
				const that = this;
				
				that.listenTo(
					that.model,
					'onChange:valueCollabSpaceFromUI',
					that.valueOnChangeHandler
				);

				that.listenTo(
					that.model,
					'onChange:valueStateFromUI',
					that.valueOnChangeHandler
				);

				that.listenTo(
					that.model,
					'onChange:deployStatus',
					that.deployStatusOnChangeHandler
				);				
            },

			valueOnChangeHandler: function (model, options) {
				UWA.log('ENOStandardSettingParamView::valueOnChangeHandler!');
				const that = this;

				if (options) {
					let valueCollabSpaceFromDB = model.get('valueCollabSpaceFromDB');
					let valueStateFromDB = model.get('valueStateFromDB');
					if(valueCollabSpaceFromDB.length > 0 || valueStateFromDB.length > 0){
						model.set('deployStatus', 'NewNotDeployed');
					}else{
						model.set('deployStatus', 'NotDeployed');
					}
				} else {
					model.set('deployStatus', 'InvalidValueCanNotDeploy');
				}
			},
	
			deployStatusOnChangeHandler: function (model, options) {
				UWA.log('ENOStandardSettingParamView::deployStatusOnChangeHandler!');
				const that = this;
				/*ENOStandardSettingParamViewUtilities.cellParamDeployStatus.innerHTML = '';
				ENOStandardSettingParamViewUtilities.buildDeployStatusCell(options).inject(
					ENOStandardSettingParamViewUtilities.cellParamDeployStatus
				);
				if(options === 'Deployed'){
					ENOStandardSettingParamViewUtilities.cellParamActions.innerHTML = '';
					ENOStandardSettingParamViewUtilities.createDeleteActionsIcon(model, ENOStandardSettingParamViewUtilities.cellParamActions);
				}else if(options === 'NotDeployed'){
					ENOStandardSettingParamViewUtilities.cellParamActions.innerHTML = '';
				}*/
			},

            render: function () {
                UWA.log("ENOStandardSettingParamView::render!");

                var that = this;
														
                this.contentDiv = ENOStandardSettingParamViewUtilities.createContentDiv();
					
                this.paramMainDIV = ENOStandardSettingParamViewUtilities.createParamMainDiv(this.contentDiv);											
				widget.addEvent('onResize', function () {
					let hght = widget.getViewportDimensions().height;
					that.contentDiv.setStyle('height', hght - 210 + 'px');
				});						

				const paramTable = ENOStandardSettingParamViewUtilities.createParamTable(this.paramMainDIV);
				const paramTableBody = ENOStandardSettingParamViewUtilities.createParamTableBody(paramTable);

				var  paramTypes=null;
				if(that.model._attributes.contextid==="STANDARDPROFILE"){
						paramTypes = ["CollabSpace"]; 
				}
				else{	
						paramTypes = ["CollabSpace", "State"]; 
				}				
				paramTypes.forEach(paramType => {
					ENOStandardSettingParamViewUtilities.buildStandardSettingParamRow(paramType, this.model, paramTableBody);
				});

				const accord = ENOStandardSettingParamViewUtilities.createStandardSettingFamilyAccordion(this.model, paramTable);								
				accord.inject(this.paramMainDIV);

                /*this.paramScroller = new Scroller({
                    element:this.paramMainDIV
                }).inject(this.contentDiv);*/
				
                that.container.setContent(this.contentDiv);
			
                return that;
            },

            onCompleteRequestParameters : function() {
                UWA.log("ENOStandardSettingParamView::onCompleteRequestParameters!");
            },			

            destroy : function() {
                this.stopListening();
                this._parent.apply(this, arguments);
            }

        });

        return extendedView;
    });

/*global define*/
define('DS/ENOStandardMgmtUIWeb/Views/ENOStandardMgmtView',
    [
        'UWA/Core',
        'UWA/Class/View',
        //'DS/UIKIT/Modal',
		//'DS/UIKIT/Accordion',
		'DS/UIKIT/Scroller',
        'DS/UIKIT/Mask',
		'DS/ENOStandardMgmtUIWeb/Views/ENOStandardSettingParamView',
		'DS/ENOStandardMgmtUIWeb/Views/ENOStandardSettingParamViewUtilities',
		'DS/ENOStandardMgmtUIWeb/Views/ENOStandardMgmtViewUtilities',
		'DS/WAFData/WAFData',
		'DS/ENOStandardMgmtUIWeb/utils/URLHandler',
		'DS/ENOStandardMgmtUIWeb/utils/AlertMessage',
		'DS/ENOStandardMgmtUIWeb/utils/AJAXUtil',
		'i18n!DS/ENOStandardMgmtUIWeb/assets/nls/ENOStandardMgmtViewNLS'
    ],
    function (UWA,
			  View,
              //Modal,
			  //Accordion,
			  Scroller,
			  Mask,
			  ENOStandardSettingParamView, 
			  ENOStandardSettingParamViewUtilities, 
			  ENOStandardMgmtViewUtilities,
			  WAFData,
			  URLHandler,
			  AlertMessage,
			  AJAXUtil,
			  ENOStandardMgmtViewNLS) {

        'use strict';
		
        var extendedView;

        extendedView = View.extend({
			id: 'standardMgmtView',
            tagName: 'div',
            className: 'generic-detail',

            init: function (options) {
				UWA.log('ENOStandardMgmtView::init!');
                var initDate =  new Date();

                options = UWA.clone(options || {}, false);
                this._parent(options);

				this.contentScroller = null;
                this.contentDiv = null;
				this.applyResetDiv = null;
            },

            setup: function(options) {
                UWA.log('ENOStandardMgmtView::setup!');
                UWA.log(options);
            },	

            render: function () {
                UWA.log("ENOStandardMgmtView::render!");
				
                const that = this;

				Mask.mask(that.container);

				//Create Info Div
				const infoDiv = ENOStandardMgmtViewUtilities.createInfoDiv(that.container);

				// Create content Div 
                that.contentDiv = ENOStandardMgmtViewUtilities.createContentDiv();
				that.contentDiv.inject(that.container);

                //Mask.mask(that.contentDiv); // no need as that.container is masked already 
				// Set height of content div on resize event of widget				
				widget.addEvent('onResize', function () {
					const widgetHeight = widget.getViewportDimensions().height;
					that.contentDiv.setStyle('height', widgetHeight - 170 + 'px');
				});	                
				
				// Collection onSync event
				this.listenTo(that.collection, {
					onSync: that.onCompleteRequestParameters
				});	

				//Mask.unmask(that.contentDiv);
                return that;
            },

            onCompleteRequestParameters : function() {
                UWA.log("ENOStandardMgmtView::onCompleteRequestParameters!");
				const that = this;
				ENOStandardSettingParamViewUtilities.initializeComboBoxAllowedList(); 				
				for (let i = 0; i < this.collection._models.length; i++) {
					var paramModel = this.collection._models[i];
					if(paramModel._attributes.paramid === "StandardSetting" ){
						new ENOStandardSettingParamView({model: paramModel}).render().container.inject(that.contentDiv);						
					}				
				}

				this.contentScroller = new Scroller({
                    element:that.contentDiv
                }).inject(that.container);

				that.applyResetDiv = ENOStandardMgmtViewUtilities.createApplyResetToolbar.call(that, that.container, true,
					that.applyCommonSettingParams.bind(that), that.resetCommonSettingParamsInSession.bind(that));	

				Mask.unmask(that.container);							
            },

            resetCommonSettingParamsInSession : function () {				
				UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession!");
				var that = this;
				Mask.mask(this.contentDiv);

				var url = URLHandler.getURL() + "/resources/v1/StandardParameterization/resetAdminStandardProperties"; //?tenant" + URLHandler.getTenant();
				/* */
				AJAXUtil.getFromServer(url, 'GET').then(response => {

					UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onComplete!");
					that.onResetSuccess.call(that, response);
                }).catch(error => {

					UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onFailure!");
					that.onResetFailure.call(that, error);
                });/**/

				/* * /
				let datatoSend = "";
				WAFData.authenticatedRequest(url, {
					timeout: 100000,
					method: 'GET',
					data: JSON.stringify(datatoSend),
					type: 'json',
					//proxy: 'passport',

					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Accept-Language': widget.lang
					},

					onFailure: function (json) {
						UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onFailure!");
						that.onResetFailure.call(that, json);						
					},

					onComplete: function (json) {
						UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onComplete!");
						that.onResetSuccess.call(that, json);				
					}
				});	
				/**/
				Mask.unmask(this.contentDiv);
            },

			applyCommonSettingParams: function () {
				var that = this;
				UWA.log("ENOStandardMgmtView::applyCommonSettingParams!");

				let datatoSend = {};
				for (let i = 0; i < this.collection._models.length; i++) {
					var paramModel = this.collection._models[i];
					if (paramModel._attributes.paramid === "StandardSetting") {
						let valueCollabSpaceFromUI = paramModel.get('valueCollabSpaceFromUI');
						let valueCollabSpaceFromDB = paramModel.get('valueCollabSpaceFromDB');
						let valueStateFromDB = paramModel.get('valueStateFromDB');
						let valueStateFromUI = paramModel.get('valueStateFromUI');
						if (valueCollabSpaceFromUI !== valueCollabSpaceFromDB
							|| valueStateFromUI !== valueStateFromDB) {
							datatoSend[paramModel._attributes.contextid] = {
								"CollabSpace": valueCollabSpaceFromUI.toString(),
								"State": valueStateFromUI.toString()
							};
						}
					}
				}
				
				if(Object.keys(datatoSend).length !== 0){
					Mask.mask(this.contentDiv);
					var url = URLHandler.getURL() + "/resources/v1/StandardParameterization/setAdminStandardProperties"; //?tenant" + URLHandler.getTenant();

					/**/ 
					AJAXUtil.getFromServer(url, 'POST', JSON.stringify(datatoSend)).then(response => {
	
						UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onComplete!");
						that.onApplySuccess.call(that, response);
					}).catch(error => {
						
						UWA.log("ENOStandardMgmtView::resetCommonSettingParamsInSession onFailure!");
						that.onApplyFailure.call(that,error);
					});/**/
				}				
				
            },

			onApplyFailure : function (json) {
				UWA.log("ENOStandardMgmtView::onApplyFailure!");
				Mask.unmask(this.contentDiv);
				AlertMessage.add({ className: "error", message: ENOStandardMgmtViewNLS.applyErrorMessage });
			},

			onApplySuccess : function (json) {		
				UWA.log("ENOStandardMgmtView::onApplySuccess!");		
				for (let i = 0; i < this.collection._models.length; i++) {
					var paramModel = this.collection._models[i];
					if(paramModel._attributes.paramid === "StandardSetting"){
						let valueCollabSpaceFromUI = paramModel.get('valueCollabSpaceFromUI');
						let valueCollabSpaceFromDB = paramModel.get('valueCollabSpaceFromDB');
						let valueStateFromDB = paramModel.get('valueStateFromDB');
						let valueStateFromUI = paramModel.get('valueStateFromUI');
						if(valueCollabSpaceFromUI !== valueCollabSpaceFromDB ||valueStateFromUI !== valueStateFromDB ){				
							paramModel.set('valueCollabSpaceFromDB', valueCollabSpaceFromUI);
							paramModel.set('valueStateFromDB', valueStateFromUI);
							paramModel.set('deployStatus', 'Deployed');							
						}
					}
				}				
				
				Mask.unmask(this.contentDiv);
				AlertMessage.add({ className: "success", message: ENOStandardMgmtViewNLS.applySuccessMessage });
			},

			onResetFailure : function (json) {
				UWA.log("ENOStandardMgmtView::onResetFailure!");
				Mask.unmask(this.contentDiv);
				AlertMessage.add({ className: "error", message: ENOStandardMgmtViewNLS.resetErrorMessage });
			},

			onResetSuccess : function (json) {	
				UWA.log("ENOStandardMgmtView::onResetSuccess!");	
				let toUpdateView = false;
				let paramModel = this.collection._models;
				for (let i = 0; i < this.collection._models.length; i++) {
					//var paramModel = this.collection._models[i];
					let currmodel=paramModel[i];
					var jsonCollabSpace;
					var jsonState;
					const jsonString = JSON.stringify(json);
					const data = JSON.parse(jsonString);

					let Mycontext=currmodel._attributes.contextid;
					jsonCollabSpace=data[Mycontext].CollabSpace;
					jsonState=data[Mycontext].State;
					
					if(currmodel._attributes.paramid === "StandardSetting"){
						//if(currmodel.get('valueCollabSpaceFromUI') !== currmodel.get('defaultCollabSpace') 
						//|| currmodel.get('valueStateFromUI') !== currmodel.get('defaultState')){
							//paramModel.set('valueCollabSpaceFromUI', paramModel._attributes.defaultCollabSpace);
							//paramModel.set('valueStateFromUI', paramModel._attributes.defaultState);
							if( currmodel.get('valueCollabSpaceFromUI') !== jsonCollabSpace 
							|| currmodel.get('valueStateFromUI') !== jsonState ){
							currmodel.set('valueCollabSpaceFromUI', jsonCollabSpace);
							currmodel.set('valueStateFromUI', jsonState);
							currmodel.set('deployStatus', 'Deployed');	
							toUpdateView = true; 
						}						
					}
				}				
				/* Update Param View after reset */
				if(toUpdateView === true){
					/*const defaultModel = {
						CollabSpace:this.collection._models[0]._attributes.defaultCollabSpace, 
						State:this.collection._models[0]._attributes.defaultState
					}; 	*/
					//ENOStandardSettingParamViewUtilities.updateViewWithDefaultValues(defaultModel);
					ENOStandardSettingParamViewUtilities.updateViewWithDefaultValues( paramModel);
				}			
				else
				{
					AlertMessage.add({ className: "success", message: ENOStandardMgmtViewNLS.resetIgnoreMessage });
				}
		
				/*
				for (let i = 0; i < this.collection._models.length; i++) {
					var paramModel = this.collection._models[i];
					if (paramModel._attributes.paramid === "StandardSetting") {
						ENOStandardSettingParamViewUtilities.resetStandardSettingParam(paramModel);
					}
				}*/

				Mask.unmask(this.contentDiv);
				AlertMessage.add({ className: "success", message: ENOStandardMgmtViewNLS.resetSuccessMessage });
			},
			
            destroy : function() {
                this.stopListening();
                this._parent.apply(this, arguments);
            }

        });

        return extendedView;
    });


/*global define, widget*/
define('DS/ENOStandardMgmtUIWeb/Views/ENOStandardMgmtLayoutView',
    [
        'UWA/Core',
        'UWA/Class/View',
        'DS/ENOStandardMgmtUIWeb/Views/ENOStandardMgmtView'
    ], function (UWA, View, ENOStandardMgmtView) {

        'use strict';

        return View.extend({

            defaultOptions: {
                type: 'default'
            },

            init : function (options) {
                UWA.log("ENOStandardMgmtLayoutView::init!");
                UWA.log(options);
                this.options = options;
                this.childView = null;
            },

            render: function () {
				UWA.log("ENOStandardMgmtLayoutView::render!");
                var options = this.options;
				var standardMgmtView = new ENOStandardMgmtView(options);
				this.childView = standardMgmtView;
				return standardMgmtView.render();
            },

            destroy : function() {
				UWA.log("ENOStandardMgmtLayoutView::destroy!");
                this.childView.destroy();
                this.stopListening();
                this._parent.apply(this, arguments);
            }
        });
    });

