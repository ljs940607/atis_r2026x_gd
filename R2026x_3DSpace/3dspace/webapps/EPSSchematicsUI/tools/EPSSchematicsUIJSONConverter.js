/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIJSONConverter'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIJSONConverter", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsJSONConverter"], function (require, exports, GraphBlock, JSONConverter) {
    "use strict";
    class UIJSONConverter {
        static convertGraph(json) {
            JSONConverter.convertGraph(json);
            json.convertedUIVersion = json.convertedUIVersion || json.version;
            if (json.convertedUIVersion === undefined) {
                this.convertGraphV000ToV100(json);
            }
            if (json.convertedUIVersion === '1.0.0') {
                this.convertGraphV100ToV101(json);
            }
            if (json.convertedUIVersion === '1.0.1') {
                this.convertGraphV101ToV200(json);
            }
            if (json.convertedUIVersion === '2.0.0') {
                this.convertGraphV200ToV201(json);
            }
            if (json.convertedUIVersion === '2.0.1') {
                this.convertGraphV201ToV202(json);
            }
            if (json.convertedUIVersion === '2.0.2') {
                this.convertGraphV202ToV203(json);
            }
            if (json.convertedUIVersion === '2.0.3') {
                this.convertGraphV203ToV204(json);
            }
            if (json.convertedUIVersion === '2.0.4') {
                this.convertGraphV204ToV205(json);
            }
            if (json.convertedUIVersion === '2.0.5') {
                this.convertGraphV205ToV206(json);
            }
        }
        static convertGlobalTemplates(json) {
            JSONConverter.convertGlobalTemplates(json);
            json.convertedUIVersion = json.convertedUIVersion || json.version;
            if (json.convertedUIVersion === '2.0.1') {
                this.convertGlobalTemplatesV201ToV202(json);
            }
            if (json.convertedUIVersion === '2.0.2') {
                this.convertGlobalTemplatesV202ToV203(json);
            }
            if (json.convertedUIVersion === '2.0.3') {
                this.convertGlobalTemplatesV203ToV204(json);
            }
            if (json.convertedUIVersion === '2.0.4') {
                this.convertGlobalTemplatesV204ToV205(json);
            }
            if (json.convertedUIVersion === '2.0.5') {
                this.convertGlobalTemplatesV205ToV206(json);
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V000ToV100                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV000ToV100(json) {
            json.convertedUIVersion = '1.0.0';
            const ui = json.ui;
            if (ui !== undefined) {
                ui.blocks?.forEach(block => this.convertBlockV000ToV100(block));
                if (ui.inputParameterPorts && ui.outputParameterPorts && ui.localParameterPorts) {
                    ui.dataPorts = ui.inputParameterPorts.concat(ui.outputParameterPorts, ui.localParameterPorts);
                    delete ui.inputParameterPorts;
                    delete ui.outputParameterPorts;
                    delete ui.localParameterPorts;
                }
                if (ui.inputExecutionPorts && ui.outputExecutionPorts) {
                    ui.controlPorts = ui.inputExecutionPorts.concat(ui.outputExecutionPorts);
                    delete ui.inputExecutionPorts;
                    delete ui.outputExecutionPorts;
                }
                if (ui.links) {
                    ui.dataLinks = ui.links.filter(link => link.type === 0); // eParameter
                    ui.controlLinks = ui.links.filter(link => link.type === 1); // eExecution
                    delete ui.links;
                }
            }
        }
        static convertBlockV000ToV100(ui) {
            if (ui.inputParameterPorts && ui.outputParameterPorts) {
                ui.dataPorts = ui.inputParameterPorts.concat(ui.outputParameterPorts);
                delete ui.inputParameterPorts;
                delete ui.outputParameterPorts;
            }
            if (ui.inputExecutionPorts && ui.outputExecutionPorts) {
                ui.controlPorts = ui.inputExecutionPorts.concat(ui.outputExecutionPorts);
                delete ui.inputExecutionPorts;
                delete ui.outputExecutionPorts;
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V100ToV101                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV100ToV101(json) {
            json.convertedUIVersion = '1.0.1';
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V101ToV200                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV101ToV200(json) {
            json.convertedUIVersion = '2.0.0';
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V200ToV201                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV200ToV201(json) {
            json.convertedUIVersion = '2.0.1';
            const ui = json.ui;
            ui.blocks?.forEach(block => this.convertBlockV200ToV201(block));
            ui.graphLeft = ui.left;
            ui.graphTop = ui.top;
            delete ui.left;
            delete ui.top;
            json.templates.ui = {
                graphs: {},
                scripts: {}
            };
        }
        static convertBlockV200ToV201(ui) {
            if (ui.graphRef !== undefined) {
                ui.graphLeft = ui.graphRef.left;
                ui.graphTop = ui.graphRef.top;
                ui.width = ui.graphRef.width;
                ui.height = ui.graphRef.height;
                ui.blocks = ui.graphRef.blocks;
                ui.dataPorts = ui.graphRef.dataPorts;
                ui.controlPorts = ui.graphRef.controlPorts;
                ui.dataLinks = ui.graphRef.dataLinks;
                ui.controlLinks = ui.graphRef.controlLinks;
                ui.shortcuts = ui.graphRef.shortcuts;
                delete ui.graphRef;
                ui.blocks?.forEach(block => this.convertBlockV200ToV201(block));
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V201ToV202                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV201ToV202(json) {
            json.convertedUIVersion = '2.0.2';
            if (json.templates.ui !== undefined) {
                json.templates.ui.scripts = {};
            }
        }
        static convertGlobalTemplatesV201ToV202(json) {
            json.convertedUIVersion = '2.0.2';
            if (json.ui !== undefined) {
                json.ui.scripts = {};
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V202ToV203                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV202ToV203(json) {
            json.convertedUIVersion = '2.0.3';
            if (json.ui !== undefined) {
                this.convertBlockV202ToV203(json.ui, json.model);
                const graphUids = Object.keys(json.templates.ui.graphs);
                graphUids.forEach(uid => this.convertBlockV202ToV203(json.templates.ui.graphs[uid], json.templates.model.graphs[uid]));
                const scriptUids = Object.keys(json.templates.ui.scripts);
                scriptUids.forEach(uid => this.convertBlockV202ToV203(json.templates.ui.scripts[uid], json.templates.model.scripts[uid]));
            }
        }
        static convertBlockV202ToV203(ui, model) {
            if (model.definition?.uid === GraphBlock.prototype.uid && ui.blocks !== undefined) {
                ui.blocks.forEach((block, index) => this.convertBlockV202ToV203(block, model.blocks?.[index]));
            }
            if (ui.dataPorts === undefined) {
                ui.dataPorts = [];
            }
            if (model.dataPorts) {
                for (let dp = 0; dp < model.dataPorts.length; dp++) {
                    ui.dataPorts[dp] = ui.dataPorts[dp] || { dataPorts: [] };
                    this.convertPortV202ToV203(ui.dataPorts[dp]);
                }
            }
        }
        static convertPortV202ToV203(ui) {
            ui.dataPorts = [];
        }
        static convertGlobalTemplatesV202ToV203(json) {
            json.convertedUIVersion = '2.0.3';
            if (json.ui !== undefined) {
                const graphUids = Object.keys(json.ui.graphs);
                graphUids.forEach(uid => this.convertBlockV202ToV203(json.ui.graphs[uid], json.model.graphs[uid]));
                const scriptUids = Object.keys(json.ui.scripts);
                scriptUids.forEach(uid => this.convertBlockV202ToV203(json.ui.scripts[uid], json.model.scripts[uid]));
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V203ToV204                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV203ToV204(json) {
            json.convertedUIVersion = '2.0.4';
        }
        static convertGlobalTemplatesV203ToV204(json) {
            json.convertedUIVersion = '2.0.4';
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V204ToV205                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV204ToV205(json) {
            json.convertedUIVersion = '2.0.5';
        }
        static convertGlobalTemplatesV204ToV205(json) {
            json.convertedUIVersion = '2.0.5';
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                          V205ToV206                                            //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        static convertGraphV205ToV206(json) {
            json.convertedUIVersion = '2.0.6';
            if (json.ui !== undefined) {
                this.convertBlockV205ToV206(json.ui);
            }
        }
        static convertGlobalTemplatesV205ToV206(json) {
            json.convertedUIVersion = '2.0.6';
            if (json.ui !== undefined) {
                const graphUids = Object.keys(json.ui.graphs);
                graphUids.forEach(uid => this.convertBlockV205ToV206(json.ui.graphs[uid]));
                const scriptUids = Object.keys(json.ui.scripts);
                scriptUids.forEach(uid => this.convertBlockV205ToV206(json.ui.scripts[uid]));
            }
        }
        static convertBlockV205ToV206(ui) {
            if (ui.dataPorts !== undefined) {
                ui.dataPorts.forEach(dataPort => {
                    if (dataPort.dataPorts !== undefined) {
                        dataPort.dataPorts.forEach(subDataPort => {
                            const subDataPortV205 = subDataPort;
                            if (subDataPortV205.inside !== undefined) {
                                subDataPort.inside = { show: subDataPortV205.inside };
                            }
                            if (subDataPortV205.outside !== undefined) {
                                subDataPort.outside = { show: subDataPortV205.outside };
                            }
                            if (subDataPortV205.input !== undefined) {
                                subDataPort.localInput = { show: subDataPortV205.input };
                                delete subDataPortV205.input;
                            }
                            if (subDataPortV205.output !== undefined) {
                                subDataPort.localOutput = { show: subDataPortV205.output };
                                delete subDataPortV205.output;
                            }
                        });
                    }
                });
            }
            if (ui.blocks !== undefined) {
                ui.blocks?.forEach(block => this.convertBlockV205ToV206(block));
            }
            else if (ui.containedGraph !== undefined) {
                this.convertBlockV205ToV206(ui.containedGraph);
            }
        }
    }
    return UIJSONConverter;
});
