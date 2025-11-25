/*
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
 */

jQuery.fn.swap = function(b){
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};

(function($){

$.fn.reorderLIs = function () {
	
	return this.each(function() {
		var theList = $(this),  theItems = $('li', theList), 
			dropIdx = -1, listOrder = [], offset = {},
			ref = this;
		var dragActive = false, dragElem=null, dropElem=null;
		
		function center_position_vert(elem) {
			return elem.offset().top + ( elem.outerHeight() / 2 );
		}
		
		function bottom_position_vert(elem) {
			return elem.offset().top + elem.outerHeight();
		}
		
		theList.mouseout(ul_mouseout);
		
		dragElem = $('<div />');
		dragElem.insertAfter(theList);
		dragElem.hide();
		dragElem.css('position', 'absolute');
		dragElem.addClass('dragElem');
		
		for (var i = 0; i < theItems.length; i++)
			listOrder.push(i);
		
		resetList();
	
		function resetList() {	
			theItems = $('li', theList),
			
			theItems.each(function() {
				var li = $(this);
				
				var dragHandle = $('<span>&nbsp;&nbsp;</span>');
				dragHandle.addClass('dragHandle').mouseover(li_mouseover).mousedown(mousedown_evt);
					
				$('.' + 'dragHandle', li).remove();
				li.prepend(dragHandle);
			});
			
			removeListItemStyles();
		}
		
		function removeListItemStyles() {
			theItems.each(function() {
				var li = $(this);
				li.removeClass('itemHover');
				li.removeClass('dropElem');
			});
		}
		
		function ul_mouseout() {
			if (!dragActive)
				removeListItemStyles();
		}
		
		function li_mouseover() {
			if (!dragActive) {
				removeListItemStyles();
				$(this).parent().addClass('itemHover');
			}
		}
			
		function mouseup_evt() {
			dropElem.html(dragElem.html());
			dropElem.removeClass('dragElem');
			dropElem = null;
			
			dragElem.css('display', 'none');
			
			dragActive = false;
			dragElem.unbind('mouseup', mouseup_evt);
			$(document).unbind('mousemove', mousemove_htmldoc);
			resetList();
			
			$(document).unbind('mouseup', mouseup_evt);
		}
			
		function mousedown_evt(e) {
			var li = $(this).parent();
			
			dragActive = true;
			dropIdx = theItems.index(li);
			
			dragElem.html(li.html());
			dragElem.css('display', 'block');
			offset.topbound=theList.offset().top;
			offset.bottombound=theList.offset().top+theList.height();
			offset.top = e.pageY - li.offset().top;
			offset.left = li.offset().left;
			recalcDragElemPosition(e);
			
			dropElem = li;
			dropElem.html('');
			dropElem.addClass('dropElem');
			dragElem.css('width', dropElem.width() + 'px');
			dropElem.css('height', dragElem.css('height'));
			
			$(document).mouseup(mouseup_evt);
			$(document).mousemove(mousemove_htmldoc);	
		}
		
		function mousemove_htmldoc(e) {
			if (dragActive) {
				recalcDragElemPosition(e);
				
				if (center_position_vert(dragElem) > bottom_position_vert(theList) 
					|| center_position_vert(dragElem) < theList.offset().top) {
					return;
				}
				
				if (center_position_vert(dragElem) + 5 < dropElem.offset().top) {
					swapListItems(dropIdx, --dropIdx);
				} else if (center_position_vert(dragElem) - 5 > bottom_position_vert(dropElem)) {
					swapListItems(dropIdx, ++dropIdx);
				}
			}
		}

		function recalcDragElemPosition(e) {
			if(offset.topbound - 5 <= e.pageY - offset.top && offset.bottombound + 5 >= e.pageY - offset.top)
			dragElem.css({ 
				'top' : e.pageY - offset.top + 'px',
				'left' : offset.left + 'px'
			});
		}
		
		function swapListItems(oldDropIdx, newDropIdx) {
			if (dropIdx < 0) {
				dropIdx = 0;
				return;
			} else if (dropIdx >= theItems.length) {
				dropIdx = theItems.length - 1;
				return;
			}
			
			var t = listOrder[oldDropIdx];
			listOrder[oldDropIdx] = listOrder[newDropIdx];
			listOrder[newDropIdx] = t;
			
			var oldDropTarget = theItems.get(oldDropIdx),
				newDropTarget = theItems.get(newDropIdx);
			
			$(oldDropTarget).swap(newDropTarget);
			
			theItems = $('li', theList);
			dropElem = $(theItems.get(newDropIdx));
		}

	});
}
})(jQuery);
