define('DS/PCsBulkViewPresenter/js/Utils/PCsBulkViewPresenterUtils',[
    'UWA/Core',
    'DS/ConfiguratorPanel/scripts/Models/ConfiguratorVariables'
],function(
    UWA,
    ConfiguratorVariables
){
    'use strict';
    var PCsBulkViewPresenterUtils = {};
    /**
        * convert from jsonModel format to solver format before sending to solver
        * @param {Object} columnData from json model
        * @param {boolean} allcriteria check all or only selected
        * @param {string} baseConfigurationId  id of the parent baseConfiguration
        * @returns {Object}
        */
    PCsBulkViewPresenterUtils.buildSolverInputFormat = function(columnData, allcriteria, baseConfigurationId) {
        var solverInputData;
        if (columnData && columnData.size > 0) {
            var configurationCriteria = [];
            columnData.forEach((cellData, criteriaId) => {
                if(( allcriteria && ['Chosen','Selected','Default', 'Dismissed'].includes(cellData.status) )
                        || (!allcriteria && ['Chosen','Dismissed'].includes(cellData.status)) ) {

                    configurationCriteria.push(this.createCellDataInSolverFormat(criteriaId, cellData));
                }                
                           
            });            
            if(baseConfigurationId) {
                configurationCriteria.push({
                    Criterion: baseConfigurationId,
                    State: 'Chosen'
                });
            }
            solverInputData = {
                'configurationCriteria': configurationCriteria
            };
        }
        return solverInputData;
    };

     /**
       * convert from jsonModel format to solver format after sending the solver request
       * @param {*} columnData from json model
       * @param {boolean} saveDone flag to update the persistancy format of the parameter
       * @returns {Object}
       */
      PCsBulkViewPresenterUtils.buildPersistencyInputFormat = function(columnData) {
        var configurationCriteria = [];
        if (columnData && columnData.size > 0) {
            columnData.forEach( (cellData, id) => {
                if( UWA.is(cellData.numericalValue, 'number')   ) {
                    var value = cellData.numericalValue + "";
                    if(cellData.unit !== ""){
                        value += ' ' + cellData.unit;
                    }
                    configurationCriteria.push({
                        'id': id,
                        'value': value,
                        'status': ConfiguratorVariables.Chosen
                    });
                }else if (cellData.values){
                    let selecetedValues = PCsBulkViewPresenterUtils.buildSelectedValues(cellData);
                    selecetedValues.forEach( (id) => {
                        configurationCriteria.push({
                            'id': id,
                            'status': ConfiguratorVariables.Chosen
                        });
                    }); 
                }
            });
        }
        return configurationCriteria;
    };

    PCsBulkViewPresenterUtils.fromStateToStatus = function(state) {
        var status = "";

        if (state === 'C') {
            status = ConfiguratorVariables.Chosen;
        }else if (state === 'S') {
            status = ConfiguratorVariables.Selected;
        } else if (state === 'I') {
            status = ConfiguratorVariables.Incompatible;
        } else if (state === 'D') {
            status = ConfiguratorVariables.Default;
        } else if (state === 'R') {
            status = ConfiguratorVariables.Required;
        } else if(state === 'M'){
            status = ConfiguratorVariables.Dismissed;
        }else {
            status = ConfiguratorVariables.Unselected;
        }
        return status;
    };

    PCsBulkViewPresenterUtils.buildSelectedValues = function(cellData, variabilityValueMap) {
        var criteria = [];
        var values = cellData.values;        
        values.forEach((value, id) => {
            if(value.status === ConfiguratorVariables.Chosen || 
                value.status === ConfiguratorVariables.Selected || 
                value.status === ConfiguratorVariables.Required || 
                value.status === ConfiguratorVariables.Default){
                    if(UWA.is(variabilityValueMap) && variabilityValueMap.get(id)) {
                        criteria.push({ ...value, ...variabilityValueMap.get(id) });
                    }else 
                        criteria.push(id);
                }
                
        });
        return criteria;
    };


    PCsBulkViewPresenterUtils.buildAllValues = function(cellData, variabilityValueMap, isValueRequired, forceChosen) {
        var dropdownValues = [];
        var values = cellData.values;        
        values.forEach((value, id) => {           
            let dropdownValue =  { ...value, ...variabilityValueMap.get(id) };
            dropdownValue.state = forceChosen && value.status === ConfiguratorVariables.Selected ? ConfiguratorVariables.Chosen : value.status;
            dropdownValue.conflict = value.stateValidity === 'C';
            dropdownValue.selectable = value.status && value.status !== ConfiguratorVariables.Incompatible;
            dropdownValue.rejectable = !isValueRequired && (value.status !== ConfiguratorVariables.Required);
            dropdownValue.validate = !forceChosen && [ConfiguratorVariables.Selected, ConfiguratorVariables.Default].includes(value.status);
            dropdownValues.push(dropdownValue);
        });
        return dropdownValues;
    };

    PCsBulkViewPresenterUtils.clearSelection = function(cellData) { 
        
        let clear= function(data) {
            if(data.status === ConfiguratorVariables.Default)
                data.status = ConfiguratorVariables.Dismissed;
            else if (data.status === ConfiguratorVariables.Chosen)
                data.status = ConfiguratorVariables.Available;
        };
        clear(cellData);

        if(UWA.is(cellData.values,'array'))
            cellData.values.forEach((value) => {
                clear(value);
            });
    };

    PCsBulkViewPresenterUtils.setNumericalValue = function(cellData, value) {
        cellData.numericalValue = value;
        cellData.status = ConfiguratorVariables.Chosen;
    };

    PCsBulkViewPresenterUtils.setChosenValues = function(cellData, values) {
        cellData.values.forEach((cellValue, id) => {            
            if(!values.includes(id)) {
                if(cellValue.status === ConfiguratorVariables.Selected || cellValue.status === ConfiguratorVariables.Default) {
                    cellValue.status = ConfiguratorVariables.Dismissed;
                } else if(cellValue.status === ConfiguratorVariables.Chosen){
                    cellValue.status = ConfiguratorVariables.Unselected;
                }
            }else if (values.includes(id) )  {
                cellValue.status = ConfiguratorVariables.Chosen;
            }        
        });
    };



    PCsBulkViewPresenterUtils.createCellDataInSolverFormat = function( id, cellData){
        var solverData = {};
        var Value = undefined;
        var IdCriterion = "";
        if(cellData.Criterion){
            if(UWA.is(cellData.Value,"boolean")){ // For options
                IdCriterion = id;
                Value = cellData.Value;
            }
            else if(UWA.is(cellData.numericalValue)){ // For parameters
                Value = cellData.numericalValue;
                IdCriterion = id;
            }
            else{ // For variant values
                IdCriterion = cellData.Criterion;
                Value = id;
            }
        }
        solverData = {
            'Criterion': IdCriterion,
            'Value': Value,
            'State': cellData.status
        };
        return solverData;
    };

    /**
       * convert the format of pc content to jsonmodel format
       * @param {Object} receivedData
       * @param {Object} variabilityValuesMap
       * @returns {cellObj} in json model format
       */
    PCsBulkViewPresenterUtils.buildJsonModelFormatForLoadedData = function(receivedData, variabilityValuesMap) {
        var cellObj = {};
        if (receivedData && receivedData.id) {
            if (variabilityValuesMap[receivedData.id]) {
                var variabilityValue = variabilityValuesMap[receivedData.id].variabilityValue;
                var rowID = variabilityValuesMap[receivedData.id].rowID;
                var type = variabilityValue.type;
                var image = variabilityValue.image;
                if (variabilityValue && rowID >= 0) {
                    cellObj.id = variabilityValue.id;
                    cellObj.rowID = rowID;
                    cellObj.type = type;
                    cellObj.image = image;
                    cellObj.state = this.convertCriteriaStateFormat(receivedData.status);
                    cellObj.stateValidity = variabilityValue.stateValidity;
                    if (receivedData.value) {
                        // value can return 
                        var valueformat = receivedData.value.split(' ');
                        if(valueformat.length > 0) 
                            cellObj.unit = valueformat[1];
                        else 
                            cellObj.unit = undefined;
                        cellObj.numericalValue =  parseInt(valueformat[0]);
                    
                    } else if (receivedData.status) {
                        cellObj.title = variabilityValue.title;
                    }
                }
            }
        }
        return cellObj;
    };

    /**
       * Convert solver State from solver format to jsonmodel format
       * @param {*} status
       * @returns {String} new state
       */
     PCsBulkViewPresenterUtils.convertCriteriaStateFormat = function(status) {
        var state;
        switch (status) {
            case ConfiguratorVariables.Chosen:
                state = 'C';
                break;
            case ConfiguratorVariables.Default:
                state = 'D';
                break;
            case ConfiguratorVariables.Required:
                state = 'R';
                break;
            case ConfiguratorVariables.Selected:
                state = 'S';
                break;
            case ConfiguratorVariables.Incompatible:
                state = 'I';
                break;
            case ConfiguratorVariables.Dismissed:
                state = 'M';
                break;
            default:
                state = 'U'; // for 'Unselected' if Config criteria is empty
                break;
        }
        return state;
    };

    // converts the solver configuration criteria to json model list
      // idList will filter the criteria if not undefined
      PCsBulkViewPresenterUtils.applySolverConfiguration = function (cellData, configurationCriteria, configurationCriteriaType, configCriteriaMap) {
        if(!UWA.is(cellData)) return;
        var criteriaId = "";
        if(UWA.is(configurationCriteriaType)){
            var Value = undefined;
            if(configurationCriteriaType === "Value"){
                criteriaId = configurationCriteria.Value;
                cellData.Criterion = configurationCriteria.Criterion;
            }else if(configurationCriteriaType === "Option" || configurationCriteriaType === "Parameter"){
                criteriaId = configurationCriteria.Criterion;
                Value = configurationCriteria.Value;
                if(UWA.is(Value,'number')) {
                    cellData.numericalValue = Value;
                }
                else if(UWA.is(Value,'boolean')){
                    cellData.Value = Value;
                }
            }
        }else{
            criteriaId = configurationCriteria.Id;
        }
        var criteriaState = configurationCriteria.State;
        var minValue = configurationCriteria.ValueMin;
        var maxValue = configurationCriteria.ValueMax;
        var unit = configurationCriteria.unit;
        if(configCriteriaMap && configCriteriaMap[criteriaId]){
            cellData.stateValidity = 'C';
        }else{
            cellData.stateValidity = 'V'; // valid state by default
        }
        
        if (criteriaState) {
            cellData.status = criteriaState;
        }
        if(UWA.is(minValue,'number') && UWA.is(maxValue,'number')) {
            cellData.minValue = minValue;
            cellData.maxValue = maxValue;
        }
        if(UWA.is(unit,'string')) {
            cellData.unit = unit;
        }

    };

    return PCsBulkViewPresenterUtils;
});

