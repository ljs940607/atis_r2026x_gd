define("DS/MePreferencesUIElements/MePreferencesLanguageView",
    ['UWA/Core',
        'DS/Controls/Toggle',
        'DS/Controls/ButtonGroup',
        'i18n!DS/MePreferencesUIElements/assets/nls/translation',
        'DS/UWPClientCode/I18n',
        "DS/MePreferencesClientUtilities/MePreferencesPlatformServicesUtils"],
    function (UWA, WUXToggle, WUXButtonGroup,
        mePrefUITranslation, I18n, MePreferencesPlatformServicesUtils) {
        "use strict";

        var META_DATA_ENDPOINT = "/api/v1/preferences_metadata/enum_metadata";
        var REQUEST_BODY = {
            "repositories": [
                {
                    "name": "Global",
                    "preferenceNames": [
                        "Language_v2"
                    ]
                }
            ]
        };

        var STATIC_LANG_VALUES = {
            "en": "English",
            "fr": "Français",
            "de": "Deutsch",
            "es": "Español",
            "cs": "čeština",
            "it": "Italiano",
            "ja": "日本語",
            "ko": "한국어",
            "pl": "Polskie",
            "pt-BR": "Português Brasileiro",
            "ru": "Pусский",
            "zh": "简体中文",
            "zh-TW": "繁體中文",
            "tr": "Türkçe"
        };

        var DEBUG_STATIC_LANG_VALUES = {
            "devsymbol": "Symbol for Debug",
            "devkey": "NLS Key for Debug",
            "devtrace": "NLS Trace for Debug"
        };

        var DEBUG_LANG_VALS = ["devsymbol", "devkey", "devtrace"];

        function checkDebugMode() {
            //Check debug mode
            const urlParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlParams.entries());
            var debugMode = false;
            if (params && params.debug === "")
                debugMode = true;
            return debugMode;
        }

        var mePrefLangObj = function () {

            //Get current language from cookies
            this._currentLang = I18n.getCurrentLanguage();
            this._languageSelectedValue = "";
            //this._mePrefUtilsObj = mePreferencesUtilsObj;
            //Set current language as selected language
            this._languageSelectedValue = this._currentLang;
            this._languagePreferenceContainer = null;
            this._debugMode = checkDebugMode();

        };

        async function getEnumMetadata(serviceURL) {
            let options = {
                headersInfo: {
                    'Content-Type': 'application/json'
                }
            };
            var resp = await MePreferencesPlatformServicesUtils.callRestAPI(REQUEST_BODY, serviceURL, 'POST', options).then((responseObj) => {
                return responseObj[0];
            }).catch((errorInfo) => {
                return null;
            });
            return resp;
        }

        mePrefLangObj.prototype.getLanguageContainer = async function (serviceURL) {

            if (this._languagePreferenceContainer != null)
                return this._languagePreferenceContainer;

            //var languagePreferenceContainer = null;

            //Get enum data and populate UI
            var tempURL = serviceURL + META_DATA_ENDPOINT;
            var enumMetadataResp = await getEnumMetadata.call(this, tempURL);

            if (enumMetadataResp != null) {

                enumMetadataResp = JSON.parse(enumMetadataResp);

                //Process Response
                var langVals = enumMetadataResp.repositories[0].preferences[0].values;

                if (this._debugMode) {
                    UWA.merge(STATIC_LANG_VALUES, DEBUG_STATIC_LANG_VALUES);
                    langVals = langVals.concat(DEBUG_LANG_VALS);
                }

                var langSequence = Object.keys(STATIC_LANG_VALUES);
                langSequence = langSequence.filter((val) => langVals.includes(val));

                //Generate UI
                this._languagePreferenceContainer = new UWA.createElement('div', {
                    'class': 'me-preference-panel-language-container'
                });

                let languageValuesContainer = new UWA.createElement('div', {
                    'class': 'me-preference-panel-language-container'
                });

               
                languageValuesContainer.inject(this._languagePreferenceContainer);
               
                //Create radio group for language
                let languageButtonGroup = new WUXButtonGroup({ type: "radio", fireOnlyFromUIInteractionFlag: true });
                for (var cnt = 0; cnt < Math.ceil((langSequence.length)); cnt++) {

                    if (STATIC_LANG_VALUES[langSequence[cnt]]) {
                        var langLabel = "to be overloaded from NLS";
                        if (mePrefUITranslation[langSequence[cnt] + ".Label"])
                            langLabel = mePrefUITranslation[langSequence[cnt] + ".Label"] + " (" + STATIC_LANG_VALUES[langSequence[cnt]] + ")";
                        else if (mePrefUITranslation[langSequence[cnt] + ".Label"] == undefined)
                            langLabel = langLabel + " (" + STATIC_LANG_VALUES[langSequence[cnt]] + ")";
                        let langToggle = new WUXToggle({ type: "radio", label: langLabel, value: langSequence[cnt] });
                        if (langToggle.value == this._languageSelectedValue)
                            langToggle.checkFlag = true;
                        //For MePreference Page Objects.
                        langToggle.getContent().setAttribute('data-MePreferencePageObjectUseOnly', langToggle.value);
                        languageButtonGroup.addChild(langToggle);
                    }

                }
                languageButtonGroup.inject(languageValuesContainer);

                

                //Add events
                const langChangeEvent = new Event("langChange");
                      
                function sendEvent() {
                    document.dispatchEvent(langChangeEvent);
                }   

                var me = this;
                if (languageButtonGroup) {
                    //Language Button Group Left
                    languageButtonGroup.addEventListener('change', function (e) {
                        me._languageSelectedValue = languageButtonGroup.value[0];
                        //languageButtonGroupRight.value = [];
                        sendEvent();
                    });
                }
                
                return this._languagePreferenceContainer;
            }
            return null;
        };

        mePrefLangObj.prototype.getSelectedLanguage = function () {
            return this._languageSelectedValue;
        };

        mePrefLangObj.prototype.getCurrentLanguage = function () {
            return this._currentLang;
        };

        return mePrefLangObj;
    });
