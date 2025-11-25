/**
 *
 * @quickreview H37   25:07:17 Configuration record: send intentsToKeep to version explorer component
 * @quickreview H37   25:05:20 IR-1398689  call LifecycleServicesSettings.setTenant
 * @quickreview H37   25:03:18 unselectAllOnEmptyArea
 * @quickreview H37   25:02:25 IR-1366507 Version explorer integration
 * @quickreview H37   24:07:16 selection mode and custom column input to launch version explorer.
 *
 */
(function () {})();

define('DS/EffectivityWebExternalJS/scripts/CfgVersionExplorerLoader', [], function (CfgVersionExplorerLoader) {
    'use strict';
    return CfgVersionExplorerLoader;
});
/*
@desc Version explorer creation global method
This method creates the VersionExplorerController.
*/

function VersionExplorerLoaderFactory(iId, iCallBackFn, iTenant, ibaseURL, iSecurityContext, iParent, iSelectedNode, iType, oVEObject, iSelectionMode, customColumns, iVEOptions) {
    require(['DS/ENOXVersionExplorerController/VersionExplorerController', 'DS/LifecycleServices/LifecycleServicesSettings', 'DS/UWPClientCode/I18n'], function (VersionExplorerController, LifecycleServicesSettings, I18n) {
        const cfgFacet = UWA.createElement('div', {
            styles: {
                height: '100%',
            },
        });
        // set template HTML for facet
        cfgFacet.inject(iParent);

        const versionExplorer =
            //create VE object collect for amd attrbiute filling
            (oVEObject.value = new VersionExplorerController({
                versionGraphContainer: null || cfgFacet,
                customizeColumnHash: customColumns && customColumns.customizeColumnHash ? customColumns.customizeColumnHash : {},
                customizeColumnAttributeHash: customColumns && customColumns.customizeColumnAttributeHash ? customColumns.customizeColumnAttributeHash : {},
                customizeToolbarHash: customColumns && customColumns.customizeToolbarHash ? customColumns.customizeToolbarHash : {},
                showViewIcon: iVEOptions && iVEOptions.showViewIcon ? iVEOptions.showViewIcon : false, //to show/hide graph view
                versiongraphFlags: iVEOptions && iVEOptions.versiongraphFlags ? iVEOptions.versiongraphFlags : [],
                versionPidsToKeep: iVEOptions && iVEOptions.versionPidsToKeep ? iVEOptions.versionPidsToKeep : [],
                disableSelection: iVEOptions && iVEOptions.disableSelection ? iVEOptions.disableSelection : false,
                intentsToKeep: iVEOptions && iVEOptions.intentsToKeep ? iVEOptions.intentsToKeep : [],
                unselectAllOnEmptyArea: false,
            }));
        if (!window.widget) {
            window.widget = {};
            window.widget.lang = I18n.getCurrentLanguage();
        }
        const lifecycleSettings = [{ '3DSpace': ibaseURL, platformId: iTenant }];
        LifecycleServicesSettings.setOption('platform_services', lifecycleSettings);
        LifecycleServicesSettings.setTenant(iTenant); //IR-1398689
        versionExplorer.setSingleSelectionMode(); //single selection mode

        if (iSelectionMode && iSelectionMode === 'multiSelect') versionExplorer.setMultiSelectionMode();
        versionExplorer.disableCommands(); //read only mode ENOXVersionExplorerLoadVersionModel

        versionExplorer.publishEvent('ENOXVersionExplorerLoadVersionModel', {
            id: iId,
            securityContext: iSecurityContext,
            tenantId: iTenant,
            type: iType,
            context: null,
            dataModelType: (iVEOptions && iVEOptions.dataModelType) || 6,
            onComplete: () => {
                iCallBackFn();
                if (iSelectedNode && iSelectedNode.id) oVEObject.value.select(iSelectedNode.id);
                if (iVEOptions && iVEOptions.filterFrozenNodes) iVEOptions.filterFrozenNodes();
            },
        });
    });
}
