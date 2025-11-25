/* global CKEDITOR */

CKEDITOR.plugins.add( 'highlight', {
    icons: 'highlight',
    style: {
        element: 'span',
        attributes: {
            'class':'marker'
        }
    },
    init: function( editor ) {
		'use strict';
        var that = this;
        if (editor._.menuItems.link) {
            delete editor._.menuItems.link;
        }
        editor.addCommand( 'highlight', {
            contextSensitive: true,
            exec: function( editor, resetOption ) {
                if( this.state === CKEDITOR.TRISTATE_ON ) {
                    editor.removeStyle( new CKEDITOR.style( that.style ) );
                    this.setState( CKEDITOR.TRISTATE_OFF );
                }else {
                    editor.applyStyle( new CKEDITOR.style( that.style ) );
                }
            },
            refresh: function(editor,path) {
                var range = editor.getSelection().getRanges()[0],
                    currentNode = range.startContainer.$,
                    notFound = true;
                while(currentNode.parentNode && currentNode.parentNode.getAttribute
                    && currentNode.parentNode.getAttribute('id') !== editor.name && notFound){
                    if( currentNode && currentNode.nodeName === 'SPAN' && currentNode.getAttribute('class') === 'marker') {
                        this.setState( CKEDITOR.TRISTATE_ON );
                        notFound = false;
                    }else{
                        this.setState( CKEDITOR.TRISTATE_OFF );
                    }
                    currentNode = currentNode.parentNode;
                }

            }
        });
        editor.ui.addButton( 'Highlight', {
            label: 'Highlight',
            command: 'highlight',
            toolbar: 'basicstyles',
            icon : '../../E6WCommonApps/assets/ckeditor/highlight.png'
        });
    }
});
