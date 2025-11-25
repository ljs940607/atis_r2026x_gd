/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayFilterBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayFilterBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsContainedGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphContainerBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicEngine/EPSSchematicsExecutionGraph", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory", "DS/EPSSchematicsCoreLibrary/EPSEExecutionStateType", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsTools"], function (require, exports, ContainedGraphBlock, GraphContainerBlock, ControlPortDefinitions, DataPortDefinitions, TypeLibrary, Enums, ExecutionGraph, ExecutionEnums, ArrayCategory, EExecutionState, BlockLibrary, Tools) {
    "use strict";
    class ArrayFilterGraphBlock extends ContainedGraphBlock {
        constructor() {
            super();
            const inPort = this.getControlPorts()[0];
            inPort.setRenamable(false);
            this.createControlPorts([
                new ControlPortDefinitions.Output('True'),
                new ControlPortDefinitions.Output('False')
            ]);
            this.setDataPortInputRules({ dynamicCount: 0 });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({ dynamicCount: 0 });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
        }
        /**
         * On set.
         * @private
         * @param {GraphContainerBlock} iContainer - The graph container block.
         */
        onSet(iContainer) {
            this.createDataPorts([
                new DataPortDefinitions.InputRefArrayValue('Element', iContainer.getDataPortByName('ArrayIn')),
                new DataPortDefinitions.InputRef('SharedData', iContainer.getDataPortByName('SharedData')),
                new DataPortDefinitions.InputBasic('Index', 'Integer'),
                new DataPortDefinitions.OutputBasic('Error', 'Object')
            ]);
            super.onSet(iContainer);
        }
    }
    ArrayFilterGraphBlock.prototype.name = 'Array Filter';
    const ArrayFilterState = {
        state: {
            type: 'EExecutionState',
            defaultValue: undefined,
            mandatory: true
        },
        arrayOutIndex: {
            type: 'Integer',
            defaultValue: undefined,
            mandatory: false
        },
        errorIndex: {
            type: 'Integer',
            defaultValue: undefined,
            mandatory: false
        }
    };
    TypeLibrary.registerGlobalObjectType('ArrayFilterState', ArrayFilterState);
    const ArrayFilterProgress = {
        arrayInIndex: {
            type: 'Integer',
            defaultValue: undefined,
            mandatory: true
        },
        state: {
            type: 'EExecutionState',
            defaultValue: undefined,
            mandatory: true
        }
    };
    TypeLibrary.registerGlobalObjectType('ArrayFilterProgress', ArrayFilterProgress);
    const ArrayFilterError = {
        arrayInIndex: {
            type: 'Integer',
            defaultValue: undefined,
            mandatory: true
        },
        error: {
            type: 'Object',
            defaultValue: undefined,
            mandatory: false
        }
    };
    TypeLibrary.registerGlobalObjectType('ArrayFilterError', ArrayFilterError);
    class ArrayFilterBlock extends GraphContainerBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Success'),
                new ControlPortDefinitions.Output('Progress'),
                new ControlPortDefinitions.Output('Error')
            ]);
            const stateTypes = ['Array<ArrayFilterState>'];
            const progressTypes = ['Array<ArrayFilterProgress>'];
            const errorTypes = ['Array<ArrayFilterError>'];
            // to break cyclic dependencies
            //const hasCSIGraphBlock = BlockLibrary.hasBlock(CSIGraphBlock.prototype.uid);
            const hasCSIGraphBlock = BlockLibrary.hasBlock('6d004daa-6201-413e-9bde-45dbc9351cc6');
            if (hasCSIGraphBlock) {
                if (TypeLibrary.hasGlobalType('CSIExecGraphArrayFilterState', Enums.FTypeCategory.fObject)) {
                    stateTypes.unshift('Array<CSIExecGraphArrayFilterState>');
                }
                if (TypeLibrary.hasGlobalType('CSIExecGraphArrayFilterProgress', Enums.FTypeCategory.fObject)) {
                    progressTypes.unshift('Array<CSIExecGraphArrayFilterProgress>');
                }
                if (TypeLibrary.hasGlobalType('CSIExecGraphArrayFilterError', Enums.FTypeCategory.fObject)) {
                    errorTypes.unshift('Array<CSIExecGraphArrayFilterError>');
                }
            }
            const inputDataPort = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputAll('SharedData', 'Double', {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                }),
                new DataPortDefinitions.OutputRef('ArrayOut', inputDataPort),
                new DataPortDefinitions.OutputList('State', stateTypes),
                new DataPortDefinitions.OutputList('Progress', progressTypes),
                new DataPortDefinitions.OutputList('Error', errorTypes)
            ]);
            if (hasCSIGraphBlock) {
                const nodeIdSelectorType = TypeLibrary.hasGlobalType('CSIExecGraphNodeIdSelector', Enums.FTypeCategory.fObject) ? 'CSIExecGraphNodeIdSelector' : 'Object';
                this.createDataPort(new DataPortDefinitions.InputExternalBasic('NodeIdSelector', nodeIdSelectorType, undefined, true));
            }
            this.setContainedGraph(new ArrayFilterGraphBlock());
            if (hasCSIGraphBlock) {
                this.activateNodeIdSelector();
            }
        }
        onAdd(iGraphBlock) {
            super.onAdd(iGraphBlock);
            this.setNodeIdSelector(Tools.parentNodeIdSelector);
        }
        execute(runParams) {
            const inActivated = this.isInputControlPortActivated('In');
            let arrayIn;
            let sharedData;
            if (inActivated) {
                arrayIn = this.getInputDataPortValue('ArrayIn');
                if (arrayIn === undefined) {
                    throw new Error('The data port ArrayIn is undefined!');
                }
                sharedData = this.getInputDataPortValue('SharedData');
                this.data.executionGraphs = {};
                this.data.arrayOut = arrayIn.slice();
                this.data.state = [];
                this.data.state.length = arrayIn.length;
                this.data.error = [];
                this.data.error.length = arrayIn.length;
                this.data.progress = [];
                this.data.result = [];
            }
            var executionGraph;
            var executionGraphResult;
            for (let i = 0; i < this.data.arrayOut.length; i++) {
                executionGraph = this.data.executionGraphs[i];
                if (inActivated) {
                    executionGraph = new ExecutionGraph(this.model.getContainedGraph(), undefined, undefined, this.parent.getModules(), this.parent.getNode(), this.parent.getNodeId());
                    executionGraph.traceMode = ExecutionEnums.FTraceEvent.fNone;
                    executionGraph.setInputDataPortValue('Element', arrayIn[i]);
                    executionGraph.setInputDataPortValue('SharedData', sharedData);
                    executionGraph.setInputDataPortValue('Index', i);
                    executionGraph.activateInputControlPort('In');
                    this.data.executionGraphs[i] = executionGraph;
                    this.data.state[i] = {
                        state: EExecutionState.eRunning,
                        arrayOutIndex: undefined,
                        errorIndex: undefined
                    };
                    this.data.result[i] = false;
                }
                if (executionGraph !== undefined) {
                    executionGraphResult = executionGraph.execute(runParams);
                    if (executionGraphResult === Enums.EExecutionResult.eExecutionError) {
                        throw new Error('Failed to execute array filter graph with index: ' + i);
                    }
                    else if (executionGraph.isOutputControlPortActivated('True') || executionGraph.isOutputControlPortActivated('False')) {
                        this.data.result[i] = executionGraph.isOutputControlPortActivated('True');
                        const error = executionGraph.getOutputDataPortValue('Error');
                        this.data.state[i].state = error === undefined ? EExecutionState.eSuccess : EExecutionState.eError;
                        this.data.progress.push({
                            arrayInIndex: i,
                            state: this.data.state[i].state
                        });
                        if (error !== undefined) {
                            this.data.error[i] = {
                                arrayInIndex: i,
                                error: error
                            };
                        }
                        executionGraph.disconnect();
                        delete this.data.executionGraphs[i];
                    }
                }
            }
            this.setOutputDataPortValue('State', this.data.state);
            if (this.data.progress.length > 0) {
                this.setOutputDataPortValue('Progress', this.data.progress);
                this.data.progress = [];
                this.activateOutputControlPort('Progress');
            }
            let executionResult = Enums.EExecutionResult.eExecutionPending;
            if (Object.keys(this.data.executionGraphs).length === 0) {
                let arrayOutIndex = 0;
                let errorIndex = 0;
                for (let s = 0; s < this.data.state.length; s++) {
                    const state = this.data.state[s];
                    if (state.state === EExecutionState.eSuccess) {
                        this.data.error.splice(errorIndex, 1);
                    }
                    else {
                        state.errorIndex = errorIndex++;
                    }
                    if (this.data.result[s]) {
                        state.arrayOutIndex = arrayOutIndex++;
                    }
                    else {
                        this.data.arrayOut.splice(arrayOutIndex, 1);
                    }
                }
                this.setOutputDataPortValue('ArrayOut', this.data.arrayOut);
                this.setOutputDataPortValue('Error', this.data.error);
                if (this.data.error.length > 0) {
                    this.activateOutputControlPort('Error');
                }
                else {
                    this.activateOutputControlPort('Success');
                }
                executionResult = Enums.EExecutionResult.eExecutionFinished;
            }
            return executionResult;
        }
    }
    ArrayFilterBlock.prototype.uid = 'ea7c680a-eba2-4908-9a14-328aa99916e4';
    ArrayFilterBlock.prototype.name = 'Array Filter';
    ArrayFilterBlock.prototype.category = ArrayCategory;
    ArrayFilterBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayFilterBlockDoc';
    return ArrayFilterBlock;
});
