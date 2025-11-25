/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", ["require", "exports", "DS/Core/TooltipModel"], function (require, exports, WUXTooltipModel) {
    "use strict";
    class UIWUXTools {
        /**
         * This method creates a WUX tooltip.
         * @public
         * @static
         * @param {ITooltipOptions} options - The WUX tooltip options.
         * @returns {WUXTooltipModel} The WUX tooltip model.
         */
        static createTooltip(options) {
            const hasTitle = options.title !== undefined && options.title !== '';
            const hasShortHelp = options.shortHelp !== undefined && options.shortHelp !== '';
            return new WUXTooltipModel({
                title: options.title || '',
                shortHelp: hasShortHelp ? (hasTitle ? options.shortHelp : '<b>' + options.shortHelp + '</b>') : '',
                longHelp: options.longHelp || '',
                shortToLongDelay: 1000,
                initialDelay: options.initialDelay || 0,
                reshowDelay: options.reshowDelay || 0,
                mouseRelativePosition: options.mouseRelativePosition || true,
                allowUnsafeHTMLTitle: true,
                allowUnsafeHTMLLongHelp: true,
                allowUnsafeHTMLShortHelp: true
            });
        }
    }
    return UIWUXTools;
});
