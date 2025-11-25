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

(function($){
	$.fn.extend ({
		alertbox: function(type, message){

			if($(this).children().length > 0)
				$(this).slideUp('slow', function(){ $(this).empty(); $(this).showbox(type, message) });
			else
				$(this).showbox(type, message);
		},
		closebox: function()
		{
			$(this).slideUp('slow', function(){$(this).empty()});
		},
		showbox: function(type, message){
			$(this).css('display', 'none');
			$(this).css('width', '100%');
			
			var box=$('<div id="alertbox" ></div>');
			box.addClass(type);
			var msgtable=$('<table></table>');
			msgtable.addClass('alertmessage');

			box.append(msgtable);

			var tr=$('<tr/>');
			msgtable.append(tr);
			tr.append('<td class="spacer" width="'+( $(this).width() - 36 )+'">'+message+'</td>');
			
			var closeLink=$('<td><span class="closebutton" /></td>');
			closeLink.click($.proxy(function(){ 
					$(this).slideUp('slow', function(){$(this).empty();});
				}, 
				this)
			);

			tr.append(closeLink);
			$(this).append(box);

			$(this).slideDown('slow');
		}
	});

})(jQuery);

