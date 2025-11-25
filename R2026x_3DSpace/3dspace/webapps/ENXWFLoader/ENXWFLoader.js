define('DS/ENXWFLoader/core/ENXWorkforceStatus',
['DS/WAFData/WAFData'],
function(WAFData) {

    'use strict';

    const invokeURL =  async function(URL, options){
      try{
          return new Promise(function(resolve, reject){
            options.onComplete = function(data) {
                resolve(data);
            };
            options.onFailure = function(error, data) {
                data ? reject(data) : reject(error);
            };
            WAFData.authenticatedRequest(URL, options);
          });
        } catch(error) {
          throw error;
        }
    };

    const is3DWorkforceEnabled = async function(workforceURL){
      try{
        let url = workforceURL + '/3dorg/resources/v1/3dworkforce/isEnabled';
        let options = {};
        options.method = 'GET';
        options.headers = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
        return await invokeURL(url, options);
      } catch (error) {
        throw error;
      }
    };

    return {
      isWorkforceEnabled : is3DWorkforceEnabled
    };
});

define('DS/ENXWFLoader/core/ENXWFCommonUILoader',
['DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
 'DS/WAFData/WAFData',
 'DS/ENXWFLoader/core/ENXWorkforceStatus'],

function(i3DXCompassPlatformServices, WAFData, ENXWorkforceStatus) {

  'use strict';

  let configurationAlreadyDoneForThisSession = false, wf_url;

  const isMobile = (window && window.ds && window.ds.env === "MOBILE");

  function setWithExpiry(key, value, expiryInHours) {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + (expiryInHours*60*60*1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  function getWithExpiry(key) { // _WF_STATUS : {value: true, expiry: timeinMillis}
  	const itemStr = localStorage.getItem(key);
  	// if the item doesn't exist, return null
  	if (!itemStr) {
  		return null;
  	}
  	const item = JSON.parse(itemStr);
  	const now = new Date();
  	// compare the expiry time of the item with the current time
  	if (now.getTime() > item.expiry) {
  		// If the item is expired, delete the item from storage
  		// and return null
  		localStorage.removeItem(key);
  		return null;
  	}
  	return item.value;
  }

    const cacheBustLoad = (responseText)=>{
      var versionNumberFileContent = responseText ? responseText.trim() : null;
      //split on lines
      var match = versionNumberFileContent.match(/COMMIT_ID=(?<commitid>.*)/m);
      if (match) {
        var defaultURL = new URL(require.toUrl(''));
        defaultURL.searchParams.append('_WFVersion', match[1]); // url?_WFVersion=
        return defaultURL.search.substring(1);
      }
      return '';
    };

    const makeRequest =  (url) => {
        try{
          let options = {};
          options.method = 'GET';
          options.headers = {
              'X-Requested-With': 'XMLHttpRequest'
          };
          if(isMobile) {
            //for native app we need to pass the proxy parameter with passport value
            options.headers['proxy'] = 'passport';
          }
          return new Promise(function(resolve, reject){
            options.onComplete = function(data) {
                resolve(data);
            };
            options.onFailure = function(error, data) {
                data ? reject(data) : reject(error);
            };
            options.headers = options.headers || {};
            WAFData.authenticatedRequest(url, options);
          });
        } catch(error) {
          return buildDefaultErrorResponse(error);
        }
    };

      const getModulePath = (module, data) => {
          const baseModulePath = data.serviceUrl + '/3dorgapp/webapps/' + module;
          const modulePathForNavapp = window.location.origin+'/_widget_proxy/' +  baseModulePath;
          // To accommodate the use of a native app hosted on a local server, we make necessary URL modifications.
          // This includes appending the _widget_proxy parameter and prefixing the path with window.location.origin.

          //baseModulePath will look like this :-
          //https://devopslkr9m2mz1965321-euw1-26dsw10914-3dorganization.3dx-staging.3ds.com/3dorgapp/webapps/ENXWFCommonUI

          //modulePathForNavapp will be this :-
          //http://127.0.0.1:49940/_widget_proxy/https://devopslkr9m2mz1965321-euw1-26dsw10914-3dorganization.3dx-staging.3ds.com/3dorgapp/webapps/ENXWFCommonUI
          return isMobile ? modulePathForNavapp : baseModulePath;
      }

    const updateRequireConfig = (data) => {
        const modules = ['ENXWFCommonUI', 'ENXWFWorkforceRequestUI', 'ENXWFCommonComponents'];
        const configPath = {};
        modules.forEach((module) => {
          configPath['DS/' + module] = getModulePath(module, data);
        });
        require.config({
          paths: configPath,
          urlArgs: data.urlArgs
        });
    };

    const getServiceUrl = async (options)=> { return  new Promise( function(resolve, reject) {
        i3DXCompassPlatformServices.getServiceUrl({
          serviceName: '3dorganization',
          platformId: options.platformId,
          onComplete: function(serviceUrl) {
            if (serviceUrl) {
              resolve(serviceUrl);
            } else {
              reject(new Error('3DOrganization service unavailable!!!'));
            }
          },
          onFailure: () => {
            reject(new Error('3DOrganization service unavailable!!!'));
          }
        });
      });
    };

    const fallbackConfig = function(serviceURL){
      var defaultURL = new URL(require.toUrl(''));
      defaultURL.searchParams.append('_WFVersion' , new Date().getTime());
      updateRequireConfig({serviceUrl: serviceURL, urlArgs: defaultURL.search.substring(1)});
    };

    const getDependency = function(moduleName, callback){
      try{
         require(['DS/ENXWFCommonUI/'+moduleName], function(module) {
           callback(module);
         });
      }catch(error) {
        console.log("Some error occured");
        return {};
      }
    };

    /**
     * [This function checks and returns if all 3DWorkforce controls are enabled or not.
     *  The function expects a JSON object. The platform id should be an attribute in JSON eg: platformId:DEVOPSSSN16J6D810270.
     *  The function follows the below order.
     *  	  Check if 3DOrganization service is available in the provided platform.
     *    	   Reject promise.
     *     	If 3DOrganization service is available then check if 3DWorkforce is enabled.
     *    	   Reject Promise.
     *    	Implement the Cache busting changes.
     *    	Modify the require configuration
     *    	Return success
     *
     * ]
     * @param  {[JSON]} options [should contain platformId]
     * @return {[JSON]}         [return the workforce service URL wf_url]
     */

    const changeRequireConfig = async function(options){
      if(configurationAlreadyDoneForThisSession && wf_url) {
        return {
                wf_url: wf_url,
                getWFIWrapper: function(callback){getDependency('view/WFIContentWrapper',callback)},
                getWFIDataProxy: function(callback){getDependency('component/WFIDataProxy', callback)}
              };
      }
      let wf_status;
      try{
        wf_url = await getServiceUrl(options);
        wf_status = getWithExpiry('_WF_STATUS');
        if(wf_status===null) {
          wf_status = await ENXWorkforceStatus.isWorkforceEnabled(wf_url);
          setWithExpiry('_WF_STATUS', wf_status, 24);
        }
        if(wf_status!=='true') {
          throw new Error("3DWorkForce is not enabled!!");
        }
      }catch(e) {
        throw e;
      }
      try{
        const versionFileURL = wf_url+'/3dorgapp/webapps/ENXWFCommonUI/assets/version.properties?_t='+new Date().getTime();
        const versionFileResponse = await makeRequest(versionFileURL);
        let urlArgs = cacheBustLoad(versionFileResponse);
        updateRequireConfig({serviceUrl: wf_url, urlArgs: urlArgs});
      } catch(error) {
        console.log("Cache busting logic failed!!!");
        fallbackConfig(wf_url);
      }finally{
        configurationAlreadyDoneForThisSession = true;
      }
      return {
        wf_url: wf_url,
        getWFIWrapper: function(callback){ getDependency('view/WFIContentWrapper', callback)},
        getWFIDataProxy: function(callback){ getDependency('component/WFIDataProxy', callback)}
      };
    };

  return {checkAndEnableWorkForce: changeRequireConfig};

});

