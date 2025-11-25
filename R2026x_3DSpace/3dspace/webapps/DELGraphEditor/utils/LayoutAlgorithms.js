/// <amd-module name="DS/DELGraphEditor/utils/LayoutAlgorithms"/>
define("DS/DELGraphEditor/utils/LayoutAlgorithms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stepsRanking = exports.rankingAutoLayoutAlgorithms = void 0;
    const rankingAutoLayoutAlgorithms = (nodes, links) => {
        const setOfRanks = new Map();
        const targetIdsList = links.map((link) => link.targetID);
        const sourceIdsList = links.map((link) => link.sourceID);
        const selfIdsList = links.filter((link) => link.targetID === link.sourceID).map((link) => link.targetID);
        ;
        let tempArray = [];
        for (let i = 0; i < nodes.length; i++) {
            if (!targetIdsList.includes(nodes[i].id) || (selfIdsList.includes(nodes[i].id))) {
                tempArray.push(nodes[i].id); //sourceNodes, nodes which are not connected to any other node and self transition
                setOfRanks.set(nodes[i].id, 0); // in a set the key should be unique
            }
        }
        let k = 1;
        if (setOfRanks.size === 0 && nodes.length > 0 && nodes[0].id) {
            setOfRanks.set(nodes[0].id, 0);
            tempArray.push(nodes[0].id);
        }
        while (setOfRanks.size < nodes.length) {
            const targetsIdsPreviousRank = links.filter((link) => tempArray.includes(link.sourceID)).map((link) => link.targetID);
            let blockingPointCondition = targetsIdsPreviousRank.length === 0;
            if (targetsIdsPreviousRank.length !== 0) {
                tempArray = targetsIdsPreviousRank;
                targetsIdsPreviousRank.forEach((targetId) => {
                    if (!setOfRanks.has(targetId))
                        setOfRanks.set(targetId, k);
                    else
                        blockingPointCondition = true && setOfRanks.size < nodes.length;
                });
            }
            if (blockingPointCondition) {
                for (let i = 0; i < sourceIdsList.length; i++) {
                    if (!setOfRanks.has(sourceIdsList[i])) {
                        setOfRanks.set(sourceIdsList[i], k);
                        tempArray.push(sourceIdsList[i]);
                        break;
                    }
                }
            }
            k++;
        }
        return setOfRanks;
    };
    exports.rankingAutoLayoutAlgorithms = rankingAutoLayoutAlgorithms;
    const stepsRanking = (nodes, links) => {
        const setOfRanks = new Map();
        const targetIdsList = links.map((link) => link.targetID);
        const sourceIdsList = links.map((link) => link.sourceID);
        const linksIdsList = links.map((link) => link.id);
        for (let i = 0; i < nodes.length; i++) {
        }
        return setOfRanks;
    };
    exports.stepsRanking = stepsRanking;
});
