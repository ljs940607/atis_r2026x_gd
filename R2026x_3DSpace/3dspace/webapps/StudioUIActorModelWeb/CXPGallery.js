/**
* @name DS/StudioUIActorModelWeb/CXPGallery
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Base Class for UIActor Gallery</p>
* <p>Create rep for gallery</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPGallery',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor'
],
function (UWA, CXPUIActor) {
	'use strict';

	var CXPGallery = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPGallery.prototype **/
		{

			init: function (iUIActor) {
                this._parent(iUIActor);

                var uiactorData = iUIActor.QueryInterface('CATI3DExperienceObject').GetValueByName("data");
                this._stretchboolean = uiactorData.QueryInterface('CATI3DExperienceObject').GetValueByName("stretchToContent");
                this.widthItem = uiactorData.QueryInterface('CATI3DExperienceObject').GetValueByName("itemSize").QueryInterface('CATI3DExperienceObject').GetValueByName("x");
                this.heightItem = uiactorData.QueryInterface('CATI3DExperienceObject').GetValueByName("itemSize").QueryInterface('CATI3DExperienceObject').GetValueByName("y");

				this._UIItems = [];

                this._gallery = UWA.createElement('div').inject(this.getContainer());
                this._gallery.style.position = 'absolute';

				Object.defineProperty(this, 'opacity', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._opacity;
					},
					set: function (iValue) {
						this._opacity = iValue;
						this._gallery.style.opacity = this._opacity/255;
					}
				});

				//Object.defineProperty(this, 'itemSize', {
				//	enumerable: true,
				//	configurable: true,
				//	get: function () {
				//		return this._itemSize;
				//	},
				//	set: function (iValue) {
				//		this._itemSize = iValue;
				//	}
				//});

				Object.defineProperty(this, 'items', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._items;
					},
					set: function (iValue) {
						this._items = iValue;
						this._refreshItems(this._items);
					}
				});

				Object.defineProperty(this, 'orientation', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._orientation;
					},
                    set: function (iValue) {
                        this._orientation = iValue;
                        if (this._stretchboolean === true && this._orientation <= 0) {
                            this._gallery.style.display = 'flex';
                        }
                        else if (this._orientation > 1) {
                            this._gallery.style.display = 'flex';
                            this._gallery.style.flexWrap = 'wrap';
                        }
                        else {
                            this._gallery.style.display = 'inherit';
                        }
                    }
				});
			},

			// Register events for play
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();
            },

            _createContainer: function () {
                var container = this._parent();

                Object.defineProperty(this, 'width', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._width;
                    },
                    set: function (iValue) {
                        this._width = iValue;
                        if (this.stretchToContent) {
                            this._container.style.width = '';
                        }
                        else {                         
                            if (this._mode === 1) {
                                this._container.style.width = this._width + 'vw';
                            } else { //default size in px
                                this._container.style.width = this._width + 'px';
                            }
                        }                        
                    }
                });
                
                Object.defineProperty(this, 'height', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._height;
                    },
                    set: function (iValue) {
                        this._height = iValue;
                        if (this.stretchToContent) {
                            this._container.style.height = '';
						}
						else {
                            if (this._mode === 1) {
                                this._container.style.height = this._height + 'vh';
                            } else { //default size in px
                                this._container.style.height = this._height + 'px';
                            }
						}                       
                    }
                });

                Object.defineProperty(this, 'stretchToContent', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return this._stretchToContent;
                    },
                    set: function (iValue) {
                        this._stretchToContent = iValue;
                        if (this._stretchToContent) {
                            this._container.style.overflow = 'visible';
                            this._container.style.width = '';
                            this._container.style.height = '';
                        }
                        else {
                            if (this._mode === 1) {
                                this._container.style.width = this._width + 'vw';
                                this._container.style.height = this._height + 'vh';
                                this._container.style.minWidth = this.widthItem + 'vw';
                                this._container.style.minHeight = this.heightItem + 'vh';
                            } else { //default size in px
                                this._container.style.width = this._width + 'px';
                                this._container.style.height = this._height + 'px';
                                this._container.style.minWidth = this.widthItem + 'px';
                                this._container.style.minHeight = this.heightItem + 'px';
                            }
                            this._container.style.overflow = 'auto';
                        }
                        
                    }                    
                });

                Object.defineProperty(this, 'clientWidth', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (this._container.clientWidth === 0) {
                            return this._gallery.clientWidth;
                        }
                        return this._container.clientWidth;
                    }
                });

                Object.defineProperty(this, 'clientHeight', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (this._container.clientHeight === 0) {
                            return this._gallery.clientHeight;
                        }
                        return this._container.clientHeight;
                    }
                });

                return container;
            }

		});
	return CXPGallery;
});




