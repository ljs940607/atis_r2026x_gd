/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPGalleryViewpointControl
 * @constructor
 * @augments module:DS/Controls/CXPGalleryControl
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPGalleryViewpointControl', 
['UWA/Core', 
'DS/StudioUIActorModelWeb/controls/CXPGalleryControl',
'DS/StudioUIActorModelWeb/controls/CXPCameraViewerControl'],

function (UWA, CXPGalleryControl, CXPCameraViewerControl) {
    'use strict';

    var CXPGalleryViewpointControl = CXPGalleryControl.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPGalleryControl.prototype
          */
          {
            publishedProperties: {
                liveUpdate: {
                    defaultValue: false
                }
            },

            buildView: function() {
                this._parent();

                this._resizeObserver = null;
                this.contentContainers = [];
            },


            _buildItem: function(iItem, iIndex, iItemContainer) {
                this._parent(iItem, iIndex, iItemContainer);
                let contentContainer = CXPGalleryControl.CreateLabeledItem(iItemContainer, iItem.label);
                
                if (!this.stretchToContent) {
                    contentContainer.style.width = 'var(--minWidth)';
                    contentContainer.style.height = 'var(--minHeight)';
                } else {
                    contentContainer.style.width = 'inherit';
                    contentContainer.style.height = 'inherit';
                }


                this.contentContainers[iIndex] = contentContainer;
            },

            updateItem: function(iIndex, iItem) {
                if (iIndex == 0 && this._resizeObserver) {
                    this._resizeObserver.disconnect();
                    this._resizeObserver = null;
                }

                this._parent(iIndex, iItem);
                
                let item = iItem;
                let contentContainer = this.contentContainers[iIndex];

                if (item.image) {
                    contentContainer.style.background = 'url(' + item.image + ')';
                    contentContainer.style.backgroundSize = '100% 100%';
                } else {
                    let cameraViewer = new CXPCameraViewerControl().inject(contentContainer);
                    cameraViewer.camera = item.camera;
                    cameraViewer.liveUpdate = this.liveUpdate;
                    contentContainer.viewer = cameraViewer;
                    
                    if (this.stretchToContent) {
                        cameraViewer.elements.container.style.width = 'var(--computedWidth)';
                        cameraViewer.elements.container.style.height = 'var(--computedHeight)';
                    } else {
                        cameraViewer.elements.container.style.width = '100%';
                        cameraViewer.elements.container.style.height = '100%';
                    }
                }

                if (iIndex == 0) {
                    this._resizeObserver = new ResizeObserver(()=>{this._updateViewersSize();});
                    this._resizeObserver.observe(contentContainer);
                }
            },

            _applyItems: function(iOldValue) {
                this._parent(iOldValue);
                if (this.contentContainers.length) {
                    let width = this.contentContainers[0].offsetWidth;
                    let height = this.contentContainers[0].offsetHeight;
                    // webgl viewers need to have dimensions set explicitly in px, otherwise they grow forever
                    // so we compute ourself the remaining space and keep the dimensions up to date ...
                    this.elements.itemsContainer.style.setProperty("--computedWidth", width + 'px');
                    this.elements.itemsContainer.style.setProperty("--computedHeight", height + 'px');

                    for (let i = 0; i<this.items.length ; ++i) {
                        let item = this.items[i];
                        let contentContainer = this.contentContainers[i];
                        if (item.image) {
                            contentContainer.style.background = 'url(' + item.image + ')';
                            contentContainer.style.backgroundSize = '100% 100%';
                        } else {
                            let cameraViewer = new CXPCameraViewerControl().inject(contentContainer);
                            cameraViewer.camera = item.camera;
                            cameraViewer.liveUpdate = this.liveUpdate;
                            contentContainer.viewer = cameraViewer;
                            
                            if (this.stretchToContent) {
                                cameraViewer.elements.container.style.width = 'var(--computedWidth)';
                                cameraViewer.elements.container.style.height = 'var(--computedHeight)';
                            } else {
                                cameraViewer.elements.container.style.width = '100%';
                                cameraViewer.elements.container.style.height = '100%';
                            }
                        }
                    }

                    if (this._resizeObserver) {
                        this._resizeObserver.disconnect();
                        this._resizeObserver = null;
                    }
                    this._resizeObserver = new ResizeObserver(()=>{this._updateViewersSize();});
                    this._resizeObserver.observe(this.contentContainers[0]);

                }

                
            },

            _applyStretchToContent: function(oldValue) {
                this._parent(oldValue);
                for (let contentContainer of this.contentContainers) {
                    if (!this.stretchToContent) {
                        contentContainer.style.width = 'var(--minWidth)';
                        contentContainer.style.height = 'var(--minHeight)';
                    } else {
                        contentContainer.style.width = 'inherit';
                        contentContainer.style.height = 'inherit';
                    }
                }

                if (this.stretchToContent) {
                    for (let i = 0; i < this.contentContainers.length ; ++i) {
                        let cameraViewer = this.contentContainers[i].viewer;
                        if (cameraViewer) {
                            cameraViewer.elements.container.style.width = 'var(--computedWidth)';
                            cameraViewer.elements.container.style.height = 'var(--computedHeight)';
                        }
                    }

                    this._updateViewersSize();
                    if (this._resizeObserver == null && this.contentContainers.length > 0) {
                        this._resizeObserver = new ResizeObserver(()=>{this._updateViewersSize();});
                        this._resizeObserver.observe(this.contentContainers[0]);
                    }
                } else {                    
                    if (this._resizeObserver) {
                        this._resizeObserver.disconnect();
                        this._resizeObserver = null;
                    }

                    for (let i = 0; i < this.contentContainers.length ; ++i) {
                        let cameraViewer = this.contentContainers[i].viewer;
                        if (cameraViewer) {
                            cameraViewer.elements.container.style.width = '100%';
                            cameraViewer.elements.container.style.height = '100%';
                        }
                    }
                }

            },

            _applyLiveUpdate: function() {
                for (let i = 0; i < this.contentContainers.length ; ++i) {
                    let viewer = this.contentContainers[i].viewer;
                    if (viewer) {
                        viewer.liveUpdate = this.liveUpdate;
                    }
                }
            },

            _onCleanItems: function() {
                this._parent();
                this.contentContainers = [];
            },

            _updateViewersSize: function() {
                if (this.contentContainers.length && this.stretchToContent) {
                    let cameraViewer = null;
                    if (this.contentContainers[0].viewer) // in case first item is a camera viewer
                    {
                        // hide it to compute correct offset dimensions
                        cameraViewer = this.contentContainers[0].viewer
                        cameraViewer.elements.container.style.display = 'none';
                    }

                    // for some reasons, sometimes taking exact offsetWidth makes the content overflow the container leading to a loop update so we take one less
                    let width = this.contentContainers[0].offsetWidth - 1;
                    let height = this.contentContainers[0].offsetHeight - 1;

                    this.elements.itemsContainer.style.setProperty("--computedWidth", width + 'px');
                    this.elements.itemsContainer.style.setProperty("--computedHeight", height + 'px');

                    cameraViewer.elements.container.style.display = 'inherit';
                }
            }
        });

        return CXPGalleryViewpointControl;
});

