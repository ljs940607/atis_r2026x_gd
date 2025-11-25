function getRoundTripCompareText(existingData, modifiedData) {
    var existingPlainText = getPlainText(existingData);
    var modifiedPlainText = getPlainText(modifiedData);
    var dmp = new diff_match_patch();
    var differences = dmp.diff_main(existingPlainText, modifiedPlainText);
    var isContentSame = true;
    var compareStringBuilder = "";
    for (var i = 0; i < differences.length; i++) {
        var operation = differences[i][0];
        var differenceText = differences[i][1];
        if (DIFF_EQUAL == operation) {
            while (differenceText != undefined) {
                var color = "transparent";
                var tooltipMessage = "Fully Matched";

                var currentExistingContentWithTags = existingData[0] || {};
                //currentExistingContentWithTags = Object.assign({}, currentExistingContentWithTags);

                var currentExistingContent = currentExistingContentWithTags["content"];
                var currentExistingApplicableTags = currentExistingContentWithTags["applicable-tags"];

                var currentModifiedContentWithTags = modifiedData[0] || {};
                currentModifiedApplicableTags = Object.assign({}, currentModifiedApplicableTags);
                var currentModifiedContent = currentModifiedContentWithTags.content;
                var currentModifiedApplicableTags = currentModifiedContentWithTags["applicable-tags"];
                var currentModifiedStartingTags = currentModifiedContentWithTags["starting-tags"];
                var currentModifiedEndingTags = currentModifiedContentWithTags["ending-tags"];


                var notMatchedTags = getNotMatchedTags(currentExistingApplicableTags, currentModifiedApplicableTags);
                if (notMatchedTags.length > 0 && !( currentExistingContent== "<br/>" && currentModifiedContent == "<br/>")) {
                    color = "#FF7F50";
                    tooltipMessage = "Style Mismatched";
                    if (isContentSame)
                        isContentSame = false;
                }

                var currentModifiedContentLength = currentModifiedContent.length;
                var currentExistingContentLength = currentExistingContent.length;
                var differenceTextLength = differenceText.length;
                if (currentModifiedContentLength > currentExistingContentLength) {
                    if (currentModifiedContentLength > differenceTextLength) {
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags,
                            [],
                            differenceText,
                            tooltipMessage, color);
                        currentModifiedContentWithTags["content"] = currentModifiedContent.substring(differenceTextLength);
                        currentModifiedContentWithTags["starting-tags"] = [];
                        if (currentExistingContentLength > differenceTextLength) {
                            currentExistingContentWithTags["content"] = currentExistingContent.substring(differenceTextLength);
                        } else if (differenceText == currentExistingContent || differenceTextLength > currentExistingContentLength) {
                            existingData.shift();
                        }
                        differenceText = undefined;
                    } else {
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags,
                            [],
                            currentExistingContent, tooltipMessage, color);
                        existingData.shift();
                        currentModifiedContentWithTags["content"] = currentModifiedContent.substring(currentExistingContentLength);
                        currentModifiedContentWithTags["starting-tags"] = [];
                        differenceText = differenceText.substring(currentExistingContentLength);
                    }
                } else if (currentExistingContentLength > currentModifiedContentLength) {
                    if (currentModifiedContentLength > differenceTextLength) {
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags,
                            [],
                            differenceText,
                            tooltipMessage, color);
                        currentModifiedContentWithTags["content"] = currentModifiedContent.substring(differenceTextLength);
                        currentModifiedContentWithTags["starting-tags"] = [];
                        if (differenceTextLength < currentExistingContentLength) {
                            currentExistingContentWithTags["content"] = currentExistingContent.substring(differenceTextLength);
                        } else if (differenceText == currentExistingContent) {
                            existingData.shift();
                        }
                        differenceText = undefined;
                    } else {
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags, currentModifiedEndingTags,
                            currentModifiedContent, tooltipMessage, color);
                        modifiedData.shift();
                        if (currentModifiedContent == differenceText) {
                            differenceText = undefined;
                        } else {
                            differenceText = differenceText.substring(currentModifiedContentLength);
                        }
                        currentExistingContentWithTags["content"] = currentExistingContent.substring(currentModifiedContentLength);
                    }
                } else {

                    if (currentExistingContent == currentModifiedContent) {
                        // Case 1: existing text and modified text is same
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags,
                            currentModifiedEndingTags, currentExistingContent,
                            tooltipMessage, color);
                        modifiedData.shift();
                        existingData.shift();
                        if (differenceText == currentExistingContent || differenceTextLength == currentExistingContentLength)
                            differenceText = null;
                        else
                            differenceText = differenceText.substring(currentExistingContentLength);
                    } else {
                        // Case 2: both are not same
                        var temp = differenceText;
                        if (differenceTextLength > currentExistingContentLength) {
                            existingData.shift();
                        } else if (differenceTextLength < currentExistingContentLength) {
                            currentExistingContentWithTags["content"] = currentExistingContent.substring(differenceTextLength);
                        } else {
                            existingData.shift();
                        }

                        if (differenceTextLength > currentModifiedContentLength) {
                            modifiedData.shift();
                            differenceText = differenceText.substring(currentModifiedContentLength);
                        } else if (differenceTextLength < currentModifiedContentLength) {
                            currentModifiedEndingTags = [];
                            currentModifiedContentWithTags["content"] = currentModifiedContent.substring(differenceTextLength);
                            currentModifiedContentWithTags["starting-tags"] = [];
                            differenceText = undefined;
                        } else {
                            modifiedData.shift();
                            differenceText = undefined;
                        }
                        compareStringBuilder = compareStringBuilder + buildCompareText(currentModifiedStartingTags, currentModifiedEndingTags,
                            temp,
                            tooltipMessage, color);
                    }

                }
            }
        } else if (DIFF_DELETE  == operation) {
            if(isContentSame)
                isContentSame = false;
            compareStringBuilder = compareStringBuilder +getDeletedCompareText(existingData, differenceText);
        } else if (DIFF_INSERT == operation) {
            if(isContentSame)
                isContentSame = false;
            compareStringBuilder = compareStringBuilder +getAddedCompareText(modifiedData, differenceText);
        }


    }
    return {"isContentSame": isContentSame, "compareResult": compareStringBuilder};
}

