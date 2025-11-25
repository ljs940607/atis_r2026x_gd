/**
* @name DS/StudioUIActorModelWeb/CXPTextField
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a CXPtextField rep (WUXEditor)</p>
* <p>Define specific properties and bind them to the rep</p>
*/
define('DS/StudioUIActorModelWeb/CXPTextField',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor',
	'DS/Controls/Editor'
],
function (UWA, CXPUIActor, WUXEditor) {
	'use strict';

	var CXPTextField = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPTextField.prototype **/
		{

			init: function (iUIActor) {
				this._parent(iUIActor);

                this._editor = new WUXEditor().inject(this.getContainer());
                this._editor.elements.container.style.width = '100%';
                this._editor.elements.container.style.height = '100%';
                this._editor.elements.container.childNodes[0].style.width = '100%';
                this._editor.elements.container.childNodes[0].style.height = '100%';
				this._editor.elements.container.childNodes[0].style.boxSizing = 'border-box';
				this._editor.elements.container.childNodes[0].style.overflow = 'hidden';
				this._editor.elements.container.childNodes[0].style.whiteSpace = 'nowrap';
				this._editor.nbRows = 1;

				Object.defineProperty(this, 'enable', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._enable;
					},
					set: function (iValue) {
						this._enable = iValue;
						this._editor.disabled = !this._enable;
					}
				});

				Object.defineProperty(this, 'opacity', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._opacity;
					},
					set: function (iValue) {
						this._opacity = iValue;
						this._editor.elements.container.childNodes[0].style.opacity = this._opacity/255;
					}
				});

				Object.defineProperty(this, 'text', {
					enumerable: true,
					configurable: true,
					get: function () {
						return this._text;
					},
					set: function (iValue) {
						this._text = iValue;
						this._editor.value = this._text;
					}
				});

			},

			// Register events for play
			// Text change and Return press
			registerPlayEvents: function (iSdkObject) {
				this._parent(iSdkObject);
				var self = this;

				this._editor.addEventListener('uncommittedChange', this._valueChanged = function () {
					iSdkObject.text = self._editor.valueToCommit;
					iSdkObject.doUIDispatchEvent('UIValueChanged', 0);
				});

				this._editor.addEventListener('keydown', this._returnPress = function (e) {
					if (e.keyCode === 13) {
						iSdkObject.doUIDispatchEvent('UIReturnPressed', 0);
						e.preventDefault();
					}
				});

				this._editor.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIEntered', 0);
				});

				this._editor.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				    iSdkObject.doUIDispatchEvent('UIExited', 0);
				});
			},

			// Release play events
			releasePlayEvents: function () {
				this._parent();

				this._editor.removeEventListener('uncommittedChange', this._valueChanged);
				this._editor.removeEventListener('keydown', this._returnPress);
				this._editor.removeEventListener('mouseenter', this._mouseEnterEvent);
				this._editor.removeEventListener('mouseleave', this._mouseLeaveEvent);
			}
		});
	return CXPTextField;
});




