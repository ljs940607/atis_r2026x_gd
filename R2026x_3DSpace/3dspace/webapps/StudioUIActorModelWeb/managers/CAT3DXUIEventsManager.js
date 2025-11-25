/**
 * @name DS/StudioUIActorModelWeb/managers/CAT3DXUIEventsManager
 * @constructor
 * @hideconstructor
 *
 * @description
 * Manager to process UI events for 3D UIActors
 */
define('DS/StudioUIActorModelWeb/managers/CAT3DXUIEventsManager',
[
    'UWA/Core',
    'UWA/Class/Events',
    'UWA/Class/Listener',
    'DS/VisuEvents/EventsManager',
    'DS/Visualization/ThreeJS_DS',
    'DS/CATCXPModel/CATCXPRenderUtils',
    'DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents'
],
function (
    UWA,
    Events,
    Listener,
    VisuEventsManager,
    THREE,
    CATCXPRenderUtils,
    CATI3DXUIEvents
) {
    'use strict';

    let CAT3DXUIEventsManager = UWA.Class.extend(Events, Listener, 
        /** @lends DS/StudioUIActorModelWeb/managers/CAT3DXUIEventsManager.prototype **/
        {
            Build: function () {
                this._registered3DUIActors = [];
                this._mouseEvents = [];
                this._pickedIndex = -1;
            },

            Dispose: function () {
                while (this._registered3DUIActors.length > 0) {
                    this.Unregister3DUIActor(this._registered3DUIActors[0]);
                }

                delete this._registered3DUIActors;
                delete this._mouseEvents;
                this._pickedIndex = -1;
            },

            Register3DUIActor: function (iActor) {
                if (iActor && !this._registered3DUIActors.includes(iActor)) {
                    this._registered3DUIActors.push(iActor);

                    let actorUIEventInterface = iActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                    if (actorUIEventInterface) { // Listen to the visible property of the registered actor
                        this.listenTo(iActor, 'visible.CHANGED', function () {
                            // Only process events if the 3DUIActor is visible
                            let actorVisible = iActor.GetValueByName('visible');
                            actorUIEventInterface.processUIEvents(actorVisible);
                        });

                        // In cas the 3DUIActor is Registered while not visible
                        let actorVisible = iActor.GetValueByName('visible');
                        actorUIEventInterface.processUIEvents(actorVisible);
                    }

                }

                if (this._mouseEvents &&
                    this._mouseEvents.length == 0 &&
                    this._registered3DUIActors.length > 0) {
                    
                    this._registerEvents();
                }
            },

            Unregister3DUIActor: function (iActor) {
                if (iActor && this._registered3DUIActors.includes(iActor)) {
                    const actorIndex = this._registered3DUIActors.indexOf(iActor);
                    if (actorIndex > -1) {
                        this._registered3DUIActors.splice(actorIndex, 1);

                        // Stop listening to the visible property of the unregistered actor
                        this.stopListening(iActor, 'visible.CHANGED');
                    }
                }

                if (this._mouseEvents &&
                    this._mouseEvents.length > 0 &&
                    this._registered3DUIActors.length == 0) {
                    
                    this._unregisterEvents();
                }
            },

            _registerEvents: function() {
                if (! this._mouseEvents) return;

                let _this = this;
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onLeftClick', function (evt) {
                    if (_this._pickedIndex > -1) {
                        let pickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (pickedActor) {
                            let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUILeftClickEvent);
                            }
                        }
                    }
                }));
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onRightClick', function (evt) {
                    if (_this._pickedIndex > -1) {
                        let pickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (pickedActor) {
                            let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIRightClickEvent);
                            }
                        }
                    }
                }));
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onLeftDoubleClick', function (evt) {
                    if (_this._pickedIndex > -1) {
                        let pickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (pickedActor) {
                            let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIDoubleClickEvent);
                            }
                        }
                    }
                }));
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onLeftMouseDown', function (evt) {
                    if (_this._pickedIndex > -1) {
                        let pickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (pickedActor) {
                            let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIPressEvent);
                            }
                        }
                    }
                }));
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onLeftMouseUp', function (evt) {
                    if (_this._pickedIndex > -1) {
                        let pickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (pickedActor) {
                            let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIReleaseEvent);
                            }
                        }
                    }
                }));
                this._mouseEvents.push(VisuEventsManager.addEvent(document, 'onMouseMove', function (evt) {
                    let position = {}
                    position.x = evt.from[0].currentPosition.x;
                    position.y = evt.from[0].currentPosition.y;
                    
                    let pickedActorExited = false;
                    let pickedActor = _this._getImageButtonActorInPosition(position);
                    if (pickedActor) {
                        if (_this._checkPickedActorObject(pickedActor)) {
                            if (_this._pickedIndex > -1) { // _pickedIndex already initialized
                                let previousPickedActor = _this._registered3DUIActors[_this._pickedIndex];
                                if (previousPickedActor && previousPickedActor.GetObject() == pickedActor) {
                                    let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                                    if (pickedActorUIEventInterface) {
                                        pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIHoverEvent);
                                    }
                                } else {
                                    pickedActorExited = true;
                                }
                            } else { // _pickedIndex to be initialized
                                _this._pickedIndex = _this._getIndexOfPickedActorObject(pickedActor);

                                let pickedActorUIEventInterface = pickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                                if (pickedActorUIEventInterface) {
                                    pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIEnterEvent);
                                }
                            }
                        }
                    } else if (_this._pickedIndex > -1) {
                        pickedActorExited = true;
                    }

                    if (pickedActorExited) {
                        let previousPickedActor = _this._registered3DUIActors[_this._pickedIndex];
                        if (previousPickedActor) {
                            let pickedActorUIEventInterface = previousPickedActor.QueryInterface(CATI3DXUIEvents.interfaceName);
                            if (pickedActorUIEventInterface) {
                                pickedActorUIEventInterface.receiveUIEvent(CATI3DXUIEvents.CAT3DXUIEventTypes.CAT3DXUIExitEvent);
                            }
                        }

                        _this._pickedIndex = -1;
                    }
                }));
            },

            _unregisterEvents: function() {
                if (this._mouseEvents) { // unsubscribe events
                    for (let i = this._mouseEvents.length; i--;) {
                        VisuEventsManager.removeEventFromToken(this._mouseEvents[i]);
                        this._mouseEvents.splice(i, 1);
                    }
                }
            },

            _getImageButtonActorInPosition: function (iPosition) {
                const viewer = this.GetObject()._experienceBase.getManager('CAT3DXVisuManager').getViewer();
                if (! viewer) return null;

                let intersections = [];
                let position = new THREE.Vector2(iPosition.x, iPosition.y);
                let mousePosition = viewer.getMousePosition(position);
                let pickData = viewer.pick(mousePosition, 'mesh', false);

                if (pickData) {
                    let path = pickData.path;
                    if (path.length >= 1) {
                        let components = CATCXPRenderUtils.getComponentsFromPathElement(pickData.path[0], true);
                        if (components.length === 1) {
                            let intersection = new STU.Intersection();
                            intersection.setActor(components[0]);

                            intersections.push(intersection);
                        }
                    }
                }

                if (intersections.length > 0 && intersections[0]) {
                    let firstIntersection = intersections[0];
                    return firstIntersection.getActor();
                } else {
                    return null;
                }
            },

            _getIndexOfPickedActorObject: function (iPickedActorObject) {
                if (! iPickedActorObject) return -1;

                for (let index in this._registered3DUIActors) {
                    let actor = this._registered3DUIActors[index];
                    if (this._registered3DUIActors[index]) {
                        if (actor.GetObject() == iPickedActorObject) {
                            return index;
                        }
                    }
                }

                return -1;
            },

            _checkPickedActorObject: function (iPickedActorObject) {
                return (this._getIndexOfPickedActorObject(iPickedActorObject) != -1);
            },

            GetType: function () {
                return 'CAT3DXUIEventsManager';
            },
            
        }
    );

    return CAT3DXUIEventsManager;
});
