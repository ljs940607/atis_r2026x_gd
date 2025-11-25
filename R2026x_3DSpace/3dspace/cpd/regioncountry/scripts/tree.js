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

    var Node = function(id) {
        this.init(id);
    };

    Node.prototype = {
        init: function(id) {
            this.id = id;
            this.children = [];
            this.parent = null;
        },
		
        addChild: function(node) {
            this.children.push(node);
            node.parent = this;
        },

        hasChildren: function() {
            return (this.children.length != 0);
        },
		
		getChildren: function(){
				var node=this;
				var param=this.opts.urlparam;
				
				if(this.id!="ROOT")
					param=param.replace("{id}", this.id);
				else
					param=param.replace("{id}", "");
					
				var data=getSyncJSON(this.opts.serverurl, param);
				var regionDataArray=data.returnValue;
				
				for (i = 0; i < regionDataArray.length; i++) {
					var jObject = regionDataArray[i];
					createAndConnectChild(jObject.id, jObject, node);	
				}
				node.gotChildrenFromServer=true;
		},
		
		expand: function(){


			if(!this.hasChildren() && !this.gotChildrenFromServer)
			{
				this.getChildren();
				this.createDomElements();
			}
			this.expanded=true;
			var ul=this.element.children('ul:first');
			ul.slideDown(this.opts.duration);
			this.getButton().removeClass('closed');
			
			$.each(this.children, function() {

				if(this.selected)
					this.setSelect(this.leaf ? this.selected : this.element.children('div:first').children('span:first').hasClass("selected"), true);
				if(this.expanded && !this.leaf)
					this.expand();
			});
		},
		
		collapse: function(){
			this.expanded=false;
			var ul=this.element.children('ul:first');
			ul.slideUp(this.opts.duration);
			this.getButton().addClass('closed');
		},

		toggle: function(){
			if(this.expanded)
				this.collapse();
			else
				this.expand();
		},
		
/* state: boolean -- true:select,  false:unselect propogate
	propogate: boolean
		true:call select on parents,  
		false: do not call select on parents (when select on child is called from a selection of parent)
*/
		setSelect: function(state, propogate){
			this.selected=state;
			var spanElem=this.element.children('div:first').children('span:first');
			var spanElemPrevClass = spanElem.hasClass("selected");
			if(state)
				spanElem.addClass("selected");
			else
				spanElem.removeClass("selected");

			//leafchildnode, currentnode, both
			var triggerSelectOn=this.opts.triggerSelectOn;
			if(
				((triggerSelectOn=='leafchildnode' || triggerSelectOn=='both') && this.leaf ) ||
				((triggerSelectOn=='currentnode'  || triggerSelectOn=='both') && propogate==true ) // propogate==true -> this is the selected object, current node
			)
			{
				//AA1: Fix: Need to verify if already element is selected/deselected then dont fire trigger select/deselect event for child. If fired then child count logic wont work properly. 
				if(!spanElemPrevClass && state){
					this.TheTree.trigger('selected', this);
				}
				else if(spanElemPrevClass && !state){
					this.TheTree.trigger('deselected', this);
				}
			}
			
			if(!this.leaf && (state || spanElemPrevClass))
			{
				spanElem.removeClass("part-selected");
				$.each(this.children, function(){
					this.setSelect(state, false);
				});
			}

			if(this.parent && propogate)
				this.parent.setParentSelect();
		},

		toggleselect: function(){
			//AA1:Fix to make seamless behavior for partial: On click of Select All "partial"  then always show next icon as selected.
			if(this.element.children('div:first').children('span:first').hasClass("part-selected")){
				this.selected=true;
				this.setSelect(true, true);
			}else{
			this.selected=!this.selected;
			this.setSelect(this.selected, true);
			}
		},

		setParentSelect: function(){
			var sel=false, unsel=false, partsel = false;
			$.each(this.children, function(id, node){
				if(node.selected)
					sel=true;
				if(!node.selected)
					unsel=true;
				if(node.element && node.element.children('div:first').children('span:first').hasClass("part-selected"))
					partsel=true;
			});
			
			var spanElem=this.element.children('div:first').children('span:first');
			
			if((sel && unsel) || partsel)
				{ spanElem.addClass("part-selected"); spanElem.removeClass("selected"); }
			else if(sel)
				{ spanElem.addClass("selected"); spanElem.removeClass("part-selected"); }
			else
				{ spanElem.removeClass("selected"); spanElem.removeClass("part-selected"); }
				
			this.selected=sel;
			
			if(this.parent)
				this.parent.setParentSelect();
		},

		test: function(){
		},

		createDomElements: function() {

			var node=this;
			var ul = node.createUl();

			node.element.append(ul);

			$.each(node.children, function() {
				var $li = node.createLi(this);
				ul.append($li);

				this.element = $li;
				$li.data('node', this);

				$(this.element).click(
						$.proxy(
							function(e) {
								var $target = $(e.target);

								if ($target.is('a.toggler')) 
									this.toggle();
								else if ($target.is('span'))
								{
									if(!this.gotChildrenFromServer && !this.leaf)
										this.expand();
									if(!this.opts.readonly)
									this.toggleselect();
								}

								e.stopPropagation();
							},
							this)
				);
				//AA1: Fix: Dont set select while creating dom as expan logic will repeat set select.
				//if(this.selected && this.leaf) {
					//this.setSelect(this.selected, true);
				//}

				if (this.hasChildren()) {
					this.createDomElements();
				}
			});
		},

		createUl: function(depth) {
			var classes = [];
			classes.push('tree');
			
			var $element = $('<ul />');
			$element.addClass(classes.join(' '));
			return $element;
		},		

		createLi: function(node) {
			var $li;
			if (!node.leaf) {
				$li = node.createFolderLi(node);
			}
			else {
				$li = node.createNodeLi(node);
			}

			return $li;
		},

		createNodeLi: function(node) {
			var $li = $('<li></li>');
			var $div = $('<div></div>');
			if(typeof node.level != 'undefined') {
				$div.addClass(node.level);
			}
			var $span = $('<span key="'+node.data.id+'" class="' + node.name + '" ></span>');
			$span.attr("chosen", node.selected);
			if(typeof node.image != 'undefined') {
				$span.html('<img src="' + node.image + '" alt=""/> ');
			}
			$span.html($span.html() + node.name);
			$div.append($span);
			$li.append($div);
			return $li;
		},

		createFolderLi: function(node) {
			var button_classes = ['toggler'];

			if (! node.is_open) {
				button_classes.push('closed');
			}

			var $li = $('<li></li>');
			var $div = $('<div></div>');
			if(typeof node.level != 'undefined') {
				$div.addClass(node.level);
			}
			var $anc = $('<a class="'+ button_classes.join(' ') +'">@</a>');
			$div.append($anc);
			var $span = $('<span></span>');
			if(typeof node.image != 'undefined') {
				$span.html('<img src="' + node.image + '" alt=""/> ');
			}
			$span.html($span.html() + node.name);
			$div.append($span);
			$li.append($div);

			// todo: add li class in text
			var folder_classes = ['folder'];
			if (! node.is_open) {
				folder_classes.push('closed');
			}
			$li.addClass(folder_classes.join(' '));
			return $li;
		},

        getButton: function() {
            return this.element.children('div:first').children('a.toggler');
        }
	}

	jQuery.fn.tree = function(settings) {
		settings = jQuery.extend({
			duration: 400, //no of milliseconds to animate
			triggerSelectOn: "leafchildnode", //allowed values: leafchildnode, currentnode, both
			serverurl: "getNodes.php",
			urlparam: "nodeID={id}",
			readonly: false,
			expandOnSelect: false			
		}, settings);

		return $(this).each(function(){

			jQuery.extend(Node.prototype, {
				opts: settings,
				TheTree: $(this)
			});
			
			var node=new Node("ROOT");
			node.element=$(this);
			this.start=function(){node.expand();}
		});
	};
	
	function createAndConnectChild(key, val, parentNode)
	{
		var child=new Node(key);
		child.data=val;
		child.name=val.name;
		child.leaf=val.leaf;
		child.expanded=val.expanded;
		child.selected=val.selected;
		child.image=val.image;
		child.level=val.level;
		parentNode.addChild(child);	 
		if(val.hasChild) {
			$.each(val.childs, function(k, v) {
				createAndConnectChild(k, v, child);
			});
			child.gotChildrenFromServer = true;
		}
	}

})(jQuery);	

function getSyncJSON(arg_url, arg_data)
{
	var jsonObj;
	$.ajax({
		async: false,
		dataType: "json",
		url: arg_url,
		data: arg_data,
		type: "POST",
		beforeSend: function (request)
               {
		 addSecureTokenHeader(request);
               },
		success: function(data) {
			jsonObj=data;
		} 
	});

	return jsonObj;
}