define('DS/PCsBulkViewPresenter/js/PCsBulkViewPresenter', [
    'UWA/Core',
    'DS/WAFData/WAFData',
    'DS/i3DXCompassServices/i3DXCompassServices',
    'DS/CoreEvents/ModelEvents',
    'DS/UIKIT/Mask',
    'DS/ENOXNotificationsUtil/ENOXNotificationUtil',
    'DS/xModelEventManager/xModelEventManager',
    'DS/CfgBulkTablePresenter/BulkEdition/Presenter/BulkTablePresenter',
    'DS/PCsBulkViewPresenter/js/Utils/PCsBulkViewPresenterUtils',
    'DS/CfgBulkTablePresenter/BulkEdition/Model/BulkTableModel',
    'DS/ConfiguratorPanel/scripts/Models/ConfiguratorModel',
    'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionEditor',
    'DS/ConfiguratorPanel/scripts/Presenters/CriteriaSelectionView',
    'DS/ConfiguratorPanel/scripts/Presenters/NumericalSelectionEditor',
    'i18n!DS/PCsBulkViewPresenter/assets/nls/PCsBulkViewPresenter',
    'i18n!DS/CfgBulkTablePresenter/assets/nls/BulkTablePresenter',
    'css!DS/PCsBulkViewPresenter/css/PCsBulkViewPresenter.css'
], function (
    UWA,
    WAFData,
    i3DXCompassServices,
    ModelEvents,
    Mask,
    xNotificationsUtil,
    xModelEventManager,
    BulkTablePresenter,
    PCsBulkViewPresenterUtils,
    BulkTableModel,
    ConfiguratorModel,
    CriteriaSelectionEditor,
    CriteriaSelectionView,
    NumericalSelectionEditor,
    _NLS_PCsBulkViewPresenter,
    _NLS_BulkTablePresenter
    ) {
    'use strict';

    var COLUMN_ID_INDEX = 4;
    var CONSTANT_GET_CRITERIA_CONFIGURATION_INSTANCE = 'getCriteriaConfigurationInstances';
    var INVOKE_SERVICE = 'dspfl/invoke/dspfl:';
    var RESOURCE_WS_URL = '/resources/v1/modeler/';
    var STR_SERVICE_NAME = "3DSpace";
    var PCsBulkViewPresenter = BulkTablePresenter.extend({
        init: function (options) {
            if (!options) {
                options = {};
            }
            this._modelId = options.modelId;
            this._privateChannel = new ModelEvents();
            this._mapBCsSelectedCriteria = {};
            this._applicationChannel = options.applicationChannel || new ModelEvents();
            this._privateChannelForRules = options.privateChannelForRules || new ModelEvents();
            this._withSolver = UWA.is(options.withSolver, 'boolean') ? options.withSolver : true;
            this._withStatusComputing = this._withSolver;
            this._withSuggestionComputing = false;
            this._modelMaturity = '';
            if (!UWA.is(options.showEditAction, 'boolean')) {
                options.showEditAction = true;
            }
            if (!UWA.is(options.showCompareAction, 'boolean')) {
                options.showCompareAction = true;
            }
            this._solverKey = '';
            this._loadedPCs = {};
            this._pauseCheckConflictCall = false;
            this._arrayColumnIDsToCheck = [];
            this._arrayColumnIDsChecked = [];
            this._bufferFetchIds = [];
            this._bufferFetchPromises = [];
            this._selectedPCs = [];
            this._eventManager = new xModelEventManager(this._privateChannel, this._applicationChannel, this._privateChannelForRules);
            this._securityContext = options.securityContext;
            this._tenant = options.tenant;
            let VariabilityOption = {
                "text": _NLS_BulkTablePresenter.Variability,
                "dataIndex": 'tree',
                pinned: 'left',
                editableFlag: false
            };
            var columns = [];
            columns.push({
                "text": _NLS_PCsBulkViewPresenter.ProductConfiguration,
                "dataIndex": "productConfiguration",
                pinned: 'left',
                editableFlag: false,
                "type": "Product Configuration",
                "children": [{
                    "text": _NLS_PCsBulkViewPresenter.BaseConfiguration,
                    "dataIndex": 'baseConfiguration',
                    "type": "Base Configuration",
                    pinned: 'left',
                    editableFlag: false,
                    "children": [VariabilityOption]
                }]
            }, {
                "dataIndex": "productConfiguration_Type",
                "children": [{
                    "dataIndex": "baseConfiguration_Type",
                    children: [{
                        "text": _NLS_BulkTablePresenter.Type,
                        "dataIndex": 'type',
                        pinned: 'left',
                        editableFlag: false,
                        visibleFlag: false,
                        getCellValue: function (cellInfos) {
                            if (cellInfos.nodeModel) {
                                var grid = cellInfos.nodeModel.options.grid;
                                var label;
                                if (grid) {
                                    if (grid.type === 'Parameter') {
                                        label = _NLS_BulkTablePresenter.Parameter;
                                    } else if (grid.type === 'VariabilityGroup') {
                                        label = _NLS_BulkTablePresenter.OptionGroup;
                                    } else if (grid.type === 'Variant') {
                                        label = _NLS_BulkTablePresenter.Variant;
                                    }
                                    return label;
                                }
                            }
                        }
                    }]
                }]
            },
                {
                    "dataIndex": "productConfiguration_Commercial",
                    "children": [{
                        "dataIndex": "baseConfiguration_Commercial",
                        children: [{
                            "text": _NLS_BulkTablePresenter.COMMERCIAL,
                            "dataIndex": 'commercial',
                            pinned: 'left',
                            editableFlag: false,
                            visibleFlag: true,
                            width: "100",
                            typeRepresentation: 'string',
                            getCellValue: function (cellInfos) {
                                let val = cellInfos.nodeModel.options.grid['commercial'];
                                return val === true ? _NLS_BulkTablePresenter.YES : _NLS_BulkTablePresenter.NO;
                            }
                        }]
                    }]
                },
                {
                    "dataIndex": "productConfiguration_SequenceNumber",
                    "children": [{
                        "dataIndex": "baseConfiguration_SequenceNumber",
                        children: [{
                            "text": _NLS_BulkTablePresenter.SequenceNumber,
                            "dataIndex": 'sequenceNumber',
                            pinned: 'left',
                            editableFlag: false,
                            visibleFlag: false,
                            typeRepresentation: 'integer'
                        }]
                    }]
                });
            let that = this;

            function _changeValue(cellInfos, value) {
                that._privateChannel.publish({
                    event: 'bulkEdit-on-change'
                });
                //cellInfos.dsModel._properties.value;
                var rowID = cellInfos.nodeModel.getAttributeValue('id');
                var cellType = that._bulkTableModel.getCellType(cellInfos.rowID);
                let cellData = that._bulkTableModel.getMatrixCellData(cellInfos.columnID - COLUMN_ID_INDEX, rowID); 
                var checkConflictOfAllPC = true;
                if (value !== undefined) {
                    if (cellType && cellType === 'Parameter') {
                        // in case of Param => do check conflict
                        checkConflictOfAllPC = true;
                        // Math.round: spinbox returns 204.99999999 for 205 IR-1224493-3DEXPERIENCER2024x                       
                        cellData.numericalValue = Math.round(value);
                        cellData.status = 'Chosen';
                    } else { // Variability
                        //let = ;
                        PCsBulkViewPresenterUtils.setChosenValues(cellData,value);
                    }
                }
                if (checkConflictOfAllPC) {
                    that.checkConflictOfPC(cellInfos.columnID - COLUMN_ID_INDEX).then(function (data) {
                        that.applySolverAnswer(data, cellInfos.columnID - COLUMN_ID_INDEX);
                        that.checkStatusOfPC(cellInfos.columnID - COLUMN_ID_INDEX).then(function (solverData) {
                            that.applySolverAnswer(solverData, cellInfos.columnID - COLUMN_ID_INDEX);
                            //update the UX
                            that._updateDGVColumn(cellInfos.columnID);
                        });
                    });
                }
            }

            this._componentEventListeners = {
                'validate-criteria': function (e) {
                    let cellInfos = e.options.id;
                    let value = e.options.value;
                    _changeValue(cellInfos, value);
                },
                'show-state-tooltip': function (e) {
                    that._privateChannel.publish({ event: 'pc-show-criteria-tooltip', data: e.options });
                },
                'show-status-originator': function (e) {
                    that._privateChannel.publish({ event: 'pc-show-status-originator-tooltip', data: e.options });
                },
                'update-height': function (e) {
                    that._dataGridView.layout.resetRowHeights();
                }
            };
            options.columnOptions = columns;
            this._parent(options);
        },
        updateEditAction: function () {
            if (this._modelMaturity === 'Obsolete') {
                if (this._showEditAction) {
                    this._showEditAction = false;
                    this._privateChannel.publish({ event: 'enox-collection-toolbar-visibility-action', data: { id: 'edit-pencil', flag: false } });
                    this._editionflag = false;
                    this._bulkTableModel.restoreSnapshot();
                    this.onTableUpdateEnd();
                }
            }
            else {
                this._showEditAction = true;
                this._privateChannel.publish({ event: 'enox-collection-toolbar-visibility-action', data: { id: 'edit-pencil', flag: true } });
            }
        },
        setModelMaturity: function (modelMaturity) {
            this._modelMaturity = modelMaturity;
        },
        setModelVersion: function (modelVersionId) {
            this._modelId = modelVersionId;
        },
        setSecurityContext: function (securityContext) {
            this._securityContext = securityContext;
        },
        setTenant: function (tenant) {
            this._tenant = tenant;
        },
        loadVariabilityInfo: function (variabilityDictionary) {
            if (variabilityDictionary && variabilityDictionary.portfolioClasses) {

                this._variabilityDictionary = variabilityDictionary;
                this._initPCBulkModel();
                var bulkPresenterOptions = {
                    jsonModel: this._bulkTableModel.getJsonModel(),
                    COLUMN_ID_INDEX: COLUMN_ID_INDEX,
                    presenterState: 'preview-mode',
                    modelEvent: this._privateChannel,
                    statusBarOptions: {
                        nbRows: this._bulkTableModel.getNbRows(),
                        nbColumns: 0,
                        totalColumnLabel: _NLS_PCsBulkViewPresenter.TotalProductConfigurations,
                        totalRowsLabel: _NLS_PCsBulkViewPresenter.TotalVariability,
                        withStatusInfo: this._withSolver, //true withStatusInfo
                        withStatusComputing: this._withStatusComputing, //true,
                        withSuggestionsComputing: this._withSuggestionComputing //false
                    },
                    setAsReferenceItem: true
                };
                if (this._container) {
                    this.destroy();
                    this._eventManager = new xModelEventManager(this._privateChannel, this._applicationChannel, this._privateChannelForRules);
                }
                this._createBulkTableDGV(bulkPresenterOptions);
                //for autocomplete implementation
                this.registerCellContent();
            }
        },
        _createBulkTableDGV: function (bulkPresenterOptions) {

            if (bulkPresenterOptions) {
                this._parent(bulkPresenterOptions);
                this._handleKeyEvent();
            }
        },
        _initPCBulkModel: function () {
            var configModel = new ConfiguratorModel({});
            configModel.setDictionary(this._variabilityDictionary);
            var mapDicoPC = configModel.getDictionary();
            this._bulkTableModel = new BulkTableModel(mapDicoPC);
        },
        _subscribeToEvents: function () {
            this._parent();
        },
        setColumnAsReference: function (cellInfos) {
            this._parent(cellInfos);
        },
        unSetColumnAsReference: function (isChangeReference) {
            this._parent(isChangeReference);
        },
        onTableUpdateStart: function () {
            this._parent();
        },
        onTableUpdateEnd: function () {
            this._parent();
        },
        fetchData: function (arraySelectedIds) {
            var that_ = this;
            return new Promise((resolve, reject) => {
                if (arraySelectedIds.length) {

                    // R14 do not overwhelm the server with fetch.
                    // When the loading Selected PCs function is busy
                    // push new entries to a buffer
                    if (UWA.is(that_._batchLoadingPromise)) {
                        that_._bufferFetchIds = that_._bufferFetchIds.concat(arraySelectedIds);
                        that_._bufferFetchPromises.push({
                            resolve: resolve,
                            reject: reject
                        });
                    } else {
                        Mask.mask(that_._container);
                        arraySelectedIds.forEach(function (pcObj) {
                            pcObj.modelID = that_._modelId;
                            that_._bulkTableModel.createColumn(pcObj);
                        });
                        // update list of selected Ids.
                        that_._selectedPCs = that_._selectedPCs.concat(arraySelectedIds);
                        that_._batchLoadingPromise = that_.batchLoading(arraySelectedIds).then(function () {
                            that_._batchLoadingPromise = null;
                            Mask.unmask(that_._container);
                            setTimeout(function () {
                                if (that_._bufferFetchIds.length) {
                                    that_.fetchData(that_._bufferFetchIds).then(function () {
                                        that_._bufferFetchPromises.forEach(function (mypromise) {
                                            mypromise.resolve();
                                        });
                                    });
                                    that_._bufferFetchIds = [];
                                }
                            });
                            resolve();
                        }, function (err) {
                            that_._batchLoadingPromise = null;
                            Mask.unmask(that_._container);
                            reject(err);
                        });
                    }
                } else {
                    reject(new Error("Empty List"));
                }
            });
        },
        /**
         * R14: to move to BulkTablePresenter
         * fetching content column by column after selection then checking conflict
         */
        batchLoading: function (arraySelectedIds) {
            var that = this;
            var selectedPCs = UWA.clone(arraySelectedIds, false); // doing shallow clone to avoid stack max side exceed issue
            var FinalPromise = new Promise((resolve, reject) => {
                var PromiseArray = [];
                if (arraySelectedIds.length)
                    PromiseArray.push(that.loadElement(arraySelectedIds.shift()));
                if (arraySelectedIds.length)
                    PromiseArray.push(that.loadElement(arraySelectedIds.shift()));
                if (arraySelectedIds.length)
                    PromiseArray.push(that.loadElement(arraySelectedIds.shift()));
                if (arraySelectedIds.length)
                    PromiseArray.push(that.loadElement(arraySelectedIds.shift()));

                if (PromiseArray.length) {
                    Promise.all(PromiseArray).then((values) => {
                        setTimeout(function () {
                            that._createColumnsForLoadedInfos(values, selectedPCs);
                            that.batchLoading(arraySelectedIds).then(
                                function () {
                                    resolve();
                                },
                                function (err) {
                                    reject(err);
                                }
                            );
                        });
                    });
                } else {
                    resolve();

                    that._pauseCheckConflictCall = false;
                    that.checkAllPCs({request:"solve"});

                }
            });
            return FinalPromise;
        },
        loadElement: function (selectedPC) {
            var that = this;
            return new UWA.Promise(function (resolve, reject) {
                that.getCriteriaConfigurationInstances({
                    id: selectedPC.id,
                    filterRejected: false
                }, function (data_success) {
                    UWA.log('Success');
                    resolve(data_success);
                }, function (data_failure) {
                    UWA.log('Failed' + data_failure);
                    reject();
                });
            });
        },
        _createColumnsForLoadedInfos: function (loadData, selectedPCs) {
            if (loadData) {

                for (var i = 0; i < loadData.length; i++) {
                    if (loadData[i].member && UWA.is(loadData[i].member, 'array')) {
                        var dataReceived = loadData[i].member;
                        var pcId = selectedPCs[i].id;
                        var columnID = this._bulkTableModel.getColumnID(pcId);// push Id to check conflict
                        if (!this._arrayColumnIDsToCheck.includes(columnID)) {
                            this._arrayColumnIDsToCheck.push(columnID);
                        }
                        if (columnID !== undefined) {
                         // updateJsonModel   
                            for (var j = 0; j < dataReceived.length; j++) {                            
                                let cellData = this._bulkTableModel.getMatrixCellData(columnID,dataReceived[j].id);          
                                // disable controller to multi variant values from persistency                               
                                if(UWA.is(cellData.disableControl,'function'))
                                    cellData.disableControl();
                                cellData.status = dataReceived[j].status; 
                                if(UWA.is(cellData.enableControl,'function'))
                                    cellData.enableControl();
                                if(cellData.hasOwnProperty('numericalValue') && dataReceived[j].value)
                                    cellData.numericalValue = parseInt(dataReceived[j].value.split(' ')[0]);
                            }
                            //update snapshot with persisted values
                            this._bulkTableModel.snapshot(pcId);
                            var pcObj = this._bulkTableModel.getColumnHeader(columnID);
                            // create the column in dgv after getting the content
                            if (!this._loadedPCs[pcObj.id]) {
                                this._loadedPCs[pcObj.id] = pcObj;
                                this._createColumnForPC(pcObj);
                            }
                        }

                    }
                }

            }
        },
        // multiselection
        _handleKeyEvent: function () {
            this._dataGridView.addEventListener('keydown', (event) => {
                if (event.ctrlKey) {
                    this._container.addClassName('selection-mode');
                }
            });
            this._dataGridView.addEventListener('keyup', (event) => {
                if (event.key === "Control") {
                    this._container.removeClassName('selection-mode');
                }
                else if (event.key.toLowerCase() === "c" && event.ctrlKey && this.copiedToClipboard) {
                    xNotificationsUtil.showSuccess(_NLS_BulkTablePresenter.CopiedToClipboard);
                    this.copiedToClipboard = false;
                }
                else if (event.key.toLowerCase() === "v" && event.ctrlKey && this.pasted){
                    var that = this;
                    that.pasted = false;
                    that._arrayColumnIDsToCheck.forEach(id => {                        
                        that.checkConflictOfPC(id).then(function (data) {
                            that.applySolverAnswer(data, id);
                            that.checkStatusOfPC(id).then(function (solverData) {
                                that.applySolverAnswer(solverData, id);
                                //update the UX
                                that._updateDGVColumn(id + COLUMN_ID_INDEX);
                            });
                        });
                    });
                    that._arrayColumnIDsToCheck = [];
                }
            });
        },

        _createColumnForPC: function (pcObj) {
            var that = this;

            if (pcObj) {

                let VariabilityOpt = {
                    dataIndex: pcObj.id,
                    sortableFlag: false,
                    autoRowHeightFlag: true,
                    editableFlag: that._editionflag,
                    onCellRequest: function (cellInfos) {
                        var isEditable = that._dataGridView.layout.getColumnEditableFlag(cellInfos.columnID);
                        that._setCellContent(cellInfos, isEditable);
                    },
                    getCellValue: function (cellInfos) {
                        return that.getCellData(cellInfos);
                    },
                    setCellValue: function (cellInfos, value) {
                        if (value !== undefined) {
                            that._privateChannel.publish({
                                event: 'bulkEdit-on-change'
                            });
                            that._bulkTableModel.getColumnHeader(cellInfos.columnID - COLUMN_ID_INDEX).isDirty = true;
                            var cellType = that._bulkTableModel.getCellType(cellInfos.rowID);
                            let cellData = that.getCellData(cellInfos);

                            if(value === null) {
                                PCsBulkViewPresenterUtils.clearSelection(cellData);
                            } else if (cellType && cellType === 'Parameter') {
                                // Math.round: spinbox returns 204.99999999 for 205 IR-1224493-3DEXPERIENCER2024x
                                PCsBulkViewPresenterUtils.setNumericalValue(cellData, Math.round(value));
                            } else {
                                PCsBulkViewPresenterUtils.setChosenValues(cellData, value);
                            }
                            if (that.pasted) {
                                // push Id to check conflict on paste
                                if (that._arrayColumnIDsToCheck === undefined) {
                                    that._arrayColumnIDsToCheck = [];
                                }
                                if (!that._arrayColumnIDsToCheck.includes(cellInfos.columnID - COLUMN_ID_INDEX)) {
                                    that._arrayColumnIDsToCheck.push(cellInfos.columnID - COLUMN_ID_INDEX);
                                }
                            }
                            else {
                                that.checkConflictOfPC(cellInfos.columnID - COLUMN_ID_INDEX).then(function (data) {
                                    that.applySolverAnswer(data, cellInfos.columnID - COLUMN_ID_INDEX);
                                    that.checkStatusOfPC(cellInfos.columnID - COLUMN_ID_INDEX).then(function (solverData) {
                                        that.applySolverAnswer(solverData, cellInfos.columnID - COLUMN_ID_INDEX);
                                        //update the UX
                                        that._updateDGVColumn(cellInfos.columnID);
                                    });
                                });
                            }
                        } else {
                            if(!(window.event && window.event.type === 'change') ) {
                                this.flashEffectOnCell("ui-notmodified", cellInfos.cellID);
                            }
                        }
                    },
                    getCellEditableState: function (cellInfos) {
                        if (cellInfos.nodeModel.options.grid.usage === "Primary") {
                            return false;
                        }
                        return that._dataGridView.getColumnOrGroup(cellInfos.columnID).editableFlag;
                    },
                    getCellValueForCopy: (cellInfos) => {
                        var cellData = this.getCellData(cellInfos);
                        var parentID = cellInfos.nodeModel.options.id;
                        // option group - check for type as we can't copy/paste a list of variant values for the moment
                        if (cellData.values && cellInfos.nodeModel.options.grid.type === "VariabilityGroup") {
                            let values = PCsBulkViewPresenterUtils.buildSelectedValues(cellData, this._bulkTableModel._variabilityMap);                            
                            let stringifiedOptions = values.map(option => option.id).toString();
                            this.copiedToClipboard = true;
                            if (stringifiedOptions.length > 0) {
                                return parentID + "-" + stringifiedOptions;
                            }
                            return parentID + "-NULL";
                            
                        }
                        // parameter
                        else if (cellData.hasOwnProperty("unit")) {
                            this.copiedToClipboard = true;
                            if (UWA.is(cellData.numericalValue, "number")) {
                                return "-" + cellData.numericalValue + ' '+ cellData.unit;
                            }
                            return "-NULL";
                            
                        }
                        // variant with one value
                        else if (cellData.values) {
                            this.copiedToClipboard = true;
                            let values = PCsBulkViewPresenterUtils.buildSelectedValues(cellData,this._bulkTableModel._variabilityMap);
                            if(values.length === 1) {
                                return parentID + "-" + values[0].id;
                            }
                            return parentID + "-NULL";
                            
                        }
                    },
                    processCellValueFromPaste: (cellInfos, textValue) => {
                        if(cellInfos.nodeModel){
                            this.nbPasted++;
                            var parentIDAndValue = textValue.split("-");
                            textValue = parentIDAndValue[1];
                            
                            if (parentIDAndValue[0] === "" && cellInfos.nodeModel.options.grid.type === "Parameter") {
                                if(textValue === "NULL") {
                                    this.pasted = true;
                                    return null;
                                }
                                var paramData = this._bulkTableModel.getRowHeaderData(cellInfos.rowID);
                                var targetMax = paramData.range[0].max;
                                var targetMin = paramData.range[0].min;
                                var paramValue = parentIDAndValue[1];
                                var paramValueParts = paramValue.split(' ');
                                
                                // check same unit
                                if((paramValueParts.length === 1 && targetMin.unit === '') ||
                                   (paramValueParts.length === 2 && targetMin.unit ===paramValueParts[1]) ) {
                                     
                                    // check the range of the value
                                    var paramCopiedValue = parseFloat(paramValueParts[0]);
                                    if(paramCopiedValue >= parseInt(targetMin.value) && paramCopiedValue <= parseInt(targetMax.value)) {
                                        this.pasted = true;
                                         return paramValueParts[0];
                                    }
                                }                                
                            }
                            else if (parentIDAndValue[0] === cellInfos.nodeModel.options.id) {
                                this.pasted = true;
                                if(textValue === "NULL") {
                                    return [];
                                }
                                return textValue.split(",");
                            }
                        }
                        return undefined;
                    }
                };

                var columnOptions = {};

                columnOptions = {
                    text: pcObj.title,
                    icon: pcObj.attributes.image,
                    typeRepresentation: 'string',
                    dataIndex: pcObj.id + '_pc_header',
                    children: [{
                        text: pcObj.attributes.baseConfigurationTitle ? pcObj.attributes.baseConfigurationTitle + ' ' + pcObj.attributes.baseConfigurationRevision : '',
                        typeRepresentation: "dropdownSelection",
                        dataIndex: pcObj.id + '_bc_header',
                        children: [VariabilityOpt]
                    }]
                };

                this._dataGridView.addColumnOrGroup(columnOptions);
                var data = {
                    id: 'totalColumn',
                    text: _NLS_PCsBulkViewPresenter.TotalProductConfigurations + ' : ' + Object.keys(this._loadedPCs).length
                };
                this._updateStatusBar(data);
            }
        },

        removeLoadedPC: function (pcsToRemove) {
            if (pcsToRemove) {
                var arraySelectedPCs = pcsToRemove;
                if (UWA.is(pcsToRemove, 'array') === false) {
                    arraySelectedPCs = [pcsToRemove];
                }
                for (var i = 0; i < arraySelectedPCs.length; i++) {
                    // deactivate show differences icon if we are removing the reference pc
                    var columnAsReference = this._bulkTableModel.getColumnHeader(this._bulkTableModel.getColumnID(arraySelectedPCs[i].id));
                    if (columnAsReference) {
                        if (columnAsReference.isAsReference) {
                            this._compareFlag = false;
                            this._privateChannel.publish({
                                event: 'enox-collection-toolbar-change-icon-action',
                                data: {
                                    id: 'compare-pc',
                                    fonticon: 'variants-and-options-compare',
                                    text: _NLS_BulkTablePresenter.HighlightDifferences
                                }
                            });
                        }
                    }
                    var columnId = this._bulkTableModel.getColumnIndexFromColumnMap(arraySelectedPCs[i].id);
                    if (UWA.is(columnId)) {
                        if (this._arrayColumnIDsToCheck.includes(columnId)) {
                            this._arrayColumnIDsToCheck.splice(this._arrayColumnIDsToCheck.indexOf(columnId), 1);
                        }
                        if (this._arrayColumnIDsChecked.includes(columnId)) {
                            this._arrayColumnIDsChecked.splice(this._arrayColumnIDsChecked.indexOf(columnId), 1);
                        }
                    }
                    var pcAttributes = this._bulkTableModel.getColumnAttributes(arraySelectedPCs[i].id);
                    if (pcAttributes) {
                        var baseConfigurationId = pcAttributes.baseConfigurationId;
                        if (baseConfigurationId) {
                            if (this._mapBCsSelectedCriteria && this._mapBCsSelectedCriteria[baseConfigurationId]) {
                                delete this._mapBCsSelectedCriteria[baseConfigurationId];
                                //this.removeBaseConfigurations(baseConfigurationId);
                            }
                        }
                    }
                    delete this._loadedPCs[arraySelectedPCs[i].id];
                    this._dataGridView.removeColumnOrGroup(arraySelectedPCs[i].id + '_pc_header');
                }
                //one code bloc for remove
                this._bulkTableModel.removeColumns(arraySelectedPCs);
                var data = {
                    id: 'totalColumn',
                    text: _NLS_PCsBulkViewPresenter.TotalProductConfigurations + ' : ' + Object.keys(this._loadedPCs).length
                };
                // Unset column as reference and deactivate show differences icon if there is less than two columns left
                if (Object.keys(this._loadedPCs).length < 2 && this._compareFlag) {
                    this.unSetColumnAsReference(false);
                }
                this._updateStatusBar(data);
            }
        },

        removeAllLoadedPCs: function () {
            if (this._loadedPCs && Object.keys(this._loadedPCs).length > 0) {
                this.removeLoadedPC(Object.values(this._loadedPCs));
            }
        },
        getNbLoadedPCs: function () {
            return this._bulkTableModel.getColumnLength();
        },
        /**
     * Sets the content of a cell in the bulk view grid.
     * 
     * @param {object} cellInfos - Information about the cell to be updated.
     * @param {boolean} isEditable - Whether the cell is editable or not.
     */
        _setCellContent: function (cellInfos, isEditable) {
            var component;
            var rowID = cellInfos.nodeModel.options.grid.rowIndex;
            cellInfos.rowID = rowID;

            var type = cellInfos.nodeModel ? cellInfos.nodeModel.getAttributeValue('type') : undefined;
            var referenceCellData;
            if (this._compareFlag) {
                referenceCellData = this._bulkTableModel.getReferenceCellData(cellInfos.nodeModel.getAttributeValue('id'));
            }

            // Handle different types of cells
            if (type) {
                // Editable Variant, VariabilityGroup, Parameter

                if (isEditable && cellInfos.nodeModel.options.grid.usage !== "Primary") {
                    switch (type) {
                        case 'Parameter':
                            component = this._dataGridView.reuseCellContent('numericalSelectionEditor');
                            this._handleParameterCell(cellInfos, component, referenceCellData);
                            break;
                        default:
                            component = this._dataGridView.reuseCellContent('criteriaSelectionEditor');
                            this._handleVariabilityCell(cellInfos, component, referenceCellData);
                            break;

                    }
                } else {
                    component = this._dataGridView.reuseCellContent('criteriaSelectionView');
                    switch (type) {
                        case 'Parameter':
                            this._handleParameterViewCell(cellInfos, component, referenceCellData);
                            break;
                        default:
                            this._handleVariabilityViewCell(cellInfos, component, referenceCellData);
                            break;
                    }
                }
            } else {
                this._dataGridView.defaultOnCellRequest(cellInfos);
            }

            // Set the content of the cell
            if (component) {
                cellInfos.cellView.setReusableContent(component);
                if ((type && type !== 'Parameter')) {
                    this._dataGridView.layout.resetRowHeight(cellInfos.rowID);
                }
            }
        },

        // Helper functions for handling different types of cells
        _handleParameterCell: function (cellInfos, component, referenceCellData) {
            let cellData = this.getCellData(cellInfos);
            var paramData = this._bulkTableModel.getRowHeaderData(cellInfos.rowID);
            var max = paramData.range[0].max;
            var min = paramData.range[0].min;
            var status = cellData.status;
            var value = cellData.numericalValue;
            component.setProperties({
                value: value ? parseInt(value) : null,
                units: min.unit,
                minValue: cellData.minValue ? parseInt(cellData.minValue) : parseInt(min.value),
                maxValue: cellData.maxValue ? parseInt(cellData.maxValue) : parseInt(max.value),
                state: status,
                isConflicting: cellData.stateValidity && cellData.stateValidity !== 'V',
                referenceValue: referenceCellData ? referenceCellData.numericalValue : undefined,
                context: cellInfos
            });

            for (var eventName in this._componentEventListeners) {
                if (this._componentEventListeners.hasOwnProperty(eventName)) {
                    component.removeEventListener(eventName, this._componentEventListeners[eventName]);
                    component.addEventListener(eventName, this._componentEventListeners[eventName]);
                }
            }
        },

        _handleVariabilityCell: function (cellInfos, component, referenceCellData) {
            let cellData = this.getCellData(cellInfos);
            var type = cellInfos.nodeModel ? cellInfos.nodeModel.getAttributeValue('type') : undefined;
            let values = PCsBulkViewPresenterUtils.buildSelectedValues(cellData,this._bulkTableModel._variabilityMap).map(value => value.id);
            if (type === 'Variant' && UWA.is(values, 'array')) {
                values = values.filter((value, idx) => idx === 0);
            }
            let referenceCellValues = null;
            if(referenceCellData && referenceCellData.values) {
                referenceCellValues = PCsBulkViewPresenterUtils.buildSelectedValues(referenceCellData);
            }

            let usage = cellInfos.nodeModel.getAttributeValue('selected');

            component.setProperties({
                multiValue: (type === 'VariabilityGroup'),
                value: UWA.is(values, 'array') ? values : [],
                referenceValue: referenceCellValues,
                hasConflict: cellData.stateValidity && cellData.stateValidity === 'C',
                validationAction: true,
                enableEasySelection: (type === 'VariabilityGroup'),
                context: cellInfos,
                possibleValues: PCsBulkViewPresenterUtils.buildAllValues(cellData,this._bulkTableModel._variabilityMap, ['Primary','Mandatory'].includes(usage))
            });

            for (var eventName in this._componentEventListeners) {
                if (this._componentEventListeners.hasOwnProperty(eventName)) {
                    component.removeEventListener(eventName, this._componentEventListeners[eventName]);
                    component.addEventListener(eventName, this._componentEventListeners[eventName]);
                }
            }
        },
        _handleVariabilityViewCell: function (cellInfos, component, referenceCellData) {
            var type = cellInfos.nodeModel ? cellInfos.nodeModel.getAttributeValue('type') : undefined;
            let cellData = this.getCellData(cellInfos);
            let values = PCsBulkViewPresenterUtils.buildSelectedValues(cellData,this._bulkTableModel._variabilityMap);
            if (UWA.is(values, 'array')) {
                values = values.map(function (value) {
                    return UWA.merge({
                        state: value.state,
                        hasConflict: value.stateValidity && value.stateValidity === 'C'
                    }, value);
                });
            }

            let referenceCellValues = null;
            if(referenceCellData && referenceCellData.values) {
                referenceCellValues = PCsBulkViewPresenterUtils.buildSelectedValues(referenceCellData);
            }
            component.setProperties({
                value: values,
                multiValue: (type === 'VariabilityGroup'),
                referenceValue: referenceCellValues 
            });
        },
        _handleParameterViewCell: function (cellInfos, component, referenceCellData) {
            let cellData = this.getCellData(cellInfos);
            if (cellData) {
                let value = UWA.merge({
                    state: PCsBulkViewPresenterUtils.fromStateToStatus(cellData.state),
                    hasConflict: cellData.stateValidity && cellData.stateValidity === 'C'
                }, cellData);
                component.setProperties({
                    multiValue: false,
                    value: value.numericalValue ? [value] : [],
                    referenceValue: referenceCellData ? [referenceCellData.numericalValue] : null
                });
            }
        },
        getCellData: function (cellInfos) {
            var matrix_columnID = cellInfos.columnID - COLUMN_ID_INDEX;
            var matrix_rowID = cellInfos.nodeModel.getAttributeValue('id');
            return this._bulkTableModel.getMatrixCellData(matrix_columnID, matrix_rowID);
        },
        registerCellContent: function () {

            this._dataGridView.registerReusableCellContent({
                id: 'criteriaSelectionEditor',
                buildContent: function () {
                    return new CriteriaSelectionEditor({});
                }, cleanContent: function (content) {
                    if (content && UWA.is(content.cleanContent, 'function')) {
                        content.cleanContent();
                    }
                }
            });

            this._dataGridView.registerReusableCellContent({
                id: 'criteriaSelectionView',
                buildContent: function () {
                    return new CriteriaSelectionView({});
                }, cleanContent: function (content) {
                    if (content && UWA.is(content.cleanContent, 'function')) {
                        content.cleanContent();
                    }
                }
            });


            this._dataGridView.registerReusableCellContent({
                id: 'numericalSelectionEditor',
                buildContent: function () {
                    return new NumericalSelectionEditor({});
                },
                cleanContent: function (content) {
                    if (content && UWA.is(content.cleanContent, 'function')) {
                        content.cleanContent();
                    }
                }
            });

        },
        destroy: function () {
            this._parent();
            if (this._eventManager) {
                this._eventManager.cleanup("PCsBulkTablePresenter");
                this._eventManager = null;
            }

        },
        refresh: function () {
            if (this._dataGridView) {
                this._dataGridView.invalidateLayout({
                    updateCellContent: true,
                    updateCellLayout: false,
                    updateCellAttributes: false
                });

            }
        },
        inject: function (parentContainer) {
            this._container.inject(parentContainer);
        },
        getContent: function () {
            return this._container;
        },
        getCriteriaConfigurationInstances: function (data, onCompl, onFail) {
            var that = this;
            var urlCatalog;
            this.getURL().then(function () {
                if (that._3dCompassUrl) {
                    urlCatalog = that._3dCompassUrl;
                }
                urlCatalog += RESOURCE_WS_URL + INVOKE_SERVICE + CONSTANT_GET_CRITERIA_CONFIGURATION_INSTANCE;

                that._integratedEnv = true;
                var ajaxRequest = that._integratedEnv ? WAFData.authenticatedRequest : WAFData.proxifiedRequest;
                data = UWA.is(data, 'string') ? data : JSON.stringify(data);
                ajaxRequest(urlCatalog, {
                    method: 'POST',
                    data: data,
                    type: 'json',
                    async: true,
                    headers: that._integratedEnv ? {
                        'SecurityContext': (that._securityContext) ? that._securityContext : '',
                        'Content-Type': 'application/json'
                    } : {
                        'Content-Type': 'application/json',
                        'Authorization': urlCatalog.authorizationTicket ? urlCatalog.authorizationTicket : '',
                        'SecurityContext': urlCatalog.securityContext ? urlCatalog.securityContext : ''
                    },
                    onComplete: onCompl,
                    onFailure: onFail,
                    timeout: 300000
                });
            });
        },
        getURL: function () {
            var that = this;
            return new UWA.Promise(function (resolve, reject) {
                if (that._3dCompassUrl === null || that._3dCompassUrl === undefined) {
                    var parameters = {
                        serviceName: STR_SERVICE_NAME,
                        platformId: that._tenant,
                        async: false,
                        onComplete: function (URLResult) {
                            if (typeof URLResult === 'string') {
                                that._3dCompassUrl = URLResult;
                            } else {
                                that._3dCompassUrl = URLResult[0].url;
                                URLResult.forEach(function (platforms) {
                                    if (platforms.platformId === that._tenant) {
                                        that._3dCompassUrl = platforms.url;
                                    }
                                });
                            }
                            resolve();
                        },
                        onFailure: function () {
                            UWA.log('3DCompasss Service URL fetch failed...');
                            reject();
                        }
                    };
                    i3DXCompassServices.getServiceUrl(parameters);
                } else {
                    resolve();
                }
            });
        },
        // for option group and multi selected values
        isSearchedValueInDGVContent: function(rowID,searchValueStr, jsonModel){
            if(rowID && searchValueStr !== undefined){
            for (var i = 0; i < jsonModel.matrix.length; i++) {
                var cellData = this._bulkTableModel.getMatrixCellData(i, rowID);
                
                if(cellData && cellData.values){             
                    let selectedValues = PCsBulkViewPresenterUtils.buildSelectedValues(cellData);
                    if(UWA.is(selectedValues,'array')) {
                        for ( var j = 0 ; j< selectedValues.length ; j++ ) {
                            let id = selectedValues[j];
                            if (this._bulkTableModel._variabilityMap.get(id).title.toLocaleLowerCase().includes(searchValueStr) )  {
                                return true; 
                            }
                        }
                    }
                }
            }
        }
        return false;
      }
    });
    return PCsBulkViewPresenter;
});

