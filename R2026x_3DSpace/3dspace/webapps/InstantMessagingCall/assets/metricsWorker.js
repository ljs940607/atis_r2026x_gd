const intervalBetweenTwoMetrics = 5; // seconds
const alertsSent = {};
const callStartTime = new Date();

/**
 * Set of unique user IDs.
 * @type {Set<string>}
 */
const users = new Set();
const kinds = ["screen", "audio", "video"];
const types = ["local", "remote", "producer", "consumer"];

/**
 * Object containing the threshold for some of the important metrics. The
 * tolerance threshold is a ratio used to determine the limit beyond which the
 * metric is no longer considered acceptable. (0.9 -> 90%) eg. : 30 fps threshold
 * -> tolerated 27 fps
 * @type {Object<string, {threshold : number, toleranceThreshold : number}>}
 */
const alertThresholds = {
  currentRoundTripTime: { threshold: 250, toleranceThreshold: 0.9 }, // Alert if round-trip time exceeds 250 ms (1 second)
  jitter: { threshold: 45, toleranceThreshold: 0.9 }, // Alert if jitter exceeds 45 ms
  packetsLost: { threshold: 10, toleranceThreshold: 0.9 }, // Alert if the percentage of packets lost exceeds 10%
  framesPerSecond: { threshold: 30, toleranceThreshold: 0.9 }, // Alert if frames per second falls below 15 fps
  frameHeight: { threshold: 240, toleranceThreshold: 0.9 }, // Alert if frame height falls below 240 pixels (low video quality)
  frameWidth: { threshold: 320, toleranceThreshold: 0.9 }, // Alert if frame width falls below 320 pixels (low video quality)
  totalEncodeTime: { threshold: 200, toleranceThreshold: 0.9 }, // Alert if total encode time exceeds 200 ms
};

/**
 * Array containing the most interesting metrics to monitor.
 * @type {Array<string>}
 */
const metricsToCollect = [
  "clockRate",
  "currentRoundTripTime",
  "jitter",
  "packetsReceived",
  "packetsLost",
  "bytesSent",
  "channels",
  "audioLevel",
  "frameHeight",
  "frameWidth",
  "framesPerSecond",
  "totalEncodeTime",
];

const metricsData = metricsToCollect.reduce((acc, metric) => {
  acc[metric] = [];
  return acc;
}, {});

/**
 * Adds a new metric to the metricsData.
 * @param {string} metricName - Name of the metric.
 * @param {string} kind - Kind of the track (audio | screen | video).
 * @param {string} type - Type of the track (local | remote | producer | consumer).
 * @param {string} userId - ID of the user.
 * @param {any} value - Value of the metric.
 */
const addNewMetric = (metricName, kind, type, userId, value) => {
  metricsData[metricName].push({ userId, kind, type, value });
  users.add(userId);
};

/**
 * Gets metric values for a specific user, kind, and type.
 * @param {string} metricName - Name of the metric.
 * @param {string} kind - Kind of the track (audio | screen | video).
 * @param {string} type - Type of the track (local | remote).
 * @param {string} userId - ID of the user.
 * @returns {Array<any>} - Array of metric values.
 */
const getMetricValues = (metricName, kind, type, userId) => {
  return metricsData[metricName]
    .filter(
      (metric) =>
        metric.userId === userId && metric.kind === kind && metric.type === type
    )
    .map((metric) => metric.value);
};

/**
 * Calculates the differences between consecutive values in a metric.
 * @param {string} metricName - Name of the metric.
 * @param {string} kind - Kind of the track (audio | screen | video).
 * @param {string} type - Type of the track (local | remote).
 * @param {string} userId - ID of the user.
 * @returns {Array<number>} - Array of differences between consecutive metric values.
 */
const differenceBetweenNumbersInMetric = (metricName, kind, type, userId) => {
  const metrics = getMetricValues(metricName, kind, type, userId);
  if (!metrics.length) return [];
  return metrics.slice(1).map((x, i) => x - metrics[i]);
};

