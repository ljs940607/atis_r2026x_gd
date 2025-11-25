/* global CKEDITOR */
( function() {
	
	'use strict';
	var switchVisibilityAfter1stRow = function(toolbox, show) {
		if (toolbox === undefined) {
			return;
		}
		var inFirstRow = true;
		var elements = toolbox.getChildren();
		var elementsCount = elements.count();
		var elementIndex = 0;
		var element = elements.getItem(elementIndex);
		for (; elementIndex < elementsCount; element = elements.getItem(++elementIndex))
		{
			inFirstRow = inFirstRow && !(element.is('span') && element.hasClass('cke_toolbar_break'));
			if (!inFirstRow)
			{
				if (show) element.show(); else element.hide();
			}
		}
	};

	CKEDITOR.plugins.add( 'custtoolbar', {
		requires: 'button',
		lang: 'en',
		init: function( editor ) {
			editor.on( 'uiSpace', function( event ) {
			editor.addCommand( 'toolbarCollapse', {
				readOnly: 1,
				exec: function( editor ) {
					var collapser = editor.ui.space( 'toolbar_collapser' ),
						toolbox = collapser.getPrevious(),
						minClass = 'cke_toolbox_collapser_min';
						if (collapser === null) return;//|| collapser===undefined
						if (collapser !== undefined && collapser !== null) {
							toolbox = collapser.getPrevious();
						}
						var contents = editor.ui.space('contents');
						var toolboxContainer;
						if (toolbox !== undefined && toolbox !== null) {
							toolboxContainer = toolbox.getParent();
						}
						var contentHeight = parseInt(contents.$.style.height, 10);
						var previousHeight;
						if (toolboxContainer !== undefined) {
							previousHeight = toolboxContainer.$.offsetHeight;
						}
						var collapsed;
						if (collapser !== undefined && collapser !== null) {
							collapsed = collapser.hasClass(minClass);
						}
						if (toolbox !== undefined && toolbox !== null) {
							collapsed = toolbox.hasClass('iterate_tbx_hidden');
						}
						if (!collapsed) {
							switchVisibilityAfter1stRow(toolbox, false);
							if (toolbox !== undefined && toolbox !== null) {
								toolbox.addClass('iterate_tbx_hidden');
								if (!toolbox.isVisible()) toolbox.show();
							}
							if (collapser !== null) {
								collapser.addClass(minClass);
								collapser.setAttribute('title', editor.lang.toolbar.toolbarExpand);
							}
						}
						else {
							switchVisibilityAfter1stRow(toolbox, true);    // toolbox.show();
							if (toolbox !== undefined && toolbox !== null) {
								toolbox.removeClass('iterate_tbx_hidden');
							}
							if (collapser !== null) {
								collapser.removeClass(minClass);
								collapser.setAttribute('title', editor.lang.toolbar.toolbarCollapse);
							}
						}
						// Update collapser symbol.
						if (collapser) {
							collapser.getFirst().setText(collapsed ? '\u25B2' : '\u25C0');
						}
						if (toolboxContainer) {
							var dy = toolboxContainer.$.offsetHeight - previousHeight;
							contents.setStyle('height', (contentHeight - dy) + 'px');
						}
						editor.fire('resize', {
							outerHeight: editor.container.$.offsetHeight,
							contentsHeight: contents.$.offsetHeight,
							outerWidth: editor.container.$.offsetWidth
						});
						editor.editable().$.blur();
					},
				
					modes: {wysiwyg: 1, source: 1}
			});
			});
			editor.execCommand('toolbarCollapse');
		},
		switchToolbar: function( editor,state ) {
			var collapser = editor.ui.space( 'toolbar_collapser' );
			if(collapser) {
				var toolbox = collapser.getPrevious();
				switchVisibilityAfter1stRow(toolbox, state); 
				if(state){
					collapser.hide();
				} else {
					collapser.show();
					toolbox.removeClass('iterate_tbx_hidden');
					collapser.getFirst().setText('\u25C0');
					collapser.addClass('cke_toolbox_collapser_min');
					collapser.setAttribute('title', editor.lang.toolbar.toolbarExpand);
					toolbox.addClass('iterate_tbx_hidden');
				}
			}
		}
	} );
} )();
CKEDITOR.UI_SEPARATOR = 'separator';
CKEDITOR.config.toolbarLocation = 'top';