function getAddedCompareText(contentWithTags, text)  {

    var color = "#FF7F50";
    var tooltipMessage = "Text Added";
    var sb = "";
    while (text != undefined) {
        var currentContentWithTags = contentWithTags[0]||{};
        var currentContent = currentContentWithTags["content"];
        var currentContentStartTags = currentContentWithTags["starting-tags"] || [];
        var currentContentEndTags = currentContentWithTags["ending-tags"] || [];
        if (text == currentContent) {
            sb = sb + buildCompareText(currentContentStartTags, currentContentEndTags, text,
                tooltipMessage,
                color);
            contentWithTags.shift();
            text = undefined;
        } else if (text.length > currentContent.length) {
            sb = sb + buildCompareText(currentContentStartTags, currentContentEndTags,
                currentContent,
                tooltipMessage,
                color);
            contentWithTags.shift();
            text = text.substring(currentContent.length);
        } else if (text.length < currentContent.length) {
            sb = sb+ buildCompareText(currentContentStartTags, [], text, tooltipMessage, color);
            currentContentWithTags["content"] = currentContent.substring(text.length);
            currentContentWithTags["starting-tags"] = [];
            text = undefined;
        }
    }

    return sb;
}


function getDeletedCompareText(contentWithTags, text) {
    var tooltipMessage = "Text Removed";
    var color = "#FF7F50";
    var compareStringBuilder = "";
    while (text != undefined) {
        var currentContentWithTags = contentWithTags[0] || {};
        var currentContent = currentContentWithTags["content"];
        var currentContentStartTags = currentContentWithTags["starting-tags"]||[];
        var currentContentEndTags = currentContentWithTags["ending-tags"] || [];
        var currentContentApplicableTags = currentContentWithTags["applicable-tags"];
        if (text == currentContent) {
            compareStringBuilder = compareStringBuilder + buildDeletedCompareText(currentContentStartTags, currentContentEndTags, text, tooltipMessage, color);
            contentWithTags.shift();
            text = undefined;
        } else if (text.length > currentContent.length) {
            compareStringBuilder = compareStringBuilder + buildDeletedCompareText(currentContentStartTags, currentContentEndTags, currentContent, tooltipMessage, color);
            contentWithTags.shift();
            text = text.substring(currentContent.length);
        } else if (text.length < currentContent.length) {
            compareStringBuilder = compareStringBuilder + buildDeletedCompareText(currentContentStartTags, currentContentEndTags, text,
                tooltipMessage,
                color);
            currentContentWithTags["content"] = currentContent.substring(text.length);
            text = undefined;
        }
    }
    return compareStringBuilder;
}

