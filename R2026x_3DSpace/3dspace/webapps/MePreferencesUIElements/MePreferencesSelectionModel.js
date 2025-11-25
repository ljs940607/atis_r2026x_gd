define('DS/MePreferencesUIElements/MePreferencesSelectionModel',
    [
        "DS/TreeModel/TreeDocument",
        "DS/TreeModel/TreeNodeModel",
        "DS/MePreferencesUIBuilder/MePreferencesAdminTableBuilder",
        "DS/MePreferencesUIBuilder/MePreferencesTableBuilder"
    ],
    function (TreeDocument, TreeNodeModel, MEPAdminTableBuilder, MEPreferencesTableBuilder) {

        var selectionModel = new TreeDocument();

        var mepAdminTableBuilderObj = new MEPAdminTableBuilder();

        var mepTableBuilderObj = new MEPreferencesTableBuilder();

        var mePreferencesSelectionModelObj = {

            getSelectionModel: function () {
                return selectionModel;
            },

            getUpdatedPreference: function (repoName, prefName) {
                let prefValue = null;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === (repoName + "." + prefName)) {
                            prefValue = cellInfos.nodeModel.getAttributeValue("value");
                        }
                    }
                });
                return prefValue;
            },

            getUpdatedPreferenceLockState: function (repoName, prefName) {
                let lockstate = null;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === (repoName + "." + prefName)) {
                            lockstate = cellInfos.nodeModel.getAttributeValue("lockState");
                        }
                    }
                });
                return lockstate;
            }
        };

        document.addEventListener("ModelDataUpdated", (e) => {
            updateSelectionModel(e.detail[0], e.detail[1], e.detail[2]);
        });

        function updateSelectionModel(identifier, selectedvalue, type) {

            selectionModel.prepareUpdate();
            let enumMap = null;

            if (mepAdminTableBuilderObj.getEnumMap())
                enumMap = mepAdminTableBuilderObj.getEnumMap();
            else if (mepTableBuilderObj.getEnumMap())
                enumMap = mepTableBuilderObj.getEnumMap();

            if (type === "enum" && enumMap) {
                for (let [key, value] of enumMap.entries()) {
                    if (key === identifier) {
                        let enumValueMap = value;
                        for (let [key1, value1] of enumValueMap.entries()) {
                            if (key1 === selectedvalue) {
                                selectedvalue = value1;
                            }
                        }
                    }
                }
            }

            if (type != "lock") {
                let prefItemTreeNodeModel = new TreeNodeModel({
                    label: identifier,
                    grid: {
                        value: selectedvalue,
                        preferencetype: type,
                        lockState: undefined
                    }
                });
                let rootExist = false;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === identifier) {
                            if (cellInfos.nodeModel.getAttributeValue("value") != selectedvalue) {
                                cellInfos.nodeModel._options.grid["value"] = selectedvalue;
                                cellInfos.nodeModel._options.grid["preferencetype"] = type;
                            }
                            rootExist = true;
                        }
                    }
                });

                if (!rootExist)
                    selectionModel.addRoot(prefItemTreeNodeModel);
            }
            else {
                let tempIdentifier = identifier.split(".");
                tempIdentifier.pop(); // to remove .lock from key
                identifier = tempIdentifier[0] + "." + tempIdentifier[1];

                let prefItemTreeNodeModel = new TreeNodeModel({
                    label: identifier,
                    grid: {
                        value: undefined,
                        preferencetype: undefined,
                        lockState: selectedvalue
                    }
                });

                let rootExist = false;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === identifier) {
                            cellInfos.nodeModel._options.grid["lockState"] = selectedvalue;
                            rootExist = true;
                        }
                    }
                });

                if (!rootExist)
                    selectionModel.addRoot(prefItemTreeNodeModel);
            }

            selectionModel.pushUpdate();
        }

        return mePreferencesSelectionModelObj;
    });
