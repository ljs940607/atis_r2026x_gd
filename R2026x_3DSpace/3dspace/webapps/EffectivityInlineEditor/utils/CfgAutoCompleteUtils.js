/**
 * @quickreview ELY2 24:12:05 IR-1312998 - <Variability_Group> tag now works the same as <Variant> tag
 * @quickreview ELY2 24:12:05 Moved VariantJSONtoXMLConverter from CfgXMLServices to CfgAutoCompleteUtils - Packaging errors
 * @quickreview ELY2 24:06:20 getExpressions - Removed the use of convertAutoCompletePresenterExpression to support parentheses in EffectivityInlineEditor
 **/

define('DS/EffectivityInlineEditor/utils/CfgAutoCompleteUtils', ['DS/CfgDictionary/CfgDictionaryOperatorEnum', 'DS/CfgDictionary/CfgDictionaryTypeEnum', 'DS/CfgBaseUX/scripts/CfgXMLServices', 'DS/CfgBaseUX/scripts/CfgUtility', 'i18n!DS/EffectivityInlineEditor/assets/nls/EffectivityInlineEditor'], function (
    CfgDictionaryOperatorEnum,
    CfgDictionaryTypeEnum,
    CfgXMLServices,
    CfgUtility,
    AppNLS
) {
    'use strict';

    var CfgAutoCompleteUtils = {
        /**
         * Convert AutoCompletePresenterExpression format to varEffJsonWithLabel format
         * @param {Object} AutoCompletePresenter expression format
         * @param {Object} dico mapped by id (as returned by createMapsFromDico)
         * @return {Object[]} varEffJsonWithLabel format
         */
        //convertAutoCompletePresenterExpression: function (aCPformat, dicoMappedById) {
        //    var rez = [];
        //    var currentCombination = [];
        //    var currentFeature = null;
        //    var isNOT = false;
        //    var selectionVal = '';

        //    aCPformat.forEach(function (expr) {
        //        if (expr.id === CfgDictionaryOperatorEnum.not_id) {
        //            isNOT = true;
        //        } else if (expr.type === CfgDictionaryTypeEnum.VARIANT) {
        //            // Variant (aka Feature), we push the variant name as Feature value and label
        //            var variant = dicoMappedById[expr.id];
        //            currentFeature = { Feature: { value: variant.attributes._value, label: variant.attributes._title }, Options: [] };
        //        } else if (expr.type === CfgDictionaryTypeEnum.VALUE) {
        //            // Variant value (aka Option), we push the variant value name as Option value and label and add it to currentFeature / Options object
        //            var varValue = dicoMappedById[expr.id];
        //            // Depending on selection value, NOT operator to be included in currentCombination is decided.
        //            if (isNOT === true) selectionVal = 'R';
        //            else selectionVal = 'S';
        //            currentFeature.Options.push({ Option: { value: varValue.attributes._value, label: varValue.attributes._title, selection: selectionVal } });
        //        } else if (expr.type === CfgDictionaryTypeEnum.OPTION) {
        //            // Option (aka ConfigurationOption for ConfigurationFeature / Multiple), we push the option w/ his corresponding Feature
        //            var optValue = dicoMappedById[expr.id];
        //            var optFeature = dicoMappedById[optValue.feature_id];
        //            // Depending on selection value, NOT operator to be included in currentCombination is decided.
        //            if (isNOT === true) selectionVal = 'R';
        //            else selectionVal = 'S';

        //            currentFeature = {
        //                Feature: {
        //                    value: optFeature.attributes._value,
        //                    label: optFeature.attributes._title,
        //                },
        //                Options: [{ Option: { value: optValue.attributes._value, label: optValue.attributes._title, selection: selectionVal } }],
        //            };
        //        } else if (expr.id === CfgDictionaryOperatorEnum.or_id) {
        //            // OR operator, push current combination
        //            currentCombination.push(currentFeature);
        //            rez.push({ Combination: currentCombination });
        //            currentCombination = [];
        //            isNOT = false;
        //        } else if (expr.id === CfgDictionaryOperatorEnum.and_id) {
        //            // AND operator, push current feature in current combination
        //            currentCombination.push(currentFeature);
        //            currentFeature = null;
        //            isNOT = false;
        //        }
        //    });

        //    // Don't forget to add current feature to current combination and current combination to final result
        //    if (currentFeature !== null) {
        //        currentCombination.push(currentFeature);
        //    }
        //    if (currentCombination.length > 0) {
        //        // Edge case : completely empty expression, don't push an empty object
        //        rez.push({ Combination: currentCombination });
        //    }
        //    return rez;
        //},
        /**
         * @param output_json :
         * Used to convert json output in xml format for saving user selection.
         * VariantJSONtoXMLConverter is called from
         * 1. method "setVariantEffectivity" in file "EffectivityInlineEditor.js" for saving Variant Effectivity from Inline Variant componant.
         * 2. method "setVariantEffectivity" in file "CfgEffectivityColumns.js" for saving Variant Effectivity from Inline Variant dialog (old implementation for Product structure Editor widget)
         */
        VariantJSONtoXMLConverter: function (output_ACP) {
            let xmlexpr = '';
            // cases :
            // # 1 :   <Variant><Value>
            // # 2 :   <Variability Group><Option>
            // # 3 :   <Option>

            for (var count = 0; count < output_ACP.effectivity.length; count++) {
                var ACPobjEffExp = output_ACP.effectivity[count];

                if (ACPobjEffExp.aCPformat.length == 0) {
                    continue;
                }

                xmlexpr += '<Context HolderType = "Model" HolderName = "' + ACPobjEffExp.name + '">';

                //<OR> <AND> tags begin after <Context> tag
                var startExpr = xmlexpr.length;
                let listofindexforinsert = [startExpr];
                let lastindextoinsert = startExpr;

                let typetoclose = [];
                let previoustype = '';

                ACPobjEffExp.aCPformat.forEach(function (expr) {
                    if (expr.type === CfgDictionaryTypeEnum.VARIANT || expr.type === CfgDictionaryTypeEnum.VARIABILITY_GROUP) {
                        // [IR-1312998] <Variability_Group> tag now works the same as <Variant> tag
                        // <VARIANT> OR <VARIABILITY_GROUP>
                        if (previoustype == '' || previoustype == 'BINARY' || previoustype == 'AND' || previoustype == 'OR' || previoustype == 'NOT' || previoustype == 'OPEN_SEPARATOR') {
                            var featureValue = ACPobjEffExp.dicoMappedById[expr.id];
                            var featureName = featureValue.attributes._value;
                            xmlexpr = xmlexpr + '<Feature Type="ConfigFeature" Name="' + featureName + '">';
                            previoustype = 'Feature';
                            typetoclose.push('Feature');
                        } else {
                            console.log('error in inline expression');
                            xmlexpr = 'ERROR';
                            return xmlexpr;
                        }
                    } else if (expr.type === CfgDictionaryTypeEnum.VALUE || expr.type === CfgDictionaryTypeEnum.OPTION) {
                        // <VALUE> OR <OPTION>
                        if (previoustype == 'Feature') {
                            var optValue = ACPobjEffExp.dicoMappedById[expr.id];
                            var optName = optValue.attributes._value;
                            xmlexpr = xmlexpr + CfgXMLServices.buildOption(optName);
                        }
                        else {
                            console.log('error in inline expression');
                            xmlexpr = 'ERROR';
                            return xmlexpr;
                        }
                    } else if (expr.type === CfgDictionaryOperatorEnum.binary_operator) {
                        // <AND> or <OR>
                        let bintype = '';
                        if (expr.id === CfgDictionaryOperatorEnum.and_id) {
                            bintype = 'AND';
                        } else if (expr.id === CfgDictionaryOperatorEnum.or_id) {
                            bintype = 'OR';
                        }
                        if (bintype !== '') {
                            if (previoustype !== bintype) {
                                // close the previous balise <Feature>,<and>
                                // <AND> operator has prioritary over <OR> so a <AND> cannot close a <OR>
                                // <undefined> and <bintype == 'AND' && previoustype == 'OR'> check in case we are after a <CLOSE_SEPARATOR>
                                if (previoustype !== 'OPEN_SEPARATOR' && previoustype !== undefined && !(bintype == 'AND' && previoustype == 'OR')) {
                                    xmlexpr = xmlexpr + '</' + previoustype + '>';
                                    typetoclose.pop();
                                    previoustype = typetoclose[typetoclose.length - 1];
                                    if (previoustype == 'NOT') {
                                        xmlexpr = xmlexpr + '</' + previoustype + '>';
                                        typetoclose.pop();
                                        previoustype = typetoclose[typetoclose.length - 1];
                                    }
                                    if (previoustype == 'AND' && bintype == 'OR') {
                                        //close <AND> because of new OR operator
                                        xmlexpr = xmlexpr + '</' + previoustype + '>';
                                        typetoclose.pop();
                                        previoustype = typetoclose[typetoclose.length - 1];
                                    }
                                }

                                // insert <AND>,<OR> at the correct place in the expression
                                // if operator is same as previous, no need to add it again
                                if (previoustype !== bintype) {
                                    lastindextoinsert = startExpr;
                                    if (listofindexforinsert.length > 0) {
                                        lastindextoinsert = listofindexforinsert[listofindexforinsert.length - 1];
                                    }
                                    xmlexpr = xmlexpr.slice(0, lastindextoinsert) + '<' + bintype + '>' + xmlexpr.slice(lastindextoinsert);

                                    typetoclose.push(bintype);
                                }
                                previoustype = bintype;
                            }
                            // for each new <OR> replace the previous insertion index with current xmlexpr length
                            if (bintype == 'OR') {
                                listofindexforinsert.pop();
                                let xmlexprlength = xmlexpr.length;
                                listofindexforinsert.push(xmlexprlength);
                            }
                        } else {
                            console.log('error in inline expression');
                            xmlexpr = 'ERROR';
                            return xmlexpr;
                        }
                    } else if (expr.type === CfgDictionaryOperatorEnum.unary_operator) {
                        // <NOT>
                        if (expr.id === CfgDictionaryOperatorEnum.not_id) {
                            xmlexpr = xmlexpr + '<NOT>';
                            typetoclose.push('NOT');
                            previoustype = 'NOT';
                        } else {
                            console.log('error in inline expression');
                            xmlexpr = 'ERROR';
                            return xmlexpr;
                        }
                    } else if (expr.type === CfgDictionaryOperatorEnum.opening_separator) {
                        // <(>
                        let xmlexprlength = xmlexpr.length;
                        listofindexforinsert.push(xmlexprlength);
                        typetoclose.push('OPEN_SEPARATOR');
                        previoustype = 'OPEN_SEPARATOR';
                    } else if (expr.type === CfgDictionaryOperatorEnum.closing_separator) {
                        // <)>
                        let bool_opensep = new Boolean(false); // to check if open_separator has been found.
                        let typetocloselength = typetoclose.length;

                        for (let i = typetocloselength - 1; i >= 0; i--) {
                            // reverse looping until the lastest <OPEN_SEPARATOR> is reached.
                            let itypetoclose = typetoclose[i];
                            if (itypetoclose != 'OPEN_SEPARATOR') {
                                xmlexpr = xmlexpr + '</' + itypetoclose + '>';
                                typetoclose.pop();
                            } else {
                                typetoclose.pop();
                                bool_opensep = true;
                                break;
                            }
                        }
                        if (bool_opensep == true) {
                            previoustype = typetoclose[typetoclose.length - 1];
                            // Case where NOT is placed before an opening parenthesis.
                            if (previoustype == 'NOT') {
                                xmlexpr = xmlexpr + '</' + previoustype + '>';
                                typetoclose.pop();
                                previoustype = typetoclose[typetoclose.length - 1];
                            }
                            listofindexforinsert.pop();
                        } else {
                            console.log('error in inline expression');
                            xmlexpr = 'ERROR';
                            return xmlexpr;
                        }
                    } else {
                        console.log('error in inline expression');
                        xmlexpr = 'ERROR';
                        return xmlexpr;
                    }
                    //console.log('expression XML = ' + xmlexpr);
                });
                let typetocloselength = typetoclose.length;
                for (let i = typetocloselength - 1; i >= 0; i--) {
                    let itypetoclose = typetoclose[i];
                    if (itypetoclose != 'OPEN_SEPARATOR') {
                        xmlexpr = xmlexpr + '</' + itypetoclose + '>';
                        typetoclose.pop();
                    }
                }
                xmlexpr = xmlexpr + '</Context>';
            }
            if (xmlexpr != '') {
                //[IR-906356 14-Mar-2022] added <MultiContextView> tag for multiple models
                if (output_ACP.effectivity != undefined && output_ACP.effectivity.length > 1) {
                    xmlexpr =
                        '<CfgEffectivityExpression xs:schemaLocation = "urn:com:dassault_systemes:config CfgEffectivityExpression.xsd" xmlns:xs = "http://www.w3.org/2001/XMLSchema-instance" xmlns = "urn:com:dassault_systemes:config"><Expression><MultiContextView>' +
                        xmlexpr +
                        '</MultiContextView></Expression></CfgEffectivityExpression>';
                } else {
                    xmlexpr =
                        '<CfgEffectivityExpression xs:schemaLocation = "urn:com:dassault_systemes:config CfgEffectivityExpression.xsd" xmlns:xs = "http://www.w3.org/2001/XMLSchema-instance" xmlns = "urn:com:dassault_systemes:config"><Expression>' +
                        xmlexpr +
                        '</Expression></CfgEffectivityExpression>';
                }
            }
            //console.log('expression XML = ' + xmlexpr);

            return xmlexpr;
        },

        /**
         * Convert an effectivity expression from varEffJsonWithLabel format to CfgAutoCompletePresenter format
         * @param {Object[]} expressionOldFormat - effectivity expression varEffJsonWithLabel format
         * @param {Object} dicoMappedByName - dico mapped by name (as returned by createMapsFromDico)
         * @return {Object[]} effectivity expression at CfgAutoCompletePresenter format
         */
        convertEffectivityExpressionToCfgAutoCompletePresenterFormat: function (expressionOldFormat, dicoMappedByName) {
            if (expressionOldFormat === undefined || expressionOldFormat === null) {
                return null;
            }

            var expressionNewFormat = [];
            var evoEffImpacted = false;

            expressionOldFormat.forEach(function (uselessObject, idx) {
                // If not first item, add OR operator
                if (idx !== 0) {
                    expressionNewFormat.push({ id: CfgDictionaryOperatorEnum.or_id, label: 'OR', type: CfgDictionaryOperatorEnum.binary_operator, value: 'OR' });
                }

                uselessObject.Combination.forEach(function (combination, idx) {
                    // If not first item, add AND operator
                    if (idx !== 0) {
                        expressionNewFormat.push({ id: CfgDictionaryOperatorEnum.and_id, label: 'AND', type: CfgDictionaryOperatorEnum.binary_operator, value: 'AND' });
                    }

                    // For considering NOT operator in expressionNewFormat
                    var isNOT = false;

                    // First, add feature / variant
                    var featureValue = combination.Feature.value;
                    var correspondingVariant = dicoMappedByName[featureValue];

                    if (correspondingVariant == null || correspondingVariant == undefined) evoEffImpacted = true; // Change in evolution effectivity post edit variant

                    var correspondingVariantHasCFselectionTypeMultiple = false;

                    // Check if corresponding feature / variant has selectionType : multiple
                    if (correspondingVariant && correspondingVariant.selectionType) correspondingVariantHasCFselectionTypeMultiple = correspondingVariant.selectionType === 'Multiple';

                    // Add NOT operator in expressionNewFormat for Option selection = 'R'.
                    var selectionValue = combination.Options[0].Option.selection;
                    if (selectionValue == 'R') isNOT = true;
                    if (isNOT == true) {
                        expressionNewFormat.push({ id: CfgDictionaryOperatorEnum.not_id, label: 'NOT', type: CfgDictionaryOperatorEnum.unary_operator, value: 'NOT' });
                        isNOT = false;
                    }

                    // Only add Feature / Variant in AutoCompletePresenter if selectionType : single
                    if (!correspondingVariantHasCFselectionTypeMultiple) {
                        var lid_val = '-1';
                        if (correspondingVariant && correspondingVariant.lid) lid_val = correspondingVariant.lid;

                        expressionNewFormat.push({ id: lid_val, type: CfgDictionaryTypeEnum.VARIANT });
                    }

                    // Get all corresponding options
                    combination.Options.forEach(function (anotherUselessObject) {
                        var optionValue = anotherUselessObject.Option.value;
                        var correspondingVariantValue = dicoMappedByName[optionValue];
                        var rel_lid_val = '-1';
                        if (correspondingVariantValue && correspondingVariantValue.rel_lid) rel_lid_val = correspondingVariantValue.rel_lid;

                        if (correspondingVariantHasCFselectionTypeMultiple) {
                            expressionNewFormat.push({ id: rel_lid_val, type: CfgDictionaryTypeEnum.OPTION });
                        } else {
                            expressionNewFormat.push({ id: rel_lid_val, type: CfgDictionaryTypeEnum.VALUE });
                        }
                    });
                });
            });

            if (evoEffImpacted === true) {
                CfgUtility.showwarning(AppNLS.Evolution_Impact_Msg, 'warning');
            }
            return { items: expressionNewFormat };
        },

        ///**
        // * checks expression is valid or not depending on Variant value is present or not in expression
        // * @param {expressionArray} Effectivity expression  like [{"name":"MV-51632510-00000003","Combinations":[{"Combination":[{"Feature":{"value":"VAR-51632510-00000004","label":"RAM"},"Options":[]},{"Feature":{"value":"VAR-51632510-00000004","label":"RAM"},"Options":[]},{"Feature":{"value":"VAR-51632510-00000004","label":"RAM"},"Options":[]}]}]}]
        // * return true || false
        // */
        //isValidExpression: function (expressionArray) {
        //    let isValid = true;
        //    for (let counter = 0; counter < expressionArray.length; counter++) {
        //        let combinations = expressionArray[counter].Combinations;
        //        for (let combinationCounter = 0; combinationCounter < combinations.length; combinationCounter++) {
        //            let combination = combinations[combinationCounter].Combination;
        //            for (let optionCounter = 0; optionCounter < combination.length; optionCounter++) {
        //                if (combination[optionCounter].Options.length == 0) {
        //                    return false;
        //                }
        //            }
        //        }
        //    }
        //    return isValid;
        //},

        /**
         * checks effectivity expression is valid or not with dictionary content
         * @param {model} model expression with dictionary and currentExpression details
         * return true || false
         */
        isValidEffectivityWithDictionary: function (model) {
            let isFeaturesAvailableInDictionary = true;
            if (model.currentExpression != undefined && model.currentExpression.items != undefined && model.currentExpression.items.length > 0) {
                for (let Count = 0; Count < model.currentExpression.items.length; Count++) {
                    let item = model.currentExpression.items[Count];
                    if (item.id == '-1') {
                        isFeaturesAvailableInDictionary = false;
                        break;
                    }
                }
            }
            return isFeaturesAvailableInDictionary;
        },

        /**
         * Get the current expressions from a single AutoCompletePresenter or an Accordeon item containing multiple AutoCompletePresenters
         * @param {Object} AutoCompletePresenter or Accordeon component
         * @param {string} (optional) model name
         */
        getExpressions: function (autoPresenterOrAccordeon, model) {
            var rez = [],
                isThereError,
                that = this;
            if (autoPresenterOrAccordeon.items !== undefined) {
                // It's an accordeon component
                autoPresenterOrAccordeon.items.forEach(function (accordeonItem) {
                    var expression = { name: /*accordeonItem.header*/ accordeonItem._model.name }; //FUN102424 use display name instead of name for model in inline editor

                    // Check if expression is correct. //[IR-994004 15-Nov-2022] added isValidEffectivityWithDictionary check
                    if (accordeonItem._autoCompletePresenter.isThereError() || (accordeonItem._autoCompletePresenter.getExpression().length > 0 && that.isValidEffectivityWithDictionary(accordeonItem._model) == false)) {
                        isThereError = true;
                    } else {
                        var ACPExpression = { name: accordeonItem._model.name, aCPformat: accordeonItem._autoCompletePresenter.getExpression(), dicoMappedById: accordeonItem._model._dicoMapped.byId };
                        rez.push(ACPExpression);
                    }
                });
            } else {
                // Check if expression is correct. //[IR-994004 15-Nov-2022] added isValidEffectivityWithDictionary check
                if (autoPresenterOrAccordeon.isThereError() || (autoPresenterOrAccordeon.getExpression().length > 0 && that.isValidEffectivityWithDictionary(model) == false)) {
                    isThereError = true;
                } else {
                    rez.push({ name: model.name, aCPformat: autoPresenterOrAccordeon.getExpression(), dicoMappedById: model._dicoMapped.byId });
                }
            }

            //[IR-965032 19-Aug-2022] checks expression entered by user is valid
            //if (that.isValidExpression(rez) == false) isThereError = true;

            if (isThereError) {
                return { effectivity: 'ERROR' };
            }
            return { effectivity: rez };
        },

        /**
         * Gives focus to the AutoComplete component (we trigger a focus AND a click event to guarantee correct interactions with WUXAccordeon)
         * @param {Object} autoCompletePresenter - CfgAutoCompletePresenter we want to give focus to
         */
        giveFocus: function (autoCompletePresenter) {
            autoCompletePresenter._autocomplete.onFocus();
            autoCompletePresenter._autocomplete.elements.input.focus();
            autoCompletePresenter._autocomplete.elements.input.click();
        },

        /**
         * Clear all datasets from an AutoComplete Component, then recreate datasets
         * @param {Object} UIKIT AutoComplete component
         */
        refreshAutoCompleteDatasets: function (autoCompletePresenter) {
            for (var i = autoCompletePresenter._autocomplete.datasets.length - 1; i >= 0; i--) {
                autoCompletePresenter._autocomplete.removeDataset(i);
            }
            autoCompletePresenter.createDataSet();
        },
    };

    return CfgAutoCompleteUtils;
});
