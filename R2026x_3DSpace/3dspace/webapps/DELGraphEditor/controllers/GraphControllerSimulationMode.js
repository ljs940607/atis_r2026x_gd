/// <amd-module name="DS/DELGraphEditor/controllers/GraphControllerSimulationMode"/>
define("DS/DELGraphEditor/controllers/GraphControllerSimulationMode", ["require", "exports", "DS/DELGraphModel/model/Link"], function (require, exports, Link_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphControllerSimulationMode = void 0;
    class GraphControllerSimulationMode {
        constructor(relationManager, cudManager, transactionManager) {
            this._previousSteps = [];
            this._relationManager = relationManager;
            this._cudManager = cudManager;
            this._transactionManager = transactionManager;
        }
        enableSimulationMode() {
        }
        playSimulation() {
            const steps = this._relationManager.defineGraphSteps();
            let stepIndex = 0;
            steps.forEach((step) => {
                step.forEach(async (_, path) => {
                    const linksIds = path.split("/");
                    stepIndex++;
                    for (let i = 0; i < linksIds.length; i++) {
                        const link = this._cudManager.getGraphEltById(linksIds[i]);
                        if (link instanceof Link_1.Link) {
                            const sourceNode = this._cudManager.getGraphEltById(link.sourceID);
                            const targetNode = this._cudManager.getGraphEltById(link.targetID);
                            if (!sourceNode || !targetNode)
                                return;
                            const nextNodes = (i !== linksIds.length - 1) ? [sourceNode] : [sourceNode, targetNode];
                            setTimeout(() => {
                                if (link && nextNodes)
                                    this._transactionManager.sendSingleAction({ action: "expandHoverAction", actionPayload: [...nextNodes, link], visibleElts: [...nextNodes, link] });
                            }, 500 + (i + stepIndex) * 500);
                            // await sleep(2000+(i+stepIndex)*500);
                        }
                    }
                });
            });
        }
        // playSimulation(){
        //     const steps=this._relationManager.defineGraphSteps();
        //     let delay=0;
        //     steps.forEach((step:Map<string,number>)=>{
        //         step.forEach((_,path:string)=>{
        //             const linksIds=path.split("/");
        //             delay+=linksIds.length*15;
        //             linksIds.forEach((id:string,number:number)=>{
        //                 const link=this._cudManager.getGraphEltById(id);
        //                 if(link instanceof Link) {
        //                     const sourceNode=this._cudManager.getGraphEltById(link.sourceID);
        //                     const targetNode=this._cudManager.getGraphEltById(link.targetID)
        //                     // this._transactionManager.sendSingleAction({ action: "dese", actionPayload: [], visibleElts: [] });
        //                     setTimeout(()=>{
        //                         if(link && sourceNode && targetNode) this._transactionManager.sendSingleAction({ action: "expandHoverAction", actionPayload: [sourceNode,targetNode,link], visibleElts: [sourceNode,targetNode,link] });
        //                     },(number+delay)*15)
        //                 }
        //             })
        //         })
        //     })
        // }
        highlightStepsDuringSimulation(graphEltsIds) {
            const graphElts = this._cudManager.getGraphEltsList().filter((graphElt) => graphEltsIds.includes(graphElt.id));
            this._transactionManager.start();
            this._transactionManager.register({ action: "highlightPreviousSteps", actionPayload: this._previousSteps, visibleElts: this._previousSteps });
            this._transactionManager.register({ action: "highlightCurrentSteps", actionPayload: graphElts, visibleElts: graphElts });
            this._transactionManager.end();
            this._previousSteps = [...this._previousSteps, ...graphElts];
        }
        disableSimulationMode() {
            this._previousSteps = [];
            this._transactionManager.sendSingleAction({ action: "unhighlightSteps", actionPayload: this._cudManager.getGraphEltsList(), visibleElts: this._cudManager.getGraphEltsList() });
        }
    }
    exports.GraphControllerSimulationMode = GraphControllerSimulationMode;
});
