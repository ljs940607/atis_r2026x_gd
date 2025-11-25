/* global CKEDITOR */
( function() {
	'use strict';
	function protectFormStyles( formElement ) {
		if ( !formElement || formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != 'form' )
			return [];
		var hijackRecord = [],
			hijackNames = [ 'style', 'className' ];
		for ( var i = 0; i < hijackNames.length; i++ ) {
			var name = hijackNames[ i ];
			var $node = formElement.$.elements.namedItem( name );
			if ( $node ) {
				var hijackNode = new CKEDITOR.dom.element( $node );
				hijackRecord.push( [ hijackNode, hijackNode.nextSibling ] );
				hijackNode.remove();
			}
		}
		return hijackRecord;
	}

	function restoreFormStyles( formElement, hijackRecord ) {
		if ( !formElement || formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != 'form' )
			return;

		if ( hijackRecord.length > 0 ) {
			for ( var i = hijackRecord.length - 1; i >= 0; i-- ) {
				var node = hijackRecord[ i ][ 0 ];
				var sibling = hijackRecord[ i ][ 1 ];
				if ( sibling )
					node.insertBefore( sibling );
				else
					node.appendTo( formElement );
			}
		}
	}

	function saveStyles( element, isInsideEditor ) {
		var data = protectFormStyles( element );
		var retval = {};

		var $element = element.$;

		if ( !isInsideEditor ) {
			retval[ 'class' ] = $element.className || '';
			$element.className = '';
		}

		retval.inline = $element.style.cssText || '';
		if ( !isInsideEditor )
		$element.style.cssText = 'position: static; overflow: visible';

		restoreFormStyles( data );
		return retval;
	}

	function restoreStyles( element, savedStyles ) {
		var data = protectFormStyles( element );
		var $element = element.$;
		if ( 'class' in savedStyles )
			$element.className = $element.className + ' ' + savedStyles[ 'class' ];
		if ( 'inline' in savedStyles )
			$element.style.cssText = savedStyles.inline;
		restoreFormStyles( data );
	}

	function refreshCursor( editor ) {
		if ( editor.editable().isInline() )
			return;
		var all = CKEDITOR.instances;
		for ( var i in all ) {
			var one = all[ i ];
			if ( one.mode == 'wysiwyg' && !one.readOnly ) {
				var body = one.document.getBody();
				body.setAttribute( 'contentEditable', false );
				body.setAttribute( 'contentEditable', true );
			}
		}

		if ( editor.editable().hasFocus ) {
			editor.toolbox.focus();
			editor.focus();
		}
	}

	CKEDITOR.plugins.add( 'custmaximize', {
		// jscs:disable maximumLineLength
		lang: 'en', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'maximize', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				return;

			var lang = editor.lang;
			var mainDocument = CKEDITOR.document,
				mainWindow = mainDocument.getWindow();
			var savedSelection, savedScroll;
			var outerScroll;
			function resizeHandler() {
				var viewPaneSize = mainWindow.getViewPaneSize();
				editor.resize( '100%', viewPaneSize.height - 40, null, true );
			}

			function handleHistoryApi() {
				var command = editor.getCommand( 'maximize' );

				if ( command.state === CKEDITOR.TRISTATE_ON ) {
					command.exec();
				}
			}
			var savedState = CKEDITOR.TRISTATE_OFF;
			editor.addCommand( 'maximize', {
				modes: { wysiwyg: 1 },
				readOnly: 1,
				editorFocus: false,
				exec: function() {
					var container = editor.container.getFirst( function( node ) {
						return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass( 'cke_inner' );
					} );
					var contents = editor.ui.space( 'contents' );
					if ( editor.mode == 'wysiwyg' ) {
						var selection = editor.getSelection();
						savedSelection = selection && selection.getRanges();
						savedScroll = mainWindow.getScrollPosition();
					} else {
						var $textarea = editor.editable().$;
						savedSelection = !CKEDITOR.env.ie && [ $textarea.selectionStart, $textarea.selectionEnd ];
						savedScroll = [ $textarea.scrollLeft, $textarea.scrollTop ];
					}
					var findParent = function (element) {
						if(element.$.classList.contains('RTEditor-container')){
							return element;
						} else {
							return findParent(element.getParent());
						}
					};
					if ( this.state == CKEDITOR.TRISTATE_OFF ) {
						mainWindow.on( 'resize', resizeHandler );
						outerScroll = mainWindow.getScrollPosition();
						var parentDiv = findParent(container);
						var currentNode = parentDiv;
						while ( ( currentNode = currentNode.getParent() ) ) {
							currentNode.setCustomData( 'maximize_saved_styles', saveStyles( currentNode ) );
							currentNode.setStyle( 'z-index', editor.config.baseFloatZIndex - 5 );
						}
						contents.setCustomData( 'maximize_saved_styles', saveStyles( contents, true ) );
						container.setCustomData( 'maximize_saved_styles', saveStyles( container, true ) );
						parentDiv.setCustomData( 'maximize_saved_styles', saveStyles( parentDiv, true ) );
						var styles = {
							overflow: CKEDITOR.env.webkit ? '' : 'hidden',
							width: 0,
							height: 0
						};

						mainDocument.getDocumentElement().setStyles( styles );
						!CKEDITOR.env.gecko && mainDocument.getDocumentElement().setStyle( 'position', 'fixed' );
						!( CKEDITOR.env.gecko && CKEDITOR.env.quirks ) && mainDocument.getBody().setStyles( styles );
						CKEDITOR.env.ie ? setTimeout( function() {
							mainWindow.$.scrollTo( 0, 0 );
						}, 0 ) : mainWindow.$.scrollTo( 0, 0 );
						parentDiv.setStyle( 'position', 'fixed' );
						parentDiv.$.offsetLeft;
						parentDiv.setStyles( {
							'z-index': editor.config.baseFloatZIndex - 5,
							left: '0px',
							top: '0px',
							width: '100%',
							height: '100%',
							'background-color': 'white',
							'padding-top': '5px' 
						} );
						container.addClass( 'cke_maximized' );
						parentDiv.addClass('fullscreenckeditor');
						resizeHandler();
						var offset = parentDiv.getDocumentPosition();
						parentDiv.setStyles( {
							left: ( -1 * offset.x ) + 'px',
							top: ( -1 * offset.y ) + 'px'
						} );
						CKEDITOR.env.gecko && refreshCursor( editor );
						editor.plugins && editor.plugins.custtoolbar && editor.plugins.custtoolbar.switchToolbar &&  editor.plugins.custtoolbar.switchToolbar(editor,true);
					}
					else if ( this.state == CKEDITOR.TRISTATE_ON ) {
						mainWindow.removeListener( 'resize', resizeHandler );
						var parentDiv = findParent(container);
						var editorElements = [ contents, container,parentDiv ];
						for ( var i = 0; i < editorElements.length; i++ ) {
							restoreStyles( editorElements[ i ], editorElements[ i ].getCustomData( 'maximize_saved_styles' ) );
							editorElements[ i ].removeCustomData( 'maximize_saved_styles' );
						}
						currentNode = parentDiv;
						while ( ( currentNode = currentNode.getParent() ) ) {
							restoreStyles( currentNode, currentNode.getCustomData( 'maximize_saved_styles' ) );
							currentNode.removeCustomData( 'maximize_saved_styles' );
						}
						CKEDITOR.env.ie ? setTimeout( function() {
							mainWindow.$.scrollTo( outerScroll.x, outerScroll.y );
						}, 0 ) : mainWindow.$.scrollTo( outerScroll.x, outerScroll.y );
						container.removeClass( 'cke_maximized' );
						parentDiv.removeClass('fullscreenckeditor');

						// Emit a resize event, because this time the size is modified in
						// restoreStyles.
						editor.fire( 'resize', {
							outerHeight: editor.container.$.offsetHeight,
							contentsHeight: contents.$.offsetHeight - 20,
							outerWidth: editor.container.$.offsetWidth
						} );
						editor.plugins && editor.plugins.custtoolbar && editor.plugins.custtoolbar.switchToolbar && editor.plugins.custtoolbar.switchToolbar(editor,false);
					}

					this.toggleState();

					// Restore selection and scroll position in editing area.
					if ( editor.mode == 'wysiwyg' ) {
						if ( savedSelection ) {
							// Fixing positioning editor chrome in Firefox break design mode. (https://dev.ckeditor.com/ticket/5149)
							CKEDITOR.env.gecko && refreshCursor( editor );

							editor.getSelection().selectRanges( savedSelection );
							var element = editor.getSelection().getStartElement();
							element && element.scrollIntoView( true );
						} else {
							mainWindow.$.scrollTo( savedScroll.x, savedScroll.y );
						}
					} else {
						if ( savedSelection ) {
							$textarea.selectionStart = savedSelection[ 0 ];
							$textarea.selectionEnd = savedSelection[ 1 ];
						}
						$textarea.scrollLeft = savedScroll[ 0 ];
						$textarea.scrollTop = savedScroll[ 1 ];
					}

					savedSelection = savedScroll = null;
					savedState = this.state;

					editor.fire( 'maximize', this.state );
				},
				canUndo: false
			} );

			editor.ui.addButton && editor.ui.addButton( 'Maximize', {
				isToggle: true,
				label: lang.maximize.maximize,
				command: 'maximize',
				toolbar: 'tools,10'
			} );
			editor.on( 'mode', function() {
				var command = editor.getCommand( 'maximize' );
				command.setState( command.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : savedState );
			}, null, null, 100 );
			if ( editor.config.maximize_historyIntegration ) {
				var historyEvent = editor.config.maximize_historyIntegration === CKEDITOR.HISTORY_NATIVE ?
					'popstate' : 'hashchange';

				mainWindow.on( historyEvent, handleHistoryApi );
				editor.on( 'destroy', function() {
					mainWindow.removeListener( historyEvent, handleHistoryApi );
				} );
			}
		}
	} );
	CKEDITOR.config.maximize_historyIntegration = CKEDITOR.HISTORY_NATIVE;
} )();
