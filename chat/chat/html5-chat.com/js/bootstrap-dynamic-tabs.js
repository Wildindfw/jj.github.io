/*!
 *
 * Bootstrap Dynamic Tabs v1.0.3 (https://github.com/JayrAlencar/bootstrap-dynamic-tabs)
 */

 (function ( $ ) {
 	
 	var tabs = [];
 	$.fn.bootstrapDynamicTabs = function(options) {
 		var settings = $.extend({
            // These are the defaults.K
        }, options );
		this.append($('<ul/>', {class: 'nav nav-tabs'}));
		
 		if(this.find('.tab-content').length===0){
 			this.append($('<div/>', {class: 'tab-content'}));
 		}

		$(document).on('click','ul.nav.nav-tabs li', function(e) {
			e.stopPropagation();

			$(document).trigger( "tabChanged", $.fn.getCurrent() );
		});
 		return this;
 	};

	$.fn.closeAll = function(){
		tabs = [];
		this.find('.nav-tabs').empty();
		this.find('.tab-content').empty();		
	};
	
 	$.fn.addTab = function(options){
 		var settings = $.extend({
            title: '',
            closable: true,
			room:false,
			label:'',
			selected:true
        }, options );

 		if(!settings.id){
 			settings.id = (settings.title);
 		} else{
 			settings.id = (settings.id);
 		}	

 		if(tabs.indexOf(settings.id)>=0){
 			var aba = this.find('.nav-tabs').find('li').find('a[href="#' + settings.id + '"]');
 			aba.tab('show');
 			$(settings.id).tab('show');
 		} else {			
 			tabs.push(settings.id);
 			var btn_close = $('<button/>',{
 				class: 'close',
 				type: 'button'
 			}).text('x').click(function() {
 				var closer = $(this);
				$(document).trigger( "tabClosed", $.fn.getCurrent());
 				var a = closer.parent();
 				var href = a.attr('href');
 				a.parent().remove(); 
 				var ativo = $(href).hasClass('active');
 				$(href).remove();
 				var idx = href.substring(1);
 				tabs.splice(tabs.indexOf(idx),1);
 				if(ativo){
 					$('.nav-tabs li:eq(0) a').tab('show');	
 				}
				$(document).trigger( "tabChanged", $.fn.getCurrent());
 			});			
			if (settings.selected) {
 				this.find('.active').removeClass('active');
			}
 			var ancora = $('<a/>',{
 				href: '#'+settings.id,
 				'data-toggle': 'tab',
				'data-room': settings.room,
				'data-id':settings.id,
				'data-label':settings.label
 			});

 			if(settings.closable){
 				ancora.mousedown(function(e) {
 					if(e.which === 2){
 						var a = $(this);
 						var href = a.attr('href');
 						a.parent().remove(); 
 						var ativo = $(href).hasClass('active');
 						$(href).remove();
 						var idx = href.substring(1);
 						tabs.splice(tabs.indexOf(idx),1);
 						if(ativo){
 							$('.nav-tabs li:eq(0) a').tab('show');	
 						}
 						return false;
 					}
 				});
 			}

 			if(settings.icon){
 				ancora.append($('<i/>').addClass(settings.icon)).append(' ');
 			}
 			if(settings.closable){
 				ancora.append(btn_close);
 			}
 			ancora.append(settings.title);			

			if (settings.selected) {
				this.find('.nav-tabs').append($('<li/>', {class:'active'}).append(ancora));
				this.find('.tab-content').append($('<div/>', {
					class:'tab-pane active',
					id: settings.id
				}));				
			} else {
				this.find('.nav-tabs').append($('<li/>', {class:''}).append(ancora));
				this.find('.tab-content').append($('<div/>', {
					class:'tab-pane ',
					id: settings.id
				}));				
			}

			var pagina = this.find('.tab-content').find('#'+settings.id);
			if(settings.text){
				pagina.text(settings.text);
			}
			if(settings.html){
				pagina.html(settings.html);
			}
			// make it draggable !
			this.find('.nav.nav-tabs').sortable();
		}
		$(document).trigger('tabChanged', $.fn.getCurrent() );
		if (!settings.selected) {
			//$.fn.getCurrent().removeClass('active');
		}
		return this;
	};

	$.fn.getCurrent = function() {
		var active = $("ul.nav.nav-tabs li.active a");
		var o = {id:active.data('id'), room:active.data('room'), label:active.data('label')};
		return o;
	};
	

	$.fn.closeById = function(id){
		var a = this.find('.nav-tabs').find('a[href="#'+id+'"]');
		var href = a.attr('href');
		a.parent().remove(); 
		var ativo = $(href).hasClass('active');
		if (!href) {
			return;
		}
		$(href).remove();
		var idx = href.substring(1);
		tabs.splice(tabs.indexOf(idx),1);
		if(ativo){
			$('.nav-tabs li:eq(0) a').tab('show');	
		}
		$(document).trigger( "tabChanged", $.fn.getCurrent() );
	};

	$.fn.closeActive = function(){
		var a = this.find('.nav-tabs').find('.active').find('a');
		var href = a.attr('href');
		a.parent().remove(); 
		var ativo = $(href).hasClass('active');
		$(href).remove();
		var idx = href.substring(1);
		tabs.splice(tabs.indexOf(idx),1);
		if(ativo){
			$('.nav-tabs li:eq(0) a').tab('show');	
		}
		$(document).trigger( "tabChanged", $.fn.getCurrent() );
	};
}( jQuery ));
