define("DS/MePreferencesUIElements/MePreferencesBetaOptionsView",
    ['UWA/Core',
        'DS/UWPClientCode/BetaOptions',
        'DS/Controls/Toggle'],
    function (UWA, BetaOptions, WUXToggle) {
        "use strict";

        var mePrefBetaOptionsObj = function () {
            this._optionToggleArr = [];
            this._optionToggleValMap = {};
            this._optionsPreferenceContainer = null;
        };

        //Private
        function populateOptionContent(optnObj) {

            var optnContainer = new UWA.createElement('div', {
                'class': 'me-preference-panel-option-container'
            });

            var optionToggleContainer = new UWA.createElement('div', {
                'class': 'me-preference-panel-options-toggle-container'
            });

            var optnToggle = new WUXToggle({
                type: "switch",
                label: optnObj['title'],
                checkFlag: optnObj["enabled"],
                domId: optnObj['id']
            });

            //Added for Page Objects
            optnToggle.getContent().setAttribute('data-me-preferences-page-object-option-switch-id', optnObj['id']);

            //Global Array is maintained to add events
            this._optionToggleArr.push(optnToggle);

            //optionsButtonGroup.inject(optionToggleContainer);
            optnToggle.inject(optionToggleContainer);
            optionToggleContainer.inject(optnContainer);

            var optnDesc = new UWA.createElement('p', {
                'class': 'me-preference-panel-options-desc-container',
                'text': optnObj['description']
            });

            optnDesc.inject(optnContainer);

            return optnContainer;
        }

        //Return BetaOptionsTab if present otherwise returns null;
        mePrefBetaOptionsObj.prototype.getBetaOptionsContainer = function () {

            if (this._optionsPreferenceContainer != null)
                return this._optionsPreferenceContainer;

            var isOptionsActive = BetaOptions.getSupportedBetaOptions();

            //To remove Temp Code
            /*var tempObj = {
                "id": "3DDASHBOARD_FUN111122",
                "title": "Enable dashboard duplication & synchronization (BETA)",
                "description": "Option for dashboard owners to authorize duplication by members. Duplicated dashboard can be synchronized with the original one.",
                "enabled": true
            };
            isOptionsActive.push(tempObj);
            var tempObj2 = {
                "id": "3DDASHBOARD_FUN111133",
                "title": "Enable2 dashboard2 duplication2 & synchronization (BETA2)",
                "description": "Option2 for2 dashboard2 owners2 to authorize2 2duplication by members2. Duplicated dashboard can be synchronized with the original one2.",
                "enabled": false
            };
            isOptionsActive.push(tempObj2);*/
            //To remove Temp Code

            //Create view if Beta Options are there, otherwise return null
            if (isOptionsActive != null && isOptionsActive.length > 0) {

                // Beta options
                this._optionsPreferenceContainer = new UWA.createElement('div', {
                    'class': 'me-preference-panel-options-container'
                });

                for (var optCnt = 0; optCnt < isOptionsActive.length; optCnt++) {
                    var optContainer = populateOptionContent.call(this, isOptionsActive[optCnt]);
                    optContainer.inject(this._optionsPreferenceContainer);
                }

                //Add events
                const betaOptionUpdateEvent = new Event("betaOptionUpdate");

                function sendEvent() {
                    document.dispatchEvent(betaOptionUpdateEvent);
                }

                if (this._optionToggleArr && this._optionToggleArr.length > 0) {

                    var me = this;
                    //Options Control Button Groups
                    for (var optCnt = 0; optCnt < this._optionToggleArr.length; optCnt++) {
                        this._optionToggleArr[optCnt].addEventListener('change', function (e) {
                            var valObj = {};
                            valObj['id'] = e.dsModel._properties.domId.value;
                            valObj['checkState'] = e.dsModel._properties.checkFlag.value;
                            me._optionToggleValMap[e.dsModel._properties.domId.value] = valObj;
                            sendEvent();
                        })
                    }
                }

                return this._optionsPreferenceContainer;
            } else {
                return null;
            }
        };

        mePrefBetaOptionsObj.prototype.getBetaOptionToogleMap = function () {
            return this._optionToggleValMap;
        };

        return mePrefBetaOptionsObj;

    });
