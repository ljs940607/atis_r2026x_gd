# ENO3DUtils/assets/json

### The `ENO3DViewerInfraContextOptions.json` configuration file

This JSON must be formatted in order to match the .wafrapp notation for command handler.

If you want to override this context menu to inject your own instead, you must specify this component in your `.wafrapp` components. You must also provide a path leading to your context commands (aka `ENO3DViewerInfraContextOptions.json` in this situation) :

```json
{
  "key": "Context",
  "code": "DS/ENO3DView/components/ENO3DViewContextMenu",
  "when": "ViewerReady == true",
  "options": {
    "DEBUG": "true",
    "ctxOptions": [
      "DS/ENO3DUtils/assets/json/ENO3DViewerInfraContextOptions.json"
    ],
    "nlsAMDPath": "DS/ENO3DCommands/assets/nls/ENO3DCommands.json",
    "viewIdentifier": "Viewer",
    "widgetIdentifier": "Widget"
  }
}
```