/**
 * Calculate call duration.
 * @returns {number} - Call duration.
 */
const calculateCallDuration = () => {
  const endDate = new Date();
  return Math.floor((endDate - callStartTime) / 1000);
};

/**
 * Calculates the packet loss rate based on the provided metrics.
 * @param {string} kind - The kind of metrics to retrieve.
 * @param {string} type - The type of metrics to retrieve.
 * @param {string} userId - The ID of the user for whom metrics are retrieved.
 * @returns {number[]} An array containing calculated packet loss rates as percentages.
 */
const calculatePacketsLostRate = (kind, type, userId) => {
  const packetsLostMetrics = differenceBetweenNumbersInMetric(
    "packetsLost",
    kind,
    type,
    userId
  );
  const packetsReceivedMetrics = differenceBetweenNumbersInMetric(
    "packetsReceived",
    kind,
    type,
    userId
  );

  if (packetsLostMetrics.length === 0 || packetsReceivedMetrics.length === 0)
    return [];

  return packetsLostMetrics.map((lost, i) => {
    const received = packetsReceivedMetrics[i];
    if (received === 0) return 0; // no division by zero
    return (lost / (lost + received)) * 100;
  });
};

/**
 * Calculates the bitrates based on the provided metrics.
 * @param {string} kind - Kind of the track (audio | screen | video).
 * @param {string} type - Type of the track (local | remote).
 * @param {string} userId - ID of the user.
 * @returns {number[]} An array containing calculated bitrates.
 */
const calculateAverageBitrate = (value) => {
  const duration = calculateCallDuration();
  return (value * 8) / (1000 * duration);
};

/**
 * Calculates the average value of the numbers in the provided array.
 * @param {number[]} array - The array of numbers to calculate the average from.
 * @returns {number} The average value of the array. Returns 0 if the array is empty or if the sum of the array is 0.
 */
const calculateAverageFromArray = (array) => {
  const length = array.length;
  if (length === 0) return 0;

  const sum = array.reduce((total, metric) => total + metric, 0);
  return sum === 0 ? 0 : sum / length;
};

/**
 * Calculates the average of the specified metric for a user.
 * @param {string} metricName - Name of the metric.
 * @param {string} kind - Kind of the track (audio | screen | video).
 * @param {string} type - Type of the track (local | remote).
 * @param {string} userId - ID of the user.
 * @returns {number} - Average value of the metric.
 */
const calculateAverageMetric = (metricName, kind, type, userId) => {
  const metrics = getMetricValues(metricName, kind, type, userId);
  let avg = 0;
  if (!metrics.length) return 0;
  if (metrics.every((metric) => typeof metric === "string")) return metrics[0];
  switch (metricName) {
    case "bytesSent":
      avg = calculateAverageBitrate(metrics[metrics.length - 1]);
      break;
    case "packetsLost":
      const packetsLostRates = calculatePacketsLostRate(kind, type, userId);
      avg = calculateAverageFromArray(packetsLostRates);
      break;
    default:
      avg = calculateAverageFromArray(metrics);
      break;
  }
  return avg;
};

/**
 * Groups the final report by userId.
 *
 * @param {Array<Object>} finalReport - The final report array containing metric objects.
 * @returns {Object} - An object where the keys are userIds and the values are arrays of the corresponding metric objects without the userId.
 */
const groupByUserId = (finalReport) =>
  finalReport.reduce((acc, current) => {
    const { userId, ...rest } = current;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(rest);
    return acc;
  }, {});

/**
 * Merges metrics of the same kind and type for each userId, combining them into a single object.
 *
 * @param {Array<Object>} finalReport - The final report array containing metric objects.
 * @returns {Array<Object>} - An array of merged metric objects, each containing the userId, kind, type, and a metrics object.
 */
