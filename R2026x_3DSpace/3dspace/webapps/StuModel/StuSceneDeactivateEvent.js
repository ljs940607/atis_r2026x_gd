
define('DS/StuModel/StuSceneDeactivateEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent'], function (STU, Event) {
    'use strict';

    /**
     * This event is sent when a scene is deactivated.
     * 
     * Whenever a scene is deactivated, another scene is activated. This event provides both scenes as properties.
     * 
     * It is dispatched globally, and locally on the deactivated {@link STU.Scene}.
     * 
     *
     * @class
     * @constructor
     * @noinstancector 
     * @public
     * @extends EP.Event
     * @memberof STU
     * @see STU.SceneActivateEvent
     */
    var SceneDeactivateEvent = function () {

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
        * @type {STU.Scene}
        * @public
        */
        this.deactivatedScene = null;
    };

    SceneDeactivateEvent.prototype = new Event();
    SceneDeactivateEvent.prototype.constructor = SceneDeactivateEvent;
    SceneDeactivateEvent.prototype.type = 'SceneDeactivateEvent';

    // Expose in STU namespace.
    STU.SceneDeactivateEvent = SceneDeactivateEvent;

    EP.EventServices.registerEvent(SceneDeactivateEvent);

    return SceneDeactivateEvent;
});

define('StuModel/StuSceneDeactivateEvent', ['DS/StuModel/StuSceneDeactivateEvent'], function (SceneDeactivateEvent) {
    'use strict';

    return SceneDeactivateEvent;
});
