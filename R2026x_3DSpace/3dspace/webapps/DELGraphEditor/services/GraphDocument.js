/// <amd-module name="DS/DELGraphEditor/services/GraphDocument"/>
define("DS/DELGraphEditor/services/GraphDocument", ["require", "exports", "../types/GraphStateMachinetypes"], function (require, exports, GraphStateMachinetypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphDocument = void 0;
    class GraphDocument {
        constructor(graphController, graphControllerSimulation, graphstateMachine) {
            this._graphController = graphController;
            this._graphStateMachine = graphstateMachine;
            this._graphControllerSimulation = graphControllerSimulation;
        }
        /**
         * method to create a node element
         * @param {graphEltProps} nodeProps
         */
        createNode(nodeProps) {
            const { id, label, type, position, ...props } = nodeProps;
            if (typeof id !== "undefined" && typeof label !== "undefined" && typeof type !== "undefined" && typeof position !== "undefined")
                this._graphController.createNode(id, label, type, position);
            if (props)
                this._graphController.updateGraphElt({ id: id, ...props }, true);
        }
        /**
         * method to create a link element
         * @param linkProps
         */
        createLink(linkProps) {
            const { id, type, sourceId, targetId, wayPoints, ...props } = linkProps;
            if (typeof id !== "undefined" && typeof type !== "undefined" && typeof sourceId !== "undefined" && typeof targetId !== "undefined" && typeof wayPoints !== "undefined")
                this._graphController.createLink(id, type, sourceId, targetId, wayPoints);
            if (props)
                this._graphController.updateGraphElt({ id: id, ...props }, true);
        }
        /**
         * method to update a graph element
         * @param graphEltProps
         */
        updateGraphElt(graphEltProps) {
            this._graphController.updateGraphElt(graphEltProps, true);
        }
        /**
         * method to update the id of a graph element
         * @param graphEltProps
        */
        updateGraphEltId(oldId, newId) {
            this._graphController.updateGraphEltId(oldId, newId);
        }
        /**
         * method to delete an elementby id
         * @param {string} id
         */
        deleteGraphElt(id) {
            this._graphController.deleteGraphElt(id, true);
        }
        /**
         * method to load a graph
         * @param {graphSchema} newModel
         */
        loadGraphModel(newModel) {
            this._graphController.loadData(newModel);
            this._graphController.fitToWindow();
        }
        /**
         * method to set the focus to the graphComponent
         */
        autoLayout() {
            this._graphController.autoLayout();
        }
        /**
         * method to set the focus to the graphComponent
         */
        setFocus() {
            this._graphController.setFocus();
        }
        /**
         * Method to enable the simulation Mode
         */
        enableSimulationMode() {
            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.ENABLE_SIMULATION);
        }
        /**
         * Method to play the simulation
         */
        playSimulation() {
            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PLAY_SIMULATION);
        }
        /**
         * Method to pause the simulation
         */
        pauseSimulation() {
            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PAUSE_SIMULATION);
        }
        /**
        * Method to pause the simulation
        */
        highlightStepsDuringSimulation(graphEltsIds) {
            this._graphControllerSimulation.highlightStepsDuringSimulation(graphEltsIds);
        }
        /***
         * Method to disable the simulation Mode
         */
        disableSimulationMode() {
            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.DISABLE_SIMULATION);
            this._graphController.setFocus();
        }
    }
    exports.GraphDocument = GraphDocument;
});
