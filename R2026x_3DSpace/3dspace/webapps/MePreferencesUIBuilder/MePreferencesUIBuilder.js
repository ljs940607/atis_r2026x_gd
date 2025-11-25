define("DS/MePreferencesUIBuilder/MePreferencesUIBuilder", [
    "UWA/Core",
    "DS/Controls/Toggle",
    "DS/Controls/ButtonGroup",
    "DS/Controls/Accordeon",
    "DS/Controls/ComboBox",
    "DS/Controls/ColorPicker",
    "DS/Controls/SpinBox",
    "DS/TreeModel/TreeDocument",
    "DS/Controls/LineEditor",
    "DS/MePreferencesUIBuilder/MePreferencesTableBuilder",
    "DS/MePreferencesUIBuilder/MePreferencesAdminTableBuilder",
    "DS/MePreferencesClientUtilities/MePreferencesUIDataUtils",
    "DS/Controls/Button",
    "DS/Windows/ImmersiveFrame",
    "DS/Windows/Dialog",
    "DS/Controls/Editor",
    "DS/MePreferencesUIElements/MePreferencesCustomView",
    // "DS/MePreferencesUIElements/MePreferencesSelectionModel",
    'DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils',
    "i18n!DS/MePreferencesUIElements/assets/nls/translation",
    "DS/Controls/TooltipModel",
    "DS/Utilities/Dom"],
    function (
        UWA, WUXToggle,
        WUXButtonGroup, WUXAccordeon, WUXComboBox,
        WUXColorPicker, WUXSpinBox, TreeDocument,
        WUXLineEditor, MEPTableBuilder, MEPAdminTableBuilder, MepUIDataUtils, WUXButton,
        WUXImmersiveFrame, WUXDialog, WUXEditor, MePreferencesCustomView,
       /* MePreferencesSelectionModel,*/ MePreferencesPlatformServicesUtils, mePrefWidgetTranslation,
        WUXTooltipModel, Dom) {
        "use strict";

        var tableModelArray = [];
        var mepTableBuilderObj = null;
        var mepAdminTableBuilderObj = null;

        var mepUIDataUtilsObj = new MepUIDataUtils();

        var MePreferencesCustomViewObj = new MePreferencesCustomView();
        //var mePreferencesUtilsObj = new MePreferencesUtils();
        var TENANT_ID = null;
        var mePrefernceUIBuilder = function () {
        };

        //Counts number of section - needs to do sanitisation in future				
        function GetNbSections(UIdata) {
            let sectioncount = null;
            for (let i = 0; i < Object.keys(UIdata).length; i++) {
                if (UIdata[i].type.toLowerCase() === "preferencesection") {
                    sectioncount++;
                }
            }
            return sectioncount;
        }

        function getValueFromNLS(key, nls) {
            var nlsVal = "to be overloaded from NLS";

            if (nls && nls[key] != undefined)
                nlsVal = nls[key];

            return nlsVal;
        }
        /**
         * @function createDiv
         * @description to create a div.
         * @param {string} - mandatory - classname
         * @returns {div} -  classname associated div
         */
        function createDiv(style) {
            return new UWA.createElement("div", {
                class: style,
            });
        }

        /**
         * @function getTooltipInfos
         * @description extracts toolTipinfo from nlsJSON.
         * @param {string, JSON} - mandatory - preferenceItemKey and nlsJSON
         * @returns {JSON} - JSON obj {titleInfo, shortHelpInfo, longHelpInfo}
         */
        function getTooltipInfos(key, nlsJSON) {
            const titleInfo = nlsJSON[`${key}.tooltipInfos.title`] || null;
            const shortHelpInfo = nlsJSON[`${key}.tooltipInfos.shortHelp`] || null;
            const longHelpInfo = nlsJSON[`${key}.tooltipInfos.longHelp`] || null;
            if (!titleInfo && !shortHelpInfo && !longHelpInfo) {
                return null;
            } else {
                return {
                    title: titleInfo,
                    shortHelp: shortHelpInfo,
                    longHelp: longHelpInfo,
                };
            }
        }

        /**
         * @function createInfoIcon
         * @description creates an tooltip info icon.
         * @param {string, JSON} - mandatory - preferenceItemKey and nlsJSON
         * @returns {div} - a div containing an infoIcon
         */
        function createInfoIcon(preferenceItemKey, nlsJSON) {
            let infoIconDiv = null;
            var infoIcon = null;
            let tooltipInfoObj = null;
            if (nlsJSON) {
                tooltipInfoObj = getTooltipInfos(preferenceItemKey, nlsJSON);
            }
            if (tooltipInfoObj) {
                infoIconDiv = createDiv("me-preference-info-div");
                infoIcon = Dom.generateIcon({
                    iconName: "info wux-ui-3ds",
                    className: "info-icon",
                });

                infoIcon.tooltipInfos = new WUXTooltipModel(tooltipInfoObj);

                infoIcon.inject(infoIconDiv);
            }
            return infoIconDiv;
        }
        mePrefernceUIBuilder.prototype.createUI = function (UIJson, nlsJSON, preferenceValues, enumValues, rangeValues, 
            iconObj, isAdminView, MePreferencesSelectionModel, tenantID) {
            
            TENANT_ID = tenantID;
            mepUIDataUtilsObj.createDataUtils(UIJson, nlsJSON, preferenceValues, enumValues, rangeValues, iconObj);

            let repoarray = [];

            const UpdateModelEvt = new Event("ModelDataUpdated");
            UpdateModelEvt.detail = {};

            function sendEvent(data) {
                UpdateModelEvt.detail = data;
                document.dispatchEvent(UpdateModelEvt);
            }

            function getRepository(preferenceObj) {
                if ((preferenceObj.repository) && (preferenceObj.repository !== ""))
                    return preferenceObj.repository;
                return repoarray[repoarray.length - 1];
            }

            //function for mks to cgs conversion
            function convertMKStoCGS(paramType, value) {
                if (paramType.toLowerCase() === "length") {
                    return value * 1000;
                }

                if (paramType.toLowerCase() === "angle") {
                    return value * (180 / Math.PI);
                }
            }

            //function for cgs to mks conversion
            function convertCGStoMKS(paramType, value) {
                if (paramType.toLowerCase() === "length") {
                    return value / 1000;
                }
                if (paramType.toLowerCase() === "angle") {
                    return value * (Math.PI / 180);
                }
            }

            function sortbyValue(comboBoxItems, sortmethod) {
                return comboBoxItems.sort((a, b) => {
                    const isNumA = /^\d+$/.test(a.label);
                    const isNumB = /^\d+$/.test(b.label);
            
                    let result;
            
                    if (sortmethod.toLowerCase() === 'aesc') {
                        if (isNumA && isNumB) {
                            result = Number(a.label) - Number(b.label);
                        } else if (isNumA || isNumB) {
                            result = isNumA ? -1 : 1; 
                        } else {
                            result = a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
                        }
                    } else if (sortmethod.toLowerCase() === 'desc') {
                        if (isNumA && isNumB) {
                            result = Number(b.label) - Number(a.label);
                        } else if (isNumA || isNumB) {
                            result = isNumA ? -1 : 1;
                        } else {
                            result = b.label.localeCompare(a.label, undefined, { sensitivity: 'base' });
                        }
                    } 
                    return result;
                });
            }
            
            function sortAlphabetically(comboBoxItems, sortmethod) {
                return comboBoxItems.sort((a, b) => {
                    let result = a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
                    if (sortmethod.toLowerCase() === 'ztoa') result *= -1;
                    return result;
                });
            }
            
            function sortcomboBoxValues(comboBoxItems, sortmethod) {
                if (sortmethod.toLowerCase() === 'aesc' || sortmethod.toLowerCase() === 'desc') {
                    return sortbyValue(comboBoxItems, sortmethod);
                } else {
                    return sortAlphabetically(comboBoxItems, sortmethod);
                }
            }

            function createItemLockButtonForAdmin(lockValue, preferenceItemKey) {

                var lockButton = new WUXButton({
                    domId: preferenceItemKey + ".lock",
                    icon: {
                        iconName: "",
                        fontIconFamily: WUXManagedFontIcons.Font3DS

                    },
                    value: lockValue,
                    displayStyle: "lite"
                });

                if (lockButton.value == "true") {
                    var iconObj = {};
                    iconObj["iconName"] = "lock";
                    iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                    lockButton.icon = iconObj;
                    lockButton.getContent().setAttribute("locked", "");
                }
                else {
                    var iconObj = {};
                    iconObj["iconName"] = "lock-open";
                    iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                    lockButton.icon = iconObj;
                }
                lockButton.addEventListener("buttonclick", function (e) {
                    if (lockButton.icon.iconName == "lock") {
                        let identifier = e.dsModel._properties.domId.value;
                        let selectedvalue = false;
                        let type = "lock";
                        let data = [identifier, selectedvalue, type];
                        lockButton.getContent().removeAttribute("locked");
                        sendEvent(data);

                        var iconObj = {};
                        iconObj["iconName"] = "lock-open";
                        iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                        lockButton.icon = iconObj;

                    } else if (lockButton.icon.iconName == "lock-open") {
                        let identifier = e.dsModel._properties.domId.value;
                        let selectedvalue = true;
                        let type = "lock";
                        let data = [identifier, selectedvalue, type];
                        lockButton.getContent().setAttribute("locked", "");
                        sendEvent(data);

                        var iconObj = {};
                        iconObj["iconName"] = "lock";
                        iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                        lockButton.icon = iconObj;
                    }
                });
                return lockButton;
            }


            function createItemLockButton(element, lockValue, preferenceItemKey, isAdminView, isCustomUI) {
                var lockButton = null;
                if (isAdminView) {
                    lockButton = createItemLockButtonForAdmin(lockValue, preferenceItemKey);
                }
                else {
                    lockButton = new WUXButton({
                        domId: preferenceItemKey + ".lock",
                        icon: {
                            iconName: "",
                            fontIconFamily: WUXManagedFontIcons.Font3DS
                        },
                        value: lockValue,
                        displayStyle: "lite"
                    });

                    if (lockButton.value == "true") {
                        var iconObj = {};
                        iconObj["iconName"] = "lock";
                        iconObj["fontIconFamily"] = WUXManagedFontIcons.Font3DS;
                        lockButton.icon = iconObj;
                        lockButton.getContent().setAttribute("locked", "");
                        if (!isCustomUI)
                            element.disabled = true;
                    }
                }
                return lockButton;
            }

            //Creates radio button component
            function createRadioButtonGroup(enumKey, isAdminView, lockValue) {

                let radioItemsValues = mepUIDataUtilsObj.getDataFromJsonResponse("enumValues", enumKey.split(".")[0], enumKey.split(".")[1], "values");
                let radioItemsArray = [];
                //Create button Group
                let buttonGroup = new WUXButtonGroup({ domId: enumKey, type: "radio" });

                if (radioItemsValues === null)
                    return buttonGroup;
                for (let i = 0; i < radioItemsValues.length; i++) {
                    radioItemsArray.push(getValueFromNLS(enumKey + "." + radioItemsValues[i] + ".Label", nlsJSON));
                }
                let numberOfValues = radioItemsArray.length;
                //repository needs to be considered
                for (let nbItems = 0; nbItems < numberOfValues; nbItems++) {
                    let radioItem = new WUXToggle({ domId: enumKey, type: "radio", label: radioItemsArray[nbItems], value: radioItemsValues[nbItems], checkFlag: false });
                    //For MePreference Page Objects.
                    radioItem.getContent().setAttribute("data-me-preferences-po-use-only-enum-key", "");
                    let selectedValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "value");
                    if (radioItem.value === selectedValue)
                        radioItem.checkFlag = true;
                    buttonGroup.addChild(radioItem);
                }

                buttonGroup.elements.container.setStyle("width", "calc(100% - 21px)");
                if (isAdminView) {
                    buttonGroup.elements.container.setStyle("border-left", "1px solid black");
                    buttonGroup.elements.container.setStyle("border-left-width", "thin");
                    buttonGroup.elements.container.setStyle("padding-left", "10px");
                } else if (lockValue == "true") {
                    buttonGroup.elements.container.setStyle("border-left", "1px solid black");
                    buttonGroup.elements.container.setStyle("border-left-width", "thin");
                    buttonGroup.elements.container.setStyle("padding-left", "10px");
                }

                //eventListener to update values in model
                buttonGroup.addEventListener("buttonclick", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = e.dsModel._properties.value.value;
                    let type = "radio";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                return buttonGroup;
            }

            //Creates checkbox component
            function createCheckButtonGroup(preferenceItemKey, repoKey) {

                let buttonItem = null;
        

                let strVal = mepUIDataUtilsObj.getDataFromJsonResponse(
                    "preferenceValues",
                    repoKey,
                    preferenceItemKey.split(".").pop(),
                    "value"
                );
                let bVal = "true" === strVal ? true : false;

                buttonItem = new WUXToggle({
                    domId: repoKey + "." + preferenceItemKey.split(".").pop(),

                    type: "checkbox",
                    label: getValueFromNLS(preferenceItemKey + ".Label", nlsJSON),
                    checkFlag: bVal,
                });

                buttonItem.addEventListener("buttonclick", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = buttonItem.checkFlag;
                    let type = "check";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                // buttonItem.inject(checkButtonDiv);
                // if (checkButtonObj) {
                //     let infoIconDiv = createInfoIcon(preferenceItemKey, nlsJSON);
                //     infoIconDiv.inject(checkButtonDiv);
                // }
                 return buttonItem;
                //return checkButtonDiv;
            }

            function createCustomControlButton(preferenceItemKey, repoKey, preferenceObj, lockValue) {
                var customButtonvalue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "value");
                let customButton = new WUXButton({
                    displayStyle: "lite",
                    label: getValueFromNLS(preferenceItemKey + ".Label", nlsJSON),
                    domId: repoKey + "." + preferenceItemKey.split(".").pop(),
                    value: customButtonvalue,
                    icon: {
                        iconName: "open-in-a-new-window",
                        fontIconFamily: WUXManagedFontIcons.Font3DS
                    }
                });
                customButton.getContent().addClassName('me-preference-json-item-btn');
                customButton.addEventListener("buttonclick", function (e) {
                    let selectionModelValue = MePreferencesSelectionModel.getUpdatedPreference(repoKey, preferenceObj.name);
                    let selectionModelLockstate = (MePreferencesSelectionModel.getUpdatedPreferenceLockState(repoKey, preferenceObj.name));
                    customButtonvalue = selectionModelValue ? selectionModelValue : customButton.value;
                    lockValue = selectionModelLockstate ? selectionModelLockstate.toString() : lockValue;

                    let displayName = getValueFromNLS(
                        preferenceItemKey + ".displayName",
                        nlsJSON
                    );
                    createCustomUI(preferenceObj, customButtonvalue, customButton.domId, lockValue, displayName);
                });
                return customButton;

            }

            function CreateErrorDialog() {
                var immersiveFrame = new WUXImmersiveFrame({
                    identifier: "me-error-dialog-immersive-frame"
                });

                var errorMessage = new UWA.Element("span", {
                    text: mePrefWidgetTranslation["ErrorNotification.Label"],
                    class: "errorMessageSpan"
                })

                let errorDialogContentDiv = new UWA.createElement("div", {
                    class: "errorDialogContentDiv"
                });
                errorMessage.inject(errorDialogContentDiv);

                var errorDialog = new WUXDialog({
                    width: 200,
                    immersiveFrame: immersiveFrame,
                    identifier: "mep-error-confirmation-dialog",
                    title: "Error",
                    content: errorDialogContentDiv,
                    activeFlag: false,
                    modalFlag: true,
                    position: {
                        my: "center",
                        at: "center",
                        of: immersiveFrame
                    }
                });

                if (errorDialog) {
                    errorDialog.addEventListener('close', function () {
                        //Remove Immersive Frame
                        removeImmersiveFrame();
                    });
                }

                function removeImmersiveFrame() {
                    //Get all immersive frames present in the application.
                    var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
                    for (let it = 0; it < immFramesList.length; it++) {
                        let immFrame = immFramesList[it];
                        //Remove the immersive frame added for MePreferenceDialog 
                        if (immFrame.dsModel.identifier == "me-error-dialog-immersive-frame") {
                            immFrame.remove();
                            break;
                        }
                    }
                    immersiveFrame = null;
                    //  document.dispatchEvent(removeImmEvent);
                }

                immersiveFrame.inject(document.body);
            }

            async function createCustomUI(preferenceObj, customButtonvalue, type_id, lockValue, displayName) {

                var serviceName = preferenceObj.hostservice;
                var endpoint = preferenceObj.endpoint;

                var tID = null;
                if(tenantID == undefined || tenantID == null) {
                    if(TENANT_ID)
                        tID = TENANT_ID;
                    else
                        tID = await MePreferencesPlatformServicesUtils.getTenant();
                }
                else
                    tID = tenantID;

                let dlgHeight = preferenceObj.frameheight ? preferenceObj.frameheight : null;
                let dlgWidth = preferenceObj.framewidth ? preferenceObj.framewidth : null;
                return await MePreferencesPlatformServicesUtils.getServiceUrl(tID, serviceName).then(async (serviceUrl) => {
                    if (serviceUrl) {
                        var completeUrl = serviceUrl + endpoint;
                        await MePreferencesCustomViewObj.createCustomDialog(completeUrl, customButtonvalue, type_id, lockValue, false, isAdminView, displayName, dlgHeight, dlgWidth, tID); //false parameter for isStandaloneUI
                    }
                    else {
                        CreateErrorDialog();
                    }

                });
            }

            //Creates ComboBox component
            function createComboBox(enumKey, sortmethod) {

                let comboBoxValues = mepUIDataUtilsObj.getDataFromJsonResponse("enumValues", enumKey.split(".")[0], enumKey.split(".")[1], "values");
                let comboBoxItems = [];
                let selIndex = -1;

                if (comboBoxValues) {
                    for (let i = 0; i < comboBoxValues.length; i++) {
                        comboBoxItems[i] = [];
                        comboBoxItems[i]["label"] = getValueFromNLS(enumKey + "." + comboBoxValues[i] + ".Label", nlsJSON);
                        comboBoxItems[i]["value"] = i;
                    }

                    let selectedValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "value");
                    for (let i = 0; i < comboBoxItems.length; i++) {
                        if (selectedValue === comboBoxValues[i]) {
                            selIndex = comboBoxItems[i].value;
                        }
                    }
                }

                if(sortmethod){
                        comboBoxItems = sortcomboBoxValues(comboBoxItems, sortmethod);
                    };

                let comboBox = new WUXComboBox({
                    domId: enumKey,
                    elementsList: comboBoxItems,
                    selectedIndex: selIndex,
                    enableSearchFlag: false,

                    actionOnClickFlag: false,
                });

                comboBox.elements.container.setStyle("width", "calc(100% - 21px)");

                comboBox.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    var selectedvalue = comboBoxValues[e.dsModel._properties.value.value];
                    let type = "enum";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                return comboBox;
            }

            //Creates colorpicker component
            function createColorPicker(preferenceItemKey, repoKey) {
                let colorValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "value").split('#').join("");
                let colorPicker = new WUXColorPicker({ domId: repoKey + "." + preferenceItemKey.split(".").pop(), value: colorValue });

                colorPicker.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = "#" + e.dsModel._properties.value.value;
                    let type = "color";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                return colorPicker;
            }

            //Creates Integer spin box component
            function createSpinBox(repoKey, preferenceItemKey, stepSize, tweakerType, nbDecimal) {

                let minVal = mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", repoKey, preferenceItemKey.split(".").pop(), "minValue");
                let nMinVal = ((minVal) ? Number(minVal) : undefined);
                let maxVal = mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", repoKey, preferenceItemKey.split(".").pop(), "maxValue");
                let nMaxVal = ((maxVal) ? Number(maxVal) : undefined);
                let val = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "value")
                let nVal = ((val) ? Number(val) : undefined);
                let spinBox = new WUXSpinBox({
                    domId: repoKey + "." + preferenceItemKey.split(".").pop(),
                    value: nVal,
                    minValue: nMinVal,
                    maxValue: nMaxVal,
                });

                spinBox.elements.container.style.width = "calc(100% - 21px)";

                if (tweakerType == "decimal") {
                    spinBox.decimals = nbDecimal;
                    spinBox.stepValue = (stepSize ? stepSize : 0.1);
                } else if (tweakerType == "percent") {
                    spinBox.units = "%";
                    if (nbDecimal) {
                        spinBox.stepValue = (stepSize ? stepSize : 0.1);
                        spinBox.decimals = nbDecimal;
                    } else {
                        spinBox.stepValue = (stepSize ? stepSize : 1);
                        spinBox.decimals = 0;
                    }
                } else {
                    spinBox.stepValue = (stepSize ? stepSize : 1);
                    spinBox.decimals = nbDecimal;
                }

                spinBox.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = e.dsModel._properties.value.value;
                    let type = tweakerType; //"Int";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                return spinBox;

            }

            //creates string lineeditor component

            function createLineEditor(preferenceItemKey, repoKey) {
                let lineEditor = new WUXLineEditor({
                    domId: repoKey + "." + preferenceItemKey.split(".").pop(),
                    placeholder: "Text",
                    maxLength: 255,
                    value: mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "value")
                });

                var customAttVal = repoKey + "." + preferenceItemKey.split(".").pop() + ".lineeditor";
                lineEditor.getContent().setAttribute("data-mepreferences-po-use-lineeditor", customAttVal);
                lineEditor.elements.container.style.width = "calc(100% - 21px)";

                lineEditor.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = e.dsModel._properties.value.value;
                    let type = "string";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });
                return lineEditor;

            }

            //Creates magnitude spin box component
            function createMagnitudeSpinBox(preferenceItemKey, repoKey, paramType, stepvalue, nbDecimal) {
                let suffix = null;
                if (paramType.toLowerCase() === "length") {
                    suffix = "mm";
                } else if (paramType.toLowerCase() === "angle") {
                    suffix = "deg";
                }

                let minVal = mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", repoKey, preferenceItemKey.split(".").pop(), "minValue");
                let nMinVal = ((minVal) ? Number(minVal) : undefined);
                let maxVal = mepUIDataUtilsObj.getDataFromJsonResponse("rangeValues", repoKey, preferenceItemKey.split(".").pop(), "maxValue");
                let nMaxVal = ((maxVal) ? Number(maxVal) : undefined);
                let val = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "value")
                let nVal = ((val) ? Number(val) : undefined);
                let datatype = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "datatype")

                let spinBox = new WUXSpinBox({
                    domId: repoKey + "." + preferenceItemKey.split(".").pop(),
                    units: suffix,
                    minValue: convertMKStoCGS(paramType, nMinVal),
                    maxValue: convertMKStoCGS(paramType, nMaxVal),
                });

                spinBox.elements.container.style.width = "calc(100% - 21px)";

                if (nbDecimal !== null || nbDecimal != undefined) {
                    spinBox.decimals = nbDecimal;
                } else {
                    if (datatype == "integer" || datatype == "int" || datatype == "uint")
                        nbDecimal = 0;
                    else
                        nbDecimal = 2;
                }
                if (!stepvalue) {
                    if (datatype) {
                        if (datatype == "integer" || datatype == "int" || datatype == "uint")
                            stepvalue = 1;
                        else {
                            stepvalue = 1 / Math.pow(10, nbDecimal);
                        }
                    }
                }
                spinBox.stepValue = stepvalue;
                let mag_value = convertMKStoCGS(paramType, nVal);
                mag_value = (mag_value).toFixed(nbDecimal);
                mag_value = (nbDecimal && nbDecimal >= 1) ? parseFloat(mag_value) : parseInt(mag_value);
                spinBox.value = mag_value;

                spinBox.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = convertCGStoMKS(paramType, e.dsModel._properties.value.value);
                    let type = "magnitude";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });
                return spinBox;
            }

            //Creates image Combobox component
            function createImageComboBox(enumKey, iconlist, sortmethod) {
                let comboBoxItems = [];
                let selIndex = -1;
                let comboBoxValues = mepUIDataUtilsObj.getDataFromJsonResponse("enumValues", enumKey.split(".")[0], enumKey.split(".")[1], "values");
                
                if (comboBoxValues) {
                    for (let i = 0; i < comboBoxValues.length; i++) {
                        let icondata = {};
                        comboBoxItems[i] = [];
                        comboBoxItems[i]["label"] = getValueFromNLS(enumKey + "." + comboBoxValues[i] + ".Label", nlsJSON);
                        comboBoxItems[i]["value"] = i;
                        if (iconlist[i] != null) {
                            if (iconlist[i].split(',')[0] === "data:image/png;base64") {
                                icondata["iconPath"] = iconlist[i];
                                comboBoxItems[i]["icon"] = icondata;
                            }
                            else {
                                comboBoxItems[i]["icon"] = iconlist[i];
                            }
                        }
                    }

                    if(sortmethod){
                        comboBoxItems = sortcomboBoxValues(comboBoxItems, sortmethod);
                    };

                    let selectedValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "value");
                    for (let i = 0; i < comboBoxItems.length; i++) {
                        if (selectedValue === comboBoxValues[i]) {
                            selIndex = comboBoxItems[i].value;
                        }
                    }
                }

                let myComboBox = new WUXComboBox({
                    domId: enumKey,
                    elementsList: comboBoxItems,
                    selectedIndex: selIndex,
                    enableSearchFlag: false,
                    actionOnClickFlag: false,
                    mainElementContent: "all"
                });

                myComboBox.elements.container.setStyle("width", "calc(100% - 21px)");

                myComboBox.addEventListener("change", function (e) {
                    let identifier = e.dsModel._properties.domId.value;
                    let selectedvalue = comboBoxValues[e.dsModel._properties.value.value];
                    let type = "enum";
                    let data = [identifier, selectedvalue, type];
                    sendEvent(data);
                });

                return myComboBox;
            }

            function createLabel(style, labelText) {
                return new UWA.createElement("div", {
                    class: style,
                    html: labelText,
                });
            }

            function createDescriptionBlock(preferenceItemKey) {
                let numberOfRows = 1;

                if (getValueFromNLS(preferenceItemKey + ".Description", nlsJSON).contains('\n'))
                    numberOfRows = (getValueFromNLS(preferenceItemKey + ".Description", nlsJSON)).split('\n').length;

                if (numberOfRows > 10)
                    numberOfRows = 10;

                let prefItemDesc = new WUXEditor({
                    value: getValueFromNLS(preferenceItemKey + ".Description", nlsJSON),
                    requiredFlag: false,
                    resizableFlag: true,
                    disabled: true,
                    nbRows: numberOfRows
                });

                prefItemDesc.getContent().getChildren()[0].setAttribute('style', "color:black;background-color:white;width:100%;overflow:hidden");

                let prefItemDescContainer = new UWA.createElement('div', {
                    'class': 'me-preference-item-container-desc'
                });

                prefItemDesc.inject(prefItemDescContainer);

                return prefItemDescContainer;
            }

            //Creates UI for PreferenceItem
            function createPreferenceItem(preferenceItemKey, preferenceObj) {
                let preferenceType = preferenceObj.tweakertype;
                let preferenceItemContent = createDiv("me-preference-item");
                let element = null;
                let label = null;
                let labelOnRightFlag = true;
                var LockButton;
                var infoIcon = null;
                var lockButtonDiv = new UWA.createElement("div", {
                    "class": "itemlockbutton"
                });
                // var ButtongrplockAlignDiv = new UWA.createElement("div", {
                //     "class": "buttongrplockclass"
                // });
                // var colorlockAlignDiv = new UWA.createElement("div", {
                //     "class": "colorpickerlockclass"
                // });
                // var checkboxLockDiv = new UWA.createElement("div", {
                //     "class": "checkboxlockclass"
                // });

                if (preferenceType.toLowerCase() === "radio") {
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "lockState");
                    element = createRadioButtonGroup(enumKey, isAdminView, lockValue);
                    LockButton = createItemLockButton(element, lockValue, enumKey, isAdminView);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "boolean") {
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    let checkButtonObj = getTooltipInfos(preferenceItemKey, nlsJSON);

                    element = new UWA.createElement("div", {
                        class: "check-button",
                        styles: {
                            display: "flex",
                        },
                    });
                    
                    let buttonItem = createCheckButtonGroup(preferenceItemKey, repoKey);
                   // element = createCheckButtonGroup(preferenceItemKey, repoKey);
                    buttonItem.inject(element);
                    if (checkButtonObj) {
                        let infoIconDiv = createInfoIcon(preferenceItemKey, nlsJSON);
                        infoIconDiv.inject(element);
                    }
                    // checkBox.inject(element);
                    LockButton = createItemLockButton(buttonItem, lockValue, enumKey, isAdminView);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "enum") {
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let sortmethod = null;
                    if(preferenceObj.sortmethod && (preferenceObj.sortmethod.toLowerCase() === 'atoz' || preferenceObj.sortmethod.toLowerCase() === 'ztoa' || preferenceObj.sortmethod.toLowerCase() === 'desc' || preferenceObj.sortmethod.toLowerCase() === 'aesc'))
                        sortmethod = preferenceObj.sortmethod;
                    let comboBox = createComboBox(enumKey, sortmethod);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "lockState");
                    element = createDiv("me-preference-control-right");
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    labelOnRightFlag = false;
                    comboBox.inject(element);
                    LockButton = createItemLockButton(comboBox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "color") {
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let colorPicker = createColorPicker(preferenceItemKey, repoKey);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    element = createDiv("color-picker-content");
                    colorPicker.inject(element);
                    label = createLabel("me_preference_label_right", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    LockButton = createItemLockButton(colorPicker, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "integer" || preferenceType.toLowerCase() === "uint") {
                    let stepValue = undefined;
                    if (preferenceObj.stepSize != null && preferenceObj.stepSize != undefined)
                        stepValue = parseInt(preferenceObj.stepsize);
                    let nbDecimal = 0;
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    element = createDiv("me-preference-control-right");
                    labelOnRightFlag = false;
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let spinbox = createSpinBox(repoKey, preferenceItemKey, stepValue, "Int", nbDecimal);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    spinbox.inject(element);
                    LockButton = createItemLockButton(spinbox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "float" || preferenceType.toLowerCase() === "double") {
                    let stepValue = undefined;
                    if (preferenceObj.stepsize != null && preferenceObj.stepsize != undefined)
                        stepValue = parseFloat(preferenceObj.stepsize);
                    let nbDecimal = preferenceObj.nbdecimal ? parseInt(preferenceObj.nbdecimal) : undefined;
                    if (nbDecimal == undefined)
                        nbDecimal = 2;
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    element = createDiv("me-preference-control-right");
                    labelOnRightFlag = false;
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let spinbox = createSpinBox(repoKey, preferenceItemKey, stepValue, "decimal", nbDecimal);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    spinbox.inject(element);
                    LockButton = createItemLockButton(spinbox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "string") {
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    element = createDiv("me-preference-control-right");
                    labelOnRightFlag = false;
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let lineEditor = createLineEditor(preferenceItemKey, repoKey);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    lineEditor.inject(element);
                    LockButton = createItemLockButton(lineEditor, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "percentage") {
                    let stepValue = undefined;
                    if (preferenceObj.stepsize != null && preferenceObj.stepsize != undefined)
                        stepValue = parseFloat(preferenceObj.stepsize);
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    element = createDiv("me-preference-control-right ");
                    labelOnRightFlag = false;
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let spinbox = createSpinBox(repoKey, preferenceItemKey, stepValue, "percent");
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    spinbox.inject(element);
                    LockButton = createItemLockButton(spinbox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);

                }
                else if (preferenceType.toLowerCase() === "imagecombo") {
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let iconlist = geticons(preferenceObj.icons);
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    let sortmethod = null;
                    if(preferenceObj.sortmethod && (preferenceObj.sortmethod.toLowerCase() === 'atoz' || preferenceObj.sortmethod.toLowerCase() === 'ztoa' || preferenceObj.sortmethod.toLowerCase() === 'desc' || preferenceObj.sortmethod.toLowerCase() === 'aesc'))
                        sortmethod = preferenceObj.sortmethod;
                    let comboBox = createImageComboBox(enumKey, iconlist, sortmethod);
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", enumKey.split(".")[0], enumKey.split(".")[1], "lockState");
                    element = createDiv("me-preference-control-right ");
                    labelOnRightFlag = false;
                    comboBox.inject(element);
                    LockButton = createItemLockButton(comboBox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(enumKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "json") {
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let isCustomUI = true;
                    element = createDiv("me-preference-control-left");

                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    let dialogButton = createCustomControlButton(preferenceItemKey, repoKey, preferenceObj, lockValue);

                    dialogButton.inject(element);
                    labelOnRightFlag = false;
                    LockButton = createItemLockButton(dialogButton, lockValue, enumKey, isAdminView, isCustomUI);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }
                else if (preferenceType.toLowerCase() === "magnitude") {
                    let repoKey = getRepository(preferenceObj);
                    let enumKey = getRepository(preferenceObj) + "." + preferenceObj.name;
                    let stepValue = undefined;
                    if (preferenceObj.stepsize != null && preferenceObj.stepsize != undefined)
                        stepValue = parseFloat(preferenceObj.stepsize);
                    label = createLabel("me-preference-label-left", getValueFromNLS(preferenceItemKey + ".Label", nlsJSON));
                    element = createDiv("me-preference-control-right");
                    let nbDecimal = preferenceObj.nbdecimal ? parseInt(preferenceObj.nbdecimal) : undefined;
                    if (nbDecimal == undefined)
                        nbDecimal = 0;
                    let spinBox = createMagnitudeSpinBox(
                        preferenceItemKey,
                        repoKey,
                        preferenceObj.paramType,
                        stepValue,
                        nbDecimal
                    );
                    let lockValue = mepUIDataUtilsObj.getDataFromJsonResponse("preferenceValues", repoKey, preferenceItemKey.split(".").pop(), "lockState");
                    spinBox.inject(element);
                    labelOnRightFlag = false;
                    LockButton = createItemLockButton(spinBox, lockValue, enumKey, isAdminView);
                    infoIcon = createInfoIcon(preferenceItemKey, nlsJSON);
                    LockButton.inject(lockButtonDiv);
                    lockButtonDiv.inject(preferenceItemContent);
                }

                // infoicon Div exists, then injected into Label D
                if (infoIcon) {
                    infoIcon.inject(label);
                }

                addControlToContainer(
                    preferenceItemContent,
                    element,
                    label,
                    labelOnRightFlag
                );

                return preferenceItemContent;
            }

            function addControlToContainer(container, element, label, labelOnRightFlag) {
                if (container) {
                    if (!labelOnRightFlag) {
                        if (label !== null)
                            label.inject(container);
                        element.inject(container);
                    }
                    else {
                        element.inject(container);
                        if (label !== null)
                            label.inject(container);
                    }
                }
            }

            //To get icons for any component- 3dSicons as well as user defined
            function geticons(icondata) {
                let iconlist = [];

                if (icondata) {
                    for (let i = 0; i < icondata.length; i++) {
                        if (icondata[i].includes(".")) {
                            let iconpath = null;
                            for (let j = 0; j < iconObj.length; j++) {
                                if (iconObj[j].fileName === icondata[i]) {
                                    iconpath = "data:image/png;base64," + iconObj[j].data;
                                    break;
                                }
                                else if (j === iconObj.length) {
                                    i++;
                                }
                            }
                            iconlist.push(iconpath);
                        }
                        else {
                            iconlist.push(icondata[i]);
                        }
                    }

                }
                return iconlist;
            }


            //Counts number of children of section- needs to do sanitisation in future		
            function GetNbChildren(UIdata) {
                let childrencount = null;
                for (let i = 0; i < UIdata.length; i++) {
                    if (UIdata[i].type.toLowerCase() === "preferencegroup" || UIdata[i].type.toLowerCase() === "preferenceitem") {
                        childrencount++;
                    }
                }
                return childrencount;
            }

            //Creates Group titles/ headings
            function createGroupTitle(groupKey, groupType) {

                if ((groupType.toLowerCase() === "header") || (groupType.toLowerCase() === "table") || (groupType.toLowerCase() === "expander")) {
                    let grpTitle = new UWA.createElement("h5", {
                        "class": "me-preference-group-title",
                        text: getValueFromNLS(groupKey + ".Title", nlsJSON),
                        style: {
                            display: "flex"
                        },
                    });
                    let infoObj = createInfoIcon(groupKey, nlsJSON);
                    if (infoObj) {
                        infoObj.inject(grpTitle);
                    }
                    return grpTitle;
                }
            }

            //creates group Content for header, expander, table
            //Supports group within group
            function CreateGroupContent(groupKey, childrenObj) {
                let repoFlag = false;
                let colheader = null;
                let colicons = null;
                let node = null;
                let tableKey = null;

                let prefItemContent = null;
                let preferenceItemKey = null;
                let groupContent = createDiv("me-preferences-all-itmes-in-a-group");
                groupContent.id = groupKey;

                if (childrenObj.tweakertype.toLowerCase() === "expander") {

                    let groupexpandercontent = createDiv("me-preferences-group-expander-content");

                    let numberofChildrenInGroup = childrenObj["children"].length;
                    let groupChildrenList = childrenObj["children"];

                    if (childrenObj.repository) {
                        repoarray.push(childrenObj.repository);
                        repoFlag = true;
                    }

                    for (let grpChildrenCnt = 0; grpChildrenCnt < numberofChildrenInGroup; grpChildrenCnt++) {

                        let grpChildrenObj = groupChildrenList[grpChildrenCnt];
                        let grpChildrenType = groupChildrenList[grpChildrenCnt].type;

                        preferenceItemKey = groupKey + "." + grpChildrenObj.name;
                        if (grpChildrenType.toLowerCase() === "preferenceitem") {
                            let prefContent = createDiv('me-preference-item-with-attributes');
                            prefItemContent = createPreferenceItem(preferenceItemKey, grpChildrenObj);

                            if ((/true/i).test(childrenObj.description)) {
                                let descriptionContent = createDescriptionBlock(preferenceItemKey);
                                descriptionContent.inject(prefContent);
                            }
                            prefItemContent.inject(prefContent);

                            if (prefContent) {
                                prefContent.inject(groupexpandercontent);
                            }
                        }
                        else {
                            let subgroup = CreateGroupContent(preferenceItemKey, grpChildrenObj);
                            if (subgroup)
                                subgroup.inject(groupexpandercontent);
                        }
                    }

                    if (repoFlag == true)
                        repoarray.pop();

                    let groupexpander = new WUXAccordeon({
                        items: [{
                            header: getValueFromNLS(groupKey + ".Title", nlsJSON),
                            content: groupexpandercontent,
                            customHeader: createInfoIcon(groupKey, nlsJSON),
                            customHeaderPosition: "near",
                        }],
                        style: "divided",
                        exclusive: false
                    });

                    if (childrenObj["expanded"] && childrenObj["expanded"] == "false")
                        groupexpander._expanderItems[0].expandedFlag = false;
                    else
                        groupexpander._expanderItems[0].expandedFlag = true;

                    groupexpander.elements.expander.elements.header.setStyle("background-color", "white");
                    groupexpander.elements.container.getChildren()[0].setAttribute('data-mepreferences-po-use-only', groupKey);
                    groupexpander.inject(groupContent);

                }
                else if (childrenObj.tweakertype.toLowerCase() === "header") {
                    let groupTitleContent = createGroupTitle(groupKey, childrenObj.tweakertype);
                    groupTitleContent.inject(groupContent);
                    let numberofChildrenInGroup = childrenObj["children"].length;
                    let groupChildrenList = childrenObj["children"];
                    if (childrenObj.repository) {
                        repoarray.push(childrenObj.repository);
                        repoFlag = true;
                    }

                    for (let grpChildrenCnt = 0; grpChildrenCnt < numberofChildrenInGroup; grpChildrenCnt++) {

                        let grpChildrenObj = groupChildrenList[grpChildrenCnt];
                        let grpChildrenType = groupChildrenList[grpChildrenCnt].type;

                        preferenceItemKey = groupKey + "." + grpChildrenObj.name;
                        if (grpChildrenType.toLowerCase() === "preferenceitem") {
                            let prefContent = createDiv('me-preference-item-with-attributes')
                            prefItemContent = createPreferenceItem(preferenceItemKey, grpChildrenObj);

                            if ((/true/i).test(grpChildrenObj.description)) {
                                let descriptionContent = createDescriptionBlock(preferenceItemKey);
                                descriptionContent.inject(prefContent);
                            }

                            prefItemContent.inject(prefContent);

                            if (prefContent) {
                                prefContent.inject(groupContent);
                            }
                        }
                        else {
                            let subgroup = CreateGroupContent(preferenceItemKey, grpChildrenObj);
                            if (subgroup)
                                subgroup.inject(groupContent);
                        }
                    }
                    if (repoFlag == true)
                        repoarray.pop();
                }
                else if (childrenObj.tweakertype.toLowerCase() === "selector") {
                    var selectorContentDiv = createDiv("me-preferences-selector-div");

                    let numberofChildrenInGroup = childrenObj["children"].length;
                    let groupChildrenList = childrenObj["children"];
                    if (childrenObj.repository) {
                        repoarray.push(childrenObj.repository);
                        repoFlag = true;
                    }
                    let comboBoxValues = [];

                    for (let grpChildrenCnt = 0; grpChildrenCnt < numberofChildrenInGroup; grpChildrenCnt++) {
                        let grpChildrenObj = groupChildrenList[grpChildrenCnt];
                        let grpChildrenType = groupChildrenList[grpChildrenCnt].type;
                        if (grpChildrenType.toLowerCase() === "preferencegroup") {
                            comboBoxValues.push(grpChildrenObj.name);
                        }
                        let selectorDiv = createDiv("me-preferences-group-selector-" + groupKey + "-" + grpChildrenObj.name);
                        for (let subGrpChildrenCnt = 0; subGrpChildrenCnt < grpChildrenObj.children.length; subGrpChildrenCnt++) {

                            let subGrpChildrenObj = grpChildrenObj.children[subGrpChildrenCnt];
                            preferenceItemKey = groupKey + "." + grpChildrenObj.name + "." + subGrpChildrenObj.name;
                            let grpChildrenType = subGrpChildrenObj.type;
                            if (grpChildrenType.toLowerCase() === "preferenceitem") {
                                let prefContent = createDiv('me-preference-item-with-attributes')
                                prefItemContent = createPreferenceItem(preferenceItemKey, subGrpChildrenObj);

                                if ((/true/i).test(childrenObj.description)) {
                                    let descriptionContent = createDescriptionBlock(preferenceItemKey);
                                    descriptionContent.inject(prefContent);
                                }

                                prefItemContent.inject(prefContent);

                                if (prefContent) {
                                    prefContent.inject(selectorDiv);
                                }
                            }
                            else {
                                let subgroup = CreateGroupContent(preferenceItemKey, subGrpChildrenObj);
                                if (subgroup)
                                    subgroup.inject(selectorDiv);
                            }
                        }
                        if (grpChildrenCnt === 0)
                            selectorDiv.style.display = 'block';
                        else
                            selectorDiv.style.display = 'none';
                        selectorDiv.inject(selectorContentDiv);
                    }

                    let comboBoxItems = [];
                    let selIndex = -1;

                    if (comboBoxValues) {
                        for (let i = 0; i < comboBoxValues.length; i++) {
                            comboBoxItems[i] = [];
                            comboBoxItems[i]["label"] = getValueFromNLS(groupKey + "." + comboBoxValues[i] + ".Title", nlsJSON);
                            comboBoxItems[i]["value"] = i;
                        }

                        let selectedValue = comboBoxValues[0];
                        for (let i = 0; i < comboBoxItems.length; i++) {
                            if (selectedValue === comboBoxValues[i]) {
                                selIndex = comboBoxItems[i].value;
                            }
                        }
                    }

                    let selectorComboBox = new WUXComboBox({
                        domId: groupKey,
                        elementsList: comboBoxItems,
                        selectedIndex: selIndex,
                        enableSearchFlag: false,
                        actionOnClickFlag: true,
                    });

                    selectorComboBox.addEventListener("click", e => {
                        e.stopPropagation();
                    });

                    selectorComboBox.addEventListener("change", function (e) {

                        var selectedvalue = comboBoxValues[e.dsModel._properties.value.value];
                        var domID = e.dsModel._properties.domId.value;
                        let identifier = "me-preferences-group-selector-"+ domID + "-" + selectedvalue;

                        let curElementList = document.querySelectorAll(`div[class^="me-preferences-group-selector-${domID}"]`);
                        if (curElementList.length > 0) {

                            for (let i = 0; i < curElementList.length; i++) {
                                if (curElementList[i].style.display === 'block')
                                    curElementList[i].style.display = 'none';
                            }
                        }

                        let elem = document.getElementsByClassName(identifier);
                        if(elem)
                            elem[0].style.display = 'block';

                    });

                    var groupexpander = new WUXAccordeon({
                        items: [{
                            header: getValueFromNLS(groupKey + ".Title", nlsJSON),
                            content: selectorContentDiv,
                            customHeader: selectorComboBox,
                            expandedFlag: true,
                            customHeaderPosition: "near"
                        }],
                        style: "simple",
                        exclusive: false
                    });

                    groupexpander.elements.expander.elements.header.setStyle("background-color", "white");
                    groupexpander.inject(groupContent);

                }
                else if (childrenObj.tweakertype.toLowerCase() === "table" && isAdminView) {

                    mepAdminTableBuilderObj = new MEPAdminTableBuilder();

                    let tablemodel = new TreeDocument();
                    tablemodel.prepareUpdate();
                    let groupTitleContent = createGroupTitle(groupKey, childrenObj.tweakertype);
                    groupTitleContent.inject(groupContent);
                    let numberofChildrenInGroup = childrenObj["children"].length;
                    let groupChildrenList = childrenObj["children"];

                    if (childrenObj.repository) {
                        repoarray.push(childrenObj.repository);
                        repoFlag = true;
                    }

                    for (let grpChildrenCnt = 0; grpChildrenCnt < numberofChildrenInGroup; grpChildrenCnt++) {

                        let grpChildrenObj = groupChildrenList[grpChildrenCnt];
                        let grpChildrenType = groupChildrenList[grpChildrenCnt].type;

                        preferenceItemKey = groupKey + "." + grpChildrenObj.name;
                        if (grpChildrenType.toLowerCase() === "tableheader") {
                            tableKey = groupKey;
                            colheader = grpChildrenObj.name;
                            colicons = grpChildrenObj.icons;
                        }
                        else if (grpChildrenType.toLowerCase() === "tabledata") {
                            node = mepAdminTableBuilderObj.getNodeData(preferenceItemKey, grpChildrenObj, mepUIDataUtilsObj);
                            tablemodel.addChild(node);
                        }
                        else {
                            let subgroup = CreateGroupContent(preferenceItemKey, grpChildrenObj);
                            if (subgroup)
                                subgroup.inject(groupContent);
                        }

                        if (grpChildrenType.toLowerCase() === "tabledata" && grpChildrenCnt == numberofChildrenInGroup - 1) {
                            tablemodel.pushUpdate();
                            tableModelArray.push(tablemodel);
                            prefItemContent = mepAdminTableBuilderObj.createAdminTableDGV(colheader, colicons, tablemodel, tableKey, nlsJSON);
                        }

                        if (prefItemContent)
                            prefItemContent.inject(groupContent);
                    }
                    if (repoFlag == true)
                        repoarray.pop();

                }

                else if (childrenObj.tweakertype.toLowerCase() === "table" && (!isAdminView)) {

                    mepTableBuilderObj = new MEPTableBuilder();

                    let tablemodel = new TreeDocument();
                    tablemodel.prepareUpdate();
                    let groupTitleContent = createGroupTitle(groupKey, childrenObj.tweakertype);
                    groupTitleContent.inject(groupContent);
                    let numberofChildrenInGroup = childrenObj["children"].length;
                    let groupChildrenList = childrenObj["children"];

                    if (childrenObj.repository) {
                        repoarray.push(childrenObj.repository);
                        repoFlag = true;
                    }

                    for (let grpChildrenCnt = 0; grpChildrenCnt < numberofChildrenInGroup; grpChildrenCnt++) {

                        let grpChildrenObj = groupChildrenList[grpChildrenCnt];
                        let grpChildrenType = groupChildrenList[grpChildrenCnt].type;

                        preferenceItemKey = groupKey + "." + grpChildrenObj.name;
                        if (grpChildrenType.toLowerCase() === "tableheader") {
                            tableKey = groupKey;
                            colheader = grpChildrenObj.name;
                            colicons = grpChildrenObj.icons;
                        }
                        else if (grpChildrenType.toLowerCase() === "tabledata") {
                            node = mepTableBuilderObj.getNodeData(preferenceItemKey, grpChildrenObj, mepUIDataUtilsObj);
                            tablemodel.addChild(node);
                        }
                        else {
                            let subgroup = CreateGroupContent(preferenceItemKey, grpChildrenObj);
                            if (subgroup)
                                subgroup.inject(groupContent);
                        }

                        if (grpChildrenType.toLowerCase() === "tabledata" && grpChildrenCnt == numberofChildrenInGroup - 1) {
                            tablemodel.pushUpdate();
                            tableModelArray.push(tablemodel);
                            prefItemContent = mepTableBuilderObj.createTableDGV(colheader, colicons, tablemodel, tableKey, nlsJSON);
                        }

                        if (prefItemContent)
                            prefItemContent.inject(groupContent);
                    }
                    if (repoFlag == true)
                        repoarray.pop();
                }

                return groupContent;

            }

            //creates section Content
            async function CreatePageContent(pageContentArray) {

                let numberOfSections = GetNbSections(UIJson.UIModel);
                let sectionKey = "";
                let groupKey = "";
                let prefItemContent = null;
                let groupContent = null;
                let preferenceItemKey = null;
                let repoFlag = false;


                for (let sectionCnt = 0; sectionCnt < numberOfSections; sectionCnt++) {
                    let sectionObj = UIJson.UIModel[sectionCnt];
                    sectionKey = sectionObj.name;
                    preferenceItemKey = sectionKey;
                    groupKey = sectionKey;
                    if (sectionObj.repository) {
                        repoarray.push(sectionObj.repository);
                        repoFlag = true;
                    }
                    let numberOfChildern = GetNbChildren(UIJson.UIModel[sectionCnt]["children"]);
                    let childrenList = UIJson.UIModel[sectionCnt]["children"];
                    for (let childrenCnt = 0; childrenCnt < numberOfChildern; childrenCnt++) {
                        prefItemContent = null;
                        groupContent = null;
                        let childrenObj = childrenList[childrenCnt];
                        let childrenType = childrenList[childrenCnt].type;
                        if (childrenType === "PreferenceItem") {
                            let prefContent = createDiv('me-preference-item-with-attributes')
                            preferenceItemKey = preferenceItemKey + "." + childrenObj.name;
                            prefItemContent = createPreferenceItem(preferenceItemKey, childrenObj);

                            if ((/true/i).test(childrenObj.description)) {
                                let descriptionContent = createDescriptionBlock(preferenceItemKey);
                                descriptionContent.inject(prefContent);
                            }

                            if (prefItemContent)
                                prefItemContent.inject(prefContent);

                            preferenceItemKey = sectionKey;
                            prefContent.inject(pageContentArray[sectionCnt].content);

                        }
                        else if (childrenType === "PreferenceGroup") {
                            groupKey = sectionKey + "." + childrenObj.name;
                            preferenceItemKey = groupKey;
                            groupContent = CreateGroupContent(groupKey, childrenObj);

                            if (groupContent)
                                groupContent.inject(pageContentArray[sectionCnt].content);

                            preferenceItemKey = sectionKey;
                        }
                    }

                    if (repoFlag == true)
                        repoarray.pop();
                }
            }


            CreatePageContent(pageContentArray);

            return dialogContent;
        };

        var sectionAccordeon;
        var dialogContent;
        var pageContentArray;;

        mePrefernceUIBuilder.prototype.createSections = function (UIJson, nlsJSON) {

            pageContentArray = [];

            sectionAccordeon = new WUXAccordeon({
                style: "divided",
                exclusive: false
            });
            dialogContent = new UWA.createElement("div", {
                "class": "me-preferences-dialog-content"
            });

            let numberOfSections = GetNbSections(UIJson.UIModel);
            for (let sectionCnt = 0; sectionCnt < numberOfSections; sectionCnt++) {

                var sectionDiv = new UWA.createElement("div", {
                    "class": "me-preferences-section"
                });
                let sectionObj = UIJson.UIModel[sectionCnt];
                let sectionKey = sectionObj.name;
                pageContentArray.push({
                    "header": getValueFromNLS(sectionKey + ".Title", nlsJSON),
                    content: sectionDiv,
                    customHeader: createInfoIcon(sectionKey, nlsJSON),
                    customHeaderPosition: "near"
                });
            }
            sectionAccordeon.items = pageContentArray;
            for (let sectionCnt = 0; sectionCnt < numberOfSections; sectionCnt++) {
                let sectionObj = UIJson.UIModel[sectionCnt];
                let sectionKey = sectionObj.name;
                if (sectionObj["expanded"] && sectionObj["expanded"] == "false")
                    sectionAccordeon._expanderItems[sectionCnt].expandedFlag = false;
                else
                    sectionAccordeon._expanderItems[sectionCnt].expandedFlag = true;
                sectionAccordeon.elements.container.getChildren()[sectionCnt].setAttribute('data-mepreferences-po-use-only', sectionKey);
            }

            sectionAccordeon.inject(dialogContent);
            return dialogContent;
        }

        mePrefernceUIBuilder.prototype.getUpdatedTablePreferences = function () {
            let preferences = [];
            for (let tableCnt = 0; tableCnt < tableModelArray.length; tableCnt++) {
                if (mepTableBuilderObj) {
                    let prefArray = mepTableBuilderObj.getModifiedPreferences(tableModelArray[tableCnt], mepUIDataUtilsObj);
                    preferences = preferences.concat(prefArray);
                }
            }
            return preferences;
        };

        mePrefernceUIBuilder.prototype.reset = function () {
            if (tableModelArray) {
                tableModelArray = [];
            }
            if (mepAdminTableBuilderObj) {
                mepAdminTableBuilderObj.reset()
            }
            else if (mepTableBuilderObj) {
                mepTableBuilderObj.reset()
            }
        };

        return mePrefernceUIBuilder;

    });
