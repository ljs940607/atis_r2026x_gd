/* global CKEDITOR */

( function() {
	'use strict';
	CKEDITOR.plugins.add( 'autogrow', {
		init: function( editor ) {
			// This feature is available only for themed ui instance.
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				return;

			editor.on( 'instanceReady', function() {
				// Simply set auto height with div wysiwyg.
				if ( editor.editable().isInline() )
					editor.ui.space( 'contents' ).setStyle( 'height', 'auto' );
				// For classic (`iframe`-based) wysiwyg we need to resize the editor.
				else
					initIframeAutogrow( editor );
			} );
		}
	} );

	function initIframeAutogrow( editor ) {
		var lastHeight,
			doc,
			markerContainer,
			scrollable,
			marker,
			configBottomSpace = editor.config.autoGrow_bottomSpace || 0,
			configMinHeight = editor.config.autoGrow_minHeight !== undefined ? editor.config.autoGrow_minHeight : 200,
			configMaxHeight = editor.config.autoGrow_maxHeight || Infinity,
			maxHeightIsUnlimited = !editor.config.autoGrow_maxHeight;

		editor.addCommand( 'autogrow', {
			exec: resizeEditor,
			modes: { wysiwyg: 1 },
			readOnly: 1,
			canUndo: false,
			editorFocus: false
		} );

		var eventsList = { contentDom: 1, key: 1, selectionChange: 1, insertElement: 1, mode: 1 };
		for ( var eventName in eventsList ) {
			editor.on( eventName, function( evt ) {
				// Some time is required for insertHtml, and it gives other events better performance as well.
				if ( evt.editor.mode == 'wysiwyg' ) {
					setTimeout( function() {
						if ( isNotResizable() ) {
							lastHeight = null;
							return;
						}

						resizeEditor();

						// Second pass to make correction upon the first resize, e.g. scrollbar.
						// If height is unlimited vertical scrollbar was removed in the first
						// resizeEditor() call, so we don't need the second pass.
						if ( !maxHeightIsUnlimited )
							resizeEditor();
					}, 100 );
				}
			} );
		}

		// Coordinate with the "maximize" plugin. (https://dev.ckeditor.com/ticket/9311)
		editor.on( 'afterCommandExec', function( evt ) {
			if ( evt.data.name == 'maximize' && evt.editor.mode == 'wysiwyg' ) {
				if ( evt.data.command.state == CKEDITOR.TRISTATE_ON )
					scrollable.removeStyle( 'overflow-y' );
				else
					refreshCache();
			}
		} );

		editor.on( 'contentDom', refreshCache );

		refreshCache();

		if ( editor.config.autoGrow_onStartup && editor.editable().isVisible() ) {
			editor.execCommand( 'autogrow' );
		}

		function refreshCache() {
			doc = editor.document;
			markerContainer = doc[ CKEDITOR.env.ie ? 'getBody' : 'getDocumentElement' ]();

			// Quirks mode overflows body, standards overflows document element.
			scrollable = CKEDITOR.env.quirks ? doc.getBody() : doc.getDocumentElement();

			// Reset scrollable body height and min-height css values.
			// While set by outside code it may break resizing. (https://dev.ckeditor.com/ticket/14620)
			var body = CKEDITOR.env.quirks ? scrollable : scrollable.findOne( 'body' );
			if ( body ) {
				body.setStyle( 'height', 'auto' );
				body.setStyle( 'min-height', CKEDITOR.env.safari ? '0%' : 'auto' ); // Safari does not support 'min-height: auto'.
			}

			marker = CKEDITOR.dom.element.createFromHtml(
				'<span style="margin:0;padding:0;border:0;clear:both;width:1px;height:1px;display:block;">' +
					( CKEDITOR.env.webkit ? '&nbsp;' : '' ) +
				'</span>',
				doc );
		}

		function isNotResizable() {
			var maximizeCommand = editor.getCommand( 'maximize' );

			return (
				!editor.window ||
				// Disable autogrow when the editor is maximized. (https://dev.ckeditor.com/ticket/6339)
				maximizeCommand && maximizeCommand.state == CKEDITOR.TRISTATE_ON
			);
		}

		// Actual content height, figured out by appending check the last element's document position.
		function contentHeight() {
			// Append a temporary marker element.
			markerContainer.append( marker );
			var height = marker.getDocumentPosition( doc ).y + marker.$.offsetHeight;
			marker.remove();

			return height;
		}

		function resizeEditor() {
			// Hide scroll because we won't need it at all.
			// Thanks to that we'll need only one resizeEditor() call per change.
			if ( maxHeightIsUnlimited )
				scrollable.setStyle( 'overflow-y', 'hidden' );

			var currentHeight = editor.window.getViewPaneSize().height,
				newHeight = contentHeight();

			// Additional space specified by user.
			newHeight += configBottomSpace;
			newHeight = Math.max( newHeight, configMinHeight );
			newHeight = Math.min( newHeight, configMaxHeight );

			// https://dev.ckeditor.com/ticket/10196 Do not resize editor if new height is equal
			// to the one set by previous resizeEditor() call.
			if ( newHeight != currentHeight && lastHeight != newHeight ) {
				newHeight = editor.fire( 'autoGrow', { currentHeight: currentHeight, newHeight: newHeight } ).newHeight;

				// Set width parameter as null, to update only the height of the editor. (#4891)
				editor.resize( null, newHeight, true );
				lastHeight = newHeight;
			}

			if ( !maxHeightIsUnlimited ) {
				if ( newHeight < configMaxHeight && scrollable.$.scrollHeight > scrollable.$.clientHeight )
					scrollable.setStyle( 'overflow-y', 'hidden' );
				else
					scrollable.removeStyle( 'overflow-y' );
			}
		}
	}
} )();
