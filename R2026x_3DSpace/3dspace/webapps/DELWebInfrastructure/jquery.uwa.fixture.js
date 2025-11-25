// This will enable UWA to use JavascriptMVC's fixtures
if(window.require && window.define) {
    var objRequireParams = {};
    if (window.Configuration && window.Configuration.webappsDir) { //set in ds_common.js
        objRequireParams.baseUrl = window.Configuration.webappsDir;
    }
    require(objRequireParams, ['DS/DELWebInfrastructureControls/UWAUtils', 'DS/WAFData/WAFData'], function (UWA, WAFData) {
        if (WAFData.request && !WAFData._oldRequest && ((window.Configuration && window.Configuration.useFixtures) || (window.widget.getUrl().indexOf('useFixtures=1') > 0))) {
            var $ = window.jQuery;
            var can = window.can;
            var steal = window.steal;

            if ((!$ || !window.$) && window.jQuery) {
                $ = window.$ = window.jQuery; //not sure HOW this could happen, just fix it here
            }

            var logMsg = function(strMessage) {
                if (steal && steal.dev && steal.dev.log) {
                    steal.dev.log.call(steal.dev, strMessage);
                } else {
                    UWA.log(strMessage);
                }
            };
            var warnMsg = function(strMessage) {
                if (steal && steal.dev && steal.dev.warn) {
                    steal.dev.warn.call(steal.dev, strMessage)
                } else {
                    (window.console && window.console.warn ? window.console.warn : logMsg)(strMessage);
                }
            };

            WAFData._oldRequest = WAFData.request;
            WAFData.request = function (url, options) {
                var blnUseOldRequest = true;
                var fixtureOverwrite = null;

                if (url && (url.indexOf(location.origin) < 0) && (url.indexOf('://') > 0)) { //handles both https:// and http://
                    //at the very least update this part!
                    var startIndex = url.indexOf('://');
                    var host = url.substr(0, url.indexOf('/', startIndex+3));
                    if (url.indexOf('/3DSpace') > 0) {
                        startIndex = url.indexOf('/3DSpace');
                        host = url.substr(0, url.indexOf('/', startIndex+3));
                        url = url.replace(host, Foe.Model.Session.webroot);
                    } else {
                        url = url.replace(host, location.origin);
                    }
                }

                if (url && (url.indexOf('SecurityContext=') > 0)) {
                    //remove the requested SecurityContext from the URL
                    var startIndex = url.indexOf('SecurityContext=');
                    var endIndex = url.indexOf('&', startIndex+1);
                    if (endIndex > 0) {
                        var strSecurityContext = url.substring(startIndex, endIndex+1); //include the trailing &
                        url = url.replace(strSecurityContext, '');
                    } else {
                        url = url.substr(0, startIndex);
                    }
                }

                var overwriteSettings = {
                    url: url,
                    type: options.method || 'GET'
                };

                var arrOverWrites = [];
                var fnSimilar = function() { return false; }; //dummy function for now
                if (can && can.fixture && can.fixture.overwrites && can.fixture.overwrites.length) {
                    arrOverWrites = can.fixture.overwrites;
                    fnSimilar = can.fixture._similar;
                }
                if (WAFData._fixtureData && WAFData._fixtureData.overwrites) {
                    arrOverWrites = arrOverWrites.concat(WAFData._fixtureData.overwrites);
                    fnSimilar = function (settings, overwrite, exact) {
            			if (exact) {
            				return UWA.Object.same(settings, overwrite, {fixture : null})
            			} else {
            				return UWA.Object.subset(settings, overwrite, WAFData._fixtureData._compare)
            			}
            		};
                }
                UWA.each(arrOverWrites, function(idxOverwrite, overwrite) {
                    blnUseOldRequest = !fnSimilar(overwriteSettings, overwrite);
                    if (!blnUseOldRequest) {
                        overwriteSettings = overwrite;
                    } else if ((overwrite.type.toLowerCase() === overwriteSettings.type.toLowerCase()) && overwriteSettings.url && overwrite.url && (overwriteSettings.url.indexOf(overwrite.url) === 0)) {
                        //close enough!  useful for when the URL contains an ID, like a physicalid, that we really don't care about.\
                        blnUseOldRequest = false;
                        overwrite.originalURL = overwriteSettings.url;
                        overwriteSettings = overwrite;
                    }
                    return blnUseOldRequest; //returning false will exit the UWA.each loop
                });

                if (blnUseOldRequest) {
                    if ((options.proxy === 'passport') && WAFData._oldAuthenticatedRequest) {
                        return WAFData._oldAuthenticatedRequest.call(this, url, options);
                    }
                    return WAFData._oldRequest.call(this, url, options);
                }

                if (overwriteSettings.fixture) {
                    if (overwriteSettings.originalURL) {
                        options.originalURL = overwriteSettings.originalURL;
                    }
                    if (!options.dataType && options.type) {
                        options.dataType = options.type;
                    }
                    if (!options.complete && options.onComplete) {
                        options.complete = function( jqXHR, textStatus) {
                            if ((textStatus !== 'success') && (textStatus !== 'OK') ) {
//                                options.onComplete();
                                return; //something else is wrong here...
                            }
                            var data = jqXHR.responseText || jqXHR.responseJSON;
                            if (options.dataType && (options.dataType === 'json') && (typeof data === 'string')) {
                                try {
                                    data = JSON.parse(jqXHR.responseText);
                                } catch(e) {
                                    warnMsg('jquery.uwa.fixture.js::complete - unknown json, error = '+e.toString());
                                    if (e.stack) {
                                        warnMsg(e.stack);
                                    }
                                }
                            }

                            var headers = {};
                            var strAllHeaders = null;
                            if (jqXHR.getAllResponseHeaders) {
                                strAllHeaders = jqXHR.getAllResponseHeaders();
                            } else if (jqXHR.xhr && jqXHR.xhr.getAllResponseHeaders) {
                                strAllHeaders = jqXHR.xhr.getAllResponseHeaders();
                            }
                            if (strAllHeaders && (typeof strAllHeaders === 'string')) {
                                UWA.each(strAllHeaders.split('\n'), function(idxLineNum, strLine) {
                                    if (!strLine || !strLine.length) {
                                        return; //continue to the next item
                                    }
                                    var arrLine = strLine.split(':');
                                    if (arrLine.length > 2) {
                                        //arrLine[0] = strLine.substr(0, strLine.indexOf(':')); //get all the way up to the first colon
                                        arrLine[1] = strLine.substr(strLine.indexOf(':')+1); //get everything after the first colon
                                        arrLine.length = 2; //trim everything after the first 2 items
                                    }
                                    if (arrLine.length === 2) {
                                        headers[arrLine[0].trim()] = arrLine[1].trim();
                                    } else {
                                        warnMsg('jquery.uwa.fixture.js::complete - unknown header format = '+strLine);
                                    }
                                });
                            }
                            options.onComplete(data, headers);
                        };
                    }
                    if (!options.error && options.onFailure) {
                        options.error = function( jqXHR, textStatus, errorThrown ) {
                            var connexionParam = {};
                            var CurrentServer = true;
                            callbacks = options; //just use the input options, which will have the callbacks if they are there

                            if ((errorThrown === 'timeout') && options.onTimeout) {
                                options.onTimeout();
                            } else {
                                options.onFailure(new Error(errorThrown), null, connexionParam, CurrentServer, callbacks);
                            }
                        };
                    }

                    if ($ && $.ajax) {
                        var jqXhr = $.ajax(overwriteSettings.url, options);
                        return {
                            cancel: function () {
                                jqXhr.aborted = true;
                                jqXhr.abort();
                            },
                            xhr: jqXhr
                        };
                    } else if (typeof overwriteSettings.fixture === 'function') {
                        //call the dynamic fixture
                        overwriteSettings.fixture(options, options.success, options.headers);
                    } else if (WAFData._oldRequest) {
                        if (typeof overwriteSettings.fixture === 'string') {
                            return WAFData._oldRequest(overwriteSettings.fixture, options);
                        }
                        return WAFData._oldRequest(overwriteSettings.url, options);
                    }
                }

                return null;
            };

            if (WAFData.authenticatedRequest && !WAFData._oldAuthenticatedRequest) {
                //this is used by passport requests, which aren't applicable for fixtures
                WAFData._oldAuthenticatedRequest = WAFData.authenticatedRequest;
                WAFData.authenticatedRequest = WAFData.request; //just re-use the other request
            }
        }

        define('DS/DELWebInfrastructure/jquery.uwa.fixture',[], function() { return {}; }); //return a dummy object
    });
}
