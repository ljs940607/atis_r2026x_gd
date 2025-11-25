(function (workerContext) {
    require([], function () {
        const distanceMapRange = 1 << 16;
        const frequencies = new Int32Array(distanceMapRange * 2);

        var centers = null;
        var splatCount = null;
        var indicesOut = null;
        var transfertBuffer = null; // used in order to reduce memory transfert
        var distances = null;
        workerContext.onmessage = function (message) {
            function onInit(payload) {
                // console.log(`Hello from worker onLoad(data) ==========`);
                centers = payload.data.centers;
                splatCount = centers.length / 3;

                indicesOut = new Uint32Array(splatCount);
                distances = new Float32Array(splatCount);
            }

            function onSort(payload) {
                // console.log(`received onSort data with array of size ${payload.data.splatIndices.length}`);

                const nbRendered = payload.data.nbRendered;
                const sortCount = payload.data.sortCount;
                splatSort(payload.data.splatIndices, payload.data.mvpMatrix, centers, indicesOut, distances, nbRendered, sortCount);

                transfertBuffer = new Float32Array(indicesOut, 0, nbRendered);
                workerContext.postMessage({ sortComplete: true, data: { nbRendered, indicesOut: transfertBuffer } }, [transfertBuffer.buffer]);
            }

            function splatSort(splatIndices, mvpMatrix, splatCenters, indicesOut, splatDistances, renderCount, sortCount) {
                const sortStart = renderCount - sortCount;

                var maxDistance = -2147483640;
                var minDistance = 2147483640;

                for (var i = sortStart; i < renderCount; i++) {
                    const indexOffset = 3 * splatIndices[i];
                    const distance =
                        (mvpMatrix.elements[2] * splatCenters[indexOffset] +
                            mvpMatrix.elements[6] * splatCenters[indexOffset + 1] +
                            mvpMatrix.elements[10] * splatCenters[indexOffset + 2]) *
                        4096.0;
                    splatDistances[i] = distance;
                    if (distance > maxDistance) maxDistance = distance;
                    if (distance < minDistance) minDistance = distance;
                }

                var distancesRange = maxDistance - minDistance;
                var rangeMap = (distanceMapRange - 1) / distancesRange;

                for (var i = 0; i < distanceMapRange * 2; i++) {
                    frequencies[i] = 0;
                }

                for (var i = sortStart; i < renderCount; i++) {
                    var frequenciesIndex = Math.round(
                        (splatDistances[i] - minDistance) * rangeMap
                    );
                    splatDistances[i] = frequenciesIndex;
                    frequencies[frequenciesIndex] = frequencies[frequenciesIndex] + 1;
                }

                var cumulativeFreq = frequencies[0];
                for (var i = 1; i < distanceMapRange; i++) {
                    var freq = frequencies[i];
                    cumulativeFreq += freq;
                    frequencies[i] = cumulativeFreq;
                }

                for (var i = sortStart - 1; i >= 0; i--) {
                    indicesOut[i] = splatIndices[i];
                }

                for (var i = renderCount - 1; i >= sortStart; i--) {
                    var frequenciesIndex = splatDistances[i];
                    var freq = frequencies[frequenciesIndex];
                    indicesOut[renderCount - freq] = splatIndices[i];
                    frequencies[frequenciesIndex] = freq - 1;
                }

                return indicesOut;
            };

            var payload = message.data;
            if (payload.init) {
                onInit(payload);
            } else if (payload.sort) {
                onSort(payload);
            }
        };

        workerContext.postMessage({ loaded: true });
    });
})(this);
