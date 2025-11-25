
define('DS/StuModel/StuSceneActivateEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent'], function (STU, Event) {
	'use strict';

    /**
     * This event is sent when a scene is activated.
     * 
     * Whenever a scene is activated, another scene has been deactivated. This event provides both scenes as properties.
     * Please note that there there is an exception to this rule, when the first scene is activated, there is no deactivated one.
     * 
     * It is dispatched globally, and locally on the activated {@link STU.Scene}.
     * 
     * @class
     * @constructor
     * @noinstancector 
     * @public
     * @extends EP.Event
     * @memberof STU
     * @see STU.SceneDeactivateEvent
     */
    var SceneActivateEvent = function () {
		Event.call(this);

        /**
        * The activated scene.
        *
        * @type {STU.Scene}
        * @public
        */
		this.activatedScene = null;

        /**
        * The deactivated scene.
        *
        * Please note that this scene is already deactivated, and cannot be manipulated anymore.
        * For instance, all its actors have been uninitialized, and reading their properties will return invalid information.
        * 
        * Warning: this property is null when the first scene is activated.
        *        
        * @type {STU.Scene}        
        * @public
        */
		this.deactivatedScene = null;
	};

	SceneActivateEvent.prototype = new Event();
	SceneActivateEvent.prototype.constructor = SceneActivateEvent;
	SceneActivateEvent.prototype.type = 'SceneActivateEvent';

	// Expose in STU namespace.
	STU.SceneActivateEvent = SceneActivateEvent;

	EP.EventServices.registerEvent(SceneActivateEvent);

	return SceneActivateEvent;
});

define('StuModel/StuSceneActivateEvent', ['DS/StuModel/StuSceneActivateEvent'], function (SceneActivateEvent) {
	'use strict';

	return SceneActivateEvent;
});
