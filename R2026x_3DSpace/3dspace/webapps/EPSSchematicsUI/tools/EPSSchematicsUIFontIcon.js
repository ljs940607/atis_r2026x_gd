/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/CoreBase/WebUXGlobalEnums", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, ModelEnums, BlockLibrary, UIEnums, UIDom, UIWUXTools, WebUXGlobalEnums_1, UINLS) {
    "use strict";
    class UIFontIcon {
        static { this.WUXFAClassName = 'wux-ui-fa'; }
        static { this.WUX3DSClassName = 'wux-ui-3ds'; }
        /**
         * Creates a 3DS font icon.
         * @public
         * @static
         * @param {string} iconName - The name of the icon.
         * @param {IDomOptions} [options] - The creation options.
         * @returns {HTMLSpanElement} The created font icon element.
         */
        static create3DSFontIcon(iconName, options = {}) {
            options.className = Array.isArray(options.className) ? options.className : (typeof options.className === 'string' ? [options.className] : []);
            options.className.unshift(this.getWUX3DSClassName(iconName));
            return this.createFontIcon(WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS, options);
        }
        /**
         * Creates a Font Awesome font icon.
         * @public
         * @static
         * @param {string} iconName - The name of the icon.
         * @param {IDomOptions} [options] - The creation options.
         * @returns {HTMLSpanElement} The created font icon element.
         */
        static createFAFontIcon(iconName, options = {}) {
            options.className = Array.isArray(options.className) ? options.className : (typeof options.className === 'string' ? [options.className] : []);
            options.className.unshift(this.getWUXFAClassName(iconName));
            return this.createFontIcon(WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome, options);
        }
        /**
         * Gets the font icon class name.
         * @public
         * @static
         * @param {WUXManagedFontIcons} fontFamily - The font family enumeration.
         * @param {string} iconName - The name of the icon.
         * @return {string} The font icon class name.
         */
        static getFontIconClassName(fontFamily, iconName) {
            let className = [];
            if (fontFamily === WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS) {
                className.push(this.WUX3DSClassName);
                className.push(this.getWUX3DSClassName(iconName));
            }
            else if (fontFamily === WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome) {
                className.push(this.WUXFAClassName);
                className.push(this.getWUXFAClassName(iconName));
            }
            return className.join(' ');
        }
        /**
         * Converts the given font family string to WUX font family.
         * @private
         * @static
         * @param {string} fontFamily - The font family string (eFontAwesome or eFont3DS) from UIEnums.EFontFamily.
         * @returns {WUXManagedFontIcons} The WUX font family.
         */
        static convertToWUXFontFamily(fontFamily) {
            let result = WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS;
            if (fontFamily.startsWith('e')) {
                result = WebUXGlobalEnums_1.WUXManagedFontIcons[fontFamily.substring(1)];
            }
            return result;
        }
        /**
         * Creates a font icon from the provided icon definition.
         * @public
         * @static
         * @param {ICommandIcon} iconDefinition - The icon definition.
         * @param {IDomOptions} [options] - The creation options.
         * @returns {HTMLSpanElement|undefined} The created font icon element.
         */
        static createFontIconFromDefinition(iconDefinition, options = {}) {
            options.className = Array.isArray(options.className) ? options.className : (typeof options.className === 'string' ? [options.className] : []);
            const fontFamilyValue = this.convertToWUXFontFamily(iconDefinition.fontFamily);
            let fontIconElt;
            if (fontFamilyValue === WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome) {
                fontIconElt = this.createFAFontIcon(iconDefinition.name, options);
            }
            else if (fontFamilyValue === WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS) {
                fontIconElt = this.create3DSFontIcon(iconDefinition.name, options);
            }
            return fontIconElt;
        }
        /**
         * Gets the WUX icon object from the command definition.
         * @public
         * @static
         * @param {ICommandType} command - The command definition.
         * @returns {WUX.IconDefinition} The WUX icon.
         */
        static getWUXIconFromCommand(command) {
            let wuxIcon;
            if (command !== undefined && command.icon !== undefined) {
                wuxIcon = {
                    iconName: command.icon.name,
                    fontIconFamily: this.convertToWUXFontFamily(command.icon.fontFamily)
                };
            }
            return wuxIcon;
        }
        /**
         * Gets the WUX Font Awesome icon definition.
         * @public
         * @static
         * @param {string} iconName - The Font Awesome icon name.
         * @param {string} [fontIconSize=undefined] - The font icon size.
         * @returns {WUX.IconDefinition} The WUX Font Awesome icon definition.
         */
        static getWUXFAIconDefinition(iconName, fontIconSize) {
            return {
                iconName: iconName,
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome,
                fontIconSize: fontIconSize
            };
        }
        /**
         * Gets the WUX 3DS icon definition.
         * @public
         * @static
         * @param {string} iconName - The 3DS icon name.
         * @returns {WUX.IconDefinition} The WUX 3DS icon definition.
         */
        static getWUX3DSIconDefinition(iconName) {
            return {
                iconName: iconName,
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS
            };
        }
        /**
         * Gets the WUX icon from the block category.
         * @public
         * @static
         * @param {string} fullCategoryName - The full name of the category.
         * @returns {WUX.IconDefinition} The WUX icon definiton.
         */
        static getWUXIconFromBlockCategory(fullCategoryName) {
            let icon = { iconName: '3dpart', fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS };
            const categoryDoc = BlockLibrary.getCategoryDocumentation(fullCategoryName);
            if (categoryDoc !== undefined) {
                const catIcon = categoryDoc.getIcon();
                if (catIcon !== undefined) {
                    icon.iconName = catIcon.name;
                    icon.fontIconFamily = this.convertToWUXFontFamily(catIcon.fontFamily);
                }
            }
            return icon;
        }
        /**
         * Creates the font icon from the given block full category name.
         * If the font icon is created, it will be injected into the given parent element.
         * @public
         * @static
         * @param {string} fullCategoryName - The full name of the category.
         * @param {IWUXElement} [parentElement] - The parent element.
         * @param {string|Array<string>} [className] - The className or list of className.
         * @param {boolean} [displayTooltip=false] - True to display a tooltip.
         * @returns {Element} The created icon element.
         */
        static createIconFromBlockCategory(fullCategoryName, parentElement, className = [], displayTooltip = false) {
            let iconClassName = [this.WUX3DSClassName, UIFontIcon.getWUX3DSClassName('5x'), UIFontIcon.getWUX3DSClassName('3dpart')];
            const categoryDoc = BlockLibrary.getCategoryDocumentation(fullCategoryName);
            if (categoryDoc !== undefined) {
                const catIcon = categoryDoc.getIcon();
                if (catIcon !== undefined && catIcon.name !== undefined && catIcon.fontFamily !== undefined) {
                    const fontFamilyValue = this.convertToWUXFontFamily(catIcon.fontFamily);
                    if (fontFamilyValue === WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome) {
                        iconClassName = [this.WUXFAClassName, UIFontIcon.getWUXFAClassName('5x'), UIFontIcon.getWUXFAClassName(catIcon.name)];
                    }
                    else if (fontFamilyValue === WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS) {
                        iconClassName = [this.WUX3DSClassName, UIFontIcon.getWUX3DSClassName('5x'), UIFontIcon.getWUX3DSClassName(catIcon.name)];
                    }
                }
            }
            if (parentElement !== undefined && fullCategoryName !== '' && displayTooltip) {
                const fullName = categoryDoc !== undefined ? categoryDoc.getFullName() : '';
                parentElement.tooltipInfos = UIWUXTools.createTooltip({
                    title: UINLS.get('tooltipTitleBlockDocumentation', { category: fullName }),
                    shortHelp: UINLS.get('tooltipShortHelpBlockDocumentation')
                });
            }
            return UIDom.createElement('span', {
                parent: parentElement,
                className: iconClassName.concat(className)
            });
        }
        /**
         * Gets the WUX 3DS class name from the provided icon name.
         * @public
         * @static
         * @param {string} iconName - The WUX 3DS icon name.
         * @returns {string} The WUX 3DS class name.
         */
        static getWUX3DSClassName(iconName) {
            return this.WUX3DSClassName + '-' + iconName;
        }
        /**
         * Gets the WUX Font Awesome class name from the provided icon name.
         * @public
         * @static
         * @param {string} iconName - The WUX Font Awesome icon name.
         * @returns {string} The WUX Font Awesome class name.
         */
        static getWUXFAClassName(iconName) {
            return this.WUXFAClassName + '-' + iconName;
        }
        /**
         * Creates a font icon.
         * @private
         * @static
         * @param {WUXManagedFontIcons} fontFamily - The font family enumeration.
         * @param {Object} [options] - The creation options.
         * @returns {HTMLSpanElement} The created font icon element.
         */
        static createFontIcon(fontFamily, options = {}) {
            options.className = Array.isArray(options.className) ? options.className : (typeof options.className === 'string' ? [options.className] : []);
            let classFamily = undefined;
            if (fontFamily === WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS) {
                classFamily = this.WUX3DSClassName;
            }
            else if (fontFamily === WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome) {
                classFamily = this.WUXFAClassName;
            }
            if (classFamily) {
                options.className.unshift(classFamily);
            }
            return UIDom.createElement('span', options);
        }
        /**
         * Gets the WUX font icon from the provided debug console severity level.
         * @public
         * @static
         * @param {ESeverity} severity - The debug console severity level.
         * @returns {WUX.IconDefinition} The WUX icon.
         */
        static getWUXIconFromSeverity(severity) {
            let iconName = '';
            if (severity === ModelEnums.ESeverity.eInfo) {
                iconName = 'info';
            }
            else if (severity === ModelEnums.ESeverity.eDebug) {
                iconName = 'info';
            }
            else if (severity === ModelEnums.ESeverity.eWarning) {
                iconName = 'alert';
            }
            else if (severity === ModelEnums.ESeverity.eError) {
                iconName = 'attention';
            }
            else if (severity === ModelEnums.ESeverity.eSuccess) {
                iconName = 'check';
            }
            return { iconName: iconName, fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS };
        }
        /**
         * Gets the WUX font icon from the provided debug console message origin.
         * @public
         * @static
         * @param {EMessageOrigin} origin - The debug console message origin.
         * @returns {WUX.IconDefinition} The WUX icon.
         */
        static getWUXIconFromMessageOrigin(origin) {
            let iconName = '';
            if (origin === UIEnums.EMessageOrigin.eApplication) {
                iconName = 'comment';
            }
            else if (origin === UIEnums.EMessageOrigin.eUser) {
                iconName = 'user-comment';
            }
            return { iconName: iconName, fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.Font3DS };
        }
    }
    return UIFontIcon;
});
