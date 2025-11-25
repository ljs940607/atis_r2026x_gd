define("DS/MePreferencesUIBuilder/MePreferencesAdminTableBuilder", [
    "UWA/Core",
    "DS/TreeModel/TreeNodeModel",
    "DS/DataGridView/DataGridView"
],
    function (
        UWA,
        TreeNodeModel, DataGridView) {

        var enumList = [];
        var enumMap;

        var mePreferencesAdminTableBuilder = function () {
        };

        function getValueFromNLS(key, nls) {
            var nlsVal = "to be overloaded from NLS";

            if (nls && nls[key] != undefined)
                nlsVal = nls[key];

            return nlsVal;
        }

        mePreferencesAdminTableBuilder.prototype.createAdminTableDGV = function (headerName, headericons, tablemodel, tableKey, nlsJSON) {

            const UpdateModelEvt = new Event("ModelDataUpdated");
            UpdateModelEvt.detail = {};

            function sendEvent(data) {
                UpdateModelEvt.detail = data;
                document.dispatchEvent(UpdateModelEvt);
            }

            let mainContent = new UWA.Element("div", {
                styles: {
                    width: "100%",
                    height: "100%"
                }
            });

            //set tooltips for table headers
            var setHeaderToolTip = function (tableKey, name, nlsJSON) {
                var nlsVal = getValueFromNLS(tableKey + "." + name + ".Tooltip", nlsJSON)
                if (nlsVal && nlsVal === "to be overloaded from NLS") {
                    return null;
                }
                else {
                    return nlsVal;
                }
            }

            //creates dynamic columns and update model
            var createDGVColumns = function (headerName, headericons, tableKey) {
                let columns = [];
                columns[0] = [];
                columns[0]["dataIndex"] = "tree";

                var nlsValue = getValueFromNLS(tableKey + "." + headerName[0] + ".Label", nlsJSON)
                if (nlsValue === "to be overloaded from NLS") {
                    nlsValue = "";
                }

                columns[0]["text"] = nlsValue;
                columns[0]["typeRepresentation"] = "string";
                columns[0]["icon"] = headericons[0];
                columns[0]["sortableFlag"] = false;
                columns[0]["description"] = setHeaderToolTip(tableKey, headerName[0], nlsJSON);

                for (let i = 1, x = 1; i < 2 * (headerName.length) - 1, x < headerName.length; i++) {
                    if (i % 2 == 0) {
                        columns[i] = [];
                        columns[i]["dataIndex"] = "column" + i;
                        nlsValue = getValueFromNLS(tableKey + "." + headerName[x] + ".Label", nlsJSON);
                        if (nlsValue === "to be overloaded from NLS") {
                            nlsValue = "";
                        }
                        columns[i]["text"] = nlsValue;
                        columns[i]["description"] = setHeaderToolTip(tableKey, headerName[x], nlsJSON);
                        columns[i]["alignment"] = "near";
                        columns[i]["icon"] = headericons[x];
                        columns[i]["getCellTypeRepresentation"] = function (cellInfos) {
                            if (cellInfos.nodeModel) {
                                if (cellInfos.nodeModel.getAttributeValue("coltype" + cellInfos.columnID) === "enum") {
                                    return cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "Name");
                                }
                                return cellInfos.nodeModel ? cellInfos.nodeModel.getAttributeValue("coltype" + cellInfos.columnID) : "string";
                            }
                        };
                        columns[i]["setCellValue"] = function (cellInfos, value) {
                            if (cellInfos.nodeModel) {
                                cellInfos.nodeModel._options.grid["column" + cellInfos.columnID + "Value"] = value;
                                let identifier = cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "repository") + "." + cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "Name");

                                let type = cellInfos.nodeModel.getAttributeValue("coltype" + cellInfos.columnID);
                                var selectedvalue = value;
                                let data = [identifier, selectedvalue, type];
                                sendEvent(data);
                            }
                        };
                        columns[i]["getCellValue"] = function (cellInfos) {
                            if (cellInfos.nodeModel) {
                                return cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "Value");
                            }
                        };
                        columns[i]["getCellSemantics"] = function (cellInfos) {
                            return {
                                minValue: cellInfos.nodeModel ? cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "minValue"] : undefined,
                                maxValue: cellInfos.nodeModel ? cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "maxValue"] : undefined,
                                stepValue: cellInfos.nodeModel ? cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "stepsize"] : undefined,
                            };
                        };
                        columns[i]["getCellClassName"] = function (cellInfos) {
                            if (cellInfos.nodeModel) {
                                var repoName = cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "repository");
                                var prefName = cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "Name");

                                var className = "data-me-preferences-dgv-po-class-" + repoName + "." + prefName;
                                return className;
                            }
                        };
                        columns[i]["sortableFlag"] = false;
                        columns[i]["editableFlag"] = true;
                        columns[i]["editionPolicy"] = "EditionOnClick";
                        x++;
                    }
                    else {
                        columns[i] = [];
                        columns[i]["dataIndex"] = "column" + i;
                        columns[i]["alignment"] = "center";
                        columns[i]["getCellTypeRepresentation"] = function (cellInfos) {
                            return "lock";
                        };
                        columns[i]["setCellValue"] = function (cellInfos, value) {
                            if (cellInfos.nodeModel) {
                                cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"] = value;
                                let identifier = cellInfos.nodeModel.getAttributeValue("column" + (cellInfos.columnID + 1) + "repository") + "." + cellInfos.nodeModel.getAttributeValue("column" + (cellInfos.columnID + 1) + "Name") + ".lock";
                                let selectedvalue = value;
                                let type = "lock";
                                let data = [identifier, selectedvalue, type];
                                sendEvent(data);
                            }
                        };
                        columns[i]["getCellValue"] = function (cellInfos) {
                            return cellInfos.nodeModel ? cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"] : false;
                        };
                        columns[i]["getCellSemanticsCB"] = function (cellInfos) {
                            var cellLock = cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"];//cellInfos.nodeModel ? cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "lockstate") : false;
                            if (cellLock === true) {
                                cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"] = false;
                                return;
                            }
                            else if (cellLock === false) {
                                cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"] = true;
                                return;
                            }
                            else {
                                cellInfos.nodeModel._options.grid.semantics["column" + cellInfos.columnID + "lockstate"] = false;
                                return;
                            }
                        };
                        columns[i]["getCellClassName"] = function (cellInfos) {
                            if (cellInfos.nodeModel) {
                                var repoName = cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "repository");
                                var prefName = cellInfos.nodeModel.getAttributeValue("column" + cellInfos.columnID + "Name");

                                var className = "data-me-preferences-dgv-po-lock-class-" + repoName + "." + prefName;
                                return className;
                            }

                        };
                        columns[i]["sortableFlag"] = false;
                        columns[i]["editableFlag"] = true;
                        columns[i]["editionPolicy"] = "EditionOnClick";
                    }
                }
                return columns;
            }

            let col = createDGVColumns(headerName, headericons, tableKey);

            let myDataGridView = new DataGridView({
                identifier: "DataGridView",
                columns: col,
                treeDocument: tablemodel,
                showSelectionCheckBoxesFlag: false,
                showRowIndexFlag: false,
                showRowHeaderBackgroundFlag: false,
                defaultColumnDef: {//Set default settings for columns 
                    width: 'auto',
                    //   minWidth: 80 //not required for admin
                }
            });

            myDataGridView.maxVisibleRowCount = 100;

            let typeRep = myDataGridView.getTypeRepresentationFactory();

            if (typeRep) {
                for (let i = 0; i < enumList.length; i++) {
                    typeRep.registerTypeRepresentations(JSON.stringify(enumList[i]));
                }
            }

            myDataGridView.subscribeOnceToAllCellsRendered(function () {
                let options = {};
                options.computeColumnHeader = true;
                myDataGridView.sizeAllColumnsToFit(options);
            });

            myDataGridView.inject(mainContent);

            return mainContent;

        }
        //Get node data from application json for table DGV 
        mePreferencesAdminTableBuilder.prototype.getNodeData = function (preferenceItemKey, Obj, mepUIDataUtilsObj) {
            let root = undefined;
            let rowdata = [];

            var getRepository = function (preferenceObj) {
                if ((preferenceObj.repository) && (preferenceObj.repository !== ""))
                    return preferenceObj.repository;
                return repoarray[repoarray.length - 1];
            }

            //Creates list for enum,s present in table if any
            var setTableEnum = function (enumValTranslated, enumName) {
                let sem = {};
                sem["possibleValues"] = enumValTranslated;
                sem["valueType"] = "enumString";

                let obj = {};
                obj["stdTemplate"] = "enumCombo";
                obj["semantics"] = sem;

                let customRep = {};
                customRep[enumName] = obj;
                enumList.push(customRep);
            }

            //Creates dynamic node for table UI
            var createNode = function (preferenceItemKey, rowdata) {
                let TreeNode = new TreeNodeModel();
                let gridObject = {};
                let SemanticsObject = {};

                let i = 0, j = 2;
                while (i < rowdata.length) {
                    let columnID = "column" + j;
                    let columnName = columnID + "Name";
                    let columnType = "coltype" + j;
                    let columnValue = columnID + "Value";
                    let minValue = columnID + "minValue";
                    let maxValue = columnID + "maxValue";
                    let stepSize = columnID + "stepsize";
                    let modifiedflag = columnID + "modified";
                    let repository = columnID + "repository";
                    let lockState = "column" + (j - 1) + "lockstate";

                    gridObject[columnName] = rowdata[i];
                    gridObject[columnType] = rowdata[i + 1];
                    if (gridObject[columnType] === "enum")
                        gridObject[columnValue] = getValueFromNLS(rowdata[i + 3] + "." + rowdata[i] + "." + mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", rowdata[i + 3], rowdata[i], "value") + ".Label", mepUIDataUtilsObj.nlsJSON);
                    else if (gridObject[columnType] === "integer" || gridObject[columnType] === "float" || gridObject[columnType] === "double" || gridObject[columnType] === "uint") {
                        let val = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", rowdata[i + 3], rowdata[i], "value");
                        if (val != undefined) {
                            if (gridObject[columnType] === "integer" || gridObject[columnType] === "uint") {
                                gridObject[columnValue] = parseInt(val);
                                SemanticsObject[stepSize] = 1;
                            }
                            else {
                                gridObject[columnValue] = parseFloat(val);
                                SemanticsObject[stepSize] = 0.1;
                            }
                        }
                        if (mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", rowdata[i + 3], rowdata[i], "minValue"))
                            SemanticsObject[minValue] = parseFloat(mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", rowdata[i + 3], rowdata[i], "minValue"));
                        if (mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", rowdata[i + 3], rowdata[i], "maxValue"))
                            SemanticsObject[maxValue] = parseFloat(mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", rowdata[i + 3], rowdata[i], "maxValue"));
                        if (rowdata[i + 2])
                            SemanticsObject[stepSize] = rowdata[i + 2];
                    }
                    else {
                        let val = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", rowdata[i + 3], rowdata[i], "value");
                        if (val != undefined) {
                            gridObject[columnValue] = val;
                        }
                    }
                    gridObject[modifiedflag] = false;
                    gridObject[repository] = rowdata[i + 3];
                    SemanticsObject[lockState] = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", rowdata[i + 3], rowdata[i], "lockState") || false;

                    i = i + 4;
                    j = j + 2;
                }

                TreeNode.options.label = getValueFromNLS(preferenceItemKey + ".Label", mepUIDataUtilsObj.nlsJSON);
                TreeNode.options.grid = gridObject;
                TreeNode.options.grid.semantics = SemanticsObject;

                return TreeNode;
            };

            for (let i = 0; i < Obj.CellData.length; i++) {
                rowdata.push(Obj.CellData[i].name);
                rowdata.push(Obj.CellData[i].tweakertype);
                rowdata.push(Obj.CellData[i].stepsize);
                rowdata.push(getRepository(Obj.CellData[i]));
                if (Obj.CellData[i].tweakertype === "enum") {
                    let enumName = Obj.CellData[i].name;
                    let enumVal = mepUIDataUtilsObj.getDataFromJsonResponse("enumValues", getRepository(Obj.CellData[i]), Obj.CellData[i].name, "values");
                    let enumKey = getRepository(Obj.CellData[i]) + '.' + Obj.CellData[i].name;
                    let enumValMap = new Map();
                    let enumValTranslated = [];
                    for (let a = 0; a < enumVal.length; a++) {
                        enumValTranslated.push(getValueFromNLS(enumKey + "." + enumVal[a] + ".Label", mepUIDataUtilsObj.nlsJSON));
                        enumValMap.set(getValueFromNLS(enumKey + "." + enumVal[a] + ".Label", mepUIDataUtilsObj.nlsJSON), enumVal[a]);
                    }
                    mepUIDataUtilsObj.EnumMap.set(enumKey, enumValMap);
                    setTableEnum(enumValTranslated, enumName);
                }
            }
            root = createNode(preferenceItemKey, rowdata);

            enumMap = mepUIDataUtilsObj.EnumMap;
            return root;
        }

        mePreferencesAdminTableBuilder.prototype.getEnumMap = function () {
            return enumMap;
        }


        mePreferencesAdminTableBuilder.prototype.reset = function () {
            if (enumList) {
                enumList = [];
            } if (enumMap) {
                enumMap = []
            }

        };

        return mePreferencesAdminTableBuilder;

    });