function buildDeletedCompareText(startTags, endTags, text, tooltipMessage, color) {
    if ("\n" == text) {
        text = text.replace("\n", "<div class='compare-cr'  style='background-color:" + color + ";height" +
            ":15px;width:30px'></div>");
    } else {
        text = "<span style='background-color:"+color+";white-space: pre;' title='"+tooltipMessage+"'>"+text+"</span>";
    }
    return text;
}


function buildCompareText(startTags, endTags, text, tooltipMessage, color) {
    var compareTextBuilder = "";
    if ("\n" === text) {
        text = text.replace("\n", "<div class='compare-cr'  style='background-color:" + color + ";height:15px;" +
            "width:30px'></div>");
        compareTextBuilder = text;
    } else {
        for (var i = 0; i < startTags.length; i++) {
            var tagInfo = startTags[i];
            compareTextBuilder = compareTextBuilder + "<" + tagInfo.tagName;
            var attrInfo = tagInfo.attribute;
            for (var prop in attrInfo) {
                compareTextBuilder = compareTextBuilder + " " + prop + "='" + attrInfo[prop] + "'"
            }
            compareTextBuilder = compareTextBuilder + ">";
        }

        compareTextBuilder = compareTextBuilder + "<span style='background-color:" + color + ";white-space: pre;' title='"+tooltipMessage+"'>" + text + "</span>";
        for (var i = 0; i < endTags.length; i++) {
            var tagInfo = endTags[i];
            compareTextBuilder = compareTextBuilder + "</" + tagInfo.tagName + ">";
        }
    }
    return compareTextBuilder;
}


function getNotMatchedTags(existingApplicableTags, modifiedApplicableTags) {
    var diffTags = [];
    if (modifiedApplicableTags.length > existingApplicableTags.length) {
        var currentExistingUniqueKeys = getUniqueKeys(existingApplicableTags);
        diffTags = modifiedApplicableTags.filter(function (currentStyle) {
            var uniqueKey = getUniqueKey(currentStyle);
            return this.indexOf(uniqueKey) == -1 && uniqueKey !== "span";
        }, currentExistingUniqueKeys);
    } else if (modifiedApplicableTags.length < existingApplicableTags.length) {
        var currentModifiedUniqueKeys = getUniqueKeys(modifiedApplicableTags);
        diffTags = existingApplicableTags.filter(function (currentStyle) {
            var uniqueKey = getUniqueKey(currentStyle);
            return this.indexOf(uniqueKey) == -1 && uniqueKey !== "span";
        }, currentModifiedUniqueKeys);
    } else {
        var currentExistingUniqueKeys = getUniqueKeys(existingApplicableTags);
        var diffTagsFromModified = modifiedApplicableTags.filter(function (currentStyle) {
            var uniqueKey = getUniqueKey(currentStyle);
            return this.indexOf(uniqueKey) == -1 && uniqueKey !== "span";
        }, currentExistingUniqueKeys);

        var currentModifiedUniqueKeys = getUniqueKeys(modifiedApplicableTags);
        var diffTagsExisting = existingApplicableTags.filter(function (currentStyle) {
            var uniqueKey = getUniqueKey(currentStyle);
            return this.indexOf(uniqueKey) == -1 && uniqueKey !== "span";
        }, currentModifiedUniqueKeys);

        diffTagsFromModified.forEach(function (current) {
            diffTags.push(current);
        });
        diffTagsExisting.forEach(function (current) {
            diffTags.push(current);
        });
    }
    return diffTags;
}

function getPlainText(data) {
    var plainText = "";
    for (var i = 0; i < data.length; i++) {
        plainText += data[i].content;
    }
    return plainText;
}

function getUniqueKeys(data) {
    var uniqueKeys = [];
    for (var i = 0; i < data.length; i++) {
        uniqueKeys.push(getUniqueKey(data[i]));
    }
    return uniqueKeys;
}

function getUniqueKey(data) {
    var tagName = data.tagName;
    var attr = data.attribute;
    for (var prop in attr) {
        tagName + ":" + prop + ":" + attr[prop];
    }
    return tagName;
}


