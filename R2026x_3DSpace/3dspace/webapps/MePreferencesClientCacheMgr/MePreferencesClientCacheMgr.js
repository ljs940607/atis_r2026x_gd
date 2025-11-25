define('DS/MePreferencesClientCacheMgr/MePreferencesClientCacheMgr',
    [],
    function () {

        var mepClientCache = function () {
        }

        //opens MePreferences cache storage and search for a match of requested url
        mepClientCache.prototype.retrieveCache = async function (requestedURL) {
            if ('caches' in window) {
                const cache = await caches.open('MePreferences');
                const resp = await cache.match(requestedURL);
                if (resp && resp.status === 200) {
                    let data = await resp.text();
                    return data;
                }
            }
            return null;

        }

        //adds cache with url as key and the server response as value in MePreferences cache storage
        mepClientCache.prototype.addCache = async function (requestedURL, response) {
            if ('caches' in window) {
                const newCache = await caches.open('MePreferences');
                if (newCache)
                    newCache.put(requestedURL, response);
            }

            return null;
        }

        //delete cache 
        mepClientCache.prototype.deleteCache = async function (requestedURL) {
            if ('caches' in window) {
                const cache = await caches.open('MePreferences');
                if(cache)   
                    cache.delete(requestedURL);
            }
            
        }

        //returns etag from stored cache 
        mepClientCache.prototype.retrieveEtag = async function (requestedURL) {
            if ('caches' in window) {
                const cache = await caches.open('MePreferences');
                const response = await cache.match(requestedURL);
                if (response && response.headers.has('etag')) {
                    return response.headers.get('etag');
                }

            }
        }

        return mepClientCache;

    });




