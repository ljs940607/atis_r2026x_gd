/// <amd-module name="DS/DELPXPFoundations/PXPRegistry"/>
define("DS/DELPXPFoundations/PXPRegistry", ["require", "exports", "DS/i3DXCompassPlatformServices/i3DXCompassRegistryClient", "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices"], function (require, exports, i3DXCompassRegistryClient, i3DXCompassPlatformServices) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRegistryClient = createRegistryClient;
    async function retrieveServicesWithPlatform(servicesName, platformId, timeout = 5000) {
        const promise = new Promise(function (resolve, reject) {
            // WARNING if you are on ODT this service never responds ! Then I create a TimeoutPromise !
            i3DXCompassPlatformServices.getServiceUrl({
                serviceName: servicesName,
                platformId: platformId,
                onComplete: (data) => {
                    if (!data) {
                        reject(new Error("PXPRegistry failed- not found services '" + servicesName + "' !"));
                        return;
                    }
                    var urlBase;
                    if (Array.isArray(data)) {
                        if (data.length > 1) {
                            var msg = 'PXPRegistry failed- Multi platform instance found ! (';
                            for (var i = 0; i < data.length; i++) {
                                if (i > 0)
                                    msg += '; ';
                                msg += data[i].platformId;
                            }
                            msg += '). Select a unique tenant !';
                            reject(new Error(msg));
                            return;
                        }
                        urlBase = new URL(data[0].url);
                    }
                    else {
                        urlBase = new URL(data);
                    }
                    resolve(urlBase);
                },
                onFailure: (reason) => {
                    reject(new Error('PXPRegistry failed (' + reason + ')'));
                },
            });
        });
        const promiseTimeOut = new Promise((_r, reject) => setTimeout(() => {
            reject(new Error("PXPRegistry failed- The '3DRegistry' server did not respond (timeout)"));
        }, timeout));
        return Promise.race([promise, promiseTimeOut]);
    }
    async function retrieveServicesWithRegistry(registryURL, servicesName, platformId, timeout = 5000) {
        return i3DXCompassRegistryClient
            .getServicesByPlatform({
            platforms: [platformId],
            services: [servicesName],
            config: {
                url: registryURL.toString(),
            },
        })
            .then((data) => {
            if (Array.isArray(data) && data.length >= 1 && data[0].id.toLowerCase() === platformId.toLowerCase()) {
                const servicesTenant = data[0].services;
                if (Array.isArray(servicesTenant) && servicesTenant.length >= 1 && servicesTenant[0].id.toLowerCase() === servicesName.toLowerCase()) {
                    return new URL(servicesTenant[0].url);
                }
            }
            throw new Error("PXPRegistry failed- not found services '" + servicesName + "' !");
        })
            .catch((reason) => {
            if (reason === undefined && widget.id == null)
                reason = "Check CORS bypass is activated !";
            throw new Error('PXPRegistry failed' + (reason ? ': ' + reason : ''));
        });
    }
    // class Services3DSImpl implements Services3DS {
    //   public readonly urlServicesReferentiel: URL
    //   public readonly tenant: string
    //   constructor(referentielURL: URL | string, tenant: string, response: any) {
    //     this.urlServicesReferentiel = typeof referentielURL === 'string' ? new URL(referentielURL) : referentielURL
    //     this.tenant = tenant
    //   }
    //   url3DPassport(): URL {
    //     return this.getServiceUrl('3DPASSPORT')
    //   }
    //   url3DCompass(): URL {
    //     return this.getServiceUrl('3DCompass')
    //   }
    //   url3DSpace(): URL {
    //     return this.getServiceUrl('3DSpace')
    //   }
    //   url3DDashboard(): URL {
    //     return this.getServiceUrl('3DDashboard')
    //   }
    //   getServiceUrl(serviceId: string): URL {
    //     throw new Error('Method not implemented.')
    //   }
    // }
    class RegistryImpl {
        constructor(registry) {
            if (registry == null) {
                this.referentielURL = null;
                return;
            }
            if (registry instanceof URL) {
                this.referentielURL = registry;
            }
            // it's an URL ?
            try {
                this.referentielURL = new URL(registry);
            }
            catch (error) {
                this.referentielURL = null;
                // cluster ?
                //  if ( cluster ) { // version Cloud DEV STAGE
                //    registry= 'https://euw1-'+ cluster + '-registry.3dx-staging.3ds.com'
                //  }
            }
        }
        // getPlatform(tenant: string): Promise<Services3DS> {
        //   this.referentielURL.search = 'id=' + tenant
        //   //return fetch(this.referentielURL.toString(), {
        //   //  method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //   //  //mode: 'cors', // no-cors, *cors, same-origin
        //   //  //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //   //  //credentials: 'include', // include, *same-origin, omit
        //   //  headers: {
        //   //    Accept: 'application/json',
        //   //  },
        //   //  //redirect: 'manual', // manual, *follow, error
        //   //})
        //   return HttpClientGet( this.referentielURL.toString() )
        //     .then((response) => {
        //       console.log( response );
        //       //if (response.ok) {
        //       //  var contentType = response.headers.get('content-type')
        //       //  if (contentType && contentType.indexOf('application/json') !== -1) {
        //       //    return response.json()
        //       //  }
        //       //}
        //       throw new Error('Registry failed: ' + this.referentielURL.toString() + ': invalid response')
        //     })
        //     .then((json) => {
        //       return new Services3DSImpl(this.referentielURL, tenant, json)
        //     })
        //}
        getService(service, tenant) {
            if (this.referentielURL == null) {
                return retrieveServicesWithPlatform(service, tenant);
            }
            else {
                return retrieveServicesWithRegistry(this.referentielURL, service, tenant);
            }
        }
    }
    function createRegistryClient(registry) {
        return new RegistryImpl(registry);
    }
});
