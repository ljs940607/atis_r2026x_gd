/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIWindowManager"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIWindowManager", ["require", "exports", "DS/WebVisuXRToolkitUINode/HTMLWindow", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager"], function (require, exports, HTMLWindow_1, WebVisuXRToolkitConfigManager) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitUIWindowManager = void 0;
    class WebVisuXRToolkitUIWindowManager {
        constructor() {
            this.windowMap = new Map();
        }
        static get instance() {
            if (this._instance) {
                return this._instance;
            }
            this._instance = new WebVisuXRToolkitUIWindowManager();
            return this._instance;
        }
        createWindow(domParent, title, content) {
            const newWindow = new HTMLWindow_1.HTMLWindow(domParent, title, WebVisuXRToolkitConfigManager.instance.devMode.active, content);
            this.windowMap.set(title, newWindow);
            return newWindow;
        }
        getWindows() {
            return this.windowMap;
        }
        getWindow(name) {
            return this.windowMap.get(name);
        }
        dispose() {
            this.disposeAll();
        }
        //Disposes of all windows managed by the WindowManager.
        disposeAll() {
            this.windowMap.forEach((window) => {
                window.dispose();
            });
            this.windowMap.clear(); // Clear the registry
        }
    }
    exports.WebVisuXRToolkitUIWindowManager = WebVisuXRToolkitUIWindowManager;
});
