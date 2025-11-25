
(function(workerContext) {

    require(['DS/XCADLoader/STEPFile'], function(STEPFile) {
    
        workerContext.onmessage = function(e) {

            var readyCB = null;
            //this.t0 = performance.now();

            function onLoad(e) {
                
                var stepFile = new STEPFile();
                var rep = stepFile.processModel(e.target.response); 

				/*if (rep && rep.error) {
                    onError(rep.error);
                    return;
                }*/
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

            /*function openSTEP(byteArray) {

                var stepFile = new STEPFile(byteArray);
                return stepFile.open();
            }*/

            function load(url, readyCallback) {

                readyCB = readyCallback;
                var req = new XMLHttpRequest();
                
                req.onload = onLoad;
                req.onerror = onError;
               
                if (url.slice(0, 8) == "posthttp") {
                    var indexofPostParams = url.indexOf(":postparams:");
                    var fcsurl = url.slice(9, indexofPostParams);
                    var params = url.slice(indexofPostParams + 12, url.length);
                    req.open("POST", fcsurl, false);
                    req.responseType = "arraybuffer";
                    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    req.send(params);
                } // FILE END
                else {
                    req.open("GET", url, false);
                    req.responseType = "arraybuffer";
                    req.send(null);
                } 

            };

            var onSTEPLoaded = function(rep, target) {
                
                //this.t1 = performance.now();

                var testbuf = false;

                if(!testbuf){
                    workerContext.postMessage({
                        error: null,
                        loadIndex: e.data.loadIndex,
                        associatedDocument: rep[0]._associatedDocument,
                        stepRepresentationIndex: rep[0]._stepRepresentationIndex,
                        stepAnnotRepresentationIndex: rep[1] ? rep[1]._stepRepresentationIndex : null,
                        rootNodes: rep[0]._rootNodes,
                        node: target/*,
                        info: this.t1 - this.t0*/
                    });
                }else{

                    let loadIndexint8View = new TextEncoder().encode(e.data.loadIndex.toString());
                    let nodeint8View = new TextEncoder().encode(target.toString());
                    //let info =  this.t1 - this.t0;
                    //let infoint8View = new TextEncoder().encode(info.toString());
                    let rootNodesint8View = new TextEncoder().encode(JSON.stringify(rep._rootNodes));
                    let stepRepresentationIndexint8View = new TextEncoder().encode(rep._stepRepresentationIndex.toString());
                    let associatedDocumentint8View = rep._associatedDocument.serialize();
                    associatedDocumentint8View = new TextEncoder().encode(associatedDocumentint8View);

                    workerContext.postMessage(
                        {loadIndex: loadIndexint8View, rootNodes: rootNodesint8View, stepRepresentationIndex: stepRepresentationIndexint8View, associatedDocument: associatedDocumentint8View, node: nodeint8View/*, info: infoint8View*/},
                        [loadIndexint8View.buffer, rootNodesint8View.buffer, stepRepresentationIndexint8View.buffer, associatedDocumentint8View.buffer, nodeint8View.buffer/*, infoint8View.buffer*/]
                      );
                    }
               
            }

            var data = e.data;
            processText = data.processText;
            var abs_path = data.path;
            var isBuffer = (typeof data.inputFile !== "undefined");
       

            if (isBuffer) {
                var tmp = {
                    target: {
                        response: data.inputFile
                    }
                };
                
                readyCB = function(rep) {
                    onSTEPLoaded(rep, data.node);
                };
                onLoad(tmp);

            } else {
               
                load(abs_path, function(rep) {
                    onSTEPLoaded(rep, data.node);
                });
            }

        };
        workerContext.postMessage({loaded:true});
    });

})(this);