const mergeSameTrackMetrics = (finalReport) => {
  const mergedMetrics = finalReport.reduce((mergingMetrics, metric) => {
    const { userId, kind, type, metricName, averageValue } = metric;
    const key = `${userId}-${kind}-${type}`;
    if (!mergingMetrics[key]) {
      mergingMetrics[key] = { userId, kind, type, metrics: {} };
    }
    mergingMetrics[key].metrics = {
      ...mergingMetrics[key].metrics,
      [metricName]: averageValue,
    };
    return mergingMetrics;
  }, {});
  return Object.values(mergedMetrics);
};

/**
 * Creates the final report of all metrics for each user.
 * @returns {Array<Object>} - Final report array.
 */
const createFinalReport = () => {
  const finalReport = [];
  users.forEach((user) => {
    kinds.forEach((kind) => {
      types.forEach((type) => {
        [
          "jitter",
          "currentRoundTripTime",
          "packetsLost",
          "bytesSent",
          "framesPerSecond",
        ].forEach((metricName) => {
          const value = calculateAverageMetric(metricName, kind, type, user);
          if (value) {
            finalReport.push({
              userId: user,
              kind,
              type,
              metricName: metricName === "bytesSent" ? "bitrate" : metricName,
              averageValue:
                metricName === "jitter" || metricName === "currentRoundTripTime"
                  ? value * 1000
                  : value,
            });
          }
        });
      });
    });
  });
  const mergedMetrics = mergeSameTrackMetrics(finalReport);
  const mergedGroupedByUser = groupByUserId(mergedMetrics);
  return mergedGroupedByUser;
};

/**
 * Array of metrics names that trigger alerts when they exceed their thresholds.
 * @type {Array<string>}
 */
const superiorToThreshold = [
  "currentRoundTripTime",
  "jitter",
  "totalEncodeTime",
];

/**
 * Sends an action to the store.
 * @param {string} action - Name of the action to send to the store.
 * @param {any} payload - Payload that will be sent to the store.
 */
const sendToStore = (action, payload) => {
  self.postMessage({ action, payload });
};

/**
 * Finds an alert that was already sent for the given metric.
 * @param {string} metricName - Name of the metric.
 * @param {string} userId - ID of the user concerned by the metric.
 * @param {boolean} type - Is it a metric for a remote track or a local track?
 * @param {string} kind - Type of the track (audio | screen | video).
 * @returns {Object | undefined} - Object if it exists else undefined.
 */
const findSentAlert = (metricName, userId, type, kind) => {
  const existingAlerts = alertsSent[metricName];
  if (existingAlerts) {
    return existingAlerts.find(
      (alert) =>
        alert.type === type && alert.userId === userId && alert.kind === kind
    );
  }
};

/**
 * Adds an alert to the sent alerts to check if it was already sent.
 * @param {string} metricName - Name of the metric.
 * @param {any} metricValue - Value of the metric.
 * @param {string} userId - ID of the user concerned by the metric.
 * @param {boolean} type - Is it a metric for a remote track or a local track?
 * @param {string} kind - Type of the track (audio | screen | video).
 */
const addToAlertsSent = (metricName, metricValue, userId, type, kind) => {
  if (!alertsSent[metricName]) {
    alertsSent[metricName] = [];
  }
  alertsSent[metricName].push({
    userId,
    oldValue: metricValue,
    type,
    kind,
  });
};

/**
 * Removes an alert from the sent alerts.
 * @param {string} metricName - Name of the metric.
 * @param {string} userId - ID of the user concerned by the metric.
 * @param {boolean} type - Is it a metric for a remote track or a local track?
 * @param {string} kind - Type of the track (audio | screen | video).
 */
const removeFromAlertsSent = (metricName, userId, type, kind) => {
  alertsSent[metricName] = alertsSent[metricName].filter(
    (alert) =>
      alert.userId !== userId || alert.type !== type || alert.kind !== kind
  );
};

/**
 * Updates the value of the last alert for the given metric.
 * @param {string} metricName - Name of the metric.
 * @param {any} newMetricValue - Value of the metric.
 * @param {string} userId - ID of the user concerned by the metric.
 * @param {boolean} type - Is it a metric for a remote track or a local track?
 * @param {string} kind - Type of the track (audio | screen | video).
 */
