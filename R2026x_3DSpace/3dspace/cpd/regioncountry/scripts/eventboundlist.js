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
	
	//Fix IR-206946V6R2014
	function addLiSorted(liElem, uList){
		
		var k;
		//var liElem=$("<li key='"+a+"'>"+b+"</li>");
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
					//AA1: Fix for sorting element if sequecne is more than 10
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
	
    $.fn.eventBoundList=function(listid, originator, selectEvt, deselectEvt, opts){

		opts = jQuery.extend({
			duration: 400, //no of milliseconds to animate
			serverurl: "",
			urlparam: "",
			showOriginatorSelectAll: true,
			showSelectAll: true,
			enableReorder: false,
			showUnique: false,
			strSelectAll:"Select All",
			sorted: true
		}, opts);

		return $(this).each(function(){
		
			var itemCount=Array();//for showUnique

			this.getSelected=function(){
				var selectedLiArr=Array();
				var selLi=TheUL.find('li.selected');
				$.each(selLi, function(){
					selectedLiArr.push($(this).attr('key'));
				});
				return selectedLiArr;
			};
			
			this.getSelectedList=function(){
				//"[{seq:1,id:1.1.1.1,name:India},id:{seq:2,id:1.1.1.1,name:Japan}]";
				var selectedData=Array();
				var selLi=TheUL.children('li[class="selected"]').filter(":visible");
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

			this.getPartSelected=function(){
				var selectedLiArr=Array();
				var selLi=TheUL.find('li.partial');
				$.each(selLi, function(){
					selectedLiArr.push($(this).attr('key'));
				});
				return selectedLiArr;
			};
			
			this.clearSelection = function(){
				TheUL.children('li').filter(":visible").trigger('deselect');
				selectAllLi.removeClass('selected partial');    	
			};

			var TheList=$(this);
			var ListItemsArr=Array();

			var TheUL=$('<ul class="eventBoundList"/>');
			var selectAllLi=null;
			
			if(opts.showSelectAll) {
				var SelUL=$('<ul class="eventBoundList"/>');
				selectAllLi=$('<li><span><b>'+opts.strSelectAll+'</b></span></li>');
				
				SelUL.append(selectAllLi);
				TheList.append(SelUL);
				//selectAllLi.slideDown();

				selectAllLi.click(function(e){
					//AA1: Fix to not active click event outside span boundary
					var isSpan = $(e.target).is('span');
					var isBoldTag = $(e.target).is('b');
					if(!isSpan && !isBoldTag)
						return;
					var isCurrentPartially
					//AA1:Fix to make seamless behavior for partial: On click of Select All "partial"  then always show next icon as selected. 
					if($(this).hasClass('partial')){
						$(this).removeClass('partial').removeClass('selected');
						TheUL.children('li').filter(":visible").trigger('select');
						$(this).addClass('selected');
					}
					else if(TheUL.children('li[class="selected"]').filter(":visible").length > 0 || TheUL.children('li[class="partial"]').filter(":visible").length > 0)
					{
						TheUL.children('li').filter(":visible").trigger('deselect');
						$(this).removeClass('selected partial');
					}
					else
					{
						TheUL.children('li').filter(":visible").trigger('select');
						$(this).addClass('selected');
					}
					
				});
			}

			TheList.append(TheUL);
			//AA1:Fix to hide select all on reload 
			 if(TheUL.children('li').filter(':visible').length<=0){
				 selectAllLi.hide();
			 }
			//AA1: To adujst select all icon based on exiting selection or based on parent selection change
			var adjustSelectAllIcon = function(){
				
				if(TheUL.find('li.selected').length==TheUL.children('li').filter(":visible").length)
				{
					SelUL.find('li').removeClass('partial');
					SelUL.find('li').addClass('selected');
				}
				else if(TheUL.find('li.selected').length==0 && TheUL.find('li.partial').length==0)
				{
					SelUL.find('li').removeClass('selected').removeClass('partial');
				}
				else
					SelUL.find('li').addClass('partial');	
			};

			
			originator.bind(selectEvt, function(e, node){

				var itemsList=ListItemsArr[node.id];
				if(!itemsList)
				{
					var param=opts.urlparam.replace('{id}', node.id);
					itemsList=getSyncJSON(opts.serverurl, param);
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
						if(val.seq)
						{
							$li.attr('seq', val.seq);
						}
						val.element=$li;

						$li.bind('select', $.proxy( function(e){
							//AA1: Fix in case of partial then next should be select instead of deselect
									if((!this.selected) || (this.element.hasClass('partial'))){
										this.element.removeClass('partial');
										this.element.addClass('selected');
										$li.trigger('selected', val);
										this.selected=true;
									}									
									e.stopPropagation();
								}, val)
						);

						$li.bind('deselect', $.proxy( function(e){
									if(this.selected){
										this.element.removeClass('selected partial');
										$li.trigger('deselected', val);
										this.selected=false;
									}
									e.stopPropagation();
								}, val)
						);

						$li.click($.proxy(function(e){
								if(!$(e.target).is('span'))
									return;
								//AA1: Fix in case of partial then next should be select instead of deselect
								if(this.element.hasClass('partial')){
									this.element.trigger('select');
								}else{
								this.element.trigger(this.selected?'deselect':'select');
								}
								//AA1: Code moved to API
								adjustSelectAllIcon();
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
							if(val.partial)
							{
								val.element.addClass('partial');
								$li.trigger('selected', val);
							}
							else
							{
								val.element.addClass('selected');
								$li.trigger('selected', val);
							}
						}

					});
					if(opts.showOriginatorSelectAll)
					{
						var expLink=$('<a class="selectall">+</a>');
						expLink.click(function(){
								if(TheUL.children('li[class="selected"][pid="'+node.id+'"]').length > 0)
									TheUL.children('li[pid="'+node.id+'"]').trigger('deselect');
								else
									TheUL.children('li[pid="'+node.id+'"]').trigger('select');
							}
						);

						if(node.element) node.element.append(expLink);
					}
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
					TheUL.children('li[key="'+key+'"]').slideDown(opts.duration);
					if(opts.showOriginatorSelectAll && node.element)
						node.element.children('a').show();
				});
				
                if(TheUL.children('li').filter(':visible').length>0){
                	selectAllLi.show();
			//AA1: Fix to adjust icon of select all
                	adjustSelectAllIcon();
                }

				if(opts.enableReorder)
					TheUL.reorderLIs();
			});

            originator.bind(deselectEvt, function(e, node){
						
				if(opts.showUnique) {
					itemsList=ListItemsArr[node.id];

					$.each(itemsList, function(key, val) {
					
						if(opts.showUnique)
						{
							itemCount[key]=itemCount[key] - 1;
							if(itemCount[key]==0)
							{
								TheUL.children('li[key="'+key+'"]').trigger('deselect');
								TheUL.children('li[key="'+key+'"]').slideUp(opts.duration, function(){
					                if(TheUL.children('li').filter(':visible').length<=0){
					                	//Fix IR-202918
										selectAllLi.hide();
					                	selectAllLi.removeClass('selected partial');					                	
					                }else{
								//AA1: Fix to adjust icon of select all
					                	adjustSelectAllIcon();
					                }
								});
							}
						}
					});
				}
				else {
	                node.element.children('a').hide();
	                TheUL.children('li[pid="'+node.id+'"]').trigger('deselect');
	                TheUL.children('li[pid="'+node.id+'"]').slideUp(opts.duration, function(){
				//AA1: Fix to adjust icon of select all
		                if(TheUL.children('li').filter(':visible').length<=0){
		                	selectAllLi.hide();
		                }else{
			                	adjustSelectAllIcon();
		                }
					});
				}

            });
        });
    };

})(jQuery);

