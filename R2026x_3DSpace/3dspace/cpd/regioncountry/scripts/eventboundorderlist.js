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

(function($) {
	function addLiSorted(liElem, uList){
		var k;
		var a=liElem.attr("key");
		var b=liElem.text();
		var found=false;
		uList.children().each(function(){
			var key=$(this).attr('key');
			var val=$(this).text();
			if(!found && val > b){
				found=true;
				k=$(this);
			}
		});
		if(found)
			liElem.insertBefore(k);
		else
			uList.append(liElem);
	}

	function addLiSelSorted(liElem, uList){
	var seq=liElem.attr("seq");
		if(seq && seq != -1 )
			{
			var beforeItem;
			var found=false;
			var selectedchilds = uList.children('li.selected');
				for (var i = 0; i < selectedchilds.length; i++) {
					var childSeq = selectedchilds.get(i).getAttribute('seq');
					if(!found && parseInt(childSeq) > parseInt(seq)){
						found=true;
						beforeItem=selectedchilds.get(i);
					}
				}
				if(beforeItem && beforeItem.innerHTML && beforeItem.innerHTML.length > 0)
						liElem.insertBefore(beforeItem);
				else
					uList.append(liElem);
			}
		else
			uList.append(liElem);
	}
	
    $.fn.eventBoundOrderList=function(listid, originator, selectEvt, deselectEvt, opts){

		opts = jQuery.extend({
			duration: 400, //no of milliseconds to animate
			enableReorder: true,
			showUnique: false,
			sorted: true
		}, opts);

		return $(this).each(function(){
			var itemCount=Array();//for showUnique
			this.getSelectedList=function(){
				var selectedData=Array();
				var selLi=TheUL.children('li.selected').filter(":visible");
				var index=1;	
				$.each(selLi, function(){
					var eachItem="{\"seq\":\""+index;
					index++;
					eachItem=eachItem+"\",\"id\":\""+$(this).attr('key').trim();
					eachItem=eachItem+"\",\"name\":\""+$(this).text().trim()+"\"}";
					
					selectedData.push(eachItem);
					
				});
				return selectedData;
			};
			
			var TheList=$(this);
			
			var ListItemsArr=Array();

			var TheUL=$('<ul id="langSortable" class="eventBoundOrderList"/>');
			
			TheList.append(TheUL);
			
			originator.bind(selectEvt, function(e, node){

				var itemsList=ListItemsArr[node.id];
				if(!itemsList)
				{
					var langNodeValue = '{"'+node.id+'":{"name":"'+node.name+'","id":"'+node.id+'","selected":"true","seq":"'+node.seq+'" }}';
					itemsList=JSON.parse(langNodeValue);
					ListItemsArr[node.id]=itemsList;

					$.each(itemsList, function(key, val) {
						if(opts.showUnique)
						{
							if(itemCount[key] != undefined)
							{
								itemCount[key]=itemCount[key] + 1;
								return;
							}
							else
							{
								itemCount[key] = 1;
							}
						}

						var $li=$('<li><span>'+val.name+'</span></li>');
						val.id=key;
						$li.attr('key', key);
						$li.attr('pid', node.id);
						
						if(opts.enableReorder)
							$li.addClass('cursorMoveClass');
							
						if(val.seq)
						{
							$li.attr('seq', val.seq);
						}
						val.element=$li;

						$li.bind('select', $.proxy( function(e){
									if(!this.selected){
										this.element.addClass('selected');
										$li.trigger('selected', val);
										this.selected=true;
									}
									e.stopPropagation();
								}, val)
						);

						$li.bind('deselect', $.proxy( function(e){
									if(this.selected){
										this.element.removeClass('selected');
										$li.trigger('deselected', val);
										this.selected=false;
									}
									e.stopPropagation();
								}, val)
						);

						if(opts.sorted)
							addLiSorted($li, TheUL);
						else if(opts.sequnceOrder)
							addLiSelSorted($li, TheUL);
						else
							TheUL.append($li);
						
						if(val.selected)
						{
							val.element.addClass('selected');
							$li.trigger('selected', val);
						}
					});
				}
				else if(opts.showUnique)
				{
					$.each(itemsList, function(key, val) {
					
						if(opts.showUnique)
						{
							itemCount[key]=itemCount[key] + 1;
						}
					});
				}				

				$.each(itemsList, function(key, val) {
					TheUL.children('li[key="'+key+'"]').trigger('select');
					TheUL.children('li[key="'+key+'"]').slideDown(opts.duration);
				});
				
               	if(opts.enableReorder){				
					$("#langSortable").sortable({ axis: "y",
						});
					$("#langSortable").disableSelection();
				}
			});

            originator.bind(deselectEvt, function(e, node){
						
				if(opts.showUnique) {
					itemsList=ListItemsArr[node.id];
					$.each(itemsList, function(key, val) {
							itemCount[key]=itemCount[key] - 1;
							if(itemCount[key]==0)
							{
								TheUL.children('li[key="'+key+'"]').trigger('deselect');
								TheUL.children('li[key="'+key+'"]').slideUp(opts.duration);
							}
					});
				}
				else {
	                TheUL.children('li[pid="'+node.id+'"]').trigger('deselect');
	                TheUL.children('li[pid="'+node.id+'"]').slideUp(opts.duration);
				}

            });
        });
    };

})(jQuery);