const updateMetricValueInAlertsSent = (
  metricName,
  newMetricValue,
  userId,
  type,
  kind
) => {
  const alert = findSentAlert(metricName, userId, type, kind);
  if (alert) {
    alert.oldValue = newMetricValue;
  }
};

/**
 * Verifies if the metric is over/under the specified threshold.
 * @param {string} metricName - Name of the metric.
 * @param {any} metrics - The collected metrics.
 * @returns {boolean}
 */
const isBeyondThreshold = (metricName, metrics) => {
  const { threshold, toleranceThreshold } = alertThresholds[metricName];
  const toleratedThreshold = threshold * toleranceThreshold;
  const value = metrics[metricName];
  if (metricName === "packetsLost") {
    const packetLossRate = (value * 100) / (value + metrics["packetsReceived"]);
    return packetLossRate >= toleratedThreshold;
  }
  return superiorToThreshold.includes(metricName)
    ? value > toleratedThreshold
    : value < toleratedThreshold;
};

/**
 * Checks if the specified metric contains values that need alerts.
 * @param {string} userId - ID of the user for whom the alert occurred.
 * @param {any} metrics - The metric to be checked.
 * @param {string} kind - Type of track of the metric.
 * @param {boolean} type - Is it a metric for a remote track or a local track?
 */
const checkMetric = (userId, metrics, kind, type) => {
  const metricNames = Object.keys(alertThresholds);
  const result = metricNames.filter((metricName) => metrics[metricName]);

  const alerts = result.map((alert) => {
    const existingAlert = findSentAlert(alert, userId, type, kind);
    const { threshold, toleranceThreshold } = alertThresholds[alert];
    const toleratedThreshold = threshold * toleranceThreshold;
    const value = metrics[alert];

    if (existingAlert) {
      const shouldRemove = !isBeyondThreshold(alert, metrics);
      if (shouldRemove) {
        removeFromAlertsSent(alert, userId, type, kind);
        sendToStore("removedAlert", {
          userId,
          kind,
          type,
          metricName: alert,
          metricValue: value,
        });
      } else {
        updateMetricValueInAlertsSent(alert, value, userId, type, kind);
      }
    } else {
      if (isBeyondThreshold(alert, metrics)) {
        addToAlertsSent(alert, value, userId, type, kind);
        return {
          threshold,
          metricValue: value,
          metricName: alert,
        };
      }
    }
  });
  const finalAlerts = alerts.filter((alert) => alert);
  if (finalAlerts.length) {
    sendToStore("newAlert", { userId, kind, alerts: finalAlerts, type });
  }
};

/**
 * Cleans the metric object by removing unnecessary properties.
 * @param {any} rawMetric - JS Object containing all the properties of RTCStatReport.
 * @returns {any}
 */
const cleanMetric = (rawMetric) => {
  return Object.keys(rawMetric)
    .filter((key) => metricsToCollect.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: rawMetric[key] }), {});
};

/**
 * Collects WebRTC metrics every 10s.
 */
const gatherMetrics = setInterval(() => {
  sendToStore("gatherMetrics");
}, intervalBetweenTwoMetrics * 1000);

/**
 * Handles messages received from the store.
 */
self.onmessage = (event) => {
  const { action, payload } = event.data;

  switch (action) {
    case "stopMetrics":
      clearInterval(gatherMetrics);
      const finalReport = createFinalReport();
      sendToStore("stopMetrics", finalReport);
      break;
    case "newMetric":
      const { userId, kind, type, metric } = payload;
      const cleanedMetric = cleanMetric(metric);
      checkMetric(userId, cleanedMetric, kind, type);
      for (const metricName in cleanedMetric) {
        addNewMetric(metricName, kind, type, userId, cleanedMetric[metricName]);
      }
      break;
  }
};
