/*
@fullreview SVQ 2012:10:01 Creation
*/


(function(workerContext) {

    // IR-360011 : for IE11
    define('DS/Formats/Formats', function () {

        return new Object();
    });

    require(["DS/Formats/CGRFile"], function(CGRFile) {
    
        workerContext.onmessage = function(e) {

            var readyCB = null;
            var expand = false;
            var options = null;

            function onLoad(e) {
                var byteArray = new Uint8Array(e.target.response);

                var cgrFile = new CGRFile(new byteArrayReader(byteArray), options);
                var rep = cgrFile.open(options.uvr);

                if (options.applicativesContainers && options.applicativesContainers.length) {
                    var resultContainer = {};
                    for (var i = 0; i < options.applicativesContainers.length; i++) {
                        resultContainer[options.applicativesContainers[i]] = cgrFile.getApplicativeContainer(options.applicativesContainers[i], true);
                    }
                    //workerContext.postMessage({ applicativeContainers: resultContainer });
                    if (!rep) {
                        rep = {
                            reps: [],
                            resource: [],
                            material: []
                        }
                    }
                    rep.applicativesContainers = resultContainer;
                }

				if (rep && rep.error) {
                    onError(rep.error);
                    return;
                }
                if (rep != null) {
                    readyCB(rep);
                } else
                    onError();
            }

            function onError(errorMessage) {
                readyCB({
                    reps: [],
                    resource: [],
                    material: [],
                    error: errorMessage ? errorMessage : true
                });
            }

            function openCGR(byteArray) {

                var cgrFile = new CGRFile(byteArray, options);
                return cgrFile.open(options.uvr);
            }


            function load(url, readyCallback, progressCallback) {

                readyCB = readyCallback;
                var req = new XMLHttpRequest();
                //req.onprogress = onProgress;
                req.onload = onLoad;
                req.onerror = onError;
                // FLE BEGIN "posthttp:"+realurl+":postparams:"+"__fcs__jobTicket="+encodeURIComponent(fcsparams);
                if (url.slice(0, 8) == "posthttp") {
                    var indexofPostParams = url.indexOf(":postparams:");
                    var fcsurl = url.slice(9, indexofPostParams);
                    var params = url.slice(indexofPostParams + 12, url.length);
                    req.open("POST", fcsurl, false);
                    req.responseType = "arraybuffer";
                    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    req.send(params);
                } // FLE END
                else {
                    req.open("GET", url, false);
                    req.responseType = "arraybuffer";
                    req.send(null);
                } 

            };

            var buildTransferableMesh = function (meshes, transferables) {

                for (var i = 0; i < meshes.length; ++i) {
                    mesh = meshes[i];
                    if (i & 1 || i & 8) {//static
                        for (var j = 0; j < mesh.length; ++j) {
                            var meshStatic = mesh[j].tab;
                            for (var k = 0; k < meshStatic.length; ++k) {
                                var toto = meshStatic[k];
                                transferables.push(toto.vertexPositionArray.buffer);
                                if (toto.vertexNormalArray) {
                                    transferables.push(toto.vertexNormalArray.buffer);
                                }
                                transferables.push(toto.vertexIndexArray.buffer);
                            }
                        }
                        continue;
                    }
                    for (var j = 0; j < mesh.length; ++j) {
                        var toto = mesh[j];
                        transferables.push(toto.vertexPositionArray.buffer);
                        if (toto.vertexNormalArray) {
                            transferables.push(toto.vertexNormalArray.buffer);
                        }
                        transferables.push(toto.vertexIndexArray.buffer);

                        for (var k = 0; k < toto.drawingGroups.length; ++k) {
                            var dg = toto.drawingGroups[k];
                            if (dg._primitives.buffer) {
                                transferables.push(dg._primitives.buffer);
                            } else {
                                transferables.push(dg._primitives.prims.buffer);
                                transferables.push(dg._primitives.bs.buffer);
                            }
                        }
                    }
                }
            }

            var buildTransferable = function (data) {

                var transferables = [];
                var meshes = data.reps;
                var resource = data.resource;
                
                var decorations = data.decorations;

                if (decorations) {
                    transferables.push(decorations.buffer);
                }
                for (var i = 0; i < meshes.length; i++) {
                    buildTransferableMesh(meshes[i], transferables);
                }

                var voxelReps = data.voxelReps;

                if (voxelReps) {

                    for (var i = 0; i < voxelReps.length; i++) {

                        var voxelRep = voxelReps[i];
                        if (!voxelRep || !voxelRep.bufferData) { continue; }

                        transferables.push(voxelRep.bufferData);
                    }
                }

                //var decorations = data.decorations;
                //var length = decorations.length;
                //var newDecorations = new Uint8Array(decorations.length);
                //while (length--) newDecorations[length] = decorations[length];
                //transferables.push(newDecorations.buffer);
                //data.decorations = newDecorations;

                for (var j = 0 ; j < resource.length ; ++j) {
                    var texture = resource[j];
                    if (texture.img && !texture.noTransferable) {
                        transferables.push(texture.img.buffer);
                    }
                }
                
                return transferables;
            }
            var onCGRLoaded = function(mesh, target) {
                
                var transferables = [];
                transferables = buildTransferable(mesh);
                workerContext.postMessage({
                    error: mesh.error,
                    loadIndex: e.data.loadIndex,
                    sceneGraph: mesh.sceneGraph,
                    reps: mesh.reps,
                    resource: mesh.resource,
                    material: mesh.material,
                    sgRep: mesh.sgRep,
                    decorations: mesh.decorations,
                    advancedInheritance: mesh.advancedInheritance,
                    curvedPipes:mesh.curvedPipes,
                    infiniteGeometries: mesh.infiniteGeometries ,
                    compound: mesh.compound ,
					
                    voxelReps : mesh.voxelReps,
                    texts: mesh.texts,
                    rootBatch: mesh.rootBatch,
                    node: target,
                    compressedArray: mesh.compressedArray,
                    applicativesContainers: mesh.applicativesContainers,
                    CGR: true,
                    sag: mesh.sag,
                    OOCSmartStaticResult: mesh.OOCSmartStaticResult,
                    cullingData: mesh.cullingData,
                }, transferables);
            }

            var data = e.data;

            options = {
                processText: data.processText ? data.processText : false,
                withPrimBoundingElement: data.primitiveWithBS ? data.primitiveWithBS : false,
                withRepBoundingElement: data.repWithBS ? data.repWithBS : false,
                applicativesContainers: data.applicativesContainers ? data.applicativesContainers : null,
                smartStaticBatching: data.smartStaticBatching ? data.smartStaticBatching : false,
                mode2D: data.mode2D ? data.mode2D : false,
                sceneGraphOrder: data.sceneGraphOrderMode ? data.sceneGraphOrderMode : false,
                withSceneGraph: data.withSceneGraph ? data.withSceneGraph : false,
                flexibleBatching: data.udlMode ? data.udlMode : false,
                withBagUUID: data.withBagUUID ? data.withBagUUID : false,
                sag2D: (data.sagInfo && data.sagInfo.sag2D) ? data.sagInfo.sag2D : 0,
                sag3D: (data.sagInfo && data.sagInfo.sag3D) ? data.sagInfo.sag3D : 0,
                withSAG: data.withSAG ? data.withSAG : false,
                uvr: data.uvr ? data.uvr : false,
                defaultTCSetActivation: data.useDefaultTCSet ? data.useDefaultTCSet : false,
                withBlankingRep: data.withBlanking ? data.withBlanking : false,
                //forceNewCurvedPipes: data.optimizeCurvedPipes ? data.optimizeCurvedPipes : false,
                depthMode2D: data.depthMode2D ? data.depthMode2D : false,
                OOCSmartStaticInfo: data.OOCSmartStaticInfo ? data.OOCSmartStaticInfo : null,
                linkableBagRepUUID: data.linkableBagRepUUID ? data.linkableBagRepUUID : null,
                keepCompression: data.keepCompression ? data.keepCompression : false,
                forceNoShowCGR: data.forceNoShowCGR ? data.forceNoShowCGR : false,
                uint32Index: data.uint32Index ? data.uint32Index : false,
				sceneGraphOrderPriority:data.sceneGraphOrderPriority?data.sceneGraphOrderPriority: false,
                useGPUPlanarRendering: data.useGPUPlanarFace ? data.useGPUPlanarFace : false
               
            }

            var abs_path = data.path;
            var isBuffer = (typeof data.inputFile !== "undefined");

            if (isBuffer) {
                var tmp = {
                    target: {
                        response: data.inputFile
                    }
                };
                readyCB = function(mesh) {
                    onCGRLoaded(mesh, data.node);
                };
                onLoad(tmp);

            } else {
                load(abs_path, function(mesh) {
                    onCGRLoaded(mesh, data.node);
                });
            }

        };
        workerContext.postMessage({loaded:true});
    });

})(this);
