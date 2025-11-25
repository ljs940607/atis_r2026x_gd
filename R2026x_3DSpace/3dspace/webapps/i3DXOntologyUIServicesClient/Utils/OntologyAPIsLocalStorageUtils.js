/* Copyright 2024 Dassault Systemes. All rights reserved */
define("DS/i3DXOntologyUIServicesClient/Utils/OntologyAPIsLocalStorageUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name="DS/i3DXOntologyUIServicesClient/Utils/OntologyAPIsLocalStorageUtils"/>
    // type StoredItem = {
    // 	value: string,
    // 	timestamp: number,
    // 	lifetime: number
    // };
    let OntologyAPIsLocalStorageUtils = {
        signtarue: 'OntoPIsLSU',
        helpers: {
            _generateUniqueId() {
                return Date.now().toString();
            },
        },
        _getStoredResourceInfo: (applicativeId, iResourceID, lang) => {
            try {
                // Récupérer les données depuis le localStorage
                const storedData = JSON.parse(localStorage.getItem(applicativeId) || '{}');
                // Vérifier si la ressource existe
                if (!storedData[iResourceID]) {
                    return null;
                }
                // Vérifier si info existe
                if (!storedData[iResourceID].info) {
                    return null;
                }
                // Récupérer les informations de la ressource
                let resourceInfo = Object.assign({}, storedData[iResourceID].info);
                // Vérifier que `lang` est bien une liste et contient la langue demandée
                if (Array.isArray(resourceInfo.lang) && resourceInfo.lang.includes(lang)) {
                    delete resourceInfo.lang;
                    if (resourceInfo.label) {
                        resourceInfo.label = resourceInfo.label[lang];
                    }
                    if (resourceInfo.comment) {
                        resourceInfo.comment = resourceInfo.comment[lang];
                    }
                    for (const key in resourceInfo) {
                        if (Array.isArray(resourceInfo[key])) {
                            resourceInfo[key].forEach(propInfo => {
                                if (propInfo.label) {
                                    propInfo.label = propInfo.label[lang];
                                }
                                if (propInfo.comment) {
                                    propInfo.comment = propInfo.comment[lang];
                                }
                            });
                        }
                    }
                    return resourceInfo;
                }
                return null;
            }
            catch (error) {
                console.error('Error parsing localStorage data:', error);
                return null;
            }
        },
        _saveResourceInfo: (applicativeId, iResourceID, value, lang, selectables) => {
            try {
                // Récupérer les données existantes ou initialiser un objet vide
                const storedData = JSON.parse(localStorage.getItem(applicativeId) || '{}');
                // Fonction pour éviter les références circulaires
                const deepCloneWithoutCircular = (obj, seen = new WeakMap()) => {
                    if (obj === null || typeof obj !== 'object')
                        return obj;
                    if (seen.has(obj))
                        return '[Circular]';
                    const copy = Array.isArray(obj) ? [] : {};
                    seen.set(obj, copy);
                    for (const key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            copy[key] = deepCloneWithoutCircular(obj[key], seen);
                        }
                    }
                    return copy;
                };
                const mergeProperties = (clonedValue, selectables) => {
                    selectables.forEach(prop => {
                        if (!Object.prototype.hasOwnProperty.call(clonedValue, prop)) {
                            clonedValue[prop] = null; // Ou une valeur par défaut
                        }
                    });
                    return clonedValue;
                };
                // Cloner `value` pour éviter les références circulaires
                let clonedValue = deepCloneWithoutCircular(value);
                if (Array.isArray(selectables) && selectables.length > 0) {
                    const allValues = selectables.map(item => item.value);
                    clonedValue = mergeProperties(clonedValue, allValues);
                }
                // Initialiser la structure de données si elle n'existe pas
                if (!storedData[iResourceID]) {
                    storedData[iResourceID] = { info: clonedValue };
                }
                if (!storedData[iResourceID].info) {
                    storedData[iResourceID].info = clonedValue;
                }
                const resourceInfo = storedData[iResourceID].info;
                if (!resourceInfo.lang) {
                    resourceInfo.lang = [];
                }
                if (!resourceInfo.lang.includes(lang)) {
                    resourceInfo.lang.push(lang);
                }
                // Fonction utilitaire pour gérer la mise à jour des labels et commentaires
                function updateLangProperty(prop, lang, foundValue) {
                    return typeof prop === 'string' ? { [lang]: prop } : Object.assign(Object.assign({}, prop), { [lang]: foundValue !== null && foundValue !== void 0 ? foundValue : '' });
                }
                // Parcourir toutes les propriétés de `resourceInfo` pour gérer `label`
                for (const key in resourceInfo) {
                    //Check if it's an array of objects
                    if (Array.isArray(resourceInfo[key]) && resourceInfo[key].every(item => typeof item === 'object' && item !== null)) {
                        resourceInfo[key].forEach((propInfo) => {
                            var _a;
                            const foundElement = (_a = value[key]) === null || _a === void 0 ? void 0 : _a.find((item) => item['@id'] === propInfo['@id']);
                            if ('label' in propInfo) {
                                propInfo.label = updateLangProperty(propInfo.label, lang, foundElement === null || foundElement === void 0 ? void 0 : foundElement.label);
                            }
                            if ('comment' in propInfo) {
                                propInfo.comment = updateLangProperty(propInfo.comment, lang, foundElement === null || foundElement === void 0 ? void 0 : foundElement.comment);
                            }
                        });
                    }
                    else if (key === 'label' || key === 'comment') {
                        resourceInfo[key] = updateLangProperty(resourceInfo[key], lang, value[key]);
                    }
                }
                // Sauvegarde des données mises à jour dans le localStorage sans références circulaires
                localStorage.setItem(applicativeId, JSON.stringify(storedData));
            }
            catch (error) {
                console.error(`Error updating localStorage data for ${applicativeId}/${iResourceID}:`, error);
            }
        },
        // _saveChildren: (applicativeId: string, iResourceID: string, value: string, iParams: object): void => {
        // 	try {
        // 		const storedData = JSON.parse(localStorage.getItem(applicativeId) || '{}');
        // 		if (!storedData[iResourceID]) {
        // 			storedData[iResourceID] = {}; // Ensure correct structure
        // 		}
        // 		// Ensure `children` is initialized
        // 		if (!storedData[iResourceID].children) {
        // 			storedData[iResourceID].children = {}; // Initialize `children` if it doesn't exist
        // 		}
        // 		// Ensure `children` is initialized
        // 		if (!storedData[iResourceID].children.parameters) {
        // 			storedData[iResourceID].children.parameters = {}; // Initialize `parameters` if it doesn't exist
        // 		}
        // 		// Ensure `values` is an array
        // 		storedData[iResourceID].children.values = value;
        // 		// const paramID = this.helpers._generateUniqueId();
        // 		storedData[iResourceID].children.parameters = iParams;
        // 		localStorage.setItem(applicativeId, JSON.stringify(storedData));
        // 	} catch (error) {
        // 		console.error(`Error updating localStorage data for ${applicativeId}/${iResourceID}:`, error);
        // 	}
        // },
        /**
        * Clears localstorage
        */
        _clear: function () {
            localStorage.clear();
        },
    };
    exports.default = OntologyAPIsLocalStorageUtils;
});
